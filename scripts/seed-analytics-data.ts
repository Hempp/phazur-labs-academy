/**
 * Seed Analytics Test Data
 * Creates enrollments, lesson progress, and reviews for testing the analytics dashboard
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Test student data
const TEST_STUDENTS = [
  { full_name: 'Alice Johnson', email: 'alice@test.com' },
  { full_name: 'Bob Smith', email: 'bob@test.com' },
  { full_name: 'Carol Williams', email: 'carol@test.com' },
  { full_name: 'David Brown', email: 'david@test.com' },
  { full_name: 'Emma Davis', email: 'emma@test.com' },
  { full_name: 'Frank Miller', email: 'frank@test.com' },
  { full_name: 'Grace Wilson', email: 'grace@test.com' },
  { full_name: 'Henry Taylor', email: 'henry@test.com' },
]

function randomDate(daysBack: number): Date {
  const date = new Date()
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack))
  date.setHours(Math.floor(Math.random() * 24))
  date.setMinutes(Math.floor(Math.random() * 60))
  return date
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

async function main() {
  console.log('═'.repeat(60))
  console.log('🎓 SEEDING ANALYTICS TEST DATA')
  console.log('═'.repeat(60))

  // 1. Get existing courses
  const { data: courses, error: coursesError } = await supabase
    .from('courses')
    .select('id, title, price, instructor_id')

  if (coursesError || !courses?.length) {
    console.error('❌ No courses found:', coursesError)
    return
  }
  console.log(`\n📚 Found ${courses.length} courses`)

  // 2. Get lessons for each course
  const { data: allLessons } = await supabase
    .from('lessons')
    .select('id, course_id, title, video_duration_seconds')

  console.log(`📖 Found ${allLessons?.length || 0} lessons`)

  // 3. Get existing users (can't create due to FK constraint to auth.users)
  console.log('\n👥 Getting existing users...')
  const { data: existingUsers, error: usersError } = await supabase
    .from('users')
    .select('id, full_name')
    .limit(10)

  if (usersError || !existingUsers?.length) {
    console.error('❌ No users found:', usersError)
    console.log('💡 Tip: Sign up some test accounts through the UI first')
    return
  }

  const studentIds = existingUsers.map(u => u.id)
  console.log(`   Found ${studentIds.length} users:`)
  existingUsers.forEach(u => console.log(`   - ${u.full_name}`))

  console.log(`\n📊 Creating enrollments and progress data...`)

  let totalEnrollments = 0
  let totalProgress = 0
  let totalReviews = 0

  // 4. Create enrollments for each course
  for (const course of courses) {
    const courseLessons = allLessons?.filter(l => l.course_id === course.id) || []

    // Enroll 3-6 random students in each course
    const numEnrollments = randomBetween(3, Math.min(6, studentIds.length))
    const enrolledStudents = [...studentIds].sort(() => Math.random() - 0.5).slice(0, numEnrollments)

    console.log(`\n   📘 ${course.title}`)

    for (const studentId of enrolledStudents) {
      const enrolledAt = randomDate(60)
      const progressPercentage = randomBetween(10, 100)
      const completedAt = progressPercentage === 100 ? new Date() : null

      // Check if enrollment exists
      const { data: existingEnrollment } = await supabase
        .from('enrollments')
        .select('id')
        .eq('course_id', course.id)
        .eq('user_id', studentId)
        .single()

      if (!existingEnrollment) {
        const { error: enrollError } = await supabase
          .from('enrollments')
          .insert({
            course_id: course.id,
            user_id: studentId,
            enrolled_at: enrolledAt.toISOString(),
            progress_percentage: progressPercentage,
            completed_at: completedAt?.toISOString() || null,
            status: progressPercentage === 100 ? 'completed' : 'active'
          })

        if (!enrollError) {
          totalEnrollments++

          // Create lesson progress for enrolled student
          const lessonsToProgress = Math.ceil(courseLessons.length * (progressPercentage / 100))

          for (let i = 0; i < lessonsToProgress && i < courseLessons.length; i++) {
            const lesson = courseLessons[i]
            const isCompleted = i < lessonsToProgress - 1 || progressPercentage === 100
            const watchTime = isCompleted
              ? (lesson.video_duration_seconds || 600)
              : randomBetween(60, lesson.video_duration_seconds || 300)

            const { error: progressError } = await supabase
              .from('lesson_progress')
              .insert({
                user_id: studentId,
                lesson_id: lesson.id,
                course_id: course.id,
                watch_time_seconds: watchTime,
                is_completed: isCompleted,
                started_at: new Date(enrolledAt.getTime() + i * 86400000).toISOString(),
                completed_at: isCompleted ? new Date(enrolledAt.getTime() + (i + 1) * 86400000).toISOString() : null
              })

            if (!progressError) totalProgress++
          }
        }
      }
    }

    // 5. Create reviews (30% chance per enrolled student)
    for (const studentId of enrolledStudents) {
      if (Math.random() < 0.3) {
        const { data: existingReview } = await supabase
          .from('reviews')
          .select('id')
          .eq('course_id', course.id)
          .eq('user_id', studentId)
          .single()

        if (!existingReview) {
          const rating = randomBetween(3, 5)
          const reviews = [
            'Great course! Learned a lot.',
            'Very comprehensive and well-structured.',
            'The instructor explains concepts clearly.',
            'Excellent content, highly recommended!',
            'Good course, but could use more examples.',
            'Perfect for beginners and intermediate learners.',
          ]

          const { error: reviewError } = await supabase
            .from('reviews')
            .insert({
              course_id: course.id,
              user_id: studentId,
              rating,
              content: reviews[randomBetween(0, reviews.length - 1)],
              created_at: randomDate(30).toISOString()
            })

          if (!reviewError) totalReviews++
        }
      }
    }

    console.log(`      Enrollments: ${enrolledStudents.length}`)
  }

  // 6. Create payment records for enrollments
  console.log('\n💳 Creating payment records...')

  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('id, course_id, user_id, enrolled_at')

  let totalPayments = 0
  for (const enrollment of enrollments || []) {
    const course = courses.find(c => c.id === enrollment.course_id)
    if (!course) continue

    const { data: existingPayment } = await supabase
      .from('payments')
      .select('id')
      .eq('course_id', enrollment.course_id)
      .eq('user_id', enrollment.user_id)
      .single()

    if (!existingPayment) {
      const { error } = await supabase
        .from('payments')
        .insert({
          course_id: enrollment.course_id,
          user_id: enrollment.user_id,
          amount: course.price || 99.99,
          status: 'completed',
          payment_method: 'card',
          created_at: enrollment.enrolled_at
        })

      if (!error) totalPayments++
    }
  }

  console.log('\n' + '═'.repeat(60))
  console.log('📊 SEEDING COMPLETE')
  console.log('═'.repeat(60))
  console.log(`   Students: ${studentIds.length}`)
  console.log(`   Enrollments: ${totalEnrollments}`)
  console.log(`   Lesson Progress: ${totalProgress}`)
  console.log(`   Reviews: ${totalReviews}`)
  console.log(`   Payments: ${totalPayments}`)
  console.log('═'.repeat(60))
}

main().catch(console.error)
