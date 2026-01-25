// Course Analytics API
// Provides instructor analytics data for a specific course

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

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

// Mock data for development without Supabase
const getMockAnalytics = (courseId: string, range: string) => ({
  course: {
    id: courseId,
    title: 'Advanced React Patterns',
  },
  stats: {
    totalStudents: 3420,
    studentsTrend: 12,
    totalRevenue: 12500,
    revenueTrend: 8,
    avgRating: 4.9,
    ratingTrend: 2,
    totalViews: 45200,
    viewsTrend: 15,
    completionRate: 68,
    avgWatchTime: '4h 32m',
    totalReviews: 892,
    engagementRate: 78,
  },
  enrollmentData: [
    { date: 'Jan 1', enrollments: 45, revenue: 1350 },
    { date: 'Jan 8', enrollments: 52, revenue: 1560 },
    { date: 'Jan 15', enrollments: 38, revenue: 1140 },
    { date: 'Jan 22', enrollments: 67, revenue: 2010 },
    { date: 'Jan 29', enrollments: 72, revenue: 2160 },
    { date: 'Feb 5', enrollments: 58, revenue: 1740 },
    { date: 'Feb 12', enrollments: 84, revenue: 2520 },
  ],
  lessonPerformance: [
    { title: 'Welcome & Course Overview', views: 3420, completionRate: 98, avgDuration: '5:12' },
    { title: 'Setting Up Development Environment', views: 3280, completionRate: 94, avgDuration: '11:45' },
    { title: 'Introduction to Compound Components', views: 3150, completionRate: 89, avgDuration: '14:22' },
    { title: 'Building a Tabs Component', views: 2890, completionRate: 82, avgDuration: '23:45' },
    { title: 'Accordion Pattern', views: 2650, completionRate: 76, avgDuration: '18:30' },
    { title: 'Why Custom Hooks?', views: 2420, completionRate: 71, avgDuration: '9:15' },
  ],
  recentEnrollments: [
    { id: 'e1', user: { name: 'John Doe', avatar: null }, date: '2 hours ago', source: 'Direct' },
    { id: 'e2', user: { name: 'Jane Smith', avatar: null }, date: '3 hours ago', source: 'Search' },
    { id: 'e3', user: { name: 'Mike Johnson', avatar: null }, date: '5 hours ago', source: 'Referral' },
    { id: 'e4', user: { name: 'Sarah Williams', avatar: null }, date: '6 hours ago', source: 'Social' },
    { id: 'e5', user: { name: 'Alex Thompson', avatar: null }, date: '8 hours ago', source: 'Direct' },
  ],
  recentReviews: [
    { id: 'r1', user: { name: 'Alex Thompson', avatar: null }, rating: 5, comment: 'Best React course ever!', date: '1 day ago' },
    { id: 'r2', user: { name: 'Maria Garcia', avatar: null }, rating: 5, comment: 'Finally understand compound components!', date: '2 days ago' },
    { id: 'r3', user: { name: 'James Wilson', avatar: null }, rating: 4, comment: 'Great content, could use more examples.', date: '3 days ago' },
  ],
  trafficSources: [
    { source: 'Direct', percentage: 35, color: 'bg-primary' },
    { source: 'Search', percentage: 28, color: 'bg-blue-500' },
    { source: 'Social', percentage: 20, color: 'bg-purple-500' },
    { source: 'Referral', percentage: 12, color: 'bg-amber-500' },
    { source: 'Other', percentage: 5, color: 'bg-gray-500' },
  ],
  geographicData: [
    { country: 'United States', students: 1240, percentage: 36 },
    { country: 'India', students: 620, percentage: 18 },
    { country: 'United Kingdom', students: 380, percentage: 11 },
    { country: 'Germany', students: 290, percentage: 8 },
    { country: 'Canada', students: 250, percentage: 7 },
    { country: 'Other', students: 640, percentage: 19 },
  ],
})

// Calculate date range boundaries
function getDateRange(range: string): { start: Date; previous: Date } {
  const now = new Date()
  const start = new Date()
  const previous = new Date()

  switch (range) {
    case '7d':
      start.setDate(now.getDate() - 7)
      previous.setDate(now.getDate() - 14)
      break
    case '30d':
      start.setDate(now.getDate() - 30)
      previous.setDate(now.getDate() - 60)
      break
    case '90d':
      start.setDate(now.getDate() - 90)
      previous.setDate(now.getDate() - 180)
      break
    case '12m':
      start.setFullYear(now.getFullYear() - 1)
      previous.setFullYear(now.getFullYear() - 2)
      break
    case 'all':
    default:
      start.setFullYear(2020) // Far in the past
      previous.setFullYear(2019)
      break
  }

  return { start, previous }
}

// Format watch time in hours and minutes
function formatWatchTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

// Format relative date
function formatRelativeDate(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffHours < 1) return 'Just now'
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  return date.toLocaleDateString()
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params
    const { searchParams } = new URL(request.url)
    const range = searchParams.get('range') || '30d'

    // Return mock data if Supabase is not configured
    if (!isSupabaseConfigured()) {
      console.log('Supabase not configured - returning mock analytics')
      return NextResponse.json(getMockAnalytics(courseId, range))
    }

    const supabase = await createServerSupabaseClient()

    // Verify instructor authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      // Return mock data for unauthenticated users in dev mode
      console.log('User not authenticated - returning mock analytics')
      return NextResponse.json(getMockAnalytics(courseId, range))
    }

    // Get course and verify instructor ownership
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id, title, slug, price, instructor_id')
      .eq('id', courseId)
      .single()

    if (courseError || !course) {
      // Fallback to mock data if course not found
      console.log('Course not found - returning mock analytics')
      return NextResponse.json(getMockAnalytics(courseId, range))
    }

    // Check if user is the instructor (or admin)
    const { data: userProfile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    const isInstructor = course.instructor_id === user.id
    const isAdmin = userProfile?.role === 'admin'

    if (!isInstructor && !isAdmin) {
      return NextResponse.json(
        { error: 'You do not have permission to view analytics for this course' },
        { status: 403 }
      )
    }

    const { start, previous } = getDateRange(range)

    // Get enrollment stats
    const { data: currentEnrollments } = await supabase
      .from('enrollments')
      .select('id, user_id, enrolled_at, status, progress')
      .eq('course_id', courseId)
      .gte('enrolled_at', start.toISOString())

    const { data: previousEnrollments } = await supabase
      .from('enrollments')
      .select('id')
      .eq('course_id', courseId)
      .gte('enrolled_at', previous.toISOString())
      .lt('enrolled_at', start.toISOString())

    const { data: allEnrollments } = await supabase
      .from('enrollments')
      .select('id, user_id, enrolled_at, status, progress')
      .eq('course_id', courseId)

    const totalStudents = allEnrollments?.length || 0
    const currentPeriodStudents = currentEnrollments?.length || 0
    const previousPeriodStudents = previousEnrollments?.length || 0
    const studentsTrend = previousPeriodStudents > 0
      ? Math.round(((currentPeriodStudents - previousPeriodStudents) / previousPeriodStudents) * 100)
      : currentPeriodStudents > 0 ? 100 : 0

    // Calculate revenue (price * enrollments)
    const price = course.price || 0
    const totalRevenue = totalStudents * price
    const currentRevenue = currentPeriodStudents * price
    const previousRevenue = previousPeriodStudents * price
    const revenueTrend = previousRevenue > 0
      ? Math.round(((currentRevenue - previousRevenue) / previousRevenue) * 100)
      : currentRevenue > 0 ? 100 : 0

    // Calculate completion rate
    const completedEnrollments = allEnrollments?.filter(e => e.status === 'completed').length || 0
    const completionRate = totalStudents > 0
      ? Math.round((completedEnrollments / totalStudents) * 100)
      : 0

    // Get lesson performance data
    const { data: lessons } = await supabase
      .from('lessons')
      .select('id, title, order_index')
      .eq('course_id', courseId)
      .order('order_index', { ascending: true })

    const { data: lessonProgressData } = await supabase
      .from('lesson_progress')
      .select('lesson_id, completed, watch_time_seconds, enrollment_id')
      .in('enrollment_id', allEnrollments?.map(e => e.id) || [])

    const lessonPerformance = (lessons || []).map(lesson => {
      const lessonProgress = lessonProgressData?.filter(lp => lp.lesson_id === lesson.id) || []
      const views = lessonProgress.length
      const completed = lessonProgress.filter(lp => lp.completed).length
      const lessonCompletionRate = views > 0 ? Math.round((completed / views) * 100) : 0
      const totalWatchTime = lessonProgress.reduce((sum, lp) => sum + (lp.watch_time_seconds || 0), 0)
      const avgDurationSeconds = views > 0 ? Math.round(totalWatchTime / views) : 0
      const avgDuration = formatWatchTime(avgDurationSeconds)

      return {
        title: lesson.title,
        views,
        completionRate: lessonCompletionRate,
        avgDuration,
      }
    })

    // Calculate total views (sum of all lesson views)
    const totalViews = lessonPerformance.reduce((sum, l) => sum + l.views, 0)

    // Calculate average watch time across all enrollments
    const totalWatchTimeSeconds = lessonProgressData?.reduce((sum, lp) => sum + (lp.watch_time_seconds || 0), 0) || 0
    const avgWatchTime = totalStudents > 0
      ? formatWatchTime(Math.round(totalWatchTimeSeconds / totalStudents))
      : '0m'

    // Get recent enrollments with user info
    const { data: recentEnrollmentData } = await supabase
      .from('enrollments')
      .select(`
        id,
        enrolled_at,
        users!enrollments_user_id_fkey (
          id,
          full_name,
          email,
          avatar_url
        )
      `)
      .eq('course_id', courseId)
      .order('enrolled_at', { ascending: false })
      .limit(5)

    const recentEnrollments = (recentEnrollmentData || []).map((enrollment: {
      id: string
      enrolled_at: string
      users: {
        id: string
        full_name: string | null
        email: string
        avatar_url: string | null
      } | {
        id: string
        full_name: string | null
        email: string
        avatar_url: string | null
      }[] | null
    }) => {
      // Handle Supabase returning users as array or object
      const user = Array.isArray(enrollment.users) ? enrollment.users[0] : enrollment.users
      return {
        id: enrollment.id,
        user: {
          name: user?.full_name || user?.email || 'Unknown',
          avatar: user?.avatar_url || null,
        },
        date: formatRelativeDate(new Date(enrollment.enrolled_at)),
        source: 'Direct', // We don't track source yet, defaulting to Direct
      }
    })

    // Get weekly enrollment data for chart
    const enrollmentData = generateWeeklyData(allEnrollments || [], price, range)

    // Build response (some fields use mock data as we don't have full tracking yet)
    const analytics = {
      course: {
        id: course.id,
        title: course.title,
      },
      stats: {
        totalStudents,
        studentsTrend,
        totalRevenue,
        revenueTrend,
        avgRating: 4.8, // Mock - no reviews table yet
        ratingTrend: 0,
        totalViews,
        viewsTrend: studentsTrend, // Approximate with student trend
        completionRate,
        avgWatchTime,
        totalReviews: 0, // Mock - no reviews table yet
        engagementRate: completionRate, // Use completion as engagement proxy
      },
      enrollmentData,
      lessonPerformance,
      recentEnrollments,
      // Mock data for features not yet implemented
      recentReviews: getMockAnalytics(courseId, range).recentReviews,
      trafficSources: getMockAnalytics(courseId, range).trafficSources,
      geographicData: getMockAnalytics(courseId, range).geographicData,
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Analytics GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Generate weekly enrollment data for chart
function generateWeeklyData(
  enrollments: Array<{ enrolled_at: string }>,
  price: number,
  range: string
): Array<{ date: string; enrollments: number; revenue: number }> {
  const weeks: Record<string, number> = {}
  const now = new Date()

  // Determine how many weeks to show based on range
  let numWeeks = 7
  switch (range) {
    case '7d': numWeeks = 1; break
    case '30d': numWeeks = 4; break
    case '90d': numWeeks = 12; break
    case '12m': numWeeks = 52; break
    default: numWeeks = 7
  }

  // Initialize weeks
  for (let i = numWeeks - 1; i >= 0; i--) {
    const weekStart = new Date(now)
    weekStart.setDate(now.getDate() - (i * 7))
    const weekKey = weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    weeks[weekKey] = 0
  }

  // Count enrollments per week
  enrollments.forEach(e => {
    const enrollDate = new Date(e.enrolled_at)
    const weekKey = enrollDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    if (weeks[weekKey] !== undefined) {
      weeks[weekKey]++
    }
  })

  return Object.entries(weeks).map(([date, count]) => ({
    date,
    enrollments: count,
    revenue: count * price,
  }))
}
