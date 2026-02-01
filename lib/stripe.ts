// Stripe Server-Side Configuration
// VAULT Agent - Payment Systems Integration

import Stripe from 'stripe'

// Lazy-initialize Stripe with secret key (avoid build-time errors)
let stripeInstance: Stripe | null = null

function getStripeInstance(): Stripe {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set in environment variables')
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-12-15.clover',
      typescript: true,
    })
  }
  return stripeInstance
}

// Export stripe getter for backwards compatibility
export const stripe = {
  get checkout() { return getStripeInstance().checkout },
  get customers() { return getStripeInstance().customers },
  get paymentIntents() { return getStripeInstance().paymentIntents },
  get refunds() { return getStripeInstance().refunds },
  get subscriptions() { return getStripeInstance().subscriptions },
  get webhooks() { return getStripeInstance().webhooks },
}

// Client-side publishable key
export const getStripePublishableKey = () => {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  if (!key) {
    throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set')
  }
  return key
}

// Types for checkout
export interface CheckoutItem {
  courseId: string
  name: string
  description?: string
  price: number // in cents
  image?: string
}

export interface CreateCheckoutSessionParams {
  items: CheckoutItem[]
  userId: string
  userEmail: string
  successUrl: string
  cancelUrl: string
  metadata?: Record<string, string>
}

/**
 * Create a Stripe Checkout Session for course purchase
 */
export async function createCheckoutSession({
  items,
  userId,
  userEmail,
  successUrl,
  cancelUrl,
  metadata = {},
}: CreateCheckoutSessionParams): Promise<Stripe.Checkout.Session> {
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(
    (item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          description: item.description,
          images: item.image ? [item.image] : undefined,
          metadata: {
            courseId: item.courseId,
          },
        },
        unit_amount: item.price, // Price in cents
      },
      quantity: 1,
    })
  )

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: lineItems,
    customer_email: userEmail,
    success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: cancelUrl,
    metadata: {
      userId,
      courseIds: items.map((item) => item.courseId).join(','),
      ...metadata,
    },
    payment_intent_data: {
      metadata: {
        userId,
        courseIds: items.map((item) => item.courseId).join(','),
      },
    },
    // Enable automatic tax calculation if needed
    // automatic_tax: { enabled: true },

    // Allow promotion codes
    allow_promotion_codes: true,

    // Billing address collection
    billing_address_collection: 'auto',

    // Invoice generation
    invoice_creation: {
      enabled: true,
      invoice_data: {
        description: 'Course Training Course Purchase',
        metadata: {
          userId,
        },
        footer: 'Thank you for learning with Course Training!',
      },
    },
  })

  return session
}

/**
 * Retrieve a checkout session by ID
 */
export async function getCheckoutSession(
  sessionId: string
): Promise<Stripe.Checkout.Session> {
  return stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['line_items', 'payment_intent', 'customer'],
  })
}

/**
 * Create a payment intent for custom checkout flow
 */
export async function createPaymentIntent(
  amount: number,
  currency: string = 'usd',
  metadata: Record<string, string> = {}
): Promise<Stripe.PaymentIntent> {
  return stripe.paymentIntents.create({
    amount,
    currency,
    metadata,
    automatic_payment_methods: {
      enabled: true,
    },
  })
}

/**
 * Retrieve a payment intent by ID
 */
export async function getPaymentIntent(
  paymentIntentId: string
): Promise<Stripe.PaymentIntent> {
  return stripe.paymentIntents.retrieve(paymentIntentId)
}

/**
 * Create or retrieve a Stripe customer
 */
export async function getOrCreateCustomer(
  email: string,
  name?: string,
  metadata?: Record<string, string>
): Promise<Stripe.Customer> {
  // Check if customer exists
  const existingCustomers = await stripe.customers.list({
    email,
    limit: 1,
  })

  if (existingCustomers.data.length > 0) {
    return existingCustomers.data[0]
  }

  // Create new customer
  return stripe.customers.create({
    email,
    name,
    metadata,
  })
}

/**
 * Process refund for a payment
 */
export async function createRefund(
  paymentIntentId: string,
  amount?: number, // Optional: partial refund amount in cents
  reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer'
): Promise<Stripe.Refund> {
  return stripe.refunds.create({
    payment_intent: paymentIntentId,
    amount,
    reason,
  })
}

/**
 * Verify webhook signature
 */
export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string,
  webhookSecret: string
): Stripe.Event {
  return stripe.webhooks.constructEvent(payload, signature, webhookSecret)
}

/**
 * Format amount for display (cents to dollars)
 */
export function formatStripeAmount(amount: number, currency: string = 'usd'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100)
}

/**
 * Convert dollars to cents for Stripe
 */
export function toCents(dollars: number): number {
  return Math.round(dollars * 100)
}

/**
 * Convert cents to dollars
 */
export function toDollars(cents: number): number {
  return cents / 100
}

// Subscription helpers (for future use)
export interface CreateSubscriptionParams {
  customerId: string
  priceId: string
  metadata?: Record<string, string>
}

/**
 * Create a subscription (for membership/recurring courses)
 */
export async function createSubscription({
  customerId,
  priceId,
  metadata = {},
}: CreateSubscriptionParams): Promise<Stripe.Subscription> {
  return stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    metadata,
    payment_behavior: 'default_incomplete',
    payment_settings: {
      save_default_payment_method: 'on_subscription',
    },
    expand: ['latest_invoice.payment_intent'],
  })
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription> {
  return stripe.subscriptions.cancel(subscriptionId)
}

// Export Stripe types for use in other files
export type { Stripe }
