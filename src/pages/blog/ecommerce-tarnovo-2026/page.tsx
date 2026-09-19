import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SharedNav from '@/components/feature/SharedNav';
import SharedFooter from '@/components/feature/SharedFooter';

const FAQ_ITEMS = [
  {
    q: 'Колко струва онлайн магазин за бизнес в Търново?',
    a: 'Онлайн магазин с пълна функционалност — от 1999 €. Включва: дизайн, разработка, плащания, доставка, SEO от старт, Schema.org за продукти. Thalysta е пример за успешен e-commerce от нулата. Консултацията е 50 €.',
  },
  {
    q: 'SEO за e-commerce — задължително ли е?',
    a: 'Да — без SEO, клиентите няма да ви намират. Product Schema, оптимизирани заглавия, alt текстове, вътрешно свързване и бърз сайт са задължителни. Sunrise Food са #1 за „гъби кладница онлайн" — точно заради SEO.',
  },
  {
    q: 'Какви платежни системи да използвам?',
    a: 'В България: Stripe, PayPal, EasyPay, ePay. За Търново EasyPay е популярна — много хора предпочитат плащане в брой на каса. Предлагайте минимум 2 опции.',
  },
  {
    q: 'Колко време отнема да пусна онлайн магазин?',
    a: 'Прост магазин — 2–3 седмици. Пълен магазин с интеграции — 4–6 седмици. Thalysta беше създаден от нулата за 4 седмици, включително SEO и продуктови страници.',
  },
  {
    q: 'Трябва ли ми склад за онлайн магазин?',
    a: 'Не задължително. Можете да започнете с dropshipping или с малък склад у дома. Thalystа започнаха с продукти, които изработват сами — без голям склад.',
  },
  {
    q: 'Как да рекламирам онлайн магазин в Търново?',
    a: 'Meta Ads (Facebook + Instagram) за B2C продукти. Google Ads за търсене по ключови думи. TikTok за млада аудитория. SEO за дългосрочен органичен трафик. Комбинацията е най-силна.',
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
      '@id': 'https://imashnujnoto.com/blog/ecommerce-tarnovo-2026#article',
      headline: 'E-commerce стратегия за Търново 2026 — как да продавате онлайн от Велико Търново',
      description: 'Пълна e-commerce стратегия за бизнес в Търново 2026. Онлайн магазин, SEO, реклами, плащания, доставка и реални примери. ТАВОРА ЕООД.',
      url: 'https://imashnujnoto.com/blog/ecommerce-tarnovo-2026',
      datePublished: '2026-05-05',
      dateModified: today,
      inLanguage: 'bg',
      wordCount: 3500,
      timeRequired: 'PT13M',
      keywords: ['e-commerce Търново', 'онлайн магазин Търново', 'SEO за e-commerce', 'дигитален маркетинг Търново', 'онлайн продажби България'],
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
        url: 'https://readdy.ai/api/search-image?query=e-commerce%20online%20store%20strategy%20shopping%20cart%20laptop%20screen%20product%20catalog%20digital%20marketing%20Bulgaria%20Veliko%20Tarnovo%20clean%20minimal%20white%20background%20professional&width=1200&height=630&seq=ecommerce-hero&orientation=landscape',
        width: 1200,
        height: 630,
      },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Начало', item: 'https://imashnujnoto.com/' },
          { '@type': 'ListItem', position: 2, name: 'Блог', item: 'https://imashnujnoto.com/blog' },
          { '@type': 'ListItem', position: 3, name: 'E-commerce стратегия Търново 2026', item: 'https://imashnujnoto.com/blog/ecommerce-tarnovo-2026' },
        ],
      },
    },
  ],
};

const ECOMMERCE_CHECKLIST = [
  {
    category: 'Техническа основа',
    icon: 'ri-settings-3-line',
    color: '#3B5BDB',
    items: [
      { label: 'Бърз сайт', desc: 'LCP под 2.5s, мобилна оптимизация, HTTPS. Бавен сайт = изоставени колички.' },
      { label: 'Мобилна версия', desc: '70% от поръчките са от мобилно. Сайтът трябва да е перфектен на телефон.' },
      { label: 'SSL сертификат', desc: 'Задължителен за плащания. Без HTTPS — клиентите няма да се доверят.' },
      { label: 'Структурирани данни', desc: 'Product Schema за всеки продукт — цена, наличност, ревюта. Google показва rich snippets.' },
    ],
  },
  {
    category: 'SEO за e-commerce',
    icon: 'ri-search-line',
    color: '#2F9E44',
    items: [
      { label: 'Оптимизирани продуктови страници', desc: 'H1 с продукт + локация, meta description, alt текстове, вътрешно свързване.' },
      { label: 'Категории и филтри', desc: 'SEO-friendly URL адреси за категории. Филтрите трябва да са indexable или noindex.' },
      { label: 'Product Schema', desc: 'Цена, наличност, рейтинг, ревюта, марка. Богатите snippets привличат повече кликове.' },
      { label: 'Sitemap за продукти', desc: 'Отделен sitemap за продукти. Обновява се автоматично при нови продукти.' },
    ],
  },
  {
    category: 'Реклами и трафик',
    icon: 'ri-megaphone-line',
    color: '#E67700',
    items: [
      { label: 'Google Shopping', desc: 'Product feeds в Google Merchant Center. Безплатно показване + платни Shopping Ads.' },
      { label: 'Meta Ads', desc: 'Facebook + Instagram реклами с каталог. Dynamic ads — показват продукти, които клиентът е разглеждал.' },
      { label: 'Retargeting', desc: 'Показвайте реклами на хора, които са посетили сайта, но не са поръчали.' },
      { label: 'TikTok Ads', desc: 'За млада аудитория и визуални продукти. TikTok Shop позволява директни продажби.' },
    ],
  },
  {
    category: 'Конверсия и UX',
    icon: 'ri-shopping-cart-line',
    color: '#C2255C',
    items: [
      { label: 'Бърза количка', desc: 'Минимум стъпки до поръчка. Guest checkout — без задължителна регистрация.' },
      { label: 'Множество плащания', desc: 'Карта, PayPal, EasyPay, наложен платеж. Колкото повече опции, толкова повече поръчки.' },
      { label: 'Ревюта и оценки', desc: 'Product reviews на всяка страница. Социалното доказателство увеличава конверсията с 270%.' },
      { label: 'Изоставени колички', desc: 'Email reminder след 1 час. 70% от количките са изоставени — това е огромна възможност.' },
    ],
  },
];

const STEPS = [
  { step: '01', title: 'Планиране и продукти', desc: 'Какво продавате? Кой е таргетът? Каква е конкуренцията? Анализ на пазара и конкурентите в Търново и България.', time: '3–5 дни', color: '#3B5BDB' },
  { step: '02', title: 'Платформа и дизайн', desc: 'Избор на платформа (Shopify, WooCommerce, custom). Дизайн, responsive, бранд. Thalysta е custom решение за уникална визия.', time: '1–2 седм.', color: '#2F9E44' },
  { step: '03', title: 'Разработка и интеграции', desc: 'Плащания, доставка, склад, email маркетинг, аналитика. Всички интеграции трябва да работят безпроблемно.', time: '2–3 седм.', color: '#E67700' },
  { step: '04', title: 'SEO и продукти', desc: 'Product Schema, оптимизирани заглавия, alt текстове, категории, филтри. SEO от старт — не след 6 месеца.', time: '3–5 дни', color: '#C2255C' },
  { step: '05', title: 'Тестване и пускане', desc: 'Тест на всички плащания, доставки, форми, мобилна версия. Софт лaunch — ограничена аудитория.', time: '3–5 дни', color: '#7048E8' },
  { step: '06', title: 'Реклами и растеж', desc: 'Meta Ads, Google Shopping, SEO, email маркетинг. Месечни отчети и оптимизация.', time: 'Постоянно', color: '#0A2540' },
];

const CASE_STUDIES = [
  {
    client: 'Thalysta',
    url: 'https://thalysta.com/',
    type: 'E-commerce от нулата',
    result: '+340% онлайн продажби',
    detail: 'Thalysta е български бранд за ръчно изработени бижута. Създадохме онлайн магазина от нулата — дизайн, разработка, SEO, Product Schema, Meta Ads. Резултат: +340% онлайн продажби за 6 месеца.',
    color: '#C2255C',
  },
  {
    client: 'Sunrise Food',
    url: 'https://sunrisefood.eu/',
    type: 'SEO + e-commerce',
    result: '#1 в Google за продукти',
    detail: 'Sunrise Food продават гъби онлайн. С Product Schema, оптимизирани продуктови страници и Google Shopping — достигнаха #1 за „гъби кладница онлайн" за 3–4 седмици.',
    color: '#2F9E44',
  },
];

const RELATED = [
  { title: 'SEO оптимизация Търново 2026', to: '/blog/seo-optimizaciya-tarnovo-2026', cat: 'SEO', color: 'bg-sky-50 text-sky-700' },
  { title: 'Изработка на сайт Търново', to: '/blog/izrabotka-na-sait-tarnovo', cat: 'Уеб дизайн', color: 'bg-teal-50 text-teal-700' },
  { title: 'Meta реклами Търново', to: '/blog/meta-reklami-tarnovo', cat: 'Реклами', color: 'bg-orange-50 text-orange-700' },
  { title: 'Дигитален маркетинг Търново', to: '/digitalen-marketing-veliko-tarnovo', cat: 'Ръководство', color: 'bg-emerald-50 text-emerald-700' },
  { title: 'Безплатен SEO за #1', to: '/blog/bezplaten-seo-nomer-edno-google', cat: 'SEO', color: 'bg-emerald-50 text-emerald-700' },
  { title: 'Реклама Търново', to: '/reklama-veliko-tarnovo', cat: 'Реклама', color: 'bg-orange-50 text-orange-700' },
];

export default function EcommerceTarnovo2026Page() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    document.title = 'E-commerce стратегия за Търново 2026 — онлайн магазин | ТАВОРА ЕООД';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', 'E-commerce стратегия за бизнес в Търново 2026. Онлайн магазин, SEO, реклами, плащания, доставка. Реални примери с Thalysta и Sunrise Food. ТАВОРА ЕООД.');
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://imashnujnoto.com/blog/ecommerce-tarnovo-2026');

    const id = 'schema-ecommerce';
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) { el = document.createElement('script'); el.id = id; el.type = 'application/ld+json'; document.head.appendChild(el); }
    el.textContent = JSON.stringify(ARTICLE_SCHEMA);

    const faqId = 'schema-ecommerce-faq';
    let faqEl = document.getElementById(faqId) as HTMLScriptElement | null;
    if (!faqEl) { faqEl = document.createElement('script'); faqEl.id = faqId; faqEl.type = 'application/ld+json'; document.head.appendChild(faqEl); }
    faqEl.textContent = JSON.stringify(FAQ_SCHEMA);

    return () => {
      ['schema-ecommerce', 'schema-ecommerce-faq'].forEach((sid) => { const e = document.getElementById(sid); if (e) e.remove(); });
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
              <span className="text-[#1C1C1E]/65">E-commerce Търново 2026</span>
            </nav>

            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span className="text-[10px] px-2.5 py-1 rounded-full font-medium bg-teal-50 text-teal-700">E-commerce</span>
              <span className="text-[10px] px-2.5 py-1 rounded-full font-medium bg-orange-50 text-orange-700">Онлайн магазин</span>
              <span className="text-[10px] text-[#1C1C1E]/70">13 мин. четене · 5 Май 2026</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-light text-[#1C1C1E] leading-tight mb-5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              E-commerce стратегия
              <br />
              <em className="text-[#1C1C1E]/60">за Търново 2026 —</em>
              <br />
              <strong className="font-light">продавайте онлайн от Велико Търново.</strong>
            </h1>

            <p className="text-sm md:text-base text-[#1C1C1E]/65 max-w-2xl leading-relaxed mb-6">
              <strong className="text-[#1C1C1E]">Thalysta</strong> започна от нулата и достигна <strong className="text-[#1C1C1E]">+340% онлайн продажби</strong> за 6 месеца.
              <strong className="text-[#1C1C1E]"> Sunrise Food</strong> са #1 в Google за „гъби кладница онлайн".
              Ето пълната стратегия за e-commerce от Търново.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link to="/kontakt" className="px-6 py-3 bg-[#1C1C1E] text-white text-sm rounded-full hover:bg-[#1C1C1E]/80 transition-all cursor-pointer whitespace-nowrap">
                Консултация за e-commerce →
              </Link>
              <Link to="/uslugi/izrabotka-na-sait" className="px-6 py-3 border border-[#1C1C1E]/12 text-[#1C1C1E]/65 text-sm rounded-full hover:border-[#1C1C1E]/30 hover:text-[#1C1C1E] transition-all cursor-pointer whitespace-nowrap">
                Изработка на сайт
              </Link>
            </div>
          </div>
        </section>

        {/* ── HERO IMAGE ── */}
        <div className="w-full h-[280px] md:h-[420px] overflow-hidden">
          <img
            src="https://readdy.ai/api/search-image?query=e-commerce%20online%20store%20strategy%20shopping%20cart%20laptop%20screen%20product%20catalog%20digital%20marketing%20Bulgaria%20Veliko%20Tarnovo%20clean%20minimal%20white%20background%20professional%20modern&width=1400&height=420&seq=ecommerce-hero-img&orientation=landscape"
            alt="E-commerce стратегия за Търново 2026"
            className="w-full h-full object-cover object-top"
          />
        </div>

        <div className="max-w-4xl mx-auto px-4 md:px-16 py-12 md:py-16">

          {/* ── ВЪВЕДЕНИЕ ── */}
          <section className="mb-14">
            <h2 className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Защо e-commerce от Търново е възможен?
            </h2>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              <strong className="text-[#1C1C1E]">Thalysta</strong> е български бранд за ръчно изработени бижута, създаден от нулата в Търново.
              Онлайн магазинът е custom разработен от ТАВОРА ЕООД — дизайн, SEO, Product Schema, Meta Ads.
              Резултатът? <strong className="text-[#1C1C1E]">+340% онлайн продажби</strong> за 6 месеца.
            </p>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-6">
              В Търново не е нужно да сте в София, за да продавате онлайн.
              С правилната стратегия — сайт, SEO, реклами и UX — можете да продавате в цяла България и Европа.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-2xl bg-[#F9F9F7] border border-[#1C1C1E]/6">
              {[
                { value: '+340%', label: 'онлайн продажби Thalysta' },
                { value: '70%', label: 'поръчки от мобилно' },
                { value: '270%', label: 'конверсия с ревюта' },
                { value: '1999 €', label: 'онлайн магазин от' },
              ].map((s) => (
                <div key={s.value} className="text-center">
                  <div className="text-xl md:text-2xl font-light text-[#1C1C1E] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{s.value}</div>
                  <div className="text-[10px] text-[#1C1C1E]/65 leading-tight">{s.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ── ЧЕКЛИСТ ── */}
          <section className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[1px] bg-[#1C1C1E]/20 shrink-0" />
              <span className="text-xs text-[#1C1C1E]/60">Пълен чеклист</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              E-commerce чеклист — всичко, което трябва.
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {ECOMMERCE_CHECKLIST.map((cat) => (
                <div key={cat.category} className="rounded-2xl border border-[#1C1C1E]/8 overflow-hidden">
                  <div className="px-5 py-4 border-b border-[#1C1C1E]/6 flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center rounded-xl" style={{ backgroundColor: `${cat.color}15` }}>
                      <i className={`${cat.icon} text-sm`} style={{ color: cat.color }} />
                    </div>
                    <span className="text-sm font-medium text-[#1C1C1E]">{cat.category}</span>
                  </div>
                  <div className="p-5 space-y-3">
                    {cat.items.map((item) => (
                      <div key={item.label} className="flex items-start gap-2.5">
                        <div className="w-4 h-4 flex items-center justify-center rounded-full shrink-0 mt-0.5" style={{ backgroundColor: `${cat.color}15`, border: `1px solid ${cat.color}30` }}>
                          <i className="ri-check-line text-[9px]" style={{ color: cat.color }} />
                        </div>
                        <div>
                          <div className="text-xs font-medium text-[#1C1C1E]">{item.label}</div>
                          <div className="text-[11px] text-[#1C1C1E]/65 leading-relaxed">{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── СТЪПКИ ── */}
          <section className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[1px] bg-[#1C1C1E]/20 shrink-0" />
              <span className="text-xs text-[#1C1C1E]/60">Как работим</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              6 стъпки за онлайн магазин от Търново.
            </h2>

            <div className="space-y-4">
              {STEPS.map((s) => (
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
            <h2 className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              E-commerce от Търново — реални примери.
            </h2>

            <div className="space-y-5">
              {CASE_STUDIES.map((cs) => (
                <div key={cs.client} className="rounded-2xl border border-[#1C1C1E]/8 overflow-hidden">
                  <div className="p-5 md:p-7 border-b border-[#1C1C1E]/6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <div>
                        <a href={cs.url} target="_blank" rel="noopener noreferrer nofollow" className="text-base font-medium text-[#1C1C1E] hover:underline">{cs.client}</a>
                        <div className="text-xs text-[#1C1C1E]/65 mt-0.5">{cs.type}</div>
                      </div>
                      <span className="text-xs px-3 py-1 rounded-full font-medium shrink-0" style={{ backgroundColor: `${cs.color}15`, color: cs.color }}>{cs.result}</span>
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
              Чести въпроси за e-commerce.
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
                <div className="text-xs text-white/75 tracking-widest uppercase mb-2">Готови за онлайн продажби?</div>
                <div className="text-2xl md:text-3xl font-light leading-tight mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Онлайн магазин от Търново
                  <br />
                  <span className="italic text-white/60">от 1999 € — всичко включено.</span>
                </div>
                <p className="text-sm text-white/75 max-w-md leading-relaxed">Консултация 50 € — анализ на вашия продукт, конкуренти и стратегия. Приспада се при договор.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <Link to="/kontakt" className="px-7 py-3.5 bg-white text-[#0A2540] text-sm rounded-full hover:bg-white/90 transition-all cursor-pointer whitespace-nowrap text-center font-medium">Поискайте оферта →</Link>
                <Link to="/uslugi/izrabotka-na-sait" className="px-7 py-3.5 border border-white/20 text-white/70 text-sm rounded-full hover:border-white/40 hover:text-white transition-all cursor-pointer whitespace-nowrap text-center">Изработка на сайт</Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SharedFooter />
    </div>
  );
}