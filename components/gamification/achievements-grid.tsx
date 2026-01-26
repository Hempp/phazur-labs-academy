'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Trophy, Filter, Loader2, Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { AchievementBadge } from './achievement-badge'

interface Achievement {
  id: string
  name: string
  slug: string
  description: string
  category: string
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  icon_url: string | null
  points_reward: number
  is_secret: boolean
  unlocked: boolean
  unlocked_at: string | null
  is_featured: boolean
  progress: {
    current: number
    target: number
    percentage: number
  } | null
}

interface AchievementsGridProps {
  className?: string
  showFilters?: boolean
  compact?: boolean
}

const categories = [
  { value: 'all', label: 'All' },
  { value: 'learning', label: 'Learning' },
  { value: 'mastery', label: 'Mastery' },
  { value: 'consistency', label: 'Consistency' },
  { value: 'engagement', label: 'Engagement' },
  { value: 'milestone', label: 'Milestones' },
]

const rarityOrder = ['legendary', 'epic', 'rare', 'uncommon', 'common']

export function AchievementsGrid({
  className,
  showFilters = true,
  compact = false,
}: AchievementsGridProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false)

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        setLoading(true)
        setError(null)

        const params = new URLSearchParams({ includeProgress: 'true' })
        if (selectedCategory !== 'all') {
          params.append('category', selectedCategory)
        }

        const response = await fetch(`/api/achievements?${params}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to load achievements')
        }

        setAchievements(data.achievements || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load achievements')
      } finally {
        setLoading(false)
      }
    }

    fetchAchievements()
  }, [selectedCategory])

  // Filter and sort achievements
  const filteredAchievements = achievements
    .filter(a => !showUnlockedOnly || a.unlocked)
    .sort((a, b) => {
      // Sort by unlocked status first (unlocked at top)
      if (a.unlocked !== b.unlocked) return a.unlocked ? -1 : 1
      // Then by rarity (higher rarity first)
      const rarityDiff = rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity)
      if (rarityDiff !== 0) return rarityDiff
      // Finally by progress percentage
      const aProgress = a.progress?.percentage || 0
      const bProgress = b.progress?.percentage || 0
      return bProgress - aProgress
    })

  // Calculate stats
  const totalAchievements = achievements.length
  const unlockedCount = achievements.filter(a => a.unlocked).length
  const totalPoints = achievements
    .filter(a => a.unlocked)
    .reduce((sum, a) => sum + a.points_reward, 0)
  const progressPercentage = totalAchievements > 0
    ? Math.round((unlockedCount / totalAchievements) * 100)
    : 0

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="text-center py-8">
          <p className="text-sm text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            Achievements
          </CardTitle>

          {showFilters && (
            <div className="flex items-center gap-2">
              <Button
                variant={showUnlockedOnly ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setShowUnlockedOnly(!showUnlockedOnly)}
              >
                {showUnlockedOnly ? 'Unlocked' : 'All'}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-1" />
                    {categories.find(c => c.value === selectedCategory)?.label}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {categories.map(cat => (
                    <DropdownMenuItem
                      key={cat.value}
                      onClick={() => setSelectedCategory(cat.value)}
                    >
                      {cat.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        {/* Progress summary */}
        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {unlockedCount} of {totalAchievements} unlocked
            </span>
            <div className="flex items-center gap-1">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span className="font-medium">{totalPoints.toLocaleString()} pts</span>
            </div>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </CardHeader>

      <CardContent>
        {filteredAchievements.length === 0 ? (
          <div className="text-center py-8">
            <Trophy className="h-12 w-12 text-muted-foreground/50 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              {showUnlockedOnly
                ? 'No achievements unlocked yet. Start learning!'
                : 'No achievements found.'}
            </p>
          </div>
        ) : (
          <div
            className={cn(
              'grid gap-4',
              compact
                ? 'grid-cols-6 sm:grid-cols-8 md:grid-cols-10'
                : 'grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6'
            )}
          >
            {filteredAchievements.map(achievement => (
              <AchievementBadge
                key={achievement.id}
                name={achievement.name}
                description={achievement.description}
                category={achievement.category}
                rarity={achievement.rarity}
                iconUrl={achievement.icon_url}
                pointsReward={achievement.points_reward}
                isSecret={achievement.is_secret}
                unlocked={achievement.unlocked}
                unlockedAt={achievement.unlocked_at}
                progress={achievement.progress}
                size={compact ? 'sm' : 'md'}
              />
            ))}
          </div>
        )}

        {/* Category breakdown */}
        {!compact && selectedCategory === 'all' && (
          <div className="mt-6 pt-4 border-t">
            <h4 className="text-sm font-medium mb-3">By Category</h4>
            <div className="flex flex-wrap gap-2">
              {categories.slice(1).map(cat => {
                const catAchievements = achievements.filter(
                  a => a.category === cat.value
                )
                const catUnlocked = catAchievements.filter(a => a.unlocked).length
                return (
                  <Badge
                    key={cat.value}
                    variant="secondary"
                    className="cursor-pointer hover:bg-secondary/80"
                    onClick={() => setSelectedCategory(cat.value)}
                  >
                    {cat.label}: {catUnlocked}/{catAchievements.length}
                  </Badge>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
