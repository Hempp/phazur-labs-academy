// Check Available HeyGen Avatars and Voices
// Usage: npx ts-node scripts/check-heygen-avatars.ts

import { config } from 'dotenv'
config({ path: '.env.local' })

const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY

if (!HEYGEN_API_KEY) {
  console.error('❌ HEYGEN_API_KEY not found in .env.local')
  process.exit(1)
}

async function fetchHeyGen<T>(endpoint: string, version: 'v1' | 'v2' = 'v2'): Promise<T> {
  const url = `https://api.heygen.com/${version}${endpoint}`
  console.log(`  Calling: ${url}`)
  console.log(`  API Key prefix: ${HEYGEN_API_KEY!.substring(0, 20)}...`)

  const response = await fetch(url, {
    headers: {
      'X-API-KEY': HEYGEN_API_KEY!,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(`HeyGen API Error (${response.status}): ${JSON.stringify(error)}`)
  }

  return response.json()
}

async function main() {
  console.log('🎬 Checking HeyGen Available Avatars and Voices\n')
  console.log('='.repeat(60) + '\n')

  try {
    // Check Avatars - try v1 first, then v2
    console.log('📷 AVATARS')
    console.log('-'.repeat(50))

    let avatars: any[] = []
    try {
      console.log('Trying v1 API...')
      const avatarResponse = await fetchHeyGen<{ data: { avatars: any[] } }>('/avatars', 'v1')
      avatars = avatarResponse.data?.avatars || []
    } catch (e) {
      console.log('v1 failed, trying v2...')
      const avatarResponse = await fetchHeyGen<{ data: { avatars: any[] } }>('/avatars', 'v2')
      avatars = avatarResponse.data?.avatars || []
    }

    console.log(`Found ${avatars.length} avatars:\n`)

    // Group by gender for easier viewing
    const maleAvatars = avatars.filter((a: any) => a.gender === 'male')
    const femaleAvatars = avatars.filter((a: any) => a.gender === 'female')

    console.log('👨 Male Avatars:')
    maleAvatars.slice(0, 10).forEach((avatar: any) => {
      console.log(`  • ${avatar.avatar_id}`)
      console.log(`    Name: ${avatar.avatar_name || 'N/A'}`)
      if (avatar.preview_image_url) {
        console.log(`    Preview: ${avatar.preview_image_url.substring(0, 50)}...`)
      }
    })
    if (maleAvatars.length > 10) {
      console.log(`  ... and ${maleAvatars.length - 10} more`)
    }

    console.log('\n👩 Female Avatars:')
    femaleAvatars.slice(0, 10).forEach((avatar: any) => {
      console.log(`  • ${avatar.avatar_id}`)
      console.log(`    Name: ${avatar.avatar_name || 'N/A'}`)
      if (avatar.preview_image_url) {
        console.log(`    Preview: ${avatar.preview_image_url.substring(0, 50)}...`)
      }
    })
    if (femaleAvatars.length > 10) {
      console.log(`  ... and ${femaleAvatars.length - 10} more`)
    }

    // Check Voices
    console.log('\n' + '='.repeat(60))
    console.log('\n🎤 VOICES')
    console.log('-'.repeat(50))

    let voices: any[] = []
    try {
      console.log('Trying v1 API...')
      const voiceResponse = await fetchHeyGen<{ data: { voices: any[] } }>('/voices', 'v1')
      voices = voiceResponse.data?.voices || []
    } catch (e) {
      console.log('v1 failed, trying v2...')
      const voiceResponse = await fetchHeyGen<{ data: { voices: any[] } }>('/voices', 'v2')
      voices = voiceResponse.data?.voices || []
    }

    console.log(`Found ${voices.length} voices:\n`)

    // Filter English voices
    const englishVoices = voices.filter((v: any) =>
      v.language?.toLowerCase().includes('english') ||
      v.language?.toLowerCase() === 'en'
    )

    console.log('🇺🇸 English Voices:')
    englishVoices.slice(0, 15).forEach((voice: any) => {
      console.log(`  • ${voice.voice_id}`)
      console.log(`    Name: ${voice.name || 'N/A'}`)
      console.log(`    Gender: ${voice.gender || 'N/A'}`)
      if (voice.preview_audio_url) {
        console.log(`    Preview: ${voice.preview_audio_url.substring(0, 50)}...`)
      }
    })
    if (englishVoices.length > 15) {
      console.log(`  ... and ${englishVoices.length - 15} more`)
    }

    // Check remaining credits/quota if available
    console.log('\n' + '='.repeat(60))
    console.log('\n📊 ACCOUNT INFO')
    console.log('-'.repeat(50))

    try {
      const userInfo = await fetchHeyGen<{ data: any }>('/user/remaining_quota', 'v1')
      console.log('Remaining Quota:', JSON.stringify(userInfo.data, null, 2))
    } catch (e) {
      console.log('Could not fetch quota info (may not be supported on this plan)')
      console.log('Error:', e instanceof Error ? e.message : e)
    }

    // Output recommended avatars for the academy
    console.log('\n' + '='.repeat(60))
    console.log('\n⭐ RECOMMENDED FOR ACADEMY')
    console.log('-'.repeat(50))

    const recommended = avatars.slice(0, 4)
    console.log('\nTop avatars to use:')
    recommended.forEach((avatar: any, i: number) => {
      console.log(`\n${i + 1}. ${avatar.avatar_id}`)
      console.log(`   Name: ${avatar.avatar_name || 'N/A'}`)
      console.log(`   Gender: ${avatar.gender}`)
    })

    // Save full list to file for reference
    const fs = await import('fs/promises')
    await fs.writeFile(
      '/tmp/heygen-avatars.json',
      JSON.stringify({ avatars, voices: englishVoices }, null, 2)
    )
    console.log('\n✅ Full list saved to /tmp/heygen-avatars.json')

  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : error)
    process.exit(1)
  }
}

main()
