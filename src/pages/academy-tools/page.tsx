import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ThemeSelector from '@/components/academy/ThemeSelector';
import SilkToolCard from '@/components/academy/SilkToolCard';
import { parseSilkTool } from '@/lib/silk-toolkit';
import source from '@/data/silk-tools.json';
const ImageWorkbench = lazy(() => import('@/components/academy/SilkImageWorkbench'));
const catalog = source.map(parseSilkTool).filter(tool => tool !== null);
const categories = [...new Set(catalog.map(tool => tool.category))];
const selectClass = 'mt-2 w-full rounded-xl border academy-border-strong academy-raised px-3 py-3 text-sm academy-text focus:outline-none focus:ring-2 focus:ring-red-400';

export default function AcademyToolsPage() {
  const [params, setParams] = useSearchParams();
  const module = /^s01-m(0[1-9]|1[01])$/.test(params.get('module') || '') ? params.get('module')! : '';
  const chosen = catalog.find(tool => tool.id === params.get('tool'))?.id || '';
  const [category, setCategory] = useState('');
  const [access, setAccess] = useState('');
  useEffect(() => { const previous = document.title; document.title = 'Инструменти за „Пътят на коприната“ | TAVORA'; return () => { document.title = previous; }; }, []);
  const shown = useMemo(() => catalog.filter(tool => (!chosen || tool.id === chosen)
    && (!category || tool.category === category)
    && (!module || tool.lessons.some(id => `s01-m${id.slice(1, 3)}` === module))
    && (!access || (access === 'local' ? tool.access === 'local' : access === 'start' ? ['free', 'quota', 'local', 'experiment'].includes(tool.access) : ['personal', 'transaction', 'self-host', 'check'].includes(tool.access)))), [chosen, category, module, access]);
  const reset = () => { setCategory(''); setAccess(''); setParams({}); };

  return <main id="main-content" className="min-h-screen academy-bg academy-text">
    <div className="mx-auto max-w-6xl px-4 py-7 sm:px-8 sm:py-10">
      <div className="flex flex-wrap items-center justify-between gap-4"><Link to="/kurs/ai-business-blueprint" className="text-sm academy-accent underline underline-offset-4">Към „Пътят на коприната“</Link><ThemeSelector /></div>
      <header className="my-9 max-w-3xl"><p className="text-xs font-semibold uppercase tracking-[.15em] academy-accent">Академия TAVORA</p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">Инструменти за задачата</h1>
        <p className="mt-5 text-lg leading-8 academy-body">Намери с какво да подготвиш снимка, да провериш страница или да свържеш процес. Виж стъпките, ограниченията и как се проверява резултатът. Ръководствата са свързани със съответните уроци.</p>
        <p className="mt-4 text-sm leading-7 academy-muted">Условията са сверени с официалните страници на 18.10.2026 г. Различаваме безплатен достъп, квоти, нетърговска проба и такси при реална операция. В курса работиш с предоставени материали и избори; външен акаунт или плащане не са условие за проверките.</p>
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-sm"><Link to="/module/s01-m01?lesson=0" className="academy-accent underline underline-offset-4">Отвори безплатния първи модул</Link><a href="#webp" className="academy-accent underline underline-offset-4">Пробвай подготовката на WebP</a><Link to="/academy-labs/silk-road/start" className="academy-accent underline underline-offset-4">Начален учебен маршрут</Link></div>
      </header>
      <section aria-label="Подбор на инструменти" className="rounded-2xl border academy-border p-4 sm:p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="text-sm academy-text">Задача<select value={category} onChange={event => { setCategory(event.target.value); if (chosen) { const next = new URLSearchParams(params); next.delete('tool'); setParams(next); } }} className={selectClass}><option value="">Всички задачи</option>{categories.map(value => <option key={value} value={value}>{value}</option>)}</select></label>
          <label className="text-sm academy-text">Модул<select value={module} onChange={event => { const next = new URLSearchParams(params); next.delete('tool'); if (event.target.value) next.set('module', event.target.value); else next.delete('module'); setParams(next); }} className={selectClass}><option value="">Всички модули</option>{Array.from({ length: 11 }, (_, i) => <option key={i} value={`s01-m${String(i + 1).padStart(2, '0')}`}>Модул {i + 1}</option>)}</select></label>
          <label className="text-sm academy-text">Достъп<select value={access} onChange={event => setAccess(event.target.value)} className={selectClass}><option value="">Всички условия</option><option value="start">Безплатен старт, включително с квоти</option><option value="local">Безплатна локална работа</option><option value="conditions">Проба, такси или допълнителна проверка</option></select></label>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3"><p role="status" className="text-sm academy-body">Показани: {shown.length} от {catalog.length} инструмента и услуги.</p><button type="button" onClick={reset} className="text-sm academy-accent underline underline-offset-4">Покажи всички инструменти</button></div>
      </section>
      {shown.length === 0 && <p className="mt-6 rounded-xl border academy-border p-5 text-sm leading-7 academy-body">Няма инструмент с тази комбинация. Избери друга задача или покажи всички инструменти.</p>}
      {categories.filter(value => shown.some(tool => tool.category === value)).map(value => <section key={value} aria-label={value} className="mt-9"><h2 className="mb-4 text-xl font-semibold academy-text">{value}</h2><div className="grid items-start gap-4 lg:grid-cols-2">{shown.filter(tool => tool.category === value).map(tool => <SilkToolCard key={tool.id} tool={tool} />)}</div></section>)}
      <Suspense fallback={<p role="status" className="mt-8 text-sm academy-body">Зареждане на лабораторията…</p>}><ImageWorkbench /></Suspense>
    </div>
  </main>;
}
