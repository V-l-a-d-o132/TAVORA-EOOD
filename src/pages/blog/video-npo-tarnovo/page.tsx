import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SharedNav from '@/components/feature/SharedNav';
import SharedFooter from '@/components/feature/SharedFooter';

const FAQ_ITEMS = [
  {
    q: 'Колко струва видео за НПО в Търново?',
    a: 'Консултацията е 50 € и включва обсъждане на каузата, целите и бюджета. Тази сума се приспада при сключване на договор. Видео продукцията за НПО организации е по запитване — зависи от обема, локацията и сложността на проекта.',
  },
  {
    q: 'Работите ли само с НПО от Велико Търново?',
    a: 'Не — работим с НПО от цяла България. Специализираме се в Велико Търново и Търновска област, но сме заснемали кампании с национален обхват за Академика 245 и Амалипе.',
  },
  {
    q: 'Колко импресии са постигнали вашите НПО видеа?',
    a: 'Видеата за Академика 245 и Амалипе са постигнали милиони импресии в социалните медии. Важно е да се разграничи: импресии (колко пъти е показано видеото) и гледания (колко пъти е изгледано). Ние говорим за милиони импресии.',
  },
  {
    q: 'Какво оборудване използвате за НПО видеа?',
    a: 'Работим с професионални камери (4K), микрофони и осветление. Натан Петков участва пред камерата — знае какво работи от двете страни на обектива. Доставка на монтаж в 5 работни дни.',
  },
  {
    q: 'Може ли видеото да помогне за набиране на средства?',
    a: 'Да — видеото е най-ефективният инструмент за fundraising. Социалните кампании с видео генерират 3x повече дарения от текстови кампании. Разказваме историята на вашата кауза по начин, който докосва хората.',
  },
  {
    q: 'Колко бързо е доставката?',
    a: 'Стандартната доставка е 5 работни дни след заснемането. При спешни проекти можем да ускорим — обсъждаме индивидуално.',
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
      '@id': 'https://imashnujnoto.com/blog/video-npo-tarnovo#article',
      headline: 'Видео за НПО Търново — как да разкажете каузата си и да достигнете милиони',
      description: 'Пълно ръководство за видео продукция за НПО организации в Търново. Реални примери с Академика 245 и Амалипе — милиони импресии. Как да изберете агенция, какво да очаквате и как видеото помага за fundraising.',
      url: 'https://imashnujnoto.com/blog/video-npo-tarnovo',
      datePublished: '2026-04-28',
      dateModified: new Date().toISOString().split('T')[0],
      inLanguage: 'bg',
      wordCount: 2800,
      author: {
        '@type': 'Person',
        name: 'Владимир Веселинов Атанасов',
        url: 'https://imashnujnoto.com/ekip',
        jobTitle: 'Основател, ТАВОРА ЕООД',
      },
      publisher: {
        '@type': 'Organization',
        name: 'ТАВОРА ЕООД',
        url: 'https://imashnujnoto.com',
        logo: { '@type': 'ImageObject', url: 'https://storage.readdy-site.link/project_files/3f265d07-5825-4e88-a58a-44deb287b858/777dce2a-8731-4235-b0be-7837a840c3c9_TAVORA-MARKETING-AGENCY-VELIKO-TARNOVO.png?v=f6135e7442d441feef102ad2f8425862' },
      },
      image: {
        '@type': 'ImageObject',
        url: 'https://readdy.ai/api/search-image?query=professional%20video%20production%20NGO%20social%20campaign%20filming%20crew%20Bulgaria%20Veliko%20Tarnovo%20documentary%20camera%20equipment%20studio%20setup%20clean%20minimal&width=1200&height=630&seq=blog-npo-video-og&orientation=landscape',
        width: 1200,
        height: 630,
      },
      isPartOf: { '@id': 'https://imashnujnoto.com/blog#page' },
      about: [
        { '@type': 'Thing', name: 'Видео продукция за НПО' },
        { '@type': 'Thing', name: 'Социални кампании' },
        { '@type': 'City', name: 'Велико Търново' },
      ],
      mentions: [
        { '@type': 'Organization', name: 'Академика 245', url: 'https://akademika245.com/' },
        { '@type': 'Organization', name: 'Амалипе', url: 'https://amalipe.bg/' },
        { '@type': 'Organization', name: 'ТАВОРА ЕООД', url: 'https://imashnujnoto.com' },
      ],
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://imashnujnoto.com/blog/video-npo-tarnovo',
      },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Начало', item: 'https://imashnujnoto.com/' },
        { '@type': 'ListItem', position: 2, name: 'Блог', item: 'https://imashnujnoto.com/blog' },
        { '@type': 'ListItem', position: 3, name: 'Видео за НПО Търново', item: 'https://imashnujnoto.com/blog/video-npo-tarnovo' },
      ],
    },
  ],
};

const steps = [
  {
    num: '01',
    title: 'Консултация и концепция',
    desc: 'Разбираме каузата, целевата аудитория и целите на кампанията. Разработваме сценарий и сториборд, съобразени с бюджета и посланието.',
    tip: 'Най-важният въпрос: „Какво искаме хората да направят след като гледат видеото?" — дарение, споделяне, доброволчество?',
  },
  {
    num: '02',
    title: 'Подготовка и логистика',
    desc: 'Избор на локации, актьори/говорители, реквизит. За НПО видеа автентичността е ключова — реални хора, реални истории.',
    tip: 'Избягвайте прекалено „продуцирания" вид. Автентичното видео конвертира по-добре при НПО аудитории.',
  },
  {
    num: '03',
    title: 'Заснемане',
    desc: 'Професионално заснемане с 4K камери, микрофони и осветление. Натан Петков участва пред камерата — знае какво работи от двете страни.',
    tip: 'Заснемаме повече материал, отколкото е нужно — монтажът е по-лесен с повече избор.',
  },
  {
    num: '04',
    title: 'Монтаж и доставка',
    desc: 'Професионален монтаж, цветокорекция, звук и субтитри. Доставка в 5 работни дни. Оптимизирано за Facebook, Instagram, YouTube и TikTok.',
    tip: 'Субтитрите са задължителни — 85% от видеата в социалните медии се гледат без звук.',
  },
];

const caseStudies = [
  {
    org: 'Академика 245',
    url: 'https://akademika245.com/',
    project: 'Проект за домашното насилие с Натан Петков',
    result: 'Десетки хиляди гледания',
    detail: 'Видео продукция за социална кампания с национален обхват. Натан Петков участва пред камерата по проект за домашното насилие. Кампанията достигна десетки хиляди гледания и милиони импресии в социалните медии.',
    platform: 'Facebook Reel',
    icon: 'ri-facebook-circle-fill',
    iconColor: '#1877F2',
  },
  {
    org: 'Амалипе',
    url: 'https://amalipe.bg/',
    project: 'Социални кампании с национален обхват',
    result: 'Милиони импресии',
    detail: 'Видео продукция за мащабни социални кампании. Амалипе е една от водещите НПО организации в България, работеща за правата на ромската общност. Видеата достигнаха милиони импресии в социалните медии.',
    platform: 'Социални медии',
    icon: 'ri-heart-3-fill',
    iconColor: '#E03131',
  },
];

const whyVideo = [
  { stat: '1200%', label: 'повече споделяния', desc: 'Видеото генерира 1200% повече споделяния от текст и снимки взети заедно.' },
  { stat: '3x', label: 'по-висока конверсия', desc: 'Социалните кампании с видео имат 3 пъти по-висока конверсия към дарения.' },
  { stat: '85%', label: 'без звук', desc: '85% от видеата в социалните медии се гледат без звук — субтитрите са задължителни.' },
  { stat: '2 мин.', label: 'оптимална дължина', desc: 'Видеата до 2 минути имат най-висок engagement за НПО кампании.' },
];

const mistakes = [
  {
    mistake: 'Прекалено дълго видео',
    fix: 'Оптималната дължина за НПО видео в социалните медии е 60–120 секунди. По-дълго = по-малко гледания.',
  },
  {
    mistake: 'Без ясен призив за действие',
    fix: 'Всяко видео трябва да завършва с конкретен CTA: „Дарете сега", „Споделете", „Станете доброволец".',
  },
  {
    mistake: 'Лошо качество на звука',
    fix: 'Зрителите прощават лошо видео, но не и лош звук. Инвестирайте в добър микрофон — това е приоритет.',
  },
  {
    mistake: 'Без субтитри',
    fix: '85% от видеата се гледат без звук. Без субтитри губите 85% от потенциалните зрители.',
  },
  {
    mistake: 'Прекалено „корпоративен" вид',
    fix: 'НПО аудиториите ценят автентичността. Реални хора, реални истории — не актьори и студийни условия.',
  },
];

export default function VideoNPOTarnovoPage() {
  useEffect(() => {
    const id = 'schema-blog-npo-video';
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement('script');
      el.id = id;
      el.type = 'application/ld+json';
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(ARTICLE_SCHEMA);

    const faqId = 'schema-blog-npo-video-faq';
    let faqEl = document.getElementById(faqId) as HTMLScriptElement | null;
    if (!faqEl) {
      faqEl = document.createElement('script');
      faqEl.id = faqId;
      faqEl.type = 'application/ld+json';
      document.head.appendChild(faqEl);
    }
    faqEl.textContent = JSON.stringify(FAQ_SCHEMA);

    document.title = 'Видео за НПО Търново — как да разкажете каузата си | ТАВОРА ЕООД';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Видео за НПО Търново — пълно ръководство. Реални примери с Академика 245 и Амалипе — милиони импресии. Как видеото помага за fundraising и социални кампании. ТАВОРА ЕООД.');
    }
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://imashnujnoto.com/blog/video-npo-tarnovo');

    return () => {
      ['schema-blog-npo-video', 'schema-blog-npo-video-faq'].forEach((sid) => {
        const e = document.getElementById(sid);
        if (e) e.remove();
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <SharedNav />

      <main className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-20">

        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="flex items-center gap-2 text-[11px] text-[#1C1C1E]/65 mb-8 flex-wrap">
          <Link to="/" className="hover:text-[#1C1C1E]/60 transition-colors">Начало</Link>
          <i className="ri-arrow-right-s-line text-xs" />
          <Link to="/blog" className="hover:text-[#1C1C1E]/60 transition-colors">Блог</Link>
          <i className="ri-arrow-right-s-line text-xs" />
          <span className="text-[#1C1C1E]/65">Видео за НПО Търново</span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-[10px] px-2.5 py-1 rounded-full font-medium bg-rose-50 text-rose-700">Видео продукция</span>
            <span className="text-[10px] text-[#1C1C1E]/70">28 Апр 2026 · 9 мин. четене</span>
          </div>

          <h1
            className="text-3xl md:text-5xl font-light text-[#1C1C1E] leading-tight mb-5"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Видео за НПО Търново —
            <br />
            <span className="italic text-[#0A2540]">как да разкажете каузата си и да достигнете милиони.</span>
          </h1>

          <p className="text-base text-[#1C1C1E]/65 leading-relaxed mb-6 max-w-2xl">
            <strong className="text-[#1C1C1E]">Видеото е най-мощният инструмент</strong> за НПО организации.
            Работили сме с Академика 245 и Амалипе — две от водещите НПО в България.
            Ето какво научихме за видео продукция за НПО в Търново.
          </p>

          <div className="flex items-center gap-4 text-xs text-[#1C1C1E]/65 pb-8 border-b border-[#1C1C1E]/8">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#0A2540]/10 flex items-center justify-center">
                <i className="ri-user-line text-[10px] text-[#0A2540]/60" />
              </div>
              <span>Владимир Атанасов</span>
            </div>
            <span>·</span>
            <span>ТАВОРА ЕООД</span>
            <span>·</span>
            <Link to="/npo-video" className="text-[#0A2540] hover:underline decoration-dotted">Видео за НПО →</Link>
          </div>
        </header>

        {/* Hero image */}
        <div className="w-full h-[280px] md:h-[400px] rounded-2xl overflow-hidden mb-12">
          <img
            src="https://readdy.ai/api/search-image?query=professional%20video%20production%20NGO%20social%20campaign%20filming%20crew%20Bulgaria%20Veliko%20Tarnovo%20documentary%20camera%20equipment%20outdoor%20location%20authentic%20storytelling%20warm%20light&width=1200&height=630&seq=blog-npo-video-hero&orientation=landscape"
            alt="Видео продукция за НПО организации в Търново — ТАВОРА ЕООД"
            className="w-full h-full object-cover object-top"
          />
        </div>

        {/* Intro */}
        <section className="mb-12">
          <p className="text-sm text-[#1C1C1E]/60 leading-relaxed mb-4">
            Когато Академика 245 се свърза с нас за видео по проект за домашното насилие, знаехме едно:
            историята трябва да докосне хората. Не да ги информира — да ги докосне.
            Резултатът? Десетки хиляди гледания и милиони импресии.
          </p>
          <p className="text-sm text-[#1C1C1E]/60 leading-relaxed mb-4">
            <strong className="text-[#1C1C1E]">Видеото за НПО в Търново</strong> е различно от рекламното видео за бизнеси.
            Тук не продавате продукт — разказвате история. И тази история трябва да накара хората да действат:
            да дарят, да споделят, да станат доброволци.
          </p>
          <p className="text-sm text-[#1C1C1E]/60 leading-relaxed">
            В тази статия ще разгледаме как работи видео продукцията за НПО, какво прави едно видео ефективно
            и как да изберете правилната агенция за вашата кауза.
          </p>
        </section>

        {/* Why video matters */}
        <section className="mb-14">
          <h2
            className="text-2xl md:text-3xl font-light text-[#1C1C1E] leading-tight mb-6"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Защо видеото е задължително
            <br />
            <span className="italic text-[#0A2540]">за НПО организации?</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {whyVideo.map((item) => (
              <div key={item.stat} className="p-5 rounded-2xl border border-[#1C1C1E]/8 bg-[#F9F9F9]">
                <div
                  className="text-2xl font-light text-[#0A2540] mb-1"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {item.stat}
                </div>
                <div className="text-xs font-medium text-[#1C1C1E] mb-1">{item.label}</div>
                <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
            Данните са ясни: видеото не е опция за НПО организации — то е необходимост.
            Особено в Търново, където конкуренцията за вниманието на аудиторията расте всяка година.
          </p>
        </section>

        {/* Case studies */}
        <section className="mb-14">
          <h2
            className="text-2xl md:text-3xl font-light text-[#1C1C1E] leading-tight mb-6"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Реални НПО проекти
            <br />
            <span className="italic text-[#0A2540]">от Търново и България.</span>
          </h2>

          <div className="space-y-5 mb-6">
            {caseStudies.map((cs) => (
              <div key={cs.org} className="p-6 rounded-2xl border border-[#1C1C1E]/8 bg-white">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center rounded-xl border border-[#1C1C1E]/8">
                      <i className={`${cs.icon} text-lg`} style={{ color: cs.iconColor }} />
                    </div>
                    <div>
                      <a
                        href={cs.url}
                        target="_blank"
                        rel="nofollow noopener noreferrer"
                        className="text-sm font-medium text-[#1C1C1E] hover:text-[#0A2540] transition-colors cursor-pointer"
                      >
                        {cs.org} ↗
                      </a>
                      <div className="text-[10px] text-[#1C1C1E]/65">{cs.platform}</div>
                    </div>
                  </div>
                  <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#1B4332]/10 text-[#1B4332] font-medium whitespace-nowrap shrink-0">
                    {cs.result}
                  </span>
                </div>
                <div className="text-xs font-medium text-[#0A2540] mb-2">{cs.project}</div>
                <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">{cs.detail}</p>
              </div>
            ))}
          </div>

          <div className="p-5 rounded-2xl border border-[#0A2540]/15 bg-[#0A2540]/3">
            <p className="text-xs text-[#1C1C1E]/60 leading-relaxed">
              <strong className="text-[#0A2540]">Важно:</strong> Всички резултати са верифицируеми.
              Можете да проверите видеата директно в социалните медии на Академика 245 и Амалипе.
              Не обещаваме — доказваме.
            </p>
          </div>
        </section>

        {/* 4 steps */}
        <section className="mb-14">
          <h2
            className="text-2xl md:text-3xl font-light text-[#1C1C1E] leading-tight mb-8"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            4 стъпки за успешно
            <br />
            <span className="italic text-[#0A2540]">НПО видео в Търново.</span>
          </h2>

          <div className="space-y-5">
            {steps.map((step) => (
              <div key={step.num} className="flex gap-5 p-5 rounded-2xl border border-[#1C1C1E]/8 bg-[#F9F9F9]">
                <div className="shrink-0">
                  <span
                    className="text-2xl font-light text-[#0A2540]/65"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {step.num}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-[#1C1C1E] mb-2">{step.title}</h3>
                  <p className="text-xs text-[#1C1C1E]/65 leading-relaxed mb-3">{step.desc}</p>
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-white border border-[#1C1C1E]/6">
                    <i className="ri-lightbulb-line text-amber-500 text-xs shrink-0 mt-0.5" />
                    <p className="text-xs text-[#1C1C1E]/65 leading-relaxed italic">{step.tip}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5 mistakes */}
        <section className="mb-14">
          <h2
            className="text-2xl md:text-3xl font-light text-[#1C1C1E] leading-tight mb-6"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            5 грешки, които НПО правят
            <br />
            <span className="italic text-[#0A2540]">с видео продукцията.</span>
          </h2>

          <div className="space-y-3">
            {mistakes.map((item, i) => (
              <div key={item.mistake} className="p-5 rounded-2xl border border-[#1C1C1E]/8 bg-white">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 flex items-center justify-center rounded-full bg-red-50 border border-red-100 shrink-0 mt-0.5">
                    <span className="text-[10px] font-medium text-red-500">{i + 1}</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#1C1C1E] mb-1.5 flex items-center gap-2">
                      <i className="ri-close-circle-line text-red-400 text-sm" />
                      {item.mistake}
                    </div>
                    <div className="flex items-start gap-2">
                      <i className="ri-checkbox-circle-line text-[#1B4332] text-sm shrink-0 mt-0.5" />
                      <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">{item.fix}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How to choose agency */}
        <section className="mb-14">
          <h2
            className="text-2xl md:text-3xl font-light text-[#1C1C1E] leading-tight mb-6"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Как да изберете агенция
            <br />
            <span className="italic text-[#0A2540]">за видео за НПО в Търново?</span>
          </h2>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-5">
            Не всяка видео агенция разбира НПО комуникацията. Ето какво да търсите:
          </p>

          <div className="space-y-3 mb-6">
            {[
              { icon: 'ri-check-line', color: '#1B4332', text: 'Портфолио с НПО проекти — не само рекламни видеа за бизнеси' },
              { icon: 'ri-check-line', color: '#1B4332', text: 'Разбиране на социалните каузи и НПО комуникацията' },
              { icon: 'ri-check-line', color: '#1B4332', text: 'Верифицируеми резултати — не само обещания' },
              { icon: 'ri-check-line', color: '#1B4332', text: 'Прозрачно ценообразуване — без скрити разходи' },
              { icon: 'ri-check-line', color: '#1B4332', text: 'Опит с оптимизация за социалните медии (субтитри, формати, дължина)' },
            ].map((item) => (
              <div key={item.text} className="flex items-start gap-2.5">
                <div className="w-5 h-5 flex items-center justify-center rounded-full border shrink-0 mt-0.5" style={{ borderColor: `${item.color}30` }}>
                  <i className={`${item.icon} text-[10px]`} style={{ color: item.color }} />
                </div>
                <span className="text-sm text-[#1C1C1E]/65 leading-relaxed">{item.text}</span>
              </div>
            ))}
          </div>

          <div className="p-5 rounded-2xl border border-[#0A2540]/12 bg-[#F9F9F9]">
            <p className="text-sm text-[#1C1C1E]/60 leading-relaxed">
              <strong className="text-[#0A2540]">ТАВОРА ЕООД</strong> е работила с Академика 245 и Амалипе —
              две от водещите НПО в България. Резултатите са верифицируеми.
              Консултацията е 50 € и включва обсъждане на каузата, целите и бюджета.
              Тази сума се приспада при сключване на договор.
            </p>
          </div>
        </section>

        {/* Internal links section */}
        <section className="mb-14 p-6 rounded-2xl border border-[#1C1C1E]/8 bg-[#F9F9F9]">
          <h3
            className="text-lg font-light text-[#1C1C1E] mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Свързани ресурси
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { to: '/npo-video', label: 'Видео за НПО — услугата', desc: 'Пълна информация за видео продукция за НПО' },
              { to: '/video-produkciya-veliko-tarnovo', label: 'Видео продукция Търново', desc: 'Всички видео услуги за бизнеси и НПО' },
              { to: '/reklama-veliko-tarnovo', label: 'Реклама Велико Търново', desc: 'Meta, Google, YouTube, TikTok кампании' },
              { to: '/digitalen-marketing-veliko-tarnovo', label: 'Дигитален маркетинг Търново', desc: 'Пълен дигитален маркетинг за бизнеси' },
              { to: '/blog/geo-ai-tarnovo', label: 'GEO оптимизация за AI', desc: 'Как да сте #1 в ChatGPT и Perplexity' },
              { to: '/kontakt', label: 'Свържете се с нас', desc: 'Консултация за вашия НПО проект' },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-[#1C1C1E]/6 hover:border-[#0A2540]/20 transition-all group cursor-pointer"
              >
                <i className="ri-arrow-right-line text-[#0A2540]/65 text-xs mt-0.5 group-hover:translate-x-0.5 transition-transform shrink-0" />
                <div>
                  <div className="text-xs font-medium text-[#1C1C1E] group-hover:text-[#0A2540] transition-colors">{link.label}</div>
                  <div className="text-[10px] text-[#1C1C1E]/65 leading-relaxed">{link.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-14">
          <h2
            className="text-2xl md:text-3xl font-light text-[#1C1C1E] leading-tight mb-8"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Въпроси за видео
            <br />
            <span className="italic text-[#0A2540]">за НПО в Търново.</span>
          </h2>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item) => (
              <details key={item.q} className="group rounded-2xl border border-[#1C1C1E]/8 bg-[#F9F9F9] overflow-hidden">
                <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none">
                  <span className="text-sm font-medium text-[#1C1C1E]">{item.q}</span>
                  <i className="ri-add-line text-[#0A2540]/65 text-base shrink-0 group-open:hidden" />
                  <i className="ri-subtract-line text-[#0A2540]/65 text-base shrink-0 hidden group-open:block" />
                </summary>
                <div className="px-5 pb-4">
                  <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">{item.a}</p>
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Conclusion */}
        <section className="mb-14 p-6 md:p-8 rounded-2xl border border-[#1C1C1E]/8 bg-[#0F1F35] text-white">
          <h2
            className="text-xl md:text-2xl font-light text-white leading-tight mb-3"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Готови ли сте да разкажете
            <br />
            <span className="italic text-white/60">историята на вашата кауза?</span>
          </h2>
          <p className="text-sm text-white/75 leading-relaxed mb-5">
            Консултацията е 50 € — обсъждаме каузата, целите и как видеото може да я разкаже.
            Тази сума се приспада при сключване на договор. Гаранция за връщане на парите.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/kontakt"
              className="px-6 py-3 bg-white text-[#0A2540] text-sm rounded-full hover:bg-white/90 transition-all cursor-pointer whitespace-nowrap text-center font-medium"
            >
              Поискайте консултация →
            </Link>
            <Link
              to="/npo-video"
              className="px-6 py-3 border border-white/20 text-white/70 text-sm rounded-full hover:border-white/40 hover:text-white transition-all cursor-pointer whitespace-nowrap text-center"
            >
              Видео за НПО →
            </Link>
          </div>
        </section>

        {/* Author */}
        <div className="flex items-start gap-4 pt-8 border-t border-[#1C1C1E]/8">
          <div className="w-12 h-12 rounded-full bg-[#0A2540]/8 flex items-center justify-center shrink-0">
            <i className="ri-user-line text-[#0A2540]/65 text-lg" />
          </div>
          <div>
            <div className="text-sm font-medium text-[#1C1C1E] mb-0.5">Владимир Атанасов</div>
            <div className="text-xs text-[#1C1C1E]/65 mb-2">Основател, ТАВОРА ЕООД · Велико Търново</div>
            <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">
              Дигитален маркетинг специалист с опит в SEO, реклами и видео продукция за бизнеси и НПО от Велико Търново и цяла България.
              Работил с Академика 245, Амалипе, K-Food и Sunrise Food.
            </p>
          </div>
        </div>

      </main>

      <SharedFooter />
    </div>
  );
}
