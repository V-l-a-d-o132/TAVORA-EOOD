import type { JsonObject } from '@/lib/lesson-engine-v2';

const text = (value: unknown) => typeof value === 'string' ? value.trim() : '';

/** A readable opening, including older lessons that only provide plain text. */
export default function LessonOutcomes({ content }: { content: JsonObject }) {
  const paragraphs = text(content.body).split(/\n\s*\n+/u).filter(Boolean);
  const outcomes = Array.isArray(content.outcomes)
    ? content.outcomes.map(text).filter(Boolean) : [];
  const deliverable = text(content.deliverable);
  const check = text(content.check);

  return <div className="space-y-4 text-base leading-7 text-zinc-200">
    {paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
    {outcomes.length > 0 && <ul className="space-y-2.5" aria-label="Умения в този урок">
      {outcomes.map((outcome, index) => <li key={index} className="flex gap-3">
        <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
        <span>{outcome}</span>
      </li>)}
    </ul>}
    {deliverable && <div className="border-t border-white/10 pt-4">
      <h3 className="text-sm font-semibold text-white">Практически резултат</h3>
      <p className="mt-1">{deliverable}</p>
    </div>}
    {check && <p className="text-sm leading-6 text-zinc-400"><span className="font-medium text-zinc-300">Как ще провериш: </span>{check}</p>}
  </div>;
}
