import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createServerSupabaseAdmin } from '@/lib/supabase/server'

// Mock data fallback when Supabase not configured
const MOCK_COURSES = [
  {
    id: '1',
    title: 'Complete AI & Machine Learning Bootcamp 2024',
    thumbnail: '/course-ai.jpg',
    instructor: 'Dr. Alex Turner',
    category: 'AI & Machine Learning',
    totalVideos: 45,
    totalDuration: '32h 15m',
    enrolledStudents: 2450,
    rating: 4.9,
    reviews: 892,
    price: 199,
    revenue: 489550,
    status: 'published',
    visibility: 'public',
    createdAt: '2024-01-15',
    lastUpdated: '2 days ago',
    completionRate: 78
  },
  {
    id: '2',
    title: 'Advanced React & Next.js Development',
    thumbnail: '/course-react.jpg',
    instructor: 'Maria Santos',
    category: 'Web Development',
    totalVideos: 62,
    totalDuration: '48h 30m',
    enrolledStudents: 3890,
    rating: 4.8,
    reviews: 1245,
    price: 149,
    revenue: 579610,
    status: 'published',
    visibility: 'public',
    createdAt: '2023-11-20',
    lastUpdated: '1 week ago',
    completionRate: 82
  },
]

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

// Helper to calculate relative time
function getRelativeTime(date: string): string {
  const now = new Date()
  const past = new Date(date)
  const diffMs = now.getTime() - past.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)
  const diffWeeks = Math.floor(diffDays / 7)
  const diffMonths = Math.floor(diffDays / 30)

  if (diffHours < 1) return 'Just now'
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`
  return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`
}

// Helper to format duration
function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

// GET - List all courses
export async function GET(request: NextRequest) {
  try {
    // Return mock data if Supabase not configured
    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        courses: MOCK_COURSES,
        stats: {
          totalCourses: MOCK_COURSES.length,
          publishedCourses: MOCK_COURSES.filter(c => c.status === 'published').length,
          totalStudents: MOCK_COURSES.reduce((sum, c) => sum + c.enrolledStudents, 0),
          totalRevenue: MOCK_COURSES.reduce((sum, c) => sum + c.revenue, 0),
          totalVideos: MOCK_COURSES.reduce((sum, c) => sum + c.totalVideos, 0),
        },
        categories: [...new Set(MOCK_COURSES.map(c => c.category))],
        total: MOCK_COURSES.length,
        limit: 50,
        offset: 0,
      })
    }

    // Dev auth bypass for testing
    const isDevBypass = process.env.NODE_ENV === 'development' && process.env.DEV_AUTH_BYPASS === 'true'

    // Use admin client in dev bypass mode to bypass RLS
    const supabase = isDevBypass
      ? await createServerSupabaseAdmin()
      : await createServerSupabaseClient()

    // Verify admin authentication (skip in dev bypass mode)
    if (!isDevBypass) {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      // Check if user is admin
      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

      if (!profile || profile.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
      }
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || 'all'
    const category = searchParams.get('category') || 'all'
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build query for courses with instructor and category info
    let query = supabase
      .from('courses')
      .select(`
        id,
        title,
        slug,
        description,
        thumbnail_url,
        price,
        category_id,
        level,
        status,
        average_rating,
        total_ratings,
        created_at,
        updated_at,
        instructor:users!courses_instructor_id_fkey (
          id,
          full_name,
          avatar_url
        ),
        category:categories!courses_category_id_fkey (
          id,
          name
        )
      `, { count: 'exact' })
      .order('created_at', { ascending: false })

    // Apply filters
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    if (status !== 'all') {
      query = query.eq('status', status)
    }

    if (category !== 'all') {
      query = query.eq('category_id', category)
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data: courses, error, count } = await query

    if (error) {
      throw error
    }

    // Get enrollment counts and lesson counts for all courses
    const courseIds = courses?.map(c => c.id) || []

    // Get enrollment counts
    const enrollmentCounts: Record<string, number> = {}
    if (courseIds.length > 0) {
      const { data: enrollments } = await supabase
        .from('enrollments')
        .select('course_id')
        .in('course_id', courseIds)

      for (const enrollment of enrollments || []) {
        enrollmentCounts[enrollment.course_id] = (enrollmentCounts[enrollment.course_id] || 0) + 1
      }
    }

    // Get lesson counts and total duration per course
    const lessonStats: Record<string, { count: number; duration: number }> = {}
    if (courseIds.length > 0) {
      const { data: lessons } = await supabase
        .from('lessons')
        .select('course_id, video_duration_seconds')
        .in('course_id', courseIds)

      for (const lesson of lessons || []) {
        if (!lessonStats[lesson.course_id]) {
          lessonStats[lesson.course_id] = { count: 0, duration: 0 }
        }
        lessonStats[lesson.course_id].count++
        lessonStats[lesson.course_id].duration += lesson.video_duration_seconds || 0
      }
    }

    // Get review counts
    const reviewCounts: Record<string, number> = {}
    if (courseIds.length > 0) {
      const { data: reviews } = await supabase
        .from('reviews')
        .select('course_id')
        .in('course_id', courseIds)

      for (const review of reviews || []) {
        reviewCounts[review.course_id] = (reviewCounts[review.course_id] || 0) + 1
      }
    }

    // Get revenue from payments
    const revenueByCoourse: Record<string, number> = {}
    if (courseIds.length > 0) {
      const { data: payments } = await supabase
        .from('payments')
        .select('course_id, amount')
        .in('course_id', courseIds)
        .eq('status', 'completed')

      for (const payment of payments || []) {
        revenueByCoourse[payment.course_id] = (revenueByCoourse[payment.course_id] || 0) + Number(payment.amount)
      }
    }

    // Get all categories from the categories table
    const { data: allCategories } = await supabase
      .from('categories')
      .select('id, name')
      .order('name')

    const categories = (allCategories || []).map(c => ({ id: c.id, name: c.name }))

    // Transform courses to match UI expectations
    const transformedCourses = courses?.map(course => {
      // Handle Supabase returning nested data as array or object
      const instructorData = Array.isArray(course.instructor) ? course.instructor[0] : course.instructor
      const stats = lessonStats[course.id] || { count: 0, duration: 0 }
      const enrollments = enrollmentCounts[course.id] || 0

      // Handle category data from join
      const categoryData = Array.isArray(course.category) ? course.category[0] : course.category

      // Map database status to UI status
      const uiStatus = course.status || 'draft'

      return {
        id: course.id,
        title: course.title,
        slug: course.slug,
        thumbnail: course.thumbnail_url,
        instructor: instructorData?.full_name || 'Unknown Instructor',
        instructorId: instructorData?.id,
        category: categoryData?.name || 'Uncategorized',
        totalVideos: stats.count,
        totalDuration: formatDuration(stats.duration),
        enrolledStudents: enrollments,
        rating: course.average_rating || 0,
        reviews: reviewCounts[course.id] || course.total_ratings || 0,
        price: course.price || 0,
        revenue: revenueByCoourse[course.id] || 0,
        status: uiStatus,
        visibility: course.status === 'published' ? 'public' : 'private',
        createdAt: course.created_at?.split('T')[0] || '',
        lastUpdated: getRelativeTime(course.updated_at || course.created_at),
        completionRate: 0, // Would need to calculate from lesson_progress
      }
    }) || []

    // Calculate stats
    const stats = {
      totalCourses: count || 0,
      publishedCourses: transformedCourses.filter(c => c.status === 'published').length,
      totalStudents: Object.values(enrollmentCounts).reduce((sum, count) => sum + count, 0),
      totalRevenue: Object.values(revenueByCoourse).reduce((sum, amount) => sum + amount, 0),
      totalVideos: Object.values(lessonStats).reduce((sum, stats) => sum + stats.count, 0),
    }

    return NextResponse.json({
      courses: transformedCourses,
      stats,
      categories,
      total: count,
      limit,
      offset,
    })

  } catch (error) {
    console.error('Courses fetch error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch courses' },
      { status: 500 }
    )
  }
}
