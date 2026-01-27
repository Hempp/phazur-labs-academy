/**
 * Video Library API Routes
 *
 * GET /api/admin/video-library - List videos with filtering/pagination
 * POST /api/admin/video-library - Create a new video entry (for external/imported videos)
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { listVideos, createVideo, type VideoQueryOptions } from '@/lib/services/video-library'

export async function GET(request: NextRequest) {
  try {
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

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const options: VideoQueryOptions = {
      limit: parseInt(searchParams.get('limit') || '20'),
      offset: parseInt(searchParams.get('offset') || '0'),
      search: searchParams.get('search') || undefined,
      sortBy: (searchParams.get('sortBy') as VideoQueryOptions['sortBy']) || 'created_at',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
    }

    // Add filters if provided
    const workflowStatus = searchParams.get('workflowStatus')
    if (workflowStatus) {
      options.workflowStatus = workflowStatus as VideoQueryOptions['workflowStatus']
    }

    const sourceType = searchParams.get('sourceType')
    if (sourceType) {
      options.sourceType = sourceType as VideoQueryOptions['sourceType']
    }

    const courseId = searchParams.get('courseId')
    if (courseId) {
      options.courseId = courseId
    }

    const uploadedBy = searchParams.get('uploadedBy')
    if (uploadedBy) {
      options.uploadedBy = uploadedBy
    }

    // Instructors can only see their own videos (unless admin)
    if (profile.role === 'instructor') {
      options.uploadedBy = user.id
    }

    const result = await listVideos(options)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error listing videos:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to list videos' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
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
    const requiredFields = ['title', 'originalFilename', 'fileSizeBytes', 'mimeType', 'storageKey', 'storageBucket']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    const video = await createVideo({
      ...body,
      uploadedBy: user.id,
    })

    return NextResponse.json(video, { status: 201 })
  } catch (error) {
    console.error('Error creating video:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create video' },
      { status: 500 }
    )
  }
}
