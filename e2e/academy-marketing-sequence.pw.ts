import {readFileSync} from 'node:fs';
import {test,expect} from '@playwright/test';
import {loadMarketingSequenceCandidates,loadMarketingSequenceSource} from '../scripts/prepare-marketing-sequence-assets.mjs';
import {prepareAcademyTheme} from './helpers/academy-theme-fixture';
import {assertLearningFits,assertLearningContrast} from './helpers/learning-contrast';
const rows=loadMarketingSequenceCandidates(),source=loadMarketingSequenceSource();
const privateRows=process.env.MARKETING_SEQUENCE_PRIVATE?JSON.parse(readFileSync(process.env.MARKETING_SEQUENCE_PRIVATE,'utf8')):null;
test.setTimeout(90000);
for(const theme of ['light','dark'])for(const width of [320,1280])for(const lesson of ['lm01-07','lm09-14']){
 test(`client brief ${lesson}, ${theme}, ${width}px`,async({page},info)=>{
  await page.setViewportSize({width,height:950});const row=rows.find(r=>r.lesson===lesson),block=row.payload.additions.find(b=>b.type==='matching');
  const privateBlock=privateRows?.find(r=>r.lesson===lesson).payload.additions.find(b=>b.type==='matching');
  const matches=privateBlock?.evaluation.matches||Object.fromEntries(block.content.left.map(s=>[s.id,s.choices[0]]));
  const notes=block.content.left.map(s=>({slot:s.id,label:s.text,success:privateBlock?.feedback.details[s.id].success||'Прието решение по предоставените факти.',retry:privateBlock?.feedback.details[s.id].retry||'Свери решението с предоставените факти.'}));
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await prepareAcademyTheme(page,theme,{title:source.find(l=>l.lesson_id===lesson).version.title,blocks:[{...block,id:'00000000-0000-4000-8000-000000000088',position:0}],matchingExpected:matches,matchingFeedback:notes});
  await page.goto(`/module/${row.module}?lesson=${lesson}`);
  const studio=page.getByTestId('closed-practice-studio');await expect(studio).toBeVisible();await expect(studio.getByRole('combobox')).toHaveCount(5);
  for(const s of block.content.left.slice(0,5))await studio.getByRole('combobox',{name:s.text,exact:true}).selectOption(matches[s.id]);
  await expect(studio.getByText(block.content.studio.change,{exact:true})).toHaveCount(1);await expect(studio.getByRole('combobox')).toHaveCount(7);
  await studio.getByRole('button',{name:'Запази вариант за сравнение',exact:true}).click();
  for(const s of block.content.left.slice(5))await studio.getByRole('combobox',{name:s.text,exact:true}).selectOption(matches[s.id]);
  const brief=studio.getByRole('article',{name:'Задание от избраните части'});await expect(brief.locator('section')).toHaveCount(5);
  const change=block.content.right.find(c=>c.id===matches.part_6);await expect(brief).toContainText(change.text);
  await expect(studio).toContainText('Променени части: 2/7');
  const first=block.content.left[0];await studio.getByRole('combobox',{name:first.text,exact:true}).selectOption(first.choices.find(x=>x!==matches[first.id]));await studio.getByRole('button',{name:'Провери решенията',exact:true}).click();await expect(page.getByText(notes[0].retry,{exact:true})).toBeVisible();
  await studio.getByRole('combobox',{name:first.text,exact:true}).selectOption(matches[first.id]);await studio.getByRole('button',{name:'Провери решенията',exact:true}).click();await expect(studio.getByRole('button',{name:'Практиката е премината'})).toBeVisible();
  await assertLearningFits(page);await assertLearningContrast(studio);expect(await studio.locator('input,textarea,[contenteditable="true"]').count()).toBe(0);expect(errors).toEqual([]);
  await brief.scrollIntoViewIfNeeded();await brief.screenshot({path:info.outputPath(`brief-${lesson}-${theme}-${width}.png`)});
  const download=page.waitForEvent('download');await studio.getByRole('button',{name:'Изтегли сравнението'}).click();expect((await download).suggestedFilename()).toBe('uchebno-sravnenie.txt');
 });
}
