import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SharedNav from '@/components/feature/SharedNav';
import SharedFooter from '@/components/feature/SharedFooter';

const today = new Date().toISOString().split('T')[0];

const ARTICLE_SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      '@id': 'https://imashnujnoto.com/blog/lokalen-vs-masov-marketing#article',
      headline: 'Защо локалният маркетинг е различен от масовия маркетинг',
      description: 'Фундаменталните разлики между национални кампании и локален маркетинг. Локално SEO, Google Maps, потребителско намерение и авторитет на бизнеса — с реален казус от уелнес сектора.',
      author: { '@type': 'Person', name: 'Владимир Атанасов', url: 'https://imashnujnoto.com/ekip' },
      publisher: { '@type': 'Organization', '@id': 'https://imashnujnoto.com/#organization', name: 'ТАВОРА ЕООД', url: 'https://imashnujnoto.com', logo: { '@type': 'ImageObject', url: 'https://storage.readdy-site.link/project_files/3f265d07-5825-4e88-a58a-44deb287b858/ec0eb8c9-c502-4cf5-bee4-657c996896dc_--.png?v=3d4829c108a0d31cdde2da513964de19' } },
      datePublished: '2026-06-12',
      dateModified: today,
      inLanguage: 'bg',
      url: 'https://imashnujnoto.com/blog/lokalen-vs-masov-marketing',
      wordCount: 2800,
      timeRequired: 'PT11M',
      image: { '@type': 'ImageObject', url: 'https://readdy.ai/api/search-image?query=local%20marketing%20vs%20national%20mass%20marketing%20comparison%20illustration%20contrasting%20approaches%20small%20business%20local%20storefront%20vs%20large%20billboard%20digital%20screen%20analytical%20concept%20clean%20minimal%20white%20background&width=1200&height=630&seq=blog-lokalen-vs-masov-hero&orientation=landscape', width: 1200, height: 630 },
      mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://imashnujnoto.com/blog/lokalen-vs-masov-marketing' },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Начало', item: 'https://imashnujnoto.com/' },
          { '@type': 'ListItem', position: 2, name: 'Блог', item: 'https://imashnujnoto.com/blog' },
          { '@type': 'ListItem', position: 3, name: 'Локален vs Масов маркетинг', item: 'https://imashnujnoto.com/blog/lokalen-vs-masov-marketing' },
        ],
      },
      keywords: 'локален маркетинг, масов маркетинг, локално SEO, Google Maps, потребителско намерение, авторитет на бизнеса, дигитален маркетинг, Велико Търново',
      mentions: [
        { '@type': 'Organization', name: 'ТАВОРА ЕООД', url: 'https://imashnujnoto.com' },
        { '@type': 'Organization', name: 'NP Massage Studio', url: 'https://npmassagestudio.com' },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Каква е основната разлика между локален и масов маркетинг?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Основната разлика е в мащаба и подхода. Масовият маркетинг се опитва да достигне до максимално широка аудитория с едно послание — например телевизионна реклама или национална онлайн кампания. Локалният маркетинг се фокусира върху хора в конкретен географски район (град, квартал) с послание, съобразено с местния контекст. Локалният маркетинг е по-ефективен за малки бизнеси, защото достига до хора, които реално могат да посетят обекта.',
          },
        },
        {
          '@type': 'Question',
          name: 'Защо локалното SEO е различно от общото SEO?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Локалното SEO се фокусира върху географски-специфични търсения. Докато общото SEO оптимизира за ключови думи без локация, локалното SEO добавя град, квартал или регион. То включва Google Business Profile оптимизация, локални цитирания в директории, локално-фокусирано съдържание и отзиви. Конкуренцията е много по-малка — вместо да се борите с целия интернет за „масаж", вие се борите само с бизнесите във вашия град за „масаж Велико Търново".',
          },
        },
        {
          '@type': 'Question',
          name: 'Как Google Maps влияе на локалния маркетинг?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Google Maps е критичен за локалния маркетинг. Когато потребител търси услуга „близо до мен" или в конкретен град, Google показва Local Pack — трите бизнеса, които са най-близо и имат най-добре оптимизиран профил. За да се появите там, трябва: точен адрес, правилна категория, актуални снимки, скорошни отзиви и активен Google Business Profile. Това е безплатен трафик, който много бизнеси пренебрегват.',
          },
        },
        {
          '@type': 'Question',
          name: 'Как потребителското намерение се различава при локално търсене?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'При локално търсене намерението е много по-конкретно и ориентирано към действие. Човек, който търси „масажно студио Търново цени", е много по-близо до резервация от този, който търси „ползи от масажа". Локалното търсене има значително по-висок процент на конверсия, защото потребителят е в режим на вземане на решение, а не на проучване.',
          },
        },
      ],
    },
  ],
};

const FAQ_ITEMS = [
  {
    q: 'Каква е основната разлика между локален и масов маркетинг?',
    a: 'Основната разлика е в мащаба и подхода. Масовият маркетинг се опитва да достигне до максимално широка аудитория с едно послание — например телевизионна реклама или национална онлайн кампания. Локалният маркетинг се фокусира върху хора в конкретен географски район (град, квартал) с послание, съобразено с местния контекст. Локалният маркетинг е по-ефективен за малки бизнеси, защото достига до хора, които реално могат да посетят обекта.',
  },
  {
    q: 'Защо локалното SEO е различно от общото SEO?',
    a: 'Локалното SEO се фокусира върху географски-специфични търсения. Докато общото SEO оптимизира за ключови думи без локация, локалното SEO добавя град, квартал или регион. То включва Google Business Profile оптимизация, локални цитирания в директории, локално-фокусирано съдържание и отзиви. Конкуренцията е много по-малка — вместо да се борите с целия интернет за „масаж", вие се борите само с бизнесите във вашия град за „масаж Велико Търново".',
  },
  {
    q: 'Как Google Maps влияе на локалния маркетинг?',
    a: 'Google Maps е критичен за локалния маркетинг. Когато потребител търси услуга „близо до мен" или в конкретен град, Google показва Local Pack — трите бизнеса, които са най-близо и имат най-добре оптимизиран профил. За да се появите там, трябва: точен адрес, правилна категория, актуални снимки, скорошни отзиви и активен Google Business Profile. Това е безплатен трафик, който много бизнеси пренебрегват.',
  },
  {
    q: 'Как потребителското намерение се различава при локално търсене?',
    a: 'При локално търсене намерението е много по-конкретно и ориентирано към действие. Човек, който търси „масажно студио Търново цени", е много по-близо до резервация от този, който търси „ползи от масажа". Локалното търсене има значително по-висок процент на конверсия, защото потребителят е в режим на вземане на решение, а не на проучване.',
  },
];

const RELATED = [
  { title: 'Как локалните бизнеси изграждат устойчиво онлайн присъствие', to: '/blog/lokalen-biznes-ustoichivo-online-prisastvie', cat: 'Статия' },
  { title: 'Маркетингови наблюдения от уелнес сектора', to: '/blog/marketing-nablyudeniya-masazhni-uslugi', cat: 'Статия' },
  { title: 'Google Business Profile — задължително за Търново', to: '/blog/google-business-vt', cat: 'Статия' },
  { title: 'SEO оптимизация Велико Търново 2026', to: '/blog/seo-optimizaciya-tarnovo-2026', cat: 'Ръководство' },
];

export default function LokalenVsMasovMarketingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    document.title = 'Защо локалният маркетинг е различен от масовия маркетинг | ТАВОРА ЕООД';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', 'Фундаменталните разлики между национални кампании и локален маркетинг. Локално SEO, Google Maps, потребителско намерение — с реален казус от уелнес сектора.');
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://imashnujnoto.com/blog/lokalen-vs-masov-marketing');

    const id = 'schema-lokalen-vs-masov';
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) { el = document.createElement('script'); el.id = id; el.type = 'application/ld+json'; document.head.appendChild(el); }
    el.textContent = JSON.stringify(ARTICLE_SCHEMA);

    return () => { const e = document.getElementById(id); if (e) e.remove(); };
  }, []);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <SharedNav />

      {/* HERO */}
      <section className="w-full bg-[#F9F9F7] border-b border-[#1C1C1E]/6 py-8 md:py-20 px-4 md:px-16">
        <div className="max-w-4xl mx-auto">
          <nav aria-label="breadcrumb" className="flex items-center gap-2 text-[11px] text-[#1C1C1E]/65 mb-6">
            <Link to="/" className="hover:text-[#0A2540] transition-colors">Начало</Link>
            <i className="ri-arrow-right-s-line text-xs" />
            <Link to="/blog" className="hover:text-[#0A2540] transition-colors">Блог</Link>
            <i className="ri-arrow-right-s-line text-xs" />
            <span className="text-[#1C1C1E]/65">Локален vs Масов маркетинг</span>
          </nav>

          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className="text-[10px] px-2.5 py-1 rounded-full font-medium bg-amber-50 text-amber-700">Локален маркетинг</span>
            <span className="text-[10px] px-2.5 py-1 rounded-full font-medium bg-sky-50 text-sky-700">Стратегия</span>
            <span className="text-[10px] text-[#1C1C1E]/70">11 мин. четене · 12 Юни 2026</span>
          </div>

          <h1
            className="text-3xl md:text-5xl font-light text-[#1C1C1E] leading-tight mb-5"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Защо локалният маркетинг
            <br />
            <em className="text-[#1C1C1E]/60">е различен от масовия</em>
          </h1>

          <p className="text-sm md:text-base text-[#1C1C1E]/65 max-w-2xl leading-relaxed mb-6">
            Фундаменталните разлики между национални кампании и локален маркетинг. Защо подходите, които работят за големите брандове, често не работят за малкия бизнес — и обратното. С реален казус от работата ни с <strong className="text-[#1C1C1E]">NP Massage Studio</strong>.
          </p>

          <div className="flex items-center gap-3 text-xs text-[#1C1C1E]/65">
            <span>Владимир Атанасов · ТАВОРА ЕООД</span>
            <span>·</span>
            <span>12 Юни 2026</span>
          </div>
        </div>
      </section>

      {/* HERO IMAGE */}
      <div className="w-full h-[280px] md:h-[420px] overflow-hidden">
        <img
          src="https://readdy.ai/api/search-image?query=local%20marketing%20vs%20national%20mass%20marketing%20comparison%20illustration%20contrasting%20approaches%20small%20business%20local%20storefront%20vs%20large%20billboard%20digital%20screen%20analytical%20concept%20clean%20minimal%20white%20background&width=1400&height=420&seq=blog-lokalen-vs-masov-hero-img&orientation=landscape"
          alt="Локален маркетинг vs масов маркетинг — фундаменталните разлики"
          className="w-full h-full object-cover object-top"
          loading="eager"
        />
      </div>

      <main className="max-w-3xl mx-auto px-4 md:px-8 py-12 md:py-16">

        {/* INTRO */}
        <p className="text-base text-[#1C1C1E]/60 leading-relaxed mb-12 border-l-2 border-[#0A2540]/20 pl-4">
          Една от най-честите грешки, които виждаме при малките бизнеси, е опитът да копират маркетинговите стратегии на големите компании.
          Но локалният маркетинг работи по фундаментално различен начин. Ето защо.
        </p>

        {/* SECTION 1: Сравнение */}
        <section className="mb-14">
          <h2
            className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-5"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Два напълно различни подхода
          </h2>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-6">
            Когато Coca-Cola пуска нова кампания, тя не се интересува от това дали някой във Велико Търново ще я види и веднага ще отиде до магазина. Тя се интересува от мащаб — милиони импресии, бранд разпознаваемост, дългосрочно изграждане на асоциации. Това е масов маркетинг.
          </p>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
            Когато едно масажно студио в Търново прави маркетинг, целта е коренно различна: да достигне до хора, които са на 5-10 минути път и които търсят масаж днес или утре. Това е локален маркетинг.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <div className="p-5 rounded-2xl border border-[#1C1C1E]/8 bg-white">
              <div className="text-xs font-medium text-[#1C1C1E]/65 tracking-widest uppercase mb-3">Масов маркетинг</div>
              <div className="space-y-2">
                {[
                  'Целева аудитория: милиони',
                  'Канали: ТВ, национални медии, мащабни дигитални кампании',
                  'Метрики: импресии, обхват, brand awareness',
                  'Бюджет: от 50 000 € нагоре',
                  'Време до резултат: месеци',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <i className="ri-close-line text-[#C2255C] text-xs mt-0.5 shrink-0" />
                    <span className="text-xs text-[#1C1C1E]/65 leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-5 rounded-2xl border border-[#1C1C1E]/8 bg-white" style={{ borderColor: '#2F9E4430', backgroundColor: '#2F9E4406' }}>
              <div className="text-xs font-medium text-[#1C1C1E]/65 tracking-widest uppercase mb-3">Локален маркетинг</div>
              <div className="space-y-2">
                {[
                  'Целева аудитория: хора в радиус на 5-20 км',
                  'Канали: Google Maps, локално SEO, GBP, локални Facebook групи',
                  'Метрики: заявки, резервации, обаждания, посещения',
                  'Бюджет: от 200 € месечно',
                  'Време до резултат: седмици',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <i className="ri-check-line text-[#2F9E44] text-xs mt-0.5 shrink-0" />
                    <span className="text-xs text-[#1C1C1E]/65 leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Локално SEO vs общо SEO */}
        <section className="mb-14">
          <h2
            className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-5"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Локално SEO — различна игра, различни правила
          </h2>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
            Много хора бъркат SEO оптимизацията с локалното SEO. Разликата е фундаментална. При общото SEO се борите с целия интернет за вниманието на Google. При локалното SEO — само с бизнесите във вашия град.
          </p>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
            Ето конкретен пример: ако търсите „масаж", Google ще ви покаже резултати от цял свят — Уикипедия статии, здравни портали, големи вериги. Ако търсите „масаж Велико Търново", Google ще ви покаже бизнесите в Търново, които предлагат масажи. Разликата в конкуренцията е от милиони страници до десетина бизнеса.
          </p>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
            За локалния бизнес, ключовите фактори за локално SEO са:
          </p>

          <div className="space-y-3 mb-6">
            {[
              { label: 'Google Business Profile', desc: 'Най-важният фактор. Профилът трябва да е напълно попълнен и активен.' },
              { label: 'Локални ключови думи в съдържанието', desc: 'Не просто „масаж", а „масаж в Търново", „студио за масажи Велико Търново", „спортен масаж Павликени".' },
              { label: 'Цитирания в локални директории', desc: 'Регистрация в български бизнес директории, локални портали, браншови каталози с точен NAP (Name, Address, Phone).' },
              { label: 'Отзиви', desc: 'Количеството, качеството и скоростта на отзивите в Google директно влияят на локалния ранк.' },
              { label: 'Локално съдържание', desc: 'Блог статии за местни събития, field-specific съвети, локални казуси.' },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-3">
                <div className="w-4 h-4 flex items-center justify-center rounded-full border border-[#2F9E44]/30 shrink-0 mt-0.5">
                  <i className="ri-check-line text-[9px] text-[#2F9E44]" />
                </div>
                <div>
                  <span className="text-sm font-medium text-[#1C1C1E]">{item.label}</span>
                  <span className="text-sm text-[#1C1C1E]/65"> — {item.desc}</span>
                </div>
              </div>
            ))}
          </div>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
            Практически пример: страницата за <a href="https://npmassagestudio.com/uslugi/sporten-masazh" target="_blank" rel="noopener noreferrer" className="text-[#0A2540] hover:underline">спортен масаж на NP Massage Studio</a> е оптимизирана така, че да отговаря на конкретни локални заявки — не просто „спортен масаж", а „спортен масаж Велико Търново" и „спортен масаж Павликени". Това е разликата между общо и локално SEO на практика.
          </p>
        </section>

        {/* SECTION 3: Google Maps */}
        <section className="mb-14">
          <h2
            className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-5"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Google Maps — фронтовата линия на локалния маркетинг
          </h2>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
            Когато потребител отвори Google Maps и напише „масаж", резултатите, които вижда, зависят от три неща: близост, релевантност и активност. Google показва бизнесите, които са физически най-близо до потребителя, които са най-релевантни на заявката и които са най-активни (скорошни отзиви, публикации, снимки).
          </p>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
            Това е мястото, където локалният маркетинг има огромно предимство пред масовия. Онлайн магазин не може да се появи в Google Maps, когато някой търси „масаж близо до мен". Но масажно студио с добре оптимизиран Google Business Profile — може. За пример, <a href="https://npmassagestudio.com/kontakti" target="_blank" rel="noopener noreferrer" className="text-[#0A2540] hover:underline">локациите на NP Massage Studio</a> са оптимизирани с точни адреси, Google Maps embed и отделни профили за всеки град.
          </p>

          <div className="p-6 rounded-2xl bg-[#F9F9F7] border border-[#1C1C1E]/6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#E67700]/10">
                <i className="ri-map-pin-line text-sm text-[#E67700]" />
              </div>
              <span className="text-sm font-medium text-[#1C1C1E]">Как работи Local Pack в Google</span>
            </div>

            <p className="text-xs text-[#1C1C1E]/65 leading-relaxed mb-3">
              Когато търсите локална услуга в Google, над стандартните резултати се появява така нареченият Local Pack — три бизнеса с карта, рейтинг и основна информация. Тези три позиции получават над 60% от кликовете за локални търсения.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { rank: '#1', pct: '~35%', desc: 'от кликовете' },
                { rank: '#2', pct: '~17%', desc: 'от кликовете' },
                { rank: '#3', pct: '~10%', desc: 'от кликовете' },
              ].map((item) => (
                <div key={item.rank} className="p-3 rounded-xl bg-white border border-[#1C1C1E]/8 text-center">
                  <div className="text-xs font-medium text-[#1C1C1E]/65 mb-1">Позиция {item.rank}</div>
                  <div className="text-xl font-light text-[#1C1C1E] mb-0.5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{item.pct}</div>
                  <div className="text-[10px] text-[#1C1C1E]/65">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 4: Потребителско намерение */}
        <section className="mb-14">
          <h2
            className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-5"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Потребителското намерение — ключовата разлика
          </h2>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
            Най-голямата разлика между локалния и масовия маркетинг е в намерението на потребителя. При масовия маркетинг, вие се опитвате да създадете нужда у хора, които не търсят активно вашия продукт. При локалния маркетинг, вие отговаряте на хора, които вече са решили, че искат вашата услуга, и активно я търсят.
          </p>

          <div className="overflow-x-auto mb-6">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#1C1C1E]/10">
                  <th className="text-left py-3 pr-4 text-[#1C1C1E]/65 font-medium">Аспект</th>
                  <th className="text-left py-3 px-4 text-[#1C1C1E]/65 font-medium">Масов маркетинг</th>
                  <th className="text-left py-3 pl-4 text-[#1C1C1E]/65 font-medium">Локален маркетинг</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { aspect: 'Потребителско намерение', mass: 'Ниско — създавате нужда', local: 'Високо — отговаряте на нужда' },
                  { aspect: 'Път до конверсия', mass: 'Дълъг — осведоменост → интерес → желание → действие', local: 'Кратък — търсене → сравнение → резервация' },
                  { aspect: 'Тип съдържание', mass: 'Бранд истории, емоционални послания', local: 'Цени, услуги, локация, отзиви' },
                  { aspect: 'Ключови думи', mass: 'Общи термини без локация', local: 'Услуга + град/квартал' },
                  { aspect: 'Конкуренция', mass: 'Целият интернет', local: 'Бизнеси в радиус на 5-10 км' },
                ].map((row) => (
                  <tr key={row.aspect} className="border-b border-[#1C1C1E]/5">
                    <td className="py-3 pr-4 font-medium text-[#1C1C1E]">{row.aspect}</td>
                    <td className="py-3 px-4 text-[#1C1C1E]/65">{row.mass}</td>
                    <td className="py-3 pl-4 text-[#2F9E44]">{row.local}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
            Тази разлика в намерението означава, че локалният маркетинг има значително по-висок процент на конверсия. Човек, който търси „масажно студио Търново цени" в Google, е много по-близо до резервация от този, който вижда вашата Facebook реклама, докато скролва.
          </p>
        </section>

        {/* SECTION 5: Авторитет */}
        <section className="mb-14">
          <h2
            className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-5"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Авторитетът на бизнеса — как се изгражда локално
          </h2>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
            Масовият маркетинг изгражда авторитет чрез мащаб — реклами в национални медии, спонсорства на големи събития, celebrity endorsements. Локалният маркетинг изгражда авторитет чрез присъствие в местната общност.
          </p>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
            За локален бизнес авторитетът се изгражда чрез:
          </p>

          <div className="space-y-4 mb-6">
            {[
              { icon: 'ri-star-line', title: 'Отзиви и репутация', desc: 'Най-важният сигнал за локален авторитет. Бизнес с 50+ отзива и среден рейтинг 4.8+ има огромно предимство пред нов бизнес без отзиви.' },
              { icon: 'ri-links-line', title: 'Локални цитирания', desc: 'Споменавания в местни медии, бизнес директории и браншови портали. Всяко споменаване е сигнал към Google, че бизнесът е легитимен.' },
              { icon: 'ri-building-2-line', title: 'Физическо присъствие', desc: 'Бизнес с реален адрес, който може да бъде посетен, има предимство пред онлайн-only конкуренти в локалните резултати.' },
              { icon: 'ri-time-line', title: 'История и последователност', desc: 'Бизнес, който съществува от години и поддържа активен онлайн профил, получава предимство пред новорегистрираните.' },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#7048E8]/8 shrink-0">
                  <i className={`${item.icon} text-sm text-[#7048E8]`} />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-[#1C1C1E] mb-1">{item.title}</h4>
                  <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 6: Казус NP Massage Studio */}
        <section className="mb-14">
          <h2
            className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-5"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Казус: локален маркетинг за масажно студио
          </h2>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
            <a href="https://npmassagestudio.com" target="_blank" rel="noopener noreferrer" className="text-[#0A2540] hover:underline">NP Massage Studio</a> е добър пример за прилагане на принципите на локалния маркетинг. Студиото работи в два града — Велико Търново и Павликени — което създава интересен маркетингов сценарий. Всеки град има различна динамика, различна конкуренция и различен тип клиенти.
          </p>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
            Вместо да използват един универсален подход, маркетингът е структуриран около конкретни локации: отделни страници за всяка услуга, отделни страници за всеки град, локално-фокусирано съдържание и Google Business Profile за всяка локация. Това позволява на студиото да бъде откриваемо и в двете локации независимо.
          </p>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
            Конкретен пример: страницата за <a href="https://npmassagestudio.com/uslugi/klasicheski-masazh" target="_blank" rel="noopener noreferrer" className="text-[#0A2540] hover:underline">класически масаж</a> и страницата за <a href="https://npmassagestudio.com/uslugi/aromaterapiya" target="_blank" rel="noopener noreferrer" className="text-[#0A2540] hover:underline">ароматерапия</a> са оптимизирани за различни типове клиентски заявки. Първата таргетира хора с физически дискомфорт, втората — хора, търсещи релаксация. Това е локален маркетинг в действие: всяка страница отговаря на конкретна нужда в конкретна локация.
          </p>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
            Ключовият извод от този казус е: за локален бизнес с повече от една локация, всяка локация се третира като отделен маркетингов обект. Това, което работи в голям град като Търново, не е същото като това, което работи в по-малък град като Павликени. Маркетинговата стратегия трябва да отразява тази разлика.
          </p>

          <div className="p-5 rounded-2xl bg-[#F9F9F7] border border-[#1C1C1E]/6">
            <div className="text-xs font-medium text-[#1C1C1E]/65 mb-3 tracking-wide uppercase">Какво можем да научим от този подход:</div>
            <div className="space-y-2">
              {[
                'Отделни локационни страници с уникално съдържание, адрес и Google Maps embed за всяка локация.',
                'Google Business Profile профили за всяка локация с локални телефони, снимки и отзиви.',
                'Цените са ясно публикувани — без скриване. Това е ключово за локалния маркетинг, където клиентът сравнява бързо.',
                'Лесна резервация — бутон за контакт на всяка страница, телефонен номер видим без скролване.',
              ].map((item, i) => (
                <div key={item} className="flex items-start gap-2.5">
                  <span className="text-[10px] font-medium text-[#1C1C1E]/40 w-4 shrink-0 mt-0.5">{i + 1}.</span>
                  <span className="text-xs text-[#1C1C1E]/65 leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 7: Ключови изводи */}
        <section className="mb-14 p-6 rounded-2xl bg-[#F9F9F7] border border-[#1C1C1E]/6">
          <h2
            className="text-xl font-light text-[#1C1C1E] mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Шест неща, които локалният бизнес трябва да прави различно
          </h2>

          <div className="space-y-3">
            {[
              'Не харчете пари за национален обхват. Локалният бизнес не се нуждае от клик от София, ако работи само в Търново.',
              'Инвестирайте в Google Business Profile преди всичко друго. Това е вашият най-мощен безплатен маркетингов канал.',
              'Оптимизирайте за „близо до мен" и „в [град]" заявки, не за общи термини. Конкуренцията е драстично по-малка.',
              'Събирайте отзиви систематично. Всеки доволен клиент трябва да бъде помолен за отзив в Google.',
              'Правете локално съдържание. Блог статии, които говорят за вашия град, вашите клиенти, вашите конкретни услуги.',
              'Не копирайте големите брандове. Техните стратегии са проектирани за мащаб, който вие нямате — и не ви трябва.',
            ].map((item, i) => (
              <div key={item} className="flex items-start gap-3">
                <span className="w-6 h-6 flex items-center justify-center rounded-full bg-[#2F9E44]/10 text-[10px] font-medium text-[#2F9E44] shrink-0">{i + 1}</span>
                <span className="text-xs text-[#1C1C1E]/65 leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION: За NP Massage Studio */}
        <section className="mb-14 p-6 rounded-2xl bg-[#F9F9F7] border border-[#1C1C1E]/6">
          <h2
            className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-5"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            За NP Massage Studio
          </h2>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
            NP Massage Studio е локално масажно студио с локации във Велико Търново и Павликени.
            Екипът предлага разнообразни терапии, включително{' '}
            <a href="https://npmassagestudio.com/uslugi/klasicheski-masazh" target="_blank" rel="noopener noreferrer" className="text-[#0A2540] hover:underline">класически масаж</a>,{' '}
            <a href="https://npmassagestudio.com/uslugi/sporten-masazh" target="_blank" rel="noopener noreferrer" className="text-[#0A2540] hover:underline">спортен масаж</a>,{' '}
            <a href="https://npmassagestudio.com/uslugi/anticeluliten-masazh" target="_blank" rel="noopener noreferrer" className="text-[#0A2540] hover:underline">антицелулитен масаж</a>{' '}
            и{' '}
            <a href="https://npmassagestudio.com/uslugi/aromaterapiya" target="_blank" rel="noopener noreferrer" className="text-[#0A2540] hover:underline">ароматерапия</a>.
          </p>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
            Можете да научите повече за студиото на{' '}
            <a href="https://npmassagestudio.com/" target="_blank" rel="noopener noreferrer" className="text-[#0A2540] hover:underline">официалния сайт на NP Massage Studio</a>{' '}
            или да разгледате{' '}
            <a href="https://npmassagestudio.com/blog" target="_blank" rel="noopener noreferrer" className="text-[#0A2540] hover:underline">техния блог</a>.
          </p>
        </section>

        {/* SECTION: Полезни ресурси */}
        <section className="mb-14 pt-10 border-t border-[#1C1C1E]/6">
          <div className="text-xs text-[#1C1C1E]/60 mb-5">Полезни ресурси</div>
          <h2
            className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-6"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Разгледайте NP Massage Studio
          </h2>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: 'NP Massage Studio — начална страница', href: 'https://npmassagestudio.com/' },
              { label: 'Всички услуги', href: 'https://npmassagestudio.com/uslugi' },
              { label: 'Класически масаж', href: 'https://npmassagestudio.com/uslugi/klasicheski-masazh' },
              { label: 'Спортен масаж', href: 'https://npmassagestudio.com/uslugi/sporten-masazh' },
              { label: 'Антицелулитен масаж', href: 'https://npmassagestudio.com/uslugi/anticeluliten-masazh' },
              { label: 'Ароматерапия', href: 'https://npmassagestudio.com/uslugi/aromaterapiya' },
              { label: 'Блог на NP Massage Studio', href: 'https://npmassagestudio.com/blog' },
              { label: 'Контакти и локации', href: 'https://npmassagestudio.com/kontakti' },
            ].map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 p-3 rounded-xl border border-[#1C1C1E]/8 hover:border-[#0A2540]/20 hover:bg-[#F9F9F7] transition-all cursor-pointer group"
                >
                  <i className="ri-external-link-line text-xs text-[#1C1C1E]/30 group-hover:text-[#0A2540] transition-colors" />
                  <span className="text-xs text-[#1C1C1E] group-hover:text-[#0A2540] transition-colors leading-snug">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* FAQ */}
        <section className="mb-14 pt-10 border-t border-[#1C1C1E]/6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-[1px] bg-[#1C1C1E]/20 shrink-0" />
            <span className="text-xs text-[#1C1C1E]/60">Често задавани въпроси</span>
          </div>
          <h2
            className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-8"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Локален vs Масов маркетинг —
            <br />
            <em className="text-[#1C1C1E]/65">често задавани въпроси.</em>
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

        {/* RELATED ARTICLES */}
        <section className="mb-14 pt-10 border-t border-[#1C1C1E]/6">
          <div className="text-xs text-[#1C1C1E]/60 mb-5">Свързани статии</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {RELATED.map((r) => (
              <Link
                key={r.to}
                to={r.to}
                className="group flex items-center justify-between gap-3 p-4 rounded-xl border border-[#1C1C1E]/8 hover:border-[#0A2540]/20 transition-all cursor-pointer"
              >
                <div>
                  <div className="text-[10px] text-[#1C1C1E]/70 mb-1">{r.cat}</div>
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
              <div className="text-xs text-white/75 tracking-widest uppercase mb-2">За локални бизнеси</div>
              <div
                className="text-2xl md:text-3xl font-light leading-tight mb-2"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Локална маркетинг стратегия
                <br />
                <span className="italic text-white/60">за вашия бизнес</span>
              </div>
              <p className="text-sm text-white/75 max-w-md leading-relaxed">
                Консултация 50 € — ще анализираме вашия бизнес и ще ви дадем конкретна локална маркетинг стратегия.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link
                to="/kontakt"
                className="px-7 py-3.5 bg-white text-[#0A2540] text-sm rounded-full hover:bg-white/90 transition-all cursor-pointer whitespace-nowrap text-center font-medium"
              >
                Поискайте консултация →
              </Link>
              <Link
                to="/uslugi/seo-geo"
                className="px-7 py-3.5 border border-white/20 text-white/70 text-sm rounded-full hover:border-white/40 hover:text-white transition-all cursor-pointer whitespace-nowrap text-center"
              >
                SEO & GEO услуга
              </Link>
            </div>
          </div>
        </div>
      </main>

      <SharedFooter />
    </div>
  );
}