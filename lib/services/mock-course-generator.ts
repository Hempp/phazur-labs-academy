// Mock Course Generator - Creates realistic demo content without AI
// Used when OPENAI_API_KEY is not configured

import type { FullCourseContent, GeneratedLesson, VideoScript, LessonQuiz, LessonAssignment } from './full-course-generator'

// Template course structures for different topics
const COURSE_TEMPLATES: Record<string, {
  lessons: { title: string; focus: string }[]
  skills: string[]
}> = {
  'default': {
    lessons: [
      { title: 'Introduction & Fundamentals', focus: 'core concepts' },
      { title: 'Core Concepts Deep Dive', focus: 'foundational knowledge' },
      { title: 'Practical Applications', focus: 'hands-on skills' },
      { title: 'Advanced Techniques', focus: 'expert methods' },
      { title: 'Best Practices & Patterns', focus: 'industry standards' },
      { title: 'Real-World Projects', focus: 'practical experience' },
    ],
    skills: ['problem-solving', 'critical thinking', 'practical application', 'professional development']
  },
  'programming': {
    lessons: [
      { title: 'Getting Started with the Environment', focus: 'setup and tools' },
      { title: 'Syntax and Basic Structures', focus: 'language fundamentals' },
      { title: 'Working with Data Types', focus: 'data manipulation' },
      { title: 'Control Flow and Logic', focus: 'decision making' },
      { title: 'Functions and Modularity', focus: 'code organization' },
      { title: 'Building Your First Project', focus: 'practical application' },
    ],
    skills: ['coding', 'debugging', 'problem-solving', 'software development']
  },
  'business': {
    lessons: [
      { title: 'Understanding the Market', focus: 'market analysis' },
      { title: 'Building Your Strategy', focus: 'strategic planning' },
      { title: 'Customer Acquisition', focus: 'growth tactics' },
      { title: 'Operations & Processes', focus: 'efficiency' },
      { title: 'Financial Management', focus: 'money matters' },
      { title: 'Scaling Your Business', focus: 'growth strategies' },
    ],
    skills: ['leadership', 'strategic thinking', 'financial acumen', 'business development']
  },
  'design': {
    lessons: [
      { title: 'Design Principles Foundation', focus: 'core principles' },
      { title: 'Color Theory & Typography', focus: 'visual elements' },
      { title: 'Layout and Composition', focus: 'arrangement' },
      { title: 'User Experience Basics', focus: 'usability' },
      { title: 'Design Tools Mastery', focus: 'tools and software' },
      { title: 'Creating a Design Portfolio', focus: 'showcasing work' },
    ],
    skills: ['visual design', 'creativity', 'user empathy', 'attention to detail']
  }
}

function detectCourseType(topic: string): string {
  const topicLower = topic.toLowerCase()
  if (topicLower.includes('python') || topicLower.includes('javascript') ||
      topicLower.includes('coding') || topicLower.includes('programming') ||
      topicLower.includes('development') || topicLower.includes('react') ||
      topicLower.includes('node') || topicLower.includes('web')) {
    return 'programming'
  }
  if (topicLower.includes('business') || topicLower.includes('marketing') ||
      topicLower.includes('startup') || topicLower.includes('entrepreneur') ||
      topicLower.includes('sales') || topicLower.includes('management')) {
    return 'business'
  }
  if (topicLower.includes('design') || topicLower.includes('ux') ||
      topicLower.includes('ui') || topicLower.includes('graphic') ||
      topicLower.includes('figma') || topicLower.includes('creative')) {
    return 'design'
  }
  return 'default'
}

function generateVideoScript(lessonTitle: string, focus: string, topic: string, lessonNum: number, totalLessons: number): VideoScript {
  const sections = [
    {
      title: `Understanding ${focus}`,
      content: `Let's dive deep into ${focus}. This is one of the most important aspects of ${topic} that every learner needs to understand. We'll start with the fundamentals and build up to more complex applications. You'll see how these concepts apply directly to real-world scenarios.`,
      duration: '2 min'
    },
    {
      title: 'Key Concepts Explained',
      content: `Now that we have the basics, let's explore the key concepts in detail. Think of this like building blocks - each concept we learn adds to our foundation. I'll show you practical examples that demonstrate exactly how this works in practice. Pay attention to the patterns here, they'll come up again and again.`,
      duration: '2 min'
    },
    {
      title: 'Practical Demonstration',
      content: `Here's where it gets exciting - we're going to put theory into practice. I'll walk you through a step-by-step demonstration. Follow along if you can, or just watch first and then try it yourself. Either way, you'll see exactly how professionals approach this.`,
      duration: '2 min'
    }
  ]

  const intro = {
    hook: `Welcome to lesson ${lessonNum} of our ${topic} journey! Today we're tackling ${lessonTitle.toLowerCase()}, and trust me, this is going to be a game-changer for you.`,
    learningOutcome: `By the end of this lesson, you'll understand ${focus} and be ready to apply these skills immediately. Let's get started!`,
    duration: '30 sec' as const
  }

  const recap = {
    keyTakeaways: [
      `Master the fundamentals of ${focus}`,
      `Apply practical techniques in real scenarios`,
      `Recognize common patterns and best practices`,
      `Build confidence through hands-on experience`
    ],
    duration: '30 sec' as const
  }

  const nextPreview = lessonNum < totalLessons
    ? `In our next lesson, we'll build on everything you've learned today and take it to the next level. You won't want to miss it!`
    : `Congratulations on completing this course! You now have the skills to tackle ${topic} with confidence.`

  const fullScript = `
${intro.hook}

${intro.learningOutcome}

${sections.map(s => `${s.title}

${s.content}`).join('\n\n')}

Let me summarize what we've covered today:
${recap.keyTakeaways.map(t => `• ${t}`).join('\n')}

${nextPreview}

Thanks for learning with me today. I'll see you in the next lesson!
  `.trim()

  return {
    intro,
    content: {
      sections,
      totalDuration: '5-7 min' as const
    },
    recap,
    next: {
      preview: nextPreview,
      duration: '15 sec' as const
    },
    fullScript
  }
}

function generateQuiz(lessonTitle: string, focus: string): LessonQuiz {
  const questions = [
    {
      text: `What is the primary purpose of ${focus} in this context?`,
      type: 'multiple_choice' as const,
      options: [
        'A. To complicate the learning process',
        'B. To provide a foundation for advanced concepts',
        'C. To replace traditional methods entirely',
        'D. To satisfy regulatory requirements'
      ],
      answer: 'B',
      explanation: `${focus} provides essential foundational knowledge that enables learners to build more advanced skills and tackle complex challenges.`
    },
    {
      text: `True or False: Understanding ${focus} is optional for mastering this subject.`,
      type: 'true_false' as const,
      answer: false,
      explanation: `${focus} is a core component of this subject and essential for achieving mastery.`
    },
    {
      text: `Which approach best describes the recommended method for learning ${focus}?`,
      type: 'multiple_choice' as const,
      options: [
        'A. Theory only without practice',
        'B. Practice without understanding concepts',
        'C. Balanced combination of theory and hands-on practice',
        'D. Memorization of facts'
      ],
      answer: 'C',
      explanation: 'A balanced approach combining theoretical understanding with practical application leads to the best learning outcomes.'
    },
    {
      text: `True or False: The concepts covered in ${lessonTitle} can be applied immediately in real-world scenarios.`,
      type: 'true_false' as const,
      answer: true,
      explanation: 'The lessons are designed to be practical and immediately applicable to real-world situations.'
    },
    {
      text: `What is the most effective way to reinforce your learning from this lesson?`,
      type: 'multiple_choice' as const,
      options: [
        'A. Watch the video once and move on',
        'B. Complete the practice assignment and experiment',
        'C. Skip to the next lesson immediately',
        'D. Wait several weeks before reviewing'
      ],
      answer: 'B',
      explanation: 'Active practice and experimentation are proven to significantly improve retention and skill development.'
    }
  ]

  return {
    questions,
    passingScore: 70
  }
}

function generateAssignment(lessonTitle: string, focus: string, topic: string): LessonAssignment {
  return {
    title: `${lessonTitle} - Practical Application`,
    description: `In this assignment, you'll apply the concepts of ${focus} that you learned in this lesson. This hands-on exercise will reinforce your understanding and give you practical experience with ${topic}.`,
    steps: [
      `Review the key concepts covered in the lesson about ${focus}`,
      `Set up your practice environment following the guidelines provided`,
      `Complete the core exercise demonstrating your understanding`,
      `Document your process and any challenges you encountered`,
      `Submit your work for review and feedback`
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
      'Documentation and Reflection': 20
    },
    totalPoints: 100
  }
}

export function generateMockCourse(
  topic: string,
  difficulty: 'beginner' | 'intermediate' | 'advanced',
  lessonCount: number
): FullCourseContent {
  const courseType = detectCourseType(topic)
  const template = COURSE_TEMPLATES[courseType]

  // Generate lesson titles based on template
  const lessonTitles = template.lessons.slice(0, lessonCount).map((l, i) => ({
    title: `${topic}: ${l.title}`,
    focus: l.focus
  }))

  // If we need more lessons than the template, generate additional ones
  while (lessonTitles.length < lessonCount) {
    const num = lessonTitles.length + 1
    lessonTitles.push({
      title: `${topic}: Advanced Topic ${num}`,
      focus: `advanced concepts part ${num}`
    })
  }

  const lessons: GeneratedLesson[] = lessonTitles.map((lesson, idx) => ({
    title: lesson.title,
    description: `Master ${lesson.focus} through engaging video content, interactive quizzes, and hands-on assignments. This lesson builds on previous concepts and prepares you for more advanced topics.`,
    order: idx + 1,
    videoScript: generateVideoScript(lesson.title, lesson.focus, topic, idx + 1, lessonCount),
    quiz: generateQuiz(lesson.title, lesson.focus),
    assignment: generateAssignment(lesson.title, lesson.focus, topic)
  }))

  const difficultyDescriptions = {
    beginner: 'perfect for those just starting out',
    intermediate: 'ideal for learners with some experience',
    advanced: 'designed for experienced practitioners'
  }

  return {
    courseTitle: topic,
    courseDescription: `This comprehensive ${difficulty}-level course covers everything you need to know about ${topic}. It's ${difficultyDescriptions[difficulty]}, with ${lessonCount} engaging lessons that combine theory with practical application.`,
    targetAudience: `${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} level learners interested in ${topic}`,
    difficulty,
    totalDuration: `${lessonCount * 20} minutes`,
    lessons,
    generatedAt: new Date().toISOString()
  }
}

export function extractPlainScript(videoScript: VideoScript): string {
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
