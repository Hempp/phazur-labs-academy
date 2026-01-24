// Talking Head Service - Unified interface for AI avatar video generation
// Supports multiple backends: SadTalker (full motion) and Wav2Lip (lip-sync only)

import { sadTalkerService, SadTalkerService } from './sadtalker'
import { wav2LipService, Wav2LipService } from './wav2lip'
import type {
  TalkingHeadBackend,
  TalkingHeadConfig,
  TalkingHeadRequest,
  TalkingHeadResult,
  TalkingHeadAvatar,
  BackendStatus,
} from './types'

// Re-export types
export * from './types'

// Default avatars for talking head generation
export const talkingHeadAvatars: TalkingHeadAvatar[] = [
  {
    id: 'professional-female-1',
    name: 'Sarah - Professional',
    imagePath: '/avatars/talking-head/sarah.jpg',
    previewUrl: '/avatars/talking-head/sarah-preview.jpg',
    style: 'professional',
    gender: 'female',
    recommendedVoice: 'en-US-AriaNeural',
  },
  {
    id: 'professional-male-1',
    name: 'James - Professional',
    imagePath: '/avatars/talking-head/james.jpg',
    previewUrl: '/avatars/talking-head/james-preview.jpg',
    style: 'professional',
    gender: 'male',
    recommendedVoice: 'en-US-GuyNeural',
  },
  {
    id: 'casual-female-1',
    name: 'Maya - Casual',
    imagePath: '/avatars/talking-head/maya.jpg',
    previewUrl: '/avatars/talking-head/maya-preview.jpg',
    style: 'casual',
    gender: 'female',
    recommendedVoice: 'en-US-JennyNeural',
  },
  {
    id: 'friendly-male-1',
    name: 'Alex - Friendly',
    imagePath: '/avatars/talking-head/alex.jpg',
    previewUrl: '/avatars/talking-head/alex-preview.jpg',
    style: 'friendly',
    gender: 'male',
    recommendedVoice: 'en-US-ChristopherNeural',
  },
]

class TalkingHeadService {
  private config: TalkingHeadConfig
  private sadTalker: SadTalkerService
  private wav2Lip: Wav2LipService

  constructor(config: Partial<TalkingHeadConfig> = {}) {
    this.config = {
      backend: config.backend || 'sadtalker',
      useGpu: config.useGpu ?? true,
      ...config,
    }

    this.sadTalker = new SadTalkerService({
      sadtalkerPath: config.sadtalkerPath,
      checkpointPath: config.checkpointPath,
      useGpu: config.useGpu,
    })

    this.wav2Lip = new Wav2LipService({
      wav2lipPath: config.wav2lipPath,
      checkpointPath: config.checkpointPath,
      useGpu: config.useGpu,
    })
  }

  /**
   * Check status of all backends
   */
  async checkAllBackends(): Promise<Record<TalkingHeadBackend, BackendStatus>> {
    const [sadTalkerStatus, wav2LipStatus] = await Promise.all([
      this.sadTalker.checkStatus(),
      this.wav2Lip.checkStatus(),
    ])

    return {
      sadtalker: sadTalkerStatus,
      wav2lip: wav2LipStatus,
    }
  }

  /**
   * Check if any backend is available
   */
  async isAvailable(): Promise<boolean> {
    const statuses = await this.checkAllBackends()
    return (
      (statuses.sadtalker.installed && statuses.sadtalker.modelsDownloaded) ||
      (statuses.wav2lip.installed && statuses.wav2lip.modelsDownloaded)
    )
  }

  /**
   * Get the best available backend
   */
  async getBestBackend(): Promise<TalkingHeadBackend | null> {
    const statuses = await this.checkAllBackends()

    // Prefer SadTalker for better quality with static images
    if (statuses.sadtalker.installed && statuses.sadtalker.modelsDownloaded) {
      return 'sadtalker'
    }

    if (statuses.wav2lip.installed && statuses.wav2lip.modelsDownloaded) {
      return 'wav2lip'
    }

    return null
  }

  /**
   * Generate talking head video
   */
  async generate(request: TalkingHeadRequest): Promise<TalkingHeadResult> {
    const backend = request.backend || this.config.backend

    // Verify backend is available
    const statuses = await this.checkAllBackends()
    const status = statuses[backend]

    if (!status.installed) {
      throw new Error(`${backend} is not installed. Run the setup script first.`)
    }

    if (!status.modelsDownloaded) {
      throw new Error(`${backend} models are not downloaded. Run the setup script first.`)
    }

    // Generate using selected backend
    if (backend === 'sadtalker') {
      return this.sadTalker.generateFromScript(request)
    } else {
      return this.wav2Lip.generateFromScript(request)
    }
  }

  /**
   * Generate with automatic backend selection
   */
  async generateAuto(request: Omit<TalkingHeadRequest, 'backend'>): Promise<TalkingHeadResult> {
    const bestBackend = await this.getBestBackend()

    if (!bestBackend) {
      throw new Error(
        'No talking head backend is available. Install SadTalker or Wav2Lip first.'
      )
    }

    return this.generate({
      ...request,
      backend: bestBackend,
    })
  }

  /**
   * Get available avatars
   */
  getAvatars(): TalkingHeadAvatar[] {
    return talkingHeadAvatars
  }

  /**
   * Get avatar by ID
   */
  getAvatar(id: string): TalkingHeadAvatar | undefined {
    return talkingHeadAvatars.find(a => a.id === id)
  }

  /**
   * Estimate processing time based on script length and backend
   */
  estimateProcessingTime(
    script: string,
    backend: TalkingHeadBackend = 'sadtalker',
    useGpu: boolean = true
  ): { seconds: number; description: string } {
    const wordCount = script.split(/\s+/).length
    const audioSeconds = Math.ceil(wordCount / 2.5) // ~150 wpm

    // Processing time estimates (rough)
    let multiplier: number
    if (backend === 'sadtalker') {
      multiplier = useGpu ? 2 : 15 // 2x realtime GPU, 15x CPU
    } else {
      multiplier = useGpu ? 1.5 : 10 // Wav2Lip is slightly faster
    }

    const processingSeconds = Math.ceil(audioSeconds * multiplier)

    return {
      seconds: processingSeconds,
      description: useGpu
        ? `~${processingSeconds} seconds with GPU`
        : `~${Math.ceil(processingSeconds / 60)} minutes without GPU`,
    }
  }
}

// Export singleton instance with default config
export const talkingHeadService = new TalkingHeadService()

// Export class for custom instances
export { TalkingHeadService }

// Export individual backend services
export { sadTalkerService, SadTalkerService }
export { wav2LipService, Wav2LipService }
