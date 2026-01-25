import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

interface RouteParams {
  params: Promise<{ courseId: string; moduleId: string }>
}

// GET - List all lessons for a module
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

    const { data: lessons, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('module_id', moduleId)
      .eq('course_id', courseId)
      .order('display_order', { ascending: true })

    if (error) throw error

    return NextResponse.json({ lessons })

  } catch (error) {
    console.error('Lessons fetch error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch lessons' },
      { status: 500 }
    )
  }
}

// POST - Create a new lesson
export async function POST(request: NextRequest, { params }: RouteParams) {
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
    const { title, description, content_type, video_url, video_duration_seconds, is_free_preview } = body

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    // Get the highest display_order for this module
    const { data: existingLessons } = await supabase
      .from('lessons')
      .select('display_order')
      .eq('module_id', moduleId)
      .order('display_order', { ascending: false })
      .limit(1)

    const nextOrder = existingLessons && existingLessons.length > 0
      ? existingLessons[0].display_order + 1
      : 0

    // Create the lesson
    const { data: lesson, error } = await supabase
      .from('lessons')
      .insert({
        course_id: courseId,
        module_id: moduleId,
        title,
        description: description || null,
        content_type: content_type || 'video',
        video_url: video_url || null,
        video_duration_seconds: video_duration_seconds || 0,
        display_order: nextOrder,
        is_free_preview: is_free_preview || false,
      })
      .select()
      .single()

    if (error) throw error

    // Update course totals
    await supabase.rpc('update_course_totals', { course_id_param: courseId })

    return NextResponse.json({
      success: true,
      lesson,
      message: 'Lesson created successfully',
    })

  } catch (error) {
    console.error('Lesson creation error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create lesson' },
      { status: 500 }
    )
  }
}
