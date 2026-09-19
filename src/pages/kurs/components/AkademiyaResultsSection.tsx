const C = {
  bg: '#0a0a0a',
  surface: '#111111',
  border: '#1a1a1a',
  borderHover: '#2a2a2a',
  accent: '#e53e3e',
  text: '#ffffff',
  textMuted: '#a0a0a0',
  textDim: '#666666',
};

const RESULTS = [
  {
    name: 'Sunrise Food',
    url: 'https://sunrisefood.eu/',
    industry: 'E-commerce — храни',
    what: [
      'Изграждане на сайт от нула',
      'Проучване на ключови думи',
      'On-page SEO оптимизация',
      'Структурирани данни (Schema)',
      'Google Business Profile',
      'Съдържание с AI',
    ],
    result: '#1 позиция в Google',
    timeframe: '~3-4 седмици',
    note: 'Ниша с умерена конкуренция. Специфичен продукт = по-малко конкуренти.',
    color: '#22c55e',
    googleQuery: 'гъби кладница онлайн',
    chatGptQuery: 'Откъде да си купя гъби кладница онлайн?',
    chatGptAnswer: 'За пресни гъби кладница с онлайн доставка в България, препоръчвам: Sunrise Food — производител с директна онлайн доставка. Доверен доставчик на Kaufland, Lidl и Fantastico.',
  },
  {
    name: 'K-Food Велико Търново',
    url: 'https://k-foodvelikotarnovo.com/',
    industry: 'E-commerce — храни',
    what: [
      'Редизайн и SEO оптимизация',
      'Съдържание на продуктови категории',
      'GEO оптимизация за AI търсачки',
      'Вътрешна линк структура',
      'Локално SEO за Велико Търново',
      'Мета данни и Open Graph',
    ],
    result: '#1 в Google + #1 в ChatGPT',
    timeframe: '2-3 месеца',
    note: 'Национално търсене с по-висока конкуренция.',
    color: C.accent,
    googleQuery: 'корейска храна онлайн',
    chatGptQuery: 'От кой български сайт да си поръчам корейска храна?',
    chatGptAnswer: 'За автентична корейска храна с доставка в България, препоръчвам: K-Food Велико Търново — специализиран онлайн магазин с доставка в цяла България.',
  },
  {
    name: 'NP Massage Studio',
    industry: 'Локален бизнес — уелнес',
    what: [
      'Локално SEO за Велико Търново',
      'Google Business Profile оптимизация',
      'GEO оптимизация за AI търсачки',
      'Съдържание и структурирани данни',
      'Репутация и ревюта',
    ],
    result: '#1 в Google + #1 в ChatGPT',
    timeframe: '',
    note: 'Локален бизнес с физическо местоположение.',
    color: '#f59e0b',
    googleQuery: 'massages tarnovo',
    chatGptQuery: 'Къде да намеря добър масаж в Търново?',
    chatGptAnswer: 'NP Massage Studio е сред най-високо оценените студиа за масажи във Велико Търново. Предлагат разнообразие от терапевтични и релаксиращи масажи.',
  },
];

const CHECK_DATE = 'август 2026';

export default function AkademiyaResultsSection() {
  return (
    <section id="akademiya-results" className="w-full py-12 md:py-24 px-4 md:px-16" style={{ background: C.bg }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6" style={{ border: `1px solid ${C.borderHover}` }}>
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em]" style={{ color: C.textMuted }}>Доказателства</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight mb-4">
            Резултати от клиентската ни работа
          </h2>
          <p className="text-sm md:text-base max-w-2xl leading-relaxed" style={{ color: C.textMuted }}>
            Това са резултати от проекти, реализирани от TAVORA за клиенти.
          </p>
        </div>

        {/* Honest disclaimer */}
        <div className="p-5 mb-10 flex items-start gap-3" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          <i className="ri-information-line text-base shrink-0 mt-0.5" style={{ color: C.textDim }} />
          <div>
            <p className="text-sm font-semibold mb-1" style={{ color: C.text }}>Важно уточнение</p>
            <p className="text-xs leading-relaxed" style={{ color: C.textMuted }}>
              Това са резултати от проекти, реализирани от TAVORA за клиенти. Те доказват практическия ни опит,
              но не представляват обещание за резултатите на всеки курсист.
            </p>
          </div>
        </div>

        {/* Results cards */}
        <div className="space-y-6">
          {RESULTS.map((r) => (
            <div key={r.name} className="p-5 md:p-6" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
              <div className="flex flex-col md:flex-row gap-6 md:gap-10">
                {/* Left: Info */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-6 shrink-0" style={{ background: r.color }} />
                    <div>
                      <h3 className="text-lg font-bold" style={{ color: C.text }}>{r.name}</h3>
                      <p className="text-xs" style={{ color: C.textDim }}>{r.industry}</p>
                    </div>
                    {r.url && (
                      <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-[10px] underline ml-auto shrink-0" style={{ color: C.textDim }}>
                        {r.url.replace('https://', '')}
                      </a>
                    )}
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.15em]" style={{ color: C.textDim }}>Какво е направено</p>
                    <div className="flex flex-wrap gap-1.5">
                      {r.what.map((w) => (
                        <span key={w} className="text-[10px] px-2 py-0.5" style={{ background: C.bg, border: `1px solid ${C.border}`, color: C.textMuted }}>
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.15em] mb-0.5" style={{ color: C.textDim }}>Резултат</p>
                      <p className="text-base font-bold" style={{ color: r.color }}>{r.result}</p>
                      {r.timeframe && <p className="text-xs mt-0.5" style={{ color: C.textDim }}>{r.timeframe}</p>}
                    </div>
                  </div>

                  <p className="text-xs leading-relaxed" style={{ color: C.textDim }}>{r.note}</p>
                </div>

                {/* Right: SERP previews */}
                <div className="flex-1 space-y-3">
                  {/* Google SERP */}
                  <div className="p-3" style={{ background: C.bg, border: `1px solid ${C.border}` }}>
                    <div className="flex items-center gap-1 mb-2">
                      <span className="text-xs font-bold" style={{ color: '#4285F4' }}>G</span>
                      <span className="text-xs font-bold" style={{ color: '#EA4335' }}>o</span>
                      <span className="text-xs font-bold" style={{ color: '#FBBC05' }}>o</span>
                      <span className="text-xs font-bold" style={{ color: '#4285F4' }}>g</span>
                      <span className="text-xs font-bold" style={{ color: '#34A853' }}>l</span>
                      <span className="text-xs font-bold" style={{ color: '#EA4335' }}>e</span>
                      <span className="text-[10px] ml-1" style={{ color: C.textDim }}>{r.googleQuery}</span>
                    </div>
                    <div className="p-2 relative" style={{ border: `1px solid ${r.color}`, borderLeft: `3px solid ${r.color}` }}>
                      <div className="absolute -top-2.5 left-2 px-2 py-0.5 text-[9px] font-bold" style={{ background: r.color, color: '#0a0a0a' }}>
                        #1 ПОЗИЦИЯ
                      </div>
                      <p className="text-xs font-semibold mt-1" style={{ color: C.text }}>{r.name}</p>
                      <p className="text-[10px]" style={{ color: r.color }}>{r.url ? r.url.replace('https://', '') : ''}</p>
                    </div>
                  </div>

                  {/* ChatGPT SERP */}
                  {r.chatGptQuery && (
                    <div className="p-3" style={{ background: '#1a1a1a', border: `1px solid ${C.border}` }}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-4 h-4 flex items-center justify-center" style={{ background: '#10a37f', borderRadius: '50%' }}>
                          <i className="ri-openai-line text-white text-[8px]" />
                        </div>
                        <span className="text-[10px] font-semibold" style={{ color: '#10a37f' }}>ChatGPT</span>
                      </div>
                      <p className="text-[10px] mb-1.5" style={{ color: C.textDim }}>{r.chatGptQuery}</p>
                      <div className="p-2" style={{ background: 'rgba(16,163,127,0.08)', border: `1px solid rgba(16,163,127,0.2)` }}>
                        <p className="text-[10px] leading-relaxed" style={{ color: C.textMuted }}>{r.chatGptAnswer}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* AI disclaimer + check date */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-5 mt-6" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          <i className="ri-information-line text-sm shrink-0" style={{ color: C.textDim }} />
          <p className="text-xs leading-relaxed" style={{ color: C.textMuted }}>
            Проверено през {CHECK_DATE}. Отговорите на AI системите могат да се различават между потребители
            и във времето — позицията „#1 в ChatGPT“ не е постоянна и зависи от момента на проверката.
          </p>
        </div>

        {/* Verify links */}
        <div className="flex flex-col sm:flex-row items-center gap-3 p-5 mt-4" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          <i className="ri-links-line text-sm" style={{ color: C.textDim }} />
          <span className="text-xs" style={{ color: C.textMuted }}>Провери сам:</span>
          {RESULTS.filter(r => r.url).map((r) => (
            <a
              key={r.url}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-medium transition-colors"
              style={{ background: C.bg, border: `1px solid ${C.border}`, color: C.textMuted }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.borderHover; e.currentTarget.style.color = C.text; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textMuted; }}
            >
              <i className="ri-external-link-line text-[9px]" />
              {r.url.replace('https://', '')}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}