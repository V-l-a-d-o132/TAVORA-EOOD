import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { prepareAcademyTheme, selectTheme } from './helpers/academy-theme-fixture';
import { assertLearningContrast, assertLearningFits } from './helpers/learning-contrast';
import { loadPracticalCandidates } from '../scripts/prepare-practical-video-assets.mjs';
import { loadPracticalSilkCandidates } from '../scripts/prepare-practical-silk-assets.mjs';
import { loadPracticalMarketingCandidates } from '../scripts/prepare-practical-marketing-assets.mjs';
import { VIDEO_LAB_CHALLENGES } from '../src/data/video-lab-challenges';

for (const theme of ['light', 'dark']) {
  for (const [course, load] of [['s01', loadPracticalSilkCandidates], ['s02', loadPracticalCandidates], ['s03', loadPracticalMarketingCandidates]] as const) {
    test(`${theme}: ${course} comparison preserves grading, restores choices and exports a useful record`, async ({ page }, info) => {
      await page.setViewportSize({ width: 320, height: 900 });
      const candidate = load()[0], block = candidate.practice, slots = block.content.left;
      const expected = Object.fromEntries(slots.map(slot => [slot.id, slot.choices[0]]));
      const calls = await prepareAcademyTheme(page, theme, { blocks: [{ ...block, id: '00000000-0000-4000-8000-000000000451', position: 0 }], matchingExpected: expected });
      await page.goto(`/module/${candidate.module}?lesson=0`);
      const studio = page.getByTestId('closed-practice-studio');
      for (const slot of slots) await studio.getByRole('combobox', { name: slot.text, exact: true }).selectOption(expected[slot.id]);
      await studio.getByRole('button', { name: 'Запази вариант за сравнение', exact: true }).click();
      await studio.getByRole('combobox', { name: slots[0].text, exact: true }).selectOption(slots[0].choices[1]);
      const comparison = studio.getByRole('region', { name: 'Сравнение на решенията' });
      await expect(comparison.getByText(/^Променени части: 1\//)).toBeVisible();
      await selectTheme(page, theme === 'light' ? 'Тъмна' : 'Светла');
      await expect(comparison.getByText(/^Променени части: 1\//)).toBeVisible();
      await assertLearningFits(page); await assertLearningContrast(studio);
      const waiting = page.waitForEvent('download'); await studio.getByRole('button', { name: 'Изтегли сравнението', exact: true }).click();
      const file = await waiting; expect(file.suggestedFilename()).toBe('uchebno-sravnenie.txt');
      const text = await readFile((await file.path())!, 'utf8'); expect(text).toContain('Запазен вариант:'); expect(text).toContain('Текущ вариант:'); expect(text).toContain(block.content.studio.task);
      expect(calls.academy_complete_lesson_block || 0).toBe(0);
      await comparison.getByRole('button', { name: 'Върни запазените избори', exact: true }).click();
      await studio.getByRole('button', { name: 'Провери решенията', exact: true }).click();
      await expect(studio.getByRole('button', { name: 'Практиката е премината', exact: true })).toBeVisible();
      expect(calls.academy_complete_lesson_block).toBe(1);
      await page.setViewportSize({ width: 1280, height: 950 }); await assertLearningFits(page);
      await page.screenshot({ path: info.outputPath(`${course}-${theme}-comparison.png`), fullPage: true });
    });
  }

  test(`${theme}: Silk draft resumes and a single downloaded workbook really works offline`, async ({ page, browser }, info) => {
    await prepareAcademyTheme(page, theme); await page.setViewportSize({ width: 320, height: 900 });
    await page.goto('/academy-labs/silk-road/start');
    const plan = [['Каква цена ще покажеш в евро?', '25'], ['На кой източник стъпва цената?', 'current'], ['Какво обещава бутонът?', 'request'], ['При повторение на една заявка', 'same-id'], ['Ако контактът липсва', 'ask']];
    for (const [label, value] of plan) await page.getByRole('combobox', { name: label, exact: true }).selectOption(value);
    await page.getByRole('button', { name: 'Провери моя прототип', exact: true }).click();
    await expect(page.getByText('Прототипът покрива проверените условия за този случай. Приложи принципите към различния бизнес.')).toBeVisible();
    await page.getByRole('button', { name: 'Приложи наученото към пекарната' }).click();
    await page.getByRole('combobox', { name: plan[0][0], exact: true }).selectOption('18');
    await page.getByRole('button', { name: 'Върни се към работилницата' }).click();
    for (const [label, value] of plan) await expect(page.getByRole('combobox', { name: label, exact: true })).toHaveValue(value);
    await page.reload();
    await expect(page.getByText(/Възстановени са последните учебни избори/)).toBeVisible();
    await expect(page.getByText(/Проверени предоставени случаи в тази сесия/)).toContainText('0/2');
    await assertLearningFits(page); await assertLearningContrast(page.locator('main'));
    const wait = page.waitForEvent('download'); await page.getByRole('button', { name: 'Изтегли работеща тетрадка · HTML' }).click();
    const file = await wait, path = info.outputPath(file.suggestedFilename()); await file.saveAs(path);
    const context = await browser.newContext({ offline: true, viewport: { width: 320, height: 900 } }), offline = await context.newPage();
    const errors: string[] = []; offline.on('pageerror', error => errors.push(error.message));
    await offline.goto(pathToFileURL(path).href);
    await offline.getByRole('button', { name: 'Провери този вариант' }).click();
    await expect(offline.locator('#workbook-results [data-passed=true]')).toHaveCount(8);
    await offline.getByText('Промени плана на страницата', { exact: true }).click();
    await offline.getByLabel('При повторение на една заявка').selectOption('new-record');
    await offline.getByRole('button', { name: 'Провери този вариант' }).click();
    await expect(offline.locator('#workbook-results [data-passed=false]')).toHaveCount(2);
    expect(await offline.locator('input,textarea,iframe,script[src]').count()).toBe(0); expect(errors).toEqual([]);
    expect(await offline.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    await offline.screenshot({ path: info.outputPath(`silk-${theme}-offline.png`), fullPage: true }); await context.close();
  });

  test(`${theme}: a new video goal changes the decision and the real demonstration`, async ({ page, browser }, info) => {
    await prepareAcademyTheme(page, theme); await page.setViewportSize({ width: 320, height: 900 }); await page.goto('/academy-labs/perfect-video/start');
    const region = page.getByRole('region', { name: 'Приложи показаното в нов случай' }), [first, changed] = VIDEO_LAB_CHALLENGES.story;
    await expect(region.getByText(changed.context)).toHaveCount(0);
    await region.getByRole('radio', { name: first.options[1].label }).check(); await region.getByRole('button', { name: 'Провери основанието' }).click();
    await expect(region.getByText(first.options[1].note)).toBeVisible();
    await region.getByRole('radio', { name: first.options[0].label }).check(); await region.getByRole('button', { name: 'Провери основанието' }).click();
    await region.getByRole('radio', { name: changed.options[1].label }).check(); await region.getByRole('button', { name: 'Провери основанието' }).nth(1).click();
    await expect(page.getByText('Обосновани решения в тази сесия: 2/22')).toBeVisible();
    await region.getByRole('button', { name: 'Виж свързания вариант в демонстрацията' }).nth(1).click();
    await expect(page.getByRole('group', { name: 'Вариант на демонстрацията' }).getByRole('button', { name: 'Първо резултатът' })).toHaveAttribute('aria-pressed', 'true');
    await selectTheme(page, theme === 'light' ? 'Тъмна' : 'Светла');
    await expect(region.getByText(changed.options[1].note)).toBeVisible();
    await assertLearningFits(page); await assertLearningContrast(page.locator('main'));
    await page.setViewportSize({ width: 1280, height: 950 }); await assertLearningFits(page);
    await page.screenshot({ path: info.outputPath(`video-${theme}-new-goal.png`), fullPage: true });
    const wait = page.waitForEvent('download'); await page.getByRole('button', { name: 'Изтегли 22-те упражнения · HTML' }).click();
    const file = await wait, path = info.outputPath(file.suggestedFilename()); await file.saveAs(path);
    const context = await browser.newContext({ offline: true, viewport: { width: 320, height: 900 } }), offline = await context.newPage();
    await offline.goto(pathToFileURL(path).href); await expect(offline.locator('#workbook-progress')).toContainText('0/22');
    await offline.getByRole('button', { name: 'Провери основанието' }).click();
    await offline.getByRole('button', { name: 'Провери основанието' }).nth(1).click();
    await expect(offline.locator('#workbook-progress')).toContainText('2/22');
    await offline.getByRole('button', { name: 'Тъмна', exact: true }).click(); await assertLearningContrast(offline.locator('main')); await assertLearningFits(offline);
    await context.close();
  });

  test(`${theme}: Marketing prediction, correction and changed capacity survive a portable export`, async ({ page, browser }, info) => {
    await prepareAcademyTheme(page, theme); await page.setViewportSize({ width: 320, height: 900 }); await page.goto('/academy/marketing-basics-practice.html');
    await page.getByRole('button', { name: theme === 'light' ? 'Светла' : 'Тъмна', exact: true }).click();
    await page.getByLabel('Какво състояние ще остане в записа?').selectOption('booking_unconfirmed'); await page.getByLabel('Ще има ли нов ефект от тази операция?').selectOption('yes');
    await page.locator('#crm-predict').click(); await expect(page.locator('#crm-feedback')).toContainText('Свери прогнозата');
    await page.getByLabel('Какво състояние ще остане в записа?').selectOption('needs_dimensions'); await page.locator('#crm-predict').click();
    await expect(page.locator('#crm-log tr')).toHaveCount(1); await expect(page.locator('#crm-progress')).toContainText('1/20');
    await page.getByLabel('Наличен учебен ресурс').selectOption('57'); await page.getByLabel('Каква следваща стъпка следва от избрания случай?').selectOption('renegotiate'); await page.locator('#project-check').click();
    await expect(page.locator('#project-preview')).toContainText('28 поръчки'); await expect(page.locator('#project-feedback')).toContainText('Стъпката следва');
    await assertLearningFits(page); await assertLearningContrast(page.locator('main'));
    const wait = page.waitForEvent('download'); await page.getByRole('button', { name: 'Изтегли работещия HTML' }).click();
    const file = await wait, path = info.outputPath(file.suggestedFilename()); await file.saveAs(path);
    const context = await browser.newContext({ offline: true, viewport: { width: 320, height: 900 } }), offline = await context.newPage();
    await offline.goto(pathToFileURL(path).href); await expect(offline.locator('#crm-progress')).toContainText('0/20');
    await offline.getByLabel('Избери имейл случай').selectOption('E09'); await offline.getByLabel('Какъв ще е резултатът от операцията?').selectOption('suppressed_after_recheck'); await offline.locator('#email-predict').click();
    await expect(offline.locator('#email-progress')).toContainText('1/10'); await expect(offline.locator('#email-result')).toContainText('0 изпратени писма');
    await offline.getByRole('button', { name: 'Тъмна', exact: true }).click(); await assertLearningContrast(offline.locator('main')); await assertLearningFits(offline);
    await offline.screenshot({ path: info.outputPath(`marketing-${theme}-offline.png`), fullPage: true }); await context.close();
  });
}
