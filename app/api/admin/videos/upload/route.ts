// Video Upload API
// Handles video file uploads with progress tracking and metadata storage

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createServerSupabaseAdmin } from '@/lib/supabase/server'
import {
  uploadVideo,
  saveVideoMetadata,
  validateVideoFile,
  getVideoProvider,
} from '@/lib/services/video-storage'

// POST - Upload a video file
export async function POST(request: NextRequest) {
  try {
    // Dev auth bypass for testing
    const isDevBypass = process.env.NODE_ENV === 'development' && process.env.DEV_AUTH_BYPASS === 'true'

    // Use admin client in dev bypass mode to bypass RLS
    const supabase = isDevBypass
      ? await createServerSupabaseAdmin()
      : await createServerSupabaseClient()

    let userId = 'dev-user'
    let userRole: string | null = isDevBypass ? 'admin' : null

    // Verify authentication (skip in dev bypass mode)
    if (!isDevBypass) {
      const { data: { user }, error: authError } = await supabase.auth.getUser()

      if (authError || !user) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        )
      }

      // Check if user is admin or instructor
      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

      if (!profile || !['admin', 'instructor'].includes(profile.role)) {
        return NextResponse.json(
          { error: 'Only admins and instructors can upload videos' },
          { status: 403 }
        )
      }

      userId = user.id
      userRole = profile.role
    }

    // Parse multipart form data
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const courseId = formData.get('courseId') as string | null
    const lessonId = formData.get('lessonId') as string | null
    const title = formData.get('title') as string | null
    const description = formData.get('description') as string | null

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    if (!courseId) {
      return NextResponse.json(
        { error: 'courseId is required' },
        { status: 400 }
      )
    }

    // Validate file
    const validation = validateVideoFile(file)
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    // Verify course exists and user has access
    const supabaseAdmin = await createServerSupabaseAdmin()
    const { data: course, error: courseError } = await supabaseAdmin
      .from('courses')
      .select('id, instructor_id')
      .eq('id', courseId)
      .single()

    if (courseError || !course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    // Check instructor owns the course (admins can upload to any course)
    // Skip this check in dev bypass mode
    if (!isDevBypass && userRole === 'instructor' && course.instructor_id !== userId) {
      return NextResponse.json(
        { error: 'You can only upload videos to your own courses' },
        { status: 403 }
      )
    }

    // If lessonId provided, verify it belongs to the course
    if (lessonId) {
      const { data: lesson, error: lessonError } = await supabaseAdmin
        .from('lessons')
        .select('id')
        .eq('id', lessonId)
        .eq('course_id', courseId)
        .single()

      if (lessonError || !lesson) {
        return NextResponse.json(
          { error: 'Lesson not found or does not belong to this course' },
          { status: 404 }
        )
      }
    }

    // Upload the video
    const uploadResult = await uploadVideo({
      file,
      fileName: file.name,
      contentType: file.type,
      courseId,
      lessonId: lessonId || undefined,
      userId,
    })

    if (!uploadResult.success) {
      return NextResponse.json(
        { error: uploadResult.error || 'Upload failed' },
        { status: 500 }
      )
    }

    // Save metadata to database
    const metadataResult = await saveVideoMetadata(uploadResult, {
      courseId,
      lessonId: lessonId || undefined,
      userId,
      title: title || file.name,
      description: description || undefined,
    })

    if (!metadataResult.success) {
      // Log but don't fail - video is uploaded, just metadata failed
      console.error('Failed to save video metadata:', metadataResult.error)
    }

    return NextResponse.json({
      success: true,
      videoId: uploadResult.videoId,
      url: uploadResult.url,
      cdnUrl: uploadResult.cdnUrl,
      provider: uploadResult.provider,
      size: uploadResult.size,
      message: lessonId
        ? 'Video uploaded and assigned to lesson'
        : 'Video uploaded successfully',
    })

  } catch (error) {
    console.error('Video upload error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    )
  }
}

// GET - Check upload status and get video provider info
export async function GET(request: NextRequest) {
  try {
    // Dev auth bypass for testing
    const isDevBypass = process.env.NODE_ENV === 'development' && process.env.DEV_AUTH_BYPASS === 'true'

    // Verify authentication (skip in dev bypass mode)
    if (!isDevBypass) {
      const supabase = await createServerSupabaseClient()
      const { data: { user }, error: authError } = await supabase.auth.getUser()

      if (authError || !user) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        )
      }
    }

    const { searchParams } = new URL(request.url)
    const videoId = searchParams.get('videoId')

    // If videoId provided, get specific video status
    if (videoId) {
      const supabaseAdmin = await createServerSupabaseAdmin()
      const { data: video, error } = await supabaseAdmin
        .from('video_generations')
        .select('*')
        .eq('id', videoId)
        .single()

      if (error || !video) {
        return NextResponse.json(
          { error: 'Video not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({ video })
    }

    // Otherwise, return provider info and capabilities
    const provider = getVideoProvider()

    return NextResponse.json({
      provider,
      maxFileSizeMB: 500,
      allowedTypes: ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-m4v'],
      features: {
        cdn: provider === 'bunnycdn',
        signedUrls: true,
        thumbnailGeneration: provider === 'bunnycdn',
        transcoding: provider === 'bunnycdn',
      },
    })

  } catch (error) {
    console.error('Video status error:', error)
    return NextResponse.json(
      { error: 'Failed to get video status' },
      { status: 500 }
    )
  }
}
