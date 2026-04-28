'use client'
import { useState } from 'react'
export default function ContactsPage() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', msg: '' })
  return (
    <div className="max-w-[820px] mx-auto sp">
      <h1 className="sec-ttl mb-2">КОНТАКТЫ</h1>
      <div className="w-11 h-[3px] bg-acc mb-9" />
      <div className="flex flex-col sm:flex-row gap-8">
        <div className="flex-1">
          {[
            ['', 'Адрес', 'Кыргызстан, г. Каракол, ул. Советская, 150'],
            ['', 'Телефон', '+996 700 123 456'],
            ['', 'Email', 'hello@str-ke.kg'],
            ['', 'Режим', 'Пн–Пт 11:00–20:00, Сб 12:00–18:00'],
          ].map(([ic, l, v]) => (
            <div key={l as string} className="flex gap-3 mb-5">
              <span className="text-xl flex-shrink-0">{ic}</span>
              <div>
                <p className="font-mono text-[8px] tracking-widest text-t3 mb-0.5">
                  {(l as string).toUpperCase()}
                </p>
                <p className="text-[13px] text-t2">{v}</p>
              </div>
            </div>
          ))}
          <div className="flex gap-2 flex-wrap mt-2">
            {['Telegram', 'Instagram', 'WhatsApp'].map((s) => (
              <button key={s} className="btn-o px-3 py-2 text-[9px]">
                {s}
              </button>
            ))}
          </div>
        </div>
        {sent ? (
          <div className="flex-1 text-center py-9 animate-fade-up">
            <span className="text-5xl">✅</span>
            <div className="font-bebas text-[26px] tracking-[3px] mt-3.5">ОТПРАВЛЕНО!</div>
            <p className="text-[13px] text-t2 mt-2 mb-5">Ответим в течение 24 часов</p>
            <button className="btn-o" onClick={() => setSent(false)}>
              Написать ещё
            </button>
          </div>
        ) : (
          <div className="flex-1">
            <p className="text-[13px] text-t2 mb-4 leading-[1.65]">
              Есть вопрос или идея для коллаба? Пиши.
            </p>
            <input
              className="inp mb-2.5"
              placeholder="Имя"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
            <input
              className="inp mb-2.5"
              placeholder="Email или телефон"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
            <textarea
              className="inp mb-3.5 resize-y"
              rows={4}
              placeholder="Сообщение"
              value={form.msg}
              onChange={(e) => setForm((f) => ({ ...f, msg: e.target.value }))}
            />
            <button className="btn-p w-full" onClick={() => setSent(true)}>
              ОТПРАВИТЬ
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
