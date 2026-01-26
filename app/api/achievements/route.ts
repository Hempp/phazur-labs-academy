// Achievements API
// List all achievements and track user progress

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

// Mock achievements for development
const mockAchievements = [
  {
    id: '1',
    name: 'First Steps',
    slug: 'first-lesson',
    description: 'Complete your first lesson',
    category: 'learning',
    rarity: 'common',
    icon_url: null,
    points_reward: 10,
    is_secret: false,
    unlock_criteria: { type: 'lesson_count', threshold: 1 },
  },
  {
    id: '2',
    name: 'Dedicated Learner',
    slug: 'ten-lessons',
    description: 'Complete 10 lessons',
    category: 'learning',
    rarity: 'common',
    icon_url: null,
    points_reward: 50,
    is_secret: false,
    unlock_criteria: { type: 'lesson_count', threshold: 10 },
  },
  {
    id: '3',
    name: 'Graduate',
    slug: 'first-course',
    description: 'Complete your first course',
    category: 'learning',
    rarity: 'uncommon',
    icon_url: null,
    points_reward: 100,
    is_secret: false,
    unlock_criteria: { type: 'course_count', threshold: 1 },
  },
  {
    id: '4',
    name: 'Week Warrior',
    slug: 'seven-day-streak',
    description: 'Maintain a 7-day learning streak',
    category: 'consistency',
    rarity: 'uncommon',
    icon_url: null,
    points_reward: 100,
    is_secret: false,
    unlock_criteria: { type: 'streak_days', threshold: 7 },
  },
  {
    id: '5',
    name: 'Perfectionist',
    slug: 'first-perfect',
    description: 'Score 100% on a quiz',
    category: 'mastery',
    rarity: 'uncommon',
    icon_url: null,
    points_reward: 50,
    is_secret: false,
    unlock_criteria: { type: 'perfect_quiz_count', threshold: 1 },
  },
]

// GET: List all achievements (optionally with user progress)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const includeUserProgress = searchParams.get('includeProgress') === 'true'

    const supabase = await createServerSupabaseClient()

    // Check for authenticated user
    const { data: { user } } = await supabase.auth.getUser()

    // Fetch achievements from database
    let query = supabase
      .from('achievements')
      .select('*')
      .eq('is_active', true)
      .order('category')
      .order('display_order')

    if (category) {
      query = query.eq('category', category)
    }

    const { data: achievements, error: achievementsError } = await query

    // Use mock data if database not available
    if (achievementsError || !achievements) {
      console.log('Using mock achievements data')
      const filtered = category
        ? mockAchievements.filter(a => a.category === category)
        : mockAchievements

      return NextResponse.json({
        achievements: filtered.map(a => ({
          ...a,
          unlocked: false,
          progress: null,
        })),
        total: filtered.length,
      })
    }

    // If user is authenticated and progress is requested, get their unlocked achievements
    let userAchievements: Record<string, { unlocked_at: string; is_featured: boolean }> = {}
    let userStats = null

    if (user && includeUserProgress) {
      // Get user's unlocked achievements
      const { data: unlocked } = await supabase
        .from('user_achievements')
        .select('achievement_id, unlocked_at, is_featured')
        .eq('user_id', user.id)

      if (unlocked) {
        userAchievements = unlocked.reduce((acc, ua) => {
          acc[ua.achievement_id] = {
            unlocked_at: ua.unlocked_at,
            is_featured: ua.is_featured,
          }
          return acc
        }, {} as typeof userAchievements)
      }

      // Get user's gamification stats for progress calculation
      const { data: stats } = await supabase
        .from('user_gamification_stats')
        .select('*')
        .eq('user_id', user.id)
        .single()

      userStats = stats
    }

    // Build response with progress info
    const achievementsWithProgress = achievements.map(achievement => {
      const userUnlock = userAchievements[achievement.id]
      const unlocked = !!userUnlock

      // Calculate progress if not unlocked and user is authenticated
      let progress = null
      if (!unlocked && userStats && achievement.unlock_criteria) {
        const criteria = achievement.unlock_criteria as { type: string; threshold: number }
        const threshold = criteria.threshold || 0

        let currentValue = 0
        switch (criteria.type) {
          case 'lesson_count':
            currentValue = userStats.lessons_completed || 0
            break
          case 'quiz_pass_count':
            currentValue = userStats.quizzes_passed || 0
            break
          case 'perfect_quiz_count':
            currentValue = userStats.perfect_quizzes || 0
            break
          case 'course_count':
            currentValue = userStats.courses_completed || 0
            break
          case 'streak_days':
            currentValue = userStats.current_streak || 0
            break
          case 'longest_streak':
            currentValue = userStats.longest_streak || 0
            break
          case 'total_points':
            currentValue = userStats.total_points || 0
            break
          case 'discussions_count':
            currentValue = userStats.discussions_created || 0
            break
          case 'certificates_count':
            currentValue = userStats.certificates_earned || 0
            break
          case 'achievements_count':
            currentValue = userStats.achievements_unlocked || 0
            break
        }

        progress = {
          current: currentValue,
          target: threshold,
          percentage: Math.min(100, Math.round((currentValue / threshold) * 100)),
        }
      }

      // Hide secret achievements that aren't unlocked
      if (achievement.is_secret && !unlocked) {
        return {
          id: achievement.id,
          name: '???',
          slug: achievement.slug,
          description: 'Secret achievement',
          category: achievement.category,
          rarity: achievement.rarity,
          icon_url: null,
          points_reward: achievement.points_reward,
          is_secret: true,
          unlocked: false,
          unlocked_at: null,
          is_featured: false,
          progress: null,
        }
      }

      return {
        id: achievement.id,
        name: achievement.name,
        slug: achievement.slug,
        description: achievement.description,
        category: achievement.category,
        rarity: achievement.rarity,
        icon_url: achievement.icon_url,
        points_reward: achievement.points_reward,
        is_secret: achievement.is_secret,
        unlocked,
        unlocked_at: userUnlock?.unlocked_at || null,
        is_featured: userUnlock?.is_featured || false,
        progress,
      }
    })

    // Group by category for easier frontend rendering
    const byCategory = achievementsWithProgress.reduce((acc, a) => {
      if (!acc[a.category]) {
        acc[a.category] = []
      }
      acc[a.category].push(a)
      return acc
    }, {} as Record<string, typeof achievementsWithProgress>)

    return NextResponse.json({
      achievements: achievementsWithProgress,
      byCategory,
      total: achievementsWithProgress.length,
      unlocked: Object.keys(userAchievements).length,
    })
  } catch (error) {
    console.error('Achievements GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
