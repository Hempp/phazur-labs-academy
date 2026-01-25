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

// GET - Fetch course details by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      )
    }

    const supabase = await createServerSupabaseAdmin()

    // Fetch course with instructor info - using correct column names from schema
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select(`
        id,
        slug,
        title,
        description,
        subtitle,
        thumbnail_url,
        preview_video_url,
        price,
        sale_price,
        level,
        category_id,
        tags,
        language,
        status,
        total_lessons,
        total_duration_minutes,
        what_you_will_learn,
        requirements,
        created_at,
        updated_at,
        instructor_id,
        users!courses_instructor_id_fkey (
          id,
          full_name,
          avatar_url,
          bio
        ),
        categories!courses_category_id_fkey (
          id,
          slug,
          name
        )
      `)
      .eq('slug', slug)
      .single()

    if (courseError || !course) {
      console.error('Course fetch error:', courseError)
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    // Fetch modules with lessons
    const { data: modules, error: modulesError } = await supabase
      .from('modules')
      .select(`
        id,
        title,
        description,
        display_order,
        lessons (
          id,
          title,
          content_type,
          video_duration_seconds,
          display_order,
          is_free_preview
        )
      `)
      .eq('course_id', course.id)
      .order('display_order')

    if (modulesError) {
      console.error('Modules fetch error:', modulesError)
    }

    // Sort lessons within each module
    const sortedModules = (modules || []).map(module => ({
      ...module,
      lessons: (module.lessons || []).sort((a: { display_order: number }, b: { display_order: number }) =>
        a.display_order - b.display_order
      )
    }))

    // Fetch course stats (enrollments, reviews)
    const { data: enrollmentStats } = await supabase
      .from('enrollments')
      .select('id', { count: 'exact' })
      .eq('course_id', course.id)

    const { data: reviewStats } = await supabase
      .from('reviews')
      .select('rating')
      .eq('course_id', course.id)

    // Calculate average rating
    const reviews = reviewStats || []
    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 4.5 // Default rating

    // Fetch recent reviews
    const { data: recentReviews } = await supabase
      .from('reviews')
      .select(`
        id,
        rating,
        content,
        created_at,
        users (
          full_name,
          avatar_url
        )
      `)
      .eq('course_id', course.id)
      .order('created_at', { ascending: false })
      .limit(5)

    // Calculate totals from modules
    let totalLessons = 0
    let totalDurationSeconds = 0
    sortedModules.forEach(module => {
      totalLessons += module.lessons.length
      module.lessons.forEach((lesson: { video_duration_seconds: number | null }) => {
        totalDurationSeconds += lesson.video_duration_seconds || 0
      })
    })

    // Format response
    const response = {
      id: course.id,
      slug: course.slug,
      title: course.title,
      subtitle: course.subtitle || course.description?.slice(0, 150),
      description: course.description,
      thumbnailUrl: course.thumbnail_url,
      previewVideoUrl: course.preview_video_url,
      price: course.price,
      discountPrice: course.sale_price,
      level: course.level,
      category: (() => {
        // Handle Supabase returning categories as array or object
        const cat = Array.isArray(course.categories) ? course.categories[0] : course.categories
        return cat?.slug || 'development'
      })(),
      tags: course.tags || [],
      language: course.language || 'English',
      status: course.status,
      totalLessons: totalLessons || course.total_lessons || 0,
      totalDurationMinutes: Math.round(totalDurationSeconds / 60) || course.total_duration_minutes || 0,
      learningOutcomes: course.what_you_will_learn || [],
      prerequisites: course.requirements || [],
      createdAt: course.created_at,
      updatedAt: course.updated_at,
      instructor: (() => {
        // Handle Supabase returning users as array or object
        const instructor = Array.isArray(course.users) ? course.users[0] : course.users
        return instructor ? {
          id: instructor.id,
          name: instructor.full_name,
          avatar: instructor.avatar_url,
          bio: instructor.bio,
        } : null
      })(),
      modules: sortedModules.map((m, index) => ({
        id: m.id,
        title: m.title,
        description: m.description,
        subtitle: `Module ${index + 1}`,
        lessonsCount: m.lessons.length,
        duration: `${Math.ceil(m.lessons.length / 2)} weeks`,
        lessons: m.lessons.map((l: {
          id: string
          title: string
          content_type: string
          video_duration_seconds: number | null
          is_free_preview: boolean
        }) => ({
          id: l.id,
          title: l.title,
          type: l.content_type,
          durationMinutes: l.video_duration_seconds ? Math.ceil(l.video_duration_seconds / 60) : 0,
          isFreePreview: l.is_free_preview,
        })),
      })),
      stats: {
        enrolledCount: enrollmentStats?.length || 0,
        reviewCount: reviews.length,
        rating: Math.round(avgRating * 10) / 10,
      },
      reviews: (recentReviews || []).map(r => ({
        id: r.id,
        rating: r.rating,
        content: r.content,
        createdAt: r.created_at,
        user: (() => {
          // Handle Supabase returning users as array or object
          const reviewer = Array.isArray(r.users) ? r.users[0] : r.users
          return reviewer ? {
            name: reviewer.full_name,
            avatar: reviewer.avatar_url,
          } : null
        })(),
      })),
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Course fetch error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch course' },
      { status: 500 }
    )
  }
}
