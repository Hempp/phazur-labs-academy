'use client';

import { useEffect, useCallback, useState } from 'react';
import {
  initializeContentProtection,
  ContentProtectionConfig,
  defaultProtectionConfig,
  createViewingSession,
  updateViewingSession,
  ViewingSession,
} from '@/lib/content-protection';

interface UseContentProtectionOptions extends Partial<ContentProtectionConfig> {
  userId?: string;
  contentId?: string;
  onSecurityViolation?: (type: string, details?: string) => void;
}

interface UseContentProtectionReturn {
  isProtected: boolean;
  session: ViewingSession | null;
  updateProgress: (currentPosition: number, totalDuration: number) => void;
  reportViolation: (type: string, details?: string) => void;
}

export function useContentProtection(
  options: UseContentProtectionOptions = {}
): UseContentProtectionReturn {
  const [isProtected, setIsProtected] = useState(false);
  const [session, setSession] = useState<ViewingSession | null>(null);
  const [violations, setViolations] = useState<{ type: string; details?: string; timestamp: Date }[]>([]);

  const {
    userId,
    contentId,
    onSecurityViolation,
    ...protectionConfig
  } = options;

  // Initialize protection on mount
  useEffect(() => {
    const config: ContentProtectionConfig = {
      ...defaultProtectionConfig,
      ...protectionConfig,
    };

    const cleanup = initializeContentProtection(config);
    setIsProtected(true);

    // Create viewing session if user and content IDs provided
    if (userId && contentId) {
      setSession(createViewingSession(userId, contentId));
    }

    return () => {
      cleanup();
      setIsProtected(false);
    };
  }, [userId, contentId]);

  // Monitor for dev tools (basic detection)
  useEffect(() => {
    const detectDevTools = () => {
      const widthThreshold = window.outerWidth - window.innerWidth > 160;
      const heightThreshold = window.outerHeight - window.innerHeight > 160;

      if (widthThreshold || heightThreshold) {
        reportViolation('devtools_detected', 'Developer tools may be open');
      }
    };

    // Check on resize
    window.addEventListener('resize', detectDevTools);

    // Initial check
    detectDevTools();

    return () => window.removeEventListener('resize', detectDevTools);
  }, []);

  // Monitor for tab switching
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        reportViolation('tab_hidden', 'User switched away from content');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const updateProgress = useCallback((currentPosition: number, totalDuration: number) => {
    if (session) {
      setSession(prev =>
        prev ? updateViewingSession(prev, currentPosition, totalDuration) : prev
      );
    }
  }, [session]);

  const reportViolation = useCallback((type: string, details?: string) => {
    const violation = { type, details, timestamp: new Date() };
    setViolations(prev => [...prev, violation]);

    // Notify callback
    if (onSecurityViolation) {
      onSecurityViolation(type, details);
    }

    // In production, send to server for logging
    console.warn('Security violation:', violation);
  }, [onSecurityViolation]);

  return {
    isProtected,
    session,
    updateProgress,
    reportViolation,
  };
}

// Hook for tracking video progress with auto-save
export function useVideoProgress(
  contentId: string,
  userId: string,
  saveInterval: number = 10000 // Save every 10 seconds
) {
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [lastSavedProgress, setLastSavedProgress] = useState(0);

  // Load initial progress
  useEffect(() => {
    const loadProgress = async () => {
      try {
        // In production, fetch from API
        const saved = localStorage.getItem(`video_progress_${contentId}_${userId}`);
        if (saved) {
          setProgress(parseFloat(saved));
        }
      } catch (error) {
        console.error('Failed to load progress:', error);
      }
    };
    loadProgress();
  }, [contentId, userId]);

  // Auto-save progress
  useEffect(() => {
    const interval = setInterval(() => {
      if (progress !== lastSavedProgress && progress > 0) {
        // In production, save to API
        localStorage.setItem(`video_progress_${contentId}_${userId}`, progress.toString());
        setLastSavedProgress(progress);
      }
    }, saveInterval);

    return () => clearInterval(interval);
  }, [progress, lastSavedProgress, contentId, userId, saveInterval]);

  const updateProgress = useCallback((currentTime: number, totalDuration: number) => {
    setProgress(currentTime);
    setDuration(totalDuration);
  }, []);

  const getProgressPercentage = useCallback(() => {
    if (duration === 0) return 0;
    return Math.round((progress / duration) * 100);
  }, [progress, duration]);

  return {
    progress,
    duration,
    updateProgress,
    getProgressPercentage,
    isComplete: duration > 0 && progress >= duration * 0.9,
  };
}
