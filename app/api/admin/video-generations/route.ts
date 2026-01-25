import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

// GET: List video generations with optional filtering
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()

    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get query params
    const searchParams = request.nextUrl.searchParams
    const courseId = searchParams.get('courseId')
    const lessonId = searchParams.get('lessonId')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')

    // Build query
    let query = supabase
      .from('video_generations')
      .select(`
        *,
        lessons:lesson_id (
          id,
          title,
          course_id,
          courses:course_id (
            id,
            title
          )
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit)

    // Apply filters
    if (lessonId) {
      query = query.eq('lesson_id', lessonId)
    }

    if (courseId) {
      // Filter by lessons that belong to the course
      const { data: lessonIds } = await supabase
        .from('lessons')
        .select('id')
        .eq('course_id', courseId)

      if (lessonIds && lessonIds.length > 0) {
        query = query.in('lesson_id', lessonIds.map(l => l.id))
      } else {
        // No lessons found for this course
        return NextResponse.json([])
      }
    }

    if (status) {
      query = query.eq('status', status)
    }

    const { data: videos, error } = await query

    if (error) {
      console.error('Error fetching video generations:', error)
      return NextResponse.json(
        { error: 'Failed to fetch video generations' },
        { status: 500 }
      )
    }

    return NextResponse.json(videos || [])
  } catch (error) {
    console.error('Video generations list error:', error)
    return NextResponse.json(
      { error: 'Failed to list video generations' },
      { status: 500 }
    )
  }
}
