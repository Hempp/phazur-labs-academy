'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  ArrowLeft,
  Video,
  Edit,
  Save,
  X,
  Clock,
  FileVideo,
  Tag,
  Link2,
  ChevronDown,
  Loader2,
  Play,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Calendar,
  User,
  HardDrive,
  Monitor,
  BookOpen,
} from 'lucide-react'
import toast from 'react-hot-toast'

interface VideoLibraryItem {
  id: string
  title: string
  description: string | null
  slug: string | null
  originalFilename: string
  fileSizeBytes: number
  mimeType: string
  durationSeconds: number | null
  width: number | null
  height: number | null
  resolution: string | null
  workflowStatus: 'draft' | 'review' | 'approved' | 'published'
  sourceType: 'upload' | 'ai_generated' | 'external' | 'imported'
  visibility: 'private' | 'internal' | 'public'
  courseId: string | null
  moduleId: string | null
  lessonId: string | null
  thumbnailUrl: string | null
  cdnUrl: string | null
  tags: string[]
  uploadedBy: string
  createdAt: string
  updatedAt: string
  course?: { id: string; title: string; slug: string } | null
  module?: { id: string; title: string } | null
  lesson?: { id: string; title: string } | null
  uploader?: { id: string; full_name: string; email: string } | null
}

interface Lesson {
  id: string
  title: string
  module_id: string
}

interface Course {
  id: string
  title: string
}

const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  draft: { label: 'Draft', color: 'text-gray-600', bgColor: 'bg-gray-100 dark:bg-gray-800' },
  review: { label: 'In Review', color: 'text-amber-600', bgColor: 'bg-amber-100 dark:bg-amber-900/30' },
  approved: { label: 'Approved', color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
  published: { label: 'Published', color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900/30' },
}

const visibilityConfig: Record<string, { label: string; description: string }> = {
  private: { label: 'Private', description: 'Only enrolled students' },
  internal: { label: 'Internal', description: 'All authenticated users' },
  public: { label: 'Public', description: 'Anyone' },
}

export default function VideoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const searchParams = useSearchParams()
  const isEditMode = searchParams.get('edit') === 'true'

  const [video, setVideo] = useState<VideoLibraryItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(isEditMode)

  // Edit form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: [] as string[],
    visibility: 'private' as 'private' | 'internal' | 'public',
  })
  const [tagInput, setTagInput] = useState('')

  // Assignment state
  const [courses, setCourses] = useState<Course[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [assignCourseId, setAssignCourseId] = useState('')
  const [assignLessonId, setAssignLessonId] = useState('')
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [loadingLessons, setLoadingLessons] = useState(false)

  // Fetch video details
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await fetch(`/api/admin/video-library/${id}`)
        if (response.ok) {
          const data = await response.json()
          setVideo(data)
          setFormData({
            title: data.title,
            description: data.description || '',
            tags: data.tags || [],
            visibility: data.visibility,
          })
        } else if (response.status === 404) {
          toast.error('Video not found')
          router.push('/admin/video-library')
        } else {
          toast.error('Failed to load video')
        }
      } catch (error) {
        console.error('Failed to fetch video:', error)
        toast.error('Failed to load video')
      } finally {
        setLoading(false)
      }
    }
    fetchVideo()
  }, [id, router])

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/admin/courses')
        if (response.ok) {
          const data = await response.json()
          setCourses(data.courses || [])
        }
      } catch (error) {
        console.error('Failed to fetch courses:', error)
      }
    }
    fetchCourses()
  }, [])

  // Fetch lessons when course changes
  useEffect(() => {
    if (!assignCourseId) {
      setLessons([])
      return
    }

    const fetchLessons = async () => {
      setLoadingLessons(true)
      try {
        const response = await fetch(`/api/admin/courses/${assignCourseId}/lessons`)
        if (response.ok) {
          const data = await response.json()
          setLessons(data.lessons || [])
        }
      } catch (error) {
        console.error('Failed to fetch lessons:', error)
      } finally {
        setLoadingLessons(false)
      }
    }
    fetchLessons()
  }, [assignCourseId])

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch(`/api/admin/video-library/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const updatedVideo = await response.json()
        setVideo(updatedVideo)
        setEditing(false)
        toast.success('Video updated successfully')
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to update video')
      }
    } catch (error) {
      toast.error('Failed to update video')
    } finally {
      setSaving(false)
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/video-library/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        const updatedVideo = await response.json()
        setVideo(updatedVideo)
        toast.success(`Status updated to ${statusConfig[newStatus]?.label}`)
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to update status')
      }
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  const handleAssign = async () => {
    if (!assignLessonId) {
      toast.error('Please select a lesson')
      return
    }

    try {
      const response = await fetch(`/api/admin/video-library/${id}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId: assignLessonId }),
      })

      if (response.ok) {
        const updatedVideo = await response.json()
        setVideo(updatedVideo)
        setShowAssignModal(false)
        toast.success('Video assigned to lesson')
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to assign video')
      }
    } catch (error) {
      toast.error('Failed to assign video')
    }
  }

  const handleUnassign = async () => {
    if (!confirm('Remove this video from the lesson?')) return

    try {
      const response = await fetch(`/api/admin/video-library/${id}/assign`, {
        method: 'DELETE',
      })

      if (response.ok) {
        const updatedVideo = await response.json()
        setVideo(updatedVideo)
        toast.success('Video unassigned from lesson')
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to unassign video')
      }
    } catch (error) {
      toast.error('Failed to unassign video')
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this video? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/video-library/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Video deleted')
        router.push('/admin/video-library')
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to delete video')
      }
    } catch (error) {
      toast.error('Failed to delete video')
    }
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '--:--'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!video) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/video-library"
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold truncate">{video.title}</h1>
          <p className="text-muted-foreground truncate">{video.originalFilename}</p>
        </div>
        <div className="flex gap-2">
          {editing ? (
            <>
              <button
                onClick={() => {
                  setEditing(false)
                  setFormData({
                    title: video.title,
                    description: video.description || '',
                    tags: video.tags || [],
                    visibility: video.visibility,
                  })
                }}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <Edit className="h-4 w-4" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 border border-red-200 dark:border-red-900 text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Video Preview & Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Preview */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="aspect-video bg-gray-900 flex items-center justify-center">
              {video.thumbnailUrl ? (
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center">
                  <Play className="h-16 w-16 text-gray-500 mx-auto mb-2" />
                  <p className="text-gray-500">No preview available</p>
                </div>
              )}
            </div>
            {video.cdnUrl && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <a
                  href={video.cdnUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open Video URL
                </a>
              </div>
            )}
          </div>

          {/* Title & Description */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="font-semibold mb-4">Details</h2>
            {editing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, description: e.target.value }))
                    }
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Visibility</label>
                  <select
                    value={formData.visibility}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        visibility: e.target.value as 'private' | 'internal' | 'public',
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent"
                  >
                    {Object.entries(visibilityConfig).map(([key, config]) => (
                      <option key={key} value={key}>
                        {config.label} - {config.description}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tags</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      placeholder="Add a tag"
                      className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent"
                    />
                    <button
                      onClick={handleAddTag}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
                    >
                      Add
                    </button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-2 py-1 text-sm bg-primary/10 text-primary rounded"
                        >
                          {tag}
                          <button onClick={() => handleRemoveTag(tag)}>
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Title</p>
                  <p className="font-medium">{video.title}</p>
                </div>
                {video.description && (
                  <div>
                    <p className="text-sm text-muted-foreground">Description</p>
                    <p>{video.description}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Visibility</p>
                  <p className="font-medium">{visibilityConfig[video.visibility]?.label}</p>
                </div>
                {video.tags && video.tags.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {video.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-2 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded"
                        >
                          <Tag className="h-3 w-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Status & Info */}
        <div className="space-y-6">
          {/* Workflow Status */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="font-semibold mb-4">Workflow Status</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1.5 rounded-full text-sm font-medium ${statusConfig[video.workflowStatus]?.bgColor} ${statusConfig[video.workflowStatus]?.color}`}
                >
                  {statusConfig[video.workflowStatus]?.label}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {video.workflowStatus === 'draft' && (
                  <button
                    onClick={() => handleStatusChange('review')}
                    className="w-full px-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Submit for Review
                  </button>
                )}
                {video.workflowStatus === 'review' && (
                  <>
                    <button
                      onClick={() => handleStatusChange('approved')}
                      className="w-full px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusChange('draft')}
                      className="w-full px-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Return to Draft
                    </button>
                  </>
                )}
                {video.workflowStatus === 'approved' && (
                  <>
                    <button
                      onClick={() => handleStatusChange('published')}
                      className="w-full px-4 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      Publish
                    </button>
                    <button
                      onClick={() => handleStatusChange('review')}
                      className="w-full px-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Return to Review
                    </button>
                  </>
                )}
                {video.workflowStatus === 'published' && (
                  <button
                    onClick={() => handleStatusChange('draft')}
                    className="w-full px-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Unpublish (Return to Draft)
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Course Assignment */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Course Assignment
            </h2>
            {video.lesson ? (
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Course</p>
                  <p className="font-medium">{video.course?.title || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Lesson</p>
                  <p className="font-medium">{video.lesson.title}</p>
                </div>
                <button
                  onClick={handleUnassign}
                  className="w-full px-4 py-2 text-sm text-red-600 border border-red-200 dark:border-red-900 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  Remove from Lesson
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">Not assigned to any lesson</p>
                <button
                  onClick={() => setShowAssignModal(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                >
                  <Link2 className="h-4 w-4" />
                  Assign to Lesson
                </button>
              </div>
            )}
          </div>

          {/* File Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="font-semibold mb-4">File Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <FileVideo className="h-4 w-4" />
                  Filename
                </span>
                <span className="font-medium truncate max-w-[150px]">{video.originalFilename}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <HardDrive className="h-4 w-4" />
                  Size
                </span>
                <span className="font-medium">{formatFileSize(video.fileSizeBytes)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Duration
                </span>
                <span className="font-medium">{formatDuration(video.durationSeconds)}</span>
              </div>
              {video.resolution && (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Monitor className="h-4 w-4" />
                    Resolution
                  </span>
                  <span className="font-medium">{video.resolution}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Type</span>
                <span className="font-medium">{video.mimeType}</span>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="font-semibold mb-4">Metadata</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <User className="h-4 w-4" />
                  Uploaded by
                </span>
                <span className="font-medium">
                  {video.uploader?.full_name || video.uploader?.email || 'Unknown'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Created
                </span>
                <span className="font-medium">{formatDate(video.createdAt)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Updated</span>
                <span className="font-medium">{formatDate(video.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assign Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Link2 className="h-5 w-5 text-primary" />
                Assign to Lesson
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Course</label>
                <div className="relative">
                  <select
                    value={assignCourseId}
                    onChange={(e) => {
                      setAssignCourseId(e.target.value)
                      setAssignLessonId('')
                    }}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent appearance-none pr-10"
                  >
                    <option value="">Select a course</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Lesson</label>
                <div className="relative">
                  <select
                    value={assignLessonId}
                    onChange={(e) => setAssignLessonId(e.target.value)}
                    disabled={!assignCourseId || loadingLessons}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent appearance-none pr-10 disabled:opacity-50"
                  >
                    <option value="">
                      {loadingLessons ? 'Loading...' : 'Select a lesson'}
                    </option>
                    {lessons.map((lesson) => (
                      <option key={lesson.id} value={lesson.id}>
                        {lesson.title}
                      </option>
                    ))}
                  </select>
                  {loadingLessons ? (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
                  ) : (
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  )}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3 justify-end">
              <button
                onClick={() => setShowAssignModal(false)}
                className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleAssign}
                disabled={!assignLessonId}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
