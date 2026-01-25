import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

// Time range configurations
const TIME_RANGES = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
  '12m': 365,
  'all': null
} as const

type TimeRange = keyof typeof TIME_RANGES

function getDateRange(range: TimeRange): { start: Date | null; previousStart: Date | null } {
  const days = TIME_RANGES[range]
  if (!days) {
    return { start: null, previousStart: null }
  }

  const now = new Date()
  const start = new Date(now)
  start.setDate(start.getDate() - days)

  const previousStart = new Date(start)
  previousStart.setDate(previousStart.getDate() - days)

  return { start, previousStart }
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  if (minutes < 60) return `${minutes}m ${remainingSeconds}s`
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return `${hours}h ${remainingMinutes}m`
}

function calculateTrend(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return Math.round(((current - previous) / previous) * 100)
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const supabase = await createServerSupabaseClient()
    const { courseId } = await params
    const range = (request.nextUrl.searchParams.get('range') || '30d') as TimeRange

    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify instructor owns this course
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id, title, instructor_id, price, average_rating, total_ratings')
      .eq('id', courseId)
      .single()

    if (courseError || !course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    if (course.instructor_id !== user.id) {
      // Check if user is admin
      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

      if (!profile || profile.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    const { start: rangeStart, previousStart } = getDateRange(range)

    // ============================================
    // STATS QUERIES
    // ============================================

    // Current period enrollments
    let enrollmentsQuery = supabase
      .from('enrollments')
      .select('id, enrolled_at, progress_percentage, completed_at', { count: 'exact' })
      .eq('course_id', courseId)

    if (rangeStart) {
      enrollmentsQuery = enrollmentsQuery.gte('enrolled_at', rangeStart.toISOString())
    }

    const { data: currentEnrollments, count: totalStudents } = await enrollmentsQuery

    // Previous period enrollments (for trend)
    let previousStudents = 0
    if (previousStart && rangeStart) {
      const { count } = await supabase
        .from('enrollments')
        .select('id', { count: 'exact', head: true })
        .eq('course_id', courseId)
        .gte('enrolled_at', previousStart.toISOString())
        .lt('enrolled_at', rangeStart.toISOString())
      previousStudents = count || 0
    }

    // Revenue from payments
    let revenueQuery = supabase
      .from('payments')
      .select('amount')
      .eq('course_id', courseId)
      .eq('status', 'completed')

    if (rangeStart) {
      revenueQuery = revenueQuery.gte('created_at', rangeStart.toISOString())
    }

    const { data: payments } = await revenueQuery
    const totalRevenue = payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0

    // Previous period revenue
    let previousRevenue = 0
    if (previousStart && rangeStart) {
      const { data: prevPayments } = await supabase
        .from('payments')
        .select('amount')
        .eq('course_id', courseId)
        .eq('status', 'completed')
        .gte('created_at', previousStart.toISOString())
        .lt('created_at', rangeStart.toISOString())
      previousRevenue = prevPayments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0
    }

    // Reviews and ratings
    let reviewsQuery = supabase
      .from('reviews')
      .select('rating, content, created_at, user_id')
      .eq('course_id', courseId)

    if (rangeStart) {
      reviewsQuery = reviewsQuery.gte('created_at', rangeStart.toISOString())
    }

    const { data: reviews } = await reviewsQuery
    const avgRating = reviews && reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : course.average_rating || 0

    // Previous period rating
    let previousRating = avgRating
    if (previousStart && rangeStart) {
      const { data: prevReviews } = await supabase
        .from('reviews')
        .select('rating')
        .eq('course_id', courseId)
        .gte('created_at', previousStart.toISOString())
        .lt('created_at', rangeStart.toISOString())
      if (prevReviews && prevReviews.length > 0) {
        previousRating = prevReviews.reduce((sum, r) => sum + r.rating, 0) / prevReviews.length
      }
    }

    // Lesson progress for views and completion
    let progressQuery = supabase
      .from('lesson_progress')
      .select('id, watch_time_seconds, is_completed, lesson_id')
      .eq('course_id', courseId)

    if (rangeStart) {
      progressQuery = progressQuery.gte('started_at', rangeStart.toISOString())
    }

    const { data: lessonProgressData, count: totalViews } = await progressQuery

    // Previous period views
    let previousViews = 0
    if (previousStart && rangeStart) {
      const { count } = await supabase
        .from('lesson_progress')
        .select('id', { count: 'exact', head: true })
        .eq('course_id', courseId)
        .gte('started_at', previousStart.toISOString())
        .lt('started_at', rangeStart.toISOString())
      previousViews = count || 0
    }

    // Calculate completion rate
    const completedLessons = lessonProgressData?.filter(p => p.is_completed).length || 0
    const completionRate = lessonProgressData && lessonProgressData.length > 0
      ? Math.round((completedLessons / lessonProgressData.length) * 100)
      : 0

    // Average watch time
    const totalWatchTime = lessonProgressData?.reduce((sum, p) => sum + (p.watch_time_seconds || 0), 0) || 0
    const avgWatchTime = lessonProgressData && lessonProgressData.length > 0
      ? formatDuration(Math.round(totalWatchTime / lessonProgressData.length))
      : '0m'

    // ============================================
    // ENROLLMENT CHART DATA (weekly aggregation)
    // ============================================

    const { data: allEnrollments } = await supabase
      .from('enrollments')
      .select('enrolled_at')
      .eq('course_id', courseId)
      .order('enrolled_at', { ascending: true })

    const enrollmentData: Array<{ date: string; enrollments: number; revenue: number }> = []

    if (allEnrollments) {
      // Group by week
      const weeks = new Map<string, { enrollments: number; revenue: number }>()

      for (const enrollment of allEnrollments) {
        const date = new Date(enrollment.enrolled_at)
        // Get week start (Sunday)
        const weekStart = new Date(date)
        weekStart.setDate(date.getDate() - date.getDay())
        const weekKey = weekStart.toISOString().split('T')[0]

        const current = weeks.get(weekKey) || { enrollments: 0, revenue: 0 }
        current.enrollments++
        current.revenue += Number(course.price) || 0
        weeks.set(weekKey, current)
      }

      // Convert to array and filter by range
      for (const [date, data] of weeks.entries()) {
        if (!rangeStart || new Date(date) >= rangeStart) {
          enrollmentData.push({
            date,
            enrollments: data.enrollments,
            revenue: data.revenue
          })
        }
      }

      // Sort by date
      enrollmentData.sort((a, b) => a.date.localeCompare(b.date))
    }

    // ============================================
    // LESSON PERFORMANCE
    // ============================================

    const { data: lessons } = await supabase
      .from('lessons')
      .select('id, title, video_duration_seconds')
      .eq('course_id', courseId)
      .order('display_order', { ascending: true })

    const lessonPerformance = await Promise.all(
      (lessons || []).map(async (lesson) => {
        // Get progress for this lesson
        let lpQuery = supabase
          .from('lesson_progress')
          .select('id, watch_time_seconds, is_completed')
          .eq('lesson_id', lesson.id)

        if (rangeStart) {
          lpQuery = lpQuery.gte('started_at', rangeStart.toISOString())
        }

        const { data: progress } = await lpQuery

        const views = progress?.length || 0
        const completed = progress?.filter(p => p.is_completed).length || 0
        const lessonCompletionRate = views > 0
          ? Math.round((completed / views) * 100)
          : 0

        const lessonTotalWatch = progress?.reduce((sum, p) => sum + (p.watch_time_seconds || 0), 0) || 0
        const lessonAvgDuration = views > 0
          ? formatDuration(Math.round(lessonTotalWatch / views))
          : formatDuration(lesson.video_duration_seconds || 0)

        return {
          title: lesson.title,
          views,
          completionRate: lessonCompletionRate,
          avgDuration: lessonAvgDuration
        }
      })
    )

    // ============================================
    // RECENT ENROLLMENTS
    // ============================================

    const { data: recentEnrollmentsData } = await supabase
      .from('enrollments')
      .select(`
        id,
        enrolled_at,
        users:user_id (
          full_name,
          avatar_url
        )
      `)
      .eq('course_id', courseId)
      .order('enrolled_at', { ascending: false })
      .limit(5)

    const recentEnrollments = (recentEnrollmentsData || []).map(e => {
      // Handle Supabase join which can return object or array
      const userData = Array.isArray(e.users) ? e.users[0] : e.users
      return {
        id: e.id,
        user: {
          name: userData?.full_name || 'Unknown',
          avatar: userData?.avatar_url || null
        },
        date: e.enrolled_at,
        source: 'Direct' // Would need tracking to get real source
      }
    })

    // ============================================
    // RECENT REVIEWS
    // ============================================

    const { data: recentReviewsData } = await supabase
      .from('reviews')
      .select(`
        id,
        rating,
        content,
        created_at,
        users:user_id (
          full_name,
          avatar_url
        )
      `)
      .eq('course_id', courseId)
      .order('created_at', { ascending: false })
      .limit(3)

    const recentReviews = (recentReviewsData || []).map(r => {
      // Handle Supabase join which can return object or array
      const userData = Array.isArray(r.users) ? r.users[0] : r.users
      return {
        id: r.id,
        user: {
          name: userData?.full_name || 'Unknown',
          avatar: userData?.avatar_url || null
        },
        rating: r.rating,
        comment: r.content,
        date: r.created_at
      }
    })

    // ============================================
    // TRAFFIC SOURCES (mock data - would need tracking)
    // ============================================

    const trafficSources = [
      { source: 'Direct', percentage: 45, color: '#3b82f6' },
      { source: 'Search', percentage: 30, color: '#10b981' },
      { source: 'Social', percentage: 15, color: '#8b5cf6' },
      { source: 'Referral', percentage: 10, color: '#f59e0b' }
    ]

    // ============================================
    // GEOGRAPHIC DATA (mock data - would need IP tracking)
    // ============================================

    const geographicData = [
      { country: 'United States', students: Math.round((totalStudents || 0) * 0.35), percentage: 35 },
      { country: 'India', students: Math.round((totalStudents || 0) * 0.20), percentage: 20 },
      { country: 'United Kingdom', students: Math.round((totalStudents || 0) * 0.12), percentage: 12 },
      { country: 'Canada', students: Math.round((totalStudents || 0) * 0.08), percentage: 8 },
      { country: 'Germany', students: Math.round((totalStudents || 0) * 0.06), percentage: 6 }
    ]

    // ============================================
    // BUILD RESPONSE
    // ============================================

    const analyticsData = {
      course: {
        id: course.id,
        title: course.title
      },
      stats: {
        totalStudents: totalStudents || 0,
        studentsTrend: calculateTrend(totalStudents || 0, previousStudents),
        totalRevenue,
        revenueTrend: calculateTrend(totalRevenue, previousRevenue),
        avgRating: Math.round(avgRating * 10) / 10,
        ratingTrend: calculateTrend(avgRating, previousRating),
        totalViews: totalViews || 0,
        viewsTrend: calculateTrend(totalViews || 0, previousViews),
        completionRate,
        avgWatchTime,
        totalReviews: reviews?.length || 0,
        engagementRate: totalStudents && totalViews
          ? Math.round((totalViews / totalStudents) * 100)
          : 0
      },
      enrollmentData,
      lessonPerformance,
      recentEnrollments,
      recentReviews,
      trafficSources,
      geographicData
    }

    return NextResponse.json(analyticsData)
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
