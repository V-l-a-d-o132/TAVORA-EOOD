import { useState, useEffect, useCallback } from 'react';

const ANCHORS = [
  { id: 'academy-access', label: 'Започни', icon: 'ri-login-box-line' },
  { id: 'akademiya-programs', label: 'Програми', icon: 'ri-road-map-line' },
  { id: 'akademiya-enrollment', label: 'Цени', icon: 'ri-price-tag-3-line' },
  { id: 'akademiya-results', label: 'Резултати', icon: 'ri-line-chart-line' },
  { id: 'akademiya-faq', label: 'Въпроси', icon: 'ri-question-line' },
];

export default function KursStickyNav() {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const sectionEls = ANCHORS.map((a) => document.getElementById(a.id)).filter(Boolean) as HTMLElement[];

    const handleScroll = () => {
      const navTotalHeight = 120; // SharedNav (~56px) + KursStickyNav (~44px) + buffer

      let current = '';
      for (const el of sectionEls) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= navTotalHeight + 20) {
          current = el.id;
        }
      }
      setActiveId(current);
    };

    handleScroll(); // initial
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 120;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }, []);

  return (
    <nav
      className="sticky z-30 w-full"
      style={{ top: '3.5rem', background: '#0a0a0a', borderBottom: '1px solid #1a1a1a' }}
      aria-label="Навигация в страницата на академията"
    >
      {/* Desktop: centered links */}
      <div className="hidden md:flex items-center justify-center gap-1 px-4 py-2">
        {ANCHORS.map((anchor) => {
          const isActive = activeId === anchor.id;
          return (
            <button
              key={anchor.id}
              onClick={() => scrollTo(anchor.id)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium transition-all whitespace-nowrap cursor-pointer"
              style={{
                color: isActive ? '#e53e3e' : '#888',
                borderBottom: isActive ? '2px solid #e53e3e' : '2px solid transparent',
                marginBottom: '-1px',
              }}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = '#888'; }}
            >
              <i className={`${anchor.icon}`} style={{ fontSize: '13px' }} />
              {anchor.label}
            </button>
          );
        })}
      </div>

      {/* Mobile: horizontal scroll */}
      <div className="md:hidden flex items-center gap-0 px-2 py-2 overflow-x-auto scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {ANCHORS.map((anchor) => {
          const isActive = activeId === anchor.id;
          return (
            <button
              key={anchor.id}
              onClick={() => scrollTo(anchor.id)}
              className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-medium transition-all whitespace-nowrap cursor-pointer shrink-0"
              style={{
                color: isActive ? '#e53e3e' : '#888',
              }}
            >
              <i className={`${anchor.icon}`} style={{ fontSize: '12px' }} />
              {anchor.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}