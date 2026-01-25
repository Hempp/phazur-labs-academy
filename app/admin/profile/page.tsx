'use client'

import { useState } from 'react'
import {
  User,
  Mail,
  Camera,
  Lock,
  Bell,
  Save,
  X,
  Eye,
  EyeOff,
  Check,
  Shield,
  Smartphone,
  Globe,
  MessageSquare,
  FileText,
  AlertCircle
} from 'lucide-react'
import toast from 'react-hot-toast'

// Mock current user data
const currentUser = {
  id: 'admin-001',
  name: 'Sarah Johnson',
  email: 'sarah.johnson@phazurlabs.com',
  bio: 'Senior Administrator at Phazur Labs Academy. Passionate about education technology and student success.',
  avatar: null as string | null,
  role: 'Super Admin',
  joinedDate: '2023-06-15',
  lastLogin: '2024-01-15 09:32 AM',
  timezone: 'America/New_York',
  language: 'en',
  twoFactorEnabled: true
}

const notificationPreferences = [
  { id: 'email_new_student', label: 'New Student Enrollments', description: 'Get notified when a new student enrolls', category: 'students', icon: User },
  { id: 'email_course_complete', label: 'Course Completions', description: 'Get notified when students complete courses', category: 'students', icon: Check },
  { id: 'email_support_ticket', label: 'Support Tickets', description: 'Get notified of new support requests', category: 'support', icon: MessageSquare },
  { id: 'email_system_alerts', label: 'System Alerts', description: 'Critical system notifications', category: 'system', icon: AlertCircle },
  { id: 'email_weekly_report', label: 'Weekly Reports', description: 'Receive weekly analytics summary', category: 'reports', icon: FileText },
  { id: 'push_notifications', label: 'Push Notifications', description: 'Enable browser push notifications', category: 'general', icon: Bell },
  { id: 'sms_alerts', label: 'SMS Alerts', description: 'Receive critical alerts via SMS', category: 'general', icon: Smartphone },
]

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: currentUser.name,
    email: currentUser.email,
    bio: currentUser.bio,
    timezone: currentUser.timezone,
    language: currentUser.language
  })

  const [avatarPreview, setAvatarPreview] = useState<string | null>(currentUser.avatar)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Password change state
  const [showPasswordSection, setShowPasswordSection] = useState(false)
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  // Notification preferences state
  const [notifications, setNotifications] = useState<Record<string, boolean>>({
    email_new_student: true,
    email_course_complete: true,
    email_support_ticket: true,
    email_system_alerts: true,
    email_weekly_report: false,
    push_notifications: true,
    sms_alerts: false
  })

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    setIsEditing(false)
    toast.success('Profile updated successfully')
  }

  const handleCancelEdit = () => {
    setProfile({
      name: currentUser.name,
      email: currentUser.email,
      bio: currentUser.bio,
      timezone: currentUser.timezone,
      language: currentUser.language
    })
    setAvatarPreview(currentUser.avatar)
    setIsEditing(false)
  }

  const handleChangePassword = async () => {
    if (passwords.new !== passwords.confirm) {
      toast.error('New passwords do not match')
      return
    }
    if (passwords.new.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    setIsChangingPassword(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsChangingPassword(false)
    setShowPasswordSection(false)
    setPasswords({ current: '', new: '', confirm: '' })
    toast.success('Password changed successfully')
  }

  const handleNotificationToggle = (id: string) => {
    setNotifications(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
    toast.success('Notification preference updated')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Edit Profile
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancelEdit}
              className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
            >
              <X className="h-4 w-4 inline mr-1" />
              Cancel
            </button>
            <button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 inline mr-1" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">Basic Information</h2>

            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center overflow-hidden">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl font-bold text-white">
                      {profile.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  )}
                </div>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full cursor-pointer hover:bg-primary/90 transition-colors">
                    <Camera className="h-4 w-4" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </label>
                )}
              </div>

              {/* Form Fields */}
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    ) : (
                      <p className="text-foreground">{profile.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Email Address</label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    ) : (
                      <p className="text-foreground">{profile.email}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Bio</label>
                  {isEditing ? (
                    <textarea
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                  ) : (
                    <p className="text-muted-foreground">{profile.bio}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Timezone</label>
                    {isEditing ? (
                      <select
                        value={profile.timezone}
                        onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="America/New_York">Eastern Time (ET)</option>
                        <option value="America/Chicago">Central Time (CT)</option>
                        <option value="America/Denver">Mountain Time (MT)</option>
                        <option value="America/Los_Angeles">Pacific Time (PT)</option>
                        <option value="Europe/London">London (GMT)</option>
                        <option value="Europe/Paris">Paris (CET)</option>
                        <option value="Asia/Tokyo">Tokyo (JST)</option>
                      </select>
                    ) : (
                      <p className="text-foreground">Eastern Time (ET)</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Language</label>
                    {isEditing ? (
                      <select
                        value={profile.language}
                        onChange={(e) => setProfile({ ...profile, language: e.target.value })}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="pt">Portuguese</option>
                        <option value="ja">Japanese</option>
                      </select>
                    ) : (
                      <p className="text-foreground">English</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Password Section */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/10 rounded-lg">
                  <Lock className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Password & Security</h2>
                  <p className="text-sm text-muted-foreground">Manage your password and security settings</p>
                </div>
              </div>
              {!showPasswordSection && (
                <button
                  onClick={() => setShowPasswordSection(true)}
                  className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
                >
                  Change Password
                </button>
              )}
            </div>

            {showPasswordSection && (
              <div className="space-y-4 pt-4 border-t border-border">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Current Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      value={passwords.current}
                      onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                      className="w-full px-3 py-2 pr-10 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">New Password</label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? 'text' : 'password'}
                        value={passwords.new}
                        onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                        className="w-full px-3 py-2 pr-10 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Confirm New Password</label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        value={passwords.confirm}
                        onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                        className="w-full px-3 py-2 pr-10 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => {
                      setShowPasswordSection(false)
                      setPasswords({ current: '', new: '', confirm: '' })
                    }}
                    className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleChangePassword}
                    disabled={isChangingPassword || !passwords.current || !passwords.new || !passwords.confirm}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {isChangingPassword ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </div>
            )}

            {/* 2FA Status */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium text-foreground">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                </div>
              </div>
              <span className="px-3 py-1 text-sm font-medium bg-green-500/10 text-green-500 rounded-full">
                Enabled
              </span>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Bell className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Notification Preferences</h2>
                <p className="text-sm text-muted-foreground">Choose what notifications you receive</p>
              </div>
            </div>

            <div className="space-y-4">
              {notificationPreferences.map((pref) => {
                const Icon = pref.icon
                return (
                  <div
                    key={pref.id}
                    className="flex items-center justify-between py-3 border-b border-border last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted rounded-lg">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{pref.label}</p>
                        <p className="text-sm text-muted-foreground">{pref.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleNotificationToggle(pref.id)}
                      className={`relative w-11 h-6 rounded-full transition-colors ${
                        notifications[pref.id] ? 'bg-primary' : 'bg-muted'
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                          notifications[pref.id] ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account Info */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-semibold text-foreground mb-4">Account Information</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Role</p>
                <p className="font-medium text-foreground">{currentUser.role}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Member Since</p>
                <p className="font-medium text-foreground">
                  {new Date(currentUser.joinedDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Login</p>
                <p className="font-medium text-foreground">{currentUser.lastLogin}</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <div className="space-y-2">
              <a
                href="/admin/settings/security"
                className="flex items-center gap-2 p-3 rounded-lg hover:bg-accent transition-colors"
              >
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">Security Settings</span>
              </a>
              <a
                href="/admin/activity"
                className="flex items-center gap-2 p-3 rounded-lg hover:bg-accent transition-colors"
              >
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">Activity Log</span>
              </a>
              <a
                href="/admin/notifications"
                className="flex items-center gap-2 p-3 rounded-lg hover:bg-accent transition-colors"
              >
                <Bell className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">All Notifications</span>
              </a>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-card border border-red-500/20 rounded-xl p-6">
            <h3 className="font-semibold text-red-500 mb-4">Danger Zone</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button className="w-full px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-500/10 transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
