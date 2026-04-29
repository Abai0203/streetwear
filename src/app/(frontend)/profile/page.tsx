'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/store/useStore'
import { toast } from '@/components/ProductCard'
import { logoutUser } from '@/lib/api'

function AddCardModal({
  onClose,
  onAdd,
}: {
  onClose: () => void
  onAdd: (c: { number: string; name: string; expiry: string }) => void
}) {
  const [f, setF] = useState({ num: '', name: '', exp: '', cvv: '' })
  const [err, setErr] = useState('')
  const fN = (v: string) =>
    v
      .replace(/\D/g, '')
      .slice(0, 16)
      .replace(/(.{4})/g, '$1 ')
      .trim()
  const fE = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 4)
    return d.length >= 2 ? d.slice(0, 2) + '/' + d.slice(2) : d
  }
  const preview = f.num
    .replace(/\D/g, '')
    .padEnd(16, '•')
    .replace(/(.{4})/g, '$1 ')
    .trim()
  const submit = () => {
    if (!f.num || !f.name || !f.exp || !f.cvv) {
      setErr('Заполни все поля')
      return
    }
    onAdd({ number: f.num.replace(/\s/g, ''), name: f.name, expiry: f.exp })
    onClose()
  }
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [])

  return (
    <div className="mdbg" onClick={onClose}>
      <div className="mdsm" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center text-t2 text-xl bg-transparent border-none cursor-pointer hover:text-acc"
        >
          ×
        </button>
        <h2 className="font-bebas text-[26px] tracking-[3px] mb-6">ДОБАВИТЬ КАРТУ</h2>

        {/* Превью карты — без анимации движения */}
        <div
          className="w-full border border-[#3a3a4e] rounded-xl p-5 mb-6 relative overflow-hidden"
          style={{ height: 150, background: 'linear-gradient(135deg,#1a1a2e,#2a2a3e)' }}
        >
          <div className="bank-chip" />
          <p className="font-mono text-[12px] tracking-[3px] text-white/85 mb-2.5">{preview}</p>
          <div className="flex justify-between">
            <div>
              <p className="font-mono text-[7px] tracking-widest text-white/40 mb-0.5">ДЕРЖАТЕЛЬ</p>
              <p className="font-mono text-[10px] tracking-wide text-white/80">
                {f.name.toUpperCase() || 'ВАШЕ ИМЯ'}
              </p>
            </div>
            <div>
              <p className="font-mono text-[7px] tracking-widest text-white/40 mb-0.5">ДО</p>
              <p className="font-mono text-[10px] text-white/80">{f.exp || 'MM/YY'}</p>
            </div>
          </div>
          <div className="absolute -right-5 -top-5 w-[100px] h-[100px] rounded-full bg-white/[0.03]" />
        </div>

        <input
          className="inp mb-2.5"
          placeholder="Номер карты"
          value={f.num}
          onChange={(e) => setF((x) => ({ ...x, num: fN(e.target.value) }))}
          maxLength={19}
        />
        <input
          className="inp mb-2.5"
          placeholder="Имя держателя"
          value={f.name}
          onChange={(e) => setF((x) => ({ ...x, name: e.target.value }))}
        />
        <div className="grid grid-cols-2 gap-2.5">
          <input
            className="inp"
            placeholder="MM/YY"
            value={f.exp}
            onChange={(e) => setF((x) => ({ ...x, exp: fE(e.target.value) }))}
            maxLength={5}
          />
          <input
            className="inp"
            placeholder="CVV"
            type="password"
            value={f.cvv}
            onChange={(e) =>
              setF((x) => ({ ...x, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) }))
            }
            maxLength={3}
          />
        </div>
        {err && <p className="text-acc font-mono text-[11px] mt-2">⚠ {err}</p>}
        <p className="text-[11px] text-t3 mt-3 mb-5">🔒 CVV не сохраняется. Демо-режим.</p>
        <button className="btn-p w-full" onClick={submit}>
          ПРИВЯЗАТЬ КАРТУ
        </button>
      </div>
    </div>
  )
}

const GRADIENTS = [
  'linear-gradient(135deg,#1a1a2e,#2a2a3e)',
  'linear-gradient(135deg,#16213e,#2c3e5e)',
  'linear-gradient(135deg,#0f3460,#1a4a80)',
  'linear-gradient(135deg,#1a2a1a,#2a3a2a)',
  'linear-gradient(135deg,#2a1a1a,#3a2a2a)',
]

export default function ProfilePage() {
  const router = useRouter()
  const { user, setUser, cards, addCard } = useStore()
  const [showCard, setShowCard] = useState(false)
  const [mob, setMob] = useState(false)
  useEffect(() => {
    if (!user) router.push('/login')
    const c = () => setMob(window.innerWidth < 640)
    c()
    window.addEventListener('resize', c)
    return () => window.removeEventListener('resize', c)
  }, [user])
  if (!user) return null

  const handleLogout = async () => {
    await logoutUser()
    setUser(null)
    toast('Вышел из аккаунта')
    router.push('/')
  }

  return (
    <div className="max-w-[680px] mx-auto sp">
      <h1 className="sec-ttl mb-7">ПРОФИЛЬ</h1>

      {/* Аватар */}
      <div className="flex items-center gap-4 mb-9 p-5 bg-card border border-brd">
        <div
          className="flex-shrink-0 flex items-center justify-center bg-acc font-bebas text-white"
          style={{ width: mob ? 52 : 68, height: mob ? 52 : 68, fontSize: mob ? 28 : 34 }}
        >
          {user.name[0].toUpperCase()}
        </div>
        <div>
          <p className="font-bebas tracking-[3px]" style={{ fontSize: mob ? 22 : 28 }}>
            {user.name}
          </p>
          <p className="text-[12px] text-t3 mt-0.5">{user.email}</p>
          {user.role === 'admin' && (
            <a href="/admin" target="_blank">
              <span className="inline-block mt-1 bg-acc text-white px-2 py-0.5 font-mono text-[9px] tracking-widest cursor-pointer">
                ADMIN →
              </span>
            </a>
          )}
        </div>
      </div>

      {/* Карты */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <p className="font-mono text-[10px] tracking-[3px] text-t3">МОИ КАРТЫ</p>
          <button className="btn-o px-3 py-1.5 text-[9px]" onClick={() => setShowCard(true)}>
            + ДОБАВИТЬ
          </button>
        </div>
        {cards.length === 0 ? (
          <div className="p-5 bg-card border border-brd text-center text-t3 text-[13px]">
            Нет привязанных карт
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {cards.map((c, i) => (
              <div
                key={i}
                className="w-full rounded-xl p-5 relative overflow-hidden font-mono border border-[#3a3a3a]"
                style={{ height: 170, background: GRADIENTS[i % 5] }}
              >
                <div className="bank-chip" />
                <p className="text-[13px] tracking-[3px] text-white/85 mb-3">
                  •••• •••• •••• {c.number.slice(-4)}
                </p>
                <div className="flex justify-between">
                  <div>
                    <p className="text-[7px] tracking-widest text-white/40 mb-0.5">ДЕРЖАТЕЛЬ</p>
                    <p className="text-[10px] tracking-wide text-white/80">
                      {c.name.toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <p className="text-[7px] tracking-widest text-white/40 mb-0.5">ДО</p>
                    <p className="text-[10px] text-white/80">{c.expiry}</p>
                  </div>
                </div>
                <div className="absolute -right-5 -top-5 w-[100px] h-[100px] rounded-full bg-white/[0.03]" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Быстрые ссылки */}
      <div className="mb-8">
        <p className="font-mono text-[10px] tracking-[3px] text-t3 mb-4">БЫСТРЫЕ ССЫЛКИ</p>
        <div
          className="flex items-center gap-3 p-4 bg-card border border-brd cursor-pointer hover:border-acc/50 transition-colors"
          onClick={() => router.push('/orders')}
        >
          <span className="text-xl">📋</span>
          <span className="font-bebas tracking-[2px] text-[18px]">Мои заказы</span>
        </div>
      </div>

      <button className="btn-o border-acc/30 text-acc" onClick={handleLogout}>
        ВЫЙТИ ИЗ АККАУНТА
      </button>

      {showCard && (
        <AddCardModal
          onClose={() => setShowCard(false)}
          onAdd={(c) => {
            addCard(c)
            toast('Карта привязана ✓')
            setShowCard(false)
          }}
        />
      )}
    </div>
  )
}
