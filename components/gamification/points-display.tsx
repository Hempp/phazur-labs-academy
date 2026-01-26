'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Sparkles, TrendingUp, Calendar, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface PointsStats {
  total_points: number
  weekly_points: number
  monthly_points: number
  rank?: number
}

interface PointsDisplayProps {
  className?: string
  showRank?: boolean
  variant?: 'card' | 'compact' | 'inline'
}

export function PointsDisplay({
  className,
  showRank = true,
  variant = 'card',
}: PointsDisplayProps) {
  const [stats, setStats] = useState<PointsStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/gamification/stats')
        const data = await response.json()

        if (response.ok) {
          setStats({
            total_points: data.stats?.total_points || 0,
            weekly_points: data.stats?.weekly_points || 0,
            monthly_points: data.stats?.monthly_points || 0,
            rank: data.rank,
          })
        }
      } catch (err) {
        console.error('Error fetching points:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const formatNumber = (num: number) => {
    if (num >= 10000) {
      return `${(num / 1000).toFixed(1)}k`
    }
    return num.toLocaleString()
  }

  if (loading) {
    if (variant === 'inline') {
      return <Loader2 className="h-4 w-4 animate-spin" />
    }
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (!stats) return null

  // Inline variant - just shows total points
  if (variant === 'inline') {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full',
          'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300',
          className
        )}
      >
        <Sparkles className="h-3.5 w-3.5" />
        <span className="font-semibold text-sm">
          {formatNumber(stats.total_points)}
        </span>
      </div>
    )
  }

  // Compact variant - single row
  if (variant === 'compact') {
    return (
      <div
        className={cn(
          'flex items-center gap-4 p-3 rounded-lg bg-muted/50',
          className
        )}
      >
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-full bg-amber-100 dark:bg-amber-900/50">
            <Sparkles className="h-4 w-4 text-amber-600" />
          </div>
          <div>
            <p className="text-lg font-bold">{formatNumber(stats.total_points)}</p>
            <p className="text-xs text-muted-foreground">Total Points</p>
          </div>
        </div>

        <div className="h-8 w-px bg-border" />

        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">+{formatNumber(stats.weekly_points)}</p>
            <p className="text-xs text-muted-foreground">This Week</p>
          </div>
        </div>

        {showRank && stats.rank && (
          <>
            <div className="h-8 w-px bg-border" />
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              <div>
                <p className="text-sm font-medium">#{stats.rank}</p>
                <p className="text-xs text-muted-foreground">Rank</p>
              </div>
            </div>
          </>
        )}
      </div>
    )
  }

  // Card variant - full display
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="h-5 w-5 text-amber-500" />
          Points
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Total points - large display */}
          <div className="text-center py-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/50 rounded-lg">
            <p className="text-4xl font-bold text-amber-600 dark:text-amber-400">
              {formatNumber(stats.total_points)}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Total Points</p>
          </div>

          {/* Weekly and monthly */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-muted/50 text-center">
              <p className="text-xl font-semibold">
                +{formatNumber(stats.weekly_points)}
              </p>
              <p className="text-xs text-muted-foreground">This Week</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50 text-center">
              <p className="text-xl font-semibold">
                +{formatNumber(stats.monthly_points)}
              </p>
              <p className="text-xs text-muted-foreground">This Month</p>
            </div>
          </div>

          {/* Rank */}
          {showRank && stats.rank && (
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-500" />
                <span className="text-sm">Global Rank</span>
              </div>
              <span className="font-bold">#{stats.rank}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
