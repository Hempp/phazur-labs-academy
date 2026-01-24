// Assignment Submission API
// Handles student assignment submissions

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function POST(
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

    const body = await request.json()
    const { submissionType, fileUrl, fileName, fileSize, urlLink, textContent } = body

    if (!submissionType) {
      return NextResponse.json(
        { error: 'submissionType is required' },
        { status: 400 }
      )
    }

    // Validate submission content based on type
    if (submissionType === 'file' && !fileUrl) {
      return NextResponse.json(
        { error: 'fileUrl is required for file submissions' },
        { status: 400 }
      )
    }
    if (submissionType === 'url' && !urlLink) {
      return NextResponse.json(
        { error: 'urlLink is required for URL submissions' },
        { status: 400 }
      )
    }
    if (submissionType === 'text' && !textContent) {
      return NextResponse.json(
        { error: 'textContent is required for text submissions' },
        { status: 400 }
      )
    }

    // Get assignment
    const { data: assignment, error: assignmentError } = await supabase
      .from('assignments')
      .select('id, course_id, title, submission_types')
      .eq('id', assignmentId)
      .single()

    if (assignmentError || !assignment) {
      return NextResponse.json(
        { error: 'Assignment not found' },
        { status: 404 }
      )
    }

    // Check submission type is allowed
    if (!assignment.submission_types.includes(submissionType)) {
      return NextResponse.json(
        { error: `Submission type '${submissionType}' is not allowed for this assignment` },
        { status: 400 }
      )
    }

    // Get user's enrollment
    const { data: enrollment, error: enrollmentError } = await supabase
      .from('enrollments')
      .select('id')
      .eq('course_id', assignment.course_id)
      .eq('user_id', user.id)
      .single()

    if (enrollmentError || !enrollment) {
      return NextResponse.json(
        { error: 'You must be enrolled in this course to submit' },
        { status: 403 }
      )
    }

    // Check for existing submission
    const { data: existingSubmission } = await supabase
      .from('assignment_submissions')
      .select('id, status, attempt_number')
      .eq('assignment_id', assignmentId)
      .eq('user_id', user.id)
      .order('attempt_number', { ascending: false })
      .limit(1)
      .single()

    // Determine if this is a resubmission
    let attemptNumber = 1
    let previousSubmissionId = null

    if (existingSubmission) {
      if (existingSubmission.status === 'graded' || existingSubmission.status === 'resubmit') {
        // Allow resubmission
        attemptNumber = existingSubmission.attempt_number + 1
        previousSubmissionId = existingSubmission.id
      } else if (existingSubmission.status === 'submitted' || existingSubmission.status === 'pending') {
        // Update existing pending submission
        const { data: updatedSubmission, error: updateError } = await supabase
          .from('assignment_submissions')
          .update({
            submission_type: submissionType,
            file_url: fileUrl || null,
            file_name: fileName || null,
            file_size: fileSize || null,
            url_link: urlLink || null,
            text_content: textContent || null,
            submitted_at: new Date().toISOString(),
            status: 'submitted',
            updated_at: new Date().toISOString()
          })
          .eq('id', existingSubmission.id)
          .select()
          .single()

        if (updateError) {
          return NextResponse.json({ error: updateError.message }, { status: 500 })
        }

        return NextResponse.json({
          message: 'Submission updated successfully',
          submission: updatedSubmission
        })
      }
    }

    // Create new submission
    const { data: submission, error: submitError } = await supabase
      .from('assignment_submissions')
      .insert({
        assignment_id: assignmentId,
        user_id: user.id,
        enrollment_id: enrollment.id,
        submission_type: submissionType,
        file_url: fileUrl || null,
        file_name: fileName || null,
        file_size: fileSize || null,
        url_link: urlLink || null,
        text_content: textContent || null,
        status: 'submitted',
        attempt_number: attemptNumber,
        previous_submission_id: previousSubmissionId
      })
      .select()
      .single()

    if (submitError) {
      return NextResponse.json({ error: submitError.message }, { status: 500 })
    }

    return NextResponse.json({
      message: attemptNumber > 1 ? 'Resubmission successful' : 'Assignment submitted successfully',
      submission
    })
  } catch (error) {
    console.error('Assignment submit error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Grade submission (instructor only)
export async function PATCH(
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

    const body = await request.json()
    const { submissionId, score, feedback, rubricScores, status } = body

    if (!submissionId) {
      return NextResponse.json(
        { error: 'submissionId is required' },
        { status: 400 }
      )
    }

    // Get the submission and verify instructor
    const { data: submission, error: submissionError } = await supabase
      .from('assignment_submissions')
      .select(`
        id,
        assignment:assignments (
          id,
          course_id,
          max_score,
          course:courses (
            instructor_id
          )
        )
      `)
      .eq('id', submissionId)
      .single()

    if (submissionError || !submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      )
    }

    // Check if user is the instructor
    // Supabase returns nested objects, handle the assignment shape
    const assignmentData = submission.assignment as unknown as {
      id: string
      course_id: string
      max_score: number
      course: { instructor_id: string }
    }

    if (assignmentData.course.instructor_id !== user.id) {
      return NextResponse.json(
        { error: 'Only the course instructor can grade submissions' },
        { status: 403 }
      )
    }

    // Validate score
    if (score !== undefined && (score < 0 || score > assignmentData.max_score)) {
      return NextResponse.json(
        { error: `Score must be between 0 and ${assignmentData.max_score}` },
        { status: 400 }
      )
    }

    // Update submission with grade
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString()
    }

    if (score !== undefined) {
      updateData.score = score
      updateData.status = 'graded'
      updateData.graded_at = new Date().toISOString()
      updateData.graded_by = user.id
    }

    if (feedback !== undefined) {
      updateData.feedback = feedback
    }

    if (rubricScores !== undefined) {
      updateData.rubric_scores = rubricScores
    }

    if (status === 'resubmit') {
      updateData.status = 'resubmit'
    }

    const { data: gradedSubmission, error: gradeError } = await supabase
      .from('assignment_submissions')
      .update(updateData)
      .eq('id', submissionId)
      .select()
      .single()

    if (gradeError) {
      return NextResponse.json({ error: gradeError.message }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Submission graded successfully',
      submission: gradedSubmission
    })
  } catch (error) {
    console.error('Assignment grade error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
