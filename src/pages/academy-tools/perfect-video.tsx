import { useEffect, useMemo, useState, lazy, Suspense } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import source from '@/data/video-ai-tools.json';
import { parseVideoAiTool } from '@/lib/video-ai';
import VideoAiToolCard from '@/components/academy/VideoAiToolCard';
import ThemeSelector from '@/components/academy/ThemeSelector';
const Workbench = lazy(() => import('@/components/academy/VideoAiWorkbench'));
const catalog = source.map(parseVideoAiTool).filter(x => x !== null);
const categories = [...new Set(catalog.map(x => x.category))];
const selectClass = 'mt-2 w-full rounded-xl border academy-border-strong academy-raised px-3 py-3 text-sm academy-text';
export default function PerfectVideoToolsPage() {
  const [params, setParams] = useSearchParams();
  const module = /^s02-m(0[1-9]|1[0-5])$/.test(params.get('module') || '') ? params.get('module')! : '';
  const [category, setCategory] = useState(''), [access, setAccess] = useState('');
  useEffect(() => { const old = document.title; document.title = 'Видео с помощ от ИИ | Академия TAVORA'; return () => { document.title = old; }; }, []);
  const shown = useMemo(() => catalog.filter(x => (!category || x.category === category) && (!module || x.lessons.some(id => `s02-m${id.slice(2, 4)}` === module)) && (!access || (access === 'start' ? ['free', 'limited', 'local'].includes(x.access) : ['check', 'paid', 'noncommercial'].includes(x.access)))), [module, category, access]);
  return <main id="main-content" className="min-h-screen academy-bg academy-text"><div className="mx-auto max-w-6xl px-4 py-7 sm:px-8 sm:py-10">
    <div className="flex flex-wrap items-center justify-between gap-4"><Link to="/kurs/perfektnoto-video" className="text-sm academy-accent underline underline-offset-4">Към „Перфектното видео“</Link><ThemeSelector /></div>
    <header className="my-9 max-w-3xl"><p className="text-xs font-semibold uppercase tracking-[.15em] academy-accent">Академия TAVORA</p><h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-5xl">Историята води. Инструментът помага.</h1><p className="mt-5 text-lg leading-8 academy-body">Избери какво да заснемеш, какво да редактираш и къде ИИ има полезна работа. Разгледай маршрутите, ограниченията и предоставените сравнения.</p><p className="mt-4 text-sm leading-7 academy-muted">Показаните условия са сверени по документация на 18.10.2026 г. Практиките в курса използват предоставени материали и готови избори. Външен акаунт, платен план и качване на собствен файл не са условие за проверките.</p><a href="#workbench" className="mt-4 inline-block text-sm academy-accent underline underline-offset-4">Пробвай петте демонстрации</a></header>
    <section aria-label="Подбор на видео инструменти" className="rounded-2xl border academy-border p-4 sm:p-5"><div className="grid gap-4 sm:grid-cols-3"><label className="text-sm academy-text">Задача<select className={selectClass} value={category} onChange={e => setCategory(e.target.value)}><option value="">Всички задачи</option>{categories.map(x => <option key={x}>{x}</option>)}</select></label><label className="text-sm academy-text">Модул<select className={selectClass} value={module} onChange={e => { const next = new URLSearchParams(params); if (e.target.value) next.set('module', e.target.value); else next.delete('module'); setParams(next); }}><option value="">Всички модули</option>{Array.from({ length: 15 }, (_, i) => <option key={i} value={`s02-m${String(i + 1).padStart(2, '0')}`}>Модул {i + 1}</option>)}</select></label><label className="text-sm academy-text">Достъп<select className={selectClass} value={access} onChange={e => setAccess(e.target.value)}><option value="">Всички условия</option><option value="start">Безплатен или ограничен старт</option><option value="conditions">Платено или за допълнителна проверка</option></select></label></div><div className="mt-4 flex flex-wrap justify-between gap-3"><p role="status" className="text-sm academy-body">Показани: {shown.length} от {catalog.length} инструмента.</p><button type="button" onClick={() => { setCategory(''); setAccess(''); setParams({}); }} className="text-sm academy-accent underline underline-offset-4">Покажи всички</button></div></section>
    {shown.length === 0 && <p className="mt-6 text-sm academy-body">Няма инструмент с тази комбинация. Избери друга задача или покажи всички.</p>}
    {categories.filter(c => shown.some(x => x.category === c)).map(c => <section key={c} aria-label={c} className="mt-9"><h2 className="mb-4 text-xl font-semibold academy-text">{c}</h2><div className="grid items-start gap-4 lg:grid-cols-2">{shown.filter(x => x.category === c).map(tool => <VideoAiToolCard key={tool.id} tool={tool} />)}</div></section>)}
    <div id="workbench" className="mt-9 scroll-mt-6"><Suspense fallback={<p role="status" className="text-sm academy-body">Зареждане на демонстрациите…</p>}><Workbench /></Suspense></div>
    <p className="mt-5 text-sm leading-7 academy-muted">Публичните предоставени примери не отключват платени уроци. „Перфектното видео“ се изучава с покупка или предоставен достъп.</p>
  </div></main>;
}
