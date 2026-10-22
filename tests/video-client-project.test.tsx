// @vitest-environment jsdom
import { afterEach, expect, test } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import ClosedPracticeStudio from '../src/components/academy/ClosedPracticeStudio';
import {parseClosedStudio} from '../src/lib/closed-practice-studio';
import VideoClientProject from '../src/components/academy/VideoClientProject';
import { videoClientEstimate, videoClientProposal, videoClientSrt, videoClientStage } from '../src/data/video-client-project';
import { countVisibleLessonWords } from '../src/lib/academy-reading-time';
afterEach(cleanup);
test('the full job cost responds to extra work, discount and separately quoted scope', () => {
  expect(videoClientEstimate(false, false)).toEqual({hours:5,labor:100,cost:120,price:160,difference:40});
  expect(videoClientEstimate(true, true)).toEqual({hours:7,labor:140,cost:160,price:140,difference:-20});
  expect(videoClientEstimate(true, false, true)).toEqual({hours:7,labor:140,cost:160,price:200,difference:40});
  expect(videoClientEstimate(false, false, true).price).toBe(160);
  expect(videoClientProposal(true, false, true)).toContain('Учебна цена: 200 €');
  expect(videoClientProposal(true, false, true)).toContain('Неизпратено учебно предложение');
});
test('closed controls change the actual video, subtitles, arithmetic and handoff state', () => {
  const {container}=render(<VideoClientProject />);expect(container.querySelector('input,textarea,[contenteditable]')).toBeNull();
  fireEvent.click(screen.getByRole('button',{name:'2. Сглоби историята'}));
  fireEvent.change(screen.getByLabelText('Монтажна последователност'),{target:{value:'confusing'}});
  expect(screen.getByLabelText('Действително монтиран учебен файл V-1').getAttribute('src')).toContain('/confusing.mp4');
  fireEvent.change(screen.getByLabelText('Текст за субтитрите'),{target:{value:'delivery'}});
  expect(screen.getByRole('status').textContent).toContain('връща за редакция');
  expect(screen.getByLabelText('Избрани субтитри V-1').textContent).toContain('Доставяме');
  fireEvent.click(screen.getByRole('button',{name:'3. Сметни работата'}));
  fireEvent.click(screen.getByRole('button',{name:'Добави втори кръг корекции · +2 ч.'}));
  fireEvent.click(screen.getByRole('button',{name:'Добави отстъпка · 20 €'}));
  expect(screen.getByRole('status').textContent).toContain('-20 €');
  fireEvent.click(screen.getByRole('button',{name:'Предложи +40 € за втория кръг'}));
  expect(screen.getByRole('status').textContent).toContain('180 €');
  fireEvent.click(screen.getByRole('button',{name:'4. Предай резултата'}));
  fireEvent.change(screen.getByLabelText('Получено състояние на проекта'),{target:{value:'accepted'}});
  expect(screen.getByRole('status').textContent).toContain('статус в симулацията');
  expect(container.querySelector('input,textarea,[contenteditable]')).toBeNull();
});
test('all 15 module bridges are stable and the selected SRT is honest about its content', () => {
  for(let i=1;i<=15;i++)expect(videoClientStage(`s02-m${String(i).padStart(2,'0')}`)?.number).toBe(i);
  for(const id of ['s03-m01','s02-m16','s02-m00','../s02-m01'])expect(videoClientStage(id)).toBeNull();
  expect(videoClientSrt('verified')).toContain('Получаване на място.');
  expect(videoClientSrt('delivery')).toContain('Доставяме до дома за 5 минути.');
});
test('all 24 lessons retain detailed openings and private grading stays outside the exports', () => {
  const dir='course-assets/perfect-video/first-client/lessons';const lessons=readdirSync(dir).filter(f=>f.endsWith('.json')).map(f=>JSON.parse(readFileSync(`${dir}/${f}`,'utf8')));
  expect(lessons).toHaveLength(24);const counts={};
  for(const l of lessons){expect(l.blocks[0].type).toBe('objective');expect(l.blocks[0].points).toBe(5);expect(l.blocks[0].content.body).toContain('V-1');
    expect(l.blocks.some(b=>b.key==='practical_studio_20261014'&&b.required)).toBe(true);
    expect(JSON.stringify(l)).not.toMatch(/"(?:answer_key|evaluation|correctAnswer|feedback)"\s*:/);
    counts[`${l.moduleId}/${l.lessonId}`]=countVisibleLessonWords(l);
  }
  if(process.env.VIDEO_CLIENT_COUNTS)writeFileSync(process.env.VIDEO_CLIENT_COUNTS,JSON.stringify(counts,null,2));
});

test('the independent final case renders four finite decisions including a changed condition',()=>{
 const l=JSON.parse(readFileSync('course-assets/perfect-video/first-client/lessons/pv01-24.json','utf8'));const b=l.blocks.find(b=>b.key==='video_client_transfer_v1');expect(b.required).toBe(true);const studio=parseClosedStudio(b.content);expect(studio).not.toBeNull();expect(studio!.slots).toHaveLength(4);expect(studio!.slots.filter(s=>s.phase==='change')).toHaveLength(1);
 const {container}=render(<ClosedPracticeStudio studio={studio!} state={{}} busy={false} completed={false} onChange={()=>{}} onSubmit={()=>{}}/>);expect(container.querySelector('input,textarea,[contenteditable]')).toBeNull();
});
