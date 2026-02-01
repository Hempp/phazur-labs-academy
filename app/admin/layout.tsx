'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/use-auth'
import { courses, students, activities } from '@/lib/data/store'
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Video,
  FileQuestion,
  ClipboardList,
  BarChart3,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Shield,
  DollarSign,
  MessageSquare,
  Mail,
  Globe,
  Lock,
  Database,
  Zap,
  HelpCircle,
  UserCog,
  Building2,
  Layers,
  Brain,
  FileText,
  ExternalLink,
  Plus,
  Upload,
  UserPlus,
  Calendar,
  Send
} from 'lucide-react'

// Search result types
interface SearchResult {
  id: string
  title: string
  subtitle: string
  href: string
  category: 'student' | 'course' | 'content'
  icon: typeof Users
}

// Mock notifications
const mockNotifications = [
  { id: '1', title: 'New student enrolled', message: 'John Doe enrolled in AI Fundamentals', time: '5 min ago', unread: true },
  { id: '2', title: 'Course completed', message: 'Sarah Chen completed Machine Learning Basics', time: '1 hour ago', unread: true },
  { id: '3', title: 'Payment received', message: '$299 payment for Pro subscription', time: '2 hours ago', unread: false },
  { id: '4', title: 'New review', message: '5-star review on Python Mastery course', time: '3 hours ago', unread: false },
  { id: '5', title: 'System update', message: 'Platform maintenance scheduled for tonight', time: '5 hours ago', unread: false },
]

const sidebarNavigation = [
  {
    title: 'Overview',
    items: [
      { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
      { name: 'Revenue', href: '/admin/revenue', icon: DollarSign },
    ]
  },
  {
    title: 'Users',
    items: [
      { name: 'Students', href: '/admin/students', icon: Users },
      { name: 'Instructors', href: '/admin/instructors', icon: GraduationCap },
      { name: 'Admins', href: '/admin/admins', icon: UserCog },
    ]
  },
  {
    title: 'Content',
    items: [
      { name: 'Content Manager', href: '/admin/content', icon: Layers },
      { name: 'Course Creator', href: '/admin/course-creator', icon: Brain },
      { name: 'Courses', href: '/admin/courses', icon: BookOpen },
      { name: 'Videos', href: '/admin/videos', icon: Video },
      { name: 'Quizzes', href: '/admin/quizzes', icon: FileQuestion },
      { name: 'Assignments', href: '/admin/assignments', icon: ClipboardList },
    ]
  },
  {
    title: 'Engagement',
    items: [
      { name: 'Discussions', href: '/admin/discussions', icon: MessageSquare },
      { name: 'Notifications', href: '/admin/notifications', icon: Bell },
      { name: 'Email Campaigns', href: '/admin/emails', icon: Mail },
    ]
  },
  {
    title: 'Settings',
    items: [
      { name: 'General', href: '/admin/settings', icon: Settings },
      { name: 'Security', href: '/admin/settings/security', icon: Shield },
      { name: 'Content Protection', href: '/admin/settings/protection', icon: Lock },
      { name: 'Integrations', href: '/admin/settings/integrations', icon: Zap },
    ]
  },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [quickActionsOpen, setQuickActionsOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState(mockNotifications)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null)
  const quickActionsRef = useRef<HTMLDivElement>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const router = useRouter()
  const { profile, isLoading, isAuthenticated, signOut } = useAuth()

  // Search functionality
  const performSearch = useCallback((query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    const q = query.toLowerCase()
    const results: SearchResult[] = []

    // Search students
    students.filter(s =>
      s.full_name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q)
    ).slice(0, 3).forEach(s => {
      results.push({
        id: s.id,
        title: s.full_name,
        subtitle: s.email,
        href: `/admin/students?search=${encodeURIComponent(s.full_name)}`,
        category: 'student',
        icon: Users
      })
    })

    // Search courses
    courses.filter(c =>
      c.title.toLowerCase().includes(q) ||
      c.instructor.full_name.toLowerCase().includes(q)
    ).slice(0, 3).forEach(c => {
      results.push({
        id: c.id,
        title: c.title,
        subtitle: `by ${c.instructor.full_name}`,
        href: `/admin/courses?search=${encodeURIComponent(c.title)}`,
        category: 'course',
        icon: BookOpen
      })
    })

    // Search content (from activities as proxy for content)
    activities.filter(a =>
      a.message.toLowerCase().includes(q) ||
      a.type.toLowerCase().includes(q)
    ).slice(0, 3).forEach(a => {
      results.push({
        id: a.id,
        title: a.message,
        subtitle: a.type.replace(/_/g, ' '),
        href: `/admin/content`,
        category: 'content',
        icon: FileText
      })
    })

    setSearchResults(results)
    setSelectedIndex(0)
  }, [])

  // Keyboard shortcut for search (⌘K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
        setTimeout(() => searchInputRef.current?.focus(), 100)
      }
      if (e.key === 'Escape') {
        setSearchOpen(false)
        setQuickActionsOpen(false)
        setNotificationsOpen(false)
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Handle search keyboard navigation
  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(i => Math.min(i + 1, searchResults.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && searchResults[selectedIndex]) {
      e.preventDefault()
      router.push(searchResults[selectedIndex].href)
      setSearchOpen(false)
      setSearchQuery('')
      setSearchResults([])
    }
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setSearchOpen(false)
      }
      if (quickActionsRef.current && !quickActionsRef.current.contains(e.target as Node)) {
        setQuickActionsOpen(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n =>
      n.id === id ? { ...n, unread: false } : n
    ))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })))
  }

  const unreadCount = notifications.filter(n => n.unread).length

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login?redirect=' + encodeURIComponent(pathname))
    }
  }, [isLoading, isAuthenticated, router, pathname])

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    )
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return null
  }

  // Check for admin role
  if (profile?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md p-8">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You don&apos;t have permission to access the admin portal. This area is restricted to administrators only.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => signOut()}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-700">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg">Admin Portal</span>
              <p className="text-xs text-muted-foreground">Course Training</p>
            </div>
          </Link>
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-6 h-[calc(100vh-4rem)] overflow-y-auto scrollbar-thin">
          {sidebarNavigation.map((section) => (
            <div key={section.title}>
              <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                {section.title}
              </h3>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href ||
                    (item.href !== '/admin' && pathname.startsWith(item.href))
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                          isActive
                            ? 'bg-primary/10 text-primary'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <item.icon className={`h-5 w-5 ${isActive ? 'text-primary' : ''}`} />
                        {item.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}

          {/* Help Card */}
          <div className="p-4 bg-gradient-to-br from-primary/10 to-violet-500/10 rounded-xl border border-primary/20">
            <HelpCircle className="h-8 w-8 text-primary mb-3" />
            <h4 className="font-semibold mb-1">Need Help?</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Check our documentation or contact support.
            </p>
            <button
              onClick={() => window.open('https://docs.coursetraining.com', '_blank')}
              className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            >
              View Docs
              <ExternalLink className="h-3 w-3" />
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
          <div className="h-full px-4 lg:px-8 flex items-center justify-between">
            {/* Left side */}
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </button>

              {/* Search */}
              <div ref={searchContainerRef} className="hidden md:block relative">
                <div
                  className={`flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg w-80 cursor-text ${
                    searchOpen ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => {
                    setSearchOpen(true)
                    setTimeout(() => searchInputRef.current?.focus(), 100)
                  }}
                >
                  <Search className="h-4 w-4 text-gray-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search students, courses, content..."
                    className="bg-transparent border-none outline-none text-sm w-full placeholder:text-gray-400"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      performSearch(e.target.value)
                    }}
                    onFocus={() => setSearchOpen(true)}
                    onKeyDown={handleSearchKeyDown}
                  />
                  <kbd className="hidden lg:inline-flex items-center px-2 py-0.5 text-xs bg-white dark:bg-gray-600 rounded border">
                    ⌘K
                  </kbd>
                </div>

                {/* Search Results Dropdown */}
                {searchOpen && (searchResults.length > 0 || searchQuery) && (
                  <div className="absolute top-full left-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                    {searchResults.length > 0 ? (
                      <>
                        {/* Students */}
                        {searchResults.filter(r => r.category === 'student').length > 0 && (
                          <div>
                            <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900 text-xs font-semibold text-gray-500 uppercase">
                              Students
                            </div>
                            {searchResults.filter(r => r.category === 'student').map((result, idx) => {
                              const globalIdx = searchResults.findIndex(r => r.id === result.id)
                              return (
                                <Link
                                  key={result.id}
                                  href={result.href}
                                  onClick={() => {
                                    setSearchOpen(false)
                                    setSearchQuery('')
                                    setSearchResults([])
                                  }}
                                  className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                                    selectedIndex === globalIdx ? 'bg-primary/10' : ''
                                  }`}
                                >
                                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                    <Users className="h-4 w-4 text-blue-600" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{result.title}</p>
                                    <p className="text-xs text-gray-500 truncate">{result.subtitle}</p>
                                  </div>
                                </Link>
                              )
                            })}
                          </div>
                        )}

                        {/* Courses */}
                        {searchResults.filter(r => r.category === 'course').length > 0 && (
                          <div>
                            <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900 text-xs font-semibold text-gray-500 uppercase">
                              Courses
                            </div>
                            {searchResults.filter(r => r.category === 'course').map((result, idx) => {
                              const globalIdx = searchResults.findIndex(r => r.id === result.id)
                              return (
                                <Link
                                  key={result.id}
                                  href={result.href}
                                  onClick={() => {
                                    setSearchOpen(false)
                                    setSearchQuery('')
                                    setSearchResults([])
                                  }}
                                  className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                                    selectedIndex === globalIdx ? 'bg-primary/10' : ''
                                  }`}
                                >
                                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                    <BookOpen className="h-4 w-4 text-green-600" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{result.title}</p>
                                    <p className="text-xs text-gray-500 truncate">{result.subtitle}</p>
                                  </div>
                                </Link>
                              )
                            })}
                          </div>
                        )}

                        {/* Content */}
                        {searchResults.filter(r => r.category === 'content').length > 0 && (
                          <div>
                            <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900 text-xs font-semibold text-gray-500 uppercase">
                              Content
                            </div>
                            {searchResults.filter(r => r.category === 'content').map((result, idx) => {
                              const globalIdx = searchResults.findIndex(r => r.id === result.id)
                              return (
                                <Link
                                  key={result.id}
                                  href={result.href}
                                  onClick={() => {
                                    setSearchOpen(false)
                                    setSearchQuery('')
                                    setSearchResults([])
                                  }}
                                  className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                                    selectedIndex === globalIdx ? 'bg-primary/10' : ''
                                  }`}
                                >
                                  <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                    <FileText className="h-4 w-4 text-purple-600" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{result.title}</p>
                                    <p className="text-xs text-gray-500 truncate">{result.subtitle}</p>
                                  </div>
                                </Link>
                              )
                            })}
                          </div>
                        )}

                        {/* Keyboard hint */}
                        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900 text-xs text-gray-400 flex items-center gap-4">
                          <span><kbd className="px-1 py-0.5 bg-white dark:bg-gray-700 rounded text-xs">↑↓</kbd> Navigate</span>
                          <span><kbd className="px-1 py-0.5 bg-white dark:bg-gray-700 rounded text-xs">↵</kbd> Select</span>
                          <span><kbd className="px-1 py-0.5 bg-white dark:bg-gray-700 rounded text-xs">Esc</kbd> Close</span>
                        </div>
                      </>
                    ) : searchQuery ? (
                      <div className="p-8 text-center">
                        <Search className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">No results for &quot;{searchQuery}&quot;</p>
                        <p className="text-xs text-gray-400 mt-1">Try a different search term</p>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* Quick Actions */}
              <div ref={quickActionsRef} className="relative hidden md:block">
                <button
                  onClick={() => setQuickActionsOpen(!quickActionsOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  <Zap className="h-4 w-4" />
                  Quick Actions
                  <ChevronDown className={`h-4 w-4 transition-transform ${quickActionsOpen ? 'rotate-180' : ''}`} />
                </button>

                {quickActionsOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                    <Link
                      href="/admin/courses/create"
                      onClick={() => setQuickActionsOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Plus className="h-4 w-4 text-primary" />
                      Create Course
                    </Link>
                    <Link
                      href="/admin/videos/upload"
                      onClick={() => setQuickActionsOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Upload className="h-4 w-4 text-green-600" />
                      Upload Video
                    </Link>
                    <Link
                      href="/admin/students/invite"
                      onClick={() => setQuickActionsOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <UserPlus className="h-4 w-4 text-blue-600" />
                      Add Student
                    </Link>
                    <hr className="my-2 border-gray-200 dark:border-gray-700" />
                    <Link
                      href="/admin/live-training"
                      onClick={() => setQuickActionsOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Calendar className="h-4 w-4 text-purple-600" />
                      Schedule Live Session
                    </Link>
                    <Link
                      href="/admin/notifications"
                      onClick={() => setQuickActionsOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Send className="h-4 w-4 text-orange-600" />
                      Send Notification
                    </Link>
                  </div>
                )}
              </div>

              {/* Notifications */}
              <div ref={notificationsRef} className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                      <h3 className="font-semibold">Notifications</h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-primary hover:underline"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          onClick={() => markAsRead(notification.id)}
                          className={`px-4 py-3 border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer ${
                            notification.unread ? 'bg-primary/5' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {notification.unread && (
                              <span className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                            )}
                            <div className={notification.unread ? '' : 'ml-5'}>
                              <p className="text-sm font-medium">{notification.title}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{notification.message}</p>
                              <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                      <Link
                        href="/admin/notifications"
                        onClick={() => setNotificationsOpen(false)}
                        className="text-sm text-primary hover:underline flex items-center justify-center gap-1"
                      >
                        View All Notifications
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div className="relative">
                <button
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center">
                    <span className="text-sm font-semibold text-white">
                      {profile?.full_name?.charAt(0) || profile?.email?.charAt(0) || 'A'}
                    </span>
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium">{profile?.full_name || 'Admin'}</p>
                    <p className="text-xs text-muted-foreground capitalize">{profile?.role || 'Admin'}</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400 hidden md:block" />
                </button>

                {/* Dropdown */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                    <Link
                      href="/admin/profile"
                      className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <UserCog className="h-4 w-4" />
                      Profile Settings
                    </Link>
                    <Link
                      href="/admin/settings"
                      className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Settings className="h-4 w-4" />
                      Admin Settings
                    </Link>
                    <hr className="my-2 border-gray-200 dark:border-gray-700" />
                    <button
                      onClick={() => signOut()}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-full"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
