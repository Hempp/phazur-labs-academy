// Team Detail API
// Get, update, delete individual teams

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

interface RouteParams {
  params: Promise<{ teamId: string }>
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

// GET: Get team details
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { teamId } = await params

    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        team: {
          id: teamId,
          name: 'Engineering Team Alpha',
          slug: 'engineering-team-alpha',
          description: 'Our core engineering team.',
          logo_url: null,
          is_active: true,
          member_count: 12,
          course_count: 4,
          owner: {
            id: 'owner-1',
            full_name: 'John Smith',
            avatar_url: null,
          },
          members: [],
          courses: [],
        },
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

    // Check if user is a member
    const { data: membership } = await supabase
      .from('team_members')
      .select('role')
      .eq('team_id', teamId)
      .eq('user_id', user.id)
      .single()

    if (!membership) {
      return NextResponse.json(
        { error: 'You are not a member of this team' },
        { status: 403 }
      )
    }

    // Get team details
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .select(`
        *,
        owner:users!teams_owner_id_fkey (
          id,
          full_name,
          avatar_url
        )
      `)
      .eq('id', teamId)
      .single()

    if (teamError || !team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 })
    }

    // Get members
    const { data: members } = await supabase
      .from('team_members')
      .select(`
        id,
        role,
        joined_at,
        user:users (
          id,
          full_name,
          avatar_url,
          email
        )
      `)
      .eq('team_id', teamId)
      .order('joined_at', { ascending: false })

    // Get course access
    const { data: courseAccess } = await supabase
      .from('team_course_access')
      .select(`
        id,
        granted_at,
        expires_at,
        course:courses (
          id,
          title,
          slug,
          thumbnail_url
        )
      `)
      .eq('team_id', teamId)

    return NextResponse.json({
      team: {
        ...team,
        owner: Array.isArray(team.owner) ? team.owner[0] : team.owner,
        member_count: members?.length || 0,
        course_count: courseAccess?.length || 0,
        members: (members || []).map(m => ({
          ...m,
          user: Array.isArray(m.user) ? m.user[0] : m.user,
        })),
        courses: (courseAccess || []).map(c => ({
          ...c,
          course: Array.isArray(c.course) ? c.course[0] : c.course,
        })),
        user_role: membership.role,
      },
    })
  } catch (error) {
    console.error('Team GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH: Update team
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { teamId } = await params
    const supabase = await createServerSupabaseClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is owner or admin
    const { data: membership } = await supabase
      .from('team_members')
      .select('role')
      .eq('team_id', teamId)
      .eq('user_id', user.id)
      .single()

    if (!membership || !['owner', 'admin'].includes(membership.role)) {
      return NextResponse.json(
        { error: 'Only team owners and admins can update the team' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const allowedFields = ['name', 'description', 'logo_url', 'max_members', 'is_active', 'settings']

    const updates: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(body)) {
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
      if (allowedFields.includes(snakeKey)) {
        updates[snakeKey] = value
      }
    }

    const { data: updatedTeam, error: updateError } = await supabase
      .from('teams')
      .update(updates)
      .eq('id', teamId)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Team updated successfully',
      team: updatedTeam,
    })
  } catch (error) {
    console.error('Team PATCH error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE: Delete team
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { teamId } = await params
    const supabase = await createServerSupabaseClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is owner
    const { data: team } = await supabase
      .from('teams')
      .select('owner_id')
      .eq('id', teamId)
      .single()

    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 })
    }

    if (team.owner_id !== user.id) {
      return NextResponse.json(
        { error: 'Only the team owner can delete the team' },
        { status: 403 }
      )
    }

    // Delete team (cascades to members, invitations, course access)
    const { error: deleteError } = await supabase
      .from('teams')
      .delete()
      .eq('id', teamId)

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Team deleted successfully',
    })
  } catch (error) {
    console.error('Team DELETE error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
