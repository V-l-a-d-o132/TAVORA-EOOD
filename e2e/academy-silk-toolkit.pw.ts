import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';
import { loadPracticalSilkCandidates } from '../scripts/prepare-practical-silk-assets.mjs';
import { prepareAcademyTheme } from './helpers/academy-theme-fixture';
import { assertLearningFits, assertLearningContrast } from './helpers/learning-contrast';

const lessons = loadPracticalSilkCandidates('toolkit-20261018');
const catalog = JSON.parse(readFileSync(new URL('../src/data/silk-tools.json', import.meta.url), 'utf8'));
const privateRows = process.env.SILK_TOOLKIT_PRIVATE ? JSON.parse(readFileSync(process.env.SILK_TOOLKIT_PRIVATE, 'utf8')) : null;
test.setTimeout(90000);

for (const theme of ['light', 'dark']) for (const width of [320, 1280]) {
  test(`public tools, filters and contrast: ${theme}, ${width}px`, async ({ page }, info) => {
    await page.setViewportSize({ width, height: 950 });
    const requests = await prepareAcademyTheme(page, theme, undefined, { anonymous: true, hasFullAccess: false });
    const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
    await page.goto('/academy-tools/silk-road');
    await expect(page.getByRole('heading', { name: 'Инструменти за задачата' })).toBeVisible();
    await expect(page.getByRole('article')).toHaveCount(59);
    expect(await page.locator('input[type="file"],textarea,[contenteditable="true"]').count()).toBe(0);
    await page.getByRole('combobox', { name: 'Модул', exact: true }).selectOption('s01-m01');
    const expected = catalog.filter(tool => tool.lessons.some(id => id.startsWith('l01-'))).length;
    await expect(page.getByRole('article')).toHaveCount(expected);
    await page.getByText('Стъпки и проверка · Gemini', { exact: true }).click();
    await expect(page.getByRole('article', { name: 'Gemini', exact: true }).getByRole('list', { name: 'Официални източници за Gemini' })).toBeVisible();
    await assertLearningFits(page); await assertLearningContrast(page.locator('main'));
    await page.screenshot({ path: info.outputPath(`toolkit-${theme}-${width}.png`), fullPage: true });
    await page.getByRole('button', { name: 'Покажи всички инструменти' }).click();
    await expect(page.getByRole('article')).toHaveCount(59);
    expect(requests.academy_autosave_lesson || 0).toBe(0);
    expect(requests.academy_complete_lesson_block || 0).toBe(0);
    expect(errors).toEqual([]);
  });

  test(`lesson guide and new closed check: ${theme}, ${width}px`, async ({ page }, info) => {
    await page.setViewportSize({ width, height: 950 });
    const lesson = lessons.find(row => row.lesson === 'l01-04');
    const block = lesson.payload.additions.find(row => row.type === 'matching');
    const guide = lesson.payload.additions.find(row => row.type === 'rich_text');
    const matches = privateRows?.find(row => row.lesson === lesson.lesson).payload.additions.find(row => row.type === 'matching').evaluation.matches
      || Object.fromEntries(block.content.left.map(slot => [slot.id, slot.choices[0]]));
    const requests = await prepareAcademyTheme(page, theme, { title: lesson.title, blocks: [
      { ...guide, id: '00000000-0000-4000-8000-000000000087', position: 0 },
      { ...block, id: '00000000-0000-4000-8000-000000000088', position: 1 },
    ], matchingExpected: matches, matchingFeedback: block.content.left.map(slot => ({ slot: slot.id, label: slot.text,
      success: 'Решението следва предоставените условия.', retry: 'Провери условието и ограниченията на избрания инструмент.' })) }, { anonymous: true, hasFullAccess: false });
    await page.goto('/module/s01-m01?lesson=l01-04');
    await expect(page.getByRole('article', { name: guide.content.toolkit.cards[0].name, exact: true })).toBeVisible();
    await expect(page.getByText(guide.content.toolkitIntro, { exact: true })).toHaveCount(1);
    await page.getByRole('button', { name: 'Прочетох', exact: true }).click();
    await page.getByRole('button', { name: 'Следваща', exact: true }).click();
    const studio = page.getByTestId('closed-practice-studio'); await expect(studio).toBeVisible();
    for (const slot of block.content.left) await studio.getByRole('combobox', { name: slot.text, exact: true }).selectOption(matches[slot.id]);
    const first = block.content.left[0];
    await studio.getByRole('combobox', { name: first.text, exact: true }).selectOption(first.choices.find(id => id !== matches[first.id]));
    await studio.getByRole('button', { name: 'Провери решенията' }).click();
    await expect(page.getByText('Провери условието и ограниченията на избрания инструмент.', { exact: true })).toBeVisible();
    await studio.getByRole('combobox', { name: first.text, exact: true }).selectOption(matches[first.id]);
    await assertLearningFits(page); await assertLearningContrast(studio);
    await studio.getByRole('button', { name: 'Провери решенията' }).click();
    await expect(studio.getByRole('button', { name: 'Практиката е премината' })).toBeVisible();
    expect(await studio.locator('input,textarea,[contenteditable="true"]').count()).toBe(0);
    await page.screenshot({ path: info.outputPath(`toolcheck-${theme}-${width}.png`), fullPage: true });
    expect(requests.academy_autosave_lesson || 0).toBe(0);
  });
}

test('conditional products retain their limitations and linked fallback', async ({ page }) => {
  await prepareAcademyTheme(page, 'light', undefined, { anonymous: true });
  await page.goto('/academy-tools/silk-road?tool=flow');
  const card = page.getByRole('article'); await expect(card).toHaveCount(1);
  await expect(card).toContainText('Условен достъп');
  await card.getByText('Стъпки и проверка · Google Flow').click();
  await expect(card.getByRole('link', { name: 'Виж подходящ заместител' })).toHaveAttribute('href', /tool=/);
  await page.getByRole('button', { name: 'Покажи всички инструменти' }).click();
  await page.getByRole('combobox', { name: 'Достъп', exact: true }).selectOption('local');
  await expect(page.getByRole('article')).toHaveCount(catalog.filter(tool => tool.access === 'local').length);
  await expect(page.locator('#tool-stripe')).toHaveCount(0);
  await page.getByRole('combobox', { name: 'Достъп', exact: true }).selectOption('conditions');
  await expect(page.locator('#tool-stripe')).toContainText('такси');
});

test('local workbench exports real WebP, measures bytes, changes settings and cancels stale results', async ({ page }) => {
  await prepareAcademyTheme(page, 'dark', undefined, { anonymous: true });
  const writes: string[] = []; page.on('request', request => { if (['POST', 'PUT', 'PATCH'].includes(request.method())) writes.push(request.url()); });
  await page.goto('/academy-tools/silk-road?tool=squoosh#webp');
  const lab = page.getByRole('region', { name: 'Лаборатория: изображение за уеб' });
  const download = lab.getByRole('link', { name: 'Изтегли този WebP' });
  await expect(download).toHaveAttribute('download', 'tavora-coffee-480-q72.webp');
  const firstBytes = await lab.getByTestId('webp-bytes').textContent();
  const event = page.waitForEvent('download'); await download.click(); const file = await event;
  const bytes = readFileSync((await file.path())!);
  expect(bytes.subarray(0, 4).toString()).toBe('RIFF'); expect(bytes.subarray(8, 12).toString()).toBe('WEBP');
  expect(firstBytes!.replace(/\D/g, '')).toBe(String(bytes.length));
  await expect(lab.getByAltText('WebP: Снимка на кафемашина')).toHaveJSProperty('naturalWidth', 480);
  await lab.getByRole('combobox', { name: 'Качество', exact: true }).selectOption('0.45');
  await expect(download).toHaveAttribute('download', 'tavora-coffee-480-q45.webp');
  await expect(lab.getByTestId('webp-bytes')).not.toHaveText(firstBytes!);
  await lab.getByRole('combobox', { name: 'Предоставено изображение', exact: true }).selectOption('advert');
  await lab.getByRole('combobox', { name: 'Ширина', exact: true }).selectOption('240');
  await expect(download).toHaveAttribute('download', 'tavora-advert-240-q45.webp');
  await expect(lab.getByAltText('WebP: Учебна обява с текст')).toHaveJSProperty('naturalWidth', 240);
  await expect(lab.getByAltText('WebP: Учебна обява с текст')).toHaveJSProperty('naturalHeight', 160);
  expect(writes).toEqual([]);
});

test('unsupported image encoders show the alternative without a false export', async ({ page }) => {
  await prepareAcademyTheme(page, 'light', undefined, { anonymous: true });
  await page.addInitScript(() => { HTMLCanvasElement.prototype.toBlob = callback => callback(new Blob(['not-webp'], { type: 'image/png' })); });
  await page.goto('/academy-tools/silk-road?tool=squoosh#webp');
  const lab = page.getByRole('region', { name: 'Лаборатория: изображение за уеб' });
  await expect(lab.getByRole('alert')).toContainText('Този браузър не изнася WebP');
  await expect(lab.getByRole('link', { name: 'Изтегли този WebP' })).toHaveCount(0);
});
