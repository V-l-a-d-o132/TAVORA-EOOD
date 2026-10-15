// @vitest-environment jsdom
import React from 'react';
import { afterEach, expect, test, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import ClosedPracticeStudio from '../src/components/academy/ClosedPracticeStudio';
import { parseClosedStudio, studioWorkflow, studioMessage, studioMatches, studioCalculation, studioBudget } from '../src/lib/closed-practice-studio';
import { loadThirdPracticalMarketingCandidates } from '../scripts/prepare-third-practical-marketing-assets.mjs';
const lessons=loadThirdPracticalMarketingCandidates();
const parsed=(id:string)=>parseClosedStudio(lessons.find(l=>l.lesson===id)!.practice.content)!;
const props={busy:false,completed:false,onChange:vi.fn(),onSubmit:vi.fn()};
afterEach(cleanup);

test('a revised price history changes only the discount headline, keeping the real delivery and end',()=>{
  const studio=parsed('lm15-03'),starts=['Предишна цена 60','До 31 октомври','Финална сверка','Предишна цена 57'];
  const matches=Object.fromEntries(studio.slots.map((s,i)=>[s.id,studio.choices.find(c=>s.choices.includes(c.id)&&c.text.startsWith(starts[i]))!.id]));
  const result=studioMessage(studio,matches);
  expect(result.filter(p=>p.part==='headline')).toHaveLength(1);
  expect(result[0].text).toContain('намаление с 3 €');
  expect(result.find(p=>p.part==='terms')?.text).toContain('доставка отделно 4 €');
  expect(result.map(p=>p.text).join(' ')).not.toContain('намаление 10%');
  render(<ClosedPracticeStudio {...props} studio={studio} state={{matches}}/>);
  expect(screen.getByRole('article',{name:'Съобщение от избраните части'}).textContent).toContain('Предишна цена 57');
  expect(document.querySelector('input,textarea')).toBeNull();
});

test('a read-only availability result is distinct from a later specifically permitted reservation',()=>{
  const studio=parsed('lm04-07'),starts=['Показват се','Искането за експорт','Р101 потвърждава'];
  const matches=Object.fromEntries(studio.slots.map((s,i)=>[s.id,studio.choices.find(c=>s.choices.includes(c.id)&&c.text.startsWith(starts[i]))!.id]));
  const flow=studioWorkflow(studio,matches);
  expect(flow.map(p=>p.part)).toEqual(['entry','review','outcome']);
  expect(flow.at(-1)?.detail).toContain('не удостоверява плащане');
  expect(studioWorkflow(studio,{[studio.slots.at(-1)!.id]:matches[studio.slots.at(-1)!.id]})).toEqual([]);
  render(<ClosedPracticeStudio {...props} studio={studio} state={{matches}}/>);
  expect(screen.getByRole('list',{name:'Схема на избрания работен процес'}).querySelectorAll('li')).toHaveLength(3);
});

test('the discount needs 75 units at the first price and at least 65 after the changed price',()=>{
  const studio=parsed('lm15-02');
  const first=studio.choices.find(c=>c.calculation?.a===2700&&c.calculation.b===36)!;
  const changed=studio.choices.find(c=>c.calculation?.a===2700&&c.calculation.b===42)!;
  expect(studioCalculation(first.calculation!)).toBe(75);
  expect(Math.ceil(studioCalculation(changed.calculation!)!)).toBe(65);
  expect(studioCalculation(first.calculation!)!).toBeGreaterThan(70);
  expect(Math.ceil(studioCalculation(changed.calculation!)!)).toBeLessThanOrEqual(70);
  expect(changed.text).toContain('поне 65');
});

test('unspent media and an unperformed repair never become actual campaign spend',()=>{
  const studio=parsed('lm15-06');
  const first=studio.choices.find(c=>c.budget?.hours===5&&c.budget.external===700)!;
  const changed=studio.choices.find(c=>c.budget?.hours===5&&c.budget.external===420)!;
  expect(studioBudget(first.budget!).cost).toBe(800);
  expect(studioBudget(changed.budget!).cost).toBe(520);
  expect(changed.text).toContain('поправката до 80 е само разрешена');
  expect(studio.change).toContain('Неизползваната част от първия медиен предел е освободена');
  expect(1600-520-80).toBe(1000);
});

test('a lower client capacity recomputes the shared acquisition budget instead of spending all available money',()=>{
  const studio=parsed('lm12-12');
  const initial=studio.choices.find(c=>c.budget?.hours===5&&c.budget.external===900)!;
  const changed=studio.choices.find(c=>c.budget?.hours===5&&c.budget.external===500)!;
  expect(studioBudget(initial.budget!).cost).toBe(1000);expect(studioBudget(changed.budget!).cost).toBe(600);
  expect(changed.text).toContain('до 400 медия');
  expect(changed.text).toContain('около 13,33');
});

test('every visual plan has one distinct base part per step; pasted text and URLs are discarded',()=>{
  for(const l of lessons){
    const studio=parseClosedStudio(l.practice.content)!;
    if(!['workflow','message'].includes(studio.kind))continue;
    const field=studio.kind==='workflow'?'flow':'copy';
    const parts=studio.slots.filter(s=>s.preview&&s.phase==='base').map(s=>{
      const alternatives=studio.choices.filter(c=>s.choices.includes(c.id));
      const keys=new Set(alternatives.map(c=>c[field]?.part));expect(keys.size).toBe(1);expect(keys.has(undefined)).toBe(false);
      return alternatives[0][field]!.part;
    });
    expect(new Set(parts).size,l.lesson).toBe(parts.length);
  }
  const studio=parsed('lm04-07'),first=studio.slots[0];
  expect(studioMatches(studio,{matches:{[first.id]:first.choices[0],unknown:'https://example.invalid'},file:'data:binary',text:'own answer'})).toEqual({[first.id]:first.choices[0]});
});
