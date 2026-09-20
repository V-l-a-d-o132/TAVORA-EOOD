/* ─── Module Page Types ─── */
export interface LessonProgress {
  completed: boolean;
  pageNumber: number;
  totalPages: number;
  quizScore: number | null;
  quizTotal: number | null;
  xp?: number;
  scorePercent?: number | null;
  masteryStatus?: 'learning' | 'practicing' | 'mastered';
  currentBlockKey?: string | null;
  lastActivityAt?: string | null;
}

export interface ModuleProgressMap {
  [lessonId: string]: LessonProgress;
}
