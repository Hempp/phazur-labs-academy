'use client'

import { useState } from 'react'
import { Settings, User, Bell, Shield, Palette, Globe } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useAuth } from '@/lib/hooks/use-auth'

export default function SettingsPage() {
  const { profile } = useAuth()
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    courseUpdates: true,
    newLessons: true,
    discussionReplies: true,
    weeklyDigest: false,
  })

  const [preferences, setPreferences] = useState({
    theme: 'system',
    language: 'en',
    autoplay: true,
    playbackSpeed: 1,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile
          </CardTitle>
          <CardDescription>Your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Full Name</label>
              <input
                type="text"
                defaultValue={profile?.full_name || ''}
                className="w-full mt-1 px-3 py-2 border rounded-lg bg-background"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                defaultValue={profile?.email || ''}
                disabled
                className="w-full mt-1 px-3 py-2 border rounded-lg bg-muted"
              />
            </div>
          </div>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            Save Changes
          </button>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>Control how you receive updates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
              </div>
              <button
                onClick={() => setNotifications(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                  ${value ? 'bg-primary' : 'bg-muted'}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                    ${value ? 'translate-x-6' : 'translate-x-1'}`}
                />
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Preferences
          </CardTitle>
          <CardDescription>Customize your learning experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Theme</label>
              <select
                value={preferences.theme}
                onChange={(e) => setPreferences(prev => ({ ...prev, theme: e.target.value }))}
                className="w-full mt-1 px-3 py-2 border rounded-lg bg-background"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Language</label>
              <select
                value={preferences.language}
                onChange={(e) => setPreferences(prev => ({ ...prev, language: e.target.value }))}
                className="w-full mt-1 px-3 py-2 border rounded-lg bg-background"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Autoplay Videos</p>
              <p className="text-sm text-muted-foreground">Automatically play the next lesson</p>
            </div>
            <button
              onClick={() => setPreferences(prev => ({ ...prev, autoplay: !prev.autoplay }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                ${preferences.autoplay ? 'bg-primary' : 'bg-muted'}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                  ${preferences.autoplay ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security
          </CardTitle>
          <CardDescription>Manage your account security</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <button className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors">
            Change Password
          </button>
          <button className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors">
            Enable Two-Factor Authentication
          </button>
        </CardContent>
      </Card>
    </div>
  )
}
