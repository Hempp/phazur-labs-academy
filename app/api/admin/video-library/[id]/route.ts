/**
 * Individual Video API Routes
 *
 * GET /api/admin/video-library/[id] - Get video details
 * PATCH /api/admin/video-library/[id] - Update video metadata
 * DELETE /api/admin/video-library/[id] - Delete video
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getVideo, updateVideo, deleteVideo } from '@/lib/services/video-library'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
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

    const video = await getVideo(id)

    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    // Instructors can only access their own videos
    if (profile.role === 'instructor' && video.uploadedBy !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json(video)
  } catch (error) {
    console.error('Error getting video:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get video' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
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

    // Check video exists and user has access
    const existingVideo = await getVideo(id)

    if (!existingVideo) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    // Instructors can only update their own videos
    if (profile.role === 'instructor' && existingVideo.uploadedBy !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()

    // Don't allow changing certain fields through this endpoint
    const { id: _, uploadedBy, createdAt, storageKey, storageBucket, ...updateData } = body

    const video = await updateVideo(id, updateData)

    return NextResponse.json(video)
  } catch (error) {
    console.error('Error updating video:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update video' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createServerSupabaseClient()

    // Verify authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify admin role (only admins can delete)
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }

    // Check video exists
    const existingVideo = await getVideo(id)

    if (!existingVideo) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    await deleteVideo(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting video:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete video' },
      { status: 500 }
    )
  }
}
