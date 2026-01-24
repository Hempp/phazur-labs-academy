// Types for talking-head video generation

export type TalkingHeadBackend = 'sadtalker' | 'wav2lip'

export interface TalkingHeadConfig {
  backend: TalkingHeadBackend
  // SadTalker specific
  sadtalkerPath?: string
  // Wav2Lip specific
  wav2lipPath?: string
  // Common
  checkpointPath?: string
  useGpu?: boolean
  tempDir?: string
}

export interface TalkingHeadRequest {
  script: string
  avatarImagePath: string // Path to static avatar image
  voiceId?: string // Edge TTS voice
  backend?: TalkingHeadBackend
  options?: {
    // SadTalker options
    expressionScale?: number // 0-2, default 1.0
    poseStyle?: number // 0-45, different head motion styles
    batchSize?: number // GPU batch size
    preprocess?: 'crop' | 'resize' | 'full'
    stillMode?: boolean // Less head motion
    // Wav2Lip options
    faceDetPads?: [number, number, number, number]
    smooth?: boolean
    // Common
    fps?: number
    resolution?: '256' | '512'
  }
}

export interface TalkingHeadResult {
  videoPath: string
  videoBase64?: string
  audioPath: string
  durationSeconds: number
  backend: TalkingHeadBackend
  processingTimeMs: number
}

export interface TalkingHeadAvatar {
  id: string
  name: string
  imagePath: string
  previewUrl: string
  style: 'professional' | 'casual' | 'friendly'
  gender: 'male' | 'female'
  recommendedVoice: string
}

export interface BackendStatus {
  installed: boolean
  version?: string
  gpuAvailable: boolean
  modelsDownloaded: boolean
  error?: string
}
