'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Video,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  ExternalLink,
  Play,
} from 'lucide-react'

interface VideoGeneration {
  id: string
  heygen_video_id: string
  title: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  video_url?: string
  thumbnail_url?: string
  duration_seconds?: number
  error_message?: string
  created_at: string
  completed_at?: string
}

interface VideoGenerationStatusProps {
  courseId?: string
  lessonId?: string
  videoGenerationId?: string
  pollInterval?: number // in milliseconds
  onComplete?: (video: VideoGeneration) => void
  onError?: (error: string) => void
}

export default function VideoGenerationStatus({
  courseId,
  lessonId,
  videoGenerationId,
  pollInterval = 10000, // 10 seconds
  onComplete,
  onError,
}: VideoGenerationStatusProps) {
  const [videos, setVideos] = useState<VideoGeneration[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch video generation status
  const fetchStatus = useCallback(async () => {
    try {
      let url = '/api/admin/video-generations'
      const params = new URLSearchParams()

      if (videoGenerationId) {
        url = `/api/admin/video-generations/${videoGenerationId}`
      } else if (courseId) {
        params.set('courseId', courseId)
      } else if (lessonId) {
        params.set('lessonId', lessonId)
      }

      if (params.toString()) {
        url += `?${params.toString()}`
      }

      const response = await fetch(url)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch status')
      }

      const videoList = Array.isArray(data) ? data : [data]
      setVideos(videoList)

      // Check for completed videos
      videoList.forEach((v: VideoGeneration) => {
        if (v.status === 'completed' && onComplete) {
          onComplete(v)
        }
        if (v.status === 'failed' && onError && v.error_message) {
          onError(v.error_message)
        }
      })

      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch status')
    } finally {
      setLoading(false)
    }
  }, [courseId, lessonId, videoGenerationId, onComplete, onError])

  // Initial fetch
  useEffect(() => {
    fetchStatus()
  }, [fetchStatus])

  // Polling for status updates
  useEffect(() => {
    const hasProcessing = videos.some(
      (v) => v.status === 'pending' || v.status === 'processing'
    )

    if (!hasProcessing) return

    const interval = setInterval(fetchStatus, pollInterval)
    return () => clearInterval(interval)
  }, [videos, pollInterval, fetchStatus])

  // Status icon
  const StatusIcon = ({ status }: { status: VideoGeneration['status'] }) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />
      case 'processing':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <Video className="w-5 h-5 text-gray-400" />
    }
  }

  // Status badge
  const StatusBadge = ({ status }: { status: VideoGeneration['status'] }) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    }

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  // Format duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Format time ago
  const timeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    return `${Math.floor(diffHours / 24)}d ago`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <p className="text-red-600 dark:text-red-300 text-sm">{error}</p>
        <button
          onClick={fetchStatus}
          className="mt-2 text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      </div>
    )
  }

  if (videos.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500 dark:text-gray-400">
        <Video className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>No video generations found</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-4">
        {['pending', 'processing', 'completed', 'failed'].map((status) => {
          const count = videos.filter((v) => v.status === status).length
          return (
            <div
              key={status}
              className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center"
            >
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{count}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{status}</p>
            </div>
          )
        })}
      </div>

      {/* Video list */}
      <div className="space-y-3">
        {videos.map((video) => (
          <div
            key={video.id}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                {/* Thumbnail or placeholder */}
                <div className="w-24 h-14 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                  {video.thumbnail_url ? (
                    <img
                      src={video.thumbnail_url}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  ) : video.status === 'processing' ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Video className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {video.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <StatusBadge status={video.status} />
                    {video.duration_seconds && (
                      <span className="text-xs text-gray-500">
                        {formatDuration(video.duration_seconds)}
                      </span>
                    )}
                    <span className="text-xs text-gray-400">
                      {timeAgo(video.created_at)}
                    </span>
                  </div>
                  {video.error_message && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                      {video.error_message}
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {video.status === 'completed' && video.video_url && (
                  <>
                    <a
                      href={video.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
                      title="Open video"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => window.open(video.video_url, '_blank')}
                      className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                      title="Play video"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                  </>
                )}
                {(video.status === 'pending' || video.status === 'processing') && (
                  <button
                    onClick={fetchStatus}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                    title="Refresh status"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Progress bar for processing */}
            {video.status === 'processing' && (
              <div className="mt-3">
                <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 animate-pulse" style={{ width: '60%' }} />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Generating video with AI presenter...
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Auto-refresh indicator */}
      {videos.some((v) => v.status === 'pending' || v.status === 'processing') && (
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Auto-refreshing every {pollInterval / 1000}s</span>
        </div>
      )}
    </div>
  )
}
