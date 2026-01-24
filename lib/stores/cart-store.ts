// Cart Store - Zustand State Management
// VAULT Agent - Payment Systems Integration

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface CartItem {
  id: string
  courseId: string
  title: string
  slug: string
  instructor: string
  price: number
  originalPrice?: number
  image: string
  category: string
}

interface CartState {
  items: CartItem[]
  isOpen: boolean

  // Actions
  addItem: (item: CartItem) => void
  removeItem: (courseId: string) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void

  // Computed
  getItemCount: () => number
  getSubtotal: () => number
  getSavings: () => number
  getTotal: () => number
  isInCart: (courseId: string) => boolean
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        const { items } = get()
        // Prevent duplicates
        if (items.some((i) => i.courseId === item.courseId)) {
          return
        }
        set({ items: [...items, item] })
      },

      removeItem: (courseId) => {
        set({ items: get().items.filter((item) => item.courseId !== courseId) })
      },

      clearCart: () => {
        set({ items: [] })
      },

      toggleCart: () => {
        set({ isOpen: !get().isOpen })
      },

      openCart: () => {
        set({ isOpen: true })
      },

      closeCart: () => {
        set({ isOpen: false })
      },

      getItemCount: () => {
        return get().items.length
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => total + item.price, 0)
      },

      getSavings: () => {
        return get().items.reduce((savings, item) => {
          if (item.originalPrice && item.originalPrice > item.price) {
            return savings + (item.originalPrice - item.price)
          }
          return savings
        }, 0)
      },

      getTotal: () => {
        return get().getSubtotal()
      },

      isInCart: (courseId) => {
        return get().items.some((item) => item.courseId === courseId)
      },
    }),
    {
      name: 'phazur-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }), // Only persist items, not UI state
      skipHydration: true, // Prevent hydration mismatch - hydrate manually on client
    }
  )
)

// Hydrate the store on client-side only
if (typeof window !== 'undefined') {
  useCartStore.persist.rehydrate()
}

// Selector hooks for performance optimization
export const useCartItems = () => useCartStore((state) => state.items)
export const useCartItemCount = () => useCartStore((state) => state.items.length)
export const useCartIsOpen = () => useCartStore((state) => state.isOpen)
export const useCartActions = () =>
  useCartStore((state) => ({
    addItem: state.addItem,
    removeItem: state.removeItem,
    clearCart: state.clearCart,
    toggleCart: state.toggleCart,
    openCart: state.openCart,
    closeCart: state.closeCart,
  }))
