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
    title: 'Група 1: Основа и позициониране',
    subtitle: 'Кой си, за кого работиш и каква е правната и технологична рамка',
    icon: 'ri-focus-3-line',
    color: '#3B5BDB',
    description: 'Модули 01–04: позициониране, клиент, послание, данни и работни инструменти.',
    modules: marketingModules.slice(0, 4),
  },
  {
    id: 'presence',
    title: 'Група 2: Присъствие и видимост',
    subtitle: 'Оферта, Google Business Profile, репутация, сайт, SEO и съдържание',
    icon: 'ri-global-line',
    color: '#2F9E44',
    description: 'Модули 05–10: цени и оферти, GBP, отзиви, сайт и Schema, локално SEO, AI видимост и съдържание със собствен принос.',
    modules: marketingModules.slice(4, 10),
  },
  {
    id: 'traffic',
    title: 'Група 3: Трафик и партньорства',
    subtitle: 'Социални мрежи, реклама, надеждно измерване, кампании и партньори',
    icon: 'ri-traffic-light-line',
    color: '#E67700',
    description: 'Модули 11–16: социално търсене и видео, Meta Ads, Google Ads, first-party данни, кампании и партньорства. Решенията се проверяват по качество, марж и капацитет.',
    modules: marketingModules.slice(10, 16),
  },
  {
    id: 'conversion',
    title: 'Група 4: Превръщане и метрики',
    subtitle: 'CRM, полезни инструменти, имейл, продажби и финален проект',
    icon: 'ri-exchange-funds-line',
    color: '#e53e3e',
    description: 'Модули 17–20: от запитване до среща, lead magnets, имейл и задържане, продажби и икономика. Финалът е 90-дневен проект, четири групови проверки и отделен изпит върху целия курс.',
    modules: marketingModules.slice(16, 20),
  },
];
