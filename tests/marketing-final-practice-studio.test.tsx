// @vitest-environment jsdom
import React from 'react';
import { afterEach, expect, test } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { loadFinalPracticalMarketingCandidates } from '../scripts/prepare-final-practical-marketing-assets.mjs';
import { parseClosedStudio, studioBudget, studioCalculation, studioPlaylist, studioMatches } from '../src/lib/closed-practice-studio';
import { RolesPreview, MessagePreview } from '../src/components/academy/MarketingPracticePreviews';
import { MetricsPreview } from '../src/components/academy/FinalPracticePreviews';
const candidates=loadFinalPracticalMarketingCandidates();
const find=(id:string)=>parseClosedStudio(candidates.find(l=>l.lesson===id)!.practice.content)!;
const initial=(s:ReturnType<typeof find>)=>Object.fromEntries(s.slots.map(slot=>[slot.id,slot.choices[0]]));
afterEach(cleanup);

test('a new payer role replaces only that person while preserving the user and adviser',()=>{
  const s=find('lm17-01'),matches=initial(s);
  for(const [i,person,wanted]of [[0,'Дени',['seeker']],[1,'Мила',['user','approver']],[2,'Петър',['adviser']],[3,'Дени',['seeker','payer']]]as const){
    const slot=s.slots[i];matches[slot.id]=s.choices.find(c=>slot.choices.includes(c.id)&&c.role?.person===person&&JSON.stringify(c.role.roles)===JSON.stringify(wanted))!.id;
  }
  render(<RolesPreview studio={s} matches={matches}/>);
  const map=screen.getByRole('list',{name:'Карта на участниците в решението'});expect(map.querySelectorAll('li')).toHaveLength(3);
  expect(map.textContent).toContain('Мила');expect(map.textContent).toContain('Петър');
  expect(map.querySelector('li')!.textContent).toContain('Търси информация · Плаща');
});

test('a confirmed alternate reservation replaces the unconfirmed hour in the message',()=>{
  const s=find('lm17-07'),matches=initial(s);
  for(const slot of s.slots){const c=s.choices.find(c=>slot.choices.includes(c.id)&&(slot.phase==='change'?c.copy?.text.includes('номер Б81'):slot.text==='Първи статус'?c.copy?.text.startsWith('14:00 не е'):true));matches[slot.id]=c!.id;}
  render(<MessagePreview studio={s} matches={matches}/>);
  const message=screen.getByRole('article',{name:'Съобщение от избраните части'});
  expect(message.textContent).toContain('16:00 Europe/Sofia');expect(message.textContent).toContain('номер Б81');
  expect(message.textContent).not.toContain('14:00 не е потвърдено');
});

test('a zero point estimate does not turn division by zero into a zero acquisition cost',()=>{
  const s=find('lm14-09'),matches=initial(s);
  for(const slot of s.slots.filter(slot=>slot.preview)){const denominator=slot.phase==='change'?0:16;matches[slot.id]=s.choices.find(c=>slot.choices.includes(c.id)&&c.calculation?.a===480&&c.calculation.b===denominator)!.id;}
  const sums=studioPlaylist(s,matches).filter(c=>c.calculation).map(c=>studioCalculation(c.calculation!));expect(sums).toEqual([30,null]);
  render(<MetricsPreview studio={s} matches={matches}/>);expect(screen.getByText('Липсва валиден знаменател.')).toBeTruthy();
});

test('updated service labour changes the included cost and contribution without dropping external cost',()=>{
  const s=find('lm18-02'),slot=s.slots.at(-1)!;
  const selected=s.choices.find(c=>slot.choices.includes(c.id)&&c.budget?.hourly===40&&c.budget.external===90)!;
  const result=studioBudget(selected.budget!);expect(result.cost).toBe(130);expect(result.difference).toBe(50);expect(result.margin).toBeCloseTo(27.7777778);
});

test('the resource model changes its maximizing option when the separate service cap falls',()=>{
  const s=find('lm20-09'),base=s.slots.find(slot=>slot.text==='Най-голям общ принос при първия максимум')!,change=s.slots.at(-1)!;
  const values=(slot:typeof base)=>slot.choices.map(id=>s.choices.find(c=>c.id===id)!).map(c=>({text:c.text,value:studioCalculation(c.calculation!)}));
  expect(values(base).map(c=>c.value).sort((a,b)=>a!-b!)).toEqual([840,900,1100]);
  expect(values(change).map(c=>c.value).sort((a,b)=>a!-b!)).toEqual([540,660,840]);
  expect(values(base).find(c=>c.value===1100)?.text).toMatch(/^A:/);expect(values(change).find(c=>c.value===840)?.text).toMatch(/^В:/);
});

test('all visual alternatives parse completely and pasted values outside a slot cannot enter the plan',()=>{
  for(const l of candidates){const s=parseClosedStudio(l.practice.content)!;
    for(const slot of s.slots.filter(slot=>slot.preview))for(const id of slot.choices){const c=s.choices.find(c=>c.id===id)!;expect(c[s.kind==='workflow'?'flow':s.kind==='message'?'copy':s.kind==='roles'?'role':s.kind==='metrics'?'calculation':'budget'],`${l.lesson}/${slot.text}`).toBeTruthy();}
    const first=s.slots[0],last=s.slots.at(-1)!;
    expect(studioMatches(s,{matches:{[first.id]:last.choices[0],extra:'own answer'}})).toEqual({});
    if(['workflow','message'].includes(s.kind)){const field=s.kind==='workflow'?'flow':'copy';const parts=s.slots.filter(slot=>slot.phase!=='change'&&slot.preview).map(slot=>new Set(slot.choices.map(id=>s.choices.find(c=>c.id===id)![field]!.part)));expect(parts.every(set=>set.size===1),l.lesson).toBe(true);expect(new Set(parts.map(set=>[...set][0])).size,l.lesson).toBe(parts.length);}
  }
});
