'use client'

import { useState } from 'react'
import {
  MessageSquare,
  Flag,
  Pin,
  Archive,
  Trash2,
  Search,
  Filter,
  ChevronDown,
  MoreHorizontal,
  Eye,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  TrendingUp,
  MessageCircle,
  ThumbsUp,
  Calendar
} from 'lucide-react'
import toast from 'react-hot-toast'

// Mock discussion data
const statsCards = [
  { title: 'Total Threads', value: '2,847', change: '+124', icon: MessageSquare, color: 'blue' },
  { title: 'Active Discussions', value: '342', change: '+18', icon: TrendingUp, color: 'green' },
  { title: 'Flagged Content', value: '12', change: '-3', icon: Flag, color: 'red' },
  { title: 'Participants Today', value: '1,234', change: '+89', icon: Users, color: 'purple' }
]

const discussions = [
  { id: 1, title: 'Best practices for React state management in 2024?', author: 'John Smith', avatar: null, course: 'Advanced React Patterns', replies: 47, views: 892, likes: 156, lastActivity: '5 min ago', status: 'active', pinned: true, hot: true },
  { id: 2, title: 'How to handle authentication in Next.js 14?', author: 'Emily Chen', avatar: null, course: 'Node.js Masterclass', replies: 32, views: 654, likes: 89, lastActivity: '15 min ago', status: 'active', pinned: false, hot: true },
  { id: 3, title: 'TypeScript generics - when to use them?', author: 'Michael Brown', avatar: null, course: 'TypeScript Deep Dive', replies: 28, views: 543, likes: 72, lastActivity: '1 hour ago', status: 'active', pinned: false, hot: false },
  { id: 4, title: 'Database design for multi-tenant SaaS', author: 'Sarah Davis', avatar: null, course: 'System Design Fundamentals', replies: 19, views: 421, likes: 45, lastActivity: '2 hours ago', status: 'active', pinned: false, hot: false },
  { id: 5, title: 'CI/CD pipeline best practices', author: 'James Wilson', avatar: null, course: 'DevOps Professional', replies: 15, views: 312, likes: 38, lastActivity: '3 hours ago', status: 'locked', pinned: false, hot: false },
  { id: 6, title: 'GraphQL vs REST - which to choose?', author: 'Lisa Anderson', avatar: null, course: 'Full Stack Bundle', replies: 56, views: 1203, likes: 198, lastActivity: '5 hours ago', status: 'archived', pinned: false, hot: false }
]

const flaggedContent = [
  { id: 1, type: 'reply', content: 'This is spam content that was flagged by multiple users...', author: 'User123', thread: 'Best practices for React state management', reports: 5, reason: 'spam', date: '10 min ago' },
  { id: 2, type: 'thread', content: 'Inappropriate title containing...', author: 'NewUser456', thread: 'N/A', reports: 3, reason: 'inappropriate', date: '1 hour ago' },
  { id: 3, type: 'reply', content: 'Self-promotion link to external site...', author: 'Marketer99', thread: 'How to handle authentication', reports: 4, reason: 'self-promotion', date: '2 hours ago' }
]

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle }> = {
  active: { label: 'Active', color: 'text-green-500 bg-green-500/10', icon: CheckCircle },
  locked: { label: 'Locked', color: 'text-amber-500 bg-amber-500/10', icon: Lock },
  archived: { label: 'Archived', color: 'text-gray-500 bg-gray-500/10', icon: Archive }
}

const colorClasses: Record<string, { bg: string; text: string }> = {
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-500' },
  green: { bg: 'bg-green-500/10', text: 'text-green-500' },
  red: { bg: 'bg-red-500/10', text: 'text-red-500' },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-500' }
}

export default function DiscussionsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [courseFilter, setCourseFilter] = useState('all')
  const [openMenu, setOpenMenu] = useState<number | null>(null)
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [discussionList, setDiscussionList] = useState(discussions)
  const [flaggedList, setFlaggedList] = useState(flaggedContent)

  const filteredDiscussions = discussionList.filter(d => {
    const matchesSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.author.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || d.status === statusFilter
    const matchesCourse = courseFilter === 'all' || d.course === courseFilter
    return matchesSearch && matchesStatus && matchesCourse
  })

  const handleToggleSelect = (id: number) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectedItems.length === filteredDiscussions.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredDiscussions.map(d => d.id))
    }
  }

  const handleBulkAction = (action: string) => {
    toast.success(`${action} applied to ${selectedItems.length} discussions`)
    setSelectedItems([])
  }

  const handlePinToggle = (id: number) => {
    setDiscussionList(prev =>
      prev.map(d => d.id === id ? { ...d, pinned: !d.pinned } : d)
    )
    toast.success('Discussion pin status updated')
  }

  const handleStatusChange = (id: number, status: string) => {
    setDiscussionList(prev =>
      prev.map(d => d.id === id ? { ...d, status } : d)
    )
    toast.success(`Discussion ${status}`)
    setOpenMenu(null)
  }

  const handleFlagAction = (id: number, action: string) => {
    setFlaggedList(prev => prev.filter(f => f.id !== id))
    toast.success(`Content ${action}`)
  }

  const courses = [...new Set(discussions.map(d => d.course))]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Discussions</h1>
          <p className="text-muted-foreground">Manage community forum threads and moderation</p>
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
                <span className={`text-sm font-medium ${
                  stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'
                }`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Discussions List */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search discussions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary w-64"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg bg-background text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="locked">Locked</option>
                <option value="archived">Archived</option>
              </select>
              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg bg-background text-sm"
              >
                <option value="all">All Courses</option>
                {courses.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedItems.length > 0 && (
            <div className="flex items-center gap-3 mb-4 p-3 bg-accent rounded-lg">
              <span className="text-sm font-medium text-foreground">
                {selectedItems.length} selected
              </span>
              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={() => handleBulkAction('Locked')}
                  className="px-3 py-1.5 text-sm border border-border rounded hover:bg-background"
                >
                  Lock
                </button>
                <button
                  onClick={() => handleBulkAction('Archived')}
                  className="px-3 py-1.5 text-sm border border-border rounded hover:bg-background"
                >
                  Archive
                </button>
                <button
                  onClick={() => handleBulkAction('Deleted')}
                  className="px-3 py-1.5 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          )}

          {/* Discussions Table */}
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center gap-4 px-4 py-2 text-sm font-medium text-muted-foreground">
              <input
                type="checkbox"
                checked={selectedItems.length === filteredDiscussions.length && filteredDiscussions.length > 0}
                onChange={handleSelectAll}
                className="rounded border-border"
              />
              <span className="flex-1">Discussion</span>
              <span className="w-20 text-center hidden sm:block">Replies</span>
              <span className="w-20 text-center hidden md:block">Views</span>
              <span className="w-24 text-center hidden lg:block">Last Active</span>
              <span className="w-8" />
            </div>

            {/* Rows */}
            {filteredDiscussions.map((discussion) => {
              const status = statusConfig[discussion.status]
              return (
                <div
                  key={discussion.id}
                  className={`flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors ${
                    discussion.pinned ? 'bg-amber-500/5 border-amber-500/20' : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(discussion.id)}
                    onChange={() => handleToggleSelect(discussion.id)}
                    className="rounded border-border"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {discussion.pinned && (
                        <Pin className="h-3 w-3 text-amber-500" />
                      )}
                      {discussion.hot && (
                        <span className="px-1.5 py-0.5 text-xs font-medium bg-red-500/10 text-red-500 rounded">
                          HOT
                        </span>
                      )}
                      <span className={`px-1.5 py-0.5 text-xs font-medium rounded ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                    <p className="font-medium text-foreground truncate">{discussion.title}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <span>{discussion.author}</span>
                      <span>•</span>
                      <span className="truncate">{discussion.course}</span>
                    </div>
                  </div>
                  <div className="w-20 text-center hidden sm:flex flex-col items-center">
                    <span className="font-medium text-foreground">{discussion.replies}</span>
                    <span className="text-xs text-muted-foreground">replies</span>
                  </div>
                  <div className="w-20 text-center hidden md:flex flex-col items-center">
                    <span className="font-medium text-foreground">{discussion.views}</span>
                    <span className="text-xs text-muted-foreground">views</span>
                  </div>
                  <div className="w-24 text-center hidden lg:block">
                    <span className="text-sm text-muted-foreground">{discussion.lastActivity}</span>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setOpenMenu(openMenu === discussion.id ? null : discussion.id)}
                      className="p-2 hover:bg-accent rounded-lg"
                    >
                      <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                    </button>
                    {openMenu === discussion.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
                        <div className="absolute right-0 top-full mt-1 w-48 bg-popover border border-border rounded-lg shadow-lg z-20 py-1">
                          <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-accent">
                            <Eye className="h-4 w-4" />
                            View Thread
                          </button>
                          <button
                            onClick={() => handlePinToggle(discussion.id)}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-accent"
                          >
                            <Pin className="h-4 w-4" />
                            {discussion.pinned ? 'Unpin' : 'Pin'} Thread
                          </button>
                          {discussion.status === 'active' ? (
                            <button
                              onClick={() => handleStatusChange(discussion.id, 'locked')}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-accent"
                            >
                              <Lock className="h-4 w-4" />
                              Lock Thread
                            </button>
                          ) : discussion.status === 'locked' ? (
                            <button
                              onClick={() => handleStatusChange(discussion.id, 'active')}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-accent"
                            >
                              <Unlock className="h-4 w-4" />
                              Unlock Thread
                            </button>
                          ) : null}
                          <button
                            onClick={() => handleStatusChange(discussion.id, 'archived')}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-accent"
                          >
                            <Archive className="h-4 w-4" />
                            Archive
                          </button>
                          <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-accent">
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Flagged Content Sidebar */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <Flag className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Flagged Content</h2>
              <p className="text-sm text-muted-foreground">Requires moderation</p>
            </div>
          </div>

          {flaggedList.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <p className="text-foreground font-medium">All clear!</p>
              <p className="text-sm text-muted-foreground">No flagged content to review</p>
            </div>
          ) : (
            <div className="space-y-4">
              {flaggedList.map((item) => (
                <div key={item.id} className="p-4 bg-red-500/5 border border-red-500/20 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                      item.reason === 'spam' ? 'bg-amber-500/10 text-amber-500' :
                      item.reason === 'inappropriate' ? 'bg-red-500/10 text-red-500' :
                      'bg-blue-500/10 text-blue-500'
                    }`}>
                      {item.reason}
                    </span>
                    <span className="text-xs text-muted-foreground">{item.date}</span>
                  </div>
                  <p className="text-sm text-foreground line-clamp-2 mb-2">{item.content}</p>
                  <p className="text-xs text-muted-foreground mb-3">
                    By {item.author} • {item.reports} reports
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleFlagAction(item.id, 'approved')}
                      className="flex-1 px-3 py-1.5 text-xs font-medium bg-green-500/10 text-green-500 rounded hover:bg-green-500/20"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleFlagAction(item.id, 'removed')}
                      className="flex-1 px-3 py-1.5 text-xs font-medium bg-red-500/10 text-red-500 rounded hover:bg-red-500/20"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
