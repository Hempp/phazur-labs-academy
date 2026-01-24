import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

// GET - Fetch scripts pending video generation
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()

    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')
    const lessonId = searchParams.get('lessonId')

    // Try to fetch from lesson_scripts table if it exists
    // Otherwise, fall back to fetching lessons with article_content
    let query = supabase
      .from('lessons')
      .select(`
        id,
        title,
        type,
        section:course_sections!inner (
          id,
          title,
          course:courses!inner (
            id,
            title
          )
        )
      `)
      .eq('type', 'video')
      .is('content_url', null)

    if (courseId) {
      query = query.eq('section.course.id', courseId)
    }

    if (lessonId) {
      query = query.eq('id', lessonId)
    }

    const { data: lessons, error } = await query.limit(50)

    if (error) {
      console.error('Fetch scripts error:', error)
      return NextResponse.json({ scripts: [] })
    }

    // Format response
    const scripts = lessons?.map(lesson => ({
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      sectionTitle: (lesson.section as { title: string })?.title,
      courseId: ((lesson.section as { course: { id: string } })?.course as { id: string })?.id,
      courseTitle: ((lesson.section as { course: { title: string } })?.course as { title: string })?.title,
      status: 'pending_video',
    })) || []

    return NextResponse.json({ scripts })
  } catch (error) {
    console.error('Fetch scripts error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch scripts' },
      { status: 500 }
    )
  }
}
