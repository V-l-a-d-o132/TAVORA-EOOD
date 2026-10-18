import { useEffect, useMemo, useRef, useState } from 'react';
import { studioComparison, studioComparisonText, studioMatches, studioPlaylist, studioPlanText, type ClosedStudio } from '@/lib/closed-practice-studio';
import type { JsonObject } from '@/lib/lesson-engine-v2';
import { VideoPracticeGraphic } from '@/components/academy/VideoDecisionLab';
import { CaptionPreview, SchedulePreview, SpeedPreview, TransitionPreview } from '@/components/academy/ProductionPracticePreviews';
import { BudgetPreview, MetricsPreview, StoryboardPreview } from '@/components/academy/FinalPracticePreviews';
import { MarketingWorkflowPreview, MessagePreview, RolesPreview } from '@/components/academy/MarketingPracticePreviews';
import { BriefPreview, PagePreview, SearchPreview } from '@/components/academy/SilkPracticePreviews';
import ProvidedMaterials from '@/components/academy/ProvidedMaterials';

interface Props { studio: ClosedStudio; state: JsonObject; busy: boolean; completed: boolean; onChange: (state: JsonObject) => void; onSubmit: (state: JsonObject) => void }
const asset = '/academy-labs/perfect-video/practical/coffee-machine.mp4';
const poster = '/academy-labs/perfect-video/practical/coffee-poster.jpg';
const looks = { source: 'none', warm: 'sepia(.45) saturate(1.3)', cool: 'sepia(.3) hue-rotate(150deg)', dark: 'brightness(.42)' };

export default function ClosedPracticeStudio({ studio, state, busy, completed, onChange, onSubmit }: Props) {
  const matches = useMemo(() => studioMatches(studio, state), [studio, state]);
  const playlist = useMemo(() => studioPlaylist(studio, matches), [studio, matches]);
  const video = useRef<HTMLVideoElement>(null);
  const playing = useRef(false);
  const clipIndex = useRef(0);
  const [activeClip, setActiveClip] = useState(0);
  const [mediaError, setMediaError] = useState('');
  const [saved, setSaved] = useState<Record<string, string> | null>(null);
  const [notice, setNotice] = useState('');
  const comparison = saved ? studioComparison(studio, saved, matches) : [];
  const selectedCount = Object.keys(matches).length;
  const complete = studio.slots.every(slot => !!matches[slot.id]);
  const baseComplete = studio.slots.filter(slot => slot.phase !== 'change').every(slot => !!matches[slot.id]);
  const preview = ['transition', 'speed', 'budget'].includes(studio.kind) ? playlist.at(-1) : playlist[0];
  useEffect(() => { setSaved(null); setNotice(''); }, [studio.context, studio.task]);
  const download = () => {
    const url = URL.createObjectURL(new Blob([saved ? studioComparisonText(studio, saved, matches) : studioPlanText(studio, matches)], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = saved ? 'uchebno-sravnenie.txt' : 'ucheben-plan.txt';
    document.body.append(link); link.click(); link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  useEffect(() => {
    playing.current = false; clipIndex.current = 0;
    video.current?.pause(); setActiveClip(0); setMediaError('');
  }, [matches]);

  const play = async () => {
    const first = playlist[0]?.clip;
    if (!video.current || !first) return;
    clipIndex.current = 0; setActiveClip(0); playing.current = true;
    video.current.currentTime = first[0];
    try { await video.current.play(); } catch { playing.current = false; setMediaError('Натисни отново за преглед. Ако записът не се зареди, използвай описанията на фрагментите.'); }
  };
  const advance = () => {
    const player = video.current;
    const clip = playlist[clipIndex.current]?.clip;
    if (!player || !playing.current || !clip || player.currentTime < clip[1]) return;
    const next = playlist[clipIndex.current + 1]?.clip;
    if (next) { clipIndex.current += 1; setActiveClip(clipIndex.current); player.currentTime = next[0]; }
    else { playing.current = false; player.pause(); }
  };

  return <div data-testid="closed-practice-studio" className="space-y-5">
    <div className="space-y-3 text-base leading-7 academy-body"><p>{studio.context}</p><p className="font-medium academy-text">{studio.task}</p></div>
    {studio.materials && <ProvidedMaterials key={studio.materials.title} materials={studio.materials} />}
    <div className="rounded-xl border academy-border academy-tint p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm"><p className="font-semibold academy-text">Избрани решения: {selectedCount}/{studio.slots.length}</p><p className="academy-muted">{complete ? 'Готови са за проверка.' : baseComplete ? 'Прочети новото условие и приспособи решението.' : 'Избери първите части и наблюдавай резултата.'}</p></div>
      <progress aria-label="Попълнени избори в работната задача" max={studio.slots.length} value={selectedCount} className="mt-3 h-2 w-full accent-red-600" />
      <p className="mt-2 text-xs leading-5 academy-muted">Попълнените избори не са оценка. Можеш да запазиш вариант за сравнение, да промениш решение и да проследиш разликата.</p>
    </div>
    <div className="grid min-w-0 gap-5 lg:grid-cols-2">
      <div className="min-w-0 space-y-4">{studio.slots.map(slot => slot.phase === 'change' && !baseComplete ? <p key={slot.id} className="rounded-xl border academy-border p-4 text-sm leading-6 academy-muted">След първите решения ще получиш промяна в задачата.</p> : <div key={slot.id}>
        {slot.phase === 'change' && studio.change && <div className="mb-3 rounded-xl border academy-border-strong academy-tint p-4 text-sm leading-6 academy-body"><h4 className="mb-1 font-semibold academy-text">Промяна в задачата</h4><p>{studio.change}</p></div>}
        <label className="block rounded-xl border academy-border p-4">
        <span className="mb-2 block text-sm font-semibold academy-text">{slot.text}</span>
        <select aria-label={slot.text} value={matches[slot.id] || ''} disabled={busy} onChange={event => {
          const next = { ...matches }; if (event.target.value) next[slot.id] = event.target.value; else delete next[slot.id]; onChange({ matches: next });
        }} className="w-full min-w-0 rounded-lg border academy-border-strong academy-raised px-3 py-3 text-sm academy-text focus:outline-none focus:ring-2 focus:ring-red-300">
          <option value="">Избери вариант</option>{slot.choices.map(id => <option key={id} value={id}>{studio.choices.find(choice => choice.id === id)?.text}</option>)}
        </select>
        {matches[slot.id] && <span className="mt-3 block break-words text-sm leading-6 academy-body">{studio.choices.find(choice => choice.id === matches[slot.id])?.text}</span>}
      </label>
      <details className="mt-2 rounded-xl border academy-border px-4 py-3 text-sm leading-6 academy-body">
        <summary className="cursor-pointer font-medium academy-text">Прочети трите варианта</summary>
        <ol className="mt-3 list-decimal space-y-3 pl-5">{slot.choices.map(id => <li key={id} className="break-words">{studio.choices.find(choice => choice.id === id)?.text}</li>)}</ol>
      </details></div>)}</div>
      <section aria-label="Резултат от изборите" className="min-w-0 rounded-2xl border academy-border academy-tint p-4">
        <h3 className="mb-4 text-base font-semibold academy-text">{studio.title || 'Резултат от изборите'}</h3>
        {studio.kind === 'cut' && <>
          <div className="relative"><video ref={video} src={asset} poster={poster} preload="metadata" playsInline muted onTimeUpdate={advance} onEnded={advance}
            onError={() => setMediaError('Записът не се зареди. Описанията на фрагментите остават достъпни.')} aria-label="Преглед на подредената сцена" className="aspect-video w-full rounded-xl bg-black" />
          {playlist[activeClip]?.text.startsWith('Преди това:') && <span className="absolute left-3 top-3 rounded bg-black px-2 py-1 text-sm font-semibold text-white">Преди това</span>}</div>
          <button type="button" onClick={() => void play()} disabled={!playlist.length} className="mt-3 rounded-lg border academy-border-strong px-4 py-2 text-sm font-medium academy-text disabled:opacity-40">Прегледай подредбата</button>
          <button type="button" onClick={() => { playing.current = false; video.current?.pause(); }} className="ml-2 mt-3 rounded-lg border academy-border px-4 py-2 text-sm academy-body">Пауза</button>
          <ol aria-label="Избрани фрагменти" className="mt-4 space-y-2 text-sm leading-6 academy-body">{playlist.map((choice, index) => <li key={`${index}/${choice.id}`} aria-current={activeClip === index ? 'step' : undefined} className={activeClip === index ? 'font-semibold academy-text' : ''}>{index + 1}. {choice.text} {choice.clip && `(${choice.clip[1] - choice.clip[0]} сек.)`}</li>)}</ol>
        </>}
        {(studio.kind === 'frame' || studio.kind === 'colour') && <>
          <div className={`mx-auto overflow-hidden rounded-xl bg-black ${preview?.crop && preview.crop !== 'wide' ? 'aspect-[9/16] w-40 max-w-full' : 'aspect-video w-full'}`}>
            <img src={poster} alt="Чаша под дюзите на кафемашина — предоставен учебен кадър" width={720} height={405} className="h-full w-full object-cover"
              style={{ objectPosition: preview?.crop === 'edge' ? '100% center' : '43% center', filter: looks[preview?.look || 'source'] }} />
          </div><p className="mt-3 text-sm leading-6 academy-body">{preview?.text || 'Избери операция и сравни резултата.'}</p>
        </>}
        {studio.kind === 'sound' && <>{preview?.audio ? <audio key={preview.audio} src={preview.audio} controls preload="metadata" aria-label="Избран звуков вариант" className="w-full max-w-full" /> : <p className="text-sm academy-muted">Избери запис, за да го чуеш. Започни с ниска сила на устройството.</p>}<p className="mt-3 text-sm leading-6 academy-body">{preview?.text}</p></>}
        {studio.kind === 'diagram' && <>{preview?.diagram ? <VideoPracticeGraphic kind={preview.diagram.kind} variant={preview.diagram.variant} /> : <p className="text-sm academy-muted">Избери вариант и сравни схемата.</p>}<p className="mt-3 text-sm leading-6 academy-body">{preview?.text}</p></>}
        {studio.kind === 'schedule' && <SchedulePreview studio={studio} matches={matches} />}
        {studio.kind === 'caption' && <CaptionPreview studio={studio} choice={preview} />}
        {studio.kind === 'speed' && <SpeedPreview choice={preview} />}
        {studio.kind === 'transition' && <TransitionPreview choice={preview} />}
        {studio.kind === 'metrics' && <MetricsPreview studio={studio} matches={matches} />}
        {studio.kind === 'budget' && <BudgetPreview choice={preview} />}
        {studio.kind === 'storyboard' && <StoryboardPreview studio={studio} matches={matches} />}
        {studio.kind === 'message' && <MessagePreview studio={studio} matches={matches} />}
        {studio.kind === 'roles' && <RolesPreview studio={studio} matches={matches} />}
        {studio.kind === 'workflow' && <MarketingWorkflowPreview studio={studio} matches={matches} />}
        {studio.kind === 'brief' && <BriefPreview studio={studio} matches={matches} />}
        {studio.kind === 'page' && <PagePreview studio={studio} matches={matches} />}
        {studio.kind === 'search' && <SearchPreview studio={studio} matches={matches} />}
        <dl className="mt-4 space-y-4">{studio.slots.filter(slot => (slot.phase !== 'change' || baseComplete) && (!slot.preview || studio.kind === 'decision')).map(slot => <div key={slot.id}>
          <dt className="text-xs font-semibold uppercase tracking-wider academy-subtle">{slot.text}</dt><dd className="mt-1 text-sm leading-6 academy-body">{studio.choices.find(choice => choice.id === matches[slot.id])?.text || 'Още няма избор.'}</dd>
        </div>)}</dl>
        {mediaError && <p role="alert" className="mt-3 text-sm academy-warning">{mediaError}</p>}
        <p className="mt-5 border-t academy-border pt-4 text-xs leading-5 academy-muted">{studio.limit}</p>
        {(studio.kind !== 'decision' || studio.domain !== 'video') && <a href={studio.domain === 'silk-road' ? '/academy-labs/silk-road/practical/SOURCES.md' : studio.domain === 'marketing' ? '/academy-labs/marketing/practical/SOURCES.md' : ['metrics', 'budget', 'storyboard'].includes(studio.kind) ? '/academy-labs/perfect-video/practical/FINAL-SOURCES.md' : ['sound', 'transition'].includes(studio.kind) ? '/academy-labs/perfect-video/closed/SOURCES.md' : studio.kind === 'schedule' ? '/academy-labs/perfect-video/practical/PRODUCTION-SOURCES.md' : '/academy-labs/perfect-video/practical/SOURCES.md'} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs underline academy-muted">Произход на учебния материал</a>}
      </section>
    </div>
    <section aria-label="Сравнение на решенията" className="rounded-2xl border academy-border p-4 sm:p-5">
      <h3 className="font-semibold academy-text">Какво промени и какво запази?</h3>
      <p className="mt-2 text-sm leading-6 academy-body">Запази текущите части, после промени един избор. Сравни резултата с условията, преди да го предадеш за проверка. Запазеният вариант остава само докато тази задача е отворена.</p>
      <div className="mt-3 flex flex-wrap gap-3">
        <button type="button" disabled={busy || !baseComplete} onClick={() => { setSaved({ ...matches }); setNotice('Вариантът е запазен за сравнение в тази отворена задача.'); }} className="rounded-xl border academy-border-strong px-4 py-3 text-sm academy-text disabled:opacity-40">{saved ? 'Обнови запазения вариант' : 'Запази вариант за сравнение'}</button>
        {saved && <button type="button" disabled={busy} onClick={() => { onChange({ matches: { ...saved } }); setNotice('Върнати са запазените избори. Това действие не променя оценката или XP.'); }} className="rounded-xl border academy-border-strong px-4 py-3 text-sm academy-body">Върни запазените избори</button>}
      </div>
      <p role="status" className="mt-3 text-sm academy-muted">{notice}</p>
      {saved && <><p className="mt-3 text-sm font-medium academy-text">Променени части: {comparison.filter(row => row.changed).length}/{comparison.length}</p><dl className="mt-3 space-y-3">{comparison.map(row => <div key={row.id} className="rounded-xl border academy-border p-3">
        <dt className="text-sm font-semibold academy-text">{row.label} · {row.changed ? 'променено' : 'запазено'}</dt>
        <dd className="mt-2 grid gap-3 text-sm leading-6 academy-body sm:grid-cols-2"><p className="min-w-0 break-words"><strong>Запазен вариант:</strong> {row.before}</p><p className="min-w-0 break-words"><strong>Текущ вариант:</strong> {row.after}</p></dd>
      </div>)}</dl></>}
    </section>
    {completed && <p className="text-sm leading-6 academy-muted">Практиката вече има запазено преминаване. Допълнителните сравнения не оценяват нов вариант и не добавят XP. Сваленият файл описва избраните части.</p>}
    <div className="flex flex-wrap items-center gap-3">
      <button type="button" disabled={busy || completed || !complete} onClick={() => onSubmit({ matches })} className="rounded-xl academy-primary px-5 py-3 text-sm font-semibold text-white disabled:opacity-40">{completed ? 'Практиката е премината' : busy ? 'Проверка…' : 'Провери решенията'}</button>
      <button type="button" disabled={busy} onClick={() => onChange({ matches: {} })} className="rounded-xl border academy-border-strong px-4 py-3 text-sm academy-body">Започни сравняването отначало</button>
      <button type="button" disabled={!complete || busy} onClick={download} className="rounded-xl border academy-border-strong px-4 py-3 text-sm academy-body disabled:opacity-40">{saved ? 'Изтегли сравнението' : 'Изтегли избраните решения'}</button>
    </div>
  </div>;
}
