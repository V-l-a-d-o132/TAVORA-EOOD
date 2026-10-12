import { LEARNING_SECTIONS, type Module } from '@/mocks/learning-platform';
import { ACADEMY_FREE_MODULE_ID } from '@/config/academy-catalog';

const COLORS = ['#22c55e', '#3B5BDB', '#C2255C', '#7048E8', '#E67700', '#2F9E44', '#0A2540'];

function publicModule(module: Module, index: number) {
  return {
    num: module.number,
    title: module.title,
    subtitle: module.subtitle,
    desc: `${module.subtitle}. ${module.homeworkPrompt}`,
    lessons: module.lessons.length,
    time: `${module.duration} · ${module.lessons.length} урока`,
    tag: module.id === ACADEMY_FREE_MODULE_ID ? 'FREE' : module.id === 's01-m11' ? 'PREMIUM' : undefined,
    color: COLORS[index % COLORS.length],
  };
}

export const SILK_ROAD_PUBLIC_MODULES = LEARNING_SECTIONS[0].modules.map(publicModule);
export const PERFECT_VIDEO_PUBLIC_MODULES = LEARNING_SECTIONS[1].modules.map(publicModule);

const marketingModules = LEARNING_SECTIONS[2].modules.map(publicModule);

export const MARKETING_BASICS_PUBLIC_GROUPS = [
  {
    id: 'foundation',
    title: 'Група 1: Хора, предложение и доверие',
    subtitle: 'Разбираш избора и обясняваш стойността с верни условия',
    icon: 'ri-focus-3-line',
    color: '#3B5BDB',
    description: 'Модули 01–05: какво е маркетинг, участници в решението, цена и обхват, разбираемо послание и доброволна препоръка.',
    modules: marketingModules.slice(0, 5),
  },
  {
    id: 'presence',
    title: 'Група 2: Съдържание и проверка на бизнеса',
    subtitle: 'От полезен разговор до сайт, Google профил и търсене',
    icon: 'ri-global-line',
    color: '#2F9E44',
    description: 'Модули 06–10: съдържание за конкретна нужда, социални общности, сайт, локален профил, SEO и ИИ. Различаваш споделено послание от проверен резултат.',
    modules: marketingModules.slice(5, 10),
  },
  {
    id: 'traffic',
    title: 'Група 3: Условия, партньорства и кампании',
    subtitle: 'Права, ясни интереси и изпълнимо обещание в рекламата',
    icon: 'ri-traffic-light-line',
    color: '#E67700',
    description: 'Модули 11–15: права, данни и инструменти, партньорства, промоции, Meta и Google реклами. Проверяваш обхват, разход и капацитет.',
    modules: marketingModules.slice(10, 15),
  },
  {
    id: 'conversion',
    title: 'Група 4: Измерване и изпълнение след контакта',
    subtitle: 'Данни, CRM, полезни инструменти, имейл и финална проверка',
    icon: 'ri-exchange-funds-line',
    color: '#e53e3e',
    description: 'Модули 16–20: допустими изводи от данни, обслужване, инструмент за избор, полезно продължение по имейл и обща проверка на маркетинговото решение.',
    modules: marketingModules.slice(15, 20),
  },
];
