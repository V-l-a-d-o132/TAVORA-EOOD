import { test, expect, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';

const base = '/academy-labs/silk-road/m02-pilot-20261028/workbook.html';
async function author(page: Page) {
  await page.goto(base);
  for (const [id, value] of Object.entries({
    business: 'Учебно ателие', heading: 'Моята собствена услуга', description: 'Собствен текст за посетителя.',
    price: '30 евро за диагностика', scope: 'Ремонтът се уточнява отделно.', process: 'Човек потвърждава възможността.',
    action: 'Изпрати запитване', next: 'Предпочитанието не е потвърден час.',
  })) await page.locator('#' + id).fill(value);
  await page.locator('#buildPreview').click();
  await expect(page.frameLocator('#preview').locator('h1')).toHaveText('Моята собствена услуга');
}

test('ten stages remain usable at 320 pixels without exposing paid lesson readings', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto(base);
  await expect(page.locator('[data-stage]')).toHaveCount(10);
  for (let n = 1; n <= 10; n++) {
    await page.locator(`[data-stage="${n}"]`).click();
    await expect(page.locator(`#stage-${n}`)).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  }
  await expect(page.locator('body')).not.toContainText('Самостоятелен казус К-2:');
});

test('own text, form failure, unknown response and retry retain one record', async ({ page }) => {
  await author(page);
  const frame = page.frameLocator('#preview');
  await frame.locator('summary').click();
  await frame.locator('#contact').fill('test@example.invalid');
  await frame.locator('#day').fill('четвъртък следобед');
  await frame.locator('#mode').selectOption('writefail');
  await frame.locator('#submit').click();
  await expect(frame.locator('#status')).toContainText('Няма нов запис');
  await expect(frame.locator('#day')).toHaveValue('четвъртък следобед');
  await expect(frame.locator('#count')).toHaveText('0');
  await frame.locator('#mode').selectOption('lost');
  await frame.locator('#submit').click();
  await expect(frame.locator('#status')).toContainText('неизвестен');
  await expect(frame.locator('#count')).toHaveText('1');
  await frame.locator('#mode').selectOption('ok');
  await frame.locator('#submit').click();
  await expect(frame.locator('#status')).toContainText('не е потвърден час');
  await expect(frame.locator('#count')).toHaveText('1');
  await frame.locator('nav a[href="#terms"]').click();
  await expect(frame.locator('#day')).toHaveValue('четвъртък следобед');
  await page.locator('#runChecks').click();
  await expect(page.locator('#checks .pass')).toHaveCount(10);
  await expect(page.locator('#checks .fail')).toHaveCount(0);
  await expect(frame.locator('#count')).toHaveText('1');
  await page.locator('#heading').fill('Поправено заглавие');
  await expect(page.locator('#checks li')).toHaveCount(0);
});

test('contrast uses actual colors and image checks distinguish decorative and missing alt', async ({ page }) => {
  await author(page);
  await page.locator('[data-stage="3"]').click();
  await page.locator('#accent').fill('#86efac');
  await expect(page.locator('#contrast .fail')).toHaveCount(1);
  await page.locator('#buildPreview').click();
  await expect(page.frameLocator('#preview').locator('h1')).toBeVisible();
  await page.locator('#runChecks').click();
  await expect(page.locator('#checks .fail')).toContainText('C2');
  await page.locator('#accent').fill('#166534');
  await page.locator('[data-stage="5"]').click();
  await page.locator('#imageRole').selectOption('content');
  await page.locator('#buildPreview').click();
  await expect(page.frameLocator('#preview').locator('h1')).toBeVisible();
  await page.locator('#runChecks').click();
  await expect(page.locator('#checks .fail')).toContainText('F8');
  await page.locator('#imageAlt').fill('Учебна схема на велосипед');
  await page.locator('#buildPreview').click();
  await expect(page.frameLocator('#preview').locator('#art')).toHaveAttribute('alt', 'Учебна схема на велосипед');
  await page.locator('#runChecks').click();
  await expect(page.locator('#checks .pass')).toHaveCount(10);
});

test('downloaded workbook restores authored text, first attempt and a real image in a fresh context', async ({ page, browser }) => {
  await author(page);
  await page.locator('#attemptNote').fill('Първи опит преди обратна връзка');
  await page.locator('#snapshot').click();
  await page.locator('#heading').fill('Поправено собствено заглавие');
  await page.locator('[data-stage="5"]').click();
  await page.locator('#imageFile').setInputFiles({ name: 'pixel.png', mimeType: 'image/png', buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a7x8AAAAASUVORK5CYII=', 'base64') });
  await expect(page.locator('#imageMetadata')).toContainText('1 × 1 px');
  const event = page.waitForEvent('download');
  await page.locator('#saveCopy').click();
  const path = await (await event).path();
  if (!path) throw new Error('Workbook download missing');
  const html = await readFile(path, 'utf8');
  const context = await browser.newContext();
  const restored = await context.newPage();
  await restored.route('**/restored-m2.html', route => route.fulfill({ contentType: 'text/html; charset=utf-8', body: html }));
  await restored.goto('http://127.0.0.1:5180/restored-m2.html');
  await expect(restored.locator('#imageMetadata')).toContainText('pixel.png');
  await restored.locator('[data-stage="1"]').click();
  await expect(restored.locator('#heading')).toHaveValue('Поправено собствено заглавие');
  await expect(restored.locator('#history')).toContainText('Моята собствена услуга');
  await expect(restored.locator('[data-stage]')).toHaveCount(10);
  await expect(restored.locator('#heading')).toHaveCount(1);
  await expect(restored.frameLocator('#preview').locator('#art')).toHaveAttribute('src', /^data:image\/png;base64,/);
  await context.close();
});

test('JSON import is reviewed before replacement and rejects invalid content', async ({ page }) => {
  await author(page);
  const event = page.waitForEvent('download');
  await page.locator('#exportJson').click();
  const path = await (await event).path();
  if (!path) throw new Error('JSON download missing');
  await page.locator('#heading').fill('Работа преди импорт');
  await page.locator('header summary').click();
  await page.locator('#importFile').setInputFiles(path);
  await expect(page.locator('#applyImport')).toBeEnabled();
  await expect(page.locator('#heading')).toHaveValue('Работа преди импорт');
  await page.locator('#applyImport').click();
  await expect(page.locator('#heading')).toHaveValue('Моята собствена услуга');
  await page.locator('#importFile').setInputFiles({ name: 'bad.json', mimeType: 'application/json', buffer: Buffer.from('{"edition":"other"}') });
  await expect(page.locator('#importStatus')).toContainText('Невалиден архив');
  await expect(page.locator('#heading')).toHaveValue('Моята собствена услуга');
});

test('exported page escapes authored markup and remains usable offline', async ({ page, browser }) => {
  await author(page);
  const hostile = '<img src=x onerror="window.injected=true"> </script><script>window.injected=true</script>';
  await page.locator('#heading').fill(hostile);
  const event = page.waitForEvent('download');
  await page.locator('#downloadPage').click();
  const path = await (await event).path();
  if (!path) throw new Error('Page download missing');
  const html = await readFile(path, 'utf8');
  const context = await browser.newContext();
  const restored = await context.newPage();
  await restored.route('**/exported-m2.html', route => route.fulfill({ contentType: 'text/html; charset=utf-8', body: html }));
  await restored.goto('http://127.0.0.1:5180/exported-m2.html');
  await expect(restored.locator('h1')).toHaveText(hostile);
  expect(await restored.evaluate(() => 'injected' in window)).toBe(false);
  await restored.locator('#contact').fill('test@example.invalid');
  await restored.locator('#day').fill('петък');
  await restored.locator('#submit').click();
  await expect(restored.locator('#status')).toContainText('Учебен запис');
  await restored.locator('nav a[href="#terms"]').click();
  await expect(restored.locator('#day')).toHaveValue('петък');
  await expect(restored.locator('#count')).toHaveText('1');
  await context.close();
});
