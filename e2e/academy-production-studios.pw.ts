import { readFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';
import { loadProductionCandidates } from '../scripts/prepare-production-video-assets.mjs';
import { prepareAcademyTheme, selectTheme } from './helpers/academy-theme-fixture';
import { assertLearningFits, assertLearningContrast } from './helpers/learning-contrast';
const lessons = loadProductionCandidates();
test.setTimeout(90000);
const find = (id: string) => lessons.find(l => l.lesson === id)!;
// An optional local-only grader package verifies the actual authored choices.
// It is never committed, included in the build, logged, or sent to a live API.
const privateGrading = process.env.PRODUCTION_VIDEO_PRIVATE_CANDIDATES ? JSON.parse(readFileSync(process.env.PRODUCTION_VIDEO_PRIVATE_CANDIDATES, 'utf8')) : null;

for (const theme of ['light', 'dark']) for (const width of [320, 1280]) test(`${theme} ${width}px: schedule, changed condition, correction, resume and local plan`, async ({ page }, info) => {
  const l = find('pv06-06');
  const synthetic: Record<string, string> = privateGrading?.find(row => row.lesson === l.lesson)?.payload.practice.evaluation.matches || Object.fromEntries(l.practice.content.left.map(slot => [slot.id, slot.choices[0]]));
  await page.setViewportSize({ width, height: 950 });
  await prepareAcademyTheme(page, theme, { title: l.title, objective: l.opening.body, blocks: [{ ...l.practice, id: '00000000-0000-4000-8000-000000000088', position: 0 }], matchingExpected: synthetic });
  const submitted: unknown[] = [];
  page.on('request', r => { if (r.url().includes('academy_complete_lesson_block')) submitted.push(r.postDataJSON().p_payload); });
  await page.goto(`/module/${l.module}?lesson=${l.lesson}`);
  const studio = page.getByTestId('closed-practice-studio');
  await expect(studio).toBeVisible({ timeout: 30000 });
  await expect(studio.getByText(l.practice.content.studio.change, { exact: true })).toHaveCount(0);
  for (const slot of l.practice.content.left) await studio.getByRole('combobox', { name: slot.text, exact: true }).selectOption(synthetic[slot.id]);
  await expect(studio.getByText(l.practice.content.studio.change, { exact: true })).toBeVisible();
  await expect(studio.locator('textarea,input')).toHaveCount(0);
  const first = l.practice.content.left[0];
  const wrong = first.choices.find(id => id !== synthetic[first.id])!;
  await studio.getByRole('combobox', { name: first.text, exact: true }).selectOption(wrong);
  await studio.getByRole('button', { name: 'Провери решенията' }).click();
  await expect(page.getByText('Пробният избор изисква поправка.')).toBeVisible();
  await studio.getByRole('combobox', { name: first.text, exact: true }).selectOption(synthetic[first.id]);
  await studio.getByRole('button', { name: 'Провери решенията' }).click();
  await expect(studio.getByRole('button', { name: 'Практиката е премината' })).toBeDisabled();
  await page.reload();
  for (const slot of l.practice.content.left) await expect(studio.getByRole('combobox', { name: slot.text, exact: true })).toHaveValue(synthetic[slot.id]);
  const downloadEvent = page.waitForEvent('download');
  await studio.getByRole('button', { name: 'Изтегли избраните решения' }).click();
  const download = await downloadEvent;
  const text = await readFile((await download.path())!, 'utf8');
  expect(text).toContain(l.practice.content.studio.change);
  expect(text).toContain('не удостоверява оценка');
  for (const id of Object.values(synthetic)) expect(text).not.toContain(id);
  expect(submitted).toEqual([{ matches: { ...synthetic, [first.id]: wrong } }, { matches: synthetic }]);
  await assertLearningFits(page); await assertLearningContrast(studio);
  await page.screenshot({ path: info.outputPath(`schedule-${theme}-${width}.png`), fullPage: true });
});

for (const [theme, width] of [['light', 320], ['dark', 1280]] as const) test(`${theme} ${width}px: caption occupies its own band and retains the selected variant on theme change`, async ({ page }, info) => {
  const l = find('pv09-04'), slot = l.practice.content.left[0];
  const top = l.practice.content.right.find(c => slot.choices.includes(c.id) && c.preview?.caption?.position === 'top' && c.preview.caption.size === 'normal')!;
  const middle = l.practice.content.right.find(c => slot.choices.includes(c.id) && c.preview?.caption?.position === 'middle')!;
  await page.setViewportSize({ width, height: 950 });
  await prepareAcademyTheme(page, theme, { title: l.title, blocks: [{ ...l.practice, id: '00000000-0000-4000-8000-000000000088', position: 0 }] });
  await page.goto(`/module/${l.module}?lesson=${l.lesson}`);
  const studio = page.getByTestId('closed-practice-studio'), select = studio.getByRole('combobox', { name: slot.text, exact: true });
  await select.selectOption(top.id);
  const caption = studio.getByTestId('studio-caption'), image = studio.getByRole('img');
  const captionBox = await caption.boundingBox(), imageBox = await image.boundingBox();
  expect(captionBox!.y + captionBox!.height).toBeLessThanOrEqual(imageBox!.y + 1);
  await select.selectOption(middle.id); await expect(caption).toHaveCSS('position', 'absolute');
  await selectTheme(page, theme === 'light' ? 'Тъмна' : 'Светла'); await expect(select).toHaveValue(middle.id);
  await select.selectOption(top.id);
  await assertLearningFits(page); await assertLearningContrast(studio);
  await page.screenshot({ path: info.outputPath(`caption-${theme}-${width}.png`), fullPage: true });
});

test('actual audio drives J-cut and L-cut illustration', async ({ page }, info) => {
  const l = find('pv09-09'), slots = l.practice.content.left;
  await prepareAcademyTheme(page, 'dark', { title: l.title, blocks: [{ ...l.practice, id: '00000000-0000-4000-8000-000000000088', position: 0 }] });
  await page.goto(`/module/${l.module}?lesson=${l.lesson}`);
  const studio = page.getByTestId('closed-practice-studio');
  const early = l.practice.content.right.find(c => slots[0].choices.includes(c.id) && c.preview?.transition === 'early')!;
  await studio.getByRole('combobox', { name: slots[0].text, exact: true }).selectOption(early.id);
  let audio = studio.getByLabel('Синтетичен звук за прехода');
  await audio.evaluate((a: HTMLAudioElement) => a.play());
  await expect.poll(() => audio.evaluate((a: HTMLAudioElement) => a.currentTime)).toBeGreaterThan(0);
  await audio.evaluate((a: HTMLAudioElement) => { a.pause(); a.currentTime = 3.2; });
  await expect(studio.getByText('Говорещият', { exact: true })).toBeVisible();
  await studio.getByRole('combobox', { name: slots[1].text, exact: true }).selectOption(slots[1].choices[0]);
  const tail = l.practice.content.right.find(c => slots[2].choices.includes(c.id) && c.preview?.transition === 'tail')!;
  await studio.getByRole('combobox', { name: slots[2].text, exact: true }).selectOption(tail.id);
  audio = studio.getByLabel('Синтетичен звук за прехода');
  await audio.evaluate((a: HTMLAudioElement) => a.play());
  await audio.evaluate((a: HTMLAudioElement) => { a.pause(); a.currentTime = 4.2; });
  await expect(studio.getByText('Ръцете и работната маса', { exact: true })).toBeVisible();
  await assertLearningFits(page); await assertLearningContrast(studio);
  await page.screenshot({ path: info.outputPath('sound-cut.png'), fullPage: true });
});

test('actual video uses the selected 2x speed and stops at the source range end', async ({ page }, info) => {
  const l = find('pv09-10'), slot = l.practice.content.left[0];
  await prepareAcademyTheme(page, 'light', { title: l.title, blocks: [{ ...l.practice, id: '00000000-0000-4000-8000-000000000088', position: 0 }] });
  await page.goto(`/module/${l.module}?lesson=${l.lesson}`);
  const studio = page.getByTestId('closed-practice-studio');
  const fast = l.practice.content.right.find(c => slot.choices.includes(c.id) && c.preview?.rate === 2)!;
  await studio.getByRole('combobox', { name: slot.text, exact: true }).selectOption(fast.id);
  await studio.getByRole('button', { name: 'Пусни избраната скорост' }).click();
  const player = studio.getByLabel('Скорост на предоставения фрагмент');
  await expect.poll(() => player.evaluate((v: HTMLVideoElement) => v.currentTime)).toBeGreaterThan(10);
  expect(await player.evaluate((v: HTMLVideoElement) => v.playbackRate)).toBe(2);
  await expect.poll(() => player.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
  expect(await player.evaluate((v: HTMLVideoElement) => v.currentTime)).toBeGreaterThanOrEqual(14);
  await assertLearningFits(page); await assertLearningContrast(studio);
  await page.screenshot({ path: info.outputPath('speed.png'), fullPage: true });
});
