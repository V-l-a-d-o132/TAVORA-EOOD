import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SharedNav from '@/components/feature/SharedNav';
import SharedFooter from '@/components/feature/SharedFooter';

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      '@id': 'https://imashnujnoto.com/blog/gorski-borovinki-nomer-edno-google#article',
      name: 'Как Горски Боровинки стана #1 в Google и ChatGPT за горски боровинки',
      headline: 'Как Горски Боровинки стана #1 в Google и ChatGPT за горски боровинки',
      description: 'SEO казус: как gorskiborovinki.com достигна #1 в Google за "горски боровинки" и в ChatGPT за "от кой сайт да си купя горски боровинки". Локално SEO, GEO оптимизация и е-commerce стратегия.',
      author: { '@type': 'Person', name: 'Владимир Атанасов', url: 'https://imashnujnoto.com/ekip' },
      publisher: { '@type': 'Organization', name: 'ТАВОРА ЕООД', url: 'https://imashnujnoto.com', telephone: '+359885189724', email: 'tavoraagency@gmail.com', logo: { '@type': 'ImageObject', url: 'https://storage.readdy-site.link/project_files/3f265d07-5825-4e88-a58a-44deb287b858/777dce2a-8731-4235-b0be-7837a840c3c9_TAVORA-MARKETING-AGENCY-VELIKO-TARNOVO.png?v=f6135e7442d441feef102ad2f8425862' } },
      datePublished: '2026-07-08',
      dateModified: new Date().toISOString().split('T')[0],
      url: 'https://imashnujnoto.com/blog/gorski-borovinki-nomer-edno-google',
      mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://imashnujnoto.com/blog/gorski-borovinki-nomer-edno-google' },
      inLanguage: 'bg',
      image: 'https://readdy.ai/api/search-image?query=Fresh%20wild%20blueberries%20in%20rustic%20wooden%20basket%20forest%20background%20natural%20light%20soft%20focus%20purple%20berries%20organic%20produce%20editorial%20food%20photography%20warm%20tones%20high%20detail&width=1200&height=630&seq=blog-gorski-borovinki-hero-01&orientation=landscape',
      articleSection: 'SEO казус',
      keywords: 'SEO горски боровинки, gorskiborovinki.com, ChatGPT оптимизация, GEO оптимизация, е-commerce SEO, сезонни продукти',
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Начало', item: 'https://imashnujnoto.com/' },
        { '@type': 'ListItem', position: 2, name: 'Блог', item: 'https://imashnujnoto.com/blog' },
        { '@type': 'ListItem', position: 3, name: 'Горски Боровинки #1 в Google', item: 'https://imashnujnoto.com/blog/gorski-borovinki-nomer-edno-google' },
      ],
    },
    {
      '@type': 'LocalBusiness',
      '@id': 'https://imashnujnoto.com/#organization',
      name: 'ТАВОРА ЕООД',
      url: 'https://imashnujnoto.com',
      telephone: '+359885189724',
      email: 'tavoraagency@gmail.com',
    },
  ],
};

const TOC_ITEMS = [
  { id: 'predizvikatelstvo', label: 'Предизвикателството: продавай боровинки онлайн' },
  { id: 'seo-strategiya', label: 'SEO стратегия за ниша с ниска конкуренция' },
  { id: 'sait-optimizaciya', label: 'Оптимизация на сайта за конверсия' },
  { id: 'geo-chatgpt', label: 'GEO оптимизация за ChatGPT и AI търсачки' },
  { id: 'kluchovi-dumi', label: 'Ключови думи и клиентско намерение' },
  { id: 'social-proof', label: 'Социално доказателство и реални клиенти' },
  { id: 'rezultati', label: 'Реални резултати: +200% продажби' },
];

export default function GorskiBorovinkiNomerEdnoPage() {
  useEffect(() => {
    const id = 'schema-gorski-borovinki';
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement('script');
      el.id = id;
      el.type = 'application/ld+json';
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(SCHEMA);

    document.title = 'Как Горски Боровинки стана #1 в Google и ChatGPT | SEO казус | ТАВОРА ЕООД';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'SEO казус: как gorskiborovinki.com достигна #1 в Google за "горски боровинки" и в ChatGPT. Локално SEO, GEO оптимизация и е-commerce стратегия за сезонни продукти.');
    }
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://imashnujnoto.com/blog/gorski-borovinki-nomer-edno-google');

    return () => {
      document.getElementById(id)?.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <SharedNav />

      <main className="max-w-4xl mx-auto px-4 md:px-16">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="flex items-center gap-2 text-[11px] text-[#1C1C1E]/65 mb-6 pt-14 md:pt-20">
          <Link to="/" className="hover:text-[#1C1C1E]/60 transition-colors">Начало</Link>
          <i className="ri-arrow-right-s-line text-xs" />
          <Link to="/blog" className="hover:text-[#1C1C1E]/60 transition-colors">Блог</Link>
          <i className="ri-arrow-right-s-line text-xs" />
          <span className="text-[#1C1C1E]/65">Горски Боровинки #1</span>
        </nav>

        {/* Hero */}
        <section className="mb-10">
          <div className="w-full h-[280px] md:h-[400px] rounded-2xl overflow-hidden mb-8">
            <img
              src="https://readdy.ai/api/search-image?query=Fresh%20wild%20blueberries%20in%20rustic%20wooden%20basket%20forest%20background%20natural%20light%20soft%20focus%20purple%20berries%20organic%20produce%20editorial%20food%20photography%20warm%20tones%20high%20detail&width=1200&height=630&seq=blog-gorski-borovinki-hero-01&orientation=landscape"
              alt="Горски боровинки — SEO казус gorskiborovinki.com"
              className="w-full h-full object-cover object-top"
              loading="lazy" decoding="async"
            />
          </div>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-medium">SEO казус</span>
            <span className="text-[10px] text-[#1C1C1E]/70">8 Юли 2026</span>
            <span className="text-[10px] text-[#1C1C1E]/70">·</span>
            <span className="text-[10px] text-[#1C1C1E]/70">10 мин. четене</span>
          </div>

          <h1
            className="text-3xl md:text-5xl font-light text-[#1C1C1E] leading-tight mb-5"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Как Горски Боровинки стана{' '}
            <span className="italic text-[#0A2540]">#1 в Google и ChatGPT.</span>
          </h1>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed max-w-2xl mb-6">
            SEO казус: как <a href="https://gorskiborovinki.com/" target="_blank" rel="noopener noreferrer nofollow" className="text-[#0A2540] hover:underline">gorskiborovinki.com</a> достигна първо място в Google за <strong className="text-[#1C1C1E]">"горски боровинки"</strong> и в ChatGPT за <strong className="text-[#1C1C1E]">"от кой сайт да си купя горски боровинки"</strong> — без рекламен бюджет.
          </p>

          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-full bg-[#F9F9F7] border border-[#1C1C1E]/8 overflow-hidden">
              <img
                src="https://static.readdy.ai/image/658b459fcf05a7723f8029c45615de2f/7ba027e5c67ece54f762f57dda00407f.png"
                alt="Владимир Атанасов"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div>
              <div className="text-sm text-[#1C1C1E]/70">Владимир Атанасов</div>
              <div className="text-[10px] text-[#1C1C1E]/65">SEO & GEO специалист, ТАВОРА ЕООД</div>
            </div>
          </div>
        </section>

        {/* TOC */}
        <section className="p-6 md:p-8 rounded-2xl border border-[#1C1C1E]/8 bg-[#FAFAFA] mb-12">
          <div className="text-[10px] text-[#1C1C1E]/65 tracking-widest uppercase mb-4">Съдържание</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {TOC_ITEMS.map((item, i) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="flex items-center gap-2 text-sm text-[#1C1C1E]/65 hover:text-[#0A2540] transition-colors"
              >
                <span className="text-[10px] text-[#0A2540]/65 w-5">{String(i + 1).padStart(2, '0')}</span>
                {item.label}
              </a>
            ))}
          </div>
        </section>

        {/* Content */}
        <article className="prose-sm max-w-none">

          <section id="predizvikatelstvo" className="mb-12">
            <h2
              className="text-2xl md:text-3xl font-light text-[#1C1C1E] leading-tight mb-5"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Предизвикателството:{' '}
              <span className="italic text-[#0A2540]">продавай боровинки онлайн.</span>
            </h2>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              Димитър Колев бере горски боровинки в Стара Планина от десетилетия. Продуктът е премиум — ръчно набрани, без химия, директно от берача. Но преди да работим с него, сайтът му не се появяваше нито в Google, нито в ChatGPT.
            </p>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              Проблемът не беше в продукта — проблемът беше в <strong>откриваемостта</strong>. Когато някой напишеше <em>"горски боровинки"</em> или <em>"от кой сайт да си купя горски боровинки"</em>, резултатите показваха форуми, OLX обяви и статии от 2018. Жив сайт с реален продукт — никъде го нямаше.
            </p>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
              Целта беше ясна: #1 в Google за основната ключова дума и присъствие в AI търсачките. Без рекламен бюджет. Само с SEO, GEO и стратегия за съдържание.
            </p>
          </section>

          <section id="seo-strategiya" className="mb-12">
            <h2
              className="text-2xl md:text-3xl font-light text-[#1C1C1E] leading-tight mb-5"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              SEO стратегия за ниша{' '}
              <span className="italic text-[#0A2540]">с ниска конкуренция, но високо намерение.</span>
            </h2>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              "Горски боровинки" не е масова ниша. Конкуренцията е ниска, но обемът на търсенията също. Затова стратегията трябваше да бъде прецизна — всеки елемент от сайта да носи SEO тежест.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <div className="p-5 rounded-xl border border-[#1C1C1E]/8 bg-white">
                <div className="text-[10px] text-[#1C1C1E]/65 tracking-widest uppercase mb-3">Технически SEO</div>
                <ul className="space-y-1.5 text-sm text-[#1C1C1E]/65">
                  <li>· Бърз сайт — под 2 сек зареждане</li>
                  <li>· Mobile-first — 80% търсят от телефон</li>
                  <li>· Schema.org за Product + LocalBusiness</li>
                  <li>· HTTPS + сигурно плащане</li>
                  <li>· Оптимизирани изображения с alt текст</li>
                  <li>· Чист URL структура</li>
                </ul>
              </div>
              <div className="p-5 rounded-xl border border-[#1C1C1E]/8 bg-white">
                <div className="text-[10px] text-[#1C1C1E]/65 tracking-widest uppercase mb-3">Съдържателна стратегия</div>
                <ul className="space-y-1.5 text-sm text-[#1C1C1E]/65">
                  <li>· H1: "Горски боровинки — директно от берача"</li>
                  <li>· FAQ секция с 25+ въпроса и отговора</li>
                  <li>· Реални клиентски скрийншоти от Viber</li>
                  <li>· Галерия с реални снимки на реколтата</li>
                  <li>· Сезонна реколта страница (обновява се)</li>
                  <li>· Entity statements за AI търсачки</li>
                </ul>
              </div>
            </div>

            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
              <strong>Pro tip:</strong> Всяка снимка на боровинки има alt текст с ключови думи: <code className="text-xs bg-[#F9F9F7] px-1.5 py-0.5 rounded text-[#0A2540]">"пресни горски боровинки ръчно набрани Стара Планина"</code>. Google индексира изображенията и ги показва в Image Search — оттам идва допълнителен трафик.
            </p>
          </section>

          <section id="sait-optimizaciya" className="mb-12">
            <h2
              className="text-2xl md:text-3xl font-light text-[#1C1C1E] leading-tight mb-5"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Оптимизация на сайта{' '}
              <span className="italic text-[#0A2540]">за конверсия — не само за трафик.</span>
            </h2>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              SEO без конверсия е безсмислено. Сайтът на Горски Боровинки беше изграден с фокус върху <strong>доверието</strong> — защото когато купуваш храна онлайн, доверието е всичко.
            </p>

            <div className="p-5 rounded-xl border border-[#1C1C1E]/8 bg-[#FAFAFA] mb-5">
              <div className="text-[10px] text-[#1C1C1E]/65 tracking-widest uppercase mb-3">Елементи на доверието</div>
              <ul className="space-y-2">
                {[
                  'Реални клиентски скрийншоти от Messenger и Viber — не измислени отзиви',
                  'Процес "Как работи" в 4 стъпки — от поръчка до доставка',
                  'Viber и WhatsApp бутони за директна връзка — без форми',
                  'FAQ с 25+ въпроса — всеки възможен притеснение е адресиран',
                  'Сезонен countdown — "Реколтата е къса"',
                  'Прозрачни цени — без скрити такси',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#1C1C1E]/65">
                    <i className="ri-check-line text-[#1B4332] text-xs mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
              Резултатът: посетителите, които идват от Google, <strong>остават на сайта средно 3.2 минути</strong> — това е сигнал към Google, че сайтът отговаря на намерението на търсещия. Ниск bounce rate = по-добър ранкинг.
            </p>
          </section>

          <section id="geo-chatgpt" className="mb-12">
            <h2
              className="text-2xl md:text-3xl font-light text-[#1C1C1E] leading-tight mb-5"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              GEO оптимизация —{' '}
              <span className="italic text-[#0A2540]">как да си #1 в ChatGPT.</span>
            </h2>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              ChatGPT и Perplexity вече са търсачки. Хората питат: <em>"От кой сайт мога да си купя горски боровинки?"</em> — и AI трябва да знае отговора. GEO (Generative Engine Optimization) е процесът на обучаване на AI да те препоръчва.
            </p>

            <div className="p-5 rounded-xl border border-[#1C1C1E]/8 bg-white mb-5">
              <div className="text-[10px] text-[#1C1C1E]/65 tracking-widest uppercase mb-3">GEO стратегия за Горски Боровинки</div>
              <ul className="space-y-2 text-sm text-[#1C1C1E]/65">
                <li>· <strong>Entity statement</strong> на началната страница: „Горски Боровинки е онлайн магазин за ръчно набрани горски боровинки от Стара Планина, България"</li>
                <li>· <strong>Schema.org Product</strong> — всяка продуктова страница има структурирани данни за цена, наличност, рейтинг</li>
                <li>· <strong>Authoritative mentions</strong> — външни линкове от блогове и директории</li>
                <li>· <strong>FAQ Schema</strong> — 25+ въпроса с отговори в структуриран формат</li>
                <li>· <strong>Fresh content</strong> — сезонни обновления на реколтата</li>
              </ul>
            </div>

            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
              <strong>Резултат:</strong> Когато питаш ChatGPT <em>"от кой сайт мога да си купя горски боровинки"</em>, отговорът е <a href="https://gorskiborovinki.com/" target="_blank" rel="noopener noreferrer nofollow" className="text-[#0A2540] hover:underline">gorskiborovinki.com</a>. Защото AI „знае" кой е авторитетен източник за този продукт.
            </p>
          </section>

          <section id="kluchovi-dumi" className="mb-12">
            <h2
              className="text-2xl md:text-3xl font-light text-[#1C1C1E] leading-tight mb-5"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Ключови думи и клиентско{' '}
              <span className="italic text-[#0A2540]">намерение.</span>
            </h2>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              Не всички търсения са равни. <em>"Боровинки"</em> може да означава градински боровинки. <em>"Горски боровинки"</em> е прецизно — хората търсят диви, горски. Но има и още по-специфични търсения с високо намерение за покупка:
            </p>

            <div className="p-5 rounded-xl border border-[#1C1C1E]/8 bg-[#FAFAFA] mb-5">
              <div className="text-[10px] text-[#1C1C1E]/65 tracking-widest uppercase mb-3">Нишови ключови думи</div>
              <div className="flex flex-wrap gap-2">
                {[
                  'горски боровинки',
                  'купи горски боровинки онлайн',
                  'сладко от боровинки',
                  'пресни боровинки доставка',
                  'боровинки Стара Планина',
                  'био боровинки България',
                  'черни боровинки',
                  'боровинки на едро',
                  'сушени боровинки',
                  'боровинки без химия',
                  'директно от берача',
                  'сезонна реколта боровинки',
                ].map((kw) => (
                  <span
                    key={kw}
                    className="text-xs px-3 py-1.5 rounded-full bg-white border border-[#1C1C1E]/8 text-[#1C1C1E]/65"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
              <strong>Стратегия:</strong> Всяка продуктова страница оптимизира за конкретна ниша. Страницата за сладко от боровинки ранква за <em>"сладко от боровинки"</em>. Страницата за сушени боровинки — за <em>"сушени боровинки"</em>. Това е <strong>long-tail SEO</strong> — по-малко трафик, но 3x по-висока конверсия.
            </p>
          </section>

          <section id="social-proof" className="mb-12">
            <h2
              className="text-2xl md:text-3xl font-light text-[#1C1C1E] leading-tight mb-5"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Социално доказателство —{' '}
              <span className="italic text-[#0A2540]">не измислени отзиви, а реални скрийншоти.</span>
            </h2>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              На сайта на Горски Боровинки няма звезди и generic отзиви. Вместо това има <strong>реални скрийншоти от Messenger и Viber разговори</strong> с клиенти. Това е по-силно от всяка 5-звездна рецензия, защото е необработен, автентичен.
            </p>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              Viber групата за реколтата е друг мощен инструмент. Клиентите се присъединяват, виждат кога има реколта, поръчват директно. Това не е само канал за продажби — това е <strong>community</strong>, който Google вижда като ангажираност.
            </p>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
              <strong>SEO ефект:</strong> Когато хората споделят линк към сайта във Viber и Messenger, това създава <strong>social signals</strong> — непреки сигнали към Google, че сайтът е релевантен и полезен.
            </p>
          </section>

          <section id="rezultati" className="mb-12">
            <h2
              className="text-2xl md:text-3xl font-light text-[#1C1C1E] leading-tight mb-5"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Реални резултати:{' '}
              <span className="italic text-[#0A2540]">+200% продажби за един сезон.</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="p-5 rounded-xl border border-[#1C1C1E]/8 bg-white text-center">
                <div className="text-2xl font-light text-[#0A2540] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>#1</div>
                <div className="text-xs text-[#1C1C1E]/65">в Google за „горски боровинки"</div>
              </div>
              <div className="p-5 rounded-xl border border-[#1C1C1E]/8 bg-white text-center">
                <div className="text-2xl font-light text-[#0A2540] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>+200%</div>
                <div className="text-xs text-[#1C1C1E]/65">продажби за един сезон</div>
              </div>
              <div className="p-5 rounded-xl border border-[#1C1C1E]/8 bg-white text-center">
                <div className="text-2xl font-light text-[#0A2540] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>ChatGPT</div>
                <div className="text-xs text-[#1C1C1E]/65">препоръчва сайта при запитване</div>
              </div>
            </div>

            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              Резултатите са постигнати без рекламен бюджет. Само с SEO, GEO и стратегия за съдържание. Времето за резултат: <strong>2–3 месеца</strong> за Google, <strong>4–5 месеца</strong> за ChatGPT.
            </p>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
              <a href="https://gorskiborovinki.com/" target="_blank" rel="noopener noreferrer nofollow" className="text-[#0A2540] hover:underline inline-flex items-center gap-1">
                Вижте живия сайт <i className="ri-external-link-line" />
              </a>
            </p>
          </section>

          {/* CTA */}
          <section className="mb-12 p-7 md:p-10 rounded-2xl bg-[#0F1F35] text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="text-xs text-white/75 tracking-widest uppercase mb-2">Готови за #1 в Google?</div>
                <div
                  className="text-2xl md:text-3xl font-light leading-tight mb-2"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  SEO за вашия бизнес
                  <br />
                  <span className="italic text-white/60">във Велико Търново.</span>
                </div>
                <p className="text-sm text-white/75 max-w-md leading-relaxed">
                  Консултация 50 € — анализ на текущата позиция, конкурентите и стратегия за #1. Сумата се приспада при договор.
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
                  to="/uslugi/seo-geo"
                  className="px-7 py-3.5 border border-white/20 text-white/70 text-sm rounded-full hover:border-white/40 hover:text-white transition-all cursor-pointer whitespace-nowrap text-center"
                >
                  SEO услуги
                </Link>
              </div>
            </div>
          </section>

          {/* Related articles */}
          <section className="mb-12 pt-8 border-t border-[#1C1C1E]/6">
            <div className="text-[10px] text-[#1C1C1E]/65 tracking-widest uppercase mb-4">Свързани статии</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { title: 'GEO оптимизация за ChatGPT и Perplexity', to: '/blog/geo-ai-tarnovo' },
                { title: 'SEO оптимизация Велико Търново 2026', to: '/blog/seo-optimizaciya-tarnovo-2026' },
                { title: 'E-commerce стратегия за Търново 2026', to: '/blog/ecommerce-tarnovo-2026' },
                { title: 'Безплатен SEO за номер 1 в Google', to: '/blog/bezplaten-seo-nomer-edno-google' },
              ].map((a) => (
                <Link
                  key={a.to}
                  to={a.to}
                  className="group flex items-center justify-between gap-3 p-4 rounded-xl border border-[#1C1C1E]/8 bg-white hover:border-[#0A2540]/15 transition-all cursor-pointer"
                >
                  <span className="text-sm text-[#1C1C1E]/70 group-hover:text-[#0A2540] transition-colors">{a.title}</span>
                  <i className="ri-arrow-right-line text-[#1C1C1E]/20 group-hover:text-[#0A2540]/65 text-sm shrink-0 group-hover:translate-x-1 transition-transform" />
                </Link>
              ))}
            </div>
          </section>
        </article>
      </main>

      <SharedFooter />
    </div>
  );
}