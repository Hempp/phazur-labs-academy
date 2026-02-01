#!/usr/bin/env ts-node
/**
 * Extract lesson scripts from course-content.ts
 * Generates professional educational scripts for video generation
 */

import { getSectionsByCourseId, reactPatternsSections, typescriptSections, nodejsSections, aimlSections, uiuxSections, awsSections, nextjsSections, pythonDataScienceSections } from '../lib/data/course-content'

// Combine all course sections
const allSections = [
  ...reactPatternsSections,
  ...typescriptSections,
  ...nodejsSections,
  ...aimlSections,
  ...uiuxSections,
  ...awsSections,
  ...nextjsSections,
  ...pythonDataScienceSections,
]

interface LessonScript {
  lessonId: string
  title: string
  description: string
  courseTitle: string
  script: string
}

// Educational script templates using ADDIE model and Bloom's Taxonomy
function generateLessonScript(lesson: any, course: any): string {
  const scripts: Record<string, string> = {
    // Introduction/Welcome lessons
    introduction: `
Welcome to ${course.title}! I'm thrilled to be your instructor for this comprehensive learning journey.

${lesson.description}

Throughout this course, we'll explore key concepts step by step, building your knowledge from fundamentals to advanced techniques. Each lesson is designed to be practical and immediately applicable to real-world scenarios.

Before we dive into the content, let me share what makes this course special. You'll gain hands-on experience through carefully crafted examples, learn industry best practices, and develop skills that top professionals use every day.

I'm committed to your success, and I've designed this course to give you everything you need to master these concepts. Whether you're building your first project or advancing your career, you're in the right place.

Let's begin this exciting adventure together. I can't wait to see what you'll create!
    `.trim(),

    // Concept explanation lessons
    concept: `
In this lesson, we're exploring ${lesson.title}, a fundamental concept that will significantly enhance your development capabilities.

${lesson.description}

Let me break this down into digestible pieces. First, we'll understand the core principles and why this concept matters. Then, we'll see it in action with practical examples that demonstrate real-world applications.

The beauty of ${lesson.title} lies in how it solves common challenges developers face. By mastering this pattern, you'll write more maintainable, scalable code that your team will appreciate.

Throughout this lesson, I'll share insights from my experience using this in production applications. You'll learn not just the how, but the why - understanding when to apply this technique and when to choose alternatives.

By the end of this lesson, you'll have a solid grasp of ${lesson.title} and be ready to implement it in your own projects. Let's dive in!
    `.trim(),

    // Hands-on/Practice lessons
    practice: `
Now it's time to put theory into practice with ${lesson.title}.

${lesson.description}

In this hands-on lesson, we'll build a real-world example together, step by step. Don't worry if you're new to this - I'll guide you through every decision and explain the reasoning behind each choice.

We'll start with the basic structure, then gradually add functionality, following industry best practices. As we code, I'll point out common pitfalls and show you how to avoid them.

This practical experience is crucial for solidifying your understanding. You'll see how the concepts we've discussed actually work in a real application, and you'll gain confidence to implement these patterns on your own.

Remember, the goal isn't just to follow along - it's to understand the principles so you can adapt them to your unique situations. Feel free to pause, experiment, and make this example your own.

Ready to build something amazing? Let's get coding!
    `.trim(),

    // Advanced/Deep-dive lessons
    advanced: `
Welcome to this advanced exploration of ${lesson.title}.

${lesson.description}

In this lesson, we're going deeper into sophisticated techniques that professional developers use to create robust, scalable applications. This builds on the foundations we've established, taking your skills to the next level.

We'll examine edge cases, performance optimizations, and architectural considerations that separate good code from great code. These insights come from years of experience and countless production deployments.

What we're covering today might seem complex at first, but I'll break it down methodically. We'll tackle each challenge one piece at a time, and by the end, you'll see how all the parts fit together elegantly.

This is where the magic happens - where you transform from following tutorials to designing your own solutions. The patterns and techniques you'll learn here are the same ones used by senior engineers at top tech companies.

Let's push your boundaries and unlock new capabilities. You've got this!
    `.trim(),

    // Project/Capstone lessons
    project: `
It's time to bring everything together in ${lesson.title}.

${lesson.description}

This project-based lesson is your opportunity to synthesize everything you've learned into a complete, production-quality application. We'll combine multiple concepts, apply best practices, and create something you can proudly showcase.

I'll guide you through the planning phase, where we'll make key architectural decisions. Then we'll implement features systematically, just like you would in a professional development environment.

Throughout the project, you'll face realistic challenges - the same ones developers encounter in the real world. We'll troubleshoot together, refactor when needed, and make pragmatic trade-offs.

This is more than just an exercise. By the end, you'll have a portfolio-worthy project and the confidence to tackle similar challenges independently.

Let's build something impressive together. Your future self will thank you for putting in this effort!
    `.trim(),

    // Summary/Conclusion lessons
    summary: `
Congratulations on completing ${lesson.title}!

${lesson.description}

Let's take a moment to review what we've covered and solidify your understanding. We've explored important concepts, tackled practical challenges, and built real-world skills.

The key takeaways from this section are crucial for your continued growth. These aren't just theoretical concepts - they're practical tools you can use immediately in your projects.

As you move forward, remember that mastery comes through practice. Apply what you've learned, experiment with variations, and don't be afraid to make mistakes. Each challenge you overcome makes you a stronger developer.

Looking ahead, the next section will build on this foundation, introducing new techniques that complement what you already know. Everything we're learning connects together to form a comprehensive skill set.

Keep up the excellent work. You're making real progress, and I'm excited to continue this journey with you!
    `.trim(),
  }

  // Determine lesson type based on title and description
  const titleLower = lesson.title.toLowerCase()
  const descLower = lesson.description.toLowerCase()

  if (titleLower.includes('welcome') || titleLower.includes('introduction') || titleLower.includes('overview')) {
    return scripts.introduction
  } else if (titleLower.includes('project') || titleLower.includes('build') || descLower.includes('build')) {
    return scripts.project
  } else if (titleLower.includes('practice') || titleLower.includes('hands-on') || titleLower.includes('exercise')) {
    return scripts.practice
  } else if (titleLower.includes('advanced') || titleLower.includes('deep dive') || titleLower.includes('mastery')) {
    return scripts.advanced
  } else if (titleLower.includes('summary') || titleLower.includes('recap') || titleLower.includes('conclusion')) {
    return scripts.summary
  } else {
    return scripts.concept
  }
}

function extractAllLessonScripts(): LessonScript[] {
  const scripts: LessonScript[] = []

  // Map sections to their course titles
  const sectionCourseMap: Record<string, string> = {
    'react': 'Advanced React Patterns',
    'typescript': 'TypeScript Mastery',
    'nodejs': 'Node.js Mastery',
    'aiml': 'AI & Machine Learning',
    'uiux': 'UI/UX Design',
    'aws': 'AWS Cloud',
    'nextjs': 'Next.js Mastery',
    'python': 'Python Data Science',
  }

  allSections.forEach(section => {
    // Determine course title from section id
    const courseKey = Object.keys(sectionCourseMap).find(key =>
      section.id.toLowerCase().includes(key)
    ) || 'Course'
    const courseTitle = sectionCourseMap[courseKey] || 'Course'

    section.lessons.forEach(lesson => {
      if (lesson.type === 'video') {
        const script = generateLessonScript(lesson, { title: courseTitle })

        scripts.push({
          lessonId: lesson.id,
          title: lesson.title,
          description: lesson.description || '',
          courseTitle: courseTitle,
          script: script
        })
      }
    })
  })

  return scripts
}

// Main execution
const scripts = extractAllLessonScripts()

// Output as JSON for Python script to consume
console.log(JSON.stringify(scripts, null, 2))

// Also write to file
import * as fs from 'fs'
import * as path from 'path'

const outputPath = path.join(process.cwd(), 'temp', 'lesson-scripts.json')
fs.mkdirSync(path.dirname(outputPath), { recursive: true })
fs.writeFileSync(outputPath, JSON.stringify(scripts, null, 2))

console.error(`\n✅ Extracted ${scripts.length} lesson scripts`)
console.error(`📁 Saved to: ${outputPath}`)
