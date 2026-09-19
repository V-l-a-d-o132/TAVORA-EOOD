import { useCallback } from 'react';
import { Link } from 'react-router-dom';

const C = {
  bg: '#0a0a0a',
  surface: '#111111',
  border: '#1a1a1a',
  borderHover: '#2a2a2a',
  accent: '#e53e3e',
  accentHover: '#ff5555',
  text: '#ffffff',
  textMuted: '#a0a0a0',
  textDim: '#666666',
  success: '#22c55e',
  greenBg: '#0a1f0a',
};

const PLATFORM_PREVIEW = [
  { num: '01', title: 'AI Advantage', state: 'done' },
  { num: '02', title: 'Оферта и сайт', state: 'active' },
  { num: '03', title: 'Съдържание и маркетинг', state: 'locked' },
  { num: '04', title: 'Клиенти и система', state: 'locked' },
];

export default function AkademiyaHeroSection() {
  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <section id="akademiya-hero" className="relative w-full overflow-hidden" style={{ background: C.bg }}>
      {/* Subtle top gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent z-0 pointer-events-none" />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 md:px-8 pt-16 md:pt-24 pb-10 md:pb-16">
        {/* Badge */}
        <div className="flex justify-center mb-5 md:mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5" style={{ border: `1px solid ${C.borderHover}` }}>
            <div className="w-2 h-2" style={{ background: C.accent }} />
            <span className="text-[10px] md:text-xs font-semibold tracking-[0.15em] uppercase whitespace-nowrap" style={{ color: C.textMuted }}>
              АКАДЕМИЯ TAVORA
            </span>
          </div>
        </div>

        {/* Headline */}
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold leading-[1.15] mb-4 md:mb-6 tracking-tight" style={{ color: C.text }}>
            Научи се да създаваш и продаваш
            <br />
            <span style={{ color: C.accent }}>дигитални услуги с AI</span>
          </h1>

          <p className="text-sm md:text-base leading-relaxed mb-8 font-light max-w-2xl mx-auto" style={{ color: C.textMuted }}>
            Практическа академия по AI, маркетинг и видео — от първата оферта и сайт
            до съдържание, привличане на клиенти и измерване на резултатите.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 text-sm md:text-base font-semibold transition-all whitespace-nowrap flex items-center justify-center gap-2 cursor-pointer"
              style={{ background: C.accent, color: '#fff' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = C.accentHover; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = C.accent; }}
            >
              Създай безплатен акаунт
              <i className="ri-arrow-right-line" />
            </Link>

            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-3.5 text-sm md:text-base font-semibold transition-all whitespace-nowrap flex items-center justify-center gap-2 cursor-pointer"
              style={{ background: 'transparent', border: `1px solid ${C.borderHover}`, color: C.text }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.textMuted; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.borderHover; }}
            >
              Влез в академията
            </Link>
          </div>

          <button
            onClick={() => scrollTo('akademiya-programs')}
            className="mt-4 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer inline-flex items-center gap-1"
            style={{ color: C.textMuted }}
            onMouseEnter={(e) => { e.currentTarget.style.color = C.text; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = C.textMuted; }}
          >
            Или разгледай програмите
            <i className="ri-arrow-down-line" />
          </button>

          <p className="text-xs mt-2" style={{ color: C.textDim }}>
            Модул 1 (AI Advantage) е безплатен. Без карта и без автоматично плащане.
          </p>
        </div>

        {/* Platform preview — clean visual of the learning interface */}
        <div className="w-full max-w-3xl mx-auto">
          <div className="p-5 md:p-7" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 flex items-center justify-center text-xs font-bold" style={{ background: C.bg, border: `1px solid ${C.border}`, color: C.accent }}>
                  <i className="ri-road-map-line" />
                </div>
                <div>
                  <div className="text-sm font-semibold" style={{ color: C.text }}>Пътят на коприната</div>
                  <div className="text-[10px]" style={{ color: C.textDim }}>AI Business Blueprint</div>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5" style={{ background: C.greenBg, border: '1px solid #113311', color: C.success }}>
                11 модула
              </span>
            </div>

            <div className="space-y-2">
              {PLATFORM_PREVIEW.map((m) => (
                <div key={m.num} className="flex items-center gap-3 p-3" style={{ background: C.bg, border: `1px solid ${C.border}` }}>
                  <div
                    className="w-8 h-8 flex items-center justify-center text-xs font-bold shrink-0"
                    style={{
                      background: m.state === 'done' ? C.greenBg : m.state === 'active' ? '#331111' : C.bg,
                      border: `1px solid ${m.state === 'done' ? '#113311' : m.state === 'active' ? C.accent : C.border}`,
                      color: m.state === 'done' ? C.success : m.state === 'active' ? C.accent : C.textDim,
                    }}
                  >
                    {m.state === 'done' ? <i className="ri-check-line text-sm" /> : m.num}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate" style={{ color: m.state === 'locked' ? C.textDim : C.text }}>{m.title}</div>
                    <div className="text-[10px]" style={{ color: C.textDim }}>
                      {m.state === 'done' ? 'Завършен' : m.state === 'active' ? 'В момента' : 'Следващ етап'}
                    </div>
                  </div>
                  {m.state === 'locked' && (
                    <i className="ri-lock-line text-sm" style={{ color: C.textDim }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}