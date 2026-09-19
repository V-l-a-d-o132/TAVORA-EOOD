import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SharedNav from '@/components/feature/SharedNav';
import SharedFooter from '@/components/feature/SharedFooter';

const FAQ_ITEMS = [
  {
    q: 'Какво означава "Имаш нужното"?',
    a: 'Това е нашата философия — всеки бизнес вече има нещо ценно. Нашата работа е да го покажем на правилната аудитория чрез SEO, реклами и видео продукция.',
  },
  {
    q: 'Колко струва консултацията?',
    a: 'Консултацията е 50 € и включва анализ на вашия бизнес, конкурентите и онлайн присъствието ви, плюс конкретен план за действие. Тази сума се приспада от цената на услугата при сключване на договор. Консултацията не се възстановява — тя е реална работа.',
  },
  {
    q: 'Има ли гаранция за връщане на парите?',
    a: 'Да — всяка услуга (без консултацията от 50 €) идва с гаранция за връщане на парите. Ако не сте доволни от резултата, връщаме сумата без въпроси. Срокът за рекламация е уточнен в договора.',
  },
  {
    q: 'Работите ли само с бизнеси от Велико Търново?',
    a: 'Не — работим с бизнеси от цяла България. Специализираме се в Велико Търново и Търновска област, но управляваме проекти и за клиенти от цялата страна.',
  },
  {
    q: 'Мога ли да поръчам само едно нещо — само SEO или само видео?',
    a: 'Да — всяка услуга е достъпна самостоятелно. SEO пакет, рекламни кампании или видео продукция — избирате това, от което имате нужда. Можем да ги комбинираме и за по-добри резултати.',
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

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://imashnujnoto.com/imash-nujnoto#webpage',
      url: 'https://imashnujnoto.com/imash-nujnoto',
      name: 'Имаш нужното | ТАВОРА ЕООД — Дигитален маркетинг, SEO, реклами, видео',
      description:
        'Имаш нужното — дигитален маркетинг, SEO оптимизация, реклами и видео продукция за вашия бизнес от ТАВОРА ЕООД. Велико Търново и цяла България.',
      inLanguage: 'bg',
      isPartOf: { '@id': 'https://imashnujnoto.com/#website' },
    },
    {
      '@type': 'LocalBusiness',
      '@id': 'https://imashnujnoto.com/#organization',
      name: 'ТАВОРА ЕООД',
      alternateName: ['Tavora', 'Имаш нужното', 'imashnujnoto'],
      legalName: 'ТАВОРА ЕООД',
      taxID: '208438650',
      description: 'Имаш нужното — дигитален маркетинг, SEO оптимизация, реклами и видео продукция за вашия бизнес.',
      url: 'https://imashnujnoto.com',
      telephone: '+359885189724',
      priceRange: '€€',
      openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '09:00', closes: '18:00' }],
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'ул. "Велчо Джамджията"',
        addressLocality: 'Велико Търново',
        postalCode: '5000',
        addressCountry: 'BG',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: '43.0785',
        longitude: '25.6415',
      },
      areaServed: [
        { '@type': 'City', name: 'Велико Търново' },
        { '@type': 'AdministrativeArea', name: 'Търновска област' },
        { '@type': 'Country', name: 'България' },
      ],
      founder: { '@type': 'Person', name: 'Владимир Веселинов Атанасов' },
      serviceType: ['Дигитален маркетинг', 'SEO оптимизация', 'Рекламни кампании', 'Видео продукция', 'Изработка на сайт', 'GEO оптимизация'],
    },
  ],
};

const pillars = [
  {
    icon: 'ri-global-line',
    title: 'Онлайн присъствие',
    desc: 'Сайт, SEO, Google Business Profile — всичко, което ви трябва, за да сте намерими онлайн.',
    link: '/seo-veliko-tarnovo',
    linkText: 'SEO оптимизация →',
  },
  {
    icon: 'ri-advertisement-line',
    title: 'Реклами',
    desc: 'Meta, Google, YouTube, TikTok — кампании, които достигат точната аудитория в точното време.',
    link: '/reklama-veliko-tarnovo',
    linkText: 'Рекламни кампании →',
  },
  {
    icon: 'ri-video-line',
    title: 'Видео',
    desc: 'Професионално заснемане с камери, микрофони, осветление. Видеа, които работят.',
    link: '/video-produkciya-veliko-tarnovo',
    linkText: 'Видео продукция →',
  },
];

const proof = [
  {
    client: 'K-Food Велико Търново',
    result: '#1 в Google + ChatGPT',
    desc: 'SEO + GEO + реклами — те имаха нужното и го получиха.',
    url: 'https://k-foodvelikotarnovo.com/',
  },
  {
    client: 'Sunrise Food',
    result: '#1 в Google за 3–4 седмици',
    desc: 'Сайт + SEO + реклами — от нула до лидер за месеци.',
    url: 'https://sunrisefood.eu/',
  },
  {
    client: 'Академика 245',
    result: 'Млн. импресии',
    desc: 'Видео продукция — те имаха нужното съдържание и го получиха.',
    url: 'https://akademika245.com/',
  },
  {
    client: 'Thalysta',
    result: 'E-commerce от нулата',
    desc: 'Сайт + SEO + реклами + видео — пълен пакет от нулата.',
    url: 'https://thalysta.com/',
  },
  {
    client: 'NMOM',
    result: 'НПО сайт · SEO',
    desc: 'Изработка на сайт и SEO за социална кауза — от нулата.',
    url: 'https://nmom.bg/',
  },
  {
    client: 'Budimse',
    result: 'Платформа от нулата',
    desc: 'Образователна платформа — сайт, SEO, GEO, реклами.',
    url: 'https://budimse.online/',
  },
];

export default function ImashNujnotoPage() {
  useEffect(() => {
    const id = 'schema-imash';
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement('script');
      el.id = id;
      el.type = 'application/ld+json';
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(SCHEMA);

    const faqId = 'schema-imash-faq';
    let faqEl = document.getElementById(faqId) as HTMLScriptElement | null;
    if (!faqEl) {
      faqEl = document.createElement('script');
      faqEl.id = faqId;
      faqEl.type = 'application/ld+json';
      document.head.appendChild(faqEl);
    }
    faqEl.textContent = JSON.stringify(FAQ_SCHEMA);

    document.title = 'Имаш нужното | ТАВОРА ЕООД — Онлайн присъствие, реклами и видео за вашия бизнес';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Имаш нужното — дигитален маркетинг, SEO, реклами и видео продукция за вашия бизнес от ТАВОРА ЕООД. Велико Търново и цяла България.');
    }

    return () => {
      const existing = document.getElementById(id);
      if (existing) existing.remove();
      const existingFaq = document.getElementById(faqId);
      if (existingFaq) existingFaq.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <SharedNav />

      <main className="max-w-6xl mx-auto px-4 md:px-16">
        {/* Hero */}
        <div className="py-6 md:py-24 text-center">
          <div className="flex items-center justify-center gap-3 mb-4 md:mb-6">
            <div className="w-8 h-[1px] bg-[#0A2540]/30 shrink-0" />
            <span className="text-xs text-[#1C1C1E]/60">ТАВОРА ЕООД</span>
            <div className="w-8 h-[1px] bg-[#0A2540]/30 shrink-0" />
          </div>

          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-light text-[#1C1C1E] leading-tight mb-6"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Имаш нужното.
          </h1>

          <p className="text-sm md:text-base text-[#1C1C1E]/65 max-w-xl mx-auto leading-relaxed mb-8">
            <strong className="text-[#0A2540]">ТАВОРА ЕООД</strong> — онлайн присъствие, реклами и видео за вашия бизнес.
            Всичко, от което се нуждаете, за да растете онлайн. На едно място.
            Велико Търново и цяла България.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6 md:mb-12">
            <Link
              to="/kontakt"
              className="px-7 py-3.5 bg-[#0A2540] text-white text-sm tracking-wide rounded-full hover:bg-[#0A2540]/90 transition-all duration-300 cursor-pointer whitespace-nowrap text-center"
            >
              Поискайте оферта →
            </Link>
            <Link
              to="/kurs"
              className="px-7 py-3.5 border border-[#1C1C1E]/12 text-[#1C1C1E]/65 text-sm tracking-wide rounded-full hover:border-[#0A2540]/30 hover:text-[#0A2540] transition-all duration-300 cursor-pointer whitespace-nowrap text-center"
            >
              Искате да го научите сами?
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-[#1C1C1E]/8 max-w-3xl mx-auto">
            {[
              { value: 'SEO', label: 'Google + AI' },
              { value: 'Реклами', label: 'Meta · Google · TikTok' },
              { value: 'Видео', label: 'Проф. техника' },
              { value: 'Сайтове', label: 'от 999 €' },
            ].map((s) => (
              <div key={s.value} className="text-center">
                <div className="text-lg md:text-xl font-light text-[#0A2540] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {s.value}
                </div>
                <div className="text-[10px] text-[#1C1C1E]/65 tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Pillars */}
        <div className="py-5 md:py-20 border-t border-[#1C1C1E]/6">
          <div className="flex items-center justify-center gap-3 mb-4 md:mb-6">
            <div className="w-8 h-[1px] bg-[#0A2540]/30 shrink-0" />
            <span className="text-xs text-[#1C1C1E]/60">Трите стълба</span>
            <div className="w-8 h-[1px] bg-[#0A2540]/30 shrink-0" />
          </div>

          <h2
            className="text-2xl md:text-4xl font-light text-[#1C1C1E] leading-tight text-center mb-6 md:mb-10"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Всичко, от което се нуждаете.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {pillars.map((p) => (
              <div
                key={p.title}
                className="p-5 md:p-8 rounded-2xl border border-[#1C1C1E]/8 bg-[#F9F9F9] hover:border-[#0A2540]/15 transition-all duration-300 text-center"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-xl border border-[#0A2540]/10 bg-[#0A2540]/4 mx-auto mb-4">
                  <i className={`${p.icon} text-[#0A2540]/60 text-xl`} />
                </div>
                <div className="text-base font-medium text-[#1C1C1E] mb-2">{p.title}</div>
                <p className="text-xs text-[#1C1C1E]/65 leading-relaxed mb-4">{p.desc}</p>
                <Link
                  to={p.link}
                  className="inline-flex items-center gap-1 text-xs text-[#0A2540] hover:underline decoration-dotted"
                >
                  {p.linkText}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Proof */}
        <div className="py-5 md:py-20 border-t border-[#1C1C1E]/6">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <div className="w-8 h-[1px] bg-[#0A2540]/30 shrink-0" />
            <span className="text-xs text-[#1C1C1E]/60">Доказателства</span>
          </div>

          <h2
            className="text-2xl md:text-4xl font-light text-[#1C1C1E] leading-tight mb-6"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Те имаха нужното.
            <br />
            <span className="italic text-[#0A2540]">И го получиха.</span>
          </h2>

          <p className="text-sm text-[#1C1C1E]/65 max-w-xl leading-relaxed mb-8">
            Не обещаваме — доказваме. Всяка позиция е верифицируема. Всяка кампания — измерима.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {proof.map((p) => (
              <a
                key={p.client}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="p-4 md:p-5 rounded-2xl border border-[#1C1C1E]/8 bg-white hover:border-[#0A2540]/15 transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-[#1C1C1E] group-hover:text-[#0A2540] transition-colors">
                    {p.client}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1B4332]/10 text-[#1B4332] whitespace-nowrap">
                    {p.result}
                  </span>
                </div>
                <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">{p.desc}</p>
              </a>
            ))}
          </div>
        </div>

        {/* Why us */}
        <div className="py-5 md:py-20 border-t border-[#1C1C1E]/6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              <h2
                className="text-2xl md:text-4xl font-light text-[#1C1C1E] leading-tight mb-5"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Защо
                <br />
                <span className="italic text-[#0A2540]">ТАВОРА ЕООД?</span>
              </h2>
              <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-6">
                Не сме агенция с 20 служители и красиви презентации. Правим реална работа за реални клиенти —
                и резултатите са верифицируеми. Владимир Атанасов и Натан Петков.
                SEO, реклами и видео — всичко, от което се нуждаете.
              </p>
              <div className="space-y-3">
                {[
                  'Реални #1 позиции в Google — проверете сами',
                  'GEO оптимизация за AI търсачки — ChatGPT, Perplexity',
                  'Рекламни кампании в Meta, Google, YouTube, TikTok',
                  'Видео продукция с професионална техника',
                  'Всичко, което правим за клиентите — преподаваме и в курса',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2.5">
                    <div className="w-5 h-5 flex items-center justify-center rounded-full border border-[#1B4332]/20 shrink-0 mt-0.5">
                      <i className="ri-check-line text-[10px] text-[#1B4332]" />
                    </div>
                    <span className="text-xs text-[#1C1C1E]/65 leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 md:p-8 rounded-2xl border border-[#1C1C1E]/8 bg-[#F9F9F9]">
              <h3
                className="text-lg font-light text-[#1C1C1E] mb-4"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Какво получавате?
              </h3>
              <div className="space-y-3">
                {[
                  { title: 'Сайт', desc: 'Базов сайт с вградено SEO — от 999 €' },
                  { title: 'SEO', desc: 'On-page + Google Business + GEO — 390 €' },
                  { title: 'Реклами', desc: 'Meta, Google, YouTube, TikTok — от 290 €/мес.' },
                  { title: 'Видео', desc: 'Проф. заснемане и монтаж — от 290 €' },
                  { title: 'Цялостно', desc: 'Всичко под един покрив — по запитване' },
                ].map((item) => (
                  <div key={item.title} className="flex items-center justify-between py-2 border-b border-[#1C1C1E]/6 last:border-0">
                    <span className="text-sm text-[#1C1C1E]/60">{item.title}</span>
                    <span className="text-xs text-[#0A2540]">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="py-5 md:py-20 border-t border-[#1C1C1E]/6">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <div className="w-8 h-[1px] bg-[#0A2540]/30 shrink-0" />
            <span className="text-xs text-[#1C1C1E]/60">Въпроси и отговори</span>
          </div>
          <h2
            className="text-2xl md:text-4xl font-light text-[#1C1C1E] leading-tight mb-6 md:mb-10"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Имате въпроси?
            <br />
            <span className="italic text-[#0A2540]">Имаме отговори.</span>
          </h2>
          <div className="space-y-3 mb-10">
            {FAQ_ITEMS.map((item) => (
              <details key={item.q} className="group rounded-2xl border border-[#1C1C1E]/8 bg-[#F9F9F9] overflow-hidden">
                <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none">
                  <span className="text-sm font-medium text-[#1C1C1E]">{item.q}</span>
                  <i className="ri-add-line text-[#0A2540]/50 text-base shrink-0 group-open:hidden" />
                  <i className="ri-subtract-line text-[#0A2540]/50 text-base shrink-0 hidden group-open:block" />
                </summary>
                <div className="px-5 pb-4">
                  <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">{item.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="py-5 md:py-20 border-t border-[#1C1C1E]/6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 p-5 md:p-8 rounded-2xl border border-[#1C1C1E]/8 bg-[#F9F9F9]">
            <div>
              <div
                className="text-xl md:text-2xl font-light text-[#1C1C1E] mb-1"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Имате нужното — сега го покажете на света.
              </div>
              <p className="text-sm text-[#1C1C1E]/65">
                Консултацията е 50 € — реална работа, не разговор. Сумата се приспада при договор. Гаранция за връщане на парите на всяка услуга.
              </p>
            </div>
            <Link
              to="/kontakt"
              className="px-7 py-3.5 bg-[#0A2540] text-white text-sm rounded-full hover:bg-[#0A2540]/90 transition-all cursor-pointer whitespace-nowrap text-center shrink-0"
            >
              Поискайте оферта →
            </Link>
          </div>
        </div>
      </main>

      <SharedFooter />
    </div>
  );
}