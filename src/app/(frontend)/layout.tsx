'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/store/useStore'
import './globals.css'

function Toast() {
  const [msg, setMsg] = useState<string | null>(null)
  useEffect(() => {
    const h = (e: Event) => {
      setMsg((e as CustomEvent).detail)
      setTimeout(() => setMsg(null), 2500)
    }
    window.addEventListener('toast', h)
    return () => window.removeEventListener('toast', h)
  }, [])
  return msg ? (
    <div className="toast">
      <span className="text-acc2">✓</span>
      {msg}
    </div>
  ) : null
}

const SB = [
  { icon: '⌂', label: 'Главная', href: '/' },
  { icon: '◈', label: 'О нас', href: '/about' },
  { icon: '◻', label: 'Одежда', href: '/catalog' },
  { icon: '✦', label: 'Акции', href: '/sales' },
  { icon: '◉', label: 'Отзывы', href: '/reviews' },
  { icon: '◈', label: 'Контакты', href: '/contacts' },
  { icon: '?', label: 'FAQ', href: '/faq' },
]

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter()
  return (
    <>
      <div className={`sb-overlay ${open ? 'open' : ''}`} onClick={onClose} />
      <div className={`sb ${open ? 'open' : ''}`}>
        <div className="flex items-center justify-between px-4 py-5 border-b border-brd flex-shrink-0">
          <span className="logo">
            STR<span className="text-acc">.</span>KE
          </span>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center text-t2 text-2xl bg-transparent border-none cursor-pointer hover:text-acc"
          >
            ×
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto pt-1">
          {SB.map((item, i) => (
            <div
              key={i}
              className="sb-item"
              onClick={() => {
                router.push(item.href)
                onClose()
              }}
            >
              <span className="text-acc text-[13px] w-4 text-center flex-shrink-0">
                {item.icon}
              </span>
              {item.label}
            </div>
          ))}
        </nav>
        <div className="p-4 border-t border-brd flex-shrink-0">
          <p className="font-mono text-[9px] tracking-widest text-t3 mb-2">SOCIALS</p>
          <div className="flex gap-1.5">
            {['TG', 'IG', 'WA'].map((s) => (
              <button key={s} className="btn-o px-3 py-1.5 text-[10px]">
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

function Header({ onSidebar }: { onSidebar: () => void }) {
  const router = useRouter()
  const { cart, favorites, user } = useStore()
  const [so, setSo] = useState(false)
  const [mob, setMob] = useState(false)
  useEffect(() => {
    const c = () => setMob(window.innerWidth < 640)
    c()
    window.addEventListener('resize', c)
    return () => window.removeEventListener('resize', c)
  }, [])
  const cn = cart.reduce((s, i) => s + i.qty, 0)
  return (
    <header className="sticky top-0 z-50 bg-[rgba(10,10,10,0.97)] backdrop-blur-xl border-b border-brd">
      <div className="max-w-[1440px] mx-auto px-3 h-[54px] flex items-center gap-2">
        <button
          onClick={onSidebar}
          className="flex flex-col gap-1.5 p-1 bg-transparent border-none cursor-pointer flex-shrink-0"
        >
          {[22, 16, 22].map((w, i) => (
            <span key={i} className="block h-0.5 bg-t1" style={{ width: w }} />
          ))}
        </button>
        <div className="logo" onClick={() => router.push('/')}>
          STR<span className="text-acc">.</span>KE
        </div>
        <nav className="hidden lg:flex gap-4 flex-1 ml-3 overflow-hidden">
          {['Джинсы', 'Штаны', 'Зипки', 'Футболки', 'Куртки', 'Аксессуары'].map((c) => (
            <span
              key={c}
              onClick={() => router.push('/catalog')}
              className="font-mono text-[10px] tracking-widest uppercase text-t2 cursor-pointer whitespace-nowrap hover:text-t1 transition-colors"
            >
              {c}
            </span>
          ))}
        </nav>
        <div className="flex-1" />
        <div className="flex items-center gap-1">
          {so ? (
            <div
              className={`flex gap-1.5 ${mob ? 'fixed left-0 right-0 top-[54px] bg-bg2 px-3 py-2.5 border-b border-brd z-[98]' : ''}`}
            >
              <input
                className="inp text-[13px]"
                style={{ width: mob ? 'calc(100% - 52px)' : 190 }}
                placeholder="Поиск..."
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    router.push(
                      `/catalog?q=${encodeURIComponent((e.target as HTMLInputElement).value)}`,
                    )
                    setSo(false)
                  }
                }}
                onBlur={() => setTimeout(() => setSo(false), 150)}
              />
              <button className="ibtn flex-shrink-0" onClick={() => setSo(false)}>
                ×
              </button>
            </div>
          ) : (
            <button className="ibtn" onClick={() => setSo(true)}>
              🔍
            </button>
          )}
          <button className="ibtn relative" onClick={() => router.push('/favorites')}>
            ♡{favorites.length > 0 && <span className="bdg">{favorites.length}</span>}
          </button>
          <button className="ibtn relative" onClick={() => router.push('/cart')}>
            🛒{cn > 0 && <span className="bdg">{cn}</span>}
          </button>
          {user ? (
            <button
              className="ibtn font-mono text-[13px] font-bold"
              onClick={() => router.push('/profile')}
            >
              {user.name[0].toUpperCase()}
            </button>
          ) : (
            <button
              className="btn-o px-2.5 py-1.5 text-[10px]"
              onClick={() => router.push('/login')}
            >
              {mob ? '👤' : 'ВОЙТИ'}
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

function Footer() {
  const router = useRouter()
  const cols = [
    [
      'Магазин',
      [
        ['/', 'Главная'],
        ['/catalog', 'Каталог'],
        ['/sales', 'Акции'],
      ],
    ],
    [
      'Помощь',
      [
        ['/faq', 'FAQ'],
        ['/contacts', 'Контакты'],
      ],
    ],
    [
      'Компания',
      [
        ['/about', 'О нас'],
        ['/reviews', 'Отзывы'],
      ],
    ],
  ] as const
  return (
    <footer className="border-t border-brd bg-bg2 sp">
      <div className="flex flex-wrap justify-between gap-7">
        <div>
          <div className="logo mb-2">
            STR<span className="text-acc">.</span>KE
          </div>
          <p className="text-[11px] text-t3">Каракол, Кыргызстан</p>
        </div>
        <div className="flex flex-wrap gap-7">
          {cols.map(([title, links]) => (
            <div key={title}>
              <p className="font-mono text-[9px] tracking-[3px] text-t3 mb-2 uppercase">{title}</p>
              {links.map(([href, label]) => (
                <div
                  key={label}
                  onClick={() => router.push(href)}
                  className="text-[12px] text-t2 mb-1.5 cursor-pointer hover:text-acc transition-colors"
                >
                  {label}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 pt-4 border-t border-brd flex justify-between flex-wrap gap-2">
        <span className="text-[11px] text-t3">© 2025 STR.KE — Каракол, Кыргызстан</span>
        <span className="text-[11px] text-t3">Made with ❤️ in KG</span>
      </div>
    </footer>
  )
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  const [sb, setSb] = useState(false)
  return (
    <div>
      <Sidebar open={sb} onClose={() => setSb(false)} />
      <Header onSidebar={() => setSb(true)} />
      <main className="min-h-[60vh]">{children}</main>
      <Footer />
      <Toast />
    </div>
  )
}
