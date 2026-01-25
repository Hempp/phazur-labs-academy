import { config } from 'dotenv'
import { HeyGenService, scriptTemplates } from '../lib/services/heygen'

config({ path: '.env.local' })

async function main() {
  console.log('🎬 Starting HeyGen Video Generation Demo\n')

  // Check API key
  const apiKey = process.env.HEYGEN_API_KEY
  if (!apiKey) {
    console.error('❌ HEYGEN_API_KEY not found in environment variables')
    console.log('\nTo use HeyGen video generation:')
    console.log('1. Sign up at https://heygen.com')
    console.log('2. Get your API key from the dashboard')
    console.log('3. Add HEYGEN_API_KEY to your .env.local file')
    return
  }

  console.log('✅ HeyGen API key found')

  const heygen = new HeyGenService(apiKey)

  // First, let's fetch available avatars and voices
  console.log('\n📋 Fetching available avatars...')

  try {
    const avatars = await heygen.getAvatars()
    console.log(`Found ${avatars.length} avatars`)

    // Show first 5 avatars
    console.log('\nSample avatars:')
    avatars.slice(0, 5).forEach(a => {
      console.log(`  - ${a.avatar_name} (${a.avatar_id}) - ${a.gender}`)
    })

    console.log('\n🎤 Fetching available voices...')
    const voices = await heygen.getVoices()
    console.log(`Found ${voices.length} voices`)

    // Filter for English voices
    const englishVoices = voices.filter(v => v.language.includes('English'))
    console.log(`\nEnglish voices (sample):`)
    englishVoices.slice(0, 5).forEach(v => {
      console.log(`  - ${v.name} (${v.voice_id}) - ${v.gender}`)
    })

    // Generate a demo video
    console.log('\n\n🎬 Generating demo video...')

    // Use first available avatar and a professional voice
    const avatar = avatars[0]
    const voice = englishVoices.find(v => v.gender === avatar.gender) || englishVoices[0]

    const script = scriptTemplates.introduction('Phazur Labs Academy', 'your AI instructor')

    console.log(`\nUsing avatar: ${avatar.avatar_name}`)
    console.log(`Using voice: ${voice.name}`)
    console.log(`Script preview: "${script.substring(0, 100)}..."`)

    const { videoId } = await heygen.generateLessonVideo({
      title: 'Demo - Welcome to Phazur Labs Academy',
      script,
      avatarId: avatar.avatar_id,
      voiceId: voice.voice_id,
      backgroundColor: '#1a1a2e',
      test: true, // Use test mode to avoid charges
    })

    console.log(`\n✅ Video generation started!`)
    console.log(`Video ID: ${videoId}`)

    // Wait for video to complete
    console.log('\n⏳ Waiting for video to complete (this may take 1-3 minutes)...')

    const result = await heygen.waitForVideo(videoId, 180000) // 3 minute timeout

    console.log('\n🎉 Video generation complete!')
    console.log('=' .repeat(60))
    console.log(`📹 Video URL: ${result.videoUrl}`)
    console.log(`🖼️  Thumbnail: ${result.thumbnailUrl}`)
    console.log(`⏱️  Duration: ${result.duration} seconds`)
    console.log('=' .repeat(60))
    console.log('\n✨ Open the Video URL above in your browser to view the video!')

  } catch (error) {
    if (error instanceof Error) {
      console.error('\n❌ Error:', error.message)

      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        console.log('\nYour API key may be invalid. Please check your HEYGEN_API_KEY.')
      } else if (error.message.includes('insufficient')) {
        console.log('\nYour HeyGen account may have insufficient credits.')
        console.log('Visit https://heygen.com to add more credits.')
      }
    } else {
      console.error('\n❌ Unknown error:', error)
    }
  }
}

main()
