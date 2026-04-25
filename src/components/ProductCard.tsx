'use client'
import { useRouter } from 'next/navigation'
import { useStore } from '@/store/useStore'
import type { Product } from '@/lib/api'

const TAGS = {
  NEW: 'bg-acc2 text-black',
  HIT: 'bg-acc text-white',
  SALE: 'bg-yellow-400 text-black',
} as const
const Stars = ({ r }: { r: number }) => (
  <span className="star text-[11px]">
    {'★'.repeat(Math.floor(r))}
    {'☆'.repeat(5 - Math.floor(r))}
  </span>
)

export const toast = (msg: string) =>
  typeof window !== 'undefined' && window.dispatchEvent(new CustomEvent('toast', { detail: msg }))

export default function ProductCard({
  product: p,
  sm = false,
}: {
  product: Product
  sm?: boolean
}) {
  const router = useRouter()
  const { addToCart, favorites, toggleFavorite } = useStore()
  const isFav = favorites.includes(p.id)
  const img = p.images?.[0]?.image?.sizes?.card?.url || p.images?.[0]?.image?.url
  const cat = typeof p.category === 'object' ? p.category.name : p.category

  const doAdd = (e: React.MouseEvent) => {
    e.stopPropagation()
    addToCart({
      id: p.id,
      name: p.name,
      price: p.price,
      oldPrice: p.oldPrice,
      image: img,
      category: cat,
    })
    toast(`${p.name} добавлен`)
  }
  const doFav = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleFavorite(p.id)
    toast(isFav ? 'Удалено' : 'Добавлено в избранное')
  }

  return (
    <div className="pc" onClick={() => router.push(`/product/${p.id}`)}>
      {/* Фото */}
      <div
        className={`relative flex items-center justify-center bg-bg3 ${sm ? 'text-5xl' : 'text-7xl'}`}
        style={{
          height: sm ? 130 : 210,
          backgroundImage: img ? `url(${img})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {!img && '👕'}
        {p.tag && (
          <span
            className={`absolute top-2 left-2 px-2 py-0.5 font-mono text-[9px] font-bold tracking-[1.5px] ${TAGS[p.tag]}`}
          >
            {p.tag}
          </span>
        )}
        <div className="cfav" onClick={doFav}>
          <button className="ibtn !w-8 !h-8 text-[13px]">{isFav ? '♥' : '♡'}</button>
        </div>
      </div>

      {/* В корзину */}
      <div className="qadd" onClick={doAdd}>
        + В КОРЗИНУ
      </div>

      {/* Инфо */}
      <div className={sm ? 'p-2.5 pb-3' : 'p-3 pb-4'}>
        <p className="font-mono text-[8px] tracking-[1.5px] text-t3 mb-1 uppercase truncate">
          {cat}
        </p>
        <p
          className={`font-bold tracking-tight mb-1.5 truncate ${sm ? 'text-[11px]' : 'text-[12px]'}`}
        >
          {p.name}
        </p>
        {p.rating && (
          <div className="flex items-center gap-1 mb-1.5">
            <Stars r={p.rating} />
            <span className="text-[10px] text-t3">{p.rating}</span>
          </div>
        )}
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span className={`font-bebas tracking-wide ${sm ? 'text-[17px]' : 'text-[21px]'}`}>
            {p.price.toLocaleString()} сом
          </span>
          {p.oldPrice && (
            <span className="text-[10px] text-t3 line-through">{p.oldPrice.toLocaleString()}</span>
          )}
        </div>
      </div>
    </div>
  )
}
