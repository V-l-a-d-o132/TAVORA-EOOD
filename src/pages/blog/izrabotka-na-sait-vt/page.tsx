import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SharedNav from '@/components/feature/SharedNav';
import SharedFooter from '@/components/feature/SharedFooter';

const today = new Date().toISOString().split('T')[0];

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      '@id': 'https://imashnujnoto.com/blog/izrabotka-na-sait-vt#article',
      headline: 'Изработка на сайт Велико Търново — цени, срокове и какво да очаквате 2026',
      description: 'Колко струва изработката на сайт за бизнес в Търново? Какво включва, какви са сроковете и как да изберете правилния партньор. ТАВОРА ЕООД.',
      author: { '@type': 'Person', name: 'Владимир Атанасов', url: 'https://imashnujnoto.com/ekip' },
      publisher: { '@type': 'Organization', name: 'ТАВОРА ЕООД', url: 'https://imashnujnoto.com', logo: { '@type': 'ImageObject', url: 'https://storage.readdy-site.link/project_files/3f265d07-5825-4e88-a58a-44deb287b858/777dce2a-8731-4235-b0be-7837a840c3c9_TAVORA-MARKETING-AGENCY-VELIKO-TARNOVO.png?v=f6135e7442d441feef102ad2f8425862' } },
      datePublished: '2026-04-20',
      dateModified: today,
      inLanguage: 'bg',
      url: 'https://imashnujnoto.com/blog/izrabotka-na-sait-vt',
      wordCount: 2000,
      timeRequired: 'PT8M',
      image: { '@type': 'ImageObject', url: 'https://readdy.ai/api/search-image?query=web%20design%20development%20laptop%20screen%20modern%20website%20UI%20design%20clean%20minimal%20white%20background%20professional%20workspace%20Veliko%20Tarnovo%20Bulgaria&width=1200&height=630&seq=blog-sait-vt-hero&orientation=landscape', width: 1200, height: 630 },
      mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://imashnujnoto.com/blog/izrabotka-na-sait-vt' },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Начало', item: 'https://imashnujnoto.com/' },
          { '@type': 'ListItem', position: 2, name: 'Блог', item: 'https://imashnujnoto.com/blog' },
          { '@type': 'ListItem', position: 3, name: 'Изработка на сайт Велико Търново', item: 'https://imashnujnoto.com/blog/izrabotka-na-sait-vt' },
        ],
      },
      keywords: 'изработка на сайт Велико Търново, уеб дизайн Търново, сайт за бизнес Търново, уеб разработка Търново',
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'Колко струва изработката на сайт в Търново?', acceptedAnswer: { '@type': 'Answer', text: 'Изработката на сайт за бизнес в Търново започва от 999 €. Цената зависи от сложността, броя на страниците и функционалностите. Включва SEO оптимизация, мобилна адаптация и Core Web Vitals 90+.' } },
        { '@type': 'Question', name: 'Колко бързо ще е готов сайтът?', acceptedAnswer: { '@type': 'Answer', text: 'Стандартен бизнес сайт — 2-3 седмици. По-сложни проекти с e-commerce или специфични функционалности — 4-6 седмици.' } },
        { '@type': 'Question', name: 'Включва ли SEO оптимизация изработката на сайт?', acceptedAnswer: { '@type': 'Answer', text: 'Да — всеки сайт от ТАВОРА ЕООД включва on-page SEO, Schema.org структурирани данни, GEO оптимизация за AI търсачки и Core Web Vitals 90+.' } },
      ],
    },
  ],
};

const sections = [
  { id: 'zashto-sait', title: 'Защо всеки бизнес в Търново се нуждае от сайт?', content: `В 2026 г. сайтът е вашата визитна картичка, магазин и маркетинг инструмент едновременно. Без сайт — не съществувате онлайн.\n\nКогато някой в Търново търси "счетоводител", "ресторант" или "хотел" — Google показва резултати. Ако нямате сайт, не сте в тези резултати. Ако имате лош сайт — клиентите отиват при конкурентите.\n\nИзработката на сайт за бизнес в Търново е инвестиция, не разход. Правилно направен сайт работи 24/7 и привлича клиенти дори когато спите.` },
  { id: 'ceni', title: 'Колко струва изработката на сайт в Търново?', content: `Цените варират значително в зависимост от сложността:\n\n**Базов бизнес сайт (от 999 €)** — 5-10 страници, контактна форма, SEO оптимизация, мобилна адаптация. Идеален за малки бизнеси в Търново.\n\n**Корпоративен сайт (от 1999 €)** — 10-20+ страници, блог, галерия, интеграции. За по-големи компании.\n\n**E-commerce сайт (от 2999 €)** — Онлайн магазин с продукти, плащания, управление на поръчки.\n\nВнимание: Евтините сайтове за 200-300 лв. обикновено са шаблони без SEO оптимизация. Те не привличат клиенти — само изглеждат добре.` },
  { id: 'kak-da-izberem', title: 'Как да изберете правилния партньор за сайт в Търново?', content: `**Проверете портфолиото** — Поискайте примери от реални проекти. Проверете дали сайтовете им се зареждат бързо и изглеждат добре на мобилни устройства.\n\n**Питайте за SEO** — Добрият уеб дизайнер в Търново трябва да знае какво е Core Web Vitals, Schema.org и GEO оптимизация. Ако не знае — намерете друг.\n\n**Проверете резултатите** — Имат ли клиенти на #1 в Google? Могат ли да ви покажат верифицируеми резултати?\n\n**Питайте за поддръжка** — Какво се случва след пускането на сайта? Кой ще го поддържа и обновява?` },
  { id: 'seo-v-saita', title: 'SEO в сайта — защо е критично от старт?', content: `Най-честата грешка при изработка на сайт в Търново: SEO се добавя след пускането. Грешно.\n\nSEO трябва да е вградено от самото начало — в структурата на URL-ите, в заглавията, в Schema.org markup-а, в скоростта на зареждане.\n\nВсеки сайт от ТАВОРА ЕООД включва:\n- On-page SEO оптимизация\n- Schema.org LocalBusiness markup\n- GEO оптимизация за ChatGPT и Perplexity\n- Core Web Vitals 90+\n- Мобилна оптимизация\n- Sitemap и robots.txt` },
  { id: 'primeri', title: 'Реални примери от Търново', content: `**K-Food Велико Търново** — Сайт + SEO + GEO. Резултат: #1 в Google и ChatGPT за "корейска храна велико търново". Проверете: k-foodvelikotarnovo.com\n\n**Sunrise Food** — Онлайн магазин + SEO. Резултат: #1 в Google за "гъби кладница онлайн" за 3-4 седмици. Проверете: sunrisefood.eu\n\nТова не са случайни резултати — те са следствие от правилно изградени сайтове с вградено SEO от старт.` },
  { id: 'process', title: 'Как работи процесът на изработка?', content: `**Стъпка 1: Консултация (50 €)** — Разбираме вашия бизнес, цели и конкуренция. Тази сума се приспада при договор.\n\n**Стъпка 2: Дизайн** — Правим прототип на сайта. Вие одобрявате преди да започнем разработката.\n\n**Стъпка 3: Разработка** — Изграждаме сайта с вградено SEO, мобилна оптимизация и Core Web Vitals 90+.\n\n**Стъпка 4: Тестване** — Тестваме на всички устройства и браузъри.\n\n**Стъпка 5: Пускане** — Пускаме сайта и submit-ваме в Google Search Console.\n\n**Стъпка 6: Поддръжка** — Следим, обновяваме и оптимизираме.` },
];

export default function IzrabotkaNaSaitVTPage() {
  useEffect(() => {
    const id = 'schema-sait-vt';
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) { el = document.createElement('script'); el.id = id; el.type = 'application/ld+json'; document.head.appendChild(el); }
    el.textContent = JSON.stringify(SCHEMA);
    document.title = 'Изработка на сайт Велико Търново — цени и срокове 2026 | ТАВОРА ЕООД';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', 'Колко струва изработката на сайт за бизнес в Търново? Цени от 999 €, SEO от старт, Core Web Vitals 90+. Реални резултати от ТАВОРА ЕООД.');
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://imashnujnoto.com/blog/izrabotka-na-sait-vt');
    return () => { const e = document.getElementById(id); if (e) e.remove(); };
  }, []);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <SharedNav />
      <div className="w-full h-[280px] md:h-[420px] overflow-hidden relative">
        <img src="https://readdy.ai/api/search-image?query=web%20design%20development%20laptop%20screen%20modern%20website%20UI%20design%20clean%20minimal%20white%20background%20professional%20workspace%20Veliko%20Tarnovo%20Bulgaria&width=1200&height=630&seq=blog-sait-vt-hero&orientation=landscape" alt="Изработка на сайт Велико Търново" title="Уеб дизайн Търново" className="w-full h-full object-cover object-top" loading="lazy" decoding="async" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
        <div className="absolute bottom-6 left-4 md:left-16"><span className="text-xs text-white/60 tracking-widest uppercase">Блог · ТАВОРА ЕООД</span></div>
      </div>
      <main className="max-w-3xl mx-auto px-4 md:px-8 py-12 md:py-20">
        <nav aria-label="breadcrumb" className="flex items-center gap-2 mb-8 text-xs text-[#1C1C1E]/65">
          <Link to="/" className="hover:text-[#0A2540] transition-colors">Начало</Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-[#0A2540] transition-colors">Блог</Link>
          <span>/</span>
          <span className="text-[#1C1C1E]/65">Изработка на сайт ВТ</span>
        </nav>
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-[1px] bg-[#0A2540]/30 shrink-0" />
            <span className="text-xs text-[#1C1C1E]/60">Уеб дизайн · Велико Търново</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-light text-[#1C1C1E] leading-tight mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Изработка на сайт
            <br /><span className="italic text-[#0A2540]">Велико Търново — цени 2026</span>
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#1C1C1E]/65">
            <span>Владимир Атанасов · ТАВОРА ЕООД</span><span>·</span><span>20 Апр 2026</span><span>·</span><span>8 мин. четене</span>
            <span>·</span><span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 text-[10px] font-medium">Уеб дизайн</span>
          </div>
        </div>
        <div className="p-5 rounded-2xl border border-[#1C1C1E]/8 bg-[#F9F9F9] mb-10">
          <div className="text-xs font-medium text-[#1C1C1E]/65 tracking-widest uppercase mb-3">Съдържание</div>
          <div className="space-y-2">
            {sections.map((s, i) => (
              <a key={s.id} href={`#${s.id}`} className="flex items-center gap-2 text-sm text-[#0A2540] hover:underline decoration-dotted cursor-pointer">
                <span className="text-[10px] text-[#1C1C1E]/70 w-4">{i + 1}.</span>{s.title}
              </a>
            ))}
          </div>
        </div>
        <p className="text-base text-[#1C1C1E]/60 leading-relaxed mb-10 border-l-2 border-[#0A2540]/20 pl-4">
          Искате сайт за бизнеса си в Търново, но не знаете колко струва и какво да очаквате? Тази статия ще ви даде честни отговори — цени, срокове, какво включва и как да изберете правилния партньор.
        </p>
        <article className="space-y-12">
          {sections.map((section) => (
            <section key={section.id} id={section.id}>
              <h4 className="text-xl md:text-2xl font-light text-[#1C1C1E] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                <a href={`#${section.id}`} className="hover:text-[#0A2540] transition-colors"><strong>{section.title}</strong></a>
              </h4>
              <div className="space-y-3">
                {section.content.split('\n\n').map((para, i) => {
                  if (para.startsWith('**') && para.includes('**\n')) {
                    const [boldPart, ...rest] = para.split('\n');
                    return (<div key={i}><div className="text-sm font-semibold text-[#1C1C1E] mb-1">{boldPart.replace(/\*\*/g, '')}</div><p className="text-sm text-[#1C1C1E]/65 leading-relaxed">{rest.join(' ')}</p></div>);
                  }
                  return <p key={i} className="text-sm text-[#1C1C1E]/65 leading-relaxed">{para.replace(/\*\*/g, '')}</p>;
                })}
              </div>
            </section>
          ))}
        </article>
        <div className="mt-14 p-6 md:p-8 rounded-2xl bg-[#0F1F35]">
          <div className="text-xs text-white/75 tracking-widest uppercase mb-3">Следваща стъпка</div>
          <div className="text-xl md:text-2xl font-light text-white mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Искате сайт за бизнеса си в Търново?</div>
          <p className="text-sm text-white/75 mb-5">Консултацията е 50 € — анализ и план. Сумата се приспада при договор. Гаранция за връщане на парите.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/kontakt" className="px-7 py-3.5 bg-white text-[#0F1F35] text-sm rounded-full hover:bg-white/90 transition-all cursor-pointer whitespace-nowrap text-center font-medium">Поискайте оферта →</Link>
            <Link to="/uslugi/izrabotka-na-sait" className="px-7 py-3.5 border border-white/20 text-white/70 text-sm rounded-full hover:border-white/40 hover:text-white transition-all cursor-pointer whitespace-nowrap text-center">Вижте услугата →</Link>
          </div>
        </div>
        <div className="mt-10">
          <div className="text-xs text-[#1C1C1E]/65 tracking-widest uppercase mb-4">Свързани статии</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link to="/blog-seo-vt" className="p-4 rounded-xl border border-[#1C1C1E]/8 bg-white hover:border-[#0A2540]/15 transition-all cursor-pointer group">
              <div className="text-sm font-medium text-[#1C1C1E] group-hover:text-[#0A2540] transition-colors mb-1">Защо SEO е важно за малкия бизнес в Търново</div>
              <div className="text-xs text-[#1C1C1E]/65">6 мин. четене</div>
            </Link>
            <Link to="/blog/geo-ai-tarnovo" className="p-4 rounded-xl border border-[#1C1C1E]/8 bg-white hover:border-[#0A2540]/15 transition-all cursor-pointer group">
              <div className="text-sm font-medium text-[#1C1C1E] group-hover:text-[#0A2540] transition-colors mb-1">GEO оптимизация за AI търсачки</div>
              <div className="text-xs text-[#1C1C1E]/65">7 мин. четене</div>
            </Link>
          </div>
        </div>
      </main>
      <SharedFooter />
    </div>
  );
}
