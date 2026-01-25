import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

interface RouteParams {
  params: Promise<{ courseId: string; moduleId: string }>
}

// PUT - Reorder lessons within a module
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { courseId, moduleId } = await params
    const supabase = await createServerSupabaseClient()

    // Verify admin authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const { lessonIds } = body

    if (!lessonIds || !Array.isArray(lessonIds)) {
      return NextResponse.json({ error: 'lessonIds array is required' }, { status: 400 })
    }

    // Update display_order for each lesson
    const updates = lessonIds.map((lessonId: string, index: number) =>
      supabase
        .from('lessons')
        .update({ display_order: index, updated_at: new Date().toISOString() })
        .eq('id', lessonId)
        .eq('module_id', moduleId)
        .eq('course_id', courseId)
    )

    await Promise.all(updates)

    return NextResponse.json({
      success: true,
      message: 'Lessons reordered successfully',
    })

  } catch (error) {
    console.error('Lesson reorder error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to reorder lessons' },
      { status: 500 }
    )
  }
}
