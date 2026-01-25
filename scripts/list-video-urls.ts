import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function main() {
  const { data: lessons, error } = await supabase
    .from('lessons')
    .select(`
      id,
      title,
      video_url,
      courses (
        title
      )
    `)
    .not('video_url', 'is', null)
    .order('course_id')
    .limit(10)

  if (error) {
    console.error('Error:', error)
    return
  }

  console.log('📹 Lesson Videos (first 10):\n')

  if (lessons) {
    lessons.forEach((lesson, i) => {
      const course = lesson.courses as { title: string } | null
      console.log(`${i + 1}. ${lesson.title}`)
      console.log(`   Course: ${course?.title || 'Unknown'}`)
      console.log(`   Video URL:`)
      console.log(`   ${lesson.video_url}`)
      console.log('')
    })
  }
}

main()
