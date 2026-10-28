import { test, expect, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';

const base = '/academy-labs/silk-road/m03-pilot-20261028/workbook.html';
async function stage(page: Page, n: number) { await page.locator(`[data-stage="${n}"]`).click(); }
async function author(page: Page) {
  await page.goto(base);
  await stage(page, 2);
  for (const [id, value] of Object.entries({business:'Учебно ателие',title:'Собствено предложение',heading:'Моята услуга',meta:'Проверено описание.',description:'Собствен видим текст.',price:'30 евро за диагностика',scope:'Ремонтът е отделен.',process:'Човек потвърждава предпочитанието.',next:'Това не е потвърден час.'})) await page.locator('#'+id).fill(value);
}
async function downloadText(page: Page, id: string) {
  const event = page.waitForEvent('download');
  await page.locator('#'+id).click();
  const path = await (await event).path();
  if (!path) throw new Error('Missing download');
  return { path, text: await readFile(path, 'utf8') };
}
async function metricRows(page: Page) {
  await stage(page, 9);
  const data = [['Мобилни','4000','80'],['Настолни','1000','50'],['Таблети','0','0']];
  for (let n=1;n<=3;n++) for (const [key,value] of Object.entries({label:data[n-1][0],scope:'Една страница / BG / Web',ip:'30 дни А',cp:'30 дни А',impressions:data[n-1][1],clicks:data[n-1][2]})) await page.locator(`#m${n}_${key}`).fill(value);
  await page.locator('#noOverlap').check();
}

test('all ten stages work at 320 pixels and do not expose private transfer readings', async ({ page }) => {
  await page.setViewportSize({width:320,height:800});
  await page.goto(base);
  await expect(page.locator('[data-stage]')).toHaveCount(10);
  for (let n=1;n<=10;n++) {
    await stage(page,n);
    await expect(page.locator(`#stage-${n}`)).toBeVisible();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  }
  await expect(page.locator('body')).not.toContainText('Самостоятелен казус К-3:');
});

test('exported HTML contains authored metadata and JSON-LD without executing authored markup', async ({ page, browser }) => {
  await author(page);
  const hostile = '</script><script>window.injected=true</script><img src=x onerror="window.injected=true">';
  await page.locator('#heading').fill(hostile);
  await stage(page,4);
  await page.locator('#jsonld').fill(JSON.stringify({'@context':'https://schema.org','@type':'Service',name:hostile}));
  await page.locator('#checkJson').click();
  await expect(page.locator('#jsonStatus')).toContainText('JSON се чете');
  const {text} = await downloadText(page,'downloadPage');
  const context=await browser.newContext(), restored=await context.newPage();
  await restored.route('**/m3-export.html',route=>route.fulfill({contentType:'text/html; charset=utf-8',body:text}));
  await restored.goto('http://127.0.0.1:5180/m3-export.html');
  await expect(restored).toHaveTitle('Собствено предложение');
  await expect(restored.locator('h1')).toHaveText(hostile);
  await expect(restored.locator('meta[name="description"]')).toHaveAttribute('content','Проверено описание.');
  await expect(restored.locator('meta[name="robots"]')).toHaveAttribute('content','noindex');
  expect(JSON.parse(await restored.locator('script[type="application/ld+json"]').textContent() || '{}').name).toBe(hostile);
  expect(await restored.evaluate(()=> 'injected' in window)).toBe(false);
  await expect(restored.locator('script:not([type="application/ld+json"])')).toHaveCount(0);
  await restored.locator('a[href="#terms"]').click();
  await expect(restored.locator('#terms')).toBeInViewport();
  await context.close();
});

test('invalid JSON is reported and excluded, and field edits invalidate prior checks', async ({ page }) => {
  await author(page);
  await stage(page,4);
  await page.locator('#jsonld').fill('{"@type":"Service" "name":"Broken"}');
  await page.locator('#checkJson').click();
  await expect(page.locator('#jsonStatus')).toContainText('Нечетим JSON');
  await page.locator('#buildPreview').click();
  await expect(page.frameLocator('#preview').locator('script[type="application/ld+json"]')).toHaveCount(0);
  await expect(page.frameLocator('#preview').locator('body')).toContainText('JSON-LD не е включен');
  await page.locator('#runChecks').click();
  await expect(page.locator('#checks .result')).toHaveCount(4);
  await page.locator('#jsonld').fill('{"@context":"https://schema.org","@type":"Service"}');
  await expect(page.locator('#checks .result')).toHaveCount(0);
  await expect(page.locator('#jsonStatus')).toHaveText('Провери текущия JSON.');
});

test('CTR uses weighted totals, retains zero denominators, and refuses mismatched or overlapping segments', async ({ page }) => {
  await page.goto(base); await metricRows(page);
  await page.locator('#calculateMetrics').click();
  await expect(page.locator('#metricResults')).toContainText('130 / 5000 × 100 = 2,6%');
  await expect(page.locator('#metricResults')).toContainText('Таблети: 0 / 0 × 100 = неопределен');
  await page.locator('#m2_cp').fill('7 дни А');
  await page.locator('#calculateMetrics').click();
  await expect(page.locator('#metricResults')).toContainText('Няма допустим общ CTR');
  await expect(page.locator('#metricResults')).not.toContainText('Общо:');
  await page.locator('#m2_cp').fill('30 дни А');
  await page.locator('#noOverlap').uncheck();
  await page.locator('#calculateMetrics').click();
  await expect(page.locator('#metricResults')).toContainText('Не е потвърдено');
  await page.locator('#noOverlap').check();
  await page.locator('#m2_label').fill('Мобилни');
  await page.locator('#calculateMetrics').click();
  await expect(page.locator('#metricResults')).toContainText('Повтарящо се име');
  await page.locator('#m2_label').fill('Настолни');
  await page.locator('#m3_clicks').fill('1');
  await page.locator('#calculateMetrics').click();
  await expect(page.locator('#metricResults')).toContainText('кликове ≤ показвания');
  await page.locator('#m3_clicks').fill('0');
  for(let n=1;n<=2;n++){ await page.locator(`#m${n}_impressions`).fill('0'); await page.locator(`#m${n}_clicks`).fill('0'); }
  await page.locator('#calculateMetrics').click();
  await expect(page.locator('#metricResults')).toContainText('Общо: 0 / 0 × 100 = неопределен');
});

test('plan checks time without certifying dependencies and rejects missing or excess hours', async ({ page }) => {
  await page.goto(base); await stage(page,10);
  await page.locator('#budget').fill('6');
  await page.locator('#p1_name').fill('Поправка с проверка');
  await page.locator('#p1_hours').fill('1.5');
  await page.locator('#p2_name').fill('Резерв');
  await page.locator('#p2_hours').fill('1');
  await page.locator('#calculatePlan').click();
  await expect(page.locator('#planResults')).toContainText('Остават: 3.5 ч.');
  await expect(page.locator('#planResults')).toContainText('Зависимостите');
  await page.locator('#p1_hours').fill('6');
  await page.locator('#calculatePlan').click();
  await expect(page.locator('#planResults')).toContainText('Превишение: 1 ч.');
  await page.locator('#p2_hours').fill('');
  await page.locator('#calculatePlan').click();
  await expect(page.locator('#planResults')).toContainText('Задача 2');
});

test('downloaded workbook restores current work and first attempt in a fresh browser context', async ({ page, browser }) => {
  await author(page);
  await page.locator('#attemptNote').fill('Първи опит преди помощ');
  await page.locator('#snapshot').click();
  await page.locator('#heading').fill('Поправено собствено H1');
  const {text}=await downloadText(page,'saveCopy');
  const context=await browser.newContext(), restored=await context.newPage();
  await restored.route('**/m3-restored.html',route=>route.fulfill({contentType:'text/html; charset=utf-8',body:text}));
  await restored.goto('http://127.0.0.1:5180/m3-restored.html');
  await expect(restored.locator('#heading')).toHaveValue('Поправено собствено H1');
  await expect(restored.locator('#heading')).toHaveCount(1);
  await expect(restored.locator('#history')).toContainText('Моята услуга');
  await expect(restored.locator('#history')).toContainText('Първи опит преди помощ');
  await expect(restored.locator('[data-stage]')).toHaveCount(10);
  await expect(restored.frameLocator('#preview').locator('h1')).toHaveText('Поправено собствено H1');
  await expect(restored.locator('#checks .result')).toHaveCount(0);
  const evidence=await downloadText(restored,'exportEvidence');
  expect(evidence.text).toContain('Моята услуга');
  expect(evidence.text).toContain('Поправено собствено H1');
  await context.close();
});

test('M2 import requires review, copies only known text, and preserves the M3 analysis', async ({ page }) => {
  await page.goto(base);
  await page.locator('#source').fill('Мой собствен източник');
  const fields={business:'Внесен бизнес',heading:'От M2',description:'Описание',price:'Отделен обхват',scope:'Условия',process:'Ръчно потвърждение',next:'Изчакване',ignored:'Непознато поле'};
  await page.locator('#importDetails summary').click();
  await page.locator('#importFile').setInputFiles({name:'m2.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({edition:'tavora-page-workbook-20261028',fields}))});
  await expect(page.locator('#applyImport')).toBeEnabled();
  await stage(page,2);
  await expect(page.locator('#heading')).toHaveValue('');
  await page.locator('#applyImport').click();
  await expect(page.locator('#heading')).toHaveValue('От M2');
  await expect(page.locator('#title')).toHaveValue('');
  await stage(page,1);
  await expect(page.locator('#source')).toHaveValue('Мой собствен източник');
  const backup=JSON.parse((await downloadText(page,'exportJson')).text);
  expect(backup.fields.ignored).toBeUndefined();
});

test('M3 backup restores only after review and invalid archives leave current work intact', async ({ page }) => {
  await author(page);
  const backup=await downloadText(page,'exportJson');
  await page.locator('#heading').fill('Текуща работа');
  await page.locator('#importDetails summary').click();
  await page.locator('#importFile').setInputFiles(backup.path);
  await expect(page.locator('#applyImport')).toBeEnabled();
  await expect(page.locator('#heading')).toHaveValue('Текуща работа');
  await page.locator('#applyImport').click();
  await expect(page.locator('#heading')).toHaveValue('Моята услуга');
  const invalid=JSON.parse(backup.text);invalid.fields.unknown='invalid';
  await page.locator('#importFile').setInputFiles({name:'invalid.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(invalid))});
  await expect(page.locator('#importStatus')).toContainText('Невалиден архив');
  await expect(page.locator('#applyImport')).toBeDisabled();
  await expect(page.locator('#heading')).toHaveValue('Моята услуга');
});
