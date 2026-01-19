'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  BookOpen,
  Search,
  Filter,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  Star,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Download,
  AlertTriangle,
  Flag,
  BarChart3,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge, LevelBadge, StatusBadge } from '@/components/ui/badge'
import { UserAvatar } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

type CourseStatus = 'published' | 'draft' | 'pending' | 'rejected' | 'archived'

interface Course {
  id: string
  title: string
  instructor: {
    name: string
    avatar: string | null
  }
  category: string
  level: 'beginner' | 'intermediate' | 'advanced'
  status: CourseStatus
  students: number
  rating: number
  reviews: number
  revenue: number
  price: number
  createdAt: string
  lastUpdated: string
  flagged: boolean
}

const mockCourses: Course[] = [
  { id: '1', title: 'TypeScript Masterclass', instructor: { name: 'Sarah Chen', avatar: null }, category: 'Web Development', level: 'intermediate', status: 'published', students: 5280, rating: 4.8, reviews: 1204, revenue: 18900, price: 49.99, createdAt: '2023-03-15', lastUpdated: '2024-02-01', flagged: false },
  { id: '2', title: 'Advanced React Patterns', instructor: { name: 'Michael Park', avatar: null }, category: 'Web Development', level: 'advanced', status: 'published', students: 3420, rating: 4.9, reviews: 892, revenue: 12500, price: 59.99, createdAt: '2023-06-10', lastUpdated: '2024-01-15', flagged: false },
  { id: '3', title: 'Machine Learning Basics', instructor: { name: 'Dr. Alan Turing', avatar: null }, category: 'Data Science', level: 'beginner', status: 'pending', students: 0, rating: 0, reviews: 0, revenue: 0, price: 79.99, createdAt: '2024-02-01', lastUpdated: '2024-02-05', flagged: false },
  { id: '4', title: 'Node.js Best Practices', instructor: { name: 'David Kim', avatar: null }, category: 'Web Development', level: 'intermediate', status: 'published', students: 2150, rating: 4.7, reviews: 456, revenue: 8200, price: 44.99, createdAt: '2023-08-22', lastUpdated: '2024-01-20', flagged: false },
  { id: '5', title: 'UI/UX Design Principles', instructor: { name: 'Lisa Chen', avatar: null }, category: 'Design', level: 'beginner', status: 'pending', students: 0, rating: 0, reviews: 0, revenue: 0, price: 39.99, createdAt: '2024-01-28', lastUpdated: '2024-02-03', flagged: false },
  { id: '6', title: 'Docker for Developers', instructor: { name: 'Emily Wilson', avatar: null }, category: 'DevOps', level: 'intermediate', status: 'published', students: 1890, rating: 4.6, reviews: 324, revenue: 6800, price: 49.99, createdAt: '2023-09-12', lastUpdated: '2024-01-08', flagged: false },
  { id: '7', title: 'Suspicious Marketing Course', instructor: { name: 'Unknown User', avatar: null }, category: 'Business', level: 'beginner', status: 'published', students: 45, rating: 2.1, reviews: 12, revenue: 450, price: 199.99, createdAt: '2024-01-15', lastUpdated: '2024-01-20', flagged: true },
  { id: '8', title: 'GraphQL Masterclass', instructor: { name: 'James Lee', avatar: null }, category: 'Web Development', level: 'intermediate', status: 'draft', students: 0, rating: 0, reviews: 0, revenue: 0, price: 54.99, createdAt: '2024-01-25', lastUpdated: '2024-02-08', flagged: false },
  { id: '9', title: 'iOS Development with Swift', instructor: { name: 'Jennifer Davis', avatar: null }, category: 'Mobile Development', level: 'intermediate', status: 'rejected', students: 0, rating: 0, reviews: 0, revenue: 0, price: 69.99, createdAt: '2024-01-10', lastUpdated: '2024-01-12', flagged: false },
  { id: '10', title: 'AWS Essentials', instructor: { name: 'Robert Brown', avatar: null }, category: 'Cloud', level: 'beginner', status: 'archived', students: 890, rating: 4.2, reviews: 156, revenue: 3200, price: 39.99, createdAt: '2022-11-20', lastUpdated: '2023-06-15', flagged: false },
]

const categories = ['All Categories', 'Web Development', 'Data Science', 'Mobile Development', 'DevOps', 'Design', 'Business', 'Cloud']

const statusFilters: { value: CourseStatus | 'all' | 'flagged'; label: string }[] = [
  { value: 'all', label: 'All Courses' },
  { value: 'published', label: 'Published' },
  { value: 'pending', label: 'Pending Review' },
  { value: 'draft', label: 'Drafts' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'archived', label: 'Archived' },
  { value: 'flagged', label: 'Flagged' },
]

function CourseStatusBadge({ status }: { status: CourseStatus }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'capitalize',
        status === 'published' && 'border-emerald-500 text-emerald-500',
        status === 'draft' && 'border-gray-500 text-gray-500',
        status === 'pending' && 'border-amber-500 text-amber-500',
        status === 'rejected' && 'border-red-500 text-red-500',
        status === 'archived' && 'border-gray-400 text-gray-400'
      )}
    >
      {status}
    </Badge>
  )
}

function CourseMenu({ course, onClose }: { course: Course; onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 mt-1 w-48 bg-card rounded-lg border shadow-lg py-1 z-50">
        <Link
          href={`/courses/${course.id}`}
          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted"
        >
          <Eye className="h-4 w-4" />
          View Course
        </Link>
        <Link
          href={`/dashboard/admin/courses/${course.id}/analytics`}
          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted"
        >
          <BarChart3 className="h-4 w-4" />
          Analytics
        </Link>
        <div className="border-t my-1" />
        {course.status === 'pending' && (
          <>
            <button className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted w-full text-emerald-500">
              <CheckCircle2 className="h-4 w-4" />
              Approve
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted w-full text-red-500">
              <XCircle className="h-4 w-4" />
              Reject
            </button>
          </>
        )}
        {course.status === 'published' && (
          <button className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted w-full text-amber-500">
            <Clock className="h-4 w-4" />
            Unpublish
          </button>
        )}
        {course.flagged ? (
          <button className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted w-full text-emerald-500">
            <CheckCircle2 className="h-4 w-4" />
            Clear Flag
          </button>
        ) : (
          <button className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted w-full text-amber-500">
            <Flag className="h-4 w-4" />
            Flag Course
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

export default function AdminCoursesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<CourseStatus | 'all' | 'flagged'>('all')
  const [categoryFilter, setCategoryFilter] = useState('All Categories')
  const [selectedCourses, setSelectedCourses] = useState<string[]>([])
  const [menuCourseId, setMenuCourseId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const coursesPerPage = 10

  const filteredCourses = mockCourses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all'
      ? true
      : statusFilter === 'flagged'
        ? course.flagged
        : course.status === statusFilter
    const matchesCategory = categoryFilter === 'All Categories' || course.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage)
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * coursesPerPage,
    currentPage * coursesPerPage
  )

  const stats = {
    total: mockCourses.length,
    published: mockCourses.filter(c => c.status === 'published').length,
    pending: mockCourses.filter(c => c.status === 'pending').length,
    flagged: mockCourses.filter(c => c.flagged).length,
    totalRevenue: mockCourses.reduce((acc, c) => acc + c.revenue, 0),
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Course Management</h1>
          <p className="text-muted-foreground mt-1">
            Review and manage all platform courses
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm hover:bg-muted transition-colors">
          <Download className="h-4 w-4" />
          Export Report
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <BookOpen className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-xs text-muted-foreground">Total Courses</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle2 className="h-6 w-6 mx-auto text-emerald-500 mb-2" />
            <p className="text-2xl font-bold">{stats.published}</p>
            <p className="text-xs text-muted-foreground">Published</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-6 w-6 mx-auto text-amber-500 mb-2" />
            <p className="text-2xl font-bold">{stats.pending}</p>
            <p className="text-xs text-muted-foreground">Pending Review</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-6 w-6 mx-auto text-red-500 mb-2" />
            <p className="text-2xl font-bold">{stats.flagged}</p>
            <p className="text-xs text-muted-foreground">Flagged</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="h-6 w-6 mx-auto text-primary mb-2" />
            <p className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total Revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search courses or instructors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as CourseStatus | 'all' | 'flagged')}
            className="px-4 py-2.5 bg-muted/50 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {statusFilters.map((filter) => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2.5 bg-muted/50 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Courses Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-4 text-left text-sm font-medium">Course</th>
                  <th className="p-4 text-left text-sm font-medium">Instructor</th>
                  <th className="p-4 text-left text-sm font-medium">Status</th>
                  <th className="p-4 text-left text-sm font-medium hidden md:table-cell">Students</th>
                  <th className="p-4 text-left text-sm font-medium hidden md:table-cell">Rating</th>
                  <th className="p-4 text-left text-sm font-medium hidden lg:table-cell">Revenue</th>
                  <th className="p-4 text-left text-sm font-medium hidden lg:table-cell">Price</th>
                  <th className="p-4 text-right text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCourses.map((course) => (
                  <tr key={course.id} className={cn(
                    'border-b hover:bg-muted/50 transition-colors',
                    course.flagged && 'bg-red-50 dark:bg-red-900/10'
                  )}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {course.flagged && (
                          <Flag className="h-4 w-4 text-red-500 flex-shrink-0" />
                        )}
                        <div>
                          <p className="font-medium line-clamp-1">{course.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">{course.category}</Badge>
                            <LevelBadge level={course.level} className="text-xs" />
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <UserAvatar
                          user={{ name: course.instructor.name, avatar_url: course.instructor.avatar }}
                          size="sm"
                        />
                        <span className="text-sm">{course.instructor.name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <CourseStatusBadge status={course.status} />
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <div className="flex items-center gap-1 text-sm">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        {course.students.toLocaleString()}
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      {course.rating > 0 ? (
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          {course.rating} ({course.reviews})
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      <span className="text-sm font-medium">
                        ${course.revenue.toLocaleString()}
                      </span>
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      <span className="text-sm">${course.price}</span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="relative inline-block">
                        <button
                          onClick={() => setMenuCourseId(menuCourseId === course.id ? null : course.id)}
                          className="p-2 hover:bg-muted rounded-lg transition-colors"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        {menuCourseId === course.id && (
                          <CourseMenu course={course} onClose={() => setMenuCourseId(null)} />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t">
            <p className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * coursesPerPage + 1} to{' '}
              {Math.min(currentPage * coursesPerPage, filteredCourses.length)} of{' '}
              {filteredCourses.length} courses
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 border rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm transition-colors',
                    currentPage === page
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  )}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 border rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
