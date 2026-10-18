import {readFileSync} from 'node:fs';
import {test,expect} from '@playwright/test';
import {loadPracticalSilkCandidates} from '../scripts/prepare-practical-silk-assets.mjs';
import {prepareAcademyTheme} from './helpers/academy-theme-fixture';
import {assertLearningFits,assertLearningContrast} from './helpers/learning-contrast';
const lessons=loadPracticalSilkCandidates('applied-20261018');
const privateRows=process.env.SILK_APPLIED_PRIVATE?JSON.parse(readFileSync(process.env.SILK_APPLIED_PRIVATE,'utf8')):null;
const checkpoint=l=>l.payload.additions.find(b=>b.type==='matching');
const answers=l=>privateRows?.find(r=>r.lesson===l.lesson)?.payload.additions.find(b=>b.type==='matching').evaluation.matches||Object.fromEntries(checkpoint(l).content.left.map(s=>[s.id,s.choices[0]]));
test.setTimeout(90000);
for(const theme of ['light','dark'])for(const width of [320,1280])test(`new case, feedback and evidence: ${theme}, ${width}px`,async({page},info)=>{
 await page.setViewportSize({width,height:950});const l=lessons.find(l=>l.lesson==='l01-04'),b=checkpoint(l),map=answers(l);
 const requests=await prepareAcademyTheme(page,theme,{blocks:[{...b,id:'00000000-0000-4000-8000-000000000088',position:0}],title:b.title,objective:l.payload.amendments[0].content.body,matchingExpected:map,matchingFeedback:b.content.left.map(s=>({slot:s.id,label:s.text,success:'Решението следва конкретното условие.',retry:'Провери посочения ред в предоставения материал.'}))},{anonymous:true,hasFullAccess:false});
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/module/s01-m01?lesson=l01-04');const studio=page.getByTestId('closed-practice-studio');await expect(studio).toBeVisible();
 await studio.getByRole('button',{name:'Еднаква проба',exact:true}).click();await expect(studio.getByRole('region',{name:'Таблица: Еднаква проба'})).toContainText('48 минути');
 expect(await studio.locator('input,textarea,[contenteditable="true"]').count()).toBe(0);
 for(const slot of b.content.left)await studio.getByRole('combobox',{name:slot.text,exact:true}).selectOption(map[slot.id]);
 const slot=b.content.left[0];await studio.getByRole('combobox',{name:slot.text,exact:true}).selectOption(slot.choices.find(id=>id!==map[slot.id]));await studio.getByRole('button',{name:'Провери решенията'}).click();await expect(page.getByText('Провери посочения ред в предоставения материал.',{exact:true})).toBeVisible();
 await studio.getByRole('combobox',{name:slot.text,exact:true}).selectOption(map[slot.id]);await assertLearningFits(page);await assertLearningContrast(studio);
 await studio.getByRole('button',{name:'Запази вариант за сравнение'}).click();await expect(studio.getByRole('status')).toContainText('запазен');
 await studio.getByRole('button',{name:'Провери решенията'}).click();await expect(studio.getByRole('button',{name:'Практиката е премината'})).toBeVisible();
 await page.screenshot({path:info.outputPath(`silk-transfer-${theme}-${width}.png`),fullPage:true});expect(errors).toEqual([]);expect(requests.academy_autosave_lesson||0).toBe(0);
});
test('the tool demonstration can create, inspect, repeat, refuse and reset a draft on mobile',async({page},info)=>{
 await page.setViewportSize({width:320,height:950});const l=lessons.find(l=>l.lesson==='l01-04'),b=l.payload.additions.find(b=>b.type==='rich_text');
 await prepareAcademyTheme(page,'light',{blocks:[{...b,id:'00000000-0000-4000-8000-000000000088',position:0}],title:b.title},{anonymous:true,hasFullAccess:false});await page.goto('/module/s01-m01?lesson=l01-04');const queue=page.getByRole('region',{name:'Учебна опашка за чернови'});await expect(queue).toBeVisible();
 for(const name of ['Прочети О-2','Създай D-41','Провери D-41','Повтори със същия ключ','Опитай изпращане'])await queue.getByRole('button',{name,exact:true}).click();
 await expect(queue.getByRole('list')).toContainText('остават 1');await expect(queue.getByRole('list')).toContainText('denied');await assertLearningFits(page);await assertLearningContrast(queue);
 await page.screenshot({path:info.outputPath('silk-tool-light-320.png'),fullPage:true});await queue.getByRole('button',{name:'Изчисти учебната опашка'}).click();await expect(queue.getByRole('list').getByRole('listitem')).toHaveCount(0);
});
test('the supplied video fragments load locally and remain inside the mobile page',async({page},info)=>{
 await page.setViewportSize({width:320,height:950});const l=lessons.find(l=>l.lesson==='l05-06'),b=l.payload.additions.find(b=>b.type==='rich_text');
 await prepareAcademyTheme(page,'dark',{blocks:[{...b,id:'00000000-0000-4000-8000-000000000088',position:0}],title:b.title});await page.goto('/module/s01-m05?lesson=l05-06');
 const video=page.getByLabel('Учебен фрагмент: Начало · 0–5 сек.');await expect(video).toBeVisible();await expect.poll(()=>video.evaluate((el:HTMLVideoElement)=>el.readyState)).toBeGreaterThanOrEqual(1);
 await page.getByRole('button',{name:'Край · 25–31 сек.',exact:true}).click();const end=page.getByLabel('Учебен фрагмент: Край · 25–31 сек.');await expect.poll(()=>end.evaluate((el:HTMLVideoElement)=>el.currentTime)).toBeGreaterThanOrEqual(25);
 await assertLearningFits(page);await page.screenshot({path:info.outputPath('silk-video-dark-320.png'),fullPage:true});
});
