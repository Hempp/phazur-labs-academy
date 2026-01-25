'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ChevronLeft,
  Users,
  DollarSign,
  Star,
  Eye,
  TrendingUp,
  TrendingDown,
  Clock,
  PlayCircle,
  CheckCircle2,
  BarChart3,
  ArrowRight,
  Calendar,
  Download,
  Filter,
  Loader2,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UserAvatar } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

type TimeRange = '7d' | '30d' | '90d' | '12m' | 'all'

// Format date for display
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// Format chart date (week labels)
function formatChartDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// Types for analytics data
interface AnalyticsData {
  course: {
    id: string
    title: string
  }
  stats: {
    totalStudents: number
    studentsTrend: number
    totalRevenue: number
    revenueTrend: number
    avgRating: number
    ratingTrend: number
    totalViews: number
    viewsTrend: number
    completionRate: number
    avgWatchTime: string
    totalReviews: number
    engagementRate: number
  }
  enrollmentData: Array<{ date: string; enrollments: number; revenue: number }>
  lessonPerformance: Array<{ title: string; views: number; completionRate: number; avgDuration: string }>
  recentEnrollments: Array<{ id: string; user: { name: string; avatar: string | null }; date: string; source: string }>
  recentReviews: Array<{ id: string; user: { name: string; avatar: string | null }; rating: number; comment: string; date: string }>
  trafficSources: Array<{ source: string; percentage: number; color: string }>
  geographicData: Array<{ country: string; students: number; percentage: number }>
}

function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  prefix = '',
  suffix = '',
  trendLabel = 'vs last period',
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string | number
  trend?: number
  prefix?: string
  suffix?: string
  trendLabel?: string
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl md:text-3xl font-bold mt-1">
              {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
            </p>
            {trend !== undefined && (
              <div className="flex items-center gap-1 mt-2">
                {trend >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span className={cn(
                  'text-sm font-medium',
                  trend >= 0 ? 'text-emerald-500' : 'text-red-500'
                )}>
                  {trend >= 0 ? '+' : ''}{trend}%
                </span>
                <span className="text-xs text-muted-foreground">{trendLabel}</span>
              </div>
            )}
          </div>
          <div className="p-3 rounded-xl bg-primary/10">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function EnrollmentChart({ data }: { data: Array<{ date: string; enrollments: number; revenue: number }> }) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground">
        No enrollment data available
      </div>
    )
  }

  const maxValue = Math.max(...data.map(d => d.enrollments), 1)

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-2 h-48">
        {data.map((item, index) => (
          <div key={item.date} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full relative">
              <div
                className="w-full bg-primary/20 rounded-t transition-all duration-300 hover:bg-primary/30"
                style={{ height: `${(item.enrollments / maxValue) * 150}px` }}
              >
                <div
                  className="absolute bottom-0 left-0 right-0 bg-primary rounded-t transition-all duration-300"
                  style={{ height: `${(item.enrollments / maxValue) * 150 * 0.7}px` }}
                />
              </div>
            </div>
            <span className="text-xs text-muted-foreground">{formatChartDate(item.date)}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-primary" />
          <span className="text-muted-foreground">Enrollments</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-primary/20" />
          <span className="text-muted-foreground">Revenue</span>
        </div>
      </div>
    </div>
  )
}

export default function CourseAnalyticsPage() {
  const params = useParams()
  const [timeRange, setTimeRange] = useState<TimeRange>('30d')
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const timeRanges: { value: TimeRange; label: string }[] = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: '12m', label: '12 Months' },
    { value: 'all', label: 'All Time' },
  ]

  // Fetch analytics data when timeRange changes
  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/analytics/course/${params.id}?range=${timeRange}`)

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'Failed to fetch analytics')
        }

        const data = await response.json()
        setAnalytics(data)
      } catch (err) {
        console.error('Error fetching analytics:', err)
        setError(err instanceof Error ? err.message : 'Failed to load analytics')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchAnalytics()
    }
  }, [params.id, timeRange])

  // Loading skeleton
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href={`/dashboard/instructor/courses/${params.id}`}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Course
          </Link>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Loading analytics...</span>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href={`/dashboard/instructor/courses/${params.id}`}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Course
          </Link>
        </div>
        <Card className="border-destructive">
          <CardContent className="py-8 text-center">
            <p className="text-destructive">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              Try Again
            </button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Use analytics data or empty defaults
  const course = analytics?.course || { id: params.id as string, title: 'Course Analytics' }
  const stats = analytics?.stats || {
    totalStudents: 0,
    studentsTrend: 0,
    totalRevenue: 0,
    revenueTrend: 0,
    avgRating: 0,
    ratingTrend: 0,
    totalViews: 0,
    viewsTrend: 0,
    completionRate: 0,
    avgWatchTime: '0m',
    totalReviews: 0,
    engagementRate: 0,
  }
  const enrollmentData = analytics?.enrollmentData || []
  const lessonPerformance = analytics?.lessonPerformance || []
  const recentEnrollments = analytics?.recentEnrollments || []
  const recentReviews = analytics?.recentReviews || []
  const trafficSources = analytics?.trafficSources || []
  const geographicData = analytics?.geographicData || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href={`/dashboard/instructor/courses/${params.id}`}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Course
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 border rounded-lg text-sm hover:bg-muted transition-colors">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      <div>
        <h1 className="text-2xl md:text-3xl font-bold">{course.title}</h1>
        <p className="text-muted-foreground mt-1">Course Analytics</p>
      </div>

      {/* Time Range Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {timeRanges.map((range) => (
          <button
            key={range.value}
            onClick={() => setTimeRange(range.value)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
              timeRange === range.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/50 hover:bg-muted'
            )}
          >
            {range.label}
          </button>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Total Students"
          value={stats.totalStudents}
          trend={stats.studentsTrend}
        />
        <StatCard
          icon={DollarSign}
          label="Total Revenue"
          value={stats.totalRevenue}
          prefix="$"
          trend={stats.revenueTrend}
        />
        <StatCard
          icon={Star}
          label="Average Rating"
          value={stats.avgRating}
          trend={stats.ratingTrend}
        />
        <StatCard
          icon={Eye}
          label="Total Views"
          value={stats.totalViews}
          trend={stats.viewsTrend}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          {/* Enrollment Chart */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Enrollments & Revenue</CardTitle>
              <button className="text-sm text-primary hover:underline flex items-center gap-1">
                View details <ArrowRight className="h-4 w-4" />
              </button>
            </CardHeader>
            <CardContent>
              <EnrollmentChart data={enrollmentData} />
            </CardContent>
          </Card>

          {/* Lesson Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Lesson Performance</CardTitle>
            </CardHeader>
            <CardContent>
              {lessonPerformance.length === 0 ? (
                <div className="flex items-center justify-center py-8 text-muted-foreground">
                  No lesson data available yet
                </div>
              ) : (
                <div className="space-y-4">
                  {lessonPerformance.map((lesson, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <span className="w-6 text-center text-sm text-muted-foreground">{index + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{lesson.title}</p>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {lesson.views.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            {lesson.completionRate}%
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {lesson.avgDuration}
                          </span>
                        </div>
                      </div>
                      <div className="w-24">
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${lesson.completionRate}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Traffic Sources & Geography */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {trafficSources.map((source) => (
                  <div key={source.source} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>{source.source}</span>
                      <span className="font-medium">{source.percentage}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${source.percentage}%`, backgroundColor: source.color }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Geographic Distribution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {geographicData.map((country) => (
                  <div key={country.country} className="flex items-center justify-between">
                    <span className="text-sm">{country.country}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {country.students.toLocaleString()}
                      </span>
                      <span className="text-sm font-medium w-12 text-right">
                        {country.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column - 1/3 */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Engagement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="text-sm">Completion Rate</span>
                </div>
                <span className="font-semibold">{stats.completionRate}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-sm">Avg Watch Time</span>
                </div>
                <span className="font-semibold">{stats.avgWatchTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                    <BarChart3 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="text-sm">Engagement Rate</span>
                </div>
                <span className="font-semibold">{stats.engagementRate}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                    <Star className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <span className="text-sm">Total Reviews</span>
                </div>
                <span className="font-semibold">{stats.totalReviews}</span>
              </div>
            </CardContent>
          </Card>

          {/* Recent Enrollments */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Enrollments</CardTitle>
              <Link
                href={`/dashboard/instructor/courses/${params.id}/students`}
                className="text-sm text-primary hover:underline"
              >
                View all
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentEnrollments.length === 0 ? (
                <div className="text-center py-4 text-sm text-muted-foreground">
                  No enrollments yet
                </div>
              ) : (
                recentEnrollments.map((enrollment) => (
                  <div key={enrollment.id} className="flex items-center gap-3">
                    <UserAvatar
                      user={{ name: enrollment.user.name, avatar_url: enrollment.user.avatar }}
                      size="sm"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{enrollment.user.name}</div>
                      <div className="text-xs text-muted-foreground">{enrollment.source}</div>
                    </div>
                    <span className="text-xs text-muted-foreground">{formatDate(enrollment.date)}</span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Recent Reviews */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Reviews</CardTitle>
              <Link
                href={`/dashboard/instructor/courses/${params.id}/reviews`}
                className="text-sm text-primary hover:underline"
              >
                View all
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentReviews.length === 0 ? (
                <div className="text-center py-4 text-sm text-muted-foreground">
                  No reviews yet
                </div>
              ) : (
                recentReviews.map((review) => (
                  <div key={review.id} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <UserAvatar
                        user={{ name: review.user.name, avatar_url: review.user.avatar }}
                        size="sm"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{review.user.name}</div>
                        <div className="text-xs text-muted-foreground">{formatDate(review.date)}</div>
                      </div>
                      <div className="flex items-center">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 text-amber-500 fill-amber-500" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{review.comment}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
