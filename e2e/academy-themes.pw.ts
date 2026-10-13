import { test, expect } from '@playwright/test';
import { prepareAcademyTheme, selectTheme } from './helpers/academy-theme-fixture';

test('Explicit themes survive reload and automatic mode follows the device', async ({ page }) => {
  const calls = await prepareAcademyTheme(page);
  await page.goto('/dashboard'); await expect(page.getByText('Остават 25 XP до следващото ниво.')).toBeVisible();
  await page.waitForLoadState('networkidle');
  const before = calls.academy_get_learning_progress;
  await selectTheme(page, 'Светла');
  await expect(page.locator('[data-academy-theme]')).toHaveAttribute('data-academy-theme', 'light');
  expect(calls.academy_get_learning_progress).toBe(before);
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(page.locator('[data-academy-theme]')).toHaveAttribute('data-academy-theme', 'light');
  await page.reload(); await expect(page.getByRole('button', { name: 'Тема: Светла' })).toBeVisible();
  await selectTheme(page, 'По устройството');
  await expect(page.locator('[data-academy-theme]')).toHaveAttribute('data-academy-theme', 'dark');
  await page.emulateMedia({ colorScheme: 'light' });
  await expect(page.locator('[data-academy-theme]')).toHaveAttribute('data-academy-theme', 'light');
});

test('Lesson step, answer and feedback stay intact while switching theme', async ({ page }) => {
  const calls = await prepareAcademyTheme(page, 'light');
  await page.goto('/module/s01-m01?lesson=0');
  await expect(page.getByRole('heading', { name: 'Какво ще можеш след урока' })).toBeVisible();
  await page.getByRole('button', { name: 'Стъпка 3: Пробна проверка на избора' }).click();
  const answer = page.getByRole('radio', { name: 'Пробен избор А', exact: true });
  await answer.check(); await page.waitForLoadState('networkidle');
  const reads = calls.academy_get_lesson_v2;
  await selectTheme(page, 'Тъмна'); await expect(answer).toBeChecked();
  await expect(page.getByRole('heading', { name: 'Пробна проверка на избора' })).toBeVisible();
  expect(calls.academy_get_lesson_v2).toBe(reads);
  await page.getByRole('button', { name: 'Предай целия изпит' }).click();
  await expect(page.getByText('Демонстрационна обратна връзка за преглед на темата.')).toBeVisible();
  await selectTheme(page, 'Светла'); await expect(answer).toBeChecked();
  await expect(page.getByText('Демонстрационна обратна връзка за преглед на темата.')).toBeVisible();
  expect(calls.academy_submit_course_exam).toBe(1);
});

for (const theme of ['dark', 'light']) {
  test(theme + ' theme keeps text and learning feedback readable', async ({ page }) => {
    await prepareAcademyTheme(page, theme); await page.goto('/dashboard');
    await expect(page.getByText('Остават 25 XP до следващото ниво.')).toBeVisible();
    const colors = await page.locator('[data-academy-theme]').evaluate(el => {
      const style = getComputedStyle(el);
      const pairs = [['text', 'surface'], ['body', 'surface'], ['muted', 'surface'], ['subtle', 'raised'], ['accent', 'accent-bg'], ['success', 'success-bg'], ['info', 'info-bg'], ['warning', 'warning-bg'], ['error', 'error-bg']];
      return pairs.map(([text, background]) => ({ text, foreground: style.getPropertyValue('--academy-' + text).trim(), background: style.getPropertyValue('--academy-' + background).trim() })).concat([{ text: 'primary button', foreground: '#ffffff', background: style.getPropertyValue('--academy-primary').trim() }]);
    });
    const luminance = (hex: string) => {
      const full = hex.replace(/^#([\da-f]{3})$/i, (_match, value) => '#' + value.split('').map((x: string) => x + x).join(''));
      const rgb = full.match(/[\da-f]{2}/gi)!.map(x => parseInt(x, 16) / 255).map(x => x <= .04045 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4);
      return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
    };
    for (const pair of colors) {
      const [a, b] = [luminance(pair.foreground), luminance(pair.background)].sort((a, b) => b - a);
      expect((a + .05) / (b + .05), pair.text + ' contrast').toBeGreaterThanOrEqual(4.5);
    }
  });
}

for (const width of [320, 375, 1280]) {
  test('Theme controls and learning screens fit at ' + width + 'px', async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 1000 }); await prepareAcademyTheme(page, 'light');
    for (const path of ['/dashboard', '/kurs', '/module/s01-m01?lesson=0']) {
      await page.goto(path); await expect(page.getByRole('button', { name: 'Тема: Светла' })).toBeVisible();
      if (path.startsWith('/module')) await expect(page.getByRole('heading', { name: 'Какво ще можеш след урока' })).toBeVisible();
      await page.getByRole('button', { name: 'Тема: Светла' }).click();
      await expect(page.getByRole('radio', { name: 'По устройството' })).toBeVisible();
      const menu = await page.getByRole('group', { name: 'Избери тема' }).boundingBox();
      expect(menu!.x).toBeGreaterThanOrEqual(0); expect(menu!.x + menu!.width).toBeLessThanOrEqual(width);
      await page.keyboard.press('Escape');
      if (width === 320 && path.startsWith('/module')) {
        await page.getByRole('button', { name: /Уроци/ }).click();
        await expect(page.getByRole('dialog')).toBeVisible();
        await page.getByRole('button', { name: 'Затвори уроците' }).click();
      }
      const name = path.startsWith('/module') ? 'lesson' : path.slice(1);
      await page.screenshot({ path: testInfo.outputPath(name + '-light-' + width + '.png'), fullPage: true });
      await selectTheme(page, 'Тъмна');
      await page.screenshot({ path: testInfo.outputPath(name + '-dark-' + width + '.png'), fullPage: true });
      await selectTheme(page, 'Светла');
    }
  });
}

test('The video demonstration preserves its state and graphic colors between themes', async ({ page }) => {
  await prepareAcademyTheme(page, 'light'); await page.goto('/academy-labs/perfect-video/start');
  await expect(page.getByRole('button', { name: 'Тема: Светла' })).toBeVisible();
  const graphic = page.locator('main svg').first();
  const original = await graphic.evaluate(el => el.outerHTML);
  await selectTheme(page, 'Тъмна');
  expect(await graphic.evaluate(el => el.outerHTML)).toBe(original);
});
