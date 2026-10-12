import type { SourceModule } from '@/mocks/learning-platform';

export const MARKETING_COMMUNITY_MODULE_ORDER = [
  "s03-m01",
  "s03-m02",
  "s03-m05",
  "s03-m03",
  "s03-m07",
  "s03-m10",
  "s03-m11",
  "s03-m08",
  "s03-m06",
  "s03-m09",
  "s03-m04",
  "s03-m16",
  "s03-m15",
  "s03-m12",
  "s03-m13",
  "s03-m14",
  "s03-m17",
  "s03-m18",
  "s03-m19",
  "s03-m20"
] as const;

// Lesson IDs and their storage modules remain stable across the curriculum order.
const MODULE_OVERRIDES: Record<string, Partial<SourceModule>> = {
  "s03-m01": {
    "title": "Какво е маркетинг и как хората избират",
    "subtitle": "Разбираш нуждата, предложението и изпълнението преди избора на реклама",
    "homeworkPrompt": "Различаваш маркетинг, позициониране и реклама; сравняваш алтернативи и вземаш решение по предоставен бюджет и запитвания.",
    "lessons": [
      {
        "id": "lm01-00",
        "title": "Какво всъщност прави маркетингът",
        "hasQuiz": true
      },
      {
        "id": "lm01-04",
        "title": "Маркетинг, позициониране и реклама: кое поправяш първо",
        "hasQuiz": true
      },
      {
        "id": "lm01-05",
        "title": "Какво друго може да направи човекът",
        "hasQuiz": true
      },
      {
        "id": "lm01-02",
        "title": "Защо да изберат точно това предложение",
        "hasQuiz": true
      },
      {
        "id": "lm01-03",
        "title": "Кой стои зад обещанието",
        "hasQuiz": true
      },
      {
        "id": "lm01-06",
        "title": "Как проверяваш какво хората са разбрали",
        "hasQuiz": true
      },
      {
        "id": "lm01-07",
        "title": "За какво да отделиш маркетинговия бюджет",
        "hasQuiz": true
      }
    ]
  },
  "s03-m02": {
    "title": "Хората зад решението: нужди, роли и общности",
    "subtitle": "Повод, участници, точни реплики и нужната информация",
    "homeworkPrompt": "Разпознаваш нужда и роли, свързваш готови маршрути и сравняваш проекти по труд и обхват. Решенията са по предоставени случаи.",
    "lessons": [
      {
        "id": "lm02-01",
        "title": "Защо човек търси помощ: нужда, повод и участници в избора",
        "hasQuiz": true
      },
      {
        "id": "lm02-02",
        "title": "Какво превръща намерението в действие",
        "hasQuiz": true
      },
      {
        "id": "lm02-03",
        "title": "Защо решението се отлага: цена, доверие, време и неизвестни",
        "hasQuiz": true
      },
      {
        "id": "lm02-08",
        "title": "Как да слушаш общност: сигнал, контекст и граница на извода",
        "hasQuiz": true
      },
      {
        "id": "lm02-05",
        "title": "Думите на клиента: точен цитат, смисъл и разбираем отговор",
        "hasQuiz": true
      },
      {
        "id": "lm02-06",
        "title": "Три полезни въпроса и минимум лични данни",
        "hasQuiz": true
      },
      {
        "id": "lm02-04",
        "title": "Кога предложението е подходящо и кога трябва да откажеш",
        "hasQuiz": true
      },
      {
        "id": "lm02-07",
        "title": "Икономика на проекта: приход, труд, обхват и обслужване",
        "hasQuiz": true
      }
    ]
  },
  "s03-m05": {
    "title": "Стойност, цена и честно предложение",
    "subtitle": "Себестойност, обхват, надценка, марж и крайна сума",
    "homeworkPrompt": "Пресмяташ нови учебни цени, избираш изпълним обхват и проверяваш условията на пакети, гаранции и ценова страница.",
    "lessons": [
      {
        "id": "lm05-01",
        "title": "Разход, стойност и обхват: как се получава изпълнима цена",
        "hasQuiz": true
      },
      {
        "id": "lm05-02",
        "title": "Три честни варианта: нужда, цена, обхват и сравнение",
        "hasQuiz": true
      },
      {
        "id": "lm05-03",
        "title": "Име на пакет, което обяснява какво получаваш",
        "hasQuiz": true
      },
      {
        "id": "lm05-04",
        "title": "Гаранция: изпълним ангажимент и запазени потребителски права",
        "hasQuiz": true
      },
      {
        "id": "lm05-05",
        "title": "„Скъпо е“: сравнение, бюджет и промяна на обхвата",
        "hasQuiz": true
      },
      {
        "id": "lm05-06",
        "title": "Ценова страница: първа сума, следващ разход и условия",
        "hasQuiz": true
      },
      {
        "id": "lm05-07",
        "title": "Как се формира цената и кога става окончателна",
        "hasQuiz": true
      },
      {
        "id": "lm05-08",
        "title": "Промяна на цената: разход, договори и реакция на клиентите",
        "hasQuiz": true
      }
    ]
  },
  "s03-m03": {
    "title": "Послание, което човек разбира и може да предаде",
    "subtitle": "Ясни думи, проверими факти и условия, които се запазват при преразказ",
    "homeworkPrompt": "Сравняваш готови послания, съставяш текст чрез избор на части и проверяваш AI чернови, доказателства и ограничения.",
    "lessons": [
      {
        "id": "lm03-01",
        "title": "Първият екран: какво предлагаш, за кого и какво следва",
        "hasQuiz": true
      },
      {
        "id": "lm03-06",
        "title": "Различни послания: един въпрос, ясни случаи и проверка",
        "hasQuiz": true
      },
      {
        "id": "lm03-02",
        "title": "Число в посланието: източник, период, единица и граница",
        "hasQuiz": true
      },
      {
        "id": "lm03-03",
        "title": "Клиентско убеждение: кога е вярно и какво трябва да се провери",
        "hasQuiz": true
      },
      {
        "id": "lm03-07",
        "title": "Отговор на притеснението до обещанието",
        "hasQuiz": true
      },
      {
        "id": "lm03-08",
        "title": "Едно послание в три дължини, с важните условия",
        "hasQuiz": true
      },
      {
        "id": "lm03-05",
        "title": "„За нас“: проверими факти, хора и начин за контакт",
        "hasQuiz": true
      },
      {
        "id": "lm03-04",
        "title": "AI за текстове: задание, глас на бранда и проверка на фактите",
        "hasQuiz": true
      }
    ]
  },
  "s03-m07": {
    "title": "Доверие, репутация и доброволна препоръка",
    "subtitle": "Честни отзиви, полезно участие и изпълнена поправка",
    "homeworkPrompt": "Избираш покана, отговор и поправка, проверяваш разрешен цитат и отчет. Финалът включва пет гранични случая и нови ситуации от първите пет модула.",
    "lessons": [
      {
        "id": "lm07-01",
        "title": "Честен отзив и лична препоръка: различни действия",
        "hasQuiz": true
      },
      {
        "id": "lm07-07",
        "title": "Полезно участие в общност и доброволно споделяне",
        "hasQuiz": true
      },
      {
        "id": "lm07-08",
        "title": "Цитатът като доказателство: точност, ограничения и позволена употреба",
        "hasQuiz": true
      },
      {
        "id": "lm07-03",
        "title": "Отговор на отзив: AI чернова, факти и човешко одобрение",
        "hasQuiz": true
      },
      {
        "id": "lm07-04",
        "title": "Оплакване: уважителен отговор и действителна поправка",
        "hasQuiz": true
      },
      {
        "id": "lm07-05",
        "title": "Негативен, нарушаващ или липсващ отзив: различни проверки",
        "hasQuiz": true
      },
      {
        "id": "lm07-06",
        "title": "Репутационен инцидент: факти, отговорници и условия за нов старт",
        "hasQuiz": true
      },
      {
        "id": "lm07-02",
        "title": "Поканите като процес: допустим контакт, отказ и един запис",
        "hasQuiz": true
      },
      {
        "id": "lm07-09",
        "title": "Отчет за доверие: покани, отзиви, оплаквания и поправки",
        "hasQuiz": true
      },
      {
        "id": "lm07-10",
        "title": "Проверка на първите пет модула: решение, послание и честна препоръка",
        "hasQuiz": true
      }
    ]
  }
};

export const MARKETING_COMMUNITY_LESSON_IDS = new Set([
  ...Object.values(MODULE_OVERRIDES).flatMap(module => module.lessons?.map(lesson => lesson.id) ?? []),
  'lm01-01',
]);

export function marketingCommunityModules(modules: readonly SourceModule[]): SourceModule[] {
  const byId = new Map(modules.map(module => [module.id, module]));
  const aiLesson = byId.get('s03-m01')?.lessons.find(lesson => lesson.id === 'lm01-01');
  return MARKETING_COMMUNITY_MODULE_ORDER.map((id, index) => {
    const original = byId.get(id);
    if (!original) throw new Error('Missing Marketing Basics module: ' + id);
    const module = { ...original, ...MODULE_OVERRIDES[id], number: String(index + 1).padStart(2, '0') };
    if (id === 's03-m09' && aiLesson && !module.lessons.some(lesson => lesson.id === aiLesson.id)) {
      const after = module.lessons.findIndex(lesson => lesson.id === 'lm09-05') + 1;
      module.lessons = [...module.lessons.slice(0, after), { ...aiLesson, sourceModuleId: 's03-m01' }, ...module.lessons.slice(after)];
    }
    return module;
  });
}

