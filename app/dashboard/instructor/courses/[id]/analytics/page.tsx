'use client'

import { useState } from 'react'
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
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UserAvatar } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

type TimeRange = '7d' | '30d' | '90d' | '12m' | 'all'

// Mock analytics data
const mockCourse = {
  id: '1',
  title: 'Advanced React Patterns',
}

const mockStats = {
  totalStudents: 3420,
  studentsTrend: 12,
  totalRevenue: 12500,
  revenueTrend: 8,
  avgRating: 4.9,
  ratingTrend: 2,
  totalViews: 45200,
  viewsTrend: 15,
  completionRate: 68,
  avgWatchTime: '4h 32m',
  totalReviews: 892,
  engagementRate: 78,
}

const enrollmentData = [
  { date: 'Jan 1', enrollments: 45, revenue: 1350 },
  { date: 'Jan 8', enrollments: 52, revenue: 1560 },
  { date: 'Jan 15', enrollments: 38, revenue: 1140 },
  { date: 'Jan 22', enrollments: 67, revenue: 2010 },
  { date: 'Jan 29', enrollments: 72, revenue: 2160 },
  { date: 'Feb 5', enrollments: 58, revenue: 1740 },
  { date: 'Feb 12', enrollments: 84, revenue: 2520 },
]

const lessonPerformance = [
  { title: 'Welcome & Course Overview', views: 3420, completionRate: 98, avgDuration: '5:12' },
  { title: 'Setting Up Development Environment', views: 3280, completionRate: 94, avgDuration: '11:45' },
  { title: 'Introduction to Compound Components', views: 3150, completionRate: 89, avgDuration: '14:22' },
  { title: 'Building a Tabs Component', views: 2890, completionRate: 82, avgDuration: '23:45' },
  { title: 'Accordion Pattern', views: 2650, completionRate: 76, avgDuration: '18:30' },
  { title: 'Why Custom Hooks?', views: 2420, completionRate: 71, avgDuration: '9:15' },
]

const recentEnrollments = [
  { id: 'e1', user: { name: 'John Doe', avatar: null }, date: '2 hours ago', source: 'Direct' },
  { id: 'e2', user: { name: 'Jane Smith', avatar: null }, date: '3 hours ago', source: 'Search' },
  { id: 'e3', user: { name: 'Mike Johnson', avatar: null }, date: '5 hours ago', source: 'Referral' },
  { id: 'e4', user: { name: 'Sarah Williams', avatar: null }, date: '6 hours ago', source: 'Social' },
  { id: 'e5', user: { name: 'Alex Thompson', avatar: null }, date: '8 hours ago', source: 'Direct' },
]

const recentReviews = [
  { id: 'r1', user: { name: 'Alex Thompson', avatar: null }, rating: 5, comment: 'Best React course ever!', date: '1 day ago' },
  { id: 'r2', user: { name: 'Maria Garcia', avatar: null }, rating: 5, comment: 'Finally understand compound components!', date: '2 days ago' },
  { id: 'r3', user: { name: 'James Wilson', avatar: null }, rating: 4, comment: 'Great content, could use more examples.', date: '3 days ago' },
]

const trafficSources = [
  { source: 'Direct', percentage: 35, color: 'bg-primary' },
  { source: 'Search', percentage: 28, color: 'bg-blue-500' },
  { source: 'Social', percentage: 20, color: 'bg-purple-500' },
  { source: 'Referral', percentage: 12, color: 'bg-amber-500' },
  { source: 'Other', percentage: 5, color: 'bg-gray-500' },
]

const geographicData = [
  { country: 'United States', students: 1240, percentage: 36 },
  { country: 'India', students: 620, percentage: 18 },
  { country: 'United Kingdom', students: 380, percentage: 11 },
  { country: 'Germany', students: 290, percentage: 8 },
  { country: 'Canada', students: 250, percentage: 7 },
  { country: 'Other', students: 640, percentage: 19 },
]

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

function EnrollmentChart() {
  const maxValue = Math.max(...enrollmentData.map(d => d.enrollments))

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-2 h-48">
        {enrollmentData.map((data, index) => (
          <div key={data.date} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full relative">
              <div
                className="w-full bg-primary/20 rounded-t transition-all duration-300 hover:bg-primary/30"
                style={{ height: `${(data.enrollments / maxValue) * 150}px` }}
              >
                <div
                  className="absolute bottom-0 left-0 right-0 bg-primary rounded-t transition-all duration-300"
                  style={{ height: `${(data.enrollments / maxValue) * 150 * 0.7}px` }}
                />
              </div>
            </div>
            <span className="text-xs text-muted-foreground">{data.date.split(' ')[0]}</span>
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

  const timeRanges: { value: TimeRange; label: string }[] = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: '12m', label: '12 Months' },
    { value: 'all', label: 'All Time' },
  ]

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
        <h1 className="text-2xl md:text-3xl font-bold">{mockCourse.title}</h1>
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
          value={mockStats.totalStudents}
          trend={mockStats.studentsTrend}
        />
        <StatCard
          icon={DollarSign}
          label="Total Revenue"
          value={mockStats.totalRevenue}
          prefix="$"
          trend={mockStats.revenueTrend}
        />
        <StatCard
          icon={Star}
          label="Average Rating"
          value={mockStats.avgRating}
          trend={mockStats.ratingTrend}
        />
        <StatCard
          icon={Eye}
          label="Total Views"
          value={mockStats.totalViews}
          trend={mockStats.viewsTrend}
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
              <EnrollmentChart />
            </CardContent>
          </Card>

          {/* Lesson Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Lesson Performance</CardTitle>
            </CardHeader>
            <CardContent>
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
                        className={cn('h-full rounded-full', source.color)}
                        style={{ width: `${source.percentage}%` }}
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
                <span className="font-semibold">{mockStats.completionRate}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-sm">Avg Watch Time</span>
                </div>
                <span className="font-semibold">{mockStats.avgWatchTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                    <BarChart3 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="text-sm">Engagement Rate</span>
                </div>
                <span className="font-semibold">{mockStats.engagementRate}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                    <Star className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <span className="text-sm">Total Reviews</span>
                </div>
                <span className="font-semibold">{mockStats.totalReviews}</span>
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
              {recentEnrollments.map((enrollment) => (
                <div key={enrollment.id} className="flex items-center gap-3">
                  <UserAvatar
                    user={{ name: enrollment.user.name, avatar_url: enrollment.user.avatar }}
                    size="sm"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{enrollment.user.name}</div>
                    <div className="text-xs text-muted-foreground">{enrollment.source}</div>
                  </div>
                  <span className="text-xs text-muted-foreground">{enrollment.date}</span>
                </div>
              ))}
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
              {recentReviews.map((review) => (
                <div key={review.id} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <UserAvatar
                      user={{ name: review.user.name, avatar_url: review.user.avatar }}
                      size="sm"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{review.user.name}</div>
                      <div className="text-xs text-muted-foreground">{review.date}</div>
                    </div>
                    <div className="flex items-center">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 text-amber-500 fill-amber-500" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{review.comment}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
