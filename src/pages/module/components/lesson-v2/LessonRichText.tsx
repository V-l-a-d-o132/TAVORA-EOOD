import type { JsonObject } from '@/lib/lesson-engine-v2';
import ClosedWorkflowLab from './ClosedWorkflowLab';

const strings = (value: unknown): string[] => Array.isArray(value)
  ? value.filter((item): item is string => typeof item === 'string') : [];
const objects = (value: unknown): JsonObject[] => Array.isArray(value)
  ? value.filter((item): item is JsonObject => !!item && typeof item === 'object' && !Array.isArray(item)) : [];
const text = (value: unknown) => typeof value === 'string' ? value : '';

function httpsUrl(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.href : null;
  } catch {
    return null;
  }
}

/** Optional tables and references; existing rich-text content keeps its rendering. */
export default function LessonRichText({ content }: { content: JsonObject }) {
  const columns = strings(content.columns);
  const rows = objects(content.table).map(row => strings(row.cells));
  const hasTable = columns.length > 0 && rows.length > 0 && rows.every(row => row.length === columns.length);
  const sources = objects(content.sources).flatMap(source => {
    const url = httpsUrl(source.url);
    return url && text(source.label) ? [{ url, label: text(source.label) }] : [];
  });
  let body = text(content.body);
  if (hasTable && content.tableFallback === true) body = '';
  if (sources.length && content.sourceFallback === true) body = body.split('\n\n')[0];
  const figure = content.figure && typeof content.figure === 'object' && !Array.isArray(content.figure) ? content.figure as JsonObject : {};
  const figureSrc = text(figure.src);
  const showFigure = /^\/academy-labs\/silk-road\/closed\/[a-z-]+\.svg$/.test(figureSrc) && !!text(figure.alt);
  const simulation = content.simulation;
  return <>
    {body && <p className="whitespace-pre-line break-words text-base leading-7 text-zinc-200">{body}</p>}
    {showFigure && <figure className="mt-6">
      <div className="overflow-x-auto rounded-xl border border-white/15" tabIndex={0} role="region" aria-label="Учебна схема">
        <img src={figureSrc} alt={text(figure.alt)} loading="lazy" className="h-auto w-full min-w-[38rem] bg-[#f8fafc]" />
      </div>
      {text(figure.caption) && <figcaption className="mt-3 text-sm leading-6 text-zinc-400">{text(figure.caption)}</figcaption>}
    </figure>}
    {(simulation === 'checkout' || simulation === 'publishing' || simulation === 'request') && <ClosedWorkflowLab key={simulation} kind={simulation} />}
    {objects(content.points).length > 0 && <ul className="mt-5 space-y-3">
      {objects(content.points).map((point, index) => <li key={text(point.id) || index} className="flex gap-3 text-zinc-200">
        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-red-500" />{text(point.text)}
      </li>)}
    </ul>}
    {hasTable && <div className="mt-5 overflow-x-auto rounded-xl border border-white/15" role="region" aria-label="Работна таблица" tabIndex={0}>
      <table className="w-full min-w-[28rem] border-collapse text-left text-sm">
        <thead className="bg-white/[0.08]"><tr>{columns.map((column, index) => <th key={index} scope="col" className="px-4 py-3 font-semibold text-white">{column}</th>)}</tr></thead>
        <tbody>{rows.map((row, index) => <tr key={index} className="border-t border-white/10">
          {row.map((cell, cellIndex) => <td key={cellIndex} className="px-4 py-3 align-top leading-6 text-zinc-200">{cell}</td>)}
        </tr>)}</tbody>
      </table>
    </div>}
    {sources.length > 0 && <ul className="mt-5 space-y-3" aria-label="Официални източници">
      {sources.map((source, index) => <li key={`${source.url}-${index}`}>
        <a href={source.url} target="_blank" rel="noopener noreferrer" className="break-words text-sm leading-6 text-red-300 underline underline-offset-4 hover:text-red-200 focus:outline-none focus:ring-2 focus:ring-red-300">{source.label}</a>
      </li>)}
    </ul>}
  </>;
}
