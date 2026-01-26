// Team Join API
// Accept team invitations using token

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

// GET: Validate token and get invitation details
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required', valid: false },
        { status: 400 }
      )
    }

    const supabase = await createServerSupabaseClient()

    // Get invitation with team and inviter details
    const { data: invitation, error: invitationError } = await supabase
      .from('team_invitations')
      .select(`
        id,
        email,
        role,
        status,
        expires_at,
        team:teams (
          id,
          name,
          description
        ),
        inviter:users!team_invitations_invited_by_fkey (
          full_name
        )
      `)
      .eq('token', token)
      .single()

    if (invitationError || !invitation) {
      return NextResponse.json(
        { error: 'Invalid invitation token', valid: false },
        { status: 404 }
      )
    }

    // Check if already accepted
    if (invitation.status !== 'pending') {
      return NextResponse.json(
        { error: 'This invitation has already been used', valid: false, status: invitation.status },
        { status: 400 }
      )
    }

    // Check if expired
    if (new Date(invitation.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'This invitation has expired', valid: false, expired: true },
        { status: 400 }
      )
    }

    // Check if user is logged in
    const { data: { user } } = await supabase.auth.getUser()

    return NextResponse.json({
      valid: true,
      invitation: {
        id: invitation.id,
        email: invitation.email,
        role: invitation.role,
        team: invitation.team,
        inviter: invitation.inviter,
        expiresAt: invitation.expires_at,
      },
      isLoggedIn: !!user,
      userEmail: user?.email || null,
      emailMatch: user?.email === invitation.email,
    })
  } catch (error) {
    console.error('Team join GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error', valid: false },
      { status: 500 }
    )
  }
}

// POST: Accept the invitation
export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      )
    }

    const supabase = await createServerSupabaseClient()

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'You must be logged in to accept this invitation' },
        { status: 401 }
      )
    }

    // Get invitation
    const { data: invitation, error: invitationError } = await supabase
      .from('team_invitations')
      .select(`
        id,
        team_id,
        email,
        role,
        status,
        expires_at,
        invited_by,
        team:teams (
          id,
          name
        )
      `)
      .eq('token', token)
      .single()

    if (invitationError || !invitation) {
      return NextResponse.json(
        { error: 'Invalid invitation token' },
        { status: 404 }
      )
    }

    // Validate invitation
    if (invitation.status !== 'pending') {
      return NextResponse.json(
        { error: 'This invitation has already been used' },
        { status: 400 }
      )
    }

    if (new Date(invitation.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'This invitation has expired' },
        { status: 400 }
      )
    }

    // Verify email matches
    if (user.email !== invitation.email) {
      return NextResponse.json(
        { error: `This invitation was sent to ${invitation.email}. Please log in with that email address.` },
        { status: 403 }
      )
    }

    // Check if already a member
    const { data: existingMember } = await supabase
      .from('team_members')
      .select('id')
      .eq('team_id', invitation.team_id)
      .eq('user_id', user.id)
      .single()

    if (existingMember) {
      // Update invitation status anyway
      await supabase
        .from('team_invitations')
        .update({ status: 'accepted', accepted_at: new Date().toISOString() })
        .eq('id', invitation.id)

      const teamData = Array.isArray(invitation.team) ? invitation.team[0] : invitation.team
      return NextResponse.json({
        message: 'You are already a member of this team',
        alreadyMember: true,
        teamId: invitation.team_id,
        teamName: teamData?.name,
      })
    }

    // Create team membership
    const { error: memberError } = await supabase
      .from('team_members')
      .insert({
        team_id: invitation.team_id,
        user_id: user.id,
        role: invitation.role,
        invited_by: invitation.invited_by,
      })

    if (memberError) {
      console.error('Failed to create team membership:', memberError)
      return NextResponse.json(
        { error: 'Failed to join team' },
        { status: 500 }
      )
    }

    // Update invitation status
    await supabase
      .from('team_invitations')
      .update({ status: 'accepted', accepted_at: new Date().toISOString() })
      .eq('id', invitation.id)

    const teamInfo = Array.isArray(invitation.team) ? invitation.team[0] : invitation.team
    return NextResponse.json({
      message: 'Successfully joined the team!',
      teamId: invitation.team_id,
      teamName: teamInfo?.name,
      role: invitation.role,
    })
  } catch (error) {
    console.error('Team join POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
