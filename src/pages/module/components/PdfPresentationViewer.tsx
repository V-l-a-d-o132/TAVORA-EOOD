import { useState, useEffect, useCallback, useRef, memo } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { supabase } from '@/lib/supabase';

/* ═══════════════════════════════════════════════════════════════
   PDF.js Worker — bulletproof: try Vite resolve, fallback CDN
   ═══════════════════════════════════════════════════════════════ */
try {
  const workerUrl = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
  ).href;
  pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
} catch {
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://unpkg.com/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs';
}

/* ── Types ── */
interface PdfPresentationViewerProps {
  pdfUrl: string;
  lessonId: string;
  moduleId: string;
  isCompleted: boolean;
  onMarkComplete: () => void;
  hasQuiz: boolean;
  lessonTitle: string;
  onStartQuiz: () => void;
  onLastSlideReached?: () => void;
  savedPageNumber: number;
  savedTotalPages: number;
  quizScore: number | null;
  quizTotal: number | null;
  userId?: string;
}

interface PageTimeMap {
  [page: number]: number;
}

interface CachedPage {
  bitmap: ImageBitmap;
  scale: number;
  dpr: number;
}

/* ── Save progress helper ── */
async function savePdfProgress(
  userId: string,
  moduleId: string,
  lessonId: string,
  pageNum: number,
  total: number,
  completed: boolean,
  pageTimes: PageTimeMap
) {
  try {
    await supabase.from('pdf_progress').upsert(
      {
        user_id: userId,
        module_id: moduleId,
        lesson_id: lessonId,
        page_number: pageNum,
        total_pages: total,
        completed,
        page_times: pageTimes,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,module_id,lesson_id' }
    );
  } catch {
    /* ignore */
  }
}

/* ═══════════════════════════════════════════════════════════════
   Component
   ═══════════════════════════════════════════════════════════════ */
function PdfPresentationViewer({
  pdfUrl,
  lessonId,
  moduleId,
  isCompleted,
  onMarkComplete,
  hasQuiz,
  lessonTitle,
  onStartQuiz,
  onLastSlideReached,
  savedPageNumber,
  savedTotalPages,
  quizScore,
  quizTotal,
  userId,
}: PdfPresentationViewerProps) {
  /* PDF doc */
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(savedPageNumber || 1);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  /* ImageBitmap cache */
  const pageCache = useRef<Map<number, CachedPage>>(new Map());

  /* Canvas */
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  /* UI */
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [showQuizPrompt, setShowQuizPrompt] = useState(false);

  /* Progress tracking */
  const prevPageRef = useRef(currentPage);
  const pageStartTime = useRef(Date.now());
  const pageTimeMap = useRef<PageTimeMap>();
  const visitedPages = useRef<Set<number>>(new Set());
  const quizPromptShown = useRef(false);

  /* Touch */
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  /* Debounced save ref */
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ═══════ Load PDF ═══════ */
  useEffect(() => {
    let destroyed = false;
    setLoading(true);
    setLoadError(false);
    setCurrentPage(savedPageNumber || 1);
    setNumPages(0);
    setPdfDoc(null);
    setShowQuizPrompt(false);
    quizPromptShown.current = false;
    prevPageRef.current = savedPageNumber || 1;
    pageStartTime.current = Date.now();
    pageTimeMap.current = {};
    visitedPages.current = new Set([savedPageNumber || 1]);
    pageCache.current.clear();

    const task = pdfjsLib.getDocument({
      url: pdfUrl,
      cMapUrl: 'https://unpkg.com/pdfjs-dist@4.4.168/cmaps/',
      cMapPacked: true,
    });

    task.promise
      .then((pdf: any) => {
        if (destroyed) {
          pdf.destroy?.();
          return;
        }
        setPdfDoc(pdf);
        setNumPages(pdf.numPages || 0);
        setLoading(false);
      })
      .catch(() => {
        if (!destroyed) {
          setLoadError(true);
          setLoading(false);
        }
      });

    return () => {
      destroyed = true;
      if (pdfDoc && pdfDoc.destroy) {
        try { pdfDoc.destroy(); } catch { /* ignore */ }
      }
      // Revoke all cached bitmaps
      pageCache.current.forEach((c) => {
        try { c.bitmap.close(); } catch { /* ignore */ }
      });
      pageCache.current.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdfUrl, savedPageNumber]);

  /* ═══════ Get container size (with fallback) ═══════ */
  const getSize = useCallback((): { w: number; h: number } => {
    const el = containerRef.current;
    if (el) {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (w > 0 && h > 0) return { w, h };
    }
    return {
      w: window.innerWidth,
      h: window.innerHeight,
    };
  }, []);

  /* ═══════ Render page to ImageBitmap (cache) ═══════ */
  const renderPage = useCallback(
    async (pageNum: number): Promise<CachedPage | null> => {
      if (!pdfDoc) return null;
      const cached = pageCache.current.get(pageNum);
      if (cached) return cached;

      try {
        const page = await pdfDoc.getPage(pageNum);
        const { w, h } = getSize();
        const maxW = w;
        const maxH = h;
        const viewport = page.getViewport({ scale: 1 });
        const scale = Math.min(maxW / viewport.width, maxH / viewport.height, 3);
        const finalViewport = page.getViewport({ scale });
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        const offscreen = document.createElement('canvas');
        offscreen.width = Math.floor(finalViewport.width * dpr);
        offscreen.height = Math.floor(finalViewport.height * dpr);
        const ctx = offscreen.getContext('2d');
        if (!ctx) return null;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        await page.render({ canvasContext: ctx, viewport: finalViewport }).promise;

        const bitmap = await createImageBitmap(offscreen);
        const result: CachedPage = { bitmap, scale, dpr };
        pageCache.current.set(pageNum, result);
        return result;
      } catch {
        return null;
      }
    },
    [pdfDoc, getSize]
  );

  /* ═══════ Draw current page on visible canvas ═══════ */
  const drawCurrentPage = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas || !pdfDoc) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cached = await renderPage(currentPage);
    if (!cached) return;

    const { bitmap } = cached;
    const { w: containerW, h: containerH } = getSize();

    // Resize canvas to match container
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(containerW * dpr);
    canvas.height = Math.floor(containerH * dpr);
    canvas.style.width = `${containerW}px`;
    canvas.style.height = `${containerH}px`;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Center the bitmap
    const drawW = bitmap.width;
    const drawH = bitmap.height;
    const x = Math.floor((canvas.width - drawW) / 2);
    const y = Math.floor((canvas.height - drawH) / 2);

    ctx.drawImage(bitmap, Math.max(0, x), Math.max(0, y));
  }, [pdfDoc, currentPage, renderPage, getSize]);

  /* ═══════ Draw on page change ═══════ */
  useEffect(() => {
    if (!pdfDoc || loading || loadError) return;
    drawCurrentPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdfDoc, currentPage, loading, loadError, drawCurrentPage]);

  /* ═══════ Progressive background loading ═══════ */
  useEffect(() => {
    if (!pdfDoc || numPages === 0) return;
    let cancelled = false;

    const loadAll = async () => {
      for (let i = 1; i <= numPages; i++) {
        if (cancelled) return;
        if (!pageCache.current.has(i)) {
          await renderPage(i);
        }
        // Yield to main thread every page
        await new Promise((r) => setTimeout(r, 0));
      }
    };

    // Start after current page is rendered
    const timer = setTimeout(loadAll, 500);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [pdfDoc, numPages, renderPage]);

  /* ═══════ Window resize redraw ═══════ */
  useEffect(() => {
    const onResize = () => {
      // Clear cache on resize (pages need re-render at new size)
      pageCache.current.forEach((c) => {
        try { c.bitmap.close(); } catch { /* ignore */ }
      });
      pageCache.current.clear();
      drawCurrentPage();
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [drawCurrentPage]);

  /* ═══════ Navigation ═══════ */
  const trackAndGo = useCallback(
    (page: number) => {
      if (page < 1 || page > numPages) return;

      const prev = prevPageRef.current;
      if (prev !== page) {
        const elapsed = Date.now() - pageStartTime.current;
        pageTimeMap.current[prev] = (pageTimeMap.current[prev] || 0) + elapsed;
        pageStartTime.current = Date.now();
        prevPageRef.current = page;
        visitedPages.current.add(page);

        // Debounced save
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = setTimeout(() => {
          if (userId) {
            savePdfProgress(
              userId,
              moduleId,
              lessonId,
              page,
              numPages,
              isCompleted,
              pageTimeMap.current
            );
          }
        }, 300);
      }

      setCurrentPage(page);

      if (page === numPages && hasQuiz && !quizPromptShown.current && !isCompleted && quizScore === null) {
        quizPromptShown.current = true;
        setShowQuizPrompt(true);
        onLastSlideReached?.();
      }
    },
    [numPages, userId, moduleId, lessonId, isCompleted, hasQuiz, quizScore, onLastSlideReached]
  );

  const nextPage = useCallback(() => {
    if (currentPage < numPages) trackAndGo(currentPage + 1);
  }, [currentPage, numPages, trackAndGo]);

  const prevPage = useCallback(() => {
    if (currentPage > 1) trackAndGo(currentPage - 1);
  }, [currentPage, trackAndGo]);

  /* ═══════ Keyboard ═══════ */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
        case 'PageDown':
          e.preventDefault();
          nextPage();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'PageUp':
          e.preventDefault();
          prevPage();
          break;
        case 'Home':
          e.preventDefault();
          trackAndGo(1);
          break;
        case 'End':
          e.preventDefault();
          trackAndGo(numPages);
          break;
        case 'f':
        case 'F11':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'Escape':
          if (isFullscreen) {
            e.preventDefault();
            exitFullscreen();
          }
          break;
        case 't':
        case 'T':
          e.preventDefault();
          setShowThumbnails((s) => !s);
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [nextPage, prevPage, trackAndGo, numPages, isFullscreen]);

  /* ═══════ Touch swipe ═══════ */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const start = (e: TouchEvent) => {
      touchStartX.current = e.changedTouches[0].clientX;
      touchStartY.current = e.changedTouches[0].clientY;
    };
    const end = (e: TouchEvent) => {
      const dx = touchStartX.current - e.changedTouches[0].clientX;
      const dy = touchStartY.current - e.changedTouches[0].clientY;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
        if (dx > 50) nextPage();
        else if (dx < -50) prevPage();
      }
    };

    el.addEventListener('touchstart', start, { passive: true });
    el.addEventListener('touchend', end, { passive: true });
    return () => {
      el.removeEventListener('touchstart', start);
      el.removeEventListener('touchend', end);
    };
  }, [nextPage, prevPage]);

  /* ═══════ Fullscreen ═══════ */
  const enterFullscreen = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const anyEl = el as any;
    if (el.requestFullscreen) {
      el.requestFullscreen().catch(() => { /* ignore */ });
    } else if (anyEl.webkitRequestFullscreen) {
      anyEl.webkitRequestFullscreen();
    } else if (anyEl.msRequestFullscreen) {
      anyEl.msRequestFullscreen();
    }
  }, []);

  const exitFullscreen = useCallback(() => {
    const anyDoc = document as any;
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => { /* ignore */ });
    } else if (anyDoc.webkitExitFullscreen) {
      anyDoc.webkitExitFullscreen();
    } else if (anyDoc.msExitFullscreen) {
      anyDoc.msExitFullscreen();
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) exitFullscreen();
    else enterFullscreen();
  }, [enterFullscreen, exitFullscreen]);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  /* ═══════ Periodic save ═══════ */
  useEffect(() => {
    if (!userId || !moduleId || !lessonId) return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - pageStartTime.current;
      const current = prevPageRef.current;
      const tempTimes = { ...pageTimeMap.current };
      tempTimes[current] = (tempTimes[current] || 0) + elapsed;
      pageStartTime.current = Date.now();
      pageTimeMap.current = tempTimes;
      savePdfProgress(userId, moduleId, lessonId, current, numPages, isCompleted, tempTimes);
    }, 20000);

    return () => clearInterval(interval);
  }, [userId, moduleId, lessonId, numPages, isCompleted]);

  /* ═══════ Beforeunload save ═══════ */
  useEffect(() => {
    if (!userId) return;

    const handler = () => {
      const elapsed = Date.now() - pageStartTime.current;
      const current = prevPageRef.current;
      const tempTimes = { ...pageTimeMap.current };
      tempTimes[current] = (tempTimes[current] || 0) + elapsed;
      savePdfProgress(userId, moduleId, lessonId, current, numPages, isCompleted, tempTimes);
    };

    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [userId, moduleId, lessonId, numPages, isCompleted]);

  /* ═══════ Mark complete ═══════ */
  const handleMarkComplete = useCallback(() => {
    const current = prevPageRef.current;
    const elapsed = Date.now() - pageStartTime.current;
    const tempTimes = { ...pageTimeMap.current };
    tempTimes[current] = (tempTimes[current] || 0) + elapsed;

    if (userId) {
      savePdfProgress(userId, moduleId, lessonId, current, numPages, true, tempTimes);
    }
    onMarkComplete();
  }, [userId, moduleId, lessonId, numPages, onMarkComplete]);

  /* ═══════ Quiz prompt ═══════ */
  const handleStartQuiz = useCallback(() => {
    setShowQuizPrompt(false);
    onStartQuiz();
  }, [onStartQuiz]);

  const handleDismissQuiz = useCallback(() => {
    setShowQuizPrompt(false);
  }, []);

  /* ═══════ Thumbnail click ═══════ */
  const goToPage = useCallback(
    (p: number) => trackAndGo(p),
    [trackAndGo]
  );

  /* ═══════ Render ═══════ */
  const bgClass = isFullscreen
    ? 'fixed inset-0 z-[100] bg-background-950'
    : 'bg-background-50 rounded-2xl border border-background-200';

  return (
    <div
      ref={containerRef}
      className={`flex flex-col h-full overflow-hidden select-none ${bgClass}`}
    >
      {/* ── Top Toolbar ── */}
      <div
        className={`shrink-0 flex items-center justify-between px-3 sm:px-4 py-2.5 gap-2 sm:gap-3 ${
          isFullscreen
            ? 'bg-background-950/90 backdrop-blur border-b border-background-800/40'
            : 'bg-background-100 border-b border-background-200'
        }`}
      >
        {/* Left */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 ${
              isFullscreen ? 'bg-primary-500/20' : 'bg-primary-500'
            }`}
          >
            <i
              className={`ri-file-text-line text-xs sm:text-sm ${
                isFullscreen ? 'text-primary-400' : 'text-white'
              }`}
            />
          </div>
          <span
            className={`text-xs sm:text-sm font-semibold truncate ${
              isFullscreen ? 'text-background-100' : 'text-foreground-900'
            }`}
          >
            {lessonTitle}
          </span>
          {isCompleted && (
            <span className="hidden sm:flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-primary-100 text-primary-700 border border-primary-200">
              <i className="ri-check-line" />
              Завършен
            </span>
          )}
          {quizScore !== null && quizTotal !== null && (
            <span className="hidden sm:flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-accent-100 text-accent-700 border border-accent-200">
              Тест: {quizScore}/{quizTotal}
            </span>
          )}
        </div>

        {/* Center page counter */}
        <div
          className={`hidden sm:flex items-center gap-2 text-sm font-medium ${
            isFullscreen ? 'text-background-300' : 'text-foreground-600'
          }`}
        >
          <span className="tabular-nums">{currentPage}</span>
          <span>/</span>
          <span className="tabular-nums">{numPages}</span>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-1 shrink-0">
          {!isFullscreen && (
            <button
              onClick={() => setShowThumbnails((s) => !s)}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition-colors ${
                showThumbnails
                  ? 'bg-primary-100 text-primary-600'
                  : 'hover:bg-background-200 text-foreground-500'
              }`}
              title="Слайдове (T)"
            >
              <i className="ri-layout-grid-line" />
            </button>
          )}
          <button
            onClick={toggleFullscreen}
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition-colors ${
              isFullscreen
                ? 'hover:bg-background-800 text-background-400'
                : 'hover:bg-background-200 text-foreground-500'
            }`}
            title={isFullscreen ? 'Изход (Esc)' : 'Цял екран (F)'}
          >
            <i className={isFullscreen ? 'ri-fullscreen-exit-line' : 'ri-fullscreen-line'} />
          </button>
        </div>
      </div>

      {/* ── Main Canvas Area ── */}
      <div className="flex-1 relative overflow-hidden" onClick={(e) => {
        const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
        const x = e.clientX - rect.left;
        if (x < rect.width * 0.15) prevPage();
        else if (x > rect.width * 0.85) nextPage();
      }}>
        {/* Loading */}
        {loading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3">
            <div className="relative w-14 h-14">
              <div
                className={`absolute inset-0 rounded-full border-4 ${
                  isFullscreen ? 'border-background-800' : 'border-background-300'
                }`}
              />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-500 animate-spin" />
            </div>
            <p className={isFullscreen ? 'text-background-400' : 'text-foreground-600'}>
              Зареждаме презентацията...
            </p>
          </div>
        )}

        {/* Error */}
        {loadError && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 px-6">
            <div className="w-16 h-16 rounded-2xl bg-accent-100 border border-accent-200 flex items-center justify-center">
              <i className="ri-error-warning-line text-accent-500 text-2xl" />
            </div>
            <div className="text-center">
              <p className="text-base font-semibold text-foreground-900 mb-1">
                PDF-ът не може да се зареди
              </p>
              <p className="text-sm text-foreground-500 max-w-sm">
                Възможно е връзката да е прекалено бавна. Опитай да отвориш файла директно.
              </p>
            </div>
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white text-sm font-semibold rounded-xl hover:bg-primary-600 transition-colors"
            >
              <i className="ri-external-link-line" />
              Отвори PDF
            </a>
          </div>
        )}

        {/* Canvas */}
        {!loadError && !loading && (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
          />
        )}

        {/* Nav arrows */}
        {!loading && numPages > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prevPage(); }}
              disabled={currentPage <= 1}
              className={`absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-background-50/90 backdrop-blur border border-background-300 text-foreground-700 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity disabled:opacity-0 shadow-lg`}
            >
              <i className="ri-arrow-left-s-line text-lg sm:text-xl" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); nextPage(); }}
              disabled={currentPage >= numPages}
              className={`absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-background-50/90 backdrop-blur border border-background-300 text-foreground-700 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity disabled:opacity-0 shadow-lg`}
            >
              <i className="ri-arrow-right-s-line text-lg sm:text-xl" />
            </button>
          </>
        )}

        {/* Fullscreen progress dots */}
        {isFullscreen && numPages > 1 && (
          <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 flex-wrap justify-center max-w-[80%]">
            {Array.from({ length: Math.min(numPages, 25) }, (_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); goToPage(i + 1); }}
                className={`h-1.5 sm:h-2 rounded-full transition-all ${
                  i + 1 === currentPage
                    ? 'bg-primary-400 w-4 sm:w-5'
                    : 'bg-background-600 hover:bg-background-400 w-1.5 sm:w-2'
                }`}
              />
            ))}
            {numPages > 25 && (
              <span className="text-[10px] text-background-500 ml-1">+{numPages - 25}</span>
            )}
          </div>
        )}
      </div>

      {/* ── Mobile Bottom Bar (page counter + arrows) ── */}
      {!isFullscreen && numPages > 0 && (
        <div className="shrink-0 flex sm:hidden items-center justify-between px-3 py-2 bg-background-100 border-t border-background-200">
          <button
            onClick={prevPage}
            disabled={currentPage <= 1}
            className="w-8 h-8 rounded-lg bg-background-200 text-foreground-600 flex items-center justify-center disabled:opacity-30"
          >
            <i className="ri-arrow-left-s-line" />
          </button>
          <span className="text-xs font-medium text-foreground-700 tabular-nums">
            {currentPage} / {numPages}
          </span>
          <button
            onClick={nextPage}
            disabled={currentPage >= numPages}
            className="w-8 h-8 rounded-lg bg-background-200 text-foreground-600 flex items-center justify-center disabled:opacity-30"
          >
            <i className="ri-arrow-right-s-line" />
          </button>
        </div>
      )}

      {/* ── Thumbnails Strip (horizontal on all screens) ── */}
      {showThumbnails && numPages > 0 && !isFullscreen && (
        <div className="shrink-0 bg-background-900 border-t border-background-800/60 overflow-x-auto">
          <div className="flex items-center gap-2 px-3 py-2">
            {Array.from({ length: numPages }, (_, i) => {
              const pageNum = i + 1;
              const active = pageNum === currentPage;
              return (
                <button
                  key={pageNum}
                  onClick={() => goToPage(pageNum)}
                  className={`shrink-0 flex flex-col items-center gap-1 rounded-lg overflow-hidden border-2 transition-all ${
                    active
                      ? 'border-primary-500'
                      : 'border-transparent hover:border-background-700'
                  }`}
                >
                  <ThumbnailPage
                    pdfDoc={pdfDoc}
                    pageNum={pageNum}
                    active={active}
                  />
                  <span
                    className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                      active ? 'bg-primary-500/20 text-primary-400' : 'text-background-400'
                    }`}
                  >
                    {pageNum}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Quiz Prompt Overlay ── */}
      {showQuizPrompt && !isFullscreen && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-background-950/60 backdrop-blur-sm">
          <div className="bg-background-50 rounded-2xl border border-background-200 p-6 sm:p-8 max-w-sm mx-4 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-accent-100 border border-accent-200 flex items-center justify-center mx-auto mb-4">
              <i className="ri-brain-line text-accent-500 text-2xl" />
            </div>
            <h3 className="text-lg font-bold text-foreground-900 text-center mb-2">
              Готови за тест?
            </h3>
            <p className="text-sm text-foreground-600 text-center mb-6">
              Изгледахте всички слайдове. Време е да проверите знанията си!
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDismissQuiz}
                className="flex-1 px-4 py-3 bg-background-100 border border-background-300 text-foreground-600 text-sm font-medium rounded-xl hover:bg-background-200 transition-colors"
              >
                По-късно
              </button>
              <button
                onClick={handleStartQuiz}
                className="flex-1 px-4 py-3 bg-accent-500 text-white text-sm font-semibold rounded-xl hover:bg-accent-600 transition-colors"
              >
                Започни тест
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Bottom Control Bar (desktop only) ── */}
      {!isFullscreen && (
        <div className="shrink-0 hidden sm:flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 bg-background-100 border-t border-background-200">
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-background-50 border border-background-300 text-foreground-700 text-xs sm:text-sm rounded-xl hover:bg-background-200 hover:border-foreground-300 transition-all whitespace-nowrap"
          >
            <i className="ri-external-link-line" />
            <span>Отвори в нов прозорец</span>
          </a>

          <div className="flex items-center gap-2">
            {!isCompleted && (
              <button
                onClick={handleMarkComplete}
                className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-primary-500 text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-primary-600 active:bg-primary-700 transition-colors whitespace-nowrap"
              >
                <i className="ri-check-double-line" />
                Маркирай завършен
              </button>
            )}
            {isCompleted && hasQuiz && quizScore === null && (
              <button
                onClick={onStartQuiz}
                className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-accent-500 text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-accent-600 active:bg-accent-700 transition-colors whitespace-nowrap"
              >
                <i className="ri-brain-line" />
                Започни тест
              </button>
            )}
            {quizScore !== null && quizTotal !== null && (
              <span className="text-xs sm:text-sm font-medium text-foreground-600 px-3 sm:px-4 py-2 sm:py-2.5 bg-background-50 rounded-lg border border-background-300">
                Тест: {quizScore}/{quizTotal}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Thumbnail — memoized, renders once per page
   ═══════════════════════════════════════════════════════════════ */
interface ThumbnailPageProps {
  pdfDoc: any;
  pageNum: number;
  active: boolean;
}

const ThumbnailPage = memo(function ThumbnailPage({ pdfDoc, pageNum, active }: ThumbnailPageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderedRef = useRef(false);

  useEffect(() => {
    if (!pdfDoc || !canvasRef.current || renderedRef.current) return;

    const canvas = canvasRef.current;
    const render = async () => {
      try {
        const page = await pdfDoc.getPage(pageNum);
        const viewport = page.getViewport({ scale: 0.15 });
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        canvas.width = Math.floor(viewport.width * dpr);
        canvas.height = Math.floor(viewport.height * dpr);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        await page.render({ canvasContext: ctx, viewport }).promise;
        renderedRef.current = true;
      } catch {
        /* skip */
      }
    };

    // Delay thumbnail render to prioritize main slide
    const timer = setTimeout(render, pageNum * 50);
    return () => clearTimeout(timer);
  }, [pdfDoc, pageNum, active]);

  return (
    <canvas
      ref={canvasRef}
      className="block"
      style={{ minWidth: 60, minHeight: 40 }}
    />
  );
});

export default PdfPresentationViewer;