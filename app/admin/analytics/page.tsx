'use client'

import { useState } from 'react'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  Target,
  Eye,
  ArrowUpRight,
  Download,
  Calendar,
  Filter,
  BookOpen,
  GraduationCap,
  Play,
  Award,
  ChevronDown
} from 'lucide-react'

// Mock analytics data
const statsCards = [
  {
    title: 'Total Page Views',
    value: '2.4M',
    change: '+12.5%',
    trend: 'up',
    icon: Eye,
    color: 'blue'
  },
  {
    title: 'Avg. Session Duration',
    value: '18m 32s',
    change: '+5.2%',
    trend: 'up',
    icon: Clock,
    color: 'green'
  },
  {
    title: 'Bounce Rate',
    value: '24.8%',
    change: '-3.1%',
    trend: 'down',
    icon: ArrowUpRight,
    color: 'amber'
  },
  {
    title: 'Conversion Rate',
    value: '8.4%',
    change: '+1.8%',
    trend: 'up',
    icon: Target,
    color: 'purple'
  }
]

const engagementData = [
  { day: 'Mon', students: 1240, sessions: 2890, completions: 156 },
  { day: 'Tue', students: 1380, sessions: 3120, completions: 189 },
  { day: 'Wed', students: 1520, sessions: 3540, completions: 234 },
  { day: 'Thu', students: 1410, sessions: 3280, completions: 198 },
  { day: 'Fri', students: 1680, sessions: 3890, completions: 276 },
  { day: 'Sat', students: 890, sessions: 1920, completions: 145 },
  { day: 'Sun', students: 760, sessions: 1680, completions: 112 }
]

const topCourses = [
  { name: 'Advanced React Patterns', enrolled: 2847, completion: 78, rating: 4.9, revenue: '$42,705' },
  { name: 'Node.js Masterclass', enrolled: 2156, completion: 72, rating: 4.8, revenue: '$32,340' },
  { name: 'TypeScript Deep Dive', enrolled: 1923, completion: 85, rating: 4.9, revenue: '$28,845' },
  { name: 'System Design Fundamentals', enrolled: 1654, completion: 68, rating: 4.7, revenue: '$24,810' },
  { name: 'AWS Solutions Architect', enrolled: 1432, completion: 62, rating: 4.6, revenue: '$21,480' }
]

const learningPaths = [
  { name: 'Full Stack Developer', students: 3240, avgProgress: 65, completionRate: 45 },
  { name: 'Frontend Specialist', students: 2180, avgProgress: 72, completionRate: 52 },
  { name: 'Backend Engineer', students: 1890, avgProgress: 58, completionRate: 38 },
  { name: 'DevOps Professional', students: 1240, avgProgress: 48, completionRate: 32 },
  { name: 'Data Engineering', students: 980, avgProgress: 55, completionRate: 35 }
]

const contentMetrics = [
  { type: 'Video Lessons', total: 1247, views: '856K', avgWatch: '12m 45s', completion: '68%' },
  { type: 'Quizzes', total: 423, attempts: '124K', avgScore: '82%', completion: '91%' },
  { type: 'Assignments', total: 186, submissions: '45K', avgScore: '78%', completion: '64%' },
  { type: 'Live Sessions', total: 89, attendance: '12K', avgDuration: '58m', rating: '4.8' }
]

const colorClasses: Record<string, { bg: string; text: string; iconBg: string }> = {
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-500', iconBg: 'bg-blue-500' },
  green: { bg: 'bg-green-500/10', text: 'text-green-500', iconBg: 'bg-green-500' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-500', iconBg: 'bg-amber-500' },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-500', iconBg: 'bg-purple-500' }
}

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('7d')
  const [courseFilter, setCourseFilter] = useState('all')

  const maxSessions = Math.max(...engagementData.map(d => d.sessions))

  const handleExport = () => {
    const data = {
      generatedAt: new Date().toISOString(),
      dateRange,
      stats: statsCards.map(s => ({ title: s.title, value: s.value, change: s.change })),
      topCourses,
      learningPaths,
      contentMetrics
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground">Track student engagement and course performance</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="pl-10 pr-8 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="12m">Last 12 months</option>
              <option value="custom">Custom Range</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon
          const colors = colorClasses[stat.color]
          return (
            <div key={stat.title} className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${colors.bg}`}>
                  <Icon className={`h-5 w-5 ${colors.text}`} />
                </div>
                <span className={`flex items-center gap-1 text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-500' : 'text-green-500'
                }`}>
                  {stat.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
            </div>
          )
        })}
      </div>

      {/* Engagement Chart */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Student Engagement</h2>
            <p className="text-sm text-muted-foreground">Daily active students and sessions</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-sm text-muted-foreground">Sessions</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm text-muted-foreground">Students</span>
            </div>
          </div>
        </div>

        {/* Simple Bar Chart */}
        <div className="flex items-end justify-between gap-2 h-64">
          {engagementData.map((data) => (
            <div key={data.day} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex gap-1 items-end h-48">
                <div
                  className="flex-1 bg-primary/80 rounded-t transition-all hover:bg-primary"
                  style={{ height: `${(data.sessions / maxSessions) * 100}%` }}
                  title={`${data.sessions} sessions`}
                />
                <div
                  className="flex-1 bg-green-500/80 rounded-t transition-all hover:bg-green-500"
                  style={{ height: `${(data.students / maxSessions) * 100}%` }}
                  title={`${data.students} students`}
                />
              </div>
              <span className="text-sm text-muted-foreground">{data.day}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Courses */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <BookOpen className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Top Performing Courses</h2>
                <p className="text-sm text-muted-foreground">By completion rate</p>
              </div>
            </div>
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="px-3 py-1.5 text-sm border border-border rounded-lg bg-background"
            >
              <option value="all">All Time</option>
              <option value="month">This Month</option>
              <option value="week">This Week</option>
            </select>
          </div>

          <div className="space-y-4">
            {topCourses.map((course, index) => (
              <div key={course.name} className="flex items-center gap-4">
                <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-muted-foreground bg-muted rounded">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{course.name}</p>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>{course.enrolled.toLocaleString()} enrolled</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Award className="h-3 w-3" />
                      {course.rating}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">{course.completion}%</p>
                  <p className="text-sm text-muted-foreground">completion</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Learning Paths */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <GraduationCap className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Learning Path Analytics</h2>
              <p className="text-sm text-muted-foreground">Student progress by path</p>
            </div>
          </div>

          <div className="space-y-4">
            {learningPaths.map((path) => (
              <div key={path.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-foreground">{path.name}</p>
                  <span className="text-sm text-muted-foreground">{path.students.toLocaleString()} students</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full"
                      style={{ width: `${path.avgProgress}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-foreground w-12">{path.avgProgress}%</span>
                </div>
                <p className="text-xs text-muted-foreground">{path.completionRate}% completion rate</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Metrics Table */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-500/10 rounded-lg">
            <Play className="h-5 w-5 text-green-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Content Performance</h2>
            <p className="text-sm text-muted-foreground">Breakdown by content type</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Content Type</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Total Items</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Engagement</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Avg. Metric</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Completion</th>
              </tr>
            </thead>
            <tbody>
              {contentMetrics.map((content) => (
                <tr key={content.type} className="border-b border-border last:border-0 hover:bg-accent/50">
                  <td className="py-4 px-4">
                    <span className="font-medium text-foreground">{content.type}</span>
                  </td>
                  <td className="py-4 px-4 text-foreground">{content.total.toLocaleString()}</td>
                  <td className="py-4 px-4 text-foreground">{content.views || content.attempts || content.submissions || content.attendance}</td>
                  <td className="py-4 px-4 text-foreground">{content.avgWatch || content.avgScore || content.avgDuration || content.rating}</td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-1 text-sm font-medium bg-green-500/10 text-green-500 rounded">
                      {content.completion || content.rating}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Peak Activity Time</h3>
          <p className="text-3xl font-bold">2-4 PM</p>
          <p className="text-blue-100 mt-2">Most students are active during afternoon hours</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Most Popular Device</h3>
          <p className="text-3xl font-bold">Desktop</p>
          <p className="text-green-100 mt-2">68% of sessions are from desktop browsers</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Top Traffic Source</h3>
          <p className="text-3xl font-bold">Organic</p>
          <p className="text-purple-100 mt-2">45% of new visitors come from search engines</p>
        </div>
      </div>
    </div>
  )
}
