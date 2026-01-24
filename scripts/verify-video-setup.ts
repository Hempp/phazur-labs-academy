#!/usr/bin/env npx ts-node
/**
 * Phazur Labs Academy - Video System Setup Verification
 *
 * Run with: npx tsx scripts/verify-video-setup.ts
 * Or: npm run verify:video-setup
 */

import { readFileSync } from 'fs'
import { resolve } from 'path'

// Load environment variables from .env.local
function loadEnvFile(): void {
  try {
    const envPath = resolve(process.cwd(), '.env.local')
    const envContent = readFileSync(envPath, 'utf-8')
    for (const line of envContent.split('\n')) {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=')
        if (key && valueParts.length > 0) {
          process.env[key.trim()] = valueParts.join('=').trim()
        }
      }
    }
  } catch {
    console.log('Note: Could not read .env.local file')
  }
}

loadEnvFile()

interface CheckResult {
  name: string
  status: 'pass' | 'fail' | 'warn'
  message: string
  action?: string
}

const checks: CheckResult[] = []

function check(name: string, condition: boolean, failMessage: string, action?: string): void {
  checks.push({
    name,
    status: condition ? 'pass' : 'fail',
    message: condition ? '✓ Configured' : failMessage,
    action: condition ? undefined : action,
  })
}

function warn(name: string, condition: boolean, warnMessage: string, action?: string): void {
  checks.push({
    name,
    status: condition ? 'pass' : 'warn',
    message: condition ? '✓ Configured' : warnMessage,
    action: condition ? undefined : action,
  })
}

async function verifySupabase(): Promise<void> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  check(
    'Supabase URL',
    !!url && !url.includes('your-project'),
    'Supabase URL not configured',
    'Set NEXT_PUBLIC_SUPABASE_URL in .env.local'
  )

  check(
    'Supabase Anon Key',
    !!anonKey && anonKey !== 'your-anon-key',
    'Supabase Anon Key not configured',
    'Set NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local'
  )

  warn(
    'Supabase Service Role Key',
    !!serviceKey && serviceKey !== 'your-service-role-key',
    'Service Role Key not set (needed for video uploads to storage)',
    'Set SUPABASE_SERVICE_ROLE_KEY in .env.local for admin operations'
  )
}

async function verifyHeyGen(): Promise<void> {
  const apiKey = process.env.HEYGEN_API_KEY

  check(
    'HeyGen API Key',
    !!apiKey && apiKey !== 'your-heygen-api-key',
    'HeyGen API Key not configured',
    'Get your API key from https://app.heygen.com/settings?nav=API'
  )

  // Try to validate the key if it exists
  if (apiKey && apiKey !== 'your-heygen-api-key') {
    try {
      // Use v2 API endpoint (consistent with lib/services/heygen.ts)
      const response = await fetch('https://api.heygen.com/v2/avatars', {
        method: 'GET',
        headers: {
          'X-Api-Key': apiKey,
          'Content-Type': 'application/json',
        },
      })

      check(
        'HeyGen API Connection',
        response.ok,
        `HeyGen API returned ${response.status}`,
        'Verify your API key is correct and has sufficient credits'
      )
    } catch (error) {
      check(
        'HeyGen API Connection',
        false,
        'Could not connect to HeyGen API',
        'Check your network connection'
      )
    }
  }
}

async function verifyDatabase(): Promise<void> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || url.includes('your-project') || !anonKey || anonKey === 'your-anon-key') {
    checks.push({
      name: 'Database Connection',
      status: 'warn',
      message: 'Skipped - Supabase not configured',
    })
    return
  }

  try {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(url, anonKey)

    // Test connection
    const { error } = await supabase.from('video_generations').select('id').limit(1)

    if (error?.code === '42P01') {
      // Table doesn't exist
      check(
        'video_generations Table',
        false,
        'Table does not exist',
        'Run: supabase db push (or apply migrations in Supabase Dashboard)'
      )
    } else if (error) {
      check(
        'Database Connection',
        false,
        `Database error: ${error.message}`,
        'Check your Supabase configuration'
      )
    } else {
      check('video_generations Table', true, '', '')
    }

    // Check storage buckets (requires service role key for listing)
    const adminClient = serviceKey ? createClient(url, serviceKey) : supabase
    const { data: buckets } = await adminClient.storage.listBuckets()
    const hasCourseVideos = buckets?.some(b => b.name === 'course-videos')

    check(
      'course-videos Storage Bucket',
      !!hasCourseVideos,
      'Storage bucket not created',
      'Apply the storage_buckets migration in Supabase Dashboard'
    )
  } catch (error) {
    checks.push({
      name: 'Database Connection',
      status: 'fail',
      message: 'Could not connect to database',
      action: 'Check your Supabase credentials',
    })
  }
}

async function main(): Promise<void> {
  console.log('\n🎬 Phazur Labs Academy - Video System Verification\n')
  console.log('=' .repeat(60))

  await verifySupabase()
  await verifyHeyGen()
  await verifyDatabase()

  console.log('\n📋 Configuration Status:\n')

  const maxNameLength = Math.max(...checks.map(c => c.name.length))

  for (const check of checks) {
    const icon = check.status === 'pass' ? '✅' : check.status === 'warn' ? '⚠️' : '❌'
    const padding = ' '.repeat(maxNameLength - check.name.length)
    console.log(`  ${icon} ${check.name}${padding}  ${check.message}`)
    if (check.action) {
      console.log(`     └─ Action: ${check.action}`)
    }
  }

  const passed = checks.filter(c => c.status === 'pass').length
  const warnings = checks.filter(c => c.status === 'warn').length
  const failed = checks.filter(c => c.status === 'fail').length

  console.log('\n' + '=' .repeat(60))
  console.log(`\n📊 Summary: ${passed} passed, ${warnings} warnings, ${failed} failed\n`)

  if (failed > 0) {
    console.log('❌ Some required configurations are missing.')
    console.log('   Please fix the issues above before using the Video Studio.\n')
    process.exit(1)
  } else if (warnings > 0) {
    console.log('⚠️  System is partially configured.')
    console.log('   Some features may not work until warnings are resolved.\n')
  } else {
    console.log('✅ All systems ready! You can now use the Video Studio.\n')
    console.log('   Access it at: /admin/videos\n')
  }
}

main().catch(console.error)
