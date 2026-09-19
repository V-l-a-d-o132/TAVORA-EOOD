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

const YT_ID = 'WdUUckZ19jI';
const YT_EMBED = `https://www.youtube-nocookie.com/embed/${YT_ID}?rel=0&modestbranding=1&playsinline=1&origin=https://imashnujnoto.com`;

const FACTS = [
  { icon: 'ri-briefcase-line', label: 'Основател', value: 'ТАВОРА ЕООД' },
  { icon: 'ri-tools-line', label: 'Практически опит', value: 'Клиентски проекти в дигиталния маркетинг' },
  { icon: 'ri-global-line', label: 'Насоченост', value: 'Сайтове, SEO/GEO и видео' },
  { icon: 'ri-mic-line', label: 'Публични участия', value: 'Интервюта и конкурси по медийна грамотност' },
];

export default function AkademiyaFounderSection() {
  return (
    <section id="akademiya-founder" className="w-full py-12 md:py-24 px-4 md:px-16" style={{ background: C.surface }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6" style={{ border: `1px solid ${C.borderHover}` }}>
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em]" style={{ color: C.textMuted }}>Кой стои зад Академията</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight mb-4">
            Владимир Атанасов
          </h2>
          <p className="text-sm md:text-base max-w-2xl leading-relaxed" style={{ color: C.textMuted }}>
            Академията е изградена от човек, който прилага същите методи в ежедневната си работа с клиенти.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
          {/* Left: facts */}
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {FACTS.map((f) => (
                <div key={f.label} className="p-5" style={{ background: C.bg, border: `1px solid ${C.border}` }}>
                  <div className="w-9 h-9 flex items-center justify-center mb-3" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                    <i className={`${f.icon} text-sm`} style={{ color: C.accent }} />
                  </div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-1" style={{ color: C.textDim }}>{f.label}</div>
                  <div className="text-sm font-medium leading-snug" style={{ color: C.text }}>{f.value}</div>
                </div>
              ))}
            </div>

            <p className="text-sm leading-relaxed mb-4" style={{ color: C.textMuted }}>
              Владимир Атанасов работи в дигиталния маркетинг — създаване на сайтове, SEO и GEO оптимизация
              и видео продукция. Опитът му идва от реални клиентски проекти, а не от теория.
            </p>

            <a
              href="https://www.google.com/search?q=%D0%92%D0%BB%D0%B0%D0%B4%D0%B8%D0%BC%D0%B8%D1%80+%D0%90%D1%82%D0%B0%D0%BD%D0%B0%D1%81%D0%BE%D0%B2+%D0%BC%D0%B5%D0%B4%D0%B8%D0%B9%D0%BD%D0%B0+%D0%B3%D1%80%D0%B0%D0%BC%D0%BE%D1%82%D0%BD%D0%BE%D1%81%D1%82"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
              style={{ color: C.accent }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#ff5555'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = C.accent; }}
            >
              Провери публичните му участия <i className="ri-arrow-right-line text-xs" />
            </a>
          </div>

          {/* Right: interview */}
          <div>
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={YT_EMBED}
                title="Интервю с Владимир Атанасов за медийната грамотност"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
                className="absolute inset-0 w-full h-full"
                style={{ border: `1px solid ${C.border}` }}
              />
            </div>
            <p className="text-xs mt-3 leading-relaxed" style={{ color: C.textDim }}>
              Интервю с Владимир Атанасов за медийната грамотност и дигиталното образование.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}