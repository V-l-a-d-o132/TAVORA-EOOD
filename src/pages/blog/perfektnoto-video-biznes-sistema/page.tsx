import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SharedNav from '@/components/feature/SharedNav';
import SharedFooter from '@/components/feature/SharedFooter';

const FAQ_ITEMS = [
  {
    q: 'Какво е "Перфектното Видео" и за кого е?',
    a: '"Перфектното Видео" е 15-модулна система за създаване на бизнес видео — от идея до готов продукт. За предприемачи, маркетолози и бизнес собственици, които искат професионално видео съдържание без да наемат цяла продукционна компания.',
  },
  {
    q: 'Трябва ли ми скъпа техника?',
    a: 'Не. Първите модули покриват стратегията и планирането — без камера. За снимачния ден може да ползваш смартфон с добро осветление. Модулът за техника показва опции от бюджетни до професионални. Важното е да започнеш.',
  },
  {
    q: 'Колко време отнема цялата програма?',
    a: '15 модула с общо 241 урока. Всеки модул е 1.5-3 часа. Можеш да минеш цялата програма за 6-8 седмици с по 1-2 часа на ден. Но всеки модул е самостоятелен — можеш да вземеш само този, който ти трябва.',
  },
  {
    q: 'Ще мога ли да правя видеа за клиенти след това?',
    a: 'Да — системата е проектирана така, че да можеш да предлагаш видео продукция като услуга. Модул 13 (Професионална продукция) покрива точно това: как да намираш клиенти, да ценообразуваш и да доставяш професионално.',
  },
  {
    q: 'Каква е разликата с CapCut и YouTube туториали?',
    a: 'YouTube туториалите показват изолирани техники. "Перфектното Видео" е система — от бизнес диагностиката на клиента до финалния продукт. Не учиш "как се прави преход в CapCut" — учиш как се прави видео, което носи продажби.',
  },
  {
    q: 'Има ли бонус инструменти?',
    a: 'Да — включени са бонус инструменти: AI скриптов генератор, шум на аудитория, видео SEO чеклист, шаблони за договори и още. Неща, които ние реално използваме в продукцията си.',
  },
  {
    q: 'Трябва ли ми предишен опит с видео?',
    a: 'Не. Започваме от абсолютна нула. Модул 1 е диагностика — защо ти трябва видео изобщо. Модул 2 е стратегия. Едва в модул 5 стигаме до техника. Всичко е стъпка по стъпка.',
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
      '@id': 'https://imashnujnoto.com/blog/perfektnoto-video-biznes-sistema#article',
      headline: 'Перфектното Видео — пълната система за бизнес видео продукция от идея до готов продукт',
      description: 'Пълна система за бизнес видео продукция: 15 модула. От диагностика и стратегия до снимачен ден и монтаж. За предприемачи и маркетолози. ТАВОРА ЕООД.',
      url: 'https://imashnujnoto.com/blog/perfektnoto-video-biznes-sistema',
      datePublished: '2026-07-07',
      dateModified: today,
      inLanguage: 'bg',
      wordCount: 3500,
      timeRequired: 'PT13M',
      keywords: [
        'видео маркетинг България',
        'бизнес видео продукция',
        'видео за бизнес обучение',
        'как да правя видеа за бизнес',
        'видео продукция обучение',
        'видео маркетинг стратегия',
        'професионално видео за бизнес',
        'видео съдържание България',
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
        url: 'https://readdy.ai/api/search-image?query=professional%20video%20production%20studio%20setup%20camera%20equipment%20lighting%20rig%20cinematic%20atmosphere%20behind%20the%20scenes%20filmmaking%20clean%20minimalist%20dark%20background%20dramatic%20shadows%20red%20accent%20lights%20editorial%20quality&width=1200&height=630&seq=blog-video-system-hero&orientation=landscape',
        width: 1200,
        height: 630,
      },
      isPartOf: { '@id': 'https://imashnujnoto.com/#website' },
      about: [
        { '@type': 'Thing', name: 'Видео продукция' },
        { '@type': 'Thing', name: 'Видео маркетинг' },
        { '@type': 'Thing', name: 'Бизнес видео' },
      ],
      mentions: [
        { '@type': 'Organization', name: 'ТАВОРА ЕООД', url: 'https://imashnujnoto.com' },
        { '@type': 'Organization', name: 'K-Food Велико Търново', url: 'https://k-foodvelikotarnovo.com/' },
        { '@type': 'Organization', name: 'Академика 245', url: 'https://akademika245.com/' },
        { '@type': 'Organization', name: 'Амалипе', url: 'https://amalipe.com/' },
      ],
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Начало', item: 'https://imashnujnoto.com/' },
          { '@type': 'ListItem', position: 2, name: 'Блог', item: 'https://imashnujnoto.com/blog' },
          { '@type': 'ListItem', position: 3, name: 'Перфектното Видео — система за бизнес видео', item: 'https://imashnujnoto.com/blog/perfektnoto-video-biznes-sistema' },
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

const MODULES = [
  {
    num: '01',
    title: 'Диагностика на бизнеса',
    subtitle: 'Преди да снимаш — разбери какво ти трябва',
    desc: 'Анализ на бизнес целите. Какъв тип видео работи за твоята ниша? Анализ на конкурентите. Дефиниране на видео KPI-та.',
    lessons: 4,
    color: '#3B5BDB',
  },
  {
    num: '02',
    title: 'Видео стратегия',
    subtitle: 'Платформи, формати и честота',
    desc: 'Къде да публикуваш? TikTok, Reels, YouTube Shorts, YouTube Long, LinkedIn. Формати за всяка платформа. Календар на съдържанието.',
    lessons: 5,
    color: '#E67700',
  },
  {
    num: '03',
    title: 'Сценарий и сториборд',
    subtitle: 'Какво ще кажеш и как ще го покажеш',
    desc: 'Писане на видео скриптове, които задържат вниманието. Структура Hook-Story-Offer. Сториборд за визуално планиране.',
    lessons: 4,
    color: '#C2255C',
  },
  {
    num: '04',
    title: 'Предкамерна подготовка',
    subtitle: 'Локация, грим, гардероб, реквизит',
    desc: 'Избор на локация. Какво да облечеш пред камера. Минимален грим за видео. Реквизит, който разказва история. Чеклист за снимачен ден.',
    lessons: 4,
    color: '#2F9E44',
  },
  {
    num: '05',
    title: 'Техника и заснемане',
    subtitle: 'Камера, звук, светлина — от бюджет до професионално',
    desc: 'Опции за всякакъв бюджет — от смартфон до професионална камера. Осветление на 3 точки. Звук: защо е по-важен от картината. Снимачни техники.',
    lessons: 5,
    color: '#7048E8',
  },
  {
    num: '06',
    title: 'Снимачен ден',
    subtitle: 'Практическо ръководство за снимачния процес',
    desc: 'Тайминг на снимачния ден. Работа с хора пред камера — как да ги отпуснеш. B-roll техники. Какво да снимаш за всеки случай.',
    lessons: 4,
    color: '#e53e3e',
  },
  {
    num: '07',
    title: 'Монтаж и пост-продукция',
    subtitle: 'От суров материал до готово видео',
    desc: 'Избор на софтуер — от CapCut до DaVinci Resolve. Нарязване, преходи, цветокорекция. Добавяне на текст и графика. AI инструменти за монтаж.',
    lessons: 5,
    color: '#0A2540',
  },
  {
    num: '08',
    title: 'Публикуване и оптимизация',
    subtitle: 'Качи видеото така, че да го гледат',
    desc: 'SEO за видео — заглавия, описания, тагове. Thumbnails, които носят кликове. Оптимално време за публикуване. A/B тестване на видеа.',
    lessons: 4,
    color: '#E67700',
  },
  {
    num: '09',
    title: 'Монетизация',
    subtitle: 'Как да печелиш от видео продукция',
    desc: 'Ценообразуване на видео услуги. Пакетиране. Намиране на клиенти. Доставка и feedback loop. Мащабиране на видео бизнес.',
    lessons: 3,
    color: '#22c55e',
  },
];

const VIDEO_STATS = [
  { value: '3x', label: 'по-висока конверсия с видео' },
  { value: '85%', label: 'от бизнесите ползват видео' },
  { value: '+280%', label: 'ръст на трафик с видео (K-Food)' },
  { value: '92%', label: 'от маркетолозите казват че видео е ключово' },
];

const CASE_STUDIES = [
  {
    client: 'K-Food Велико Търново',
    type: 'Продуктово видео + TikTok',
    result: '+280% органичен трафик',
    detail: 'Създадохме серия от къси видеа за TikTok и Reels, показващи приготвянето на корейска храна. Комбинирахме с видео SEO оптимизация за YouTube. Резултат: K-Food станаха разпознаваеми в цяла България.',
    color: '#e53e3e',
  },
  {
    client: 'Академика 245',
    type: 'НПО документално видео',
    result: 'Милиони импресии',
    detail: 'Заснехме документален разказ за интеграцията на ромски деца. Комбинация от интервюта, B-roll и емоционална музика. Видеото беше споделено от национални медии и генерира огромен обществен отзвук.',
    color: '#3B5BDB',
  },
  {
    client: 'Амалипе',
    type: 'Социална кампания',
    result: 'Национално медийно покритие',
    detail: 'Продуцирахме видео кампания за образователна интеграция. Стратегията включваше къси форми за социални мрежи и дълъг формат за YouTube. Резултат: кампанията беше отразена от bTV, Nova и БНТ.',
    color: '#C2255C',
  },
];

const BONUS_TOOLS = [
  { icon: 'ri-robot-line', title: 'AI скриптов генератор', desc: 'Шаблони за ChatGPT, които пишат видео скриптове за минути' },
  { icon: 'ri-megaphone-line', title: 'Шум на аудитория', desc: 'Техника за изграждане на аудитория преди видеото да е готово' },
  { icon: 'ri-file-list-3-line', title: 'Видео SEO чеклист', desc: 'Стъпка по стъпка оптимизация за YouTube и Google' },
  { icon: 'ri-contract-line', title: 'Шаблони за договори', desc: 'Готови договори за видео продукция с клиенти' },
  { icon: 'ri-calendar-check-line', title: 'Снимачен календар', desc: 'Шаблон за планиране на снимачен ден до минута' },
  { icon: 'ri-price-tag-3-line', title: 'Ценообразуващ калкулатор', desc: 'Инструмент за изчисляване на цена на видео проект' },
];

const RELATED = [
  { title: 'Академия TAVORA — пълна програма', to: '/kurs', cat: 'Академия', color: 'bg-red-50 text-red-700' },
  { title: 'Видео маркетинг за бизнеси в Търново', to: '/video-produkciya-veliko-tarnovo', cat: 'Видео', color: 'bg-rose-50 text-rose-700' },
  { title: 'Видео за НПО — как да разкажете каузата си', to: '/blog/video-npo-tarnovo', cat: 'Видео', color: 'bg-rose-50 text-rose-700' },
  { title: 'TikTok и YouTube реклами', to: '/blog/tiktok-youtube-reklama-tarnovo', cat: 'Видео', color: 'bg-rose-50 text-rose-700' },
  { title: 'AI Business Blueprint', to: '/blog/ai-business-blueprint-putyat-na-koprinata', cat: 'AI & Бизнес', color: 'bg-violet-50 text-violet-700' },
  { title: 'Видео продукция услуга', to: '/uslugi/video-produkciya', cat: 'Услуга', color: 'bg-amber-50 text-amber-700' },
];

export default function PerfektnotoVideoPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [openModule, setOpenModule] = useState<number | null>(null);

  useEffect(() => {
    document.title = 'Перфектното Видео — система за бизнес видео продукция | ТАВОРА ЕООД';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', 'Пълна система за бизнес видео продукция: 15 модула от диагностика до сертификация. За предприемачи и маркетолози. Реални проекти. ТАВОРА ЕООД.');
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://imashnujnoto.com/blog/perfektnoto-video-biznes-sistema');

    const id = 'schema-perfektno-video';
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) { el = document.createElement('script'); el.id = id; el.type = 'application/ld+json'; document.head.appendChild(el); }
    el.textContent = JSON.stringify(ARTICLE_SCHEMA);

    const faqId = 'schema-perfektno-video-faq';
    let faqEl = document.getElementById(faqId) as HTMLScriptElement | null;
    if (!faqEl) { faqEl = document.createElement('script'); faqEl.id = faqId; faqEl.type = 'application/ld+json'; document.head.appendChild(faqEl); }
    faqEl.textContent = JSON.stringify(FAQ_SCHEMA);

    return () => {
      ['schema-perfektno-video', 'schema-perfektno-video-faq'].forEach((sid) => { const e = document.getElementById(sid); if (e) e.remove(); });
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
              <span className="text-[#1C1C1E]/65">Перфектното Видео</span>
            </nav>

            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span className="text-[10px] px-2.5 py-1 rounded-full font-medium bg-rose-50 text-rose-700">Видео продукция</span>
              <span className="text-[10px] px-2.5 py-1 rounded-full font-medium bg-red-50 text-red-700">Академия TAVORA</span>
              <span className="text-[10px] px-2.5 py-1 rounded-full font-medium bg-emerald-50 text-emerald-700">Обучение</span>
              <span className="text-[10px] text-[#1C1C1E]/70">13 мин. четене · 7 Юли 2026</span>
            </div>

            <h1
              className="text-3xl md:text-5xl font-light text-[#1C1C1E] leading-tight mb-5"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              <em className="text-[#e53e3e]">Перфектното Видео</em>
              <br />
              <strong className="font-light">от идея до готов продукт</strong>
              <br />
              <span className="text-[#1C1C1E]/60">пълната система за бизнес видео</span>
            </h1>

            <p className="text-sm md:text-base text-[#1C1C1E]/65 max-w-2xl leading-relaxed mb-6">
              <strong className="text-[#1C1C1E]">15 модула.</strong>
              От диагностика и стратегия до снимачен ден и монтаж — пълна система за бизнес видео продукция.
              Без значение дали снимаш с iPhone или RED камера — системата работи.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/kurs/perfektnoto-video"
                className="px-6 py-3 bg-[#1C1C1E] text-white text-sm rounded-full hover:bg-[#1C1C1E]/80 transition-all cursor-pointer whitespace-nowrap"
              >
                Разгледай програмата →
              </Link>
              <Link
                to="/uslugi/video-produkciya"
                className="px-6 py-3 border border-[#1C1C1E]/12 text-[#1C1C1E]/65 text-sm rounded-full hover:border-[#1C1C1E]/30 hover:text-[#1C1C1E] transition-all cursor-pointer whitespace-nowrap"
              >
                Видео продукция услуга
              </Link>
            </div>
          </div>
        </section>

        {/* ── HERO IMAGE ── */}
        <div className="w-full h-[280px] md:h-[420px] overflow-hidden">
          <img
            src="https://readdy.ai/api/search-image?query=professional%20video%20production%20filmmaking%20behind%20the%20scenes%20cinematic%20lighting%20setup%20camera%20on%20tripod%20crew%20working%20dark%20moody%20studio%20atmosphere%20dramatic%20shadows%20red%20and%20warm%20accent%20lights%20professional%20equipment%20editorial%20photography%20no%20text&width=1400&height=420&seq=blog-video-hero-img&orientation=landscape"
            alt="Перфектното Видео — система за бизнес видео продукция"
            className="w-full h-full object-cover object-top"
          />
        </div>

        <div className="max-w-4xl mx-auto px-4 md:px-16 py-12 md:py-16">

          {/* ── ВЪВЕДЕНИЕ ── */}
          <section className="mb-14">
            <h2 className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Видеото вече не е опция. То е задължително.
            </h2>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              През 2026, <strong className="text-[#1C1C1E]">видеото е #1 ранкинг фактор</strong> в дигиталния маркетинг.
              Бизнеси, които използват видео, конвертират <strong className="text-[#1C1C1E]">3 пъти по-добре</strong> от тези,
              които разчитат само на текст и снимки.
            </p>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              Но проблемът е, че повечето бизнеси нямат система за видео. Правят каквото им хрумне — без стратегия,
              без план, без последователност. И после се чудят защо не работи.
            </p>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-6">
              <strong className="text-[#1C1C1E]">"Перфектното Видео"</strong> решава точно това.
              Създадохме система от 15 модула, която вади видео продукцията от "правим нещо" в "ето ти точната рецепта".
              Тествано върху реални клиентски проекти — от K-Food (+280% трафик) до Академика 245 (милиони импресии).
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-2xl bg-[#F9F9F7] border border-[#1C1C1E]/6">
              {VIDEO_STATS.map((s) => (
                <div key={s.value} className="text-center">
                  <div className="text-xl md:text-2xl font-light text-[#1C1C1E] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{s.value}</div>
                  <div className="text-[10px] text-[#1C1C1E]/65 leading-tight">{s.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ── ЗАЩО ВИДЕО ── */}
          <section className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[1px] bg-[#1C1C1E]/20 shrink-0" />
              <span className="text-xs text-[#1C1C1E]/60">Защо сега?</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Защо бизнесът ти има нужда от видео система?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {[
                { icon: 'ri-smartphone-line', title: 'Мобилното потребление доминира', desc: '92% от потребителите гледат видео на мобилно устройство. Ако нямаш видео стратегия, ти буквално не съществуваш за по-голямата част от аудиторията си.' },
                { icon: 'ri-google-line', title: 'Google обича видео', desc: 'Страниците с видео имат 53 пъти по-голям шанс да се появят на първа страница в Google. Видеото е #1 SEO сигнал в 2026.' },
                { icon: 'ri-bar-chart-grouped-line', title: 'Конверсията е многократно по-висока', desc: 'Лендинг страниците с видео конвертират средно с 86% повече. Продуктовите видеа увеличават продажбите с до 144%.' },
                { icon: 'ri-robot-line', title: 'AI търсачките приоритизират видео', desc: 'ChatGPT и Perplexity цитират видео съдържание в отговорите си. Ако нямаш видео — не си в AI отговорите.' },
              ].map((item) => (
                <div key={item.title} className="p-5 rounded-2xl border border-[#1C1C1E]/8 bg-white flex items-start gap-3">
                  <div className="w-8 h-8 flex items-center justify-center rounded-xl shrink-0 bg-[#0A2540]/8">
                    <i className={`${item.icon} text-sm text-[#0A2540]`} />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-[#1C1C1E] mb-1">{item.title}</h4>
                    <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── 9-ТЕ МОДУЛА ── */}
          <section className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[1px] bg-[#1C1C1E]/20 shrink-0" />
              <span className="text-xs text-[#1C1C1E]/60">Програмата</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              15 модула —
              <br />
              <em className="text-[#1C1C1E]/65">от идея до готов продукт.</em>
            </h2>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-8">
              Всеки модул е самостоятелна стъпка в процеса. Не е нужно да вземеш всички — избери тези, които ти трябват.
            </p>

            <div className="space-y-3">
              {MODULES.map((mod) => (
                <div key={mod.num} className="rounded-2xl border border-[#1C1C1E]/8 overflow-hidden">
                  <button
                    className="w-full flex items-center gap-4 p-5 text-left cursor-pointer hover:bg-[#F9F9F7] transition-colors"
                    onClick={() => setOpenModule(openModule === parseInt(mod.num) ? null : parseInt(mod.num))}
                  >
                    <div className="w-10 h-10 flex items-center justify-center rounded-xl shrink-0 text-sm font-medium" style={{ backgroundColor: `${mod.color}12`, color: mod.color }}>
                      {mod.num}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-[#1C1C1E] mb-0.5">{mod.title}</h4>
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
          </section>

          {/* ── БОНУС ИНСТРУМЕНТИ ── */}
          <section className="mb-14 p-6 md:p-8 rounded-2xl bg-[#F9F9F7] border border-[#1C1C1E]/6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[1px] bg-[#1C1C1E]/20 shrink-0" />
              <span className="text-xs text-[#1C1C1E]/60">Бонуси</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Бонус инструменти — <em className="text-[#1C1C1E]/65">готови за употреба.</em>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {BONUS_TOOLS.map((tool) => (
                <div key={tool.title} className="p-4 rounded-xl border border-[#1C1C1E]/8 bg-white">
                  <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#0A2540]/6 mb-3">
                    <i className={`${tool.icon} text-sm text-[#0A2540]`} />
                  </div>
                  <h4 className="text-xs font-medium text-[#1C1C1E] mb-1">{tool.title}</h4>
                  <p className="text-[11px] text-[#1C1C1E]/65 leading-relaxed">{tool.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── CASE STUDIES ── */}
          <section className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[1px] bg-[#1C1C1E]/20 shrink-0" />
              <span className="text-xs text-[#1C1C1E]/60">Реални проекти</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Доказано с реални клиенти.
            </h2>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-8">
              Това са проекти, които сме заснели и продуцирали — не теория.
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
                          <div className="text-xs text-[#1C1C1E]/65">{cs.type}</div>
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
          </section>

          {/* ── FAQ ── */}
          <section className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[1px] bg-[#1C1C1E]/20 shrink-0" />
              <span className="text-xs text-[#1C1C1E]/60">Въпроси и отговори</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Всичко, което питате за видеото.
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
                <div className="text-xs text-white/75 tracking-widest uppercase mb-2">Готов да създаваш видеа като професионалист?</div>
                <div className="text-2xl md:text-3xl font-light leading-tight mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Перфектното Видео
                  <br />
                  <span className="italic text-white/60">разгледай актуалната програма и цената</span>
                </div>
                <p className="text-sm text-white/75 max-w-md leading-relaxed">
                  Първият модул (Диагностика) е безплатен. Започни да планираш видеата си днес.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <Link to="/kurs/perfektnoto-video" className="px-7 py-3.5 bg-white text-[#0A2540] text-sm rounded-full hover:bg-white/90 transition-all cursor-pointer whitespace-nowrap text-center font-medium">
                  Разгледай програмата →
                </Link>
                <Link to="/uslugi/video-produkciya" className="px-7 py-3.5 border border-white/20 text-white/70 text-sm rounded-full hover:border-white/40 hover:text-white transition-all cursor-pointer whitespace-nowrap text-center">
                  Видео продукция за бизнеса ти
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
              <div className="text-sm font-medium text-[#1C1C1E] mb-0.5">Владимир Атанасов & Натан Петков</div>
              <div className="text-xs text-[#1C1C1E]/65 mb-2">ТАВОРА ЕООД · Видео продукция и маркетинг</div>
              <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">
                Продуцирали сме видеа за бизнеси и НПО с милиони импресии. Специализираме се в бизнес видео, което работи — не просто изглежда добре.
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