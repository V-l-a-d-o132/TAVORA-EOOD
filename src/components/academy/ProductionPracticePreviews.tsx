import { useEffect, useRef, useState } from 'react';
import { studioSchedule, type ClosedStudio, type StudioChoice } from '@/lib/closed-practice-studio';

const movie = '/academy-labs/perfect-video/practical/coffee-machine.mp4';
const poster = '/academy-labs/perfect-video/practical/coffee-poster.jpg';

export function SchedulePreview({ studio, matches }: { studio: ClosedStudio; matches: Record<string, string> }) {
  const schedule = studioSchedule(studio, matches);
  const clock = (minute: number) => `${String((studio.startHour + Math.floor(minute / 60)) % 24).padStart(2, '0')}:${String(minute % 60).padStart(2, '0')}`;
  return <div className="space-y-4 text-sm leading-6 academy-body">
    <p>Начало на учебния ден: {clock(0)}. Часовете се променят с избраните части.</p>
    <ol aria-label="Сглобен снимачен график" className="space-y-3">{schedule.rows.map(row => <li key={row.id} className="rounded-lg border academy-border academy-raised p-3">
      <span className="block font-semibold academy-text">{clock(row.start)}–{clock(row.start + row.duration)}</span>{row.label} · {row.duration} мин.
    </li>)}</ol>
    {!schedule.rows.length && <p>Избери първата дейност, за да започнеш графика.</p>}
    {!!schedule.rows.length && <p aria-live="polite">Общо избрана работа: {schedule.work} мин. Последна дейност до {clock(schedule.end)}.</p>}
    {!!schedule.overlaps.length && <div className="rounded-lg border academy-border p-3"><p className="font-semibold academy-text">Застъпване във времето</p><ul>{schedule.overlaps.map((pair, i) => <li key={i}>{pair.join(' / ')}</li>)}</ul></div>}
    <p className="text-xs academy-muted">Това е разчет по дадените времена. Застъпването е проблем, ако дейностите изискват един и същ човек или комплект. Външни ограничения и изпълнение на терен се проверяват отделно.</p>
  </div>;
}

export function CaptionPreview({ studio, choice }: { studio: ClosedStudio; choice?: StudioChoice }) {
  const caption = choice?.caption;
  const positions = { top: '8%', middle: '40%', bottom: '76%' };
  const sizes = { small: 'clamp(9px, 1.5vw, 12px)', normal: 'clamp(16px, 2.4vw, 23px)', large: 'clamp(24px, 3.5vw, 36px)' };
  return <div className="space-y-3">
    <div className="relative overflow-hidden rounded-xl bg-black" aria-label="Кадър с избрания надпис">
      {caption?.position === 'top' && <p data-testid="studio-caption" className="px-2 py-2 text-center font-semibold leading-tight" style={{ fontSize: sizes[caption.size], color: '#fff', background: '#000' }}>{caption.text}</p>}
      <img src={poster} width={720} height={405} alt="Чашата и дюзите в предоставения кадър" className="aspect-video w-full object-cover" />
      {caption && caption.position !== 'top' && <p data-testid="studio-caption" className="absolute left-[5%] right-[5%] rounded px-2 py-1 text-center font-semibold leading-tight" style={{ top: positions[caption.position], fontSize: sizes[caption.size], color: '#fff', background: 'rgba(0,0,0,.92)' }}>{caption.text}</p>}
    </div>
    <p className="text-sm leading-6 academy-body">{choice?.text || 'Постави един от готовите надписи и сравни текста с видимия предмет.'}</p>
    <p className="text-xs leading-5 academy-muted">Преглед върху действителен кадър. Това е учебна композиция, без интерфейс на платформа. При истинско публикуване провери и малкия размер, изрязването и покриването от бутони.</p>
    {studio.surface === 'video' && <video src={movie} poster={poster} muted playsInline controls preload="metadata" aria-label="Изходният запис за сверка на надписа" className="aspect-video w-full rounded-xl bg-black" />}
  </div>;
}

export function SpeedPreview({ choice }: { choice?: StudioChoice }) {
  const video = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    if (video.current) { video.current.pause(); video.current.playbackRate = choice?.rate || 1; }
    setError(false);
  }, [choice?.id, choice?.rate]);
  const play = async () => {
    if (!video.current || !choice?.clip) return;
    video.current.currentTime = choice.clip[0]; video.current.playbackRate = choice.rate || 1;
    try { await video.current.play(); } catch { setError(true); }
  };
  return <div className="space-y-3 text-sm leading-6 academy-body">
    <video ref={video} src={movie} poster={poster} preload="metadata" muted playsInline aria-label="Скорост на предоставения фрагмент" className="aspect-video w-full rounded-xl bg-black"
      onError={() => setError(true)} onTimeUpdate={() => { if (video.current && choice?.clip && video.current.currentTime >= choice.clip[1]) video.current.pause(); }} />
    <p>Избрана скорост: {choice?.rate ? `${choice.rate}×` : 'още няма избор'}. {choice?.clip && `Източник: ${choice.clip[0]}–${choice.clip[1]} сек. При тази скорост фрагментът трае ${(choice.clip[1] - choice.clip[0]) / (choice.rate || 1)} сек.`}</p>
    <button type="button" disabled={!choice?.rate} onClick={() => void play()} className="rounded-lg border academy-border-strong px-4 py-2 academy-text disabled:opacity-40">Пусни избраната скорост</button>
    <button type="button" onClick={() => video.current?.pause()} className="ml-2 rounded-lg border academy-border px-4 py-2">Пауза</button>
    {error && <p role="alert">Записът не се зареди. Използвай дадените изходни времена за разчета.</p>}
  </div>;
}

export function TransitionPreview({ choice }: { choice?: StudioChoice }) {
  const [second, setSecond] = useState(0);
  const [error, setError] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);
  useEffect(() => { audio.current?.pause(); setSecond(0); setError(false); }, [choice?.id]);
  const tail = choice?.transition === 'tail';
  const picture = tail ? second < 4 ? 'Говорещият' : 'Ръцете и работната маса' : second < 3 ? 'Помещението' : 'Говорещият';
  return <div className="space-y-3 text-sm leading-6 academy-body">
    <div className="flex aspect-video items-center justify-center rounded-xl border academy-border academy-raised p-5 text-center" aria-label="Учебна картина на звуковия преход">
      <div><span aria-hidden="true" className="text-4xl">{picture === 'Говорещият' ? '◉' : '▤'}</span><p className="mt-3 font-semibold academy-text" aria-live="polite">{picture}</p><p className="text-xs academy-muted">Схематична картина · {second.toFixed(1)} сек.</p></div>
    </div>
    {choice?.audio ? <audio key={choice.id} ref={audio} src={choice.audio} controls preload="metadata" aria-label="Синтетичен звук за прехода" className="w-full max-w-full" onTimeUpdate={e => setSecond(e.currentTarget.currentTime)} onSeeked={e => setSecond(e.currentTarget.currentTime)} onError={() => setError(true)} /> : <p>Избери преход и пусни звука. Започни с ниска сила.</p>}
    <p>{tail ? 'Репликата започва на 3-тата секунда; картината сменя говорещия с ръцете на 4-тата.' : `Картината се сменя на 3-тата секунда; репликата започва на ${choice?.transition === 'early' ? '2-рата' : '3-тата'}.`}</p>
    <p className="text-xs academy-muted">Оригинална учебна схема и означен синтетичен говор. Сравняваш времевото отношение на картина и звук; това не е запис на интервю или проверка на синхрон на устни.</p>
    {error && <p role="alert">Звукът не се зареди. Времената на прехода са изписани над този ред.</p>}
  </div>;
}
