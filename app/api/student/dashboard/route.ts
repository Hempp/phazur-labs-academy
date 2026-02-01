import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createServerSupabaseAdmin } from '@/lib/supabase/server'

// Fallback mock data when Supabase not configured
const MOCK_DASHBOARD_DATA = {
  student: {
    id: 'mock-student',
    full_name: 'Demo Student',
    email: 'demo@example.com',
    avatar_url: null,
    streak_days: 7,
    total_hours_learned: 156
  },
  enrollments: [
    {
      id: 'enrollment-1',
      course_id: 'course-1',
      progress_percentage: 65,
      status: 'active',
      enrolled_at: '2024-01-05T00:00:00Z',
      last_accessed_at: new Date().toISOString(),
      course: {
        id: 'course-1',
        title: 'Advanced React Patterns',
        thumbnail_url: '/courses/react-patterns.jpg',
        total_lessons: 48,
        instructor: { full_name: 'Sarah Johnson' }
      },
      completed_lessons: 31,
      total_lessons: 48
    }
  ],
  certificates: [],
  analytics: {
    total_courses_enrolled: 3,
    courses_completed: 0,
    certificates_earned: 0,
    total_hours_learned: 156,
    current_streak: 7,
    longest_streak: 21,
    average_quiz_score: 85,
    learning_by_day: [
      { day: 'Mon', hours: 2.5 },
      { day: 'Tue', hours: 1.8 },
      { day: 'Wed', hours: 3.2 },
      { day: 'Thu', hours: 2.1 },
      { day: 'Fri', hours: 1.5 },
      { day: 'Sat', hours: 4.0 },
      { day: 'Sun', hours: 2.8 }
    ],
    category_distribution: [
      { category: 'Web Development', hours: 45 },
      { category: 'Programming Languages', hours: 38 },
      { category: 'Backend Development', hours: 25 }
    ]
  },
  upcomingLiveTrainings: []
}

export async function GET(request: NextRequest) {
  try {
    // Dev auth bypass for testing
    const isDevBypass = process.env.NODE_ENV === 'development' && process.env.DEV_AUTH_BYPASS === 'true'

    // Use admin client in dev bypass mode to bypass RLS
    const supabase = isDevBypass
      ? await createServerSupabaseAdmin()
      : await createServerSupabaseClient()

    // Get user ID (from auth or test user for dev bypass)
    let userId: string | null = null

    if (!isDevBypass) {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      userId = user.id
    } else {
      // In dev bypass mode, get the first student from users table
      const { data: testUser } = await supabase
        .from('users')
        .select('id')
        .eq('role', 'student')
        .limit(1)
        .single()

      if (!testUser) {
        // Return mock data if no users exist
        return NextResponse.json(MOCK_DASHBOARD_DATA)
      }
      userId = testUser.id
    }

    // ============================================
    // FETCH STUDENT PROFILE
    // ============================================
    const { data: student, error: studentError } = await supabase
      .from('users')
      .select('id, full_name, email, avatar_url, created_at')
      .eq('id', userId)
      .single()

    if (studentError || !student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    // ============================================
    // FETCH ENROLLMENTS WITH COURSE DATA
    // ============================================
    const { data: enrollmentsData, error: enrollmentError } = await supabase
      .from('enrollments')
      .select(`
        id,
        course_id,
        user_id,
        progress_percentage,
        is_active,
        enrolled_at,
        completed_at,
        courses:course_id (
          id,
          title,
          slug,
          thumbnail_url,
          category_id,
          level,
          instructor_id,
          categories:category_id (
            name
          ),
          users:instructor_id (
            full_name,
            avatar_url
          )
        )
      `)
      .eq('user_id', userId)
      .order('enrolled_at', { ascending: false })

    if (enrollmentError) {
      console.error('Enrollment fetch error:', enrollmentError)
    }

    // For each enrollment, get lesson counts
    const enrollments = await Promise.all(
      (enrollmentsData || []).map(async (enrollment) => {
        // Get total lessons for course
        const { count: totalLessons } = await supabase
          .from('lessons')
          .select('id', { count: 'exact', head: true })
          .eq('course_id', enrollment.course_id)

        // Get completed lessons for this user
        const { count: completedLessons } = await supabase
          .from('lesson_progress')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('course_id', enrollment.course_id)
          .eq('is_completed', true)

        // Get last accessed time from lesson progress
        const { data: lastProgress } = await supabase
          .from('lesson_progress')
          .select('started_at')
          .eq('user_id', userId)
          .eq('course_id', enrollment.course_id)
          .order('started_at', { ascending: false })
          .limit(1)
          .single()

        // Handle Supabase returning nested data as array or object
        const courseData = Array.isArray(enrollment.courses) ? enrollment.courses[0] : enrollment.courses
        const instructorData = courseData?.users
        const instructor = Array.isArray(instructorData) ? instructorData[0] : instructorData

        // Handle category data - can be array or object from Supabase
        const categoryData = courseData?.categories
        const category = Array.isArray(categoryData) ? categoryData[0] : categoryData

        return {
          id: enrollment.id,
          course_id: enrollment.course_id,
          progress_percentage: enrollment.progress_percentage || 0,
          status: enrollment.is_active ? 'active' : 'inactive',
          enrolled_at: enrollment.enrolled_at,
          completed_at: enrollment.completed_at,
          last_accessed_at: lastProgress?.started_at || enrollment.enrolled_at,
          course: courseData ? {
            id: courseData.id,
            title: courseData.title,
            slug: courseData.slug,
            thumbnail_url: courseData.thumbnail_url,
            category: category?.name || null,
            level: courseData.level,
            instructor: instructor ? {
              full_name: instructor.full_name,
              avatar_url: instructor.avatar_url
            } : null
          } : null,
          completed_lessons: completedLessons || 0,
          total_lessons: totalLessons || 0
        }
      })
    )

    // ============================================
    // FETCH CERTIFICATES
    // ============================================
    const { data: certificatesData } = await supabase
      .from('certificates')
      .select(`
        id,
        course_id,
        certificate_number,
        verification_url,
        grade,
        issued_at,
        courses:course_id (
          title
        )
      `)
      .eq('user_id', userId)
      .order('issued_at', { ascending: false })

    const certificates = (certificatesData || []).map(cert => {
      const courseData = Array.isArray(cert.courses) ? cert.courses[0] : cert.courses
      return {
        id: cert.id,
        course_id: cert.course_id,
        course_title: courseData?.title || 'Unknown Course',
        student_name: student.full_name,
        certificate_number: cert.certificate_number,
        verification_url: cert.verification_url,
        issue_date: cert.issued_at,
        grade: cert.grade
      }
    })

    // ============================================
    // CALCULATE ANALYTICS
    // ============================================

    // Get total watch time from lesson progress
    const { data: progressData } = await supabase
      .from('lesson_progress')
      .select('watch_time_seconds, started_at')
      .eq('user_id', userId)

    const totalWatchSeconds = progressData?.reduce((sum, p) => sum + (p.watch_time_seconds || 0), 0) || 0
    const totalHoursLearned = Math.round(totalWatchSeconds / 3600 * 10) / 10

    // Calculate streak (days with activity in a row)
    const streak = calculateStreak(progressData?.map(p => p.started_at) || [])

    // Get quiz attempts for average score
    const { data: quizAttempts } = await supabase
      .from('quiz_attempts')
      .select('score, max_score')
      .eq('user_id', userId)

    let averageQuizScore = 0
    if (quizAttempts && quizAttempts.length > 0) {
      const totalPercentage = quizAttempts.reduce((sum, a) => {
        const percentage = a.max_score > 0 ? (a.score / a.max_score) * 100 : 0
        return sum + percentage
      }, 0)
      averageQuizScore = Math.round(totalPercentage / quizAttempts.length)
    }

    // Learning by day (last 7 days)
    const learningByDay = calculateLearningByDay(progressData || [])

    // Category distribution (from enrolled courses)
    const categoryDistribution = calculateCategoryDistribution(enrollments)

    const analytics = {
      total_courses_enrolled: enrollments.length,
      courses_completed: enrollments.filter(e => e.status === 'completed').length,
      certificates_earned: certificates.length,
      total_hours_learned: totalHoursLearned || 0,
      current_streak: streak,
      longest_streak: streak, // Would need historical data to track properly
      average_quiz_score: averageQuizScore,
      learning_by_day: learningByDay,
      category_distribution: categoryDistribution
    }

    // ============================================
    // BUILD RESPONSE
    // ============================================

    return NextResponse.json({
      student: {
        id: student.id,
        full_name: student.full_name,
        email: student.email,
        avatar_url: student.avatar_url,
        streak_days: streak,
        total_hours_learned: totalHoursLearned
      },
      enrollments,
      certificates,
      analytics,
      upcomingLiveTrainings: [] // Would need live_trainings table
    })

  } catch (error) {
    console.error('Student dashboard API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}

// Helper function to calculate learning streak
function calculateStreak(dates: string[]): number {
  if (!dates.length) return 0

  const uniqueDays = new Set(
    dates.map(d => new Date(d).toISOString().split('T')[0])
  )

  const sortedDays = Array.from(uniqueDays).sort().reverse()
  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

  // Check if there's activity today or yesterday
  if (!sortedDays.includes(today) && !sortedDays.includes(yesterday)) {
    return 0
  }

  let streak = 0
  let currentDate = new Date(sortedDays[0])

  for (const day of sortedDays) {
    const checkDate = currentDate.toISOString().split('T')[0]
    if (day === checkDate) {
      streak++
      currentDate.setDate(currentDate.getDate() - 1)
    } else {
      break
    }
  }

  return streak
}

// Helper function to calculate learning hours by day of week
function calculateLearningByDay(progressData: Array<{ watch_time_seconds: number; started_at: string }>): Array<{ day: string; hours: number }> {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const dayHours: Record<string, number> = {
    'Sun': 0, 'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0
  }

  for (const progress of progressData) {
    const dayIndex = new Date(progress.started_at).getDay()
    const dayName = dayNames[dayIndex]
    dayHours[dayName] += (progress.watch_time_seconds || 0) / 3600
  }

  // Reorder starting from Monday
  return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
    day,
    hours: Math.round(dayHours[day] * 10) / 10
  }))
}

// Helper function to calculate category distribution
function calculateCategoryDistribution(
  enrollments: Array<{ course?: { category?: string } | null; completed_lessons: number }>
): Array<{ category: string; hours: number }> {
  const categoryHours: Record<string, number> = {}

  for (const enrollment of enrollments) {
    const category = enrollment.course?.category || 'Other'
    // Estimate ~10 minutes per completed lesson
    const estimatedHours = (enrollment.completed_lessons * 10) / 60

    if (!categoryHours[category]) {
      categoryHours[category] = 0
    }
    categoryHours[category] += estimatedHours
  }

  return Object.entries(categoryHours)
    .map(([category, hours]) => ({
      category,
      hours: Math.round(hours * 10) / 10
    }))
    .sort((a, b) => b.hours - a.hours)
    .slice(0, 5) // Top 5 categories
}
