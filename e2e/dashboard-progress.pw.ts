import { test, expect, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const API_HOST = 'dashboard-fixture.supabase.co';
const USER = { id: '00000000-0000-4000-8000-000000000091', email: 'student@example.invalid', user_metadata: { full_name: 'Ученик' }, app_metadata: {}, aud: 'authenticated', created_at: '2026-10-01T12:00:00Z' };

async function prepare(page: Page, points = 2, failOnce = false) {
  let failed = false;
  await page.addInitScript(({ user, expires }) => {
    localStorage.setItem('sb-dashboard-fixture-auth-token', JSON.stringify({
      user, access_token: 'synthetic-dashboard-fixture', refresh_token: 'synthetic-refresh',
      token_type: 'bearer', expires_in: 3600, expires_at: expires,
    }));
  }, { user: USER, expires: Math.floor(Date.now() / 1000) + 3600 });
  await page.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.hostname === '127.0.0.1') return route.continue();
    // Optional local icon font makes offline visual QA match the production UI.
    if (url.hostname === 'cdnjs.cloudflare.com' && url.pathname.includes('remixicon') && process.env.DASHBOARD_TEST_REMIXICON_DIR) {
      const name = url.pathname.split('/').pop()!;
      const filename = name.endsWith('.css') ? 'remixicon.css' : name;
      return route.fulfill({ body: await readFile(join(process.env.DASHBOARD_TEST_REMIXICON_DIR, filename)), contentType: name.endsWith('.css') ? 'text/css' : 'font/woff2' });
    }
    if (url.hostname !== API_HOST) return route.abort();
    // Every backend call is intercepted, including auth and email functions.
    if (url.pathname.endsWith('/academy_get_learning_progress')) {
      if (failOnce && !failed) {
        failed = true;
        return route.fulfill({ status: 503, json: { message: 'Synthetic offline response' } });
      }
      return route.fulfill({ json: [{ module_id: 's01-m01', lesson_id: 'l01-01', completed: false, quiz_score: 0, xp: points, quiz_count: 0, practice_count: 0, updated_at: '2026-10-12T12:00:00Z', activity_dates: [] }] });
    }
    if (url.pathname.includes('/profiles') && route.request().method() === 'GET') return route.fulfill({ json: [{
      has_full_access: true, unlocked_modules: [],
      last_opened_lesson: { moduleId: 's02-m01', lessonId: 'pv01-01', timestamp: '2026-10-13T12:00:00Z' },
    }] });
    if (url.pathname.endsWith('/user')) return route.fulfill({ json: USER });
    return route.fulfill({ json: null });
  });
}

async function openDashboard(page: Page) {
  await page.goto('/dashboard');
  await expect(page.getByRole('heading', { name: 'Ученик', exact: true })).toBeVisible();
  const cookies = page.getByRole('button', { name: 'Само задължителни', exact: true });
  if (await cookies.isVisible()) await cookies.click();
}

test('Desktop progress, disclosure, profile menu and keyboard resume work', async ({ page }) => {
  await prepare(page);
  await openDashboard(page);
  await expect(page.getByText('Остават 48 XP до следващото ниво.')).toBeVisible();
  await expect(page.getByRole('region', { name: 'Учебни резултати' }).getByRole('progressbar')).toHaveCount(2);
  await expect(page.getByText('Домашни', { exact: true })).toHaveCount(0);
  await page.getByText('Как се смятат точките и напредъкът?', { exact: true }).click();
  await expect(page.getByText(/Един изпит се брои като една проверка/)).toBeVisible();
  const profile = page.getByRole('button', { name: 'Меню на профила' });
  await profile.click();
  await expect(page.getByRole('button', { name: 'Излез от акаунта' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(profile).toBeFocused();
  const resume = page.getByRole('link', { name: /^Продължи:/ });
  await resume.focus(); await expect(resume).toBeFocused();
  const destination = await resume.getAttribute('href');
  expect(destination).toBe('/module/s02-m01?lesson=0');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(new RegExp(destination!.replace(/[.*+?^$()|[\]\\]/g, '\\$&') + '$'));
});

for (const width of [320, 375, 768]) {
  test('Progress remains readable without clipped controls at ' + width + 'px', async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await prepare(page, 125); await openDashboard(page);
    await expect(page.getByText('Остават 25 XP до следващото ниво.')).toBeVisible();
    const bounds = await page.locator('main').evaluate(element => {
      const elements = Array.from(element.querySelectorAll('a,h2,p,[role="progressbar"]'));
      return elements.map(item => {
        const rect = item.getBoundingClientRect();
        return { text: item.textContent, left: rect.left, right: rect.right, clipped: item.scrollWidth > item.clientWidth + 1 };
      }).filter(rect => rect.right > 0 && rect.left < innerWidth);
    });
    expect(bounds.filter(rect => rect.left < -1 || rect.right > width + 1 || rect.clipped)).toEqual([]);
    await page.screenshot({ path: testInfo.outputPath('dashboard-' + width + '.png'), fullPage: true });
  });
}

test('A failed progress request can be retried from the dashboard', async ({ page }) => {
  await prepare(page, 2, true); await page.goto('/dashboard');
  await page.getByRole('button', { name: 'Опитай пак' }).click();
  await expect(page.getByText('Остават 48 XP до следващото ниво.')).toBeVisible();
});
