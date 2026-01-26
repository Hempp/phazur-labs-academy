// Leaderboard API
// Get top learners by points

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

// Mock leaderboard data for development
const mockLeaderboard = [
  { rank: 1, user_id: '1', user_name: 'Sarah Chen', user_avatar_url: null, points: 15420 },
  { rank: 2, user_id: '2', user_name: 'Marcus Johnson', user_avatar_url: null, points: 12850 },
  { rank: 3, user_id: '3', user_name: 'Emily Rodriguez', user_avatar_url: null, points: 11200 },
  { rank: 4, user_id: '4', user_name: 'David Kim', user_avatar_url: null, points: 9875 },
  { rank: 5, user_id: '5', user_name: 'Jessica Williams', user_avatar_url: null, points: 8430 },
  { rank: 6, user_id: '6', user_name: 'Michael Brown', user_avatar_url: null, points: 7650 },
  { rank: 7, user_id: '7', user_name: 'Amanda Taylor', user_avatar_url: null, points: 6290 },
  { rank: 8, user_id: '8', user_name: 'Chris Anderson', user_avatar_url: null, points: 5840 },
  { rank: 9, user_id: '9', user_name: 'Rachel Martinez', user_avatar_url: null, points: 5120 },
  { rank: 10, user_id: '10', user_name: 'James Wilson', user_avatar_url: null, points: 4780 },
]

// GET: Get leaderboard
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'all_time' // 'all_time', 'weekly', 'monthly'
    const limit = Math.min(parseInt(searchParams.get('limit') || '25'), 100)

    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Determine which points column to sort by
    let pointsColumn: string
    switch (type) {
      case 'weekly':
        pointsColumn = 'weekly_points'
        break
      case 'monthly':
        pointsColumn = 'monthly_points'
        break
      default:
        pointsColumn = 'total_points'
    }

    // Try to get leaderboard from cache first
    const { data: cachedLeaderboard, error: cacheError } = await supabase
      .from('leaderboard_cache')
      .select('*')
      .eq('leaderboard_type', type)
      .order('rank')
      .limit(limit)

    // If cache exists and is fresh (less than 1 hour old), use it
    if (!cacheError && cachedLeaderboard && cachedLeaderboard.length > 0) {
      const cacheAge = Date.now() - new Date(cachedLeaderboard[0].cached_at).getTime()
      const oneHour = 60 * 60 * 1000

      if (cacheAge < oneHour) {
        // Get current user's position if authenticated
        let userPosition = null
        if (user) {
          const userEntry = cachedLeaderboard.find(e => e.user_id === user.id)
          if (userEntry) {
            userPosition = {
              rank: userEntry.rank,
              points: userEntry.points,
              in_top: userEntry.rank <= limit,
            }
          }
        }

        return NextResponse.json({
          leaderboard: cachedLeaderboard,
          type,
          cached: true,
          cached_at: cachedLeaderboard[0].cached_at,
          user_position: userPosition,
        })
      }
    }

    // Fetch fresh leaderboard from stats table
    const { data: freshLeaderboard, error: leaderboardError } = await supabase
      .from('user_gamification_stats')
      .select(`
        user_id,
        total_points,
        weekly_points,
        monthly_points,
        user:users (
          id,
          full_name,
          avatar_url
        )
      `)
      .gt(pointsColumn, 0)
      .order(pointsColumn, { ascending: false })
      .limit(limit)

    // Use mock data if database not available
    if (leaderboardError || !freshLeaderboard) {
      console.log('Using mock leaderboard data')
      return NextResponse.json({
        leaderboard: mockLeaderboard.slice(0, limit),
        type,
        cached: false,
        user_position: null,
      })
    }

    // Format leaderboard
    const leaderboard = freshLeaderboard.map((entry, index) => {
      const userData = Array.isArray(entry.user) ? entry.user[0] : entry.user
      return {
        rank: index + 1,
        user_id: entry.user_id,
        user_name: userData?.full_name || 'Anonymous',
        user_avatar_url: userData?.avatar_url || null,
        points: entry[pointsColumn as keyof typeof entry] as number,
      }
    })

    // Get current user's position if authenticated
    let userPosition = null
    if (user) {
      // Check if user is in the leaderboard
      const userInLeaderboard = leaderboard.find(e => e.user_id === user.id)
      if (userInLeaderboard) {
        userPosition = {
          rank: userInLeaderboard.rank,
          points: userInLeaderboard.points,
          in_top: true,
        }
      } else {
        // Get user's actual rank
        const { data: userStats } = await supabase
          .from('user_gamification_stats')
          .select(pointsColumn)
          .eq('user_id', user.id)
          .single()

        if (userStats) {
          const userPoints = userStats[pointsColumn as keyof typeof userStats] as number
          const { count } = await supabase
            .from('user_gamification_stats')
            .select('id', { count: 'exact', head: true })
            .gt(pointsColumn, userPoints)

          userPosition = {
            rank: (count || 0) + 1,
            points: userPoints,
            in_top: false,
          }
        }
      }
    }

    // Update cache in background (don't await)
    updateLeaderboardCache(supabase).catch(err => {
      console.error('Error updating leaderboard cache:', err)
    })

    return NextResponse.json({
      leaderboard,
      type,
      cached: false,
      user_position: userPosition,
    })
  } catch (error) {
    console.error('Leaderboard GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper function to update leaderboard cache
async function updateLeaderboardCache(supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>) {
  try {
    await supabase.rpc('refresh_leaderboard_cache')
  } catch (error) {
    console.error('Error refreshing leaderboard cache:', error)
  }
}

// POST: Force refresh leaderboard cache (admin only)
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

    // Check if user is admin
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Refresh the cache
    const { error: refreshError } = await supabase.rpc('refresh_leaderboard_cache')

    if (refreshError) {
      return NextResponse.json(
        { error: 'Failed to refresh leaderboard' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Leaderboard cache refreshed',
    })
  } catch (error) {
    console.error('Leaderboard POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
