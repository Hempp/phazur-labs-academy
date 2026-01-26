'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import {
  Users,
  Crown,
  Shield,
  User,
  ArrowLeft,
  Loader2,
  MoreHorizontal,
  UserMinus,
  ShieldCheck,
  ShieldOff,
  Search,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface TeamMember {
  id: string
  role: 'owner' | 'admin' | 'member'
  joined_at: string
  user: {
    id: string
    full_name: string
    email: string
    avatar_url: string | null
  } | null
  invited_by: {
    id: string
    full_name: string
  } | null
}

const roleConfig = {
  owner: { label: 'Owner', icon: Crown, color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/50' },
  admin: { label: 'Admin', icon: Shield, color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/50' },
  member: { label: 'Member', icon: User, color: 'text-gray-600 bg-gray-100 dark:bg-gray-800' },
}

export default function TeamMembersPage({
  params,
}: {
  params: Promise<{ teamId: string }>
}) {
  const { teamId } = use(params)
  const [members, setMembers] = useState<TeamMember[]>([])
  const [userRole, setUserRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  const isOwner = userRole === 'owner'
  const isAdmin = userRole === 'owner' || userRole === 'admin'

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        // Fetch team info to get user role
        const teamResponse = await fetch(`/api/teams/${teamId}`)
        const teamData = await teamResponse.json()

        if (!teamResponse.ok) {
          throw new Error(teamData.error || 'Failed to load team')
        }

        setUserRole(teamData.team.user_role)

        // Fetch members
        const membersResponse = await fetch(`/api/teams/${teamId}/members`)
        const membersData = await membersResponse.json()

        if (!membersResponse.ok) {
          throw new Error(membersData.error || 'Failed to load members')
        }

        setMembers(membersData.members || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong')
      } finally {
        setLoading(false)
      }
    }

    fetchMembers()
  }, [teamId])

  const handleRoleChange = async (memberId: string, newRole: 'admin' | 'member') => {
    if (!isOwner) return

    setActionLoading(memberId)
    try {
      const response = await fetch(`/api/teams/${teamId}/members`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId, role: newRole }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update role')
      }

      setMembers(members.map(m =>
        m.id === memberId ? { ...m, role: newRole } : m
      ))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update role')
    } finally {
      setActionLoading(null)
      setOpenMenu(null)
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to remove this member from the team?')) return

    setActionLoading(memberId)
    try {
      const response = await fetch(`/api/teams/${teamId}/members?memberId=${memberId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to remove member')
      }

      setMembers(members.filter(m => m.id !== memberId))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to remove member')
    } finally {
      setActionLoading(null)
      setOpenMenu(null)
    }
  }

  const filteredMembers = members.filter(member =>
    member.user?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.user?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Sort by role (owner first, then admin, then member)
  const sortedMembers = [...filteredMembers].sort((a, b) => {
    const roleOrder = { owner: 0, admin: 1, member: 2 }
    return roleOrder[a.role] - roleOrder[b.role]
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Link
          href={`/dashboard/teams/${teamId}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Team
        </Link>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        href={`/dashboard/teams/${teamId}`}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Team
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Team Members</h1>
          <p className="text-muted-foreground">
            {members.length} {members.length === 1 ? 'member' : 'members'}
          </p>
        </div>
        {isAdmin && (
          <Link href={`/dashboard/teams/${teamId}/invitations`}>
            <Button>
              <Users className="h-4 w-4 mr-2" />
              Invite Members
            </Button>
          </Link>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search members..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Members List */}
      <Card>
        <CardContent className="p-0">
          {sortedMembers.length === 0 ? (
            <div className="py-12 text-center">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">
                {searchQuery ? 'No members found' : 'No members yet'}
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {sortedMembers.map((member) => {
                const role = roleConfig[member.role]
                const RoleIcon = role.icon
                const canManage = isAdmin && member.role !== 'owner'

                return (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                        {member.user?.avatar_url ? (
                          <img
                            src={member.user.avatar_url}
                            alt={member.user.full_name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-sm font-medium">
                            {member.user?.full_name?.charAt(0) || '?'}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{member.user?.full_name || 'Unknown'}</p>
                        <p className="text-sm text-muted-foreground">{member.user?.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium', role.color)}>
                        <RoleIcon className="h-3 w-3" />
                        {role.label}
                      </span>

                      {canManage && (
                        <div className="relative">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setOpenMenu(openMenu === member.id ? null : member.id)}
                            disabled={actionLoading === member.id}
                          >
                            {actionLoading === member.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <MoreHorizontal className="h-4 w-4" />
                            )}
                          </Button>

                          {openMenu === member.id && (
                            <>
                              <div
                                className="fixed inset-0 z-40"
                                onClick={() => setOpenMenu(null)}
                              />
                              <div className="absolute right-0 mt-1 w-48 bg-card rounded-lg border shadow-lg py-1 z-50">
                                {isOwner && (
                                  <>
                                    {member.role === 'member' ? (
                                      <button
                                        onClick={() => handleRoleChange(member.id, 'admin')}
                                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted w-full text-left"
                                      >
                                        <ShieldCheck className="h-4 w-4" />
                                        Make Admin
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => handleRoleChange(member.id, 'member')}
                                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted w-full text-left"
                                      >
                                        <ShieldOff className="h-4 w-4" />
                                        Remove Admin
                                      </button>
                                    )}
                                    <div className="border-t my-1" />
                                  </>
                                )}
                                <button
                                  onClick={() => handleRemoveMember(member.id)}
                                  className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted w-full text-left text-red-600"
                                >
                                  <UserMinus className="h-4 w-4" />
                                  Remove from Team
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Role Legend */}
      <Card className="bg-muted/50">
        <CardContent className="py-4">
          <h4 className="font-medium mb-3">Team Roles</h4>
          <div className="grid gap-2 sm:grid-cols-3">
            {Object.entries(roleConfig).map(([key, config]) => {
              const Icon = config.icon
              return (
                <div key={key} className="flex items-center gap-2">
                  <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium', config.color)}>
                    <Icon className="h-3 w-3" />
                    {config.label}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {key === 'owner' && '- Full control'}
                    {key === 'admin' && '- Manage members'}
                    {key === 'member' && '- Access courses'}
                  </span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
