'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  SkipBack,
  SkipForward,
  Settings,
  Lock,
  Shield,
  AlertTriangle,
} from 'lucide-react';
import {
  initializeContentProtection,
  generateWatermark,
  ContentProtectionConfig,
} from '@/lib/content-protection';

interface ProtectedVideoPlayerProps {
  src: string;
  poster?: string;
  title: string;
  userId: string;
  userEmail: string;
  contentId: string;
  onProgress?: (progress: number, duration: number) => void;
  onComplete?: () => void;
  initialProgress?: number;
  watermarkEnabled?: boolean;
}

export default function ProtectedVideoPlayer({
  src,
  poster,
  title,
  userId,
  userEmail,
  contentId,
  onProgress,
  onComplete,
  initialProgress = 0,
  watermarkEnabled = true,
}: ProtectedVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [buffered, setBuffered] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [quality, setQuality] = useState('auto');
  const [hasCompleted, setHasCompleted] = useState(false);
  const [securityWarning, setSecurityWarning] = useState<string | null>(null);

  const watermarkText = generateWatermark(userId, userEmail);

  // Initialize content protection
  useEffect(() => {
    const protectionConfig: ContentProtectionConfig = {
      disableRightClick: true,
      disableKeyboardShortcuts: true,
      disableTextSelection: true,
      enableWatermark: watermarkEnabled,
      detectScreenRecording: true,
      trackViewingSessions: true,
    };

    const cleanup = initializeContentProtection(protectionConfig);
    return cleanup;
  }, [watermarkEnabled]);

  // Set initial progress
  useEffect(() => {
    if (videoRef.current && initialProgress > 0 && duration > 0) {
      videoRef.current.currentTime = initialProgress;
    }
  }, [initialProgress, duration]);

  // Auto-hide controls
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isPlaying && showControls) {
      timeout = setTimeout(() => setShowControls(false), 3000);
    }
    return () => clearTimeout(timeout);
  }, [isPlaying, showControls]);

  // Handle visibility change (pause when tab hidden)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && videoRef.current && !videoRef.current.paused) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!containerRef.current?.contains(document.activeElement)) return;

      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          skip(-10);
          break;
        case 'ArrowRight':
          e.preventDefault();
          skip(10);
          break;
        case 'ArrowUp':
          e.preventDefault();
          adjustVolume(0.1);
          break;
        case 'ArrowDown':
          e.preventDefault();
          adjustVolume(-0.1);
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, []);

  const skip = useCallback((seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(
        0,
        Math.min(videoRef.current.currentTime + seconds, duration)
      );
    }
  }, [duration]);

  const adjustVolume = useCallback((delta: number) => {
    const newVolume = Math.max(0, Math.min(1, volume + delta));
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    if (newVolume > 0) setIsMuted(false);
  }, [volume]);

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      setCurrentTime(current);

      // Report progress
      if (onProgress && duration > 0) {
        onProgress(current, duration);
      }

      // Check for completion (90% watched)
      if (!hasCompleted && duration > 0 && current >= duration * 0.9) {
        setHasCompleted(true);
        onComplete?.();
      }
    }
  }, [duration, hasCompleted, onProgress, onComplete]);

  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  }, []);

  const handleProgress = useCallback(() => {
    if (videoRef.current && videoRef.current.buffered.length > 0) {
      const bufferedEnd = videoRef.current.buffered.end(
        videoRef.current.buffered.length - 1
      );
      setBuffered(bufferedEnd);
    }
  }, []);

  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current && videoRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = pos * duration;
    }
  }, [duration]);

  const formatTime = (time: number): string => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 2];
  const qualities = ['auto', '1080p', '720p', '480p', '360p'];

  return (
    <div
      ref={containerRef}
      className="protected-content relative bg-black rounded-lg overflow-hidden group"
      onMouseMove={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      tabIndex={0}
    >
      {/* Security Warning */}
      {securityWarning && (
        <div className="absolute top-4 left-4 right-4 z-50 bg-red-500/90 text-white px-4 py-3 rounded-lg flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">{securityWarning}</span>
          <button
            onClick={() => setSecurityWarning(null)}
            className="ml-auto text-white/80 hover:text-white"
          >
            ×
          </button>
        </div>
      )}

      {/* Watermark Overlay */}
      {watermarkEnabled && (
        <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
          <div className="absolute inset-0 flex flex-wrap items-center justify-center opacity-10">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="text-white text-sm font-mono transform -rotate-45 whitespace-nowrap m-8"
                style={{ userSelect: 'none' }}
              >
                {watermarkText}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Video Element */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full aspect-video"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onProgress={handleProgress}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          setIsPlaying(false);
          onComplete?.();
        }}
        playsInline
        controlsList="nodownload nofullscreen noremoteplayback"
        disablePictureInPicture
        onContextMenu={(e) => e.preventDefault()}
      />

      {/* Protection Badge */}
      <div className="absolute top-4 right-4 z-30 flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-full">
        <Shield className="w-4 h-4 text-green-400" />
        <span className="text-xs text-white font-medium">Protected Content</span>
      </div>

      {/* Click to Play/Pause Overlay */}
      <div
        className="absolute inset-0 z-10 cursor-pointer"
        onClick={togglePlay}
      />

      {/* Controls Overlay */}
      <div
        className={`absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-black/80 to-transparent pt-20 pb-4 px-4 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Progress Bar */}
        <div
          ref={progressRef}
          className="relative h-1 bg-white/20 rounded-full cursor-pointer mb-4 group/progress"
          onClick={handleProgressClick}
        >
          {/* Buffered */}
          <div
            className="absolute h-full bg-white/40 rounded-full"
            style={{ width: `${(buffered / duration) * 100}%` }}
          />
          {/* Progress */}
          <div
            className="absolute h-full bg-indigo-500 rounded-full"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
          {/* Hover Preview */}
          <div
            className="absolute h-3 w-3 bg-indigo-500 rounded-full -top-1 transform -translate-x-1/2 opacity-0 group-hover/progress:opacity-100 transition-opacity"
            style={{ left: `${(currentTime / duration) * 100}%` }}
          />
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="text-white hover:text-indigo-400 transition-colors"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>

            {/* Skip Buttons */}
            <button
              onClick={() => skip(-10)}
              className="text-white hover:text-indigo-400 transition-colors"
            >
              <SkipBack className="w-5 h-5" />
            </button>
            <button
              onClick={() => skip(10)}
              className="text-white hover:text-indigo-400 transition-colors"
            >
              <SkipForward className="w-5 h-5" />
            </button>

            {/* Volume */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="text-white hover:text-indigo-400 transition-colors"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  const newVol = parseFloat(e.target.value);
                  setVolume(newVol);
                  if (videoRef.current) videoRef.current.volume = newVol;
                  setIsMuted(newVol === 0);
                }}
                className="w-20 h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
              />
            </div>

            {/* Time Display */}
            <span className="text-white text-sm font-mono">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Settings */}
            <div className="relative">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="text-white hover:text-indigo-400 transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>

              {showSettings && (
                <div className="absolute bottom-full right-0 mb-2 bg-gray-900 rounded-lg shadow-xl py-2 min-w-[200px]">
                  {/* Playback Speed */}
                  <div className="px-4 py-2 border-b border-gray-700">
                    <p className="text-xs text-gray-400 mb-2">Playback Speed</p>
                    <div className="flex flex-wrap gap-1">
                      {playbackRates.map((rate) => (
                        <button
                          key={rate}
                          onClick={() => {
                            setPlaybackRate(rate);
                            if (videoRef.current) videoRef.current.playbackRate = rate;
                          }}
                          className={`px-2 py-1 text-xs rounded ${
                            playbackRate === rate
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          {rate}x
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quality */}
                  <div className="px-4 py-2">
                    <p className="text-xs text-gray-400 mb-2">Quality</p>
                    <div className="flex flex-wrap gap-1">
                      {qualities.map((q) => (
                        <button
                          key={q}
                          onClick={() => setQuality(q)}
                          className={`px-2 py-1 text-xs rounded ${
                            quality === q
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="text-white hover:text-indigo-400 transition-colors"
            >
              {isFullscreen ? (
                <Minimize className="w-5 h-5" />
              ) : (
                <Maximize className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="absolute top-4 left-4">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-indigo-400" />
            <span className="text-white font-medium text-sm">{title}</span>
          </div>
        </div>
      </div>

      {/* Big Play Button (when paused) */}
      {!isPlaying && showControls && (
        <button
          onClick={togglePlay}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 bg-indigo-600/80 hover:bg-indigo-600 text-white rounded-full p-5 transition-all hover:scale-110"
        >
          <Play className="w-10 h-10" />
        </button>
      )}
    </div>
  );
}
