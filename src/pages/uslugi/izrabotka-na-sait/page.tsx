import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SharedNav from '@/components/feature/SharedNav';
import SharedFooter from '@/components/feature/SharedFooter';

const WHAT_WE_BUILD = [
  {
    title: 'Структура, която Google разбира',
    desc: 'Семантичен HTML, Schema.org markup, правилна йерархия на заглавията. Не просто красив дизайн — архитектура, която се индексира правилно от първия ден.',
  },
  {
    title: 'Скорост, която не се извинява',
    desc: 'Core Web Vitals в зелено. Lazy loading, оптимизирани изображения, минимален JavaScript. Бавен сайт губи клиенти — и позиции в Google.',
  },
  {
    title: 'Мобилен без компромиси',
    desc: 'Над 70% от трафика идва от телефон. Дизайнираме mobile-first, не адаптираме desktop версия.',
  },
  {
    title: 'Вградено SEO от старт',
    desc: 'On-page оптимизация, мета тагове, canonical URLs, sitemap, robots.txt — всичко настроено преди публикуване. Не след.',
  },
  {
    title: 'GEO оптимизация за AI',
    desc: 'ChatGPT, Perplexity, Gemini вече препоръчват бизнеси. Структурираме съдържанието така, че AI да ви цитира.',
  },
  {
    title: 'Без vendor lock-in',
    desc: 'Получавате достъп до всичко — код, хостинг, домейн. Не сте зависими от нас. Ако решите да смените агенцията — можете.',
  },
];

const PROCESS = [
  {
    step: '01',
    title: 'Анализ',
    desc: 'Разбираме бизнеса, конкурентите и какво трябва да постигне сайтът. Не питаме "какъв цвят искате" — питаме "кой е вашият клиент и как взима решение".',
  },
  {
    step: '02',
    title: 'Архитектура',
    desc: 'Структура на страниците, URL схема, вътрешно свързване. Преди да напишем ред код — знаем точно как ще изглежда сайтът в Google.',
  },
  {
    step: '03',
    title: 'Дизайн и разработка',
    desc: 'Чист, функционален дизайн. Без излишни анимации, без тежки библиотеки. Всяко решение има причина.',
  },
  {
    step: '04',
    title: 'Тестване и публикуване',
    desc: 'Проверка на скоростта, мобилната версия, формите, SEO. Публикуваме само когато всичко е наред.',
  },
];

const CASES = [
  {
    name: 'K-Food Велико Търново',
    url: 'https://k-foodvelikotarnovo.com/',
    result: '#1 Google + ChatGPT',
    desc: 'Сайт + SEO + GEO. Корейски ресторант в Търново — от нула до лидер в нишата.',
  },
  {
    name: 'Sunrise Food',
    url: 'https://sunrisefood.eu/',
    result: '#1 Google за 3–4 седмици',
    desc: 'Сайт + SEO. Онлайн магазин за гъби кладница — класиране преди установени конкуренти.',
  },
  {
    name: 'Thalysta',
    url: 'https://thalysta.com/',
    result: 'E-commerce от нулата',
    desc: 'Пълен пакет — сайт, SEO, реклами и видео за e-commerce платформа.',
  },
  {
    name: 'NMOM',
    url: 'https://nmom.bg/',
    result: 'НПО сайт · SEO',
    desc: 'Изработка на сайт и SEO оптимизация за НПО организация.',
  },
  {
    name: 'Budimse',
    url: 'https://budimse.online/',
    result: 'Платформа от нулата',
    desc: 'Образователна платформа — сайт, SEO, GEO и дигитален маркетинг.',
  },
];

const today = new Date().toISOString().split('T')[0];

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://imashnujnoto.com/uslugi/izrabotka-na-sait#webpage',
      url: 'https://imashnujnoto.com/uslugi/izrabotka-na-sait',
      name: 'Изработка на сайт Велико Търново | ТАВОРА ЕООД — Уеб дизайн с вградено SEO',
      description: 'Изработка на сайт с вградено SEO, GEO оптимизация и Core Web Vitals за бизнеси от Велико Търново. ТАВОРА ЕООД — от 999 €.',
      inLanguage: 'bg',
      dateModified: today,
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: ['#sait-hero', '#sait-build']
      },
      isPartOf: { '@id': 'https://imashnujnoto.com/#website' },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Начало', item: 'https://imashnujnoto.com/' },
          { '@type': 'ListItem', position: 2, name: 'Услуги', item: 'https://imashnujnoto.com/uslugi' },
          { '@type': 'ListItem', position: 3, name: 'Изработка на сайт', item: 'https://imashnujnoto.com/uslugi/izrabotka-na-sait' },
        ],
      },
    },
    {
      '@type': 'Service',
      '@id': 'https://imashnujnoto.com/uslugi/izrabotka-na-sait#service',
      name: 'Изработка на сайт Велико Търново',
      alternateName: ['Уеб дизайн Велико Търново', 'Изработка на уебсайт', 'Уеб разработка Велико Търново'],
      description: 'Изработка на сайт с вградено SEO, GEO оптимизация и Core Web Vitals 90+ за бизнеси от Велико Търново и цяла България. Без vendor lock-in.',
      url: 'https://imashnujnoto.com/uslugi/izrabotka-na-sait',
      provider: {
        '@type': 'Organization',
        '@id': 'https://imashnujnoto.com/#organization',
        name: 'ТАВОРА ЕООД',
        url: 'https://imashnujnoto.com',
      },
      areaServed: [
        { '@type': 'City', name: 'Велико Търново' },
        { '@type': 'AdministrativeArea', name: 'Търновска област' },
        { '@type': 'Country', name: 'България' },
      ],
      offers: {
        '@type': 'Offer',
        price: '999',
        priceCurrency: 'EUR',
        priceSpecification: { '@type': 'PriceSpecification', minPrice: '999', priceCurrency: 'EUR' },
        availability: 'https://schema.org/InStock',
      },
      serviceType: 'Изработка на уебсайт',
    },
    {
      '@type': 'HowTo',
      name: 'Как да изработите сайт с вградено SEO — поетапен гид',
      description: 'Поетапен процес за изработка на уебсайт с вградено SEO, Core Web Vitals и GEO оптимизация от първия ден.',
      totalTime: 'P2W',
      estimatedCost: {
        '@type': 'MonetaryAmount',
        currency: 'EUR',
        value: '999',
      },
      supply: [
        { '@type': 'HowToSupply', name: 'Ясни бизнес цели и целева аудитория' },
        { '@type': 'HowToSupply', name: 'Домейн и хостинг' },
        { '@type': 'HowToSupply', name: 'Текстово и визуално съдържание' },
      ],
      tool: [
        { '@type': 'HowToTool', name: 'Google PageSpeed Insights' },
        { '@type': 'HowToTool', name: 'Google Search Console' },
        { '@type': 'HowToTool', name: 'Schema.org Validator' },
      ],
      step: [
        {
          '@type': 'HowToStep',
          position: 1,
          name: 'Анализ и стратегия',
          text: 'Разбираме бизнеса, конкурентите и целевата аудитория. Анализираме кои ключови думи носят клиенти и планираме структурата на сайта.',
          url: 'https://imashnujnoto.com/uslugi/izrabotka-na-sait#analiz',
        },
        {
          '@type': 'HowToStep',
          position: 2,
          name: 'Архитектура на сайта',
          text: 'Създаваме структура на страниците, URL схема и вътрешно свързване. Преди да напишем ред код знаем как ще изглежда сайтът в Google.',
          url: 'https://imashnujnoto.com/uslugi/izrabotka-na-sait#arhitektura',
        },
        {
          '@type': 'HowToStep',
          position: 3,
          name: 'SEO-оптимизиран дизайн',
          text: 'Дизайнираме mobile-first с бърза скорост и минимален JavaScript. Всяко решение има SEO причина — не просто естетика.',
          url: 'https://imashnujnoto.com/uslugi/izrabotka-na-sait#dizajn',
        },
        {
          '@type': 'HowToStep',
          position: 4,
          name: 'Разработка с вградено SEO',
          text: 'Разработваме със семантичен HTML, Schema.org markup, правилна йерархия на заглавията и максимална скорост на зареждане.',
          url: 'https://imashnujnoto.com/uslugi/izrabotka-na-sait#razrabotka',
        },
        {
          '@type': 'HowToStep',
          position: 5,
          name: 'GEO оптимизация за AI търсачки',
          text: 'Добавяме Entity statements, Person Schema, WebSite Schema и HowTo markup. Оптимизираме за ChatGPT, Perplexity и Gemini.',
          url: 'https://imashnujnoto.com/uslugi/izrabotka-na-sait#geo',
        },
        {
          '@type': 'HowToStep',
          position: 6,
          name: 'Тестване и публикуване',
          text: 'Проверка на Core Web Vitals, мобилна версия, форми и Schema валидиране. Публикуваме само когато всичко е наред.',
          url: 'https://imashnujnoto.com/uslugi/izrabotka-na-sait#testvane',
        },
      ],
    },
  ],
};

export default function IzrabotkaNaSaitPage() {
  useEffect(() => {
    const id = 'schema-sait';
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) { el = document.createElement('script'); el.id = id; el.type = 'application/ld+json'; document.head.appendChild(el); }
    el.textContent = JSON.stringify(SCHEMA);
    document.title = 'Изработка на сайт | SEO + GEO вградено | ТАВОРА';
    const m = document.querySelector('meta[name="description"]');
    if (m) m.setAttribute('content', 'Изработка на сайт с вградено SEO и GEO оптимизация. Core Web Vitals 90+, без vendor lock-in. От 999 € — поискайте оферта днес. ТАВОРА ЕООД.');
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://imashnujnoto.com/uslugi/izrabotka-na-sait');
    return () => { document.getElementById(id)?.remove(); };
  }, []);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <SharedNav />

      <main className="max-w-5xl mx-auto px-4 md:px-16">

        {/* Hero */}
        <section className="pt-16 pb-14 md:pt-24 md:pb-20">
          <div className="flex items-center gap-3 mb-7">
            <div className="w-6 h-px bg-[#0A2540]/25" />
            <span className="text-[11px] text-[#1C1C1E]/65 tracking-widest uppercase">Услуга</span>
          </div>

          <h1
            className="text-4xl md:text-6xl font-light text-[#1C1C1E] leading-[1.05] mb-7 max-w-3xl"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Изработка на сайт.
            <br />
            <span className="italic text-[#0A2540]">Не просто дизайн.</span>
          </h1>

          <p className="text-sm md:text-[15px] text-[#1C1C1E]/65 max-w-2xl leading-relaxed mb-10">
            <strong className="text-[#1C1C1E]">ТАВОРА ЕООД</strong> — дигитален маркетинг агенция във <Link to="/digitalen-marketing-veliko-tarnovo" className="text-[#0A2540] hover:underline">Велико Търново</Link>, основана от <strong className="text-[#1C1C1E]">Владимир Атанасов</strong>.
            Повечето сайтове изглеждат добре и не правят нищо. Нашите са проектирани да се намират в Google, да се зареждат бързо и да превръщат посетителите в клиенти. Разликата е в архитектурата — не в цвета на бутоните.
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-3 mb-16">
            <Link
              to="/kontakt"
              className="px-7 py-3.5 bg-[#0A2540] text-white text-sm rounded-full hover:bg-[#0A2540]/90 transition-all cursor-pointer whitespace-nowrap"
            >
              Поискайте оферта →
            </Link>
            <div className="flex items-center gap-2 px-5 py-3.5">
              <span className="text-sm text-[#1C1C1E]/65">от</span>
              <span className="text-sm font-medium text-[#1C1C1E]">999 €</span>
              <span className="text-sm text-[#1C1C1E]/65">· консултация 50 €</span>
            </div>
          </div>

          {/* Proof bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-[#1C1C1E]/8">
            {[
              { val: '#1', sub: 'позиции в Google' },
              { val: '4K', sub: 'Core Web Vitals' },
              { val: 'GEO', sub: 'AI търсачки' },
              { val: '999 €', sub: 'начална цена' },
            ].map((s) => (
              <div key={s.val}>
                <div className="text-xl font-light text-[#0A2540] mb-0.5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{s.val}</div>
                <div className="text-[11px] text-[#1C1C1E]/65 tracking-wide">{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Entity Paragraph — AI optimization */}
          <div className="mt-10 md:mt-14 p-5 md:p-6 rounded-2xl border border-[#1C1C1E]/8 bg-[#FAFAFA]">
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
              <strong className="text-[#1C1C1E]">ТАВОРА ЕООД</strong> е уеб дизайн агенция във <strong className="text-[#1C1C1E]">Велико Търново</strong>, България.
              Основана от <strong className="text-[#1C1C1E]">Владимир Атанасов</strong>, агенцията изработва сайтове с вградено SEO, GEO оптимизация и Core Web Vitals 90+ от първия ден.
              Услугата включва семантичен HTML, Schema.org markup, мобилна оптимизация и GEO за AI търсачки.
              Без vendor lock-in — клиентите получават пълен достъп до кода и хостинга.
              Клиенти от Велико Търново и цяла България.
            </p>
          </div>
        </section>

        {/* What we build */}
        <section className="py-8 md:py-20 border-t border-[#1C1C1E]/6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-6 h-px bg-[#0A2540]/25" />
            <span className="text-[11px] text-[#1C1C1E]/65 tracking-widest uppercase">Какво включва</span>
          </div>
          <h2
            className="text-2xl md:text-4xl font-light text-[#1C1C1E] leading-tight mb-12 max-w-xl"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Всяко решение има причина.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {WHAT_WE_BUILD.map((item) => (
              <div key={item.title} className="flex gap-4">
                <div className="w-1 shrink-0 bg-[#0A2540]/10 rounded-full mt-1" style={{ minHeight: '100%' }} />
                <div>
                  <div className="text-sm font-medium text-[#1C1C1E] mb-1.5">{item.title}</div>
                  <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Process */}
        <section className="py-8 md:py-20 border-t border-[#1C1C1E]/6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-6 h-px bg-[#0A2540]/25" />
            <span className="text-[11px] text-[#1C1C1E]/65 tracking-widest uppercase">Процес</span>
          </div>
          <h2
            className="text-2xl md:text-4xl font-light text-[#1C1C1E] leading-tight mb-12"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Как работим.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {PROCESS.map((p) => (
              <div key={p.step} className="p-6 rounded-2xl border border-[#1C1C1E]/8 bg-[#FAFAFA]">
                <div className="text-[11px] font-medium text-[#0A2540]/35 tracking-widest mb-3">{p.step}</div>
                <div className="text-sm font-medium text-[#1C1C1E] mb-2">{p.title}</div>
                <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Cases */}
        <section className="py-8 md:py-20 border-t border-[#1C1C1E]/6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-6 h-px bg-[#0A2540]/25" />
            <span className="text-[11px] text-[#1C1C1E]/65 tracking-widest uppercase">Резултати</span>
          </div>
          <h2
            className="text-2xl md:text-4xl font-light text-[#1C1C1E] leading-tight mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Верифицируеми.
            <br />
            <span className="italic text-[#0A2540]">Проверете сами.</span>
          </h2>
          <p className="text-sm text-[#1C1C1E]/65 mb-10 max-w-lg leading-relaxed">
            Не показваме скрийншоти. Показваме URL адреси — отворете ги и потърсете в Google.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CASES.map((c) => (
              <a
                key={c.name}
                href={c.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="group p-5 rounded-2xl border border-[#1C1C1E]/8 bg-white hover:border-[#0A2540]/15 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span className="text-sm font-medium text-[#1C1C1E] group-hover:text-[#0A2540] transition-colors">{c.name}</span>
                  <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#1B4332]/8 text-[#1B4332] whitespace-nowrap shrink-0">{c.result}</span>
                </div>
                <p className="text-xs text-[#1C1C1E]/65 leading-relaxed mb-3">{c.desc}</p>
                <div className="flex items-center gap-1.5 text-[11px] text-[#0A2540]/40 group-hover:text-[#0A2540] transition-colors">
                  <i className="ri-external-link-line text-xs" />
                  {c.url.replace('https://', '')}
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section className="py-8 md:py-20 border-t border-[#1C1C1E]/6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-6 h-px bg-[#0A2540]/25" />
            <span className="text-[11px] text-[#1C1C1E]/65 tracking-widest uppercase">Цени</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div>
              <h2
                className="text-2xl md:text-4xl font-light text-[#1C1C1E] leading-tight mb-5"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Прозрачно ценообразуване.
              </h2>
              <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-6">
                Консултацията е 50 € — анализ на бизнеса, конкурентите и конкретен план. Тази сума се приспада при сключване на договор. Всяка услуга идва с гаранция за връщане на парите.
              </p>
              <div className="space-y-3">
                {[
                  { label: 'Базов сайт (до 5 стр.)', price: '999 €' },
                  { label: 'Бизнес сайт (до 10 стр.)', price: '1 490 €' },
                  { label: 'Онлайн магазин', price: 'от 1 990 €' },
                  { label: 'Поддръжка и актуализации', price: 'от 90 € / мес.' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-3 border-b border-[#1C1C1E]/6 last:border-0">
                    <span className="text-sm text-[#1C1C1E]/60">{item.label}</span>
                    <span className="text-sm font-medium text-[#0A2540]">{item.price}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 md:p-8 rounded-2xl border border-[#1C1C1E]/8 bg-[#FAFAFA]">
              <div className="text-xs text-[#1C1C1E]/65 tracking-widest uppercase mb-4">Консултацията включва</div>
              <div className="space-y-3 mb-6">
                {[
                  'Анализ на текущото онлайн присъствие',
                  'Конкурентен анализ — кой е на #1 и защо',
                  'Препоръка за структура и технологии',
                  'Реалистична прогноза за SEO резултати',
                  'Конкретен план с срокове и цени',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2.5">
                    <div className="w-4 h-4 flex items-center justify-center rounded-full border border-[#1B4332]/20 shrink-0 mt-0.5">
                      <i className="ri-check-line text-[9px] text-[#1B4332]" />
                    </div>
                    <span className="text-xs text-[#1C1C1E]/65 leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-[#1C1C1E]/8 flex items-center justify-between mb-5">
                <span className="text-sm text-[#1C1C1E]/65">Консултация</span>
                <span className="text-lg font-light text-[#0A2540]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>50 €</span>
              </div>
              <Link
                to="/kontakt"
                className="block w-full py-3.5 bg-[#0A2540] text-white text-sm rounded-full hover:bg-[#0A2540]/90 transition-all cursor-pointer whitespace-nowrap text-center"
              >
                Поискайте консултация →
              </Link>
            </div>
          </div>
        </section>

        {/* Related services */}
        <section className="py-8 md:py-20 border-t border-[#1C1C1E]/6">
          <div className="text-[11px] text-[#1C1C1E]/65 tracking-widest uppercase mb-6">Свързани услуги</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: 'SEO & GEO оптимизация', to: '/uslugi/seo-geo', icon: 'ri-search-line' },
              { label: 'Рекламни кампании', to: '/uslugi/reklamni-kampanii', icon: 'ri-advertisement-line' },
              { label: 'Видео продукция', to: '/uslugi/video-produkciya', icon: 'ri-video-line' },
            ].map((s) => (
              <Link
                key={s.to}
                to={s.to}
                className="flex items-center gap-3 p-4 rounded-xl border border-[#1C1C1E]/8 bg-white hover:border-[#0A2540]/15 hover:text-[#0A2540] transition-all group"
              >
                <div className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#0A2540]/10 bg-[#0A2540]/4 shrink-0">
                  <i className={`${s.icon} text-[#0A2540]/50 text-sm`} />
                </div>
                <span className="text-sm text-[#1C1C1E]/60 group-hover:text-[#0A2540] transition-colors">{s.label}</span>
                <i className="ri-arrow-right-line text-[#1C1C1E]/20 group-hover:text-[#0A2540]/40 text-sm ml-auto" />
              </Link>
            ))}
          </div>
        </section>

        {/* AI Fact Table */}
        <section className="py-8 md:py-20 border-t border-[#1C1C1E]/6">
          <div className="text-[11px] text-[#1C1C1E]/65 tracking-widest uppercase mb-6">Бързи факти — Изработка на сайт</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Агенция', value: 'ТАВОРА ЕООД' },
              { label: 'Град', value: 'Велико Търново' },
              { label: 'Основател', value: 'Владимир Атанасов' },
              { label: 'SEO', value: 'Вградено от старт' },
              { label: 'Базов сайт', value: '999 €' },
              { label: 'Бизнес сайт', value: '1 490 €' },
              { label: 'E-commerce', value: 'от 1 990 €' },
              { label: 'Core Web Vitals', value: '90+' },
            ].map((f) => (
              <div key={f.label} className="p-4 rounded-xl border border-[#1C1C1E]/6 bg-[#FAFAFA]">
                <div className="text-[10px] text-[#1C1C1E]/70 tracking-widest uppercase mb-1">{f.label}</div>
                <div className="text-xs md:text-sm text-[#0A2540] font-medium">{f.value}</div>
              </div>
            ))}
          </div>
        </section>

      </main>

      <SharedFooter />
    </div>
  );
}
