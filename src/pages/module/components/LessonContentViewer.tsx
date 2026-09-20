import { useState } from 'react';
import { Link } from 'react-router-dom';
import { C } from '@/pages/module/constants';
import type { LessonProgress, ModuleProgressMap } from '@/pages/module/types';
import InteractiveLesson from '@/pages/module/components/InteractiveLesson';
import PdfPresentationViewer from '@/pages/module/components/PdfPresentationViewer';
import InlineQuiz from '@/pages/module/components/InlineQuiz';
import ModuleLoginGate from '@/pages/module/components/ModuleLoginGate';
import type { QuizQuestion } from '@/lib/academy-content';

interface LessonContentViewerProps {
  moduleId: string;
  modNumber: string | number;
  modTitle: string;
  modHomeworkPrompt: string;
  lessons: Array<{ id: string; title: string; duration: string; hasQuiz?: boolean; pdfPath?: string }>;
  activeLessonIndex: number;
  activeLesson: { id: string; title: string; duration: string; hasQuiz?: boolean; pdfPath?: string };
  isModule1: boolean;
  user: { id: string } | null;
  hasFullAccess: boolean;
  isModuleUnlocked: boolean;
  hasNextLesson: boolean;
  contentKey: number;
  contentTransitioning: boolean;
  pdfLoading: boolean;
  pdfUrl: string | null;
  currentProg: LessonProgress;
  showQuiz: boolean;
  showNotes: boolean;
  notes: string;
  isLessonCompleted: boolean;
  allCompleted: boolean;
  totalPoints: number;
  progressMap: ModuleProgressMap;
  prefetchedQuestions: QuizQuestion[];
  saveStatus: 'idle' | 'saving' | 'saved';
  errorMsg: string;
  setErrorMsg: (msg: string) => void;
  setShowQuiz: (v: boolean) => void;
  setShowNotes: (v: boolean) => void;
  setNotes: (v: string) => void;
  markLessonComplete: (lessonId: string) => Promise<void>;
  handleQuizComplete: (score: number, total: number) => Promise<void>;
  goNext: () => void;
  setMobileSidebarOpen: (v: boolean) => void;
  slideProgressMap?: Record<string, { seen: number; total: number }>;
  onSlideProgress?: (lessonId: string, seen: number, total: number) => void;
  nextModule?: { id: string; title: string; sectionTitle: string } | null;
  onTrustedProgress?: (lessonId: string, progress: { completed: boolean; xp: number; scorePercent: number | null; masteryStatus: 'learning' | 'practicing' | 'mastered' }) => void;
}

export default function LessonContentViewer({
  moduleId,
  modTitle,
  modNumber,
  modHomeworkPrompt,
  lessons,
  activeLessonIndex,
  activeLesson,
  isModule1,
  user,
  hasFullAccess,
  isModuleUnlocked,
  hasNextLesson,
  contentKey,
  contentTransitioning,
  pdfLoading,
  pdfUrl,
  currentProg,
  showQuiz,
  showNotes,
  notes,
  isLessonCompleted,
  allCompleted,
  totalPoints,
  prefetchedQuestions,
  saveStatus,
  errorMsg,
  setErrorMsg,
  setShowQuiz,
  setShowNotes,
  setNotes,
  markLessonComplete,
  handleQuizComplete,
  goNext,
  setMobileSidebarOpen,
  progressMap,
  slideProgressMap,
  onSlideProgress,
  nextModule,
  onTrustedProgress,
}: LessonContentViewerProps) {
  const completedCount = lessons.filter((l) => {
    const p = progressMap?.[l.id];
    return p?.completed === true;
  }).length;

  return (
    <main className="min-w-0 space-y-5">
      <div
        key={contentKey}
        className="transition-all duration-300 ease-out"
        style={{
          opacity: contentTransitioning ? 0 : 1,
          ...(contentTransitioning ? { transform: 'translateY(6px)' } : {}),
        }}
      >
        {/* Interactive lesson mode for all modules */}
        {(moduleId.startsWith('s01-') || moduleId.startsWith('s02-') || moduleId.startsWith('s03-')) ? (
          <div className="min-h-[480px]">
            <InteractiveLesson
              moduleId={moduleId}
              lessonId={lessons[activeLessonIndex]?.id}
              userId={user?.id}
              onComplete={() => markLessonComplete(activeLesson.id)}
              onNextLesson={hasNextLesson ? goNext : undefined}
              hasNextLesson={hasNextLesson}
              lockAfterComplete={moduleId === 's01-m01' && !user && activeLessonIndex === lessons.length - 1}
              isUnlocked={isModuleUnlocked}
              hasFullAccess={hasFullAccess}
              onSlideProgress={(seen, total) => {
                if (onSlideProgress && activeLesson?.id) {
                  onSlideProgress(activeLesson.id, seen, total);
                }
              }}
              onTrustedProgress={onTrustedProgress}
            />
          </div>
        ) : (
          <>
            {/* PDF Presentation Viewer */}
            {pdfLoading ? (
              <div className="flex flex-col items-center justify-center gap-3 h-[calc(100vh-140px)] sm:h-[calc(100vh-180px)]" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0" style={{ border: `3px solid ${C.border}`, borderRadius: '50%' }} />
                  <div className="absolute inset-0 animate-spin" style={{ border: '3px solid transparent', borderTopColor: C.accent, borderRadius: '50%' }} />
                </div>
                <p className="text-base" style={{ color: C.textMuted }}>Зареждаме урока...</p>
              </div>
            ) : pdfUrl ? (
              <div className="h-[calc(100vh-140px)] sm:h-[calc(100vh-180px)] min-h-[400px]">
                <PdfPresentationViewer
                  pdfUrl={pdfUrl}
                  lessonId={activeLesson.id}
                  moduleId={moduleId}
                  isCompleted={isLessonCompleted}
                  onMarkComplete={() => markLessonComplete(activeLesson.id)}
                  hasQuiz={!!activeLesson.hasQuiz}
                  lessonTitle={activeLesson.title}
                  onStartQuiz={() => setShowQuiz(true)}
                  onLastSlideReached={() => {
                    if (activeLesson.hasQuiz && !isLessonCompleted) {
                      setShowQuiz(true);
                    }
                  }}
                  savedPageNumber={currentProg.pageNumber}
                  savedTotalPages={currentProg.totalPages}
                  quizScore={currentProg.quizScore}
                  quizTotal={currentProg.quizTotal}
                  userId={user?.id}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 h-[calc(100vh-140px)] sm:h-[calc(100vh-180px)] px-6" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                <div className="w-16 h-16 flex items-center justify-center" style={{ background: C.bg, border: `1px solid ${C.border}` }}>
                  <i className="ri-file-pdf-line text-2xl" style={{ color: C.textDim }} />
                </div>
                <div className="text-center">
                  <p className="text-base font-medium mb-1" style={{ color: C.textMuted }}>PDF за този урок ще е наличен скоро</p>
                  <p className="text-sm" style={{ color: C.textDim }}>{activeLesson.pdfPath || 'Няма PDF файл'}</p>
                </div>
                {!isLessonCompleted && (
                  <button
                    onClick={() => markLessonComplete(activeLesson.id)}
                    className="px-6 py-3 text-sm font-medium transition-colors"
                    style={{ background: C.accent, color: '#fff' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = C.accentHover; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = C.accent; }}
                  >
                    Маркирай като прочетен
                  </button>
                )}
              </div>
            )}

            {/* Quiz */}
            {showQuiz && activeLesson && (
              <InlineQuiz
                key={moduleId + activeLesson.id}
                moduleId={moduleId}
                lessonId={activeLesson.id}
                questions={prefetchedQuestions}
                lessonTitle={activeLesson.title}
                onComplete={handleQuizComplete}
                onClose={() => setShowQuiz(false)}
              />
            )}

            {/* Controls */}
            <div className="flex items-center gap-3 flex-wrap">
              {isLessonCompleted && (
                <div className="flex items-center gap-2 px-5 py-3" style={{ background: C.successDim, border: `1px solid #113311` }}>
                  <i className="ri-check-double-line" style={{ color: C.success }} />
                  <span className="text-sm font-medium" style={{ color: C.success }}>Завършен · +10 точки</span>
                </div>
              )}
              <button
                onClick={() => setShowNotes(!showNotes)}
                className="flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all whitespace-nowrap"
                style={{
                  background: showNotes ? C.surface : 'transparent',
                  border: `1px solid ${showNotes ? C.border : 'transparent'}`,
                  color: C.textMuted,
                }}
              >
                <i className="ri-sticky-note-line" />Бележки
              </button>
              {hasNextLesson && (
                <button
                  onClick={goNext}
                  className="flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors whitespace-nowrap ml-auto"
                  style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.textMuted }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.borderHover; e.currentTarget.style.color = C.text; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textMuted; }}
                >
                  Следващ урок<i className="ri-arrow-right-line" />
                </button>
              )}
            </div>

            {/* Notes */}
            {showNotes && (
              <div className="p-5" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                <h3 className="text-base font-semibold mb-3" style={{ color: C.text }}>Бележки за модула</h3>
                <textarea
                  value={notes}
                  onChange={(e) => {
                    const val = e.target.value.slice(0, 2000);
                    setNotes(val);
                    try { localStorage.setItem(`module-notes-${moduleId}`, val); } catch { /* ignore */ }
                  }}
                  placeholder="Запиши бележки..."
                  rows={6}
                  className="w-full px-4 py-3 text-sm resize-y transition-all"
                  style={{
                    background: C.bg,
                    border: `1px solid ${C.border}`,
                    color: C.text,
                    outline: 'none',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = C.accent; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = C.border; }}
                />
                <p className="text-xs mt-2" style={{ color: C.textDim }}>{notes.length}/2000</p>
              </div>
            )}

            {/* Completion Banner — only for logged-in or non-Module1 */}
            {(!isModule1 || user) && allCompleted && (
              <div className="relative overflow-hidden p-5 md:p-6" style={{ background: C.accentDim, border: `1px solid ${C.accent}` }}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-14 h-14 flex items-center justify-center shrink-0" style={{ background: 'rgba(229,62,62,0.2)' }}>
                      <i className="ri-trophy-line text-2xl" style={{ color: C.accent }} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-lg font-semibold" style={{ color: C.text }}>Модулът е завършен!</p>
                      <p className="text-sm" style={{ color: C.textMuted }}>Предай домашното, за да финализираш</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <span className="text-base font-bold px-5 py-2.5 shrink-0 whitespace-nowrap" style={{ background: 'rgba(229,62,62,0.2)', color: C.accent }}>+{totalPoints} точки</span>
                    {nextModule && (
                      <Link
                        to={`/module/${nextModule.id}`}
                        className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold transition-all whitespace-nowrap"
                        style={{ background: C.accent, color: '#fff' }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#ff5555'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = C.accent; }}
                      >
                        Следващ модул <i className="ri-arrow-right-line" />
                      </Link>
                    )}
                  </div>
                </div>
                {nextModule && (
                  <p className="text-xs mt-2" style={{ color: C.textDim }}>
                    <i className="ri-stack-line mr-1" style={{ fontSize: '10px' }} />
                    {nextModule.sectionTitle} — {nextModule.title}
                  </p>
                )}
              </div>
            )}

            {/* Homework */}
            {(user || !isModule1) && (
              <div className="p-5" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 flex items-center justify-center" style={{ background: C.bg, border: `1px solid ${C.border}` }}>
                    <i className="ri-file-edit-line text-lg" style={{ color: C.textDim }} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold" style={{ color: C.text }}>Домашно</h3>
                    <p className="text-xs" style={{ color: C.textDim }}>Модул {modNumber} · {modTitle}</p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: C.textMuted }}>{modHomeworkPrompt}</p>
              </div>
            )}

            {/* Module 1 Login Gate */}
            {isModule1 && !user && allCompleted && (
              <ModuleLoginGate errorMsg={errorMsg} setErrorMsg={setErrorMsg} />
            )}
          </>
        )}
      </div>
    </main>
  );
}
