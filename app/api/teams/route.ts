// Teams API
// List and create teams for group learning

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import slugify from 'slugify'

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

// Mock teams for development
const mockTeams = [
  {
    id: 'team-1',
    name: 'Engineering Team Alpha',
    slug: 'engineering-team-alpha',
    description: 'Our core engineering team focused on frontend development.',
    logo_url: null,
    owner: {
      id: 'owner-1',
      full_name: 'John Smith',
      avatar_url: null,
    },
    member_count: 12,
    course_count: 4,
    is_active: true,
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'team-2',
    name: 'Product Design Squad',
    slug: 'product-design-squad',
    description: 'Cross-functional design team covering UX and UI.',
    logo_url: null,
    owner: {
      id: 'owner-2',
      full_name: 'Jane Doe',
      avatar_url: null,
    },
    member_count: 8,
    course_count: 3,
    is_active: true,
    created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

// GET: List user's teams
export async function GET(request: NextRequest) {
  try {
    // Return mock data if Supabase is not configured
    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        teams: mockTeams,
        total: mockTeams.length,
      })
    }

    const supabase = await createServerSupabaseClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get teams the user is a member of
    const { data: memberships, error: membershipError } = await supabase
      .from('team_members')
      .select('team_id, role')
      .eq('user_id', user.id)

    if (membershipError) {
      return NextResponse.json({ error: membershipError.message }, { status: 500 })
    }

    if (!memberships || memberships.length === 0) {
      return NextResponse.json({ teams: [], total: 0 })
    }

    const teamIds = memberships.map(m => m.team_id)

    // Get team details
    const { data: teams, error: teamsError } = await supabase
      .from('teams')
      .select(`
        id,
        name,
        slug,
        description,
        logo_url,
        is_active,
        created_at,
        owner:users!teams_owner_id_fkey (
          id,
          full_name,
          avatar_url
        )
      `)
      .in('id', teamIds)
      .order('name')

    if (teamsError) {
      return NextResponse.json({ error: teamsError.message }, { status: 500 })
    }

    // Get member counts and course counts for each team
    const enrichedTeams = await Promise.all((teams || []).map(async (team) => {
      const { count: memberCount } = await supabase
        .from('team_members')
        .select('id', { count: 'exact', head: true })
        .eq('team_id', team.id)

      const { count: courseCount } = await supabase
        .from('team_course_access')
        .select('id', { count: 'exact', head: true })
        .eq('team_id', team.id)

      const membership = memberships.find(m => m.team_id === team.id)

      return {
        ...team,
        owner: Array.isArray(team.owner) ? team.owner[0] : team.owner,
        member_count: memberCount || 0,
        course_count: courseCount || 0,
        user_role: membership?.role || 'member',
      }
    }))

    return NextResponse.json({
      teams: enrichedTeams,
      total: enrichedTeams.length,
    })
  } catch (error) {
    console.error('Teams GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST: Create a new team
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
    const { name, description, logoUrl, maxMembers } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Team name is required' },
        { status: 400 }
      )
    }

    // Generate unique slug
    let baseSlug = slugify(name, { lower: true, strict: true })
    let slug = baseSlug
    let counter = 1

    while (true) {
      const { data: existing } = await supabase
        .from('teams')
        .select('id')
        .eq('slug', slug)
        .single()

      if (!existing) break
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Create team
    const { data: team, error: insertError } = await supabase
      .from('teams')
      .insert({
        name,
        slug,
        description: description || null,
        logo_url: logoUrl || null,
        owner_id: user.id,
        max_members: maxMembers || 50,
      })
      .select()
      .single()

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    // Add owner as team member with owner role
    const { error: memberError } = await supabase
      .from('team_members')
      .insert({
        team_id: team.id,
        user_id: user.id,
        role: 'owner',
      })

    if (memberError) {
      // Rollback team creation if member insert fails
      await supabase.from('teams').delete().eq('id', team.id)
      return NextResponse.json({ error: memberError.message }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Team created successfully',
      team: {
        ...team,
        member_count: 1,
        course_count: 0,
        user_role: 'owner',
      },
    })
  } catch (error) {
    console.error('Teams POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
