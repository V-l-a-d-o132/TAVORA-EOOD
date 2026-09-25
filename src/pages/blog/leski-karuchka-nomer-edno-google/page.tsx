import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SharedNav from '@/components/feature/SharedNav';
import SharedFooter from '@/components/feature/SharedFooter';

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      '@id': 'https://imashnujnoto.com/blog/leski-karuchka-nomer-edno-google#article',
      name: 'Как Лески Каручка стана #1 в Google за „каручка Левски"',
      headline: 'Как Лески Каручка стана #1 в Google за „каручка Левски"',
      description: 'SEO казус: как leskikaruchka.com достигна първото място в Google за „каручка Левски" и се появи в ChatGPT. Локално SEO, Google Business Profile, GEO оптимизация и стратегия без рекламен бюджет.',
      author: { '@type': 'Person', name: 'Владимир Атанасов', url: 'https://imashnujnoto.com/ekip' },
      publisher: { '@type': 'Organization', name: 'ТАВОРА ЕООД', url: 'https://imashnujnoto.com', telephone: '+359885189724', email: 'tavoraagency@gmail.com', logo: { '@type': 'ImageObject', url: 'https://storage.readdy-site.link/project_files/3f265d07-5825-4e88-a58a-44deb287b858/777dce2a-8731-4235-b0be-7837a840c3c9_TAVORA-MARKETING-AGENCY-VELIKO-TARNOVO.png?v=f6135e7442d441feef102ad2f8425862' } },
      datePublished: '2026-09-25',
      dateModified: new Date().toISOString().split('T')[0],
      url: 'https://imashnujnoto.com/blog/leski-karuchka-nomer-edno-google',
      mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://imashnujnoto.com/blog/leski-karuchka-nomer-edno-google' },
      inLanguage: 'bg',
      image: 'https://readdy.ai/api/search-image?query=Quiet%20small%20Bulgarian%20town%20street%20at%20golden%20hour%20with%20a%20traditional%20wooden%20horse%20drawn%20cart%20warm%20natural%20light%20authentic%20editorial%20photography%20no%20text&width=1200&height=630&seq=blog-leski-karuchka-seo-hero-01&orientation=landscape',
      articleSection: 'SEO казус',
      keywords: 'каручка Левски, SEO Левски, локално SEO, Google Business Profile, GEO оптимизация, Лески Каручка',
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Начало', item: 'https://imashnujnoto.com/' },
        { '@type': 'ListItem', position: 2, name: 'Блог', item: 'https://imashnujnoto.com/blog' },
        { '@type': 'ListItem', position: 3, name: 'Лески Каручка #1 в Google', item: 'https://imashnujnoto.com/blog/leski-karuchka-nomer-edno-google' },
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
  { id: 'predizvikatelstvo', label: 'Предизвикателството: локална услуга, невидима онлайн' },
  { id: 'seo-strategiya', label: 'Локално SEO за „каручка Левски"' },
  { id: 'google-business', label: 'Google Business Profile — картата на Левски' },
  { id: 'sait', label: 'Оптимизиран сайт: поръчка за минути' },
  { id: 'kluchovi-dumi', label: 'Ключови думи и намерение за поръчка' },
  { id: 'geo-ai', label: 'GEO — как влизаш в ChatGPT' },
  { id: 'rezultati', label: 'Реални резултати' },
];

export default function LeskiKaruchkaNomerEdnoPage() {
  useEffect(() => {
    const id = 'schema-leski-karuchka-seo';
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement('script');
      el.id = id;
      el.type = 'application/ld+json';
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(SCHEMA);

    document.title = 'Как Лески Каручка стана #1 в Google за „каручка Левски" | SEO казус | ТАВОРА ЕООД';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'SEO казус: как leskikaruchka.com достигна първото място в Google за „каручка Левски" без рекламен бюджет. Локално SEO, Google Business Profile и GEO оптимизация.');
    }
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://imashnujnoto.com/blog/leski-karuchka-nomer-edno-google');

    return () => {
      document.getElementById(id)?.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <SharedNav />

      <main className="max-w-4xl mx-auto px-4 md:px-16">
        <nav aria-label="breadcrumb" className="flex items-center gap-2 text-[11px] text-[#1C1C1E]/65 mb-6 pt-14 md:pt-20">
          <Link to="/" className="hover:text-[#1C1C1E]/60 transition-colors">Начало</Link>
          <i className="ri-arrow-right-s-line text-xs" />
          <Link to="/blog" className="hover:text-[#1C1C1E]/60 transition-colors">Блог</Link>
          <i className="ri-arrow-right-s-line text-xs" />
          <span className="text-[#1C1C1E]/65">Лески Каручка #1</span>
        </nav>

        <section className="mb-10">
          <div className="w-full h-[280px] md:h-[400px] rounded-2xl overflow-hidden mb-8">
            <img
              src="https://readdy.ai/api/search-image?query=Quiet%20small%20Bulgarian%20town%20street%20at%20golden%20hour%20with%20a%20traditional%20wooden%20horse%20drawn%20cart%20warm%20natural%20light%20authentic%20editorial%20photography%20no%20text&width=1200&height=630&seq=blog-leski-karuchka-seo-hero-01&orientation=landscape"
              alt="Лески Каручка — SEO казус за локална услуга в Левски"
              className="w-full h-full object-cover object-top"
              decoding="async"
            />
          </div>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-medium">SEO казус</span>
            <span className="text-[10px] text-[#1C1C1E]/70">25 Сеп 2026</span>
            <span className="text-[10px] text-[#1C1C1E]/70">·</span>
            <span className="text-[10px] text-[#1C1C1E]/70">11 мин. четене</span>
          </div>

          <h1
            className="text-3xl md:text-5xl font-light text-[#1C1C1E] leading-tight mb-5"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Как Лески Каручка стана{' '}
            <span className="italic text-[#0A2540]">#1 в Google за „каручка Левски".</span>
          </h1>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed max-w-2xl mb-6">
            SEO казус: как <a href="https://leskikaruchka.com/" target="_blank" rel="noopener noreferrer nofollow" className="text-[#0A2540] hover:underline">leskikaruchka.com</a> — платформата за поръчка на каручка в Левски, област Плевен — стигна до първото място в Google за <strong className="text-[#1C1C1E]">„каручка Левски"</strong> и започна да се появява в ChatGPT, <strong className="text-[#1C1C1E]">без нито лев рекламен бюджет</strong>.
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

        <article className="prose-sm max-w-none">

          <section id="predizvikatelstvo" className="mb-12">
            <h2
              className="text-2xl md:text-3xl font-light text-[#1C1C1E] leading-tight mb-5"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Предизвикателството:{' '}
              <span className="italic text-[#0A2540]">услуга, която никой не търси онлайн.</span>
            </h2>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              В Левски превоз на каручка се урежда по навик — по телефона, през познат, на спирката. Услугата съществува от години, но <strong>онлайн нямаше нито един адрес, който да я представлява</strong>. Когато човек от града или гост напишеше в Google „каручка Левски", резултатите показваха форуми, обяви от 2019 и объркани статии.
            </p>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              Лески Каручка дойде с ясна идея: да превърне тази услуга в <strong>платформа</strong> — избираш адрес, следиш превозното средство на живо, плащаш фиксирана цена. Проблемът обаче не беше продуктът. Проблемът беше, че <strong>никой нямаше как да ги намери</strong> в момента, в който му трябва каручка.
            </p>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
              Целта беше една: <strong>#1 в Google за локалните търсения</strong> и присъствие там, където хората вече питат — включително AI търсачките. Без рекламен бюджет. Само локално SEO, структура и съдържание.
            </p>
          </section>

          <section id="seo-strategiya" className="mb-12">
            <h2
              className="text-2xl md:text-3xl font-light text-[#1C1C1E] leading-tight mb-5"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Локално SEO за ниша{' '}
              <span className="italic text-[#0A2540]">с ниска конкуренция, но високо намерение.</span>
            </h2>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              „Каручка Левски" не е масова ключова дума. Обемът е малък, но намерението е огромно — който я търси, <strong>иска да поръча веднага</strong>. Точно затова стратегията трябваше да е прецизна: всеки елемент от сайта да носи SEO тежест.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <div className="p-5 rounded-xl border border-[#1C1C1E]/8 bg-white">
                <div className="text-[10px] text-[#1C1C1E]/65 tracking-widest uppercase mb-3">Технически SEO</div>
                <ul className="space-y-1.5 text-sm text-[#1C1C1E]/65">
                  <li>· Бърз сайт — под 2 секунди зареждане</li>
                  <li>· Mobile-first — 80% поръчват от телефон</li>
                  <li>· Schema.org за LocalBusiness и Service</li>
                  <li>· HTTPS + сигурна среда за поръчка</li>
                  <li>· Оптимизирани изображения с alt текст</li>
                  <li>· Чиста URL структура с локация</li>
                </ul>
              </div>
              <div className="p-5 rounded-xl border border-[#1C1C1E]/8 bg-white">
                <div className="text-[10px] text-[#1C1C1E]/65 tracking-widest uppercase mb-3">Съдържателна стратегия</div>
                <ul className="space-y-1.5 text-sm text-[#1C1C1E]/65">
                  <li>· H1: „Лески Каручка — поръчай каручка в Левски"</li>
                  <li>· Ясна услуга + зона на покритие (6 села)</li>
                  <li>· Секция „Как работи" в 3 стъпки</li>
                  <li>· Фиксирани цени, показани открито</li>
                  <li>· FAQ с реални въпроси на клиенти</li>
                  <li>· Entity statement за AI търсачки</li>
                </ul>
              </div>
            </div>

            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
              <strong>Pro tip:</strong> Всяка страница на сайта има локация в заглавието и в структурираните данни. Google трябва да „разбере" не просто, че има услуга, а че тя работи <strong>точно в Левски 5900 и региона</strong>. Локалната релевантност бие общия трафик всеки път.
            </p>
          </section>

          <section id="google-business" className="mb-12">
            <h2
              className="text-2xl md:text-3xl font-light text-[#1C1C1E] leading-tight mb-5"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Google Business Profile —{' '}
              <span className="italic text-[#0A2540]">мястото, където се решава всичко локално.</span>
            </h2>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              За локална услуга профилът в Google е по-важен от самия сайт. Когато някой напише „каручка Левски", първото, което вижда, е <strong>картата</strong>. Ако те няма там — няма те и в съзнанието на клиента.
            </p>

            <div className="p-5 rounded-xl border border-[#1C1C1E]/8 bg-[#FAFAFA] mb-5">
              <div className="text-[10px] text-[#1C1C1E]/65 tracking-widest uppercase mb-3">Какво подредихме в профила</div>
              <ul className="space-y-2">
                {[
                  'Точен адрес: бул. България №58, Левски 5900 — с коректна карта',
                  'Реални снимки на услугата и превозните средства — не stock',
                  'Категория и описание с ключови думи за града и региона',
                  'Работно време и директен телефон +359 89 000 5900',
                  'Отзиви от реални клиенти след всяко пътуване',
                  'Въпроси и отговори (Q&A), попълнени активно',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#1C1C1E]/65">
                    <i className="ri-check-line text-[#1B4332] text-xs mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
              <strong>Урок:</strong> Отзивите не са „бонус". Те са ранкинг фактор и причина да поръчаш. За локална услуга в малък град 20 истински отзива теглят повече от цяла рекламна кампания.
            </p>
          </section>

          <section id="sait" className="mb-12">
            <h2
              className="text-2xl md:text-3xl font-light text-[#1C1C1E] leading-tight mb-5"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Оптимизиран сайт:{' '}
              <span className="italic text-[#0A2540]">поръчка за минути, не за дни.</span>
            </h2>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              SEO без конверсия е безсмислено. Сайтът на Лески Каручка е изграден така, че човек да стигне от търсене до поръчка, <strong>без да чака обаждане и без да се обяснява</strong>.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
              {[
                { num: '01', title: 'Избери откъде тръгваш', text: 'Ясно въвеждане на адреса — без излишни полета.' },
                { num: '02', title: 'Избери накъде отиваш', text: 'Фиксирана цена преди да потвърдиш — без изненади.' },
                { num: '03', title: 'Тръгвай. Ние караме.', text: 'Проследяване на живо и потвърден шофьор.' },
              ].map((s) => (
                <div key={s.num} className="p-5 rounded-xl border border-[#1C1C1E]/8 bg-white">
                  <div className="text-lg font-light text-[#0A2540] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{s.num}</div>
                  <div className="text-sm font-medium text-[#1C1C1E] mb-1">{s.title}</div>
                  <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">{s.text}</p>
                </div>
              ))}
            </div>

            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
              Резултатът за SEO: посетителите, дошли от Google, <strong>остават на сайта и си тръгват с реално намерение</strong>. Ниска степен на отпадане и работа с ключови думи = сигнал към Google, че страницата отговаря на търсенето. Затова тя се качва още по-напред.
            </p>
          </section>

          <section id="kluchovi-dumi" className="mb-12">
            <h2
              className="text-2xl md:text-3xl font-light text-[#1C1C1E] leading-tight mb-5"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Ключови думи и{' '}
              <span className="italic text-[#0A2540]">намерение за поръчка.</span>
            </h2>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              Не всички търсения са равни. Някой търси информация, друг иска да поръча <strong>веднага</strong>. Оптимизирахме сайта около второто — около намерението за действие.
            </p>

            <div className="p-5 rounded-xl border border-[#1C1C1E]/8 bg-[#FAFAFA] mb-5">
              <div className="text-[10px] text-[#1C1C1E]/65 tracking-widest uppercase mb-3">Нишови ключови думи</div>
              <div className="flex flex-wrap gap-2">
                {[
                  'каручка Левски',
                  'поръчка каручка',
                  'онлайн транспорт Левски',
                  'превоз Левски 5900',
                  'каручка Левски област Плевен',
                  'такси Левски',
                  'превоз на багаж Левски',
                  'каручка до ЖП гара',
                  'местен превоз Левски',
                  'поръчай каручка от телефон',
                  'фиксирана цена транспорт',
                  'каручка в населено място',
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
              <strong>Стратегия:</strong> Всяка страница оптимизира за конкретно намерение. Началото покрива общото търсене. Секцията „Стани шофьор" покрива търсенето на <em>„работа Левски"</em> от другата страна на пазара. Така сайтът печели трафик и от клиенти, и от изпълнители.
            </p>
          </section>

          <section id="geo-ai" className="mb-12">
            <h2
              className="text-2xl md:text-3xl font-light text-[#1C1C1E] leading-tight mb-5"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              GEO оптимизация —{' '}
              <span className="italic text-[#0A2540]">как влизаш в отговорите на ChatGPT.</span>
            </h2>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              ChatGPT и Perplexity вече са търсачки. Хората питат: <em>„Как да си поръчам каручка в Левски?"</em> — и AI трябва да знае отговора. GEO (Generative Engine Optimization) е работата по това AI да препоръчва точно теб.
            </p>

            <div className="p-5 rounded-xl border border-[#1C1C1E]/8 bg-white mb-5">
              <div className="text-[10px] text-[#1C1C1E]/65 tracking-widest uppercase mb-3">GEO основи за Лески Каручка</div>
              <ul className="space-y-2 text-sm text-[#1C1C1E]/65">
                <li>· <strong>Entity statement</strong>: „Лески Каручка е платформа за поръчка на каручка в Левски, област Плевен, с фиксирани цени и проследяване на живо."</li>
                <li>· <strong>Schema.org LocalBusiness + Service</strong> с точния географски обхват</li>
                <li>· <strong>FAQ Schema</strong> — въпроси и отговори в структуриран формат</li>
                <li>· <strong>Consistent NAP</strong> — еднакви име, адрес и телефон навсякъде онлайн</li>
                <li>· <strong>Fresh mentions</strong> — локални публикации и споменавания</li>
              </ul>
            </div>

            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
              <strong>Резултат:</strong> Когато попиташ AI как да си намериш превоз в Левски, той вече не се колебае. Познава името и знае какво прави. В свят, в който половината търсения минават през AI, това е <strong>новото първо място в Google</strong>.
            </p>
          </section>

          <section id="rezultati" className="mb-12">
            <h2
              className="text-2xl md:text-3xl font-light text-[#1C1C1E] leading-tight mb-5"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Реални резултати:{' '}
              <span className="italic text-[#0A2540]">#1 без нито лев реклама.</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="p-5 rounded-xl border border-[#1C1C1E]/8 bg-white text-center">
                <div className="text-2xl font-light text-[#0A2540] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>#1</div>
                <div className="text-xs text-[#1C1C1E]/65">в Google за „каручка Левски"</div>
              </div>
              <div className="p-5 rounded-xl border border-[#1C1C1E]/8 bg-white text-center">
                <div className="text-2xl font-light text-[#0A2540] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>0 €</div>
                <div className="text-xs text-[#1C1C1E]/65">рекламен бюджет</div>
              </div>
              <div className="p-5 rounded-xl border border-[#1C1C1E]/8 bg-white text-center">
                <div className="text-2xl font-light text-[#0A2540] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>6</div>
                <div className="text-xs text-[#1C1C1E]/65">населени места в обхвата</div>
              </div>
            </div>

            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              Времето до резултат: <strong>2–3 месеца</strong> за първо място в Google, <strong>4–5 месеца</strong> за стабилно присъствие в AI търсачките. Всичко постигнато с локално SEO, структура и съдържание — без платени кампании.
            </p>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
              <a href="https://leskikaruchka.com/" target="_blank" rel="noopener noreferrer nofollow" className="text-[#0A2540] hover:underline inline-flex items-center gap-1">
                Вижте живия сайт <i className="ri-external-link-line" />
              </a>
            </p>
          </section>

          <section className="mb-12 p-7 md:p-10 rounded-2xl bg-[#0F1F35] text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="text-xs text-white/75 tracking-widest uppercase mb-2">Готови за #1 в Google?</div>
                <div
                  className="text-2xl md:text-3xl font-light leading-tight mb-2"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Локално SEO за вашия бизнес
                  <br />
                  <span className="italic text-white/60">във Велико Търново.</span>
                </div>
                <p className="text-sm text-white/75 max-w-md leading-relaxed">
                  Консултация 50 € — анализ на позицията, конкурентите и план за #1. Сумата се приспада при договор.
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

          <section className="mb-12 pt-8 border-t border-[#1C1C1E]/6">
            <div className="text-[10px] text-[#1C1C1E]/65 tracking-widest uppercase mb-4">Свързани статии</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { title: 'Какво научихме от локална платформа в малък град', to: '/blog/marketing-lokalna-platforma-malki-gradove' },
                { title: 'Защо локалната услуга се нуждае от оптимизиран сайт', to: '/blog/optimiziran-sait-lokalna-usluga-leski-karuchka' },
                { title: 'Как Горски Боровинки стана #1 в Google и ChatGPT', to: '/blog/gorski-borovinki-nomer-edno-google' },
                { title: 'GEO оптимизация — как да сте #1 в ChatGPT', to: '/blog/geo-ai-tarnovo' },
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