'use client'

import { useState } from 'react'
import {
  Shield,
  Key,
  Smartphone,
  Lock,
  Eye,
  EyeOff,
  Monitor,
  Globe,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  LogOut,
  Plus,
  Trash2,
  Settings,
  Award,
  Save,
} from 'lucide-react'
import toast from 'react-hot-toast'

// Mock active sessions
const mockSessions = [
  {
    id: '1',
    device: 'MacBook Pro - Chrome',
    location: 'New York, US',
    ip: '192.168.1.1',
    lastActive: 'Now',
    current: true,
  },
  {
    id: '2',
    device: 'iPhone 15 - Safari',
    location: 'New York, US',
    ip: '192.168.1.2',
    lastActive: '2 hours ago',
    current: false,
  },
  {
    id: '3',
    device: 'Windows PC - Firefox',
    location: 'Los Angeles, US',
    ip: '10.0.0.15',
    lastActive: '1 day ago',
    current: false,
  },
]

// Mock audit logs
const mockAuditLogs = [
  { id: '1', action: 'Login', user: 'admin@phazurlabs.com', ip: '192.168.1.1', timestamp: '2 min ago', status: 'success' },
  { id: '2', action: 'Password Changed', user: 'john@example.com', ip: '10.0.0.5', timestamp: '1 hour ago', status: 'success' },
  { id: '3', action: 'Failed Login', user: 'unknown@test.com', ip: '45.33.22.11', timestamp: '3 hours ago', status: 'failed' },
  { id: '4', action: 'Settings Updated', user: 'admin@phazurlabs.com', ip: '192.168.1.1', timestamp: '5 hours ago', status: 'success' },
  { id: '5', action: 'User Suspended', user: 'admin@phazurlabs.com', ip: '192.168.1.1', timestamp: '1 day ago', status: 'success' },
]

export default function SecuritySettingsPage() {
  const [isSaving, setIsSaving] = useState(false)
  const [showIpInput, setShowIpInput] = useState(false)
  const [newIp, setNewIp] = useState('')
  const [sessions, setSessions] = useState(mockSessions)

  const [security, setSecurity] = useState({
    twoFactorEnabled: false,
    passwordMinLength: 8,
    requireUppercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    maxLoginAttempts: 5,
    lockoutDuration: 30,
    sessionTimeout: 60,
    ipAllowlist: ['192.168.1.0/24', '10.0.0.0/8'],
  })

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast.success('Security settings saved!')
    setIsSaving(false)
  }

  const handleLogoutSession = (sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId))
    toast.success('Session terminated')
  }

  const handleLogoutAll = () => {
    setSessions(prev => prev.filter(s => s.current))
    toast.success('All other sessions terminated')
  }

  const addIpToAllowlist = () => {
    if (newIp && !security.ipAllowlist.includes(newIp)) {
      setSecurity(prev => ({
        ...prev,
        ipAllowlist: [...prev.ipAllowlist, newIp],
      }))
      setNewIp('')
      setShowIpInput(false)
      toast.success('IP added to allowlist')
    }
  }

  const removeIpFromAllowlist = (ip: string) => {
    setSecurity(prev => ({
      ...prev,
      ipAllowlist: prev.ipAllowlist.filter(i => i !== ip),
    }))
    toast.success('IP removed from allowlist')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Security Settings</h1>
          <p className="text-muted-foreground">Manage authentication and security policies</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          )}
        </button>
      </div>

      {/* Settings Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700 pb-4">
        <a
          href="/admin/settings"
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <Settings className="h-4 w-4" />
          General
        </a>
        <a
          href="/admin/settings/security"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
        >
          <Shield className="h-4 w-4" />
          Security
        </a>
        <a
          href="/admin/settings/protection"
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <Award className="h-4 w-4" />
          Content Protection
        </a>
        <a
          href="/admin/settings/integrations"
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <Globe className="h-4 w-4" />
          Integrations
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Two-Factor Authentication */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Smartphone className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h2 className="font-semibold">Two-Factor Authentication</h2>
              <p className="text-sm text-muted-foreground">Add extra security to accounts</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div>
              <p className="font-medium text-sm">Require 2FA for Admins</p>
              <p className="text-xs text-muted-foreground">All admin accounts must use 2FA</p>
            </div>
            <button
              onClick={() => setSecurity(prev => ({ ...prev, twoFactorEnabled: !prev.twoFactorEnabled }))}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                security.twoFactorEnabled ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  security.twoFactorEnabled ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {security.twoFactorEnabled && (
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-green-800 dark:text-green-300">2FA is enabled</p>
                <p className="text-green-600 dark:text-green-400">All admin accounts are protected with two-factor authentication</p>
              </div>
            </div>
          )}
        </div>

        {/* Password Policy */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Key className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="font-semibold">Password Policy</h2>
              <p className="text-sm text-muted-foreground">Set password requirements</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Minimum Length</label>
              <input
                type="number"
                min="6"
                max="32"
                value={security.passwordMinLength}
                onChange={(e) => setSecurity(prev => ({ ...prev, passwordMinLength: parseInt(e.target.value) }))}
                className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              {[
                { key: 'requireUppercase', label: 'Require uppercase letters' },
                { key: 'requireNumbers', label: 'Require numbers' },
                { key: 'requireSpecialChars', label: 'Require special characters' },
              ].map((item) => (
                <label key={item.key} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={security[item.key as keyof typeof security] as boolean}
                    onChange={(e) => setSecurity(prev => ({ ...prev, [item.key]: e.target.checked }))}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm">{item.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Login Security */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Lock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h2 className="font-semibold">Login Security</h2>
              <p className="text-sm text-muted-foreground">Protect against brute force attacks</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Max Login Attempts</label>
              <select
                value={security.maxLoginAttempts}
                onChange={(e) => setSecurity(prev => ({ ...prev, maxLoginAttempts: parseInt(e.target.value) }))}
                className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="3">3 attempts</option>
                <option value="5">5 attempts</option>
                <option value="10">10 attempts</option>
                <option value="0">Unlimited</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Lockout Duration (minutes)</label>
              <select
                value={security.lockoutDuration}
                onChange={(e) => setSecurity(prev => ({ ...prev, lockoutDuration: parseInt(e.target.value) }))}
                className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="1440">24 hours</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Session Timeout (minutes)</label>
              <select
                value={security.sessionTimeout}
                onChange={(e) => setSecurity(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
                className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="120">2 hours</option>
                <option value="480">8 hours</option>
                <option value="0">Never</option>
              </select>
            </div>
          </div>
        </div>

        {/* IP Allowlist */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Globe className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="font-semibold">IP Allowlist</h2>
              <p className="text-sm text-muted-foreground">Restrict admin access by IP</p>
            </div>
          </div>

          <div className="space-y-3">
            {security.ipAllowlist.map((ip) => (
              <div key={ip} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <span className="text-sm font-mono">{ip}</span>
                <button
                  onClick={() => removeIpFromAllowlist(ip)}
                  className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}

            {showIpInput ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newIp}
                  onChange={(e) => setNewIp(e.target.value)}
                  placeholder="192.168.1.0/24"
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  onClick={addIpToAllowlist}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm"
                >
                  Add
                </button>
                <button
                  onClick={() => setShowIpInput(false)}
                  className="px-4 py-2 border rounded-lg text-sm"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowIpInput(true)}
                className="w-full flex items-center justify-center gap-2 p-3 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add IP Address
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
              <Monitor className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div>
              <h2 className="font-semibold">Active Sessions</h2>
              <p className="text-sm text-muted-foreground">Manage logged-in devices</p>
            </div>
          </div>
          {sessions.length > 1 && (
            <button
              onClick={handleLogoutAll}
              className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm"
            >
              <LogOut className="h-4 w-4" />
              Logout All Other Sessions
            </button>
          )}
        </div>

        <div className="space-y-3">
          {sessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex items-center gap-4">
                <Monitor className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium text-sm">
                    {session.device}
                    {session.current && (
                      <span className="ml-2 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs">
                        Current
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {session.location} • {session.ip} • {session.lastActive}
                  </p>
                </div>
              </div>
              {!session.current && (
                <button
                  onClick={() => handleLogoutSession(session.id)}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Audit Logs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <Clock className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <h2 className="font-semibold">Audit Logs</h2>
              <p className="text-sm text-muted-foreground">Recent security events</p>
            </div>
          </div>
          <a
            href="/admin/activity"
            className="text-sm text-primary hover:underline"
          >
            View All
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Action</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">User</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">IP Address</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Time</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockAuditLogs.map((log) => (
                <tr key={log.id} className="border-b border-gray-200 dark:border-gray-700 last:border-0">
                  <td className="py-3 px-4 text-sm font-medium">{log.action}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{log.user}</td>
                  <td className="py-3 px-4 text-sm font-mono text-muted-foreground">{log.ip}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{log.timestamp}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      log.status === 'success'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {log.status === 'success' ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <XCircle className="h-3 w-3" />
                      )}
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
