import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import {
  fullCourseGenerator,
  type FullCourseContent,
  type GeneratedLesson
} from '@/lib/services/full-course-generator'
import { heygenClient } from '@/lib/services/heygen-client'

export const maxDuration = 60

interface SaveCourseRequest {
  course: FullCourseContent
  generateVideos?: boolean
  categoryId?: string
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()

    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify role
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

    const body = await request.json() as SaveCourseRequest
    const { course, generateVideos = false, categoryId } = body

    if (!course || !course.lessons?.length) {
      return NextResponse.json(
        { error: 'Course content is required' },
        { status: 400 }
      )
    }

    // Generate slug from title
    const slug = course.courseTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      + '-' + Date.now().toString(36)

    // 1. Create the course
    const { data: newCourse, error: courseError } = await supabase
      .from('courses')
      .insert({
        title: course.courseTitle,
        slug,
        description: course.courseDescription,
        instructor_id: user.id,
        category_id: categoryId || null,
        level: course.difficulty,
        status: 'draft',
        total_lessons: course.lessons.length,
        total_duration_minutes: course.lessons.length * 7,
        what_you_will_learn: course.lessons.map(l => l.title),
        target_audience: [course.targetAudience],
      })
      .select()
      .single()

    if (courseError) {
      console.error('Error creating course:', courseError)
      return NextResponse.json(
        { error: 'Failed to create course: ' + courseError.message },
        { status: 500 }
      )
    }

    // 2. Create a single module for all lessons
    const { data: courseModule, error: moduleError } = await supabase
      .from('modules')
      .insert({
        course_id: newCourse.id,
        title: 'Course Content',
        description: 'All course lessons',
        display_order: 1,
      })
      .select()
      .single()

    if (moduleError) {
      console.error('Error creating module:', moduleError)
      return NextResponse.json(
        { error: 'Failed to create module: ' + moduleError.message },
        { status: 500 }
      )
    }

    // 3. Create lessons with content
    const lessonIds: string[] = []
    const videoGenerationJobs: Array<{ lessonId: string; script: string; title: string }> = []

    for (const lesson of course.lessons) {
      // Create the lesson
      const { data: newLesson, error: lessonError } = await supabase
        .from('lessons')
        .insert({
          module_id: courseModule.id,
          course_id: newCourse.id,
          title: lesson.title,
          description: lesson.description,
          content_type: 'video',
          article_content: fullCourseGenerator.extractPlainScript(lesson.videoScript),
          display_order: lesson.order,
          video_duration_seconds: 7 * 60, // 7 minutes estimated
        })
        .select()
        .single()

      if (lessonError) {
        console.error('Error creating lesson:', lessonError)
        continue
      }

      lessonIds.push(newLesson.id)

      // Queue video generation if requested
      if (generateVideos) {
        videoGenerationJobs.push({
          lessonId: newLesson.id,
          script: lesson.videoScript.fullScript,
          title: lesson.title,
        })
      }

      // 4. Create quiz for the lesson
      const quizData = fullCourseGenerator.convertQuizForDatabase(lesson.quiz)

      const { data: newQuiz, error: quizError } = await supabase
        .from('quizzes')
        .insert({
          module_id: courseModule.id,
          course_id: newCourse.id,
          title: `${lesson.title} Quiz`,
          passing_score: quizData.passing_score,
          time_limit_minutes: 15,
        })
        .select()
        .single()

      if (!quizError && newQuiz) {
        // Create questions for the quiz
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
            // Create answers for the question
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

      // 5. Create assignment for the lesson
      const { error: assignmentError } = await supabase
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

    // 6. Queue video generation jobs
    const videoGenerations: Array<{ id: string; status: string }> = []

    if (generateVideos && heygenClient.isConfigured()) {
      for (const job of videoGenerationJobs) {
        try {
          const videoResponse = await heygenClient.createVideo({
            script: job.script,
            title: job.title,
            caption: true,
          })

          // Save to video_generations table
          const { data: videoGen } = await supabase
            .from('video_generations')
            .insert({
              heygen_video_id: videoResponse.videoId,
              title: job.title,
              script: job.script,
              avatar_id: 'Angela-inblackskirt-20220820',
              lesson_id: job.lessonId,
              status: 'processing',
              created_by: user.id,
            })
            .select()
            .single()

          if (videoGen) {
            videoGenerations.push({ id: videoGen.id, status: 'processing' })
          }
        } catch (error) {
          console.error('Error queueing video generation:', error)
        }
      }
    }

    return NextResponse.json({
      success: true,
      course: {
        id: newCourse.id,
        slug: newCourse.slug,
        title: newCourse.title,
      },
      lessonCount: lessonIds.length,
      videoGenerations: videoGenerations.length,
      message: generateVideos
        ? `Course created with ${lessonIds.length} lessons. ${videoGenerations.length} videos queued for generation.`
        : `Course created with ${lessonIds.length} lessons. Edit the course to add videos.`,
    })
  } catch (error) {
    console.error('Save course error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save course' },
      { status: 500 }
    )
  }
}
