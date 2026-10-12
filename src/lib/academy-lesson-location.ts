import { LEARNING_SECTIONS, PREVIOUS_MARKETING_LESSONS, type Module } from '@/mocks/learning-platform';

export function locateLesson(moduleId: string, lessonId: string) {
  for (const section of LEARNING_SECTIONS) {
    for (const module of section.modules) {
      const lessonIndex = module.lessons.findIndex(lesson =>
        lesson.id === lessonId && (lesson.sourceModuleId || module.id) === moduleId);
      if (lessonIndex >= 0) return { section, module, lesson: module.lessons[lessonIndex], lessonIndex };
    }
  }
  return null;
}

export function lessonRoute(moduleId: string, lessonId: string, lessonIndex: number): string {
  const query = moduleId.startsWith('s03-') ? lessonId : String(lessonIndex);
  return `/module/${moduleId}?lesson=${encodeURIComponent(query)}`;
}

export function legacyMarketingRoute(moduleId: string | undefined, query: string | null): string | null {
  if (!moduleId?.startsWith('s03-') || query === null) return null;
  const numeric = /^[0-9]+$/.test(query);
  const lessonId = numeric ? PREVIOUS_MARKETING_LESSONS[moduleId]?.[Number(query)]?.id : query;
  if (!lessonId) return null;
  const found = locateLesson(moduleId, lessonId);
  return found && (numeric || found.module.id !== moduleId)
    ? lessonRoute(found.module.id, found.lesson.id, found.lessonIndex) : null;
}

export function requestedLessonIndex(module: Module | null, query: string | null): number {
  if (!module || query === null) return 0;
  const index = /^[0-9]+$/.test(query) ? Number(query) : module.lessons.findIndex(lesson => lesson.id === query);
  return index >= 0 && index < module.lessons.length ? index : 0;
}

