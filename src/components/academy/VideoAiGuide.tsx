import { lazy, Suspense } from 'react';
import type { VideoAiGuide as Guide } from '@/lib/video-ai';
import VideoAiToolCard from './VideoAiToolCard';
const Workbench = lazy(() => import('./VideoAiWorkbench'));
export default function VideoAiGuide({ guide }: { guide: Guide }) {
  return <section aria-label={guide.title} className="my-5 min-w-0 space-y-5">
    <h3 className="text-xl font-semibold academy-text">{guide.title}</h3>
    <p className="whitespace-pre-line text-base leading-8 academy-body">{guide.intro}</p>
    {guide.demo && <Suspense fallback={<p role="status" className="text-sm academy-body">Зареждане на предоставения пример…</p>}><Workbench key={guide.demo} initialMode={guide.demo} fixed /></Suspense>}
    <div className="grid items-start gap-4 xl:grid-cols-2">{guide.tools.map(tool => <VideoAiToolCard key={tool.id} tool={tool} compact />)}</div>
    <a href="/academy-tools/perfect-video" className="inline-block text-sm academy-accent underline underline-offset-4">Инструменти за „Перфектното видео“</a>
  </section>;
}
