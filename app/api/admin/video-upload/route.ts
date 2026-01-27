/**
 * Video Upload Sessions List API Route
 *
 * GET /api/admin/video-upload - List upload sessions with filtering
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { listUploadSessions, getActiveSessions, type UploadSessionStatus } from '@/lib/services/upload-session'

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
    const activeOnly = searchParams.get('active') === 'true'

    // Quick path for active sessions
    if (activeOnly) {
      const userId = profile.role === 'admin' ? searchParams.get('userId') || undefined : user.id
      if (!userId) {
        // Admins without userId filter: list all active
        const result = await listUploadSessions({
          status: ['pending', 'uploading', 'processing'],
          limit: 50,
        })
        return NextResponse.json(result)
      }
      const sessions = await getActiveSessions(userId)
      return NextResponse.json({ sessions, total: sessions.length })
    }

    // Full list with filtering
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const status = searchParams.get('status') as UploadSessionStatus | null

    const options: {
      userId?: string
      status?: UploadSessionStatus | UploadSessionStatus[]
      limit?: number
      offset?: number
    } = {
      limit,
      offset,
    }

    // Instructors can only see their own sessions
    if (profile.role === 'instructor') {
      options.userId = user.id
    } else if (searchParams.get('userId')) {
      options.userId = searchParams.get('userId')!
    }

    if (status) {
      options.status = status
    }

    const result = await listUploadSessions(options)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error listing upload sessions:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to list upload sessions' },
      { status: 500 }
    )
  }
}
