import { afterEach, describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { Blob } from 'node:buffer';
import { JSDOM } from 'jsdom';

const html=readFileSync('public/academy/marketing-basics-practice.html','utf8');
const opened:JSDOM[]=[];
afterEach(()=>{for(const dom of opened)dom.window.close();opened.length=0;});
function open(source=html) {
  const downloads:{name:string;blob:Blob}[]=[],blobs=new Map<string,Blob>();
  const dom=new JSDOM(source,{runScripts:'dangerously',url:'https://example.invalid/academy/marketing-basics-practice.html',beforeParse(w){
    w.Blob=Blob as unknown as typeof w.Blob;
    w.URL.createObjectURL=(blob)=>{const id='blob:practice-'+blobs.size;blobs.set(id,blob as unknown as Blob);return id;};
    w.URL.revokeObjectURL=()=>{};
    w.HTMLAnchorElement.prototype.click=function(){downloads.push({name:this.download,blob:blobs.get(this.href)!});};
  }});
  opened.push(dom);return {dom,downloads};
}
describe('Marketing practice page interactions and portable export',()=>{
  it('wires forms and all cases, and exports a clean offline exercise after activity',async()=>{
    const {dom,downloads}=open(),d=dom.window.document;
    expect(d.querySelectorAll('#crm-cases tr')).toHaveLength(20);
    expect(d.querySelectorAll('#email-cases tr')).toHaveLength(10);
    (d.querySelector('#close-rate') as HTMLInputElement).value='';
    d.querySelector('#cpl-form')!.dispatchEvent(new dom.window.Event('submit',{bubbles:true,cancelable:true}));
    expect(d.querySelector('#cpl-error')!.textContent).toContain('празно не означава нула');
    (d.querySelector('#close-rate') as HTMLInputElement).value='25,5';
    d.querySelector('#cpl-form')!.dispatchEvent(new dom.window.Event('submit',{bubbles:true,cancelable:true}));
    expect(d.querySelector('#cpl-result')!.textContent).toContain('15,30');
    for(const id of ['crm-all','email-all','cpl-tests'])(d.getElementById(id) as HTMLButtonElement).click();
    expect(d.querySelector('#crm-result')!.textContent).toContain('15 записа · 11 задачи');
    expect(d.querySelector('#email-result')!.textContent).toContain('3 уникални чернови · 0 изпратени');
    expect(d.querySelector('#cpl-tests-result')!.textContent).toContain('7/7');
    for(const id of ['crm-csv','email-csv','cpl-csv','email-templates','project-csv','download-html'])(d.getElementById(id) as HTMLButtonElement).click();
    expect(downloads).toHaveLength(6);
    expect(await downloads.find(x=>x.name==='marketing-crm-log.csv')!.blob.text()).toContain('"R01","contact_stopped"');
    expect(await downloads.find(x=>x.name==='marketing-email-templates.txt')!.blob.text()).toContain('R2, след 7 дни');
    const portable=await downloads.find(x=>x.name==='marketing-basics-practice.html')!.blob.text();
    const reopened=open(portable).dom.window.document;
    expect(reopened.querySelectorAll('#crm-cases tr')).toHaveLength(20);
    expect(reopened.querySelectorAll('#email-cases tr')).toHaveLength(10);
    expect(reopened.querySelectorAll('#cpl-log tr')).toHaveLength(0);
    (reopened.getElementById('crm-all') as HTMLButtonElement).click();
    expect(reopened.getElementById('crm-result')!.textContent).toContain('15 записа · 11 задачи');
  });
});
