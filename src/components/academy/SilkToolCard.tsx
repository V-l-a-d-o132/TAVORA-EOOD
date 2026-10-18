import { toolkitLessonLink, type SilkTool } from '@/lib/silk-toolkit';

export default function SilkToolCard({ tool, compact = false }: { tool: SilkTool; compact?: boolean }) {
  const limited = ['personal', 'transaction', 'check', 'self-host'].includes(tool.access);
  return <article id={`tool-${tool.id}`} aria-label={tool.name} className="min-w-0 scroll-mt-6 rounded-2xl border academy-border p-4 sm:p-5">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <h3 className="break-words text-lg font-semibold academy-text">{tool.name}</h3>
      <span className={`max-w-full rounded-lg border px-2 py-1 text-xs leading-5 ${limited ? 'academy-warning-border academy-warning-bg academy-warning' : 'academy-info-border academy-info-bg academy-text'}`}>{tool.accessLabel}</span>
    </div>
    <p className="mt-2 text-xs leading-6 academy-muted">{tool.role}</p>
    <p className="mt-3 text-sm leading-7 academy-body">{tool.purpose}</p>
    <p className="mt-3 text-sm leading-7 academy-body">{tool.limits}</p>
    <a href={tool.site} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm font-semibold academy-accent underline underline-offset-4 focus:outline-none focus:ring-2 focus:ring-red-400">Отвори {tool.name}<span className="sr-only"> в нов раздел</span></a>
    <details className="mt-4 border-t academy-border pt-3">
      <summary className="cursor-pointer text-sm font-semibold leading-6 academy-text">Стъпки и проверка · {tool.name}</summary>
      <ol className="mt-3 list-decimal space-y-3 pl-5 text-sm leading-7 academy-body">{tool.steps.map((step, index) => <li key={index}>{step}</li>)}</ol>
      <p className="mt-4 text-sm leading-7 academy-body"><strong className="academy-text">Провери резултата: </strong>{tool.verification}</p>
      <p className="mt-4 text-xs leading-6 academy-muted">Проверка на публикуваните условия: {tool.checkedAt ? tool.checkedAt.split('-').reverse().join('.') : 'датата не е посочена'}. Преди външна работа прегледай текущите условия.</p>
      <ul aria-label={`Официални източници за ${tool.name}`} className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs">{tool.sources.map((url, index) => <li key={url}><a href={url} target="_blank" rel="noopener noreferrer" className="academy-accent underline underline-offset-4">Официален източник {index + 1}</a></li>)}</ul>
      {!compact && tool.lessons.length > 0 && <div className="mt-4 flex flex-wrap gap-3">{tool.lessons.map(id => <a key={id} href={toolkitLessonLink(id)!} className="text-xs academy-accent underline underline-offset-4">Урок {Number(id.slice(1, 3))}.{Number(id.slice(4))}</a>)}</div>}
      {tool.alternatives.length > 0 && <a href={`/academy-tools/silk-road?tool=${tool.alternatives[0]}`} className="mt-4 inline-block text-xs academy-accent underline underline-offset-4">Виж подходящ заместител</a>}
    </details>
  </article>;
}
