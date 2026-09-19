import type { LessonData } from './interactive-lesson-data';

export const S03_L01: LessonData = {
  id: 's01-m03-l03-01', title: 'Keyword Research', subtitle: 'Какво търсят твоите клиенти', duration: '30 мин',
  slides: [
    { id: 's03l01-01', type: 'title', title: 'Keyword Research', subtitle: 'Урок 1 от 10 · 30 минути', body: 'Ако не знаеш какво търсят клиентите ти, целият SEO бюджет отива на вятъра. Keyword research-ът е фундаментът.' },
    { id: 's03l01-02', type: 'content', title: 'Seed vs Long-tail Keywords', subtitle: 'Едната носи обем, другата — продажби', highlights: ['Seed: "масаж", "SEO" — голям обем, огромна конкуренция.', 'Long-tail: "колко струва масаж Велико Търново" — малък обем, високо намерение.', 'Search Intent: Информационен vs Транзакционен vs Навигационен.', 'Сезонни: "данъчна консултация" (януари), "подарък 8 март" (февруари).', 'Въпросни: "как да...", "колко струва..." — идеални за FAQ и блог.'] },
    { id: 's03l01-03', type: 'framework', title: '5 стъпки Keyword Research', frameworkSteps: [
      { number: 1, title: 'Seed keyword', description: 'Основната дума', icon: 'ri-search-line', example: '"зъболекар Пловдив" — започни с очевидното.' },
      { number: 2, title: 'Long-tail разширения', description: 'Какво питат хората', icon: 'ri-chat-3-line', example: '"колко струва избелване зъби Пловдив".' },
      { number: 3, title: 'People Also Ask', description: 'Въпроси от Google', icon: 'ri-question-answer-line', example: 'Златна мина за content ideas.' },
      { number: 4, title: 'Групиране по теми', description: 'Keywords в клъстери', icon: 'ri-stack-line', example: '"зъболекар" + "избелване" + "цени" → страници.' },
      { number: 5, title: 'Актуализация', description: 'На 3-6 месеца', icon: 'ri-refresh-line', example: 'Нови услуги = нови keywords.' }
    ]},
    { id: 's03l01-04', type: 'content', title: 'Анализ на конкуренти', highlights: ['Виж за кои keywords се класират те, а ти не.', 'Нискоконкурентни: под 30 difficulty — по-лесни.', 'Групиране: свързани keywords на една страница.', 'Инструменти: Google Keyword Planner (безплатен), Ahrefs, SEMrush.'] },
    { id: 's03l01-05', type: 'interactive', title: 'Упражнение: Keyword gap', interactivePrompt: { scenario: 'Сайт за счетоводство София. Класираш се за "счетоводител София", но конкурентите — за повече.', task: 'Кои 3 keyword теми пропускаш?', hint: 'Какво питат клиентите на счетоводител?', revealAnswer: '1. "Счетоводство за онлайн магазин" — нишово, високо намерение.\n2. "Регистрация на фирма София" — търсят помощ.\n3. "Годишно приключване цена" — конкретен въпрос с пари.' } },
    { id: 's03l01-06', type: 'checkpoint', title: 'Проверка', checkpoint: { question: 'Какво е Search Intent?', options: ['Колко пъти се търси думата', 'Целта на търсещия — информация или покупка', 'Брой конкуренти за думата', 'Дължина на ключовата дума'], correctIndex: 1, explanation: 'Search Intent = ЗАЩО човек търси. Информационен → блог. Транзакционен → продуктова страница.' } },
    { id: 's03l01-07', type: 'summary', title: 'Какво научи', keyTakeaways: ['Long-tail = по-малък обем, по-високо намерение', 'Seed → Long-tail → PAA → Групиране → Актуализация', 'Анализирай конкурентите за gaps'], cta: 'Направи списък с 20 long-tail keywords чрез Google Suggest и PAA.' }
  ]
};

export const S03_L02: LessonData = {
  id: 's01-m03-l03-02', title: 'On-Page оптимизация', subtitle: 'Всяка страница като SEO машина', duration: '30 мин',
  slides: [
    { id: 's03l02-01', type: 'title', title: 'On-Page оптимизация', subtitle: 'Урок 2 от 10 · 30 минути', body: 'On-page SEO са нещата, които контролираш директно. Ако тях ги няма — backlinks няма да помогнат.' },
    { id: 's03l02-02', type: 'framework', title: '5-те On-Page стълба', frameworkSteps: [
      { number: 1, title: 'H1 заглавие', description: 'Един H1 с keyword', icon: 'ri-heading', example: '"Професионален масаж Велико Търново"' },
      { number: 2, title: 'Meta Title & Description', description: 'Витрината в Google', icon: 'ri-search-line', example: 'Title: 50-60 знака. Description: 120-160.' },
      { number: 3, title: 'Keyword в началото', description: 'Първите 100 думи', icon: 'ri-text-wrap', example: 'Main keyword естествено в първия параграф.' },
      { number: 4, title: 'SEO URL', description: 'Кратък, четим', icon: 'ri-link', example: '/masazh-veliko-tarnovo вместо /page?id=123.' },
      { number: 5, title: 'Вътрешни линкове', description: 'Свържи страниците', icon: 'ri-share-line', example: 'От "Услуги" линк към "Цени" и "Контакти".' }
    ]},
    { id: 's03l02-03', type: 'content', title: 'Meta Title и Description', highlights: ['Meta Title: 50-60 знака с keyword + бранд.', 'Meta Description: 120-160 знака. Убеждаващ, влияе на CTR.', 'LSI keywords: свързани думи. "Масаж" → "релакс", "терапия", "спа".', 'Alt текст: описание + keyword за Google Images.', 'Canonical Tag: за оригиналната версия при дублирано съдържание.'] },
    { id: 's03l02-04', type: 'content', title: 'Anchor Text и вътрешни линкове', highlights: ['Anchor описва накъде води — не "тук", а "виж цените за масаж".', 'Вътрешни линкове от стари статии към нови.', 'Content clusters: тематично свързани страници.', 'Минимум 3 вътрешни линка на важна страница.'] },
    { id: 's03l02-05', type: 'interactive', title: 'Упражнение: Оптимизирай On-Page', interactivePrompt: { scenario: 'Страница "Кетъринг Пловдив": H1 "Нашите услуги", Meta "Услуги | Кетъринг", URL /page-id-456, без keyword в текста.', task: 'Пренапиши H1, Meta, URL и първия параграф.', hint: 'Включи "кетъринг" и "Пловдив" навсякъде.', revealAnswer: 'H1: "Професионален кетъринг Пловдив | Събития и Фирми"\nMeta: "Кетъринг Пловдив — Обслужване за Всякакви Събития"\nURL: /ketaring-plovdiv\nПърви параграф: "Търсите професионален кетъринг в Пловдив? С над 10 г. опит..."' } },
    { id: 's03l02-06', type: 'checkpoint', title: 'Проверка', checkpoint: { question: 'Колко знака Meta Title?', options: ['Колкото се събере', '50-60', '100-120', 'Без значение'], correctIndex: 1, explanation: '50-60 знака. По-дългите се отрязват с "..." в резултатите.' } },
    { id: 's03l02-07', type: 'summary', title: 'Какво научи', keyTakeaways: ['H1, Meta, URL, първи параграф — всеки с keyword', 'Alt текст + LSI + вътрешни линкове', 'Anchor text описва дестинацията'], cta: 'Одитирай 3-те най-важни страници за On-Page SEO.' }
  ]
};

export const S03_L03: LessonData = {
  id: 's01-m03-l03-03', title: 'Локално SEO', subtitle: 'Царувай в твоя град', duration: '30 мин',
  slides: [
    { id: 's03l03-01', type: 'title', title: 'Локално SEO', subtitle: 'Урок 3 от 10 · 30 минути', body: 'Когато някой потърси "до мен" — да си ТИ. Локалното SEO е най-голямата възможност за малкия бизнес.' },
    { id: 's03l03-02', type: 'content', title: 'Google Business Profile: Безплатна златна мина', highlights: ['Попълни ВСИЧКО: часове, снимки (10+), услуги, Q&A, описание.', 'NAP Consistency: Име, Адрес, Телефон — ИДЕНТИЧНИ навсякъде.', 'Локална keyword: "[Услуга] [Град]" в заглавия и описание.', 'Google Reviews: Отговаряй на ВСЯКО в 24 часа.', 'GBP публикации: минимум 1 седмично.'] },
    { id: 's03l03-03', type: 'content', title: 'Локални страници и директории', highlights: ['Страница за всеки обслужван град/квартал.', '10-15 качествени български бизнес директории.', 'Google Maps: точна локация и pin.', 'Локални Backlinks: местни медии, блогове, партньори.', 'LocalBusiness Schema: JSON-LD с адрес, телефон, GPS.'] },
    { id: 's03l03-04', type: 'interactive', title: 'Упражнение: Локален одит', interactivePrompt: { scenario: 'Зъболекар Бургас. GBP: 2 снимки, 0 ревюта. NAP сайт: "Цар Симеон 15", GBP: "Цар Симеон № 15".', task: 'Кои 3 неща оправяш ПЪРВИ?', hint: 'NAP consistency e #1 приоритет.', revealAnswer: '1. NAP — направи ИДЕНТИЧЕН (махни "№").\n2. 10+ качествени снимки в GBP.\n3. Система за ревюта — моли всеки пациент.' } },
    { id: 's03l03-05', type: 'checkpoint', title: 'Проверка', checkpoint: { question: 'NAP Consistency означава?', options: ['Брой дремки на ден', 'Име, Адрес, Телефон — идентични', 'Нова Автоматична Платформа', 'Next Article Publishing'], correctIndex: 1, explanation: 'NAP = Name, Address, Phone. Разликите объркват Google и вредят на ranking-а.' } },
    { id: 's03l03-06', type: 'summary', title: 'Какво научи', keyTakeaways: ['GBP — безплатен и задължителен', 'NAP идентичен навсякъде', 'Локални keywords + Schema + ревюта'], cta: 'Провери GBP: 10+ снимки? NAP съвпада със сайта?' }
  ]
};

export const S03_L04: LessonData = {
  id: 's01-m03-l03-04', title: 'Schema.org', subtitle: 'Говори на езика на Google', duration: '25 мин',
  slides: [
    { id: 's03l04-01', type: 'title', title: 'Schema.org', subtitle: 'Урок 4 от 10 · 25 минути', body: 'Schema markup казва на Google КАКВО има на страницата. Сайтове със Schema получават rich snippets и по-висок CTR.' },
    { id: 's03l04-02', type: 'content', title: '6 основни Schema типа', highlights: ['Organization: homepage — лого, име, социални профили.', 'LocalBusiness: адрес, телефон, GPS, работно време.', 'FAQPage: въпроси и отговори → директно в Google.', 'Article/BlogPosting: дата, автор, изображение.', 'BreadcrumbList: йерархия в резултатите.', 'AggregateRating: звезди (изисква истински ревюта).'] },
    { id: 's03l04-03', type: 'content', title: 'JSON-LD и валидация', highlights: ['JSON-LD: препоръчан от Google. <script type="application/ld+json">.', 'Не смесвай Microdata и JSON-LD.', 'Google Rich Results Test — тествай ВСЯКА страница.', 'Грешен Schema > никакъв Schema.', 'Не спами — само релевантни типове за страницата.'] },
    { id: 's03l04-04', type: 'interactive', title: 'Упражнение: Избери Schema', interactivePrompt: { scenario: 'Страници: 1) Homepage строителна фирма, 2) 15 FAQ, 3) Блог "Как да изберем строител".', task: 'Кой Schema тип за коя страница?', hint: 'Всеки тип Schema е за конкретно съдържание.', revealAnswer: '1) Homepage → Organization + LocalBusiness.\n2) FAQ → FAQPage (всеки Q&A маркиран).\n3) Блог → Article (author, datePublished, image).' } },
    { id: 's03l04-05', type: 'checkpoint', title: 'Проверка', checkpoint: { question: 'Google препоръчва кой формат?', options: ['Microdata', 'RDFa', 'JSON-LD', 'XML'], correctIndex: 2, explanation: 'JSON-LD — отделен от HTML, лесен за четене и поддръжка.' } },
    { id: 's03l04-06', type: 'summary', title: 'Какво научи', keyTakeaways: ['Минимум Organization + LocalBusiness Schema', 'JSON-LD + Rich Results Test', 'Различен тип за различна страница'], cta: 'Провери сайта си с Google Rich Results Test за Schema markup.' }
  ]
};

export const S03_L05: LessonData = {
  id: 's01-m03-l03-05', title: 'GEO и AI оптимизация', subtitle: 'Откриваем в ChatGPT и AI търсачки', duration: '30 мин',
  slides: [
    { id: 's03l05-01', type: 'title', title: 'GEO и AI оптимизация', subtitle: 'Урок 5 от 10 · 30 минути', body: 'GEO = SEO за AI търсачките. Все повече хора питат ChatGPT, Perplexity и Gemini вместо Google.' },
    { id: 's03l05-02', type: 'content', title: 'Как AI "вижда" сайта ти', highlights: ['Entity Statement: ясно КОЙ си и КАКВО правиш.', 'llms.txt: резюме за AI модели в root-а на сайта.', 'ai.txt Manifest: инструкции за AI ботове.', 'sameAs Schema: свържи всички профили.', 'FAQ за AI: 10+ въпроса — AI-тата ОБИЧАТ FAQ.'] },
    { id: 's03l05-03', type: 'comparison', title: 'SEO vs GEO', leftSide: { label: 'Традиционно SEO', verdict: 'bad', content: '• За алгоритъм\n• Keywords\n• Backlinks\n• Технически\n• Резултат: линк' }, rightSide: { label: 'GEO (AI)', verdict: 'good', content: '• За разбиране\n• Entity дефиниции\n• Структурирани данни\n• llms.txt, Wikidata\n• Резултат: име в отговор' } },
    { id: 's03l05-04', type: 'content', title: 'Wikidata и Wikipedia', highlights: ['Wikidata запис за бизнеса: име, адрес, индустрия.', 'Wikidata запис за себе си: професия, постижения.', 'AI моделите тренират върху Wikidata — вярват му.', 'Проверка: Питай ChatGPT "Кой предлага [услуга] в [град]?"'] },
    { id: 's03l05-05', type: 'interactive', title: 'Упражнение: GEO готовност', interactivePrompt: { scenario: 'Искаш да излизаш в AI отговори за "кой прави SEO в Пловдив?".', task: 'Кои 3 GEO оптимизации правиш първо?', hint: 'Как AI разбира КОЙ си и КАКВО правиш?', revealAnswer: '1. /llms.txt с кратко описание.\n2. Оптимизирай "За нас" с Entity Statement.\n3. sameAs Schema с всички профили.\nБонус: Wikidata запис.' } },
    { id: 's03l05-06', type: 'checkpoint', title: 'Проверка', checkpoint: { question: 'Какво е llms.txt?', options: ['Файл за Google', 'Резюме на сайта за AI модели', 'Списък с линкове', 'Файл с пароли'], correctIndex: 1, explanation: 'llms.txt е machine-readable резюме. AI моделите го търсят, за да разберат сайта.' } },
    { id: 's03l05-07', type: 'summary', title: 'Какво научи', keyTakeaways: ['GEO = оптимизация за ChatGPT, Perplexity, Gemini', 'llms.txt + ai.txt + Wikidata = фундамент', 'FAQ + sameAs + Entity Statement'], cta: 'Създай /llms.txt. Питай ChatGPT за бизнеса си — познава ли те?' }
  ]
};

export const S03_L06: LessonData = {
  id: 's01-m03-l03-06', title: 'Съдържание за SEO', subtitle: 'Пиши така, че Google да те намери', duration: '25 мин',
  slides: [
    { id: 's03l06-01', type: 'title', title: 'Съдържание за SEO', subtitle: 'Урок 6 от 10 · 25 минути', body: 'Без редовно, качествено съдържание SEO не работи. Научи как да създаваш статии, които класират и конвертират.' },
    { id: 's03l06-02', type: 'content', title: 'Блог статии, които класират', highlights: ['1500+ думи: по-дългите се класират по-добре.', 'Topic Clusters: група статии около pillar page.', 'Table of Contents във всяка дълга статия.', 'Минимум 1 статия седмично.', 'Актуализация на стари статии — Google обича свежо.', 'Статии с цени: "Колко струва X през 2026".', 'Comparison: "X vs Y — кое да избереш".'] },
    { id: 's03l06-03', type: 'content', title: 'Author Byline и свързани статии', highlights: ['Author Byline: име + bio + снимка (Google E-E-A-T).', 'Related Articles: 3 линка в края на всяка статия.', 'Показвай дата на публикуване И актуализация.', 'Вътрешни линкове водят към други страници.'] },
    { id: 's03l06-04', type: 'interactive', title: 'Упражнение: Topic Cluster', interactivePrompt: { scenario: 'Сайт за йога инструктор. Pillar: "Йога за начинаещи — Пълно Ръководство".', task: 'Кои 5 свързани статии би написал?', hint: 'Пози, ползи, оборудване, грешки, стилове.', revealAnswer: 'Pillar +:\n1. "10-те Най-Лесни Йога Пози"\n2. "Оборудване за Йога (и какво НЕ ти трябва)"\n3. "5-те Най-Чести Грешки"\n4. "Колко Струват Курсове по Йога"\n5. "Хатха vs Виняса — Кое да Избереш"' } },
    { id: 's03l06-05', type: 'checkpoint', title: 'Проверка', checkpoint: { question: 'Защо Topic Clusters са важни?', options: ['Google харесва сини линкове', 'Показват authority по темата', 'Повече страници = повече реклами', 'Така пише в учебниците'], correctIndex: 1, explanation: 'Група свързани статии → Google те вижда като ЕКСПЕРТ. Подобрява ranking на целия клъстер.' } },
    { id: 's03l06-06', type: 'summary', title: 'Какво научи', keyTakeaways: ['1500+ думи статии с Table of Contents', 'Topic Clusters около pillar page', 'Author byline + дати + свързани статии'], cta: 'Планирай Topic Cluster: 1 pillar + 5 поддържащи статии.' }
  ]
};

export const S03_L07: LessonData = {
  id: 's01-m03-l03-07', title: 'Техническо SEO', subtitle: 'Невидимите основи', duration: '25 мин',
  slides: [
    { id: 's03l07-01', type: 'title', title: 'Техническо SEO', subtitle: 'Урок 7 от 10 · 25 минути', body: 'Като основите на къща — никой не ги вижда, но без тях всичко се срутва.' },
    { id: 's03l07-02', type: 'content', title: '5-те технически стълба', highlights: ['Sitemap.xml: submit в Search Console.', 'Robots.txt: кои страници НЕ индексираш.', 'HTTPS: Let\'s Encrypt безплатен.', 'Core Web Vitals: LCP, INP, CLS.', 'Mobile-Friendly: Google индексира mobile first.'] },
    { id: 's03l07-03', type: 'content', title: 'Search Console и 301', highlights: ['Search Console: Инсталирай ДНЕС.', 'Coverage Report: неиндексирани страници.', 'Performance Report: кои думи носят трафик.', '301 Redirects: постоянен, без redirect chains.', 'Счупени линкове: проверка веднъж месечно.'] },
    { id: 's03l07-04', type: 'interactive', title: 'Упражнение: Технически одит', interactivePrompt: { scenario: 'HTTP, няма sitemap, robots.txt блокира всичко (Disallow: /), няма Search Console.', task: 'Подреди по спешност. Кое ПЪРВО?', hint: 'Кое би причинило най-големи щети?', revealAnswer: '1. robots.txt — Disallow: / блокира ЦЕЛИЯ сайт.\n2. HTTPS — браузърите предупреждават.\n3. Sitemap.xml.\n4. Search Console + submit sitemap.' } },
    { id: 's03l07-05', type: 'checkpoint', title: 'Проверка', checkpoint: { question: '301 redirect прави:', options: ['Временно пренасочване', 'Постоянно — прехвърля SEO тежест', 'Блокира страница', 'Показва popup'], correctIndex: 1, explanation: '301 = постоянно. Google прехвърля SEO тежестта към новия URL. 302 = временно.' } },
    { id: 's03l07-06', type: 'summary', title: 'Какво научи', keyTakeaways: ['Sitemap + Robots + HTTPS + Core Web Vitals', 'Search Console — инсталирай и проверявай', '301 без вериги, счупени линкове — оправи'], cta: 'Инсталирай Search Console и submit-ни sitemap-а.' }
  ]
};

export const S03_L08: LessonData = {
  id: 's01-m03-l03-08', title: 'Backlinks и Authority', subtitle: 'Гласовете на доверие', duration: '25 мин',
  slides: [
    { id: 's03l08-01', type: 'title', title: 'Backlinks и Authority', subtitle: 'Урок 8 от 10 · 25 минути', body: 'Всеки линк от друг сайт е "глас" за Google. Но не всички гласове са равни.' },
    { id: 's03l08-02', type: 'content', title: 'Качество > Количество', highlights: ['Dofollow предава тежест. Nofollow — не, но пак полезен.', 'Guest Posts в авторитетни блогове.', 'Бизнес директории: качествени, локални.', 'Медийни споменавания: експертен коментар + линк.', 'Партньорски линкове с комплементарни бизнеси.', 'Linkable Assets: инфографика, проучване, калкулатор.'] },
    { id: 's03l08-03', type: 'content', title: 'Анализ и Disavow', highlights: ['Анализирай backlinks: Ahrefs, SEMrush.', 'Конкуренти: откъде получават линкове?', 'Disavow Tool: само при токсични линкове.', 'Мониторинг: нови линкове месечно.', 'Wikidata/Wikipedia линк = златен стандарт.'] },
    { id: 's03l08-04', type: 'interactive', title: 'Упражнение: Линк стратегия', interactivePrompt: { scenario: 'Строителен сайт. А) 500 линка от Fiverr за 20 лв, Б) Guest post за строителен блог, В) 50 случайни директории.', task: 'Кой подход? Подреди по ефективност.', hint: 'Google наказва spam.', revealAnswer: '1. Б) Guest post — 1 качествен линк.\n2. В) Директории — само качествени (10-15).\n3. А) НЕ! 500 линка от Fiverr = penalty.' } },
    { id: 's03l08-05', type: 'checkpoint', title: 'Проверка', checkpoint: { question: 'Най-голяма SEO стойност?', options: ['500 коментара в блогове', '1 dofollow от авторитетен сайт', '1000 Facebook споделяния', 'Линк от свой сайт'], correctIndex: 1, explanation: '1 качествен, релевантен dofollow линк > хиляди spam. Социалните споделяния не са директен ranking фактор.' } },
    { id: 's03l08-06', type: 'summary', title: 'Какво научи', keyTakeaways: ['Качество > Количество', 'Guest posts + Linkable Assets + партньорства', 'Мониторирай backlink профила'], cta: 'Провери колко сайта линкват към теб. Намери 3 възможности за guest posts.' }
  ]
};

export const S03_L09: LessonData = {
  id: 's01-m03-l03-09', title: 'Мониторинг и анализ', subtitle: 'Мери, за да подобриш', duration: '25 мин',
  slides: [
    { id: 's03l09-01', type: 'title', title: 'Мониторинг и анализ', subtitle: 'Урок 9 от 10 · 25 минути', body: 'SEO не е "направи и забрави". Постоянен мониторинг и корекции са ключът.' },
    { id: 's03l09-02', type: 'content', title: 'Ключови SEO метрики', highlights: ['Search Console: impressions, clicks, позиции, CTR.', 'Следене на позиции: кои keywords на страница 1?', 'Organic Traffic (GA4): расте ли? Сезонни спадове?', 'Топ страници: кои носят най-много трафик?', 'Bounce Rate: висок = проблем със скорост/съдържание.', 'Индексиране: всички важни страници индексирани?'] },
    { id: 's03l09-03', type: 'content', title: 'Конкурентен анализ и отчети', highlights: ['Топ 3 конкурента всеки месец.', 'CTR анализ: нисък CTR = оптимизирай Meta Description.', 'SEO отчет: месечен с action items.', 'A/B тест на Meta Titles: промени, сравни след 30 дни.'] },
    { id: 's03l09-04', type: 'interactive', title: 'Упражнение: Анализирай данни', interactivePrompt: { scenario: 'Трафик +15%, но conversion от 3% → 1.5%. Позиции +5 места. Bounce: 72%.', task: 'Добър или лош месец? Какво правиш?', hint: 'Повече трафик ≠ повече продажби.', revealAnswer: 'Новите keywords носят НЕЦЕЛЕВИ трафик.\n1. Провери кои keywords носят новия трафик.\n2. Оптимизирай landing page-овете.\n3. Анализирай bounce по страници.' } },
    { id: 's03l09-05', type: 'checkpoint', title: 'Проверка', checkpoint: { question: 'Висок Bounce Rate показва?', options: ['Страхотен сайт', 'Напускат без взаимодействие', 'Много продажби', 'Игнорирай'], correctIndex: 1, explanation: 'Bounce = напускане без взаимодействие. 70%+ = проблем с трафик, скорост или съдържание.' } },
    { id: 's03l09-06', type: 'summary', title: 'Какво научи', keyTakeaways: ['Трафик, позиции, CTR, Bounce — всеки месец', 'Конкурентен анализ: учи се от топ 3', 'Месечен отчет с action items'], cta: 'Направи месечен SEO отчет с 5 метрики и план.' }
  ]
};

export const S03_L10: LessonData = {
  id: 's01-m03-l03-10', title: 'SEO стратегия и планиране', subtitle: 'Дългосрочният план', duration: '25 мин',
  slides: [
    { id: 's03l10-01', type: 'title', title: 'SEO стратегия и планиране', subtitle: 'Урок 10 от 10 · 25 минути', body: 'SEO не е спринт — маратон. Нужна ти е дългосрочна стратегия, комбинираща SEO + GEO.' },
    { id: 's03l10-02', type: 'content', title: 'SMART SEO цели', highlights: ['Пример: "+30% органичен трафик за 6 месеца."', 'Editorial Calendar: 3 месеца напред, keywords за всяка статия.', 'Quick Wins: нискоконкурентни keywords, счупени линкове.', 'Баланс: 50% ново, 50% актуализация.', 'Диверсификация: SEO + GEO + социалки.'] },
    { id: 's03l10-03', type: 'content', title: 'E-E-A-T и Google Updates', highlights: ['E-E-A-T: Experience, Expertise, Authoritativeness, Trustworthiness.', 'Следи Google Updates — алгоритъмът се променя.', 'Документиране: записвай ВСЯКА промяна и резултат.', 'SEO + GEO: двата свята се сливат.'] },
    { id: 's03l10-04', type: 'interactive', title: 'Упражнение: 90-дневен план', interactivePrompt: { scenario: 'SEO план за нов зъболекарски сайт в Пловдив. Бюджет: 0 лв.', task: '3 действия за Месец 1, 2, 3?', hint: 'Фундамент → съдържание → линкове.', revealAnswer: 'M1 (Фундамент): Search Console, SSL, sitemap, On-Page 5 страници, GBP.\nM2 (Съдържание): 4 статии 1500+ думи, Topic Cluster план.\nM3 (Authority): Guest posts, директории, Schema, актуализация.' } },
    { id: 's03l10-05', type: 'checkpoint', title: 'Проверка', checkpoint: { question: 'E-E-A-T означава?', options: ['Eat, Evaluate, Act, Think', 'Experience, Expertise, Authoritativeness, Trustworthiness', 'Easy, Effective, Automatic, Timely', 'Измислена абревиатура'], correctIndex: 1, explanation: 'Google използва E-E-A-T за оценка на качеството. Критично за здраве и финанси (YMYL).' } },
    { id: 's03l10-06', type: 'summary', title: 'Модул 3 — Завършен', keyTakeaways: ['SMART цели + Editorial Calendar 3 месеца', '50% ново, 50% актуализация', 'E-E-A-T + SEO/GEO диверсификация'], cta: 'Напиши 3 SMART SEO цели за 6 месеца и Editorial Calendar за Месец 1.' }
  ]
};