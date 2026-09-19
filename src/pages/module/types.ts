/* ─── Module Page Types ─── */
export interface LessonProgress {
  completed: boolean;
  pageNumber: number;
  totalPages: number;
  quizScore: number | null;
  quizTotal: number | null;
}

export interface ModuleProgressMap {
  [lessonId: string]: LessonProgress;
}