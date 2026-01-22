'use client'

// Cart Provider Component - Client-side wrapper for cart functionality
// VAULT Agent - Payment Systems Integration

import { CartSidebar } from '@/components/cart'

export default function CartProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <CartSidebar />
    </>
  )
}
