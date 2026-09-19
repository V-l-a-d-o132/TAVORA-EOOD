import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SharedNav from '@/components/feature/SharedNav';
import SharedFooter from '@/components/feature/SharedFooter';

const FAQ_ITEMS = [
  {
    q: 'Колко струва дигиталният маркетинг за бизнес в Търново?',
    a: 'Зависи от услугата. SEO оптимизация — 390 € еднократно. Рекламни кампании (Meta, Google, TikTok) — от 290 € на месец. Изработка на сайт — от 999 €. Видео продукция — от 290 €. Консултацията е 50 € и се приспада при договор.',
  },
  {
    q: 'Коя е най-модерната маркетинг агенция в Търново?',
    a: 'ТАВОРА ЕООД работи с бизнеси от Велико Търново и Търновска област. Резултатите ни са верифицируеми — K-Food Велико Търново е #1 в Google и ChatGPT, Sunrise Food достигна #1 за 3–4 седмици. Проверете сами.',
  },
  {
    q: 'Колко бързо ще видя резултати от SEO в Търново?',
    a: 'За нишови ключови думи — 3–4 седмици. За по-конкурентни — 2–3 месеца. Всички резултати са верифицируеми с URL адреси.',
  },
  {
    q: 'Правите ли реклами само за Велико Търново?',
    a: 'Не — работим с бизнеси от цяла България. Специализираме се в Велико Търново и Търновска област, но управляваме кампании и за клиенти от цялата страна.',
  },
  {
    q: 'Какво е GEO оптимизация и защо е важна за Търново?',
    a: 'GEO (Generative Engine Optimization) е оптимизация за AI търсачки — ChatGPT, Perplexity, Gemini. Когато някой пита AI „кой е най-добрият маркетинг специалист в Търново" — вашият бизнес трябва да е в отговора. Включена е в нашия SEO пакет.',
  },
  {
    q: 'Има ли гаранция за резултати?',
    a: 'Гарантираме качеството на работата. Всяка услуга (без консултацията от 50 €) идва с гаранция за връщане на парите. Ако не сте доволни, връщаме сумата без въпроси.',
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

const HOWTO_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Как да изберете дигитална маркетинг агенция във Велико Търново',
  description: 'Стъпка по стъпка ръководство за избор на правилната маркетинг агенция за вашия бизнес във Велико Търново.',
  image: 'https://imashnujnoto.com/og-home.jpg',
  totalTime: 'PT2H',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Определете нуждите си',
      text: 'Запишете какво точно търсите — SEO оптимизация, рекламни кампании, изработка на сайт или видео продукция. Ясните цели улесняват избора.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Проверете реални резултати',
      text: 'Поискайте от агенцията конкретни примери. Отворете Google и потърсете ключовите думи, които твърдят, че са класирали. Ако не можете да проверите резултатите — не работете с тях.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Сравнете цените и прозрачността',
      text: 'Добрата агенция няма скрити такси. Всички цени трябва да са ясни — SEO (390 €), реклами (290 €/мес.), сайт (999 €). Поискайте пълен достъп до акаунтите.',
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Проверете дали разбират локалния пазар',
      text: 'Агенция от София може да не познава конкурентите ви в Търново. Изберете такава, която знае местния пазар, аудиторията и конкуренцията.',
    },
    {
      '@type': 'HowToStep',
      position: 5,
      name: 'Гаранция и договор',
      text: 'Всяка професионална услуга трябва да има гаранция. При ТАВОРА ЕООД всяка услуга идва с възможност за връщане на сумата.',
    },
  ],
  supply: [
    { '@type': 'HowToSupply', name: 'Ясни бизнес цели' },
    { '@type': 'HowToSupply', name: 'Бюджет за маркетинг' },
  ],
  tool: [
    { '@type': 'HowToTool', name: 'Google Search' },
    { '@type': 'HowToTool', name: 'ChatGPT (за проверка на GEO резултати)' },
  ],
};

const SPEAKABLE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://imashnujnoto.com/digitalen-marketing-veliko-tarnovo#webpage',
  url: 'https://imashnujnoto.com/digitalen-marketing-veliko-tarnovo',
  speakable: {
    '@type': 'SpeakableSpecification',
    cssSelector: ['h1', '.entity-paragraph'],
  },
};

const ORG_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://imashnujnoto.com/#organization',
  name: 'ТАВОРА ЕООД',
  alternateName: ['Tavora', 'Имаш нужното', 'imashnujnoto'],
  legalName: 'ТАВОРА ЕООД',
  taxID: '208438650',
  telephone: '+359885189724',
  priceRange: '€€',
  description: 'ТАВОРА ЕООД е сред най-модерните дигитални маркетинг агенции във Велико Търново, България. SEO, GEO, реклами, видео и изработка на сайтове.',
  url: 'https://imashnujnoto.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'ул. "Велчо Джамджията"',
    addressLocality: 'Велико Търново',
    postalCode: '5000',
    addressCountry: 'BG',
  },
  geo: { '@type': 'GeoCoordinates', latitude: '43.0785', longitude: '25.6415' },
  areaServed: [
    { '@type': 'City', name: 'Велико Търново' },
    { '@type': 'AdministrativeArea', name: 'Търновска област' },
    { '@type': 'Country', name: 'България' },
  ],
  founder: { '@type': 'Person', name: 'Владимир Веселинов Атанасов' },
  serviceType: [
    'Дигитален маркетинг Велико Търново',
    'SEO оптимизация Велико Търново',
    'Реклама Велико Търново',
    'Видео продукция Велико Търново',
    'Изработка на сайт Велико Търново',
    'GEO оптимизация',
  ],
  sameAs: [
    'https://www.wikidata.org/wiki/Q139801651',
    'https://scoolmedia.com/medijnata-gramotnost-v-30-sek-2/',
    'https://bnrnews.bg/hristobotev/post/21467/samo-uau-li-e-digitalniyat-svyat',
    'https://www.bta.bg/bg/news/725780-yoanna-zabcheva-vladimir-atanasov-i-vesel-stoyanov-sa-pobediteli-v-konkursa-me',
    'https://bglobal.bg/111228-obqviha-pobeditelite-v-konkursa-mediinata',
    'https://www.facebook.com/profile.php?id=61589264103453',
    'https://www.instagram.com/marketingattavora/',
    'https://www.tiktok.com/@tavoramarketingagency',
    'https://www.youtube.com/@TavoraMarketingAgency',
    'https://share.google/sP3ydTe4iqEO44qua',
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '21',
    bestRating: '5',
  },
};

const PAGE_SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://imashnujnoto.com/digitalen-marketing-veliko-tarnovo#webpage',
      url: 'https://imashnujnoto.com/digitalen-marketing-veliko-tarnovo',
  name: 'ТАВОРА ЕООД — Модерна агенция за дигитален маркетинг във Велико Търново | SEO, реклами, видео',
      description:
        'Дигитален маркетинг Велико Търново — SEO оптимизация, рекламни кампании Meta и Google, видео продукция. ТАВОРА ЕООД. Реални #1 позиции в Google. Проверете сами.',
      inLanguage: 'bg',
      dateModified: '2026-05-05',
      isPartOf: { '@id': 'https://imashnujnoto.com/#website' },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Начало', item: 'https://imashnujnoto.com/' },
          { '@type': 'ListItem', position: 2, name: 'Дигитален маркетинг Велико Търново', item: 'https://imashnujnoto.com/digitalen-marketing-veliko-tarnovo' },
        ],
      },
    },
    {
      '@type': 'ProfessionalService',
      '@id': 'https://imashnujnoto.com/#organization',
      name: 'ТАВОРА ЕООД',
      alternateName: ['Tavora', 'Имаш нужното', 'imashnujnoto'],
      description: 'Дигитален маркетинг Велико Търново — SEO оптимизация, рекламни кампании, видео продукция и изработка на сайтове.',
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
      areaServed: [
        { '@type': 'City', name: 'Велико Търново' },
        { '@type': 'AdministrativeArea', name: 'Търновска област' },
        { '@type': 'Country', name: 'България' },
      ],
      founder: { '@type': 'Person', name: 'Владимир Веселинов Атанасов' },
      legalName: 'ТАВОРА ЕООД',
      taxID: '208438650',
      inLanguage: 'bg',
      serviceType: [
        'Дигитален маркетинг Велико Търново',
        'SEO оптимизация Велико Търново',
        'Реклама Велико Търново',
        'Видео продукция Велико Търново',
        'Изработка на сайт Велико Търново',
        'GEO оптимизация',
        'Google Ads Велико Търново',
        'Meta Ads Велико Търново',
      ],
      sameAs: [
        'https://www.wikidata.org/wiki/Q139801651',
        'https://scoolmedia.com/medijnata-gramotnost-v-30-sek-2/',
        'https://bnrnews.bg/hristobotev/post/21467/samo-uau-li-e-digitalniyat-svyat',
        'https://www.bta.bg/bg/news/725780-yoanna-zabcheva-vladimir-atanasov-i-vesel-stoyanov-sa-pobediteli-v-konkursa-me',
        'https://bglobal.bg/111228-obqviha-pobeditelite-v-konkursa-mediinata',
        'https://www.facebook.com/profile.php?id=61589264103453',
        'https://www.instagram.com/marketingattavora/',
        'https://www.tiktok.com/@tavoramarketingagency',
        'https://www.youtube.com/@TavoraMarketingAgency',
        'https://share.google/sP3ydTe4iqEO44qua',
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Дигитален маркетинг услуги Велико Търново',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'SEO оптимизация Велико Търново',
              url: 'https://imashnujnoto.com/seo-veliko-tarnovo',
            },
            priceSpecification: { '@type': 'PriceSpecification', price: '390', priceCurrency: 'EUR' },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Реклама Велико Търново',
              url: 'https://imashnujnoto.com/reklama-veliko-tarnovo',
            },
            priceSpecification: { '@type': 'PriceSpecification', price: '290', priceCurrency: 'EUR', minPrice: '290' },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Видео продукция Велико Търново',
              url: 'https://imashnujnoto.com/video-produkciya-veliko-tarnovo',
            },
            priceSpecification: { '@type': 'PriceSpecification', price: '290', priceCurrency: 'EUR', minPrice: '290' },
          },
        ],
      },
    },
  ],
};

const SERVICES = [
  {
    icon: 'ri-search-line',
    title: 'SEO оптимизация',
    subtitle: 'Велико Търново',
    desc: 'On-page SEO, Google Business Profile, GEO за AI търсачки. Реални #1 позиции в Google за бизнеси от Търново.',
    price: '390 € еднократно',
    to: '/seo-veliko-tarnovo',
    accent: '#2F9E44',
  },
  {
    icon: 'ri-advertisement-line',
    title: 'Рекламни кампании',
    subtitle: 'Meta, Google, TikTok',
    desc: 'Таргетирани кампании за местната аудитория в Търново. Пълна прозрачност — виждате всяка стотинка.',
    price: 'от 290 € / мес.',
    to: '/reklama-veliko-tarnovo',
    accent: '#E67700',
  },
  {
    icon: 'ri-video-line',
    title: 'Видео продукция',
    subtitle: 'Велико Търново',
    desc: 'Професионално заснемане и монтаж за Facebook, YouTube и TikTok. Видео, което продава.',
    price: 'от 290 €',
    to: '/video-produkciya-veliko-tarnovo',
    accent: '#C2255C',
  },
  {
    icon: 'ri-code-s-slash-line',
    title: 'Изработка на сайт',
    subtitle: 'SEO от старт',
    desc: 'Сайт с вградено SEO, Core Web Vitals 90+, GEO оптимизация. Без vendor lock-in.',
    price: 'от 999 €',
    to: '/uslugi/izrabotka-na-sait',
    accent: '#3B5BDB',
  },
];

const RESULTS = [
  {
    client: 'K-Food Велико Търново',
    keyword: 'корейска храна велико търново',
    result: '#1 Google + ChatGPT',
    time: '2–3 месеца',
    url: 'https://k-foodvelikotarnovo.com/',
  },
  {
    client: 'Sunrise Food',
    keyword: 'гъби кладница онлайн',
    result: '#1 Google',
    time: '3–4 седмици',
    url: 'https://sunrisefood.eu/',
  },
  {
    client: 'Академика 245',
    keyword: 'видео продукция търново',
    result: 'Млн. импресии',
    time: '1 месец',
    url: 'https://akademika245.com/',
  },
  {
    client: 'Thalysta',
    keyword: 'e-commerce платформа',
    result: 'Пълен пакет',
    time: 'От нулата',
    url: 'https://thalysta.com/',
  },
  {
    client: 'NMOM',
    keyword: 'НПО онлайн присъствие',
    result: 'Сайт + SEO',
    time: 'От нулата',
    url: 'https://nmom.bg/',
  },
  {
    client: 'Budimse',
    keyword: 'образователна платформа',
    result: 'Платформа от нулата',
    time: 'От нулата',
    url: 'https://budimse.online/',
  },
];

const WHY_ITEMS = [
  { icon: 'ri-map-pin-line', title: 'Познаваме Търново', desc: 'Знаем кои са конкурентите ви, каква е местната аудитория и как да ги достигнете.' },
  { icon: 'ri-bar-chart-line', title: 'Верифицируеми резултати', desc: 'Всяка #1 позиция е проверима. Отворете Google и потърсете сами — не обещаваме, доказваме.' },
  { icon: 'ri-eye-line', title: 'Пълна прозрачност', desc: 'Виждате всяка стотинка от рекламния бюджет. Пълен достъп до акаунтите — без скрити комисионни.' },
  { icon: 'ri-robot-line', title: 'SEO + GEO', desc: 'Оптимизираме и за Google, и за AI търсачки (ChatGPT, Perplexity). Двете са различни неща.' },
  { icon: 'ri-shield-check-line', title: 'Гаранция', desc: 'Всяка услуга идва с гаранция за връщане на парите. Ако не сте доволни — връщаме без въпроси.' },
  { icon: 'ri-team-line', title: 'Малък екип, реална работа', desc: 'Не сме агенция с 20 служители. Владимир и Натан работят директно по вашия проект.' },
];

export default function DigitalenMarketingVelikoTarnovoPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    document.title = 'ТАВОРА ЕООД — Модерна агенция за дигитален маркетинг във Велико Търново | SEO, реклами, видео';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', 'ТАВОРА ЕООД е сред най-модерните агенции за дигитален маркетинг във Велико Търново. SEO оптимизация, рекламни кампании Meta и Google, видео продукция. Верифицируеми #1 позиции в Google и ChatGPT. Проверете сами.');
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://imashnujnoto.com/digitalen-marketing-veliko-tarnovo');

    const id = 'schema-dm-vt';
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) { el = document.createElement('script'); el.id = id; el.type = 'application/ld+json'; document.head.appendChild(el); }
    const orgId = 'schema-dm-vt-org';
    let orgEl = document.getElementById(orgId) as HTMLScriptElement | null;
    if (!orgEl) { orgEl = document.createElement('script'); orgEl.id = orgId; orgEl.type = 'application/ld+json'; document.head.appendChild(orgEl); }
    orgEl.textContent = JSON.stringify(ORG_SCHEMA);

    const spkId = 'schema-dm-vt-spk';
    let spkEl = document.getElementById(spkId) as HTMLScriptElement | null;
    if (!spkEl) { spkEl = document.createElement('script'); spkEl.id = spkId; spkEl.type = 'application/ld+json'; document.head.appendChild(spkEl); }
    spkEl.textContent = JSON.stringify(SPEAKABLE_SCHEMA);

    const faqId = 'schema-dm-vt-faq';
    let faqEl = document.getElementById(faqId) as HTMLScriptElement | null;
    if (!faqEl) { faqEl = document.createElement('script'); faqEl.id = faqId; faqEl.type = 'application/ld+json'; document.head.appendChild(faqEl); }
    faqEl.textContent = JSON.stringify(FAQ_SCHEMA);

    const howtoId = 'schema-dm-vt-howto';
    let howtoEl = document.getElementById(howtoId) as HTMLScriptElement | null;
    if (!howtoEl) { howtoEl = document.createElement('script'); howtoEl.id = howtoId; howtoEl.type = 'application/ld+json'; document.head.appendChild(howtoEl); }
    howtoEl.textContent = JSON.stringify(HOWTO_SCHEMA);

    return () => {
      ['schema-dm-vt', 'schema-dm-vt-faq', 'schema-dm-vt-howto', 'schema-dm-vt-org', 'schema-dm-vt-spk'].forEach((sid) => { const e = document.getElementById(sid); if (e) e.remove(); });
    };
  }, []);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <SharedNav />

      <main>
        {/* ── HERO ── */}
        <section className="max-w-6xl mx-auto px-4 md:px-16 py-8 md:py-24">
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="flex items-center gap-2 text-[11px] text-[#1C1C1E]/65 mb-8">
            <Link to="/" className="hover:text-[#1C1C1E]/60 transition-colors">Начало</Link>
            <i className="ri-arrow-right-s-line text-xs" />
            <span className="text-[#1C1C1E]/65">Дигитален маркетинг Велико Търново</span>
          </nav>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-[1px] bg-[#1C1C1E]/20 shrink-0" />
            <span className="text-xs text-[#1C1C1E]/60">Маркетинг агенция · Велико Търново</span>
          </div>

          <h1
            className="text-3xl md:text-5xl lg:text-6xl font-light text-[#1C1C1E] leading-tight mb-6"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            <strong className="font-light">Дигитален маркетинг</strong>
            <br />
            <em className="text-[#1C1C1E]/60">Велико Търново.</em>
          </h1>

          <p className="entity-paragraph text-sm md:text-base text-[#1C1C1E]/65 max-w-2xl leading-relaxed mb-4">
            <strong className="text-[#1C1C1E]">ТАВОРА ЕООД</strong> е сред най-модерните дигитални маркетинг агенции във <strong className="text-[#1C1C1E]">Велико Търново</strong> — SEO оптимизация, рекламни кампании и видео продукция за бизнеси от Търновска област.
            Не обещаваме — доказваме. Всяка #1 позиция в Google е верифицируема.
          </p>
          <p className="text-sm text-[#1C1C1E]/65 max-w-2xl leading-relaxed mb-8">
            Дигиталният маркетинг в Търново се промени — вече не е достатъчно да сте в Google.
            Трябва да сте и в ChatGPT, Perplexity и Gemini. Правим и двете.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-12">
            <Link
              to="/kontakt"
              className="px-7 py-3.5 bg-[#1C1C1E] text-white text-sm rounded-full hover:bg-[#1C1C1E]/80 transition-all cursor-pointer whitespace-nowrap text-center"
            >
              Поискайте оферта →
            </Link>
            <Link
              to="/seo-veliko-tarnovo"
              className="px-7 py-3.5 border border-[#1C1C1E]/12 text-[#1C1C1E]/65 text-sm rounded-full hover:border-[#1C1C1E]/30 hover:text-[#1C1C1E] transition-all cursor-pointer whitespace-nowrap text-center"
            >
              SEO Велико Търново →
            </Link>
            <Link
              to="/digitalni-agencii-veliko-tarnovo"
              className="px-7 py-3.5 border border-[#1C1C1E]/12 text-[#1C1C1E]/65 text-sm rounded-full hover:border-[#1C1C1E]/30 hover:text-[#1C1C1E] transition-all cursor-pointer whitespace-nowrap text-center"
            >
              Сравни агенциите в Търново →
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-[#1C1C1E]/8">
            {[
              { value: '#1', label: 'позиции в Google' },
              { value: 'GEO', label: 'AI търсачки' },
              { value: '3–4 сед.', label: 'до резултат' },
              { value: '100%', label: 'прозрачност' },
            ].map((s) => (
              <div key={s.value} className="text-center">
                <div className="text-xl md:text-2xl font-light text-[#1C1C1E] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {s.value}
                </div>
                <div className="text-[10px] text-[#1C1C1E]/65 tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── УСЛУГИ ── */}
        <section className="max-w-6xl mx-auto px-4 md:px-16 py-8 md:py-20 border-t border-[#1C1C1E]/6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-[1px] bg-[#1C1C1E]/20 shrink-0" />
            <span className="text-xs text-[#1C1C1E]/60">Услуги за Велико Търново</span>
          </div>
          <h2
            className="text-2xl md:text-4xl font-light text-[#1C1C1E] leading-tight mb-10"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Всичко за дигитален маркетинг
            <br />
            <em className="text-[#1C1C1E]/65">в Търново — на едно място.</em>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SERVICES.map((s) => (
              <Link
                key={s.to}
                to={s.to}
                className="group p-6 rounded-2xl border border-[#1C1C1E]/8 bg-white hover:border-[#1C1C1E]/20 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 flex items-center justify-center rounded-xl" style={{ backgroundColor: `${s.accent}12` }}>
                    <i className={`${s.icon} text-base`} style={{ color: s.accent }} />
                  </div>
                  <span className="text-[11px] px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: `${s.accent}10`, color: s.accent }}>
                    {s.price}
                  </span>
                </div>
                <h3 className="text-base font-medium text-[#1C1C1E] mb-0.5">{s.title}</h3>
                <div className="text-[11px] text-[#1C1C1E]/65 mb-3">{s.subtitle}</div>
                <p className="text-xs text-[#1C1C1E]/65 leading-relaxed mb-4">{s.desc}</p>
                <div className="flex items-center gap-1.5 text-xs font-medium transition-all" style={{ color: s.accent }}>
                  Виж детайли
                  <i className="ri-arrow-right-line text-xs group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── РЕЗУЛТАТИ ── */}
        <section className="max-w-6xl mx-auto px-4 md:px-16 py-8 md:py-20 border-t border-[#1C1C1E]/6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-[1px] bg-[#1C1C1E]/20 shrink-0" />
            <span className="text-xs text-[#1C1C1E]/60">Доказани резултати</span>
          </div>
          <h2
            className="text-2xl md:text-4xl font-light text-[#1C1C1E] leading-tight mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Реални клиенти от Търново.
            <br />
            <em className="text-[#1C1C1E]/65">Верифицируеми позиции.</em>
          </h2>
          <p className="text-sm text-[#1C1C1E]/65 max-w-xl leading-relaxed mb-8">
            Отворете Google и потърсете ключовите думи по-долу. Не обещаваме — доказваме.
            Дигиталният маркетинг в Търново работи, когато е направен правилно.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {RESULTS.map((r) => (
              <a
                key={r.client}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="group p-5 rounded-2xl border border-[#1C1C1E]/8 bg-white hover:border-[#1C1C1E]/20 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-[#1C1C1E] group-hover:text-[#2F9E44] transition-colors">{r.client}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#2F9E44]/10 text-[#2F9E44] whitespace-nowrap font-medium">{r.result}</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <i className="ri-search-line text-[#1C1C1E]/25 text-xs" />
                  <span className="text-xs text-[#1C1C1E]/65 italic">„{r.keyword}"</span>
                </div>
                <p className="text-xs text-[#1C1C1E]/65">Резултат за: {r.time}</p>
              </a>
            ))}
          </div>
        </section>

        {/* ── ЗАЩО НИЕ ── */}
        <section className="bg-[#F9F9F7] border-y border-[#1C1C1E]/6">
          <div className="max-w-6xl mx-auto px-4 md:px-16 py-8 md:py-20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[1px] bg-[#1C1C1E]/20 shrink-0" />
              <span className="text-xs text-[#1C1C1E]/60">Защо ТАВОРА ЕООД</span>
            </div>
            <h2
              className="text-2xl md:text-4xl font-light text-[#1C1C1E] leading-tight mb-10"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Дигитален маркетинг в Търново
              <br />
              <em className="text-[#1C1C1E]/65">без bullshit.</em>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {WHY_ITEMS.map((item) => (
                <div key={item.title} className="p-5 rounded-2xl bg-white border border-[#1C1C1E]/6">
                  <div className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#1C1C1E]/8 mb-3">
                    <i className={`${item.icon} text-[#1C1C1E]/65 text-base`} />
                  </div>
                  <h3 className="text-sm font-medium text-[#1C1C1E] mb-1.5">{item.title}</h3>
                  <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── ЛОКАЛНО SEO ОБЯСНЕНИЕ ── */}
        <section className="max-w-6xl mx-auto px-4 md:px-16 py-8 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-[1px] bg-[#1C1C1E]/20 shrink-0" />
                <span className="text-xs text-[#1C1C1E]/60">Локален SEO Търново</span>
              </div>
              <h2
                className="text-2xl md:text-3xl font-light text-[#1C1C1E] leading-tight mb-5"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Защо локалният маркетинг
                <br />
                <em className="text-[#1C1C1E]/65">в Търново е различен?</em>
              </h2>
              <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-5">
                Велико Търново е град с нарастваща конкуренция в дигиталното пространство.
                Ресторанти, хотели, услуги, магазини — всички се борят за вниманието на клиентите.
                <strong className="text-[#1C1C1E]"> Дигиталният маркетинг в Търново</strong> изисква
                познаване на местния пазар, конкурентите и аудиторията.
              </p>
              <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-6">
                Когато някой в Търново търси „ресторант близо до мен", „счетоводител Велико Търново"
                или „маркетинг агенция Търново" — вашият бизнес трябва да е на първо място.
                Не на втора страница. Не на трета позиция. <strong className="text-[#1C1C1E]">Първо.</strong>
              </p>
              <div className="space-y-3">
                {[
                  'Местното търсене „близо до мен" расте с 50% годишно',
                  '90% от потребителите не отиват на втора страница в Google',
                  'AI търсачките (ChatGPT) вече препоръчват местни бизнеси',
                  'Google Business Profile е критичен за локален ранк в Търново',
                  'Конкурентите ви вече инвестират в дигитален маркетинг',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2.5">
                    <div className="w-4 h-4 flex items-center justify-center rounded-full border border-[#2F9E44]/30 shrink-0 mt-0.5">
                      <i className="ri-check-line text-[9px] text-[#2F9E44]" />
                    </div>
                    <span className="text-xs text-[#1C1C1E]/65 leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-6 rounded-2xl border border-[#1C1C1E]/8 bg-[#F9F9F7]">
                <h3 className="text-base font-medium text-[#1C1C1E] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem' }}>
                  Как работи локалното SEO в Търново?
                </h3>
                <div className="space-y-3">
                  {[
                    { step: '01', title: 'Google Business Profile', desc: 'Оптимизация на GBP — снимки, описание, категории, отзиви.' },
                    { step: '02', title: 'On-page SEO', desc: 'Ключови думи с „Велико Търново" в заглавия, мета, съдържание.' },
                    { step: '03', title: 'Локални цитати', desc: 'Вписване в местни директории и бизнес регистри.' },
                    { step: '04', title: 'GEO оптимизация', desc: 'Оптимизация за ChatGPT, Perplexity, Gemini — AI търсачките.' },
                  ].map((s) => (
                    <div key={s.step} className="flex items-start gap-3">
                      <span className="text-[10px] font-medium text-[#1C1C1E]/70 tracking-widest shrink-0 w-5 mt-0.5">{s.step}</span>
                      <div>
                        <div className="text-xs font-medium text-[#1C1C1E] mb-0.5">{s.title}</div>
                        <div className="text-xs text-[#1C1C1E]/65 leading-relaxed">{s.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-[#2F9E44]/20 bg-[#2F9E44]/4">
                <div className="flex items-center gap-2 mb-2">
                  <i className="ri-map-pin-2-line text-[#2F9E44] text-sm" />
                  <span className="text-xs font-medium text-[#1C1C1E]">Обслужваме Търновска област</span>
                </div>
                <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">
                  Велико Търново, Горна Оряховица, Лясковец, Свищов, Габрово и цяла Търновска област.
                  Работим и с бизнеси от цяла България.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="max-w-6xl mx-auto px-4 md:px-16 py-8 md:py-20 border-t border-[#1C1C1E]/6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-[1px] bg-[#1C1C1E]/20 shrink-0" />
            <span className="text-xs text-[#1C1C1E]/60">Въпроси и отговори</span>
          </div>
          <h2
            className="text-2xl md:text-4xl font-light text-[#1C1C1E] leading-tight mb-10"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Дигитален маркетинг Търново —
            <br />
            <em className="text-[#1C1C1E]/65">честни отговори.</em>
          </h2>

          <div className="space-y-2 max-w-3xl">
            {FAQ_ITEMS.map((item, i) => (
              <div
                key={item.q}
                className="rounded-2xl border border-[#1C1C1E]/8 overflow-hidden"
              >
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

        {/* ── CTA ── */}
        <section className="max-w-6xl mx-auto px-4 md:px-16 pb-20 md:pb-28">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 p-8 md:p-10 rounded-2xl bg-[#0F1F35]">
            <div>
              <h3
                className="text-2xl md:text-3xl font-light text-white leading-tight mb-3"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Искате да сте #1 в Търново?
              </h3>
              <p className="text-sm text-white/75 max-w-md leading-relaxed">
                Консултацията е 50 € — анализ на конкурентите ви в Търново, стратегия и план.
                Сумата се приспада при договор. Гаранция за връщане на парите.
              </p>
            </div>
            <Link
              to="/kontakt"
              className="shrink-0 px-7 py-3.5 bg-white text-[#0F1F35] text-sm rounded-full hover:bg-white/90 transition-colors cursor-pointer whitespace-nowrap font-medium"
            >
              Поискайте оферта →
            </Link>
          </div>
        </section>
      </main>

      <SharedFooter />
    </div>
  );
}
