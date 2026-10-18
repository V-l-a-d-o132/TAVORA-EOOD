import { lazy, Suspense } from 'react';
import type { LessonToolkit as Toolkit } from '@/lib/silk-toolkit';
import SilkToolCard from './SilkToolCard';
const ImageWorkbench = lazy(() => import('./SilkImageWorkbench'));

export default function LessonToolkit({ toolkit }: { toolkit: Toolkit }) {
  return <section aria-label={toolkit.title} className="mt-6 min-w-0 space-y-4">
    <h3 className="text-lg font-semibold academy-text">{toolkit.title}</h3>
    <div className="space-y-4">{toolkit.cards.map(tool => <SilkToolCard key={tool.id} tool={tool} compact />)}</div>
    {toolkit.lab === 'webp' && <Suspense fallback={<p className="text-sm academy-body" role="status">Зареждане на учебните изображения…</p>}><ImageWorkbench /></Suspense>}
    <a href="/academy-tools/silk-road" className="inline-block text-sm academy-accent underline underline-offset-4">Всички инструменти по задачи и модули</a>
  </section>;
}
