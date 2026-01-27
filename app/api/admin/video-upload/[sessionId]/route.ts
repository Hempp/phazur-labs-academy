/**
 * Upload Session Management API Routes
 *
 * GET /api/admin/video-upload/[sessionId] - Get session details
 * PATCH /api/admin/video-upload/[sessionId] - Update progress
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import {
  getUploadSession,
  updateUploadProgress,
  refreshPresignedUrls,
} from '@/lib/services/upload-session'

interface RouteParams {
  params: Promise<{ sessionId: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { sessionId } = await params
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

    const session = await getUploadSession(sessionId)

    if (!session) {
      return NextResponse.json({ error: 'Upload session not found' }, { status: 404 })
    }

    // Users can only view their own uploads (admins can view any)
    if (profile.role !== 'admin' && session.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json(session)
  } catch (error) {
    console.error('Error getting upload session:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get upload session' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { sessionId } = await params
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

    // Check session exists and belongs to user
    const session = await getUploadSession(sessionId)

    if (!session) {
      return NextResponse.json({ error: 'Upload session not found' }, { status: 404 })
    }

    // Users can only update their own uploads (admins can update any)
    if (profile.role !== 'admin' && session.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { partsCompleted, bytesUploaded, refreshUrls } = body

    // If requesting URL refresh
    if (refreshUrls) {
      const newUrls = await refreshPresignedUrls(sessionId)
      return NextResponse.json({ presignedUrls: newUrls })
    }

    // Update progress
    if (typeof partsCompleted === 'number' && typeof bytesUploaded === 'number') {
      const updatedSession = await updateUploadProgress(sessionId, partsCompleted, bytesUploaded)
      return NextResponse.json(updatedSession)
    }

    return NextResponse.json({ error: 'No valid update data provided' }, { status: 400 })
  } catch (error) {
    console.error('Error updating upload session:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update upload session' },
      { status: 500 }
    )
  }
}
