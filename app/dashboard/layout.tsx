'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  BookOpen,
  Award,
  BarChart3,
  MessageSquare,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
  LogOut,
  User,
  HelpCircle,
  Bookmark,
  Calendar,
  TrendingUp,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/hooks/use-auth'
import { UserAvatar } from '@/components/ui/avatar'

interface SidebarLink {
  href: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  badge?: string | number
}

const studentLinks: SidebarLink[] = [
  { href: '/dashboard/student', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/student/courses', icon: BookOpen, label: 'My Courses' },
  { href: '/dashboard/student/bookmarks', icon: Bookmark, label: 'Bookmarks' },
  { href: '/dashboard/student/calendar', icon: Calendar, label: 'Schedule' },
  { href: '/dashboard/student/certificates', icon: Award, label: 'Certificates' },
  { href: '/dashboard/student/progress', icon: TrendingUp, label: 'Progress' },
  { href: '/dashboard/student/discussions', icon: MessageSquare, label: 'Discussions', badge: 3 },
]

const instructorLinks: SidebarLink[] = [
  { href: '/dashboard/instructor', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/instructor/courses', icon: BookOpen, label: 'My Courses' },
  { href: '/dashboard/instructor/students', icon: User, label: 'Students' },
  { href: '/dashboard/instructor/analytics', icon: BarChart3, label: 'Analytics' },
  { href: '/dashboard/instructor/reviews', icon: MessageSquare, label: 'Reviews' },
  { href: '/dashboard/instructor/earnings', icon: TrendingUp, label: 'Earnings' },
]

const adminLinks: SidebarLink[] = [
  { href: '/dashboard/admin', icon: LayoutDashboard, label: 'Overview' },
  { href: '/dashboard/admin/users', icon: User, label: 'Users' },
  { href: '/dashboard/admin/courses', icon: BookOpen, label: 'Courses' },
  { href: '/dashboard/admin/categories', icon: Bookmark, label: 'Categories' },
  { href: '/dashboard/admin/analytics', icon: BarChart3, label: 'Analytics' },
  { href: '/dashboard/admin/reports', icon: TrendingUp, label: 'Reports' },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { profile, signOut } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  // Determine which links to show based on role and current path
  const isInstructorDashboard = pathname.startsWith('/dashboard/instructor')
  const isAdminDashboard = pathname.startsWith('/dashboard/admin')

  let links = studentLinks
  if (isAdminDashboard) {
    links = adminLinks
  } else if (isInstructorDashboard) {
    links = instructorLinks
  }

  const roleLabel = isAdminDashboard
    ? 'Admin'
    : isInstructorDashboard
    ? 'Instructor'
    : 'Student'

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-64 bg-card border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/logo/phazur-logo-dark.png"
              alt="Phazur Labs"
              width={32}
              height={32}
              className="dark:invert"
            />
            <span className="font-bold">Phazur Labs</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-muted rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Role Indicator */}
        <div className="px-4 py-3 border-b">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {roleLabel} Portal
          </span>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100%-8rem)]">
          {links.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'sidebar-link',
                  isActive && 'sidebar-link-active'
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <link.icon className="h-5 w-5" />
                <span className="flex-1">{link.label}</span>
                {link.badge && (
                  <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground px-1.5">
                    {link.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-card">
          <Link
            href="/dashboard/student/settings"
            className="sidebar-link"
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </Link>
          <Link
            href="/help"
            className="sidebar-link"
          >
            <HelpCircle className="h-5 w-5" />
            <span>Help & Support</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-background/95 backdrop-blur border-b flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-muted rounded-lg"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Search */}
            <div className="hidden md:flex relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search courses, lessons..."
                className="w-80 h-10 pl-10 pr-4 rounded-lg border bg-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative p-2 hover:bg-muted rounded-lg">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full" />
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1.5 hover:bg-muted rounded-lg transition-colors"
              >
                <UserAvatar
                  user={{
                    name: profile?.full_name,
                    avatar_url: profile?.avatar_url,
                  }}
                  size="sm"
                />
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-medium line-clamp-1">
                    {profile?.full_name || 'User'}
                  </div>
                  <div className="text-xs text-muted-foreground capitalize">
                    {profile?.role || 'student'}
                  </div>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>

              {/* Dropdown */}
              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-card rounded-lg border shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-3 border-b">
                      <div className="font-medium">{profile?.full_name}</div>
                      <div className="text-sm text-muted-foreground">{profile?.email}</div>
                    </div>
                    <Link
                      href="/dashboard/student/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      View Profile
                    </Link>
                    <Link
                      href="/dashboard/student/settings"
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>
                    {profile?.role === 'instructor' && (
                      <Link
                        href="/dashboard/instructor"
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <BarChart3 className="h-4 w-4" />
                        Instructor Dashboard
                      </Link>
                    )}
                    {profile?.role === 'admin' && (
                      <Link
                        href="/dashboard/admin"
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <BarChart3 className="h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    )}
                    <div className="border-t my-1" />
                    <button
                      onClick={() => {
                        setUserMenuOpen(false)
                        signOut()
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted w-full text-left text-destructive"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
