'use client'

// Cart Sidebar Component
// VAULT Agent - Payment Systems Integration

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X, ShoppingCart, Trash2, Loader2, Tag, Lock, CreditCard } from 'lucide-react'
import { useCartStore } from '@/lib/stores/cart-store'
import { formatPrice } from '@/lib/stripe-client'
import { useAuth } from '@/lib/hooks/use-auth'
import toast from 'react-hot-toast'

export default function CartSidebar() {
  const { user } = useAuth()
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    clearCart,
    getSubtotal,
    getSavings,
  } = useCartStore()

  // Prevent hydration mismatch by not rendering cart content until mounted
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const [isLoading, setIsLoading] = useState(false)

  // Only calculate after mount to prevent hydration mismatch
  const subtotal = isMounted ? getSubtotal() : 0
  const savings = isMounted ? getSavings() : 0
  const cartItems = isMounted ? items : []
  const cartItemCount = isMounted ? items.length : 0

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Please sign in to checkout')
      closeCart()
      window.location.href = '/auth/login?redirect=/checkout'
      return
    }

    if (items.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    setIsLoading(true)

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
            description: `${item.category} course by ${item.instructor}`,
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
        throw new Error('No checkout URL returned')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      toast.error(error instanceof Error ? error.message : 'Checkout failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={closeCart}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-xl z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Shopping Cart</h2>
            <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-0.5 rounded-full">
              {cartItemCount}
            </span>
          </div>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ height: 'calc(100vh - 280px)' }}>
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Your cart is empty
              </p>
              <Link
                href="/courses"
                onClick={closeCart}
                className="text-primary hover:underline font-medium"
              >
                Browse Courses
              </Link>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.courseId}
                className="flex gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="relative w-20 h-14 rounded-md overflow-hidden flex-shrink-0">
                  <Image
                    src={item.image || '/course-placeholder.jpg'}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/courses/${item.slug}`}
                    onClick={closeCart}
                    className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors"
                  >
                    {item.title}
                  </Link>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {item.instructor}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-semibold text-primary">
                      {formatPrice(item.price)}
                    </span>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <span className="text-xs text-gray-400 line-through">
                        {formatPrice(item.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.courseId)}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                  title="Remove from cart"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-4">
            {/* Savings */}
            {savings > 0 && (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg">
                <Tag className="h-4 w-4" />
                <span className="text-sm font-medium">
                  You save {formatPrice(savings)}!
                </span>
              </div>
            )}

            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal:</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span className="text-primary">{formatPrice(subtotal)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button
                onClick={handleCheckout}
                disabled={isLoading}
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Proceed to Checkout'
                )}
              </button>
              <button
                onClick={clearCart}
                className="w-full py-2 text-sm text-gray-500 hover:text-red-500 transition-colors"
              >
                Clear Cart
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-4 pt-2 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Lock className="h-3 w-3" />
                Secure Checkout
              </span>
              <span className="flex items-center gap-1">
                <CreditCard className="h-3 w-3" />
                Powered by Stripe
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
