import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createServerSupabaseAdmin } from '@/lib/supabase/server'

// Mock data fallback when Supabase not configured
const MOCK_STUDENTS = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    avatar: null,
    enrolledCourses: 3,
    completedCourses: 1,
    progress: 67,
    totalSpent: 447,
    status: 'active',
    joinDate: '2024-01-15',
    lastActive: '2 hours ago',
    plan: 'premium',
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael@example.com',
    avatar: null,
    enrolledCourses: 2,
    completedCourses: 2,
    progress: 100,
    totalSpent: 298,
    status: 'active',
    joinDate: '2024-02-20',
    lastActive: '1 day ago',
    plan: 'basic',
  },
  {
    id: '3',
    name: 'Emily Davis',
    email: 'emily@example.com',
    avatar: null,
    enrolledCourses: 1,
    completedCourses: 0,
    progress: 23,
    totalSpent: 149,
    status: 'inactive',
    joinDate: '2024-03-10',
    lastActive: '2 weeks ago',
    plan: 'basic',
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
function getRelativeTime(date: string | null): string {
  if (!date) return 'Never'
  const now = new Date()
  const past = new Date(date)
  const diffMs = now.getTime() - past.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)
  const diffWeeks = Math.floor(diffDays / 7)

  if (diffHours < 1) return 'Just now'
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`
  return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`
}

// GET - List all students
export async function GET(request: NextRequest) {
  try {
    // Return mock data if Supabase not configured
    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        students: MOCK_STUDENTS,
        total: MOCK_STUDENTS.length,
        stats: {
          totalStudents: MOCK_STUDENTS.length,
          activeStudents: MOCK_STUDENTS.filter(s => s.status === 'active').length,
          avgProgress: Math.round(MOCK_STUDENTS.reduce((sum, s) => sum + s.progress, 0) / MOCK_STUDENTS.length),
          totalRevenue: MOCK_STUDENTS.reduce((sum, s) => sum + s.totalSpent, 0),
        },
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
    const plan = searchParams.get('plan') || 'all'
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build query for students (users with role='student')
    let query = supabase
      .from('users')
      .select('id, full_name, email, avatar_url, role, is_active, created_at, updated_at', { count: 'exact' })
      .eq('role', 'student')
      .order('created_at', { ascending: false })

    // Apply search filter
    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`)
    }

    // Apply status filter (map 'active'/'inactive' to boolean is_active)
    if (status !== 'all') {
      query = query.eq('is_active', status === 'active')
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data: students, error, count } = await query

    if (error) {
      throw error
    }

    // Get all student IDs
    const studentIds = students?.map(s => s.id) || []

    // Get enrollment data for all students
    const enrollmentData: Record<string, { count: number; completed: number; progress: number }> = {}
    if (studentIds.length > 0) {
      const { data: enrollments } = await supabase
        .from('enrollments')
        .select('user_id, status, progress_percentage')
        .in('user_id', studentIds)

      for (const enrollment of enrollments || []) {
        if (!enrollmentData[enrollment.user_id]) {
          enrollmentData[enrollment.user_id] = { count: 0, completed: 0, progress: 0 }
        }
        enrollmentData[enrollment.user_id].count++
        if (enrollment.status === 'completed') {
          enrollmentData[enrollment.user_id].completed++
        }
        enrollmentData[enrollment.user_id].progress += enrollment.progress_percentage || 0
      }
    }

    // Get payment totals for all students
    const spentData: Record<string, number> = {}
    if (studentIds.length > 0) {
      const { data: payments } = await supabase
        .from('payments')
        .select('user_id, amount')
        .in('user_id', studentIds)
        .eq('status', 'completed')

      for (const payment of payments || []) {
        spentData[payment.user_id] = (spentData[payment.user_id] || 0) + Number(payment.amount)
      }
    }

    // Transform students to match UI expectations
    const transformedStudents = students?.map(student => {
      const enrollment = enrollmentData[student.id] || { count: 0, completed: 0, progress: 0 }
      const avgProgress = enrollment.count > 0
        ? Math.round(enrollment.progress / enrollment.count)
        : 0

      // Map is_active boolean to status string for UI compatibility
      const studentStatus = student.is_active === false ? 'inactive' : 'active'

      // Plan would typically come from a subscriptions table
      // For now, default to 'basic' unless we have subscription data
      const studentPlan = 'basic'

      return {
        id: student.id,
        name: student.full_name || 'Unknown',
        email: student.email,
        avatar: student.avatar_url,
        enrolledCourses: enrollment.count,
        completedCourses: enrollment.completed,
        progress: avgProgress,
        totalSpent: spentData[student.id] || 0,
        status: studentStatus,
        joinDate: student.created_at?.split('T')[0] || '',
        lastActive: getRelativeTime(student.updated_at),
        plan: studentPlan,
      }
    }) || []

    // Apply plan filter (done after transformation since plan is computed)
    const filteredStudents = plan !== 'all'
      ? transformedStudents.filter(s => s.plan === plan)
      : transformedStudents

    // Calculate stats
    const stats = {
      totalStudents: count || 0,
      activeStudents: transformedStudents.filter(s => s.status === 'active').length,
      avgProgress: transformedStudents.length > 0
        ? Math.round(transformedStudents.reduce((sum, s) => sum + s.progress, 0) / transformedStudents.length)
        : 0,
      totalRevenue: Object.values(spentData).reduce((sum, amount) => sum + amount, 0),
    }

    return NextResponse.json({
      students: filteredStudents,
      total: count,
      stats,
    })

  } catch (error) {
    console.error('Students fetch error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch students' },
      { status: 500 }
    )
  }
}

// POST - Create a new student
export async function POST(request: NextRequest) {
  try {
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

    const body = await request.json()
    const { name, email, courseIds } = body

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { error: 'A user with this email already exists' },
        { status: 409 }
      )
    }

    // Create the student user
    // Note: In a real app, you'd also create an auth user via Supabase Auth
    // This creates just the profile entry
    const { data: newStudent, error: createError } = await supabase
      .from('users')
      .insert({
        full_name: name,
        email,
        role: 'student',
        is_active: true,
      })
      .select()
      .single()

    if (createError) {
      throw createError
    }

    // Enroll in courses if specified
    if (courseIds && courseIds.length > 0) {
      const enrollments = courseIds.map((courseId: string) => ({
        user_id: newStudent.id,
        course_id: courseId,
        status: 'active',
        progress_percentage: 0,
      }))

      const { error: enrollError } = await supabase
        .from('enrollments')
        .insert(enrollments)

      if (enrollError) {
        console.error('Enrollment error:', enrollError)
        // Don't fail the whole request, student was created
      }
    }

    return NextResponse.json({
      message: 'Student created successfully',
      student: {
        id: newStudent.id,
        name: newStudent.full_name,
        email: newStudent.email,
        avatar: newStudent.avatar_url,
        enrolledCourses: courseIds?.length || 0,
        completedCourses: 0,
        progress: 0,
        totalSpent: 0,
        status: 'active',
        joinDate: newStudent.created_at?.split('T')[0] || '',
        lastActive: 'Just now',
        plan: 'basic',
      },
    })

  } catch (error) {
    console.error('Student creation error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create student' },
      { status: 500 }
    )
  }
}
