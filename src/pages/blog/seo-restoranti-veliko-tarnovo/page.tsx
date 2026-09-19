import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SharedNav from '@/components/feature/SharedNav';
import SharedFooter from '@/components/feature/SharedFooter';

const SEO_RESTORANTI_SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      '@id': 'https://imashnujnoto.com/blog/seo-restoranti-veliko-tarnovo#article',
      name: 'SEO за ресторанти Велико Търново: Пълно ръководство за #1 в Google',
      headline: 'SEO за ресторанти Велико Търново: Пълно ръководство за #1 в Google',
      description: 'Как ресторанти в Велико Търново да се класират на #1 в Google. Локално SEO, Google Business Profile, уеб сайт за ресторант и SEO стратегия с реални примери от Търново.',
      author: { '@type': 'Person', name: 'Владимир Атанасов', url: 'https://imashnujnoto.com/ekip' },
      publisher: { '@type': 'Organization', name: 'ТАВОРА ЕООД', url: 'https://imashnujnoto.com', telephone: '+359885189724', email: 'tavoraagency@gmail.com', logo: { '@type': 'ImageObject', url: 'https://storage.readdy-site.link/project_files/3f265d07-5825-4e88-a58a-44deb287b858/777dce2a-8731-4235-b0be-7837a840c3c9_TAVORA-MARKETING-AGENCY-VELIKO-TARNOVO.png?v=f6135e7442d441feef102ad2f8425862' } },
      datePublished: '2026-05-05',
      dateModified: new Date().toISOString().split('T')[0],
      url: 'https://imashnujnoto.com/blog/seo-restoranti-veliko-tarnovo',
      mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://imashnujnoto.com/blog/seo-restoranti-veliko-tarnovo' },
      inLanguage: 'bg',
      image: 'https://readdy.ai/api/search-image?query=restaurant%20SEO%20marketing%20strategy%20local%20search%20Google%20Business%20Profile%20digital%20optimization%20table%20settings%20Bulgarian%20cuisine%20elegant%20warm%20lighting%20clean%20minimal&width=1200&height=630&seq=blog-seo-restoranti-vt-hero&orientation=landscape',
      articleSection: 'SEO',
      keywords: 'SEO ресторанти Велико Търново, ресторант SEO, локално SEO ресторант, Google Business Profile ресторант, ресторантьорски SEO, храна Търново SEO',
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Начало', item: 'https://imashnujnoto.com/' },
        { '@type': 'ListItem', position: 2, name: 'Блог', item: 'https://imashnujnoto.com/blog' },
        { '@type': 'ListItem', position: 3, name: 'SEO за ресторанти Велико Търново', item: 'https://imashnujnoto.com/blog/seo-restoranti-veliko-tarnovo' },
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
  { id: 'zasto-seo', label: 'Защо SEO е задължително за ресторанти' },
  { id: 'google-business', label: 'Google Business Profile за ресторанти' },
  { id: 'sait-restorant', label: 'Уеб сайт за ресторант с вградено SEO' },
  { id: 'kluchovi-dumi', label: 'Ключови думи за ресторанти в Търново' },
  { id: 'recenzii', label: 'Онлайн рецензии и рейтинг' },
  { id: 'menu', label: 'Онлайн меню и Schema.org' },
  { id: 'lokalno-seo', label: 'Локално SEO стратегия' },
  { id: 'sotsialni', label: 'Социални медии + SEO' },
  { id: 'rezultati', label: 'Реални резултати от Търново' },
];

const RESULT_CASES = [
  {
    name: 'K-Food Велико Търново',
    result: '#1 в Google за "корейска храна велико търново"',
    detail: 'SEO + Google Business Profile + уеб сайт. Сега са и в ChatGPT отговорите.',
    link: 'https://k-foodvelikotarnovo.com/',
  },
  {
    name: 'Ресторант в Стария град',
    result: '+180% органичен трафик за 3 месеца',
    detail: 'Локално SEO + оптимизирано меню + Schema.org за ресторант.',
    link: null,
  },
  {
    name: 'Семеен ресторант Арбанаси',
    result: '#3 в Google Maps за "ресторант Арбанаси"',
    detail: 'Google Business Profile оптимизация + 45 рецензии за 2 месеца.',
    link: null,
  },
];

const KEYWORDS_LIST = [
  'ресторант велико търново',
  'ресторанти в търново',
  'храна велико търново',
  'българска кухня търново',
  'ресторант стария град',
  'ресторант арбанаси',
  'закуска велико търново',
  'вечеря велико търново',
  'био ресторант търново',
  'традиционна кухня търново',
  'ресторант с гледка търново',
  'къде да ям в търново',
];

export default function SeoRestorantiTarnovoPage() {
  useEffect(() => {
    const id = 'schema-seo-restoranti';
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement('script');
      el.id = id;
      el.type = 'application/ld+json';
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(SEO_RESTORANTI_SCHEMA);

    document.title = 'SEO за ресторанти Велико Търново: Пълно ръководство за #1 в Google | ТАВОРА ЕООД';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Как ресторанти в Велико Търново да се класират на #1 в Google. Локално SEO, Google Business Profile, уеб сайт за ресторант и SEO стратегия с реални примери от Търново.');
    }
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://imashnujnoto.com/blog/seo-restoranti-veliko-tarnovo');

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
          <span className="text-[#1C1C1E]/65">SEO ресторанти Търново</span>
        </nav>

        {/* Hero */}
        <section className="mb-10">
          <div className="w-full h-[280px] md:h-[400px] rounded-2xl overflow-hidden mb-8">
            <img
              src="https://readdy.ai/api/search-image?query=elegant%20Bulgarian%20restaurant%20interior%20warm%20lighting%20traditional%20cuisine%20table%20setting%20wooden%20furniture%20cozy%20atmosphere%20Veliko%20Tarnovo%20old%20town%20ambiance%20professional%20photography&width=1200&height=630&seq=blog-seo-restoranti-vt-hero&orientation=landscape"
              alt="SEO за ресторанти в Велико Търново — локално SEO стратегия"
              className="w-full h-full object-cover object-top"
              loading="lazy" decoding="async"
            />
          </div>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-medium">SEO · Локално SEO</span>
            <span className="text-[10px] text-[#1C1C1E]/70">5 Май 2026</span>
            <span className="text-[10px] text-[#1C1C1E]/70">·</span>
            <span className="text-[10px] text-[#1C1C1E]/70">12 мин. четене</span>
          </div>

          <h1
            className="text-3xl md:text-5xl font-light text-[#1C1C1E] leading-tight mb-5"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            SEO за ресторанти
            <br />
            <span className="italic text-[#0A2540]">Велико Търново.</span>
          </h1>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed max-w-2xl mb-6">
            Как ресторанти, заведения и хотели в <strong className="text-[#1C1C1E]">Велико Търново</strong> да се класират на #1 в Google — без да харчат за реклами. Пълно ръководство с реални примери, ключови думи и SEO тактики.
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

          {/* Section 1 */}
          <section id="zasto-seo" className="mb-12">
            <h2
              className="text-2xl md:text-3xl font-light text-[#1C1C1E] leading-tight mb-5"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Защо SEO е <span className="italic text-[#0A2540]">задължително</span> за ресторанти в Търново.
            </h2>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              Представете си: турист пристига в <strong>Велико Търново</strong>, отваря телефона и пише <em>"ресторант велико търново"</em> или <em>"къде да ям в търново"</em>. Ако вашият ресторант не е на първа страница — този клиент никога няма да го открие.
            </p>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              76% от хората търсят <strong>локално</strong> — "ресторант велико търново", "храна стария град", "ресторант арбанаси". Тези търсения имат <strong>високо намерение за покупка</strong> — хората са гладни и искат да решат проблема сега.
            </p>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
              Рекламата във Facebook струва 5–15 лв. на клик. <strong>SEO е безплатен</strong> — след като сте на #1, клиентите идват сами. За ресторанти в Търново, където сезонността е реалност, SEO дава стабилен поток от клиенти целогодишно.
            </p>
          </section>

          {/* Section 2 */}
          <section id="google-business" className="mb-12">
            <h2
              className="text-2xl md:text-3xl font-light text-[#1C1C1E] leading-tight mb-5"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Google Business Profile — <span className="italic text-[#0A2540]">вашият дигитален витринен прозорец.</span>
            </h2>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              Google Business Profile (GBP) е <strong>най-важният SEO елемент</strong> за ресторант. Той определя дали ще се появите в Google Maps, Local Pack и мобилните търсения.
            </p>

            <div className="p-5 rounded-xl border border-[#1C1C1E]/8 bg-[#FAFAFA] mb-5">
              <div className="text-[10px] text-[#1C1C1E]/65 tracking-widest uppercase mb-3">Чеклист за GBP оптимизация</div>
              <ul className="space-y-2">
                {[
                  'Заявете и верифицирайте профила си в Google Business',
                  'Изберете точна категория: "Ресторант" или "Български ресторант"',
                  'Добавете точен адрес с пощенски код (5000 за Търново)',
                  'Качете 15+ професионални снимки на храна, интериор и екстериор',
                  'Публикувайте постове поне 1 път седмично — меню, събития, оферти',
                  'Активирайте бутона "Резервация" или "Поръчка онлайн"',
                  'Добавете работно време, което се обновява за празници',
                  'Включете атрибути: "Wi-Fi", "Доставка", "Външна градина"',
                  'Отговаряйте на ВСИЧКИ рецензии — положителни и отрицателни',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#1C1C1E]/65">
                    <i className="ri-check-line text-[#1B4332] text-xs mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
              <strong>Pro tip:</strong> Публикуването на постове в GBP е силен ранкинг сигнал. Публикувайте снимка на ново ястие с текст: <em>"Новото ни ястие — пиле по търновски, налично от днес в ресторант [Име] велико търново"</em>. Това добавя ключови думи към вашия профил.
            </p>
          </section>

          {/* Section 3 */}
          <section id="sait-restorant" className="mb-12">
            <h2
              className="text-2xl md:text-3xl font-light text-[#1C1C1E] leading-tight mb-5"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Уеб сайт за ресторант <span className="italic text-[#0A2540]">с вградено SEO от ден 1.</span>
            </h2>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              Много ресторанти в Търново разчитат само на Facebook страница. Това е <strong>грешка</strong> — Google не индексира добре Facebook. Вашият уеб сайт е актив, който контролирате изцяло.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <div className="p-5 rounded-xl border border-[#1C1C1E]/8 bg-white">
                <div className="text-[10px] text-[#1C1C1E]/65 tracking-widest uppercase mb-3">Задължителни страници</div>
                <ul className="space-y-1.5 text-sm text-[#1C1C1E]/65">
                  <li>· Начало с H1: "Ресторант [Име] — Велико Търново"</li>
                  <li>· Меню с цени и снимки на ястията</li>
                  <li>· За нас — история, екип, философия</li>
                  <li>· Галерия с оптимизирани alt текстове</li>
                  <li>· Резервация / Контакт с форма</li>
                  <li>· Блог — рецепти, събития, новини</li>
                </ul>
              </div>
              <div className="p-5 rounded-xl border border-[#1C1C1E]/8 bg-white">
                <div className="text-[10px] text-[#1C1C1E]/65 tracking-widest uppercase mb-3">Технически SEO</div>
                <ul className="space-y-1.5 text-sm text-[#1C1C1E]/65">
                  <li>· Бърз сайт (Core Web Vitals)</li>
                  <li>· Мобилна версия — 70% търсят от телефон</li>
                  <li>· Schema.org за ресторант (LocalBusiness)</li>
                  <li>· HTTPS сертификат</li>
                  <li>· Sitemap.xml за Google</li>
                  <li>· Alt текст на всяка снимка</li>
                </ul>
              </div>
            </div>

            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
              <strong>Важно:</strong> Всяка снимка на ястие трябва да има alt текст: <code className="text-xs bg-[#F9F9F7] px-1.5 py-0.5 rounded text-[#0A2540]">"традиционна българска мусака ресторант велико търново"</code>. Google чете тези текстове и ги използва за image search.
            </p>
          </section>

          {/* Section 4 */}
          <section id="kluchovi-dumi" className="mb-12">
            <h2
              className="text-2xl md:text-3xl font-light text-[#1C1C1E] leading-tight mb-5"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Ключови думи за ресторанти <span className="italic text-[#0A2540]">в Търново — ниши с ниска конкуренция.</span>
            </h2>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              Големите ключови думи като <em>"ресторант велико търново"</em> са конкурентни. Но има <strong>десетки нишови търсения</strong> с ниска конкуренция и високо намерение:
            </p>

            <div className="p-5 rounded-xl border border-[#1C1C1E]/8 bg-[#FAFAFA] mb-5">
              <div className="text-[10px] text-[#1C1C1E]/65 tracking-widest uppercase mb-3">Нишови ключови думи за ресторанти в Търново</div>
              <div className="flex flex-wrap gap-2">
                {KEYWORDS_LIST.map((kw) => (
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
              <strong>Стратегия:</strong> Създайте отделна страница за всяка ниша. Например страница <em>"Традиционна българска кухня в Стария град Търново"</em> ще се класира по-добре за <em>"българска кухня търново"</em>, отколкото обща страница "Меню".
            </p>
          </section>

          {/* Section 5 */}
          <section id="recenzii" className="mb-12">
            <h2
              className="text-2xl md:text-3xl font-light text-[#1C1C1E] leading-tight mb-5"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Онлайн рецензии — <span className="italic text-[#0A2540]">социалният доказателствен фактор, който Google обича.</span>
            </h2>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              Google използва рецензии като <strong>ранкинг фактор</strong>. Ресторант с 4.8/5 от 120 рецензии се класира по-високо от такъв с 3.5/5 от 20 рецензии.
            </p>
            <div className="p-5 rounded-xl border border-[#1C1C1E]/8 bg-[#FAFAFA] mb-4">
              <div className="text-[10px] text-[#1C1C1E]/65 tracking-widest uppercase mb-3">Как да получавате повече рецензии</div>
              <ul className="space-y-2 text-sm text-[#1C1C1E]/65">
                <li>· Поставете QR код на масата, който води директно към Google рецензии</li>
                <li>· Попитайте доволни клиенти лично: "Ще ни помогнете с рецензия в Google?"</li>
                <li>· Отговаряйте на всички рецензии — Google вижда активност</li>
                <li>· Отговаряйте на негативните с професионализъм — това показва грижа</li>
                <li>· Включете ключови думи в отговорите: "Благодарим, че посетихте ресторант [Име] във Велико Търново"</li>
              </ul>
            </div>
          </section>

          {/* Section 6 */}
          <section id="menu" className="mb-12">
            <h2
              className="text-2xl md:text-3xl font-light text-[#1C1C1E] leading-tight mb-5"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Онлайн меню с <span className="italic text-[#0A2540]">Schema.org — как Google разбира храната ви.</span>
            </h2>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              Schema.org е код, който казва на Google: <em>"Това е ресторант, тези са ястията, тези са цените, това е адресът"</em>. Без Schema.org, Google "вижда" само текст. Със Schema.org — разбира <strong>значението</strong>.
            </p>
            <div className="p-5 rounded-xl border border-[#1C1C1E]/8 bg-[#FAFAFA] mb-4">
              <div className="text-[10px] text-[#1C1C1E]/65 tracking-widest uppercase mb-3">Какво включва Restaurant Schema</div>
              <ul className="space-y-2 text-sm text-[#1C1C1E]/65">
                <li>· <code className="text-xs bg-white px-1.5 py-0.5 rounded text-[#0A2540]">@type: Restaurant</code> — указва, че сте ресторант</li>
                <li>· <code className="text-xs bg-white px-1.5 py-0.5 rounded text-[#0A2540]">name</code> — името на ресторанта + "Велико Търново"</li>
                <li>· <code className="text-xs bg-white px-1.5 py-0.5 rounded text-[#0A2540]">servesCuisine</code> — "Българска", "Средиземноморска", "Италианска"</li>
                <li>· <code className="text-xs bg-white px-1.5 py-0.5 rounded text-[#0A2540]">priceRange</code> — "€€" за среден клас, "€€€" за луксозен</li>
                <li>· <code className="text-xs bg-white px-1.5 py-0.5 rounded text-[#0A2540]">menu</code> — линк към онлайн меню</li>
                <li>· <code className="text-xs bg-white px-1.5 py-0.5 rounded text-[#0A2540]">acceptsReservations</code> — true/false</li>
                <li>· <code className="text-xs bg-white px-1.5 py-0.5 rounded text-[#0A2540]">aggregateRating</code> — среден рейтинг и брой рецензии</li>
              </ul>
            </div>
          </section>

          {/* Section 7 */}
          <section id="lokalno-seo" className="mb-12">
            <h2
              className="text-2xl md:text-3xl font-light text-[#1C1C1E] leading-tight mb-5"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Локално SEO стратегия <span className="italic text-[#0A2540]">за ресторанти в Търново.</span>
            </h2>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              Локалното SEO е различно от националното. За ресторант в <strong>Велико Търново</strong> трябва да оптимизирате за <em>местни</em> търсения, <em>местни</em> директории и <em>местни</em> връзки.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              {[
                { title: 'NAP консистентност', text: 'Името, адресът и телефонът трябва да са ЕДНАКВИ навсякъде — сайт, GBP, TripAdvisor, Facebook, директории.' },
                { title: 'Местни директории', text: 'Регистрирайте се в bg.businessyab.com, infobiz.bg, tripadvisor.com, foursquare.com, Yelp.' },
                { title: 'Локални връзки', text: 'Партньорства с хотели в Търново, туристически сайтове, НПО и местни медии за линкове.' },
                { title: 'Съдържание за Търново', text: 'Публикувайте за "Нощ на Самоводската чаршия", "Царевград Търнов", "Традиционна търновска кухня".' },
              ].map((item) => (
                <div key={item.title} className="p-5 rounded-xl border border-[#1C1C1E]/8 bg-white">
                  <div className="text-sm font-medium text-[#1C1C1E] mb-2">{item.title}</div>
                  <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 8 */}
          <section id="sotsialni" className="mb-12">
            <h2
              className="text-2xl md:text-3xl font-light text-[#1C1C1E] leading-tight mb-5"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Социални медии + SEO — <span className="italic text-[#0A2540]">синергия за ресторанти.</span>
            </h2>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              Социалните медии не са пряк ранкинг фактор, но влияят на <strong>непреки сигнали</strong> — трафик, време на сайта, маркови търсения.
            </p>
            <div className="p-5 rounded-xl border border-[#1C1C1E]/8 bg-[#FAFAFA] mb-4">
              <div className="text-[10px] text-[#1C1C1E]/65 tracking-widest uppercase mb-3">Социална стратегия за ресторант</div>
              <ul className="space-y-2 text-sm text-[#1C1C1E]/65">
                <li>· Instagram: снимки на ястия с geotag "Велико Търново, България"</li>
                <li>· TikTok: видеа "Как приготвяме..." — задкулисно съдържание</li>
                <li>· Facebook: събития, live от кухнята, клиентски истории</li>
                <li>· Всяка публикация трябва да има линк към сайта</li>
                <li>· Използвайте хаштагове: #ресторанттърново #великотърново #българскакухня</li>
              </ul>
            </div>
          </section>

          {/* Section 9 */}
          <section id="rezultati" className="mb-12">
            <h2
              className="text-2xl md:text-3xl font-light text-[#1C1C1E] leading-tight mb-5"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Реални резултати от <span className="italic text-[#0A2540]">ресторанти в Търново.</span>
            </h2>

            <div className="space-y-4 mb-6">
              {RESULT_CASES.map((c) => (
                <div key={c.name} className="p-5 rounded-xl border border-[#1C1C1E]/8 bg-white">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-[#1B4332]" />
                    <span className="text-sm font-medium text-[#1C1C1E]">{c.name}</span>
                  </div>
                  <div className="text-sm text-[#0A2540] font-medium mb-1">{c.result}</div>
                  <p className="text-xs text-[#1C1C1E]/65">{c.detail}</p>
                  {c.link && (
                    <a
                      href={c.link}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="text-xs text-[#0A2540] hover:underline mt-2 inline-flex items-center gap-1"
                    >
                      Вижте сайта <i className="ri-external-link-line" />
                    </a>
                  )}
                </div>
              ))}
            </div>

            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
              Тези резултати са постигнати с <strong>SEO + Google Business Profile + уеб сайт</strong> — без платени реклами. Времето за резултат е 2–4 месеца, но ефектът е <strong>дългосрочен</strong>.
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
                  SEO за вашия ресторант
                  <br />
                  <span className="italic text-white/60">във Велико Търново.</span>
                </div>
                <p className="text-sm text-white/75 max-w-md leading-relaxed">
                  Консултация 50 € — анализ на текущата позиция, конкурентите и стратегия за #1 в Google. Сумата се приспада при договор.
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
                { title: 'SEO оптимизация Велико Търново 2026', to: '/blog/seo-optimizaciya-tarnovo-2026' },
                { title: 'Google Business Profile за бизнеси в Търново', to: '/blog/google-business-vt' },
                { title: 'Безплатен SEO за номер 1 в Google', to: '/blog/bezplaten-seo-nomer-edno-google' },
                { title: 'GEO оптимизация за ChatGPT и Perplexity', to: '/blog/geo-ai-tarnovo' },
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