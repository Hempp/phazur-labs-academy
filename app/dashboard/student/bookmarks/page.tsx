'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Bookmark, BookOpen, Clock, Play, Trash2, Search, Filter } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface BookmarkedLesson {
  id: string
  title: string
  courseTitle: string
  courseSlug: string
  moduleTitle: string
  duration: number
  bookmarkedAt: string
  progress: number
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkedLesson[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    // Mock data - would fetch from API
    setBookmarks([
      {
        id: '1',
        title: 'Introduction to AI Agents',
        courseTitle: 'Building AI Agents',
        courseSlug: 'ai-agents',
        moduleTitle: 'Agent Architecture',
        duration: 12,
        bookmarkedAt: new Date().toISOString(),
        progress: 45,
      },
      {
        id: '2',
        title: 'MCP Server Fundamentals',
        courseTitle: 'MCP Development',
        courseSlug: 'mcp-development',
        moduleTitle: 'MCP Fundamentals',
        duration: 15,
        bookmarkedAt: new Date().toISOString(),
        progress: 0,
      },
    ])
    setIsLoading(false)
  }, [])

  const filteredBookmarks = bookmarks.filter(b =>
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.courseTitle.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const removeBookmark = (id: string) => {
    setBookmarks(prev => prev.filter(b => b.id !== id))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Bookmarks</h1>
          <p className="text-muted-foreground">Your saved lessons for quick access</p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {bookmarks.length} saved
        </Badge>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search bookmarks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background"
        />
      </div>

      {/* Bookmarks List */}
      {filteredBookmarks.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bookmark className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No bookmarks yet</h3>
            <p className="text-muted-foreground text-center">
              Save lessons while learning to access them quickly later
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredBookmarks.map((bookmark) => (
            <Card key={bookmark.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Link
                      href={`/courses/${bookmark.courseSlug}/learn?lesson=${bookmark.id}`}
                      className="font-medium hover:text-primary transition-colors"
                    >
                      {bookmark.title}
                    </Link>
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                      <BookOpen className="h-3.5 w-3.5" />
                      <span>{bookmark.courseTitle}</span>
                      <span>·</span>
                      <span>{bookmark.moduleTitle}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {bookmark.duration} min
                      </span>
                      {bookmark.progress > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {bookmark.progress}% complete
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/courses/${bookmark.courseSlug}/learn?lesson=${bookmark.id}`}
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                      <Play className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => removeBookmark(bookmark.id)}
                      className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
