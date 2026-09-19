import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SharedNav from '@/components/feature/SharedNav';
import SharedFooter from '@/components/feature/SharedFooter';

const FAQ_ITEMS = [
  {
    q: 'Имам ли нужда от сайт, ако имам Google Business Profile?',
    a: 'Да — GBP е витрина, сайтът е магазин. GBP показва основна информация, но не може да продава, да събира lead-ове или да показва пълно портфолио. Комбинацията от двете е оптимална.',
  },
  {
    q: 'Кое е по-важно за SEO — сайт или GBP?',
    a: 'За локално SEO — GBP е по-важен за класиране в Maps и Local Pack. За национално SEO и brand authority — сайтът е по-важен. Идеалната стратегия е: GBP за локално, сайт за всичко останало.',
  },
  {
    q: 'Колко струва Google Business Profile?',
    a: 'GBP е напълно безплатен. Настройката отнема 2 часа. Оптимизацията (постове, снимки, отговори на ревюта) отнема 2–3 часа седмично. Ако наемете агенция — ТАВОРА ЕООД включва GBP в SEO пакета от 390 €.',
  },
  {
    q: 'Колко струва сайт за бизнес в Търново?',
    a: 'Бизнес сайт в Търново струва от 999 € (ТАВОРА) до 3 000+ лв. при други агенции. Разликата е в това дали включва SEO от старт, Schema.org, мобилна версия и скорост. Евтиният сайт без SEO е като магазин без витрина.',
  },
  {
    q: 'Може ли да съм #1 само с GBP?',
    a: 'За някои локални търсения — да. Например "пицария близо до мен" може да покаже само GBP. Но за "най-добрата SEO агенция Търново" — трябва и сайт с богато съдържание, ревюта, case studies и Schema.org.',
  },
  {
    q: 'Колко време отнема да видя резултати от GBP?',
    a: '2–4 седмици за верификация и появяване в Maps. 1–3 месеца за класиране в Local Pack. 3–6 месеца за доминиране на локални ключови думи. Резултатите зависят от конкуренцията и активността в профила.',
  },
  {
    q: 'Трябва ли ми агенция за GBP настройка?',
    a: 'Можете да го направите сами — Google Business Profile е безплатен и има уроци. Но агенцията оптимизира: категории, атрибути, снимки, постове, отговори на ревюта, Schema.org свързване. Това е разликата между "имам профил" и "профилът ми носи клиенти".',
  },
  {
    q: 'Какво е по-добра инвестиция за малък бизнес в Търново?',
    a: 'Ако бюджетът е ограничен — започнете с GBP (безплатно) + SEO оптимизация (390 €). Това дава локална видимост за 2–4 седмици. След това добавете сайт (999 €) за brand authority и национално класиране.',
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
      '@id': 'https://imashnujnoto.com/blog/google-business-vs-sait-tarnovo#article',
      headline: 'Google Business Profile vs уеб сайт за бизнес в Търново — кое печели 2026?',
      description: 'Провокативно сравнение: Google Business Profile или уеб сайт — кое е по-важно за бизнес в Търново 2026? Реални данни, цени и стратегии. ТАВОРА ЕООД.',
      url: 'https://imashnujnoto.com/blog/google-business-vs-sait-tarnovo',
      datePublished: '2026-05-06',
      dateModified: today,
      inLanguage: 'bg',
      wordCount: 3600,
      timeRequired: 'PT13M',
      keywords: [
        'Google Business Profile Търново',
        'уеб сайт vs GBP',
        'локално SEO Търново',
        'кое е по-важно сайт или Google Business',
        'маркетинг стратегия малък бизнес',
        'GBP оптимизация',
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
        url: 'https://readdy.ai/api/search-image?query=Google%20Business%20Profile%20vs%20website%20comparison%20smartphone%20and%20laptop%20side%20by%20side%20local%20SEO%20strategy%20clean%20minimal%20white%20background%20modern%20technology%20professional%20Bulgaria%202026&width=1200&height=630&seq=gbp-vs-sait-hero&orientation=landscape',
        width: 1200,
        height: 630,
      },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Начало', item: 'https://imashnujnoto.com/' },
          { '@type': 'ListItem', position: 2, name: 'Блог', item: 'https://imashnujnoto.com/blog' },
          { '@type': 'ListItem', position: 3, name: 'Google Business vs уеб сайт Търново', item: 'https://imashnujnoto.com/blog/google-business-vs-sait-tarnovo' },
        ],
      },
    },
    {
      '@type': 'HowTo',
      name: 'Как да изберете между Google Business Profile и уеб сайт за бизнес в Търново',
      description: 'Практически стъпки за вземане на решение между GBP и сайт за бизнес в Велико Търново.',
      step: [
        {
          '@type': 'HowToStep',
          position: 1,
          name: 'Оценете бюджета си',
          text: 'Ако имате 0 лв. — започнете с GBP (безплатно). Ако имате 500+ лв. — започнете с GBP + SEO. Ако имате 1 500+ лв. — GBP + сайт + SEO е оптималната комбинация.',
          url: 'https://imashnujnoto.com/blog/google-business-vs-sait-tarnovo#byudzhet',
        },
        {
          '@type': 'HowToStep',
          position: 2,
          name: 'Оценете целите си',
          text: 'Само локални клиенти от Търново? GBP е достатъчен. Национални клиенти? Нужен е сайт. И двете? Комбинация от GBP + сайт + SEO.',
          url: 'https://imashnujnoto.com/blog/google-business-vs-sait-tarnovo#celi',
        },
        {
          '@type': 'HowToStep',
          position: 3,
          name: 'Оценете конкуренцията',
          text: 'Ако конкурентите имат и GBP, и сайт — трябват и двете, за да сте конкурентни. Ако никой няма GBP — само GBP може да ви даде #1 за седмици.',
          url: 'https://imashnujnoto.com/blog/google-business-vs-sait-tarnovo#konkurenciya',
        },
        {
          '@type': 'HowToStep',
          position: 4,
          name: 'Създайте стратегия и измервайте',
          text: 'Независимо какво изберете — измервайте резултатите. Google Search Console за сайт, GBP Insights за профила. Ако не мерите — не знаете дали работи.',
          url: 'https://imashnujnoto.com/blog/google-business-vs-sait-tarnovo#strategiya',
        },
      ],
    },
  ],
};

const COMPARISON_TABLE = [
  { feature: 'Цена', gbp: 'Безплатно', site: '999 €+ (ТАВОРА)', winner: 'GBP', reason: 'GBP е безплатен. Сайтът изисква инвестиция.' },
  { feature: 'Време за старт', gbp: '2–4 седмици', site: '2–4 седмици', winner: 'Равни', reason: 'И двете са бързи при правилна работа.' },
  { feature: 'Локално класиране', gbp: 'Отлично — Maps, Local Pack', site: 'Добро — с LocalBusiness Schema', winner: 'GBP', reason: 'GBP е проектиран за локално. Сайтът се нуждае от оптимизация.' },
  { feature: 'Национално класиране', gbp: 'Слабо — локален фокус', site: 'Отлично — с SEO', winner: 'Сайт', reason: 'Сайтът класира за национални думи. GBP — не.' },
  { feature: 'Brand authority', gbp: 'Ограничено — само основна информация', site: 'Пълно — блог, case studies, портфолио', winner: 'Сайт', reason: 'Сайтът показва експертиза. GBP — само данни.' },
  { feature: 'Lead generation', gbp: 'Телефон, посоки, уебсайт бутон', site: 'Форми, чат, newsletter, booking', winner: 'Сайт', reason: 'Сайтът събира данни. GBP — само контакт.' },
  { feature: 'SEO контрол', gbp: 'Ограничен — Google контролира', site: 'Пълен — вие контролирате всичко', winner: 'Сайт', reason: 'Сайтът е ваш. GBP е под контрола на Google.' },
  { feature: 'Видео и богато съдържание', gbp: 'Снимки и кратки постове', site: 'Видеа, блог, галерии, интерактивни елементи', winner: 'Сайт', reason: 'Сайтът няма ограничения за съдържание.' },
  { feature: 'AI търсачки (ChatGPT, Perplexity)', gbp: 'Слабо — AI чете сайтове', site: 'Отлично — с Schema.org и богато съдържание', winner: 'Сайт', reason: 'AI търсачките четат сайтове, не GBP профили.' },
  { feature: 'Социални доказателства', gbp: 'Ревюта в Google', site: 'Ревюта, case studies, клиентски истории, сертификати', winner: 'Сайт', reason: 'Сайтът показва пълно доверие. GBP — само звезди.' },
  { feature: 'Поддръжка', gbp: '2–3 часа седмично', site: 'Постоянна — блог, актуализации, SEO', winner: 'GBP', reason: 'GBP е по-лесен за поддръжка.' },
  { feature: 'ROI за малък бизнес', gbp: 'Безкраен — безплатно + клиенти', site: 'Висок — след 2–3 месеца', winner: 'GBP', reason: 'GBP дава бърз ROI без инвестиция.' },
];

const SCENARIOS = [
  {
    title: 'Сценарий 1: Стартиращ бизнес с 0 лв. бюджет',
    icon: 'ri-seedling-line',
    color: '#2F9E44',
    desc: 'Имате нов бизнес в Търново, но нямате пари за маркетинг.',
    action: 'Създайте Google Business Profile днес — безплатно. Оптимизирайте го със снимки, описание, работно време и категории. Публикувайте постове седмично.',
    result: 'Ще се появите в Google Maps за 2–4 седмици. Ще получавате обаждания безплатно.',
    timeline: '2–4 седмици',
    cost: '0 лв.',
  },
  {
    title: 'Сценарий 2: Малък бизнес с 500 лв. бюджет',
    icon: 'ri-store-2-line',
    color: '#3B5BDB',
    desc: 'Имате бюджет, но не искате да рискувате много.',
    action: 'GBP (безплатно) + SEO пакет от 390 € (ТАВОРА). Това включва технически одит, on-page SEO, GBP оптимизация, Schema.org и 3 месеца мониторинг.',
    result: 'Локално #1 за 1–3 месеца. Органичен трафик +40%. GBP ревюта + клиенти.',
    timeline: '1–3 месеца',
    cost: '390 €',
  },
  {
    title: 'Сценарий 3: Растящ бизнес с 1 500+ лв. бюджет',
    icon: 'ri-rocket-line',
    color: '#E8590C',
    desc: 'Искате пълна дигитална стратегия за доминиране в Търново.',
    action: 'GBP + сайт (999 €) + SEO (390 €) + видео (250 €). Комбинация от всички канали за максимално присъствие.',
    result: 'Локално #1 + национално класиране. Brand authority. AI видимост. 15+ нови клиента/мес.',
    timeline: '2–4 месеца',
    cost: '1 639 €',
  },
  {
    title: 'Сценарий 4: Бизнес, който иска само локални клиенти',
    icon: 'ri-map-pin-2-line',
    color: '#C2255C',
    desc: 'Ресторант, магазин или сервиз — само клиенти от Търново.',
    action: 'GBP е достатъчен за 80% от нуждите. Добавете SEO (390 €) само ако искате да класирате за специфични думи като "ресторант велико търново".',
    result: 'GBP ще ви донесе 60–80% от локалните клиенти безплатно. SEO е бонус за конкурентни думи.',
    timeline: '2–4 седмици',
    cost: '0–390 €',
  },
];

const MYTHS = [
  {
    myth: '„Сайтът е по-важен от GBP"',
    reality: 'За локално SEO — GBP е по-важен. За национално — сайтът е. Не е или/или — трябват и двете.',
    winner: 'Зависи от целта',
  },
  {
    myth: '„GBP е достатъчен — не ми трябва сайт"',
    reality: 'GBP е витрина, не магазин. Ако искате да продавате онлайн, да събирате lead-ове или да показвате портфолио — нужен е сайт.',
    winner: 'Сайт за brand, GBP за локално',
  },
  {
    myth: '„Сайтът от 300 € е добър старт"',
    reality: 'Евтиният сайт обикновено е без SEO, без мобилна версия, без Schema.org. Трябва да го правите отново след 6 месеца. Инвестирайте веднъж правилно.',
    winner: 'Качествен сайт от 999 €',
  },
  {
    myth: '„GBP работи без поддръжка"',
    reality: 'GBP изисква седмични постове, нови снимки, отговори на ревюта и актуализации. Без активност — класирането пада.',
    winner: 'GBP + постоянство',
  },
  {
    myth: '„AI търсачките четат GBP"',
    reality: 'ChatGPT и Perplexity четат сайтове, не GBP профили. Ако искате AI видимост — инвестирайте в сайт с Schema.org.',
    winner: 'Сайт за AI',
  },
];

const RELATED = [
  { title: 'Google Business Profile Търново', to: '/blog/google-business-vt', cat: 'Локално SEO', color: 'bg-amber-50 text-amber-700' },
  { title: 'SEO оптимизация Търново 2026', to: '/blog/seo-optimizaciya-tarnovo-2026', cat: 'SEO', color: 'bg-emerald-50 text-emerald-700' },
  { title: 'Безплатен SEO за #1', to: '/blog/bezplaten-seo-nomer-edno-google', cat: 'SEO', color: 'bg-emerald-50 text-emerald-700' },
  { title: 'GEO оптимизация за AI', to: '/blog/ai-tursachki-biznes-tarnovo', cat: 'GEO & AI', color: 'bg-violet-50 text-violet-700' },
  { title: 'Колко струва маркетинг Търново', to: '/blog/kolko-struva-digitalen-marketing-tarnovo', cat: 'Цени', color: 'bg-orange-50 text-orange-700' },
  { title: 'SEO услуга Търново', to: '/seo-veliko-tarnovo', cat: 'Услуга', color: 'bg-sky-50 text-sky-700' },
];

export default function GoogleBusinessVsSaitTarnovoPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    document.title = 'Google Business Profile vs уеб сайт Търново — кое печели 2026? | ТАВОРА ЕООД';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', 'Провокативно сравнение: Google Business Profile или уеб сайт — кое е по-важно за бизнес в Търново 2026? Реални данни, цени и стратегии. ТАВОРА ЕООД.');
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://imashnujnoto.com/blog/google-business-vs-sait-tarnovo');

    const id = 'schema-gbp-vs-sait';
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) { el = document.createElement('script'); el.id = id; el.type = 'application/ld+json'; document.head.appendChild(el); }
    el.textContent = JSON.stringify(ARTICLE_SCHEMA);

    const faqId = 'schema-gbp-vs-sait-faq';
    let faqEl = document.getElementById(faqId) as HTMLScriptElement | null;
    if (!faqEl) { faqEl = document.createElement('script'); faqEl.id = faqId; faqEl.type = 'application/ld+json'; document.head.appendChild(faqEl); }
    faqEl.textContent = JSON.stringify(FAQ_SCHEMA);

    return () => {
      ['schema-gbp-vs-sait', 'schema-gbp-vs-sait-faq'].forEach((sid) => { const e = document.getElementById(sid); if (e) e.remove(); });
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
              <span className="text-[#1C1C1E]/65">GBP vs сайт Търново</span>
            </nav>

            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span className="text-[10px] px-2.5 py-1 rounded-full font-medium bg-amber-50 text-amber-700">Локално SEO</span>
              <span className="text-[10px] px-2.5 py-1 rounded-full font-medium bg-teal-50 text-teal-700">Сравнение</span>
              <span className="text-[10px] px-2.5 py-1 rounded-full font-medium bg-orange-50 text-orange-700">Провокативно</span>
              <span className="text-[10px] text-[#1C1C1E]/70">13 мин. четене · 6 Май 2026</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-light text-[#1C1C1E] leading-tight mb-5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Google Business Profile
              <br />
              <em className="text-[#0A2540]">или уеб сайт</em>
              <br />
              <strong className="font-light">— кое печели за бизнес в Търново?</strong>
            </h1>

            <p className="text-sm md:text-base text-[#1C1C1E]/65 max-w-2xl leading-relaxed mb-6">
              <strong className="text-[#1C1C1E]">Провокативен въпрос:</strong> Ако имате 1 000 лв. и трябва да изберете
              само едно — <em>Google Business Profile или уеб сайт</em> — кое да е?
              Отговорът ще ви изненада. И ще ви спести хиляди левове.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link to="/kontakt" className="px-6 py-3 bg-[#1C1C1E] text-white text-sm rounded-full hover:bg-[#1C1C1E]/80 transition-all cursor-pointer whitespace-nowrap">
                Консултация 50 € →
              </Link>
              <Link to="/blog/google-business-vt" className="px-6 py-3 border border-[#1C1C1E]/12 text-[#1C1C1E]/65 text-sm rounded-full hover:border-[#1C1C1E]/30 hover:text-[#1C1C1E] transition-all cursor-pointer whitespace-nowrap">
                GBP ръководство
              </Link>
            </div>
          </div>
        </section>

        {/* HERO IMAGE */}
        <div className="w-full h-[280px] md:h-[420px] overflow-hidden">
          <img
            src="https://readdy.ai/api/search-image?query=Google%20Business%20Profile%20vs%20website%20comparison%20smartphone%20and%20laptop%20side%20by%20side%20local%20SEO%20strategy%20clean%20minimal%20white%20background%20modern%20technology%20professional%20Bulgaria%202026&width=1400&height=420&seq=gbp-vs-sait-hero-img&orientation=landscape"
            alt="Google Business Profile vs уеб сайт за бизнес в Търново"
            className="w-full h-full object-cover object-top"
            loading="lazy" decoding="async"
          />
        </div>

        <div className="max-w-4xl mx-auto px-4 md:px-16 py-12 md:py-16">

          {/* ВЪВЕДЕНИЕ */}
          <section className="mb-14">
            <h2 className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Да започнем с провокацията.
            </h2>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              Повечето агенции в Търново ще ви кажат: <em>„Трябва ви сайт — това е вашето дигитално лице"</em>.
              Други ще кажат: <em>„Google Business Profile е достатъчен — той е безплатен"</em>.
            </p>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              <strong className="text-[#1C1C1E]">И двете са грешни</strong> — или поне непълни.
              Истината е, че <strong className="text-[#1C1C1E]">зависи</strong>.
              Зависи от бюджета ви, целите ви, конкуренцията и вида бизнес.
            </p>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-6">
              Тази статия е <strong className="text-[#1C1C1E]">първата в България</strong>, която сравнява обективно
              GBP и сайт за бизнес в Търново — с реални данни, реални цени и реални сценарии.
              Без предразсъдъци, без продажби — само факти.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-6 rounded-2xl bg-[#F9F9F7] border border-[#1C1C1E]/6">
              {[
                { value: '0 лв.', label: 'GBP цена' },
                { value: '999 €', label: 'Сайт от ТАВОРА' },
                { value: '2–4 сед.', label: 'GBP резултат' },
                { value: '2–4 сед.', label: 'Сайт резултат' },
                { value: 'Локално', label: 'GBP сила' },
                { value: 'Национално', label: 'Сайт сила' },
              ].map((s) => (
                <div key={s.value} className="text-center">
                  <div className="text-xl md:text-2xl font-light text-[#1C1C1E] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{s.value}</div>
                  <div className="text-[10px] text-[#1C1C1E]/65 leading-tight">{s.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* СРАВНИТЕЛНА ТАБЛИЦА */}
          <section className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[1px] bg-[#1C1C1E]/20 shrink-0" />
              <span className="text-xs text-[#1C1C1E]/60">Сравнение</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              GBP vs сайт — <em className="text-[#1C1C1E]/60">12 критерия, 1 победител.</em>
            </h2>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-8">
              Всяка клетка е базирана на реални данни от проекти в Търново.
              Победителят във всяка категория е маркиран.
            </p>

            <div className="space-y-3">
              {COMPARISON_TABLE.map((row) => (
                <div key={row.feature} className="p-4 rounded-2xl border border-[#1C1C1E]/8 bg-white">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="text-xs font-medium text-[#1C1C1E]">{row.feature}</div>
                    <div className="flex-1 h-px bg-[#1C1C1E]/8" />
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#0A2540]/8 text-[#0A2540] font-medium">
                      Победител: {row.winner}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-[#F9F9F7]">
                      <div className="text-[10px] text-[#E67700] mb-1">Google Business Profile</div>
                      <div className="text-[#1C1C1E]/65">{row.gbp}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#F9F9F7]">
                      <div className="text-[10px] text-[#3B5BDB] mb-1">Уеб сайт</div>
                      <div className="text-[#1C1C1E]/65">{row.site}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#0A2540]/4">
                      <div className="text-[10px] text-[#0A2540] mb-1">Защо?</div>
                      <div className="text-[#1C1C1E]/65">{row.reason}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* СЦЕНАРИИ */}
          <section className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[1px] bg-[#1C1C1E]/20 shrink-0" />
              <span className="text-xs text-[#1C1C1E]/60">Сценарии</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Какво да изберете <em className="text-[#1C1C1E]/60">според бюджета?</em>
            </h2>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-8">
              Няма един отговор за всички. Ето 4 реални сценария за бизнес в Търново:
            </p>

            <div className="space-y-5">
              {SCENARIOS.map((scen) => (
                <div key={scen.title} className="rounded-2xl border border-[#1C1C1E]/8 overflow-hidden">
                  <div className="p-5 md:p-7 border-b border-[#1C1C1E]/6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 flex items-center justify-center rounded-xl shrink-0" style={{ backgroundColor: `${scen.color}12` }}>
                        <i className={`${scen.icon} text-lg`} style={{ color: scen.color }} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-medium text-[#1C1C1E] mb-1">{scen.title}</h3>
                        <p className="text-xs text-[#1C1C1E]/65">{scen.desc}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-5 md:p-7 bg-[#F9F9F7]">
                    <div className="space-y-3">
                      <div>
                        <div className="text-[10px] text-[#1C1C1E]/65 tracking-widest uppercase mb-1">Действие</div>
                        <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">{scen.action}</p>
                      </div>
                      <div>
                        <div className="text-[10px] text-[#1C1C1E]/65 tracking-widest uppercase mb-1">Резултат</div>
                        <p className="text-sm text-[#2F9E44] leading-relaxed">{scen.result}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[#1C1C1E]/6">
                      <div className="flex items-center gap-2">
                        <i className="ri-time-line text-[10px] text-[#1C1C1E]/70" />
                        <span className="text-[10px] text-[#1C1C1E]/65">{scen.timeline}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <i className="ri-money-euro-circle-line text-[10px] text-[#1C1C1E]/70" />
                        <span className="text-[10px] text-[#1C1C1E]/65">{scen.cost}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* МИТОВЕ */}
          <section className="mb-14 p-6 md:p-8 rounded-2xl border border-[#E8590C]/15 bg-[#FFF8F0]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#E8590C]/10">
                <i className="ri-lightbulb-flash-line text-sm text-[#E8590C]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-light text-[#1C1C1E]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Митове vs <em className="text-[#E8590C]">реалност.</em>
              </h2>
            </div>

            <div className="space-y-4">
              {MYTHS.map((m) => (
                <div key={m.myth} className="p-4 rounded-xl bg-white border border-[#1C1C1E]/6">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="w-5 h-5 flex items-center justify-center rounded-full bg-[#E03131]/10 shrink-0 mt-0.5">
                      <i className="ri-close-line text-[10px] text-[#E03131]" />
                    </div>
                    <span className="text-sm text-[#E03131]/80">{m.myth}</span>
                  </div>
                  <div className="flex items-start gap-3 mb-2 pl-8">
                    <div className="w-5 h-5 flex items-center justify-center rounded-full bg-[#2F9E44]/10 shrink-0 mt-0.5">
                      <i className="ri-check-line text-[10px] text-[#2F9E44]" />
                    </div>
                    <span className="text-sm text-[#1C1C1E]/65">{m.reality}</span>
                  </div>
                  <div className="pl-8">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#0A2540]/6 text-[#0A2540]">Истината: {m.winner}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ФИНАЛЕН ОТГОВОР */}
          <section className="mb-14 p-6 md:p-8 rounded-2xl bg-[#0F1F35] text-white">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-[1px] bg-white/20 shrink-0" />
              <span className="text-xs text-white/75 tracking-widest uppercase">Вердикт</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-light mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              И така — кое печели?
            </h2>
            <p className="text-sm text-white/75 leading-relaxed mb-4">
              Нито GBP печели сам, нито сайтът.
              <strong className="text-white"> Комбинацията е победителят.</strong>
            </p>
            <p className="text-sm text-white/75 leading-relaxed mb-6">
              За бизнес в Търново препоръчваме:
            </p>
            <div className="space-y-3 mb-6">
              {[
                'Винаги започвайте с GBP — безплатно, бързо, ефективно за локално',
                'Ако имате бюджет 500+ лв. — добавете SEO (390 €) за класиране',
                'Ако имате бюджет 1 500+ лв. — добавете сайт (999 €) за brand authority',
                'Ако искате AI видимост — сайтът е задължителен, GBP не е достатъчен',
                'Мерете резултатите с GSC и GBP Insights — и коригирайте',
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
              Персонална стратегия 50 € →
            </Link>
          </section>

          {/* FAQ */}
          <section className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[1px] bg-[#1C1C1E]/20 shrink-0" />
              <span className="text-xs text-[#1C1C1E]/60">Въпроси и отговори</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Чести въпроси за GBP и сайт.
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
                <div className="text-xs text-white/75 tracking-widest uppercase mb-2">Готови за стратегия?</div>
                <div className="text-2xl md:text-3xl font-light leading-tight mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  GBP, сайт или и двете?
                  <br />
                  <span className="italic text-white/60">Ние ще ви кажем кое е за вас.</span>
                </div>
                <p className="text-sm text-white/75 max-w-md leading-relaxed">
                  Консултация 50 € — анализ на бизнеса, конкурентите, бюджета и препоръка. Сумата се приспада при договор.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <Link to="/kontakt" className="px-7 py-3.5 bg-white text-[#0A2540] text-sm rounded-full hover:bg-white/90 transition-all cursor-pointer whitespace-nowrap text-center font-medium">
                  Поискайте стратегия →
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