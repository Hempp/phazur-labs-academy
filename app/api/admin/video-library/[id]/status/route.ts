/**
 * Video Workflow Status API Route
 *
 * PATCH /api/admin/video-library/[id]/status - Update video workflow status
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getVideo, updateWorkflowStatus, type WorkflowStatus } from '@/lib/services/video-library'

interface RouteParams {
  params: Promise<{ id: string }>
}

const VALID_STATUSES: WorkflowStatus[] = ['draft', 'review', 'approved', 'published']

// Define allowed transitions
const ALLOWED_TRANSITIONS: Record<WorkflowStatus, WorkflowStatus[]> = {
  draft: ['review'],
  review: ['draft', 'approved'],
  approved: ['review', 'published'],
  published: ['draft'], // Can unpublish back to draft
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

    const body = await request.json()
    const { status: newStatus } = body

    // Validate new status
    if (!newStatus || !VALID_STATUSES.includes(newStatus)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` },
        { status: 400 }
      )
    }

    // Get current video
    const video = await getVideo(id)

    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    // Instructors can only update their own videos
    if (profile.role === 'instructor' && video.uploadedBy !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Validate transition
    const currentStatus = video.workflowStatus as WorkflowStatus
    const allowedTransitions = ALLOWED_TRANSITIONS[currentStatus]

    if (!allowedTransitions.includes(newStatus)) {
      return NextResponse.json(
        {
          error: `Cannot transition from '${currentStatus}' to '${newStatus}'. Allowed transitions: ${allowedTransitions.join(', ')}`,
        },
        { status: 400 }
      )
    }

    // Only admins can approve or publish
    if ((newStatus === 'approved' || newStatus === 'published') && profile.role !== 'admin') {
      return NextResponse.json(
        { error: 'Only admins can approve or publish videos' },
        { status: 403 }
      )
    }

    // Update the status
    const updatedVideo = await updateWorkflowStatus(id, newStatus, user.id)

    return NextResponse.json(updatedVideo)
  } catch (error) {
    console.error('Error updating video status:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update video status' },
      { status: 500 }
    )
  }
}
