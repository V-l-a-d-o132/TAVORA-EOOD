import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SharedNav from '@/components/feature/SharedNav';
import SharedFooter from '@/components/feature/SharedFooter';

const FAQ_ITEMS = [
  {
    q: 'Колко струва рекламата за бизнес във Велико Търново?',
    a: 'Рекламните кампании в Meta, Google, YouTube и TikTok започват от 290 € на месец. Цената зависи от платформата, бюджета за реклами и обема на работа. Консултацията е 50 €, като тази сума се приспада от цената на услугата при сключване на договор.',
  },
  {
    q: 'Колко бързо ще видя резултати от рекламата?',
    a: 'При платени кампании резултатите са видими в рамките на 1–2 седмици. Оптимизацията и мащабирането стават след 30–60 дни, когато алгоритмите са научили аудиторията.',
  },
  {
    q: 'Работите ли само с бизнеси от Велико Търново?',
    a: 'Не — работим с бизнеси от цяла България. Специализираме се в локалния пазар на Велико Търново и Търновска област, но управляваме кампании и за клиенти от цялата страна.',
  },
  {
    q: 'Има ли гаранция за резултати?',
    a: 'Гарантираме качеството на работата и прозрачността на отчитането. Всяка услуга (без консултацията от 50 €) има срок за възстановяване на сумата — ако не сте доволни, връщаме парите без въпроси.',
  },
  {
    q: 'Какво включва консултацията?',
    a: 'Консултацията е 50 € и включва анализ на вашия бизнес, конкурентите и онлайн присъствието ви, плюс конкретен план за действие. Тази сума се приспада от цената на услугата при сключване на договор.',
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
  name: 'Как да изберете рекламна агенция във Велико Търново',
  description: 'Стъпки за избор на правилната рекламна агенция за вашия бизнес във Велико Търново — от дигитални кампании до външна реклама.',
  totalTime: 'PT1D',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Определете нуждите си',
      text: 'Искате дигитална реклама (Meta, Google, YouTube, TikTok) или традиционна (билбордове, печат, външна)? Вашият бюджет и целева аудитория определят типа агенция.',
      url: 'https://imashnujnoto.com/reklama-veliko-tarnovo#step-1',
      image: {
        '@type': 'ImageObject',
        url: 'https://imashnujnoto.com/og-reklama-vt.jpg',
        width: 1200,
        height: 630,
      },
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Проверете портфолиото',
      text: 'Реални клиенти и верифицируеми резултати — не обещания. Питайте за конкретни кампании, бюджети и ROI.',
      url: 'https://imashnujnoto.com/reklama-veliko-tarnovo#step-2',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Поискайте консултация',
      text: 'Професионалните агенции предлагат платена консултация (50 €) с конкретен план. Безплатните оферти често са генерични.',
      url: 'https://imashnujnoto.com/reklama-veliko-tarnovo#step-3',
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Оценете прозрачността',
      text: 'Агенцията трябва да ви дава достъп до рекламните акаунти и месечни отчети с реални числа. Без скрити комисионни.',
      url: 'https://imashnujnoto.com/reklama-veliko-tarnovo#step-4',
    },
    {
      '@type': 'HowToStep',
      position: 5,
      name: 'Стартирайте с тестов бюджет',
      text: 'Започнете с 200–300 лв. рекламен бюджет + управление от 290 €. Оценете резултатите след 30 дни преди мащабиране.',
      url: 'https://imashnujnoto.com/reklama-veliko-tarnovo#step-5',
    },
  ],
};

const SPEAKABLE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://imashnujnoto.com/reklama-veliko-tarnovo#webpage',
  url: 'https://imashnujnoto.com/reklama-veliko-tarnovo',
  speakable: {
    '@type': 'SpeakableSpecification',
    cssSelector: ['h1', '.hero-desc', '.entity-paragraph'],
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
  description: 'ТАВОРА ЕООД е сред най-модерните рекламни агенции във Велико Търново, България. Meta, Google, YouTube, TikTok реклами.',
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
    'Рекламни кампании Meta',
    'Рекламни кампании Google',
    'Рекламни кампании YouTube',
    'Рекламни кампании TikTok',
    'Дигитален маркетинг',
    'SEO оптимизация',
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
    worstRating: '1',
  },
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://imashnujnoto.com/reklama-veliko-tarnovo#webpage',
      url: 'https://imashnujnoto.com/reklama-veliko-tarnovo',
      name: 'Реклама Велико Търново | Рекламна агенция ТАВОРА ЕООД — Meta, Google, TikTok',
      description:
        'Професионална реклама за бизнеси във Велико Търново и областта. Meta, Google, YouTube, TikTok кампании с реални резултати. Рекламна агенция ТАВОРА ЕООД — дигитален маркетинг.',
      inLanguage: 'bg',
      isPartOf: { '@id': 'https://imashnujnoto.com/#website' },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Начало', item: 'https://imashnujnoto.com/' },
          { '@type': 'ListItem', position: 2, name: 'Реклама Велико Търново', item: 'https://imashnujnoto.com/reklama-veliko-tarnovo' },
        ],
      },
      dateModified: '2026-05-05',
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: ['.hero-h1', '.hero-desc', '.services-grid', '.howto-section'],
      },
    },
    {
      '@type': 'LocalBusiness',
      '@id': 'https://imashnujnoto.com/#organization',
      name: 'ТАВОРА ЕООД',
      alternateName: ['Tavora', 'Имаш нужното', 'imashnujnoto'],
      legalName: 'ТАВОРА ЕООД',
      taxID: '208438650',
      telephone: '+359885189724',
      priceRange: '€€',
      openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '09:00', closes: '18:00' }],
      description:
        'Рекламна агенция във Велико Търново. Дигитален маркетинг, рекламни кампании в Meta, Google, YouTube и TikTok за бизнеси от Велико Търново и цяла България.',
      url: 'https://imashnujnoto.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'ул. "Велчо Джамджията"',
        addressLocality: 'Велико Търново',
        postalCode: '5000',
        addressCountry: 'BG',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: '43.0785',
        longitude: '25.6415',
      },
      areaServed: [
        { '@type': 'City', name: 'Велико Търново' },
        { '@type': 'AdministrativeArea', name: 'Търновска област' },
        { '@type': 'Country', name: 'България' },
      ],
      founder: { '@type': 'Person', name: 'Владимир Веселинов Атанасов' },
      serviceType: [
        'Рекламни кампании Meta',
        'Рекламни кампании Google',
        'Рекламни кампании YouTube',
        'Рекламни кампании TikTok',
        'Дигитален маркетинг',
        'SEO оптимизация',
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
        worstRating: '1',
      },
      review: [
        {
          '@type': 'Review',
          author: { '@type': 'Person', name: 'K-Food Велико Търново' },
          reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
          reviewBody: 'ТАВОРА ни изкара на #1 в Google и ChatGPT за "korean restaurant veliko tarnovo". Резултатите са видими още първия месец.',
          datePublished: '2026-03-15',
        },
        {
          '@type': 'Review',
          author: { '@type': 'Person', name: 'Sunrise Food' },
          reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
          reviewBody: 'Сайт + SEO + реклами от ТАВОРА — достигнахме #1 в Google за "гъби кладница" за 3–4 седмици.',
          datePublished: '2026-02-20',
        },
        {
          '@type': 'Review',
          author: { '@type': 'Person', name: 'Академика 245' },
          reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
          reviewBody: 'Видео продукция и GEO оптимизация — милиони импресии и реални клиенти от Търново и България.',
          datePublished: '2026-01-10',
        },
        {
          '@type': 'Review',
          author: { '@type': 'Person', name: 'Thalysta' },
          reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
          reviewBody: 'ТАВОРА създаде нашия e-commerce сайт от нулата — SEO, реклами и видео. Жив сайт с реални резултати.',
          datePublished: '2026-04-20',
        },
        {
          '@type': 'Review',
          author: { '@type': 'Person', name: 'NMOM' },
          reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
          reviewBody: 'Пълен пакет за нашата НПО — сайт, SEO и дигитална стратегия. Професионална работа от нулата.',
          datePublished: '2026-03-01',
        },
        {
          '@type': 'Review',
          author: { '@type': 'Person', name: 'Budimse' },
          reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
          reviewBody: 'Създадоха нашата образователна платформа от нулата — сайт, SEO, GEO и дигитален маркетинг. Отлични резултати.',
          datePublished: '2026-02-15',
        },
      ],
    },
    {
      '@type': 'OfferCatalog',
      name: 'Рекламни услуги Велико Търново',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Meta Ads (Facebook + Instagram)',
            description: 'Рекламни кампании в Meta за бизнеси от Велико Търново. Таргетиране, креативи, A/B тестове.',
            provider: { '@id': 'https://imashnujnoto.com/#organization' },
            areaServed: { '@type': 'City', name: 'Велико Търново' },
          },
          price: '290',
          priceCurrency: 'EUR',
          availability: 'https://schema.org/InStock',
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Google Ads (Търсене + Дисплей)',
            description: 'Google реклами за бизнеси във Велико Търново. Платено търсене и дисплей мрежа.',
            provider: { '@id': 'https://imashnujnoto.com/#organization' },
            areaServed: { '@type': 'City', name: 'Велико Търново' },
          },
          price: '290',
          priceCurrency: 'EUR',
          availability: 'https://schema.org/InStock',
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'YouTube Ads',
            description: 'Видео реклами в YouTube за бранд awareness и конверсии в Търново и България.',
            provider: { '@id': 'https://imashnujnoto.com/#organization' },
            areaServed: { '@type': 'City', name: 'Велико Търново' },
          },
          price: '390',
          priceCurrency: 'EUR',
          availability: 'https://schema.org/InStock',
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'TikTok Ads',
            description: 'Кратки видео реклами в TikTok за млада аудитория във Велико Търново.',
            provider: { '@id': 'https://imashnujnoto.com/#organization' },
            areaServed: { '@type': 'City', name: 'Велико Търново' },
          },
          price: '290',
          priceCurrency: 'EUR',
          availability: 'https://schema.org/InStock',
        },
      ],
    },
  ],
};

const platforms = [
  {
    name: 'Meta Ads',
    icon: 'ri-facebook-circle-line',
    desc: 'Facebook и Instagram реклами — таргетирани кампании за местната аудитория във Велико Търново. Лийд форми, конверсии, awareness.',
    price: 'от 290 € / мес.',
  },
  {
    name: 'Google Ads',
    icon: 'ri-google-line',
    desc: 'Търсене и дисплей мрежа. Когато някой търси вашия продукт или услуга в Търново — вие сте на първо място.',
    price: 'от 290 € / мес.',
  },
  {
    name: 'YouTube Ads',
    icon: 'ri-youtube-line',
    desc: 'Видео реклами преди и по време на видеа. Идеално за бранд awareness и демонстрация на продукти.',
    price: 'от 390 € / мес.',
  },
  {
    name: 'TikTok Ads',
    icon: 'ri-tiktok-line',
    desc: 'Кратки, ефективни видео реклами за млада аудитория. Органично + платено съдържание, което достига.',
    price: 'от 290 € / мес.',
  },
];

const results = [
  {
    client: 'K-Food Велико Търново',
    result: '#1 в Google + ChatGPT',
    desc: 'SEO + GEO + реклами — комбинирана стратегия за ресторант в Търново.',
    url: 'https://k-foodvelikotarnovo.com/',
  },
  {
    client: 'Sunrise Food',
    result: '#1 в Google за 3–4 седмици',
    desc: 'Сайт + SEO + реклами — онлайн магазин за гъби кладница.',
    url: 'https://sunrisefood.eu/',
  },
  {
    client: 'Thalysta',
    result: 'E-commerce от нулата',
    desc: 'Пълен пакет — сайт, SEO, реклами и видео за e-commerce платформа.',
    url: 'https://thalysta.com/',
  },
  {
    client: 'NMOM',
    result: 'НПО сайт · SEO · Реклами',
    desc: 'Пълен пакет — сайт, SEO и дигитална стратегия за НПО организация.',
    url: 'https://nmom.bg/',
  },
  {
    client: 'Budimse',
    result: 'Платформа от нулата',
    desc: 'Образователна платформа — сайт, SEO, GEO и дигитален маркетинг.',
    url: 'https://budimse.online/',
  },
];

const adTypes = {
  digital: [
    { name: 'Meta Ads', desc: 'Facebook и Instagram реклами — таргетирани кампании за местната аудитория във Велико Търново. Лийд форми, конверсии, awareness.', price: 'от 290 € / мес.' },
    { name: 'Google Ads', desc: 'Търсене и дисплей мрежа. Когато някой търси вашия продукт или услуга в Търново — вие сте на първо място.', price: 'от 290 € / мес.' },
    { name: 'YouTube Ads', desc: 'Видео реклами преди и по време на видеа. Идеално за бранд awareness и демонстрация на продукти.', price: 'от 390 € / мес.' },
    { name: 'TikTok Ads', desc: 'Кратки, ефективни видео реклами за млада аудитория. Органично + платено съдържание, което достига.', price: 'от 290 € / мес.' },
  ],
  traditional: [
    { name: 'Билбордове', desc: 'Външна реклама по пътища и булеварди в Търново. За бранд awareness и силно локално присъствие.', provider: 'Рекламна къща ДизАрт', note: 'Препоръчваме за големи брандове и събития' },
    { name: 'Печатна реклама', desc: 'Визитки, флаери, брошури, календари и опаковки. Подходяща за локални промоции и събития.', provider: 'Вали Принт', note: 'Комбинира се добре с дигитална реклама' },
    { name: 'Външна реклама', desc: 'Светещи реклами, фасадни надписи, брандиране на витрини и превозни средства.', provider: 'ДизАрт, Artvision', note: 'Повишава доверието във физическия обект' },
    { name: 'Сувенирна реклама', desc: 'Щампи върху текстил, лазерно гравиране, ситопечат за корпоративни подаръци.', provider: 'Вали Принт', note: 'Добър избор за корпоративни клиенти' },
  ],
};

export default function ReklamaVelikoTarnovoPage() {
  useEffect(() => {
    const id = 'schema-reklama';
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement('script');
      el.id = id;
      el.type = 'application/ld+json';
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(SCHEMA);

    const faqId = 'schema-reklama-faq';
    let faqEl = document.getElementById(faqId) as HTMLScriptElement | null;
    if (!faqEl) {
      faqEl = document.createElement('script');
      faqEl.id = faqId;
      faqEl.type = 'application/ld+json';
      document.head.appendChild(faqEl);
    }
    faqEl.textContent = JSON.stringify(FAQ_SCHEMA);

    const howtoId = 'schema-reklama-howto';
    let howtoEl = document.getElementById(howtoId) as HTMLScriptElement | null;
    if (!howtoEl) {
      howtoEl = document.createElement('script');
      howtoEl.id = howtoId;
      howtoEl.type = 'application/ld+json';
      document.head.appendChild(howtoEl);
    }
    howtoEl.textContent = JSON.stringify(HOWTO_SCHEMA);

    const orgId = 'schema-reklama-org';
    let orgEl = document.getElementById(orgId) as HTMLScriptElement | null;
    if (!orgEl) { orgEl = document.createElement('script'); orgEl.id = orgId; orgEl.type = 'application/ld+json'; document.head.appendChild(orgEl); }
    orgEl.textContent = JSON.stringify(ORG_SCHEMA);

    const spkId = 'schema-reklama-spk';
    let spkEl = document.getElementById(spkId) as HTMLScriptElement | null;
    if (!spkEl) { spkEl = document.createElement('script'); spkEl.id = spkId; spkEl.type = 'application/ld+json'; document.head.appendChild(spkEl); }
    spkEl.textContent = JSON.stringify(SPEAKABLE_SCHEMA);

    document.title = 'ТАВОРА ЕООД — Модерна рекламна агенция във Велико Търново | Meta, Google, TikTok реклами';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Професионална реклама за бизнеси във Велико Търново и областта. Meta, Google, YouTube, TikTok кампании с реални резултати. Рекламна агенция ТАВОРА ЕООД — дигитален маркетинг.');
    }

    return () => {
      ['schema-reklama', 'schema-reklama-faq', 'schema-reklama-howto', 'schema-reklama-org', 'schema-reklama-spk'].forEach((sid) => { const e = document.getElementById(sid); if (e) e.remove(); });
    };
  }, []);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <SharedNav />

      <main className="max-w-6xl mx-auto px-4 md:px-16">
        {/* Hero */}
        <div className="py-6 md:py-24">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <div className="w-8 h-[1px] bg-[#0A2540]/30 shrink-0" />
            <span className="text-xs text-[#1C1C1E]/60">Реклама · Велико Търново</span>
          </div>

          <h1
            className="hero-h1 text-3xl md:text-5xl lg:text-6xl font-light text-[#1C1C1E] leading-tight mb-6"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Реклама за вашия бизнес
            <br />
            <span className="italic text-[#0A2540]">във Велико Търново.</span>
          </h1>

          <p className="hero-desc entity-paragraph text-sm md:text-base text-[#1C1C1E]/65 max-w-2xl leading-relaxed mb-8">
            <strong className="text-[#0A2540]">ТАВОРА ЕООД</strong> е сред най-модерните рекламни агенции във <strong className="text-[#0A2540]">Велико Търново</strong> — Meta, Google, YouTube и TikTok рекламни кампании, настроени и управлявани от екипа на ТАВОРА ЕООД.
            Работим с бизнеси от Велико Търново и Търновска област — ресторанти, хотели, магазини, услуги.
            Не теория. Реални кампании с реални резултати.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-6 md:mb-12">
            <Link
              to="/kontakt"
              className="px-7 py-3.5 bg-[#0A2540] text-white text-sm tracking-wide rounded-full hover:bg-[#0A2540]/90 transition-all duration-300 cursor-pointer whitespace-nowrap text-center"
            >
              Поискайте оферта →
            </Link>
            <Link
              to="/video-produkciya-veliko-tarnovo"
              className="px-7 py-3.5 border border-[#1C1C1E]/12 text-[#1C1C1E]/65 text-sm tracking-wide rounded-full hover:border-[#0A2540]/30 hover:text-[#0A2540] transition-all duration-300 cursor-pointer whitespace-nowrap text-center"
            >
              Видео продукция →
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 pt-8 border-t border-[#1C1C1E]/8">
            {[
              { value: 'Meta', label: 'Facebook + Instagram' },
              { value: 'Google', label: 'Търсене + Дисплей' },
              { value: 'YouTube', label: 'Видео реклами' },
              { value: 'TikTok', label: 'Кратки видеа' },
            ].map((s) => (
              <div key={s.value} className="text-center">
                <div className="text-lg md:text-xl font-light text-[#0A2540] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {s.value}
                </div>
                <div className="text-[10px] text-[#1C1C1E]/65 tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* NEW — Видове реклама в Търново */}
        <div id="step-1" className="howto-section py-8 md:py-20 border-t border-[#1C1C1E]/6">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <div className="w-8 h-[1px] bg-[#0A2540]/30 shrink-0" />
            <span className="text-xs text-[#1C1C1E]/60">Видове реклама</span>
          </div>

          <h2
            className="text-2xl md:text-4xl font-light text-[#1C1C1E] leading-tight mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Видове реклама във
            <br />
            <span className="italic text-[#0A2540]">Велико Търново.</span>
          </h2>
          <p className="text-sm text-[#1C1C1E]/65 max-w-xl leading-relaxed mb-6 md:mb-10">
            Велико Търново предлага и дигитални, и традиционни рекламни канали. Ние се специализираме в дигиталната реклама — 
            тя е измерима, таргетирана и дава по-добър ROI. Ето какво предлага пазарът в Търново:
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {/* Дигитална реклама */}
            <div className="p-4 md:p-6 rounded-2xl border border-[#0A2540]/15 bg-[#F9F9F9]">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#0A2540]/15 bg-[#0A2540]/8">
                  <i className="ri-computer-line text-[#0A2540]/60 text-base" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-[#1C1C1E]">Дигитална реклама</h3>
                  <p className="text-[10px] text-[#0A2540] tracking-wide">Нашата специализация · SEO + GEO + Реклами</p>
                </div>
              </div>
              <div className="space-y-3 md:space-y-3 md:space-y-4">
                {adTypes.digital.map((item) => (
                  <div key={item.name} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#0A2540]/40 shrink-0 mt-2" />
                    <div>
                      <div className="text-xs font-medium text-[#1C1C1E]">{item.name} <span className="text-[#0A2540]/60 font-normal ml-1">{item.price}</span></div>
                      <p className="text-[11px] text-[#1C1C1E]/65 leading-relaxed mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                to="/uslugi/reklamni-kampanii"
                className="inline-flex items-center gap-1.5 mt-5 text-xs text-[#0A2540] hover:underline cursor-pointer"
              >
                Виж всички рекламни услуги <i className="ri-arrow-right-line text-xs" />
              </Link>
            </div>

            {/* Традиционна реклама */}
            <div className="p-4 md:p-6 rounded-2xl border border-[#1C1C1E]/8 bg-white">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#1C1C1E]/10 bg-[#1C1C1E]/4">
                  <i className="ri-printer-line text-[#1C1C1E]/65 text-base" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-[#1C1C1E]">Традиционна реклама</h3>
                  <p className="text-[10px] text-[#1C1C1E]/65 tracking-wide">Препоръчваме надеждни партньори в Търново</p>
                </div>
              </div>
              <div className="space-y-3 md:space-y-3 md:space-y-4">
                {adTypes.traditional.map((item) => (
                  <div key={item.name} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#1C1C1E]/20 shrink-0 mt-2" />
                    <div>
                      <div className="text-xs font-medium text-[#1C1C1E]">{item.name}</div>
                      <p className="text-[11px] text-[#1C1C1E]/65 leading-relaxed mt-0.5">{item.desc}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] text-[#1C1C1E]/70">Партньор:</span>
                        <span className="text-[10px] text-[#1C1C1E]/65">{item.provider}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-[#1C1C1E]/70 mt-5 leading-relaxed">
                Традиционната реклама работи добре за бранд awareness и физически обекти. 
                За директни продажби и измерим ROI — дигиталната реклама е по-ефективна. 
                Най-добрият резултат идва от комбинацията на двете.
              </p>
            </div>
          </div>
        </div>

        {/* NEW — How to choose */}
        <div id="step-2" className="py-5 md:py-20 border-t border-[#1C1C1E]/6">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <div className="w-8 h-[1px] bg-[#0A2540]/30 shrink-0" />
            <span className="text-xs text-[#1C1C1E]/60">Ръководство</span>
          </div>
          <h2
            className="text-2xl md:text-4xl font-light text-[#1C1C1E] leading-tight mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Как да изберете
            <br />
            <span className="italic text-[#0A2540]">рекламна агенция в Търново?</span>
          </h2>
          <p className="text-sm text-[#1C1C1E]/65 max-w-xl leading-relaxed mb-6 md:mb-10">
            Пазарът на реклама във Велико Търново е разнообразен — от печатници като ДизАрт и Вали Принт до дигитални агенции. 
            Ето 5 стъпки за избор на правилната агенция за вашия бизнес:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { step: '01', title: 'Определете нуждите си', desc: 'Дигитална или традиционна реклама? Бюджет? Целева аудитория?' },
              { step: '02', title: 'Проверете портфолиото', desc: 'Реални клиенти и верифицируеми резултати — не обещания.' },
              { step: '03', title: 'Поискайте консултация', desc: 'Платена консултация (50 €) с конкретен план е знак за професионализъм.' },
              { step: '04', title: 'Оценете прозрачността', desc: 'Достъп до акаунти и месечни отчети с реални числа.' },
              { step: '05', title: 'Стартирайте с тест', desc: '200–300 лв. бюджет + 290 € управление. Оценете резултатите след 30 дни.' },
            ].map((s) => (
              <div key={s.step} className="p-4 md:p-5 rounded-2xl border border-[#1C1C1E]/8 bg-[#F9F9F9]">
                <span className="text-[11px] font-medium text-[#0A2540]/40 tracking-widest">{s.step}</span>
                <h3 className="text-sm font-medium text-[#1C1C1E] mt-2 mb-1.5">{s.title}</h3>
                <p className="text-[11px] text-[#1C1C1E]/65 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Platforms */}
        <div className="py-5 md:py-20 border-t border-[#1C1C1E]/6">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <div className="w-8 h-[1px] bg-[#0A2540]/30 shrink-0" />
            <span className="text-xs text-[#1C1C1E]/60">Платформи</span>
          </div>

          <h2
            className="text-2xl md:text-4xl font-light text-[#1C1C1E] leading-tight mb-6 md:mb-10"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Рекламни кампании в
            <br />
            <span className="italic text-[#0A2540]">Meta, Google, YouTube и TikTok.</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {platforms.map((p) => (
              <div
                key={p.name}
                className="p-4 md:p-6 rounded-2xl border border-[#1C1C1E]/8 bg-[#F9F9F9] hover:border-[#0A2540]/15 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#0A2540]/10 bg-[#0A2540]/4">
                    <i className={`${p.icon} text-[#0A2540]/60 text-base`} />
                  </div>
                  <span className="text-sm font-medium text-[#1C1C1E]">{p.name}</span>
                </div>
                <p className="text-xs text-[#1C1C1E]/65 leading-relaxed mb-3">{p.desc}</p>
                <span className="inline-block text-[11px] px-2.5 py-1 rounded-full border border-[#0A2540]/15 text-[#0A2540] font-medium">
                  {p.price}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="py-5 md:py-20 border-t border-[#1C1C1E]/6">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <div className="w-8 h-[1px] bg-[#0A2540]/30 shrink-0" />
            <span className="text-xs text-[#1C1C1E]/60">Резултати</span>
          </div>

          <h2
            className="text-2xl md:text-4xl font-light text-[#1C1C1E] leading-tight mb-6 md:mb-10"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Реални клиенти,
            <br />
            <span className="italic text-[#0A2540]">верифицируеми резултати.</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((r) => (
              <a
                key={r.client}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="p-4 md:p-5 rounded-2xl border border-[#1C1C1E]/8 bg-white hover:border-[#0A2540]/15 transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-[#1C1C1E] group-hover:text-[#0A2540] transition-colors">
                    {r.client}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1B4332]/10 text-[#1B4332] whitespace-nowrap">
                    {r.result}
                  </span>
                </div>
                <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">{r.desc}</p>
              </a>
            ))}
          </div>
        </div>

        {/* Why local matters */}
        <div className="py-5 md:py-20 border-t border-[#1C1C1E]/6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              <h2
                className="text-2xl md:text-4xl font-light text-[#1C1C1E] leading-tight mb-5"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Защо местната реклама
                <br />
                <span className="italic text-[#0A2540]">има значение?</span>
              </h2>
              <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-6">
                Когато някой в Търново търси „ресторант близо до мен" или „счетоводител Велико Търново" —
                вашата реклама трябва да е там. Познаваме местния пазар, конкуренцията и аудиторията.
                Не прилагаме шаблони — всяка кампания е персонализирана.
              </p>
              <div className="space-y-3 md:space-y-3">
                {[
                  'Таргетиране по местоположение — само хора в Търново и областта',
                  'Език и култура — реклами на български, адаптирани за местната аудитория',
                  'Конкурентен анализ — знаем кои са вашите конкуренти онлайн',
                  'Бюджетна ефективност — фокус върху ROI, не върху разходи',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2.5">
                    <div className="w-5 h-5 flex items-center justify-center rounded-full border border-[#1B4332]/20 shrink-0 mt-0.5">
                      <i className="ri-check-line text-[10px] text-[#1B4332]" />
                    </div>
                    <span className="text-xs text-[#1C1C1E]/65 leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 md:p-8 rounded-2xl border border-[#1C1C1E]/8 bg-[#F9F9F9]">
              <h3
                className="text-lg font-light text-[#1C1C1E] mb-4"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Как работим?
              </h3>
              <div className="space-y-3 md:space-y-3 md:space-y-4">
                {[
                  { step: '01', title: 'Анализ', desc: 'Разбираме вашия бизнес, цели и конкуренция в Търново.' },
                  { step: '02', title: 'Стратегия', desc: 'Избираме платформи, аудитория и бюджет за максимален ROI.' },
                  { step: '03', title: 'Създаване', desc: 'Дизайн на креативи, копи и настройка на кампаниите.' },
                  { step: '04', title: 'Оптимизация', desc: 'Следим, тестваме и подобряваме непрекъснато.' },
                ].map((s) => (
                  <div key={s.step} className="flex items-start gap-3">
                    <span className="text-[10px] font-medium text-[#0A2540]/40 tracking-widest shrink-0 w-5">{s.step}</span>
                    <div>
                      <div className="text-sm font-medium text-[#1C1C1E] mb-0.5">{s.title}</div>
                      <div className="text-xs text-[#1C1C1E]/65 leading-relaxed">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="py-5 md:py-20 border-t border-[#1C1C1E]/6">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <div className="w-8 h-[1px] bg-[#0A2540]/30 shrink-0" />
            <span className="text-xs text-[#1C1C1E]/60">Въпроси и отговори</span>
          </div>
          <h2
            className="text-2xl md:text-4xl font-light text-[#1C1C1E] leading-tight mb-6 md:mb-10"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Често задавани
            <br />
            <span className="italic text-[#0A2540]">въпроси за реклама.</span>
          </h2>
          <div className="space-y-3 md:space-y-3 mb-10">
            {FAQ_ITEMS.map((item) => (
              <details key={item.q} className="group rounded-2xl border border-[#1C1C1E]/8 bg-[#F9F9F9] overflow-hidden">
                <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none">
                  <span className="text-sm font-medium text-[#1C1C1E]">{item.q}</span>
                  <i className="ri-add-line text-[#0A2540]/50 text-base shrink-0 group-open:hidden" />
                  <i className="ri-subtract-line text-[#0A2540]/50 text-base shrink-0 hidden group-open:block" />
                </summary>
                <div className="px-5 pb-4">
                  <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">{item.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="py-5 md:py-20 border-t border-[#1C1C1E]/6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 p-4 md:p-8 rounded-2xl border border-[#1C1C1E]/8 bg-[#F9F9F9]">
            <div>
              <div
                className="text-xl md:text-2xl font-light text-[#1C1C1E] mb-1"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Готови ли сте за повече клиенти?
              </div>
              <p className="text-sm text-[#1C1C1E]/65">
                Консултацията е 50 € — анализ, стратегия и план. Сумата се приспада при сключване на договор. Всяка услуга идва с гаранция за връщане на парите.
              </p>
            </div>
            <Link
              to="/kontakt"
              className="px-7 py-3.5 bg-[#0A2540] text-white text-sm rounded-full hover:bg-[#0A2540]/90 transition-all cursor-pointer whitespace-nowrap text-center shrink-0"
            >
              Поискайте оферта →
            </Link>
          </div>
        </div>
      </main>

      <SharedFooter />
    </div>
  );
}