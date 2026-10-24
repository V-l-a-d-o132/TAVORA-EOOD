import { VIDEO_CLIENT_PROJECT, videoClientSrt } from './video-client-project';
export const VIDEO_COMPLETION_STAGES=[['report','11. Отчет','pv11-01'],['ai','12. ИИ и общ труд','pv12-01'],['quote','13. Обхват и цена','pv13-10'],['revision','14. Корекция и приемане','pv14-04'],['portfolio','15. Доставка и портфолио','pv15-01']] as const;
export type CompletionStage=typeof VIDEO_COMPLETION_STAGES[number][0];
export function videoCompletionStage(moduleId:string):CompletionStage|null{const m=/^s02-m(11|12|13|14|15)$/.exec(moduleId);return m?VIDEO_COMPLETION_STAGES[Number(m[1])-11][0]:null;}
export const COMPLETION_CHOICES=[
 {stage:'report',key:'report',label:'Извод от учебния отчет',options:[['sales','500 гледания означават 500 нови клиенти'],['bounded','300 външни + 200 от търсене; покупки не са измерени']]},
 {stage:'ai',key:'ai',label:'Маршрут за надписи',options:[['manual','Ръчно: 35 минути общо'],['slow','ИИ А: 5 + 4 + 18 + 6 + 4 минути'],['fast','ИИ Б: 5 + 2 + 10 + 4 + 4 минути']]},
 {stage:'quote',key:'scope',label:'Допълнителна работа',options:[['base','5 часа; първоначална цена 160 €'],['unquoted','Още 2 часа без приета нова цена'],['agreed','Учебно приети още 2 часа и +50 €']]},
 {stage:'revision',key:'caption',label:'Надписи за текущата версия',options:[['delivery','Чернова с непотвърдена доставка'],['verified','2 € и получаване на място по брифа']]},
 {stage:'revision',key:'acceptance',label:'Запис за приемане',options:[['pending','Няма потвърждение за тази версия'],['accepted','Учебният одобряващ потвърждава тази версия']]},
 {stage:'portfolio',key:'payment',label:'Запис за плащане',options:[['none','Няма потвърдено плащане'],['base','Учебен журнал: платени 160 €'],['full','Учебен журнал: платени 210 €']]},
 {stage:'portfolio',key:'portfolio',label:'Представяне на работата',options:[['claim','Платена кампания с нови продажби'],['honest','Учебен монтаж от предоставен материал; роля — избраните решения']]},
] as const;
export type CompletionState={report:'sales'|'bounded';ai:'manual'|'slow'|'fast';scope:'base'|'unquoted'|'agreed';caption:'delivery'|'verified';acceptance:'pending'|'accepted';payment:'none'|'base'|'full';portfolio:'claim'|'honest';revision:number};
export type CompletionKey=Exclude<keyof CompletionState,'revision'>;
export const INITIAL_COMPLETION:CompletionState={report:'sales',ai:'manual',scope:'base',caption:'delivery',acceptance:'pending',payment:'none',portfolio:'claim',revision:1};
export function updateVideoCompletion(s:CompletionState,key:CompletionKey,value:string):CompletionState{
 if(!COMPLETION_CHOICES.find(c=>c.key===key)?.options.some(o=>o[0]===value)||s[key]===value)return s;
 const changes=key==='caption'||key==='scope';
 return {...s,...(changes?{revision:s.revision+1,acceptance:'pending' as const}:{}),[key]:value};
}
export function videoCompletionReview(s:CompletionState){
 const hours=s.scope==='base'?5:7,price=s.scope==='agreed'?210:VIDEO_CLIENT_PROJECT.price,cost=hours*VIDEO_CLIENT_PROJECT.rate+VIDEO_CLIENT_PROJECT.expenses;
 const minutes=s.ai==='manual'?35:s.ai==='slow'?37:25,paid=s.payment==='none'?0:s.payment==='base'?160:210,issues:string[]=[];
 if(s.report==='sales')issues.push('Гледанията не удостоверяват брой купувачи.');
 if(s.scope==='unquoted')issues.push('Допълнителният труд чака договорка за цена и срок.');
 if(s.caption==='delivery')issues.push('Надписът обещава непотвърдена доставка.');
 if(s.acceptance==='pending')issues.push('Текущата версия чака приемане.');
 if(s.portfolio==='claim')issues.push('Учебният пример няма реален клиент или измерени продажби.');
 return {hours,price,cost,difference:price-cost,minutes,saved:35-minutes,paid,balance:price-paid,issues,version:`V1-local-${String(s.revision).padStart(2,'0')}`,deliveryReady:s.caption==='verified'&&s.scope!=='unquoted'&&s.acceptance==='accepted'};
}
export function videoCompletionDossier(s:CompletionState,kind:'internal'|'delivery'|'portfolio'){
 const r=videoCompletionReview(s),lines=['TAVORA · Учебно досие V-1','Измислени условия и наблюдения. Изборите не са реално клиентско съгласие, плащане или изпитна оценка.',`Версия на досието: ${r.version}. Източник: process.mp4 — 16 сек., 360 × 640, без звук; износ 25 fps от източник 15 fps. SRT е отделен файл и не е вграден в MP4 от този избор.`];
 if(kind==='portfolio')return [...lines,s.portfolio==='honest'?'Учебен монтаж от предоставени кадри по измислен бриф. Роля: избор на монтаж, надписи, обхват и проверки.':'Представянето като платена успешна кампания няма основание; поправи го преди публична употреба.','Показан резултат: решения и разбор на версия. Собствено заснемане, реални продажби и клиентска препоръка не са удостоверени.','За реално портфолио използвай собствен или изрично разрешен материал. Изтеглянето не предоставя нов лиценз за клиентска реклама.'].join('\n\n');
 lines.push(VIDEO_CLIENT_PROJECT.scope,`Опис: process.mp4; ${r.version}_${s.caption}.srt; корица — отделна проверка, не се създава от този бутон.`,`Надписи:\n${videoClientSrt(s.caption)}`,`Цена по учебния сценарий: ${r.price} €. Обхват: ${s.scope==='base'?'базов':s.scope==='agreed'?'приета в примера добавка 2 часа и 50 €':'добавен труд без приета нова цена'}.`,`Приемане: ${s.acceptance==='accepted'?'учебно потвърдено за текущата версия':'чака'}. Готовност по избраните условия: ${r.deliveryReady?'съвместима версия':'има нерешени условия'}.`,`Плащане: ${s.payment==='none'?'не е потвърдено':`${r.paid} € в учебния журнал`}. Остатък по избраната цена: ${r.balance} €${r.balance<0?' — надплащане за уточняване':''}.`,'Това е опис, а не ZIP с всички файлове. Няма изпращане или публикация към клиент.');
 if(kind==='internal')lines.push(`Вътрешен разчет: ${r.hours} × 20 € + 20 € = ${r.cost} €. Разлика ${r.difference} € преди непосочени общи разходи и данъци. Заснемането е отделно.`,`Проба за надписи: ${r.minutes} минути; спрямо ръчните 35: ${r.saved} минути спестяване. Това не променя автоматично целия петчасов разчет.`,s.report==='bounded'?'Отчет: 300 външни + 200 от търсене за един учебен период. Покупки не са измерени.':'Изводът за 500 клиенти не следва от гледанията.',...r.issues);
 return lines.join('\n\n');
}
