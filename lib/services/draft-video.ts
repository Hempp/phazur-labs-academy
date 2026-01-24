// Draft Video Generator - Free local video creation for previews
// Uses Edge TTS + FFmpeg for quick draft videos
// NOTE: This file uses Node.js modules and can only be imported in server-side code

import { edgeTTSService } from './edge-tts'
import { draftAvatars, type DraftAvatar } from './draft-video-config'
import { edgeVoices, type EdgeVoice } from './edge-tts-config'

// Re-export for convenience
export { draftAvatars, type DraftAvatar }

export interface DraftVideoRequest {
  title: string
  script: string
  voiceId?: string
  avatarImageUrl?: string
  backgroundColor?: string
  aspectRatio?: '16:9' | '9:16' | '1:1'
}

export interface DraftVideoResult {
  audioBase64: string
  audioFormat: string
  videoBase64?: string
  videoFormat?: string
  durationSeconds: number
  status: 'audio_only' | 'video_ready'
  message: string
}

class DraftVideoService {
  /**
   * Generate a draft video with free TTS
   * Returns audio immediately, video if FFmpeg is available
   */
  async generateDraft(request: DraftVideoRequest): Promise<DraftVideoResult> {
    const {
      script,
      voiceId = 'en-US-AriaNeural',
      backgroundColor = '#1e3a5f',
    } = request

    // Step 1: Generate audio with Edge TTS
    const ttsResult = await edgeTTSService.synthesize(script, {
      voice: voiceId,
      rate: '0%',
    })

    // Step 2: Try to generate video with FFmpeg (if available)
    let videoResult: { base64: string; format: string } | null = null

    try {
      videoResult = await this.generateVideoWithFFmpeg({
        audioBase64: ttsResult.audioBase64,
        backgroundColor,
        durationSeconds: ttsResult.durationEstimate,
      })
    } catch (error) {
      console.log('FFmpeg not available, returning audio only:', error)
    }

    return {
      audioBase64: ttsResult.audioBase64,
      audioFormat: ttsResult.audioFormat,
      videoBase64: videoResult?.base64,
      videoFormat: videoResult?.format,
      durationSeconds: ttsResult.durationEstimate,
      status: videoResult ? 'video_ready' : 'audio_only',
      message: videoResult
        ? 'Draft video generated successfully'
        : 'Audio generated. Install FFmpeg for video preview.',
    }
  }

  /**
   * Generate simple video with colored background using FFmpeg
   */
  private async generateVideoWithFFmpeg(params: {
    audioBase64: string
    backgroundColor: string
    durationSeconds: number
  }): Promise<{ base64: string; format: string }> {
    const { exec } = await import('child_process')
    const { promisify } = await import('util')
    const { writeFile, readFile, unlink } = await import('fs/promises')
    const { join } = await import('path')
    const { tmpdir } = await import('os')
    const execAsync = promisify(exec)

    const tempId = Date.now().toString()
    const audioFile = join(tmpdir(), `draft-${tempId}.mp3`)
    const videoFile = join(tmpdir(), `draft-${tempId}.mp4`)

    try {
      // Write audio to temp file
      const audioBuffer = Buffer.from(params.audioBase64, 'base64')
      await writeFile(audioFile, audioBuffer)

      // Convert hex color to FFmpeg format
      const color = params.backgroundColor.replace('#', '0x')

      // Generate video with colored background + audio
      // Creates a simple video with the background color and audio
      await execAsync(
        `ffmpeg -f lavfi -i color=c=${color}:s=1920x1080:d=${params.durationSeconds} ` +
        `-i "${audioFile}" -c:v libx264 -tune stillimage -c:a aac -b:a 192k ` +
        `-pix_fmt yuv420p -shortest -y "${videoFile}"`,
        { timeout: 180000 }
      )

      // Read generated video
      const videoBuffer = await readFile(videoFile)
      const videoBase64 = videoBuffer.toString('base64')

      // Cleanup
      await unlink(audioFile).catch(() => {})
      await unlink(videoFile).catch(() => {})

      return {
        base64: videoBase64,
        format: 'video/mp4',
      }
    } catch (error) {
      // Cleanup on error
      await unlink(audioFile).catch(() => {})
      await unlink(videoFile).catch(() => {})
      throw error
    }
  }

  /**
   * Get available draft avatars with their voices
   */
  getAvatars() {
    return draftAvatars
  }

  /**
   * Get available voices
   */
  getVoices(): EdgeVoice[] {
    return edgeVoices
  }

  /**
   * Estimate video duration from script
   */
  estimateDuration(script: string): number {
    const wordCount = script.split(/\s+/).filter(Boolean).length
    return Math.ceil(wordCount / 2.5) // ~150 words per minute = 2.5 words per second
  }
}

export const draftVideoService = new DraftVideoService()
export { DraftVideoService }
