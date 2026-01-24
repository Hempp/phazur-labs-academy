'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
  Loader2,
  CheckCircle2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface AudioPlayerProps {
  src: string
  title?: string
  initialProgress?: number
  onProgress?: (progress: number, currentTime: number) => void
  onComplete?: () => void
  autoPlay?: boolean
  className?: string
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function AudioPlayer({
  src,
  title,
  initialProgress = 0,
  onProgress,
  onComplete,
  autoPlay = false,
  className,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(1)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [hasCompleted, setHasCompleted] = useState(false)

  // Initialize audio progress
  useEffect(() => {
    const audio = audioRef.current
    if (audio && initialProgress > 0 && duration > 0) {
      audio.currentTime = (initialProgress / 100) * duration
    }
  }, [initialProgress, duration])

  // Handle play/pause
  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    if (audio.paused) {
      audio.play()
    } else {
      audio.pause()
    }
  }, [])

  // Handle mute
  const toggleMute = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.muted = !audio.muted
    setIsMuted(audio.muted)
  }, [])

  // Handle volume change
  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return

    const newVolume = parseFloat(e.target.value)
    audio.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }, [])

  // Handle seek
  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current
    const progress = progressRef.current
    if (!audio || !progress) return

    const rect = progress.getBoundingClientRect()
    const pos = (e.clientX - rect.left) / rect.width
    audio.currentTime = pos * audio.duration
  }, [])

  // Handle skip
  const skip = useCallback((seconds: number) => {
    const audio = audioRef.current
    if (!audio) return

    audio.currentTime = Math.min(Math.max(0, audio.currentTime + seconds), audio.duration)
  }, [])

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
      setIsLoading(false)
    }
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)

      // Track progress
      const progress = (audio.currentTime / audio.duration) * 100
      onProgress?.(progress, audio.currentTime)

      // Check completion (95% listened)
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

    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('waiting', handleWaiting)
    audio.addEventListener('canplay', handleCanPlay)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('waiting', handleWaiting)
      audio.removeEventListener('canplay', handleCanPlay)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [hasCompleted, onComplete, onProgress])

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div
      className={cn(
        'relative bg-gradient-to-br from-primary/20 via-primary/10 to-background rounded-xl overflow-hidden',
        className
      )}
    >
      {/* Audio Element (hidden) */}
      <audio
        ref={audioRef}
        src={src}
        autoPlay={autoPlay}
        preload="metadata"
      />

      {/* Visual Display */}
      <div className="aspect-video flex flex-col items-center justify-center p-8">
        {/* Animated Audio Visualization */}
        <div className="flex items-end gap-1 h-24 mb-6">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={cn(
                'w-2 bg-primary rounded-full transition-all duration-150',
                isPlaying ? 'animate-pulse' : ''
              )}
              style={{
                height: isPlaying
                  ? `${Math.random() * 60 + 20}%`
                  : '20%',
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>

        {/* Title */}
        {title && (
          <h3 className="text-xl font-semibold text-center mb-2">{title}</h3>
        )}
        <p className="text-sm text-muted-foreground mb-6">Audio Lesson</p>

        {/* Completed Badge */}
        {hasCompleted && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500 text-white rounded-full text-sm font-medium mb-4">
            <CheckCircle2 className="h-4 w-4" />
            Completed
          </div>
        )}

        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading...
          </div>
        )}

        {/* Play Button */}
        {!isLoading && (
          <button
            onClick={togglePlay}
            className="p-5 rounded-full bg-primary text-primary-foreground hover:scale-110 transition-transform mb-6"
          >
            {isPlaying ? (
              <Pause className="h-8 w-8" />
            ) : (
              <Play className="h-8 w-8 ml-1" />
            )}
          </button>
        )}
      </div>

      {/* Controls */}
      <div className="bg-card/80 backdrop-blur-sm p-4 border-t">
        {/* Progress Bar */}
        <div
          ref={progressRef}
          className="relative h-2 bg-muted rounded-full cursor-pointer group mb-4"
          onClick={handleSeek}
        >
          <div
            className="absolute h-full bg-primary rounded-full"
            style={{ width: `${progress}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            style={{ left: `calc(${progress}% - 8px)` }}
          />
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Skip Back */}
            <button
              onClick={() => skip(-10)}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              title="Back 10s"
            >
              <SkipBack className="h-5 w-5" />
            </button>

            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </button>

            {/* Skip Forward */}
            <button
              onClick={() => skip(10)}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              title="Forward 10s"
            >
              <SkipForward className="h-5 w-5" />
            </button>

            {/* Volume */}
            <div className="flex items-center gap-1 ml-2">
              <button
                onClick={toggleMute}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
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
                className="w-20 accent-primary"
              />
            </div>
          </div>

          {/* Time */}
          <div className="text-sm text-muted-foreground">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>
      </div>
    </div>
  )
}
