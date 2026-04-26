'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/store/useStore'
import { toast } from '@/components/ProductCard'
import { createOrder } from '@/lib/api'

export default function CartPage() {
  const router = useRouter()
  const { cart, removeFromCart, changeQty, clearCart, user } = useStore()
  const [mob, setMob] = useState(false)
  const [step, setStep] = useState<'cart' | 'checkout' | 'done'>('cart')
  const [sending, setSending] = useState(false)
  const [form, setForm] = useState({ city: '', address: '', phone: '', comment: '' })
  const [pay, setPay] = useState('cash')

  useEffect(() => {
    const c = () => setMob(window.innerWidth < 768)
    c()
    window.addEventListener('resize', c)
    return () => window.removeEventListener('resize', c)
  }, [])

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0)

  const handleOrder = async () => {
    if (!form.phone) {
      toast('Укажи телефон')
      return
    }
    setSending(true)
    try {
      await createOrder({
        items: cart.map((i) => ({ product: i.id, qty: i.qty, price: i.price, size: i.size })),
        total,
        ...form,
        paymentMethod: pay,
      })
      clearCart()
      setStep('done')
    } catch {
      toast('Ошибка. Попробуй снова.')
    } finally {
      setSending(false)
    }
  }

  if (step === 'done')
    return (
      <div className="text-center py-20 px-5 animate-fade-up">
        <div className="text-7xl mb-4">✅</div>
        <h1 className="font-bebas text-5xl tracking-[4px] mb-3">ЗАКАЗ ОФОРМЛЕН!</h1>
        <p className="text-t2 text-sm mb-8">Мы свяжемся с тобой по телефону. Спасибо!</p>
        <button className="btn-p" onClick={() => router.push('/catalog')}>
          ПРОДОЛЖИТЬ ПОКУПКИ
        </button>
      </div>
    )

  if (cart.length === 0)
    return (
      <div className="text-center py-20 px-5">
        <div className="text-7xl mb-4 animate-bjump">🛒</div>
        <h1 className="font-bebas tracking-[4px]" style={{ fontSize: mob ? 32 : 44 }}>
          КОРЗИНА ПУСТА
        </h1>
        <p className="text-t3 mt-2 mb-7 text-sm">Добавь что-нибудь из каталога</p>
        <button className="btn-p" onClick={() => router.push('/catalog')}>
          В КАТАЛОГ
        </button>
      </div>
    )

  return (
    <div className="max-w-[960px] mx-auto sp">
      <h1 className="sec-ttl mb-6">
        {step === 'cart' ? 'КОРЗИНА' : 'ОФОРМЛЕНИЕ'}{' '}
        <span className="text-[0.42em] text-t3">({cart.length})</span>
      </h1>
      <div className={`flex gap-6 ${mob ? 'flex-col' : 'flex-row items-start'}`}>
        <div className="flex-1">
          {step === 'cart' ? (
            cart.map((item) => (
              <div key={item.id} className="flex gap-3 pb-3.5 mb-3.5 border-b border-brd">
                <div
                  className="flex-shrink-0 flex items-center justify-center bg-bg3 cursor-pointer"
                  onClick={() => router.push(`/product/${item.id}`)}
                  style={{
                    width: mob ? 64 : 80,
                    height: mob ? 64 : 80,
                    backgroundImage: item.image ? `url(${item.image})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    fontSize: mob ? 26 : 32,
                  }}
                >
                  {!item.image && '👕'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold truncate mb-0.5" style={{ fontSize: mob ? 11 : 13 }}>
                    {item.name}
                  </p>
                  <p className="font-mono text-[9px] text-t3 mb-2">
                    {item.category}
                    {item.size ? ` · ${item.size}` : ''}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      className="qty-btn !w-[30px] !h-[30px]"
                      onClick={() => changeQty(item.id, item.qty - 1)}
                    >
                      −
                    </button>
                    <span className="min-w-[20px] text-center font-mono text-[13px] font-bold">
                      {item.qty}
                    </span>
                    <button
                      className="qty-btn !w-[30px] !h-[30px]"
                      onClick={() => changeQty(item.id, item.qty + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bebas tracking-wide" style={{ fontSize: mob ? 16 : 21 }}>
                    {(item.price * item.qty).toLocaleString()} сом
                  </p>
                  <button
                    className="text-t3 text-[11px] mt-1.5 bg-transparent border-none cursor-pointer hover:text-acc transition-colors"
                    onClick={() => removeFromCart(item.id)}
                  >
                    удалить
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div>
              <p className="font-mono text-[11px] tracking-[3px] text-t3 mb-5">ДАННЫЕ ДОСТАВКИ</p>
              {[
                { k: 'city', l: 'Город', p: 'Каракол / Бишкек' },
                { k: 'address', l: 'Адрес', p: 'Улица, дом' },
                { k: 'phone', l: 'Телефон *', p: '+996 700 000 000' },
                { k: 'comment', l: 'Комментарий', p: 'Пожелания...' },
              ].map(({ k, l, p }) => (
                <div key={k} className="mb-3">
                  <p className="font-mono text-[10px] tracking-widest text-t3 mb-1.5">
                    {l.toUpperCase()}
                  </p>
                  <input
                    className="inp"
                    placeholder={p}
                    value={(form as any)[k]}
                    onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))}
                  />
                </div>
              ))}
              <p className="font-mono text-[11px] tracking-[3px] text-t3 mt-5 mb-3">
                СПОСОБ ОПЛАТЫ
              </p>
              <div className="flex flex-col gap-2">
                {[
                  ['cash', '💵 Наличными'],
                  ['card', '💳 Карта'],
                  ['mbank', '📱 MBANK'],
                  ['omoney', '📱 O!Money'],
                ].map(([v, l]) => (
                  <label
                    key={v}
                    className={`flex items-center gap-2.5 cursor-pointer px-3 py-2.5 border transition-colors ${pay === v ? 'border-acc bg-bg3' : 'border-brd'}`}
                  >
                    <input
                      type="radio"
                      name="pay"
                      value={v}
                      checked={pay === v}
                      onChange={() => setPay(v)}
                      className="accent-acc"
                    />
                    <span className="text-sm">{l}</span>
                  </label>
                ))}
              </div>
              <button className="btn-o mt-4" onClick={() => setStep('cart')}>
                ← НАЗАД
              </button>
            </div>
          )}
        </div>

        {/* Итого */}
        <div
          className={`bg-card border border-brd p-5 ${mob ? 'w-full' : 'w-[300px] flex-shrink-0 sticky top-20'}`}
        >
          <p className="font-mono text-[10px] tracking-[3px] text-t3 mb-3.5">ИТОГО</p>
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between text-[11px] text-t2 mb-1.5">
              <span className="truncate flex-1 mr-2">
                {item.name} ×{item.qty}
              </span>
              <span className="flex-shrink-0">{(item.price * item.qty).toLocaleString()}</span>
            </div>
          ))}
          <div className="border-t border-brd my-3" />
          {total < 5000 && (
            <div className="bg-bg3 border border-brd px-2.5 py-2 text-[11px] text-t2 mb-3">
              До беспл. доставки: {(5000 - total).toLocaleString()} сом
            </div>
          )}
          <div className="flex justify-between items-baseline mb-4">
            <span className="font-mono text-[10px]">ИТОГО</span>
            <span className="font-bebas text-[28px] tracking-widest">
              {total.toLocaleString()} сом
            </span>
          </div>
          {step === 'cart' ? (
            <>
              <button className="btn-p w-full" onClick={() => setStep('checkout')}>
                ОФОРМИТЬ ЗАКАЗ
              </button>
              <button className="btn-o w-full mt-2.5" onClick={() => router.push('/catalog')}>
                ПРОДОЛЖИТЬ
              </button>
            </>
          ) : (
            <button className="btn-p w-full" onClick={handleOrder} disabled={sending}>
              {sending ? 'ОФОРМЛЯЕМ...' : 'ПОДТВЕРДИТЬ'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
