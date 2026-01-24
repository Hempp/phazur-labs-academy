// Course Assignments API
// Lists all assignments for a course with submission status

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params
    const supabase = await createServerSupabaseClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is enrolled or is the instructor
    const { data: course } = await supabase
      .from('courses')
      .select('id, instructor_id')
      .eq('id', courseId)
      .single()

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    const isInstructor = course.instructor_id === user.id

    if (!isInstructor) {
      const { data: enrollment } = await supabase
        .from('enrollments')
        .select('id')
        .eq('course_id', courseId)
        .eq('user_id', user.id)
        .single()

      if (!enrollment) {
        return NextResponse.json(
          { error: 'You must be enrolled in this course' },
          { status: 403 }
        )
      }
    }

    // Get all assignments for the course
    const { data: assignments, error: assignmentsError } = await supabase
      .from('assignments')
      .select(`
        *,
        lesson:lessons (
          id,
          title,
          module_id
        )
      `)
      .eq('course_id', courseId)
      .order('display_order', { ascending: true })

    if (assignmentsError) {
      return NextResponse.json({ error: assignmentsError.message }, { status: 500 })
    }

    // Get user's submissions for all assignments
    const assignmentIds = assignments?.map(a => a.id) || []

    let submissions: Record<string, unknown>[] = []
    if (assignmentIds.length > 0) {
      const { data: userSubmissions } = await supabase
        .from('assignment_submissions')
        .select('*')
        .eq('user_id', user.id)
        .in('assignment_id', assignmentIds)
        .order('attempt_number', { ascending: false })

      submissions = userSubmissions || []
    }

    // Map submissions to assignments
    const submissionsByAssignment: Record<string, unknown> = {}
    for (const submission of submissions) {
      const assignmentId = submission.assignment_id as string
      if (!submissionsByAssignment[assignmentId]) {
        submissionsByAssignment[assignmentId] = submission
      }
    }

    // Combine assignments with their submissions
    const assignmentsWithStatus = assignments?.map(assignment => ({
      ...assignment,
      submission: submissionsByAssignment[assignment.id] || null,
      status: submissionsByAssignment[assignment.id]
        ? (submissionsByAssignment[assignment.id] as { status: string }).status
        : 'not_started'
    })) || []

    // Calculate summary stats
    const totalAssignments = assignmentsWithStatus.length
    const submittedCount = assignmentsWithStatus.filter(
      a => a.submission && ['submitted', 'graded'].includes(a.status)
    ).length
    const gradedCount = assignmentsWithStatus.filter(
      a => a.status === 'graded'
    ).length
    const pendingCount = assignmentsWithStatus.filter(
      a => a.status === 'submitted'
    ).length
    const needsResubmitCount = assignmentsWithStatus.filter(
      a => a.status === 'resubmit'
    ).length

    return NextResponse.json({
      assignments: assignmentsWithStatus,
      summary: {
        total: totalAssignments,
        submitted: submittedCount,
        graded: gradedCount,
        pending: pendingCount,
        needsResubmit: needsResubmitCount,
        notStarted: totalAssignments - submittedCount - needsResubmitCount
      },
      isInstructor
    })
  } catch (error) {
    console.error('Course assignments GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
