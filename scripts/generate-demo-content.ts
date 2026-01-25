#!/usr/bin/env npx tsx

/**
 * Generate Demo Content for Empty Courses
 *
 * Usage: npx tsx scripts/generate-demo-content.ts
 *
 * This script can use either OpenAI for AI-generated content or
 * fall back to mock content if OPENAI_API_KEY is not configured.
 */

import { createClient } from '@supabase/supabase-js'

// Load environment
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cpwowfcqkltnjcixmaaf.supabase.co'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || ''

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const USE_MOCK = !OPENAI_API_KEY
if (USE_MOCK) {
  console.log('⚠️  OPENAI_API_KEY not found - using mock content generator')
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// Optional OpenAI import - only used if API key is configured
let openai: any = null
if (!USE_MOCK) {
  const OpenAI = require('openai').default
  openai = new OpenAI({ apiKey: OPENAI_API_KEY })
}

// Types
interface VideoScript {
  intro: { hook: string; learningOutcome: string; duration: string }
  content: { sections: { title: string; content: string; duration: string }[]; totalDuration: string }
  recap: { keyTakeaways: string[]; duration: string }
  next: { preview: string; duration: string }
  fullScript: string
}

interface QuizQuestion {
  text: string
  type: 'multiple_choice' | 'true_false'
  options?: string[]
  answer: string | boolean
  explanation: string
}

interface GeneratedLesson {
  title: string
  description: string
  videoScript: VideoScript
  quiz: { questions: QuizQuestion[]; passingScore: number }
  assignment: {
    title: string
    description: string
    steps: string[]
    deliverables: string[]
    rubric: Record<string, number>
    totalPoints: number
  }
  order: number
}

interface FullCourseContent {
  courseTitle: string
  courseDescription: string
  targetAudience: string
  difficulty: string
  totalDuration: string
  lessons: GeneratedLesson[]
}

// System prompt for course generation
const SYSTEM_PROMPT = `You are an expert educational content creator. Create engaging, professional online courses with:
1. Conversational tone, speaking directly to learners
2. Practical, real-world applications
3. Structured pedagogy following proven patterns

Video scripts follow: INTRO (30 sec), CONTENT (5-7 min with 3-4 sections), RECAP (30 sec), NEXT (15 sec).
Scripts are 500-800 words, second person ("you").
Quizzes have 5 varied questions (multiple choice with A/B/C/D and true/false).
Assignments are practical with clear steps, deliverables, and 100-point rubrics.`

// Mock course generator (embedded to avoid import issues in scripts)
function generateMockCourse(topic: string, difficulty: string, lessonCount: number): FullCourseContent {
  const lessons: GeneratedLesson[] = []

  const lessonTemplates = [
    { title: 'Introduction & Fundamentals', focus: 'core concepts' },
    { title: 'Core Concepts Deep Dive', focus: 'foundational knowledge' },
    { title: 'Practical Applications', focus: 'hands-on skills' },
    { title: 'Advanced Techniques', focus: 'expert methods' },
    { title: 'Best Practices & Patterns', focus: 'industry standards' },
    { title: 'Real-World Projects', focus: 'practical experience' },
    { title: 'Optimization Strategies', focus: 'performance tuning' },
    { title: 'Capstone Project', focus: 'comprehensive application' },
  ]

  for (let i = 0; i < lessonCount; i++) {
    const template = lessonTemplates[i % lessonTemplates.length]
    const lessonTitle = `${topic}: ${template.title}`
    const focus = template.focus

    const videoScript: VideoScript = {
      intro: {
        hook: `Welcome to lesson ${i + 1} of our ${topic} journey! Today we're tackling ${template.title.toLowerCase()}, and this is going to be a game-changer for you.`,
        learningOutcome: `By the end of this lesson, you'll understand ${focus} and be ready to apply these skills immediately.`,
        duration: '30 sec'
      },
      content: {
        sections: [
          {
            title: `Understanding ${focus}`,
            content: `Let's dive deep into ${focus}. This is one of the most important aspects of ${topic} that every learner needs to understand. We'll start with the fundamentals and build up to more complex applications.`,
            duration: '2 min'
          },
          {
            title: 'Key Concepts Explained',
            content: `Now that we have the basics, let's explore the key concepts in detail. Think of this like building blocks - each concept we learn adds to our foundation. I'll show you practical examples that demonstrate exactly how this works.`,
            duration: '2 min'
          },
          {
            title: 'Practical Demonstration',
            content: `Here's where it gets exciting - we're going to put theory into practice. I'll walk you through a step-by-step demonstration. Follow along if you can, or just watch first and then try it yourself.`,
            duration: '2 min'
          }
        ],
        totalDuration: '5-7 min'
      },
      recap: {
        keyTakeaways: [
          `Master the fundamentals of ${focus}`,
          `Apply practical techniques in real scenarios`,
          `Recognize common patterns and best practices`,
          `Build confidence through hands-on experience`
        ],
        duration: '30 sec'
      },
      next: {
        preview: i < lessonCount - 1
          ? `In our next lesson, we'll build on everything you've learned today and take it to the next level!`
          : `Congratulations on completing this course! You now have the skills to tackle ${topic} with confidence.`,
        duration: '15 sec'
      },
      fullScript: `Welcome to lesson ${i + 1}! Today we're covering ${template.title.toLowerCase()}...`
    }

    const quiz = {
      questions: [
        {
          text: `What is the primary purpose of ${focus} in ${topic}?`,
          type: 'multiple_choice' as const,
          options: ['A. To complicate the process', 'B. To provide a foundation for advanced concepts', 'C. To replace traditional methods', 'D. To satisfy requirements'],
          answer: 'B',
          explanation: `${focus} provides essential foundational knowledge for mastering ${topic}.`
        },
        {
          text: `True or False: Understanding ${focus} is optional for mastering ${topic}.`,
          type: 'true_false' as const,
          answer: false,
          explanation: `${focus} is a core component and essential for achieving mastery.`
        },
        {
          text: `Which approach is best for learning ${focus}?`,
          type: 'multiple_choice' as const,
          options: ['A. Theory only', 'B. Practice without concepts', 'C. Balanced theory and hands-on practice', 'D. Memorization'],
          answer: 'C',
          explanation: 'A balanced approach leads to the best learning outcomes.'
        },
        {
          text: `True or False: The concepts in ${lessonTitle} can be applied immediately.`,
          type: 'true_false' as const,
          answer: true,
          explanation: 'Lessons are designed to be practical and immediately applicable.'
        },
        {
          text: `What reinforces learning most effectively?`,
          type: 'multiple_choice' as const,
          options: ['A. Watch once and move on', 'B. Complete practice assignments', 'C. Skip to next lesson', 'D. Wait weeks before reviewing'],
          answer: 'B',
          explanation: 'Active practice significantly improves retention and skill development.'
        }
      ],
      passingScore: 70
    }

    const assignment = {
      title: `${lessonTitle} - Practical Application`,
      description: `Apply the concepts of ${focus} that you learned in this lesson through hands-on exercises.`,
      steps: [
        `Review the key concepts covered about ${focus}`,
        `Set up your practice environment`,
        `Complete the core exercise`,
        `Document your process and challenges`,
        `Submit your work for review`
      ],
      deliverables: [
        'Completed exercise file or project',
        'Brief reflection document (200-300 words)',
        'Screenshot or evidence of your work'
      ],
      rubric: {
        'Understanding of Concepts': 25,
        'Correct Implementation': 30,
        'Quality and Completeness': 25,
        'Documentation': 20
      },
      totalPoints: 100
    }

    lessons.push({
      title: lessonTitle,
      description: `Master ${focus} through engaging video content, interactive quizzes, and hands-on assignments.`,
      videoScript,
      quiz,
      assignment,
      order: i + 1
    })
  }

  return {
    courseTitle: topic,
    courseDescription: `This comprehensive ${difficulty}-level course covers everything you need to know about ${topic}. It includes ${lessonCount} engaging lessons that combine theory with practical application.`,
    targetAudience: `${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} level learners interested in ${topic}`,
    difficulty: difficulty as 'beginner' | 'intermediate' | 'advanced',
    totalDuration: `${lessonCount * 20} minutes`,
    lessons
  }
}

async function generateCourseContent(topic: string, difficulty: string, lessonCount: number): Promise<FullCourseContent> {
  // Use mock generator if OpenAI is not configured
  if (USE_MOCK) {
    console.log(`  📦 Generating mock content for "${topic}" (${lessonCount} lessons)...`)
    return generateMockCourse(topic, difficulty, lessonCount)
  }

  console.log(`  🤖 Generating AI content for "${topic}" (${lessonCount} lessons)...`)

  const prompt = `Create a complete course on: ${topic}
Difficulty: ${difficulty}
Number of lessons: ${lessonCount}

Return a JSON object with this exact structure:
{
  "courseTitle": "string",
  "courseDescription": "2-3 sentences",
  "targetAudience": "string",
  "difficulty": "${difficulty}",
  "totalDuration": "e.g., 4 hours",
  "lessons": [
    {
      "title": "string",
      "description": "string",
      "order": 1,
      "videoScript": {
        "intro": { "hook": "attention grabber", "learningOutcome": "what they learn", "duration": "30 sec" },
        "content": {
          "sections": [{ "title": "string", "content": "teaching content", "duration": "2 min" }],
          "totalDuration": "5-7 min"
        },
        "recap": { "keyTakeaways": ["point 1", "point 2", "point 3"], "duration": "30 sec" },
        "next": { "preview": "what's coming next", "duration": "15 sec" },
        "fullScript": "complete 500-800 word conversational script"
      },
      "quiz": {
        "questions": [
          { "text": "question", "type": "multiple_choice", "options": ["A opt", "B opt", "C opt", "D opt"], "answer": "B", "explanation": "why" }
        ],
        "passingScore": 70
      },
      "assignment": {
        "title": "string",
        "description": "string",
        "steps": ["Step 1", "Step 2"],
        "deliverables": ["File 1", "File 2"],
        "rubric": { "Criteria 1": 25, "Criteria 2": 25, "Criteria 3": 25, "Criteria 4": 25 },
        "totalPoints": 100
      }
    }
  ]
}`

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 16000,
    response_format: { type: 'json_object' },
  })

  const content = response.choices[0].message.content
  if (!content) throw new Error('No content generated')

  return JSON.parse(content) as FullCourseContent
}

function extractPlainScript(videoScript: VideoScript): string {
  let text = ''
  text += `[INTRO]\n${videoScript.intro.hook}\n${videoScript.intro.learningOutcome}\n\n`
  text += `[CONTENT]\n`
  for (const section of videoScript.content.sections) {
    text += `${section.title}\n${section.content}\n\n`
  }
  text += `[RECAP]\nKey takeaways:\n`
  for (const takeaway of videoScript.recap.keyTakeaways) {
    text += `• ${takeaway}\n`
  }
  text += `\n[NEXT]\n${videoScript.next.preview}`
  return text.trim()
}

async function main() {
  console.log('\n🎓 Phazur Labs Academy - Demo Content Generator\n')

  // Find empty courses
  console.log('📚 Finding courses without lessons...')

  const { data: courses, error: coursesError } = await supabase
    .from('courses')
    .select('id, title, description, level')
    .order('created_at', { ascending: false })

  if (coursesError) {
    console.error('❌ Failed to fetch courses:', coursesError.message)
    process.exit(1)
  }

  const emptyCourses: typeof courses = []

  for (const course of courses || []) {
    const { count } = await supabase
      .from('lessons')
      .select('id', { count: 'exact', head: true })
      .eq('course_id', course.id)

    if (count === 0) {
      emptyCourses.push(course)
    }
  }

  if (emptyCourses.length === 0) {
    console.log('✅ All courses already have content!')
    process.exit(0)
  }

  console.log(`\n📋 Found ${emptyCourses.length} courses needing content:`)
  emptyCourses.forEach((c, i) => console.log(`   ${i + 1}. ${c.title}`))
  console.log('')

  // Generate content for each course
  let successCount = 0
  let totalLessons = 0

  for (const course of emptyCourses) {
    console.log(`\n🔄 Processing: ${course.title}`)

    try {
      // Generate course content
      const difficulty = (course.level as 'beginner' | 'intermediate' | 'advanced') || 'beginner'
      const generatedCourse = await generateCourseContent(course.title, difficulty, 6)

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

      if (moduleError) throw new Error('Module creation failed: ' + moduleError.message)

      console.log(`  📦 Created module`)

      // Create lessons
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
            article_content: extractPlainScript(lesson.videoScript),
            display_order: lesson.order,
            video_duration_seconds: 7 * 60,
          })
          .select()
          .single()

        if (lessonError) {
          console.error(`  ⚠️ Failed to create lesson: ${lesson.title}`)
          continue
        }

        lessonsCreated++

        // Create quiz
        const { data: newQuiz } = await supabase
          .from('quizzes')
          .insert({
            module_id: courseModule.id,
            course_id: course.id,
            title: `${lesson.title} Quiz`,
            passing_score: lesson.quiz.passingScore,
            time_limit_minutes: 15,
          })
          .select()
          .single()

        if (newQuiz) {
          for (const question of lesson.quiz.questions) {
            const { data: newQuestion } = await supabase
              .from('questions')
              .insert({
                quiz_id: newQuiz.id,
                question_text: question.text,
                type: question.type === 'true_false' ? 'true_false' : 'single_choice',
                points: 20,
              })
              .select()
              .single()

            if (newQuestion) {
              const answers = question.type === 'true_false'
                ? [
                    { question_id: newQuestion.id, answer_text: 'True', is_correct: question.answer === true },
                    { question_id: newQuestion.id, answer_text: 'False', is_correct: question.answer === false },
                  ]
                : (question.options || []).map((opt, i) => ({
                    question_id: newQuestion.id,
                    answer_text: opt,
                    is_correct: question.answer === ['A', 'B', 'C', 'D'][i],
                  }))

              await supabase.from('answers').insert(answers)
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

        console.log(`  ✅ Lesson ${lesson.order}: ${lesson.title}`)
      }

      // Update course lesson count
      await supabase
        .from('courses')
        .update({
          total_lessons: lessonsCreated,
          total_duration_minutes: lessonsCreated * 7,
        })
        .eq('id', course.id)

      console.log(`  ✅ Created ${lessonsCreated} lessons with quizzes and assignments`)
      successCount++
      totalLessons += lessonsCreated

    } catch (error) {
      console.error(`  ❌ Failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  console.log('\n' + '═'.repeat(50))
  console.log(`✅ Generated content for ${successCount}/${emptyCourses.length} courses`)
  console.log(`📚 Total lessons created: ${totalLessons}`)
  console.log('═'.repeat(50) + '\n')
}

main().catch(console.error)
