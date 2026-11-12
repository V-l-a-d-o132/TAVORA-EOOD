import { useRef, useState } from 'react';
import { coffee, seconds, sourceLabel, type MontageShot, type MontageSource } from '@/lib/video-montage';

const label = 'block min-w-0 text-sm font-semibold academy-body';
const field = 'mt-1.5 block min-h-11 w-full min-w-0 rounded-lg border academy-border-strong academy-bg px-3 py-2 text-base font-normal academy-text';
const button = 'min-h-11 rounded-lg border academy-border-strong px-3 py-2 text-sm font-semibold academy-text disabled:opacity-45';
const letters = ['А', 'Б', 'В', 'Г'];

function ShotPreview({ shot, source, disabled }: { shot: MontageShot; source?: MontageSource; disabled: boolean }) {
  const player = useRef<HTMLVideoElement>(null);
  const end = useRef<number | null>(null);
  const [error, setError] = useState('');
  const preview = async () => {
    const video = player.current;
    if (!video) return;
    const from = seconds(shot.from), to = seconds(shot.to);
    if (!Number.isFinite(from) || !Number.isFinite(to) || to <= from || to > source.seconds + 0.001) {
      setError('Въведи начало и край в рамките на източника.'); return;
    }
    end.current = to;
    video.currentTime = from;
    try { await video.play(); setError(''); } catch { setError('Клипът не тръгна. Провери формата или избери друг източник.'); }
  };
  if (!source) return <p className="rounded-xl border academy-warning-border academy-warning-bg p-4 text-sm academy-warning">Свържи отново „{sourceLabel(shot.source)}“ от устройството, за да видиш кадъра.</p>;
  return <div className="min-w-0">
    <div className="relative mx-auto aspect-[9/16] w-full max-w-[15rem] overflow-hidden rounded-xl bg-[#131815]">
      <video ref={player} src={source.url} playsInline controls preload="auto" aria-label="Източник за активния кадър"
        className={`h-full w-full ${shot.framing === 'fill' ? 'object-cover' : 'object-contain'}`}
        onLoadedData={e => { const from = seconds(shot.from); if (Number.isFinite(from) && from < source.seconds) e.currentTarget.currentTime = from; }}
        onTimeUpdate={e => { if (end.current !== null && e.currentTarget.currentTime >= end.current) { e.currentTarget.pause(); end.current = null; } }}
        onError={() => setError('Този източник не се отваря. Опитай друг видеофайл или свали монтажния лист.')} />
      {shot.caption.trim() && <p aria-hidden="true" className="pointer-events-none absolute inset-x-[8%] bottom-[15%] break-words bg-black/85 px-2 py-1 text-center text-xs font-semibold leading-tight text-white">{shot.caption.trim()}</p>}
    </div>
    <div className="mt-3 text-center"><button type="button" className={button} onClick={preview} disabled={disabled}>Пусни отрязъка</button></div>
    {error && <p role="alert" className="mt-2 text-sm academy-warning">{error}</p>}
  </div>;
}

interface Props {
  shots: MontageShot[];
  active: number;
  sources: Map<string, MontageSource>;
  disabled: boolean;
  onActive: (id: number) => void;
  onChange: (shots: MontageShot[]) => void;
  onFiles: (files: File[]) => void;
}

export default function MontageEditor({ shots, active, sources, disabled, onActive, onChange, onFiles }: Props) {
  const index = shots.findIndex(shot => shot.id === active);
  const shot = shots[index], source = sources.get(shot.source);
  const patch = (changes: Partial<MontageShot>) => onChange(shots.map(item => item.id === active ? { ...item, ...changes } : item));
  const chooseSource = (id: string) => {
    const selected = sources.get(id);
    if (!selected) return;
    const previous = seconds(shot.to) - seconds(shot.from);
    const duration = Math.min(selected.seconds, previous > 0 ? previous : 5);
    patch({ source: id, from: '0', to: String(Math.floor(duration * 1000) / 1000) });
  };
  const move = (offset: number) => {
    const next = shots.slice();
    next.splice(index, 1);
    next.splice(index + offset, 0, shot);
    onChange(next);
  };
  return <fieldset disabled={disabled} className="min-w-0 rounded-2xl border academy-border academy-surface p-4 sm:p-6">
    <legend className="sr-only">Монтажна маса</legend>
    <h2 className="text-xl font-semibold academy-text">Монтажна маса</h2>
    <ol aria-label="Ред на кадрите" className="my-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
      {shots.map((item, i) => <li key={item.id} className="min-w-0"><button type="button" aria-label={`Кадър ${i + 1}, отрязък ${letters[item.id]}`}
        aria-pressed={item.id === active} onClick={() => onActive(item.id)}
        className={`w-full rounded-lg border p-3 text-left ${item.id === active ? 'academy-accent-border academy-accent-bg' : 'academy-border'}`}>
        <span className="block text-sm font-semibold academy-text">{i + 1}. Отрязък {letters[item.id]}</span>
        <span className="block text-xs leading-5 academy-muted">{item.from || '…'}–{item.to || '…'} сек.</span>
      </button></li>)}
    </ol>
    <div className="grid items-start gap-5 md:grid-cols-[15rem_1fr] md:gap-8">
      <ShotPreview key={`${shot.id}:${source?.url}:${disabled}`} shot={shot} source={source} disabled={disabled} />
      <div className="min-w-0 space-y-4">
        <label className={label}>Източник за кадър {index + 1}
          <select className={field} value={shot.source} onChange={e => chooseSource(e.target.value)}>
            {!source && <option value={shot.source}>{sourceLabel(shot.source)} · свържи отново</option>}
            {[...sources.values()].map(item => <option key={item.id} value={item.id}>{item.label}</option>)}
          </select>
        </label>
        <div className="grid grid-cols-2 gap-3">
          {(['from', 'to'] as const).map(key => <label key={key} className={label}>{key === 'from' ? 'Начало (сек.)' : 'Край (сек.)'}
            <input type="number" inputMode="decimal" min="0" max={source?.seconds} step="any" value={shot[key]}
              onChange={e => patch({ [key]: e.target.value })} className={field} /></label>)}
        </div>
        <label className={label}>Кадриране
          <select className={field} value={shot.framing} onChange={e => patch({ framing: e.target.value as MontageShot['framing'] })}>
            <option value="fit">Покажи целия кадър</option><option value="fill">Запълни вертикалата с централно изрязване</option>
          </select>
        </label>
        <label className={label}>Надпис за кадър {index + 1}
          <input maxLength={64} className={field} value={shot.caption} onChange={e => patch({ caption: e.target.value })} placeholder="Какво вижда зрителят?" />
        </label>
        <div className="flex flex-wrap gap-2">
          <button type="button" className={button} disabled={index === 0} onClick={() => move(-1)}>← Премести по-рано</button>
          <button type="button" className={button} disabled={index === shots.length - 1} onClick={() => move(1)}>Премести по-късно →</button>
        </div>
      </div>
    </div>
    <details className="mt-5 rounded-lg border academy-border p-3 text-sm academy-body" open={[...shots].some(item => !sources.has(item.source)) || undefined}>
      <summary className="cursor-pointer py-1 font-semibold">Работи със свои клипове</summary>
      <p className="my-2 leading-6">Снимай четири неща с телефона — продукта, ръката преди действието, самото действие и резултата. Добави клиповете и избери източник за всеки кадър. Записаният звук влиза в монтажа.</p>
      <label className={label}>Добави или свържи клипове от устройството
        <input type="file" accept="video/*" multiple className="mt-2 block w-full min-w-0 text-sm font-normal"
          onChange={e => { const files = Array.from(e.target.files || []); e.target.value = ''; onFiles(files); }} />
      </label>
      <p className="mt-2 text-xs leading-5 academy-muted">До 100 MB за клип. След презареждане избери повторно същите файлове. Учебният запис е {coffee.seconds} секунди и е без звук.</p>
    </details>
  </fieldset>;
}
