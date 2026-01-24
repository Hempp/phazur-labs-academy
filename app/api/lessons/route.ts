import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

// GET - List lessons with optional filtering
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()

    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const withoutVideo = searchParams.get('without_video') === 'true'
    const courseId = searchParams.get('course_id')
    const moduleId = searchParams.get('module_id')
    const limit = parseInt(searchParams.get('limit') || '100')

    let query = supabase
      .from('lessons')
      .select(`
        id,
        title,
        description,
        video_url,
        video_duration_seconds,
        content_type,
        display_order,
        is_free_preview,
        module_id,
        course_id,
        module:modules(id, title),
        course:courses(id, title)
      `)
      .order('display_order', { ascending: true })
      .limit(limit)

    // Filter by course
    if (courseId) {
      query = query.eq('course_id', courseId)
    }

    // Filter by module
    if (moduleId) {
      query = query.eq('module_id', moduleId)
    }

    // Filter lessons without videos
    if (withoutVideo) {
      query = query.or('video_url.is.null,video_url.eq.')
    }

    const { data: lessons, error } = await query

    if (error) {
      throw error
    }

    return NextResponse.json({ lessons })

  } catch (error) {
    console.error('Lessons fetch error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch lessons' },
      { status: 500 }
    )
  }
}
