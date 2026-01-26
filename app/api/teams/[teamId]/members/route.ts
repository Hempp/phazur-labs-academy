// Team Members API
// Manage team membership

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

interface RouteParams {
  params: Promise<{ teamId: string }>
}

// GET: List team members
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

    // Get members
    const { data: members, error: membersError } = await supabase
      .from('team_members')
      .select(`
        id,
        role,
        joined_at,
        user:users (
          id,
          full_name,
          email,
          avatar_url
        ),
        invited_by_user:users!team_members_invited_by_fkey (
          id,
          full_name
        )
      `)
      .eq('team_id', teamId)
      .order('role')
      .order('joined_at', { ascending: false })

    if (membersError) {
      return NextResponse.json({ error: membersError.message }, { status: 500 })
    }

    const formattedMembers = (members || []).map(m => ({
      ...m,
      user: Array.isArray(m.user) ? m.user[0] : m.user,
      invited_by: Array.isArray(m.invited_by_user) ? m.invited_by_user[0] : m.invited_by_user,
    }))

    return NextResponse.json({
      members: formattedMembers,
      total: formattedMembers.length,
    })
  } catch (error) {
    console.error('Team members GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST: Add member directly (by user ID)
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
        { error: 'Only team owners and admins can add members' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { userId, role = 'member' } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    // Verify user exists
    const { data: targetUser } = await supabase
      .from('users')
      .select('id, full_name')
      .eq('id', userId)
      .single()

    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check team capacity
    const { data: team } = await supabase
      .from('teams')
      .select('max_members')
      .eq('id', teamId)
      .single()

    const { count: currentMembers } = await supabase
      .from('team_members')
      .select('id', { count: 'exact', head: true })
      .eq('team_id', teamId)

    if (team?.max_members && (currentMembers || 0) >= team.max_members) {
      return NextResponse.json(
        { error: 'Team has reached maximum capacity' },
        { status: 400 }
      )
    }

    // Add member
    const { data: newMember, error: insertError } = await supabase
      .from('team_members')
      .insert({
        team_id: teamId,
        user_id: userId,
        role: role === 'admin' ? 'admin' : 'member',
        invited_by: user.id,
      })
      .select(`
        id,
        role,
        joined_at,
        user:users (
          id,
          full_name,
          email,
          avatar_url
        )
      `)
      .single()

    if (insertError) {
      if (insertError.code === '23505') {
        return NextResponse.json(
          { error: 'User is already a member of this team' },
          { status: 400 }
        )
      }
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Member added successfully',
      member: {
        ...newMember,
        user: Array.isArray(newMember.user) ? newMember.user[0] : newMember.user,
      },
    })
  } catch (error) {
    console.error('Team members POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH: Update member role
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

    // Check if user is owner
    const { data: membership } = await supabase
      .from('team_members')
      .select('role')
      .eq('team_id', teamId)
      .eq('user_id', user.id)
      .single()

    if (!membership || membership.role !== 'owner') {
      return NextResponse.json(
        { error: 'Only the team owner can change member roles' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { memberId, role } = body

    if (!memberId || !role) {
      return NextResponse.json(
        { error: 'memberId and role are required' },
        { status: 400 }
      )
    }

    if (!['admin', 'member'].includes(role)) {
      return NextResponse.json(
        { error: 'Role must be "admin" or "member"' },
        { status: 400 }
      )
    }

    // Can't change own role
    const { data: targetMember } = await supabase
      .from('team_members')
      .select('user_id')
      .eq('id', memberId)
      .single()

    if (targetMember?.user_id === user.id) {
      return NextResponse.json(
        { error: 'Cannot change your own role' },
        { status: 400 }
      )
    }

    const { data: updatedMember, error: updateError } = await supabase
      .from('team_members')
      .update({ role })
      .eq('id', memberId)
      .eq('team_id', teamId)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Member role updated successfully',
      member: updatedMember,
    })
  } catch (error) {
    console.error('Team members PATCH error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE: Remove member
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { teamId } = await params
    const { searchParams } = new URL(request.url)
    const memberId = searchParams.get('memberId')

    if (!memberId) {
      return NextResponse.json(
        { error: 'memberId query parameter is required' },
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

    // Get target member info
    const { data: targetMember } = await supabase
      .from('team_members')
      .select('user_id, role')
      .eq('id', memberId)
      .eq('team_id', teamId)
      .single()

    if (!targetMember) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 })
    }

    // Can't remove owner
    if (targetMember.role === 'owner') {
      return NextResponse.json(
        { error: 'Cannot remove the team owner' },
        { status: 400 }
      )
    }

    // Check permissions - can remove self, or if owner/admin can remove others
    const { data: membership } = await supabase
      .from('team_members')
      .select('role')
      .eq('team_id', teamId)
      .eq('user_id', user.id)
      .single()

    const isSelf = targetMember.user_id === user.id
    const isAdmin = membership && ['owner', 'admin'].includes(membership.role)

    if (!isSelf && !isAdmin) {
      return NextResponse.json(
        { error: 'You do not have permission to remove this member' },
        { status: 403 }
      )
    }

    // Remove member
    const { error: deleteError } = await supabase
      .from('team_members')
      .delete()
      .eq('id', memberId)

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }

    return NextResponse.json({
      message: isSelf ? 'You have left the team' : 'Member removed successfully',
    })
  } catch (error) {
    console.error('Team members DELETE error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
