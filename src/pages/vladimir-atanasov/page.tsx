import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SharedNav from '@/components/feature/SharedNav';
import SharedFooter from '@/components/feature/SharedFooter';

const MEDIA_MENTIONS = [
  {
    outlet: 'ScoolMedia',
    title: 'Медийната грамотност',
    url: 'https://scoolmedia.com/medijnata-gramotnost-v-30-sek-2/',
    quote: 'Владимир Атанасов за медийната грамотност и значението на дигиталните умения.',
  },
  {
    outlet: 'БНР (Българско национално радио)',
    title: 'Само "Уау" ли е дигиталният свят',
    url: 'https://bnrnews.bg/hristobotev/post/21467/samo-uau-li-e-digitalniyat-svyat',
    quote: 'Разговор за дигиталния маркетинг, AI и бъдещето на онлайн комуникацията.',
  },
  {
    outlet: 'БТА (Българска телеграфна агенция)',
    title: 'Победител в конкурса "Медийната..."',
    url: 'https://www.bta.bg/bg/news/725780-yoanna-zabcheva-vladimir-atanasov-i-vesel-stoyanov-sa-pobediteli-v-konkursa-me',
    quote: 'Йоанна Забчева, Владимир Атанасов и Весел Стоянов са победители в конкурса.',
  },
  {
    outlet: 'bGlobal',
    title: 'Обявиха победителите в конкурса',
    url: 'https://bglobal.bg/111228-obqviha-pobeditelite-v-konkursa-mediinata',
    quote: 'Награди за медийната грамотност и дигиталната комуникация.',
  },
];

const ARTICLES = [
  {
    title: 'SEO оптимизация Велико Търново 2026: пълно ръководство',
    to: '/blog/seo-optimizaciya-tarnovo-2026',
    cat: 'SEO',
    date: '28 Апр 2026',
  },
  {
    title: 'Безплатен SEO за номер 1 в Google — 8 тактики',
    to: '/blog/bezplaten-seo-nomer-edno-google',
    cat: 'SEO',
    date: '5 Май 2026',
  },
  {
    title: 'GEO оптимизация за ChatGPT и Perplexity',
    to: '/blog/geo-ai-tarnovo',
    cat: 'GEO & AI',
    date: '28 Апр 2026',
  },
  {
    title: 'Изработка на сайт Велико Търново 2026',
    to: '/blog/izrabotka-na-sait-tarnovo',
    cat: 'Уеб дизайн',
    date: '28 Апр 2026',
  },
  {
    title: 'Google Business Profile за бизнеси в Търново',
    to: '/blog/google-business-vt',
    cat: 'Локално SEO',
    date: '28 Апр 2026',
  },
  {
    title: 'Видео за НПО Търново — как да разкажете каузата си',
    to: '/blog/video-npo-tarnovo',
    cat: 'Видео продукция',
    date: '28 Апр 2026',
  },
  {
    title: 'Видео маркетинг за бизнеси в Търново',
    to: '/blog/video-marketing-biznes-tarnovo',
    cat: 'Видео маркетинг',
    date: '5 Май 2026',
  },
  {
    title: 'TikTok и YouTube реклами за бизнес в Търново',
    to: '/blog/tiktok-youtube-reklama-tarnovo',
    cat: 'Реклами',
    date: '5 Май 2026',
  },
  {
    title: 'Meta реклами за Търново — Facebook и Instagram',
    to: '/blog/meta-reklami-tarnovo',
    cat: 'Meta реклами',
    date: '28 Апр 2026',
  },
  {
    title: 'E-commerce стратегия за Търново 2026',
    to: '/blog/ecommerce-tarnovo-2026',
    cat: 'E-commerce',
    date: '5 Май 2026',
  },
  {
    title: 'Как да изберете маркетинг агенция в Търново',
    to: '/blog/kak-da-izberete-agenciya-tarnovo',
    cat: 'Сравнение',
    date: '5 Май 2026',
  },
  {
    title: 'Изработка на сайт Велико Търново',
    to: '/blog/izrabotka-na-sait-vt',
    cat: 'Уеб дизайн',
    date: '28 Апр 2026',
  },
];

const KNOWLEDGE = [
  'Дигитален маркетинг',
  'SEO оптимизация',
  'GEO оптимизация',
  'Generative Engine Optimization',
  'AEO — Answer Engine Optimization',
  'Рекламни кампании',
  'Видео маркетинг',
  'Велико Търново',
  'Локално SEO',
  'Schema.org',
  'ChatGPT оптимизация',
  'Perplexity оптимизация',
];

const today = new Date().toISOString().split('T')[0];

const PERSON_SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': 'https://imashnujnoto.com/vladimir-atanasov#person',
      name: 'Владимир Веселинов Атанасов',
      givenName: 'Владимир',
      familyName: 'Атанасов',
      alternateName: 'Владимир Атанасов',
      jobTitle: 'Основател и SEO & GEO специалист',
      description:
        'Основател на ТАВОРА ЕООД — дигитален маркетинг агенция в Велико Търново. Специалист по SEO, GEO оптимизация за AI търсачки, рекламни кампании и видео продукция. Победител в конкурса за медийна грамотност. Автор на 12+ публикации за дигитален маркетинг в България.',
      url: 'https://imashnujnoto.com/vladimir-atanasov',
      image: {
        '@type': 'ImageObject',
        url: 'https://storage.readdy-site.link/project_files/3f265d07-5825-4e88-a58a-44deb287b858/da48e5ce-f462-42cd-876c-d23dc5715d39_P1166249.jpg?v=fa340a713d496c9162eb47555d6e7985',
        width: 600,
        height: 600,
      },
      worksFor: {
        '@type': 'Organization',
        '@id': 'https://imashnujnoto.com/#organization',
        name: 'ТАВОРА ЕООД',
        url: 'https://imashnujnoto.com',
      },
      knowsAbout: KNOWLEDGE,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Велико Търново',
        addressCountry: 'BG',
      },
      alumniOf: [
        { '@type': 'Organization', name: 'Конкурс за медийна грамотност' },
      ],
      sameAs: [
        'https://www.wikidata.org/wiki/Q139801651',
        'https://imashnujnoto.com/ekip',
        'https://scoolmedia.com/medijnata-gramotnost-v-30-sek-2/',
        'https://bnrnews.bg/hristobotev/post/21467/samo-uau-li-e-digitalniyat-svyat',
        'https://www.bta.bg/bg/news/725780-yoanna-zabcheva-vladimir-atanasov-i-vesel-stoyanov-sa-pobediteli-v-konkursa-me',
        'https://bglobal.bg/111228-obqviha-pobeditelite-v-konkursa-mediinata',
        'https://www.facebook.com/profile.php?id=61589264103453',
        'https://www.instagram.com/marketingattavora/',
        'https://www.tiktok.com/@tavoramarketingagency',
        'https://www.youtube.com/@TavoraMarketingAgency',
        'https://share.google/sP3ydTe4iqEO44qua',
        'https://www.linkedin.com/in/vladimir-atanasov-tavora/',
      ],
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Начало', item: 'https://imashnujnoto.com/' },
        { '@type': 'ListItem', position: 2, name: 'Екип', item: 'https://imashnujnoto.com/ekip' },
        { '@type': 'ListItem', position: 3, name: 'Владимир Атанасов', item: 'https://imashnujnoto.com/vladimir-atanasov' },
      ],
    },
    {
      '@type': 'WebPage',
      '@id': 'https://imashnujnoto.com/vladimir-atanasov#webpage',
      url: 'https://imashnujnoto.com/vladimir-atanasov',
      name: 'Владимир Атанасов — SEO & GEO специалист | ТАВОРА ЕООД',
      description:
        'Владимир Атанасов — основател на ТАВОРА ЕООД. SEO и GEO специалист в Велико Търново. Автор на 12+ публикации за дигитален маркетинг. Победител в конкурс за медийна грамотност.',
      inLanguage: 'bg',
      dateModified: today,
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: ['#vladimir-hero', '#vladimir-about']
      },
      isPartOf: { '@id': 'https://imashnujnoto.com/#website' },
      about: { '@id': 'https://imashnujnoto.com/vladimir-atanasov#person' },
    },
  ],
};

export default function VladimirAtanasovPage() {
  useEffect(() => {
    const id = 'schema-vladimir';
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement('script');
      el.id = id;
      el.type = 'application/ld+json';
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(PERSON_SCHEMA);

    document.title = 'Владимир Атанасов — SEO & GEO специалист | ТАВОРА ЕООД';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Владимир Атанасов — основател на ТАВОРА ЕООД. SEO и GEO специалист в Велико Търново. Автор на 12+ публикации за дигитален маркетинг. Победител в конкурс за медийна грамотност.'
      );
    }
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://imashnujnoto.com/vladimir-atanasov');

    return () => {
      document.getElementById(id)?.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <SharedNav />

      <main className="max-w-4xl mx-auto px-4 md:px-16">
        {/* Hero */}
        <section className="pt-16 pb-14 md:pt-24 md:pb-20">
          <nav aria-label="breadcrumb" className="flex items-center gap-2 text-[11px] text-[#1C1C1E]/65 mb-8">
            <Link to="/" className="hover:text-[#1C1C1E]/60 transition-colors">Начало</Link>
            <i className="ri-arrow-right-s-line text-xs" />
            <Link to="/ekip" className="hover:text-[#1C1C1E]/60 transition-colors">Екип</Link>
            <i className="ri-arrow-right-s-line text-xs" />
            <span className="text-[#1C1C1E]/65">Владимир Атанасов</span>
          </nav>

          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
            <div className="shrink-0">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden bg-[#F9F9F7] border border-[#1C1C1E]/8">
                <img
                  src="https://storage.readdy-site.link/project_files/3f265d07-5825-4e88-a58a-44deb287b858/da48e5ce-f462-42cd-876c-d23dc5715d39_P1166249.jpg?v=fa340a713d496c9162eb47555d6e7985"
                  alt="Владимир Атанасов — SEO и GEO специалист, основател на ТАВОРА ЕООД"
                  className="w-full h-full object-cover object-top"
                  loading="lazy" decoding="async"
                />
              </div>
            </div>

            <div className="flex-1">
              <h1
                className="text-3xl md:text-5xl font-light text-[#1C1C1E] leading-tight mb-3"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Владимир Атанасов
              </h1>
              <div className="text-sm text-[#1C1C1E]/65 mb-5">
                Основател · SEO & GEO специалист · ТАВОРА ЕООД
              </div>

              <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-6 max-w-xl">
                Основател на <Link to="/" className="text-[#0A2540] hover:underline">ТАВОРА ЕООД</Link> —
                дигитален маркетинг агенция в <Link to="/digitalen-marketing-veliko-tarnovo" className="text-[#0A2540] hover:underline">Велико Търново</Link>.
                Специалист по <strong className="text-[#1C1C1E]">SEO оптимизация</strong>,{' '}
                <strong className="text-[#1C1C1E]">GEO за AI търсачки</strong> и рекламни кампании.
                Автор на 12+ публикации за дигитален маркетинг.
                <strong className="text-[#1C1C1E]"> Победител в конкурс за медийна грамотност.</strong>
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {KNOWLEDGE.slice(0, 6).map((k) => (
                  <span
                    key={k}
                    className="text-[10px] px-2.5 py-1 rounded-full bg-[#F9F9F7] border border-[#1C1C1E]/8 text-[#1C1C1E]/65"
                  >
                    {k}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  to="/kontakt"
                  className="px-6 py-3 bg-[#0A2540] text-white text-sm rounded-full hover:bg-[#0A2540]/90 transition-all cursor-pointer whitespace-nowrap"
                >
                  Свържете се →
                </Link>
                <Link
                  to="/blog"
                  className="px-6 py-3 border border-[#1C1C1E]/12 text-[#1C1C1E]/65 text-sm rounded-full hover:border-[#1C1C1E]/30 hover:text-[#1C1C1E] transition-all cursor-pointer whitespace-nowrap"
                >
                  Всички статии
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* About */}
        <section className="py-8 md:py-20 border-t border-[#1C1C1E]/6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-6 h-px bg-[#0A2540]/25" />
            <span className="text-[11px] text-[#1C1C1E]/65 tracking-widest uppercase">За Владимир</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2
                className="text-2xl md:text-3xl font-light text-[#1C1C1E] leading-tight mb-5"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                SEO, GEO и дигитален маркетинг
                <br />
                <span className="italic text-[#0A2540]">от Велико Търново.</span>
              </h2>
              <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
                Владимир Атанасов е основател на <strong className="text-[#1C1C1E]">ТАВОРА ЕООД</strong> —
                агенция за дигитален маркетинг, базирана във Велико Търново.
                Работи с бизнеси от Търново и цяла България, помагайки им да достигнат{' '}
                <strong className="text-[#1C1C1E]">#1 в Google</strong> и в AI търсачките.
              </p>
              <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
                <strong className="text-[#1C1C1E]">Владимир Атанасов</strong> е основател на <strong className="text-[#1C1C1E]">ТАВОРА ЕООД</strong> —
                дигитален маркетинг агенция във <Link to="/digitalen-marketing-veliko-tarnovo" className="text-[#0A2540] hover:underline">Велико Търново</Link>, специализирана в
                SEO оптимизация, GEO за AI търсачки и рекламни кампании.
              </p>
              <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
                Специализира се в <strong className="text-[#1C1C1E]">GEO оптимизация</strong> —
                новият стандарт за 2026, който позиционира бизнесите в отговорите на ChatGPT,
                Perplexity и Google AI Overview.
              </p>
              <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
                Неговата работа включва реални резултати за клиенти като{' '}
                <a href="https://k-foodvelikotarnovo.com/" target="_blank" rel="noopener noreferrer nofollow" className="text-[#0A2540] hover:underline">K-Food</a>,{' '}
                <a href="https://sunrisefood.eu/" target="_blank" rel="noopener noreferrer nofollow" className="text-[#0A2540] hover:underline">Sunrise Food</a>,{' '}
                <a href="https://thalysta.com/" target="_blank" rel="noopener noreferrer nofollow" className="text-[#0A2540] hover:underline">Thalysta</a>,{' '}
                <a href="https://nmom.bg/" target="_blank" rel="noopener noreferrer nofollow" className="text-[#0A2540] hover:underline">NMOM</a> и{' '}
                <a href="https://budimse.online/" target="_blank" rel="noopener noreferrer nofollow" className="text-[#0A2540] hover:underline">Budimse</a> —
                всички с верифицируеми #1 позиции.
              </p>
            </div>

            <div className="space-y-5">
              <div className="p-5 rounded-2xl border border-[#1C1C1E]/8 bg-[#FAFAFA]">
                <div className="text-[10px] text-[#1C1C1E]/65 tracking-widest uppercase mb-3">Контакт</div>
                <div className="space-y-2.5">
                  <a href="mailto:tavoraagency@gmail.com" className="flex items-center gap-2 text-sm text-[#1C1C1E]/60 hover:text-[#0A2540] transition-colors">
                    <i className="ri-mail-line text-[#0A2540]/40 text-xs" />
                    tavoraagency@gmail.com
                  </a>
                  <button onClick={() => window.location.href = 'tel:+359885189724'} className="flex items-center gap-2 text-sm text-[#1C1C1E]/60 hover:text-[#0A2540] transition-colors cursor-pointer bg-transparent border-0 p-0">
                    <i className="ri-phone-line text-[#0A2540]/40 text-xs" />
                    Позвъни ни
                  </button>
                  <div className="flex items-center gap-2 text-sm text-[#1C1C1E]/65">
                    <i className="ri-map-pin-line text-[#0A2540]/40 text-xs" />
                    Велико Търново, България
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-[#1C1C1E]/8 bg-[#FAFAFA]">
                <div className="text-[10px] text-[#1C1C1E]/65 tracking-widest uppercase mb-3">Експертиза</div>
                <div className="flex flex-wrap gap-2">
                  {KNOWLEDGE.map((k) => (
                    <span
                      key={k}
                      className="text-[10px] px-2.5 py-1 rounded-full bg-white border border-[#1C1C1E]/8 text-[#1C1C1E]/65"
                    >
                      {k}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-[#1C1C1E]/8 bg-[#FAFAFA]">
                <div className="text-[10px] text-[#1C1C1E]/65 tracking-widest uppercase mb-3">Компания</div>
                <Link
                  to="/"
                  className="text-sm font-medium text-[#1C1C1E] hover:text-[#0A2540] transition-colors mb-1 block"
                >
                  ТАВОРА ЕООД
                </Link>
                <p className="text-xs text-[#1C1C1E]/65 leading-relaxed mb-3">
                  Дигитален маркетинг агенция във Велико Търново.
                  SEO, реклами, видео продукция и изработка на сайтове.
                </p>
                <Link to="/ekip" className="text-xs text-[#0A2540] hover:underline">
                  Целият екип →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Media mentions */}
        <section className="py-8 md:py-20 border-t border-[#1C1C1E]/6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-6 h-px bg-[#0A2540]/25" />
            <span className="text-[11px] text-[#1C1C1E]/65 tracking-widest uppercase">Медии</span>
          </div>
          <h2
            className="text-2xl md:text-3xl font-light text-[#1C1C1E] leading-tight mb-8"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Публикации в медиите.
          </h2>

          <div className="space-y-4">
            {MEDIA_MENTIONS.map((m) => (
              <a
                key={m.url}
                href={m.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="group flex flex-col sm:flex-row sm:items-start gap-4 p-5 rounded-2xl border border-[#1C1C1E]/8 bg-white hover:border-[#0A2540]/15 transition-all cursor-pointer"
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-xl border border-[#0A2540]/10 bg-[#0A2540]/4 shrink-0">
                  <i className="ri-newspaper-line text-[#0A2540]/50 text-sm" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] text-[#0A2540]/60 font-medium tracking-wide uppercase">
                      {m.outlet}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-[#1C1C1E] group-hover:text-[#0A2540] transition-colors mb-1">
                    {m.title}
                  </div>
                  <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">{m.quote}</p>
                </div>
                <i className="ri-external-link-line text-[#1C1C1E]/25 group-hover:text-[#0A2540]/40 text-sm shrink-0" />
              </a>
            ))}
          </div>
        </section>

        {/* Articles */}
        <section className="py-8 md:py-20 border-t border-[#1C1C1E]/6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-6 h-px bg-[#0A2540]/25" />
            <span className="text-[11px] text-[#1C1C1E]/65 tracking-widest uppercase">Блог</span>
          </div>
          <h2
            className="text-2xl md:text-3xl font-light text-[#1C1C1E] leading-tight mb-3"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Статии от Владимир.
          </h2>
          <p className="text-sm text-[#1C1C1E]/65 mb-8 max-w-lg">
            12+ публикации за SEO, GEO, реклами, видео маркетинг и дигитален маркетинг в Търново.
            Всяка статия е оптимизирана за Google и AI търсачки.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ARTICLES.map((a) => (
              <Link
                key={a.to}
                to={a.to}
                className="group flex items-center justify-between gap-3 p-4 rounded-xl border border-[#1C1C1E]/8 bg-white hover:border-[#0A2540]/15 transition-all cursor-pointer"
              >
                <div className="min-w-0">
                  <div className="text-[10px] text-[#1C1C1E]/70 mb-1">{a.cat} · {a.date}</div>
                  <div className="text-sm text-[#1C1C1E]/70 group-hover:text-[#0A2540] transition-colors leading-snug truncate">
                    {a.title}
                  </div>
                </div>
                <i className="ri-arrow-right-line text-[#1C1C1E]/20 group-hover:text-[#0A2540]/40 text-sm shrink-0 group-hover:translate-x-1 transition-transform" />
              </Link>
            ))}
          </div>

          <div className="mt-6">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-sm text-[#0A2540] hover:underline cursor-pointer"
            >
              Всички статии в блога
              <i className="ri-arrow-right-line text-xs" />
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section className="py-8 md:py-20 border-t border-[#1C1C1E]/6">
          <div className="p-7 md:p-10 rounded-2xl bg-[#0F1F35] text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="text-xs text-white/75 tracking-widest uppercase mb-2">
                  Работете с Владимир
                </div>
                <div
                  className="text-2xl md:text-3xl font-light leading-tight mb-2"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  SEO + GEO + Реклами + Видео
                  <br />
                  <span className="italic text-white/60">за вашия бизнес в Търново.</span>
                </div>
                <p className="text-sm text-white/75 max-w-md leading-relaxed">
                  Консултация 50 € — анализ на сайта, конкурентите и стратегия.
                  Приспада се при договор.
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
                  to="/uslugi"
                  className="px-7 py-3.5 border border-white/20 text-white/70 text-sm rounded-full hover:border-white/40 hover:text-white transition-all cursor-pointer whitespace-nowrap text-center"
                >
                  Всички услуги
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SharedFooter />
    </div>
  );
}