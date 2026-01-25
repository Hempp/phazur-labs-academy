'use client'

import { useState } from 'react'
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Filter,
  Search,
  ChevronDown,
  Settings,
  User,
  BookOpen,
  DollarSign,
  AlertCircle,
  MessageSquare,
  Award,
  Calendar,
  MoreHorizontal,
  Mail,
  BellOff,
  Clock
} from 'lucide-react'
import toast from 'react-hot-toast'

// Mock notification data
const notifications = [
  { id: 1, type: 'student', title: 'New Student Enrollment', message: 'John Smith enrolled in Advanced React Patterns', time: '5 min ago', read: false, icon: User },
  { id: 2, type: 'course', title: 'Course Completed', message: 'Emily Chen completed Node.js Masterclass with 95% score', time: '15 min ago', read: false, icon: Award },
  { id: 3, type: 'payment', title: 'Payment Received', message: 'Payment of $299 received from Michael Brown', time: '1 hour ago', read: false, icon: DollarSign },
  { id: 4, type: 'system', title: 'System Update', message: 'Scheduled maintenance tonight from 2-4 AM EST', time: '2 hours ago', read: true, icon: AlertCircle },
  { id: 5, type: 'comment', title: 'New Discussion Reply', message: 'Sarah Davis replied to "Best practices for React state management"', time: '3 hours ago', read: true, icon: MessageSquare },
  { id: 6, type: 'student', title: 'Student Support Request', message: 'James Wilson submitted a support ticket regarding payment issue', time: '4 hours ago', read: true, icon: User },
  { id: 7, type: 'course', title: 'Course Review', message: 'Lisa Anderson left a 5-star review on TypeScript Deep Dive', time: '5 hours ago', read: true, icon: BookOpen },
  { id: 8, type: 'payment', title: 'Refund Processed', message: 'Refund of $99 processed for David Taylor', time: '6 hours ago', read: true, icon: DollarSign },
  { id: 9, type: 'system', title: 'Storage Alert', message: 'Video storage usage at 85% capacity', time: '1 day ago', read: true, icon: AlertCircle },
  { id: 10, type: 'student', title: 'Bulk Enrollment', message: '25 students enrolled via corporate license', time: '2 days ago', read: true, icon: User }
]

const typeConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  student: { label: 'Student', color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
  course: { label: 'Course', color: 'text-green-500', bgColor: 'bg-green-500/10' },
  payment: { label: 'Payment', color: 'text-amber-500', bgColor: 'bg-amber-500/10' },
  system: { label: 'System', color: 'text-red-500', bgColor: 'bg-red-500/10' },
  comment: { label: 'Comment', color: 'text-purple-500', bgColor: 'bg-purple-500/10' }
}

const notificationSettings = [
  { id: 'email_instant', label: 'Email - Instant', description: 'Receive emails immediately', enabled: true },
  { id: 'email_digest', label: 'Email - Daily Digest', description: 'Receive daily summary at 9 AM', enabled: false },
  { id: 'push_browser', label: 'Browser Push', description: 'Push notifications in browser', enabled: true },
  { id: 'push_mobile', label: 'Mobile Push', description: 'Push notifications on mobile app', enabled: true },
  { id: 'sms_critical', label: 'SMS - Critical Only', description: 'SMS for critical alerts only', enabled: false }
]

export default function NotificationsPage() {
  const [notificationList, setNotificationList] = useState(notifications)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [readFilter, setReadFilter] = useState('all')
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [showSettings, setShowSettings] = useState(false)
  const [settings, setSettings] = useState(notificationSettings)

  const unreadCount = notificationList.filter(n => !n.read).length

  const filteredNotifications = notificationList.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          n.message.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === 'all' || n.type === typeFilter
    const matchesRead = readFilter === 'all' ||
                        (readFilter === 'unread' && !n.read) ||
                        (readFilter === 'read' && n.read)
    return matchesSearch && matchesType && matchesRead
  })

  const handleMarkAsRead = (id: number) => {
    setNotificationList(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const handleMarkAllRead = () => {
    setNotificationList(prev => prev.map(n => ({ ...n, read: true })))
    toast.success('All notifications marked as read')
  }

  const handleDelete = (id: number) => {
    setNotificationList(prev => prev.filter(n => n.id !== id))
    toast.success('Notification deleted')
  }

  const handleToggleSelect = (id: number) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectedItems.length === filteredNotifications.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredNotifications.map(n => n.id))
    }
  }

  const handleBulkMarkRead = () => {
    setNotificationList(prev =>
      prev.map(n => selectedItems.includes(n.id) ? { ...n, read: true } : n)
    )
    setSelectedItems([])
    toast.success(`${selectedItems.length} notifications marked as read`)
  }

  const handleBulkDelete = () => {
    setNotificationList(prev => prev.filter(n => !selectedItems.includes(n.id)))
    setSelectedItems([])
    toast.success(`${selectedItems.length} notifications deleted`)
  }

  const handleSettingToggle = (id: string) => {
    setSettings(prev =>
      prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s)
    )
    toast.success('Setting updated')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Bell className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
            <p className="text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
            className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors disabled:opacity-50"
          >
            <CheckCheck className="h-4 w-4" />
            Mark All Read
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              showSettings ? 'bg-primary text-primary-foreground' : 'border border-border hover:bg-accent'
            }`}
          >
            <Settings className="h-4 w-4" />
            Settings
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Notification Preferences</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {settings.map((setting) => (
              <div
                key={setting.id}
                className="flex items-center justify-between p-4 bg-accent/50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-foreground">{setting.label}</p>
                  <p className="text-sm text-muted-foreground">{setting.description}</p>
                </div>
                <button
                  onClick={() => handleSettingToggle(setting.id)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    setting.enabled ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      setting.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-border rounded-lg bg-background appearance-none cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="student">Student</option>
              <option value="course">Course</option>
              <option value="payment">Payment</option>
              <option value="system">System</option>
              <option value="comment">Comment</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={readFilter}
              onChange={(e) => setReadFilter(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg bg-background appearance-none cursor-pointer pr-8"
            >
              <option value="all">All</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <div className="flex items-center gap-3 p-4 bg-accent rounded-lg">
          <span className="text-sm font-medium text-foreground">
            {selectedItems.length} selected
          </span>
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={handleBulkMarkRead}
              className="flex items-center gap-2 px-3 py-1.5 text-sm border border-border rounded hover:bg-background"
            >
              <Check className="h-4 w-4" />
              Mark Read
            </button>
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-red-500 text-white rounded hover:bg-red-600"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Notifications List */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-4 px-6 py-3 border-b border-border bg-accent/30">
          <input
            type="checkbox"
            checked={selectedItems.length === filteredNotifications.length && filteredNotifications.length > 0}
            onChange={handleSelectAll}
            className="rounded border-border"
          />
          <span className="text-sm font-medium text-muted-foreground">
            {filteredNotifications.length} notifications
          </span>
        </div>

        {/* List */}
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <BellOff className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-foreground font-medium">No notifications found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredNotifications.map((notification) => {
              const Icon = notification.icon
              const type = typeConfig[notification.type]
              return (
                <div
                  key={notification.id}
                  className={`flex items-start gap-4 px-6 py-4 hover:bg-accent/50 transition-colors ${
                    !notification.read ? 'bg-primary/5' : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(notification.id)}
                    onChange={() => handleToggleSelect(notification.id)}
                    className="mt-1 rounded border-border"
                  />
                  <div className={`p-2 rounded-lg ${type.bgColor}`}>
                    <Icon className={`h-5 w-5 ${type.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className={`font-medium text-foreground ${!notification.read ? 'font-semibold' : ''}`}>
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <span className="w-2 h-2 bg-primary rounded-full" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">{notification.message}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded ${type.bgColor} ${type.color}`}>
                        {type.label}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {notification.time}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="p-2 hover:bg-accent rounded-lg transition-colors"
                        title="Mark as read"
                      >
                        <Check className="h-4 w-4 text-muted-foreground" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(notification.id)}
                      className="p-2 hover:bg-accent rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{unreadCount}</p>
          <p className="text-sm text-muted-foreground">Unread</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{notificationList.filter(n => n.type === 'student').length}</p>
          <p className="text-sm text-muted-foreground">Student</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{notificationList.filter(n => n.type === 'payment').length}</p>
          <p className="text-sm text-muted-foreground">Payments</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{notificationList.filter(n => n.type === 'system').length}</p>
          <p className="text-sm text-muted-foreground">System</p>
        </div>
      </div>
    </div>
  )
}
