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

const STEPS = [
  {
    icon: 'ri-tools-line',
    title: 'Умение',
    desc: 'Учиш конкретно умение — работа с AI, създаване на сайтове, маркетинг или видео.',
  },
  {
    icon: 'ri-price-tag-3-line',
    title: 'Оферта',
    desc: 'Оформяш уменията си в ясна оферта, за която някой би платил.',
  },
  {
    icon: 'ri-megaphone-line',
    title: 'Съдържание',
    desc: 'Създаваш съдържание, което привлича вниманието на точните хора.',
  },
  {
    icon: 'ri-user-heart-line',
    title: 'Клиенти',
    desc: 'Превръщаш интереса в платени проекти и доволни клиенти.',
  },
  {
    icon: 'ri-settings-3-line',
    title: 'Система',
    desc: 'Събираш всичко в повторим процес, който носи предвидим резултат.',
  },
];

export default function AkademiyaPathSection() {
  return (
    <section id="akademiya-path" className="w-full py-12 md:py-24 px-4 md:px-16" style={{ background: C.surface }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6" style={{ border: `1px solid ${C.borderHover}` }}>
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em]" style={{ color: C.textMuted }}>Методология</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight mb-4">
            Пътят през Академията
          </h2>
          <p className="text-sm md:text-base max-w-2xl mx-auto leading-relaxed" style={{ color: C.textMuted }}>
            „Пътят на коприната“ е името на методологията — последователност от пет етапа,
            които водят от първото умение до работеща система.
          </p>
        </div>

        {/* Why the name */}
        <div className="max-w-2xl mx-auto mb-12 p-5 flex items-start gap-3" style={{ background: C.bg, border: `1px solid ${C.border}` }}>
          <i className="ri-question-line text-base shrink-0 mt-0.5" style={{ color: C.accent }} />
          <p className="text-sm leading-relaxed" style={{ color: C.textMuted }}>
            <strong style={{ color: C.text }}>Защо „Пътят на коприната“?</strong>{' '}
            Както историческият път на коприната е свързвал хора, стоки и идеи на големи разстояния,
            така тази програма свързва отделните умения в една свързана система — от първия контакт
            с клиента до измерения резултат. Всяка стъпка надгражда предишната.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {STEPS.map((s, i) => (
            <div key={s.title} className="p-5 flex flex-col gap-3 relative" style={{ background: C.bg, border: `1px solid ${C.border}` }}>
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 flex items-center justify-center shrink-0" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                  <i className={`${s.icon} text-base`} style={{ color: C.accent }} />
                </div>
                <span className="text-[10px] font-semibold" style={{ color: C.textDim }}>0{i + 1}</span>
              </div>
              <div>
                <h3 className="text-sm font-bold mb-1.5" style={{ color: C.text }}>{s.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: C.textMuted }}>{s.desc}</p>
              </div>
              {i < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-2.5 text-base" style={{ color: C.textDim }}>
                  <i className="ri-arrow-right-s-line" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}