'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  BookOpen,
  Clock,
  Trophy,
  TrendingUp,
  Play,
  CheckCircle2,
  Flame,
  Target,
  Calendar,
  ArrowRight,
  Star,
  BarChart3,
} from 'lucide-react'
import { useAuth } from '@/lib/hooks/use-auth'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Progress, ProgressRing } from '@/components/ui/progress'
import { Badge, LevelBadge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

// Mock data - would come from API in real app
const mockStats = {
  coursesInProgress: 4,
  coursesCompleted: 12,
  totalHoursLearned: 156,
  currentStreak: 7,
  longestStreak: 21,
  certificatesEarned: 8,
  overallProgress: 68,
}

const mockContinueLearning = [
  {
    id: '1',
    title: 'Advanced React Patterns',
    instructor: 'Sarah Johnson',
    thumbnail: '/images/courses/react-patterns.jpg',
    progress: 65,
    lastLesson: 'Compound Components Pattern',
    totalLessons: 32,
    completedLessons: 21,
    level: 'advanced' as const,
  },
  {
    id: '2',
    title: 'TypeScript Masterclass',
    instructor: 'Michael Chen',
    thumbnail: '/images/courses/typescript.jpg',
    progress: 42,
    lastLesson: 'Generic Constraints',
    totalLessons: 48,
    completedLessons: 20,
    level: 'intermediate' as const,
  },
  {
    id: '3',
    title: 'Node.js Backend Development',
    instructor: 'Emma Wilson',
    thumbnail: '/images/courses/nodejs.jpg',
    progress: 23,
    lastLesson: 'Express Middleware',
    totalLessons: 56,
    completedLessons: 13,
    level: 'intermediate' as const,
  },
]

const mockRecommended = [
  {
    id: '4',
    title: 'Next.js 14 Full Course',
    instructor: 'David Park',
    thumbnail: '/images/courses/nextjs.jpg',
    rating: 4.9,
    students: 12500,
    duration: '18 hours',
    level: 'intermediate' as const,
    price: 89.99,
  },
  {
    id: '5',
    title: 'GraphQL API Design',
    instructor: 'Lisa Anderson',
    thumbnail: '/images/courses/graphql.jpg',
    rating: 4.8,
    students: 8400,
    duration: '12 hours',
    level: 'advanced' as const,
    price: 79.99,
  },
]

const mockUpcoming = [
  {
    id: '1',
    title: 'Live Q&A Session: React Best Practices',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    course: 'Advanced React Patterns',
    type: 'live' as const,
  },
  {
    id: '2',
    title: 'Quiz: TypeScript Generics',
    date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    course: 'TypeScript Masterclass',
    type: 'quiz' as const,
  },
  {
    id: '3',
    title: 'Assignment Due: REST API Project',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    course: 'Node.js Backend Development',
    type: 'assignment' as const,
  },
]

const mockActivity = [
  { day: 'Mon', hours: 2.5 },
  { day: 'Tue', hours: 1.8 },
  { day: 'Wed', hours: 3.2 },
  { day: 'Thu', hours: 2.1 },
  { day: 'Fri', hours: 1.5 },
  { day: 'Sat', hours: 4.0 },
  { day: 'Sun', hours: 2.8 },
]

function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  trendLabel,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string | number
  trend?: number
  trendLabel?: string
  className?: string
}) {
  return (
    <Card className={cn('relative overflow-hidden', className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
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

function ContinueLearningCard({
  course,
}: {
  course: typeof mockContinueLearning[0]
}) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300">
      <div className="flex gap-4 p-4">
        <div className="relative w-32 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
            <BookOpen className="h-8 w-8 text-primary/50" />
          </div>
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="p-2 rounded-full bg-white/90">
              <Play className="h-5 w-5 text-primary fill-primary" />
            </div>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                {course.title}
              </h3>
              <p className="text-sm text-muted-foreground">{course.instructor}</p>
            </div>
            <LevelBadge level={course.level} />
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span className="text-muted-foreground">
                {course.completedLessons}/{course.totalLessons} lessons
              </span>
              <span className="font-medium">{course.progress}%</span>
            </div>
            <Progress value={course.progress} size="sm" />
          </div>
          <p className="text-xs text-muted-foreground mt-2 line-clamp-1">
            Continue: {course.lastLesson}
          </p>
        </div>
      </div>
    </Card>
  )
}

function RecommendedCard({
  course,
}: {
  course: typeof mockRecommended[0]
}) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="relative aspect-video bg-muted">
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
          <BookOpen className="h-12 w-12 text-primary/50" />
        </div>
        <div className="absolute top-2 right-2">
          <LevelBadge level={course.level} />
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
          {course.title}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">{course.instructor}</p>
        <div className="flex items-center gap-3 mt-3 text-sm">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
            <span className="font-medium">{course.rating}</span>
          </div>
          <span className="text-muted-foreground">
            {course.students.toLocaleString()} students
          </span>
        </div>
        <div className="flex items-center justify-between mt-4">
          <span className="text-lg font-bold">${course.price}</span>
          <Link
            href={`/courses/${course.id}`}
            className="text-sm font-medium text-primary hover:underline"
          >
            View Course
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

function UpcomingItem({
  item,
}: {
  item: typeof mockUpcoming[0]
}) {
  const formatDate = (date: Date) => {
    const diff = Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    if (diff === 0) return 'Today'
    if (diff === 1) return 'Tomorrow'
    return `In ${diff} days`
  }

  const typeStyles = {
    live: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    quiz: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    assignment: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  }

  const typeLabels = {
    live: 'Live',
    quiz: 'Quiz',
    assignment: 'Assignment',
  }

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
      <div className="p-2 rounded-lg bg-muted">
        <Calendar className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium line-clamp-1">{item.title}</h4>
        <p className="text-xs text-muted-foreground mt-0.5">{item.course}</p>
      </div>
      <div className="flex flex-col items-end gap-1">
        <Badge variant="outline" className={cn('text-[10px]', typeStyles[item.type])}>
          {typeLabels[item.type]}
        </Badge>
        <span className="text-xs text-muted-foreground">{formatDate(item.date)}</span>
      </div>
    </div>
  )
}

function WeeklyActivityChart() {
  const maxHours = Math.max(...mockActivity.map(d => d.hours))

  return (
    <div className="flex items-end justify-between gap-2 h-32">
      {mockActivity.map((day) => (
        <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
          <div className="w-full flex flex-col items-center">
            <span className="text-xs text-muted-foreground mb-1">{day.hours}h</span>
            <div
              className="w-full max-w-[40px] bg-primary/20 rounded-t-sm relative overflow-hidden"
              style={{ height: `${(day.hours / maxHours) * 80}px` }}
            >
              <div
                className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-sm transition-all duration-500"
                style={{ height: '100%' }}
              />
            </div>
          </div>
          <span className="text-xs font-medium">{day.day}</span>
        </div>
      ))}
    </div>
  )
}

export default function StudentDashboardPage() {
  const { profile } = useAuth()
  const [greeting, setGreeting] = useState('Hello')

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good morning')
    else if (hour < 18) setGreeting('Good afternoon')
    else setGreeting('Good evening')
  }, [])

  const firstName = profile?.full_name?.split(' ')[0] || 'Student'

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            {greeting}, {firstName}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Ready to continue your learning journey?
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/30 rounded-full">
            <Flame className="h-5 w-5 text-amber-500" />
            <span className="font-semibold text-amber-700 dark:text-amber-400">
              {mockStats.currentStreak} day streak!
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={BookOpen}
          label="Courses in Progress"
          value={mockStats.coursesInProgress}
          trend={12}
          trendLabel="vs last month"
        />
        <StatCard
          icon={CheckCircle2}
          label="Courses Completed"
          value={mockStats.coursesCompleted}
          trend={8}
          trendLabel="vs last month"
        />
        <StatCard
          icon={Clock}
          label="Hours Learned"
          value={mockStats.totalHoursLearned}
          trend={15}
          trendLabel="vs last month"
        />
        <StatCard
          icon={Trophy}
          label="Certificates Earned"
          value={mockStats.certificatesEarned}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Continue Learning - Takes 2 columns */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Continue Learning</h2>
            <Link
              href="/dashboard/student/courses"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4">
            {mockContinueLearning.map((course) => (
              <Link key={course.id} href={`/courses/${course.id}/learn`}>
                <ContinueLearningCard course={course} />
              </Link>
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Overall Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Overall Progress</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <ProgressRing
                value={mockStats.overallProgress}
                size={140}
                strokeWidth={12}
                className="text-primary"
              />
              <p className="text-sm text-muted-foreground mt-4 text-center">
                You&apos;re making great progress! Keep up the momentum.
              </p>
              <div className="grid grid-cols-2 gap-4 w-full mt-4">
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <div className="text-2xl font-bold text-primary">
                    {mockStats.longestStreak}
                  </div>
                  <div className="text-xs text-muted-foreground">Longest Streak</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <div className="text-2xl font-bold text-primary">
                    {Math.round(mockStats.totalHoursLearned / 7)}h
                  </div>
                  <div className="text-xs text-muted-foreground">Weekly Average</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Weekly Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <WeeklyActivityChart />
              <p className="text-sm text-muted-foreground mt-4 text-center">
                Total: {mockActivity.reduce((sum, d) => sum + d.hours, 0).toFixed(1)} hours this week
              </p>
            </CardContent>
          </Card>

          {/* Upcoming */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5" />
                Upcoming
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {mockUpcoming.map((item) => (
                <UpcomingItem key={item.id} item={item} />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recommended Courses */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recommended for You</h2>
          <Link
            href="/courses"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            Browse all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockRecommended.map((course) => (
            <RecommendedCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  )
}
