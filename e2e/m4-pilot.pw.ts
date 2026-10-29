import { test, expect, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';

const base='/academy-labs/silk-road/m04-pilot-20261029/workbook.html';
async function stage(page:Page,n:number){await page.locator(`[data-stage="${n}"]`).click();}
async function download(page:Page,id:string){const event=page.waitForEvent('download');await page.locator('#'+id).click();const path=await(await event).path();if(!path)throw new Error('Missing download');return{path,text:await readFile(path,'utf8')};}
async function fill(page:Page,data:Record<string,string>){for(const[id,value]of Object.entries(data))await page.locator('#'+id).fill(value);}

test('ten content stages fit a small screen without exposing private readings',async({page})=>{
 await page.setViewportSize({width:320,height:800});await page.goto(base);
 await expect(page.locator('[data-stage]')).toHaveCount(10);
 for(let n=1;n<=10;n++){await stage(page,n);await expect(page.locator('#stage-'+n)).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);}
 await expect(page.locator('body')).not.toContainText('Одобрен източник КД-1');
});

test('first attempt and current authored text survive HTML download in a fresh context',async({page,browser})=>{
 await page.goto(base);await stage(page,2);
 const hostile='</script><script>window.injected=true</script><img src=x onerror="window.injected=true">';
 await fill(page,{pageText:'Първи собствен текст',attemptNote:'Преди помощ'});await page.locator('#snapshot').click();
 await page.locator('#pageText').fill(hostile);await page.locator('#buildPreview').click();
 expect(await page.evaluate(()=> 'injected' in window)).toBe(false);
 const saved=await download(page,'saveCopy'),context=await browser.newContext(),p=await context.newPage();
 await p.route('**/m4-restored.html',r=>r.fulfill({contentType:'text/html; charset=utf-8',body:saved.text}));await p.goto('http://127.0.0.1:5180/m4-restored.html');
 await expect(p.locator('#pageText')).toHaveValue(hostile);await expect(p.locator('#history')).toContainText('Първи собствен текст');await expect(p.locator('#history')).toContainText('Преди помощ');
 expect(await p.evaluate(()=> 'injected' in window)).toBe(false);await expect(p.locator('[data-stage]')).toHaveCount(10);await expect(p.locator('#checks .result')).toHaveCount(0);
 const evidence=await download(p,'exportEvidence');expect(evidence.text).toContain('Първи собствен текст');expect(evidence.text).toContain(hostile);await context.close();
});

test('reviewed M3 import copies only supported text and an invalid M4 leaves current work intact',async({page})=>{
 await page.goto(base);await stage(page,5);await page.locator('#suppression').fill('STOP-1');
 await page.locator('header details summary').click();
 const fields={source:'Мой източник',description:'Мой текст',price:'Цена',scope:'Обхват',process:'Процес',next:'Действие',contentBrief:'Задание',contentDraft:'Начало на статия',ignored:'Чуждо поле'};
 await page.locator('#importFile').setInputFiles({name:'m3.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({edition:'tavora-seo-workbook-20261028',fields}))});
 await expect(page.locator('#applyImport')).toBeEnabled();await stage(page,2);await expect(page.locator('#pageText')).toHaveValue('');await page.locator('#applyImport').click();await expect(page.locator('#pageText')).toHaveValue('Мой текст');
 await stage(page,5);await expect(page.locator('#suppression')).toHaveValue('STOP-1');
 const backup=JSON.parse((await download(page,'exportJson')).text);expect(backup.fields.ignored).toBeUndefined();backup.fields.unknown='bad';
 await page.locator('#importFile').setInputFiles({name:'invalid.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(backup))});await expect(page.locator('#applyImport')).toBeDisabled();await expect(page.locator('#suppression')).toHaveValue('STOP-1');
});

test('withdrawal stays excluded after an old active audience is re-entered',async({page})=>{
 await page.goto(base);await stage(page,5);await page.locator('#audience').fill('C-1 | yes | active\nC-2 | yes | withdrawn\nC-3 | unknown | active');
 await page.locator('#filterAudience').click();await expect(page.locator('#audienceResult')).toContainText('Допуснати по учебното правило: C-1');
 await page.locator('#suppression').fill('C-1');await page.locator('#filterAudience').click();await expect(page.locator('#audienceResult')).toContainText('Допуснати по учебното правило: няма');
 await page.locator('#audience').fill('C-1 | yes | active');await page.locator('#filterAudience').click();await expect(page.locator('#audienceResult')).toContainText('Допуснати по учебното правило: няма');
 await page.locator('#audience').fill('C-1 | yes | active\nc-1 | no | active');await page.locator('#filterAudience').click();await expect(page.locator('#audienceResult')).toContainText('повторен ред');
});

test('budget includes reserve and production metrics update rejected output and total time',async({page})=>{
 await page.goto(base);await fill(page,{budget:'300',p1_name:'Изработка и преглед',p1_minutes:'270',p2_name:'Резерв',p2_minutes:'30'});await page.locator('#calculatePlan').click();await expect(page.locator('#planResult')).toContainText('Остават 0');
 await page.locator('#p1_minutes').fill('280');await page.locator('#calculatePlan').click();await expect(page.locator('#planResult')).toContainText('Превишение 10');
 await stage(page,10);await fill(page,{criteria:'Приети по еднакъв критерий',m1_name:'Р',m1_period:'Седмица 1',m1_minutes:'150',m1_accepted:'6',m2_name:'С',m2_period:'Седмица 1',m2_minutes:'100',m2_accepted:'5'});await page.locator('#comparable').check();await page.locator('#calculateMetrics').click();await expect(page.locator('#metricResult')).toContainText('Р: 25 мин/приет; 2,4 приети/час');await expect(page.locator('#metricResult')).toContainText('С: 20 мин/приет; 3 приети/час');
 await fill(page,{m2_minutes:'120',m2_accepted:'3'});await page.locator('#calculateMetrics').click();await expect(page.locator('#metricResult')).toContainText('С: 40 мин/приет; 1,5 приети/час');
 await page.locator('#m2_accepted').fill('0');await page.locator('#calculateMetrics').click();await expect(page.locator('#metricResult')).toContainText('неопределени минути/приет; 0 приети/час');await page.locator('#m2_period').fill('Друг период');await page.locator('#calculateMetrics').click();await expect(page.locator('#metricResult')).toContainText('Сравнението е спряно');
});

test('SVG export keeps authored text inert and refuses overflow rather than dropping terms',async({page})=>{
 await page.goto(base);await stage(page,6);await fill(page,{card1_title:'Моята услуга',card1_body:'<script>window.injected=true</script>',card1_terms:'Условие за потвърждение',card1_action:'Прочети условията',altText:'Учебна текстова картичка'});
 await page.locator('#previewCard').click();await expect(page.locator('#cardPreview svg')).toHaveCount(1);await expect(page.locator('#cardPreview script')).toHaveCount(0);expect(await page.evaluate(()=> 'injected' in window)).toBe(false);
 const svg=(await download(page,'downloadCard')).text;expect(svg).toContain('&lt;script&gt;');expect(svg).toContain('Условие за потвърждение');
 await page.locator('#card1_body').fill('Твърде дълъг текст '.repeat(250));await page.locator('#previewCard').click();await expect(page.locator('#cardResult')).toContainText('не се побира');await expect(page.locator('#cardPreview svg')).toHaveCount(0);
});

test('captions export real WebVTT timing and reject overlap and missing content',async({page})=>{
 await page.goto(base);await stage(page,7);await page.locator('#cues').fill('0 | 4.5 | Собствен надпис\n4.5 | 9 | Следваща стъпка');
 const vtt=(await download(page,'downloadCues')).text;expect(vtt).toContain('WEBVTT');expect(vtt).toContain('00:00:00.000 --> 00:00:04.500');expect(vtt).toContain('Следваща стъпка');await expect(page.locator('#cueResult')).toContainText('Няма избрано видео');
 await page.locator('#cues').fill('0 | 5 | Начало\n4 | 8 | Припокриване');await page.locator('#checkCues').click();await expect(page.locator('#cueResult')).toContainText('Ред 2');await page.locator('#cues').fill('0 | 4 |');await page.locator('#checkCues').click();await expect(page.locator('#cueResult')).toContainText('Ред 1');
});

test('local video metadata bounds captions and backup does not embed media',async({page})=>{
 await page.goto(base);await stage(page,7);
 const fixture=Buffer.from(await readFile('e2e/fixtures/m4-demo.webm.base64','utf8'),'base64');
 await page.locator('#videoFile').setInputFiles({name:'own-demo.webm',mimeType:'video/webm',buffer:fixture});
 await expect(page.locator('#videoStatus')).toContainText('Отворен локално: own-demo.webm');
 await page.locator('#cues').fill('0 | 100 | Прекалено дълго');await page.locator('#checkCues').click();await expect(page.locator('#cueResult')).toContainText('след края');
 await page.locator('#cues').fill('0 | 1 | Собствен надпис');await page.locator('#applyCues').click();await expect(page.locator('#videoPreview track')).toHaveCount(1);
 await page.locator('#cues').fill('0 | 1.5 | Поправен надпис');await expect(page.locator('#videoPreview track')).toHaveCount(0);await page.locator('#applyCues').click();await expect(page.locator('#videoPreview track')).toHaveCount(1);
 const saved=(await download(page,'saveCopy')).text;expect(saved).not.toMatch(/<video[^>]*src="blob:/);expect(saved).not.toMatch(/<track[^>]*src="blob:/);
 const backup=JSON.parse((await download(page,'exportJson')).text);expect(Object.keys(backup)).not.toContain('video');
});

test('UTM construction needs a human privacy review and changes invalidate checks',async({page})=>{
 await page.goto(base);await stage(page,9);await fill(page,{url:'https://example.invalid/service',utmSource:'newsletter',utmMedium:'email',utmCampaign:'autumn_offer'});await page.locator('#buildUtm').click();await expect(page.locator('#utmResult')).toContainText('Нужен е собствен преглед');await page.locator('#utmReview').check();await page.locator('#buildUtm').click();await expect(page.locator('#utmResult')).toContainText('utm_source=newsletter&utm_medium=email&utm_campaign=autumn_offer');
 await page.locator('#url').fill('javascript:alert(1)');await page.locator('#buildUtm').click();await expect(page.locator('#utmResult')).not.toContainText('Сглобено локално');await page.locator('#runChecks').click();await expect(page.locator('#checks .result')).toHaveCount(6);await page.locator('#utmCampaign').fill('changed');await expect(page.locator('#checks .result')).toHaveCount(0);
});
