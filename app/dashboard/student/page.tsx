'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import {
  BookOpen,
  Clock,
  Trophy,
  Play,
  CheckCircle2,
  Flame,
  Target,
  Calendar,
  ArrowRight,
  Star,
  BarChart3,
  Video,
  FileText,
  ChevronRight,
  Award,
  TrendingUp,
  GraduationCap,
  Users,
  Zap,
} from 'lucide-react'
import { useAuth } from '@/lib/hooks/use-auth'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
// Dashboard data type
interface DashboardData {
  student: {
    id: string
    full_name: string
    email: string
    avatar_url: string | null
    streak_days: number
    total_hours_learned: number
  }
  enrollments: Array<{
    id: string
    course_id: string
    progress_percentage: number
    status: string
    enrolled_at: string
    completed_at: string | null
    last_accessed_at: string
    course: {
      id: string
      title: string
      slug: string
      thumbnail_url: string | null
      category: string
      level: string
      instructor: {
        full_name: string
        avatar_url: string | null
      } | null
    } | null
    completed_lessons: number
    total_lessons: number
  }>
  certificates: Array<{
    id: string
    course_id: string
    course_title: string
    student_name: string
    certificate_number: string
    verification_url: string
    issue_date: string
    grade: string
  }>
  analytics: {
    total_courses_enrolled: number
    courses_completed: number
    certificates_earned: number
    total_hours_learned: number
    current_streak: number
    longest_streak: number
    average_quiz_score: number
    learning_by_day: Array<{ day: string; hours: number }>
    category_distribution: Array<{ category: string; hours: number }>
  }
  upcomingLiveTrainings: Array<{
    id: string
    title: string
    scheduled_start: string
    course?: { title: string }
    meeting_url: string
  }>
}

// Continue Learning Hero Card
function ContinueLearningHero({
  course,
}: {
  course: {
    id: string
    title: string
    instructor: string
    progress: number
    currentLesson: string
    currentModule: string
    totalLessons: number
    completedLessons: number
    partner: string
  }
}) {
  return (
    <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-xl border overflow-hidden">
      <div className="p-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Zap className="w-4 h-4 text-primary" />
          <span>Continue where you left off</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          {/* Course Preview */}
          <div className="relative w-full lg:w-80 aspect-video lg:aspect-[4/3] rounded-lg overflow-hidden flex-shrink-0 bg-muted">
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/30 to-primary/10">
              <BookOpen className="h-16 w-16 text-primary/60" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="p-4 rounded-full bg-white shadow-lg hover:scale-105 transition-transform">
                <Play className="h-8 w-8 text-primary fill-primary" />
              </button>
            </div>
            {/* Progress Overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
              <div
                className="h-full bg-primary"
                style={{ width: `${course.progress}%` }}
              />
            </div>
          </div>

          {/* Course Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">{course.partner}</span>
            </div>

            <h2 className="text-xl font-bold text-foreground mb-2 line-clamp-2">
              {course.title}
            </h2>

            <p className="text-sm text-muted-foreground mb-4">
              {course.instructor}
            </p>

            {/* Current Lesson Info */}
            <div className="bg-background rounded-lg p-3 mb-4">
              <p className="text-xs text-muted-foreground mb-1">Up Next</p>
              <p className="text-sm font-medium text-foreground">{course.currentLesson}</p>
              <p className="text-xs text-muted-foreground mt-1">{course.currentModule}</p>
            </div>

            {/* Progress */}
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-muted-foreground">Your Progress</span>
                  <span className="font-medium">{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {course.completedLessons} of {course.totalLessons} lessons completed
                </p>
              </div>

              <Link
                href={`/courses/${course.id}/learn`}
                className="inline-flex items-center gap-2 h-11 px-6 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors whitespace-nowrap"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Course Progress Card
function CourseProgressCard({
  course,
}: {
  course: {
    id: string
    title: string
    instructor: string
    progress: number
    totalLessons: number
    completedLessons: number
    partner: string
  }
}) {
  return (
    <Link
      href={`/courses/${course.id}/learn`}
      className="flex gap-4 p-4 rounded-lg border bg-background hover:bg-muted/50 transition-colors group"
    >
      {/* Thumbnail */}
      <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
          <BookOpen className="h-8 w-8 text-primary/50" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
          <Play className="h-5 w-5 text-white fill-white" />
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground mb-0.5">{course.partner}</p>
        <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {course.title}
        </h3>
        <p className="text-sm text-muted-foreground">{course.instructor}</p>

        <div className="mt-2">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-muted-foreground">
              {course.completedLessons}/{course.totalLessons} lessons
            </span>
            <span className="font-medium">{course.progress}%</span>
          </div>
          <Progress value={course.progress} className="h-1.5" />
        </div>
      </div>
    </Link>
  )
}

// Weekly Goal Card
function WeeklyGoalCard({
  currentMinutes,
  goalMinutes,
  daysActive,
  streak,
}: {
  currentMinutes: number
  goalMinutes: number
  daysActive: number
  streak: number
}) {
  const progress = Math.min((currentMinutes / goalMinutes) * 100, 100)
  const currentHours = Math.floor(currentMinutes / 60)
  const goalHours = Math.floor(goalMinutes / 60)

  return (
    <div className="rounded-xl border bg-background p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Weekly goal</h3>
        {streak > 0 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 dark:bg-amber-900/30 rounded-full">
            <Flame className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium text-amber-700 dark:text-amber-400">
              {streak} day streak
            </span>
          </div>
        )}
      </div>

      {/* Progress Ring */}
      <div className="flex items-center gap-6">
        <div className="relative w-24 h-24 flex-shrink-0">
          <svg className="w-24 h-24 transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="42"
              className="stroke-muted"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="48"
              cy="48"
              r="42"
              className="stroke-primary"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${progress * 2.64} 264`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold">{currentHours}h</span>
            <span className="text-xs text-muted-foreground">of {goalHours}h</span>
          </div>
        </div>

        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-3">
            {progress >= 100
              ? "You've reached your weekly goal!"
              : `${goalMinutes - currentMinutes} min to reach your goal`}
          </p>
          <div className="flex items-center gap-4">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
              <div
                key={i}
                className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium',
                  i < daysActive
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {day}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Link
        href="/dashboard/student/goals"
        className="block mt-4 text-sm text-primary hover:underline"
      >
        Edit weekly goal
      </Link>
    </div>
  )
}

// Upcoming Deadline Card
function UpcomingDeadlineCard({
  items,
}: {
  items: Array<{
    id: string
    title: string
    course: string
    dueDate: Date
    type: 'assignment' | 'quiz' | 'project'
  }>
}) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'quiz':
        return Target
      case 'project':
        return FileText
      default:
        return FileText
    }
  }

  const formatDueDate = (date: Date) => {
    const now = new Date()
    const diff = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    if (diff <= 0) return 'Due today'
    if (diff === 1) return 'Due tomorrow'
    if (diff <= 7) return `Due in ${diff} days`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const getDueDateColor = (date: Date) => {
    const now = new Date()
    const diff = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    if (diff <= 1) return 'text-destructive'
    if (diff <= 3) return 'text-amber-600 dark:text-amber-500'
    return 'text-muted-foreground'
  }

  return (
    <div className="rounded-xl border bg-background">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Upcoming deadlines</h3>
          <Link
            href="/dashboard/student/calendar"
            className="text-sm text-primary hover:underline"
          >
            View all
          </Link>
        </div>
      </div>

      {items.length > 0 ? (
        <div className="divide-y">
          {items.map((item) => {
            const Icon = getTypeIcon(item.type)
            return (
              <div key={item.id} className="flex items-start gap-3 p-4">
                <div className="p-2 rounded-lg bg-muted">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-foreground line-clamp-1">
                    {item.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.course}</p>
                </div>
                <span className={cn('text-xs font-medium', getDueDateColor(item.dueDate))}>
                  {formatDueDate(item.dueDate)}
                </span>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="p-8 text-center">
          <Calendar className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No upcoming deadlines</p>
        </div>
      )}
    </div>
  )
}

// Achievement Card
function AchievementCard({
  certificates,
  completedCourses,
}: {
  certificates: number
  completedCourses: number
}) {
  return (
    <div className="rounded-xl border bg-background p-5">
      <h3 className="font-semibold text-foreground mb-4">Achievements</h3>

      <div className="space-y-4">
        <Link
          href="/dashboard/student/certificates"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
        >
          <div className="p-2 rounded-lg bg-primary/10">
            <Award className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Certificates</p>
            <p className="text-xs text-muted-foreground">Earned credentials</p>
          </div>
          <span className="text-lg font-bold text-primary">{certificates}</span>
        </Link>

        <Link
          href="/dashboard/student/courses?filter=completed"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
        >
          <div className="p-2 rounded-lg bg-success/10">
            <CheckCircle2 className="w-5 h-5 text-success" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Completed</p>
            <p className="text-xs text-muted-foreground">Finished courses</p>
          </div>
          <span className="text-lg font-bold text-success">{completedCourses}</span>
        </Link>
      </div>
    </div>
  )
}

// Live Session Banner
function LiveSessionBanner({
  session,
}: {
  session: {
    id: string
    title: string
    startTime: Date
    course: string
    meetingUrl: string
  }
}) {
  const isLive = new Date() >= session.startTime

  return (
    <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-xl p-4 text-white">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-white/20 rounded-lg">
          <Video className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {isLive && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white/20 rounded text-xs font-medium">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                LIVE NOW
              </span>
            )}
          </div>
          <h3 className="font-semibold">{session.title}</h3>
          <p className="text-sm text-white/80">{session.course}</p>
        </div>
        <a
          href={session.meetingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-white text-red-600 rounded-lg font-medium hover:bg-white/90 transition-colors"
        >
          {isLive ? 'Join Now' : 'Set Reminder'}
        </a>
      </div>
    </div>
  )
}

// Recommended Course Card
function RecommendedCourseCard({
  course,
}: {
  course: {
    id: string
    slug: string
    title: string
    instructor: string
    partner: string
    rating: number
    students: number
    level: string
  }
}) {
  return (
    <Link
      href={`/courses/${course.slug}`}
      className="block rounded-xl border bg-background overflow-hidden hover:shadow-md transition-shadow group"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-muted">
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
          <BookOpen className="h-12 w-12 text-primary/40" />
        </div>
        <div className="absolute top-2 left-2">
          <span className="px-2 py-1 bg-background/90 text-xs font-medium rounded">
            {course.level}
          </span>
        </div>
      </div>

      <div className="p-4">
        <p className="text-xs text-muted-foreground mb-1">{course.partner}</p>
        <h4 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {course.title}
        </h4>
        <p className="text-sm text-muted-foreground mt-1">{course.instructor}</p>

        <div className="flex items-center gap-2 mt-3 text-sm">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-warning fill-warning" />
            <span className="font-medium">{course.rating}</span>
          </div>
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground">
            {course.students.toLocaleString()} students
          </span>
        </div>
      </div>
    </Link>
  )
}

export default function StudentDashboardPage() {
  const { profile } = useAuth()
  const [greeting, setGreeting] = useState('Hello')
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good morning')
    else if (hour < 18) setGreeting('Good afternoon')
    else setGreeting('Good evening')
  }, [])

  // Fetch dashboard data from API
  useEffect(() => {
    async function fetchDashboard() {
      try {
        setIsLoading(true)
        const response = await fetch('/api/student/dashboard')
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data')
        }
        const data = await response.json()
        setDashboardData(data)
      } catch (err) {
        console.error('Dashboard fetch error:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  const firstName = dashboardData?.student?.full_name?.split(' ')[0] || profile?.full_name?.split(' ')[0] || 'Student'

  // Derive data from API response - wrapped in useMemo for stable references
  const studentAnalytics = useMemo(() => dashboardData?.analytics || {
    total_courses_enrolled: 0,
    courses_completed: 0,
    certificates_earned: 0,
    total_hours_learned: 0,
    current_streak: 0,
    longest_streak: 0,
    average_quiz_score: 0,
    learning_by_day: [],
    category_distribution: []
  }, [dashboardData?.analytics])

  const studentEnrollments = useMemo(() => dashboardData?.enrollments || [], [dashboardData?.enrollments])
  const studentCertificates = useMemo(() => dashboardData?.certificates || [], [dashboardData?.certificates])
  const upcomingLiveTrainings = useMemo(() => dashboardData?.upcomingLiveTrainings || [], [dashboardData?.upcomingLiveTrainings])

  // Most recent course for hero
  const heroCoursre = useMemo(() => {
    const active = studentEnrollments
      .filter(e => e.status === 'active')
      .sort((a, b) => {
        const aDate = new Date(a.last_accessed_at || a.enrolled_at).getTime()
        const bDate = new Date(b.last_accessed_at || b.enrolled_at).getTime()
        return bDate - aDate
      })[0]

    if (!active || !active.course) return null

    return {
      id: active.course.id,
      title: active.course.title,
      instructor: active.course.instructor?.full_name || 'Unknown Instructor',
      progress: active.progress_percentage,
      currentLesson: `Lesson ${active.completed_lessons + 1}`,
      currentModule: `Module ${Math.floor(active.completed_lessons / 5) + 1}`,
      totalLessons: active.total_lessons,
      completedLessons: active.completed_lessons,
      partner: 'Phazur Labs',
    }
  }, [studentEnrollments])

  // Other active courses (excluding hero)
  const otherCourses = useMemo(() => {
    return studentEnrollments
      .filter(e => e.status === 'active' && e.course && e.course.id !== heroCoursre?.id)
      .slice(0, 3)
      .map(e => ({
        id: e.course!.id,
        title: e.course!.title,
        instructor: e.course!.instructor?.full_name || 'Unknown Instructor',
        progress: e.progress_percentage,
        totalLessons: e.total_lessons,
        completedLessons: e.completed_lessons,
        partner: 'Phazur Labs',
      }))
  }, [studentEnrollments, heroCoursre])

  // Completed courses count
  const completedCount = useMemo(() => {
    return studentEnrollments.filter(e => e.status === 'completed').length
  }, [studentEnrollments])

  // Weekly stats
  const weeklyStats = useMemo(() => ({
    currentMinutes: studentAnalytics.learning_by_day.reduce((sum, d) => sum + d.hours * 60, 0),
    goalMinutes: 5 * 60, // 5 hours goal
    daysActive: studentAnalytics.learning_by_day.filter(d => d.hours > 0).length,
    streak: studentAnalytics.current_streak,
  }), [studentAnalytics])

  // Upcoming deadlines (mock - would need real deadlines table)
  const upcomingDeadlines = useMemo(() => {
    const deadlines: Array<{
      id: string
      title: string
      course: string
      dueDate: Date
      type: 'assignment' | 'quiz' | 'project'
    }> = []

    const firstEnrollment = studentEnrollments[0]
    if (firstEnrollment?.course) {
      deadlines.push({
        id: 'quiz-1',
        title: 'Module 3 Quiz',
        course: firstEnrollment.course.title,
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        type: 'quiz',
      })

      const secondEnrollment = studentEnrollments[1]
      if (secondEnrollment?.course) {
        deadlines.push({
          id: 'project-1',
          title: 'Final Project Submission',
          course: secondEnrollment.course.title,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          type: 'project',
        })
      }
    }

    return deadlines
  }, [studentEnrollments])

  // Next live session
  const nextLiveSession = useMemo(() => {
    if (upcomingLiveTrainings.length === 0) return null
    const training = upcomingLiveTrainings[0]
    return {
      id: training.id,
      title: training.title,
      startTime: new Date(training.scheduled_start),
      course: training.course?.title || 'General',
      meetingUrl: training.meeting_url,
    }
  }, [upcomingLiveTrainings])

  // Recommended courses (would need separate API for real recommendations)
  // For now, return empty - recommendations feature to be implemented
  const recommendedCourses: Array<{
    id: string
    slug: string
    title: string
    instructor: string
    partner: string
    rating: number
    students: number
    level: string
  }> = []

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <div className="h-8 w-48 bg-muted rounded animate-pulse" />
          <div className="h-5 w-64 bg-muted rounded animate-pulse mt-2" />
        </div>
        <div className="bg-muted/30 rounded-xl h-64 animate-pulse" />
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-32 bg-muted rounded-xl animate-pulse" />
            <div className="h-32 bg-muted rounded-xl animate-pulse" />
          </div>
          <div className="space-y-4">
            <div className="h-40 bg-muted rounded-xl animate-pulse" />
            <div className="h-32 bg-muted rounded-xl animate-pulse" />
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
          <BookOpen className="w-8 h-8 text-destructive" />
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
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {greeting}, {firstName}
        </h1>
        <p className="text-muted-foreground mt-1">
          Ready to continue your learning journey?
        </p>
      </div>

      {/* Live Session Banner */}
      {nextLiveSession && (
        <LiveSessionBanner session={nextLiveSession} />
      )}

      {/* Continue Learning Hero */}
      {heroCoursre ? (
        <ContinueLearningHero course={heroCoursre} />
      ) : (
        <div className="rounded-xl border bg-muted/30 p-8 text-center">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">Start your learning journey</h3>
          <p className="text-muted-foreground mb-4">
            Browse our catalog to find courses that match your goals
          </p>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90"
          >
            Browse Courses
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - My Courses */}
        <div className="lg:col-span-2 space-y-6">
          {/* Other In-Progress Courses */}
          {otherCourses.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">My Courses</h2>
                <Link
                  href="/dashboard/student/courses"
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  View all
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="space-y-3">
                {otherCourses.map(course => (
                  <CourseProgressCard key={course.id} course={course} />
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Deadlines */}
          <UpcomingDeadlineCard items={upcomingDeadlines} />
        </div>

        {/* Right Column - Sidebar Widgets */}
        <div className="space-y-6">
          {/* Weekly Goal */}
          <WeeklyGoalCard {...weeklyStats} />

          {/* Achievements */}
          <AchievementCard
            certificates={studentCertificates.length}
            completedCourses={completedCount}
          />
        </div>
      </div>

      {/* Recommended Courses */}
      {recommendedCourses.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Recommended for you</h2>
              <p className="text-sm text-muted-foreground">Based on your interests and learning history</p>
            </div>
            <Link
              href="/courses"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              Browse all
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendedCourses.map(course => (
              <RecommendedCourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
