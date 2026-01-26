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
  RotateCcw,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Completion threshold - lesson marked complete when this % is watched
const COMPLETION_THRESHOLD = 90

// Resume prompt threshold - show prompt if more than this % was watched
const RESUME_PROMPT_THRESHOLD = 5

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
  const [showResumePrompt, setShowResumePrompt] = useState(false)
  const [savedResumeTime, setSavedResumeTime] = useState(0)

  // Check for empty/invalid src on mount
  useEffect(() => {
    if (!src || src.trim() === '') {
      setIsLoading(false)
      setError('No video source available. The video may not have been uploaded yet.')
    }
  }, [src])

  // Initialize video progress - show resume prompt if significant progress exists
  useEffect(() => {
    const video = videoRef.current
    if (video && initialProgress > RESUME_PROMPT_THRESHOLD && duration > 0 && !showResumePrompt) {
      const resumeTime = (initialProgress / 100) * duration
      setSavedResumeTime(resumeTime)
      setShowResumePrompt(true)
    }
  }, [initialProgress, duration, showResumePrompt])

  // Handle resume from saved position
  const handleResume = useCallback(() => {
    const video = videoRef.current
    if (video && savedResumeTime > 0) {
      video.currentTime = savedResumeTime
    }
    setShowResumePrompt(false)
  }, [savedResumeTime])

  // Handle start from beginning
  const handleStartFromBeginning = useCallback(() => {
    const video = videoRef.current
    if (video) {
      video.currentTime = 0
    }
    setShowResumePrompt(false)
  }, [])

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

  // Handle fullscreen - with iOS Safari support
  const toggleFullscreen = useCallback(async () => {
    const container = containerRef.current
    const video = videoRef.current
    if (!container) return

    try {
      // Check if we're currently in fullscreen
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        (document as { webkitFullscreenElement?: Element }).webkitFullscreenElement
      )

      if (!isCurrentlyFullscreen) {
        // Try standard fullscreen API first (container for controls)
        if (container.requestFullscreen) {
          await container.requestFullscreen()
        } else if ((container as HTMLDivElement & { webkitRequestFullscreen?: () => Promise<void> }).webkitRequestFullscreen) {
          // Safari desktop
          await (container as HTMLDivElement & { webkitRequestFullscreen: () => Promise<void> }).webkitRequestFullscreen()
        } else if (video && (video as HTMLVideoElement & { webkitEnterFullscreen?: () => void }).webkitEnterFullscreen) {
          // iOS Safari - use video element's native fullscreen
          (video as HTMLVideoElement & { webkitEnterFullscreen: () => void }).webkitEnterFullscreen()
        }
        setIsFullscreen(true)
      } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
          await document.exitFullscreen()
        } else if ((document as Document & { webkitExitFullscreen?: () => Promise<void> }).webkitExitFullscreen) {
          await (document as Document & { webkitExitFullscreen: () => Promise<void> }).webkitExitFullscreen()
        }
        setIsFullscreen(false)
      }
    } catch (err) {
      console.error('Fullscreen error:', err)
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

      // Check completion (90% watched)
      if (!hasCompleted && progress >= COMPLETION_THRESHOLD) {
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

  // Fullscreen change listener - with webkit support
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFullscreenNow = !!(
        document.fullscreenElement ||
        (document as { webkitFullscreenElement?: Element }).webkitFullscreenElement
      )
      setIsFullscreen(isFullscreenNow)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
    }
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
        aria-label={title || 'Video player'}
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

      {/* Resume Prompt */}
      {showResumePrompt && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20">
          <div className="bg-card rounded-xl p-6 max-w-sm mx-4 text-center shadow-2xl">
            <RotateCcw className="h-10 w-10 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Resume watching?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              You left off at <span className="font-medium text-foreground">{formatTime(savedResumeTime)}</span>
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleStartFromBeginning}
                className="flex-1 px-4 py-2 border rounded-lg text-sm font-medium hover:bg-muted transition-colors"
              >
                Start Over
              </button>
              <button
                onClick={handleResume}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Resume
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Play/Pause Overlay */}
      {!isPlaying && !isLoading && !showResumePrompt && (
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause video' : 'Play video'}
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
          role="slider"
          aria-label="Video progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
          aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
          tabIndex={0}
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
              aria-label={isPlaying ? 'Pause (Space or K)' : 'Play (Space or K)'}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Play className="h-5 w-5" aria-hidden="true" />
              )}
            </button>

            {/* Skip Back */}
            <button
              onClick={() => skip(-10)}
              className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
              title="Back 10s (J)"
              aria-label="Rewind 10 seconds (J)"
            >
              <Rewind className="h-5 w-5" aria-hidden="true" />
            </button>

            {/* Skip Forward */}
            <button
              onClick={() => skip(10)}
              className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
              title="Forward 10s (L)"
              aria-label="Forward 10 seconds (L)"
            >
              <FastForward className="h-5 w-5" aria-hidden="true" />
            </button>

            {/* Volume */}
            <div className="flex items-center gap-1 group/volume" role="group" aria-label="Volume controls">
              <button
                onClick={toggleMute}
                className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
                aria-label={isMuted ? 'Unmute (M)' : 'Mute (M)'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Volume2 className="h-5 w-5" aria-hidden="true" />
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
                aria-label={`Volume: ${Math.round(volume * 100)}%`}
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
                aria-label={`Playback speed: ${playbackRate}x. Click to change`}
                aria-expanded={showSettings}
                aria-haspopup="menu"
              >
                <Settings className="h-5 w-5" aria-hidden="true" />
                <span className="text-sm">{playbackRate}x</span>
              </button>

              {showSettings && (
                <div
                  className="absolute bottom-full right-0 mb-2 py-2 bg-black/90 rounded-lg min-w-[120px]"
                  role="menu"
                  aria-label="Playback speed options"
                >
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
                      role="menuitemradio"
                      aria-checked={playbackRate === rate}
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
              aria-label={isFullscreen ? 'Exit fullscreen (F)' : 'Enter fullscreen (F)'}
            >
              {isFullscreen ? (
                <Minimize className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Maximize className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
