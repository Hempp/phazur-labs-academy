// Wav2Lip Integration - Accurate lip synchronization
// https://github.com/Rudrabha/Wav2Lip
// Fast, accurate lip-sync that works with images or videos

import type { TalkingHeadRequest, TalkingHeadResult, BackendStatus } from './types'

const DEFAULT_WAV2LIP_PATH = process.env.WAV2LIP_PATH || '~/.local/share/wav2lip'

interface Wav2LipOptions {
  wav2lipPath?: string
  checkpointPath?: string
  useGpu?: boolean
}

class Wav2LipService {
  private wav2lipPath: string
  private checkpointPath: string
  private useGpu: boolean

  constructor(options: Wav2LipOptions = {}) {
    this.wav2lipPath = options.wav2lipPath || DEFAULT_WAV2LIP_PATH
    this.checkpointPath = options.checkpointPath || `${this.wav2lipPath}/checkpoints`
    this.useGpu = options.useGpu ?? true
  }

  /**
   * Check if Wav2Lip is properly installed
   */
  async checkStatus(): Promise<BackendStatus> {
    try {
      const { exec } = await import('child_process')
      const { promisify } = await import('util')
      const { access, constants } = await import('fs/promises')
      const execAsync = promisify(exec)

      // Check Python
      let pythonPath = 'python3'
      try {
        await execAsync(`${pythonPath} --version`)
      } catch {
        pythonPath = 'python'
        await execAsync(`${pythonPath} --version`)
      }

      // Check Wav2Lip directory
      const expandedPath = this.wav2lipPath.replace('~', process.env.HOME || '')
      await access(expandedPath, constants.F_OK)

      // Check for model files
      const checkpointDir = this.checkpointPath.replace('~', process.env.HOME || '')
      const requiredFiles = [
        'wav2lip.pth',           // Main lip-sync model
        'wav2lip_gan.pth',       // GAN version (better quality)
      ]

      let modelsDownloaded = false
      for (const file of requiredFiles) {
        try {
          await access(`${checkpointDir}/${file}`, constants.F_OK)
          modelsDownloaded = true
          break // At least one model exists
        } catch {
          // Continue checking
        }
      }

      // Check GPU
      let gpuAvailable = false
      try {
        const { stdout } = await execAsync(
          `${pythonPath} -c "import torch; print(torch.cuda.is_available())"`
        )
        gpuAvailable = stdout.trim() === 'True'
      } catch {
        // No CUDA
      }

      return {
        installed: true,
        gpuAvailable,
        modelsDownloaded,
        version: '1.0',
      }
    } catch (error) {
      return {
        installed: false,
        gpuAvailable: false,
        modelsDownloaded: false,
        error: error instanceof Error ? error.message : 'Wav2Lip not installed',
      }
    }
  }

  /**
   * Generate lip-synced video from audio and face image/video
   */
  async generate(
    audioPath: string,
    facePath: string, // Image or video
    outputPath: string,
    options: TalkingHeadRequest['options'] = {}
  ): Promise<{ success: boolean; outputPath: string; error?: string }> {
    const { exec } = await import('child_process')
    const { promisify } = await import('util')
    const execAsync = promisify(exec)

    const expandedWav2LipPath = this.wav2lipPath.replace('~', process.env.HOME || '')
    const expandedCheckpointPath = this.checkpointPath.replace('~', process.env.HOME || '')

    // Determine which model to use (GAN version is higher quality)
    const { access, constants } = await import('fs/promises')
    let modelPath = `${expandedCheckpointPath}/wav2lip_gan.pth`
    try {
      await access(modelPath, constants.F_OK)
    } catch {
      modelPath = `${expandedCheckpointPath}/wav2lip.pth`
    }

    // Build command arguments
    const args = [
      `--checkpoint_path "${modelPath}"`,
      `--face "${facePath}"`,
      `--audio "${audioPath}"`,
      `--outfile "${outputPath}"`,
    ]

    // Face detection padding [top, bottom, left, right]
    if (options.faceDetPads) {
      const [top, bottom, left, right] = options.faceDetPads
      args.push(`--pads ${top} ${bottom} ${left} ${right}`)
    }

    if (options.smooth) {
      args.push('--nosmooth false')
    } else {
      args.push('--nosmooth')
    }

    if (options.resolution === '512') {
      args.push('--resize_factor 2')
    }

    const command = `cd "${expandedWav2LipPath}" && python3 inference.py ${args.join(' ')}`

    try {
      await execAsync(command, { timeout: 300000 }) // 5 minute timeout

      return {
        success: true,
        outputPath,
      }
    } catch (error) {
      return {
        success: false,
        outputPath: '',
        error: error instanceof Error ? error.message : 'Wav2Lip generation failed',
      }
    }
  }

  /**
   * Full pipeline: TTS audio → Wav2Lip → final video
   * Note: Wav2Lip works best with a video input for natural head motion
   * For static images, consider using SadTalker instead
   */
  async generateFromScript(request: TalkingHeadRequest): Promise<TalkingHeadResult> {
    const startTime = Date.now()
    const { writeFile, readFile, mkdir } = await import('fs/promises')
    const { join } = await import('path')
    const { tmpdir } = await import('os')

    // Import Edge TTS service
    const { edgeTTSService } = await import('../edge-tts')

    const tempId = `wav2lip-${Date.now()}`
    const tempDir = join(tmpdir(), tempId)
    await mkdir(tempDir, { recursive: true })

    const audioPath = join(tempDir, 'audio.mp3')
    const outputPath = join(tempDir, 'output.mp4')

    try {
      // Step 1: Generate audio with Edge TTS
      const ttsResult = await edgeTTSService.synthesize(request.script, {
        voice: request.voiceId || 'en-US-AriaNeural',
      })

      // Save audio to temp file
      const audioBuffer = Buffer.from(ttsResult.audioBase64, 'base64')
      await writeFile(audioPath, audioBuffer)

      // Step 2: Generate lip-synced video
      const result = await this.generate(
        audioPath,
        request.avatarImagePath,
        outputPath,
        request.options
      )

      if (!result.success) {
        throw new Error(result.error || 'Wav2Lip generation failed')
      }

      const videoBuffer = await readFile(outputPath)
      const videoBase64 = videoBuffer.toString('base64')

      return {
        videoPath: outputPath,
        videoBase64,
        audioPath,
        durationSeconds: ttsResult.durationEstimate,
        backend: 'wav2lip',
        processingTimeMs: Date.now() - startTime,
      }
    } catch (error) {
      // Cleanup on error
      const { rm } = await import('fs/promises')
      await rm(tempDir, { recursive: true, force: true }).catch(() => {})
      throw error
    }
  }

  /**
   * Create a simple looping video from static image for Wav2Lip input
   * This gives Wav2Lip a video to work with instead of a static image
   */
  async createLoopingVideo(
    imagePath: string,
    durationSeconds: number,
    outputPath: string
  ): Promise<void> {
    const { exec } = await import('child_process')
    const { promisify } = await import('util')
    const execAsync = promisify(exec)

    // Use FFmpeg to create a video from static image with subtle motion
    await execAsync(
      `ffmpeg -loop 1 -i "${imagePath}" -c:v libx264 -t ${durationSeconds} ` +
      `-pix_fmt yuv420p -vf "scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2" ` +
      `-y "${outputPath}"`,
      { timeout: 60000 }
    )
  }
}

export const wav2LipService = new Wav2LipService()
export { Wav2LipService }
