// Quiz Attempts API
// Save and retrieve quiz attempts

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

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

// In-memory storage for mock attempts (resets on server restart)
const mockAttempts: Array<{
  id: string
  quiz_id: string
  user_id: string
  answers: Record<string, string | string[]>
  score: number
  passed: boolean
  started_at: string
  completed_at: string
}> = []

// GET: Get attempts for a quiz
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ quizId: string }> }
) {
  try {
    const { quizId } = await params

    // Return mock data if Supabase is not configured
    if (!isSupabaseConfigured()) {
      const attempts = mockAttempts.filter(a => a.quiz_id === quizId)
      return NextResponse.json({
        attempts,
        bestScore: attempts.length > 0 ? Math.max(...attempts.map(a => a.score)) : null,
        attemptCount: attempts.length,
        hasPassed: attempts.some(a => a.passed),
      })
    }

    const supabase = await createServerSupabaseClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      // Fallback to mock data for unauthenticated users
      console.log('Using mock attempts data - user not authenticated')
      const attempts = mockAttempts.filter(a => a.quiz_id === quizId)
      return NextResponse.json({
        attempts,
        bestScore: attempts.length > 0 ? Math.max(...attempts.map(a => a.score)) : null,
        attemptCount: attempts.length,
        hasPassed: attempts.some(a => a.passed),
      })
    }

    const { data: attempts, error } = await supabase
      .from('quiz_attempts')
      .select('*')
      .eq('quiz_id', quizId)
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const bestScore = attempts && attempts.length > 0
      ? Math.max(...attempts.map(a => a.score))
      : null

    return NextResponse.json({
      attempts,
      bestScore,
      attemptCount: attempts?.length || 0,
      hasPassed: attempts?.some(a => a.passed) || false,
    })
  } catch (error) {
    console.error('Quiz attempts GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST: Submit a quiz attempt
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ quizId: string }> }
) {
  try {
    const { quizId } = await params
    const body = await request.json()
    const { answers, score, passed, startedAt, completedAt } = body

    if (answers === undefined || score === undefined || passed === undefined) {
      return NextResponse.json(
        { error: 'answers, score, and passed are required' },
        { status: 400 }
      )
    }

    // Handle mock mode
    if (!isSupabaseConfigured()) {
      const attempt = {
        id: `attempt-${Date.now()}`,
        quiz_id: quizId,
        user_id: 'mock-user',
        answers,
        score,
        passed,
        started_at: startedAt || new Date().toISOString(),
        completed_at: completedAt || new Date().toISOString(),
      }

      mockAttempts.push(attempt)

      return NextResponse.json({
        message: 'Quiz attempt saved successfully',
        attempt,
      })
    }

    const supabase = await createServerSupabaseClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      // Fallback to mock mode for unauthenticated users
      console.log('Using mock mode for saving attempt - user not authenticated')
      const attempt = {
        id: `attempt-${Date.now()}`,
        quiz_id: quizId,
        user_id: 'mock-user',
        answers,
        score,
        passed,
        started_at: startedAt || new Date().toISOString(),
        completed_at: completedAt || new Date().toISOString(),
      }

      mockAttempts.push(attempt)

      return NextResponse.json({
        message: 'Quiz attempt saved successfully',
        attempt,
      })
    }

    // Verify quiz exists
    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .select('id, course_id, lesson_id, allow_retry')
      .eq('id', quizId)
      .single()

    if (quizError || !quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      )
    }

    // Check if user has already passed (if retry not allowed)
    if (!quiz.allow_retry) {
      const { data: existingAttempts } = await supabase
        .from('quiz_attempts')
        .select('id, passed')
        .eq('quiz_id', quizId)
        .eq('user_id', user.id)
        .eq('passed', true)

      if (existingAttempts && existingAttempts.length > 0) {
        return NextResponse.json(
          { error: 'You have already passed this quiz' },
          { status: 400 }
        )
      }
    }

    // Save attempt
    const { data: attempt, error: insertError } = await supabase
      .from('quiz_attempts')
      .insert({
        quiz_id: quizId,
        user_id: user.id,
        answers,
        score,
        passed,
        started_at: startedAt || new Date().toISOString(),
        completed_at: completedAt || new Date().toISOString(),
      })
      .select()
      .single()

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    // If passed, update progress
    if (passed && quiz.course_id) {
      // Get user's enrollment for this course
      const { data: enrollment } = await supabase
        .from('enrollments')
        .select('id')
        .eq('course_id', quiz.course_id)
        .eq('user_id', user.id)
        .single()

      if (enrollment && quiz.lesson_id) {
        // Mark the associated lesson as complete
        const { data: existingProgress } = await supabase
          .from('lesson_progress')
          .select('id')
          .eq('enrollment_id', enrollment.id)
          .eq('lesson_id', quiz.lesson_id)
          .single()

        if (!existingProgress) {
          await supabase
            .from('lesson_progress')
            .insert({
              enrollment_id: enrollment.id,
              lesson_id: quiz.lesson_id,
              completed: true,
              completed_at: new Date().toISOString(),
            })
        }
      }
    }

    return NextResponse.json({
      message: 'Quiz attempt saved successfully',
      attempt,
    })
  } catch (error) {
    console.error('Quiz attempts POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
