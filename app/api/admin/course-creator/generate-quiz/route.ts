import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { courseCreatorService, type QuizRequest } from '@/lib/services/course-creator'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()

    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if AI is configured
    if (!courseCreatorService.isConfigured()) {
      return NextResponse.json(
        { error: 'AI service not configured. Please set OPENAI_API_KEY.' },
        { status: 503 }
      )
    }

    const body = await request.json()
    const {
      courseName,
      moduleName,
      lessonTitle,
      objectives,
      keyConcepts,
      questionCount,
    } = body as QuizRequest

    if (!courseName || !moduleName) {
      return NextResponse.json(
        { error: 'Course name and module name are required' },
        { status: 400 }
      )
    }

    // Generate quiz
    const quiz = await courseCreatorService.generateQuiz({
      courseName,
      moduleName,
      lessonTitle,
      objectives: objectives || ['Demonstrate understanding of key concepts'],
      keyConcepts: keyConcepts || ['core concepts'],
      questionCount: questionCount || 5,
    })

    return NextResponse.json({
      success: true,
      quiz,
    })
  } catch (error) {
    console.error('Generate quiz error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate quiz' },
      { status: 500 }
    )
  }
}
