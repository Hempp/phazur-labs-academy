/**
 * Video Upload Initiation API Route
 *
 * POST /api/admin/video-upload/initiate - Start a new multipart upload session
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { initiateUpload } from '@/lib/services/upload-session'
import { isS3Configured } from '@/lib/services/s3-storage'

export async function POST(request: NextRequest) {
  try {
    // Check S3 configuration
    if (!isS3Configured()) {
      return NextResponse.json(
        { error: 'S3 storage is not configured. Please set AWS environment variables.' },
        { status: 503 }
      )
    }

    const supabase = await createServerSupabaseClient()

    // Verify authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify admin/instructor role
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || !['admin', 'instructor'].includes(profile.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()

    // Validate required fields
    const { filename, fileSizeBytes, mimeType, title, courseId, moduleId, lessonId } = body

    if (!filename || typeof filename !== 'string') {
      return NextResponse.json({ error: 'filename is required' }, { status: 400 })
    }

    if (!fileSizeBytes || typeof fileSizeBytes !== 'number' || fileSizeBytes <= 0) {
      return NextResponse.json({ error: 'Valid fileSizeBytes is required' }, { status: 400 })
    }

    if (!mimeType || typeof mimeType !== 'string') {
      return NextResponse.json({ error: 'mimeType is required' }, { status: 400 })
    }

    // Initiate the upload
    const result = await initiateUpload({
      filename,
      fileSizeBytes,
      mimeType,
      userId: user.id,
      title,
      courseId,
      moduleId,
      lessonId,
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Error initiating upload:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to initiate upload' },
      { status: 500 }
    )
  }
}
