import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function main() {
  // Get all lessons with their video URLs
  const { data: lessons, error } = await supabase
    .from('lessons')
    .select(`
      id,
      title,
      video_url,
      course_id,
      courses (
        id,
        title
      )
    `)
    .order('course_id')
    .limit(20)

  if (error) {
    console.error('Error:', error)
    return
  }

  console.log('Lessons and their video status:\n')

  if (lessons) {
    let currentCourse = ''
    lessons.forEach((lesson) => {
      // Handle Supabase returning courses as array or object
      const courseData = Array.isArray(lesson.courses) ? lesson.courses[0] : lesson.courses
      const course = courseData as { id: string; title: string } | null
      const courseName = course?.title || 'Unknown'

      if (courseName !== currentCourse) {
        currentCourse = courseName
        console.log(`\n=== ${courseName} ===`)
      }

      const hasVideo = lesson.video_url && !lesson.video_url.includes('sample')
      const videoStatus = !lesson.video_url
        ? '❌ No video'
        : lesson.video_url.includes('sample')
          ? '⚠️  Sample placeholder'
          : '✅ Has video'

      console.log(`  ${videoStatus} | ${lesson.title}`)
      if (lesson.video_url) {
        console.log(`              URL: ${lesson.video_url.substring(0, 60)}...`)
      }
    })
  }

  // Also check video_generations table
  console.log('\n\n=== Video Generations ===')
  const { data: videos, error: videoError } = await supabase
    .from('video_generations')
    .select('id, title, status, video_url, created_at')
    .order('created_at', { ascending: false })
    .limit(5)

  if (videoError) {
    console.log('No video_generations table or error:', videoError.message)
  } else if (videos && videos.length > 0) {
    videos.forEach(v => {
      console.log(`  ${v.status} | ${v.title}`)
      if (v.video_url) console.log(`         URL: ${v.video_url.substring(0, 50)}...`)
    })
  } else {
    console.log('  No generated videos yet')
  }
}

main()
