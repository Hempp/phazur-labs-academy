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

// Mock lesson data for development (matches learn page mock data structure)
const mockLessonData = {
  lesson: {
    id: 'l5',
    title: 'What are Compound Components?',
    type: 'video' as const,
    duration: 18,
    videoUrl: '/videos/compound-components.mp4',
    description: `In this lesson, we'll explore the Compound Components pattern in React. This pattern allows you to create components with an implicit API that works together as a cohesive unit.

We'll look at real-world examples like Reach UI's Tabs component and understand how to implement this pattern in your own projects.`,
    resources: [
      { id: 'r1', title: 'Lesson Slides', type: 'pdf', url: '/resources/slides.pdf' },
      { id: 'r2', title: 'Code Examples', type: 'zip', url: '/resources/code.zip' },
    ],
    chapters: [
      { id: 'c1', title: 'Introduction', startTime: 0 },
      { id: 'c2', title: 'The Problem', startTime: 180 },
      { id: 'c3', title: 'Compound Components Solution', startTime: 420 },
      { id: 'c4', title: 'Implementation', startTime: 720 },
      { id: 'c5', title: 'Summary', startTime: 960 },
    ],
    isFreePreview: true,
  },
  course: {
    id: '1',
    slug: 'advanced-react-patterns',
    title: 'Advanced React Patterns',
    instructor: {
      id: 'inst-1',
      name: 'Sarah Johnson',
      avatar: null, // Let UserAvatar fallback handle this with initials
    },
  },
  modules: [
    {
      id: 'm1',
      title: 'Introduction to Advanced Patterns',
      lessons: [
        { id: 'l1', title: 'Course Overview', type: 'video', duration: 8, completed: true, isFreePreview: true },
        { id: 'l2', title: 'Setting Up the Development Environment', type: 'video', duration: 12, completed: true, isFreePreview: false },
        { id: 'l3', title: 'Understanding Pattern Categories', type: 'video', duration: 15, completed: true, isFreePreview: false },
        { id: 'l4', title: 'When to Use Which Pattern', type: 'video', duration: 10, completed: true, isFreePreview: false },
      ],
    },
    {
      id: 'm2',
      title: 'Compound Components Pattern',
      lessons: [
        { id: 'l5', title: 'What are Compound Components?', type: 'video', duration: 18, completed: false, isFreePreview: true },
        { id: 'l6', title: 'Building a Tabs Component', type: 'video', duration: 25, completed: false, isFreePreview: false },
        { id: 'l7', title: 'Using Context for Implicit State', type: 'video', duration: 22, completed: false, isFreePreview: false },
        { id: 'l8', title: 'Flexible Compound Components', type: 'video', duration: 20, completed: false, isFreePreview: false },
        { id: 'l9', title: 'Real-world Examples', type: 'video', duration: 25, completed: false, isFreePreview: false },
        { id: 'l10', title: 'Exercise: Build a Menu Component', type: 'exercise', duration: 10, completed: false, isFreePreview: false },
      ],
    },
    {
      id: 'm3',
      title: 'Custom Hooks Deep Dive',
      lessons: [
        { id: 'l11', title: 'Custom Hooks Fundamentals', type: 'video', duration: 20, completed: false, isFreePreview: false },
        { id: 'l12', title: 'Building useToggle and useBoolean', type: 'video', duration: 18, completed: false, isFreePreview: false },
        { id: 'l13', title: 'Data Fetching with Custom Hooks', type: 'video', duration: 28, completed: false, isFreePreview: false },
      ],
    },
  ],
  progress: null,
  completedLessons: ['l1', 'l2', 'l3', 'l4'],
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
      }
    }
  }
  return mockLessonData.lesson // Default to l5 lesson data
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
      // Fallback to mock data for development with mock lesson IDs (l1, l2, etc.)
      if (/^l\d+$/.test(lessonId)) {
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
