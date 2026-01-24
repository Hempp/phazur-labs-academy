'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Video,
  Play,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Upload,
  Link2,
  RefreshCw,
  Eye,
  Download,
  BookOpen,
  User,
  Palette,
  Mic,
  FileText,
  Wand2,
  Zap,
  FlaskConical,
  ArrowUpCircle,
  Volume2
} from 'lucide-react'
import { defaultAcademyAvatars, scriptTemplates } from '@/lib/services/heygen'
import { draftAvatars } from '@/lib/services/draft-video-config'
import { edgeVoices } from '@/lib/services/edge-tts-config'
import type { TalkingHeadAvatar, TalkingHeadBackend, BackendStatus } from '@/lib/services/talking-head/types'

interface VideoGeneration {
  id: string
  heygen_video_id: string
  title: string
  script: string
  avatar_id: string
  voice_id: string
  lesson_id: string | null
  status: 'pending' | 'processing' | 'completed' | 'failed'
  video_url: string | null
  thumbnail_url: string | null
  duration_seconds: number | null
  error_message: string | null
  created_at: string
  completed_at: string | null
  lesson?: {
    id: string
    title: string
    course?: {
      id: string
      title: string
    }
  }
}

interface Lesson {
  id: string
  title: string
  module_id: string
  course_id: string
  video_url: string | null
  course?: {
    id: string
    title: string
  }
}

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<VideoGeneration[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<VideoGeneration | null>(null)
  const [activeTab, setActiveTab] = useState<'all' | 'processing' | 'completed' | 'drafts'>('all')

  // Generation mode: 'draft' (audio only), 'animated' (free lip-sync), or 'production' (HeyGen)
  const [generationMode, setGenerationMode] = useState<'draft' | 'animated' | 'production'>('draft')

  // Talking head state
  const [talkingHeadStatus, setTalkingHeadStatus] = useState<{
    available: boolean
    bestBackend: TalkingHeadBackend | null
    backends: Record<TalkingHeadBackend, BackendStatus>
    avatars: TalkingHeadAvatar[]
  } | null>(null)
  const [talkingHeadLoading, setTalkingHeadLoading] = useState(false)

  // Generation form state
  const [formData, setFormData] = useState<{
    title: string
    script: string
    avatarId: string
    voiceId: string
    backgroundColor: string
    aspectRatio: '16:9' | '9:16' | '1:1'
    lessonId: string
    testMode: boolean
  }>({
    title: '',
    script: '',
    avatarId: draftAvatars[0].voiceId, // Default to draft voice
    voiceId: draftAvatars[0].voiceId,
    backgroundColor: '#1e3a5f',
    aspectRatio: '16:9',
    lessonId: '',
    testMode: process.env.NODE_ENV !== 'production',
  })

  // Fetch videos
  const fetchVideos = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/videos')
      if (response.ok) {
        const data = await response.json()
        setVideos(data.videos || [])
      }
    } catch (error) {
      console.error('Failed to fetch videos:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch lessons without videos
  const fetchLessons = async () => {
    try {
      const response = await fetch('/api/lessons?without_video=true')
      if (response.ok) {
        const data = await response.json()
        setLessons(data.lessons || [])
      }
    } catch (error) {
      console.error('Failed to fetch lessons:', error)
    }
  }

  // Check status of processing videos
  const checkProcessingVideos = useCallback(async () => {
    const processingVideos = videos.filter(v => v.status === 'processing')

    for (const video of processingVideos) {
      try {
        const response = await fetch(`/api/admin/videos/${video.heygen_video_id}`)
        if (response.ok) {
          const data = await response.json()
          if (data.status === 'completed' || data.status === 'failed') {
            fetchVideos() // Refresh list when status changes
            break
          }
        }
      } catch (error) {
        console.error('Failed to check video status:', error)
      }
    }
  }, [videos, fetchVideos])

  // Check talking head availability
  const checkTalkingHeadStatus = async () => {
    setTalkingHeadLoading(true)
    try {
      const response = await fetch('/api/admin/videos/talking-head/status')
      if (response.ok) {
        const data = await response.json()
        setTalkingHeadStatus(data)
      }
    } catch (error) {
      console.error('Failed to check talking head status:', error)
    } finally {
      setTalkingHeadLoading(false)
    }
  }

  useEffect(() => {
    fetchVideos()
    fetchLessons()
    checkTalkingHeadStatus()
  }, [fetchVideos])

  // Poll for processing videos
  useEffect(() => {
    const hasProcessing = videos.some(v => v.status === 'processing')
    if (!hasProcessing) return

    const interval = setInterval(checkProcessingVideos, 10000) // Check every 10 seconds
    return () => clearInterval(interval)
  }, [videos, checkProcessingVideos])

  // Generate video (draft, animated, or production)
  const handleGenerate = async (mode: 'draft' | 'animated' | 'production' = generationMode) => {
    if (!formData.title || !formData.script) {
      alert('Please provide a title and script')
      return
    }

    setGenerating(true)
    try {
      // Different endpoints for each mode
      let endpoint: string
      let body: Record<string, unknown>

      if (mode === 'draft') {
        endpoint = '/api/admin/videos/draft'
        body = {
          ...formData,
          voiceId: formData.voiceId,
        }
      } else if (mode === 'animated') {
        endpoint = '/api/admin/videos/talking-head/generate'
        body = {
          script: formData.script,
          avatarId: formData.avatarId,
          voiceId: formData.voiceId,
          backend: talkingHeadStatus?.bestBackend || 'sadtalker',
          options: {
            expressionScale: 1.0,
            stillMode: false,
          },
        }
      } else {
        endpoint = '/api/admin/videos'
        body = formData
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate video')
      }

      // Refresh videos list
      await fetchVideos()
      setShowGenerateModal(false)
      resetForm()

      if (mode === 'draft') {
        alert(`Draft generated! ${data.draft?.message || 'Audio preview ready.'}`)
      } else if (mode === 'animated') {
        alert(`Animated video generated! Processing took ${Math.round((data.video?.processingTimeMs || 0) / 1000)}s using ${data.video?.backend}.`)
      } else {
        alert('Video generation started! It will appear in the list once processing begins.')
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to generate video')
    } finally {
      setGenerating(false)
    }
  }

  // Assign video to lesson
  const handleAssign = async (lessonId: string) => {
    if (!selectedVideo) return

    try {
      const response = await fetch(`/api/admin/videos/${selectedVideo.heygen_video_id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId, uploadToStorage: true }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to assign video')
      }

      await fetchVideos()
      await fetchLessons()
      setShowAssignModal(false)
      setSelectedVideo(null)

      alert('Video assigned to lesson successfully!')
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to assign video')
    }
  }

  const resetForm = () => {
    // Use different defaults based on generation mode
    let avatarId: string
    let voiceId: string

    if (generationMode === 'draft') {
      avatarId = draftAvatars[0].voiceId
      voiceId = draftAvatars[0].voiceId
    } else if (generationMode === 'animated') {
      const talkingAvatar = talkingHeadStatus?.avatars?.[0]
      avatarId = talkingAvatar?.id || 'professional-female-1'
      voiceId = talkingAvatar?.recommendedVoice || 'en-US-AriaNeural'
    } else {
      const defaultAvatar = defaultAcademyAvatars[0]
      avatarId = defaultAvatar.id
      voiceId = defaultAvatar.voiceId
    }

    setFormData({
      title: '',
      script: '',
      avatarId,
      voiceId,
      backgroundColor: '#1e3a5f',
      aspectRatio: '16:9',
      lessonId: '',
      testMode: process.env.NODE_ENV !== 'production',
    })
  }

  // Check if a video is a draft based on title or metadata
  const isDraftVideo = (video: VideoGeneration) => {
    return video.title.startsWith('[DRAFT]') || video.heygen_video_id.startsWith('draft-')
  }

  const applyScriptTemplate = (type: keyof typeof scriptTemplates) => {
    const templates: Record<string, string> = {
      introduction: scriptTemplates.introduction('Your Course Name', 'Your Instructor'),
      conceptExplanation: scriptTemplates.conceptExplanation('Your Concept', ['Point 1', 'Point 2', 'Point 3']),
      practicalDemo: scriptTemplates.practicalDemo('Your Demo Topic'),
      sectionSummary: scriptTemplates.sectionSummary('Your Section', 'Your next steps description'),
      courseConculsion: scriptTemplates.courseConculsion('Your Course Name'),
    }
    setFormData(prev => ({ ...prev, script: templates[type] || '' }))
  }

  const filteredVideos = videos.filter(v => {
    if (activeTab === 'all') return true
    if (activeTab === 'drafts') return isDraftVideo(v)
    if (activeTab === 'processing') return v.status === 'processing' || v.status === 'pending'
    if (activeTab === 'completed') return v.status === 'completed' && !isDraftVideo(v)
    return true
  })

  // Count stats
  const draftCount = videos.filter(isDraftVideo).length
  const productionCount = videos.filter(v => !isDraftVideo(v)).length

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case 'processing': return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />
      case 'failed': return <AlertCircle className="h-4 w-4 text-red-500" />
      default: return null
    }
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      processing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      failed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    }
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${styles[status] || ''}`}>
        {getStatusIcon(status)}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '--:--'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Video Studio</h1>
          <p className="text-muted-foreground">Generate and manage AI-powered course videos</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchVideos}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          <button
            onClick={() => setShowGenerateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Sparkles className="h-4 w-4" />
            Generate Video
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Video className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{videos.length}</p>
              <p className="text-sm text-muted-foreground">Total Videos</p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <FlaskConical className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{draftCount}</p>
              <p className="text-sm text-muted-foreground">Drafts</p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{videos.filter(v => v.status === 'completed' && !isDraftVideo(v)).length}</p>
              <p className="text-sm text-muted-foreground">Production</p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Loader2 className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{videos.filter(v => v.status === 'processing').length}</p>
              <p className="text-sm text-muted-foreground">Processing</p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Link2 className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{videos.filter(v => v.lesson_id).length}</p>
              <p className="text-sm text-muted-foreground">Assigned</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        {(['all', 'drafts', 'processing', 'completed'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab === 'all' ? 'All Videos' : tab === 'drafts' ? 'Drafts' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            {tab === 'drafts' && draftCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-xs">
                {draftCount}
              </span>
            )}
            {tab === 'processing' && videos.filter(v => v.status === 'processing').length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs">
                {videos.filter(v => v.status === 'processing').length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Videos List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredVideos.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <Video className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No videos yet</h3>
          <p className="text-muted-foreground mb-4">Generate your first AI video to get started</p>
          <button
            onClick={() => setShowGenerateModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Sparkles className="h-4 w-4" />
            Generate Video
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              className="flex flex-col md:flex-row gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
            >
              {/* Thumbnail */}
              <div className="w-full md:w-48 h-28 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                {video.thumbnail_url ? (
                  <img
                    src={video.thumbnail_url}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Video className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <h3 className="font-semibold truncate flex items-center gap-2">
                      {video.title}
                      {isDraftVideo(video) && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-xs font-medium">
                          <FlaskConical className="h-3 w-3" />
                          Draft
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{video.script.slice(0, 150)}...</p>
                  </div>
                  {getStatusBadge(video.status)}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {formatDuration(video.duration_seconds)}
                  </span>
                  <span className="flex items-center gap-1">
                    {isDraftVideo(video) ? <Mic className="h-4 w-4" /> : <User className="h-4 w-4" />}
                    {isDraftVideo(video)
                      ? (draftAvatars.find(a => a.voiceId === video.voice_id)?.name ||
                         edgeVoices.find(v => v.id === video.voice_id)?.shortName ||
                         'Voice')
                      : (defaultAcademyAvatars.find(a => a.id === video.avatar_id)?.name || 'Avatar')
                    }
                  </span>
                  {video.lesson && (
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      {video.lesson.title}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex md:flex-col gap-2 flex-shrink-0">
                {video.status === 'completed' && video.video_url && (
                  <>
                    <a
                      href={video.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      {isDraftVideo(video) ? <Play className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      <span className="md:hidden">{isDraftVideo(video) ? 'Play' : 'Preview'}</span>
                    </a>
                    <a
                      href={video.video_url}
                      download
                      className="flex items-center justify-center gap-2 px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      <span className="md:hidden">Download</span>
                    </a>
                    {isDraftVideo(video) && (
                      <button
                        onClick={() => {
                          // Pre-fill form with draft's script for production upgrade
                          setFormData(prev => ({
                            ...prev,
                            title: video.title.replace('[DRAFT] ', ''),
                            script: video.script,
                            avatarId: defaultAcademyAvatars[0].id,
                            voiceId: defaultAcademyAvatars[0].voiceId,
                          }))
                          setGenerationMode('production')
                          setShowGenerateModal(true)
                        }}
                        className="flex items-center justify-center gap-2 px-3 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        <ArrowUpCircle className="h-4 w-4" />
                        <span className="md:hidden">Upgrade</span>
                      </button>
                    )}
                    {!video.lesson_id && !isDraftVideo(video) && (
                      <button
                        onClick={() => {
                          setSelectedVideo(video)
                          setShowAssignModal(true)
                        }}
                        className="flex items-center justify-center gap-2 px-3 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        <Link2 className="h-4 w-4" />
                        <span className="md:hidden">Assign</span>
                      </button>
                    )}
                  </>
                )}
                {video.status === 'failed' && (
                  <span className="text-sm text-red-500">{video.error_message || 'Generation failed'}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Generate Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Generate AI Video
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Create professional video lessons with AI avatars
              </p>
            </div>

            <div className="p-6 space-y-6">
              {/* Mode Toggle */}
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Generation Mode
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {/* Draft Mode */}
                  <button
                    onClick={() => {
                      setGenerationMode('draft')
                      setFormData(prev => ({
                        ...prev,
                        avatarId: draftAvatars[0].voiceId,
                        voiceId: draftAvatars[0].voiceId
                      }))
                    }}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      generationMode === 'draft'
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-amber-300'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2 text-center">
                      <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                        <FlaskConical className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Draft</p>
                        <p className="text-xs text-muted-foreground">Audio only</p>
                      </div>
                    </div>
                  </button>

                  {/* Animated Mode */}
                  <button
                    onClick={() => {
                      setGenerationMode('animated')
                      const talkingAvatar = talkingHeadStatus?.avatars?.[0]
                      setFormData(prev => ({
                        ...prev,
                        avatarId: talkingAvatar?.id || 'professional-female-1',
                        voiceId: talkingAvatar?.recommendedVoice || 'en-US-AriaNeural'
                      }))
                    }}
                    disabled={!talkingHeadStatus?.available}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      generationMode === 'animated'
                        ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                        : talkingHeadStatus?.available
                          ? 'border-gray-200 dark:border-gray-700 hover:border-violet-300'
                          : 'border-gray-200 dark:border-gray-700 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2 text-center">
                      <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-lg">
                        <Video className="h-5 w-5 text-violet-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Animated</p>
                        <p className="text-xs text-muted-foreground">
                          {talkingHeadStatus?.available ? 'Free lip-sync' : 'Setup needed'}
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* Production Mode */}
                  <button
                    onClick={() => {
                      setGenerationMode('production')
                      setFormData(prev => ({
                        ...prev,
                        avatarId: defaultAcademyAvatars[0].id,
                        voiceId: defaultAcademyAvatars[0].voiceId
                      }))
                    }}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      generationMode === 'production'
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2 text-center">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <ArrowUpCircle className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Production</p>
                        <p className="text-xs text-muted-foreground">HeyGen avatars</p>
                      </div>
                    </div>
                  </button>
                </div>

                {/* Mode descriptions */}
                {generationMode === 'draft' && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 flex items-center gap-1">
                    <Volume2 className="h-3 w-3" />
                    Quick audio preview with Edge TTS. Great for script iteration.
                  </p>
                )}
                {generationMode === 'animated' && talkingHeadStatus?.available && (
                  <p className="text-xs text-violet-600 dark:text-violet-400 mt-2 flex items-center gap-1">
                    <Video className="h-3 w-3" />
                    Free lip-synced video using {talkingHeadStatus.bestBackend === 'sadtalker' ? 'SadTalker' : 'Wav2Lip'}. Includes head motion.
                  </p>
                )}
                {generationMode === 'animated' && !talkingHeadStatus?.available && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-2 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Run the setup script to install SadTalker or Wav2Lip for animated videos.
                  </p>
                )}
                {generationMode === 'production' && (
                  <p className="text-xs text-primary mt-2 flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    Professional AI avatars via HeyGen. Uses API credits.
                  </p>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-2">Video Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Introduction to Web Development"
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              {/* Script Templates */}
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Wand2 className="h-4 w-4" />
                  Quick Templates
                </label>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(scriptTemplates).map((template) => (
                    <button
                      key={template}
                      onClick={() => applyScriptTemplate(template as keyof typeof scriptTemplates)}
                      className="px-3 py-1.5 text-xs border border-gray-200 dark:border-gray-700 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      {template.replace(/([A-Z])/g, ' $1').trim()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Script */}
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Script
                </label>
                <textarea
                  value={formData.script}
                  onChange={(e) => setFormData(prev => ({ ...prev, script: e.target.value }))}
                  placeholder="Write your video script here..."
                  rows={8}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.script.split(/\s+/).filter(Boolean).length} words •
                  ~{Math.ceil(formData.script.split(/\s+/).filter(Boolean).length / 150)} min video
                </p>
              </div>

              {/* Avatar/Voice Selection */}
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  {generationMode === 'draft' ? <Mic className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  {generationMode === 'draft' ? 'Select Voice' : generationMode === 'animated' ? 'Select Avatar' : 'Select Avatar'}
                </label>

                {generationMode === 'draft' ? (
                  // Draft mode: Show Edge TTS voices
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {draftAvatars.map((avatar) => (
                      <button
                        key={avatar.id}
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          avatarId: avatar.voiceId,
                          voiceId: avatar.voiceId
                        }))}
                        className={`p-3 rounded-xl border-2 transition-all ${
                          formData.voiceId === avatar.voiceId
                            ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-amber-300'
                        }`}
                      >
                        <div
                          className="w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2"
                          style={{ backgroundColor: avatar.color + '30' }}
                        >
                          <span className="text-lg font-bold" style={{ color: avatar.color }}>
                            {avatar.name.charAt(0)}
                          </span>
                        </div>
                        <p className="text-xs font-medium text-center">{avatar.name}</p>
                        <p className="text-xs text-muted-foreground text-center capitalize">{avatar.gender}</p>
                      </button>
                    ))}
                  </div>
                ) : generationMode === 'animated' ? (
                  // Animated mode: Show talking head avatars
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {(talkingHeadStatus?.avatars || []).map((avatar) => (
                      <button
                        key={avatar.id}
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          avatarId: avatar.id,
                          voiceId: avatar.recommendedVoice || 'en-US-AriaNeural'
                        }))}
                        className={`p-3 rounded-xl border-2 transition-all ${
                          formData.avatarId === avatar.id
                            ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-violet-300'
                        }`}
                      >
                        <div className="w-12 h-12 mx-auto bg-gradient-to-br from-violet-100 to-purple-200 dark:from-violet-900/40 dark:to-purple-900/40 rounded-full flex items-center justify-center mb-2">
                          <User className="h-6 w-6 text-violet-600" />
                        </div>
                        <p className="text-xs font-medium text-center">{avatar.name}</p>
                        <p className="text-xs text-muted-foreground text-center capitalize">{avatar.style}</p>
                      </button>
                    ))}
                    {(!talkingHeadStatus?.avatars || talkingHeadStatus.avatars.length === 0) && (
                      <div className="col-span-full text-center py-4 text-muted-foreground">
                        <p className="text-sm">No avatars available</p>
                        <p className="text-xs">Install SadTalker or Wav2Lip to enable animated avatars</p>
                      </div>
                    )}
                  </div>
                ) : (
                  // Production mode: Show HeyGen avatars
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {defaultAcademyAvatars.map((avatar) => (
                      <button
                        key={avatar.id}
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          avatarId: avatar.id,
                          voiceId: avatar.voiceId
                        }))}
                        className={`p-3 rounded-xl border-2 transition-all ${
                          formData.avatarId === avatar.id
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                        }`}
                      >
                        <div className="w-12 h-12 mx-auto bg-gradient-to-br from-primary/20 to-violet-500/20 rounded-full flex items-center justify-center mb-2">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <p className="text-xs font-medium text-center">{avatar.name}</p>
                        <p className="text-xs text-muted-foreground text-center">{avatar.style}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Background Color */}
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Background Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formData.backgroundColor}
                    onChange={(e) => setFormData(prev => ({ ...prev, backgroundColor: e.target.value }))}
                    className="w-12 h-12 rounded-lg cursor-pointer border-0"
                  />
                  <input
                    type="text"
                    value={formData.backgroundColor}
                    onChange={(e) => setFormData(prev => ({ ...prev, backgroundColor: e.target.value }))}
                    className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent"
                  />
                </div>
              </div>

              {/* Aspect Ratio */}
              <div>
                <label className="block text-sm font-medium mb-2">Aspect Ratio</label>
                <div className="flex gap-3">
                  {(['16:9', '9:16', '1:1'] as const).map((ratio) => (
                    <button
                      key={ratio}
                      onClick={() => setFormData(prev => ({ ...prev, aspectRatio: ratio }))}
                      className={`flex-1 py-2 rounded-lg border-2 transition-all ${
                        formData.aspectRatio === ratio
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowGenerateModal(false)
                  resetForm()
                }}
                className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleGenerate(generationMode)}
                disabled={generating || !formData.title || !formData.script || (generationMode === 'animated' && !talkingHeadStatus?.available)}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  generationMode === 'draft'
                    ? 'bg-amber-500 text-white hover:bg-amber-600'
                    : generationMode === 'animated'
                      ? 'bg-violet-500 text-white hover:bg-violet-600'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                }`}
              >
                {generating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {generationMode === 'draft' ? 'Creating Draft...' : generationMode === 'animated' ? 'Animating...' : 'Generating...'}
                  </>
                ) : (
                  <>
                    {generationMode === 'draft' ? (
                      <>
                        <FlaskConical className="h-4 w-4" />
                        Create Draft
                      </>
                    ) : generationMode === 'animated' ? (
                      <>
                        <Video className="h-4 w-4" />
                        Generate Animated Video
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Generate Production Video
                      </>
                    )}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {showAssignModal && selectedVideo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Link2 className="h-5 w-5 text-primary" />
                Assign Video to Lesson
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Select a lesson to assign &quot;{selectedVideo.title}&quot;
              </p>
            </div>

            <div className="p-6 max-h-80 overflow-y-auto">
              {lessons.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No lessons without videos found
                </p>
              ) : (
                <div className="space-y-2">
                  {lessons.map((lesson) => (
                    <button
                      key={lesson.id}
                      onClick={() => handleAssign(lesson.id)}
                      className="w-full p-4 text-left border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <p className="font-medium">{lesson.title}</p>
                      {lesson.course && (
                        <p className="text-sm text-muted-foreground">
                          {lesson.course.title}
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <button
                onClick={() => {
                  setShowAssignModal(false)
                  setSelectedVideo(null)
                }}
                className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
