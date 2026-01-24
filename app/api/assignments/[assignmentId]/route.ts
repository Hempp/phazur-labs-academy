// Assignment Details API
// Retrieves assignment details and user's submission status

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ assignmentId: string }> }
) {
  try {
    const { assignmentId } = await params
    const supabase = await createServerSupabaseClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get assignment with course info
    const { data: assignment, error: assignmentError } = await supabase
      .from('assignments')
      .select(`
        *,
        course:courses (
          id,
          title,
          slug,
          instructor_id
        ),
        lesson:lessons (
          id,
          title,
          module_id
        )
      `)
      .eq('id', assignmentId)
      .single()

    if (assignmentError || !assignment) {
      return NextResponse.json(
        { error: 'Assignment not found' },
        { status: 404 }
      )
    }

    // Check if user is enrolled or is the instructor
    const isInstructor = assignment.course?.instructor_id === user.id

    if (!isInstructor) {
      const { data: enrollment } = await supabase
        .from('enrollments')
        .select('id')
        .eq('course_id', assignment.course_id)
        .eq('user_id', user.id)
        .single()

      if (!enrollment) {
        return NextResponse.json(
          { error: 'You must be enrolled in this course' },
          { status: 403 }
        )
      }
    }

    // Get user's submission if any
    const { data: submission } = await supabase
      .from('assignment_submissions')
      .select('*')
      .eq('assignment_id', assignmentId)
      .eq('user_id', user.id)
      .order('attempt_number', { ascending: false })
      .limit(1)
      .single()

    return NextResponse.json({
      assignment,
      submission: submission || null,
      isInstructor
    })
  } catch (error) {
    console.error('Assignment GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
