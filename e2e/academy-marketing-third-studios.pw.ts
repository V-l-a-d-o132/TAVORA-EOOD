import { readFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { test, expect, type Page } from '@playwright/test';
import { loadThirdPracticalMarketingCandidates } from '../scripts/prepare-third-practical-marketing-assets.mjs';
import { prepareAcademyTheme } from './helpers/academy-theme-fixture';
import { assertLearningFits, assertLearningContrast } from './helpers/learning-contrast';
const lessons=loadThirdPracticalMarketingCandidates();
const find=(id:string)=>lessons.find(l=>l.lesson===id)!;
const privateRows=process.env.MARKETING_THIRD_PRIVATE_CANDIDATES?JSON.parse(readFileSync(process.env.MARKETING_THIRD_PRIVATE_CANDIDATES,'utf8')):null;
const expected=(l:typeof lessons[number])=>privateRows?.find(row=>row.lesson===l.lesson)?.payload.practice.evaluation.matches||Object.fromEntries(l.practice.content.left.map(slot=>[slot.id,slot.choices[0]]));
async function open(page:Page,id:string,theme:string,width:number){
  const l=find(id),answers=expected(l),details=privateRows?.find(row=>row.lesson===id)?.payload.practice.feedback.details;
  await page.setViewportSize({width,height:950});
  await prepareAcademyTheme(page,theme,{title:l.title,objective:l.opening.body,blocks:[{...l.practice,id:'00000000-0000-4000-8000-000000000088',position:0}],matchingExpected:answers,matchingFeedback:l.practice.content.left.map(slot=>({slot:slot.id,label:slot.text,success:details?.[slot.id].success||'Успешна учебна част.',retry:details?.[slot.id].retry||'Свери тази част с условието.'}))});
  await page.goto(`/module/${l.module}?lesson=${l.lesson}`);
  const studio=page.getByTestId('closed-practice-studio');await expect(studio).toBeVisible({timeout:30000});
  return {l,answers,details,studio};
}
test.setTimeout(90000);

for(const theme of ['light','dark'])for(const width of [320,1280])test(`${theme} ${width}px: price history changes a message; feedback, resume and export preserve the case`,async({page},info)=>{
  const {l,answers,details,studio}=await open(page,'lm15-03',theme,width);
  const submitted:unknown[]=[];page.on('request',r=>{if(r.url().includes('academy_complete_lesson_block'))submitted.push(r.postDataJSON().p_payload);});
  await expect(studio.getByText(l.practice.content.studio.change,{exact:true})).toHaveCount(0);
  const alternatives=studio.locator('details').first();await alternatives.getByText('Прочети трите варианта').click();await expect(alternatives.getByRole('listitem')).toHaveCount(3);
  for(const slot of l.practice.content.left)await studio.getByRole('combobox',{name:slot.text,exact:true}).selectOption(answers[slot.id]);
  const message=studio.getByRole('article',{name:'Съобщение от избраните части'});
  if(privateRows){await expect(message).toContainText('Предишна цена 57 €');await expect(message).toContainText('доставка отделно 4 €');await expect(message).not.toContainText('намаление 10%');}
  await expect(studio.locator('input,textarea')).toHaveCount(0);
  const first=l.practice.content.left[0],wrong=first.choices.find(id=>id!==answers[first.id])!;
  await studio.getByRole('combobox',{name:first.text,exact:true}).selectOption(wrong);
  await studio.getByRole('button',{name:'Провери решенията'}).click();
  const breakdown=page.getByRole('list',{name:'Разбор на решенията'});
  await expect(breakdown.getByText('Нуждае се от поправка',{exact:true})).toHaveCount(1);
  await expect(breakdown).toContainText(details?.[first.id].retry||'Свери тази част с условието.');
  await studio.getByRole('combobox',{name:first.text,exact:true}).selectOption(answers[first.id]);
  await studio.getByRole('button',{name:'Провери решенията'}).click();await expect(studio.getByRole('button',{name:'Практиката е премината'})).toBeDisabled();
  await page.reload();for(const slot of l.practice.content.left)await expect(studio.getByRole('combobox',{name:slot.text,exact:true})).toHaveValue(answers[slot.id]);
  const downloading=page.waitForEvent('download');await studio.getByRole('button',{name:'Изтегли избраните решения'}).click();
  const downloaded=await downloading,text=await readFile((await downloaded.path())!,'utf8');expect(text).toContain(l.practice.content.studio.change);for(const id of Object.values(answers))expect(text).not.toContain(id);
  expect(submitted).toEqual([{matches:{...answers,[first.id]:wrong}},{matches:answers}]);
  await assertLearningFits(page);await assertLearningContrast(studio);
  await page.screenshot({path:info.outputPath(`marketing-third-message-${theme}-${width}.png`),fullPage:true});
});

for(const [theme,width]of [['light',320],['dark',1280]]as const)test(`${theme} ${width}px: tool rights and actual reservation remain distinct`,async({page},info)=>{
  const {l,answers,studio}=await open(page,'lm04-07',theme,width);
  for(const slot of l.practice.content.left)await studio.getByRole('combobox',{name:slot.text,exact:true}).selectOption(answers[slot.id]);
  const flow=studio.getByRole('list',{name:'Схема на избрания работен процес'});await expect(flow.getByRole('listitem')).toHaveCount(3);
  if(privateRows){await expect(flow).toContainText('Р101');await expect(flow).toContainText('не удостоверява плащане');await expect(flow).toContainText('недоверено съдържание');}
  await expect(studio.locator('input,textarea')).toHaveCount(0);await assertLearningFits(page);await assertLearningContrast(studio);
  await page.screenshot({path:info.outputPath(`marketing-third-workflow-${theme}-${width}.png`),fullPage:true});
});

for(const [theme,width]of [['light',320],['dark',1280]]as const)test(`${theme} ${width}px: the required discount volume recomputes while keeping periods separate`,async({page},info)=>{
  const {l,answers,studio}=await open(page,'lm15-02',theme,width);
  for(const slot of l.practice.content.left){
    const calculation=l.practice.content.right.find(c=>slot.choices.includes(c.id)&&c.preview?.calculation?.a===2700&&c.preview.calculation.b===(slot.phase==='change'?42:36));
    await studio.getByRole('combobox',{name:slot.text,exact:true}).selectOption(calculation?.id||answers[slot.id]);
  }
  const sums=studio.getByRole('list',{name:'Избрани сметки'});await expect(sums.getByRole('listitem')).toHaveCount(2);
  await expect(sums.getByText('75 единици',{exact:true})).toBeVisible();await expect(sums.getByText('64,29 единици',{exact:true})).toBeVisible();
  await expect(studio).toContainText('поне 65 цели единици');await assertLearningFits(page);await assertLearningContrast(studio);
  await page.screenshot({path:info.outputPath(`marketing-third-metrics-${theme}-${width}.png`),fullPage:true});
});

for(const [theme,width]of [['light',320],['dark',1280]]as const)test(`${theme} ${width}px: actual campaign spend excludes the unspent media and authorized repair`,async({page},info)=>{
  const {l,answers,studio}=await open(page,'lm15-06',theme,width);
  const first=l.practice.content.left[0],initial=l.practice.content.right.find(c=>first.choices.includes(c.id)&&c.preview?.budget?.hours===5&&c.preview.budget.external===700)!;
  await studio.getByRole('combobox',{name:first.text,exact:true}).selectOption(initial.id);
  const budget=studio.getByLabel('Учебен разчет');await expect(budget).toContainText('800');
  for(const slot of l.practice.content.left.slice(1,-1))await studio.getByRole('combobox',{name:slot.text,exact:true}).selectOption(answers[slot.id]);
  const last=l.practice.content.left.at(-1)!,updated=l.practice.content.right.find(c=>last.choices.includes(c.id)&&c.preview?.budget?.hours===5&&c.preview.budget.external===420)!;
  await studio.getByRole('combobox',{name:last.text,exact:true}).selectOption(updated.id);
  await expect(budget).toContainText('520');await expect(budget).not.toContainText('800');
  await expect(studio).toContainText('Неизползваната част от първия медиен предел е освободена');await expect(studio.locator('input,textarea')).toHaveCount(0);
  await assertLearningFits(page);await assertLearningContrast(studio);
  await page.screenshot({path:info.outputPath(`marketing-third-budget-${theme}-${width}.png`),fullPage:true});
});
