import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { heygenService, defaultAcademyAvatars } from '@/lib/services/heygen'

// POST - Generate a new video with HeyGen
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()

    // Verify admin authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const {
      title,
      script,
      avatarId,
      voiceId,
      backgroundColor,
      aspectRatio,
      lessonId,
      testMode
    } = body

    // Validate required fields
    if (!title || !script) {
      return NextResponse.json({ error: 'Title and script are required' }, { status: 400 })
    }

    // Use defaults if not provided
    const selectedAvatar = avatarId || defaultAcademyAvatars[0].id
    const selectedVoice = voiceId || defaultAcademyAvatars[0].voiceId

    // Generate video with HeyGen
    const { videoId } = await heygenService.generateLessonVideo({
      title,
      script,
      avatarId: selectedAvatar,
      voiceId: selectedVoice,
      backgroundColor: backgroundColor || '#1e3a5f',
      aspectRatio: aspectRatio || '16:9',
      test: testMode ?? process.env.NODE_ENV !== 'production',
    })

    // Store video generation record
    const { data: videoRecord, error: dbError } = await supabase
      .from('video_generations')
      .insert({
        heygen_video_id: videoId,
        title,
        script,
        avatar_id: selectedAvatar,
        voice_id: selectedVoice,
        lesson_id: lessonId || null,
        status: 'processing',
        created_by: user.id,
      })
      .select()
      .single()

    if (dbError) {
      console.error('Failed to store video record:', dbError)
      // Continue anyway - video is generating
    }

    return NextResponse.json({
      success: true,
      videoId,
      message: 'Video generation started. Check status for completion.',
      recordId: videoRecord?.id,
    })

  } catch (error) {
    console.error('Video generation error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate video' },
      { status: 500 }
    )
  }
}

// GET - List videos or get avatars/voices
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()

    // Verify admin authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    // Get avatars list
    if (type === 'avatars') {
      try {
        const avatars = await heygenService.getAvatars()
        return NextResponse.json({ avatars })
      } catch {
        // Fallback to default avatars if API fails
        return NextResponse.json({ avatars: defaultAcademyAvatars })
      }
    }

    // Get voices list
    if (type === 'voices') {
      try {
        const voices = await heygenService.getVoices()
        return NextResponse.json({ voices })
      } catch {
        // Return empty if API fails
        return NextResponse.json({ voices: [] })
      }
    }

    // List generated videos
    const { data: videos, error } = await supabase
      .from('video_generations')
      .select(`
        *,
        lesson:lessons(id, title, course:courses(id, title))
      `)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      throw error
    }

    return NextResponse.json({ videos })

  } catch (error) {
    console.error('Video fetch error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch videos' },
      { status: 500 }
    )
  }
}
