// @vitest-environment jsdom
import {afterEach,expect,test,vi} from 'vitest';
import {cleanup,fireEvent,render,screen,within} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {useState} from 'react';
import {loadPracticalSilkCandidates} from '../scripts/prepare-practical-silk-assets.mjs';
import {parseClosedStudio,studioCalculation,studioMatches,studioPlaylist} from '../src/lib/closed-practice-studio';
import {BriefPreview,PagePreview,SearchPreview} from '../src/components/academy/SilkPracticePreviews';
import ClosedPracticeStudio from '../src/components/academy/ClosedPracticeStudio';
import {FreeSilkBridge,FreeSilkJourney} from '../src/components/academy/FreeSilkJourney';
import {readFreeSilkProgress,saveFreeSilkProgress,freeSilkDeviceSummary} from '../src/lib/free-silk-progress';
import {restoreFreeSilkToAccount} from '../src/lib/restore-free-silk';
import type {LessonV2} from '../src/lib/lesson-engine-v2';
const lessons=loadPracticalSilkCandidates();
const find=id=>parseClosedStudio(lessons.find(l=>l.lesson===id).practice.content)!;
const initial=s=>Object.fromEntries(s.slots.filter(s=>s.phase!=='change').map(slot=>[slot.id,slot.choices[0]]));
afterEach(()=>{cleanup();localStorage.clear();vi.restoreAllMocks();});

test('a new source replaces the old one in the brief while keeping its other parts',()=>{
 const s=find('l01-02'),matches=initial(s);
 for(const slot of s.slots){const choice=s.choices.find(c=>slot.choices.includes(c.id)&&(!c.document||slot.phase!=='change'||c.document.text.startsWith('Използвай О-2')));matches[slot.id]=choice!.id;}
 render(<BriefPreview studio={s} matches={matches}/>);const brief=screen.getByRole('article',{name:'Задание от избраните части'});
 expect(brief.textContent).toContain('О-2');expect(brief.textContent).not.toContain('Използвай О-1');expect(brief.querySelectorAll('section')).toHaveLength(3);
});
test('price updates replace the old page terms without dropping its action',()=>{
 const s=find('l02-01'),matches=initial(s);
 for(const slot of s.slots){const choice=s.choices.find(c=>slot.choices.includes(c.id)&&(slot.phase==='change'?c.page?.text.includes('материали 8'):true));matches[slot.id]=choice!.id;}
 render(<PagePreview studio={s} matches={matches}/>);const page=screen.getByRole('article',{name:'Преглед на учебната страница'});
 expect(page.textContent).toContain('материали 8');expect(page.textContent).not.toContain('материалите са включени');expect(page.querySelectorAll('p')).toHaveLength(2);
});
test('search text updates the price without promising a real Google result',()=>{
 const s=find('l03-02'),matches=initial(s);
 for(const slot of s.slots){const choice=s.choices.find(c=>slot.choices.includes(c.id)&&(slot.phase==='change'?c.search?.text.startsWith('Диагностика: 32'):true));matches[slot.id]=choice!.id;}
 render(<SearchPreview studio={s} matches={matches}/>);const snippet=screen.getByRole('article',{name:'Учебен преглед на заглавие и описание'});
 expect(snippet.textContent).toContain('32 евро');expect(snippet.textContent).not.toContain('28 евро');expect(screen.getByText(/не е резултат от Google/)).toBeTruthy();
});
test('the accepted-result calculation changes when the denominator changes',()=>{
 const s=find('l01-03'),base=s.slots[0],change=s.slots.at(-1)!;
 const a=s.choices.find(c=>base.choices.includes(c.id)&&c.calculation?.b===12)!;
 const b=s.choices.find(c=>change.choices.includes(c.id)&&c.calculation?.a===90&&c.calculation.b===15)!;
 expect(studioCalculation(a.calculation!)).toBe(5);expect(studioCalculation({...a.calculation!,b:8})).toBe(7.5);expect(studioCalculation(b.calculation!)).toBe(6);
});
test('changed conditions stay hidden until the learner makes the base decisions',()=>{
 const s=find('l01-02');function Harness(){const[state,setState]=useState({});return <ClosedPracticeStudio studio={s} state={state} busy={false} completed={false} onChange={setState} onSubmit={()=>{}}/>;}
 const {container}=render(<Harness/>);expect(screen.queryByText(s.change,{exact:true})).toBeNull();expect(screen.getByRole('button',{name:'Провери решенията'}).hasAttribute('disabled')).toBe(true);
 for(const slot of s.slots.filter(s=>s.phase!=='change'))fireEvent.change(screen.getByRole('combobox',{name:slot.text}),{target:{value:slot.choices[0]}});
 expect(screen.getByText(s.change,{exact:true})).toBeTruthy();const slot=s.slots.at(-1)!;fireEvent.change(screen.getByRole('combobox',{name:slot.text}),{target:{value:slot.choices[0]}});
 expect(screen.getByRole('button',{name:'Провери решенията'}).hasAttribute('disabled')).toBe(false);expect(container.querySelector('input,textarea,[contenteditable="true"]')).toBeNull();
});
test('untrusted draft choices cannot borrow operations from another slot',()=>{
 const s=find('l01-02');const matches=studioMatches(s,{matches:{[s.slots[0].id]:s.slots[1].choices[0],freeText:'произволно'}});expect(matches).toEqual({});expect(studioPlaylist(s,matches)).toEqual([]);
});
test('the free introduction offers the four-step work without a purchase demand',()=>{
 const {container}=render(<MemoryRouter><FreeSilkJourney completedLessons={['l01-01']} activeLessonId="l01-02" guest/></MemoryRouter>);
 expect(screen.getByText(/1 от 4 урока преминати/)).toBeTruthy();fireEvent.click(screen.getByText(/1 от 4 урока преминати/));expect(container.querySelectorAll('a[href^="/module/s01-m01"]')).toHaveLength(4);expect(container.querySelector('a[href*="checkout"]')).toBeNull();expect(screen.getByText(/не е запис в профил/)).toBeTruthy();
});
test('the completion bridge uses the actual course tier and keeps a return route',()=>{
 const {container}=render(<MemoryRouter><FreeSilkBridge canContinue={false}/></MemoryRouter>);
 expect(container.querySelector('a[href="/kurs/checkout?tier=koprinena-pateka"]')).toBeTruthy();expect(container.querySelector('a[href="/kurs/ai-business-blueprint"]')).toBeTruthy();expect(screen.getByText(/извършена клиентска услуга/)).toBeTruthy();expect(container.querySelector('a[href*="l01-01"]')).toBeTruthy();
});
test('an owner of the next module gets continuation without another purchase link',()=>{
 const {container}=render(<MemoryRouter><FreeSilkBridge canContinue/></MemoryRouter>);expect(container.querySelector('a[href="/module/s01-m02"]')).toBeTruthy();expect(container.querySelector('a[href*="checkout"]')).toBeNull();
});
function guestLesson(){const l=lessons[0];return {id:'guest-lesson',moduleId:l.module,lessonId:l.lesson,versionId:'guest-v1',version:1,title:l.title,blocks:[{...l.practice,id:'guest-block',position:0}],status:'published',sourceKind:'editor',objective:l.opening.body} as LessonV2;}
test('guest memory keeps finite choices and actual block points, then clears on a new version',()=>{
 const l=guestLesson(),s=parseClosedStudio(l.blocks[0].content)!;const state={matches:{...initial(s),[s.slots.at(-1)!.id]:s.slots.at(-1)!.choices[0]},text:'да не се съхранява',file:'private.pdf'};
 saveFreeSilkProgress(l,l.blocks[0].key,{[l.blocks[0].key]:state},new Set([l.blocks[0].key,'unknown-block']));const saved=readFreeSilkProgress(l)!;
 expect(saved.xp).toBe(20);expect(saved.completedBlockKeys).toEqual([l.blocks[0].key]);expect(saved.blockState[l.blocks[0].key]).not.toHaveProperty('text');expect(JSON.stringify(saved)).not.toContain('private.pdf');expect(freeSilkDeviceSummary().completedLessonIds).toEqual(['l01-01']);
 expect(readFreeSilkProgress({...l,versionId:'guest-v2'})).toBeNull();expect(freeSilkDeviceSummary().completedLessonIds).toEqual([]);
});
test('guest storage does not retain paid-course progress and tolerates denied storage',()=>{
 const l=guestLesson();saveFreeSilkProgress({...l,moduleId:'s01-m02'},null,{},new Set());expect(localStorage.length).toBe(0);
 vi.spyOn(Storage.prototype,'setItem').mockImplementation(()=>{throw Error('Storage blocked');});expect(()=>saveFreeSilkProgress(l,null,{},new Set())).not.toThrow();
});
test('account restoration regrades finite answers and never imports a local completion flag or XP',async()=>{
 const l=guestLesson(),s=parseClosedStudio(l.blocks[0].content)!;saveFreeSilkProgress(l,l.blocks[0].key,{[l.blocks[0].key]:{matches:initial(s),text:'не е отговор'}},new Set([l.blocks[0].key]));
 const onProgress=vi.fn(),grade=vi.fn(async()=>({feedback:{complete:false},progress:{completed_block_keys:[],xp:0,completed_at:null}}));
 const result=await restoreFreeSilkToAccount(onProgress,{fetchLesson:async(module,id)=>({...l,moduleId:module,lessonId:id,progress:null}),grade} as any);
 expect(grade).toHaveBeenCalledTimes(1);const submitted=grade.mock.calls[0] as any[];expect(Object.keys(submitted[2])).toEqual(['matches']);expect(submitted[2]).not.toHaveProperty('xp');expect(submitted[2]).not.toHaveProperty('completed');expect(result.needsReview).toEqual(['l01-01']);expect(freeSilkDeviceSummary().completedLessonIds).toEqual(['l01-01']);expect(onProgress.mock.calls[0][1].xp).toBe(0);
});
test('confirmed account credit clears only the transferred guest snapshot',async()=>{
 const l=guestLesson(),s=parseClosedStudio(l.blocks[0].content)!;saveFreeSilkProgress(l,l.blocks[0].key,{[l.blocks[0].key]:{matches:initial(s)}},new Set([l.blocks[0].key]));
 const onProgress=vi.fn(),grade=vi.fn(async()=>({feedback:{complete:true},progress:{completed_block_keys:[l.blocks[0].key],xp:20,completed_at:'2026-10-16T09:00:00Z',mastery_status:'mastered'}}));
 const result=await restoreFreeSilkToAccount(onProgress,{fetchLesson:async(module,id)=>({...l,moduleId:module,lessonId:id,progress:null}),grade} as any);
 expect(result).toEqual({restored:1,needsReview:[]});expect(freeSilkDeviceSummary().completedLessonIds).toEqual([]);expect(onProgress.mock.calls[0][1].completedAt).toBe('2026-10-16T09:00:00Z');
});
test('an invalid visual configuration cannot inject a URL, style object or HTML execution',()=>{
 const content=structuredClone(lessons.find(l=>l.lesson==='l02-01').practice.content);for(const c of content.right){c.preview={page:{part:'terms',text:'<script>not executable</script>',width:'javascript:alert(1)',style:{background:'red'}}};}
 const s=parseClosedStudio(content)!;const choice=s.choices[0];expect(choice.page).not.toHaveProperty('style');expect(choice.page?.width).toBeUndefined();
 const matches=Object.fromEntries(s.slots.filter(s=>s.phase==='base').map(slot=>[slot.id,slot.choices[0]]));const {container}=render(<PagePreview studio={s} matches={matches}/>);expect(container.querySelector('script')).toBeNull();expect(within(screen.getByRole('article',{name:'Преглед на учебната страница'})).getByText('<script>not executable</script>')).toBeTruthy();
});
