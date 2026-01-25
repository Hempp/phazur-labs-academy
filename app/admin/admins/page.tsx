'use client'

import { useState } from 'react'
import {
  Users,
  Search,
  Plus,
  MoreVertical,
  Mail,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Clock,
  CheckCircle,
  XCircle,
  Ban,
  Trash2,
  Edit,
  Eye,
  Key,
  Activity,
  UserPlus,
  X,
  Loader2,
} from 'lucide-react'
import toast from 'react-hot-toast'

// Mock admin data
const mockAdmins = [
  {
    id: '1',
    name: 'John Admin',
    email: 'john.admin@phazurlabs.com',
    role: 'super_admin',
    status: 'active',
    lastLogin: '5 minutes ago',
    createdAt: '2023-06-15',
    twoFactorEnabled: true,
    permissions: ['all'],
  },
  {
    id: '2',
    name: 'Sarah Content',
    email: 'sarah.content@phazurlabs.com',
    role: 'content_admin',
    status: 'active',
    lastLogin: '2 hours ago',
    createdAt: '2023-09-20',
    twoFactorEnabled: true,
    permissions: ['courses', 'videos', 'content'],
  },
  {
    id: '3',
    name: 'Mike Support',
    email: 'mike.support@phazurlabs.com',
    role: 'support_admin',
    status: 'active',
    lastLogin: '1 day ago',
    createdAt: '2024-01-10',
    twoFactorEnabled: false,
    permissions: ['students', 'support', 'discussions'],
  },
  {
    id: '4',
    name: 'Emily Analytics',
    email: 'emily.analytics@phazurlabs.com',
    role: 'content_admin',
    status: 'inactive',
    lastLogin: '2 weeks ago',
    createdAt: '2023-11-05',
    twoFactorEnabled: false,
    permissions: ['analytics', 'reports'],
  },
]

// Mock activity logs
const mockActivityLogs = [
  { id: '1', admin: 'John Admin', action: 'Updated course "AI Fundamentals"', time: '5 min ago' },
  { id: '2', admin: 'Sarah Content', action: 'Published new video lesson', time: '1 hour ago' },
  { id: '3', admin: 'Mike Support', action: 'Resolved support ticket #1234', time: '3 hours ago' },
  { id: '4', admin: 'John Admin', action: 'Changed site settings', time: '1 day ago' },
  { id: '5', admin: 'Sarah Content', action: 'Created new course draft', time: '2 days ago' },
]

const roleConfig = {
  super_admin: {
    label: 'Super Admin',
    color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    icon: ShieldCheck,
  },
  content_admin: {
    label: 'Content Admin',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    icon: Shield,
  },
  support_admin: {
    label: 'Support Admin',
    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    icon: ShieldAlert,
  },
}

const statusConfig = {
  active: { label: 'Active', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  inactive: { label: 'Inactive', color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400' },
  suspended: { label: 'Suspended', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
}

export default function AdminsPage() {
  const [admins, setAdmins] = useState(mockAdmins)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newAdmin, setNewAdmin] = useState({
    email: '',
    role: 'content_admin',
    sendInvite: true,
  })

  const filteredAdmins = admins.filter(admin => {
    const matchesSearch = admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         admin.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === 'all' || admin.role === roleFilter
    return matchesSearch && matchesRole
  })

  const handleInviteAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAdmin.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newAdmin.email)) {
      toast.error('Please enter a valid email address')
      return
    }

    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1000))

    toast.success(`Invitation sent to ${newAdmin.email}`)
    setNewAdmin({ email: '', role: 'content_admin', sendInvite: true })
    setShowInviteModal(false)
    setIsSubmitting(false)
  }

  const handleSuspendAdmin = (adminId: string) => {
    setAdmins(prev =>
      prev.map(a =>
        a.id === adminId ? { ...a, status: a.status === 'suspended' ? 'active' : 'suspended' } : a
      )
    )
    setActionMenuOpen(null)
    toast.success('Admin status updated')
  }

  const handleRemoveAdmin = (adminId: string) => {
    setAdmins(prev => prev.filter(a => a.id !== adminId))
    setActionMenuOpen(null)
    toast.success('Admin removed')
  }

  // Stats
  const totalAdmins = admins.length
  const activeAdmins = admins.filter(a => a.status === 'active').length
  const with2FA = admins.filter(a => a.twoFactorEnabled).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Admin Users</h1>
          <p className="text-muted-foreground">Manage administrator accounts and permissions</p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <UserPlus className="h-4 w-4" />
          Invite Admin
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Admins</p>
              <p className="text-2xl font-bold mt-1">{totalAdmins}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold mt-1">{activeAdmins}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">2FA Enabled</p>
              <p className="text-2xl font-bold mt-1">{with2FA}/{totalAdmins}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Key className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Admin List */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          {/* Filters */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search admins..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Roles</option>
                <option value="super_admin">Super Admin</option>
                <option value="content_admin">Content Admin</option>
                <option value="support_admin">Support Admin</option>
              </select>
            </div>
          </div>

          {/* Admin Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Admin</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Role</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Last Login</th>
                  <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAdmins.map((admin) => {
                  const RoleIcon = roleConfig[admin.role as keyof typeof roleConfig].icon
                  return (
                    <tr
                      key={admin.id}
                      className="border-b border-gray-200 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center text-white font-semibold">
                            {admin.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-medium">{admin.name}</p>
                            <p className="text-sm text-muted-foreground">{admin.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${roleConfig[admin.role as keyof typeof roleConfig].color}`}>
                          <RoleIcon className="h-3 w-3" />
                          {roleConfig[admin.role as keyof typeof roleConfig].label}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[admin.status as keyof typeof statusConfig].color}`}>
                          {admin.status === 'active' && <CheckCircle className="h-3 w-3" />}
                          {admin.status === 'inactive' && <Clock className="h-3 w-3" />}
                          {admin.status === 'suspended' && <XCircle className="h-3 w-3" />}
                          {statusConfig[admin.status as keyof typeof statusConfig].label}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-muted-foreground">{admin.lastLogin}</span>
                      </td>
                      <td className="p-4">
                        <div className="relative flex justify-end">
                          <button
                            onClick={() => setActionMenuOpen(actionMenuOpen === admin.id ? null : admin.id)}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                          {actionMenuOpen === admin.id && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10">
                              <button className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                                <Eye className="h-4 w-4" />
                                View Activity
                              </button>
                              <button className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                                <Edit className="h-4 w-4" />
                                Edit Permissions
                              </button>
                              <button className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                                <Mail className="h-4 w-4" />
                                Send Email
                              </button>
                              <hr className="my-1 border-gray-200 dark:border-gray-700" />
                              <button
                                onClick={() => handleSuspendAdmin(admin.id)}
                                className={`w-full flex items-center gap-2 px-4 py-2 text-sm ${
                                  admin.status === 'suspended'
                                    ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                                    : 'text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                                }`}
                              >
                                <Ban className="h-4 w-4" />
                                {admin.status === 'suspended' ? 'Reactivate' : 'Suspend'}
                              </button>
                              <button
                                onClick={() => handleRemoveAdmin(admin.id)}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                              >
                                <Trash2 className="h-4 w-4" />
                                Remove Admin
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
        </div>

        {/* Activity Feed */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <Activity className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <h2 className="font-semibold">Recent Activity</h2>
              <p className="text-sm text-muted-foreground">Admin actions log</p>
            </div>
          </div>

          <div className="space-y-4">
            {mockActivityLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <div>
                  <p className="text-sm">
                    <span className="font-medium">{log.admin}</span>{' '}
                    <span className="text-muted-foreground">{log.action}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">{log.time}</p>
                </div>
              </div>
            ))}
          </div>

          <a
            href="/admin/activity"
            className="block mt-4 text-center text-sm text-primary hover:underline"
          >
            View all activity
          </a>
        </div>
      </div>

      {/* Invite Admin Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => !isSubmitting && setShowInviteModal(false)} />
          <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold">Invite Admin</h2>
                <p className="text-sm text-muted-foreground">Send an invitation to join as admin</p>
              </div>
              <button
                onClick={() => !isSubmitting && setShowInviteModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                disabled={isSubmitting}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleInviteAdmin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="admin@company.com"
                  className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Role</label>
                <select
                  value={newAdmin.role}
                  onChange={(e) => setNewAdmin(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
                  disabled={isSubmitting}
                >
                  <option value="super_admin">Super Admin - Full access</option>
                  <option value="content_admin">Content Admin - Courses & content</option>
                  <option value="support_admin">Support Admin - Students & support</option>
                </select>
              </div>

              <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={newAdmin.sendInvite}
                  onChange={(e) => setNewAdmin(prev => ({ ...prev, sendInvite: e.target.checked }))}
                  className="w-4 h-4 rounded border-gray-300"
                  disabled={isSubmitting}
                />
                <span className="text-sm">Send invitation email immediately</span>
              </label>

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 px-4 py-2.5 border rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
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
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4" />
                      Send Invite
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
