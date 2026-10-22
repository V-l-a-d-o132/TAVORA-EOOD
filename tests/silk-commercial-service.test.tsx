// @vitest-environment jsdom
import {readFileSync,readdirSync,writeFileSync} from 'node:fs';
import {afterEach,expect,test} from 'vitest';
import {render,cleanup} from '@testing-library/react';
import ClosedPracticeStudio from '../src/components/academy/ClosedPracticeStudio';
import {parseClosedStudio} from '../src/lib/closed-practice-studio';
import {countVisibleLessonWords} from '../src/lib/academy-reading-time';
const dir='course-assets/silk-road/commercial-service';
const lessons=readdirSync(dir).filter(f=>/^l\d\d-\d\d\.json$/.test(f)).sort().map(f=>JSON.parse(readFileSync(`${dir}/${f}`,'utf8')));
afterEach(cleanup);
test('30 lessons have detailed openings and only closed assessment controls',()=>{
 expect(lessons).toHaveLength(30);
 for(const l of lessons){
  const first=l.blocks[0];expect(first.type).toBe('objective');expect(first.points).toBe(5);
  expect(first.content.body.length).toBeGreaterThan(300);expect(first.content.outcomes.length).toBeGreaterThanOrEqual(5);
  expect(first.content.deliverable.length).toBeGreaterThan(100);expect(first.content.check.length).toBeGreaterThan(100);
  expect(JSON.stringify(l)).not.toMatch(/"(?:answer_key|answerKey|evaluation|correctAnswer)"\s*:/);
  expect(l.blocks.some(b=>['practical_response','file_upload','text_response'].includes(b.type))).toBe(false);
  for(const b of l.blocks.filter(b=>b.content.studio)){
   const studio=parseClosedStudio(b.content);expect(studio,`${l.lessonId}/${b.key}`).not.toBeNull();
   const {container}=render(<ClosedPracticeStudio studio={studio!} state={{}} busy={false} completed={false} onChange={()=>{}} onSubmit={()=>{}}/>);
   expect(container.querySelector('input,textarea,[contenteditable="true"]')).toBeNull();
   for(const slot of studio!.slots){expect(slot.choices.length).toBeGreaterThanOrEqual(2);for(const id of slot.choices)expect(studio!.choices.some(c=>c.id===id)).toBe(true);}
   cleanup();
  }
 }
});
test('all later lessons retain independent exercises and connect demonstrated work',()=>{
 for(const l of lessons.filter(l=>l.moduleId>='s01-m06')){
  expect(l.blocks.find(b=>b.key==='silk_worked_20261016').content.body).toContain('Педал');
  expect(l.blocks.find(b=>b.key==='silk_studio_20261016').required).toBe(true);
  if(['l06-10','l07-04','l08-04','l09-04','l10-04','l11-04'].includes(l.lessonId))for(const key of ['silk_transfer_20261018','silk_toolcheck_20261018'])expect(l.blocks.find(b=>b.key===key)?.required).toBe(true);
 }
});
test('counts visible lesson content with the production counter',()=>{
 const counts=Object.fromEntries(lessons.map(l=>[`${l.moduleId}/${l.lessonId}`,countVisibleLessonWords(l)]));
 for(const count of Object.values(counts))expect(count).toBeGreaterThan(1000);
 if(process.env.SILK_COMMERCIAL_COUNTS)writeFileSync(process.env.SILK_COMMERCIAL_COUNTS,JSON.stringify(counts,null,2));
});
