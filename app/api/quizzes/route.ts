// Quizzes API
// List and create course quizzes

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

// Mock quizzes for development
const mockQuizzes = [
  {
    id: 'quiz-1',
    course_id: '1',
    lesson_id: 'l5',
    title: 'Compound Components Quiz',
    description: 'Test your understanding of the compound components pattern covered in this lesson.',
    time_limit: 15,
    passing_score: 70,
    shuffle_questions: true,
    allow_retry: true,
    show_results: true,
    question_count: 10,
    total_points: 100,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'quiz-2',
    course_id: '1',
    lesson_id: 'l6',
    title: 'Custom Hooks Mastery',
    description: 'Demonstrate your knowledge of custom React hooks and their best practices.',
    time_limit: 20,
    passing_score: 75,
    shuffle_questions: false,
    allow_retry: true,
    show_results: true,
    question_count: 8,
    total_points: 80,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'quiz-3',
    course_id: '1',
    lesson_id: null, // Module quiz - covers entire module
    title: 'Advanced React Patterns - Module Assessment',
    description: 'Comprehensive assessment covering all advanced React patterns from this module.',
    time_limit: 30,
    passing_score: 80,
    shuffle_questions: true,
    allow_retry: false,
    show_results: true,
    question_count: 15,
    total_points: 150,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

// GET: List quizzes for a course or lesson
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')
    const lessonId = searchParams.get('lessonId')

    if (!courseId) {
      return NextResponse.json(
        { error: 'courseId is required' },
        { status: 400 }
      )
    }

    // Return mock data if Supabase is not configured
    if (!isSupabaseConfigured()) {
      let filteredQuizzes = mockQuizzes.filter(q => q.course_id === courseId)

      if (lessonId) {
        filteredQuizzes = filteredQuizzes.filter(q => q.lesson_id === lessonId)
      }

      return NextResponse.json({ quizzes: filteredQuizzes })
    }

    const supabase = await createServerSupabaseClient()

    // Build query - match actual schema columns
    let query = supabase
      .from('quizzes')
      .select(`
        id,
        course_id,
        module_id,
        title,
        description,
        time_limit_minutes,
        passing_score,
        max_attempts,
        show_correct_answers,
        shuffle_questions,
        shuffle_answers,
        display_order,
        created_at
      `)
      .eq('course_id', courseId)
      .order('display_order', { ascending: true })

    // Note: lessonId from frontend maps to module_id in database
    if (lessonId) {
      query = query.eq('module_id', lessonId)
    }

    const { data: quizzes, error } = await query

    if (error) {
      console.error('Supabase quizzes query error:', error)
      // Fallback to mock data on database errors (e.g., ID format mismatch)
      let filteredQuizzes = mockQuizzes.filter(q => q.course_id === courseId)
      if (lessonId) {
        filteredQuizzes = filteredQuizzes.filter(q => q.lesson_id === lessonId)
      }
      return NextResponse.json({ quizzes: filteredQuizzes })
    }

    // If no quizzes found and using mock courseId format, return mock data
    if ((!quizzes || quizzes.length === 0) && /^\d+$/.test(courseId)) {
      let filteredQuizzes = mockQuizzes.filter(q => q.course_id === courseId)
      if (lessonId) {
        filteredQuizzes = filteredQuizzes.filter(q => q.lesson_id === lessonId)
      }
      return NextResponse.json({ quizzes: filteredQuizzes })
    }

    // Transform to match frontend expected format
    const transformedQuizzes = (quizzes || []).map(q => ({
      id: q.id,
      course_id: q.course_id,
      lesson_id: q.module_id, // Map module_id back to lesson_id for frontend
      title: q.title,
      description: q.description,
      time_limit: q.time_limit_minutes,
      passing_score: q.passing_score,
      shuffle_questions: q.shuffle_questions,
      allow_retry: q.max_attempts !== 1,
      show_results: q.show_correct_answers,
      created_at: q.created_at,
    }))

    return NextResponse.json({ quizzes: transformedQuizzes })
  } catch (error) {
    console.error('Quizzes GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST: Create a new quiz (admin only)
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

    // Check if user is admin or instructor
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || !['admin', 'instructor'].includes(profile.role)) {
      return NextResponse.json(
        { error: 'Only admins and instructors can create quizzes' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      courseId,
      lessonId,
      title,
      description,
      timeLimit,
      passingScore,
      shuffleQuestions,
      allowRetry,
      showResults,
      questions,
    } = body

    if (!courseId || !title || !questions || !questions.length) {
      return NextResponse.json(
        { error: 'courseId, title, and questions are required' },
        { status: 400 }
      )
    }

    // Create quiz
    const { data: quiz, error: insertError } = await supabase
      .from('quizzes')
      .insert({
        course_id: courseId,
        lesson_id: lessonId || null,
        title,
        description: description || null,
        time_limit: timeLimit || null,
        passing_score: passingScore || 70,
        shuffle_questions: shuffleQuestions || false,
        allow_retry: allowRetry ?? true,
        show_results: showResults ?? true,
        questions,
        is_published: false,
        created_by: user.id,
      })
      .select()
      .single()

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Quiz created successfully',
      quiz,
    })
  } catch (error) {
    console.error('Quizzes POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
