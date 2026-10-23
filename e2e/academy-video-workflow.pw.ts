import { readFileSync } from 'node:fs';
import { test,expect } from '@playwright/test';
import { loadVideoWorkflowLessons } from '../scripts/prepare-video-workflow-assets.mjs';
import { prepareAcademyTheme } from './helpers/academy-theme-fixture';
import { assertLearningFits,assertLearningContrast } from './helpers/learning-contrast';
const rows=loadVideoWorkflowLessons();
const privateRows=process.env.VIDEO_WORKFLOW_PRIVATE?JSON.parse(readFileSync(process.env.VIDEO_WORKFLOW_PRIVATE,'utf8')):null;
test.setTimeout(90000);
for(const [i,id] of ['pv06-18','pv07-16','pv08-16','pv09-12','pv10-16'].entries()){
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
  await expect(page.getByRole('link',{name:'Продължи V-1: от подготовка до предаване'})).toHaveAttribute('href',/workflow=(plan|shoot|archive|edit|deliver)#client-workflow$/);
  await expect(studio.locator('input,textarea,[contenteditable]')).toHaveCount(0);await assertLearningFits(page);await assertLearningContrast(studio);await studio.screenshot({path:info.outputPath(`case-${id}-${theme}-${width}.png`)});
 });
}
for(const theme of ['light','dark'])for(const width of [320,1280])test(`workflow choices, media and dossier: ${theme} ${width}`,async({page},info)=>{
 await page.setViewportSize({width,height:950});await prepareAcademyTheme(page,theme,undefined,{anonymous:true,hasFullAccess:false});
 const errors:string[]=[],writes:string[]=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(['POST','PUT','PATCH'].includes(r.method()))writes.push(r.url());});
 await page.goto('/academy-labs/perfect-video/start?workflow=archive#client-workflow');const lab=page.getByRole('region',{name:'Работен процес V-1'});await expect(lab).toBeVisible();
 await lab.getByLabel('Състояние на копията').selectOption('verified');
 await lab.getByRole('button',{name:'6. Подготовка'}).click();await lab.getByLabel('Условия за начало').selectOption('approved');
 await lab.getByRole('button',{name:'7. Приемане на кадрите'}).click();await lab.getByLabel('Получен опис на кадрите').selectOption('complete');
 await lab.getByRole('button',{name:'9. Монтаж и износ'}).click();await lab.getByLabel('Монтаж за проверка').selectOption('process');
 const video=lab.getByLabel('Монтажен износ V-1');await expect(video).toHaveJSProperty('videoWidth',360);await expect(video).toHaveJSProperty('videoHeight',640);await expect(video).toHaveJSProperty('duration',16);
 await video.evaluate((v:HTMLVideoElement)=>v.play());await expect.poll(()=>video.evaluate((v:HTMLVideoElement)=>v.currentTime)).toBeGreaterThan(0);await video.evaluate((v:HTMLVideoElement)=>v.pause());
 let pending=page.waitForEvent('download');await lab.getByRole('link',{name:'Изтегли този MP4'}).click();let download=await pending;expect(readFileSync((await download.path())!).subarray(4,8).toString()).toBe('ftyp');
 await lab.getByRole('button',{name:'10. Предаване'}).click();await lab.getByLabel('Субтитри към пакета').selectOption('verified');await lab.getByLabel('Допълнителна работа по монтажа').selectOption('agreed');await lab.getByLabel('Статус в учебния журнал').selectOption('accepted');
 await expect(lab.getByLabel('Проверка на работния процес')).toContainText('Условията в избрания учебен вариант са съвместими');
 await expect(lab.getByLabel('Разчет за монтажа')).toContainText('210 €');
 pending=page.waitForEvent('download');await lab.getByRole('button',{name:'Изтегли този SRT'}).click();download=await pending;expect(readFileSync((await download.path())!,'utf8')).toContain('Получаване на място');
 pending=page.waitForEvent('download');await lab.getByRole('button',{name:'Изтегли избраното досие'}).click();download=await pending;const dossier=readFileSync((await download.path())!,'utf8');for(const text of ['210 €','160 €','без звук','Отделен носител','не са включени'])expect(dossier).toContain(text);
 await lab.getByLabel('Субтитри към пакета').selectOption('delivery');await expect(lab.getByLabel('Проверка на работния процес')).toContainText('непотвърдена доставка');await expect(lab.getByLabel('Статус в учебния журнал')).toHaveValue('pending');
 await expect(lab.locator('input,textarea,[contenteditable]')).toHaveCount(0);await assertLearningFits(page);await assertLearningContrast(lab);await lab.screenshot({path:info.outputPath(`workflow-${theme}-${width}.png`)});expect(errors).toEqual([]);expect(writes).toEqual([]);
});
