import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SharedNav from '@/components/feature/SharedNav';
import SharedFooter from '@/components/feature/SharedFooter';

const FAQ_ITEMS = [
  {
    q: 'Колко струва SEO оптимизация в Търново за 2026?',
    a: 'ТАВОРА ЕООД предлага SEO оптимизация за Велико Търново от 390 € еднократно. Включва технически одит, on-page оптимизация, Google Business Profile, GEO за AI търсачки и 3 месеца мониторинг. Месечно SEO поддържане — от 190 € / месец.',
  },
  {
    q: 'Колко бързо се класира сайт в Google в Търново?',
    a: 'За нишови ключови думи с ниска конкуренция — 3–4 седмици (Sunrise Food: #1 за „гъби кладница онлайн" за 3 седмици). За по-конкурентни думи като „ресторант Велико Търново" — 2–4 месеца. Всички резултати са верифицируеми.',
  },
  {
    q: 'Какво е разликата между SEO и GEO оптимизация?',
    a: 'SEO е оптимизация за Google и Bing. GEO (Generative Engine Optimization) е оптимизация за AI търсачки — ChatGPT, Perplexity, Gemini, Google AI Overview. В 2026 трябва и двете. ТАВОРА ЕООД прави и двете в един пакет.',
  },
  {
    q: 'Нужен ли ми е нов сайт за SEO оптимизация?',
    a: 'Не задължително. Оптимизираме съществуващи сайтове. Ако сайтът е много стар или бавен (Core Web Vitals под 50), препоръчваме нов — от 999 €. Но в повечето случаи оптимизираме съществуващия.',
  },
  {
    q: 'Правите ли SEO само за Велико Търново?',
    a: 'Специализираме се в Велико Търново и Търновска област, но работим с бизнеси от цяла България. Имаме клиенти от София, Пловдив, Варна и малки градове. Локалното SEO за Търново е нашата специалност.',
  },
  {
    q: 'Как да проверя дали SEO работи?',
    a: 'Google Search Console показва позициите ви безплатно. Ние предоставяме месечни отчети с позиции, трафик и конверсии. Всяка #1 позиция е проверима — отворете Google и потърсете ключовата дума.',
  },
  {
    q: 'Включва ли SEO пакетът Google Business Profile?',
    a: 'Да — Google Business Profile оптимизацията е включена в SEO пакета. Настройваме категории, описание, снимки, отговаряме на отзиви и добавяме локални ключови думи. GBP е критичен за локален ранк в Търново.',
  },
];

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
      '@id': 'https://imashnujnoto.com/blog/seo-optimizaciya-tarnovo-2026#article',
      headline: 'SEO оптимизация Велико Търново 2026: пълно ръководство',
      description: 'Пълно ръководство за SEO оптимизация в Търново за 2026 — технически SEO, GEO за AI търсачки, LocalBusiness Schema, case studies с реални резултати. ТАВОРА ЕООД.',
      url: 'https://imashnujnoto.com/blog/seo-optimizaciya-tarnovo-2026',
      datePublished: '2026-04-28',
      dateModified: new Date().toISOString().split('T')[0],
      inLanguage: 'bg',
      wordCount: 3200,
      timeRequired: 'PT12M',
      keywords: [
        'SEO оптимизация Велико Търново',
        'SEO Търново 2026',
        'GEO оптимизация',
        'LocalBusiness Schema',
        'дигитален маркетинг Търново',
        'Google Business Profile Търново',
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
        url: 'https://readdy.ai/api/search-image?query=SEO%20optimization%202026%20Veliko%20Tarnovo%20Bulgaria%20search%20engine%20ranking%20Google%20first%20page%20analytics%20dashboard%20professional%20clean%20minimal%20white%20background&width=1200&height=630&seq=seo-2026-hero&orientation=landscape',
        width: 1200,
        height: 630,
      },
      isPartOf: { '@id': 'https://imashnujnoto.com/#website' },
      about: [
        { '@type': 'Thing', name: 'SEO оптимизация' },
        { '@type': 'Thing', name: 'GEO оптимизация' },
        { '@type': 'Place', name: 'Велико Търново' },
      ],
      mentions: [
        { '@type': 'Organization', name: 'ТАВОРА ЕООД', url: 'https://imashnujnoto.com' },
        { '@type': 'Organization', name: 'K-Food Велико Търново', url: 'https://k-foodvelikotarnovo.com/' },
        { '@type': 'Organization', name: 'Sunrise Food', url: 'https://sunrisefood.eu/' },
      ],
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Начало', item: 'https://imashnujnoto.com/' },
          { '@type': 'ListItem', position: 2, name: 'Блог', item: 'https://imashnujnoto.com/blog' },
          { '@type': 'ListItem', position: 3, name: 'SEO оптимизация Велико Търново 2026', item: 'https://imashnujnoto.com/blog/seo-optimizaciya-tarnovo-2026' },
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
              name: 'SEO оптимизация Велико Търново',
              url: 'https://imashnujnoto.com/seo-veliko-tarnovo',
              description: 'Технически SEO одит, on-page оптимизация, GEO за AI търсачки, Google Business Profile.',
            },
            priceSpecification: {
              '@type': 'PriceSpecification',
              price: '390',
              priceCurrency: 'EUR',
            },
          },
        ],
      },
    },
  ],
};

const CASE_STUDIES = [
  {
    client: 'K-Food Велико Търново',
    industry: 'Ресторант / Хранителни стоки',
    keyword: 'корейска храна велико търново',
    result: '#1 Google + ChatGPT',
    time: '2–3 месеца',
    traffic: '+340%',
    url: 'https://k-foodvelikotarnovo.com/',
    color: '#2F9E44',
    steps: [
      'Технически SEO одит — открити 47 грешки',
      'On-page оптимизация на 12 ключови страници',
      'Google Business Profile — пълна оптимизация',
      'GEO оптимизация — ChatGPT вече препоръчва K-Food',
      'LocalBusiness Schema с пълни данни',
    ],
  },
  {
    client: 'Sunrise Food',
    industry: 'Онлайн магазин / Гъби',
    keyword: 'гъби кладница онлайн',
    result: '#1 Google',
    time: '3–4 седмици',
    traffic: '+180%',
    url: 'https://sunrisefood.eu/',
    color: '#E67700',
    steps: [
      'Анализ на конкурентите — 0 оптимизирани конкуренти',
      'Product Schema за всеки продукт',
      'Оптимизация на заглавия и мета описания',
      'Вътрешно свързване — 23 нови вътрешни линка',
      'Sitemap обновяване и Google Search Console',
    ],
  },
];

const SEO_CHECKLIST = [
  {
    category: 'Технически SEO',
    icon: 'ri-settings-3-line',
    color: '#3B5BDB',
    items: [
      { label: 'Core Web Vitals 90+', desc: 'LCP под 2.5s, FID под 100ms, CLS под 0.1' },
      { label: 'HTTPS + SSL', desc: 'Задължително за Google ранк' },
      { label: 'Mobile-first индексиране', desc: 'Сайтът трябва да е перфектен на мобилно' },
      { label: 'Sitemap.xml', desc: 'Всички URL-и с правилни приоритети' },
      { label: 'Robots.txt', desc: 'Правилно конфигуриран — без блокирани ресурси' },
      { label: 'Canonical тагове', desc: 'Без дублирано съдържание' },
    ],
  },
  {
    category: 'On-Page SEO',
    icon: 'ri-file-text-line',
    color: '#2F9E44',
    items: [
      { label: 'H1 с ключова дума', desc: 'Само един H1 на страница, с основната ключова дума' },
      { label: 'Meta title 50–60 символа', desc: 'Ключова дума + локация + бранд' },
      { label: 'Meta description 120–160 символа', desc: 'Включва ключова дума и CTA' },
      { label: 'Alt текст на изображенията', desc: 'Описателен alt с ключова дума' },
      { label: 'Вътрешно свързване', desc: 'Минимум 3–5 вътрешни линка на страница' },
      { label: 'Ключова дума в URL', desc: 'Кратък, описателен URL с ключова дума' },
    ],
  },
  {
    category: 'LocalBusiness Schema',
    icon: 'ri-map-pin-line',
    color: '#C2255C',
    items: [
      { label: 'LocalBusiness Schema', desc: 'Пълни данни — адрес, телефон, работно време' },
      { label: 'GeoCoordinates', desc: 'Точни координати на бизнеса' },
      { label: 'OpeningHoursSpecification', desc: 'Работно време за всеки ден' },
      { label: 'areaServed', desc: 'Обслужвани градове и области' },
      { label: 'hasOfferCatalog', desc: 'Всички услуги с цени в Schema' },
      { label: 'sameAs', desc: 'Линкове към Facebook, Instagram, LinkedIn' },
    ],
  },
  {
    category: 'GEO за AI търсачки',
    icon: 'ri-robot-line',
    color: '#7048E8',
    items: [
      { label: 'Entity statements', desc: '"ТАВОРА ЕООД е дигитален маркетинг агенция в Търново"' },
      { label: 'FAQPage Schema', desc: 'Отговори на въпроси, които AI системите четат' },
      { label: 'Person Schema', desc: 'Авторитет на основателя — knowsAbout' },
      { label: 'WebSite Schema + SearchAction', desc: 'Критично за AI индексиране' },
      { label: 'Mentions в статии', desc: 'Споменаване на бранда в контекст' },
      { label: 'About секция', desc: 'Ясни entity statements на главната страница' },
    ],
  },
];

const RELATED = [
  { title: 'SEO оптимизация Велико Търново', to: '/seo-veliko-tarnovo', cat: 'Услуга' },
  { title: 'Дигитален маркетинг Велико Търново', to: '/digitalen-marketing-veliko-tarnovo', cat: 'Ръководство' },
  { title: 'Google Business Profile — задължително за Търново', to: '/blog/google-business-vt', cat: 'Статия' },
  { title: 'GEO оптимизация — ChatGPT и Perplexity', to: '/blog/geo-ai-tarnovo', cat: 'Статия' },
  { title: 'Изработка на сайт Велико Търново', to: '/blog/izrabotka-na-sait-vt', cat: 'Статия' },
];

export default function SeoOptimizaciyaTarnovo2026Page() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    document.title = 'SEO оптимизация Велико Търново 2026: пълно ръководство | ТАВОРА ЕООД';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', 'SEO оптимизация Велико Търново 2026 — пълно ръководство. Технически SEO, GEO за AI търсачки, LocalBusiness Schema, case studies с реални резултати. ТАВОРА ЕООД.');
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://imashnujnoto.com/blog/seo-optimizaciya-tarnovo-2026');

    const id = 'schema-seo-2026';
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) { el = document.createElement('script'); el.id = id; el.type = 'application/ld+json'; document.head.appendChild(el); }
    el.textContent = JSON.stringify(ARTICLE_SCHEMA);

    const faqId = 'schema-seo-2026-faq';
    let faqEl = document.getElementById(faqId) as HTMLScriptElement | null;
    if (!faqEl) { faqEl = document.createElement('script'); faqEl.id = faqId; faqEl.type = 'application/ld+json'; document.head.appendChild(faqEl); }
    faqEl.textContent = JSON.stringify(FAQ_SCHEMA);

    return () => {
      ['schema-seo-2026', 'schema-seo-2026-faq'].forEach((sid) => { const e = document.getElementById(sid); if (e) e.remove(); });
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
              <span className="text-[#1C1C1E]/65">SEO оптимизация Търново 2026</span>
            </nav>

            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span className="text-[10px] px-2.5 py-1 rounded-full font-medium bg-sky-50 text-sky-700">SEO</span>
              <span className="text-[10px] px-2.5 py-1 rounded-full font-medium bg-violet-50 text-violet-700">GEO & AI</span>
              <span className="text-[10px] px-2.5 py-1 rounded-full font-medium bg-emerald-50 text-emerald-700">Локално SEO</span>
              <span className="text-[10px] text-[#1C1C1E]/70">12 мин. четене · 28 Апр 2026</span>
            </div>

            <h1
              className="text-3xl md:text-5xl font-light text-[#1C1C1E] leading-tight mb-5"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              <strong className="font-light">SEO оптимизация</strong>
              <br />
              <em className="text-[#1C1C1E]/60">Велико Търново 2026:</em>
              <br />
              пълно ръководство
            </h1>

            <p className="text-sm md:text-base text-[#1C1C1E]/65 max-w-2xl leading-relaxed mb-6">
              Как да класирате бизнеса си на <strong className="text-[#1C1C1E]">#1 в Google</strong> за Велико Търново в 2026.
              Технически SEO, GEO за AI търсачки, LocalBusiness Schema и реални case studies с верифицируеми резултати.
              Написано от <Link to="/ekip" className="text-[#0A2540] hover:underline">Владимир Атанасов</Link>, ТАВОРА ЕООД.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/seo-veliko-tarnovo"
                className="px-6 py-3 bg-[#1C1C1E] text-white text-sm rounded-full hover:bg-[#1C1C1E]/80 transition-all cursor-pointer whitespace-nowrap"
              >
                SEO услуга Търново →
              </Link>
              <Link
                to="/kontakt"
                className="px-6 py-3 border border-[#1C1C1E]/12 text-[#1C1C1E]/65 text-sm rounded-full hover:border-[#1C1C1E]/30 hover:text-[#1C1C1E] transition-all cursor-pointer whitespace-nowrap"
              >
                Безплатна консултация
              </Link>
            </div>
          </div>
        </section>

        {/* ── HERO IMAGE ── */}
        <div className="w-full h-[280px] md:h-[420px] overflow-hidden">
          <img
            src="https://readdy.ai/api/search-image?query=SEO%20optimization%202026%20Veliko%20Tarnovo%20Bulgaria%20search%20engine%20ranking%20Google%20analytics%20dashboard%20professional%20workspace%20clean%20minimal%20white%20background%20charts%20data&width=1400&height=420&seq=seo-2026-hero-img&orientation=landscape"
            alt="SEO оптимизация Велико Търново 2026"
            className="w-full h-full object-cover object-top"
          />
        </div>

        <div className="max-w-4xl mx-auto px-4 md:px-16 py-12 md:py-16">

          {/* ── ВЪВЕДЕНИЕ ── */}
          <section className="mb-14">
            <h2
              className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-5"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Защо SEO в Търново е различно в 2026?
            </h2>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              <strong className="text-[#1C1C1E]">SEO оптимизацията в Търново</strong> се промени фундаментално.
              Вече не е достатъчно да сте на първа страница в Google — трябва да сте и в отговорите на ChatGPT,
              Perplexity и Google AI Overview. Когато някой пита AI „коя е най-добрата маркетинг агенция в Търново",
              вашият бизнес трябва да е в отговора.
            </p>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              В Търново конкуренцията в дигиталното пространство расте. Ресторанти, хотели, услуги, магазини —
              всички се борят за вниманието на клиентите. Но повечето бизнеси в Търново все още нямат
              <strong className="text-[#1C1C1E]"> правилна SEO оптимизация</strong> — което е вашата възможност.
            </p>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-6">
              Това ръководство е написано от <Link to="/ekip" className="text-[#0A2540] hover:underline">Владимир Атанасов</Link> от
              <Link to="/" className="text-[#0A2540] hover:underline"> ТАВОРА ЕООД</Link> — агенция за
              <Link to="/digitalen-marketing-veliko-tarnovo" className="text-[#0A2540] hover:underline"> дигитален маркетинг в Търново</Link>.
              Всичко тук е тествано на реални клиенти с верифицируеми резултати.
            </p>

            {/* Quick stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-2xl bg-[#F9F9F7] border border-[#1C1C1E]/6">
              {[
                { value: '3–4 сед.', label: 'до #1 за нишови думи' },
                { value: '90%', label: 'не отиват на стр. 2' },
                { value: '+50%', label: 'ръст на локалното търсене' },
                { value: '2026', label: 'GEO е задължително' },
              ].map((s) => (
                <div key={s.value} className="text-center">
                  <div className="text-xl md:text-2xl font-light text-[#1C1C1E] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {s.value}
                  </div>
                  <div className="text-[10px] text-[#1C1C1E]/65 leading-tight">{s.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ── CASE STUDIES ── */}
          <section className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[1px] bg-[#1C1C1E]/20 shrink-0" />
              <span className="text-xs text-[#1C1C1E]/60">Реални резултати</span>
            </div>
            <h2
              className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-3"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Case studies — верифицируеми #1 позиции
            </h2>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-8">
              Не обещаваме — доказваме. Отворете Google и потърсете ключовите думи по-долу.
              Всяка позиция е реална и проверима.
            </p>

            <div className="space-y-6">
              {CASE_STUDIES.map((cs) => (
                <div key={cs.client} className="rounded-2xl border border-[#1C1C1E]/8 overflow-hidden">
                  <div className="p-5 md:p-7 border-b border-[#1C1C1E]/6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      <div>
                        <a
                          href={cs.url}
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                          className="text-base font-medium text-[#1C1C1E] hover:underline"
                        >
                          {cs.client}
                        </a>
                        <div className="text-xs text-[#1C1C1E]/65 mt-0.5">{cs.industry}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className="text-xs px-3 py-1 rounded-full font-medium"
                          style={{ backgroundColor: `${cs.color}15`, color: cs.color }}
                        >
                          {cs.result}
                        </span>
                        <span className="text-xs text-[#1C1C1E]/65">{cs.time}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <i className="ri-search-line text-[#1C1C1E]/25 text-xs" />
                      <span className="text-xs text-[#1C1C1E]/65 italic">Ключова дума: „{cs.keyword}"</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <i className="ri-line-chart-line text-xs" style={{ color: cs.color }} />
                      <span className="text-xs font-medium" style={{ color: cs.color }}>Органичен трафик: {cs.traffic}</span>
                    </div>
                  </div>
                  <div className="p-5 md:p-7 bg-[#F9F9F7]">
                    <div className="text-xs font-medium text-[#1C1C1E]/65 mb-3 tracking-wide uppercase">Какво направихме:</div>
                    <div className="space-y-2">
                      {cs.steps.map((step, i) => (
                        <div key={step} className="flex items-start gap-2.5">
                          <span
                            className="text-[10px] font-medium shrink-0 w-5 mt-0.5"
                            style={{ color: cs.color }}
                          >
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span className="text-xs text-[#1C1C1E]/65 leading-relaxed">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── SEO CHECKLIST ── */}
          <section className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[1px] bg-[#1C1C1E]/20 shrink-0" />
              <span className="text-xs text-[#1C1C1E]/60">Пълен чеклист</span>
            </div>
            <h2
              className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-3"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              SEO чеклист за Търново 2026 —
              <br />
              <em className="text-[#1C1C1E]/65">всичко което трябва.</em>
            </h2>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-8">
              Пълен чеклист за <strong className="text-[#1C1C1E]">SEO оптимизация в Търново</strong> — технически SEO,
              on-page, LocalBusiness Schema и GEO за AI търсачки. Проверете кое имате и кое липсва.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {SEO_CHECKLIST.map((cat) => (
                <div key={cat.category} className="rounded-2xl border border-[#1C1C1E]/8 overflow-hidden">
                  <div className="px-5 py-4 border-b border-[#1C1C1E]/6 flex items-center gap-3">
                    <div
                      className="w-8 h-8 flex items-center justify-center rounded-xl"
                      style={{ backgroundColor: `${cat.color}15` }}
                    >
                      <i className={`${cat.icon} text-sm`} style={{ color: cat.color }} />
                    </div>
                    <span className="text-sm font-medium text-[#1C1C1E]">{cat.category}</span>
                  </div>
                  <div className="p-5 space-y-3">
                    {cat.items.map((item) => (
                      <div key={item.label} className="flex items-start gap-2.5">
                        <div
                          className="w-4 h-4 flex items-center justify-center rounded-full shrink-0 mt-0.5"
                          style={{ backgroundColor: `${cat.color}15`, border: `1px solid ${cat.color}30` }}
                        >
                          <i className="ri-check-line text-[9px]" style={{ color: cat.color }} />
                        </div>
                        <div>
                          <div className="text-xs font-medium text-[#1C1C1E]">{item.label}</div>
                          <div className="text-[11px] text-[#1C1C1E]/65 leading-relaxed">{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── LOCALBUSINESS SCHEMA ОБЯСНЕНИЕ ── */}
          <section className="mb-14 p-6 md:p-8 rounded-2xl bg-[#F9F9F7] border border-[#1C1C1E]/6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#C2255C]/10">
                <i className="ri-code-s-slash-line text-sm text-[#C2255C]" />
              </div>
              <h3 className="text-base font-medium text-[#1C1C1E]">LocalBusiness Schema — защо е критична за Търново?</h3>
            </div>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              <strong className="text-[#1C1C1E]">LocalBusiness Schema</strong> е структурирани данни, които казват на Google
              и AI системите точно кой сте, какво правите и къде се намирате. За бизнеси в Търново е задължителна.
            </p>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              Без LocalBusiness Schema Google не знае дали сте в Търново или в Токио. С правилна Schema —
              появявате се в Google Maps, Local Pack (3-те бизнеса в картата) и AI отговорите.
            </p>
            <div className="space-y-2 mb-5">
              {[
                'Адрес, телефон, работно време — задължителни полета',
                'GeoCoordinates — точни координати за Google Maps',
                'areaServed — Велико Търново, Търновска област, България',
                'hasOfferCatalog — всички услуги с цени',
                'openingHoursSpecification — работно време по дни',
                'sameAs — Facebook, Instagram, LinkedIn профили',
              ].map((item) => (
                <div key={item} className="flex items-start gap-2.5">
                  <div className="w-4 h-4 flex items-center justify-center rounded-full border border-[#C2255C]/30 shrink-0 mt-0.5">
                    <i className="ri-check-line text-[9px] text-[#C2255C]" />
                  </div>
                  <span className="text-xs text-[#1C1C1E]/65 leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
            <Link
              to="/uslugi/seo-geo"
              className="inline-flex items-center gap-2 text-sm text-[#C2255C] font-medium hover:underline cursor-pointer"
            >
              Вижте нашия SEO & GEO пакет
              <i className="ri-arrow-right-line text-xs" />
            </Link>
          </section>

          {/* ── GEO СЕКЦИЯ ── */}
          <section className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[1px] bg-[#1C1C1E]/20 shrink-0" />
              <span className="text-xs text-[#1C1C1E]/60">GEO оптимизация 2026</span>
            </div>
            <h2
              className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-4"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              GEO — оптимизация за ChatGPT
              <br />
              <em className="text-[#1C1C1E]/65">и AI търсачките.</em>
            </h2>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              <strong className="text-[#1C1C1E]">GEO (Generative Engine Optimization)</strong> е новото SEO.
              Когато някой пита ChatGPT „коя е най-добрата маркетинг агенция в Търново" —
              AI системата трябва да знае за вашия бизнес. Това не се случва автоматично.
            </p>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-6">
              За GEO оптимизация в Търново са нужни: entity statements, FAQPage Schema, Person Schema,
              WebSite Schema с SearchAction и About секция с ясни твърдения за бизнеса.
              Прочетете пълното ни ръководство за <Link to="/blog/geo-ai-tarnovo" className="text-[#0A2540] hover:underline">GEO оптимизация за ChatGPT и Perplexity</Link>.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: 'ri-chat-ai-line', title: 'ChatGPT препоръки', desc: 'Когато AI отговаря на въпроси за Търново, вашият бизнес трябва да е в отговора.', color: '#2F9E44' },
                { icon: 'ri-search-eye-line', title: 'Perplexity & Gemini', desc: 'AI търсачките четат Schema.org данни и entity statements — не просто текст.', color: '#7048E8' },
                { icon: 'ri-google-line', title: 'Google AI Overview', desc: 'Google AI Overview показва отговори преди резултатите — трябва да сте там.', color: '#E67700' },
                { icon: 'ri-shield-star-line', title: 'Авторитет на бранда', desc: 'Person Schema за основателя + mentions в статии = авторитет в AI системите.', color: '#C2255C' },
              ].map((item) => (
                <div key={item.title} className="p-5 rounded-2xl border border-[#1C1C1E]/8 bg-white">
                  <div className="w-9 h-9 flex items-center justify-center rounded-xl mb-3" style={{ backgroundColor: `${item.color}12` }}>
                    <i className={`${item.icon} text-base`} style={{ color: item.color }} />
                  </div>
                  <h4 className="text-sm font-medium text-[#1C1C1E] mb-1.5">{item.title}</h4>
                  <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── СТЪПКИ ── */}
          <section className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[1px] bg-[#1C1C1E]/20 shrink-0" />
              <span className="text-xs text-[#1C1C1E]/60">Как работим</span>
            </div>
            <h2
              className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-8"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              5 стъпки за SEO #1 в Търново
            </h2>

            <div className="space-y-4">
              {[
                {
                  step: '01',
                  title: 'Технически SEO одит',
                  desc: 'Анализираме сайта ви — Core Web Vitals, грешки в индексирането, дублирано съдържание, бавни страници. Намираме всичко, което пречи на Google да ви класира.',
                  time: '1–2 дни',
                  color: '#3B5BDB',
                },
                {
                  step: '02',
                  title: 'Анализ на конкурентите в Търново',
                  desc: 'Кои бизнеси са #1 за вашите ключови думи? Какво правят правилно? Намираме пропуските и ги използваме.',
                  time: '1 ден',
                  color: '#2F9E44',
                },
                {
                  step: '03',
                  title: 'On-page оптимизация',
                  desc: 'Оптимизираме заглавия, мета описания, H1-H6, alt текстове, вътрешно свързване. Добавяме LocalBusiness Schema с пълни данни за Търново.',
                  time: '3–5 дни',
                  color: '#E67700',
                },
                {
                  step: '04',
                  title: 'Google Business Profile + GEO',
                  desc: 'Оптимизираме GBP — снимки, описание, категории, отговори на отзиви. Добавяме GEO оптимизация за ChatGPT, Perplexity и Gemini.',
                  time: '2–3 дни',
                  color: '#C2255C',
                },
                {
                  step: '05',
                  title: 'Мониторинг и отчети',
                  desc: 'Месечни отчети с позиции, трафик и конверсии. Google Search Console + Analytics. Следим резултатите и правим корекции.',
                  time: 'Месечно',
                  color: '#7048E8',
                },
              ].map((s) => (
                <div key={s.step} className="flex items-start gap-4 p-5 rounded-2xl border border-[#1C1C1E]/8 bg-white">
                  <span
                    className="text-2xl font-light shrink-0 leading-none"
                    style={{ fontFamily: "'Cormorant Garamond', serif", color: `${s.color}60` }}
                  >
                    {s.step}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-3 mb-1.5">
                      <h4 className="text-sm font-medium text-[#1C1C1E]">{s.title}</h4>
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full shrink-0"
                        style={{ backgroundColor: `${s.color}12`, color: s.color }}
                      >
                        {s.time}
                      </span>
                    </div>
                    <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── FAQ ── */}
          <section className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[1px] bg-[#1C1C1E]/20 shrink-0" />
              <span className="text-xs text-[#1C1C1E]/60">Въпроси и отговори</span>
            </div>
            <h2
              className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-8"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              SEO оптимизация Търново 2026 —
              <br />
              <em className="text-[#1C1C1E]/65">честни отговори.</em>
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
                <Link
                  key={r.to}
                  to={r.to}
                  className="group flex items-center justify-between gap-3 p-4 rounded-xl border border-[#1C1C1E]/8 hover:border-[#0A2540]/20 transition-all cursor-pointer"
                >
                  <div>
                    <div className="text-[10px] text-[#1C1C1E]/70 mb-1">{r.cat}</div>
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
                <div className="text-xs text-white/75 tracking-widest uppercase mb-2">Готови за #1 в Търново?</div>
                <div
                  className="text-2xl md:text-3xl font-light leading-tight mb-2"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  SEO оптимизация Велико Търново
                  <br />
                  <span className="italic text-white/60">от 390 € — с гаранция.</span>
                </div>
                <p className="text-sm text-white/75 max-w-md leading-relaxed">
                  Консултация 50 € — анализ на конкурентите ви, стратегия и план. Приспада се при договор.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <Link
                  to="/kontakt"
                  className="px-7 py-3.5 bg-white text-[#0A2540] text-sm rounded-full hover:bg-white/90 transition-all cursor-pointer whitespace-nowrap text-center font-medium"
                >
                  Поискайте оферта →
                </Link>
                <Link
                  to="/seo-veliko-tarnovo"
                  className="px-7 py-3.5 border border-white/20 text-white/70 text-sm rounded-full hover:border-white/40 hover:text-white transition-all cursor-pointer whitespace-nowrap text-center"
                >
                  SEO услуга Търново
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SharedFooter />
    </div>
  );
}
