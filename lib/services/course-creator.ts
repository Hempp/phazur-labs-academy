// Course Creator Service - AI-Powered Education Guru
// Generates complete courses with outlines, scripts, quizzes, and assignments

import { aiClient, type AIMessage } from './ai-client'
import {
  EDUCATION_GURU_SYSTEM,
  GENERATE_OUTLINE_PROMPT,
  GENERATE_LESSON_SCRIPT_PROMPT,
  GENERATE_QUIZ_PROMPT,
  GENERATE_ASSIGNMENT_PROMPT,
  fillPromptTemplate,
} from './course-creator-prompts'

// ============================================================================
// Generated Content Types
// ============================================================================

export interface GeneratedCourseOutline {
  courseTitle: string
  courseDescription: string
  targetAudience: string
  prerequisites: string[]
  learningOutcomes: string[]
  estimatedDuration: string
  modules: GeneratedModule[]
}

export interface GeneratedModule {
  title: string
  description: string
  orderIndex: number
  lessons: GeneratedLesson[]
}

export interface GeneratedLesson {
  title: string
  description: string
  durationMinutes: number
  contentType: 'video' | 'article' | 'quiz' | 'assignment'
  learningObjectives: string[]
  orderIndex: number
}

export interface GeneratedLessonScript {
  lessonTitle: string
  hook: string
  overview: string
  sections: {
    title: string
    content: string
    durationSeconds: number
    visualNotes: string
  }[]
  summary: string
  callToAction: string
  totalDurationMinutes: number
  keyTerms: string[]
  practicePrompt: string
}

export interface GeneratedQuiz {
  quizTitle: string
  description: string
  passingScore: number
  timeLimit: number | null
  questions: GeneratedQuestion[]
}

export interface GeneratedQuestion {
  questionText: string
  questionType: 'single_choice' | 'multiple_choice' | 'true_false' | 'fill_blank' | 'short_answer'
  points: number
  bloomsLevel: number
  options: {
    text: string
    isCorrect: boolean
    feedback: string
  }[]
  correctAnswer?: string
  explanation: string
}

export interface GeneratedAssignment {
  assignmentTitle: string
  description: string
  instructions: string
  submissionType: 'file' | 'url' | 'text'
  estimatedMinutes: number
  dueInDays: number
  points: number
  rubric: {
    criterion: string
    weight: number
    levels: {
      label: string
      points: number
      description: string
    }[]
  }[]
  resources: string[]
  tips: string[]
}

// ============================================================================
// Request Types
// ============================================================================

export interface OutlineRequest {
  topic: string
  audience: string
  level: 'beginner' | 'intermediate' | 'advanced'
  duration: string // e.g., "4 weeks", "2 hours", "10 lessons"
}

export interface LessonScriptRequest {
  courseName: string
  moduleName: string
  lessonTitle: string
  duration: number // minutes
  objectives: string[]
  previousContext?: string
}

export interface QuizRequest {
  courseName: string
  moduleName: string
  lessonTitle?: string
  objectives: string[]
  keyConcepts: string[]
  questionCount: number
}

export interface AssignmentRequest {
  courseName: string
  moduleName: string
  lessonTitle?: string
  objectives: string[]
  skills: string[]
}

// ============================================================================
// Course Creator Service
// ============================================================================

class CourseCreatorService {
  /**
   * Check if AI is configured
   */
  isConfigured(): boolean {
    return aiClient.isConfigured()
  }

  /**
   * Generate a complete course outline from a topic
   */
  async generateOutline(request: OutlineRequest): Promise<GeneratedCourseOutline> {
    const prompt = fillPromptTemplate(GENERATE_OUTLINE_PROMPT, {
      topic: request.topic,
      audience: request.audience,
      level: request.level,
      duration: request.duration,
    })

    const messages: AIMessage[] = [
      { role: 'system', content: EDUCATION_GURU_SYSTEM },
      { role: 'user', content: prompt },
    ]

    const response = await aiClient.generateWithRetry(async () => {
      return await aiClient.generateJSON<GeneratedCourseOutline>(messages, {
        temperature: 0.7,
        maxTokens: 4096,
      })
    })

    return response.content
  }

  /**
   * Generate a video lesson script
   */
  async generateLessonScript(request: LessonScriptRequest): Promise<GeneratedLessonScript> {
    const prompt = fillPromptTemplate(GENERATE_LESSON_SCRIPT_PROMPT, {
      courseName: request.courseName,
      moduleName: request.moduleName,
      lessonTitle: request.lessonTitle,
      duration: request.duration,
      objectives: request.objectives,
      previousContext: request.previousContext || 'This is the first lesson.',
    })

    const messages: AIMessage[] = [
      { role: 'system', content: EDUCATION_GURU_SYSTEM },
      { role: 'user', content: prompt },
    ]

    const response = await aiClient.generateWithRetry(async () => {
      return await aiClient.generateJSON<GeneratedLessonScript>(messages, {
        temperature: 0.7,
        maxTokens: 3000,
      })
    })

    return response.content
  }

  /**
   * Generate a quiz with varied question types
   */
  async generateQuiz(request: QuizRequest): Promise<GeneratedQuiz> {
    const prompt = fillPromptTemplate(GENERATE_QUIZ_PROMPT, {
      courseName: request.courseName,
      moduleName: request.moduleName,
      lessonTitle: request.lessonTitle || request.moduleName,
      objectives: request.objectives,
      keyConcepts: request.keyConcepts,
      questionCount: request.questionCount,
    })

    const messages: AIMessage[] = [
      { role: 'system', content: EDUCATION_GURU_SYSTEM },
      { role: 'user', content: prompt },
    ]

    const response = await aiClient.generateWithRetry(async () => {
      return await aiClient.generateJSON<GeneratedQuiz>(messages, {
        temperature: 0.6,
        maxTokens: 4096,
      })
    })

    return response.content
  }

  /**
   * Generate an assignment with rubric
   */
  async generateAssignment(request: AssignmentRequest): Promise<GeneratedAssignment> {
    const prompt = fillPromptTemplate(GENERATE_ASSIGNMENT_PROMPT, {
      courseName: request.courseName,
      moduleName: request.moduleName,
      lessonTitle: request.lessonTitle || request.moduleName,
      objectives: request.objectives,
      skills: request.skills,
    })

    const messages: AIMessage[] = [
      { role: 'system', content: EDUCATION_GURU_SYSTEM },
      { role: 'user', content: prompt },
    ]

    const response = await aiClient.generateWithRetry(async () => {
      return await aiClient.generateJSON<GeneratedAssignment>(messages, {
        temperature: 0.6,
        maxTokens: 2500,
      })
    })

    return response.content
  }

  /**
   * Generate all content for a module at once
   */
  async generateModuleContent(
    courseName: string,
    module: GeneratedModule,
    previousModuleContext?: string
  ): Promise<{
    scripts: GeneratedLessonScript[]
    quizzes: GeneratedQuiz[]
    assignments: GeneratedAssignment[]
  }> {
    const scripts: GeneratedLessonScript[] = []
    const quizzes: GeneratedQuiz[] = []
    const assignments: GeneratedAssignment[] = []

    let context = previousModuleContext || ''

    for (const lesson of module.lessons) {
      if (lesson.contentType === 'video' || lesson.contentType === 'article') {
        // Generate script for video/article lessons
        const script = await this.generateLessonScript({
          courseName,
          moduleName: module.title,
          lessonTitle: lesson.title,
          duration: lesson.durationMinutes,
          objectives: lesson.learningObjectives,
          previousContext: context,
        })
        scripts.push(script)
        context += `\n${lesson.title}: ${script.summary}`
      } else if (lesson.contentType === 'quiz') {
        // Generate quiz
        const quiz = await this.generateQuiz({
          courseName,
          moduleName: module.title,
          lessonTitle: lesson.title,
          objectives: lesson.learningObjectives,
          keyConcepts: scripts.length > 0
            ? scripts[scripts.length - 1].keyTerms
            : lesson.learningObjectives,
          questionCount: 5,
        })
        quizzes.push(quiz)
      } else if (lesson.contentType === 'assignment') {
        // Generate assignment
        const assignment = await this.generateAssignment({
          courseName,
          moduleName: module.title,
          lessonTitle: lesson.title,
          objectives: lesson.learningObjectives,
          skills: lesson.learningObjectives,
        })
        assignments.push(assignment)
      }
    }

    return { scripts, quizzes, assignments }
  }

  /**
   * Convert generated script to plain text for video generation
   */
  scriptToPlainText(script: GeneratedLessonScript): string {
    let text = ''

    text += script.hook + '\n\n'
    text += script.overview + '\n\n'

    for (const section of script.sections) {
      // Remove visual markers for plain text
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

  /**
   * Estimate total course duration from outline
   */
  estimateDuration(outline: GeneratedCourseOutline): {
    totalMinutes: number
    totalLessons: number
    totalQuizzes: number
    totalAssignments: number
  } {
    let totalMinutes = 0
    let totalLessons = 0
    let totalQuizzes = 0
    let totalAssignments = 0

    for (const module of outline.modules) {
      for (const lesson of module.lessons) {
        totalMinutes += lesson.durationMinutes
        if (lesson.contentType === 'video' || lesson.contentType === 'article') {
          totalLessons++
        } else if (lesson.contentType === 'quiz') {
          totalQuizzes++
        } else if (lesson.contentType === 'assignment') {
          totalAssignments++
        }
      }
    }

    return { totalMinutes, totalLessons, totalQuizzes, totalAssignments }
  }
}

export const courseCreatorService = new CourseCreatorService()
export { CourseCreatorService }
