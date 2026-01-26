// User Achievements API
// Get user's unlocked achievements and manage featured badges

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

// GET: Get current user's achievements
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') // Optional: view another user's public achievements
    const unviewedOnly = searchParams.get('unviewedOnly') === 'true'

    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    // Viewing own achievements requires auth
    if (!userId && (authError || !user)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const targetUserId = userId || user!.id
    const isOwnProfile = user && targetUserId === user.id

    // Build query
    let query = supabase
      .from('user_achievements')
      .select(`
        id,
        unlocked_at,
        is_viewed,
        is_featured,
        context,
        achievement:achievements (
          id,
          name,
          slug,
          description,
          category,
          rarity,
          icon_url,
          points_reward,
          is_secret
        )
      `)
      .eq('user_id', targetUserId)
      .order('unlocked_at', { ascending: false })

    // Only show featured achievements for other users
    if (!isOwnProfile) {
      query = query.eq('is_featured', true)
    }

    // Filter to unviewed only if requested
    if (unviewedOnly && isOwnProfile) {
      query = query.eq('is_viewed', false)
    }

    const { data: achievements, error: achievementsError } = await query

    if (achievementsError) {
      console.error('Error fetching user achievements:', achievementsError)
      return NextResponse.json(
        { error: 'Failed to fetch achievements' },
        { status: 500 }
      )
    }

    // Format response
    const formattedAchievements = (achievements || []).map(ua => ({
      id: ua.id,
      unlocked_at: ua.unlocked_at,
      is_viewed: ua.is_viewed,
      is_featured: ua.is_featured,
      context: ua.context,
      achievement: Array.isArray(ua.achievement) ? ua.achievement[0] : ua.achievement,
    }))

    // Count unviewed
    const unviewedCount = isOwnProfile
      ? formattedAchievements.filter(a => !a.is_viewed).length
      : 0

    // Get featured achievements
    const featuredAchievements = formattedAchievements.filter(a => a.is_featured)

    return NextResponse.json({
      achievements: formattedAchievements,
      featured: featuredAchievements,
      total: formattedAchievements.length,
      unviewed_count: unviewedCount,
      is_own_profile: isOwnProfile,
    })
  } catch (error) {
    console.error('User achievements GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH: Mark achievements as viewed or update featured status
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
    const { achievementIds, markViewed, setFeatured } = body

    if (!achievementIds || !Array.isArray(achievementIds)) {
      return NextResponse.json(
        { error: 'achievementIds array is required' },
        { status: 400 }
      )
    }

    // Build update object
    const updates: Record<string, boolean> = {}
    if (markViewed !== undefined) {
      updates.is_viewed = markViewed
    }
    if (setFeatured !== undefined) {
      // Limit to 3 featured achievements
      if (setFeatured) {
        const { count } = await supabase
          .from('user_achievements')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('is_featured', true)

        if ((count || 0) + achievementIds.length > 3) {
          return NextResponse.json(
            { error: 'Maximum 3 featured achievements allowed' },
            { status: 400 }
          )
        }
      }
      updates.is_featured = setFeatured
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No updates specified' },
        { status: 400 }
      )
    }

    const { data: updated, error: updateError } = await supabase
      .from('user_achievements')
      .update(updates)
      .eq('user_id', user.id)
      .in('id', achievementIds)
      .select()

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Achievements updated successfully',
      updated: updated?.length || 0,
    })
  } catch (error) {
    console.error('User achievements PATCH error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST: Trigger achievement check for current user
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

    // Call the check_achievements function
    const { data: unlockedCount, error: checkError } = await supabase
      .rpc('check_achievements', { p_user_id: user.id })

    if (checkError) {
      console.error('Error checking achievements:', checkError)
      return NextResponse.json(
        { error: 'Failed to check achievements' },
        { status: 500 }
      )
    }

    // If any achievements were unlocked, fetch them
    let newlyUnlocked = null
    if (unlockedCount > 0) {
      const { data: recent } = await supabase
        .from('user_achievements')
        .select(`
          id,
          unlocked_at,
          achievement:achievements (
            id,
            name,
            slug,
            description,
            category,
            rarity,
            points_reward
          )
        `)
        .eq('user_id', user.id)
        .eq('is_viewed', false)
        .order('unlocked_at', { ascending: false })
        .limit(unlockedCount)

      newlyUnlocked = recent?.map(ua => ({
        ...ua,
        achievement: Array.isArray(ua.achievement) ? ua.achievement[0] : ua.achievement,
      }))
    }

    return NextResponse.json({
      checked: true,
      newly_unlocked_count: unlockedCount,
      newly_unlocked: newlyUnlocked,
    })
  } catch (error) {
    console.error('User achievements POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
