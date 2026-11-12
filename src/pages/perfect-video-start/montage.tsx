import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ThemeSelector from '@/components/academy/ThemeSelector';
import { inspectVideoFile, type VideoFileMetadata } from '@/lib/perfect-video-practice';
import { recordMontage } from '@/lib/record-montage';
import { videoAiLessonLink } from '@/lib/video-ai';
import {
  briefIssues, coffee, draftKey, localSourceId, montageLength, montagePlan, montageSrt, newMontage,
  restoreMontage, revisionIssues, revisionNote, seconds, sourceLabel, type MontageShot, type MontageSource,
} from '@/lib/video-montage';
import MontageEditor from './montage-editor';

const button = 'inline-flex min-h-11 items-center justify-center rounded-lg border academy-border-strong px-4 py-2 text-sm font-semibold academy-text disabled:opacity-50';
const primary = 'inline-flex min-h-11 items-center justify-center rounded-lg academy-primary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50';
const card = 'rounded-2xl border academy-border academy-surface p-4 sm:p-6';
const lessons = [
  ['pv01-01', 'Разкажи история с четири кадъра'], ['pv02-08', 'Покажи процеса'],
  ['pv04-01', 'Освети продукта с един прозорец'], ['pv05-01', 'Провери звука на място'],
  ['pv07-01', 'Заснеми действието с телефона'], ['pv09-01', 'Направи първата сглобка'],
  ['pv09-04', 'Постави четими надписи'], ['pv09-12', 'Провери изнесения файл'],
];

type Output = { url: string; name: string; meta: VideoFileMetadata };
const formatTime = (n: number) => Number.isFinite(n) ? n.toLocaleString('bg-BG', { maximumFractionDigits: 2 }) : '…';

function textDownload(name: string, contents: string, type: string) {
  const url = URL.createObjectURL(new Blob([contents], { type }));
  const link = document.createElement('a');
  link.href = url; link.download = name;
  document.body.append(link); link.click(); link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 10000);
}

function PlanDownloads({ shots, version }: { shots: MontageShot[]; version: number }) {
  const prefix = `tavora-montage-v${version}`;
  return <div className="flex flex-wrap gap-2">
    <button type="button" className={button} onClick={() => textDownload(prefix + '.txt', montagePlan(shots, version), 'text/plain;charset=utf-8')}>Монтажен лист · TXT</button>
    <button type="button" className={button} disabled={briefIssues(shots).length > 0}
      onClick={() => textDownload(prefix + '.srt', montageSrt(shots), 'application/x-subrip;charset=utf-8')}>Надписи · SRT</button>
  </div>;
}

function ExportedVideo({ output, version }: { output: Output; version: number }) {
  const { meta } = output;
  return <div className="grid items-center gap-4 sm:grid-cols-[12rem_1fr]">
    <video src={output.url} controls playsInline preload="metadata" aria-label={`Изнесен файл, версия ${version}`}
      className="mx-auto aspect-[9/16] w-full max-w-[12rem] rounded-lg bg-black object-contain" />
    <div>
      <p className="text-sm font-semibold academy-text">{output.name}</p>
      <p className="my-2 text-sm leading-6 academy-body">{meta.width} × {meta.height} px · {meta.seconds === null ? 'Продължителността не е записана в метаданните' : formatTime(meta.seconds) + ' сек. във файла'} · {Math.max(1, Math.round(meta.bytes / 1024))} KB</p>
      <a className={button} href={output.url} download={output.name}>Изтегли видео · версия {version}</a>
    </div>
  </div>;
}

export default function VideoMontagePage() {
  const [draft, setDraft] = useState(() => {
    try { return restoreMontage(localStorage.getItem(draftKey)); } catch { return newMontage(); }
  });
  const [active, setActive] = useState(draft.shots[0].id);
  const [sources, setSources] = useState(() => new Map([[coffee.id, coffee]]));
  const [output, setOutput] = useState<Output | null>(null);
  const [firstFile, setFirstFile] = useState<Output | null>(null);
  const [watched, setWatched] = useState(false);
  const [job, setJob] = useState('');
  const [progress, setProgress] = useState(0);
  const [notice, setNotice] = useState('');
  const [issues, setIssues] = useState<string[]>([]);
  const [storageFailed, setStorageFailed] = useState(false);
  const task = useRef<AbortController | null>(null);
  const owned = useRef(new Set<string>());
  const feedback = useRef<HTMLDivElement>(null);
  const version = draft.first ? 2 : 1;
  const total = montageLength(draft.shots);

  useEffect(() => {
    try { localStorage.setItem(draftKey, JSON.stringify(draft)); setStorageFailed(false); }
    catch { setStorageFailed(true); }
  }, [draft]);
  useEffect(() => {
    const urls = owned.current;
    return () => { task.current?.abort(); task.current = null; urls.forEach(url => URL.revokeObjectURL(url)); urls.clear(); };
  }, []);

  function keep(blob: Blob) {
    const url = URL.createObjectURL(blob);
    owned.current.add(url);
    return url;
  }
  function release(file: Output | null) {
    if (file && owned.current.delete(file.url)) URL.revokeObjectURL(file.url);
  }
  function edit(shots: MontageShot[]) {
    release(output); setOutput(null); setWatched(false); setIssues([]); setNotice('');
    setDraft(previous => ({ ...previous, shots, delivered: false }));
  }
  function finish(controller: AbortController) {
    if (task.current !== controller) return;
    task.current = null;
    setJob('');
  }

  async function addFiles(files: File[]) {
    if (!files.length || task.current) return;
    const controller = new AbortController(); task.current = controller;
    setJob('Отваряне на клиповете'); setIssues([]); setNotice('');
    const next = new Map(sources), failures: string[] = [];
    for (const file of files) {
      try {
        const meta = await inspectVideoFile(file);
        if (controller.signal.aborted) return;
        if (!meta.width || !meta.height || !meta.seconds) throw new Error('Нужни са картина и четима продължителност. Опитай с MP4.');
        const id = await localSourceId(file);
        if (controller.signal.aborted) return;
        if (!next.has(id)) next.set(id, { id, label: file.name, seconds: meta.seconds, url: keep(file) });
      } catch (error) { failures.push(file.name + ' — ' + error.message); }
      if (controller.signal.aborted) return;
    }
    setSources(next); setIssues(failures);
    setNotice(`Лични клипове в тази сесия: ${next.size - 1}. Избери източник за съответния кадър.`);
    finish(controller);
  }

  async function render(first = false) {
    if (task.current) return;
    const shots = first ? draft.first : draft.shots;
    if (!shots) return;
    const problems = briefIssues(shots);
    for (const [index, shot] of shots.entries()) {
      const source = sources.get(shot.source);
      if (!source) problems.push(`За кадър ${index + 1} свържи отново „${sourceLabel(shot.source)}“.`);
      else if (source.id !== coffee.id && seconds(shot.to) > source.seconds + 0.001) problems.push(`Кадър ${index + 1} завършва след края на личния клип.`);
    }
    setIssues(problems); setNotice('');
    if (problems.length) return;
    const controller = new AbortController(); task.current = controller;
    const number = first ? 1 : version;
    setJob(`Износ на версия ${number}`); setProgress(0);
    try {
      const blob = await recordMontage(shots, sources, controller.signal, setProgress);
      const extension = blob.type.includes('mp4') ? 'mp4' : 'webm';
      const name = `tavora-montage-v${number}.${extension}`;
      const meta = await inspectVideoFile(new File([blob], name, { type: blob.type }));
      if (controller.signal.aborted) return;
      if (!meta.width || !meta.height || meta.width * 16 !== meta.height * 9) throw new Error('Изнесеният файл не се отвори като вертикално видео. Повтори износа.');
      if (meta.seconds !== null && Math.abs(meta.seconds - montageLength(shots)) > 0.8) throw new Error('Продължителността на файла се разминава с монтажния лист. Повтори износа с отворен раздел.');
      const result = { url: keep(blob), name, meta };
      if (first) { release(firstFile); setFirstFile(result); }
      else { release(output); setOutput(result); setWatched(false); }
      setNotice('Файлът е готов. Отвори го, изгледай го и свали копие.');
    } catch (error) {
      if (!controller.signal.aborted) setIssues([error.message || 'Износът прекъсна. Опитай пак или използвай монтажния лист.']);
    } finally { finish(controller); }
  }

  function deliver() {
    if (!output || !watched || task.current) return;
    if (draft.first) {
      const problems = revisionIssues(draft.shots, draft.first);
      setIssues(problems);
      if (problems.length) return;
      setDraft(previous => ({ ...previous, delivered: true }));
      setNotice('Втората версия изпълнява двете промени. Свали файла за портфолиото си.');
    } else {
      setFirstFile(output); setOutput(null); setWatched(false);
      setDraft(previous => ({ ...previous, first: previous.shots }));
      setIssues([]); setNotice('Версия 1 е предадена в упражнението. Получи клиентска бележка за следващия монтаж.');
      requestAnimationFrame(() => feedback.current?.focus());
    }
  }

  function downloadHandoff() {
    if (!draft.delivered || !output) return;
    const { name, meta } = output;
    const note = [
      'Здравейте,',
      'Прилагам втората версия на краткото продуктово видео. То започва с резултата. Следващият кадър връща зрителя към процеса с надписа „' + draft.shots[1].caption.trim() + '“.',
      'Видео: ' + name + ' · ' + meta.width + ' × ' + meta.height + ' px' + (meta.seconds === null ? '' : ' · ' + formatTime(meta.seconds) + ' сек.'),
      'Отделни надписи: tavora-montage-v2.srt. Надписите са включени и в картината.',
      'Моля, прегледайте файла на телефон. Потвърждавате ли тази версия за публикуване? Ако има още промяна, посочете секундата и какво искате да се вижда там.',
    ];
    textDownload('tavora-predavane-v2.txt', note.join('\n\n'), 'text/plain;charset=utf-8');
  }

  function reset() {
    if (task.current || !window.confirm('Да изчистя ли монтажния лист и двете версии от тази лаборатория?')) return;
    owned.current.forEach(url => URL.revokeObjectURL(url)); owned.current.clear();
    setSources(new Map([[coffee.id, coffee]])); setDraft(newMontage()); setActive(0);
    setFirstFile(null); setOutput(null); setWatched(false); setIssues([]); setNotice('Започна нов монтаж.');
  }

  return <main className="min-h-screen academy-bg academy-text">
    <div className="mx-auto max-w-4xl space-y-5 px-4 pb-16 pt-5 sm:px-8 sm:pt-8">
      <div className="flex items-center justify-between gap-3"><Link to="/academy-labs/perfect-video/start" className="text-sm font-semibold academy-accent underline underline-offset-4">← Към видео лабораторията</Link><ThemeSelector /></div>
      <header className="max-w-3xl pb-1">
        <p className="text-xs font-semibold uppercase tracking-widest academy-accent">Перфектното видео · Учебна поръчка</p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">От четири кадъра до готов клип</h1>
        <p className="mt-4 leading-7 academy-body">Малко кафене иска вертикален клип за телефона. Покажи как се приготвя една чаша кафе в 20–30 секунди. Сложи по един кратък надпис на всеки от четирите кадъра, така че историята да се разбира и без звук.</p>
        <p className="mt-2 text-sm leading-6 academy-muted">Започни с четири части от предоставения запис или заснеми свой продукт. Изнеси първата версия, прочети бележката на учебния клиент и предай корекцията.</p>
      </header>
      <details className="rounded-xl border academy-border px-4 py-3 text-sm academy-body">
        <summary className="cursor-pointer font-semibold">Осем урока в помощ на монтажа</summary>
        <ol className="mt-3 grid list-inside list-decimal gap-2 sm:grid-cols-2">{lessons.map(([id, title]) => <li key={id}><Link to={videoAiLessonLink(id)} className="academy-accent underline underline-offset-4">{title}</Link></li>)}</ol>
      </details>
      {draft.first && <div ref={feedback} tabIndex={-1} className="rounded-xl border academy-info-border academy-info-bg p-4">
        <h2 className="text-lg font-semibold academy-text">Клиентска бележка за версия 2</h2>
        <p className="mt-2 leading-7 academy-body">{revisionNote}</p>
        <p className="mt-2 text-sm academy-muted">Последният отрязък от версия 1 е {sourceLabel(draft.first[3].source)} · {draft.first[3].from}–{draft.first[3].to} сек.</p>
      </div>}
      <MontageEditor shots={draft.shots} active={active} onActive={setActive} sources={sources} onFiles={addFiles} onChange={edit} disabled={!!job} />
      <section aria-label="Предаване на монтажа" className={card}>
        <h2 className="text-xl font-semibold">Версия {version} · {formatTime(total)} сек. по монтажния лист</h2>
        <p className="my-3 text-sm leading-6 academy-body">Надписите влизат в картината. Остави раздела отворен по време на износа. Файлът се създава на това устройство.</p>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" disabled={!!job} className={primary} onClick={() => render()}>Изнеси видео · версия {version}</button>
          <PlanDownloads shots={draft.shots} version={version} />
        </div>
        {job && <div className="mt-4"><p role="status" className="text-sm font-semibold academy-body">{job}{job.startsWith('Износ') && ` · ${progress} сек.`}</p>
          {job.startsWith('Износ') && <button type="button" className={button + ' mt-2'} onClick={() => { task.current?.abort(); setNotice('Износът е спрян. Монтажният лист е запазен.'); }}>Спри износа</button>}</div>}
        {issues.length > 0 && <ul role="alert" className="mt-4 list-inside list-disc space-y-1 rounded-lg border academy-warning-border academy-warning-bg p-3 text-sm academy-warning">{issues.map((issue, i) => <li key={i}>{issue}</li>)}</ul>}
        {notice && <p role="status" className="mt-4 text-sm font-semibold academy-body">{notice}</p>}
        {output && <div className="mt-5 space-y-4 border-t academy-border pt-5">
          <ExportedVideo output={output} version={version} />
          {!draft.delivered && <><label className="flex items-start gap-3 text-sm leading-6 academy-body">
            <input type="checkbox" checked={watched} onChange={e => setWatched(e.target.checked)} className="mt-1 h-4 w-4 shrink-0" />Изгледах файла. Продуктът се вижда и мога да прочета четирите надписа.</label>
            <button type="button" className={primary} disabled={!watched || !!job} onClick={deliver}>Предай версия {version} в упражнението</button></>}
        </div>}
        {draft.delivered && <div className="mt-4 space-y-3 rounded-lg border academy-success-border academy-success-bg p-4">
          <p className="font-semibold academy-success">Учебната поръчка е завършена · две версии</p>
          <p className="text-sm leading-6 academy-body">За предаването подготви финалното видео, неговия SRT и кратко съобщение с въпрос за одобрение.</p>
          {output && <button type="button" className={button} onClick={downloadHandoff}>Свали съобщението за предаване · TXT</button>}
          <Link to="/academy-labs/perfect-video/start?completion=portfolio#client-completion" className="block text-sm font-semibold academy-accent underline underline-offset-4">Упражни доставката и разрешението за портфолио</Link>
        </div>}
      </section>
      {draft.first && <section aria-label="Първа предадена версия" className={card}>
        <h2 className="mb-3 text-xl font-semibold">Първа предадена версия</h2>
        {firstFile ? <ExportedVideo output={firstFile} version={1} /> :
          <button type="button" className={button} disabled={!!job} onClick={() => render(true)}>Възстанови видеото от първия монтажен лист</button>}
        <div className="mt-4"><PlanDownloads shots={draft.first} version={1} /></div>
      </section>}
      <footer className="space-y-3 text-sm leading-6 academy-muted">
        <p>{storageFailed ? 'Автоматичното запазване е недостъпно. Свали монтажния лист преди да затвориш.' : 'Редът, границите и надписите се запазват в този браузър. Свали изнесените видеа, за да ги задържиш след затваряне.'} Личните клипове остават на устройството.</p>
        <div className="flex flex-wrap items-center justify-between gap-2"><a className="academy-accent underline underline-offset-4" href="/academy-labs/perfect-video/practical/SOURCES.md">Произход на учебния запис</a><button type="button" className={button} disabled={!!job} onClick={reset}>Започни нов монтаж</button></div>
      </footer>
    </div>
  </main>;
}
