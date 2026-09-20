import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
  const { user, hasFullAccess, unlockedModules, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const found = useMemo(() => {
    if (!moduleId) return null;
    return findModule(moduleId);
  }, [moduleId]);

  const section = found?.section || null;
  const mod = found?.mod || null;

  /* ─── State ─── */
  const checkoutRequest = useRef(crypto.randomUUID());
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const [progressMap, setProgressMap] = useState<ModuleProgressMap>();
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
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
  const [contentTransitioning, setContentTransitioning] = useState(false);
  const [contentKey, setContentKey] = useState(0);

  // Swipe-up to open mobile sheet
  const touchStartYRef = useRef(0);
  const touchStartTimeRef = useRef(0);

  // Resume + slide progress tracking
  const [hasAutoResumed, setHasAutoResumed] = useState(false);
  const [slideProgressMap, setSlideProgressMap] = useState<Record<string, { seen: number; total: number }>>();

  // Public Module 1 support
  const isModule1 = moduleId === 's01-m01';
  const [localCompletedLessons, setLocalCompletedLessons] = useState<string[]>([]);

  // Module 1 Login Gate
  const [showBreadcrumbDropdown, setShowBreadcrumbDropdown] = useState(false);
  const breadcrumbRef = useRef<HTMLDivElement>(null);

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
    let count = 0;
    for (const l of mod.lessons) {
      const p = progressMap?.[l.id];
      if (p?.completed) count++;
    }
    return count * 10;
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

  // Close breadcrumb dropdown on outside click
  useEffect(() => {
    if (!showBreadcrumbDropdown) return;
    const handler = (e: MouseEvent) => {
      if (breadcrumbRef.current && !breadcrumbRef.current.contains(e.target as Node)) {
        setShowBreadcrumbDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showBreadcrumbDropdown]);

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
        const { data } = await supabase
          .from('pdf_progress')
          .select('lesson_id, page_number, total_pages, completed, quiz_score, quiz_total')
          .eq('user_id', user.id)
          .in('lesson_id', lessonIds);

        if (cancelled) return;

        const map: ModuleProgressMap = {};
        lessonIds.forEach((lid) => {
          map[lid] = { completed: false, pageNumber: 1, totalPages: 0, quizScore: null, quizTotal: null };
        });
        if (data && Array.isArray(data)) {
          data.forEach((row) => {
            if (row && row.lesson_id) {
              map[row.lesson_id] = {
                completed: !!row.completed,
                pageNumber: row.page_number || 1,
                totalPages: row.total_pages || 0,
                quizScore: row.quiz_score ?? null,
                quizTotal: row.quiz_total ?? null,
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
    if (!progressMap || !mod || !Array.isArray(mod.lessons) || hasAutoResumed) return;

    // Check for ?lesson= param from resume navigation
    const params = new URLSearchParams(window.location.search);
    const lessonParam = params.get('lesson');
    if (lessonParam !== null) {
      const idx = parseInt(lessonParam, 10);
      if (idx >= 0 && idx < mod.lessons.length) {
        setActiveLessonIndex(idx);
      }
      setHasAutoResumed(true);
      return;
    }

    const firstIncomplete = mod.lessons.findIndex((l) => {
      const p = progressMap[l.id];
      return !p || !p.completed;
    });
    if (firstIncomplete > 0 && firstIncomplete < mod.lessons.length) {
      setActiveLessonIndex(firstIncomplete);
    }
    setHasAutoResumed(true);
  }, [progressMap, mod, hasAutoResumed]);

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

  const [serverAccess, setServerAccess] = useState<{ module: string; user: string; allowed: boolean } | null>(null);
  useEffect(() => {
    if (!moduleId) return;
    let active = true;
    setServerAccess(null);
    void supabase.rpc('academy_has_module_access', { p_module: moduleId }).then(({ data, error }) => {
      if (active) setServerAccess({ module: moduleId, user: user?.id || '', allowed: !error && data === true });
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
    if (idx === activeLessonIndex) return;

    // Use React Router navigate instead of raw history.replaceState
    navigate(`/module/${moduleId}?lesson=${idx}`, { replace: true });

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

    setContentTransitioning(true);
    setTimeout(() => {
      setActiveLessonIndex(idx);
      setShowQuiz(false);
      setMobileSidebarOpen(false);
      setContentKey((k) => k + 1);
      setContentTransitioning(false);
    }, 200);
    try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch { /* ignore */ }
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
    setSlideProgressMap((prev) => ({ ...prev, [lessonId]: { seen, total } }));
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

  const goToPlatform = useCallback(() => {
    navigate('/kurs');
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [navigate]);

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
        hasPrevLesson={hasPrevLesson}
        hasNextLesson={hasNextLesson}
        safeProgress={safeProgress}
        onChangeLesson={changeLesson}
        onGoPrev={goPrev}
        onGoNext={goNext}
        onClose={() => setMobileSidebarOpen(false)}
      />

      <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-4 md:py-6"
        onTouchStart={(e) => {
          touchStartYRef.current = e.touches[0].clientY;
          touchStartTimeRef.current = Date.now();
        }}
        onTouchEnd={(e) => {
          const diffY = touchStartYRef.current - e.changedTouches[0].clientY;
          const elapsed = Date.now() - touchStartTimeRef.current;
          // Swipe UP (diffY > 0, meaning finger moved up) with quick gesture
          if (diffY > 100 && elapsed < 300 && !mobileSidebarOpen) {
            const scrollable = (e.target as HTMLElement)?.closest('.overflow-y-auto') as HTMLElement | null;
            const atTop = !scrollable || scrollable.scrollTop <= 5;
            if (atTop) {
              setMobileSidebarOpen(true);
            }
          }
        }}
      >
        {/* Breadcrumb — with dropdown for quick lesson switching */}
        <div className="flex items-center justify-between gap-3 mb-3 md:mb-5">
          <nav className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm min-w-0" style={{ color: C.textDim }}>
            <button
              onClick={goToPlatform}
              className="hover:text-white transition-colors flex items-center gap-1 shrink-0 whitespace-nowrap cursor-pointer"
              style={{ color: C.textDim, background: 'none', border: 'none' }}
            >
              <i className="ri-home-line text-sm md:text-base" />
              <span className="hidden sm:inline" style={{ color: C.textMuted }}>Платформа</span>
            </button>
            <i className="ri-arrow-right-s-line shrink-0 text-xs" />

            {/* Lesson selector dropdown */}
            <div className="relative" ref={breadcrumbRef}>
              <button
                onClick={() => setShowBreadcrumbDropdown(!showBreadcrumbDropdown)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs md:text-sm font-medium transition-colors whitespace-nowrap cursor-pointer"
                style={{
                  background: showBreadcrumbDropdown ? C.accentDim : 'transparent',
                  border: `1px solid ${showBreadcrumbDropdown ? C.accent : 'transparent'}`,
                  color: C.textMuted,
                }}
              >
                <span className="truncate max-w-[120px] md:max-w-[180px]">{section.title} · М{mod.number}</span>
                <i className="ri-arrow-down-s-line text-sm shrink-0" style={{ color: C.textDim }} />
              </button>

              {showBreadcrumbDropdown && (
                <div
                  className="absolute top-full left-0 mt-1 z-50 w-72 max-h-[360px] overflow-y-auto shadow-lg"
                  style={{ background: C.surface, border: `1px solid ${C.border}` }}
                >
                  <div className="px-4 py-2.5" style={{ borderBottom: `1px solid ${C.border}` }}>
                    <p className="text-xs font-bold uppercase tracking-wider" style={{ color: C.textDim }}>{section.title}</p>
                    <p className="text-sm font-semibold mt-0.5" style={{ color: C.text }}>{mod.title}</p>
                  </div>
                  {lessons.map((lesson, idx) => {
                    const isActive = idx === activeLessonIndex;
                    const p = safeProgress(lesson.id);
                    const done = p.completed;
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => {
                          changeLesson(idx);
                          setShowBreadcrumbDropdown(false);
                        }}
                        className="w-full text-left px-4 py-3 flex items-center gap-3 transition-colors cursor-pointer"
                        style={{
                          background: isActive ? '#1a0505' : 'transparent',
                          borderLeft: isActive ? `3px solid ${C.accent}` : '3px solid transparent',
                          borderBottom: `1px solid ${C.border}`,
                          opacity: isActive ? 1 : 1,
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) e.currentTarget.style.background = '#141414';
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <div
                          className="w-7 h-7 flex items-center justify-center shrink-0 text-xs font-semibold"
                          style={{
                            background: done ? C.success : isActive ? C.accent : C.border,
                            color: '#fff',
                          }}
                        >
                          {done ? <i className="ri-check-line" /> : <span>{idx + 1}</span>}
                        </div>
                        <div className="min-w-0">
                          <p className={`text-sm truncate ${isActive ? 'font-medium' : ''}`} style={{ color: isActive ? C.accent : C.textMuted }}>
                            {lesson.title}
                          </p>
                          <span className="text-xs" style={{ color: C.textDim }}>{lesson.duration}</span>
                        </div>
                        {isActive && (
                          <i className="ri-check-line shrink-0 ml-auto" style={{ color: C.accent, fontSize: '10px' }} />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
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
              <p className="text-sm font-medium truncate" style={{ color: C.text }}>{activeLesson.title}</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-5">
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
            contentKey={contentKey}
            contentTransitioning={contentTransitioning}
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
            nextModule={nextModule}
          />
        </div>
      </div>
    </div>
  );
}
