'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import {
  Users,
  BookOpen,
  Settings,
  Mail,
  Crown,
  Shield,
  User,
  ArrowLeft,
  Loader2,
  Plus,
  MoreHorizontal,
  Building2,
  Calendar,
  UserPlus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
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
}

interface TeamCourse {
  id: string
  granted_at: string
  expires_at: string | null
  course: {
    id: string
    title: string
    slug: string
    thumbnail_url: string | null
  } | null
}

interface Team {
  id: string
  name: string
  slug: string
  description: string | null
  logo_url: string | null
  is_active: boolean
  max_members: number
  created_at: string
  owner: {
    id: string
    full_name: string
    avatar_url: string | null
  } | null
  member_count: number
  course_count: number
  members: TeamMember[]
  courses: TeamCourse[]
  user_role: 'owner' | 'admin' | 'member'
}

const roleConfig = {
  owner: { label: 'Owner', icon: Crown, color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/50' },
  admin: { label: 'Admin', icon: Shield, color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/50' },
  member: { label: 'Member', icon: User, color: 'text-gray-600 bg-gray-100 dark:bg-gray-800' },
}

function MemberAvatar({ member }: { member: TeamMember }) {
  const role = roleConfig[member.role]
  const RoleIcon = role.icon

  return (
    <div className="relative">
      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
        {member.user?.avatar_url ? (
          <img src={member.user.avatar_url} alt={member.user.full_name} className="h-full w-full object-cover" />
        ) : (
          <span className="text-sm font-medium">
            {member.user?.full_name?.charAt(0) || '?'}
          </span>
        )}
      </div>
      <div className={cn('absolute -bottom-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center', role.color)}>
        <RoleIcon className="h-3 w-3" />
      </div>
    </div>
  )
}

export default function TeamOverviewPage({
  params,
}: {
  params: Promise<{ teamId: string }>
}) {
  const { teamId } = use(params)
  const [team, setTeam] = useState<Team | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const isAdmin = team?.user_role === 'owner' || team?.user_role === 'admin'

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await fetch(`/api/teams/${teamId}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to load team')
        }

        setTeam(data.team)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong')
      } finally {
        setLoading(false)
      }
    }

    fetchTeam()
  }, [teamId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !team) {
    return (
      <div className="space-y-4">
        <Link
          href="/dashboard/teams"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Teams
        </Link>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-red-600">{error || 'Team not found'}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const userRole = roleConfig[team.user_role]
  const UserRoleIcon = userRole.icon

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        href="/dashboard/teams"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Teams
      </Link>

      {/* Team Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            {team.logo_url ? (
              <img src={team.logo_url} alt={team.name} className="h-14 w-14 rounded-lg object-cover" />
            ) : (
              <Building2 className="h-8 w-8 text-primary" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{team.name}</h1>
            {team.description && (
              <p className="text-muted-foreground mt-1">{team.description}</p>
            )}
            <div className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium mt-2', userRole.color)}>
              <UserRoleIcon className="h-3.5 w-3.5" />
              You are {userRole.label === 'Owner' ? 'the' : 'a'} {userRole.label}
            </div>
          </div>
        </div>

        {isAdmin && (
          <div className="flex gap-2">
            <Link href={`/dashboard/teams/${teamId}/invitations`}>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Invite Members
              </Button>
            </Link>
            <Link href={`/dashboard/teams/${teamId}/settings`}>
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{team.member_count}</p>
                <p className="text-sm text-muted-foreground">Members</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{team.course_count}</p>
                <p className="text-sm text-muted-foreground">Courses</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {new Date(team.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </p>
                <p className="text-sm text-muted-foreground">Created</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link href={`/dashboard/teams/${teamId}/members`}>
          <Card className="hover:shadow-md hover:border-primary/50 transition-all cursor-pointer h-full">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Members</p>
                  <p className="text-sm text-muted-foreground">View & manage</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
        {isAdmin && (
          <Link href={`/dashboard/teams/${teamId}/invitations`}>
            <Card className="hover:shadow-md hover:border-primary/50 transition-all cursor-pointer h-full">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Invitations</p>
                    <p className="text-sm text-muted-foreground">Invite new members</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        )}
        <Link href={`/dashboard/teams/${teamId}/courses`}>
          <Card className="hover:shadow-md hover:border-primary/50 transition-all cursor-pointer h-full">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Courses</p>
                  <p className="text-sm text-muted-foreground">Team courses</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
        {isAdmin && (
          <Link href={`/dashboard/teams/${teamId}/settings`}>
            <Card className="hover:shadow-md hover:border-primary/50 transition-all cursor-pointer h-full">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Settings className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Settings</p>
                    <p className="text-sm text-muted-foreground">Team configuration</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        )}
      </div>

      {/* Members Preview */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>
              {team.member_count} of {team.max_members} seats used
            </CardDescription>
          </div>
          <Link href={`/dashboard/teams/${teamId}/members`}>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {team.members.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No members yet
            </p>
          ) : (
            <div className="space-y-3">
              {team.members.slice(0, 5).map((member) => (
                <div key={member.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MemberAvatar member={member} />
                    <div>
                      <p className="font-medium">{member.user?.full_name || 'Unknown'}</p>
                      <p className="text-sm text-muted-foreground">{member.user?.email}</p>
                    </div>
                  </div>
                  <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', roleConfig[member.role].color)}>
                    {roleConfig[member.role].label}
                  </span>
                </div>
              ))}
              {team.members.length > 5 && (
                <p className="text-sm text-muted-foreground text-center pt-2">
                  +{team.members.length - 5} more members
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Courses Preview */}
      {team.courses.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Team Courses</CardTitle>
              <CardDescription>
                Courses available to all team members
              </CardDescription>
            </div>
            <Link href={`/dashboard/teams/${teamId}/courses`}>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {team.courses.slice(0, 4).map((access) => (
                <Link
                  key={access.id}
                  href={`/courses/${access.course?.slug}`}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="h-12 w-16 rounded bg-muted flex-shrink-0 overflow-hidden">
                    {access.course?.thumbnail_url ? (
                      <img
                        src={access.course.thumbnail_url}
                        alt={access.course.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium truncate">{access.course?.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Added {new Date(access.granted_at).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
