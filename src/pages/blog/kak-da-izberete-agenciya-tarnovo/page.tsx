import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SharedNav from '@/components/feature/SharedNav';
import SharedFooter from '@/components/feature/SharedFooter';

const FAQ_ITEMS = [
  {
    q: 'Колко струва маркетинг агенция в Търново?',
    a: 'Цените в Търново са по-достъпни от София. SEO пакет — от 390 €. Рекламен бюджет — от 300 лв./мес. Изработка на сайт — от 999 €. Консултацията е 50 € и се приспада при договор.',
  },
  {
    q: 'Трябва ли агенцията да е физически в Търново?',
    a: 'Предимство е — познават местния пазар, конкурентите и аудиторията. ТАВОРА ЕООД е в Търново, на ул. „Велчо Джамджията". Но работим и с клиенти от цяла България дистанционно.',
  },
  {
    q: 'Как да разпозная добра агенция от лоша?',
    a: 'Добра агенция има: верифицируеми резултати (проверими в Google), прозрачно ценообразуване, реални клиенти с живи сайтове, Schema.org оптимизация, блог с полезно съдържание. Лоша агенция обещава „гарантиран #1" без доказателства.',
  },
  {
    q: 'Колко време отнема да видя резултати?',
    a: 'SEO — 1–3 месеца за локални думи, 3–6 за национални. Реклами — 1–2 седмици. Изработка на сайт — 2–4 седмици. Видео — 5 работни дни. Бързите обещания са червен флаг.',
  },
  {
    q: 'Мога ли да правя маркетинга сам?',
    a: 'Да — за малък бизнес в Търново можете да започнете сами. Но за резултати като #1 в Google за конкурентни думи са нужни професионални инструменти, Schema оптимизация и стратегия. Агенцията спестява време и пари в дългосрочен план.',
  },
  {
    q: 'Какво включва SEO пакет от 390 €?',
    a: 'Технически одит, on-page оптимизация, Google Business Profile настройка, LocalBusiness Schema, GEO оптимизация за AI търсачки, 3 месеца мониторинг и отчети. Вижте пълната информация на страницата за SEO Търново.',
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

const ARTICLE_SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      '@id': 'https://imashnujnoto.com/blog/kak-da-izberete-agenciya-tarnovo#article',
      headline: 'Как да изберете маркетинг агенция в Търново — честен гид 2026',
      description: 'Как да изберете маркетинг агенция в Търново. Честни отговори за цени, срокове, резултати и червени флагове. Сравнение на агенциите в Търново. ТАВОРА ЕООД.',
      url: 'https://imashnujnoto.com/blog/kak-da-izberete-agenciya-tarnovo',
      datePublished: '2026-05-05',
      dateModified: today,
      inLanguage: 'bg',
      wordCount: 3400,
      timeRequired: 'PT12M',
      keywords: ['маркетинг агенция Търново', 'SEO агенция Търново', 'как да избера агенция', 'дигитален маркетинг Търново', 'цени маркетинг'],
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
        url: 'https://readdy.ai/api/search-image?query=marketing%20agency%20comparison%20checklist%20professional%20office%20meeting%20consultation%20Bulgaria%20Veliko%20Tarnovo%20clean%20minimal%20white%20background%20charts&width=1200&height=630&seq=agenciya-hero&orientation=landscape',
        width: 1200,
        height: 630,
      },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Начало', item: 'https://imashnujnoto.com/' },
          { '@type': 'ListItem', position: 2, name: 'Блог', item: 'https://imashnujnoto.com/blog' },
          { '@type': 'ListItem', position: 3, name: 'Как да изберете агенция Търново', item: 'https://imashnujnoto.com/blog/kak-da-izberete-agenciya-tarnovo' },
        ],
      },
    },
    {
      '@type': 'HowTo',
      name: 'Как да изберете маркетинг агенция в Търново — стъпка по стъпка',
      description: 'Практически стъпки за избор на маркетинг агенция в Велико Търново — от проверка на резултати до подписване на договор.',
      step: [
        {
          '@type': 'HowToStep',
          position: 1,
          name: 'Проверете верифицируеми резултати',
          text: 'Поискайте URL адреси на реални клиенти. Отворете Google, потърсете сами. Ако агенцията няма проверими резултати — това е червен флаг.',
          url: 'https://imashnujnoto.com/blog/kak-da-izberete-agenciya-tarnovo#rezultati',
        },
        {
          '@type': 'HowToStep',
          position: 2,
          name: 'Проверете собствения сайт на агенцията',
          text: 'Добрата агенция има SEO оптимизиран сайт с блог, Schema.org markup и бърза скорост. Ако нямат — не практикуват това, което продават.',
          url: 'https://imashnujnoto.com/blog/kak-da-izberete-agenciya-tarnovo#sajt',
        },
        {
          '@type': 'HowToStep',
          position: 3,
          name: 'Сравнете цените прозрачно',
          text: 'Ясни пакети с ясни цени — не „зависи". SEO от 390 €, сайт от 999 €, реклами от 290 €/мес. Скрити разходи са червен флаг.',
          url: 'https://imashnujnoto.com/blog/kak-da-izberete-agenciya-tarnovo#ceni',
        },
        {
          '@type': 'HowToStep',
          position: 4,
          name: 'Тествате познанията им за GEO и AI',
          text: 'Попитайте за GEO оптимизация, Person Schema и Entity statements. Ако не знаят какво е — останали са в 2020. AI търсачките са новият Google.',
          url: 'https://imashnujnoto.com/blog/kak-da-izberete-agenciya-tarnovo#geo',
        },
        {
          '@type': 'HowToStep',
          position: 5,
          name: 'Консултация и договор',
          text: 'Консултацията трябва да включва анализ на вашия бизнес, не само продажба. Договорът трябва да има гаранция за връщане на парите при липса на резултати.',
          url: 'https://imashnujnoto.com/blog/kak-da-izberete-agenciya-tarnovo#dogovor',
        },
      ],
    },
  ],
};

const RED_FLAGS = [
  { flag: '„Гарантиран #1 за 1 седмица"', why: 'SEO отнема време. Никой не може да гарантира #1 за конкурентна дума за седмица. Това е лъжа.', severity: 'Критичен', color: '#E03131' },
  { flag: 'Няма верифицируеми резултати', why: 'Ако агенцията не може да покаже реални клиенти с реални сайтове, които да проверите в Google — това е червен флаг.', severity: 'Критичен', color: '#E03131' },
  { flag: 'Непрозрачно ценообразуване', why: '„Зависи" за всяка цена е проблем. Добрата агенция има ясни пакети с ясни цени.', severity: 'Висок', color: '#E8590C' },
  { flag: 'Няма собствен блог или сайт', why: 'Ако агенцията няма SEO оптимизиран сайт с блог — тя не практикува това, което продава.', severity: 'Висок', color: '#E8590C' },
  { flag: 'Няма Schema.org оптимизация', why: 'Без LocalBusiness, FAQPage и Person Schema — агенцията не е в крак с 2026 SEO стандартите.', severity: 'Среден', color: '#F76707' },
  { flag: 'Обещава хиляди backlinks за 50 €', why: 'Евтини backlinks от спам сайтове вредят. Google наказва такива практики. Качествените линкове са скъпи и бавни.', severity: 'Критичен', color: '#E03131' },
  { flag: 'Няма договор или гаранция', why: 'Работа без договор = няма ангажимент. Гаранция за връщане на парите при липса на резултати е задължителна.', severity: 'Висок', color: '#E8590C' },
  { flag: 'Не разбира GEO оптимизация', why: 'В 2026 GEO (оптимизация за AI търсачки) е задължителна. Ако агенцията не знае какво е GEO — тя е останала в 2020.', severity: 'Среден', color: '#F76707' },
];

const GREEN_FLAGS = [
  { flag: 'Верифицируеми резултати', why: 'Можете да отворите Google и да проверите — това е #1 доказателство. K-Food #1, Sunrise Food #1, Thalysta нарастващ трафик.', color: '#2F9E44' },
  { flag: 'Прозрачни цени', why: 'Ясни пакети: SEO от 390 €, реклами от 300 лв./мес., сайт от 999 €. Без скрити разходи.', color: '#2F9E44' },
  { flag: 'SEO оптимизиран собствен сайт', why: 'Агенцията трябва да е пример. Schema.org, FAQPage, блог, бърз сайт, мобилна оптимизация.', color: '#2F9E44' },
  { flag: 'GEO и AI оптимизация', why: 'ChatGPT, Perplexity, Gemini — AI търсачките са новият Google. Агенцията трябва да разбира GEO.', color: '#2F9E44' },
  { flag: 'Реални клиенти с живи сайтове', why: 'K-Food, Sunrise Food, Thalysta, NMOM, Budimse — всички са живи и проверими.', color: '#2F9E44' },
  { flag: 'Гаранция за връщане на парите', why: 'При липса на обещаните резултати — парите се връщат. Това е истинска гаранция.', color: '#2F9E44' },
  { flag: 'Местна експертиза', why: 'Познаване на Търново — конкуренти, аудитория, местни медии, местни директории. Това е ценно.', color: '#2F9E44' },
  { flag: 'Пълна услуга — не само SEO', why: 'SEO + реклами + видео + сайт = цялостен подход. Агенция, която прави само едно нещо, не може да види голямата картина.', color: '#2F9E44' },
];

const COMPETITION = [
  { name: 'ТОРО РАНК', years: '~3г', strengths: '5/5 Google ревюта, „SEO копирайтинг"', weaknesses: 'Няма GEO оптимизация, няма видео услуги', whereWeWin: 'GEO/AI оптимизация, видео, реклами, Schema' },
  { name: 'CreateX', years: '~8г', strengths: 'Starbucks/Praktiker, 360° маркетинг', weaknesses: 'Няма локално SEO специализация за Търново', whereWeWin: 'Локално SEO, GEO, блог, верифицируеми резултати' },
  { name: 'Linkbox', years: '~4г', strengths: '450% ръст, безплатен SEO анализ', weaknesses: 'Няма видео продукция, няма рекламни кампании', whereWeWin: 'Видео, GEO, реални резултати, пълен дигитален маркетинг' },
  { name: 'DizArt', years: '~12г', strengths: 'Физическа реклама + уеб от 2014', weaknesses: 'Остаряла SEO стратегия, няма AI оптимизация', whereWeWin: 'Дигитална реклама, SEO 2026, GEO, Schema' },
  { name: 'Webinfit', years: '~7г', strengths: '„Super бързи" сайтове', weaknesses: 'Няма SEO оптимизация от старт, няма видео', whereWeWin: 'SEO от старт, Schema, GEO, цялостен подход' },
];

const TAVORA_COMPETITION_ROW = {
  name: 'ТАВОРА ЕООД',
  years: '~3г',
  strengths: 'GEO оптимизация, Schema.org, видео, реклами, блог, медийни споменавания',
  weaknesses: 'По-малка агенция (2 човека), по-ограничени ресурси',
  whereWeWin: 'Верифицируеми резултати, GEO, AI оптимизация, честност, без скрити такси',
};

const PRICES = [
  { service: 'SEO оптимизация', price: 'от 390 €', included: 'Технически одит, on-page, GBP, Schema, GEO, 3 мес. мониторинг', time: '1–3 мес.' },
  { service: 'Рекламни кампании', price: 'от 300 лв./мес.', included: 'Meta + Google Ads настройка, 2 кампании, месечен отчет', time: '1–2 седм.' },
  { service: 'Изработка на сайт', price: 'от 999 €', included: 'Дизайн, разработка, SEO от старт, Schema, мобилна версия', time: '2–4 седм.' },
  { service: 'Видео продукция', price: 'от 250 €', included: 'Сценарий, заснемане, монтаж, субтитри, оптимизация за социални', time: '5 дни' },
  { service: 'GEO оптимизация', price: 'от 190 €', included: 'Entity statements, Person Schema, WebSite Schema, HowTo, mentions', time: '3–5 дни' },
  { service: 'Консултация', price: '50 €', included: 'Анализ на сайта, конкуренти, стратегия, план. Приспада се при договор.', time: '1 час' },
];

const RELATED = [
  { title: 'SEO оптимизация Търново 2026', to: '/blog/seo-optimizaciya-tarnovo-2026', cat: 'SEO', color: 'bg-sky-50 text-sky-700' },
  { title: 'Безплатен SEO за #1', to: '/blog/bezplaten-seo-nomer-edno-google', cat: 'SEO', color: 'bg-emerald-50 text-emerald-700' },
  { title: 'Дигитален маркетинг Търново', to: '/digitalen-marketing-veliko-tarnovo', cat: 'Ръководство', color: 'bg-emerald-50 text-emerald-700' },
  { title: 'Реклама Търново', to: '/reklama-veliko-tarnovo', cat: 'Реклама', color: 'bg-orange-50 text-orange-700' },
  { title: 'Изработка на сайт Търново', to: '/blog/izrabotka-na-sait-tarnovo', cat: 'Уеб дизайн', color: 'bg-teal-50 text-teal-700' },
  { title: 'Контакт с ТАВОРА', to: '/kontakt', cat: 'Контакт', color: 'bg-sky-50 text-sky-700' },
];

export default function KakDaIzbereteAgenciyaTarnovoPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    document.title = 'Как да изберете маркетинг агенция в Търново — честен гид 2026 | ТАВОРА ЕООД';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', 'Как да изберете маркетинг агенция в Търново. Честни отговори за цени, срокове, резултати и червени флагове. Сравнение на агенциите в Търново. ТАВОРА ЕООД.');
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://imashnujnoto.com/blog/kak-da-izberete-agenciya-tarnovo');

    const id = 'schema-agenciya';
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) { el = document.createElement('script'); el.id = id; el.type = 'application/ld+json'; document.head.appendChild(el); }
    el.textContent = JSON.stringify(ARTICLE_SCHEMA);

    const faqId = 'schema-agenciya-faq';
    let faqEl = document.getElementById(faqId) as HTMLScriptElement | null;
    if (!faqEl) { faqEl = document.createElement('script'); faqEl.id = faqId; faqEl.type = 'application/ld+json'; document.head.appendChild(faqEl); }
    faqEl.textContent = JSON.stringify(FAQ_SCHEMA);

    return () => {
      ['schema-agenciya', 'schema-agenciya-faq'].forEach((sid) => { const e = document.getElementById(sid); if (e) e.remove(); });
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
              <span className="text-[#1C1C1E]/65">Как да изберете агенция</span>
            </nav>

            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span className="text-[10px] px-2.5 py-1 rounded-full font-medium bg-sky-50 text-sky-700">Маркетинг агенция</span>
              <span className="text-[10px] px-2.5 py-1 rounded-full font-medium bg-orange-50 text-orange-700">Сравнение</span>
              <span className="text-[10px] text-[#1C1C1E]/70">12 мин. четене · 5 Май 2026</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-light text-[#1C1C1E] leading-tight mb-5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Как да изберете
              <br />
              <em className="text-[#1C1C1E]/60">маркетинг агенция</em>
              <br />
              <strong className="font-light">в Търново — честен гид.</strong>
            </h1>

            <p className="text-sm md:text-base text-[#1C1C1E]/65 max-w-2xl leading-relaxed mb-6">
              Не всички агенции са еднакви. Някои обещават света и доставят нищо.
              Други работят тихо и класират клиентите си на <strong className="text-[#1C1C1E]">#1 в Google</strong>.
              Ето как да разпознаете разликата — преди да дадете парите си.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link to="/kontakt" className="px-6 py-3 bg-[#1C1C1E] text-white text-sm rounded-full hover:bg-[#1C1C1E]/80 transition-all cursor-pointer whitespace-nowrap">
                Консултация 50 € →
              </Link>
              <Link to="/uslugi" className="px-6 py-3 border border-[#1C1C1E]/12 text-[#1C1C1E]/65 text-sm rounded-full hover:border-[#1C1C1E]/30 hover:text-[#1C1C1E] transition-all cursor-pointer whitespace-nowrap">
                Вижте нашите услуги
              </Link>
            </div>
          </div>
        </section>

        {/* ── HERO IMAGE ── */}
        <div className="w-full h-[280px] md:h-[420px] overflow-hidden">
          <img
            src="https://readdy.ai/api/search-image?query=marketing%20agency%20comparison%20checklist%20professional%20office%20meeting%20consultation%20Bulgaria%20Veliko%20Tarnovo%20clean%20minimal%20white%20background%20charts%20analysis%20professional&width=1400&height=420&seq=agenciya-hero-img&orientation=landscape"
            alt="Как да изберете маркетинг агенция в Търново"
            className="w-full h-full object-cover object-top"
            loading="lazy" decoding="async"
          />
        </div>

        <div className="max-w-4xl mx-auto px-4 md:px-16 py-12 md:py-16">

          {/* ── ВЪВЕДЕНИЕ ── */}
          <section className="mb-14">
            <h2 className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Защо изборът на агенция е важен?
            </h2>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              <strong className="text-[#1C1C1E]">Лошата агенция</strong> може да навреди повече, отколкото да помогне.
              Грешна SEO стратегия = наказание от Google. Скъпи реклами без таргетиране = изхвърлени пари.
              Изборът на агенция е инвестиционно решение — не просто покупка на услуга.
            </p>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-6">
              В Търново има <strong className="text-[#1C1C1E]">5+ маркетинг агенции</strong>.
              Всички обещават резултати. Но само някои могат да ги докажат.
              Тази статия е честен гид — без bullshit, без скрити продажби.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-2xl bg-[#F9F9F7] border border-[#1C1C1E]/6">
              {[
                { value: '5+', label: 'агенции в Търново' },
                { value: '390 €', label: 'SEO от ТАВОРА' },
                { value: '21', label: 'реални клиентски ревюта' },
                { value: '4.9/5', label: 'средна оценка' },
              ].map((s) => (
                <div key={s.value} className="text-center">
                  <div className="text-xl md:text-2xl font-light text-[#1C1C1E] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{s.value}</div>
                  <div className="text-[10px] text-[#1C1C1E]/65 leading-tight">{s.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ── ЧЕРВЕНИ ФЛАГОВЕ ── */}
          <section className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[1px] bg-[#1C1C1E]/20 shrink-0" />
              <span className="text-xs text-[#1C1C1E]/60">Червени флагове</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              8 неща, които да избегнете.
            </h2>

            <div className="space-y-4">
              {RED_FLAGS.map((item, i) => (
                <div key={item.flag} className="p-5 rounded-2xl border border-[#1C1C1E]/8 bg-white">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 flex items-center justify-center rounded-full shrink-0 mt-0.5" style={{ backgroundColor: `${item.color}15` }}>
                      <i className="ri-error-warning-line text-sm" style={{ color: item.color }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-sm font-medium text-[#1C1C1E]">{item.flag}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: `${item.color}12`, color: item.color }}>{item.severity}</span>
                      </div>
                      <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">{item.why}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── ЗЕЛЕНИ ФЛАГОВЕ ── */}
          <section className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[1px] bg-[#1C1C1E]/20 shrink-0" />
              <span className="text-xs text-[#1C1C1E]/60">Зелени флагове</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              8 неща, които да търсите.
            </h2>

            <div className="space-y-4">
              {GREEN_FLAGS.map((item) => (
                <div key={item.flag} className="p-5 rounded-2xl border border-[#1C1C1E]/8 bg-[#F9F9F7]">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 flex items-center justify-center rounded-full shrink-0 mt-0.5" style={{ backgroundColor: `${item.color}15` }}>
                      <i className="ri-check-line text-sm" style={{ color: item.color }} />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-[#1C1C1E] mb-1">{item.flag}</div>
                      <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">{item.why}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── СРАВНЕНИЕ ── */}
          <section className="mb-14 p-6 md:p-8 rounded-2xl bg-[#F9F9F7] border border-[#1C1C1E]/6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[1px] bg-[#1C1C1E]/20 shrink-0" />
              <span className="text-xs text-[#1C1C1E]/60">Конкуренция</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Маркетинг агенции в Търново —
              <br />
              <em className="text-[#1C1C1E]/65">честно сравнение.</em>
            </h2>

            {/* ТАВОРА first row */}
            <div className="mb-4 p-5 rounded-2xl border border-[#0A2540]/20 bg-white">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[#0A2540]">{TAVORA_COMPETITION_ROW.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#0A2540]/8 text-[#0A2540]">Нашата агенция</span>
                </div>
                <span className="text-[10px] text-[#1C1C1E]/65">{TAVORA_COMPETITION_ROW.years} на пазара</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div>
                  <div className="text-[10px] text-[#1C1C1E]/65 mb-1">Силни страни</div>
                  <div className="text-[#1C1C1E]/65 leading-relaxed">{TAVORA_COMPETITION_ROW.strengths}</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#1C1C1E]/65 mb-1">Слаби страни</div>
                  <div className="text-[#1C1C1E]/65 leading-relaxed">{TAVORA_COMPETITION_ROW.weaknesses}</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#1C1C1E]/65 mb-1">Защо да изберете ТАВОРА</div>
                  <div className="text-[#2F9E44] leading-relaxed">{TAVORA_COMPETITION_ROW.whereWeWin}</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {COMPETITION.map((c) => (
                <div key={c.name} className="p-5 rounded-2xl border border-[#1C1C1E]/8 bg-white">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="text-sm font-medium text-[#1C1C1E]">{c.name}</div>
                    <span className="text-[10px] text-[#1C1C1E]/65">{c.years} на пазара</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div>
                      <div className="text-[10px] text-[#1C1C1E]/65 mb-1">Силни страни</div>
                      <div className="text-[#1C1C1E]/65 leading-relaxed">{c.strengths}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#1C1C1E]/65 mb-1">Слаби страни</div>
                      <div className="text-[#1C1C1E]/65 leading-relaxed">{c.weaknesses}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#1C1C1E]/65 mb-1">Къде ТАВОРА е по-добре</div>
                      <div className="text-[#2F9E44] leading-relaxed">{c.whereWeWin}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── ЦЕНИ ── */}
          <section className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[1px] bg-[#1C1C1E]/20 shrink-0" />
              <span className="text-xs text-[#1C1C1E]/60">Цени</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Колко струва дигитален маркетинг в Търново?
            </h2>

            <div className="space-y-3">
              {PRICES.map((p) => (
                <div key={p.service} className="flex flex-col sm:flex-row sm:items-center gap-3 p-5 rounded-2xl border border-[#1C1C1E]/8 bg-white">
                  <div className="sm:w-40 shrink-0">
                    <div className="text-sm font-medium text-[#1C1C1E]">{p.service}</div>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-[#1C1C1E]/65 leading-relaxed">{p.included}</div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="text-sm font-medium text-[#0A2540]">{p.price}</span>
                    <span className="text-[10px] text-[#1C1C1E]/70">{p.time}</span>
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
              Чести въпроси за агенции в Търново.
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
                <div className="text-xs text-white/75 tracking-widest uppercase mb-2">Готови ли сте?</div>
                <div className="text-2xl md:text-3xl font-light leading-tight mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Маркетинг агенция Търново
                  <br />
                  <span className="italic text-white/60">с верифицируеми резултати.</span>
                </div>
                <p className="text-sm text-white/75 max-w-md leading-relaxed">Консултация 50 € — анализ на конкурентите, стратегия и план. Приспада се при договор.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <Link to="/kontakt" className="px-7 py-3.5 bg-white text-[#0A2540] text-sm rounded-full hover:bg-white/90 transition-all cursor-pointer whitespace-nowrap text-center font-medium">Поискайте консултация →</Link>
                <Link to="/uslugi" className="px-7 py-3.5 border border-white/20 text-white/70 text-sm rounded-full hover:border-white/40 hover:text-white transition-all cursor-pointer whitespace-nowrap text-center">Вижте услугите</Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SharedFooter />
    </div>
  );
}