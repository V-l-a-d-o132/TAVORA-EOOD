import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SharedNav from '@/components/feature/SharedNav';
import SharedFooter from '@/components/feature/SharedFooter';

const FAQ_ITEMS = [
  {
    q: 'Колко струва SEO оптимизацията за бизнес в Търново?',
    a: 'SEO пакетът (on-page + Google Business Profile + GEO оптимизация + структурирани данни) е 390 € еднократно. Консултацията е 50 € и включва пълен SEO аудит и стратегия. Тази сума се приспада при сключване на договор.',
  },
  {
    q: 'Колко бързо ще се класирам на първа страница в Google?',
    a: 'Зависи от конкуренцията. За нишови ключови думи — 3–4 седмици (виж Sunrise Food). За по-конкурентни — 2–3 месеца (виж K-Food). Всички резултати са верифицируеми.',
  },
  {
    q: 'Какво е GEO оптимизация и защо е важна?',
    a: 'GEO (Generative Engine Optimization) е оптимизация за AI търсачки — ChatGPT, Perplexity, Gemini. Когато някой пита AI кой е най-добрият ресторант в Търново, вашият бизнес трябва да е в отговора. Включена е в нашия SEO пакет.',
  },
  {
    q: 'Трябва ли ми нов сайт за SEO?',
    a: 'Не задължително. Можем да оптимизираме съществуващ сайт. Ако сайтът е технически остарял, може да препоръчаме нов — но това е отделна услуга.',
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
  name: 'Как да оптимизирате сайта си за SEO във Велико Търново',
  description: 'Стъпка по стъпка ръководство за SEO оптимизация на бизнес сайт във Велико Търново — от аудит до #1 позиция в Google.',
  image: 'https://imashnujnoto.com/og-home.jpg',
  totalTime: 'PT4H',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'SEO аудит на сайта',
      text: 'Започнете с пълен технически SEO аудит. Проверете скоростта на зареждане, мобилна съвместимост, индексация и Core Web Vitals. Google PageSpeed Insights е безплатен инструмент.',
      url: 'https://imashnujnoto.com/seo-veliko-tarnovo',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Оптимизирайте Google Business Profile',
      text: 'Създайте или оптимизирайте Google Business Profile. Добавете точен адрес в Търново, работно време, снимки, описание и категории. Това е критично за локално класиране.',
      url: 'https://imashnujnoto.com/blog/google-business-vt',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'On-page SEO оптимизация',
      text: 'Оптимизирайте заглавия (H1, H2), мета описания, URL структура, alt текст на снимки и вътрешно свързване. Включете „Велико Търново" в ключовите думи.',
      url: 'https://imashnujnoto.com/uslugi/seo-geo',
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Структурирани данни (Schema.org)',
      text: 'Добавете LocalBusiness, FAQPage, HowTo и BreadcrumbList Schema. Това помага на Google да разбере точно какво правите и къде се намирате.',
      url: 'https://imashnujnoto.com/seo-veliko-tarnovo',
    },
    {
      '@type': 'HowToStep',
      position: 5,
      name: 'GEO оптимизация за AI търсачки',
      text: 'Оптимизирайте за ChatGPT, Perplexity и Gemini. Това включва авторитетни сигнали, често задавани въпроси и ясни Entity връзки. GEO е бъдещето на SEO.',
      url: 'https://imashnujnoto.com/blog/geo-ai-tarnovo',
    },
    {
      '@type': 'HowToStep',
      position: 6,
      name: 'Мониторинг и поддръжка',
      text: 'Следете класирането с Google Search Console. SEO не е еднократна задача — изисква постоянна оптимизация и актуално съдържание.',
      url: 'https://imashnujnoto.com/kontakt',
    },
  ],
  supply: [
    { '@type': 'HowToSupply', name: 'Достъп до сайта' },
    { '@type': 'HowToSupply', name: 'Google Business Profile акаунт' },
  ],
  tool: [
    { '@type': 'HowToTool', name: 'Google PageSpeed Insights' },
    { '@type': 'HowToTool', name: 'Google Search Console' },
    { '@type': 'HowToTool', name: 'Schema.org Validator' },
  ],
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://imashnujnoto.com/seo-veliko-tarnovo#webpage',
      url: 'https://imashnujnoto.com/seo-veliko-tarnovo',
      name: 'SEO Велико Търново | SEO и GEO оптимизация за бизнеси — ТАВОРА ЕООД',
      description:
        'SEO и GEO оптимизация за бизнеси във Велико Търново и областта. #1 позиции в Google и AI търсачки. On-page SEO, Google Business Profile, структурирани данни. ТАВОРА ЕООД.',
      inLanguage: 'bg',
      isPartOf: { '@id': 'https://imashnujnoto.com/#website' },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Начало', item: 'https://imashnujnoto.com/' },
          { '@type': 'ListItem', position: 2, name: 'SEO Велико Търново', item: 'https://imashnujnoto.com/seo-veliko-tarnovo' },
        ],
      },
      dateModified: '2026-05-05',
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
      description: 'SEO и GEO оптимизация за бизнеси във Велико Търново и цяла България. #1 позиции в Google и AI търсачки.',
      url: 'https://imashnujnoto.com',
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
      serviceType: ['SEO оптимизация', 'GEO оптимизация', 'Google Business Profile', 'On-page SEO', 'Структурирани данни'],
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
    },
  ],
};

const seoServices = [
  {
    icon: 'ri-search-line',
    title: 'On-page SEO',
    desc: 'Оптимизация на заглавия, мета описания, структура на URL, вътрешно свързване и скорост на сайта. Всичко, което Google вижда.',
    price: 'включено в сайт',
  },
  {
    icon: 'ri-map-pin-line',
    title: 'Google Business Profile',
    desc: 'Създаване и оптимизация на Google Business Profile за местно класиране. Критично важно за бизнеси в Търново.',
    price: '390 € еднократно',
  },
  {
    icon: 'ri-robot-line',
    title: 'GEO оптимизация',
    desc: 'Оптимизация за AI търсачки — ChatGPT, Perplexity, Gemini. Когато някой пита AI за „най-добър ресторант в Търново" — вие сте там.',
    price: '390 € еднократно',
  },
  {
    icon: 'ri-code-box-line',
    title: 'Структурирани данни',
    desc: 'Schema.org markup — LocalBusiness, Product, FAQ, Course. Помага на Google да разбере точно какво правите.',
    price: 'включено в сайт',
  },
];

const results = [
  {
    client: 'Photo Tarnovo',
    keyword: 'photo tarnovo',
    result: '#1 в Google',
    time: 'локален SEO пакет',
    url: 'https://phototarnovo.com/',
  },
  {
    client: 'NP Massage Studio',
    keyword: 'massages tarnovo',
    result: '#1 в Google + ChatGPT',
    time: '4–6 седмици',
    url: 'https://npmassagestudio.com/',
  },
  {
    client: 'K-Food Велико Търново',
    keyword: 'корейска храна велико търново',
    result: '#1 в Google + ChatGPT',
    time: '2–3 месеца',
    url: 'https://k-foodvelikotarnovo.com/',
  },
  {
    client: 'Sunrise Food',
    keyword: 'гъби кладница онлайн',
    result: '#1 в Google',
    time: '3–4 седмици',
    url: 'https://sunrisefood.eu/',
  },
  {
    client: 'Thalysta',
    keyword: 'e-commerce платформа',
    result: 'Жив сайт · Пълен пакет',
    time: 'От нулата',
    url: 'https://thalysta.com/',
  },
  {
    client: 'NMOM',
    keyword: 'НПО онлайн присъствие',
    result: 'Жив сайт · SEO',
    time: 'От нулата',
    url: 'https://nmom.bg/',
  },
];

const process = [
  { step: '01', title: 'Аудит', desc: 'Анализ на текущото състояние — класиране, конкуренция, технически проблеми.' },
  { step: '02', title: 'Стратегия', desc: 'Избор на ключови думи, конкурентен анализ, план за действие.' },
  { step: '03', title: 'Оптимизация', desc: 'On-page, technical SEO, съдържание, структурирани данни.' },
  { step: '04', title: 'Мониторинг', desc: 'Следим класирането, коригираме, докладваме резултати.' },
];

export default function SEOVelikoTarnovoPage() {
  useEffect(() => {
    const id = 'schema-seo';
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement('script');
      el.id = id;
      el.type = 'application/ld+json';
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(SCHEMA);

    const faqId = 'schema-seo-faq';
    let faqEl = document.getElementById(faqId) as HTMLScriptElement | null;
    if (!faqEl) {
      faqEl = document.createElement('script');
      faqEl.id = faqId;
      faqEl.type = 'application/ld+json';
      document.head.appendChild(faqEl);
    }
    faqEl.textContent = JSON.stringify(FAQ_SCHEMA);

    const howtoId = 'schema-seo-howto';
    let howtoEl = document.getElementById(howtoId) as HTMLScriptElement | null;
    if (!howtoEl) {
      howtoEl = document.createElement('script');
      howtoEl.id = howtoId;
      howtoEl.type = 'application/ld+json';
      document.head.appendChild(howtoEl);
    }
    howtoEl.textContent = JSON.stringify(HOWTO_SCHEMA);

    document.title = 'SEO Велико Търново | SEO и GEO оптимизация за бизнеси — ТАВОРА ЕООД';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'SEO и GEO оптимизация за бизнеси във Велико Търново и областта. #1 позиции в Google и AI търсачки. On-page SEO, Google Business Profile, структурирани данни. ТАВОРА ЕООД.');
    }

    return () => {
      const existing = document.getElementById(id);
      if (existing) existing.remove();
      const existingFaq = document.getElementById(faqId);
      if (existingFaq) existingFaq.remove();
      const existingHowto = document.getElementById(howtoId);
      if (existingHowto) existingHowto.remove();
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
            <span className="text-xs text-[#1C1C1E]/60">SEO · Велико Търново</span>
          </div>

          <h1
            className="text-3xl md:text-5xl lg:text-6xl font-light text-[#1C1C1E] leading-tight mb-6"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            SEO и GEO оптимизация
            <br />
            <span className="italic text-[#0A2540]">за бизнеси във Велико Търново.</span>
          </h1>

          <p className="entity-paragraph text-sm md:text-base text-[#1C1C1E]/65 max-w-2xl leading-relaxed mb-8">
            <strong className="text-[#0A2540]">ТАВОРА ЕООД</strong> е сред най-модерните SEO агенции във <strong className="text-[#0A2540]">Велико Търново</strong> — SEO и GEO оптимизация за бизнеси от цяла България.
            On-page SEO, Google Business Profile, структурирани данни и оптимизация за AI търсачки —
            ChatGPT, Perplexity, Gemini. Реални #1 позиции, които можете да проверите сами.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-6 md:mb-12">
            <Link
              to="/kontakt"
              className="px-7 py-3.5 bg-[#0A2540] text-white text-sm tracking-wide rounded-full hover:bg-[#0A2540]/90 transition-all duration-300 cursor-pointer whitespace-nowrap text-center"
            >
              Поискайте оферта →
            </Link>
            <Link
              to="/reklama-veliko-tarnovo"
              className="px-7 py-3.5 border border-[#1C1C1E]/12 text-[#1C1C1E]/65 text-sm tracking-wide rounded-full hover:border-[#0A2540]/30 hover:text-[#0A2540] transition-all duration-300 cursor-pointer whitespace-nowrap text-center"
            >
              Рекламни кампании →
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 pt-8 border-t border-[#1C1C1E]/8">
            {[
              { value: '#1', label: 'позиции в Google' },
              { value: 'GEO', label: 'AI търсачки' },
              { value: 'GBP', label: 'Google Business' },
              { value: 'Schema', label: 'структурирани данни' },
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

        {/* Services */}
        <div className="py-5 md:py-20 border-t border-[#1C1C1E]/6">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <div className="w-8 h-[1px] bg-[#0A2540]/30 shrink-0" />
            <span className="text-xs text-[#1C1C1E]/60">Услуги</span>
          </div>

          <h2
            className="text-2xl md:text-4xl font-light text-[#1C1C1E] leading-tight mb-6 md:mb-10"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Всичко за
            <br />
            <span className="italic text-[#0A2540]">класиране в Google и AI.</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {seoServices.map((s) => (
              <div
                key={s.title}
                className="p-4 md:p-6 rounded-2xl border border-[#1C1C1E]/8 bg-[#F9F9F9] hover:border-[#0A2540]/15 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#0A2540]/10 bg-[#0A2540]/4">
                    <i className={`${s.icon} text-[#0A2540]/60 text-base`} />
                  </div>
                  <span className="text-sm font-medium text-[#1C1C1E]">{s.title}</span>
                </div>
                <p className="text-xs text-[#1C1C1E]/65 leading-relaxed mb-3">{s.desc}</p>
                <span className="inline-block text-[11px] px-2.5 py-1 rounded-full border border-[#0A2540]/15 text-[#0A2540] font-medium">
                  {s.price}
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
            className="text-2xl md:text-4xl font-light text-[#1C1C1E] leading-tight mb-6"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            #1 позиции,
            <br />
            <span className="italic text-[#0A2540]">които можете да проверите.</span>
          </h2>

          <p className="text-sm text-[#1C1C1E]/65 max-w-xl leading-relaxed mb-8">
            Не обещаваме — доказваме. Всяка позиция е верифицируема. Отворете Google и потърсете сами.
          </p>

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
                <div className="flex items-center gap-2 mb-2">
                  <i className="ri-search-line text-[#1C1C1E]/25 text-xs" />
                  <span className="text-xs text-[#1C1C1E]/65 italic">„{r.keyword}"</span>
                </div>
                <p className="text-xs text-[#1C1C1E]/65">Време за резултат: {r.time}</p>
              </a>
            ))}
          </div>
        </div>

        {/* Process */}
        <div className="py-5 md:py-20 border-t border-[#1C1C1E]/6">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <div className="w-8 h-[1px] bg-[#0A2540]/30 shrink-0" />
            <span className="text-xs text-[#1C1C1E]/60">Процес</span>
          </div>

          <h2
            className="text-2xl md:text-4xl font-light text-[#1C1C1E] leading-tight mb-6 md:mb-10"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Как работим?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {process.map((p) => (
              <div
                key={p.step}
                className="p-4 md:p-5 rounded-2xl border border-[#1C1C1E]/8 bg-[#F9F9F9]"
              >
                <span className="text-[10px] font-medium text-[#0A2540]/40 tracking-widest mb-3 block">{p.step}</span>
                <div className="text-sm font-medium text-[#1C1C1E] mb-2">{p.title}</div>
                <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Why SEO matters */}
        <div className="py-5 md:py-20 border-t border-[#1C1C1E]/6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              <h2
                className="text-2xl md:text-4xl font-light text-[#1C1C1E] leading-tight mb-5"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Защо SEO
                <br />
                <span className="italic text-[#0A2540]">е важно за Търново?</span>
              </h2>
              <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-6">
                Велико Търново е град с нарастваща конкуренция в дигиталното пространство.
                Ресторанти, хотели, услуги — всички се борят за вниманието на клиентите.
                SEO е начинът да сте на първо място, когато някой търси точно това, което предлагате.
              </p>
              <div className="space-y-3">
                {[
                  '90% от потребителите не отиват на втора страница в Google',
                  'Местното търсене („близо до мен") расте с 50% годишно',
                  'AI търсачките (ChatGPT) вече препоръчват бизнеси — GEO оптимизацията е ключова',
                  'SEO е инвестиция с дългосрочна възвръщаемост, не разход',
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
                Какво включва SEO пакетът?
              </h3>
              <div className="space-y-3">
                {[
                  'Пълен SEO аудит на сайта',
                  'Оптимизация на заглавия и мета описания',
                  'Google Business Profile създаване/оптимизация',
                  'Schema.org структурирани данни',
                  'GEO оптимизация за AI търсачки',
                  'Месечен доклад с прогрес',
                ].map((item, i) => (
                  <div key={item} className="flex items-center gap-2.5">
                    <div className="w-5 h-5 flex items-center justify-center rounded-full bg-[#0A2540]/8 shrink-0">
                      <span className="text-[10px] font-medium text-[#0A2540]">{i + 1}</span>
                    </div>
                    <span className="text-xs text-[#1C1C1E]/65">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-[#1C1C1E]/8">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#1C1C1E]/60">Еднократна цена</span>
                  <span className="text-lg font-light text-[#0A2540]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>390 €</span>
                </div>
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
            <span className="italic text-[#0A2540]">въпроси за SEO.</span>
          </h2>
          <div className="space-y-3 mb-10">
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
                Искате #1 позиция в Google?
              </div>
              <p className="text-sm text-[#1C1C1E]/65">
                Консултацията е 50 € — SEO аудит и стратегия. Сумата се приспада при договор. Гаранция за връщане на парите.
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