import { useEffect, useId, useRef, useState } from 'react';

export const VIDEO_LAB_KINDS = ['story', 'pacing', 'framing', 'focus', 'exposure', 'white-balance', 'light', 'motion', 'continuity', 'sound', 'sound-cut'] as const;
export type VideoLabKind = typeof VIDEO_LAB_KINDS[number];
export const isVideoLabKind = (value: unknown): value is VideoLabKind => typeof value === 'string' && (VIDEO_LAB_KINDS as readonly string[]).includes(value);
type Variant = { id: string; label: string; observation: string };
type Lab = { title: string; question: string; variants: Variant[]; limit: string };
const labs: Record<VideoLabKind, Lab> = {
  story: { title: 'Какво свързва кадрите?', question: 'Проследи защо човекът приготвя напитката и какво се променя.', variants: [
    { id: 'chronology', label: 'Причина → действие → резултат', observation: 'Празната чаша дава причина. Подготовката и наливането показват действието. Отпиването завършва промяната.' },
    { id: 'missing', label: 'Без решаващото действие', observation: 'Чашата става пълна между два кадъра. За кратка реклама това може да е съзнателно съкращение; за урок по приготвяне липсва съществената стъпка.' },
    { id: 'result-first', label: 'Първо резултатът', observation: 'Отваряме с готовата напитка, после се връщаме към причината и действието. Надписът „Преди това“ означава връщането във времето.' },
  ], limit: 'Схематичен анимиран разказ. Различният ред може да е уместен при различно обещание към зрителя.' },
  pacing: { title: 'Колко време има за разбиране?', question: 'Сравни същите четири момента при различна продължителност.', variants: [
    { id: 'fast', label: 'Всичко минава бързо', observation: 'Смените са на всеки 0,7 секунди. Разпознаваш образи, но важната стъпка и надписът имат малко време.' },
    { id: 'readable', label: 'Време за действието', observation: 'Наливането остава 3,5 секунди. Времето следва работата на кадъра, вместо всяка част да е еднакво кратка.' },
  ], limit: 'Продължителностите са учебни. Подходящото темпо зависи от сложността на действието, текста и аудиторията.' },
  framing: { title: 'Лицето е в кадър. А действието?', question: 'Промени вертикалния изрез. Следи ръцете и чашата.', variants: [
    { id: 'face', label: 'Изрез по лицето', observation: 'Лицето се побира, но ръцете и чашата остават извън вертикалната версия. Изчезва доказващото действие.' },
    { id: 'action', label: 'Изрез по действието', observation: 'Ръцете и чашата се виждат. Ако лицето също е необходимо, трябва по-широка композиция при снимане или отделен план.' },
  ], limit: 'Тъмната част е извън избрания вертикален кадър. Изрязването не може да създаде липсваща информация.' },
  focus: { title: 'Кое трябва да е рязко?', question: 'Избери равнината на фокус за демонстрация на чашата.', variants: [
    { id: 'back', label: 'Фокус върху фона', observation: 'Надписът на стената е рязък, а детайлът върху чашата се губи.' },
    { id: 'front', label: 'Фокус върху предмета', observation: 'Чашата е рязка. В реална проба провери и движението, за да не излезе предметът от използваемата зона.' },
  ], limit: 'Размазването е илюстрация. Реалната дълбочина на рязкост зависи от оптика, разстояния и настройки.' },
  exposure: { title: 'Яркост и запазен детайл', question: 'Следи светлата и тъмната част на чашата.', variants: [
    { id: 'dark', label: 'Твърде тъмно', observation: 'Тъмният детайл е труден за различаване. Повдигането след записа може да разкрие шум; направи проба при снимане.' },
    { id: 'balanced', label: 'Детайл в двата края', observation: 'В този пример се виждат светлият релеф и тъмният знак. Това е целта на сравнението, а не универсална числена настройка.' },
    { id: 'clipped', label: 'Пресветнала светла част', observation: 'В означената област различните светли тонове стават еднакво бели. Потъмняването по-късно не възстановява незаписания релеф.' },
  ], limit: 'Схема на загуба на детайл, не измерване на динамичния диапазон на телефон или камера.' },
  'white-balance': { title: 'Неутралният предмет като ориентир', question: 'Сравни бялата карта и цвета на чашата при три обработки.', variants: [
    { id: 'cool', label: 'Студен оттенък', observation: 'Картата и чашата стават синкави. Ако картата е неутрална под тази светлина, това е повод да провериш баланса на бялото.' },
    { id: 'neutral', label: 'Неутрален ориентир', observation: 'Картата е неутрална в схемата. Провери и истинския цвят на важния предмет; не всяка творческа сцена изисква неутрален вид.' },
    { id: 'warm', label: 'Топъл оттенък', observation: 'Картата и чашата стават жълтеникави. Топлият стил е избор, но не трябва случайно да променя характеристика на продавания предмет.' },
  ], limit: 'Цветовете зависят и от екрана. Демонстрацията сравнява оттенъци, не калибрира устройството.' },
  light: { title: 'Премести светлината', question: 'Наблюдавай лицето, очите и отделянето от фона.', variants: [
    { id: 'back', label: 'Източник зад човека', observation: 'При тази фиксирана експозиция лицето е тъмно. Контражурът може да е художествен избор; за ясно обяснение трябва да решиш осветяването на лицето.' },
    { id: 'side', label: 'Източник отстрани', observation: 'Едната страна е по-светла и формата се чете. Провери дали сенчестото око остава достатъчно видимо за задачата.' },
    { id: 'front', label: 'Източник близо до оста', observation: 'Лицето е по-равномерно осветено. В реална стая размерът, разстоянието и отраженията също променят сенките.' },
  ], limit: 'Схема при фиксирана експозиция. Прозорец, отражател или лампа могат да решат различни части от същия проблем.' },
  motion: { title: 'Движение и време на експозицията', question: 'Пусни топката и сравни следата при една и съща скорост.', variants: [
    { id: 'short', label: 'Кратка експозиция', observation: 'Всеки отделен образ е по-рязък. При възпроизвеждане движението може да изглежда по-насечено.' },
    { id: 'long', label: 'По-дълга експозиция', observation: 'Движещият се предмет оставя по-дълга следа в кадъра. Това не е грешен фокус; неподвижната мишена остава рязка.' },
  ], limit: 'Илюстрация на следата, не симулация на конкретен затвор. При 25 кадъра/секунда 180° съответства на 1/50 секунда; това е отправна точка, не задължителен вид.' },
  continuity: { title: 'От коя страна на оста снимаш?', question: 'Сравни местата на двамата в екрана при смяна на камерата.', variants: [
    { id: 'same', label: 'От същата страна', observation: 'Ива остава отляво, Алекс отдясно. Екранната посока помага да проследиш разговора.' },
    { id: 'cross', label: 'От другата страна', observation: 'Местата се обръщат. Това може да обърка, ако смяната не е установена с движение на камерата, общ план или друга ясна връзка.' },
  ], limit: 'Оста е ориентир за пространствена връзка. Може да се пресича съзнателно, когато зрителят разбира новото положение.' },
  sound: { title: 'Чуй разликата, преди да обработваш', question: 'Слушай едни и същи думи. Започни с ниска сила на устройството.', variants: [
    { id: 'clean', label: 'Референтен сигнал', observation: 'Чува се синтетичният глас без добавените дефекти. Неговият роботизиран тембър не е предмет на сравнението.' },
    { id: 'room', label: 'Добавени отражения', observation: 'Звуците се застъпват по-дълго. При реален запис провери разстоянието до микрофона и стаята, преди да разчиташ само на обработка.' },
    { id: 'noise', label: 'Добавен шум', observation: 'Шумът се конкурира с думите. Само усилване на целия запис повдига и гласа, и шума.' },
    { id: 'clipped', label: 'Ограничени върхове', observation: 'Формата на сигнала е отрязана и се чува изкривяване. Намаляване след това прави дефекта по-тих, но не връща изгубената форма.' },
  ], limit: 'Изкуствено обработен синтетичен глас. Това не са записи на реални микрофони или доказателство за определена марка.' },
  'sound-cut': { title: 'Звукът може да започне преди кадъра', question: 'Пусни варианта и следи кога чуваш репликата спрямо смяната на сцената.', variants: [
    { id: 'sync', label: 'Звук и картина заедно', observation: 'На третата секунда картината и репликата от следващото място започват заедно.' },
    { id: 'early', label: 'Първо следващият звук', observation: 'Репликата започва на втората секунда, а картината се сменя на третата. Това е J-cut: звукът на следващата сцена въвежда прехода.' },
  ], limit: 'Синтетична реплика и схематична картина. При L-cut звукът от предишната сцена продължава върху следващата картина.' },
};

const button = 'rounded-lg border px-3 py-2 text-sm leading-5 transition focus:outline-none focus:ring-2 focus:ring-red-300';
function Cup({ x = 210, y = 192, full = true }: { x?: number; y?: number; full?: boolean }) {
  return <g transform={`translate(${x} ${y})`}><ellipse cy="54" rx="57" ry="10" fill="#000" opacity=".16" /><path d="M31 4h22c28 0 24 37 0 37H38" fill="none" stroke="#eee4cd" strokeWidth="10" /><path d="M-43 0H43L35 49Q0 65 -35 49Z" fill="#f2ead7" /><ellipse rx="43" ry="10" fill="#d3c6ac" /><ellipse rx="35" ry="6" fill={full ? '#5d3627' : '#f8f3e6'} /><path d="M-25 17v22M-16 18v22M-7 19v22" stroke="#d4c5a8" strokeWidth="3" /><text x="12" y="37" textAnchor="middle" fontSize="15" fill="#3c453e">T</text></g>;
}
function Person({ x, name, color = '#de9f81' }: { x: number; name?: string; color?: string }) {
  return <g transform={`translate(${x} 0)`}><path d="M-39 234V171Q0 139 39 171V234" fill="#697e79" /><ellipse cy="122" rx="27" ry="36" fill={color} /><path d="M-28 115Q-24 75 15 85Q36 92 27 111L5 99Z" fill="#3a2a28" /><circle cx="-9" cy="122" r="2.5" fill="#352e2d" /><circle cx="10" cy="122" r="2.5" fill="#352e2d" /><path d="M-9 139Q0 145 9 139" fill="none" stroke="#683e35" strokeWidth="2" />{name && <text y="269" textAnchor="middle" fill="#f4eee0" fontSize="17">{name}</text>}</g>;
}
function Graphic({ kind, variant, second, duration, id }: { kind: VideoLabKind; variant: string; second: number; duration: number; id: string }) {
  const order = kind === 'story' && variant === 'missing' ? [0, 1, 3] : kind === 'story' && variant === 'result-first' ? [3, 0, 1, 2] : [0, 1, 2, 3];
  const ends = kind === 'pacing' && variant === 'readable' ? [1.5, 3, 6.5, 9] : order.map((_, i) => (i + 1) * duration / order.length);
  const frameIndex = Math.min(ends.findIndex(end => second < end) < 0 ? order.length - 1 : ends.findIndex(end => second < end), order.length - 1);
  const frame = order[frameIndex];
  const story = kind === 'story' || kind === 'pacing';
  const framingX = variant === 'face' ? 345 : 152;
  return <svg viewBox="0 0 560 330" role="img" aria-label={`${labs[kind].title} — ${labs[kind].variants.find(v => v.id === variant)?.label}`} className="block h-auto w-full rounded-xl bg-[#26332f]">
    <defs>
      <filter id={`${id}-blur`}><feGaussianBlur stdDeviation="5" /></filter>
      <linearGradient id={`${id}-side`}><stop stopColor="#f4c99c" /><stop offset=".53" stopColor="#a57560" /><stop offset="1" stopColor="#473b37" /></linearGradient>
      <linearGradient id={`${id}-motion`}><stop stopColor="#ed554a" stopOpacity="0" /><stop offset="1" stopColor="#ed554a" /></linearGradient>
    </defs>
    <rect width="560" height="330" rx="12" fill="#2d3c36" />
    {story ? <>
      <rect y="230" width="560" height="100" fill="#8c6c4e" /><rect x="48" y="50" width="130" height="100" rx="3" fill="#94aaa0" /><path d="M113 50v100M48 100h130" stroke="#dbe0c6" strokeWidth="8" />
      <Person x={418} /><Cup x={280} y={208} full={frame >= 2} />
      {frame === 0 && <path d="M390 162L312 199" stroke="#de9f81" strokeWidth="18" strokeLinecap="round" />}
      {frame === 1 && <><path d="M392 172L355 116" stroke="#de9f81" strokeWidth="18" strokeLinecap="round" /><rect x="300" y="87" width="57" height="64" rx="7" fill="#8ca19c" /><path d="M300 112l-17 12 17 15" fill="#8ca19c" /></>}
      {frame === 2 && <><g transform="translate(302 112) rotate(-27)"><rect x="0" y="0" width="57" height="64" rx="7" fill="#8ca19c" /><path d="M0 25l-17 12 17 15" fill="#8ca19c" /></g><path d="M294 157Q270 169 280 208" stroke="#ad7f55" strokeWidth="7" fill="none" /><path d="M392 169L349 126" stroke="#de9f81" strokeWidth="18" strokeLinecap="round" /></>}
      {frame === 3 && <><rect x="220" y="197" width="125" height="87" fill="#8c6c4e" /><g transform="translate(420 145) scale(.65)"><Cup x={0} y={0} /></g><path d="M383 178l26-14" stroke="#de9f81" strokeWidth="14" strokeLinecap="round" /></>}
      <rect x="18" y="281" width="524" height="34" rx="5" fill="#111c18" /><text x="280" y="305" textAnchor="middle" fill="#f5eedb" fontSize="17">{variant === 'result-first' && frameIndex === 1 ? 'Преди това: ' : ''}{['Празната чаша', 'Подготовката', 'Наливането', 'Човекът отпива'][frame]}</text>
    </> : kind === 'light' ? <>
      <rect x={variant === 'side' ? 46 : variant === 'back' ? 216 : 400} y="35" width="75" height="99" rx="4" fill="#fff5c5" opacity=".95" />
      <g transform="translate(280 15) scale(1.5)"><Person x={0} color={variant === 'back' ? '#504439' : variant === 'side' ? `url(#${id}-side)` : '#edc39d'} /></g>
    </> : kind === 'continuity' ? <>
      <Person x={variant === 'same' ? 175 : 385} name="Ива" /><Person x={variant === 'same' ? 385 : 175} name="Алекс" color="#c29b78" /><path d="M230 143h100" stroke="#e9dcc5" strokeDasharray="7 5" /><text x="280" y="47" fill="#e9dcc5" textAnchor="middle" fontSize="15">{variant === 'same' ? 'Камера от първата страна на оста' : 'Камера от другата страна на оста'}</text>
    </> : kind === 'motion' ? <>
      <path d="M58 226H502M280 80v180" stroke="#c4cbbc" strokeWidth="2" strokeDasharray="7 7" /><text x="280" y="58" textAnchor="middle" fill="#e9dcc5" fontSize="16">Неподвижна мишена</text>
      <g transform={`translate(${70 + (Math.floor(second * 25) / 25 % 3) / 3 * 420} 169)`}>{variant === 'long' && <rect x="-67" y="-23" width="67" height="46" rx="23" fill={`url(#${id}-motion)`} />}<circle r="23" fill="#ed554a" /></g>
    </> : kind === 'sound-cut' ? <>
      <rect width="560" height="330" fill={second < 3 ? '#526b5e' : '#705b48'} />{second < 3 ? <><rect x="208" y="65" width="145" height="210" rx="4" fill="#bbb296" /><circle cx="325" cy="175" r="5" fill="#484535" /><text x="280" y="39" textAnchor="middle" fill="white" fontSize="18">Пред вратата</text></> : <><Person x={280} /><text x="280" y="39" textAnchor="middle" fill="white" fontSize="18">В работилницата</text></>}
      <text x="280" y="306" textAnchor="middle" fill="#f4eedf" fontSize="15">Смяна на картината: 00:03</text>
    </> : <>
      <g filter={kind === 'focus' && variant === 'front' ? `url(#${id}-blur)` : undefined}><rect x="57" y="37" width="172" height="86" rx="4" fill="#79958b" /><text x="143" y="90" textAnchor="middle" fill="#e3e8d7" fontSize="23">РАБОТНА МАСА</text></g>
      <rect y="235" width="560" height="95" fill="#947353" />
      <g filter={kind === 'focus' && variant === 'back' ? `url(#${id}-blur)` : undefined}><Person x={420} /><path d="M389 179L272 218" stroke="#de9f81" strokeWidth="18" strokeLinecap="round" /><Cup x={220} y={220} />
      <rect x="60" y="181" width="66" height="42" fill="#f0eee7" /><text x="93" y="209" fontSize="13" textAnchor="middle" fill="#545652">карта</text></g>
      {kind === 'exposure' && variant === 'dark' && <rect width="560" height="330" fill="#050c09" opacity=".76" />}
      {kind === 'exposure' && variant === 'clipped' && <><rect width="560" height="330" fill="white" opacity=".27" /><path d="M177 220H263L255 269Q220 285 185 269Z" fill="white" /><path d="M169 203v-12h105v12M169 279v12h105v-12" stroke="#ed554a" strokeWidth="2" fill="none" /></>}
      {kind === 'white-balance' && variant !== 'neutral' && <rect width="560" height="330" fill={variant === 'cool' ? '#3475d1' : '#df9623'} opacity=".3" style={{ mixBlendMode: 'color' }} />}
      {kind === 'framing' && <><rect width={framingX} height="330" fill="#040b09" opacity=".8" /><rect x={framingX + 158} width={560 - framingX - 158} height="330" fill="#040b09" opacity=".8" /><rect x={framingX} y="25" width="158" height="280" fill="none" stroke="#ff6658" strokeWidth="3" /><text x={framingX + 79} y="19" textAnchor="middle" fill="#fff" fontSize="13">Вертикален изрез 9:16</text></>}
    </>}
  </svg>;
}

export default function VideoDecisionLab({ kind = 'story' }: { kind?: VideoLabKind }) {
  const lab = labs[kind];
  const [variant, setVariant] = useState(lab.variants[0].id);
  const [second, setSecond] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);
  const id = useId().replaceAll(':', '');
  const isAudio = kind === 'sound' || kind === 'sound-cut';
  const animated = ['story', 'pacing', 'motion'].includes(kind);
  const duration = kind === 'pacing' ? variant === 'fast' ? 2.8 : 9 : kind === 'motion' ? 6 : 8;
  const selected = lab.variants.find(v => v.id === variant) || lab.variants[0];
  useEffect(() => { setVariant(labs[kind].variants[0].id); setSecond(0); setPlaying(false); setAudioError(false); }, [kind]);
  useEffect(() => {
    if (!playing || !animated) return;
    let previous = performance.now();
    const timer = window.setInterval(() => { const now = performance.now(); const delta = (now - previous) / 1000; previous = now;
      setSecond(value => { const next = Math.min(duration, value + delta); if (next >= duration) setPlaying(false); return next; });
    }, 50);
    return () => window.clearInterval(timer);
  }, [playing, animated, duration]);
  const change = (value: string) => { audio.current?.pause(); setVariant(value); setSecond(0); setPlaying(false); setAudioError(false); };
  const audioSrc = `/academy-labs/perfect-video/closed/${kind === 'sound' ? 'voice' : 'cut'}-${selected.id}.mp3`;
  return <section aria-label={lab.title} className="my-6 overflow-hidden rounded-2xl border academy-border-strong academy-surface">
    <div className="border-b academy-border p-5 sm:p-6"><p className="text-xs font-semibold uppercase tracking-widest academy-accent">Промени избора · наблюдавай резултата</p><h3 className="mt-2 text-xl font-semibold academy-text">{lab.title}</h3><p className="mt-2 text-sm leading-6 academy-body">{lab.question}</p></div>
    <div className="p-4 sm:p-6">
      <div role="group" aria-label="Вариант на демонстрацията" className="mb-5 flex flex-wrap gap-2">{lab.variants.map(item => <button key={item.id} type="button" aria-pressed={selected.id === item.id} onClick={() => change(item.id)} className={`${button} ${selected.id === item.id ? 'academy-accent-border academy-accent-bg academy-text' : 'academy-border-strong academy-body hover:academy-border-strong'}`}>{item.label}</button>)}</div>
      {kind !== 'sound' && <Graphic kind={kind} variant={selected.id} second={second} duration={duration} id={id} />}
      {animated && <div className="mt-4 flex flex-wrap items-center gap-3"><button type="button" className={`${button} academy-border-strong academy-text`} onClick={() => { if (second >= duration) setSecond(0); setPlaying(value => !value); }}>{playing ? 'Пауза' : second >= duration ? 'Пусни отново' : 'Пусни сцената'}</button><button type="button" className={`${button} academy-border-strong academy-text`} onClick={() => { setPlaying(false); setSecond(value => Math.min(duration, value + (kind === 'pacing' && variant === 'readable' ? 1.5 : duration / (kind === 'story' && variant === 'missing' ? 3 : 4)))); }}>Следващ момент</button><button type="button" className={`${button} academy-border-strong academy-body`} onClick={() => { setPlaying(false); setSecond(0); }}>Отначало</button><span className="font-mono text-sm academy-muted" aria-label="Време">{second.toFixed(1)} / {duration.toFixed(1)} s</span></div>}
      {isAudio && <div className="mt-4"><audio key={audioSrc} ref={audio} controls preload="none" src={audioSrc} className="w-full" onError={() => setAudioError(true)} onTimeUpdate={event => setSecond(event.currentTarget.currentTime)} aria-label={selected.label} /><p className="mt-3 text-sm leading-6 academy-muted">Текст на синтетичния запис: „Първо провери звука. Доближи микрофона и чуй дали думите се разбират.“</p>{audioError && <p role="alert" className="mt-3 text-sm academy-warning">Звукът не се зареди. Опитай отново при връзка с интернет. Описанието по-долу остава достъпно.</p>}</div>}
      <p aria-live="polite" className="mt-5 border-l-2 academy-accent-border pl-4 text-base leading-7 academy-text">{selected.observation}</p>
      <p className="mt-4 text-xs leading-5 academy-muted">{lab.limit}</p>
    </div>
  </section>;
}

export const videoLabTitle = (kind: VideoLabKind) => labs[kind].title;

/** Controlled preview for a saved, graded studio choice; no second answer state. */
export function VideoPracticeGraphic({ kind, variant }: { kind: VideoLabKind; variant: string }) {
  const id = useId().replaceAll(':', '');
  return <Graphic kind={kind} variant={variant} second={1} duration={6} id={id} />;
}
