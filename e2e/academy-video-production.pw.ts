import { readFileSync } from 'node:fs';
import { test,expect } from '@playwright/test';
import { loadVideoProductionLessons } from '../scripts/prepare-video-production-assets.mjs';
import { prepareAcademyTheme } from './helpers/academy-theme-fixture';
import { assertLearningFits,assertLearningContrast } from './helpers/learning-contrast';
const rows=loadVideoProductionLessons();
const privateRows=process.env.VIDEO_PRODUCTION_PRIVATE?JSON.parse(readFileSync(process.env.VIDEO_PRODUCTION_PRIVATE,'utf8')):null;
test.setTimeout(90000);
for(const theme of ['light','dark'])for(const width of [320,1280]){
 test(`production workshop media, plan and price: ${theme} ${width}`,async({page},info)=>{
  await page.setViewportSize({width,height:950});await prepareAcademyTheme(page,theme,undefined,{anonymous:true,hasFullAccess:false});
  const errors:string[]=[],writes:string[]=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(['POST','PUT','PATCH'].includes(r.method()))writes.push(r.url());});
  await page.goto('/academy-labs/perfect-video/start?stage=script#client-production');
  const lab=page.getByRole('region',{name:'V-1: сценарий, камера, светлина и звук',exact:true});
  await expect(lab.getByRole('heading',{name:'Подготви това, което после ще монтираш'})).toBeVisible();
  await lab.getByLabel('Сценарна версия').selectOption('result');await expect(lab.getByLabel('Избран сценарен план').locator('li').first()).toContainText('Готова чаша');
  await lab.getByLabel('Сценарна версия').selectOption('delivery');await expect(lab.getByRole('status').first()).toContainText('непотвърдени');
  await assertLearningFits(page);await assertLearningContrast(lab);
  await lab.getByRole('button',{name:'3. Камера и кадър'}).click();const video=lab.getByLabel('Предоставен кадър за сравнение V-1');
  await expect(video).toHaveJSProperty('videoWidth',480);await expect(video).toHaveJSProperty('videoHeight',270);await expect(video).toHaveJSProperty('duration',9);
  await video.evaluate((v:HTMLVideoElement)=>v.play());await expect.poll(()=>video.evaluate((v:HTMLVideoElement)=>v.currentTime)).toBeGreaterThan(0);await video.evaluate((v:HTMLVideoElement)=>v.pause());
  for(const id of ['portrait','portrait-edge']){await lab.getByLabel('Действителен файл за кадъра').selectOption(id);await expect(video).toHaveJSProperty('videoWidth',152);await expect(video).toHaveJSProperty('videoHeight',270);}
  let pending=page.waitForEvent('download');await lab.getByRole('link',{name:'Изтегли избрания кадър'}).click();let file=await pending;expect(readFileSync((await file.path())!).subarray(4,8).toString()).toBe('ftyp');
  await assertLearningFits(page);await lab.screenshot({path:info.outputPath(`camera-${theme}-${width}.png`)});
  await lab.getByRole('button',{name:'4. Светлина и цвят'}).click();await lab.getByLabel('Светлинен план').selectOption('bounce');await expect(lab.getByRole('img')).toHaveAttribute('aria-label',/бял отражател/);
  await lab.getByLabel('Светлинен план').selectOption('mixed');await expect(lab.getByRole('img')).toHaveAttribute('aria-label',/друга лампа/);
  await assertLearningFits(page);await assertLearningContrast(lab);await lab.screenshot({path:info.outputPath(`light-${theme}-${width}.png`)});
  await lab.getByRole('button',{name:'5. Звук'}).click();
  for(const id of ['noise','room','clipped','filtered','neural']){await lab.getByRole('combobox',{name:/^Звуков вариант/}).selectOption(id);await expect.poll(()=>lab.getByLabel('Избран звуков вариант V-1').evaluate((a:HTMLAudioElement)=>a.duration)).toBeGreaterThan(6);}
  const sound=lab.getByLabel('Избран звуков вариант V-1');await expect(sound).toHaveAttribute('src',/voice-neural.mp3$/);await expect(lab.getByLabel('Референтен звук за сравнение V-1')).toHaveAttribute('src',/voice-noise.mp3$/);
  await sound.evaluate((a:HTMLAudioElement)=>a.play());await expect.poll(()=>sound.evaluate((a:HTMLAudioElement)=>a.currentTime)).toBeGreaterThan(0);await sound.evaluate((a:HTMLAudioElement)=>a.pause());
  pending=page.waitForEvent('download');await lab.getByRole('link',{name:'Изтегли избрания звуков пример'}).click();file=await pending;expect(readFileSync((await file.path())!).length).toBe(75501);
  await lab.getByRole('button',{name:'Добави предложение за заснемане'}).click();await expect(lab.getByLabel('Разчет с предложеното заснемане')).toContainText('260 €');await expect(lab.getByLabel('Разчет с предложеното заснемане')).toContainText('190 €');
  pending=page.waitForEvent('download');await lab.getByRole('button',{name:'Изтегли избрания снимачен план'}).click();file=await pending;const text=readFileSync((await file.path())!,'utf8');
  for(const term of ['260 €','190 €','Изместен вертикален изрез','Невронна обработка','Прозорец и друга лампа','Липсва потвърждение'])expect(text).toContain(term);
  await expect(lab.locator('input,textarea,[contenteditable]')).toHaveCount(0);await assertLearningFits(page);await assertLearningContrast(lab);expect(writes).toEqual([]);expect(errors).toEqual([]);
 });

 test(`independent changed-condition case with feedback and resume: ${theme} ${width}`,async({page},info)=>{
  const index=(theme==='dark'?2:0)+(width===1280?1:0),id=['pv02-20','pv03-21','pv04-17','pv05-08'][index];const l=rows.find(r=>r.lessonId===id),b=l.blocks.find(b=>b.key==='video_production_transfer_v1');
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
  await expect(page.getByRole('link',{name:'Продължи V-1: сценарий, камера, светлина и звук'})).toHaveAttribute('href',/stage=(script|camera|light|sound)#client-production$/);
  await expect(studio.locator('input,textarea,[contenteditable]')).toHaveCount(0);await assertLearningFits(page);await assertLearningContrast(studio);await studio.screenshot({path:info.outputPath(`case-${id}-${theme}-${width}.png`)});
 });
}
