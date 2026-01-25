import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

interface RouteParams {
  params: Promise<{ courseId: string }>
}

// GET - List all modules for a course
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { courseId } = await params
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

    // Fetch modules with their lessons
    const { data: modules, error } = await supabase
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
      .eq('course_id', courseId)
      .order('display_order', { ascending: true })

    if (error) throw error

    // Sort lessons within each module by display_order
    const sortedModules = modules?.map(mod => ({
      ...mod,
      lessons: mod.lessons?.sort((a, b) => a.display_order - b.display_order) || []
    }))

    return NextResponse.json({ modules: sortedModules })

  } catch (error) {
    console.error('Modules fetch error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch modules' },
      { status: 500 }
    )
  }
}

// POST - Create a new module
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { courseId } = await params
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
    const { title, description } = body

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    // Get the highest display_order for this course
    const { data: existingModules } = await supabase
      .from('modules')
      .select('display_order')
      .eq('course_id', courseId)
      .order('display_order', { ascending: false })
      .limit(1)

    const nextOrder = existingModules && existingModules.length > 0
      ? existingModules[0].display_order + 1
      : 0

    // Create the module
    const { data: module, error } = await supabase
      .from('modules')
      .insert({
        course_id: courseId,
        title,
        description: description || null,
        display_order: nextOrder,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      module,
      message: 'Module created successfully',
    })

  } catch (error) {
    console.error('Module creation error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create module' },
      { status: 500 }
    )
  }
}
