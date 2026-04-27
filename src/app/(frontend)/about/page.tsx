'use client'
const HISTORY = [
  {
    year: '2021',
    title: 'Как всё началось',
    text: 'STR.KE родился в Караколе у подножия Тянь-Шаня. Двое друзей решили делать одежду, которой им самим не хватало. Первый тираж: 50 футболок — разошлись за сутки.',
  },
  {
    year: '2022',
    title: 'Рост сообщества',
    text: 'Перешли на плотные ткани 380г/м², запустили pre-order дропы. Первый «большой дроп» — 200 единиц — разошёлся за 3 часа. Заказы пошли по всему Кыргызстану.',
  },
  {
    year: '2023',
    title: 'Комьюнити прежде всего',
    text: 'Запустили закрытый Telegram STR.KE COMMUNITY — голосования за коллекции, ранние продажи, коллаборации с местными художниками. Сейчас там 5 000+ человек.',
  },
  {
    year: '2024',
    title: 'Сегодня',
    text: 'Более 10 000 заказов по Кыргызстану и СНГ. Шоурум в Бишкеке. Команда из 8 человек. Каждый дроп — событие.',
  },
]
export default function AboutPage() {
  return (
    <div className="max-w-[820px] mx-auto sp">
      <h1 className="sec-ttl mb-2">О НАС</h1>
      <div className="w-11 h-[3px] bg-acc mb-9" />
      {HISTORY.map((s, i) => (
        <div
          key={i}
          className="grid gap-4 mb-9 animate-fade-up"
          style={{ gridTemplateColumns: '56px 1fr', animationDelay: `${i * 0.09}s` }}
        >
          <div className="font-bebas text-[22px] tracking-[3px] text-acc pt-0.5">{s.year}</div>
          <div>
            <h3 className="text-[15px] font-bold mb-1.5">{s.title}</h3>
            <p className="text-[13px] text-t2 leading-[1.82]">{s.text}</p>
          </div>
        </div>
      ))}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {[
          ['10K+', 'заказов'],
          ['5K+', 'комьюнити'],
          ['2021', 'основание'],
          ['100%', 'made in KG'],
        ].map(([n, l]) => (
          <div key={n} className="bg-card border border-brd p-5 text-center">
            <div className="font-bebas text-[32px] tracking-[3px] text-acc">{n}</div>
            <div className="text-[11px] text-t3 mt-0.5">{l}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
