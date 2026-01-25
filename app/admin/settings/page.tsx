'use client'

import { useState } from 'react'
import {
  Settings,
  Globe,
  Clock,
  DollarSign,
  Languages,
  Upload,
  Save,
  RotateCcw,
  GraduationCap,
  Award,
  Mail,
  Bell,
  Shield,
  Palette,
  CheckCircle,
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false)
  const [settings, setSettings] = useState({
    siteName: 'Phazur Labs Academy',
    siteDescription: 'Master AI & technology with expert-led courses',
    supportEmail: 'support@phazurlabs.com',
    timezone: 'America/New_York',
    language: 'en',
    currency: 'USD',
    enrollmentMode: 'open',
    requireApproval: false,
    enableCertificates: true,
    certificateTemplate: 'modern',
    enableNotifications: true,
    maintenanceMode: false,
  })

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast.success('Settings saved successfully!')
    setIsSaving(false)
  }

  const handleReset = () => {
    setSettings({
      siteName: 'Phazur Labs Academy',
      siteDescription: 'Master AI & technology with expert-led courses',
      supportEmail: 'support@phazurlabs.com',
      timezone: 'America/New_York',
      language: 'en',
      currency: 'USD',
      enrollmentMode: 'open',
      requireApproval: false,
      enableCertificates: true,
      certificateTemplate: 'modern',
      enableNotifications: true,
      maintenanceMode: false,
    })
    toast.success('Settings reset to defaults')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">General Settings</h1>
          <p className="text-muted-foreground">Configure your platform settings and preferences</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
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
      </div>

      {/* Settings Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700 pb-4">
        <a
          href="/admin/settings"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
        >
          <Settings className="h-4 w-4" />
          General
        </a>
        <a
          href="/admin/settings/security"
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
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
        {/* Site Information */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="font-semibold">Site Information</h2>
              <p className="text-sm text-muted-foreground">Basic platform details</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Site Name</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings(prev => ({ ...prev, siteName: e.target.value }))}
                className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Site Description</label>
              <textarea
                value={settings.siteDescription}
                onChange={(e) => setSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
                rows={3}
                className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Support Email</label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings(prev => ({ ...prev, supportEmail: e.target.value }))}
                className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Site Logo</label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center text-white font-bold text-2xl">
                  P
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <Upload className="h-4 w-4" />
                  Upload New Logo
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Regional Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h2 className="font-semibold">Regional Settings</h2>
              <p className="text-sm text-muted-foreground">Timezone, language, and currency</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Timezone</label>
              <select
                value={settings.timezone}
                onChange={(e) => setSettings(prev => ({ ...prev, timezone: e.target.value }))}
                className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="UTC">UTC</option>
                <option value="Europe/London">London (GMT)</option>
                <option value="Europe/Paris">Paris (CET)</option>
                <option value="Asia/Tokyo">Tokyo (JST)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Language</label>
              <select
                value={settings.language}
                onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
                className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="pt">Portuguese</option>
                <option value="ja">Japanese</option>
                <option value="zh">Chinese</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Currency</label>
              <select
                value={settings.currency}
                onChange={(e) => setSettings(prev => ({ ...prev, currency: e.target.value }))}
                className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="USD">US Dollar (USD)</option>
                <option value="EUR">Euro (EUR)</option>
                <option value="GBP">British Pound (GBP)</option>
                <option value="CAD">Canadian Dollar (CAD)</option>
                <option value="AUD">Australian Dollar (AUD)</option>
                <option value="JPY">Japanese Yen (JPY)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Enrollment Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="font-semibold">Enrollment Settings</h2>
              <p className="text-sm text-muted-foreground">Control student registration</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Enrollment Mode</label>
              <select
                value={settings.enrollmentMode}
                onChange={(e) => setSettings(prev => ({ ...prev, enrollmentMode: e.target.value }))}
                className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="open">Open Registration</option>
                <option value="invite">Invite Only</option>
                <option value="closed">Closed</option>
              </select>
              <p className="text-xs text-muted-foreground mt-1">
                {settings.enrollmentMode === 'open' && 'Anyone can create an account'}
                {settings.enrollmentMode === 'invite' && 'Only invited users can register'}
                {settings.enrollmentMode === 'closed' && 'Registration is disabled'}
              </p>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div>
                <p className="font-medium text-sm">Require Approval</p>
                <p className="text-xs text-muted-foreground">Manually approve new registrations</p>
              </div>
              <button
                onClick={() => setSettings(prev => ({ ...prev, requireApproval: !prev.requireApproval }))}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.requireApproval ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.requireApproval ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Certificate Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Award className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h2 className="font-semibold">Certificate Settings</h2>
              <p className="text-sm text-muted-foreground">Customize completion certificates</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div>
                <p className="font-medium text-sm">Enable Certificates</p>
                <p className="text-xs text-muted-foreground">Issue certificates on course completion</p>
              </div>
              <button
                onClick={() => setSettings(prev => ({ ...prev, enableCertificates: !prev.enableCertificates }))}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.enableCertificates ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.enableCertificates ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {settings.enableCertificates && (
              <div>
                <label className="block text-sm font-medium mb-2">Certificate Template</label>
                <div className="grid grid-cols-3 gap-3">
                  {['modern', 'classic', 'minimal'].map((template) => (
                    <button
                      key={template}
                      onClick={() => setSettings(prev => ({ ...prev, certificateTemplate: template }))}
                      className={`p-4 border-2 rounded-lg text-center transition-colors ${
                        settings.certificateTemplate === template
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className="w-full h-12 rounded bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 mb-2" />
                      <p className="text-sm font-medium capitalize">{template}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
              <Bell className="h-5 w-5 text-pink-600 dark:text-pink-400" />
            </div>
            <div>
              <h2 className="font-semibold">Notification Settings</h2>
              <p className="text-sm text-muted-foreground">Configure system notifications</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div>
                <p className="font-medium text-sm">Enable Notifications</p>
                <p className="text-xs text-muted-foreground">Send in-app notifications</p>
              </div>
              <button
                onClick={() => setSettings(prev => ({ ...prev, enableNotifications: !prev.enableNotifications }))}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.enableNotifications ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.enableNotifications ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Maintenance Mode */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <Settings className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h2 className="font-semibold">Maintenance Mode</h2>
              <p className="text-sm text-muted-foreground">Temporarily disable the site</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <div>
              <p className="font-medium text-sm text-red-700 dark:text-red-400">Maintenance Mode</p>
              <p className="text-xs text-red-600 dark:text-red-500">Site will be inaccessible to users</p>
            </div>
            <button
              onClick={() => setSettings(prev => ({ ...prev, maintenanceMode: !prev.maintenanceMode }))}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                settings.maintenanceMode ? 'bg-red-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.maintenanceMode ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          {settings.maintenanceMode && (
            <p className="mt-3 text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Maintenance mode is currently active
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
