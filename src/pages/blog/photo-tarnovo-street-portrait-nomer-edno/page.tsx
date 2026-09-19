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
      '@id': 'https://imashnujnoto.com/blog/photo-tarnovo-street-portrait-nomer-edno#article',
      headline: 'Как Photo Tarnovo стана #1 в Google за street portrait фотография в Търново',
      description: 'Реален SEO казус: как Photo Tarnovo — street portrait фотограф на крепостта Царевец — стигна до #1 в Google за "photo tarnovo" и "street portrait Veliko Tarnovo". Пълна методология, Google Business Profile, локално SEO и оптимизация за туристически бизнес.',
      author: { '@type': 'Person', name: 'Владимир Атанасов', url: 'https://imashnujnoto.com/ekip' },
      publisher: { '@type': 'Organization', '@id': 'https://imashnujnoto.com/#organization', name: 'ТАВОРА ЕООД', url: 'https://imashnujnoto.com', logo: { '@type': 'ImageObject', url: 'https://storage.readdy-site.link/project_files/3f265d07-5825-4e88-a58a-44deb287b858/ec0eb8c9-c502-4cf5-bee4-657c996896dc_--.png?v=3d4829c108a0d31cdde2da513964de19' } },
      datePublished: '2026-06-20',
      dateModified: today,
      inLanguage: 'bg',
      url: 'https://imashnujnoto.com/blog/photo-tarnovo-street-portrait-nomer-edno',
      wordCount: 2400,
      timeRequired: 'PT9M',
      image: { '@type': 'ImageObject', url: 'https://readdy.ai/api/search-image?query=Tsarevets%20Fortress%20Veliko%20Tarnovo%20Bulgaria%20street%20portrait%20photographer%20golden%20hour%20light%20ancient%20stone%20walls%20traveler%20portrait%20authentic%20moment%20professional%20camera%20setup&width=1200&height=630&seq=blog-photo-tarnovo-1-hero&orientation=landscape', width: 1200, height: 630 },
      mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://imashnujnoto.com/blog/photo-tarnovo-street-portrait-nomer-edno' },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Начало', item: 'https://imashnujnoto.com/' },
          { '@type': 'ListItem', position: 2, name: 'Блог', item: 'https://imashnujnoto.com/blog' },
          { '@type': 'ListItem', position: 3, name: 'Photo Tarnovo — #1 в Google за street portrait', item: 'https://imashnujnoto.com/blog/photo-tarnovo-street-portrait-nomer-edno' },
        ],
      },
      keywords: 'Photo Tarnovo, street portrait, Велико Търново, Царевец, Google Business Profile, локално SEO, фотография, туристически бизнес, SEO казус',
      mentions: [
        { '@type': 'Organization', name: 'ТАВОРА ЕООД', url: 'https://imashnujnoto.com' },
        { '@type': 'Organization', name: 'Photo Tarnovo', url: 'https://phototarnovo.com' },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Как Photo Tarnovo стигна до #1 в Google за street portrait фотография?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Комбинация от няколко фактора: напълно оптимизиран Google Business Profile с редовни снимки и отзиви от туристи, структуриран сайт с правилна SEO архитектура (Schema.org за LocalBusiness и Photographer), качествено съдържание на български и английски език, активни линкове от авторитетни източници като Tripadvisor и Google Maps, и последователно изграждане на локален авторитет чрез отзиви — 4.9 рейтинг с над 37 ревюта.',
          },
        },
        {
          '@type': 'Question',
          name: 'Защо локалният SEO е важен за туристически фотограф в Търново?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Над 90% от туристите търсят услуги на място чрез Google Maps. За фотограф на Царевец, който работи без предварително записване, да бъде #1 при търсене "photo tarnovo" или "street portrait Veliko Tarnovo" означава директен поток от клиенти — туристи, които са на крепостта в момента и търсят фотограф. Локалното SEO превръща случайните минувачи в плащащи клиенти.',
          },
        },
        {
          '@type': 'Question',
          name: 'Какво прави Google Business Profile задължителен за локален фотограф?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'GBP поставя бизнеса директно в Google Maps и Local Pack — първите резултати, които туристите виждат при локално търсене. За Photo Tarnovo, GBP профилът включва точна локация (Царевец), работно време (10:00 до залез), редовни снимки на портрети, 37+ ревюта с рейтинг 4.9 и директна връзка през WhatsApp. Това е безплатният инструмент, който носи органичен туристически трафик.',
          },
        },
        {
          '@type': 'Question',
          name: 'Колко време отнема на нов фотографски бизнес да стигне до #1 в Google?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'За Photo Tarnovo процесът отне няколко седмици целенасочена работа. Ключовите фактори за бърз резултат бяха: 1) вече съществуващо физическо присъствие на Царевец (Google верифицира локацията бързо), 2) последователно събиране на ревюта от всеки клиент чрез QR код, 3) технически изряден сайт със Schema.org маркиране и 4) съдържание на два езика, което Google индексира и за български, и за английски търсения.',
          },
        },
      ],
    },
  ],
};

const FAQ_ITEMS = [
  {
    q: 'Как Photo Tarnovo стигна до #1 в Google за street portrait фотография?',
    a: 'Комбинация от няколко фактора: напълно оптимизиран Google Business Profile с редовни снимки и отзиви от туристи, структуриран сайт с правилна SEO архитектура (Schema.org за LocalBusiness и Photographer), качествено съдържание на български и английски език, активни линкове от авторитетни източници като Tripadvisor и Google Maps, и последователно изграждане на локален авторитет чрез отзиви — 4.9 рейтинг с над 37 ревюта.',
  },
  {
    q: 'Защо локалният SEO е важен за туристически фотограф в Търново?',
    a: 'Над 90% от туристите търсят услуги на място чрез Google Maps. За фотограф на Царевец, който работи без предварително записване, да бъде #1 при търсене "photo tarnovo" или "street portrait Veliko Tarnovo" означава директен поток от клиенти — туристи, които са на крепостта в момента и търсят фотограф. Локалното SEO превръща случайните минувачи в плащащи клиенти.',
  },
  {
    q: 'Какво прави Google Business Profile задължителен за локален фотограф?',
    a: 'GBP поставя бизнеса директно в Google Maps и Local Pack — първите резултати, които туристите виждат при локално търсене. За Photo Tarnovo, GBP профилът включва точна локация (Царевец), работно време (10:00 до залез), редовни снимки на портрети, 37+ ревюта с рейтинг 4.9 и директна връзка през WhatsApp. Това е безплатният инструмент, който носи органичен туристически трафик.',
  },
  {
    q: 'Колко време отнема на нов фотографски бизнес да стигне до #1 в Google?',
    a: 'За Photo Tarnovo процесът отне няколко седмици целенасочена работа. Ключовите фактори за бърз резултат бяха: 1) вече съществуващо физическо присъствие на Царевец (Google верифицира локацията бързо), 2) последователно събиране на ревюта от всеки клиент чрез QR код, 3) технически изряден сайт със Schema.org маркиране и 4) съдържание на два езика, което Google индексира и за български, и за английски търсения.',
  },
];

const RELATED = [
  { title: 'Как да изберете маркетинг агенция в Търново', to: '/blog/kak-da-izberete-agenciya-tarnovo', cat: 'Статия' },
  { title: 'Google Business Profile — задължително за всеки бизнес в Търново', to: '/blog/google-business-vt', cat: 'Статия' },
  { title: 'GEO оптимизация — как да сте #1 в ChatGPT и Perplexity', to: '/blog/geo-ai-tarnovo', cat: 'Статия' },
  { title: 'SEO оптимизация Велико Търново 2026', to: '/blog/seo-optimizaciya-tarnovo-2026', cat: 'Ръководство' },
];

export default function PhotoTarnovoStreetPortraitNomerEdnoPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    document.title = 'Photo Tarnovo — #1 в Google за street portrait Търново | ТАВОРА ЕООД';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', 'SEO казус: как Photo Tarnovo стана #1 в Google за "photo tarnovo" и "street portrait Veliko Tarnovo". Методология, Google Business Profile, локално SEO за туристически фотограф.');
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://imashnujnoto.com/blog/photo-tarnovo-street-portrait-nomer-edno');

    const id = 'schema-photo-tarnovo-1';
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
            <span className="text-[#1C1C1E]/65">Photo Tarnovo — #1 в Google</span>
          </nav>

          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className="text-[10px] px-2.5 py-1 rounded-full font-medium bg-amber-50 text-amber-700">SEO казус</span>
            <span className="text-[10px] px-2.5 py-1 rounded-full font-medium bg-rose-50 text-rose-700">Фотография</span>
            <span className="text-[10px] text-[#1C1C1E]/70">9 мин. четене · 20 Юни 2026</span>
          </div>

          <h1
            className="text-3xl md:text-5xl font-light text-[#1C1C1E] leading-tight mb-5"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Как Photo Tarnovo стана #1 в Google
            <br />
            <em className="text-[#1C1C1E]/60">за street portrait фотография в Търново</em>
          </h1>

          <p className="text-sm md:text-base text-[#1C1C1E]/65 max-w-2xl leading-relaxed mb-6">
            Реален SEO казус — как{' '}
            <a href="https://phototarnovo.com/" target="_blank" rel="noopener noreferrer" className="text-[#0A2540] hover:underline"><strong>Photo Tarnovo</strong></a>, street portrait фотограф на крепостта Царевец, стигна до #1 в Google за ключови локални търсения. Без рекламен бюджет — само стратегия.
          </p>

          <div className="flex items-center gap-3 text-xs text-[#1C1C1E]/65">
            <span>Владимир Атанасов · ТАВОРА ЕООД</span>
            <span>·</span>
            <span>20 Юни 2026</span>
          </div>
        </div>
      </section>

      {/* HERO IMAGE */}
      <div className="w-full h-[280px] md:h-[420px] overflow-hidden">
        <img
          src="https://readdy.ai/api/search-image?query=Tsarevets%20Fortress%20Veliko%20Tarnovo%20Bulgaria%20golden%20hour%20street%20portrait%20photography%20young%20traveler%20getting%20portrait%20taken%20ancient%20stone%20walls%20warm%20Balkan%20light%20professional%20camera%20relaxed%20natural%20posing&width=1400&height=420&seq=blog-photo-tarnovo-1-hero-img&orientation=landscape"
          alt="Photo Tarnovo — street portrait фотограф на Царевец, Велико Търново, #1 в Google"
          className="w-full h-full object-cover object-top"
          loading="eager"
        />
      </div>

      <main className="max-w-3xl mx-auto px-4 md:px-8 py-12 md:py-16">

        {/* INTRO */}
        <p className="text-base text-[#1C1C1E]/60 leading-relaxed mb-12 border-l-2 border-[#0A2540]/20 pl-4">
          Туристическият бизнес в Търново има едно огромно предимство: локацията. Но повечето собственици не знаят как да превърнат локацията в Google ранкинг.
          Този казус показва как <a href="https://phototarnovo.com/" target="_blank" rel="noopener noreferrer" className="text-[#0A2540] hover:underline">Photo Tarnovo</a> го направи — и как всеки локален бизнес може да го повтори.
        </p>

        {/* SECTION 1: Контекст */}
        <section className="mb-14">
          <h2
            className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-5"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Контекст: street portrait фотограф на Царевец
          </h2>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
            Photo Tarnovo не е типичното фотографско студио. Това е street portrait бизнес, който работи директно на крепостта Царевец — най-посещаваната туристическа локация във Велико Търново. Няма физически офис, няма студио, няма предварителни резервации. Клиентите са туристи, които минават покрай главния вход на крепостта, виждат setup-а и спират за 5-10 минутен портрет.
          </p>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
            Предизвикателството беше ясно: когато турист потърси „photographer Veliko Tarnovo" или „photo tarnovo" в Google, Photo Tarnovo трябваше да бъде първият резултат. Не втори, не трети — първи. Защото в туристическия бизнес всяка секунда има значение. Ако туристът не те намери веднага, той продължава напред.
          </p>

          <div className="p-5 rounded-2xl bg-[#F9F9F7] border border-[#1C1C1E]/6 mb-4">
            <div className="text-xs font-medium text-[#1C1C1E]/65 mb-3 tracking-wide uppercase">Трите ключови предимства на бизнес модела:</div>
            <div className="space-y-3">
              {[
                { label: 'Уникална локация', desc: 'Царевец е едно от най-фотографираните места в България. Да си там физически е огромно конкурентно предимство, което Google разпознава чрез геолокация.' },
                { label: 'Моментална доставка', desc: 'Снимките се получават чрез QR код за под 5 минути. Това създава моментално удовлетворение и висок процент на ревюта — ключов ранкинг фактор.' },
                { label: 'Двуезично съдържание', desc: 'Сайтът работи на български и английски. Google индексира и двете версии, което удвоява шансовете за ранк при международни туристически търсения.' },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <div className="w-5 h-5 flex items-center justify-center rounded-full border border-[#1C1C1E]/20 shrink-0 mt-0.5">
                    <i className="ri-arrow-right-line text-[8px] text-[#1C1C1E]/50" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-[#1C1C1E]">{item.label}</span>
                    <span className="text-sm text-[#1C1C1E]/65"> — {item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 2: SEO стратегията */}
        <section className="mb-14">
          <h2
            className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-5"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            SEO стратегията, която изстреля Photo Tarnovo на #1
          </h2>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
            Когато започнахме работа с Photo Tarnovo, сайтът беше нов и нямаше никаква видимост в Google. Нямаше съдържание, нямаше беклинкове, нямаше авторитет. Но имаше нещо, което повечето нови бизнеси нямат: физическа локация на едно от най-търсените места в България.
          </p>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
            В рамките на няколко седмици приложихме следната методология. Първо — пълна техническа SEO оптимизация на <a href="https://phototarnovo.com/" target="_blank" rel="noopener noreferrer" className="text-[#0A2540] hover:underline">phototarnovo.com</a>: Schema.org маркиране за LocalBusiness и Photographer, оптимизирани мета тагове, канонични URL-ове, breadcrumb структура и мобилна адаптация. Второ — Google Business Profile с точна геолокация (Царевец, Велико Търново 5000), професионални снимки и редовно обновяване.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {[
              { icon: 'ri-code-line', title: 'Schema.org маркиране', desc: 'LocalBusiness + Photographer schema с геокоординати на Царевец. Google веднага разпозна бизнеса като локален доставчик на фотографски услуги.', color: '#E67700' },
              { icon: 'ri-map-pin-line', title: 'Google Business Profile', desc: 'Пълно попълнен профил с 15+ снимки, работно време, WhatsApp връзка. 4.9 рейтинг с 37+ ревюта от реални туристи.', color: '#2F9E44' },
              { icon: 'ri-global-line', title: 'Двуезично SEO', desc: 'Съдържание на английски и български. Таргетиране на "photo tarnovo", "street portrait Veliko Tarnovo", "фотограф Царевец".', color: '#7048E8' },
              { icon: 'ri-chat-3-line', title: 'Ревюта от всеки клиент', desc: 'QR код система — всеки турист получава линк към Google ревю заедно със снимките си. Естествен поток от 37+ автентични отзива.', color: '#C2255C' },
            ].map((item) => (
              <div key={item.title} className="p-5 rounded-2xl border border-[#1C1C1E]/8 bg-white">
                <div className="w-9 h-9 flex items-center justify-center rounded-xl mb-3" style={{ backgroundColor: `${item.color}12` }}>
                  <i className={`${item.icon} text-base`} style={{ color: item.color }} />
                </div>
                <h4 className="text-sm font-medium text-[#1C1C1E] mb-1.5">{item.title}</h4>
                <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3: Съдържателна стратегия */}
        <section className="mb-14">
          <h2
            className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-5"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Съдържателната стратегия — блог, който ранква
          </h2>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
            Една от най-подценяваните SEO тактики за локален бизнес е блогът. Повечето собственици мислят, че блогът е за новини. Но блогът е за ключови думи. Всяка статия е нова страница, която Google може да индексира и ранква за конкретна заявка.
          </p>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
            За Photo Tarnovo създадохме целеви блог съдържание, което отговаря на реални въпроси, които туристите задават: „къде са най-добрите места за портрети в Търново" и „каква е разликата между студиен и уличен портрет". Статията{' '}
            <a href="https://phototarnovo.com/blog/best-portrait-locations-veliko-tarnovo" target="_blank" rel="noopener noreferrer" className="text-[#0A2540] hover:underline">Best Portrait Locations Veliko Tarnovo</a>{' '}
            ранква за английски търсения, а{' '}
            <a href="https://phototarnovo.com/blog/street-vs-studio-portrait" target="_blank" rel="noopener noreferrer" className="text-[#0A2540] hover:underline">Street vs Studio Portrait</a>{' '}
            привлича фотографски ентусиасти и потенциални клиенти.
          </p>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
            Ключовият принцип тук е прост: всяка статия трябва да отговаря на конкретен въпрос, който потенциален клиент задава в Google. Не „за нас", не „нашата философия" — а „как да получа портрет на Царевец", „колко струва", „как работи процесът". Вижте{' '}
            <a href="https://phototarnovo.com/#how-it-works" target="_blank" rel="noopener noreferrer" className="text-[#0A2540] hover:underline">How it Works</a> страницата
            на Photo Tarnovo — тя отговаря на тези въпроси в три стъпки и точно затова Google я показва в резултатите.
          </p>
        </section>

        {/* SECTION 4: Резултатите */}
        <section className="mb-14">
          <h2
            className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-5"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Резултатите: #1 за „photo tarnovo"
          </h2>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
            След прилагане на пълната SEO стратегия,{' '}
            <a href="https://phototarnovo.com/" target="_blank" rel="noopener noreferrer" className="text-[#0A2540] hover:underline">Photo Tarnovo</a> постигна #1 позиция в Google за ключовата фраза „photo tarnovo", както и високи позиции за „street portrait Veliko Tarnovo" и „photographer Tsarevets". В Google Maps, бизнесът се показва в Local Pack с рейтинг 4.9 и 37+ ревюта — което директно води до повече клиенти на крепостта.
          </p>

          <div className="p-6 rounded-2xl bg-[#F9F9F7] border border-[#1C1C1E]/6 mb-4">
            <div className="text-xs font-medium text-[#1C1C1E]/65 mb-4 tracking-wide uppercase">Ключови метрики след оптимизацията:</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: 'ri-trophy-line', value: '#1', label: 'Google ранк за "photo tarnovo"', color: '#E67700' },
                { icon: 'ri-star-line', value: '4.9', label: 'Рейтинг в Google Maps', color: '#2F9E44' },
                { icon: 'ri-user-smile-line', value: '2000+', label: 'Портрета на Царевец', color: '#7048E8' },
              ].map((item) => (
                <div key={item.label} className="text-center p-4 rounded-xl border border-[#1C1C1E]/6 bg-white">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full mx-auto mb-2" style={{ backgroundColor: `${item.color}12` }}>
                    <i className={`${item.icon} text-lg`} style={{ color: item.color }} />
                  </div>
                  <div className="text-2xl font-light text-[#1C1C1E] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{item.value}</div>
                  <div className="text-[11px] text-[#1C1C1E]/65 leading-tight">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
            Важно уточнение: това не е резултат от платена реклама. Целият трафик е органичен — от Google Search и Google Maps. Туристите сами намират Photo Tarnovo, когато търсят фотограф на Царевец. Това е устойчив модел, който не зависи от рекламен бюджет.
          </p>
        </section>

        {/* SECTION: За Photo Tarnovo */}
        <section className="mb-14 p-6 rounded-2xl bg-[#F9F9F7] border border-[#1C1C1E]/6">
          <h2
            className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-5"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            За Photo Tarnovo
          </h2>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
            Photo Tarnovo е street portrait фотограф, който работи ежедневно на крепостта Царевец във Велико Търново — от 10:00 до залез, без нужда от предварително записване. С над 2000 портрета и 5+ години опит на локацията, това е уникален туристически бизнес, който предлага моментални портрети чрез QR код доставка за под 5 минути.
          </p>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
            Разгледайте{' '}
            <a href="https://phototarnovo.com/packages" target="_blank" rel="noopener noreferrer" className="text-[#0A2540] hover:underline">пакетите и цените</a>,{' '}
            <a href="https://phototarnovo.com/#gallery" target="_blank" rel="noopener noreferrer" className="text-[#0A2540] hover:underline">галерията с портрети</a> или{' '}
            <a href="https://phototarnovo.com/#reviews" target="_blank" rel="noopener noreferrer" className="text-[#0A2540] hover:underline">ревютата от туристи</a> — включително двойки от Милано, соло пътешественици от Лондон и backpackers от Берлин, които споделят опита си.
          </p>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
            Можете да научите повече на{' '}
            <a href="https://phototarnovo.com/" target="_blank" rel="noopener noreferrer" className="text-[#0A2540] hover:underline">официалния сайт на Photo Tarnovo</a>{' '}
            или да разгледате{' '}
            <a href="https://phototarnovo.com/blog/best-portrait-locations-veliko-tarnovo" target="_blank" rel="noopener noreferrer" className="text-[#0A2540] hover:underline">техния блог</a>{' '}
            за локации и съвети за портретна фотография.
          </p>
        </section>

        {/* SECTION: Полезни ресурси */}
        <section className="mb-14 pt-10 border-t border-[#1C1C1E]/6">
          <div className="text-xs text-[#1C1C1E]/60 mb-5">Полезни ресурси</div>
          <h2
            className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-6"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Разгледайте Photo Tarnovo
          </h2>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: 'Photo Tarnovo — начална страница', href: 'https://phototarnovo.com/' },
              { label: 'How it Works — как работи процесът', href: 'https://phototarnovo.com/#how-it-works' },
              { label: 'Packages — пакети и цени', href: 'https://phototarnovo.com/packages' },
              { label: 'Gallery — галерия с портрети', href: 'https://phototarnovo.com/#gallery' },
              { label: 'Reviews — ревюта от туристи', href: 'https://phototarnovo.com/#reviews' },
              { label: 'FAQ — често задавани въпроси', href: 'https://phototarnovo.com/#faq' },
              { label: 'Best Portrait Locations Veliko Tarnovo', href: 'https://phototarnovo.com/blog/best-portrait-locations-veliko-tarnovo' },
              { label: 'Street vs Studio Portrait', href: 'https://phototarnovo.com/blog/street-vs-studio-portrait' },
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
            Въпроси за SEO
            <br />
            <em className="text-[#1C1C1E]/65">и локален бизнес.</em>
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
          <div className="text-xs text-[#1C1C1E]/60 mb-5">Свързани статии и услуги</div>
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
              <div className="text-xs text-white/75 tracking-widest uppercase mb-2">Искате #1 в Google за вашия бизнес?</div>
              <div
                className="text-2xl md:text-3xl font-light leading-tight mb-2"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Консултация за локално SEO
                <br />
                <span className="italic text-white/60">Велико Търново — 50 €</span>
              </div>
              <p className="text-sm text-white/75 max-w-md leading-relaxed">
                Ще анализираме текущото ви онлайн присъствие и ще ви дадем конкретни стъпки за изкачване в Google — както направихме за Photo Tarnovo.
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