'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, BookOpen, Target, Clock, Flame, Award, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

interface ProgressStats {
  totalCourses: number
  completedCourses: number
  totalLessons: number
  completedLessons: number
  totalHours: number
  currentStreak: number
  longestStreak: number
  averageQuizScore: number
}

interface CourseProgress {
  id: string
  title: string
  progress: number
  completedLessons: number
  totalLessons: number
  lastAccessed: string
}

export default function ProgressPage() {
  const [stats, setStats] = useState<ProgressStats>({
    totalCourses: 0,
    completedCourses: 0,
    totalLessons: 0,
    completedLessons: 0,
    totalHours: 0,
    currentStreak: 0,
    longestStreak: 0,
    averageQuizScore: 0,
  })
  const [courses, setCourses] = useState<CourseProgress[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchProgress() {
      try {
        const response = await fetch('/api/student/dashboard')
        if (!response.ok) throw new Error('Failed to fetch')

        const data = await response.json()

        // Calculate stats from enrollments
        const enrollments = data.enrollments || []
        const totalLessons = enrollments.reduce((sum: number, e: { total_lessons: number }) => sum + (e.total_lessons || 0), 0)
        const completedLessons = enrollments.reduce((sum: number, e: { completed_lessons: number }) => sum + (e.completed_lessons || 0), 0)
        const completedCourses = enrollments.filter((e: { progress_percentage: number }) => e.progress_percentage === 100).length

        setStats({
          totalCourses: enrollments.length,
          completedCourses,
          totalLessons,
          completedLessons,
          totalHours: data.analytics?.total_hours_learned || data.student?.total_hours_learned || 0,
          currentStreak: data.analytics?.current_streak || data.student?.streak_days || 0,
          longestStreak: data.analytics?.longest_streak || 0,
          averageQuizScore: data.analytics?.average_quiz_score || 0,
        })

        // Transform enrollments to course progress
        const courseProgress = enrollments.map((e: {
          course_id: string
          course: { title: string } | null
          progress_percentage: number
          completed_lessons: number
          total_lessons: number
          last_accessed_at: string
        }) => ({
          id: e.course_id,
          title: e.course?.title || 'Untitled Course',
          progress: Math.round(e.progress_percentage || 0),
          completedLessons: e.completed_lessons || 0,
          totalLessons: e.total_lessons || 0,
          lastAccessed: e.last_accessed_at,
        }))

        setCourses(courseProgress)
      } catch (error) {
        console.error('Failed to fetch progress:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProgress()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Learning Progress</h1>
        <p className="text-muted-foreground">Track your learning journey and achievements</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.completedCourses}/{stats.totalCourses}</p>
                <p className="text-xs text-muted-foreground">Courses Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.completedLessons}</p>
                <p className="text-xs text-muted-foreground">Lessons Done</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <Flame className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.currentStreak}</p>
                <p className="text-xs text-muted-foreground">Day Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.averageQuizScore}%</p>
                <p className="text-xs text-muted-foreground">Avg Quiz Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Course Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {courses.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No enrolled courses yet. Start learning to see your progress here!
            </p>
          ) : (
            courses.map(course => (
              <div key={course.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{course.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {course.completedLessons} of {course.totalLessons} lessons
                    </p>
                  </div>
                  <Badge variant={course.progress === 100 ? 'default' : 'secondary'}>
                    {course.progress}%
                  </Badge>
                </div>
                <Progress value={course.progress} className="h-2" />
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Time Spent */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Learning Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-4xl font-bold">{stats.totalHours}</p>
            <p className="text-muted-foreground">Total hours learned</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
