'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import {
  Mail,
  ArrowLeft,
  Loader2,
  Plus,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  Send,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface Invitation {
  id: string
  email: string
  role: 'admin' | 'member'
  status: 'pending' | 'accepted' | 'expired' | 'cancelled'
  created_at: string
  expires_at: string
  invited_by: {
    id: string
    full_name: string
  } | null
}

const statusConfig = {
  pending: { label: 'Pending', icon: Clock, color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/50' },
  accepted: { label: 'Accepted', icon: CheckCircle, color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/50' },
  expired: { label: 'Expired', icon: XCircle, color: 'text-gray-600 bg-gray-100 dark:bg-gray-800' },
  cancelled: { label: 'Cancelled', icon: XCircle, color: 'text-red-600 bg-red-100 dark:bg-red-900/50' },
}

export default function TeamInvitationsPage({
  params,
}: {
  params: Promise<{ teamId: string }>
}) {
  const { teamId } = use(params)
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ email: '', role: 'member' })
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)
  const [cancellingId, setCancellingId] = useState<string | null>(null)

  useEffect(() => {
    fetchInvitations()
  }, [teamId])

  const fetchInvitations = async () => {
    try {
      const response = await fetch(`/api/teams/${teamId}/invitations`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load invitations')
      }

      setInvitations(data.invitations || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleSendInvitation = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setSendError(null)

    try {
      const response = await fetch(`/api/teams/${teamId}/invitations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          role: formData.role,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send invitation')
      }

      // Add to list
      setInvitations([data.invitation, ...invitations])
      setFormData({ email: '', role: 'member' })
      setShowForm(false)
    } catch (err) {
      setSendError(err instanceof Error ? err.message : 'Failed to send invitation')
    } finally {
      setSending(false)
    }
  }

  const handleCancelInvitation = async (invitationId: string) => {
    if (!confirm('Are you sure you want to cancel this invitation?')) return

    setCancellingId(invitationId)
    try {
      const response = await fetch(`/api/teams/${teamId}/invitations?invitationId=${invitationId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to cancel invitation')
      }

      setInvitations(invitations.filter(i => i.id !== invitationId))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to cancel invitation')
    } finally {
      setCancellingId(null)
    }
  }

  const pendingInvitations = invitations.filter(i => i.status === 'pending')
  const pastInvitations = invitations.filter(i => i.status !== 'pending')

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Link
          href={`/dashboard/teams/${teamId}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Team
        </Link>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        href={`/dashboard/teams/${teamId}`}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Team
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Team Invitations</h1>
          <p className="text-muted-foreground">
            Invite new members to join your team
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Send Invitation
        </Button>
      </div>

      {/* Invitation Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Send Invitation</CardTitle>
            <CardDescription>
              Enter the email address of the person you want to invite
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSendInvitation} className="space-y-4">
              {sendError && (
                <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  {sendError}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <Input
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={sending}
                  />
                </div>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  disabled={sending}
                  className="h-10 px-3 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
                <Button type="submit" disabled={sending || !formData.email}>
                  {sending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send
                    </>
                  )}
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                An email will be sent with a link to join the team. The invitation expires in 7 days.
              </p>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Pending Invitations */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Invitations</CardTitle>
          <CardDescription>
            {pendingInvitations.length} {pendingInvitations.length === 1 ? 'invitation' : 'invitations'} waiting for response
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingInvitations.length === 0 ? (
            <div className="py-8 text-center">
              <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No pending invitations</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => setShowForm(true)}
              >
                Send your first invitation
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingInvitations.map((invitation) => {
                const status = statusConfig[invitation.status]
                const StatusIcon = status.icon
                const isExpired = new Date(invitation.expires_at) < new Date()

                return (
                  <div
                    key={invitation.id}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{invitation.email}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="capitalize">{invitation.role}</span>
                          <span>•</span>
                          <span>
                            {isExpired ? (
                              <span className="text-red-600">Expired</span>
                            ) : (
                              `Expires ${new Date(invitation.expires_at).toLocaleDateString()}`
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCancelInvitation(invitation.id)}
                      disabled={cancellingId === invitation.id}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      {cancellingId === invitation.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Past Invitations */}
      {pastInvitations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Past Invitations</CardTitle>
            <CardDescription>
              History of accepted, expired, and cancelled invitations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pastInvitations.map((invitation) => {
                const status = statusConfig[invitation.status]
                const StatusIcon = status.icon

                return (
                  <div
                    key={invitation.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-muted/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{invitation.email}</p>
                        <p className="text-sm text-muted-foreground">
                          Sent {new Date(invitation.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium', status.color)}>
                      <StatusIcon className="h-3 w-3" />
                      {status.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Card */}
      <Card className="bg-muted/50">
        <CardContent className="py-4">
          <h4 className="font-medium mb-2">About Invitations</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Invitations are sent via email and expire after 7 days</li>
            <li>• The recipient must have or create an account to accept</li>
            <li>• Admins can manage members and send invitations</li>
            <li>• Members can only view team content and courses</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
