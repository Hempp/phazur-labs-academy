import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import { execFileSync } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'

config({ path: '.env.local' })

const EDGE_TTS_PATH = '/Users/seg/Library/Python/3.9/bin/edge-tts'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Voice options for variety (DavisNeural removed - has service issues)
const VOICES = [
  'en-US-GuyNeural',      // Professional male
  'en-US-JennyNeural',    // Friendly female
  'en-US-AriaNeural',     // Conversational female
]

interface Lesson {
  id: string
  title: string
  description: string | null
  video_url: string | null
  course_id: string
  module_id: string
  display_order: number
  // Supabase can return nested relations as arrays or objects
  courses: { title: string }[] | { title: string } | null
}

async function generateAudioForLesson(lesson: Lesson, voiceIndex: number): Promise<string | null> {
  // Create script from lesson description
  let script = ''

  if (lesson.description) {
    script = `Welcome to this lesson: ${lesson.title}. ${lesson.description}. Let's dive into the key concepts and practical applications.`
  } else {
    // Generate a descriptive intro based on title
    script = `Welcome to ${lesson.title}. In this lesson, we'll explore the fundamental concepts, best practices, and real-world applications. By the end, you'll have a solid understanding of how to apply these skills in your own projects. Let's get started!`
  }

  // Limit script length for reasonable audio duration (roughly 150 words per minute)
  const words = script.split(/\s+/)
  if (words.length > 500) {
    script = words.slice(0, 500).join(' ') + '... That concludes the main points for this lesson.'
  }

  const voice = VOICES[voiceIndex % VOICES.length]
  const tempDir = os.tmpdir()
  const outputPath = path.join(tempDir, `lesson-${lesson.id}.mp3`)

  try {
    console.log(`  Generating audio with voice: ${voice}`)

    execFileSync(EDGE_TTS_PATH, [
      '--voice', voice,
      '--text', script,
      '--write-media', outputPath
    ], { encoding: 'utf-8', stdio: 'pipe' })

    if (fs.existsSync(outputPath)) {
      const stats = fs.statSync(outputPath)
      console.log(`  ✓ Generated: ${(stats.size / 1024).toFixed(1)} KB`)
      return outputPath
    }
  } catch (error) {
    console.error(`  ✗ Failed to generate audio:`, error instanceof Error ? error.message : error)
  }

  return null
}

async function uploadToSupabase(filePath: string, lessonId: string): Promise<string | null> {
  try {
    const fileBuffer = fs.readFileSync(filePath)
    const fileName = `audio-${Date.now()}.mp3`
    const storagePath = `lessons/${lessonId}/${fileName}`

    const { data, error } = await supabase.storage
      .from('course-videos')
      .upload(storagePath, fileBuffer, {
        contentType: 'audio/mpeg',
        upsert: true
      })

    if (error) {
      console.error(`  ✗ Upload error:`, error.message)
      return null
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('course-videos')
      .getPublicUrl(storagePath)

    console.log(`  ✓ Uploaded to Supabase`)
    return urlData.publicUrl
  } catch (error) {
    console.error(`  ✗ Upload failed:`, error instanceof Error ? error.message : error)
    return null
  }
}

async function updateLessonVideoUrl(lessonId: string, videoUrl: string): Promise<boolean> {
  const { error } = await supabase
    .from('lessons')
    .update({ video_url: videoUrl })
    .eq('id', lessonId)

  if (error) {
    console.error(`  ✗ DB update error:`, error.message)
    return false
  }

  console.log(`  ✓ Updated lesson record`)
  return true
}

async function main() {
  console.log('🎬 Batch Video Generation for Lessons\n')
  console.log('Using Edge TTS (free Microsoft Neural Voices)\n')

  // Check edge-tts
  if (!fs.existsSync(EDGE_TTS_PATH)) {
    console.error('❌ edge-tts not found. Install with: pip3 install edge-tts')
    return
  }

  // Fetch all lessons
  console.log('📋 Fetching lessons from database...\n')

  const { data: lessons, error } = await supabase
    .from('lessons')
    .select(`
      id,
      title,
      description,
      video_url,
      course_id,
      module_id,
      display_order,
      courses (
        title
      )
    `)
    .order('course_id')
    .order('display_order')

  if (error) {
    console.error('❌ Error fetching lessons:', error.message)
    return
  }

  if (!lessons || lessons.length === 0) {
    console.log('No lessons found in database.')
    return
  }

  console.log(`Found ${lessons.length} lessons\n`)

  // Ask whether to regenerate existing or only missing
  const regenerateAll = process.argv.includes('--all')
  const lessonsToProcess = regenerateAll
    ? lessons
    : lessons.filter(l => !l.video_url)

  if (lessonsToProcess.length === 0) {
    console.log('✅ All lessons already have videos!')
    console.log('   Use --all flag to regenerate all videos')
    return
  }

  console.log(`Processing ${lessonsToProcess.length} lessons ${regenerateAll ? '(regenerating all)' : '(only missing)'}`)
  console.log('='.repeat(60) + '\n')

  let successCount = 0
  let failCount = 0
  let currentCourse = ''

  for (let i = 0; i < lessonsToProcess.length; i++) {
    const lesson = lessonsToProcess[i] as Lesson
    // Handle Supabase returning courses as array or object
    const courseData = Array.isArray(lesson.courses) ? lesson.courses[0] : lesson.courses
    const courseName = courseData?.title || 'Unknown Course'

    // Print course header when it changes
    if (courseName !== currentCourse) {
      currentCourse = courseName
      console.log(`\n📚 ${courseName}`)
      console.log('-'.repeat(50))
    }

    console.log(`\n[${i + 1}/${lessonsToProcess.length}] ${lesson.title}`)

    // Generate audio
    const audioPath = await generateAudioForLesson(lesson, i)
    if (!audioPath) {
      failCount++
      continue
    }

    // Upload to Supabase
    const publicUrl = await uploadToSupabase(audioPath, lesson.id)
    if (!publicUrl) {
      failCount++
      // Clean up temp file
      fs.unlinkSync(audioPath)
      continue
    }

    // Update database
    const updated = await updateLessonVideoUrl(lesson.id, publicUrl)
    if (updated) {
      successCount++
    } else {
      failCount++
    }

    // Clean up temp file
    fs.unlinkSync(audioPath)

    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 500))
  }

  console.log('\n' + '='.repeat(60))
  console.log('\n🎉 Batch Generation Complete!\n')
  console.log(`   ✅ Success: ${successCount}`)
  console.log(`   ❌ Failed: ${failCount}`)
  console.log(`   📊 Total: ${lessonsToProcess.length}`)
}

main().catch(console.error)
