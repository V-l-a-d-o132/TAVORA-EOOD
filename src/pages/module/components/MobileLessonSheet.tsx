import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
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
  safeProgress: (lessonId: string) => LessonProgress;
  onChangeLesson: (idx: number) => void;
  onClose: () => void;
}

export default function MobileLessonSheet({
  open, sectionTitle, modTitle, lessons, activeLessonIndex,
  completedCount, totalLessons, safeProgress, onChangeLesson, onClose,
}: MobileLessonSheetProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;
  return (
    <dialog ref={dialogRef} id="module-lessons-dialog" aria-labelledby="module-lessons-title" aria-modal="true"
      onCancel={onClose} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
      className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none flex-col justify-end border-0 bg-transparent p-0 text-white backdrop:bg-black/70 open:flex">
      <div className="mx-auto flex max-h-[80dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-[#111] shadow-2xl">
        <header className="flex shrink-0 items-start justify-between gap-3 border-b border-white/10 px-5 py-4">
          <div className="min-w-0">
            <p className="text-xs text-zinc-400">{sectionTitle}</p>
            <h2 id="module-lessons-title" className="mt-1 text-base font-semibold">Уроци · {modTitle}</h2>
            <p className="mt-1 text-xs text-zinc-400">{completedCount} от {totalLessons} завършени</p>
          </div>
          <button type="button" aria-label="Затвори уроците" autoFocus onClick={onClose} className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/10 text-zinc-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-400">
            <i className="ri-close-line text-xl" aria-hidden />
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {lessons.map((lesson, index) => {
            const done = safeProgress(lesson.id).completed;
            const isActive = index === activeLessonIndex;
            return (
              <button key={lesson.id} type="button" aria-current={isActive ? 'page' : undefined}
                onClick={() => { onClose(); onChangeLesson(index); }}
                className="flex w-full items-center gap-3 border-b border-white/10 px-5 py-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-red-400"
                style={{ background: isActive ? C.accentDim : 'transparent' }}>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-sm font-semibold" style={{ background: done ? C.success : isActive ? C.accent : C.border }}>
                  {done ? <i className="ri-check-line" aria-label="Завършен" /> : index + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className={`block text-sm leading-5 ${isActive ? 'font-semibold text-white' : 'text-zinc-300'}`}>{lesson.title}</span>
                  <span className="mt-1 block text-xs text-zinc-400">{lesson.duration}</span>
                </span>
              </button>
            );
          })}
        </div>
        <nav aria-label="Изход от урока" className="grid shrink-0 grid-cols-2 gap-2 border-t border-white/10 px-4 pt-3 pb-[calc(.75rem+env(safe-area-inset-bottom))]">
          <Link to="/dashboard" onClick={onClose} className="rounded-xl border border-white/15 px-3 py-3 text-center text-sm font-medium hover:bg-white/5">Към таблото</Link>
          <Link to="/kurs" onClick={onClose} className="rounded-xl border border-white/15 px-3 py-3 text-center text-sm font-medium hover:bg-white/5">Всички модули</Link>
        </nav>
      </div>
    </dialog>
  );
}
