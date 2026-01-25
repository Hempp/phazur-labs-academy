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

    // Format response - handle Supabase nested relations which can be arrays or objects
    const scripts = lessons?.map(lesson => {
      const section = lesson.section as unknown as {
        title?: string
        course?: { id?: string; title?: string } | { id?: string; title?: string }[]
      } | {
        title?: string
        course?: { id?: string; title?: string } | { id?: string; title?: string }[]
      }[] | null

      // Extract section (could be array or object)
      const sectionData = Array.isArray(section) ? section[0] : section
      // Extract course (could be array or object)
      const courseData = sectionData?.course
      const course = Array.isArray(courseData) ? courseData[0] : courseData

      return {
        lessonId: lesson.id,
        lessonTitle: lesson.title,
        sectionTitle: sectionData?.title,
        courseId: course?.id,
        courseTitle: course?.title,
        status: 'pending_video',
      }
    }) || []

    return NextResponse.json({ scripts })
  } catch (error) {
    console.error('Fetch scripts error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch scripts' },
      { status: 500 }
    )
  }
}
