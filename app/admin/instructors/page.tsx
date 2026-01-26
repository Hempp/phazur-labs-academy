'use client'

import { useState, useEffect } from 'react'
import {
  Search,
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
  BookOpen,
  Star,
  DollarSign,
  Video,
  ArrowUpDown,
  Shield,
  Award,
  Loader2
} from 'lucide-react'

// Type definitions for API response
interface Instructor {
  id: string
  name: string
  email: string
  avatar: string | null
  specialty: string
  totalCourses: number
  activeCourses: number
  totalStudents: number
  rating: number
  totalRevenue: number
  status: 'active' | 'pending' | 'inactive'
  verified: boolean
  joinDate: string
  lastActive: string
  payout: string
}

interface InstructorStats {
  totalInstructors: number
  activeInstructors: number
  totalCourses: number
  totalRevenue: number
  avgRating: number
}

interface InstructorsResponse {
  instructors: Instructor[]
  stats: InstructorStats
  specialties: string[]
  total: number
}

// Mock instructor data (fallback)
const MOCK_INSTRUCTORS: Instructor[] = [
  {
    id: '1',
    name: 'Dr. Alex Turner',
    email: 'alex.turner@phazurlabs.com',
    avatar: null,
    specialty: 'AI & Machine Learning',
    totalCourses: 8,
    activeCourses: 6,
    totalStudents: 4520,
    rating: 4.9,
    totalRevenue: 125400,
    status: 'active',
    verified: true,
    joinDate: '2023-03-15',
    lastActive: '1 hour ago',
    payout: 'monthly'
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria.s@phazurlabs.com',
    avatar: null,
    specialty: 'Web Development',
    totalCourses: 12,
    activeCourses: 10,
    totalStudents: 8750,
    rating: 4.8,
    totalRevenue: 234500,
    status: 'active',
    verified: true,
    joinDate: '2022-11-20',
    lastActive: '30 minutes ago',
    payout: 'monthly'
  },
  {
    id: '3',
    name: 'James Okonkwo',
    email: 'james.o@email.com',
    avatar: null,
    specialty: 'Cloud Computing',
    totalCourses: 5,
    activeCourses: 4,
    totalStudents: 2340,
    rating: 4.7,
    totalRevenue: 67800,
    status: 'active',
    verified: true,
    joinDate: '2023-06-10',
    lastActive: '2 hours ago',
    payout: 'weekly'
  },
  {
    id: '4',
    name: 'Sophie Chen',
    email: 'sophie.chen@email.com',
    avatar: null,
    specialty: 'UX Design',
    totalCourses: 6,
    activeCourses: 5,
    totalStudents: 3120,
    rating: 4.9,
    totalRevenue: 89200,
    status: 'active',
    verified: true,
    joinDate: '2023-01-25',
    lastActive: '5 minutes ago',
    payout: 'monthly'
  },
  {
    id: '5',
    name: 'Michael Brown',
    email: 'michael.b@email.com',
    avatar: null,
    specialty: 'Data Science',
    totalCourses: 3,
    activeCourses: 2,
    totalStudents: 980,
    rating: 4.5,
    totalRevenue: 28500,
    status: 'pending',
    verified: false,
    joinDate: '2024-02-01',
    lastActive: '3 days ago',
    payout: 'monthly'
  },
  {
    id: '6',
    name: 'Emma Williams',
    email: 'emma.w@email.com',
    avatar: null,
    specialty: 'Cybersecurity',
    totalCourses: 4,
    activeCourses: 0,
    totalStudents: 1560,
    rating: 4.6,
    totalRevenue: 45000,
    status: 'inactive',
    verified: true,
    joinDate: '2023-08-15',
    lastActive: '2 weeks ago',
    payout: 'monthly'
  },
  {
    id: '7',
    name: 'David Park',
    email: 'david.park@email.com',
    avatar: null,
    specialty: 'Mobile Development',
    totalCourses: 7,
    activeCourses: 6,
    totalStudents: 4100,
    rating: 4.8,
    totalRevenue: 112000,
    status: 'active',
    verified: true,
    joinDate: '2023-04-20',
    lastActive: '45 minutes ago',
    payout: 'weekly'
  },
]

const MOCK_STATS: InstructorStats = {
  totalInstructors: MOCK_INSTRUCTORS.length,
  activeInstructors: MOCK_INSTRUCTORS.filter(i => i.status === 'active').length,
  totalCourses: MOCK_INSTRUCTORS.reduce((sum, i) => sum + i.totalCourses, 0),
  totalRevenue: MOCK_INSTRUCTORS.reduce((sum, i) => sum + i.totalRevenue, 0),
  avgRating: Number((MOCK_INSTRUCTORS.reduce((sum, i) => sum + i.rating, 0) / MOCK_INSTRUCTORS.length).toFixed(1)),
}

const statusColors = {
  active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  inactive: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
}

export default function InstructorsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [specialtyFilter, setSpecialtyFilter] = useState('all')
  const [selectedInstructors, setSelectedInstructors] = useState<string[]>([])
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [instructors, setInstructors] = useState<Instructor[]>(MOCK_INSTRUCTORS)
  const [stats, setStats] = useState<InstructorStats>(MOCK_STATS)
  const [specialties, setSpecialties] = useState<string[]>([...new Set(MOCK_INSTRUCTORS.map(i => i.specialty))])

  // Fetch instructors from API
  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        if (searchQuery) params.set('search', searchQuery)
        if (statusFilter !== 'all') params.set('status', statusFilter)
        if (specialtyFilter !== 'all') params.set('specialty', specialtyFilter)

        const response = await fetch(`/api/admin/instructors?${params.toString()}`)
        if (!response.ok) throw new Error('Failed to fetch instructors')

        const data: InstructorsResponse = await response.json()
        setInstructors(data.instructors)
        setStats(data.stats)
        if (data.specialties.length > 0) {
          setSpecialties(data.specialties)
        }
      } catch (error) {
        console.error('Instructors fetch error:', error)
        // Keep mock data on error
      } finally {
        setLoading(false)
      }
    }

    fetchInstructors()
  }, [searchQuery, statusFilter, specialtyFilter])

  const filteredInstructors = instructors.filter(instructor => {
    const matchesSearch = instructor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         instructor.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || instructor.status === statusFilter
    const matchesSpecialty = specialtyFilter === 'all' || instructor.specialty === specialtyFilter
    return matchesSearch && matchesStatus && matchesSpecialty
  })

  const toggleSelectAll = () => {
    if (selectedInstructors.length === filteredInstructors.length) {
      setSelectedInstructors([])
    } else {
      setSelectedInstructors(filteredInstructors.map(i => i.id))
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedInstructors(prev =>
      prev.includes(id) ? prev.filter(iid => iid !== id) : [...prev, id]
    )
  }

  // Use stats from API (or computed from local data if API didn't return stats)
  const totalInstructors = stats.totalInstructors
  const activeInstructors = stats.activeInstructors
  const totalCourses = stats.totalCourses
  const totalRevenue = stats.totalRevenue
  const avgRating = stats.avgRating.toFixed(1)

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </div>
        ))}
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 py-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <LoadingSkeleton />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Instructors</h1>
          <p className="text-muted-foreground">Manage instructor accounts and performance</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <Download className="h-4 w-4" />
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            <UserPlus className="h-4 w-4" />
            Invite Instructor
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Instructors</p>
              <p className="text-2xl font-bold mt-1">{totalInstructors}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold mt-1">{activeInstructors}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Courses</p>
              <p className="text-2xl font-bold mt-1">{totalCourses}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg Rating</p>
              <p className="text-2xl font-bold mt-1 flex items-center gap-1">
                {avgRating}
                <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Award className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold mt-1">${(totalRevenue / 1000).toFixed(0)}k</p>
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
                placeholder="Search instructors by name or email..."
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
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
              </select>

              <select
                value={specialtyFilter}
                onChange={(e) => setSpecialtyFilter(e.target.value)}
                className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Specialties</option>
                {specialties.map(specialty => (
                  <option key={specialty} value={specialty}>{specialty}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedInstructors.length > 0 && (
          <div className="p-3 bg-primary/5 border-b border-gray-200 dark:border-gray-700 flex items-center gap-4">
            <span className="text-sm font-medium">{selectedInstructors.length} selected</span>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600">
                <Mail className="h-4 w-4 inline mr-1" />
                Email
              </button>
              <button className="px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600">
                <DollarSign className="h-4 w-4 inline mr-1" />
                Process Payout
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
                    checked={selectedInstructors.length === filteredInstructors.length && filteredInstructors.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  <button className="flex items-center gap-1 hover:text-foreground">
                    Instructor
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Specialty</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  <button className="flex items-center gap-1 hover:text-foreground">
                    Courses
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
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
              {filteredInstructors.map((instructor) => (
                <tr
                  key={instructor.id}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedInstructors.includes(instructor.id)}
                      onChange={() => toggleSelect(instructor.id)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                          {instructor.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        {instructor.verified && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <Shield className="h-2.5 w-2.5 text-white" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{instructor.name}</p>
                          {instructor.verified && (
                            <span className="text-xs text-blue-600 dark:text-blue-400">Verified</span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{instructor.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-700">
                      {instructor.specialty}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{instructor.activeCourses}</span>
                      <span className="text-muted-foreground">/ {instructor.totalCourses}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{instructor.totalStudents.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                      <span className="font-medium">{instructor.rating}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[instructor.status as keyof typeof statusColors]}`}>
                      {instructor.status === 'active' && <CheckCircle className="h-3 w-3" />}
                      {instructor.status === 'pending' && <Clock className="h-3 w-3" />}
                      {instructor.status === 'inactive' && <XCircle className="h-3 w-3" />}
                      {instructor.status.charAt(0).toUpperCase() + instructor.status.slice(1)}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      ${instructor.totalRevenue.toLocaleString()}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="relative flex justify-end">
                      <button
                        onClick={() => setActionMenuOpen(actionMenuOpen === instructor.id ? null : instructor.id)}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                      {actionMenuOpen === instructor.id && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10">
                          <button className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                            <Eye className="h-4 w-4" />
                            View Profile
                          </button>
                          <button className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                            <Edit className="h-4 w-4" />
                            Edit Details
                          </button>
                          <button className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                            <BookOpen className="h-4 w-4" />
                            View Courses
                          </button>
                          <button className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                            <DollarSign className="h-4 w-4" />
                            Payout History
                          </button>
                          <button className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                            <Mail className="h-4 w-4" />
                            Send Email
                          </button>
                          {instructor.status === 'pending' && (
                            <>
                              <hr className="my-1 border-gray-200 dark:border-gray-700" />
                              <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20">
                                <CheckCircle className="h-4 w-4" />
                                Approve
                              </button>
                              <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                                <XCircle className="h-4 w-4" />
                                Reject
                              </button>
                            </>
                          )}
                          {instructor.status === 'active' && (
                            <>
                              <hr className="my-1 border-gray-200 dark:border-gray-700" />
                              <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20">
                                <Ban className="h-4 w-4" />
                                Suspend
                              </button>
                            </>
                          )}
                          <hr className="my-1 border-gray-200 dark:border-gray-700" />
                          <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                            <Trash2 className="h-4 w-4" />
                            Remove Instructor
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Empty State */}
          {filteredInstructors.length === 0 && (
            <div className="p-12 text-center">
              <GraduationCap className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">No instructors found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || statusFilter !== 'all' || specialtyFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Get started by inviting your first instructor.'}
              </p>
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                <UserPlus className="h-4 w-4" />
                Invite Instructor
              </button>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredInstructors.length}</span> of{' '}
            <span className="font-medium">{instructors.length}</span> instructors
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
