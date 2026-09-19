import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SharedNav from '@/components/feature/SharedNav';
import SharedFooter from '@/components/feature/SharedFooter';

const FAQ_ITEMS = [
  {
    q: 'Колко струва видео продукция за бизнес в Търново?',
    a: 'Видео продукцията за бизнес в Търново зависи от обема и сложността. Кратък промо ролик — от 250 €. Пълен бранд видео — от 900 €. Консултацията е 50 € и се приспада при договор. Вижте пълната ни услуга за видео продукция в Търново.',
  },
  {
    q: 'Колко видеа трябва да правя месечно?',
    a: 'За оптимален резултат: 2–4 видеа седмично за TikTok, 1 видео седмично за YouTube. Това са 8–12 TikTok видеа и 4 YouTube видеа месечно. Видеото е най-силният ранкинг фактор в момента — инвестицията си струва.',
  },
  {
    q: 'Може ли видеото да помогне за SEO?',
    a: 'Да — видеата на YouTube се индексират в Google. Страница с видео класира по-добре от страница без видео. Плюс — трафикът от YouTube и TikTok към сайта ви е позитивен сигнал за Google.',
  },
  {
    q: 'Трябва ли ми скъпо оборудване?',
    a: 'Не задължително. TikTok видеа работят със смартфон и ринг лайт. YouTube е по-добре с професионална камера и микрофон. Ние снимаме с 4K камери, но за начало и телефонът е достатъчен.',
  },
  {
    q: 'Колко бързо виждат резултати от видео маркетинга?',
    a: 'TikTok — може за 24 часа (вирусен потенциал). YouTube — 2–4 месеца за стабилен органичен ръст. Комбинираната стратегия (TikTok + YouTube + реклами) дава резултати най-бързо.',
  },
  {
    q: 'Какво включва видео пакетът от ТАВОРА ЕООД?',
    a: 'Концепция, сценарий, заснемане, монтаж, цветокорекция, звук, субтитри и оптимизация за социалните медии. Доставка за 5 работни дни. Вижте повече на страницата за видео продукция в Търново.',
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

const ARTICLE_SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      '@id': 'https://imashnujnoto.com/blog/video-marketing-biznes-tarnovo#article',
      headline: 'Видео маркетинг за бизнеси в Търново — стратегия за доминиране 2026',
      description: 'Видео маркетинг за бизнеси в Търново — пълна стратегия за 2026. TikTok, YouTube, Reels, Shorts — как да използвате видеото за да доминирате в Търново. ТАВОРА ЕООД.',
      url: 'https://imashnujnoto.com/blog/video-marketing-biznes-tarnovo',
      datePublished: '2026-05-05',
      dateModified: new Date().toISOString().split('T')[0],
      inLanguage: 'bg',
      wordCount: 3600,
      timeRequired: 'PT13M',
      keywords: ['видео маркетинг Търново', 'видео продукция Търново', 'TikTok бизнес', 'YouTube бизнес', 'видео реклама', 'дигитален маркетинг Търново'],
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
        url: 'https://readdy.ai/api/search-image?query=video%20marketing%20strategy%20business%20professional%20camera%20filming%20crew%20modern%20office%20content%20creation%20studio%20setup%20clean%20minimal%20white%20background%20Bulgaria%202026&width=1200&height=630&seq=video-marketing-hero&orientation=landscape',
        width: 1200,
        height: 630,
      },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Начало', item: 'https://imashnujnoto.com/' },
          { '@type': 'ListItem', position: 2, name: 'Блог', item: 'https://imashnujnoto.com/blog' },
          { '@type': 'ListItem', position: 3, name: 'Видео маркетинг бизнес Търново', item: 'https://imashnujnoto.com/blog/video-marketing-biznes-tarnovo' },
        ],
      },
    },
  ],
};

const VIDEO_FORMATS = [
  {
    name: 'TikTok',
    icon: 'ri-tiktok-line',
    color: '#010101',
    duration: '15–60 сек.',
    frequency: '3–5/седмица',
    bestFor: 'B2C, млада аудитория, вирусен reach',
    stats: [
      { value: '1200%', label: 'повече споделяния' },
      { value: '1.5 млрд.', label: 'потребители' },
      { value: '52 мин.', label: 'средно време/ден' },
    ],
  },
  {
    name: 'Instagram Reels',
    icon: 'ri-instagram-line',
    color: '#E1306C',
    duration: '15–90 сек.',
    frequency: '3–4/седмица',
    bestFor: 'B2C, продукти, услуги, визуален бранд',
    stats: [
      { value: '22%', label: 'повече reach' },
      { value: '2 млрд.', label: 'потребители' },
      { value: '67%', label: 'реализация от Reels' },
    ],
  },
  {
    name: 'YouTube Shorts',
    icon: 'ri-youtube-line',
    color: '#FF0000',
    duration: '15–60 сек.',
    frequency: '3–5/седмица',
    bestFor: 'Бърз растеж, Shorts + Long формат',
    stats: [
      { value: '70 млрд.', label: 'гледания/ден' },
      { value: '2 млрд.', label: 'потребители' },
      { value: '130%', label: 'повече абонати' },
    ],
  },
  {
    name: 'YouTube Long',
    icon: 'ri-video-line',
    color: '#FF0000',
    duration: '5–15 мин.',
    frequency: '1–2/седмица',
    bestFor: 'SEO, авторитет, дългосрочен ранк',
    stats: [
      { value: '2-ра', label: 'най-голяма търсачка' },
      { value: '3x', label: 'по-дълъг watch time' },
      { value: '2 г.', label: 'среден живот на видео' },
    ],
  },
];

const STRATEGY_STEPS = [
  {
    step: '01',
    title: 'Аудит и стратегия',
    desc: 'Анализираме бизнеса, конкурентите и аудиторията. Каква платформа? Какъв формат? Каква честота? Всичко зависи от нишата и целите.',
    time: '1–2 дни',
    color: '#3B5BDB',
  },
  {
    step: '02',
    title: 'Сценарий и сториборд',
    desc: 'Писмен сценарий с ключови моменти, послания и CTA. Сториборд за визуална структура. Всичко одобрено преди заснемане.',
    time: '2–3 дни',
    color: '#2F9E44',
  },
  {
    step: '03',
    title: 'Заснемане',
    desc: 'Професионално заснемане с 4K камери, микрофони и осветление. Можем да снимаме в офиса, магазина, ресторанта или на локация.',
    time: '1 ден',
    color: '#E67700',
  },
  {
    step: '04',
    title: 'Монтаж и оптимизация',
    desc: 'Професионален монтаж, цветокорекция, звук и субтитри. Оптимизираме за всяка платформа — TikTok (9:16), YouTube (16:9), Reels (9:16).',
    time: '3–5 дни',
    color: '#C2255C',
  },
  {
    step: '05',
    title: 'Публикуване и реклама',
    desc: 'Публикуваме в оптималните часове. Добавяме хаштагове, описания и тагове. Boost-ваме най-добрите видеа с платени реклами.',
    time: 'Постоянно',
    color: '#7048E8',
  },
];

const CASE_STUDIES = [
  {
    client: 'K-Food Велико Търново',
    url: 'https://k-foodvelikotarnovo.com/',
    platform: 'TikTok + Instagram Reels',
    result: '+280% трафик към сайта',
    detail: 'Серия от 12 TikTok видеа „Как се прави корейска храна" и „Ден в ресторанта". Органичен reach над 150 000 човека. Трафикът към сайта нарасна с 280% за 2 месеца.',
    color: '#E67700',
  },
  {
    client: 'Thalysta',
    url: 'https://thalysta.com/',
    platform: 'YouTube + Instagram Reels',
    result: '+190% онлайн продажби',
    detail: 'Продуктови видеа за бижутата — „Как се прави ръчно изработено бижу" и „Story на Thalysta". YouTube видеата класират в Google за „бижута ръчна изработка".',
    color: '#C2255C',
  },
  {
    client: 'Sunrise Food',
    url: 'https://sunrisefood.eu/',
    platform: 'YouTube Shorts + TikTok',
    result: '+420% brand awareness',
    detail: 'Кратки видеа за гъбите — „От гората до масата" и „Как да приготвите кладница". Серия от 20 Shorts, които събраха над 500 000 гледания.',
    color: '#2F9E44',
  },
];

const MISTAKES = [
  { mistake: 'Без ясен CTA', fix: 'Всяко видео трябва да завършва с конкретен призив: „Посетете ни", „Направете поръчка", „Следвайте ни".', color: '#E8590C' },
  { mistake: 'Лошо качество на звука', fix: 'Зрителите прощават лошо видео, но не и лош звук. Инвестирайте в микрофон — това е приоритет.', color: '#E03131' },
  { mistake: 'Прекалено дълги видеа', fix: 'TikTok: 15–60 сек. YouTube Shorts: до 60 сек. Reels: 15–90 сек. YouTube Long: 5–15 мин. Спазвайте формата.', color: '#7048E8' },
  { mistake: 'Без субтитри', fix: '85% от видеата се гледат без звук. Без субтитри губите повечето зрители.', color: '#2F9E44' },
  { mistake: 'Непостоянство', fix: 'Публикуване 1 видео месечно не работи. Минимум 3–5 седмично за TikTok, 1 за YouTube.', color: '#3B5BDB' },
];

const RELATED = [
  { title: 'TikTok и YouTube реклами', to: '/blog/tiktok-youtube-reklama-tarnovo', cat: 'Реклами', color: 'bg-rose-50 text-rose-700' },
  { title: 'Видео продукция Търново', to: '/video-produkciya-veliko-tarnovo', cat: 'Услуга', color: 'bg-rose-50 text-rose-700' },
  { title: 'Дигитален маркетинг Търново', to: '/digitalen-marketing-veliko-tarnovo', cat: 'Ръководство', color: 'bg-emerald-50 text-emerald-700' },
  { title: 'Реклама Велико Търново', to: '/reklama-veliko-tarnovo', cat: 'Реклама', color: 'bg-orange-50 text-orange-700' },
  { title: 'Безплатен SEO за #1', to: '/blog/bezplaten-seo-nomer-edno-google', cat: 'SEO', color: 'bg-sky-50 text-sky-700' },
  { title: 'Видео за НПО', to: '/npo-video', cat: 'НПО', color: 'bg-rose-50 text-rose-700' },
];

export default function VideoMarketingBiznesTarnovoPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    document.title = 'Видео маркетинг за бизнеси в Търново — стратегия 2026 | ТАВОРА ЕООД';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', 'Видео маркетинг за бизнеси в Търново — TikTok, YouTube, Reels, Shorts. Пълна стратегия за 2026. Реални case studies. ТАВОРА ЕООД.');
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://imashnujnoto.com/blog/video-marketing-biznes-tarnovo');

    const id = 'schema-video-marketing';
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) { el = document.createElement('script'); el.id = id; el.type = 'application/ld+json'; document.head.appendChild(el); }
    el.textContent = JSON.stringify(ARTICLE_SCHEMA);

    const faqId = 'schema-video-marketing-faq';
    let faqEl = document.getElementById(faqId) as HTMLScriptElement | null;
    if (!faqEl) { faqEl = document.createElement('script'); faqEl.id = faqId; faqEl.type = 'application/ld+json'; document.head.appendChild(faqEl); }
    faqEl.textContent = JSON.stringify(FAQ_SCHEMA);

    return () => {
      ['schema-video-marketing', 'schema-video-marketing-faq'].forEach((sid) => { const e = document.getElementById(sid); if (e) e.remove(); });
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
              <span className="text-[#1C1C1E]/65">Видео маркетинг Търново</span>
            </nav>

            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span className="text-[10px] px-2.5 py-1 rounded-full font-medium bg-rose-50 text-rose-700">Видео маркетинг</span>
              <span className="text-[10px] px-2.5 py-1 rounded-full font-medium bg-orange-50 text-orange-700">TikTok + YouTube</span>
              <span className="text-[10px] text-[#1C1C1E]/70">13 мин. четене · 5 Май 2026</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-light text-[#1C1C1E] leading-tight mb-5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Видео маркетинг
              <br />
              <em className="text-[#1C1C1E]/60">за бизнеси в Търново —</em>
              <br />
              <strong className="font-light">стратегия за доминиране 2026.</strong>
            </h1>

            <p className="text-sm md:text-base text-[#1C1C1E]/65 max-w-2xl leading-relaxed mb-6">
              <strong className="text-[#1C1C1E]">82% от интернет трафика</strong> е видео.
              TikTok, YouTube Shorts и Instagram Reels са каналите, които могат да изстрелят бизнеса ви в Търново.
              Ето пълната стратегия — от нулата до резултатите.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link to="/video-produkciya-veliko-tarnovo" className="px-6 py-3 bg-[#1C1C1E] text-white text-sm rounded-full hover:bg-[#1C1C1E]/80 transition-all cursor-pointer whitespace-nowrap">
                Видео услуга Търново →
              </Link>
              <Link to="/kontakt" className="px-6 py-3 border border-[#1C1C1E]/12 text-[#1C1C1E]/65 text-sm rounded-full hover:border-[#1C1C1E]/30 hover:text-[#1C1C1E] transition-all cursor-pointer whitespace-nowrap">
                Безплатна консултация
              </Link>
            </div>
          </div>
        </section>

        {/* ── HERO IMAGE ── */}
        <div className="w-full h-[280px] md:h-[420px] overflow-hidden">
          <img
            src="https://readdy.ai/api/search-image?query=video%20marketing%20strategy%20professional%20camera%20filming%20crew%20modern%20office%20content%20creation%20studio%20setup%20clean%20minimal%20white%20background%20Bulgaria%20Tarnovo%20business%202026&width=1400&height=420&seq=video-marketing-hero-img&orientation=landscape"
            alt="Видео маркетинг за бизнеси в Търново"
            className="w-full h-full object-cover object-top"
          />
        </div>

        <div className="max-w-4xl mx-auto px-4 md:px-16 py-12 md:py-16">

          {/* ── ВЪВЕДЕНИЕ ── */}
          <section className="mb-14">
            <h2 className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Защо видеото е #1 фактор в момента?
            </h2>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              <strong className="text-[#1C1C1E]">K-Food</strong> направиха серия от 12 TikTok видеа и трафикът към сайта им нарасна с <strong className="text-[#1C1C1E]">280%</strong> за 2 месеца.
              <strong className="text-[#1C1C1E]"> Thalysta</strong> публикуваха YouTube видеа за ръчната изработка на бижутата и онлайн продажбите скочиха с <strong className="text-[#1C1C1E]">190%</strong>.
            </p>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-6">
              Видеото не е опция — то е <strong className="text-[#1C1C1E]">задължителен канал</strong> за всеки бизнес в Търново.
              И не, не е нужно да сте influencer. Нужно е стратегия.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-2xl bg-[#F9F9F7] border border-[#1C1C1E]/6">
              {[
                { value: '82%', label: 'от трафика е видео' },
                { value: '1200%', label: 'повече споделяния' },
                { value: '+280%', label: 'трафик от TikTok' },
                { value: '2 млрд.', label: 'YouTube потребители' },
              ].map((s) => (
                <div key={s.value} className="text-center">
                  <div className="text-xl md:text-2xl font-light text-[#1C1C1E] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{s.value}</div>
                  <div className="text-[10px] text-[#1C1C1E]/65 leading-tight">{s.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ── ФОРМАТИ ── */}
          <section className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[1px] bg-[#1C1C1E]/20 shrink-0" />
              <span className="text-xs text-[#1C1C1E]/60">Формати</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Кой формат е за вашия бизнес?
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {VIDEO_FORMATS.map((format) => (
                <div key={format.name} className="rounded-2xl border border-[#1C1C1E]/8 overflow-hidden">
                  <div className="p-5 border-b border-[#1C1C1E]/6 flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center rounded-xl" style={{ backgroundColor: `${format.color}12` }}>
                      <i className={`${format.icon} text-xl`} style={{ color: format.color }} />
                    </div>
                    <div>
                      <div className="text-base font-medium text-[#1C1C1E]">{format.name}</div>
                      <div className="text-[10px] text-[#1C1C1E]/65">{format.bestFor}</div>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div>
                        <div className="text-[10px] text-[#1C1C1E]/65 mb-0.5">Дължина</div>
                        <div className="text-xs font-medium text-[#1C1C1E]">{format.duration}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-[#1C1C1E]/65 mb-0.5">Честота</div>
                        <div className="text-xs font-medium text-[#1C1C1E]">{format.frequency}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {format.stats.map((stat) => (
                        <div key={stat.label} className="text-center p-2 rounded-xl bg-[#F9F9F7]">
                          <div className="text-base font-light text-[#1C1C1E]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{stat.value}</div>
                          <div className="text-[9px] text-[#1C1C1E]/65 leading-tight">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── СТРАТЕГИЯ ── */}
          <section className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[1px] bg-[#1C1C1E]/20 shrink-0" />
              <span className="text-xs text-[#1C1C1E]/60">Как работим</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              5 стъпки за видео маркетинг.
            </h2>

            <div className="space-y-4">
              {STRATEGY_STEPS.map((s) => (
                <div key={s.step} className="flex items-start gap-4 p-5 rounded-2xl border border-[#1C1C1E]/8 bg-white">
                  <span className="text-2xl font-light shrink-0 leading-none" style={{ fontFamily: "'Cormorant Garamond', serif", color: `${s.color}60` }}>{s.step}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-3 mb-1.5">
                      <h4 className="text-sm font-medium text-[#1C1C1E]">{s.title}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: `${s.color}12`, color: s.color }}>{s.time}</span>
                    </div>
                    <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── КЕЙС СТЪДИТА ── */}
          <section className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[1px] bg-[#1C1C1E]/20 shrink-0" />
              <span className="text-xs text-[#1C1C1E]/60">Реални резултати</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Как видеото промени бизнесите в Търново.
            </h2>

            <div className="space-y-5">
              {CASE_STUDIES.map((cs) => (
                <div key={cs.client} className="rounded-2xl border border-[#1C1C1E]/8 overflow-hidden">
                  <div className="p-5 md:p-7 border-b border-[#1C1C1E]/6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <div>
                        <a href={cs.url} target="_blank" rel="noopener noreferrer nofollow" className="text-base font-medium text-[#1C1C1E] hover:underline">{cs.client}</a>
                        <div className="text-xs text-[#1C1C1E]/65 mt-0.5">{cs.platform}</div>
                      </div>
                      <span className="text-xs px-3 py-1 rounded-full font-medium shrink-0" style={{ backgroundColor: `${cs.color}15`, color: cs.color }}>{cs.result}</span>
                    </div>
                    <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">{cs.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── 5 ГРЕШКИ ── */}
          <section className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[1px] bg-[#1C1C1E]/20 shrink-0" />
              <span className="text-xs text-[#1C1C1E]/60">Грешки</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              5 грешки, които бизнесите правят с видео.
            </h2>

            <div className="space-y-3">
              {MISTAKES.map((item, i) => (
                <div key={item.mistake} className="p-5 rounded-2xl border border-[#1C1C1E]/8 bg-white">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 flex items-center justify-center rounded-full shrink-0 mt-0.5" style={{ backgroundColor: `${item.color}15`, border: `1px solid ${item.color}30` }}>
                      <span className="text-[10px] font-medium" style={{ color: item.color }}>{i + 1}</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[#1C1C1E] mb-1.5">{item.mistake}</div>
                      <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">{item.fix}</p>
                    </div>
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
              Чести въпроси за видео маркетинг.
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

          {/* ── СВЪРЗАНИ ── */}
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
                <div className="text-xs text-white/75 tracking-widest uppercase mb-2">Готови за видео доминиране?</div>
                <div className="text-2xl md:text-3xl font-light leading-tight mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Видео маркетинг за бизнес в Търново
                  <br />
                  <span className="italic text-white/60">от 250 €.</span>
                </div>
                <p className="text-sm text-white/75 max-w-md leading-relaxed">Консултация 50 € — стратегия, идеи и план. Приспада се при договор.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <Link to="/kontakt" className="px-7 py-3.5 bg-white text-[#0A2540] text-sm rounded-full hover:bg-white/90 transition-all cursor-pointer whitespace-nowrap text-center font-medium">Поискайте оферта →</Link>
                <Link to="/video-produkciya-veliko-tarnovo" className="px-7 py-3.5 border border-white/20 text-white/70 text-sm rounded-full hover:border-white/40 hover:text-white transition-all cursor-pointer whitespace-nowrap text-center">Видео услуга Търново</Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SharedFooter />
    </div>
  );
}