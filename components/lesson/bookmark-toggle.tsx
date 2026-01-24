'use client'

import { useState, useEffect } from 'react'
import { Bookmark, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BookmarkToggleProps {
  lessonId: string
  isAuthenticated: boolean
  className?: string
  showLabel?: boolean
}

export function BookmarkToggle({
  lessonId,
  isAuthenticated,
  className,
  showLabel = false,
}: BookmarkToggleProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)

  // Check if lesson is bookmarked on mount
  useEffect(() => {
    const checkBookmark = async () => {
      if (!isAuthenticated) {
        setChecking(false)
        return
      }

      try {
        const response = await fetch('/api/bookmarks')
        if (response.ok) {
          const data = await response.json()
          const isLessonBookmarked = data.bookmarks?.some(
            (b: { lesson_id: string }) => b.lesson_id === lessonId
          )
          setIsBookmarked(isLessonBookmarked)
        }
      } catch (error) {
        console.error('Failed to check bookmark status:', error)
      } finally {
        setChecking(false)
      }
    }

    checkBookmark()
  }, [lessonId, isAuthenticated])

  const toggleBookmark = async () => {
    if (!isAuthenticated) {
      // Could redirect to login or show a message
      return
    }

    setLoading(true)
    try {
      if (isBookmarked) {
        // Remove bookmark
        const response = await fetch(`/api/bookmarks?lessonId=${lessonId}`, {
          method: 'DELETE',
        })
        if (response.ok) {
          setIsBookmarked(false)
        }
      } else {
        // Add bookmark
        const response = await fetch('/api/bookmarks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lessonId }),
        })
        if (response.ok) {
          setIsBookmarked(true)
        }
      }
    } catch (error) {
      console.error('Failed to toggle bookmark:', error)
    } finally {
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <button
        disabled
        className={cn(
          'p-2 rounded-lg opacity-50',
          className
        )}
      >
        <Loader2 className="h-5 w-5 animate-spin" />
      </button>
    )
  }

  return (
    <button
      onClick={toggleBookmark}
      disabled={loading || !isAuthenticated}
      title={
        !isAuthenticated
          ? 'Sign in to bookmark'
          : isBookmarked
          ? 'Remove bookmark'
          : 'Bookmark this lesson'
      }
      className={cn(
        'flex items-center gap-1 p-2 rounded-lg transition-colors',
        isBookmarked
          ? 'text-primary bg-primary/10 hover:bg-primary/20'
          : 'hover:bg-muted',
        !isAuthenticated && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <Bookmark
          className={cn('h-5 w-5', isBookmarked && 'fill-current')}
        />
      )}
      {showLabel && (
        <span className="text-sm">
          {isBookmarked ? 'Bookmarked' : 'Bookmark'}
        </span>
      )}
    </button>
  )
}
