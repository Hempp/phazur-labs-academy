'use client'

import { useState } from 'react'
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Receipt,
  RefreshCcw,
  Download,
  Calendar,
  ChevronDown,
  Search,
  Filter,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  PieChart
} from 'lucide-react'

// Mock revenue data
const statsCards = [
  {
    title: 'Total Revenue',
    value: '$847,293',
    change: '+18.2%',
    trend: 'up',
    icon: DollarSign,
    color: 'green',
    subtitle: 'All time'
  },
  {
    title: 'Monthly Revenue',
    value: '$128,450',
    change: '+12.5%',
    trend: 'up',
    icon: TrendingUp,
    color: 'blue',
    subtitle: 'January 2024'
  },
  {
    title: 'Avg. Order Value',
    value: '$149',
    change: '+5.8%',
    trend: 'up',
    icon: Receipt,
    color: 'purple',
    subtitle: 'Per transaction'
  },
  {
    title: 'Refund Rate',
    value: '2.4%',
    change: '-0.8%',
    trend: 'down',
    icon: RefreshCcw,
    color: 'amber',
    subtitle: 'Last 30 days'
  }
]

const transactions = [
  { id: 'TXN-001', customer: 'John Smith', email: 'john@example.com', amount: 299, course: 'Advanced React Patterns', status: 'completed', method: 'card', date: '2024-01-15 14:32' },
  { id: 'TXN-002', customer: 'Emily Chen', email: 'emily@example.com', amount: 199, course: 'Node.js Masterclass', status: 'completed', method: 'paypal', date: '2024-01-15 12:18' },
  { id: 'TXN-003', customer: 'Michael Brown', email: 'michael@example.com', amount: 149, course: 'TypeScript Deep Dive', status: 'pending', method: 'card', date: '2024-01-15 11:45' },
  { id: 'TXN-004', customer: 'Sarah Davis', email: 'sarah@example.com', amount: 399, course: 'Full Stack Bundle', status: 'completed', method: 'card', date: '2024-01-15 10:22' },
  { id: 'TXN-005', customer: 'James Wilson', email: 'james@example.com', amount: 99, course: 'Git & GitHub Essentials', status: 'refunded', method: 'card', date: '2024-01-14 16:55' },
  { id: 'TXN-006', customer: 'Lisa Anderson', email: 'lisa@example.com', amount: 249, course: 'System Design Fundamentals', status: 'completed', method: 'paypal', date: '2024-01-14 14:30' },
  { id: 'TXN-007', customer: 'David Taylor', email: 'david@example.com', amount: 199, course: 'AWS Solutions Architect', status: 'failed', method: 'card', date: '2024-01-14 12:10' },
  { id: 'TXN-008', customer: 'Jennifer Martinez', email: 'jennifer@example.com', amount: 349, course: 'DevOps Professional', status: 'completed', method: 'card', date: '2024-01-14 09:45' }
]

const courseRevenue = [
  { name: 'Advanced React Patterns', revenue: 142705, sales: 478, percentage: 28 },
  { name: 'Node.js Masterclass', revenue: 98340, sales: 328, percentage: 19 },
  { name: 'TypeScript Deep Dive', revenue: 78845, sales: 263, percentage: 15 },
  { name: 'System Design Fundamentals', revenue: 64810, sales: 216, percentage: 13 },
  { name: 'Full Stack Bundle', revenue: 52480, sales: 131, percentage: 10 },
  { name: 'Other Courses', revenue: 76800, sales: 384, percentage: 15 }
]

const paymentMethods = [
  { method: 'Credit Card', percentage: 62, amount: '$525,322', icon: CreditCard },
  { method: 'PayPal', percentage: 28, amount: '$237,242', icon: DollarSign },
  { method: 'Bank Transfer', percentage: 7, amount: '$59,310', icon: Receipt },
  { method: 'Other', percentage: 3, amount: '$25,419', icon: PieChart }
]

const monthlyRevenue = [
  { month: 'Aug', revenue: 89000, projected: null },
  { month: 'Sep', revenue: 95000, projected: null },
  { month: 'Oct', revenue: 108000, projected: null },
  { month: 'Nov', revenue: 115000, projected: null },
  { month: 'Dec', revenue: 122000, projected: null },
  { month: 'Jan', revenue: 128450, projected: null },
  { month: 'Feb', revenue: null, projected: 135000 },
  { month: 'Mar', revenue: null, projected: 142000 },
  { month: 'Apr', revenue: null, projected: 150000 }
]

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle }> = {
  completed: { label: 'Completed', color: 'text-green-500 bg-green-500/10', icon: CheckCircle },
  pending: { label: 'Pending', color: 'text-amber-500 bg-amber-500/10', icon: Clock },
  refunded: { label: 'Refunded', color: 'text-blue-500 bg-blue-500/10', icon: RefreshCcw },
  failed: { label: 'Failed', color: 'text-red-500 bg-red-500/10', icon: XCircle }
}

const colorClasses: Record<string, { bg: string; text: string }> = {
  green: { bg: 'bg-green-500/10', text: 'text-green-500' },
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-500' },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-500' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-500' }
}

export default function RevenuePage() {
  const [dateRange, setDateRange] = useState('30d')
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  const filteredTransactions = transactions.filter(txn => {
    const matchesStatus = statusFilter === 'all' || txn.status === statusFilter
    const matchesSearch = txn.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          txn.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          txn.id.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const maxRevenue = Math.max(...monthlyRevenue.map(m => m.revenue || m.projected || 0))

  const handleExport = () => {
    const csvContent = [
      ['Transaction ID', 'Customer', 'Email', 'Amount', 'Course', 'Status', 'Method', 'Date'],
      ...transactions.map(t => [t.id, t.customer, t.email, `$${t.amount}`, t.course, t.status, t.method, t.date])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Revenue</h1>
          <p className="text-muted-foreground">Track earnings, transactions, and financial metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="pl-10 pr-8 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="12m">Last 12 months</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon
          const colors = colorClasses[stat.color]
          return (
            <div key={stat.title} className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${colors.bg}`}>
                  <Icon className={`h-5 w-5 ${colors.text}`} />
                </div>
                <span className={`flex items-center gap-1 text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-500' : 'text-green-500'
                }`}>
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
            </div>
          )
        })}
      </div>

      {/* Revenue Chart & Payment Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Revenue Overview</h2>
              <p className="text-sm text-muted-foreground">Actual vs projected revenue</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-sm text-muted-foreground">Actual</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-primary/30 border-2 border-dashed border-primary" />
                <span className="text-sm text-muted-foreground">Projected</span>
              </div>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="flex items-end justify-between gap-3 h-64">
            {monthlyRevenue.map((data) => (
              <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full h-48 flex items-end">
                  {data.revenue ? (
                    <div
                      className="w-full bg-primary rounded-t hover:bg-primary/90 transition-colors"
                      style={{ height: `${(data.revenue / maxRevenue) * 100}%` }}
                      title={`$${data.revenue.toLocaleString()}`}
                    />
                  ) : (
                    <div
                      className="w-full bg-primary/30 border-2 border-dashed border-primary rounded-t"
                      style={{ height: `${((data.projected || 0) / maxRevenue) * 100}%` }}
                      title={`$${(data.projected || 0).toLocaleString()} (projected)`}
                    />
                  )}
                </div>
                <span className="text-sm text-muted-foreground">{data.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-6">Payment Methods</h2>
          <div className="space-y-4">
            {paymentMethods.map((pm) => {
              const Icon = pm.icon
              return (
                <div key={pm.method} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">{pm.method}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{pm.amount}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${pm.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-foreground w-10">{pm.percentage}%</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Revenue by Course */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6">Revenue by Course</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courseRevenue.map((course, index) => (
            <div key={course.name} className="flex items-center gap-4 p-4 bg-accent/50 rounded-lg">
              <span className={`w-8 h-8 flex items-center justify-center text-sm font-bold rounded-lg ${
                index === 0 ? 'bg-amber-500 text-white' :
                index === 1 ? 'bg-gray-400 text-white' :
                index === 2 ? 'bg-amber-700 text-white' :
                'bg-muted text-muted-foreground'
              }`}>
                {index + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{course.name}</p>
                <p className="text-sm text-muted-foreground">{course.sales} sales</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-foreground">${course.revenue.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">{course.percentage}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-lg font-semibold text-foreground">Recent Transactions</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary w-64"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="refunded">Refunded</option>
                <option value="failed">Failed</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Transaction</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Customer</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Course</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Amount</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((txn) => {
                const status = statusConfig[txn.status]
                const StatusIcon = status.icon
                return (
                  <tr key={txn.id} className="border-b border-border last:border-0 hover:bg-accent/50">
                    <td className="py-4 px-4">
                      <span className="font-mono text-sm text-foreground">{txn.id}</span>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-medium text-foreground">{txn.customer}</p>
                      <p className="text-sm text-muted-foreground">{txn.email}</p>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-foreground">{txn.course}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-semibold text-foreground">${txn.amount}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        <StatusIcon className="h-3 w-3" />
                        {status.label}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-muted-foreground">{txn.date}</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="relative">
                        <button
                          onClick={() => setOpenMenu(openMenu === txn.id ? null : txn.id)}
                          className="p-2 hover:bg-accent rounded-lg transition-colors"
                        >
                          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                        </button>
                        {openMenu === txn.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
                            <div className="absolute right-0 top-full mt-1 w-48 bg-popover border border-border rounded-lg shadow-lg z-20 py-1">
                              <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-accent">
                                <Eye className="h-4 w-4" />
                                View Details
                              </button>
                              <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-accent">
                                <FileText className="h-4 w-4" />
                                Download Receipt
                              </button>
                              {txn.status === 'completed' && (
                                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-accent">
                                  <RefreshCcw className="h-4 w-4" />
                                  Process Refund
                                </button>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No transactions found matching your filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
