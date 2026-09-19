import type { LessonData } from './interactive-lesson-data';

export const S02_L01: LessonData = {
  id: 's01-m02-l02-01', title: 'Структура и Layout', subtitle: 'Костите на професионалния сайт', duration: '25 мин',
  slides: [
    { id: 's02l01-01', type: 'title', title: 'Структура и Layout', subtitle: 'Урок 1 от 10 · 25 минути', body: 'Ако структурата е грешна, нищо друго няма значение. Научи архитектурата на сайт, който води окото и бута към действие.' },
    { id: 's02l01-02', type: 'content', title: 'Без ясна структура посетителят се губи', subtitle: 'Объркан посетител не купува. Никога.', body: 'Сайтът ти има 3 секунди да каже КЪДЕ е, КАКВО предлагаш и КАКВО да направи.', highlights: ['F-Pattern: Окото чете от горе-ляво към дясно, после надолу. Важното — горе вляво.', 'Z-Pattern: За landing pages. Окото върви Z-образно. CTA в долния десен ъгъл.', 'Above the Fold: Най-важното се вижда БЕЗ скролване — заглавие, CTA, hero image.', 'Whitespace: Празното пространство не е загубено — то насочва вниманието.'] },
    { id: 's02l01-03', type: 'framework', title: '5-те задължителни зони на всеки сайт', frameworkSteps: [
      { number: 1, title: 'Hero секция', description: 'Какво правиш + защо да ти вярват', icon: 'ri-layout-top-line', example: 'Заглавие с ясно обещание + подзаглавие + CTA + подкрепящо изображение.' },
      { number: 2, title: 'Проблем / Решение', description: 'Покажи че разбираш болката', icon: 'ri-lightbulb-line', example: '"Губиш клиенти заради бавен сайт? Ние го оправяме за 2 седмици."' },
      { number: 3, title: 'Социално доказателство', description: 'Ревюта, числа, лога', icon: 'ri-star-line', example: '3 истински ревюта + "200+ доволни клиенти".' },
      { number: 4, title: 'Услуги / Продукти', description: 'Какво предлагаш и как работи', icon: 'ri-stack-line', example: '3-5 карти с икони, кратки описания, цени.' },
      { number: 5, title: 'Финален CTA', description: 'Какво да направят СЕГА', icon: 'ri-rocket-line', example: 'Бутон + телефон + форма — всичко на едно място.' }
    ]},
    { id: 's02l01-04', type: 'content', title: 'Sticky Header и Footer', subtitle: 'Два елемента, които рамкират цялото изживяване', highlights: ['Sticky Header: Навигацията остава видима при скролване.', 'Header без фон в hero-то → бял фон при скрол — чисто и професионално.', 'Footer: Не просто copyright. Линкове, контакти, правна информация.', 'Footer без черен фон. По-светъл нюанс — изглежда модерно и приветливо.'] },
    { id: 's02l01-05', type: 'interactive', title: 'Упражнение: Одитирай структурата', interactivePrompt: { scenario: 'Сайт за "Дигитален маркетинг за ресторанти". На началната: голямо лого, 8 услуги в списък, 3 разноцветни CTA бутона, дълъг текст "За нас" без параграфи.', task: 'Кои 3 структурни грешки виждаш и как ги поправяш?', hint: 'Помисли за йерархия, фокус и първо впечатление.', revealAnswer: '1. 3 различни CTA → остави 1 основен ("Безплатна консултация").\n2. Няма Hero с ясно обещание → добави заглавие + подзаглавие + CTA.\n3. "За нас" блок → разбий на 3 кратки параграфа с подзаглавия.' } },
    { id: 's02l01-06', type: 'checkpoint', title: 'Проверка', checkpoint: { question: 'Къде трябва да е основният CTA на landing page?', options: ['В долния десен ъгъл на footer-а', 'Above the Fold — веднага след заглавието', 'След всички описания на услугите', 'Няма значение'], correctIndex: 1, explanation: 'CTA трябва да се вижда БЕЗ скролване. Над 60% от посетителите не скролват. Ако CTA не е във viewport-а при зареждане — губиш потенциални клиенти.' } },
    { id: 's02l01-07', type: 'summary', title: 'Какво научи', keyTakeaways: ['Hero → Проблем/Решение → Доказателство → Услуги → CTA', 'F-Pattern и Z-Pattern водят окото естествено', 'Whitespace не е празно — то е инструмент за фокус'], cta: 'Отвори сайта си. Провери дали имаш ясна Hero секция с един CTA над сгъвката.' }
  ]
};

export const S02_L02: LessonData = {
  id: 's01-m02-l02-02', title: 'Типография', subtitle: 'Невидимият убиец на конверсии', duration: '25 мин',
  slides: [
    { id: 's02l02-01', type: 'title', title: 'Типография', subtitle: 'Урок 2 от 10 · 25 минути', body: 'Текст, който не се чете = сайт, който не продава. Научи правилата на професионалната типография.' },
    { id: 's02l02-02', type: 'content', title: 'Шрифтовете говорят преди думите', subtitle: 'Изборът на шрифт създава първото впечатление', highlights: ['Максимум 2 шрифта: един за заглавия + един за текст. Повече = визуален хаос.', 'Google Fonts: безплатни, професионални, отлична кирилица.', 'За заглавия: Inter, Montserrat, Playfair Display (елегантен).', 'За текст: Inter, Roboto, Source Sans Pro — четат се лесно на екран.', 'Избери 1 характерен шрифт за заглавия + 1 неутрален за текст.'] },
    { id: 's02l02-03', type: 'comparison', title: 'Добра vs Лоша типография', leftSide: { label: 'Грешки', verdict: 'bad', content: '• 3+ шрифта\n• Текст под 14px\n• Редове над 75 знака\n• CAPS LOCK за абзаци\n• Слаб контраст\n• Няма йерархия' }, rightSide: { label: 'Правила', verdict: 'good', content: '• Макс 2 шрифта\n• Минимум 16px body\n• 50-75 знака/ред\n• Един H1\n• Висок контраст\n• H1 > H2 > H3 > body' } },
    { id: 's02l02-04', type: 'content', title: 'Line Height и ширина', subtitle: 'Двата параметъра за четливост', highlights: ['Line Height: 1.5-1.6 за основен текст. По-малко = сгъстено.', 'Максимална ширина: 65-75 знака на ред. Окото се губи при по-широко.', 'Заглавия: line-height 1.2-1.3 — изглеждат по-стегнато.', 'Тест на телефон: Ако присвиваш очи — шрифтът е твърде малък.'] },
    { id: 's02l02-05', type: 'interactive', title: 'Упражнение: Поправи типографията', interactivePrompt: { scenario: 'Сайт за финансови консултации: 4 шрифта, body 12px светлосив, заглавия в CAPS LOCK, редове 120+ знака.', task: 'Кои 3 неща променяш първо?', hint: 'Започни с най-големия проблем за четливост.', revealAnswer: '1. Намали шрифтовете до 2 (заглавия + текст).\n2. Увеличи body до 16px с по-тъмен цвят.\n3. Ограничи ширината до 70 знака/ред + махни CAPS LOCK.' } },
    { id: 's02l02-06', type: 'checkpoint', title: 'Проверка', checkpoint: { question: 'Колко H1 тага трябва да има на една страница?', options: ['Колкото са секциите', 'Точно 1', 'Поне 3 за SEO', 'Няма значение'], correctIndex: 1, explanation: 'Една страница = един H1. Това е основното заглавие за Google и посетителя. H2 и H3 са за подсекции.' } },
    { id: 's02l02-07', type: 'summary', title: 'Какво научи', keyTakeaways: ['Макс 2 шрифта, 16px body, 50-75 знака/ред, line-height 1.5', 'Един H1, ясна йерархия, висок контраст', 'Тест на телефон — ако присвиваш, оправи'], cta: 'Провери колко шрифта ползваш и размера на основния текст на сайта си.' }
  ]
};

export const S02_L03: LessonData = {
  id: 's01-m02-l02-03', title: 'Цветова система', subtitle: 'По-малко е повече', duration: '25 мин',
  slides: [
    { id: 's02l03-01', type: 'title', title: 'Цветова система', subtitle: 'Урок 3 от 10 · 25 минути', body: 'Цветовете създават настроение, насочват вниманието и изграждат brand recognition. Научи професионалната палитра.' },
    { id: 's02l03-02', type: 'content', title: '4 цвята са достатъчни', subtitle: 'Повече цветове ≠ по-добър дизайн', highlights: ['Primary: Основен цвят за бутони, акценти, линкове. 1 цвят, не син/лилав.', 'Background: Бяло, много светло сиво, кремаво — за фонове и карти.', 'Foreground/Text: Тъмно сиво/почти черно. Не чисто #000 — прекалено рязко.', 'Accent: Втори акцентен цвят за специални елементи. Контрастира с primary.'] },
    { id: 's02l03-03', type: 'framework', title: '5 правила за цветова система', frameworkSteps: [
      { number: 1, title: 'Primary цвят', description: '1 смел цвят за CTA', icon: 'ri-paint-fill', example: 'Топъл оранжев, наситено зелено, теракота.' },
      { number: 2, title: 'Neutral/Background', description: 'Светли неутрални', icon: 'ri-contrast-2-line', example: '#FAFAF5, #F5F5F0 — топли вместо чисто бяло.' },
      { number: 3, title: 'Контраст за текст', description: 'Тъмен текст / светъл фон', icon: 'ri-font-size', example: '#1A1A1A за body — чете се без напрежение.' },
      { number: 4, title: 'Акцентен цвят', description: 'За важни не-primary елементи', icon: 'ri-contrast-drop-line', example: 'Икони, баджове, hover — хармоничен с primary.' },
      { number: 5, title: 'Hover цветове', description: '10-15% по-тъмни от base', icon: 'ri-cursor-line', example: 'Primary бутон при hover → 10% по-тъмен.' }
    ]},
    { id: 's02l03-04', type: 'content', title: 'Достъпност и тестване', subtitle: 'Цветове за ВСИЧКИ', highlights: ['Контраст 4.5:1 за текст (WCAG AA).', 'Тест за далтонизъм: 8% от мъжете имат цветна слепота.', 'Не разчитай САМО на цвят — добави икона или текст.', 'Тествай на различни устройства — цветовете варират.', 'WebAIM Contrast Checker — безплатен и лесен.'] },
    { id: 's02l03-05', type: 'interactive', title: 'Упражнение: Избери палитра', interactivePrompt: { scenario: 'Бутиков хотел в планината. Топла, уютна, професионална атмосфера.', task: 'Кои 4 цвята (primary, bg, text, accent) избираш?', hint: 'Планина = природа, уют = топли тонове, бутиков = елегантност.', revealAnswer: 'Primary: Тъмно зелено (#1B4332) — природа, стабилност.\nBackground: Топло кремаво (#FAF7F2) — уют.\nText: Тъмно кафяво-сиво (#2C2416) — меко.\nAccent: Медно/теракота (#C17A4E) — топлина, лукс.' } },
    { id: 's02l03-06', type: 'checkpoint', title: 'Проверка', checkpoint: { question: 'Кое е НАЙ-важното за цветовете?', options: ['Колкото повече, толкова по-добре', 'Контраст между текст и фон', 'Винаги синьо за линкове', 'Черен текст на бял фон'], correctIndex: 1, explanation: 'Без контраст текстът е нечетим. Нечетим текст = нулева конверсия. Синьото за линкове е остаряло правило.' } },
    { id: 's02l03-07', type: 'summary', title: 'Какво научи', keyTakeaways: ['4 цвята: primary, background, text, accent', 'Контраст 4.5:1 минимум', 'Тествай за далтонизъм и различни устройства'], cta: 'Провери контраста на сайта си с WebAIM Contrast Checker.' }
  ]
};

export const S02_L04: LessonData = {
  id: 's01-m02-l02-04', title: 'Мобилна оптимизация', subtitle: 'Mobile First — 60%+ трафик е телефон', duration: '25 мин',
  slides: [
    { id: 's02l04-01', type: 'title', title: 'Мобилна оптимизация', subtitle: 'Урок 4 от 10 · 25 минути', body: 'Ако сайтът не работи на телефон — не работи. Google индексира mobile версията като основна.' },
    { id: 's02l04-02', type: 'content', title: 'Mobile First не е "и mobile също"', subtitle: 'Започни дизайна от малкия екран', highlights: ['Touch Targets: Бутони минимум 44×44px. Пръстът е 3× по-дебел от курсора.', 'Hamburger Menu: Навигацията зад икона на малки екрани.', 'Responsive текст: Минимум 16px. По-голям е по-добър.', 'Click-to-Call: <a href="tel:..."> — за всеки бизнес сайт.', 'Формуляри: По-малко полета, по-големи input-и.'] },
    { id: 's02l04-03', type: 'content', title: 'Responsive изображения и тестване', highlights: ['Responsive Images: Различни размери за различни екрани.', 'Mobile CTA: Видим без скролване, достатъчно голям за палец.', 'Google Mobile-Friendly Test: Безплатен. Пусни сайта СЕГА.', 'Тест на реални устройства: Не само емулатор.', 'Без horizontal scroll: Провери на 320px ширина.'] },
    { id: 's02l04-04', type: 'interactive', title: 'Упражнение: Mobile одит', interactivePrompt: { scenario: 'На телефон: бутони миниатюрни, текст дребен, hero image 5 сек зареждане, форма 8 полета.', task: 'Кои 3 mobile проблема са най-спешни?', hint: 'Приоритизирай по влияние върху UX и конверсия.', revealAnswer: '1. Touch targets → минимум 44×44px.\n2. Форма → намали до 3 полета. 8 полета = 90% abandonment.\n3. Hero image → компресирай WebP под 100KB + lazy loading.' } },
    { id: 's02l04-05', type: 'checkpoint', title: 'Проверка', checkpoint: { question: 'Минимален размер на touch target?', options: ['24×24px', '44×44px', '32×32px', 'Няма значение'], correctIndex: 1, explanation: '44×44px e стандартът на Apple и Google. По-малки targets = грешни кликове.' } },
    { id: 's02l04-06', type: 'summary', title: 'Какво научи', keyTakeaways: ['Mobile First: започни от малкия екран', '44×44px targets, 16px+ текст, click-to-call', 'Тест на реални устройства + Google Mobile-Friendly Test'], cta: 'Пусни сайта през Mobile-Friendly Test и оправи проблемите.' }
  ]
};

export const S02_L05: LessonData = {
  id: 's01-m02-l02-05', title: 'Изображения и визуали', subtitle: 'По-малко stock, повече истина', duration: '25 мин',
  slides: [
    { id: 's02l05-01', type: 'title', title: 'Изображения и визуали', subtitle: 'Урок 5 от 10 · 25 минути', body: 'Хората разпознават фалшивите stock снимки за 0.2 сек. Използвай изображения, които изграждат доверие.' },
    { id: 's02l05-02', type: 'content', title: 'Истински снимки > Stock Photos', subtitle: 'Всеки път. Без изключение.', highlights: ['Използвай истински снимки на бизнеса, екипа, продуктите.', 'Hero изображение: голямо, впечатляващо, свързано с услугата.', 'Единен визуален стил: същата цветова температура, същото настроение.', 'WebP формат: 30-40% по-малък от JPEG при също качество.', 'Alt текст: описва какво се вижда + ключова дума за SEO.'] },
    { id: 's02l05-03', type: 'content', title: 'Техническа оптимизация', highlights: ['Компресия под 150KB: TinyPNG или Squoosh.', 'Aspect Ratio: width/height атрибути → без Layout Shift (CLS).', 'Lazy Loading: loading="lazy" за изображения под сгъвката.', 'Единна иконна система: Remix или FontAwesome.', 'Видео: YouTube/Vimeo embed, не self-hosted.'] },
    { id: 's02l05-04', type: 'interactive', title: 'Упражнение: Избери изображението', interactivePrompt: { scenario: 'Сайт за зъболекар: А) Stock снимка "зъболекар", Б) Истинска снимка на екипа, В) Абстрактна графика на зъб.', task: 'Кое за Hero? Подреди по ефективност.', hint: 'Кое вдъхва най-много доверие за 3 сек?', revealAnswer: '1. Б) Истинска снимка — мигновено доверие.\n2. В) Абстрактна графика — по-добре от stock.\n3. А) Stock — фалшиво, подкопава доверието.' } },
    { id: 's02l05-05', type: 'checkpoint', title: 'Проверка', checkpoint: { question: 'Най-добър формат за уеб изображения?', options: ['PNG', 'WebP', 'BMP', 'GIF'], correctIndex: 1, explanation: 'WebP: 30-40% по-малък от JPEG, поддържа прозрачност и анимация. Всички браузъри го поддържат.' } },
    { id: 's02l05-06', type: 'summary', title: 'Какво научи', keyTakeaways: ['Истински снимки > stock — всеки път', 'WebP + компресия под 150KB + lazy loading', 'Единен стил и иконна система'], cta: 'Провери изображенията над 150KB и ги компресирай до WebP.' }
  ]
};

export const S02_L06: LessonData = {
  id: 's01-m02-l02-06', title: 'CTA и конверсии', subtitle: 'Бутонът, който прави парите', duration: '30 мин',
  slides: [
    { id: 's02l06-01', type: 'title', title: 'CTA и конверсии', subtitle: 'Урок 6 от 10 · 30 минути', body: 'CTA е най-важният елемент. Ако посетителят не знае какво да направи — няма да направи нищо.' },
    { id: 's02l06-02', type: 'content', title: '6 CTA правила', highlights: ['Контрастен цвят: CTA СКОЧА от страницата.', 'Текст с полза: "Получи безплатна консултация", не "Изпрати".', 'Един основен CTA: всички бутони водят към ЕДНО действие.', 'Повтарящ се: Hero → среда → край.', 'Hover/Active: Бутонът РЕАГИРА визуално.', 'Sticky CTA Bar на mobile.'] },
    { id: 's02l06-03', type: 'comparison', title: 'Слаб vs Силен CTA', leftSide: { label: 'Слаби CTA', verdict: 'bad', content: '"Изпрати"\n"Научи повече"\n"Кликни тук"\n"Свържете се с нас"' }, rightSide: { label: 'Силни CTA', verdict: 'good', content: '"Получи безплатен одит"\n"Запази място (остават 3)"\n"Изтегли чеклиста"\n"Вземи оферта за 24 часа"' } },
    { id: 's02l06-04', type: 'content', title: 'Social Proof до CTA', highlights: ['Ревю/статистика ДО бутона: "500+ доволни клиенти".', 'Thank You страница: персонализирана, не generic.', 'A/B тест: текст, цвят, размер, позиция.', 'Кратки форми: максимум 3-4 полета.'] },
    { id: 's02l06-05', type: 'interactive', title: 'Упражнение: Пренапиши CTA', interactivePrompt: { scenario: 'Сайт за фитнес треньор. CTA: "Свържи се с нас".', task: 'Пренапиши в 3 варианта с конкретна полза.', hint: 'Какво получава клиентът? Какво губи ако не натисне?', revealAnswer: '1. "Запази безплатна консултация (15 мин)"\n2. "Трансформирай тялото си за 90 дни"\n3. "Виж резултатите на хора като теб"\nВариант 1 обикновено конвертира най-добре.' } },
    { id: 's02l06-06', type: 'checkpoint', title: 'Проверка', checkpoint: { question: 'Най-ефективен CTA за локален бизнес?', options: ['"Научи повече"', '"Изпрати"', '"Запази безплатна консултация днес"', '"Кликни тук"'], correctIndex: 2, explanation: 'Конкретна полза (безплатна) + urgency (днес) + ясно действие (запази).' } },
    { id: 's02l06-07', type: 'summary', title: 'Какво научи', keyTakeaways: ['CTA с полза: "Получи X" вместо "Изпрати"', 'Контрастен + повтарящ се + social proof', 'A/B тестване на текст, цвят, позиция'], cta: 'Замени всеки "Изпрати" и "Научи повече" с конкретна полза.' }
  ]
};

export const S02_L07: LessonData = {
  id: 's01-m02-l02-07', title: 'Скорост и производителност', subtitle: '1 сек забавяне = 7% по-малко конверсии', duration: '25 мин',
  slides: [
    { id: 's02l07-01', type: 'title', title: 'Скорост и производителност', subtitle: 'Урок 7 от 10 · 25 минути', body: '53% напускат сайт над 3 сек на mobile. Скоростта не е "технически детайл" — тя е conversion фактор.' },
    { id: 's02l07-02', type: 'content', title: 'Core Web Vitals', highlights: ['LCP: Най-голямото изображение. Цел: под 2.5 сек.', 'INP: Реакция при клик. Цел: под 200ms.', 'CLS: Колко "скача" страницата. Цел: под 0.1.', 'Google PageSpeed Insights: безплатен анализ.', 'Тест на 3G: повечето хора в БГ са на mobile мрежа.'] },
    { id: 's02l07-03', type: 'framework', title: '5 бързи победи', frameworkSteps: [
      { number: 1, title: 'Компресирай изображения', description: 'WebP под 150KB', icon: 'ri-image-line', example: 'TinyPNG или Squoosh.' },
      { number: 2, title: 'Lazy Loading', description: 'Зареждай само видимите', icon: 'ri-eye-off-line', example: 'loading="lazy" под сгъвката.' },
      { number: 3, title: 'По-малко секции', description: 'Обедини малки секции', icon: 'ri-scissors-cut-line', example: '15 секции → 8 по-обемни.' },
      { number: 4, title: 'Леки анимации', description: 'CSS transitions', icon: 'ri-movie-line', example: 'transform/opacity са GPU-accelerated.' },
      { number: 5, title: 'Embed видео', description: 'YouTube, не self-hosted', icon: 'ri-youtube-line', example: 'Видео на твой сървър = bandwidth.' }
    ]},
    { id: 's02l07-04', type: 'content', title: 'CLS: Невидимият убиец', highlights: ['width/height на ВСИЧКИ изображения.', 'Preload шрифтове — късното зареждане размества текста.', 'Резервирай място за динамично съдържание.', 'CLS над 0.25 = Google penalty.'] },
    { id: 's02l07-05', type: 'interactive', title: 'Упражнение: Speed одит', interactivePrompt: { scenario: 'Сайт: 4.8 сек на mobile, hero 2.3MB PNG, 5 шрифта, 12 JS файла, форма "скача".', task: 'Кои 3 неща оправяш първо?', hint: 'Започни от най-голямото "тегло".', revealAnswer: '1. Hero → WebP под 100KB (2.3MB → 0.1MB = 23×).\n2. Шрифтове → 2, preload.\n3. CLS → width/height + preload шрифтове.' } },
    { id: 's02l07-06', type: 'checkpoint', title: 'Проверка', checkpoint: { question: 'Кое НЕ е Core Web Vital?', options: ['LCP', 'CLS', 'DOM', 'INP'], correctIndex: 2, explanation: 'DOM е програмният интерфейс. Vitals са LCP, INP и CLS.' } },
    { id: 's02l07-07', type: 'summary', title: 'Какво научи', keyTakeaways: ['LCP под 2.5s, INP под 200ms, CLS под 0.1', 'Изображения = 60%+ от теглото', 'PageSpeed Insights след ВСЯКА промяна'], cta: 'Тествай сайта на pagespeed.web.dev. Оправи най-големия проблем.' }
  ]
};

export const S02_L08: LessonData = {
  id: 's01-m02-l02-08', title: 'UX и навигация', subtitle: 'Направи сайта интуитивен', duration: '25 мин',
  slides: [
    { id: 's02l08-01', type: 'title', title: 'UX и навигация', subtitle: 'Урок 8 от 10 · 25 минути', body: 'Добрата навигация е невидима. Лошата кара хората да напускат.' },
    { id: 's02l08-02', type: 'content', title: 'Правилото за 3 клика', highlights: ['Всичко важно — достъпно за 3 клика от homepage.', 'Breadcrumbs: "Начало > Услуги > SEO Оптимизация".', '404 страница: линкове + търсачка, не просто "Not Found".', 'Лого → homepage. Винаги.', 'Активен линк: текущата страница е визуално различна.', 'Scroll-to-Top бутон за дълги страници.'] },
    { id: 's02l08-03', type: 'comparison', title: 'Лоша vs Добра навигация', leftSide: { label: 'Лоша', verdict: 'bad', content: '• 8+ елемента в меню\n• Няма breadcrumbs\n• Лого не води към homepage\n• Няма активен индикатор\n• 404 = бял екран' }, rightSide: { label: 'Добра', verdict: 'good', content: '• 4-6 елемента в меню\n• Breadcrumbs навсякъде\n• Лого → homepage\n• Активна = подчертана\n• 404 с линкове + търсачка' } },
    { id: 's02l08-04', type: 'content', title: 'User Testing', highlights: ['Дай сайта на 3-ма нови души. Помоли ги да намерят нещо.', 'Гледай къде кликат, къде се колебаят.', 'Провери ВСИЧКИ линкове за счупени.', 'Линковете трябва да СЕ ВИЖДАТ като линкове.', 'Мобилна навигация: hamburger менюто работи ли с пръст?'] },
    { id: 's02l08-05', type: 'interactive', title: 'Упражнение: Навигационен одит', interactivePrompt: { scenario: '25 страници. Меню 12 елемента, няма breadcrumbs, няма търсачка, 404 = "Page not found".', task: 'Кои 3 проблема са най-критични?', hint: 'Мисли като посетител за първи път.', revealAnswer: '1. 12 елемента → намали до 6 с dropdown.\n2. 404 → линкове + търсачка.\n3. Breadcrumbs на всички подстраници.' } },
    { id: 's02l08-06', type: 'checkpoint', title: 'Проверка', checkpoint: { question: 'Къде води логото?', options: ['Към "За нас"', 'Към homepage', 'Към контакти', 'Никъде'], correctIndex: 1, explanation: 'Лого → homepage е универсален UX стандарт.' } },
    { id: 's02l08-07', type: 'summary', title: 'Какво научи', keyTakeaways: ['3 клика до всичко важно', 'Breadcrumbs + 404 с линкове + активен индикатор', 'User testing с 3-ма нови потребители'], cta: 'Провери колко клика до контактите от homepage. Над 2 — оправи.' }
  ]
};

export const S02_L09: LessonData = {
  id: 's01-m02-l02-09', title: 'Доверие и социално доказателство', subtitle: 'Без доверие няма продажба', duration: '25 мин',
  slides: [
    { id: 's02l09-01', type: 'title', title: 'Доверие и социално доказателство', subtitle: 'Урок 9 от 10 · 25 минути', body: 'Хората не купуват от непознати. Изгради доверие чрез 6 типа trust елементи.' },
    { id: 's02l09-02', type: 'content', title: '6-те елемента на доверието', highlights: ['Ревюта: истински имена + снимки + конкретни резултати.', 'Лога на клиенти/медии: "Работили сме с...".', 'Bio на собственика: хората купуват от ХОРА.', 'Броячи: "200+ проекта", "98% satisfied".', 'SSL/HTTPS: без него браузърите предупреждават.', 'Гаранция: "30 дни връщане на парите".'] },
    { id: 's02l09-03', type: 'content', title: 'Правни страници и контакти', highlights: ['Политика за поверителност.', 'Условия за ползване.', 'Cookie Policy.', 'GDPR съответствие.', 'Контакти: пълен адрес, телефон, имейл, работно време.'] },
    { id: 's02l09-04', type: 'content', title: 'Case Studies и гаранция', highlights: ['Case Study: "Как [Клиент] постигна [Резултат] за [Време]."', 'Дата на последна актуализация — показва активност.', 'Гаранция: конкретна, видима, до CTA.', 'Публикувани цени — скритите цени дразнят.'] },
    { id: 's02l09-05', type: 'interactive', title: 'Упражнение: Trust одит', interactivePrompt: { scenario: 'Строителна фирма: 2 скрити ревюта в footer, няма снимки, няма SSL, контакти само имейл.', task: 'Кои 3 trust елемента добавяш ПЪРВИ?', hint: 'Кое би накарало НАЙ-МНОГО хора да се доверят?', revealAnswer: '1. SSL — ДНЕС. Без него браузърите предупреждават.\n2. Снимки на екипа + bio — хората искат да знаят с КОГО работят.\n3. Правни страници — минимум Политика за поверителност.' } },
    { id: 's02l09-06', type: 'checkpoint', title: 'Проверка', checkpoint: { question: '#1 trust сигнал за локален бизнес?', options: ['Fortune 500 лога', 'Google ревюта с истински имена', 'Stock снимка на екип', 'Брояч на посетители'], correctIndex: 1, explanation: 'Истински Google ревюта са #1. Отговаряй на ВСЯКО ревю.' } },
    { id: 's02l09-07', type: 'summary', title: 'Какво научи', keyTakeaways: ['6 елемента: ревюта, лога, bio, броячи, SSL, гаранция', 'Правни страници са ЗАДЪЛЖИТЕЛНИ', 'Case studies с конкретни резултати'], cta: 'Провери за SSL, правни страници и 3 истински ревюта на сайта.' }
  ]
};

export const S02_L10: LessonData = {
  id: 's01-m02-l02-10', title: 'Финална проверка', subtitle: 'Пълният дизайн чеклист', duration: '20 мин',
  slides: [
    { id: 's02l10-01', type: 'title', title: 'Финална проверка', subtitle: 'Урок 10 от 10 · 20 минути', body: 'Преди launch — минаваш този чеклист. Всеки непроверен елемент = потенциална загуба на клиент.' },
    { id: 's02l10-02', type: 'content', title: '10 финални проверки', highlights: ['1. ВСИЧКИ линкове — нито един счупен.', '2. Правопис — всяка страница, всяко заглавие.', '3. Форми — тестово запитване.', '4. 3+ устройства — телефон, таблет, лаптоп.', '5. 3+ браузъра — Chrome, Safari, Firefox.', '6. Google Search Console — инсталирана.', '7. Google Analytics — проследява.', '8. Favicon — иконата в таба.', '9. OG Image — за споделяне в социалки.', '10. Backup — резервно копие.'] },
    { id: 's02l10-03', type: 'content', title: 'Cross-browser проверки', highlights: ['Chrome: 65% пазар. Основен тест.', 'Safari: 20% (mobile). Провери на iPhone.', 'Firefox: ~3% (tech-savvy).', 'Edge: ~5% (корпоративна среда).', 'Разлики в шрифтове, форми, input стилове.'] },
    { id: 's02l10-04', type: 'interactive', title: 'Упражнение: Финален одит', interactivePrompt: { scenario: '30 мин преди launch.', task: 'Кои 5 неща проверяваш ПЪРВИ?', hint: 'Кое би причинило НАЙ-ГОЛЯМ проблем?', revealAnswer: '1. Форми — ако не работят, губиш клиенти.\n2. Линкове — счупен = загубен клиент + лошо SEO.\n3. Mobile тест — 60%+ трафик.\n4. Favicon + OG Image — професионализъм.\n5. SSL/HTTPS — браузърите предупреждават.' } },
    { id: 's02l10-05', type: 'checkpoint', title: 'Проверка', checkpoint: { question: 'Кое НЕ проверяваш преди launch?', options: ['Формите', 'Линковете', 'Instagram последователи', 'Mobile изглед'], correctIndex: 2, explanation: 'Последователите нямат връзка с техническата готовност на сайта.' } },
    { id: 's02l10-06', type: 'summary', title: 'Модул 2 — Завършен', keyTakeaways: ['10 теми: структура, типография, цветове, mobile, изображения, CTA, скорост, UX, доверие, проверка', 'Всеки елемент помага или пречи на конверсията', 'Финалният чеклист преди всеки launch'], cta: 'Мини през 10-те точки на чеклиста за твоя сайт.' }
  ]
};