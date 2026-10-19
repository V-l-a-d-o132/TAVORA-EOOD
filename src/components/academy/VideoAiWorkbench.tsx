import { useEffect, useRef, useState } from 'react';
import { VIDEO_AI_CAPTIONS, VIDEO_AI_MODES, VIDEO_AI_SHOTS, videoAiShot, videoAiSrt, type VideoAiMode } from '@/lib/video-ai';

const base = '/academy-labs/perfect-video';
const selectClass = 'mt-2 w-full rounded-xl border academy-border-strong academy-raised px-3 py-3 text-sm academy-text focus:outline-none focus:ring-2 focus:ring-red-400';
function download(name: string, text: string, type: string) {
  const url = URL.createObjectURL(new Blob([text], { type })); const link = document.createElement('a'); link.href = url; link.download = name; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}
const proposals = [
  { id: 'observe', label: 'Наблюдение на процес', text: 'Първо виждаме чашата преди появата на струята. Показваме появата, продължаването и спирането на струята. Не твърдим време за приготвяне, качество на напитката или модел на машината.', shots: ['before', 'start', 'action', 'end'] },
  { id: 'teaser', label: 'Тизър с показан край', text: 'Започваме от спирането на струята, после се връщаме към началото и действието. Този ред е предложение за различен разказ; трябва да стане ясно, че показваме връщане.', shots: ['end', 'before', 'start', 'action'] },
  { id: 'claim', label: 'Чернова с непроверено обещание', text: '„Перфектно кафе за три секунди.“ Показваме кратки фрагменти и готова чаша. Предоставеният запис не доказва нито това време, нито оценката „перфектно“.', shots: ['before', 'action', 'end', 'end'] },
];
const sounds = [
  { id: 'source', label: 'Референтна реплика', file: `${base}/closed/voice-clean.mp3`, text: 'Оригиналната предоставена синтетична реплика. Тя е източник за думите, а не запис на преподавател или клиент.' },
  { id: 'noise', label: 'Реплика с добавен шум', file: `${base}/closed/voice-noise.mp3`, text: 'Същата реплика с контролирано добавен шум. Това е входът на невронната обработка.' },
  { id: 'neural', label: 'Невронно обработен вариант', file: `${base}/ai/voice-neural.mp3`, text: 'Действително обработен предварително файл чрез RNNoise с частично смесване с входа. Браузърът възпроизвежда резултата; тук не се извиква облачен ИИ.' },
  { id: 'filtered', label: 'Силно ограничени високи честоти', file: `${base}/ai/voice-filtered.mp3`, text: 'Контролна негенеративна обработка на референтния сигнал. Сравни съгласните и разбираемостта; по-малко високи честоти не означава по-полезен говор.' },
];
const versions = [
  { id: 'wide', label: 'Хоризонтален отрязък', file: 'wide.mp4', text: 'Показва по-широкия контекст от предоставения запис.' },
  { id: 'portrait', label: 'Вертикален отрязък към действието', file: 'portrait.mp4', text: 'Действително изрязана вертикална версия. Провери дали нужните чашка и струя остават в кадър.' },
  { id: 'edge', label: 'Вертикален отрязък към края на кадъра', file: 'portrait-edge.mp4', text: 'Друга действително изрязана версия от същото място във времето. Сравни какво вече не може да се види.' },
];

export default function VideoAiWorkbench({ initialMode = 'story', fixed = false }: { initialMode?: VideoAiMode; fixed?: boolean }) {
  const [mode, setMode] = useState<VideoAiMode>(initialMode);
  const [proposal, setProposal] = useState('observe');
  const [order, setOrder] = useState<string[]>(['before', 'start', 'action', 'end']);
  const [index, setIndex] = useState(0), [playing, setPlaying] = useState(false);
  const [caption, setCaption] = useState('source'), [at, setAt] = useState(0);
  const [sound, setSound] = useState('source'), [version, setVersion] = useState('wide');
  const [brief, setBrief] = useState('document'), [method, setMethod] = useState('source');
  const [size, setSize] = useState({ version: '', text: '' });
  const video = useRef<HTMLVideoElement>(null), audio = useRef<HTMLAudioElement>(null);
  const shot = videoAiShot(order[index])!, draft = proposals.find(x => x.id === proposal)!;
  const captions = VIDEO_AI_CAPTIONS.find(x => x.id === caption)!;
  const signal = sounds.find(x => x.id === sound)!;
  const output = versions.find(x => x.id === version)!;
  useEffect(() => { setMode(initialMode); }, [initialMode]);
  useEffect(() => { setPlaying(false); setAt(0); setSize({ version: '', text: '' }); video.current?.pause(); audio.current?.pause(); }, [mode]);
  useEffect(() => { audio.current?.pause(); setAt(0); }, [sound, caption]);
  useEffect(() => { video.current?.pause(); }, [version]);
  useEffect(() => {
    if (mode !== 'story' || !video.current) return;
    if (!playing) { video.current.pause(); return; }
    const element = video.current;
    const start = () => { element.currentTime = shot.from; void element.play().catch(() => setPlaying(false)); };
    if (element.readyState >= 1) start(); else element.addEventListener('loadedmetadata', start, { once: true });
    return () => { element.removeEventListener('loadedmetadata', start); };
  }, [mode, playing, shot.from, index]);
  useEffect(() => () => { video.current?.pause(); audio.current?.pause(); }, []);
  return <section aria-label="Работилница: видео с помощ от ИИ" className="my-5 min-w-0 rounded-2xl border academy-border-strong p-4 sm:p-6">
    <h3 className="text-xl font-semibold academy-text">От материал до работещо решение</h3>
    <p className="mt-3 text-sm leading-7 academy-body">Пробвай с предоставени картина, звук и текст. Променяй готовите варианти и разглеждай резултата. Тази работилница е показан пример; самостоятелният казус в урока се проверява отделно.</p>
    {!fixed && <div role="group" aria-label="Избери демонстрация" className="mt-4 flex flex-wrap gap-2">{VIDEO_AI_MODES.map(x => <button key={x.id} type="button" aria-pressed={mode === x.id} onClick={() => setMode(x.id)} className={`rounded-xl border px-3 py-3 text-sm ${mode === x.id ? 'academy-info-border academy-info-bg academy-text' : 'academy-border academy-body'}`}>{x.label}</button>)}</div>}
    {mode === 'story' && <div className="mt-5 space-y-4">
      <p className="text-sm leading-7 academy-body">Бриф: покажи последователността на действието. Разглеждаш фрагменти от един непрекъснат действителен запис. Те не са заснети от курсист и не са четири различни снимачни позиции.</p>
      <label className="block text-sm academy-text">Предоставена ИИ чернова<select value={proposal} onChange={e => setProposal(e.target.value)} className={selectClass}>{proposals.map(x => <option value={x.id} key={x.id}>{x.label}</option>)}</select></label>
      <p className="whitespace-pre-line text-sm leading-7 academy-body">{draft.text}</p>
      <button type="button" onClick={() => { setPlaying(false); setIndex(0); setOrder([...draft.shots]); }} className="rounded-xl border academy-border-strong px-4 py-3 text-sm academy-text">Зареди черновата за сравнение</button>
      <div className="grid gap-3 sm:grid-cols-2">{order.map((value, i) => <label key={i} className="text-sm academy-text">Фрагмент {i + 1}<select value={value} onChange={e => { setPlaying(false); setOrder(current => current.map((id, j) => j === i ? e.target.value : id)); }} className={selectClass}>{VIDEO_AI_SHOTS.map(x => <option key={x.id} value={x.id}>{x.label}</option>)}</select></label>)}</div>
      <video ref={video} key="story" controls playsInline muted preload="metadata" src={`${base}/practical/coffee-machine.mp4`} poster={`${base}/practical/coffee-poster.jpg`} aria-label="Преглед на избраната подредба" className="aspect-video w-full rounded-xl bg-black" onTimeUpdate={e => { if (playing && e.currentTarget.currentTime >= shot.to) { e.currentTarget.pause(); if (index < order.length - 1) setIndex(index + 1); else setPlaying(false); } }} />
      <p role="status" className="text-sm academy-body">Фрагмент {index + 1}: {shot.label} · {shot.from}–{shot.to} сек. от източника.</p>
      <div className="flex flex-wrap gap-3"><button type="button" onClick={() => { setIndex(0); setPlaying(true); if (playing && video.current) { video.current.currentTime = videoAiShot(order[0])!.from; void video.current.play().catch(() => setPlaying(false)); } }} className="rounded-xl academy-primary px-4 py-3 text-sm font-semibold text-white">Пусни подредбата</button><button type="button" onClick={() => { setPlaying(false); video.current?.pause(); }} className="rounded-xl border academy-border px-4 py-3 text-sm academy-body">Спри прегледа</button><button type="button" onClick={() => download('tavora-story-plan.txt', ['Учебна монтажна подредба', draft.text, ...order.map((id, i) => { const x = videoAiShot(id)!; return `${i + 1}. ${x.label}: ${x.from}–${x.to} сек.`; }), 'Това е план по предоставен запис, а не оценка или собствен заснет проект.'].join('\n\n'), 'text/plain;charset=utf-8')} className="rounded-xl border academy-border px-4 py-3 text-sm academy-body">Изтегли избрания план</button></div>
      <p className="text-xs leading-6 academy-muted">Текстовите чернови са подготвени с ИИ за този учебен бриф и са редактирани. Зареждането им не изпраща заявка към външна услуга. Изборът ти променя действителния ред на преглед.</p>
    </div>}
    {mode === 'captions' && <div className="mt-5 space-y-4">
      <p className="text-sm leading-7 academy-body">Слушай точната реплика и сравни текста с нея. Звукът е предоставен синтетичен говор. Трите текста са подготвени учебни варианти, а не записан резултат от CapCut или измерване на точността му.</p>
      <label className="block text-sm academy-text">Вариант на субтитрите<select value={caption} onChange={e => setCaption(e.target.value)} className={selectClass}>{VIDEO_AI_CAPTIONS.map(x => <option key={x.id} value={x.id}>{x.label}</option>)}</select></label>
      <audio ref={audio} key={caption} controls preload="metadata" src={`${base}/closed/voice-clean.mp3`} aria-label="Оригинална учебна реплика за субтитри" className="w-full" onTimeUpdate={e => setAt(e.currentTarget.currentTime)} />
      <div aria-label="Субтитър в текущия момент" className="min-h-24 rounded-xl border academy-border academy-raised p-4 text-center text-lg leading-8 academy-text">{captions.cues.find(x => at >= x.start && at < x.end)?.text || 'В този момент няма избран субтитър.'}</div>
      <ol className="space-y-3 text-sm leading-7 academy-body">{captions.cues.map((x, i) => <li key={i}>{x.start.toFixed(2)}–{x.end.toFixed(2)} сек. · {x.text}</li>)}</ol>
      <p className="text-sm leading-7 academy-body">{captions.note}</p>
      <button type="button" onClick={() => download(`tavora-captions-${caption}.srt`, videoAiSrt(caption)!, 'application/x-subrip;charset=utf-8')} className="rounded-xl academy-primary px-4 py-3 text-sm font-semibold text-white">Изтегли този SRT</button>
    </div>}
    {mode === 'sound' && <div className="mt-5 space-y-4">
      <p className="text-sm leading-7 academy-body">Изслушай входа и различните обработки. Сравнявай при удобна сходна сила: начало, тихи срички, съгласни и края на думите. Невронният вариант не е автоматично най-подходящият.</p>
      <label className="block text-sm academy-text">Звуков вариант<select value={sound} onChange={e => setSound(e.target.value)} className={selectClass}>{sounds.map(x => <option key={x.id} value={x.id}>{x.label}</option>)}</select></label>
      <audio ref={audio} key={sound} controls preload="metadata" src={signal.file} aria-label={`Звуково сравнение: ${signal.label}`} className="w-full" />
      <p className="text-sm leading-7 academy-body">{signal.text}</p>
      <p className="text-sm leading-7 academy-body">Провереният текст е: „Първо провери звука. Доближи микрофона и чуй дали думите се разбират.“ При загубена дума сравни с референтната реплика и се върни към входа.</p>
      <a href={signal.file} download={`tavora-${sound}.mp3`} className="inline-block rounded-xl academy-primary px-4 py-3 text-sm font-semibold text-white">Изтегли предоставения звуков вариант</a>
    </div>}
    {mode === 'gap' && <div className="mt-5 space-y-4">
      <label className="block text-sm academy-text">Предоставен бриф<select value={brief} onChange={e => setBrief(e.target.value)} className={selectClass}><option value="document">Да се вижда как машината действително пълни чашата</option><option value="atmosphere">Атмосферна илюстрация за пауза с кафе</option></select></label>
      <div className="grid min-w-0 gap-4 sm:grid-cols-2"><figure><video controls playsInline muted preload="metadata" src={`${base}/practical/coffee-machine.mp4`} poster={`${base}/practical/coffee-poster.jpg`} aria-label="Действителен предоставен запис" className="aspect-video w-full rounded-xl bg-black" /><figcaption className="mt-2 text-xs leading-6 academy-muted">Действителен запис на Kjetil_r, обществено достояние. Показва конкретното действие.</figcaption></figure><figure><img src={`${base}/ai/generated-coffee.webp`} alt="Предоставена ИИ илюстрация: чаша кафе и различна машина във фон" className="aspect-video w-full rounded-xl object-cover" /><figcaption className="mt-2 text-xs leading-6 academy-muted">Изображение, генерирано с ИИ за курса. Различна чаша и машина; не е доказателство за работата на показания уред.</figcaption></figure></div>
      <label className="block text-sm academy-text">Работен ход<select value={method} onChange={e => setMethod(e.target.value)} className={selectClass}><option value="source">Монтаж с действителния предоставен запис</option><option value="illustration">Използване на означената ИИ илюстрация</option><option value="reshoot">Планиране на нов запис</option></select></label>
      <p role="status" className="text-sm leading-7 academy-body">{method === 'reshoot' ? 'Това е план за нов запис. Такъв файл още не е предоставен и не се показва като готов.' : method === 'illustration' ? 'Избрана е статична синтетична илюстрация. Провери дали брифът допуска илюстрация вместо видимо действие.' : 'Избран е съществуващ действителен запис. Провери точния отрязък, кадрирането и нужната продължителност.'}</p>
      <p className="text-sm leading-7 academy-body">Текущата задача {brief === 'document' ? 'изисква доказващо действие на тази машина.' : 'допуска означена атмосферна илюстрация и не обещава характеристика на конкретен уред.'} Красивият вид е отделен критерий от пригодността за задачата.</p>
    </div>}
    {mode === 'versions' && <div className="mt-5 space-y-4">
      <p className="text-sm leading-7 academy-body">Трите файла са предварително изнесени от еднакъв времеви отрязък. Изборът сменя действителния файл, а не само рамката на страницата. Брифът изисква да се виждат струята и чашата.</p>
      <label className="block text-sm academy-text">Предоставена версия<select value={version} onChange={e => setVersion(e.target.value)} className={selectClass}>{versions.map(x => <option key={x.id} value={x.id}>{x.label}</option>)}</select></label>
      <video ref={video} key={version} controls playsInline muted preload="metadata" src={`${base}/ai/${output.file}`} aria-label={`Преглед на изнесения файл: ${output.label}`} className="mx-auto max-h-[30rem] w-full rounded-xl bg-black object-contain" onLoadedMetadata={e => { const v = e.currentTarget; setSize({ version, text: `${v.videoWidth} × ${v.videoHeight} px · ${v.duration.toFixed(2)} сек.` }); }} />
      <p role="status" className="text-sm font-semibold academy-text">{size.version === version ? size.text : 'Зареждане на действителните свойства…'}</p><p className="text-sm leading-7 academy-body">{output.text}</p>
      <a href={`${base}/ai/${output.file}`} download={`tavora-${output.file}`} className="inline-block rounded-xl academy-primary px-4 py-3 text-sm font-semibold text-white">Изтегли предоставената версия</a>
    </div>}
    <p className="mt-5 border-t academy-border pt-4 text-xs leading-6 academy-muted">Работиш с готови материали и крайни избори. Файловете остават на устройството ти при изтегляне. Тази проба не удостоверява собствено заснемане, работа във външен акаунт или професионална квалификация.</p>
  </section>;
}
