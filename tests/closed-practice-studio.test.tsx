// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import ClosedPracticeStudio from '../src/components/academy/ClosedPracticeStudio';
import { parseClosedStudio, studioMatches } from '../src/lib/closed-practice-studio';
import { closedBlockState, closedLessonState } from '../src/lib/closed-lesson-state';
import { loadPracticalCandidates } from '../scripts/prepare-practical-video-assets.mjs';
const candidates = loadPracticalCandidates();
import type { LessonBlockV2 } from '../src/lib/lesson-engine-v2';

beforeEach(()=>{HTMLMediaElement.prototype.pause=vi.fn();HTMLMediaElement.prototype.play=vi.fn(async()=>{});});
afterEach(cleanup);
test('all studio choices are finite and an old or malicious state cannot become a learner payload',()=>{
  for(const l of candidates) {
    const studio=parseClosedStudio(l.practice.content)!;
    const slot=studio.slots[0];
    const state={text:'no',file:'no',matches:{[slot.id]:slot.choices[0],unknown:'no'}};
    expect(studioMatches(studio,state)).toEqual({[slot.id]:slot.choices[0]});
    const block={...l.practice,id:'test',position:0} as LessonBlockV2;
    expect(closedBlockState(block,state)).toEqual({matches:{[slot.id]:slot.choices[0]}});
    expect(closedLessonState([block],{[block.key]:state,missing:{text:'no'}})).toEqual({[block.key]:{matches:{[slot.id]:slot.choices[0]}}});
  }
});
test('restored finite choices remain selected and only their ids reach grading',async()=>{
  const l=candidates.find(l=>l.lesson==='pv01-17')!,studio=parseClosedStudio(l.practice.content)!;
  const matches=Object.fromEntries(studio.slots.map(slot=>[slot.id,slot.choices[0]]));
  const submit=vi.fn(),change=vi.fn();
  render(<ClosedPracticeStudio studio={studio} state={{matches}} busy={false} completed={false} onChange={change} onSubmit={submit}/>);
  for(const slot of studio.slots) expect((screen.getByRole('combobox',{name:slot.text}) as HTMLSelectElement).value).toBe(matches[slot.id]);
  fireEvent.click(screen.getByRole('button',{name:'Провери решенията'}));
  expect(submit).toHaveBeenCalledWith({matches});
  expect(screen.queryByRole('textbox')).toBeNull();
  fireEvent.click(screen.getByRole('button',{name:'Започни сравняването отначало'}));
  expect(change).toHaveBeenCalledWith({matches:{}});
});
test('a crop selection changes the provided image, and an incomplete studio cannot pass',()=>{
  const l=candidates.find(l=>l.lesson==='pv03-08')!,studio=parseClosedStudio(l.practice.content)!;
  const slot=studio.slots[0];const action=studio.choices.find(c=>c.crop==='action')!,edge=studio.choices.find(c=>c.crop==='edge')!;
  const props={studio,busy:false,completed:false,onChange:vi.fn(),onSubmit:vi.fn()};
  const {rerender}=render(<ClosedPracticeStudio {...props} state={{matches:{[slot.id]:action.id}}}/>);
  expect((screen.getByRole('button',{name:'Провери решенията'}) as HTMLButtonElement).disabled).toBe(true);
  expect((screen.getByRole('img') as HTMLImageElement).style.objectPosition).toBe('43% center');
  rerender(<ClosedPracticeStudio {...props} state={{matches:{[slot.id]:edge.id}}}/>);
  expect((screen.getByRole('img') as HTMLImageElement).style.objectPosition).toBe('100% center');
});
test('assembly really seeks and advances through the selected source fragments',async()=>{
  const l=candidates.find(l=>l.lesson==='pv01-01')!,studio=parseClosedStudio(l.practice.content)!;
  const slots=studio.slots.filter(s=>s.preview);
  const clips=slots.map((slot,i)=>studio.choices.find(c=>slot.choices.includes(c.id)&&c.clip?.[0]===[0,10,16,26][i])!);
  const matches=Object.fromEntries(slots.map((slot,i)=>[slot.id,clips[i].id]));
  render(<ClosedPracticeStudio studio={studio} state={{matches}} busy={false} completed={false} onChange={vi.fn()} onSubmit={vi.fn()}/>);
  const player=screen.getByLabelText('Преглед на подредената сцена') as HTMLVideoElement;
  fireEvent.click(screen.getByRole('button',{name:'Прегледай подредбата'}));
  await waitFor(()=>expect(HTMLMediaElement.prototype.play).toHaveBeenCalled());
  expect(player.currentTime).toBe(0);
  player.currentTime=3;fireEvent.timeUpdate(player);expect(player.currentTime).toBe(10);
  player.currentTime=13;fireEvent.timeUpdate(player);expect(player.currentTime).toBe(16);
  player.currentTime=19;fireEvent.timeUpdate(player);expect(player.currentTime).toBe(26);
  player.currentTime=29;fireEvent.timeUpdate(player);expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
});
test('external media URLs and invented clips are rejected by the public parser',()=>{
  const content=structuredClone(candidates[0].practice.content);
  content.right[0].preview={clip:[-1,200],audio:'https://example.invalid/private'} as never;
  const parsed=parseClosedStudio(content)!;
  expect(parsed.choices[0].clip).toBeUndefined();expect(parsed.choices[0].audio).toBeUndefined();
});
