const BASE = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

/* TYPES*/

export interface Product {
  id: string
  name: string
  price: number
  oldPrice?: number

  description?: string
  material?: string

  category: { id: string; name: string } | string

  images?: {
    image: {
      url: string
      sizes?: {
        card?: { url: string }
        thumbnail?: { url: string }
      }
    }
  }[]

  sizes?: string[]
  inStock?: boolean

  tag?: 'NEW' | 'HIT' | 'SALE'
  rating?: number
}

export interface Category {
  id: string
  name: string
  slug: string
  icon?: string
}

/* BASE FETCH WRAPPER*/

const call = async (url: string, opts?: RequestInit) => {
  try {
    const res = await fetch(url, {
      cache: 'no-store',
      ...opts,
    })

    return res.ok ? res.json() : null
  } catch {
    return null
  }
}

/* PRODUCTS*/

export const getProducts = (p?: {
  category?: string
  limit?: number
  tag?: string
  sort?: string
  search?: string
}) => {
  const q = new URLSearchParams()

  if (p?.limit) q.set('limit', String(p.limit))
  if (p?.sort) q.set('sort', p.sort)
  if (p?.category) q.set('where[category][equals]', p.category)
  if (p?.tag) q.set('where[tag][equals]', p.tag)
  if (p?.search) q.set('where[name][like]', p.search)

  return call(`${BASE}/api/products?${q}&depth=1`).then(
    (r) => r || { docs: [] as Product[], totalDocs: 0 },
  )
}

export const getProduct = (id: string) =>
  call(`${BASE}/api/products/${id}?depth=2`) as Promise<Product | null>

/* CATEGORIES */

export const getCategories = () =>
  call(`${BASE}/api/categories?limit=50`).then((r) => r || { docs: [] as Category[] })

/* AUTH */

export const loginUser = (d: { email: string; password: string }) =>
  call(`${BASE}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(d),
    credentials: 'include',
  })

export const registerUser = (d: { name: string; email: string; password: string }) =>
  call(`${BASE}/api/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(d),
  })

export const logoutUser = () =>
  call(`${BASE}/api/users/logout`, {
    method: 'POST',
    credentials: 'include',
  })

export const getMe = () =>
  call(`${BASE}/api/users/me`, {
    credentials: 'include',
  })

/*
   ORDERS
*/

export const createOrder = (d: object) =>
  call(`${BASE}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(d),
    credentials: 'include',
  })
