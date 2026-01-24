import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { courseCreatorService, type AssignmentRequest } from '@/lib/services/course-creator'

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
      skills,
    } = body as AssignmentRequest

    if (!courseName || !moduleName) {
      return NextResponse.json(
        { error: 'Course name and module name are required' },
        { status: 400 }
      )
    }

    // Generate assignment
    const assignment = await courseCreatorService.generateAssignment({
      courseName,
      moduleName,
      lessonTitle,
      objectives: objectives || ['Apply learned concepts'],
      skills: skills || ['practical application'],
    })

    return NextResponse.json({
      success: true,
      assignment,
    })
  } catch (error) {
    console.error('Generate assignment error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate assignment' },
      { status: 500 }
    )
  }
}
