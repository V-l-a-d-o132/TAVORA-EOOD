import { readFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';
import { loadFinalCandidates } from '../scripts/prepare-final-video-assets.mjs';
import { prepareAcademyTheme, selectTheme } from './helpers/academy-theme-fixture';
import { assertLearningFits, assertLearningContrast } from './helpers/learning-contrast';
const lessons = loadFinalCandidates();
const find = (id: string) => lessons.find(l => l.lesson === id)!;
const grading = process.env.FINAL_VIDEO_PRIVATE_CANDIDATES ? JSON.parse(readFileSync(process.env.FINAL_VIDEO_PRIVATE_CANDIDATES, 'utf8')) : null;
const expected = (l: typeof lessons[number]) => grading?.find(row => row.lesson === l.lesson)?.payload.practice.evaluation.matches || Object.fromEntries(l.practice.content.left.map(slot => [slot.id, slot.choices[0]]));
test.setTimeout(90000);

for (const theme of ['light', 'dark']) for (const width of [320, 1280]) test(`${theme} ${width}px: metrics, changed denominator, correction, resume and local plan`, async ({ page }, info) => {
  const l = find('pv11-09'), answers = expected(l);
  await page.setViewportSize({ width, height: 950 });
  await prepareAcademyTheme(page, theme, { title: l.title, objective: l.opening.body, blocks: [{ ...l.practice, id: '00000000-0000-4000-8000-000000000088', position: 0 }], matchingExpected: answers });
  const submitted: unknown[] = [];
  page.on('request', r => { if (r.url().includes('academy_complete_lesson_block')) submitted.push(r.postDataJSON().p_payload); });
  await page.goto(`/module/${l.module}?lesson=${l.lesson}`);
  const studio = page.getByTestId('closed-practice-studio');
  await expect(studio).toBeVisible({ timeout: 30000 });
  await expect(studio.getByText(l.practice.content.studio.change, { exact: true })).toHaveCount(0);
  for (const slot of l.practice.content.left) await studio.getByRole('combobox', { name: slot.text, exact: true }).selectOption(answers[slot.id]);
  await expect(studio.getByText(l.practice.content.studio.change, { exact: true })).toBeVisible();
  if (grading) { await expect(studio.getByRole('list', { name: 'Избрани сметки' })).toContainText('40 %'); await expect(studio.getByRole('list', { name: 'Избрани сметки' })).toContainText('50 %'); }
  await expect(studio.locator('input,textarea')).toHaveCount(0);
  const first = l.practice.content.left[0], wrong = first.choices.find(id => id !== answers[first.id])!;
  await studio.getByRole('combobox', { name: first.text, exact: true }).selectOption(wrong);
  await studio.getByRole('button', { name: 'Провери решенията' }).click();
  await expect(page.getByText('Пробният избор изисква поправка.')).toBeVisible();
  await studio.getByRole('combobox', { name: first.text, exact: true }).selectOption(answers[first.id]);
  await studio.getByRole('button', { name: 'Провери решенията' }).click();
  await expect(studio.getByRole('button', { name: 'Практиката е премината' })).toBeDisabled();
  await page.reload();
  for (const slot of l.practice.content.left) await expect(studio.getByRole('combobox', { name: slot.text, exact: true })).toHaveValue(answers[slot.id]);
  const downloadEvent = page.waitForEvent('download');
  await studio.getByRole('button', { name: 'Изтегли избраните решения' }).click();
  const download = await downloadEvent, text = await readFile((await download.path())!, 'utf8');
  expect(text).toContain(l.practice.content.studio.change); expect(text).toContain('не удостоверява оценка');
  for (const id of Object.values(answers)) expect(text).not.toContain(id);
  expect(submitted).toEqual([{ matches: { ...answers, [first.id]: wrong } }, { matches: answers }]);
  await assertLearningFits(page); await assertLearningContrast(studio);
  await page.screenshot({ path: info.outputPath(`metrics-${theme}-${width}.png`), fullPage: true });
});

for (const [theme, width] of [['light', 320], ['dark', 1280]] as const) test(`${theme} ${width}px: margin and markup change with the chosen price and survive a theme change`, async ({ page }, info) => {
  const l = find('pv13-12'), first = l.practice.content.left[0], last = l.practice.content.left.at(-1)!;
  await page.setViewportSize({ width, height: 950 });
  await prepareAcademyTheme(page, theme, { title: l.title, objective: l.opening.body, blocks: [{ ...l.practice, id: '00000000-0000-4000-8000-000000000088', position: 0 }] });
  await page.goto(`/module/${l.module}?lesson=${l.lesson}`);
  const studio = page.getByTestId('closed-practice-studio'), select = studio.getByRole('combobox', { name: first.text, exact: true });
  const price = (value: number) => l.practice.content.right.find(c => first.choices.includes(c.id) && c.preview?.budget?.price === value)!;
  await select.selectOption(price(500).id);
  const panel = studio.getByLabel('Учебен разчет');
  await expect(panel).toContainText('25%'); await expect(panel).toContainText('20%');
  await select.selectOption(price(480).id); await expect(panel).toContainText('16,67%');
  await selectTheme(page, theme === 'light' ? 'Тъмна' : 'Светла'); await expect(select).toHaveValue(price(480).id);
  await select.selectOption(price(500).id);
  const second = l.practice.content.left[1]; await studio.getByRole('combobox', { name: second.text, exact: true }).selectOption(second.choices[0]);
  const changed = l.practice.content.right.find(c => last.choices.includes(c.id) && c.preview?.budget?.price === 562.5)!;
  await studio.getByRole('combobox', { name: last.text, exact: true }).selectOption(changed.id);
  await expect(panel).toContainText('562,5'); await expect(panel).toContainText('450'); await expect(panel).toContainText('20%');
  await expect(studio.locator('input,textarea')).toHaveCount(0);
  await assertLearningFits(page); await assertLearningContrast(studio);
  await page.screenshot({ path: info.outputPath(`budget-${theme}-${width}.png`), fullPage: true });
});

for (const [theme, width] of [['light', 320], ['dark', 1280]] as const) test(`${theme} ${width}px: a storyboard forms a concrete path and adds the missing pickup scene`, async ({ page }, info) => {
  const l = find('pv15-02'), scenes = ['choice', 'order', 'handover', 'pickup'];
  await page.setViewportSize({ width, height: 950 });
  await prepareAcademyTheme(page, theme, { title: l.title, objective: l.opening.body, blocks: [{ ...l.practice, id: '00000000-0000-4000-8000-000000000088', position: 0 }] });
  await page.goto(`/module/${l.module}?lesson=${l.lesson}`);
  const studio = page.getByTestId('closed-practice-studio'), sequence = studio.getByRole('list', { name: 'Избран разкадровъчен план' });
  for (const [i, slot] of l.practice.content.left.entries()) {
    const choice = l.practice.content.right.find(c => slot.choices.includes(c.id) && c.preview?.board?.scene === scenes[i])!;
    await studio.getByRole('combobox', { name: slot.text, exact: true }).selectOption(choice.id);
    await expect(sequence.getByRole('img')).toHaveCount(i + 1);
  }
  await expect(sequence).toContainText('4. Място за получаване');
  await expect(studio.getByText(/Авторски учебни схеми/).first()).toBeVisible();
  await expect(studio.locator('input,textarea')).toHaveCount(0);
  await assertLearningFits(page); await assertLearningContrast(studio);
  await page.screenshot({ path: info.outputPath(`storyboard-${theme}-${width}.png`), fullPage: true });
});
