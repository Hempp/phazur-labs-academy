// Progress Tracking API
// Handles student course progress and lesson completion

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')
    const enrollmentId = searchParams.get('enrollmentId')

    // Get specific enrollment progress
    if (enrollmentId) {
      const { data: enrollment, error } = await supabase
        .from('enrollments')
        .select(`
          *,
          lesson_progress (*)
        `)
        .eq('id', enrollmentId)
        .eq('user_id', user.id)
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 404 })
      }

      return NextResponse.json({ enrollment })
    }

    // Get progress for a specific course
    if (courseId) {
      const { data: enrollment, error } = await supabase
        .from('enrollments')
        .select(`
          *,
          lesson_progress (*)
        `)
        .eq('course_id', courseId)
        .eq('user_id', user.id)
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 404 })
      }

      return NextResponse.json({ enrollment })
    }

    // Get all enrollments with progress for the user
    const { data: enrollments, error } = await supabase
      .from('enrollments')
      .select(`
        *,
        lesson_progress (*)
      `)
      .eq('user_id', user.id)
      .order('enrolled_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ enrollments })
  } catch (error) {
    console.error('Progress GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { enrollmentId, lessonId, watchTimeSeconds, completed } = body

    if (!enrollmentId || !lessonId) {
      return NextResponse.json(
        { error: 'enrollmentId and lessonId are required' },
        { status: 400 }
      )
    }

    // Verify user owns this enrollment
    const { data: enrollment, error: enrollmentError } = await supabase
      .from('enrollments')
      .select('id, course_id, completed_lessons, progress')
      .eq('id', enrollmentId)
      .eq('user_id', user.id)
      .single()

    if (enrollmentError || !enrollment) {
      return NextResponse.json(
        { error: 'Enrollment not found' },
        { status: 404 }
      )
    }

    // Check if lesson progress exists
    const { data: existingProgress } = await supabase
      .from('lesson_progress')
      .select('*')
      .eq('enrollment_id', enrollmentId)
      .eq('lesson_id', lessonId)
      .single()

    let lessonProgress

    if (existingProgress) {
      // Update existing progress
      const updateData: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      }

      if (watchTimeSeconds !== undefined) {
        updateData.watch_time_seconds = Math.max(
          existingProgress.watch_time_seconds || 0,
          watchTimeSeconds
        )
      }

      if (completed && !existingProgress.completed) {
        updateData.completed = true
        updateData.completed_at = new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('lesson_progress')
        .update(updateData)
        .eq('id', existingProgress.id)
        .select()
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      lessonProgress = data
    } else {
      // Create new progress record
      const { data, error } = await supabase
        .from('lesson_progress')
        .insert({
          enrollment_id: enrollmentId,
          lesson_id: lessonId,
          watch_time_seconds: watchTimeSeconds || 0,
          completed: completed || false,
          completed_at: completed ? new Date().toISOString() : null,
        })
        .select()
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      lessonProgress = data
    }

    // If lesson marked complete, update enrollment progress
    if (completed) {
      await updateEnrollmentProgress(supabase, enrollmentId, enrollment.course_id, user.id)
    }

    return NextResponse.json({ lessonProgress })
  } catch (error) {
    console.error('Progress POST error:', error)
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
  // Get total lessons for course
  const { data: courseLessons } = await supabase
    .from('lessons')
    .select('id')
    .eq('course_id', courseId)

  const totalLessons = courseLessons?.length || 0

  // Get completed lessons
  const { data: completedLessons } = await supabase
    .from('lesson_progress')
    .select('lesson_id')
    .eq('enrollment_id', enrollmentId)
    .eq('completed', true)

  const completedCount = completedLessons?.length || 0
  const progressPercentage = totalLessons > 0
    ? Math.round((completedCount / totalLessons) * 100)
    : 0

  // Update enrollment
  const updateData: Record<string, unknown> = {
    progress: progressPercentage,
    completed_lessons: completedLessons?.map(l => l.lesson_id) || [],
    last_accessed_at: new Date().toISOString(),
  }

  // Check if course is complete
  if (progressPercentage === 100) {
    updateData.status = 'completed'
    updateData.completed_at = new Date().toISOString()
  }

  await supabase
    .from('enrollments')
    .update(updateData)
    .eq('id', enrollmentId)

  // If course complete, generate certificate
  if (progressPercentage === 100) {
    await generateCertificate(supabase, enrollmentId, courseId, userId)
  }
}

async function generateCertificate(
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>,
  enrollmentId: string,
  courseId: string,
  userId: string
) {
  // Check if certificate already exists
  const { data: existingCert } = await supabase
    .from('certificates')
    .select('id')
    .eq('enrollment_id', enrollmentId)
    .single()

  if (existingCert) {
    return // Certificate already issued
  }

  // Get course and user details
  const { data: course } = await supabase
    .from('courses')
    .select('title, slug')
    .eq('id', courseId)
    .single()

  const { data: profile } = await supabase
    .from('users')
    .select('full_name, email')
    .eq('id', userId)
    .single()

  const certificateNumber = `PHZR-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

  // Create certificate
  const { data: certificate, error } = await supabase
    .from('certificates')
    .insert({
      user_id: userId,
      course_id: courseId,
      enrollment_id: enrollmentId,
      course_title: course?.title || 'Unknown Course',
      student_name: profile?.full_name || profile?.email || 'Student',
      issue_date: new Date().toISOString(),
      certificate_number: certificateNumber,
      verification_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://phazuracademy.com'}/verify/${certificateNumber}`,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating certificate:', error)
    return
  }

  // Update enrollment with certificate ID
  await supabase
    .from('enrollments')
    .update({ certificate_id: certificate.id })
    .eq('id', enrollmentId)

  console.log(`Certificate ${certificateNumber} generated for user ${userId}`)
}
