// @vitest-environment jsdom
import { afterEach, expect, test } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { readFileSync, writeFileSync } from 'node:fs';
import VideoProductionWorkshop from '../src/components/academy/VideoProductionWorkshop';
import ClosedPracticeStudio from '../src/components/academy/ClosedPracticeStudio';
import { parseClosedStudio } from '../src/lib/closed-practice-studio';
import { countVisibleLessonWords } from '../src/lib/academy-reading-time';
import { loadVideoProductionLessons } from '../scripts/prepare-video-production-assets.mjs';
import { videoProductionStage, videoProductionScript, videoProductionEstimate, videoProductionDossier } from '../src/data/video-production-project';
afterEach(cleanup);

test('new shooting has a distinct full-cost proposal and does not alter the base montage agreement', () => {
  expect(videoProductionEstimate(false)).toEqual({additionalHours:0,additionalExternal:0,additionalCost:0,additionalPrice:0,totalCost:120,totalPrice:160,difference:40});
  expect(videoProductionEstimate(true)).toEqual({additionalHours:3,additionalExternal:10,additionalCost:70,additionalPrice:100,totalCost:190,totalPrice:260,difference:70});
  const text=videoProductionDossier({script:'delivery',frame:'portrait-edge',light:'mixed',sound:'neural',shooting:true});
  for(const fragment of ['260 €','190 €','още не е одобрено','5 минути','не е глас на клиента','15 fps'])expect(text).toContain(fragment);
  expect(videoProductionScript('result')[0].picture).toBe('Готова чаша');
  expect(videoProductionScript('process')[0].picture).toBe('Подготовка на чашата');
  expect(videoProductionStage('s02-m02')).toBe('script');expect(videoProductionStage('s02-m05')).toBe('sound');
  for(const id of ['s02-m01','s02-m06','s03-m02','s02-m2'])expect(videoProductionStage(id)).toBeNull();
});

test('closed selections change the plan, actual media, light diagram, audio and scope calculation',()=>{
  const {container}=render(<VideoProductionWorkshop/>);
  fireEvent.change(screen.getByLabelText('Сценарна версия'),{target:{value:'delivery'}});
  expect(screen.getByRole('status',{name:''}).textContent).toContain('непотвърдени');
  fireEvent.click(screen.getByRole('button',{name:'3. Камера и кадър'}));
  fireEvent.change(screen.getByLabelText('Действителен файл за кадъра'),{target:{value:'portrait-edge'}});
  expect(screen.getByLabelText('Предоставен кадър за сравнение V-1').getAttribute('src')).toContain('portrait-edge.mp4');
  fireEvent.click(screen.getByRole('button',{name:'4. Светлина и цвят'}));
  fireEvent.change(screen.getByLabelText('Светлинен план'),{target:{value:'mixed'}});
  expect(screen.getByRole('img',{name:/друга лампа/i})).toBeTruthy();
  fireEvent.click(screen.getByRole('button',{name:'5. Звук'}));
  fireEvent.change(screen.getByLabelText('Звуков вариант'),{target:{value:'neural'}});
  expect(screen.getByLabelText('Избран звуков вариант V-1').getAttribute('src')).toContain('voice-neural.mp3');
  expect(screen.getByLabelText('Референтен звук за сравнение V-1').getAttribute('src')).toContain('voice-noise.mp3');
  fireEvent.click(screen.getByRole('button',{name:'Добави предложение за заснемане'}));
  expect(screen.getByLabelText('Разчет с предложеното заснемане').textContent).toContain('260 €');
  expect(container.querySelector('input,textarea,[contenteditable]')).toBeNull();
});

test('66 lessons preserve capacity and detailed openings, with four separate finite cases',()=>{
  const lessons=loadVideoProductionLessons();expect(lessons).toHaveLength(66);
  const before=process.env.VIDEO_PRODUCTION_SOURCE?JSON.parse(readFileSync(process.env.VIDEO_PRODUCTION_SOURCE,'utf8')):null;
  const counts:Record<string,number>={},modules:Record<string,{lessons:number;before:number;after:number}>={};let cases=0;
  for(const l of lessons){
    expect(l.blocks[0].type).toBe('objective');expect(l.blocks[0].points).toBe(5);expect(l.blocks[0].content.body.length).toBeGreaterThan(300);
    expect(l.blocks[0].content.body).toContain('V-1');expect(l.blocks[0].content.outcomes.length).toBeGreaterThanOrEqual(5);
    expect(l.blocks.some(b=>b.key==='practical_studio_20261014'&&b.required)).toBe(true);
    expect(l.blocks.find(b=>b.key==='worked_example').content.body).toContain('Допълнителен показан случай');
    expect(l.blocks.find(b=>b.key==='summary').content.nextStep).not.toContain('Ако задачата те затрудни');
    const after=countVisibleLessonWords(l),old=before?.find(r=>r.lessonId===l.lessonId);counts[`${l.moduleId}/${l.lessonId}`]=after;
    modules[l.moduleId]??={lessons:0,before:0,after:0};modules[l.moduleId].lessons++;modules[l.moduleId].after+=after;
    if(old){const n=countVisibleLessonWords({...old.payload,moduleId:old.moduleId});expect(after,l.lessonId).toBeGreaterThanOrEqual(n);modules[l.moduleId].before+=n;}
    for(const b of l.blocks.filter(b=>b.key==='video_production_transfer_v1')){
      cases++;const studio=parseClosedStudio(b.content);expect(studio).not.toBeNull();expect(studio!.slots).toHaveLength(5);expect(studio!.slots.filter(s=>s.phase==='change')).toHaveLength(1);expect(b.required).toBe(true);
      const {container,unmount}=render(<ClosedPracticeStudio studio={studio!} state={{}} busy={false} completed={false} onChange={()=>{}} onSubmit={()=>{}}/>);
      expect(container.querySelector('input,textarea,[contenteditable]')).toBeNull();unmount();
    }
  }
  expect(cases).toBe(4);expect(lessons.reduce((sum,l)=>sum+l.blocks.length,0)).toBe(900);
  const optical=lessons.filter(l=>l.moduleId==='s02-m04');expect(JSON.stringify(optical)).not.toContain('графика на звуковата вълна');
  expect(JSON.stringify(lessons)).not.toMatch(/"(?:answer_key|evaluation|feedback|correctAnswer)"\s*:/);
  if(process.env.VIDEO_PRODUCTION_METRICS)writeFileSync(process.env.VIDEO_PRODUCTION_METRICS,JSON.stringify({counts,modules,cases,decisions:20},null,2));
});
