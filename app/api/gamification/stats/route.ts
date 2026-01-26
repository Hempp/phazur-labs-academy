// Gamification Stats API
// User points, streaks, and learning statistics

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

// Mock stats for development
const mockStats = {
  total_points: 1250,
  weekly_points: 350,
  monthly_points: 1100,
  current_streak: 7,
  longest_streak: 14,
  last_activity_date: new Date().toISOString().split('T')[0],
  achievements_unlocked: 8,
  lessons_completed: 24,
  quizzes_passed: 6,
  perfect_quizzes: 2,
  courses_completed: 1,
  certificates_earned: 1,
  discussions_created: 3,
  discussions_replies: 12,
  upvotes_received: 8,
}

// GET: Get user's gamification stats
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') // Optional: view another user's public stats

    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    // Viewing own stats requires auth
    if (!userId && (authError || !user)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const targetUserId = userId || user!.id
    const isOwnProfile = user && targetUserId === user.id

    // Fetch user stats
    const { data: stats, error: statsError } = await supabase
      .from('user_gamification_stats')
      .select('*')
      .eq('user_id', targetUserId)
      .single()

    // Use mock data if database not available
    if (statsError || !stats) {
      console.log('Using mock gamification stats')
      return NextResponse.json({
        stats: mockStats,
        is_own_profile: isOwnProfile,
        rank: null,
      })
    }

    // Get user's rank
    const { count: betterThanCount } = await supabase
      .from('user_gamification_stats')
      .select('id', { count: 'exact', head: true })
      .gt('total_points', stats.total_points)

    const rank = (betterThanCount || 0) + 1

    // Calculate streak status
    const today = new Date().toISOString().split('T')[0]
    const lastActivity = stats.last_activity_date
    let streakStatus: 'active' | 'at_risk' | 'broken' = 'active'

    if (lastActivity) {
      const lastDate = new Date(lastActivity)
      const todayDate = new Date(today)
      const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))

      if (diffDays === 0) {
        streakStatus = 'active' // Already logged in today
      } else if (diffDays === 1) {
        streakStatus = 'at_risk' // Need to log in today to maintain streak
      } else {
        streakStatus = 'broken' // Streak will be reset on next activity
      }
    }

    // Get recent point transactions if viewing own profile
    let recentTransactions = null
    if (isOwnProfile) {
      const { data: transactions } = await supabase
        .from('point_transactions')
        .select('*')
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false })
        .limit(10)

      recentTransactions = transactions
    }

    return NextResponse.json({
      stats: {
        total_points: stats.total_points,
        weekly_points: stats.weekly_points,
        monthly_points: stats.monthly_points,
        current_streak: stats.current_streak,
        longest_streak: stats.longest_streak,
        last_activity_date: stats.last_activity_date,
        streak_status: streakStatus,
        achievements_unlocked: stats.achievements_unlocked,
        lessons_completed: stats.lessons_completed,
        quizzes_passed: stats.quizzes_passed,
        perfect_quizzes: stats.perfect_quizzes,
        courses_completed: stats.courses_completed,
        certificates_earned: stats.certificates_earned,
        discussions_created: stats.discussions_created,
        discussions_replies: stats.discussions_replies,
        upvotes_received: stats.upvotes_received,
      },
      rank,
      is_own_profile: isOwnProfile,
      recent_transactions: recentTransactions,
    })
  } catch (error) {
    console.error('Gamification stats GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST: Record activity and update streak
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

    const body = await request.json()
    const { activityType } = body

    // Update streak
    const { data: newStreak, error: streakError } = await supabase
      .rpc('update_user_streak', { p_user_id: user.id })

    if (streakError) {
      console.error('Error updating streak:', streakError)
    }

    // Award daily login points if this is first activity today
    const today = new Date().toISOString().split('T')[0]
    const { data: todayActivity } = await supabase
      .from('user_activity_log')
      .select('id')
      .eq('user_id', user.id)
      .eq('activity_date', today)
      .single()

    let pointsAwarded = 0
    if (!todayActivity) {
      // Award daily login bonus
      const { data: newBalance } = await supabase
        .rpc('award_points', {
          p_user_id: user.id,
          p_transaction_type: 'daily_login',
          p_points: 5,
          p_description: 'Daily login bonus',
        })

      pointsAwarded = 5

      // Award streak bonus
      if (newStreak && newStreak > 1) {
        const streakBonus = Math.min(newStreak * 5, 50) // Cap at 50 points
        await supabase
          .rpc('award_points', {
            p_user_id: user.id,
            p_transaction_type: 'streak_bonus',
            p_points: streakBonus,
            p_description: `${newStreak}-day streak bonus`,
          })
        pointsAwarded += streakBonus
      }
    }

    // Update activity log with specific activity type
    if (activityType) {
      const updateField: Record<string, number> = {}
      switch (activityType) {
        case 'lesson_view':
          updateField.lessons_viewed = 1
          break
        case 'quiz_taken':
          updateField.quizzes_taken = 1
          break
        case 'discussion':
          updateField.discussions_participated = 1
          break
        case 'note_created':
          updateField.notes_created = 1
          break
      }

      if (Object.keys(updateField).length > 0) {
        await supabase
          .from('user_activity_log')
          .upsert({
            user_id: user.id,
            activity_date: today,
            ...updateField,
            streak_qualified: true,
          }, {
            onConflict: 'user_id,activity_date',
          })
      }
    }

    // Check for new achievements
    const { data: unlockedCount } = await supabase
      .rpc('check_achievements', { p_user_id: user.id })

    return NextResponse.json({
      success: true,
      current_streak: newStreak || 0,
      points_awarded: pointsAwarded,
      achievements_unlocked: unlockedCount || 0,
    })
  } catch (error) {
    console.error('Gamification stats POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
