// @vitest-environment jsdom
import React from 'react';
import { afterEach, expect, test } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { loadNextMarketingAiCandidates, loadNextMarketingAiSource } from '../scripts/prepare-next-marketing-ai-assets.mjs';
import { MARKETING_AI_NEXT_MODULES, MARKETING_AI_TOOLS, marketingAiLessonLink, marketingAiReport, marketingAiVisibleText, parseMarketingAiGuide } from '../src/lib/marketing-ai';
import { parseClosedStudio } from '../src/lib/closed-practice-studio';
import { countVisibleLessonWords } from '../src/lib/academy-reading-time';
import MarketingAiWorkbench from '../src/components/academy/MarketingAiWorkbench';
import LessonRichText from '../src/pages/module/components/lesson-v2/LessonRichText';
const rows = loadNextMarketingAiCandidates();
const guideBlock = r => r.payload.additions.find(b => b.type === 'rich_text');
afterEach(cleanup);

test('17 targets resolve through the displayed order, retaining the moved lesson source identity', () => {
  expect(MARKETING_AI_NEXT_MODULES.map(m=>m.id)).toEqual(['s03-m10','s03-m11','s03-m08','s03-m06','s03-m09']);
  expect(rows).toHaveLength(17); expect(loadNextMarketingAiSource()).toHaveLength(63); expect(MARKETING_AI_TOOLS).toHaveLength(13);
  for (const r of rows) expect(marketingAiLessonLink(r.lesson)).toBe(`/module/${r.lesson==='lm01-01'?'s03-m09':r.module}?lesson=${r.lesson}`);
  expect(rows.find(r=>r.lesson==='lm01-01').module).toBe('s03-m01');
  render(<LessonRichText content={guideBlock(rows.find(r=>r.lesson==='lm01-01')).content} allowMarketingAi />);
  expect(screen.getByRole('link',{name:'Инструменти и примери за първите десет модула'}).getAttribute('href')).toBe('/academy-tools/marketing-basics?module=s03-m09');
  expect(marketingAiLessonLink('constructor')).toBeNull(); expect(marketingAiLessonLink('lm09-99')).toBeNull();
});

test('provided versions and complete fallbacks accompany 68 independent decisions with 17 changes', () => {
  let decisions=0,workbenches=0;
  for (const r of rows) {
    expect(r.payload.amendments).toEqual([]); expect(r.payload.additions.every(b=>b.required)).toBe(true);
    const b=guideBlock(r),g=parseMarketingAiGuide(b.content.marketingAi)!;
    expect(g,r.lesson).toBeTruthy(); expect(g.documents.length).toBeGreaterThanOrEqual(2); expect(g.prompt.length).toBeGreaterThan(100);
    expect(g.variants).toHaveLength(r.lesson==='lm10-08'?4:2); if(g.workbench)workbenches++;
    for(const text of marketingAiVisibleText(g))expect(b.content.body,r.lesson).toContain(text);
    const studio=parseClosedStudio(r.payload.additions.find(b=>b.type==='matching').content)!;
    expect(studio.slots).toHaveLength(4); expect(studio.slots.filter(s=>s.phase==='change')).toHaveLength(1); expect(studio.slots.every(s=>s.choices.length===3)).toBe(true); decisions+=studio.slots.length;
  }
  expect(decisions).toBe(68); expect(workbenches).toBe(4);
  expect(JSON.stringify(rows)).not.toMatch(/"(?:evaluation|answer_key|answerKey|answers|correct|scoring|feedback|modelAnswer)"\s*:/);
});

test('calendar changes do not silently rewrite or resume the queue; pausing retains useful content', () => {
  render(<MarketingAiWorkbench id="queue" />);
  fireEvent.change(screen.getByRole('combobox'),{target:{value:'full'}}); expect(screen.getByRole('status').textContent).toContain('остаряла покана');
  fireEvent.click(screen.getByRole('button',{name:'Спри поканата'})); expect(screen.getByRole('status').textContent).toContain('спряна');
  expect(screen.getAllByRole('listitem')).toHaveLength(1);
  fireEvent.change(screen.getByRole('combobox'),{target:{value:'pending'}}); expect(screen.getByRole('status').textContent).toContain('спряна');
  fireEvent.click(screen.getByRole('button',{name:'Върни първоначалната покана'})); expect(screen.getByRole('status').textContent).toContain('остаряла покана');
});

test('page prototype, failed record and received inquiry remain distinct and preserve the finite choice', () => {
  render(<MarketingAiWorkbench id="page" />);
  const mode=screen.getByRole('combobox',{name:'Предоставен резултат на системата'}),format=screen.getByRole('combobox',{name:'Избери предоставен размер'});
  fireEvent.change(format,{target:{value:'A6'}}); fireEvent.click(screen.getByRole('button',{name:'Изпробвай действието'})); expect(screen.getByRole('status').textContent).toContain('Няма потвърден запис');
  fireEvent.change(mode,{target:{value:'failed'}}); fireEvent.click(screen.getByRole('button',{name:'Изпробвай действието'})); expect(screen.getByRole('status').textContent).toContain('не е записано'); expect((format as HTMLSelectElement).value).toBe('A6');
  fireEvent.change(mode,{target:{value:'received'}}); fireEvent.click(screen.getByRole('button',{name:'Изпробвай действието'})); expect(screen.getByRole('status').textContent).toContain('У-17'); expect(screen.getByRole('status').textContent).toContain('приемане още няма');
  expect(document.querySelector('input,textarea,iframe,[contenteditable="true"]')).toBeNull();
});

test('schematic variants expose the changed entrance rather than pretending to be real photos', () => {
  render(<MarketingAiWorkbench id="entrance" />); expect(screen.getByRole('img').getAttribute('aria-label')).toContain('три стъпала');
  fireEvent.click(screen.getByRole('button',{name:'Променена среда'})); expect(screen.getByRole('img').getAttribute('aria-label')).toContain('вход А без стъпала'); expect(screen.getByRole('status').textContent).toContain('друг достъп');
  fireEvent.click(screen.getByRole('button',{name:'По-четима табела'})); expect(screen.getByRole('img').getAttribute('aria-label')).toContain('вход Б с три стъпала');
});

test('report scope changes both the included subset and denominator, without double counting', () => {
  expect(marketingAiReport('all')).toMatchObject({total:1000,genai:200,share:20}); expect(marketingAiReport('mobile')).toMatchObject({total:600,genai:90,share:15}); expect(marketingAiReport('other')).toBeNull();
  render(<MarketingAiWorkbench id="report" />); expect(screen.getByText('200 / 1000 = 20%')).toBeTruthy();
  fireEvent.change(screen.getByRole('combobox'),{target:{value:'mobile'}}); expect(screen.getByText('90 / 600 = 15%')).toBeTruthy(); expect(screen.queryByText('690')).toBeNull();
});

test('enhanced workbench renders once; invalid association falls back; reading includes revealed states once', () => {
  const b=structuredClone(guideBlock(rows.find(r=>r.lesson==='lm08-03')));
  render(<LessonRichText content={b.content} allowMarketingAi />); expect(screen.getAllByRole('region',{name:'Пробвай трите състояния на действието'})).toHaveLength(1);
  const lesson={moduleId:'s03-m08',title:'',subtitle:'',objective:'',blocks:[b]},n=countVisibleLessonWords(lesson); b.content.body+=' Резервен текст.'.repeat(100); expect(countVisibleLessonWords(lesson)).toBe(n);
  expect(parseMarketingAiGuide({...b.content.marketingAi,workbench:'report'})).toBeNull();
  cleanup(); render(<LessonRichText content={{body:'Запазен подробен резервен материал.',marketingAiFallback:true,marketingAi:{...b.content.marketingAi,workbench:'unknown'}}} allowMarketingAi />); expect(screen.getByText('Запазен подробен резервен материал.')).toBeTruthy();
});
