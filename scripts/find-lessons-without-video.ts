import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function main() {
  // Get lessons without videos
  const { data: lessons, error } = await supabase
    .from('lessons')
    .select(`
      id,
      title,
      description,
      video_url,
      course_id,
      courses (
        id,
        title
      )
    `)
    .is('video_url', null)
    .limit(10)

  if (error) {
    console.error('Error:', error)
    return
  }

  const count = lessons?.length || 0
  console.log(`Found ${count} lessons without videos:\n`)

  if (lessons) {
    lessons.forEach((lesson, i) => {
      // Handle Supabase returning courses as array or object
      const courseData = Array.isArray(lesson.courses) ? lesson.courses[0] : lesson.courses
      const course = courseData as { id: string; title: string } | null
      console.log(`${i + 1}. ${lesson.title}`)
      console.log(`   Course: ${course?.title || 'Unknown'}`)
      console.log(`   ID: ${lesson.id}`)
      console.log('')
    })
  }
}

main()
