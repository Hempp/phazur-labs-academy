import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

// GET - Fetch lesson data with course context
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; lessonId: string }> }
) {
  try {
    const { slug, lessonId } = await params
    const supabase = await createServerSupabaseClient()

    // Get the course by slug
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select(`
        id,
        slug,
        title,
        description,
        thumbnail_url,
        instructor_id,
        users!courses_instructor_id_fkey (
          id,
          full_name,
          avatar_url
        )
      `)
      .eq('slug', slug)
      .single()

    if (courseError || !course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    // Get the specific lesson
    const { data: lesson, error: lessonError } = await supabase
      .from('lessons')
      .select(`
        id,
        title,
        description,
        content_type,
        video_url,
        video_duration_seconds,
        article_content,
        display_order,
        is_free_preview,
        module_id,
        modules!inner (
          id,
          title,
          display_order
        )
      `)
      .eq('id', lessonId)
      .eq('course_id', course.id)
      .single()

    if (lessonError || !lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      )
    }

    // Get all modules with lessons for the sidebar
    const { data: modules, error: modulesError } = await supabase
      .from('modules')
      .select(`
        id,
        title,
        display_order,
        lessons (
          id,
          title,
          content_type,
          video_duration_seconds,
          display_order,
          is_free_preview
        )
      `)
      .eq('course_id', course.id)
      .order('display_order')

    if (modulesError) {
      console.error('Error fetching modules:', modulesError)
    }

    // Sort lessons within each module
    const sortedModules = (modules || []).map(module => ({
      ...module,
      lessons: (module.lessons || []).sort((a: { display_order: number }, b: { display_order: number }) =>
        a.display_order - b.display_order
      )
    }))

    // Get video chapters if any
    const { data: chapters } = await supabase
      .from('video_chapters')
      .select('id, title, start_time_seconds')
      .eq('lesson_id', lessonId)
      .order('start_time_seconds')

    // Get resources for the lesson
    const { data: resources } = await supabase
      .from('resources')
      .select('id, title, type, url, file_size')
      .eq('lesson_id', lessonId)
      .order('display_order')

    // Check user progress if authenticated
    let progress = null
    let completedLessons: string[] = []

    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      // Get lesson progress
      const { data: lessonProgress } = await supabase
        .from('lesson_progress')
        .select('progress_percent, completed, last_position_seconds')
        .eq('user_id', user.id)
        .eq('lesson_id', lessonId)
        .single()

      progress = lessonProgress

      // Get all completed lessons for this course
      const { data: allProgress } = await supabase
        .from('lesson_progress')
        .select('lesson_id')
        .eq('user_id', user.id)
        .eq('completed', true)
        .in('lesson_id', sortedModules.flatMap(m => m.lessons.map((l: { id: string }) => l.id)))

      completedLessons = (allProgress || []).map(p => p.lesson_id)
    }

    // Get quiz if this is a quiz lesson
    let quiz = null
    if (lesson.content_type === 'quiz') {
      const { data: quizData } = await supabase
        .from('quizzes')
        .select(`
          id,
          title,
          description,
          passing_score,
          time_limit_minutes,
          questions (
            id,
            question_text,
            question_type,
            points,
            display_order,
            answers (
              id,
              answer_text,
              is_correct,
              display_order
            )
          )
        `)
        .eq('lesson_id', lessonId)
        .single()

      quiz = quizData
    }

    // Get assignment if this is an assignment lesson
    let assignment = null
    if (lesson.content_type === 'assignment') {
      const { data: assignmentData } = await supabase
        .from('assignments')
        .select('*')
        .eq('lesson_id', lessonId)
        .single()

      assignment = assignmentData
    }

    return NextResponse.json({
      lesson: {
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        type: lesson.content_type,
        videoUrl: lesson.video_url,
        duration: lesson.video_duration_seconds ? Math.ceil(lesson.video_duration_seconds / 60) : 0,
        articleContent: lesson.article_content,
        isFreePreview: lesson.is_free_preview,
        chapters: (chapters || []).map(c => ({
          id: c.id,
          title: c.title,
          startTime: c.start_time_seconds,
        })),
        resources: resources || [],
        quiz,
        assignment,
      },
      course: {
        id: course.id,
        slug: course.slug,
        title: course.title,
        instructor: course.users ? {
          id: course.users.id,
          name: course.users.full_name,
          avatar: course.users.avatar_url,
        } : null,
      },
      modules: sortedModules.map(m => ({
        id: m.id,
        title: m.title,
        lessons: m.lessons.map((l: {
          id: string
          title: string
          content_type: string
          video_duration_seconds: number | null
          is_free_preview: boolean
        }) => ({
          id: l.id,
          title: l.title,
          type: l.content_type,
          duration: l.video_duration_seconds ? Math.ceil(l.video_duration_seconds / 60) : 0,
          completed: completedLessons.includes(l.id),
          isFreePreview: l.is_free_preview,
        })),
      })),
      progress,
      completedLessons,
    })

  } catch (error) {
    console.error('Lesson fetch error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch lesson' },
      { status: 500 }
    )
  }
}
