'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  name: string
  price: number
  oldPrice?: number
  image?: string
  category?: string
  qty: number
  size?: string
}
interface S {
  cart: CartItem[]
  favorites: string[]
  user: { id: string; name: string; email: string; role?: string } | null
  cards: { number: string; name: string; expiry: string }[]
  addToCart: (item: Omit<CartItem, 'qty'>, qty?: number) => void
  removeFromCart: (id: string) => void
  changeQty: (id: string, qty: number) => void
  clearCart: () => void
  toggleFavorite: (id: string) => void
  setUser: (u: S['user']) => void
  addCard: (c: { number: string; name: string; expiry: string }) => void
}

export const useStore = create<S>()(
  persist(
    (set) => ({
      cart: [],
      favorites: [],
      user: null,
      cards: [],

      addToCart: (item, qty = 1) =>
        set((s) => {
          const ex = s.cart.find((i) => i.id === item.id)
          return ex
            ? { cart: s.cart.map((i) => (i.id === item.id ? { ...i, qty: i.qty + qty } : i)) }
            : { cart: [...s.cart, { ...item, qty }] }
        }),
      removeFromCart: (id) => set((s) => ({ cart: s.cart.filter((i) => i.id !== id) })),
      changeQty: (id, qty) =>
        set((s) =>
          qty < 1
            ? { cart: s.cart.filter((i) => i.id !== id) }
            : { cart: s.cart.map((i) => (i.id === id ? { ...i, qty } : i)) },
        ),
      clearCart: () => set({ cart: [] }),
      toggleFavorite: (id) =>
        set((s) => ({
          favorites: s.favorites.includes(id)
            ? s.favorites.filter((i) => i !== id)
            : [...s.favorites, id],
        })),
      setUser: (u) => set({ user: u }),
      addCard: (c) => set((s) => ({ cards: [...s.cards, c] })),
    }),
    { name: 'strke' },
  ),
)
