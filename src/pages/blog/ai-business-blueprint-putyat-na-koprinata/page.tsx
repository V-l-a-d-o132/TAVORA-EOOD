import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SharedNav from '@/components/feature/SharedNav';
import SharedFooter from '@/components/feature/SharedFooter';

const FAQ_ITEMS = [
  {
    q: 'Какво точно е AI Business Blueprint и за кого е?',
    a: 'AI Business Blueprint (Пътят на коприната) е 11-модулна система за изграждане на дигитален бизнес с AI. За предприемачи, фрийлансъри и хора, които искат да монетизират AI умения. От нула до работеща система — с реални, тествани стъпки.',
  },
  {
    q: 'Трябва ли ми технически опит?',
    a: 'Не. Първият модул (AI Advantage) започва от абсолютна нула — как да работиш с ChatGPT, Claude и Gemini. Всеки следващ модул надгражда. Ако можеш да пишеш имейл, можеш да започнеш.',
  },
  {
    q: 'Колко време отнема да видя резултати?',
    a: 'Първите 3 модула дават база за 2-3 седмици. Първи платени проекти идват при модул 6 (The Conversion System). Първите платени проекти са реалистични след няколко месеца последователна работа. Това не е "бързи пари" — това е система.',
  },
  {
    q: 'Какво прави тази програма различна от другите?',
    a: 'Всичко е тествано върху реални клиентски проекти на ТАВОРА ЕООД. Не преподаваме теория от YouTube — преподаваме система, която работи: Sunrise Food #1 Google, K-Food #1 Google+ChatGPT, NP Massage Studio #1 Google+ChatGPT. Резултатите са верифицируеми.',
  },
  {
    q: 'Мога ли да получа достъп само до отделни модули?',
    a: 'Да — всеки модул може да се закупи самостоятелно. Модул 01 (AI Advantage) е безплатен. Модулите 02-10 се отключват поотделно или на пакет. Модул 11 (The Revenue Blueprint) е премиум и изисква завършени минимум 5 други модула.',
  },
  {
    q: 'Има ли гаранция за резултат?',
    a: 'Никоя сериозна програма не може да гарантира резултат — зависи от теб. Но можем да гарантираме, че всеки модул съдържа точните стъпки, които ние използваме за реални клиенти. Ако ги следваш — системата работи.',
  },
  {
    q: 'Как се различава AI Blueprint от Marketing Basics и Перфектното Видео?',
    a: 'AI Blueprint е цялостната бизнес система — от AI до клиенти. Marketing Basics е задълбочена маркетинг програма за фирми. Перфектното Видео е специализирана видео продукция система. Те се допълват, но са самостоятелни продукти.',
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
      '@id': 'https://imashnujnoto.com/blog/ai-business-blueprint-putyat-na-koprinata#article',
      headline: 'AI Business Blueprint — Пътят на коприната: от AI промптиране до система за клиенти',
      description: 'Пълната система за изграждане на дигитален бизнес с AI. 11 модула: от AI промптиране до Revenue Blueprint. Тествано върху реални клиентски проекти. ТАВОРА ЕООД.',
      url: 'https://imashnujnoto.com/blog/ai-business-blueprint-putyat-na-koprinata',
      datePublished: '2026-07-07',
      dateModified: today,
      inLanguage: 'bg',
      wordCount: 3800,
      timeRequired: 'PT14M',
      keywords: [
        'AI бизнес обучение България',
        'как да правя пари с изкуствен интелект',
        'AI маркетинг България',
        'ChatGPT за бизнес',
        'дигитален бизнес от нулата',
        'онлайн бизнес България',
        'Пътят на коприната AI',
        'AI Business Blueprint',
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
        url: 'https://readdy.ai/api/search-image?query=dark%20minimalist%20futuristic%20AI%20business%20blueprint%20digital%20transformation%20neural%20network%20glowing%20nodes%20interconnected%20pathways%20deep%20black%20background%20red%20geometric%20accents%20professional%20cinematic%20atmosphere%20editorial%20quality&width=1200&height=630&seq=blog-ai-blueprint-hero&orientation=landscape',
        width: 1200,
        height: 630,
      },
      isPartOf: { '@id': 'https://imashnujnoto.com/#website' },
      about: [
        { '@type': 'Thing', name: 'AI бизнес обучение' },
        { '@type': 'Thing', name: 'Изкуствен интелект за бизнес' },
        { '@type': 'Thing', name: 'Дигитален бизнес' },
      ],
      mentions: [
        { '@type': 'Organization', name: 'ТАВОРА ЕООД', url: 'https://imashnujnoto.com' },
        { '@type': 'Organization', name: 'Sunrise Food', url: 'https://sunrisefood.eu/' },
        { '@type': 'Organization', name: 'K-Food Велико Търново', url: 'https://k-foodvelikotarnovo.com/' },
        { '@type': 'Organization', name: 'NP Massage Studio', url: 'https://np-massage.com/' },
      ],
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Начало', item: 'https://imashnujnoto.com/' },
          { '@type': 'ListItem', position: 2, name: 'Блог', item: 'https://imashnujnoto.com/blog' },
          { '@type': 'ListItem', position: 3, name: 'AI Business Blueprint — Пътят на коприната', item: 'https://imashnujnoto.com/blog/ai-business-blueprint-putyat-na-koprinata' },
        ],
      },
    },
    {
      '@type': 'LocalBusiness',
      '@id': 'https://imashnujnoto.com/#organization',
      name: 'ТАВОРА ЕООД',
      alternateName: ['Tavora', 'Имаш нужното', 'imashnujnoto'],
      description: 'Дигитален маркетинг агенция и AI бизнес академия. SEO оптимизация, GEO за AI търсачки, рекламни кампании, видео продукция и AI бизнес обучение.',
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

const MODULES_LIST = [
  {
    num: '01',
    tag: 'FREE',
    title: 'AI Advantage',
    subtitle: 'Научи се да работиш с AI като професионалист',
    desc: 'Основи на работа с AI за бизнес. Prompt engineering на професионално ниво. Мулти-моделна стратегия с ChatGPT, Claude и Gemini.',
    lessons: 4,
    color: '#22c55e',
  },
  {
    num: '02',
    title: 'The Readdy Blueprint',
    subtitle: 'Системата за създаване на сайтове, които се продават',
    desc: 'AI-driven дизайн процес от нула до публикуван сайт. Архитектура на конвертиращ сайт. Продаващи елементи, които носят резултати.',
    lessons: 5,
    color: '#E67700',
  },
  {
    num: '03',
    title: 'Invisible Marketing',
    subtitle: 'Как клиентите започват да те намират сами',
    desc: 'SEO през 2026. GEO: как AI търсачките препоръчват сайтове. Локална SEO доминация. Пасивно привличане на клиенти.',
    lessons: 5,
    color: '#3B5BDB',
  },
  {
    num: '04',
    title: 'Content That Sells',
    subtitle: 'Създавай съдържание, което носи запитвания',
    desc: 'Стратегия на съдържанието. SEO статии, които класират и конвертират. Видео скриптове. Content repurposing.',
    lessons: 4,
    color: '#7048E8',
  },
  {
    num: '05',
    title: 'Audience Engine',
    subtitle: 'Изгради аудитория, която се превръща в клиенти',
    desc: 'Органичен растеж в социалните мрежи. LinkedIn B2B машина. Платени кампании с реален ROI.',
    lessons: 4,
    color: '#C2255C',
  },
  {
    num: '06',
    title: 'The Conversion System',
    subtitle: 'Как превръщам интереса в платени проекти',
    desc: 'Психология на конверсията. A/B тестване. Лийд магнити. Follow-up система за затваряне на сделки.',
    lessons: 4,
    color: '#2F9E44',
  },
  {
    num: '07',
    title: 'Professional Stack',
    subtitle: 'Настрой бизнеса си като агенция',
    desc: 'Домейни, хостинг, DNS. Инструменти на професионалиста. SSL, бекъп и мониторинг. Клиентски onboarding.',
    lessons: 4,
    color: '#0A2540',
  },
  {
    num: '08',
    title: 'Digital Protection',
    subtitle: 'Защити бизнеса, който градиш',
    desc: 'Киберсигурност. Пароли, 2FA. Phishing превенция. План за действие при инцидент.',
    lessons: 4,
    color: '#E67700',
  },
  {
    num: '09',
    title: 'Growth Analytics',
    subtitle: 'Вземай решения по данни, а не по предположения',
    desc: 'Google Analytics 4. KPI-та с реално значение. Data-driven decisions.',
    lessons: 4,
    color: '#3B5BDB',
  },
  {
    num: '10',
    title: 'Scale with AI',
    subtitle: 'Автоматизирай процесите и освободи времето си',
    desc: 'Имейл автоматизация. Social media автопилот. Lead capture фунии. No-code + AI.',
    lessons: 4,
    color: '#7048E8',
  },
  {
    num: '11',
    tag: 'PREMIUM',
    title: 'The Revenue Blueprint',
    subtitle: 'Системата за намиране и задържане на клиенти',
    desc: 'Бизнес моделът. Система за намиране на клиенти. Ценообразуване и пакетиране на услугите.',
    lessons: 4,
    color: '#e53e3e',
  },
];

const CASE_STUDIES = [
  {
    client: 'Sunrise Food',
    result: '#1 в Google за "гъби кладница онлайн"',
    timeframe: '3–4 седмици',
    detail: 'Използвахме AI за SEO анализ, създаване на Product Schema и оптимизация на съдържание. Резултат: от страница 3 на #1.',
    color: '#22c55e',
  },
  {
    client: 'K-Food Велико Търново',
    result: '#1 в Google И ChatGPT за "корейска храна"',
    timeframe: '2–3 месеца',
    detail: 'Пълна SEO + GEO оптимизация с AI инструменти. ChatGPT препоръчва K-Food при търсене за корейска храна в Търново.',
    color: '#e53e3e',
  },
  {
    client: 'NP Massage Studio',
    result: '#1 в Google + ChatGPT за масажи',
    timeframe: '4–5 седмици',
    detail: 'AI-генерирано съдържание + LocalBusiness Schema + Google Business Profile оптимизация. Пълен funnel от търсене до резервация.',
    color: '#3B5BDB',
  },
];

const COMPARISON = [
  { feature: 'Реални клиентски резултати', tavora: true, others: false },
  { feature: 'AI + SEO + GEO в едно', tavora: true, others: false },
  { feature: 'Практически проекти (не само теория)', tavora: true, others: true },
  { feature: 'Система за доход (не само курс)', tavora: true, others: false },
  { feature: 'Верифицируеми #1 позиции', tavora: true, others: false },
  { feature: 'Безплатен първи модул', tavora: true, others: false },
  { feature: 'Доживотен достъп', tavora: true, others: false },
  { feature: 'Преподавател с активен бизнес', tavora: true, others: true },
];

const RELATED = [
  { title: 'Академия TAVORA — пълна програма', to: '/kurs', cat: 'Академия', color: 'bg-red-50 text-red-700' },
  { title: 'GEO оптимизация за ChatGPT', to: '/blog/geo-ai-tarnovo', cat: 'GEO & AI', color: 'bg-violet-50 text-violet-700' },
  { title: 'Безплатен SEO за #1 в Google', to: '/blog/bezplaten-seo-nomer-edno-google', cat: 'SEO', color: 'bg-emerald-50 text-emerald-700' },
  { title: 'SEO оптимизация 2026', to: '/blog/seo-optimizaciya-tarnovo-2026', cat: 'SEO', color: 'bg-sky-50 text-sky-700' },
  { title: 'Маркетинг за малък бизнес', to: '/blog/lokalen-biznes-ustoichivo-online-prisastvie', cat: 'Маркетинг', color: 'bg-emerald-50 text-emerald-700' },
  { title: 'Дигитален маркетинг България', to: '/digitalen-marketing-veliko-tarnovo', cat: 'Ръководство', color: 'bg-emerald-50 text-emerald-700' },
];

export default function AiBusinessBlueprintPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [openModule, setOpenModule] = useState<number | null>(null);

  useEffect(() => {
    document.title = 'AI Business Blueprint — Пътят на коприната: от AI промптиране до система за клиенти | ТАВОРА ЕООД';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', 'Пълната система за изграждане на дигитален бизнес с AI. 11 модула от AI промптиране до Revenue Blueprint. Реални резултати: клиенти на #1 в Google и ChatGPT. ТАВОРА ЕООД.');
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://imashnujnoto.com/blog/ai-business-blueprint-putyat-na-koprinata');

    const id = 'schema-ai-blueprint';
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) { el = document.createElement('script'); el.id = id; el.type = 'application/ld+json'; document.head.appendChild(el); }
    el.textContent = JSON.stringify(ARTICLE_SCHEMA);

    const faqId = 'schema-ai-blueprint-faq';
    let faqEl = document.getElementById(faqId) as HTMLScriptElement | null;
    if (!faqEl) { faqEl = document.createElement('script'); faqEl.id = faqId; faqEl.type = 'application/ld+json'; document.head.appendChild(faqEl); }
    faqEl.textContent = JSON.stringify(FAQ_SCHEMA);

    return () => {
      ['schema-ai-blueprint', 'schema-ai-blueprint-faq'].forEach((sid) => { const e = document.getElementById(sid); if (e) e.remove(); });
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
              <span className="text-[#1C1C1E]/65">AI Business Blueprint</span>
            </nav>

            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span className="text-[10px] px-2.5 py-1 rounded-full font-medium bg-violet-50 text-violet-700">AI & Бизнес</span>
              <span className="text-[10px] px-2.5 py-1 rounded-full font-medium bg-red-50 text-red-700">Академия TAVORA</span>
              <span className="text-[10px] px-2.5 py-1 rounded-full font-medium bg-emerald-50 text-emerald-700">Обучение</span>
              <span className="text-[10px] text-[#1C1C1E]/70">14 мин. четене · 7 Юли 2026</span>
            </div>

            <h1
              className="text-3xl md:text-5xl font-light text-[#1C1C1E] leading-tight mb-5"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              <em className="text-[#e53e3e]">Пътят на коприната:</em>
              <br />
              <strong className="font-light">AI Business Blueprint</strong>
              <br />
              <span className="text-[#1C1C1E]/60">от AI промптиране до система за клиенти</span>
            </h1>

            <p className="text-sm md:text-base text-[#1C1C1E]/65 max-w-2xl leading-relaxed mb-6">
              <strong className="text-[#1C1C1E]">Пълната система за изграждане на дигитален бизнес с AI.</strong>
              11 модула — от първия prompt до Revenue Blueprint. Всяка стъпка е тествана върху реални проекти:
              Sunrise Food, K-Food, NP Massage Studio — всички на #1 в Google и ChatGPT.
              Това не е курс. Това е бизнес система.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/kurs/ai-business-blueprint"
                className="px-6 py-3 bg-[#1C1C1E] text-white text-sm rounded-full hover:bg-[#1C1C1E]/80 transition-all cursor-pointer whitespace-nowrap"
              >
                Разгледай програмата →
              </Link>
              <Link
                to="/digitalni-produkti/proverki"
                className="px-6 py-3 border border-[#1C1C1E]/12 text-[#1C1C1E]/65 text-sm rounded-full hover:border-[#1C1C1E]/30 hover:text-[#1C1C1E] transition-all cursor-pointer whitespace-nowrap"
              >
                Виж модулите
              </Link>
            </div>
          </div>
        </section>

        {/* ── HERO IMAGE ── */}
        <div className="w-full h-[280px] md:h-[420px] overflow-hidden">
          <img
            src="https://readdy.ai/api/search-image?query=dark%20minimalist%20futuristic%20AI%20business%20blueprint%20digital%20neural%20network%20glowing%20interconnected%20nodes%20deep%20black%20background%20dramatic%20red%20geometric%20accents%20clean%20professional%20cinematic%20atmosphere%20no%20text&width=1400&height=420&seq=blog-ai-blueprint-hero-img&orientation=landscape"
            alt="AI Business Blueprint — Пътят на коприната"
            className="w-full h-full object-cover object-top"
          />
        </div>

        <div className="max-w-4xl mx-auto px-4 md:px-16 py-12 md:py-16">

          {/* ── ВЪВЕДЕНИЕ ── */}
          <section className="mb-14">
            <h2 className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              2026: AI не е бъдещето. AI е сега.
            </h2>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              Преди година хората питаха <strong className="text-[#1C1C1E]">"ще ми отнеме ли AI работата?"</strong>.
              Днес въпросът е <strong className="text-[#1C1C1E]">"как да използвам AI, за да създам своя бизнес?"</strong>.
            </p>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              В ТАВОРА ЕООД използваме AI всеки ден за реални клиенти. Не за експерименти — за бизнес резултати.
              Sunrise Food са #1 в Google. K-Food са #1 в Google <strong className="text-[#1C1C1E]">и</strong> ChatGPT.
              NP Massage Studio също. Това не са случайности — това е система.
            </p>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-6">
              <strong className="text-[#1C1C1E]">AI Business Blueprint</strong> е тази система, пакетирана в 11 модула.
              От "как да напиша prompt" до "ето ти готова система за привличане на клиенти".
              Без празни обещания. Без теория, която не работи. Само това, което ние самите използваме.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-2xl bg-[#F9F9F7] border border-[#1C1C1E]/6">
              {[
                { value: '11', label: 'модула' },
                { value: '74+', label: 'интерактивни урока' },
                { value: 'Доживотен', label: 'достъп до обновления' },
                { value: '3+', label: 'клиенти на #1 в Google' },
              ].map((s) => (
                <div key={s.value} className="text-center">
                  <div className="text-xl md:text-2xl font-light text-[#1C1C1E] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{s.value}</div>
                  <div className="text-[10px] text-[#1C1C1E]/65 leading-tight">{s.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ── ПРОБЛЕМЪТ ── */}
          <section className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[1px] bg-[#1C1C1E]/20 shrink-0" />
              <span className="text-xs text-[#1C1C1E]/60">Проблемът с другите обучения</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Защо повечето AI обучения не работят?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {[
                { icon: 'ri-close-circle-line', title: 'Само теория', desc: 'Повечето курсове преподават "какво е AI" без да покажат как се правят пари с него.', color: '#e53e3e' },
                { icon: 'ri-close-circle-line', title: 'Без реални резултати', desc: 'Преподаватели без активен бизнес или клиенти. Как да ти покажат пътя, ако не са го извървяли?', color: '#e53e3e' },
                { icon: 'ri-close-circle-line', title: 'Отделни парчета', desc: 'Курс по SEO, курс по реклама, курс по AI. Никой не ти дава цялата система.', color: '#e53e3e' },
                { icon: 'ri-close-circle-line', title: 'Остаряло съдържание', desc: 'AI инструментите се менят всеки месец. Курс от 2024 е безполезен в 2026.', color: '#e53e3e' },
              ].map((item) => (
                <div key={item.title} className="p-5 rounded-2xl border border-[#1C1C1E]/8 bg-white flex items-start gap-3">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full shrink-0" style={{ backgroundColor: `${item.color}12` }}>
                    <i className={`${item.icon} text-sm`} style={{ color: item.color }} />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-[#1C1C1E] mb-1">{item.title}</h4>
                    <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 md:p-8 rounded-2xl bg-[#0F1F35] text-white">
              <h3 className="text-lg font-medium mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Разликата с AI Business Blueprint</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-2 pr-4 text-white/70 font-medium">Способност</th>
                      <th className="text-center py-2 px-3 text-white/70 font-medium w-24">TAVORA</th>
                      <th className="text-center py-2 px-3 text-white/70 font-medium w-24">Други</th>
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARISON.map((row, i) => (
                      <tr key={row.feature} className={`border-b ${i === COMPARISON.length - 1 ? 'border-transparent' : 'border-white/5'}`}>
                        <td className="py-2.5 pr-4 text-white/90">{row.feature}</td>
                        <td className="text-center py-2.5 px-3">{row.tavora ? <i className="ri-check-line text-[#22c55e] text-sm" /> : <i className="ri-close-line text-white/20 text-sm" />}</td>
                        <td className="text-center py-2.5 px-3">{row.others ? <i className="ri-check-line text-[#22c55e] text-sm" /> : <i className="ri-close-line text-white/20 text-sm" />}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* ── 11-ТЕ МОДУЛА ── */}
          <section className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[1px] bg-[#1C1C1E]/20 shrink-0" />
              <span className="text-xs text-[#1C1C1E]/60">Програмата</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Пътят на коприната —
              <br />
              <em className="text-[#1C1C1E]/65">11-те модула.</em>
            </h2>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-8">
              Всеки модул е самостоятелна стъпка. Можеш да вземеш един, няколко или всички. Първият е безплатен.
            </p>

            <div className="space-y-3">
              {MODULES_LIST.map((mod) => (
                <div key={mod.num} className="rounded-2xl border border-[#1C1C1E]/8 overflow-hidden">
                  <button
                    className="w-full flex items-center gap-4 p-5 text-left cursor-pointer hover:bg-[#F9F9F7] transition-colors"
                    onClick={() => setOpenModule(openModule === parseInt(mod.num) ? null : parseInt(mod.num))}
                  >
                    <div className="w-10 h-10 flex items-center justify-center rounded-xl shrink-0 text-sm font-medium" style={{ backgroundColor: `${mod.color}12`, color: mod.color }}>
                      {mod.num}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="text-sm font-medium text-[#1C1C1E]">{mod.title}</h4>
                        {mod.tag === 'FREE' && (
                          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>FREE</span>
                        )}
                        {mod.tag === 'PREMIUM' && (
                          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded" style={{ backgroundColor: '#fee2e2', color: '#e53e3e' }}>PREMIUM</span>
                        )}
                      </div>
                      <p className="text-xs text-[#1C1C1E]/65">{mod.subtitle}</p>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[#1C1C1E]/65 shrink-0">
                      <span>{mod.lessons} урока</span>
                      <i className={`text-sm transition-transform ${openModule === parseInt(mod.num) ? 'ri-subtract-line' : 'ri-add-line'}`} />
                    </div>
                  </button>
                  {openModule === parseInt(mod.num) && (
                    <div className="px-5 pb-5 bg-[#F9F9F7]">
                      <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">{mod.desc}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/digitalni-produkti/proverki"
                className="inline-flex items-center gap-2 text-sm text-[#0A2540] font-medium hover:underline cursor-pointer"
              >
                Виж пълната програма и избери модули
                <i className="ri-arrow-right-line text-xs" />
              </Link>
            </div>
          </section>

          {/* ── CASE STUDIES ── */}
          <section className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[1px] bg-[#1C1C1E]/20 shrink-0" />
              <span className="text-xs text-[#1C1C1E]/60">Доказателства</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Не на думи — с резултати.
            </h2>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-8">
              Всеки модул в AI Business Blueprint е базиран на реална работа с реални клиенти. Ето три от тях.
            </p>

            <div className="space-y-4">
              {CASE_STUDIES.map((cs, i) => (
                <div key={cs.client} className="rounded-2xl border border-[#1C1C1E]/8 overflow-hidden">
                  <div className="p-5 md:p-7 border-b border-[#1C1C1E]/6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 flex items-center justify-center rounded-xl" style={{ backgroundColor: `${cs.color}12` }}>
                          <span className="text-lg font-light" style={{ color: cs.color }}>{String(i + 1).padStart(2, '0')}</span>
                        </div>
                        <div>
                          <div className="text-base font-medium text-[#1C1C1E]">{cs.client}</div>
                          <div className="text-xs text-[#1C1C1E]/65">{cs.timeframe}</div>
                        </div>
                      </div>
                      <span className="text-xs px-3 py-1.5 rounded-full font-medium" style={{ backgroundColor: `${cs.color}12`, color: cs.color }}>
                        {cs.result}
                      </span>
                    </div>
                    <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">{cs.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-5 rounded-2xl bg-[#F9F9F7] border border-[#1C1C1E]/6">
              <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">
                <i className="ri-information-line text-sm mr-1 align-middle" />
                Всяка позиция е <strong className="text-[#1C1C1E]">верифицируема</strong> — отворете Google и потърсете ключовите думи. Не обещаваме — доказваме.
              </p>
            </div>
          </section>

          {/* ── ЗА КОГО Е / НЕ Е ── */}
          <section className="mb-14 p-6 md:p-8 rounded-2xl bg-[#F9F9F7] border border-[#1C1C1E]/6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[1px] bg-[#1C1C1E]/20 shrink-0" />
              <span className="text-xs text-[#1C1C1E]/60">За кого?</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              За кого е — и за кого НЕ е.
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 flex items-center justify-center rounded-full bg-[#22c55e]/12">
                    <i className="ri-check-line text-sm text-[#22c55e]" />
                  </div>
                  <span className="text-sm font-medium text-[#1C1C1E]">За кого Е:</span>
                </div>
                <div className="space-y-2.5">
                  {[
                    'Предприемачи, които искат да изградят дигитален бизнес',
                    'Фрийлансъри, които искат да вдигнат цените и клиентите си',
                    'Маркетинг специалисти, които искат AI умения',
                    'Хора с 0 опит, но с желание да учат',
                    'Собственици на малък бизнес, които искат онлайн присъствие',
                    'Всеки, който иска доход от дигитални услуги',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2.5">
                      <div className="w-4 h-4 flex items-center justify-center rounded-full shrink-0 mt-0.5 bg-[#22c55e]/12">
                        <i className="ri-check-line text-[9px] text-[#22c55e]" />
                      </div>
                      <span className="text-xs text-[#1C1C1E]/65 leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 flex items-center justify-center rounded-full bg-[#e53e3e]/12">
                    <i className="ri-close-line text-sm text-[#e53e3e]" />
                  </div>
                  <span className="text-sm font-medium text-[#1C1C1E]">За кого НЕ Е:</span>
                </div>
                <div className="space-y-2.5">
                  {[
                    'Хора, които търсят "бързи пари без работа"',
                    'Хора, които не са готови да инвестират време в учене',
                    'Хора, които очакват резултат за 3 дни',
                    'Хора, които не вярват, че AI променя бизнеса',
                    'Хора, които искат "магическо копче"',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2.5">
                      <div className="w-4 h-4 flex items-center justify-center rounded-full shrink-0 mt-0.5 bg-[#e53e3e]/12">
                        <i className="ri-close-line text-[9px] text-[#e53e3e]" />
                      </div>
                      <span className="text-xs text-[#1C1C1E]/65 leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-[#1C1C1E]/6">
              <p className="text-xs text-[#1C1C1E]/65 italic leading-relaxed">
                "Ако очакваш бързи пари без работа — това не е за теб. Тук става дума за изграждане на реален бизнес.
                Но ако си готов да учиш и прилагаш — това е най-краткият път." — Владимир Атанасов
              </p>
            </div>
          </section>

          {/* ── FAQ ── */}
          <section className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[1px] bg-[#1C1C1E]/20 shrink-0" />
              <span className="text-xs text-[#1C1C1E]/60">Въпроси и отговори</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Чести въпроси за AI Business Blueprint.
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
                <div className="text-xs text-white/75 tracking-widest uppercase mb-2">Готов ли си за Пътя на коприната?</div>
                <div className="text-2xl md:text-3xl font-light leading-tight mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  AI Business Blueprint
                  <br />
                  <span className="italic text-white/60">разгледай актуалната програма и цената</span>
                </div>
                <p className="text-sm text-white/75 max-w-md leading-relaxed">
                  Първият модул (AI Advantage) е безплатен. Започни днес — без риск, без карта.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <Link to="/kurs/ai-business-blueprint" className="px-7 py-3.5 bg-white text-[#0A2540] text-sm rounded-full hover:bg-white/90 transition-all cursor-pointer whitespace-nowrap text-center font-medium">
                  Разгледай програмата →
                </Link>
                <Link to="/digitalni-produkti/proverki" className="px-7 py-3.5 border border-white/20 text-white/70 text-sm rounded-full hover:border-white/40 hover:text-white transition-all cursor-pointer whitespace-nowrap text-center">
                  Виж модулите
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
              <div className="text-xs text-[#1C1C1E]/65 mb-2">Основател, ТАВОРА ЕООД · Създател на AI Business Blueprint</div>
              <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">
                Изградил е 3+ бизнеса на #1 в Google и ChatGPT. Създател на системата "Пътят на коприната" — AI бизнес blueprint от нулата до работеща система за клиенти.
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