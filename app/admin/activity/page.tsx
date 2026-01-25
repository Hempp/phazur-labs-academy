'use client'

import { useState } from 'react'
import {
  Activity,
  Search,
  Filter,
  ChevronDown,
  Download,
  Calendar,
  User,
  BookOpen,
  DollarSign,
  Settings,
  Shield,
  LogIn,
  LogOut,
  Edit,
  Trash2,
  Plus,
  Eye,
  Mail,
  MessageSquare,
  Award,
  RefreshCw,
  Clock,
  AlertCircle
} from 'lucide-react'
import toast from 'react-hot-toast'

// Mock activity data
const activities = [
  { id: 1, type: 'login', user: 'Sarah Johnson', action: 'Logged in', details: 'From IP 192.168.1.1 (New York, US)', timestamp: '2024-01-15 14:32:18', icon: LogIn, color: 'green' },
  { id: 2, type: 'course', user: 'Admin', action: 'Created course', details: 'Advanced React Patterns - Draft saved', timestamp: '2024-01-15 14:28:45', icon: Plus, color: 'blue' },
  { id: 3, type: 'student', user: 'System', action: 'New enrollment', details: 'John Smith enrolled in TypeScript Deep Dive', timestamp: '2024-01-15 14:15:22', icon: User, color: 'purple' },
  { id: 4, type: 'payment', user: 'System', action: 'Payment received', details: '$299 from Emily Chen for Full Stack Bundle', timestamp: '2024-01-15 13:58:11', icon: DollarSign, color: 'green' },
  { id: 5, type: 'settings', user: 'Admin', action: 'Updated settings', details: 'Changed enrollment policy to "Approval Required"', timestamp: '2024-01-15 13:45:00', icon: Settings, color: 'gray' },
  { id: 6, type: 'security', user: 'System', action: 'Failed login attempt', details: 'User unknown@example.com - 3 attempts', timestamp: '2024-01-15 13:32:44', icon: Shield, color: 'red' },
  { id: 7, type: 'course', user: 'Admin', action: 'Published course', details: 'Node.js Masterclass is now live', timestamp: '2024-01-15 12:15:30', icon: BookOpen, color: 'blue' },
  { id: 8, type: 'comment', user: 'Moderator', action: 'Deleted comment', details: 'Removed spam comment from "React State Management" discussion', timestamp: '2024-01-15 11:48:22', icon: Trash2, color: 'amber' },
  { id: 9, type: 'email', user: 'System', action: 'Email sent', details: 'Weekly newsletter sent to 8,920 subscribers', timestamp: '2024-01-15 09:00:00', icon: Mail, color: 'purple' },
  { id: 10, type: 'student', user: 'System', action: 'Certificate issued', details: 'Michael Brown completed AWS Solutions Architect', timestamp: '2024-01-15 08:45:12', icon: Award, color: 'amber' },
  { id: 11, type: 'logout', user: 'Sarah Johnson', action: 'Logged out', details: 'Session ended normally', timestamp: '2024-01-14 18:30:00', icon: LogOut, color: 'gray' },
  { id: 12, type: 'course', user: 'Admin', action: 'Updated course', details: 'Added 3 new lessons to System Design Fundamentals', timestamp: '2024-01-14 16:22:15', icon: Edit, color: 'blue' }
]

const activityTypes = [
  { value: 'all', label: 'All Activities' },
  { value: 'login', label: 'Login/Logout' },
  { value: 'course', label: 'Course Activity' },
  { value: 'student', label: 'Student Activity' },
  { value: 'payment', label: 'Payments' },
  { value: 'settings', label: 'Settings Changes' },
  { value: 'security', label: 'Security Events' },
  { value: 'email', label: 'Email Activity' },
  { value: 'comment', label: 'Comments/Discussions' }
]

const colorClasses: Record<string, { bg: string; text: string; ring: string }> = {
  green: { bg: 'bg-green-500/10', text: 'text-green-500', ring: 'ring-green-500/20' },
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-500', ring: 'ring-blue-500/20' },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-500', ring: 'ring-purple-500/20' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-500', ring: 'ring-amber-500/20' },
  red: { bg: 'bg-red-500/10', text: 'text-red-500', ring: 'ring-red-500/20' },
  gray: { bg: 'bg-gray-500/10', text: 'text-gray-500', ring: 'ring-gray-500/20' }
}

const statsCards = [
  { title: 'Total Events Today', value: '1,247', icon: Activity, color: 'blue' },
  { title: 'Active Users', value: '89', icon: User, color: 'green' },
  { title: 'Security Alerts', value: '3', icon: Shield, color: 'red' },
  { title: 'System Events', value: '156', icon: RefreshCw, color: 'purple' }
]

export default function ActivityPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [userFilter, setUserFilter] = useState('')
  const [dateRange, setDateRange] = useState('7d')
  const [isLive, setIsLive] = useState(true)

  const filteredActivities = activities.filter(a => {
    const matchesSearch = a.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.user.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === 'all' || a.type === typeFilter
    const matchesUser = !userFilter || a.user.toLowerCase().includes(userFilter.toLowerCase())
    return matchesSearch && matchesType && matchesUser
  })

  const handleExport = () => {
    const csvContent = [
      ['Timestamp', 'User', 'Action', 'Details', 'Type'],
      ...activities.map(a => [a.timestamp, a.user, a.action, a.details, a.type])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `activity-log-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
    toast.success('Activity log exported')
  }

  const uniqueUsers = [...new Set(activities.map(a => a.user))]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Activity className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Activity Log</h1>
            <p className="text-muted-foreground">Track all system and user activities</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Live indicator */}
          <button
            onClick={() => setIsLive(!isLive)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
              isLive ? 'border-green-500 bg-green-500/10' : 'border-border'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            <span className={`text-sm font-medium ${isLive ? 'text-green-500' : 'text-muted-foreground'}`}>
              {isLive ? 'Live' : 'Paused'}
            </span>
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon
          const colors = colorClasses[stat.color]
          return (
            <div key={stat.title} className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${colors.bg}`}>
                  <Icon className={`h-5 w-5 ${colors.text}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 p-4 bg-card border border-border rounded-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search activities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-border rounded-lg bg-background appearance-none cursor-pointer"
            >
              {activityTypes.map((type) => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>

          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-border rounded-lg bg-background appearance-none cursor-pointer"
            >
              <option value="">All Users</option>
              {uniqueUsers.map((user) => (
                <option key={user} value={user}>{user}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>

          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="pl-10 pr-8 py-2 border border-border rounded-lg bg-background appearance-none cursor-pointer"
            >
              <option value="1d">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-card border border-border rounded-xl">
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              {filteredActivities.length} activities
            </span>
            {isLive && (
              <span className="flex items-center gap-2 text-sm text-green-500">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Updating in real-time
              </span>
            )}
          </div>
        </div>

        {filteredActivities.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-foreground font-medium">No activities found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredActivities.map((activity, index) => {
              const Icon = activity.icon
              const colors = colorClasses[activity.color]
              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-6 hover:bg-accent/50 transition-colors"
                >
                  {/* Timeline indicator */}
                  <div className="relative">
                    <div className={`p-2 rounded-lg ring-4 ${colors.bg} ${colors.ring}`}>
                      <Icon className={`h-4 w-4 ${colors.text}`} />
                    </div>
                    {index < filteredActivities.length - 1 && (
                      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-0.5 h-[calc(100%+1rem)] bg-border" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-foreground">
                          {activity.action}
                          <span className="font-normal text-muted-foreground"> by </span>
                          <span className="font-medium">{activity.user}</span>
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">{activity.details}</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground whitespace-nowrap">
                        <Clock className="h-4 w-4" />
                        {activity.timestamp}
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex items-center gap-2 mt-3">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded ${colors.bg} ${colors.text}`}>
                        {activity.type}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Load More */}
        <div className="px-6 py-4 border-t border-border text-center">
          <button className="text-sm font-medium text-primary hover:underline">
            Load more activities
          </button>
        </div>
      </div>

      {/* Activity Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* By Type */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-semibold text-foreground mb-4">Activity by Type</h3>
          <div className="space-y-3">
            {[
              { type: 'Login/Logout', count: 342, color: 'green' },
              { type: 'Course Activity', count: 156, color: 'blue' },
              { type: 'Student Activity', count: 234, color: 'purple' },
              { type: 'Payments', count: 89, color: 'amber' },
              { type: 'Security Events', count: 12, color: 'red' }
            ].map((item) => {
              const colors = colorClasses[item.color]
              const percentage = Math.round((item.count / 833) * 100)
              return (
                <div key={item.type} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground">{item.type}</span>
                    <span className="text-muted-foreground">{item.count}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${colors.bg.replace('/10', '')}`}
                      style={{ width: `${percentage}%`, backgroundColor: colors.text.replace('text-', '').includes('500') ? undefined : undefined }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-semibold text-foreground mb-4">Most Active Users</h3>
          <div className="space-y-3">
            {[
              { name: 'Admin', actions: 45 },
              { name: 'Sarah Johnson', actions: 32 },
              { name: 'System', actions: 156 },
              { name: 'Moderator', actions: 28 },
              { name: 'Support Team', actions: 21 }
            ].map((user) => (
              <div key={user.name} className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {user.name.charAt(0)}
                    </span>
                  </div>
                  <span className="font-medium text-foreground">{user.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">{user.actions} actions</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
