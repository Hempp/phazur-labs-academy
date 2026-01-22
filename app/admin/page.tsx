'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Users,
  GraduationCap,
  BookOpen,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Play,
  CheckCircle2,
  Clock,
  AlertCircle,
  MoreVertical,
  Download,
  Eye,
  UserPlus,
  Video,
  Award,
  Target,
  Activity,
  Calendar,
  Filter
} from 'lucide-react'
import {
  courses,
  students,
  enrollments,
  activities,
  liveTrainings,
  getAdminDashboardStats,
  getUpcomingLiveTrainings,
} from '@/lib/data/store'

// Activity icon mapping
const activityIcons = {
  enrollment: UserPlus,
  completion: CheckCircle2,
  video_upload: Video,
  certificate: Award,
  quiz: Target,
  assignment: Target,
  course_created: BookOpen,
  live_training: Calendar,
}

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState('7d')

  // Get stats from shared store
  const dashboardStats = useMemo(() => getAdminDashboardStats(), [])
  const upcomingTrainings = useMemo(() => getUpcomingLiveTrainings(), [])

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Format number with commas
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  // Stats from shared data
  const stats = [
    {
      name: 'Total Students',
      value: formatNumber(dashboardStats.total_students),
      change: '+12.5%',
      changeType: 'positive',
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      name: 'Active Courses',
      value: dashboardStats.published_courses.toString(),
      change: '+8.2%',
      changeType: 'positive',
      icon: BookOpen,
      color: 'bg-violet-500',
    },
    {
      name: 'Course Completions',
      value: formatNumber(dashboardStats.total_completions),
      change: '+23.1%',
      changeType: 'positive',
      icon: GraduationCap,
      color: 'bg-emerald-500',
    },
    {
      name: 'Monthly Revenue',
      value: formatCurrency(dashboardStats.monthly_revenue),
      change: '+18.7%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'bg-amber-500',
    },
  ]

  // Top courses from shared data
  const topCourses = useMemo(() => {
    return courses
      .filter(c => c.status === 'published')
      .sort((a, b) => b.enrolled_students - a.enrolled_students)
      .slice(0, 4)
      .map(course => ({
        id: course.id,
        name: course.title,
        students: course.enrolled_students,
        completionRate: course.completion_rate,
        revenue: formatCurrency(course.revenue),
        rating: course.rating,
      }))
  }, [])

  // Recent students with enrollments from shared data
  const recentStudents = useMemo(() => {
    return enrollments
      .sort((a, b) => new Date(b.enrolled_at).getTime() - new Date(a.enrolled_at).getTime())
      .slice(0, 5)
      .map(enrollment => ({
        id: enrollment.id,
        name: enrollment.student.full_name,
        email: enrollment.student.email,
        course: enrollment.course.title,
        progress: enrollment.progress_percentage,
        status: enrollment.status === 'active' ? 'active' : 'inactive',
        avatar: enrollment.student.full_name.charAt(0),
      }))
  }, [])

  // Recent activities from shared data
  const recentActivities = useMemo(() => {
    return activities
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5)
      .map(activity => {
        const Icon = activityIcons[activity.type] || Activity
        const now = new Date()
        const activityDate = new Date(activity.created_at)
        const diffMs = now.getTime() - activityDate.getTime()
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMins / 60)
        const diffDays = Math.floor(diffHours / 24)

        let time = ''
        if (diffMins < 60) {
          time = `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`
        } else if (diffHours < 24) {
          time = `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
        } else {
          time = `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
        }

        return {
          id: activity.id,
          type: activity.type,
          message: activity.message,
          time,
          icon: Icon,
        }
      })
  }, [])

  // Mock engagement data (would come from analytics in production)
  const engagementData = [
    { day: 'Mon', students: 2400 },
    { day: 'Tue', students: 1398 },
    { day: 'Wed', students: 3800 },
    { day: 'Thu', students: 3908 },
    { day: 'Fri', students: 4800 },
    { day: 'Sat', students: 3800 },
    { day: 'Sun', students: 2300 },
  ]

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here&apos;s what&apos;s happening with your academy.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-sm"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">
            <Download className="h-4 w-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <span
                className={`flex items-center gap-1 text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-emerald-600' : 'text-red-600'
                }`}
              >
                {stat.changeType === 'positive' ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                {stat.change}
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-bold">{stat.value}</h3>
              <p className="text-muted-foreground text-sm mt-1">{stat.name}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming Live Trainings Banner */}
      {upcomingTrainings.length > 0 && (
        <div className="bg-gradient-to-r from-blue-500 to-violet-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Upcoming Live Training</h3>
                <p className="text-white/80">{upcomingTrainings[0].title}</p>
                <p className="text-sm text-white/60">
                  {new Date(upcomingTrainings[0].scheduled_start).toLocaleString('en-US', {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
            <Link
              href="/admin/live-training"
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Engagement Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-lg">Student Engagement</h3>
              <p className="text-sm text-muted-foreground">Daily active students this week</p>
            </div>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <MoreVertical className="h-5 w-5 text-gray-400" />
            </button>
          </div>

          {/* Simple Bar Chart */}
          <div className="h-64 flex items-end justify-between gap-4">
            {engagementData.map((data, index) => {
              const maxValue = Math.max(...engagementData.map(d => d.students))
              const height = (data.students / maxValue) * 100
              return (
                <div key={data.day} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full relative">
                    <div
                      className="w-full bg-gradient-to-t from-primary to-violet-500 rounded-t-lg transition-all hover:opacity-80"
                      style={{ height: `${height * 2}px` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{data.day}</span>
                </div>
              )
            })}
          </div>

          <div className="mt-6 flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-sm text-muted-foreground">Active Students</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-emerald-500" />
                <span className="text-sm text-muted-foreground">+18.2% vs last week</span>
              </div>
            </div>
            <Link href="/admin/analytics" className="text-sm text-primary hover:underline flex items-center gap-1">
              View Details <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg">Recent Activity</h3>
            <Link href="/admin/activity" className="text-sm text-primary hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  activity.type === 'enrollment' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                  activity.type === 'completion' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' :
                  activity.type === 'video_upload' ? 'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400' :
                  activity.type === 'certificate' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' :
                  activity.type === 'live_training' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                  'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                }`}>
                  <activity.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{activity.message}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Students */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">Recent Students</h3>
                <p className="text-sm text-muted-foreground">Latest enrollments and progress</p>
              </div>
              <Link
                href="/admin/students"
                className="flex items-center gap-1 text-sm text-primary hover:underline"
              >
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {recentStudents.map((student) => (
              <div key={student.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center text-white font-semibold">
                    {student.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium truncate">{student.name}</p>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        student.status === 'active'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                      }`}>
                        {student.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{student.course}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-violet-500 rounded-full"
                          style={{ width: `${student.progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium">{student.progress}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Courses */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">Top Performing Courses</h3>
                <p className="text-sm text-muted-foreground">By enrollment and revenue</p>
              </div>
              <Link
                href="/admin/courses"
                className="flex items-center gap-1 text-sm text-primary hover:underline"
              >
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {topCourses.map((course, index) => (
              <div key={course.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-violet-500/20 flex items-center justify-center font-bold text-primary">
                    #{index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{course.name}</p>
                    <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Students</p>
                        <p className="font-semibold">{course.students.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Completion</p>
                        <p className="font-semibold">{course.completionRate}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Revenue</p>
                        <p className="font-semibold text-emerald-600">{course.revenue}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded text-sm">
                    <span>⭐</span>
                    <span className="font-medium">{course.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-primary to-violet-600 rounded-xl p-6 text-white">
        <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Link
            href="/admin/courses/create"
            className="flex items-center gap-3 p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
          >
            <BookOpen className="h-6 w-6" />
            <span className="font-medium">Create Course</span>
          </Link>
          <Link
            href="/admin/videos/upload"
            className="flex items-center gap-3 p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
          >
            <Video className="h-6 w-6" />
            <span className="font-medium">Upload Video</span>
          </Link>
          <Link
            href="/admin/students/invite"
            className="flex items-center gap-3 p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
          >
            <UserPlus className="h-6 w-6" />
            <span className="font-medium">Invite Students</span>
          </Link>
          <Link
            href="/admin/live-training"
            className="flex items-center gap-3 p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
          >
            <Calendar className="h-6 w-6" />
            <span className="font-medium">Schedule Live</span>
          </Link>
          <Link
            href="/admin/quizzes/create"
            className="flex items-center gap-3 p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
          >
            <Target className="h-6 w-6" />
            <span className="font-medium">Create Quiz</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
