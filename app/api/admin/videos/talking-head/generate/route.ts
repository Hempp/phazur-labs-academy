import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import type { TalkingHeadBackend } from '@/lib/services/talking-head/types'

interface GenerateRequest {
  script: string
  avatarId?: string
  avatarImagePath?: string
  voiceId?: string
  backend?: TalkingHeadBackend
  options?: {
    expressionScale?: number
    poseStyle?: number
    stillMode?: boolean
    resolution?: '256' | '512'
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()

    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // SECURITY: Verify user has admin or instructor role
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || !['admin', 'instructor'].includes(profile.role)) {
      return NextResponse.json(
        { error: 'Forbidden - Admin or instructor access required' },
        { status: 403 }
      )
    }

    const body = await request.json() as GenerateRequest
    const { script, avatarId, avatarImagePath, voiceId, backend, options } = body

    if (!script || script.trim().length === 0) {
      return NextResponse.json(
        { error: 'Script is required' },
        { status: 400 }
      )
    }

    // Dynamic import
    const { talkingHeadService } = await import('@/lib/services/talking-head')

    // Check if service is available
    const isAvailable = await talkingHeadService.isAvailable()
    if (!isAvailable) {
      return NextResponse.json(
        {
          error: 'Talking head generation is not available',
          setupRequired: true,
          message: 'Please run the setup script to install SadTalker or Wav2Lip'
        },
        { status: 503 }
      )
    }

    // Resolve avatar image path
    let imagePath = avatarImagePath
    if (!imagePath && avatarId) {
      const avatar = talkingHeadService.getAvatar(avatarId)
      if (avatar) {
        // Convert URL path to file system path
        imagePath = `${process.cwd()}/public${avatar.imagePath}`
      }
    }

    if (!imagePath) {
      return NextResponse.json(
        { error: 'Avatar image path or avatar ID is required' },
        { status: 400 }
      )
    }

    // Get voice from avatar if not specified
    let selectedVoice = voiceId
    if (!selectedVoice && avatarId) {
      const avatar = talkingHeadService.getAvatar(avatarId)
      selectedVoice = avatar?.recommendedVoice
    }

    // Estimate processing time
    const estimate = talkingHeadService.estimateProcessingTime(
      script,
      backend || 'sadtalker',
      true
    )

    // Generate talking head video
    const result = await talkingHeadService.generate({
      script,
      avatarImagePath: imagePath,
      voiceId: selectedVoice,
      backend,
      options,
    })

    return NextResponse.json({
      success: true,
      video: {
        base64: result.videoBase64,
        format: 'video/mp4',
        durationSeconds: result.durationSeconds,
        backend: result.backend,
        processingTimeMs: result.processingTimeMs,
      },
      estimate,
    })
  } catch (error) {
    console.error('Talking head generation error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Generation failed',
        success: false
      },
      { status: 500 }
    )
  }
}
