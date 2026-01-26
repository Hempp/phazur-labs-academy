'use client'

import { cn } from '@/lib/utils'
import {
  Trophy,
  Star,
  Flame,
  Target,
  MessageSquare,
  Award,
  Sparkles,
  Lock,
} from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Progress } from '@/components/ui/progress'

interface AchievementBadgeProps {
  name: string
  description: string
  category: string
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  iconUrl?: string | null
  pointsReward: number
  isSecret?: boolean
  unlocked: boolean
  unlockedAt?: string | null
  progress?: {
    current: number
    target: number
    percentage: number
  } | null
  size?: 'sm' | 'md' | 'lg'
  showTooltip?: boolean
  onClick?: () => void
}

const rarityConfig = {
  common: {
    bg: 'bg-slate-100 dark:bg-slate-800',
    border: 'border-slate-300 dark:border-slate-600',
    text: 'text-slate-600 dark:text-slate-400',
    glow: '',
  },
  uncommon: {
    bg: 'bg-emerald-50 dark:bg-emerald-950',
    border: 'border-emerald-300 dark:border-emerald-700',
    text: 'text-emerald-600 dark:text-emerald-400',
    glow: '',
  },
  rare: {
    bg: 'bg-blue-50 dark:bg-blue-950',
    border: 'border-blue-300 dark:border-blue-700',
    text: 'text-blue-600 dark:text-blue-400',
    glow: 'shadow-blue-200/50 dark:shadow-blue-500/20',
  },
  epic: {
    bg: 'bg-purple-50 dark:bg-purple-950',
    border: 'border-purple-300 dark:border-purple-700',
    text: 'text-purple-600 dark:text-purple-400',
    glow: 'shadow-purple-200/50 dark:shadow-purple-500/30',
  },
  legendary: {
    bg: 'bg-amber-50 dark:bg-amber-950',
    border: 'border-amber-300 dark:border-amber-700',
    text: 'text-amber-600 dark:text-amber-400',
    glow: 'shadow-amber-200/50 dark:shadow-amber-500/40 animate-pulse',
  },
}

const categoryIcons: Record<string, typeof Trophy> = {
  learning: Trophy,
  engagement: MessageSquare,
  consistency: Flame,
  mastery: Target,
  social: Star,
  milestone: Award,
}

const sizeConfig = {
  sm: {
    container: 'w-12 h-12',
    icon: 'h-5 w-5',
    fontSize: 'text-xs',
  },
  md: {
    container: 'w-16 h-16',
    icon: 'h-6 w-6',
    fontSize: 'text-sm',
  },
  lg: {
    container: 'w-20 h-20',
    icon: 'h-8 w-8',
    fontSize: 'text-base',
  },
}

export function AchievementBadge({
  name,
  description,
  category,
  rarity,
  pointsReward,
  isSecret = false,
  unlocked,
  unlockedAt,
  progress,
  size = 'md',
  showTooltip = true,
  onClick,
}: AchievementBadgeProps) {
  const rarityStyle = rarityConfig[rarity]
  const sizeStyle = sizeConfig[size]
  const Icon = categoryIcons[category] || Trophy

  const badge = (
    <div
      className={cn(
        'relative flex flex-col items-center cursor-pointer transition-transform hover:scale-105',
        onClick && 'cursor-pointer'
      )}
      onClick={onClick}
    >
      {/* Badge container */}
      <div
        className={cn(
          'rounded-full border-2 flex items-center justify-center transition-all',
          sizeStyle.container,
          unlocked ? rarityStyle.bg : 'bg-gray-100 dark:bg-gray-800',
          unlocked ? rarityStyle.border : 'border-gray-300 dark:border-gray-600',
          unlocked && rarityStyle.glow && `shadow-lg ${rarityStyle.glow}`,
          !unlocked && 'opacity-60 grayscale'
        )}
      >
        {isSecret && !unlocked ? (
          <Lock className={cn(sizeStyle.icon, 'text-gray-400')} />
        ) : (
          <Icon
            className={cn(
              sizeStyle.icon,
              unlocked ? rarityStyle.text : 'text-gray-400'
            )}
          />
        )}
      </div>

      {/* Name */}
      {size !== 'sm' && (
        <span
          className={cn(
            'mt-1 font-medium text-center line-clamp-1 max-w-20',
            sizeStyle.fontSize,
            unlocked ? 'text-foreground' : 'text-muted-foreground'
          )}
        >
          {isSecret && !unlocked ? '???' : name}
        </span>
      )}

      {/* Progress bar (only if not unlocked and has progress) */}
      {!unlocked && progress && size !== 'sm' && (
        <div className="w-full mt-1 px-1">
          <Progress value={progress.percentage} className="h-1" />
          <span className="text-[10px] text-muted-foreground">
            {progress.current}/{progress.target}
          </span>
        </div>
      )}

      {/* Points reward indicator */}
      {unlocked && pointsReward > 0 && size !== 'sm' && (
        <div className="flex items-center gap-0.5 mt-0.5">
          <Sparkles className="h-3 w-3 text-amber-500" />
          <span className="text-[10px] text-amber-600 font-medium">
            +{pointsReward}
          </span>
        </div>
      )}
    </div>
  )

  if (!showTooltip) {
    return badge
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{badge}</TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="space-y-1">
            <div className="font-semibold">
              {isSecret && !unlocked ? 'Secret Achievement' : name}
            </div>
            <p className="text-xs text-muted-foreground">
              {isSecret && !unlocked ? 'Keep exploring to unlock!' : description}
            </p>
            {unlocked && unlockedAt && (
              <p className="text-xs text-emerald-600">
                Unlocked {new Date(unlockedAt).toLocaleDateString()}
              </p>
            )}
            {!unlocked && progress && (
              <p className="text-xs text-blue-600">
                Progress: {progress.current}/{progress.target} ({progress.percentage}%)
              </p>
            )}
            {pointsReward > 0 && (
              <p className="text-xs font-medium text-amber-600">
                +{pointsReward} points
              </p>
            )}
            <div className="flex items-center gap-2 pt-1">
              <span
                className={cn(
                  'text-[10px] uppercase font-medium px-1.5 py-0.5 rounded',
                  rarityStyle.bg,
                  rarityStyle.text
                )}
              >
                {rarity}
              </span>
              <span className="text-[10px] text-muted-foreground capitalize">
                {category}
              </span>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
