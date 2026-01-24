'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Video,
  Calendar,
  Settings,
  Bell,
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  Clock,
  Users2,
  Filter,
  ChevronDown,
  X,
  Check,
  AlertCircle,
  MessageSquare
} from 'lucide-react'
import { ReactNode } from 'react'
import {
  liveTrainings,
  courses,
  instructors,
  type LiveTraining,
  type LiveTrainingPlatform,
  type LiveTrainingStatus
} from '@/lib/data/store'

const PlatformIcon = ({ platform, className = "h-6 w-6" }: { platform: LiveTrainingPlatform; className?: string }) => {
  switch (platform) {
    case 'zoom':
      return <Video className={className} />
    case 'google_meet':
      return <Video className={className} />
    case 'teams':
      return <MessageSquare className={className} />
    default:
      return <Video className={className} />
  }
}

const platformNames: Record<LiveTrainingPlatform, string> = {
  zoom: 'Zoom',
  google_meet: 'Google Meet',
  teams: 'Microsoft Teams'
}

const statusColors: Record<LiveTrainingStatus, string> = {
  scheduled: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  live: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 animate-pulse',
  completed: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
}

type ViewMode = 'list' | 'calendar'

interface ScheduleFormData {
  title: string
  description: string
  platform: LiveTrainingPlatform
  course_id: string
  instructor_id: string
  scheduled_start: string
  scheduled_end: string
  max_participants: string
  meeting_url: string
  meeting_id: string
  meeting_password: string
  is_recurring: boolean
  recurrence_rule: string
}

const initialFormData: ScheduleFormData = {
  title: '',
  description: '',
  platform: 'zoom',
  course_id: '',
  instructor_id: '',
  scheduled_start: '',
  scheduled_end: '',
  max_participants: '',
  meeting_url: '',
  meeting_id: '',
  meeting_password: '',
  is_recurring: false,
  recurrence_rule: ''
}

export default function LiveTrainingPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<LiveTrainingStatus | 'all'>('all')
  const [platformFilter, setPlatformFilter] = useState<LiveTrainingPlatform | 'all'>('all')
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [formData, setFormData] = useState<ScheduleFormData>(initialFormData)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  // Filter trainings
  const filteredTrainings = liveTrainings.filter(training => {
    const matchesSearch = training.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      training.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || training.status === statusFilter
    const matchesPlatform = platformFilter === 'all' || training.platform === platformFilter
    return matchesSearch && matchesStatus && matchesPlatform
  })

  // Sort by date (upcoming first)
  const sortedTrainings = [...filteredTrainings].sort((a, b) =>
    new Date(a.scheduled_start).getTime() - new Date(b.scheduled_start).getTime()
  )

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const getDuration = (start: string, end: string) => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    const diffMs = endDate.getTime() - startDate.getTime()
    const diffMins = Math.round(diffMs / 60000)
    if (diffMins < 60) return `${diffMins} min`
    const hours = Math.floor(diffMins / 60)
    const mins = diffMins % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would call an API
    console.log('Scheduling training:', formData)
    setShowScheduleModal(false)
    setFormData(initialFormData)
    setEditingId(null)
  }

  const handleEdit = (training: LiveTraining) => {
    setFormData({
      title: training.title,
      description: training.description || '',
      platform: training.platform,
      course_id: training.course_id || '',
      instructor_id: training.instructor_id,
      scheduled_start: training.scheduled_start.slice(0, 16),
      scheduled_end: training.scheduled_end.slice(0, 16),
      max_participants: training.max_participants?.toString() || '',
      meeting_url: training.meeting_url,
      meeting_id: training.meeting_id || '',
      meeting_password: training.meeting_password || '',
      is_recurring: training.is_recurring,
      recurrence_rule: training.recurrence_rule || ''
    })
    setEditingId(training.id)
    setShowScheduleModal(true)
  }

  const handleDelete = (id: string) => {
    // In a real app, this would call an API
    console.log('Deleting training:', id)
    setShowDeleteConfirm(null)
  }

  const copyMeetingLink = (url: string) => {
    navigator.clipboard.writeText(url)
    // In a real app, show a toast notification
  }

  const getInstructor = (id: string) => instructors.find(i => i.id === id)
  const getCourse = (id: string) => courses.find(c => c.id === id)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-white dark:bg-gray-800 dark:border-gray-700">
        <div className="flex h-16 items-center gap-2 border-b px-6 dark:border-gray-700">
          <Image
            src="/images/logo/phazur-logo-dark.png"
            alt="Phazur Labs"
            width={32}
            height={32}
            className="dark:invert"
          />
          <span className="font-bold text-xl">Phazur Admin</span>
        </div>
        <nav className="p-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg dark:text-gray-300 dark:hover:bg-gray-700">
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </Link>
          <Link href="/admin/courses" className="flex items-center gap-3 px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg dark:text-gray-300 dark:hover:bg-gray-700">
            <BookOpen className="h-5 w-5" />
            Courses
          </Link>
          <Link href="/admin/students" className="flex items-center gap-3 px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg dark:text-gray-300 dark:hover:bg-gray-700">
            <Users className="h-5 w-5" />
            Students
          </Link>
          <Link href="/admin/videos" className="flex items-center gap-3 px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg dark:text-gray-300 dark:hover:bg-gray-700">
            <Video className="h-5 w-5" />
            Videos
          </Link>
          <Link href="/admin/live-training" className="flex items-center gap-3 px-4 py-2.5 bg-primary/10 text-primary rounded-lg font-medium">
            <Calendar className="h-5 w-5" />
            Live Training
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg dark:text-gray-300 dark:hover:bg-gray-700">
            <Settings className="h-5 w-5" />
            Settings
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="ml-64">
        {/* Header */}
        <header className="sticky top-0 z-30 h-16 border-b bg-white dark:bg-gray-800 dark:border-gray-700">
          <div className="flex h-full items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search trainings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-80 pl-10 pr-4 py-2 border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg dark:hover:bg-gray-700">
                <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
              </button>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">AD</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Live Training</h1>
              <p className="text-gray-500 dark:text-gray-400">Schedule and manage live training sessions</p>
            </div>
            <button
              onClick={() => {
                setFormData(initialFormData)
                setEditingId(null)
                setShowScheduleModal(true)
              }}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              Schedule Training
            </button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1 dark:bg-gray-800">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium ${viewMode === 'list' ? 'bg-white shadow text-gray-900 dark:bg-gray-700 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}
              >
                List
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium ${viewMode === 'calendar' ? 'bg-white shadow text-gray-900 dark:bg-gray-700 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}
              >
                Calendar
              </button>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as LiveTrainingStatus | 'all')}
                className="px-3 py-1.5 border rounded-lg text-sm bg-white dark:bg-gray-800 dark:border-gray-700"
              >
                <option value="all">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="live">Live Now</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <select
                value={platformFilter}
                onChange={(e) => setPlatformFilter(e.target.value as LiveTrainingPlatform | 'all')}
                className="px-3 py-1.5 border rounded-lg text-sm bg-white dark:bg-gray-800 dark:border-gray-700"
              >
                <option value="all">All Platforms</option>
                <option value="zoom">Zoom</option>
                <option value="google_meet">Google Meet</option>
                <option value="teams">Microsoft Teams</option>
              </select>
            </div>

            <div className="ml-auto text-sm text-gray-500">
              {filteredTrainings.length} training{filteredTrainings.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Training List */}
          {viewMode === 'list' && (
            <div className="space-y-4">
              {sortedTrainings.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border dark:bg-gray-800 dark:border-gray-700">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No trainings found</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">Schedule your first live training session</p>
                  <button
                    onClick={() => setShowScheduleModal(true)}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                  >
                    Schedule Training
                  </button>
                </div>
              ) : (
                sortedTrainings.map((training) => {
                  const instructor = getInstructor(training.instructor_id)
                  const course = training.course_id ? getCourse(training.course_id) : null

                  return (
                    <div
                      key={training.id}
                      className="bg-white rounded-xl border p-6 dark:bg-gray-800 dark:border-gray-700 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <PlatformIcon platform={training.platform} className="h-7 w-7 text-primary" />
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-white">{training.title}</h3>
                              <p className="text-sm text-gray-500">{platformNames[training.platform]}</p>
                            </div>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[training.status]}`}>
                              {training.status === 'live' ? '● LIVE' : training.status.charAt(0).toUpperCase() + training.status.slice(1)}
                            </span>
                          </div>

                          {training.description && (
                            <p className="text-gray-600 dark:text-gray-300 mb-4">{training.description}</p>
                          )}

                          <div className="flex flex-wrap items-center gap-4 text-sm">
                            <div className="flex items-center gap-1.5 text-gray-500">
                              <Clock className="h-4 w-4" />
                              {formatDateTime(training.scheduled_start)}
                              <span className="text-gray-400">•</span>
                              {getDuration(training.scheduled_start, training.scheduled_end)}
                            </div>

                            {training.max_participants && (
                              <div className="flex items-center gap-1.5 text-gray-500">
                                <Users2 className="h-4 w-4" />
                                {training.registered_participants.length}/{training.max_participants} registered
                              </div>
                            )}

                            {instructor && (
                              <div className="flex items-center gap-1.5">
                                <div className="h-5 w-5 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                                  {instructor.full_name.charAt(0)}
                                </div>
                                <span className="text-gray-600 dark:text-gray-300">{instructor.full_name}</span>
                              </div>
                            )}

                            {course && (
                              <Link
                                href={`/admin/courses/${course.id}`}
                                className="text-primary hover:underline"
                              >
                                {course.title}
                              </Link>
                            )}

                            {training.is_recurring && (
                              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs dark:bg-purple-900/30 dark:text-purple-400">
                                Recurring
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {training.status === 'scheduled' && (
                            <a
                              href={training.meeting_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm"
                            >
                              <ExternalLink className="h-4 w-4" />
                              Join
                            </a>
                          )}

                          <button
                            onClick={() => copyMeetingLink(training.meeting_url)}
                            className="p-2 hover:bg-gray-100 rounded-lg dark:hover:bg-gray-700"
                            title="Copy meeting link"
                          >
                            <Copy className="h-4 w-4 text-gray-500" />
                          </button>

                          <div className="relative group">
                            <button className="p-2 hover:bg-gray-100 rounded-lg dark:hover:bg-gray-700">
                              <MoreVertical className="h-4 w-4 text-gray-500" />
                            </button>
                            <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all dark:bg-gray-800 dark:border-gray-700 z-10">
                              <button
                                onClick={() => handleEdit(training)}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                              >
                                <Edit className="h-4 w-4" />
                                Edit
                              </button>
                              <button
                                onClick={() => setShowDeleteConfirm(training.id)}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Delete Confirmation */}
                      {showDeleteConfirm === training.id && (
                        <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200 dark:bg-red-900/20 dark:border-red-800">
                          <div className="flex items-center gap-2 text-red-700 dark:text-red-400 mb-2">
                            <AlertCircle className="h-4 w-4" />
                            <span className="font-medium">Delete this training?</span>
                          </div>
                          <p className="text-sm text-red-600 dark:text-red-400 mb-3">
                            This action cannot be undone. {training.registered_participants.length} participants will be notified.
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDelete(training.id)}
                              className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm(null)}
                              className="px-3 py-1.5 bg-white text-gray-700 rounded-lg text-sm border hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          )}

          {/* Calendar View Placeholder */}
          {viewMode === 'calendar' && (
            <div className="bg-white rounded-xl border p-6 dark:bg-gray-800 dark:border-gray-700">
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Calendar View</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Calendar view is coming soon. Use list view for now.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto dark:bg-gray-800">
            <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {editingId ? 'Edit Training' : 'Schedule Live Training'}
              </h2>
              <button
                onClick={() => {
                  setShowScheduleModal(false)
                  setFormData(initialFormData)
                  setEditingId(null)
                }}
                className="p-2 hover:bg-gray-100 rounded-lg dark:hover:bg-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Training Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Introduction to React Hooks"
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="What will participants learn in this session?"
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              {/* Platform & Course */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Platform *
                  </label>
                  <select
                    required
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value as LiveTrainingPlatform })}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="zoom">Zoom</option>
                    <option value="google_meet">Google Meet</option>
                    <option value="teams">Microsoft Teams</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Related Course
                  </label>
                  <select
                    value={formData.course_id}
                    onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">No course (standalone)</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>{course.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Instructor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Instructor *
                </label>
                <select
                  required
                  value={formData.instructor_id}
                  onChange={(e) => setFormData({ ...formData, instructor_id: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Select instructor</option>
                  {instructors.map((instructor) => (
                    <option key={instructor.id} value={instructor.id}>{instructor.full_name}</option>
                  ))}
                </select>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Start Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.scheduled_start}
                    onChange={(e) => setFormData({ ...formData, scheduled_start: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    End Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.scheduled_end}
                    onChange={(e) => setFormData({ ...formData, scheduled_end: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>

              {/* Meeting Details */}
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg dark:bg-gray-700/50">
                <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  <PlatformIcon platform={formData.platform} className="h-5 w-5 text-primary" />
                  {platformNames[formData.platform]} Details
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Meeting URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.meeting_url}
                    onChange={(e) => setFormData({ ...formData, meeting_url: e.target.value })}
                    placeholder={formData.platform === 'zoom' ? 'https://zoom.us/j/...' : formData.platform === 'google_meet' ? 'https://meet.google.com/...' : 'https://teams.microsoft.com/l/meetup-join/...'}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Meeting ID
                    </label>
                    <input
                      type="text"
                      value={formData.meeting_id}
                      onChange={(e) => setFormData({ ...formData, meeting_id: e.target.value })}
                      placeholder="Optional"
                      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Password
                    </label>
                    <input
                      type="text"
                      value={formData.meeting_password}
                      onChange={(e) => setFormData({ ...formData, meeting_password: e.target.value })}
                      placeholder="Optional"
                      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Max Participants */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Max Participants
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.max_participants}
                  onChange={(e) => setFormData({ ...formData, max_participants: e.target.value })}
                  placeholder="Leave empty for unlimited"
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              {/* Recurring */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="recurring"
                  checked={formData.is_recurring}
                  onChange={(e) => setFormData({ ...formData, is_recurring: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <label htmlFor="recurring" className="text-sm text-gray-700 dark:text-gray-300">
                  This is a recurring training
                </label>
              </div>

              {formData.is_recurring && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Recurrence Rule
                  </label>
                  <select
                    value={formData.recurrence_rule}
                    onChange={(e) => setFormData({ ...formData, recurrence_rule: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">Select frequency</option>
                    <option value="FREQ=DAILY">Daily</option>
                    <option value="FREQ=WEEKLY">Weekly</option>
                    <option value="FREQ=BIWEEKLY">Every 2 weeks</option>
                    <option value="FREQ=MONTHLY">Monthly</option>
                  </select>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4 border-t dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => {
                    setShowScheduleModal(false)
                    setFormData(initialFormData)
                    setEditingId(null)
                  }}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center justify-center gap-2"
                >
                  <Check className="h-4 w-4" />
                  {editingId ? 'Update Training' : 'Schedule Training'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
