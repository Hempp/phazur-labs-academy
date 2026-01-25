// Certificate API
// Handles certificate retrieval and verification

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createServerSupabaseAdmin } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const certificateNumber = searchParams.get('verify')
    const certificateId = searchParams.get('id')

    // Public verification endpoint
    if (certificateNumber) {
      const supabase = await createServerSupabaseAdmin()

      const { data: certificate, error } = await supabase
        .from('certificates')
        .select(`
          id,
          certificate_number,
          verification_url,
          issued_at,
          grade,
          course_id,
          user_id,
          courses (
            id,
            title,
            slug
          ),
          users (
            full_name,
            email
          )
        `)
        .eq('certificate_number', certificateNumber)
        .single()

      if (error || !certificate) {
        return NextResponse.json(
          { valid: false, error: 'Certificate not found' },
          { status: 404 }
        )
      }

      // Handle Supabase returning relations as arrays or objects
      const course = Array.isArray(certificate.courses) ? certificate.courses[0] : certificate.courses
      const user = Array.isArray(certificate.users) ? certificate.users[0] : certificate.users

      return NextResponse.json({
        valid: true,
        certificate: {
          certificateNumber: certificate.certificate_number,
          courseTitle: course?.title || 'Unknown Course',
          studentName: user?.full_name || user?.email || 'Student',
          issueDate: certificate.issued_at,
          verificationUrl: certificate.verification_url,
          grade: certificate.grade
        }
      })
    }

    // Authenticated user certificate retrieval
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get specific certificate
    if (certificateId) {
      const { data: certificate, error } = await supabase
        .from('certificates')
        .select(`
          *,
          courses (
            id,
            title,
            slug,
            thumbnail_url,
            level
          )
        `)
        .eq('id', certificateId)
        .eq('user_id', user.id)
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 404 })
      }

      return NextResponse.json({ certificate })
    }

    // Get all certificates for user
    const { data: certificates, error } = await supabase
      .from('certificates')
      .select(`
        *,
        courses (
          id,
          title,
          slug,
          thumbnail_url,
          level
        )
      `)
      .eq('user_id', user.id)
      .order('issued_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ certificates })
  } catch (error) {
    console.error('Certificate GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Manual certificate generation (for admin or special cases)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { enrollmentId, courseId } = body

    // Accept either enrollmentId or courseId
    let targetCourseId = courseId

    if (enrollmentId) {
      // Get course_id from enrollment
      const { data: enrollment, error: enrollmentError } = await supabase
        .from('enrollments')
        .select('id, course_id, is_active, progress_percentage')
        .eq('id', enrollmentId)
        .eq('user_id', user.id)
        .single()

      if (enrollmentError || !enrollment) {
        return NextResponse.json(
          { error: 'Enrollment not found' },
          { status: 404 }
        )
      }

      // Verify course is complete (100% progress)
      if (enrollment.progress_percentage < 100) {
        return NextResponse.json(
          { error: `Course not complete. Current progress: ${enrollment.progress_percentage}%` },
          { status: 400 }
        )
      }

      targetCourseId = enrollment.course_id
    }

    if (!targetCourseId) {
      return NextResponse.json(
        { error: 'Either enrollmentId or courseId is required' },
        { status: 400 }
      )
    }

    // Use admin client to bypass RLS for certificate operations
    const supabaseAdmin = await createServerSupabaseAdmin()

    // Check if certificate already exists (unique constraint on user_id + course_id)
    const { data: existingCert } = await supabaseAdmin
      .from('certificates')
      .select(`
        *,
        courses (
          id,
          title,
          slug
        )
      `)
      .eq('user_id', user.id)
      .eq('course_id', targetCourseId)
      .single()

    if (existingCert) {
      return NextResponse.json({
        message: 'Certificate already exists',
        certificate: existingCert
      })
    }

    const certificateNumber = `PHZR-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

    // Create certificate with only the columns that exist in the schema
    const { data: certificate, error } = await supabaseAdmin
      .from('certificates')
      .insert({
        user_id: user.id,
        course_id: targetCourseId,
        certificate_number: certificateNumber,
        verification_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://phazuracademy.com'}/verify/${certificateNumber}`,
        grade: 'Pass'
      })
      .select(`
        *,
        courses (
          id,
          title,
          slug
        )
      `)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Update enrollment completed_at if we have enrollmentId
    if (enrollmentId) {
      await supabaseAdmin
        .from('enrollments')
        .update({ completed_at: new Date().toISOString() })
        .eq('id', enrollmentId)
    }

    return NextResponse.json({
      message: 'Certificate generated successfully',
      certificate
    })
  } catch (error) {
    console.error('Certificate POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
