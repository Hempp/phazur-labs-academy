// HeyGen Video Generation Service
// Integrates with HeyGen API for AI avatar video generation

export interface HeyGenVideoRequest {
  script: string
  title: string
  avatarId?: string
  voiceId?: string
  background?: {
    type: 'color' | 'image' | 'video'
    value: string // hex color or URL
  }
  aspectRatio?: '16:9' | '9:16' | '1:1'
  caption?: boolean
}

export interface HeyGenVideoResponse {
  videoId: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  videoUrl?: string
  thumbnailUrl?: string
  duration?: number
  error?: string
}

export interface HeyGenAvatar {
  avatar_id: string
  avatar_name: string
  preview_image_url: string
  preview_video_url?: string
  gender: string
}

export interface HeyGenVoice {
  voice_id: string
  name: string
  language: string
  gender: string
  preview_audio?: string
}

class HeyGenClient {
  private apiKey: string | undefined
  private baseUrl = 'https://api.heygen.com/v2'

  // Default professional presenter settings
  private defaultAvatarId = 'Angela-inblackskirt-20220820' // Professional female presenter
  private defaultVoiceId = 'en-US-JennyNeural' // Clear, professional English voice
  private defaultBackground = {
    type: 'color' as const,
    value: '#f8fafc' // Light, clean background
  }

  constructor() {
    this.apiKey = process.env.HEYGEN_API_KEY
  }

  /**
   * Check if HeyGen is configured
   */
  isConfigured(): boolean {
    return !!this.apiKey && this.apiKey.startsWith('sk_')
  }

  /**
   * Get available avatars
   */
  async getAvatars(): Promise<HeyGenAvatar[]> {
    if (!this.isConfigured()) {
      throw new Error('HeyGen API key not configured')
    }

    const response = await fetch(`${this.baseUrl}/avatars`, {
      method: 'GET',
      headers: {
        'X-Api-Key': this.apiKey!,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(`HeyGen API error: ${error.message || response.statusText}`)
    }

    const data = await response.json()
    return data.data?.avatars || []
  }

  /**
   * Get available voices
   */
  async getVoices(): Promise<HeyGenVoice[]> {
    if (!this.isConfigured()) {
      throw new Error('HeyGen API key not configured')
    }

    const response = await fetch(`${this.baseUrl}/voices`, {
      method: 'GET',
      headers: {
        'X-Api-Key': this.apiKey!,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(`HeyGen API error: ${error.message || response.statusText}`)
    }

    const data = await response.json()
    return data.data?.voices || []
  }

  /**
   * Create a video from script
   */
  async createVideo(request: HeyGenVideoRequest): Promise<HeyGenVideoResponse> {
    if (!this.isConfigured()) {
      throw new Error('HeyGen API key not configured. Set HEYGEN_API_KEY environment variable.')
    }

    const payload = {
      video_inputs: [
        {
          character: {
            type: 'avatar',
            avatar_id: request.avatarId || this.defaultAvatarId,
            avatar_style: 'normal',
          },
          voice: {
            type: 'text',
            input_text: request.script,
            voice_id: request.voiceId || this.defaultVoiceId,
          },
          background: request.background || this.defaultBackground,
        },
      ],
      dimension: {
        width: request.aspectRatio === '9:16' ? 720 : 1920,
        height: request.aspectRatio === '9:16' ? 1280 : 1080,
      },
      caption: request.caption ?? true,
      title: request.title,
    }

    const response = await fetch(`${this.baseUrl}/video/generate`, {
      method: 'POST',
      headers: {
        'X-Api-Key': this.apiKey!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(`HeyGen API error: ${error.message || response.statusText}`)
    }

    const data = await response.json()

    return {
      videoId: data.data?.video_id || '',
      status: 'processing',
    }
  }

  /**
   * Check video generation status
   */
  async getVideoStatus(videoId: string): Promise<HeyGenVideoResponse> {
    if (!this.isConfigured()) {
      throw new Error('HeyGen API key not configured')
    }

    const response = await fetch(`${this.baseUrl}/video_status.get?video_id=${videoId}`, {
      method: 'GET',
      headers: {
        'X-Api-Key': this.apiKey!,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(`HeyGen API error: ${error.message || response.statusText}`)
    }

    const data = await response.json()
    const videoData = data.data

    let status: HeyGenVideoResponse['status'] = 'processing'
    if (videoData.status === 'completed') {
      status = 'completed'
    } else if (videoData.status === 'failed') {
      status = 'failed'
    } else if (videoData.status === 'pending') {
      status = 'pending'
    }

    return {
      videoId,
      status,
      videoUrl: videoData.video_url,
      thumbnailUrl: videoData.thumbnail_url,
      duration: videoData.duration,
      error: videoData.error,
    }
  }

  /**
   * Poll for video completion
   */
  async waitForCompletion(
    videoId: string,
    maxAttempts = 60,
    intervalMs = 10000
  ): Promise<HeyGenVideoResponse> {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const status = await this.getVideoStatus(videoId)

      if (status.status === 'completed' || status.status === 'failed') {
        return status
      }

      // Wait before next poll
      await new Promise(resolve => setTimeout(resolve, intervalMs))
    }

    return {
      videoId,
      status: 'failed',
      error: 'Timeout waiting for video generation',
    }
  }

  /**
   * Format script for video generation with text slides
   */
  formatScriptWithSlides(
    intro: string,
    sections: { title: string; content: string }[],
    recap: string,
    next: string
  ): string {
    let script = ''

    // Intro
    script += intro + '\n\n'

    // Content sections with visual markers
    for (const section of sections) {
      script += `[TITLE SLIDE: ${section.title}]\n\n`
      script += section.content + '\n\n'
    }

    // Recap
    script += '[TITLE SLIDE: Key Takeaways]\n\n'
    script += recap + '\n\n'

    // Next lesson preview
    script += '[TITLE SLIDE: Coming Up Next]\n\n'
    script += next

    return script.trim()
  }
}

export const heygenClient = new HeyGenClient()
export { HeyGenClient }
