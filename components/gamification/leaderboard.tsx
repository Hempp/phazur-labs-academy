'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Trophy, Medal, Award, Crown, ChevronUp, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface LeaderboardEntry {
  rank: number
  user_id: string
  user_name: string
  user_avatar_url: string | null
  points: number
}

interface LeaderboardProps {
  className?: string
  limit?: number
  showTabs?: boolean
  defaultType?: 'all_time' | 'weekly' | 'monthly'
  currentUserId?: string
}

export function Leaderboard({
  className,
  limit = 10,
  showTabs = true,
  defaultType = 'all_time',
  currentUserId,
}: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [type, setType] = useState<'all_time' | 'weekly' | 'monthly'>(defaultType)
  const [userPosition, setUserPosition] = useState<{
    rank: number
    points: number
    in_top: boolean
  } | null>(null)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(
          `/api/gamification/leaderboard?type=${type}&limit=${limit}`
        )
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to load leaderboard')
        }

        setLeaderboard(data.leaderboard || [])
        setUserPosition(data.user_position)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load leaderboard')
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [type, limit])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-amber-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Medal className="h-5 w-5 text-amber-700" />
      default:
        return (
          <span className="w-5 text-center text-sm font-medium text-muted-foreground">
            {rank}
          </span>
        )
    }
  }

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800'
      case 2:
        return 'bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700'
      case 3:
        return 'bg-orange-50 dark:bg-orange-950/50 border-orange-200 dark:border-orange-800'
      default:
        return 'hover:bg-muted/50'
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const formatPoints = (points: number) => {
    if (points >= 10000) {
      return `${(points / 1000).toFixed(1)}k`
    }
    return points.toLocaleString()
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            Leaderboard
          </CardTitle>
          {showTabs && (
            <Tabs
              value={type}
              onValueChange={v => setType(v as typeof type)}
              className="w-auto"
            >
              <TabsList className="h-8">
                <TabsTrigger value="all_time" className="text-xs px-2">
                  All Time
                </TabsTrigger>
                <TabsTrigger value="weekly" className="text-xs px-2">
                  Week
                </TabsTrigger>
                <TabsTrigger value="monthly" className="text-xs px-2">
                  Month
                </TabsTrigger>
              </TabsList>
            </Tabs>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-sm text-muted-foreground">
            {error}
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-8">
            <Award className="h-12 w-12 text-muted-foreground/50 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              No rankings yet. Start learning to climb the leaderboard!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {leaderboard.map(entry => {
              const isCurrentUser = currentUserId === entry.user_id
              return (
                <div
                  key={entry.user_id}
                  className={cn(
                    'flex items-center gap-3 p-2 rounded-lg border transition-colors',
                    getRankBg(entry.rank),
                    isCurrentUser && 'ring-2 ring-primary/50'
                  )}
                >
                  {/* Rank */}
                  <div className="w-8 flex justify-center">
                    {getRankIcon(entry.rank)}
                  </div>

                  {/* Avatar */}
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={entry.user_avatar_url || undefined} />
                    <AvatarFallback className="text-xs">
                      {getInitials(entry.user_name)}
                    </AvatarFallback>
                  </Avatar>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <span
                      className={cn(
                        'font-medium truncate block text-sm',
                        isCurrentUser && 'text-primary'
                      )}
                    >
                      {entry.user_name}
                      {isCurrentUser && ' (You)'}
                    </span>
                  </div>

                  {/* Points */}
                  <div className="text-right">
                    <span className="font-bold text-sm">
                      {formatPoints(entry.points)}
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">pts</span>
                  </div>
                </div>
              )
            })}

            {/* Current user position if not in top */}
            {userPosition && !userPosition.in_top && (
              <>
                <div className="flex items-center justify-center py-1">
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground mx-2">
                    ... {userPosition.rank - limit - 1} more ...
                  </span>
                  <ChevronUp className="h-4 w-4 text-muted-foreground rotate-180" />
                </div>
                <div
                  className={cn(
                    'flex items-center gap-3 p-2 rounded-lg border transition-colors',
                    'ring-2 ring-primary/50 bg-primary/5'
                  )}
                >
                  <div className="w-8 flex justify-center">
                    <span className="w-5 text-center text-sm font-medium text-muted-foreground">
                      {userPosition.rank}
                    </span>
                  </div>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">You</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <span className="font-medium truncate block text-sm text-primary">
                      You
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-sm">
                      {formatPoints(userPosition.points)}
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">pts</span>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
