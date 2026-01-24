// Test script for certificate generation
// Run with: npx tsx scripts/test-certificate.ts

import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Load environment variables
config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const TEST_USER_ID = '95dc6863-8c12-4f60-9404-ae419ca227a3'
const COURSE_ID = 'e66a57b8-b77b-48d8-acc9-3dfec5f0e56e'

async function main() {
  console.log('Testing certificate generation...\n')

  // First, list all enrollments to find the right one
  const { data: allEnrollments } = await supabase
    .from('enrollments')
    .select('id, user_id, course_id, progress_percentage')
    .limit(10)

  console.log('All enrollments:', allEnrollments)

  // List all courses
  const { data: allCourses } = await supabase
    .from('courses')
    .select('id, title')
    .limit(5)

  console.log('\nAll courses:', allCourses)

  // List all users
  const { data: allUsers } = await supabase
    .from('users')
    .select('id, email')
    .limit(5)

  console.log('\nAll users:', allUsers)

  // 1. Find enrollment with 100% progress
  const { data: enrollment, error: enrollError } = await supabase
    .from('enrollments')
    .select('id, user_id, course_id, progress_percentage')
    .gte('progress_percentage', 100)
    .single()

  if (enrollError || !enrollment) {
    console.error('\nError finding completed enrollment:', enrollError)
    return
  }

  console.log('\nFound completed enrollment:', {
    id: enrollment.id,
    userId: enrollment.user_id,
    courseId: enrollment.course_id,
    progress: enrollment.progress_percentage
  })

  // 2. Check for existing certificate (by user_id + course_id, not enrollment_id)
  const { data: existingCert } = await supabase
    .from('certificates')
    .select('*')
    .eq('user_id', enrollment.user_id)
    .eq('course_id', enrollment.course_id)
    .single()

  if (existingCert) {
    console.log('\nCertificate already exists:')
    console.log({
      id: existingCert.id,
      certificateNumber: existingCert.certificate_number,
      studentName: existingCert.student_name,
      courseTitle: existingCert.course_title,
      issueDate: existingCert.issue_date
    })
    return
  }

  console.log('\nNo certificate found. Creating one...')

  // 3. Get course and user details
  const { data: course } = await supabase
    .from('courses')
    .select('title, slug')
    .eq('id', COURSE_ID)
    .single()

  const { data: profile } = await supabase
    .from('users')
    .select('full_name, email')
    .eq('id', TEST_USER_ID)
    .single()

  const certificateNumber = `PHZR-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

  // 4. Create certificate (matching actual schema)
  const { data: certificate, error: certError } = await supabase
    .from('certificates')
    .insert({
      user_id: enrollment.user_id,
      course_id: enrollment.course_id,
      certificate_number: certificateNumber,
      verification_url: `http://localhost:3000/verify/${certificateNumber}`,
      grade: 'Pass'
    })
    .select()
    .single()

  if (certError) {
    console.error('Error creating certificate:', certError)
    return
  }

  console.log('\nCertificate created successfully!')
  console.log({
    id: certificate.id,
    certificateNumber: certificate.certificate_number,
    issuedAt: certificate.issued_at
  })

  console.log('\nTest complete!')
}

main().catch(console.error)
