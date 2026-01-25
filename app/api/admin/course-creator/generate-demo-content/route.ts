import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { fullCourseGenerator } from '@/lib/services/full-course-generator'

export const maxDuration = 120

interface GenerateDemoRequest {
  courseId?: string // Specific course to generate for
  generateAll?: boolean // Generate for all empty courses
  lessonCount?: number // Override lesson count
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()

    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify admin role
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }

    // Check if AI is configured
    if (!fullCourseGenerator.isConfigured()) {
      return NextResponse.json(
        { error: 'AI service not configured. Please set OPENAI_API_KEY.' },
        { status: 503 }
      )
    }

    const body = await request.json() as GenerateDemoRequest
    const { courseId, generateAll = false, lessonCount = 6 } = body

    // Find courses that need content
    let coursesToProcess: Array<{
      id: string
      title: string
      description: string
      level: string
    }> = []

    if (courseId) {
      // Specific course
      const { data: course, error } = await supabase
        .from('courses')
        .select('id, title, description, level')
        .eq('id', courseId)
        .single()

      if (error || !course) {
        return NextResponse.json(
          { error: 'Course not found' },
          { status: 404 }
        )
      }

      coursesToProcess = [course]
    } else if (generateAll) {
      // Find all courses without lessons
      const { data: allCourses } = await supabase
        .from('courses')
        .select('id, title, description, level')

      if (allCourses) {
        for (const course of allCourses) {
          const { count } = await supabase
            .from('lessons')
            .select('id', { count: 'exact', head: true })
            .eq('course_id', course.id)

          if (count === 0) {
            coursesToProcess.push(course)
          }
        }
      }
    } else {
      return NextResponse.json(
        { error: 'Specify courseId or set generateAll: true' },
        { status: 400 }
      )
    }

    if (coursesToProcess.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No courses need content generation',
        generated: [],
      })
    }

    const results: Array<{
      courseId: string
      courseTitle: string
      lessonsCreated: number
      success: boolean
      error?: string
    }> = []

    // Process each course
    for (const course of coursesToProcess) {
      try {
        // Generate full course content based on title
        const generatedCourse = await fullCourseGenerator.generateFullCourse({
          topic: course.title,
          audience: 'General learners',
          difficulty: (course.level as 'beginner' | 'intermediate' | 'advanced') || 'beginner',
          lessonCount,
        })

        // Create module
        const { data: courseModule, error: moduleError } = await supabase
          .from('modules')
          .insert({
            course_id: course.id,
            title: 'Course Content',
            description: 'All course lessons',
            display_order: 1,
          })
          .select()
          .single()

        if (moduleError) {
          throw new Error('Failed to create module: ' + moduleError.message)
        }

        // Create lessons with content
        let lessonsCreated = 0

        for (const lesson of generatedCourse.lessons) {
          const { data: newLesson, error: lessonError } = await supabase
            .from('lessons')
            .insert({
              module_id: courseModule.id,
              course_id: course.id,
              title: lesson.title,
              description: lesson.description,
              content_type: 'video',
              article_content: fullCourseGenerator.extractPlainScript(lesson.videoScript),
              display_order: lesson.order,
              video_duration_seconds: 7 * 60,
            })
            .select()
            .single()

          if (lessonError) {
            console.error('Error creating lesson:', lessonError)
            continue
          }

          lessonsCreated++

          // Create quiz
          const quizData = fullCourseGenerator.convertQuizForDatabase(lesson.quiz)

          const { data: newQuiz, error: quizError } = await supabase
            .from('quizzes')
            .insert({
              module_id: courseModule.id,
              course_id: course.id,
              title: `${lesson.title} Quiz`,
              passing_score: quizData.passing_score,
              time_limit_minutes: 15,
            })
            .select()
            .single()

          if (!quizError && newQuiz) {
            for (const question of quizData.questions) {
              const { data: newQuestion, error: questionError } = await supabase
                .from('questions')
                .insert({
                  quiz_id: newQuiz.id,
                  question_text: question.question_text,
                  type: question.type,
                  points: question.points,
                })
                .select()
                .single()

              if (!questionError && newQuestion) {
                await supabase
                  .from('answers')
                  .insert(
                    question.answers.map(a => ({
                      question_id: newQuestion.id,
                      answer_text: a.answer_text,
                      is_correct: a.is_correct,
                    }))
                  )
              }
            }
          }

          // Create assignment
          await supabase
            .from('assignments')
            .insert({
              lesson_id: newLesson.id,
              title: lesson.assignment.title,
              description: lesson.assignment.description,
              instructions: lesson.assignment.steps.join('\n'),
              due_in_days: 7,
              points: lesson.assignment.totalPoints,
              rubric: lesson.assignment.rubric,
            })
        }

        // Update course lesson count
        await supabase
          .from('courses')
          .update({
            total_lessons: lessonsCreated,
            total_duration_minutes: lessonsCreated * 7,
          })
          .eq('id', course.id)

        results.push({
          courseId: course.id,
          courseTitle: course.title,
          lessonsCreated,
          success: true,
        })
      } catch (error) {
        results.push({
          courseId: course.id,
          courseTitle: course.title,
          lessonsCreated: 0,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }

    const successCount = results.filter(r => r.success).length
    const totalLessons = results.reduce((sum, r) => sum + r.lessonsCreated, 0)

    return NextResponse.json({
      success: successCount > 0,
      message: `Generated content for ${successCount}/${coursesToProcess.length} courses (${totalLessons} total lessons)`,
      results,
    })
  } catch (error) {
    console.error('Generate demo content error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate demo content' },
      { status: 500 }
    )
  }
}

// GET: Check which courses need content
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()

    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all courses with lesson counts
    const { data: courses } = await supabase
      .from('courses')
      .select('id, title, description, level, status, total_lessons')
      .order('created_at', { ascending: false })

    if (!courses) {
      return NextResponse.json({ courses: [], needsContent: [] })
    }

    const coursesWithDetails = await Promise.all(
      courses.map(async (course) => {
        const { count } = await supabase
          .from('lessons')
          .select('id', { count: 'exact', head: true })
          .eq('course_id', course.id)

        return {
          ...course,
          actualLessons: count || 0,
          needsContent: (count || 0) === 0,
        }
      })
    )

    const needsContent = coursesWithDetails.filter(c => c.needsContent)

    return NextResponse.json({
      total: courses.length,
      needsContent: needsContent.length,
      courses: coursesWithDetails,
    })
  } catch (error) {
    console.error('Check courses error:', error)
    return NextResponse.json(
      { error: 'Failed to check courses' },
      { status: 500 }
    )
  }
}
