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
    // Handle Supabase returning modules as array or object
    const moduleData = Array.isArray(lesson.modules) ? lesson.modules[0] : lesson.modules
    const courseId = lesson.course_id || (moduleData as { course_id: string })?.course_id

    console.log('Lesson completion debug:', {
      lessonId,
      lessonCourseId: lesson.course_id,
      moduleCourseId: (moduleData as { course_id: string })?.course_id,
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

    // =============================================
    // GAMIFICATION: Award points and check achievements
    // =============================================
    let gamificationResult = null
    try {
      gamificationResult = await processGamificationRewards(
        supabase,
        user.id,
        {
          type: 'lesson_complete',
          lessonId,
          courseId,
          courseCompleted,
        }
      )
    } catch (gamificationError) {
      console.error('Gamification error (non-blocking):', gamificationError)
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
      certificate,
      gamification: gamificationResult
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

// Gamification rewards processing
async function processGamificationRewards(
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>,
  userId: string,
  event: {
    type: 'lesson_complete' | 'quiz_pass' | 'quiz_perfect' | 'course_complete'
    lessonId?: string
    quizId?: string
    courseId?: string
    courseCompleted?: boolean
    quizScore?: number
  }
) {
  const results = {
    points_awarded: 0,
    achievements_unlocked: 0,
    streak_updated: false,
    new_streak: 0,
  }

  try {
    // Update streak first
    const { data: streakData } = await supabase
      .rpc('update_user_streak', { p_user_id: userId })

    if (streakData !== null) {
      results.streak_updated = true
      results.new_streak = streakData
    }

    // Award points based on event type
    let points = 0
    let transactionType: string = 'lesson_complete'
    let description = ''

    switch (event.type) {
      case 'lesson_complete':
        points = 10
        transactionType = 'lesson_complete'
        description = 'Completed a lesson'
        break
      case 'quiz_pass':
        points = 25
        transactionType = 'quiz_pass'
        description = 'Passed a quiz'
        break
      case 'quiz_perfect':
        points = 50
        transactionType = 'quiz_perfect'
        description = 'Perfect quiz score!'
        break
      case 'course_complete':
        points = 100
        transactionType = 'course_complete'
        description = 'Completed a course!'
        break
    }

    // Award the points
    const { data: newBalance } = await supabase
      .rpc('award_points', {
        p_user_id: userId,
        p_transaction_type: transactionType,
        p_points: points,
        p_reference_type: event.lessonId ? 'lesson' : event.quizId ? 'quiz' : event.courseId ? 'course' : null,
        p_reference_id: event.lessonId || event.quizId || event.courseId || null,
        p_description: description,
      })

    if (newBalance !== null) {
      results.points_awarded = points
    }

    // If course completed, award additional points
    if (event.courseCompleted && event.type !== 'course_complete') {
      const { data: courseBonus } = await supabase
        .rpc('award_points', {
          p_user_id: userId,
          p_transaction_type: 'course_complete',
          p_points: 100,
          p_reference_type: 'course',
          p_reference_id: event.courseId,
          p_description: 'Course completion bonus!',
        })

      if (courseBonus !== null) {
        results.points_awarded += 100
      }
    }

    // Update user stats
    await updateUserGamificationStats(supabase, userId, event)

    // Check for new achievements
    const { data: achievementsUnlocked } = await supabase
      .rpc('check_achievements', { p_user_id: userId })

    if (achievementsUnlocked) {
      results.achievements_unlocked = achievementsUnlocked
    }

    return results
  } catch (error) {
    console.error('Error processing gamification rewards:', error)
    return results
  }
}

// Update gamification stats based on event
async function updateUserGamificationStats(
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>,
  userId: string,
  event: {
    type: string
    courseCompleted?: boolean
    quizScore?: number
  }
) {
  try {
    switch (event.type) {
      case 'lesson_complete':
        await supabase.rpc('increment_stat', {
          p_user_id: userId,
          p_stat_name: 'lessons_completed',
          p_increment: 1,
        })
        break

      case 'quiz_pass':
        await supabase.rpc('increment_stat', {
          p_user_id: userId,
          p_stat_name: 'quizzes_passed',
          p_increment: 1,
        })
        break

      case 'quiz_perfect':
        await supabase.rpc('increment_stat', {
          p_user_id: userId,
          p_stat_name: 'perfect_quizzes',
          p_increment: 1,
        })
        break
    }

    if (event.courseCompleted) {
      await supabase.rpc('increment_stat', {
        p_user_id: userId,
        p_stat_name: 'courses_completed',
        p_increment: 1,
      })

      // Also increment certificates since course completion generates one
      await supabase.rpc('increment_stat', {
        p_user_id: userId,
        p_stat_name: 'certificates_earned',
        p_increment: 1,
      })
    }
  } catch (error) {
    console.log('increment_stat RPC not available or failed:', error)
  }
}
