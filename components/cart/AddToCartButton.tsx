'use client'

// Add to Cart Button Component
// VAULT Agent - Payment Systems Integration

import { ShoppingCart, Check, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useCartStore, CartItem } from '@/lib/stores/cart-store'
import toast from 'react-hot-toast'

interface AddToCartButtonProps {
  course: {
    id: string
    title: string
    slug: string
    instructor: string
    price: number
    originalPrice?: number
    image: string
    category: string
  }
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  className?: string
}

export default function AddToCartButton({
  course,
  variant = 'secondary',
  size = 'md',
  showIcon = true,
  className = '',
}: AddToCartButtonProps) {
  const { addItem, isInCart, openCart } = useCartStore()
  const [isAdding, setIsAdding] = useState(false)

  const inCart = isInCart(course.id)

  const handleClick = async () => {
    if (inCart) {
      openCart()
      return
    }

    setIsAdding(true)

    // Simulate small delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 200))

    const cartItem: CartItem = {
      id: `cart-${course.id}`,
      courseId: course.id,
      title: course.title,
      slug: course.slug,
      instructor: course.instructor,
      price: course.price,
      originalPrice: course.originalPrice,
      image: course.image,
      category: course.category,
    }

    addItem(cartItem)
    toast.success('Added to cart!')
    setIsAdding(false)
    openCart()
  }

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  }

  const variantClasses = {
    primary:
      'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary:
      'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700',
    outline:
      'border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800',
  }

  return (
    <button
      onClick={handleClick}
      disabled={isAdding}
      className={`
        inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all
        disabled:opacity-50 disabled:cursor-not-allowed
        ${sizeClasses[size]}
        ${inCart ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : variantClasses[variant]}
        ${className}
      `}
    >
      {isAdding ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : inCart ? (
        <>
          {showIcon && <Check className="h-4 w-4" />}
          In Cart
        </>
      ) : (
        <>
          {showIcon && <ShoppingCart className="h-4 w-4" />}
          Add to Cart
        </>
      )}
    </button>
  )
}
