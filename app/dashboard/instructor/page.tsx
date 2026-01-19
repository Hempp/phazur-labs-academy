'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  BookOpen,
  Users,
  DollarSign,
  TrendingUp,
  Star,
  Eye,
  MessageSquare,
  Clock,
  ArrowRight,
  Plus,
  MoreVertical,
  Edit2,
  Trash2,
  Play,
  BarChart3,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge, LevelBadge, StatusBadge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { UserAvatar } from '@/components/ui/avatar'
import { useAuth } from '@/lib/hooks/use-auth'
import { cn } from '@/lib/utils'

// Mock data
const mockStats = {
  totalCourses: 8,
  totalStudents: 12450,
  totalEarnings: 45890,
  monthlyEarnings: 8420,
  avgRating: 4.8,
  totalReviews: 2847,
  viewsThisMonth: 45200,
  enrollmentsThisMonth: 342,
}

const mockCourses = [
  {
    id: '1',
    title: 'Advanced React Patterns',
    thumbnail: '/images/courses/react.jpg',
    students: 3420,
    rating: 4.9,
    revenue: 12500,
    status: 'published' as const,
    lastUpdated: '2024-01-15',
    level: 'advanced' as const,
  },
  {
    id: '2',
    title: 'TypeScript Masterclass',
    thumbnail: '/images/courses/typescript.jpg',
    students: 5280,
    rating: 4.8,
    revenue: 18900,
    status: 'published' as const,
    lastUpdated: '2024-02-01',
    level: 'intermediate' as const,
  },
  {
    id: '3',
    title: 'Node.js Best Practices',
    thumbnail: '/images/courses/nodejs.jpg',
    students: 2150,
    rating: 4.7,
    revenue: 8200,
    status: 'published' as const,
    lastUpdated: '2024-01-20',
    level: 'intermediate' as const,
  },
  {
    id: '4',
    title: 'GraphQL Fundamentals',
    thumbnail: '/images/courses/graphql.jpg',
    students: 0,
    rating: 0,
    revenue: 0,
    status: 'draft' as const,
    lastUpdated: '2024-02-10',
    level: 'beginner' as const,
  },
]

const mockRecentReviews = [
  {
    id: 'r1',
    user: { name: 'Alex Thompson', avatar: null },
    course: 'Advanced React Patterns',
    rating: 5,
    comment: 'Best React course I\'ve ever taken! The explanations are crystal clear.',
    date: '2024-02-08',
  },
  {
    id: 'r2',
    user: { name: 'Maria Garcia', avatar: null },
    course: 'TypeScript Masterclass',
    rating: 5,
    comment: 'Finally understand TypeScript generics. Thank you!',
    date: '2024-02-07',
  },
  {
    id: 'r3',
    user: { name: 'James Wilson', avatar: null },
    course: 'Node.js Best Practices',
    rating: 4,
    comment: 'Great content, would love more examples on microservices.',
    date: '2024-02-06',
  },
]

const mockRecentEnrollments = [
  { id: 'e1', user: { name: 'John Doe', avatar: null }, course: 'Advanced React Patterns', date: '2 hours ago' },
  { id: 'e2', user: { name: 'Jane Smith', avatar: null }, course: 'TypeScript Masterclass', date: '3 hours ago' },
  { id: 'e3', user: { name: 'Mike Johnson', avatar: null }, course: 'Advanced React Patterns', date: '5 hours ago' },
  { id: 'e4', user: { name: 'Sarah Williams', avatar: null }, course: 'Node.js Best Practices', date: '6 hours ago' },
]

const earningsData = [
  { month: 'Aug', amount: 5200 },
  { month: 'Sep', amount: 6100 },
  { month: 'Oct', amount: 5800 },
  { month: 'Nov', amount: 7200 },
  { month: 'Dec', amount: 6900 },
  { month: 'Jan', amount: 8420 },
]

function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  trendLabel,
  prefix = '',
  className,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: number
  trend?: number
  trendLabel?: string
  prefix?: string
  className?: string
}) {
  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-3xl font-bold mt-1">
              {prefix}{value.toLocaleString()}
            </p>
            {trend !== undefined && (
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className={cn(
                  'h-4 w-4',
                  trend >= 0 ? 'text-emerald-500' : 'text-red-500'
                )} />
                <span className={cn(
                  'text-sm font-medium',
                  trend >= 0 ? 'text-emerald-500' : 'text-red-500'
                )}>
                  {trend >= 0 ? '+' : ''}{trend}%
                </span>
                {trendLabel && (
                  <span className="text-xs text-muted-foreground">{trendLabel}</span>
                )}
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

function MiniEarningsChart() {
  const maxAmount = Math.max(...earningsData.map(d => d.amount))

  return (
    <div className="flex items-end justify-between gap-1 h-20">
      {earningsData.map((data, index) => (
        <div key={data.month} className="flex-1 flex flex-col items-center gap-1">
          <div
            className={cn(
              'w-full rounded-t transition-all duration-300',
              index === earningsData.length - 1 ? 'bg-primary' : 'bg-primary/30'
            )}
            style={{ height: `${(data.amount / maxAmount) * 60}px` }}
          />
          <span className="text-[10px] text-muted-foreground">{data.month}</span>
        </div>
      ))}
    </div>
  )
}

function CourseRow({ course }: { course: typeof mockCourses[0] }) {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <div className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors">
      <div className="w-20 h-14 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
        <BookOpen className="h-6 w-6 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-medium truncate">{course.title}</h3>
          <StatusBadge status={course.status} />
        </div>
        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {course.students.toLocaleString()}
          </span>
          {course.rating > 0 && (
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
              {course.rating}
            </span>
          )}
          <span>${course.revenue.toLocaleString()}</span>
        </div>
      </div>
      <LevelBadge level={course.level} className="hidden sm:flex" />
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
        {showMenu && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowMenu(false)}
            />
            <div className="absolute right-0 mt-1 w-48 bg-card rounded-lg border shadow-lg py-1 z-50">
              <Link
                href={`/dashboard/instructor/courses/${course.id}`}
                className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted"
              >
                <Edit2 className="h-4 w-4" />
                Edit Course
              </Link>
              <Link
                href={`/courses/${course.id}`}
                className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted"
              >
                <Eye className="h-4 w-4" />
                Preview
              </Link>
              <Link
                href={`/dashboard/instructor/courses/${course.id}/analytics`}
                className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted"
              >
                <BarChart3 className="h-4 w-4" />
                Analytics
              </Link>
              <div className="border-t my-1" />
              <button className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted w-full text-destructive">
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function InstructorDashboardPage() {
  const { profile } = useAuth()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            Instructor Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {profile?.full_name?.split(' ')[0] || 'Instructor'}!
          </p>
        </div>
        <Link
          href="/dashboard/instructor/courses/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Create Course
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={BookOpen}
          label="Total Courses"
          value={mockStats.totalCourses}
        />
        <StatCard
          icon={Users}
          label="Total Students"
          value={mockStats.totalStudents}
          trend={12}
          trendLabel="this month"
        />
        <StatCard
          icon={DollarSign}
          label="Total Earnings"
          value={mockStats.totalEarnings}
          prefix="$"
        />
        <StatCard
          icon={Star}
          label="Average Rating"
          value={mockStats.avgRating}
          trend={3}
          trendLabel="this month"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          {/* Earnings Overview */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Earnings Overview</CardTitle>
              <span className="text-2xl font-bold text-primary">
                ${mockStats.monthlyEarnings.toLocaleString()}
                <span className="text-sm font-normal text-muted-foreground ml-1">this month</span>
              </span>
            </CardHeader>
            <CardContent>
              <MiniEarningsChart />
            </CardContent>
          </Card>

          {/* My Courses */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>My Courses</CardTitle>
              <Link
                href="/dashboard/instructor/courses"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {mockCourses.map((course) => (
                  <CourseRow key={course.id} course={course} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - 1/3 */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">This Month</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-sm">Course Views</span>
                </div>
                <span className="font-semibold">{mockStats.viewsThisMonth.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                    <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="text-sm">New Enrollments</span>
                </div>
                <span className="font-semibold">{mockStats.enrollmentsThisMonth}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                    <MessageSquare className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <span className="text-sm">New Reviews</span>
                </div>
                <span className="font-semibold">24</span>
              </div>
            </CardContent>
          </Card>

          {/* Recent Reviews */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Reviews</CardTitle>
              <Link
                href="/dashboard/instructor/reviews"
                className="text-sm text-primary hover:underline"
              >
                View all
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockRecentReviews.map((review) => (
                <div key={review.id} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <UserAvatar
                      user={{ name: review.user.name, avatar_url: review.user.avatar }}
                      size="sm"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{review.user.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{review.course}</div>
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

          {/* Recent Enrollments */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Enrollments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockRecentEnrollments.map((enrollment) => (
                <div key={enrollment.id} className="flex items-center gap-3">
                  <UserAvatar
                    user={{ name: enrollment.user.name, avatar_url: enrollment.user.avatar }}
                    size="sm"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{enrollment.user.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{enrollment.course}</div>
                  </div>
                  <span className="text-xs text-muted-foreground">{enrollment.date}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
