// @vitest-environment jsdom
import React from 'react';
import { afterEach, expect, test, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import ClosedPracticeStudio from '../src/components/academy/ClosedPracticeStudio';
import { parseClosedStudio, studioWorkflow, studioMatches, studioCalculation, studioBudget, studioPlaylist, studioMessage } from '../src/lib/closed-practice-studio';
import { loadNextPracticalMarketingCandidates } from '../scripts/prepare-next-practical-marketing-assets.mjs';
const lessons=loadNextPracticalMarketingCandidates();
const parsed=(id:string)=>parseClosedStudio(lessons.find(l=>l.lesson===id)!.practice.content)!;
const props={busy:false,completed:false,onChange:vi.fn(),onSubmit:vi.fn()};
afterEach(cleanup);

test('a qualified inquiry replaces its earlier status without losing the record and responsible person',()=>{
  const studio=parsed('lm08-05');
  const pick=(slot:number,part:string)=>studio.choices.find(c=>studio.slots[slot].choices.includes(c.id)&&c.text.startsWith(part))!;
  const matches=Object.fromEntries([pick(0,'Един запис'),pick(1,'Лора е назначена'),pick(2,'Получено запитване')].map((c,i)=>[studio.slots[i].id,c.id]));
  const before=studioWorkflow(studio,matches);
  matches[studio.slots[3].id]=pick(3,'Поето и подходящо').id;
  const after=studioWorkflow(studio,matches);
  expect(after.filter(p=>p.part==='outcome')).toHaveLength(1);
  expect(after.at(-1)?.detail).toContain('приемане на оферта още предстои');
  expect(after.filter(p=>p.part!=='outcome')).toEqual(before.filter(p=>p.part!=='outcome'));
  render(<ClosedPracticeStudio {...props} studio={studio} state={{matches}}/>);
  const flow=screen.getByRole('list',{name:'Схема на избрания работен процес'});
  expect(flow.querySelectorAll('li')).toHaveLength(3);
  expect(flow.textContent).toContain('Лора е назначена');
  expect(flow.textContent).not.toContain('Получено запитване, очакващо');
  expect(document.querySelector('input,textarea')).toBeNull();
});

test('a saved changed status stays hidden until the initial decisions are present; pasted content is discarded',()=>{
  const studio=parsed('lm08-05'),change=studio.slots.at(-1)!;
  const matches={[change.id]:change.choices[0]};
  expect(studioWorkflow(studio,matches)).toEqual([]);
  expect(studioMatches(studio,{matches:{...matches,extra:'text'},text:'own answer',file:'data:binary'})).toEqual(matches);
  render(<ClosedPracticeStudio {...props} studio={studio} state={{matches}}/>);
  expect(screen.queryByText(studio.change)).toBeNull();
  expect((screen.getByRole('button',{name:'Провери решенията'}) as HTMLButtonElement).disabled).toBe(true);
});

test('the selected arithmetic separates overlapping attribution from unique orders and recomputes the next period',()=>{
  const studio=parsed('lm09-13');
  const base=Object.fromEntries(studio.slots.filter(s=>s.phase==='base').map(s=>[s.id,s.choices[0]]));
  const initial=studio.choices.find(c=>c.calculation?.a===300&&c.calculation.b===12)!;
  base[studio.slots[1].id]=initial.id;
  expect(studioCalculation(initial.calculation!)).toBe(25);
  const changed=studio.choices.find(c=>c.calculation?.a===280&&c.calculation.b===14)!;
  base[studio.slots.at(-1)!.id]=changed.id;
  const calculations=studioPlaylist(studio,base).flatMap(c=>c.calculation?[c.calculation]:[]);
  expect(calculations.map(studioCalculation)).toEqual([25,20]);
  expect(calculations[0].bLabel).toContain('уникални');
  expect(studioCalculation({...initial.calculation!,b:0})).toBeNull();
});

test('the quarter plan includes labour and content, then updates the labour when the journal changes',()=>{
  const studio=parsed('lm09-14');
  const initial=studio.choices.find(c=>c.budget?.hours===6&&c.budget.external===320)!;
  const changed=studio.choices.find(c=>c.budget?.hours===8&&c.budget.external===320)!;
  expect(studioBudget(initial.budget!).cost).toBe(440);
  expect(studioBudget(changed.budget!).cost).toBe(480);
  expect(800-studioBudget(changed.budget!).cost).toBe(320);
  expect(studioBudget(changed.budget!).cost/6).toBe(80);
});

test('the moved AI lesson changes only the known opening hours, preserving pickup and the next step',()=>{
  const studio=parsed('lm01-01');
  const starts=['Печат A3 от','Доставка не се','Уточняват се','Получаване на място;'];
  const matches=Object.fromEntries(studio.slots.map((s,i)=>[s.id,studio.choices.find(c=>s.choices.includes(c.id)&&c.text.startsWith(starts[i]))!.id]));
  const parts=studioMessage(studio,matches);
  expect(parts.filter(p=>p.part==='terms')).toHaveLength(1);
  expect(parts.find(p=>p.part==='terms')?.text).toContain('вторник 09:00–16:00');
  expect(parts.find(p=>p.part==='headline')?.text).toContain('готов PDF');
  expect(parts.find(p=>p.part==='action')?.text).toContain('размерът и броят');
});

test('unrecognized workflow fields never enter a preview and every workflow alternative is complete',()=>{
  const raw=structuredClone(lessons.find(l=>l.lesson==='lm08-05')!.practice.content);
  raw.right[0].preview={flow:{part:'javascript',title:'Arbitrary',detail:'not an allowed stage'}};
  expect(parseClosedStudio(raw)?.choices[0].flow).toBeUndefined();
  const workflows=lessons.map(l=>parseClosedStudio(l.practice.content)!).filter(s=>s.kind==='workflow');
  expect(workflows).toHaveLength(25);
  for(const s of workflows)for(const slot of s.slots)expect(s.choices.filter(c=>slot.choices.includes(c.id)&&c.flow)).toHaveLength(3);
});
