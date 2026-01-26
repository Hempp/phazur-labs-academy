'use client'

import { cn } from '@/lib/utils'
import { Flame, AlertCircle, Snowflake } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface StreakDisplayProps {
  currentStreak: number
  longestStreak: number
  streakStatus: 'active' | 'at_risk' | 'broken'
  lastActivityDate?: string | null
  size?: 'sm' | 'md' | 'lg'
  showLongest?: boolean
  className?: string
}

export function StreakDisplay({
  currentStreak,
  longestStreak,
  streakStatus,
  lastActivityDate,
  size = 'md',
  showLongest = true,
  className,
}: StreakDisplayProps) {
  const getStreakColor = () => {
    if (currentStreak === 0) return 'text-gray-400'
    if (currentStreak >= 30) return 'text-orange-500'
    if (currentStreak >= 14) return 'text-amber-500'
    if (currentStreak >= 7) return 'text-yellow-500'
    return 'text-orange-400'
  }

  const getStreakBg = () => {
    if (currentStreak === 0) return 'bg-gray-100 dark:bg-gray-800'
    if (currentStreak >= 30) return 'bg-orange-100 dark:bg-orange-950'
    if (currentStreak >= 14) return 'bg-amber-100 dark:bg-amber-950'
    if (currentStreak >= 7) return 'bg-yellow-100 dark:bg-yellow-950'
    return 'bg-orange-50 dark:bg-orange-950'
  }

  const getStatusMessage = () => {
    switch (streakStatus) {
      case 'active':
        return currentStreak > 0 ? "You're on fire!" : 'Start your streak!'
      case 'at_risk':
        return 'Learn today to keep your streak!'
      case 'broken':
        return 'Your streak was reset'
    }
  }

  const sizeClasses = {
    sm: {
      container: 'p-2',
      icon: 'h-5 w-5',
      number: 'text-xl',
      label: 'text-xs',
    },
    md: {
      container: 'p-4',
      icon: 'h-8 w-8',
      number: 'text-3xl',
      label: 'text-sm',
    },
    lg: {
      container: 'p-6',
      icon: 'h-12 w-12',
      number: 'text-5xl',
      label: 'text-base',
    },
  }

  const sizes = sizeClasses[size]

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className={cn(sizes.container, 'flex flex-col items-center')}>
        {/* Streak flame icon with animation */}
        <div
          className={cn(
            'rounded-full p-3 mb-2',
            getStreakBg(),
            currentStreak >= 7 && 'animate-pulse'
          )}
        >
          {streakStatus === 'broken' ? (
            <Snowflake className={cn(sizes.icon, 'text-blue-400')} />
          ) : (
            <Flame
              className={cn(
                sizes.icon,
                getStreakColor(),
                currentStreak >= 14 && 'animate-bounce'
              )}
            />
          )}
        </div>

        {/* Current streak number */}
        <div className="text-center">
          <span className={cn(sizes.number, 'font-bold', getStreakColor())}>
            {currentStreak}
          </span>
          <span className={cn(sizes.label, 'text-muted-foreground ml-1')}>
            {currentStreak === 1 ? 'day' : 'days'}
          </span>
        </div>

        {/* Status message */}
        <div className="flex items-center gap-1 mt-1">
          {streakStatus === 'at_risk' && (
            <AlertCircle className="h-3 w-3 text-amber-500" />
          )}
          <span
            className={cn(
              sizes.label,
              streakStatus === 'at_risk'
                ? 'text-amber-600 font-medium'
                : 'text-muted-foreground'
            )}
          >
            {getStatusMessage()}
          </span>
        </div>

        {/* Longest streak */}
        {showLongest && longestStreak > 0 && (
          <div className="mt-3 pt-3 border-t w-full text-center">
            <span className={cn(sizes.label, 'text-muted-foreground')}>
              Longest streak:{' '}
              <span className="font-semibold text-foreground">
                {longestStreak} days
              </span>
            </span>
          </div>
        )}

        {/* Last activity */}
        {lastActivityDate && size !== 'sm' && (
          <span className="text-xs text-muted-foreground mt-1">
            Last active: {new Date(lastActivityDate).toLocaleDateString()}
          </span>
        )}
      </CardContent>
    </Card>
  )
}

// Compact inline version for headers/dashboards
export function StreakBadge({
  currentStreak,
  streakStatus,
  className,
}: {
  currentStreak: number
  streakStatus: 'active' | 'at_risk' | 'broken'
  className?: string
}) {
  const getColor = () => {
    if (currentStreak === 0) return 'text-gray-400 bg-gray-100 dark:bg-gray-800'
    if (streakStatus === 'at_risk') return 'text-amber-600 bg-amber-100 dark:bg-amber-900'
    if (currentStreak >= 30) return 'text-orange-600 bg-orange-100 dark:bg-orange-900'
    if (currentStreak >= 7) return 'text-amber-600 bg-amber-100 dark:bg-amber-900'
    return 'text-orange-500 bg-orange-100 dark:bg-orange-900'
  }

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-sm font-medium',
        getColor(),
        streakStatus === 'at_risk' && 'ring-2 ring-amber-300 animate-pulse',
        className
      )}
    >
      <Flame className="h-3.5 w-3.5" />
      <span>{currentStreak}</span>
    </div>
  )
}
