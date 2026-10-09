import { SILK_PRACTICE_VERSION, type SilkPracticeCase } from '@/data/silk-road-start';
import labScript from '../../public/academy-labs/silk-road/request-lab.js?raw';

export interface SilkPagePlan {
  price: string;
  source: string;
  action: string;
  duplicates: string;
  missingContact: string;
}

export interface SilkCheck { id: string; label: string; passed: boolean; help: string }
export const emptySilkPlan = (): SilkPagePlan => ({ price: '', source: '', action: '', duplicates: '', missingContact: '' });

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]!));
const parsePrice = (value: string) => /^\d+(?:[.,]\d{1,2})?$/.test(value.trim()) ? Number(value.trim().replace(',', '.')) : NaN;

export function checkSilkPlan(study: SilkPracticeCase, plan: SilkPagePlan): SilkCheck[] {
  return [
    { id: 'source', label: 'Цена от актуалните утвърдени условия', passed: plan.source === 'current' && parsePrice(plan.price) === study.price, help: `Свери показаните утвърдени условия за ${study.name}. Обявата е стар материал. Посочената актуална цена е ${study.price} €.` },
    { id: 'action', label: 'Действието съответства на предоставените права и данни', passed: plan.action === 'request', help: 'Нямаш потвърдени часове или наличности. Бутонът трябва да приема запитване, след което човек уточнява условията.' },
    { id: 'duplicates', label: 'Повторението не създава втори запис', passed: plan.duplicates === 'same-id', help: 'Пази номера на едно действие при повторение. Не сливай различни заявки само заради общ контакт.' },
    { id: 'contact', label: 'Липсващият контакт не се измисля', passed: plan.missingContact === 'ask', help: 'Покажи кое поле липсва и запази въведеното. AI не може да добави контакт, който посетителят не е предоставил.' },
  ];
}

/** The same artifact is previewed and exercised; checks concern this supplied case only. */
export function buildSilkPrototype(study: SilkPracticeCase, plan: SilkPagePlan): string {
  const price = Number.isFinite(parsePrice(plan.price)) ? `${parsePrice(plan.price)} €` : 'Цена за уточняване';
  const action = plan.action === 'confirm' ? 'Потвърди веднага' : plan.action === 'pay' ? 'Плати и получи потвърждение' : 'Изпрати запитване';
  const config = JSON.stringify(plan).replace(/</g, '\\u003c');
  const script = labScript.replace('if (global.document) init(global.document);', '').replace(/<\/script/gi, '<\\/script');
  return `<!doctype html><html lang="bg"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${escapeHtml(study.name)} - учебен прототип</title><style>body{font:16px/1.7 system-ui,sans-serif;color:#172033;background:#f5f6fa;margin:0}main{max-width:660px;margin:auto;padding:32px 20px}h1{line-height:1.2}label{display:block;margin:16px 0 6px}input,button,select{font:inherit}input{box-sizing:border-box;width:100%;padding:12px;border:1px solid #64748b;border-radius:8px}button{padding:12px 18px;margin:16px 8px 0 0;border:0;border-radius:8px;background:#1d4ed8;color:white}button:disabled{opacity:.5}button:focus-visible,input:focus-visible{outline:3px solid #d97706;outline-offset:3px}.note{padding:12px;background:#e8eef9}table{width:100%;border-collapse:collapse;font-size:13px}td,th{border-bottom:1px solid #cbd5e1;padding:8px;text-align:left;overflow-wrap:anywhere}.scroll{overflow-x:auto}select{max-width:100%;padding:10px}#status{min-height:3rem}.small{font-size:13px}</style></head><body><main>
<p class="small">ТАВОРА · Учебен прототип · ${SILK_PRACTICE_VERSION}</p><h1>${escapeHtml(study.service)}</h1><p>${escapeHtml(study.name)} · ${escapeHtml(study.location)}</p><p id="offer-price"><strong>${escapeHtml(price)}</strong></p><p id="offer-scope">${escapeHtml(study.scope)}</p><p class="note">Всички данни са измислени. Формата записва учебни запитвания само в този браузър. Не изпраща имейл и не приема плащане.</p>
<form id="request-form"><label for="name">Учебно име</label><select id="name"><option value="Учебен посетител">Учебен посетител</option><option value="Друг учебен посетител">Друг учебен посетител</option></select><label for="contact">Учебен контакт</label><select id="contact"><option value="test@example.invalid">test@example.invalid — валиден</option><option value="">Липсва контакт</option><option value="invalid">Невалиден формат</option></select><label for="date">Предпочитана дата</label><select id="date"><option value="">Неуточнена</option><option value="2026-10-12">12 октомври — учебен избор</option><option value="2026-10-13">13 октомври — нова заявка</option></select><label for="mode">Условие за изпитване</label><select id="mode"><option value="success">Нормално изпращане</option><option value="error">Неуспех</option><option value="slow">Забавяне</option></select><br><button id="send" type="submit">${escapeHtml(action)}</button><button id="repeat" type="button" disabled>Повтори същата заявка</button></form>
<p id="status" role="status" aria-live="polite">Още няма изпратено запитване.</p><p id="storage-note" class="small"></p><h2>Получени учебни записи: <span id="record-count">0</span></h2><div class="scroll"><table><thead><tr><th>Номер</th><th>Име</th><th>Контакт</th><th>Дата</th><th>Състояние</th></tr></thead><tbody id="records"></tbody></table></div><button id="clear" type="button">Изчисти учебните записи</button><button id="run-checks" type="button" hidden>Провери примерната логика</button><ul id="checks" hidden></ul>
<script>${script}</script><script>
const plan=${config};
// Deliberate choices are applied to the learner's artifact, not merely to a quiz label.
const originalProcess=TavoraRequestLab.processRequest;
let entries=[];let last=null;let busy=false;let counter=0;
const store={all:()=>entries.slice(),save:item=>entries.push({...item,confirmed:plan.action!=='request'}),clear:()=>{entries=[]}};
const draw=()=>{document.getElementById('record-count').textContent=String(entries.length);document.getElementById('records').replaceChildren(...entries.map(item=>{const row=document.createElement('tr');[item.id,item.name,item.contact,item.preferredDate||'неуточнена',item.confirmed?'Потвърдено без проверка':'Запитване; чака уточнение'].forEach(value=>{const cell=document.createElement('td');cell.textContent=value;row.appendChild(cell)});return row}));};
const send=async repeat=>{if(busy)return;busy=true;const button=document.getElementById('send');button.disabled=true;document.getElementById('repeat').disabled=true;document.getElementById('clear').disabled=true;try{let input={name:document.getElementById('name').value.trim(),contact:document.getElementById('contact').value.trim(),preferredDate:document.getElementById('date').value};let same=last&&JSON.stringify(input)===JSON.stringify({name:last.name,contact:last.contact,preferredDate:last.preferredDate});let request=repeat&&last?{...last}:{...input,id:same?last.id:'T-'+(++counter)};if(plan.duplicates==='new-record'&&repeat)request.id='T-'+(++counter);if(plan.missingContact==='guess'&&!request.contact)request.contact='guessed@example.invalid';document.getElementById('status').textContent='Изпращане… още няма потвърждение.';const result=await originalProcess(request,document.getElementById('mode').value,store);if(result.state==='accepted'||result.state==='duplicate'||result.state==='error')last=request;document.getElementById('status').textContent=result.message;if(result.state==='accepted'&&plan.action!=='request')document.getElementById('status').textContent='Потвърдено без проверка на наличност или график.';if(result.field)document.getElementById(result.field).focus();draw();return result}finally{busy=false;button.disabled=false;document.getElementById('repeat').disabled=!last;document.getElementById('clear').disabled=false;}};
document.getElementById('request-form').addEventListener('submit',event=>{event.preventDefault();void send(false)});document.getElementById('repeat').addEventListener('click',()=>void send(true));document.getElementById('clear').addEventListener('click',()=>{store.clear();last=null;document.getElementById('repeat').disabled=true;draw();document.getElementById('status').textContent='Изчистени са само учебните записи.'});document.getElementById('storage-note').textContent='Списъкът е временен за тази отворена страница.';
window.TavoraSilkPrototype={store,send,reset:()=>{entries=[];last=null;counter=0;draw()}};
const checkPrototype=${exerciseSilkPrototype.toString()};
window.addEventListener('message',async event=>{if(event.source!==parent||event.data?.type!=='tavora-silk-check'||typeof event.data.requestId!=='string')return;try{const results=await checkPrototype(document,window.TavoraSilkPrototype);parent.postMessage({type:'tavora-silk-check-result',requestId:event.data.requestId,results},'*')}catch{parent.postMessage({type:'tavora-silk-check-result',requestId:event.data.requestId,error:true},'*')}});
const reportHeight=()=>{if(parent!==window)parent.postMessage({type:'tavora-silk-prototype-height',height:Math.ceil(document.querySelector('main').getBoundingClientRect().height)},'*')};if(typeof ResizeObserver!=='undefined'){new ResizeObserver(reportHeight).observe(document.querySelector('main'));reportHeight();}
</script></main></body></html>`;
}

export async function exerciseSilkPrototype(doc: Document, api: { store: { all: () => Array<{ confirmed: boolean }> }; send: (repeat: boolean) => Promise<unknown>; reset: () => void }): Promise<SilkCheck[]> {
  const field = (id: string) => doc.getElementById(id) as HTMLInputElement;
  api.reset(); field('name').value = 'Учебен посетител'; field('contact').value = 'test@example.invalid'; field('date').value = ''; field('mode').value = 'success';
  const checks: SilkCheck[] = [];
  await api.send(false);
  checks.push({ id: 'received', label: 'Валидният вход създава един запис без непотвърдено обещание', passed: api.store.all().length === 1 && api.store.all()[0].confirmed === false, help: 'Провери бутона и състоянието на записа. Нямаме данни за потвърждение на час или наличност.' });
  await api.send(true);
  checks.push({ id: 'repeated', label: 'Повторението запазва един запис', passed: api.store.all().length === 1, help: 'Повторението трябва да запази номера на първата заявка.' });
  api.reset(); field('contact').value = '';
  await api.send(false);
  checks.push({ id: 'missing', label: 'Липсващият контакт не създава измислен запис', passed: api.store.all().length === 0 && field('contact').value === '', help: 'Поискай контакт; не го попълвай вместо човека.' });
  api.reset(); field('contact').value = 'test@example.invalid'; field('mode').value = 'error';
  await api.send(false);
  checks.push({ id: 'failure', label: 'Неуспехът пази полетата и не отчита получена заявка', passed: api.store.all().length === 0 && field('contact').value === 'test@example.invalid' && !doc.getElementById('status')?.textContent?.startsWith('Потвърдено'), help: 'Показвай грешката и запази въведеното за повторение.' });
  field('mode').value = 'success';
  return checks;
}
