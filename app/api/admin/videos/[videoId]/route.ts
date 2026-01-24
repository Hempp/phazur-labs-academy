import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { heygenService } from '@/lib/services/heygen'

// GET - Check video status
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ videoId: string }> }
) {
  try {
    const { videoId } = await params
    const supabase = await createServerSupabaseClient()

    // Verify admin authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get video status from HeyGen
    const status = await heygenService.getVideoStatus(videoId)

    if (status.error) {
      return NextResponse.json({ error: status.error }, { status: 400 })
    }

    // Update database record if status changed
    if (status.data.status === 'completed' && status.data.video_url) {
      await supabase
        .from('video_generations')
        .update({
          status: 'completed',
          video_url: status.data.video_url,
          thumbnail_url: status.data.thumbnail_url,
          duration_seconds: status.data.duration,
          completed_at: new Date().toISOString(),
        })
        .eq('heygen_video_id', videoId)
    } else if (status.data.status === 'failed') {
      await supabase
        .from('video_generations')
        .update({
          status: 'failed',
          error_message: status.data.error,
        })
        .eq('heygen_video_id', videoId)
    }

    return NextResponse.json({
      videoId: status.data.video_id,
      status: status.data.status,
      videoUrl: status.data.video_url,
      thumbnailUrl: status.data.thumbnail_url,
      duration: status.data.duration,
      error: status.data.error,
    })

  } catch (error) {
    console.error('Video status error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to check video status' },
      { status: 500 }
    )
  }
}

// POST - Assign video to lesson
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ videoId: string }> }
) {
  try {
    const { videoId } = await params
    const supabase = await createServerSupabaseClient()

    // Verify admin authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { lessonId, uploadToStorage } = await request.json()

    if (!lessonId) {
      return NextResponse.json({ error: 'Lesson ID is required' }, { status: 400 })
    }

    // Get video generation record
    const { data: videoRecord, error: videoError } = await supabase
      .from('video_generations')
      .select('*')
      .eq('heygen_video_id', videoId)
      .single()

    if (videoError || !videoRecord) {
      return NextResponse.json({ error: 'Video record not found' }, { status: 404 })
    }

    if (videoRecord.status !== 'completed' || !videoRecord.video_url) {
      return NextResponse.json({ error: 'Video is not ready yet' }, { status: 400 })
    }

    let finalVideoUrl = videoRecord.video_url

    // Optionally upload to Supabase storage for better CDN delivery
    if (uploadToStorage) {
      try {
        // Download video from HeyGen
        const videoResponse = await fetch(videoRecord.video_url)
        const videoBlob = await videoResponse.blob()

        const fileName = `lessons/${lessonId}/${Date.now()}.mp4`

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('course-videos')
          .upload(fileName, videoBlob, {
            contentType: 'video/mp4',
            cacheControl: '31536000', // 1 year cache
          })

        if (uploadError) {
          console.error('Upload error:', uploadError)
        } else {
          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('course-videos')
            .getPublicUrl(uploadData.path)

          finalVideoUrl = publicUrl
        }
      } catch (uploadErr) {
        console.error('Failed to upload to storage:', uploadErr)
        // Continue with HeyGen URL
      }
    }

    // Update lesson with video URL
    const { error: lessonError } = await supabase
      .from('lessons')
      .update({
        video_url: finalVideoUrl,
        video_duration_seconds: videoRecord.duration_seconds,
        content_type: 'video',
      })
      .eq('id', lessonId)

    if (lessonError) {
      throw lessonError
    }

    // Update video generation record
    await supabase
      .from('video_generations')
      .update({ lesson_id: lessonId })
      .eq('id', videoRecord.id)

    return NextResponse.json({
      success: true,
      message: 'Video assigned to lesson successfully',
      videoUrl: finalVideoUrl,
    })

  } catch (error) {
    console.error('Assign video error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to assign video' },
      { status: 500 }
    )
  }
}
