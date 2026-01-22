// Stripe Webhook Handler
// VAULT Agent - Payment Systems Integration
// Handles payment events and creates enrollments

import { NextRequest, NextResponse } from 'next/server'
import { constructWebhookEvent, getCheckoutSession, stripe } from '@/lib/stripe'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

// Lazy-initialize Supabase admin client (avoid build-time errors)
let supabaseAdminInstance: SupabaseClient | null = null

function getSupabaseAdmin(): SupabaseClient {
  if (!supabaseAdminInstance) {
    supabaseAdminInstance = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
  }
  return supabaseAdminInstance
}

// Disable body parsing - we need raw body for signature verification
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    console.error('Missing stripe-signature header')
    return NextResponse.json(
      { error: 'Missing signature' },
      { status: 400 }
    )
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not configured')
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    )
  }

  let event: Stripe.Event

  try {
    event = constructWebhookEvent(body, signature, webhookSecret)
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutCompleted(session)
        break
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        await handlePaymentSucceeded(paymentIntent)
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        await handlePaymentFailed(paymentIntent)
        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        await handleRefund(charge)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error(`Error handling ${event.type}:`, error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

/**
 * Handle successful checkout session
 * Creates enrollments for purchased courses
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId
  const courseIdsString = session.metadata?.courseIds

  if (!userId || !courseIdsString) {
    console.error('Missing userId or courseIds in session metadata')
    return
  }

  const courseIds = courseIdsString.split(',')

  // Get full session with line items
  const fullSession = await getCheckoutSession(session.id)

  // Update payment records to completed
  const { error: paymentError } = await getSupabaseAdmin()
    .from('payments')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
      stripe_payment_intent_id: session.payment_intent as string,
    })
    .eq('user_id', userId)
    .in('course_id', courseIds)
    .eq('status', 'pending')

  if (paymentError) {
    console.error('Error updating payments:', paymentError)
  }

  // Get payment IDs for enrollment linking
  const { data: payments } = await getSupabaseAdmin()
    .from('payments')
    .select('id, course_id')
    .eq('user_id', userId)
    .in('course_id', courseIds)
    .eq('status', 'completed')

  // Create enrollments for each course
  for (const courseId of courseIds) {
    const payment = payments?.find((p) => p.course_id === courseId)

    // Check if enrollment already exists (prevent duplicates)
    const { data: existingEnrollment } = await getSupabaseAdmin()
      .from('enrollments')
      .select('id')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .single()

    if (existingEnrollment) {
      console.log(`Enrollment already exists for user ${userId}, course ${courseId}`)
      continue
    }

    // Create enrollment
    const { error: enrollError } = await getSupabaseAdmin()
      .from('enrollments')
      .insert({
        user_id: userId,
        course_id: courseId,
        status: 'active',
        payment_id: payment?.id,
        progress: 0,
        enrolled_at: new Date().toISOString(),
      })

    if (enrollError) {
      console.error(`Error creating enrollment for course ${courseId}:`, enrollError)
    } else {
      console.log(`Enrollment created for user ${userId}, course ${courseId}`)
    }
  }

  // Update user stats (if tracking)
  await updateUserStats(userId)

  console.log(`Checkout completed for user ${userId}, courses: ${courseIds.join(', ')}`)
}

/**
 * Handle successful payment intent
 */
async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const { error } = await getSupabaseAdmin()
    .from('payments')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
    })
    .eq('stripe_payment_intent_id', paymentIntent.id)

  if (error) {
    console.error('Error updating payment status:', error)
  }

  console.log(`Payment succeeded: ${paymentIntent.id}`)
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  const { error } = await getSupabaseAdmin()
    .from('payments')
    .update({
      status: 'failed',
    })
    .eq('stripe_payment_intent_id', paymentIntent.id)

  if (error) {
    console.error('Error updating failed payment:', error)
  }

  console.log(`Payment failed: ${paymentIntent.id}`)
}

/**
 * Handle refund
 */
async function handleRefund(charge: Stripe.Charge) {
  const paymentIntentId = charge.payment_intent as string

  if (!paymentIntentId) {
    console.error('No payment_intent in refunded charge')
    return
  }

  // Get the payment record
  const { data: payment } = await getSupabaseAdmin()
    .from('payments')
    .select('id, user_id, course_id')
    .eq('stripe_payment_intent_id', paymentIntentId)
    .single()

  if (!payment) {
    console.error('Payment not found for refund:', paymentIntentId)
    return
  }

  // Update payment status to refunded
  await getSupabaseAdmin()
    .from('payments')
    .update({ status: 'refunded' })
    .eq('id', payment.id)

  // Revoke enrollment
  await getSupabaseAdmin()
    .from('enrollments')
    .update({ status: 'expired' })
    .eq('user_id', payment.user_id)
    .eq('course_id', payment.course_id)

  console.log(`Refund processed for payment ${payment.id}`)
}

/**
 * Update user statistics after purchase
 */
async function updateUserStats(userId: string) {
  try {
    // Count total enrollments
    const { count } = await getSupabaseAdmin()
      .from('enrollments')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'active')

    // Update user profile with enrollment count (if field exists)
    // This is optional - depends on your user schema
    await getSupabaseAdmin()
      .from('users')
      .update({
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
  } catch (error) {
    console.error('Error updating user stats:', error)
  }
}

// Disable body parser for raw body access
export const dynamic = 'force-dynamic'
