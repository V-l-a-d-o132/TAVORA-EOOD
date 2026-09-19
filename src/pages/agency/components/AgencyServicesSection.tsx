const services = [
  {
    icon: 'ri-code-s-slash-line',
    num: '01',
    title: 'Изработка на сайт',
    desc: 'Базов сайт с вградено SEO — структура, скорост, Google Business Profile. За #1 позиции в Google (като kfood и sunrise) — цената зависи от конкуренцията.',
    tag: 'от 999 €',
    note: 'За #1 позиции (като kfood и sunrise) — по запитване',
    highlight: true,
  },
  {
    icon: 'ri-global-line',
    num: '02',
    title: 'Цялостно онлайн присъствие',
    desc: 'Сайт, SEO, GEO, социални медии, реклами — всичко под един покрив. За бизнеси, които искат реална онлайн видимост.',
    tag: 'по запитване',
  },
  {
    icon: 'ri-advertisement-line',
    num: '03',
    title: 'Рекламни кампании',
    desc: 'Meta, Google, YouTube, TikTok. Настройваме, управляваме и оптимизираме. Стратегия за конкретния ви бизнес и аудитория.',
    tag: 'от 290 € / мес.',
  },
  {
    icon: 'ri-video-line',
    num: '04',
    title: 'Видео продукция',
    desc: 'Снимаме с професионална техника — камери, микрофони, осветление. Натан участва пред камерата. Монтаж и доставка в 5 работни дни.',
    tag: 'от 290 €',
  },
  {
    icon: 'ri-search-eye-line',
    num: '05',
    title: 'SEO & GEO оптимизация',
    desc: 'Класиране в Google и AI търсачки (ChatGPT, Perplexity). On-page оптимизация, структурирани данни, Google Business Profile.',
    tag: '390 € еднократно',
  },
];

export default function AgencyServicesSection() {
  return (
    <section id="services" className="py-10 md:py-32 bg-[#F9F9F9] w-full overflow-hidden relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#0A2540]/10 to-transparent" aria-hidden="true" />

      <div className="max-w-6xl mx-auto px-4 md:px-16">
        <div className="flex items-center gap-3 mb-4 md:mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
          <div className="w-8 h-[1px] bg-[#0A2540]/30 shrink-0" />
          <span className="text-xs text-[#1C1C1E]/60">Какво правим</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <h2 className="text-2xl md:text-4xl font-light text-[#1C1C1E] leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Правим всичко,
            <br />
            <span className="italic text-[#0A2540]">което преподаваме.</span>
          </h2>
          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed self-end max-w-md" style={{ fontFamily: "'Inter', sans-serif" }}>
            Не сме консултанти, които дават съвети. Правим реална работа за реални клиенти.
            Ако искате ние да го направим — пишете ни. Ако искате да го научите сами —{' '}
            <a href="/kurs" className="text-[#0A2540] underline decoration-dotted hover:no-underline">има курс</a>.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          {services.map((s) => (
            <div
              key={s.title}
              className={`group p-4 md:p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-0.5 ${
                s.highlight
                  ? 'border-[#0A2540]/20 bg-white'
                  : 'border-[#1C1C1E]/8 bg-white hover:border-[#0A2540]/15'
              }`}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {/* Top row: number + icon */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-medium text-[#1C1C1E]/20 tracking-widest">
                    {s.num}
                  </span>
                  <div className={`w-9 h-9 flex items-center justify-center rounded-xl border transition-colors duration-300 ${
                    s.highlight
                      ? 'border-[#0A2540]/20 bg-[#0A2540]/6 group-hover:bg-[#0A2540]/10'
                      : 'border-[#0A2540]/10 bg-[#0A2540]/3 group-hover:bg-[#0A2540]/8'
                  }`}>
                    <i className={`${s.icon} text-[#0A2540]/70 text-base`} />
                  </div>
                </div>
                {s.highlight && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1B4332]/10 text-[#1B4332] tracking-wide whitespace-nowrap">
                    БАЗОВ ПАКЕТ
                  </span>
                )}
              </div>

              {/* Price tag — own row */}
              <div className="mb-3">
                <span className={`inline-block text-[11px] px-2.5 py-1 rounded-full border whitespace-nowrap ${
                  s.highlight
                    ? 'border-[#0A2540]/20 text-[#0A2540] font-semibold bg-[#0A2540]/5'
                    : 'border-[#1C1C1E]/10 text-[#1C1C1E]/65'
                }`}>
                  {s.tag}
                </span>
              </div>

              {/* Thin accent line */}
              <div className={`h-px mb-4 transition-all duration-300 ${
                s.highlight ? 'bg-[#0A2540]/10 group-hover:bg-[#0A2540]/20' : 'bg-[#1C1C1E]/6 group-hover:bg-[#0A2540]/10'
              }`} />

              <div className="text-sm font-medium text-[#1C1C1E] mb-2">{s.title}</div>
              <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">{s.desc}</p>
              {s.note && (
                <p className="text-[10px] text-[#1C1C1E]/70 mt-3 leading-relaxed">{s.note}</p>
              )}
            </div>
          ))}
        </div>

        {/* AI Fact Table — structured entity data */}
        <div className="mt-10 md:mt-20 pt-6 md:pt-8 border-t border-[#1C1C1E]/6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { label: 'Агенция', value: 'ТАВОРА ЕООД' },
              { label: 'Град', value: 'Велико Търново' },
              { label: 'Основател', value: 'Владимир Атанасов' },
              { label: 'Услуги', value: 'SEO · Реклами · Видео · Сайтове' },
            ].map((f) => (
              <div key={f.label} className="p-3 md:p-4 rounded-xl border border-[#1C1C1E]/6 bg-white/50">
                <div className="text-[10px] text-[#1C1C1E]/70 tracking-widest uppercase mb-1">{f.label}</div>
                <div className="text-xs md:text-sm text-[#0A2540] font-medium">{f.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-start gap-3 p-4 rounded-xl border border-[#1C1C1E]/8 bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
          <div className="w-4 h-4 flex items-center justify-center shrink-0 mt-0.5">
            <i className="ri-camera-3-line text-[#1C1C1E]/65 text-sm" />
          </div>
          <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">
            Снимаме с професионална техника — камери, микрофони, осветление. Имаме доста опит и знаем какво искат хората.
          </p>
        </div>
      </div>
    </section>
  );
}
