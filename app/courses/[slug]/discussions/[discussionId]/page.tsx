'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { UserAvatar } from '@/components/ui/avatar'

// Mock data
const discussion = {
  id: '1',
  title: 'Best practices for handling authentication in Next.js 14 App Router?',
  content: `I'm working on implementing authentication in my Next.js 14 project using the App Router. I've been following the course but I want to make sure I'm following best practices.

**My current setup:**
- Using Supabase for authentication
- Storing the session in cookies
- Using middleware for protected routes

**My questions:**
1. Should I use server-side session validation on every request, or is client-side validation sufficient?
2. How do I handle token refresh in the App Router?
3. What's the best way to protect API routes?

Here's my current middleware code:

\`\`\`typescript
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const { data: { session } } = await supabase.auth.getSession()

  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return res
}
\`\`\`

Any suggestions for improvements would be greatly appreciated!`,
  author: {
    id: 'user-1',
    name: 'Alex Thompson',
    avatar: '/avatars/alex.jpg',
    role: 'student',
    certified: true,
    coursesCompleted: 5,
    joinDate: 'March 2023',
  },
  createdAt: '2 hours ago',
  editedAt: null,
  likes: 23,
  views: 156,
  isLiked: false,
  isBookmarked: false,
  isResolved: true,
  isPinned: true,
  tags: ['authentication', 'app-router', 'best-practices'],
  lesson: {
    id: 'lesson-8',
    title: 'Authentication Patterns',
  },
}

const replies = [
  {
    id: 'reply-1',
    content: `Great question! Here's my take on your three questions:

**1. Server-side vs Client-side validation:**
Always validate on the server. Client-side validation is for UX, but security must be enforced server-side. In the App Router, you can validate in:
- Middleware (like you're doing)
- Server Components
- API Routes / Server Actions

**2. Token refresh:**
Supabase handles this automatically if you're using \`createMiddlewareClient\`. The auth helper refreshes tokens before they expire. Make sure you're setting the proper cookie options.

**3. Protecting API routes:**
For API routes, create a helper function:

\`\`\`typescript
// lib/auth.ts
export async function getServerSession() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

// app/api/protected/route.ts
export async function GET() {
  const session = await getServerSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  // ... rest of your code
}
\`\`\`

Hope this helps!`,
    author: {
      id: 'user-2',
      name: 'Sarah Chen',
      avatar: '/avatars/sarah.jpg',
      role: 'instructor',
      certified: true,
    },
    createdAt: '1 hour 45 minutes ago',
    likes: 15,
    isLiked: true,
    isAccepted: true,
  },
  {
    id: 'reply-2',
    content: `Adding to what Sarah said, I'd also recommend looking at the new \`auth.js\` library (formerly NextAuth) which has first-class support for the App Router.

One thing to be careful about - don't store sensitive data in the JWT payload. Use the session token to look up user data from your database when needed.

Also, for the middleware, you might want to add error handling:

\`\`\`typescript
try {
  const { data: { session } } = await supabase.auth.getSession()
  // ... rest of your code
} catch (error) {
  console.error('Auth error:', error)
  return NextResponse.redirect(new URL('/login', req.url))
}
\`\`\``,
    author: {
      id: 'user-3',
      name: 'James Wilson',
      avatar: '/avatars/james.jpg',
      role: 'student',
      certified: true,
    },
    createdAt: '1 hour 30 minutes ago',
    likes: 8,
    isLiked: false,
    isAccepted: false,
  },
  {
    id: 'reply-3',
    content: `I had the same question last week and the course section on "Securing Your Application" really helped me understand the full picture. Especially the part about using Server Components for data fetching - it eliminates so many potential security issues.

@Alex - your middleware looks good! One small suggestion: you might want to also protect your API routes in middleware rather than doing it route-by-route. You can check \`req.nextUrl.pathname.startsWith('/api/')\` and apply the same logic.`,
    author: {
      id: 'user-4',
      name: 'Maria Garcia',
      avatar: '/avatars/maria.jpg',
      role: 'student',
      certified: false,
    },
    createdAt: '45 minutes ago',
    likes: 4,
    isLiked: false,
    isAccepted: false,
  },
]

export default function DiscussionDetailPage() {
  const params = useParams()
  const [replyContent, setReplyContent] = useState('')
  const [isLiked, setIsLiked] = useState(discussion.isLiked)
  const [isBookmarked, setIsBookmarked] = useState(discussion.isBookmarked)
  const [likes, setLikes] = useState(discussion.likes)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikes(isLiked ? likes - 1 : likes + 1)
  }

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyContent.trim()) return
    console.log('Submitting reply:', replyContent)
    setReplyContent('')
    alert('Reply posted!')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Link href="/courses" className="hover:text-primary-600">Courses</Link>
            <span>/</span>
            <Link href={`/courses/${params.slug}`} className="hover:text-primary-600">Advanced React</Link>
            <span>/</span>
            <Link href={`/courses/${params.slug}/discussions`} className="hover:text-primary-600">Discussions</Link>
          </nav>

          {/* Tags & Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {discussion.isPinned && (
              <Badge variant="primary">Pinned</Badge>
            )}
            {discussion.isResolved && (
              <Badge variant="success">Resolved</Badge>
            )}
            {discussion.lesson && (
              <Link
                href={`/courses/${params.slug}/learn?lesson=${discussion.lesson.id}`}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                📚 {discussion.lesson.title}
              </Link>
            )}
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {discussion.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>{discussion.views} views</span>
            <span>•</span>
            <span>{replies.length} replies</span>
            <span>•</span>
            <span>Posted {discussion.createdAt}</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Original Post */}
        <Card className="mb-8">
          <div className="p-6">
            {/* Author */}
            <div className="flex items-start gap-4 mb-4">
              <UserAvatar name={discussion.author.name} src={discussion.author.avatar} size="lg" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">{discussion.author.name}</span>
                  {discussion.author.certified && (
                    <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span className="text-sm text-gray-500">• {discussion.author.coursesCompleted} courses completed</span>
                </div>
                <span className="text-sm text-gray-500">Member since {discussion.author.joinDate}</span>
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-gray max-w-none">
              <div className="whitespace-pre-wrap text-gray-700" dangerouslySetInnerHTML={{
                __html: discussion.content
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm"><code>$2</code></pre>')
                  .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>')
              }} />
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-6">
              {discussion.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                  isLiked
                    ? 'bg-red-100 text-red-600'
                    : 'hover:bg-gray-200 text-gray-600'
                }`}
              >
                <svg className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {likes}
              </button>
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                  isBookmarked
                    ? 'bg-amber-100 text-amber-600'
                    : 'hover:bg-gray-200 text-gray-600'
                }`}
              >
                <svg className="w-5 h-5" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                {isBookmarked ? 'Bookmarked' : 'Bookmark'}
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-200 text-gray-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
              </button>
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-200 text-gray-600 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        </Card>

        {/* Replies */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">{replies.length} Replies</h2>

          {replies.map((reply) => (
            <Card
              key={reply.id}
              className={`${reply.isAccepted ? 'border-2 border-green-500 bg-green-50/50' : ''}`}
            >
              {reply.isAccepted && (
                <div className="px-6 py-2 bg-green-100 border-b border-green-200 flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm font-medium text-green-700">Accepted Answer</span>
                </div>
              )}

              <div className="p-6">
                {/* Author */}
                <div className="flex items-start gap-4 mb-4">
                  <UserAvatar name={reply.author.name} src={reply.author.avatar} size="md" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">{reply.author.name}</span>
                      {reply.author.role === 'instructor' && (
                        <Badge variant="warning" className="text-xs">Instructor</Badge>
                      )}
                      {reply.author.certified && (
                        <svg className="w-4 h-4 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">{reply.createdAt}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="prose prose-gray max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700" dangerouslySetInnerHTML={{
                    __html: reply.content
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm"><code>$2</code></pre>')
                      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>')
                      .replace(/@(\w+)/g, '<span class="text-primary-600 font-medium">@$1</span>')
                  }} />
                </div>
              </div>

              {/* Reply Actions */}
              <div className="px-6 py-3 border-t bg-gray-50/50 flex items-center gap-4">
                <button
                  className={`flex items-center gap-1.5 text-sm ${
                    reply.isLiked ? 'text-red-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <svg className="w-4 h-4" fill={reply.isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {reply.likes}
                </button>
                <button className="text-sm text-gray-500 hover:text-gray-700">Reply</button>
                <button className="text-sm text-gray-500 hover:text-gray-700">Quote</button>
              </div>
            </Card>
          ))}
        </div>

        {/* Reply Form */}
        <Card className="mt-8 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Your Reply</h3>
          <form onSubmit={handleSubmitReply}>
            <textarea
              rows={6}
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Share your thoughts or answer the question..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-500">
                Supports **bold**, `code`, and ```code blocks```
              </p>
              <button
                type="submit"
                disabled={!replyContent.trim()}
                className="px-6 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Post Reply
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
