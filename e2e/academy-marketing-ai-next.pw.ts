import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';
import { loadNextMarketingAiCandidates } from '../scripts/prepare-next-marketing-ai-assets.mjs';
import { prepareAcademyTheme } from './helpers/academy-theme-fixture';
import { assertLearningFits, assertLearningContrast } from './helpers/learning-contrast';
const rows = loadNextMarketingAiCandidates();
const privateRows = process.env.MARKETING_AI_NEXT_PRIVATE ? JSON.parse(readFileSync(process.env.MARKETING_AI_NEXT_PRIVATE, 'utf8')) : null;
test.setTimeout(90000);

for (const theme of ['light', 'dark']) for (const width of [320, 1280]) {
  test(`new module comparisons and working models fit: ${theme}, ${width}px`, async ({ page }, info) => {
    await page.setViewportSize({ width, height: 950 });
    const requests = await prepareAcademyTheme(page, theme, undefined, { anonymous: true, hasFullAccess: false });
    const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
    await page.goto('/academy-tools/marketing-basics');
    await expect(page.getByRole('heading', { name: 'От въпроса на човека до провереното послание' })).toBeVisible();
    const demo = page.getByRole('region', { name: 'Предоставена демонстрация' });
    expect(await page.getByRole('combobox', { name: 'Избери модул' }).locator('option').evaluateAll(options => options.slice(0, 5).map(o => (o as HTMLOptionElement).value))).toEqual(['s03-m01', 's03-m02', 's03-m05', 's03-m03', 's03-m07']);
    for (const id of ['s03-m10', 's03-m11', 's03-m08', 's03-m06', 's03-m09']) {
      await page.getByRole('combobox', { name: 'Избери модул' }).selectOption(id);
      await demo.getByRole('button', { name: 'Свери с източниците', exact: true }).click();
      const review = demo.getByRole('status').filter({hasText: /./}).first(); await expect(review).toBeVisible();
      await demo.getByRole('group', { name: 'Избери учебна версия' }).getByRole('button').nth(1).click();
      await expect(demo.getByRole('button', { name: 'Свери с източниците', exact: true })).toHaveAttribute('aria-expanded','false');
      if (id === 's03-m11') {
        const work = demo.getByRole('region',{name:'Изпробвай календар при промяна на приема'});
        await work.getByRole('combobox').selectOption('full'); await expect(work.getByRole('status')).toContainText('остаряла покана');
        await work.getByRole('button',{name:'Спри поканата'}).click(); await expect(work.getByRole('status')).toContainText('спряна');
        await work.getByRole('combobox').selectOption('pending'); await expect(work.getByRole('status')).toContainText('спряна');
      }
      if (id === 's03-m08') {
        const work = demo.getByRole('region',{name:'Пробвай трите състояния на действието'});
        const mode = work.getByRole('combobox',{name:'Предоставен резултат на системата'}), format = work.getByRole('combobox',{name:'Избери предоставен размер'});
        await format.selectOption('A6');
        for (const [value,note] of [['prototype','Няма потвърден запис'],['failed','не е записано'],['received','У-17']]) {
          await mode.selectOption(value); await work.getByRole('button',{name:'Изпробвай действието'}).click(); await expect(work.getByRole('status')).toContainText(note); await expect(format).toHaveValue('A6');
        }
      }
      if (id === 's03-m06') {
        const work=demo.getByRole('region',{name:'Сравни какво е останало във входа'});
        await work.getByRole('button',{name:'Променена среда'}).click(); await expect(work.getByRole('img')).toHaveAttribute('aria-label',/вход А без стъпала/);
        await work.getByRole('button',{name:'По-четима табела'}).click(); await expect(work.getByRole('img')).toHaveAttribute('aria-label',/вход Б с три стъпала/);
      }
      if (id === 's03-m09') {
        const work=demo.getByRole('region',{name:'Прочети един и същ обхват'});
        await expect(work).toContainText('200 / 1000 = 20%'); await work.getByRole('combobox').selectOption('mobile'); await expect(work).toContainText('90 / 600 = 15%');
      }
      await assertLearningFits(page); await assertLearningContrast(demo);
      if (id !== 's03-m10') await demo.getByRole('region', {name: {'s03-m11':'Изпробвай календар при промяна на приема','s03-m08':'Пробвай трите състояния на действието','s03-m06':'Сравни какво е останало във входа','s03-m09':'Прочети един и същ обхват'}[id]}).screenshot({path: info.outputPath(`model-${id}-${theme}-${width}.png`)});
    }
    await expect(page.getByRole('region', { name: 'Подбрани инструменти' }).getByRole('article')).toHaveCount(23);
    const pomelli = page.getByRole('article', { name: 'Pomelli', exact: true });
    await pomelli.getByText('Работен маршрут · Pomelli', { exact: true }).click();
    await expect(pomelli.locator('ol li')).toHaveCount(3);
    await assertLearningContrast(page.locator('main'));
    expect(await page.locator('input,textarea,[contenteditable="true"]').count()).toBe(0);
    expect(requests.academy_complete_lesson_block || 0).toBe(0); expect(requests.academy_autosave_lesson || 0).toBe(0); expect(errors).toEqual([]);
    await page.screenshot({ path: info.outputPath(`marketing-ai-next-${theme}-${width}.png`), fullPage: true });
  });

  test(`moved paid lesson, independent case, feedback and retry: ${theme}, ${width}px`, async ({ page }, info) => {
    await page.setViewportSize({ width, height: 950 });
    const row = rows.find(r => r.lesson === 'lm01-01'), guide = row.payload.additions.find(b => b.type === 'rich_text'), block = row.payload.additions.find(b => b.type === 'matching');
    const privateCheck = privateRows?.find(r => r.lesson === row.lesson).payload.additions.find(b => b.type === 'matching');
    const matches = privateCheck?.evaluation.matches || Object.fromEntries(block.content.left.map(s => [s.id, s.choices[0]]));
    await prepareAcademyTheme(page, theme, { title: row.title, blocks: [{ ...guide, id: '00000000-0000-4000-8000-000000000087', position: 0 }, { ...block, id: '00000000-0000-4000-8000-000000000088', position: 1 }], matchingExpected: matches, matchingFeedback: block.content.left.map(s => ({ slot: s.id, label: s.text, success: 'Изборът пази условията на предоставения случай.', retry: 'Свери избора с дадения обхват и условия.' })) });
    await page.goto('/module/s03-m09?lesson=lm01-01');
    await expect(page.getByText(guide.content.marketingAi.intro.replace(/\s+/g, ' '), { exact: true })).toHaveCount(1);
    await expect(page.getByRole('article', { name: 'Perplexity', exact: true })).toBeVisible();
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
    await page.screenshot({ path: info.outputPath(`marketing-next-check-${theme}-${width}.png`), fullPage: true });
  });
}

test('invalid module defaults safely; public examples never unlock paid marketing lessons', async ({ page }) => {
  const requests = await prepareAcademyTheme(page, 'light', undefined, { anonymous: true, hasFullAccess: false });
  await page.goto('/academy-tools/marketing-basics?module=unknown');
  await expect(page.getByRole('combobox', { name: 'Избери модул' })).toHaveValue('s03-m01');
  await page.goto('/module/s03-m09?lesson=lm01-01');
  await expect(page.getByRole('heading', { name: /създай|Влез|вход|Достъп|заключен/i }).first()).toBeVisible();
  expect(requests.academy_get_lesson_v2 || 0).toBe(0);
});
