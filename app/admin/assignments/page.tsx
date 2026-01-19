'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Search,
  Plus,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  Trash2,
  Copy,
  CheckCircle,
  Clock,
  ClipboardList,
  Users,
  BarChart,
  ArrowUpDown,
  BookOpen,
  Calendar,
  AlertTriangle,
  FileText,
  Download,
  MessageSquare
} from 'lucide-react'

// Mock assignment data
const assignments = [
  {
    id: '1',
    title: 'Build a Neural Network from Scratch',
    course: 'Complete AI & Machine Learning Bootcamp',
    type: 'project',
    dueDate: '2024-04-15',
    submissions: 1890,
    pending: 245,
    avgScore: 82,
    status: 'active',
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    title: 'Create a Full-Stack App with Next.js',
    course: 'Advanced React & Next.js Development',
    type: 'project',
    dueDate: '2024-04-20',
    submissions: 2340,
    pending: 180,
    avgScore: 78,
    status: 'active',
    createdAt: '2024-01-20'
  },
  {
    id: '3',
    title: 'AWS Infrastructure Design Document',
    course: 'AWS Certified Solutions Architect',
    type: 'document',
    dueDate: '2024-04-10',
    submissions: 1120,
    pending: 89,
    avgScore: 85,
    status: 'active',
    createdAt: '2024-02-01'
  },
  {
    id: '4',
    title: 'Mobile App Prototype',
    course: 'UI/UX Design Masterclass',
    type: 'project',
    dueDate: '2024-04-25',
    submissions: 980,
    pending: 320,
    avgScore: 88,
    status: 'active',
    createdAt: '2024-01-25'
  },
  {
    id: '5',
    title: 'Data Analysis Portfolio',
    course: 'Python for Data Science',
    type: 'portfolio',
    dueDate: '2024-05-01',
    submissions: 0,
    pending: 0,
    avgScore: 0,
    status: 'draft',
    createdAt: '2024-03-01'
  },
  {
    id: '6',
    title: 'Penetration Testing Report',
    course: 'Ethical Hacking & Cybersecurity',
    type: 'document',
    dueDate: '2024-03-30',
    submissions: 890,
    pending: 0,
    avgScore: 76,
    status: 'closed',
    createdAt: '2023-12-10'
  },
]

const statusConfig = {
  active: { label: 'Active', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle },
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300', icon: FileText },
  closed: { label: 'Closed', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: Clock },
}

const typeConfig = {
  project: { label: 'Project', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  document: { label: 'Document', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  portfolio: { label: 'Portfolio', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
}

export default function AssignmentsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null)

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         assignment.course.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || assignment.status === statusFilter
    const matchesType = typeFilter === 'all' || assignment.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  // Stats
  const totalAssignments = assignments.length
  const activeAssignments = assignments.filter(a => a.status === 'active').length
  const totalSubmissions = assignments.reduce((acc, a) => acc + a.submissions, 0)
  const pendingReview = assignments.reduce((acc, a) => acc + a.pending, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Assignments</h1>
          <p className="text-muted-foreground">Create and manage course assignments</p>
        </div>
        <Link
          href="/admin/assignments/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Create Assignment
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Assignments</p>
              <p className="text-2xl font-bold mt-1">{totalAssignments}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <ClipboardList className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold mt-1">{activeAssignments}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Submissions</p>
              <p className="text-2xl font-bold mt-1">{totalSubmissions.toLocaleString()}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending Review</p>
              <p className="text-2xl font-bold mt-1">{pendingReview}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search assignments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex items-center gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="closed">Closed</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Types</option>
                <option value="project">Project</option>
                <option value="document">Document</option>
                <option value="portfolio">Portfolio</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  <button className="flex items-center gap-1 hover:text-foreground">
                    Assignment
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Course</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Type</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  <button className="flex items-center gap-1 hover:text-foreground">
                    Due Date
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  <button className="flex items-center gap-1 hover:text-foreground">
                    Submissions
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Pending</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Avg Score</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssignments.map((assignment) => {
                const StatusIcon = statusConfig[assignment.status as keyof typeof statusConfig].icon
                const dueDate = new Date(assignment.dueDate)
                const isOverdue = assignment.status === 'active' && dueDate < new Date()

                return (
                  <tr
                    key={assignment.id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <ClipboardList className="h-5 w-5 text-primary" />
                        </div>
                        <p className="font-medium">{assignment.title}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm truncate max-w-[180px]">{assignment.course}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${typeConfig[assignment.type as keyof typeof typeConfig].color}`}>
                        {typeConfig[assignment.type as keyof typeof typeConfig].label}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-500' : ''}`}>
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">{dueDate.toLocaleDateString()}</span>
                        {isOverdue && <AlertTriangle className="h-3 w-3 ml-1" />}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-medium">{assignment.submissions.toLocaleString()}</span>
                    </td>
                    <td className="p-4">
                      {assignment.pending > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                          {assignment.pending}
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">0</span>
                      )}
                    </td>
                    <td className="p-4">
                      {assignment.avgScore > 0 ? (
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                assignment.avgScore >= 80 ? 'bg-green-500' :
                                assignment.avgScore >= 60 ? 'bg-amber-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${assignment.avgScore}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{assignment.avgScore}%</span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">No data</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[assignment.status as keyof typeof statusConfig].color}`}>
                        <StatusIcon className="h-3 w-3" />
                        {statusConfig[assignment.status as keyof typeof statusConfig].label}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="relative flex justify-end">
                        <button
                          onClick={() => setActionMenuOpen(actionMenuOpen === assignment.id ? null : assignment.id)}
                          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        {actionMenuOpen === assignment.id && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10">
                            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                              <Eye className="h-4 w-4" />
                              View Details
                            </button>
                            <Link
                              href={`/admin/assignments/${assignment.id}/edit`}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              <Edit className="h-4 w-4" />
                              Edit Assignment
                            </Link>
                            <Link
                              href={`/admin/assignments/${assignment.id}/submissions`}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              <FileText className="h-4 w-4" />
                              View Submissions
                            </Link>
                            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                              <BarChart className="h-4 w-4" />
                              Analytics
                            </button>
                            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                              <Download className="h-4 w-4" />
                              Export Grades
                            </button>
                            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                              <Copy className="h-4 w-4" />
                              Duplicate
                            </button>
                            <hr className="my-1 border-gray-200 dark:border-gray-700" />
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

        {/* Pagination */}
        <div className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredAssignments.length}</span> of{' '}
            <span className="font-medium">{assignments.length}</span> assignments
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
