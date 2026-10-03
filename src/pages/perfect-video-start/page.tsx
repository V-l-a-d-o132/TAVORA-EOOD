import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { VIDEO_PRACTICE_VERSION, VIDEO_SAMPLE_REPORT, VIDEO_SOURCES, VIDEO_START_TERMS, VIDEO_STUDY_CASES } from '@/data/perfect-video-start';
import { buildVideoTimeline, checkVideoTimeline, drawVideoFrame, emptyVideoPlan, fileChecks, inspectVideoFile, recordVideoTimeline, videoStoryboardCsv, type VideoCheck, type VideoFileMetadata, type VideoPlan } from '@/lib/perfect-video-practice';

const fieldClass = 'mt-2 w-full rounded-xl border border-white/20 bg-[#15191d] px-4 py-3 text-base text-white focus:outline-none focus:ring-2 focus:ring-red-400';
const buttonClass = 'rounded-xl bg-red-500 px-5 py-3 font-semibold text-white focus:outline-none focus:ring-2 focus:ring-red-300 disabled:cursor-not-allowed disabled:opacity-40';
const linkClass = 'text-red-300 underline decoration-red-400/50 underline-offset-4 hover:text-red-200';
const outlineClass = 'rounded-xl border border-white/20 px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 disabled:opacity-40';
function download(name: string, data: string | Blob, mime = 'text/plain;charset=utf-8') {
  const url = URL.createObjectURL(typeof data === 'string' ? new Blob([data], { type: mime }) : data);
  const anchor = document.createElement('a'); anchor.href = url; anchor.download = name; anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function CheckList({ checks }: { checks: VideoCheck[] }) {
  return <ul className="space-y-3">{checks.map(check => <li key={check.id} className={`rounded-xl border p-4 ${check.passed ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-amber-400/30 bg-amber-400/5'}`}><p className="font-medium">{check.passed ? 'Преминато' : 'Нужна е поправка'}: {check.label}</p>{!check.passed && <p className="mt-2 text-sm leading-6 text-zinc-300">{check.help}</p>}</li>)}</ul>;
}

export default function PerfectVideoStartPage() {
  const [caseIndex, setCaseIndex] = useState(0);
  const study = VIDEO_STUDY_CASES[caseIndex];
  const [plan, setPlan] = useState<VideoPlan>(emptyVideoPlan);
  const [second, setSecond] = useState(0);
  const [checks, setChecks] = useState<VideoCheck[] | null>(null);
  const [verified, setVerified] = useState<string[]>([]);
  const [example, setExample] = useState(false);
  const [error, setError] = useState('');
  const [recording, setRecording] = useState(false);
  const [recordedSecond, setRecordedSecond] = useState(0);
  const [clip, setClip] = useState<{ blob: Blob; url: string } | null>(null);
  const [metadata, setMetadata] = useState<VideoFileMetadata | null>(null);
  const [inspecting, setInspecting] = useState(false);
  const [review, setReview] = useState({ facts: false, readable: false, rights: false, result: false });
  const canvas = useRef<HTMLCanvasElement>(null);
  const abort = useRef<AbortController | null>(null);
  const fileRevision = useRef(0);
  const alive = useRef(true);
  const timeline = useMemo(() => buildVideoTimeline(study, plan), [study, plan]);
  const passed = !!checks?.every(check => check.passed);

  useEffect(() => { const ctx = canvas.current?.getContext('2d'); if (ctx) drawVideoFrame(ctx, timeline, second); }, [timeline, second]);
  useEffect(() => () => { if (clip) URL.revokeObjectURL(clip.url); }, [clip]);
  useEffect(() => { const revisionCounter = fileRevision; alive.current = true; return () => { alive.current = false; revisionCounter.current++; abort.current?.abort(); }; }, []);

  const change = (key: keyof VideoPlan, value: string) => {
    fileRevision.current++; setMetadata(null); setInspecting(false); setChecks(null); setClip(null); setError(''); setExample(false); setReview({ facts: false, readable: false, rights: false, result: false });
    setVerified(previous => previous.filter(id => id !== study.id)); setPlan(previous => ({ ...previous, [key]: value })); setSecond(0);
  };
  const run = () => { const result = checkVideoTimeline(study, timeline); setChecks(result); setExample(true); if (result.every(check => check.passed)) setVerified(previous => [...new Set([...previous, study.id])]); };
  const chooseCase = (index: number) => { fileRevision.current++; setCaseIndex(index); setPlan(emptyVideoPlan()); setChecks(null); setClip(null); setMetadata(null); setInspecting(false); setSecond(0); setExample(false); setError(''); setReview({ facts: false, readable: false, rights: false, result: false }); };

  const record = async () => {
    if (!passed || recording) return;
    const controller = new AbortController(); abort.current = controller;
    fileRevision.current++; setInspecting(false); setReview({ facts: false, readable: false, rights: false, result: false });
    setRecording(true); setRecordedSecond(0); setError(''); setClip(null); setMetadata(null);
    try {
      const blob = await recordVideoTimeline(timeline, controller.signal, value => { if (alive.current) setRecordedSecond(value); });
      if (!alive.current) return;
      setClip({ blob, url: URL.createObjectURL(blob) });
    } catch (cause) { if (alive.current) setError(cause instanceof Error ? cause.message : 'Записът не завърши.'); }
    finally { if (alive.current) setRecording(false); abort.current = null; }
  };
  const inspect = async (file: File) => {
    const revision = ++fileRevision.current; setInspecting(true); setMetadata(null); setError(''); setReview({ facts: false, readable: false, rights: false, result: false });
    try { const value = await inspectVideoFile(file); if (alive.current && revision === fileRevision.current) setMetadata(value); }
    catch (cause) { if (alive.current && revision === fileRevision.current) setError(cause instanceof Error ? cause.message : 'Файлът не се отвори.'); }
    finally { if (alive.current && revision === fileRevision.current) setInspecting(false); }
  };
  const report = () => download(`tavora-video-${study.id}-checks.json`, JSON.stringify({ version: VIDEO_PRACTICE_VERSION, case: study.id, checkedAt: new Date().toISOString(), timeline, automatedChecks: checks, fileMetadata: metadata, fileChecks: metadata ? fileChecks(metadata) : null, selfReview: review, scope: 'Авторски проверки на ограничен учебен сценарий; графика без говор и музика. Самопроверката е отбелязана от учащия. Не удостоверява камера, микрофон, всички кодеци, творческо качество, виралност, клиент или продажби.' }, null, 2), 'application/json;charset=utf-8');
  const packet = () => download(`tavora-video-${study.id}-packet.txt`, ['ИЗМИСЛЕН УЧЕБЕН БИЗНЕС — версия ' + VIDEO_PRACTICE_VERSION, study.name + ' · ' + study.place, study.question, '', 'Утвърдени условия', ...study.facts, '', 'Предварително написани учебни реакции — не са клиентски изследвания', ...study.reactions, '', VIDEO_SAMPLE_REPORT.source, VIDEO_SAMPLE_REPORT.meaning, 'Версия | Период | Започнати гледания | Посещения | Съобщения | Подходящи запитвания | Поръчки', ...VIDEO_SAMPLE_REPORT.rows.map(row => `${row.version} | ${row.period} | ${row.views} | ${row.visits} | ${row.messages} | ${row.suitable} | ${row.orders}`), VIDEO_SAMPLE_REPORT.task, '', 'Граница на материала', 'Графиките са учебна схема. За реално заснемане използвай свои предмети и разрешени кадри; не показвай лица, контакти или музика без основание.'].join('\n'));

  return <main className="min-h-screen bg-[#090b10] text-zinc-100">
    <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-12">
      <Link to="/kurs" className={`text-sm ${linkClass}`}>Обратно към Академията</Link>
      <header className="mb-10 mt-8 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[.15em] text-red-300">Перфектното видео · първи проект</p>
        <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">От една идея до проверен файл</h1>
        <p className="mt-5 text-lg leading-8 text-zinc-300">Ще избереш честно начало, ще подредиш фактите в 25 секунди и ще провериш дали клипът изпълнява конкретното задание. После ще приложиш решенията към различен бизнес.</p>
        <p className="mt-4 text-sm leading-7 text-zinc-400">Работи без покупка, карта, външен AI акаунт или човешки оценител. Бизнесите, реакциите и отчетът са измислени. Първата версия е обозначена графика без говор и музика; тя не доказва умение за снимане на реален продукт.</p>
      </header>
      <nav aria-label="Първи видео проект" className="mb-10 flex flex-wrap gap-x-6 gap-y-3 text-sm">{[['packet', '1. Прочети заданието'], ['project', '2. Подреди клипа'], ['result', '3. Провери и изнеси'], ['file', '4. Отвори файла']].map(([id, label]) => <a key={id} href={`#${id}`} className={linkClass}>{label}</a>)}</nav>

      <section id="packet" className="scroll-mt-6 border-t border-white/10 pt-8">
        <h2 className="text-2xl font-semibold">Прочети заданието</h2>
        <p className="mt-3 leading-7"><span className="font-semibold">{study.name} · {study.place}.</span> {study.question}</p>
        <div className="mt-5 grid gap-6 sm:grid-cols-2"><div><h3 className="font-semibold">Утвърдени условия</h3><ul className="mt-3 list-disc space-y-3 pl-5 text-sm leading-7 text-zinc-300">{study.facts.map(fact => <li key={fact}>{fact}</li>)}</ul></div><div><h3 className="font-semibold">Учебни реакции</h3><p className="mt-2 text-sm leading-6 text-zinc-400">Готови реплики за упражнение, не истински интервюта или представителна извадка.</p><ul className="mt-3 space-y-3">{study.reactions.map(reaction => <li key={reaction} className="border-l-2 border-red-400/40 pl-4 text-sm leading-7">„{reaction}“</li>)}</ul></div></div>
        <button type="button" className={`mt-5 ${outlineClass}`} onClick={packet}>Изтегли учебната папка като текст</button>
        <details className="mt-6 rounded-xl border border-white/10 p-5"><summary className="cursor-pointer font-semibold">Три начина да изпълниш проекта</summary><div className="mt-4 space-y-4 text-sm leading-7 text-zinc-300"><p><strong className="text-white">С телефон:</strong> заснеми свои {study.count} предмета на маса по плана. Те могат да бъдат жетони или листчета. Не представяй заместителя като истински продукт на учебния бизнес.</p><p><strong className="text-white">Смесен материал:</strong> комбинирай собствен запис и надписи. Ако използваш AI или чужд материал, провери фактите, разрешената употреба и дали зрителят няма да го възприеме като реално доказателство.</p><p><strong className="text-white">Графика:</strong> изборите по-долу създават учебна версия. Можеш да я запишеш като видео, ако браузърът поддържа това, или да изнесеш плана в редактор, който вече имаш. Не е необходим AI.</p></div></details>
        <details className="mt-6 rounded-xl border border-white/10 p-5"><summary className="cursor-pointer font-semibold">Учебен отчет: повече гледания не означава повече поръчки</summary><p className="mt-4 text-sm leading-7 text-zinc-300">{VIDEO_SAMPLE_REPORT.source}</p><p className="mt-3 text-sm leading-7 text-zinc-300">{VIDEO_SAMPLE_REPORT.meaning}</p><div className="mt-4 overflow-x-auto"><table className="w-full min-w-[620px] text-left text-sm"><caption className="mb-3 text-left text-xs text-zinc-400">Измислени числа за сметка; не са реални продажби или платформен експорт.</caption><thead className="border-b border-white/15 text-zinc-300"><tr>{['Версия / период', 'Гледания', 'Посещения', 'Съобщения', 'Подходящи запитвания', 'Поръчки'].map(label => <th key={label} scope="col" className="px-3 py-3">{label}</th>)}</tr></thead><tbody>{VIDEO_SAMPLE_REPORT.rows.map(row => <tr key={row.version} className="border-b border-white/10"><th scope="row" className="px-3 py-3 font-medium">{row.version} / {row.period}</th>{[row.views, row.visits, row.messages, row.suitable, row.orders].map((value, index) => <td key={index} className="px-3 py-3">{value}</td>)}</tr>)}</tbody></table></div><p className="mt-4 text-sm leading-7">{VIDEO_SAMPLE_REPORT.task}</p><details className="mt-4 text-sm leading-7"><summary className="cursor-pointer text-red-300">Свери сметката след своя опит</summary><p className="mt-3 text-zinc-300">{VIDEO_SAMPLE_REPORT.solution}</p></details></details>
        <details className="mt-4 rounded-xl border border-white/10 p-5"><summary className="cursor-pointer font-semibold">Понятията с прости думи</summary><dl className="mt-4 grid gap-5 sm:grid-cols-2">{VIDEO_START_TERMS.map(([term, description]) => <div key={term}><dt className="font-semibold">{term}</dt><dd className="mt-1 text-sm leading-7 text-zinc-300">{description}</dd></div>)}</dl></details>
      </section>

      <section id="project" className="mt-12 scroll-mt-6 border-t border-white/10 pt-8">
        <h2 className="text-2xl font-semibold">Подреди клипа</h2><p className="mt-3 max-w-3xl leading-7 text-zinc-300">Изборите променят същата графика, която ще се запише като файл. Направи собствен опит, прегледай различни секунди и използвай проверката за конкретна поправка.</p>
        <fieldset disabled={recording} className="mt-6 grid gap-5 sm:grid-cols-2 disabled:opacity-60">
          <legend className="sr-only">Условия за твоята версия</legend>
          <label>Колко броя показваш?<input inputMode="numeric" maxLength={2} value={plan.count} onChange={event => change('count', event.target.value)} className={fieldClass} /></label>
          <label>Каква цена показваш в евро?<input inputMode="decimal" maxLength={12} value={plan.price} onChange={event => change('price', event.target.value)} className={fieldClass} /></label>
          <label>Източник на цената<select value={plan.source} onChange={event => change('source', event.target.value)} className={fieldClass}><option value="">Избери</option><option value="old">Старата бележка</option><option value="current">Утвърдените условия от 03.10.2026 г.</option><option value="reaction">Желанието в учебната реакция</option></select></label>
          <label>Начало на клипа<select value={plan.hook} onChange={event => change('hook', event.target.value)} className={fieldClass}><option value="">Избери</option><option value="logo">Само представяне на името</option><option value="question">Конкретен въпрос за съдържанието</option><option value="miracle">Гарантирано повече поръчки</option></select></label>
          <label>Условие за получаване<select value={plan.receiving} onChange={event => change('receiving', event.target.value)} className={fieldClass}><option value="">Избери</option><option value="pickup">Вземане от обекта</option><option value="free">Безплатна доставка</option><option value="clarify">Получаването се уточнява отделно</option></select></label>
          <label>Последно действие<select value={plan.action} onChange={event => change('action', event.target.value)} className={fieldClass}><option value="">Избери</option><option value="buy">Купи с гарантирано получаване</option><option value="ask">Попитай за наличност и получаване</option></select></label>
          <label>Палитра<select value={plan.palette} onChange={event => change('palette', event.target.value)} className={fieldClass}><option value="cream">Кремав фон с тъмен текст</option><option value="dark">Тъмен фон със светъл текст</option><option value="washed">Кремав фон с много блед текст</option></select></label>
          <label>Формат<select value={plan.format} onChange={event => change('format', event.target.value)} className={fieldClass}><option value="vertical">Вертикален 9:16</option><option value="horizontal">Хоризонтален 16:9</option></select></label>
          <label>Продължителност<select value={plan.seconds} onChange={event => change('seconds', event.target.value)} className={fieldClass}><option value="20">20 секунди</option><option value="25">25 секунди</option><option value="35">35 секунди</option></select></label>
        </fieldset>
        <div className="mt-8 grid gap-7 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div><h3 className="font-semibold">Твоята версия</h3><canvas ref={canvas} width={timeline.width / 2} height={timeline.height / 2} className="mx-auto mt-4 block max-h-[560px] w-auto max-w-full rounded-xl border border-white/10" role="img" aria-label={`Учебна графика: ${timeline.name}, секунда ${second}`} /><label className="mt-4 block text-sm">Преглед на секунда {second.toFixed(1)}<input type="range" min="0" max={timeline.seconds} step="0.1" value={second} onChange={event => setSecond(Number(event.target.value))} className="mt-3 w-full accent-red-500" /></label><p className="mt-3 text-sm leading-6 text-zinc-400">Графиката е без говор и музика. Надписите носят смисъла; това не е микрофонен тест.</p></div>
          <div><h3 className="font-semibold">План на същия клип</h3><ol className="mt-4 space-y-4">{timeline.scenes.map(scene => <li key={scene.id} className="rounded-xl border border-white/10 p-4"><p className="text-xs text-red-300">{scene.start.toFixed(1)}–{scene.end.toFixed(1)} секунди</p><p className="mt-2 font-medium">{scene.title}</p><p className="mt-2 text-sm leading-6 text-zinc-300">{scene.lines.join(' · ')}{scene.shownItems > 0 && ` · Видими предмети: ${scene.shownItems}`}</p></li>)}</ol></div>
        </div>
      </section>

      <section id="result" className="mt-12 scroll-mt-6 border-t border-white/10 pt-8">
        <h2 className="text-2xl font-semibold">Провери и изнеси</h2><p className="mt-3 max-w-3xl leading-7 text-zinc-300">Проверката сверява съдържанието, източника, получаването, изпълнимото обещание, времето и контраста. Не оценява творчески вкус и не предсказва успех на публикация.</p>
        <button type="button" disabled={recording} className={`mt-5 ${buttonClass}`} onClick={run}>Провери моята версия</button>
        {checks && <div className="mt-5" aria-live="polite"><CheckList checks={checks} /></div>}
        {example && <details className="mt-5 rounded-xl border border-white/10 p-5"><summary className="cursor-pointer font-semibold">Примерно решение след собствения опит</summary><p className="mt-3 text-sm leading-7 text-zinc-300">За {study.name}: {study.count} {study.unit}, {study.price} €, актуални условия, конкретен въпрос, {study.receiving === 'pickup' ? 'вземане от обекта' : 'отделно уточняване на получаването'}, запитване за наличност, четим текст и 25 секунди в 9:16. Това е едно ограничено решение на брифа, не единственият добър творчески вариант.</p></details>}
        {passed && <p role="status" className="mt-5 text-sm leading-7 text-emerald-200">Планът покрива проверените условия. След експорта отвори самия файл; успешен план не удостоверява успешен запис.</p>}
        <div className="mt-6 flex flex-wrap gap-3"><button type="button" className={outlineClass} onClick={() => download(`tavora-video-${study.id}-storyboard.csv`, videoStoryboardCsv(timeline), 'text/csv;charset=utf-8')}>Изтегли сценария като CSV</button><button type="button" disabled={!checks || recording} className={outlineClass} onClick={report}>Изтегли протокола</button><button type="button" disabled={!passed || recording} className={buttonClass} onClick={() => void record()}>Запиши графичната версия като видео</button></div>
        <p className="mt-3 text-sm leading-7 text-zinc-400">Записът отнема около 25 секунди. Дръж раздела отворен. Браузърът избира поддържан MP4 или WebM; записът може да откаже според устройството. Тогава използвай CSV плана в своя редактор.</p>
        {recording && <div role="status" className="mt-4"><p>Запис: {recordedSecond.toFixed(1)} / {timeline.seconds} секунди</p><button type="button" className={`mt-3 ${outlineClass}`} onClick={() => abort.current?.abort()}>Прекрати записа</button></div>}
        {clip && <div className="mt-6"><h3 className="font-semibold">Действително полученият видеофайл</h3><video controls preload="metadata" src={clip.url} className="mt-4 max-h-[560px] w-full max-w-sm rounded-xl" aria-label="Твоята записана графична версия" /><div className="mt-4 flex flex-wrap gap-3"><button type="button" className={outlineClass} onClick={() => download(`tavora-video-${study.id}.${clip.blob.type.includes('mp4') ? 'mp4' : 'webm'}`, clip.blob)}>Изтегли видеофайла</button><button type="button" disabled={inspecting} className={outlineClass} onClick={() => void inspect(new File([clip.blob], `graphic.${clip.blob.type.includes('mp4') ? 'mp4' : 'webm'}`, { type: clip.blob.type }))}>Провери получения файл</button></div><p className="mt-3 text-sm leading-7 text-zinc-400">Това е графична учебна версия. Няма заснет продукт, микрофонен запис или реален клиентски резултат.</p></div>}
        {error && <p role="alert" className="mt-4 text-amber-200">{error}</p>}
      </section>

      <section id="file" className="mt-12 scroll-mt-6 border-t border-white/10 pt-8">
        <h2 className="text-2xl font-semibold">Отвори файла, преди да го предадеш</h2><p className="mt-3 max-w-3xl leading-7 text-zinc-300">Можеш да избереш собствен MP4 или WebM до 100 MB. Файлът остава на устройството — не се качва в Академията. Браузърът отчита само наличните размери и време, не всички кодеци или качество.</p>
        <label className="mt-5 block text-sm">Избери собствен видеофайл<input type="file" accept="video/*" disabled={recording || inspecting} className="mt-3 block w-full text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-zinc-800 file:px-4 file:py-3 file:text-white" onChange={event => { const file = event.target.files?.[0]; if (file) void inspect(file); }} /></label>
        {inspecting && <p role="status" className="mt-4">Отваряне на файла…</p>}
        {metadata && <div className="mt-5"><p className="mb-3 break-words text-sm text-zinc-300">Отчетени свойства на {metadata.name || 'избрания файл'}: {metadata.width} × {metadata.height} · {metadata.seconds === null ? 'времето не е отчетено' : `${metadata.seconds.toFixed(2)} секунди`} · {(metadata.bytes / 1024 / 1024).toFixed(2)} MB</p><CheckList checks={fileChecks(metadata)} /></div>}
        <fieldset className="mt-6 space-y-3"><legend className="mb-3 font-semibold">Самопроверка — отбелязана от теб, не машинна оценка</legend>{([
          ['facts', 'Сверих броя, цената, получаването и действието с актуалните условия.'],
          ['readable', 'Прегледах без звук на малък екран; текстът се чете и не е закрит.'],
          ['rights', 'Имам основание за използваните материали; учебната графика е обозначена.'],
          ['result', 'Не представям този клип като доказателство за виралност, клиент или продажби.'],
        ] as const).map(([key, label]) => <label key={key} className="flex gap-3 text-sm leading-7"><input type="checkbox" checked={review[key]} onChange={event => setReview(previous => ({ ...previous, [key]: event.target.checked }))} className="mt-1.5 h-4 w-4 shrink-0 accent-red-500" />{label}</label>)}</fieldset>
        <p className="mt-5 text-sm leading-7 text-zinc-400">Запази файловете, преди да затвориш страницата. Лабораторията не присъжда XP и не записва професионален статус. Проверени учебни планове в тази сесия: {verified.length}/2.</p>
        {caseIndex === 0 ? <button type="button" disabled={!passed || recording} className={`mt-5 ${buttonClass}`} onClick={() => chooseCase(1)}>Приложи наученото към ателието</button> : <button type="button" disabled={recording} className={`mt-5 ${outlineClass}`} onClick={() => chooseCase(0)}>Върни се към пекарната</button>}
        <div className="mt-8 border-t border-white/10 pt-6"><h3 className="font-semibold">Продължи в курса</h3><p className="mt-2 text-sm leading-7 text-zinc-300">Новите авторски проверки се пазят към урока при вход. Старото завършване и XP не ги отбелязват автоматично.</p><div className="mt-3 flex flex-wrap gap-x-6 gap-y-3"><Link className={linkClass} to="/module/s02-m01?lesson=23">Модул 1: бриф</Link><Link className={linkClass} to="/module/s02-m02?lesson=19">Модул 2: сценарий</Link><Link className={linkClass} to="/module/s02-m03?lesson=20">Модул 3: предаване</Link></div></div>
        <details className="mt-6 text-sm leading-7"><summary className="cursor-pointer font-semibold">Източници и граници — проверени на 03.10.2026 г.</summary><ul className="mt-3 space-y-2">{VIDEO_SOURCES.map(([label, url]) => <li key={url}><a href={url} target="_blank" rel="noreferrer" className={linkClass}>{label}</a></li>)}</ul><p className="mt-4 text-zinc-300">Изследванията не гарантират резултат за този бизнес. По текущата документация на YouTube гледанията се броят при започване на възпроизвеждане от 24.08.2026 г.; конкретните автоматични ключови моменти имат условия поне 60 секунди и 100 гледания. Не очакваме този отчет за нашия 25-секунден клип.</p></details>
      </section>
    </div>
  </main>;
}
