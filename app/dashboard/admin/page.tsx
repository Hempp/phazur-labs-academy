'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  ArrowRight,
  BarChart3,
  PieChart,
  UserPlus,
  GraduationCap,
  ShieldCheck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Loader2,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge, StatusBadge } from '@/components/ui/badge'
import { UserAvatar } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

// Types for API response
interface PlatformStats {
  totalUsers: number
  usersTrend: number
  activeUsers: number
  activeTrend: number
  totalCourses: number
  coursesTrend: number
  totalRevenue: number
  revenueTrend: number
  monthlyRevenue: number
  monthlyTrend: number
  pendingPayouts: number
  totalInstructors: number
  avgCourseRating: number
  completionRate: number
}

interface RevenueDataPoint {
  month: string
  revenue: number
}

interface UserGrowthDataPoint {
  month: string
  users: number
}

interface TopCourse {
  id: string
  title: string
  instructor: string
  students: number
  revenue: number
  rating: number
}

interface RecentUser {
  id: string
  name: string
  email: string
  role: string
  joinedAt: string
  avatar: string | null
}

interface PendingApproval {
  id: string
  title?: string
  name?: string
  instructor?: string
  email?: string
  type: string
  submittedAt: string
}

interface SystemAlert {
  id: string
  type: 'warning' | 'info' | 'success'
  message: string
  time: string
}

interface CategoryDistribution {
  name: string
  count: number
  color: string
}

interface AdminAnalyticsData {
  platformStats: PlatformStats
  revenueData: RevenueDataPoint[]
  userGrowthData: UserGrowthDataPoint[]
  topCourses: TopCourse[]
  recentUsers: RecentUser[]
  pendingApprovals: PendingApproval[]
  systemAlerts: SystemAlert[]
  categoryDistribution: CategoryDistribution[]
}

// Fallback mock data
const MOCK_PLATFORM_STATS: PlatformStats = {
  totalUsers: 24850,
  usersTrend: 8,
  activeUsers: 12420,
  activeTrend: 12,
  totalCourses: 186,
  coursesTrend: 5,
  totalRevenue: 892450,
  revenueTrend: 15,
  monthlyRevenue: 78420,
  monthlyTrend: 22,
  pendingPayouts: 12580,
  totalInstructors: 142,
  avgCourseRating: 4.7,
  completionRate: 68,
}

const MOCK_REVENUE_DATA: RevenueDataPoint[] = [
  { month: 'Aug', revenue: 52000 },
  { month: 'Sep', revenue: 58000 },
  { month: 'Oct', revenue: 62000 },
  { month: 'Nov', revenue: 71000 },
  { month: 'Dec', revenue: 68000 },
  { month: 'Jan', revenue: 78420 },
]

const MOCK_USER_GROWTH_DATA: UserGrowthDataPoint[] = [
  { month: 'Aug', users: 18200 },
  { month: 'Sep', users: 19800 },
  { month: 'Oct', users: 21500 },
  { month: 'Nov', users: 22800 },
  { month: 'Dec', users: 23900 },
  { month: 'Jan', users: 24850 },
]

const MOCK_TOP_COURSES: TopCourse[] = [
  { id: '1', title: 'TypeScript Masterclass', instructor: 'Sarah Chen', students: 5280, revenue: 18900, rating: 4.8 },
  { id: '2', title: 'Advanced React Patterns', instructor: 'Michael Park', students: 3420, revenue: 12500, rating: 4.9 },
  { id: '3', title: 'Node.js Best Practices', instructor: 'David Kim', students: 2150, revenue: 8200, rating: 4.7 },
  { id: '4', title: 'Docker for Developers', instructor: 'Emily Wilson', students: 1890, revenue: 6800, rating: 4.6 },
  { id: '5', title: 'GraphQL Masterclass', instructor: 'James Lee', students: 1650, revenue: 5900, rating: 4.5 },
]

const MOCK_RECENT_USERS: RecentUser[] = [
  { id: 'u1', name: 'John Doe', email: 'john@example.com', role: 'student', joinedAt: '2 hours ago', avatar: null },
  { id: 'u2', name: 'Jane Smith', email: 'jane@example.com', role: 'instructor', joinedAt: '4 hours ago', avatar: null },
  { id: 'u3', name: 'Mike Johnson', email: 'mike@example.com', role: 'student', joinedAt: '6 hours ago', avatar: null },
  { id: 'u4', name: 'Sarah Williams', email: 'sarah@example.com', role: 'student', joinedAt: '8 hours ago', avatar: null },
  { id: 'u5', name: 'Alex Thompson', email: 'alex@example.com', role: 'instructor', joinedAt: '12 hours ago', avatar: null },
]

const MOCK_PENDING_APPROVALS: PendingApproval[] = [
  { id: 'c1', title: 'Machine Learning Basics', instructor: 'Dr. Alan Turing', type: 'course', submittedAt: '1 day ago' },
  { id: 'c2', title: 'UI/UX Design Principles', instructor: 'Lisa Chen', type: 'course', submittedAt: '2 days ago' },
  { id: 'i1', name: 'Robert Brown', email: 'robert@example.com', type: 'instructor', submittedAt: '3 days ago' },
]

const MOCK_SYSTEM_ALERTS: SystemAlert[] = [
  { id: 'a1', type: 'warning', message: 'High server load detected', time: '10 min ago' },
  { id: 'a2', type: 'info', message: 'Scheduled maintenance in 2 days', time: '1 hour ago' },
  { id: 'a3', type: 'success', message: 'Backup completed successfully', time: '3 hours ago' },
]

const MOCK_CATEGORY_DISTRIBUTION: CategoryDistribution[] = [
  { name: 'Web Development', count: 52, color: 'bg-primary' },
  { name: 'Data Science', count: 38, color: 'bg-blue-500' },
  { name: 'Mobile Development', count: 28, color: 'bg-purple-500' },
  { name: 'DevOps', count: 24, color: 'bg-amber-500' },
  { name: 'Design', count: 22, color: 'bg-emerald-500' },
  { name: 'Other', count: 22, color: 'bg-gray-500' },
]

function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  prefix = '',
  suffix = '',
  trendLabel = 'vs last month',
  className,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string | number
  trend?: number
  prefix?: string
  suffix?: string
  trendLabel?: string
  className?: string
}) {
  return (
    <Card className={className}>
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

function RevenueChart({ data }: { data: RevenueDataPoint[] }) {
  const maxValue = Math.max(...data.map(d => d.revenue), 1) // Avoid division by zero

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-2 h-40">
        {data.map((item, index) => (
          <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
            <div
              className={cn(
                'w-full rounded-t transition-all duration-300',
                index === data.length - 1 ? 'bg-primary' : 'bg-primary/30'
              )}
              style={{ height: `${(item.revenue / maxValue) * 120}px` }}
            />
            <span className="text-xs text-muted-foreground">{item.month}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function UserGrowthChart({ data }: { data: UserGrowthDataPoint[] }) {
  const maxValue = Math.max(...data.map(d => d.users), 1)
  const minValue = Math.min(...data.map(d => d.users))
  const range = maxValue - minValue || 1 // Avoid division by zero

  return (
    <div className="h-32 flex items-end gap-1">
      {data.map((item, index) => (
        <div key={item.month} className="flex-1 flex flex-col items-center gap-1">
          <div
            className={cn(
              'w-full rounded-t transition-all duration-300',
              index === data.length - 1 ? 'bg-emerald-500' : 'bg-emerald-500/30'
            )}
            style={{ height: `${((item.users - minValue) / range) * 80 + 20}px` }}
          />
          <span className="text-[10px] text-muted-foreground">{item.month}</span>
        </div>
      ))}
    </div>
  )
}

export default function AdminDashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [platformStats, setPlatformStats] = useState<PlatformStats>(MOCK_PLATFORM_STATS)
  const [revenueData, setRevenueData] = useState<RevenueDataPoint[]>(MOCK_REVENUE_DATA)
  const [userGrowthData, setUserGrowthData] = useState<UserGrowthDataPoint[]>(MOCK_USER_GROWTH_DATA)
  const [topCourses, setTopCourses] = useState<TopCourse[]>(MOCK_TOP_COURSES)
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>(MOCK_RECENT_USERS)
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>(MOCK_PENDING_APPROVALS)
  const [systemAlerts, setSystemAlerts] = useState<SystemAlert[]>(MOCK_SYSTEM_ALERTS)
  const [categoryDistribution, setCategoryDistribution] = useState<CategoryDistribution[]>(MOCK_CATEGORY_DISTRIBUTION)

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch('/api/admin/analytics')
        if (!response.ok) {
          const errData = await response.json().catch(() => ({}))
          throw new Error(errData.error || 'Failed to fetch analytics')
        }

        const data: AdminAnalyticsData = await response.json()

        setPlatformStats(data.platformStats)
        setRevenueData(data.revenueData)
        setUserGrowthData(data.userGrowthData)
        setTopCourses(data.topCourses)
        setRecentUsers(data.recentUsers)
        setPendingApprovals(data.pendingApprovals)
        setSystemAlerts(data.systemAlerts)
        setCategoryDistribution(data.categoryDistribution.length > 0 ? data.categoryDistribution : MOCK_CATEGORY_DISTRIBUTION)
      } catch (err) {
        console.error('Failed to fetch admin analytics:', err)
        setError(err instanceof Error ? err.message : 'Failed to load dashboard')
        // Keep mock data as fallback
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <div className="h-8 w-48 bg-muted rounded animate-pulse" />
          <div className="h-5 w-64 bg-muted rounded animate-pulse mt-2" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-6 w-24 bg-muted rounded mb-2" />
                <div className="h-8 w-32 bg-muted rounded mb-2" />
                <div className="h-4 w-20 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-40 bg-muted rounded" />
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-32 bg-muted rounded" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="p-4 rounded-full bg-destructive/10 mb-4">
          <AlertTriangle className="w-8 h-8 text-destructive" />
        </div>
        <h2 className="text-lg font-semibold mb-2">Unable to load dashboard</h2>
        <p className="text-muted-foreground mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Platform overview and management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Total Users"
          value={platformStats.totalUsers}
          trend={platformStats.usersTrend}
        />
        <StatCard
          icon={BookOpen}
          label="Total Courses"
          value={platformStats.totalCourses}
          trend={platformStats.coursesTrend}
        />
        <StatCard
          icon={DollarSign}
          label="Monthly Revenue"
          value={platformStats.monthlyRevenue}
          prefix="$"
          trend={platformStats.monthlyTrend}
        />
        <StatCard
          icon={GraduationCap}
          label="Active Students"
          value={platformStats.activeUsers}
          trend={platformStats.activeTrend}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          {/* Revenue Overview */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Revenue Overview</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Total: ${platformStats.totalRevenue.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">${platformStats.monthlyRevenue.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">This month</p>
              </div>
            </CardHeader>
            <CardContent>
              <RevenueChart data={revenueData} />
            </CardContent>
          </Card>

          {/* Top Courses */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Top Courses</CardTitle>
              <Link
                href="/dashboard/admin/courses"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topCourses.map((course, index) => (
                  <div key={course.id} className="flex items-center gap-4">
                    <span className="w-6 text-center font-bold text-muted-foreground">
                      #{index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{course.title}</h4>
                      <p className="text-sm text-muted-foreground">{course.instructor}</p>
                    </div>
                    <div className="text-right hidden sm:block">
                      <p className="font-medium">{course.students.toLocaleString()} students</p>
                      <p className="text-sm text-muted-foreground">${course.revenue.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-amber-500">★</span>
                      <span className="font-medium">{course.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Users */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Users</CardTitle>
              <Link
                href="/dashboard/admin/users"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                Manage users <ArrowRight className="h-4 w-4" />
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center gap-4">
                    <UserAvatar
                      user={{ name: user.name, avatar_url: user.avatar }}
                      size="md"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium truncate">{user.name}</h4>
                        <Badge
                          variant={user.role === 'instructor' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {user.role}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <span className="text-sm text-muted-foreground">{user.joinedAt}</span>
                    <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - 1/3 */}
        <div className="space-y-6">
          {/* User Growth */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">User Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <UserGrowthChart data={userGrowthData} />
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-xl font-bold">{platformStats.totalInstructors}</p>
                  <p className="text-xs text-muted-foreground">Instructors</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-xl font-bold">{platformStats.avgCourseRating}</p>
                  <p className="text-xs text-muted-foreground">Avg Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Course Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {categoryDistribution.map((cat) => (
                <div key={cat.name} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>{cat.name}</span>
                    <span className="font-medium">{cat.count}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full', cat.color)}
                      style={{ width: `${(cat.count / platformStats.totalCourses) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Pending Approvals */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Pending Approvals</CardTitle>
              <Badge>{pendingApprovals.length}</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingApprovals.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                    {item.type === 'course' ? (
                      <BookOpen className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    ) : (
                      <Users className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {'title' in item ? item.title : item.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {'instructor' in item ? item.instructor : item.email}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded hover:bg-emerald-200 transition-colors">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    </button>
                    <button className="p-1.5 bg-red-100 dark:bg-red-900/30 rounded hover:bg-red-200 transition-colors">
                      <XCircle className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </div>
              ))}
              <Link
                href="/dashboard/admin/approvals"
                className="block text-center text-sm text-primary hover:underline pt-2"
              >
                View all pending
              </Link>
            </CardContent>
          </Card>

          {/* System Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">System Alerts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {systemAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={cn(
                    'flex items-start gap-3 p-3 rounded-lg',
                    alert.type === 'warning' && 'bg-amber-50 dark:bg-amber-900/20',
                    alert.type === 'info' && 'bg-blue-50 dark:bg-blue-900/20',
                    alert.type === 'success' && 'bg-emerald-50 dark:bg-emerald-900/20'
                  )}
                >
                  {alert.type === 'warning' && (
                    <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                  )}
                  {alert.type === 'info' && (
                    <Activity className="h-4 w-4 text-blue-600 mt-0.5" />
                  )}
                  {alert.type === 'success' && (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              <Link
                href="/dashboard/admin/users"
                className="p-3 bg-muted/50 rounded-lg text-center hover:bg-muted transition-colors"
              >
                <Users className="h-5 w-5 mx-auto mb-1" />
                <span className="text-xs">Users</span>
              </Link>
              <Link
                href="/dashboard/admin/courses"
                className="p-3 bg-muted/50 rounded-lg text-center hover:bg-muted transition-colors"
              >
                <BookOpen className="h-5 w-5 mx-auto mb-1" />
                <span className="text-xs">Courses</span>
              </Link>
              <Link
                href="/dashboard/admin/revenue"
                className="p-3 bg-muted/50 rounded-lg text-center hover:bg-muted transition-colors"
              >
                <DollarSign className="h-5 w-5 mx-auto mb-1" />
                <span className="text-xs">Revenue</span>
              </Link>
              <Link
                href="/dashboard/admin/settings"
                className="p-3 bg-muted/50 rounded-lg text-center hover:bg-muted transition-colors"
              >
                <ShieldCheck className="h-5 w-5 mx-auto mb-1" />
                <span className="text-xs">Settings</span>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
