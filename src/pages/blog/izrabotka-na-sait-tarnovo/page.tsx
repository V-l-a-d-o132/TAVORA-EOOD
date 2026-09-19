import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SharedNav from '@/components/feature/SharedNav';
import SharedFooter from '@/components/feature/SharedFooter';

const FAQ_ITEMS = [
  {
    q: 'Колко струва изработката на сайт в Търново?',
    a: 'Изработката на сайт за малък бизнес в Търново започва от 999 €. Цената зависи от броя на страниците, функционалността и нивото на SEO оптимизация. Консултацията е 50 € и включва анализ на нуждите и оферта. Тази сума се приспада при сключване на договор.',
  },
  {
    q: 'Колко бързо е готов сайтът?',
    a: 'Стандартен сайт за малък бизнес — 2–3 седмици. По-сложни проекти с много функционалности — 4–6 седмици. Всичко зависи от обема на съдържанието и обратната връзка от клиента.',
  },
  {
    q: 'Включено ли е SEO в цената?',
    a: 'Да — всеки сайт включва базово on-page SEO: оптимизирани заглавия, мета описания, структурирани данни (Schema.org), Core Web Vitals оптимизация и GEO за AI търсачки. Това е стандарт, не опция.',
  },
  {
    q: 'Правите ли сайтове само за Велико Търново?',
    a: 'Не — правим сайтове за бизнеси от цяла България. Специализираме се в Велико Търново и Търновска област, но работим и с клиенти от цялата страна.',
  },
  {
    q: 'Какво е Core Web Vitals и защо е важно?',
    a: 'Core Web Vitals са метрики на Google за скорост и UX на сайта. Сайтове с добри Core Web Vitals се класират по-добре в Google. Всеки наш сайт постига 90+ в PageSpeed Insights.',
  },
  {
    q: 'Има ли гаранция?',
    a: 'Всяка услуга (без консултацията от 50 €) идва с гаранция за връщане на парите. Ако не сте доволни от резултата, връщаме сумата без въпроси.',
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
      '@id': 'https://imashnujnoto.com/blog/izrabotka-na-sait-tarnovo#article',
      headline: 'Изработка на сайт Велико Търново 2026 — цени, срокове и какво да очаквате',
      description: 'Пълно ръководство за изработка на сайт в Търново. Реални цени от 999 €, срокове, case studies с K-Food и Sunrise Food. Защо SEO от старт е задължително и как да изберете агенция.',
      url: 'https://imashnujnoto.com/blog/izrabotka-na-sait-tarnovo',
      datePublished: '2026-04-28',
      dateModified: today,
      inLanguage: 'bg',
      wordCount: 3000,
      author: {
        '@type': 'Person',
        '@id': 'https://imashnujnoto.com/#founder',
        name: 'Владимир Веселинов Атанасов',
        url: 'https://imashnujnoto.com/ekip',
        jobTitle: 'Основател, ТАВОРА ЕООД',
      },
      publisher: {
        '@type': 'Organization',
        name: 'ТАВОРА ЕООД',
        url: 'https://imashnujnoto.com',
        logo: { '@type': 'ImageObject', url: 'https://storage.readdy-site.link/project_files/3f265d07-5825-4e88-a58a-44deb287b858/777dce2a-8731-4235-b0be-7837a840c3c9_TAVORA-MARKETING-AGENCY-VELIKO-TARNOVO.png?v=f6135e7442d441feef102ad2f8425862' },
      },
      image: {
        '@type': 'ImageObject',
        url: 'https://readdy.ai/api/search-image?query=web%20design%20development%20website%20creation%20laptop%20screen%20modern%20UI%20design%20clean%20minimal%20white%20background%20professional%20workspace%20Veliko%20Tarnovo%20Bulgaria&width=1200&height=630&seq=blog-sait-tarnovo-og&orientation=landscape',
        width: 1200,
        height: 630,
      },
      isPartOf: { '@id': 'https://imashnujnoto.com/blog#page' },
      about: [
        { '@type': 'Thing', name: 'Изработка на сайт' },
        { '@type': 'City', name: 'Велико Търново' },
        { '@type': 'Thing', name: 'Уеб дизайн' },
      ],
      mentions: [
        { '@type': 'Organization', name: 'K-Food Велико Търново', url: 'https://k-foodvelikotarnovo.com/' },
        { '@type': 'Organization', name: 'Sunrise Food', url: 'https://sunrisefood.eu/' },
        { '@type': 'Organization', name: 'ТАВОРА ЕООД', url: 'https://imashnujnoto.com' },
      ],
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://imashnujnoto.com/blog/izrabotka-na-sait-tarnovo',
      },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Начало', item: 'https://imashnujnoto.com/' },
        { '@type': 'ListItem', position: 2, name: 'Блог', item: 'https://imashnujnoto.com/blog' },
        { '@type': 'ListItem', position: 3, name: 'Изработка на сайт Велико Търново', item: 'https://imashnujnoto.com/blog/izrabotka-na-sait-tarnovo' },
      ],
    },
  ],
};

const caseStudies = [
  {
    name: 'Sunrise Food',
    url: 'https://sunrisefood.eu/',
    type: 'Онлайн магазин за гъби кладница',
    challenge: 'Нулево онлайн присъствие. Нямаха сайт, нямаха Google Business Profile, нямаха нищо.',
    solution: 'Изграждане на сайт от нула с вградено SEO, Core Web Vitals 90+, LocalBusiness Schema и GEO оптимизация.',
    result: '#1 в Google за "гъби кладница онлайн"',
    time: '3–4 седмици',
    icon: 'ri-leaf-line',
    color: '#1B4332',
  },
  {
    name: 'K-Food Велико Търново',
    url: 'https://k-foodvelikotarnovo.com/',
    type: 'Ресторант — корейска кухня',
    challenge: 'Съществуващ сайт без SEO. Не се появяваха в Google за нито една ключова дума.',
    solution: 'SEO и GEO оптимизация на съществуващ сайт. Schema.org, Google Business Profile, GEO за ChatGPT.',
    result: '#1 в Google + топ препоръка в ChatGPT',
    time: '2–3 месеца',
    icon: 'ri-restaurant-line',
    color: '#8B1A1A',
  },
];

const pricingTiers = [
  {
    name: 'Стартов сайт',
    price: 'от 999 €',
    desc: 'За малки бизнеси, фрийлансъри и стартиращи проекти.',
    features: [
      'До 5 страници',
      'Responsive дизайн',
      'On-page SEO',
      'Core Web Vitals 90+',
      'Google Business Profile',
      'Schema.org markup',
      'Контактна форма',
    ],
    highlight: false,
  },
  {
    name: 'Бизнес сайт',
    price: 'от 1 999 €',
    desc: 'За утвърдени бизнеси с повече нужди.',
    features: [
      'До 15 страници',
      'Responsive дизайн',
      'Пълно SEO + GEO',
      'Core Web Vitals 90+',
      'LocalBusiness Schema',
      'Блог секция',
      'Интеграции (форми, карти)',
      'Месечен SEO доклад',
    ],
    highlight: true,
  },
  {
    name: 'Онлайн магазин',
    price: 'от 2 999 €',
    desc: 'За e-commerce проекти с продуктов каталог.',
    features: [
      'Неограничени продукти',
      'Плащания онлайн',
      'Product Schema',
      'SEO + GEO оптимизация',
      'Core Web Vitals 90+',
      'Управление на поръчки',
      'Интеграция с куриери',
    ],
    highlight: false,
  },
];

const whyMatters = [
  {
    icon: 'ri-search-line',
    title: 'SEO от старт — не след',
    desc: 'Сайт без SEO е като магазин без витрина. Всеки наш сайт включва on-page SEO, Schema.org и GEO оптимизация от първия ден.',
  },
  {
    icon: 'ri-speed-line',
    title: 'Core Web Vitals 90+',
    desc: 'Google гледа скоростта. Бавен сайт = по-ниско класиране. Всеки наш сайт постига 90+ в PageSpeed Insights.',
  },
  {
    icon: 'ri-robot-line',
    title: 'GEO за AI търсачки',
    desc: 'ChatGPT, Perplexity и Gemini вече препоръчват бизнеси. Оптимизираме за AI от старт — не като допълнение.',
  },
  {
    icon: 'ri-smartphone-line',
    title: 'Mobile-first дизайн',
    desc: '70% от трафика е мобилен. Всеки наш сайт е проектиран първо за телефон, после за десктоп.',
  },
];

const mistakes = [
  {
    mistake: 'Евтин сайт без SEO',
    fix: 'Сайт за 200 лв. без SEO е невидим в Google. Инвестирайте в качество от старт — по-евтино е от ремонт след.',
  },
  {
    mistake: 'Без Google Business Profile',
    fix: 'GBP е задължителен за местни бизнеси. Без него не се появявате в картата при търсения за Търново.',
  },
  {
    mistake: 'Бавен сайт',
    fix: 'Всяка секунда забавяне = 7% по-малко конверсии. Core Web Vitals директно влияят на Google класирането.',
  },
  {
    mistake: 'Без Schema.org markup',
    fix: 'Структурираните данни помагат на Google и AI търсачките да разберат бизнеса ви. Задължително за локален SEO.',
  },
  {
    mistake: 'Без мобилна оптимизация',
    fix: '70% от трафика е мобилен. Сайт, който не работи на телефон, губи 70% от потенциалните клиенти.',
  },
];

export default function IzrabotkaNaSaitTarnovoPage() {
  useEffect(() => {
    const id = 'schema-blog-sait-tarnovo';
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement('script');
      el.id = id;
      el.type = 'application/ld+json';
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(ARTICLE_SCHEMA);

    const faqId = 'schema-blog-sait-tarnovo-faq';
    let faqEl = document.getElementById(faqId) as HTMLScriptElement | null;
    if (!faqEl) {
      faqEl = document.createElement('script');
      faqEl.id = faqId;
      faqEl.type = 'application/ld+json';
      document.head.appendChild(faqEl);
    }
    faqEl.textContent = JSON.stringify(FAQ_SCHEMA);

    document.title = 'Изработка на сайт Велико Търново 2026 — цени, срокове и какво да очаквате | ТАВОРА ЕООД';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Изработка на сайт Велико Търново — реални цени от 999 €, срокове и case studies. K-Food #1 в Google + ChatGPT, Sunrise Food #1 за 3–4 седмици. ТАВОРА ЕООД.');
    }
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://imashnujnoto.com/blog/izrabotka-na-sait-tarnovo');

    return () => {
      ['schema-blog-sait-tarnovo', 'schema-blog-sait-tarnovo-faq'].forEach((sid) => {
        const e = document.getElementById(sid);
        if (e) e.remove();
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <SharedNav />

      <main className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-20">

        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="flex items-center gap-2 text-[11px] text-[#1C1C1E]/65 mb-8 flex-wrap">
          <Link to="/" className="hover:text-[#1C1C1E]/60 transition-colors">Начало</Link>
          <i className="ri-arrow-right-s-line text-xs" />
          <Link to="/blog" className="hover:text-[#1C1C1E]/60 transition-colors">Блог</Link>
          <i className="ri-arrow-right-s-line text-xs" />
          <span className="text-[#1C1C1E]/65">Изработка на сайт Велико Търново</span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-[10px] px-2.5 py-1 rounded-full font-medium bg-teal-50 text-teal-700">Уеб дизайн</span>
            <span className="text-[10px] text-[#1C1C1E]/70">28 Апр 2026 · 10 мин. четене</span>
          </div>

          <h1
            className="text-3xl md:text-5xl font-light text-[#1C1C1E] leading-tight mb-5"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Изработка на сайт Велико Търново 2026 —
            <br />
            <span className="italic text-[#0A2540]">цени, срокове и какво да очаквате.</span>
          </h1>

          <p className="text-base text-[#1C1C1E]/65 leading-relaxed mb-6 max-w-2xl">
            <strong className="text-[#1C1C1E]">Изработката на сайт в Търново</strong> е инвестиция, не разход.
            Но само ако е направена правилно — с SEO от старт, Core Web Vitals 90+ и GEO за AI търсачки.
            Ето реалните цени, срокове и какво прави разликата между сайт, който работи, и такъв, който не.
          </p>

          <div className="flex items-center gap-4 text-xs text-[#1C1C1E]/65 pb-8 border-b border-[#1C1C1E]/8">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#0A2540]/10 flex items-center justify-center">
                <i className="ri-user-line text-[10px] text-[#0A2540]/60" />
              </div>
              <span>Владимир Атанасов</span>
            </div>
            <span>·</span>
            <span>ТАВОРА ЕООД</span>
            <span>·</span>
            <Link to="/uslugi/izrabotka-na-sait" className="text-[#0A2540] hover:underline decoration-dotted">Услугата →</Link>
          </div>
        </header>

        {/* Hero image */}
        <div className="w-full h-[260px] md:h-[380px] rounded-2xl overflow-hidden mb-12">
          <img
            src="https://readdy.ai/api/search-image?query=web%20design%20development%20website%20creation%20laptop%20screen%20modern%20UI%20design%20clean%20minimal%20white%20background%20professional%20workspace%20Bulgaria%20Veliko%20Tarnovo%202026&width=1200&height=630&seq=blog-sait-tarnovo-hero&orientation=landscape"
            alt="Изработка на сайт Велико Търново — ТАВОРА ЕООД"
            className="w-full h-full object-cover object-top"
          />
        </div>

        {/* Intro */}
        <section className="mb-12">
          <p className="text-sm text-[#1C1C1E]/60 leading-relaxed mb-4">
            Когато Sunrise Food се свърза с нас, нямаха нищо онлайн. Нито сайт, нито Google Business Profile, нито социални медии.
            За 3–4 седмици изградихме сайт от нула и ги класирахме на <strong className="text-[#1C1C1E]">#1 в Google</strong> за „гъби кладница онлайн".
          </p>
          <p className="text-sm text-[#1C1C1E]/60 leading-relaxed mb-4">
            Разликата? Сайтът беше изграден с <strong className="text-[#1C1C1E]">SEO от старт</strong> — не добавен след.
            Core Web Vitals 90+, LocalBusiness Schema, GEO оптимизация за ChatGPT.
            Не теория — реален резултат, верифицируем.
          </p>
          <p className="text-sm text-[#1C1C1E]/60 leading-relaxed">
            В тази статия ще разгледаме реалните цени за изработка на сайт в Търново, какво включва качественият сайт
            и как да избегнете скъпите грешки, които правят повечето бизнеси.
          </p>
        </section>

        {/* Case studies */}
        <section className="mb-14">
          <h2
            className="text-2xl md:text-3xl font-light text-[#1C1C1E] leading-tight mb-6"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Реални сайтове от Търново.
            <br />
            <span className="italic text-[#0A2540]">Верифицируеми резултати.</span>
          </h2>

          <div className="space-y-5 mb-6">
            {caseStudies.map((cs) => (
              <div key={cs.name} className="p-6 rounded-2xl border border-[#1C1C1E]/8 bg-white">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center rounded-xl border border-[#1C1C1E]/8">
                      <i className={`${cs.icon} text-lg`} style={{ color: cs.color }} />
                    </div>
                    <div>
                      <a
                        href={cs.url}
                        target="_blank"
                        rel="nofollow noopener noreferrer"
                        className="text-sm font-medium text-[#1C1C1E] hover:text-[#0A2540] transition-colors cursor-pointer"
                      >
                        {cs.name} ↗
                      </a>
                      <div className="text-[10px] text-[#1C1C1E]/65">{cs.type}</div>
                    </div>
                  </div>
                  <span className="text-[10px] px-2.5 py-1 rounded-full font-medium whitespace-nowrap shrink-0" style={{ backgroundColor: `${cs.color}15`, color: cs.color }}>
                    {cs.result}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 rounded-xl bg-red-50/50 border border-red-100/50">
                    <div className="text-[10px] font-medium text-red-600 mb-1">Проблем</div>
                    <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">{cs.challenge}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-green-50/50 border border-green-100/50">
                    <div className="text-[10px] font-medium text-green-700 mb-1">Решение</div>
                    <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">{cs.solution}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-[#1C1C1E]/65">
                  <i className="ri-time-line text-xs" />
                  <span>Резултат за: {cs.time}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl border border-[#0A2540]/12 bg-[#0A2540]/3">
            <p className="text-xs text-[#1C1C1E]/60 leading-relaxed">
              <strong className="text-[#0A2540]">Важно:</strong> Всички резултати са верифицируеми.
              Отворете Google и потърсете „гъби кладница онлайн" или „корейска храна велико търново".
              Не обещаваме — доказваме.
            </p>
          </div>
        </section>

        {/* Why SEO from start */}
        <section className="mb-14">
          <h2
            className="text-2xl md:text-3xl font-light text-[#1C1C1E] leading-tight mb-6"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Защо SEO от старт е
            <br />
            <span className="italic text-[#0A2540]">задължително, не опция?</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {whyMatters.map((item) => (
              <div key={item.title} className="p-5 rounded-2xl border border-[#1C1C1E]/8 bg-[#F9F9F9]">
                <div className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#0A2540]/10 bg-[#0A2540]/4 mb-3">
                  <i className={`${item.icon} text-[#0A2540]/60 text-base`} />
                </div>
                <h3 className="text-sm font-medium text-[#1C1C1E] mb-1.5">{item.title}</h3>
                <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="p-5 rounded-2xl border border-amber-200/60 bg-amber-50/40">
            <div className="flex items-start gap-2.5">
              <i className="ri-alert-line text-amber-600 text-sm shrink-0 mt-0.5" />
              <p className="text-sm text-[#1C1C1E]/60 leading-relaxed">
                <strong className="text-[#1C1C1E]">Честа грешка:</strong> Много бизнеси правят сайт без SEO, после плащат двойно за „SEO оптимизация" на вече готов сайт.
                Много по-евтино е да го направите правилно от старт.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="mb-14">
          <h2
            className="text-2xl md:text-3xl font-light text-[#1C1C1E] leading-tight mb-6"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Реални цени за изработка
            <br />
            <span className="italic text-[#0A2540]">на сайт в Търново.</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={`p-5 rounded-2xl border ${tier.highlight ? 'border-[#0A2540]/25 bg-[#0A2540]/3' : 'border-[#1C1C1E]/8 bg-white'}`}
              >
                {tier.highlight && (
                  <div className="text-[10px] font-medium text-[#0A2540] tracking-widest uppercase mb-3">Най-популярен</div>
                )}
                <div className="text-sm font-medium text-[#1C1C1E] mb-1">{tier.name}</div>
                <div
                  className="text-2xl font-light text-[#0A2540] mb-2"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {tier.price}
                </div>
                <p className="text-xs text-[#1C1C1E]/65 leading-relaxed mb-4">{tier.desc}</p>
                <div className="space-y-2">
                  {tier.features.map((f) => (
                    <div key={f} className="flex items-center gap-2">
                      <div className="w-4 h-4 flex items-center justify-center rounded-full border border-[#1B4332]/20 shrink-0">
                        <i className="ri-check-line text-[9px] text-[#1B4332]" />
                      </div>
                      <span className="text-xs text-[#1C1C1E]/65">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">
            * Всички цени са ориентировъчни. Консултацията е 50 € и включва точна оферта за вашия проект.
            Тази сума се приспада при сключване на договор.
          </p>
        </section>

        {/* 5 mistakes */}
        <section className="mb-14">
          <h2
            className="text-2xl md:text-3xl font-light text-[#1C1C1E] leading-tight mb-6"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            5 грешки при изработка
            <br />
            <span className="italic text-[#0A2540]">на сайт в Търново.</span>
          </h2>

          <div className="space-y-3">
            {mistakes.map((item, i) => (
              <div key={item.mistake} className="p-5 rounded-2xl border border-[#1C1C1E]/8 bg-white">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 flex items-center justify-center rounded-full bg-red-50 border border-red-100 shrink-0 mt-0.5">
                    <span className="text-[10px] font-medium text-red-500">{i + 1}</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#1C1C1E] mb-1.5 flex items-center gap-2">
                      <i className="ri-close-line text-red-400 text-sm" />
                      {item.mistake}
                    </div>
                    <div className="flex items-start gap-2">
                      <i className="ri-check-line text-[#1B4332] text-sm shrink-0 mt-0.5" />
                      <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">{item.fix}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How to choose */}
        <section className="mb-14">
          <h2
            className="text-2xl md:text-3xl font-light text-[#1C1C1E] leading-tight mb-6"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Как да изберете агенция
            <br />
            <span className="italic text-[#0A2540]">за сайт в Търново?</span>
          </h2>

          <div className="space-y-3 mb-6">
            {[
              { icon: 'ri-check-line', color: '#1B4332', text: 'Портфолио с верифицируеми резултати — не само красиви снимки' },
              { icon: 'ri-check-line', color: '#1B4332', text: 'SEO включено в цената — не като допълнителна опция' },
              { icon: 'ri-check-line', color: '#1B4332', text: 'Core Web Vitals 90+ — проверете с PageSpeed Insights' },
              { icon: 'ri-check-line', color: '#1B4332', text: 'Schema.org markup — задължително за локален SEO' },
              { icon: 'ri-check-line', color: '#1B4332', text: 'GEO оптимизация за AI търсачки — новото изискване за 2026' },
              { icon: 'ri-check-line', color: '#1B4332', text: 'Прозрачно ценообразуване — без скрити разходи след' },
            ].map((item) => (
              <div key={item.text} className="flex items-start gap-2.5">
                <div className="w-5 h-5 flex items-center justify-center rounded-full border shrink-0 mt-0.5" style={{ borderColor: `${item.color}30` }}>
                  <i className={`${item.icon} text-[10px]`} style={{ color: item.color }} />
                </div>
                <span className="text-sm text-[#1C1C1E]/65 leading-relaxed">{item.text}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Internal links */}
        <section className="mb-14 p-6 rounded-2xl border border-[#1C1C1E]/8 bg-[#F9F9F9]">
          <h3
            className="text-lg font-light text-[#1C1C1E] mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Свързани ресурси
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { to: '/uslugi/izrabotka-na-sait', label: 'Изработка на сайт — услугата', desc: 'Пълна информация, цени и процес' },
              { to: '/seo-veliko-tarnovo', label: 'SEO Велико Търново', desc: '#1 позиции в Google и AI търсачки' },
              { to: '/blog/seo-optimizaciya-tarnovo-2026', label: 'SEO ръководство 2026', desc: 'Пълно ръководство за SEO в Търново' },
              { to: '/digitalen-marketing-veliko-tarnovo', label: 'Дигитален маркетинг Търново', desc: 'SEO + реклами + видео на едно място' },
              { to: '/blog/google-business-vt', label: 'Google Business Profile', desc: 'Задължително за местни бизнеси' },
              { to: '/kontakt', label: 'Свържете се с нас', desc: 'Консултация за вашия сайт — 50 €' },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-[#1C1C1E]/6 hover:border-[#0A2540]/20 transition-all group cursor-pointer"
              >
                <i className="ri-arrow-right-line text-[#0A2540]/65 text-xs mt-0.5 group-hover:translate-x-0.5 transition-transform shrink-0" />
                <div>
                  <div className="text-xs font-medium text-[#1C1C1E] group-hover:text-[#0A2540] transition-colors">{link.label}</div>
                  <div className="text-[10px] text-[#1C1C1E]/65 leading-relaxed">{link.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-14">
          <h2
            className="text-2xl md:text-3xl font-light text-[#1C1C1E] leading-tight mb-8"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Въпроси за изработка
            <br />
            <span className="italic text-[#0A2540]">на сайт в Търново.</span>
          </h2>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item) => (
              <details key={item.q} className="group rounded-2xl border border-[#1C1C1E]/8 bg-[#F9F9F9] overflow-hidden">
                <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none">
                  <span className="text-sm font-medium text-[#1C1C1E]">{item.q}</span>
                  <i className="ri-add-line text-[#0A2540]/65 text-base shrink-0 group-open:hidden" />
                  <i className="ri-subtract-line text-[#0A2540]/65 text-base shrink-0 hidden group-open:block" />
                </summary>
                <div className="px-5 pb-4">
                  <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">{item.a}</p>
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mb-14 p-6 md:p-8 rounded-2xl border border-[#1C1C1E]/8 bg-[#0F1F35] text-white">
          <h2
            className="text-xl md:text-2xl font-light text-white leading-tight mb-3"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Готови ли сте за сайт,
            <br />
            <span className="italic text-white/60">който работи за вас?</span>
          </h2>
          <p className="text-sm text-white/75 leading-relaxed mb-5">
            Консултацията е 50 € — анализ на нуждите, конкурентите и точна оферта.
            Тази сума се приспада при сключване на договор. Гаранция за връщане на парите.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/kontakt"
              className="px-6 py-3 bg-white text-[#0A2540] text-sm rounded-full hover:bg-white/90 transition-all cursor-pointer whitespace-nowrap text-center font-medium"
            >
              Поискайте консултация →
            </Link>
            <Link
              to="/uslugi/izrabotka-na-sait"
              className="px-6 py-3 border border-white/20 text-white/70 text-sm rounded-full hover:border-white/40 hover:text-white transition-all cursor-pointer whitespace-nowrap text-center"
            >
              Вижте услугата →
            </Link>
          </div>
        </section>

        {/* Author */}
        <div className="flex items-start gap-4 pt-8 border-t border-[#1C1C1E]/8">
          <div className="w-12 h-12 rounded-full bg-[#0A2540]/8 flex items-center justify-center shrink-0">
            <i className="ri-user-line text-[#0A2540]/65 text-lg" />
          </div>
          <div>
            <div className="text-sm font-medium text-[#1C1C1E] mb-0.5">Владимир Атанасов</div>
            <div className="text-xs text-[#1C1C1E]/65 mb-2">Основател, ТАВОРА ЕООД · Велико Търново</div>
            <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">
              Специалист по дигитален маркетинг, SEO и изработка на сайтове за бизнеси от Велико Търново и цяла България.
              Работил с K-Food, Sunrise Food, Академика 245 и Амалипе.
            </p>
          </div>
        </div>

      </main>

      <SharedFooter />
    </div>
  );
}
