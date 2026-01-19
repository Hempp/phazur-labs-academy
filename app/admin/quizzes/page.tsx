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
  FileQuestion,
  Users,
  BarChart,
  ArrowUpDown,
  BookOpen,
  Target,
  Timer,
  Award,
  TrendingUp
} from 'lucide-react'

// Mock quiz data
const quizzes = [
  {
    id: '1',
    title: 'Introduction to Machine Learning Quiz',
    course: 'Complete AI & Machine Learning Bootcamp',
    questions: 15,
    duration: 30,
    attempts: 2450,
    avgScore: 78,
    passRate: 85,
    status: 'published',
    createdAt: '2024-01-15',
    lastUpdated: '2 days ago'
  },
  {
    id: '2',
    title: 'React Hooks Assessment',
    course: 'Advanced React & Next.js Development',
    questions: 20,
    duration: 45,
    attempts: 3120,
    avgScore: 82,
    passRate: 89,
    status: 'published',
    createdAt: '2024-01-20',
    lastUpdated: '1 week ago'
  },
  {
    id: '3',
    title: 'AWS Fundamentals Test',
    course: 'AWS Certified Solutions Architect',
    questions: 25,
    duration: 60,
    attempts: 1890,
    avgScore: 71,
    passRate: 76,
    status: 'published',
    createdAt: '2024-02-01',
    lastUpdated: '3 days ago'
  },
  {
    id: '4',
    title: 'UX Design Principles Quiz',
    course: 'UI/UX Design Masterclass',
    questions: 12,
    duration: 20,
    attempts: 2100,
    avgScore: 88,
    passRate: 94,
    status: 'published',
    createdAt: '2024-01-25',
    lastUpdated: '5 hours ago'
  },
  {
    id: '5',
    title: 'Python Data Structures',
    course: 'Python for Data Science',
    questions: 18,
    duration: 40,
    attempts: 0,
    avgScore: 0,
    passRate: 0,
    status: 'draft',
    createdAt: '2024-03-01',
    lastUpdated: '1 day ago'
  },
  {
    id: '6',
    title: 'Network Security Basics',
    course: 'Ethical Hacking & Cybersecurity',
    questions: 22,
    duration: 45,
    attempts: 1560,
    avgScore: 75,
    passRate: 81,
    status: 'published',
    createdAt: '2023-12-10',
    lastUpdated: '2 weeks ago'
  },
]

const statusColors = {
  published: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  draft: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
}

export default function QuizzesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null)

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         quiz.course.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || quiz.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Stats
  const totalQuizzes = quizzes.length
  const publishedQuizzes = quizzes.filter(q => q.status === 'published').length
  const totalAttempts = quizzes.reduce((acc, q) => acc + q.attempts, 0)
  const avgPassRate = Math.round(quizzes.filter(q => q.passRate > 0).reduce((acc, q) => acc + q.passRate, 0) / quizzes.filter(q => q.passRate > 0).length)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Quizzes</h1>
          <p className="text-muted-foreground">Create and manage course quizzes</p>
        </div>
        <Link
          href="/admin/quizzes/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Create Quiz
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Quizzes</p>
              <p className="text-2xl font-bold mt-1">{totalQuizzes}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <FileQuestion className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Published</p>
              <p className="text-2xl font-bold mt-1">{publishedQuizzes}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Attempts</p>
              <p className="text-2xl font-bold mt-1">{totalAttempts.toLocaleString()}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg Pass Rate</p>
              <p className="text-2xl font-bold mt-1">{avgPassRate}%</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Award className="h-5 w-5 text-amber-600 dark:text-amber-400" />
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
                placeholder="Search quizzes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  <button className="flex items-center gap-1 hover:text-foreground">
                    Quiz
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Course</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Questions</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Duration</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  <button className="flex items-center gap-1 hover:text-foreground">
                    Attempts
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Avg Score</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Pass Rate</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuizzes.map((quiz) => (
                <tr
                  key={quiz.id}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                        <FileQuestion className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="font-medium">{quiz.title}</p>
                        <p className="text-xs text-muted-foreground">Updated {quiz.lastUpdated}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm truncate max-w-[200px]">{quiz.course}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{quiz.questions}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <Timer className="h-4 w-4 text-muted-foreground" />
                      <span>{quiz.duration} min</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-medium">{quiz.attempts.toLocaleString()}</span>
                  </td>
                  <td className="p-4">
                    {quiz.avgScore > 0 ? (
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              quiz.avgScore >= 80 ? 'bg-green-500' :
                              quiz.avgScore >= 60 ? 'bg-amber-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${quiz.avgScore}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{quiz.avgScore}%</span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">No data</span>
                    )}
                  </td>
                  <td className="p-4">
                    {quiz.passRate > 0 ? (
                      <span className={`font-medium ${
                        quiz.passRate >= 80 ? 'text-green-600' :
                        quiz.passRate >= 60 ? 'text-amber-600' : 'text-red-600'
                      }`}>
                        {quiz.passRate}%
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">No data</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[quiz.status as keyof typeof statusColors]}`}>
                      {quiz.status === 'published' && <CheckCircle className="h-3 w-3" />}
                      {quiz.status === 'draft' && <Clock className="h-3 w-3" />}
                      {quiz.status.charAt(0).toUpperCase() + quiz.status.slice(1)}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="relative flex justify-end">
                      <button
                        onClick={() => setActionMenuOpen(actionMenuOpen === quiz.id ? null : quiz.id)}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                      {actionMenuOpen === quiz.id && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10">
                          <button className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                            <Eye className="h-4 w-4" />
                            Preview
                          </button>
                          <Link
                            href={`/admin/quizzes/${quiz.id}/edit`}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <Edit className="h-4 w-4" />
                            Edit Quiz
                          </Link>
                          <button className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                            <BarChart className="h-4 w-4" />
                            View Analytics
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
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredQuizzes.length}</span> of{' '}
            <span className="font-medium">{quizzes.length}</span> quizzes
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
