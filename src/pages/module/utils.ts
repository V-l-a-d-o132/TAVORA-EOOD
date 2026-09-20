import { LEARNING_SECTIONS } from '@/mocks/learning-platform';
import { supabase } from '@/lib/supabase';
import type { QuizQuestion } from '@/lib/academy-content';
import type { LessonProgress } from '@/pages/module/types';

/* ─── Map module → pricing program tier ─── */
export function getProgramTierForModuleId(moduleId: string): string {
  if (moduleId.startsWith('s02-')) return 'perfectVideo';
  if (moduleId.startsWith('s03-')) return 'marketingBasics';
  return 'silkRoad';
}

/* ─── Find module by ID ─── */
export function findModule(moduleId: string) {
  try {
    const sections = LEARNING_SECTIONS || [];
    for (let s = 0; s < sections.length; s++) {
      const sec = sections[s];
      if (!sec || !sec.modules) continue;
      for (let m = 0; m < sec.modules.length; m++) {
        const mod = sec.modules[m];
        if (mod && mod.id === moduleId) {
          return { section: sec, mod };
        }
      }
    }
  } catch {
    // ignore
  }
  return null;
}

/* ─── Get next module ID ─── */
export function getNextModuleId(currentModuleId: string): { id: string; title: string; sectionTitle: string } | null {
  const allModuleIds: string[] = [];
  const moduleMap: Record<string, { title: string; sectionTitle: string }> = {};

  for (const section of LEARNING_SECTIONS) {
    for (const mod of section.modules) {
      allModuleIds.push(mod.id);
      moduleMap[mod.id] = { title: mod.title, sectionTitle: section.title };
    }
  }

  const currentIdx = allModuleIds.indexOf(currentModuleId);
  if (currentIdx === -1 || currentIdx >= allModuleIds.length - 1) return null;

  const nextId = allModuleIds[currentIdx + 1];
  const nextMeta = moduleMap[nextId];
  if (!nextMeta) return null;

  return { id: nextId, title: nextMeta.title, sectionTitle: nextMeta.sectionTitle };
}

/* ─── Get PDF URL ─── */
export async function getPdfUrl(moduleId: string, lessonId: string): Promise<string | null> {
  const { data, error } = await supabase.storage.from('course-pdfs').createSignedUrl(moduleId + '/' + lessonId + '.pdf', 300);
  return error ? null : data.signedUrl;
}

/* ─── Save user progress to Supabase ─── */
export async function saveProgress(
  userId: string,
  moduleId: string,
  lessonId: string,
  data: Partial<LessonProgress>
) {
  if (!userId || !moduleId || !lessonId) return;
  try {
    const { error } = await supabase.from('pdf_progress').upsert(
      {
        user_id: userId,
        module_id: moduleId,
        lesson_id: lessonId,
        page_number: data.pageNumber || 1,
        total_pages: data.totalPages || 1,
        completed: data.completed ?? false,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,module_id,lesson_id' }
    );
    if (error) throw error;
  } catch (error) {
    console.error('Progress could not be saved');
    throw error;
  }
}

/* Questions never include answer keys. */
export async function loadQuizQuestions(moduleId: string, lessonId: string): Promise<QuizQuestion[]> {
  const { data, error } = await supabase.rpc('academy_get_quiz', { p_module: moduleId, p_lesson: lessonId });
  if (error) throw error;
  return data || [];
}
