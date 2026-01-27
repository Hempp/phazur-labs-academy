// Certificate PDF Download API
// Generates and returns a PDF certificate

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createServerSupabaseAdmin } from '@/lib/supabase/server'
import { generateCertificatePDF, getCertificateFilename } from '@/lib/services/certificate-pdf'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: certificateId } = await params
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'pdf'

    // Dev auth bypass for testing
    const isDevBypass = process.env.NODE_ENV === 'development' && process.env.DEV_AUTH_BYPASS === 'true'

    const supabaseAdmin = await createServerSupabaseAdmin()
    let userId: string | null = null

    if (!isDevBypass) {
      const supabase = await createServerSupabaseClient()
      const { data: { user }, error: authError } = await supabase.auth.getUser()

      if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      userId = user.id
    }

    // Fetch certificate with course and user details
    let query = supabaseAdmin
      .from('certificates')
      .select(`
        id,
        certificate_number,
        verification_url,
        issued_at,
        grade,
        courses (
          id,
          title,
          total_duration_minutes,
          tags,
          users!courses_instructor_id_fkey (
            full_name
          )
        ),
        users (
          full_name,
          email
        )
      `)
      .eq('id', certificateId)

    // In non-dev mode, verify ownership
    if (userId) {
      query = query.eq('user_id', userId)
    }

    const { data: certificate, error } = await query.single()

    if (error || !certificate) {
      return NextResponse.json({ error: 'Certificate not found' }, { status: 404 })
    }

    // Handle Supabase returning relations as arrays or objects
    const course = Array.isArray(certificate.courses) ? certificate.courses[0] : certificate.courses
    const user = Array.isArray(certificate.users) ? certificate.users[0] : certificate.users
    const instructor = course?.users
      ? (Array.isArray(course.users) ? course.users[0] : course.users)
      : null

    // Format the completion date
    const completionDate = new Date(certificate.issued_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    // Calculate course hours
    const courseHours = Math.ceil((course?.total_duration_minutes || 60) / 60)

    // Build certificate data
    const certificateData = {
      recipientName: user?.full_name || user?.email || 'Student',
      courseName: course?.title || 'Course',
      completionDate,
      certificateId: certificate.certificate_number,
      instructorName: instructor?.full_name || 'Instructor',
      courseHours,
      skills: course?.tags || [],
      grade: certificate.grade,
      verificationUrl: certificate.verification_url,
    }

    // Return JSON if explicitly requested
    if (format === 'json') {
      return NextResponse.json({
        certificate: certificateData,
        downloadUrl: `/api/certificates/${certificateId}/download`,
      })
    }

    // Generate PDF
    const pdfBuffer = await generateCertificatePDF(certificateData)
    const filename = getCertificateFilename(certificateData.recipientName, certificateData.courseName)

    // Return PDF with appropriate headers
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': pdfBuffer.length.toString(),
        'Cache-Control': 'private, max-age=3600',
      },
    })

  } catch (error) {
    console.error('Certificate download error:', error)
    return NextResponse.json({ error: 'Failed to generate certificate' }, { status: 500 })
  }
}
