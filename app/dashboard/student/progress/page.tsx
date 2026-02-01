'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, BookOpen, Trophy, Target, Clock, Flame, Award } from 'lucide-react'
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
    totalCourses: 6,
    completedCourses: 1,
    totalLessons: 86,
    completedLessons: 23,
    totalHours: 12.5,
    currentStreak: 5,
    longestStreak: 12,
    averageQuizScore: 85,
  })

  const [courses, setCourses] = useState<CourseProgress[]>([
    { id: '1', title: 'AI Foundations & Tool Mastery', progress: 75, completedLessons: 11, totalLessons: 15, lastAccessed: new Date().toISOString() },
    { id: '2', title: 'Building AI Agents', progress: 45, completedLessons: 7, totalLessons: 15, lastAccessed: new Date().toISOString() },
    { id: '3', title: 'MCP Development', progress: 20, completedLessons: 3, totalLessons: 13, lastAccessed: new Date().toISOString() },
    { id: '4', title: 'AI Workflow Architecture', progress: 10, completedLessons: 2, totalLessons: 15, lastAccessed: new Date().toISOString() },
  ])

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
          {courses.map(course => (
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
          ))}
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
