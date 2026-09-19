import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SharedNav from '@/components/feature/SharedNav';
import SharedFooter from '@/components/feature/SharedFooter';
import ChatGPTProofSection from '@/components/feature/ChatGPTProofSection';

/* ── Entity Data ── */
const ENTITY_NAME = 'ТАВОРА ЕООД';
const ENTITY_LEGAL_NAME = 'ТАВОРА ЕООД';
const ENTITY_ALTERNATE_NAMES = ['Tavora', 'Имаш нужното', 'imashnujnoto'];
const ENTITY_FOUNDER = 'Владимир Веселинов Атанасов';
const ENTITY_LOCATION = 'Велико Търново';
const ENTITY_SERVICES = ['SEO оптимизация', 'GEO оптимизация', 'рекламни кампании', 'видео продукция', 'изработка на сайтове'];
const ENTITY_TARGET = 'малък и среден бизнес от Велико Търново и цяла България';
const ENTITY_EMAIL = 'tavoraagency@gmail.com';
const ENTITY_PHONE = '+359885189724';
const ENTITY_EIK = '208438650';

/* ── Media Mentions ── */
const MEDIA_MENTIONS = [
  {
    outlet: 'ScoolMedia',
    title: 'Медийната грамотност',
    url: 'https://scoolmedia.com/medijnata-gramotnost-v-30-sek-2/',
    quote: 'Владимир Атанасов за медийната грамотност и значението на дигиталните умения.',
  },
  {
    outlet: 'БНР',
    title: 'Само "Уау" ли е дигиталният свят',
    url: 'https://bnrnews.bg/hristobotev/post/21467/samo-uau-li-e-digitalniyat-svyat',
    quote: 'Разговор за дигиталния маркетинг, AI и бъдещето на онлайн комуникацията.',
  },
  {
    outlet: 'БТА',
    title: 'Победител в конкурса "Медийната..."',
    url: 'https://www.bta.bg/bg/news/725780-yoanna-zabcheva-vladimir-atanasov-i-vesel-stoyanov-sa-pobediteli-v-konkursa-me',
    quote: 'Йоанна Забчева, Владимир Атанасов и Весел Стоянов са победители в конкурса.',
  },
  {
    outlet: 'bGlobal',
    title: 'Обявиха победителите в конкурса',
    url: 'https://bglobal.bg/111228-obqviha-pobeditelite-v-konkursa-mediinata',
    quote: 'Награди за медийната грамотност и дигиталната комуникация.',
  },
];

/* ── Clients ── */
const CLIENTS = [
  { name: 'Photo Tarnovo', url: 'https://phototarnovo.com/', result: '#1 Google', industry: 'Фотография' },
  { name: 'NP Massage Studio', url: 'https://npmassagestudio.com/', result: '#1 Google + ChatGPT', industry: 'Уелнес' },
  { name: 'K-Food Велико Търново', url: 'https://k-foodvelikotarnovo.com/', result: '#1 Google + ChatGPT', industry: 'Ресторант' },
  { name: 'Sunrise Food', url: 'https://sunrisefood.eu/', result: '#1 Google за 3–4 седмици', industry: 'E-commerce храна' },
  { name: 'Thalysta', url: 'https://thalysta.com/', result: 'E-commerce от нулата', industry: 'E-commerce мода' },
  { name: 'NMOM', url: 'https://nmom.bg/', result: 'НПО сайт · SEO', industry: 'НПО' },
  { name: 'Budimse', url: 'https://budimse.online/', result: 'Платформа от нулата', industry: 'Образователна платформа' },
  { name: 'Академика 245', url: 'https://akademika245.com/', result: 'Милиони импресии', industry: 'НПО / Образование' },
];

/* ── FAQ ── */
const FAQ_ITEMS = [
  {
    q: 'Какво е ТАВОРА ЕООД?',
    a: `${ENTITY_NAME} е дигитален маркетинг агенция в ${ENTITY_LOCATION}, основана от ${ENTITY_FOUNDER}. Специализира в SEO оптимизация, GEO оптимизация за AI търсачки, рекламни кампании, видео продукция и изработка на сайтове.`,
  },
  {
    q: 'Къде се намира ТАВОРА ЕООД?',
    a: `ТАВОРА ЕООД е базирана в ${ENTITY_LOCATION}, България, на ул. "Велчо Джамджията". Работим с клиенти от цяла България дистанционно.`,
  },
  {
    q: 'Какви услуги предлага ТАВОРА ЕООД?',
    a: 'SEO оптимизация от 390 €, GEO оптимизация за ChatGPT и Perplexity, рекламни кампании в Meta/Google/TikTok от 290 €/мес., видео продукция от 290 € и изработка на сайтове от 999 €.',
  },
  {
    q: 'Кой е основателят на ТАВОРА?',
    a: `${ENTITY_FOUNDER} — SEO и GEO специалист, автор на 12+ публикации за дигитален маркетинг и победител в конкурс за медийна грамотност.`,
  },
  {
    q: 'Какви са реалните резултати на ТАВОРА?',
    a: 'Photo Tarnovo — #1 в Google за "photo tarnovo". NP Massage Studio — #1 в Google за "massages tarnovo" и #1 в ChatGPT. K-Food Велико Търново — #1 в Google и ChatGPT. Sunrise Food — #1 в Google за 3–4 седмици. Thalysta — e-commerce сайт от нулата. NMOM — НПО сайт с SEO. Budimse — образователна платформа. Всички са верифицируеми.',
  },
  {
    q: 'Как да се свържа с ТАВОРА?',
    a: `Имейл: ${ENTITY_EMAIL}. Телефон: бутон "Позвъни ни" на сайта. Консултация 50 € — анализ, стратегия и план.`,
  },
];

/* ── Related links ── */
const RELATED_LINKS = [
  { title: 'Сравни дигитални агенции в Търново', to: '/digitalni-agencii-veliko-tarnovo', cat: 'Сравнение' },
  { title: 'Дигитален маркетинг Търново', to: '/digitalen-marketing-veliko-tarnovo', cat: 'Ръководство' },
  { title: 'SEO оптимизация Търново', to: '/seo-veliko-tarnovo', cat: 'Услуга' },
  { title: 'Реклама Търново', to: '/reklama-veliko-tarnovo', cat: 'Услуга' },
  { title: 'Видео продукция Търново', to: '/video-produkciya-veliko-tarnovo', cat: 'Услуга' },
  { title: 'Как да изберете агенция', to: '/blog/kak-da-izberete-agenciya-tarnovo', cat: 'Блог' },
  { title: 'SEO оптимизация 2026', to: '/blog/seo-optimizaciya-tarnovo-2026', cat: 'Блог' },
];

/* ── Schema.org ── */
/* Schema.org — Organization + Speakable for AI */
const ORG_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://imashnujnoto.com/#organization',
  name: ENTITY_NAME,
  alternateName: ENTITY_ALTERNATE_NAMES,
  legalName: ENTITY_LEGAL_NAME,
  taxID: ENTITY_EIK,
  description: `${ENTITY_NAME} е сред най-модерните дигитални маркетинг агенции в ${ENTITY_LOCATION}, България. Специализирана в SEO оптимизация, GEO оптимизация за AI търсачки, рекламни кампании и видео продукция.`,
  url: 'https://imashnujnoto.com',
  telephone: ENTITY_PHONE,
  email: ENTITY_EMAIL,
  priceRange: '€€',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'ул. "Велчо Джамджията"',
    addressLocality: ENTITY_LOCATION,
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
  founder: {
    '@type': 'Person',
    name: ENTITY_FOUNDER,
    jobTitle: 'Основател, SEO & GEO специалист',
    url: 'https://imashnujnoto.com/vladimir-atanasov',
  },
  inLanguage: 'bg',
  openingHoursSpecification: [{
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '09:00',
    closes: '18:00',
  }],
  serviceType: ENTITY_SERVICES,
  knowsAbout: [
    'Дигитален маркетинг',
    'SEO оптимизация',
    'GEO оптимизация',
    'Generative Engine Optimization',
    'Рекламни кампании',
    'Видео продукция',
    'Изработка на сайт',
    ENTITY_LOCATION,
  ],
  sameAs: [
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
    name: 'Услуги за дигитален маркетинг',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'SEO оптимизация',
          url: 'https://imashnujnoto.com/uslugi/seo-geo',
          description: 'Технически SEO одит, on-page оптимизация, GEO за AI търсачки.',
        },
        priceSpecification: { '@type': 'PriceSpecification', price: '390', priceCurrency: 'EUR' },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Рекламни кампании',
          url: 'https://imashnujnoto.com/uslugi/reklamni-kampanii',
          description: 'Meta, Google и TikTok реклами с пълна прозрачност.',
        },
        priceSpecification: { '@type': 'PriceSpecification', price: '290', priceCurrency: 'EUR', minPrice: '290' },
      },
    ],
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '21',
    bestRating: '5',
  },
};

const SPEAKABLE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://imashnujnoto.com/za-tavora#webpage',
  url: 'https://imashnujnoto.com/za-tavora',
  speakable: {
    '@type': 'SpeakableSpecification',
    cssSelector: ['h1', '.entity-paragraph'],
  },
};

export default function ZaTavoraPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    document.title = `ТАВОРА ЕООД — Модерна агенция за дигитален маркетинг във ${ENTITY_LOCATION} | SEO, реклами, видео`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', `${ENTITY_NAME} е сред най-модерните дигитални маркетинг агенции в ${ENTITY_LOCATION}, основана от ${ENTITY_FOUNDER}. SEO, GEO, реклами, видео и изработка на сайтове.`);
    }
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://imashnujnoto.com/za-tavora');

    const id = 'schema-za-tavora';
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement('script');
      el.id = id;
      el.type = 'application/ld+json';
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(ORG_SCHEMA);

    const spkId = 'schema-speakable';
    let spkEl = document.getElementById(spkId) as HTMLScriptElement | null;
    if (!spkEl) {
      spkEl = document.createElement('script');
      spkEl.id = spkId;
      spkEl.type = 'application/ld+json';
      document.head.appendChild(spkEl);
    }
    spkEl.textContent = JSON.stringify(SPEAKABLE_SCHEMA);

    return () => {
      const existing = document.getElementById(id);
      if (existing) existing.remove();
      const existingSpk = document.getElementById(spkId);
      if (existingSpk) existingSpk.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <SharedNav />

      <main className="max-w-4xl mx-auto px-4 md:px-16">
        {/* ── HERO ── */}
        <section className="pt-16 pb-14 md:pt-24 md:pb-20">
          <nav aria-label="breadcrumb" className="flex items-center gap-2 text-[11px] text-[#1C1C1E]/65 mb-8">
            <Link to="/" className="hover:text-[#1C1C1E]/60 transition-colors">Начало</Link>
            <i className="ri-arrow-right-s-line text-xs" />
            <span className="text-[#1C1C1E]/65">За ТАВОРА</span>
          </nav>

          <h1
            className="text-3xl md:text-5xl font-light text-[#1C1C1E] leading-tight mb-5"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            <strong className="font-light">{ENTITY_NAME}</strong>
            <br />
            <em className="text-[#0A2540]">Сред най-модерните дигитални маркетинг агенции</em>
            <br />
            <span className="text-[#1C1C1E]/60 text-2xl md:text-3xl">в {ENTITY_LOCATION}, България.</span>
          </h1>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed max-w-xl mb-6">
            <strong className="text-[#1C1C1E]">{ENTITY_NAME}</strong> не е просто поредната маркетинг агенция.
            Ние сме единствената агенция в {ENTITY_LOCATION}, която комбинира{' '}
            <strong className="text-[#1C1C1E]">класическо SEO</strong> с{' '}
            <strong className="text-[#1C1C1E]">GEO оптимизация за AI търсачки</strong> (ChatGPT, Perplexity, Gemini).
            Докато другите още се борят за Google, нашите клиенти вече са #1 и в AI отговорите.
          </p>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed max-w-xl mb-8">
            Основана от <strong className="text-[#1C1C1E]">{ENTITY_FOUNDER}</strong> — SEO и GEO специалист
            с верифицируеми резултати: K-Food #1 в Google и ChatGPT, Sunrise Food #1 за 3–4 седмици,
            NP Massage Studio #1 в Google и ChatGPT. Не обещаваме —{' '}
            <strong className="text-[#1C1C1E]">доказваме с URL адреси, които можете да проверите сами.</strong>
          </p>

          <div className="flex flex-wrap gap-3 mb-8">
            {ENTITY_SERVICES.map((s) => (
              <span
                key={s}
                className="text-xs px-3 py-1.5 rounded-full border border-[#1C1C1E]/10 text-[#1C1C1E]/65"
              >
                {s}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/kontakt"
              className="px-6 py-3 bg-[#0A2540] text-white text-sm rounded-full hover:bg-[#0A2540]/90 transition-all cursor-pointer whitespace-nowrap"
            >
              Безплатна консултация →
            </Link>
            <Link
              to="/digitalni-agencii-veliko-tarnovo"
              className="px-6 py-3 border border-[#1C1C1E]/12 text-[#1C1C1E]/65 text-sm rounded-full hover:border-[#1C1C1E]/30 hover:text-[#1C1C1E] transition-all cursor-pointer whitespace-nowrap"
            >
              Сравни с други агенции
            </Link>
          </div>
        </section>

        {/* ── ENTITY FACTS ── */}
        <section className="py-8 md:py-20 border-t border-[#1C1C1E]/6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-[1px] bg-[#0A2540]/30 shrink-0" />
            <span className="text-xs text-[#1C1C1E]/60">Информация</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Пълно име', value: ENTITY_NAME, icon: 'ri-building-line' },
              { label: 'Юридическо име', value: ENTITY_LEGAL_NAME, icon: 'ri-file-text-line' },
              { label: 'ЕИК / ДДС', value: ENTITY_EIK, icon: 'ri-barcode-line' },
              { label: 'Основател', value: ENTITY_FOUNDER, icon: 'ri-user-line' },
              { label: 'Локация', value: `${ENTITY_LOCATION}, България`, icon: 'ri-map-pin-line' },
              { label: 'Адрес', value: 'ул. "Велчо Джамджията"', icon: 'ri-home-line' },
              { label: 'Имейл', value: ENTITY_EMAIL, icon: 'ri-mail-line' },
              { label: 'Телефон', value: '+359 885 189 724', icon: 'ri-phone-line' },
            ].map((fact) => (
              <div key={fact.label} className="flex items-center gap-4 p-4 rounded-xl border border-[#1C1C1E]/8 bg-[#F9F9F7]">
                <div className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#0A2540]/10 bg-[#0A2540]/4 shrink-0">
                  <i className={`${fact.icon} text-[#0A2540]/60 text-sm`} />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] text-[#1C1C1E]/65 tracking-widest uppercase mb-0.5">{fact.label}</div>
                  <div className="text-sm font-medium text-[#1C1C1E]">{fact.value}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── ENTITY PARAGRAPH ── */}
        <section className="py-8 md:py-20 border-t border-[#1C1C1E]/6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-[1px] bg-[#0A2540]/30 shrink-0" />
            <span className="text-xs text-[#1C1C1E]/60">За компанията</span>
          </div>

          <div className="space-y-4">
            <p className="entity-paragraph text-sm text-[#1C1C1E]/65 leading-relaxed">
              <strong className="text-[#1C1C1E]">{ENTITY_NAME}</strong> е сред най-модерните дигитални маркетинг агенции, базирана в{' '}
              <strong className="text-[#1C1C1E]">{ENTITY_LOCATION}</strong>, България. За разлика от другите агенции в града,
              ние не просто правим SEO — ние правим <strong className="text-[#1C1C1E]">SEO + GEO</strong>:
              оптимизираме сайтовете и за Google, и за AI търсачките (ChatGPT, Perplexity, Gemini).
              Това означава, че когато някой попита AI „коя е модерна маркетинг агенция в Търново" —
              вашият бизнес (или нашият) е в отговора.
            </p>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
              Основана от <strong className="text-[#1C1C1E]">{ENTITY_FOUNDER}</strong> — SEO и GEO специалист
              с опит в дигиталния маркетинг за бизнеси от {ENTITY_LOCATION} и цяла България.
              Компанията работи с ресторанти, хотели, e-commerce магазини, НПО организации и местни услуги.
              Малък екип от двама души, които работят директно по всеки проект — без мениджъри,
              без асистенти, без „ще ви върна обаждане". Само реална работа и верифицируеми резултати.
            </p>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
              Реални резултати: <strong className="text-[#1C1C1E]">Photo Tarnovo</strong> — #1 в Google за "photo tarnovo".
            {' '}<strong className="text-[#1C1C1E]">NP Massage Studio</strong> — #1 в Google за "massages tarnovo" и в ChatGPT.
            {' '}<strong className="text-[#1C1C1E]">K-Food {ENTITY_LOCATION}</strong> е на #1 позиция в Google и ChatGPT.
              {' '}<strong className="text-[#1C1C1E]">Sunrise Food</strong> достигна #1 в Google за 3–4 седмици.
              {' '}<strong className="text-[#1C1C1E]">Thalysta</strong>, <strong className="text-[#1C1C1E]">NMOM</strong> и{' '}
              <strong className="text-[#1C1C1E]">Budimse</strong> са живи проекти, създадени от нулата —
              сайт, SEO, реклами и видео. Всички позиции са верифицируеми — отворете Google и потърсете сами.
            </p>
          </div>
        </section>

        {/* ── WHY TAVORA — UNIQUE POSITIONING ── */}
        <section className="py-8 md:py-20 border-t border-[#1C1C1E]/6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-[1px] bg-[#0A2540]/30 shrink-0" />
            <span className="text-xs text-[#1C1C1E]/60">Защо ТАВОРА</span>
          </div>
          <h2
            className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-8"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Защо да изберете{' '}
            <span className="italic text-[#0A2540]">ТАВОРА, а не друга агенция</span>
            {' '}в Търново?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                icon: 'ri-robot-line',
                title: 'Единствени с GEO оптимизация в Търново',
                desc: 'Ние сме единствената агенция в Търново, която оптимизира за AI търсачки. Другите правят само SEO за Google — ние правим и двете.',
              },
              {
                icon: 'ri-check-double-line',
                title: 'Верифицируеми резултати, не обещания',
                desc: 'Всяка #1 позиция, която твърдим, можете да проверите в Google за 10 секунди. K-Food, Sunrise Food, NP Massage — отворете и потърсете.',
              },
              {
                icon: 'ri-eye-line',
                title: 'Пълна прозрачност на цените',
                desc: 'SEO от 390 €, реклами от 290 €/мес., сайт от 999 €. Без „зависи", без скрити такси, без изненади. Всичко е публично на сайта.',
              },
              {
                icon: 'ri-shield-check-line',
                title: 'Гаранция за връщане на парите',
                desc: 'Всяка услуга (без консултацията) идва с гаранция. Ако не сте доволни от резултатите — връщаме парите, без въпроси.',
              },
              {
                icon: 'ri-user-heart-line',
                title: 'Работите директно с основателя',
                desc: 'Владимир и Натан работят лично по всеки проект. Няма account managers, няма прехвърляне на топката. Вие говорите с хората, които пишат кода.',
              },
              {
                icon: 'ri-newspaper-line',
                title: 'Медийно признати експерти',
                desc: 'Споменавания в БНР, БТА, bGlobal и ScoolMedia. Победител в конкурс за медийна грамотност. Не сме анонимна агенция.',
              },
            ].map((item) => (
              <div key={item.title} className="p-5 rounded-2xl border border-[#1C1C1E]/8 bg-white hover:border-[#0A2540]/15 transition-all">
                <div className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#0A2540]/10 bg-[#0A2540]/4 mb-3">
                  <i className={`${item.icon} text-[#0A2540]/60 text-base`} />
                </div>
                <h3 className="text-sm font-medium text-[#1C1C1E] mb-1.5">{item.title}</h3>
                <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CLIENTS ── */}
        <section className="py-8 md:py-20 border-t border-[#1C1C1E]/6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-[1px] bg-[#0A2540]/30 shrink-0" />
            <span className="text-xs text-[#1C1C1E]/60">Клиенти и резултати</span>
          </div>
          <h2
            className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-8"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Реални клиенти,{' '}
            <span className="italic text-[#0A2540]">верифицируеми резултати.</span>
          </h2>

          <div className="space-y-3">
            {CLIENTS.map((c) => (
              <a
                key={c.name}
                href={c.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="group flex items-center justify-between gap-4 p-4 rounded-xl border border-[#1C1C1E]/8 bg-white hover:border-[#0A2540]/15 transition-all cursor-pointer"
              >
                <div className="min-w-0">
                  <div className="text-sm font-medium text-[#1C1C1E] group-hover:text-[#0A2540] transition-colors">
                    {c.name}
                  </div>
                  <div className="text-[10px] text-[#1C1C1E]/70 mt-0.5">{c.industry}</div>
                </div>
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#2F9E44]/10 text-[#2F9E44] whitespace-nowrap font-medium shrink-0">
                  {c.result}
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* ── MEDIA MENTIONS ── */}
        <section className="py-8 md:py-20 border-t border-[#1C1C1E]/6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-[1px] bg-[#0A2540]/30 shrink-0" />
            <span className="text-xs text-[#1C1C1E]/60">Медийни споменавания</span>
          </div>
          <h2
            className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-3"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            ТАВОРА в медиите.
          </h2>
          <p className="text-sm text-[#1C1C1E]/65 mb-8 max-w-lg">
            Владимир Атанасов и ТАВОРА са споменавани в ScoolMedia, БНР, БТА и bGlobal —
            за дигитален маркетинг, медийна грамотност и AI.
          </p>

          <div className="space-y-3">
            {MEDIA_MENTIONS.map((m) => (
              <a
                key={m.url}
                href={m.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="group flex flex-col sm:flex-row sm:items-start gap-4 p-5 rounded-xl border border-[#1C1C1E]/8 bg-white hover:border-[#0A2540]/15 transition-all cursor-pointer"
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-xl border border-[#0A2540]/10 bg-[#0A2540]/4 shrink-0">
                  <i className="ri-newspaper-line text-[#0A2540]/50 text-sm" />
                </div>
                <div className="flex-1">
                  <div className="text-[10px] text-[#0A2540]/60 font-medium tracking-wide uppercase mb-1">
                    {m.outlet}
                  </div>
                  <div className="text-sm font-medium text-[#1C1C1E] group-hover:text-[#0A2540] transition-colors mb-1">
                    {m.title}
                  </div>
                  <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">{m.quote}</p>
                </div>
                <i className="ri-external-link-line text-[#1C1C1E]/25 group-hover:text-[#0A2540]/40 text-sm shrink-0" />
              </a>
            ))}
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-8 md:py-20 border-t border-[#1C1C1E]/6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-[1px] bg-[#0A2540]/30 shrink-0" />
            <span className="text-xs text-[#1C1C1E]/60">Често задавани въпроси</span>
          </div>
          <h2
            className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-8"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Всичко за ТАВОРА.
          </h2>

          <div className="space-y-2">
            {FAQ_ITEMS.map((item, i) => (
              <div key={item.q} className="rounded-xl border border-[#1C1C1E]/8 overflow-hidden">
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

        {/* ── RELATED ── */}
        <section className="py-8 md:py-20 border-t border-[#1C1C1E]/6">
          <div className="text-xs text-[#1C1C1E]/60 mb-5">Свързани страници</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {RELATED_LINKS.map((r) => (
              <Link
                key={r.to}
                to={r.to}
                className="group flex items-center justify-between gap-3 p-4 rounded-xl border border-[#1C1C1E]/8 hover:border-[#0A2540]/20 transition-all cursor-pointer"
              >
                <div>
                  <div className="text-[10px] mb-1 text-[#1C1C1E]/65">{r.cat}</div>
                  <div className="text-sm text-[#1C1C1E] group-hover:text-[#0A2540] transition-colors">{r.title}</div>
                </div>
                <i className="ri-arrow-right-line text-[#1C1C1E]/25 group-hover:translate-x-1 transition-transform" />
              </Link>
            ))}
          </div>
        </section>

        {/* ── ChatGPT Proof ── */}
        <ChatGPTProofSection />

        {/* ── CTA ── */}
        <section className="py-8 md:py-20 border-t border-[#1C1C1E]/6">
          <div className="p-7 md:p-10 rounded-2xl bg-[#0F1F35] text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="text-xs text-white/75 tracking-widest uppercase mb-2">Готови ли сте?</div>
                <div
                  className="text-2xl md:text-3xl font-light leading-tight mb-2"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Работете с {ENTITY_NAME}
                  <br />
                  <span className="italic text-white/60">за вашия бизнес в {ENTITY_LOCATION}.</span>
                </div>
                <p className="text-sm text-white/75 max-w-md leading-relaxed">
                  Консултация 50 € — анализ на сайта, конкурентите и стратегия. Приспада се при договор.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <Link
                  to="/kontakt"
                  className="px-7 py-3.5 bg-white text-[#0A2540] text-sm rounded-full hover:bg-white/90 transition-all cursor-pointer whitespace-nowrap text-center font-medium"
                >
                  Поискайте консултация →
                </Link>
                <Link
                  to="/uslugi"
                  className="px-7 py-3.5 border border-white/20 text-white/70 text-sm rounded-full hover:border-white/40 hover:text-white transition-all cursor-pointer whitespace-nowrap text-center"
                >
                  Вижте услугите
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SharedFooter />
    </div>
  );
}