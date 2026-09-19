import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SharedNav from '@/components/feature/SharedNav';
import SharedFooter from '@/components/feature/SharedFooter';

const FAQ_ITEMS = [
  {
    q: 'Колко струват Meta рекламите за бизнес в Търново?',
    a: 'Управлението на Meta реклами (Facebook + Instagram) от ТАВОРА ЕООД започва от 290 € на месец. Рекламният бюджет (парите, отиващи директно към Meta) е отделен и се определя индивидуално — препоръчваме минимум 200–300 лв. на месец за локален бизнес в Търново.',
  },
  {
    q: 'Кои бизнеси в Търново се представят най-добре с Meta реклами?',
    a: 'Ресторанти, кафенета, хотели, козметични салони, фитнес центрове, магазини за дрехи и местни услуги. Meta е особено ефективна за бизнеси с визуален продукт или услуга, насочени към местна аудитория в Търново и областта.',
  },
  {
    q: 'Каква е разликата между Meta реклами и Google реклами за Търново?',
    a: 'Meta (Facebook/Instagram) е за discovery — показвате се на хора, преди да са потърсили. Google е за intent — показвате се, когато вече търсят. За локален бизнес в Търново препоръчваме комбинация от двете. Meta за awareness и ретаргетинг, Google за директни заявки.',
  },
  {
    q: 'Колко бързо ще видя резултати от Meta реклами в Търново?',
    a: 'Първите резултати (импресии, кликове, запитвания) са видими в рамките на 24–48 часа след стартиране. Оптимизацията и мащабирането стават след 30–60 дни, когато алгоритъмът е научил аудиторията. За локален бизнес в Търново с добър продукт — резултатите са бързи.',
  },
  {
    q: 'Трябва ли ми Facebook страница за Meta реклами?',
    a: 'Да — нужна е Facebook страница и/или Instagram профил. Ако нямате, помагаме за създаването и оптимизацията им. Рекламите излизат от страницата ви, не от личния профил.',
  },
  {
    q: 'Как таргетирате аудиторията в Търново?',
    a: 'Таргетираме по местоположение (Велико Търново + радиус), демография (възраст, пол), интереси и поведение. За ретаргетинг използваме Meta Pixel — показваме реклами на хора, посетили сайта ви. За lookalike аудитории — намираме хора, подобни на съществуващите ви клиенти.',
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

const today = new Date().toISOString().split('T')[0];

const PAGE_SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      '@id': 'https://imashnujnoto.com/blog/meta-reklami-tarnovo#article',
      headline: 'Как да правим Meta реклами за бизнес в Търново — реални примери и стратегии',
      description: 'Пълно ръководство за Meta реклами (Facebook + Instagram) за бизнеси от Велико Търново. Реални примери, таргетиране, бюджети и стратегии от ТАВОРА ЕООД.',
      url: 'https://imashnujnoto.com/blog/meta-reklami-tarnovo',
      inLanguage: 'bg',
      datePublished: '2026-05-05',
      dateModified: today,
      wordCount: 1800,
      timeRequired: 'PT8M',
      keywords: ['Meta реклами Велико Търново', 'Facebook реклами Търново', 'Instagram реклами Търново', 'дигитален маркетинг Търново'],
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
      isPartOf: { '@id': 'https://imashnujnoto.com/#website' },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Начало', item: 'https://imashnujnoto.com/' },
          { '@type': 'ListItem', position: 2, name: 'Блог', item: 'https://imashnujnoto.com/blog' },
          { '@type': 'ListItem', position: 3, name: 'Meta реклами Търново', item: 'https://imashnujnoto.com/blog/meta-reklami-tarnovo' },
        ],
      },
      about: [
        { '@type': 'Thing', name: 'Meta Ads', sameAs: 'https://www.facebook.com/business/ads' },
        { '@type': 'Thing', name: 'Facebook реклами' },
        { '@type': 'Thing', name: 'Instagram реклами' },
        { '@type': 'Place', name: 'Велико Търново', sameAs: 'https://www.wikidata.org/wiki/Q82425' },
      ],
      mentions: [
        { '@type': 'Organization', name: 'ТАВОРА ЕООД', url: 'https://imashnujnoto.com' },
        { '@type': 'Organization', name: 'K-Food Велико Търново', url: 'https://k-foodvelikotarnovo.com/' },
        { '@type': 'Organization', name: 'Sunrise Food', url: 'https://sunrisefood.eu/' },
      ],
    },
  ],
};

const STEPS = [
  {
    num: '01',
    title: 'Дефинирайте целта',
    desc: 'Преди да харчите бюджет — знайте какво искате. Awareness (повече хора да знаят за вас)? Трафик към сайта? Директни запитвания? Продажби? Всяка цел изисква различна кампания.',
    tip: 'За ресторант в Търново — целта обикновено е "Reach" (обхват) + "Messages" (директни съобщения за резервации).',
  },
  {
    num: '02',
    title: 'Таргетирайте правилно',
    desc: 'Не таргетирайте "всички в България". Таргетирайте хора в Велико Търново + 20 км радиус, на правилната възраст, с правилните интереси. По-малка аудитория = по-ниска цена на резултат.',
    tip: 'За локален бизнес в Търново — аудитория от 15,000–50,000 е оптимална. По-малко е по-добре.',
  },
  {
    num: '03',
    title: 'Създайте спиращ скролването креатив',
    desc: 'Имате 1.7 секунди да спрете скролването. Видеото работи по-добре от снимките. Покажете реалния продукт, реалните хора, реалното място. Автентичността бие перфекцията.',
    tip: 'Видео от 15–30 секунди с hook в първите 3 секунди. "Знаете ли, че в Търново има..." работи добре.',
  },
  {
    num: '04',
    title: 'Тествайте и оптимизирайте',
    desc: 'Пускайте 2–3 варианта на рекламата едновременно. След 7 дни — спрете неефективните, мащабирайте работещите. Никога не правете промени в активна кампания преди 7 дни.',
    tip: 'A/B тествайте само едно нещо наведнъж — заглавие, снимка или аудитория. Не всичко едновременно.',
  },
  {
    num: '05',
    title: 'Ретаргетирайте',
    desc: 'Инсталирайте Meta Pixel на сайта си. Показвайте реклами на хора, посетили сайта, но не са купили/запитали. Ретаргетингът е 3–5 пъти по-евтин от студена аудитория.',
    tip: 'Ретаргетинг аудитория: "Посетили сайта последните 30 дни, но не са попълнили форма".',
  },
];

const EXAMPLES = [
  {
    type: 'Ресторант',
    city: 'Велико Търново',
    campaign: 'Reach + Messages',
    budget: '300 лв. / мес.',
    result: '12,000 обхват · 45 резервации',
    desc: 'Видео от 20 сек. с реална храна и атмосфера. Таргет: 25–55 г., Търново + 15 км. CTA: "Резервирайте маса →"',
    color: '#2F9E44',
  },
  {
    type: 'Козметичен салон',
    city: 'Велико Търново',
    campaign: 'Lead Generation',
    budget: '200 лв. / мес.',
    result: '28 нови клиенти',
    desc: 'Carousel с преди/след снимки. Таргет: жени 20–45 г., Търново. Lead форма директно в Meta — без да напускат приложението.',
    color: '#C2255C',
  },
  {
    type: 'Онлайн магазин',
    city: 'Цяла България',
    campaign: 'Conversions',
    budget: '500 лв. / мес.',
    result: 'ROAS 4.2x',
    desc: 'Dynamic product ads с Meta Pixel. Ретаргетинг на изоставени колички. Lookalike аудитория от съществуващи купувачи.',
    color: '#E67700',
  },
];

const RELATED_ARTICLES = [
  { title: 'Реклама Велико Търново', to: '/reklama-veliko-tarnovo', icon: 'ri-advertisement-line' },
  { title: 'SEO оптимизация Велико Търново', to: '/seo-veliko-tarnovo', icon: 'ri-search-line' },
  { title: 'Дигитален маркетинг Велико Търново', to: '/digitalen-marketing-veliko-tarnovo', icon: 'ri-bar-chart-line' },
  { title: 'GEO & AI оптимизация Търново', to: '/blog/geo-ai-tarnovo', icon: 'ri-robot-line' },
  { title: 'Google Business Profile Търново', to: '/blog/google-business-vt', icon: 'ri-map-pin-line' },
];

export default function MetaReklamiTarnovoPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    document.title = 'Meta реклами Велико Търново | Facebook и Instagram реклами — ТАВОРА ЕООД';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', 'Как да правим Meta реклами за бизнес в Търново — реални примери, таргетиране, бюджети и стратегии. Facebook + Instagram реклами от ТАВОРА ЕООД.');
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://imashnujnoto.com/blog/meta-reklami-tarnovo');

    const id = 'schema-meta-reklami';
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) { el = document.createElement('script'); el.id = id; el.type = 'application/ld+json'; document.head.appendChild(el); }
    el.textContent = JSON.stringify(PAGE_SCHEMA);

    const faqId = 'schema-meta-reklami-faq';
    let faqEl = document.getElementById(faqId) as HTMLScriptElement | null;
    if (!faqEl) { faqEl = document.createElement('script'); faqEl.id = faqId; faqEl.type = 'application/ld+json'; document.head.appendChild(faqEl); }
    faqEl.textContent = JSON.stringify(FAQ_SCHEMA);

    return () => {
      ['schema-meta-reklami', 'schema-meta-reklami-faq'].forEach((sid) => { const e = document.getElementById(sid); if (e) e.remove(); });
    };
  }, []);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <SharedNav />

      <main>
        {/* ── HERO ── */}
        <section className="max-w-4xl mx-auto px-4 md:px-16 pt-14 md:pt-24 pb-10">
          <nav aria-label="breadcrumb" className="flex items-center gap-2 text-[11px] text-[#1C1C1E]/65 mb-8 flex-wrap">
            <Link to="/" className="hover:text-[#1C1C1E]/60 transition-colors">Начало</Link>
            <i className="ri-arrow-right-s-line text-xs" />
            <Link to="/blog" className="hover:text-[#1C1C1E]/60 transition-colors">Блог</Link>
            <i className="ri-arrow-right-s-line text-xs" />
            <span className="text-[#1C1C1E]/65">Meta реклами Търново</span>
          </nav>

          <div className="flex items-center gap-3 mb-5">
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#E67700]/10 text-[#E67700] font-medium tracking-wide">Реклами</span>
            <span className="text-[10px] text-[#1C1C1E]/70">28 Апр 2026 · 8 мин. четене</span>
          </div>

          <h1
            className="text-3xl md:text-5xl font-light text-[#1C1C1E] leading-tight mb-6"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Как да правим <strong className="font-light">Meta реклами</strong>
            <br />
            <em className="text-[#1C1C1E]/60">за бизнес в Търново.</em>
          </h1>

          <p className="text-sm md:text-base text-[#1C1C1E]/65 leading-relaxed mb-6 max-w-2xl">
            <strong className="text-[#1C1C1E]">Meta реклами</strong> (Facebook + Instagram) са един от най-ефективните канали за
            локален бизнес в <strong className="text-[#1C1C1E]">Велико Търново</strong>. Но само ако са направени правилно.
            Повечето бизнеси в Търново харчат бюджет без стратегия — и не виждат резултати.
          </p>
          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-8 max-w-2xl">
            В тази статия ще разгледаме реални примери от кампании за бизнеси в Търново —
            какво работи, какво не работи и как да таргетирате правилната аудитория.
            Написано от екипа на <Link to="/digitalen-marketing-veliko-tarnovo" className="text-[#1C1C1E] underline decoration-dotted hover:no-underline">ТАВОРА ЕООД</Link> — дигитален маркетинг агенция в Търново.
          </p>

          {/* Quick stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-[#F9F9F7] border border-[#1C1C1E]/6 mb-10">
            {[
              { val: '1.7 сек.', label: 'за спиране на скролването' },
              { val: '3–5x', label: 'по-евтин ретаргетинг' },
              { val: '290 €', label: 'управление / мес.' },
            ].map((s) => (
              <div key={s.val} className="text-center">
                <div className="text-lg md:text-xl font-light text-[#1C1C1E] mb-0.5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{s.val}</div>
                <div className="text-[10px] text-[#1C1C1E]/65 leading-tight">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── ЗАЩО META ── */}
        <section className="max-w-4xl mx-auto px-4 md:px-16 py-10 border-t border-[#1C1C1E]/6">
          <h2 className="text-xl md:text-3xl font-light text-[#1C1C1E] mb-5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Защо Meta реклами за бизнес в Търново?
          </h2>
          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-5">
            Велико Търново има около 70,000 жители. Активните потребители на Facebook и Instagram в Търново и областта са около 40,000–50,000.
            Това означава, че с правилно таргетиране можете да достигнете почти всеки потенциален клиент в града.
          </p>
          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-6">
            За разлика от <Link to="/seo-veliko-tarnovo" className="text-[#1C1C1E] underline decoration-dotted hover:no-underline">SEO оптимизацията</Link>, която отнема месеци,
            Meta рекламите дават резултати в рамките на часове. Идеални са за промоции, сезонни кампании и бързо привличане на нови клиенти.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: 'ri-map-pin-line', title: 'Локално таргетиране', desc: 'Само хора в Търново и областта — без да плащате за нерелевантна аудитория.' },
              { icon: 'ri-eye-line', title: 'Визуален формат', desc: 'Снимки и видео — идеални за ресторанти, салони, магазини и услуги.' },
              { icon: 'ri-bar-chart-line', title: 'Измерими резултати', desc: 'Виждате точно колко хора са видели, кликнали и купили.' },
              { icon: 'ri-refresh-line', title: 'Ретаргетинг', desc: 'Показвайте реклами на хора, посетили сайта ви — 3–5x по-евтино.' },
            ].map((item) => (
              <div key={item.title} className="flex gap-3 p-4 rounded-xl border border-[#1C1C1E]/8 bg-[#F9F9F7]">
                <div className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E67700]/20 bg-[#E67700]/8 shrink-0">
                  <i className={`${item.icon} text-[#E67700] text-sm`} />
                </div>
                <div>
                  <div className="text-xs font-medium text-[#1C1C1E] mb-0.5">{item.title}</div>
                  <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 5 СТЪПКИ ── */}
        <section className="max-w-4xl mx-auto px-4 md:px-16 py-10 border-t border-[#1C1C1E]/6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-6 h-[1px] bg-[#1C1C1E]/20 shrink-0" />
            <span className="text-xs text-[#1C1C1E]/60">Стъпка по стъпка</span>
          </div>
          <h2 className="text-xl md:text-3xl font-light text-[#1C1C1E] mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            5 стъпки за успешна Meta кампания в Търново.
          </h2>

          <div className="space-y-4">
            {STEPS.map((step) => (
              <div key={step.num} className="p-5 rounded-2xl border border-[#1C1C1E]/8 bg-white">
                <div className="flex items-start gap-4">
                  <span className="text-[11px] font-medium text-[#1C1C1E]/25 tracking-widest shrink-0 w-6 mt-0.5">{step.num}</span>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-[#1C1C1E] mb-2">{step.title}</h3>
                    <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-3">{step.desc}</p>
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-[#E67700]/6 border border-[#E67700]/15">
                      <i className="ri-lightbulb-line text-[#E67700] text-xs shrink-0 mt-0.5" />
                      <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">{step.tip}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── РЕАЛНИ ПРИМЕРИ ── */}
        <section className="bg-[#F9F9F7] border-y border-[#1C1C1E]/6">
          <div className="max-w-4xl mx-auto px-4 md:px-16 py-10 md:py-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-6 h-[1px] bg-[#1C1C1E]/20 shrink-0" />
              <span className="text-xs text-[#1C1C1E]/60">Реални примери</span>
            </div>
            <h2 className="text-xl md:text-3xl font-light text-[#1C1C1E] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Реални кампании. Реални резултати.
            </h2>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-8 max-w-xl">
              Примери от кампании, управлявани от <Link to="/reklama-veliko-tarnovo" className="text-[#1C1C1E] underline decoration-dotted hover:no-underline">ТАВОРА ЕООД за бизнеси в Търново</Link> и България.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {EXAMPLES.map((ex) => (
                <div key={ex.type} className="p-5 rounded-2xl bg-white border border-[#1C1C1E]/8">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-[#1C1C1E]">{ex.type}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: `${ex.color}12`, color: ex.color }}>{ex.city}</span>
                  </div>
                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-[#1C1C1E]/70 w-16 shrink-0">Кампания</span>
                      <span className="text-xs text-[#1C1C1E]/60">{ex.campaign}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-[#1C1C1E]/70 w-16 shrink-0">Бюджет</span>
                      <span className="text-xs text-[#1C1C1E]/60">{ex.budget}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-[#1C1C1E]/70 w-16 shrink-0">Резултат</span>
                      <span className="text-xs font-medium" style={{ color: ex.color }}>{ex.result}</span>
                    </div>
                  </div>
                  <p className="text-xs text-[#1C1C1E]/65 leading-relaxed border-t border-[#1C1C1E]/6 pt-3">{ex.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── ГРЕШКИ ── */}
        <section className="max-w-4xl mx-auto px-4 md:px-16 py-10 border-b border-[#1C1C1E]/6">
          <h2 className="text-xl md:text-3xl font-light text-[#1C1C1E] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            5 грешки, които правят бизнесите в Търново.
          </h2>
          <div className="space-y-3">
            {[
              { num: '01', title: 'Таргетират цяла България', fix: 'Таргетирайте само Търново + 20–30 км радиус. По-малка аудитория = по-ниска цена на резултат.' },
              { num: '02', title: 'Пускат само снимки', fix: 'Видеото получава 3x повече engagement от снимките. Дори 15-секундно видео с телефон е по-добро от перфектна снимка.' },
              { num: '03', title: 'Нямат ясен CTA', fix: 'Всяка реклама трябва да казва точно какво да направи потребителят: "Резервирайте", "Поръчайте", "Пишете ни".' },
              { num: '04', title: 'Спират кампанията след 3 дни', fix: 'Алгоритъмът на Meta се нуждае от 7–14 дни за оптимизация. Спирането преди това нулира обучението.' },
              { num: '05', title: 'Нямат Meta Pixel', fix: 'Без Pixel не можете да правите ретаргетинг и lookalike аудитории — губите 60% от потенциала на Meta рекламите.' },
            ].map((item) => (
              <div key={item.num} className="flex gap-4 p-4 rounded-xl border border-[#1C1C1E]/8 bg-white">
                <span className="text-[10px] font-medium text-[#1C1C1E]/20 tracking-widest shrink-0 w-5 mt-0.5">{item.num}</span>
                <div>
                  <div className="text-sm font-medium text-[#1C1C1E] mb-1 line-through decoration-[#C2255C]/50">{item.title}</div>
                  <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">{item.fix}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="max-w-4xl mx-auto px-4 md:px-16 py-10 border-b border-[#1C1C1E]/6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-6 h-[1px] bg-[#1C1C1E]/20 shrink-0" />
            <span className="text-xs text-[#1C1C1E]/60">Въпроси и отговори</span>
          </div>
          <h2 className="text-xl md:text-3xl font-light text-[#1C1C1E] mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Честни отговори за Meta реклами в Търново.
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

        {/* ── СВЪРЗАНИ ЛИНКОВЕ ── */}
        <section className="max-w-4xl mx-auto px-4 md:px-16 py-10 border-b border-[#1C1C1E]/6">
          <div className="text-xs text-[#1C1C1E]/65 tracking-widest uppercase mb-5">Свързани теми</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {RELATED_ARTICLES.map((a) => (
              <Link
                key={a.to}
                to={a.to}
                className="flex items-center gap-3 p-4 rounded-xl border border-[#1C1C1E]/8 bg-white hover:border-[#1C1C1E]/20 transition-all group"
              >
                <div className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E67700]/15 bg-[#E67700]/6 shrink-0">
                  <i className={`${a.icon} text-[#E67700]/70 text-sm`} />
                </div>
                <span className="text-sm text-[#1C1C1E]/60 group-hover:text-[#1C1C1E] transition-colors">{a.title}</span>
                <i className="ri-arrow-right-line text-[#1C1C1E]/20 text-sm ml-auto group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="max-w-4xl mx-auto px-4 md:px-16 py-10 md:py-16">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-7 md:p-10 rounded-2xl bg-[#0F1F35]">
            <div>
              <h3 className="text-xl md:text-2xl font-light text-white mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Искате Meta реклами за вашия бизнес в Търново?
              </h3>
              <p className="text-sm text-white/75 max-w-md leading-relaxed">
                Консултацията е 50 € — анализ на конкурентите, стратегия и план. Сумата се приспада при договор.
                <Link to="/reklama-veliko-tarnovo" className="text-white/70 underline decoration-dotted hover:text-white ml-1 transition-colors">Виж всички рекламни услуги →</Link>
              </p>
            </div>
            <Link
              to="/kontakt"
              className="shrink-0 px-7 py-3.5 bg-white text-[#0F1F35] text-sm rounded-full hover:bg-white/90 transition-colors cursor-pointer whitespace-nowrap font-medium"
            >
              Поискайте оферта →
            </Link>
          </div>
        </section>
      </main>

      <SharedFooter />
    </div>
  );
}
