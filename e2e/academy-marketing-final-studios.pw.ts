import { readFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { test, expect, type Page } from '@playwright/test';
import { loadFinalPracticalMarketingCandidates } from '../scripts/prepare-final-practical-marketing-assets.mjs';
import { prepareAcademyTheme } from './helpers/academy-theme-fixture';
import { assertLearningFits, assertLearningContrast } from './helpers/learning-contrast';
const lessons=loadFinalPracticalMarketingCandidates();
const privateRows=process.env.MARKETING_FINAL_PRIVATE_CANDIDATES?JSON.parse(readFileSync(process.env.MARKETING_FINAL_PRIVATE_CANDIDATES,'utf8')):null;
async function open(page:Page,id:string,theme:string,width:number){
  const l=lessons.find(l=>l.lesson===id)!,p=privateRows?.find(row=>row.lesson===id)?.payload.practice;
  const answers=p?.evaluation.matches||Object.fromEntries(l.practice.content.left.map(slot=>[slot.id,slot.choices[0]]));
  await page.setViewportSize({width,height:950});
  await prepareAcademyTheme(page,theme,{title:l.title,objective:l.opening.body,blocks:[{...l.practice,id:'00000000-0000-4000-8000-000000000088',position:0}],matchingExpected:answers,matchingFeedback:l.practice.content.left.map(slot=>({slot:slot.id,label:slot.text,success:p?.feedback.details[slot.id].success||'Успешна учебна част.',retry:p?.feedback.details[slot.id].retry||'Свери тази част с условието.'}))});
  await page.goto(`/module/${l.module}?lesson=${l.lesson}`);const studio=page.getByTestId('closed-practice-studio');await expect(studio).toBeVisible({timeout:30000});
  return{l,answers,studio,p};
}
test.setTimeout(90000);

for(const theme of ['light','dark'])for(const width of [320,1280])test(`${theme} ${width}px: the payer change preserves the other people and uses finite selections`,async({page},info)=>{
  const {l,answers,studio}=await open(page,'lm17-01',theme,width);
  await expect(studio.getByText(l.practice.content.studio.change,{exact:true})).toHaveCount(0);
  const base=l.practice.content.left.slice(0,-1);for(const slot of base)await studio.getByRole('combobox',{name:slot.text,exact:true}).selectOption(answers[slot.id]);
  const people=studio.getByRole('list',{name:'Карта на участниците в решението'});await expect(people.getByRole('listitem')).toHaveCount(3);
  if(privateRows){const deni=people.getByRole('listitem').filter({hasText:'Дени'});await expect(deni).not.toContainText('Плаща');}
  const last=l.practice.content.left.at(-1)!;await studio.getByRole('combobox',{name:last.text,exact:true}).selectOption(answers[last.id]);
  await expect(people.getByRole('listitem')).toHaveCount(3);
  if(privateRows){await expect(people.getByRole('listitem').filter({hasText:'Дени'})).toContainText('Търси информация · Плаща');await expect(people).toContainText('Мила');await expect(people).toContainText('Петър');}
  await expect(studio.locator('input,textarea')).toHaveCount(0);
  await studio.locator('details').first().getByText('Прочети трите варианта').click();await expect(studio.locator('details').first().getByRole('listitem')).toHaveCount(3);
  await assertLearningFits(page);await assertLearningContrast(studio);
  await page.screenshot({path:info.outputPath(`marketing-final-roles-${theme}-${width}.png`),fullPage:true});
});

for(const[theme,width]of[['light',320],['dark',1280]]as const)test(`${theme} ${width}px: a corrected reservation message survives feedback, reload and local download`,async({page},info)=>{
  const {l,answers,studio,p}=await open(page,'lm17-07',theme,width);const submitted:unknown[]=[];
  page.on('request',r=>{if(r.url().includes('academy_complete_lesson_block'))submitted.push(r.postDataJSON().p_payload);});
  for(const slot of l.practice.content.left)await studio.getByRole('combobox',{name:slot.text,exact:true}).selectOption(answers[slot.id]);
  const message=studio.getByRole('article',{name:'Съобщение от избраните части'});
  if(privateRows){await expect(message).toContainText('16:00 Europe/Sofia');await expect(message).toContainText('номер Б81');await expect(message).not.toContainText('14:00 не е потвърдено');}
  const first=l.practice.content.left[0],wrong=first.choices.find(id=>id!==answers[first.id])!;await studio.getByRole('combobox',{name:first.text,exact:true}).selectOption(wrong);
  await studio.getByRole('button',{name:'Провери решенията'}).click();const breakdown=page.getByRole('list',{name:'Разбор на решенията'});
  await expect(breakdown.getByText('Нуждае се от поправка',{exact:true})).toHaveCount(1);await expect(breakdown).toContainText(p?.feedback.details[first.id].retry||'Свери тази част с условието.');
  await studio.getByRole('combobox',{name:first.text,exact:true}).selectOption(answers[first.id]);await studio.getByRole('button',{name:'Провери решенията'}).click();await expect(studio.getByRole('button',{name:'Практиката е премината'})).toBeDisabled();
  await page.reload();for(const slot of l.practice.content.left)await expect(studio.getByRole('combobox',{name:slot.text,exact:true})).toHaveValue(answers[slot.id]);
  const wait=page.waitForEvent('download');await studio.getByRole('button',{name:'Изтегли избраните решения'}).click();const download=await wait,text=await readFile((await download.path())!,'utf8');
  expect(text).toContain(l.practice.content.studio.change);for(const id of Object.values(answers))expect(text).not.toContain(id);
  expect(submitted).toEqual([{matches:{...answers,[first.id]:wrong}},{matches:answers}]);await expect(studio.locator('input,textarea')).toHaveCount(0);
  await assertLearningFits(page);await assertLearningContrast(studio);await page.screenshot({path:info.outputPath(`marketing-final-message-${theme}-${width}.png`),fullPage:true});
});

for(const[theme,width]of[['light',320],['dark',1280]]as const)test(`${theme} ${width}px: a zero additional-result estimate has no finite cost per additional purchase`,async({page},info)=>{
  const {l,answers,studio}=await open(page,'lm14-09',theme,width);
  for(const slot of l.practice.content.left){const denominator=slot.phase==='change'?0:16;const calculated=l.practice.content.right.find(c=>slot.choices.includes(c.id)&&c.preview?.calculation?.a===480&&c.preview.calculation.b===denominator);await studio.getByRole('combobox',{name:slot.text,exact:true}).selectOption(calculated?.id||answers[slot.id]);}
  const sums=studio.getByRole('list',{name:'Избрани сметки'});await expect(sums.getByRole('listitem')).toHaveCount(2);await expect(sums.getByText('Липсва валиден знаменател.',{exact:true})).toBeVisible();
  await expect(sums).toContainText('30 € / покупка');await assertLearningFits(page);await assertLearningContrast(studio);await page.screenshot({path:info.outputPath(`marketing-final-metrics-${theme}-${width}.png`),fullPage:true});
});

for(const[theme,width]of[['light',320],['dark',1280]]as const)test(`${theme} ${width}px: the final plan revises capacity and budget while retaining the useful promise`,async({page},info)=>{
  const{l,answers,studio}=await open(page,'lm20-14',theme,width);for(const slot of l.practice.content.left)await studio.getByRole('combobox',{name:slot.text,exact:true}).selectOption(answers[slot.id]);
  const plan=studio.getByRole('list',{name:'Схема на избрания работен процес'});await expect(plan.getByRole('listitem')).toHaveCount(6);
  if(privateRows){await expect(plan).toContainText('350 €');await expect(plan).toContainText('550 €');await expect(plan).toContainText('до осем услуги');await expect(plan).toContainText('крайна сума и срок се потвърждават');await expect(plan).not.toContainText('План до 700 €');}
  await studio.getByRole('button',{name:'Провери решенията'}).click();await expect(page.getByRole('list',{name:'Разбор на решенията'}).getByRole('listitem')).toHaveCount(8);
  await expect(studio.getByRole('button',{name:'Практиката е премината'})).toBeDisabled();await expect(studio.locator('input,textarea')).toHaveCount(0);await assertLearningFits(page);await assertLearningContrast(studio);
  await page.screenshot({path:info.outputPath(`marketing-final-plan-${theme}-${width}.png`),fullPage:true});
});

test('dark 320px: all 60 final questions use finite choices, exact minimums and the current review-module number',async({page},info)=>{
  const packet=JSON.parse(readFileSync('scripts/marketing-basics/releases/community-16-20-20261012.json','utf8'));
  const original=packet.lesson_files.flatMap(file=>JSON.parse(readFileSync('scripts/marketing-basics/releases/'+file,'utf8')).lessons).find(l=>l.lesson_id==='lm20-14');
  const exam=original.blocks.find(b=>b.type==='course_exam');const submitted:unknown[]=[];await page.setViewportSize({width:320,height:950});
  await prepareAcademyTheme(page,'dark',{title:original.title,objective:original.blocks[0].content.body,blocks:[{...exam,id:'00000000-0000-4000-8000-000000000089',position:0}]});
  await page.route('**/rest/v1/rpc/academy_submit_course_exam',async route=>{const p=route.request().postDataJSON();submitted.push(p.p_payload);await route.fulfill({json:{attemptId:'synthetic-final-exam',correct:false,score:0,maxScore:100,feedback:{complete:false,scorePercent:0,correctCount:0,totalQuestions:60,weakModules:['s03-m14'],groupResults:[1,2,3,4].map(group=>({label:`Пробна група ${group}`,correctCount:0,totalQuestions:15,scorePercent:0,minimumPercent:60,passed:false}))},progress:{current_block_key:exam.key,completed_block_keys:[],block_state:{[exam.key]:p.p_payload},xp:0,score_percent:0,mastery_status:'learning',completed_at:null}}});});
  await page.goto('/module/s03-m20?lesson=lm20-14');await expect(page.locator('fieldset')).toHaveCount(60);
  await expect(page.locator('input:not([type="radio"]),textarea,[contenteditable="true"]')).toHaveCount(0);
  await expect(page.getByText(/Изискват се и поне 60% във всяка тематична група/)).toBeVisible();const submit=page.getByRole('button',{name:'Предай целия изпит'});await expect(submit).toBeDisabled();
  for(let i=0;i<59;i++)await page.locator('fieldset').nth(i).getByRole('radio').first().check();await expect(submit).toBeDisabled();
  await page.locator('fieldset').nth(59).getByRole('radio').first().check();await expect(submit).toBeEnabled();await submit.click();await expect(page.getByRole('list',{name:'Резултати по тематични групи'}).getByRole('listitem')).toHaveCount(4);
  const review=page.getByRole('link',{name:/Модул 16 · Данните/});await expect(review).toHaveAttribute('href','/module/s03-m14');
  expect(submitted).toHaveLength(1);expect(Object.keys(submitted[0]as object)).toEqual(['answers']);expect(Object.keys((submitted[0]as{answers:object}).answers)).toHaveLength(60);
  await assertLearningFits(page);await review.scrollIntoViewIfNeeded();await page.screenshot({path:info.outputPath('marketing-final-exam-dark-320.png')});
});
