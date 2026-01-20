'use client'

import { useState, useEffect, useMemo } from 'react'
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
  Video,
  FileText,
} from 'lucide-react'
import { useAuth } from '@/lib/hooks/use-auth'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Progress, ProgressRing } from '@/components/ui/progress'
import { Badge, LevelBadge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  courses,
  enrollments,
  liveTrainings,
  certificates,
  getEnrollmentsByStudentId,
  getStudentAnalytics,
  getUpcomingLiveTrainings,
  getCertificatesByStudentId,
} from '@/lib/data/store'

// For demo purposes, we use a mock student ID
const CURRENT_STUDENT_ID = 'student-1'

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
  course: {
    id: string
    title: string
    instructor: string
    progress: number
    lastLesson: string
    totalLessons: number
    completedLessons: number
    level: 'beginner' | 'intermediate' | 'advanced'
  }
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
  course: {
    id: string
    title: string
    instructor: string
    rating: number
    students: number
    duration: string
    level: 'beginner' | 'intermediate' | 'advanced'
    price: number
  }
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
  item: {
    id: string
    title: string
    date: Date
    course: string
    type: 'live' | 'quiz' | 'assignment'
  }
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

  const typeIcons = {
    live: Video,
    quiz: Target,
    assignment: FileText,
  }

  const Icon = typeIcons[item.type]

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
      <div className={cn('p-2 rounded-lg', typeStyles[item.type])}>
        <Icon className="h-4 w-4" />
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

function WeeklyActivityChart({ data }: { data: { day: string; hours: number }[] }) {
  const maxHours = Math.max(...data.map(d => d.hours))

  return (
    <div className="flex items-end justify-between gap-2 h-32">
      {data.map((day) => (
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

  // Get student data from shared store
  const studentAnalytics = useMemo(() => getStudentAnalytics(CURRENT_STUDENT_ID), [])
  const studentEnrollments = useMemo(() => getEnrollmentsByStudentId(CURRENT_STUDENT_ID), [])
  const studentCertificates = useMemo(() => getCertificatesByStudentId(CURRENT_STUDENT_ID), [])
  const upcomingLiveTrainings = useMemo(() => getUpcomingLiveTrainings(), [])

  // Calculate stats from shared data
  const stats = useMemo(() => {
    const activeEnrollments = studentEnrollments.filter(e => e.status === 'active')
    const completedEnrollments = studentEnrollments.filter(e => e.status === 'completed')

    return {
      coursesInProgress: activeEnrollments.length,
      coursesCompleted: completedEnrollments.length,
      totalHoursLearned: studentAnalytics.total_hours_learned,
      currentStreak: studentAnalytics.current_streak,
      longestStreak: studentAnalytics.longest_streak,
      certificatesEarned: studentCertificates.length,
      overallProgress: Math.round(
        studentEnrollments.reduce((sum, e) => sum + e.progress_percentage, 0) /
        (studentEnrollments.length || 1)
      ),
    }
  }, [studentEnrollments, studentAnalytics, studentCertificates])

  // Continue learning courses from shared data
  const continueLearning = useMemo(() => {
    return studentEnrollments
      .filter(e => e.status === 'active')
      .sort((a, b) => {
        const aDate = new Date(a.last_accessed_at || a.enrolled_at).getTime()
        const bDate = new Date(b.last_accessed_at || b.enrolled_at).getTime()
        return bDate - aDate
      })
      .slice(0, 3)
      .map(enrollment => ({
        id: enrollment.course.id,
        title: enrollment.course.title,
        instructor: enrollment.course.instructor.full_name,
        progress: enrollment.progress_percentage,
        lastLesson: `Lesson ${enrollment.completed_lessons.length + 1}`,
        totalLessons: enrollment.course.total_lessons,
        completedLessons: enrollment.completed_lessons.length,
        level: enrollment.course.level,
      }))
  }, [studentEnrollments])

  // Recommended courses (courses not enrolled in)
  const recommendedCourses = useMemo(() => {
    const enrolledCourseIds = studentEnrollments.map(e => e.course_id)
    return courses
      .filter(c => c.status === 'published' && !enrolledCourseIds.includes(c.id))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 4)
      .map(course => ({
        id: course.id,
        title: course.title,
        instructor: course.instructor.full_name,
        rating: course.rating,
        students: course.enrolled_students,
        duration: `${Math.round(course.total_duration_minutes / 60)} hours`,
        level: course.level,
        price: course.discount_price || course.price,
      }))
  }, [studentEnrollments])

  // Upcoming events (live trainings + mock quizzes/assignments)
  const upcomingEvents = useMemo(() => {
    const events: Array<{
      id: string
      title: string
      date: Date
      course: string
      type: 'live' | 'quiz' | 'assignment'
    }> = []

    // Add live trainings
    upcomingLiveTrainings.slice(0, 2).forEach(training => {
      events.push({
        id: training.id,
        title: training.title,
        date: new Date(training.scheduled_start),
        course: training.course?.title || 'General',
        type: 'live',
      })
    })

    // Add mock quiz and assignment
    if (studentEnrollments.length > 0) {
      events.push({
        id: 'quiz-1',
        title: `Quiz: ${studentEnrollments[0].course.title.split(' ').slice(0, 3).join(' ')}`,
        date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        course: studentEnrollments[0].course.title,
        type: 'quiz',
      })

      if (studentEnrollments.length > 1) {
        events.push({
          id: 'assignment-1',
          title: 'Assignment Due: Project Submission',
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          course: studentEnrollments[1].course.title,
          type: 'assignment',
        })
      }
    }

    return events.sort((a, b) => a.date.getTime() - b.date.getTime()).slice(0, 3)
  }, [upcomingLiveTrainings, studentEnrollments])

  // Weekly activity from analytics
  const weeklyActivity = useMemo(() => {
    return studentAnalytics.learning_by_day
  }, [studentAnalytics])

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
              {stats.currentStreak} day streak!
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={BookOpen}
          label="Courses in Progress"
          value={stats.coursesInProgress}
          trend={12}
          trendLabel="vs last month"
        />
        <StatCard
          icon={CheckCircle2}
          label="Courses Completed"
          value={stats.coursesCompleted}
          trend={8}
          trendLabel="vs last month"
        />
        <StatCard
          icon={Clock}
          label="Hours Learned"
          value={stats.totalHoursLearned}
          trend={15}
          trendLabel="vs last month"
        />
        <StatCard
          icon={Trophy}
          label="Certificates Earned"
          value={stats.certificatesEarned}
        />
      </div>

      {/* Upcoming Live Training Banner */}
      {upcomingLiveTrainings.length > 0 && (
        <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Video className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Upcoming Live Session</h3>
                <p className="text-white/80">{upcomingLiveTrainings[0].title}</p>
                <p className="text-sm text-white/60">
                  {new Date(upcomingLiveTrainings[0].scheduled_start).toLocaleString('en-US', {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
            <a
              href={upcomingLiveTrainings[0].meeting_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              <span>Set Reminder</span>
              <Calendar className="h-4 w-4" />
            </a>
          </div>
        </div>
      )}

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
            {continueLearning.length > 0 ? (
              continueLearning.map((course) => (
                <Link key={course.id} href={`/courses/${course.id}/learn`}>
                  <ContinueLearningCard course={course} />
                </Link>
              ))
            ) : (
              <Card className="p-8 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No courses in progress</h3>
                <p className="text-muted-foreground mb-4">
                  Start your learning journey by enrolling in a course
                </p>
                <Link
                  href="/courses"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                >
                  Browse Courses
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Card>
            )}
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
                value={stats.overallProgress}
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
                    {stats.longestStreak}
                  </div>
                  <div className="text-xs text-muted-foreground">Longest Streak</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <div className="text-2xl font-bold text-primary">
                    {Math.round(stats.totalHoursLearned / 7)}h
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
              <WeeklyActivityChart data={weeklyActivity} />
              <p className="text-sm text-muted-foreground mt-4 text-center">
                Total: {weeklyActivity.reduce((sum, d) => sum + d.hours, 0).toFixed(1)} hours this week
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
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((item) => (
                  <UpcomingItem key={item.id} item={item} />
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No upcoming events
                </p>
              )}
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
          {recommendedCourses.map((course) => (
            <RecommendedCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  )
}
