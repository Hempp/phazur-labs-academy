// Team Invitations API
// Manage team invitations

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

interface RouteParams {
  params: Promise<{ teamId: string }>
}

// GET: List pending invitations
export async function GET(request: NextRequest, { params }: RouteParams) {
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
        { error: 'Only team owners and admins can view invitations' },
        { status: 403 }
      )
    }

    const { data: invitations, error: invitationsError } = await supabase
      .from('team_invitations')
      .select(`
        id,
        email,
        role,
        status,
        created_at,
        expires_at,
        invited_by_user:users!team_invitations_invited_by_fkey (
          id,
          full_name
        )
      `)
      .eq('team_id', teamId)
      .order('created_at', { ascending: false })

    if (invitationsError) {
      return NextResponse.json({ error: invitationsError.message }, { status: 500 })
    }

    const formattedInvitations = (invitations || []).map(i => ({
      ...i,
      invited_by: Array.isArray(i.invited_by_user) ? i.invited_by_user[0] : i.invited_by_user,
    }))

    return NextResponse.json({
      invitations: formattedInvitations,
      total: formattedInvitations.length,
    })
  } catch (error) {
    console.error('Team invitations GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST: Create invitation
export async function POST(request: NextRequest, { params }: RouteParams) {
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
        { error: 'Only team owners and admins can send invitations' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { email, role = 'member' } = body

    if (!email) {
      return NextResponse.json(
        { error: 'email is required' },
        { status: 400 }
      )
    }

    // Check if user already exists and is a member
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      const { data: existingMember } = await supabase
        .from('team_members')
        .select('id')
        .eq('team_id', teamId)
        .eq('user_id', existingUser.id)
        .single()

      if (existingMember) {
        return NextResponse.json(
          { error: 'User is already a member of this team' },
          { status: 400 }
        )
      }
    }

    // Check for pending invitation
    const { data: pendingInvitation } = await supabase
      .from('team_invitations')
      .select('id')
      .eq('team_id', teamId)
      .eq('email', email)
      .eq('status', 'pending')
      .single()

    if (pendingInvitation) {
      return NextResponse.json(
        { error: 'A pending invitation already exists for this email' },
        { status: 400 }
      )
    }

    // Check team capacity
    const { data: team } = await supabase
      .from('teams')
      .select('max_members, name')
      .eq('id', teamId)
      .single()

    const { count: currentMembers } = await supabase
      .from('team_members')
      .select('id', { count: 'exact', head: true })
      .eq('team_id', teamId)

    const { count: pendingInvitations } = await supabase
      .from('team_invitations')
      .select('id', { count: 'exact', head: true })
      .eq('team_id', teamId)
      .eq('status', 'pending')

    const totalPotential = (currentMembers || 0) + (pendingInvitations || 0)
    if (team?.max_members && totalPotential >= team.max_members) {
      return NextResponse.json(
        { error: 'Team is at or near maximum capacity' },
        { status: 400 }
      )
    }

    // Create invitation
    const { data: invitation, error: insertError } = await supabase
      .from('team_invitations')
      .insert({
        team_id: teamId,
        email,
        role: role === 'admin' ? 'admin' : 'member',
        invited_by: user.id,
      })
      .select()
      .single()

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    // TODO: Send invitation email
    // In production, this would send an email with the invitation token
    // const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/teams/join?token=${invitation.token}`

    return NextResponse.json({
      message: 'Invitation sent successfully',
      invitation: {
        ...invitation,
        team_name: team?.name,
      },
    })
  } catch (error) {
    console.error('Team invitations POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE: Cancel/revoke invitation
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { teamId } = await params
    const { searchParams } = new URL(request.url)
    const invitationId = searchParams.get('invitationId')

    if (!invitationId) {
      return NextResponse.json(
        { error: 'invitationId query parameter is required' },
        { status: 400 }
      )
    }

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
        { error: 'Only team owners and admins can cancel invitations' },
        { status: 403 }
      )
    }

    const { error: deleteError } = await supabase
      .from('team_invitations')
      .delete()
      .eq('id', invitationId)
      .eq('team_id', teamId)

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Invitation cancelled successfully',
    })
  } catch (error) {
    console.error('Team invitations DELETE error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
