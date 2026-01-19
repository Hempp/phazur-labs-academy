'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { UserAvatar } from '@/components/ui/avatar'

// Mock data
const courseInfo = {
  title: 'Advanced React & Next.js Masterclass',
  slug: 'advanced-react',
}

const discussions = [
  {
    id: '1',
    title: 'Best practices for handling authentication in Next.js 14 App Router?',
    author: {
      name: 'Alex Thompson',
      avatar: '/avatars/alex.jpg',
      role: 'student',
      certified: true,
    },
    createdAt: '2 hours ago',
    lastActivity: '15 minutes ago',
    replies: 12,
    views: 156,
    likes: 23,
    isPinned: true,
    isResolved: true,
    tags: ['authentication', 'app-router', 'best-practices'],
    preview: 'I\'m working on implementing authentication in my Next.js 14 project using the App Router. What\'s the recommended approach for...',
    lesson: {
      id: 'lesson-8',
      title: 'Authentication Patterns',
    },
  },
  {
    id: '2',
    title: 'Error: "Hydration failed because the initial UI does not match" - Help!',
    author: {
      name: 'Maria Garcia',
      avatar: '/avatars/maria.jpg',
      role: 'student',
      certified: false,
    },
    createdAt: '5 hours ago',
    lastActivity: '1 hour ago',
    replies: 8,
    views: 89,
    likes: 5,
    isPinned: false,
    isResolved: false,
    tags: ['hydration', 'error', 'troubleshooting'],
    preview: 'Getting this hydration error when using useState with a value that depends on browser APIs. The component works fine but...',
    lesson: {
      id: 'lesson-3',
      title: 'Server vs Client Components',
    },
  },
  {
    id: '3',
    title: 'How to optimize images in Next.js for best Core Web Vitals?',
    author: {
      name: 'James Wilson',
      avatar: '/avatars/james.jpg',
      role: 'student',
      certified: true,
    },
    createdAt: '1 day ago',
    lastActivity: '3 hours ago',
    replies: 15,
    views: 234,
    likes: 31,
    isPinned: false,
    isResolved: true,
    tags: ['performance', 'images', 'web-vitals'],
    preview: 'I\'ve been trying to optimize my Next.js app for better LCP scores. The Image component helps but I\'m still seeing...',
    lesson: null,
  },
  {
    id: '4',
    title: 'Sharing my project: Full-stack e-commerce with Next.js 14',
    author: {
      name: 'Sarah Chen',
      avatar: '/avatars/sarah.jpg',
      role: 'instructor',
      certified: true,
    },
    createdAt: '2 days ago',
    lastActivity: '6 hours ago',
    replies: 28,
    views: 512,
    likes: 89,
    isPinned: true,
    isResolved: false,
    tags: ['showcase', 'project', 'e-commerce'],
    preview: 'After completing the course, I built a complete e-commerce platform. Check out the repo and let me know what you think!',
    lesson: null,
  },
  {
    id: '5',
    title: 'Understanding Server Actions vs API Routes - When to use which?',
    author: {
      name: 'David Kim',
      avatar: '/avatars/david.jpg',
      role: 'student',
      certified: false,
    },
    createdAt: '3 days ago',
    lastActivity: '1 day ago',
    replies: 19,
    views: 342,
    likes: 45,
    isPinned: false,
    isResolved: true,
    tags: ['server-actions', 'api-routes', 'architecture'],
    preview: 'The course covers both Server Actions and API Routes, but I\'m still confused about when to use each. Can someone explain...',
    lesson: {
      id: 'lesson-12',
      title: 'Data Mutations with Server Actions',
    },
  },
]

const popularTags = [
  { name: 'authentication', count: 45 },
  { name: 'server-components', count: 38 },
  { name: 'app-router', count: 32 },
  { name: 'performance', count: 28 },
  { name: 'typescript', count: 25 },
  { name: 'api-routes', count: 22 },
  { name: 'deployment', count: 18 },
  { name: 'database', count: 15 },
]

export default function DiscussionsPage() {
  const params = useParams()
  const [filter, setFilter] = useState<'all' | 'unanswered' | 'resolved' | 'popular'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showNewPostModal, setShowNewPostModal] = useState(false)

  const filteredDiscussions = discussions.filter(d => {
    if (filter === 'unanswered') return !d.isResolved && d.replies === 0
    if (filter === 'resolved') return d.isResolved
    if (filter === 'popular') return d.likes > 20
    return true
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Course Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Link href="/courses" className="hover:text-primary-600">Courses</Link>
            <span>/</span>
            <Link href={`/courses/${params.slug}`} className="hover:text-primary-600">{courseInfo.title}</Link>
            <span>/</span>
            <span className="text-gray-900">Discussions</span>
          </nav>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Course Discussions</h1>
              <p className="text-gray-600">Ask questions, share knowledge, and connect with fellow learners</p>
            </div>
            <button
              onClick={() => setShowNewPostModal(true)}
              className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Discussion
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search and Filters */}
            <Card className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search discussions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'unanswered', label: 'Unanswered' },
                    { id: 'resolved', label: 'Resolved' },
                    { id: 'popular', label: 'Popular' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setFilter(tab.id as any)}
                      className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                        filter === tab.id
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Discussions List */}
            <div className="space-y-4">
              {filteredDiscussions.map((discussion) => (
                <Card
                  key={discussion.id}
                  className={`p-5 hover:shadow-md transition-shadow ${
                    discussion.isPinned ? 'border-l-4 border-l-primary-500' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Author Avatar */}
                    <UserAvatar
                      user={{ name: discussion.author.name, avatar_url: discussion.author.avatar }}
                      size="md"
                    />

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          {/* Badges */}
                          <div className="flex items-center gap-2 mb-1">
                            {discussion.isPinned && (
                              <Badge variant="primary" className="text-xs">
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" />
                                </svg>
                                Pinned
                              </Badge>
                            )}
                            {discussion.isResolved && (
                              <Badge variant="success" className="text-xs">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Resolved
                              </Badge>
                            )}
                            {discussion.author.role === 'instructor' && (
                              <Badge variant="warning" className="text-xs">Instructor</Badge>
                            )}
                          </div>

                          {/* Title */}
                          <Link
                            href={`/courses/${params.slug}/discussions/${discussion.id}`}
                            className="text-lg font-semibold text-gray-900 hover:text-primary-600 line-clamp-2"
                          >
                            {discussion.title}
                          </Link>
                        </div>
                      </div>

                      {/* Preview */}
                      <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                        {discussion.preview}
                      </p>

                      {/* Meta */}
                      <div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
                        {/* Author */}
                        <span className="text-gray-600">
                          by{' '}
                          <span className="font-medium text-gray-900">
                            {discussion.author.name}
                          </span>
                          {discussion.author.certified && (
                            <svg className="inline w-4 h-4 ml-1 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          )}
                        </span>

                        <span className="text-gray-400">•</span>
                        <span className="text-gray-500">{discussion.createdAt}</span>

                        {discussion.lesson && (
                          <>
                            <span className="text-gray-400">•</span>
                            <Link
                              href={`/courses/${params.slug}/learn?lesson=${discussion.lesson.id}`}
                              className="text-primary-600 hover:text-primary-700"
                            >
                              {discussion.lesson.title}
                            </Link>
                          </>
                        )}
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {discussion.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full hover:bg-gray-200 cursor-pointer"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-col items-end gap-2 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {discussion.replies}
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        {discussion.likes}
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {discussion.views}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 pt-4">
              <button className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50" disabled>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              {[1, 2, 3, 4, 5].map((page) => (
                <button
                  key={page}
                  className={`w-10 h-10 rounded-lg font-medium ${
                    page === 1
                      ? 'bg-primary-600 text-white'
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button className="p-2 rounded-lg hover:bg-gray-100">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Community Stats */}
            <Card className="p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Community Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-primary-600">1,234</p>
                  <p className="text-sm text-gray-500">Discussions</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">89%</p>
                  <p className="text-sm text-gray-500">Resolved</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">5,678</p>
                  <p className="text-sm text-gray-500">Members</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-amber-600">2.4h</p>
                  <p className="text-sm text-gray-500">Avg Response</p>
                </div>
              </div>
            </Card>

            {/* Popular Tags */}
            <Card className="p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <button
                    key={tag.name}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1"
                  >
                    #{tag.name}
                    <span className="text-xs text-gray-500">({tag.count})</span>
                  </button>
                ))}
              </div>
            </Card>

            {/* Top Contributors */}
            <Card className="p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Top Contributors</h3>
              <div className="space-y-3">
                {[
                  { name: 'Sarah Chen', avatar: '/avatars/sarah.jpg', points: 1250, role: 'instructor' },
                  { name: 'Alex Thompson', avatar: '/avatars/alex.jpg', points: 890, role: 'student' },
                  { name: 'James Wilson', avatar: '/avatars/james.jpg', points: 756, role: 'student' },
                  { name: 'Maria Garcia', avatar: '/avatars/maria.jpg', points: 642, role: 'student' },
                  { name: 'David Kim', avatar: '/avatars/david.jpg', points: 598, role: 'student' },
                ].map((user, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-400 w-4">{i + 1}</span>
                    <UserAvatar user={{ name: user.name, avatar_url: user.avatar }} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">
                        {user.name}
                        {user.role === 'instructor' && (
                          <span className="ml-1 text-xs text-amber-600">(Instructor)</span>
                        )}
                      </p>
                    </div>
                    <span className="text-sm text-primary-600 font-medium">{user.points}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Guidelines */}
            <Card className="p-5 bg-blue-50 border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">Community Guidelines</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Be respectful and constructive</li>
                <li>• Search before posting</li>
                <li>• Use clear, descriptive titles</li>
                <li>• Mark resolved questions</li>
                <li>• Share code with proper formatting</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>

      {/* New Post Modal */}
      {showNewPostModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Start a Discussion</h2>
                <button
                  onClick={() => setShowNewPostModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  placeholder="What's your question or topic?"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Related Lesson (optional)</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="">Select a lesson</option>
                  <option value="1">1. Introduction to React 18</option>
                  <option value="2">2. Setting Up Your Environment</option>
                  <option value="3">3. Server vs Client Components</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  rows={8}
                  placeholder="Describe your question or share your thoughts..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                <input
                  type="text"
                  placeholder="Add tags separated by commas"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setShowNewPostModal(false)}
                className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors">
                Post Discussion
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
