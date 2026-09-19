import { C } from '@/pages/module/constants';
import type { LessonProgress } from '@/pages/module/types';

interface MobileLessonSheetProps {
  open: boolean;
  sectionTitle: string;
  modTitle: string;
  lessons: Array<{ id: string; title: string; duration: string; hasQuiz?: boolean; pdfPath?: string }>;
  activeLessonIndex: number;
  completedCount: number;
  totalLessons: number;
  hasPrevLesson: boolean;
  hasNextLesson: boolean;
  safeProgress: (lessonId: string) => LessonProgress;
  onChangeLesson: (idx: number) => void;
  onGoPrev: () => void;
  onGoNext: () => void;
  onClose: () => void;
}

export default function MobileLessonSheet({
  open,
  sectionTitle,
  modTitle,
  lessons,
  activeLessonIndex,
  completedCount,
  totalLessons,
  hasPrevLesson,
  hasNextLesson,
  safeProgress,
  onChangeLesson,
  onGoPrev,
  onGoNext,
  onClose,
}: MobileLessonSheetProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 lg:hidden" onClick={onClose}>
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }} />
      <div
        className="absolute bottom-0 left-0 right-0 max-h-[75vh] overflow-hidden flex flex-col"
        style={{ background: C.surface, borderTop: `1px solid ${C.border}` }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="shrink-0 px-5 py-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${C.border}` }}>
          <div>
            <p className="text-xs uppercase tracking-wider" style={{ color: C.textDim }}>{sectionTitle}</p>
            <p className="text-sm font-semibold" style={{ color: C.text }}>{modTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center transition-colors"
            style={{ background: C.bg, border: `1px solid ${C.border}` }}
          >
            <i className="ri-close-line" style={{ color: C.textDim }} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto" style={{ borderTop: `1px solid ${C.border}` }}>
          {lessons.map((lesson, idx) => {
            const p = safeProgress(lesson.id);
            const done = p.completed;
            const isActive = idx === activeLessonIndex;
            return (
              <button
                key={lesson.id}
                onClick={() => onChangeLesson(idx)}
                className="w-full flex items-center gap-3 px-5 py-3.5 text-left transition-colors"
                style={{ background: isActive ? '#1a0505' : 'transparent', borderBottom: `1px solid ${C.border}` }}
              >
                <div
                  className="w-9 h-9 flex items-center justify-center shrink-0 text-sm font-semibold"
                  style={{
                    background: done ? C.success : isActive ? C.accent : C.border,
                    color: '#fff',
                  }}
                >
                  {done ? <i className="ri-check-line" /> : <span>{idx + 1}</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm truncate ${isActive ? 'font-medium' : ''}`} style={{ color: isActive ? C.accent : C.textMuted }}>{lesson.title}</p>
                  <span className="text-xs" style={{ color: C.textDim }}>{lesson.duration}</span>
                </div>
              </button>
            );
          })}
        </div>
        <div className="shrink-0 p-3 flex gap-2" style={{ borderTop: `1px solid ${C.border}` }}>
          <button
            onClick={onGoPrev}
            disabled={!hasPrevLesson}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-3 text-sm transition-colors disabled:opacity-30"
            style={{ background: C.bg, border: `1px solid ${C.border}`, color: C.textMuted }}
          >
            <i className="ri-arrow-left-line" /> Предишен
          </button>
          <button
            onClick={onGoNext}
            disabled={!hasNextLesson}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-3 text-sm font-bold transition-colors disabled:opacity-30"
            style={{ background: C.accent, color: '#fff' }}
          >
            Следващ <i className="ri-arrow-right-line" />
          </button>
        </div>
      </div>
    </div>
  );
}