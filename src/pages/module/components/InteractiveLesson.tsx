import { useState, useEffect, useCallback, useRef } from 'react';
import { getLessonData, fetchLessonData, type LessonSlide, type LessonData } from '@/mocks/interactive-lesson-data';
import { supabase } from '@/lib/supabase';
import { useFullscreen } from '@/pages/module/hooks/useFullscreen';
import LockOverlay from '@/pages/module/components/LockOverlay';

interface InteractiveLessonProps {
  moduleId: string;
  lessonId?: string;
  userId?: string;
  onComplete?: () => void;
  onNextLesson?: () => void;
  hasNextLesson?: boolean;
  lockAfterComplete?: boolean;
  isUnlocked?: boolean;
  hasFullAccess?: boolean;
  onSlideProgress?: (seen: number, total: number) => void;
}

const FALLBACK: LessonData = {
  id: 'fallback',
  title: 'Урок',
  subtitle: '',
  duration: '20 мин',
  slides: [],
};

/* ─── Brand ─── */
const B = {
  bg: '#0a0a0a',
  surface: '#111111',
  surfaceHover: '#141414',
  border: '#1a1a1a',
  borderHover: '#2a2a2a',
  accent: '#e53e3e',
  accentHover: '#ff5555',
  accentDim: '#331111',
  accentDark: '#442222',
  text: '#ffffff',
  textMuted: '#a0a0a0',
  textDim: '#666666',
  success: '#22c55e',
  successDim: '#0a1f0a',
  errorDim: '#1a0505',
};

export default function InteractiveLesson({ moduleId, lessonId, userId, onComplete, onNextLesson, hasNextLesson = false, lockAfterComplete = false, isUnlocked = false, hasFullAccess = false, onSlideProgress }: InteractiveLessonProps) {
  // ─── DATA LOADING (mock first, then Supabase override) ───
  const [lessonData, setLessonData] = useState<LessonData>(() => getLessonData(moduleId, lessonId) || FALLBACK);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setDataLoaded(false);
    // Set initial mock data immediately
    const initialData = getLessonData(moduleId, lessonId) || FALLBACK;
    if (!cancelled) setLessonData(initialData);
    
    // Then try Supabase
    fetchLessonData(moduleId, lessonId).then((supabaseData) => {
      if (!cancelled && supabaseData) {
        setLessonData(supabaseData);
      }
      if (!cancelled) setDataLoaded(true);
    });
    
    return () => { cancelled = true; };
  }, [moduleId, lessonId]);

  const slides = lessonData.slides;

  // Reset state when lesson changes
  useEffect(() => {
    setCurrentSlideIdx(0);
    setSeenSlides(new Set([0]));
    setDirection('forward');
    setAnimating(false);
    setCompletedState(false);
    setCheckpointAnswer(null);
    setCheckpointRevealed(false);
    setInteractiveRevealed(false);
  }, [lessonData.id]);

  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);
  const [seenSlides, setSeenSlides] = useState<Set<number>>(new Set([0]));
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [animating, setAnimating] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [loaded, setLoaded] = useState(false);
  const [locked, setLocked] = useState(false);
  const [showLockOverlay, setShowLockOverlay] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [checkpointAnswer, setCheckpointAnswer] = useState<number | null>(null);
  const [checkpointRevealed, setCheckpointRevealed] = useState(false);
  const [interactiveRevealed, setInteractiveRevealed] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());
  const [checklistSaving, setChecklistSaving] = useState(false);
  const [completedState, setCompletedState] = useState(false);
  const [showJumpMenu, setShowJumpMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(typeof window !== 'undefined' && window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // ─── IMMERSIVE FULLSCREEN STATE ───
  const [showSwipeHint, setShowSwipeHint] = useState(false);
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);
  const touchStartTime = useRef(0);
  const persistFullscreenRef = useRef(false);
  const scrollAtTopRef = useRef(true);

  const {
    isFullscreen: isImmersiveFS,
    containerRef,
    enterFullscreen,
    exitFullscreen,
    showControls,
    resetControlsTimer,
  } = useFullscreen();

  const currentSlide = slides.length > 0 ? slides[currentSlideIdx] : null;
  const totalSlides = slides.length;
  const progressPercent = totalSlides > 0 ? Math.round((seenSlides.size / totalSlides) * 100) : 0;
  const isLastSlide = currentSlideIdx === totalSlides - 1;
  const isFirstSlide = currentSlideIdx === 0;
  const allSeen = seenSlides.size === totalSlides && totalSlides > 0;
  const shouldLock = lockAfterComplete && allSeen && !isUnlocked && !hasFullAccess;

  // Auto re-enter fullscreen on lesson change
  useEffect(() => {
    if (persistFullscreenRef.current && !isImmersiveFS && !document.fullscreenElement) {
      const t = setTimeout(() => enterFullscreen(), 400);
      return () => clearTimeout(t);
    }
  }, [lessonData.id, isImmersiveFS, enterFullscreen]);

  // Show swipe hint after 2s on mobile (non-fullscreen)
  useEffect(() => {
    if (isImmersiveFS || document.fullscreenElement) {
      setShowSwipeHint(false);
      return;
    }
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
    if (!isMobile) return;
    const t = setTimeout(() => setShowSwipeHint(true), 2500);
    return () => clearTimeout(t);
  }, [isImmersiveFS, lessonData.id]);

  // If user gains access while locked, unlock immediately
  useEffect(() => {
    if ((isUnlocked || hasFullAccess) && locked) {
      setLocked(false);
      setShowLockOverlay(false);
    }
  }, [isUnlocked, hasFullAccess, locked]);

  // If locked while full screen, exit full screen so lock overlay is visible
  useEffect(() => {
    if (locked && showLockOverlay && (isImmersiveFS || document.fullscreenElement)) {
      exitFullscreen();
    }
  }, [locked, showLockOverlay, isImmersiveFS, exitFullscreen]);

  // Lock overlay delay
  useEffect(() => {
    if (!shouldLock) return;
    if (locked) return;
    const t = setTimeout(() => {
      if (!isUnlocked && !hasFullAccess) {
        setLocked(true);
        setTimeout(() => setShowLockOverlay(true), 300);
      }
    }, 2000);
    return () => clearTimeout(t);
  }, [shouldLock, locked, isUnlocked, hasFullAccess]);

  // Load progress
  useEffect(() => {
    if (!userId) { setLoaded(true); return; }
    let cancelled = false;
    (async () => {
      try {
        const { data } = await supabase
          .from('checklist_progress')
          .select('item_id')
          .eq('user_id', userId)
          .eq('module_id', moduleId)
          .eq('topic_id', 0)
          .eq('completed', true);
        if (cancelled || !data) return;
        const ids = new Set<number>();
        data.forEach((r: { item_id: number }) => { if (r.item_id !== null && r.item_id !== undefined) ids.add(r.item_id); });
        if (ids.size > 0) {
          setSeenSlides(ids);
          if (lockAfterComplete && ids.size >= totalSlides && !isUnlocked && !hasFullAccess) {
            setLocked(true);
            setTimeout(() => setShowLockOverlay(true), 300);
          }
        }
      } catch { /* ignore */ }
      if (!cancelled) setLoaded(true);
    })();
    return () => { cancelled = true; };
  }, [userId, moduleId, lockAfterComplete, totalSlides, isUnlocked, hasFullAccess]);

  // Load checklist items progress
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    (async () => {
      try {
        const { data } = await supabase
          .from('checklist_progress')
          .select('item_id')
          .eq('user_id', userId)
          .eq('module_id', moduleId)
          .eq('completed', true);
        if (cancelled || !data) return;
        const ids = new Set<number>();
        data.forEach((r: { item_id: number | null }) => { if (r.item_id !== null && r.item_id !== undefined) ids.add(r.item_id); });
        setCheckedItems(ids);
      } catch { /* ignore */ }
    })();
    return () => { cancelled = true; };
  }, [userId, moduleId]);

  // ─── Report slide progress to parent ───
  useEffect(() => {
    if (onSlideProgress && totalSlides > 0) {
      onSlideProgress(seenSlides.size, totalSlides);
    }
  }, [seenSlides.size, totalSlides, onSlideProgress]);

  const persistProgress = useCallback((slideIdx: number) => {
    if (!userId) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSaveStatus('saving');
    saveTimer.current = setTimeout(async () => {
      try {
        await supabase.from('checklist_progress').upsert({
          user_id: userId,
          module_id: moduleId,
          topic_id: 0,
          item_id: slideIdx,
          completed: true,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id,module_id,item_id' });
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } catch {
        setSaveStatus('idle');
      }
    }, 400);
  }, [userId, moduleId]);

  const toggleChecklistItem = useCallback(async (itemId: number) => {
    setCheckedItems(prev => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });

    if (!userId) return;
    setChecklistSaving(true);
    try {
      const isNowChecked = !checkedItems.has(itemId);
      await supabase.from('checklist_progress').upsert({
        user_id: userId,
        module_id: moduleId,
        topic_id: Math.ceil(itemId / 10),
        item_id: itemId,
        completed: isNowChecked,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,module_id,item_id' });
    } catch { /* ignore */ }
    setChecklistSaving(false);
  }, [checkedItems, userId, moduleId]);

  const goToSlide = useCallback((idx: number, dir: 'forward' | 'backward') => {
    if (animating || idx < 0 || idx >= totalSlides) return;
    if (locked) return;
    setAnimating(true);
    setDirection(dir);
    setSeenSlides(prev => {
      const next = new Set(prev);
      next.add(idx);
      persistProgress(idx);
      return next;
    });
    setCheckpointAnswer(null);
    setCheckpointRevealed(false);
    setInteractiveRevealed(false);
    setTimeout(() => {
      setCurrentSlideIdx(idx);
      setAnimating(false);
    }, 300);
  }, [animating, totalSlides, persistProgress, locked]);

  const goNext = useCallback(() => {
    if (locked) return;
    if (isLastSlide) {
      if (!completedState) {
        setCompletedState(true);
        if (onComplete) onComplete();
      }
      return;
    }
    goToSlide(currentSlideIdx + 1, 'forward');
  }, [currentSlideIdx, isLastSlide, completedState, onComplete, goToSlide, locked]);

  const goPrev = useCallback(() => {
    if (locked) return;
    goToSlide(currentSlideIdx - 1, 'backward');
  }, [currentSlideIdx, goToSlide, locked]);

  // Keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'Escape') {
        e.preventDefault();
        if (isImmersiveFS || document.fullscreenElement) {
          exitFullscreen();
          return;
        }
      }
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        goNext();
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goNext, goPrev, isImmersiveFS, exitFullscreen, isFirstSlide, isLastSlide]);

  // Touch handlers — swipe left/right + swipe up/down for fullscreen
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchStartTime.current = Date.now();
    // Detect scroll position — find the nearest scrollable ancestor
    const target = e.target as HTMLElement;
    const scrollable = target?.closest('.overflow-y-auto') as HTMLElement | null;
    scrollAtTopRef.current = !scrollable || scrollable.scrollTop <= 5;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    const diffY = touchStartY.current - e.changedTouches[0].clientY;
    const elapsed = Date.now() - touchStartTime.current;
    const isQuick = elapsed < 300;
    const absDiffX = Math.abs(diffX);
    const absDiffY = Math.abs(diffY);
    const isVertical = absDiffY > absDiffX;
    const isHorizontal = absDiffX > absDiffY;

    // If in fullscreen, swipe left/right for navigation
    if (isImmersiveFS || document.fullscreenElement) {
      if (isHorizontal && absDiffX > 50) {
        if (diffX > 0) goNext();
        else goPrev();
        return;
      }
      // Swipe down to exit fullscreen — ONLY when scroll is at TOP and gesture is deliberate
      // diffY negative = finger moved DOWN = swipe down gesture
      if (isVertical && diffY < -120 && isQuick && scrollAtTopRef.current) {
        exitFullscreen();
        return;
      }
      resetControlsTimer();
      return;
    }

    // Not in fullscreen — normal horizontal swipe for navigation
    if (isHorizontal && absDiffX > 50) {
      if (diffX > 0) goNext();
      else goPrev();
      return;
    }

    // Swipe UP to enter fullscreen — only when not scrolling content
    if (isVertical && diffY > 80 && isQuick && scrollAtTopRef.current) {
      enterFullscreen();
      return;
    }
  }, [goNext, goPrev, isImmersiveFS, enterFullscreen, exitFullscreen, resetControlsTimer]);

  // Double-click/tap to enter fullscreen on desktop
  const handleDoubleClick = useCallback(() => {
    if (!isImmersiveFS && !document.fullscreenElement) {
      enterFullscreen();
    }
  }, [isImmersiveFS, enterFullscreen]);

  const handleCheckpointSelect = useCallback((idx: number) => {
    if (checkpointRevealed) return;
    setCheckpointAnswer(idx);
    setCheckpointRevealed(true);
  }, [checkpointRevealed]);

  const isInFullscreen = isImmersiveFS || !!document.fullscreenElement;

  // Slide animation — directional slide-in + scale for premium feel (smaller on mobile)
  const transDist = isMobile ? '16px' : '40px';
  const slideAnimStyle = animating
    ? {
        transform: direction === 'forward' ? `translateX(${transDist}) scale(0.98)` : `translateX(-${transDist}) scale(0.98)`,
        opacity: 0,
        transition: 'all 0.3s cubic-bezier(0.22, 0.61, 0.36, 1)',
      }
    : {
        transform: 'translateX(0) scale(1)',
        opacity: 1,
        transition: 'all 0.3s cubic-bezier(0.22, 0.61, 0.36, 1)',
      };

  // ─── RENDERERS ───
  const renderTitleSlide = (slide: LessonSlide) => (
    <div className={`flex flex-col items-center text-center h-full overflow-y-auto py-6 md:py-8 px-3 md:px-4 ${isInFullscreen ? 'justify-center' : 'justify-start md:justify-center'}`}>
      <div className={`flex items-center justify-center mb-4 md:mb-8 shrink-0 ${isInFullscreen ? 'w-14 h-14 md:w-16 md:h-16' : 'w-10 h-10 md:w-14 md:h-14'}`} style={{ border: `1.5px solid ${B.accent}` }}>
        <i className={`ri-brain-line ${isInFullscreen ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'}`} style={{ color: B.accent }} />
      </div>
      <h2 className={`font-bold mb-3 md:mb-4 leading-tight tracking-tight ${isInFullscreen ? 'text-2xl md:text-4xl lg:text-5xl' : 'text-xl md:text-3xl lg:text-4xl'}`} style={{ color: B.text }}>
        {slide.title}
      </h2>
      {slide.subtitle && (
        <p className={`mb-4 md:mb-5 tracking-wide ${isInFullscreen ? 'text-base md:text-xl' : 'text-sm md:text-lg'}`} style={{ color: B.textMuted }}>{slide.subtitle}</p>
      )}
      {slide.body && (
        <p className={`max-w-lg leading-relaxed px-1 md:px-2 ${isInFullscreen ? 'text-base md:text-lg' : 'text-sm'}`} style={{ color: B.textMuted }}>{slide.body}</p>
      )}
      <div className="mt-6 md:mt-8 flex items-center gap-2 md:gap-3 flex-wrap justify-center">
        {[
          { icon: 'ri-stack-line', text: `${totalSlides} слайда` },
          { icon: 'ri-time-line', text: `~${lessonData.duration}` },
          { icon: 'ri-flashlight-line', text: 'Интерактивен' },
        ].map((badge) => (
          <span key={badge.text} className="flex items-center gap-1.5 px-2.5 md:px-3 py-1 md:py-1.5 text-[10px] md:text-xs" style={{ border: `1px solid ${B.border}`, color: B.textMuted }}>
            <i className={badge.icon} style={{ fontSize: '11px' }} />
            {badge.text}
          </span>
        ))}
      </div>
    </div>
  );

  const renderContentSlide = (slide: LessonSlide) => (
    <div className={`h-full overflow-y-auto px-2 py-2 ${isInFullscreen ? 'px-4 md:px-8 py-4 md:py-6' : ''}`}>
      <div className="mb-5">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em]" style={{ border: `1px solid ${B.accent}`, color: B.accent }}>
          <i className="ri-lightbulb-line" style={{ fontSize: '11px' }} />
          Ключова концепция
        </span>
      </div>
      <h3 className={`font-bold mb-4 leading-snug tracking-tight ${isInFullscreen ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'}`} style={{ color: B.text }}>{slide.title}</h3>
      {slide.subtitle && (
        <p className={`mb-6 ${isInFullscreen ? 'text-base md:text-lg' : 'text-sm md:text-base'}`} style={{ color: B.textMuted }}>{slide.subtitle}</p>
      )}
      {slide.body && (
        <p className={`leading-relaxed mb-6 ${isInFullscreen ? 'text-base md:text-lg' : 'text-sm'}`} style={{ color: B.textMuted }}>{slide.body}</p>
      )}
      {slide.highlights && slide.highlights.length > 0 && (
        <div className="space-y-3 mb-6">
          {slide.highlights.map((h, idx) => (
            <div key={idx} className="flex items-start gap-3 p-4" style={{ background: B.surface, borderLeft: `2px solid ${B.accent}` }}>
              <div className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5" style={{ border: `1px solid ${B.accent}` }}>
                <i className="ri-check-line" style={{ color: B.accent, fontSize: '10px' }} />
              </div>
              <p className={`leading-relaxed ${isInFullscreen ? 'text-base' : 'text-sm'}`} style={{ color: B.textMuted }}>{h}</p>
            </div>
          ))}
        </div>
      )}
      {slide.examples && slide.examples.length > 0 && (
        <div className="space-y-3">
          {slide.examples.map((ex, idx) => (
            <div key={idx} className="p-4" style={{ background: B.surface, borderLeft: `2px solid ${B.borderHover}` }}>
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: B.textDim }}>{ex.label}</span>
              <p className={`leading-relaxed ${isInFullscreen ? 'text-base' : 'text-sm'}`} style={{ color: B.text }}>{ex.text}</p>
              {ex.highlight && (
                <p className="text-xs font-medium mt-2 flex items-center gap-1" style={{ color: B.accent }}>
                  <i className="ri-information-line" style={{ fontSize: '11px' }} />
                  {ex.highlight}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderComparisonSlide = (slide: LessonSlide) => (
    <div className={`h-full overflow-y-auto px-2 py-2 ${isInFullscreen ? 'px-4 md:px-8 py-4' : ''}`}>
      <div className="mb-5">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em]" style={{ border: `1px solid ${B.textDim}`, color: B.textDim }}>
          <i className="ri-scales-line" style={{ fontSize: '11px' }} />
          Сравнение
        </span>
      </div>
      <h3 className={`font-bold mb-1 tracking-tight ${isInFullscreen ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'}`} style={{ color: B.text }}>{slide.title}</h3>
      {slide.subtitle && <p className={`mb-6 ${isInFullscreen ? 'text-base' : 'text-sm'}`} style={{ color: B.textMuted }}>{slide.subtitle}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {slide.leftSide && (
          <div style={{ background: B.errorDim, border: '1px solid #441111' }}>
            <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid #441111' }}>
              <div className="w-5 h-5 flex items-center justify-center" style={{ background: B.accent }}>
                <i className="ri-close-line" style={{ color: '#fff', fontSize: '11px' }} />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: B.accent }}>{slide.leftSide.label}</span>
            </div>
            <div className="p-4">
              <p className={`leading-relaxed whitespace-pre-line ${isInFullscreen ? 'text-sm md:text-base' : 'text-xs md:text-sm'}`} style={{ color: B.textMuted }}>{slide.leftSide.content}</p>
            </div>
          </div>
        )}
        {slide.rightSide && (
          <div style={{ background: B.successDim, border: '1px solid #113311' }}>
            <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid #113311' }}>
              <div className="w-5 h-5 flex items-center justify-center" style={{ background: B.success }}>
                <i className="ri-check-line" style={{ color: '#fff', fontSize: '11px' }} />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: B.success }}>{slide.rightSide.label}</span>
            </div>
            <div className="p-4">
              <p className={`leading-relaxed whitespace-pre-line ${isInFullscreen ? 'text-sm md:text-base' : 'text-xs md:text-sm'}`} style={{ color: B.textMuted }}>{slide.rightSide.content}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderFrameworkSlide = (slide: LessonSlide) => (
    <div className={`h-full overflow-y-auto px-2 py-2 ${isInFullscreen ? 'px-4 md:px-8 py-4' : ''}`}>
      <h3 className={`font-bold mb-1 tracking-tight ${isInFullscreen ? 'text-xl md:text-2xl' : 'text-lg md:text-xl'}`} style={{ color: B.text }}>{slide.title}</h3>
      {slide.subtitle && <p className={`mb-3 ${isInFullscreen ? 'text-base' : 'text-sm'}`} style={{ color: B.textMuted }}>{slide.subtitle}</p>}
      {slide.body && <p className={`mb-5 ${isInFullscreen ? 'text-base' : 'text-sm'}`} style={{ color: B.textMuted }}>{slide.body}</p>}

      {slide.frameworkSteps && (
        <div className="space-y-3">
          {slide.frameworkSteps.map((step, idx) => (
            <div key={idx} className="flex items-start gap-3 p-4" style={{ background: B.surface, borderLeft: `2px solid ${B.accent}` }}>
              <div className="w-8 h-8 flex items-center justify-center shrink-0 text-sm font-bold" style={{ background: B.accent, color: '#fff' }}>
                {step.number}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <i className={`${step.icon}`} style={{ color: B.accent, fontSize: '14px' }} />
                  <h4 className="text-sm font-bold" style={{ color: B.text }}>{step.title}</h4>
                </div>
                <p className="text-xs mb-2" style={{ color: B.textMuted }}>{step.description}</p>
                <div className="px-3 py-2" style={{ background: B.bg, border: `1px solid ${B.border}` }}>
                  <p className="text-xs italic leading-relaxed" style={{ color: B.textDim }}>{step.example}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderInteractiveSlide = (slide: LessonSlide) => (
    <div className={`h-full overflow-y-auto px-2 py-2 ${isInFullscreen ? 'px-4 md:px-8 py-4' : ''}`}>
      <div className="mb-5">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em]" style={{ border: `1px solid ${B.textDim}`, color: B.textDim }}>
          <i className="ri-edit-line" style={{ fontSize: '11px' }} />
          Упражнение
        </span>
      </div>
      <h3 className={`font-bold mb-1 tracking-tight ${isInFullscreen ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'}`} style={{ color: B.text }}>{slide.title}</h3>
      {slide.subtitle && <p className={`mb-5 ${isInFullscreen ? 'text-base' : 'text-sm'}`} style={{ color: B.textMuted }}>{slide.subtitle}</p>}

      {slide.interactivePrompt && (
        <div className="space-y-3">
          <div className="p-4" style={{ background: B.surface, borderLeft: `2px solid ${B.accent}` }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: B.text }}>Сценарий</p>
            <p className={`leading-relaxed ${isInFullscreen ? 'text-base' : 'text-sm'}`} style={{ color: B.textMuted }}>{slide.interactivePrompt.scenario}</p>
          </div>
          <div className="p-4" style={{ background: '#15100a', borderLeft: '2px solid #332211' }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: B.text }}>Твоята задача</p>
            <p className={`leading-relaxed ${isInFullscreen ? 'text-base' : 'text-sm'}`} style={{ color: B.textMuted }}>{slide.interactivePrompt.task}</p>
          </div>

          {!interactiveRevealed ? (
            <div className="text-center py-4">
              <div className="p-4 mb-5" style={{ background: B.surface, border: `1px dashed ${B.border}` }}>
                <i className="ri-lightbulb-flash-line block mb-2" style={{ color: B.textDim, fontSize: '20px' }} />
                <p className="text-xs" style={{ color: B.textDim }}>Помисли за 30 секунди</p>
                <p className="text-xs mt-1 italic" style={{ color: B.textDim }}>&quot;{slide.interactivePrompt.hint}&quot;</p>
              </div>
              <button
                onClick={() => setInteractiveRevealed(true)}
                className="px-7 py-3 text-sm font-semibold transition-all whitespace-nowrap"
                style={{ background: B.accent, color: '#fff' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = B.accentHover; e.currentTarget.style.transform = 'scale(1.02)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = B.accent; e.currentTarget.style.transform = 'scale(1)'; }}
              >
                <i className="ri-eye-line mr-2" style={{ fontSize: '12px' }} />
                Виж решение
              </button>
            </div>
          ) : (
            <div className="p-4" style={{ background: B.successDim, border: '1px solid #113311' }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: B.success }}>Примерен отговор</p>
              <p className={`leading-relaxed whitespace-pre-line ${isInFullscreen ? 'text-base' : 'text-sm'}`} style={{ color: B.textMuted }}>{slide.interactivePrompt.revealAnswer}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderCheckpointSlide = (slide: LessonSlide) => (
    <div className={`h-full overflow-y-auto px-2 py-2 ${isInFullscreen ? 'px-4 md:px-8 py-4' : ''}`}>
      <div className="mb-5">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em]" style={{ border: `1px solid ${B.accent}`, color: B.accent }}>
          <i className="ri-question-answer-line" style={{ fontSize: '11px' }} />
          Проверка
        </span>
      </div>
      <h3 className={`font-bold mb-2 tracking-tight ${isInFullscreen ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'}`} style={{ color: B.text }}>{slide.title}</h3>
      {slide.subtitle && <p className={`mb-5 ${isInFullscreen ? 'text-base' : 'text-sm'}`} style={{ color: B.textMuted }}>{slide.subtitle}</p>}

      {!checkpointRevealed && (
        <div className="mb-5 flex items-center gap-2 text-xs" style={{ color: B.textDim }}>
          <i className="ri-question-answer-line" style={{ color: B.accent, fontSize: '12px' }} />
          <span>Избери отговор и виж дали е верен</span>
        </div>
      )}

      {slide.checkpoint && (
        <div className="space-y-3">
          <div className="p-4" style={{ background: B.surface, borderLeft: `2px solid ${B.accent}` }}>
            <p className={`font-semibold leading-relaxed ${isInFullscreen ? 'text-lg' : 'text-base'}`} style={{ color: B.text }}>{slide.checkpoint.question}</p>
          </div>

          <div className="space-y-2">
            {slide.checkpoint.options.map((opt, idx) => {
              const isSelected = checkpointAnswer === idx;
              const isCorrect = idx === slide.checkpoint!.correctIndex;

              let btnStyle: React.CSSProperties = { background: B.bg, border: `1px solid ${B.border}`, color: B.textMuted };
              let iconStyle: React.CSSProperties = { background: B.border, color: B.textDim };

              if (checkpointRevealed) {
                if (isCorrect) {
                  btnStyle = { background: B.successDim, border: `1px solid ${B.success}`, color: '#fff' };
                  iconStyle = { background: B.success, color: '#fff' };
                } else if (isSelected && !isCorrect) {
                  btnStyle = { background: B.errorDim, border: `1px solid ${B.accent}`, color: '#fff' };
                  iconStyle = { background: B.accent, color: '#fff' };
                } else {
                  btnStyle = { background: B.bg, border: `1px solid ${B.border}`, color: B.textDim, opacity: 0.5 };
                  iconStyle = { background: B.border, color: B.textDim };
                }
              } else if (isSelected) {
                btnStyle = { background: B.errorDim, border: `1px solid ${B.accent}`, color: '#fff' };
                iconStyle = { background: B.accent, color: '#fff' };
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleCheckpointSelect(idx)}
                  disabled={checkpointRevealed}
                  className="w-full text-left px-4 py-3.5 transition-all flex items-center gap-3"
                  style={btnStyle}
                >
                  <span className="w-6 h-6 flex items-center justify-center shrink-0 text-xs font-bold transition-all" style={iconStyle}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className={`leading-relaxed flex-1 ${isInFullscreen ? 'text-base' : 'text-sm'}`}>{opt}</span>
                  {checkpointRevealed && isCorrect && (
                    <i className="ri-check-line shrink-0" style={{ color: B.success, fontSize: '18px' }} />
                  )}
                  {checkpointRevealed && isSelected && !isCorrect && (
                    <i className="ri-close-line shrink-0" style={{ color: B.accent, fontSize: '18px' }} />
                  )}
                </button>
              );
            })}
          </div>

          {checkpointRevealed && slide.checkpoint.explanation && (
            <div className="p-4" style={checkpointAnswer === slide.checkpoint.correctIndex
              ? { background: B.successDim, border: '1px solid #113311' }
              : { background: B.errorDim, border: '1px solid #441111' }
            }>
              <div className="flex items-center gap-2 mb-1">
                <i className={checkpointAnswer === slide.checkpoint.correctIndex ? 'ri-check-double-line' : 'ri-information-line'}
                   style={{ color: checkpointAnswer === slide.checkpoint.correctIndex ? B.success : B.accent, fontSize: '16px' }} />
                <span className="text-sm font-bold" style={{ color: checkpointAnswer === slide.checkpoint.correctIndex ? B.success : B.accent }}>
                  {checkpointAnswer === slide.checkpoint.correctIndex ? 'Браво! Верен отговор!' : 'Не е точно така'}
                </span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: B.textMuted }}>{slide.checkpoint.explanation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderSummarySlide = (slide: LessonSlide) => (
    <div className={`h-full overflow-y-auto px-2 py-2 ${isInFullscreen ? 'px-4 md:px-8 py-4' : ''}`}>
      <h3 className={`font-bold mb-2 tracking-tight ${isInFullscreen ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'}`} style={{ color: B.text }}>{slide.title}</h3>
      {slide.subtitle && <p className={`mb-5 ${isInFullscreen ? 'text-base' : 'text-sm'}`} style={{ color: B.textMuted }}>{slide.subtitle}</p>}

      {slide.keyTakeaways && (
        <div className="space-y-3 mb-6">
          {slide.keyTakeaways.map((takeaway, idx) => (
            <div key={idx} className="flex items-start gap-3 p-4" style={{ background: B.surface, borderLeft: `2px solid ${B.accent}` }}>
              <div className="w-6 h-6 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5" style={{ background: B.accent, color: '#fff' }}>
                {idx + 1}
              </div>
              <p className={`leading-relaxed flex-1 ${isInFullscreen ? 'text-base' : 'text-sm'}`} style={{ color: B.textMuted }}>{takeaway}</p>
            </div>
          ))}
        </div>
      )}

      {slide.cta && (
        <div className="text-center p-6" style={{ background: B.surface, border: `1px solid ${B.accent}` }}>
          <i className="ri-rocket-line block mb-3" style={{ color: B.accent, fontSize: '24px' }} />
          <p className="text-sm font-semibold" style={{ color: B.text }}>{slide.cta}</p>
        </div>
      )}
    </div>
  );

  const renderChecklistSlide = (slide: LessonSlide) => {
    if (!slide.checklistItems || slide.checklistItems.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full py-8">
          <p className="text-sm" style={{ color: B.textMuted }}>Няма налични точки за тази тема.</p>
        </div>
      );
    }

    const totalInTopic = slide.checklistItems.length;
    const checkedInTopic = slide.checklistItems.filter(item => checkedItems.has(item.id)).length;
    const topicPercent = Math.round((checkedInTopic / totalInTopic) * 100);

    return (
      <div className={`h-full overflow-y-auto px-2 py-2 ${isInFullscreen ? 'px-4 md:px-8 py-4' : ''}`}>
        <div className="mb-5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em]" style={{ border: `1px solid ${B.accent}`, color: B.accent }}>
            <i className="ri-checkbox-multiple-line" style={{ fontSize: '11px' }} />
            Чеклист
          </span>
        </div>
        <h3 className={`font-bold mb-1 tracking-tight ${isInFullscreen ? 'text-xl md:text-2xl' : 'text-lg md:text-xl'}`} style={{ color: B.text }}>{slide.title}</h3>
        {slide.subtitle && <p className="text-xs mb-4" style={{ color: B.textDim }}>{slide.subtitle}</p>}

        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium" style={{ color: B.textMuted }}>
              Завършени: {checkedInTopic} / {totalInTopic}
            </span>
            <span className="text-xs font-bold" style={{ color: checkedInTopic === totalInTopic ? B.success : B.accent }}>
              {topicPercent}%
            </span>
          </div>
          <div className="w-full overflow-hidden" style={{ height: '3px', background: B.border }}>
            <div
              className="h-full transition-all duration-500"
              style={{ width: `${topicPercent}%`, background: checkedInTopic === totalInTopic ? B.success : B.accent }}
            />
          </div>
        </div>

        <div className="space-y-1">
          {slide.checklistItems.map((item) => {
            const isChecked = checkedItems.has(item.id);
            return (
              <button
                key={item.id}
                onClick={() => toggleChecklistItem(item.id)}
                disabled={checklistSaving}
                className="w-full text-left flex items-start gap-3 px-3 py-2.5 transition-all group cursor-pointer"
                style={{
                  background: isChecked ? B.successDim : B.surface,
                  borderLeft: `2px solid ${isChecked ? B.success : B.border}`,
                }}
                onMouseEnter={(e) => {
                  if (!isChecked) {
                    e.currentTarget.style.background = B.surfaceHover;
                    e.currentTarget.style.borderLeftColor = B.accent;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isChecked) {
                    e.currentTarget.style.background = B.surface;
                    e.currentTarget.style.borderLeftColor = B.border;
                  }
                }}
              >
                <div
                  className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5 transition-all"
                  style={{
                    border: `1.5px solid ${isChecked ? B.success : B.border}`,
                    background: isChecked ? B.success : 'transparent',
                  }}
                >
                  {isChecked && (
                    <i className="ri-check-line" style={{ color: '#fff', fontSize: '12px' }} />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-1.5">
                    <span
                      className="text-[10px] font-mono font-bold shrink-0"
                      style={{ color: isChecked ? B.success : B.textDim }}
                    >
                      {String(item.id).padStart(2, '0')}
                    </span>
                    <span
                      className="text-sm leading-relaxed"
                      style={{
                        color: isChecked ? B.textDim : B.textMuted,
                        textDecoration: isChecked ? 'line-through' : 'none',
                      }}
                    >
                      {item.text}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {checklistSaving && (
          <div className="flex items-center justify-center gap-1.5 mt-3 py-1">
            <i className="ri-loader-4-line animate-spin" style={{ color: B.textDim, fontSize: '10px' }} />
            <span className="text-[10px]" style={{ color: B.textDim }}>Записване...</span>
          </div>
        )}
      </div>
    );
  };

  const renderSlideContent = (slide: LessonSlide) => {
    switch (slide.type) {
      case 'title': return renderTitleSlide(slide);
      case 'content': return renderContentSlide(slide);
      case 'comparison': return renderComparisonSlide(slide);
      case 'framework': return renderFrameworkSlide(slide);
      case 'interactive': return renderInteractiveSlide(slide);
      case 'checkpoint': return renderCheckpointSlide(slide);
      case 'summary': return renderSummarySlide(slide);
      case 'checklist': return renderChecklistSlide(slide);
      default: return renderContentSlide(slide);
    }
  };

  // ─── STATES ───
  if (slides.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <div className="w-12 h-12 flex items-center justify-center" style={{ border: `1px solid ${B.border}` }}>
          <i className="ri-file-unknow-line" style={{ color: B.textDim, fontSize: '18px' }} />
        </div>
        <p className="text-base" style={{ color: B.textMuted }}>Урокът все още не е наличен</p>
      </div>
    );
  }

  if (!loaded) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <div className="w-10 h-10 border-2 animate-spin" style={{ borderColor: B.border, borderTopColor: B.accent, borderRadius: '50%' }} />
        <p className="text-base" style={{ color: B.textMuted }}>Зареждаме урока...</p>
      </div>
    );
  }

  // ─── LOCK OVERLAY ───
  if (locked && showLockOverlay) {
    return (
      <LockOverlay onReview={() => { setLocked(false); setShowLockOverlay(false); }} />
    );
  }

  // ─── MAIN RENDER ───
  return (
    <div
      ref={containerRef}
      className={`flex flex-col ${isInFullscreen ? 'fixed inset-0 z-[200]' : 'w-full h-full'}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onDoubleClick={handleDoubleClick}
      onMouseMove={isInFullscreen ? resetControlsTimer : undefined}
      onClick={isInFullscreen ? resetControlsTimer : undefined}
      style={{ background: B.bg }}
    >
      {/* ─── FULLSCREEN TOP BAR ─── */}
      {isInFullscreen && (
        <div
          className={`shrink-0 flex items-center justify-between px-3 md:px-5 py-3 transition-opacity duration-400 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          style={{ background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(8px)' }}
        >
          <div className="flex items-center gap-2 min-w-0">
            <h2 className="text-sm font-bold truncate tracking-wide" style={{ color: B.text }}>{lessonData.title}</h2>
            <span className="text-[10px] px-1.5 py-0.5 shrink-0" style={{ border: `1px solid ${B.border}`, color: B.textDim }}>
              {currentSlideIdx + 1}/{totalSlides}
            </span>
          </div>
          <button
            onClick={exitFullscreen}
            className="w-9 h-9 flex items-center justify-center transition-colors"
            style={{ border: `1px solid ${B.border}`, background: 'transparent' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = B.borderHover; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = B.border; }}
            title="Изход от цял екран"
          >
            <i className="ri-fullscreen-exit-line" style={{ color: B.text, fontSize: '16px' }} />
          </button>
        </div>
      )}

      {/* ─── NORMAL TOP BAR ─── */}
      {!isInFullscreen && (
        <div className="flex items-center justify-between mb-3 md:mb-4 px-1">
          <div className="flex items-center gap-2 min-w-0">
            <h2 className="text-sm font-bold truncate tracking-wide" style={{ color: B.text }}>{lessonData.title}</h2>
            <span className="text-[10px] px-1.5 py-0.5 shrink-0" style={{ border: `1px solid ${B.border}`, color: B.textDim }}>
              {lessonData.duration}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {saveStatus === 'saving' && (
              <span className="text-[10px] flex items-center gap-1" style={{ color: B.textDim }}>
                <i className="ri-loader-4-line animate-spin" style={{ fontSize: '10px' }} />
                <span className="hidden sm:inline">Запис...</span>
              </span>
            )}
            {saveStatus === 'saved' && (
              <span className="text-[10px] flex items-center gap-1 font-medium" style={{ color: B.success }}>
                <i className="ri-check-line" style={{ fontSize: '10px' }} />
                <span className="hidden sm:inline">Запазено</span>
              </span>
            )}
            {/* Quick-jump slide menu trigger */}
            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setShowJumpMenu(!showJumpMenu); }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 transition-colors cursor-pointer"
                style={{ border: `1px solid ${showJumpMenu ? B.accent : B.border}`, background: showJumpMenu ? '#1a0505' : 'transparent' }}
                title="Бърз преход към слайд"
              >
                <i className="ri-apps-line" style={{ color: showJumpMenu ? B.accent : B.textDim, fontSize: '12px' }} />
                <span className="text-[10px] font-mono" style={{ color: showJumpMenu ? B.accent : B.textDim }}>
                  {currentSlideIdx + 1}/{totalSlides}
                </span>
              </button>
              {showJumpMenu && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowJumpMenu(false)} />
                  <div
                    className="absolute right-0 top-full mt-1 z-40 max-h-[320px] overflow-y-auto min-w-[220px]"
                    style={{ background: B.surface, border: `1px solid ${B.border}` }}
                  >
                    {slides.map((slide, idx) => {
                      const seen = seenSlides.has(idx);
                      const isCurrent = idx === currentSlideIdx;
                      const typeLabel = slide.type === 'title' ? '⚡' : slide.type === 'checkpoint' ? '✓' : slide.type === 'interactive' ? '✎' : slide.type === 'summary' ? '★' : slide.type === 'comparison' ? '⇆' : slide.type === 'framework' ? '⊞' : slide.type === 'checklist' ? '☐' : '•';
                      return (
                        <button
                          key={slide.id}
                          onClick={() => { setShowJumpMenu(false); goToSlide(idx, idx > currentSlideIdx ? 'forward' : 'backward'); }}
                          disabled={idx === currentSlideIdx || locked}
                          className="w-full text-left px-4 py-2.5 flex items-center gap-3 transition-colors"
                          style={{
                            background: isCurrent ? '#1a0505' : 'transparent',
                            borderLeft: isCurrent ? `2px solid ${B.accent}` : `2px solid transparent`,
                            opacity: idx === currentSlideIdx ? 0.5 : 1,
                            cursor: idx === currentSlideIdx ? 'default' : 'pointer',
                          }}
                          onMouseEnter={(e) => {
                            if (idx !== currentSlideIdx) { e.currentTarget.style.background = B.surfaceHover; }
                          }}
                          onMouseLeave={(e) => {
                            if (idx !== currentSlideIdx) { e.currentTarget.style.background = 'transparent'; }
                          }}
                        >
                          <span className="text-xs shrink-0 font-mono w-5 text-center" style={{ color: seen ? B.success : B.textDim }}>
                            {typeLabel}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs truncate" style={{ color: isCurrent ? B.accent : B.textMuted }}>
                              {idx + 1}. {slide.title}
                            </p>
                          </div>
                          {seen && (
                            <i className="ri-check-line shrink-0" style={{ color: B.success, fontSize: '10px' }} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── PROGRESS BAR ─── */}
      <div className={`w-full mb-5 transition-opacity duration-400 ${isInFullscreen && !showControls ? 'opacity-0' : 'opacity-100'} ${isInFullscreen ? 'px-3 md:px-5' : ''}`}>
        <div className="w-full overflow-hidden" style={{ height: isInFullscreen ? '2px' : '2px', background: B.border }}>
          <div
            className="h-full transition-all duration-500"
            style={{ width: `${progressPercent}%`, background: B.accent }}
          />
        </div>
      </div>

      {/* ─── SLIDE CONTENT ─── */}
      <div className="flex-1 min-h-0 relative">
        {/* Floating fullscreen button — mobile only */}
        {!isInFullscreen && (
          <button
            onClick={enterFullscreen}
            className="absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center transition-colors md:hidden"
            style={{ background: 'rgba(10,10,10,0.7)', border: `1px solid ${B.border}`, backdropFilter: 'blur(4px)' }}
            title="Цял екран"
          >
            <i className="ri-fullscreen-line" style={{ color: B.textDim, fontSize: '13px' }} />
          </button>
        )}
        <div
          className={`h-full overflow-y-auto ${isInFullscreen ? 'px-2 md:px-6 py-2' : 'px-3 py-2 md:p-6'}`}
          style={{
            ...slideAnimStyle,
            background: isInFullscreen ? 'transparent' : B.surface,
            border: isInFullscreen ? 'none' : `1px solid ${B.border}`,
          }}
        >
          {renderSlideContent(currentSlide)}
        </div>
      </div>

      {/* ─── CONVERSION TEASER ─── */}
      {lockAfterComplete && !allSeen && currentSlideIdx >= totalSlides - 3 && currentSlideIdx < totalSlides - 1 && !isInFullscreen && (
        <div className="mt-4 p-4" style={{ background: B.errorDim, border: `1px solid #441111` }}>
          <div className="flex items-center gap-2">
            <i className="ri-lightbulb-line shrink-0" style={{ color: B.accent, fontSize: '14px' }} />
            <p className="text-xs leading-relaxed" style={{ color: B.accent }}>
              След този урок остават {totalSlides - currentSlideIdx - 1} слайда.
            </p>
          </div>
        </div>
      )}

      {/* ─── DOTS ─── */}
      <div className={`hidden md:flex items-center justify-center gap-2 mt-4 flex-wrap px-2 transition-opacity duration-400 ${isInFullscreen && !showControls ? 'opacity-0' : 'opacity-100'}`}>
        {slides.map((slide, idx) => {
          const seen = seenSlides.has(idx);
          const isCurrent = idx === currentSlideIdx;
          return (
            <button
              key={slide.id}
              onClick={() => !locked && goToSlide(idx, idx > currentSlideIdx ? 'forward' : 'backward')}
              disabled={locked}
              className="transition-all cursor-pointer"
              style={{
                width: isCurrent ? '28px' : seen ? '10px' : '8px',
                height: '3px',
                background: isCurrent ? B.accent : seen ? B.accentDark : B.border,
                boxShadow: isCurrent ? `0 0 8px ${B.accent}40` : 'none',
              }}
              title={`Слайд ${idx + 1}`}
            />
          );
        })}
      </div>

      {/* ─── NAVIGATION ─── */}
      <div className={`hidden md:flex items-center justify-between gap-3 mt-4 transition-opacity duration-400 ${isInFullscreen && !showControls ? 'opacity-0 pointer-events-none' : 'opacity-100'} ${isInFullscreen ? 'px-3 md:px-5 pb-3' : ''}`}>
        <div style={{ visibility: isFirstSlide ? 'hidden' : 'visible' }}>
          <button
            onClick={goPrev}
            disabled={isFirstSlide || animating || locked}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap ${isInFullscreen ? 'px-3 py-2' : ''}`}
            style={{
              background: 'transparent',
              border: `1px solid ${B.border}`,
              color: B.textMuted,
            }}
            onMouseEnter={(e) => { if (!e.currentTarget.disabled) { e.currentTarget.style.borderColor = B.borderHover; e.currentTarget.style.color = B.text; } }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = B.border; e.currentTarget.style.color = B.textMuted; }}
          >
            <i className="ri-arrow-left-line" style={{ fontSize: '12px' }} />
            <span className="hidden sm:inline">Назад</span>
          </button>
        </div>

        {!isInFullscreen && (
          <span className="text-xs font-mono hidden lg:block" style={{ color: B.textDim }}>
            &lt; &gt; или swipe
          </span>
        )}
        {isInFullscreen && (
          <span className="text-[10px] font-mono" style={{ color: B.textDim }}>
            ← swipe → за навигация
          </span>
        )}

        <button
          onClick={goNext}
          disabled={animating || locked}
          className={`flex items-center gap-1.5 px-5 py-2.5 text-sm font-bold transition-all whitespace-nowrap ${isInFullscreen ? 'px-4 py-2' : ''}`}
          style={{
            background: completedState ? B.success : B.accent,
            color: '#fff',
            border: `1px solid ${completedState ? B.success : B.accent}`,
          }}
          onMouseEnter={(e) => { if (!e.currentTarget.disabled) { e.currentTarget.style.background = completedState ? '#16a34a' : B.accentHover; e.currentTarget.style.transform = 'scale(1.02)'; } }}
          onMouseLeave={(e) => { e.currentTarget.style.background = completedState ? B.success : B.accent; e.currentTarget.style.transform = 'scale(1)'; }}
        >
          {isLastSlide ? (
            <>
              <span>{completedState ? 'Завършено' : 'Завърши'}</span>
              <i className={completedState ? 'ri-check-double-line' : 'ri-flag-line'} style={{ fontSize: '12px' }} />
            </>
          ) : (
            <>
              <span>Напред</span>
              <i className="ri-arrow-right-line" style={{ fontSize: '12px' }} />
            </>
          )}
        </button>
      </div>

      {/* ─── MOBILE STICKY BOTTOM ACTION BAR ─── */}
      {isMobile && !isInFullscreen && (
        <div className="shrink-0" style={{ background: B.bg, borderTop: `1px solid ${B.border}` }}>
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <button
              onClick={goPrev}
              disabled={isFirstSlide || animating || locked}
              className="flex items-center justify-center w-10 h-10 transition-colors"
              style={{
                background: 'transparent',
                border: `1px solid ${B.border}`,
                color: isFirstSlide ? B.textDim : B.textMuted,
                opacity: isFirstSlide ? 0.4 : 1,
              }}
            >
              <i className="ri-arrow-left-line" />
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono" style={{ color: B.textDim }}>
                {currentSlideIdx + 1}
              </span>
              <div className="w-16 overflow-hidden" style={{ height: '2px', background: B.border }}>
                <div
                  className="h-full transition-all duration-300"
                  style={{ width: `${progressPercent}%`, background: B.accent }}
                />
              </div>
              <span className="text-xs font-mono" style={{ color: B.textDim }}>
                {totalSlides}
              </span>
            </div>

            <button
              onClick={goNext}
              disabled={animating || locked}
              className="flex items-center justify-center gap-1.5 px-5 py-2.5 text-sm font-bold transition-all whitespace-nowrap"
              style={{
                background: completedState ? B.success : B.accent,
                color: '#fff',
                border: `1px solid ${completedState ? B.success : B.accent}`,
              }}
            >
              {isLastSlide ? (
                <>
                  <span className={completedState ? 'hidden' : ''}>Завърши</span>
                  <i className={completedState ? 'ri-check-double-line' : 'ri-flag-line'} />
                </>
              ) : (
                <>
                  <span>Напред</span>
                  <i className="ri-arrow-right-line" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ─── FULLSCREEN NEXT LESSON BUTTON ─── */}
      {completedState && isInFullscreen && hasNextLesson && onNextLesson && (
        <div className={`mt-4 text-center transition-opacity duration-400 ${showControls ? 'opacity-100' : 'opacity-0'}`} style={{ minHeight: '60px' }}>
          <button
            onClick={() => { onNextLesson(); }}
            className="inline-flex items-center gap-2 px-8 py-4 text-base font-bold transition-all whitespace-nowrap cursor-pointer"
            style={{ background: B.accent, color: '#fff' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = B.accentHover; e.currentTarget.style.transform = 'scale(1.03)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = B.accent; e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <span>Следващ урок</span>
            <i className="ri-arrow-right-line" style={{ fontSize: '16px' }} />
          </button>
          <p className="text-[10px] mt-2" style={{ color: B.textDim }}>Плъзни надолу за изход от цял екран</p>
        </div>
      )}
    </div>
  );
}