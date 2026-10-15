import { readFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';
import { loadNextPracticalMarketingCandidates } from '../scripts/prepare-next-practical-marketing-assets.mjs';
import { prepareAcademyTheme } from './helpers/academy-theme-fixture';
import { assertLearningFits, assertLearningContrast } from './helpers/learning-contrast';
const lessons=loadNextPracticalMarketingCandidates();
const find=(id:string)=>lessons.find(l=>l.lesson===id)!;
const privateRows=process.env.MARKETING_NEXT_PRIVATE_CANDIDATES?JSON.parse(readFileSync(process.env.MARKETING_NEXT_PRIVATE_CANDIDATES,'utf8')):null;
const expected=(l:typeof lessons[number])=>privateRows?.find(row=>row.lesson===l.lesson)?.payload.practice.evaluation.matches||Object.fromEntries(l.practice.content.left.map(slot=>[slot.id,slot.choices[0]]));
test.setTimeout(90000);

for(const theme of ['light','dark'])for(const width of [320,1280])test(`${theme} ${width}px: inquiry workflow changes, explains a mistake, resumes and downloads locally`,async({page},info)=>{
  const l=find('lm08-05'),answers=expected(l),feedback=privateRows?.find(row=>row.lesson===l.lesson)?.payload.practice.feedback.details;
  await page.setViewportSize({width,height:950});
  await prepareAcademyTheme(page,theme,{title:l.title,objective:l.opening.body,blocks:[{...l.practice,id:'00000000-0000-4000-8000-000000000088',position:0}],matchingExpected:answers,matchingFeedback:l.practice.content.left.map(slot=>({slot:slot.id,label:slot.text,success:feedback?.[slot.id].success||'Успешна учебна част.',retry:feedback?.[slot.id].retry||'Свери тази част с условието.'}))});
  const submitted:unknown[]=[];
  page.on('request',r=>{if(r.url().includes('academy_complete_lesson_block'))submitted.push(r.postDataJSON().p_payload);});
  await page.goto(`/module/${l.module}?lesson=${l.lesson}`);
  const studio=page.getByTestId('closed-practice-studio'),flow=studio.getByRole('list',{name:'Схема на избрания работен процес'});
  await expect(studio).toBeVisible({timeout:30000});
  const alternatives=studio.locator('details').first();await alternatives.getByText('Прочети трите варианта').click();
  await expect(alternatives.getByRole('listitem')).toHaveCount(3);
  await expect(studio.getByText(l.practice.content.studio.change,{exact:true})).toHaveCount(0);
  for(const slot of l.practice.content.left)await studio.getByRole('combobox',{name:slot.text,exact:true}).selectOption(answers[slot.id]);
  await expect(studio.getByText(l.practice.content.studio.change,{exact:true})).toBeVisible();
  await expect(flow.getByRole('listitem')).toHaveCount(3);
  if(privateRows){await expect(flow).toContainText('Един запис З51');await expect(flow).toContainText('приемане на оферта още предстои');await expect(flow).not.toContainText('Получено запитване, очакващо');}
  await expect(studio.locator('input,textarea')).toHaveCount(0);
  const first=l.practice.content.left[0],wrong=first.choices.find(id=>id!==answers[first.id])!;
  await studio.getByRole('combobox',{name:first.text,exact:true}).selectOption(wrong);
  await studio.getByRole('button',{name:'Провери решенията'}).click();
  const breakdown=page.getByRole('list',{name:'Разбор на решенията'});
  await expect(breakdown.getByText('Нуждае се от поправка',{exact:true})).toHaveCount(1);
  await expect(breakdown).toContainText(feedback?.[first.id].retry||'Свери тази част с условието.');
  await studio.getByRole('combobox',{name:first.text,exact:true}).selectOption(answers[first.id]);
  await studio.getByRole('button',{name:'Провери решенията'}).click();
  await expect(studio.getByRole('button',{name:'Практиката е премината'})).toBeDisabled();
  await page.reload();
  for(const slot of l.practice.content.left)await expect(studio.getByRole('combobox',{name:slot.text,exact:true})).toHaveValue(answers[slot.id]);
  const downloading=page.waitForEvent('download');await studio.getByRole('button',{name:'Изтегли избраните решения'}).click();
  const downloaded=await downloading,text=await readFile((await downloaded.path())!,'utf8');
  expect(text).toContain(l.practice.content.studio.change);for(const id of Object.values(answers))expect(text).not.toContain(id);
  expect(submitted).toEqual([{matches:{...answers,[first.id]:wrong}},{matches:answers}]);
  await assertLearningFits(page);await assertLearningContrast(studio);
  await page.screenshot({path:info.outputPath(`marketing-next-workflow-${theme}-${width}.png`),fullPage:true});
});

for(const [theme,width]of [['light',320],['dark',1280]]as const)test(`${theme} ${width}px: unique-order costs keep the two periods separate`,async({page},info)=>{
  const l=find('lm09-13');await page.setViewportSize({width,height:950});
  await prepareAcademyTheme(page,theme,{title:l.title,objective:l.opening.body,blocks:[{...l.practice,id:'00000000-0000-4000-8000-000000000088',position:0}]});
  await page.goto(`/module/${l.module}?lesson=${l.lesson}`);
  const studio=page.getByTestId('closed-practice-studio');await expect(studio).toBeVisible();
  for(const slot of l.practice.content.left){
    const calculation=l.practice.content.right.find(c=>slot.choices.includes(c.id)&&c.preview?.calculation?.b===(slot.phase==='change'?14:12));
    await studio.getByRole('combobox',{name:slot.text,exact:true}).selectOption(calculation?.id||slot.choices[0]);
  }
  const sums=studio.getByRole('list',{name:'Избрани сметки'});await expect(sums.getByRole('listitem')).toHaveCount(2);
  await expect(sums.getByText('25 €',{exact:true})).toBeVisible();await expect(sums.getByText('20 €',{exact:true})).toBeVisible();
  await expect(sums).toContainText('уникални платени поръчки');
  await assertLearningFits(page);await assertLearningContrast(studio);
  await page.screenshot({path:info.outputPath(`marketing-next-metrics-${theme}-${width}.png`),fullPage:true});
});

for(const [theme,width]of [['light',320],['dark',1280]]as const)test(`${theme} ${width}px: changed labour updates the whole quarter cost`,async({page},info)=>{
  const l=find('lm09-14');await page.setViewportSize({width,height:950});
  await prepareAcademyTheme(page,theme,{title:l.title,objective:l.opening.body,blocks:[{...l.practice,id:'00000000-0000-4000-8000-000000000088',position:0}]});
  await page.goto(`/module/${l.module}?lesson=${l.lesson}`);
  const studio=page.getByTestId('closed-practice-studio');await expect(studio).toBeVisible();
  const base=l.practice.content.right.find(c=>c.preview?.budget?.hours===6&&c.preview.budget.external===320)!;
  await studio.getByRole('combobox',{name:l.practice.content.left[0].text,exact:true}).selectOption(base.id);
  const budget=studio.getByLabel('Учебен разчет');await expect(budget).toContainText('440');
  const second=l.practice.content.left[1];await studio.getByRole('combobox',{name:second.text,exact:true}).selectOption(second.choices[0]);
  const changed=l.practice.content.right.find(c=>c.preview?.budget?.hours===8&&c.preview.budget.external===320)!;
  await studio.getByRole('combobox',{name:l.practice.content.left[2].text,exact:true}).selectOption(changed.id);
  await expect(budget).toContainText('480');await expect(budget).toContainText('160');await expect(budget).not.toContainText('440');
  await expect(studio.locator('input,textarea')).toHaveCount(0);
  await assertLearningFits(page);await assertLearningContrast(studio);
  await page.screenshot({path:info.outputPath(`marketing-next-budget-${theme}-${width}.png`),fullPage:true});
});

test('the moved AI lesson opens in visible module 10 and submits to its preserved source module',async({page})=>{
  const l=find('lm01-01'),answers=expected(l);
  await prepareAcademyTheme(page,'light',{title:l.title,objective:l.opening.body,blocks:[{...l.practice,id:'00000000-0000-4000-8000-000000000088',position:0}],matchingExpected:answers});
  await page.goto('/module/s03-m09?lesson=lm01-01');
  const studio=page.getByTestId('closed-practice-studio');await expect(studio).toBeVisible();
  for(const slot of l.practice.content.left)await studio.getByRole('combobox',{name:slot.text,exact:true}).selectOption(answers[slot.id]);
  const request=page.waitForRequest(r=>r.url().includes('academy_complete_lesson_block'));
  await studio.getByRole('button',{name:'Провери решенията'}).click();
  expect((await request).postDataJSON()).toMatchObject({p_module:'s03-m01',p_lesson:'lm01-01',p_payload:{matches:answers}});
  await expect(studio.getByRole('button',{name:'Практиката е премината'})).toBeDisabled();
});
