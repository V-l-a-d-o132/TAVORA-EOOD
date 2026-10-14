import { test, expect } from '@playwright/test';
import { prepareAcademyTheme, selectTheme } from './helpers/academy-theme-fixture';
import { assertLearningContrast, assertLearningFits } from './helpers/learning-contrast';

const courses = [
  { name: /Пътят на коприната/, prefix: 's01', count: 11 },
  { name: /Перфектното видео/i, prefix: 's02', count: 15 },
  { name: /Marketing Basics/i, prefix: 's03', count: 20 },
];

for (const theme of ['light', 'dark']) {
  for (const width of [320, 1280]) {
    test(`${theme}: course catalogue has one free module and readable access states at ${width}px`, async ({ page }, info) => {
      await page.setViewportSize({ width, height: 1000 });
      const calls = await prepareAcademyTheme(page, theme, undefined, { completedFreeModule: true });
      await page.goto('/kurs');
      for (const course of courses) {
        if (course.prefix !== 's01') await page.getByRole('button', { name: /Всички раздели/ }).click();
        await page.getByRole('button', { name: course.name }).first().click();
        await expect(page.locator('[data-module-id]')).toHaveCount(course.count);
        await expect(page.getByText('Пълен достъп активиран', { exact: true })).toBeVisible();
        await expect(page.getByText('FREE', { exact: true })).toHaveCount(course.prefix === 's01' ? 1 : 0);
        if (course.prefix === 's01') await expect(page.locator('[data-module-id="s01-m01"]')).toContainText('FREE');
        await assertLearningContrast(page.locator('[data-academy-theme]')); await assertLearningFits(page);
        const grades = calls.academy_complete_lesson_block || 0;
        await selectTheme(page, theme === 'light' ? 'Тъмна' : 'Светла');
        await expect(page.getByText('FREE', { exact: true })).toHaveCount(course.prefix === 's01' ? 1 : 0);
        await assertLearningContrast(page.locator('[data-academy-theme]'));
        expect(calls.academy_complete_lesson_block || 0).toBe(grades);
        await selectTheme(page, theme === 'light' ? 'Светла' : 'Тъмна');
      }
      await page.screenshot({ path: info.outputPath(`catalogue-${theme}-${width}.png`), fullPage: true });
      const search = page.getByPlaceholder('Търси модул или урок...');
      await search.fill('Първата история');
      await expect(page.getByText('Модул', { exact: true })).toBeVisible();
      await assertLearningContrast(page.locator('[data-academy-theme]')); await assertLearningFits(page);
      await search.press('ArrowDown');
      await assertLearningContrast(page.locator('[data-academy-theme]'));
    });
  }

  test(`${theme}: an unpaid account can open the free module and has no paid-course free badge`, async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 900 });
    await prepareAcademyTheme(page, theme, undefined, { hasFullAccess: false });
    await page.goto('/kurs');
    for (const course of courses) {
      if (course.prefix !== 's01') await page.getByRole('button', { name: /Всички раздели/ }).click();
      await page.getByRole('button', { name: course.name }).first().click();
      const cards = page.locator('[data-module-id]');
      await expect(cards).toHaveCount(course.count);
      await expect(page.getByText('Пълен достъп активиран', { exact: true })).toHaveCount(0);
      await expect(page.getByText('FREE', { exact: true })).toHaveCount(course.prefix === 's01' ? 1 : 0);
      await expect(page.getByText('LOCKED', { exact: true })).toHaveCount(course.count - (course.prefix === 's01' ? 1 : 0));
      await assertLearningContrast(page.locator('[data-academy-theme]')); await assertLearningFits(page);
      if (course.prefix !== 's01') {
        const route = page.url(); await cards.first().click(); expect(page.url()).toBe(route);
      }
    }
    await page.goto('/module/s02-m01?lesson=0');
    await expect(page.getByRole('heading', { name: 'Продължи обучението си', exact: true })).toBeVisible();
    await page.goto('/module/s01-m01?lesson=0');
    await expect(page.getByRole('heading', { name: 'Какво ще можеш след урока', exact: true })).toBeVisible();
  });

  test(`${theme}: a purchased video course stays accessible without a free label`, async ({ page }) => {
    const videoModules = Array.from({ length: 15 }, (_, i) => `s02-m${String(i + 1).padStart(2, '0')}`);
    await prepareAcademyTheme(page, theme, undefined, { hasFullAccess: false, unlockedModules: videoModules });
    await page.goto('/kurs'); await page.getByRole('button', { name: /Перфектното видео/i }).first().click();
    await expect(page.getByText('FREE', { exact: true })).toHaveCount(0);
    await expect(page.getByText('LOCKED', { exact: true })).toHaveCount(0);
    await assertLearningContrast(page.locator('[data-academy-theme]'));
    await page.locator('[data-module-id="s02-m01"]').click();
    await expect(page).toHaveURL(/\/module\/s02-m01/);
    await expect(page.getByRole('heading', { name: 'Какво ще можеш след урока', exact: true })).toBeVisible();
  });
}
