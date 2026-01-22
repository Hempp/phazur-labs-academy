'use client'

// Cart Button Component for Header
// VAULT Agent - Payment Systems Integration

import { ShoppingCart } from 'lucide-react'
import { useCartStore, useCartItemCount } from '@/lib/stores/cart-store'

export default function CartButton() {
  const { toggleCart } = useCartStore()
  const itemCount = useCartItemCount()

  return (
    <button
      onClick={toggleCart}
      className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label={`Shopping cart with ${itemCount} items`}
    >
      <ShoppingCart className="h-5 w-5" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
          {itemCount > 9 ? '9+' : itemCount}
        </span>
      )}
    </button>
  )
}
