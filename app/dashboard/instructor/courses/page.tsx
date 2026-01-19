'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  BookOpen,
  Users,
  Star,
  DollarSign,
  Search,
  Filter,
  Plus,
  Grid3X3,
  List,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  BarChart3,
  Clock,
  Copy,
  Archive,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge, LevelBadge, StatusBadge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type CourseStatus = 'published' | 'draft' | 'archived'
type SortOption = 'newest' | 'oldest' | 'students' | 'revenue' | 'rating'

interface Course {
  id: string
  title: string
  description: string
  thumbnail: string | null
  students: number
  rating: number
  reviews: number
  revenue: number
  status: CourseStatus
  level: 'beginner' | 'intermediate' | 'advanced'
  category: string
  lastUpdated: string
  createdAt: string
  lessons: number
  duration: string
}

const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Advanced React Patterns',
    description: 'Master compound components, render props, and custom hooks',
    thumbnail: null,
    students: 3420,
    rating: 4.9,
    reviews: 892,
    revenue: 12500,
    status: 'published',
    level: 'advanced',
    category: 'React',
    lastUpdated: '2024-01-15',
    createdAt: '2023-06-10',
    lessons: 48,
    duration: '12h 30m',
  },
  {
    id: '2',
    title: 'TypeScript Masterclass',
    description: 'From basics to advanced type system features',
    thumbnail: null,
    students: 5280,
    rating: 4.8,
    reviews: 1204,
    revenue: 18900,
    status: 'published',
    level: 'intermediate',
    category: 'TypeScript',
    lastUpdated: '2024-02-01',
    createdAt: '2023-03-15',
    lessons: 62,
    duration: '18h 45m',
  },
  {
    id: '3',
    title: 'Node.js Best Practices',
    description: 'Production-ready Node.js applications',
    thumbnail: null,
    students: 2150,
    rating: 4.7,
    reviews: 456,
    revenue: 8200,
    status: 'published',
    level: 'intermediate',
    category: 'Node.js',
    lastUpdated: '2024-01-20',
    createdAt: '2023-08-22',
    lessons: 38,
    duration: '10h 15m',
  },
  {
    id: '4',
    title: 'GraphQL Fundamentals',
    description: 'Build powerful APIs with GraphQL',
    thumbnail: null,
    students: 0,
    rating: 0,
    reviews: 0,
    revenue: 0,
    status: 'draft',
    level: 'beginner',
    category: 'GraphQL',
    lastUpdated: '2024-02-10',
    createdAt: '2024-02-05',
    lessons: 12,
    duration: '3h 20m',
  },
  {
    id: '5',
    title: 'Docker for Developers',
    description: 'Containerize your applications like a pro',
    thumbnail: null,
    students: 1890,
    rating: 4.6,
    reviews: 324,
    revenue: 6800,
    status: 'published',
    level: 'intermediate',
    category: 'DevOps',
    lastUpdated: '2024-01-08',
    createdAt: '2023-09-12',
    lessons: 28,
    duration: '7h 45m',
  },
  {
    id: '6',
    title: 'AWS Essentials',
    description: 'Cloud computing fundamentals with AWS',
    thumbnail: null,
    students: 0,
    rating: 0,
    reviews: 0,
    revenue: 0,
    status: 'archived',
    level: 'beginner',
    category: 'Cloud',
    lastUpdated: '2023-06-15',
    createdAt: '2022-11-20',
    lessons: 24,
    duration: '6h 30m',
  },
]

const statusFilters: { value: CourseStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Courses' },
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Drafts' },
  { value: 'archived', label: 'Archived' },
]

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'students', label: 'Most Students' },
  { value: 'revenue', label: 'Highest Revenue' },
  { value: 'rating', label: 'Highest Rated' },
]

function CourseCard({ course, view }: { course: Course; view: 'grid' | 'list' }) {
  const [showMenu, setShowMenu] = useState(false)

  if (view === 'list') {
    return (
      <div className="flex items-center gap-4 p-4 bg-card rounded-xl border hover:shadow-md transition-all">
        <div className="w-32 h-20 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
          <BookOpen className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold truncate">{course.title}</h3>
            <StatusBadge status={course.status} />
          </div>
          <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
            {course.description}
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {course.students.toLocaleString()}
            </span>
            {course.rating > 0 && (
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                {course.rating}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {course.duration}
            </span>
            <span>${course.revenue.toLocaleString()}</span>
          </div>
        </div>
        <LevelBadge level={course.level} className="hidden md:flex" />
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <MoreVertical className="h-5 w-5" />
          </button>
          {showMenu && (
            <CourseMenu course={course} onClose={() => setShowMenu(false)} />
          )}
        </div>
      </div>
    )
  }

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-all">
      <div className="aspect-video bg-muted relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <BookOpen className="h-12 w-12 text-muted-foreground" />
        </div>
        <div className="absolute top-2 right-2 flex gap-2">
          <StatusBadge status={course.status} />
        </div>
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Link
            href={`/dashboard/instructor/courses/${course.id}`}
            className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
          >
            <Edit2 className="h-5 w-5 text-gray-900" />
          </Link>
          <Link
            href={`/courses/${course.id}`}
            className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
          >
            <Eye className="h-5 w-5 text-gray-900" />
          </Link>
          <Link
            href={`/dashboard/instructor/courses/${course.id}/analytics`}
            className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
          >
            <BarChart3 className="h-5 w-5 text-gray-900" />
          </Link>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold line-clamp-1">{course.title}</h3>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 hover:bg-muted rounded transition-colors"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
            {showMenu && (
              <CourseMenu course={course} onClose={() => setShowMenu(false)} />
            )}
          </div>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {course.description}
        </p>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-3 text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {course.students.toLocaleString()}
            </span>
            {course.rating > 0 && (
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                {course.rating}
              </span>
            )}
          </div>
          <span className="font-semibold">${course.revenue.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t">
          <LevelBadge level={course.level} />
          <span className="text-xs text-muted-foreground">
            {course.lessons} lessons • {course.duration}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

function CourseMenu({ course, onClose }: { course: Course; onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 mt-1 w-48 bg-card rounded-lg border shadow-lg py-1 z-50">
        <Link
          href={`/dashboard/instructor/courses/${course.id}`}
          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted"
        >
          <Edit2 className="h-4 w-4" />
          Edit Course
        </Link>
        <Link
          href={`/courses/${course.id}`}
          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted"
        >
          <Eye className="h-4 w-4" />
          Preview
        </Link>
        <Link
          href={`/dashboard/instructor/courses/${course.id}/analytics`}
          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted"
        >
          <BarChart3 className="h-4 w-4" />
          Analytics
        </Link>
        <div className="border-t my-1" />
        <button className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted w-full">
          <Copy className="h-4 w-4" />
          Duplicate
        </button>
        {course.status !== 'archived' && (
          <button className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted w-full">
            <Archive className="h-4 w-4" />
            Archive
          </button>
        )}
        <div className="border-t my-1" />
        <button className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted w-full text-destructive">
          <Trash2 className="h-4 w-4" />
          Delete
        </button>
      </div>
    </>
  )
}

export default function InstructorCoursesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<CourseStatus | 'all'>('all')
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [view, setView] = useState<'grid' | 'list'>('grid')

  const filteredCourses = mockCourses
    .filter((course) => {
      const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'all' || course.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'students':
          return b.students - a.students
        case 'revenue':
          return b.revenue - a.revenue
        case 'rating':
          return b.rating - a.rating
        default:
          return 0
      }
    })

  const stats = {
    total: mockCourses.length,
    published: mockCourses.filter(c => c.status === 'published').length,
    drafts: mockCourses.filter(c => c.status === 'draft').length,
    totalStudents: mockCourses.reduce((acc, c) => acc + c.students, 0),
    totalRevenue: mockCourses.reduce((acc, c) => acc + c.revenue, 0),
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">My Courses</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track all your courses
          </p>
        </div>
        <Link
          href="/dashboard/instructor/courses/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Create Course
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-sm text-muted-foreground">Total Courses</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-emerald-500">{stats.published}</p>
            <p className="text-sm text-muted-foreground">Published</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-amber-500">{stats.drafts}</p>
            <p className="text-sm text-muted-foreground">Drafts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{stats.totalStudents.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Total Students</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Total Revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Status Filter */}
        <div className="flex gap-2">
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={cn(
                'px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                statusFilter === filter.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/50 hover:bg-muted'
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Sort & View */}
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-4 py-2.5 bg-muted/50 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <div className="flex border rounded-lg overflow-hidden">
            <button
              onClick={() => setView('grid')}
              className={cn(
                'p-2.5 transition-colors',
                view === 'grid' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              )}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView('list')}
              className={cn(
                'p-2.5 transition-colors',
                view === 'list' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              )}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Course Grid/List */}
      {filteredCourses.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">No courses found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Create your first course to get started'}
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <Link
                href="/dashboard/instructor/courses/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Create Course
              </Link>
            )}
          </CardContent>
        </Card>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} view="grid" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} view="list" />
          ))}
        </div>
      )}
    </div>
  )
}
