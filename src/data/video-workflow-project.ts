export const VIDEO_WORKFLOW_STAGES = [
  ['plan', '6. Подготовка', 'pv06-01', 'Сценарият, нужните кадри и звуковият план стават изпълним снимачен ден. Още преди запис избери къде ще копираш и провериш файловете.'],
  ['shoot', '7. Приемане на кадрите', 'pv07-01', 'Снимачният план става опис на приети дубъли. Прегледай началото, действието и края, докато мястото и човекът са още достъпни.'],
  ['archive', '8. Подредба и копия', 'pv08-08', 'Описът и оригиналите стават откриваем и възстановим проект. Първо подреди един проект; след това използвай процеса за серия.'],
  ['edit', '9. Монтаж и износ', 'pv09-01', 'Подреденият материал става цяла история. След сглобката поправяш звук, надписи и цвят, после проверяваш самостоятелния износ.'],
  ['deliver', '10. Предаване', 'pv10-01', 'Износът, SRT, корицата и описът трябва да са от една версия. Изпращането, приемането и резултатът за бизнеса са отделни събития.'],
] as const;
export type WorkflowStage = typeof VIDEO_WORKFLOW_STAGES[number][0];
export function videoWorkflowStage(moduleId: string): WorkflowStage | null {
  const n = /^s02-m(06|07|08|09|10)$/.exec(moduleId);
  return n ? VIDEO_WORKFLOW_STAGES[Number(n[1]) - 6][0] : null;
}
export type WorkflowState = {
  plan: 'pending' | 'approved'; shot: 'missing' | 'complete'; copies: 'folders' | 'verified';
  edit: 'confusing' | 'process'; caption: 'delivery' | 'verified'; review: 'pending' | 'accepted';
  extra: 'none' | 'unquoted' | 'agreed';
};
export const INITIAL_WORKFLOW: WorkflowState = { plan: 'pending', shot: 'missing', copies: 'folders', edit: 'confusing', caption: 'delivery', review: 'pending', extra: 'none' };
export const WORKFLOW_CHOICES = [
  { stage:'plan', key:'plan', label:'Условия за начало', options:[['pending','Има сценарий; достъпът и снимачната добавка чакат потвърждение'],['approved','Учебното условие потвърждава достъп, участник и обхват']] },
  { stage:'shoot', key:'shot', label:'Получен опис на кадрите', options:[['missing','Дубълът спира преди получаването на чашата'],['complete','Описът посочва прегледан пълен дубъл с използваем край']] },
  { stage:'archive', key:'copies', label:'Състояние на копията', options:[['folders','Две папки на един диск'],['verified','Отделен носител и отчетен успешен тест за възстановяване']] },
  { stage:'edit', key:'edit', label:'Монтаж за проверка', options:[['confusing','Резултат → начало → процес'],['process','Начало → процес → резултат']] },
  { stage:'deliver', key:'caption', label:'Субтитри към пакета', options:[['delivery','Добавено обещание за доставка за 5 минути'],['verified','Потвърдените 2 € и получаване на място']] },
  { stage:'deliver', key:'extra', label:'Допълнителна работа по монтажа', options:[['none','Само първоначалният обхват'],['unquoted','Още 2 часа, без приета промяна на цената'],['agreed','Още 2 часа и изрично приети +50 € в този пример']] },
  { stage:'deliver', key:'review', label:'Статус в учебния журнал', options:[['pending','Чака преглед'],['accepted','Учебният журнал потвърждава избраната версия']] },
] as const;
export function updateVideoWorkflow(s: WorkflowState, key: keyof WorkflowState, value: string): WorkflowState {
  if (!WORKFLOW_CHOICES.find(c => c.key === key)?.options.some(o => o[0] === value)) return s;
  return { ...s, ...(['edit', 'caption', 'extra'].includes(key) ? { review: 'pending' as const } : {}), [key]: value };
}
export function videoWorkflowReview(s: WorkflowState) {
  const issues: string[] = [];
  if (s.plan === 'pending') issues.push('Предложеното заснемане още чака потвърдени достъп, участник и обхват.');
  if (s.shot === 'missing') issues.push('В учебния опис липсва използваем край на действието; повтори го преди напускане.');
  if (s.copies === 'folders') issues.push('Двете папки са на един диск; няма проверено независимо копие.');
  if (s.edit === 'confusing') issues.push('Редът прескача между резултат и начало; за този бриф подреди процеса ясно.');
  if (s.caption === 'delivery') issues.push('SRT обещава непотвърдена доставка; поправи текста преди предаване.');
  if (s.review === 'pending') issues.push('Избраната версия още не е приета в учебния журнал.');
  if (s.extra === 'unquoted') issues.push('Допълнителните два часа още нямат съгласувана цена и срок.');
  const hours = s.extra === 'none' ? 5 : 7;
  const price = s.extra === 'agreed' ? 210 : 160;
  const cost = hours * 20 + 20;
  return { issues, hours, price, cost, difference: price - cost };
}
export function videoWorkflowDossier(s: WorkflowState) {
  const r = videoWorkflowReview(s);
  return [
    'TAVORA · V-1 · Учебно досие за модули 6–10',
    'Измислен проект. Изборите са състояния в симулация, не доказателство за извършена работа, приемане или доход.',
    ...WORKFLOW_CHOICES.map(c => `${c.label}: ${c.options.find(o => o[0] === s[c.key])?.[1]}`),
    'Папки: 01_originals, 02_project, 03_work, 04_delivery. Папките са организация, не независими копия.',
    `MP4: ${s.edit}.mp4 · действителен предоставен учебен файл, 16 секунди, 360 × 640, износ 25 fps, без звук. Източникът е 15 fps.`,
    'SRT е отделен файл, не вградени надписи. Свържи го със същата версия на MP4.',
    'Разчетът по-долу е само за монтаж от готов материал. Предложените нови снимки не са включени.',
    `Труд ${r.hours} ч. × 20 € + 20 € външен разход = ${r.cost} €. Цена ${r.price} €. Разлика ${r.difference} € преди непосочени общи разходи и данъци.`,
    s.extra === 'agreed' ? 'Само в този учебен вариант клиентът изрично приема още 50 € за допълнителните 2 часа.' : 'Няма изрично приета допълнителна цена в този вариант.',
    r.issues.length ? 'Остава за поправка:\n' + r.issues.map(x => '• ' + x).join('\n') : 'Избраните учебни условия са съвместими. Това не удостоверява собствено снимане или реална клиентска доставка.',
  ].join('\n\n');
}
