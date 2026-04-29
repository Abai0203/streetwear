'use client'
import { useState } from 'react'
const ITEMS = [
  [
    'Как выбрать размер?',
    'Мы используем оверсайз-крой. Если носишь M — бери M или S. На каждом товаре есть таблица размеров.',
  ],
  ['Сроки доставки?', 'По Кыргызстану — 2–5 дней. Каракол и Бишкек — самовывоз на следующий день.'],
  [
    'Как вернуть товар?',
    'Возврат в течение 14 дней. Товар должен быть с бирками в оригинальном виде.',
  ],
  [
    'Из чего сделана одежда?',
    'Плотный хлопок 340–420 г/м². Никакого полиэстера в базовых позициях.',
  ],
  [
    'Программа лояльности?',
    'После первого заказа попадаешь в STR.KE COMMUNITY в Telegram. Early access на дропы.',
  ],
  ['Оптовые заказы?', 'Да, от 20 единиц. Пиши: hello@str-ke.kg с темой «Опт».'],
  ['Уход за вещами?', 'Стирка 30°C, деликатный режим. Сушить в расправленном виде.'],
]
export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div className="max-w-[700px] mx-auto sp">
      <h1 className="sec-ttl mb-2">FAQ</h1>
      <div className="w-11 h-[3px] bg-acc mb-9" />
      {ITEMS.map(([q, a], i) => (
        <div key={i} className="border-b border-brd">
          <div className="faq-q" onClick={() => setOpen(open === i ? null : i)}>
            <span className="text-[13px]">{q}</span>
            <span
              className="text-acc text-[19px] flex-shrink-0 transition-transform duration-200"
              style={{ transform: open === i ? 'rotate(45deg)' : 'rotate(0)' }}
            >
              +
            </span>
          </div>
          {open === i && (
            <div className="text-[13px] text-t2 leading-[1.82] pb-4 animate-fade-up">{a}</div>
          )}
        </div>
      ))}
    </div>
  )
}
