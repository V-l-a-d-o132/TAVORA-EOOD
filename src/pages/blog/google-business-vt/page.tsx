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
      '@id': 'https://imashnujnoto.com/blog/google-business-vt#article',
      headline: 'Google Business Profile за бизнеси в Търново — пълно ръководство 2026',
      description: 'Как да настроите Google Business Profile правилно за бизнес в Търново. Стъпка по стъпка ръководство за локален SEO ранк. ТАВОРА ЕООД.',
      author: { '@type': 'Person', name: 'Владимир Атанасов', url: 'https://imashnujnoto.com/ekip' },
      publisher: { '@type': 'Organization', name: 'ТАВОРА ЕООД', url: 'https://imashnujnoto.com', logo: { '@type': 'ImageObject', url: 'https://storage.readdy-site.link/project_files/3f265d07-5825-4e88-a58a-44deb287b858/777dce2a-8731-4235-b0be-7837a840c3c9_TAVORA-MARKETING-AGENCY-VELIKO-TARNOVO.png?v=f6135e7442d441feef102ad2f8425862' } },
      datePublished: '2026-04-01',
      dateModified: today,
      inLanguage: 'bg',
      url: 'https://imashnujnoto.com/blog/google-business-vt',
      wordCount: 1700,
      timeRequired: 'PT6M',
      image: { '@type': 'ImageObject', url: 'https://readdy.ai/api/search-image?query=Google%20Business%20Profile%20local%20SEO%20map%20listing%20smartphone%20screen%20Veliko%20Tarnovo%20Bulgaria%20clean%20minimal%20white%20background%20professional%20business%20listing&width=1200&height=630&seq=blog-gbp-hero&orientation=landscape', width: 1200, height: 630 },
      mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://imashnujnoto.com/blog/google-business-vt' },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Начало', item: 'https://imashnujnoto.com/' },
          { '@type': 'ListItem', position: 2, name: 'Блог', item: 'https://imashnujnoto.com/blog' },
          { '@type': 'ListItem', position: 3, name: 'Google Business Profile Търново', item: 'https://imashnujnoto.com/blog/google-business-vt' },
        ],
      },
      keywords: 'Google Business Profile Търново, локално SEO Велико Търново, Google Maps Търново, местен ранк Търново',
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'Безплатен ли е Google Business Profile?', acceptedAnswer: { '@type': 'Answer', text: 'Да, Google Business Profile е напълно безплатен. Всеки бизнес може да го създаде и управлява без разходи.' } },
        { '@type': 'Question', name: 'Колко важен е Google Business Profile за локален SEO в Търново?', acceptedAnswer: { '@type': 'Answer', text: 'Изключително важен. Без GBP не можете да се появявате в Google Maps и в локалния пакет с 3 резултата. Това е задължителна стъпка за всеки физически бизнес в Търново.' } },
        { '@type': 'Question', name: 'Как да получа повече отзиви в Google за бизнеса си в Търново?', acceptedAnswer: { '@type': 'Answer', text: 'Изпращайте директен линк за отзив на доволни клиенти. Питайте лично след добро обслужване. Отговаряйте на всички отзиви — положителни и отрицателни. Никога не купувайте фалшиви отзиви.' } },
      ],
    },
  ],
};

const sections = [
  { id: 'kakvo-e-gbp', title: 'Какво е Google Business Profile?', content: `Google Business Profile (GBP) е безплатен инструмент от Google, който позволява на бизнесите да управляват присъствието си в Google Search и Google Maps.\n\nКогато някой търси "ресторант Велико Търново" или "счетоводител Търново" — Google показва карта с 3 бизнеса. Това е "локалният пакет" и е изключително ценно място.\n\nБез GBP — не сте в тази карта. С добре оптимизиран GBP — имате реален шанс да сте в топ 3 за вашата ниша в Търново.` },
  { id: 'zashto-vazhen', title: 'Защо GBP е критичен за бизнеси в Търново?', content: `**Локалният пакет** — Трите бизнеса в картата получават 44% от кликовете при локални търсения. Ако не сте там, губите почти половината от потенциалните клиенти.\n\n**"Близо до мен" търсения** — Търсенията с "близо до мен" растат с 50% годишно. Всички те минават през GBP.\n\n**AI търсачки** — ChatGPT и Perplexity използват GBP данни за препоръки. Актуален GBP = по-добри GEO позиции.\n\n**Безплатно** — За разлика от Google Ads, GBP е напълно безплатен. Инвестирате само времето си.` },
  { id: 'kak-da-nastroim', title: 'Как да настроите GBP правилно за Търново?', content: `**Стъпка 1: Създайте профила** — Отидете на business.google.com и следвайте инструкциите. Ще трябва да верифицирате бизнеса си с пощенска картичка или телефон.\n\n**Стъпка 2: Попълнете всичко** — Не оставяйте нищо празно. Описание, категории, работно време, телефон, сайт, адрес — всичко.\n\n**Стъпка 3: Добавете снимки** — Минимум 10 снимки. Интериор, екстериор, продукти, екип. Бизнесите с повече снимки получават повече кликове.\n\n**Стъпка 4: Изберете правилните категории** — Основната категория е най-важна. "Маркетинг агенция" е по-добро от "Бизнес услуги".\n\n**Стъпка 5: Добавете услуги и продукти** — Изброете всичко, което предлагате. Това помага на Google да ви показва при по-специфични търсения.` },
  { id: 'otzyvi', title: 'Отзивите — тайното оръжие за ранк в Търново', content: `Отзивите са един от най-важните фактори за локален ранк в Google. Бизнесите с повече и по-добри отзиви се класират по-високо.\n\n**Как да получите повече отзиви:**\n- Изпращайте директен линк за отзив на доволни клиенти\n- Питайте лично след добро обслужване\n- Добавете QR код с линк за отзив в магазина/офиса\n- Отговаряйте на всички отзиви — положителни и отрицателни\n\n**Важно:** Никога не купувайте фалшиви отзиви. Google ги открива и наказва. Реалните отзиви от реални клиенти в Търново са единственият правилен начин.` },
  { id: 'posts', title: 'Google Posts — редовно публикувайте', content: `Google Posts са кратки публикации, които се появяват в GBP профила ви. Редовните публикации сигнализират на Google, че бизнесът е активен.\n\nПубликувайте поне 1-2 пъти седмично:\n- Промоции и оферти\n- Нови продукти или услуги\n- Новини от бизнеса\n- Полезни съвети за клиентите\n\nПостовете изтичат след 7 дни, затова редовността е ключова.` },
  { id: 'monitoring', title: 'Следете и оптимизирайте', content: `GBP предоставя безплатна аналитика — колко хора са видели профила ви, колко са кликнали, колко са се обадили.\n\nСледете тези метрики месечно:\n- Брой прегледи на профила\n- Брой кликове към сайта\n- Брой обаждания\n- Брой заявки за маршрут\n\nАко нещо не работи — оптимизирайте. Сменете снимките, обновете описанието, добавете нови услуги.` },
];

export default function GoogleBusinessVTPage() {
  useEffect(() => {
    const id = 'schema-gbp-vt';
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) { el = document.createElement('script'); el.id = id; el.type = 'application/ld+json'; document.head.appendChild(el); }
    el.textContent = JSON.stringify(SCHEMA);
    document.title = 'Google Business Profile за бизнеси в Търново — ръководство 2026 | ТАВОРА ЕООД';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', 'Как да настроите Google Business Profile правилно за бизнес в Търново. Стъпка по стъпка ръководство за локален SEO ранк. ТАВОРА ЕООД.');
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://imashnujnoto.com/blog/google-business-vt');
    return () => { const e = document.getElementById(id); if (e) e.remove(); };
  }, []);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <SharedNav />
      <div className="w-full h-[280px] md:h-[420px] overflow-hidden relative">
        <img src="https://readdy.ai/api/search-image?query=Google%20Business%20Profile%20local%20SEO%20map%20listing%20smartphone%20screen%20Veliko%20Tarnovo%20Bulgaria%20clean%20minimal%20white%20background%20professional%20business%20listing&width=1200&height=630&seq=blog-gbp-hero&orientation=landscape" alt="Google Business Profile за бизнеси в Търново" title="Google Business Profile Велико Търново" className="w-full h-full object-cover object-top" loading="lazy" decoding="async" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
        <div className="absolute bottom-6 left-4 md:left-16"><span className="text-xs text-white/60 tracking-widest uppercase">Блог · ТАВОРА ЕООД</span></div>
      </div>
      <main className="max-w-3xl mx-auto px-4 md:px-8 py-12 md:py-20">
        <nav aria-label="breadcrumb" className="flex items-center gap-2 mb-8 text-xs text-[#1C1C1E]/65">
          <Link to="/" className="hover:text-[#0A2540] transition-colors">Начало</Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-[#0A2540] transition-colors">Блог</Link>
          <span>/</span>
          <span className="text-[#1C1C1E]/65">Google Business Profile Търново</span>
        </nav>
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-[1px] bg-[#0A2540]/30 shrink-0" />
            <span className="text-xs text-[#1C1C1E]/60">Локално SEO · Велико Търново</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-light text-[#1C1C1E] leading-tight mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Google Business Profile
            <br /><span className="italic text-[#0A2540]">задължително за Търново</span>
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#1C1C1E]/65">
            <span>Владимир Атанасов · ТАВОРА ЕООД</span><span>·</span><span>1 Апр 2026</span><span>·</span><span>6 мин. четене</span>
            <span>·</span><span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-medium">Локално SEO</span>
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
          Google Business Profile е безплатният инструмент, който може да ви вкара в топ 3 на Google Maps за Търново. Без него — не съществувате в локалните резултати.
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
          <div className="text-xl md:text-2xl font-light text-white mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Искате да сте в топ 3 на Google Maps за Търново?</div>
          <p className="text-sm text-white/75 mb-5">GBP оптимизацията е включена в нашия SEO пакет от 390 €. Консултацията е 50 € и се приспада при договор.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/kontakt" className="px-7 py-3.5 bg-white text-[#0F1F35] text-sm rounded-full hover:bg-white/90 transition-all cursor-pointer whitespace-nowrap text-center font-medium">Поискайте SEO одит →</Link>
            <Link to="/seo-veliko-tarnovo" className="px-7 py-3.5 border border-white/20 text-white/70 text-sm rounded-full hover:border-white/40 hover:text-white transition-all cursor-pointer whitespace-nowrap text-center">SEO Велико Търново →</Link>
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
              <div className="text-sm font-medium text-[#1C1C1E] group-hover:text-[#0A2540] transition-colors mb-1">GEO оптимизация за ChatGPT</div>
              <div className="text-xs text-[#1C1C1E]/65">7 мин. четене</div>
            </Link>
          </div>
        </div>
      </main>
      <SharedFooter />
    </div>
  );
}
