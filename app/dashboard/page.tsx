'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/lib/hooks/use-auth'

// Dashboard index page - redirects to appropriate dashboard based on user role
export default function DashboardIndexPage() {
  const router = useRouter()
  const { profile, isLoading, isAuthenticated } = useAuth()

  useEffect(() => {
    if (isLoading) return

    if (!isAuthenticated) {
      router.replace('/auth/login')
      return
    }

    // Redirect based on user role
    const role = profile?.role || 'student'

    switch (role) {
      case 'admin':
        router.replace('/dashboard/admin')
        break
      case 'instructor':
        router.replace('/dashboard/instructor')
        break
      default:
        router.replace('/dashboard/student')
    }
  }, [profile, isLoading, isAuthenticated, router])

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading your dashboard...</p>
      </div>
    </div>
  )
}
