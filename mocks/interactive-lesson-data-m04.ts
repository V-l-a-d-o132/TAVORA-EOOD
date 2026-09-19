import type { LessonData } from './interactive-lesson-data';

export const S04_L01: LessonData = {
  id: 's01-m04-l04-01', title: 'Стратегия за съдържание', subtitle: 'Без план съдържанието е шум', duration: '30 мин',
  slides: [
    { id: 's04l01-01', type: 'title', title: 'Стратегия за съдържание', subtitle: 'Урок 1 от 10 · 30 минути', body: 'Всеки текст, който публикуваш, трябва да има ЦЕЛ. Без стратегия content-ът е просто хаотични постове без посока.' },
    { id: 's04l01-02', type: 'content', title: '3-те въпроса преди да напишеш и дума', highlights: ['ЗА КОГО пиша? Конкретна аудитория, не "всички".', 'КАКВО искам да направят? Едно действие, не три.', 'ЗАЩО на тях им пука? Каква полза получават?', 'Buyer Persona: име, възраст, проблеми, цели, къде виси online.', 'Brand Voice: как звучиш? Формален, приятелски, директен?'] },
    { id: 's04l01-03', type: 'framework', title: '5-те Content Pillars', frameworkSteps: [
      { number: 1, title: 'Образователно', description: 'Научи аудиторията на нещо', icon: 'ri-book-open-line', example: '"Как да...", "5 грешки при...", "Пълно ръководство за..."' },
      { number: 2, title: 'Вдъхновяващо', description: 'Покажи какво е възможно', icon: 'ri-lightbulb-flash-line', example: 'Case studies, before/after, клиентски успехи.' },
      { number: 3, title: 'Зад кулисите', description: 'Покажи процеса и хората', icon: 'ri-camera-line', example: 'Работен процес, екип, офис, грешки и поуки.' },
      { number: 4, title: 'Социално доказателство', description: 'Ревюта, резултати, числа', icon: 'ri-star-line', example: 'Testimonials, статистики, "Хората говорят за нас".' },
      { number: 5, title: 'Продаващо', description: 'Директна оферта', icon: 'ri-price-tag-3-line', example: 'Промоции, нови услуги, limited-time оферти.' }
    ]},
    { id: 's04l01-04', type: 'content', title: 'Content Funnel Mapping', highlights: ['Top of Funnel (Awareness): blog, социалки, YouTube — образователно.', 'Middle of Funnel (Consideration): case studies, webinars, сравнения.', 'Bottom of Funnel (Decision): оферти, демо, консултации, testimonials.', 'Content KPIs: трафик, engagement, leads, conversions.', 'Актуализация на стратегията: всеки quarter review.'] },
    { id: 's04l01-05', type: 'interactive', title: 'Упражнение: Дефинирай Buyer Persona', interactivePrompt: { scenario: 'Продаваш дигитален маркетинг на локален бизнес в България.', task: 'Създай 1 Buyer Persona — име, възраст, бизнес, проблем, цел.', hint: 'Бъди конкретен. "Собственик на малък бизнес" не е достатъчно.', revealAnswer: 'Пример: "Иван, 42 г., собственик на фризьорски салон във В. Търново. Проблем: има сайт, но не носи клиенти. Цел: 10 нови клиента месечно от Google. Виси във Facebook и Instagram, не ползва LinkedIn."' } },
    { id: 's04l01-06', type: 'checkpoint', title: 'Проверка', checkpoint: { question: 'Кое НЕ е Content Pillar?', options: ['Образователно', 'Вдъхновяващо', 'Случайни мемета', 'Социално доказателство'], correctIndex: 2, explanation: 'Меметата без връзка с бранда не са pillar. Всеки content трябва да служи на поне една от 5-те pillars.' } },
    { id: 's04l01-07', type: 'summary', title: 'Какво научи', keyTakeaways: ['3 въпроса: За кого? Какво действие? Защо им пука?', '5 Pillars: образователно, вдъхновяващо, behind-scenes, social proof, продаващо', 'Content Funnel: Awareness → Consideration → Decision'], cta: 'Създай Buyer Persona за твоя идеален клиент и Editorial Calendar за 30 дни.' }
  ]
};

export const S04_L02: LessonData = {
  id: 's01-m04-l04-02', title: 'Писане за сайт', subtitle: 'Хората не четат — те СКАНИРАТ', duration: '30 мин',
  slides: [
    { id: 's04l02-01', type: 'title', title: 'Писане за сайт', subtitle: 'Урок 2 от 10 · 30 минути', body: 'Онлайн хората не четат дума по дума — те сканират със скоростта на окото. Научи се да пишеш за скенер, не за читател.' },
    { id: 's04l02-02', type: 'framework', title: '5 правила за уеб текст', frameworkSteps: [
      { number: 1, title: 'Заглавие с обещание', description: 'Кажи какво ще получат', icon: 'ri-heading', example: '"Удвои продажбите за 30 дни (без рекламен бюджет)"' },
      { number: 2, title: 'Hook в 1-во изречение', description: 'Въпрос, факт или bold твърдение', icon: 'ri-focus-2-line', example: '"Ако сайтът ти не продава, проблемът не е в дизайна — в думите е."' },
      { number: 3, title: 'Кратки параграфи', description: '2-3 изречения макс', icon: 'ri-text-spacing', example: 'Без блокове от 10 реда. Разбий с whitespace.' },
      { number: 4, title: 'Активен глас', description: '"Ние правим X", не "X се прави"', icon: 'ri-megaphone-line', example: '"Създаваме сайтове" vs "Сайтове биват създавани".' },
      { number: 5, title: 'Един ясен CTA', description: 'Какво точно да направят', icon: 'ri-cursor-line', example: '"Запази консултация", не "Свържете се с нас".' }
    ]},
    { id: 's04l02-03', type: 'comparison', title: 'Слаб vs Силен копирайтинг', leftSide: { label: 'Слаб', verdict: 'bad', content: '"Ние предлагаме професионални уеб дизайн услуги с високо качество. Екип от опитни специалисти използва най-нови технологии. Свържете се с нас."' }, rightSide: { label: 'Силен', verdict: 'good', content: '"Сайтът ти губи клиенти. Не защото е грозен — защото никой не разбира какво продаваш за 5 сек.\nНие оправяме това. За 2 седмици. С гаранция.\n[Бутон: Искам сайт, който продава]"' } },
    { id: 's04l02-04', type: 'content', title: 'Избягвай жаргон и corporate BS', highlights: ['Без "innovative", "synergy", "cutting-edge", "solutions".', 'Директно обръщение: "ти/вие", не "клиентите".', 'Проверка на правописа: винаги. Грешки = непрофесионално.', 'Прочит на глас: звучи ли естествено? Ако не — пренапиши.', 'Bullets и списъци: по-лесни за сканиране от параграфи.'] },
    { id: 's04l02-05', type: 'interactive', title: 'Упражнение: Пренапиши corporate текст', interactivePrompt: { scenario: '"Нашата компания предоставя цялостни маркетингови решения, базирани на иновативни стратегии и cutting-edge технологии за оптимизиране на вашия бизнес потенциал."', task: 'Пренапиши на човешки език. Какво РЕАЛНО правиш?', hint: 'Ако го кажеш на приятел на кафе — как би звучало?', revealAnswer: '"Правим маркетинг, който реално носи клиенти. Без buzzwords, без празни обещания. Виж резултатите на хора като теб →"' } },
    { id: 's04l02-06', type: 'checkpoint', title: 'Проверка', checkpoint: { question: 'Колко изречения максимум на параграф за уеб?', options: ['5-6', '2-3', 'Колкото е нужно', '1'], correctIndex: 1, explanation: '2-3 изречения. Повече = "стена от текст", която никой не чете на екран.' } },
    { id: 's04l02-07', type: 'summary', title: 'Какво научи', keyTakeaways: ['Hook + кратки параграфи + активен глас + CTA', 'Без corporate жаргон. Пиши като към приятел.', 'Прочит на глас = най-добрият тест.'], cta: 'Пренапиши "За нас" страницата си без нито една corporate дума.' }
  ]
};

export const S04_L03: LessonData = {
  id: 's01-m04-l04-03', title: 'Блог и статии', subtitle: 'Блогът е машина за клиенти', duration: '30 мин',
  slides: [
    { id: 's04l03-01', type: 'title', title: 'Блог и статии', subtitle: 'Урок 3 от 10 · 30 минути', body: 'Блогът не е дневник. Той е SEO машина, trust builder и lead generator в едно.' },
    { id: 's04l03-02', type: 'content', title: 'Структура на SEO статия', highlights: ['Заглавие с число или полза: "7 грешки при...", "Как да... за 30 дни".', 'Силно въведение: първите 100 думи = hook за цялата статия.', 'Table of Contents: за статии над 1000 думи.', 'H2/H3 подзаглавия с keywords — помагат и на читатели, и на Google.', 'Вътрешни линкове: води читателя към други твои статии.'] },
    { id: 's04l03-03', type: 'content', title: 'Детайли, които правят разлика', highlights: ['Author Byline: име + кратка bio + снимка (E-E-A-T).', 'Показвай дата на публикуване И актуализация.', 'CTA в края: не оставяй читателя да се чуди.', 'Related Articles: 3 линка в края на всяка статия.', 'Редовно публикуване: 1 статия седмично минимум.'] },
    { id: 's04l03-04', type: 'interactive', title: 'Упражнение: Избери заглавие', interactivePrompt: { scenario: 'Статия за това как локален бизнес да привлича клиенти чрез Google Business Profile.', task: 'Кое заглавие би кликнал и защо?\nА) "Оптимизация на Google Business Profile"\nБ) "Как да удвоиш клиентите си чрез Google Business Profile (2026)"\nВ) "Google Business Profile — ръководство"', hint: 'Кое обещава конкретна полза?', revealAnswer: 'Б) Печели — "удвоиш клиентите" е конкретна полза, "(2026)" = актуално. А) е сухо, В) е generic.' } },
    { id: 's04l03-05', type: 'checkpoint', title: 'Проверка', checkpoint: { question: 'Задължителен елемент за статия 1500+ думи?', options: ['Поне 10 снимки', 'Table of Contents', 'Видео', 'Цветен фон'], correctIndex: 1, explanation: 'Table of Contents помага на читателите да навигират и подобрява SEO чрез anchor links.' } },
    { id: 's04l03-06', type: 'summary', title: 'Какво научи', keyTakeaways: ['Заглавие с число/полза, силно въведение, ToC', 'Author byline + дати + вътрешни линкове', 'CTA в края — винаги'], cta: 'Напиши 1 блог статия 1500+ думи с ToC и вътрешни линкове.' }
  ]
};

export const S04_L04: LessonData = {
  id: 's01-m04-l04-04', title: 'Копирайтинг за конверсия', subtitle: 'Думите, които продават', duration: '30 мин',
  slides: [
    { id: 's04l04-01', type: 'title', title: 'Копирайтинг за конверсия', subtitle: 'Урок 4 от 10 · 30 минути', body: 'Ползи > Характеристики. Винаги. Научи формулите, които превръщат читатели в купувачи.' },
    { id: 's04l04-02', type: 'content', title: 'Headline Formula', highlights: ['[Краен резултат] + [Времева рамка] + [Без основното възражение].', 'Пример: "Нов сайт за 14 дни, без да пишем код."', 'Ползи вместо характеристики: "Спестяваш 10 часа/седмица" не "Автоматизирана система".', 'Social Proof: "98% от клиентите се връщат." — не "Ние сме най-добрите".', 'Risk Reversal: "30 дни гаранция. Без въпроси."'] },
    { id: 's04l04-03', type: 'framework', title: '6-те Conversion елемента', frameworkSteps: [
      { number: 1, title: 'Headline', description: 'Ясно обещание за резултат', icon: 'ri-heading', example: '"Удвои запитванията от сайта за 30 дни"' },
      { number: 2, title: 'Social Proof', description: 'Доказателство, че работи', icon: 'ri-star-line', example: '"200+ клиенти, 4.9/5 рейтинг"' },
      { number: 3, title: 'Objections', description: 'Адресирай възраженията', icon: 'ri-question-line', example: '"Твърде скъпо?" → цена на 2 кафета/месец.' },
      { number: 4, title: 'Risk Reversal', description: 'Гаранция', icon: 'ri-shield-check-line', example: '"30 дни парите обратно."' },
      { number: 5, title: 'Scarcity', description: 'Ограничено време/брой', icon: 'ri-timer-line', example: '"Само 5 места до края на месеца."' },
      { number: 6, title: 'CTA', description: 'Ясно следващо действие', icon: 'ri-cursor-line', example: '"Запази безплатна консултация"' }
    ]},
    { id: 's04l04-04', type: 'content', title: 'Price Anchoring и Before/After', highlights: ['Price Anchoring: Покажи скъпата опция първа → останалите изглеждат евтини.', '"Цената на 2 кафета на месец" вместо "19.99 лв/месец".', 'Before/After: визуално и текстово — най-силният conversion tool.', 'Scarcity без лъжа: "Остават 3 места" само ако е истина.'] },
    { id: 's04l04-05', type: 'interactive', title: 'Упражнение: Преобразувай в ползи', interactivePrompt: { scenario: 'Продаваш "10-мегапикселова камера с f/1.8 бленда и optical image stabilization".', task: 'Преведи тези характеристики в 3 ползи за клиента.', hint: 'Не казвай КАКВО прави камерата — кажи КАКВО получава клиентът.', revealAnswer: '1. "Снимки, които изглеждат професионално дори на тъмно" (f/1.8)\n2. "Нито една размазана снимка — дори от ръка" (OIS)\n3. "Разпечатай снимките си в размер на плакат" (10MP)' } },
    { id: 's04l04-06', type: 'checkpoint', title: 'Проверка', checkpoint: { question: 'Пример за добър копирайтинг?', options: ['"Ние сме лидер с иновативни решения"', '"Спести 10 часа седмично с нашата система"', '"Екип със сертификати от водещи институции"', '"Използваме cutting-edge технология"'], correctIndex: 1, explanation: 'Конкретна полза ("спести 10 часа") > corporate buzzwords.' } },
    { id: 's04l04-07', type: 'summary', title: 'Какво научи', keyTakeaways: ['Ползи > Характеристики — винаги', 'Headline Formula: Резултат + Време + Без Възражение', '6-те conversion елемента на всяка landing page'], cta: 'Пренапиши описанието на основната си услуга — от характеристики към ползи.' }
  ]
};

export const S04_L05: LessonData = {
  id: 's01-m04-l04-05', title: 'Имейл маркетинг', subtitle: '$42 за всеки $1 похарчен', duration: '25 мин',
  slides: [
    { id: 's04l05-01', type: 'title', title: 'Имейл маркетинг', subtitle: 'Урок 5 от 10 · 25 минути', body: 'Имейлът е най-подценяваният и най-печеливш канал. $42 ROI за всеки $1.' },
    { id: 's04l05-02', type: 'content', title: 'Subject Line и Preview Text', highlights: ['Subject: 30-50 знака. Любопитство или полза.', '"Това е причината сайтът ти да не продава" — отваряемост 40%+.', 'Preview Text: допълва subject-а, не го повтаря.', 'Един имейл = Един CTA. Не 5 различни бутона.', 'Персонализация: име + контекст. "Здравей, Иване" > "Уважаеми клиенти".'] },
    { id: 's04l05-03', type: 'framework', title: 'Welcome Sequence (3 имейла)', frameworkSteps: [
      { number: 1, title: 'Добре дошъл', description: 'Благодарност + какво да очакват', icon: 'ri-mail-line', example: '"Благодаря, че се записа. Ето какво получаваш..."' },
      { number: 2, title: 'Стойност', description: 'Най-добрият ти content', icon: 'ri-star-line', example: '"3-те неща, които всеки [ниша] трябва да знае."' },
      { number: 3, title: 'Следваща стъпка', description: 'Предложение', icon: 'ri-arrow-right-line', example: '"Готов ли си за следващото ниво? Ето как..."' }
    ]},
    { id: 's04l05-04', type: 'content', title: 'Сегментация и метрики', highlights: ['Сегментирай по интерес, поведение, покупки.', 'Тест на време за изпращане: вторник 10 ч. често печели.', 'Unsubscribe Link: винаги. Закон и добър тон.', 'Open Rate, CTR, Unsubscribes — следи всеки месец.', 'Re-engagement: след 60 дни бездействие — "Още ли си тук?"'] },
    { id: 's04l05-05', type: 'interactive', title: 'Упражнение: Напиши Subject Line', interactivePrompt: { scenario: 'Имейл до клиенти на фризьорски салон: 20% отстъпка за следващ час.', task: 'Напиши 3 различни Subject Line варианта. Кой би имал най-висок open rate?', hint: 'Любопитство, полза, urgency.', revealAnswer: '1. "Косата ти заслужава това (20% отстъпка)" — любопитство + полза.\n2. "Само 3 часа остават за 20% отстъпка" — urgency.\n3. "Иване, запазил ли си си час?" — персонализация.\nВариант 3 обикновено има най-висок open rate заради името.' } },
    { id: 's04l05-06', type: 'checkpoint', title: 'Проверка', checkpoint: { question: 'Колко CTA в един имейл?', options: ['Колкото е нужно', 'Точно 1', 'Поне 3', 'Няма значение'], correctIndex: 1, explanation: 'Един имейл = един CTA. Повече объркват читателя и разделят вниманието.' } },
    { id: 's04l05-07', type: 'summary', title: 'Какво научи', keyTakeaways: ['Subject 30-50 знака + Preview допълващ', 'Welcome Sequence: Благодарност → Стойност → Предложение', '1 CTA на имейл + персонализация'], cta: 'Напиши Welcome Sequence от 3 имейла за твоя бизнес.' }
  ]
};

export const S04_L06: LessonData = {
  id: 's01-m04-l04-06', title: 'Социални мрежи', subtitle: '80% стойност, 20% продажба', duration: '25 мин',
  slides: [
    { id: 's04l06-01', type: 'title', title: 'Социални мрежи', subtitle: 'Урок 6 от 10 · 25 минути', body: 'Хората не влизат в социалките да купуват. Те влизат да се забавляват и свързват. 80/20 правилото.' },
    { id: 's04l06-02', type: 'content', title: 'Правила за всяка платформа', highlights: ['Hook в първите 2 реда: ако не грабнеш — скролват.', 'Адаптирай за платформата: LinkedIn ≠ TikTok.', 'Субтитри на видеа: 85% гледат БЕЗ звук.', 'Оптимално време: тествай, но вторник-четвъртък 11-14 ч често работи.', 'Отговаряй на коментари: всеки коментар = възможност.'] },
    { id: 's04l06-03', type: 'content', title: 'Формати и стратегии', highlights: ['Carousels: най-висок engagement в Instagram/LinkedIn.', 'Stories & Reels: кратко, автентично, зад кулисите.', 'UGC: репоствай съдържание от клиенти — безплатно и автентично.', 'Batch Creation: 1 ден = цяла седмица съдържание.', 'Правило 80/20: 80% стойност, 20% продажба.'] },
    { id: 's04l06-04', type: 'interactive', title: 'Упражнение: Адаптирай за платформа', interactivePrompt: { scenario: 'Имаш блог статия "5 грешки при избор на SEO агенция". Искаш да я споделиш в LinkedIn и Instagram.', task: 'Как би изглеждал постът във всяка платформа?', hint: 'LinkedIn = професионално; Instagram = визуално и кратко.', revealAnswer: 'LinkedIn: Дълъг пост с 5-те грешки като bullets, завършващ с въпрос "Коя от тях си допускал?" + линк.\nInstagram: Carousel с 5 слайда — по 1 грешка на слайд с икона и 2 реда текст. CTA в последния слайд.' } },
    { id: 's04l06-05', type: 'checkpoint', title: 'Проверка', checkpoint: { question: 'Какво е правилото 80/20 в социалките?', options: ['80% продажби, 20% забавление', '80% стойност, 20% продажба', '80% снимки, 20% видео', '80% коментари, 20% постове'], correctIndex: 1, explanation: '80% от съдържанието ти дава стойност, 20% продава. Ако всичко е "КУПИ СЕГА" — хората те игнорират.' } },
    { id: 's04l06-06', type: 'summary', title: 'Какво научи', keyTakeaways: ['Hook в първите 2 реда', 'Адаптирай формата за всяка платформа', '80/20: стойност > продажба'], cta: 'Създай 7-дневен content план за 2 платформи с 80/20 баланс.' }
  ]
};

export const S04_L07: LessonData = {
  id: 's01-m04-l04-07', title: 'Видео съдържание', subtitle: 'Видеото продава най-добре', duration: '25 мин',
  slides: [
    { id: 's04l07-01', type: 'title', title: 'Видео съдържание', subtitle: 'Урок 7 от 10 · 25 минути', body: 'Видеото конвертира 4x по-добре от текст. Научи основите на ефективното видео съдържание.' },
    { id: 's04l07-02', type: 'content', title: 'Hook в първите 3 секунди', subtitle: 'Без hook = скрол', highlights: ['Първите 3 секунди: без "Здравейте, аз съм..." — директно в темата.', 'Вертикален формат 9:16 за Reels/TikTok/Shorts.', 'Субтитри: ВИНАГИ. 85% гледат без звук.', 'YouTube SEO: заглавие с keyword в първите 50 знака.', 'Thumbnail: custom с текст — най-важен за CTR.'] },
    { id: 's04l07-03', type: 'content', title: 'YouTube оптимизация', highlights: ['SEO описание: 200+ думи с keywords и линкове.', 'YouTube Tags: 5-10 релевантни тага.', 'Chapters: timestamps за дълги видеа.', 'End Screen + Cards: препратки към други твои видеа.', 'Playlists: организирай съдържанието тематично.'] },
    { id: 's04l07-04', type: 'content', title: 'Video Repurposing', highlights: ['Едно дълго видео → 3-5 Shorts/Reels.', 'Транскрипция → блог статия.', 'Аудио → podcast епизод.', 'Ключови моменти → quote cards за социалки.', 'Watch Time анализ: кои части задържат най-много?'] },
    { id: 's04l07-05', type: 'interactive', title: 'Упражнение: Планирай видео', interactivePrompt: { scenario: 'Искаш да направиш видео "5 съвета за по-добър сайт" (5 мин).', task: 'Как ще го repurpose-неш в 3 други формата?', hint: 'Едно видео → много платформи.', revealAnswer: '1. 5 × 30-сек вертикални Shorts/Reels — по 1 съвет всеки.\n2. Блог статия с 5-те съвета + транскрипция на видеото.\n3. 5 quote cards с най-силните изречения за Instagram/LinkedIn.' } },
    { id: 's04l07-06', type: 'checkpoint', title: 'Проверка', checkpoint: { question: 'Колко време имаш да грабнеш вниманието във видео?', options: ['10 секунди', 'Първите 3 секунди', '30 секунди', '1 минута'], correctIndex: 1, explanation: '3 секунди. Ако не грабнеш тогава — скролват. Без интро, директно в същината.' } },
    { id: 's04l07-07', type: 'summary', title: 'Какво научи', keyTakeaways: ['Hook 3 сек, вертикално, субтитри', 'YouTube SEO: заглавие, описание, thumbnail', 'Repurpose: 1 видео → Shorts + блог + quote cards'], cta: 'Направи 1 видео и го repurpose-ни в 3 формата.' }
  ]
};

export const S04_L08: LessonData = {
  id: 's01-m04-l04-08', title: 'Съдържание за доверие', subtitle: 'Хората купуват от тези, на които вярват', duration: '25 мин',
  slides: [
    { id: 's04l08-01', type: 'title', title: 'Съдържание за доверие', subtitle: 'Урок 8 от 10 · 25 минути', body: 'Доверието не се изгражда с една страница. То се трупа с всеки piece of content, който публикуваш.' },
    { id: 's04l08-02', type: 'content', title: '6 типа Trust Content', highlights: ['Case Studies: "Как [Клиент] постигна [Резултат] за [Време]."', 'Testimonials: видео, текст, снимки — всички формати.', 'Behind the Scenes: покажи процеса, хората, офиса.', 'Грешки и поуки: "Ето къде сбъркахме и какво научихме."', 'FAQ: отговори на истински въпроси. Не ги крий.', 'Comparison Content: "Ние vs Конкуренти" или "Преди vs След".'] },
    { id: 's04l08-03', type: 'content', title: 'Expert Content и цени', highlights: ['Expert Content: покажи, че разбираш материята в дълбочина.', 'Медийни споменавания: "Какво казаха за нас в...".', 'Процес на работа: прозрачност = доверие.', 'Публикувани цени: ако можеш — покажи ги. Скритите цени дразнят.', 'Искане на ревюта: направи го лесно. 1 линк, 2 клика.'] },
    { id: 's04l08-04', type: 'interactive', title: 'Упражнение: Създай Case Study', interactivePrompt: { scenario: 'Направил си SEO за ресторант "При Иван" — от 0 до 500 посетителя месечно за 6 месеца.', task: 'Структурирай Case Study в 4 части.', hint: 'Проблем → Решение → Процес → Резултат.', revealAnswer: '1. Проблем: Ресторантът нямаше онлайн присъствие, нула посетители от Google.\n2. Решение: SEO оптимизация + Google Business Profile + локални keywords.\n3. Процес: 6 месеца — месец 1-2 onsite, месец 3-4 съдържание, месец 5-6 линкове.\n4. Резултат: 500 посетителя/месец, 30+ резервации, 4.8★ рейтинг.' } },
    { id: 's04l08-05', type: 'checkpoint', title: 'Проверка', checkpoint: { question: 'Най-силен trust content формат?', options: ['Stock снимка на усмихнати хора', 'Видео testimonial от истински клиент', 'Списък с награди', 'Дълъг текст "За нас"'], correctIndex: 1, explanation: 'Видео testimonial от истински клиент = 10× по-силно от текст. Истински човек говори за истински резултат.' } },
    { id: 's04l08-06', type: 'summary', title: 'Какво научи', keyTakeaways: ['Case Studies + Testimonials + Behind Scenes', 'Публикувани цени и прозрачен процес', 'Expert Content показва дълбочина'], cta: 'Създай 1 Case Study за твой клиентски успех.' }
  ]
};

export const S04_L09: LessonData = {
  id: 's01-m04-l04-09', title: 'Repurposing и разпространение', subtitle: '1 идея → 5 платформи', duration: '25 мин',
  slides: [
    { id: 's04l09-01', type: 'title', title: 'Repurposing и разпространение', subtitle: 'Урок 9 от 10 · 25 минути', body: 'Не преоткривай колелото. Една добра идея може да стане съдържание за 5 различни платформи.' },
    { id: 's04l09-02', type: 'content', title: 'Repurposing Matrix', highlights: ['Блог статия → 3 LinkedIn поста + 2 Instagram carousel-а.', 'Видео → Shorts/Reels + транскрипция в блог.', 'Подкаст → блог статия + quote cards + audiogram.', 'Инфографика → социални мрежи + Pinterest.', 'Newsletter: компилация на най-доброто от седмицата.', 'Обновяване на старо съдържание: статия 2024 → 2026 с нови данни.'] },
    { id: 's04l09-03', type: 'content', title: 'Разпространение', highlights: ['Guest Posts: пиши за чужди блогове в нишата.', 'Syndication: публикувай в Medium, LinkedIn Articles.', 'Quote Cards: най-силното изречение → графика.', 'Документиран процес: създай repurposing workflow.', 'Batch: 1 ден създаване → 1 месец публикуване.'] },
    { id: 's04l09-04', type: 'interactive', title: 'Упражнение: Repurpose план', interactivePrompt: { scenario: 'Написал си страхотна статия "10 стъпки за по-добър сайт" (2000 думи).', task: 'В какви 5 формата можеш да я превърнеш?', hint: 'Различни платформи = различни формати.', revealAnswer: '1. LinkedIn carousel (10 слайда × 1 стъпка).\n2. YouTube видео "10 стъпки за по-добър сайт" (8 мин).\n3. Twitter/X thread (10 туита).\n4. Instagram Reels серия (10 × 30 сек).\n5. Email курс (10 имейла за 10 дни).' } },
    { id: 's04l09-05', type: 'checkpoint', title: 'Проверка', checkpoint: { question: 'Repurposing спестява около колко време?', options: ['10%', '30%', '70%', '95%'], correctIndex: 2, explanation: 'Създаваш 1 път, публикуваш в 5+ формата. Това спестява ~70% от времето спрямо създаване на unique content за всяка платформа.' } },
    { id: 's04l09-06', type: 'summary', title: 'Какво научи', keyTakeaways: ['1 идея → 5+ формата за различни платформи', 'Blog → Social → Email → Video → Podcast', 'Batch creation: 1 ден създаване, 1 месец публикуване'], cta: 'Вземи най-добрата си статия и я repurpose-ни в 3 нови формата.' }
  ]
};

export const S04_L10: LessonData = {
  id: 's01-m04-l04-10', title: 'Измерване и оптимизация', subtitle: 'Мери, за да подобриш', duration: '20 мин',
  slides: [
    { id: 's04l10-01', type: 'title', title: 'Измерване и оптимизация', subtitle: 'Урок 10 от 10 · 20 минути', body: 'Content без измерване = гадаене. Научи кои метрики имат значение и как да оптимизираш.' },
    { id: 's04l10-02', type: 'content', title: 'Content KPIs', highlights: ['Трафик: колко хора четат (GA4).', 'Конверсии: колко от тях действат.', 'Time on Page: четат ли или скролват и бягат?', 'Scroll Depth: докъде стигат?', 'Heatmaps: къде кликат? (Microsoft Clarity — безплатен).', 'Social Shares + Comments: engagement.'] },
    { id: 's04l10-03', type: 'content', title: 'Content Audit и A/B тест', highlights: ['Content Audit: всеки 6 месеца — кое работи, кое не.', 'A/B тест на Headlines: една променлива, минимум 100 views.', 'Сравнение с предходен период: MoM и YoY.', 'Feedback от аудиторията: питай ги какво искат.', 'Документиране: записвай успешните практики.'] },
    { id: 's04l10-04', type: 'interactive', title: 'Упражнение: Content Audit', interactivePrompt: { scenario: 'Имаш 20 блог статии. 3 носят 80% от трафика. Останалите 17 — почти никакъв.', task: 'Какво правиш с 17-те слаби статии?', hint: 'Не ги трий веднага. Първо оптимизирай.', revealAnswer: '1. Обнови ги с актуална информация за 2026.\n2. Пренапиши заглавията с по-добри keywords.\n3. Добави вътрешни линкове от силните към слабите статии.\n4. Ако след 3 месеца още не работят — пренасочи (301) към по-добра.' } },
    { id: 's04l10-05', type: 'checkpoint', title: 'Проверка', checkpoint: { question: 'Най-важният content KPI?', options: ['Брой думи', 'Брой снимки', 'Конверсии (действия от читатели)', 'Брой коментари'], correctIndex: 2, explanation: 'Конверсиите. Трафик без действие е суетна метрика. Мери колко читатели стават клиенти/абонати.' } },
    { id: 's04l10-06', type: 'summary', title: 'Модул 4 — Завършен', keyTakeaways: ['Трафик, конверсии, Time on Page, Scroll Depth', 'Content Audit всеки 6 месеца', 'A/B тест + документиране на успехите'], cta: 'Направи Content Audit на твоите статии. Обнови 3-те най-слаби.' }
  ]
};