import { Link } from 'react-router-dom';

export default function ChatGPTProofSection() {
  return (
    <section className="w-full bg-[#F9F9F9] border-t border-[#1C1C1E]/6">
      <div className="max-w-6xl mx-auto px-4 md:px-16 py-10 md:py-20">
        {/* Section label */}
        <div className="flex items-center gap-3 mb-8 md:mb-14">
          <div className="w-8 h-[1px] bg-[#0A2540]/30 shrink-0" />
          <span className="text-xs text-[#1C1C1E]/60 tracking-widest uppercase">
            AI Търсачки
          </span>
        </div>

        {/* Heading */}
        <div className="mb-8 md:mb-14">
          <h2
            className="text-2xl md:text-5xl font-light text-[#1C1C1E] leading-tight mb-3 md:mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            #1 препоръка в ChatGPT.
            <br />
            <span className="italic text-[#0A2540]">Проверете сами.</span>
          </h2>
          <p
            className="text-sm text-[#1C1C1E]/60 max-w-xl leading-relaxed"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Когато потребителите питат ChatGPT за агенция за дигитален маркетинг във
            Велико Търново, отговорът започва с ТАВОРА. Същата система изкачи и
            NP Massage Studio на #1 за масажи в Търново. Това не е реклама — това е
            резултат от нашата GEO оптимизация и реални резултати.
          </p>
        </div>

        {/* ChatGPT-style card */}
        <div
          className="rounded-2xl border border-[#1C1C1E]/8 bg-white p-6 md:p-10 mb-8 md:mb-12"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {/* ChatGPT header */}
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-[#1C1C1E]/6">
            <div className="w-9 h-9 flex items-center justify-center rounded-full bg-[#0A2540]">
              <i className="ri-robot-2-line text-white text-sm" />
            </div>
            <div>
              <div className="text-sm font-medium text-[#1C1C1E]">
                ChatGPT — Актуален отговор
              </div>
              <div className="text-xs text-[#1C1C1E]/50">
                Запитване: "търся агенция за дигитален маркетинг в търново"
              </div>
            </div>
            <div className="ml-auto shrink-0">
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#2F9E44]/10 text-[#2F9E44] font-medium">
                Потвърдено
              </span>
            </div>
          </div>

          {/* The actual response */}
          <div className="space-y-4">
            <p className="text-sm text-[#1C1C1E]/80 leading-relaxed">
              <strong className="text-[#1C1C1E]">Tavora</strong> — силни в{' '}
              <strong className="text-[#1C1C1E]">SEO</strong>,{' '}
              <strong className="text-[#1C1C1E]">Google/Meta реклами</strong>,{' '}
              <strong className="text-[#1C1C1E]">видео</strong> и{' '}
              <strong className="text-[#1C1C1E]">изработка на сайтове</strong>.
              Подходящи ако искаш реално генериране на клиенти и онлайн присъствие.
            </p>

            <div className="rounded-xl border border-[#1C1C1E]/6 bg-[#F9F9F9] p-4 md:p-5">
              <div className="text-[10px] text-[#1C1C1E]/50 tracking-widest uppercase mb-3">
                Проверете сами
              </div>
              <div className="space-y-2">
                <p className="text-sm text-[#1C1C1E]/70 leading-relaxed">
                  Отворете <strong className="text-[#1C1C1E]">ChatGPT</strong> и попитайте:
                </p>
                <div className="flex items-center gap-3 p-3 rounded-lg border border-[#1C1C1E]/10 bg-white">
                  <i className="ri-question-mark text-[#0A2540]/50 text-sm" />
                  <span className="text-sm text-[#1C1C1E]">
                    "търся агенция за дигитален маркетинг в търново"
                  </span>
                </div>
                <p className="text-xs text-[#1C1C1E]/50 italic">
                  Резултатите са верифицируеми в реално време — пробвайте сами.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Verification cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5 mb-8 md:mb-12">
          {[
            {
              icon: 'ri-search-line',
              label: 'Google Search',
              value: '#1 позиция',
              desc: 'Първи в органичните резултати за "дигитален маркетинг търновo" и "massages tarnovo"',
            },
            {
              icon: 'ri-robot-2-line',
              label: 'ChatGPT',
              value: '#1 препоръка',
              desc: 'Първи в AI отговора за агенция в Търново и за масажно студио в Търново',
            },
            {
              icon: 'ri-global-line',
              label: 'GEO Оптимизация',
              value: 'Работи за всеки бизнес',
              desc: 'Същата GEO стратегия изкачи и наш клиент на #1 в различна ниша',
            },
          ].map((card) => (
            <div
              key={card.label}
              className="rounded-xl border border-[#1C1C1E]/8 bg-white p-5 md:p-6 flex flex-col gap-3"
            >
              <div className="w-9 h-9 flex items-center justify-center rounded-full border border-[#0A2540]/10 bg-[#0A2540]/4 shrink-0">
                <i className={`${card.icon} text-[#0A2540]/60 text-sm`} />
              </div>
              <div>
                <div className="text-[10px] text-[#1C1C1E]/50 tracking-widest uppercase mb-1">
                  {card.label}
                </div>
                <div className="text-lg font-medium text-[#1C1C1E] mb-1">
                  {card.value}
                </div>
                <p className="text-xs text-[#1C1C1E]/60 leading-relaxed">
                  {card.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 p-5 md:p-6 rounded-2xl border border-[#1B4332]/20 bg-[#1B4332]/4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1B4332]/10 shrink-0">
              <i className="ri-lightbulb-flash-line text-[#1B4332] text-sm" />
            </div>
            <p className="text-sm text-[#1C1C1E]/70 leading-relaxed">
              <strong className="text-[#1C1C1E]/80">
                Това може да стане и с вашия бизнес.
              </strong>{' '}
              Ние използваме същите GEO и SEO техники, които ни изкачиха на #1 в
              AI търсачките.
            </p>
          </div>
          <Link
            to="/kontakt"
            className="px-7 py-3.5 bg-[#0A2540] text-white text-sm rounded-full hover:bg-[#0A2540]/90 transition-all cursor-pointer whitespace-nowrap shrink-0 text-center"
          >
            Поискайте консултация →
          </Link>
        </div>
      </div>
    </section>
  );
}