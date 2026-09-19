import { useState, useEffect, useCallback } from 'react';

/* ─── Brand ─── */
const C = {
  bg: '#0a0a0a',
  surface: '#111111',
  border: '#1a1a1a',
  accent: '#e53e3e',
  accentHover: '#ff5555',
  accentDim: '#331111',
  text: '#ffffff',
  textMuted: '#a0a0a0',
  textDim: '#666666',
  success: '#22c55e',
};

interface LevelUpEvent {
  level: number;
  points: number;
}

/* ─── Custom event system ─── */
const LEVEL_UP_EVENT = 'tavora:levelup';

export function dispatchLevelUp(level: number, points: number) {
  const event = new CustomEvent<LevelUpEvent>(LEVEL_UP_EVENT, {
    detail: { level, points },
  });
  window.dispatchEvent(event);
}

/* ─── Component ─── */
export default function LevelUpToast() {
  const [visible, setVisible] = useState(false);
  const [animatingOut, setAnimatingOut] = useState(false);
  const [data, setData] = useState<LevelUpEvent | null>(null);

  const handleLevelUp = useCallback((e: Event) => {
    const custom = e as CustomEvent<LevelUpEvent>;
    setData(custom.detail);
    setAnimatingOut(false);
    setVisible(true);
    // Auto-dismiss after 4.5s
    setTimeout(() => setAnimatingOut(true), 4500);
    setTimeout(() => setVisible(false), 5000);
  }, []);

  useEffect(() => {
    window.addEventListener(LEVEL_UP_EVENT, handleLevelUp);
    return () => window.removeEventListener(LEVEL_UP_EVENT, handleLevelUp);
  }, [handleLevelUp]);

  if (!visible || !data) return null;

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[300] pointer-events-none">
      <div
        className="flex items-center gap-4 px-6 py-4 shadow-lg transition-all duration-500 ease-out"
        style={{
          background: C.surface,
          border: `1.5px solid ${C.accent}`,
          transform: animatingOut ? 'translateY(-30px) scale(0.92)' : 'translateY(0) scale(1)',
          opacity: animatingOut ? 0 : 1,
        }}
      >
        {/* Level badge */}
        <div
          className="relative w-12 h-12 flex items-center justify-center shrink-0"
          style={{ background: C.accentDim, border: `2px solid ${C.accent}` }}
        >
          <span className="text-xl font-bold" style={{ color: C.accent }}>{data.level}</span>
          {/* glow ring */}
          <div className="absolute inset-0 animate-ping" style={{ border: `2px solid ${C.accent}`, borderRadius: '2px', opacity: 0 }} />
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.15em] font-bold mb-0.5" style={{ color: C.accent }}>
            Ново ниво!
          </p>
          <p className="text-sm font-semibold" style={{ color: C.text }}>
            Достигна ниво {data.level} — {data.points}+ точки
          </p>
          <p className="text-xs mt-0.5" style={{ color: C.textMuted }}>
            Продължавай все така
          </p>
        </div>

        {/* Decorative icon */}
        <div className="w-9 h-9 flex items-center justify-center shrink-0" style={{ background: C.accentDim }}>
          <i className="ri-arrow-up-circle-fill text-lg" style={{ color: C.accent }} />
        </div>
      </div>
    </div>
  );
}