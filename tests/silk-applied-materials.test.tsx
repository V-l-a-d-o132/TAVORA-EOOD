// @vitest-environment jsdom
import { afterEach, expect, test } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { parseProvidedMaterials, materialContrast, applyToolAction, initialToolLab } from '../src/lib/provided-materials';
import ProvidedMaterials from '../src/components/academy/ProvidedMaterials';
import LessonRichText from '../src/pages/module/components/lesson-v2/LessonRichText';
import { loadPracticalSilkCandidates } from '../scripts/prepare-practical-silk-assets.mjs';
import { parseClosedStudio, studioMatches, studioPlaylist } from '../src/lib/closed-practice-studio';
import { countVisibleLessonWords } from '../src/lib/academy-reading-time';
const candidates = loadPracticalSilkCandidates('applied-20261018');
afterEach(cleanup);
test('the complete public review bundle contains no grading keys or open response blocks', () => {
 expect(candidates).toHaveLength(74);
 const forbidden=new Set(['evaluation','answer_key','answerKey','answers','correct','modelAnswer','feedback','expectedVersion','expectedFingerprint']);
 const scan=(value:unknown)=>{if(Array.isArray(value))value.forEach(scan);else if(value&&typeof value==='object')for(const [key,part]of Object.entries(value)){expect(forbidden.has(key)).toBe(false);scan(part);}};
 scan(candidates);
 expect(candidates.flatMap(l=>l.payload.additions).every(b=>['rich_text','matching'].includes(b.type))).toBe(true);
});

test('provided material is bounded data; HTML and remote embeds remain inert text', () => {
 const m=parseProvidedMaterials({title:'Проверка',items:[{label:'А',code:'<script>fetch("https://example.invalid")</script>',columns:['Поле'],rows:[['Стойност']],view:'iframe',src:'https://example.invalid'}]})!;
 render(<ProvidedMaterials materials={m}/>);
 expect(document.querySelector('script,iframe')).toBeNull();expect(screen.getByText(/<script>fetch/)).toBeTruthy();
 expect(m.items[0].view).toBe('document');expect(m.items[0]).not.toHaveProperty('src');
 expect(parseProvidedMaterials({items:Array.from({length:9},()=>({label:'А'}))})).toBeNull();
});
test('the timeout demonstration really creates one record, survives retries and refuses sending', () => {
 let state=initialToolLab();state=applyToolAction(state,'create');expect(state.created).toBe(true);expect(state.messages.at(-1)).toMatch(/прекъсна/);
 state=applyToolAction(state,'inspect');expect(state.messages.at(-1)).toMatch(/exists/);
 state=applyToolAction(state,'repeat');expect(state.messages.at(-1)).toMatch(/остават 1/);
 state=applyToolAction(state,'send');expect(state.messages.at(-1)).toMatch(/denied/);expect(state.created).toBe(true);
 const m=parseProvidedMaterials({title:'Инструмент',toolLab:true,items:[{label:'Условия',body:'Само чернова.'}]})!;
 render(<ProvidedMaterials materials={m}/>);fireEvent.click(screen.getByRole('button',{name:'Създай D-41'}));fireEvent.click(screen.getByRole('button',{name:'Провери D-41'}));fireEvent.click(screen.getByRole('button',{name:'Повтори със същия ключ'}));
 expect(screen.getByRole('list',{name:'Журнал на извикванията'}).textContent).toMatch(/exists/);expect(screen.getByRole('list',{name:'Журнал на извикванията'}).textContent).toMatch(/остават 1/);
});
test('colour measurements are calculated from actual sRGB values', () => {
 expect(materialContrast('#000000','#ffffff')).toBe(21);expect(materialContrast('#ffffff','#ffffff')).toBe(1);
 expect(materialContrast('#667085','#ffffff')).toBeGreaterThan(4.5);expect(materialContrast('#98a2b3','#ffffff')).toBeLessThan(4.5);
});
test('the enhanced view suppresses only the complete older-build fallback', () => {
 const block=candidates[0].payload.additions.find(b=>b.key==='silk_materials_20261018');render(<LessonRichText content={block.content}/>);
 expect(screen.getAllByRole('button',{name:'Условия и вход'})).toHaveLength(1);
 fireEvent.click(screen.getByRole('button',{name:'Резултат Б'}));expect(screen.getByRole('article',{name:'Резултат Б'}).textContent).toMatch(/запазен час/);
 cleanup();render(<LessonRichText content={{body:'Пълен текст за стария изглед.',materialsFallback:true,materials:{items:[]}}}/>);expect(screen.getByText('Пълен текст за стария изглед.')).toBeTruthy();
});
test('all 11 transfer cases have independent evidence, bounded choices and a readable old-build fallback', () => {
 const checks=candidates.flatMap(l=>l.payload.additions.filter(b=>b.type==='matching').map(b=>({lesson:l.lesson,b})));
 expect(checks).toHaveLength(11);expect(new Set(checks.map(({b})=>b.content.left.length)).size).toBeGreaterThan(2);
 for(const {b}of checks){const s=parseClosedStudio(b.content)!;expect(s.materials).toBeTruthy();expect(s.context).toBe(b.content.studio.materialsIntro);expect(b.content.studio.initialContext.length).toBeGreaterThan(s.context.length+200);
  const m=Object.fromEntries(s.slots.map(slot=>[slot.id,slot.choices[0]]));expect(Object.keys(studioMatches(s,{matches:m}))).toHaveLength(s.slots.length);expect(studioPlaylist(s,m)).toHaveLength(s.slots.length);
 }
});
test('word counts include the materials once and exclude their renderer configuration', () => {
 const content={body:'Старият пълен текст е скрит.',materialsFallback:true,materials:{title:'Работен материал',instruction:'Виж реда.',items:[{label:'Таблица',columns:['Ден'],rows:[['Вторник']],view:'phone',variant:'readable'}]}};
 const base={moduleId:'s01-m02',title:'',subtitle:'',objective:'',blocks:[{title:'',content}]};
 const count=countVisibleLessonWords(base);expect(count).toBe(7);
 const same=structuredClone(base);same.blocks[0].content.body='Друг много дълъг стар текст, който не трябва да се брои втори път.';expect(countVisibleLessonWords(same)).toBe(count);
});
