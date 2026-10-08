import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const html=readFileSync('public/academy/marketing-basics-practice.html','utf8');
const context:Record<string,unknown>={};
runInNewContext(html.match(/<script id="lab-core">([\s\S]*?)<\/script>/)![1],context);
type Case={id:string;key?:string;kind:string};
type CRM={records:Record<string,{status:string;stop:boolean}>;tasks:Record<string,{status:string}>;events:Record<string,boolean>;log:unknown[]};
type Email={drafts:Record<string,{status:string}>;log:unknown[]};
const lab=context.TavoraMarketingLab as {
  calculate:(c:unknown,r:unknown,p:unknown)=>{status:string;value:number|null};
  crmCases:Case[];emailCases:Case[];newCRM:()=>CRM;runCRM:(s:CRM,c:Case)=>{status:string;newEffect:boolean;taskId:string;readback:string};
  newEmail:()=>Email;runEmail:(s:Email,c:Case)=>{status:string;draftId:string;greeting:string};csv:(r:unknown[][])=>string;
};

describe('portable Marketing Basics practice',()=>{
  it('checks the model, empty inputs, boundaries and decimal comma independently',()=>{
    expect(lab.calculate('100','40','25').value).toBe(15);
    expect(lab.calculate(100,40,0).value).toBe(0);
    expect(lab.calculate(100,40,100).value).toBe(60);
    expect(lab.calculate(100,100,25).value).toBe(0);
    expect(lab.calculate(100,120,25).status).toBe('no_positive_budget');
    for(const p of ['',null,'   '])expect(lab.calculate(100,40,p).status).toBe('missing');
    for(const p of [-1,101,'25junk','25,5.2',Infinity])expect(lab.calculate(100,40,p).status).toBe('invalid');
    expect(lab.calculate(-1,40,25).status).toBe('invalid');
    expect(lab.calculate(100,-1,25).status).toBe('invalid');
    expect(lab.calculate('100,5','40,5','25,5').value).toBeCloseTo(15.3);
  });
  it('keeps one effect per request and honors a refusal even after repeated triggers',()=>{
    expect(lab.crmCases).toHaveLength(20);const state=lab.newCRM();
    for(const c of lab.crmCases)lab.runCRM(state,c);
    expect(Object.keys(state.records)).toHaveLength(15);expect(Object.keys(state.tasks)).toHaveLength(11);
    const again=lab.runCRM(state,lab.crmCases[0]);expect(again.newEffect).toBe(false);expect(again.taskId).toBe('T-L01');
    const stopped=lab.runCRM(state,lab.crmCases[6]);expect(stopped.status).toBe('contact_stopped');expect(stopped.readback).toBe('cancelled');
    expect(state.records.B01.status).toBe('booking_unconfirmed');expect(state.tasks.C01.status).toBe('awaiting_acceptance');
    const refusalFirst=lab.newCRM();lab.runCRM(refusalFirst,lab.crmCases[19]);lab.runCRM(refusalFirst,lab.crmCases[6]);
    expect(refusalFirst.records.L07.stop).toBe(true);expect(refusalFirst.tasks.L07).toBeUndefined();
  });
  it('blocks purchase, refusal, hard bounce, missing permission and late refusal without duplicate drafts',()=>{
    expect(lab.emailCases).toHaveLength(10);const state=lab.newEmail();
    const results=lab.emailCases.map(c=>lab.runEmail(state,c));
    expect(results.map(r=>r.status)).toEqual(['draft_ready','purchase_stop','global_marketing_stop','duplicate_no_effect','draft_ready','address_suppressed','service_priority','frequency_deferred','suppressed_after_recheck','marketing_not_authorized']);
    expect(results[0].draftId).toBe(results[3].draftId);expect(results[4].greeting).toBe('Здравей!');expect(Object.keys(state.drafts)).toHaveLength(3);
    expect(state.drafts['W2-U09'].status).toBe('suppressed_after_recheck');
  });
  it('quotes exported CSV and prevents executable spreadsheet input',()=>{
    const result=lab.csv([['note','value'],['=HYPERLINK("x")','line\nbreak'],['normal','a,b']]);
    expect(result).toContain('"\'=HYPERLINK(""x"")"');expect(result).toContain('"line\nbreak"');expect(result).toContain('"a,b"');
    expect(html).not.toMatch(/<script[^>]+src=|fetch\(|localStorage|sessionStorage|XMLHttpRequest/);
  });
});
