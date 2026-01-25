import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

interface RouteParams {
  params: Promise<{ studentId: string }>
}

// GET - Get a single student
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { studentId } = await params
    const supabase = await createServerSupabaseClient()

    // Verify admin authentication
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

    const { data: student, error } = await supabase
      .from('users')
      .select(`
        id,
        email,
        full_name,
        avatar_url,
        role,
        bio,
        created_at,
        is_active,
        preferences,
        enrollments:enrollments(
          id,
          course_id,
          enrolled_at,
          progress_percentage,
          completed_at,
          courses(id, title, slug)
        )
      `)
      .eq('id', studentId)
      .eq('role', 'student')
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Student not found' }, { status: 404 })
      }
      throw error
    }

    return NextResponse.json({
      student: {
        id: student.id,
        name: student.full_name,
        email: student.email,
        avatar: student.avatar_url,
        bio: student.bio,
        status: student.is_active ? 'Active' : 'Inactive',
        enrolledCourses: student.enrollments?.length || 0,
        enrollments: student.enrollments,
        joinDate: student.created_at,
        preferences: student.preferences,
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
    const supabase = await createServerSupabaseClient()

    // Verify admin authentication
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

    const body = await request.json()
    const { name, email, status, bio, courseIds } = body

    // Build update object
    const updateData: Record<string, unknown> = {}
    if (name !== undefined) updateData.full_name = name
    if (email !== undefined) updateData.email = email
    if (status !== undefined) updateData.is_active = status === 'Active'
    if (bio !== undefined) updateData.bio = bio

    // Check if email is changing and if it's already taken
    if (email) {
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .neq('id', studentId)
        .single()

      if (existingUser) {
        return NextResponse.json({ error: 'Email is already in use by another user' }, { status: 400 })
      }
    }

    // Update the student
    const { data: updatedStudent, error: updateError } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', studentId)
      .eq('role', 'student')
      .select()
      .single()

    if (updateError) {
      if (updateError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Student not found' }, { status: 404 })
      }
      throw updateError
    }

    // Update course enrollments if provided
    if (courseIds !== undefined) {
      // Get current enrollments
      const { data: currentEnrollments } = await supabase
        .from('enrollments')
        .select('course_id')
        .eq('user_id', studentId)

      const currentCourseIds = currentEnrollments?.map(e => e.course_id) || []
      const newCourseIds = courseIds as string[]

      // Courses to add
      const toAdd = newCourseIds.filter(id => !currentCourseIds.includes(id))
      // Courses to remove
      const toRemove = currentCourseIds.filter(id => !newCourseIds.includes(id))

      // Add new enrollments
      if (toAdd.length > 0) {
        const newEnrollments = toAdd.map(courseId => ({
          user_id: studentId,
          course_id: courseId,
          is_active: true,
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

    return NextResponse.json({
      success: true,
      student: {
        id: updatedStudent.id,
        name: updatedStudent.full_name,
        email: updatedStudent.email,
        status: updatedStudent.is_active ? 'Active' : 'Inactive',
      },
      message: 'Student updated successfully',
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
    const supabase = await createServerSupabaseClient()

    // Verify admin authentication
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

    // Verify student exists
    const { data: student, error: fetchError } = await supabase
      .from('users')
      .select('id, full_name')
      .eq('id', studentId)
      .eq('role', 'student')
      .single()

    if (fetchError || !student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    // Delete the student (cascades to enrollments, progress, etc due to FK constraints)
    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .eq('id', studentId)

    if (deleteError) {
      throw deleteError
    }

    return NextResponse.json({
      success: true,
      message: `Student "${student.full_name}" has been deleted`,
    })

  } catch (error) {
    console.error('Student deletion error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete student' },
      { status: 500 }
    )
  }
}
