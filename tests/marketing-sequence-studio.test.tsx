// @vitest-environment jsdom
import React,{useState} from 'react';import {afterEach,expect,test,vi} from 'vitest';
import {cleanup,fireEvent,render,screen,within} from '@testing-library/react';
import ClosedPracticeStudio from '../src/components/academy/ClosedPracticeStudio';
import {parseClosedStudio,studioPlanText} from '../src/lib/closed-practice-studio';
import {loadMarketingSequenceCandidates,prepareMarketingSequenceAssets} from '../scripts/prepare-marketing-sequence-assets.mjs';
const cases=loadMarketingSequenceCandidates().flatMap(r=>r.payload.additions.filter(b=>b.type==='matching'));afterEach(cleanup);
test('public package has complete coverage and no grading keys',()=>{expect(()=>prepareMarketingSequenceAssets()).not.toThrow();expect(cases).toHaveLength(10);});
for(const b of cases)test(b.title+' builds a brief, replaces one part, and checks independent transfer',()=>{
 const studio=parseClosedStudio(b.content)!;expect(studio.kind).toBe('brief');expect(studio.slots).toHaveLength(7);const onSubmit=vi.fn();
 function Harness(){const[state,onChange]=useState({});return <ClosedPracticeStudio studio={studio} state={state} onChange={onChange} onSubmit={onSubmit} busy={false} completed={false}/>;}
 render(<Harness/>);expect(screen.getAllByRole('combobox')).toHaveLength(5);const brief=screen.getByRole('article',{name:'Задание от избраните части'});
 for(const slot of studio.slots.slice(0,5))fireEvent.change(screen.getByRole('combobox',{name:slot.text}),{target:{value:slot.choices[0]}});
 expect(brief.querySelectorAll('section')).toHaveLength(5);expect(screen.getAllByText(studio.change)).toHaveLength(1);expect(screen.getAllByRole('combobox')).toHaveLength(7);
 const change=studio.slots[5],chosen=studio.choices.find(c=>c.id===change.choices[0])!;
 fireEvent.change(screen.getByRole('combobox',{name:change.text}),{target:{value:chosen.id}});expect(within(brief).getByText(chosen.document!.text)).toBeTruthy();expect(brief.querySelectorAll('section')).toHaveLength(5);
 expect((screen.getByRole('button',{name:'Провери решенията'})as HTMLButtonElement).disabled).toBe(true);
 const transfer=studio.slots[6];fireEvent.change(screen.getByRole('combobox',{name:transfer.text}),{target:{value:transfer.choices[0]}});
 expect(brief.querySelectorAll('section')).toHaveLength(5);expect(document.querySelector('input,textarea,[contenteditable="true"]')).toBeNull();fireEvent.click(screen.getByRole('button',{name:'Провери решенията'}));expect(onSubmit).toHaveBeenCalledOnce();
 const matches=Object.fromEntries(studio.slots.map(s=>[s.id,s.choices[0]])),exported=studioPlanText(studio,matches);expect(exported).toContain(studio.change);expect(exported).toContain(chosen.text);expect(exported).toContain('не удостоверява оценка');
});
