'use client'

import { useState, useEffect, useCallback } from 'react'
import { MessageSquare, Plus, ChevronRight, CheckCircle, Pin, Loader2, Wifi, WifiOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface Discussion {
  id: string
  title: string
  content: string
  is_pinned: boolean
  is_resolved: boolean
  view_count: number
  created_at: string
  user: {
    id: string
    full_name: string
    avatar_url: string | null
  }
  replies: { count: number }[]
}

interface LessonDiscussionProps {
  courseId: string
  lessonId?: string
  isAuthenticated?: boolean
}

export function LessonDiscussion({
  courseId,
  lessonId,
  isAuthenticated = false
}: LessonDiscussionProps) {
  const [discussions, setDiscussions] = useState<Discussion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')
  const [isRealtime, setIsRealtime] = useState(false)

  // Memoized fetch function to prevent re-renders
  const fetchDiscussions = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({ courseId })
      if (lessonId) params.append('lessonId', lessonId)

      const response = await fetch(`/api/discussions?${params}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load discussions')
      }

      setDiscussions(data.discussions || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load discussions')
    } finally {
      setLoading(false)
    }
  }, [courseId, lessonId])

  // Initial fetch and real-time subscription
  useEffect(() => {
    fetchDiscussions()

    // Set up real-time subscription for new discussions
    const supabase = createClient()

    // Skip real-time if Supabase is not configured
    if (!supabase) {
      return
    }

    // Subscribe to new discussions for this course/lesson
    const channel = supabase
      .channel(`discussions:${courseId}${lessonId ? `:${lessonId}` : ''}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'discussions',
          filter: lessonId
            ? `course_id=eq.${courseId},lesson_id=eq.${lessonId}`
            : `course_id=eq.${courseId}`,
        },
        async (payload) => {
          // Fetch the full discussion with user data
          const { data: newDiscussion } = await supabase
            .from('discussions')
            .select(`
              id, title, content, is_pinned, is_resolved, created_at,
              user:users!discussions_user_id_fkey (id, full_name, avatar_url)
            `)
            .eq('id', payload.new.id)
            .single()

          if (newDiscussion) {
            const formatted: Discussion = {
              id: newDiscussion.id,
              title: newDiscussion.title,
              content: newDiscussion.content,
              is_pinned: newDiscussion.is_pinned,
              is_resolved: newDiscussion.is_resolved,
              view_count: 0,
              created_at: newDiscussion.created_at,
              user: Array.isArray(newDiscussion.user)
                ? newDiscussion.user[0] as Discussion['user']
                : newDiscussion.user as Discussion['user'],
              replies: [{ count: 0 }],
            }

            setDiscussions(prev => {
              // Don't add if already exists (from optimistic update)
              if (prev.some(d => d.id === formatted.id)) return prev
              return [formatted, ...prev]
            })
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'discussions',
        },
        (payload) => {
          // Update discussion in state when it's resolved/pinned
          setDiscussions(prev =>
            prev.map(d =>
              d.id === payload.new.id
                ? { ...d, is_pinned: payload.new.is_pinned, is_resolved: payload.new.is_resolved }
                : d
            )
          )
        }
      )
      .subscribe((status) => {
        setIsRealtime(status === 'SUBSCRIBED')
      })

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel)
    }
  }, [courseId, lessonId, fetchDiscussions])

  const handleCreateDiscussion = async () => {
    if (!newTitle.trim() || !newContent.trim()) return

    try {
      setCreating(true)
      const response = await fetch('/api/discussions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId,
          lessonId: lessonId || null,
          title: newTitle,
          content: newContent,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create discussion')
      }

      // Add new discussion to list
      setDiscussions(prev => [data.discussion, ...prev])
      setNewTitle('')
      setNewContent('')
      setIsCreateOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create discussion')
    } finally {
      setCreating(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getReplyCount = (discussion: Discussion) => {
    return discussion.replies?.[0]?.count || 0
  }

  // Loading state
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Discussion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    )
  }

  // Error state
  if (error) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Discussion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button variant="outline" onClick={fetchDiscussions}>
              Try again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <CardTitle>Discussion</CardTitle>
          {isRealtime && (
            <Badge variant="outline" className="text-xs text-emerald-600 border-emerald-300">
              <Wifi className="h-3 w-3 mr-1" />
              Live
            </Badge>
          )}
        </div>
        {isAuthenticated ? (
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                New Discussion
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Start a Discussion</DialogTitle>
                <DialogDescription>
                  Ask a question or share your thoughts about this lesson
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Title
                  </label>
                  <Input
                    id="title"
                    placeholder="What's your question about?"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="content" className="text-sm font-medium">
                    Details
                  </label>
                  <Textarea
                    id="content"
                    placeholder="Provide more context or details..."
                    rows={4}
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateOpen(false)}
                  disabled={creating}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateDiscussion}
                  disabled={creating || !newTitle.trim() || !newContent.trim()}
                >
                  {creating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Post Discussion'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ) : (
          <Link href="/auth/login">
            <Button size="sm" variant="outline">
              Sign in to discuss
            </Button>
          </Link>
        )}
      </CardHeader>
      <CardContent>
        {discussions.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
            <h3 className="font-medium mb-1">No discussions yet</h3>
            <p className="text-sm text-muted-foreground">
              Be the first to start a discussion about this lesson
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {discussions.map((discussion) => (
              <div
                key={discussion.id}
                className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer group"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={discussion.user.avatar_url || undefined} />
                  <AvatarFallback className="text-xs">
                    {getInitials(discussion.user.full_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {discussion.is_pinned && (
                      <Pin className="h-3 w-3 text-primary" />
                    )}
                    <h4 className="font-medium text-sm truncate">
                      {discussion.title}
                    </h4>
                    {discussion.is_resolved && (
                      <Badge variant="secondary" className="text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Resolved
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {discussion.content}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span>{discussion.user.full_name}</span>
                    <span>•</span>
                    <span>
                      {formatDistanceToNow(new Date(discussion.created_at), {
                        addSuffix: true,
                      })}
                    </span>
                    <span>•</span>
                    <span>{getReplyCount(discussion)} replies</span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
