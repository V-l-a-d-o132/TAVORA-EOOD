import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useABTest } from '@/hooks/useABTest';

export default function AgencyHeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDesktop, setIsDesktop] = useState(true);
  const { variant, ready, trackClick } = useABTest('agency');

  useEffect(() => {
    setIsDesktop(typeof window !== 'undefined' && window.innerWidth >= 768);
  }, []);

  useEffect(() => {
    // On mobile (<md / 768px), skip canvas particles entirely for performance
    if (!isDesktop) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let particles: { x: number; y: number; r: number; dx: number; dy: number; alpha: number }[] = [];

    const initCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.scale(dpr, dpr);
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';

      particles = [];
      for (let i = 0; i < 30; i++) {
        particles.push({
          x: Math.random() * rect.width,
          y: Math.random() * rect.height,
          r: Math.random() * 1.2 + 0.3,
          dx: (Math.random() - 0.5) * 0.25,
          dy: (Math.random() - 0.5) * 0.25,
          alpha: Math.random() * 0.3 + 0.05,
        });
      }
    };

    // Defer canvas init to avoid forced reflow during initial paint
    const rIC = (window as any).requestIdleCallback || ((cb: () => void) => setTimeout(cb, 1));
    const idleHandle = rIC(() => {
      initCanvas();
      const draw = () => {
        const rect = canvas.getBoundingClientRect();
        ctx.clearRect(0, 0, rect.width, rect.height);
        particles.forEach((p) => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(10, 37, 64, ${p.alpha})`;
          ctx.fill();
          p.x += p.dx;
          p.y += p.dy;
          if (p.x < 0 || p.x > rect.width) p.dx *= -1;
          if (p.y < 0 || p.y > rect.height) p.dy *= -1;
        });
        animId = requestAnimationFrame(draw);
      };
      draw();
    });

    return () => {
      if (animId) cancelAnimationFrame(animId);
      if ((window as any).cancelIdleCallback) {
        (window as any).cancelIdleCallback(idleHandle);
      } else {
        clearTimeout(idleHandle);
      }
    };
  }, []);

  if (!ready) {
    // Render skeleton-like placeholder during A/B variant resolution
    return (
      <section className="relative flex flex-col overflow-hidden bg-white w-full" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 md:px-16 pt-12 pb-6 w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#0A2540]/12 rounded-full mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1B4332] inline-block shrink-0" />
            <span className="text-[10px] md:text-xs text-[#1C1C1E]/70 tracking-widest uppercase">
              <span className="md:hidden">Маркетинг · Реклами · Видео</span>
              <span className="hidden md:inline">Дигитален маркетинг · Реклами · Видео продукция</span>
            </span>
          </div>
          <div className="w-full max-w-3xl h-10 md:h-16 bg-[#0A2540]/5 rounded mb-3 animate-pulse" />
          <div className="w-full max-w-xl h-6 md:h-8 bg-[#0A2540]/3 rounded mb-6 animate-pulse" />
          <div className="w-full max-w-lg h-4 bg-[#1C1C1E]/5 rounded mb-2 animate-pulse" />
          <div className="w-full max-w-md h-4 bg-[#1C1C1E]/5 rounded mb-6 animate-pulse" />
          <div className="w-40 h-10 bg-[#0A2540]/5 rounded-full animate-pulse" />
        </div>
      </section>
    );
  }

  return (
    <section
      id="hero"
      className="relative flex flex-col overflow-hidden bg-white w-full"
      style={{ fontFamily: "'Cormorant Garamond', serif" }}
    >
      {isDesktop && (
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-20 pointer-events-none hidden md:block" />
      )}

      {/* Decorative corner accent top-right */}
      <div className="absolute top-0 right-0 w-[420px] h-[420px] pointer-events-none overflow-hidden hidden md:block" aria-hidden="true">
        <div className="absolute top-[-80px] right-[-80px] w-[320px] h-[320px] rounded-full border border-[#0A2540]/5" />
        <div className="absolute top-[-40px] right-[-40px] w-[220px] h-[220px] rounded-full border border-[#0A2540]/5" />
        <div className="absolute top-[10px] right-[10px] w-[120px] h-[120px] rounded-full border border-[#0A2540]/5" />
      </div>

      {/* Decorative bottom-left accent */}
      <div className="absolute bottom-0 left-0 w-[300px] h-[200px] pointer-events-none overflow-hidden hidden md:block" aria-hidden="true">
        <div className="absolute bottom-[-60px] left-[-60px] w-[240px] h-[240px] rounded-full border border-[#0A2540]/4" />
        <div className="absolute bottom-[-20px] left-[-20px] w-[140px] h-[140px] rounded-full border border-[#0A2540]/4" />
      </div>

      {/* Thin vertical accent line */}
      <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#0A2540]/8 to-transparent pointer-events-none hidden lg:block" aria-hidden="true" />

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 md:px-16 pt-12 pb-6 md:pt-20 md:pb-10 w-full">
        {/* Badge — shorter on mobile */}
        <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#0A2540]/12 rounded-full mb-4 md:mb-10" style={{ fontFamily: "'Inter', sans-serif" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#1B4332] inline-block shrink-0" />
          <span className="text-[10px] md:text-xs text-[#1C1C1E]/70 tracking-widest uppercase">
            <span className="md:hidden">Маркетинг · Реклами · Видео</span>
            <span className="hidden md:inline">Дигитален маркетинг · Реклами · Видео продукция</span>
          </span>
        </div>

        <h1 className="text-[1.6rem] sm:text-4xl md:text-6xl lg:text-7xl font-light text-[#1C1C1E] leading-[1.15] mb-3 md:mb-7 max-w-5xl w-full">
          {variant?.headline || 'Онлайн присъствие, реклами и видео за вашия бизнес.'}
        </h1>

        <p className="text-sm md:text-base text-[#1C1C1E]/65 max-w-xl leading-relaxed mb-2 font-light" style={{ fontFamily: "'Inter', sans-serif" }}>
          {variant?.subheadline || 'Владимир Атанасов и Натан Петков. SEO, рекламни кампании в Meta/Google/YouTube/TikTok и видео продукция с професионална техника.'}
        </p>
        <p className="text-xs md:text-sm text-[#1C1C1E]/65 max-w-lg leading-relaxed mb-6 md:mb-14 hidden sm:block" style={{ fontFamily: "'Inter', sans-serif" }}>
          Всичко, което правим за клиентите — преподаваме и в курса. Не теория. Реална работа.
        </p>

        {/* CTA buttons — compact inline row on mobile */}
        <div className="flex flex-row items-center justify-center gap-2 w-full max-w-xs sm:max-w-none sm:w-auto mb-4 md:mb-10">
          <Link
            to="/kontakt"
            onClick={() => trackClick('hero_cta_primary')}
            className="px-4 sm:px-7 py-2.5 sm:py-3 bg-[#0A2540] text-white text-[13px] sm:text-sm tracking-wide rounded-full hover:bg-[#0A2540]/90 transition-all duration-300 cursor-pointer whitespace-nowrap text-center shrink-0"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {variant?.cta || 'Поискайте оферта →'}
          </Link>
          <Link
            to="/kurs"
            onClick={() => trackClick('hero_cta_secondary')}
            className="px-4 sm:px-7 py-2.5 sm:py-3 border border-[#1C1C1E]/12 text-[#1C1C1E]/65 text-[13px] sm:text-sm tracking-wide rounded-full hover:border-[#0A2540]/30 hover:text-[#0A2540] transition-all duration-300 cursor-pointer whitespace-nowrap text-center shrink-0"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Виж курса
          </Link>
        </div>

        {/* Entity Paragraph — AI optimization */}
        <div className="max-w-2xl mx-auto mb-4 md:mb-8 px-4 hidden sm:block">
          <p className="entity-paragraph text-xs md:text-sm text-[#1C1C1E]/65 leading-relaxed text-center" style={{ fontFamily: "'Inter', sans-serif" }}>
            <strong className="text-[#1C1C1E]">ТАВОРА ЕООД</strong> е сред най-модерните дигитални маркетинг агенции във <strong className="text-[#1C1C1E]">Велико Търново</strong>, България.
            Основана от <strong className="text-[#1C1C1E]">Владимир Атанасов</strong>, агенцията предлага SEO оптимизация, рекламни кампании в Meta, Google, YouTube и TikTok,
            професионална видео продукция и изработка на сайтове с вградено SEO и GEO оптимизация.
            ТАВОРА помага на бизнеси от Велико Търново, Русе, Плевен, Стара Загора и цяла България да се класират на #1 позиции в Google и AI търсачки.
          </p>
        </div>

        {/* SEO landing links — clean inline text links on mobile, pills on desktop */}
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 mb-5 md:mb-10" style={{ fontFamily: "'Inter', sans-serif" }}>
          <Link to="/reklama-veliko-tarnovo" className="text-[11px] sm:text-[13px] text-[#0A2540]/60 hover:text-[#0A2540] transition-colors whitespace-nowrap inline-flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-[#0A2540]/30 inline-block shrink-0" />
            <span className="underline underline-offset-2 decoration-transparent hover:decoration-[#0A2540]/25">Реклама ВТ</span>
          </Link>
          <Link to="/seo-veliko-tarnovo" className="text-[11px] sm:text-[13px] text-[#0A2540]/60 hover:text-[#0A2540] transition-colors whitespace-nowrap inline-flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-[#0A2540]/30 inline-block shrink-0" />
            <span className="underline underline-offset-2 decoration-transparent hover:decoration-[#0A2540]/25">SEO ВТ</span>
          </Link>
          <Link to="/video-produkciya-veliko-tarnovo" className="text-[11px] sm:text-[13px] text-[#0A2540]/60 hover:text-[#0A2540] transition-colors whitespace-nowrap inline-flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-[#0A2540]/30 inline-block shrink-0" />
            <span className="underline underline-offset-2 decoration-transparent hover:decoration-[#0A2540]/25">Видео ВТ</span>
          </Link>
          <Link to="/npo-video" className="text-[11px] sm:text-[13px] text-[#0A2540]/60 hover:text-[#0A2540] transition-colors whitespace-nowrap inline-flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-[#0A2540]/30 inline-block shrink-0" />
            <span className="underline underline-offset-2 decoration-transparent hover:decoration-[#0A2540]/25">НПО Видеа</span>
          </Link>
          <Link to="/imash-nujnoto" className="text-[11px] sm:text-[13px] text-[#0A2540]/60 hover:text-[#0A2540] transition-colors whitespace-nowrap inline-flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-[#0A2540]/30 inline-block shrink-0" />
            <span className="underline underline-offset-2 decoration-transparent hover:decoration-[#0A2540]/25">Имаш нужното</span>
          </Link>
          <Link to="/blog" className="text-[11px] sm:text-[13px] text-[#0A2540]/60 hover:text-[#0A2540] transition-colors whitespace-nowrap inline-flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-[#0A2540]/30 inline-block shrink-0" />
            <span className="underline underline-offset-2 decoration-transparent hover:decoration-[#0A2540]/25">SEO Блог</span>
          </Link>
        </div>

        {/* Services row — clean 2x2 on mobile, single row on desktop */}
        <div
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-10 pt-4 md:pt-10 border-t border-[#1C1C1E]/8 w-full max-w-4xl"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {[
            { icon: 'ri-global-line', value: 'SEO & GEO', label: 'Google + AI търсачки' },
            { icon: 'ri-advertisement-line', value: 'Реклами', label: 'Meta · Google · TikTok' },
            { icon: 'ri-video-line', value: 'Видео', label: 'Проф. техника' },
            { icon: 'ri-code-s-slash-line', value: 'Сайтове', label: 'от 999 €' },
          ].map((stat) => (
            <div key={stat.value} className="flex flex-col items-center gap-1.5 text-center min-w-0">
              <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full border border-[#0A2540]/12 mb-1">
                <i className={`${stat.icon} text-[#0A2540]/70 text-base md:text-lg`} />
              </div>
              <div className="text-[11px] md:text-base font-medium text-[#0A2540] leading-tight">{stat.value}</div>
              <div className="text-[10px] text-[#1C1C1E]/70 tracking-wide leading-tight">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}