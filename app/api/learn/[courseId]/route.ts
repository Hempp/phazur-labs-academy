// Learning Page API
// Fetches course data for the student learning experience

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createServerSupabaseAdmin } from '@/lib/supabase/server'

// GET - Fetch course data for learning page
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params
    const supabase = await createServerSupabaseClient()
    // Admin client bypasses RLS for fetching course content (modules/lessons)
    // since RLS policies for these tables are not yet configured
    const supabaseAdmin = await createServerSupabaseAdmin()
    const { searchParams } = new URL(request.url)
    const lessonId = searchParams.get('lessonId')

    // Get authenticated user
    const { data: { user } } = await supabase.auth.getUser()

    // Dev auth bypass for testing
    const isDevBypass = process.env.NODE_ENV === 'development' && process.env.DEV_AUTH_BYPASS === 'true'

    let effectiveUserId: string | null = user?.id || null

    if (!user && isDevBypass) {
      // In dev mode, use the first user from the database
      const { data: devUser } = await supabaseAdmin
        .from('users')
        .select('id')
        .limit(1)
        .single()
      effectiveUserId = devUser?.id || null
    }

    if (!effectiveUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the course
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
      .eq('id', courseId)
      .single()

    if (courseError || !course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    // Check enrollment (use admin client in dev bypass mode to skip RLS)
    const enrollmentClient = isDevBypass ? supabaseAdmin : supabase
    const { data: enrollment, error: enrollmentError } = await enrollmentClient
      .from('enrollments')
      .select('id, is_active, progress_percentage')
      .eq('course_id', courseId)
      .eq('user_id', effectiveUserId)
      .single()

    if (enrollmentError || !enrollment) {
      return NextResponse.json(
        { error: 'Not enrolled in this course' },
        { status: 403 }
      )
    }

    // Get all modules with lessons (using admin client to bypass RLS)
    const { data: modules, error: modulesError } = await supabaseAdmin
      .from('modules')
      .select(`
        id,
        title,
        description,
        display_order,
        lessons (
          id,
          title,
          description,
          content_type,
          video_url,
          video_duration_seconds,
          article_content,
          display_order,
          is_free_preview
        )
      `)
      .eq('course_id', courseId)
      .order('display_order')

    if (modulesError) {
      console.error('Error fetching modules:', modulesError)
      return NextResponse.json({ error: 'Failed to fetch course content' }, { status: 500 })
    }

    // Sort lessons within each module
    const sortedModules = (modules || []).map(module => ({
      ...module,
      lessons: (module.lessons || []).sort((a: { display_order: number }, b: { display_order: number }) =>
        a.display_order - b.display_order
      )
    }))

    // Get all lessons flat for easy access
    const allLessons = sortedModules.flatMap(m => m.lessons)

    // Get completed lessons for the user (use admin client in dev bypass mode)
    const progressClient = isDevBypass ? supabaseAdmin : supabase
    const { data: lessonProgress } = await progressClient
      .from('lesson_progress')
      .select('lesson_id, is_completed, last_position_seconds')
      .eq('user_id', effectiveUserId)
      .eq('course_id', courseId)

    const progressMap = new Map(
      (lessonProgress || []).map(p => [p.lesson_id, p])
    )

    // Determine current lesson
    let currentLesson = null
    let currentLessonId = lessonId

    if (!currentLessonId) {
      // Find first uncompleted lesson
      for (const lesson of allLessons) {
        const progress = progressMap.get(lesson.id)
        if (!progress?.is_completed) {
          currentLessonId = lesson.id
          break
        }
      }
      // If all complete, use first lesson
      if (!currentLessonId && allLessons.length > 0) {
        currentLessonId = allLessons[0].id
      }
    }

    // Get the current lesson details (using admin client to bypass RLS)
    if (currentLessonId) {
      const { data: lesson } = await supabaseAdmin
        .from('lessons')
        .select(`
          id,
          title,
          description,
          content_type,
          video_url,
          video_duration_seconds,
          article_content,
          module_id,
          display_order,
          video_status,
          video_type,
          estimated_duration_seconds,
          video_description,
          expected_ready_date
        `)
        .eq('id', currentLessonId)
        .single()

      if (lesson) {
        // Get resources for the lesson (using admin client to bypass RLS)
        const { data: resources } = await supabaseAdmin
          .from('resources')
          .select('id, title, type, url, file_size')
          .eq('lesson_id', currentLessonId)
          .order('display_order')

        // Get video chapters if any (using admin client to bypass RLS)
        const { data: chapters } = await supabaseAdmin
          .from('video_chapters')
          .select('id, title, start_time_seconds')
          .eq('lesson_id', currentLessonId)
          .order('start_time_seconds')

        // Get quiz if this is a quiz lesson (using admin client to bypass RLS)
        let quiz = null
        if (lesson.content_type === 'quiz') {
          const { data: quizData } = await supabaseAdmin
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
                  display_order
                )
              )
            `)
            .eq('lesson_id', currentLessonId)
            .single()
          quiz = quizData
        }

        currentLesson = {
          id: lesson.id,
          title: lesson.title,
          description: lesson.description,
          type: lesson.content_type,
          videoUrl: lesson.video_url,
          duration: lesson.video_duration_seconds,
          articleContent: lesson.article_content,
          moduleId: lesson.module_id,
          resources: resources || [],
          chapters: chapters || [],
          quiz,
          progress: progressMap.get(lesson.id) || null,
          // Video placeholder fields
          videoStatus: lesson.video_status,
          videoType: lesson.video_type,
          estimatedDuration: lesson.estimated_duration_seconds,
          videoDescription: lesson.video_description,
          expectedReadyDate: lesson.expected_ready_date,
        }
      }
    }

    // Calculate stats
    const totalLessons = allLessons.length
    const completedCount = (lessonProgress || []).filter(p => p.is_completed).length
    const totalDuration = allLessons.reduce(
      (sum, l) => sum + (l.video_duration_seconds || 0),
      0
    )

    return NextResponse.json({
      course: {
        id: course.id,
        slug: course.slug,
        title: course.title,
        description: course.description,
        thumbnail: course.thumbnail_url,
        instructor: (() => {
          // Handle Supabase returning users as array or object
          const instructor = Array.isArray(course.users) ? course.users[0] : course.users
          return instructor ? {
            id: instructor.id,
            name: instructor.full_name,
            avatar: instructor.avatar_url,
          } : null
        })(),
        totalLessons,
        completedLessons: completedCount,
        totalDuration: Math.ceil(totalDuration / 60), // minutes
        progress: enrollment.progress_percentage || 0,
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
          completed: progressMap.get(l.id)?.is_completed || false,
          current: l.id === currentLessonId,
          isFreePreview: l.is_free_preview,
        })),
      })),
      currentLesson,
      enrollment: {
        id: enrollment.id,
        isActive: enrollment.is_active,
        progress: enrollment.progress_percentage,
      },
      user: {
        id: effectiveUserId,
        email: user?.email || 'dev@phazurlabs.com',
      },
    })

  } catch (error) {
    console.error('Learn API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch course' },
      { status: 500 }
    )
  }
}
