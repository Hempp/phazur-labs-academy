import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createServerSupabaseAdmin } from '@/lib/supabase/server'

// Mock data fallback when Supabase not configured
const MOCK_INSTRUCTORS = [
  {
    id: '1',
    name: 'Dr. Alex Turner',
    email: 'alex.turner@phazurlabs.com',
    avatar: null,
    specialty: 'AI & Machine Learning',
    totalCourses: 8,
    activeCourses: 6,
    totalStudents: 4520,
    rating: 4.9,
    totalRevenue: 125400,
    status: 'active',
    verified: true,
    joinDate: '2023-03-15',
    lastActive: '1 hour ago',
    payout: 'monthly',
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria.s@phazurlabs.com',
    avatar: null,
    specialty: 'Web Development',
    totalCourses: 12,
    activeCourses: 10,
    totalStudents: 8750,
    rating: 4.8,
    totalRevenue: 234500,
    status: 'active',
    verified: true,
    joinDate: '2022-11-20',
    lastActive: '30 minutes ago',
    payout: 'monthly',
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

// GET - List all instructors
export async function GET(request: NextRequest) {
  try {
    // Return mock data if Supabase not configured
    if (!isSupabaseConfigured()) {
      const stats = {
        totalInstructors: MOCK_INSTRUCTORS.length,
        activeInstructors: MOCK_INSTRUCTORS.filter(i => i.status === 'active').length,
        totalCourses: MOCK_INSTRUCTORS.reduce((sum, i) => sum + i.totalCourses, 0),
        totalRevenue: MOCK_INSTRUCTORS.reduce((sum, i) => sum + i.totalRevenue, 0),
        avgRating: Number((MOCK_INSTRUCTORS.reduce((sum, i) => sum + i.rating, 0) / MOCK_INSTRUCTORS.length).toFixed(1)),
      }
      return NextResponse.json({
        instructors: MOCK_INSTRUCTORS,
        stats,
        specialties: [...new Set(MOCK_INSTRUCTORS.map(i => i.specialty))],
        total: MOCK_INSTRUCTORS.length,
      })
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

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || 'all'
    const specialty = searchParams.get('specialty') || 'all'
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Get all instructors
    let query = supabase
      .from('users')
      .select('id, full_name, email, avatar_url, role, is_active, created_at, updated_at', { count: 'exact' })
      .eq('role', 'instructor')
      .order('created_at', { ascending: false })

    // Apply search filter
    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`)
    }

    // Apply status filter
    if (status !== 'all') {
      query = query.eq('is_active', status === 'active')
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data: instructors, error, count } = await query

    if (error) {
      throw error
    }

    const instructorIds = instructors?.map(i => i.id) || []

    // Get courses for each instructor
    const coursesByInstructor: Record<string, { total: number; active: number; categoryName: string | null }> = {}
    if (instructorIds.length > 0) {
      const { data: courses } = await supabase
        .from('courses')
        .select(`
          instructor_id,
          status,
          category:categories!courses_category_id_fkey (name)
        `)
        .in('instructor_id', instructorIds)

      for (const course of courses || []) {
        if (!coursesByInstructor[course.instructor_id]) {
          coursesByInstructor[course.instructor_id] = { total: 0, active: 0, categoryName: null }
        }
        coursesByInstructor[course.instructor_id].total++
        if (course.status === 'published') {
          coursesByInstructor[course.instructor_id].active++
        }
        // Use first course's category as "specialty"
        if (!coursesByInstructor[course.instructor_id].categoryName) {
          const categoryData = Array.isArray(course.category) ? course.category[0] : course.category
          coursesByInstructor[course.instructor_id].categoryName = categoryData?.name || null
        }
      }
    }

    // Get student counts (via enrollments on instructor's courses)
    const studentsByInstructor: Record<string, number> = {}
    if (instructorIds.length > 0) {
      // First get all course IDs for each instructor
      const { data: instructorCourses } = await supabase
        .from('courses')
        .select('id, instructor_id')
        .in('instructor_id', instructorIds)

      const courseToInstructor: Record<string, string> = {}
      for (const c of instructorCourses || []) {
        courseToInstructor[c.id] = c.instructor_id
      }

      const courseIds = Object.keys(courseToInstructor)
      if (courseIds.length > 0) {
        const { data: enrollments } = await supabase
          .from('enrollments')
          .select('course_id, user_id')
          .in('course_id', courseIds)

        // Count unique students per instructor
        const studentsPerInstructor: Record<string, Set<string>> = {}
        for (const e of enrollments || []) {
          const instructorId = courseToInstructor[e.course_id]
          if (!studentsPerInstructor[instructorId]) {
            studentsPerInstructor[instructorId] = new Set()
          }
          studentsPerInstructor[instructorId].add(e.user_id)
        }

        for (const [instructorId, students] of Object.entries(studentsPerInstructor)) {
          studentsByInstructor[instructorId] = students.size
        }
      }
    }

    // Get average rating per instructor (from course ratings)
    const ratingsByInstructor: Record<string, number> = {}
    if (instructorIds.length > 0) {
      const { data: courseRatings } = await supabase
        .from('courses')
        .select('instructor_id, average_rating')
        .in('instructor_id', instructorIds)
        .not('average_rating', 'is', null)

      const ratingsData: Record<string, { sum: number; count: number }> = {}
      for (const c of courseRatings || []) {
        if (!ratingsData[c.instructor_id]) {
          ratingsData[c.instructor_id] = { sum: 0, count: 0 }
        }
        ratingsData[c.instructor_id].sum += c.average_rating || 0
        ratingsData[c.instructor_id].count++
      }

      for (const [instructorId, data] of Object.entries(ratingsData)) {
        ratingsByInstructor[instructorId] = data.count > 0
          ? Number((data.sum / data.count).toFixed(1))
          : 0
      }
    }

    // Get revenue per instructor (from payments on their courses)
    const revenueByInstructor: Record<string, number> = {}
    if (instructorIds.length > 0) {
      const { data: instructorCourses } = await supabase
        .from('courses')
        .select('id, instructor_id')
        .in('instructor_id', instructorIds)

      const courseToInstructor: Record<string, string> = {}
      for (const c of instructorCourses || []) {
        courseToInstructor[c.id] = c.instructor_id
      }

      const courseIds = Object.keys(courseToInstructor)
      if (courseIds.length > 0) {
        const { data: payments } = await supabase
          .from('payments')
          .select('course_id, amount')
          .in('course_id', courseIds)
          .eq('status', 'completed')

        for (const p of payments || []) {
          const instructorId = courseToInstructor[p.course_id]
          revenueByInstructor[instructorId] = (revenueByInstructor[instructorId] || 0) + Number(p.amount)
        }
      }
    }

    // Transform instructors
    const transformedInstructors = instructors?.map(instructor => {
      const courseData = coursesByInstructor[instructor.id] || { total: 0, active: 0, categoryName: null }

      return {
        id: instructor.id,
        name: instructor.full_name || 'Unknown',
        email: instructor.email,
        avatar: instructor.avatar_url,
        specialty: courseData.categoryName || 'General',
        totalCourses: courseData.total,
        activeCourses: courseData.active,
        totalStudents: studentsByInstructor[instructor.id] || 0,
        rating: ratingsByInstructor[instructor.id] || 0,
        totalRevenue: revenueByInstructor[instructor.id] || 0,
        status: instructor.is_active === false ? 'inactive' : 'active',
        verified: true, // Would come from a verification system
        joinDate: instructor.created_at?.split('T')[0] || '',
        lastActive: getRelativeTime(instructor.updated_at),
        payout: 'monthly', // Would come from a payout settings table
      }
    }) || []

    // Apply specialty filter after transformation (since specialty is computed)
    const filteredInstructors = specialty !== 'all'
      ? transformedInstructors.filter(i => i.specialty === specialty)
      : transformedInstructors

    // Get unique specialties
    const specialties = [...new Set(transformedInstructors.map(i => i.specialty))]

    // Calculate stats
    const stats = {
      totalInstructors: count || 0,
      activeInstructors: transformedInstructors.filter(i => i.status === 'active').length,
      totalCourses: transformedInstructors.reduce((sum, i) => sum + i.totalCourses, 0),
      totalRevenue: transformedInstructors.reduce((sum, i) => sum + i.totalRevenue, 0),
      avgRating: transformedInstructors.length > 0
        ? Number((transformedInstructors.filter(i => i.rating > 0).reduce((sum, i) => sum + i.rating, 0) /
            Math.max(transformedInstructors.filter(i => i.rating > 0).length, 1)).toFixed(1))
        : 0,
    }

    return NextResponse.json({
      instructors: filteredInstructors,
      stats,
      specialties,
      total: count,
    })

  } catch (error) {
    console.error('Instructors fetch error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch instructors' },
      { status: 500 }
    )
  }
}
