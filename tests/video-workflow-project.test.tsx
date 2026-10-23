// @vitest-environment jsdom
import { afterEach, expect, test } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { readFileSync, writeFileSync } from 'node:fs';
import VideoWorkflowWorkshop from '../src/components/academy/VideoWorkflowWorkshop';
import { INITIAL_WORKFLOW, videoWorkflowReview, videoWorkflowDossier, updateVideoWorkflow } from '../src/data/video-workflow-project';
import { loadVideoWorkflowLessons } from '../scripts/prepare-video-workflow-assets.mjs';
import { parseClosedStudio } from '../src/lib/closed-practice-studio';
import { countVisibleLessonWords } from '../src/lib/academy-reading-time';
import { LEARNING_SECTIONS, PREVIOUS_VIDEO_WORKFLOW_LESSONS } from '../src/mocks/learning-platform';
import { lessonRoute, requestedLessonIndex } from '../src/lib/academy-lesson-location';
import order from '../course-assets/perfect-video/client-workflow/order.json';
afterEach(cleanup);
test('dependencies, full cost and renewed acceptance follow the changed version',()=>{
 expect(videoWorkflowReview(INITIAL_WORKFLOW).issues).toHaveLength(6);
 const finished={plan:'approved',shot:'complete',copies:'verified',edit:'process',caption:'verified',review:'accepted',extra:'agreed'} as const;
 expect(videoWorkflowReview(finished)).toEqual({issues:[],hours:7,price:210,cost:160,difference:50});
 expect(videoWorkflowReview({...finished,extra:'unquoted'})).toMatchObject({price:160,cost:160,difference:0});
 for(const key of ['edit','caption','extra'] as const)expect(updateVideoWorkflow(finished,key,INITIAL_WORKFLOW[key]).review).toBe('pending');
 expect(updateVideoWorkflow(finished,'caption','arbitrary')).toBe(finished);
 const dossier=videoWorkflowDossier(finished);for(const term of ['360 × 640','15 fps','без звук','210 €','160 €','не са включени'])expect(dossier).toContain(term);
});
test('finite choices change actual media, captions and dependent review without open input',()=>{
 const {container}=render(<VideoWorkflowWorkshop/>);
 fireEvent.change(screen.getByLabelText('Условия за начало'),{target:{value:'approved'}});
 expect(screen.getByLabelText('Проверка на работния процес').textContent).not.toContain('чака потвърдени');
 fireEvent.click(screen.getByRole('button',{name:'9. Монтаж и износ'}));
 fireEvent.change(screen.getByLabelText('Монтаж за проверка'),{target:{value:'process'}});
 expect(screen.getByLabelText('Монтажен износ V-1').getAttribute('src')).toMatch(/process.mp4$/);
 fireEvent.click(screen.getByRole('button',{name:'10. Предаване'}));
 fireEvent.change(screen.getByLabelText('Субтитри към пакета'),{target:{value:'verified'}});
 expect(screen.getByLabelText('SRT за предаване').textContent).toContain('Получаване на място');
 fireEvent.change(screen.getByLabelText('Допълнителна работа по монтажа'),{target:{value:'agreed'}});
 expect(screen.getByLabelText('Разчет за монтажа').textContent).toContain('210 €');
 fireEvent.change(screen.getByLabelText('Статус в учебния журнал'),{target:{value:'accepted'}});
 fireEvent.change(screen.getByLabelText('Субтитри към пакета'),{target:{value:'delivery'}});
 expect((screen.getByLabelText('Статус в учебния журнал') as HTMLSelectElement).value).toBe('pending');
 expect(container.querySelector('input,textarea,[contenteditable]')).toBeNull();
});
test('dependency order preserves every legacy indexed link and uses stable new links',()=>{
 const modules=LEARNING_SECTIONS.flatMap(s=>s.modules);
 for(const [id,ids] of Object.entries(order)){
  const module=modules.find(m=>m.id===id)!;expect(module.lessons.map(l=>l.id)).toEqual(ids);
  for(const [i,oldId] of PREVIOUS_VIDEO_WORKFLOW_LESSONS[id].entries())expect(module.lessons[requestedLessonIndex(module,String(i))].id).toBe(oldId);
  for(const [i,lesson] of module.lessons.entries()){
   expect(lessonRoute(id,lesson.id,i)).toContain(`lesson=${lesson.id}`);
   expect(requestedLessonIndex(module,lesson.id)).toBe(i);
  }
 }
 expect(order['s02-m08'].indexOf('pv08-12')).toBeLessThan(order['s02-m08'].indexOf('pv08-01'));
 expect(order['s02-m09'].indexOf('pv09-08')).toBeLessThan(order['s02-m09'].indexOf('pv09-05'));
});
test('77 detailed lessons hand off an output to their actual next lesson and retain closed checks',()=>{
 const rows=loadVideoWorkflowLessons();expect(rows).toHaveLength(77);
 const sequence=Object.values(order).flat(),counts:Record<string,number>={},modules:Record<string,any>={};let cases=0;
 const source=process.env.VIDEO_WORKFLOW_SOURCE?JSON.parse(readFileSync(process.env.VIDEO_WORKFLOW_SOURCE,'utf8')):null;
 for(const row of rows){
  const opening=row.blocks[0];expect(opening.type).toBe('objective');expect(opening.points).toBe(5);expect(opening.content.body.length).toBeGreaterThan(300);
  expect(row.blocks.find(b=>b.type==='example').content.body).toContain('Резултат за следващата работа');
  const i=sequence.indexOf(row.lessonId),next=sequence[i+1]||'pv11-01';expect(row.blocks.find(b=>b.key==='summary').content.nextStep).toContain(next);
  expect(row.blocks.some(b=>b.key==='practical_studio_20261015'&&b.required)).toBe(true);
  for(const b of row.blocks.filter(b=>b.key==='video_production_transfer_v1')){cases++;const studio=parseClosedStudio(b.content);expect(studio).not.toBeNull();expect(studio!.kind).toBe('decision');expect(studio!.slots).toHaveLength(5);expect(studio!.context.length).toBeGreaterThan(100);expect(studio!.change.length).toBeGreaterThan(50);expect(b.required).toBe(true);expect(b.content.left).toHaveLength(5);expect(b.content.left.filter(s=>s.phase==='change')).toHaveLength(1);}
  const after=countVisibleLessonWords(row);counts[`${row.moduleId}/${row.lessonId}`]=after;modules[row.moduleId]??={lessons:0,before:0,after:0};modules[row.moduleId].lessons++;modules[row.moduleId].after+=after;
  const old=source?.find(r=>r.lessonId===row.lessonId);if(old)modules[row.moduleId].before+=countVisibleLessonWords({...old.payload,moduleId:old.moduleId});
 }
 expect(cases).toBe(5);expect(JSON.stringify(rows)).not.toMatch(/"(?:answer_key|feedback|correctAnswer|evaluation)"\s*:/);
 if(process.env.VIDEO_WORKFLOW_METRICS)writeFileSync(process.env.VIDEO_WORKFLOW_METRICS,JSON.stringify({counts,modules,cases},null,2));
});
