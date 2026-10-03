import { expect, test, type Page } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

async function fillPlan(page: Page, secondCase = false) {
  await page.getByLabel('Колко броя показваш?', { exact: true }).fill(secondCase ? '4' : '6');
  await page.getByLabel('Каква цена показваш в евро?', { exact: true }).fill(secondCase ? '24,00' : '9');
  for (const [label, value] of [
    ['Източник на цената', 'current'], ['Начало на клипа', 'question'],
    ['Условие за получаване', secondCase ? 'clarify' : 'pickup'], ['Последно действие', 'ask'],
  ]) await page.getByLabel(label, { exact: true }).selectOption(value);
}

test.beforeEach(async ({ page }) => {
  // The test opens only the built local app. No production database, analytics,
  // AI service, student account, camera or microphone is used.
  await page.route('**/*', route => {
    const url = route.request().url();
    return url.startsWith('http://127.0.0.1:5180/') ? route.continue() : route.abort();
  });
  await page.goto('/academy-labs/perfect-video/start');
  await expect(page.getByRole('heading', { name: 'От една идея до проверен файл', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Само задължителни', exact: true }).click();
});

test('records, downloads and independently reads a real 25-second video', async ({ page }, testInfo) => {
  await fillPlan(page);
  await page.getByRole('button', { name: 'Провери моята версия', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Приложи наученото към ателието', exact: true })).toBeEnabled();
  await page.getByRole('button', { name: 'Запиши графичната версия като видео', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Прекрати записа', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Прекрати записа', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Записът е прекратен');
  await expect(page.getByRole('button', { name: 'Запиши графичната версия като видео', exact: true })).toBeEnabled();

  await page.getByRole('button', { name: 'Запиши графичната версия като видео', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Действително полученият видеофайл', exact: true })).toBeVisible({ timeout: 45000 });
  await expect(page.getByRole('alert')).toHaveCount(0);
  const pendingDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Изтегли видеофайла', exact: true }).click();
  const download = await pendingDownload;
  const clipPath = testInfo.outputPath(download.suggestedFilename());
  await download.saveAs(clipPath);
  const probe = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-show_packets', '-show_format', '-show_streams', '-of', 'json', clipPath], { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 }));
  const video = probe.streams.find((stream: { codec_type: string }) => stream.codec_type === 'video');
  expect(video.width).toBe(1080); expect(video.height).toBe(1920);
  const packets = probe.packets.filter((packet: { stream_index: number }) => packet.stream_index === video.index);
  const start = Math.min(...packets.map((packet: { pts_time: string }) => Number(packet.pts_time)));
  const end = Math.max(...packets.map((packet: { pts_time: string; duration_time?: string }) => Number(packet.pts_time) + (Number(packet.duration_time) || 0)));
  const duration = Number.isFinite(Number(probe.format.duration)) ? Number(probe.format.duration) : end - start;
  expect(duration).toBeGreaterThanOrEqual(24); expect(duration).toBeLessThanOrEqual(26);
  expect(probe.streams.some((stream: { codec_type: string }) => stream.codec_type === 'audio')).toBe(false);
  expect(readFileSync(clipPath).length).toBeGreaterThan(10000);
  writeFileSync(testInfo.outputPath('ffprobe.json'), JSON.stringify(probe, null, 2));
  execFileSync('ffmpeg', ['-y', '-ss', '4', '-i', clipPath, '-frames:v', '1', testInfo.outputPath('video-content-frame.png')]);
  execFileSync('ffmpeg', ['-y', '-ss', '11', '-i', clipPath, '-frames:v', '1', testInfo.outputPath('video-price-frame.png')]);
  await page.getByRole('button', { name: 'Провери получения файл', exact: true }).click();
  await expect(page.getByText('Преминато: Файлът е вертикален 9:16', { exact: true })).toBeVisible();
  // Some MediaRecorder outputs do not expose a finite duration to HTMLVideoElement.
  // The learner must see an explicit unknown, never a fabricated passing result.
  const browserMetadata = await page.getByText(/^Отчетени свойства на /).innerText();
  if (browserMetadata.includes('времето не е отчетено')) {
    await expect(page.getByText('Нужна е поправка: Отчетеното време е около 25 секунди', { exact: true })).toBeVisible();
  } else {
    await expect(page.getByText('Преминато: Отчетеното време е около 25 секунди', { exact: true })).toBeVisible();
  }
  await page.screenshot({ path: testInfo.outputPath('recorded-project-desktop.png'), fullPage: true });
});

test('mobile layout, feedback and changed-case transfer work without an account', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.screenshot({ path: testInfo.outputPath('project-mobile-opening.png'), fullPage: true });
  const noOverflow = () => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
  expect(await noOverflow()).toBe(true);
  await page.getByText('Учебен отчет: повече гледания не означава повече поръчки', { exact: true }).click();
  expect(await noOverflow()).toBe(true);
  await fillPlan(page);
  await page.getByLabel('Каква цена показваш в евро?', { exact: true }).fill('8');
  await page.getByRole('button', { name: 'Провери моята версия', exact: true }).click();
  await expect(page.getByText('Нужна е поправка: Цената е от актуалния източник', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Приложи наученото към ателието', exact: true })).toBeDisabled();
  await page.getByLabel('Каква цена показваш в евро?', { exact: true }).fill('9');
  await page.getByRole('button', { name: 'Провери моята версия', exact: true }).click();
  await page.getByRole('button', { name: 'Приложи наученото към ателието', exact: true }).click();
  await fillPlan(page, true);
  await page.getByRole('button', { name: 'Провери моята версия', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('успешен план не удостоверява успешен запис');
  await expect(page.getByText(/Проверени учебни планове в тази сесия/)).toContainText('2/2');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Изтегли сценария като CSV', exact: true }).click();
  const download = await downloadPromise;
  const path = testInfo.outputPath('ceramics-storyboard.csv');
  await download.saveAs(path);
  const csv = readFileSync(path, 'utf8');
  expect(csv).toContain('4 керамични чаши'); expect(csv).toContain('24,00 €'); expect(csv).toContain('Получаването се уточнява');
  expect(csv).not.toContain('Вземане от обекта');
  expect(await noOverflow()).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('project-mobile-corrected.png'), fullPage: true });
});
