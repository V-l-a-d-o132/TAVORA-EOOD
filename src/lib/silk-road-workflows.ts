/** Teaching simulations with synthetic data. No network, credentials or student text. */
export type WorkflowKind = 'checkout' | 'publishing' | 'request';
export type WorkflowState = {
  kind: WorkflowKind; scenario: string; verified: boolean; approved: boolean;
  records: number; effects: number; notification: boolean; owner: boolean; journal: string[];
};
export const workflowScenarios: Record<WorkflowKind, ReadonlyArray<readonly [string, string]>> = {
  checkout: [['redirect', 'Браузърът показва „Успех“; няма сървърна проверка'], ['unpaid', 'Сесия complete; плащането още е unpaid'], ['paid', 'Платен продукт; проверката ще върне paid']],
  publishing: [['current', 'Текуща версия V3; условията са валидни'], ['changed', 'Одобрена V3; текстът е променен до V4'], ['withdrawn', 'Офертата е оттеглена след подготовката'], ['unknown', 'Резултатът от първото изпращане е неизвестен']],
  request: [['valid', 'Пълна нова заявка'], ['missing', 'Липсва контакт'], ['notification', 'Записът успява; известието отказва']],
};
export const workflowActions: Record<WorkflowKind, ReadonlyArray<readonly [string, string]>> = {
  checkout: [['verify', 'Провери сървърния статус'], ['execute', 'Опитай да включиш достъпа'], ['repeat', 'Повтори същото събитие']],
  publishing: [['approve', 'Одобри текущата версия'], ['verify', 'Свери условията и резултата'], ['execute', 'Опитай публикуване'], ['repeat', 'Повтори същото действие']],
  request: [['execute', 'Приеми заявката'], ['repeat', 'Повтори същата заявка'], ['new', 'Нов проект от същия контакт'], ['notify', 'Повтори известието'], ['assign', 'Назначи отговорник']],
};
export function startWorkflow(kind: WorkflowKind, scenario = workflowScenarios[kind][0][0]): WorkflowState {
  return { kind, scenario, verified: false, approved: kind === 'publishing' && scenario !== 'changed',
    records: 0, effects: 0, notification: false, owner: false, journal: ['Начало с учебни данни. Няма външно действие.'] };
}
export function advanceWorkflow(previous: WorkflowState, action: string): WorkflowState {
  const state = { ...previous, journal: [...previous.journal] };
  const note = (message: string) => { state.journal = [...state.journal.slice(-11), message]; return state; };
  if (state.kind === 'checkout') {
    if (action === 'verify') {
      state.verified = state.scenario === 'paid';
      return note(state.verified ? 'Сървърна проверка: платената поръчка е paid.' : state.scenario === 'unpaid'
        ? 'Сървърна проверка: unpaid. Няма основание за платен достъп.' : 'Браузърният адрес не е доказателство за плащане.');
    }
    if (action === 'execute' || action === 'repeat') {
      if (!state.verified) return note('Достъпът остава спрян: липсва проверено успешно плащане.');
      if (state.effects) return note('Същото събитие е обработено. Достъпите остават 1.');
      state.effects = 1; state.records = 1; return note('Запазено изпълнение за поръчката. Включен е един учебен достъп.');
    }
  } else if (state.kind === 'publishing') {
    if (action === 'approve') { state.approved = true; return note('Одобрението е записано за текущата версия. Условията още трябва да се сверят.'); }
    if (action === 'verify') {
      state.verified = state.scenario !== 'withdrawn';
      if (state.scenario === 'unknown') { state.effects = 1; return note('Сверката намира успешно първо изпращане. Повторно публикуване не е нужно.'); }
      return note(state.verified ? 'Условията са валидни; няма предишно изпълнение.' : 'Офертата е оттеглена. Публикуването е спряно.');
    }
    if (action === 'execute' || action === 'repeat') {
      if (!state.approved) return note('Текущата версия няма одобрение. Старото одобрение не се пренася.');
      if (!state.verified) return note('Преди изпращане свери условията и последния резултат.');
      if (state.effects) return note('Действието вече е изпълнено. Не се създава втора публикация.');
      state.effects = 1; return note('Текущата одобрена версия е публикувана веднъж в учебния журнал.');
    }
  } else {
    if (['execute', 'repeat', 'new'].includes(action)) {
      if (state.scenario === 'missing') return note('Няма контакт. Заявката чака уточнение; не е приета с измислени данни.');
      if (state.records && action !== 'new') return note('Намерена е същата заявка. Няма втори запис; виж състоянието на известието.');
      state.records += 1; state.owner = false; state.notification = state.scenario !== 'notification';
      return note(`Запис R-${state.records} е запазен. ${state.notification ? 'Известието е изпратено.' : 'Известието е неуспешно; записът остава.'} Няма назначен отговорник.`);
    }
    if (action === 'notify') {
      if (!state.records) return note('Още няма приета заявка, за която да се изпрати известие.');
      if (state.notification) return note('Известието за последната заявка вече е изпратено.');
      state.notification = true; return note('Повторено е само известието. Броят на записите не се променя.');
    }
    if (action === 'assign') {
      if (!state.records) return note('Няма приета заявка за поемане.');
      state.owner = true; return note('Последната заявка вече има отговорник. Поемането е отделно от известието.');
    }
  }
  return state;
}
