// Enrollments API
// Check if user is enrolled in a course

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

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
