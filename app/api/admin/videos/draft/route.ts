import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { draftVideoService } from '@/lib/services/draft-video'
import { draftAvatars } from '@/lib/services/draft-video-config'
import { edgeVoices } from '@/lib/services/edge-tts-config'

// POST - Generate a draft video (free, local)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()

    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, script, voiceId, backgroundColor } = body

    if (!title || !script) {
      return NextResponse.json(
        { error: 'Title and script are required' },
        { status: 400 }
      )
    }

    // Generate draft video
    const result = await draftVideoService.generateDraft({
      title,
      script,
      voiceId: voiceId || 'en-US-AriaNeural',
      backgroundColor: backgroundColor || '#1e3a5f',
    })

    // Store draft record in database
    const { data: draftRecord, error: dbError } = await supabase
      .from('video_generations')
      .insert({
        heygen_video_id: `draft-${Date.now()}`,
        title: `[DRAFT] ${title}`,
        script,
        avatar_id: voiceId || 'en-US-AriaNeural',
        voice_id: voiceId || 'en-US-AriaNeural',
        status: 'completed',
        duration_seconds: result.durationSeconds,
        created_by: user.id,
        completed_at: new Date().toISOString(),
        metadata: {
          isDraft: true,
          hasVideo: result.status === 'video_ready',
          backgroundColor,
        },
      })
      .select()
      .single()

    if (dbError) {
      console.error('Failed to store draft record:', dbError)
    }

    // If we have video, upload to storage
    let videoUrl = null
    let audioUrl = null

    if (result.videoBase64) {
      const videoBuffer = Buffer.from(result.videoBase64, 'base64')
      const videoPath = `drafts/${user.id}/${Date.now()}-draft.mp4`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('course-videos')
        .upload(videoPath, videoBuffer, {
          contentType: 'video/mp4',
          upsert: false,
        })

      if (!uploadError && uploadData) {
        const { data: urlData } = supabase.storage
          .from('course-videos')
          .getPublicUrl(videoPath)
        videoUrl = urlData.publicUrl
      }
    }

    // Always upload audio
    if (result.audioBase64) {
      const audioBuffer = Buffer.from(result.audioBase64, 'base64')
      const audioPath = `drafts/${user.id}/${Date.now()}-draft.mp3`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('course-videos')
        .upload(audioPath, audioBuffer, {
          contentType: 'audio/mp3',
          upsert: false,
        })

      if (!uploadError && uploadData) {
        const { data: urlData } = supabase.storage
          .from('course-videos')
          .getPublicUrl(audioPath)
        audioUrl = urlData.publicUrl
      }
    }

    // Update record with URLs
    if (draftRecord && (videoUrl || audioUrl)) {
      await supabase
        .from('video_generations')
        .update({
          video_url: videoUrl || audioUrl,
          thumbnail_url: null,
        })
        .eq('id', draftRecord.id)
    }

    return NextResponse.json({
      success: true,
      draft: {
        id: draftRecord?.id,
        title: `[DRAFT] ${title}`,
        status: result.status,
        durationSeconds: result.durationSeconds,
        videoUrl,
        audioUrl,
        message: result.message,
      },
    })
  } catch (error) {
    console.error('Draft video error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate draft' },
      { status: 500 }
    )
  }
}

// GET - Get available voices and avatars for drafts
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()

    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json({
      voices: edgeVoices,
      avatars: draftAvatars,
    })
  } catch (error) {
    console.error('Draft voices fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch voices' },
      { status: 500 }
    )
  }
}
