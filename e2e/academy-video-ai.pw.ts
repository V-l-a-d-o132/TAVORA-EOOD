import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';
import { loadVideoAiCandidates } from '../scripts/prepare-video-ai-assets.mjs';
import { prepareAcademyTheme } from './helpers/academy-theme-fixture';
import { assertLearningFits, assertLearningContrast } from './helpers/learning-contrast';
const rows = loadVideoAiCandidates();
const catalog = JSON.parse(readFileSync(new URL('../src/data/video-ai-tools.json', import.meta.url), 'utf8'));
const privateRows = process.env.VIDEO_AI_PRIVATE ? JSON.parse(readFileSync(process.env.VIDEO_AI_PRIVATE, 'utf8')) : null;
test.setTimeout(90000);

for (const theme of ['light', 'dark']) for (const width of [320, 1280]) {
  test(`video tools and five comparisons fit: ${theme}, ${width}px`, async ({ page }, info) => {
    await page.setViewportSize({ width, height: 950 });
    const requests = await prepareAcademyTheme(page, theme, undefined, { anonymous: true, hasFullAccess: false });
    const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
    await page.goto('/academy-tools/perfect-video');
    await expect(page.getByRole('heading', { name: 'Историята води. Инструментът помага.' })).toBeVisible();
    await expect(page.getByRole('article')).toHaveCount(15);
    await page.getByRole('combobox', { name: 'Модул', exact: true }).selectOption('s02-m07');
    await expect(page.getByRole('article')).toHaveCount(catalog.filter(t => t.lessons.some(id => id.startsWith('pv07-'))).length);
    const capcut = page.getByRole('article', { name: 'CapCut', exact: true });
    await capcut.getByText('Работен маршрут · CapCut', { exact: true }).click();
    await expect(capcut.getByRole('list', { name: 'Източници за CapCut' })).toBeVisible();
    await assertLearningFits(page); await assertLearningContrast(page.locator('main'));
    await page.getByRole('button', { name: 'Покажи всички', exact: true }).click();
    await expect(page.getByRole('article')).toHaveCount(15);
    await page.getByRole('combobox', { name: 'Достъп', exact: true }).selectOption('conditions');
    await expect(page.getByRole('article')).toHaveCount(catalog.filter(t => ['check', 'paid', 'noncommercial'].includes(t.access)).length);
    await page.getByRole('button', { name: 'Покажи всички', exact: true }).click();
    const lab = page.getByRole('region', { name: 'Работилница: видео с помощ от ИИ' });
    for (const label of ['История', 'Субтитри', 'Звук', 'Липсващ кадър', 'Два формата']) {
      await lab.getByRole('button', { name: label, exact: true }).click();
      await assertLearningFits(page); await assertLearningContrast(lab);
    }
    await page.screenshot({ path: info.outputPath(`video-ai-${theme}-${width}.png`), fullPage: true });
    expect(await page.locator('input[type="file"],textarea,[contenteditable="true"]').count()).toBe(0);
    expect(requests.academy_complete_lesson_block || 0).toBe(0); expect(requests.academy_autosave_lesson || 0).toBe(0); expect(errors).toEqual([]);
  });

  test(`paid lesson route, feedback and retry: ${theme}, ${width}px`, async ({ page }, info) => {
    await page.setViewportSize({ width, height: 950 });
    const row = rows.find(r => r.lesson === 'pv12-08'), guide = row.payload.additions.find(b => b.type === 'rich_text'), block = row.payload.additions.find(b => b.type === 'matching');
    const privateCheck = privateRows?.find(r => r.lesson === row.lesson).payload.additions.find(b => b.type === 'matching');
    const matches = privateCheck?.evaluation.matches || Object.fromEntries(block.content.left.map(s => [s.id, s.choices[0]]));
    await prepareAcademyTheme(page, theme, { title: row.title, blocks: [{ ...guide, id: '00000000-0000-4000-8000-000000000087', position: 0 }, { ...block, id: '00000000-0000-4000-8000-000000000088', position: 1 }], matchingExpected: matches, matchingFeedback: block.content.left.map(s => ({ slot: s.id, label: s.text, success: 'Изборът пази условията на брифа.', retry: 'Свери избора с дадените разрешения и материал.' })) });
    await page.goto('/module/s02-m12?lesson=pv12-08');
    await expect(page.getByRole('article', { name: 'DaVinci Resolve', exact: true })).toBeVisible();
    await expect(page.getByText(guide.content.videoAi.intro.replace(/\s+/g, ' '), { exact: true })).toHaveCount(1);
    await page.getByRole('button', { name: 'Прочетох', exact: true }).click(); await page.getByRole('button', { name: 'Следваща', exact: true }).click();
    const studio = page.getByTestId('closed-practice-studio'); await expect(studio).toBeVisible();
    for (const slot of block.content.left) await studio.getByRole('combobox', { name: slot.text, exact: true }).selectOption(matches[slot.id]);
    const first = block.content.left[0]; await studio.getByRole('combobox', { name: first.text, exact: true }).selectOption(first.choices.find(x => x !== matches[first.id]));
    await studio.getByRole('button', { name: 'Провери решенията', exact: true }).click();
    await expect(page.getByText('Свери избора с дадените разрешения и материал.', { exact: true })).toBeVisible();
    await studio.getByRole('combobox', { name: first.text, exact: true }).selectOption(matches[first.id]);
    await studio.getByRole('button', { name: 'Провери решенията', exact: true }).click();
    await expect(studio.getByRole('button', { name: 'Практиката е премината' })).toBeVisible();
    await assertLearningFits(page); await assertLearningContrast(studio);
    expect(await studio.locator('input,textarea,[contenteditable="true"]').count()).toBe(0);
    await page.screenshot({ path: info.outputPath(`video-check-${theme}-${width}.png`), fullPage: true });
  });
}

test('supplied media play and downloads are genuine files; comparison choices make no writes', async ({ page }) => {
  await prepareAcademyTheme(page, 'dark', undefined, { anonymous: true });
  const writes: string[] = []; page.on('request', r => { if (['POST', 'PUT', 'PATCH'].includes(r.method())) writes.push(r.url()); });
  await page.goto('/academy-tools/perfect-video#workbench');
  const lab = page.getByRole('region', { name: 'Работилница: видео с помощ от ИИ' });
  const movie = lab.getByLabel('Преглед на избраната подредба');
  await lab.getByRole('combobox', { name: 'Фрагмент 1', exact: true }).selectOption('action');
  await lab.getByRole('button', { name: 'Пусни подредбата', exact: true }).click();
  await expect.poll(() => movie.evaluate((v: HTMLVideoElement) => v.currentTime)).toBeGreaterThanOrEqual(16);
  await lab.getByRole('button', { name: 'Спри прегледа', exact: true }).click();
  await expect(movie).toHaveJSProperty('paused', true);
  let pending = page.waitForEvent('download'); await lab.getByRole('button', { name: 'Изтегли избрания план' }).click(); let file = await pending;
  expect(readFileSync((await file.path())!, 'utf8')).toContain('16–19 сек.');
  await lab.getByRole('button', { name: 'Субтитри', exact: true }).click();
  await lab.getByRole('combobox', { name: 'Вариант на субтитрите', exact: true }).selectOption('changed');
  const voice = lab.getByLabel('Оригинална учебна реплика за субтитри'); await expect.poll(() => voice.evaluate((a: HTMLAudioElement) => a.duration)).toBeGreaterThan(6);
  await voice.evaluate((a: HTMLAudioElement) => a.play());
  await expect.poll(() => voice.evaluate((a: HTMLAudioElement) => a.currentTime)).toBeGreaterThan(0);
  pending = page.waitForEvent('download'); await lab.getByRole('button', { name: 'Изтегли този SRT' }).click(); file = await pending;
  const srt = readFileSync((await file.path())!, 'utf8'); expect(srt).toContain('00:00:02,200 --> 00:00:06,229'); expect(srt).toContain('Отдалечи');
  await lab.getByRole('button', { name: 'Звук', exact: true }).click();
  await lab.getByRole('combobox', { name: 'Звуков вариант', exact: true }).selectOption('neural');
  const neural = lab.getByLabel('Звуково сравнение: Невронно обработен вариант'); await expect.poll(() => neural.evaluate((a: HTMLAudioElement) => a.duration)).toBeGreaterThan(6);
  await neural.evaluate((a: HTMLAudioElement) => a.play()); await expect.poll(() => neural.evaluate((a: HTMLAudioElement) => a.currentTime)).toBeGreaterThan(0);
  pending = page.waitForEvent('download'); await lab.getByRole('link', { name: 'Изтегли предоставения звуков вариант' }).click(); file = await pending;
  expect(readFileSync((await file.path())!).length).toBe(75501);
  await lab.getByRole('button', { name: 'Липсващ кадър', exact: true }).click();
  await expect(lab.getByAltText(/Предоставена ИИ илюстрация/)).toHaveJSProperty('naturalWidth', 960);
  await lab.getByRole('combobox', { name: 'Предоставен бриф', exact: true }).selectOption('atmosphere');
  await lab.getByRole('combobox', { name: 'Работен ход', exact: true }).selectOption('reshoot');
  await expect(lab.getByRole('status')).toContainText('Такъв файл още не е предоставен');
  await lab.getByRole('button', { name: 'Два формата', exact: true }).click();
  for (const [id, width] of [['wide', 480], ['portrait', 152], ['edge', 152]] as const) {
    await lab.getByRole('combobox', { name: 'Предоставена версия', exact: true }).selectOption(id);
    await expect(lab.getByRole('status')).toContainText(`${width} × 270 px`);
    const video = lab.locator('video'); await expect(video).toHaveJSProperty('videoWidth', width);
    await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.duration)).toBe(9);
    pending = page.waitForEvent('download'); await lab.getByRole('link', { name: 'Изтегли предоставената версия' }).click(); file = await pending;
    expect(readFileSync((await file.path())!).subarray(4, 8).toString()).toBe('ftyp');
  }
  expect(writes).toEqual([]);
});

test('the public catalog does not grant paid video access', async ({ page }) => {
  const requests = await prepareAcademyTheme(page, 'light', undefined, { anonymous: true, hasFullAccess: false });
  await page.goto('/academy-tools/perfect-video?module=s02-m01');
  const tool = page.getByRole('article', { name: 'Gemini', exact: true }); await tool.getByText('Работен маршрут · Gemini', { exact: true }).click();
  await tool.getByRole('link', { name: 'Урок 1.11', exact: true }).click();
  await expect(page).toHaveURL(/module\/s02-m01/);
  await expect(page.getByRole('heading', { name: /създай|Влез|вход|Достъп|заключен/i }).first()).toBeVisible();
  expect(requests.academy_get_lesson_v2 || 0).toBe(0);
});
