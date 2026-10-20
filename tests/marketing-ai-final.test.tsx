// @vitest-environment jsdom
import React from 'react';
import { afterEach, expect, test } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { loadFinalMarketingAiCandidates, loadFinalMarketingAiSource } from '../scripts/prepare-final-marketing-ai-assets.mjs';
import { MARKETING_AI_ALL_MODULES, MARKETING_AI_FINAL_MODULES, MARKETING_AI_TOOLS, marketingAiLessonLink, marketingAiVisibleText, parseMarketingAiGuide } from '../src/lib/marketing-ai';
import { FINAL_WORKBENCHES, finalModelInitial, runFinalModel, type FinalWorkbenchId } from '../src/lib/marketing-ai-final-workbenches';
import { parseClosedStudio } from '../src/lib/closed-practice-studio';
import MarketingAiFinalWorkbench from '../src/components/academy/MarketingAiFinalWorkbench';
import LessonRichText from '../src/pages/module/components/lesson-v2/LessonRichText';
import { countVisibleLessonWords } from '../src/lib/academy-reading-time';
const rows = loadFinalMarketingAiCandidates();
afterEach(cleanup);
test('34 targeted lessons follow displayed modules 11–20, with 106 retained sources and 23 bounded routes', () => {
  expect(MARKETING_AI_FINAL_MODULES.map(m => m.id)).toEqual(['s03-m04','s03-m16','s03-m15','s03-m12','s03-m13','s03-m14','s03-m17','s03-m18','s03-m19','s03-m20']);
  expect(MARKETING_AI_ALL_MODULES.map(m => m.number)).toEqual(Array.from({length:20},(_,i)=>i+1));
  expect(rows).toHaveLength(34); expect(loadFinalMarketingAiSource()).toHaveLength(106); expect(MARKETING_AI_TOOLS).toHaveLength(23);
  for (const r of rows) expect(marketingAiLessonLink(r.lesson)).toBe(`/module/${r.module}?lesson=${r.lesson}`);
});
test('full fallbacks, distinct cases and 136 closed decisions accompany all 34 examples', () => {
  let decisions=0, models=0;
  for(const r of rows){
    expect(r.payload.amendments).toEqual([]);const b=r.payload.additions[0],g=parseMarketingAiGuide(b.content.marketingAi)!;expect(g,r.lesson).toBeTruthy();
    expect(r.payload.additions.every(b=>b.required)).toBe(true); expect(g.documents.length).toBeGreaterThanOrEqual(2);expect(g.prompt.length).toBeGreaterThan(100);
    for(const part of marketingAiVisibleText(g)) expect(b.content.body,r.lesson).toContain(part);
    const c=r.payload.additions[1],studio=parseClosedStudio(c.content)!;expect(studio.initialContext).not.toBe(g.documents.map(d=>d.text).join('\n'));
    expect(studio.slots).toHaveLength(4);expect(studio.slots.filter(s=>s.phase==='change')).toHaveLength(1);expect(studio.slots.every(s=>s.choices.length===3)).toBe(true);decisions+=studio.slots.length;if(g.finalWorkbench)models++;
  }
  expect(decisions).toBe(136);expect(models).toBe(8);expect(JSON.stringify(rows)).not.toMatch(/"(?:evaluation|answer_key|answerKey|answers|correct|scoring|feedback|modelAnswer)"\s*:/);
});
test('model association and release are validated; reading counts structured teaching exactly once',()=>{
  const b=structuredClone(rows.find(r=>r.lesson==='lm18-02').payload.additions[0]);const lesson={moduleId:'s03-m18',title:'',subtitle:'',objective:'',blocks:[b]};const n=countVisibleLessonWords(lesson);b.content.body+=' Допълнителен резерв.'.repeat(100);expect(countVisibleLessonWords(lesson)).toBe(n);
  expect(parseMarketingAiGuide({...b.content.marketingAi,finalWorkbench:'crm'})).toBeNull();expect(parseMarketingAiGuide({...b.content.marketingAi,release:'marketing_ai_next_five_20261020'})).toBeNull();
  render(<LessonRichText content={{...b.content,marketingAi:{...b.content.marketingAi,finalWorkbench:'unknown'}}} allowMarketingAi />);expect(document.body.textContent).toContain('Допълнителен резерв.');
});
test('repeated automation receives keep one record; a notification failure keeps the record and owner',()=>{
  const first=runFinalModel('automation','new','receive')!;expect(first.state.records).toBe(1);const repeat=runFinalModel('automation','new','receive',first.state)!;expect(repeat.state.records).toBe(1);expect(repeat.message).toContain('не създава втори');
  const failure=runFinalModel('automation','failure','notify')!;expect(failure.accepted).toBe(false);expect(failure.state.records).toBe(1);expect(failure.message).toContain('Петър');
  expect(runFinalModel('automation','new','notify')!.accepted).toBe(false);
});
test('campaign acceptance requires both record and owner; advertising checks each part independently',()=>{
  expect(runFinalModel('campaign','screen','accept')!.accepted).toBe(false);expect(runFinalModel('campaign','owner-missing','accept')!.accepted).toBe(false);expect(runFinalModel('campaign','repaired','accept')!.accepted).toBe(true);
  expect(['query','text','url'].map(a=>runFinalModel('ads','mixed',a)!.accepted)).toEqual([true,false,false]);expect(['query','text','url'].map(a=>runFinalModel('ads','fixed',a)!.accepted)).toEqual([true,true,true]);expect(runFinalModel('ads','irrelevant','query')!.accepted).toBe(false);
});
test('analytics keeps units, duplicates, unknown outcomes and changed statuses distinct',()=>{
  expect(runFinalModel('analytics','base','unique')!.value).toBe(36);expect(runFinalModel('analytics','base','status')!.accepted).toBe(true);expect(runFinalModel('analytics','updated','status')!.value).toBe(36);expect(runFinalModel('analytics','mismatch','status')!.accepted).toBe(false);expect(runFinalModel('analytics','base','sessions')!.message).toContain('не е брой изгубени клиенти');
});
test('CRM permission, operation receipt and readback are separate states',()=>{
  expect(runFinalModel('crm','read-only','apply')!.accepted).toBe(false);expect(runFinalModel('crm','confirmed','read')!.accepted).toBe(false);
  const conflict=runFinalModel('crm','conflict','apply')!;expect(conflict.state.receipt).toBe(true);expect(runFinalModel('crm','conflict','read',conflict.state)!.accepted).toBe(false);
  const applied=runFinalModel('crm','confirmed','apply')!;expect(runFinalModel('crm','confirmed','read',applied.state)!.message).toContain('Плащане не е установено');
});
test('calculator computes margin from price and refuses zero or missing denominators',()=>{
  expect(runFinalModel('calculator','normal','calculate')!.value).toBe(40);expect(runFinalModel('calculator','normal','margin')!.value).toBe(40);
  expect(runFinalModel('calculator','zero','calculate')!.value).toBe(-20);expect(runFinalModel('calculator','zero','margin')!.value).toBeNull();expect(runFinalModel('calculator','missing','calculate')!.value).toBeNull();expect(runFinalModel('calculator','loss','margin')!.value).toBe(-50);
});
test('email uses current status and a smaller plan must fit both resources and accepted scope',()=>{
  expect(['active','replied','unsubscribed','purchased'].map(c=>runFinalModel('email',c,'dispatch')!.accepted)).toEqual([true,false,false,false]);
  expect(runFinalModel('plan','base','a')!.accepted).toBe(true);expect(runFinalModel('plan','base','b')!.accepted).toBe(false);expect(runFinalModel('plan','reduced','a')!.accepted).toBe(false);expect(runFinalModel('plan','reduced','narrow')!.accepted).toBe(false);expect(runFinalModel('plan','approved','narrow')!.accepted).toBe(true);expect(runFinalModel('plan','tight','narrow')!.accepted).toBe(false);
});
test('every model supports keyboard buttons, reset and finite cases without editable or network input',()=>{
  for(const id of Object.keys(FINAL_WORKBENCHES) as FinalWorkbenchId[]){
    const model=FINAL_WORKBENCHES[id];render(<MarketingAiFinalWorkbench id={id}/>);
    for(const c of model.cases){fireEvent.change(screen.getByRole('combobox'),{target:{value:c.id}});expect(screen.queryByRole('status')).toBeNull();for(const a of model.actions)fireEvent.click(screen.getByRole('button',{name:a.label}));expect(screen.getByRole('status')).toBeTruthy();}
    fireEvent.click(screen.getByRole('button',{name:'Започни случая отначало'}));expect(screen.queryByRole('status')).toBeNull();expect(document.querySelector('input,textarea,iframe,[contenteditable="true"]')).toBeNull();cleanup();
  }
  expect(runFinalModel('crm','unknown','apply')).toBeNull();expect(runFinalModel('crm','confirmed','unknown')).toBeNull();expect(finalModelInitial('automation','new').records).toBe(0);
});
