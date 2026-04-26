'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ProductCard from '@/components/ProductCard'
import { getProducts, getCategories, type Product, type Category } from '@/lib/api'

const ICONS = ['👖', '👗', '🧥', '👕', '🧣', '👜']
const FB_CATS = [
  { id: '1', name: 'Джинсы', slug: 'jeans' },
  { id: '2', name: 'Штаны', slug: 'pants' },
  { id: '3', name: 'Зипки', slug: 'zip' },
  { id: '4', name: 'Футболки', slug: 'tshirts' },
  { id: '5', name: 'Куртки', slug: 'jackets' },
  { id: '6', name: 'Аксессуары', slug: 'accessories' },
]

export default function HomePage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [cats, setCats] = useState<Category[]>([])
  const [vis, setVis] = useState(false)
  const [mob, setMob] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setVis(true))
    const c = () => setMob(window.innerWidth < 640)
    c()
    window.addEventListener('resize', c)
    return () => window.removeEventListener('resize', c)
  }, [])
  useEffect(() => {
    getProducts({ limit: 8 }).then((r) => setProducts(r.docs))
    getCategories().then((r) => setCats(r.docs))
  }, [])

  const display = cats.length > 0 ? cats.slice(0, 6) : FB_CATS

  return (
    <div className={`transition-opacity duration-500 ${vis ? 'opacity-100' : 'opacity-0'}`}>
      {/* HERO */}
      <div
        className="relative flex items-center overflow-hidden"
        style={{
          minHeight: mob ? '68vh' : '84vh',
          background: 'linear-gradient(135deg,#0a0a0a 0%,#180800 50%,#0a0a0a 100%)',
          padding: mob ? '0 18px' : '0 clamp(24px,6vw,100px)',
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,60,0,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,60,0,.025) 1px,transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="relative z-10" style={{ maxWidth: mob ? 300 : 560 }}>
          <p className="font-mono text-[10px] tracking-[3px] text-acc mb-3 animate-fade-up">
            SS 2025 — КАРАКОЛ, КЫРГЫЗСТАН
          </p>
          <h1
            className="font-bebas leading-[0.92] tracking-[4px] animate-fade-up"
            style={{ fontSize: mob ? '17vw' : 'clamp(60px,9vw,110px)', animationDelay: '.1s' }}
          >
            WEAR
            <br />
            <span style={{ WebkitTextStroke: '2px #ff3c00', WebkitTextFillColor: 'transparent' }}>
              YOUR
            </span>
            <br />
            WORLD
          </h1>
          <p
            className="text-t2 leading-[1.65] mt-3.5 animate-fade-up max-w-[320px]"
            style={{ fontSize: mob ? 13 : 15, animationDelay: '.2s' }}
          >
            Лимитированные дропы. Настоящая уличная культура. Кыргызстан.
          </p>
          <div
            className="flex gap-2.5 mt-5 flex-wrap animate-fade-up"
            style={{ animationDelay: '.3s' }}
          >
            <button className="btn-p" onClick={() => router.push('/catalog')}>
              КАТАЛОГ
            </button>
            <button className="btn-o" onClick={() => router.push('/sales')}>
              АКЦИИ →
            </button>
          </div>
        </div>
        <div
          className="absolute font-bebas text-acc/[0.04] pointer-events-none select-none leading-none"
          style={{
            right: mob ? -30 : -10,
            bottom: -20,
            fontSize: mob ? '27vw' : 'clamp(80px,17vw,210px)',
            letterSpacing: 7,
          }}
        >
          STRIKE
        </div>
      </div>

      {/* КАТЕГОРИИ */}
      <div className="sp">
        <div className="flex justify-between items-center mb-4">
          <h2 className="sec-ttl">КАТЕГОРИИ</h2>
          <span
            className="font-mono text-[10px] tracking-widest text-t2 cursor-pointer hover:text-t1 transition-colors"
            onClick={() => router.push('/catalog')}
          >
            Все →
          </span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {display.map((cat, i) => (
            <div
              key={cat.id}
              onClick={() => router.push(`/catalog?category=${cat.id}`)}
              className="bg-card border border-brd cursor-pointer text-center transition-all hover:bg-bg3 hover:border-acc"
              style={{ padding: mob ? '12px 8px' : '18px 14px' }}
            >
              <div className="mb-1" style={{ fontSize: mob ? 20 : 24 }}>
                {ICONS[i]}
              </div>
              <p
                className="font-mono uppercase text-t2 tracking-wide"
                style={{ fontSize: mob ? 7 : 9 }}
              >
                {cat.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* НОВИНКИ */}
      <div className="sp pt-0">
        <div className="flex justify-between items-center mb-4">
          <h2 className="sec-ttl">НОВИНКИ</h2>
          <span
            className="font-mono text-[10px] tracking-widest text-t2 cursor-pointer hover:text-t1 transition-colors"
            onClick={() => router.push('/catalog')}
          >
            Все →
          </span>
        </div>
        {products.length === 0 ? (
          <div className="pgrid">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skel border border-brd" style={{ height: 280 }} />
            ))}
          </div>
        ) : (
          <div className="pgrid">
            {products.slice(0, mob ? 4 : 8).map((p, i) => (
              <div
                key={p.id}
                className="animate-fade-up"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <ProductCard product={p} sm={mob} />
              </div>
            ))}
          </div>
        )}
        {mob && products.length > 0 && (
          <button className="btn-o w-full mt-3.5" onClick={() => router.push('/catalog')}>
            СМОТРЕТЬ ВСЁ
          </button>
        )}
      </div>

      {/* ПРОМО */}
      <div className="sp pt-0">
        <div
          className="relative overflow-hidden bg-acc"
          style={{ padding: mob ? '24px 18px' : '44px 44px' }}
        >
          <div
            className="absolute font-bebas text-black/10 leading-none pointer-events-none select-none"
            style={{ right: -20, bottom: -15, fontSize: mob ? 90 : 170 }}
          >
            SALE
          </div>
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="relative z-10">
              <h2
                className="font-bebas tracking-[4px] leading-[0.92] text-white"
                style={{ fontSize: mob ? 'clamp(30px,10vw,46px)' : 'clamp(38px,5vw,68px)' }}
              >
                СЕЗОННАЯ
                <br />
                РАСПРОДАЖА
              </h2>
              <p className="text-white/80 mt-2 text-[13px]">До 40% · Ограниченные позиции</p>
            </div>
            <button
              onClick={() => router.push('/sales')}
              className="bg-white text-acc border-none px-6 py-3 font-mono text-[11px] tracking-widest font-bold cursor-pointer z-10 flex-shrink-0 hover:scale-[1.04] transition-transform"
            >
              СМОТРЕТЬ →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
