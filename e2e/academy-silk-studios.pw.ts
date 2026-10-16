import {readFileSync} from 'node:fs';
import {test,expect,type Page} from '@playwright/test';
import {loadPracticalSilkCandidates} from '../scripts/prepare-practical-silk-assets.mjs';
import {prepareAcademyTheme} from './helpers/academy-theme-fixture';
import {assertLearningFits,assertLearningContrast} from './helpers/learning-contrast';
const lessons=loadPracticalSilkCandidates();
const privateRows=process.env.SILK_PRIVATE_CANDIDATES?JSON.parse(readFileSync(process.env.SILK_PRIVATE_CANDIDATES,'utf8')):null;
const answersFor=l=>privateRows?.find(p=>p.lesson===l.lesson)?.payload.practice.evaluation.matches||Object.fromEntries(l.practice.content.left.map(s=>[s.id,s.choices[0]]));
const versionFor=l=>`00000000-0000-4000-8000-${String(100+lessons.indexOf(l)).padStart(12,'0')}`;
async function prepare(page:Page,theme:string,guest=false){
 page.on('pageerror',error=>console.log('PAGE_ERROR',error.message));
 page.on('console',message=>{if(message.type()==='error')console.log('PAGE_CONSOLE',message.text().slice(0,300));});
 page.on('requestfailed',request=>console.log('FAILED_RESOURCE',new URL(request.url()).pathname,request.failure()?.errorText));
 const progressByLesson=new Map<string,unknown>();
 await prepareAcademyTheme(page,theme,undefined,{hasFullAccess:!guest,anonymous:guest});
 const calls:string[]=[];page.on('request',r=>{if(r.url().includes('/rest/v1/rpc/'))calls.push(r.url().split('/').at(-1)!);});
 await page.route('**/rest/v1/rpc/academy_get_lesson_v2',async route=>{
  const p=route.request().postDataJSON(),l=lessons.find(l=>l.module===p.p_module&&l.lesson===p.p_lesson)!;
  if(!l)return route.fulfill({status:404,json:{message:'Unknown synthetic lesson'}});
  return route.fulfill({json:{id:versionFor(l),moduleId:l.module,lessonId:l.lesson,status:'published',versionId:versionFor(l),version:1,title:l.title,subtitle:'Предоставен случай за браузърна проверка',objective:l.opening.body,hook:'',estimatedMinutes:10,sourceKind:'editor',validation:{errors:[],warnings:[]},versionChanged:false,progress:progressByLesson.get(l.lesson)||null,blocks:[{...l.practice,id:versionFor(l),position:0}]}});
 });
 await page.route('**/rest/v1/rpc/academy_complete_lesson_block',async route=>{
  const p=route.request().postDataJSON(),l=lessons.find(l=>l.module===p.p_module&&l.lesson===p.p_lesson)!,expected=answersFor(l),supplied=p.p_payload.matches||{};
  const correct=JSON.stringify(Object.entries(expected).sort())===JSON.stringify(Object.entries(supplied).sort());
  const detail=privateRows?.find(p=>p.lesson===l.lesson)?.payload.practice.feedback.details;
  const feedback={complete:correct,correct,explanation:correct?'Решението следва учебните условия.':'Прегледай посочените части.',details:l.practice.content.left.map(s=>({label:s.text,correct:supplied[s.id]===expected[s.id],note:detail?.[s.id]?.[supplied[s.id]===expected[s.id]?'success':'retry']||'Свери решението с предоставените условия.'}))};
  const progress=guest?null:{completed_block_keys:correct?[l.practice.key]:[],block_state:{[l.practice.key]:p.p_payload},xp:correct?20:0,mastery_status:correct?'mastered':'learning',completed_at:correct?new Date().toISOString():null};
  if(progress)progressByLesson.set(l.lesson,progress);
  return route.fulfill({json:{attemptId:p.p_attempt,correct,score:correct?20:0,maxScore:20,feedback,preview:guest,progress}});
 });
 return calls;
}
async function choose(page:Page,l){const answers=answersFor(l),studio=page.getByTestId('closed-practice-studio');for(const slot of l.practice.content.left)await studio.getByRole('combobox',{name:slot.text,exact:true}).selectOption(answers[slot.id]);return studio;}
test.setTimeout(120000);

for(const theme of ['light','dark'])for(const width of [320,1280])test(`${theme} ${width}px: all four guest practices, retry, reload and voluntary purchase bridge`,async({page},info)=>{
 await page.setViewportSize({width,height:950});const calls=await prepare(page,theme,true);
 await page.goto('/module/s01-m01?lesson=l01-01');await expect(page.getByTestId('closed-practice-studio')).toBeVisible({timeout:30000});
 await expect(page.getByRole('region',{name:'След безплатния модул'})).toHaveCount(0);
 for(const [i,l]of lessons.filter(l=>l.module==='s01-m01').entries()){
  const studio=await choose(page,l);
  if(i===0){const slot=l.practice.content.left.at(-1),right=answersFor(l)[slot.id];await studio.getByRole('combobox',{name:slot.text,exact:true}).selectOption(slot.choices.find(id=>id!==right));await studio.getByRole('button',{name:'Провери решенията'}).click();await expect(studio.getByRole('button',{name:'Провери решенията'})).toBeEnabled();await studio.getByRole('combobox',{name:slot.text,exact:true}).selectOption(right);}
  await assertLearningFits(page);await assertLearningContrast(studio);
  expect(await studio.locator('input,textarea,[contenteditable="true"]').count()).toBe(0);
  await studio.getByRole('button',{name:'Провери решенията'}).click();await expect(studio.getByRole('button',{name:'Практиката е премината'})).toBeVisible();
  if(i<3)await page.getByRole('button',{name:'Следващ урок',exact:true}).click();
 }
 const bridge=page.getByRole('region',{name:'След безплатния модул'});await expect(bridge).toBeVisible();await bridge.scrollIntoViewIfNeeded();await assertLearningContrast(bridge);await assertLearningFits(page);
 await expect(bridge.getByRole('link',{name:/Към покупка на пълния курс/})).toHaveAttribute('href','/kurs/checkout?tier=koprinena-pateka');
 await expect(bridge.getByRole('link',{name:'Виж цялата програма'})).toHaveAttribute('href','/kurs/ai-business-blueprint');
 await page.screenshot({path:info.outputPath(`free-finish-${theme}-${width}.png`),fullPage:false});
 await page.reload();await expect(page.getByRole('region',{name:'След безплатния модул'})).toBeVisible();await expect(page.getByRole('button',{name:'Практиката е премината'})).toBeVisible();
 expect(calls.some(name=>/autosave|record_lesson_visit/.test(name))).toBe(false);expect(calls.some(name=>/checkout|purchase|upload/.test(name))).toBe(false);
});

test('a paid learner finishes the same four tasks and continues directly to the site module',async({page})=>{
 await prepare(page,'dark');await page.goto('/module/s01-m01?lesson=l01-01');
 for(const [i,l]of lessons.filter(l=>l.module==='s01-m01').entries()){await expect(page.getByTestId('closed-practice-studio')).toBeVisible();const studio=await choose(page,l);await studio.getByRole('button',{name:'Провери решенията'}).click();await expect(studio.getByRole('button',{name:'Практиката е премината'})).toBeVisible();if(i<3)await page.getByRole('button',{name:'Следващ урок',exact:true}).click();}
 const bridge=page.getByRole('region',{name:'След безплатния модул'});await expect(bridge).toBeVisible();await expect(bridge.getByRole('link',{name:/Продължи към модул 2/})).toHaveAttribute('href','/module/s01-m02');expect(await bridge.locator('a[href*="checkout"]').count()).toBe(0);
});

test('a signed-in learner can revalidate guest work without losing it or buying again',async({page})=>{
 await prepare(page,'light');const snapshots=lessons.filter(l=>l.module==='s01-m01').map(l=>({key:`academy:free-silk:20261016:${l.lesson}`,value:{versionId:versionFor(l),currentBlockKey:l.practice.key,blockState:{[l.practice.key]:{matches:answersFor(l)}},completedBlockKeys:[l.practice.key],xp:20,lessonComplete:true}}));
 await page.addInitScript(rows=>{for(const row of rows)localStorage.setItem(row.key,JSON.stringify(row.value));},snapshots);
 await page.goto('/module/s01-m01?lesson=l01-04');const restore=page.getByRole('region',{name:'Запази безплатната практика в профила'});await expect(restore).toBeVisible();await restore.getByRole('button',{name:'Провери и запази в профила'}).click();await expect(restore.getByRole('status')).toContainText('проверени и запазени');
 await expect(page.getByRole('button',{name:'Практиката е премината'})).toBeVisible();const bridge=page.getByRole('region',{name:'След безплатния модул'});await expect(bridge.getByRole('link',{name:/Продължи към модул 2/})).toBeVisible();expect(await bridge.locator('a[href*="checkout"]').count()).toBe(0);
 expect(await page.evaluate(()=>Object.keys(localStorage).filter(k=>k.startsWith('academy:free-silk:20261016:')).length)).toBe(0);
});

for(const [id,preview]of [['l02-01','Преглед на учебната страница'],['l03-02','Учебен преглед на заглавие и описание'],['l06-03','Сравни разчетите'],['l09-01','']])test(`${id}: finite operation, changed condition and feedback on a mobile light theme`,async({page},info)=>{
 await page.setViewportSize({width:320,height:950});await prepare(page,'light');const l=lessons.find(l=>l.lesson===id)!;await page.goto(`/module/${l.module}?lesson=${id}`);const studio=page.getByTestId('closed-practice-studio');await expect(studio).toBeVisible({timeout:30000});
 const changed=l.practice.content.left.at(-1);await expect(studio.getByText(l.practice.content.studio.change,{exact:true})).toHaveCount(0);await choose(page,l);await expect(studio.getByRole('combobox',{name:changed.text,exact:true})).toBeVisible();
 if(id==='l02-01'){const choice=l.practice.content.right.find(c=>c.id===answersFor(l)[changed.id])!;await expect(studio.getByRole('article',{name:preview})).toContainText(choice.preview.page.text);}
 if(id==='l03-02'){const choice=l.practice.content.right.find(c=>c.id===answersFor(l)[changed.id])!;await expect(studio.getByRole('article',{name:preview})).toContainText(choice.preview.search.text);}
 await assertLearningFits(page);await assertLearningContrast(studio);await page.screenshot({path:info.outputPath(`${id}-light-320.png`),fullPage:true});await studio.getByRole('button',{name:'Провери решенията'}).click();await expect(studio.getByRole('button',{name:'Практиката е премината'})).toBeVisible();
});
