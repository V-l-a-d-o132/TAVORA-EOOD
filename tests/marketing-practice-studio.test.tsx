// @vitest-environment jsdom
import React, { useState } from 'react';
import { afterEach, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import ClosedPracticeStudio from '../src/components/academy/ClosedPracticeStudio';
import { parseClosedStudio, studioMessage, studioPlanText, studioMatches } from '../src/lib/closed-practice-studio';
import { loadPracticalMarketingCandidates } from '../scripts/prepare-practical-marketing-assets.mjs';
const lessons=loadPracticalMarketingCandidates();
const parsed=(id:string)=>parseClosedStudio(lessons.find(l=>l.lesson===id)!.practice.content)!;
const props={busy:false,completed:false,onChange:vi.fn(),onSubmit:vi.fn()};
afterEach(cleanup);

test('a selected message changes its terms after the new condition, keeping the other parts',()=>{
  const studio=parsed('lm01-00');
  const initial=studio.slots.filter(s=>s.phase==='base');
  const matches=Object.fromEntries(initial.map(slot=>[slot.id,studio.choices.find(c=>slot.choices.includes(c.id)&&c.copy?.text.startsWith(slot===initial[0]?'Печат на':slot===initial[1]?'Получаваш':slot===initial[2]?'6 €':'Изпрати'))?.id||slot.choices[0]]));
  const oldTerms=studio.choices.find(c=>initial[2].choices.includes(c.id)&&c.copy?.text.includes('16:00'))!;
  matches[initial[2].id]=oldTerms.id;
  const changed=studio.slots.at(-1)!,newTerms=studio.choices.find(c=>changed.choices.includes(c.id)&&c.copy?.text.includes('17:00'))!;
  const before=studioMessage(studio,matches);
  matches[changed.id]=newTerms.id;
  const after=studioMessage(studio,matches);
  expect(before.find(p=>p.part==='terms')?.text).toContain('16:00');
  expect(after.filter(p=>p.part==='terms')).toHaveLength(1);
  expect(after.find(p=>p.part==='terms')?.text).toContain('17:00');
  expect(after.filter(p=>p.part!=='terms')).toEqual(before.filter(p=>p.part!=='terms'));
  render(<ClosedPracticeStudio {...props} studio={studio} state={{matches}}/>);
  const message=screen.getByRole('article',{name:'Съобщение от избраните части'});
  expect(message.textContent).toContain(newTerms.copy!.text);
  expect(message.textContent).not.toContain(oldTerms.copy!.text);
  expect(screen.getByRole('link',{name:'Произход на учебния материал'}).getAttribute('href')).toContain('/marketing/practical/SOURCES.md');
  expect(document.querySelector('input,textarea')).toBeNull();
});
test('a person may hold two roles and a change replaces that person without discarding the others',()=>{
  const studio=parsed('lm02-01'),matches:Record<string,string>={};
  for(const slot of studio.slots.filter(s=>s.phase==='base')){
    const choice=studio.choices.find(c=>slot.choices.includes(c.id)&&c.role?.person===(slot===studio.slots[0]?'Ива':slot===studio.slots[1]?'Никола':slot===studio.slots[2]?'Борис':'Деси')&&(slot===studio.slots[2]?c.role.roles.includes('payer')&&c.role.roles.includes('approver'):true))!;
    matches[slot.id]=choice.id;
  }
  const last=studio.slots.at(-1)!,iva=studio.choices.find(c=>last.choices.includes(c.id)&&c.role?.roles.includes('seeker')&&c.role.roles.includes('user'))!;
  matches[last.id]=iva.id;
  render(<ClosedPracticeStudio {...props} studio={studio} state={{matches}}/>);
  const people=screen.getByRole('list',{name:'Карта на участниците в решението'});
  expect(people.querySelectorAll('li')).toHaveLength(4);
  const ivaCard=[...people.querySelectorAll('li')].find(e=>e.textContent?.startsWith('Ива'))!;
  expect(ivaCard.textContent).toContain('Търси информация · Използва');
  expect(people.textContent).toContain('Одобрява');expect(people.textContent).toContain('Плаща');
});
test('the changed task unlocks after the initial plan and the local export contains text rather than identifiers',()=>{
  const studio=parsed('lm03-01');
  function Harness(){const[state,change]=useState({});return <ClosedPracticeStudio {...props} studio={studio} state={state} onChange={change}/>;}
  render(<Harness/>);
  expect(screen.queryByText(studio.change)).toBeNull();
  for(const slot of studio.slots)fireEvent.change(screen.getByRole('combobox',{name:slot.text}),{target:{value:slot.choices[0]}});
  expect(screen.getByText(studio.change)).toBeTruthy();
  expect((screen.getByRole('button',{name:'Провери решенията'})as HTMLButtonElement).disabled).toBe(false);
  const matches=Object.fromEntries(studio.slots.map(s=>[s.id,s.choices[0]]));
  const plan=studioPlanText(studio,matches);expect(plan).toContain(studio.change);
  for(const id of Object.values(matches))expect(plan).not.toContain(id);
  expect(plan).toContain('не удостоверява оценка');
  expect(studioMatches(studio,{matches:{...matches,unknown:'free'},text:'pasted',file:'data:file'})).toEqual(matches);
});
test('invalid role names and arbitrary message parts are ignored and older studios still parse',()=>{
  const content=structuredClone(lessons.find(l=>l.lesson==='lm02-01')!.practice.content);
  content.right[0].preview={role:{person:'Someone',roles:['https://example.invalid'],detail:'x'},copy:{part:'html',text:'<script>alert(1)</script>'}};
  const studio=parseClosedStudio(content)!;
  expect(studio.choices[0].role).toBeUndefined();expect(studio.choices[0].copy).toBeUndefined();
  for(const l of lessons){const old=structuredClone(l.practice.content);delete old.studio.productionKind;delete old.studio.domain;delete old.studio.change;delete old.studio.initialContext;expect(parseClosedStudio(old)?.kind).toBe('decision');}
});
