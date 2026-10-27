import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

const base = '/academy-labs/silk-road/m01-pilot-20261027';

test('pilot retains the four lessons and a usable mobile reading layout', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/index.html`);
  for (let lesson = 1; lesson <= 4; lesson += 1) {
    await expect(page.locator(`#lesson-${lesson}`)).toHaveCount(1);
  }
  await expect(page.getByRole('link', { name: 'Отвори тетрадката', exact: true })).toHaveAttribute('href', 'workbook.html');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
  expect(await page.locator('main').innerText()).toContain('4.7а · Допълнителни случаи „Нит“ и „Лист“');
  expect(await page.locator('main').innerText()).toContain('3.6а · Практически справочник за избор на приложение');
});

test('learner authors a page, runs the eight probes and restores a downloaded workbook', async ({ page, browser }) => {
  await page.goto(`${base}/workbook.html`);
  await page.locator('#brief_0').fill('Моят първи опит за велоателие Педал');
  await page.locator('[data-snapshot="1"]').click();
  await page.locator('#brief_0').fill('Моят поправен опит за велоателие Педал');
  await page.locator('#sourceVersion').selectOption('P2');
  await page.locator('[data-tab="2"]').click();
  const fields: Record<string, string> = {
    business: 'Педал', service: 'Диагностика на велосипед', owner: 'Нели',
    heading: 'Диагностика преди ремонт', description: 'Опиши проблема с велосипеда.',
    price: '30', scope: 'Ремонтът се уточнява отделно.',
    action: 'Изпрати запитване', next: 'Нели потвърждава възможността; няма резервиран час.',
  };
  for (const [field, value] of Object.entries(fields)) await page.locator(`#page_${field}`).fill(value);
  await page.locator('#buildPreview').click();
  await expect(page.frameLocator('#preview').getByRole('heading', { level: 1 })).toHaveText(fields.heading);
  await page.locator('[data-tab="4"]').click();
  await page.locator('#runTests').click();
  await expect(page.locator('#testResults')).toContainText('T8');
  await expect(page.locator('#testResults .pass')).toHaveCount(8);
  await expect(page.locator('#testResults .fail')).toHaveCount(0);

  const downloaded = page.waitForEvent('download');
  await page.locator('#saveCopy').click();
  const download = await downloaded;
  const file = await download.path();
  if (!file) throw new Error('Workbook was not downloaded');
  const exported = await readFile(file, 'utf8');
  const context = await browser.newContext();
  const restored = await context.newPage();
  await restored.route('**/restored-m1.html', route => route.fulfill({ contentType: 'text/html; charset=utf-8', body: exported }));
  await restored.goto('http://127.0.0.1:5180/restored-m1.html');
  await restored.locator('[data-tab="1"]').click();
  await expect(restored.locator('#brief_0')).toHaveValue('Моят поправен опит за велоателие Педал');
  await expect(restored.locator('#brief_0')).toHaveCount(1);
  await expect(restored.locator('#history1')).toContainText('Моят първи опит за велоателие Педал');
  await expect(restored.locator('#sourceVersion')).toHaveValue('P2');
  await context.close();
});
