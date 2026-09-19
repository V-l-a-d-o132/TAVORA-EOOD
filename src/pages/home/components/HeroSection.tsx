import { useEffect, useRef, useState } from 'react';
import InlineIcon from '@/components/base/InlineIcon';
import { useABTest } from '@/hooks/useABTest';

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDesktop, setIsDesktop] = useState(true);
  const { variant, ready, trackClick } = useABTest('home');

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
  }, [isDesktop]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  if (!ready) {
    return (
      <section id="hero" className="relative flex flex-col overflow-hidden bg-[#FFFFFF] w-full" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 md:px-16 pt-12 pb-6 w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#0A2540]/12 rounded-full mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1B4332] inline-block" />
            <span className="text-[10px] md:text-xs text-[#1C1C1E]/70 tracking-widest uppercase">Дигитален маркетинг · Реклами · Видео продукция</span>
          </div>
          <div className="w-full max-w-3xl h-10 md:h-16 bg-[#0A2540]/5 rounded mb-3 animate-pulse" />
          <div className="w-full max-w-xl h-6 md:h-8 bg-[#0A2540]/3 rounded mb-6 animate-pulse" />
          <div className="w-full max-w-lg h-4 bg-[#1C1C1E]/5 rounded mb-2 animate-pulse" />
          <div className="w-40 h-10 bg-[#0A2540]/5 rounded-full animate-pulse" />
        </div>
      </section>
    );
  }

  return (
    <section
      id="hero"
      className="relative flex flex-col overflow-hidden bg-[#FFFFFF] w-full"
      style={{ fontFamily: "'Cormorant Garamond', serif" }}
    >
      {isDesktop && (
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-20 pointer-events-none hidden md:block" />
      )}

      <div className="absolute inset-0 pointer-events-none overflow-hidden hidden md:block">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] border border-[#0A2540]/4 rounded-full translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] border border-[#1B4332]/4 rounded-full -translate-x-1/3 translate-y-1/3" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 md:px-16 pt-12 pb-6 md:pt-20 md:pb-10 w-full">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-3 py-1 border border-[#0A2540]/12 rounded-full mb-4 md:mb-10"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#1B4332] inline-block" />
          <span className="text-[10px] md:text-xs text-[#1C1C1E]/70 tracking-widest uppercase">Дигитален маркетинг · Реклами · Видео продукция</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-[1.6rem] sm:text-4xl md:text-6xl lg:text-7xl font-light text-[#1C1C1E] leading-[1.15] mb-3 md:mb-7 max-w-5xl w-full">
          {variant?.headline || 'Онлайн присъствие, реклами'}
          <br />
          <span className="italic font-normal text-[#0A2540]">и видео за вашия бизнес.</span>
        </h1>

        {/* Subheadline */}
        <p
          className="text-sm md:text-base text-[#1C1C1E]/70 max-w-xl leading-relaxed mb-2 font-light"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {variant?.subheadline || 'Владимир Атанасов и Натан Петков. Правим SEO, рекламни кампании в Meta/Google/YouTube/TikTok и видео продукция с професионална техника.'}
        </p>
        <p
          className="text-xs md:text-sm text-[#1C1C1E]/65 max-w-lg leading-relaxed mb-6 md:mb-14 hidden sm:block"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Всичко, което правим за клиентите — преподаваме и в курса. Не теория. Реална работа.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-sm sm:max-w-none sm:w-auto mb-6 md:mb-16">
          <button
            onClick={() => { trackClick('hero_cta_primary'); scrollToSection('application'); }}
            className="w-full sm:w-auto px-7 py-3 md:py-4 bg-[#0A2540] text-white text-sm tracking-wide rounded-full hover:bg-[#0A2540]/90 transition-all duration-300 cursor-pointer whitespace-nowrap"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {variant?.cta || 'Поискайте оферта →'}
          </button>
          <button
            onClick={() => { trackClick('hero_cta_secondary'); scrollToSection('curriculum'); }}
            className="w-full sm:w-auto px-7 py-3 md:py-4 border border-[#1C1C1E]/20 text-[#1C1C1E]/70 text-sm tracking-wide rounded-full hover:border-[#0A2540]/30 hover:text-[#0A2540] transition-all duration-300 cursor-pointer whitespace-nowrap"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Академия TAVORA
          </button>
        </div>

        {/* Services row */}
        <div
          className="flex flex-row flex-wrap items-center justify-center gap-3 sm:gap-10 pt-4 md:pt-10 border-t border-[#1C1C1E]/8 w-full max-w-4xl mb-4 md:mb-10"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {[
            { icon: 'ri-global-line', value: 'SEO & GEO', label: 'Google + AI търсачки' },
            { icon: 'ri-advertisement-line', value: 'Реклами', label: 'Meta · Google · YouTube · TikTok' },
            { icon: 'ri-video-line', value: 'Видео', label: 'Проф. камери, микрофони, осветление' },
            { icon: 'ri-graduation-cap-line', value: 'Академия', label: 'Научете системата сами' },
          ].map((stat) => (
            <div key={stat.label} className="text-center flex flex-col items-center gap-0.5">
              <div className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full border border-[#0A2540]/12 mb-0.5">
                <InlineIcon name={stat.icon.replace('ri-', '').replace('-line', '')} className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#0A2540]/70" />
              </div>
              <div className="text-xs md:text-base font-light text-[#0A2540]">{stat.value}</div>
              <div className="text-[10px] md:text-xs text-[#1C1C1E]/70 tracking-wide leading-tight">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Trust bar */}
        <div
          className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 md:gap-6 w-full max-w-3xl"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {[
            { icon: 'ri-user-search-line', text: 'Реален екип — проверете в Google' },
            { icon: 'ri-links-line', text: 'Живи клиентски сайтове — проверете сами' },
            { icon: 'ri-camera-3-line', text: 'Проф. техника — камери, микрофони, осветление' },
            { icon: 'ri-shield-check-line', text: '14-дневна гаранция за курса' },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-1">
              <div className="w-3.5 h-3.5 md:w-4 md:h-4 flex items-center justify-center shrink-0">
                <InlineIcon name={item.icon.replace('ri-', '').replace('-line', '')} className="w-3 h-3 md:w-3.5 md:h-3.5 text-[#1B4332]" />
              </div>
              <span className="text-[10px] md:text-xs text-[#1C1C1E]/70 whitespace-nowrap">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}