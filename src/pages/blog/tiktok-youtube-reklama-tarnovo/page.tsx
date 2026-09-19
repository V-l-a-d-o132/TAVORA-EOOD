import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SharedNav from '@/components/feature/SharedNav';
import SharedFooter from '@/components/feature/SharedFooter';

const FAQ_ITEMS = [
  {
    q: 'TikTok или YouTube — кое е по-добро за бизнес в Търново?',
    a: 'Зависи от аудиторията. TikTok е по-добър за B2C бизнеси с млада аудитория (18–35 г.) — ресторанти, магазини, услуги. YouTube е по-добър за B2B, образователно съдържание и дълготрайни резултати. Идеалното е и двете.',
  },
  {
    q: 'Колко струват TikTok реклами за бизнес в Търново?',
    a: 'TikTok Ads минималният бюджет е 50 лв./ден за кампания. За локален бизнес в Търново препоръчваме 100–300 лв./месец за тест. Органичното TikTok съдържание е безплатно и може да достигне хиляди хора без реклама.',
  },
  {
    q: 'Трябва ли ми специално оборудване за TikTok видеа?',
    a: 'Не — смартфон с добра камера е достатъчен. TikTok предпочита автентично, „сурово" съдържание пред прекалено продуцирани видеа. Важното е осветлението и звукът — инвестирайте в прост ринг лайт и микрофон.',
  },
  {
    q: 'Колко видеа трябва да публикувам в TikTok?',
    a: 'Минимум 3–5 видеа седмично за органичен растеж. TikTok алгоритъмът награждава консистентността. Първите 3 месеца са критични — публикувайте редовно дори без много гледания.',
  },
  {
    q: 'YouTube SEO — как да класирам видеата си?',
    a: 'YouTube е втората по-голяма търсачка в света. Оптимизирайте заглавие, описание и тагове с ключови думи. Добавете субтитри — YouTube ги индексира. Thumbnail-ът е критичен — 80% от кликовете идват от него.',
  },
  {
    q: 'Може ли TikTok да помогне за SEO в Google?',
    a: 'Индиректно — да. TikTok видеата се индексират в Google. Ако видеото ви е за „ресторант Търново", може да се появи в Google резултатите. Плюс — трафикът от TikTok към сайта ви е сигнал за Google.',
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

const ARTICLE_SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      '@id': 'https://imashnujnoto.com/blog/tiktok-youtube-reklama-tarnovo#article',
      headline: 'TikTok и YouTube реклами за бизнес в Търново — пълно ръководство 2026',
      description: 'Как да използвате TikTok и YouTube за реклама на бизнес в Търново. Органично съдържание, платени реклами, стратегии и реални примери. ТАВОРА ЕООД.',
      url: 'https://imashnujnoto.com/blog/tiktok-youtube-reklama-tarnovo',
      datePublished: '2026-05-05',
      dateModified: new Date().toISOString().split('T')[0],
      inLanguage: 'bg',
      wordCount: 3800,
      timeRequired: 'PT14M',
      keywords: ['TikTok реклами Търново', 'YouTube реклами Търново', 'видео маркетинг', 'TikTok бизнес', 'YouTube SEO', 'дигитален маркетинг Търново'],
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
        url: 'https://readdy.ai/api/search-image?query=TikTok%20YouTube%20social%20media%20video%20marketing%20business%20smartphone%20filming%20content%20creator%20professional%20studio%20setup%20clean%20minimal%20white%20background%20Bulgaria&width=1200&height=630&seq=tiktok-youtube-hero&orientation=landscape',
        width: 1200,
        height: 630,
      },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Начало', item: 'https://imashnujnoto.com/' },
          { '@type': 'ListItem', position: 2, name: 'Блог', item: 'https://imashnujnoto.com/blog' },
          { '@type': 'ListItem', position: 3, name: 'TikTok YouTube реклами Търново', item: 'https://imashnujnoto.com/blog/tiktok-youtube-reklama-tarnovo' },
        ],
      },
    },
  ],
};

const PLATFORMS = [
  {
    name: 'TikTok',
    icon: 'ri-tiktok-line',
    color: '#010101',
    accent: '#FE2C55',
    tagline: 'Органичен reach + вирусен потенциал',
    audience: '18–35 г., B2C',
    minBudget: '100–300 лв./мес.',
    bestFor: ['Ресторанти', 'Магазини', 'Услуги', 'Продукти', 'Развлечения'],
    pros: [
      'Органичен reach — видеото може да достигне хиляди без реклама',
      'Вирусен потенциал — едно видео може да промени бизнеса',
      'Автентичност — не е нужно скъпо оборудване',
      'Млада аудитория — 18–35 г. с висока покупателна способност',
      'TikTok Shop — директни продажби от платформата',
    ],
    cons: [
      'Изисква консистентност — минимум 3–5 видеа/седмица',
      'Кратък живот на съдържанието — видеата „умират" след 24–48 часа',
      'Не е подходящо за всички ниши — B2B е по-трудно',
    ],
  },
  {
    name: 'YouTube',
    icon: 'ri-youtube-line',
    color: '#FF0000',
    accent: '#FF0000',
    tagline: 'Дългосрочен SEO + авторитет',
    audience: '25–55 г., B2B + B2C',
    minBudget: '200–500 лв./мес.',
    bestFor: ['Образователно съдържание', 'B2B услуги', 'Продукти с обяснение', 'Туризъм', 'Недвижими имоти'],
    pros: [
      'Дългосрочен SEO — видеата класират в Google с години',
      'Авторитет — YouTube канал = доверие и експертиза',
      'Втора по-голяма търсачка — 2 млрд. потребители',
      'YouTube Ads — прецизно таргетиране по интереси',
      'Монетизация — при 1000 абонати и 4000 часа гледания',
    ],
    cons: [
      'Изисква по-дълги видеа — минимум 5–10 минути за SEO',
      'По-бавен растеж — 6–12 месеца за видими резултати',
      'По-скъпо производство — качеството е по-важно',
    ],
  },
];

const CONTENT_IDEAS = [
  {
    type: 'Ресторант / Кафе',
    icon: 'ri-restaurant-line',
    color: '#E67700',
    tiktok: ['„Как правим [ястие]" — зад кулисите', '„Ден в живота на готвача"', '„Клиент опитва за пръв път"', '„Преди/след ремонт"', '„Тайната съставка"'],
    youtube: ['„Пълна рецепта за [ястие]" — 10 мин.', '„История на ресторанта"', '„Интервю с готвача"', '„Обиколка на кухнята"'],
  },
  {
    type: 'Магазин / E-commerce',
    icon: 'ri-store-2-line',
    color: '#2F9E44',
    tiktok: ['„Разопаковане на нова доставка"', '„Топ 5 продукта тази седмица"', '„Клиент показва покупката"', '„Как се прави [продукт]"'],
    youtube: ['„Пълен преглед на [продукт]"', '„Сравнение на продукти"', '„Как да изберете [продукт]"', '„Клиентски отзиви"'],
  },
  {
    type: 'Услуги / Агенция',
    icon: 'ri-briefcase-line',
    color: '#3B5BDB',
    tiktok: ['„Преди/след — клиентски резултат"', '„3 грешки, които правят бизнесите"', '„Бърз съвет за [услуга]"', '„Зад кулисите на проект"'],
    youtube: ['„Пълен case study"', '„Как работи [услуга]"', '„Интервю с клиент"', '„Стъпка по стъпка ръководство"'],
  },
];

const TIKTOK_STRATEGY = [
  { step: '01', title: 'Профил и биография', desc: 'Ясно кои сте, какво правите, линк към сайта. Снимка на профила — лого или лице. Бизнес акаунт за аналитика.', time: '30 мин.' },
  { step: '02', title: 'Първите 10 видеа', desc: 'Тествайте различни формати — зад кулисите, съвети, хумор, продукти. Гледайте аналитиката — кое работи?', time: '2 седмици' },
  { step: '03', title: 'Консистентност', desc: 'Минимум 3–5 видеа седмично. Публикувайте в пиковите часове — 18:00–21:00 и 12:00–14:00.', time: 'Постоянно' },
  { step: '04', title: 'Хаштагове и звуци', desc: '3–5 релевантни хаштага — не повече. Използвайте trending звуци — TikTok ги промотира.', time: 'Всяко видео' },
  { step: '05', title: 'TikTok Ads', desc: 'След 1–2 месеца органично съдържание — добавете платени реклами. Boost-вайте видеата, които вече работят.', time: 'Месец 2–3' },
];

const YOUTUBE_STRATEGY = [
  { step: '01', title: 'Канал и брандинг', desc: 'Канал арт, описание с ключови думи, линкове към сайта и социалните медии. Trailer видео — 60 секунди.', time: '2 часа' },
  { step: '02', title: 'YouTube SEO', desc: 'Заглавие с ключова дума, описание 200+ думи, тагове, субтитри. Thumbnail — ярки цветове, лице, текст.', time: 'Всяко видео' },
  { step: '03', title: 'Плейлисти', desc: 'Организирайте видеата в плейлисти по теми. Плейлистите класират в Google и увеличават watch time.', time: '30 мин.' },
  { step: '04', title: 'Консистентност', desc: 'Минимум 1 видео седмично. YouTube алгоритъмът награждава редовните канали.', time: 'Постоянно' },
  { step: '05', title: 'YouTube Ads', desc: 'In-stream реклами, Discovery реклами. Таргетирайте по интереси, ключови думи и демография.', time: 'Месец 3+' },
];

const RELATED = [
  { title: 'Meta реклами за Търново', to: '/blog/meta-reklami-tarnovo', cat: 'Meta реклами', color: 'bg-orange-50 text-orange-700' },
  { title: 'Видео продукция Търново', to: '/video-produkciya-veliko-tarnovo', cat: 'Видео', color: 'bg-rose-50 text-rose-700' },
  { title: 'Реклама Велико Търново', to: '/reklama-veliko-tarnovo', cat: 'Реклама', color: 'bg-orange-50 text-orange-700' },
  { title: 'Дигитален маркетинг Търново', to: '/digitalen-marketing-veliko-tarnovo', cat: 'Маркетинг', color: 'bg-emerald-50 text-emerald-700' },
  { title: 'Безплатен SEO за #1 в Google', to: '/blog/bezplaten-seo-nomer-edno-google', cat: 'SEO', color: 'bg-sky-50 text-sky-700' },
  { title: 'Рекламни кампании', to: '/uslugi/reklamni-kampanii', cat: 'Услуга', color: 'bg-orange-50 text-orange-700' },
];

export default function TikTokYouTubeReklamaTarnovoPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'tiktok' | 'youtube'>('tiktok');

  useEffect(() => {
    document.title = 'TikTok и YouTube реклами за бизнес в Търново — ръководство 2026 | ТАВОРА ЕООД';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', 'TikTok и YouTube реклами за бизнес в Търново — пълно ръководство 2026. Органично съдържание, платени реклами, стратегии и реални примери. ТАВОРА ЕООД.');
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://imashnujnoto.com/blog/tiktok-youtube-reklama-tarnovo');

    const id = 'schema-tiktok-youtube';
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) { el = document.createElement('script'); el.id = id; el.type = 'application/ld+json'; document.head.appendChild(el); }
    el.textContent = JSON.stringify(ARTICLE_SCHEMA);

    const faqId = 'schema-tiktok-youtube-faq';
    let faqEl = document.getElementById(faqId) as HTMLScriptElement | null;
    if (!faqEl) { faqEl = document.createElement('script'); faqEl.id = faqId; faqEl.type = 'application/ld+json'; document.head.appendChild(faqEl); }
    faqEl.textContent = JSON.stringify(FAQ_SCHEMA);

    return () => {
      ['schema-tiktok-youtube', 'schema-tiktok-youtube-faq'].forEach((sid) => { const e = document.getElementById(sid); if (e) e.remove(); });
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
              <span className="text-[#1C1C1E]/65">TikTok и YouTube реклами</span>
            </nav>

            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span className="text-[10px] px-2.5 py-1 rounded-full font-medium bg-rose-50 text-rose-700">Видео маркетинг</span>
              <span className="text-[10px] px-2.5 py-1 rounded-full font-medium bg-orange-50 text-orange-700">Реклами</span>
              <span className="text-[10px] text-[#1C1C1E]/70">14 мин. четене · 5 Май 2026</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-light text-[#1C1C1E] leading-tight mb-5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              TikTok и YouTube реклами
              <br />
              <em className="text-[#1C1C1E]/60">за бизнес в Търново —</em>
              <br />
              <strong className="font-light">пълно ръководство 2026.</strong>
            </h1>

            <p className="text-sm md:text-base text-[#1C1C1E]/65 max-w-2xl leading-relaxed mb-6">
              Видеото е <strong className="text-[#1C1C1E]">#1 ранкинг фактор</strong> в момента.
              TikTok и YouTube са двете платформи, които могат да изстрелят бизнеса ви в Търново.
              Ето как да ги използвате правилно — органично и платено.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link to="/reklama-veliko-tarnovo" className="px-6 py-3 bg-[#1C1C1E] text-white text-sm rounded-full hover:bg-[#1C1C1E]/80 transition-all cursor-pointer whitespace-nowrap">
                Реклами Търново →
              </Link>
              <Link to="/kontakt" className="px-6 py-3 border border-[#1C1C1E]/12 text-[#1C1C1E]/65 text-sm rounded-full hover:border-[#1C1C1E]/30 hover:text-[#1C1C1E] transition-all cursor-pointer whitespace-nowrap">
                Безплатна консултация
              </Link>
            </div>
          </div>
        </section>

        {/* ── HERO IMAGE ── */}
        <div className="w-full h-[280px] md:h-[420px] overflow-hidden">
          <img
            src="https://readdy.ai/api/search-image?query=TikTok%20YouTube%20social%20media%20video%20marketing%20business%20smartphone%20filming%20content%20creator%20professional%20studio%20setup%20clean%20minimal%20white%20background%20Bulgaria%20Tarnovo&width=1400&height=420&seq=tiktok-youtube-hero-img&orientation=landscape"
            alt="TikTok и YouTube реклами за бизнес в Търново"
            className="w-full h-full object-cover object-top"
          />
        </div>

        <div className="max-w-4xl mx-auto px-4 md:px-16 py-12 md:py-16">

          {/* ── ВЪВЕДЕНИЕ ── */}
          <section className="mb-14">
            <h2 className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Защо видеото е задължително за бизнес в Търново?
            </h2>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              <strong className="text-[#1C1C1E]">82% от интернет трафика</strong> в 2026 е видео.
              Бизнесите, които не използват TikTok и YouTube, губят огромна аудитория.
              В Търново конкуренцията в социалните медии все още е ниска — което е вашата възможност.
            </p>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-6">
              TikTok и YouTube не са само за забавление — те са <strong className="text-[#1C1C1E]">мощни маркетинг инструменти</strong>.
              TikTok може да достигне хиляди хора в Търново органично — без реклама.
              YouTube класира видеата в Google — безплатен SEO за години.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-2xl bg-[#F9F9F7] border border-[#1C1C1E]/6">
              {[
                { value: '82%', label: 'от трафика е видео' },
                { value: '1200%', label: 'повече споделяния' },
                { value: '3x', label: 'по-висока конверсия' },
                { value: '2 млрд.', label: 'YouTube потребители' },
              ].map((s) => (
                <div key={s.value} className="text-center">
                  <div className="text-xl md:text-2xl font-light text-[#1C1C1E] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{s.value}</div>
                  <div className="text-[10px] text-[#1C1C1E]/65 leading-tight">{s.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ── СРАВНЕНИЕ ПЛАТФОРМИ ── */}
          <section className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[1px] bg-[#1C1C1E]/20 shrink-0" />
              <span className="text-xs text-[#1C1C1E]/60">TikTok vs YouTube</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Коя платформа е по-добра за вашия бизнес?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
              {PLATFORMS.map((platform) => (
                <div key={platform.name} className="rounded-2xl border border-[#1C1C1E]/8 overflow-hidden">
                  <div className="p-5 border-b border-[#1C1C1E]/6 flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center rounded-xl" style={{ backgroundColor: `${platform.color}12` }}>
                      <i className={`${platform.icon} text-xl`} style={{ color: platform.accent }} />
                    </div>
                    <div>
                      <div className="text-base font-medium text-[#1C1C1E]">{platform.name}</div>
                      <div className="text-[10px] text-[#1C1C1E]/65">{platform.tagline}</div>
                    </div>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-[10px] text-[#1C1C1E]/65 mb-1">Аудитория</div>
                        <div className="text-xs font-medium text-[#1C1C1E]">{platform.audience}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-[#1C1C1E]/65 mb-1">Мин. бюджет</div>
                        <div className="text-xs font-medium text-[#1C1C1E]">{platform.minBudget}</div>
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#1C1C1E]/65 mb-2">Подходящо за:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {platform.bestFor.map((item) => (
                          <span key={item} className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: `${platform.accent}12`, color: platform.accent }}>{item}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#1C1C1E]/65 mb-2">Предимства:</div>
                      <div className="space-y-1.5">
                        {platform.pros.map((pro) => (
                          <div key={pro} className="flex items-start gap-2">
                            <i className="ri-check-line text-[10px] mt-0.5 shrink-0" style={{ color: platform.accent }} />
                            <span className="text-xs text-[#1C1C1E]/65 leading-relaxed">{pro}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#1C1C1E]/65 mb-2">Недостатъци:</div>
                      <div className="space-y-1.5">
                        {platform.cons.map((con) => (
                          <div key={con} className="flex items-start gap-2">
                            <i className="ri-close-line text-[10px] mt-0.5 shrink-0 text-[#1C1C1E]/70" />
                            <span className="text-xs text-[#1C1C1E]/65 leading-relaxed">{con}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── ИДЕИ ЗА СЪДЪРЖАНИЕ ── */}
          <section className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[1px] bg-[#1C1C1E]/20 shrink-0" />
              <span className="text-xs text-[#1C1C1E]/60">Идеи за съдържание</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Какво да публикувате за вашия бизнес?
            </h2>

            <div className="space-y-5">
              {CONTENT_IDEAS.map((idea) => (
                <div key={idea.type} className="rounded-2xl border border-[#1C1C1E]/8 overflow-hidden">
                  <div className="p-5 border-b border-[#1C1C1E]/6 flex items-center gap-3">
                    <div className="w-9 h-9 flex items-center justify-center rounded-xl" style={{ backgroundColor: `${idea.color}12` }}>
                      <i className={`${idea.icon} text-base`} style={{ color: idea.color }} />
                    </div>
                    <span className="text-sm font-medium text-[#1C1C1E]">{idea.type}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#1C1C1E]/6">
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <i className="ri-tiktok-line text-sm text-[#010101]" />
                        <span className="text-xs font-medium text-[#1C1C1E]">TikTok идеи</span>
                      </div>
                      <div className="space-y-2">
                        {idea.tiktok.map((item) => (
                          <div key={item} className="flex items-start gap-2">
                            <i className="ri-arrow-right-s-line text-[#1C1C1E]/70 text-xs mt-0.5 shrink-0" />
                            <span className="text-xs text-[#1C1C1E]/65 leading-relaxed">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <i className="ri-youtube-line text-sm text-[#FF0000]" />
                        <span className="text-xs font-medium text-[#1C1C1E]">YouTube идеи</span>
                      </div>
                      <div className="space-y-2">
                        {idea.youtube.map((item) => (
                          <div key={item} className="flex items-start gap-2">
                            <i className="ri-arrow-right-s-line text-[#1C1C1E]/70 text-xs mt-0.5 shrink-0" />
                            <span className="text-xs text-[#1C1C1E]/65 leading-relaxed">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── СТРАТЕГИИ ── */}
          <section className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[1px] bg-[#1C1C1E]/20 shrink-0" />
              <span className="text-xs text-[#1C1C1E]/60">Стъпка по стъпка</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Стратегия за TikTok и YouTube.
            </h2>

            {/* Tab switcher */}
            <div className="flex gap-1 p-1 rounded-full bg-[#F9F9F7] border border-[#1C1C1E]/8 w-fit mb-8">
              {(['tiktok', 'youtube'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${activeTab === tab ? 'bg-[#1C1C1E] text-white' : 'text-[#1C1C1E]/65 hover:text-[#1C1C1E]'}`}
                >
                  {tab === 'tiktok' ? 'TikTok стратегия' : 'YouTube стратегия'}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {(activeTab === 'tiktok' ? TIKTOK_STRATEGY : YOUTUBE_STRATEGY).map((s) => (
                <div key={s.step} className="flex items-start gap-4 p-5 rounded-2xl border border-[#1C1C1E]/8 bg-white">
                  <span className="text-2xl font-light shrink-0 leading-none text-[#1C1C1E]/20" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{s.step}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-3 mb-1.5">
                      <h4 className="text-sm font-medium text-[#1C1C1E]">{s.title}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F9F9F7] text-[#1C1C1E]/65 shrink-0">{s.time}</span>
                    </div>
                    <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">{s.desc}</p>
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
              Чести въпроси за TikTok и YouTube.
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
                <div className="text-xs text-white/75 tracking-widest uppercase mb-2">Готови за видео маркетинг?</div>
                <div className="text-2xl md:text-3xl font-light leading-tight mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  TikTok + YouTube + SEO =
                  <br />
                  <span className="italic text-white/60">доминиране в Търново.</span>
                </div>
                <p className="text-sm text-white/75 max-w-md leading-relaxed">
                  Консултация 50 € — стратегия за видео маркетинг за вашия бизнес. Приспада се при договор.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <Link to="/kontakt" className="px-7 py-3.5 bg-white text-[#0A2540] text-sm rounded-full hover:bg-white/90 transition-all cursor-pointer whitespace-nowrap text-center font-medium">
                  Поискайте консултация →
                </Link>
                <Link to="/reklama-veliko-tarnovo" className="px-7 py-3.5 border border-white/20 text-white/70 text-sm rounded-full hover:border-white/40 hover:text-white transition-all cursor-pointer whitespace-nowrap text-center">
                  Реклами Търново
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SharedFooter />
    </div>
  );
}