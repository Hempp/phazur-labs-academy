import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { heygenClient } from '@/lib/services/heygen-client'

// GET: Check video generation status
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerSupabaseClient()
    const { id } = await params

    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get video generation record
    const { data: videoGen, error } = await supabase
      .from('video_generations')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !videoGen) {
      return NextResponse.json({ error: 'Video generation not found' }, { status: 404 })
    }

    // If still processing, check HeyGen status
    if (videoGen.status === 'processing' && videoGen.heygen_video_id) {
      try {
        const heygenStatus = await heygenClient.getVideoStatus(videoGen.heygen_video_id)

        if (heygenStatus.status !== videoGen.status) {
          // Update status in database
          const updates: Record<string, unknown> = {
            status: heygenStatus.status,
          }

          if (heygenStatus.status === 'completed') {
            updates.video_url = heygenStatus.videoUrl
            updates.thumbnail_url = heygenStatus.thumbnailUrl
            updates.duration_seconds = heygenStatus.duration
            updates.completed_at = new Date().toISOString()

            // Also update the lesson with the video URL
            if (videoGen.lesson_id) {
              await supabase
                .from('lessons')
                .update({ video_url: heygenStatus.videoUrl })
                .eq('id', videoGen.lesson_id)
            }
          } else if (heygenStatus.status === 'failed') {
            updates.error_message = heygenStatus.error
          }

          await supabase
            .from('video_generations')
            .update(updates)
            .eq('id', id)

          // Return updated data
          return NextResponse.json({
            ...videoGen,
            ...updates,
          })
        }
      } catch (heygenError) {
        console.error('HeyGen status check failed:', heygenError)
      }
    }

    return NextResponse.json(videoGen)
  } catch (error) {
    console.error('Video generation status error:', error)
    return NextResponse.json(
      { error: 'Failed to get video generation status' },
      { status: 500 }
    )
  }
}
