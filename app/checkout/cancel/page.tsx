'use client'

// Checkout Cancelled Page
// VAULT Agent - Payment Systems Integration

import Link from 'next/link'
import { XCircle, ArrowLeft, ShoppingCart, HelpCircle, MessageCircle, Lock, BadgeDollarSign, GraduationCap } from 'lucide-react'

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Cancel Icon */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="h-12 w-12 text-gray-400" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Payment Cancelled
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Your payment was cancelled. No charges have been made.
            </p>
          </div>

          {/* Info Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-lg font-semibold mb-6">
              Your cart items are still saved
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Don&apos;t worry - your course selections are still in your cart.
              You can complete your purchase whenever you&apos;re ready.
            </p>

            {/* Reasons Section */}
            <div className="text-left space-y-4 mt-8">
              <h3 className="font-medium text-sm text-gray-500 uppercase tracking-wide">
                Common reasons for cancellation:
              </h3>
              <div className="grid gap-3">
                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <HelpCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm">
                      <strong>Want more information?</strong> Check out our course previews and reviews before purchasing.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <MessageCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm">
                      <strong>Have questions?</strong> Our support team is here to help with any concerns.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/courses"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl"
            >
              <ShoppingCart className="h-5 w-5" />
              Return to Courses
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-gray-300 dark:border-gray-600 rounded-xl font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Home
            </Link>
          </div>

          {/* Support */}
          <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
              Need Help?
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
              If you experienced any issues during checkout or have questions about our courses,
              we&apos;re here to help.
            </p>
            <a
              href="mailto:support@phazurlabs.com"
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              <MessageCircle className="h-4 w-4" />
              Contact Support
            </a>
          </div>

          {/* Trust badges */}
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-400">
            <span className="flex items-center gap-1.5">
              <Lock className="h-4 w-4" />
              Secure Payments
            </span>
            <span className="flex items-center gap-1.5">
              <BadgeDollarSign className="h-4 w-4" />
              30-Day Guarantee
            </span>
            <span className="flex items-center gap-1.5">
              <GraduationCap className="h-4 w-4" />
              Lifetime Access
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
