'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  Users,
  Loader2,
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock,
  LogIn,
  UserPlus,
  ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface InvitationData {
  id: string
  email: string
  role: string
  team: {
    id: string
    name: string
    description?: string
  }
  inviter: {
    full_name: string
  }
  expiresAt: string
}

interface InvitationResponse {
  valid: boolean
  error?: string
  expired?: boolean
  status?: string
  invitation?: InvitationData
  isLoggedIn?: boolean
  userEmail?: string | null
  emailMatch?: boolean
}

function JoinTeamContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [loading, setLoading] = useState(true)
  const [accepting, setAccepting] = useState(false)
  const [data, setData] = useState<InvitationResponse | null>(null)
  const [success, setSuccess] = useState<{ teamName: string; teamId: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) {
      setLoading(false)
      setError('No invitation token provided')
      return
    }

    const validateToken = async () => {
      try {
        const response = await fetch(`/api/teams/join?token=${token}`)
        const result = await response.json()
        setData(result)
      } catch {
        setError('Failed to validate invitation')
      } finally {
        setLoading(false)
      }
    }

    validateToken()
  }, [token])

  const handleAccept = async () => {
    if (!token) return

    setAccepting(true)
    setError(null)

    try {
      const response = await fetch('/api/teams/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to join team')
      }

      setSuccess({ teamName: result.teamName, teamId: result.teamId })

      // Redirect after a short delay
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setAccepting(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
        <Card className="w-full max-w-md">
          <CardContent className="py-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="mt-4 text-muted-foreground">Validating invitation...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
            <CardTitle>Welcome to {success.teamName}!</CardTitle>
            <CardDescription>
              You&apos;ve successfully joined the team. Redirecting to your dashboard...
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard">
              <Button className="w-full">
                Go to Dashboard
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // No token or validation error
  if (!data?.valid || error) {
    const isExpired = data?.expired
    const isUsed = data?.status && data.status !== 'pending'

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
              isExpired ? 'bg-amber-100 dark:bg-amber-900/50' : 'bg-red-100 dark:bg-red-900/50'
            }`}>
              {isExpired ? (
                <Clock className="h-8 w-8 text-amber-600" />
              ) : (
                <XCircle className="h-8 w-8 text-red-600" />
              )}
            </div>
            <CardTitle>
              {isExpired ? 'Invitation Expired' : isUsed ? 'Invitation Already Used' : 'Invalid Invitation'}
            </CardTitle>
            <CardDescription>
              {error || data?.error || 'This invitation link is not valid.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {isExpired && (
              <p className="text-sm text-muted-foreground text-center">
                Please ask the team admin to send you a new invitation.
              </p>
            )}
            <Link href="/teams">
              <Button variant="outline" className="w-full">
                Learn about Teams
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost" className="w-full">
                Go to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { invitation, isLoggedIn, userEmail, emailMatch } = data

  // Not logged in
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>You&apos;re Invited!</CardTitle>
            <CardDescription>
              <span className="font-medium text-foreground">{invitation?.inviter?.full_name || 'Someone'}</span> has invited you to join{' '}
              <span className="font-medium text-foreground">{invitation?.team?.name}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {invitation?.team?.description && (
              <p className="text-sm text-muted-foreground text-center">
                {invitation.team.description}
              </p>
            )}

            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground">
                This invitation was sent to:
              </p>
              <p className="font-medium">{invitation?.email}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Role: <span className="capitalize">{invitation?.role}</span>
              </p>
            </div>

            <div className="space-y-2">
              <Link href={`/auth/login?redirect=/teams/join?token=${token}`}>
                <Button className="w-full">
                  <LogIn className="h-4 w-4 mr-2" />
                  Log in to Accept
                </Button>
              </Link>
              <Link href={`/auth/signup?redirect=/teams/join?token=${token}&email=${encodeURIComponent(invitation?.email || '')}`}>
                <Button variant="outline" className="w-full">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create an Account
                </Button>
              </Link>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Invitation expires {new Date(invitation?.expiresAt || '').toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Logged in but email doesn't match
  if (!emailMatch) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-amber-100 dark:bg-amber-900/50 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-amber-600" />
            </div>
            <CardTitle>Email Mismatch</CardTitle>
            <CardDescription>
              This invitation was sent to a different email address.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Invitation for:</span>
                <span className="font-medium">{invitation?.email}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Logged in as:</span>
                <span className="font-medium">{userEmail}</span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground text-center">
              Please log out and sign in with <span className="font-medium">{invitation?.email}</span> to accept this invitation.
            </p>

            <Link href="/auth/logout">
              <Button variant="outline" className="w-full">
                Log out and switch accounts
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Logged in and email matches - show accept button
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <CardTitle>Join {invitation?.team?.name}</CardTitle>
          <CardDescription>
            <span className="font-medium text-foreground">{invitation?.inviter?.full_name || 'A team admin'}</span> has invited you to join their team.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {invitation?.team?.description && (
            <p className="text-sm text-muted-foreground text-center">
              {invitation.team.description}
            </p>
          )}

          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground">You&apos;ll join as:</p>
            <p className="font-medium capitalize">{invitation?.role}</p>
          </div>

          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg">
              {error}
            </div>
          )}

          <Button
            className="w-full"
            onClick={handleAccept}
            disabled={accepting}
          >
            {accepting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Joining...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Accept Invitation
              </>
            )}
          </Button>

          <Link href="/dashboard">
            <Button variant="ghost" className="w-full">
              Maybe Later
            </Button>
          </Link>

          <p className="text-xs text-muted-foreground text-center">
            Invitation expires {new Date(invitation?.expiresAt || '').toLocaleDateString()}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default function JoinTeamPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    }>
      <JoinTeamContent />
    </Suspense>
  )
}
