// Edge TTS Service - Free Microsoft Text-to-Speech
// No API key required, high-quality neural voices
// NOTE: This file uses Node.js modules and can only be imported in server-side code

import { edgeVoices, type EdgeVoice } from './edge-tts-config'

// Re-export for convenience
export { edgeVoices, type EdgeVoice }

export interface TTSOptions {
  voice?: string
  rate?: string // e.g., '+10%', '-20%', default '0%'
  pitch?: string // e.g., '+5Hz', '-10Hz', default '0Hz'
  volume?: string // e.g., '+10%', '-20%', default '0%'
}

class EdgeTTSService {
  private baseUrl = 'https://speech.platform.bing.com'
  private wsUrl = 'wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1'

  /**
   * Generate speech audio from text using Edge TTS
   * Returns base64 encoded audio data
   */
  async synthesize(text: string, options: TTSOptions = {}): Promise<{
    audioBase64: string
    audioFormat: string
    durationEstimate: number
  }> {
    const voice = options.voice || 'en-US-AriaNeural'
    const rate = options.rate || '0%'
    const pitch = options.pitch || '0Hz'
    const volume = options.volume || '0%'

    // Build SSML
    const ssml = `
      <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
        <voice name="${voice}">
          <prosody rate="${rate}" pitch="${pitch}" volume="${volume}">
            ${this.escapeXml(text)}
          </prosody>
        </voice>
      </speak>
    `.trim()

    // Use edge-tts npm package or fallback to API
    try {
      const audioData = await this.callEdgeTTS(ssml, voice)
      const wordCount = text.split(/\s+/).length
      const durationEstimate = Math.ceil(wordCount / 2.5) // ~150 words per minute

      return {
        audioBase64: audioData,
        audioFormat: 'audio/mp3',
        durationEstimate,
      }
    } catch (error) {
      console.error('Edge TTS error:', error)
      throw new Error('Failed to generate speech audio')
    }
  }

  /**
   * Call Edge TTS service
   */
  private async callEdgeTTS(ssml: string, voice: string): Promise<string> {
    // Dynamic import for edge-tts
    try {
      const { exec } = await import('child_process')
      const { promisify } = await import('util')
      const { writeFile, readFile, unlink } = await import('fs/promises')
      const { join } = await import('path')
      const { tmpdir } = await import('os')
      const execAsync = promisify(exec)

      // Create temp file paths
      const tempId = Date.now().toString()
      const textFile = join(tmpdir(), `tts-${tempId}.txt`)
      const audioFile = join(tmpdir(), `tts-${tempId}.mp3`)

      // Extract plain text from SSML for simpler processing
      const plainText = ssml
        .replace(/<[^>]+>/g, '')
        .replace(/\s+/g, ' ')
        .trim()

      // Write text to temp file
      await writeFile(textFile, plainText)

      // Use edge-tts CLI (pip install edge-tts)
      // Check common installation paths for edge-tts
      const edgeTTSPaths = [
        '/Users/seg/Library/Python/3.9/bin/edge-tts', // User Python installation
        '/opt/homebrew/bin/edge-tts', // Homebrew
        '/usr/local/bin/edge-tts', // System-wide
        'edge-tts', // PATH fallback
      ]

      let edgeTTSCmd = 'edge-tts'
      for (const path of edgeTTSPaths) {
        try {
          const { existsSync } = await import('fs')
          if (path === 'edge-tts' || existsSync(path)) {
            edgeTTSCmd = path
            break
          }
        } catch {
          continue
        }
      }

      try {
        await execAsync(
          `"${edgeTTSCmd}" --voice "${voice}" --file "${textFile}" --write-media "${audioFile}"`,
          { timeout: 120000 }
        )

        // Read the generated audio
        const audioBuffer = await readFile(audioFile)
        const audioBase64 = audioBuffer.toString('base64')

        // Cleanup temp files
        await unlink(textFile).catch(() => {})
        await unlink(audioFile).catch(() => {})

        return audioBase64
      } catch (cliError) {
        // Cleanup on error
        await unlink(textFile).catch(() => {})
        await unlink(audioFile).catch(() => {})
        throw cliError
      }
    } catch (error) {
      // Fallback: return empty audio indicator
      console.error('Edge TTS CLI not available:', error)
      throw new Error(
        'Edge TTS requires the edge-tts Python package. Install with: pip install edge-tts'
      )
    }
  }

  private escapeXml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')
  }

  /**
   * Get available voices
   */
  getVoices(): EdgeVoice[] {
    return edgeVoices
  }

  /**
   * Get voice by ID
   */
  getVoice(id: string): EdgeVoice | undefined {
    return edgeVoices.find(v => v.id === id)
  }
}

export const edgeTTSService = new EdgeTTSService()
export { EdgeTTSService }
