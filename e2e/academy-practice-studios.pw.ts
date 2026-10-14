import { test, expect } from '@playwright/test';
import { loadPracticalCandidates } from '../scripts/prepare-practical-video-assets.mjs';
const candidates = loadPracticalCandidates();
import { prepareAcademyTheme, selectTheme } from './helpers/academy-theme-fixture';
import { assertLearningFits, assertLearningContrast } from './helpers/learning-contrast';

test.setTimeout(90000);

for(const theme of ['light','dark']) for(const width of [320,1280]) {
  test(`${theme} ${width}px: closed studio saves choices, requires correction and resumes`,async({page},info)=>{
    const l=candidates.find(l=>l.lesson==='pv01-17')!;
    const synthetic=Object.fromEntries(l.practice.content.left.map(slot=>[slot.id,slot.choices[0]]));
    await page.setViewportSize({width,height:900});
    await prepareAcademyTheme(page,theme,{title:l.title,blocks:[{...l.practice,id:'00000000-0000-4000-8000-000000000088',position:0}],matchingExpected:synthetic});
    const payloads:unknown[]=[];page.on('request',r=>{if(r.url().includes('academy_complete_lesson_block')) payloads.push(r.postDataJSON().p_payload);});
    await page.goto(`/module/${l.module}?lesson=${l.lesson}`);
    const studio=page.getByTestId('closed-practice-studio');await expect(studio).toBeVisible({timeout:30000});
    await expect(studio.locator('textarea,input')).toHaveCount(0);
    await expect(studio.getByRole('button',{name:'Провери решенията'})).toBeDisabled();
    for(const slot of l.practice.content.left) await studio.getByRole('combobox',{name:slot.text,exact:true}).selectOption(synthetic[slot.id]);
    const first=l.practice.content.left[0],wrong=first.choices[1];
    await studio.getByRole('combobox',{name:first.text,exact:true}).selectOption(wrong);
    await studio.getByRole('button',{name:'Провери решенията'}).click();
    await expect(page.getByText('Пробният избор изисква поправка.')).toBeVisible();
    await studio.getByRole('combobox',{name:first.text,exact:true}).selectOption(synthetic[first.id]);
    await selectTheme(page,theme==='light'?'Тъмна':'Светла');
    for(const slot of l.practice.content.left) await expect(studio.getByRole('combobox',{name:slot.text,exact:true})).toHaveValue(synthetic[slot.id]);
    await studio.getByRole('button',{name:'Провери решенията'}).click();
    await expect(studio.getByRole('button',{name:'Практиката е премината'})).toBeDisabled();
    expect(payloads).toEqual([{matches:{...synthetic,[first.id]:wrong}},{matches:synthetic}]);
    await page.reload();await expect(studio).toBeVisible({timeout:30000});
    for(const slot of l.practice.content.left) await expect(studio.getByRole('combobox',{name:slot.text,exact:true})).toHaveValue(synthetic[slot.id]);
    await assertLearningFits(page);await assertLearningContrast(studio);
    await page.screenshot({path:info.outputPath(`studio-${theme}-${width}.png`),fullPage:true});
  });
}
test('source video really plays the selected fragments and survives theme changes',async({page},info)=>{
  const l=candidates.find(l=>l.lesson==='pv01-01')!;
  await prepareAcademyTheme(page,'light',{title:l.title,blocks:[{...l.practice,id:'00000000-0000-4000-8000-000000000088',position:0}]});
  await page.goto(`/module/${l.module}?lesson=${l.lesson}`);
  const studio=page.getByTestId('closed-practice-studio');
  const slots=l.practice.content.left.filter(slot=>slot.preview);
  for(const [i,slot] of slots.entries()) {
    const option=l.practice.content.right.find(c=>slot.choices.includes(c.id)&&'preview' in c&&(c.preview as {clip?:number[]})?.clip?.[0]===[26,0,16,10][i])!;
    await studio.getByRole('combobox',{name:slot.text,exact:true}).selectOption(option.id);
  }
  const video=studio.locator('video');
  await studio.getByRole('button',{name:'Прегледай подредбата'}).click();
  await expect.poll(()=>video.evaluate((v:HTMLVideoElement)=>v.currentTime)).toBeGreaterThan(26);
  await expect.poll(()=>video.evaluate((v:HTMLVideoElement)=>v.paused)).toBe(false);
  await selectTheme(page,'Тъмна');
  await expect.poll(()=>video.evaluate((v:HTMLVideoElement)=>v.paused)).toBe(false);
  await expect.poll(()=>video.evaluate((v:HTMLVideoElement)=>v.currentTime)).toBeLessThan(10);
  await studio.getByRole('button',{name:'Пауза',exact:true}).click();
  await expect.poll(()=>video.evaluate((v:HTMLVideoElement)=>v.paused)).toBe(true);
  await page.screenshot({path:info.outputPath('assembled-source-video.png'),fullPage:true});
});
for(const id of ['pv03-08','pv04-09','pv04-01','pv05-03']) test(`${id}: actual crop, colour, diagram or sound changes with the saved choice`,async({page},info)=>{
  const l=candidates.find(l=>l.lesson===id)!;
  await prepareAcademyTheme(page,'dark',{title:l.title,blocks:[{...l.practice,id:'00000000-0000-4000-8000-000000000088',position:0}]});
  await page.goto(`/module/${l.module}?lesson=${l.lesson}`);
  const studio=page.getByTestId('closed-practice-studio'),slot=l.practice.content.left[0];
  const select=studio.getByRole('combobox',{name:slot.text,exact:true});
  const snapshots:string[]=[];
  for(const choice of slot.choices) {
    await select.selectOption(choice);
    const preview=studio.getByRole('region',{name:'Резултат от изборите'});
    snapshots.push(await preview.evaluate(el=>el.innerHTML));
    const audio=studio.locator('audio');
    if(await audio.count()) {
      await audio.evaluate((a:HTMLAudioElement)=>a.play());
      await expect.poll(()=>audio.evaluate((a:HTMLAudioElement)=>a.currentTime)).toBeGreaterThan(0);
      await audio.evaluate((a:HTMLAudioElement)=>a.pause());
    }
  }
  expect(new Set(snapshots).size).toBe(slot.choices.length);
  await selectTheme(page,'Светла');await expect(select).toHaveValue(slot.choices.at(-1)!);
  await assertLearningFits(page);await assertLearningContrast(studio);
  await page.screenshot({path:info.outputPath(`preview-${id}.png`),fullPage:true});
});
