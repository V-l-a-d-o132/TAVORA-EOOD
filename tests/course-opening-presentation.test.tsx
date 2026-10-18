// @vitest-environment jsdom
import React from 'react';
import {afterEach,describe,expect,it,vi} from 'vitest';
import {cleanup,fireEvent,render,screen,waitFor} from '@testing-library/react';
import {readFileSync,readdirSync} from 'node:fs';
import LessonBlockRenderer from '../src/pages/module/components/lesson-v2/LessonBlockRenderer';
import type {LessonBlockV2} from '../src/lib/lesson-engine-v2';

vi.mock('../src/lib/supabase',()=>({supabase:{rpc:vi.fn(),auth:{getUser:vi.fn()},storage:{from:vi.fn()}}}));
afterEach(cleanup);

type Page={module_id:string;lesson_id:string;first_page:LessonBlockV2;first_page_words:{before:number;after:number}};
const pages=readdirSync('scripts/course-openings/releases').filter(p=>/^s0[12]-m\d{2}\.json$/.test(p))
  .flatMap(p=>JSON.parse(readFileSync(`scripts/course-openings/releases/${p}`,'utf8')).lessons as Page[]);
describe('Detailed published lesson openings',()=>{
  it('gives each opening a specific introduction, skills, practice and a check',()=>{
    expect(pages.filter(p=>p.module_id.startsWith('s01-'))).toHaveLength(74);
    expect(pages.filter(p=>p.module_id.startsWith('s02-'))).toHaveLength(240);
    for(const p of pages){
      const c=p.first_page.content;
      expect(p.first_page.title,p.lesson_id).toBe('Какво ще можеш след урока');
      expect(String(c.body).split(/\n\s*\n/).length,p.lesson_id).toBeGreaterThanOrEqual(2);
      expect((c.outcomes as string[]).length,p.lesson_id).toBeGreaterThanOrEqual(4);
      expect(String(c.deliverable).length,p.lesson_id).toBeGreaterThan(100);
      expect(String(c.check).length,p.lesson_id).toBeGreaterThan(100);
      expect(p.first_page_words.after,p.lesson_id).toBeGreaterThan(p.first_page_words.before);
      expect(p.first_page.points,p.lesson_id).toBe(5);
    }
    expect(new Set(pages.map(p=>p.first_page.content.body)).size).toBe(pages.length);
    expect(new Set(pages.map(p=>p.first_page.content.deliverable)).size).toBe(pages.length);
    expect(new Set(pages.map(p=>p.first_page.content.check)).size).toBe(pages.length);
  });
  it('shows the full opening and its acknowledgement without a dictionary interrupting it',async()=>{
    const p=pages.find(p=>p.lesson_id==='l01-01')!;
    const submit=vi.fn(async()=>({attemptId:'test',correct:null,score:5,maxScore:5,feedback:{complete:true},progress:null}));
    render(<LessonBlockRenderer block={{...p.first_page,id:'test'}} moduleId={p.module_id} lessonId={p.lesson_id} completed={false} onStateChange={vi.fn()} onSubmit={submit}/>);
    expect(screen.getByRole('heading',{name:'Какво ще можеш след урока'})).toBeTruthy();
    expect(screen.getByRole('heading',{name:'Практически резултат'})).toBeTruthy();
    expect(screen.getByText('Как ще провериш:')).toBeTruthy();
    expect(screen.getByLabelText('5 XP')).toBeTruthy();
    expect(screen.queryByRole('complementary',{name:'Речник'})).toBeNull();
    expect(screen.getAllByRole('listitem')).toHaveLength(5);
    fireEvent.click(screen.getByRole('button',{name:'Прочетох'}));
    await waitFor(()=>expect(submit).toHaveBeenCalledWith({acknowledged:true}));
  });
  it('keeps contextual definitions available in the teaching pages',()=>{
    const p=pages.find(p=>p.lesson_id==='l01-01')!;
    render(<LessonBlockRenderer block={{...p.first_page,id:'test',key:'teaching',type:'rich_text',title:'ИИ в процеса',content:{body:'ИИ и автоматизация в CRM.'}}} moduleId={p.module_id} lessonId={p.lesson_id} completed={false} onStateChange={vi.fn()} onSubmit={vi.fn()}/>);
    expect(screen.getByRole('complementary',{name:'Речник'})).toBeTruthy();
  });
  it('shows video practice as a provided case, with the exact final exam requirements',()=>{
    const p=pages.find(p=>p.lesson_id==='pv15-13')!;
    render(<LessonBlockRenderer block={{...p.first_page,id:'video-test'}} moduleId={p.module_id} lessonId={p.lesson_id} completed={false} onStateChange={vi.fn()} onSubmit={vi.fn()}/>);
    expect(screen.getByText(/30 въпроса по предоставени случаи/)).toBeTruthy();
    expect(screen.getByText(/предишните 239 урока/)).toBeTruthy();
    expect(screen.getByText(/24 от 30 верни отговора/)).toBeTruthy();
    expect(screen.queryByRole('complementary',{name:'Речник'})).toBeNull();
    expect(screen.queryByRole('textbox')).toBeNull();
  });
});
