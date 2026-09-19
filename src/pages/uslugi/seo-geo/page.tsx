import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SharedNav from '@/components/feature/SharedNav';
import SharedFooter from '@/components/feature/SharedFooter';

const WHAT_INCLUDED = [
  {
    title: 'On-page SEO',
    desc: 'Заглавия, мета описания, H1–H6 йерархия, вътрешно свързване, canonical URLs. Всичко, което Google чете преди да реши дали да ви покаже.',
  },
  {
    title: 'Технически SEO',
    desc: 'Core Web Vitals, скорост на зареждане, мобилна оптимизация, crawlability. Ако Google не може да обходи сайта ви — нищо друго няма значение.',
  },
  {
    title: 'Google Business Profile',
    desc: 'Създаване и оптимизация на GBP. Критично за локален бизнес — появявате се в Google Maps и в локалните резултати преди органичните.',
  },
  {
    title: 'Schema.org структурирани данни',
    desc: 'LocalBusiness, Product, FAQ, Article markup. Google разбира точно какво правите — и го показва с rich snippets в резултатите.',
  },
  {
    title: 'GEO — оптимизация за AI',
    desc: 'ChatGPT, Perplexity, Gemini вече препоръчват бизнеси. Структурираме съдържанието така, че когато някой пита AI — вашият бизнес е в отговора.',
  },
  {
    title: 'Ключови думи и конкурентен анализ',
    desc: 'Намираме ключовите думи с реален търговски интент — не тези с най-голям обем, а тези, от които идват клиенти.',
  },
];

const RESULTS = [
  {
    name: 'K-Food Велико Търново',
    url: 'https://k-foodvelikotarnovo.com/',
    keyword: 'корейска храна велико търново',
    result: '#1 Google + ChatGPT',
    time: '2–3 месеца',
  },
  {
    name: 'Sunrise Food',
    url: 'https://sunrisefood.eu/',
    keyword: 'гъби кладница онлайн',
    result: '#1 Google',
    time: '3–4 седмици',
  },
  {
    name: 'Thalysta',
    url: 'https://thalysta.com/',
    keyword: 'e-commerce платформа',
    result: 'Пълен пакет',
    time: 'От нулата',
  },
  {
    name: 'NMOM',
    url: 'https://nmom.bg/',
    keyword: 'НПО онлайн присъствие',
    result: 'Сайт + SEO',
    time: 'От нулата',
  },
  {
    name: 'Budimse',
    url: 'https://budimse.online/',
    keyword: 'образователна платформа',
    result: 'Платформа от нулата',
    time: 'От нулата',
  },
];

const today = new Date().toISOString().split('T')[0];

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://imashnujnoto.com/uslugi/seo-geo#webpage',
      url: 'https://imashnujnoto.com/uslugi/seo-geo',
      name: 'SEO & GEO оптимизация Велико Търново | ТАВОРА ЕООД — #1 в Google и AI търсачки',
      description: 'SEO и GEO оптимизация за бизнеси от Велико Търново. On-page SEO, Google Business Profile, Schema.org, оптимизация за ChatGPT и Perplexity. ТАВОРА ЕООД — 390 € еднократно.',
      inLanguage: 'bg',
      dateModified: today,
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: ['#seo-hero', '#seo-included']
      },
      isPartOf: { '@id': 'https://imashnujnoto.com/#website' },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Начало', item: 'https://imashnujnoto.com/' },
          { '@type': 'ListItem', position: 2, name: 'Услуги', item: 'https://imashnujnoto.com/uslugi' },
          { '@type': 'ListItem', position: 3, name: 'SEO & GEO оптимизация', item: 'https://imashnujnoto.com/uslugi/seo-geo' },
        ],
      },
    },
    {
      '@type': 'Service',
      '@id': 'https://imashnujnoto.com/uslugi/seo-geo#service',
      name: 'SEO & GEO оптимизация Велико Търново',
      alternateName: ['SEO оптимизация Велико Търново', 'GEO оптимизация', 'Generative Engine Optimization'],
      description: 'Пълна SEO и GEO оптимизация за бизнеси от Велико Търново и цяла България. On-page SEO, Google Business Profile, Schema.org структурирани данни, оптимизация за ChatGPT, Perplexity и Gemini.',
      url: 'https://imashnujnoto.com/uslugi/seo-geo',
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
        price: '390',
        priceCurrency: 'EUR',
        priceSpecification: { '@type': 'PriceSpecification', price: '390', priceCurrency: 'EUR' },
        availability: 'https://schema.org/InStock',
      },
      serviceType: 'SEO & GEO оптимизация',
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'SEO & GEO пакети',
        itemListElement: [
          { '@type': 'Offer', name: 'SEO пакет', price: '390', priceCurrency: 'EUR' },
          { '@type': 'Offer', name: 'GEO оптимизация', price: '390', priceCurrency: 'EUR' },
          { '@type': 'Offer', name: 'SEO + GEO комбо', price: '590', priceCurrency: 'EUR' },
        ],
      },
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://imashnujnoto.com/uslugi/seo-geo#faq',
      mainEntity: [
        { '@type': 'Question', name: 'Колко струва SEO оптимизация?', acceptedAnswer: { '@type': 'Answer', text: 'Еднократният SEO пакет е 390 €. Включва on-page оптимизация, Google Business Profile настройка и Schema.org структурирани данни. SEO одитът е 50 € и сумата се приспада при сключване на договор.' } },
        { '@type': 'Question', name: 'Колко време отнема SEO оптимизацията?', acceptedAnswer: { '@type': 'Answer', text: 'Първите резултати се виждат за 3–4 седмици. Пълното класиране за конкурентни ключови думи отнема 2–6 месеца в зависимост от конкуренцията и състоянието на сайта.' } },
        { '@type': 'Question', name: 'Какво е GEO оптимизация?', acceptedAnswer: { '@type': 'Answer', text: 'GEO (Generative Engine Optimization) е оптимизация на съдържанието за AI търсачки като ChatGPT, Perplexity, Gemini и Google AI Overviews. Целта е бизнесът да бъде цитиран директно в AI отговорите.' } },
        { '@type': 'Question', name: 'Работи ли GEO за ChatGPT?', acceptedAnswer: { '@type': 'Answer', text: 'Да. С правилна оптимизация (Schema.org, entity graph, ясни факти, Q&A формат), ChatGPT започва да цитира бизнеса в отговорите си. Пример: K-Food Велико Търново се появява в ChatGPT при запитване за корейска храна в Търново.' } },
        { '@type': 'Question', name: 'Каква е разликата между SEO и GEO?', acceptedAnswer: { '@type': 'Answer', text: 'SEO цели класиране в Google (сини линкове). GEO цели цитиране в AI отговори. SEO работи с ключови думи и backlinks. GEO работи с entity optimization и структурирани данни. Двете се допълват.' } },
        { '@type': 'Question', name: 'Какво представлява AI оптимизацията?', acceptedAnswer: { '@type': 'Answer', text: 'AI оптимизацията е цялостен подход, включващ GEO, AEO и LLM оптимизация за увеличаване на видимостта във всички AI-базирани търсачки — ChatGPT, Perplexity, Claude и Gemini.' } },
      ],
    },
    {
      '@type': 'Person',
      '@id': 'https://imashnujnoto.com/#founder',
      name: 'Владимир Веселинов Атанасов',
      jobTitle: 'Основател и SEO специалист',
      worksFor: { '@id': 'https://imashnujnoto.com/#organization' },
      knowsAbout: ['SEO оптимизация', 'GEO оптимизация', 'Дигитален маркетинг', 'Велико Търново'],
      url: 'https://imashnujnoto.com/ekip',
      sameAs: [
        'https://imashnujnoto.com/vladimir-atanasov',
        'https://www.linkedin.com/in/vladimir-atanasov-tavora/',
      ],
    },
    {
      '@type': 'HowTo',
      name: 'Как да оптимизирате сайта си за Google и AI търсачки',
      description: 'Поетапен процес за SEO и GEO оптимизация на бизнес сайт във Велико Търново от ТАВОРА ЕООД.',
      totalTime: 'P2W',
      estimatedCost: { '@type': 'MonetaryAmount', currency: 'EUR', value: '390' },
      supply: [
        { '@type': 'HowToSupply', name: 'Достъп до Google Search Console' },
        { '@type': 'HowToSupply', name: 'Списък с целеви ключови думи' },
      ],
      tool: [
        { '@type': 'HowToTool', name: 'Google PageSpeed Insights' },
        { '@type': 'HowToTool', name: 'Schema.org Validator' },
        { '@type': 'HowToTool', name: 'Google Rich Results Test' },
      ],
      step: [
        {
          '@type': 'HowToStep',
          position: 1,
          name: 'SEO одит и анализ',
          text: 'Анализ на текущите позиции, технически проблеми и конкуренти. Идентифициране на ключови думи с търговски интент.',
          url: 'https://imashnujnoto.com/uslugi/seo-geo#audit',
        },
        {
          '@type': 'HowToStep',
          position: 2,
          name: 'On-page SEO оптимизация',
          text: 'Оптимизация на заглавия, мета описания, H1-H6 йерархия, вътрешно свързване и canonical URLs.',
          url: 'https://imashnujnoto.com/uslugi/seo-geo#onpage',
        },
        {
          '@type': 'HowToStep',
          position: 3,
          name: 'Google Business Profile',
          text: 'Създаване и пълна оптимизация на Google Business Profile за локално класиране в Maps.',
          url: 'https://imashnujnoto.com/uslugi/seo-geo#gbp',
        },
        {
          '@type': 'HowToStep',
          position: 4,
          name: 'Schema.org структурирани данни',
          text: 'Добавяне на LocalBusiness, Product, FAQ и Article markup за rich snippets в Google.',
          url: 'https://imashnujnoto.com/uslugi/seo-geo#schema',
        },
        {
          '@type': 'HowToStep',
          position: 5,
          name: 'GEO оптимизация за AI търсачки',
          text: 'Entity statements, Person Schema и WebSite Schema за оптимизация за ChatGPT, Perplexity и Gemini.',
          url: 'https://imashnujnoto.com/uslugi/seo-geo#geo',
        },
      ],
    },
  ],
};

export default function SeoGeoPage() {
  useEffect(() => {
    const id = 'schema-seo-geo';
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) { el = document.createElement('script'); el.id = id; el.type = 'application/ld+json'; document.head.appendChild(el); }
    el.textContent = JSON.stringify(SCHEMA);
    document.title = 'SEO & GEO оптимизация | #1 в Google + AI | ТАВОРА';
    const m = document.querySelector('meta[name="description"]');
    if (m) m.setAttribute('content', 'Класиране #1 в Google и AI търсачки за вашия бизнес. 390 € еднократно, резултати за 3–4 седмици. Поискайте SEO одит днес — ТАВОРА ЕООД.');
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://imashnujnoto.com/uslugi/seo-geo');
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
            SEO & GEO.
            <br />
            <span className="italic text-[#0A2540]">Google и AI търсачки.</span>
          </h1>

          <p className="text-sm md:text-[15px] text-[#1C1C1E]/65 max-w-2xl leading-relaxed mb-10">
            <strong className="text-[#1C1C1E]">ТАВОРА ЕООД</strong> — дигитален маркетинг агенция във <Link to="/digitalen-marketing-veliko-tarnovo" className="text-[#0A2540] hover:underline">Велико Търново</Link>, основана от <strong className="text-[#1C1C1E]">Владимир Атанасов</strong>.
            Класирането в Google е измеримо. Или сте на първа страница, или не сте. Ние правим и двете — класическо SEO за Google и GEO оптимизация за AI системи, които вече препоръчват бизнеси на милиони хора.
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-3 mb-16">
            <Link
              to="/kontakt"
              className="px-7 py-3.5 bg-[#0A2540] text-white text-sm rounded-full hover:bg-[#0A2540]/90 transition-all cursor-pointer whitespace-nowrap"
            >
              Поискайте SEO одит →
            </Link>
            <div className="flex items-center gap-2 px-5 py-3.5">
              <span className="text-sm text-[#1C1C1E]/65">390 €</span>
              <span className="text-sm text-[#1C1C1E]/65">еднократно · консултация 50 €</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-[#1C1C1E]/8">
            {[
              { val: '#1', sub: 'позиции в Google' },
              { val: 'GEO', sub: 'ChatGPT · Perplexity' },
              { val: '390 €', sub: 'еднократно' },
              { val: '3–4 нед.', sub: 'първи резултати' },
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
              <strong className="text-[#1C1C1E]">ТАВОРА ЕООД</strong> е SEO агенция във <strong className="text-[#1C1C1E]">Велико Търново</strong>, България.
              Основана от <strong className="text-[#1C1C1E]">Владимир Атанасов</strong>, агенцията предлага SEO и GEO оптимизация — класиране в Google и AI търсачки като ChatGPT и Perplexity.
              SEO пакетът включва on-page оптимизация, Google Business Profile, Schema.org структурирани данни и GEO за AI отговори.
              Клиенти от Велико Търново и цяла България ползват услугите на ТАВОРА за реални #1 позиции.
            </p>
          </div>
        </section>

        {/* SEO vs GEO */}
        <section className="py-8 md:py-20 border-t border-[#1C1C1E]/6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-6 h-px bg-[#0A2540]/25" />
            <span className="text-[11px] text-[#1C1C1E]/65 tracking-widest uppercase">SEO vs GEO</span>
          </div>
          <h2
            className="text-2xl md:text-4xl font-light text-[#1C1C1E] leading-tight mb-6 max-w-xl"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Две различни игри.
            <br />
            <span className="italic text-[#0A2540]">Трябват ви и двете.</span>
          </h2>

          <p className="text-sm text-[#1C1C1E]/65 max-w-2xl leading-relaxed mb-10">
            Преди 5 години беше достатъчно да сте на #1 в Google. Днес хората питат ChatGPT &ldquo;кой е най-добрият счетоводител в Търново&rdquo; и получават директен отговор без да отварят Google. Ако не сте оптимизирани за AI търсачки, пропускате напълно нов канал за клиенти — който расте по-бързо от всичко друго в дигиталния маркетинг.
          </p>

          <h3
            className="text-lg md:text-xl font-light text-[#1C1C1E] mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Какво е GEO оптимизация?
          </h3>

          <div className="space-y-3 mb-10 max-w-2xl">
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
              <strong className="text-[#1C1C1E]">GEO (Generative Engine Optimization)</strong> е оптимизация на съдържанието за AI системи, които генерират отговори — ChatGPT, Perplexity, Google AI Overviews, Claude и Gemini. За разлика от класическото SEO, което цели класиране в линкове (сини резултати), GEO цели вашият бизнес да бъде <strong className="text-[#1C1C1E]">цитиран директно в отговора на AI</strong>.
            </p>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
              AI системите работят чрез <strong className="text-[#1C1C1E]">LLM (Large Language Model) оптимизация</strong> — те &ldquo;четат&rdquo; интернет, извличат информация и я синтезират в отговори. Ключът е в <strong className="text-[#1C1C1E]">AI citations (цитирания от AI)</strong> — когато ChatGPT спомене вашия бизнес, това е безплатна препоръка пред милиони потребители.
            </p>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
              GEO разчита на <strong className="text-[#1C1C1E]">entity optimization</strong> (оптимизация на обекти) — Google и AI системите вече не търсят само ключови думи, те разбират &ldquo;обекти&rdquo;: хора, организации, места, продукти. Чрез <strong className="text-[#1C1C1E]">Schema.org структурирани данни</strong> и последователен entity graph, AI системите разбират точно кой сте, къде се намирате и какво предлагате.
            </p>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
              Последният елемент е <strong className="text-[#1C1C1E]">семантичният авторитет (semantic authority)</strong> — когато множество авторитетни източници (медии, директории, партньорски сайтове) ви споменават последователно, AI системите ви възприемат като надежден и релевантен източник. Това увеличава вероятността да бъдете цитирани в AI отговори.
            </p>
          </div>

          <h3
            className="text-lg md:text-xl font-light text-[#1C1C1E] mb-5"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            SEO срещу GEO — сравнение
          </h3>

          <div className="overflow-x-auto mb-8">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-[#1C1C1E]/12">
                  <th className="text-left py-3 pr-4 text-[11px] text-[#1C1C1E]/65 tracking-widest uppercase font-normal">Фактор</th>
                  <th className="text-left py-3 px-4 text-[11px] text-[#0A2540] tracking-widest uppercase font-medium">SEO</th>
                  <th className="text-left py-3 pl-4 text-[11px] text-[#0A2540] tracking-widest uppercase font-medium">GEO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1C1C1E]/6">
                {[
                  ['Цел', 'Класиране в Google (сини линкове)', 'Цитиране в AI отговори (ChatGPT, Perplexity, Gemini)'],
                  ['Как работи', 'Ключови думи, backlinks, технически фактори', 'Entity optimization, Schema.org, семантичен авторитет'],
                  ['Ключови фактори', 'On-page SEO, скорост, мобилност, линкове', 'Структурирани данни, ясни факти, авторитетни споменавания'],
                  ['Измеримост', 'Google Search Console — позиции и кликове', 'Директна проверка — питайте ChatGPT за вашия бизнес'],
                  ['Време за резултат', '2–6 месеца за конкурентни ключови думи', '2–4 седмици при правилна оптимизация'],
                  ['Конкуренция', 'Висока — всички правят SEO', 'Ниска — почти никой не прави GEO'],
                  ['Rich резултати', 'Rich snippets, звезди, FAQ, хлебни трохи', 'Директни цитирания в AI отговори'],
                  ['Пример', 'Търсите &ldquo;SEO Велико Търново&rdquo; → виждате линк', 'Питате ChatGPT &ldquo;кой е най-добрият SEO в Търново&rdquo; → получавате име'],
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-[#FAFAFA]/60 transition-colors">
                    <td className="py-3 pr-4 text-xs font-medium text-[#1C1C1E]">{row[0]}</td>
                    <td className="py-3 px-4 text-xs text-[#1C1C1E]/65 leading-relaxed">{row[1]}</td>
                    <td className="py-3 pl-4 text-xs text-[#1C1C1E]/65 leading-relaxed">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-sm text-[#1C1C1E]/65 max-w-2xl leading-relaxed">
            <strong className="text-[#1C1C1E]">SEO и GEO не се изключват — те се допълват.</strong> Добрата SEO оптимизация (правилни заглавия, Schema.org, бърз сайт) полага основите за GEO. Без SEO нямате добра GEO основа. Но само SEO не е достатъчно — губите целия трафик от AI търсачки, който вече е между 5% и 15% от общия органичен трафик в зависимост от нишата.
          </p>
        </section>

        {/* What's included */}
        <section className="py-8 md:py-20 border-t border-[#1C1C1E]/6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-6 h-px bg-[#0A2540]/25" />
            <span className="text-[11px] text-[#1C1C1E]/65 tracking-widest uppercase">Какво включва</span>
          </div>
          <h2
            className="text-2xl md:text-4xl font-light text-[#1C1C1E] leading-tight mb-12"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Пълен пакет.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {WHAT_INCLUDED.map((item) => (
              <div key={item.title} className="flex gap-4">
                <div className="w-1 shrink-0 bg-[#0A2540]/10 rounded-full" />
                <div>
                  <div className="text-sm font-medium text-[#1C1C1E] mb-1.5">{item.title}</div>
                  <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Results */}
        <section className="py-8 md:py-20 border-t border-[#1C1C1E]/6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-6 h-px bg-[#0A2540]/25" />
            <span className="text-[11px] text-[#1C1C1E]/65 tracking-widest uppercase">Резултати</span>
          </div>
          <h2
            className="text-2xl md:text-4xl font-light text-[#1C1C1E] leading-tight mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Отворете Google.
            <br />
            <span className="italic text-[#0A2540]">Потърсете сами.</span>
          </h2>
          <p className="text-sm text-[#1C1C1E]/65 mb-10 max-w-lg leading-relaxed">
            Не обещаваме позиции. Показваме реални сайтове с реални позиции — проверими в момента.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {RESULTS.map((r) => (
              <a
                key={r.name}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="group p-5 rounded-2xl border border-[#1C1C1E]/8 bg-white hover:border-[#0A2540]/15 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span className="text-sm font-medium text-[#1C1C1E] group-hover:text-[#0A2540] transition-colors">{r.name}</span>
                  <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#1B4332]/8 text-[#1B4332] whitespace-nowrap shrink-0">{r.result}</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <i className="ri-search-line text-[#1C1C1E]/20 text-xs" />
                  <span className="text-xs text-[#1C1C1E]/65 italic">&ldquo;{r.keyword}&rdquo;</span>
                </div>
                <div className="text-xs text-[#1C1C1E]/70 mb-3">Резултат за: {r.time}</div>
                <div className="flex items-center gap-1.5 text-[11px] text-[#0A2540]/35 group-hover:text-[#0A2540] transition-colors">
                  <i className="ri-external-link-line text-xs" />
                  {r.url.replace('https://', '')}
                </div>
              </a>
            ))}
          </div>

          {/* Case study summaries */}
          <h3
            className="text-base font-light text-[#1C1C1E] mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Истории на успеха
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-[#1C1C1E]/8 bg-[#FAFAFA]">
              <div className="text-xs font-medium text-[#1C1C1E] mb-1.5">Sunrise Food</div>
              <p className="text-xs text-[#1C1C1E]/65 leading-relaxed mb-2">
                Онлайн магазин за гъби кладница. Стартира от нулата — сайт + SEO. За 3–4 седмици достигна #1 в Google за ключовата дума &ldquo;гъби кладница онлайн&rdquo;, изпреварвайки утвърдени конкуренти.
              </p>
              <Link to="/blog/ecommerce-sezonni-produkti-gorski-borovinki" className="text-[10px] text-[#0A2540]/50 hover:text-[#0A2540] transition-colors">Към case study →</Link>
            </div>
            <div className="p-4 rounded-xl border border-[#1C1C1E]/8 bg-[#FAFAFA]">
              <div className="text-xs font-medium text-[#1C1C1E] mb-1.5">K-Food Велико Търново</div>
              <p className="text-xs text-[#1C1C1E]/65 leading-relaxed mb-2">
                Корейски ресторант в Търново. Сайт + SEO + GEO оптимизация. #1 в Google за &ldquo;корейска храна велико търново&rdquo; и цитиран от ChatGPT при запитване за корейска храна в региона.
              </p>
              <Link to="/blog/seo-restoranti-veliko-tarnovo" className="text-[10px] text-[#0A2540]/50 hover:text-[#0A2540] transition-colors">Към case study →</Link>
            </div>
            <div className="p-4 rounded-xl border border-[#1C1C1E]/8 bg-[#FAFAFA]">
              <div className="text-xs font-medium text-[#1C1C1E] mb-1.5">NP Massage</div>
              <p className="text-xs text-[#1C1C1E]/65 leading-relaxed mb-2">
                Масажно студио във Велико Търново. Локално SEO + Google Business Profile оптимизация. Класиране в Google Maps и локалните резултати за масажни услуги в Търново.
              </p>
              <Link to="/blog/marketing-nablyudeniya-masazhni-uslugi" className="text-[10px] text-[#0A2540]/50 hover:text-[#0A2540] transition-colors">Към case study →</Link>
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-8 md:py-20 border-t border-[#1C1C1E]/6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-6 h-px bg-[#0A2540]/25" />
            <span className="text-[11px] text-[#1C1C1E]/65 tracking-widest uppercase">Процес</span>
          </div>
          <h2
            className="text-2xl md:text-4xl font-light text-[#1C1C1E] leading-tight mb-4 max-w-xl"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Как работим.
            <br />
            <span className="italic text-[#0A2540]">Стъпка по стъпка.</span>
          </h2>
          <p className="text-sm text-[#1C1C1E]/65 mb-10 max-w-lg leading-relaxed">
            Процесът е линеен и прозрачен. Всяка стъпка има конкретен резултат, който можете да проверите.
          </p>

          <div className="space-y-5">
            {[
              {
                step: '01',
                title: 'SEO одит и анализ',
                desc: 'Започваме с пълен технически анализ на сайта — скорост, структура, индексация, Core Web Vitals. Анализираме текущите позиции, конкурентите и ключовите думи с търговски интент. Получавате конкретен доклад с проблеми и решения.',
              },
              {
                step: '02',
                title: 'On-page SEO оптимизация',
                desc: 'Пренаписваме заглавия, мета описания и H1–H6 йерархия. Поправяме canonical URLs, вътрешно свързване и ALT текстове. Оптимизираме съдържанието за целевите ключови думи — без keyword stuffing, с естествен език.',
              },
              {
                step: '03',
                title: 'Google Business Profile',
                desc: 'Създаваме или оптимизираме GBP профила — категории, описание, снимки, работно време, Q&A. Критично за локален бизнес: GBP е първото нещо, което клиентът вижда при локално търсене.',
              },
              {
                step: '04',
                title: 'Schema.org структурирани данни',
                desc: 'Добавяме LocalBusiness, Service, FAQ, Article, HowTo и Organization markup. Това дава rich snippets в Google (звезди, цени, въпроси) и прави сайта четим за AI краулъри.',
              },
              {
                step: '05',
                title: 'GEO оптимизация за AI',
                desc: 'Изграждаме entity graph — свързваме вас, вашия бизнес, локацията и услугите чрез структурирани данни. Оптимизираме съдържанието за AI цитирания — факти, дефиниции, Q&A формат. Резултат: ChatGPT, Perplexity и Gemini започват да ви препоръчват.',
              },
              {
                step: '06',
                title: 'Мониторинг и поддръжка',
                desc: 'След оптимизацията следим позициите и правим корекции при нужда. Ако след 6 месеца позициите паднат — връщаме се и оправяме без допълнително заплащане.',
              },
            ].map((p) => (
              <div key={p.step} className="flex gap-5 p-5 rounded-xl border border-[#1C1C1E]/6 bg-white">
                <span className="text-[11px] font-medium text-[#0A2540]/30 tracking-widest shrink-0 w-6 mt-0.5">{p.step}</span>
                <div>
                  <div className="text-sm font-medium text-[#1C1C1E] mb-1.5">{p.title}</div>
                  <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">{p.desc}</p>
                </div>
              </div>
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
                Еднократна инвестиция.
              </h2>
              <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-6">
                SEO не е абонамент. Оптимизацията се прави веднъж — правилно. Резултатите остават. Ако след 6 месеца позициите паднат, се връщаме и оправяме — без допълнително заплащане.
              </p>
              <div className="space-y-3">
                {[
                  { label: 'SEO пакет (on-page + GBP + Schema)', price: '390 €' },
                  { label: 'GEO оптимизация (AI търсачки)', price: '390 €' },
                  { label: 'SEO + GEO комбо', price: '590 €' },
                  { label: 'Месечен мониторинг и доклад', price: '90 € / мес.' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-3 border-b border-[#1C1C1E]/6 last:border-0">
                    <span className="text-sm text-[#1C1C1E]/60">{item.label}</span>
                    <span className="text-sm font-medium text-[#0A2540]">{item.price}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 md:p-8 rounded-2xl border border-[#1C1C1E]/8 bg-[#FAFAFA]">
              <div className="text-xs text-[#1C1C1E]/65 tracking-widest uppercase mb-4">SEO одитът включва</div>
              <div className="space-y-3 mb-6">
                {[
                  'Технически анализ на сайта',
                  'Анализ на текущите позиции',
                  'Конкурентен анализ — кой е пред вас и защо',
                  'Списък с ключови думи с търговски интент',
                  'Конкретен план за действие',
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
                <span className="text-sm text-[#1C1C1E]/65">SEO одит</span>
                <span className="text-lg font-light text-[#0A2540]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>50 €</span>
              </div>
              <Link
                to="/kontakt"
                className="block w-full py-3.5 bg-[#0A2540] text-white text-sm rounded-full hover:bg-[#0A2540]/90 transition-all cursor-pointer whitespace-nowrap text-center"
              >
                Поискайте SEO одит →
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-8 md:py-20 border-t border-[#1C1C1E]/6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-6 h-px bg-[#0A2540]/25" />
            <span className="text-[11px] text-[#1C1C1E]/65 tracking-widest uppercase">Често задавани въпроси</span>
          </div>
          <h2
            className="text-2xl md:text-4xl font-light text-[#1C1C1E] leading-tight mb-10"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Въпроси, които получаваме.
          </h2>

          <div className="space-y-4 max-w-2xl">
            {[
              {
                q: 'Колко струва SEO оптимизация?',
                a: 'Еднократният SEO пакет е 390 €. Включва on-page оптимизация, Google Business Profile настройка и Schema.org структурирани данни. SEO одитът е 50 € и сумата се приспада при сключване на договор. Няма скрити такси.',
              },
              {
                q: 'Колко време отнема SEO?',
                a: 'Първите резултати се виждат за 3–4 седмици при правилна оптимизация. Пълното класиране за конкурентни ключови думи отнема 2–6 месеца. Скоростта зависи от конкуренцията, състоянието на сайта и нишата.',
              },
              {
                q: 'Какво е GEO оптимизация?',
                a: 'GEO (Generative Engine Optimization) е оптимизация на съдържанието за AI търсачки като ChatGPT, Perplexity, Gemini и Google AI Overviews. Целта е вашият бизнес да бъде цитиран директно в AI отговорите, когато потребителите задават въпроси за продукти или услуги като вашите.',
              },
              {
                q: 'Работи ли GEO за ChatGPT?',
                a: 'Да. С правилна оптимизация (Schema.org, entity graph, ясни факти, Q&A формат), ChatGPT започва да ви цитира в отговорите си. Пример: K-Food Велико Търново се появява в ChatGPT при запитване за корейска храна в Търново — проверете сами.',
              },
              {
                q: 'Каква е разликата между SEO и GEO?',
                a: 'SEO цели класиране в Google (сини линкове). GEO цели цитиране в AI отговори (ChatGPT, Perplexity). SEO работи с ключови думи и backlinks. GEO работи с entity optimization и структурирани данни. Двете се допълват — добрата SEO е основа за GEO.',
              },
              {
                q: 'Какво представлява AI оптимизацията?',
                a: 'AI оптимизацията (AI Optimization) е цялостен подход, който включва GEO, AEO (Answer Engine Optimization) и LLM оптимизация. Целта е да увеличите видимостта си във всички AI-базирани търсачки и асистенти — не само Google, но и ChatGPT, Perplexity, Claude и Gemini.',
              },
              {
                q: 'Какво влияе на цената на SEO?',
                a: 'Цената зависи от: размера на сайта (брой страници), конкуренцията в нишата, текущото техническо състояние, нуждата от ново съдържание и дали е необходима GEO оптимизация. Всеки проект е индивидуален — консултацията от 50 € дава точна оферта.',
              },
            ].map((faq, i) => (
              <details key={i} className="group p-5 rounded-xl border border-[#1C1C1E]/8 bg-white cursor-pointer">
                <summary className="flex items-start justify-between gap-3 list-none">
                  <span className="text-sm font-medium text-[#1C1C1E] group-open:text-[#0A2540] transition-colors">{faq.q}</span>
                  <span className="w-5 h-5 flex items-center justify-center shrink-0 rounded-full border border-[#1C1C1E]/15 group-open:border-[#0A2540]/20 transition-all mt-0.5">
                    <i className="ri-add-line text-[10px] text-[#1C1C1E]/40 group-open:hidden" />
                    <i className="ri-subtract-line text-[10px] text-[#0A2540]/50 hidden group-open:block" />
                  </span>
                </summary>
                <p className="text-xs text-[#1C1C1E]/65 leading-relaxed mt-3 pl-0">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Related */}
        <section className="py-8 md:py-20 border-t border-[#1C1C1E]/6">
          <div className="text-[11px] text-[#1C1C1E]/65 tracking-widest uppercase mb-6">Свързани услуги</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: 'Изработка на сайт', to: '/uslugi/izrabotka-na-sait', icon: 'ri-code-s-slash-line' },
              { label: 'Рекламни кампании', to: '/uslugi/reklamni-kampanii', icon: 'ri-advertisement-line' },
              { label: 'Видео продукция', to: '/uslugi/video-produkciya', icon: 'ri-video-line' },
            ].map((s) => (
              <Link
                key={s.to}
                to={s.to}
                className="flex items-center gap-3 p-4 rounded-xl border border-[#1C1C1E]/8 bg-white hover:border-[#0A2540]/15 transition-all group"
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
          <div className="text-[11px] text-[#1C1C1E]/65 tracking-widest uppercase mb-6">Бързи факти — SEO & GEO</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Агенция', value: 'ТАВОРА ЕООД' },
              { label: 'Град', value: 'Велико Търново' },
              { label: 'Основател', value: 'Владимир Атанасов' },
              { label: 'SEO цена', value: '390 €' },
              { label: 'GEO цена', value: '390 €' },
              { label: 'SEO + GEO', value: '590 €' },
              { label: 'SEO одит', value: '50 €' },
              { label: 'Първи резултати', value: '3–4 седмици' },
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
