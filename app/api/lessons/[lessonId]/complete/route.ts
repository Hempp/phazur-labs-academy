// Lesson Completion API
// Quick endpoint to mark a lesson as complete

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createServerSupabaseAdmin } from '@/lib/supabase/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { lessonId } = await params
    const supabase = await createServerSupabaseClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Admin client bypasses RLS for fetching lesson data
    const supabaseAdmin = await createServerSupabaseAdmin()

    // Get the lesson with its module to find the course_id (using admin to bypass RLS)
    const { data: lesson, error: lessonError } = await supabaseAdmin
      .from('lessons')
      .select(`
        id,
        title,
        module_id,
        course_id,
        modules!inner (
          id,
          course_id
        )
      `)
      .eq('id', lessonId)
      .single()

    if (lessonError || !lesson) {
      console.error('Lesson fetch error:', lessonError)
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      )
    }

    // Get course_id either from lesson directly or from module
    const courseId = lesson.course_id || (lesson.modules as { course_id: string })?.course_id

    console.log('Lesson completion debug:', {
      lessonId,
      lessonCourseId: lesson.course_id,
      moduleCourseId: (lesson.modules as { course_id: string })?.course_id,
      resolvedCourseId: courseId,
      userId: user.id
    })

    if (!courseId) {
      return NextResponse.json(
        { error: 'Could not determine course for this lesson' },
        { status: 500 }
      )
    }

    // Find the user's enrollment for this course
    const { data: enrollment, error: enrollmentError } = await supabase
      .from('enrollments')
      .select('id, progress_percentage, is_active')
      .eq('course_id', courseId)
      .eq('user_id', user.id)
      .single()

    console.log('Enrollment lookup:', { enrollment, enrollmentError })

    if (enrollmentError || !enrollment) {
      return NextResponse.json(
        { error: 'You are not enrolled in this course', debug: { courseId, userId: user.id, enrollmentError } },
        { status: 403 }
      )
    }

    // Check if lesson already completed
    const { data: existingProgress } = await supabase
      .from('lesson_progress')
      .select('id, is_completed')
      .eq('user_id', user.id)
      .eq('lesson_id', lessonId)
      .single()

    if (existingProgress?.is_completed) {
      return NextResponse.json({
        message: 'Lesson already completed',
        alreadyCompleted: true,
        lessonProgress: existingProgress
      })
    }

    // Mark lesson as complete
    let lessonProgress

    if (existingProgress) {
      const { data, error } = await supabase
        .from('lesson_progress')
        .update({
          is_completed: true,
          completed_at: new Date().toISOString()
        })
        .eq('id', existingProgress.id)
        .select()
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      lessonProgress = data
    } else {
      const { data, error } = await supabase
        .from('lesson_progress')
        .insert({
          user_id: user.id,
          lesson_id: lessonId,
          course_id: courseId,
          is_completed: true,
          completed_at: new Date().toISOString(),
          watch_time_seconds: 0
        })
        .select()
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      lessonProgress = data
    }

    // Update enrollment progress
    const { totalLessons, completedCount, newProgress } = await updateEnrollmentProgress(
      supabase,
      enrollment.id,
      courseId,
      user.id
    )

    const courseCompleted = newProgress === 100

    // If course complete, check for certificate
    let certificate = null
    if (courseCompleted) {
      const { data: cert } = await supabase
        .from('certificates')
        .select('*')
        .eq('enrollment_id', enrollment.id)
        .single()

      certificate = cert
    }

    return NextResponse.json({
      message: courseCompleted
        ? 'Congratulations! Course completed!'
        : 'Lesson completed successfully',
      lessonProgress,
      progress: {
        totalLessons,
        completedLessons: completedCount,
        percentage: newProgress,
        courseCompleted
      },
      certificate
    })
  } catch (error) {
    console.error('Lesson complete error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function updateEnrollmentProgress(
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>,
  enrollmentId: string,
  courseId: string,
  userId: string
) {
  // Use admin client to bypass RLS for lessons query
  const supabaseAdmin = await createServerSupabaseAdmin()

  // Get total lessons for course (admin bypasses RLS)
  const { data: courseLessons } = await supabaseAdmin
    .from('lessons')
    .select('id')
    .eq('course_id', courseId)

  const totalLessons = courseLessons?.length || 0

  // Get completed lessons
  const { data: completedLessons } = await supabase
    .from('lesson_progress')
    .select('lesson_id')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .eq('is_completed', true)

  const completedCount = completedLessons?.length || 0
  const newProgress = totalLessons > 0
    ? Math.round((completedCount / totalLessons) * 100)
    : 0

  // Update enrollment
  const updateData: Record<string, unknown> = {
    progress_percentage: newProgress
  }

  // Check if course is complete
  if (newProgress === 100) {
    updateData.completed_at = new Date().toISOString()
  }

  await supabase
    .from('enrollments')
    .update(updateData)
    .eq('id', enrollmentId)

  // If course complete, generate certificate
  if (newProgress === 100) {
    await generateCertificate(courseId, userId)
  }

  return { totalLessons, completedCount, newProgress }
}

async function generateCertificate(
  courseId: string,
  userId: string
) {
  // Use admin client to bypass RLS (certificates table has no INSERT policy)
  const supabaseAdmin = await createServerSupabaseAdmin()

  // Check if certificate already exists (by user_id + course_id, unique constraint)
  const { data: existingCert } = await supabaseAdmin
    .from('certificates')
    .select('id, certificate_number')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .single()

  if (existingCert) {
    console.log('Certificate already exists:', existingCert.certificate_number)
    return existingCert
  }

  const certificateNumber = `PHZR-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

  // Insert certificate with only the columns that exist in the schema
  const { data: certificate, error } = await supabaseAdmin
    .from('certificates')
    .insert({
      user_id: userId,
      course_id: courseId,
      certificate_number: certificateNumber,
      verification_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://phazuracademy.com'}/verify/${certificateNumber}`,
      grade: 'Pass'
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating certificate:', error)
    return null
  }

  console.log(`Certificate ${certificateNumber} generated for user ${userId}`)
  return certificate
}
