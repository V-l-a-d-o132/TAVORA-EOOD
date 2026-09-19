import SharedNav from '@/components/feature/SharedNav';
import SharedFooter from '@/components/feature/SharedFooter';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

const SERVICES = [
  {
    icon: 'ri-code-s-slash-line',
    title: 'Изработка на сайт',
    subtitle: 'от 999 €',
    desc: 'Архитектура, не шаблон. Сайт, оптимизиран за Core Web Vitals, SEO и GEO от първия ден. Без vendor lock-in, без скрити такси.',
    points: ['Core Web Vitals 90+', 'SEO & GEO от старт', 'Без абонамент за CMS', 'Пълен код — ваш'],
    to: '/uslugi/izrabotka-na-sait',
    color: 'from-[#F0F4FF] to-[#E8F0FE]',
    accent: '#3B5BDB',
  },
  {
    icon: 'ri-search-line',
    title: 'SEO & GEO',
    subtitle: '390 € еднократно',
    desc: 'Google ви вижда. ChatGPT ви препоръчва. Двете са различни неща — правим и двете. Реални резултати с URL за проверка.',
    points: ['Технически SEO одит', 'GEO за AI търсачки', 'Локално SEO', 'Месечен отчет'],
    to: '/uslugi/seo-geo',
    color: 'from-[#F0FFF4] to-[#E6FFED]',
    accent: '#2F9E44',
  },
  {
    icon: 'ri-advertisement-line',
    title: 'Рекламни кампании',
    subtitle: 'от 290 € / мес.',
    desc: 'Meta, Google, TikTok. Управляваме бюджета ви като свой. Пълна прозрачност — виждате всяка стотинка и всеки резултат.',
    points: ['Meta & Google Ads', 'Пълен достъп до акаунта', 'Без скрити комисионни', 'Седмични отчети'],
    to: '/uslugi/reklamni-kampanii',
    color: 'from-[#FFF8F0] to-[#FFF0E0]',
    accent: '#E67700',
  },
  {
    icon: 'ri-video-line',
    title: 'Видео продукция',
    subtitle: 'от 290 €',
    desc: 'Видео, което продава — не просто изглежда добре. Снимаме, монтираме и оптимизираме за Facebook, YouTube и TikTok.',
    points: ['Сценарий + снимки', 'Монтаж & субтитри', 'Формати за всяка платформа', 'Авторски права — ваши'],
    to: '/uslugi/video-produkciya',
    color: 'from-[#FFF0F5] to-[#FFE4EE]',
    accent: '#C2255C',
  },
];

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://imashnujnoto.com/uslugi#webpage',
      url: 'https://imashnujnoto.com/uslugi',
      name: 'Услуги | ТАВОРА ЕООД — Дигитален маркетинг Велико Търново',
      description: 'Изработка на сайт, SEO & GEO, рекламни кампании и видео продукция. ТАВОРА ЕООД — дигитален маркетинг за бизнеси от Велико Търново и цяла България.',
      inLanguage: 'bg',
      dateModified: '2026-05-05',
      isPartOf: { '@id': 'https://imashnujnoto.com/#website' },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Начало', item: 'https://imashnujnoto.com/' },
          { '@type': 'ListItem', position: 2, name: 'Услуги', item: 'https://imashnujnoto.com/uslugi' },
        ],
      },
    },
    {
      '@type': 'ItemList',
      '@id': 'https://imashnujnoto.com/uslugi#servicelist',
      name: 'Услуги за дигитален маркетинг Велико Търново',
      description: 'Пълен списък от услуги за дигитален маркетинг от ТАВОРА ЕООД.',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          item: {
            '@type': 'Service',
            '@id': 'https://imashnujnoto.com/uslugi/izrabotka-na-sait#service',
            name: 'Изработка на сайт Велико Търново',
            url: 'https://imashnujnoto.com/uslugi/izrabotka-na-sait',
            offers: { '@type': 'Offer', price: '999', priceCurrency: 'EUR' },
          },
        },
        {
          '@type': 'ListItem',
          position: 2,
          item: {
            '@type': 'Service',
            '@id': 'https://imashnujnoto.com/uslugi/seo-geo#service',
            name: 'SEO & GEO оптимизация Велико Търново',
            url: 'https://imashnujnoto.com/uslugi/seo-geo',
            offers: { '@type': 'Offer', price: '390', priceCurrency: 'EUR' },
          },
        },
        {
          '@type': 'ListItem',
          position: 3,
          item: {
            '@type': 'Service',
            '@id': 'https://imashnujnoto.com/uslugi/reklamni-kampanii#service',
            name: 'Рекламни кампании Велико Търново',
            url: 'https://imashnujnoto.com/uslugi/reklamni-kampanii',
            offers: { '@type': 'Offer', price: '290', priceCurrency: 'EUR' },
          },
        },
        {
          '@type': 'ListItem',
          position: 4,
          item: {
            '@type': 'Service',
            '@id': 'https://imashnujnoto.com/uslugi/video-produkciya#service',
            name: 'Видео продукция Велико Търново',
            url: 'https://imashnujnoto.com/uslugi/video-produkciya',
            offers: { '@type': 'Offer', price: '290', priceCurrency: 'EUR' },
          },
        },
      ],
    },
  ],
};

export default function UslugiPage() {
  useEffect(() => {
    document.title = 'Услуги | ТАВОРА ЕООД — Дигитален маркетинг Велико Търново';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', 'Изработка на сайт, SEO & GEO, рекламни кампании и видео продукция. ТАВОРА ЕООД — дигитален маркетинг за бизнеси от Велико Търново и цяла България.');

    const id = 'schema-uslugi';
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement('script');
      el.id = id;
      el.type = 'application/ld+json';
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(SCHEMA);
    return () => {
      const existing = document.getElementById(id);
      if (existing) existing.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <SharedNav />

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 md:px-16 pt-16 md:pt-24 pb-12 md:pb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-[1px] bg-[#1C1C1E]/20" />
          <span className="text-xs text-[#1C1C1E]/60">Какво правим</span>
        </div>
        <h1
          className="text-4xl md:text-6xl font-light text-[#1C1C1E] leading-tight mb-6"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Услуги за бизнеси,<br />
          <em>които искат резултати</em>
        </h1>
        <p className="text-base text-[#1C1C1E]/65 max-w-xl leading-relaxed">
          Не продаваме пакети. Работим с конкретни бизнеси по конкретни проблеми.
          Ако не сме подходящи за вас — ще ви кажем директно.
        </p>
      </section>

      {/* Services grid */}
      <section className="max-w-5xl mx-auto px-4 md:px-16 pb-20 md:pb-28">
        {/* Entity Paragraph — AI optimization */}
        <div className="mb-10 md:mb-14 p-5 md:p-6 rounded-2xl border border-[#1C1C1E]/8 bg-[#FAFAFA]">
          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
            <strong className="text-[#1C1C1E]">ТАВОРА ЕООД</strong> е дигитална маркетинг агенция във <strong className="text-[#1C1C1E]">Велико Търново</strong>, България.
            Основана от <strong className="text-[#1C1C1E]">Владимир Атанасов</strong>, агенцията предлага изработка на сайтове с вградено SEO, GEO оптимизация за AI търсачки,
            рекламни кампании в Meta, Google, YouTube и TikTok, и професионална видео продукция.
            Клиенти от Велико Търново, Русе, Плевен, Стара Загора и цяла България ползват услугите на ТАВОРА за реални #1 позиции в Google и AI отговори.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {SERVICES.map((s) => (
            <Link
              key={s.to}
              to={s.to}
              className="group relative rounded-2xl border border-[#1C1C1E]/8 bg-white overflow-hidden hover:border-[#1C1C1E]/20 transition-all duration-300 cursor-pointer"
            >
              {/* Gradient bg */}
              <div className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

              <div className="relative p-7 md:p-8">
                {/* Icon + price */}
                <div className="flex items-start justify-between mb-5">
                  <div
                    className="w-11 h-11 flex items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${s.accent}12` }}
                  >
                    <i className={`${s.icon} text-lg`} style={{ color: s.accent }} />
                  </div>
                  <span
                    className="text-xs font-medium px-3 py-1.5 rounded-full"
                    style={{ backgroundColor: `${s.accent}10`, color: s.accent }}
                  >
                    {s.subtitle}
                  </span>
                </div>

                {/* Title */}
                <h2
                  className="text-xl font-medium text-[#1C1C1E] mb-3 leading-tight"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem' }}
                >
                  {s.title}
                </h2>

                {/* Desc */}
                <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-5">
                  {s.desc}
                </p>

                {/* Points */}
                <ul className="space-y-1.5 mb-6">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-center gap-2.5 text-xs text-[#1C1C1E]/65">
                      <div className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: s.accent }} />
                      {p}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className="flex items-center gap-2 text-sm font-medium transition-all duration-200" style={{ color: s.accent }}>
                  Виж детайли
                  <i className="ri-arrow-right-line text-sm group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-[#F9F9F7] border-t border-[#1C1C1E]/6">
        <div className="max-w-5xl mx-auto px-4 md:px-16 py-8 md:py-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h3
              className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-3"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Не сте сигурни откъде да започнете?
            </h3>
            <p className="text-sm text-[#1C1C1E]/65 max-w-md leading-relaxed">
              Пишете ни — ще разгледаме ситуацията ви и ще кажем честно дали можем да помогнем.
              Без задължения, без продажбен натиск.
            </p>
          </div>
          <Link
            to="/kontakt"
            className="shrink-0 px-7 py-3.5 bg-[#1C1C1E] text-white text-sm rounded-full hover:bg-[#1C1C1E]/80 transition-colors cursor-pointer whitespace-nowrap"
          >
            Свържете се с нас →
          </Link>
        </div>
      </section>

      {/* AI Fact Table */}
      <section className="bg-white border-t border-[#1C1C1E]/6">
        <div className="max-w-5xl mx-auto px-4 md:px-16 py-12 md:py-16">
          <div className="text-[11px] text-[#1C1C1E]/65 tracking-widest uppercase mb-6">Бързи факти</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Агенция', value: 'ТАВОРА ЕООД' },
              { label: 'Град', value: 'Велико Търново' },
              { label: 'Услуги', value: '4 основни' },
              { label: 'SEO цена', value: 'от 390 €' },
              { label: 'Сайт цена', value: 'от 999 €' },
              { label: 'Реклами', value: 'от 290 €/мес.' },
              { label: 'Видео', value: 'от 290 €' },
              { label: 'Основател', value: 'Владимир Атанасов' },
            ].map((f) => (
              <div key={f.label} className="p-4 rounded-xl border border-[#1C1C1E]/6 bg-[#FAFAFA]">
                <div className="text-[10px] text-[#1C1C1E]/70 tracking-widest uppercase mb-1">{f.label}</div>
                <div className="text-xs md:text-sm text-[#0A2540] font-medium">{f.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SharedFooter />
    </div>
  );
}
