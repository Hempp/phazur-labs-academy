'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { Header, Footer } from '@/components/layout'
import {
  Search,
  Clock,
  Users,
  BookOpen,
  ChevronDown,
  ChevronUp,
  X,
  SlidersHorizontal,
  GraduationCap,
  Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { AddToCartButton } from '@/components/cart'
import { StarRating } from '@/components/ui/star-rating'

// Course type from API
interface CourseFromApi {
  id: string
  slug: string
  title: string
  description: string | null
  thumbnailUrl: string | null
  price: number
  discountPrice: number | null
  level: string
  category: string
  tags: string[]
  totalLessons: number
  totalDurationMinutes: number
  instructor: {
    id: string
    name: string
    avatar: string | null
  } | null
  stats: {
    enrolledCount: number
    reviewCount: number
    rating: number
  }
  durationCategory: string
  badge: string
  hasTrial: boolean
}

// Filter data
const subjects = [
  { id: 'development', name: 'Development', count: 850 },
  { id: 'data-science', name: 'Data Science', count: 420 },
  { id: 'ai-ml', name: 'AI & Machine Learning', count: 380 },
  { id: 'cloud', name: 'Cloud Computing', count: 290 },
  { id: 'mobile', name: 'Mobile Development', count: 210 },
  { id: 'security', name: 'Cybersecurity', count: 175 },
  { id: 'database', name: 'Database', count: 145 },
  { id: 'design', name: 'UI/UX Design', count: 230 },
]

const levels = [
  { id: 'beginner', name: 'Beginner', count: 420 },
  { id: 'intermediate', name: 'Intermediate', count: 580 },
  { id: 'advanced', name: 'Advanced', count: 290 },
]

const durations = [
  { id: 'short', name: 'Less than 1 Month', count: 320 },
  { id: 'medium', name: '1-3 Months', count: 540 },
  { id: 'long', name: '3-6 Months', count: 280 },
  { id: 'extended', name: '6+ Months', count: 150 },
]

const languages = [
  { id: 'english', name: 'English', count: 980 },
  { id: 'spanish', name: 'Spanish', count: 120 },
  { id: 'portuguese', name: 'Portuguese', count: 85 },
  { id: 'french', name: 'French', count: 65 },
]

// Mock courses data
const mockCourses = [
  {
    id: '1',
    slug: 'full-stack-web-development',
    title: 'Full-Stack Web Development Mastery',
    partner: 'Course Training',
    rating: 4.9,
    reviewCount: 12500,
    level: 'Beginner',
    duration: '3-6 Months',
    skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'GraphQL'],
    badge: 'Professional Certificate',
    hasTrial: true,
    category: 'development',
  },
  {
    id: '2',
    slug: 'ai-machine-learning',
    title: 'AI & Machine Learning Engineering',
    partner: 'Course Training',
    rating: 4.8,
    reviewCount: 8900,
    level: 'Intermediate',
    duration: '4-6 Months',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'Deep Learning', 'NLP'],
    badge: 'Specialization',
    hasTrial: true,
    category: 'ai-ml',
  },
  {
    id: '3',
    slug: 'cloud-architecture-devops',
    title: 'Cloud Architecture & DevOps',
    partner: 'Course Training',
    rating: 4.9,
    reviewCount: 6700,
    level: 'Intermediate',
    duration: '3-4 Months',
    skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD'],
    badge: 'Professional Certificate',
    hasTrial: false,
    category: 'cloud',
  },
  {
    id: '4',
    slug: 'data-science-analytics',
    title: 'Data Science & Analytics Pro',
    partner: 'Course Training',
    rating: 4.8,
    reviewCount: 9200,
    level: 'Beginner',
    duration: '4-5 Months',
    skills: ['Python', 'SQL', 'Pandas', 'Machine Learning', 'Visualization'],
    badge: 'Professional Certificate',
    hasTrial: true,
    category: 'data-science',
  },
  {
    id: '5',
    slug: 'react-native-mobile',
    title: 'React Native Mobile Development',
    partner: 'Course Training',
    rating: 4.7,
    reviewCount: 5400,
    level: 'Intermediate',
    duration: '2-3 Months',
    skills: ['React Native', 'TypeScript', 'Expo', 'Mobile UI'],
    badge: 'Course',
    hasTrial: true,
    category: 'mobile',
  },
  {
    id: '6',
    slug: 'cybersecurity-fundamentals',
    title: 'Cybersecurity Fundamentals',
    partner: 'Course Training',
    rating: 4.8,
    reviewCount: 4200,
    level: 'Beginner',
    duration: '2-3 Months',
    skills: ['Network Security', 'Ethical Hacking', 'SIEM', 'Compliance'],
    badge: 'Professional Certificate',
    hasTrial: false,
    category: 'security',
  },
  {
    id: '7',
    slug: 'advanced-react-patterns',
    title: 'Advanced React Patterns',
    partner: 'Course Training',
    rating: 4.9,
    reviewCount: 3800,
    level: 'Advanced',
    duration: '1-2 Months',
    skills: ['React', 'TypeScript', 'State Management', 'Performance'],
    badge: 'Course',
    hasTrial: true,
    category: 'development',
  },
  {
    id: '8',
    slug: 'postgresql-mastery',
    title: 'PostgreSQL Database Mastery',
    partner: 'Course Training',
    rating: 4.7,
    reviewCount: 2900,
    level: 'Intermediate',
    duration: '2-3 Months',
    skills: ['PostgreSQL', 'SQL', 'Database Design', 'Performance Tuning'],
    badge: 'Course',
    hasTrial: true,
    category: 'database',
  },
  {
    id: '9',
    slug: 'ui-ux-design-bootcamp',
    title: 'UI/UX Design Bootcamp',
    partner: 'Course Training',
    rating: 4.8,
    reviewCount: 6100,
    level: 'Beginner',
    duration: '3-4 Months',
    skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
    badge: 'Professional Certificate',
    hasTrial: true,
    category: 'design',
  },
]

// Filter Accordion Component
function FilterSection({
  title,
  options,
  selected,
  onToggle,
  defaultOpen = false,
}: {
  title: string
  options: { id: string; name: string; count: number }[]
  selected: string[]
  onToggle: (id: string) => void
  defaultOpen?: boolean
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-border py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left"
      >
        <span className="font-medium text-foreground">{title}</span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
      {isOpen && (
        <div className="mt-3 space-y-2">
          {options.map((option) => (
            <label
              key={option.id}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selected.includes(option.id)}
                onChange={() => onToggle(option.id)}
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
              />
              <span className="flex-1 text-sm text-foreground group-hover:text-primary transition-colors">
                {option.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {option.count}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

// Course Card Component (Coursera-style)
function CourseCard({ course }: { course: CourseFromApi }) {
  const partnerName = course.instructor?.name || 'Course Training'
  const tags = course.tags || []

  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group flex flex-col bg-card border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
    >
      {/* Image */}
      <div className="relative aspect-video bg-muted overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
        {/* Partner Logo Overlay */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-2 px-2 py-1 bg-white/90 backdrop-blur-sm rounded">
          <div className="w-5 h-5 bg-primary rounded flex items-center justify-center">
            <GraduationCap className="w-3 h-3 text-white" />
          </div>
          <span className="text-xs font-medium text-foreground">{partnerName}</span>
        </div>
        {/* Course image or placeholder */}
        {course.thumbnailUrl ? (
          <Image
            src={course.thumbnailUrl}
            alt={course.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 group-hover:scale-105 transition-transform duration-300" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-3">
        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          {course.hasTrial && (
            <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-success/10 text-success rounded">
              Free Trial
            </span>
          )}
          <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded">
            {course.badge}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {course.title}
        </h3>

        {/* Skills/Tags */}
        {tags.length > 0 && (
          <p className="text-sm text-muted-foreground line-clamp-1">
            Skills: {tags.slice(0, 3).join(', ')}
            {tags.length > 3 && `, +${tags.length - 3} more`}
          </p>
        )}

        {/* Rating */}
        <StarRating
          rating={course.stats.rating}
          showValue
          reviewCount={course.stats.reviewCount}
          size="sm"
        />

        {/* Meta */}
        <p className="text-xs text-muted-foreground">
          {course.level} · Course · {course.durationCategory}
        </p>
      </div>
    </Link>
  )
}

// Main content component that uses useSearchParams
function CoursesContent() {
  const searchParams = useSearchParams()

  // Initialize filters from URL query parameters
  const categoryFromUrl = searchParams.get('category')
  const levelFromUrl = searchParams.get('level')
  const goalFromUrl = searchParams.get('goal')

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(
    categoryFromUrl ? [categoryFromUrl] : []
  )
  const [selectedLevels, setSelectedLevels] = useState<string[]>(
    levelFromUrl ? [levelFromUrl] : []
  )
  const [selectedDurations, setSelectedDurations] = useState<string[]>([])
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

  // API state
  const [courses, setCourses] = useState<CourseFromApi[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Update filters when URL changes
  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedSubjects([categoryFromUrl])
    }
    if (levelFromUrl) {
      setSelectedLevels([levelFromUrl])
    }
    // Handle goal-based filtering (maps to categories)
    if (goalFromUrl === 'career') {
      // Career-oriented courses: development, cloud, data-science
      setSelectedSubjects(['development', 'cloud', 'data-science'])
    } else if (goalFromUrl === 'advance') {
      // Advanced courses: ai-ml, security
      setSelectedLevels(['intermediate', 'advanced'])
    } else if (goalFromUrl === 'learn') {
      // Learning new skills: beginner level
      setSelectedLevels(['beginner'])
    }
  }, [categoryFromUrl, levelFromUrl, goalFromUrl])

  // Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/courses')
        if (!response.ok) {
          throw new Error('Failed to fetch courses')
        }
        const data = await response.json()
        setCourses(data.courses || [])
      } catch (err) {
        console.error('Error fetching courses:', err)
        setError(err instanceof Error ? err.message : 'Failed to load courses')
        // Fall back to mockCourses if API fails
        setCourses(mockCourses.map(c => ({
          id: c.id,
          slug: c.slug,
          title: c.title,
          description: null,
          thumbnailUrl: null,
          price: 0,
          discountPrice: null,
          level: c.level,
          category: c.category,
          tags: c.skills,
          totalLessons: 0,
          totalDurationMinutes: 0,
          instructor: null,
          stats: {
            enrolledCount: 0,
            reviewCount: c.reviewCount,
            rating: c.rating,
          },
          durationCategory: c.duration,
          badge: c.badge,
          hasTrial: c.hasTrial,
        })))
      } finally {
        setIsLoading(false)
      }
    }
    fetchCourses()
  }, [])

  // Filter courses
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const tags = course.tags || []
        if (
          !course.title.toLowerCase().includes(query) &&
          !tags.some((s) => s.toLowerCase().includes(query))
        ) {
          return false
        }
      }

      // Subject filter
      if (selectedSubjects.length > 0 && !selectedSubjects.includes(course.category)) {
        return false
      }

      // Level filter
      if (selectedLevels.length > 0 && !selectedLevels.includes(course.level.toLowerCase())) {
        return false
      }

      return true
    })
  }, [courses, searchQuery, selectedSubjects, selectedLevels])

  const toggleFilter = (list: string[], setList: (l: string[]) => void, id: string) => {
    if (list.includes(id)) {
      setList(list.filter((item) => item !== id))
    } else {
      setList([...list, id])
    }
  }

  const clearAllFilters = () => {
    setSelectedSubjects([])
    setSelectedLevels([])
    setSelectedDurations([])
    setSelectedLanguages([])
    setSearchQuery('')
  }

  const activeFilterCount =
    selectedSubjects.length + selectedLevels.length + selectedDurations.length + selectedLanguages.length

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Search Header */}
      <div className="border-b bg-surface-secondary">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-2xl">
            <form
              onSubmit={(e) => e.preventDefault()}
              className="relative"
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for courses, skills, or topics..."
                className="w-full h-12 pl-12 pr-4 bg-background border border-border rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </form>
            <p className="mt-3 text-sm text-muted-foreground">
              {isLoading ? (
                <span>Loading courses...</span>
              ) : (
                <>
                  <span className="font-medium text-foreground">{filteredCourses.length}</span> results
                  {searchQuery && (
                    <span> for &quot;{searchQuery}&quot;</span>
                  )}
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Filter Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-foreground">Filters</h2>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-primary hover:underline"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <FilterSection
                title="Subject"
                options={subjects}
                selected={selectedSubjects}
                onToggle={(id) => toggleFilter(selectedSubjects, setSelectedSubjects, id)}
                defaultOpen={true}
              />

              <FilterSection
                title="Level"
                options={levels}
                selected={selectedLevels}
                onToggle={(id) => toggleFilter(selectedLevels, setSelectedLevels, id)}
                defaultOpen={true}
              />

              <FilterSection
                title="Duration"
                options={durations}
                selected={selectedDurations}
                onToggle={(id) => toggleFilter(selectedDurations, setSelectedDurations, id)}
              />

              <FilterSection
                title="Language"
                options={languages}
                selected={selectedLanguages}
                onToggle={(id) => toggleFilter(selectedLanguages, setSelectedLanguages, id)}
              />
            </div>
          </aside>

          {/* Course Grid */}
          <main className="flex-1">
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-6">
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium hover:bg-muted transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="px-1.5 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {/* Active Filters Pills */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedSubjects.map((id) => {
                  const subject = subjects.find((s) => s.id === id)
                  return (
                    <button
                      key={id}
                      onClick={() => toggleFilter(selectedSubjects, setSelectedSubjects, id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary text-sm rounded-full hover:bg-primary/20 transition-colors"
                    >
                      {subject?.name}
                      <X className="w-3 h-3" />
                    </button>
                  )
                })}
                {selectedLevels.map((id) => {
                  const level = levels.find((l) => l.id === id)
                  return (
                    <button
                      key={id}
                      onClick={() => toggleFilter(selectedLevels, setSelectedLevels, id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary text-sm rounded-full hover:bg-primary/20 transition-colors"
                    >
                      {level?.name}
                      <X className="w-3 h-3" />
                    </button>
                  )
                })}
              </div>
            )}

            {/* Course Grid */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
                <p className="text-muted-foreground">Loading courses...</p>
              </div>
            ) : filteredCourses.length > 0 ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No courses found</h3>
                <p className="text-muted-foreground mb-4">
                  {error ? error : 'Try adjusting your filters or search query'}
                </p>
                <button
                  onClick={clearAllFilters}
                  className="text-primary hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Load More */}
            {filteredCourses.length > 0 && (
              <div className="mt-12 text-center">
                <button className="inline-flex items-center justify-center h-11 px-8 border border-primary text-primary rounded-md font-medium hover:bg-primary/5 transition-colors">
                  Show more courses
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Sheet */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-background shadow-xl animate-in slide-in-from-right">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-semibold text-foreground">Filters</h2>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-2 hover:bg-muted rounded-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto h-[calc(100%-8rem)]">
              <FilterSection
                title="Subject"
                options={subjects}
                selected={selectedSubjects}
                onToggle={(id) => toggleFilter(selectedSubjects, setSelectedSubjects, id)}
                defaultOpen={true}
              />

              <FilterSection
                title="Level"
                options={levels}
                selected={selectedLevels}
                onToggle={(id) => toggleFilter(selectedLevels, setSelectedLevels, id)}
                defaultOpen={true}
              />

              <FilterSection
                title="Duration"
                options={durations}
                selected={selectedDurations}
                onToggle={(id) => toggleFilter(selectedDurations, setSelectedDurations, id)}
              />

              <FilterSection
                title="Language"
                options={languages}
                selected={selectedLanguages}
                onToggle={(id) => toggleFilter(selectedLanguages, setSelectedLanguages, id)}
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-background">
              <div className="flex gap-3">
                <button
                  onClick={clearAllFilters}
                  className="flex-1 h-11 border rounded-md font-medium hover:bg-muted transition-colors"
                >
                  Clear all
                </button>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="flex-1 h-11 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
                >
                  Show results
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

// Loading fallback for Suspense
function CoursesLoading() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="border-b bg-surface-secondary">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-2xl">
            <div className="h-12 bg-muted rounded-lg animate-pulse" />
            <div className="mt-3 h-4 w-32 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </div>
      <Footer />
    </div>
  )
}

// Default export wraps content in Suspense
export default function CoursesPage() {
  return (
    <Suspense fallback={<CoursesLoading />}>
      <CoursesContent />
    </Suspense>
  )
}
