import { NextResponse } from 'next/server'
import { createServerSupabaseClient, createServerSupabaseAdmin } from '@/lib/supabase/server'

// Mock data fallback when Supabase not configured
const MOCK_DASHBOARD = {
  stats: {
    totalStudents: 156,
    activeStudents: 142,
    publishedCourses: 12,
    totalCompletions: 89,
    monthlyRevenue: 24500,
    averageCompletionRate: 78,
  },
  topCourses: [
    { id: '1', title: 'Complete AI Bootcamp', enrollments: 245, revenue: 48755, rating: 4.9 },
    { id: '2', title: 'Advanced React', enrollments: 189, revenue: 28161, rating: 4.8 },
    { id: '3', title: 'Python Masterclass', enrollments: 156, revenue: 23244, rating: 4.7 },
  ],
  recentEnrollments: [
    { id: '1', studentName: 'Sarah Johnson', courseName: 'Complete AI Bootcamp', enrolledAt: '2024-01-20', progress: 45 },
    { id: '2', studentName: 'Michael Chen', courseName: 'Advanced React', enrolledAt: '2024-01-19', progress: 67 },
    { id: '3', studentName: 'Emily Davis', courseName: 'Python Masterclass', enrolledAt: '2024-01-18', progress: 23 },
  ],
  recentActivities: [
    { id: '1', type: 'enrollment', description: 'Sarah Johnson enrolled in Complete AI Bootcamp', timestamp: '2 hours ago' },
    { id: '2', type: 'completion', description: 'Michael Chen completed Advanced React', timestamp: '5 hours ago' },
    { id: '3', type: 'review', description: 'Emily Davis left a 5-star review', timestamp: '1 day ago' },
  ],
  engagementData: [
    { date: 'Mon', activeStudents: 120 },
    { date: 'Tue', activeStudents: 135 },
    { date: 'Wed', activeStudents: 142 },
    { date: 'Thu', activeStudents: 128 },
    { date: 'Fri', activeStudents: 156 },
    { date: 'Sat', activeStudents: 98 },
    { date: 'Sun', activeStudents: 87 },
  ],
}

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

  if (diffHours < 1) return 'Just now'
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`
}

export async function GET() {
  try {
    // Return mock data if Supabase not configured
    if (!isSupabaseConfigured()) {
      return NextResponse.json(MOCK_DASHBOARD)
    }

    // Dev auth bypass for testing
    const isDevBypass = process.env.NODE_ENV === 'development' && process.env.DEV_AUTH_BYPASS === 'true'

    const supabase = isDevBypass
      ? await createServerSupabaseAdmin()
      : await createServerSupabaseClient()

    // Verify admin authentication (skip in dev bypass mode)
    if (!isDevBypass) {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

      if (!profile || profile.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
      }
    }

    // Get total students count
    const { count: totalStudents } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'student')

    // Get active students count
    const { count: activeStudents } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'student')
      .eq('is_active', true)

    // Get published courses count
    const { count: publishedCourses } = await supabase
      .from('courses')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published')

    // Get total completions (enrollments with completed status)
    const { count: totalCompletions } = await supabase
      .from('enrollments')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed')

    // Get monthly revenue (payments from last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { data: monthlyPayments } = await supabase
      .from('payments')
      .select('amount')
      .eq('status', 'completed')
      .gte('created_at', thirtyDaysAgo.toISOString())

    const monthlyRevenue = monthlyPayments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0

    // Calculate average completion rate
    const { data: allEnrollments } = await supabase
      .from('enrollments')
      .select('progress_percentage')

    const averageCompletionRate = allEnrollments && allEnrollments.length > 0
      ? Math.round(allEnrollments.reduce((sum, e) => sum + (e.progress_percentage || 0), 0) / allEnrollments.length)
      : 0

    // Get top courses by enrollment
    const { data: courses } = await supabase
      .from('courses')
      .select('id, title, average_rating')
      .eq('status', 'published')

    const courseIds = courses?.map(c => c.id) || []

    // Get enrollment counts per course
    const enrollmentCounts: Record<string, number> = {}
    if (courseIds.length > 0) {
      const { data: enrollments } = await supabase
        .from('enrollments')
        .select('course_id')
        .in('course_id', courseIds)

      for (const e of enrollments || []) {
        enrollmentCounts[e.course_id] = (enrollmentCounts[e.course_id] || 0) + 1
      }
    }

    // Get revenue per course
    const revenueByCourse: Record<string, number> = {}
    if (courseIds.length > 0) {
      const { data: payments } = await supabase
        .from('payments')
        .select('course_id, amount')
        .in('course_id', courseIds)
        .eq('status', 'completed')

      for (const p of payments || []) {
        revenueByCourse[p.course_id] = (revenueByCourse[p.course_id] || 0) + Number(p.amount)
      }
    }

    // Build top courses array and sort by enrollments
    const topCourses = (courses || [])
      .map(c => ({
        id: c.id,
        title: c.title,
        enrollments: enrollmentCounts[c.id] || 0,
        revenue: revenueByCourse[c.id] || 0,
        rating: c.average_rating || 0,
      }))
      .sort((a, b) => b.enrollments - a.enrollments)
      .slice(0, 5)

    // Get recent enrollments with student and course details
    const { data: recentEnrollmentsData } = await supabase
      .from('enrollments')
      .select(`
        id,
        progress_percentage,
        enrolled_at,
        user:users!enrollments_user_id_fkey (
          full_name
        ),
        course:courses!enrollments_course_id_fkey (
          title
        )
      `)
      .order('enrolled_at', { ascending: false })
      .limit(5)

    const recentEnrollments = (recentEnrollmentsData || []).map(e => {
      const userData = Array.isArray(e.user) ? e.user[0] : e.user
      const courseData = Array.isArray(e.course) ? e.course[0] : e.course
      return {
        id: e.id,
        studentName: userData?.full_name || 'Unknown Student',
        courseName: courseData?.title || 'Unknown Course',
        enrolledAt: e.enrolled_at?.split('T')[0] || '',
        progress: e.progress_percentage || 0,
      }
    })

    // Build recent activities from various sources
    const recentActivities: Array<{ id: string; type: string; description: string; timestamp: string }> = []

    // Add recent enrollments as activities
    for (const e of recentEnrollments.slice(0, 2)) {
      recentActivities.push({
        id: `enrollment-${e.id}`,
        type: 'enrollment',
        description: `${e.studentName} enrolled in ${e.courseName}`,
        timestamp: getRelativeTime(e.enrolledAt),
      })
    }

    // Add recent completions as activities
    const { data: recentCompletions } = await supabase
      .from('enrollments')
      .select(`
        id,
        updated_at,
        user:users!enrollments_user_id_fkey (full_name),
        course:courses!enrollments_course_id_fkey (title)
      `)
      .eq('status', 'completed')
      .order('updated_at', { ascending: false })
      .limit(2)

    for (const c of recentCompletions || []) {
      const userData = Array.isArray(c.user) ? c.user[0] : c.user
      const courseData = Array.isArray(c.course) ? c.course[0] : c.course
      recentActivities.push({
        id: `completion-${c.id}`,
        type: 'completion',
        description: `${userData?.full_name || 'A student'} completed ${courseData?.title || 'a course'}`,
        timestamp: getRelativeTime(c.updated_at || ''),
      })
    }

    // Add recent reviews as activities
    const { data: recentReviews } = await supabase
      .from('reviews')
      .select(`
        id,
        rating,
        created_at,
        user:users!reviews_user_id_fkey (full_name)
      `)
      .order('created_at', { ascending: false })
      .limit(2)

    for (const r of recentReviews || []) {
      const userData = Array.isArray(r.user) ? r.user[0] : r.user
      recentActivities.push({
        id: `review-${r.id}`,
        type: 'review',
        description: `${userData?.full_name || 'A student'} left a ${r.rating}-star review`,
        timestamp: getRelativeTime(r.created_at || ''),
      })
    }

    // Sort activities by most recent (approximate since we're using relative time)
    recentActivities.slice(0, 5)

    // Generate engagement data for the last 7 days
    // This would ideally come from a dedicated analytics table
    // For now, we'll estimate based on lesson_progress updates
    const engagementData: Array<{ date: string; activeStudents: number }> = []
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dayStart = new Date(date.setHours(0, 0, 0, 0)).toISOString()
      const dayEnd = new Date(date.setHours(23, 59, 59, 999)).toISOString()

      const { data: dayProgress } = await supabase
        .from('lesson_progress')
        .select('user_id')
        .gte('updated_at', dayStart)
        .lte('updated_at', dayEnd)

      // Count unique users
      const uniqueUsers = new Set(dayProgress?.map(p => p.user_id) || [])

      engagementData.push({
        date: dayNames[new Date(dayStart).getDay()],
        activeStudents: uniqueUsers.size,
      })
    }

    return NextResponse.json({
      stats: {
        totalStudents: totalStudents || 0,
        activeStudents: activeStudents || 0,
        publishedCourses: publishedCourses || 0,
        totalCompletions: totalCompletions || 0,
        monthlyRevenue,
        averageCompletionRate,
      },
      topCourses,
      recentEnrollments,
      recentActivities,
      engagementData,
    })

  } catch (error) {
    console.error('Dashboard fetch error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}
