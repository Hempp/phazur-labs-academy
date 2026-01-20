// HeyGen API Service for AI Video Generation
// Documentation: https://docs.heygen.com/reference/overview

const HEYGEN_API_BASE = 'https://api.heygen.com/v2'

export interface HeyGenAvatar {
  avatar_id: string
  avatar_name: string
  gender: string
  preview_image_url: string
  preview_video_url?: string
}

export interface HeyGenVoice {
  voice_id: string
  name: string
  language: string
  gender: string
  preview_audio_url?: string
}

export interface HeyGenVideoRequest {
  video_inputs: {
    character: {
      type: 'avatar'
      avatar_id: string
      avatar_style: 'normal' | 'circle' | 'closeUp'
    }
    voice: {
      type: 'text'
      input_text: string
      voice_id: string
      speed?: number
      pitch?: number
    }
    background?: {
      type: 'color' | 'image' | 'video'
      value: string
    }
  }[]
  dimension?: {
    width: number
    height: number
  }
  aspect_ratio?: '16:9' | '9:16' | '1:1'
  test?: boolean
}

export interface HeyGenVideoResponse {
  error: string | null
  data: {
    video_id: string
  }
}

export interface HeyGenVideoStatus {
  error: string | null
  data: {
    video_id: string
    status: 'pending' | 'processing' | 'completed' | 'failed'
    video_url?: string
    thumbnail_url?: string
    duration?: number
    gif_url?: string
    error?: string
  }
}

class HeyGenService {
  private apiKey: string

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.HEYGEN_API_KEY || ''
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    if (!this.apiKey) {
      throw new Error('HeyGen API key is not configured. Please set HEYGEN_API_KEY environment variable.')
    }

    const response = await fetch(`${HEYGEN_API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'X-Api-Key': this.apiKey,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }))
      throw new Error(`HeyGen API Error: ${error.message || response.statusText}`)
    }

    return response.json()
  }

  /**
   * Get list of available avatars
   */
  async getAvatars(): Promise<HeyGenAvatar[]> {
    const response = await this.request<{ data: { avatars: HeyGenAvatar[] } }>('/avatars')
    return response.data.avatars
  }

  /**
   * Get list of available voices
   */
  async getVoices(): Promise<HeyGenVoice[]> {
    const response = await this.request<{ data: { voices: HeyGenVoice[] } }>('/voices')
    return response.data.voices
  }

  /**
   * Create a new video
   */
  async createVideo(request: HeyGenVideoRequest): Promise<HeyGenVideoResponse> {
    return this.request<HeyGenVideoResponse>('/video/generate', {
      method: 'POST',
      body: JSON.stringify(request),
    })
  }

  /**
   * Get video status and URL
   */
  async getVideoStatus(videoId: string): Promise<HeyGenVideoStatus> {
    return this.request<HeyGenVideoStatus>(`/video_status.get?video_id=${videoId}`)
  }

  /**
   * Generate a lesson video with script
   */
  async generateLessonVideo(params: {
    title: string
    script: string
    avatarId: string
    voiceId: string
    backgroundType?: 'color' | 'image'
    backgroundColor?: string
    backgroundImage?: string
    aspectRatio?: '16:9' | '9:16' | '1:1'
    test?: boolean
  }): Promise<{ videoId: string }> {
    const request: HeyGenVideoRequest = {
      video_inputs: [{
        character: {
          type: 'avatar',
          avatar_id: params.avatarId,
          avatar_style: 'normal',
        },
        voice: {
          type: 'text',
          input_text: params.script,
          voice_id: params.voiceId,
          speed: 1.0,
        },
        background: params.backgroundType === 'image' && params.backgroundImage
          ? { type: 'image', value: params.backgroundImage }
          : { type: 'color', value: params.backgroundColor || '#1e3a5f' },
      }],
      aspect_ratio: params.aspectRatio || '16:9',
      test: params.test ?? (process.env.NODE_ENV !== 'production'),
    }

    const response = await this.createVideo(request)

    if (response.error) {
      throw new Error(`Failed to create video: ${response.error}`)
    }

    return { videoId: response.data.video_id }
  }

  /**
   * Wait for video to complete and return URL
   */
  async waitForVideo(videoId: string, maxWaitMs = 300000): Promise<{
    videoUrl: string
    thumbnailUrl: string
    duration: number
  }> {
    const startTime = Date.now()
    const pollInterval = 5000 // 5 seconds

    while (Date.now() - startTime < maxWaitMs) {
      const status = await this.getVideoStatus(videoId)

      if (status.error) {
        throw new Error(`Error checking video status: ${status.error}`)
      }

      if (status.data.status === 'completed' && status.data.video_url) {
        return {
          videoUrl: status.data.video_url,
          thumbnailUrl: status.data.thumbnail_url || '',
          duration: status.data.duration || 0,
        }
      }

      if (status.data.status === 'failed') {
        throw new Error(`Video generation failed: ${status.data.error || 'Unknown error'}`)
      }

      // Wait before next poll
      await new Promise(resolve => setTimeout(resolve, pollInterval))
    }

    throw new Error('Video generation timed out')
  }
}

// Export singleton instance
export const heygenService = new HeyGenService()

// Export class for custom instances
export { HeyGenService }

// Default avatars for the academy (would be fetched from HeyGen in production)
export const defaultAcademyAvatars = [
  {
    id: 'anna_costume1_front',
    name: 'Anna - Professional',
    previewUrl: '/avatars/anna.jpg',
    gender: 'female' as const,
    voiceId: 'en-US-AnnaNeural',
    style: 'professional' as const,
  },
  {
    id: 'josh_lite3_front',
    name: 'Josh - Friendly',
    previewUrl: '/avatars/josh.jpg',
    gender: 'male' as const,
    voiceId: 'en-US-JoshNeural',
    style: 'friendly' as const,
  },
  {
    id: 'kayla_costume1_front',
    name: 'Kayla - Casual',
    previewUrl: '/avatars/kayla.jpg',
    gender: 'female' as const,
    voiceId: 'en-US-KaylaNeural',
    style: 'casual' as const,
  },
  {
    id: 'tyler_costume1_front',
    name: 'Tyler - Professional',
    previewUrl: '/avatars/tyler.jpg',
    gender: 'male' as const,
    voiceId: 'en-US-TylerNeural',
    style: 'professional' as const,
  },
]

// Script templates for different lesson types
export const scriptTemplates = {
  introduction: (courseName: string, instructorName: string) => `
Hello and welcome to ${courseName}!

I'm ${instructorName}, and I'll be your instructor throughout this course. I'm excited to guide you through this learning journey.

In this course, you'll gain practical skills and knowledge that you can apply immediately in your work. We've designed each lesson to build upon the previous one, ensuring a smooth and comprehensive learning experience.

Before we dive in, make sure you have the necessary prerequisites and have set up your development environment as outlined in the course description.

Let's get started!
  `.trim(),

  conceptExplanation: (concept: string, keyPoints: string[]) => `
In this lesson, we're going to explore ${concept}.

This is a fundamental concept that you'll use throughout your career, so it's important to understand it well.

Here are the key points we'll cover:
${keyPoints.map((point, i) => `${i + 1}. ${point}`).join('\n')}

Let's break this down step by step.
  `.trim(),

  practicalDemo: (topic: string) => `
Now let's put theory into practice with ${topic}.

I'll walk you through a real-world example that demonstrates exactly how this works. Follow along with me, and don't hesitate to pause the video if you need to catch up.

By the end of this demonstration, you'll have hands-on experience implementing this concept yourself.
  `.trim(),

  sectionSummary: (sectionName: string, nextSteps: string) => `
Great job completing this section on ${sectionName}!

Let's quickly recap what we've learned:
- We covered the fundamental concepts
- You practiced implementing these concepts
- You completed the quiz and assignment

${nextSteps}

Take a moment to review your notes before moving on. If anything is unclear, feel free to rewatch the lessons or ask questions in the discussion forum.

See you in the next section!
  `.trim(),

  courseConculsion: (courseName: string) => `
Congratulations on completing ${courseName}!

You've made incredible progress and should be proud of what you've accomplished. You now have the skills and knowledge to apply what you've learned in real-world projects.

Remember, learning is a continuous journey. Keep practicing, keep building, and don't be afraid to experiment.

If you enjoyed this course, I'd appreciate if you could leave a review. Your feedback helps other students and helps me improve my teaching.

Thank you for learning with me. I wish you all the best in your future endeavors!
  `.trim(),
}
