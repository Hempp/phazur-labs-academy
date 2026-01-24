import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import { execFileSync } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'
import * as https from 'https'

config({ path: '.env.local' })

// FFmpeg paths - checks multiple locations
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

// Course color themes (hex colors)
const COURSE_COLORS: Record<string, string> = {
  'full-stack-web-development': '1e3a5f',    // Deep blue
  'cloud-computing-aws-fundamentals': 'ff9900', // AWS orange
  'advanced-react-patterns': '61dafb',        // React blue
  'data-science-python': '306998',            // Python blue
  'machine-learning': '4a90d9',               // ML blue
  'default': '2d3748',                        // Slate gray
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface Lesson {
  id: string
  title: string
  video_url: string | null
  course_id: string
  courses: { title: string; slug: string } | null
}

function findBinary(paths: string[]): string | null {
  for (const p of paths) {
    if (fs.existsSync(p)) {
      return p
    }
  }
  return null
}

function getAudioDuration(ffprobePath: string, audioPath: string): number {
  try {
    // Use execFileSync with argument array (secure, no shell injection)
    const output = execFileSync(ffprobePath, [
      '-v', 'error',
      '-show_entries', 'format=duration',
      '-of', 'default=noprint_wrappers=1:nokey=1',
      audioPath
    ], { encoding: 'utf-8' }).trim()

    return parseFloat(output) || 30
  } catch (error) {
    console.log('  ⚠ Could not get duration, using 30s default')
    return 30
  }
}

async function downloadFile(url: string, destPath: string): Promise<boolean> {
  return new Promise((resolve) => {
    const file = fs.createWriteStream(destPath)

    https.get(url, (response) => {
      // Follow redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location
        if (redirectUrl) {
          https.get(redirectUrl, (redirectResponse) => {
            redirectResponse.pipe(file)
            file.on('finish', () => {
              file.close()
              resolve(true)
            })
          }).on('error', () => resolve(false))
          return
        }
      }

      response.pipe(file)
      file.on('finish', () => {
        file.close()
        resolve(true)
      })
    }).on('error', () => resolve(false))
  })
}

async function generateVideoFromAudio(
  ffmpegPath: string,
  ffprobePath: string,
  audioPath: string,
  outputPath: string,
  backgroundColor: string,
  title: string
): Promise<boolean> {
  try {
    // Get audio duration
    const duration = getAudioDuration(ffprobePath, audioPath)
    console.log(`  Audio duration: ${duration.toFixed(1)}s`)

    // Generate video with colored background + audio
    // Uses execFileSync with argument array (secure)
    execFileSync(ffmpegPath, [
      '-f', 'lavfi',
      '-i', `color=c=0x${backgroundColor}:s=1920x1080:d=${duration}`,
      '-i', audioPath,
      '-c:v', 'libx264',
      '-tune', 'stillimage',
      '-c:a', 'aac',
      '-b:a', '192k',
      '-pix_fmt', 'yuv420p',
      '-shortest',
      '-y',
      outputPath
    ], { encoding: 'utf-8', stdio: 'pipe', timeout: 300000 })

    return fs.existsSync(outputPath)
  } catch (error) {
    console.error(`  ✗ FFmpeg error:`, error instanceof Error ? error.message : error)
    return false
  }
}

async function uploadVideoToSupabase(filePath: string, lessonId: string): Promise<string | null> {
  try {
    const fileBuffer = fs.readFileSync(filePath)
    const fileName = `video-${Date.now()}.mp4`
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

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('course-videos')
      .getPublicUrl(storagePath)

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

  return true
}

async function main() {
  console.log('🎬 Generate Videos from Lesson Audio\n')
  console.log('Converts existing MP3 audio to MP4 videos with colored backgrounds\n')

  // Find FFmpeg and FFprobe
  const ffmpegPath = findBinary(FFMPEG_PATHS)
  const ffprobePath = findBinary(FFPROBE_PATHS)

  if (!ffmpegPath) {
    console.error('❌ FFmpeg not found. Install FFmpeg and add to ~/bin/')
    console.error('   Checked:', FFMPEG_PATHS.join(', '))
    return
  }

  if (!ffprobePath) {
    console.error('❌ FFprobe not found. Install FFprobe and add to ~/bin/')
    console.error('   Checked:', FFPROBE_PATHS.join(', '))
    return
  }

  console.log(`✓ FFmpeg: ${ffmpegPath}`)
  console.log(`✓ FFprobe: ${ffprobePath}\n`)

  // Fetch lessons with audio URLs (MP3 files)
  console.log('📋 Fetching lessons with audio from database...\n')

  const { data: lessons, error } = await supabase
    .from('lessons')
    .select(`
      id,
      title,
      video_url,
      course_id,
      courses (
        title,
        slug
      )
    `)
    .not('video_url', 'is', null)
    .ilike('video_url', '%.mp3')
    .order('course_id')

  if (error) {
    console.error('❌ Error fetching lessons:', error.message)
    return
  }

  if (!lessons || lessons.length === 0) {
    console.log('No lessons with audio files found.')
    console.log('Run batch-generate-lesson-videos.ts first to create audio.')
    return
  }

  console.log(`Found ${lessons.length} lessons with audio\n`)

  // Filter by argument if provided
  const courseFilter = process.argv[2]
  const lessonsToProcess = courseFilter
    ? lessons.filter(l => l.courses?.slug?.includes(courseFilter))
    : lessons

  if (lessonsToProcess.length === 0) {
    console.log(`No lessons found matching filter: ${courseFilter}`)
    return
  }

  console.log(`Processing ${lessonsToProcess.length} lessons`)
  console.log('='.repeat(60) + '\n')

  const tempDir = os.tmpdir()
  let successCount = 0
  let failCount = 0
  let currentCourse = ''

  for (let i = 0; i < lessonsToProcess.length; i++) {
    const lesson = lessonsToProcess[i] as Lesson
    const courseName = lesson.courses?.title || 'Unknown Course'
    const courseSlug = lesson.courses?.slug || 'default'

    // Print course header when it changes
    if (courseName !== currentCourse) {
      currentCourse = courseName
      console.log(`\n📚 ${courseName}`)
      console.log('-'.repeat(50))
    }

    console.log(`\n[${i + 1}/${lessonsToProcess.length}] ${lesson.title}`)

    if (!lesson.video_url) {
      console.log('  ⚠ No audio URL, skipping')
      failCount++
      continue
    }

    // Download audio file
    const audioPath = path.join(tempDir, `audio-${lesson.id}.mp3`)
    const videoPath = path.join(tempDir, `video-${lesson.id}.mp4`)

    console.log(`  Downloading audio...`)
    const downloaded = await downloadFile(lesson.video_url, audioPath)

    if (!downloaded || !fs.existsSync(audioPath)) {
      console.log('  ✗ Failed to download audio')
      failCount++
      continue
    }

    const audioSize = fs.statSync(audioPath).size
    console.log(`  ✓ Downloaded: ${(audioSize / 1024).toFixed(1)} KB`)

    // Get background color for course
    const bgColor = COURSE_COLORS[courseSlug] || COURSE_COLORS['default']

    // Generate video
    console.log(`  Generating video (bg: #${bgColor})...`)
    const videoGenerated = await generateVideoFromAudio(
      ffmpegPath,
      ffprobePath,
      audioPath,
      videoPath,
      bgColor,
      lesson.title
    )

    if (!videoGenerated) {
      console.log('  ✗ Video generation failed')
      failCount++
      // Cleanup
      if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath)
      continue
    }

    const videoSize = fs.statSync(videoPath).size
    console.log(`  ✓ Video generated: ${(videoSize / 1024 / 1024).toFixed(2)} MB`)

    // Upload video to Supabase
    console.log(`  Uploading to Supabase...`)
    const videoUrl = await uploadVideoToSupabase(videoPath, lesson.id)

    if (!videoUrl) {
      console.log('  ✗ Upload failed')
      failCount++
      // Cleanup
      if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath)
      if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath)
      continue
    }

    // Update database with new video URL
    const updated = await updateLessonVideoUrl(lesson.id, videoUrl)

    if (updated) {
      console.log(`  ✓ Lesson updated with video URL`)
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
  console.log('\n🎉 Video Generation Complete!\n')
  console.log(`   ✅ Success: ${successCount}`)
  console.log(`   ❌ Failed: ${failCount}`)
  console.log(`   📊 Total: ${lessonsToProcess.length}`)
}

main().catch(console.error)
