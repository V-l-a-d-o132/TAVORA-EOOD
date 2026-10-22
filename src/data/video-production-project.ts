import { VIDEO_CLIENT_PROJECT, videoClientEstimate } from './video-client-project';

export const PRODUCTION_STAGES = ['script', 'camera', 'light', 'sound'] as const;
export type ProductionStage = typeof PRODUCTION_STAGES[number];
export type ScriptVersion = 'process' | 'result' | 'delivery';
export type FrameVersion = 'wide' | 'portrait' | 'portrait-edge';
export type LightVersion = 'window' | 'bounce' | 'mixed';
export type SoundVersion = 'noise' | 'room' | 'clipped' | 'neural' | 'filtered';

export function videoProductionStage(moduleId: string): ProductionStage | null {
  const match = /^s02-m0([2-5])$/.exec(moduleId);
  return match ? PRODUCTION_STAGES[Number(match[1]) - 2] : null;
}

export function videoProductionScript(version: ScriptVersion) {
  const process = [
    { time: '0–4 сек.', picture: 'Подготовка на чашата', text: 'Време за кафе.', source: 'Предоставен запис' },
    { time: '4–8 сек.', picture: 'Видимо приготвяне', text: 'Виж приготвянето на еспресото.', source: 'Предоставен запис' },
    { time: '8–12 сек.', picture: 'Готова чаша', text: 'Учебно предложение: еспресо за 2 €.', source: 'Запис + условие от брифа' },
    { time: '12–16 сек.', picture: 'Задържан кадър за финала', text: version === 'delivery' ? 'Доставка до дома за 5 минути.' : 'Получаване на място. Попитай в обекта.', source: version === 'delivery' ? 'Липсва потвърждение за доставка и време' : 'Условие от брифа; адресът се уточнява преди реална публикация' },
  ];
  if (version === 'result') return [
    { ...process[2], time: '0–4 сек.' }, { ...process[0], time: '4–8 сек.' },
    { ...process[1], time: '8–12 сек.' }, process[3],
  ];
  return process;
}

export const PRODUCTION_FRAMES = {
  wide: { label: 'Широкият запис', dimensions: '480 × 270', note: 'Ориентир за действието в ширина. Това е предоставен износ, не ново заснемане.' },
  portrait: { label: 'Първи вертикален изрез', dimensions: '152 × 270', note: 'Изрязан е реалният широк запис. Провери чашата и действието през целия отрязък.' },
  'portrait-edge': { label: 'Изместен вертикален изрез', dimensions: '152 × 270', note: 'Променено е видимото поле от същия запис, а не позицията на камерата. Сравни какво остава извън кадър.' },
} as const;

export const PRODUCTION_LIGHTS = {
  window: { label: 'Прозорец отстрани', note: 'План с един водещ източник. Провери важната сянка и промяната на слънцето в истинска проба.' },
  bounce: { label: 'Прозорец и бял отражател', note: 'Отразената светлина е насочена към сенчестата страна. Сравнявай при еднаква позиция и съпоставима светлина.' },
  mixed: { label: 'Прозорец и друга лампа', note: 'Два различни източника могат да оцветят различно важната повърхност. Провери ги отделно; заключен баланс не ги уеднаквява.' },
} as const;

const closed = '/academy-labs/perfect-video/closed';
const ai = '/academy-labs/perfect-video/ai';
export const PRODUCTION_SOUNDS = {
  noise: { label: 'Добавен фонов шум', file: `${closed}/voice-noise.mp3`, reference: `${closed}/voice-clean.mp3`, referenceLabel: 'Референтна реплика без добавения шум', note: 'Чуй дали фонът покрива тихите срички. Това е контролирано добавен шум, не запис от истинско кафене.' },
  room: { label: 'Добавени отражения', file: `${closed}/voice-room.mp3`, reference: `${closed}/voice-clean.mp3`, referenceLabel: 'Референтна реплика без добавените отражения', note: 'Отраженията са различен проблем от постоянния шум. За собствен запис провери позицията и помещението преди обработка.' },
  clipped: { label: 'Ограничени върхове, после намалено ниво', file: `${closed}/voice-clipped.mp3`, reference: `${closed}/voice-clean.mp3`, referenceLabel: 'Референтна реплика преди ограничаването', note: 'По-тих изкривен файл не доказва възстановена информация. При неприемлива ключова дума търси друг дубъл или нов запис.' },
  neural: { label: 'Невронна обработка на шумния файл', file: `${ai}/voice-neural.mp3`, reference: `${closed}/voice-noise.mp3`, referenceLabel: 'Шумният вход преди невронната обработка', note: 'Този файл действително е обработен предварително с невронен филтър. Свери съгласните и тихите думи; не е резултат от живо облачно извикване.' },
  filtered: { label: 'Силно ограничени високи честоти', file: `${ai}/voice-filtered.mp3`, reference: `${closed}/voice-clean.mp3`, referenceLabel: 'Референцията преди силното филтриране', note: 'Това е умишлен негенеративен контролен вариант. По-малко високи честоти не означава автоматично по-разбираема реч.' },
} as const;

export const SHOOTING_WORK = [['Подготовка на мястото', 0.5], ['Заснемане и проби', 2], ['Път и прибиране на техниката', 0.5]] as const;
export function videoProductionEstimate(includeShooting: boolean) {
  const base = videoClientEstimate(false, false);
  const additionalHours = includeShooting ? SHOOTING_WORK.reduce((sum, [, hours]) => sum + hours, 0) : 0;
  const additionalExternal = includeShooting ? 10 : 0;
  const additionalCost = additionalHours * VIDEO_CLIENT_PROJECT.rate + additionalExternal;
  const additionalPrice = includeShooting ? 100 : 0;
  return { additionalHours, additionalExternal, additionalCost, additionalPrice,
    totalCost: base.cost + additionalCost, totalPrice: base.price + additionalPrice,
    difference: base.price + additionalPrice - base.cost - additionalCost };
}

export type ProductionSelection = { script: ScriptVersion; frame: FrameVersion; light: LightVersion; sound: SoundVersion; shooting: boolean };
export function videoProductionDossier(selection: ProductionSelection) {
  const estimate = videoProductionEstimate(selection.shooting);
  return [
    'TAVORA · V-1 · Сценарен и снимачен план',
    'Измислен учебен проект. Това са избрани решения от текущата сесия, не оценка, клиентско одобрение или изпратена оферта.',
    'Основната услуга е монтаж от предоставен материал. Новото заснемане изисква отделно съгласуване.',
    'Сценарий:', ...videoProductionScript(selection.script).map(s => `${s.time} | ${s.picture} | ${s.text} | ${s.source}`),
    'Сценарният избор е текстов план. Не е нов монтиран MP4. За адреса и всяко ново условие е нужно уточнение преди реална публикация.',
    `Кадър за сравнение: ${PRODUCTION_FRAMES[selection.frame].label}, ${PRODUCTION_FRAMES[selection.frame].dimensions}, предоставен 15 fps износ.`,
    'План за ново заснемане: нормално движение на 25 fps като учебна отправна точка; проба на затвора и лампите; проверени фокус, експозиция и баланс; отделен вертикален детайл при липсващо действие. Възможностите се сверяват в конкретното устройство.',
    `Светлинен план: ${PRODUCTION_LIGHTS[selection.light].label}. ${PRODUCTION_LIGHTS[selection.light].note}`,
    'Схемата е визуализация на разположение, а не физическо измерване или заснета проба.',
    `Звуково сравнение: ${PRODUCTION_SOUNDS[selection.sound].label}. ${PRODUCTION_SOUNDS[selection.sound].note}`,
    'Контролната синтетична реплика не е глас на клиента и не е готов voiceover за неговата реклама. За истинския запис се сверяват точният текст, употребата на гласа, разбираемостта, синхронът и правата.',
    `Заснемане: ${selection.shooting ? 'Предложено, още не е одобрено' : 'Не е включено; монтаж от предоставени файлове'}.`,
    `Допълнителен учебен разчет: ${estimate.additionalHours} ч. × ${VIDEO_CLIENT_PROJECT.rate} € + ${estimate.additionalExternal} € външен разход = ${estimate.additionalCost} €. Предложена добавена цена ${estimate.additionalPrice} €.`,
    `С основния монтаж: предложена обща цена ${estimate.totalPrice} €, моделиран разход ${estimate.totalCost} €, разлика ${estimate.difference} € преди непосочени общи разходи и данъци. Числата не са пазарна тарифа.`,
    'Преди предаване: потвърдени условия и одобряващ; достатъчно действително покритие; четим текст; използваем звук; известен входен профил и подходящ износ; отворен и прегледан точен файл.',
  ].join('\n\n');
}
