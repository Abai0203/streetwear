'use client'
// src/app/(frontend)/orders/page.tsx

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/store/useStore'

const STEPS = [
  {
    key: 'pending',
    icon: '📋',
    label: 'Заказ оформлен',
    desc: 'Мы получили твой заказ и начинаем обработку',
  },
  {
    key: 'confirmed',
    icon: '📦',
    label: 'Собирается / Упаковывается',
    desc: 'Твой заказ комплектуется на складе',
  },
  {
    key: 'shipped',
    icon: '🚚',
    label: 'Передан в доставку',
    desc: 'Заказ передан курьерской службе',
  },
  { key: 'delivery', icon: '📍', label: 'В пути', desc: 'Курьер едет к тебе' },
  { key: 'delivered', icon: '✅', label: 'Доставлен', desc: 'Заказ успешно доставлен' },
]

const STATUS_STEP: Record<string, number> = {
  pending: 0,
  confirmed: 1,
  shipped: 2,
  delivery: 3,
  delivered: 4,
  cancelled: -1,
}

interface Order {
  id: string
  orderNumber: string
  status: string
  total: number
  createdAt: string
  city?: string
  address?: string
  phone?: string
  paymentMethod?: string
  items: {
    product: { name: string; price: number; images?: any[] } | string
    qty: number
    size?: string
    price: number
  }[]
}

function OrderTracker({ order }: { order: Order }) {
  const [open, setOpen] = useState(false)
  const currentStep = STATUS_STEP[order.status] ?? 0
  const isCancelled = order.status === 'cancelled'

  const date = new Date(order.createdAt).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="bg-bg2 border border-brd mb-4 overflow-hidden">
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-bg3 transition-colors"
        onClick={() => setOpen((o) => !o)}
      >
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-bebas text-[20px] tracking-[2px]">{order.orderNumber}</span>
            {isCancelled ? (
              <span className="px-2 py-0.5 bg-acc/20 text-acc font-mono text-[9px] tracking-widest">
                ОТМЕНЁН
              </span>
            ) : order.status === 'delivered' ? (
              <span className="px-2 py-0.5 bg-acc2/20 text-acc2 font-mono text-[9px] tracking-widest">
                ДОСТАВЛЕН
              </span>
            ) : (
              <span className="px-2 py-0.5 bg-yellow-400/20 text-yellow-400 font-mono text-[9px] tracking-widest">
                В ОБРАБОТКЕ
              </span>
            )}
          </div>
          <p className="text-t3 text-[12px] mt-0.5">
            {date} · {order.total.toLocaleString()} сом
          </p>
        </div>
        <span
          className="text-t2 text-[20px] transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)' }}
        >
          ˅
        </span>
      </div>

      {open && (
        <div className="border-t border-brd animate-fade-up">
          {!isCancelled && (
            <div className="p-5">
              <p className="font-mono text-[10px] tracking-[3px] text-t3 mb-5">СТАТУС ЗАКАЗА</p>

              <div className="relative">
                <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-brd" />

                <div
                  className="absolute left-[19px] top-0 w-0.5 bg-acc transition-all duration-700"
                  style={{
                    height:
                      currentStep === 0 ? '0%' : `${(currentStep / (STEPS.length - 1)) * 100}%`,
                  }}
                />

                <div className="flex flex-col gap-6 relative">
                  {STEPS.map((step, i) => {
                    const done = i < currentStep
                    const current = i === currentStep
                    const future = i > currentStep

                    return (
                      <div key={step.key} className="flex items-start gap-4">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center border-2 text-[16px]"
                          style={{
                            background: done || current ? (done ? '#ff3c00' : '#1a1a1a') : '#111',
                            borderColor: done ? '#ff3c00' : current ? '#ff3c00' : '#2a2a2a',
                            opacity: future ? 0.4 : 1,
                          }}
                        >
                          {done ? '✓' : step.icon}
                        </div>

                        <div className="pt-1.5">
                          <p
                            className="font-bold text-[13px]"
                            style={{ color: current ? '#ff3c00' : future ? '#555' : '#f0ece4' }}
                          >
                            {step.label}
                          </p>
                          {(done || current) && (
                            <p className="text-t3 text-[12px] mt-0.5">{step.desc}</p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {isCancelled && (
            <div className="p-5 flex items-center gap-3">
              <span className="text-3xl">❌</span>
              <div>
                <p className="font-bold text-acc text-[14px]">Заказ отменён</p>
                <p className="text-t3 text-[12px] mt-0.5">Если есть вопросы — свяжись с нами</p>
              </div>
            </div>
          )}

          <div className="border-t border-brd mx-5" />

          <div className="p-5">
            <p className="font-mono text-[10px] tracking-[3px] text-t3 mb-3">ТОВАРЫ</p>
            {order.items.map((item, i) => {
              const name = typeof item.product === 'object' ? item.product.name : 'Товар'
              const price =
                item.price || (typeof item.product === 'object' ? item.product.price : 0)
              return (
                <div key={i} className="flex justify-between text-[13px]">
                  <div>
                    {name} × {item.qty}
                  </div>
                  <span>{(price * item.qty).toLocaleString()} сом</span>
                </div>
              )
            })}
          </div>

          <div className="border-t border-brd mx-5" />

          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              [
                '📍',
                'Адрес',
                order.city && order.address
                  ? `${order.city}, ${order.address}`
                  : order.city || order.address || '—',
              ],
              ['📞', 'Телефон', order.phone || '—'],
              [
                '💳',
                'Оплата',
                (
                  {
                    cash: 'Наличными',
                    card: 'Картой',
                    mbank: 'MBANK',
                    omoney: 'O!Money',
                  } as Record<string, string>
                )[order.paymentMethod || ''] || '—',
              ],
              ['💰', 'Итого', `${order.total.toLocaleString()} сом`],
            ].map(([icon, label, value]) => (
              <div key={label as string} className="flex gap-2">
                <span>{icon}</span>
                <div>
                  <p>{label}</p>
                  <p>{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function OrdersPage() {
  const router = useRouter()
  const { user } = useStore()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    const base = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

    fetch(`${base}/api/orders?depth=2&limit=20`, {
      credentials: 'include',
      cache: 'no-store',
    })
      .then((r) => (r.ok ? r.json() : { docs: [] }))
      .then((data) => {
        setOrders(data.docs || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [user])

  if (!user) return null

  return (
    <div>
      {orders.map((o) => (
        <OrderTracker key={o.id} order={o} />
      ))}
    </div>
  )
}
