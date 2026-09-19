import { LEARNING_SECTIONS } from '@/mocks/learning-platform';
import { supabase } from '@/lib/supabase';
import { getQuizForLesson, generateDefaultQuiz } from '@/mocks/quiz-questions';
import type { QuizQuestion } from '@/mocks/quiz-questions';
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
export async function getPdfUrl(_moduleId: string, _lessonId: string): Promise<string | null> {
  // PDFs are loaded directly from Supabase Storage when available.
  // Returning null silently avoids dead Edge Function calls (CORS errors).
  return null;
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
    await supabase.from('pdf_progress').upsert(
      {
        user_id: userId,
        module_id: moduleId,
        lesson_id: lessonId,
        page_number: data.pageNumber || 1,
        total_pages: data.totalPages || 1,
        completed: data.completed ?? false,
        quiz_score: data.quizScore ?? null,
        quiz_total: data.quizTotal ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,module_id,lesson_id' }
    );
  } catch {
    // ignore save errors
  }
}

/* ─── Load quiz questions — Supabase first, mock fallback ─── */
export async function loadQuizQuestions(moduleId: string, lessonId: string): Promise<QuizQuestion[]> {
  try {
    const { data, error: err } = await supabase
      .from('lesson_quizzes')
      .select('*')
      .eq('module_id', moduleId)
      .eq('lesson_id', lessonId)
      .order('order_index', { ascending: true });

    if (!err && data && data.length > 0) {
      return data.map((d) => ({
        id: d.id,
        question: d.question,
        options: Array.isArray(d.options) ? d.options : JSON.parse(d.options || '[]'),
        correctIndex: d.correct_index,
        explanation: d.explanation || '',
      }));
    }
  } catch {
    /* fallback to mock */
  }

  const mockQuiz = getQuizForLesson(moduleId, lessonId);
  if (mockQuiz && Array.isArray(mockQuiz.questions)) {
    return mockQuiz.questions;
  }

  return generateDefaultQuiz(moduleId, lessonId, '').questions;
}