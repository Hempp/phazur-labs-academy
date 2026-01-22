'use client'

// Checkout Page
// VAULT Agent - Payment Systems Integration

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  ShoppingCart,
  Trash2,
  Lock,
  CreditCard,
  Shield,
  ArrowLeft,
  Loader2,
  Tag,
  AlertCircle,
  LogIn
} from 'lucide-react'
import { useCartStore } from '@/lib/stores/cart-store'
import { useAuth } from '@/lib/hooks/use-auth'
import { formatPrice } from '@/lib/stripe-client'
import { toast } from 'sonner'

export default function CheckoutPage() {
  const router = useRouter()
  const { user, isLoading: authLoading, isAuthenticated } = useAuth()
  const {
    items,
    removeItem,
    clearCart,
    getSubtotal,
    getSavings,
    getTotal
  } = useCartStore()

  const [isProcessing, setIsProcessing] = useState(false)

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Please sign in to checkout')
      router.push('/auth/signin?redirect=/checkout')
      return
    }

    if (items.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    setIsProcessing(true)

    try {
      const response = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            courseId: item.courseId,
            title: item.title,
            description: `Course: ${item.category}`,
            price: item.price,
            image: item.image,
          })),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('No checkout URL received')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      toast.error(error instanceof Error ? error.message : 'Checkout failed')
      setIsProcessing(false)
    }
  }

  const subtotal = getSubtotal()
  const savings = getSavings()
  const total = getTotal()

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="h-12 w-12 text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Looks like you haven&apos;t added any courses yet.
              Browse our catalog to find the perfect course for you.
            </p>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all"
            >
              Browse Courses
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Not authenticated state
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <LogIn className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Sign In to Checkout</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Please sign in to your account to complete your purchase.
              Your cart items ({items.length}) will be saved.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/signin?redirect=/checkout"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all"
              >
                <LogIn className="h-5 w-5" />
                Sign In
              </Link>
              <Link
                href="/auth/signup?redirect=/checkout"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-gray-300 dark:border-gray-600 rounded-xl font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Continue Shopping
        </Link>

        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">
                    Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
                  </h2>
                  <button
                    onClick={clearCart}
                    className="text-sm text-gray-500 hover:text-red-500 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {items.map((item) => (
                  <div key={item.id} className="p-6 flex gap-4">
                    {/* Course Image */}
                    <div className="relative w-32 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-700">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingCart className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Course Details */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/courses/${item.slug}`}
                        className="font-semibold hover:text-primary transition-colors line-clamp-1"
                      >
                        {item.title}
                      </Link>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        by {item.instructor}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {item.category}
                      </p>
                    </div>

                    {/* Price & Remove */}
                    <div className="text-right flex flex-col items-end gap-2">
                      <div>
                        <span className="font-bold text-lg">
                          {formatPrice(item.price)}
                        </span>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <span className="text-sm text-gray-400 line-through ml-2">
                            {formatPrice(item.originalPrice)}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => removeItem(item.courseId)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        title="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust Badges */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="flex flex-col items-center gap-2">
                  <Shield className="h-6 w-6 text-green-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    30-Day Money Back Guarantee
                  </span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Lock className="h-6 w-6 text-green-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Secure SSL Encryption
                  </span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <CreditCard className="h-6 w-6 text-green-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Lifetime Access
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                {savings > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span className="flex items-center gap-1">
                      <Tag className="h-4 w-4" />
                      Savings
                    </span>
                    <span>-{formatPrice(savings)}</span>
                  </div>
                )}

                <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isProcessing || items.length === 0}
                className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="h-5 w-5" />
                    Proceed to Payment
                  </>
                )}
              </button>

              <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
                By completing your purchase you agree to our{' '}
                <Link href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </p>

              {/* Payment Methods */}
              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-3">
                  Secure payment powered by Stripe
                </p>
                <div className="flex justify-center items-center gap-4 text-gray-400">
                  <span className="text-xs">Visa</span>
                  <span className="text-xs">Mastercard</span>
                  <span className="text-xs">Amex</span>
                  <span className="text-xs">Apple Pay</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
