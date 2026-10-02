import { useMemo, useState } from 'react';
import { findGlossaryTerms } from '@/lib/academy-glossary';

/** Contextual explanations travel with the current lesson without changing its version or progress. */
export default function LessonGlossary({ text }: { text: string }) {
  const terms = useMemo(() => findGlossaryTerms(text), [text]);
  const [selected, setSelected] = useState(0);
  if (!terms.length) return null;
  const activeIndex = Math.min(selected, terms.length - 1);
  const active = terms[activeIndex];

  return <aside aria-label="Думи на човешки език" className="mb-6 rounded-2xl border border-sky-300/20 bg-sky-300/[0.06] p-4 sm:p-5">
    <p className="text-[11px] font-bold uppercase tracking-[.16em] text-sky-200">На човешки език</p>
    <div className="mt-3 flex flex-wrap gap-2" aria-label="Избери дума за обяснение">
      {terms.map((item, index) => <button key={item.term} type="button" aria-pressed={index === activeIndex}
        onClick={() => setSelected(index)}
        className={`rounded-full border px-3 py-1.5 text-left text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-sky-300 ${index === activeIndex ? 'border-sky-300/60 bg-sky-300/20 text-white' : 'border-white/15 bg-black/20 text-zinc-300 hover:border-sky-300/40'}`}>
        {item.term}
      </button>)}
    </div>
    <div className="mt-4 border-t border-white/10 pt-3" aria-live="polite">
      <p className="text-sm leading-6 text-white"><strong>{active.term}:</strong> {active.plainBulgarian}</p>
      <p className="mt-2 text-sm leading-6 text-sky-100/85">{active.familiarAssociation}</p>
    </div>
  </aside>;
}
