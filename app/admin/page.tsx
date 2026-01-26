'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
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
  Filter,
  Star,
  FileText,
  RefreshCw,
  FileJson,
  BarChart2
} from 'lucide-react'
import {
  liveTrainings,
  getUpcomingLiveTrainings,
} from '@/lib/data/store'

// Types for API response
interface DashboardStats {
  totalStudents: number
  activeStudents: number
  publishedCourses: number
  totalCompletions: number
  monthlyRevenue: number
  averageCompletionRate: number
}

interface TopCourse {
  id: string
  title: string
  enrollments: number
  revenue: number
  rating: number
}

interface RecentEnrollment {
  id: string
  studentName: string
  courseName: string
  enrolledAt: string
  progress: number
}

interface RecentActivity {
  id: string
  type: string
  description: string
  timestamp: string
}

interface EngagementDataPoint {
  date: string
  activeStudents: number
}

interface DashboardData {
  stats: DashboardStats
  topCourses: TopCourse[]
  recentEnrollments: RecentEnrollment[]
  recentActivities: RecentActivity[]
  engagementData: EngagementDataPoint[]
}

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
  const [chartMenuOpen, setChartMenuOpen] = useState(false)
  const [exportMenuOpen, setExportMenuOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const chartMenuRef = useRef<HTMLDivElement>(null)
  const exportMenuRef = useRef<HTMLDivElement>(null)

  // Fetch dashboard data from API
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/admin/dashboard?range=${timeRange}`)
        if (!response.ok) throw new Error('Failed to fetch dashboard')
        const data = await response.json()
        setDashboardData(data)
      } catch (error) {
        console.error('Dashboard fetch error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [timeRange])

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (chartMenuRef.current && !chartMenuRef.current.contains(e.target as Node)) {
        setChartMenuOpen(false)
      }
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) {
        setExportMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Get upcoming trainings from store (live trainings still use mock for now)
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

  // Stats from API data
  const stats = useMemo(() => [
    {
      name: 'Total Students',
      value: formatNumber(dashboardData?.stats.totalStudents || 0),
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      name: 'Active Courses',
      value: (dashboardData?.stats.publishedCourses || 0).toString(),
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: BookOpen,
      color: 'bg-violet-500',
    },
    {
      name: 'Course Completions',
      value: formatNumber(dashboardData?.stats.totalCompletions || 0),
      change: '+23.1%',
      changeType: 'positive' as const,
      icon: GraduationCap,
      color: 'bg-emerald-500',
    },
    {
      name: 'Monthly Revenue',
      value: formatCurrency(dashboardData?.stats.monthlyRevenue || 0),
      change: '+18.7%',
      changeType: 'positive' as const,
      icon: DollarSign,
      color: 'bg-amber-500',
    },
  ], [dashboardData])

  // Top courses from API data
  const topCourses = useMemo(() => {
    return (dashboardData?.topCourses || []).slice(0, 4).map(course => ({
      id: course.id,
      name: course.title,
      students: course.enrollments,
      completionRate: 0, // API doesn't return this yet
      revenue: formatCurrency(course.revenue),
      rating: course.rating,
    }))
  }, [dashboardData])

  // Recent students with enrollments from API data
  const recentStudents = useMemo(() => {
    return (dashboardData?.recentEnrollments || []).map(enrollment => ({
      id: enrollment.id,
      name: enrollment.studentName,
      email: '', // API doesn't return email
      course: enrollment.courseName,
      progress: enrollment.progress,
      status: 'active' as const,
      avatar: enrollment.studentName.charAt(0),
    }))
  }, [dashboardData])

  // Recent activities from API data
  const recentActivities = useMemo(() => {
    return (dashboardData?.recentActivities || []).map(activity => {
      const activityType = activity.type as keyof typeof activityIcons
      const Icon = activityIcons[activityType] || Activity
      return {
        id: activity.id,
        type: activity.type,
        message: activity.description,
        time: activity.timestamp,
        icon: Icon,
      }
    })
  }, [dashboardData])

  // Engagement data from API
  const engagementData = useMemo(() => {
    return (dashboardData?.engagementData || []).map(d => ({
      day: d.date,
      students: d.activeStudents,
    }))
  }, [dashboardData])

  // Export report functionality
  const exportReport = (format: 'csv' | 'json') => {
    const apiStats = dashboardData?.stats || { totalStudents: 0, activeStudents: 0, publishedCourses: 0, totalCompletions: 0, monthlyRevenue: 0, averageCompletionRate: 0 }
    const reportData = {
      generatedAt: new Date().toISOString(),
      timeRange,
      stats: {
        totalStudents: apiStats.totalStudents,
        activeStudents: apiStats.activeStudents,
        publishedCourses: apiStats.publishedCourses,
        totalCompletions: apiStats.totalCompletions,
        monthlyRevenue: apiStats.monthlyRevenue,
        completionRate: apiStats.averageCompletionRate,
      },
      topCourses: topCourses.map(c => ({
        name: c.name,
        students: c.students,
        completionRate: c.completionRate,
        revenue: c.revenue,
        rating: c.rating,
      })),
      engagementData,
    }

    let content: string
    let mimeType: string
    let filename: string

    if (format === 'csv') {
      // Generate CSV
      const statsCSV = `Metric,Value
Total Students,${apiStats.totalStudents}
Active Students,${apiStats.activeStudents}
Published Courses,${apiStats.publishedCourses}
Total Completions,${apiStats.totalCompletions}
Monthly Revenue,$${apiStats.monthlyRevenue}
Completion Rate,${apiStats.averageCompletionRate}%

Top Courses
Name,Students,Completion Rate,Revenue,Rating
${topCourses.map(c => `"${c.name}",${c.students},${c.completionRate}%,${c.revenue},${c.rating}`).join('\n')}

Daily Engagement
Day,Active Students
${engagementData.map(d => `${d.day},${d.students}`).join('\n')}`

      content = statsCSV
      mimeType = 'text/csv'
      filename = `dashboard-report-${new Date().toISOString().split('T')[0]}.csv`
    } else {
      content = JSON.stringify(reportData, null, 2)
      mimeType = 'application/json'
      filename = `dashboard-report-${new Date().toISOString().split('T')[0]}.json`
    }

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setExportMenuOpen(false)
  }

  // Export chart data
  const exportChartData = () => {
    const csvContent = `Day,Active Students\n${engagementData.map(d => `${d.day},${d.students}`).join('\n')}`
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `engagement-data-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setChartMenuOpen(false)
  }

  // Show loading skeleton
  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Loading dashboard data...</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 animate-pulse">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-gray-700" />
                <div className="w-16 h-5 rounded bg-gray-200 dark:bg-gray-700" />
              </div>
              <div className="mt-4 space-y-2">
                <div className="w-20 h-8 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="w-24 h-4 rounded bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

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
          <div ref={exportMenuRef} className="relative">
            <button
              onClick={() => setExportMenuOpen(!exportMenuOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90"
            >
              <Download className="h-4 w-4" />
              Export Report
            </button>

            {exportMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                <button
                  onClick={() => exportReport('csv')}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                >
                  <FileText className="h-4 w-4 text-green-600" />
                  Export as CSV
                </button>
                <button
                  onClick={() => exportReport('json')}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                >
                  <FileJson className="h-4 w-4 text-blue-600" />
                  Export as JSON
                </button>
              </div>
            )}
          </div>
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
            <div ref={chartMenuRef} className="relative">
              <button
                onClick={() => setChartMenuOpen(!chartMenuOpen)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <MoreVertical className="h-5 w-5 text-gray-400" />
              </button>

              {chartMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                  <button
                    onClick={exportChartData}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                  >
                    <Download className="h-4 w-4 text-gray-500" />
                    Download CSV
                  </button>
                  <Link
                    href="/admin/analytics"
                    onClick={() => setChartMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <BarChart2 className="h-4 w-4 text-primary" />
                    View Full Report
                  </Link>
                  <button
                    onClick={() => {
                      window.location.reload()
                      setChartMenuOpen(false)
                    }}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                  >
                    <RefreshCw className="h-4 w-4 text-gray-500" />
                    Refresh Data
                  </button>
                </div>
              )}
            </div>
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
                    <Star className="h-3.5 w-3.5 fill-current" />
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
