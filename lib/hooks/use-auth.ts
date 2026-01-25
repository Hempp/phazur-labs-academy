'use client'

import { useEffect, useState, useCallback } from 'react'
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js'
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase/client'
import type { User as AppUser, UserRole } from '@/types'

interface AuthState {
  user: User | null
  session: Session | null
  profile: AppUser | null
  isLoading: boolean
  isAuthenticated: boolean
}

interface UseAuthReturn extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signUp: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  signInWithGoogle: (redirectTo?: string) => Promise<{ error: Error | null }>
  signInWithGithub: (redirectTo?: string) => Promise<{ error: Error | null }>
  resetPassword: (email: string) => Promise<{ error: Error | null }>
  updatePassword: (password: string) => Promise<{ error: Error | null }>
  updateProfile: (data: Partial<AppUser>) => Promise<{ error: Error | null }>
  refreshProfile: () => Promise<void>
}

// Dev bypass for testing - check for NEXT_PUBLIC_DEV_AUTH_BYPASS
const isDevBypass = typeof window !== 'undefined' &&
  process.env.NODE_ENV === 'development' &&
  process.env.NEXT_PUBLIC_DEV_AUTH_BYPASS === 'true'

// Mock admin profile for dev bypass
const devBypassProfile: AppUser = {
  id: 'dev-admin-user',
  email: 'admin@dev.local',
  full_name: 'Dev Admin',
  role: 'admin',
  avatar_url: undefined,
  bio: undefined,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  is_active: true,
  email_verified: true,
  profile_completed: true,
  preferences: {
    theme: 'system',
    email_notifications: false,
    course_reminders: false,
    marketing_emails: false,
    language: 'en',
    timezone: 'America/Los_Angeles',
    playback_speed: 1,
    autoplay_videos: true,
    show_captions: false,
  },
}

export function useAuth(): UseAuthReturn {
  // Always start with isLoading: true to prevent hydration mismatch
  // The actual loading state is determined in useEffect after mount
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    profile: null,
    isLoading: true,
    isAuthenticated: false,
  })

  const supabase = getSupabaseClient()

  // Fetch user profile from database
  const fetchProfile = useCallback(async (userId: string) => {
    if (!supabase) return null

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
      return null
    }

    return data as AppUser
  }, [supabase])

  // Initialize auth state
  useEffect(() => {
    // Dev bypass - skip Supabase auth and use mock admin
    if (isDevBypass) {
      console.log('DEV_AUTH_BYPASS: Using mock admin profile')
      setState({
        user: { id: 'dev-admin-user', email: 'admin@dev.local' } as User,
        session: null,
        profile: devBypassProfile,
        isLoading: false,
        isAuthenticated: true,
      })
      return
    }

    if (!supabase) {
      setState(prev => ({ ...prev, isLoading: false }))
      return
    }

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()

        if (session?.user) {
          const profile = await fetchProfile(session.user.id)
          setState({
            user: session.user,
            session,
            profile,
            isLoading: false,
            isAuthenticated: true,
          })
        } else {
          setState({
            user: null,
            session: null,
            profile: null,
            isLoading: false,
            isAuthenticated: false,
          })
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        setState(prev => ({ ...prev, isLoading: false }))
      }
    }

    initAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const profile = await fetchProfile(session.user.id)
          setState({
            user: session.user,
            session,
            profile,
            isLoading: false,
            isAuthenticated: true,
          })
        } else if (event === 'SIGNED_OUT') {
          setState({
            user: null,
            session: null,
            profile: null,
            isLoading: false,
            isAuthenticated: false,
          })
        } else if (event === 'TOKEN_REFRESHED' && session) {
          setState(prev => ({
            ...prev,
            session,
          }))
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, fetchProfile])

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    if (!supabase) return { error: new Error('Supabase not configured') }
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error: error as Error | null }
  }

  // Sign up with email and password
  const signUp = async (email: string, password: string, fullName: string) => {
    if (!supabase) return { error: new Error('Supabase not configured') }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (!error && data.user) {
      // Create user profile in database
      const { error: profileError } = await supabase.from('users').insert({
        id: data.user.id,
        email: data.user.email,
        full_name: fullName,
        role: 'student' as UserRole,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_active: true,
        email_verified: false,
        profile_completed: false,
        preferences: {
          theme: 'system',
          email_notifications: true,
          course_reminders: true,
          marketing_emails: false,
          language: 'en',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          playback_speed: 1,
          autoplay_videos: true,
          show_captions: false,
        },
      })

      if (profileError) {
        console.error('Error creating profile:', profileError)
      }
    }

    return { error: error as Error | null }
  }

  // Sign out
  const signOut = async () => {
    if (!supabase) return
    await supabase.auth.signOut()
  }

  // Sign in with Google
  const signInWithGoogle = async (redirectTo?: string) => {
    if (!supabase) return { error: new Error('Supabase not configured') }
    const callbackUrl = new URL('/auth/callback', window.location.origin)
    if (redirectTo) {
      callbackUrl.searchParams.set('next', redirectTo)
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: callbackUrl.toString(),
      },
    })
    return { error: error as Error | null }
  }

  // Sign in with GitHub
  const signInWithGithub = async (redirectTo?: string) => {
    if (!supabase) return { error: new Error('Supabase not configured') }
    const callbackUrl = new URL('/auth/callback', window.location.origin)
    if (redirectTo) {
      callbackUrl.searchParams.set('next', redirectTo)
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: callbackUrl.toString(),
      },
    })
    return { error: error as Error | null }
  }

  // Reset password
  const resetPassword = async (email: string) => {
    if (!supabase) return { error: new Error('Supabase not configured') }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    return { error: error as Error | null }
  }

  // Update password
  const updatePassword = async (password: string) => {
    if (!supabase) return { error: new Error('Supabase not configured') }
    const { error } = await supabase.auth.updateUser({ password })
    return { error: error as Error | null }
  }

  // Update profile
  const updateProfile = async (data: Partial<AppUser>) => {
    if (!supabase) return { error: new Error('Supabase not configured') }
    if (!state.user) {
      return { error: new Error('Not authenticated') }
    }

    const { error } = await supabase
      .from('users')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', state.user.id)

    if (!error) {
      setState(prev => ({
        ...prev,
        profile: prev.profile ? { ...prev.profile, ...data } : null,
      }))
    }

    return { error: error as Error | null }
  }

  // Refresh profile
  const refreshProfile = async () => {
    if (state.user) {
      const profile = await fetchProfile(state.user.id)
      if (profile) {
        setState(prev => ({ ...prev, profile }))
      }
    }
  }

  return {
    ...state,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    signInWithGithub,
    resetPassword,
    updatePassword,
    updateProfile,
    refreshProfile,
  }
}
