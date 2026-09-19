import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { LEARNING_SECTIONS } from '@/mocks/learning-platform';

interface SearchResult {
  id: string;
  label: string;
  subtitle: string;
  sectionTitle: string;
  route: string;
  type: 'module' | 'lesson';
  moduleId: string;
  lessonIndex?: number;
}

/* flatten everything for search */
const ALL_ENTRIES: SearchResult[] = [];

LEARNING_SECTIONS.forEach((section) => {
  section.modules.forEach((mod) => {
    ALL_ENTRIES.push({
      id: mod.id,
      label: mod.title,
      subtitle: mod.subtitle,
      sectionTitle: section.title,
      route: `/module/${mod.id}`,
      type: 'module',
      moduleId: mod.id,
    });
    mod.lessons.forEach((lesson, li) => {
      ALL_ENTRIES.push({
        id: lesson.id,
        label: lesson.title,
        subtitle: `Модул ${mod.number}: ${mod.title}`,
        sectionTitle: section.title,
        route: `/module/${mod.id}`,
        type: 'lesson',
        moduleId: mod.id,
        lessonIndex: li,
      });
    });
  });
});

/* ─── Brand ─── */
const B = {
  bg: '#0a0a0a',
  surface: '#111111',
  surfaceHover: '#141414',
  border: '#1a1a1a',
  borderHover: '#2a2a2a',
  accent: '#e53e3e',
  accentDim: '#331111',
  text: '#ffffff',
  textMuted: '#a0a0a0',
  textDim: '#666666',
};

export default function SearchModules() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const filter = useCallback((q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    const lower = q.toLowerCase();
    const filtered = ALL_ENTRIES.filter(
      (e) =>
        e.label.toLowerCase().includes(lower) ||
        e.subtitle.toLowerCase().includes(lower) ||
        e.sectionTitle.toLowerCase().includes(lower),
    ).slice(0, 12);
    setResults(filtered);
    setActiveIdx(0);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => filter(query), 150);
    return () => clearTimeout(t);
  }, [query, filter]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const select = useCallback(
    (r: SearchResult) => {
      setOpen(false);
      setQuery('');
      navigate(r.route);
    },
    [navigate],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[activeIdx]) select(results[activeIdx]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="flex items-center gap-2 px-3 py-2.5 transition-all" style={{ background: B.surface, border: `1px solid ${open ? B.accent : B.border}` }}>
        <i className="ri-search-line shrink-0" style={{ color: open ? B.accent : B.textDim, fontSize: '14px' }} />
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => { if (query.trim()) setOpen(true); }}
          onKeyDown={handleKeyDown}
          placeholder="Търси модул или урок..."
          className="flex-1 bg-transparent text-sm outline-none border-none"
          style={{ color: B.text }}
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setOpen(false); }}
            className="shrink-0 w-5 h-5 flex items-center justify-center cursor-pointer"
          >
            <i className="ri-close-line" style={{ color: B.textDim, fontSize: '12px' }} />
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <div
          className="absolute top-full left-0 right-0 mt-1 z-50 max-h-[360px] overflow-y-auto"
          style={{ background: B.surface, border: `1px solid ${B.border}` }}
        >
          {results.map((r, idx) => (
            <button
              key={r.id}
              onClick={() => select(r)}
              className="w-full text-left px-4 py-2.5 flex items-center gap-3 transition-colors"
              style={{
                background: idx === activeIdx ? B.surfaceHover : 'transparent',
                borderLeft: idx === activeIdx ? `2px solid ${B.accent}` : '2px solid transparent',
              }}
              onMouseEnter={() => setActiveIdx(idx)}
            >
              <span
                className="shrink-0 text-[10px] px-1.5 py-0.5 font-medium uppercase tracking-wider"
                style={{
                  background: r.type === 'module' ? B.accentDim : 'transparent',
                  border: r.type === 'module' ? `1px solid ${B.accent}` : `1px solid ${B.border}`,
                  color: r.type === 'module' ? B.accent : B.textDim,
                }}
              >
                {r.type === 'module' ? 'Модул' : 'Урок'}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate" style={{ color: B.text }}>{r.label}</p>
                <p className="text-[11px] truncate" style={{ color: B.textDim }}>{r.subtitle} — {r.sectionTitle}</p>
              </div>
              <i className="ri-arrow-right-s-line shrink-0" style={{ color: B.textDim, fontSize: '14px' }} />
            </button>
          ))}
        </div>
      )}

      {open && query.trim() && results.length === 0 && (
        <div
          className="absolute top-full left-0 right-0 mt-1 z-50 px-4 py-6 text-center"
          style={{ background: B.surface, border: `1px solid ${B.border}` }}
        >
          <i className="ri-search-line block mb-2" style={{ color: B.textDim, fontSize: '18px' }} />
          <p className="text-sm" style={{ color: B.textDim }}>Няма резултати за &quot;{query}&quot;</p>
        </div>
      )}
    </div>
  );
}