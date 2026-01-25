import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

interface RouteParams {
  params: Promise<{ courseId: string; moduleId: string }>
}

// GET - Get a single module with lessons
export async function GET(request: NextRequest, { params }: RouteParams) {
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

    const { data: module, error } = await supabase
      .from('modules')
      .select(`
        id,
        title,
        description,
        display_order,
        is_free_preview,
        created_at,
        updated_at,
        lessons (
          id,
          title,
          description,
          content_type,
          video_url,
          video_duration_seconds,
          display_order,
          is_free_preview,
          created_at
        )
      `)
      .eq('id', moduleId)
      .eq('course_id', courseId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Module not found' }, { status: 404 })
      }
      throw error
    }

    return NextResponse.json({ module })

  } catch (error) {
    console.error('Module fetch error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch module' },
      { status: 500 }
    )
  }
}

// PUT - Update a module
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
    const { title, description, is_free_preview } = body

    // Build update object
    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() }
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (is_free_preview !== undefined) updateData.is_free_preview = is_free_preview

    const { data: module, error } = await supabase
      .from('modules')
      .update(updateData)
      .eq('id', moduleId)
      .eq('course_id', courseId)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Module not found' }, { status: 404 })
      }
      throw error
    }

    return NextResponse.json({
      success: true,
      module,
      message: 'Module updated successfully',
    })

  } catch (error) {
    console.error('Module update error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update module' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a module
export async function DELETE(request: NextRequest, { params }: RouteParams) {
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

    // Verify module exists
    const { data: module, error: fetchError } = await supabase
      .from('modules')
      .select('id, title')
      .eq('id', moduleId)
      .eq('course_id', courseId)
      .single()

    if (fetchError || !module) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 })
    }

    // Delete the module (cascades to lessons due to FK constraints)
    const { error: deleteError } = await supabase
      .from('modules')
      .delete()
      .eq('id', moduleId)

    if (deleteError) throw deleteError

    return NextResponse.json({
      success: true,
      message: `Module "${module.title}" has been deleted`,
    })

  } catch (error) {
    console.error('Module deletion error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete module' },
      { status: 500 }
    )
  }
}
