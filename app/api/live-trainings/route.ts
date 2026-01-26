// Live Trainings API
// List and create live training sessions

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createServerSupabaseAdmin } from '@/lib/supabase/server'

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

// Mock live trainings for development
const mockLiveTrainings = [
  {
    id: 'lt-1',
    title: 'React Patterns Deep Dive - Live Q&A',
    description: 'Interactive session covering advanced React patterns with live coding examples.',
    instructor: {
      id: 'instructor-1',
      full_name: 'Sarah Johnson',
      avatar_url: null,
    },
    course: {
      id: 'course-1',
      title: 'Advanced React Patterns',
    },
    platform: 'zoom',
    meeting_url: 'https://zoom.us/j/123456789',
    scheduled_start: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    scheduled_end: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000).toISOString(),
    status: 'scheduled',
    max_participants: 100,
    registered_count: 45,
    is_recurring: false,
  },
  {
    id: 'lt-2',
    title: 'TypeScript Best Practices Workshop',
    description: 'Hands-on workshop covering TypeScript patterns for large-scale applications.',
    instructor: {
      id: 'instructor-2',
      full_name: 'Michael Chen',
      avatar_url: null,
    },
    course: {
      id: 'course-2',
      title: 'TypeScript Mastery',
    },
    platform: 'google_meet',
    meeting_url: 'https://meet.google.com/abc-defg-hij',
    scheduled_start: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    scheduled_end: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 120 * 60 * 1000).toISOString(),
    status: 'scheduled',
    max_participants: 50,
    registered_count: 32,
    is_recurring: true,
    recurrence_rule: 'WEEKLY',
  },
]

// GET: List live trainings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')
    const status = searchParams.get('status')
    const upcoming = searchParams.get('upcoming') === 'true'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    // Return mock data if Supabase is not configured
    if (!isSupabaseConfigured()) {
      let filtered = [...mockLiveTrainings]

      if (status) {
        filtered = filtered.filter(t => t.status === status)
      }

      if (upcoming) {
        filtered = filtered.filter(t => new Date(t.scheduled_start) > new Date())
      }

      return NextResponse.json({
        trainings: filtered,
        pagination: {
          page: 1,
          limit: 20,
          total: filtered.length,
          totalPages: 1,
        },
      })
    }

    const supabase = await createServerSupabaseClient()

    let query = supabase
      .from('live_trainings')
      .select(`
        id,
        title,
        description,
        platform,
        meeting_url,
        scheduled_start,
        scheduled_end,
        status,
        max_participants,
        is_recurring,
        recurrence_rule,
        created_at,
        instructor:users!live_trainings_instructor_id_fkey (
          id,
          full_name,
          avatar_url
        ),
        course:courses (
          id,
          title,
          slug
        )
      `, { count: 'exact' })
      .neq('status', 'cancelled')
      .order('scheduled_start', { ascending: true })
      .range((page - 1) * limit, page * limit - 1)

    if (courseId) {
      query = query.eq('course_id', courseId)
    }

    if (status) {
      query = query.eq('status', status)
    }

    if (upcoming) {
      query = query.gte('scheduled_start', new Date().toISOString())
    }

    const { data: trainings, error, count } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Get registration counts for each training
    const trainingIds = (trainings || []).map(t => t.id)
    const registrationCounts: Record<string, number> = {}

    if (trainingIds.length > 0) {
      const { data: registrations } = await supabase
        .from('live_training_registrations')
        .select('live_training_id')
        .in('live_training_id', trainingIds)

      for (const reg of registrations || []) {
        registrationCounts[reg.live_training_id] = (registrationCounts[reg.live_training_id] || 0) + 1
      }
    }

    // Format response
    const formattedTrainings = (trainings || []).map(t => ({
      ...t,
      instructor: Array.isArray(t.instructor) ? t.instructor[0] : t.instructor,
      course: Array.isArray(t.course) ? t.course[0] : t.course,
      registered_count: registrationCounts[t.id] || 0,
    }))

    return NextResponse.json({
      trainings: formattedTrainings,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error('Live trainings GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST: Create a new live training
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is instructor or admin
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || !['instructor', 'admin'].includes(profile.role)) {
      return NextResponse.json(
        { error: 'Only instructors and admins can create live trainings' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      title,
      description,
      courseId,
      platform,
      meetingUrl,
      meetingId,
      meetingPassword,
      scheduledStart,
      scheduledEnd,
      maxParticipants,
      isRecurring,
      recurrenceRule,
    } = body

    if (!title || !platform || !meetingUrl || !scheduledStart || !scheduledEnd) {
      return NextResponse.json(
        { error: 'title, platform, meetingUrl, scheduledStart, and scheduledEnd are required' },
        { status: 400 }
      )
    }

    // Create training
    const { data: training, error: insertError } = await supabase
      .from('live_trainings')
      .insert({
        title,
        description: description || null,
        course_id: courseId || null,
        instructor_id: user.id,
        platform,
        meeting_url: meetingUrl,
        meeting_id: meetingId || null,
        meeting_password: meetingPassword || null,
        scheduled_start: scheduledStart,
        scheduled_end: scheduledEnd,
        max_participants: maxParticipants || 100,
        is_recurring: isRecurring || false,
        recurrence_rule: recurrenceRule || null,
      })
      .select(`
        *,
        instructor:users!live_trainings_instructor_id_fkey (
          id,
          full_name,
          avatar_url
        ),
        course:courses (
          id,
          title,
          slug
        )
      `)
      .single()

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Live training created successfully',
      training: {
        ...training,
        instructor: Array.isArray(training?.instructor) ? training.instructor[0] : training?.instructor,
        course: Array.isArray(training?.course) ? training.course[0] : training?.course,
        registered_count: 0,
      },
    })
  } catch (error) {
    console.error('Live trainings POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
