import { config } from 'dotenv'
import { execFileSync, spawn } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'

config({ path: '.env.local' })

const EDGE_TTS_PATH = '/Users/seg/Library/Python/3.9/bin/edge-tts'

async function main() {
  console.log('🎬 Starting Draft Video Generation (Free - Edge TTS)\n')

  // Check edge-tts
  if (!fs.existsSync(EDGE_TTS_PATH)) {
    console.error('❌ edge-tts not found at:', EDGE_TTS_PATH)
    console.log('\nInstall with: pip3 install edge-tts')
    return
  }

  console.log('✅ edge-tts found')

  // List available voices
  console.log('\n🎤 Fetching available voices...')

  try {
    const voicesOutput = execFileSync(EDGE_TTS_PATH, ['--list-voices'], { encoding: 'utf-8' })
    const lines = voicesOutput.split('\n').filter(l => l.includes('en-US'))

    console.log(`Found ${lines.length} US English voices:\n`)

    // Parse and show voices
    const voices: { name: string; gender: string }[] = []
    lines.forEach(line => {
      const match = line.match(/Name:\s+(\S+)/)
      if (match) {
        const name = match[1]
        const genderMatch = line.match(/Gender:\s+(\S+)/)
        const gender = genderMatch ? genderMatch[1] : 'Unknown'
        voices.push({ name, gender })
      }
    })

    voices.slice(0, 8).forEach(v => {
      console.log(`  - ${v.name} (${v.gender})`)
    })

    // Generate audio for a demo script
    console.log('\n\n🎬 Generating demo audio...')

    const script = `Hello and welcome to Phazur Labs Academy! I'm your AI instructor, and I'll be guiding you through this learning journey. In this course, you'll gain practical skills and knowledge that you can apply immediately in your work. Let's get started!`

    const voice = 'en-US-GuyNeural' // Professional male voice
    console.log(`Using voice: ${voice}`)
    console.log(`Script: "${script.substring(0, 80)}..."`)

    const tempDir = os.tmpdir()
    const outputPath = path.join(tempDir, 'demo-audio.mp3')

    // Generate audio using execFileSync for safety
    console.log('\n⏳ Generating audio...')

    execFileSync(EDGE_TTS_PATH, [
      '--voice', voice,
      '--text', script,
      '--write-media', outputPath
    ], { encoding: 'utf-8', stdio: 'pipe' })

    // Check if file was created
    if (fs.existsSync(outputPath)) {
      const stats = fs.statSync(outputPath)
      console.log('\n🎉 Audio generation complete!')
      console.log('='.repeat(60))
      console.log(`📁 Audio file: ${outputPath}`)
      console.log(`📏 File size: ${(stats.size / 1024).toFixed(2)} KB`)
      console.log('='.repeat(60))

      // Copy to project for easy access
      const publicDir = path.join(process.cwd(), 'public')
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true })
      }
      const projectOutput = path.join(publicDir, 'demo-audio.mp3')
      fs.copyFileSync(outputPath, projectOutput)
      console.log(`\n📋 Copied to: ${projectOutput}`)
      console.log(`🌐 Access at: http://localhost:3000/demo-audio.mp3`)

      // Play the audio (macOS)
      console.log('\n🔊 Playing audio...')
      const player = spawn('afplay', [outputPath])
      player.on('close', () => {
        console.log('✅ Playback complete')
      })
    } else {
      console.error('❌ Audio file not created')
    }

  } catch (error) {
    console.error('\n❌ Error:', error instanceof Error ? error.message : error)
  }
}

main()
