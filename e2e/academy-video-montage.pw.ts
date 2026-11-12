import { existsSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { expect, test, type Page } from '@playwright/test';
import { prepareAcademyTheme } from './helpers/academy-theme-fixture';
import { assertLearningContrast, assertLearningFits } from './helpers/learning-contrast';

const editor = '/academy-labs/perfect-video/montage';
const captions = ['Подготвяме чашата.', 'Машината тръгва.', 'Кафето се налива.', 'Кафето е готово.'];

async function captionAll(page: Page) {
  for (const [i, caption] of captions.entries()) {
    await page.getByRole('button', { name: new RegExp('^Кадър ' + (i + 1) + ',') }).click();
    await page.getByLabel('Надпис за кадър ' + (i + 1)).fill(caption);
  }
}

test('a guest exports, watches and revises two genuine video files', async ({ page }, info) => {
  test.setTimeout(120_000);
  await prepareAcademyTheme(page, 'light', undefined, { anonymous: true });
  await page.setViewportSize({ width: 320, height: 875 });
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('/academy-labs/perfect-video/start');
  await page.getByRole('link', { name: 'Отвори монтажната маса' }).click();
  await expect(page).toHaveURL(new RegExp(editor + '$'));
  await page.getByText('Осем урока в помощ на монтажа').click();
  await expect(page.locator('details a[href*="?lesson=pv"]')).toHaveCount(8);
  await page.getByText('Осем урока в помощ на монтажа').click();
  await assertLearningFits(page);
  await page.getByRole('button', { name: 'Изнеси видео · версия 1' }).click();
  await expect(page.getByRole('alert')).toContainText('Напиши надпис за кадър 1');
  await captionAll(page);
  await page.reload();
  await expect(page.getByLabel('Надпис за кадър 1')).toHaveValue(captions[0]);
  await page.getByRole('button', { name: 'Пусни отрязъка' }).click();
  await expect.poll(() => page.getByLabel('Източник за активния кадър').evaluate((video: HTMLVideoElement) => video.currentTime)).toBeGreaterThan(0);
  await assertLearningContrast(page.locator('main'));
  for (const version of [1, 2]) {
    await page.getByRole('button', { name: 'Изнеси видео · версия ' + version }).click();
    const movie = page.getByLabel('Изнесен файл, версия ' + version, { exact: true });
    await expect(movie).toBeVisible({ timeout: 45000 });
    await expect(movie).toHaveJSProperty('videoWidth', 720);
    await expect(movie).toHaveJSProperty('videoHeight', 1280);
    await movie.evaluate((video: HTMLVideoElement) => video.play());
    await expect.poll(() => movie.evaluate((video: HTMLVideoElement) => video.currentTime)).toBeGreaterThan(0.1);
    await movie.evaluate((video: HTMLVideoElement) => video.pause());
    const wait = page.waitForEvent('download');
    await page.getByRole('link', { name: 'Изтегли видео · версия ' + version }).click();
    const file = await wait;
    expect(file.suggestedFilename()).toMatch(new RegExp('v' + version + '\\.(mp4|webm)$'));
    await file.saveAs(info.outputPath(file.suggestedFilename()));
    expect(readFileSync(info.outputPath(file.suggestedFilename())).length).toBeGreaterThan(10000);
    await page.getByRole('checkbox', { name: /^Изгледах файла/ }).check();
    await page.getByRole('button', { name: 'Предай версия ' + version + ' в упражнението' }).click();
    if (version === 1) {
      await expect(page.getByRole('heading', { name: 'Клиентска бележка за версия 2' })).toBeVisible();
      await page.getByRole('button', { name: 'Кадър 4, отрязък Г' }).click();
      for (let i = 0; i < 3; i++) await page.getByRole('button', { name: '← Премести по-рано' }).click();
      await page.getByRole('button', { name: 'Кадър 2, отрязък А' }).click();
      await page.getByLabel('Надпис за кадър 2').fill('Преди това подготвихме чашата.');
    }
  }
  await expect(page.getByText('Учебната поръчка е завършена · две версии')).toBeVisible();
  const handoff = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Свали съобщението за предаване · TXT' }).click();
  const note = readFileSync((await (await handoff).path())!, 'utf8');
  expect(note).toContain('Видео: tavora-montage-v2.');
  expect(note).toContain('Преди това подготвихме чашата.');
  const receipt = page.getByRole('region', { name: 'Предаване на монтажа' });
  const wait = page.waitForEvent('download');
  await receipt.getByRole('button', { name: 'Надписи · SRT' }).click();
  const srt = readFileSync((await (await wait).path())!, 'utf8');
  expect(srt).toContain('00:00:00,000 --> 00:00:06,000\nКафето е готово.');
  expect(srt).toContain('00:00:06,000 --> 00:00:11,000\nПреди това');
  await page.setViewportSize({ width: 1280, height: 900 });
  await assertLearningFits(page);
  await page.screenshot({ path: info.outputPath('montage-desktop.png'), fullPage: true });
  await page.reload();
  await expect(page.getByText('Учебната поръчка е завършена · две версии')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Кадър 1, отрязък Г' })).toHaveAttribute('aria-pressed', 'true');
  expect(errors).toEqual([]);
});

test('a local clip can be reattached and exported from its saved cut', async ({ page }, info) => {
  test.setTimeout(85000);
  await prepareAcademyTheme(page, 'dark', undefined, { anonymous: true });
  await page.goto(editor);
  await captionAll(page);
  await page.getByRole('button', { name: 'Кадър 1, отрязък А' }).click();
  await page.getByText('Работи със свои клипове', { exact: true }).click();
  const path = process.env.VIDEO_MONTAGE_TEST_CLIP || resolve('public/academy-labs/perfect-video/first-client/process.mp4');
  const filename = path.split('/').at(-1)!;
  const picker = page.getByLabel('Добави или свържи клипове от устройството');
  await picker.setInputFiles(path);
  const selector = page.getByLabel('Източник за кадър 1');
  await expect(selector.locator('option', { hasText: filename })).toHaveCount(1);
  await selector.selectOption({ label: filename });
  await page.getByRole('combobox', { name: 'Кадриране', exact: true }).selectOption('fill');
  await page.reload();
  await expect(page.getByText('Свържи отново „' + filename + '“', { exact: false }).first()).toBeVisible();
  await picker.setInputFiles(path);
  await expect(selector.locator('option:checked')).toHaveText(filename);
  await page.getByRole('button', { name: 'Изнеси видео · версия 1' }).click();
  await page.getByRole('button', { name: 'Спри износа' }).click();
  await expect(page.getByRole('button', { name: 'Изнеси видео · версия 1' })).toBeEnabled();
  await page.getByRole('button', { name: 'Изнеси видео · версия 1' }).click();
  await expect(page.getByLabel('Изнесен файл, версия 1')).toBeVisible({ timeout: 45000 });
  const wait = page.waitForEvent('download');
  await page.getByRole('link', { name: 'Изтегли видео · версия 1' }).click();
  const download = await wait; await download.saveAs(info.outputPath('local-' + download.suggestedFilename()));
  await page.getByLabel('Надпис за кадър 1').fill('Друг надпис.');
  await expect(page.getByLabel('Изнесен файл, версия 1')).toHaveCount(0);
  await page.setViewportSize({ width: 320, height: 900 });
  await assertLearningFits(page);
  await assertLearningContrast(page.locator('main'));
  await page.screenshot({ path: info.outputPath('montage-mobile.png'), fullPage: true });
});

test('the distributed lab serves all sixteen media files as playable media or images', async ({ page }) => {
  await prepareAcademyTheme(page, 'dark', undefined, { anonymous: true });
  await page.goto(editor);
  const paths = [
    'practical/coffee-machine.mp4', 'first-client/confusing.mp4', 'first-client/process.mp4',
    'ai/portrait-edge.mp4', 'ai/portrait.mp4', 'ai/wide.mp4', 'ai/voice-filtered.mp3', 'ai/voice-neural.mp3',
    ...['cut-early', 'cut-sync', 'voice-clean', 'voice-clipped', 'voice-noise', 'voice-room'].map(x => 'closed/' + x + '.mp3'),
    'ai/generated-coffee.webp', 'practical/coffee-poster.jpg',
  ];
  // A prebuild can reconstruct missing files and mask an incomplete Git delivery to Readdy.
  if (existsSync('.git')) {
    const tracked = new Set(execFileSync('git', ['ls-files', '--', 'public/academy-labs/perfect-video'], { encoding: 'utf8' }).trim().split('\n'));
    for (const path of paths) expect(tracked.has('public/academy-labs/perfect-video/' + path), path).toBe(true);
  }
  for (const path of paths) {
    const result = await page.evaluate(async path => {
      const url = '/academy-labs/perfect-video/' + path;
      if (/\.(webp|jpg)$/.test(path)) {
        const image = new Image(); image.src = url; await image.decode(); return image.naturalWidth;
      }
      const media = document.createElement(path.endsWith('.mp4') ? 'video' : 'audio');
      const loaded = new Promise<number>((resolve, reject) => {
        media.onloadeddata = () => resolve(media.duration);
        media.onerror = () => reject(new Error(path));
      });
      media.preload = 'auto'; media.src = url;
      try { return await loaded; } finally { media.removeAttribute('src'); media.load(); }
    }, path);
    expect(result, path).toBeGreaterThan(0);
  }
});

test('the edit sheet and timed captions remain available when the browser cannot record', async ({ page }) => {
  await prepareAcademyTheme(page, 'light', undefined, { anonymous: true });
  await page.addInitScript(() => Object.defineProperty(window, 'MediaRecorder', { value: undefined, configurable: true }));
  await page.goto(editor);
  await captionAll(page);
  await page.getByRole('button', { name: 'Изнеси видео · версия 1' }).click();
  await expect(page.getByRole('alert')).toContainText('записът на монтаж в браузъра е недостъпен');
  for (const [button, content] of [['Монтажен лист · TXT', 'От 26 до 32 сек.'], ['Надписи · SRT', '00:00:15,000 --> 00:00:21,000']]) {
    const wait = page.waitForEvent('download');
    await page.getByRole('button', { name: button }).click();
    expect(readFileSync((await (await wait).path())!, 'utf8')).toContain(content);
  }
  await expect(page.getByRole('button', { name: 'Предай версия 1 в упражнението' })).toHaveCount(0);
});
