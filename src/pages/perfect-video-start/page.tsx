import VideoClientProject from '@/components/academy/VideoClientProject';
import VideoProductionWorkshop from '@/components/academy/VideoProductionWorkshop';
import ThemeSelector from '@/components/academy/ThemeSelector';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import VideoDecisionLab, { VIDEO_LAB_KINDS, videoLabTitle, type VideoLabKind } from '@/components/academy/VideoDecisionLab';
import VideoLabChallenge, { type VideoRehearsalState } from '@/components/academy/VideoLabChallenge';
import { VIDEO_LAB_CHALLENGES } from '@/data/video-lab-challenges';
import { buildVideoLabWorkbook } from '@/lib/video-lab-workbook';

export default function PerfectVideoStartPage() {
  const [kind, setKind] = useState<VideoLabKind>('story');
  const [practice, setPractice] = useState<VideoRehearsalState>({});
  const [preview, setPreview] = useState<{ kind: VideoLabKind; variant: string; nonce: number } | null>(null);
  const desk = useRef<HTMLDivElement>(null);
  const completed = (item: VideoLabKind) => VIDEO_LAB_CHALLENGES[item].filter(study => practice[study.id]?.checked === practice[study.id]?.choice && study.options.some(option => option.id === practice[study.id]?.choice && option.meetsGoal)).length;
  const total = VIDEO_LAB_KINDS.reduce((sum, item) => sum + completed(item), 0);
  const download = () => {
    const lines = ['TAVORA · Работни решения за видео', 'Измислени случаи. Изборите и проверките са от тази сесия; не удостоверяват оценка или реално заснет проект.', ''];
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
    <header className="mb-8 mt-9 max-w-3xl"><p className="text-xs font-semibold uppercase tracking-[.15em] academy-accent">TAVORA · Перфектното видео</p><h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">Първо историята.<br />После изборът на кадър.</h1><p className="mt-5 text-lg leading-8 academy-body">Смени един избор и виж какво се променя. Тук можеш да подредиш разказ, да сравниш кадри и да чуеш звуков проблем с готови учебни материали.</p></header>
    <VideoClientProject />
    <VideoProductionWorkshop />
    <div className="mb-6 rounded-xl border academy-border academy-tint p-4"><p className="text-sm font-semibold academy-text">Обосновани решения в тази сесия: {total}/22</p><progress aria-label="Учебни случаи с проверено основание" max={22} value={total} className="mt-3 h-2 w-full accent-red-600" /><p className="mt-2 text-xs leading-6 academy-muted">Първо сравни вариантите, после реши новото задание. Можеш да сменяш темите и да се връщаш към изборите си. Презареждането започва нова сесия.</p></div>
    <nav aria-label="Избери демонстрация" className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{VIDEO_LAB_KINDS.map((item, i) => <button type="button" key={item} aria-pressed={item === kind} onClick={() => setKind(item)} className={`rounded-xl border px-4 py-3 text-left text-sm leading-5 focus:outline-none focus:ring-2 focus:ring-red-300 ${item === kind ? 'academy-accent-border academy-accent-bg academy-text' : 'academy-border academy-body hover:academy-tint'}`}><span className="mr-3 font-mono text-xs academy-accent">{String(i + 1).padStart(2, '0')}</span>{videoLabTitle(item)}<span className="mt-2 block text-xs academy-muted">{completed(item)}/2 нови случая</span></button>)}</nav>
    <div ref={desk} className="scroll-mt-6"><VideoDecisionLab key={kind} kind={kind} request={preview?.kind === kind ? preview : undefined} /></div>
    <VideoLabChallenge kind={kind} state={practice} onChange={(id, value) => setPractice(previous => ({ ...previous, [id]: value }))} onPreview={variant => { setPreview(previous => ({ kind, variant, nonce: (previous?.nonce || 0) + 1 })); desk.current?.scrollIntoView({ behavior: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' }); }} />
    <div className="mb-5 flex flex-wrap gap-3"><button type="button" onClick={downloadWorkbook} className="rounded-xl border academy-border-strong px-4 py-3 text-sm academy-text">Изтегли 22-те упражнения · HTML</button><button type="button" onClick={download} className="rounded-xl border academy-border-strong px-4 py-3 text-sm academy-text">Изтегли работните решения · TXT</button></div>
    <p className="mb-5 text-xs leading-6 academy-muted">HTML тетрадката съдържа ситуациите и проверките за работа без интернет. Движещата се картина и звуковите сравнения са в тази онлайн работна маса. TXT файлът пази избраните решения и показания разбор.</p>
    <p className="max-w-3xl text-sm leading-7 academy-muted">Демонстрациите показват принципи чрез схеми и обработен синтетичен звук. Решенията се проверяват в задачите на съответния урок. Нужните настройки и менюта зависят от телефона, камерата и редактора, с които разполагаш.</p>
  </div></main>;
}
