// Live Training Detail API
// Get, update, delete individual live trainings and manage registrations

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createServerSupabaseAdmin } from '@/lib/supabase/server'

interface RouteParams {
  params: Promise<{ trainingId: string }>
}

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return !!(
    url && key &&
    !url.includes('placeholder') &&
    !url.includes('your-project') &&
    !key.includes('your-') &&
    key !== 'your-anon-key'
  )
}

// GET: Get live training details
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { trainingId } = await params

    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        training: {
          id: trainingId,
          title: 'React Patterns Deep Dive - Live Q&A',
          description: 'Interactive session covering advanced React patterns.',
          platform: 'zoom',
          meeting_url: 'https://zoom.us/j/123456789',
          scheduled_start: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          scheduled_end: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000).toISOString(),
          status: 'scheduled',
          max_participants: 100,
          registered_count: 45,
          is_registered: false,
          instructor: {
            id: 'instructor-1',
            full_name: 'Sarah Johnson',
            avatar_url: null,
          },
        },
      })
    }

    const supabase = await createServerSupabaseClient()

    const { data: training, error } = await supabase
      .from('live_trainings')
      .select(`
        *,
        instructor:users!live_trainings_instructor_id_fkey (
          id,
          full_name,
          avatar_url,
          bio
        ),
        course:courses (
          id,
          title,
          slug,
          thumbnail_url
        )
      `)
      .eq('id', trainingId)
      .single()

    if (error || !training) {
      return NextResponse.json({ error: 'Training not found' }, { status: 404 })
    }

    // Get registration count
    const { count: registeredCount } = await supabase
      .from('live_training_registrations')
      .select('id', { count: 'exact', head: true })
      .eq('live_training_id', trainingId)

    // Check if current user is registered
    let isRegistered = false
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: registration } = await supabase
        .from('live_training_registrations')
        .select('id')
        .eq('live_training_id', trainingId)
        .eq('user_id', user.id)
        .single()
      isRegistered = !!registration
    }

    return NextResponse.json({
      training: {
        ...training,
        instructor: Array.isArray(training.instructor) ? training.instructor[0] : training.instructor,
        course: Array.isArray(training.course) ? training.course[0] : training.course,
        registered_count: registeredCount || 0,
        is_registered: isRegistered,
      },
    })
  } catch (error) {
    console.error('Live training GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH: Update live training
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { trainingId } = await params
    const supabase = await createServerSupabaseClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify ownership or admin
    const { data: training } = await supabase
      .from('live_trainings')
      .select('instructor_id')
      .eq('id', trainingId)
      .single()

    if (!training) {
      return NextResponse.json({ error: 'Training not found' }, { status: 404 })
    }

    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (training.instructor_id !== user.id && profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const allowedFields = [
      'title', 'description', 'platform', 'meeting_url', 'meeting_id',
      'meeting_password', 'scheduled_start', 'scheduled_end', 'status',
      'max_participants', 'is_recurring', 'recurrence_rule', 'recording_url'
    ]

    const updates: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(body)) {
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
      if (allowedFields.includes(snakeKey)) {
        updates[snakeKey] = value
      }
    }

    const { data: updatedTraining, error: updateError } = await supabase
      .from('live_trainings')
      .update(updates)
      .eq('id', trainingId)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Training updated successfully',
      training: updatedTraining,
    })
  } catch (error) {
    console.error('Live training PATCH error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE: Cancel/delete live training
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { trainingId } = await params
    const supabase = await createServerSupabaseClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify ownership or admin
    const { data: training } = await supabase
      .from('live_trainings')
      .select('instructor_id, status')
      .eq('id', trainingId)
      .single()

    if (!training) {
      return NextResponse.json({ error: 'Training not found' }, { status: 404 })
    }

    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (training.instructor_id !== user.id && profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Instead of deleting, mark as cancelled
    const { error: updateError } = await supabase
      .from('live_trainings')
      .update({ status: 'cancelled' })
      .eq('id', trainingId)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Training cancelled successfully',
    })
  } catch (error) {
    console.error('Live training DELETE error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST: Register/unregister for training
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { trainingId } = await params
    const supabase = await createServerSupabaseClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { action } = body // 'register' or 'unregister'

    // Get training details
    const { data: training } = await supabase
      .from('live_trainings')
      .select('id, status, max_participants, scheduled_start')
      .eq('id', trainingId)
      .single()

    if (!training) {
      return NextResponse.json({ error: 'Training not found' }, { status: 404 })
    }

    if (training.status !== 'scheduled') {
      return NextResponse.json(
        { error: 'Cannot register for this training' },
        { status: 400 }
      )
    }

    if (action === 'register') {
      // Check capacity
      const { count: currentRegistrations } = await supabase
        .from('live_training_registrations')
        .select('id', { count: 'exact', head: true })
        .eq('live_training_id', trainingId)

      if (training.max_participants && (currentRegistrations || 0) >= training.max_participants) {
        return NextResponse.json(
          { error: 'Training is at full capacity' },
          { status: 400 }
        )
      }

      // Register user
      const { error: insertError } = await supabase
        .from('live_training_registrations')
        .insert({
          live_training_id: trainingId,
          user_id: user.id,
        })

      if (insertError) {
        if (insertError.code === '23505') {
          return NextResponse.json(
            { error: 'Already registered for this training' },
            { status: 400 }
          )
        }
        return NextResponse.json({ error: insertError.message }, { status: 500 })
      }

      return NextResponse.json({
        message: 'Successfully registered for training',
        registered: true,
      })
    } else if (action === 'unregister') {
      const { error: deleteError } = await supabase
        .from('live_training_registrations')
        .delete()
        .eq('live_training_id', trainingId)
        .eq('user_id', user.id)

      if (deleteError) {
        return NextResponse.json({ error: deleteError.message }, { status: 500 })
      }

      return NextResponse.json({
        message: 'Successfully unregistered from training',
        registered: false,
      })
    }

    return NextResponse.json(
      { error: 'Invalid action. Use "register" or "unregister"' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Live training registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
