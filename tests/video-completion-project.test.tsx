// @vitest-environment jsdom
import {afterEach,expect,test} from 'vitest';
import {cleanup,fireEvent,render,screen} from '@testing-library/react';
import {readFileSync,writeFileSync} from 'node:fs';
import VideoCompletionWorkshop from '../src/components/academy/VideoCompletionWorkshop';
import {INITIAL_COMPLETION,updateVideoCompletion,videoCompletionReview,videoCompletionDossier} from '../src/data/video-completion-project';
import {loadVideoCompletionLessons} from '../scripts/prepare-video-completion-assets.mjs';
import {VIDEO_COMPLETION_LESSON_ORDER as order} from '../src/data/video-completion-order';
import {LEARNING_SECTIONS,PREVIOUS_VIDEO_WORKFLOW_LESSONS} from '../src/mocks/learning-platform';
import {lessonRoute,requestedLessonIndex} from '../src/lib/academy-lesson-location';
import {parseClosedStudio} from '../src/lib/closed-practice-studio';
import {countVisibleLessonWords} from '../src/lib/academy-reading-time';
afterEach(cleanup);
test('cost, payment and acceptance remain distinct when scope or file changes',()=>{
 const finished={...INITIAL_COMPLETION,scope:'agreed',caption:'verified',acceptance:'accepted',payment:'base',portfolio:'honest',report:'bounded'} as const;
 expect(videoCompletionReview(finished)).toMatchObject({cost:160,price:210,difference:50,paid:160,balance:50,issues:[],deliveryReady:true});
 expect(videoCompletionReview({...finished,scope:'unquoted'})).toMatchObject({cost:160,price:160,difference:0,deliveryReady:false});
 for(const key of ['scope','caption'] as const){const changed=updateVideoCompletion(finished,key,INITIAL_COMPLETION[key]);expect(changed.acceptance).toBe('pending');expect(changed.payment).toBe('base');expect(changed.revision).toBe(2);}
 expect(updateVideoCompletion(finished,'scope','arbitrary')).toBe(finished);
 expect(videoCompletionReview({...finished,ai:'slow'})).toMatchObject({minutes:37,saved:-2});expect(videoCompletionReview({...finished,ai:'fast'})).toMatchObject({minutes:25,saved:10});
 expect(videoCompletionDossier(finished,'delivery')).not.toContain('Вътрешен разчет');expect(videoCompletionDossier(finished,'internal')).toContain('Вътрешен разчет');expect(videoCompletionDossier(finished,'portfolio')).toContain('Учебен монтаж');
});
test('finite UI choices update SRT and reset acceptance without uploading or writing free text',()=>{
 const {container}=render(<VideoCompletionWorkshop/>);
 fireEvent.click(screen.getByRole('button',{name:'14. Корекция и приемане'}));
 fireEvent.change(screen.getByLabelText('Надписи за текущата версия'),{target:{value:'verified'}});
 expect(screen.getByLabelText('Финални субтитри').textContent).toContain('Получаване на място');
 fireEvent.change(screen.getByLabelText('Запис за приемане'),{target:{value:'accepted'}});
 fireEvent.change(screen.getByLabelText('Надписи за текущата версия'),{target:{value:'delivery'}});
 expect((screen.getByLabelText('Запис за приемане') as HTMLSelectElement).value).toBe('pending');
 expect(container.querySelector('input,textarea,[contenteditable]')).toBeNull();
});
test('all legacy indexes retain identity and new routes use stable lesson IDs',()=>{
 for(const [id,ids] of Object.entries(order)){
  const m=LEARNING_SECTIONS.flatMap(s=>s.modules).find(m=>m.id===id)!;expect(m.lessons.map(l=>l.id)).toEqual(ids);
  for(const [i,old] of PREVIOUS_VIDEO_WORKFLOW_LESSONS[id].entries())expect(m.lessons[requestedLessonIndex(m,String(i))].id).toBe(old);
  m.lessons.forEach((l,i)=>expect(lessonRoute(id,l.id,i)).toContain(`lesson=${l.id}`));
 }
 expect(order['s02-m13'].indexOf('pv13-03')).toBeLessThan(order['s02-m13'].indexOf('pv13-13'));
 expect(order['s02-m14'].indexOf('pv14-04')).toBeLessThan(order['s02-m14'].indexOf('pv14-07'));
});
test('73 lessons have detailed openings, handoffs, independent cases and unchanged closed assessment structure',()=>{
 const rows=loadVideoCompletionLessons(),sequence=Object.values(order).flat(),counts:Record<string,number>={},modules:Record<string,any>={};let cases=0;
 const source=process.env.VIDEO_COMPLETION_SOURCE?JSON.parse(readFileSync(process.env.VIDEO_COMPLETION_SOURCE,'utf8')):null;
 expect(rows).toHaveLength(73);
 for(const l of rows){
  expect(l.blocks[0]).toMatchObject({type:'objective',points:5,title:'Какво ще можеш след урока'});expect(l.blocks[0].content.body.length).toBeGreaterThan(300);expect(l.blocks[0].content.outcomes.length).toBeGreaterThanOrEqual(5);
  const index=sequence.indexOf(l.lessonId);if(index<sequence.length-1)expect(l.blocks.find(b=>b.key==='summary').content.nextStep).toContain(sequence[index+1]);
  expect(l.blocks.some(b=>b.key==='practical_studio_final_20261015'&&b.required)).toBe(true);
  for(const b of l.blocks.filter(b=>b.key==='video_production_transfer_v1')){cases++;const studio=parseClosedStudio(b.content);expect(studio!.kind).toBe('decision');expect(studio!.slots).toHaveLength(5);expect(studio!.change.length).toBeGreaterThan(50);if(l.lessonId==='pv15-13')expect(l.blocks.indexOf(b)).toBeLessThan(l.blocks.findIndex(b=>b.type==='course_exam'));}
  const after=countVisibleLessonWords(l);counts[`${l.moduleId}/${l.lessonId}`]=after;modules[l.moduleId]??={lessons:0,before:0,after:0};modules[l.moduleId].lessons++;modules[l.moduleId].after+=after;const old=source?.find(r=>r.lessonId===l.lessonId);if(old)modules[l.moduleId].before+=countVisibleLessonWords({...old.payload,moduleId:old.moduleId});
 }
 expect(cases).toBe(5);expect(rows.reduce((n,l)=>n+l.blocks.length,0)).toBe(965);expect(JSON.stringify(rows)).not.toMatch(/"(?:answer_key|feedback|evaluation|correctAnswer)"\s*:|монтажна линия-а/);
 if(process.env.VIDEO_COMPLETION_METRICS)writeFileSync(process.env.VIDEO_COMPLETION_METRICS,JSON.stringify({counts,modules,cases},null,2));
});
