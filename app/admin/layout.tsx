'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
  Building2
} from 'lucide-react'

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
  const pathname = usePathname()

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
              <p className="text-xs text-muted-foreground">Phazur Labs Academy</p>
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
            <button className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
              View Docs
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
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg w-80">
                <Search className="h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students, courses, content..."
                  className="bg-transparent border-none outline-none text-sm w-full placeholder:text-gray-400"
                />
                <kbd className="hidden lg:inline-flex items-center px-2 py-0.5 text-xs bg-white dark:bg-gray-600 rounded border">
                  ⌘K
                </kbd>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* Quick Actions */}
              <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                <Zap className="h-4 w-4" />
                Quick Actions
              </button>

              {/* Notifications */}
              <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center">
                    <span className="text-sm font-semibold text-white">A</span>
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium">Admin User</p>
                    <p className="text-xs text-muted-foreground">Super Admin</p>
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
                    <button className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-full">
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
