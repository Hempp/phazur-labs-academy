/**
 * Video Upload Completion API Route
 *
 * POST /api/admin/video-upload/[sessionId]/complete - Complete a multipart upload
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getUploadSession, completeUpload } from '@/lib/services/upload-session'

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

    // Users can only complete their own uploads (admins can complete any)
    if (profile.role !== 'admin' && session.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { parts, title, description, tags } = body

    // Validate parts array
    if (!parts || !Array.isArray(parts) || parts.length === 0) {
      return NextResponse.json(
        { error: 'parts array is required with completed part information' },
        { status: 400 }
      )
    }

    // Validate each part has required fields
    for (const part of parts) {
      if (typeof part.PartNumber !== 'number' || !part.ETag) {
        return NextResponse.json(
          { error: 'Each part must have PartNumber (number) and ETag (string)' },
          { status: 400 }
        )
      }
    }

    // Complete the upload
    const result = await completeUpload({
      sessionId,
      parts,
      title,
      description,
      tags,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error completing upload:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to complete upload' },
      { status: 500 }
    )
  }
}
