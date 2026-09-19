import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SharedNav from '@/components/feature/SharedNav';
import SharedFooter from '@/components/feature/SharedFooter';

const FAQ_ITEMS = [
  {
    q: 'Какво е GEO оптимизация и защо е важна за бизнес в Търново?',
    a: 'GEO (Generative Engine Optimization) е оптимизация за AI търсачки като ChatGPT, Perplexity и Google AI Overview. Традиционното SEO класира в Google — GEO класира в AI. За бизнес в Търново това означава, че когато някой пита ChatGPT "коя е най-добрата SEO агенция в Търново", вашата компания може да е в отговора.',
  },
  {
    q: 'Колко време отнема GEO оптимизацията?',
    a: 'GEO настройката (Schema.org, entity statements, Person Schema) отнема 3–5 дни. Но за AI търсачките да ви "знаят" — трябват 3–6 месеца и външни споменавания в авторитетни източници (медии, директории, Wikipedia).',
  },
  {
    q: 'GEO оптимизацията замества ли SEO?',
    a: 'Не — GEO допълва SEO. SEO все още е #1 за Google класиране. GEO е допълнителен слой, който оптимизира за новите AI търсачки. Комбинацията от двете дава максимална видимост — и в Google, и в ChatGPT.',
  },
  {
    q: 'Колко струва GEO оптимизация в Търново?',
    a: 'ТАВОРА ЕООД предлага GEO пакет от 190 € — включва Entity statements, Person Schema, WebSite Schema с SearchAction, HowTo Schema за ръководства и мониторинг на AI visibility. Това е еднократна инвестиция, която работи години.',
  },
  {
    q: 'Как да проверя дали GEO оптимизацията работи?',
    a: 'Питайте Perplexity или ChatGPT с Browse: "Кои са маркетинг агенциите в Търново?" или "Какво е ТАВОРА ЕООД?" Ако вашата компания се споменава — GEO работи. Проверявайте всеки месец, защото AI моделите се обновяват.',
  },
  {
    q: 'Всички бизнеси в Търново ли се нуждаят от GEO?',
    a: 'Ако вашите клиенти търсят информация онлайн — да. Ресторанти, магазини, услуги, хотели — всички се търсят в AI. Дори B2B бизнеси — ChatGPT вече препоръчва агенции и доставчици. GEO е задължителна за всяка компания, която иска да бъде намерена.',
  },
  {
    q: 'Какви Schema.org са нужни за GEO?',
    a: 'Критични са: Organization (с sameAs), Person (с knowsAbout и jobTitle), WebSite (с SearchAction), HowTo (за ръководства), FAQPage, LocalBusiness и Article. Колкото повече structured data — толкова по-добре AI разбира кои сте.',
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
      '@id': 'https://imashnujnoto.com/blog/ai-tursachki-biznes-tarnovo#article',
      headline: 'AI търсачки и бизнес в Търново 2026 — GEO оптимизация пълно ръководство',
      description: 'Как ChatGPT, Perplexity и Google AI Overview променят бизнеса в Търново. GEO оптимизация — от нулата до AI видимост. Entity statements, Schema.org и реални стратегии. ТАВОРА ЕООД.',
      url: 'https://imashnujnoto.com/blog/ai-tursachki-biznes-tarnovo',
      datePublished: '2026-05-06',
      dateModified: today,
      inLanguage: 'bg',
      wordCount: 4200,
      timeRequired: 'PT16M',
      keywords: [
        'AI търсачки Търново',
        'GEO оптимизация',
        'ChatGPT бизнес',
        'Perplexity SEO',
        'AI видимост',
        'генеративен AI маркетинг',
        'Schema.org AI',
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
        url: 'https://readdy.ai/api/search-image?query=AI%20search%20engine%20optimization%20ChatGPT%20Perplexity%20GEO%20generative%20engine%20futuristic%20technology%20digital%20brain%20neural%20network%20clean%20minimal%20white%20background%20professional%20Bulgaria%202026&width=1200&height=630&seq=ai-tursachki-hero&orientation=landscape',
        width: 1200,
        height: 630,
      },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Начало', item: 'https://imashnujnoto.com/' },
          { '@type': 'ListItem', position: 2, name: 'Блог', item: 'https://imashnujnoto.com/blog' },
          { '@type': 'ListItem', position: 3, name: 'AI търсачки и бизнес Търново', item: 'https://imashnujnoto.com/blog/ai-tursachki-biznes-tarnovo' },
        ],
      },
    },
    {
      '@type': 'HowTo',
      name: 'GEO оптимизация за бизнес в Търново — стъпка по стъпка',
      description: 'Практически стъпки за оптимизация на бизнес за AI търсачки в Велико Търново.',
      step: [
        {
          '@type': 'HowToStep',
          position: 1,
          name: 'Създайте Entity страница',
          text: 'Направете отделна страница /za-tavora с пълно юридическо описание — име, адрес, ЕИК, услуги, цени, медийни споменавания. AI търсачките я четат като визитна картичка.',
          url: 'https://imashnujnoto.com/blog/ai-tursachki-biznes-tarnovo#entity-stranica',
        },
        {
          '@type': 'HowToStep',
          position: 2,
          name: 'Оптимизирайте Schema.org',
          text: 'Добавете Organization, Person, WebSite с SearchAction, FAQPage и HowTo Schema. Валидирайте с Google Rich Results Test.',
          url: 'https://imashnujnoto.com/blog/ai-tursachki-biznes-tarnovo#schema',
        },
        {
          '@type': 'HowToStep',
          position: 3,
          name: 'Публикуване в авторитетни източници',
          text: 'Листинг в бизнес директории, PR статии, guest posts. AI търсачките вземат данни от авторитетни сайтове — не само от вашия.',
          url: 'https://imashnujnoto.com/blog/ai-tursachki-biznes-tarnovo#avtoritet',
        },
        {
          '@type': 'HowToStep',
          position: 4,
          name: 'Мониторинг и корекции',
          text: 'Питайте ChatGPT и Perplexity всеки месец. Проверявайте дали сте в отговорите. Актуализирайте Schema.org при промени.',
          url: 'https://imashnujnoto.com/blog/ai-tursachki-biznes-tarnovo#monitoring',
        },
      ],
    },
  ],
};

const AI_ENGINES = [
  {
    name: 'ChatGPT (OpenAI)',
    type: 'Текстов AI асистент',
    dataSource: 'Тренировъчни данни + Browse with Bing (в реално време)',
    howItWorks: 'ChatGPT отговаря от тренировъчните си данни. Ако използва Browse mode — търси в Bing и цитира източници. За локални бизнеси в Търново — трябват външни споменавания.',
    optimization: 'Entity страница + външни citations + Wikipedia/Wikidata',
    difficulty: 'Висока',
    timeline: '3–6 месеца',
  },
  {
    name: 'Perplexity AI',
    type: 'AI търсачка с citations',
    dataSource: 'Live web search — реално време',
    howItWorks: 'Perplexity търси в реално време и показва citations (източници). Това означава, че ако сайтът ви е добре оптимизиран и индексиран — Perplexity може да ви намери днес.',
    optimization: 'SEO + Schema.org + качествено съдържание + backlinks',
    difficulty: 'Средна',
    timeline: '1–3 месеца',
  },
  {
    name: 'Google AI Overview',
    type: 'AI резюме в Google Search',
    dataSource: 'Google Knowledge Graph + индексирани страници',
    howItWorks: 'Google показва AI резюме над organic резултатите. За да сте в това резюме — трябва да сте в топ 10 на Google + да имате структурирани данни.',
    optimization: 'SEO #1 + Schema.org + E-E-A-T + богато съдържание',
    difficulty: 'Висока',
    timeline: '2–4 месеца',
  },
  {
    name: 'Gemini (Google)',
    type: 'Мултимодален AI',
    dataSource: 'Google Knowledge Graph + индексирани страници + YouTube',
    howItWorks: 'Gemini използва Google данни + YouTube. Ако имате видео съдържание — Gemini може да го анализира и включва в отговорите.',
    optimization: 'SEO + видео с Schema.org + YouTube канал',
    difficulty: 'Средна',
    timeline: '2–4 месеца',
  },
];

const GEO_TACTICS = [
  {
    num: '01',
    title: 'Entity страница — вашата визитна картичка за AI',
    icon: 'ri-id-card-line',
    color: '#0A2540',
    desc: 'AI търсачките трябва да знаят кои сте. Entity страница (/za-tavora) описва компанията с юридически данни, услуги, цени, медийни споменавания и citations.',
    bullets: [
      'Пълно име, адрес, телефон, имейл, ЕИК, ДДС номер',
      'Ясно описание: "ТАВОРА ЕООД е маркетинг агенция във Велико Търново, специализирана в SEO и GEO оптимизация"',
      'Списък с услуги и цени — прозрачност = доверие',
      'Медийни споменавания с линкове (БНР, БТА, bGlobal)',
      'Client proofs — реални клиенти с линкове',
      'FAQ секция с 6+ въпроса, описващи компанията',
    ],
    result: 'След създаване на /za-tavora — Perplexity започна да споменава ТАВОРА при търсения за "дигитален маркетинг Търново" в рамките на 2 месеца.',
  },
  {
    num: '02',
    title: 'Person Schema — лицето зад бизнеса',
    icon: 'ri-user-star-line',
    color: '#C2255C',
    desc: 'AI търсачките обичат да свързват компания с човек. Person Schema за основателя (Владимир Атанасов) включва knowsAbout, jobTitle, alumniOf, sameAs към медии.',
    bullets: [
      'name: "Владимир Веселинов Атанасov"',
      'jobTitle: "Основател и SEO специалист, ТАВОРА ЕООД"',
      'knowsAbout: ["SEO оптимизация", "GEO оптимизация", "дигитален маркетинг"]',
      'sameAs: линкове към медийни статии, LinkedIn, агенцията',
      'alumniOf: образование и курсове',
      'worksFor: ТАВОРА ЕООД с линк',
    ],
    result: 'Person Schema помага ChatGPT да свързва "Владимир Атанасов" с "SEO Търново" и "ТАВОРА ЕООД" като един Entity.',
  },
  {
    num: '03',
    title: 'WebSite Schema + SearchAction — казва на AI как да търси в сайта ви',
    icon: 'ri-global-line',
    color: '#3B5BDB',
    desc: 'WebSite Schema с SearchAction казва на Google и AI: "Ако някой търси нещо — ето URL структурата на търсенето". Това помага AI да намира конкретни страници.',
    bullets: [
      'Добавете @type: WebSite с url и potentialAction',
      'potentialAction: SearchAction с target URL',
      'target: "https://imashnujnoto.com/search?q={search_term_string}"',
      'Това е задължително за GEO — без него AI не знае как да търси в сайта',
      'Валидирайте с Google Rich Results Test',
      'Добавете към началната страница — в <head>',
    ],
    result: 'След добавяне на WebSite Schema — ChatGPT с Browse mode започна да цитира конкретни страници от imashnujnoto.com.',
  },
  {
    num: '04',
    title: 'HowTo Schema — AI обича стъпкови ръководства',
    icon: 'ri-list-check-2',
    color: '#2F9E44',
    desc: 'HowTo Schema е структуриран формат за стъпка-по-стъпка ръководства. AI търсачките ги използват директно — могат да се появят в AI Overview и featured snippets.',
    bullets: [
      'Създайте HowTo Schema за всяко ръководство на сайта',
      'Всяка стъпка има name, text, url и optional image',
      'Валидирайте с Google Rich Results Test',
      'Google може да покаже HowTo като featured snippet — #0 позиция',
      'AI Overview чете HowTo и го включва в резюметата',
    ],
    result: 'HowTo Schema за "Как да изберете агенция Търново" се появи в Google featured snippet и беше цитиран от Perplexity.',
  },
  {
    num: '05',
    title: 'Външни споменавания (Citations) — AI търси извън вашия сайт',
    icon: 'ri-links-line',
    color: '#E8590C',
    desc: 'AI търсачките не четат само вашия сайт. Те търсят споменавания в авторитетни източници. Колкото повече медии, директории и сайтове споменават името ви — толкова по-силен Entity сте.',
    bullets: [
      'Google Business Profile — задължителен, AI чете GBP данни',
      'Бизнес директории: goldenpages.bg, firmi.bg, kompass.com',
      'Местни медии: vt-today.com, БНР, БТА, dariknews.bg',
      'PR статии — дори една статия = мощен citation',
      'LinkedIn статии — индексират се от Google и AI',
      'YouTube — Gemini и Google AI Overview четат видеа',
      'Guest posts в авторитетни блогове в нишата',
    ],
    result: 'След PR статия в bGlobal и споменаване в БНР — ChatGPT започна да включва ТАВОРА в отговори за "млад предприемач Търново".',
  },
  {
    num: '06',
    title: 'FAQPage Schema — в "People also ask" и AI резюмета',
    icon: 'ri-questionnaire-line',
    color: '#7048E8',
    desc: 'FAQPage Schema е за въпроси и отговори. Когато Google ги индексира — въпросите се появяват в "People also ask". AI търсачките ги използват директно за резюмета.',
    bullets: [
      'Намерете въпроси, които клиентите задават в Google',
      'Отговорете конкретно — поне 40–50 думи на отговор',
      'Структурирайте в JSON-LD FAQPage Schema',
      'Добавете към всяка важна страница — услуги, блог, Entity',
      'Валидирайте с Google Rich Results Test',
      'Мониторирайте — кои въпроси се появяват в PAA',
    ],
    result: 'След FAQPage Schema на 12 страници — 7 въпроса се появиха в People also ask. Органичният трафик нарасна с 35%.',
  },
];

const CASE_STUDIES = [
  {
    business: 'K-Food Велико Търново',
    challenge: 'Не се класираше в ChatGPT при търсене за "корейска храна Търново"',
    action: 'Добавихме Restaurant Schema, LocalBusiness, FAQPage и Entity страница',
    result: 'След 2 месеца — K-Food се появи в Perplexity резултатите за "корейски ресторант Търновo"',
  },
  {
    business: 'Sunrise Food',
    challenge: 'AI търсачките не знаеха, че продават гъби онлайн',
    action: 'Product Schema, Organization Schema, HowTo за готвене с гъби',
    result: 'Gemini започна да препоръчва Sunrise Food при въпроси за "гъби кладница онлайн"',
  },
  {
    business: 'ТАВОРА ЕООД',
    challenge: 'ChatGPT не споменаваше агенцията при търсения за дигитален маркетинг Търново',
    action: 'Entity страница (/za-tavora), Person Schema, sameAs към медии, GEO пакет',
    result: 'Perplexity започна да цитира /za-tavora. ChatGPT (Browse) показва ТАВОРА в 30% от търсенията за "дигитален маркетинг Търновo"',
  },
];

const RELATED = [
  { title: 'GEO оптимизация за ChatGPT', to: '/blog/geo-ai-tarnovo', cat: 'GEO & AI', color: 'bg-violet-50 text-violet-700' },
  { title: 'Безплатен SEO за #1', to: '/blog/bezplaten-seo-nomer-edno-google', cat: 'SEO', color: 'bg-emerald-50 text-emerald-700' },
  { title: 'SEO оптимизация Търново 2026', to: '/blog/seo-optimizaciya-tarnovo-2026', cat: 'SEO', color: 'bg-sky-50 text-sky-700' },
  { title: 'Как да изберете агенция Търново', to: '/blog/kak-da-izberete-agenciya-tarnovo', cat: 'Маркетинг агенция', color: 'bg-sky-50 text-sky-700' },
  { title: 'Дигитален маркетинг Търново', to: '/digitalen-marketing-veliko-tarnovo', cat: 'Ръководство', color: 'bg-emerald-50 text-emerald-700' },
  { title: 'GEO услуга Търново', to: '/uslugi/seo-geo', cat: 'Услуга', color: 'bg-violet-50 text-violet-700' },
];

export default function AiTursachkiBiznesTarnovoPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    document.title = 'AI търсачки и бизнес в Търново 2026 — GEO оптимизация | ТАВОРА ЕООД';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', 'Как ChatGPT, Perplexity и Google AI Overview променят бизнеса в Търново. GEO оптимизация — Entity statements, Schema.org, citations. Пълно ръководство. ТАВОРА ЕООД.');
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://imashnujnoto.com/blog/ai-tursachki-biznes-tarnovo');

    const id = 'schema-ai-tursachki';
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) { el = document.createElement('script'); el.id = id; el.type = 'application/ld+json'; document.head.appendChild(el); }
    el.textContent = JSON.stringify(ARTICLE_SCHEMA);

    const faqId = 'schema-ai-tursachki-faq';
    let faqEl = document.getElementById(faqId) as HTMLScriptElement | null;
    if (!faqEl) { faqEl = document.createElement('script'); faqEl.id = faqId; faqEl.type = 'application/ld+json'; document.head.appendChild(faqEl); }
    faqEl.textContent = JSON.stringify(FAQ_SCHEMA);

    return () => {
      ['schema-ai-tursachki', 'schema-ai-tursachki-faq'].forEach((sid) => { const e = document.getElementById(sid); if (e) e.remove(); });
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
              <span className="text-[#1C1C1E]/65">AI търсачки Търново</span>
            </nav>

            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span className="text-[10px] px-2.5 py-1 rounded-full font-medium bg-violet-50 text-violet-700">GEO & AI</span>
              <span className="text-[10px] px-2.5 py-1 rounded-full font-medium bg-emerald-50 text-emerald-700">2026</span>
              <span className="text-[10px] px-2.5 py-1 rounded-full font-medium bg-orange-50 text-orange-700">Пълно ръководство</span>
              <span className="text-[10px] text-[#1C1C1E]/70">16 мин. четене · 6 Май 2026</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-light text-[#1C1C1E] leading-tight mb-5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              AI търсачки
              <br />
              <em className="text-[#0A2540]">и бизнес в Търново</em>
              <br />
              <strong className="font-light">2026 — GEO пълно ръководство.</strong>
            </h1>

            <p className="text-sm md:text-base text-[#1C1C1E]/65 max-w-2xl leading-relaxed mb-6">
              <strong className="text-[#1C1C1E]">Google вече не е единствената търсачка.</strong> ChatGPT, Perplexity, Gemini и Google AI Overview
              отговарят на въпроси директно — без да отварят сайтове.
              Ако вашият бизнес не е оптимизиран за AI — <em>вие сте невидими за следващото поколение клиенти</em>.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link to="/kontakt" className="px-6 py-3 bg-[#1C1C1E] text-white text-sm rounded-full hover:bg-[#1C1C1E]/80 transition-all cursor-pointer whitespace-nowrap">
                GEO консултация 50 € →
              </Link>
              <Link to="/blog/geo-ai-tarnovo" className="px-6 py-3 border border-[#1C1C1E]/12 text-[#1C1C1E]/65 text-sm rounded-full hover:border-[#1C1C1E]/30 hover:text-[#1C1C1E] transition-all cursor-pointer whitespace-nowrap">
                GEO оптимизация основи
              </Link>
            </div>
          </div>
        </section>

        {/* HERO IMAGE */}
        <div className="w-full h-[280px] md:h-[420px] overflow-hidden">
          <img
            src="https://readdy.ai/api/search-image?query=AI%20search%20engine%20optimization%20ChatGPT%20Perplexity%20GEO%20generative%20engine%20futuristic%20technology%20digital%20brain%20neural%20network%20clean%20minimal%20white%20background%20professional%20Bulgaria%202026&width=1400&height=420&seq=ai-tursachki-hero-img&orientation=landscape"
            alt="AI търсачки и бизнес в Търново — GEO оптимизация"
            className="w-full h-full object-cover object-top"
            loading="lazy" decoding="async"
          />
        </div>

        <div className="max-w-4xl mx-auto px-4 md:px-16 py-12 md:py-16">

          {/* ВЪВЕДЕНИЕ */}
          <section className="mb-14">
            <h2 className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Google вече не е достатъчен.
            </h2>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              През 2025–2026 <strong className="text-[#1C1C1E]">40% от младите потребители</strong> (18–34 г.) започват търсенето си в
              ChatGPT или Perplexity, а не в Google. Те питат AI за препоръки — за ресторанти, агенции, услуги, продукти.
            </p>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              Това означава, че <strong className="text-[#1C1C1E]">SEO вече не е достатъчно</strong>.
              Трябва и <strong className="text-[#1C1C1E]">GEO — Generative Engine Optimization</strong>.
              GEO не класира в Google — GEO кара AI да ви <em>споменава</em> в отговорите си.
            </p>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-6">
              За бизнес в <strong>Велико Търново</strong> това е огромна възможност.
              Повечето агенции в Търново все още не знаят какво е GEO.
              Ако сте първи — <strong className="text-[#1C1C1E]">имате предимство от 12–18 месеца</strong>.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-2xl bg-[#F9F9F7] border border-[#1C1C1E]/6">
              {[
                { value: '40%', label: 'млади потребители в AI' },
                { value: '3–6 мес.', label: 'до AI видимост' },
                { value: '190 €', label: 'GEO пакет' },
                { value: '12–18 мес.', label: 'предимство пред конкурентите' },
              ].map((s) => (
                <div key={s.value} className="text-center">
                  <div className="text-xl md:text-2xl font-light text-[#1C1C1E] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{s.value}</div>
                  <div className="text-[10px] text-[#1C1C1E]/65 leading-tight">{s.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* AI ТЪРСАЧКИ СРАВНЕНИЕ */}
          <section className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[1px] bg-[#1C1C1E]/20 shrink-0" />
              <span className="text-xs text-[#1C1C1E]/60">AI Търсачки</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Как работят <em className="text-[#1C1C1E]/60">ChatGPT, Perplexity, Gemini</em> и Google AI Overview?
            </h2>

            <div className="space-y-5">
              {AI_ENGINES.map((engine) => (
                <div key={engine.name} className="p-5 rounded-2xl border border-[#1C1C1E]/8 bg-white">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <div>
                      <div className="text-sm font-medium text-[#1C1C1E]">{engine.name}</div>
                      <div className="text-[10px] text-[#1C1C1E]/65">{engine.type}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F9F9F7] border border-[#1C1C1E]/8 text-[#1C1C1E]/65">Трудност: {engine.difficulty}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F9F9F7] border border-[#1C1C1E]/8 text-[#1C1C1E]/65">{engine.timeline}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <div className="text-[10px] text-[#1C1C1E]/65 mb-1">Източник на данни</div>
                      <div className="text-[#1C1C1E]/65 leading-relaxed">{engine.dataSource}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#1C1C1E]/65 mb-1">Как работи</div>
                      <div className="text-[#1C1C1E]/65 leading-relaxed">{engine.howItWorks}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#1C1C1E]/65 mb-1">GEO оптимизация</div>
                      <div className="text-[#0A2540] leading-relaxed">{engine.optimization}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* GEO ТАКТИКИ */}
          <section className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[1px] bg-[#1C1C1E]/20 shrink-0" />
              <span className="text-xs text-[#1C1C1E]/60">GEO Тактики</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              6 GEO тактики за <em className="text-[#0A2540]">AI видимост.</em>
            </h2>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-8">
              Всяка тактика е тествана на реални клиенти в Търново.
              Комбинацията от всички 6 дава максимален ефект.
            </p>

            <div className="space-y-6">
              {GEO_TACTICS.map((tactic) => (
                <div key={tactic.num} className="rounded-2xl border border-[#1C1C1E]/8 overflow-hidden">
                  <div className="p-5 md:p-7 border-b border-[#1C1C1E]/6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 flex items-center justify-center rounded-xl shrink-0" style={{ backgroundColor: `${tactic.color}12` }}>
                        <i className={`${tactic.icon} text-xl`} style={{ color: tactic.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] font-medium px-2 py-0.5 rounded-full inline-block mb-2" style={{ backgroundColor: `${tactic.color}12`, color: tactic.color }}>
                          {tactic.num}
                        </div>
                        <h3 className="text-base font-medium text-[#1C1C1E] mb-1">{tactic.title}</h3>
                      </div>
                    </div>
                    <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mt-4">{tactic.desc}</p>
                  </div>
                  <div className="p-5 md:p-7 bg-[#F9F9F7]">
                    <div className="space-y-2.5 mb-5">
                      {tactic.bullets.map((b) => (
                        <div key={b} className="flex items-start gap-2.5">
                          <div className="w-4 h-4 flex items-center justify-center rounded-full shrink-0 mt-0.5" style={{ backgroundColor: `${tactic.color}15`, border: `1px solid ${tactic.color}30` }}>
                            <i className="ri-check-line text-[9px]" style={{ color: tactic.color }} />
                          </div>
                          <span className="text-xs text-[#1C1C1E]/65 leading-relaxed">{b}</span>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 rounded-xl border" style={{ borderColor: `${tactic.color}20`, backgroundColor: `${tactic.color}06` }}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <i className="ri-bubble-chart-line text-[10px]" style={{ color: tactic.color }} />
                        <span className="text-[10px] font-medium tracking-wide uppercase" style={{ color: tactic.color }}>Реален резултат</span>
                      </div>
                      <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">{tactic.result}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* КЕЙС СТЪДИТА */}
          <section className="mb-14 p-6 md:p-8 rounded-2xl bg-[#F9F9F7] border border-[#1C1C1E]/6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[1px] bg-[#1C1C1E]/20 shrink-0" />
              <span className="text-xs text-[#1C1C1E]/60">Реални резултати</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              GEO оптимизация в действие — <em className="text-[#1C1C1E]/60">Търново.</em>
            </h2>

            <div className="space-y-4">
              {CASE_STUDIES.map((cs) => (
                <div key={cs.business} className="p-5 rounded-2xl border border-[#1C1C1E]/8 bg-white">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-[#0A2540]" />
                    <span className="text-sm font-medium text-[#1C1C1E]">{cs.business}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div>
                      <div className="text-[10px] text-[#1C1C1E]/65 mb-1">Проблем</div>
                      <div className="text-[#1C1C1E]/65 leading-relaxed">{cs.challenge}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#1C1C1E]/65 mb-1">Действие</div>
                      <div className="text-[#1C1C1E]/65 leading-relaxed">{cs.action}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#1C1C1E]/65 mb-1">Резултат</div>
                      <div className="text-[#2F9E44] leading-relaxed">{cs.result}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ЗАЩО GEO */}
          <section className="mb-14 p-6 md:p-8 rounded-2xl bg-[#0F1F35] text-white">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-[1px] bg-white/20 shrink-0" />
              <span className="text-xs text-white/75 tracking-widest uppercase">Защо GEO</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-light mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Защо GEO е по-важно от всякога за Търново?
            </h2>
            <div className="space-y-3 mb-6">
              {[
                'Повечето агенции в Търново не знаят какво е GEO — имате предимство',
                'AI търсачките растат с 30% на година — скоро ще са #1 източник на информация',
                'GEO е еднократна инвестиция — работи години',
                'Google AI Overview вече е в България — класирайте се в AI резюмета',
                'Perplexity е безплатен — клиентите го използват днес',
                'ChatGPT Browse вече търси в реално време — сайтът ви трябва да е готов',
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
              GEO консултация 50 € →
            </Link>
          </section>

          {/* FAQ */}
          <section className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[1px] bg-[#1C1C1E]/20 shrink-0" />
              <span className="text-xs text-[#1C1C1E]/60">Въпроси и отговори</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Чести въпроси за AI и GEO.
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
                <div className="text-xs text-white/75 tracking-widest uppercase mb-2">Готови за AI видимост?</div>
                <div className="text-2xl md:text-3xl font-light leading-tight mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  GEO оптимизация за бизнес
                  <br />
                  <span className="italic text-white/60">във Велико Търново.</span>
                </div>
                <p className="text-sm text-white/75 max-w-md leading-relaxed">
                  GEO пакет 190 € — Entity statements, Schema.org, citations, мониторинг. Еднократна инвестиция, която работи години.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <Link to="/kontakt" className="px-7 py-3.5 bg-white text-[#0A2540] text-sm rounded-full hover:bg-white/90 transition-all cursor-pointer whitespace-nowrap text-center font-medium">
                  Поискайте GEO оферта →
                </Link>
                <Link to="/uslugi/seo-geo" className="px-7 py-3.5 border border-white/20 text-white/70 text-sm rounded-full hover:border-white/40 hover:text-white transition-all cursor-pointer whitespace-nowrap text-center">
                  Вижте GEO услугите
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