'use client'
import { useState, useEffect } from 'react'
import ProductCard from '@/components/ProductCard'
import { getProducts, type Product } from '@/lib/api'

export default function SalesPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [mob, setMob] = useState(false)
  useEffect(() => {
    const c = () => setMob(window.innerWidth < 640)
    c()
    window.addEventListener('resize', c)
    return () => window.removeEventListener('resize', c)
  }, [])
  useEffect(() => {
    getProducts({ tag: 'SALE', limit: 50 })
      .then((r) => setProducts(r.docs))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-[1440px] mx-auto sp">
      <div
        className="relative overflow-hidden bg-acc mb-9"
        style={{ padding: mob ? '24px 18px' : '40px 44px' }}
      >
        <h1
          className="font-bebas tracking-[4px] text-white leading-[0.92]"
          style={{ fontSize: mob ? 'clamp(36px,11vw,56px)' : 'clamp(52px,7vw,88px)' }}
        >
          РАСПРОДАЖА
          <br />
          ДО −40%
        </h1>
        <p className="text-white/75 text-[12px] mt-2.5">
          Только выбранные позиции · Ограниченное количество
        </p>
        <div
          className="absolute font-bebas text-black/10 leading-none select-none"
          style={{ right: -15, bottom: -18, fontSize: mob ? 90 : 160 }}
        >
          %
        </div>
      </div>
      <h2 className="sec-ttl mb-5">
        ТОВАРЫ СО СКИДКОЙ{' '}
        {!loading && <span className="text-[0.5em] text-t3">({products.length})</span>}
      </h2>
      {loading ? (
        <div className="pgrid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skel border border-brd" style={{ height: 280 }} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-t3 py-10">Акционных товаров нет. Загляни позже!</p>
      ) : (
        <div className="pgrid">
          {products.map((p, i) => (
            <div key={p.id} className="animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
              <ProductCard product={p} sm={mob} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
