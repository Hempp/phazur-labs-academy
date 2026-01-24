import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { courseCreatorService, type OutlineRequest } from '@/lib/services/course-creator'

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
    const { topic, audience, level, duration } = body as OutlineRequest

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      )
    }

    // Generate course outline
    const outline = await courseCreatorService.generateOutline({
      topic,
      audience: audience || 'General learners',
      level: level || 'beginner',
      duration: duration || '4-6 lessons',
    })

    // Calculate statistics
    const stats = courseCreatorService.estimateDuration(outline)

    return NextResponse.json({
      success: true,
      outline,
      stats,
    })
  } catch (error) {
    console.error('Generate outline error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate outline' },
      { status: 500 }
    )
  }
}
