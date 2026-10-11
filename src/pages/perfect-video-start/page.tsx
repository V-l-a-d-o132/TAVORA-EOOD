import { useState } from 'react';
import { Link } from 'react-router-dom';
import VideoDecisionLab, { VIDEO_LAB_KINDS, videoLabTitle, type VideoLabKind } from '@/components/academy/VideoDecisionLab';

export default function PerfectVideoStartPage() {
  const [kind, setKind] = useState<VideoLabKind>('story');
  return <main className="min-h-screen bg-[#090f0d] text-zinc-100"><div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-12">
    <Link to="/kurs" className="text-sm text-red-300 underline underline-offset-4">Обратно към Академията</Link>
    <header className="mb-8 mt-9 max-w-3xl"><p className="text-xs font-semibold uppercase tracking-[.15em] text-red-300">TAVORA · Перфектното видео</p><h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">Първо историята.<br />После изборът на кадър.</h1><p className="mt-5 text-lg leading-8 text-zinc-300">Смени един избор и виж какво се променя. Тук можеш да подредиш разказ, да сравниш кадри и да чуеш звуков проблем с готови учебни материали.</p></header>
    <nav aria-label="Избери демонстрация" className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{VIDEO_LAB_KINDS.map((item, i) => <button type="button" key={item} aria-pressed={item === kind} onClick={() => setKind(item)} className={`rounded-xl border px-4 py-3 text-left text-sm leading-5 focus:outline-none focus:ring-2 focus:ring-red-300 ${item === kind ? 'border-red-400 bg-red-500/15 text-white' : 'border-white/15 text-zinc-300 hover:bg-white/5'}`}><span className="mr-3 font-mono text-xs text-red-300">{String(i + 1).padStart(2, '0')}</span>{videoLabTitle(item)}</button>)}</nav>
    <VideoDecisionLab key={kind} kind={kind} />
    <p className="max-w-3xl text-sm leading-7 text-zinc-400">Демонстрациите показват принципи чрез схеми и обработен синтетичен звук. Решенията се проверяват в задачите на съответния урок. Нужните настройки и менюта зависят от телефона, камерата и редактора, с които разполагаш.</p>
  </div></main>;
}
