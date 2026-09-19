import type { LessonData } from './interactive-lesson-data';

export const S06_L01: LessonData = {
  id: 's01-m06-l06-01', title: 'Landing Page оптимизация', subtitle: 'Страницата, която продава', duration: '30 мин',
  slides: [
    { id: 's06l01-01', type: 'title', title: 'Landing Page оптимизация', subtitle: 'Урок 1 от 10 · 30 минути', body: 'Landing page-ът е твоят най-добър продавач. Работи 24/7, не взима заплата и не се оплаква.' },
    { id: 's06l01-02', type: 'framework', title: '5-те елемента на конвертиращ LP', frameworkSteps: [
      { number: 1, title: 'Заглавие с ясна полза', description: 'Какво + за колко време', icon: 'ri-heading', example: '"Удвои запитванията за 30 дни" vs "Ние предлагаме SEO".' },
      { number: 2, title: 'CTA Above the Fold', description: 'Видим без скролване', icon: 'ri-cursor-line', example: 'Бутон в hero секцията — 60% не скролват.' },
      { number: 3, title: 'Social Proof', description: 'Ревюта, лога, числа', icon: 'ri-star-line', example: '"500+ клиенти" близо до CTA.' },
      { number: 4, title: 'Risk Reversal', description: 'Гаранция', icon: 'ri-shield-check-line', example: '"30 дни гаранция за връщане."' },
      { number: 5, title: 'Една цел', description: 'Всяка страница = 1 оферта', icon: 'ri-focus-2-line', example: 'Не смесвай 3 оферти на една страница.' }
    ]},
    { id: 's06l01-03', type: 'content', title: 'Съответствие с рекламата', highlights: ['Message Match: рекламата и landing page-ът говорят ЕДНО.', 'Ако рекламата казва "20% отстъпка", LP-то трябва да започва с това.', 'Минимална навигация: премахни менюто на LP.', 'Скорост: под 3 сек зареждане.', 'A/B тест: винаги тествай version B.'] },
    { id: 's06l01-04', type: 'interactive', title: 'Упражнение: Одитирай LP', interactivePrompt: { scenario: 'LP за "SEO одит": заглавие "Нашите услуги", CTA след 3 скрола, няма ревюта, меню с 12 линка.', task: 'Кои 3 неща оправяш първо?', hint: 'Приоритет: какво вижда посетителят първо?', revealAnswer: '1. Заглавие → "Получи безплатен SEO одит за 24 часа".\n2. CTA → над сгъвката.\n3. Меню → скрий го (LP няма нужда от пълна навигация).\nСлед това: добави 3 ревюта близо до CTA.' } },
    { id: 's06l01-05', type: 'checkpoint', title: 'Проверка', checkpoint: { question: 'Колко оферти на една landing page?', options: ['Колкото услуги предлагаш', 'Точно 1', 'Поне 3', 'Няма значение'], correctIndex: 1, explanation: '1 LP = 1 оферта. Повече объркват и разделят вниманието = по-ниска конверсия.' } },
    { id: 's06l01-06', type: 'summary', title: 'Какво научи', keyTakeaways: ['Заглавие + CTA над сгъвката', 'Social Proof + Risk Reversal', '1 страница = 1 оферта + A/B тест'], cta: 'Одитирай основната си LP за 5-те елемента.' }
  ]
};

export const S06_L02: LessonData = {
  id: 's01-m06-l06-02', title: 'Форми и Lead Capture', subtitle: 'Всяко поле губи 10-15% конверсия', duration: '25 мин',
  slides: [
    { id: 's06l02-01', type: 'title', title: 'Форми и Lead Capture', subtitle: 'Урок 2 от 10 · 25 минути', body: 'Формулярът е последната бариера преди конверсията. Направи я колкото се може по-ниска.' },
    { id: 's06l02-02', type: 'content', title: 'Правила за форми', highlights: ['3-5 полета максимум. Всяко допълнително = -10-15% конверсия.', 'CTA с конкретна полза: "Получи безплатен одит" > "Изпрати".', 'Placeholder текстове: помагат, но не заместват label-ите.', 'Ясни Error съобщения: "Моля, въведи валиден имейл", не "Error 4042".', 'Mobile оптимизация: големи полета, клавиатурата не скрива submit.'] },
    { id: 's06l02-03', type: 'content', title: 'Lead Magnet и Thank You', highlights: ['Lead Magnet: дай нещо ценно срещу имейла — чеклист, темплейт, отчет.', 'Thank You страница: персонализирана, със следваща стъпка.', 'Автоматичен имейл веднага след попълване.', 'Exit Intent Popup: последен шанс за conversion.', 'Form Completion Rate: следи колко започват и колко завършват формата.'] },
    { id: 's06l02-04', type: 'interactive', title: 'Упражнение: Оптимизирай форма', interactivePrompt: { scenario: 'Форма за запитване: Име, Фамилия, Имейл, Телефон, Компания, Длъжност, Бюджет, Съобщение — 8 полета.', task: 'Намали до 3 полета. Кои оставяш?', hint: 'Какво НАИСТИНА ти трябва за първи контакт?', revealAnswer: '1. Име — за персонализация.\n2. Имейл — за follow-up.\n3. Телефон — за бърз контакт.\nВсичко останало можеш да научиш в разговора. Не питай за бюджет във формата.' } },
    { id: 's06l02-05', type: 'checkpoint', title: 'Проверка', checkpoint: { question: 'Оптимален брой полета във форма?', options: ['8-10', '3-5', '1', 'Колкото е нужно'], correctIndex: 1, explanation: '3-5 полета е sweet spot. По-малко = не събираш достатъчно. Повече = abandonment.' } },
    { id: 's06l02-06', type: 'summary', title: 'Какво научи', keyTakeaways: ['3-5 полета макс, mobile-оптимизирани', 'CTA с полза + Lead Magnet', 'Thank You + автоматичен имейл'], cta: 'Намали основната си форма до 3-5 полета и добави Lead Magnet.' }
  ]
};

export const S06_L03: LessonData = {
  id: 's01-m06-l06-03', title: 'Pricing и оферти', subtitle: 'Психологията на цената', duration: '30 мин',
  slides: [
    { id: 's06l03-01', type: 'title', title: 'Pricing и оферти', subtitle: 'Урок 3 от 10 · 30 минути', body: 'Как подреждаш цените е също толкова важно, колкото и самите цени.' },
    { id: 's06l03-02', type: 'comparison', title: 'Грешен vs Правилен pricing', leftSide: { label: 'Грешен', verdict: 'bad', content: '• Цените са скрити\n• Само 1 план\n• Няма контекст\n• Без гаранция\n• Няма разлика между пакети' }, rightSide: { label: 'Правилен', verdict: 'good', content: '• Публикувани цени\n• 3 плана (основен/популярен/премиум)\n• Price Anchoring\n• "30 дни гаранция"\n• Годишна vs месечна\n• Pricing FAQ секция' } },
    { id: 's06l03-03', type: 'content', title: 'Price Anchoring и Scarcity', highlights: ['Price Anchoring: покажи най-скъпия план първи.', '"Най-популярен" таг върху средния план.', 'Годишен план: "Спести 20%" спрямо месечен.', 'Scarcity: "Само 5 места на тази цена."', 'Urgency: "Офертата важи до края на месеца."', 'Enterprise: "Свържи се с нас" за големи клиенти.'] },
    { id: 's06l03-04', type: 'interactive', title: 'Упражнение: Създай pricing', interactivePrompt: { scenario: 'SEO услуги. Искаш да предложиш 3 пакета.', task: 'Създай Basic, Popular и Premium пакет с цени и ключови разлики.', hint: 'Popular = най-добра стойност. Premium = за тези, които искат всичко.', revealAnswer: 'Basic (199 лв/мес): SEO одит + 5 страници оптимизация + месечен отчет.\nPopular (399 лв/мес) ★: Всичко от Basic + 2 блог статии + GBP + backlinks. (Най-популярен)\nPremium (699 лв/мес): Всичко от Popular + content стратегия + CRO + priority support.' } },
    { id: 's06l03-05', type: 'checkpoint', title: 'Проверка', checkpoint: { question: 'Какво е Price Anchoring?', options: ['Скриване на цените', 'Показване на най-скъпото първо', 'Намаление от 50%', 'Безплатен пробен период'], correctIndex: 1, explanation: 'Показваш най-скъпата опция първа → останалите изглеждат по-евтини в сравнение. Класическа поведенческа икономика.' } },
    { id: 's06l03-06', type: 'summary', title: 'Какво научи', keyTakeaways: ['3 плана: Basic | Popular ★ | Premium', 'Price Anchoring + Guarantee', 'Публикувани цени + Pricing FAQ'], cta: 'Преработи цените си в 3 пакета с ясни разлики.' }
  ]
};

export const S06_L04: LessonData = {
  id: 's01-m06-l06-04', title: 'Sales процес', subtitle: 'От запитване до сделка', duration: '30 мин',
  slides: [
    { id: 's06l04-01', type: 'title', title: 'Sales процес', subtitle: 'Урок 4 от 10 · 30 минути', body: 'Бързината и follow-up-ът правят разликата между "ще помисля" и "подписах".' },
    { id: 's06l04-02', type: 'content', title: 'Speed to Lead', highlights: ['Отговор до 5 минути: conversion rate пада 80%+ след 30 мин.', 'Discovery Call: 15-20 мин. Разбери проблема, не продавай веднага.', 'Оферта до 2 часа след разговора.', 'CRM система: всичко записано, нищо не се губи.', 'Client Onboarding: плавен процес за нови клиенти.'] },
    { id: 's06l04-03', type: 'content', title: 'Follow-up и Objections', highlights: ['Follow-up каданс: Ден 1, 3, 7, 14.', '80% от сделките — след 5-ти follow-up.', 'Работа с възражения: изслушай, разбери, адресирай.', 'Win/Loss анализ всеки месец.', 'Conversion Rate анализ по източник на запитване.'] },
    { id: 's06l04-04', type: 'interactive', title: 'Упражнение: Follow-up каданс', interactivePrompt: { scenario: 'Клиент поиска оферта, ти я изпрати. Не е отговорил 3 дни.', task: 'Какъв follow-up план за следващите 14 дни?', hint: 'Не питай "получихте ли офертата?" — добави стойност.', revealAnswer: 'Ден 3: "Здрасти, имаш ли въпроси по офертата? Междувременно, ето case study на подобен клиент."\nДен 7: "Видях, че [конкурент] пусна X. Ето защо ние подхождаме различно."\nДен 14: "Ще архивирам офертата. Последен шанс за тази цена."' } },
    { id: 's06l04-05', type: 'checkpoint', title: 'Проверка', checkpoint: { question: 'След колко follow-up-а се случват 80% от сделките?', options: ['След 1-ви', 'След 5-ти', 'След 2-ри', 'Никога'], correctIndex: 1, explanation: '80% от сделките изискват 5+ follow-up-а. Повечето хора се отказват след 2-ри. Бъди този, който не се отказва.' } },
    { id: 's06l04-06', type: 'summary', title: 'Какво научи', keyTakeaways: ['Speed to lead: отговор до 5 мин', 'Follow-up: Ден 1, 3, 7, 14', 'Win/Loss анализ всеки месец'], cta: 'Направи follow-up на всички "студени" оферти от последния месец.' }
  ]
};

export const S06_L05: LessonData = {
  id: 's01-m06-l06-05', title: 'Социално доказателство', subtitle: 'Продава без думи', duration: '25 мин',
  slides: [
    { id: 's06l05-01', type: 'title', title: 'Социално доказателство', subtitle: 'Урок 5 от 10 · 25 минути', body: 'Никой не иска да е "първият" клиент. Покажи, че други вече са ти се доверили.' },
    { id: 's06l05-02', type: 'content', title: '6 типа Social Proof', highlights: ['Google Reviews: #1 за локален бизнес.', 'Testimonials: текст + снимка + име + роля.', 'Case Studies: проблем → решение → резултат.', 'Броячи: "200+ проекта", "98% satisfaction".', 'Лога на клиенти: разпознаваеми брандове.', 'Video Testimonials: 10× по-силни от текст.'] },
    { id: 's06l05-03', type: 'content', title: 'Before/After и ревюта', highlights: ['Before/After: визуално + numbers.', 'Искане на ревюта: направи го лесно — 1 линк.', 'Отговор на ревюта: ВСЯКО, в рамките на 24 ч.', 'Social Proof близо до CTA.', 'Обновявай: нови ревюта всеки месец.'] },
    { id: 's06l05-04', type: 'interactive', title: 'Упражнение: Събери Social Proof', interactivePrompt: { scenario: 'Стартираш нова услуга и нямаш ревюта все още.', task: 'Какви 3 типа social proof можеш да създадеш БЕЗ платени клиенти?', hint: 'Помисли: безплатна работа, лични проекти, сертификати.', revealAnswer: '1. Case Study от pro bono проект (направи безплатно за 1 клиент срещу testimonial).\n2. Лични проекти с números — "Постигнах X резултат за моя собствен сайт".\n3. Сертификати, награди, образование — показват expertise.' } },
    { id: 's06l05-05', type: 'checkpoint', title: 'Проверка', checkpoint: { question: 'Най-силен social proof за локален бизнес?', options: ['Брояч на посетители', 'Google Reviews с истински имена', 'Снимка на офис', 'Списък с услуги'], correctIndex: 1, explanation: 'Google Reviews = най-високо доверие. Хората им вярват повече от маркетингов текст.' } },
    { id: 's06l05-06', type: 'summary', title: 'Какво научи', keyTakeaways: ['6 типа: Reviews, Testimonials, Case Studies, Броячи, Лога, Video', 'Social Proof близо до CTA', 'Отговаряй на ВСЯКО ревю'], cta: 'Събери и публикувай 3 нови testimonials тази седмица.' }
  ]
};

export const S06_L06: LessonData = {
  id: 's01-m06-l06-06', title: 'Retention и Upsell', subtitle: 'Задържането носи повече от привличането', duration: '25 мин',
  slides: [
    { id: 's06l06-01', type: 'title', title: 'Retention и Upsell', subtitle: 'Урок 6 от 10 · 25 минути', body: '5-7× по-скъпо е да привлечеш нов клиент, отколкото да задържиш стар. Retention е истинският growth engine.' },
    { id: 's06l06-02', type: 'content', title: 'Onboarding и Follow-up', highlights: ['Onboarding Emails: 3 имейла за 7 дни.', 'Follow-up след 30 дни: "Как се справяш?"', 'Anniversary Emails: "1 година заедно!"', 'Клиентски отчети: показвай стойността редовно.', 'Loyalty програма: награди за лоялност.'] },
    { id: 's06l06-03', type: 'content', title: 'Upsell и Win-back', highlights: ['Upsell: предложи следващо ниво след 3 месеца.', 'Cross-sell: комплементарни услуги.', 'Referral: "Доведи приятел → 20% отстъпка".', 'Win-back: след 90 дни бездействие → специална оферта.', 'Churn анализ: ЗАЩО си тръгват? Поправи.'] },
    { id: 's06l06-04', type: 'interactive', title: 'Упражнение: Onboarding Sequence', interactivePrompt: { scenario: 'Нов клиент току-що се е регистрирал за твоя SEO услуга.', task: 'Какви 3 имейла получава в първите 7 дни?', hint: 'Благодарност → Стойност → Следваща стъпка.', revealAnswer: 'Ден 1 (Welcome): "Благодаря! Ето какво да очакваш. Ето първата стъпка."\nДен 3 (Стойност): "3 неща, които ще подобрим първо. Ето началния audit."\nДен 7 (Следваща стъпка): "Първите резултати. Ето какво следва + как да се свържеш с нас."' } },
    { id: 's06l06-05', type: 'checkpoint', title: 'Проверка', checkpoint: { question: 'Колко × по-скъпо е нов клиент vs задържане?', options: ['2×', '5-7×', '10×', 'Същото'], correctIndex: 1, explanation: '5-7× по-скъпо. Retention е най-подценяваният growth лост.' } },
    { id: 's06l06-06', type: 'summary', title: 'Какво научи', keyTakeaways: ['Onboarding: 3 имейла / 7 дни', 'Follow-up на 30 дни + Upsell на 3 месеца', 'Churn анализ + Win-back кампания'], cta: 'Създай Onboarding Sequence от 3 имейла за нови клиенти.' }
  ]
};

export const S06_L07: LessonData = {
  id: 's01-m06-l06-07', title: 'Имейл за продажби', subtitle: 'Автоматизираната ти машина за пари', duration: '25 мин',
  slides: [
    { id: 's06l07-01', type: 'title', title: 'Имейл за продажби', subtitle: 'Урок 7 от 10 · 25 минути', body: 'Имейлът е каналът с най-висок ROI. Научи как да продаваш чрез имейл без да си натрапчив.' },
    { id: 's06l07-02', type: 'content', title: 'Welcome и Nurture', highlights: ['Welcome Email: веднага. Благодари + задай очаквания.', 'Nurture Sequence: 5-7 имейла за 14 дни.', 'Sales Email: 1 ясна оферта, 1 CTA.', 'Персонализация: име + контекст.', 'Social Proof в имейла: testimonial или case study.'] },
    { id: 's06l07-03', type: 'content', title: 'Urgency и Follow-up', highlights: ['Urgency: "Офертата важи до петък."', 'P.S. секция: 90%+ я четат. Сложи CTA там.', 'Abandoned Follow-up: 3 имейла за 7 дни.', 'Follow-up към неотворили: различен subject line.', 'Email Conversion Rate: следи го месечно.'] },
    { id: 's06l07-04', type: 'interactive', title: 'Упражнение: Sales Email', interactivePrompt: { scenario: 'Искаш да продадеш SEO пакет на абонати, които са отваряли предишни имейли.', task: 'Структурирай този имейл.', hint: 'Hook → Проблем → Решение → Social Proof → Оферта → CTA.', revealAnswer: 'Subject: "Сайтът ти не носи клиенти (ето защо)"\nHook: "Проверихме 50 сайта като твоя. 80% правят тази грешка."\nПроблем: кое не работи.\nРешение: какво правим ние.\nSocial Proof: "Ето резултатите на Иван след 3 месеца."\nОферта: "Специална цена до петък."\nP.S.: "Само 3 места остават."' } },
    { id: 's06l07-05', type: 'checkpoint', title: 'Проверка', checkpoint: { question: 'Коя част от имейла четат 90%+ от хората?', options: ['Заглавие', 'Първи параграф', 'P.S. секция', 'Картинките'], correctIndex: 2, explanation: 'P.S. е като "втори subject line". Хората сканират до P.S. дори да не четат целия имейл.' } },
    { id: 's06l07-06', type: 'summary', title: 'Какво научи', keyTakeaways: ['Welcome → Nurture → Sales', 'Personalization + Social Proof в имейла', 'P.S. секция + Follow-up за неотворили'], cta: 'Напиши 1 sales имейл с P.S. секция и ясен CTA.' }
  ]
};

export const S06_L08: LessonData = {
  id: 's01-m06-l06-08', title: 'Доверие и сигурност', subtitle: 'Без trust няма транзакция', duration: '25 мин',
  slides: [
    { id: 's06l08-01', type: 'title', title: 'Доверие и сигурност', subtitle: 'Урок 8 от 10 · 25 минути', body: 'Ако посетителят не ти вярва — няма да ти плати. Точка. Доверието се изгражда с всеки елемент на сайта.' },
    { id: 's06l08-02', type: 'content', title: '8 Trust елемента', highlights: ['SSL/HTTPS: задължителен. Без него = загубен клиент.', 'Контактна информация: пълен адрес, телефон, имейл.', 'Снимка на екипа/собственика: хора купуват от хора.', 'Правни страници: GDPR, Privacy Policy, Terms.', 'Платежни икони: Visa, Mastercard, PayPal.', 'Trust Badges: гаранция, сертификати.', 'Прозрачен процес: как работиш стъпка по стъпка.', 'Live Chat / WhatsApp: лесен контакт.'] },
    { id: 's06l08-03', type: 'content', title: 'Политики и About', highlights: ['Политика за връщане: ясна, конкретна, видима.', 'About страница: история, мисия, хора.', 'Прозрачност: не крий информация.', 'Сигурност на плащанията: SSL + trust badges.', 'Обновявай правните страници редовно.'] },
    { id: 's06l08-04', type: 'interactive', title: 'Упражнение: Trust одит', interactivePrompt: { scenario: 'Сайт без SSL, контакти само имейл, няма снимки, няма правни страници, няма guarantee.', task: 'Подреди 5-те trust елемента по спешност.', hint: 'Кое би отказало най-много хора?', revealAnswer: '1. SSL — ДНЕС. Браузърите показват "Not Secure".\n2. Контакти — телефон + адрес.\n3. Правни страници — минимум Privacy Policy.\n4. Снимка на екипа/собственика.\n5. Гаранция за връщане.' } },
    { id: 's06l08-05', type: 'checkpoint', title: 'Проверка', checkpoint: { question: 'Trust badge #1 за ecommerce?', options: ['Facebook лого', 'SSL сертификат', 'Twitter followers', 'Брой продукти'], correctIndex: 1, explanation: 'SSL = минималното изискване. Без него браузърът плаши посетителя преди да е видял каквото и да било.' } },
    { id: 's06l08-06', type: 'summary', title: 'Какво научи', keyTakeaways: ['SSL + контакти + снимки = trust фундамент', 'Правни страници + политика за връщане', 'Live Chat/WhatsApp за бърз контакт'], cta: 'Провери дали имаш SSL, контакти и правни страници.' }
  ]
};

export const S06_L09: LessonData = {
  id: 's01-m06-l06-09', title: 'Checkout и плащания', subtitle: 'Където става магията (или не)', duration: '25 мин',
  slides: [
    { id: 's06l09-01', type: 'title', title: 'Checkout и плащания', subtitle: 'Урок 9 от 10 · 25 минути', body: '70%+ от количките биват изоставени. Всеки процент спасен checkout = хиляди левове.' },
    { id: 's06l09-02', type: 'content', title: 'Опростен Checkout', highlights: ['Минимално стъпки: колкото по-малко, толкова по-добре.', 'Guest Checkout: не задължавай регистрация. 30% напускат заради това.', 'Order Summary: винаги видима.', 'Без скрити такси: покажи общата цена отначало.', 'Различни методи: карта, Apple Pay, Google Pay, PayPal, банков превод.'] },
    { id: 's06l09-03', type: 'content', title: 'След покупката', highlights: ['Потвърдителен имейл: веднага след плащане.', 'Abandoned Cart Emails: 3 имейла за 48 часа.', 'Security Badges в checkout-а.', 'Mobile Checkout: тествай на телефон.', 'Cart Abandonment анализ: ЗАЩО напускат?'] },
    { id: 's06l09-04', type: 'interactive', title: 'Упражнение: Оптимизирай checkout', interactivePrompt: { scenario: 'Checkout: 5 стъпки, задължителна регистрация, само 1 метод плащане, скрити 15 лв такса.', task: 'Кои 3 неща оправяш първо?', hint: 'Всяка бариера = изоставена количка.', revealAnswer: '1. Guest Checkout — премахни регистрацията (+30% конверсия).\n2. Скрити такси → покажи ги отначало.\n3. 5 стъпки → 2 стъпки (данни → плащане).\nСлед това: добави Apple Pay и Google Pay.' } },
    { id: 's06l09-05', type: 'checkpoint', title: 'Проверка', checkpoint: { question: 'Колко % напускат заради задължителна регистрация?', options: ['5%', '~30%', '50%', 'Никой'], correctIndex: 1, explanation: '~30% отказват checkout при задължителна регистрация. Guest checkout = едно от най-лесните CRO подобрения.' } },
    { id: 's06l09-06', type: 'summary', title: 'Какво научи', keyTakeaways: ['Опростен checkout: 1-2 стъпки', 'Guest Checkout + много методи', 'Abandoned Cart Emails + Mobile тест'], cta: 'Провери checkout процеса си. Ако имаш задължителна регистрация — махни я.' }
  ]
};

export const S06_L10: LessonData = {
  id: 's01-m06-l06-10', title: 'Измерване на конверсии', subtitle: 'Данните не лъжат', duration: '25 мин',
  slides: [
    { id: 's06l10-01', type: 'title', title: 'Измерване на конверсии', subtitle: 'Урок 10 от 10 · 25 минути', body: 'Без измерване си сляп. Спри да гадаеш — започни да мериш.' },
    { id: 's06l10-02', type: 'content', title: 'Ключови Conversion KPIs', highlights: ['GA4: проследявай conversions като Events.', 'Landing Page Conversion Rate: visitors → leads.', 'Heatmaps: КЪДЕ кликат? (Microsoft Clarity — безплатен).', 'Session Recordings: гледай реални сесии.', 'Funnel Analysis: къде губиш най-много хора?', 'CPA: колко струва 1 клиент?', 'CLV: колко струва клиент за целия период?'] },
    { id: 's06l10-03', type: 'content', title: 'A/B тестове и отчети', highlights: ['A/B тест: 1 променлива, стат. значимост 95%+.', 'Тествай: заглавие, CTA текст, цвят, форма.', 'Conversion Report: месечен с action items.', 'Документиране: всяка промяна + резултат.', 'Ако не мериш — не знаеш дали подобряваш.'] },
    { id: 's06l10-04', type: 'interactive', title: 'Упражнение: Анализирай funnel', interactivePrompt: { scenario: '1000 посетители → 50 кликват CTA → 10 попълват форма → 2 стават клиенти.', task: 'Къде е bottleneck-ът? Кое оптимизираш първо?', hint: 'Коя стъпка губи най-много хора като процент?', revealAnswer: 'CTA → Форма (50 → 10 = 80% спад). Оптимизирай:\n1. Формата — намали полета, промени CTA текста.\n2. A/B тест на CTA бутон (цвят, текст, позиция).\n3. Добави social proof между CTA и формата.' } },
    { id: 's06l10-05', type: 'checkpoint', title: 'Проверка', checkpoint: { question: 'Кое е VANITY metric?', options: ['Conversion Rate', 'CPA', 'CLV', 'Page views'], correctIndex: 3, explanation: 'Page views без контекст са vanity. Важно е КАКВО правят посетителите, не колко са.' } },
    { id: 's06l10-06', type: 'summary', title: 'Модул 6 — Завършен', keyTakeaways: ['GA4 + Heatmaps + Session Recordings', 'A/B тестване: 1 променлива, 95% значимост', 'Месечен Conversion Report с action items'], cta: 'Инсталирай Microsoft Clarity и направи funnel analysis.' }
  ]
};