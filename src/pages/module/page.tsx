import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import DashboardNav from '@/pages/dashboard/components/DashboardNav';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { academyPixel } from '@/lib/metaPixel';
import { C } from '@/pages/module/constants';
import type { LessonProgress, ModuleProgressMap } from '@/pages/module/types';
import { findModule, saveProgress, loadQuizQuestions, getNextModuleId, getPdfUrl } from '@/pages/module/utils';
import type { QuizQuestion } from '@/lib/academy-content';
import LockedModuleScreen from '@/pages/module/components/LockedModuleScreen';
import ModuleSidebar from '@/pages/module/components/ModuleSidebar';
import MobileLessonSheet from '@/pages/module/components/MobileLessonSheet';
import LessonContentViewer from '@/pages/module/components/LessonContentViewer';
import { dispatchLevelUp } from '@/components/feature/LevelUpToast';

/* ─── Module Page (Orchestrator) ─── */
export default function ModulePage() {
  const { moduleId } = useParams<{ moduleId: string }>();
  return <ModuleView key={moduleId} moduleId={moduleId} />;
}

function ModuleView({ moduleId }: { moduleId: string | undefined }) {
  const { user, hasFullAccess, unlockedModules, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const found = useMemo(() => {
    if (!moduleId) return null;
    return findModule(moduleId);
  }, [moduleId]);

  const section = found?.section || null;
  const mod = found?.mod || null;
  const lessonParam = searchParams.get('lesson');
  const requestedLesson = lessonParam !== null && /^\d+$/.test(lessonParam) ? Number(lessonParam) : 0;
  const activeLessonIndex = requestedLesson < (mod?.lessons.length || 0) ? requestedLesson : 0;

  /* ─── State ─── */
  const checkoutRequest = useRef(crypto.randomUUID());
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const [progressMap, setProgressMap] = useState<ModuleProgressMap>();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const [prefetchedQuestions, setPrefetchedQuestions] = useState<QuizQuestion[]>([]);
  const [prefetchLoading, setPrefetchLoading] = useState(false);
  // Resume + slide progress tracking
  const hasAutoResumed = useRef(false);
  const [slideProgressMap, setSlideProgressMap] = useState<Record<string, { seen: number; total: number }>>();

  // Public Module 1 support
  const isModule1 = moduleId === 's01-m01';
  const [localCompletedLessons, setLocalCompletedLessons] = useState<string[]>([]);

  // Next module for completion banner
  const nextModule = useMemo(() => {
    if (!moduleId) return null;
    return getNextModuleId(moduleId);
  }, [moduleId]);

  // Level tracking — compute early before any conditional returns
  const previousLevelRef = useRef(0);
  const totalPoints = useMemo(() => {
    if (!mod || !Array.isArray(mod.lessons)) return 0;
    if (isModule1 && !user) return localCompletedLessons.length * 10;
    return mod.lessons.reduce((sum, lesson) => sum + (progressMap?.[lesson.id]?.xp || 0), 0);
  }, [mod, progressMap, isModule1, user, localCompletedLessons]);

  const currentLevel = useMemo(() => {
    const thresholds = [0, 50, 150, 300, 500, 750, 1000, 1500, 2000, 3000];
    let level = 1;
    for (let i = 1; i < thresholds.length; i++) {
      if (totalPoints >= thresholds[i]) level = i + 1;
    }
    return level;
  }, [totalPoints]);

  useEffect(() => {
    if (previousLevelRef.current > 0 && currentLevel > previousLevelRef.current) {
      dispatchLevelUp(currentLevel, totalPoints);
    }
    previousLevelRef.current = currentLevel;
  }, [currentLevel, totalPoints]);

  /* ─── Academy Pixel ViewContent ─── */
  useEffect(() => {
    if (mod?.title) {
      academyPixel.viewContent(mod.title);
    }
  }, [moduleId, mod?.title]);

  /* ─── Progress loading ─── */
  useEffect(() => {
    setProgressMap(undefined);
    if (!user || !mod || !Array.isArray(mod.lessons)) return;
    let cancelled = false;

    (async () => {
      try {
        const lessonIds = mod.lessons.map((l) => l.id).filter(Boolean);
        const { data, error } = await supabase.rpc('academy_get_module_progress', { p_module: mod.id });
        if (error) throw error;

        if (cancelled) return;

        const map: ModuleProgressMap = {};
        lessonIds.forEach((lid) => {
          map[lid] = { completed: false, pageNumber: 1, totalPages: 0, quizScore: null, quizTotal: null };
        });
        if (data && Array.isArray(data)) {
          data.forEach((row) => {
            if (row && typeof row === 'object' && typeof row.lessonId === 'string') {
              map[row.lessonId] = {
                completed: row.completed === true,
                pageNumber: 1,
                totalPages: 0,
                quizScore: typeof row.scorePercent === 'number' ? row.scorePercent : null,
                quizTotal: typeof row.scorePercent === 'number' ? 100 : null,
                xp: typeof row.xp === 'number' ? row.xp : 0,
                scorePercent: typeof row.scorePercent === 'number' ? row.scorePercent : null,
                masteryStatus: row.masteryStatus === 'mastered' || row.masteryStatus === 'practicing' ? row.masteryStatus : 'learning',
                currentBlockKey: typeof row.currentBlockKey === 'string' ? row.currentBlockKey : null,
                lastActivityAt: typeof row.lastActivityAt === 'string' ? row.lastActivityAt : null,
              };
            }
          });
        }
        setProgressMap(map);
      } catch {
        if (!cancelled) setErrorMsg('Грешка при зареждане на прогреса');
      }
    })();

    return () => { cancelled = true; };
  }, [user, mod]);

  /* ─── Auto-resume to first incomplete lesson ─── */
  useEffect(() => {
    if (hasAutoResumed.current || !mod) return;
    // An explicit link always wins, even before progress has loaded.
    if (lessonParam !== null || !user) {
      hasAutoResumed.current = true;
      return;
    }
    if (!progressMap) return;
    const firstIncomplete = mod.lessons.findIndex((l) => {
      const p = progressMap[l.id];
      return !p || !p.completed;
    });
    if (firstIncomplete > 0 && firstIncomplete < mod.lessons.length) {
      navigate(`/module/${moduleId}?lesson=${firstIncomplete}`, { replace: true });
    }
    hasAutoResumed.current = true;
  }, [progressMap, mod, lessonParam, moduleId, navigate, user]);

  /* ─── Notes loading ─── */
  useEffect(() => {
    if (!moduleId) return;
    try {
      const raw = localStorage.getItem(`module-notes-${moduleId}`);
      setNotes(raw || '');
    } catch {
      setNotes('');
    }
  }, [moduleId]);

  const activePdfLesson = mod?.lessons?.[activeLessonIndex];
  useEffect(() => {
    let active = true;
    setPdfUrl(null);
    if (!moduleId || !activePdfLesson?.id || !activePdfLesson.pdfPath) return;
    setPdfLoading(true);
    getPdfUrl(moduleId, activePdfLesson.id).then(url => { if (active) setPdfUrl(url); })
      .finally(() => { if (active) setPdfLoading(false); });
    return () => { active = false; };
  }, [moduleId, activePdfLesson, user?.id]);

  const [serverAccess, setServerAccess] = useState<{ module: string; user: string; allowed: boolean; failed: boolean } | null>(null);
  useEffect(() => {
    if (!moduleId) return;
    let active = true;
    setServerAccess(null);
    void supabase.rpc('academy_has_module_access', { p_module: moduleId }).then(({ data, error }) => {
      if (active) setServerAccess({ module: moduleId, user: user?.id || '', allowed: !error && data === true, failed: !!error });
    });
    return () => { active = false; };
  }, [moduleId, user?.id, hasFullAccess, unlockedModules]);



  /* ─── Quiz prefetch ─── */
  useEffect(() => {
    if (!mod || !Array.isArray(mod.lessons)) return;
    const lesson = mod.lessons[activeLessonIndex];
    if (!lesson || !lesson.id || !lesson.hasQuiz) {
      setPrefetchedQuestions([]);
      return;
    }

    let cancelled = false;
    setPrefetchLoading(true);

    loadQuizQuestions(String(mod.id), lesson.id)
      .then((qs) => {
        if (!cancelled) {
          setPrefetchedQuestions(qs);
          setPrefetchLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setPrefetchedQuestions([]);
          setPrefetchLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [activeLessonIndex, mod, user?.id]);

  /* ─── Actions ─── */
  const markLessonComplete = useCallback(async (lessonId: string) => {
    if (isModule1 && !user) {
      setLocalCompletedLessons((prev) => {
        if (prev.includes(lessonId)) return prev;
        return [...prev, lessonId];
      });
      setProgressMap((prev) => {
        const existing = prev || {};
        const current = existing[lessonId] || { completed: false, pageNumber: 1, totalPages: 0, quizScore: null, quizTotal: null };
        return { ...existing, [lessonId]: { ...current, completed: true } };
      });
      return;
    }
    if (!user || !mod || !lessonId) return;
    setSaveStatus('saving');

    try {
      const current = progressMap?.[lessonId] || { completed: false, pageNumber: 1, totalPages: 0, quizScore: null, quizTotal: null };
      const next = { ...current, completed: true };
      setProgressMap((prev) => ({ ...prev, [lessonId]: next }));
      await saveProgress(user.id, mod.id, lessonId, next);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch {
      setSaveStatus('idle');
    }
  }, [user, mod, progressMap, isModule1]);

  const handleQuizComplete = useCallback(async (score: number, total: number) => {
    if (isModule1 && !user) {
      setShowQuiz(false);
      return;
    }
    if (!user || !mod) return;
    const lessons = mod.lessons || [];
    const lesson = lessons[activeLessonIndex];
    if (!lesson) return;
    const lid = lesson.id;

    setSaveStatus('saving');
    try {
      const current = progressMap?.[lid] || { completed: false, pageNumber: 1, totalPages: 0, quizScore: null, quizTotal: null };
      const next = { ...current, quizScore: score, quizTotal: total };
      setProgressMap((prev) => ({ ...prev, [lid]: next }));
      await saveProgress(user.id, mod.id, lid, next);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
      setShowQuiz(false);
    } catch {
      setSaveStatus('idle');
    }
  }, [user, mod, activeLessonIndex, progressMap, isModule1]);

  const changeLesson = useCallback((idx: number) => {
    setMobileSidebarOpen(false);
    if (!mod?.lessons[idx]) return;
    hasAutoResumed.current = true;
    if (idx === activeLessonIndex) return;

    // Use React Router navigate instead of raw history.replaceState
    navigate(`/module/${moduleId}?lesson=${idx}`);

    /* persist last-opened lesson before navigating away */
    if (user && mod && Array.isArray(mod.lessons) && mod.lessons[idx]) {
      const lesson = mod.lessons[idx];
      const payload = {
        moduleId: mod.id,
        lessonIndex: idx,
        lessonTitle: lesson.title,
        sectionTitle: section?.title || '',
        timestamp: new Date().toISOString(),
      };
      /* localStorage for instant cross-page access */
      try {
        localStorage.setItem('tavora_last_opened_lesson', JSON.stringify(payload));
      } catch { /* ignore */ }
      /* Supabase for cross-device persistence */
      supabase
        .from('profiles')
        .update({ last_opened_lesson: payload })
        .eq('id', user.id)
        .then(() => {}, () => {});
    }

    setShowQuiz(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeLessonIndex, user, mod, section, moduleId, navigate]);

  const goNext = useCallback(() => {
    if (!mod || !Array.isArray(mod.lessons)) return;
    const next = Math.min(mod.lessons.length - 1, activeLessonIndex + 1);
    changeLesson(next);
  }, [mod, activeLessonIndex, changeLesson]);

  const goPrev = useCallback(() => {
    const prev = Math.max(0, activeLessonIndex - 1);
    changeLesson(prev);
  }, [activeLessonIndex, changeLesson]);

  const isModuleUnlocked = isModule1 || (serverAccess?.module === moduleId &&
    serverAccess?.user === (user?.id || '') && serverAccess?.allowed === true);

  /* ─── Slide progress handler ─── */
  const handleSlideProgress = useCallback((lessonId: string, seen: number, total: number) => {
    setSlideProgressMap((prev) => {
      if (prev?.[lessonId]?.seen === seen && prev[lessonId].total === total) return prev;
      return { ...prev, [lessonId]: { seen, total } };
    });
  }, []);

  const handleTrustedLessonProgress = useCallback((lessonId: string, progress: { completed: boolean; xp: number; scorePercent: number | null; masteryStatus: 'learning' | 'practicing' | 'mastered' }) => {
    setProgressMap((previous) => {
      const current = previous?.[lessonId] || { completed: false, pageNumber: 1, totalPages: 0, quizScore: null, quizTotal: null };
      return { ...previous, [lessonId]: { ...current, completed: progress.completed, xp: progress.xp, scorePercent: progress.scorePercent, masteryStatus: progress.masteryStatus } };
    });
  }, []);

  const handleUnlock = useCallback(async (tier: string = 'koprinena-pateka') => {
    if (!user) return;
    setCheckoutLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const url = `${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/academy-stripe-checkout`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tier, request_id: checkoutRequest.current }),
      });
      const json = await res.json();
      if (json.url) {
        // Use direct redirect for external Stripe checkout URL
        (window as Window).location.href = json.url;
      } else {
        setErrorMsg('Грешка при създаване на плащане: ' + (json.error || 'Неизвестна грешка'));
      }
    } catch {
      setErrorMsg('Грешка при свързване с платежната система');
    } finally {
      setCheckoutLoading(false);
    }
  }, [user]);

  const handleRefreshAccess = useCallback(async () => {
    await refreshProfile();
    window.location.reload();
  }, [refreshProfile]);

  /* ─── Derived ─── */
  const safeProgress = useCallback((lid: string): LessonProgress => {
    if (!progressMap) return { completed: false, pageNumber: 1, totalPages: 0, quizScore: null, quizTotal: null };
    const p = progressMap[lid];
    if (p && typeof p === 'object') return p;
    return { completed: false, pageNumber: 1, totalPages: 0, quizScore: null, quizTotal: null };
  }, [progressMap]);

  if (!found || !mod || !section) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: C.bg }}>
        <div className="text-center">
          <p className="text-base mb-2" style={{ color: C.textMuted }}>Модулът не е намерен</p>
          <Link to="/kurs" className="text-sm transition-colors" style={{ color: C.accent }}>Обратно към платформата</Link>
        </div>
      </div>
    );
  }

  if (!isModule1 && (!serverAccess || serverAccess.failed)) {
    return <div className="min-h-screen" style={{ background: C.bg }}>
      <DashboardNav />
      <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center gap-4 p-6 text-center text-zinc-300">
        <p role="status">{serverAccess?.failed ? 'Не успяхме да проверим достъпа ти. Опитай отново.' : 'Зареждане на модула…'}</p>
        {serverAccess?.failed && <button type="button" onClick={handleRefreshAccess} className="rounded-xl border border-white/20 px-5 py-3">Опитай отново</button>}
      </div>
    </div>;
  }

  if (!isModuleUnlocked) {
    return (
      <div className="min-h-screen" style={{ background: C.bg }}>
        <DashboardNav />
        <LockedModuleScreen
          moduleTitle={mod.title}
          moduleId={mod.id}
          onUnlock={handleUnlock}
          onRefresh={handleRefreshAccess}
        />
      </div>
    );
  }

  const lessons = Array.isArray(mod.lessons) ? mod.lessons : [];
  const activeLesson = lessons[activeLessonIndex] || null;

  if (!activeLesson) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: C.bg }}>
        <div className="text-center">
          <p className="text-base mb-2" style={{ color: C.textMuted }}>Урокът не е намерен</p>
          <Link to="/kurs" className="text-sm transition-colors" style={{ color: C.accent }}>Обратно към платформата</Link>
        </div>
      </div>
    );
  }

  const currentProg = safeProgress(activeLesson.id);
  const isLessonCompleted = !!currentProg.completed;

  const completedCount = isModule1 && !user
    ? localCompletedLessons.length
    : lessons.filter((l) => safeProgress(l.id).completed).length;
  const progressPercent = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;
  const allCompleted = completedCount === lessons.length && lessons.length > 0;
  const hasNextLesson = activeLessonIndex < lessons.length - 1;
  const hasPrevLesson = activeLessonIndex > 0;

  return (
    <div className="min-h-screen" style={{ background: C.bg }}>
      <DashboardNav />

      {/* Error Banner */}
      {errorMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 text-sm" style={{ background: C.accentDim, border: `1px solid ${C.accent}`, color: C.accent }}>
          {errorMsg}
          <button onClick={() => setErrorMsg('')} className="ml-3 font-bold">×</button>
        </div>
      )}

      {/* Mobile Bottom Sheet */}
      <MobileLessonSheet
        open={mobileSidebarOpen}
        sectionTitle={section.title}
        modTitle={mod.title}
        lessons={lessons}
        activeLessonIndex={activeLessonIndex}
        completedCount={completedCount}
        totalLessons={lessons.length}
        safeProgress={safeProgress}
        onChangeLesson={changeLesson}
        onClose={() => setMobileSidebarOpen(false)}
      />

      <div className="mx-auto max-w-[1520px] px-4 py-4 md:px-6 md:py-6 xl:px-8">
        <div className="flex items-center justify-between gap-3 mb-3 md:mb-5">
          <nav aria-label="Място в курса" className="flex min-w-0 items-center gap-2 text-xs md:text-sm" style={{ color: C.textMuted }}>
            <Link to="/kurs" className="shrink-0 py-2 hover:text-white">Всички модули</Link>
            <i className="ri-arrow-right-s-line shrink-0" aria-hidden />
            <span className="truncate">{mod.title} · М{mod.number}</span>
          </nav>
          <div className="flex items-center gap-2 shrink-0">
            <span className="flex items-center gap-1.5 px-2.5 py-1 md:px-3 md:py-1.5 text-xs md:text-sm font-medium whitespace-nowrap" style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text }}>
              <i className="ri-award-line" style={{ color: C.accent }} />{totalPoints}
            </span>
            {saveStatus === 'saving' && <span className="text-xs flex items-center gap-1 hidden md:flex" style={{ color: C.textDim }}><i className="ri-loader-4-line animate-spin" style={{ fontSize: '10px' }} />Запис...</span>}
            {saveStatus === 'saved' && <span className="text-xs flex items-center gap-1 hidden md:flex font-medium" style={{ color: C.success }}><i className="ri-check-line" style={{ fontSize: '10px' }} />Запазено</span>}
          </div>
        </div>

        {/* Module progress bar — hidden on mobile, shown on md+ */}
        <div className="mb-3 md:mb-5 hidden md:block">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium uppercase tracking-wider" style={{ color: C.textDim }}>Прогрес на модула</span>
            <span className="text-xs font-bold" style={{ color: C.textMuted }}>{progressPercent}%</span>
          </div>
          <div className="w-full overflow-hidden" style={{ height: '3px', background: C.border }}>
            <div
              className="h-full transition-all duration-700"
              style={{ width: `${progressPercent}%`, background: C.accent }}
            />
          </div>
        </div>

        {/* Mobile Lesson Toggle — compact with mini-progress */}
        <button
          type="button"
          aria-label="Уроци в модула"
          aria-haspopup="dialog"
          aria-expanded={mobileSidebarOpen}
          aria-controls="module-lessons-dialog"
          onClick={() => setMobileSidebarOpen(true)}
          className="lg:hidden w-full flex items-center justify-between px-3 py-2.5 mb-3 text-left cursor-pointer"
          style={{ background: C.surface, border: `1px solid ${C.border}` }}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-7 h-7 flex items-center justify-center shrink-0 text-xs font-semibold"
              style={{ background: isLessonCompleted ? C.success : C.accent, color: '#fff' }}
            >
              {isLessonCompleted ? <i className="ri-check-line" /> : <span>{activeLessonIndex + 1}</span>}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium" style={{ color: C.text }}>Уроци в модула</p>
              <p className="text-xs leading-5" style={{ color: C.textMuted }}>{activeLesson.title}</p>
              <p className="text-[10px]" style={{ color: C.textDim }}>{activeLesson.duration} · {completedCount}/{lessons.length} завършени</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Mini progress bar */}
            <div className="hidden xs:flex items-center gap-1.5">
              <div className="w-12 overflow-hidden" style={{ height: '2px', background: C.border }}>
                <div
                  className="h-full transition-all duration-700"
                  style={{ width: `${progressPercent}%`, background: C.accent }}
                />
              </div>
              <span className="text-[10px] font-mono" style={{ color: C.textDim }}>{progressPercent}%</span>
            </div>
            <i className="ri-arrow-up-s-line text-lg" style={{ color: C.textDim }} />
          </div>
        </button>

        <div className="grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)] xl:gap-7">
          {/* Desktop Sidebar */}
          <ModuleSidebar
            moduleId={mod.id}
            sectionTitle={section.title}
            modTitle={mod.title}
            moduleNumber={mod.number}
            lessons={lessons}
            activeLessonIndex={activeLessonIndex}
            progressPercent={progressPercent}
            completedCount={completedCount}
            totalLessons={lessons.length}
            hasPrevLesson={hasPrevLesson}
            hasNextLesson={hasNextLesson}
            safeProgress={safeProgress}
            onChangeLesson={changeLesson}
            onGoPrev={goPrev}
            onGoNext={goNext}
            slideProgressMap={slideProgressMap}
          />

          {/* Main Content */}
          <LessonContentViewer
            moduleId={mod.id}
            modNumber={mod.number}
            modTitle={mod.title}
            modHomeworkPrompt={mod.homeworkPrompt}
            lessons={lessons}
            activeLessonIndex={activeLessonIndex}
            activeLesson={activeLesson}
            isModule1={isModule1}
            user={user}
            hasFullAccess={hasFullAccess}
            isModuleUnlocked={isModuleUnlocked}
            hasNextLesson={hasNextLesson}
            pdfLoading={pdfLoading}
            pdfUrl={pdfUrl}
            currentProg={currentProg}
            showQuiz={showQuiz}
            showNotes={showNotes}
            notes={notes}
            isLessonCompleted={isLessonCompleted}
            allCompleted={allCompleted}
            totalPoints={totalPoints}
            progressMap={progressMap || {}}
            prefetchedQuestions={prefetchedQuestions}
            saveStatus={saveStatus}
            errorMsg={errorMsg}
            setErrorMsg={setErrorMsg}
            setShowQuiz={setShowQuiz}
            setShowNotes={setShowNotes}
            setNotes={setNotes}
            markLessonComplete={markLessonComplete}
            handleQuizComplete={handleQuizComplete}
            goNext={goNext}
            setMobileSidebarOpen={setMobileSidebarOpen}
            slideProgressMap={slideProgressMap}
            onSlideProgress={handleSlideProgress}
            onTrustedProgress={handleTrustedLessonProgress}
            nextModule={nextModule}
          />
        </div>
      </div>
    </div>
  );
}
