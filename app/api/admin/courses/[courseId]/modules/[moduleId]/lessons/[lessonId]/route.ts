import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

interface RouteParams {
  params: Promise<{ courseId: string; moduleId: string; lessonId: string }>
}

// GET - Get a single lesson
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { courseId, moduleId, lessonId } = await params
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

    const { data: lesson, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', lessonId)
      .eq('module_id', moduleId)
      .eq('course_id', courseId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
      }
      throw error
    }

    return NextResponse.json({ lesson })

  } catch (error) {
    console.error('Lesson fetch error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch lesson' },
      { status: 500 }
    )
  }
}

// PUT - Update a lesson
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { courseId, moduleId, lessonId } = await params
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
    const { title, description, content_type, video_url, video_duration_seconds, is_free_preview } = body

    // Build update object
    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() }
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (content_type !== undefined) updateData.content_type = content_type
    if (video_url !== undefined) updateData.video_url = video_url
    if (video_duration_seconds !== undefined) updateData.video_duration_seconds = video_duration_seconds
    if (is_free_preview !== undefined) updateData.is_free_preview = is_free_preview

    const { data: lesson, error } = await supabase
      .from('lessons')
      .update(updateData)
      .eq('id', lessonId)
      .eq('module_id', moduleId)
      .eq('course_id', courseId)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
      }
      throw error
    }

    return NextResponse.json({
      success: true,
      lesson,
      message: 'Lesson updated successfully',
    })

  } catch (error) {
    console.error('Lesson update error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update lesson' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a lesson
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { courseId, moduleId, lessonId } = await params
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

    // Verify lesson exists
    const { data: lesson, error: fetchError } = await supabase
      .from('lessons')
      .select('id, title')
      .eq('id', lessonId)
      .eq('module_id', moduleId)
      .eq('course_id', courseId)
      .single()

    if (fetchError || !lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    // Delete the lesson
    const { error: deleteError } = await supabase
      .from('lessons')
      .delete()
      .eq('id', lessonId)

    if (deleteError) throw deleteError

    // Update course totals
    await supabase.rpc('update_course_totals', { course_id_param: courseId })

    return NextResponse.json({
      success: true,
      message: `Lesson "${lesson.title}" has been deleted`,
    })

  } catch (error) {
    console.error('Lesson deletion error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete lesson' },
      { status: 500 }
    )
  }
}
