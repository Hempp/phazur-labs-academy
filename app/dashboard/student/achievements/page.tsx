'use client'

import { useState, useEffect } from 'react'
import { Trophy, Flame, Star, Target, TrendingUp, Calendar, Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  AchievementsGrid,
  Leaderboard,
  StreakDisplay,
  PointsDisplay,
} from '@/components/gamification'

interface Stats {
  total_points: number
  weekly_points: number
  monthly_points: number
  current_streak: number
  longest_streak: number
  streak_status: 'active' | 'at_risk' | 'broken'
  achievements_unlocked: number
  lessons_completed: number
  quizzes_passed: number
  perfect_quizzes: number
  courses_completed: number
  certificates_earned: number
}

interface RecentTransaction {
  id: string
  transaction_type: string
  points: number
  description: string
  created_at: string
}

export default function AchievementsPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentTransactions, setRecentTransactions] = useState<RecentTransaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/gamification/stats')
        const data = await response.json()

        if (response.ok) {
          setStats(data.stats)
          setRecentTransactions(data.recent_transactions || [])
        }
      } catch (err) {
        console.error('Error fetching stats:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Also record activity for streak
    fetch('/api/gamification/stats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activityType: 'page_view' }),
    }).catch(console.error)
  }, [])

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'lesson_complete':
        return <Target className="h-4 w-4 text-blue-500" />
      case 'quiz_pass':
      case 'quiz_perfect':
        return <Star className="h-4 w-4 text-amber-500" />
      case 'achievement_unlock':
        return <Trophy className="h-4 w-4 text-purple-500" />
      case 'streak_bonus':
        return <Flame className="h-4 w-4 text-orange-500" />
      case 'daily_login':
        return <Calendar className="h-4 w-4 text-emerald-500" />
      default:
        return <Sparkles className="h-4 w-4 text-gray-500" />
    }
  }

  const formatTransactionType = (type: string) => {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  return (
    <div className="container py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Trophy className="h-8 w-8 text-amber-500" />
          Achievements & Progress
        </h1>
        <p className="text-muted-foreground mt-1">
          Track your learning journey and unlock achievements
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Streak Card */}
        <StreakDisplay
          currentStreak={stats?.current_streak || 0}
          longestStreak={stats?.longest_streak || 0}
          streakStatus={stats?.streak_status || 'active'}
          size="sm"
          showLongest={false}
        />

        {/* Points Card */}
        <PointsDisplay variant="compact" showRank={true} />

        {/* Learning Stats */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/50">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.lessons_completed || 0}</p>
                <p className="text-xs text-muted-foreground">Lessons Completed</p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-medium">{stats?.quizzes_passed || 0}</span>
                <span className="text-muted-foreground ml-1">quizzes</span>
              </div>
              <div>
                <span className="font-medium">{stats?.courses_completed || 0}</span>
                <span className="text-muted-foreground ml-1">courses</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievements Summary */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/50">
                <Trophy className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.achievements_unlocked || 0}</p>
                <p className="text-xs text-muted-foreground">Achievements Unlocked</p>
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-center gap-1">
                <Badge variant="secondary" className="text-xs">
                  {stats?.certificates_earned || 0} certificates
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {stats?.perfect_quizzes || 0} perfect scores
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="achievements" className="space-y-4">
        <TabsList>
          <TabsTrigger value="achievements">
            <Trophy className="h-4 w-4 mr-2" />
            Achievements
          </TabsTrigger>
          <TabsTrigger value="leaderboard">
            <TrendingUp className="h-4 w-4 mr-2" />
            Leaderboard
          </TabsTrigger>
          <TabsTrigger value="activity">
            <Calendar className="h-4 w-4 mr-2" />
            Activity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="achievements" className="space-y-4">
          <AchievementsGrid showFilters={true} />
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Leaderboard limit={15} showTabs={true} />
            </div>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Your Standing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Points</span>
                      <span className="font-bold">{(stats?.total_points || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">This Week</span>
                      <span className="font-medium text-emerald-600">+{stats?.weekly_points || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">This Month</span>
                      <span className="font-medium text-blue-600">+{stats?.monthly_points || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">How to Earn Points</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Complete a lesson</span>
                      <span className="text-amber-600 font-medium">+10 pts</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pass a quiz</span>
                      <span className="text-amber-600 font-medium">+25 pts</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Perfect quiz score</span>
                      <span className="text-amber-600 font-medium">+50 pts</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Complete a course</span>
                      <span className="text-amber-600 font-medium">+100 pts</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Daily login bonus</span>
                      <span className="text-amber-600 font-medium">+5 pts</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Streak bonus (per day)</span>
                      <span className="text-amber-600 font-medium">+5-50 pts</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Recent Point Transactions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest point earnings</CardDescription>
              </CardHeader>
              <CardContent>
                {recentTransactions.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No recent activity. Start learning to earn points!
                  </p>
                ) : (
                  <div className="space-y-3">
                    {recentTransactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50"
                      >
                        {getTransactionIcon(transaction.transaction_type)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {transaction.description || formatTransactionType(transaction.transaction_type)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(transaction.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`font-bold text-sm ${
                          transaction.points > 0 ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                          {transaction.points > 0 ? '+' : ''}{transaction.points}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Streak Calendar Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>Learning Streak</CardTitle>
                <CardDescription>Your consistency over time</CardDescription>
              </CardHeader>
              <CardContent>
                <StreakDisplay
                  currentStreak={stats?.current_streak || 0}
                  longestStreak={stats?.longest_streak || 0}
                  streakStatus={stats?.streak_status || 'active'}
                  size="lg"
                />

                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Streak Tips</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Complete at least one lesson daily</li>
                    <li>• Take a quiz to boost your streak bonus</li>
                    <li>• Longer streaks = bigger daily bonuses</li>
                    <li>• Maximum streak bonus: 50 points/day</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
