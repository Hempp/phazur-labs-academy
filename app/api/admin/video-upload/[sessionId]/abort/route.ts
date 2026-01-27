/**
 * Video Upload Abort API Route
 *
 * POST /api/admin/video-upload/[sessionId]/abort - Cancel/abort an upload
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getUploadSession, cancelUpload } from '@/lib/services/upload-session'

interface RouteParams {
  params: Promise<{ sessionId: string }>
}

export async function POST(request: NextRequest, { params }: RouteParams) {
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

    // Users can only abort their own uploads (admins can abort any)
    if (profile.role !== 'admin' && session.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Cancel the upload
    await cancelUpload(sessionId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error aborting upload:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to abort upload' },
      { status: 500 }
    )
  }
}
