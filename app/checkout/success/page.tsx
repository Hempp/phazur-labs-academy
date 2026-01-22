'use client'

// Checkout Success Page
// VAULT Agent - Payment Systems Integration

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, ArrowRight, Loader2, BookOpen, Mail } from 'lucide-react'
import { useCartStore } from '@/lib/stores/cart-store'
import Confetti from 'react-confetti'

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const { clearCart } = useCartStore()

  const [loading, setLoading] = useState(true)
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    // Clear the cart on successful purchase
    clearCart()

    // Stop confetti after 5 seconds
    const timer = setTimeout(() => setShowConfetti(false), 5000)

    // Fetch session details if needed (optional)
    setLoading(false)

    return () => clearTimeout(timer)
  }, [clearCart])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-green-950/20 dark:to-gray-900">
      {showConfetti && (
        <Confetti
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
        />
      )}

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-4xl font-bold text-green-600 dark:text-green-400 mb-4">
              Payment Successful!
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Thank you for your purchase. You're all set to start learning!
            </p>
          </div>

          {/* Order Details Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-lg font-semibold mb-6 flex items-center justify-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              What's Next?
            </h2>

            <div className="space-y-4 text-left">
              <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-medium">Check Your Email</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    We've sent a confirmation email with your receipt and course access details.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-medium">Access Your Courses</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Your courses are now available in your dashboard. Start learning immediately!
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-medium">Download Resources</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Access downloadable resources, code files, and supplementary materials.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl"
            >
              <BookOpen className="h-5 w-5" />
              Go to My Courses
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/courses"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-gray-300 dark:border-gray-600 rounded-xl font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            >
              Continue Shopping
            </Link>
          </div>

          {/* Support */}
          <p className="mt-12 text-sm text-gray-500 dark:text-gray-400">
            Need help? Contact our support team at{' '}
            <a href="mailto:support@phazurlabs.com" className="text-primary hover:underline">
              support@phazurlabs.com
            </a>
          </p>

          {/* Session ID for reference */}
          {sessionId && (
            <p className="mt-4 text-xs text-gray-400">
              Order Reference: {sessionId.slice(0, 20)}...
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SuccessContent />
    </Suspense>
  )
}
