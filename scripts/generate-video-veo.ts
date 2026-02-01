#!/usr/bin/env npx tsx
/**
 * Google Veo Video Generator for Phazur Labs Academy
 * Uses Gemini API with Veo 3.1 for AI-generated educational videos
 *
 * Usage:
 *   npx tsx scripts/generate-video-veo.ts --list
 *   npx tsx scripts/generate-video-veo.ts --lesson lesson-react-1-1
 *   npx tsx scripts/generate-video-veo.ts --prompt "Create an animation..."
 */

import { config } from 'dotenv'
config({ path: '.env.local' })

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'

const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY
const PROJECT_ROOT = process.cwd()
const SCRIPTS_FILE = join(PROJECT_ROOT, 'temp', 'lesson-scripts.json')
const OUTPUT_DIR = join(PROJECT_ROOT, 'public', 'videos', 'lessons')

interface LessonScript {
  lessonId: string
  title: string
  description: string
  courseTitle: string
  script: string
}

interface VeoGenerateRequest {
  prompt: string
  aspectRatio?: '16:9' | '9:16' | '1:1'
  duration?: number // seconds (max 8)
  resolution?: '720p' | '1080p' | '4k'
}

class VeoVideoGenerator {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  /**
   * Generate a video using Veo 3.1
   */
  async generateVideo(request: VeoGenerateRequest): Promise<{ videoUrl: string; audioUrl?: string }> {
    console.log('  🎬 Generating video with Veo 3.1...')
    console.log(`     Prompt: ${request.prompt.slice(0, 100)}...`)

    // Veo API endpoint (via Gemini API)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/veo-3.1:generateVideo?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: request.prompt,
          generationConfig: {
            aspectRatio: request.aspectRatio || '16:9',
            durationSeconds: request.duration || 8,
            resolution: request.resolution || '1080p',
          },
        }),
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Veo API error: ${JSON.stringify(error)}`)
    }

    const result = await response.json()

    // Poll for completion
    const operationId = result.name
    console.log(`  ⏳ Video generating... (operation: ${operationId})`)

    return await this.waitForVideo(operationId)
  }

  /**
   * Wait for video generation to complete
   */
  private async waitForVideo(operationId: string): Promise<{ videoUrl: string }> {
    const maxWait = 300000 // 5 minutes
    const startTime = Date.now()

    while (Date.now() - startTime < maxWait) {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/${operationId}?key=${this.apiKey}`
      )

      const result = await response.json()

      if (result.done) {
        if (result.error) {
          throw new Error(`Veo error: ${result.error.message}`)
        }
        console.log('  ✅ Video generated!')
        return {
          videoUrl: result.response.videoUri,
        }
      }

      console.log('     Still generating...')
      await new Promise(r => setTimeout(r, 5000))
    }

    throw new Error('Video generation timed out')
  }

  /**
   * Download video to local file
   */
  async downloadVideo(videoUrl: string, outputPath: string): Promise<void> {
    console.log('  📥 Downloading video...')
    const response = await fetch(videoUrl)
    const buffer = Buffer.from(await response.arrayBuffer())
    writeFileSync(outputPath, buffer)
    console.log(`  ✅ Saved: ${outputPath}`)
  }
}

/**
 * Generate a lecture-style video prompt for educational content
 */
function createLecturePrompt(lesson: LessonScript): string {
  return `Create an educational lecture video for "${lesson.title}" from the course "${lesson.courseTitle}".

The video should feature:
- A professional instructor avatar presenting to camera
- Clean, modern educational setting (classroom or studio)
- Text overlays highlighting key concepts
- Smooth transitions between topics
- Professional lighting and framing

Topic: ${lesson.description}

The instructor should speak naturally and engagingly, explaining the concepts clearly.
Style: Professional educational content, similar to Coursera or Udemy courses.
Mood: Friendly, informative, engaging
Camera: Medium shot of instructor, occasional close-ups for emphasis`
}

async function loadScripts(): Promise<LessonScript[]> {
  if (!existsSync(SCRIPTS_FILE)) {
    console.error('❌ Scripts file not found:', SCRIPTS_FILE)
    console.error('   Run: node scripts/extract-lesson-scripts.mjs')
    process.exit(1)
  }
  return JSON.parse(readFileSync(SCRIPTS_FILE, 'utf-8'))
}

async function main() {
  const args = process.argv.slice(2)

  if (!GEMINI_API_KEY) {
    console.error('❌ GOOGLE_GEMINI_API_KEY not configured')
    console.error('   Get your key from: https://aistudio.google.com/apikey')
    console.error('   Add to .env.local: GOOGLE_GEMINI_API_KEY=your-key')
    process.exit(1)
  }

  const generator = new VeoVideoGenerator(GEMINI_API_KEY)

  if (args.includes('--list')) {
    const scripts = await loadScripts()
    console.log(`\n📚 Available lessons (${scripts.length}):\n`)
    scripts.forEach(s => {
      console.log(`  ${s.lessonId}: ${s.title}`)
    })
    return
  }

  const lessonIdx = args.indexOf('--lesson')
  if (lessonIdx !== -1 && args[lessonIdx + 1]) {
    const lessonId = args[lessonIdx + 1]
    const scripts = await loadScripts()
    const lesson = scripts.find(s => s.lessonId === lessonId)

    if (!lesson) {
      console.error(`❌ Lesson not found: ${lessonId}`)
      return
    }

    console.log(`\n🎬 Generating Veo video for: ${lesson.title}\n`)

    const prompt = createLecturePrompt(lesson)
    const result = await generator.generateVideo({
      prompt,
      aspectRatio: '16:9',
      duration: 8,
      resolution: '1080p',
    })

    mkdirSync(OUTPUT_DIR, { recursive: true })
    const outputPath = join(OUTPUT_DIR, `${lessonId}-veo.mp4`)
    await generator.downloadVideo(result.videoUrl, outputPath)

    console.log(`\n✅ Video saved: ${outputPath}`)
    return
  }

  const promptIdx = args.indexOf('--prompt')
  if (promptIdx !== -1 && args[promptIdx + 1]) {
    const prompt = args[promptIdx + 1]
    console.log(`\n🎬 Generating custom Veo video\n`)

    const result = await generator.generateVideo({
      prompt,
      aspectRatio: '16:9',
      duration: 8,
      resolution: '1080p',
    })

    mkdirSync(OUTPUT_DIR, { recursive: true })
    const outputPath = join(OUTPUT_DIR, `custom-${Date.now()}.mp4`)
    await generator.downloadVideo(result.videoUrl, outputPath)

    console.log(`\n✅ Video saved: ${outputPath}`)
    return
  }

  // Show help
  console.log(`
🎬 Google Veo Video Generator for Phazur Labs Academy

Usage:
  npx tsx scripts/generate-video-veo.ts --list              # List lessons
  npx tsx scripts/generate-video-veo.ts --lesson <id>       # Generate lesson video
  npx tsx scripts/generate-video-veo.ts --prompt "text"     # Custom video prompt

Examples:
  npx tsx scripts/generate-video-veo.ts --lesson lesson-react-1-1
  npx tsx scripts/generate-video-veo.ts --prompt "A 3D animation explaining React hooks"

Note: Veo 3.1 generates up to 8-second clips at $0.75/second.
For longer content, consider generating multiple clips and combining them.
  `)
}

main().catch(console.error)
