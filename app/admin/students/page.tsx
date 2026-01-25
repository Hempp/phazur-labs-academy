'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Search,
  Filter,
  Download,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  Mail,
  Eye,
  Edit,
  Trash2,
  Ban,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Users,
  GraduationCap,
  Calendar,
  ArrowUpDown,
  SlidersHorizontal,
  X,
  Loader2,
  AlertTriangle,
  RefreshCw
} from 'lucide-react'
import toast from 'react-hot-toast'

// Student type from API
interface Student {
  id: string
  name: string
  email: string
  avatar: string | null
  enrolledCourses: number
  completedCourses?: number
  progress?: number
  totalSpent?: number
  status: string
  joinDate: string
  lastActive: string
  plan: string
  enrollments?: Array<{
    id: string
    course_id: string
    progress_percentage: number
    courses: { id: string; title: string; slug: string }
  }>
}

// Course type for enrollment
interface Course {
  id: string
  title: string
  slug: string
}

// Available courses will be fetched from API

const statusColors: Record<string, string> = {
  Active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Inactive: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  inactive: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  Suspended: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  suspended: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

const planColors: Record<string, string> = {
  'Free Trial': 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  'Basic': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'Pro': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  'Premium': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  'Enterprise': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
}

export default function StudentsPage() {
  // Data state
  const [students, setStudents] = useState<Student[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)

  // Filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [planFilter, setPlanFilter] = useState('all')
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null)

  // Add Student Modal state
  const [showAddModal, setShowAddModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    plan: 'Basic',
    selectedCourses: [] as string[],
    sendWelcomeEmail: true,
  })

  // Edit Student Modal state
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    status: 'Active',
    selectedCourses: [] as string[],
  })

  // Delete Confirmation Modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Fetch students from API
  const fetchStudents = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (searchQuery) params.append('search', searchQuery)
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (planFilter !== 'all') params.append('plan', planFilter)

      const response = await fetch(`/api/admin/students?${params.toString()}`)

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('You must be logged in as an admin to view students')
        }
        if (response.status === 403) {
          throw new Error('You do not have permission to view students')
        }
        throw new Error('Failed to fetch students')
      }

      const data = await response.json()
      setStudents(data.students || [])
      setTotalCount(data.total || 0)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch students')
      console.error('Error fetching students:', err)
    } finally {
      setIsLoading(false)
    }
  }, [searchQuery, statusFilter, planFilter])

  // Fetch courses for enrollment selection
  const fetchCourses = useCallback(async () => {
    try {
      const response = await fetch('/api/courses')
      if (response.ok) {
        const data = await response.json()
        setCourses(data.courses || data || [])
      }
    } catch (err) {
      console.error('Error fetching courses:', err)
    }
  }, [])

  // Initial data fetch
  useEffect(() => {
    fetchStudents()
    fetchCourses()
  }, [fetchStudents, fetchCourses])

  // Handle add student form submission
  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!newStudent.name.trim()) {
      toast.error('Please enter a student name')
      return
    }
    if (!newStudent.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newStudent.email)) {
      toast.error('Please enter a valid email address')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/admin/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newStudent.name,
          email: newStudent.email,
          courseIds: newStudent.selectedCourses,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create student')
      }

      toast.success(`Student "${newStudent.name}" added successfully!`)

      // Reset form and close modal
      setNewStudent({
        name: '',
        email: '',
        plan: 'Basic',
        selectedCourses: [],
        sendWelcomeEmail: true,
      })
      setShowAddModal(false)

      // Refresh the student list
      fetchStudents()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create student')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle edit student
  const handleEditStudent = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!editingStudent) return

    // Validation
    if (!editForm.name.trim()) {
      toast.error('Please enter a student name')
      return
    }
    if (!editForm.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email)) {
      toast.error('Please enter a valid email address')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/admin/students/${editingStudent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editForm.name,
          email: editForm.email,
          status: editForm.status,
          courseIds: editForm.selectedCourses,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update student')
      }

      toast.success(`Student "${editForm.name}" updated successfully!`)

      // Close modal and refresh list
      setShowEditModal(false)
      setEditingStudent(null)
      fetchStudents()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update student')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle delete student
  const handleDeleteStudent = async () => {
    if (!deletingStudent) return

    setIsDeleting(true)

    try {
      const response = await fetch(`/api/admin/students/${deletingStudent.id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete student')
      }

      toast.success(`Student "${deletingStudent.name}" has been deleted`)

      // Close modal and refresh list
      setShowDeleteModal(false)
      setDeletingStudent(null)
      fetchStudents()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete student')
    } finally {
      setIsDeleting(false)
    }
  }

  // Open edit modal for a student
  const openEditModal = (student: Student) => {
    setEditingStudent(student)
    setEditForm({
      name: student.name,
      email: student.email,
      status: student.status,
      selectedCourses: student.enrollments?.map(e => e.course_id) || [],
    })
    setShowEditModal(true)
    setActionMenuOpen(null)
  }

  // Open delete modal for a student
  const openDeleteModal = (student: Student) => {
    setDeletingStudent(student)
    setShowDeleteModal(true)
    setActionMenuOpen(null)
  }

  // Toggle course selection for add form
  const toggleCourseSelection = (courseId: string) => {
    setNewStudent(prev => ({
      ...prev,
      selectedCourses: prev.selectedCourses.includes(courseId)
        ? prev.selectedCourses.filter(id => id !== courseId)
        : [...prev.selectedCourses, courseId]
    }))
  }

  // Toggle course selection for edit form
  const toggleEditCourseSelection = (courseId: string) => {
    setEditForm(prev => ({
      ...prev,
      selectedCourses: prev.selectedCourses.includes(courseId)
        ? prev.selectedCourses.filter(id => id !== courseId)
        : [...prev.selectedCourses, courseId]
    }))
  }

  // Client-side filtering (already filtered server-side, but keep for plan filter)
  const filteredStudents = students.filter(student => {
    const matchesPlan = planFilter === 'all' || student.plan === planFilter
    return matchesPlan
  })

  const toggleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([])
    } else {
      setSelectedStudents(filteredStudents.map(s => s.id))
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedStudents(prev =>
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    )
  }

  // Stats calculations
  const totalStudents = totalCount || students.length
  const activeStudents = students.filter(s => s.status === 'Active' || s.status === 'active').length
  const avgProgress = students.length > 0
    ? Math.round(students.reduce((acc, s) => acc + (s.progress || 0), 0) / students.length)
    : 0
  const totalRevenue = students.reduce((acc, s) => acc + (s.totalSpent || 0), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Students</h1>
          <p className="text-muted-foreground">Manage and monitor student accounts</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <Download className="h-4 w-4" />
            Export
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <UserPlus className="h-4 w-4" />
            Add Student
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Students</p>
              <p className="text-2xl font-bold mt-1">{totalStudents.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-3 text-sm text-green-600">
            <TrendingUp className="h-4 w-4" />
            <span>+12% this month</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Students</p>
              <p className="text-2xl font-bold mt-1">{activeStudents}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-3 text-sm text-muted-foreground">
            <span>{Math.round((activeStudents / totalStudents) * 100)}% of total</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg. Progress</p>
              <p className="text-2xl font-bold mt-1">{avgProgress}%</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-3">
            <div
              className="bg-purple-500 h-2 rounded-full"
              style={{ width: `${avgProgress}%` }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold mt-1">${totalRevenue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-3 text-sm text-green-600">
            <TrendingUp className="h-4 w-4" />
            <span>+8% this month</span>
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
                placeholder="Search students by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Quick Filters */}
            <div className="flex items-center gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>

              <select
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value)}
                className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Plans</option>
                <option value="Free Trial">Free Trial</option>
                <option value="Basic">Basic</option>
                <option value="Premium">Premium</option>
                <option value="Enterprise">Enterprise</option>
              </select>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                  showFilters
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Join Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Min Progress</label>
                <input
                  type="number"
                  placeholder="0%"
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Min Courses</label>
                <input
                  type="number"
                  placeholder="0"
                  min="0"
                  className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Last Active</label>
                <select className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary">
                  <option value="all">Any time</option>
                  <option value="today">Today</option>
                  <option value="week">This week</option>
                  <option value="month">This month</option>
                  <option value="inactive">Inactive (30+ days)</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Bulk Actions */}
        {selectedStudents.length > 0 && (
          <div className="p-3 bg-primary/5 border-b border-gray-200 dark:border-gray-700 flex items-center gap-4">
            <span className="text-sm font-medium">{selectedStudents.length} selected</span>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600">
                <Mail className="h-4 w-4 inline mr-1" />
                Email
              </button>
              <button className="px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600">
                <Ban className="h-4 w-4 inline mr-1" />
                Suspend
              </button>
              <button className="px-3 py-1.5 text-sm bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100">
                <Trash2 className="h-4 w-4 inline mr-1" />
                Delete
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left p-4">
                  <input
                    type="checkbox"
                    checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  <button className="flex items-center gap-1 hover:text-foreground">
                    Student
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Plan</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  <button className="flex items-center gap-1 hover:text-foreground">
                    Progress
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Courses</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Last Active</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Revenue</th>
                <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Loading State */}
              {isLoading && (
                <tr>
                  <td colSpan={9} className="p-8 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <p className="text-muted-foreground">Loading students...</p>
                    </div>
                  </td>
                </tr>
              )}

              {/* Error State */}
              {error && !isLoading && (
                <tr>
                  <td colSpan={9} className="p-8 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                        <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                      </div>
                      <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
                      <button
                        onClick={fetchStudents}
                        className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                      >
                        <RefreshCw className="h-4 w-4" />
                        Try Again
                      </button>
                    </div>
                  </td>
                </tr>
              )}

              {/* Empty State */}
              {!isLoading && !error && filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={9} className="p-8 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        <Users className="h-6 w-6 text-gray-400" />
                      </div>
                      <p className="text-muted-foreground">No students found</p>
                      <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                      >
                        <UserPlus className="h-4 w-4" />
                        Add First Student
                      </button>
                    </div>
                  </td>
                </tr>
              )}

              {/* Student Rows */}
              {!isLoading && !error && filteredStudents.map((student) => (
                <tr
                  key={student.id}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => toggleSelect(student.id)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center text-white font-semibold">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-muted-foreground">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${planColors[student.plan as keyof typeof planColors]}`}>
                      {student.plan}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            (student.progress ?? 0) === 100
                              ? 'bg-green-500'
                              : (student.progress ?? 0) >= 50
                              ? 'bg-primary'
                              : 'bg-amber-500'
                          }`}
                          style={{ width: `${student.progress ?? 0}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-10">{student.progress ?? 0}%</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">
                      <span className="font-medium">{student.completedCourses}</span>
                      <span className="text-muted-foreground">/{student.enrolledCourses}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[student.status as keyof typeof statusColors]}`}>
                      {student.status === 'active' && <CheckCircle className="h-3 w-3" />}
                      {student.status === 'inactive' && <Clock className="h-3 w-3" />}
                      {student.status === 'suspended' && <XCircle className="h-3 w-3" />}
                      {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-muted-foreground">{student.lastActive}</span>
                  </td>
                  <td className="p-4">
                    <span className="font-medium">${student.totalSpent}</span>
                  </td>
                  <td className="p-4">
                    <div className="relative flex justify-end">
                      <button
                        onClick={() => setActionMenuOpen(actionMenuOpen === student.id ? null : student.id)}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                      {actionMenuOpen === student.id && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10">
                          <button className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                            <Eye className="h-4 w-4" />
                            View Profile
                          </button>
                          <button
                            onClick={() => openEditModal(student)}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <Edit className="h-4 w-4" />
                            Edit Details
                          </button>
                          <button className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                            <Mail className="h-4 w-4" />
                            Send Email
                          </button>
                          <button className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                            <GraduationCap className="h-4 w-4" />
                            View Courses
                          </button>
                          <hr className="my-1 border-gray-200 dark:border-gray-700" />
                          {student.status !== 'suspended' ? (
                            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20">
                              <Ban className="h-4 w-4" />
                              Suspend Account
                            </button>
                          ) : (
                            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20">
                              <CheckCircle className="h-4 w-4" />
                              Reactivate
                            </button>
                          )}
                          <button
                            onClick={() => openDeleteModal(student)}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete Account
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredStudents.length}</span> of{' '}
            <span className="font-medium">{students.length}</span> students
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm">1</button>
            <button className="px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm">2</button>
            <button className="px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm">3</button>
            <span className="text-muted-foreground">...</span>
            <button className="px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm">12</button>
            <button className="p-2 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => !isSubmitting && setShowAddModal(false)}
          />

          {/* Modal Content */}
          <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h2 className="text-xl font-semibold">Add New Student</h2>
                <p className="text-sm text-muted-foreground mt-1">Create a new student account</p>
              </div>
              <button
                onClick={() => !isSubmitting && setShowAddModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                disabled={isSubmitting}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAddStudent} className="p-6 space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-2">Full Name *</label>
                <input
                  type="text"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter student name"
                  className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
                  disabled={isSubmitting}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-2">Email Address *</label>
                <input
                  type="email"
                  value={newStudent.email}
                  onChange={(e) => setNewStudent(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="student@email.com"
                  className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
                  disabled={isSubmitting}
                />
              </div>

              {/* Plan Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Subscription Plan</label>
                <select
                  value={newStudent.plan}
                  onChange={(e) => setNewStudent(prev => ({ ...prev, plan: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
                  disabled={isSubmitting}
                >
                  <option value="Free Trial">Free Trial</option>
                  <option value="Basic">Basic</option>
                  <option value="Premium">Premium</option>
                  <option value="Enterprise">Enterprise</option>
                </select>
              </div>

              {/* Course Enrollment */}
              <div>
                <label className="block text-sm font-medium mb-2">Enroll in Courses (Optional)</label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  {courses.length === 0 ? (
                    <p className="col-span-2 text-sm text-muted-foreground text-center py-2">No courses available</p>
                  ) : (
                    courses.map((course) => (
                      <label
                        key={course.id}
                        className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                          newStudent.selectedCourses.includes(course.id)
                            ? 'bg-primary/10 text-primary'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-600'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={newStudent.selectedCourses.includes(course.id)}
                          onChange={() => toggleCourseSelection(course.id)}
                          className="w-4 h-4 rounded border-gray-300"
                          disabled={isSubmitting}
                        />
                        <span className="text-sm">{course.title}</span>
                      </label>
                    ))
                  )}
                </div>
                {newStudent.selectedCourses.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {newStudent.selectedCourses.length} course(s) selected
                  </p>
                )}
              </div>

              {/* Welcome Email */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="sendWelcomeEmail"
                  checked={newStudent.sendWelcomeEmail}
                  onChange={(e) => setNewStudent(prev => ({ ...prev, sendWelcomeEmail: e.target.checked }))}
                  className="w-4 h-4 rounded border-gray-300"
                  disabled={isSubmitting}
                />
                <label htmlFor="sendWelcomeEmail" className="text-sm">
                  Send welcome email with login instructions
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4" />
                      Add Student
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {showEditModal && editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => !isSubmitting && setShowEditModal(false)}
          />

          {/* Modal Content */}
          <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h2 className="text-xl font-semibold">Edit Student</h2>
                <p className="text-sm text-muted-foreground mt-1">Update student information</p>
              </div>
              <button
                onClick={() => !isSubmitting && setShowEditModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                disabled={isSubmitting}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleEditStudent} className="p-6 space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-2">Full Name *</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter student name"
                  className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
                  disabled={isSubmitting}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-2">Email Address *</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="student@email.com"
                  className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
                  disabled={isSubmitting}
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
                  disabled={isSubmitting}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              {/* Course Enrollment */}
              <div>
                <label className="block text-sm font-medium mb-2">Course Enrollment</label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  {courses.length === 0 ? (
                    <p className="col-span-2 text-sm text-muted-foreground text-center py-2">No courses available</p>
                  ) : (
                    courses.map((course) => (
                      <label
                        key={course.id}
                        className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                          editForm.selectedCourses.includes(course.id)
                            ? 'bg-primary/10 text-primary'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-600'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={editForm.selectedCourses.includes(course.id)}
                          onChange={() => toggleEditCourseSelection(course.id)}
                          className="w-4 h-4 rounded border-gray-300"
                          disabled={isSubmitting}
                        />
                        <span className="text-sm">{course.title}</span>
                      </label>
                    ))
                  )}
                </div>
                {editForm.selectedCourses.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {editForm.selectedCourses.length} course(s) enrolled
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Edit className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => !isDeleting && setShowDeleteModal(false)}
          />

          {/* Modal Content */}
          <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md mx-4">
            <div className="p-6">
              {/* Warning Icon */}
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>

              {/* Title */}
              <h2 className="text-xl font-semibold text-center mb-2">Delete Student</h2>

              {/* Message */}
              <p className="text-center text-muted-foreground mb-6">
                Are you sure you want to delete <span className="font-medium text-foreground">{deletingStudent.name}</span>?
                This action cannot be undone. All their enrollments and progress data will be permanently removed.
              </p>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteStudent}
                  disabled={isDeleting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      Delete Student
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
