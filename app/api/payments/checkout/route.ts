// Checkout Session API Endpoint
// VAULT Agent - Payment Systems Integration

import { NextRequest, NextResponse } from 'next/server'
import { createCheckoutSession, toCents, CheckoutItem } from '@/lib/stripe'
import { createServerSupabaseClient } from '@/lib/supabase/server'

interface CheckoutRequestBody {
  items: {
    courseId: string
    title: string
    description?: string
    price: number // in dollars
    image?: string
  }[]
}

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const supabase = await createServerSupabaseClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Please sign in to purchase courses' },
        { status: 401 }
      )
    }

    // Parse request body
    const body: CheckoutRequestBody = await request.json()

    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { error: 'No items in cart' },
        { status: 400 }
      )
    }

    // Validate items and check if user already owns any courses
    const courseIds = body.items.map((item) => item.courseId)

    // Check for existing enrollments
    const { data: existingEnrollments } = await supabase
      .from('enrollments')
      .select('course_id')
      .eq('user_id', user.id)
      .in('course_id', courseIds)

    if (existingEnrollments && existingEnrollments.length > 0) {
      const ownedCourseIds = existingEnrollments.map((e) => e.course_id)
      return NextResponse.json(
        {
          error: 'You already own one or more of these courses',
          ownedCourseIds,
        },
        { status: 400 }
      )
    }

    // Prepare checkout items (convert dollars to cents)
    const checkoutItems: CheckoutItem[] = body.items.map((item) => ({
      courseId: item.courseId,
      name: item.title,
      description: item.description,
      price: toCents(item.price), // Convert to cents for Stripe
      image: item.image,
    }))

    // Get base URL for redirect
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.headers.get('origin') || 'http://localhost:3000'

    // Create Stripe checkout session
    const session = await createCheckoutSession({
      items: checkoutItems,
      userId: user.id,
      userEmail: user.email || '',
      successUrl: `${baseUrl}/checkout/success`,
      cancelUrl: `${baseUrl}/checkout/cancel`,
      metadata: {
        source: 'web',
      },
    })

    // Create pending payment records in database
    for (const item of body.items) {
      await supabase.from('payments').insert({
        user_id: user.id,
        course_id: item.courseId,
        amount: item.price,
        currency: 'USD',
        status: 'pending',
        payment_method: 'stripe',
        stripe_payment_intent_id: session.payment_intent as string || null,
      })
    }

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}

// Preflight request handler
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
