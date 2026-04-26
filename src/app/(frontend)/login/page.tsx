'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/store/useStore'
import { toast } from '@/components/ProductCard'
import { loginUser, registerUser } from '@/lib/api'

export default function LoginPage() {
  const router = useRouter()
  const { setUser } = useStore()
  const [mode, setMode] = useState<'l' | 'r'>('l')
  const [form, setForm] = useState({ name: '', email: '', pw: '' })
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    setErr('')
    if (!form.email || !form.pw) {
      setErr('Заполни все поля')
      return
    }
    if (mode === 'r' && !form.name) {
      setErr('Введи имя')
      return
    }
    setLoading(true)
    try {
      if (mode === 'r') {
        const r = await registerUser({ name: form.name, email: form.email, password: form.pw })
        if (r?.errors) {
          setErr(r.errors[0]?.message || 'Ошибка')
          return
        }
      }
      const r = await loginUser({ email: form.email, password: form.pw })
      if (!r?.user) {
        setErr('Неверный email или пароль')
        return
      }
      setUser({
        id: r.user.id,
        name: r.user.name || form.email.split('@')[0],
        email: r.user.email,
        role: r.user.role,
      })
      toast(`Привет, ${r.user.name}! 👋`)
      router.push('/')
    } catch {
      setErr('Ошибка соединения.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-5">
      <div className="bg-bg2 border border-brd w-full max-w-[420px] p-8 animate-scale-in">
        <div className="font-bebas text-[28px] tracking-[4px] text-center mb-7">
          STR<span className="text-acc">.</span>KE
        </div>
        <div className="flex border-b border-brd mb-6">
          {[
            ['l', 'Войти'],
            ['r', 'Регистрация'],
          ].map(([k, v]) => (
            <button
              key={k}
              className={`tab-btn flex-1 text-center ${mode === k ? 'on' : ''}`}
              onClick={() => {
                setMode(k as 'l' | 'r')
                setErr('')
              }}
            >
              {v}
            </button>
          ))}
        </div>
        {mode === 'r' && (
          <>
            <p className="font-mono text-[10px] tracking-widest text-t3 mb-1.5">ИМЯ</p>
            <input
              className="inp mb-3"
              placeholder="Твоё имя"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </>
        )}
        <p className="font-mono text-[10px] tracking-widest text-t3 mb-1.5">EMAIL</p>
        <input
          className="inp mb-3"
          placeholder="email@example.com"
          type="email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        />
        <p className="font-mono text-[10px] tracking-widest text-t3 mb-1.5">ПАРОЛЬ</p>
        <input
          className="inp mb-4"
          placeholder="••••••••"
          type="password"
          value={form.pw}
          onChange={(e) => setForm((f) => ({ ...f, pw: e.target.value }))}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
        />
        {err && <p className="text-acc font-mono text-[11px] mb-3">⚠ {err}</p>}
        <button className="btn-p w-full" onClick={submit} disabled={loading}>
          {loading ? 'ЗАГРУЗКА...' : mode === 'l' ? 'ВОЙТИ' : 'СОЗДАТЬ АККАУНТ'}
        </button>
        {mode === 'l' && (
          <p className="text-center mt-3.5 text-[12px] text-t3">
            Нет аккаунта?{' '}
            <span className="text-acc cursor-pointer" onClick={() => setMode('r')}>
              Зарегистрируйся
            </span>
          </p>
        )}
        <div className="text-center mt-5">
          <button className="btn-o text-[10px] px-4 py-2" onClick={() => router.push('/')}>
            ← НА ГЛАВНУЮ
          </button>
        </div>
      </div>
    </div>
  )
}
