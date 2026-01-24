import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import type {
  GeneratedCourseOutline,
  GeneratedLessonScript,
  GeneratedQuiz,
  GeneratedAssignment,
} from '@/lib/services/course-creator'

interface CreateCourseRequest {
  outline: GeneratedCourseOutline
  scripts: Record<string, GeneratedLessonScript> // keyed by lessonTitle
  quizzes: Record<string, GeneratedQuiz> // keyed by lessonTitle
  assignments: Record<string, GeneratedAssignment> // keyed by lessonTitle
  settings: {
    status: 'draft' | 'published'
    categoryId?: string
    instructorId?: string
    price?: number
    thumbnailUrl?: string
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()

    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json() as CreateCourseRequest
    const { outline, scripts, quizzes, assignments, settings } = body

    if (!outline) {
      return NextResponse.json(
        { error: 'Course outline is required' },
        { status: 400 }
      )
    }

    // Generate slug from title
    const slug = outline.courseTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      + '-' + Date.now().toString(36)

    // Create the course
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .insert({
        title: outline.courseTitle,
        slug,
        description: outline.courseDescription,
        level: determineLevel(outline.targetAudience),
        status: settings.status || 'draft',
        instructor_id: settings.instructorId || user.id,
        category: settings.categoryId || 'general',
        prerequisites: outline.prerequisites,
        learning_outcomes: outline.learningOutcomes,
        thumbnail_url: settings.thumbnailUrl,
        price: settings.price || 0,
        currency: 'USD',
        tags: [],
        total_duration_minutes: 0,
        total_lessons: 0,
        total_videos: 0,
        rating: 0,
        reviews_count: 0,
        enrolled_students: 0,
        completion_rate: 0,
        revenue: 0,
      })
      .select()
      .single()

    if (courseError) {
      console.error('Course creation error:', courseError)
      return NextResponse.json(
        { error: 'Failed to create course' },
        { status: 500 }
      )
    }

    let totalLessons = 0
    let totalDuration = 0

    // Create sections (modules) and lessons
    for (const module of outline.modules) {
      // Create section
      const { data: section, error: sectionError } = await supabase
        .from('course_sections')
        .insert({
          course_id: course.id,
          title: module.title,
          description: module.description,
          order: module.orderIndex,
        })
        .select()
        .single()

      if (sectionError) {
        console.error('Section creation error:', sectionError)
        continue
      }

      // Create lessons for this section
      for (const lesson of module.lessons) {
        const script = scripts[lesson.title]
        const quiz = quizzes[lesson.title]
        const assignment = assignments[lesson.title]

        // Determine content based on lesson type
        let contentUrl = undefined
        let articleContent = undefined

        if (script) {
          // For video/article lessons, store the script as article content initially
          // Videos will be generated separately through Video Studio
          articleContent = formatScriptAsMarkdown(script)
        }

        const { data: createdLesson, error: lessonError } = await supabase
          .from('lessons')
          .insert({
            section_id: section.id,
            title: lesson.title,
            description: lesson.description,
            type: lesson.contentType,
            content_url: contentUrl,
            duration_minutes: lesson.durationMinutes,
            order: lesson.orderIndex,
            is_preview: lesson.orderIndex === 0, // First lesson is preview
          })
          .select()
          .single()

        if (lessonError) {
          console.error('Lesson creation error:', lessonError)
          continue
        }

        totalLessons++
        totalDuration += lesson.durationMinutes

        // Create quiz if this is a quiz lesson
        if (quiz && lesson.contentType === 'quiz') {
          await createQuizInDatabase(supabase, createdLesson.id, course.id, quiz)
        }

        // Create assignment if this is an assignment lesson
        if (assignment && lesson.contentType === 'assignment') {
          await createAssignmentInDatabase(supabase, createdLesson.id, course.id, assignment)
        }

        // Store script metadata for video generation later
        if (script && (lesson.contentType === 'video' || lesson.contentType === 'article')) {
          await supabase
            .from('lesson_scripts')
            .insert({
              lesson_id: createdLesson.id,
              course_id: course.id,
              script_data: script,
              plain_text: formatScriptAsPlainText(script),
              status: 'pending_video',
            })
            .catch(err => console.log('Script storage (optional table):', err))
        }
      }
    }

    // Update course totals
    await supabase
      .from('courses')
      .update({
        total_lessons: totalLessons,
        total_duration_minutes: totalDuration,
      })
      .eq('id', course.id)

    return NextResponse.json({
      success: true,
      course: {
        id: course.id,
        slug: course.slug,
        title: course.title,
        totalLessons,
        totalDuration,
      },
    })
  } catch (error) {
    console.error('Create course error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create course' },
      { status: 500 }
    )
  }
}

// Helper functions

function determineLevel(audience: string): 'beginner' | 'intermediate' | 'advanced' {
  const lower = audience.toLowerCase()
  if (lower.includes('advanced') || lower.includes('expert')) return 'advanced'
  if (lower.includes('intermediate') || lower.includes('experience')) return 'intermediate'
  return 'beginner'
}

function formatScriptAsMarkdown(script: GeneratedLessonScript): string {
  let markdown = `# ${script.lessonTitle}\n\n`
  markdown += `## Introduction\n${script.hook}\n\n`
  markdown += `## Overview\n${script.overview}\n\n`

  for (const section of script.sections) {
    markdown += `## ${section.title}\n${section.content}\n\n`
    if (section.visualNotes) {
      markdown += `> Visual: ${section.visualNotes}\n\n`
    }
  }

  markdown += `## Summary\n${script.summary}\n\n`
  markdown += `## Next Steps\n${script.callToAction}\n\n`

  if (script.keyTerms.length > 0) {
    markdown += `## Key Terms\n`
    for (const term of script.keyTerms) {
      markdown += `- ${term}\n`
    }
  }

  return markdown
}

function formatScriptAsPlainText(script: GeneratedLessonScript): string {
  let text = script.hook + '\n\n'
  text += script.overview + '\n\n'

  for (const section of script.sections) {
    const cleanContent = section.content
      .replace(/\[VISUAL:[^\]]+\]/g, '')
      .replace(/\[PAUSE\]/g, '')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .trim()
    text += cleanContent + '\n\n'
  }

  text += script.summary + '\n\n'
  text += script.callToAction

  return text.trim()
}

async function createQuizInDatabase(
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>,
  lessonId: string,
  courseId: string,
  quiz: GeneratedQuiz
) {
  const { data: createdQuiz, error: quizError } = await supabase
    .from('quizzes')
    .insert({
      lesson_id: lessonId,
      course_id: courseId,
      title: quiz.quizTitle,
      description: quiz.description,
      passing_score: quiz.passingScore,
      time_limit_minutes: quiz.timeLimit,
      max_attempts: 3,
      shuffle_questions: true,
      show_correct_answers: true,
    })
    .select()
    .single()

  if (quizError) {
    console.error('Quiz creation error:', quizError)
    return
  }

  // Create questions
  for (let i = 0; i < quiz.questions.length; i++) {
    const q = quiz.questions[i]

    const { data: question, error: questionError } = await supabase
      .from('quiz_questions')
      .insert({
        quiz_id: createdQuiz.id,
        question: q.questionText,
        question_type: mapQuestionType(q.questionType),
        explanation: q.explanation,
        points: q.points,
        order: i,
      })
      .select()
      .single()

    if (questionError) {
      console.error('Question creation error:', questionError)
      continue
    }

    // Create options
    for (let j = 0; j < q.options.length; j++) {
      const opt = q.options[j]
      await supabase
        .from('quiz_options')
        .insert({
          question_id: question.id,
          text: opt.text,
          is_correct: opt.isCorrect,
        })
    }
  }
}

function mapQuestionType(type: string): 'multiple_choice' | 'true_false' | 'multiple_select' {
  switch (type) {
    case 'single_choice':
      return 'multiple_choice'
    case 'multiple_choice':
      return 'multiple_select'
    case 'true_false':
      return 'true_false'
    default:
      return 'multiple_choice'
  }
}

async function createAssignmentInDatabase(
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>,
  lessonId: string,
  courseId: string,
  assignment: GeneratedAssignment
) {
  await supabase
    .from('assignments')
    .insert({
      lesson_id: lessonId,
      course_id: courseId,
      title: assignment.assignmentTitle,
      description: assignment.description,
      instructions: assignment.instructions,
      max_score: assignment.points,
      submission_types: [assignment.submissionType],
      due_days_after_enrollment: assignment.dueInDays,
      rubric: assignment.rubric,
    })
}
