'use client'
const RV = [
  {
    n: 'Айдан Б.',
    r: 5,
    d: '12 апр 2025',
    t: 'Покупаю уже третий раз. Качество огонь — плотная ткань, швы держат. Cargo pants носил всю зиму.',
  },
  {
    n: 'Мирлан К.',
    r: 5,
    d: '3 апр 2025',
    t: 'Bomber oversized — лучшая покупка года. Доставка в Бишкек за 2 дня. Буду брать ещё.',
  },
  {
    n: 'Нурай Т.',
    r: 4,
    d: '28 мар 2025',
    t: 'Graphic tee крутой, принт не трескается после стирки. Чуть долго ждала, но оно того стоит.',
  },
  {
    n: 'Эрлан А.',
    r: 5,
    d: '20 мар 2025',
    t: 'Zip hoodie — материал тяжёлый, тёплый. Выглядит дорого, цена норм.',
  },
  {
    n: 'Айгуль С.',
    r: 5,
    d: '15 мар 2025',
    t: 'Шоурум в Бишкеке — отдельный кайф. Взяла parka military, очень доволен.',
  },
  {
    n: 'Бекзат О.',
    r: 4,
    d: '8 мар 2025',
    t: 'Bucket hat в подарок — упаковка красивая, всё аккуратно.',
  },
]
export default function ReviewsPage() {
  return (
    <div className="max-w-[960px] mx-auto sp">
      <h1 className="sec-ttl mb-2">ОТЗЫВЫ</h1>
      <div className="w-11 h-[3px] bg-acc mb-9" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {RV.map((r, i) => (
          <div
            key={i}
            className="bg-card border border-brd p-5 animate-fade-up transition-colors hover:border-acc"
            style={{ animationDelay: `${i * 0.07}s` }}
          >
            <div className="flex justify-between items-center mb-2.5">
              <span className="font-bold text-[13px]">{r.n}</span>
              <span className="star text-[12px]">
                {'★'.repeat(r.r)}
                {'☆'.repeat(5 - r.r)}
              </span>
            </div>
            <p className="text-[13px] text-t2 leading-[1.7] mb-2.5">{r.t}</p>
            <p className="font-mono text-[10px] text-t3">{r.d}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
