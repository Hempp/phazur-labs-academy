'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  SkipBack,
  SkipForward,
  Rewind,
  FastForward,
  Loader2,
  CheckCircle2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface VideoChapter {
  id: string
  title: string
  startTime: number
  endTime: number
}

interface VideoPlayerProps {
  src: string
  poster?: string
  title?: string
  chapters?: VideoChapter[]
  initialProgress?: number
  onProgress?: (progress: number, currentTime: number) => void
  onComplete?: () => void
  autoPlay?: boolean
  className?: string
}

const formatTime = (seconds: number): string => {
  const hrs = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]

export function VideoPlayer({
  src,
  poster,
  title,
  chapters = [],
  initialProgress = 0,
  onProgress,
  onComplete,
  autoPlay = false,
  className,
}: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout>()

  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(1)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [buffered, setBuffered] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [showSettings, setShowSettings] = useState(false)
  const [hasCompleted, setHasCompleted] = useState(false)
  const [currentChapter, setCurrentChapter] = useState<VideoChapter | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Check for empty/invalid src on mount
  useEffect(() => {
    if (!src || src.trim() === '') {
      setIsLoading(false)
      setError('No video source available. The video may not have been uploaded yet.')
    }
  }, [src])

  // Initialize video progress
  useEffect(() => {
    const video = videoRef.current
    if (video && initialProgress > 0 && duration > 0) {
      video.currentTime = (initialProgress / 100) * duration
    }
  }, [initialProgress, duration])

  // Handle play/pause
  const togglePlay = useCallback(() => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      video.play()
    } else {
      video.pause()
    }
  }, [])

  // Handle mute
  const toggleMute = useCallback(() => {
    const video = videoRef.current
    if (!video) return

    video.muted = !video.muted
    setIsMuted(video.muted)
  }, [])

  // Handle volume change
  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    if (!video) return

    const newVolume = parseFloat(e.target.value)
    video.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }, [])

  // Handle seek
  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current
    const progress = progressRef.current
    if (!video || !progress) return

    const rect = progress.getBoundingClientRect()
    const pos = (e.clientX - rect.left) / rect.width
    video.currentTime = pos * video.duration
  }, [])

  // Handle skip
  const skip = useCallback((seconds: number) => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = Math.min(Math.max(0, video.currentTime + seconds), video.duration)
  }, [])

  // Handle playback rate
  const handlePlaybackRate = useCallback((rate: number) => {
    const video = videoRef.current
    if (!video) return

    video.playbackRate = rate
    setPlaybackRate(rate)
    setShowSettings(false)
  }, [])

  // Handle fullscreen
  const toggleFullscreen = useCallback(async () => {
    const container = containerRef.current
    if (!container) return

    if (!document.fullscreenElement) {
      await container.requestFullscreen()
      setIsFullscreen(true)
    } else {
      await document.exitFullscreen()
      setIsFullscreen(false)
    }
  }, [])

  // Auto-hide controls
  const resetControlsTimeout = useCallback(() => {
    setShowControls(true)
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false)
      }
    }, 3000)
  }, [isPlaying])

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleLoadedMetadata = () => {
      setDuration(video.duration)
      setIsLoading(false)
    }
    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)

      // Update buffered
      if (video.buffered.length > 0) {
        setBuffered((video.buffered.end(video.buffered.length - 1) / video.duration) * 100)
      }

      // Track progress
      const progress = (video.currentTime / video.duration) * 100
      onProgress?.(progress, video.currentTime)

      // Update current chapter
      if (chapters.length > 0) {
        const chapter = chapters.find(
          (c) => video.currentTime >= c.startTime && video.currentTime < c.endTime
        )
        setCurrentChapter(chapter || null)
      }

      // Check completion (95% watched)
      if (!hasCompleted && progress >= 95) {
        setHasCompleted(true)
        onComplete?.()
      }
    }
    const handleWaiting = () => setIsLoading(true)
    const handleCanPlay = () => setIsLoading(false)
    const handleEnded = () => {
      setIsPlaying(false)
      if (!hasCompleted) {
        setHasCompleted(true)
        onComplete?.()
      }
    }
    const handleError = () => {
      setIsLoading(false)
      setError('Failed to load video. Please check the video URL or try again later.')
    }

    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('waiting', handleWaiting)
    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('ended', handleEnded)
    video.addEventListener('error', handleError)

    return () => {
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('waiting', handleWaiting)
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('ended', handleEnded)
      video.removeEventListener('error', handleError)
    }
  }, [chapters, hasCompleted, onComplete, onProgress])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault()
          togglePlay()
          break
        case 'arrowleft':
          e.preventDefault()
          skip(-10)
          break
        case 'arrowright':
          e.preventDefault()
          skip(10)
          break
        case 'arrowup':
          e.preventDefault()
          if (videoRef.current) {
            videoRef.current.volume = Math.min(1, videoRef.current.volume + 0.1)
            setVolume(videoRef.current.volume)
          }
          break
        case 'arrowdown':
          e.preventDefault()
          if (videoRef.current) {
            videoRef.current.volume = Math.max(0, videoRef.current.volume - 0.1)
            setVolume(videoRef.current.volume)
          }
          break
        case 'm':
          toggleMute()
          break
        case 'f':
          toggleFullscreen()
          break
        case 'j':
          skip(-10)
          break
        case 'l':
          skip(10)
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [skip, toggleFullscreen, toggleMute, togglePlay])

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative bg-black rounded-lg overflow-hidden group',
        isFullscreen && 'rounded-none',
        className
      )}
      onMouseMove={resetControlsTimeout}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-contain"
        autoPlay={autoPlay}
        playsInline
        onClick={togglePlay}
      />

      {/* Loading Spinner */}
      {isLoading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <Loader2 className="h-12 w-12 text-white animate-spin" />
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white p-6">
          <svg
            className="h-12 w-12 text-red-500 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-center text-sm">{error}</p>
          <button
            onClick={() => {
              setError(null)
              setIsLoading(true)
              videoRef.current?.load()
            }}
            className="mt-4 px-4 py-2 bg-primary hover:bg-primary/90 rounded-lg text-sm font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Play/Pause Overlay */}
      {!isPlaying && !isLoading && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
        >
          <div className="p-5 rounded-full bg-white/90 hover:scale-110 transition-transform">
            <Play className="h-10 w-10 text-primary fill-primary" />
          </div>
        </button>
      )}

      {/* Completed Badge */}
      {hasCompleted && (
        <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-emerald-500 text-white rounded-full text-sm font-medium">
          <CheckCircle2 className="h-4 w-4" />
          Completed
        </div>
      )}

      {/* Controls */}
      <div
        className={cn(
          'absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-20 pb-4 px-4 transition-opacity duration-300',
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
      >
        {/* Chapter Title */}
        {currentChapter && (
          <div className="mb-3 text-sm text-white/80">
            Chapter: {currentChapter.title}
          </div>
        )}

        {/* Progress Bar */}
        <div
          ref={progressRef}
          className="relative h-1.5 bg-white/30 rounded-full cursor-pointer group/progress mb-4"
          onClick={handleSeek}
        >
          {/* Buffered */}
          <div
            className="absolute h-full bg-white/30 rounded-full"
            style={{ width: `${buffered}%` }}
          />
          {/* Progress */}
          <div
            className="absolute h-full bg-primary rounded-full"
            style={{ width: `${progress}%` }}
          />
          {/* Chapter markers */}
          {chapters.map((chapter) => (
            <div
              key={chapter.id}
              className="absolute top-0 bottom-0 w-1 bg-white/60 rounded-full"
              style={{ left: `${(chapter.startTime / duration) * 100}%` }}
              title={chapter.title}
            />
          ))}
          {/* Thumb */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity"
            style={{ left: `calc(${progress}% - 8px)` }}
          />
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </button>

            {/* Skip Back */}
            <button
              onClick={() => skip(-10)}
              className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
              title="Back 10s (J)"
            >
              <Rewind className="h-5 w-5" />
            </button>

            {/* Skip Forward */}
            <button
              onClick={() => skip(10)}
              className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
              title="Forward 10s (L)"
            >
              <FastForward className="h-5 w-5" />
            </button>

            {/* Volume */}
            <div className="flex items-center gap-1 group/volume">
              <button
                onClick={toggleMute}
                className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-0 group-hover/volume:w-20 transition-all duration-300 accent-primary"
              />
            </div>

            {/* Time */}
            <div className="text-white text-sm ml-2">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Playback Speed */}
            <div className="relative">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors flex items-center gap-1"
              >
                <Settings className="h-5 w-5" />
                <span className="text-sm">{playbackRate}x</span>
              </button>

              {showSettings && (
                <div className="absolute bottom-full right-0 mb-2 py-2 bg-black/90 rounded-lg min-w-[120px]">
                  <div className="px-3 py-1 text-xs text-white/60 uppercase tracking-wider">
                    Playback Speed
                  </div>
                  {playbackRates.map((rate) => (
                    <button
                      key={rate}
                      onClick={() => handlePlaybackRate(rate)}
                      className={cn(
                        'w-full px-3 py-1.5 text-left text-sm hover:bg-white/10 transition-colors',
                        playbackRate === rate ? 'text-primary' : 'text-white'
                      )}
                    >
                      {rate === 1 ? 'Normal' : `${rate}x`}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
              title="Fullscreen (F)"
            >
              {isFullscreen ? (
                <Minimize className="h-5 w-5" />
              ) : (
                <Maximize className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
