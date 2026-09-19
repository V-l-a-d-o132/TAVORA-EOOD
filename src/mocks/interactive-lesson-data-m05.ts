import type { LessonData } from './interactive-lesson-data';

export const S05_L01: LessonData = {
  id: 's01-m05-l05-01', title: 'Профили и присъствие', subtitle: 'Подреди си къщата преди да каниш гости', duration: '25 мин',
  slides: [
    { id: 's05l01-01', type: 'title', title: 'Профили и присъствие', subtitle: 'Урок 1 от 10 · 25 минути', body: 'Преди да започнеш да публикуваш — профилите ти трябва да са безупречни. Първото впечатление е в bio-то.' },
    { id: 's05l01-02', type: 'framework', title: '5-те профилни must-haves', frameworkSteps: [
      { number: 1, title: 'Единно лого и Cover', description: 'Еднаква визия навсякъде', icon: 'ri-image-line', example: 'Logo + Cover photo в еднакъв стил за всички платформи.' },
      { number: 2, title: 'Еднакви Username-и', description: 'Където е възможно', icon: 'ri-at-line', example: '@yourbrand във всички платформи — лесно за запомняне.' },
      { number: 3, title: 'Оптимизирано Bio', description: 'Кой си, какво правиш, за кого', icon: 'ri-user-line', example: '"SEO за локален бизнес | 200+ проекта | Линк ↓"' },
      { number: 4, title: 'Link in Bio', description: 'Един линк към всичко важно', icon: 'ri-external-link-line', example: 'Linktree или /links страница на сайта.' },
      { number: 5, title: 'Актуализация', description: 'Минимум веднъж месечно', icon: 'ri-refresh-line', example: 'Нови постижения, ревюта, услуги → отрази в bio-то.' }
    ]},
    { id: 's05l01-03', type: 'content', title: 'Schema sameAs и свързаност', highlights: ['sameAs Schema: свържи всички профили в Google.', 'Верифицирана Facebook страница.', 'LinkedIn Company Profile.', 'Свързан Google Business Profile.', 'Всички профили сочат към сайта — и обратно.'] },
    { id: 's05l01-04', type: 'interactive', title: 'Упражнение: Одитирай профилите', interactivePrompt: { scenario: 'Instagram bio: "Дигитална агенция". Facebook cover: празно. LinkedIn: не е попълнен. Username-и: @agency_bg, @agency.vt, @agency.tarnovo.', task: 'Кои 3 неща оправяш първо?', hint: 'Консистентност > креативност.', revealAnswer: '1. Username-и → избери 1 (@agency.vt) и смени всички.\n2. LinkedIn Company Profile → попълни изцяло.\n3. Instagram bio → добави конкретна полза + линк.\nСлед това: Facebook cover и Schema sameAs.' } },
    { id: 's05l01-05', type: 'checkpoint', title: 'Проверка', checkpoint: { question: 'Защо Schema sameAs е важен?', options: ['За дизайн', 'Google разпознава връзката между профилите', 'За повече харесвания', 'Няма значение'], correctIndex: 1, explanation: 'sameAs казва на Google "тези профили са на същия бизнес". Подобрява Knowledge Graph и локално SEO.' } },
    { id: 's05l01-06', type: 'summary', title: 'Какво научи', keyTakeaways: ['Единна визия + еднакви username-и', 'Bio с конкретна полза + Link in Bio', 'sameAs Schema + актуализация месечно'], cta: 'Провери всичките си профили за консистентност. Оправи username-ите и bio-тата.' }
  ]
};

export const S05_L02: LessonData = {
  id: 's01-m05-l05-02', title: 'Facebook маркетинг', subtitle: '3 милиарда потребители — но с правилната стратегия', duration: '30 мин',
  slides: [
    { id: 's05l02-01', type: 'title', title: 'Facebook маркетинг', subtitle: 'Урок 2 от 10 · 30 минути', body: 'Facebook все още е най-голямата социална мрежа. Но organичният reach е паднал — трябва ти стратегия.' },
    { id: 's05l02-02', type: 'content', title: '6 Facebook стратегии', highlights: ['Редовно публикуване: 3-5 пъти седмично. Микс образователно, engagement, продаващо.', 'Facebook Group: създай комюнити около нишата. Това е ТВОЕТО пространство.', 'Facebook Events: за уебинари, промоции, отваряния.', 'Facebook Pixel: инсталирай на сайта за ретаргетинг.', 'Pinned Post: закачи най-добрия пост с CTA — първото, което виждат.', 'Facebook Shop: ако продаваш продукти — интегрирай.'] },
    { id: 's05l02-03', type: 'content', title: 'Engagement и ревюта', highlights: ['Бързи отговори: в рамките на 1 час. Алгоритъмът награждава.', 'Facebook Reviews: отговаряй на ВСЯКО. Благодари, адресирай.', 'Boost на успешни постове: не буствай всичко — само топ 10%.', 'Facebook Insights: следи reach, engagement, най-добро време.', 'Видеото печели: Facebook дава приоритет на native видео.'] },
    { id: 's05l02-04', type: 'interactive', title: 'Упражнение: Facebook Group стратегия', interactivePrompt: { scenario: 'Искаш да създадеш Facebook Group за собственици на малки бизнеси, които искат да подобрят онлайн присъствието си.', task: 'Какво име, описание и първи 3 поста би сложил?', hint: 'Името трябва да е конкретно. Постовете — стойностни.', revealAnswer: 'Име: "Онлайн Присъствие за Малък Бизнес — България"\nПост 1: "Коя е #1 грешка на сайта ви? Споделете..."\nПост 2: "Безплатен чеклист: 10 неща за SEO на локален бизнес"\nПост 3: "Запознайте се — кой сте и какво правите?" (engagement)' } },
    { id: 's05l02-05', type: 'checkpoint', title: 'Проверка', checkpoint: { question: 'Кое е ТВОЕТО пространство във Facebook?', options: ['Твоята стена', 'Facebook Group', 'Messenger', 'Facebook Stories'], correctIndex: 1, explanation: 'Group-ата е твоето "притежавано" комюнити. Алгоритъмът не може да ти го отнеме.' } },
    { id: 's05l02-06', type: 'summary', title: 'Какво научи', keyTakeaways: ['3-5 поста/седмично, микс формати', 'Group = твое комюнити', 'Pixel + Insights + Boost само на топ постове'], cta: 'Създай Facebook Group около твоята ниша.' }
  ]
};

export const S05_L03: LessonData = {
  id: 's01-m05-l05-03', title: 'Instagram маркетинг', subtitle: 'Визуалният ти магазин', duration: '30 мин',
  slides: [
    { id: 's05l03-01', type: 'title', title: 'Instagram маркетинг', subtitle: 'Урок 3 от 10 · 30 минути', body: 'Instagram е визуалната ти витрина. Reels + Stories + Feed = триъгълникът на растежа.' },
    { id: 's05l03-02', type: 'content', title: 'Reels (Приоритет #1)', highlights: ['Алгоритъмът дава най-голям reach на Reels.', '30-60 секунди, hook в първите 2 секунди.', 'Trending звуци + образователно съдържание.', 'Субтитри: 85%+ гледат без звук.', 'Хаштагове: 5-10 нишови + локални.'] },
    { id: 's05l03-03', type: 'content', title: 'Stories и Feed', highlights: ['Stories: 3-5 дневно. Зад кулиси, анкети, въпроси.', 'Highlights: организирай по теми (ревюта, услуги, процес).', 'Feed: консистентен визуален стил.', 'Локация на постовете: тагвай града си.', 'Колаборации: работи с互补 бизнеси.', 'Instagram Shopping: тагвай продукти директно.'] },
    { id: 's05l03-04', type: 'interactive', title: 'Упражнение: Reels Content Plan', interactivePrompt: { scenario: 'Създаваш content за зъболекарски кабинет.', task: 'Кои 5 Reels идеи би заснел?', hint: 'Образователно + зад кулисите + social proof.', revealAnswer: '1. "3 неща, които не знаеш за избелването"\n2. "Един ден в нашия кабинет" (behind scenes)\n3. "Before/After: избелване за 1 час"\n4. "Най-честите грешки при миене на зъби"\n5. Patient testimonial (с разрешение)' } },
    { id: 's05l03-05', type: 'checkpoint', title: 'Проверка', checkpoint: { question: 'Кой формат има най-голям reach в Instagram?', options: ['Снимки в Feed', 'Carousel', 'Reels', 'Stories'], correctIndex: 2, explanation: 'Reels получават приоритет в алгоритъма. Достигат до хора, които не те следват.' } },
    { id: 's05l03-06', type: 'summary', title: 'Какво научи', keyTakeaways: ['Reels = приоритет #1', 'Stories 3-5/дневно + Highlights', 'Консистентен визуален стил + локални хаштагове'], cta: 'Пусни 3 Reels тази седмица с trending звуци.' }
  ]
};

export const S05_L04: LessonData = {
  id: 's01-m05-l05-04', title: 'TikTok маркетинг', subtitle: 'Най-бързият органичен растеж', duration: '25 мин',
  slides: [
    { id: 's05l04-01', type: 'title', title: 'TikTok маркетинг', subtitle: 'Урок 4 от 10 · 25 минути', body: 'Алгоритъмът на TikTok работи ЗА теб — ако знаеш правилата. Органичен reach, който никоя друга платформа не предлага.' },
    { id: 's05l04-02', type: 'content', title: '6 TikTok правила', highlights: ['Hook в първите 1-2 секунди: без интро, директно в темата.', 'Trending Sounds: алгоритъмът приоритизира trending аудио.', 'Educational Content: "3 неща за..." работи във всяка ниша.', 'Субтитри: 85%+ гледат без звук.', 'TikTok SEO: оптимизирай описанието с keywords.', 'Видео отговори на коментари — engagement hack.'] },
    { id: 's05l03-03', type: 'content', title: 'Duets, Stitch и TikTok Business', highlights: ['Duets & Stitch: взаимодействай с чуждо съдържание.', 'TikTok Business: достъп до analytics и реклами.', 'TikTok Analytics: следи watch time, engagement, аудитория.', 'Редовност: 1 видео на ден минимум.', 'Не прекалявай с продажбите — 80/20 важи и тук.'] },
    { id: 's05l04-04', type: 'interactive', title: 'Упражнение: TikTok за "скучен" бизнес', interactivePrompt: { scenario: 'Счетоводна фирма. Изглежда "скучно" за TikTok. Как го правиш интересно?', task: 'Предложи 3 TikTok формата, които биха работили.', hint: 'Образование + хумор + изненада.', revealAnswer: '1. "Данъчни грешки, които струват хиляди" — образователно.\n2. "Колко данъци плащаш РЕАЛНО от заплата" — shocking stat.\n3. "Денят на един счетоводител" — behind scenes с хумор.\nВсеки бизнес има интересен ъгъл — намери го.' } },
    { id: 's05l04-05', type: 'checkpoint', title: 'Проверка', checkpoint: { question: 'Колко време за hook в TikTok?', options: ['5 секунди', '1-2 секунди', '10 секунди', '30 секунди'], correctIndex: 1, explanation: '1-2 секунди. По-бързо от всяка друга платформа. Без "Здравейте" — директно в темата.' } },
    { id: 's05l04-06', type: 'summary', title: 'Какво научи', keyTakeaways: ['Hook 1-2 сек + trending sounds + субтитри', 'Образователно съдържание работи във всяка ниша', 'TikTok SEO + 1 видео/ден'], cta: 'Пусни първото си TikTok видео днес.' }
  ]
};

export const S05_L05: LessonData = {
  id: 's01-m05-l05-05', title: 'LinkedIn маркетинг', subtitle: 'Където B2B сделките се случват', duration: '30 мин',
  slides: [
    { id: 's05l05-01', type: 'title', title: 'LinkedIn маркетинг', subtitle: 'Урок 5 от 10 · 30 минути', body: 'LinkedIn не е просто "онлайн CV". Това е машина за B2B контакти и сделки.' },
    { id: 's05l05-02', type: 'comparison', title: 'LinkedIn пасивно vs активно', leftSide: { label: 'Пасивно', verdict: 'bad', content: '• Профил без снимка\n• 50 конекции\n• Никога не публикува\n• Не коментира\n• Няма Articles' }, rightSide: { label: 'Активно', verdict: 'good', content: '• Headshot + banner\n• 500+ конекции\n• 2-3 поста/седмично\n• 10+ коментара/дневно\n• LinkedIn Articles\n• Newsletter\n→ 5-10 запитвания/месец' } },
    { id: 's05l05-03', type: 'content', title: 'LinkedIn стратегия', highlights: ['Публикувай от ЛИЧНИЯ профил — не от company page.', '2-3 поста седмично: истории, уроци, наблюдения.', 'Коментари: 10+ дневно върху чужди постове в нишата.', 'LinkedIn Articles: 1 месечно за authority.', 'LinkedIn Newsletter: събирай абонати директно.', 'LinkedIn Recommendations: искай и давай.', 'Social Selling Index (SSI): мери колко добре продаваш.'] },
    { id: 's05l05-04', type: 'interactive', title: 'Упражнение: LinkedIn пост', interactivePrompt: { scenario: 'Искаш да споделиш урок от работата с клиент: "Как увеличихме трафика на клиент с 200% за 3 месеца."', task: 'Как би структурирал този LinkedIn пост?', hint: 'Hook → Контекст → Действия → Резултат → Урок → CTA.', revealAnswer: 'Hook: "Миналата година клиент ми каза, че SEO не работи. 3 месеца по-късно трафикът му беше +200%."\nКонтекст: Каква беше ситуацията.\nДействия: 3-те конкретни стъпки.\nРезултат: Числа.\nУрок: Какво научих.\nCTA: "А ти пробвал ли си X?"' } },
    { id: 's05l05-05', type: 'checkpoint', title: 'Проверка', checkpoint: { question: 'Откъде да публикуваш в LinkedIn?', options: ['Company Page', 'Личен профил', 'И двете еднакво', 'LinkedIn Groups'], correctIndex: 1, explanation: 'Личният профил има 5-10× по-голям reach от Company Page. Хората следват ХОРА, не компании.' } },
    { id: 's05l05-06', type: 'summary', title: 'Какво научи', keyTakeaways: ['Личен профил > Company Page', '2-3 поста/седмично + 10 коментара/дневно', 'LinkedIn Newsletter + Articles за authority'], cta: 'Напиши първия си LinkedIn пост от личен профил днес.' }
  ]
};

export const S05_L06: LessonData = {
  id: 's01-m05-l05-06', title: 'YouTube маркетинг', subtitle: '24/7 продавач, който не спи', duration: '25 мин',
  slides: [
    { id: 's05l06-01', type: 'title', title: 'YouTube маркетинг', subtitle: 'Урок 6 от 10 · 25 минути', body: 'YouTube е втората най-голяма търсачка в света. Видеата работят ГОДИНИ след публикуване.' },
    { id: 's05l06-02', type: 'content', title: 'YouTube SEO', highlights: ['Заглавие: keyword в първите 50 знака.', 'Описание: 200+ думи с keywords и линкове.', 'Tags: 5-10 релевантни тага.', 'Thumbnail: custom с текст — фактор #1 за CTR.', 'Chapters: timestamps за дълги видеа.', 'Playlists: организирай съдържанието тематично.'] },
    { id: 's05l06-03', type: 'content', title: 'YouTube Shorts и Engagement', highlights: ['YouTube Shorts: вертикално под 60 сек. Алгоритъмът дава boost.', 'End Screen: препратки към други твои видеа.', 'Cards: интерактивни елементи по време на видео.', 'Отговаряй на коментари: изгражда community.', 'Thumbnail CTR: следи го — под 5% = проблем с thumbnail.'] },
    { id: 's05l06-04', type: 'interactive', title: 'Упражнение: YouTube Thumbnail', interactivePrompt: { scenario: 'Видео: "5 SEO грешки, които убиват трафика ти".', task: 'Как би изглеждал идеалният thumbnail? Опиши 3 елемента.', hint: 'Текст + изражение + контраст.', revealAnswer: '1. Едър, bold текст (3-4 думи): "SEO ГРЕШКИ ❌"\n2. Твоето лице с изненадано/шокирано изражение (emotional hook).\n3. Контрастен фон — ярък цвят, който СКОЧА от бялото на YouTube.' } },
    { id: 's05l06-05', type: 'checkpoint', title: 'Проверка', checkpoint: { question: '#1 фактор за YouTube CTR?', options: ['Заглавие', 'Описание', 'Thumbnail', 'Tags'], correctIndex: 2, explanation: 'Thumbnail-ът е първото, което окото вижда. Той определя дали ще кликнат — преди дори да прочетат заглавието.' } },
    { id: 's05l06-06', type: 'summary', title: 'Какво научи', keyTakeaways: ['YouTube SEO: заглавие, описание, thumbnail, chapters', 'Shorts за бърз растеж', 'Custom thumbnail с текст = задължителен'], cta: 'Направи custom thumbnail за следващото си видео.' }
  ]
};

export const S05_L07: LessonData = {
  id: 's01-m05-l05-07', title: 'Платени реклами', subtitle: 'Когато органичният растеж не стига', duration: '30 мин',
  slides: [
    { id: 's05l07-01', type: 'title', title: 'Платени реклами', subtitle: 'Урок 7 от 10 · 30 минути', body: 'Органичният + платеният растеж заедно дават максимален резултат. Но не пускай реклами без стратегия.' },
    { id: 's05l07-02', type: 'content', title: 'Meta (Facebook/Instagram) Ads', highlights: ['Conversion API + Pixel: инсталирай и двете.', 'Retargeting: показвай реклами на посетили сайта — най-висок ROAS.', 'Lookalike Audience: хора, подобни на най-добрите ти клиенти.', 'A/B тест на Creative: винаги 2+ версии.', 'Landing Page: трябва да отговаря на рекламата.'] },
    { id: 's05l07-03', type: 'content', title: 'Google Ads и ROAS', highlights: ['Google Ads: за хора, които ВЕЧЕ търсят.', 'Search vs Display vs Performance Max.', 'ROAS (Return on Ad Spend): колко приходи за 1 лв разход.', 'CTR оптимизация: тествай headlines и описания.', 'Ретаргетинг на изоставени действия.'] },
    { id: 's05l07-04', type: 'interactive', title: 'Упражнение: Разпредели бюджет', interactivePrompt: { scenario: 'Бюджет 500 лв/месец за дигитална агенция. Искаш нови клиенти.', task: 'Как разпределяш бюджета между Meta Ads, Google Ads и ретаргетинг?', hint: 'Първо тествай, после оптимизирай.', revealAnswer: 'Месец 1 (Тест): 200 лв Google Ads (search intent), 200 лв Meta (awareness), 100 лв ретаргетинг.\nМесец 2 (Оптимизация): Прехвърли бюджет към това, което носи най-нисък CPA.\nЗлатно правило: не харчи без conversion tracking.' } },
    { id: 's05l07-05', type: 'checkpoint', title: 'Проверка', checkpoint: { question: 'Най-висок ROAS обикновено има?', options: ['Facebook Page Likes кампания', 'Google Display Network', 'Ретаргетинг на посетили сайта', 'TikTok Brand Awareness'], correctIndex: 2, explanation: 'Ретаргетингът таргетира хора, които ВЕЧЕ проявяват интерес. Conversion rate-ът е 3-5× по-висок от cold audience.' } },
    { id: 's05l07-06', type: 'summary', title: 'Какво научи', keyTakeaways: ['Pixel + Conversion API за Meta', 'Ретаргетинг = най-висок ROAS', 'A/B тест на creative и landing page'], cta: 'Инсталирай Meta Pixel на сайта си и създай ретаргетинг аудитория.' }
  ]
};

export const S05_L08: LessonData = {
  id: 's01-m05-l05-08', title: 'Общност и Engagement', subtitle: 'Не просто публикувай — създавай разговори', duration: '25 мин',
  slides: [
    { id: 's05l08-01', type: 'title', title: 'Общност и Engagement', subtitle: 'Урок 8 от 10 · 25 минути', body: 'Engagement не е vanity metric. Това е сигнал за алгоритъма и начин за изграждане на лоялна аудитория.' },
    { id: 's05l08-02', type: 'content', title: '6 Engagement тактики', highlights: ['Отговор на коментари в 1 час.', 'Въпроси в постовете: "А вие...?" или "Кое от двете...?"', 'Stories Polls и въпроси — супер лесна интеракция.', 'Тагване на клиенти и партньори.', 'UGC кампания: накарай клиентите да създават съдържание.', 'Коментари при потенциални клиенти.'] },
    { id: 's05l08-03', type: 'content', title: 'Giveaway и Live', highlights: ['Giveaway: 1× месечно. Follow + тагни 2-ма + сподели в Stories.', 'Live сесии: 1× седмично. Q&A, зад кулисите, интервюта.', 'Репост на ревюта и UGC.', 'Brand Mentions: следи кой те споменава и благодари.', 'Изграждай community, не audience.'] },
    { id: 's05l08-04', type: 'interactive', title: 'Упражнение: Engagement план', interactivePrompt: { scenario: 'Искаш да увеличиш engagement-а на Facebook страницата си (200 последователи, средно 2 лайка/пост).', task: '3 конкретни тактики за следващите 7 дни.', hint: 'Питай, въвличай, награждавай.', revealAnswer: '1. 3 поста с въпроси: "Коя е #1 ви болка с..."\n2. 1 Giveaway: "Сподели този пост + тагни 2-ма приятели"\n3. 1 Live Q&A сесия (15 мин) — обяви я 2 дни по-рано.' } },
    { id: 's05l08-05', type: 'checkpoint', title: 'Проверка', checkpoint: { question: 'Engagement сигнализира на алгоритъма:', options: ['Нищо', 'Това съдържание е ценно → покажи го на повече хора', 'Да спре разпространението', 'Да блокира поста'], correctIndex: 1, explanation: 'Висок engagement = сигнал за алгоритъма, че съдържанието е качествено. Резултат: по-голям органичен reach.' } },
    { id: 's05l08-06', type: 'summary', title: 'Какво научи', keyTakeaways: ['Отговаряй в 1 час, задавай въпроси', 'UGC + Giveaway 1× месечно', 'Live 1× седмично'], cta: 'Пусни пост с въпрос днес и отговори на ВСЕКИ коментар.' }
  ]
};

export const S05_L09: LessonData = {
  id: 's01-m05-l05-09', title: 'Инфлуенсъри и партньорства', subtitle: 'Чужда аудитория без рекламен бюджет', duration: '25 мин',
  slides: [
    { id: 's05l09-01', type: 'title', title: 'Инфлуенсъри и партньорства', subtitle: 'Урок 9 от 10 · 25 минути', body: 'Защо да градиш аудитория от нулата, когато можеш да "наемеш" чужда?' },
    { id: 's05l09-02', type: 'content', title: 'Micro-инфлуенсъри > Големи', highlights: ['1K-10K последователи, но висок engagement (5-10%).', 'По-евтини и по-автентични от macro-инфлуенсърите.', 'Бартер партньорства: размени услуги вместо пари.', 'Affiliate програма: комисионна за всеки доведен клиент.', 'Co-created Content: създайте нещо заедно.'] },
    { id: 's05l09-03', type: 'content', title: 'Podcasts и ROI', highlights: ['Podcast участия: 1 епизод = трафик с години.', 'Спонсорства: на локални събития, подкасти, блогове.', 'Договори: винаги писмено. KPI, срокове, отговорности.', 'ROI анализ: колко клиенти дойдоха от партньорството?', 'KPIs за партньорства: engagement rate, conversion rate, CPA.'] },
    { id: 's05l09-04', type: 'interactive', title: 'Упражнение: Намери партньор', interactivePrompt: { scenario: 'Имаш онлайн магазин за био козметика. Искаш да работиш с инфлуенсъри.', task: 'Какъв тип инфлуенсър би избрал и какво би му предложил?', hint: 'Не гледай броя последователи — гледай engagement и релевантност.', revealAnswer: 'Micro-инфлуенсър с 3-8K последователи, който говори за organic/зелен начин на живот. Предложение: безплатни продукти + 15% комисионна от всеки продаден чрез неин код продукт. Риск за теб = 0 (плащаш само при продажба).' } },
    { id: 's05l09-05', type: 'checkpoint', title: 'Проверка', checkpoint: { question: 'Micro-инфлуенсърите са по-добри защото:', options: ['По-евтини са', 'По-висок engagement rate и по-автентични', 'По-лесни за намиране', 'Имат повече последователи'], correctIndex: 1, explanation: 'По-висок engagement и по-тясна връзка с аудиторията. Техните препоръки се възприемат като от приятел, не като реклама.' } },
    { id: 's05l09-06', type: 'summary', title: 'Какво научи', keyTakeaways: ['Micro > Macro: 1K-10K, висок engagement', 'Бартер + Affiliate = нисък риск', 'Договори + KPI + ROI'], cta: 'Намери 3 micro-инфлуенсъра в нишата си и им пиши.' }
  ]
};

export const S05_L10: LessonData = {
  id: 's01-m05-l05-10', title: 'Анализ и оптимизация', subtitle: 'Какво не мериш — не можеш да подобриш', duration: '20 мин',
  slides: [
    { id: 's05l10-01', type: 'title', title: 'Анализ и оптимизация', subtitle: 'Урок 10 от 10 · 20 минути', body: 'Social media без анализ е като шофиране със затворени очи. Мери и оптимизирай.' },
    { id: 's05l10-02', type: 'content', title: 'Седмичен и месечен анализ', highlights: ['Седмичен: top 3 поста, reach, engagement.', 'Reach и Engagement анализ: колко хора ВИДЯХА, колко реагираха.', 'Топ постове: какво ги прави успешни? Пулс повече такива.', 'Follower Growth: steady ли е? От коя платформа?', 'Social Traffic: колко идват от социалките към сайта?', 'Social Conversions: колко от тях стават клиенти?'] },
    { id: 's05l10-03', type: 'content', title: 'Competitor Analysis и нови формати', highlights: ['Competitor Analysis: Топ 3 конкурента всеки месец.', 'Social Media Report: месечен с action items.', 'Тест на нови формати: 10% от съдържанието = експерименти.', 'Документиране: записвай успешните практики.', 'След 3 месеца ще имаш собствен playbook.'] },
    { id: 's05l10-04', type: 'interactive', title: 'Упражнение: Месечен Report', interactivePrompt: { scenario: 'Instagram: +120 последователи, top пост 2400 reach с образователно съдържание. TikTok: +340 последователи, top пост 8500 views с trending звук. Facebook: +15 последователи, почти никакъв engagement.', task: 'Къде инвестираш повече време следващия месец?', hint: 'Следвай данните, не интуицията.', revealAnswer: 'TikTok = приоритет (най-бърз растеж). Instagram = второ (стабилен). Facebook = намали до 1 пост/седмично или автоматизирай. Винаги следвай данните.' } },
    { id: 's05l10-05', type: 'checkpoint', title: 'Проверка', checkpoint: { question: 'Суетна метрика (vanity metric) е:', options: ['Conversion rate', 'Cost per lead', 'Брой последователи', 'Engagement rate'], correctIndex: 2, explanation: 'Броят последователи е vanity metric. 10K последователи, които не купуват < 100, които купуват.' } },
    { id: 's05l10-06', type: 'summary', title: 'Модул 5 — Завършен', keyTakeaways: ['Седмичен преглед: top 3 поста, reach, engagement', 'Следвай данните — инвестирай в платформите с ROI', 'Competitor analysis + месечен report'], cta: 'Направи social media report за последните 30 дни.' }
  ]
};