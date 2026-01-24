'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { CartButton } from '@/components/cart'
import {
  Search,
  ChevronDown,
  Menu,
  X,
  BookOpen,
  Code2,
  Brain,
  Database,
  Cloud,
  Smartphone,
  Shield,
  BarChart3,
  Palette,
  Building2,
  Users,
  Award,
} from 'lucide-react'

// Category data for Browse dropdown
const categories = [
  { name: 'Development', icon: Code2, href: '/courses?category=development', count: '850+ courses' },
  { name: 'Data Science', icon: BarChart3, href: '/courses?category=data-science', count: '420+ courses' },
  { name: 'AI & Machine Learning', icon: Brain, href: '/courses?category=ai-ml', count: '380+ courses' },
  { name: 'Cloud Computing', icon: Cloud, href: '/courses?category=cloud', count: '290+ courses' },
  { name: 'Mobile Development', icon: Smartphone, href: '/courses?category=mobile', count: '210+ courses' },
  { name: 'Cybersecurity', icon: Shield, href: '/courses?category=security', count: '175+ courses' },
  { name: 'Database', icon: Database, href: '/courses?category=database', count: '145+ courses' },
  { name: 'Design', icon: Palette, href: '/courses?category=design', count: '230+ courses' },
]

// Audience types
const audiences = [
  { id: 'individuals', label: 'For Individuals', href: '/' },
  { id: 'business', label: 'For Business', href: '/enterprise' },
  { id: 'universities', label: 'For Universities', href: '/partners' },
]

export function Header() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isBrowseOpen, setIsBrowseOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeAudience, setActiveAudience] = useState('individuals')
  const browseRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Handle scroll for sticky header shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (browseRef.current && !browseRef.current.contains(event.target as Node)) {
        setIsBrowseOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/courses?search=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-50 bg-background transition-shadow duration-200',
        isScrolled && 'shadow-sm'
      )}
    >
      {/* Top Bar - Audience Selector */}
      <div className="border-b border-border-light">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-10">
            {/* Audience Toggle */}
            <div className="hidden md:flex items-center gap-1">
              {audiences.map((audience) => (
                <Link
                  key={audience.id}
                  href={audience.href}
                  onClick={() => setActiveAudience(audience.id)}
                  className={cn(
                    'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                    activeAudience === audience.id
                      ? 'text-primary bg-primary-light'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  {audience.label}
                </Link>
              ))}
            </div>

            {/* Right side - Quick links */}
            <div className="hidden md:flex items-center gap-4 text-sm">
              <Link
                href="/verify"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Verify Certificate
              </Link>
              <span className="text-border">|</span>
              <Link
                href="/help"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Help Center
              </Link>
            </div>

            {/* Mobile - Just show logo hint */}
            <div className="md:hidden" />
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-16 gap-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <Image
                src="/images/logo/phazur-logo-dark.png"
                alt="Phazur Labs"
                width={36}
                height={36}
                className="dark:invert"
              />
              <span className="font-bold text-xl text-foreground hidden sm:block">
                Phazur Labs
              </span>
            </Link>

            {/* Search Bar - Main Focus */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl hidden md:block">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="What do you want to learn?"
                  className="w-full h-11 pl-12 pr-4 bg-surface-secondary border border-border rounded-full text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
            </form>

            {/* Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {/* Browse Dropdown */}
              <div ref={browseRef} className="relative">
                <button
                  onClick={() => setIsBrowseOpen(!isBrowseOpen)}
                  className={cn(
                    'flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md transition-colors',
                    isBrowseOpen
                      ? 'text-primary bg-primary-light'
                      : 'text-foreground hover:bg-muted'
                  )}
                >
                  Browse
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 transition-transform',
                      isBrowseOpen && 'rotate-180'
                    )}
                  />
                </button>

                {/* Dropdown Menu */}
                {isBrowseOpen && (
                  <div className="absolute top-full left-0 mt-2 w-72 bg-background border rounded-xl shadow-lg py-2 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Browse by Subject
                      </p>
                    </div>
                    {categories.map((category) => (
                      <Link
                        key={category.name}
                        href={category.href}
                        onClick={() => setIsBrowseOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-light">
                          <category.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {category.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {category.count}
                          </p>
                        </div>
                      </Link>
                    ))}
                    <div className="px-4 py-3 border-t mt-2">
                      <Link
                        href="/courses"
                        onClick={() => setIsBrowseOpen(false)}
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        View all courses →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/courses"
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                  pathname === '/courses'
                    ? 'text-primary bg-primary-light'
                    : 'text-foreground hover:bg-muted'
                )}
              >
                Courses
              </Link>

              <Link
                href="/certifications"
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                  pathname === '/certifications'
                    ? 'text-primary bg-primary-light'
                    : 'text-foreground hover:bg-muted'
                )}
              >
                Certifications
              </Link>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3 ml-auto">
              <CartButton />

              <Link
                href="/auth/login"
                className="hidden sm:block px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                Sign In
              </Link>

              <Link
                href="/auth/register"
                className="hidden sm:inline-flex items-center justify-center h-10 px-5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Join Free
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 hover:bg-muted rounded-md transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-b bg-background animate-in slide-in-from-top">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="What do you want to learn?"
                  className="w-full h-12 pl-12 pr-4 bg-surface-secondary border border-border rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </form>

            {/* Mobile Audience Toggle */}
            <div className="flex rounded-lg bg-muted p-1">
              {audiences.map((audience) => (
                <button
                  key={audience.id}
                  onClick={() => setActiveAudience(audience.id)}
                  className={cn(
                    'flex-1 py-2 text-xs font-medium rounded-md transition-colors',
                    activeAudience === audience.id
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground'
                  )}
                >
                  {audience.label.replace('For ', '')}
                </button>
              ))}
            </div>

            {/* Mobile Nav Links */}
            <nav className="space-y-1">
              <Link
                href="/courses"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
              >
                <BookOpen className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Browse Courses</span>
              </Link>
              <Link
                href="/certifications"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
              >
                <Award className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Certifications</span>
              </Link>
              <Link
                href="/enterprise"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
              >
                <Building2 className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">For Business</span>
              </Link>
              <Link
                href="/partners"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
              >
                <Users className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">For Universities</span>
              </Link>
            </nav>

            {/* Mobile Auth Actions */}
            <div className="flex gap-3 pt-2">
              <Link
                href="/auth/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex-1 h-11 inline-flex items-center justify-center border rounded-lg text-sm font-medium hover:bg-muted transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex-1 h-11 inline-flex items-center justify-center bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Join Free
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
