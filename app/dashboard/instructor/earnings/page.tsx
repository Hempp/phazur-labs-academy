'use client'

import { useState, useEffect } from 'react'
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  CreditCard,
  Calendar,
  ArrowUpRight,
  Download,
  Filter,
  Loader2,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'

interface EarningsStats {
  total_earnings: number
  pending_payout: number
  this_month: number
  last_month: number
  total_students: number
  total_courses: number
  avg_course_price: number
}

interface Transaction {
  id: string
  type: 'sale' | 'payout' | 'refund'
  amount: number
  course_title: string
  student_name: string
  date: string
  status: 'completed' | 'pending' | 'processing'
}

interface CourseEarning {
  id: string
  title: string
  students: number
  earnings: number
  this_month: number
  price: number
}

// Mock data for development
const mockStats: EarningsStats = {
  total_earnings: 45680,
  pending_payout: 3420,
  this_month: 8240,
  last_month: 6890,
  total_students: 1284,
  total_courses: 8,
  avg_course_price: 49,
}

const mockTransactions: Transaction[] = [
  { id: '1', type: 'sale', amount: 79, course_title: 'Advanced React Patterns', student_name: 'John Doe', date: '2026-01-26T10:30:00Z', status: 'completed' },
  { id: '2', type: 'sale', amount: 49, course_title: 'TypeScript Fundamentals', student_name: 'Jane Smith', date: '2026-01-25T14:20:00Z', status: 'completed' },
  { id: '3', type: 'payout', amount: 2500, course_title: '', student_name: '', date: '2026-01-24T09:00:00Z', status: 'processing' },
  { id: '4', type: 'refund', amount: -49, course_title: 'TypeScript Fundamentals', student_name: 'Alex Johnson', date: '2026-01-23T16:45:00Z', status: 'completed' },
  { id: '5', type: 'sale', amount: 99, course_title: 'Full Stack Masterclass', student_name: 'Emily Brown', date: '2026-01-22T11:15:00Z', status: 'completed' },
]

const mockCourseEarnings: CourseEarning[] = [
  { id: '1', title: 'Advanced React Patterns', students: 342, earnings: 15800, this_month: 2400, price: 79 },
  { id: '2', title: 'TypeScript Fundamentals', students: 528, earnings: 12650, this_month: 1890, price: 49 },
  { id: '3', title: 'Full Stack Masterclass', students: 186, earnings: 9280, this_month: 1650, price: 99 },
  { id: '4', title: 'Node.js Best Practices', students: 228, earnings: 7950, this_month: 1300, price: 59 },
]

export default function InstructorEarningsPage() {
  const [stats, setStats] = useState<EarningsStats | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [courseEarnings, setCourseEarnings] = useState<CourseEarning[]>([])
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('30d')

  useEffect(() => {
    // In production, fetch from API
    const fetchData = async () => {
      setLoading(true)
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))

      setStats(mockStats)
      setTransactions(mockTransactions)
      setCourseEarnings(mockCourseEarnings)
      setLoading(false)
    }

    fetchData()
  }, [dateRange])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getGrowthPercentage = () => {
    if (!stats || stats.last_month === 0) return 0
    return Math.round(((stats.this_month - stats.last_month) / stats.last_month) * 100)
  }

  const handleExport = () => {
    const data = {
      stats,
      transactions,
      courseEarnings,
      exportedAt: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `earnings-report-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const growth = getGrowthPercentage()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Earnings</h1>
          <p className="text-muted-foreground">Track your revenue and payouts</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border rounded-lg bg-background"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="year">This year</option>
          </select>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
                <p className="text-2xl font-bold">{formatCurrency(stats?.total_earnings || 0)}</p>
              </div>
              <div className="p-3 rounded-full bg-emerald-100 dark:bg-emerald-900/50">
                <DollarSign className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm">
              {growth >= 0 ? (
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span className={growth >= 0 ? 'text-emerald-600' : 'text-red-600'}>
                {growth >= 0 ? '+' : ''}{growth}%
              </span>
              <span className="text-muted-foreground">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Payout</p>
                <p className="text-2xl font-bold">{formatCurrency(stats?.pending_payout || 0)}</p>
              </div>
              <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900/50">
                <CreditCard className="h-5 w-5 text-amber-600" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Next payout in 5 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">{formatCurrency(stats?.this_month || 0)}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/50">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="mt-2">
              <Progress value={65} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">65% of monthly goal</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold">{stats?.total_students?.toLocaleString() || 0}</p>
              </div>
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/50">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Across {stats?.total_courses || 0} courses
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
          <TabsTrigger value="courses">By Course</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Your recent sales, payouts, and refunds</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${
                        tx.type === 'sale' ? 'bg-emerald-100 dark:bg-emerald-900/50' :
                        tx.type === 'payout' ? 'bg-blue-100 dark:bg-blue-900/50' :
                        'bg-red-100 dark:bg-red-900/50'
                      }`}>
                        {tx.type === 'sale' && <ArrowUpRight className="h-4 w-4 text-emerald-600" />}
                        {tx.type === 'payout' && <CreditCard className="h-4 w-4 text-blue-600" />}
                        {tx.type === 'refund' && <TrendingDown className="h-4 w-4 text-red-600" />}
                      </div>
                      <div>
                        <p className="font-medium">
                          {tx.type === 'sale' && tx.course_title}
                          {tx.type === 'payout' && 'Payout to Bank Account'}
                          {tx.type === 'refund' && `Refund: ${tx.course_title}`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {tx.student_name && `${tx.student_name} • `}{formatDate(tx.date)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${
                        tx.amount > 0 ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                      </p>
                      <Badge variant={
                        tx.status === 'completed' ? 'default' :
                        tx.status === 'processing' ? 'secondary' : 'outline'
                      }>
                        {tx.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses">
          <Card>
            <CardHeader>
              <CardTitle>Earnings by Course</CardTitle>
              <CardDescription>Revenue breakdown for each of your courses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {courseEarnings.map((course) => (
                  <div
                    key={course.id}
                    className="p-4 rounded-lg border"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <BookOpen className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{course.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {course.students} students • {formatCurrency(course.price)} per course
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency(course.earnings)}</p>
                        <p className="text-sm text-emerald-600">
                          +{formatCurrency(course.this_month)} this month
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={(course.earnings / (stats?.total_earnings || 1)) * 100}
                        className="h-2 flex-1"
                      />
                      <span className="text-sm text-muted-foreground w-12">
                        {Math.round((course.earnings / (stats?.total_earnings || 1)) * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Monthly earnings over time</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Placeholder for chart */}
                <div className="h-64 flex items-center justify-center bg-muted/50 rounded-lg">
                  <p className="text-muted-foreground">Revenue chart coming soon</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing</CardTitle>
                <CardDescription>Your best-selling courses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {courseEarnings.slice(0, 3).map((course, idx) => (
                    <div key={course.id} className="flex items-center gap-3">
                      <span className={`w-6 h-6 flex items-center justify-center text-sm font-bold rounded ${
                        idx === 0 ? 'bg-amber-100 text-amber-700' :
                        idx === 1 ? 'bg-gray-100 text-gray-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {idx + 1}
                      </span>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{course.title}</p>
                        <p className="text-xs text-muted-foreground">{course.students} students</p>
                      </div>
                      <p className="font-bold">{formatCurrency(course.earnings)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Payout Schedule</CardTitle>
                <CardDescription>Upcoming and recent payouts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Next Payout</p>
                        <p className="text-sm text-muted-foreground">January 31, 2026</p>
                      </div>
                    </div>
                    <p className="font-bold text-blue-600">{formatCurrency(stats?.pending_payout || 0)}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Payouts are processed on the 15th and last day of each month for balances over $50.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
