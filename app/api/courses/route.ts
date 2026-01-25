import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseAdmin } from '@/lib/supabase/server'

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return !!(
    url && key &&
    !url.includes('placeholder') &&
    !url.includes('your-project') &&
    !key.includes('your-') &&
    key !== 'your-anon-key'
  )
}

// GET - List all published courses
export async function GET(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: 'Database not configured', courses: [] },
        { status: 503 }
      )
    }

    const supabase = await createServerSupabaseAdmin()

    // Parse query params for filtering
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const level = searchParams.get('level')
    const search = searchParams.get('search')

    // Build query - using correct column names from schema
    let query = supabase
      .from('courses')
      .select(`
        id,
        slug,
        title,
        subtitle,
        description,
        thumbnail_url,
        price,
        sale_price,
        level,
        category_id,
        tags,
        total_lessons,
        total_duration_minutes,
        status,
        created_at,
        instructor_id,
        users!courses_instructor_id_fkey (
          id,
          full_name,
          avatar_url
        ),
        categories!courses_category_id_fkey (
          id,
          slug,
          name
        )
      `)
      .eq('status', 'published')
      .order('created_at', { ascending: false })

    // Apply filters
    if (category) {
      // Filter by category slug
      query = query.eq('categories.slug', category)
    }
    if (level) {
      query = query.ilike('level', `%${level}%`)
    }
    if (search) {
      query = query.or(`title.ilike.%${search}%,subtitle.ilike.%${search}%`)
    }

    const { data: courses, error } = await query

    if (error) {
      console.error('Courses fetch error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch courses', courses: [] },
        { status: 500 }
      )
    }

    // Get enrollment counts and reviews for each course
    const coursesWithStats = await Promise.all(
      (courses || []).map(async (course) => {
        // Get enrollment count
        const { count: enrollmentCount } = await supabase
          .from('enrollments')
          .select('id', { count: 'exact', head: true })
          .eq('course_id', course.id)

        // Get review stats
        const { data: reviews } = await supabase
          .from('reviews')
          .select('rating')
          .eq('course_id', course.id)

        const reviewCount = reviews?.length || 0
        const avgRating = reviewCount > 0
          ? reviews!.reduce((sum, r) => sum + r.rating, 0) / reviewCount
          : 4.5

        // Get module count for duration estimate
        const { count: moduleCount } = await supabase
          .from('modules')
          .select('id', { count: 'exact', head: true })
          .eq('course_id', course.id)

        return {
          id: course.id,
          slug: course.slug,
          title: course.title,
          description: course.subtitle || course.description?.slice(0, 150),
          thumbnailUrl: course.thumbnail_url,
          price: course.price,
          discountPrice: course.sale_price,
          level: course.level,
          category: (() => {
            // Handle Supabase returning categories as array or object
            const cat = Array.isArray(course.categories) ? course.categories[0] : course.categories
            return cat?.slug || 'development'
          })(),
          tags: course.tags || [],
          totalLessons: course.total_lessons || 0,
          totalDurationMinutes: course.total_duration_minutes || 0,
          instructor: (() => {
            // Handle Supabase returning users as array or object
            const instructor = Array.isArray(course.users) ? course.users[0] : course.users
            return instructor ? {
              id: instructor.id,
              name: instructor.full_name,
              avatar: instructor.avatar_url,
            } : null
          })(),
          stats: {
            enrolledCount: enrollmentCount || 0,
            reviewCount,
            rating: Math.round(avgRating * 10) / 10,
          },
          // Calculate duration category for filtering
          durationCategory: getDurationCategory(moduleCount || 0),
          badge: 'Professional Certificate',
          hasTrial: true,
        }
      })
    )

    return NextResponse.json({ courses: coursesWithStats })

  } catch (error) {
    console.error('Courses fetch error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch courses', courses: [] },
      { status: 500 }
    )
  }
}

// Helper to categorize course duration
function getDurationCategory(moduleCount: number): string {
  if (moduleCount <= 4) return 'Less than 1 Month'
  if (moduleCount <= 8) return '1-3 Months'
  if (moduleCount <= 12) return '3-6 Months'
  return '6+ Months'
}
