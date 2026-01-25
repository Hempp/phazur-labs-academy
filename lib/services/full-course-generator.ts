// Full Course Generator Service
// Generates complete courses with video scripts, quizzes, and assignments
// in the exact format specified for Phazur Labs Academy

import { aiClient, type AIMessage } from './ai-client'

// ============================================================================
// Types matching user's exact specifications
// ============================================================================

export interface VideoScript {
  intro: {
    hook: string
    learningOutcome: string
    duration: '30 sec'
  }
  content: {
    sections: {
      title: string
      content: string
      duration: string
    }[]
    totalDuration: '5-7 min'
  }
  recap: {
    keyTakeaways: string[]
    duration: '30 sec'
  }
  next: {
    preview: string
    duration: '15 sec'
  }
  fullScript: string // 500-800 words conversational
}

export interface QuizQuestion {
  text: string
  type: 'multiple_choice' | 'true_false'
  options?: string[] // For multiple choice: ["A", "B", "C", "D"]
  answer: string | boolean // "B" for multiple choice, true/false for true_false
  explanation: string
}

export interface LessonQuiz {
  questions: QuizQuestion[]
  passingScore: number // 70
}

export interface LessonAssignment {
  title: string
  description: string
  steps: string[]
  deliverables: string[]
  rubric: Record<string, number> // { "Criteria 1": 25, "Criteria 2": 25, "Criteria 3": 50 }
  totalPoints: number // 100
}

export interface GeneratedLesson {
  title: string
  description: string
  videoScript: VideoScript
  quiz: LessonQuiz
  assignment: LessonAssignment
  order: number
}

export interface FullCourseContent {
  courseTitle: string
  courseDescription: string
  targetAudience: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  totalDuration: string
  lessons: GeneratedLesson[]
  generatedAt: string
}

export interface FullCourseRequest {
  topic: string
  audience: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  lessonCount: number // 6-8 recommended
}

// ============================================================================
// System Prompt for Full Course Generation
// ============================================================================

const FULL_COURSE_SYSTEM = `You are an expert educational content creator specializing in creating engaging, professional online courses. You create content that is:

1. **Conversational**: Written as if speaking directly to the learner
2. **Practical**: Focused on real-world application
3. **Structured**: Follows proven pedagogical patterns
4. **Engaging**: Uses hooks, stories, and examples

Your video scripts follow this exact format:
- INTRO (30 sec): Welcome hook, state what they'll learn
- CONTENT (5-7 min): Main teaching with examples, 3-4 sections
- RECAP (30 sec): Key takeaways as bullet points
- NEXT (15 sec): Preview next lesson

Scripts are 500-800 words, conversational tone, second person ("you").

Your quizzes test understanding with 5 varied questions (mix of multiple choice and true/false).

Your assignments are practical exercises with clear steps, deliverables, and rubrics totaling 100 points.`

// ============================================================================
// Generation Prompts
// ============================================================================

const GENERATE_FULL_COURSE_PROMPT = `Create a complete course on the following topic.

TOPIC: {topic}
TARGET AUDIENCE: {audience}
DIFFICULTY: {difficulty}
NUMBER OF LESSONS: {lessonCount}

Generate a course with {lessonCount} lessons. Each lesson must include:

1. **Video Script** (500-800 words total, conversational tone):
   - INTRO (30 sec): Hook that grabs attention, clearly state what they'll learn
   - CONTENT (5-7 min): Main teaching broken into 3-4 logical sections with examples
   - RECAP (30 sec): 3-5 key takeaways as bullet points
   - NEXT (15 sec): Preview of the next lesson topic

2. **Quiz** (5 questions):
   - Mix of multiple_choice and true_false
   - Multiple choice has options ["A", "B", "C", "D"]
   - Include explanation for correct answer
   - passingScore: 70

3. **Assignment** (1 practical exercise):
   - Clear title and description
   - Step-by-step instructions (4-6 steps)
   - Specific deliverables (2-3 items)
   - Rubric with criteria summing to 100 points

Respond with this exact JSON structure:
{
  "courseTitle": "string",
  "courseDescription": "string (2-3 sentences)",
  "targetAudience": "string",
  "difficulty": "beginner" | "intermediate" | "advanced",
  "totalDuration": "string (e.g., '4 hours')",
  "lessons": [
    {
      "title": "string",
      "description": "string",
      "order": number,
      "videoScript": {
        "intro": {
          "hook": "string (attention grabber)",
          "learningOutcome": "string (what they'll learn)",
          "duration": "30 sec"
        },
        "content": {
          "sections": [
            {
              "title": "string",
              "content": "string (teaching content with examples)",
              "duration": "string (e.g., '2 min')"
            }
          ],
          "totalDuration": "5-7 min"
        },
        "recap": {
          "keyTakeaways": ["string", "string", "string"],
          "duration": "30 sec"
        },
        "next": {
          "preview": "string (what's coming next)",
          "duration": "15 sec"
        },
        "fullScript": "string (complete 500-800 word script in conversational tone)"
      },
      "quiz": {
        "questions": [
          {
            "text": "string",
            "type": "multiple_choice" | "true_false",
            "options": ["A option text", "B option text", "C option text", "D option text"],
            "answer": "B" | true | false,
            "explanation": "string"
          }
        ],
        "passingScore": 70
      },
      "assignment": {
        "title": "string",
        "description": "string",
        "steps": ["Step 1...", "Step 2..."],
        "deliverables": ["File 1", "File 2"],
        "rubric": {
          "Criteria 1": 25,
          "Criteria 2": 25,
          "Criteria 3": 25,
          "Criteria 4": 25
        },
        "totalPoints": 100
      }
    }
  ],
  "generatedAt": "ISO date string"
}`

// ============================================================================
// Full Course Generator Service
// ============================================================================

class FullCourseGeneratorService {
  /**
   * Check if AI is configured
   */
  isConfigured(): boolean {
    return aiClient.isConfigured()
  }

  /**
   * Generate a complete course with all content
   */
  async generateFullCourse(request: FullCourseRequest): Promise<FullCourseContent> {
    const prompt = this.fillTemplate(GENERATE_FULL_COURSE_PROMPT, {
      topic: request.topic,
      audience: request.audience,
      difficulty: request.difficulty,
      lessonCount: request.lessonCount.toString(),
    })

    const messages: AIMessage[] = [
      { role: 'system', content: FULL_COURSE_SYSTEM },
      { role: 'user', content: prompt },
    ]

    // Use higher token limit for full course generation
    const response = await aiClient.generateWithRetry(async () => {
      return await aiClient.generateJSON<FullCourseContent>(messages, {
        temperature: 0.7,
        maxTokens: 16000, // Need more tokens for full course
        model: 'gpt-4o', // Use more capable model for large generation
      })
    })

    // Add timestamp if not present
    if (!response.content.generatedAt) {
      response.content.generatedAt = new Date().toISOString()
    }

    return response.content
  }

  /**
   * Generate a single lesson with all content
   */
  async generateSingleLesson(
    courseTitle: string,
    lessonTitle: string,
    lessonNumber: number,
    totalLessons: number,
    previousLessonTitle?: string,
    nextLessonTitle?: string
  ): Promise<GeneratedLesson> {
    const prompt = `Generate content for a single lesson in the course "${courseTitle}".

LESSON TITLE: ${lessonTitle}
LESSON NUMBER: ${lessonNumber} of ${totalLessons}
PREVIOUS LESSON: ${previousLessonTitle || 'This is the first lesson'}
NEXT LESSON: ${nextLessonTitle || 'This is the final lesson'}

Generate:
1. Video script (500-800 words) with INTRO, CONTENT (3-4 sections), RECAP, NEXT
2. Quiz with 5 questions (mix of multiple_choice and true_false)
3. Assignment with steps, deliverables, and 100-point rubric

Return JSON matching the lesson structure exactly.`

    const messages: AIMessage[] = [
      { role: 'system', content: FULL_COURSE_SYSTEM },
      { role: 'user', content: prompt },
    ]

    const response = await aiClient.generateWithRetry(async () => {
      return await aiClient.generateJSON<GeneratedLesson>(messages, {
        temperature: 0.7,
        maxTokens: 4000,
      })
    })

    return response.content
  }

  /**
   * Extract plain text script for video generation
   */
  extractPlainScript(videoScript: VideoScript): string {
    let text = ''

    // Intro
    text += `[INTRO]\n`
    text += videoScript.intro.hook + '\n'
    text += videoScript.intro.learningOutcome + '\n\n'

    // Content sections
    text += `[CONTENT]\n`
    for (const section of videoScript.content.sections) {
      text += `${section.title}\n`
      text += section.content + '\n\n'
    }

    // Recap
    text += `[RECAP]\n`
    text += 'Key takeaways:\n'
    for (const takeaway of videoScript.recap.keyTakeaways) {
      text += `• ${takeaway}\n`
    }
    text += '\n'

    // Next
    text += `[NEXT]\n`
    text += videoScript.next.preview

    return text.trim()
  }

  /**
   * Convert quiz to database format
   */
  convertQuizForDatabase(quiz: LessonQuiz): {
    questions: Array<{
      question_text: string
      type: string
      points: number
      answers: Array<{
        answer_text: string
        is_correct: boolean
      }>
    }>
    passing_score: number
  } {
    return {
      questions: quiz.questions.map((q, idx) => ({
        question_text: q.text,
        type: q.type === 'true_false' ? 'true_false' : 'single_choice',
        points: 20, // Each question worth 20 points (5 questions = 100 total)
        answers: q.type === 'true_false'
          ? [
              { answer_text: 'True', is_correct: q.answer === true },
              { answer_text: 'False', is_correct: q.answer === false },
            ]
          : (q.options || []).map((opt, optIdx) => ({
              answer_text: opt,
              is_correct: q.answer === ['A', 'B', 'C', 'D'][optIdx],
            })),
      })),
      passing_score: quiz.passingScore,
    }
  }

  /**
   * Fill prompt template with values
   */
  private fillTemplate(template: string, values: Record<string, string>): string {
    let result = template
    for (const [key, value] of Object.entries(values)) {
      result = result.replace(new RegExp(`{${key}}`, 'g'), value)
    }
    return result
  }
}

export const fullCourseGenerator = new FullCourseGeneratorService()
export { FullCourseGeneratorService }
