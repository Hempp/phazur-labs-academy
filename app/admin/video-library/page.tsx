'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  Video,
  Upload,
  Search,
  Filter,
  MoreVertical,
  Play,
  Clock,
  FileVideo,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Link2,
  ChevronDown,
  FolderOpen,
  HardDrive,
  Sparkles,
  Download as DownloadIcon,
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
  resolution: string | null
  workflowStatus: 'draft' | 'review' | 'approved' | 'published'
  sourceType: 'upload' | 'ai_generated' | 'external' | 'imported'
  visibility: 'private' | 'internal' | 'public'
  courseId: string | null
  moduleId: string | null
  lessonId: string | null
  thumbnailUrl: string | null
  tags: string[]
  uploadedBy: string
  createdAt: string
  updatedAt: string
  course?: { id: string; title: string; slug: string } | null
  lesson?: { id: string; title: string } | null
}

const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  draft: { label: 'Draft', color: 'text-gray-600', bgColor: 'bg-gray-100 dark:bg-gray-800' },
  review: { label: 'In Review', color: 'text-amber-600', bgColor: 'bg-amber-100 dark:bg-amber-900/30' },
  approved: { label: 'Approved', color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
  published: { label: 'Published', color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900/30' },
}

const sourceTypeConfig: Record<string, { label: string; icon: React.ReactNode }> = {
  upload: { label: 'Uploaded', icon: <Upload className="h-3 w-3" /> },
  ai_generated: { label: 'AI Generated', icon: <Sparkles className="h-3 w-3" /> },
  external: { label: 'External', icon: <Link2 className="h-3 w-3" /> },
  imported: { label: 'Imported', icon: <DownloadIcon className="h-3 w-3" /> },
}

export default function VideoLibraryPage() {
  const [videos, setVideos] = useState<VideoLibraryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [limit] = useState(20)

  // Filters
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [sourceFilter, setSourceFilter] = useState<string>('')
  const [showFilters, setShowFilters] = useState(false)

  // Action menu
  const [activeMenu, setActiveMenu] = useState<string | null>(null)

  const fetchVideos = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: (page * limit).toString(),
        sortBy: 'created_at',
        sortOrder: 'desc',
      })

      if (search) params.set('search', search)
      if (statusFilter) params.set('workflowStatus', statusFilter)
      if (sourceFilter) params.set('sourceType', sourceFilter)

      const response = await fetch(`/api/admin/video-library?${params}`)
      if (response.ok) {
        const data = await response.json()
        setVideos(data.videos || [])
        setTotal(data.total || 0)
      } else {
        toast.error('Failed to load videos')
      }
    } catch (error) {
      console.error('Failed to fetch videos:', error)
      toast.error('Failed to load videos')
    } finally {
      setLoading(false)
    }
  }, [page, limit, search, statusFilter, sourceFilter])

  useEffect(() => {
    fetchVideos()
  }, [fetchVideos])

  const handleStatusChange = async (videoId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/video-library/${videoId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        toast.success(`Status updated to ${statusConfig[newStatus]?.label}`)
        fetchVideos()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to update status')
      }
    } catch (error) {
      toast.error('Failed to update status')
    }
    setActiveMenu(null)
  }

  const handleDelete = async (videoId: string) => {
    if (!confirm('Are you sure you want to delete this video? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/video-library/${videoId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Video deleted')
        fetchVideos()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to delete video')
      }
    } catch (error) {
      toast.error('Failed to delete video')
    }
    setActiveMenu(null)
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
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  // Stats
  const stats = {
    total: total,
    published: videos.filter(v => v.workflowStatus === 'published').length,
    review: videos.filter(v => v.workflowStatus === 'review').length,
    draft: videos.filter(v => v.workflowStatus === 'draft').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Video Library</h1>
          <p className="text-muted-foreground">Central catalog for all course videos</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchVideos}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          <Link
            href="/admin/video-library/upload"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Upload className="h-4 w-4" />
            Upload Video
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Video className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total Videos</p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.published}</p>
              <p className="text-sm text-muted-foreground">Published</p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.review}</p>
              <p className="text-sm text-muted-foreground">In Review</p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <FileVideo className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.draft}</p>
              <p className="text-sm text-muted-foreground">Drafts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search videos..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none px-4 py-2 pr-10 border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="review">In Review</option>
              <option value="approved">Approved</option>
              <option value="published">Published</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="appearance-none px-4 py-2 pr-10 border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent cursor-pointer"
            >
              <option value="">All Sources</option>
              <option value="upload">Uploaded</option>
              <option value="ai_generated">AI Generated</option>
              <option value="external">External</option>
              <option value="imported">Imported</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Video List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No videos found</h3>
          <p className="text-muted-foreground mb-4">
            {search || statusFilter || sourceFilter
              ? 'Try adjusting your filters'
              : 'Upload your first video to get started'}
          </p>
          <Link
            href="/admin/video-library/upload"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Upload className="h-4 w-4" />
            Upload Video
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left p-4 font-medium text-muted-foreground">Video</th>
                  <th className="text-left p-4 font-medium text-muted-foreground hidden md:table-cell">Source</th>
                  <th className="text-left p-4 font-medium text-muted-foreground hidden lg:table-cell">Size</th>
                  <th className="text-left p-4 font-medium text-muted-foreground hidden lg:table-cell">Duration</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 font-medium text-muted-foreground hidden md:table-cell">Course</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {videos.map((video) => (
                  <tr
                    key={video.id}
                    className="border-b border-gray-200 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                          {video.thumbnailUrl ? (
                            <img
                              src={video.thumbnailUrl}
                              alt={video.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Play className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium truncate">{video.title}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {video.originalFilename}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        {sourceTypeConfig[video.sourceType]?.icon}
                        {sourceTypeConfig[video.sourceType]?.label}
                      </span>
                    </td>
                    <td className="p-4 hidden lg:table-cell text-sm text-muted-foreground">
                      {formatFileSize(video.fileSizeBytes)}
                    </td>
                    <td className="p-4 hidden lg:table-cell text-sm text-muted-foreground">
                      {formatDuration(video.durationSeconds)}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusConfig[video.workflowStatus]?.bgColor} ${statusConfig[video.workflowStatus]?.color}`}
                      >
                        {statusConfig[video.workflowStatus]?.label}
                      </span>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      {video.course ? (
                        <span className="text-sm text-muted-foreground truncate max-w-[150px] block">
                          {video.course.title}
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">Unassigned</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="relative">
                        <button
                          onClick={() => setActiveMenu(activeMenu === video.id ? null : video.id)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        {activeMenu === video.id && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                            <div className="p-1">
                              <Link
                                href={`/admin/video-library/${video.id}`}
                                className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                              >
                                <Eye className="h-4 w-4" />
                                View Details
                              </Link>
                              <Link
                                href={`/admin/video-library/${video.id}?edit=true`}
                                className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                              >
                                <Edit className="h-4 w-4" />
                                Edit
                              </Link>
                              <hr className="my-1 border-gray-200 dark:border-gray-700" />
                              <div className="px-3 py-1 text-xs font-medium text-muted-foreground">
                                Change Status
                              </div>
                              {video.workflowStatus !== 'draft' && (
                                <button
                                  onClick={() => handleStatusChange(video.id, 'draft')}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                                >
                                  Move to Draft
                                </button>
                              )}
                              {video.workflowStatus === 'draft' && (
                                <button
                                  onClick={() => handleStatusChange(video.id, 'review')}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                                >
                                  Submit for Review
                                </button>
                              )}
                              {video.workflowStatus === 'review' && (
                                <button
                                  onClick={() => handleStatusChange(video.id, 'approved')}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                                >
                                  Approve
                                </button>
                              )}
                              {video.workflowStatus === 'approved' && (
                                <button
                                  onClick={() => handleStatusChange(video.id, 'published')}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                                >
                                  Publish
                                </button>
                              )}
                              <hr className="my-1 border-gray-200 dark:border-gray-700" />
                              <button
                                onClick={() => handleDelete(video.id)}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {total > limit && (
            <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-muted-foreground">
                Showing {page * limit + 1} - {Math.min((page + 1) * limit, total)} of {total}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="px-3 py-1 text-sm border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={(page + 1) * limit >= total}
                  className="px-3 py-1 text-sm border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Click outside to close menu */}
      {activeMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setActiveMenu(null)}
        />
      )}
    </div>
  )
}
