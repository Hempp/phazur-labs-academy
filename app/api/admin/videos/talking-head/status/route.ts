import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()

    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // SECURITY: Verify user has admin or instructor role
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || !['admin', 'instructor'].includes(profile.role)) {
      return NextResponse.json(
        { error: 'Forbidden - Admin or instructor access required' },
        { status: 403 }
      )
    }

    // Dynamic import to avoid client-side issues
    const { talkingHeadService } = await import('@/lib/services/talking-head')

    const statuses = await talkingHeadService.checkAllBackends()
    const isAvailable = await talkingHeadService.isAvailable()
    const bestBackend = await talkingHeadService.getBestBackend()

    return NextResponse.json({
      available: isAvailable,
      bestBackend,
      backends: statuses,
      avatars: talkingHeadService.getAvatars(),
    })
  } catch (error) {
    console.error('Talking head status check error:', error)
    return NextResponse.json(
      {
        available: false,
        error: error instanceof Error ? error.message : 'Failed to check status'
      },
      { status: 500 }
    )
  }
}
