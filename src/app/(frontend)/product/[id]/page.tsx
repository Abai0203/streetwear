'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useStore } from '@/store/useStore'
import { toast } from '@/components/ProductCard'

// ─── Типы ────────────────────────────────────────────────────
interface Product {
  id: string
  name: string
  price: number
  oldPrice?: number
  description?: string
  material?: string
  category: { id: string; name: string } | string
  images?: { image: { url: string } }[]
  sizes?: string[]
  inStock?: boolean
  tag?: 'NEW' | 'HIT' | 'SALE'
  rating?: number
}

const TAG_COLORS: Record<string, string> = {
  NEW: 'bg-acc2 text-black',
  HIT: 'bg-acc text-white',
  SALE: 'bg-yellow-400 text-black',
}

export default function ProductPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()

  const { addToCart, toggleFavorite, favorites } = useStore()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const [size, setSize] = useState<string | null>(null)
  const [qty, setQty] = useState(1)
  const [tab, setTab] = useState('desc')
  const [imgIdx, setImgIdx] = useState(0)
  const [mob, setMob] = useState(false)

  // mobile check
  useEffect(() => {
    const check = () => setMob(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // ─── FETCH PRODUCT (FIXED PAYLOAD WAY) ─────────────────────
  useEffect(() => {
    const id = params?.id
    if (!id) return

    const base = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

    fetch(`${base}/api/products?where[id][equals]=${id}&limit=1`, {
      cache: 'no-store',
    })
      .then((res) => {
        if (!res.ok) throw new Error('Not found')
        return res.json()
      })
      .then((data) => {
        const item = data?.docs?.[0]
        if (!item) throw new Error('No product')

        setProduct(item)
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [params?.id])

  // ─── LOADING ───────────────────────────────────────────────
  if (loading) {
    return (
      <div className="max-w-[1100px] mx-auto sp">
        <div className="flex gap-10 flex-col md:flex-row">
          <div className="skel border border-brd md:w-[45%]" style={{ aspectRatio: '1/1' }} />
          <div className="flex-1 flex flex-col gap-4">
            <div className="skel h-8 w-3/4 border border-brd" />
            <div className="skel h-6 w-1/2 border border-brd" />
            <div className="skel h-10 w-1/3 border border-brd" />
            <div className="skel h-24 border border-brd" />
          </div>
        </div>
      </div>
    )
  }

  // ─── ERROR ───────────────────────────────────────────────
  if (error || !product) {
    return (
      <div className="text-center py-20 px-5">
        <div className="text-6xl mb-4">😕</div>
        <h1 className="font-bebas text-4xl tracking-[4px] mb-3">ТОВАР НЕ НАЙДЕН</h1>
        <button className="btn-p" onClick={() => router.push('/catalog')}>
          В КАТАЛОГ
        </button>
      </div>
    )
  }

  // ─── DATA ───────────────────────────────────────────────
  const p = product
  const isFav = favorites.includes(p.id)

  const imgUrl = p.images?.[imgIdx]?.image?.url
  const cat = typeof p.category === 'object' ? p.category.name : p.category
  const disc = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0

  const handleAdd = () => {
    addToCart(
      {
        id: p.id,
        name: p.name,
        price: p.price,
        oldPrice: p.oldPrice,
        image: imgUrl,
        category: cat,
      },
      qty,
    )
    toast(`${p.name} добавлен в корзину`)
  }

  const handleFav = () => {
    toggleFavorite(p.id)
    toast(isFav ? 'Удалено из избранного' : 'Добавлено в избранное')
  }

  return (
    <div className="max-w-[1100px] mx-auto sp">
      {/* breadcrumbs */}
      <div className="flex gap-2 text-[11px] text-t3 mb-6">
        <span onClick={() => router.push('/')} className="cursor-pointer">
          ГЛАВНАЯ
        </span>
        <span>›</span>
        <span onClick={() => router.push('/catalog')} className="cursor-pointer">
          КАТАЛОГ
        </span>
        <span>›</span>
        <span className="text-t1">{p.name}</span>
      </div>

      <div className={`flex gap-10 ${mob ? 'flex-col' : 'flex-row'}`}>
        {/* IMAGE */}
        <div style={{ width: mob ? '100%' : '45%' }}>
          <div
            className="border border-brd bg-bg3"
            style={{
              aspectRatio: '1/1',
              backgroundImage: imgUrl ? `url(${imgUrl})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        </div>

        {/* INFO */}
        <div className="flex-1">
          <p className="text-acc text-[9px] mb-2">{cat}</p>

          <h1 className="font-bebas text-[42px] mb-3">{p.name}</h1>

          <div className="text-[32px] font-bebas mb-4">{p.price.toLocaleString()} сом</div>

          <button className="btn-p w-full mb-2" onClick={handleAdd}>
            В КОРЗИНУ
          </button>

          <button className="ibtn" onClick={handleFav}>
            {isFav ? '♥' : '♡'}
          </button>

          <p className="mt-5 text-t2 text-sm">{p.description || 'Описание отсутствует'}</p>
        </div>
      </div>
    </div>
  )
}
