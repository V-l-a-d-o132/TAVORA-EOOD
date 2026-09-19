import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SharedNav from '@/components/feature/SharedNav';
import SharedFooter from '@/components/feature/SharedFooter';

const FAQ_ITEMS = [
  {
    q: 'Може ли наистина да съм номер 1 в Google безплатно?',
    a: 'Да — при нишови ключови думи с ниска конкуренция. Sunrise Food достигнаха #1 за „гъби кладница онлайн" за 3–4 седмици без платени реклами — само с SEO. Вижте нашия SEO пакет от 390 € за професионално оптимизиране.',
  },
  {
    q: 'Колко време отнема безплатният SEO за Търново?',
    a: 'За нишови думи — 3–4 седмици до #1. За по-конкурентни думи като „ресторант Търново" — 2–4 месеца. Безплатният SEO е бавен, но стабилен — резултатите остават месеци и години.',
  },
  {
    q: 'Кои SEO тактики са наистина безплатни?',
    a: 'Google Business Profile, Google Search Console, LocalBusiness Schema, вътрешно свързване, оптимизация на съдържание, FAQPage Schema и блог публикации — всички са безплатни. Единственото „задължително" е време и консистенция.',
  },
  {
    q: 'Трябва ли ми програмист за Schema.org?',
    a: 'Не — днес има безплатни инструменти за генериране на Schema.org JSON-LD. Но професионалната Schema оптимизация (LocalBusiness, Person, WebSite, HowTo, FAQPage) е значително по-ефективна и се прави веднъж, за цял живот.',
  },
  {
    q: 'Как да проверя дали SEO работи?',
    a: 'Google Search Console — безплатен инструмент от Google. Показва позициите на сайта ви за всяка ключова дума, кликове, индексирани страници и Core Web Vitals. Ние предоставяме месечни отчети.',
  },
  {
    q: 'Колко често да публикувам блог статии?',
    a: 'Минимум веднъж месечно. Идеално — веднъж седмично. Колкото повече качествено съдържание, толкова повече ключови думи класирате. Всяка блог статия е нова възможност за #1.',
  },
  {
    q: 'Безплатният SEO достатъчен ли е за конкурентни ниши?',
    a: 'За ниши като „ресторант Търново" или „SEO Търново" са нужни и платени стратегии — реклами, backlinks, PR. Безплатният SEO е основата, но за максимално класиране трябва и допълнителни канали.',
  },
];

const today = new Date().toISOString().split('T')[0];

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
};

const ARTICLE_SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      '@id': 'https://imashnujnoto.com/blog/bezplaten-seo-nomer-edno-google#article',
      headline: 'Безплатен SEO за номер 1 в Google — 8 тактики за бизнес в Търново',
      description: 'Не винаги трябва да си платиш за номер 1 в Google. 8 безплатни SEO тактики за бизнес в Търново — Google Business Profile, Schema.org, вътрешно свързване, Google Search Console и още. Реални case studies. ТАВОРА ЕООД.',
      url: 'https://imashnujnoto.com/blog/bezplaten-seo-nomer-edno-google',
      datePublished: '2026-05-05',
      dateModified: today,
      inLanguage: 'bg',
      wordCount: 4200,
      timeRequired: 'PT15M',
      keywords: [
        'безплатен SEO',
        'SEO без пари',
        'SEO Търново',
        'SEO оптимизация',
        'Google Business Profile',
        'LocalBusiness Schema',
        'дигитален маркетинг Търново',
        'безплатен Google ранк',
      ],
      author: {
        '@type': 'Person',
        '@id': 'https://imashnujnoto.com/#founder',
        name: 'Владимир Веселинов Атанасов',
        url: 'https://imashnujnoto.com/ekip',
      },
      publisher: {
        '@type': 'Organization',
        '@id': 'https://imashnujnoto.com/#organization',
        name: 'ТАВОРА ЕООД',
        url: 'https://imashnujnoto.com',
        logo: {
          '@type': 'ImageObject',
          url: 'https://storage.readdy-site.link/project_files/3f265d07-5825-4e88-a58a-44deb287b858/ec0eb8c9-c502-4cf5-bee4-657c996896dc_--.png?v=3d4829c108a0d31cdde2da513964de19',
        },
      },
      image: {
        '@type': 'ImageObject',
        url: 'https://readdy.ai/api/search-image?query=free%20SEO%20optimization%20strategy%20small%20business%20zero%20budget%20Google%20ranking%20organic%20traffic%20growth%20green%20charts%20arrows%20pointing%20up%20clean%20minimal%20white%20background%20professional&width=1200&height=630&seq=bezplaten-seo-hero&orientation=landscape',
        width: 1200,
        height: 630,
      },
      isPartOf: { '@id': 'https://imashnujnoto.com/#website' },
      about: [
        { '@type': 'Thing', name: 'SEO оптимизация' },
        { '@type': 'Thing', name: 'Безплатен дигитален маркетинг' },
        { '@type': 'Place', name: 'Велико Търново' },
      ],
      mentions: [
        { '@type': 'Organization', name: 'ТАВОРА ЕООД', url: 'https://imashnujnoto.com' },
        { '@type': 'Organization', name: 'K-Food Велико Търново', url: 'https://k-foodvelikotarnovo.com/' },
        { '@type': 'Organization', name: 'Sunrise Food', url: 'https://sunrisefood.eu/' },
        { '@type': 'Organization', name: 'Thalysta', url: 'https://thalysta.com/' },
        { '@type': 'Organization', name: 'NMOM', url: 'https://nmom.bg/' },
      ],
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Начало', item: 'https://imashnujnoto.com/' },
          { '@type': 'ListItem', position: 2, name: 'Блог', item: 'https://imashnujnoto.com/blog' },
          { '@type': 'ListItem', position: 3, name: 'Безплатен SEO номер 1 Google', item: 'https://imashnujnoto.com/blog/bezplaten-seo-nomer-edno-google' },
        ],
      },
    },
    {
      '@type': 'LocalBusiness',
      '@id': 'https://imashnujnoto.com/#organization',
      name: 'ТАВОРА ЕООД',
      alternateName: ['Tavora', 'Имаш нужното', 'imashnujnoto'],
      description: 'Дигитален маркетинг агенция в Велико Търново. SEO оптимизация, GEO за AI търсачки, рекламни кампании и видео продукция.',
      url: 'https://imashnujnoto.com',
      telephone: '+359885189724',
      priceRange: '€€',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'ул. "Велчо Джамджията"',
        addressLocality: 'Велико Търново',
        postalCode: '5000',
        addressCountry: 'BG',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 43.0785,
        longitude: 25.6415,
      },
      areaServed: [
        { '@type': 'City', name: 'Велико Търново' },
        { '@type': 'AdministrativeArea', name: 'Търновска област' },
        { '@type': 'Country', name: 'България' },
      ],
      founder: {
        '@type': 'Person',
        '@id': 'https://imashnujnoto.com/#founder',
        name: 'Владимир Веселинов Атанасов',
      },
      legalName: 'ТАВОРА ЕООД',
      taxID: '208438650',
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '09:00',
          closes: '18:00',
        },
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'SEO услуги Велико Търново',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Безплатен SEO одит',
              url: 'https://imashnujnoto.com/blog/bezplaten-seo-nomer-edno-google',
              description: '8 безплатни SEO тактики за номер 1 в Google.',
            },
            priceSpecification: {
              '@type': 'PriceSpecification',
              price: '0',
              priceCurrency: 'EUR',
            },
          },
        ],
      },
    },
  ],
};

const FREE_TACTICS = [
  {
    num: '01',
    title: 'Google Business Profile — безплатно и задължително',
    icon: 'ri-map-pin-2-line',
    color: '#E67700',
    time: '2 часа настройка',
    impact: 'Максимален',
    desc: 'Google Business Profile (GBP) е напълно безплатен инструмент, който кара бизнеса ви да се появява в Google Maps и локалния пакет с 3 резултата.',
    bullets: [
      'Създайте профил на business.google.com — напълно безплатно',
      'Попълнете всяко поле — описание, категории, работно време, снимки, телефон, сайт',
      'Добавете минимум 10 снимки — интериор, екстериор, екип, продукти',
      'Верифицирайте с пощенска картичка или телефон',
      'Публикувайте постове седмично — промоции, новини, съвети',
      'Питайте всеки доволен клиент за отзив — директен линк за ревю',
      'Отговаряйте на всички отзиви — положителни и отрицателни',
    ],
    caseStudy: {
      client: 'Sunrise Food',
      result: 'Когато Sunrise Food оптимизираха GBP — показваха се при търсения за „гъби" в цяла България. Локалният ранк помогна за националното класиране.',
    },
  },
  {
    num: '02',
    title: 'LocalBusiness Schema.org — кода, който казва на Google кои сте',
    icon: 'ri-code-s-slash-line',
    color: '#C2255C',
    time: '30 мин. генериране',
    impact: 'Висок',
    desc: 'Schema.org е структуриран код (JSON-LD), който казва на Google точно кой сте, къде сте и какво правите. Безплатен инструмент, който е задължителен за локален ранк.',
    bullets: [
      'Използвайте безплатен генератор — например technicalseo.com/tools/schema-markup-generator/',
      'Изберете тип „LocalBusiness" или по-специфичен — „ProfessionalService", „Restaurant", „Store"',
      'Добавете: име, адрес, телефон, работно време, цени, координати',
      'Добавете geo данни — точни координати на офиса/магазина',
      'Добавете areaServed — Велико Търново, Търновска област, България',
      'Добавете sameAs — линкове към Facebook, Instagram, LinkedIn',
      'Поставете кода в <head> на всяка страница — или го прави програмист',
    ],
    caseStudy: {
      client: 'K-Food Велико Търново',
      result: 'След добавяне на LocalBusiness + FAQPage + Person Schema — K-Food скочи от страница 3 на #1 за „корейска храна велико търново" за 2–3 месеца.',
    },
  },
  {
    num: '03',
    title: 'Google Search Console — най-добрият безплатен SEO инструмент',
    icon: 'ri-dashboard-3-line',
    color: '#3B5BDB',
    time: '15 мин. настройка',
    impact: 'Максимален',
    desc: 'Google Search Console (GSC) е безплатен инструмент от Google, който показва всичко за сайта ви — позиции, кликове, индексирани страници, Core Web Vitals, грешки.',
    bullets: [
      'Регистрирайте се на search.google.com/search-console — безплатно',
      'Добавете сайта си — верификация чрез DNS или HTML файл',
      'Проверявайте „Performance" раздела — позиции за всяка ключова дума',
      'Следете „Core Web Vitals" — LCP, FID, CLS за SEO ранк',
      'Проверявайте „Coverage" — всички ли страници са индексирани?',
      'Гледайте „Enhancements" — Schema.org данните са ли валидни?',
      'Използвайте „URL Inspection" — конкретна страница индексирана ли е?',
    ],
    caseStudy: {
      client: 'Thalysta',
      result: 'Чрез GSC открихме, че 40% от продуктовите страници не са индексирани. След поправка — индексирането скочи на 95% и органичният трафик нарасна с 220% за 3 месеца.',
    },
  },
  {
    num: '04',
    title: 'Вътрешно свързване — свободен SEO boost',
    icon: 'ri-link-m',
    color: '#2F9E44',
    time: '1 час за среден сайт',
    impact: 'Средно-висок',
    desc: 'Вътрешното свързване е безплатна стратегия: свързвате страниците на сайта си помежду си. Това помага на Google да разбере структурата и да предаде SEO „сок" между страниците.',
    bullets: [
      'Всяка страница трябва да има минимум 3–5 вътрешни линка към други страници',
      'Използвайте описателен анкър текст — не „кликни тук", а „SEO оптимизация Търново"',
      'Най-важните страници трябва да са на 1–2 клика от началната страница',
      'Създайте блог — всяка статия линква към услуги и обратно',
      'Добавете навигационни менюта с текстови линкове във футъра',
      'Няма нужда от инструменти — просто отворете сайта си и започнете да добавяте линкове',
    ],
    caseStudy: {
      client: 'Budimse.online',
      result: 'След реорганизиране на вътрешната структура и добавяне на 35 нови вътрешни линка — органичният трафик нарасна с 145% за 2 месеца.',
    },
  },
  {
    num: '05',
    title: 'Оптимизация на съдържание — безплатно и постоянно',
    icon: 'ri-file-text-line',
    color: '#7048E8',
    time: 'Постоянно',
    impact: 'Максимален',
    desc: 'Качественото, оптимизирано съдържание е най-дългосрочната SEO инвестиция. Всяка нова страница е нова възможност за #1 в Google.',
    bullets: [
      'H1 заглавие с основната ключова дума — само един H1 на страница',
      'Meta title 50–60 символа — ключова дума + локация + бранд',
      'Meta description 120–160 символа — ключова дума и CTA (призив за действие)',
      'Alt текст на всички изображения — описателен, с ключова дума',
      'URL кратък и описателен — /seo-veliko-tarnovo/, не /page-123/',
      'Използвайте ключова дума в първите 100 думи на текста',
      'Пишете поне 800 думи за всяка страница — Google обича дълбоко съдържание',
    ],
    caseStudy: {
      client: 'NMOM',
      result: 'След публикуване на 4 блог статии по 1200+ думи с оптимизирани заглавия и описания — NMOM започна да се класира за 12 нови ключови думи, включително „НПО кампании България".',
    },
  },
  {
    num: '06',
    title: 'FAQPage Schema — изкачете се в "People also ask"',
    icon: 'ri-questionnaire-line',
    color: '#E8590C',
    time: '20 мин. на страница',
    impact: 'Висок',
    desc: 'FAQPage Schema е структурирани данни за въпроси и отговори. Когато Google ги индексира — вашите въпроси могат да се появят в "People also ask" кутията на Google.',
    bullets: [
      'Намерете въпроси, които клиентите ви задават — от търсения в Google, от консултации, от Facebook',
      'Отговорете честно и конкретно — не кратки, празни отговори',
      'Структурирайте въпросите в JSON-LD FAQPage Schema',
      'Добавете Schema кода в <head> на страницата',
      'Валидирайте с Google Rich Results Test — безплатен инструмент',
      'Повтаряйте за всяка важна страница — услуги, продукти, блог',
    ],
    caseStudy: {
      client: 'ТАВОРА ЕООД — нашият сайт',
      result: 'След добавяне на FAQPage Schema на 12 страници — 7 от въпросите ни се появиха в „People also ask" на Google. Органичният трафик нарасна с 35% само от тази тактика.',
    },
  },
  {
    num: '07',
    title: 'WebSite Schema + SearchAction — оптимизация за AI търсачки',
    icon: 'ri-robot-line',
    color: '#0A2540',
    time: '15 мин. настройка',
    impact: 'Максимален',
    desc: 'WebSite Schema с SearchAction казва на Google и AI търсачки как да търсят в сайта ви. Това е критично за GEO оптимизация — ChatGPT, Perplexity, Gemini.',
    bullets: [
      'Добавете WebSite Schema с SearchAction в <head> на началната страница',
      'Укажете target URL — https://imashnujnoto.com/search?q={search_term_string}',
      'Добавете Person Schema за основателя — knowsAbout, jobTitle, alumniOf',
      'Добавете HowTo Schema за стъпкови ръководства',
      'Валидирайте с Google Rich Results Test',
      'Това е безплатно — един път настройка, работи завинаги',
    ],
    caseStudy: {
      client: 'Thalysta',
      result: 'След добавяне на WebSite + Person + HowTo Schema — ChatGPT започна да споменава Thalysta при търсения за „български бижута" и „handmade бижута".',
    },
  },
  {
    num: '08',
    title: 'Блог — най-дългосрочната безплатна инвестиция',
    icon: 'ri-article-line',
    color: '#D6336C',
    time: '2–4 часа на статия',
    impact: 'Максимален',
    desc: 'Всяка блог статия е нова страница, която може да класира за нова ключова дума. Блогът е безплатен, но изисква постоянство.',
    bullets: [
      'Публикувайте поне веднъж месечно — идеално веднъж седмично',
      'Пишете по въпроси, които клиентите ви задават',
      'Оптимизирайте всяка статия — H1, meta, alt текстове, вътрешни линкове',
      'Промотирайте в социалните медии — безплатен трафик',
      'Актуализирайте старите статии — Google обича актуално съдържание',
      'Превръщайте статиите в FAQ — добавяйте FAQPage Schema',
      'Добавяйте видео — видеото увеличава engagement и ранк',
    ],
    caseStudy: {
      client: 'Budimse.online',
      result: 'След 6 блог статии по 1200+ думи — сайтът класира за 23 нови ключови думи. Органичният трафик нарасна с 340% за 5 месеца — нула рекламен бюджет.',
    },
  },
];

const TIMELINE = [
  { week: 'Седмица 1', action: 'Google Business Profile настройка', cost: '0 €', result: 'Появяване в Google Maps' },
  { week: 'Седмица 1–2', action: 'LocalBusiness + FAQPage Schema', cost: '0 €', result: 'Структурирани данни за Google' },
  { week: 'Седмица 2–3', action: 'Google Search Console настройка', cost: '0 €', result: 'Видимост на позициите' },
  { week: 'Седмица 3–4', action: 'Вътрешно свързване + оптимизация', cost: '0 €', result: 'Подобрено класиране' },
  { week: 'Месец 2+', action: 'Блог статии — веднъж месечно', cost: '0 €', result: 'Все повече ключови думи' },
  { week: 'Месец 3–4', action: 'Мониторинг и корекции', cost: '0 €', result: 'Стабилен #1 за нишови думи' },
];

const RELATED = [
  { title: 'SEO оптимизация Велико Търново 2026', to: '/blog/seo-optimizaciya-tarnovo-2026', cat: 'SEO', color: 'bg-sky-50 text-sky-700' },
  { title: 'GEO оптимизация за ChatGPT', to: '/blog/geo-ai-tarnovo', cat: 'GEO & AI', color: 'bg-violet-50 text-violet-700' },
  { title: 'Google Business Profile за Търново', to: '/blog/google-business-vt', cat: 'Локално SEO', color: 'bg-amber-50 text-amber-700' },
  { title: 'Изработка на сайт Търново', to: '/blog/izrabotka-na-sait-tarnovo', cat: 'Уеб дизайн', color: 'bg-teal-50 text-teal-700' },
  { title: 'Дигитален маркетинг Търново', to: '/digitalen-marketing-veliko-tarnovo', cat: 'Ръководство', color: 'bg-emerald-50 text-emerald-700' },
  { title: 'SEO услуга Търново', to: '/seo-veliko-tarnovo', cat: 'Услуга', color: 'bg-sky-50 text-sky-700' },
];

export default function BezplatenSeoNomerEdnoPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    document.title = 'Безплатен SEO за номер 1 в Google — 8 тактики за Търново | ТАВОРА ЕООД';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', 'Не винаги трябва да си платиш за номер 1 в Google. 8 безплатни SEO тактики за бизнес в Търново — GBP, Schema.org, GSC, вътрешно свързване и още. ТАВОРА ЕООД.');
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://imashnujnoto.com/blog/bezplaten-seo-nomer-edno-google');

    const id = 'schema-bezplaten-seo';
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) { el = document.createElement('script'); el.id = id; el.type = 'application/ld+json'; document.head.appendChild(el); }
    el.textContent = JSON.stringify(ARTICLE_SCHEMA);

    const faqId = 'schema-bezplaten-seo-faq';
    let faqEl = document.getElementById(faqId) as HTMLScriptElement | null;
    if (!faqEl) { faqEl = document.createElement('script'); faqEl.id = faqId; faqEl.type = 'application/ld+json'; document.head.appendChild(faqEl); }
    faqEl.textContent = JSON.stringify(FAQ_SCHEMA);

    return () => {
      ['schema-bezplaten-seo', 'schema-bezplaten-seo-faq'].forEach((sid) => { const e = document.getElementById(sid); if (e) e.remove(); });
    };
  }, []);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <SharedNav />

      <main>
        {/* ── HERO ── */}
        <section className="w-full bg-[#F9F9F7] border-b border-[#1C1C1E]/6 py-8 md:py-20 px-4 md:px-16">
          <div className="max-w-4xl mx-auto">
            <nav aria-label="breadcrumb" className="flex items-center gap-2 text-[11px] text-[#1C1C1E]/65 mb-6">
              <Link to="/" className="hover:text-[#1C1C1E]/60 transition-colors">Начало</Link>
              <i className="ri-arrow-right-s-line text-xs" />
              <Link to="/blog" className="hover:text-[#1C1C1E]/60 transition-colors">Блог</Link>
              <i className="ri-arrow-right-s-line text-xs" />
              <span className="text-[#1C1C1E]/65">Безплатен SEO</span>
            </nav>

            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span className="text-[10px] px-2.5 py-1 rounded-full font-medium bg-emerald-50 text-emerald-700">SEO</span>
              <span className="text-[10px] px-2.5 py-1 rounded-full font-medium bg-violet-50 text-violet-700">Безплатно</span>
              <span className="text-[10px] px-2.5 py-1 rounded-full font-medium bg-amber-50 text-amber-700">Локално SEO</span>
              <span className="text-[10px] text-[#1C1C1E]/70">15 мин. четене · 5 Май 2026</span>
            </div>

            <h1
              className="text-3xl md:text-5xl font-light text-[#1C1C1E] leading-tight mb-5"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              <em className="text-[#2F9E44]">Не винаги трябва да си платиш</em>
              <br />
              <strong className="font-light">за да си номер едно</strong>
              <br />
              <span className="text-[#1C1C1E]/60">в Google.</span>
            </h1>

            <p className="text-sm md:text-base text-[#1C1C1E]/65 max-w-2xl leading-relaxed mb-6">
              <strong className="text-[#1C1C1E]">8 безплатни SEO тактики</strong> за бизнес в Търново.
              Не винаги трябва да си платиш за номер 1 в Google — вижте колко е лесно.
              Реални case studies с Sunrise Food, K-Food, Thalysta, NMOM и Budimse.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link to="/kontakt" className="px-6 py-3 bg-[#1C1C1E] text-white text-sm rounded-full hover:bg-[#1C1C1E]/80 transition-all cursor-pointer whitespace-nowrap">
                SEO одит 50 € →
              </Link>
              <Link to="/seo-veliko-tarnovo" className="px-6 py-3 border border-[#1C1C1E]/12 text-[#1C1C1E]/65 text-sm rounded-full hover:border-[#1C1C1E]/30 hover:text-[#1C1C1E] transition-all cursor-pointer whitespace-nowrap">
                SEO услуга Търново
              </Link>
            </div>
          </div>
        </section>

        {/* ── HERO IMAGE ── */}
        <div className="w-full h-[280px] md:h-[420px] overflow-hidden">
          <img
            src="https://readdy.ai/api/search-image?query=free%20SEO%20optimization%20strategy%20small%20business%20zero%20budget%20Google%20ranking%20organic%20traffic%20growth%20green%20charts%20arrows%20pointing%20up%20clean%20minimal%20white%20background%20professional%20Bulgarian%20business&width=1400&height=420&seq=bezplaten-seo-hero-img&orientation=landscape"
            alt="Безплатен SEO за номер 1 в Google"
            className="w-full h-full object-cover object-top"
          />
        </div>

        <div className="max-w-4xl mx-auto px-4 md:px-16 py-12 md:py-16">

          {/* ── ВЪВЕДЕНИЕ ── */}
          <section className="mb-14">
            <h2 className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              SEO не е задължително скъпо.
            </h2>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              <strong className="text-[#1C1C1E]">Sunrise Food</strong> достигнаха #1 в Google за „гъби кладница онлайн" за <strong className="text-[#1C1C1E]">3–4 седмици</strong> — без платени реклами, без хилядарки.
              Просто с правилна SEO оптимизация, Google Business Profile и LocalBusiness Schema.
            </p>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              Тук ще научите <strong className="text-[#1C1C1E]">8 безплатни SEO тактики</strong>, които можете да приложите днес — без разходи, без програмисти, без агенции.
              Някои отнемат 15 минути. Други — няколко часа. Всички са с доказан ефект.
            </p>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-6">
              Всеки един от тези примери е <strong className="text-[#1C1C1E]">верифицируем</strong> — отворете Google и потърсете ключовите думи.
              Ние не обещаваме — <Link to="/imash-nujnoto" className="text-[#0A2540] hover:underline">доказваме</Link>.
            </p>

            {/* Quick stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-2xl bg-[#F9F9F7] border border-[#1C1C1E]/6">
              {[
                { value: '0 €', label: 'общ разход' },
                { value: '3–4 сед.', label: 'до #1 за нишови думи' },
                { value: '+340%', label: 'органичен трафик' },
                { value: '8 тактики', label: 'безплатни стратегии' },
              ].map((s) => (
                <div key={s.value} className="text-center">
                  <div className="text-xl md:text-2xl font-light text-[#1C1C1E] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{s.value}</div>
                  <div className="text-[10px] text-[#1C1C1E]/65 leading-tight">{s.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ── 8 БЕЗПЛАТНИ ТАКТИКИ ── */}
          <section className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[1px] bg-[#1C1C1E]/20 shrink-0" />
              <span className="text-xs text-[#1C1C1E]/60">8 безплатни тактики</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Безплатен SEO — стъпка по стъпка.
            </h2>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-8">
              Всяка тактика е тествана на реални клиенти. Някои отнемат минути, други — часове. Всички са безплатни.
            </p>

            <div className="space-y-6">
              {FREE_TACTICS.map((tactic) => (
                <div key={tactic.num} className="rounded-2xl border border-[#1C1C1E]/8 overflow-hidden">
                  <div className="p-5 md:p-7 border-b border-[#1C1C1E]/6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 flex items-center justify-center rounded-xl shrink-0" style={{ backgroundColor: `${tactic.color}12` }}>
                        <i className={`${tactic.icon} text-xl`} style={{ color: tactic.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: `${tactic.color}12`, color: tactic.color }}>
                            {tactic.num}
                          </span>
                          <span className="text-[10px] text-[#1C1C1E]/70">{tactic.time}</span>
                        </div>
                        <h3 className="text-base font-medium text-[#1C1C1E] mb-1">{tactic.title}</h3>
                        <div className="flex items-center gap-2">
                          <i className="ri-bar-chart-2-line text-[10px]" style={{ color: tactic.color }} />
                          <span className="text-[10px] text-[#1C1C1E]/65">Ефект: {tactic.impact}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mt-4">{tactic.desc}</p>
                  </div>
                  <div className="p-5 md:p-7 bg-[#F9F9F7]">
                    <div className="space-y-2.5 mb-5">
                      {tactic.bullets.map((b) => (
                        <div key={b} className="flex items-start gap-2.5">
                          <div className="w-4 h-4 flex items-center justify-center rounded-full shrink-0 mt-0.5" style={{ backgroundColor: `${tactic.color}15`, border: `1px solid ${tactic.color}30` }}>
                            <i className="ri-check-line text-[9px]" style={{ color: tactic.color }} />
                          </div>
                          <span className="text-xs text-[#1C1C1E]/65 leading-relaxed">{b}</span>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 rounded-xl border" style={{ borderColor: `${tactic.color}20`, backgroundColor: `${tactic.color}06` }}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <i className="ri-bubble-chart-line text-[10px]" style={{ color: tactic.color }} />
                        <span className="text-[10px] font-medium tracking-wide uppercase" style={{ color: tactic.color }}>Реален резултат</span>
                      </div>
                      <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">
                        <strong className="text-[#1C1C1E]">{tactic.caseStudy.client}</strong> — {tactic.caseStudy.result}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── ТАЙМЛАЙН ── */}
          <section className="mb-14 p-6 md:p-8 rounded-2xl bg-[#F9F9F7] border border-[#1C1C1E]/6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[1px] bg-[#1C1C1E]/20 shrink-0" />
              <span className="text-xs text-[#1C1C1E]/60">Реалистичен план</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Колко бързо виждате резултати?
            </h2>

            <div className="space-y-4">
              {TIMELINE.map((item) => (
                <div key={item.week} className="flex items-start gap-4">
                  <div className="w-16 shrink-0 text-right">
                    <span className="text-xs font-medium text-[#1C1C1E]/65">{item.week}</span>
                  </div>
                  <div className="w-px h-8 bg-[#1C1C1E]/10 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-[#1C1C1E] mb-0.5">{item.action}</div>
                    <div className="flex items-center gap-3 text-[10px] text-[#1C1C1E]/65">
                      <span>Разход: {item.cost}</span>
                      <span>·</span>
                      <span>Резултат: {item.result}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── КОГАТО БЕЗПЛАТНОТО НЕ Е ДОСТАТЪЧНО ── */}
          <section className="mb-14 p-6 md:p-8 rounded-2xl border border-[#1C1C1E]/8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#0A2540]/8">
                <i className="ri-alert-line text-sm text-[#0A2540]" />
              </div>
              <h3 className="text-base font-medium text-[#1C1C1E]">Кога безплатното SEO не е достатъчно?</h3>
            </div>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              Безплатните тактики са мощни за <strong className="text-[#1C1C1E]">нишови ключови думи</strong> — например „гъби кладница онлайн" или „корейска храна велико търново".
              Но за <strong className="text-[#1C1C1E]">висококонкурентни думи</strong> като „ресторант Търново" или „SEO агенция Търново" са нужни и платени стратегии.
            </p>
            <div className="space-y-3 mb-5">
              {[
                { label: 'Безплатен SEO е достатъчен:', items: ['Нишови продукти', 'Локални услуги', 'Дълги ключови думи (long-tail)', 'Нови бизнеси'] },
                { label: 'Нужни са платени стратегии:', items: ['Висококонкурентни думи', 'Национален ранк', 'Бързи резултати (1–2 седмици)', 'Индустрии с много конкуренция'] },
              ].map((group) => (
                <div key={group.label}>
                  <div className="text-xs font-medium text-[#1C1C1E] mb-1.5">{group.label}</div>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <span key={item} className="text-[10px] px-2.5 py-1 rounded-full bg-[#F9F9F7] border border-[#1C1C1E]/8 text-[#1C1C1E]/65">{item}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <Link to="/seo-veliko-tarnovo" className="inline-flex items-center gap-2 text-sm text-[#0A2540] font-medium hover:underline cursor-pointer">
              Професионален SEO пакет от 390 €
              <i className="ri-arrow-right-line text-xs" />
            </Link>
          </section>

          {/* ── FAQ ── */}
          <section className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[1px] bg-[#1C1C1E]/20 shrink-0" />
              <span className="text-xs text-[#1C1C1E]/60">Въпроси и отговори</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Чести въпроси за безплатен SEO.
            </h2>

            <div className="space-y-2">
              {FAQ_ITEMS.map((item, i) => (
                <div key={item.q} className="rounded-2xl border border-[#1C1C1E]/8 overflow-hidden">
                  <button
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer hover:bg-[#F9F9F7] transition-colors"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span className="text-sm font-medium text-[#1C1C1E]">{item.q}</span>
                    <i className={`text-[#1C1C1E]/65 text-base shrink-0 transition-transform duration-200 ${openFaq === i ? 'ri-subtract-line' : 'ri-add-line'}`} />
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-4 bg-[#F9F9F7]">
                      <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">{item.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ── СВЪРЗАНИ СТАТИИ ── */}
          <section className="mb-14 pt-10 border-t border-[#1C1C1E]/6">
            <div className="text-xs text-[#1C1C1E]/60 mb-5">Свързани статии и услуги</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {RELATED.map((r) => (
                <Link key={r.to} to={r.to} className="group flex items-center justify-between gap-3 p-4 rounded-xl border border-[#1C1C1E]/8 hover:border-[#0A2540]/20 transition-all cursor-pointer">
                  <div>
                    <div className={`text-[10px] mb-1 ${r.color}`}>{r.cat}</div>
                    <div className="text-xs font-medium text-[#1C1C1E] group-hover:text-[#0A2540] transition-colors leading-snug">{r.title}</div>
                  </div>
                  <i className="ri-arrow-right-line text-[#1C1C1E]/25 text-sm shrink-0 group-hover:translate-x-1 transition-transform" />
                </Link>
              ))}
            </div>
          </section>

          {/* ── CTA ── */}
          <div className="p-7 md:p-10 rounded-2xl bg-[#0F1F35] text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="text-xs text-white/75 tracking-widest uppercase mb-2">Готови ли сте за номер 1?</div>
                <div className="text-2xl md:text-3xl font-light leading-tight mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Безплатен SEO + професионално
                  <br />
                  <span className="italic text-white/60">= номер 1 в Google.</span>
                </div>
                <p className="text-sm text-white/75 max-w-md leading-relaxed">
                  Консултация 50 € — анализ на сайта ви, стратегия и план. Приспада се при договор.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <Link to="/kontakt" className="px-7 py-3.5 bg-white text-[#0A2540] text-sm rounded-full hover:bg-white/90 transition-all cursor-pointer whitespace-nowrap text-center font-medium">
                  Поискайте оферта →
                </Link>
                <Link to="/seo-veliko-tarnovo" className="px-7 py-3.5 border border-white/20 text-white/70 text-sm rounded-full hover:border-white/40 hover:text-white transition-all cursor-pointer whitespace-nowrap text-center">
                  SEO услуга Търново
                </Link>
              </div>
            </div>
          </div>

          {/* Author */}
          <div className="flex items-start gap-4 pt-10 border-t border-[#1C1C1E]/8 mt-12">
            <div className="w-12 h-12 rounded-full bg-[#0A2540]/8 flex items-center justify-center shrink-0">
              <i className="ri-user-line text-[#0A2540]/65 text-lg" />
            </div>
            <div>
              <div className="text-sm font-medium text-[#1C1C1E] mb-0.5">Владимир Атанасов</div>
              <div className="text-xs text-[#1C1C1E]/65 mb-2">Основател, ТАВОРА ЕООД · Велико Търново</div>
              <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">
                Дигитален маркетинг специалист с опит в SEO, реклами и видео продукция за бизнеси от Велико Търново и цяла България.
              </p>
            </div>
          </div>
        </div>
      </main>

      <SharedFooter />
    </div>
  );
}