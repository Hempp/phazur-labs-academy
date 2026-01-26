import { NextResponse } from 'next/server'
import { createServerSupabaseClient, createServerSupabaseAdmin } from '@/lib/supabase/server'

// Mock data fallback when Supabase not configured
const MOCK_STATS = {
  totalCourses: 8,
  totalStudents: 12450,
  totalEarnings: 45890,
  monthlyEarnings: 8420,
  avgRating: 4.8,
  totalReviews: 2847,
  viewsThisMonth: 45200,
  enrollmentsThisMonth: 342,
  studentsTrend: 12,
  ratingTrend: 3,
  reviewsThisMonth: 24,
}

const MOCK_COURSES = [
  {
    id: '1',
    title: 'Advanced React Patterns',
    thumbnail: null,
    students: 3420,
    rating: 4.9,
    revenue: 12500,
    status: 'published',
    lastUpdated: '2024-01-15',
    level: 'advanced',
  },
  {
    id: '2',
    title: 'TypeScript Masterclass',
    thumbnail: null,
    students: 5280,
    rating: 4.8,
    revenue: 18900,
    status: 'published',
    lastUpdated: '2024-02-01',
    level: 'intermediate',
  },
  {
    id: '3',
    title: 'Node.js Best Practices',
    thumbnail: null,
    students: 2150,
    rating: 4.7,
    revenue: 8200,
    status: 'published',
    lastUpdated: '2024-01-20',
    level: 'intermediate',
  },
  {
    id: '4',
    title: 'GraphQL Fundamentals',
    thumbnail: null,
    students: 0,
    rating: 0,
    revenue: 0,
    status: 'draft',
    lastUpdated: '2024-02-10',
    level: 'beginner',
  },
]

const MOCK_RECENT_REVIEWS = [
  {
    id: 'r1',
    user: { name: 'Alex Thompson', avatar: null },
    course: 'Advanced React Patterns',
    rating: 5,
    comment: "Best React course I've ever taken! The explanations are crystal clear.",
    date: '2024-02-08',
  },
  {
    id: 'r2',
    user: { name: 'Maria Garcia', avatar: null },
    course: 'TypeScript Masterclass',
    rating: 5,
    comment: 'Finally understand TypeScript generics. Thank you!',
    date: '2024-02-07',
  },
  {
    id: 'r3',
    user: { name: 'James Wilson', avatar: null },
    course: 'Node.js Best Practices',
    rating: 4,
    comment: 'Great content, would love more examples on microservices.',
    date: '2024-02-06',
  },
]

const MOCK_RECENT_ENROLLMENTS = [
  { id: 'e1', user: { name: 'John Doe', avatar: null }, course: 'Advanced React Patterns', date: '2 hours ago' },
  { id: 'e2', user: { name: 'Jane Smith', avatar: null }, course: 'TypeScript Masterclass', date: '3 hours ago' },
  { id: 'e3', user: { name: 'Mike Johnson', avatar: null }, course: 'Advanced React Patterns', date: '5 hours ago' },
  { id: 'e4', user: { name: 'Sarah Williams', avatar: null }, course: 'Node.js Best Practices', date: '6 hours ago' },
]

const MOCK_EARNINGS_DATA = [
  { month: 'Aug', amount: 5200 },
  { month: 'Sep', amount: 6100 },
  { month: 'Oct', amount: 5800 },
  { month: 'Nov', amount: 7200 },
  { month: 'Dec', amount: 6900 },
  { month: 'Jan', amount: 8420 },
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
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
  return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) !== 1 ? 's' : ''} ago`
}

// Helper to get month abbreviation
function getMonthAbbrev(monthIndex: number): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return months[monthIndex]
}

export async function GET() {
  try {
    // Return mock data if Supabase not configured
    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        stats: MOCK_STATS,
        courses: MOCK_COURSES,
        recentReviews: MOCK_RECENT_REVIEWS,
        recentEnrollments: MOCK_RECENT_ENROLLMENTS,
        earningsData: MOCK_EARNINGS_DATA,
      })
    }

    // Dev auth bypass for testing
    const isDevBypass = process.env.NODE_ENV === 'development' && process.env.DEV_AUTH_BYPASS === 'true'

    const supabase = isDevBypass
      ? await createServerSupabaseAdmin()
      : await createServerSupabaseClient()

    // Get current user
    let instructorId: string | null = null

    if (isDevBypass) {
      // In dev bypass, get the first instructor
      const { data: instructor } = await supabase
        .from('users')
        .select('id')
        .eq('role', 'instructor')
        .limit(1)
        .single()
      instructorId = instructor?.id || null
    } else {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      // Verify instructor role
      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

      if (!profile || profile.role !== 'instructor') {
        return NextResponse.json({ error: 'Forbidden - Instructor access required' }, { status: 403 })
      }

      instructorId = user.id
    }

    if (!instructorId) {
      return NextResponse.json({
        stats: MOCK_STATS,
        courses: MOCK_COURSES,
        recentReviews: MOCK_RECENT_REVIEWS,
        recentEnrollments: MOCK_RECENT_ENROLLMENTS,
        earningsData: MOCK_EARNINGS_DATA,
      })
    }

    // Get instructor's courses
    const { data: courses } = await supabase
      .from('courses')
      .select('id, title, thumbnail_url, status, level, updated_at, average_rating')
      .eq('instructor_id', instructorId)
      .order('updated_at', { ascending: false })

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

    // Transform courses
    const transformedCourses = (courses || []).map(course => ({
      id: course.id,
      title: course.title,
      thumbnail: course.thumbnail_url,
      students: enrollmentCounts[course.id] || 0,
      rating: course.average_rating || 0,
      revenue: revenueByCourse[course.id] || 0,
      status: course.status,
      lastUpdated: course.updated_at?.split('T')[0] || '',
      level: course.level || 'beginner',
    }))

    // Calculate total students (unique across all courses)
    let totalStudents = 0
    if (courseIds.length > 0) {
      const { data: allEnrollments } = await supabase
        .from('enrollments')
        .select('user_id')
        .in('course_id', courseIds)

      const uniqueStudents = new Set(allEnrollments?.map(e => e.user_id) || [])
      totalStudents = uniqueStudents.size
    }

    // Calculate total earnings
    const totalEarnings = Object.values(revenueByCourse).reduce((sum, amount) => sum + amount, 0)

    // Calculate monthly earnings (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    let monthlyEarnings = 0
    if (courseIds.length > 0) {
      const { data: monthlyPayments } = await supabase
        .from('payments')
        .select('amount')
        .in('course_id', courseIds)
        .eq('status', 'completed')
        .gte('created_at', thirtyDaysAgo.toISOString())

      monthlyEarnings = monthlyPayments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0
    }

    // Get average rating across all courses
    const ratingsSum = transformedCourses.filter(c => c.rating > 0).reduce((sum, c) => sum + c.rating, 0)
    const ratingsCount = transformedCourses.filter(c => c.rating > 0).length
    const avgRating = ratingsCount > 0 ? Number((ratingsSum / ratingsCount).toFixed(1)) : 0

    // Get total reviews count
    let totalReviews = 0
    if (courseIds.length > 0) {
      const { count } = await supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true })
        .in('course_id', courseIds)
      totalReviews = count || 0
    }

    // Get enrollments this month
    let enrollmentsThisMonth = 0
    if (courseIds.length > 0) {
      const { count } = await supabase
        .from('enrollments')
        .select('*', { count: 'exact', head: true })
        .in('course_id', courseIds)
        .gte('enrolled_at', thirtyDaysAgo.toISOString())
      enrollmentsThisMonth = count || 0
    }

    // Get reviews this month
    let reviewsThisMonth = 0
    if (courseIds.length > 0) {
      const { count } = await supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true })
        .in('course_id', courseIds)
        .gte('created_at', thirtyDaysAgo.toISOString())
      reviewsThisMonth = count || 0
    }

    // Calculate student trend (compare this month vs last month)
    const sixtyDaysAgo = new Date()
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60)
    let previousMonthEnrollments = 0
    if (courseIds.length > 0) {
      const { count } = await supabase
        .from('enrollments')
        .select('*', { count: 'exact', head: true })
        .in('course_id', courseIds)
        .gte('enrolled_at', sixtyDaysAgo.toISOString())
        .lt('enrolled_at', thirtyDaysAgo.toISOString())
      previousMonthEnrollments = count || 0
    }

    const studentsTrend = previousMonthEnrollments > 0
      ? Math.round(((enrollmentsThisMonth - previousMonthEnrollments) / previousMonthEnrollments) * 100)
      : enrollmentsThisMonth > 0 ? 100 : 0

    // Get recent reviews
    let recentReviews: Array<{
      id: string
      user: { name: string; avatar: string | null }
      course: string
      rating: number
      comment: string
      date: string
    }> = []

    if (courseIds.length > 0) {
      const { data: reviewsData } = await supabase
        .from('reviews')
        .select(`
          id,
          rating,
          comment,
          created_at,
          user:users!reviews_user_id_fkey (full_name, avatar_url),
          course:courses!reviews_course_id_fkey (title)
        `)
        .in('course_id', courseIds)
        .order('created_at', { ascending: false })
        .limit(5)

      recentReviews = (reviewsData || []).map(r => {
        const userData = Array.isArray(r.user) ? r.user[0] : r.user
        const courseData = Array.isArray(r.course) ? r.course[0] : r.course
        return {
          id: r.id,
          user: {
            name: userData?.full_name || 'Unknown',
            avatar: userData?.avatar_url || null,
          },
          course: courseData?.title || 'Unknown Course',
          rating: r.rating,
          comment: r.comment || '',
          date: r.created_at?.split('T')[0] || '',
        }
      })
    }

    // Get recent enrollments
    let recentEnrollments: Array<{
      id: string
      user: { name: string; avatar: string | null }
      course: string
      date: string
    }> = []

    if (courseIds.length > 0) {
      const { data: enrollmentsData } = await supabase
        .from('enrollments')
        .select(`
          id,
          enrolled_at,
          user:users!enrollments_user_id_fkey (full_name, avatar_url),
          course:courses!enrollments_course_id_fkey (title)
        `)
        .in('course_id', courseIds)
        .order('enrolled_at', { ascending: false })
        .limit(5)

      recentEnrollments = (enrollmentsData || []).map(e => {
        const userData = Array.isArray(e.user) ? e.user[0] : e.user
        const courseData = Array.isArray(e.course) ? e.course[0] : e.course
        return {
          id: e.id,
          user: {
            name: userData?.full_name || 'Unknown',
            avatar: userData?.avatar_url || null,
          },
          course: courseData?.title || 'Unknown Course',
          date: getRelativeTime(e.enrolled_at || ''),
        }
      })
    }

    // Build earnings data for the last 6 months
    const now = new Date()
    const earningsData: Array<{ month: string; amount: number }> = []

    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59)

      let monthAmount = 0
      if (courseIds.length > 0) {
        const { data: monthPayments } = await supabase
          .from('payments')
          .select('amount')
          .in('course_id', courseIds)
          .eq('status', 'completed')
          .gte('created_at', monthStart.toISOString())
          .lte('created_at', monthEnd.toISOString())

        monthAmount = monthPayments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0
      }

      earningsData.push({
        month: getMonthAbbrev(monthStart.getMonth()),
        amount: monthAmount,
      })
    }

    // Views would need a page_views or analytics table - using estimate based on enrollments
    const viewsThisMonth = enrollmentsThisMonth * 15 // Rough estimate: 15 views per enrollment

    const stats = {
      totalCourses: courses?.length || 0,
      totalStudents,
      totalEarnings,
      monthlyEarnings,
      avgRating,
      totalReviews,
      viewsThisMonth,
      enrollmentsThisMonth,
      studentsTrend,
      ratingTrend: 3, // Would need historical data
      reviewsThisMonth,
    }

    return NextResponse.json({
      stats,
      courses: transformedCourses,
      recentReviews,
      recentEnrollments,
      earningsData,
    })

  } catch (error) {
    console.error('Instructor dashboard fetch error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}
