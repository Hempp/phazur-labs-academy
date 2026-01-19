'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Search,
  Filter,
  Grid,
  List,
  Star,
  Clock,
  Users,
  BookOpen,
  Play,
  ChevronDown,
  X,
  SlidersHorizontal,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge, LevelBadge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

// Mock categories
const categories = [
  { id: 'all', name: 'All Categories', count: 156 },
  { id: 'web-development', name: 'Web Development', count: 42 },
  { id: 'mobile-development', name: 'Mobile Development', count: 28 },
  { id: 'data-science', name: 'Data Science', count: 35 },
  { id: 'machine-learning', name: 'Machine Learning', count: 24 },
  { id: 'cloud-computing', name: 'Cloud Computing', count: 18 },
  { id: 'devops', name: 'DevOps', count: 15 },
  { id: 'cybersecurity', name: 'Cybersecurity', count: 12 },
  { id: 'ui-ux-design', name: 'UI/UX Design', count: 22 },
]

const levels = [
  { id: 'all', name: 'All Levels' },
  { id: 'beginner', name: 'Beginner' },
  { id: 'intermediate', name: 'Intermediate' },
  { id: 'advanced', name: 'Advanced' },
]

const sortOptions = [
  { id: 'popular', name: 'Most Popular' },
  { id: 'rating', name: 'Highest Rated' },
  { id: 'newest', name: 'Newest' },
  { id: 'price-low', name: 'Price: Low to High' },
  { id: 'price-high', name: 'Price: High to Low' },
]

// Mock courses data
const mockCourses = [
  {
    id: '1',
    slug: 'advanced-react-patterns',
    title: 'Advanced React Patterns',
    description: 'Master advanced React patterns including compound components, render props, and custom hooks.',
    instructor: {
      name: 'Sarah Johnson',
      avatar: '/images/instructors/sarah.jpg',
    },
    thumbnail: '/images/courses/react-patterns.jpg',
    rating: 4.9,
    reviewCount: 2847,
    students: 15420,
    duration: 1440, // minutes
    lessons: 32,
    level: 'advanced' as const,
    price: 89.99,
    originalPrice: 149.99,
    category: 'web-development',
    tags: ['React', 'JavaScript', 'Frontend'],
    isBestseller: true,
    isNew: false,
    updatedAt: '2024-01-15',
  },
  {
    id: '2',
    slug: 'typescript-masterclass',
    title: 'TypeScript Masterclass: Zero to Hero',
    description: 'Complete TypeScript course from basics to advanced concepts. Build type-safe applications.',
    instructor: {
      name: 'Michael Chen',
      avatar: '/images/instructors/michael.jpg',
    },
    thumbnail: '/images/courses/typescript.jpg',
    rating: 4.8,
    reviewCount: 3521,
    students: 22150,
    duration: 2160,
    lessons: 48,
    level: 'intermediate' as const,
    price: 79.99,
    originalPrice: 129.99,
    category: 'web-development',
    tags: ['TypeScript', 'JavaScript', 'Programming'],
    isBestseller: true,
    isNew: false,
    updatedAt: '2024-02-01',
  },
  {
    id: '3',
    slug: 'nodejs-backend-development',
    title: 'Node.js Backend Development',
    description: 'Build scalable backend applications with Node.js, Express, and MongoDB.',
    instructor: {
      name: 'Emma Wilson',
      avatar: '/images/instructors/emma.jpg',
    },
    thumbnail: '/images/courses/nodejs.jpg',
    rating: 4.7,
    reviewCount: 1892,
    students: 12340,
    duration: 2520,
    lessons: 56,
    level: 'intermediate' as const,
    price: 94.99,
    originalPrice: 159.99,
    category: 'web-development',
    tags: ['Node.js', 'Backend', 'MongoDB'],
    isBestseller: false,
    isNew: false,
    updatedAt: '2024-01-20',
  },
  {
    id: '4',
    slug: 'nextjs-14-complete-guide',
    title: 'Next.js 14: The Complete Guide',
    description: 'Learn Next.js 14 with App Router, Server Components, and full-stack development.',
    instructor: {
      name: 'David Park',
      avatar: '/images/instructors/david.jpg',
    },
    thumbnail: '/images/courses/nextjs.jpg',
    rating: 4.9,
    reviewCount: 1245,
    students: 8540,
    duration: 1080,
    lessons: 38,
    level: 'intermediate' as const,
    price: 89.99,
    originalPrice: null,
    category: 'web-development',
    tags: ['Next.js', 'React', 'Full-Stack'],
    isBestseller: false,
    isNew: true,
    updatedAt: '2024-02-10',
  },
  {
    id: '5',
    slug: 'python-data-science',
    title: 'Python for Data Science',
    description: 'Master Python for data analysis, visualization, and machine learning fundamentals.',
    instructor: {
      name: 'Lisa Anderson',
      avatar: '/images/instructors/lisa.jpg',
    },
    thumbnail: '/images/courses/python-ds.jpg',
    rating: 4.8,
    reviewCount: 4210,
    students: 28750,
    duration: 2880,
    lessons: 64,
    level: 'beginner' as const,
    price: 99.99,
    originalPrice: 179.99,
    category: 'data-science',
    tags: ['Python', 'Data Science', 'Pandas'],
    isBestseller: true,
    isNew: false,
    updatedAt: '2024-01-25',
  },
  {
    id: '6',
    slug: 'aws-solutions-architect',
    title: 'AWS Solutions Architect Associate',
    description: 'Prepare for AWS certification with hands-on labs and real-world scenarios.',
    instructor: {
      name: 'James Martinez',
      avatar: '/images/instructors/james.jpg',
    },
    thumbnail: '/images/courses/aws.jpg',
    rating: 4.7,
    reviewCount: 2156,
    students: 14280,
    duration: 2400,
    lessons: 52,
    level: 'intermediate' as const,
    price: 119.99,
    originalPrice: 199.99,
    category: 'cloud-computing',
    tags: ['AWS', 'Cloud', 'DevOps'],
    isBestseller: false,
    isNew: false,
    updatedAt: '2024-01-18',
  },
  {
    id: '7',
    slug: 'react-native-mobile-apps',
    title: 'React Native: Build Mobile Apps',
    description: 'Create cross-platform mobile applications using React Native and Expo.',
    instructor: {
      name: 'Anna Roberts',
      avatar: '/images/instructors/anna.jpg',
    },
    thumbnail: '/images/courses/react-native.jpg',
    rating: 4.6,
    reviewCount: 1678,
    students: 9870,
    duration: 1800,
    lessons: 42,
    level: 'intermediate' as const,
    price: 84.99,
    originalPrice: 139.99,
    category: 'mobile-development',
    tags: ['React Native', 'Mobile', 'JavaScript'],
    isBestseller: false,
    isNew: false,
    updatedAt: '2024-02-05',
  },
  {
    id: '8',
    slug: 'machine-learning-tensorflow',
    title: 'Machine Learning with TensorFlow',
    description: 'Deep dive into machine learning and neural networks using TensorFlow and Keras.',
    instructor: {
      name: 'Robert Kim',
      avatar: '/images/instructors/robert.jpg',
    },
    thumbnail: '/images/courses/ml-tensorflow.jpg',
    rating: 4.8,
    reviewCount: 1923,
    students: 11240,
    duration: 3240,
    lessons: 72,
    level: 'advanced' as const,
    price: 149.99,
    originalPrice: 249.99,
    category: 'machine-learning',
    tags: ['TensorFlow', 'ML', 'Deep Learning'],
    isBestseller: false,
    isNew: false,
    updatedAt: '2024-01-30',
  },
]

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  return `${hours}h total`
}

function CourseCard({
  course,
  viewMode,
}: {
  course: typeof mockCourses[0]
  viewMode: 'grid' | 'list'
}) {
  if (viewMode === 'list') {
    return (
      <Card className="group hover:shadow-lg transition-all duration-300">
        <div className="flex flex-col sm:flex-row gap-4 p-4">
          <div className="relative w-full sm:w-64 aspect-video sm:aspect-[4/3] rounded-lg overflow-hidden flex-shrink-0 bg-muted">
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
              <BookOpen className="h-12 w-12 text-primary/50" />
            </div>
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="p-3 rounded-full bg-white/90">
                <Play className="h-6 w-6 text-primary fill-primary" />
              </div>
            </div>
            {course.isBestseller && (
              <Badge className="absolute top-2 left-2 bg-amber-500 hover:bg-amber-600">
                Bestseller
              </Badge>
            )}
            {course.isNew && (
              <Badge className="absolute top-2 left-2 bg-emerald-500 hover:bg-emerald-600">
                New
              </Badge>
            )}
          </div>
          <div className="flex-1 flex flex-col">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {course.description}
                </p>
              </div>
              <LevelBadge level={course.level} className="flex-shrink-0" />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              By {course.instructor.name}
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-sm">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                <span className="font-medium">{course.rating}</span>
                <span className="text-muted-foreground">({course.reviewCount.toLocaleString()})</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Users className="h-4 w-4" />
                {course.students.toLocaleString()} students
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-4 w-4" />
                {formatDuration(course.duration)}
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <BookOpen className="h-4 w-4" />
                {course.lessons} lessons
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              {course.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="flex items-center justify-between mt-auto pt-4">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">${course.price}</span>
                {course.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    ${course.originalPrice}
                  </span>
                )}
              </div>
              <Link
                href={`/courses/${course.slug}`}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                View Course
              </Link>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col">
      <div className="relative aspect-video bg-muted">
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
          <BookOpen className="h-12 w-12 text-primary/50" />
        </div>
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="p-3 rounded-full bg-white/90">
            <Play className="h-6 w-6 text-primary fill-primary" />
          </div>
        </div>
        {course.isBestseller && (
          <Badge className="absolute top-2 left-2 bg-amber-500 hover:bg-amber-600">
            Bestseller
          </Badge>
        )}
        {course.isNew && (
          <Badge className="absolute top-2 left-2 bg-emerald-500 hover:bg-emerald-600">
            New
          </Badge>
        )}
        <LevelBadge level={course.level} className="absolute top-2 right-2" />
      </div>
      <CardContent className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-2">
          {course.title}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">{course.instructor.name}</p>
        <div className="flex items-center gap-2 mt-2 text-sm">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
            <span className="font-medium">{course.rating}</span>
          </div>
          <span className="text-muted-foreground">
            ({course.reviewCount.toLocaleString()})
          </span>
        </div>
        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
          <span>{formatDuration(course.duration)}</span>
          <span>{course.lessons} lessons</span>
        </div>
        <div className="flex items-baseline gap-2 mt-auto pt-4">
          <span className="text-xl font-bold">${course.price}</span>
          {course.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${course.originalPrice}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default function CourseCatalogPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [selectedSort, setSelectedSort] = useState('popular')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200])

  const filteredCourses = useMemo(() => {
    let filtered = [...mockCourses]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(query) ||
          course.description.toLowerCase().includes(query) ||
          course.tags.some((tag) => tag.toLowerCase().includes(query))
      )
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((course) => course.category === selectedCategory)
    }

    // Level filter
    if (selectedLevel !== 'all') {
      filtered = filtered.filter((course) => course.level === selectedLevel)
    }

    // Price filter
    filtered = filtered.filter(
      (course) => course.price >= priceRange[0] && course.price <= priceRange[1]
    )

    // Sort
    switch (selectedSort) {
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'newest':
        filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        break
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      default: // popular
        filtered.sort((a, b) => b.students - a.students)
    }

    return filtered
  }, [searchQuery, selectedCategory, selectedLevel, selectedSort, priceRange])

  const activeFiltersCount = [
    selectedCategory !== 'all',
    selectedLevel !== 'all',
    priceRange[0] > 0 || priceRange[1] < 200,
  ].filter(Boolean).length

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center">
            Explore Our Courses
          </h1>
          <p className="text-muted-foreground text-center mt-2 max-w-2xl mx-auto">
            Discover {mockCourses.length}+ courses taught by industry experts. Start learning today.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mt-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search for courses, topics, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-14 pl-12 pr-4 rounded-xl border bg-background text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Categories */}
              <div>
                <h3 className="font-semibold mb-3">Categories</h3>
                <div className="space-y-1">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={cn(
                        'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors',
                        selectedCategory === category.id
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      )}
                    >
                      <span>{category.name}</span>
                      <span className={cn(
                        'text-xs',
                        selectedCategory === category.id
                          ? 'text-primary-foreground/70'
                          : 'text-muted-foreground'
                      )}>
                        {category.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Level */}
              <div>
                <h3 className="font-semibold mb-3">Level</h3>
                <div className="space-y-1">
                  {levels.map((level) => (
                    <button
                      key={level.id}
                      onClick={() => setSelectedLevel(level.id)}
                      className={cn(
                        'w-full px-3 py-2 rounded-lg text-sm text-left transition-colors',
                        selectedLevel === level.id
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      )}
                    >
                      {level.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-semibold mb-3">Price Range</h3>
                <div className="px-3">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Clear Filters */}
              {activeFiltersCount > 0 && (
                <button
                  onClick={() => {
                    setSelectedCategory('all')
                    setSelectedLevel('all')
                    setPriceRange([0, 200])
                  }}
                  className="w-full px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium hover:bg-muted transition-colors"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <Badge variant="default" className="ml-1">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </button>

                <span className="text-sm text-muted-foreground">
                  {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={selectedSort}
                    onChange={(e) => setSelectedSort(e.target.value)}
                    className="appearance-none px-4 py-2 pr-10 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>

                {/* View Toggle */}
                <div className="hidden sm:flex items-center border rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      'p-2 rounded-md transition-colors',
                      viewMode === 'grid' ? 'bg-muted' : 'hover:bg-muted/50'
                    )}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={cn(
                      'p-2 rounded-md transition-colors',
                      viewMode === 'list' ? 'bg-muted' : 'hover:bg-muted/50'
                    )}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Filters Panel */}
            {showFilters && (
              <div className="lg:hidden mb-6 p-4 border rounded-lg bg-card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Filters</h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-1 hover:bg-muted rounded"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm bg-background"
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Level</label>
                    <select
                      value={selectedLevel}
                      onChange={(e) => setSelectedLevel(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm bg-background"
                    >
                      {levels.map((level) => (
                        <option key={level.id} value={level.id}>
                          {level.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Course Grid/List */}
            {filteredCourses.length > 0 ? (
              <div
                className={cn(
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'
                    : 'space-y-4'
                )}
              >
                {filteredCourses.map((course) => (
                  <Link key={course.id} href={`/courses/${course.slug}`}>
                    <CourseCard course={course} viewMode={viewMode} />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <BookOpen className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No courses found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search query
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('all')
                    setSelectedLevel('all')
                    setPriceRange([0, 200])
                  }}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
