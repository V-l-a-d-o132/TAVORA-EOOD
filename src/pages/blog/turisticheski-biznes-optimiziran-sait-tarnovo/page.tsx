import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SharedNav from '@/components/feature/SharedNav';
import SharedFooter from '@/components/feature/SharedFooter';

const today = new Date().toISOString().split('T')[0];

const ARTICLE_SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      '@id': 'https://imashnujnoto.com/blog/turisticheski-biznes-optimiziran-sait-tarnovo#article',
      headline: 'Защо локалният туристически бизнес се нуждае от оптимизиран сайт: примерът на Photo Tarnovo',
      description: 'Как оптимизираният сайт на Photo Tarnovo превърна street portrait фотографията на Царевец в #1 резултат в Google. Техническо SEO, Schema.org, двуезично съдържание и Google Business Profile за туристически бизнес.',
      author: { '@type': 'Person', name: 'Владимир Атанасов', url: 'https://imashnujnoto.com/ekip' },
      publisher: { '@type': 'Organization', '@id': 'https://imashnujnoto.com/#organization', name: 'ТАВОРА ЕООД', url: 'https://imashnujnoto.com', logo: { '@type': 'ImageObject', url: 'https://storage.readdy-site.link/project_files/3f265d07-5825-4e88-a58a-44deb287b858/ec0eb8c9-c502-4cf5-bee4-657c996896dc_--.png?v=3d4829c108a0d31cdde2da513964de19' } },
      datePublished: '2026-06-20',
      dateModified: today,
      inLanguage: 'bg',
      url: 'https://imashnujnoto.com/blog/turisticheski-biznes-optimiziran-sait-tarnovo',
      wordCount: 2400,
      timeRequired: 'PT9M',
      image: { '@type': 'ImageObject', url: 'https://readdy.ai/api/search-image?query=modern%20optimized%20website%20design%20for%20local%20tourism%20business%20laptop%20screen%20showing%20photographer%20portfolio%20website%20Tsarevets%20Fortress%20Bulgaria%20professional%20clean%20layout%20responsive%20design%20warm%20ambient%20lighting&width=1200&height=630&seq=blog-turisticheski-sait-hero&orientation=landscape', width: 1200, height: 630 },
      mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://imashnujnoto.com/blog/turisticheski-biznes-optimiziran-sait-tarnovo' },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Начало', item: 'https://imashnujnoto.com/' },
          { '@type': 'ListItem', position: 2, name: 'Блог', item: 'https://imashnujnoto.com/blog' },
          { '@type': 'ListItem', position: 3, name: 'Туристически бизнес — оптимизиран сайт', item: 'https://imashnujnoto.com/blog/turisticheski-biznes-optimiziran-sait-tarnovo' },
        ],
      },
      keywords: 'туристически бизнес, оптимизиран сайт, Photo Tarnovo, техническо SEO, Schema.org, локално SEO, Царевец, Велико Търново, уеб дизайн',
      mentions: [
        { '@type': 'Organization', name: 'ТАВОРА ЕООД', url: 'https://imashnujnoto.com' },
        { '@type': 'Organization', name: 'Photo Tarnovo', url: 'https://phototarnovo.com' },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Защо туристическият бизнес се нуждае от професионален сайт, а не само от социални мрежи?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Социалните мрежи са важни, но те не се индексират от Google по същия начин като уебсайт. Когато турист търси „photographer Veliko Tarnovo", Google показва уебсайтове, не Instagram профили. Сайтът е единственото място, където вие контролирате цялото съдържание, структурата и SEO оптимизацията. Освен това, сайтът позволява Schema.org маркиране, което директно влияе на ранкинга и rich snippets в Google.',
          },
        },
        {
          '@type': 'Question',
          name: 'Какви технически елементи са задължителни за сайт на туристически бизнес?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Задължителните технически елементи включват: 1) Schema.org маркиране за LocalBusiness и/или TouristAttraction с геокоординати, 2) responsive дизайн за мобилни устройства (над 70% от туристическите търсения са от телефон), 3) бързо зареждане (Core Web Vitals), 4) HTTPS сертификат, 5) оптимизирани мета тагове на всички езици, 6) канонични URL-ове за избягване на duplicate content и 7) XML sitemap за правилно индексиране.',
          },
        },
        {
          '@type': 'Question',
          name: 'Как двуезичният сайт помага на туристическия бизнес в България?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'България привлича туристи от цял свят — англоговорящи, немски, румънски, гръцки и други. Двуезичният сайт (български + английски) покрива над 80% от потенциалните туристически търсения. Google третира всяка езикова версия като отделен сет от страници, което удвоява шансовете за ранк. Важно е съдържанието да е оригинално за всеки език, а не машинен превод — Google наказва автоматично преведеното съдържание.',
          },
        },
      ],
    },
  ],
};

const FAQ_ITEMS = [
  {
    q: 'Защо туристическият бизнес се нуждае от професионален сайт, а не само от социални мрежи?',
    a: 'Социалните мрежи са важни, но те не се индексират от Google по същия начин като уебсайт. Когато турист търси „photographer Veliko Tarnovo", Google показва уебсайтове, не Instagram профили. Сайтът е единственото място, където вие контролирате цялото съдържание, структурата и SEO оптимизацията. Освен това, сайтът позволява Schema.org маркиране, което директно влияе на ранкинга и rich snippets в Google.',
  },
  {
    q: 'Какви технически елементи са задължителни за сайт на туристически бизнес?',
    a: 'Задължителните технически елементи включват: 1) Schema.org маркиране за LocalBusiness с геокоординати, 2) responsive дизайн за мобилни устройства (над 70% от туристическите търсения са от телефон), 3) бързо зареждане (Core Web Vitals), 4) HTTPS сертификат, 5) оптимизирани мета тагове на всички езици, 6) канонични URL-ове за избягване на duplicate content и 7) XML sitemap за правилно индексиране.',
  },
  {
    q: 'Как двуезичният сайт помага на туристическия бизнес в България?',
    a: 'България привлича туристи от цял свят — англоговорящи, немски, румънски, гръцки и други. Двуезичният сайт (български + английски) покрива над 80% от потенциалните туристически търсения. Google третира всяка езикова версия като отделен сет от страници, което удвоява шансовете за ранк. Важно е съдържанието да е оригинално за всеки език, а не машинен превод — Google наказва автоматично преведеното съдържание.',
  },
];

const RELATED = [
  { title: 'Как Photo Tarnovo стана #1 в Google за street portrait', to: '/blog/photo-tarnovo-street-portrait-nomer-edno', cat: 'Казус' },
  { title: 'Маркетинг за фотографи: уроци от Photo Tarnovo', to: '/blog/marketing-za-fotografi-tarnovo', cat: 'Статия' },
  { title: 'SEO оптимизация Велико Търново 2026', to: '/blog/seo-optimizaciya-tarnovo-2026', cat: 'Ръководство' },
  { title: 'Изработка на сайт Велико Търново — цени и какво да очаквате', to: '/blog/izrabotka-na-sait-tarnovo', cat: 'Статия' },
];

export default function TuristicheskiBiznesOptimiziranSaitPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    document.title = 'Оптимизиран сайт за туристически бизнес — примерът Photo Tarnovo | ТАВОРА ЕООД';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', 'Как оптимизираният сайт на Photo Tarnovo превърна street portrait фотографията на Царевец в #1 резултат в Google. Техническо SEO, Schema.org и двуезично съдържание.');
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://imashnujnoto.com/blog/turisticheski-biznes-optimiziran-sait-tarnovo');

    const id = 'schema-turisticheski-sait';
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) { el = document.createElement('script'); el.id = id; el.type = 'application/ld+json'; document.head.appendChild(el); }
    el.textContent = JSON.stringify(ARTICLE_SCHEMA);

    return () => { const e = document.getElementById(id); if (e) e.remove(); };
  }, []);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <SharedNav />

      {/* HERO */}
      <section className="w-full bg-[#F9F9F7] border-b border-[#1C1C1E]/6 py-8 md:py-20 px-4 md:px-16">
        <div className="max-w-4xl mx-auto">
          <nav aria-label="breadcrumb" className="flex items-center gap-2 text-[11px] text-[#1C1C1E]/65 mb-6">
            <Link to="/" className="hover:text-[#0A2540] transition-colors">Начало</Link>
            <i className="ri-arrow-right-s-line text-xs" />
            <Link to="/blog" className="hover:text-[#0A2540] transition-colors">Блог</Link>
            <i className="ri-arrow-right-s-line text-xs" />
            <span className="text-[#1C1C1E]/65">Оптимизиран сайт — туристически бизнес</span>
          </nav>

          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className="text-[10px] px-2.5 py-1 rounded-full font-medium bg-teal-50 text-teal-700">Туристически бизнес</span>
            <span className="text-[10px] px-2.5 py-1 rounded-full font-medium bg-sky-50 text-sky-700">Уеб дизайн</span>
            <span className="text-[10px] text-[#1C1C1E]/70">9 мин. четене · 20 Юни 2026</span>
          </div>

          <h1
            className="text-3xl md:text-5xl font-light text-[#1C1C1E] leading-tight mb-5"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Защо локалният туристически бизнес
            <br />
            <em className="text-[#1C1C1E]/60">се нуждае от оптимизиран сайт</em>
          </h1>

          <p className="text-sm md:text-base text-[#1C1C1E]/65 max-w-2xl leading-relaxed mb-6">
            Примерът на{' '}
            <a href="https://phototarnovo.com/" target="_blank" rel="noopener noreferrer" className="text-[#0A2540] hover:underline"><strong>Photo Tarnovo</strong></a> показва как един добре оптимизиран сайт превръща street portrait фотографията на Царевец в #1 резултат в Google — и носи клиенти от цял свят без рекламен бюджет.
          </p>

          <div className="flex items-center gap-3 text-xs text-[#1C1C1E]/65">
            <span>Владимир Атанасов · ТАВОРА ЕООД</span>
            <span>·</span>
            <span>20 Юни 2026</span>
          </div>
        </div>
      </section>

      {/* HERO IMAGE */}
      <div className="w-full h-[280px] md:h-[420px] overflow-hidden">
        <img
          src="https://readdy.ai/api/search-image?query=modern%20laptop%20showing%20beautiful%20photography%20portfolio%20website%20interface%20on%20screen%20Tsarevets%20Fortress%20Veliko%20Tarnovo%20background%20warm%20desk%20setup%20clean%20minimal%20workspace%20professional%20web%20design%20tourism%20business%20Bulgaria&width=1400&height=420&seq=blog-turisticheski-sait-hero-img&orientation=landscape"
          alt="Оптимизиран сайт за туристически бизнес — примерът на Photo Tarnovo, Царевец, Велико Търново"
          className="w-full h-full object-cover object-top"
          loading="eager"
        />
      </div>

      <main className="max-w-3xl mx-auto px-4 md:px-8 py-12 md:py-16">

        {/* INTRO */}
        <p className="text-base text-[#1C1C1E]/60 leading-relaxed mb-12 border-l-2 border-[#0A2540]/20 pl-4">
          Туристическият бизнес има една уникална характеристика: клиентите не са от града, не познават локалните брандове и разчитат изцяло на Google, за да намерят услуги. Ако сайтът ви не е оптимизиран, вие сте невидими за тях. Ето как{' '}
          <a href="https://phototarnovo.com/" target="_blank" rel="noopener noreferrer" className="text-[#0A2540] hover:underline">Photo Tarnovo</a> реши този проблем.
        </p>

        {/* SECTION 1: Защо сайт, а не само социални мрежи */}
        <section className="mb-14">
          <h2
            className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-5"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Сайтът срещу социалните мрежи — защо туристическият бизнес не може без собствен сайт
          </h2>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
            Много малки туристически бизнеси разчитат единствено на Instagram и Facebook. Това е разбираемо — социалните мрежи са безплатни и лесни за ползване. Но има фундаментален проблем: когато турист от Германия потърси „photographer Tsarevets" в Google, той не вижда Instagram профили. Google показва уебсайтове. И ако вашият бизнес няма сайт — или има сайт, който не е оптимизиран — вие не съществувате за този турист.
          </p>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
            Сайтът на{' '}
            <a href="https://phototarnovo.com/" target="_blank" rel="noopener noreferrer" className="text-[#0A2540] hover:underline">Photo Tarnovo</a> е пример за това как трябва да изглежда дигиталното присъствие на туристически бизнес: чист дизайн, ясна структура, цялата необходима информация на първия екран и — най-важното — техническа SEO оптимизация, която кара Google да показва сайта на #1 позиция.
          </p>

          <div className="p-5 rounded-2xl bg-[#F9F9F7] border border-[#1C1C1E]/6 mb-4">
            <div className="text-xs font-medium text-[#1C1C1E]/65 mb-3 tracking-wide uppercase">Разлика между сайт и социални мрежи за туристически бизнес:</div>
            <div className="space-y-3">
              {[
                { label: 'Google видимост', desc: 'Сайтът се индексира от Google и може да ранква за стотици ключови думи. Instagram постът изчезва от търсенето за дни.' },
                { label: 'Контрол върху съдържанието', desc: 'Вие решавате какво, къде и как се показва. Няма алгоритъм, който да скрие публикацията ви.' },
                { label: 'Schema.org маркиране', desc: 'Само уебсайт може да използва structured data за rich snippets, Local Pack и Knowledge Graph.' },
                { label: 'Многоезичност', desc: 'Сайтът може да обслужва туристи на техния език с правилно SEO за всеки език поотделно.' },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <div className="w-5 h-5 flex items-center justify-center rounded-full border border-[#1C1C1E]/20 shrink-0 mt-0.5">
                    <i className="ri-check-line text-[10px] text-[#1C1C1E]/50" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-[#1C1C1E]">{item.label}</span>
                    <span className="text-sm text-[#1C1C1E]/65"> — {item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 2: Техническо SEO */}
        <section className="mb-14">
          <h2
            className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-5"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Техническото SEO — невидимият фундамент на успешния сайт
          </h2>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
            Техническото SEO е като фундамента на сграда — не се вижда, но без него всичко се срутва. За сайта на Photo Tarnovo приложихме пълен пакет от технически оптимизации, които директно допринесоха за #1 ранкинга.
          </p>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
            Първо и най-важно: Schema.org маркиране. Добавихме structured data за LocalBusiness и Photographer — с точни геокоординати на Царевец (43.0811° N, 25.6358° E), работно време (10:00-залез), име на бизнеса, описание, снимки и връзки към ревюта. Това позволява на Google да показва rich snippets в резултатите — звезди за рейтинг, локация на картата, работно време.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {[
              { icon: 'ri-code-box-line', title: 'Schema.org', desc: 'LocalBusiness + Photographer маркиране с геокоординати. Google разпознава бизнеса и го показва в Knowledge Graph.', color: '#2F9E44' },
              { icon: 'ri-smartphone-line', title: 'Mobile-first', desc: 'Над 70% от туристическите търсения са от мобилни устройства. Сайтът е напълно responsive с бързо зареждане.', color: '#E67700' },
              { icon: 'ri-speed-line', title: 'Core Web Vitals', desc: 'Оптимизирани изображения, lazy loading, минимален JavaScript. Сайтът зарежда за под 2 секунди.', color: '#7048E8' },
              { icon: 'ri-links-line', title: 'Вътрешно свързване', desc: 'Блог статиите линкват към основните страници и обратно. Google вижда пълната структура на сайта.', color: '#C2255C' },
            ].map((item) => (
              <div key={item.title} className="p-5 rounded-2xl border border-[#1C1C1E]/8 bg-white">
                <div className="w-9 h-9 flex items-center justify-center rounded-xl mb-3" style={{ backgroundColor: `${item.color}12` }}>
                  <i className={`${item.icon} text-base`} style={{ color: item.color }} />
                </div>
                <h4 className="text-sm font-medium text-[#1C1C1E] mb-1.5">{item.title}</h4>
                <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3: Двуезично съдържание */}
        <section className="mb-14">
          <h2
            className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-5"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Двуезичното съдържание — достигане до международни туристи
          </h2>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
            Една от най-големите грешки на българските туристически бизнеси е, че имат сайт само на български. Това автоматично изключва 90% от потенциалните клиенти — международните туристи, които търсят услуги на английски.
          </p>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
            Photo Tarnovo направи обратното: сайтът е предимно на английски, с българска версия за локални клиенти. Блогът съдържа статии на английски като{' '}
            <a href="https://phototarnovo.com/blog/best-portrait-locations-veliko-tarnovo" target="_blank" rel="noopener noreferrer" className="text-[#0A2540] hover:underline">Best Portrait Locations Veliko Tarnovo</a> и{' '}
            <a href="https://phototarnovo.com/blog/street-vs-studio-portrait" target="_blank" rel="noopener noreferrer" className="text-[#0A2540] hover:underline">Street vs Studio Portrait</a>, които ранкват за английски търсения и привличат международен трафик.
          </p>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
            Техническият съвет тук е прост: не използвайте автоматичен превод. Google наказва машинно преведеното съдържание. Вместо това, създайте оригинално съдържание за всеки език — с различни ключови думи, които отговарят на начина, по който носителите на този език търсят. За български: „фотограф Царевец", „портретна фотография Велико Търново". За английски: „street portrait Veliko Tarnovo", „Tsarevets photographer".
          </p>

          <div className="p-5 rounded-2xl bg-[#F9F9F7] border border-[#1C1C1E]/6">
            <div className="text-xs font-medium text-[#1C1C1E]/65 mb-3 tracking-wide uppercase">Двуезична SEO стратегия — практически стъпки:</div>
            <div className="space-y-2">
              {[
                'Определете приоритетния език според целевата аудитория. За туристически бизнес в България това обикновено е английски.',
                'Създайте отделни URL структури за всеки език с hreflang тагове, за да избегнете duplicate content.',
                'Използвайте различни ключови думи за всеки език — директният превод рядко съвпада с реалното потребителско търсене.',
                'Добавете Schema.org маркиране и за двата езика с правилния inLanguage атрибут.',
              ].map((item, i) => (
                <div key={item} className="flex items-start gap-2.5">
                  <span className="text-[10px] font-medium text-[#1C1C1E]/40 w-4 shrink-0">{i + 1}.</span>
                  <span className="text-xs text-[#1C1C1E]/65 leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 4: Google Business Profile + сайт */}
        <section className="mb-14">
          <h2
            className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-5"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Синергията между Google Business Profile и сайта
          </h2>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
            Google Business Profile и уебсайтът не са отделни инструменти — те са две страни на една и съща SEO стратегия. GBP показва бизнеса в Google Maps и Local Pack; сайтът показва бизнеса в органичните резултати. Когато работят заедно, ефектът е мултиплициран.
          </p>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
            За Photo Tarnovo, връзката между GBP и сайта е безпроблемна: GBP профилът линква към{' '}
            <a href="https://phototarnovo.com/" target="_blank" rel="noopener noreferrer" className="text-[#0A2540] hover:underline">phototarnovo.com</a>, сайтът има Schema.org маркиране със същите геокоординати като GBP, а ревютата в GBP (4.9 от 37+) се отразяват в rich snippets на сайта. Туристът вижда звездите и в Maps, и в SERP — двойно доверие.
          </p>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
            Ключовото правило тук: никога не оставяйте GBP профила празен. Дори и да имате перфектен сайт, празният GBP профил изпраща сигнал към Google, че бизнесът не е активен. Обратното също важи: перфектен GBP профил без сайт ограничава потенциала ви само до Local Pack — губите органичния трафик.
          </p>

          <div className="p-6 rounded-2xl bg-[#F9F9F7] border border-[#1C1C1E]/6">
            <div className="text-xs font-medium text-[#1C1C1E]/65 mb-4 tracking-wide uppercase">Какво включва синергията GBP + сайт за Photo Tarnovo:</div>
            <div className="space-y-3">
              {[
                { step: '01', label: 'Еднакви NAP данни', desc: 'Name, Address, Phone — идентични в GBP и Schema.org на сайта. Без разминавания, които объркват Google.' },
                { step: '02', label: 'Споделени ревюта', desc: 'GBP ревютата се показват като rich snippets в SERP чрез AggregateRating Schema.org markup на сайта.' },
                { step: '03', label: 'Кръстосани линкове', desc: 'GBP линква към сайта. Сайтът има бутони за „Leave a Google Review" и „Find us on Google Maps".' },
                { step: '04', label: 'Еднакво работно време', desc: 'OpeningHoursSpecification schema на сайта трябва да съвпада с GBP работното време — „10:00 AM до sunset, всеки ден".' },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-3">
                  <span className="text-xs font-medium text-[#1C1C1E]/40 w-6 shrink-0 mt-0.5">{item.step}</span>
                  <div>
                    <span className="text-sm font-medium text-[#1C1C1E]">{item.label}</span>
                    <p className="text-xs text-[#1C1C1E]/65 leading-relaxed mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 5: Поддръжка */}
        <section className="mb-14">
          <h2
            className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-5"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Сайтът не е еднократен проект — той изисква поддръжка
          </h2>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
            Последният и може би най-важен урок: сайтът не е „направи и забрави". Google следи активността. Сайт, който не е обновяван от месеци, започва да пада в ранкинга — колкото и добре да е бил оптимизиран първоначално.
          </p>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
            За Photo Tarnovo, поддръжката включва: редовно публикуване на блог статии (поне веднъж месечно), обновяване на галерията с нови портрети, актуализиране на цени и пакети, отговаряне на всички Google ревюта и проверка на техническото състояние на сайта. Това са малки, но последователни действия, които поддържат #1 позицията.
          </p>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
            Ако сте собственик на туристически бизнес в Търново и искате да постигнете същите резултати като Photo Tarnovo —{' '}
            <a href="https://phototarnovo.com/#how-it-works" target="_blank" rel="noopener noreferrer" className="text-[#0A2540] hover:underline">вижте как работи процесът</a> и си представете как вашият бизнес може да приложи същите принципи.
          </p>
        </section>

        {/* SECTION: За Photo Tarnovo */}
        <section className="mb-14 p-6 rounded-2xl bg-[#F9F9F7] border border-[#1C1C1E]/6">
          <h2
            className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-5"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            За Photo Tarnovo
          </h2>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
            Photo Tarnovo е street portrait фотограф на крепостта Царевец във Велико Търново — уникален туристически бизнес, който предлага моментални портрети на туристи без нужда от предварително записване. С над 2000 портрета, направени за 5+ години, и рейтинг 4.9 от 37+ ревюта, Photo Tarnovo е доказателство, че добре оптимизираният сайт е най-мощният маркетингов инструмент за локален туристически бизнес.
          </p>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
            Разгледайте{' '}
            <a href="https://phototarnovo.com/packages" target="_blank" rel="noopener noreferrer" className="text-[#0A2540] hover:underline">пакетите и цените</a>,{' '}
            <a href="https://phototarnovo.com/#gallery" target="_blank" rel="noopener noreferrer" className="text-[#0A2540] hover:underline">галерията с портрети от Царевец</a> и{' '}
            <a href="https://phototarnovo.com/blog/best-portrait-locations-veliko-tarnovo" target="_blank" rel="noopener noreferrer" className="text-[#0A2540] hover:underline">блога с най-добрите портретни локации</a>.
          </p>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
            Свържете се директно през{' '}
            <a href="https://phototarnovo.com/" target="_blank" rel="noopener noreferrer" className="text-[#0A2540] hover:underline">официалния сайт на Photo Tarnovo</a>{' '}
            или чрез WhatsApp — линкът е на видно място на всяка страница.
          </p>
        </section>

        {/* SECTION: Полезни ресурси */}
        <section className="mb-14 pt-10 border-t border-[#1C1C1E]/6">
          <div className="text-xs text-[#1C1C1E]/60 mb-5">Полезни ресурси</div>
          <h2
            className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-6"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Разгледайте Photo Tarnovo
          </h2>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: 'Photo Tarnovo — начална страница', href: 'https://phototarnovo.com/' },
              { label: 'How it Works — вижте процеса', href: 'https://phototarnovo.com/#how-it-works' },
              { label: 'Packages — цени и пакети', href: 'https://phototarnovo.com/packages' },
              { label: 'Gallery — портрети от Царевец', href: 'https://phototarnovo.com/#gallery' },
              { label: 'Reviews — 4.9 от 37+ туристи', href: 'https://phototarnovo.com/#reviews' },
              { label: 'FAQ — въпроси и отговори', href: 'https://phototarnovo.com/#faq' },
              { label: 'Best Portrait Locations — блог статия', href: 'https://phototarnovo.com/blog/best-portrait-locations-veliko-tarnovo' },
              { label: 'Street vs Studio Portrait — блог статия', href: 'https://phototarnovo.com/blog/street-vs-studio-portrait' },
            ].map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 p-3 rounded-xl border border-[#1C1C1E]/8 hover:border-[#0A2540]/20 hover:bg-[#F9F9F7] transition-all cursor-pointer group"
                >
                  <i className="ri-external-link-line text-xs text-[#1C1C1E]/30 group-hover:text-[#0A2540] transition-colors" />
                  <span className="text-xs text-[#1C1C1E] group-hover:text-[#0A2540] transition-colors leading-snug">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* FAQ */}
        <section className="mb-14 pt-10 border-t border-[#1C1C1E]/6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-[1px] bg-[#1C1C1E]/20 shrink-0" />
            <span className="text-xs text-[#1C1C1E]/60">Често задавани въпроси</span>
          </div>
          <h2
            className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-8"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Въпроси за оптимизация
            <br />
            <em className="text-[#1C1C1E]/65">на туристически сайт.</em>
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

        {/* RELATED ARTICLES */}
        <section className="mb-14 pt-10 border-t border-[#1C1C1E]/6">
          <div className="text-xs text-[#1C1C1E]/60 mb-5">Свързани статии и услуги</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {RELATED.map((r) => (
              <Link
                key={r.to}
                to={r.to}
                className="group flex items-center justify-between gap-3 p-4 rounded-xl border border-[#1C1C1E]/8 hover:border-[#0A2540]/20 transition-all cursor-pointer"
              >
                <div>
                  <div className="text-[10px] text-[#1C1C1E]/70 mb-1">{r.cat}</div>
                  <div className="text-xs font-medium text-[#1C1C1E] group-hover:text-[#0A2540] transition-colors leading-snug">{r.title}</div>
                </div>
                <i className="ri-arrow-right-line text-[#1C1C1E]/25 text-sm shrink-0 group-hover:translate-x-1 transition-transform" />
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="p-7 md:p-10 rounded-2xl bg-[#0F1F35] text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="text-xs text-white/75 tracking-widest uppercase mb-2">Готови за #1 в Google?</div>
              <div
                className="text-2xl md:text-3xl font-light leading-tight mb-2"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Оптимизиран сайт за вашия
                <br />
                <span className="italic text-white/60">туристически бизнес в Търново</span>
              </div>
              <p className="text-sm text-white/75 max-w-md leading-relaxed">
                От изработка до SEO оптимизация — ще направим сайт, който работи за вас 24/7 и носи клиенти от цял свят.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link
                to="/kontakt"
                className="px-7 py-3.5 bg-white text-[#0A2540] text-sm rounded-full hover:bg-white/90 transition-all cursor-pointer whitespace-nowrap text-center font-medium"
              >
                Безплатна консултация →
              </Link>
              <Link
                to="/uslugi/izrabotka-na-sait"
                className="px-7 py-3.5 border border-white/20 text-white/70 text-sm rounded-full hover:border-white/40 hover:text-white transition-all cursor-pointer whitespace-nowrap text-center"
              >
                Изработка на сайт
              </Link>
            </div>
          </div>
        </div>
      </main>

      <SharedFooter />
    </div>
  );
}