import { videoAiLessonLink, type VideoAiTool } from '@/lib/video-ai';
export default function VideoAiToolCard({ tool, compact = false }: { tool: VideoAiTool; compact?: boolean }) {
  const limited = ['paid', 'check', 'noncommercial'].includes(tool.access);
  return <article aria-label={tool.name} id={`video-tool-${tool.id}`} className="min-w-0 scroll-mt-6 rounded-2xl border academy-border p-4 sm:p-5">
    <h3 className="break-words text-lg font-semibold academy-text">{tool.name}</h3>
    <p className={`mt-2 inline-block max-w-full rounded-lg border px-2 py-1 text-xs leading-5 ${limited ? 'academy-warning-border academy-warning-bg academy-warning' : 'academy-info-border academy-info-bg academy-text'}`}>{tool.accessLabel}</p>
    <p className="mt-3 text-sm leading-7 academy-body">{tool.purpose}</p><p className="mt-3 text-sm leading-7 academy-body">{tool.limits}</p>
    <a href={tool.site} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm font-semibold academy-accent underline underline-offset-4">Отвори {tool.name}<span className="sr-only"> в нов раздел</span></a>
    <details className="mt-4 border-t academy-border pt-3"><summary className="cursor-pointer text-sm font-semibold leading-6 academy-text">Работен маршрут · {tool.name}</summary>
      <ol className="mt-3 list-decimal space-y-3 pl-5 text-sm leading-7 academy-body">{tool.steps.map((step, i) => <li key={i}>{step}</li>)}</ol>
      <p className="mt-4 text-sm leading-7 academy-body"><strong className="academy-text">Приемане на резултата: </strong>{tool.verification}</p>
      <p className="mt-4 text-xs leading-6 academy-muted">Документация, сверена на {tool.checkedAt ? tool.checkedAt.split('-').reverse().join('.') : 'непосочена дата'}. Преди външна работа провери текущия план, функция и износ.</p>
      <ul aria-label={`Източници за ${tool.name}`} className="mt-2 flex flex-wrap gap-3 text-xs">{tool.sources.map((url, i) => <li key={url}><a href={url} target="_blank" rel="noopener noreferrer" className="academy-accent underline underline-offset-4">Официален източник {i + 1}</a></li>)}</ul>
      {!compact && <div className="mt-4 flex flex-wrap gap-3">{tool.lessons.map(id => <a key={id} href={videoAiLessonLink(id)!} className="text-xs academy-accent underline underline-offset-4">Урок {Number(id.slice(2, 4))}.{Number(id.slice(5))}</a>)}</div>}
    </details>
  </article>;
}
