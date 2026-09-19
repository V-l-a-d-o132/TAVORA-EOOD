import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SharedNav from '@/components/feature/SharedNav';
import SharedFooter from '@/components/feature/SharedFooter';

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      '@id': 'https://imashnujnoto.com/blog/marketing-za-ecommerce-plodove-tarnovo#article',
      name: 'Маркетинг за плодове от гората — уроци от Горски Боровинки',
      headline: 'Маркетинг за плодове от гората — уроци от Горски Боровинки',
      description: 'Реални маркетингови уроци от Горски Боровинки — как да продаваш сезонни, диви продукти онлайн без рекламен бюджет. Viber, SEO, доверие и общност.',
      author: { '@type': 'Person', name: 'Владимир Атанасов', url: 'https://imashnujnoto.com/ekip' },
      publisher: { '@type': 'Organization', name: 'ТАВОРА ЕООД', url: 'https://imashnujnoto.com', telephone: '+359885189724', email: 'tavoraagency@gmail.com', logo: { '@type': 'ImageObject', url: 'https://storage.readdy-site.link/project_files/3f265d07-5825-4e88-a58a-44deb287b858/777dce2a-8731-4235-b0be-7837a840c3c9_TAVORA-MARKETING-AGENCY-VELIKO-TARNOVO.png?v=f6135e7442d441feef102ad2f8425862' } },
      datePublished: '2026-07-08',
      dateModified: new Date().toISOString().split('T')[0],
      url: 'https://imashnujnoto.com/blog/marketing-za-ecommerce-plodove-tarnovo',
      mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://imashnujnoto.com/blog/marketing-za-ecommerce-plodove-tarnovo' },
      inLanguage: 'bg',
      image: 'https://readdy.ai/api/search-image?query=Hand%20picking%20wild%20blueberries%20in%20lush%20green%20Bulgarian%20mountain%20forest%20Stara%20Planina%20natural%20daylight%20close%20up%20authentic%20rustic%20editorial%20photography%20warm%20earth%20tones%20high%20detail%20organic%20harvesting&width=1200&height=630&seq=blog-marketing-plodove-hero-01&orientation=landscape',
      articleSection: 'Маркетинг',
      keywords: 'маркетинг плодове от гората, сезонен маркетинг, Viber маркетинг, дигитален маркетинг храна, Горски Боровинки',
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Начало', item: 'https://imashnujnoto.com/' },
        { '@type': 'ListItem', position: 2, name: 'Блог', item: 'https://imashnujnoto.com/blog' },
        { '@type': 'ListItem', position: 3, name: 'Маркетинг за плодове от гората', item: 'https://imashnujnoto.com/blog/marketing-za-ecommerce-plodove-tarnovo' },
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
  { id: 'problem', label: 'Проблемът: сезонен продукт, кратък прозорец' },
  { id: 'doverie', label: 'Доверието преди цената' },
  { id: 'viber', label: 'Viber като основен канал за продажби' },
  { id: 'sadrzhanie', label: 'Съдържание, което продава: реални снимки' },
  { id: 'sezonnost', label: 'Работа със сезонността, не против нея' },
  { id: 'uroci', label: '5 маркетингови урока за всеки бизнес' },
];

export default function MarketingZaEcommercePlodovePage() {
  useEffect(() => {
    const id = 'schema-marketing-plodove';
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement('script');
      el.id = id;
      el.type = 'application/ld+json';
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(SCHEMA);

    document.title = 'Маркетинг за плодове от гората — уроци от Горски Боровинки | ТАВОРА ЕООД';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Реални маркетингови уроци от Горски Боровинки — как да продаваш сезонни, диви продукти онлайн без рекламен бюджет. Viber, SEO, доверие и общност.');
    }
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://imashnujnoto.com/blog/marketing-za-ecommerce-plodove-tarnovo');

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
          <span className="text-[#1C1C1E]/65">Маркетинг плодове гората</span>
        </nav>

        <section className="mb-10">
          <div className="w-full h-[280px] md:h-[400px] rounded-2xl overflow-hidden mb-8">
            <img
              src="https://readdy.ai/api/search-image?query=Hand%20picking%20wild%20blueberries%20in%20lush%20green%20Bulgarian%20mountain%20forest%20Stara%20Planina%20natural%20daylight%20close%20up%20authentic%20rustic%20editorial%20photography%20warm%20earth%20tones%20high%20detail%20organic%20harvesting&width=1200&height=630&seq=blog-marketing-plodove-hero-01&orientation=landscape"
              alt="Маркетинг за плодове от гората — уроци от Горски Боровинки"
              className="w-full h-full object-cover object-top"
              loading="lazy" decoding="async"
            />
          </div>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 font-medium">Маркетинг</span>
            <span className="text-[10px] text-[#1C1C1E]/70">8 Юли 2026</span>
            <span className="text-[10px] text-[#1C1C1E]/70">·</span>
            <span className="text-[10px] text-[#1C1C1E]/70">9 мин. четене</span>
          </div>

          <h1
            className="text-3xl md:text-5xl font-light text-[#1C1C1E] leading-tight mb-5"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Маркетинг за плодове от гората.
            <br />
            <span className="italic text-[#0A2540]">Уроци от Горски Боровинки.</span>
          </h1>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed max-w-2xl mb-6">
            Как да продаваш <strong>сезонен, див продукт</strong> онлайн — без рекламен бюджет, без маркетинг екип, без склад. Реални уроци от работата с <a href="https://gorskiborovinki.com/" target="_blank" rel="noopener noreferrer nofollow" className="text-[#0A2540] hover:underline">gorskiborovinki.com</a>.
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
              <div className="text-[10px] text-[#1C1C1E]/65">Маркетинг стратег, ТАВОРА ЕООД</div>
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

          <section id="problem" className="mb-12">
            <h2 className="text-2xl md:text-3xl font-light text-[#1C1C1E] leading-tight mb-5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Проблемът: <span className="italic text-[#0A2540]">сезонен продукт, кратък прозорец.</span>
            </h2>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              Горските боровинки не се продават целогодишно. Реколтата е 3–4 месеца. Ако не продадеш през този прозорец — чакаш следващата година. Това е <strong>нож с две остриета</strong>: от една страна имаш спешност, от друга — имаш ограничено време за грешки.
            </p>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              Повечето бизнеси реагират с <strong>стрес и намаляване на цената</strong>. „Да свалим цената, за да продадем повече." Грешка. Когато свалиш цената на див продукт, му свалиш и стойността. Боровинките стават „евтини плодове", а не „премиум диви боровинки от планината".
            </p>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
              Горски Боровинки не намалиха цената. Вместо това <strong>увеличиха стойността</strong> — по-добър сайт, по-добри снимки, по-бърза комуникация. Резултатът: +200% продажби при същата цена.
            </p>
          </section>

          <section id="doverie" className="mb-12">
            <h2 className="text-2xl md:text-3xl font-light text-[#1C1C1E] leading-tight mb-5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Доверието <span className="italic text-[#0A2540]">преди цената.</span>
            </h2>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              Когато купуваш храна онлайн — особено директно от „някой от интернет" — първият въпрос не е „Колко струва?", а <strong>„Мога ли да му се доверя?"</strong>
            </p>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              На сайта на Горски Боровинки <strong>няма</strong> измислени 5-звездни рецензии. Вместо това има:
            </p>
            <div className="p-5 rounded-xl border border-[#1C1C1E]/8 bg-[#FAFAFA] mb-5">
              <ul className="space-y-2">
                {[
                  'Реални скрийншоти от Messenger и Viber разговори с клиенти',
                  'Снимки на самия процес — бера, сортиране, опаковане',
                  'Видео на реколтата — не stock footage, а реален материал',
                  'Прозрачна информация за произхода — Стара Планина, конкретен регион',
                  'Личен телефон за контакт — не форма, а директна връзка',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#1C1C1E]/65">
                    <i className="ri-check-line text-[#1B4332] text-xs mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
              <strong>Урок:</strong> Доверието не се купува с реклама. Доверието се гради с <strong>прозрачност</strong>. Покажи процеса. Покажи хората. Покажи реалните разговори.
            </p>
          </section>

          <section id="viber" className="mb-12">
            <h2 className="text-2xl md:text-3xl font-light text-[#1C1C1E] leading-tight mb-5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Viber <span className="italic text-[#0A2540]">като основен канал за продажби.</span>
            </h2>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              Горски Боровинки не използва Facebook реклами. Основният канал за продажби е <strong>Viber</strong> — директни съобщения и Viber група за реколтата.
            </p>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              Защо Viber работи тук:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              {[
                { title: 'Инстантност', text: 'Клиентът пише и получава отговор в рамките на минути. Няма чакане, няма автоматизирани отговори.' },
                { title: 'Личен контакт', text: 'Вiber е личен канал. Когато клиентът ти пише там, вече е по-ангажиран отколкото ако пълни форма.' },
                { title: 'Група за реколтата', text: 'Viber групата не е само за продажби — тя е community. Хората споделят рецепти, снимки, очакват реколтата.' },
                { title: 'Безплатно', text: 'Няма CPM, няма бюджет. Само време за отговаряне на съобщения.' },
              ].map((item) => (
                <div key={item.title} className="p-5 rounded-xl border border-[#1C1C1E]/8 bg-white">
                  <div className="text-sm font-medium text-[#1C1C1E] mb-2">{item.title}</div>
                  <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
              <strong>SEO бонус:</strong> Когато хората споделят линк към gorskiborovinki.com във Viber групи, Google вижда трафик от месинджъри като <strong>social signal</strong> — косвен ранкинг фактор.
            </p>
          </section>

          <section id="sadrzhanie" className="mb-12">
            <h2 className="text-2xl md:text-3xl font-light text-[#1C1C1E] leading-tight mb-5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Съдържание, което продава:{' '}
              <span className="italic text-[#0A2540]">реални снимки, не stock footage.</span>
            </h2>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              На сайта на Горски Боровинки всяка снимка е реална. Боровинките са истински. Берито е истинско. Опаковането е истинско. Това е <strong>anti-marketing</strong> — няма perfect lighting, няма фотошоп. И точно затова работи.
            </p>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              Когато видиш снимка на боровинки в пластмасова кутия с прахоляк около нея — знаеш, че е реална. Когато видиш perfect studio shot — знаеш, че е купена от Shutterstock.
            </p>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
              <strong>Урок:</strong> За локални, ръчно произведени продукти — <strong>не-перфектната снимка е по-убедителна от перфектната</strong>. Покажи реалността. Хората купуват автентичност.
            </p>
          </section>

          <section id="sezonnost" className="mb-12">
            <h2 className="text-2xl md:text-3xl font-light text-[#1C1C1E] leading-tight mb-5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Работа със сезонността,{' '}
              <span className="italic text-[#0A2540]">не против нея.</span>
            </h2>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              Повечето сезонни бизнеси тъжат, че „има само 3 месеца". Горски Боровинки превърна сезонността в <strong>актив</strong>.
            </p>
            <div className="p-5 rounded-xl border border-[#1C1C1E]/8 bg-[#FAFAFA] mb-5">
              <ul className="space-y-2">
                {[
                  '"Реколтата е къса" — scarcity, който кара хората да поръчват веднага',
                  'Viber група работи целогодишно — клиентите чакат следващата реколта',
                  'Сезонен countdown на сайта — "Остават 14 дни до края на реколтата"',
                  'Зимен продукт: сладко от боровинки, сушени боровинки — разширява сезона',
                  'SEO работи целогодишно — сайтът събира трафик дори когато няма реколта',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#1C1C1E]/65">
                    <i className="ri-check-line text-[#1B4332] text-xs mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
              <strong>Урок:</strong> Сезонността не е проблем — тя е <strong>маркетингов инструмент</strong>. Спешността продава. Краткият прозорец кара хората да действат. Използвай го.
            </p>
          </section>

          <section id="uroci" className="mb-12">
            <h2 className="text-2xl md:text-3xl font-light text-[#1C1C1E] leading-tight mb-5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              5 маркетингови урока{' '}
              <span className="italic text-[#0A2540]">за всеки бизнес.</span>
            </h2>
            <div className="space-y-4">
              {[
                { num: '01', title: 'Не намалявай цената — увеличи стойността', text: 'Добави бонуси, по-добро обслужване, по-бърза доставка. Цената е сигнал за качество.' },
                { num: '02', title: 'Доверието се гради с прозрачност', text: 'Покажи процеса. Покажи реалните клиенти. Покажи грешките. Хората купуват от хора, не от марки.' },
                { num: '03', title: 'Използвай личните канали', text: 'Viber, WhatsApp, директни съобщения — тези канали имат по-висока конверсия от всяка реклама.' },
                { num: '04', title: 'Снимай реалността, не perfection', text: 'Автентичните снимки продават повече от stock footage. Хората искат да видят истинския продукт.' },
                { num: '05', title: 'Превърни ограниченията в активи', text: 'Сезонността, малкият екипът, липсата на склад — всичко това може да бъде част от историята ти.' },
              ].map((u) => (
                <div key={u.num} className="p-5 rounded-xl border border-[#1C1C1E]/8 bg-white">
                  <div className="flex items-start gap-3">
                    <span className="text-lg font-light text-[#0A2540] shrink-0" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{u.num}</span>
                    <div>
                      <div className="text-sm font-medium text-[#1C1C1E] mb-1">{u.title}</div>
                      <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">{u.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-12 p-7 md:p-10 rounded-2xl bg-[#0F1F35] text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="text-xs text-white/75 tracking-widest uppercase mb-2">Готови за ръст?</div>
                <div className="text-2xl md:text-3xl font-light leading-tight mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Маркетинг за вашия бизнес
                  <br />
                  <span className="italic text-white/60">във Велико Търново.</span>
                </div>
                <p className="text-sm text-white/75 max-w-md leading-relaxed">
                  Консултация 50 € — анализ на текущата стратегия, конкурентите и план за растеж. Сумата се приспада при договор.
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
                  to="/uslugi"
                  className="px-7 py-3.5 border border-white/20 text-white/70 text-sm rounded-full hover:border-white/40 hover:text-white transition-all cursor-pointer whitespace-nowrap text-center"
                >
                  Вижте услугите
                </Link>
              </div>
            </div>
          </section>

          <section className="mb-12 pt-8 border-t border-[#1C1C1E]/6">
            <div className="text-[10px] text-[#1C1C1E]/65 tracking-widest uppercase mb-4">Свързани статии</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { title: 'Как Горски Боровинки стана #1 в Google', to: '/blog/gorski-borovinki-nomer-edno-google' },
                { title: 'E-commerce стратегия за сезонни продукти', to: '/blog/ecommerce-sezonni-produkti-gorski-borovinki' },
                { title: 'SEO оптимизация Велико Търново 2026', to: '/blog/seo-optimizaciya-tarnovo-2026' },
                { title: 'GEO оптимизация за ChatGPT', to: '/blog/geo-ai-tarnovo' },
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