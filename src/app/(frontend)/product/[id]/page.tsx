'use client'
import { useState, useEffect, useCallback, use } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/store/useStore'
import { toast } from '@/components/ProductCard'

interface Product {
  id: string
  name: string
  price: number
  oldPrice?: number
  description?: string
  material?: string
  category: { id: string; name: string } | string
  images?: {
    image: { url: string; sizes?: { card?: { url: string }; thumbnail?: { url: string } } }
  }[]
  sizes?: string[]
  inStock?: boolean
  tag?: 'NEW' | 'HIT' | 'SALE'
  rating?: number
  reviewCount?: number
}

const TAGS: Record<string, string> = {
  NEW: 'bg-acc2 text-black',
  HIT: 'bg-acc text-white',
  SALE: 'bg-yellow-400 text-black',
}

export default function ProductPage({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>
}) {
  // Распаковываем params для Next.js 15
  const params = use(paramsPromise)

  const router = useRouter()
  const { addToCart, toggleFavorite, favorites } = useStore()
  const [p, setP] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [size, setSize] = useState<string | null>(null)
  const [qty, setQty] = useState(1)
  const [tab, setTab] = useState('desc')
  const [imgIdx, setImgIdx] = useState(0)

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
    fetch(`${base}/api/products/${params.id}?depth=2`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        setP(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [params.id])

  const total = p?.images?.length || 0
  const prevImg = useCallback(() => setImgIdx((i) => (i - 1 + total) % total), [total])
  const nextImg = useCallback(() => setImgIdx((i) => (i + 1) % total), [total])

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevImg()
      if (e.key === 'ArrowRight') nextImg()
      if (e.key === 'Escape') router.back()
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [prevImg, nextImg, router])

  const getImg = (i: number) => {
    const img = p?.images?.[i]?.image
    if (!img) return null
    return img.sizes?.card?.url || img.url || null
  }

  if (loading)
    return (
      <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-acc border-t-transparent rounded-full animate-spin" />
      </div>
    )

  if (!p)
    return (
      <div className="fixed inset-0 bg-black/85 z-50 flex flex-col items-center justify-center gap-4">
        <div className="text-5xl">😕</div>
        <p className="font-bebas text-3xl tracking-[4px]">ТОВАР НЕ НАЙДЕН</p>
        <button className="btn-p" onClick={() => router.push('/catalog')}>
          В КАТАЛОГ
        </button>
      </div>
    )

  const isFav = favorites.includes(p.id)
  const cat = typeof p.category === 'object' ? p.category.name : p.category
  const disc = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0

  return (
    <div
      className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={() => router.back()}
    >
      <button
        className="fixed top-3 right-3 w-10 h-10 flex items-center justify-center bg-bg3 border border-brd text-t1 text-xl hover:bg-acc hover:border-acc transition-all z-[60]"
        onClick={(e) => {
          e.stopPropagation()
          router.back()
        }}
      >
        ×
      </button>

      <div
        className="w-full max-w-[860px] bg-bg2 border border-brd flex flex-col md:flex-row my-auto animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative bg-bg3 flex-shrink-0 md:w-[44%] flex flex-col">
          <div className="relative w-full overflow-hidden" style={{ aspectRatio: '1/1' }}>
            {getImg(imgIdx) ? (
              <img src={getImg(imgIdx)!} alt={p.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[80px]">👕</div>
            )}

            {p.tag && (
              <span
                className={`absolute top-3 left-3 px-2 py-0.5 font-mono text-[9px] font-bold tracking-[2px] ${TAGS[p.tag]}`}
              >
                {p.tag}
              </span>
            )}

            {total > 1 && (
              <>
                <button
                  onClick={prevImg}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/60 hover:bg-acc text-white border border-white/20 hover:border-acc flex items-center justify-center transition-all text-2xl font-light"
                >
                  ‹
                </button>
                <button
                  onClick={nextImg}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/60 hover:bg-acc text-white border border-white/20 hover:border-acc flex items-center justify-center transition-all text-2xl font-light"
                >
                  ›
                </button>

                <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-0.5 font-mono text-[10px] text-white/80">
                  {imgIdx + 1} / {total}
                </div>
              </>
            )}
          </div>

          {total > 1 && (
            <div className="flex gap-2 p-3 flex-wrap justify-center">
              {p.images!.map((_, i) => (
                <div
                  key={i}
                  onClick={() => setImgIdx(i)}
                  className="w-[50px] h-[50px] cursor-pointer border-2 transition-all overflow-hidden flex-shrink-0 bg-bg3"
                  style={{
                    borderColor: i === imgIdx ? '#ff3c00' : '#2a2a2a',
                    opacity: i === imgIdx ? 1 : 0.55,
                  }}
                >
                  {getImg(i) && (
                    <img src={getImg(i)!} alt="" className="w-full h-full object-cover" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 p-5 sm:p-7 overflow-y-auto" style={{ maxHeight: '92vh' }}>
          <p className="font-mono text-[9px] tracking-[3px] text-acc mb-1.5 uppercase">{cat}</p>

          <h1 className="font-bebas text-[34px] sm:text-[42px] tracking-[3px] leading-none mb-2.5">
            {p.name}
          </h1>

          {p.rating && p.rating > 0 && (
            <div className="flex items-center gap-2 mb-3">
              <span className="text-yellow-400" style={{ fontSize: 13 }}>
                {'★'.repeat(Math.floor(p.rating))}
                {'☆'.repeat(5 - Math.floor(p.rating))}
              </span>
              <span className="text-[12px] text-t2">
                {p.rating}
                {p.reviewCount ? ` · ${p.reviewCount} отзывов` : ''}
              </span>
            </div>
          )}

          <div className="flex items-baseline gap-3 mb-5 flex-wrap">
            <span className="font-bebas text-[36px] tracking-widest">
              {p.price.toLocaleString()} сом
            </span>
            {p.oldPrice && p.oldPrice > 0 && (
              <>
                <span className="text-t3 line-through text-[15px]">
                  {p.oldPrice.toLocaleString()} сом
                </span>
                <span className="bg-yellow-400 text-black px-1.5 py-0.5 text-[10px] font-bold">
                  -{disc}%
                </span>
              </>
            )}
          </div>

          {p.sizes && p.sizes.length > 0 ? (
            <div className="mb-4">
              <p className="font-mono text-[9px] tracking-widest text-t3 mb-2">
                РАЗМЕР {size && <span className="text-t1 ml-2 font-bold">— {size}</span>}
              </p>
              <div className="flex gap-1.5 flex-wrap">
                {p.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className="min-w-[42px] h-[42px] px-2 font-mono text-[11px] font-bold border-2 transition-all cursor-pointer"
                    style={{
                      background: size === s ? '#ff3c00' : '#1a1a1a',
                      borderColor: size === s ? '#ff3c00' : '#2a2a2a',
                      color: size === s ? '#fff' : '#f0ece4',
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <p className="mb-4 font-mono text-[10px] text-t3 tracking-widest">
              ⚠ Добавь размеры в админке → Products → Sizes
            </p>
          )}

          <div className="flex items-center gap-2 mb-3">
            <button className="qty-btn" onClick={() => setQty((q) => Math.max(1, q - 1))}>
              −
            </button>
            <span className="min-w-[28px] text-center font-mono text-[14px] font-bold">{qty}</span>
            <button className="qty-btn" onClick={() => setQty((q) => q + 1)}>
              +
            </button>
          </div>

          <div className="flex gap-2 mb-5">
            <button
              className="btn-p flex-1"
              onClick={() => {
                // Проверка выбора размера
                if (p.sizes && p.sizes.length > 0 && !size) {
                  toast('Пожалуйста, выберите размер')
                  return
                }

                addToCart(
                  {
                    id: p.id,
                    name: p.name,
                    price: p.price,
                    oldPrice: p.oldPrice,
                    image: getImg(0) || undefined,
                    category: cat,
                    size: size || undefined, // Передаем размер
                  },
                  qty,
                )
                toast(`${p.name} ${size ? `(${size})` : ''} в корзине`)
              }}
            >
              В КОРЗИНУ
            </button>
            <button
              className="ibtn text-[18px]"
              style={{
                background: isFav ? '#ff3c00' : '#1a1a1a',
                borderColor: isFav ? '#ff3c00' : '#2a2a2a',
              }}
              onClick={() => {
                toggleFavorite(p.id)
                toast(isFav ? 'Удалено' : 'Добавлено в избранное')
              }}
            >
              {isFav ? '♥' : '♡'}
            </button>
          </div>

          <div className="flex border-b border-brd mb-3">
            {[
              ['desc', 'Описание'],
              ['delivery', 'Доставка'],
              ['care', 'Уход'],
            ].map(([k, v]) => (
              <button
                key={k}
                className={`tab-btn ${tab === k ? 'on' : ''}`}
                onClick={() => setTab(k)}
              >
                {v}
              </button>
            ))}
          </div>
          <p className="text-[13px] text-t2 leading-[1.8]">
            {tab === 'desc' &&
              (p.description ||
                'Оверсайз крой, тяжёлый хлопок 380г/м². Дроп-шоулдер, усиленные швы. Этикетки вытканы на ткани. Ограниченный дроп.')}
            {tab === 'delivery' &&
              'Доставка по Кыргызстану 2–5 дней. Самовывоз — Каракол, Бишкек. Бесплатно от 5 000 сом.'}
            {tab === 'care' &&
              (p.material ? `Состав: ${p.material}. ` : '') +
                'Стирка 30°C, деликатный режим. Сушить в расправленном виде.'}
          </p>

          <div className="mt-4 flex items-center gap-2 text-[12px]">
            <span style={{ color: p.inStock !== false ? '#00ff88' : '#ff3c00' }}>●</span>
            <span className="text-t2">{p.inStock !== false ? 'В наличии' : 'Под заказ'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
