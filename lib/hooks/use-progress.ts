// Progress Management Hook
// Tracks lesson progress and handles completion

'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useAuth } from './use-auth'

interface LessonProgress {
  lessonId: string
  watchTimeSeconds: number
  completed: boolean
  completedAt?: string
}

interface ProgressResponse {
  lessonProgress: LessonProgress
  progress?: {
    totalLessons: number
    completedLessons: number
    percentage: number
    courseCompleted: boolean
  }
  certificate?: {
    id: string
    certificateNumber: string
    verificationUrl: string
  }
}

interface UseProgressOptions {
  enrollmentId?: string
  courseId?: string
  lessonId: string
  onComplete?: (response: ProgressResponse) => void
  onCourseComplete?: (certificate: ProgressResponse['certificate']) => void
}

export function useProgress({
  enrollmentId,
  courseId,
  lessonId,
  onComplete,
  onCourseComplete,
}: UseProgressOptions) {
  const { user } = useAuth()
  const [isCompleting, setIsCompleting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Throttle progress updates (save every 30 seconds while watching)
  const lastSaveRef = useRef<number>(0)
  const watchTimeRef = useRef<number>(0)
  const lastPositionRef = useRef<number>(0)
  const saveIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Track watch time and current position
  const updateWatchTime = useCallback((seconds: number) => {
    watchTimeRef.current = seconds
    lastPositionRef.current = seconds
  }, [])

  // Save progress to API (throttled)
  const saveProgress = useCallback(async (force = false) => {
    if (!user || !enrollmentId) return

    const now = Date.now()
    const timeSinceLastSave = now - lastSaveRef.current

    // Only save every 30 seconds unless forced
    if (!force && timeSinceLastSave < 30000) return

    lastSaveRef.current = now
    setIsSaving(true)

    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enrollmentId,
          lessonId,
          watchTimeSeconds: Math.floor(watchTimeRef.current),
          lastPositionSeconds: Math.floor(lastPositionRef.current),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save progress')
      }
    } catch (err) {
      console.error('Progress save error:', err)
      setError(err instanceof Error ? err.message : 'Failed to save progress')
    } finally {
      setIsSaving(false)
    }
  }, [user, enrollmentId, lessonId])

  // Auto-save progress periodically while user is on the page
  useEffect(() => {
    if (!enrollmentId || !user) return

    saveIntervalRef.current = setInterval(() => {
      if (watchTimeRef.current > 0) {
        saveProgress()
      }
    }, 30000)

    // Save on unmount
    return () => {
      if (saveIntervalRef.current) {
        clearInterval(saveIntervalRef.current)
      }
      if (watchTimeRef.current > 0) {
        saveProgress(true)
      }
    }
  }, [enrollmentId, user, saveProgress])

  // Mark lesson as complete
  const completeLesson = useCallback(async () => {
    if (!user) {
      setError('Please sign in to track progress')
      return
    }

    setIsCompleting(true)
    setError(null)

    try {
      const response = await fetch(`/api/lessons/${lessonId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to complete lesson')
      }

      // Call onComplete callback
      onComplete?.(data)

      // Check if course was completed
      if (data.progress?.courseCompleted && data.certificate) {
        onCourseComplete?.(data.certificate)
      }

      return data
    } catch (err) {
      console.error('Complete lesson error:', err)
      setError(err instanceof Error ? err.message : 'Failed to complete lesson')
      throw err
    } finally {
      setIsCompleting(false)
    }
  }, [user, lessonId, onComplete, onCourseComplete])

  return {
    updateWatchTime,
    saveProgress,
    completeLesson,
    isCompleting,
    isSaving,
    error,
  }
}

// Fetch user's progress for a course
export async function fetchCourseProgress(courseId: string) {
  const response = await fetch(`/api/progress?courseId=${courseId}`)

  if (!response.ok) {
    if (response.status === 401) {
      return null // Not logged in
    }
    throw new Error('Failed to fetch progress')
  }

  return response.json()
}

// Fetch all user certificates
export async function fetchCertificates() {
  const response = await fetch('/api/certificates')

  if (!response.ok) {
    if (response.status === 401) {
      return { certificates: [] }
    }
    throw new Error('Failed to fetch certificates')
  }

  return response.json()
}

// Verify a certificate
export async function verifyCertificate(certificateNumber: string) {
  const response = await fetch(`/api/certificates?verify=${certificateNumber}`)
  return response.json()
}
