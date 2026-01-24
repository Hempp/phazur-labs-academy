'use client'

import { useState, useEffect } from 'react'
import { MessageSquare, Plus, ChevronRight, CheckCircle, Pin, Loader2 } from 'lucide-react'
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

  useEffect(() => {
    fetchDiscussions()
  }, [courseId, lessonId])

  const fetchDiscussions = async () => {
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
  }

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
        <CardTitle>Discussion</CardTitle>
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
