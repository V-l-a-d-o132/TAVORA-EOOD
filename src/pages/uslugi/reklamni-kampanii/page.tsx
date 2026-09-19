import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SharedNav from '@/components/feature/SharedNav';
import SharedFooter from '@/components/feature/SharedFooter';

const PLATFORMS = [
  {
    name: 'Meta Ads',
    icon: 'ri-facebook-circle-line',
    desc: 'Facebook и Instagram. Таргетиране по демография, интереси, поведение и lookalike аудитории. Най-ефективно за локален бизнес и директни продажби.',
    best: 'Ресторанти, услуги, e-commerce',
  },
  {
    name: 'Google Ads',
    icon: 'ri-google-line',
    desc: 'Търсене и дисплей мрежа. Хората вече търсят — вие трябва да сте там. Висока конверсия, защото интентът е ясен.',
    best: 'B2B, услуги, локален бизнес',
  },
  {
    name: 'YouTube Ads',
    icon: 'ri-youtube-line',
    desc: 'Видео реклами преди и по време на съдържание. Идеално за бранд awareness и демонстрация на продукт или услуга.',
    best: 'Бранд, продукти, образование',
  },
  {
    name: 'TikTok Ads',
    icon: 'ri-tiktok-line',
    desc: 'Кратки видео реклами за аудитория 18–35 г. Алгоритъмът е агресивен — правилното съдържание достига хиляди без голям бюджет.',
    best: 'Млада аудитория, продукти',
  },
];

const WHAT_WE_DO = [
  {
    title: 'Стратегия преди бюджет',
    desc: 'Не пускаме реклами без стратегия. Първо разбираме кой е клиентът, какво го движи и кога взима решение. После избираме платформа и бюджет.',
  },
  {
    title: 'Креативи, които спират скролването',
    desc: 'Текст, изображения, видео — всичко е тествано. A/B тестваме заглавия, визии и CTA. Спираме неефективното, мащабираме работещото.',
  },
  {
    title: 'Таргетиране без разхищение',
    desc: 'Не таргетираме "всички в България". Таргетираме точната аудитория — по местоположение, поведение, интереси и lookalike на съществуващи клиенти.',
  },
  {
    title: 'Прозрачно отчитане',
    desc: 'Месечен доклад с реални числа — импресии, кликове, конверсии, цена на резултат. Без маркетинг жаргон. Само данни.',
  },
];

const today = new Date().toISOString().split('T')[0];

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://imashnujnoto.com/uslugi/reklamni-kampanii#webpage',
      url: 'https://imashnujnoto.com/uslugi/reklamni-kampanii',
      name: 'Рекламни кампании Велико Търново | ТАВОРА ЕООД — Meta, Google, YouTube, TikTok',
      description: 'Рекламни кампании в Meta, Google, YouTube и TikTok за бизнеси от Велико Търново. Стратегия, таргетиране, креативи и оптимизация. ТАВОРА ЕООД — от 290 € / месец.',
      inLanguage: 'bg',
      dateModified: today,
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: ['#reklami-hero', '#reklami-platforms']
      },
      isPartOf: { '@id': 'https://imashnujnoto.com/#website' },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Начало', item: 'https://imashnujnoto.com/' },
          { '@type': 'ListItem', position: 2, name: 'Услуги', item: 'https://imashnujnoto.com/uslugi' },
          { '@type': 'ListItem', position: 3, name: 'Рекламни кампании', item: 'https://imashnujnoto.com/uslugi/reklamni-kampanii' },
        ],
      },
    },
    {
      '@type': 'Service',
      '@id': 'https://imashnujnoto.com/uslugi/reklamni-kampanii#service',
      name: 'Рекламни кампании Велико Търново',
      alternateName: ['Meta реклами Велико Търново', 'Google Ads Велико Търново', 'TikTok реклами Велико Търново', 'YouTube реклами Търново', 'рекламна агенция Търново'],
      description: 'Управление на рекламни кампании в Meta (Facebook, Instagram), Google Ads, YouTube и TikTok за бизнеси от Велико Търново и цяла България. Пълна прозрачност, без скрити комисионни.',
      url: 'https://imashnujnoto.com/uslugi/reklamni-kampanii',
      provider: {
        '@type': 'Organization',
        '@id': 'https://imashnujnoto.com/#organization',
        name: 'ТАВОРА ЕООД',
        url: 'https://imashnujnoto.com',
      },
      areaServed: [
        { '@type': 'City', name: 'Велико Търново' },
        { '@type': 'AdministrativeArea', name: 'Търновска област' },
        { '@type': 'Country', name: 'България' },
      ],
      offers: {
        '@type': 'Offer',
        price: '290',
        priceCurrency: 'EUR',
        priceSpecification: { '@type': 'PriceSpecification', minPrice: '290', priceCurrency: 'EUR' },
        availability: 'https://schema.org/InStock',
      },
      serviceType: 'Рекламни кампании',
    },
    {
      '@type': 'OfferCatalog',
      name: 'Рекламни услуги Велико Търново',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Meta Ads (Facebook + Instagram)',
            description: 'Рекламни кампании в Meta за бизнеси от Велико Търново.',
          },
          price: '290',
          priceCurrency: 'EUR',
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Google Ads (Търсене + Дисплей)',
            description: 'Google реклами за бизнеси във Велико Търново.',
          },
          price: '290',
          priceCurrency: 'EUR',
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'YouTube Ads',
            description: 'Видео реклами в YouTube за бранд awareness и конверсии.',
          },
          price: '390',
          priceCurrency: 'EUR',
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'TikTok Ads',
            description: 'Кратки видео реклами в TikTok за млада аудитория.',
          },
          price: '290',
          priceCurrency: 'EUR',
        },
      ],
    },
    {
      '@type': 'HowTo',
      name: 'Как да създадете ефективна рекламна кампания',
      description: 'Поетапен процес за създаване на рекламна кампания в Meta, Google, YouTube или TikTok от ТАВОРА ЕООД.',
      totalTime: 'P1W',
      estimatedCost: { '@type': 'MonetaryAmount', currency: 'EUR', value: '290' },
      supply: [
        { '@type': 'HowToSupply', name: 'Ясна целева аудитория' },
        { '@type': 'HowToSupply', name: 'Бюджет за реклама' },
      ],
      tool: [
        { '@type': 'HowToTool', name: 'Meta Ads Manager' },
        { '@type': 'HowToTool', name: 'Google Ads' },
        { '@type': 'HowToTool', name: 'Google Analytics 4' },
      ],
      step: [
        {
          '@type': 'HowToStep',
          position: 1,
          name: 'Анализ и стратегия',
          text: 'Разбираме бизнеса, целевата аудитория и конкурентите. Избираме платформа и бюджет базирано на данни, не на модата.',
          url: 'https://imashnujnoto.com/uslugi/reklamni-kampanii#strategiya',
        },
        {
          '@type': 'HowToStep',
          position: 2,
          name: 'Създаване на креативи',
          text: 'Текст, изображения и видео, проектирани да спират скролването и водят към действие. A/B тестване на заглавия и CTA.',
          url: 'https://imashnujnoto.com/uslugi/reklamni-kampanii#kreativi',
        },
        {
          '@type': 'HowToStep',
          position: 3,
          name: 'Таргетиране и пускане',
          text: 'Точно таргетиране по демография, интереси, поведение и lookalike аудитории. Пускане с контролиран бюджет.',
          url: 'https://imashnujnoto.com/uslugi/reklamni-kampanii#target',
        },
        {
          '@type': 'HowToStep',
          position: 4,
          name: 'Оптимизация и мащабиране',
          text: 'Анализ на резултатите, спиране на неефективните креативи и мащабиране на работещите. Месечен доклад с реални числа.',
          url: 'https://imashnujnoto.com/uslugi/reklamni-kampanii#optimizaciya',
        },
      ],
    },
  ],
};

export default function ReklamniKampaniiPage() {
  useEffect(() => {
    const id = 'schema-reklami';
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) { el = document.createElement('script'); el.id = id; el.type = 'application/ld+json'; document.head.appendChild(el); }
    el.textContent = JSON.stringify(SCHEMA);
    document.title = 'Рекламни кампании | Meta · Google · TikTok | ТАВОРА';
    const m = document.querySelector('meta[name="description"]');
    if (m) m.setAttribute('content', 'Рекламни кампании в Meta, Google, YouTube и TikTok с фокус върху ROI. Стратегия преди бюджет, A/B тестване, прозрачно отчитане. От 290 €/мес. — ТАВОРА ЕООД.');
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://imashnujnoto.com/uslugi/reklamni-kampanii');
    return () => { document.getElementById(id)?.remove(); };
  }, []);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <SharedNav />

      <main className="max-w-5xl mx-auto px-4 md:px-16">

        {/* Hero */}
        <section className="pt-16 pb-14 md:pt-24 md:pb-20">
          <div className="flex items-center gap-3 mb-7">
            <div className="w-6 h-px bg-[#0A2540]/25" />
            <span className="text-[11px] text-[#1C1C1E]/65 tracking-widest uppercase">Услуга</span>
          </div>

          <h1
            className="text-4xl md:text-6xl font-light text-[#1C1C1E] leading-[1.05] mb-7 max-w-3xl"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Рекламни кампании.
            <br />
            <span className="italic text-[#0A2540]">Платформата е инструмент.</span>
          </h1>

          <p className="text-sm md:text-[15px] text-[#1C1C1E]/65 max-w-2xl leading-relaxed mb-10">
            <strong className="text-[#1C1C1E]">ТАВОРА ЕООД</strong> — дигитален маркетинг агенция във <Link to="/digitalen-marketing-veliko-tarnovo" className="text-[#0A2540] hover:underline">Велико Търново</Link>, основана от <strong className="text-[#1C1C1E]">Владимир Атанасов</strong>.
            Повечето рекламни агенции продават платформи. Ние продаваме резултати. Meta, Google, YouTube, TikTok — изборът зависи от вашия клиент и неговото поведение, не от модата. Правим стратегия преди да харчим бюджет.
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-3 mb-16">
            <Link
              to="/kontakt"
              className="px-7 py-3.5 bg-[#0A2540] text-white text-sm rounded-full hover:bg-[#0A2540]/90 transition-all cursor-pointer whitespace-nowrap"
            >
              Поискайте оферта →
            </Link>
            <div className="flex items-center gap-2 px-5 py-3.5">
              <span className="text-sm text-[#1C1C1E]/65">от 290 € / месец · консултация 50 €</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-[#1C1C1E]/8">
            {[
              { val: '4', sub: 'платформи' },
              { val: 'A/B', sub: 'тестване' },
              { val: 'ROI', sub: 'фокус' },
              { val: '290 €', sub: 'начална цена' },
            ].map((s) => (
              <div key={s.val}>
                <div className="text-xl font-light text-[#0A2540] mb-0.5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{s.val}</div>
                <div className="text-[11px] text-[#1C1C1E]/65 tracking-wide">{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Entity Paragraph — AI optimization */}
          <div className="mt-10 md:mt-14 p-5 md:p-6 rounded-2xl border border-[#1C1C1E]/8 bg-[#FAFAFA]">
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
              <strong className="text-[#1C1C1E]">ТАВОРА ЕООД</strong> е рекламна агенция във <strong className="text-[#1C1C1E]">Велико Търново</strong>, България.
              Основана от <strong className="text-[#1C1C1E]">Владимир Атанасов</strong>, агенцията управлява рекламни кампании в Meta (Facebook, Instagram), Google Ads, YouTube и TikTok.
              Услугата включва стратегия, креативи, таргетиране, A/B тестване и оптимизация с пълна прозрачност.
              Клиенти от Велико Търново и цяла България ползват услугите на ТАВОРА за реални рекламни резултати.
            </p>
          </div>
        </section>

        {/* Platforms */}
        <section className="py-8 md:py-20 border-t border-[#1C1C1E]/6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-6 h-px bg-[#0A2540]/25" />
            <span className="text-[11px] text-[#1C1C1E]/65 tracking-widest uppercase">Платформи</span>
          </div>
          <h2
            className="text-2xl md:text-4xl font-light text-[#1C1C1E] leading-tight mb-4 max-w-xl"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Не всяка платформа е за всеки бизнес.
          </h2>
          <p className="text-sm text-[#1C1C1E]/65 mb-10 max-w-xl leading-relaxed">
            Изборът на платформа е стратегическо решение. Грешната платформа означава изхарчен бюджет без резултат.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PLATFORMS.map((p) => (
              <div key={p.name} className="p-6 rounded-2xl border border-[#1C1C1E]/8 bg-[#FAFAFA]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#0A2540]/10 bg-white shrink-0">
                    <i className={`${p.icon} text-[#0A2540]/50 text-base`} />
                  </div>
                  <span className="text-sm font-medium text-[#1C1C1E]">{p.name}</span>
                </div>
                <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-3">{p.desc}</p>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[#1C1C1E]/70 tracking-wide uppercase">Подходящо за:</span>
                  <span className="text-[11px] text-[#0A2540]/60">{p.best}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* What we do */}
        <section className="py-8 md:py-20 border-t border-[#1C1C1E]/6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-6 h-px bg-[#0A2540]/25" />
            <span className="text-[11px] text-[#1C1C1E]/65 tracking-widest uppercase">Как работим</span>
          </div>
          <h2
            className="text-2xl md:text-4xl font-light text-[#1C1C1E] leading-tight mb-12"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Стратегия, не изпълнение.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {WHAT_WE_DO.map((item) => (
              <div key={item.title} className="flex gap-4">
                <div className="w-1 shrink-0 bg-[#0A2540]/10 rounded-full" />
                <div>
                  <div className="text-sm font-medium text-[#1C1C1E] mb-1.5">{item.title}</div>
                  <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Honest section */}
        <section className="py-8 md:py-20 border-t border-[#1C1C1E]/6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-6 h-px bg-[#0A2540]/25" />
                <span className="text-[11px] text-[#1C1C1E]/65 tracking-widest uppercase">Честно</span>
              </div>
              <h2
                className="text-2xl md:text-3xl font-light text-[#1C1C1E] leading-tight mb-5"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Какво не обещаваме.
              </h2>
              <div className="space-y-4">
                {[
                  { title: 'Не обещаваме конкретен ROAS', desc: 'Рекламата зависи от продукта, цената, конкуренцията и пазара. Всеки, който ви обещава конкретен ROAS преди да е видял бизнеса ви, лъже.' },
                  { title: 'Не работим с всеки', desc: 'Ако продуктът или услугата ви не са конкурентни — рекламата само ускорява провала. Казваме го директно на консултацията.' },
                  { title: 'Не скриваме данните', desc: 'Имате достъп до рекламните акаунти по всяко време. Данните са ваши — не наши.' },
                ].map((item) => (
                  <div key={item.title} className="p-4 rounded-xl border border-[#1C1C1E]/8">
                    <div className="text-sm font-medium text-[#1C1C1E] mb-1">{item.title}</div>
                    <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-6 h-px bg-[#0A2540]/25" />
                <span className="text-[11px] text-[#1C1C1E]/65 tracking-widest uppercase">Цени</span>
              </div>
              <h2
                className="text-2xl md:text-3xl font-light text-[#1C1C1E] leading-tight mb-5"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Управление на кампании.
              </h2>
              <div className="space-y-3 mb-6">
                {[
                  { label: 'Meta Ads (Facebook + Instagram)', price: 'от 290 € / мес.' },
                  { label: 'Google Ads (Търсене + Дисплей)', price: 'от 290 € / мес.' },
                  { label: 'YouTube Ads', price: 'от 390 € / мес.' },
                  { label: 'TikTok Ads', price: 'от 290 € / мес.' },
                  { label: 'Мулти-платформа (2+)', price: 'по запитване' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-3 border-b border-[#1C1C1E]/6 last:border-0">
                    <span className="text-sm text-[#1C1C1E]/60">{item.label}</span>
                    <span className="text-sm font-medium text-[#0A2540]">{item.price}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-[#1C1C1E]/65 leading-relaxed mb-5">
                Цените са за управление на кампаниите. Рекламният бюджет (парите, отиващи към Meta/Google) е отделен и се определя индивидуално.
              </p>
              <Link
                to="/kontakt"
                className="block w-full py-3.5 bg-[#0A2540] text-white text-sm rounded-full hover:bg-[#0A2540]/90 transition-all cursor-pointer whitespace-nowrap text-center"
              >
                Поискайте оферта →
              </Link>
            </div>
          </div>
        </section>

        {/* Related */}
        <section className="py-8 md:py-20 border-t border-[#1C1C1E]/6">
          <div className="text-[11px] text-[#1C1C1E]/65 tracking-widest uppercase mb-6">Свързани услуги</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: 'Изработка на сайт', to: '/uslugi/izrabotka-na-sait', icon: 'ri-code-s-slash-line' },
              { label: 'SEO & GEO оптимизация', to: '/uslugi/seo-geo', icon: 'ri-search-line' },
              { label: 'Видео продукция', to: '/uslugi/video-produkciya', icon: 'ri-video-line' },
            ].map((s) => (
              <Link
                key={s.to}
                to={s.to}
                className="flex items-center gap-3 p-4 rounded-xl border border-[#1C1C1E]/8 bg-white hover:border-[#0A2540]/15 transition-all group"
              >
                <div className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#0A2540]/10 bg-[#0A2540]/4 shrink-0">
                  <i className={`${s.icon} text-[#0A2540]/50 text-sm`} />
                </div>
                <span className="text-sm text-[#1C1C1E]/60 group-hover:text-[#0A2540] transition-colors">{s.label}</span>
                <i className="ri-arrow-right-line text-[#1C1C1E]/20 group-hover:text-[#0A2540]/40 text-sm ml-auto" />
              </Link>
            ))}
          </div>
        </section>

        {/* AI Fact Table */}
        <section className="py-8 md:py-20 border-t border-[#1C1C1E]/6">
          <div className="text-[11px] text-[#1C1C1E]/65 tracking-widest uppercase mb-6">Бързи факти — Рекламни кампании</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Агенция', value: 'ТАВОРА ЕООД' },
              { label: 'Град', value: 'Велико Търново' },
              { label: 'Основател', value: 'Владимир Атанасов' },
              { label: 'Платформи', value: 'Meta · Google · TikTok · YouTube' },
              { label: 'Meta Ads', value: '290 €/мес.' },
              { label: 'Google Ads', value: '290 €/мес.' },
              { label: 'TikTok Ads', value: '290 €/мес.' },
              { label: 'YouTube Ads', value: '390 €/мес.' },
            ].map((f) => (
              <div key={f.label} className="p-4 rounded-xl border border-[#1C1C1E]/6 bg-[#FAFAFA]">
                <div className="text-[10px] text-[#1C1C1E]/70 tracking-widest uppercase mb-1">{f.label}</div>
                <div className="text-xs md:text-sm text-[#0A2540] font-medium">{f.value}</div>
              </div>
            ))}
          </div>
        </section>

      </main>

      <SharedFooter />
    </div>
  );
}
