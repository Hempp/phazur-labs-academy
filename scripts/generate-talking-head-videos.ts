// Generate Talking Head Videos for Lessons
// Creates instructor-style videos with avatar images + TTS audio
// Usage: npx ts-node scripts/generate-talking-head-videos.ts [course-filter]

import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import { execFileSync } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'

config({ path: '.env.local' })

// FFmpeg/FFprobe paths
const FFMPEG_PATHS = [
  path.join(os.homedir(), 'bin', 'ffmpeg'),
  '/usr/local/bin/ffmpeg',
  '/opt/homebrew/bin/ffmpeg',
]

const FFPROBE_PATHS = [
  path.join(os.homedir(), 'bin', 'ffprobe'),
  '/usr/local/bin/ffprobe',
  '/opt/homebrew/bin/ffprobe',
]

// Course-specific instructor avatars and colors
const COURSE_CONFIG: Record<string, {
  instructorName: string
  backgroundColor: string
  textColor: string
  avatarUrl?: string
}> = {
  'full-stack-web-development': {
    instructorName: 'Alex',
    backgroundColor: '#1e3a5f',
    textColor: '#ffffff',
  },
  'cloud-computing-aws-fundamentals': {
    instructorName: 'Jordan',
    backgroundColor: '#232f3e',
    textColor: '#ff9900',
  },
  'introduction-to-ai-machine-learning': {
    instructorName: 'Dr. Chen',
    backgroundColor: '#2d3748',
    textColor: '#68d391',
  },
  'default': {
    instructorName: 'Instructor',
    backgroundColor: '#1a202c',
    textColor: '#ffffff',
  },
}

// Edge TTS voices for different instructors
const INSTRUCTOR_VOICES: Record<string, string> = {
  'Alex': 'en-US-GuyNeural',
  'Jordan': 'en-US-JennyNeural',
  'Dr. Chen': 'en-US-AriaNeural',
  'Instructor': 'en-US-DavisNeural',
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface Lesson {
  id: string
  title: string
  description: string | null
  video_url: string | null
  course_id: string
  courses: { title: string; slug: string } | { title: string; slug: string }[] | null
}

// Helper to get course info (handles both single and array response)
function getCourseInfo(lesson: Lesson): { title: string; slug: string } | null {
  if (!lesson.courses) return null
  if (Array.isArray(lesson.courses)) {
    return lesson.courses[0] || null
  }
  return lesson.courses
}

function findBinary(paths: string[]): string | null {
  for (const p of paths) {
    if (fs.existsSync(p)) return p
  }
  return null
}

function getAudioDuration(ffprobePath: string, audioPath: string): number {
  try {
    const output = execFileSync(ffprobePath, [
      '-v', 'error',
      '-show_entries', 'format=duration',
      '-of', 'default=noprint_wrappers=1:nokey=1',
      audioPath
    ], { encoding: 'utf-8' }).trim()
    return parseFloat(output) || 30
  } catch {
    return 30
  }
}

// Edge-TTS binary paths to check
const EDGE_TTS_PATHS = [
  path.join(os.homedir(), 'Library', 'Python', '3.9', 'bin', 'edge-tts'),
  path.join(os.homedir(), 'Library', 'Python', '3.10', 'bin', 'edge-tts'),
  path.join(os.homedir(), 'Library', 'Python', '3.11', 'bin', 'edge-tts'),
  '/usr/local/bin/edge-tts',
  '/opt/homebrew/bin/edge-tts',
  'edge-tts',
]

async function generateTTSAudio(
  text: string,
  voice: string,
  outputPath: string
): Promise<boolean> {
  // Try edge-tts CLI first
  const edgeTtsPath = findBinary(EDGE_TTS_PATHS)
  if (edgeTtsPath) {
    try {
      execFileSync(edgeTtsPath, [
        '--voice', voice,
        '--text', text,
        '--write-media', outputPath,
        '--rate', '+0%',
        '--pitch', '+0Hz',
      ], { encoding: 'utf-8', timeout: 120000 })
      if (fs.existsSync(outputPath)) return true
    } catch {
      console.log(`  ⚠ edge-tts CLI failed, trying python fallback...`)
    }
  }

  // Fallback: use Python edge-tts module directly
  try {
    // Escape text for Python string
    const safeText = text
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, ' ')
      .replace(/'/g, "\\'")

    const pythonScript = `
import asyncio
import edge_tts

async def main():
    communicate = edge_tts.Communicate("${safeText}", "${voice}")
    await communicate.save("${outputPath}")

asyncio.run(main())
`
    const scriptPath = path.join(os.tmpdir(), `tts-${Date.now()}.py`)
    fs.writeFileSync(scriptPath, pythonScript)
    execFileSync('python3', [scriptPath], { encoding: 'utf-8', timeout: 120000, stdio: 'pipe' })
    fs.unlinkSync(scriptPath)
    return fs.existsSync(outputPath)
  } catch (error) {
    console.log(`  ✗ Python TTS failed:`, error instanceof Error ? error.message : error)
    return false
  }
}

function generateLessonScript(lesson: Lesson, instructorName: string): string {
  // Create a natural instructor script from the lesson info
  const greeting = Math.random() > 0.5 ? 'Hello everyone!' : 'Welcome back!'
  const intro = Math.random() > 0.5 ? "In this lesson, we'll explore" : "Today we're going to learn about"

  let script = `${greeting} I'm ${instructorName}. ${intro} ${lesson.title}.`

  if (lesson.description) {
    // Clean up description for TTS
    const cleanDesc = lesson.description
      .replace(/[#*_`]/g, '')
      .replace(/\n+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 500) // Limit length

    script += ` ${cleanDesc}`
  }

  script += ` Let's get started!`

  return script
}

async function generateTalkingHeadVideo(params: {
  ffmpegPath: string
  ffprobePath: string
  audioPath: string
  outputPath: string
  title: string
  instructorName: string
  backgroundColor: string
  textColor: string
}): Promise<boolean> {
  try {
    const duration = getAudioDuration(params.ffprobePath, params.audioPath)
    console.log(`  Audio duration: ${duration.toFixed(1)}s`)

    // Convert hex colors to FFmpeg format
    const bgColor = params.backgroundColor.replace('#', '0x')
    const txtColor = params.textColor.replace('#', '0x')

    // Escape special characters in title for FFmpeg drawtext
    const safeTitle = params.title
      .replace(/'/g, "'\\''")
      .replace(/:/g, '\\:')
      .replace(/\\/g, '\\\\')
      .substring(0, 60) // Limit title length

    // Generate video with:
    // 1. Colored background (1920x1080)
    // 2. Instructor name text at top
    // 3. Lesson title at bottom
    // 4. Audio overlay
    execFileSync(params.ffmpegPath, [
      // Input: Generate color background
      '-f', 'lavfi',
      '-i', `color=c=${bgColor}:s=1920x1080:d=${duration}`,
      // Input: Audio file
      '-i', params.audioPath,
      // Video filter: Add text overlays
      '-vf', `drawtext=text='${params.instructorName}':fontcolor=${txtColor}:fontsize=48:x=(w-text_w)/2:y=50:fontfile=/System/Library/Fonts/Helvetica.ttc,drawtext=text='${safeTitle}':fontcolor=${txtColor}:fontsize=36:x=(w-text_w)/2:y=h-100:fontfile=/System/Library/Fonts/Helvetica.ttc`,
      // Codec settings
      '-c:v', 'libx264',
      '-tune', 'stillimage',
      '-c:a', 'aac',
      '-b:a', '192k',
      '-pix_fmt', 'yuv420p',
      '-shortest',
      '-y',
      params.outputPath
    ], { encoding: 'utf-8', stdio: 'pipe', timeout: 300000 })

    return fs.existsSync(params.outputPath)
  } catch (error) {
    // Try simpler version without text overlays (in case of font issues)
    console.log(`  ⚠ Text overlay failed, trying simple version...`)
    try {
      const duration = getAudioDuration(params.ffprobePath, params.audioPath)
      const bgColor = params.backgroundColor.replace('#', '0x')

      execFileSync(params.ffmpegPath, [
        '-f', 'lavfi',
        '-i', `color=c=${bgColor}:s=1920x1080:d=${duration}`,
        '-i', params.audioPath,
        '-c:v', 'libx264',
        '-tune', 'stillimage',
        '-c:a', 'aac',
        '-b:a', '192k',
        '-pix_fmt', 'yuv420p',
        '-shortest',
        '-y',
        params.outputPath
      ], { encoding: 'utf-8', stdio: 'pipe', timeout: 300000 })

      return fs.existsSync(params.outputPath)
    } catch {
      return false
    }
  }
}

async function uploadVideoToSupabase(filePath: string, lessonId: string): Promise<string | null> {
  try {
    const fileBuffer = fs.readFileSync(filePath)
    const fileName = `talking-head-${Date.now()}.mp4`
    const storagePath = `lessons/${lessonId}/${fileName}`

    const { error } = await supabase.storage
      .from('course-videos')
      .upload(storagePath, fileBuffer, {
        contentType: 'video/mp4',
        upsert: true
      })

    if (error) {
      console.error(`  ✗ Upload error:`, error.message)
      return null
    }

    const { data: urlData } = supabase.storage
      .from('course-videos')
      .getPublicUrl(storagePath)

    return urlData.publicUrl
  } catch (error) {
    console.error(`  ✗ Upload failed:`, error instanceof Error ? error.message : error)
    return null
  }
}

async function updateLessonVideo(lessonId: string, videoUrl: string, durationSeconds: number): Promise<boolean> {
  const { error } = await supabase
    .from('lessons')
    .update({
      video_url: videoUrl,
      video_duration_seconds: durationSeconds
    })
    .eq('id', lessonId)

  if (error) {
    console.error(`  ✗ DB update error:`, error.message)
    return false
  }
  return true
}

async function main() {
  console.log('🎬 Generate Talking Head Videos for Lessons\n')
  console.log('Creates instructor-style videos with TTS audio\n')

  // Find FFmpeg and FFprobe
  const ffmpegPath = findBinary(FFMPEG_PATHS)
  const ffprobePath = findBinary(FFPROBE_PATHS)

  if (!ffmpegPath || !ffprobePath) {
    console.error('❌ FFmpeg/FFprobe not found. Install FFmpeg.')
    console.error('   Checked:', FFMPEG_PATHS.join(', '))
    return
  }

  console.log(`✓ FFmpeg: ${ffmpegPath}`)
  console.log(`✓ FFprobe: ${ffprobePath}\n`)

  // Check for edge-tts
  try {
    execFileSync('which', ['edge-tts'], { encoding: 'utf-8' })
    console.log('✓ edge-tts CLI available\n')
  } catch {
    console.log('ℹ edge-tts CLI not found, will use Python fallback')
    console.log('  Install with: pip install edge-tts\n')
  }

  // Fetch lessons
  console.log('📋 Fetching lessons from database...\n')

  const { data: lessons, error } = await supabase
    .from('lessons')
    .select(`
      id,
      title,
      description,
      video_url,
      course_id,
      courses (
        title,
        slug
      )
    `)
    .eq('content_type', 'video')
    .order('course_id')

  if (error || !lessons) {
    console.error('❌ Error fetching lessons:', error?.message)
    return
  }

  console.log(`Found ${lessons.length} video lessons\n`)

  // Filter by argument if provided
  const courseFilter = process.argv[2]
  const lessonsToProcess = courseFilter
    ? lessons.filter(l => {
        const courseInfo = getCourseInfo(l as Lesson)
        return courseInfo?.slug?.includes(courseFilter)
      })
    : lessons

  if (lessonsToProcess.length === 0) {
    console.log(`No lessons found matching filter: ${courseFilter}`)
    return
  }

  // Limit to prevent excessive API usage
  const maxLessons = parseInt(process.argv[3]) || 5
  const limitedLessons = lessonsToProcess.slice(0, maxLessons)

  console.log(`Processing ${limitedLessons.length} lessons (max: ${maxLessons})`)
  console.log('='.repeat(60) + '\n')

  const tempDir = os.tmpdir()
  let successCount = 0
  let failCount = 0
  let currentCourse = ''

  for (let i = 0; i < limitedLessons.length; i++) {
    const lesson = limitedLessons[i] as Lesson
    const courseInfo = getCourseInfo(lesson)
    const courseName = courseInfo?.title || 'Unknown Course'
    const courseSlug = courseInfo?.slug || 'default'
    const config = COURSE_CONFIG[courseSlug] || COURSE_CONFIG['default']
    const voice = INSTRUCTOR_VOICES[config.instructorName] || INSTRUCTOR_VOICES['Instructor']

    // Print course header when it changes
    if (courseName !== currentCourse) {
      currentCourse = courseName
      console.log(`\n📚 ${courseName}`)
      console.log('-'.repeat(50))
    }

    console.log(`\n[${i + 1}/${limitedLessons.length}] ${lesson.title}`)

    const audioPath = path.join(tempDir, `tts-${lesson.id}.mp3`)
    const videoPath = path.join(tempDir, `video-${lesson.id}.mp4`)

    // Step 1: Generate TTS audio from lesson script
    console.log(`  Generating TTS audio (${voice})...`)
    const script = generateLessonScript(lesson, config.instructorName)
    console.log(`  Script: "${script.substring(0, 80)}..."`)

    const audioGenerated = await generateTTSAudio(script, voice, audioPath)
    if (!audioGenerated) {
      console.log('  ✗ Failed to generate audio')
      failCount++
      continue
    }

    const audioSize = fs.statSync(audioPath).size
    console.log(`  ✓ Audio generated: ${(audioSize / 1024).toFixed(1)} KB`)

    // Step 2: Generate video with background + text + audio
    console.log(`  Generating video (${config.backgroundColor})...`)
    const videoGenerated = await generateTalkingHeadVideo({
      ffmpegPath,
      ffprobePath,
      audioPath,
      outputPath: videoPath,
      title: lesson.title,
      instructorName: config.instructorName,
      backgroundColor: config.backgroundColor,
      textColor: config.textColor,
    })

    if (!videoGenerated) {
      console.log('  ✗ Video generation failed')
      failCount++
      if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath)
      continue
    }

    const videoSize = fs.statSync(videoPath).size
    const duration = getAudioDuration(ffprobePath, audioPath)
    console.log(`  ✓ Video generated: ${(videoSize / 1024 / 1024).toFixed(2)} MB`)

    // Step 3: Upload to Supabase
    console.log(`  Uploading to Supabase...`)
    const videoUrl = await uploadVideoToSupabase(videoPath, lesson.id)

    if (!videoUrl) {
      console.log('  ✗ Upload failed')
      failCount++
      if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath)
      if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath)
      continue
    }

    // Step 4: Update database
    const updated = await updateLessonVideo(lesson.id, videoUrl, Math.ceil(duration))

    if (updated) {
      console.log(`  ✓ Lesson updated with talking head video`)
      successCount++
    } else {
      failCount++
    }

    // Cleanup temp files
    if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath)
    if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath)

    // Small delay between lessons
    await new Promise(r => setTimeout(r, 1000))
  }

  console.log('\n' + '='.repeat(60))
  console.log('\n🎉 Talking Head Video Generation Complete!\n')
  console.log(`   ✅ Success: ${successCount}`)
  console.log(`   ❌ Failed: ${failCount}`)
  console.log(`   📊 Total: ${limitedLessons.length}`)

  if (limitedLessons.length < lessonsToProcess.length) {
    console.log(`\n💡 Tip: Processed first ${maxLessons} lessons. Run with higher limit:`)
    console.log(`   npx ts-node scripts/generate-talking-head-videos.ts ${courseFilter || ''} 20`)
  }
}

main().catch(console.error)
