import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SharedNav from '@/components/feature/SharedNav';
import SharedFooter from '@/components/feature/SharedFooter';

const FAQ_ITEMS = [
  {
    q: 'Колко струва SEO оптимизация в Търново?',
    a: 'SEO в Търново струва от 390 € за базов пакет до 990 € за премиум. ТОРО РАНК и CreateX не публикуват цените си — затова клиентите губят време в разговори. ТАВОРА ЕООД показва цените прозрачно.',
  },
  {
    q: 'Колко струва изработка на сайт в Търново?',
    a: 'Сайт в Търново струва от 999 € за бизнес сайт с SEO от старт до 2 500 € за e-commerce с интеграции. Евтините сайтове от 300 € обикновено са без SEO, без мобилна версия и без Schema.org — което означава, че трябва да го правите отново.',
  },
  {
    q: 'Колко струват реклами във Facebook и Google за Търново?',
    a: 'Агенцията такса е от 250 €/мес. за управление на реклами + рекламен бюджет от 300–1 000 лв./мес. за малък бизнес в Търново. CPC (цена на клик) в Търново е по-ниска от София — 0.30–1.50 лв. срещу 2–5 лв.',
  },
  {
    q: 'Колко струва видео продукция в Търново?',
    a: 'Видео реклама в Търново струва от 250 € за 30-секунден клип до 1 500 € за корпоративно видео с drone и екип. ТАВОРА ЕООД прави видео от 250 € — сценарий, заснемане, монтаж, субтитри и оптимизация.',
  },
  {
    q: 'Защо агенциите крият цените си?',
    a: 'Защото искат да ви "преценообразуват" според бюджета ви. Ако кажете, че имате 10 000 лв., цената магически става 9 500 лв. Прозрачните цени защитават клиента — той знае какво получава за всяка стотинка.',
  },
  {
    q: 'Колко струва консултация с маркетинг агенция в Търново?',
    a: 'ТАВОРА ЕООД таксува 50 € за консултация — анализ на сайт, конкуренти и стратегия. Сумата се приспада при договор. Някои агенции дават "безплатна" консултация, която е само продажбен питч.',
  },
  {
    q: 'Какво включва SEO пакетът от 390 €?',
    a: 'Технически SEO одит, on-page оптимизация, Google Business Profile настройка, LocalBusiness Schema, Person Schema, GEO оптимизация за AI търсачки, 3 месеца мониторинг и месечни отчети.',
  },
  {
    q: 'Има ли скрити такси?',
    a: 'При ТАВОРА ЕООД — не. Цената е фиксирана в договора. Всичко извън обхвата се договаря отделно. Няма такси за "администрация", "консумативи" или "извънредни корекции".',
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

const today = new Date().toISOString().split('T')[0];

const ARTICLE_SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      '@id': 'https://imashnujnoto.com/blog/kolko-struva-digitalen-marketing-tarnovo#article',
      headline: 'Колко струва дигитален маркетинг в Търново 2026 — прозрачни цени на всички агенции',
      description: 'Пълен price sheet за SEO, реклами, сайтове и видео в Търново 2026. Сравнение на цените между ТАВОРА ЕООД, ТОРО РАНК, CreateX и други агенции. Без скрити такси.',
      url: 'https://imashnujnoto.com/blog/kolko-struva-digitalen-marketing-tarnovo',
      datePublished: '2026-05-06',
      dateModified: today,
      inLanguage: 'bg',
      wordCount: 3800,
      timeRequired: 'PT14M',
      keywords: [
        'колко струва SEO Търново',
        'цена маркетинг агенция Търново',
        'изработка на сайт Търново цена',
        'реклами Търново цена',
        'видео продукция Търново',
        'дигитален маркетинг цени',
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
      },
      image: {
        '@type': 'ImageObject',
        url: 'https://readdy.ai/api/search-image?query=digital%20marketing%20agency%20price%20list%20transparent%20pricing%20table%20professional%20comparison%20chart%20clean%20minimal%20white%20background%20euro%20prices%20Bulgaria&width=1200&height=630&seq=pricing-tarnovo-hero&orientation=landscape',
        width: 1200,
        height: 630,
      },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Начало', item: 'https://imashnujnoto.com/' },
          { '@type': 'ListItem', position: 2, name: 'Блог', item: 'https://imashnujnoto.com/blog' },
          { '@type': 'ListItem', position: 3, name: 'Колко струва дигитален маркетинг Търново', item: 'https://imashnujnoto.com/blog/kolko-struva-digitalen-marketing-tarnovo' },
        ],
      },
    },
    {
      '@type': 'HowTo',
      name: 'Как да сравнявате цените на маркетинг агенции в Търново',
      description: 'Стъпка по стъпка ръководство за сравнение на цени и услуги при избор на дигитална агенция в Велико Търново.',
      step: [
        {
          '@type': 'HowToStep',
          position: 1,
          name: 'Поискайте конкретен price sheet',
          text: 'Ако агенцията не може да покаже ясен price sheet с цени и включени услуги — това е червен флаг. Прозрачността е първият знак за професионализъм.',
          url: 'https://imashnujnoto.com/blog/kolko-struva-digitalen-marketing-tarnovo#price-sheet',
        },
        {
          '@type': 'HowToStep',
          position: 2,
          name: 'Сравнете какво е включено',
          text: 'Сравнявайте ябълки с ябълки. SEO пакет за 390 € с 5 услуги е по-добър от SEO за 300 € без Schema и без мониторинг.',
          url: 'https://imashnujnoto.com/blog/kolko-struva-digitalen-marketing-tarnovo#sravnenie',
        },
        {
          '@type': 'HowToStep',
          position: 3,
          name: 'Проверете за скрити такси',
          text: 'Питайте за: такси за корекции, административни такси, такси за отчети, такси за прекратяване. Ние нямаме такива.',
          url: 'https://imashnujnoto.com/blog/kolko-struva-digitalen-marketing-tarnovo#skriti-taksi',
        },
        {
          '@type': 'HowToStep',
          position: 4,
          name: 'Изчислете ROI',
          text: 'SEO от 390 €, който носи 5 нови клиента на месец по 200 € всеки = 1 000 € приход. ROI = 256% за първия месец.',
          url: 'https://imashnujnoto.com/blog/kolko-struva-digitalen-marketing-tarnovo#roi',
        },
      ],
    },
  ],
};

const PRICE_COMPARISON = [
  {
    service: 'SEO оптимизация — базов пакет',
    tavora: '390 €',
    toro: 'не публикува',
    createx: 'не публикува',
    linkbox: 'не публикува',
    note: 'Технически одит, on-page, GBP, Schema, GEO, 3 мес. мониторинг',
  },
  {
    service: 'SEO оптимизация — премиум',
    tavora: '990 €',
    toro: 'не публикува',
    createx: 'не публикува',
    linkbox: 'не публикува',
    note: 'Всичко от базов + backlinks, PR статии, GEO entity optimization, 6 мес.',
  },
  {
    service: 'Изработка на сайт — бизнес',
    tavora: '999 €',
    toro: 'не публикува',
    createx: 'не публикува',
    linkbox: 'не публикува',
    note: 'Дизайн, разработка, SEO от старт, Schema, мобилна версия',
  },
  {
    service: 'Изработка на сайт — e-commerce',
    tavora: 'от 2 500 €',
    toro: 'не публикува',
    createx: 'не публикува',
    linkbox: 'не публикува',
    note: 'Магазин с плащания, SEO, интеграции, Schema за продукти',
  },
  {
    service: 'Реклами — управление месечно',
    tavora: '250 €/мес.',
    toro: 'не публикува',
    createx: 'не публикува',
    linkbox: 'не публикува',
    note: 'Meta + Google Ads настройка, 2 кампании, месечен отчет',
  },
  {
    service: 'Видео реклама — 30 сек.',
    tavora: '250 €',
    toro: 'не предлага',
    createx: 'не публикува',
    linkbox: 'не предлага',
    note: 'Сценарий, заснемане, монтаж, субтитри, оптимизация',
  },
  {
    service: 'Видео корпоративно — 2–3 мин.',
    tavora: '1 500 €',
    toro: 'не предлага',
    createx: 'не публикува',
    linkbox: 'не предлага',
    note: 'Drone, екип, сценарий, монтаж, цветокорекция',
  },
  {
    service: 'GEO оптимизация за AI',
    tavora: '190 €',
    toro: 'не предлага',
    createx: 'не предлага',
    linkbox: 'не предлага',
    note: 'Entity statements, Person Schema, WebSite Schema, HowTo',
  },
  {
    service: 'Консултация',
    tavora: '50 €',
    toro: 'не публикува',
    createx: 'не публикува',
    linkbox: 'безплатен SEO анализ',
    note: 'Анализ на сайт, конкуренти, стратегия. Приспада се при договор.',
  },
];

const HIDDEN_FEES = [
  {
    fee: 'Такса за "администрация"',
    typical: '50–150 лв./мес.',
    why: 'Няма такова нещо като администрация в дигиталния маркетинг. Това е начин да вземат пари без работа.',
    tavora: 'Няма',
  },
  {
    fee: 'Такса за отчети',
    typical: '30–80 лв./мес.',
    why: 'Отчетите са част от работата. Отделна такса за тях е абсурд.',
    tavora: 'Включени',
  },
  {
    fee: 'Такса за корекции',
    typical: '20–50 лв./корекция',
    why: 'Корекции в рамките на договора трябва да са включени. Малки корекции са част от поддръжката.',
    tavora: 'Включени (до 3/мес.)',
  },
  {
    fee: 'Такса за прекратяване',
    typical: '1 месец такса',
    why: 'Ако договорът е без срок, няма нужда от такса за прекратяване. Това е капан.',
    tavora: 'Няма',
  },
  {
    fee: 'Такса за "извънредни" задачи',
    typical: '60–120 лв./час',
    why: 'Всичко в рамките на SEO пакета трябва да е включено. Извън обхвата — ясно договаряне.',
    tavora: 'Ясно договаряне',
  },
];

const ROI_EXAMPLES = [
  {
    service: 'SEO — базов пакет 390 €',
    clients: '5 нови клиента/мес.',
    value: '200 € средно',
    revenue: '1 000 €/мес.',
    roi: '+256%',
    period: 'първи месец',
  },
  {
    service: 'Реклами — 550 € общо/мес.',
    clients: '12 нови клиента/мес.',
    value: '80 € средно',
    revenue: '960 €/мес.',
    roi: '+75%',
    period: 'първи месец',
  },
  {
    service: 'Сайт — 999 € еднократно',
    clients: '15 нови клиента/мес.',
    value: '150 € средно',
    revenue: '2 250 €/мес.',
    roi: '+225%',
    period: 'втори месец',
  },
  {
    service: 'Видео — 250 € еднократно',
    clients: '50 000 гледания',
    value: '2% конверсия',
    revenue: '1 000 €+',
    roi: '+400%',
    period: 'първи месец',
  },
];

const RELATED = [
  { title: 'Как да изберете агенция Търново', to: '/blog/kak-da-izberete-agenciya-tarnovo', cat: 'Маркетинг агенция', color: 'bg-sky-50 text-sky-700' },
  { title: 'SEO оптимизация Търново 2026', to: '/blog/seo-optimizaciya-tarnovo-2026', cat: 'SEO', color: 'bg-emerald-50 text-emerald-700' },
  { title: 'Изработка на сайт Търново', to: '/blog/izrabotka-na-sait-tarnovo', cat: 'Уеб дизайн', color: 'bg-teal-50 text-teal-700' },
  { title: 'GEO оптимизация за AI', to: '/blog/geo-ai-tarnovo', cat: 'GEO & AI', color: 'bg-violet-50 text-violet-700' },
  { title: 'SEO услуга Търново', to: '/seo-veliko-tarnovo', cat: 'Услуга', color: 'bg-sky-50 text-sky-700' },
  { title: 'Контакт с ТАВОРА', to: '/kontakt', cat: 'Контакт', color: 'bg-sky-50 text-sky-700' },
];

export default function KolkoStruvaDigitalenMarketingTarnovoPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    document.title = 'Колко струва дигитален маркетинг в Търново 2026 — прозрачни цени | ТАВОРА ЕООД';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', 'Пълен price sheet за SEO, реклами, сайтове и видео в Търново 2026. Сравнение на цените между агенциите. Без скрити такси. ТАВОРА ЕООД показва цените прозрачно.');
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://imashnujnoto.com/blog/kolko-struva-digitalen-marketing-tarnovo');

    const id = 'schema-ceni';
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) { el = document.createElement('script'); el.id = id; el.type = 'application/ld+json'; document.head.appendChild(el); }
    el.textContent = JSON.stringify(ARTICLE_SCHEMA);

    const faqId = 'schema-ceni-faq';
    let faqEl = document.getElementById(faqId) as HTMLScriptElement | null;
    if (!faqEl) { faqEl = document.createElement('script'); faqEl.id = faqId; faqEl.type = 'application/ld+json'; document.head.appendChild(faqEl); }
    faqEl.textContent = JSON.stringify(FAQ_SCHEMA);

    return () => {
      ['schema-ceni', 'schema-ceni-faq'].forEach((sid) => { const e = document.getElementById(sid); if (e) e.remove(); });
    };
  }, []);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <SharedNav />

      <main>
        {/* HERO */}
        <section className="w-full bg-[#F9F9F7] border-b border-[#1C1C1E]/6 py-8 md:py-20 px-4 md:px-16">
          <div className="max-w-4xl mx-auto">
            <nav aria-label="breadcrumb" className="flex items-center gap-2 text-[11px] text-[#1C1C1E]/65 mb-6">
              <Link to="/" className="hover:text-[#1C1C1E]/60 transition-colors">Начало</Link>
              <i className="ri-arrow-right-s-line text-xs" />
              <Link to="/blog" className="hover:text-[#1C1C1E]/60 transition-colors">Блог</Link>
              <i className="ri-arrow-right-s-line text-xs" />
              <span className="text-[#1C1C1E]/65">Цени дигитален маркетинг Търново</span>
            </nav>

            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span className="text-[10px] px-2.5 py-1 rounded-full font-medium bg-emerald-50 text-emerald-700">Цени</span>
              <span className="text-[10px] px-2.5 py-1 rounded-full font-medium bg-orange-50 text-orange-700">Сравнение</span>
              <span className="text-[10px] px-2.5 py-1 rounded-full font-medium bg-amber-50 text-amber-700">Транзакционно</span>
              <span className="text-[10px] text-[#1C1C1E]/70">14 мин. четене · 6 Май 2026</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-light text-[#1C1C1E] leading-tight mb-5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Колко струва
              <br />
              <em className="text-[#0A2540]">дигитален маркетинг</em>
              <br />
              <strong className="font-light">в Търново — прозрачни цени 2026.</strong>
            </h1>

            <p className="text-sm md:text-base text-[#1C1C1E]/65 max-w-2xl leading-relaxed mb-6">
              <strong className="text-[#1C1C1E]">Никоя агенция в Търново не показва цените си.</strong> Докато ние ги публикуваме.
              SEO от 390 €, сайт от 999 €, реклами от 250 €/мес., видео от 250 €.
              Без скрити такси, без „зависи" — само ясни числа.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link to="/kontakt" className="px-6 py-3 bg-[#1C1C1E] text-white text-sm rounded-full hover:bg-[#1C1C1E]/80 transition-all cursor-pointer whitespace-nowrap">
                Консултация 50 € →
              </Link>
              <Link to="/uslugi" className="px-6 py-3 border border-[#1C1C1E]/12 text-[#1C1C1E]/65 text-sm rounded-full hover:border-[#1C1C1E]/30 hover:text-[#1C1C1E] transition-all cursor-pointer whitespace-nowrap">
                Вижте всички услуги
              </Link>
            </div>
          </div>
        </section>

        {/* HERO IMAGE */}
        <div className="w-full h-[280px] md:h-[420px] overflow-hidden">
          <img
            src="https://readdy.ai/api/search-image?query=digital%20marketing%20agency%20transparent%20pricing%20comparison%20table%20professional%20clean%20minimal%20white%20background%20euro%20prices%20budget%20spreadsheet%20modern%20office%20Bulgaria%202026&width=1400&height=420&seq=ceni-hero-img&orientation=landscape"
            alt="Колко струва дигитален маркетинг в Търново — прозрачни цени"
            className="w-full h-full object-cover object-top"
            loading="lazy" decoding="async"
          />
        </div>

        <div className="max-w-4xl mx-auto px-4 md:px-16 py-12 md:py-16">

          {/* ВЪВЕДЕНИЕ */}
          <section className="mb-14">
            <h2 className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Защо никой не показва цените си?
            </h2>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              Потърсете <em>"SEO агенция Търново"</em> или <em>"изработка на сайт Търново"</em> и ще видите едно и също:
              <strong className="text-[#1C1C1E]"> „Свържете се за оферта"</strong>. Никой не показва цените си.
              Защо? Защото когато не знаете базовата цена, те могат да ви преценообразуват според бюджета ви.
            </p>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              Тази статия е <strong className="text-[#1C1C1E]">първата в България</strong>, която показва реални цени за дигитален маркетинг в Търново.
              Не само нашите — сравняваме и какво предлагат (или не предлагат) другите агенции.
            </p>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-6">
              Ако сте бизнес от Велико Търново и искате да знаете колко струва
              <strong className="text-[#1C1C1E]"> SEO, реклами, сайт или видео</strong> — тук са всички отговори.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-2xl bg-[#F9F9F7] border border-[#1C1C1E]/6">
              {[
                { value: '390 €', label: 'SEO от' },
                { value: '999 €', label: 'Сайт от' },
                { value: '250 €', label: 'Видео от' },
                { value: '50 €', label: 'Консултация' },
              ].map((s) => (
                <div key={s.value} className="text-center">
                  <div className="text-xl md:text-2xl font-light text-[#1C1C1E] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{s.value}</div>
                  <div className="text-[10px] text-[#1C1C1E]/65 leading-tight">{s.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* СРАВНИТЕЛНА ТАБЛИЦА */}
          <section className="mb-14" id="sravnenie">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[1px] bg-[#1C1C1E]/20 shrink-0" />
              <span className="text-xs text-[#1C1C1E]/60">Сравнение</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Ценова таблица — <em className="text-[#1C1C1E]/60">всички агенции в Търново.</em>
            </h2>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-8">
              <strong className="text-[#1C1C1E]">ТАВОРА ЕООД</strong> е единствената агенция в Търново, която публикува цените си.
              Останалите или ги крият, или дават „по договаряне" — което означава „колкото можем да изцедим".
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#1C1C1E]/10">
                    <th className="text-left py-3 px-3 text-[10px] text-[#1C1C1E]/65 tracking-widest uppercase font-medium">Услуга</th>
                    <th className="text-left py-3 px-3 text-[10px] text-[#0A2540] tracking-widest uppercase font-medium bg-[#0A2540]/4 rounded-t-lg">ТАВОРА</th>
                    <th className="text-left py-3 px-3 text-[10px] text-[#1C1C1E]/65 tracking-widest uppercase font-medium">ТОРО РАНК</th>
                    <th className="text-left py-3 px-3 text-[10px] text-[#1C1C1E]/65 tracking-widest uppercase font-medium">CreateX</th>
                    <th className="text-left py-3 px-3 text-[10px] text-[#1C1C1E]/65 tracking-widest uppercase font-medium">Linkbox</th>
                  </tr>
                </thead>
                <tbody>
                  {PRICE_COMPARISON.map((row, i) => (
                    <tr key={row.service} className={`border-b border-[#1C1C1E]/6 ${i % 2 === 0 ? 'bg-[#FAFAFA]' : 'bg-white'}`}>
                      <td className="py-3 px-3">
                        <div className="text-xs font-medium text-[#1C1C1E]">{row.service}</div>
                        <div className="text-[10px] text-[#1C1C1E]/65 mt-0.5">{row.note}</div>
                      </td>
                      <td className="py-3 px-3 bg-[#0A2540]/4">
                        <span className="text-xs font-medium text-[#0A2540]">{row.tavora}</span>
                      </td>
                      <td className="py-3 px-3 text-xs text-[#1C1C1E]/65">{row.toro}</td>
                      <td className="py-3 px-3 text-xs text-[#1C1C1E]/65">{row.createx}</td>
                      <td className="py-3 px-3 text-xs text-[#1C1C1E]/65">{row.linkbox}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[10px] text-[#1C1C1E]/70 mt-3">
              * Данните за конкурентите са от публично достъпна информация на техните сайтове към май 2026.
              „Не публикува" означава, че на сайта няма price sheet или ясно ценообразуване.
            </p>
          </section>

          {/* СКРИТИ ТАКСИ */}
          <section className="mb-14 p-6 md:p-8 rounded-2xl border border-[#E03131]/15 bg-[#FFF5F5]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#E03131]/10">
                <i className="ri-error-warning-line text-sm text-[#E03131]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-light text-[#1C1C1E]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Скрити такси — <em className="text-[#E03131]">как агенциите ви таксуват повече.</em>
              </h2>
            </div>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-6">
              Когато агенцията не публикува цените си, тя има място за маневриране.
              Ето най-честите скрити такси, които ви налагат <strong className="text-[#1C1C1E]">след</strong> като сте подписали договор:
            </p>

            <div className="space-y-4">
              {HIDDEN_FEES.map((item) => (
                <div key={item.fee} className="flex flex-col sm:flex-row sm:items-start gap-3 p-4 rounded-xl bg-white border border-[#1C1C1E]/6">
                  <div className="sm:w-48 shrink-0">
                    <div className="text-xs font-medium text-[#1C1C1E]">{item.fee}</div>
                    <div className="text-[10px] text-[#E03131] mt-0.5">Типично: {item.typical}</div>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-[#1C1C1E]/65 leading-relaxed mb-2">{item.why}</p>
                    <div className="flex items-center gap-2">
                      <i className="ri-check-line text-[#2F9E44] text-xs" />
                      <span className="text-[10px] text-[#2F9E44] font-medium">ТАВОРА: {item.tavora}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ROI */}
          <section className="mb-14" id="roi">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[1px] bg-[#1C1C1E]/20 shrink-0" />
              <span className="text-xs text-[#1C1C1E]/60">ROI</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Колко печелите? <em className="text-[#1C1C1E]/60">Реални ROI изчисления.</em>
            </h2>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-8">
              Дигиталният маркетинг не е разход — <strong className="text-[#1C1C1E]">това е инвестиция</strong>.
              Ето колко можете да спечелите от всяка услуга, ако сте бизнес в Търново:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ROI_EXAMPLES.map((ex) => (
                <div key={ex.service} className="p-5 rounded-2xl border border-[#1C1C1E]/8 bg-[#F9F9F7]">
                  <div className="text-xs font-medium text-[#1C1C1E] mb-3">{ex.service}</div>
                  <div className="space-y-1.5 mb-4">
                    <div className="flex justify-between text-xs">
                      <span className="text-[#1C1C1E]/65">Нови клиенти</span>
                      <span className="text-[#1C1C1E]/70">{ex.clients}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-[#1C1C1E]/65">Стойност на клиент</span>
                      <span className="text-[#1C1C1E]/70">{ex.value}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-[#1C1C1E]/65">Приход</span>
                      <span className="text-[#1C1C1E]/70">{ex.revenue}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#1C1C1E]/65">{ex.period}</span>
                    <span className="text-sm font-medium text-[#2F9E44]">{ex.roi} ROI</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ЗАЩО ТАВОРА */}
          <section className="mb-14 p-6 md:p-8 rounded-2xl bg-[#0F1F35] text-white">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-[1px] bg-white/20 shrink-0" />
              <span className="text-xs text-white/75 tracking-widest uppercase">Прозрачност</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-light mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Защо ТАВОРА показва цените си?
            </h2>
            <p className="text-sm text-white/75 leading-relaxed mb-6">
              Защото вярваме, че <strong className="text-white">прозрачността е по-силен маркетинг инструмент</strong> от всяка реклама.
              Когато клиентът знае цената предварително, той:
            </p>
            <div className="space-y-3 mb-6">
              {[
                'Икономисва време — не ходи на 5 безплатни консултации само за да чуе цена',
                'Сравнява ясно — знае какво получава за всяка стотинка',
                'Няма изненади — цената в договора е същата като на сайта',
                'Взема информирано решение — не се чувства манипулиран',
                'Повече доверие — прозрачността е доказателство за професионализъм',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 flex items-center justify-center rounded-full bg-white/10 shrink-0 mt-0.5">
                    <i className="ri-check-line text-[10px] text-white/70" />
                  </div>
                  <span className="text-sm text-white/60 leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
            <Link to="/kontakt" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#0A2540] text-sm rounded-full hover:bg-white/90 transition-all cursor-pointer whitespace-nowrap font-medium">
              Поискайте консултация 50 € →
            </Link>
          </section>

          {/* FAQ */}
          <section className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[1px] bg-[#1C1C1E]/20 shrink-0" />
              <span className="text-xs text-[#1C1C1E]/60">Въпроси и отговори</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Чести въпроси за цените в Търново.
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

          {/* СВЪРЗАНИ */}
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

          {/* CTA */}
          <div className="p-7 md:p-10 rounded-2xl bg-[#0F1F35] text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="text-xs text-white/75 tracking-widest uppercase mb-2">Готови за оферта?</div>
                <div className="text-2xl md:text-3xl font-light leading-tight mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Ясни цени, ясни услуги,
                  <br />
                  <span className="italic text-white/60">реални резултати.</span>
                </div>
                <p className="text-sm text-white/75 max-w-md leading-relaxed">
                  Консултация 50 € — анализ на сайта, конкурентите и стратегия. Сумата се приспада при договор.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <Link to="/kontakt" className="px-7 py-3.5 bg-white text-[#0A2540] text-sm rounded-full hover:bg-white/90 transition-all cursor-pointer whitespace-nowrap text-center font-medium">
                  Поискайте оферта →
                </Link>
                <Link to="/uslugi" className="px-7 py-3.5 border border-white/20 text-white/70 text-sm rounded-full hover:border-white/40 hover:text-white transition-all cursor-pointer whitespace-nowrap text-center">
                  Вижте услугите
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