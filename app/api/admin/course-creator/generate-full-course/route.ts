import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { fullCourseGenerator, type FullCourseRequest } from '@/lib/services/full-course-generator'

export const maxDuration = 120 // Allow 2 minutes for full course generation

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()

    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // SECURITY: Verify user has admin or instructor role
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || !['admin', 'instructor'].includes(profile.role)) {
      return NextResponse.json(
        { error: 'Forbidden - Admin or instructor access required' },
        { status: 403 }
      )
    }

    // Check if AI is configured
    if (!fullCourseGenerator.isConfigured()) {
      return NextResponse.json(
        { error: 'AI service not configured. Please set OPENAI_API_KEY.' },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { topic, audience, difficulty, lessonCount } = body as FullCourseRequest

    // Validate required fields
    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      )
    }

    // Generate full course content
    const course = await fullCourseGenerator.generateFullCourse({
      topic,
      audience: audience || 'General learners',
      difficulty: difficulty || 'beginner',
      lessonCount: lessonCount || 6,
    })

    // Calculate statistics
    const stats = {
      totalLessons: course.lessons.length,
      totalQuizQuestions: course.lessons.reduce((sum, l) => sum + l.quiz.questions.length, 0),
      totalAssignments: course.lessons.length,
      estimatedVideoMinutes: course.lessons.length * 7, // ~7 min per lesson
    }

    return NextResponse.json({
      success: true,
      course,
      stats,
    })
  } catch (error) {
    console.error('Generate full course error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate course' },
      { status: 500 }
    )
  }
}
