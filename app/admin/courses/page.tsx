'use client'

import { useState, useEffect } from 'react'
import {
  Search,
  Download,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Users,
  BookOpen,
  Star,
  DollarSign,
  Video,
  ArrowUpDown,
  Copy,
  Archive,
  Globe,
  Lock,
  Play,
  FileText,
  BarChart,
  Upload,
  FolderOpen,
  Grid3X3,
  List
} from 'lucide-react'
import Link from 'next/link'

// Course type definition
interface CourseData {
  id: string
  title: string
  thumbnail: string | null
  instructor: string
  category: string
  totalVideos: number
  totalDuration: string
  enrolledStudents: number
  rating: number
  reviews: number
  price: number
  revenue: number
  status: 'published' | 'draft' | 'pending' | 'archived'
  visibility: 'public' | 'private'
  createdAt: string
  lastUpdated: string
  completionRate: number
}

interface StatsData {
  totalCourses: number
  publishedCourses: number
  totalStudents: number
  totalRevenue: number
  totalVideos: number
}

// Mock course data (fallback)
const mockCourses: CourseData[] = [
  {
    id: '1',
    title: 'Complete AI & Machine Learning Bootcamp 2024',
    thumbnail: '/course-ai.jpg',
    instructor: 'Dr. Alex Turner',
    category: 'AI & Machine Learning',
    totalVideos: 45,
    totalDuration: '32h 15m',
    enrolledStudents: 2450,
    rating: 4.9,
    reviews: 892,
    price: 199,
    revenue: 489550,
    status: 'published',
    visibility: 'public',
    createdAt: '2024-01-15',
    lastUpdated: '2 days ago',
    completionRate: 78
  },
  {
    id: '2',
    title: 'Advanced React & Next.js Development',
    thumbnail: '/course-react.jpg',
    instructor: 'Maria Santos',
    category: 'Web Development',
    totalVideos: 62,
    totalDuration: '48h 30m',
    enrolledStudents: 3890,
    rating: 4.8,
    reviews: 1245,
    price: 149,
    revenue: 579610,
    status: 'published',
    visibility: 'public',
    createdAt: '2023-11-20',
    lastUpdated: '1 week ago',
    completionRate: 82
  },
  {
    id: '3',
    title: 'AWS Certified Solutions Architect',
    thumbnail: '/course-aws.jpg',
    instructor: 'James Okonkwo',
    category: 'Cloud Computing',
    totalVideos: 38,
    totalDuration: '28h 45m',
    enrolledStudents: 1560,
    rating: 4.7,
    reviews: 523,
    price: 179,
    revenue: 279240,
    status: 'published',
    visibility: 'public',
    createdAt: '2023-12-10',
    lastUpdated: '3 days ago',
    completionRate: 71
  },
  {
    id: '4',
    title: 'UI/UX Design Masterclass',
    thumbnail: '/course-uiux.jpg',
    instructor: 'Sophie Chen',
    category: 'Design',
    totalVideos: 52,
    totalDuration: '36h 20m',
    enrolledStudents: 2120,
    rating: 4.9,
    reviews: 756,
    price: 129,
    revenue: 273480,
    status: 'published',
    visibility: 'public',
    createdAt: '2024-01-05',
    lastUpdated: '5 hours ago',
    completionRate: 85
  },
  {
    id: '5',
    title: 'Python for Data Science',
    thumbnail: '/course-python.jpg',
    instructor: 'Michael Brown',
    category: 'Data Science',
    totalVideos: 28,
    totalDuration: '18h 10m',
    enrolledStudents: 0,
    rating: 0,
    reviews: 0,
    price: 99,
    revenue: 0,
    status: 'draft',
    visibility: 'private',
    createdAt: '2024-03-01',
    lastUpdated: '1 day ago',
    completionRate: 0
  },
  {
    id: '6',
    title: 'Ethical Hacking & Cybersecurity',
    thumbnail: '/course-security.jpg',
    instructor: 'Emma Williams',
    category: 'Cybersecurity',
    totalVideos: 41,
    totalDuration: '30h 55m',
    enrolledStudents: 1890,
    rating: 4.6,
    reviews: 612,
    price: 169,
    revenue: 319410,
    status: 'archived',
    visibility: 'private',
    createdAt: '2023-08-15',
    lastUpdated: '1 month ago',
    completionRate: 68
  },
  {
    id: '7',
    title: 'iOS & SwiftUI Development',
    thumbnail: '/course-ios.jpg',
    instructor: 'David Park',
    category: 'Mobile Development',
    totalVideos: 55,
    totalDuration: '42h 25m',
    enrolledStudents: 1340,
    rating: 4.8,
    reviews: 445,
    price: 159,
    revenue: 213060,
    status: 'published',
    visibility: 'public',
    createdAt: '2024-02-01',
    lastUpdated: '4 days ago',
    completionRate: 74
  },
  {
    id: '8',
    title: 'Blockchain & Web3 Fundamentals',
    thumbnail: '/course-web3.jpg',
    instructor: 'Dr. Alex Turner',
    category: 'Blockchain',
    totalVideos: 15,
    totalDuration: '8h 30m',
    enrolledStudents: 0,
    rating: 0,
    reviews: 0,
    price: 129,
    revenue: 0,
    status: 'pending',
    visibility: 'private',
    createdAt: '2024-03-10',
    lastUpdated: '3 hours ago',
    completionRate: 0
  },
]

// Loading skeleton component
function CoursesLoadingSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Stats skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
            </div>
          </div>
        ))}
      </div>
      {/* Table skeleton */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
        ))}
      </div>
    </div>
  )
}

const statusConfig = {
  published: { label: 'Published', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle },
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300', icon: FileText },
  pending: { label: 'Pending Review', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', icon: Clock },
  archived: { label: 'Archived', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: Archive },
}

export default function CoursesPage() {
  // Data state
  const [courses, setCourses] = useState<CourseData[]>(mockCourses)
  const [stats, setStats] = useState<StatsData>({
    totalCourses: mockCourses.length,
    publishedCourses: mockCourses.filter(c => c.status === 'published').length,
    totalStudents: mockCourses.reduce((acc, c) => acc + c.enrolledStudents, 0),
    totalRevenue: mockCourses.reduce((acc, c) => acc + c.revenue, 0),
    totalVideos: mockCourses.reduce((acc, c) => acc + c.totalVideos, 0),
  })
  const [categories, setCategories] = useState<string[]>([...new Set(mockCourses.map(c => c.category))])

  // UI state
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [selectedCourses, setSelectedCourses] = useState<string[]>([])
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null)

  // Loading and error state
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch courses from API
  useEffect(() => {
    async function fetchCourses() {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch('/api/admin/courses')

        if (!response.ok) {
          // Use mock data for non-200 responses
          console.warn('Courses API returned non-OK status, using mock data')
          setIsLoading(false)
          return
        }

        const data = await response.json()

        if (data.courses && data.courses.length > 0) {
          setCourses(data.courses)
          setStats(data.stats)
          if (data.categories) {
            // Extract category names from objects {id, name}
            const categoryNames = data.categories.map((c: { id: string; name: string } | string) =>
              typeof c === 'string' ? c : c.name
            )
            setCategories(categoryNames)
          }
        }
        // If no courses from API, keep mock data as fallback
      } catch (err) {
        console.error('Failed to fetch courses:', err)
        setError('Failed to load courses. Showing demo data.')
        // Keep mock data on error
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourses()
  }, [])

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || course.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || course.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  const toggleSelectAll = () => {
    if (selectedCourses.length === filteredCourses.length) {
      setSelectedCourses([])
    } else {
      setSelectedCourses(filteredCourses.map(c => c.id))
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedCourses(prev =>
      prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
    )
  }

  // Show loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Courses</h1>
            <p className="text-muted-foreground">Manage course content and curriculum</p>
          </div>
        </div>
        <CoursesLoadingSkeleton />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Error Banner */}
      {error && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 flex items-center gap-3">
          <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          <p className="text-amber-800 dark:text-amber-200 text-sm">{error}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Courses</h1>
          <p className="text-muted-foreground">Manage course content and curriculum</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <Upload className="h-4 w-4" />
            Bulk Upload
          </button>
          <Link
            href="/admin/courses/new"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create Course
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Courses</p>
              <p className="text-2xl font-bold mt-1">{stats.totalCourses}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Published</p>
              <p className="text-2xl font-bold mt-1">{stats.publishedCourses}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Videos</p>
              <p className="text-2xl font-bold mt-1">{stats.totalVideos}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Video className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Enrollments</p>
              <p className="text-2xl font-bold mt-1">{stats.totalStudents.toLocaleString()}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Users className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Revenue</p>
              <p className="text-2xl font-bold mt-1">${stats.totalRevenue >= 1000000 ? (stats.totalRevenue / 1000000).toFixed(1) + 'M' : stats.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses by title or instructor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="pending">Pending Review</option>
                <option value="archived">Archived</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              {/* View Mode Toggle */}
              <div className="flex items-center border rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedCourses.length > 0 && (
          <div className="p-3 bg-primary/5 border-b border-gray-200 dark:border-gray-700 flex items-center gap-4">
            <span className="text-sm font-medium">{selectedCourses.length} selected</span>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600">
                <Globe className="h-4 w-4 inline mr-1" />
                Publish
              </button>
              <button className="px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600">
                <Archive className="h-4 w-4 inline mr-1" />
                Archive
              </button>
              <button className="px-3 py-1.5 text-sm bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100">
                <Trash2 className="h-4 w-4 inline mr-1" />
                Delete
              </button>
            </div>
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left p-4">
                    <input
                      type="checkbox"
                      checked={selectedCourses.length === filteredCourses.length && filteredCourses.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    <button className="flex items-center gap-1 hover:text-foreground">
                      Course
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Instructor</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Content</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    <button className="flex items-center gap-1 hover:text-foreground">
                      Students
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Rating</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    <button className="flex items-center gap-1 hover:text-foreground">
                      Revenue
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.map((course) => {
                  const StatusIcon = statusConfig[course.status as keyof typeof statusConfig].icon
                  return (
                    <tr
                      key={course.id}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedCourses.includes(course.id)}
                          onChange={() => toggleSelect(course.id)}
                          className="w-4 h-4 rounded border-gray-300"
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-20 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-violet-500/20 flex items-center justify-center">
                            <Play className="h-5 w-5 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium truncate max-w-[250px]">{course.title}</p>
                            <p className="text-sm text-muted-foreground">{course.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm">{course.instructor}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3 text-sm">
                          <span className="flex items-center gap-1">
                            <Video className="h-4 w-4 text-muted-foreground" />
                            {course.totalVideos}
                          </span>
                          <span className="text-muted-foreground">{course.totalDuration}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{course.enrolledStudents.toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        {course.rating > 0 ? (
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                            <span className="font-medium">{course.rating}</span>
                            <span className="text-xs text-muted-foreground">({course.reviews})</span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">No ratings</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[course.status as keyof typeof statusConfig].color}`}>
                            <StatusIcon className="h-3 w-3" />
                            {statusConfig[course.status as keyof typeof statusConfig].label}
                          </span>
                          {course.visibility === 'private' && (
                            <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          ${course.revenue.toLocaleString()}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="relative flex justify-end">
                          <button
                            onClick={() => setActionMenuOpen(actionMenuOpen === course.id ? null : course.id)}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                          {actionMenuOpen === course.id && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10">
                              <Link
                                href={`/admin/courses/${course.id}`}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                <Eye className="h-4 w-4" />
                                View Course
                              </Link>
                              <Link
                                href={`/admin/courses/${course.id}/edit`}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                <Edit className="h-4 w-4" />
                                Edit Course
                              </Link>
                              <Link
                                href={`/admin/courses/${course.id}/content`}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                <FolderOpen className="h-4 w-4" />
                                Manage Content
                              </Link>
                              <Link
                                href={`/admin/courses/${course.id}/analytics`}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                <BarChart className="h-4 w-4" />
                                Analytics
                              </Link>
                              <button className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                                <Copy className="h-4 w-4" />
                                Duplicate
                              </button>
                              <hr className="my-1 border-gray-200 dark:border-gray-700" />
                              {course.status === 'draft' && (
                                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20">
                                  <Globe className="h-4 w-4" />
                                  Publish
                                </button>
                              )}
                              {course.status === 'published' && (
                                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20">
                                  <Archive className="h-4 w-4" />
                                  Archive
                                </button>
                              )}
                              <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCourses.map((course) => {
              const StatusIcon = statusConfig[course.status as keyof typeof statusConfig].icon
              return (
                <div
                  key={course.id}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-violet-500/20 flex items-center justify-center relative">
                    <Play className="h-12 w-12 text-primary" />
                    <div className="absolute top-2 right-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig[course.status as keyof typeof statusConfig].color}`}>
                        <StatusIcon className="h-3 w-3" />
                        {statusConfig[course.status as keyof typeof statusConfig].label}
                      </span>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {course.totalDuration}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold line-clamp-2 mb-2">{course.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{course.instructor}</p>
                    <div className="flex items-center justify-between text-sm mb-3">
                      <div className="flex items-center gap-1">
                        <Video className="h-4 w-4 text-muted-foreground" />
                        <span>{course.totalVideos} videos</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{course.enrolledStudents.toLocaleString()}</span>
                      </div>
                    </div>
                    {course.rating > 0 && (
                      <div className="flex items-center gap-1 mb-3">
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                        <span className="font-medium">{course.rating}</span>
                        <span className="text-xs text-muted-foreground">({course.reviews} reviews)</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                      <span className="font-bold text-lg">${course.price}</span>
                      <Link
                        href={`/admin/courses/${course.id}`}
                        className="text-sm text-primary hover:underline"
                      >
                        Manage
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Pagination */}
        <div className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredCourses.length}</span> of{' '}
            <span className="font-medium">{courses.length}</span> courses
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm">1</button>
            <button className="p-2 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
