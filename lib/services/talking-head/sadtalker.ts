// SadTalker Integration - Audio-driven 3D facial animation
// https://github.com/OpenTalker/SadTalker
// Produces realistic head motion + lip sync from audio + single image

import type { TalkingHeadRequest, TalkingHeadResult, BackendStatus } from './types'

const DEFAULT_SADTALKER_PATH = process.env.SADTALKER_PATH || '~/.local/share/sadtalker'

interface SadTalkerOptions {
  sadtalkerPath?: string
  checkpointPath?: string
  useGpu?: boolean
}

class SadTalkerService {
  private sadtalkerPath: string
  private checkpointPath: string
  private useGpu: boolean

  constructor(options: SadTalkerOptions = {}) {
    this.sadtalkerPath = options.sadtalkerPath || DEFAULT_SADTALKER_PATH
    this.checkpointPath = options.checkpointPath || `${this.sadtalkerPath}/checkpoints`
    this.useGpu = options.useGpu ?? true
  }

  /**
   * Check if SadTalker is properly installed
   */
  async checkStatus(): Promise<BackendStatus> {
    try {
      const { exec } = await import('child_process')
      const { promisify } = await import('util')
      const { access, constants } = await import('fs/promises')
      const execAsync = promisify(exec)

      // Check if Python environment exists
      let pythonPath = 'python3'
      try {
        await execAsync(`${pythonPath} --version`)
      } catch {
        pythonPath = 'python'
        await execAsync(`${pythonPath} --version`)
      }

      // Check if SadTalker directory exists
      const expandedPath = this.sadtalkerPath.replace('~', process.env.HOME || '')
      await access(expandedPath, constants.F_OK)

      // Check for required model files
      const checkpointDir = this.checkpointPath.replace('~', process.env.HOME || '')
      const requiredFiles = [
        'mapping_00109-model.pth.tar',
        'mapping_00229-model.pth.tar',
        'SadTalker_V0.0.2_256.safetensors',
      ]

      let modelsDownloaded = true
      for (const file of requiredFiles) {
        try {
          await access(`${checkpointDir}/${file}`, constants.F_OK)
        } catch {
          modelsDownloaded = false
          break
        }
      }

      // Check GPU availability
      let gpuAvailable = false
      try {
        const { stdout } = await execAsync(
          `${pythonPath} -c "import torch; print(torch.cuda.is_available())"`
        )
        gpuAvailable = stdout.trim() === 'True'
      } catch {
        // CUDA not available
      }

      return {
        installed: true,
        gpuAvailable,
        modelsDownloaded,
        version: '0.0.2',
      }
    } catch (error) {
      return {
        installed: false,
        gpuAvailable: false,
        modelsDownloaded: false,
        error: error instanceof Error ? error.message : 'SadTalker not installed',
      }
    }
  }

  /**
   * Generate talking head video from audio and image
   */
  async generate(
    audioPath: string,
    imagePath: string,
    outputPath: string,
    options: TalkingHeadRequest['options'] = {}
  ): Promise<{ success: boolean; outputPath: string; error?: string }> {
    const { exec } = await import('child_process')
    const { promisify } = await import('util')
    const execAsync = promisify(exec)

    const expandedSadTalkerPath = this.sadtalkerPath.replace('~', process.env.HOME || '')
    const expandedCheckpointPath = this.checkpointPath.replace('~', process.env.HOME || '')

    // Build command arguments
    const args = [
      `--driven_audio "${audioPath}"`,
      `--source_image "${imagePath}"`,
      `--result_dir "${outputPath}"`,
      `--checkpoint_dir "${expandedCheckpointPath}"`,
      `--expression_scale ${options.expressionScale ?? 1.0}`,
      `--pose_style ${options.poseStyle ?? 0}`,
      `--preprocess ${options.preprocess ?? 'crop'}`,
      `--size ${options.resolution ?? '256'}`,
    ]

    if (options.stillMode) {
      args.push('--still')
    }

    if (!this.useGpu) {
      args.push('--device cpu')
    }

    if (options.batchSize) {
      args.push(`--batch_size ${options.batchSize}`)
    }

    const command = `cd "${expandedSadTalkerPath}" && python3 inference.py ${args.join(' ')}`

    try {
      await execAsync(command, { timeout: 600000 }) // 10 minute timeout

      return {
        success: true,
        outputPath,
      }
    } catch (error) {
      return {
        success: false,
        outputPath: '',
        error: error instanceof Error ? error.message : 'SadTalker generation failed',
      }
    }
  }

  /**
   * Full pipeline: TTS audio → SadTalker → final video
   */
  async generateFromScript(request: TalkingHeadRequest): Promise<TalkingHeadResult> {
    const startTime = Date.now()
    const { writeFile, readFile, unlink, mkdir } = await import('fs/promises')
    const { join } = await import('path')
    const { tmpdir } = await import('os')

    // Import Edge TTS service
    const { edgeTTSService } = await import('../edge-tts')

    const tempId = `sadtalker-${Date.now()}`
    const tempDir = join(tmpdir(), tempId)
    await mkdir(tempDir, { recursive: true })

    const audioPath = join(tempDir, 'audio.mp3')
    const outputDir = join(tempDir, 'output')

    try {
      // Step 1: Generate audio with Edge TTS
      const ttsResult = await edgeTTSService.synthesize(request.script, {
        voice: request.voiceId || 'en-US-AriaNeural',
      })

      // Save audio to temp file
      const audioBuffer = Buffer.from(ttsResult.audioBase64, 'base64')
      await writeFile(audioPath, audioBuffer)

      // Step 2: Generate talking head video
      const result = await this.generate(
        audioPath,
        request.avatarImagePath,
        outputDir,
        request.options
      )

      if (!result.success) {
        throw new Error(result.error || 'SadTalker generation failed')
      }

      // Find the generated video file
      const { readdir } = await import('fs/promises')
      const outputFiles = await readdir(outputDir)
      const videoFile = outputFiles.find(f => f.endsWith('.mp4'))

      if (!videoFile) {
        throw new Error('No video file generated')
      }

      const videoPath = join(outputDir, videoFile)
      const videoBuffer = await readFile(videoPath)
      const videoBase64 = videoBuffer.toString('base64')

      return {
        videoPath,
        videoBase64,
        audioPath,
        durationSeconds: ttsResult.durationEstimate,
        backend: 'sadtalker',
        processingTimeMs: Date.now() - startTime,
      }
    } catch (error) {
      // Cleanup on error
      const { rm } = await import('fs/promises')
      await rm(tempDir, { recursive: true, force: true }).catch(() => {})
      throw error
    }
  }
}

export const sadTalkerService = new SadTalkerService()
export { SadTalkerService }
