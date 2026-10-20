import source from '@/data/marketing-ai-final-workbenches.json';
export type FinalWorkbenchId = keyof typeof source;
export type FinalModelState = { records: number; receipt: boolean; notices: number };
export type FinalModelResult = { state: FinalModelState; message: string; accepted: boolean; value?: number | null };
export const FINAL_WORKBENCHES = source;
export const FINAL_MODEL_NOTE = 'Работещ учебен модел с готови входове. Действията променят само показаното състояние; няма външно изпращане или запис.';
export const FINAL_MODEL_RESET = 'Започни случая отначало';
export const FINAL_MODEL_RESULT = 'Резултат в учебния модел';
export function finalModelInitial(id: FinalWorkbenchId, caseId: string): FinalModelState {
  const row = source[id].cases.find(c => c.id === caseId);
  return { records: id === 'automation' && row && 'exists' in row.data && row.data.exists ? 1 : 0, receipt: false, notices: 0 };
}
const number = (value: number) => value.toLocaleString('bg-BG', { maximumFractionDigits: 2 });
export function runFinalModel(id: FinalWorkbenchId, caseId: string, action: string, current?: FinalModelState): FinalModelResult | null {
  const model = source[id], row = model.cases.find(c => c.id === caseId);
  if (!row || !model.actions.some(a => a.id === action)) return null;
  const state = { ...(current || finalModelInitial(id, caseId)) };
  const data = row.data as Record<string, unknown>;
  const result = (message: string, accepted = true, value?: number | null): FinalModelResult => ({ state, message, accepted, ...(value !== undefined ? { value } : {}) });
  if (id === 'automation') {
    if (action === 'receive') {
      if (state.records) return result('Т41 вече има един запис и Нина. Повторението не създава втори запис.');
      state.records = 1; return result('Създаден е един учебен запис Т41 с Нина. Час или плащане не са потвърдени.');
    }
    if (!state.records) return result('Първо е нужен запис и отговорник. Не потвърждаваме получена заявка без тях.', false);
    if (!data.mail) return result('Известието е отказано. Записът остава един; грешката се предава на Петър.', false);
    state.notices += 1; return result('Известието е прието от услугата. Няма доказателство за доставка, прочит или резервация.');
  }
  if (id === 'campaign') {
    if (action === 'inspect') return result(data.record ? data.owner ? 'Има запис Т12 и отговорник Иво. Няма избран час.' : 'Има запис Т12, но липсва отговорник.' : 'Успешният екран няма подкрепящ запис. Отказът остава за проверка.', !!data.record && !!data.owner);
    return result(data.record && data.owner ? 'Провереният маршрут може да се приеме по записа и отговорника. Това не е потвърден час.' : 'Маршрутът още не се приема. Нужни са запис и назначен отговорник, после повторен тест.', !!data.record && !!data.owner);
  }
  if (id === 'ads') {
    if (action === 'query') return result(data.query ? 'Заявката търси дадената услуга. Това още не приема текста и страницата.' : 'Заявката е за работа, а не за услугата. Отдели я за преглед на намерението.', !!data.query);
    if (action === 'text') return result(data.text ? 'Текстът пази цена и срок след преглед.' : 'Върни текста: „днес за 10 €“ няма източник.', !!data.text);
    return result(data.url ? 'Разрешената страница е /pokani с актуалните условия.' : 'Дестинацията /arhiv е изтекла. Нужен е актуален разрешен път.', !!data.url);
  }
  if (id === 'analytics') {
    const records = Number(data.records), duplicates = Number(data.duplicates), unique = records - duplicates;
    if (action === 'unique') return result(`${records} − ${duplicates} = ${unique} уникални заявки. Сесиите са отделна единица.`, true, unique);
    if (action === 'status') {
      const a = Number(data.accepted), b = Number(data.rejected), c = Number(data.unknown), sum = a + b + c;
      return result(`${a} + ${b} + ${c} = ${sum} статуса при ${unique} уникални заявки. ${sum === unique ? 'Сборът съвпада; неизвестното не е покупка.' : 'Несъответствие: провери набора, преди да правиш извод.'}`, sum === unique, sum);
    }
    return result(`${data.sessions} сесии и ${unique} уникални заявки не са еднакви единици. Разликата не е брой изгубени клиенти.`);
  }
  if (id === 'crm') {
    if (action === 'propose') return result('Предложение: само Д74 → „приета“ с задача за Петя. Няма плащане.');
    if (action === 'apply') {
      if (!data.write) return result('Няма право за промяна. Подготви задача за човек; записът остава непроменен.', false);
      state.receipt = true; return result('Операцията връща „успех“. Следва повторен прочит; още не потвърждаваме крайното състояние.');
    }
    if (!state.receipt) return result('Първо проследи разрешената операция. Няма нов резултат за потвърждение.', false);
    return result(data.readback ? 'Прочитът потвърждава Д74 „приета“ и Петя. Плащане не е установено.' : 'Прочитът показва стария етап. Предай несъответствието на отговорник, без да обявяваш успех.', !!data.readback);
  }
  if (id === 'calculator') {
    if (data.price === null || data.cost === null) return result('Нужна е цена и включен разход. Липсващата стойност не става нула.', false, null);
    const price = Number(data.price), cost = Number(data.cost), difference = price - cost;
    if (action === 'calculate') return result(`${number(price)} − ${number(cost)} = ${number(difference)} € принос по включените разходи.`, true, difference);
    if (price === 0) return result('Маржът не се определя при нулева цена. Приносът остава −20 € в този готов случай.', false, null);
    return result(`${number(difference)} / ${number(price)} × 100 = ${number(difference / price * 100)}% марж, не нетна печалба.`, true, difference / price * 100);
  }
  if (id === 'email') {
    if (action === 'draft') return result('Подготвена е само учебна чернова. Това не е изпращане или проверка на текущия статус.');
    const messages: Record<string, string> = {
      active: 'По дадения маршрут напомнянето е допустимо след последна проверка. Нищо не е изпратено.',
      replied: 'Има отговор: спри общото подканяне и предай конкретния въпрос на човек.',
      unsubscribed: 'Отписан от маркетинг: не изпращай следващото маркетингово напомняне.',
      purchased: 'Покупката приключва стария продаващ маршрут. Провери отделните допустими инструкции.',
    };
    return result(messages[String(data.status)], data.status === 'active');
  }
  const plan = action === 'a' ? { price: 800, hours: 18 } : action === 'b' ? { price: 950, hours: 28 } : { price: 650, hours: 12 };
  const fits = plan.price <= Number(data.budget) && plan.hours <= Number(data.hours), approved = action !== 'narrow' || data.approved === true;
  return result(`${plan.price} € / лимит ${data.budget} €; ${plan.hours} часа / капацитет ${data.hours}. ${!fits ? 'Пакетът надвишава бюджета или наличните работни часове.' : !approved ? 'Ресурсът стига, но по-тесният обхват чака приемане.' : 'Пакетът се събира и обхватът е приет. Пазарен резултат не е гарантиран.'}`, fits && approved);
}
export function finalWorkbenchVisibleText(id: FinalWorkbenchId): string[] {
  const model = source[id];
  const outputs = model.cases.flatMap(c => model.actions.flatMap(a => {
    const first = runFinalModel(id, c.id, a.id)!;
    return [first.message, runFinalModel(id, c.id, a.id, first.state)!.message];
  }));
  // Include read-after-write and receive-then-notify branches, too.
  if (id === 'crm') for (const c of model.cases) outputs.push(runFinalModel(id, c.id, 'read', runFinalModel(id, c.id, 'apply')!.state)!.message);
  if (id === 'automation') for (const c of model.cases) outputs.push(runFinalModel(id, c.id, 'notify', runFinalModel(id, c.id, 'receive')!.state)!.message);
  return [model.title, model.intro, FINAL_MODEL_NOTE, FINAL_MODEL_RESET, FINAL_MODEL_RESULT, ...model.cases.flatMap(c => [c.label, c.source]), ...model.actions.map(a => a.label), ...new Set(outputs)];
}
