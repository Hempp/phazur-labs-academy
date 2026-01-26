'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Users,
  Plus,
  Loader2,
  BookOpen,
  Settings,
  Crown,
  Shield,
  User,
  ArrowRight,
  Building2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface Team {
  id: string
  name: string
  slug: string
  description: string | null
  logo_url: string | null
  is_active: boolean
  created_at: string
  owner: {
    id: string
    full_name: string
    avatar_url: string | null
  } | null
  member_count: number
  course_count: number
  user_role: 'owner' | 'admin' | 'member'
}

const roleConfig = {
  owner: { label: 'Owner', icon: Crown, color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/50' },
  admin: { label: 'Admin', icon: Shield, color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/50' },
  member: { label: 'Member', icon: User, color: 'text-gray-600 bg-gray-100 dark:bg-gray-800' },
}

function TeamCard({ team }: { team: Team }) {
  const role = roleConfig[team.user_role]
  const RoleIcon = role.icon

  return (
    <Link href={`/dashboard/teams/${team.id}`}>
      <Card className="group hover:shadow-md hover:border-primary/50 transition-all cursor-pointer h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                {team.logo_url ? (
                  <img src={team.logo_url} alt={team.name} className="h-10 w-10 rounded-md object-cover" />
                ) : (
                  <Building2 className="h-6 w-6 text-primary" />
                )}
              </div>
              <div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {team.name}
                </CardTitle>
                <div className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium mt-1', role.color)}>
                  <RoleIcon className="h-3 w-3" />
                  {role.label}
                </div>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </CardHeader>
        <CardContent>
          {team.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {team.description}
            </p>
          )}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              <span>{team.member_count} {team.member_count === 1 ? 'member' : 'members'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" />
              <span>{team.course_count} {team.course_count === 1 ? 'course' : 'courses'}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function CreateTeamCard() {
  return (
    <Link href="/dashboard/teams/create">
      <Card className="group hover:shadow-md hover:border-primary/50 transition-all cursor-pointer h-full border-dashed">
        <CardContent className="flex flex-col items-center justify-center h-full min-h-[200px] text-center">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
            <Plus className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold group-hover:text-primary transition-colors">Create a Team</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Start a new team for your organization
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch('/api/teams')
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to load teams')
        }

        setTeams(data.teams || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong')
      } finally {
        setLoading(false)
      }
    }

    fetchTeams()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Teams</h1>
          <p className="text-muted-foreground">
            Manage your teams and collaborate with others
          </p>
        </div>
        <Link href="/dashboard/teams/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Team
          </Button>
        </Link>
      </div>

      {error && (
        <div className="p-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg">
          {error}
        </div>
      )}

      {/* Teams Grid */}
      {teams.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No teams yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              You&apos;re not a member of any teams. Create one to start collaborating with your organization or wait for an invitation.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/dashboard/teams/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Team
                </Button>
              </Link>
              <Link href="/teams">
                <Button variant="outline">
                  Learn About Teams
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
          <CreateTeamCard />
        </div>
      )}

      {/* Teams Info */}
      {teams.length > 0 && (
        <Card className="bg-muted/50">
          <CardContent className="py-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Team Learning Benefits</p>
                  <p className="text-sm text-muted-foreground">
                    Access shared courses, track team progress, and learn together
                  </p>
                </div>
              </div>
              <Link href="/teams">
                <Button variant="outline" size="sm">
                  Learn More
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
