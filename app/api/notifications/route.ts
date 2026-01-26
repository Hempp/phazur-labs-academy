// Notifications API
// Get and manage user notifications

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

// Mock notifications for development
const mockNotifications = [
  {
    id: '1',
    type: 'achievement_unlocked',
    priority: 'normal',
    title: 'Achievement Unlocked: First Steps',
    message: 'Congratulations! You completed your first lesson.',
    action_url: '/dashboard/student/achievements',
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
    metadata: { rarity: 'common', points: 10 },
  },
  {
    id: '2',
    type: 'streak_at_risk',
    priority: 'high',
    title: 'Your Streak is at Risk!',
    message: 'Complete a lesson today to maintain your 7-day streak.',
    action_url: '/dashboard/student/courses',
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    metadata: { current_streak: 7 },
  },
  {
    id: '3',
    type: 'course_completed',
    priority: 'normal',
    title: 'Course Completed!',
    message: 'You have completed "Introduction to Web Development"',
    action_url: '/dashboard/certificates',
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    metadata: {},
  },
]

// GET: Get user's notifications
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50)
    const offset = parseInt(searchParams.get('offset') || '0')
    const unreadOnly = searchParams.get('unreadOnly') === 'true'
    const type = searchParams.get('type')

    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Build query
    let query = supabase
      .from('notifications')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .eq('is_archived', false)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (unreadOnly) {
      query = query.eq('is_read', false)
    }

    if (type) {
      query = query.eq('type', type)
    }

    const { data: notifications, error: notificationsError, count } = await query

    // Use mock data if database not available
    if (notificationsError || !notifications) {
      console.log('Using mock notifications')
      const filtered = mockNotifications
        .filter(n => !unreadOnly || !n.is_read)
        .filter(n => !type || n.type === type)

      return NextResponse.json({
        notifications: filtered.slice(offset, offset + limit),
        total: filtered.length,
        unread_count: filtered.filter(n => !n.is_read).length,
      })
    }

    // Get unread count
    const { count: unreadCount } = await supabase
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_read', false)
      .eq('is_archived', false)

    return NextResponse.json({
      notifications,
      total: count || 0,
      unread_count: unreadCount || 0,
    })
  } catch (error) {
    console.error('Notifications GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH: Mark notifications as read/archived
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { notificationIds, markRead, markArchived, markAllRead } = body

    // Mark all as read
    if (markAllRead) {
      const { error: updateError } = await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('is_read', false)

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        message: 'All notifications marked as read',
      })
    }

    // Update specific notifications
    if (!notificationIds || !Array.isArray(notificationIds)) {
      return NextResponse.json(
        { error: 'notificationIds array is required' },
        { status: 400 }
      )
    }

    const updates: Record<string, unknown> = {}
    if (markRead !== undefined) {
      updates.is_read = markRead
      if (markRead) {
        updates.read_at = new Date().toISOString()
      }
    }
    if (markArchived !== undefined) {
      updates.is_archived = markArchived
      if (markArchived) {
        updates.archived_at = new Date().toISOString()
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No updates specified' },
        { status: 400 }
      )
    }

    const { error: updateError } = await supabase
      .from('notifications')
      .update(updates)
      .eq('user_id', user.id)
      .in('id', notificationIds)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Notifications updated',
      updated: notificationIds.length,
    })
  } catch (error) {
    console.error('Notifications PATCH error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE: Delete notifications
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const notificationId = searchParams.get('id')
    const deleteAll = searchParams.get('deleteAll') === 'true'

    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (deleteAll) {
      // Delete all archived notifications
      const { error: deleteError } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', user.id)
        .eq('is_archived', true)

      if (deleteError) {
        return NextResponse.json({ error: deleteError.message }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        message: 'All archived notifications deleted',
      })
    }

    if (!notificationId) {
      return NextResponse.json(
        { error: 'Notification ID required' },
        { status: 400 }
      )
    }

    const { error: deleteError } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId)
      .eq('user_id', user.id)

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Notification deleted',
    })
  } catch (error) {
    console.error('Notifications DELETE error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
