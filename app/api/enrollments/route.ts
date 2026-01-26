// Enrollments API
// Check enrollment status and handle free course enrollment

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createServerSupabaseAdmin } from '@/lib/supabase/server'

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return !!(
    url && key &&
    !url.includes('placeholder') &&
    !url.includes('your-project') &&
    !key.includes('your-') &&
    key !== 'your-anon-key'
  )
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const courseSlug = searchParams.get('courseSlug')
    const courseId = searchParams.get('courseId')

    if (!courseSlug && !courseId) {
      return NextResponse.json(
        { error: 'courseSlug or courseId is required' },
        { status: 400 }
      )
    }

    // Return no enrollment for development when Supabase not configured
    // This allows testing the access control flow properly
    if (!isSupabaseConfigured()) {
      // Check for mock auth header (for testing enrolled state)
      const mockEnrolled = request.headers.get('x-mock-enrolled')
      if (mockEnrolled === 'true') {
        return NextResponse.json({
          enrollment: {
            id: 'mock-enrollment-id',
            course_id: courseId || 'mock-course-id',
            status: 'active',
            progress: 42,
            enrolled_at: new Date().toISOString(),
          },
          isEnrolled: true,
        })
      }
      // Default: return not enrolled for proper access control testing
      return NextResponse.json({
        enrollment: null,
        isEnrolled: false,
      })
    }

    const supabase = await createServerSupabaseClient()

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { enrollment: null, isEnrolled: false },
        { status: 200 }
      )
    }

    // Build query based on provided parameter
    let query = supabase
      .from('enrollments')
      .select('id, course_id, status, progress, enrolled_at, completed_at')
      .eq('user_id', user.id)

    if (courseId) {
      query = query.eq('course_id', courseId)
    } else if (courseSlug) {
      // Need to join with courses table to filter by slug
      const { data: course } = await supabase
        .from('courses')
        .select('id')
        .eq('slug', courseSlug)
        .single()

      if (!course) {
        return NextResponse.json(
          { enrollment: null, isEnrolled: false },
          { status: 200 }
        )
      }

      query = query.eq('course_id', course.id)
    }

    const { data: enrollment, error } = await query.single()

    if (error || !enrollment) {
      return NextResponse.json(
        { enrollment: null, isEnrolled: false },
        { status: 200 }
      )
    }

    return NextResponse.json({
      enrollment,
      isEnrolled: true,
    })

  } catch (error) {
    console.error('Enrollment check error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Enroll in a free course
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { courseId } = body

    if (!courseId) {
      return NextResponse.json(
        { error: 'courseId is required' },
        { status: 400 }
      )
    }

    // Dev auth bypass for testing
    const isDevBypass = process.env.NODE_ENV === 'development' && process.env.DEV_AUTH_BYPASS === 'true'

    const supabase = await createServerSupabaseClient()
    const supabaseAdmin = await createServerSupabaseAdmin()

    let userId: string

    // Check authentication
    if (isDevBypass) {
      // In dev mode, try to get a real user from the database for testing
      const headerUserId = request.headers.get('x-mock-user-id')
      if (headerUserId) {
        userId = headerUserId
      } else {
        // Try to find any existing user for dev testing
        const { data: anyUser } = await supabaseAdmin
          .from('users')
          .select('id')
          .limit(1)
          .single()

        if (anyUser) {
          userId = anyUser.id
        } else {
          return NextResponse.json(
            { error: 'No users found in database. Please create a user first or sign in.' },
            { status: 400 }
          )
        }
      }
    } else {
      const { data: { user }, error: authError } = await supabase.auth.getUser()

      if (authError || !user) {
        return NextResponse.json(
          { error: 'You must be logged in to enroll' },
          { status: 401 }
        )
      }
      userId = user.id
    }

    // Verify course exists and is free
    const { data: course, error: courseError } = await supabaseAdmin
      .from('courses')
      .select('id, title, price, is_free, status')
      .eq('id', courseId)
      .single()

    if (courseError || !course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    // Check if course is free (either is_free flag or price is 0)
    const isFree = course.is_free === true || (course.price !== null && Number(course.price) === 0)

    if (!isFree) {
      return NextResponse.json(
        { error: 'This course requires payment. Please use the checkout flow.' },
        { status: 400 }
      )
    }

    // Check if already enrolled
    const { data: existingEnrollment } = await supabaseAdmin
      .from('enrollments')
      .select('id')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .single()

    if (existingEnrollment) {
      return NextResponse.json(
        { error: 'You are already enrolled in this course', enrollmentId: existingEnrollment.id },
        { status: 409 }
      )
    }

    // Create enrollment
    const { data: enrollment, error: enrollError } = await supabaseAdmin
      .from('enrollments')
      .insert({
        user_id: userId,
        course_id: courseId,
        enrolled_at: new Date().toISOString(),
        progress_percentage: 0,
        is_active: true,
        last_accessed_at: new Date().toISOString(),
      })
      .select('id, course_id, enrolled_at, progress_percentage')
      .single()

    if (enrollError) {
      console.error('Enrollment creation error:', enrollError)
      return NextResponse.json(
        { error: 'Failed to create enrollment' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Successfully enrolled in ${course.title}`,
      enrollment,
    })

  } catch (error) {
    console.error('Free enrollment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
