import { useEffect, useMemo, useRef, useState } from 'react';
import { studioMatches, studioPlaylist, type ClosedStudio } from '@/lib/closed-practice-studio';
import type { JsonObject } from '@/lib/lesson-engine-v2';
import { VideoPracticeGraphic } from '@/components/academy/VideoDecisionLab';

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
  const complete = studio.slots.every(slot => !!matches[slot.id]);
  const preview = playlist[0];

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
    <div className="grid min-w-0 gap-5 lg:grid-cols-2">
      <div className="min-w-0 space-y-4">{studio.slots.map(slot => <label key={slot.id} className="block rounded-xl border academy-border p-4">
        <span className="mb-2 block text-sm font-semibold academy-text">{slot.text}</span>
        <select aria-label={slot.text} value={matches[slot.id] || ''} disabled={busy} onChange={event => {
          const next = { ...matches }; if (event.target.value) next[slot.id] = event.target.value; else delete next[slot.id]; onChange({ matches: next });
        }} className="w-full min-w-0 rounded-lg border academy-border-strong academy-raised px-3 py-3 text-sm academy-text focus:outline-none focus:ring-2 focus:ring-red-300">
          <option value="">Избери вариант</option>{slot.choices.map(id => <option key={id} value={id}>{studio.choices.find(choice => choice.id === id)?.text}</option>)}
        </select>
      </label>)}</div>
      <section aria-label="Резултат от изборите" className="min-w-0 rounded-2xl border academy-border academy-tint p-4">
        <h3 className="mb-4 text-base font-semibold academy-text">{studio.title || 'Резултат от изборите'}</h3>
        {studio.kind === 'cut' && <>
          <video ref={video} src={asset} poster={poster} preload="metadata" playsInline muted onTimeUpdate={advance} onEnded={advance}
            onError={() => setMediaError('Записът не се зареди. Описанията на фрагментите остават достъпни.')} aria-label="Преглед на подредената сцена" className="aspect-video w-full rounded-xl bg-black" />
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
        <dl className="mt-4 space-y-4">{studio.slots.filter(slot => !slot.preview || studio.kind === 'decision').map(slot => <div key={slot.id}>
          <dt className="text-xs font-semibold uppercase tracking-wider academy-subtle">{slot.text}</dt><dd className="mt-1 text-sm leading-6 academy-body">{studio.choices.find(choice => choice.id === matches[slot.id])?.text || 'Още няма избор.'}</dd>
        </div>)}</dl>
        {mediaError && <p role="alert" className="mt-3 text-sm academy-warning">{mediaError}</p>}
        <p className="mt-5 border-t academy-border pt-4 text-xs leading-5 academy-muted">{studio.limit}</p>
        {studio.kind !== 'decision' && <a href={studio.kind === 'sound' ? '/academy-labs/perfect-video/closed/SOURCES.md' : '/academy-labs/perfect-video/practical/SOURCES.md'} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs underline academy-muted">Произход на учебния материал</a>}
      </section>
    </div>
    <div className="flex flex-wrap items-center gap-3">
      <button type="button" disabled={busy || completed || !complete} onClick={() => onSubmit({ matches })} className="rounded-xl academy-primary px-5 py-3 text-sm font-semibold text-white disabled:opacity-40">{completed ? 'Практиката е премината' : busy ? 'Проверка…' : 'Провери решенията'}</button>
      <button type="button" disabled={busy} onClick={() => onChange({ matches: {} })} className="rounded-xl border academy-border-strong px-4 py-3 text-sm academy-body">Започни сравняването отначало</button>
    </div>
  </div>;
}
