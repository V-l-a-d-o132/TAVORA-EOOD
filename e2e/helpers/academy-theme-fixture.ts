import { readFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Page } from '@playwright/test';
const openings = JSON.parse(readFileSync(new URL('../../scripts/course-openings/releases/s01-m01.json', import.meta.url), 'utf8'));

const HOST = 'dashboard-fixture.supabase.co';
const USER = { id: '00000000-0000-4000-8000-000000000091', email: 'student@example.invalid', user_metadata: { full_name: 'Ученик' }, app_metadata: {}, aud: 'authenticated', created_at: '2026-10-01T12:00:00Z' };
const opening = openings.lessons[0];

export type ThemeLessonFixture = { blocks: Array<{ key: string; type: string; [key: string]: unknown }>; title?: string; objective?: string; matchingExpected?: Record<string,string> };
type ThemeAccessFixture = { hasFullAccess?: boolean; unlockedModules?: string[]; completedFreeModule?: boolean };

/** Auth, saves and grading are all synthetic; no request reaches a live service. */
export async function prepareAcademyTheme(page: Page, preference = 'dark', fixture?: ThemeLessonFixture, access: ThemeAccessFixture = {}) {
  const hasFullAccess = access.hasFullAccess ?? true;
  const unlockedModules = access.unlockedModules ?? [];
  const requests: Record<string, number> = {};
  let progress = { current_block_key: fixture?.blocks[0].key || opening.first_page.key, completed_block_keys: [] as string[], block_state: {} as Record<string, unknown>, xp: 0, score_percent: null, mastery_status: 'learning', completed_at: null, last_activity_at: '2026-10-13T12:00:00Z' };
  let bookmark = { moduleId: 's01-m01', lessonId: 'l01-01', timestamp: '2026-10-13T12:00:00Z' };
  await page.addInitScript(({ user, expires, preference }) => {
    if (window !== window.top) return;
    localStorage.setItem('sb-dashboard-fixture-auth-token', JSON.stringify({ user, access_token: 'synthetic-theme-fixture', refresh_token: 'synthetic-refresh', token_type: 'bearer', expires_in: 3600, expires_at: expires }));
    // Seed only the first visit; a reload must restore the user's later choice.
    const key = 'tavora:academy-theme:' + user.id;
    if (!localStorage.getItem(key)) localStorage.setItem(key, preference);
    localStorage.setItem('cookie_consent', JSON.stringify({ necessary: true, analytics: false, marketing: false }));
  }, { user: USER, expires: Math.floor(Date.now() / 1000) + 3600, preference });
  await page.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.hostname === '127.0.0.1') return route.continue();
    if (url.hostname === 'cdnjs.cloudflare.com' && url.pathname.includes('remixicon') && process.env.DASHBOARD_TEST_REMIXICON_DIR) {
      const name = url.pathname.split('/').pop()!;
      return route.fulfill({ body: await readFile(join(process.env.DASHBOARD_TEST_REMIXICON_DIR, name.endsWith('.css') ? 'remixicon.css' : name)), contentType: name.endsWith('.css') ? 'text/css' : 'font/woff2', headers: { 'access-control-allow-origin': '*' } });
    }
    if (url.hostname !== HOST) return route.abort();
    const name = url.pathname.split('/').pop()!;
    requests[name] = (requests[name] || 0) + 1;
    const payload = route.request().postDataJSON() || {};
    if (name === 'academy_get_learning_progress') return route.fulfill({ json: access.completedFreeModule
      ? ['l01-01', 'l01-02', 'l01-03', 'l01-04'].map(lesson_id => ({ module_id: 's01-m01', lesson_id, completed: true, quiz_score: 100, xp: 5, quiz_count: 1, practice_count: 1, updated_at: '2026-10-14T07:00:00Z', activity_dates: [] }))
      : [{ module_id: 's01-m01', lesson_id: 'l01-01', completed: false, quiz_score: null, xp: 125, quiz_count: 3, practice_count: 2, updated_at: '2026-10-13T12:00:00Z', activity_dates: [] }] });
    if (name === 'profiles' && route.request().method() === 'GET') {
      const profile = { has_full_access: hasFullAccess, unlocked_modules: unlockedModules, last_opened_lesson: bookmark };
      return route.fulfill({ json: route.request().headers().accept?.includes('pgrst.object') ? profile : [profile] });
    }
    if (name === 'user') return route.fulfill({ json: USER });
    if (name === 'academy_get_module_progress') return route.fulfill({ json: [] });
    if (name === 'academy_has_module_access') return route.fulfill({ json: payload.p_module === 's01-m01' || hasFullAccess || unlockedModules.includes(payload.p_module) });
    if (name === 'academy_record_lesson_visit') {
      bookmark = { moduleId: payload.p_module, lessonId: payload.p_lesson, timestamp: new Date().toISOString() };
      return route.fulfill({ json: bookmark });
    }
    if (name === 'academy_get_lesson_v2') return route.fulfill({ json: {
      id: '00000000-0000-4000-8000-000000000081', moduleId: payload.p_module, lessonId: payload.p_lesson,
      status: 'published', versionId: '00000000-0000-4000-8000-000000000082', version: 1,
      title: fixture?.title || opening.lesson_title, subtitle: 'Преглед на темата · пробен профил', duration: '15 мин',
      objective: fixture?.objective || opening.first_page.content.body, hook: '', estimatedMinutes: 15, sourceKind: 'editor',
      validation: { errors: [], warnings: [] }, versionChanged: false, progress,
      blocks: fixture?.blocks || [
        { ...opening.first_page, id: '00000000-0000-4000-8000-000000000083' },
        { id: '00000000-0000-4000-8000-000000000084', key: 'theme-demo-reading', position: 20, type: 'rich_text', title: 'Преглед на текст, таблица и речник', required: true, points: 5,
          content: { body: 'Този блок е демонстрационен материал за проверка на интерфейса. ИИ може да предложи чернова. В този пример разграничаваме известното от липсващото.', columns: ['Налична информация', 'Следваща стъпка'], table: [{ cells: ['Потвърдено условие', 'Проверка по предоставения източник'] }, { cells: ['Липсващо условие', 'Уточнение преди обещание'] }], simulation: 'request' } },
        { id: '00000000-0000-4000-8000-000000000085', key: 'theme-demo-exam', position: 30, type: 'course_exam', title: 'Пробна проверка на избора', required: true, points: 0,
          content: { introduction: 'Демонстрационна проверка за тестване на изгледа. Тя не е част от публикувания курс.', minimumPercent: 100, questions: [{ id: 'theme-demo-q', prompt: 'Кой пробен избор е посочен в условието?', options: [{ id: 'demo-a', label: 'Пробен избор А' }, { id: 'demo-b', label: 'Пробен избор Б' }] }] } },
      ],
    } });
    if (name === 'academy_autosave_lesson') {
      progress = { ...progress, current_block_key: payload.p_current_block, block_state: payload.p_state };
      return route.fulfill({ json: { saved: true } });
    }
    if (name === 'academy_complete_lesson_block') {
      const block = fixture?.blocks.find(block => block.key === payload.p_block_key);
      const graded = block && ['quiz', 'scenario', 'matching', 'sequence_sort'].includes(block.type);
      const correct = graded ? block.type === 'matching' && fixture?.matchingExpected
        ? JSON.stringify(Object.entries(payload.p_payload.matches || {}).sort()) === JSON.stringify(Object.entries(fixture.matchingExpected).sort())
        : !Object.values(payload.p_payload).includes('wrong') : null;
      const complete = correct !== false;
      progress = { ...progress, block_state: { ...progress.block_state, [payload.p_block_key]: payload.p_payload } };
      if (complete && !progress.completed_block_keys.includes(payload.p_block_key)) {
        progress = { ...progress, completed_block_keys: [...progress.completed_block_keys, payload.p_block_key], xp: progress.xp + 5 };
      }
      return route.fulfill({ json: { attemptId: 'synthetic-block', correct, score: complete ? 1 : 0, maxScore: 1, feedback: { complete, explanation: complete ? 'Пробната проверка е премината.' : 'Пробният избор изисква поправка.' }, progress } });
    }
    if (name === 'academy_submit_course_exam') return route.fulfill({ json: { attemptId: 'synthetic-exam', correct: false, score: 0, maxScore: 1, feedback: { complete: false, explanation: 'Демонстрационна обратна връзка за преглед на темата.', scorePercent: 0, correctCount: 0, totalQuestions: 1 }, progress } });
    return route.fulfill({ json: null });
  });
  return requests;
}

export async function selectTheme(page: Page, label: string) {
  const radio = page.getByRole('radio', { name: label, exact: true });
  if (!await radio.isVisible()) await page.getByRole('button', { name: /^Тема:/ }).click();
  await radio.check(); await page.keyboard.press('Escape');
}
