'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Users,
  Search,
  Filter,
  Plus,
  MoreVertical,
  Edit2,
  Trash2,
  Ban,
  CheckCircle2,
  Mail,
  Shield,
  GraduationCap,
  UserCog,
  Download,
  ChevronLeft,
  ChevronRight,
  Eye,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { UserAvatar } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

type UserRole = 'student' | 'instructor' | 'admin'
type UserStatus = 'active' | 'inactive' | 'suspended'

interface User {
  id: string
  name: string
  email: string
  avatar: string | null
  role: UserRole
  status: UserStatus
  joinedAt: string
  lastActive: string
  coursesEnrolled?: number
  coursesCreated?: number
  totalSpent?: number
  totalEarnings?: number
}

const mockUsers: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', avatar: null, role: 'student', status: 'active', joinedAt: '2023-06-15', lastActive: '2 hours ago', coursesEnrolled: 5, totalSpent: 245 },
  { id: '2', name: 'Sarah Chen', email: 'sarah@example.com', avatar: null, role: 'instructor', status: 'active', joinedAt: '2023-01-10', lastActive: '1 hour ago', coursesCreated: 8, totalEarnings: 45890 },
  { id: '3', name: 'Mike Johnson', email: 'mike@example.com', avatar: null, role: 'student', status: 'active', joinedAt: '2023-08-22', lastActive: '5 hours ago', coursesEnrolled: 3, totalSpent: 129 },
  { id: '4', name: 'Emily Wilson', email: 'emily@example.com', avatar: null, role: 'instructor', status: 'active', joinedAt: '2023-03-05', lastActive: '3 hours ago', coursesCreated: 4, totalEarnings: 22450 },
  { id: '5', name: 'David Kim', email: 'david@example.com', avatar: null, role: 'admin', status: 'active', joinedAt: '2022-11-20', lastActive: '30 min ago' },
  { id: '6', name: 'Lisa Park', email: 'lisa@example.com', avatar: null, role: 'student', status: 'inactive', joinedAt: '2023-09-10', lastActive: '30 days ago', coursesEnrolled: 2, totalSpent: 89 },
  { id: '7', name: 'James Lee', email: 'james@example.com', avatar: null, role: 'instructor', status: 'suspended', joinedAt: '2023-04-18', lastActive: '15 days ago', coursesCreated: 2, totalEarnings: 8920 },
  { id: '8', name: 'Anna Smith', email: 'anna@example.com', avatar: null, role: 'student', status: 'active', joinedAt: '2024-01-05', lastActive: '1 day ago', coursesEnrolled: 1, totalSpent: 49 },
  { id: '9', name: 'Robert Brown', email: 'robert@example.com', avatar: null, role: 'student', status: 'active', joinedAt: '2023-12-15', lastActive: '4 hours ago', coursesEnrolled: 4, totalSpent: 196 },
  { id: '10', name: 'Jennifer Davis', email: 'jennifer@example.com', avatar: null, role: 'instructor', status: 'active', joinedAt: '2023-07-22', lastActive: '6 hours ago', coursesCreated: 3, totalEarnings: 15680 },
]

const roleFilters: { value: UserRole | 'all'; label: string }[] = [
  { value: 'all', label: 'All Users' },
  { value: 'student', label: 'Students' },
  { value: 'instructor', label: 'Instructors' },
  { value: 'admin', label: 'Admins' },
]

const statusFilters: { value: UserStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'suspended', label: 'Suspended' },
]

function RoleBadge({ role }: { role: UserRole }) {
  return (
    <Badge
      variant={role === 'admin' ? 'destructive' : role === 'instructor' ? 'default' : 'secondary'}
      className="capitalize"
    >
      {role}
    </Badge>
  )
}

function StatusBadge({ status }: { status: UserStatus }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'capitalize',
        status === 'active' && 'border-emerald-500 text-emerald-500',
        status === 'inactive' && 'border-gray-500 text-gray-500',
        status === 'suspended' && 'border-red-500 text-red-500'
      )}
    >
      {status}
    </Badge>
  )
}

function UserMenu({ user, onClose }: { user: User; onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 mt-1 w-48 bg-card rounded-lg border shadow-lg py-1 z-50">
        <Link
          href={`/dashboard/admin/users/${user.id}`}
          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted"
        >
          <Eye className="h-4 w-4" />
          View Profile
        </Link>
        <Link
          href={`/dashboard/admin/users/${user.id}/edit`}
          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted"
        >
          <Edit2 className="h-4 w-4" />
          Edit User
        </Link>
        <button className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted w-full">
          <Mail className="h-4 w-4" />
          Send Email
        </button>
        <div className="border-t my-1" />
        {user.status === 'suspended' ? (
          <button className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted w-full text-emerald-500">
            <CheckCircle2 className="h-4 w-4" />
            Reactivate
          </button>
        ) : (
          <button className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted w-full text-amber-500">
            <Ban className="h-4 w-4" />
            Suspend
          </button>
        )}
        <button className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted w-full text-destructive">
          <Trash2 className="h-4 w-4" />
          Delete User
        </button>
      </div>
    </>
  )
}

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [menuUserId, setMenuUserId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const usersPerPage = 10

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  )

  const stats = {
    total: mockUsers.length,
    students: mockUsers.filter(u => u.role === 'student').length,
    instructors: mockUsers.filter(u => u.role === 'instructor').length,
    admins: mockUsers.filter(u => u.role === 'admin').length,
    active: mockUsers.filter(u => u.status === 'active').length,
  }

  const toggleSelectAll = () => {
    if (selectedUsers.length === paginatedUsers.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(paginatedUsers.map(u => u.id))
    }
  }

  const toggleSelectUser = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId))
    } else {
      setSelectedUsers([...selectedUsers, userId])
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage all platform users
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm hover:bg-muted transition-colors">
            <Download className="h-4 w-4" />
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            <Plus className="h-4 w-4" />
            Add User
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-xs text-muted-foreground">Total Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <GraduationCap className="h-6 w-6 mx-auto text-blue-500 mb-2" />
            <p className="text-2xl font-bold">{stats.students}</p>
            <p className="text-xs text-muted-foreground">Students</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <UserCog className="h-6 w-6 mx-auto text-purple-500 mb-2" />
            <p className="text-2xl font-bold">{stats.instructors}</p>
            <p className="text-xs text-muted-foreground">Instructors</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Shield className="h-6 w-6 mx-auto text-amber-500 mb-2" />
            <p className="text-2xl font-bold">{stats.admins}</p>
            <p className="text-xs text-muted-foreground">Admins</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle2 className="h-6 w-6 mx-auto text-emerald-500 mb-2" />
            <p className="text-2xl font-bold">{stats.active}</p>
            <p className="text-xs text-muted-foreground">Active</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as UserRole | 'all')}
            className="px-4 py-2.5 bg-muted/50 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {roleFilters.map((filter) => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as UserStatus | 'all')}
            className="px-4 py-2.5 bg-muted/50 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {statusFilters.map((filter) => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <div className="flex items-center gap-4 p-4 bg-primary/10 rounded-lg">
          <span className="text-sm font-medium">{selectedUsers.length} selected</span>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-sm border rounded hover:bg-muted transition-colors">
              Send Email
            </button>
            <button className="px-3 py-1.5 text-sm border rounded hover:bg-muted transition-colors">
              Change Role
            </button>
            <button className="px-3 py-1.5 text-sm border border-red-200 text-red-500 rounded hover:bg-red-50 transition-colors">
              Suspend
            </button>
          </div>
          <button
            onClick={() => setSelectedUsers([])}
            className="ml-auto text-sm text-muted-foreground hover:text-foreground"
          >
            Clear selection
          </button>
        </div>
      )}

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-muted-foreground/25"
                    />
                  </th>
                  <th className="p-4 text-left text-sm font-medium">User</th>
                  <th className="p-4 text-left text-sm font-medium">Role</th>
                  <th className="p-4 text-left text-sm font-medium">Status</th>
                  <th className="p-4 text-left text-sm font-medium hidden md:table-cell">Joined</th>
                  <th className="p-4 text-left text-sm font-medium hidden lg:table-cell">Last Active</th>
                  <th className="p-4 text-left text-sm font-medium hidden lg:table-cell">Stats</th>
                  <th className="p-4 text-right text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => toggleSelectUser(user.id)}
                        className="rounded border-muted-foreground/25"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <UserAvatar
                          user={{ name: user.name, avatar_url: user.avatar }}
                          size="md"
                        />
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="p-4">
                      <StatusBadge status={user.status} />
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <span className="text-sm text-muted-foreground">
                        {new Date(user.joinedAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      <span className="text-sm text-muted-foreground">{user.lastActive}</span>
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      <span className="text-sm">
                        {user.role === 'student' && user.coursesEnrolled !== undefined && (
                          <>{user.coursesEnrolled} courses • ${user.totalSpent}</>
                        )}
                        {user.role === 'instructor' && user.coursesCreated !== undefined && (
                          <>{user.coursesCreated} courses • ${user.totalEarnings?.toLocaleString()}</>
                        )}
                        {user.role === 'admin' && <>System Admin</>}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="relative inline-block">
                        <button
                          onClick={() => setMenuUserId(menuUserId === user.id ? null : user.id)}
                          className="p-2 hover:bg-muted rounded-lg transition-colors"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        {menuUserId === user.id && (
                          <UserMenu user={user} onClose={() => setMenuUserId(null)} />
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
              Showing {(currentPage - 1) * usersPerPage + 1} to{' '}
              {Math.min(currentPage * usersPerPage, filteredUsers.length)} of{' '}
              {filteredUsers.length} users
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
