import { C } from '@/pages/module/constants';
import type { LessonProgress } from '@/pages/module/types';

interface ModuleSidebarProps {
  moduleId: string;
  sectionTitle: string;
  modTitle: string;
  moduleNumber: string | number;
  lessons: Array<{ id: string; title: string; duration: string; hasQuiz?: boolean; pdfPath?: string }>;
  activeLessonIndex: number;
  progressPercent: number;
  completedCount: number;
  totalLessons: number;
  hasPrevLesson: boolean;
  hasNextLesson: boolean;
  safeProgress: (lessonId: string) => LessonProgress;
  onChangeLesson: (idx: number) => void;
  onGoPrev: () => void;
  onGoNext: () => void;
  slideProgressMap?: Record<string, { seen: number; total: number }>;
}

export default function ModuleSidebar({
  sectionTitle,
  modTitle,
  lessons,
  activeLessonIndex,
  progressPercent,
  hasPrevLesson,
  hasNextLesson,
  safeProgress,
  onChangeLesson,
  onGoPrev,
  onGoNext,
  slideProgressMap,
}: ModuleSidebarProps) {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-20 overflow-hidden" style={{ background: C.surface, border: `1px solid ${C.border}` }}>

        {/* Header */}
        <div className="px-5 py-5" style={{ borderBottom: `1px solid ${C.border}` }}>
          <p className="text-xs uppercase tracking-wider" style={{ color: C.textDim }}>{sectionTitle}</p>
          <h2 className="text-base font-semibold mt-1" style={{ color: C.text }}>{modTitle}</h2>
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium" style={{ color: C.textDim }}>Прогрес</span>
              <span className="text-xs font-bold" style={{ color: C.text }}>{progressPercent}%</span>
            </div>
            <div className="w-full overflow-hidden" style={{ height: '2px', background: C.border }}>
              <div
                className="h-full transition-all duration-700"
                style={{ width: `${progressPercent}%`, background: C.accent }}
              />
            </div>
          </div>
        </div>

        {/* Lessons list */}
        <div className="max-h-[55vh] overflow-y-auto">
          {lessons.map((lesson, idx) => {
            const p = safeProgress(lesson.id);
            const done = p.completed;
            const isActive = idx === activeLessonIndex;
            const slideInfo = slideProgressMap?.[lesson.id];

            return (
              <button
                key={lesson.id}
                onClick={() => onChangeLesson(idx)}
                className="w-full flex items-center gap-3 px-5 py-3 text-left transition-colors"
                style={{
                  background: isActive ? '#1a0505' : 'transparent',
                  borderLeft: isActive ? `3px solid ${C.accent}` : '3px solid transparent',
                  borderBottom: `1px solid ${C.border}`,
                }}
              >
                <div
                  className="w-8 h-8 flex items-center justify-center shrink-0 text-xs font-semibold"
                  style={{
                    background: done ? C.success : isActive ? C.accent : C.border,
                    color: '#fff',
                  }}
                >
                  {done ? <i className="ri-check-line" /> : <span>{idx + 1}</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm truncate"
                    style={{ color: isActive ? C.accent : C.textMuted, fontWeight: isActive ? 500 : 400 }}
                  >
                    {lesson.title}
                  </p>
                  <span className="text-xs" style={{ color: C.textDim }}>
                    {lesson.duration}
                    {slideInfo && slideInfo.total > 0 && !done && (
                      <span className="ml-2" style={{ color: C.textDim }}>
                        · {slideInfo.seen}/{slideInfo.total} слайда
                      </span>
                    )}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="p-3 flex gap-2" style={{ borderTop: `1px solid ${C.border}` }}>
          <button
            onClick={onGoPrev}
            disabled={!hasPrevLesson}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-3 text-sm transition-colors disabled:opacity-30 whitespace-nowrap"
            style={{ background: C.bg, border: `1px solid ${C.border}`, color: C.textMuted }}
          >
            <i className="ri-arrow-left-line" /> Предишен
          </button>
          <button
            onClick={onGoNext}
            disabled={!hasNextLesson}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-3 text-sm font-bold transition-colors disabled:opacity-30 whitespace-nowrap"
            style={{ background: C.accent, color: '#fff' }}
          >
            Следващ <i className="ri-arrow-right-line" />
          </button>
        </div>

      </div>
    </aside>
  );
}
