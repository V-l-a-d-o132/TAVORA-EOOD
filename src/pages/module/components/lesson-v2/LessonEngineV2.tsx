import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  autosaveLessonV2,
  completeLessonBlock,
  fetchLessonV2,
  type JsonObject,
  type LessonProgressV2,
  type LessonV2,
} from '@/lib/lesson-engine-v2';
import LessonBlockRenderer from './LessonBlockRenderer';

interface Props {
  moduleId: string;
  lessonId?: string;
  userId?: string;
  onComplete?: () => void;
  onNextLesson?: () => void;
  hasNextLesson?: boolean;
  lockAfterComplete?: boolean;
  isUnlocked?: boolean;
  hasFullAccess?: boolean;
  onSlideProgress?: (completed: number, total: number) => void;
  lessonOverride?: LessonV2 | null;
  previewMode?: boolean;
  onTrustedProgress?: (lessonId: string, progress: { completed: boolean; xp: number; scorePercent: number | null; masteryStatus: 'learning' | 'practicing' | 'mastered' }) => void;
}

function completedFromProgress(progress: LessonProgressV2 | null) {
  return new Set(progress?.completedBlockKeys || []);
}

export default function LessonEngineV2({
  moduleId,
  lessonId,
  userId,
  onComplete,
  onNextLesson,
  hasNextLesson = false,
  lockAfterComplete = false,
  isUnlocked = false,
  hasFullAccess = false,
  onSlideProgress,
  lessonOverride,
  previewMode = false,
  onTrustedProgress,
}: Props) {
  const [lesson, setLesson] = useState<LessonV2 | null>(lessonOverride || null);
  const [loading, setLoading] = useState(!lessonOverride);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [blockState, setBlockState] = useState<Record<string, JsonObject>>({});
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [xp, setXp] = useState(0);
  const [masteryStatus, setMasteryStatus] = useState<'learning' | 'practicing' | 'mastered'>('learning');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [showPreviewGate, setShowPreviewGate] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const completionReported = useRef(false);

  useEffect(() => {
    if (lessonOverride !== undefined) {
      setLesson(lessonOverride);
      setLoading(false);
      setError('');
      return;
    }
    if (!lessonId) {
      setLesson(null);
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    setError('');
    fetchLessonV2(moduleId, lessonId)
      .then((data) => { if (active) setLesson(data); })
      .catch(() => { if (active) setError('Урокът не може да бъде зареден. Провери връзката и опитай отново.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [lessonId, lessonOverride, moduleId, reloadKey, userId]);

  useEffect(() => {
    if (!lesson) return;
    const states = lesson.progress?.blockState || {};
    const done = completedFromProgress(lesson.progress);
    const resumeIndex = Math.max(0, lesson.blocks.findIndex((block) => block.key === lesson.progress?.currentBlockKey));
    setBlockState(states);
    setCompleted(done);
    setXp(lesson.progress?.xp || 0);
    setMasteryStatus(lesson.progress?.masteryStatus || 'learning');
    setCurrentIndex(resumeIndex);
    setShowPreviewGate(false);
    completionReported.current = false;
  }, [lesson]);

  useEffect(() => () => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
  }, []);

  const requiredBlocks = useMemo(() => lesson?.blocks.filter((block) => block.required) || [], [lesson]);
  const allComplete = requiredBlocks.length > 0 && requiredBlocks.every((block) => completed.has(block.key));
  const currentBlock = lesson?.blocks[currentIndex] || null;
  const progressPercent = requiredBlocks.length ? Math.round(100 * requiredBlocks.filter((block) => completed.has(block.key)).length / requiredBlocks.length) : 0;

  useEffect(() => {
    onSlideProgress?.(completed.size, lesson?.blocks.length || 0);
  }, [completed, lesson?.blocks.length, onSlideProgress]);

  useEffect(() => {
    if (!allComplete || completionReported.current) return;
    completionReported.current = true;
    if (!userId) onComplete?.();
    if (lockAfterComplete && !isUnlocked && !hasFullAccess) setShowPreviewGate(true);
  }, [allComplete, hasFullAccess, isUnlocked, lockAfterComplete, onComplete, userId]);

  const saveDraftState = useCallback((blockKey: string, state: JsonObject) => {
    setBlockState((previous) => ({ ...previous, [blockKey]: state }));
    if (!userId || !lesson || previewMode) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSaveStatus('saving');
    saveTimer.current = setTimeout(() => {
      void autosaveLessonV2(moduleId, lesson.lessonId, lesson.versionId, blockKey, { [blockKey]: state })
        .then(() => {
          setSaveStatus('saved');
          window.setTimeout(() => setSaveStatus('idle'), 1400);
        })
        .catch(() => setSaveStatus('error'));
    }, 650);
  }, [lesson, moduleId, previewMode, userId]);

  const goTo = useCallback((index: number) => {
    if (!lesson) return;
    const bounded = Math.max(0, Math.min(lesson.blocks.length - 1, index));
    setCurrentIndex(bounded);
    const block = lesson.blocks[bounded];
    if (userId && block && !previewMode) saveDraftState(block.key, blockState[block.key] || {});
    window.requestAnimationFrame(() => document.querySelector('[data-lesson-block]')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }, [blockState, lesson, previewMode, saveDraftState, userId]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.altKey && event.key === 'ArrowLeft') { event.preventDefault(); goTo(currentIndex - 1); }
      if (event.altKey && event.key === 'ArrowRight' && (currentBlock ? completed.has(currentBlock.key) || !currentBlock.required : false)) { event.preventDefault(); goTo(currentIndex + 1); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [completed, currentBlock, currentIndex, goTo]);

  if (loading) return <LessonSkeleton />;
  if (error) return <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-red-500/20 bg-[#111] p-8 text-center"><i className="ri-wifi-off-line text-4xl text-red-400" /><h2 className="mt-4 text-xl font-semibold text-white">Връзката прекъсна</h2><p className="mt-2 max-w-md text-sm leading-6 text-zinc-400">{error}</p><button type="button" onClick={() => setReloadKey((key) => key + 1)} className="mt-5 rounded-xl bg-red-500 px-5 py-3 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-red-300">Опитай отново</button></div>;
  if (!lesson || !lesson.blocks.length) return <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-white/10 bg-[#111] p-8 text-center"><i className="ri-tools-line text-4xl text-zinc-500" /><h2 className="mt-4 text-xl font-semibold text-white">Урокът се подготвя</h2><p className="mt-2 max-w-md text-sm leading-6 text-zinc-400">Съдържанието още не е публикувано. Няма да ти показваме измислен или общ урок.</p></div>;
  if (!currentBlock) return null;

  const canAdvance = completed.has(currentBlock.key) || !currentBlock.required;
  const isLast = currentIndex === lesson.blocks.length - 1;

  return <div className="mx-auto flex min-h-full w-full max-w-4xl flex-col pb-28 text-white" data-testid="lesson-engine-v2">
    <header className="mb-5 overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(240,68,68,.14),transparent_38%),linear-gradient(145deg,#181b21,#0e1014)] p-5 shadow-2xl shadow-black/20 sm:p-7 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-zinc-300"><span className="rounded-full border border-red-400/20 bg-red-400/10 px-3 py-1 text-red-200">Практически урок</span><span><i className="ri-time-line mr-1" />{lesson.duration}</span><span><i className="ri-star-line mr-1 text-amber-300" />{xp} XP</span></div>
        <span aria-live="polite" className={`text-xs ${saveStatus === 'error' ? 'text-red-300' : 'text-zinc-400'}`}>{saveStatus === 'saving' ? 'Запазване…' : saveStatus === 'saved' ? 'Прогресът е запазен' : saveStatus === 'error' ? 'Проблем при запазване' : userId ? 'Автоматично запазване' : 'Преглед без запис'}</span>
      </div>
      <h1 className="mt-5 text-3xl font-semibold leading-[1.15] tracking-tight sm:text-4xl">{lesson.title}</h1>
      {lesson.subtitle && <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-300">{lesson.subtitle}</p>}
      <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4"><p className="text-[11px] font-bold uppercase tracking-[.18em] text-zinc-400">След този урок ще можеш да</p><p className="mt-2 leading-7 text-white">{lesson.objective}</p></div>
      <div className="mt-6"><div className="mb-2 flex items-center justify-between text-xs text-zinc-300"><span>Напредък в урока</span><span className="font-semibold text-white">{progressPercent}% · {completed.size}/{lesson.blocks.length}</span></div><div className="h-2.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-red-600 to-red-400 transition-[width] motion-reduce:transition-none" style={{ width: `${progressPercent}%` }} /></div></div>
    </header>

    {completed.size > 0 && <section aria-labelledby="skills-heading" className="mb-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] p-4 sm:p-5">
      <h2 id="skills-heading" className="text-sm font-semibold text-emerald-200">Какво вече умея</h2>
      <ul className="mt-3 flex flex-wrap gap-2">{lesson.blocks.filter((block) => completed.has(block.key)).map((block) => <li key={block.key} className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-100"><i className="ri-check-line mr-1" />{block.title}</li>)}</ul>
      {masteryStatus === 'mastered' && <p className="mt-3 text-sm font-medium text-white">Овладяно: {lesson.objective}</p>}
    </section>}

    <div className="mb-3 flex items-end justify-between gap-4"><div><p className="text-[11px] font-bold uppercase tracking-[.18em] text-zinc-500">Стъпка {currentIndex + 1} от {lesson.blocks.length}</p><p className="mt-1 text-sm font-medium text-zinc-200">{currentBlock.title}</p></div><span className="shrink-0 text-xs text-zinc-500">Alt + ← / →</span></div>
    <nav aria-label="Стъпки на урока" className="mb-5 flex gap-2 overflow-x-auto pb-2">{lesson.blocks.map((block, index) => <button key={block.key} type="button" aria-label={`Стъпка ${index + 1}: ${block.title}`} aria-current={index === currentIndex ? 'step' : undefined} onClick={() => goTo(index)} className={`grid h-9 min-w-9 place-items-center rounded-xl border text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 ${index === currentIndex ? 'border-red-400 bg-red-500 text-white' : completed.has(block.key) ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-white/10 bg-white/[0.04] text-zinc-500'}`}>{completed.has(block.key) ? <i className="ri-check-line" aria-hidden /> : index + 1}</button>)}</nav>

    <div data-lesson-block>
      <LessonBlockRenderer key={`${lesson.versionId}:${currentBlock.key}`} block={currentBlock} lessonId={lesson.lessonId} initialState={blockState[currentBlock.key]} completed={completed.has(currentBlock.key)} onStateChange={(state) => saveDraftState(currentBlock.key, state)} onSubmit={async (payload) => {
        const response = await completeLessonBlock(lesson, currentBlock, payload);
        if (response.feedback.complete === true) setCompleted((previous) => new Set(previous).add(currentBlock.key));
        const serverDone = response.progress?.completed_block_keys;
        if (Array.isArray(serverDone)) setCompleted(new Set(serverDone.filter((key): key is string => typeof key === 'string')));
        if (typeof response.progress?.xp === 'number') setXp(response.progress.xp);
        if (response.progress?.mastery_status === 'mastered' || response.progress?.mastery_status === 'practicing' || response.progress?.mastery_status === 'learning') setMasteryStatus(response.progress.mastery_status);
        if (response.progress && typeof response.progress.xp === 'number') {
          const status = response.progress.mastery_status === 'mastered' || response.progress.mastery_status === 'practicing' ? response.progress.mastery_status : 'learning';
          onTrustedProgress?.(lesson.lessonId, {
            completed: typeof response.progress.completed_at === 'string',
            xp: response.progress.xp,
            scorePercent: typeof response.progress.score_percent === 'number' ? response.progress.score_percent : null,
            masteryStatus: status,
          });
        }
        return response;
      }} />
    </div>

    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-[#08090b]/95 px-4 pb-[calc(.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl md:sticky md:mt-5 md:rounded-2xl md:border md:p-3" aria-label="Навигация в урока">
      {!canAdvance && !isLast && <p className="mb-2 text-center text-xs text-amber-200/80">Изпълни задачата в тази стъпка, за да продължиш.</p>}
      <div className="mx-auto flex max-w-4xl items-center gap-3"><button type="button" disabled={currentIndex === 0} onClick={() => goTo(currentIndex - 1)} className="rounded-xl border border-white/10 px-4 py-3 text-sm text-zinc-300 disabled:opacity-30"><i className="ri-arrow-left-line mr-2" />Назад</button><div className="min-w-0 flex-1 text-center text-xs text-zinc-400"><span className="hidden sm:inline">Стъпка </span>{currentIndex + 1} / {lesson.blocks.length}</div>{!isLast ? <button type="button" disabled={!canAdvance} title={!canAdvance ? 'Завърши текущата задача' : undefined} onClick={() => goTo(currentIndex + 1)} className="rounded-xl bg-red-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-950/30 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500 disabled:shadow-none">Следваща<i className="ri-arrow-right-line ml-2" /></button> : hasNextLesson ? <button type="button" disabled={!allComplete} onClick={onNextLesson} className="rounded-xl bg-red-500 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500">Следващ урок<i className="ri-arrow-right-line ml-2" /></button> : <span className={`rounded-xl px-5 py-3 text-sm font-semibold ${allComplete ? 'bg-emerald-500/15 text-emerald-300' : 'bg-zinc-800 text-zinc-500'}`}>{allComplete ? 'Урокът е овладян' : 'Завърши всички задачи'}</span>}</div>
    </div>

    {showPreviewGate && <div role="dialog" aria-modal="true" aria-labelledby="preview-gate-title" className="fixed inset-0 z-50 grid place-items-center bg-black/85 p-5"><div className="max-w-md rounded-3xl border border-red-500/25 bg-[#151515] p-7 text-center shadow-2xl"><i className="ri-lock-unlock-line text-4xl text-red-400" /><h2 id="preview-gate-title" className="mt-4 text-2xl font-semibold">Продължи с пълен достъп</h2><p className="mt-3 leading-7 text-zinc-400">Завърши безплатния preview. Влез в профила си или отключи програмата, за да запазиш mastery и да продължиш.</p><button type="button" onClick={() => setShowPreviewGate(false)} className="mt-5 rounded-xl border border-white/15 px-5 py-3 text-sm">Прегледай отговорите</button></div></div>}
  </div>;
}

function LessonSkeleton() {
  return <div aria-label="Зареждане на урока" className="animate-pulse space-y-5 motion-reduce:animate-none"><div className="h-44 rounded-3xl bg-white/[0.06]" /><div className="h-2 rounded-full bg-white/[0.08]" /><div className="h-[420px] rounded-3xl bg-white/[0.06]" /></div>;
}
