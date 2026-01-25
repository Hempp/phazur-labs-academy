/**
 * Seed Lesson Progress Data
 * Creates lesson progress records for existing enrollments
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

async function main() {
  console.log('═'.repeat(60))
  console.log('📊 SEEDING LESSON PROGRESS DATA')
  console.log('═'.repeat(60))

  // Get all enrollments with course info
  const { data: enrollments, error: enrollError } = await supabase
    .from('enrollments')
    .select('id, user_id, course_id, enrolled_at, progress_percentage')

  if (enrollError || !enrollments?.length) {
    console.error('❌ No enrollments found:', enrollError)
    return
  }

  console.log(`\n📚 Found ${enrollments.length} enrollments`)

  // Get all lessons
  const { data: allLessons } = await supabase
    .from('lessons')
    .select('id, course_id, title, video_duration_seconds, display_order')
    .order('display_order', { ascending: true })

  console.log(`📖 Found ${allLessons?.length || 0} lessons`)

  let totalProgress = 0
  let skipped = 0

  for (const enrollment of enrollments) {
    const courseLessons = allLessons?.filter(l => l.course_id === enrollment.course_id) || []

    if (courseLessons.length === 0) {
      console.log(`   ⏭️  No lessons for course ${enrollment.course_id}`)
      continue
    }

    const progressPercentage = enrollment.progress_percentage || randomBetween(20, 100)
    const lessonsToProgress = Math.ceil(courseLessons.length * (progressPercentage / 100))
    const enrolledAt = new Date(enrollment.enrolled_at)

    console.log(`\n   👤 User ${enrollment.user_id.slice(0, 8)}... in course ${enrollment.course_id.slice(0, 8)}...`)
    console.log(`      Progress: ${progressPercentage}% → ${lessonsToProgress}/${courseLessons.length} lessons`)

    for (let i = 0; i < lessonsToProgress && i < courseLessons.length; i++) {
      const lesson = courseLessons[i]
      const isCompleted = i < lessonsToProgress - 1 || progressPercentage === 100
      const watchTime = isCompleted
        ? (lesson.video_duration_seconds || 600)
        : randomBetween(60, lesson.video_duration_seconds || 300)

      // Check if progress already exists
      const { data: existing } = await supabase
        .from('lesson_progress')
        .select('id')
        .eq('user_id', enrollment.user_id)
        .eq('lesson_id', lesson.id)
        .single()

      if (existing) {
        skipped++
        continue
      }

      const startedAt = new Date(enrolledAt.getTime() + i * 3600000) // 1 hour apart
      const completedAt = isCompleted ? new Date(startedAt.getTime() + watchTime * 1000) : null

      const { error: progressError } = await supabase
        .from('lesson_progress')
        .insert({
          user_id: enrollment.user_id,
          lesson_id: lesson.id,
          course_id: enrollment.course_id,
          watch_time_seconds: watchTime,
          is_completed: isCompleted,
          started_at: startedAt.toISOString(),
          completed_at: completedAt?.toISOString() || null
        })

      if (!progressError) {
        totalProgress++
      } else {
        console.log(`      ❌ Error: ${progressError.message}`)
      }
    }
  }

  console.log('\n' + '═'.repeat(60))
  console.log('📊 SEEDING COMPLETE')
  console.log('═'.repeat(60))
  console.log(`   New Progress Records: ${totalProgress}`)
  console.log(`   Skipped (existing): ${skipped}`)
  console.log('═'.repeat(60))
}

main().catch(console.error)
