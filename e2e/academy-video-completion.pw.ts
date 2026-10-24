import { readFileSync } from 'node:fs';
import { test,expect } from '@playwright/test';
import { loadVideoCompletionLessons } from '../scripts/prepare-video-completion-assets.mjs';
import { prepareAcademyTheme } from './helpers/academy-theme-fixture';
import { assertLearningFits,assertLearningContrast } from './helpers/learning-contrast';
const rows=loadVideoCompletionLessons();
const privateRows=process.env.VIDEO_COMPLETION_PRIVATE?JSON.parse(readFileSync(process.env.VIDEO_COMPLETION_PRIVATE,'utf8')):null;
test.setTimeout(90000);
for(const [i,id] of ['pv11-16','pv12-08','pv13-18','pv14-18','pv15-13'].entries()){
 const theme=i%2?'dark':'light',width=i%2?1280:320;
 test(`independent changed-condition case ${id} with feedback and resume: ${theme} ${width}`,async({page},info)=>{
  const l=rows.find(r=>r.lessonId===id),b=l.blocks.find(b=>b.key==='video_production_transfer_v1');
  const privateBlock=privateRows?.find(r=>r.lessonId===id).payload.blocks.find(b=>b.key==='video_production_transfer_v1');const map=privateBlock?.answer_key.matches||Object.fromEntries(b.content.left.map(s=>[s.id,s.choices[0]]));
  await page.setViewportSize({width,height:950});await prepareAcademyTheme(page,theme,{title:l.title,objective:l.objective,blocks:[{...b,id:'00000000-0000-4000-8000-000000000088',position:0}],matchingExpected:map,matchingFeedback:b.content.left.map(s=>({slot:s.id,label:s.text,success:'Изборът следва от предоставените условия.',retry:'Свери точното условие за тази част.'}))});
  await page.goto(`/module/${l.moduleId}?lesson=${id}`);const studio=page.getByTestId('closed-practice-studio');await expect(studio).toBeVisible();
  await expect(studio.getByText(b.content.studio.change,{exact:true})).toHaveCount(0);
  for(const slot of b.content.left)await studio.getByRole('combobox',{name:slot.text,exact:true}).selectOption(map[slot.id]);
  await expect(studio.getByText(b.content.studio.change,{exact:true})).toBeVisible();
  const first=b.content.left[0];await studio.getByRole('combobox',{name:first.text,exact:true}).selectOption(first.choices.find(c=>c!==map[first.id]));
  await studio.getByRole('button',{name:'Провери решенията',exact:true}).click();await expect(page.getByText('Свери точното условие за тази част.',{exact:true})).toBeVisible();
  await studio.getByRole('combobox',{name:first.text,exact:true}).selectOption(map[first.id]);await studio.getByRole('button',{name:'Провери решенията',exact:true}).click();await expect(studio.getByRole('button',{name:'Практиката е премината'})).toBeDisabled();
  await page.reload();for(const slot of b.content.left)await expect(studio.getByRole('combobox',{name:slot.text,exact:true})).toHaveValue(map[slot.id]);
  await expect(page.getByRole('link',{name:'Завърши V-1: отчет, цена, приемане и портфолио'})).toHaveAttribute('href',/completion=(report|ai|quote|revision|portfolio)#client-completion$/);
  await expect(studio.locator('input,textarea,[contenteditable]')).toHaveCount(0);await assertLearningFits(page);await assertLearningContrast(studio);await studio.screenshot({path:info.outputPath(`case-${id}-${theme}-${width}.png`)});
 });
}
for(const theme of ['light','dark'])for(const width of [320,1280])test(`completion workshop, media, payment and downloads: ${theme} ${width}`,async({page},info)=>{
 await page.setViewportSize({width,height:950});await prepareAcademyTheme(page,theme,undefined,{anonymous:true,hasFullAccess:false});
 const errors:string[]=[],writes:string[]=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(['POST','PUT','PATCH'].includes(r.method()))writes.push(r.url());});
 await page.goto('/academy-labs/perfect-video/start?completion=report#client-completion');const lab=page.getByRole('region',{name:'Приключване на поръчка V-1'});await expect(lab).toBeVisible();
 await lab.getByLabel('Извод от учебния отчет').selectOption('bounded');
 await lab.getByRole('button',{name:'12. ИИ и общ труд'}).click();await lab.getByLabel('Маршрут за надписи').selectOption('slow');await expect(lab.getByLabel('Сравнение на общия труд')).toContainText('2 минути повече');await lab.getByLabel('Маршрут за надписи').selectOption('fast');await expect(lab.getByLabel('Сравнение на общия труд')).toContainText('Спестени 10');
 await lab.getByRole('button',{name:'13. Обхват и цена'}).click();await lab.getByLabel('Допълнителна работа').selectOption('unquoted');await expect(lab.getByLabel('Финален разчет')).toContainText('Разлика 0 €');await lab.getByLabel('Допълнителна работа').selectOption('agreed');await expect(lab.getByLabel('Финален разчет')).toContainText('Разлика 50 €');
 await lab.getByRole('button',{name:'14. Корекция и приемане'}).click();await lab.getByLabel('Надписи за текущата версия').selectOption('verified');await lab.getByLabel('Запис за приемане').selectOption('accepted');
 const video=lab.getByLabel('Проверка на финалния учебен монтаж');await expect(video).toHaveJSProperty('videoWidth',360);await expect(video).toHaveJSProperty('duration',16);await video.evaluate((v:HTMLVideoElement)=>v.play());await expect.poll(()=>video.evaluate((v:HTMLVideoElement)=>v.currentTime)).toBeGreaterThan(0);await video.evaluate((v:HTMLVideoElement)=>v.pause());
 let pending=page.waitForEvent('download');await lab.getByRole('button',{name:'Изтегли избраните субтитри'}).click();let d=await pending;expect(readFileSync((await d.path())!,'utf8')).toContain('Получаване на място');
 await lab.getByRole('button',{name:'15. Доставка и портфолио'}).click();await lab.getByLabel('Представяне на работата').selectOption('honest');await lab.getByLabel('Запис за плащане').selectOption('base');await expect(lab.getByLabel('Проверка на приключването')).toContainText('Избраните учебни условия са съвместими');await expect(lab).toContainText('Остатък по учебната цена: 50 €');
 for(const [label,expected] of [['Опис за предаване','Цена по учебния сценарий: 210 €'],['Вътрешно досие и разчет','Разлика 50 €'],['Описание за портфолио','Учебен монтаж']] as const){pending=page.waitForEvent('download');await lab.getByRole('button',{name:`Изтегли: ${label}`,exact:true}).click();d=await pending;const body=readFileSync((await d.path())!,'utf8');expect(body).toContain(expected);if(label==='Опис за предаване')expect(body).not.toContain('Вътрешен разчет');}
 pending=page.waitForEvent('download');await lab.getByRole('link',{name:'Изтегли предоставения MP4'}).click();d=await pending;expect(readFileSync((await d.path())!).subarray(4,8).toString()).toBe('ftyp');
 await assertLearningFits(page);await assertLearningContrast(lab);await lab.screenshot({path:info.outputPath(`completion-${theme}-${width}.png`)});
 await lab.getByRole('button',{name:'14. Корекция и приемане'}).click();await lab.getByLabel('Надписи за текущата версия').selectOption('delivery');await expect(lab.getByLabel('Запис за приемане')).toHaveValue('pending');await expect(lab.getByLabel('Проверка на приключването')).toContainText('160 € само в учебния журнал');
 await expect(lab.locator('input,textarea,[contenteditable]')).toHaveCount(0);expect(errors).toEqual([]);expect(writes).toEqual([]);
});
