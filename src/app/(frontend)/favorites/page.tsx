'use client'
// src/app/(frontend)/favorites/page.tsx
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/store/useStore'
import ProductCard from '@/components/ProductCard'
import { getProducts, type Product } from '@/lib/api'

export default function FavoritesPage() {
  const router = useRouter()
  const { favorites } = useStore()
  const [products, setProducts] = useState<Product[]>([])
  const [mob, setMob] = useState(false)
  useEffect(() => {
    const c = () => setMob(window.innerWidth < 640)
    c()
    window.addEventListener('resize', c)
    return () => window.removeEventListener('resize', c)
  }, [])
  useEffect(() => {
    if (favorites.length === 0) return
    getProducts({ limit: 100 }).then((r) =>
      setProducts(r.docs.filter((p) => favorites.includes(p.id))),
    )
  }, [favorites])

  if (favorites.length === 0)
    return (
      <div className="text-center py-20 px-5">
        <div className="text-7xl mb-4 animate-bjump">♡</div>
        <h1 className="font-bebas tracking-[4px]" style={{ fontSize: mob ? 32 : 44 }}>
          ИЗБРАННОЕ ПУСТО
        </h1>
        <p className="text-t3 mt-2 mb-7 text-sm">Сохраняй понравившееся</p>
        <button className="btn-p" onClick={() => router.push('/catalog')}>
          В КАТАЛОГ
        </button>
      </div>
    )
  return (
    <div className="max-w-[1440px] mx-auto sp">
      <h1 className="sec-ttl mb-6">
        ИЗБРАННОЕ <span className="text-[0.42em] text-t3">({favorites.length})</span>
      </h1>
      <div className="pgrid">
        {products.map((p, i) => (
          <div key={p.id} className="animate-fade-up" style={{ animationDelay: `${i * 0.06}s` }}>
            <ProductCard product={p} sm={mob} />
          </div>
        ))}
      </div>
    </div>
  )
}
