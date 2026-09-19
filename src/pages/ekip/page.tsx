import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SharedNav from '@/components/feature/SharedNav';
import SharedFooter from '@/components/feature/SharedFooter';
import LazyVideo from '@/components/feature/LazyVideo';

const vladCredentials = [
  { icon: 'ri-line-chart-line', text: 'Няколко години практика в дигитален маркетинг и ПР' },
  { icon: 'ri-google-line', text: 'Доказани #1 позиции в Google — проверете сами' },
  { icon: 'ri-robot-line', text: 'Работи с AI инструменти в реална клиентска работа' },
  { icon: 'ri-tv-line', text: 'Участия в телевизии и конкурси по медийна грамотност' },
];

const nathanCredentials = [
  { icon: 'ri-instagram-line', text: 'Мениджър социални медии — стратегия и съдържание' },
  { icon: 'ri-camera-line', text: 'Участва пред камерата — видео съдържание за бизнеси' },
  { icon: 'ri-tiktok-line', text: 'TikTok и Instagram — органично и платено съдържание' },
  { icon: 'ri-team-line', text: 'Работи директно с клиентите по социалните канали' },
];

const projects = [
  {
    name: 'Sunrise Food',
    url: 'https://sunrisefood.eu/',
    description: 'Изграждане на сайт от нула + SEO оптимизация. Резултат: #1 в Google за "гъби кладница онлайн" за ~3–4 седмици.',
    tag: '#1 Google',
    tagColor: '#1B4332',
  },
  {
    name: 'K-Food Велико Търново',
    url: 'https://k-foodvelikotarnovo.com/',
    description: 'SEO и GEO оптимизация на съществуващ сайт. Резултат: #1 в Google + топ препоръка в ChatGPT за 2–3 месеца.',
    tag: '#1 Google + ChatGPT',
    tagColor: '#8B1A1A',
  },
  {
    name: 'Академика 245',
    url: 'https://akademika245.com/',
    description: 'Видео продукция по проект за домашното насилие. Над 1 000 000 гледания общо с двете НПО организации.',
    tag: '1M+ гледания',
    tagColor: '#0A2540',
  },
  {
    name: 'Амалипе',
    url: 'https://amalipe.bg/',
    description: 'Видео продукция за социални кампании с национален обхват. Милиони импресии в социалните медии.',
    tag: 'Нац. обхват',
    tagColor: '#5B2D8E',
  },
];

const EKIP_SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://imashnujnoto.com/ekip#webpage',
      url: 'https://imashnujnoto.com/ekip',
      name: 'Екипът | ТАВОРА ЕООД — Владимир Атанасов и Натан Петков',
      description: 'Запознайте се с екипа на ТАВОРА ЕООД — Владимир Атанасов (дигитален маркетинг, SEO, GEO) и Натан Петков (социални медии, видео продукция). Реална работа, верифицируеми резултати.',
      inLanguage: 'bg',
      dateModified: '2026-05-05',
      isPartOf: { '@id': 'https://imashnujnoto.com/#website' },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Начало', item: 'https://imashnujnoto.com/' },
          { '@type': 'ListItem', position: 2, name: 'Екип', item: 'https://imashnujnoto.com/ekip' },
        ],
      },
    },
    {
      '@type': 'Person',
      '@id': 'https://imashnujnoto.com/#founder',
      name: 'Владимир Веселинов Атанасов',
      givenName: 'Владимир',
      familyName: 'Атанасов',
      jobTitle: 'Основател, SEO & GEO специалист, Дигитален маркетинг',
      description: 'Основател на ТАВОРА ЕООД. Специалист по дигитален маркетинг, SEO и GEO оптимизация за бизнеси от Велико Търново и цяла България. Участия в телевизии и конкурси по медийна грамотност.',
      url: 'https://imashnujnoto.com/ekip',
      image: 'https://static.readdy.ai/image/658b459fcf05a7723f8029c45615de2f/7ba027e5c67ece54f762f57dda00407f.png',
      worksFor: {
        '@type': 'Organization',
        '@id': 'https://imashnujnoto.com/#organization',
        name: 'ТАВОРА ЕООД',
        legalName: 'ТАВОРА ЕООД',
        url: 'https://imashnujnoto.com',
      },
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Велико Търново',
        addressCountry: 'BG',
      },
      sameAs: [
        'https://www.youtube.com/watch?v=WdUUckZ19jI',
        'https://imashnujnoto.com/ekip',
        'https://imashnujnoto.com',
      ],
      knowsAbout: [
        'SEO оптимизация',
        'GEO оптимизация',
        'Generative Engine Optimization',
        'AEO оптимизация',
        'Дигитален маркетинг',
        'Медийна грамотност',
        'AI инструменти',
        'Рекламни кампании',
        'ChatGPT оптимизация',
        'Perplexity оптимизация',
        'Велико Търново',
        'LocalBusiness Schema',
        'Schema.org',
      ],
    },
    {
      '@type': 'Person',
      '@id': 'https://imashnujnoto.com/#nathan',
      name: 'Натан Петков',
      givenName: 'Натан',
      familyName: 'Петков',
      jobTitle: 'Мениджър социални медии и видео продукция',
      description: 'Мениджър социални медии и видео продукция в ТАВОРА ЕООД. Участва пред камерата за видео продукция за НПО организации и бизнеси.',
      url: 'https://imashnujnoto.com/ekip',
      image: 'https://storage.readdy-site.link/project_files/3f265d07-5825-4e88-a58a-44deb287b858/8d3b4d25-8dde-4da9-aa56-0ccd87c38867_NATAN-PETKOW.jpg?v=b599eefaf2a6b7b8cfbff0e3389d53fa',
      worksFor: {
        '@type': 'Organization',
        '@id': 'https://imashnujnoto.com/#organization',
        name: 'ТАВОРА ЕООД',
        legalName: 'ТАВОРА ЕООД',
        url: 'https://imashnujnoto.com',
      },
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Велико Търново',
        addressCountry: 'BG',
      },
      knowsAbout: [
        'Социални медии',
        'Видео продукция',
        'TikTok',
        'Instagram Reels',
        'Facebook Reels',
        'YouTube Shorts',
        'Съдържание за бизнеси',
        'Видео за НПО',
      ],
    },
  ],
};

export default function EkipPage() {
  useEffect(() => {
    const id = 'schema-ekip';
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement('script');
      el.id = id;
      el.type = 'application/ld+json';
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(EKIP_SCHEMA);

    document.title = 'Екипът | ТАВОРА ЕООД — Владимир Атанасов и Натан Петков';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', 'Запознайте се с екипа на ТАВОРА ЕООД — Владимир Атанасов (дигитален маркетинг, SEO, GEO) и Натан Петков (социални медии, видео продукция). Реална работа, верифицируеми резултати.');

    return () => {
      const existing = document.getElementById(id);
      if (existing) existing.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <SharedNav />

      <main className="max-w-6xl mx-auto px-4 md:px-16 py-8 md:py-24">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 md:mb-10">
          <div className="w-8 h-[1px] bg-[#0A2540]/30 shrink-0" />
          <span className="text-xs text-[#1C1C1E]/60">Екипът</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-14 md:mb-20">
          <h1
            className="text-3xl md:text-5xl font-light text-[#1C1C1E] leading-tight"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Двама души.
            <br />
            <span className="italic text-[#0A2540]">Реална работа.</span>
          </h1>
          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed self-end max-w-md">
            Не сме агенция с 20 служители и красиви презентации. Правим реална работа за реални клиенти — и резултатите са верифицируеми.
          </p>
        </div>

        {/* Team members */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-16 md:mb-24">

          {/* Vladimir */}
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="relative shrink-0">
              <div className="relative rounded-2xl overflow-hidden w-[140px] h-[175px] sm:w-[160px] sm:h-[200px]">
                <img
                  src="https://static.readdy.ai/image/658b459fcf05a7723f8029c45615de2f/7ba027e5c67ece54f762f57dda00407f.png"
                  alt="Владимир Атанасов — дигитален маркетинг и ПР"
                  className="w-full h-full object-cover object-top grayscale"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1E]/15 to-transparent" />
              </div>
            </div>
            <div className="flex-1">
              <div
                className="text-xl font-light text-[#1C1C1E] mb-0.5"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Владимир Атанасов
              </div>
              <div className="text-xs text-[#0A2540]/60 mb-4 tracking-wide">
                Дигитален маркетинг · SEO · GEO · Реклами
              </div>
              <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-5">
                Няколко години в дигитален маркетинг и ПР. Знам какво искат хората — защото работя с тях директно.
                Всичко, което преподавам, го правя и за реални клиенти. Не теория от книги.
              </p>
              <div className="space-y-2.5 mb-5">
                {vladCredentials.map((cred) => (
                  <div key={cred.text} className="flex items-center gap-2.5">
                    <div className="w-6 h-6 flex items-center justify-center rounded-full border border-[#1C1C1E]/10 shrink-0">
                      <i className={`${cred.icon} text-xs text-[#0A2540]/60`} />
                    </div>
                    <span className="text-xs text-[#1C1C1E]/65">{cred.text}</span>
                  </div>
                ))}
              </div>

              {/* YouTube embed — lazy loaded */}
              <div className="rounded-xl overflow-hidden border border-[#1C1C1E]/8 mb-4">
                <div className="px-4 pt-4 pb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-4 h-4 flex items-center justify-center">
                      <i className="ri-youtube-fill text-[#FF0000] text-sm" />
                    </div>
                    <span className="text-[10px] text-[#1C1C1E]/65 font-medium">Интервю — медийна грамотност</span>
                  </div>
                </div>
                <div className="px-4 pb-4">
                  <LazyVideo
                    type="youtube"
                    src="WdUUckZ19jI"
                    thumbnailUrl="https://img.youtube.com/vi/WdUUckZ19jI/maxresdefault.jpg"
                    title="Интервю с Владимир Атанасов — медийна грамотност"
                    watchUrl="https://www.youtube.com/watch?v=WdUUckZ19jI"
                    watchLabel="Гледайте в YouTube →"
                  />
                </div>
              </div>

              <a
                href="https://www.google.com/search?q=%D0%92%D0%BB%D0%B0%D0%B4%D0%B8%D0%BC%D0%B8%D1%80+%D0%90%D1%82%D0%B0%D0%BD%D0%B0%D1%81%D0%BE%D0%B2+%D0%BC%D0%B5%D0%B4%D0%B8%D0%B9%D0%BD%D0%B0+%D0%B3%D1%80%D0%B0%D0%BC%D0%BE%D1%82%D0%BD%D0%BE%D1%81%D1%82"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="inline-flex items-center gap-1.5 text-xs text-[#0A2540]/65 hover:text-[#0A2540] transition-colors cursor-pointer"
              >
                <i className="ri-search-line text-xs" />
                Потърсете в Google →
              </a>
            </div>
          </div>

          {/* Nathan */}
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="relative shrink-0">
              <div className="relative rounded-2xl overflow-hidden w-[140px] h-[175px] sm:w-[160px] sm:h-[200px] bg-[#F0EDE8]">
                <img
                  src="https://storage.readdy-site.link/project_files/3f265d07-5825-4e88-a58a-44deb287b858/8d3b4d25-8dde-4da9-aa56-0ccd87c38867_NATAN-PETKOW.jpg?v=b599eefaf2a6b7b8cfbff0e3389d53fa"
                  alt="Натан Петков — мениджър социални медии и видео"
                  className="w-full h-full object-cover object-top grayscale"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1E]/15 to-transparent" />
              </div>
            </div>
            <div className="flex-1">
              <div
                className="text-xl font-light text-[#1C1C1E] mb-0.5"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Натан Петков
              </div>
              <div className="text-xs text-[#0A2540]/60 mb-4 tracking-wide">
                Социални медии · Видео · TikTok · Instagram
              </div>
              <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-5">
                Мениджър социални медии — стратегия, съдържание и управление. Участва пред камерата.
                Снимаме с професионална техника за най-добри резултати. Знае как работи алгоритъмът, защото го тества всеки ден.
              </p>
              <div className="space-y-2.5 mb-5">
                {nathanCredentials.map((cred) => (
                  <div key={cred.text} className="flex items-center gap-2.5">
                    <div className="w-6 h-6 flex items-center justify-center rounded-full border border-[#1C1C1E]/10 shrink-0">
                      <i className={`${cred.icon} text-xs text-[#0A2540]/60`} />
                    </div>
                    <span className="text-xs text-[#1C1C1E]/65">{cred.text}</span>
                  </div>
                ))}
              </div>

              {/* Facebook Reel embed — lazy loaded */}
              <div className="rounded-xl overflow-hidden border border-[#1C1C1E]/8 mb-4">
                <div className="px-4 pt-4 pb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-4 h-4 flex items-center justify-center">
                      <i className="ri-facebook-circle-fill text-[#1877F2] text-sm" />
                    </div>
                    <span className="text-[10px] text-[#1C1C1E]/65 font-medium">Reel — проект за домашното насилие · Академика 245</span>
                  </div>
                </div>
                <div className="px-4 pb-4">
                  <LazyVideo
                    type="facebook"
                    src="https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Freel%2F4228757277440339&show_text=false&width=560"
                    thumbnailUrl="https://storage.readdy-site.link/project_files/3f265d07-5825-4e88-a58a-44deb287b858/8d3b4d25-8dde-4da9-aa56-0ccd87c38867_NATAN-PETKOW.jpg?v=b599eefaf2a6b7b8cfbff0e3389d53fa"
                    title="Натан Петков — видео продукция за Академика 245"
                    watchUrl="https://www.facebook.com/reel/4228757277440339"
                    watchLabel="Гледайте в Facebook →"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-[#1C1C1E]/70">
                <i className="ri-camera-3-line text-xs" />
                <span>Снимаме с проф. камери, микрофони и осветление</span>
              </div>
            </div>
          </div>
        </div>

        {/* Projects */}
        <div className="mb-14 md:mb-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-[1px] bg-[#0A2540]/30 shrink-0" />
            <span className="text-xs text-[#1C1C1E]/60">Реални проекти — проверете ги</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {projects.map((p) => (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="flex items-start gap-4 p-4 rounded-xl border border-[#1C1C1E]/8 bg-[#F9F9F9] hover:border-[#1C1C1E]/20 transition-all duration-200 cursor-pointer group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-sm font-medium text-[#1C1C1E] group-hover:text-[#0A2540] transition-colors">{p.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full text-white shrink-0" style={{ backgroundColor: p.tagColor }}>{p.tag}</span>
                  </div>
                  <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">{p.description}</p>
                </div>
                <div className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
                  <i className="ri-external-link-line text-[#1C1C1E]/25 group-hover:text-[#0A2540]/65 transition-colors text-sm" />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 p-6 md:p-8 rounded-2xl border border-[#1C1C1E]/8 bg-[#F9F9F9]">
          <div>
            <div
              className="text-xl md:text-2xl font-light text-[#1C1C1E] mb-1"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Искате да работите с нас?
            </div>
            <p className="text-sm text-[#1C1C1E]/65">Свържете се директно — отговаряме лично.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
            <Link
              to="/blog"
              className="px-6 py-3 border border-[#1C1C1E]/12 text-[#1C1C1E]/65 text-sm rounded-full hover:border-[#0A2540]/30 hover:text-[#0A2540] transition-all cursor-pointer whitespace-nowrap text-center"
            >
              SEO Блог →
            </Link>
            <Link
              to="/kontakt"
              className="px-6 py-3 bg-[#0A2540] text-white text-sm rounded-full hover:bg-[#0A2540]/90 transition-all cursor-pointer whitespace-nowrap text-center"
            >
              Поискайте оферта →
            </Link>
            <Link
              to="/kurs"
              className="px-6 py-3 border border-[#1C1C1E]/12 text-[#1C1C1E]/65 text-sm rounded-full hover:border-[#0A2540]/30 hover:text-[#0A2540] transition-all cursor-pointer whitespace-nowrap text-center"
            >
              Виж курса
            </Link>
          </div>
        </div>
      </main>

      <SharedFooter />
    </div>
  );
}
