'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MessageSquare, ThumbsUp, Clock, Search, Filter } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { UserAvatar } from '@/components/ui/avatar'

interface Discussion {
  id: string
  title: string
  content: string
  courseTitle: string
  courseSlug: string
  author: { name: string; avatar?: string }
  createdAt: string
  replies: number
  likes: number
  isResolved: boolean
}

export default function DiscussionsPage() {
  const [discussions] = useState<Discussion[]>([
    {
      id: '1',
      title: 'How to handle rate limits in AI APIs?',
      content: 'I\'m building an application that makes multiple API calls and hitting rate limits. What are the best practices?',
      courseTitle: 'AI Foundations & Tool Mastery',
      courseSlug: 'ai-foundations',
      author: { name: 'Alex Johnson' },
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      replies: 5,
      likes: 12,
      isResolved: true,
    },
    {
      id: '2',
      title: 'Agent memory patterns - which to use?',
      content: 'The course mentions different memory patterns. When should I use each one in production?',
      courseTitle: 'Building AI Agents',
      courseSlug: 'ai-agents',
      author: { name: 'Sarah Chen' },
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      replies: 3,
      likes: 8,
      isResolved: false,
    },
  ])

  const [filter, setFilter] = useState<'all' | 'my' | 'resolved'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredDiscussions = discussions.filter(d => {
    if (filter === 'resolved') return d.isResolved
    return d.title.toLowerCase().includes(searchQuery.toLowerCase())
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Discussions</h1>
        <p className="text-muted-foreground">Connect with other learners and get help</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search discussions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'my', 'resolved'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${filter === f ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Discussions List */}
      <div className="space-y-4">
        {filteredDiscussions.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No discussions found</h3>
              <p className="text-muted-foreground text-center">
                Start a discussion in any course to get help from the community
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredDiscussions.map(discussion => (
            <Card key={discussion.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <UserAvatar name={discussion.author.name} className="h-10 w-10" />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <Link
                          href={`/courses/${discussion.courseSlug}/discussions/${discussion.id}`}
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {discussion.title}
                        </Link>
                        {discussion.isResolved && (
                          <Badge variant="outline" className="ml-2 text-green-600">
                            Resolved
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {discussion.content}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3.5 w-3.5" />
                        {discussion.replies} replies
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="h-3.5 w-3.5" />
                        {discussion.likes}
                      </span>
                      <span>in {discussion.courseTitle}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
