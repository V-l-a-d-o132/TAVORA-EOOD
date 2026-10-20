import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';
import { loadMarketingAiCandidates } from '../scripts/prepare-marketing-ai-assets.mjs';
import { prepareAcademyTheme } from './helpers/academy-theme-fixture';
import { assertLearningFits, assertLearningContrast } from './helpers/learning-contrast';
const rows = loadMarketingAiCandidates();
const privateRows = process.env.MARKETING_AI_PRIVATE ? JSON.parse(readFileSync(process.env.MARKETING_AI_PRIVATE, 'utf8')) : null;
test.setTimeout(90000);

for (const theme of ['light', 'dark']) for (const width of [320, 1280]) {
  test(`public comparisons and pricing fit: ${theme}, ${width}px`, async ({ page }, info) => {
    await page.setViewportSize({ width, height: 950 });
    const requests = await prepareAcademyTheme(page, theme, undefined, { anonymous: true, hasFullAccess: false });
    const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
    await page.goto('/academy-tools/marketing-basics');
    await expect(page.getByRole('heading', { name: 'От въпроса на човека до провереното послание' })).toBeVisible();
    const demo = page.getByRole('region', { name: 'Предоставена демонстрация' });
    expect(await page.getByRole('combobox', { name: 'Избери модул' }).locator('option').evaluateAll(options => options.slice(0, 5).map(o => (o as HTMLOptionElement).value))).toEqual(['s03-m01', 's03-m02', 's03-m05', 's03-m03', 's03-m07']);
    for (const id of ['s03-m01', 's03-m02', 's03-m05', 's03-m03', 's03-m07']) {
      await page.getByRole('combobox', { name: 'Избери модул' }).selectOption(id);
      await demo.getByRole('button', { name: 'Свери с източниците', exact: true }).click();
      await expect(demo.getByRole('status')).toBeVisible();
      const choices = demo.getByRole('group', { name: 'Избери учебна версия' }).getByRole('button');
      await choices.nth(1).click(); await expect(demo.getByRole('status')).toHaveCount(0);
      await demo.getByRole('button', { name: 'Свери с източниците', exact: true }).click();
      await expect(demo.getByRole('status')).toBeVisible();
      if (id === 's03-m05') {
        const price = demo.getByRole('region', { name: 'Проверка на ценовия модел' });
        await expect(price).toContainText('20%');
        await price.getByRole('button', { name: 'Нов разход', exact: true }).click();
        await expect(price).toContainText('10%');
      }
      await assertLearningFits(page); await assertLearningContrast(demo);
    }
    await expect(page.getByRole('region', { name: 'Подбрани инструменти' }).getByRole('article')).toHaveCount(23);
    const pomelli = page.getByRole('article', { name: 'Pomelli', exact: true });
    await pomelli.getByText('Работен маршрут · Pomelli', { exact: true }).click();
    await expect(pomelli.locator('ol li')).toHaveCount(3);
    await assertLearningContrast(page.locator('main'));
    expect(await page.locator('input,textarea,[contenteditable="true"]').count()).toBe(0);
    expect(requests.academy_complete_lesson_block || 0).toBe(0); expect(requests.academy_autosave_lesson || 0).toBe(0); expect(errors).toEqual([]);
    await page.screenshot({ path: info.outputPath(`marketing-ai-${theme}-${width}.png`), fullPage: true });
  });

  test(`paid lesson, independent case, feedback and retry: ${theme}, ${width}px`, async ({ page }, info) => {
    await page.setViewportSize({ width, height: 950 });
    const row = rows.find(r => r.lesson === 'lm03-04'), guide = row.payload.additions.find(b => b.type === 'rich_text'), block = row.payload.additions.find(b => b.type === 'matching');
    const privateCheck = privateRows?.find(r => r.lesson === row.lesson).payload.additions.find(b => b.type === 'matching');
    const matches = privateCheck?.evaluation.matches || Object.fromEntries(block.content.left.map(s => [s.id, s.choices[0]]));
    await prepareAcademyTheme(page, theme, { title: row.title, blocks: [{ ...guide, id: '00000000-0000-4000-8000-000000000087', position: 0 }, { ...block, id: '00000000-0000-4000-8000-000000000088', position: 1 }], matchingExpected: matches, matchingFeedback: block.content.left.map(s => ({ slot: s.id, label: s.text, success: 'Изборът пази условията на предоставения случай.', retry: 'Свери избора с дадения обхват и условия.' })) });
    await page.goto('/module/s03-m03?lesson=lm03-04');
    await expect(page.getByText(guide.content.marketingAi.intro.replace(/\s+/g, ' '), { exact: true })).toHaveCount(1);
    await expect(page.getByRole('article', { name: 'ChatGPT', exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Прочетох', exact: true }).click(); await page.getByRole('button', { name: 'Следваща', exact: true }).click();
    const studio = page.getByTestId('closed-practice-studio'); await expect(studio).toBeVisible();
    for (const slot of block.content.left) await studio.getByRole('combobox', { name: slot.text, exact: true }).selectOption(matches[slot.id]);
    const first = block.content.left[0]; await studio.getByRole('combobox', { name: first.text, exact: true }).selectOption(first.choices.find(x => x !== matches[first.id]));
    await studio.getByRole('button', { name: 'Провери решенията', exact: true }).click();
    await expect(page.getByText('Свери избора с дадения обхват и условия.', { exact: true })).toBeVisible();
    await studio.getByRole('combobox', { name: first.text, exact: true }).selectOption(matches[first.id]);
    await studio.getByRole('button', { name: 'Провери решенията', exact: true }).click();
    await expect(studio.getByRole('button', { name: 'Практиката е премината' })).toBeVisible();
    await assertLearningFits(page); await assertLearningContrast(studio);
    expect(await studio.locator('input,textarea,[contenteditable="true"]').count()).toBe(0);
    await page.screenshot({ path: info.outputPath(`marketing-check-${theme}-${width}.png`), fullPage: true });
  });
}

test('invalid module defaults safely; public examples never unlock paid marketing lessons', async ({ page }) => {
  const requests = await prepareAcademyTheme(page, 'light', undefined, { anonymous: true, hasFullAccess: false });
  await page.goto('/academy-tools/marketing-basics?module=unknown');
  await expect(page.getByRole('combobox', { name: 'Избери модул' })).toHaveValue('s03-m01');
  await page.goto('/module/s03-m01?lesson=lm01-02');
  await expect(page.getByRole('heading', { name: /създай|Влез|вход|Достъп|заключен/i }).first()).toBeVisible();
  expect(requests.academy_get_lesson_v2 || 0).toBe(0);
});
