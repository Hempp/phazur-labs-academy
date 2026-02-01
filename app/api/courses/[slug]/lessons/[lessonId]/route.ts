import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createServerSupabaseAdmin } from '@/lib/supabase/server'

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return !!(
    url && key &&
    !url.includes('placeholder') &&
    !url.includes('your-project') &&
    !key.includes('your-') &&
    key !== 'your-anon-key'
  )
}

// Video URL mapping for generated lessons
const lessonVideoUrls: Record<string, string> = {
  'lesson-react-1-1': '/videos/lessons/lesson-react-1-1.mp4',
  'lesson-react-1-2': '/videos/lessons/lesson-react-1-2.mp4',
  'lesson-react-1-3': '/videos/lessons/lesson-react-1-3.mp4',
  'lesson-react-2-1': '/videos/lessons/lesson-react-2-1.mp4',
  'lesson-react-2-2': '/videos/lessons/lesson-react-2-2.mp4',
  'lesson-react-2-3': '/videos/lessons/lesson-react-2-3.mp4',
  'lesson-react-3-1': '/videos/lessons/lesson-react-3-1.mp4',
  'lesson-react-3-2': '/videos/lessons/lesson-react-3-2.mp4',
  'lesson-react-4-1': '/videos/lessons/lesson-react-4-1.mp4',
}

// Mock lesson data for development (with generated videos)
const mockLessonData = {
  lesson: {
    id: 'lesson-react-1-1',
    title: 'Welcome & Course Overview',
    type: 'video' as const,
    duration: 1,
    videoUrl: '/videos/lessons/lesson-react-1-1.mp4',
    description: `Welcome to Advanced React Patterns! In this comprehensive course, you'll learn the most powerful patterns used by senior React developers at top tech companies.

We'll cover compound components, render props, custom hooks, and the latest patterns from React 18 and beyond.`,
    resources: [
      { id: 'r1', title: 'Course Slides', type: 'pdf', url: '/resources/slides.pdf' },
      { id: 'r2', title: 'GitHub Repository', type: 'link', url: 'https://github.com/phazurlabs/react-patterns-course' },
    ],
    chapters: [],
    isFreePreview: true,
  },
  course: {
    id: '1',
    slug: 'advanced-react-patterns',
    title: 'Advanced React Patterns',
    instructor: {
      id: 'inst-1',
      name: 'Sarah Johnson',
      avatar: null,
    },
  },
  modules: [
    {
      id: 'm1',
      title: 'Introduction to Design Patterns',
      lessons: [
        { id: 'lesson-react-1-1', title: 'Welcome & Course Overview', type: 'video', duration: 1, completed: false, isFreePreview: true },
        { id: 'lesson-react-1-2', title: 'What are Design Patterns?', type: 'video', duration: 1, completed: false, isFreePreview: true },
        { id: 'lesson-react-1-3', title: 'Setting Up Your Environment', type: 'video', duration: 1, completed: false, isFreePreview: false },
      ],
    },
    {
      id: 'm2',
      title: 'Compound Components Pattern',
      lessons: [
        { id: 'lesson-react-2-1', title: 'Understanding Compound Components', type: 'video', duration: 1, completed: false, isFreePreview: true },
        { id: 'lesson-react-2-2', title: 'Building a Tabs Component', type: 'video', duration: 1, completed: false, isFreePreview: false },
        { id: 'lesson-react-2-3', title: 'Building an Accordion Component', type: 'video', duration: 1, completed: false, isFreePreview: false },
      ],
    },
    {
      id: 'm3',
      title: 'Render Props Pattern',
      lessons: [
        { id: 'lesson-react-3-1', title: 'What are Render Props?', type: 'video', duration: 1, completed: false, isFreePreview: false },
        { id: 'lesson-react-3-2', title: 'Building a Mouse Tracker', type: 'video', duration: 1, completed: false, isFreePreview: false },
      ],
    },
    {
      id: 'm4',
      title: 'Custom Hooks Pattern',
      lessons: [
        { id: 'lesson-react-4-1', title: 'Introduction to Custom Hooks', type: 'video', duration: 1, completed: false, isFreePreview: false },
      ],
    },
  ],
  progress: null,
  completedLessons: [],
}

// Helper to find mock lesson by ID
function getMockLesson(lessonId: string) {
  for (const courseModule of mockLessonData.modules) {
    const lesson = courseModule.lessons.find(l => l.id === lessonId)
    if (lesson) {
      return {
        ...mockLessonData.lesson,
        id: lesson.id,
        title: lesson.title,
        type: lesson.type,
        duration: lesson.duration,
        isFreePreview: lesson.isFreePreview,
        videoUrl: lessonVideoUrls[lessonId] || mockLessonData.lesson.videoUrl,
      }
    }
  }
  // Return default with correct video URL
  const videoUrl = lessonVideoUrls[lessonId] || mockLessonData.lesson.videoUrl
  return { ...mockLessonData.lesson, id: lessonId, videoUrl }
}

// GET - Fetch lesson data with course context
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; lessonId: string }> }
) {
  try {
    const { slug, lessonId } = await params

    // Return mock data if Supabase is not configured
    if (!isSupabaseConfigured()) {
      const lesson = getMockLesson(lessonId)
      return NextResponse.json({
        ...mockLessonData,
        lesson,
      })
    }

    const supabase = await createServerSupabaseAdmin()

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
      // Fallback to mock data for development with mock slugs
      if (slug === 'advanced-react-patterns' || slug === mockLessonData.course.slug) {
        const lesson = getMockLesson(lessonId)
        return NextResponse.json({
          ...mockLessonData,
          lesson,
        })
      }
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
      // Fallback to mock data for development with mock lesson IDs
      if (/^lesson-react-\d+-\d+$/.test(lessonId) || /^l\d+$/.test(lessonId)) {
        const mockLesson = getMockLesson(lessonId)
        return NextResponse.json({
          ...mockLessonData,
          lesson: mockLesson,
        })
      }
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
        instructor: (() => {
          // Handle Supabase returning users as array or object
          const instructor = Array.isArray(course.users) ? course.users[0] : course.users
          return instructor ? {
            id: instructor.id,
            name: instructor.full_name,
            avatar: instructor.avatar_url,
          } : null
        })(),
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
