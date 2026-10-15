import { readFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';
import { loadPracticalMarketingCandidates } from '../scripts/prepare-practical-marketing-assets.mjs';
import { prepareAcademyTheme, selectTheme } from './helpers/academy-theme-fixture';
import { assertLearningFits, assertLearningContrast } from './helpers/learning-contrast';
const lessons=loadPracticalMarketingCandidates();
const find=(id:string)=>lessons.find(l=>l.lesson===id)!;
const privateRows=process.env.MARKETING_PRACTICAL_PRIVATE_CANDIDATES?JSON.parse(readFileSync(process.env.MARKETING_PRACTICAL_PRIVATE_CANDIDATES,'utf8')):null;
const expected=(l:typeof lessons[number])=>privateRows?.find(row=>row.lesson===l.lesson)?.payload.practice.evaluation.matches||Object.fromEntries(l.practice.content.left.map(slot=>[slot.id,slot.choices[0]]));
test.setTimeout(90000);

for(const theme of ['light','dark'])for(const width of [320,1280])test(`${theme} ${width}px: a message changes conditions, gets feedback, resumes and downloads locally`,async({page},info)=>{
  const l=find('lm01-00'),answers=expected(l),feedback=privateRows?.find(row=>row.lesson===l.lesson)?.payload.practice.feedback.details;
  await page.setViewportSize({width,height:950});
  await prepareAcademyTheme(page,theme,{title:l.title,objective:l.opening.body,blocks:[{...l.practice,id:'00000000-0000-4000-8000-000000000088',position:0}],matchingExpected:answers,matchingFeedback:l.practice.content.left.map(slot=>({slot:slot.id,label:slot.text,success:feedback?.[slot.id].success||'Успешна учебна част.',retry:feedback?.[slot.id].retry||'Свери тази част с условието.'}))});
  const submitted:unknown[]=[];
  page.on('request',r=>{if(r.url().includes('academy_complete_lesson_block'))submitted.push(r.postDataJSON().p_payload);});
  await page.goto(`/module/${l.module}?lesson=${l.lesson}`);
  const studio=page.getByTestId('closed-practice-studio'),message=studio.getByRole('article',{name:'Съобщение от избраните части'});
  await expect(studio).toBeVisible({timeout:30000});
  const alternatives=studio.locator('details').first();await alternatives.getByText('Прочети трите варианта').click();
  await expect(alternatives.getByRole('listitem')).toHaveCount(3);
  for(const id of l.practice.content.left[0].choices)await expect(alternatives.getByText(l.practice.content.right.find(c=>c.id===id)!.text,{exact:true})).toBeVisible();
  await expect(studio.getByText(l.practice.content.studio.change,{exact:true})).toHaveCount(0);
  for(const slot of l.practice.content.left)await studio.getByRole('combobox',{name:slot.text,exact:true}).selectOption(answers[slot.id]);
  await expect(studio.getByText(l.practice.content.studio.change,{exact:true})).toBeVisible();
  if(privateRows){await expect(message).toContainText('17:00');await expect(message).not.toContainText('16:00');await expect(message).toContainText('още трябва да приеме');}
  await expect(studio.locator('input,textarea')).toHaveCount(0);
  const first=l.practice.content.left[0],wrong=first.choices.find(id=>id!==answers[first.id])!;
  await studio.getByRole('combobox',{name:first.text,exact:true}).selectOption(wrong);
  await studio.getByRole('button',{name:'Провери решенията'}).click();
  const breakdown=page.getByRole('list',{name:'Разбор на решенията'});
  await expect(breakdown).toBeVisible();await expect(breakdown.getByText('Нуждае се от поправка',{exact:true})).toHaveCount(1);
  await expect(breakdown).toContainText(feedback?.[first.id].retry||'Свери тази част с условието.');
  await studio.getByRole('combobox',{name:first.text,exact:true}).selectOption(answers[first.id]);
  await studio.getByRole('button',{name:'Провери решенията'}).click();
  await expect(studio.getByRole('button',{name:'Практиката е премината'})).toBeDisabled();
  await expect(breakdown.getByText('По условията на случая',{exact:true})).toHaveCount(l.practice.content.left.length);
  await page.reload();
  for(const slot of l.practice.content.left)await expect(studio.getByRole('combobox',{name:slot.text,exact:true})).toHaveValue(answers[slot.id]);
  await selectTheme(page,theme==='light'?'Тъмна':'Светла');
  const downloading=page.waitForEvent('download');await studio.getByRole('button',{name:'Изтегли избраните решения'}).click();
  const download=await downloading,text=await readFile((await download.path())!,'utf8');
  expect(text).toContain(l.practice.content.studio.change);for(const id of Object.values(answers))expect(text).not.toContain(id);
  expect(submitted).toEqual([{matches:{...answers,[first.id]:wrong}},{matches:answers}]);
  await assertLearningFits(page);await assertLearningContrast(studio);
  await page.screenshot({path:info.outputPath(`marketing-message-${theme}-${width}.png`),fullPage:true});
});

for(const [theme,width]of [['light',320],['dark',1280]]as const)test(`${theme} ${width}px: the role map keeps multiple roles and changes one participant`,async({page},info)=>{
  const l=find('lm02-01'),answers=expected(l);
  await page.setViewportSize({width,height:950});
  await prepareAcademyTheme(page,theme,{title:l.title,objective:l.opening.body,blocks:[{...l.practice,id:'00000000-0000-4000-8000-000000000088',position:0}]});
  await page.goto(`/module/${l.module}?lesson=${l.lesson}`);
  const studio=page.getByTestId('closed-practice-studio');await expect(studio).toBeVisible();
  for(const slot of l.practice.content.left)await studio.getByRole('combobox',{name:slot.text,exact:true}).selectOption(answers[slot.id]);
  const people=studio.getByRole('list',{name:'Карта на участниците в решението'});
  await expect(people.getByRole('listitem')).toHaveCount(4);
  if(privateRows){await expect(people.getByRole('listitem').filter({hasText:'Ива'})).toContainText('Търси информация · Използва');await expect(people.getByRole('listitem').filter({hasText:'Борис'})).toContainText('Одобрява');}
  await assertLearningFits(page);await assertLearningContrast(studio);
  await page.screenshot({path:info.outputPath(`marketing-roles-${theme}-${width}.png`),fullPage:true});
});

for(const [theme,width]of [['light',320],['dark',1280]]as const)test(`${theme} ${width}px: pricing shows margin and markup and recomputes a changed cost`,async({page},info)=>{
  const l=find('lm05-01');await page.setViewportSize({width,height:950});
  await prepareAcademyTheme(page,theme,{title:l.title,objective:l.opening.body,blocks:[{...l.practice,id:'00000000-0000-4000-8000-000000000088',position:0}]});
  await page.goto(`/module/${l.module}?lesson=${l.lesson}`);
  const studio=page.getByTestId('closed-practice-studio'),first=l.practice.content.left[0],last=l.practice.content.left.at(-1)!;
  const initial=l.practice.content.right.find(c=>first.choices.includes(c.id)&&c.preview?.budget?.price===150)!;
  await studio.getByRole('combobox',{name:first.text,exact:true}).selectOption(initial.id);
  const budget=studio.getByLabel('Учебен разчет');await expect(budget).toContainText('25%');await expect(budget).toContainText('20%');
  const second=l.practice.content.left[1];await studio.getByRole('combobox',{name:second.text,exact:true}).selectOption(second.choices[0]);
  const changed=l.practice.content.right.find(c=>last.choices.includes(c.id)&&c.preview?.budget?.price===180)!;
  await studio.getByRole('combobox',{name:last.text,exact:true}).selectOption(changed.id);
  await expect(budget).toContainText('144');await expect(budget).toContainText('180');await expect(budget).toContainText('25%');await expect(budget).toContainText('20%');
  await expect(studio.locator('input,textarea')).toHaveCount(0);
  await assertLearningFits(page);await assertLearningContrast(studio);
  await page.screenshot({path:info.outputPath(`marketing-budget-${theme}-${width}.png`),fullPage:true});
});
