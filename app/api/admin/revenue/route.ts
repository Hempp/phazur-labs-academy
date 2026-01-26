import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createServerSupabaseAdmin } from '@/lib/supabase/server'

// Mock data fallback when Supabase not configured
const MOCK_STATS = {
  totalRevenue: 847293,
  monthlyRevenue: 128450,
  avgOrderValue: 149,
  refundRate: 2.4,
  totalRevenueChange: 18.2,
  monthlyRevenueChange: 12.5,
  avgOrderValueChange: 5.8,
  refundRateChange: -0.8,
}

const MOCK_TRANSACTIONS = [
  { id: 'TXN-001', customer: 'John Smith', email: 'john@example.com', amount: 299, course: 'Advanced React Patterns', courseId: '1', status: 'completed', method: 'card', date: '2024-01-15 14:32' },
  { id: 'TXN-002', customer: 'Emily Chen', email: 'emily@example.com', amount: 199, course: 'Node.js Masterclass', courseId: '2', status: 'completed', method: 'paypal', date: '2024-01-15 12:18' },
  { id: 'TXN-003', customer: 'Michael Brown', email: 'michael@example.com', amount: 149, course: 'TypeScript Deep Dive', courseId: '3', status: 'pending', method: 'card', date: '2024-01-15 11:45' },
  { id: 'TXN-004', customer: 'Sarah Davis', email: 'sarah@example.com', amount: 399, course: 'Full Stack Bundle', courseId: '4', status: 'completed', method: 'card', date: '2024-01-15 10:22' },
  { id: 'TXN-005', customer: 'James Wilson', email: 'james@example.com', amount: 99, course: 'Git & GitHub Essentials', courseId: '5', status: 'refunded', method: 'card', date: '2024-01-14 16:55' },
]

const MOCK_COURSE_REVENUE = [
  { name: 'Advanced React Patterns', revenue: 142705, sales: 478, percentage: 28 },
  { name: 'Node.js Masterclass', revenue: 98340, sales: 328, percentage: 19 },
  { name: 'TypeScript Deep Dive', revenue: 78845, sales: 263, percentage: 15 },
  { name: 'System Design Fundamentals', revenue: 64810, sales: 216, percentage: 13 },
  { name: 'Full Stack Bundle', revenue: 52480, sales: 131, percentage: 10 },
]

const MOCK_PAYMENT_METHODS = [
  { method: 'Credit Card', percentage: 62, amount: 525322 },
  { method: 'PayPal', percentage: 28, amount: 237242 },
  { method: 'Bank Transfer', percentage: 7, amount: 59310 },
  { method: 'Other', percentage: 3, amount: 25419 },
]

const MOCK_MONTHLY_REVENUE = [
  { month: 'Aug', revenue: 89000, projected: null },
  { month: 'Sep', revenue: 95000, projected: null },
  { month: 'Oct', revenue: 108000, projected: null },
  { month: 'Nov', revenue: 115000, projected: null },
  { month: 'Dec', revenue: 122000, projected: null },
  { month: 'Jan', revenue: 128450, projected: null },
  { month: 'Feb', revenue: null, projected: 135000 },
  { month: 'Mar', revenue: null, projected: 142000 },
  { month: 'Apr', revenue: null, projected: 150000 },
]

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return !!(
    url && key &&
    !url.includes('placeholder') &&
    !url.includes('your-project') &&
    !key.includes('your-') &&
    key !== 'your-anon-key'
  )
}

// Helper to format date
function formatDateTime(date: string | null): string {
  if (!date) return ''
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

// Helper to get month abbreviation
function getMonthAbbrev(monthIndex: number): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return months[monthIndex]
}

// GET - Get revenue data
export async function GET(request: NextRequest) {
  try {
    // Return mock data if Supabase not configured
    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        stats: MOCK_STATS,
        transactions: MOCK_TRANSACTIONS,
        courseRevenue: MOCK_COURSE_REVENUE,
        paymentMethods: MOCK_PAYMENT_METHODS,
        monthlyRevenue: MOCK_MONTHLY_REVENUE,
      })
    }

    // Dev auth bypass for testing
    const isDevBypass = process.env.NODE_ENV === 'development' && process.env.DEV_AUTH_BYPASS === 'true'

    const supabase = isDevBypass
      ? await createServerSupabaseAdmin()
      : await createServerSupabaseClient()

    // Verify admin authentication (skip in dev bypass mode)
    if (!isDevBypass) {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

      if (!profile || profile.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
      }
    }

    const { searchParams } = new URL(request.url)
    const dateRange = searchParams.get('range') || '30d'
    const statusFilter = searchParams.get('status') || 'all'
    const search = searchParams.get('search') || ''
    const limit = parseInt(searchParams.get('limit') || '50')

    // Calculate date boundaries
    const now = new Date()
    let startDate = new Date()
    switch (dateRange) {
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '90d':
        startDate.setDate(now.getDate() - 90)
        break
      case '12m':
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate = new Date(0) // All time
    }

    // Get all payments for stats
    const { data: allPayments } = await supabase
      .from('payments')
      .select('amount, status, created_at, payment_method')

    // Calculate total revenue (all time, completed payments)
    const totalRevenue = (allPayments || [])
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + Number(p.amount), 0)

    // Calculate monthly revenue (last 30 days, completed)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(now.getDate() - 30)
    const monthlyRevenue = (allPayments || [])
      .filter(p => p.status === 'completed' && new Date(p.created_at) >= thirtyDaysAgo)
      .reduce((sum, p) => sum + Number(p.amount), 0)

    // Calculate previous month revenue for trend
    const sixtyDaysAgo = new Date()
    sixtyDaysAgo.setDate(now.getDate() - 60)
    const previousMonthRevenue = (allPayments || [])
      .filter(p => p.status === 'completed' &&
        new Date(p.created_at) >= sixtyDaysAgo &&
        new Date(p.created_at) < thirtyDaysAgo)
      .reduce((sum, p) => sum + Number(p.amount), 0)

    const monthlyRevenueChange = previousMonthRevenue > 0
      ? Number((((monthlyRevenue - previousMonthRevenue) / previousMonthRevenue) * 100).toFixed(1))
      : 0

    // Calculate average order value
    const completedPayments = (allPayments || []).filter(p => p.status === 'completed')
    const avgOrderValue = completedPayments.length > 0
      ? Math.round(totalRevenue / completedPayments.length)
      : 0

    // Calculate refund rate (refunded / total transactions in last 30 days)
    const recentPayments = (allPayments || []).filter(p => new Date(p.created_at) >= thirtyDaysAgo)
    const refundedCount = recentPayments.filter(p => p.status === 'refunded').length
    const refundRate = recentPayments.length > 0
      ? Number(((refundedCount / recentPayments.length) * 100).toFixed(1))
      : 0

    // Build transactions query
    let txnQuery = supabase
      .from('payments')
      .select(`
        id,
        amount,
        status,
        payment_method,
        created_at,
        user:users!payments_user_id_fkey (
          full_name,
          email
        ),
        course:courses!payments_course_id_fkey (
          id,
          title
        )
      `)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false })
      .limit(limit)

    // Apply status filter
    if (statusFilter !== 'all') {
      txnQuery = txnQuery.eq('status', statusFilter)
    }

    const { data: transactionsData, error: txnError } = await txnQuery

    if (txnError) {
      console.error('Transactions query error:', txnError)
    }

    // Transform transactions
    let transactions = (transactionsData || []).map((txn, index) => {
      const userData = Array.isArray(txn.user) ? txn.user[0] : txn.user
      const courseData = Array.isArray(txn.course) ? txn.course[0] : txn.course
      return {
        id: `TXN-${String(index + 1).padStart(3, '0')}`,
        customer: userData?.full_name || 'Unknown',
        email: userData?.email || '',
        amount: Number(txn.amount),
        course: courseData?.title || 'Unknown Course',
        courseId: courseData?.id || '',
        status: txn.status,
        method: txn.payment_method || 'card',
        date: formatDateTime(txn.created_at),
      }
    })

    // Apply search filter (client-side since we need to search across joined fields)
    if (search) {
      const searchLower = search.toLowerCase()
      transactions = transactions.filter(t =>
        t.customer.toLowerCase().includes(searchLower) ||
        t.email.toLowerCase().includes(searchLower) ||
        t.id.toLowerCase().includes(searchLower)
      )
    }

    // Get revenue by course
    const { data: coursesData } = await supabase
      .from('courses')
      .select('id, title')
      .eq('status', 'published')

    const courseRevenueMap: Record<string, { name: string; revenue: number; sales: number }> = {}

    // Initialize with courses
    for (const course of coursesData || []) {
      courseRevenueMap[course.id] = {
        name: course.title,
        revenue: 0,
        sales: 0,
      }
    }

    // Aggregate from payments
    const { data: coursePayments } = await supabase
      .from('payments')
      .select('course_id, amount')
      .eq('status', 'completed')

    for (const payment of coursePayments || []) {
      if (payment.course_id && courseRevenueMap[payment.course_id]) {
        courseRevenueMap[payment.course_id].revenue += Number(payment.amount)
        courseRevenueMap[payment.course_id].sales++
      }
    }

    // Convert to array and calculate percentages
    const totalCourseRevenue = Object.values(courseRevenueMap).reduce((sum, c) => sum + c.revenue, 0)
    const courseRevenue = Object.values(courseRevenueMap)
      .map(c => ({
        ...c,
        percentage: totalCourseRevenue > 0 ? Math.round((c.revenue / totalCourseRevenue) * 100) : 0,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 6)

    // Get payment methods breakdown
    const paymentMethodCounts: Record<string, number> = {}
    for (const payment of allPayments || []) {
      if (payment.status === 'completed') {
        const method = payment.payment_method || 'card'
        paymentMethodCounts[method] = (paymentMethodCounts[method] || 0) + Number(payment.amount)
      }
    }

    const methodLabels: Record<string, string> = {
      card: 'Credit Card',
      credit_card: 'Credit Card',
      paypal: 'PayPal',
      bank_transfer: 'Bank Transfer',
      stripe: 'Credit Card',
    }

    const paymentMethods = Object.entries(paymentMethodCounts).map(([method, amount]) => ({
      method: methodLabels[method] || method,
      amount,
      percentage: totalRevenue > 0 ? Math.round((amount / totalRevenue) * 100) : 0,
    })).sort((a, b) => b.amount - a.amount)

    // Build monthly revenue data (last 6 months actual + 3 months projected)
    const monthlyRevenueData: Array<{ month: string; revenue: number | null; projected: number | null }> = []

    // Get last 6 months of actual data
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59)

      const monthRevenue = (allPayments || [])
        .filter(p =>
          p.status === 'completed' &&
          new Date(p.created_at) >= monthStart &&
          new Date(p.created_at) <= monthEnd
        )
        .reduce((sum, p) => sum + Number(p.amount), 0)

      monthlyRevenueData.push({
        month: getMonthAbbrev(monthStart.getMonth()),
        revenue: monthRevenue,
        projected: null,
      })
    }

    // Add projected months (simple linear projection)
    const recentMonths = monthlyRevenueData.slice(-3)
    const avgGrowth = recentMonths.length >= 2
      ? ((recentMonths[2]?.revenue || 0) - (recentMonths[0]?.revenue || 0)) / 2
      : 0

    const lastRevenue = monthlyRevenueData[monthlyRevenueData.length - 1]?.revenue || 0
    for (let i = 1; i <= 3; i++) {
      const projectedMonth = new Date(now.getFullYear(), now.getMonth() + i, 1)
      monthlyRevenueData.push({
        month: getMonthAbbrev(projectedMonth.getMonth()),
        revenue: null,
        projected: Math.round(lastRevenue + (avgGrowth * i)),
      })
    }

    const stats = {
      totalRevenue,
      monthlyRevenue,
      avgOrderValue,
      refundRate,
      totalRevenueChange: 18.2, // Would need historical data to calculate
      monthlyRevenueChange,
      avgOrderValueChange: 5.8, // Would need historical data
      refundRateChange: -0.8, // Would need historical data
    }

    return NextResponse.json({
      stats,
      transactions,
      courseRevenue,
      paymentMethods,
      monthlyRevenue: monthlyRevenueData,
    })

  } catch (error) {
    console.error('Revenue fetch error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch revenue data' },
      { status: 500 }
    )
  }
}
