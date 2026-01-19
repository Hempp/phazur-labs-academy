import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/types/database.types'

export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Define public routes that don't need auth checks
  const publicRoutes = [
    '/',
    '/courses',
    '/enterprise',
    '/verify',
    '/pricing',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
    '/blog',
    '/careers',
    '/accessibility',
    '/tracks',
    '/certifications',
    '/skills',
    '/teams',
    '/partners',
  ]

  // Skip auth check for public routes
  const isPublicRoute = publicRoutes.some(route =>
    pathname === route || pathname.startsWith(`${route}/`)
  )

  // Also skip for static files and api routes that don't need auth
  if (
    isPublicRoute ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/public') ||
    pathname.includes('.') // static files
  ) {
    return NextResponse.next()
  }

  // Check if Supabase is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project')) {
    // Supabase not configured - allow access but log warning in dev
    if (process.env.NODE_ENV === 'development') {
      console.warn('Supabase not configured. Auth checks disabled.')
    }
    return NextResponse.next()
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient<Database>(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Define protected routes
  const protectedRoutes = ['/dashboard', '/courses/create', '/api/protected']
  const authRoutes = ['/auth/login', '/auth/register', '/auth/forgot-password']

  // Check if accessing protected route without session
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

  if (isProtectedRoute && !user) {
    const redirectUrl = new URL('/auth/login', request.url)
    redirectUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/dashboard/student', request.url))
  }

  return supabaseResponse
}
