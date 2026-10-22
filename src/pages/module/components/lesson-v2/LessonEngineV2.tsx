import { videoClientStage } from '@/data/video-client-project';
import { videoProductionStage } from '@/data/video-production-project';
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
import LessonGlossary from './LessonGlossary';
import VideoPracticeBridge from './VideoPracticeBridge';
import { LessonDraftQueue, type DraftSaveStatus } from '@/lib/lesson-draft-queue';
import { lessonBlockPresentation } from '@/lib/lesson-presentation';
import { notifyLearningProgressChanged, recordLessonVisit } from '@/lib/learning-resume';
import { countVisibleLessonWords, lessonReadingDuration } from '@/lib/academy-reading-time';
import { closedLessonState } from '@/lib/closed-lesson-state';
import { readFreeSilkProgress, saveFreeSilkProgress } from '@/lib/free-silk-progress';

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
  const [saveStatus, setSaveStatus] = useState<DraftSaveStatus>('idle');
  const [visitFailed, setVisitFailed] = useState(false);
  const [showPreviewGate, setShowPreviewGate] = useState(false);
  const draftQueue = useRef<LessonDraftQueue | null>(null);
  const completionReported = useRef(false);
  const [guestVersion, setGuestVersion] = useState('');
  const saveVisit = useCallback(async () => {
    if (!userId || !lesson || previewMode) return;
    try {
      await recordLessonVisit(userId, lesson.moduleId, lesson.lessonId);
      setVisitFailed(false);
    } catch { setVisitFailed(true); }
  }, [userId, lesson, previewMode]);

  useEffect(() => { void saveVisit(); }, [saveVisit]);

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
    const progress = lesson.versionChanged ? null : lesson.progress;
    const guest = !userId && !previewMode ? readFreeSilkProgress(lesson) : null;
    const states = closedLessonState(lesson.blocks, guest?.blockState || progress?.blockState || {});
    const done = guest ? new Set(guest.completedBlockKeys) : completedFromProgress(progress);
    const resumeIndex = Math.max(0, lesson.blocks.findIndex((block) => block.key === (guest?.currentBlockKey || progress?.currentBlockKey)));
    setBlockState(states);
    setCompleted(done);
    setXp(guest?.xp ?? progress?.xp ?? 0);
    setMasteryStatus(progress?.masteryStatus || 'learning');
    setCurrentIndex(resumeIndex);
    setShowPreviewGate(false);
    completionReported.current = false;
    setGuestVersion(lesson.versionId);
  }, [lesson, userId, previewMode]);

  useEffect(() => {
    if (!userId && !previewMode && lesson && guestVersion === lesson.versionId) {
      saveFreeSilkProgress(lesson, lesson.blocks[currentIndex]?.key || null, blockState, completed);
    }
  }, [blockState, completed, currentIndex, guestVersion, lesson, previewMode, userId]);

  useEffect(() => {
    setSaveStatus('idle');
    if (!userId || !lesson || previewMode) return;
    const queue = new LessonDraftQueue(
      async (cursor, states) => {
        const result = await autosaveLessonV2(moduleId, lesson.lessonId, lesson.versionId, cursor, closedLessonState(lesson.blocks, states));
        notifyLearningProgressChanged(userId);
        return result;
      },
      setSaveStatus,
    );
    draftQueue.current = queue;
    const flush = () => { void queue.flush(); };
    const hidden = () => { if (document.visibilityState === 'hidden') flush(); };
    window.addEventListener('pagehide', flush);
    window.addEventListener('online', flush);
    document.addEventListener('visibilitychange', hidden);
    return () => {
      window.removeEventListener('pagehide', flush);
      window.removeEventListener('online', flush);
      document.removeEventListener('visibilitychange', hidden);
      queue.dispose();
      if (draftQueue.current === queue) draftQueue.current = null;
    };
  }, [lesson, moduleId, previewMode, userId]);

  const requiredBlocks = useMemo(() => lesson?.blocks.filter((block) => block.required) || [], [lesson]);
  const allComplete = requiredBlocks.length > 0 && requiredBlocks.every((block) => completed.has(block.key));
  const currentBlock = lesson?.blocks[currentIndex] || null;
  const requiredCompleted = requiredBlocks.filter((block) => completed.has(block.key)).length;
  const progressPercent = requiredBlocks.length ? Math.round(100 * requiredCompleted / requiredBlocks.length) : 0;

  useEffect(() => {
    onSlideProgress?.(requiredCompleted, requiredBlocks.length);
  }, [requiredCompleted, requiredBlocks.length, onSlideProgress]);

  useEffect(() => {
    if (!allComplete || completionReported.current) return;
    completionReported.current = true;
    if (!userId) onComplete?.();
    if (lockAfterComplete && !isUnlocked && !hasFullAccess) setShowPreviewGate(true);
  }, [allComplete, hasFullAccess, isUnlocked, lockAfterComplete, onComplete, userId]);

  const saveDraftState = useCallback((blockKey: string, state: JsonObject) => {
    setBlockState((previous) => ({ ...previous, [blockKey]: state }));
    draftQueue.current?.enqueue(blockKey, state);
  }, []);

  const goTo = useCallback((index: number) => {
    if (!lesson) return;
    const bounded = Math.max(0, Math.min(lesson.blocks.length - 1, index));
    setCurrentIndex(bounded);
    const block = lesson.blocks[bounded];
    if (block) {
      draftQueue.current?.enqueue(block.key);
      void draftQueue.current?.flush();
    }
    window.requestAnimationFrame(() => document.querySelector('[data-lesson-block]')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }, [lesson]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.altKey && event.key === 'ArrowLeft') { event.preventDefault(); goTo(currentIndex - 1); }
      if (event.altKey && event.key === 'ArrowRight' && (currentBlock ? completed.has(currentBlock.key) || !currentBlock.required : false)) { event.preventDefault(); goTo(currentIndex + 1); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [completed, currentBlock, currentIndex, goTo]);

  if (loading) return <LessonSkeleton />;
  if (error) return <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border academy-accent-border academy-surface p-8 text-center"><i className="ri-wifi-off-line text-4xl academy-accent" /><h2 className="mt-4 text-xl font-semibold academy-text">Връзката прекъсна</h2><p className="mt-2 max-w-md text-sm leading-6 academy-muted">{error}</p><button type="button" onClick={() => setReloadKey((key) => key + 1)} className="mt-5 rounded-xl academy-primary px-5 py-3 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-red-300">Опитай отново</button></div>;
  if (!lesson || !lesson.blocks.length) return <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border academy-border academy-surface p-8 text-center"><i className="ri-tools-line text-4xl academy-subtle" /><h2 className="mt-4 text-xl font-semibold academy-text">Урокът се подготвя</h2><p className="mt-2 max-w-md text-sm leading-6 academy-muted">Съдържанието още не е публикувано. Можеш да продължиш с друг урок от менюто.</p></div>;
  if (!currentBlock) return null;

  const canAdvance = completed.has(currentBlock.key) || !currentBlock.required;
  const isLast = currentIndex === lesson.blocks.length - 1;

  return <div className="mx-auto flex min-h-full w-full max-w-4xl flex-col pb-28 academy-text" data-testid="lesson-engine-v2">
    <header className="mb-5 overflow-hidden rounded-3xl border academy-border academy-card-gradient p-5 shadow-2xl academy-shadow sm:p-7 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold academy-body"><span className="rounded-full border academy-accent-border academy-accent-bg px-3 py-1 academy-accent">Практически урок</span><span><i className="ri-time-line mr-1" />{lessonReadingDuration(moduleId, lesson.lessonId, countVisibleLessonWords(lesson))}</span><span><i className="ri-star-line mr-1 academy-warning" />{xp} XP</span></div>
        <span aria-live="polite" className={`text-xs ${saveStatus === 'error' ? 'academy-accent' : 'academy-muted'}`}>{saveStatus === 'saving' ? 'Запазване…' : saveStatus === 'saved' ? 'Прогресът е запазен' : saveStatus === 'error' ? 'Проблем при запазване' : userId ? 'Автоматично запазване' : 'Практика без профил'}</span>
      </div>
      <h1 className="mt-5 break-words text-2xl font-semibold leading-[1.15] tracking-tight [overflow-wrap:anywhere] sm:text-4xl">{lesson.title}</h1>
      {lesson.subtitle && <p className="mt-3 max-w-2xl text-base leading-7 academy-body">{lesson.subtitle}</p>}
      <p className="mt-3 text-xs leading-5 academy-muted">Ориентир само за четене. За упражненията отдели време според своята задача и темпо.</p>
      {!lesson.blocks.some(block => block.type === 'objective') && <>
        <div className="mt-5"><LessonGlossary key={lesson.id} text={`${lesson.title}\n${lesson.subtitle ?? ''}\n${lesson.objective}`} /></div>
        <div className="mt-5 border-t academy-border pt-4"><p className="text-sm leading-7 academy-body">{lesson.objective}</p></div>
      </>}
      <div className="mt-6"><div className="mb-2 flex items-center justify-between text-xs academy-body"><span>Напредък в урока</span><span className="font-semibold academy-text">{progressPercent}% · {requiredCompleted}/{requiredBlocks.length} задължителни стъпки</span></div><div className="h-2.5 overflow-hidden rounded-full academy-tint-strong"><div className="h-full rounded-full bg-gradient-to-r from-red-600 to-red-400 transition-[width] motion-reduce:transition-none" style={{ width: `${progressPercent}%` }} /></div></div>
    </header>

    {lesson.versionChanged && <p role="status" className="mb-5 rounded-2xl border academy-warning-border academy-warning-bg p-4 text-sm leading-6 academy-warning">Урокът е обновен. Започни новите задачи; предишният ти резултат е запазен.</p>}
    {lesson.priorProgress && <p className="mb-5 rounded-2xl border academy-success-border academy-success-bg p-4 text-sm leading-6 academy-success">Предишен резултат: версия {lesson.priorProgress.version ?? 'по-ранна'}, {lesson.priorProgress.completedBlocks} завършени стъпки, {lesson.priorProgress.xp} XP{lesson.priorProgress.completedAt ? ' · завършен урок' : ''}. Резултатът е запазен в историята.</p>}
    {saveStatus === 'error' && <button type="button" onClick={() => void draftQueue.current?.flush()} className="mb-5 rounded-xl border academy-accent-border p-3 text-sm academy-accent">Опитай отново да запазиш бележките</button>}
    {visitFailed && <button type="button" onClick={() => void saveVisit()} className="mb-5 rounded-xl border academy-accent-border p-3 text-sm academy-accent">Последният урок не е синхронизиран. Опитай отново.</button>}

    {completed.size > 0 && <details className="mb-5 rounded-2xl border academy-success-border academy-success-bg p-4 sm:p-5">
      <summary className="cursor-pointer text-sm font-semibold academy-success">Завършени стъпки · {requiredCompleted}/{requiredBlocks.length}</summary>
      <ul className="mt-3 flex flex-wrap gap-2">{lesson.blocks.filter((block) => completed.has(block.key)).map((block) => <li key={block.key} className="rounded-full border academy-success-border academy-success-bg px-3 py-1.5 text-xs academy-success"><i className="ri-check-line mr-1" />{block.title}</li>)}</ul>
      {masteryStatus === 'mastered' && <p className="mt-3 text-sm font-medium academy-text">{['s02-m01', 's02-m02', 's02-m03'].includes(moduleId) && lesson.blocks.some(block => block.key.startsWith('checkpoint_video_')) ? 'Задължителните стъпки са преминати. Новите проверки по избор се отчитат отделно.' : 'Проверките на знанията в урока са преминати.'}</p>}
    </details>}

    {moduleId.startsWith('s01-') && <div className="mb-5 rounded-2xl border academy-border p-4 text-sm leading-6 academy-body">
      <a href="/academy-labs/silk-road/start" className="font-semibold academy-accent underline underline-offset-4">Начален маршрут и учебна папка</a>
      <a href={`/academy-tools/silk-road?module=${moduleId}`} className="ml-4 inline-block font-semibold academy-accent underline underline-offset-4">Инструменти за модула</a>
      <p className="mt-2">Започни с предоставения казус или се върни към проверката на своя прототип.</p>
      {lesson.blocks.filter(block => block.key.startsWith('checkpoint_')).map(block => <p key={block.key} className="mt-2">
        {typeof block.content.skillName === 'string' ? block.content.skillName : block.title}: <span className={completed.has(block.key) ? 'academy-success' : 'academy-muted'}>{completed.has(block.key) ? 'премината учебна проверка' : 'още няма премината проверка'}</span>
      </p>)}
    </div>}

    {moduleId.startsWith('s02-') && <div className="mb-5 rounded-2xl border academy-border p-4 text-sm leading-6 academy-body">
      <a href={`/academy-tools/perfect-video?module=${moduleId}`} className="font-semibold academy-accent underline underline-offset-4">Инструменти за модула и работилница с ИИ</a>
      <p className="mt-2">{videoClientStage(moduleId)?.result}</p>
      <a href="/academy-labs/perfect-video/start#client-project" className="mt-2 inline-block font-semibold academy-accent underline underline-offset-4">Учебна поръчка V-1: монтаж, цена и предаване</a>
      {videoProductionStage(moduleId) && <a href={`/academy-labs/perfect-video/start?stage=${videoProductionStage(moduleId)}#client-production`} className="mt-2 block font-semibold academy-accent underline underline-offset-4">Продължи V-1: сценарий, камера, светлина и звук</a>}
    </div>}

    {['s02-m01', 's02-m02', 's02-m03'].includes(moduleId) && <div className="mb-5 rounded-2xl border academy-border p-4 text-sm leading-6 academy-body">
      <a href="/academy-labs/perfect-video/start" className="font-semibold academy-accent underline underline-offset-4">Първи клип: учебна поръчка и работна маса</a>
      <p className="mt-2">Започни с предоставения бриф, сравни монтажите и проследи разчета. Самостоятелните решения се проверяват в задачите на урока.</p>
      {lesson.blocks.filter(block => block.key.startsWith('checkpoint_video_')).map(block => <p key={block.key} className="mt-2">
        {typeof block.content.skillName === 'string' ? block.content.skillName : block.title}: <span className={completed.has(block.key) ? 'academy-success' : 'academy-muted'}>{completed.has(block.key) ? 'премината учебна проверка' : 'още няма премината проверка'}</span>
      </p>)}
    </div>}

    <VideoPracticeBridge moduleId={moduleId} />

    <div className="mb-2 flex items-center justify-between gap-4"><p className="text-[11px] font-bold uppercase tracking-[.18em] academy-subtle">Стъпка {currentIndex + 1} от {lesson.blocks.length}</p><span className="hidden shrink-0 text-xs academy-subtle md:inline">Alt + ← / →</span></div>
    <nav aria-label="Стъпки на урока" className="mb-5 flex gap-2 overflow-x-auto pb-2">{lesson.blocks.map((block, index) => <button key={block.key} type="button" aria-label={`Стъпка ${index + 1}: ${block.title}`} aria-current={index === currentIndex ? 'step' : undefined} onClick={() => goTo(index)} className={`grid h-9 min-w-9 place-items-center rounded-xl border text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 ${index === currentIndex ? 'academy-accent-border academy-primary text-white' : completed.has(block.key) ? 'academy-success-border academy-success-bg academy-success' : 'academy-border academy-tint academy-subtle'}`}>{completed.has(block.key) ? <i className="ri-check-line" aria-hidden /> : index + 1}</button>)}</nav>

    <div data-lesson-block className="scroll-mt-24">
      <LessonBlockRenderer key={`${lesson.versionId}:${currentBlock.key}`} block={currentBlock} lessonId={lesson.lessonId} moduleId={moduleId} initialState={blockState[currentBlock.key]} completed={completed.has(currentBlock.key)} onStateChange={(state) => saveDraftState(currentBlock.key, state)} onSubmit={async (payload) => {
        const saved = await draftQueue.current?.flush();
        if (saved === false) throw new Error('Бележките още не са запазени. Провери връзката и опитай отново.');
        const response = await completeLessonBlock(lesson, currentBlock, payload);
        if (userId && response.progress) notifyLearningProgressChanged(userId);
        if (response.feedback.complete === true) {
          setCompleted((previous) => new Set(previous).add(currentBlock.key));
          if (!userId && !completed.has(currentBlock.key)) setXp(previous => previous + currentBlock.points);
        }
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

    <div className="fixed inset-x-0 bottom-0 z-30 border-t academy-border academy-nav px-4 pb-[calc(.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl md:sticky md:mt-5 md:rounded-2xl md:border md:p-3" aria-label="Навигация в урока">
      {!canAdvance && !isLast && <p className="mb-2 text-center text-xs academy-warning">{lessonBlockPresentation(currentBlock).continueHint}</p>}
      <div className="mx-auto flex max-w-4xl items-center gap-3"><button type="button" disabled={currentIndex === 0} onClick={() => goTo(currentIndex - 1)} className="rounded-xl border academy-border px-4 py-3 text-sm academy-body disabled:opacity-30"><i className="ri-arrow-left-line mr-2" aria-hidden="true" />Назад</button><div className="min-w-0 flex-1 text-center text-xs academy-muted"><span className="hidden sm:inline">Стъпка </span>{currentIndex + 1} / {lesson.blocks.length}</div>{!isLast ? <button type="button" disabled={!canAdvance} title={!canAdvance ? 'Завърши текущата задача' : undefined} onClick={() => goTo(currentIndex + 1)} className="rounded-xl academy-primary px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-950/30 disabled:cursor-not-allowed disabled:academy-disabled disabled:academy-subtle disabled:shadow-none">Следваща<i className="ri-arrow-right-line ml-2" aria-hidden="true" /></button> : hasNextLesson ? <button type="button" disabled={!allComplete} onClick={onNextLesson} className="rounded-xl academy-primary px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:academy-disabled disabled:academy-subtle">Следващ урок<i className="ri-arrow-right-line ml-2" aria-hidden="true" /></button> : <span className={`rounded-xl px-5 py-3 text-sm font-semibold ${allComplete ? 'academy-success-bg academy-success' : 'academy-raised academy-subtle'}`}>{allComplete ? 'Урокът е завършен' : 'Завърши всички задачи'}</span>}</div>
    </div>

    {showPreviewGate && <div role="dialog" aria-modal="true" aria-labelledby="preview-gate-title" className="fixed inset-0 z-50 grid place-items-center bg-black/85 p-5"><div className="max-w-md rounded-3xl border academy-accent-border academy-raised p-7 text-center shadow-2xl"><i className="ri-lock-unlock-line text-4xl academy-accent" /><h2 id="preview-gate-title" className="mt-4 text-2xl font-semibold">Продължи с пълен достъп</h2><p className="mt-3 leading-7 academy-muted">Завърши безплатния преглед. Влез в профила си или отключи програмата, за да запазиш напредъка си и да продължиш.</p><button type="button" onClick={() => setShowPreviewGate(false)} className="mt-5 rounded-xl border academy-border-strong px-5 py-3 text-sm">Прегледай отговорите</button></div></div>}
  </div>;
}

function LessonSkeleton() {
  return <div aria-label="Зареждане на урока" className="animate-pulse space-y-5 motion-reduce:animate-none"><div className="h-44 rounded-3xl academy-tint" /><div className="h-2 rounded-full academy-tint-strong" /><div className="h-[420px] rounded-3xl academy-tint" /></div>;
}
