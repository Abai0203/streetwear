'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductCard from '@/components/ProductCard'
import { getProducts, getCategories, type Product, type Category } from '@/lib/api'

export default function CatalogPage() {
  const params = useSearchParams()

  const [products, setProducts] = useState<Product[]>([])
  const [cats, setCats] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  const [mob, setMob] = useState(false)

  // ⚠️ SAFE INIT (важно для prerender)
  const [cat, setCat] = useState('all')
  const [sort, setSort] = useState('def')
  const [maxP, setMaxP] = useState(25000)
  const [q, setQ] = useState('')

  // sync URL params AFTER mount
  useEffect(() => {
    setCat(params?.get('category') || 'all')
    setQ(params?.get('q') || '')
  }, [params])

  // mobile detect (SSR safe)
  useEffect(() => {
    const update = () => {
      if (typeof window !== 'undefined') {
        setMob(window.innerWidth < 640)
      }
    }

    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // load categories
  useEffect(() => {
    getCategories()
      .then((r) => setCats(r.docs || []))
      .catch(() => setCats([]))
  }, [])

  // load products
  useEffect(() => {
    let mounted = true

    setLoading(true)

    const o: Parameters<typeof getProducts>[0] = { limit: 50 }

    if (cat !== 'all') o.category = cat
    if (sort === 'pa') o.sort = 'price'
    if (sort === 'pd') o.sort = '-price'
    if (sort === 'r') o.sort = '-rating'
    if (q) o.search = q

    getProducts(o)
      .then((r) => {
        if (!mounted) return

        let list = r?.docs || []

        if (maxP < 25000) {
          list = list.filter((p) => p.price <= maxP)
        }

        setProducts(list)
      })
      .catch(() => {
        if (mounted) setProducts([])
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [cat, sort, maxP, q])

  const allCats = [{ id: 'all', name: 'Все', slug: '' }, ...cats]

  return (
    <div className="max-w-[1440px] mx-auto sp">
      <h1 className="sec-ttl mb-4">КАТАЛОГ</h1>

      {/* categories */}
      <div className="chip-row mb-3">
        {allCats.map((c) => (
          <button
            key={c.id}
            className={`chip ${cat === c.id ? 'on' : ''}`}
            onClick={() => setCat(c.id)}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* filters */}
      <div className="flex gap-2 items-center mb-4 flex-wrap">
        <input
          className="inp text-[13px]"
          style={{ width: mob ? '100%' : 190 }}
          placeholder="Поиск..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="bg-bg3 border border-brd text-t1 px-3 py-3 font-mono text-[10px] tracking-wide outline-none cursor-pointer"
        >
          <option value="def">ПО УМОЛЧАНИЮ</option>
          <option value="pa">ЦЕНА ↑</option>
          <option value="pd">ЦЕНА ↓</option>
          <option value="r">РЕЙТИНГ</option>
        </select>

        <div className="flex items-center gap-2 flex-1 min-w-[180px]">
          <span className="font-mono text-[10px] text-t3 whitespace-nowrap">
            до {maxP.toLocaleString()} сом
          </span>

          <input
            type="range"
            min={500}
            max={25000}
            step={500}
            value={maxP}
            onChange={(e) => setMaxP(+e.target.value)}
            className="flex-1"
          />
        </div>

        <span className="font-mono text-[11px] text-t3 ml-auto">{products.length} шт</span>
      </div>

      {/* content */}
      {loading ? (
        <div className="pgrid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skel border border-brd" style={{ height: 280 }} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-14">
          <div className="text-5xl mb-3">🔍</div>
          <div className="font-bebas text-[30px] tracking-[4px]">НИЧЕГО НЕ НАЙДЕНО</div>

          <button
            className="btn-o mt-5"
            onClick={() => {
              setCat('all')
              setQ('')
              setMaxP(25000)
            }}
          >
            СБРОСИТЬ
          </button>
        </div>
      ) : (
        <div className="pgrid">
          {products.map((p, i) => (
            <div
              key={p.id}
              className="animate-fade-up"
              style={{ animationDelay: `${Math.min(i, 8) * 0.04}s` }}
            >
              <ProductCard product={p} sm={mob} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
