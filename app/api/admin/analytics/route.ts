import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createServerSupabaseAdmin } from '@/lib/supabase/server'

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

function calculateTrend(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return Math.round(((current - previous) / previous) * 100)
}

// Mock data fallback when Supabase not configured
const MOCK_ADMIN_DATA = {
  platformStats: {
    totalUsers: 24850,
    usersTrend: 8,
    activeUsers: 12420,
    activeTrend: 12,
    totalCourses: 186,
    coursesTrend: 5,
    totalRevenue: 892450,
    revenueTrend: 15,
    monthlyRevenue: 78420,
    monthlyTrend: 22,
    pendingPayouts: 12580,
    totalInstructors: 142,
    avgCourseRating: 4.7,
    completionRate: 68,
  },
  revenueData: [
    { month: 'Aug', revenue: 52000 },
    { month: 'Sep', revenue: 58000 },
    { month: 'Oct', revenue: 62000 },
    { month: 'Nov', revenue: 71000 },
    { month: 'Dec', revenue: 68000 },
    { month: 'Jan', revenue: 78420 },
  ],
  userGrowthData: [
    { month: 'Aug', users: 18200 },
    { month: 'Sep', users: 19800 },
    { month: 'Oct', users: 21500 },
    { month: 'Nov', users: 22800 },
    { month: 'Dec', users: 23900 },
    { month: 'Jan', users: 24850 },
  ],
  topCourses: [
    { id: '1', title: 'TypeScript Masterclass', instructor: 'Sarah Chen', students: 5280, revenue: 18900, rating: 4.8 },
    { id: '2', title: 'Advanced React Patterns', instructor: 'Michael Park', students: 3420, revenue: 12500, rating: 4.9 },
    { id: '3', title: 'Node.js Best Practices', instructor: 'David Kim', students: 2150, revenue: 8200, rating: 4.7 },
    { id: '4', title: 'Docker for Developers', instructor: 'Emily Wilson', students: 1890, revenue: 6800, rating: 4.6 },
    { id: '5', title: 'GraphQL Masterclass', instructor: 'James Lee', students: 1650, revenue: 5900, rating: 4.5 },
  ],
  recentUsers: [
    { id: 'u1', name: 'John Doe', email: 'john@example.com', role: 'student', joinedAt: '2 hours ago', avatar: null },
    { id: 'u2', name: 'Jane Smith', email: 'jane@example.com', role: 'instructor', joinedAt: '4 hours ago', avatar: null },
    { id: 'u3', name: 'Mike Johnson', email: 'mike@example.com', role: 'student', joinedAt: '6 hours ago', avatar: null },
    { id: 'u4', name: 'Sarah Williams', email: 'sarah@example.com', role: 'student', joinedAt: '8 hours ago', avatar: null },
    { id: 'u5', name: 'Alex Thompson', email: 'alex@example.com', role: 'instructor', joinedAt: '12 hours ago', avatar: null },
  ],
  pendingApprovals: [
    { id: 'c1', title: 'Machine Learning Basics', instructor: 'Dr. Alan Turing', type: 'course', submittedAt: '1 day ago' },
    { id: 'c2', title: 'UI/UX Design Principles', instructor: 'Lisa Chen', type: 'course', submittedAt: '2 days ago' },
  ],
  categoryDistribution: [
    { name: 'Web Development', count: 52, color: 'bg-primary' },
    { name: 'Data Science', count: 38, color: 'bg-blue-500' },
    { name: 'Mobile Development', count: 28, color: 'bg-purple-500' },
    { name: 'DevOps', count: 24, color: 'bg-amber-500' },
    { name: 'Design', count: 22, color: 'bg-emerald-500' },
    { name: 'Other', count: 22, color: 'bg-gray-500' },
  ],
  systemAlerts: [
    { id: 'a1', type: 'warning', message: 'High server load detected', time: '10 min ago' },
    { id: 'a2', type: 'info', message: 'Scheduled maintenance in 2 days', time: '1 hour ago' },
    { id: 'a3', type: 'success', message: 'Backup completed successfully', time: '3 hours ago' },
  ]
}

export async function GET(request: NextRequest) {
  try {
    const range = (request.nextUrl.searchParams.get('range') || '30d') as TimeRange

    // Dev auth bypass for testing
    const isDevBypass = process.env.NODE_ENV === 'development' && process.env.DEV_AUTH_BYPASS === 'true'

    // Use admin client in dev bypass mode to bypass RLS
    const supabase = isDevBypass
      ? await createServerSupabaseAdmin()
      : await createServerSupabaseClient()

    // Verify authentication and admin role (skip in dev bypass mode)
    if (!isDevBypass) {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      // Check admin role
      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

      if (!profile || profile.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
      }
    }

    const { start: rangeStart, previousStart } = getDateRange(range)

    // ============================================
    // PLATFORM STATS
    // ============================================

    // Total users
    const { count: totalUsers } = await supabase
      .from('users')
      .select('id', { count: 'exact', head: true })

    // Previous period users (for trend)
    let previousUsers = 0
    if (rangeStart) {
      const { count } = await supabase
        .from('users')
        .select('id', { count: 'exact', head: true })
        .lt('created_at', rangeStart.toISOString())
      previousUsers = count || 0
    }

    // Users by role
    const { data: roleData } = await supabase
      .from('users')
      .select('role')

    const totalInstructors = roleData?.filter(u => u.role === 'instructor').length || 0
    const totalStudents = roleData?.filter(u => u.role === 'student').length || 0

    // Active users (users with lesson_progress in the period)
    let activeUsersQuery = supabase
      .from('lesson_progress')
      .select('user_id', { count: 'exact', head: true })

    if (rangeStart) {
      activeUsersQuery = activeUsersQuery.gte('started_at', rangeStart.toISOString())
    }

    const { count: activeUsersCount } = await activeUsersQuery

    // Previous period active users
    let previousActiveUsers = 0
    if (previousStart && rangeStart) {
      const { count } = await supabase
        .from('lesson_progress')
        .select('user_id', { count: 'exact', head: true })
        .gte('started_at', previousStart.toISOString())
        .lt('started_at', rangeStart.toISOString())
      previousActiveUsers = count || 0
    }

    // Total courses
    const { count: totalCourses } = await supabase
      .from('courses')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'published')

    // Previous courses count
    let previousCourses = 0
    if (rangeStart) {
      const { count } = await supabase
        .from('courses')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'published')
        .lt('created_at', rangeStart.toISOString())
      previousCourses = count || 0
    }

    // Revenue calculations
    const { data: allPayments } = await supabase
      .from('payments')
      .select('amount, created_at')
      .eq('status', 'completed')

    const totalRevenue = allPayments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0

    // Monthly revenue (current month)
    const monthStart = new Date()
    monthStart.setDate(1)
    monthStart.setHours(0, 0, 0, 0)

    const monthlyRevenue = allPayments
      ?.filter(p => new Date(p.created_at) >= monthStart)
      .reduce((sum, p) => sum + Number(p.amount), 0) || 0

    // Previous month revenue
    const prevMonthStart = new Date(monthStart)
    prevMonthStart.setMonth(prevMonthStart.getMonth() - 1)
    const prevMonthEnd = new Date(monthStart)
    prevMonthEnd.setMilliseconds(-1)

    const prevMonthlyRevenue = allPayments
      ?.filter(p => {
        const date = new Date(p.created_at)
        return date >= prevMonthStart && date <= prevMonthEnd
      })
      .reduce((sum, p) => sum + Number(p.amount), 0) || 0

    // Average course rating
    const { data: courseRatings } = await supabase
      .from('courses')
      .select('average_rating')
      .eq('status', 'published')
      .not('average_rating', 'is', null)

    const avgCourseRating = courseRatings && courseRatings.length > 0
      ? Math.round((courseRatings.reduce((sum, c) => sum + (c.average_rating || 0), 0) / courseRatings.length) * 10) / 10
      : 0

    // Completion rate
    const { data: enrollments } = await supabase
      .from('enrollments')
      .select('status')

    const completedEnrollments = enrollments?.filter(e => e.status === 'completed').length || 0
    const completionRate = enrollments && enrollments.length > 0
      ? Math.round((completedEnrollments / enrollments.length) * 100)
      : 0

    const platformStats = {
      totalUsers: totalUsers || 0,
      usersTrend: calculateTrend(totalUsers || 0, previousUsers),
      activeUsers: activeUsersCount || 0,
      activeTrend: calculateTrend(activeUsersCount || 0, previousActiveUsers),
      totalCourses: totalCourses || 0,
      coursesTrend: calculateTrend(totalCourses || 0, previousCourses),
      totalRevenue,
      revenueTrend: calculateTrend(totalRevenue, totalRevenue - monthlyRevenue),
      monthlyRevenue,
      monthlyTrend: calculateTrend(monthlyRevenue, prevMonthlyRevenue),
      pendingPayouts: 0, // Would need payouts table
      totalInstructors,
      avgCourseRating,
      completionRate,
    }

    // ============================================
    // REVENUE DATA (last 6 months)
    // ============================================
    const revenueData = generateMonthlyData(allPayments || [], 6, 'revenue')

    // ============================================
    // USER GROWTH DATA (last 6 months)
    // ============================================
    const { data: allUsers } = await supabase
      .from('users')
      .select('created_at')
      .order('created_at', { ascending: true })

    const userGrowthData = generateUserGrowthData(allUsers || [], 6)

    // ============================================
    // TOP COURSES
    // ============================================
    const { data: coursesWithEnrollments } = await supabase
      .from('courses')
      .select(`
        id,
        title,
        price,
        average_rating,
        instructor_id,
        users:instructor_id (
          full_name
        )
      `)
      .eq('status', 'published')

    // Get enrollment counts per course
    const topCourses = await Promise.all(
      (coursesWithEnrollments || []).slice(0, 20).map(async (course) => {
        const { count: studentCount } = await supabase
          .from('enrollments')
          .select('id', { count: 'exact', head: true })
          .eq('course_id', course.id)

        const instructorData = Array.isArray(course.users) ? course.users[0] : course.users

        return {
          id: course.id,
          title: course.title,
          instructor: instructorData?.full_name || 'Unknown',
          students: studentCount || 0,
          revenue: (studentCount || 0) * Number(course.price || 0),
          rating: course.average_rating || 0
        }
      })
    )

    // Sort by students and take top 5
    topCourses.sort((a, b) => b.students - a.students)
    const topFiveCourses = topCourses.slice(0, 5)

    // ============================================
    // RECENT USERS
    // ============================================
    const { data: recentUsersData } = await supabase
      .from('users')
      .select('id, full_name, email, role, avatar_url, created_at')
      .order('created_at', { ascending: false })
      .limit(5)

    const recentUsers = (recentUsersData || []).map(user => ({
      id: user.id,
      name: user.full_name || 'Unknown',
      email: user.email,
      role: user.role,
      joinedAt: formatTimeAgo(new Date(user.created_at)),
      avatar: user.avatar_url
    }))

    // ============================================
    // PENDING APPROVALS (courses in draft status by other instructors)
    // ============================================
    const { data: pendingCoursesData } = await supabase
      .from('courses')
      .select(`
        id,
        title,
        created_at,
        users:instructor_id (
          full_name
        )
      `)
      .eq('status', 'draft')
      .order('created_at', { ascending: false })
      .limit(5)

    const pendingApprovals = (pendingCoursesData || []).map(course => {
      const instructorData = Array.isArray(course.users) ? course.users[0] : course.users
      return {
        id: course.id,
        title: course.title,
        instructor: instructorData?.full_name || 'Unknown',
        type: 'course',
        submittedAt: formatTimeAgo(new Date(course.created_at))
      }
    })

    // ============================================
    // CATEGORY DISTRIBUTION
    // ============================================
    const { data: courseCategories } = await supabase
      .from('courses')
      .select('category')
      .eq('status', 'published')

    const categoryColors: Record<string, string> = {
      'Web Development': 'bg-primary',
      'Data Science': 'bg-blue-500',
      'Mobile Development': 'bg-purple-500',
      'DevOps': 'bg-amber-500',
      'Design': 'bg-emerald-500',
      'Programming': 'bg-rose-500',
      'Cloud Computing': 'bg-cyan-500',
      'Security': 'bg-red-500',
    }

    const categoryCounts: Record<string, number> = {}
    for (const course of (courseCategories || [])) {
      const cat = course.category || 'Other'
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1
    }

    const categoryDistribution = Object.entries(categoryCounts)
      .map(([name, count]) => ({
        name,
        count,
        color: categoryColors[name] || 'bg-gray-500'
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6)

    // ============================================
    // SYSTEM ALERTS (static for now)
    // ============================================
    const systemAlerts = [
      { id: 'a1', type: 'success', message: 'System running smoothly', time: 'Now' },
      { id: 'a2', type: 'info', message: `${totalUsers || 0} total users on platform`, time: 'Real-time' },
    ]

    // ============================================
    // BUILD RESPONSE
    // ============================================

    return NextResponse.json({
      platformStats,
      revenueData,
      userGrowthData,
      topCourses: topFiveCourses,
      recentUsers,
      pendingApprovals,
      categoryDistribution,
      systemAlerts
    })

  } catch (error) {
    console.error('Admin analytics API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch admin analytics' },
      { status: 500 }
    )
  }
}

// Helper function to format time ago
function formatTimeAgo(date: Date): string {
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return 'Just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`
  const weeks = Math.floor(days / 7)
  return `${weeks} week${weeks > 1 ? 's' : ''} ago`
}

// Helper to generate monthly revenue data
function generateMonthlyData(
  payments: Array<{ amount: number | string; created_at: string }>,
  months: number,
  type: 'revenue'
): Array<{ month: string; revenue: number }> {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const result: Array<{ month: string; revenue: number }> = []
  const now = new Date()

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setMonth(date.getMonth() - i)
    const monthKey = monthNames[date.getMonth()]

    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)

    const monthRevenue = payments
      .filter(p => {
        const pDate = new Date(p.created_at)
        return pDate >= monthStart && pDate <= monthEnd
      })
      .reduce((sum, p) => sum + Number(p.amount), 0)

    result.push({ month: monthKey, revenue: monthRevenue })
  }

  return result
}

// Helper to generate user growth data
function generateUserGrowthData(
  users: Array<{ created_at: string }>,
  months: number
): Array<{ month: string; users: number }> {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const result: Array<{ month: string; users: number }> = []
  const now = new Date()

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setMonth(date.getMonth() - i)
    const monthKey = monthNames[date.getMonth()]

    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)

    // Count total users up to end of this month
    const totalUsersAtMonth = users.filter(u => new Date(u.created_at) <= monthEnd).length

    result.push({ month: monthKey, users: totalUsersAtMonth })
  }

  return result
}
