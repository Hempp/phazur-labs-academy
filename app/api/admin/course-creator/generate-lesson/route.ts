import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { courseCreatorService, type LessonScriptRequest } from '@/lib/services/course-creator'

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
      duration,
      objectives,
      previousContext,
    } = body as LessonScriptRequest

    if (!courseName || !lessonTitle) {
      return NextResponse.json(
        { error: 'Course name and lesson title are required' },
        { status: 400 }
      )
    }

    // Generate lesson script
    const script = await courseCreatorService.generateLessonScript({
      courseName,
      moduleName: moduleName || 'Main Content',
      lessonTitle,
      duration: duration || 10,
      objectives: objectives || ['Understand the key concepts'],
      previousContext,
    })

    // Also generate plain text version for video
    const plainTextScript = courseCreatorService.scriptToPlainText(script)

    return NextResponse.json({
      success: true,
      script,
      plainTextScript,
    })
  } catch (error) {
    console.error('Generate lesson error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate lesson' },
      { status: 500 }
    )
  }
}
