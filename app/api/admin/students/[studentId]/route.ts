import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createServerSupabaseAdmin } from '@/lib/supabase/server'

interface RouteParams {
  params: Promise<{ studentId: string }>
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

// GET - Get a single student with detailed information
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { studentId } = await params

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

    // Get student
    const { data: student, error } = await supabase
      .from('users')
      .select('id, full_name, email, avatar_url, role, is_active, created_at, updated_at')
      .eq('id', studentId)
      .eq('role', 'student')
      .single()

    if (error || !student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    // Get enrollments with course details
    const { data: enrollments } = await supabase
      .from('enrollments')
      .select(`
        id,
        course_id,
        status,
        progress_percentage,
        enrolled_at,
        courses (
          id,
          title,
          slug
        )
      `)
      .eq('user_id', studentId)

    // Get payment total
    const { data: payments } = await supabase
      .from('payments')
      .select('amount')
      .eq('user_id', studentId)
      .eq('status', 'completed')

    const totalSpent = payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0
    const enrolledCourses = enrollments?.length || 0
    const completedCourses = enrollments?.filter(e => e.status === 'completed').length || 0
    const avgProgress = enrolledCourses > 0
      ? Math.round(enrollments!.reduce((sum, e) => sum + (e.progress_percentage || 0), 0) / enrolledCourses)
      : 0

    // Transform enrollments for response
    const formattedEnrollments = (enrollments || []).map(e => {
      const courseData = Array.isArray(e.courses) ? e.courses[0] : e.courses
      return {
        id: e.id,
        course_id: e.course_id,
        progress_percentage: e.progress_percentage || 0,
        status: e.status,
        enrolled_at: e.enrolled_at,
        courses: courseData || { id: e.course_id, title: 'Unknown Course', slug: '' },
      }
    })

    return NextResponse.json({
      student: {
        id: student.id,
        name: student.full_name || 'Unknown',
        email: student.email,
        avatar: student.avatar_url,
        enrolledCourses,
        completedCourses,
        progress: avgProgress,
        totalSpent,
        status: student.is_active === false ? 'inactive' : 'active',
        joinDate: student.created_at?.split('T')[0] || '',
        lastActive: getRelativeTime(student.updated_at),
        plan: 'basic',
        enrollments: formattedEnrollments,
      },
    })

  } catch (error) {
    console.error('Student fetch error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch student' },
      { status: 500 }
    )
  }
}

// PUT - Update a student
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { studentId } = await params

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

    // Verify student exists
    const { data: existingStudent, error: fetchError } = await supabase
      .from('users')
      .select('id, role')
      .eq('id', studentId)
      .single()

    if (fetchError || !existingStudent) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    if (existingStudent.role !== 'student') {
      return NextResponse.json({ error: 'User is not a student' }, { status: 400 })
    }

    const body = await request.json()
    const { name, email, status, courseIds } = body

    // Build update object
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }

    if (name !== undefined) updateData.full_name = name
    if (email !== undefined) updateData.email = email
    if (status !== undefined) updateData.is_active = status === 'active'

    // Check email uniqueness if changing
    if (email) {
      const { data: emailCheck } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .neq('id', studentId)
        .single()

      if (emailCheck) {
        return NextResponse.json(
          { error: 'Email already in use by another user' },
          { status: 409 }
        )
      }
    }

    // Update student
    const { data: updatedStudent, error: updateError } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', studentId)
      .select()
      .single()

    if (updateError) {
      throw updateError
    }

    // Handle course enrollments if specified
    if (courseIds !== undefined) {
      // Get current enrollments
      const { data: currentEnrollments } = await supabase
        .from('enrollments')
        .select('course_id')
        .eq('user_id', studentId)

      const currentCourseIds = (currentEnrollments || []).map(e => e.course_id)

      // Find courses to add and remove
      const toAdd = courseIds.filter((id: string) => !currentCourseIds.includes(id))
      const toRemove = currentCourseIds.filter(id => !courseIds.includes(id))

      // Add new enrollments
      if (toAdd.length > 0) {
        const newEnrollments = toAdd.map((courseId: string) => ({
          user_id: studentId,
          course_id: courseId,
          status: 'active',
          progress_percentage: 0,
        }))

        await supabase.from('enrollments').insert(newEnrollments)
      }

      // Remove old enrollments
      if (toRemove.length > 0) {
        await supabase
          .from('enrollments')
          .delete()
          .eq('user_id', studentId)
          .in('course_id', toRemove)
      }
    }

    // Fetch updated enrollment data
    const { data: enrollments } = await supabase
      .from('enrollments')
      .select('status, progress_percentage')
      .eq('user_id', studentId)

    const enrolledCourses = enrollments?.length || 0
    const completedCourses = enrollments?.filter(e => e.status === 'completed').length || 0
    const avgProgress = enrolledCourses > 0
      ? Math.round(enrollments!.reduce((sum, e) => sum + (e.progress_percentage || 0), 0) / enrolledCourses)
      : 0

    // Get payment total
    const { data: payments } = await supabase
      .from('payments')
      .select('amount')
      .eq('user_id', studentId)
      .eq('status', 'completed')

    const totalSpent = payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0

    return NextResponse.json({
      message: 'Student updated successfully',
      student: {
        id: updatedStudent.id,
        name: updatedStudent.full_name,
        email: updatedStudent.email,
        avatar: updatedStudent.avatar_url,
        enrolledCourses,
        completedCourses,
        progress: avgProgress,
        totalSpent,
        status: updatedStudent.is_active === false ? 'inactive' : 'active',
        joinDate: updatedStudent.created_at?.split('T')[0] || '',
        lastActive: 'Just now',
        plan: 'basic',
      },
    })

  } catch (error) {
    console.error('Student update error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update student' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a student
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { studentId } = await params

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

    // Verify student exists
    const { data: existingStudent, error: fetchError } = await supabase
      .from('users')
      .select('id, role')
      .eq('id', studentId)
      .single()

    if (fetchError || !existingStudent) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    if (existingStudent.role !== 'student') {
      return NextResponse.json({ error: 'User is not a student' }, { status: 400 })
    }

    // Delete related records first (cascade might not be set up)
    // Delete enrollments
    await supabase
      .from('enrollments')
      .delete()
      .eq('user_id', studentId)

    // Delete lesson progress
    await supabase
      .from('lesson_progress')
      .delete()
      .eq('user_id', studentId)

    // Delete quiz attempts
    await supabase
      .from('quiz_attempts')
      .delete()
      .eq('user_id', studentId)

    // Delete reviews
    await supabase
      .from('reviews')
      .delete()
      .eq('user_id', studentId)

    // Delete discussion replies
    await supabase
      .from('discussion_replies')
      .delete()
      .eq('user_id', studentId)

    // Delete discussions
    await supabase
      .from('discussions')
      .delete()
      .eq('user_id', studentId)

    // Finally delete the student user
    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .eq('id', studentId)

    if (deleteError) {
      throw deleteError
    }

    return NextResponse.json({
      message: 'Student deleted successfully',
    })

  } catch (error) {
    console.error('Student deletion error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete student' },
      { status: 500 }
    )
  }
}
