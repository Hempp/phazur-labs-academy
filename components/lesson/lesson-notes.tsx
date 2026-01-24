'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Loader2, Save, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LessonNotesProps {
  lessonId: string
  isAuthenticated: boolean
  className?: string
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

export function LessonNotes({ lessonId, isAuthenticated, className }: LessonNotesProps) {
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(true)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const previousNotesRef = useRef('')

  // Fetch notes on mount or lesson change
  useEffect(() => {
    const fetchNotes = async () => {
      if (!isAuthenticated) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const response = await fetch(`/api/lessons/${lessonId}/notes`)
        if (response.ok) {
          const data = await response.json()
          setNotes(data.notes || '')
          previousNotesRef.current = data.notes || ''
          if (data.lastUpdated) {
            setLastSaved(new Date(data.lastUpdated))
          }
        }
      } catch (error) {
        console.error('Failed to fetch notes:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotes()
  }, [lessonId, isAuthenticated])

  // Save notes function
  const saveNotes = useCallback(async (notesContent: string) => {
    if (!isAuthenticated || notesContent === previousNotesRef.current) return

    try {
      setSaveStatus('saving')
      const response = await fetch(`/api/lessons/${lessonId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: notesContent }),
      })

      if (response.ok) {
        const data = await response.json()
        previousNotesRef.current = notesContent
        setLastSaved(new Date(data.lastUpdated))
        setSaveStatus('saved')
        // Reset status after 2 seconds
        setTimeout(() => setSaveStatus('idle'), 2000)
      } else {
        setSaveStatus('error')
      }
    } catch (error) {
      console.error('Failed to save notes:', error)
      setSaveStatus('error')
    }
  }, [lessonId, isAuthenticated])

  // Debounced auto-save on notes change
  const handleNotesChange = (value: string) => {
    setNotes(value)

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    // Set new timeout for auto-save (1.5 seconds after user stops typing)
    saveTimeoutRef.current = setTimeout(() => {
      saveNotes(value)
    }, 1500)
  }

  // Manual save
  const handleManualSave = () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }
    saveNotes(notes)
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  // Save before leaving
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (notes !== previousNotesRef.current) {
        // Use sendBeacon for reliable saves during navigation
        const blob = new Blob([JSON.stringify({ notes })], { type: 'application/json' })
        navigator.sendBeacon(`/api/lessons/${lessonId}/notes`, blob)
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [notes, lessonId])

  if (!isAuthenticated) {
    return (
      <div className={cn('text-center py-8', className)}>
        <p className="text-muted-foreground">
          Sign in to save notes for this lesson
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className={cn('flex items-center justify-center py-8', className)}>
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className={className}>
      {/* Editor */}
      <div className="mb-4">
        <textarea
          value={notes}
          onChange={(e) => handleNotesChange(e.target.value)}
          placeholder="Write your notes here... (auto-saves as you type)"
          className="w-full h-48 p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary bg-background font-mono text-sm"
        />
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between text-sm">
        <div className="text-muted-foreground">
          {lastSaved && (
            <span>
              Last saved: {lastSaved.toLocaleTimeString()}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Save status indicator */}
          {saveStatus === 'saving' && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Saving...</span>
            </div>
          )}
          {saveStatus === 'saved' && (
            <div className="flex items-center gap-1 text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
              <span>Saved</span>
            </div>
          )}
          {saveStatus === 'error' && (
            <div className="text-destructive">
              Failed to save
            </div>
          )}

          {/* Manual save button */}
          <button
            onClick={handleManualSave}
            disabled={saveStatus === 'saving' || notes === previousNotesRef.current}
            className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
          >
            <Save className="h-4 w-4" />
            Save
          </button>
        </div>
      </div>

      {/* Help text */}
      <p className="text-xs text-muted-foreground mt-4">
        Your notes auto-save as you type. They&apos;re private and only visible to you.
      </p>
    </div>
  )
}
