import VideoCompletionWorkshop from '@/components/academy/VideoCompletionWorkshop';
import VideoWorkflowWorkshop from '@/components/academy/VideoWorkflowWorkshop';
import VideoClientProject from '@/components/academy/VideoClientProject';
import VideoProductionWorkshop from '@/components/academy/VideoProductionWorkshop';
import ThemeSelector from '@/components/academy/ThemeSelector';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import VideoDecisionLab, { VIDEO_LAB_KINDS, videoLabTitle, type VideoLabKind } from '@/components/academy/VideoDecisionLab';
import VideoLabChallenge, { type VideoRehearsalState } from '@/components/academy/VideoLabChallenge';
import { VIDEO_LAB_CHALLENGES } from '@/data/video-lab-challenges';
import { buildVideoLabWorkbook } from '@/lib/video-lab-workbook';
import VideoGoalPractice from './VideoGoalPractice';

import { readRehearsal, saveRehearsal } from '@/lib/video-rehearsal-draft';

export default function PerfectVideoStartPage() {
  const [kind, setKind] = useState<VideoLabKind>('story');
  const [practice, setPractice] = useState<VideoRehearsalState>(readRehearsal);
  const [saved, setSaved] = useState(true);
  useEffect(() => { setSaved(saveRehearsal(practice)); }, [practice]);
  const changeAnswer = (id: string, value: VideoRehearsalState[string]) => setPractice(previous => {
    const next = { ...previous, [id]: value };
    const [first, second] = VIDEO_LAB_CHALLENGES[kind];
    if (id === first.id && previous[id]?.choice !== value.choice && next[second.id]) {
      next[second.id] = { ...next[second.id], checked: '' };
    }
    return next;
  });
  const [preview, setPreview] = useState<{ kind: VideoLabKind; variant: string; nonce: number } | null>(null);
  const desk = useRef<HTMLDivElement>(null);
  const completed = (item: VideoLabKind) => VIDEO_LAB_CHALLENGES[item].filter(study => practice[study.id]?.checked === practice[study.id]?.choice && study.options.some(option => option.id === practice[study.id]?.choice && option.meetsGoal)).length;
  const total = VIDEO_LAB_KINDS.reduce((sum, item) => sum + completed(item), 0);
  const download = () => {
    const lines = ['TAVORA · Работни решения за видео', 'Избори и проверки по измислени учебни случаи в този браузър.', ''];
    for (const item of VIDEO_LAB_KINDS) for (const study of VIDEO_LAB_CHALLENGES[item]) {
      const value = practice[study.id], selected = study.options.find(option => option.id === value?.choice);
      lines.push(videoLabTitle(item), study.context, study.question, `Избор: ${selected?.label || 'Още няма избор.'}`, value?.checked && value.checked === selected?.id ? `Разбор: ${selected.note}` : 'Изборът още не е проверен.', '');
    }
    const url = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'tavora-video-reshenia.txt'; document.body.append(link); link.click(); link.remove(); window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const downloadWorkbook = () => {
    const url = URL.createObjectURL(new Blob([buildVideoLabWorkbook(practice)], { type: 'text/html;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'tavora-video-lab.html'; document.body.append(link); link.click(); link.remove(); window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return <main className="min-h-screen academy-bg academy-text"><div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-12"><div className="mb-4 flex justify-end"><ThemeSelector /></div>
    <Link to="/kurs" className="text-sm academy-accent underline underline-offset-4">Обратно към Академията</Link>
    <header className="mb-6 mt-9 max-w-3xl"><p className="text-xs font-semibold uppercase tracking-[.15em] academy-accent">TAVORA · Перфектното видео</p><h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">Първият ти видеопроект</h1></header>
    <VideoGoalPractice />
    <VideoClientProject />
    <VideoProductionWorkshop />
    <VideoWorkflowWorkshop />
    <VideoCompletionWorkshop />
    <div className="mb-6 rounded-xl border academy-border academy-tint p-4"><p className="text-sm font-semibold academy-text">Обосновани решения: {total}/22</p><progress aria-label="Учебни случаи с проверено основание" max={22} value={total} className="mt-3 h-2 w-full accent-red-600" /><p className="mt-2 text-xs leading-6 academy-muted">Първо сравни вариантите, после реши новото задание. {saved ? 'Изборите и проверките остават в този браузър и след презареждане.' : 'Браузърът не успя да запази решенията. Свали ги като TXT, преди да затвориш.'}</p></div>
    <nav aria-label="Избери демонстрация" className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{VIDEO_LAB_KINDS.map((item, i) => <button type="button" key={item} aria-pressed={item === kind} onClick={() => setKind(item)} className={`rounded-xl border px-4 py-3 text-left text-sm leading-5 focus:outline-none focus:ring-2 focus:ring-red-300 ${item === kind ? 'academy-accent-border academy-accent-bg academy-text' : 'academy-border academy-body hover:academy-tint'}`}><span className="mr-3 font-mono text-xs academy-accent">{String(i + 1).padStart(2, '0')}</span>{videoLabTitle(item)}<span className="mt-2 block text-xs academy-muted">{completed(item)}/2 нови случая</span></button>)}</nav>
    <div ref={desk} className="scroll-mt-6"><VideoDecisionLab key={kind} kind={kind} request={preview?.kind === kind ? preview : undefined} /></div>
    <VideoLabChallenge kind={kind} state={practice} onChange={changeAnswer} onPreview={variant => { setPreview(previous => ({ kind, variant, nonce: (previous?.nonce || 0) + 1 })); desk.current?.scrollIntoView({ behavior: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' }); }} />
    <div className="mb-5 flex flex-wrap gap-3"><button type="button" onClick={downloadWorkbook} className="rounded-xl border academy-border-strong px-4 py-3 text-sm academy-text">Изтегли 22-те упражнения · HTML</button><button type="button" onClick={download} className="rounded-xl border academy-border-strong px-4 py-3 text-sm academy-text">Изтегли работните решения · TXT</button></div>
    <p className="mb-5 text-xs leading-6 academy-muted">HTML тетрадката съдържа ситуациите и проверките за работа без интернет. Движещата се картина и звуковите сравнения са в тази онлайн работна маса. TXT файлът пази избраните решения и показания разбор.</p>
    <p className="max-w-3xl text-sm leading-7 academy-muted">Демонстрациите показват принципи чрез схеми и обработен синтетичен звук. Решенията се проверяват в задачите на съответния урок. Нужните настройки и менюта зависят от телефона, камерата и редактора, с които разполагаш.</p>
  </div></main>;
}
