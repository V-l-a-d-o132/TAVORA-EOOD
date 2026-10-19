import type { JsonObject } from '@/lib/lesson-engine-v2';
import ClosedWorkflowLab from './ClosedWorkflowLab';
import VideoDecisionLab, { isVideoLabKind } from '@/components/academy/VideoDecisionLab';
import ProvidedMaterials from '@/components/academy/ProvidedMaterials';
import { parseProvidedMaterials } from '@/lib/provided-materials';
import LessonToolkit from '@/components/academy/LessonToolkit';
import { parseLessonToolkit } from '@/lib/silk-toolkit';
import VideoAiGuide from '@/components/academy/VideoAiGuide';
import { parseVideoAiGuide } from '@/lib/video-ai';
import MarketingAiGuide from '@/components/academy/MarketingAiGuide';
import { parseMarketingAiGuide } from '@/lib/marketing-ai';

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
export default function LessonRichText({ content, allowCode = false, allowVideoLab = false, allowMarketingAi = false }: { content: JsonObject; allowCode?: boolean; allowVideoLab?: boolean; allowMarketingAi?: boolean }) {
  const columns = strings(content.columns);
  const rows = objects(content.table).map(row => strings(row.cells));
  const hasTable = columns.length > 0 && rows.length > 0 && rows.every(row => row.length === columns.length);
  const sources = objects(content.sources).flatMap(source => {
    const url = httpsUrl(source.url);
    return url && text(source.label) ? [{ url, label: text(source.label) }] : [];
  });
  let body = text(content.body);
  if (hasTable && content.tableFallback === true) body = text(content.tableIntro);
  if (sources.length && content.sourceFallback === true) body = body.split('\n\n')[0];
  const figure = content.figure && typeof content.figure === 'object' && !Array.isArray(content.figure) ? content.figure as JsonObject : {};
  const figureSrc = text(figure.src);
  const showFigure = /^\/academy-labs\/silk-road\/closed\/[a-z-]+\.svg$/.test(figureSrc) && !!text(figure.alt);
  const simulation = content.simulation;
  const materials = parseProvidedMaterials(content.materials);
  if (materials && content.materialsFallback === true) body = '';
  const toolkit = parseLessonToolkit(content.toolkit);
  if (toolkit && content.toolkitFallback === true) body = text(content.toolkitIntro);
  const videoAi = allowVideoLab ? parseVideoAiGuide(content.videoAi) : null;
  if (videoAi && content.videoAiFallback === true) body = '';
  const marketingAi = allowMarketingAi ? parseMarketingAiGuide(content.marketingAi) : null;
  if (marketingAi && content.marketingAiFallback === true) body = '';
  const code = content.code && typeof content.code === 'object' && !Array.isArray(content.code) ? content.code as JsonObject : {};
  // Older hosted builds still display the complete example from body.
  // The enhanced renderer shows that exact suffix only once, as escaped text.
  if (allowCode && content.codeFallback === true && text(code.source)
    && body.endsWith(`\n\n${text(code.source)}`)) {
    body = body.slice(0, -text(code.source).length).trimEnd();
  }
  return <>
    {body && <p className="whitespace-pre-line break-words text-base leading-7 academy-body">{body}</p>}
    {allowCode && text(code.source) && <figure className="mt-5 overflow-hidden rounded-xl border academy-border-strong">
      <figcaption className="border-b academy-border academy-tint px-4 py-2 text-sm academy-body">Учебен пример · {text(code.language) || 'код'}</figcaption>
      <pre tabIndex={0} aria-label="Учебен код за преглед" className="overflow-x-auto academy-raised p-4 text-sm leading-6 academy-text"><code>{text(code.source)}</code></pre>
    </figure>}
    {showFigure && <figure className="mt-6">
      <div className="overflow-x-auto rounded-xl border academy-border-strong" tabIndex={0} role="region" aria-label="Учебна схема">
        <img src={figureSrc} alt={text(figure.alt)} loading="lazy" className="h-auto w-full min-w-[38rem] bg-[#f8fafc]" />
      </div>
      {text(figure.caption) && <figcaption className="mt-3 text-sm leading-6 academy-muted">{text(figure.caption)}</figcaption>}
    </figure>}
    {(simulation === 'checkout' || simulation === 'publishing' || simulation === 'request') && <ClosedWorkflowLab key={simulation} kind={simulation} />}
    {allowVideoLab && isVideoLabKind(content.videoLab) && <VideoDecisionLab key={content.videoLab} kind={content.videoLab} />}
    {materials && <ProvidedMaterials key={materials.title} materials={materials} />}
    {toolkit && <LessonToolkit key={toolkit.title} toolkit={toolkit} />}
    {videoAi && <VideoAiGuide key={videoAi.title} guide={videoAi} />}
    {marketingAi && <MarketingAiGuide key={marketingAi.lesson} guide={marketingAi} />}
    {objects(content.points).length > 0 && <ul className="mt-5 space-y-3">
      {objects(content.points).map((point, index) => <li key={text(point.id) || index} className="flex gap-3 academy-body">
        <span className="mt-2 h-2 w-2 shrink-0 rounded-full academy-primary" />{text(point.text)}
      </li>)}
    </ul>}
    {hasTable && <div className="mt-5 overflow-x-auto rounded-xl border academy-border-strong" role="region" aria-label="Работна таблица" tabIndex={0}>
      <table className="w-full min-w-[28rem] border-collapse text-left text-sm">
        <thead className="academy-tint-strong"><tr>{columns.map((column, index) => <th key={index} scope="col" className="px-4 py-3 font-semibold academy-text">{column}</th>)}</tr></thead>
        <tbody>{rows.map((row, index) => <tr key={index} className="border-t academy-border">
          {row.map((cell, cellIndex) => <td key={cellIndex} className="px-4 py-3 align-top leading-6 academy-body">{cell}</td>)}
        </tr>)}</tbody>
      </table>
    </div>}
    {sources.length > 0 && <ul className="mt-5 space-y-3" aria-label="Официални източници">
      {sources.map((source, index) => <li key={`${source.url}-${index}`}>
        <a href={source.url} target="_blank" rel="noopener noreferrer" className="break-words text-sm leading-6 academy-accent underline underline-offset-4 hover:academy-accent-hover focus:outline-none focus:ring-2 focus:ring-red-300">{source.label}</a>
      </li>)}
    </ul>}
  </>;
}
