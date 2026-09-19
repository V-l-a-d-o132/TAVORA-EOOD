import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SharedNav from '@/components/feature/SharedNav';
import SharedFooter from '@/components/feature/SharedFooter';

const ARTICLE_SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      '@id': 'https://imashnujnoto.com/blog-seo-vt#article',
      headline: 'Защо SEO е важно за малкия бизнес в Търново — практическо ръководство 2026',
      description: 'Защо SEO е критично за малкия бизнес в Търново. Как да се класирате на #1 в Google. Реални примери и стратегии от ТАВОРА ЕООД.',
      author: {
        '@type': 'Person',
        name: 'Владимир Атанасов',
        url: 'https://imashnujnoto.com/ekip',
      },
      publisher: {
        '@type': 'Organization',
        name: 'ТАВОРА ЕООД',
        url: 'https://imashnujnoto.com',
        logo: { '@type': 'ImageObject', url: 'https://storage.readdy-site.link/project_files/3f265d07-5825-4e88-a58a-44deb287b858/777dce2a-8731-4235-b0be-7837a840c3c9_TAVORA-MARKETING-AGENCY-VELIKO-TARNOVO.png?v=f6135e7442d441feef102ad2f8425862' },
      },
      datePublished: '2026-04-24',
      dateModified: '2026-05-05',
      inLanguage: 'bg',
      url: 'https://imashnujnoto.com/blog-seo-vt',
      wordCount: 1600,
      timeRequired: 'PT6M',
      image: {
        '@type': 'ImageObject',
        url: 'https://readdy.ai/api/search-image?query=SEO%20optimization%20search%20engine%20ranking%20Google%20analytics%20dashboard%20professional%20business%20Veliko%20Tarnovo%20Bulgaria%20clean%20modern%20office%20setup%20with%20charts%20and%20graphs&width=1200&height=630&seq=blog-seo-vt-hero&orientation=landscape',
        width: 1200,
        height: 630,
      },
      mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://imashnujnoto.com/blog-seo-vt' },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Начало', item: 'https://imashnujnoto.com/' },
          { '@type': 'ListItem', position: 2, name: 'Блог', item: 'https://imashnujnoto.com/blog' },
          { '@type': 'ListItem', position: 3, name: 'SEO Велико Търново', item: 'https://imashnujnoto.com/blog-seo-vt' },
        ],
      },
      keywords: 'SEO Велико Търново, SEO оптимизация Търново, локално SEO, Google класиране Търново, дигитален маркетинг Търново',
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Колко струва SEO за малък бизнес в Търново?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'SEO пакетът на ТАВОРА ЕООД е 390 € еднократно и включва on-page SEO, Google Business Profile и GEO оптимизация за AI търсачки. Консултацията е 50 € и се приспада при договор.',
          },
        },
        {
          '@type': 'Question',
          name: 'Колко бързо ще се класирам в Google?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'За нишови ключови думи — 3-4 седмици. За по-конкурентни — 2-3 месеца. Sunrise Food се класира на #1 за 3-4 седмици. K-Food Търново — за 2-3 месеца.',
          },
        },
        {
          '@type': 'Question',
          name: 'Какво е GEO оптимизация и защо е важна за бизнеси в Търново?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'GEO (Generative Engine Optimization) е оптимизация за AI търсачки като ChatGPT, Perplexity и Gemini. Когато някой пита AI за най-добрия бизнес в Търново, вашият трябва да е в отговора. Включена е в нашия SEO пакет.',
          },
        },
        {
          '@type': 'Question',
          name: 'Трябва ли ми нов сайт за SEO оптимизация в Търново?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Не задължително. Можем да оптимизираме съществуващ сайт. Ако сайтът е технически остарял или бавен, може да препоръчаме нов — но това е отделна услуга.',
          },
        },
      ],
    },
  ],
};

const sections = [
  {
    id: 'kakvo-e-seo',
    title: 'Какво е SEO и защо е важно за Търново?',
    content: `SEO (Search Engine Optimization) е процесът на оптимизиране на вашия сайт, за да се появява на по-висока позиция в Google, когато хората търсят продукти или услуги като вашите.

За бизнес в Търново това означава: когато някой търси "ресторант Велико Търново", "счетоводител Търново" или "хотел Велико Търново" — вашият сайт трябва да е на първа страница.

90% от потребителите не отиват на втора страница в Google. Ако не сте на първата — практически не съществувате онлайн. SEO оптимизацията за бизнеси в Търново е вече не опция, а необходимост.`,
  },
  {
    id: 'lokalno-seo',
    title: 'Локалното SEO — ключът за Търново',
    content: `Локалното SEO е специфична форма на оптимизация, насочена към хора, търсещи в конкретен географски район.

**Google Business Profile** — Безплатен инструмент от Google, който показва вашия бизнес в Google Maps и в локалните резултати. Критично важен за всеки физически бизнес в Търново.

**Локални ключови думи** — "ресторант Велико Търново", "фризьор Търново", "адвокат Велико Търново". Тези фрази имат по-малко конкуренция от националните и по-висока конверсия.

**Отзиви в Google** — Бизнесите с повече и по-добри отзиви се класират по-високо. Насърчавайте доволните клиенти да оставят отзив.`,
  },
  {
    id: 'geo-optimizaciya',
    title: 'GEO оптимизация — бъдещето на SEO',
    content: `GEO (Generative Engine Optimization) е новото поле в SEO — оптимизация за AI търсачки като ChatGPT, Perplexity и Gemini.

Все повече хора питат AI: "Кой е най-добрият ресторант в Търново?" или "Препоръчай ми счетоводител в Търново". Ако вашият бизнес не е оптимизиран за AI отговори — пропускате нов канал за клиенти.

K-Food Велико Търново е пример за успешна GEO оптимизация — появява се в отговорите на ChatGPT за "корейска храна Велико Търново". Проверете сами.`,
  },
  {
    id: 'primeri',
    title: 'Реални резултати от Търново',
    content: `**K-Food Велико Търново** — Корейски ресторант. SEO + GEO оптимизация. Резултат: #1 в Google и ChatGPT за "корейска храна велико търново". Сайт: k-foodvelikotarnovo.com

**Sunrise Food** — Онлайн магазин за гъби кладница. SEO оптимизация. Резултат: #1 в Google за "гъби кладница онлайн" за 3-4 седмици. Сайт: sunrisefood.eu

Тези резултати са верифицируеми — отворете Google и потърсете сами.`,
  },
  {
    id: 'tehnichesko-seo',
    title: 'Техническото SEO — основата на всичко',
    content: `Преди да оптимизирате съдържанието, трябва да се уверите, че техническата основа е наред.

**Скорост на зареждане** — Google наказва бавни сайтове. Core Web Vitals трябва да са над 90. Бавен сайт = по-ниска позиция в Google.

**Мобилна оптимизация** — 70% от търсенията в Търново са от мобилни устройства. Ако сайтът ви не е мобилно-оптимизиран, губите клиенти.

**HTTPS** — Сайтовете без SSL сертификат се наказват от Google. Задължително за всеки бизнес в Търново.

**Структурирани данни (Schema.org)** — Помагат на Google да разбере точно какво правите. LocalBusiness, FAQ, Product — всичко трябва да е маркирано.`,
  },
  {
    id: 'kak-da-zapochna',
    title: 'Как да започнете SEO за вашия бизнес в Търново?',
    content: `**Стъпка 1: Технически одит**
Проверете дали сайтът ви се зарежда бързо, дали е мобилно-оптимизиран и дали няма технически грешки.

**Стъпка 2: Ключови думи**
Намерете ключовите думи, по които хората търсят вашите услуги в Търново. Фокусирайте се върху локалните фрази.

**Стъпка 3: On-page оптимизация**
Оптимизирайте заглавията, мета описанията, заглавните тагове и съдържанието на страниците.

**Стъпка 4: Google Business Profile**
Създайте или оптимизирайте профила си в Google Business. Добавете снимки, работно време, описание.

**Стъпка 5: GEO оптимизация**
Оптимизирайте съдържанието за AI търсачки — ChatGPT, Perplexity, Gemini.`,
  },
  {
    id: 'ceni',
    title: 'Цени и гаранции',
    content: `SEO пакетът на ТАВОРА ЕООД е 390 € еднократно и включва:
- Пълен SEO одит
- On-page оптимизация
- Google Business Profile
- Schema.org структурирани данни
- GEO оптимизация за AI търсачки
- Месечен доклад с прогрес

Консултацията е 50 € и включва анализ на вашия бизнес и конкурентите, плюс конкретна стратегия. Тази сума се приспада при сключване на договор.

Всяка услуга (без консултацията) идва с гаранция за връщане на парите. Ако не сте доволни — връщаме сумата без въпроси.`,
  },
];

export default function BlogSEOVTPage() {
  useEffect(() => {
    const id = 'schema-blog-seo';
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement('script');
      el.id = id;
      el.type = 'application/ld+json';
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(ARTICLE_SCHEMA);

    document.title = 'Защо SEO е важно за малкия бизнес в Търново — ръководство 2026 | ТАВОРА ЕООД';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Защо SEO е критично за малкия бизнес в Търново. Как да се класирате на #1 в Google. Реални примери и стратегии от ТАВОРА ЕООД.');
    }
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://imashnujnoto.com/blog-seo-vt');

    return () => {
      const existing = document.getElementById(id);
      if (existing) existing.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <SharedNav />

      <div className="w-full h-[200px] md:h-[420px] overflow-hidden relative">
        <img
          src="https://readdy.ai/api/search-image?query=SEO%20optimization%20search%20engine%20ranking%20Google%20analytics%20dashboard%20professional%20business%20Veliko%20Tarnovo%20Bulgaria%20clean%20modern%20office%20setup%20with%20charts%20and%20graphs&width=1200&height=630&seq=blog-seo-vt-hero&orientation=landscape"
          alt="SEO оптимизация за бизнеси в Търново — ТАВОРА ЕООД"
          title="SEO Велико Търново"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
        <div className="absolute bottom-6 left-4 md:left-16">
          <span className="text-xs text-white/60 tracking-widest uppercase">Блог · ТАВОРА ЕООД</span>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 md:px-8 py-8 md:py-20">
        <nav aria-label="breadcrumb" className="flex items-center gap-2 mb-8 text-xs text-[#1C1C1E]/65">
          <Link to="/" className="hover:text-[#0A2540] transition-colors">Начало</Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-[#0A2540] transition-colors">Блог</Link>
          <span>/</span>
          <span className="text-[#1C1C1E]/65">SEO Велико Търново</span>
        </nav>

        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-[1px] bg-[#0A2540]/30 shrink-0" />
            <span className="text-xs text-[#1C1C1E]/60">SEO · Велико Търново</span>
          </div>
          <h1
            className="text-3xl md:text-5xl font-light text-[#1C1C1E] leading-tight mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Защо SEO е важно
            <br />
            <span className="italic text-[#0A2540]">за малкия бизнес в Търново?</span>
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#1C1C1E]/65">
            <span>Владимир Атанасов · ТАВОРА ЕООД</span>
            <span>·</span>
            <span>24 Април 2026</span>
            <span>·</span>
            <span>6 мин. четене</span>
            <span>·</span>
            <span className="px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 text-[10px] font-medium">SEO</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-[#1C1C1E]/8 bg-[#F9F9F9] mb-10">
          <div className="text-xs font-medium text-[#1C1C1E]/65 tracking-widest uppercase mb-3">Съдържание</div>
          <div className="space-y-2">
            {sections.map((s, i) => (
              <a key={s.id} href={`#${s.id}`} className="flex items-center gap-2 text-sm text-[#0A2540] hover:underline decoration-dotted cursor-pointer">
                <span className="text-[10px] text-[#1C1C1E]/70 w-4">{i + 1}.</span>
                {s.title}
              </a>
            ))}
          </div>
        </div>

        <p className="text-base text-[#1C1C1E]/60 leading-relaxed mb-10 border-l-2 border-[#0A2540]/20 pl-4">
          Имате бизнес в Търново, но клиентите не ви намират онлайн? SEO е отговорът. Тази статия ще ви обясни защо SEO е критично за малкия бизнес в Търново и как да започнете.
        </p>

        <article className="space-y-8 md:space-y-12">
          {sections.map((section) => (
            <section key={section.id} id={section.id}>
              <h4 className="text-xl md:text-2xl font-light text-[#1C1C1E] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                <a href={`#${section.id}`} className="hover:text-[#0A2540] transition-colors">
                  <strong>{section.title}</strong>
                </a>
              </h4>
              <div className="space-y-3">
                {section.content.split('\n\n').map((para, i) => {
                  if (para.startsWith('**') && para.includes('**\n')) {
                    const [boldPart, ...rest] = para.split('\n');
                    const title = boldPart.replace(/\*\*/g, '');
                    return (
                      <div key={i}>
                        <div className="text-sm font-semibold text-[#1C1C1E] mb-1">{title}</div>
                        <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">{rest.join(' ')}</p>
                      </div>
                    );
                  }
                  return (
                    <p key={i} className="text-sm text-[#1C1C1E]/65 leading-relaxed">
                      {para.replace(/\*\*/g, '')}
                    </p>
                  );
                })}
              </div>
            </section>
          ))}
        </article>

        <div className="mt-14 p-4 md:p-8 rounded-2xl bg-[#0F1F35]">
          <div className="text-xs text-white/75 tracking-widest uppercase mb-3">Следваща стъпка</div>
          <div className="text-xl md:text-2xl font-light text-white mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Искате #1 позиция в Google за Търново?
          </div>
          <p className="text-sm text-white/75 mb-5 leading-relaxed">
            Консултацията е 50 € — SEO одит и стратегия. Сумата се приспада при договор. Гаранция за връщане на парите.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/kontakt" className="px-7 py-3.5 bg-white text-[#0F1F35] text-sm rounded-full hover:bg-white/90 transition-all cursor-pointer whitespace-nowrap text-center font-medium">
              Поискайте SEO одит →
            </Link>
            <Link to="/seo-veliko-tarnovo" className="px-7 py-3.5 border border-white/20 text-white/70 text-sm rounded-full hover:border-white/40 hover:text-white transition-all cursor-pointer whitespace-nowrap text-center">
              Вижте SEO услугата →
            </Link>
          </div>
        </div>

        <div className="mt-10">
          <div className="text-xs text-[#1C1C1E]/65 tracking-widest uppercase mb-4">Свързани статии</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link to="/blog-reklama-vt" className="p-4 rounded-xl border border-[#1C1C1E]/8 bg-white hover:border-[#0A2540]/15 transition-all cursor-pointer group">
              <div className="text-sm font-medium text-[#1C1C1E] group-hover:text-[#0A2540] transition-colors mb-1">Как да рекламирам бизнеса си в Търново</div>
              <div className="text-xs text-[#1C1C1E]/65">8 мин. четене</div>
            </Link>
            <Link to="/blog/geo-ai-tarnovo" className="p-4 rounded-xl border border-[#1C1C1E]/8 bg-white hover:border-[#0A2540]/15 transition-all cursor-pointer group">
              <div className="text-sm font-medium text-[#1C1C1E] group-hover:text-[#0A2540] transition-colors mb-1">GEO оптимизация — ChatGPT и AI търсачки</div>
              <div className="text-xs text-[#1C1C1E]/65">7 мин. четене</div>
            </Link>
            <Link to="/blog/izrabotka-na-sait-vt" className="p-4 rounded-xl border border-[#1C1C1E]/8 bg-white hover:border-[#0A2540]/15 transition-all cursor-pointer group">
              <div className="text-sm font-medium text-[#1C1C1E] group-hover:text-[#0A2540] transition-colors mb-1">Изработка на сайт Велико Търново</div>
              <div className="text-xs text-[#1C1C1E]/65">6 мин. четене</div>
            </Link>
            <Link to="/digitalen-marketing-veliko-tarnovo" className="p-4 rounded-xl border border-[#1C1C1E]/8 bg-white hover:border-[#0A2540]/15 transition-all cursor-pointer group">
              <div className="text-sm font-medium text-[#1C1C1E] group-hover:text-[#0A2540] transition-colors mb-1">Дигитален маркетинг Велико Търново</div>
              <div className="text-xs text-[#1C1C1E]/65">Услуга · ТАВОРА ЕООД</div>
            </Link>
          </div>
        </div>
      </main>

      <SharedFooter />
    </div>
  );
}
