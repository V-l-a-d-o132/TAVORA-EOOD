import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SharedNav from '@/components/feature/SharedNav';
import SharedFooter from '@/components/feature/SharedFooter';

const FAQ_ITEMS = [
  {
    q: 'Какво е Marketing Basics и за кого е?',
    a: 'Marketing Basics е 20-модулна програма за изграждане на цялостна маркетинг система — от позициониране до превръщане на посетителите в клиенти. За собственици на бизнес, маркетинг мениджъри и предприемачи, които искат систематизиран маркетинг.',
  },
  {
    q: 'Как е структурирана програмата?',
    a: '20 модула в 4 групи: Позициониране (модули 1-5), Присъствие (6-10), Трафик (11-15) и Превръщане (16-20). Всяка група е самостоятелна фаза. 177 урока общо — от основи до advanced тактики.',
  },
  {
    q: 'Трябва ли ми предишен маркетинг опит?',
    a: 'Не. Започваме от основите на позиционирането — кой си ти, за кого си, какво предлагаш. Всеки следващ модул надгражда. Ако имаш бизнес, можеш да започнеш веднага.',
  },
  {
    q: 'Колко време отнема?',
    a: '177 урока, всеки между 15-45 минути. Най-добрият подход е по 1 модул на седмица — така цялата програма отнема 20 седмици. Но можеш и по-бързо, ако имаш време.',
  },
  {
    q: 'Как Marketing Basics се различава от AI Business Blueprint?',
    a: 'Marketing Basics е чисто маркетингова програма — фокусирана върху стратегия, канали и конверсия. AI Business Blueprint включва и технически умения (изграждане на сайтове, AI инструменти, киберсигурност). Двете се допълват перфектно.',
  },
  {
    q: 'Ще мога ли веднага да приложа наученото?',
    a: 'Да — всеки модул завършва с конкретна задача: "направи X за твоя бизнес". След модул 5 ще имаш завършено позициониране. След модул 10 — пълно онлайн присъствие. След модул 20 — цялостна маркетинг система.',
  },
  {
    q: 'Подходящо ли е за локален бизнес?',
    a: 'Абсолютно. Програмата работи както за национален, така и за локален бизнес. Отделни модули покриват локално SEO, Google Business Profile и гео-таргетирани кампании. Имаме клиенти във Велико Търново, които са #1 в Google благодарение на тази система.',
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
      '@id': 'https://imashnujnoto.com/blog/marketing-basics-palna-sistema#article',
      headline: 'Marketing Basics — пълната маркетинг система за бизнес: от основа до скалиране',
      description: '20 модула в 4 групи: позициониране, присъствие, трафик и превръщане. Пълната маркетинг система за всеки бизнес. 177 урока. ТАВОРА ЕООД.',
      url: 'https://imashnujnoto.com/blog/marketing-basics-palna-sistema',
      datePublished: '2026-07-07',
      dateModified: today,
      inLanguage: 'bg',
      wordCount: 3600,
      timeRequired: 'PT12M',
      keywords: [
        'маркетинг обучение България',
        'маркетинг стратегия за бизнес',
        'дигитален маркетинг система',
        'маркетинг за малък бизнес',
        'маркетинг фуния',
        'маркетинг от нулата',
        'онлайн маркетинг България',
        'бизнес маркетинг обучение',
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
        url: 'https://readdy.ai/api/search-image?query=modern%20marketing%20strategy%20dashboard%20analytics%20charts%20funnel%20diagrams%20data%20visualization%20clean%20minimalist%20white%20background%20professional%20business%20growth%20metrics%20conversion%20rates%20editorial%20photography&width=1200&height=630&seq=blog-marketing-basics-hero&orientation=landscape',
        width: 1200,
        height: 630,
      },
      isPartOf: { '@id': 'https://imashnujnoto.com/#website' },
      about: [
        { '@type': 'Thing', name: 'Маркетинг обучение' },
        { '@type': 'Thing', name: 'Дигитален маркетинг' },
        { '@type': 'Thing', name: 'Бизнес стратегия' },
      ],
      mentions: [
        { '@type': 'Organization', name: 'ТАВОРА ЕООД', url: 'https://imashnujnoto.com' },
        { '@type': 'Organization', name: 'Sunrise Food', url: 'https://sunrisefood.eu/' },
        { '@type': 'Organization', name: 'Thalysta', url: 'https://thalysta.com/' },
        { '@type': 'Organization', name: 'Budimse.online', url: 'https://budimse.online/' },
      ],
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Начало', item: 'https://imashnujnoto.com/' },
          { '@type': 'ListItem', position: 2, name: 'Блог', item: 'https://imashnujnoto.com/blog' },
          { '@type': 'ListItem', position: 3, name: 'Marketing Basics — пълна маркетинг система', item: 'https://imashnujnoto.com/blog/marketing-basics-palna-sistema' },
        ],
      },
    },
    {
      '@type': 'LocalBusiness',
      '@id': 'https://imashnujnoto.com/#organization',
      name: 'ТАВОРА ЕООД',
      alternateName: ['Tavora', 'Имаш нужното', 'imashnujnoto'],
      description: 'Дигитален маркетинг агенция и AI бизнес академия. SEO оптимизация, GEO за AI търсачки, рекламни кампании и видео продукция.',
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
        { '@type': 'Country', name: 'България' },
        { '@type': 'City', name: 'Велико Търново' },
        { '@type': 'City', name: 'София' },
        { '@type': 'City', name: 'Пловдив' },
        { '@type': 'City', name: 'Варна' },
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
    },
  ],
};

const GROUPS = [
  {
    id: 'positioning',
    title: 'Група 1: Позициониране',
    subtitle: 'Кой си ти, за кого си и защо някой би платил',
    icon: 'ri-focus-3-line',
    color: '#3B5BDB',
    modules: [
      { num: '01', title: 'Пазарен анализ', desc: 'Разбиране на пазара, конкурентите и възможностите през 2026.', lessons: 4 },
      { num: '02', title: 'Идеален клиент (ICP)', desc: 'Дефиниране на точния профил на клиента, който искаш да привлечеш.', lessons: 4 },
      { num: '03', title: 'Ценностно предложение', desc: 'Какво предлагаш, което никой друг не предлага — и защо има значение.', lessons: 4 },
      { num: '04', title: 'Бранд идентичност', desc: 'Име, лого, глас, тон — всичко, което прави бранда разпознаваем.', lessons: 4 },
      { num: '05', title: 'Ценова стратегия', desc: 'Колко да струва? Пакетиране, психология на цената, ъпсел.', lessons: 4 },
    ],
  },
  {
    id: 'presence',
    title: 'Група 2: Присъствие',
    subtitle: 'Къде и как да те намират',
    icon: 'ri-global-line',
    color: '#2F9E44',
    modules: [
      { num: '06', title: 'Уебсайт архитектура', desc: 'Структура на сайт, който продава — от начална страница до checkout.', lessons: 4 },
      { num: '07', title: 'Google Business Profile', desc: 'GBP оптимизация за локален ранк — задължително за всеки бизнес.', lessons: 4 },
      { num: '08', title: 'Социални мрежи', desc: 'Кои платформи за твоя бизнес? Стратегия за всяка.', lessons: 4 },
      { num: '09', title: 'SEO за бизнес', desc: 'Техническо SEO, ключови думи, съдържание — за да те намират в Google.', lessons: 5 },
      { num: '10', title: 'GEO за AI търсачки', desc: 'Оптимизация за ChatGPT, Perplexity и Google AI Overview.', lessons: 4 },
    ],
  },
  {
    id: 'traffic',
    title: 'Група 3: Трафик',
    subtitle: 'Как да доведеш хора при теб',
    icon: 'ri-traffic-light-line',
    color: '#E67700',
    modules: [
      { num: '11', title: 'Органичен трафик', desc: 'SEO съдържание, блог стратегия и дългосрочен растеж без реклами.', lessons: 4 },
      { num: '12', title: 'Meta реклами', desc: 'Facebook + Instagram реклами — таргетиране, креативи, бюджет.', lessons: 4 },
      { num: '13', title: 'Google Ads', desc: 'Search, Display и Shopping кампании за максимален обхват.', lessons: 4 },
      { num: '14', title: 'Видео трафик', desc: 'YouTube, TikTok и Reels като канали за привличане.', lessons: 4 },
      { num: '15', title: 'Email маркетинг', desc: 'Изграждане на списък, автоматизация и сегментация.', lessons: 4 },
    ],
  },
  {
    id: 'conversion',
    title: 'Група 4: Превръщане',
    subtitle: 'Как интересът става продажба',
    icon: 'ri-exchange-funds-line',
    color: '#e53e3e',
    modules: [
      { num: '16', title: 'Конверсионна психология', desc: 'Защо хората купуват — и как да им помогнеш.', lessons: 4 },
      { num: '17', title: 'Лийд магнити и фунии', desc: 'Създаване на funnel, който води от интерес до покупка.', lessons: 4 },
      { num: '18', title: 'Продажбен процес', desc: 'От запитване до договор — система за затваряне на сделки.', lessons: 4 },
      { num: '19', title: 'Задържане и ъпсел', desc: 'Как да задържиш клиентите и да им продаваш повече.', lessons: 4 },
      { num: '20', title: 'Анализ и оптимизация', desc: 'KPI-та, A/B тестове и постоянна оптимизация на funnel-а.', lessons: 4 },
    ],
  },
];

const STATS_BAR = [
  { value: '20', label: 'модула' },
  { value: '177', label: 'урока' },
  { value: '4 групи', label: 'позициониране → превръщане' },
  { value: '20 сед.', label: 'препоръчително време' },
];

const CASE_STUDIES = [
  {
    client: 'Sunrise Food',
    industry: 'Онлайн магазин за гъби',
    result: '#1 в Google за 3–4 седмици',
    modules: 'Позициониране + Присъствие + Трафик',
    detail: 'Започнахме от ICP дефиниране — кой купува гъби онлайн? След това изградихме SEO архитектура и Product Schema. Резултат: от неизвестен сайт до #1 за "гъби кладница онлайн".',
    color: '#22c55e',
  },
  {
    client: 'Thalysta',
    industry: 'Бижута онлайн',
    result: '+340% продажби',
    modules: 'Позициониране + Трафик + Превръщане',
    detail: 'Пълна маркетинг трансформация: ново позициониране (handmade лукс), Meta реклами с прецизно таргетиране, оптимизиран checkout funnel. От 0 до устойчив ръст.',
    color: '#3B5BDB',
  },
  {
    client: 'Budimse.online',
    industry: 'Образователна платформа',
    result: '+340% органичен трафик',
    modules: 'Присъствие + Трафик',
    detail: 'Фокус върху SEO и съдържание. 6 блог статии по 1200+ думи с оптимизирани ключови думи. Вътрешно свързване. Резултат: класиране за 23 нови ключови думи.',
    color: '#E67700',
  },
];

const FOOLPROOF_PATH = [
  {
    step: '01',
    title: 'Позиционирай се — Група 1',
    desc: 'Без ясно позициониране всичко останало е загуба на пари. Първите 5 модула дефинират кой си, за кого си и защо.',
    time: '5 седмици',
  },
  {
    step: '02',
    title: 'Изгради присъствие — Група 2',
    desc: 'Сайт, Google Business, социални мрежи, SEO — всичко, от което се нуждаеш, за да те намират.',
    time: '5 седмици',
  },
  {
    step: '03',
    title: 'Генерирай трафик — Група 3',
    desc: 'Органичен и платен трафик. Кои канали работят за твоя бизнес и как да не гориш бюджета.',
    time: '5 седмици',
  },
  {
    step: '04',
    title: 'Превръщай в клиенти — Група 4',
    desc: 'Конверсия, продажби, задържане. Система, която носи предвидим резултат всеки месец.',
    time: '5 седмици',
  },
];

const RELATED = [
  { title: 'Академия TAVORA — пълна програма', to: '/kurs', cat: 'Академия', color: 'bg-red-50 text-red-700' },
  { title: 'AI Business Blueprint', to: '/blog/ai-business-blueprint-putyat-na-koprinata', cat: 'AI & Бизнес', color: 'bg-violet-50 text-violet-700' },
  { title: 'Перфектното Видео', to: '/blog/perfektnoto-video-biznes-sistema', cat: 'Видео', color: 'bg-rose-50 text-rose-700' },
  { title: 'Дигитален маркетинг България', to: '/digitalen-marketing-veliko-tarnovo', cat: 'Ръководство', color: 'bg-emerald-50 text-emerald-700' },
  { title: 'Безплатен SEO за #1 в Google', to: '/blog/bezplaten-seo-nomer-edno-google', cat: 'SEO', color: 'bg-emerald-50 text-emerald-700' },
  { title: 'Маркетинг за малък бизнес', to: '/blog/lokalen-biznes-ustoichivo-online-prisastvie', cat: 'Маркетинг', color: 'bg-emerald-50 text-emerald-700' },
];

export default function MarketingBasicsPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [openGroup, setOpenGroup] = useState<string | null>('positioning');

  useEffect(() => {
    document.title = 'Marketing Basics — пълната маркетинг система за бизнес | ТАВОРА ЕООД';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', 'Пълна маркетинг система: 20 модула в 4 групи — позициониране, присъствие, трафик и превръщане. 177 урока. За всеки бизнес. ТАВОРА ЕООД.');
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://imashnujnoto.com/blog/marketing-basics-palna-sistema');

    const id = 'schema-marketing-basics';
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) { el = document.createElement('script'); el.id = id; el.type = 'application/ld+json'; document.head.appendChild(el); }
    el.textContent = JSON.stringify(ARTICLE_SCHEMA);

    const faqId = 'schema-marketing-basics-faq';
    let faqEl = document.getElementById(faqId) as HTMLScriptElement | null;
    if (!faqEl) { faqEl = document.createElement('script'); faqEl.id = faqId; faqEl.type = 'application/ld+json'; document.head.appendChild(faqEl); }
    faqEl.textContent = JSON.stringify(FAQ_SCHEMA);

    return () => {
      ['schema-marketing-basics', 'schema-marketing-basics-faq'].forEach((sid) => { const e = document.getElementById(sid); if (e) e.remove(); });
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
              <span className="text-[#1C1C1E]/65">Marketing Basics</span>
            </nav>

            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span className="text-[10px] px-2.5 py-1 rounded-full font-medium bg-emerald-50 text-emerald-700">Маркетинг</span>
              <span className="text-[10px] px-2.5 py-1 rounded-full font-medium bg-red-50 text-red-700">Академия TAVORA</span>
              <span className="text-[10px] px-2.5 py-1 rounded-full font-medium bg-sky-50 text-sky-700">Обучение</span>
              <span className="text-[10px] text-[#1C1C1E]/70">12 мин. четене · 7 Юли 2026</span>
            </div>

            <h1
              className="text-3xl md:text-5xl font-light text-[#1C1C1E] leading-tight mb-5"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              <em className="text-[#e53e3e]">Marketing Basics</em>
              <br />
              <strong className="font-light">от основа до скалиране</strong>
              <br />
              <span className="text-[#1C1C1E]/60">пълната маркетинг система за бизнес</span>
            </h1>

            <p className="text-sm md:text-base text-[#1C1C1E]/65 max-w-2xl leading-relaxed mb-6">
              <strong className="text-[#1C1C1E]">20 модула в 4 групи:</strong> позициониране, присъствие, трафик и превръщане.
              Системата, която всяка фирма трябва да има — от кварталното кафене до онлайн магазина.
              177 урока, тествани върху реални бизнеси.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/kurs/marketing-basics"
                className="px-6 py-3 bg-[#1C1C1E] text-white text-sm rounded-full hover:bg-[#1C1C1E]/80 transition-all cursor-pointer whitespace-nowrap"
              >
                Разгледай програмата →
              </Link>
              <Link
                to="/digitalen-marketing-veliko-tarnovo"
                className="px-6 py-3 border border-[#1C1C1E]/12 text-[#1C1C1E]/65 text-sm rounded-full hover:border-[#1C1C1E]/30 hover:text-[#1C1C1E] transition-all cursor-pointer whitespace-nowrap"
              >
                Дигитален маркетинг
              </Link>
            </div>
          </div>
        </section>

        {/* ── HERO IMAGE ── */}
        <div className="w-full h-[280px] md:h-[420px] overflow-hidden">
          <img
            src="https://readdy.ai/api/search-image?query=modern%20marketing%20strategy%20planning%20whiteboard%20with%20diagrams%20funnel%20charts%20sticky%20notes%20professional%20team%20brainstorming%20clean%20minimalist%20office%20bright%20natural%20light%20analytical%20business%20growth%20concepts%20editorial%20photography%20no%20text&width=1400&height=420&seq=blog-marketing-hero-img&orientation=landscape"
            alt="Marketing Basics — пълна маркетинг система за бизнес"
            className="w-full h-full object-cover object-top"
          />
        </div>

        <div className="max-w-4xl mx-auto px-4 md:px-16 py-12 md:py-16">

          {/* ── ВЪВЕДЕНИЕ ── */}
          <section className="mb-14">
            <h2 className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Маркетингът не е магия. Това е система.
            </h2>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              Повечето бизнеси правят маркетинг на парче — пуснат един пост, платят една реклама, напишат една статия.
              И после се чудят защо няма резултат.
            </p>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              <strong className="text-[#1C1C1E]">Маркетингът работи, когато е система.</strong>
              Когато всяко действие е част от по-голям план. Когато знаеш кой си (позициониране), къде си (присъствие),
              как идват хората (трафик) и какво правят като дойдат (превръщане).
            </p>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-6">
              <strong className="text-[#1C1C1E]">Marketing Basics</strong> е точно тази система.
              Създадохме я от опита си с десетки реални клиенти — от Sunrise Food (#1 Google) до Thalysta (+340% продажби).
              Всяка стъпка е тествана. Всеки резултат е верифицируем.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-2xl bg-[#F9F9F7] border border-[#1C1C1E]/6">
              {STATS_BAR.map((s) => (
                <div key={s.value} className="text-center">
                  <div className="text-xl md:text-2xl font-light text-[#1C1C1E] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{s.value}</div>
                  <div className="text-[10px] text-[#1C1C1E]/65 leading-tight">{s.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ── 4-ТЕ ГРУПИ ── */}
          <section className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[1px] bg-[#1C1C1E]/20 shrink-0" />
              <span className="text-xs text-[#1C1C1E]/60">Структура на програмата</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              4-те стълба на маркетинга.
            </h2>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-8">
              Всяка група е самостоятелна фаза. Можеш да започнеш от тази, която ти трябва най-много.
            </p>

            <div className="space-y-4">
              {GROUPS.map((group) => (
                <div key={group.id} className="rounded-2xl border border-[#1C1C1E]/8 overflow-hidden">
                  <button
                    className="w-full flex items-center gap-4 p-5 md:p-6 text-left cursor-pointer hover:bg-[#F9F9F7] transition-colors"
                    onClick={() => setOpenGroup(openGroup === group.id ? null : group.id)}
                  >
                    <div className="w-12 h-12 flex items-center justify-center rounded-xl shrink-0" style={{ backgroundColor: `${group.color}12` }}>
                      <i className={`${group.icon} text-xl`} style={{ color: group.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-medium text-[#1C1C1E] mb-0.5">{group.title}</h3>
                      <p className="text-xs text-[#1C1C1E]/65">{group.subtitle}</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#1C1C1E]/65 shrink-0">
                      <span>{group.modules.length} модула</span>
                      <i className={`text-sm transition-transform ${openGroup === group.id ? 'ri-subtract-line' : 'ri-add-line'}`} />
                    </div>
                  </button>
                  {openGroup === group.id && (
                    <div className="px-5 md:px-6 pb-5 md:pb-6 bg-[#F9F9F7] border-t border-[#1C1C1E]/6">
                      <div className="space-y-2 pt-4">
                        {group.modules.map((mod) => (
                          <div key={mod.num} className="flex items-start gap-3 p-3 rounded-xl bg-white border border-[#1C1C1E]/5">
                            <div className="w-7 h-7 flex items-center justify-center rounded-lg shrink-0 text-xs font-medium" style={{ backgroundColor: `${group.color}12`, color: group.color }}>
                              {mod.num}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-medium text-[#1C1C1E] mb-0.5">{mod.title}</div>
                              <p className="text-[11px] text-[#1C1C1E]/65 leading-relaxed">{mod.desc}</p>
                            </div>
                            <span className="text-[10px] text-[#1C1C1E]/65 shrink-0">{mod.lessons} урока</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ── ПЪТЯТ ОТ 20 СЕДМИЦИ ── */}
          <section className="mb-14 p-6 md:p-8 rounded-2xl bg-[#F9F9F7] border border-[#1C1C1E]/6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[1px] bg-[#1C1C1E]/20 shrink-0" />
              <span className="text-xs text-[#1C1C1E]/60">Пътят</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              20 седмици до цялостна маркетинг система.
            </h2>

            <div className="space-y-6">
              {FOOLPROOF_PATH.map((step, i) => (
                <div key={step.step} className="flex items-start gap-4">
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-10 h-10 flex items-center justify-center rounded-xl text-sm font-medium text-white" style={{ backgroundColor: ['#3B5BDB', '#2F9E44', '#E67700', '#e53e3e'][i] }}>
                      {step.step}
                    </div>
                    {i < FOOLPROOF_PATH.length - 1 && (
                      <div className="w-px h-8 bg-[#1C1C1E]/10 mt-2" />
                    )}
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium text-[#1C1C1E]">{step.title}</h4>
                      <span className="text-[10px] text-[#1C1C1E]/65">{step.time}</span>
                    </div>
                    <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-[#1C1C1E]/6 text-center">
              <p className="text-xs text-[#1C1C1E]/65">
                Това не е състезание. Можеш да минеш и по-бързо, и по-бавно. Важното е да не спираш.
              </p>
            </div>
          </section>

          {/* ── CASE STUDIES ── */}
          <section className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[1px] bg-[#1C1C1E]/20 shrink-0" />
              <span className="text-xs text-[#1C1C1E]/60">Реални резултати</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Система, доказана с резултати.
            </h2>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-8">
              Тези бизнеси приложиха различни части от системата — и ето какво постигнаха.
            </p>

            <div className="space-y-4">
              {CASE_STUDIES.map((cs, i) => (
                <div key={cs.client} className="rounded-2xl border border-[#1C1C1E]/8 overflow-hidden">
                  <div className="p-5 md:p-7">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <div>
                        <div className="text-base font-medium text-[#1C1C1E]">{cs.client}</div>
                        <div className="text-xs text-[#1C1C1E]/65">{cs.industry}</div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] px-2 py-1 rounded-full font-medium" style={{ backgroundColor: `${cs.color}12`, color: cs.color }}>
                          {cs.result}
                        </span>
                        <span className="text-[10px] text-[#1C1C1E]/65">{cs.modules}</span>
                      </div>
                    </div>
                    <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">{cs.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── ЗА КОГО ── */}
          <section className="mb-14 p-6 md:p-8 rounded-2xl bg-[#F9F9F7] border border-[#1C1C1E]/6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[1px] bg-[#1C1C1E]/20 shrink-0" />
              <span className="text-xs text-[#1C1C1E]/60">За кого?</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Marketing Basics е за всеки бизнес.
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { icon: 'ri-store-2-line', title: 'Малък бизнес', desc: 'Кварталното кафене, фризьорският салон, магазинчето — всеки има нужда от система.' },
                { icon: 'ri-shopping-cart-2-line', title: 'E-commerce', desc: 'Онлайн магазините се нуждаят от трафик и конверсия — групи 3 и 4 са за тях.' },
                { icon: 'ri-building-2-line', title: 'B2B компании', desc: 'LinkedIn, SEO, имейл маркетинг — групи 2 и 3 покриват B2B каналите.' },
                { icon: 'ri-user-star-line', title: 'Фрийлансъри', desc: 'Личен бранд, позициониране и привличане на клиенти — групи 1 и 2.' },
                { icon: 'ri-rocket-2-line', title: 'Стартъпи', desc: 'Бързо валидиране на пазара и growth стратегия — всички 4 групи.' },
                { icon: 'ri-restaurant-2-line', title: 'Ресторанти', desc: 'Google Business, локално SEO, социални мрежи — специализирани модули.' },
              ].map((item) => (
                <div key={item.title} className="p-4 rounded-xl border border-[#1C1C1E]/8 bg-white">
                  <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#0A2540]/6 mb-3">
                    <i className={`${item.icon} text-sm text-[#0A2540]`} />
                  </div>
                  <h4 className="text-xs font-medium text-[#1C1C1E] mb-1">{item.title}</h4>
                  <p className="text-[11px] text-[#1C1C1E]/65 leading-relaxed">{item.desc}</p>
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
            <h2 className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Чести въпроси за Marketing Basics.
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
                <div className="text-xs text-white/75 tracking-widest uppercase mb-2">Готов да систематизираш маркетинга си?</div>
                <div className="text-2xl md:text-3xl font-light leading-tight mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Marketing Basics
                  <br />
                  <span className="italic text-white/60">разгледай актуалната програма и цената</span>
                </div>
                <p className="text-sm text-white/75 max-w-md leading-relaxed">
                  Първият модул (Пазарен анализ) е безплатен. Започни да изграждаш системата си днес.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <Link to="/kurs/marketing-basics" className="px-7 py-3.5 bg-white text-[#0A2540] text-sm rounded-full hover:bg-white/90 transition-all cursor-pointer whitespace-nowrap text-center font-medium">
                  Разгледай програмата →
                </Link>
                <Link to="/digitalen-marketing-veliko-tarnovo" className="px-7 py-3.5 border border-white/20 text-white/70 text-sm rounded-full hover:border-white/40 hover:text-white transition-all cursor-pointer whitespace-nowrap text-center">
                  Дигитален маркетинг
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
              <div className="text-xs text-[#1C1C1E]/65 mb-2">Основател, ТАВОРА ЕООД · Маркетинг стратег</div>
              <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">
                Изградил е маркетинг системи за над 10 бизнеса — от локални до национални. Клиентите му са #1 в Google и ChatGPT.
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="mt-8 pt-6 border-t border-[#1C1C1E]/6">
            <p className="text-xs text-[#1C1C1E]/60 leading-relaxed">
              Имаш въпрос за програмата? Пиши ни на{' '}
              <a href="mailto:hello@imashnujnoto.com" className="text-[#0A2540] underline decoration-dotted hover:no-underline">hello@imashnujnoto.com</a>.
            </p>
          </div>
        </div>
      </main>

      <SharedFooter />
    </div>
  );
}