#!/usr/bin/env npx tsx
/**
 * Generate course videos using HeyGen API
 * Usage:
 *   npx tsx scripts/generate-video-heygen.ts --list-avatars
 *   npx tsx scripts/generate-video-heygen.ts --list-voices
 *   npx tsx scripts/generate-video-heygen.ts --lesson lesson-react-1-1
 *   npx tsx scripts/generate-video-heygen.ts --all
 */

// Load environment variables from .env.local
import { config } from 'dotenv'
config({ path: '.env.local' })

import { heygenService, HeyGenAvatar, HeyGenVoice } from '../lib/services/heygen'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'

interface LessonScript {
  lessonId: string
  title: string
  description: string
  courseTitle: string
  script: string
}

const PROJECT_ROOT = join(__dirname, '..')
const SCRIPTS_FILE = join(PROJECT_ROOT, 'temp', 'lesson-scripts.json')
const OUTPUT_DIR = join(PROJECT_ROOT, 'public', 'courses')

// Default avatar and voice IDs (you can customize these)
const DEFAULT_AVATAR_ID = 'anna_costume1_front' // Professional female
const DEFAULT_VOICE_ID = 'en-US-JennyNeural' // Natural female voice

async function loadScripts(): Promise<LessonScript[]> {
  if (!existsSync(SCRIPTS_FILE)) {
    console.error('❌ Scripts file not found:', SCRIPTS_FILE)
    console.error('   Run: node scripts/extract-lesson-scripts.mjs')
    process.exit(1)
  }

  return JSON.parse(readFileSync(SCRIPTS_FILE, 'utf-8'))
}

async function listAvatars() {
  console.log('\n🎭 Fetching available avatars from HeyGen...\n')
  try {
    const avatars = await heygenService.getAvatars()
    console.log(`Found ${avatars.length} avatars:\n`)

    avatars.slice(0, 20).forEach((avatar: HeyGenAvatar) => {
      console.log(`  ${avatar.avatar_id}`)
      console.log(`    Name: ${avatar.avatar_name}`)
      console.log(`    Gender: ${avatar.gender}`)
      console.log()
    })

    if (avatars.length > 20) {
      console.log(`  ... and ${avatars.length - 20} more`)
    }
  } catch (error) {
    console.error('❌ Error fetching avatars:', error)
  }
}

async function listVoices() {
  console.log('\n🎤 Fetching available voices from HeyGen...\n')
  try {
    const voices = await heygenService.getVoices()
    console.log(`Found ${voices.length} voices:\n`)

    // Filter to English voices
    const englishVoices = voices.filter((v: HeyGenVoice) => v.language?.startsWith('en'))

    englishVoices.slice(0, 20).forEach((voice: HeyGenVoice) => {
      console.log(`  ${voice.voice_id}`)
      console.log(`    Name: ${voice.name}`)
      console.log(`    Gender: ${voice.gender}`)
      console.log()
    })

    if (englishVoices.length > 20) {
      console.log(`  ... and ${englishVoices.length - 20} more English voices`)
    }
  } catch (error) {
    console.error('❌ Error fetching voices:', error)
  }
}

async function generateLesson(
  lessonId: string,
  scripts: LessonScript[],
  avatarId = DEFAULT_AVATAR_ID,
  voiceId = DEFAULT_VOICE_ID
) {
  const lesson = scripts.find(s => s.lessonId === lessonId)

  if (!lesson) {
    console.error(`❌ No script found for: ${lessonId}`)
    console.error('   Available:', scripts.map(s => s.lessonId).join(', '))
    return false
  }

  console.log(`\n${'='.repeat(60)}`)
  console.log(`🎬 Generating: ${lesson.title}`)
  console.log(`   Course: ${lesson.courseTitle}`)
  console.log(`   ID: ${lessonId}`)
  console.log(`${'='.repeat(60)}`)

  try {
    // Create video
    console.log('\n  📤 Submitting to HeyGen...')
    const { videoId } = await heygenService.generateLessonVideo({
      title: lesson.title,
      script: lesson.script,
      avatarId,
      voiceId,
      backgroundColor: '#1e3a5f', // Dark blue professional background
      test: true, // Set to false for production
    })

    console.log(`  ✅ Video job created: ${videoId}`)
    console.log('  ⏳ Waiting for video generation (usually 2-5 minutes)...')

    // Wait for completion
    const result = await heygenService.waitForVideo(videoId, 600000) // 10 min timeout

    console.log(`  ✅ Video ready!`)
    console.log(`     URL: ${result.videoUrl}`)
    console.log(`     Duration: ${result.duration}s`)

    // Download video
    console.log('  📥 Downloading video...')
    const response = await fetch(result.videoUrl)
    const buffer = Buffer.from(await response.arrayBuffer())

    mkdirSync(OUTPUT_DIR, { recursive: true })
    const outputPath = join(OUTPUT_DIR, `${lessonId}.mp4`)
    writeFileSync(outputPath, buffer)

    console.log(`  ✅ Saved to: ${outputPath}`)
    return true

  } catch (error) {
    console.error(`  ❌ Error:`, error)
    return false
  }
}

async function generateAll(
  scripts: LessonScript[],
  avatarId = DEFAULT_AVATAR_ID,
  voiceId = DEFAULT_VOICE_ID
) {
  console.log(`\n🚀 Generate ${scripts.length} videos with HeyGen?`)
  console.log('   Estimated time: 2-5 minutes per video')
  console.log('   Note: This uses HeyGen API credits\n')

  let success = 0
  for (let i = 0; i < scripts.length; i++) {
    const script = scripts[i]
    console.log(`\n[${i + 1}/${scripts.length}]`)

    if (await generateLesson(script.lessonId, scripts, avatarId, voiceId)) {
      success++
    }

    // Small delay between videos
    if (i < scripts.length - 1) {
      console.log('\n  ⏸  Waiting 5s before next video...')
      await new Promise(r => setTimeout(r, 5000))
    }
  }

  console.log(`\n${'='.repeat(60)}`)
  console.log(`✅ Generated ${success}/${scripts.length} videos`)
  console.log(`   Output: ${OUTPUT_DIR}`)
  console.log(`${'='.repeat(60)}`)
}

async function main() {
  const args = process.argv.slice(2)

  if (args.includes('--list-avatars')) {
    await listAvatars()
    return
  }

  if (args.includes('--list-voices')) {
    await listVoices()
    return
  }

  const scripts = await loadScripts()

  if (args.includes('--list')) {
    console.log(`\n📚 Available lessons (${scripts.length}):\n`)
    scripts.forEach(s => {
      console.log(`  ${s.lessonId}`)
      console.log(`    ${s.courseTitle}: ${s.title}`)
      console.log()
    })
    return
  }

  const lessonIdx = args.indexOf('--lesson')
  if (lessonIdx !== -1 && args[lessonIdx + 1]) {
    await generateLesson(args[lessonIdx + 1], scripts)
    return
  }

  if (args.includes('--all')) {
    await generateAll(scripts)
    return
  }

  // Show help
  console.log(`
📹 HeyGen Video Generator

Usage:
  npx tsx scripts/generate-video-heygen.ts --list-avatars   # Show available avatars
  npx tsx scripts/generate-video-heygen.ts --list-voices    # Show available voices
  npx tsx scripts/generate-video-heygen.ts --list           # Show available lessons
  npx tsx scripts/generate-video-heygen.ts --lesson <id>    # Generate one lesson
  npx tsx scripts/generate-video-heygen.ts --all            # Generate all lessons

Examples:
  npx tsx scripts/generate-video-heygen.ts --lesson lesson-react-1-1
  `)
}

main().catch(console.error)
