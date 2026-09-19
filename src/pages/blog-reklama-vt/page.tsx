import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SharedNav from '@/components/feature/SharedNav';
import SharedFooter from '@/components/feature/SharedFooter';

const ARTICLE_SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      '@id': 'https://imashnujnoto.com/blog-reklama-vt#article',
      headline: 'Как да рекламирам бизнеса си във Велико Търново — пълно ръководство 2026',
      description: 'Практическо ръководство за реклама на бизнес в Търново — Meta, Google, TikTok, SEO и видео. Реални примери от ТАВОРА ЕООД.',
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
      url: 'https://imashnujnoto.com/blog-reklama-vt',
      wordCount: 1800,
      timeRequired: 'PT8M',
      image: {
        '@type': 'ImageObject',
        url: 'https://readdy.ai/api/search-image?query=professional%20digital%20marketing%20agency%20office%20Veliko%20Tarnovo%20Bulgaria%20modern%20workspace%20with%20computers%20and%20screens%20showing%20analytics%20dashboards%20clean%20minimal%20aesthetic&width=1200&height=630&seq=blog-reklama-vt-hero&orientation=landscape',
        width: 1200,
        height: 630,
      },
      mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://imashnujnoto.com/blog-reklama-vt' },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Начало', item: 'https://imashnujnoto.com/' },
          { '@type': 'ListItem', position: 2, name: 'Блог', item: 'https://imashnujnoto.com/blog' },
          { '@type': 'ListItem', position: 3, name: 'Реклама Велико Търново', item: 'https://imashnujnoto.com/blog-reklama-vt' },
        ],
      },
      keywords: 'реклама Велико Търново, дигитален маркетинг Търново, Meta реклами, Google Ads Търново, маркетинг агенция Търново',
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Колко струва рекламата за малък бизнес в Търново?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Рекламните кампании в Meta и Google започват от 290 € на месец. Консултацията е 50 € и включва анализ и стратегия — тази сума се приспада при сключване на договор.',
          },
        },
        {
          '@type': 'Question',
          name: 'Коя платформа е най-добра за реклама в Търново?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Зависи от бизнеса. За ресторанти и услуги — Meta (Facebook/Instagram). За търсене на конкретен продукт — Google. За млада аудитория — TikTok. Комбинацията дава най-добри резултати.',
          },
        },
        {
          '@type': 'Question',
          name: 'Колко бързо ще видя резултати от рекламата в Търново?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'При платени кампании резултатите са видими в рамките на 1-2 седмици. Оптимизацията и мащабирането стават след 30-60 дни, когато алгоритмите са научили аудиторията.',
          },
        },
        {
          '@type': 'Question',
          name: 'Каква е разликата между SEO и платена реклама за бизнес в Търново?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Платената реклама дава незабавни резултати, но спира когато спрете да плащате. SEO е дългосрочна инвестиция — веднъж постигнати позиции, те работят без допълнителни разходи. Комбинацията от двете е оптималната стратегия за бизнеси в Търново.',
          },
        },
      ],
    },
  ],
};

const sections = [
  {
    id: 'zashto',
    title: 'Защо рекламата е важна за бизнеса в Търново?',
    content: `Велико Търново е град с нарастваща конкуренция в дигиталното пространство. Ресторанти, хотели, магазини, счетоводители, адвокати — всички се борят за вниманието на едни и същи клиенти.

Проблемът е, че повечето бизнеси в Търново все още разчитат на "от уста на уста" и случайни клиенти. Докато конкурентите им вече са в Google, Facebook и TikTok.

Добрата новина: местният пазар в Търново все още не е наситен. Ако влезете сега — имате реален шанс да доминирате. Дигиталният маркетинг в Търново е инвестиция, не разход.`,
  },
  {
    id: 'platformi',
    title: 'Кои платформи работят за Търново?',
    content: `**Meta (Facebook + Instagram)** — Най-ефективна за местни бизнеси. Таргетирате хора в радиус от 10-20 км от Търново. Идеална за ресторанти, салони, магазини, услуги.

**Google Ads** — Когато някой търси "счетоводител Велико Търново" или "хотел Търново" — вие трябва да сте на първо място. Висока конверсия, защото хората вече търсят.

**TikTok** — За бизнеси, насочени към по-млада аудитория (18-35 г.). Органичното съдържание може да достигне хиляди хора безплатно.

**YouTube** — За по-дълги видео реклами и бранд awareness. Идеален за хотели, туристически обекти, образователни услуги.`,
  },
  {
    id: 'strategiya',
    title: 'Стратегия за реклама в Търново — стъпка по стъпка',
    content: `**Стъпка 1: Дефинирайте целевата аудитория**
Кой е вашият идеален клиент? Жители на Търново? Туристи? Бизнеси? Колко са на възраст? Какви са интересите им?

**Стъпка 2: Изберете платформата**
Не трябва да сте навсякъде едновременно. Започнете с една платформа, научете я, после разширете.

**Стъпка 3: Създайте качествено съдържание**
Снимки и видеа от реалния ви бизнес работят по-добре от стокови снимки. Хората в Търново искат да видят реалното място.

**Стъпка 4: Задайте бюджет**
Минималният ефективен бюджет за Meta е около 15-20 € на ден. За Google — зависи от конкуренцията за ключовите думи.

**Стъпка 5: Измервайте и оптимизирайте**
Следете кои реклами работят, кои не. Спирайте неефективните, мащабирайте успешните.`,
  },
  {
    id: 'primeri',
    title: 'Реални примери от Търново',
    content: `**K-Food Велико Търново** — Корейски ресторант в Търново. Комбинация от SEO + GEO + реклами. Резултат: #1 в Google и ChatGPT за "корейска храна велико търново". Проверете сами на k-foodvelikotarnovo.com.

**Sunrise Food** — Онлайн магазин за гъби кладница. SEO + реклами. Резултат: #1 в Google за "гъби кладница онлайн" за 3-4 седмици. Проверете на sunrisefood.eu.

Тези резултати не са случайни — те са следствие от правилна стратегия, качествено съдържание и последователна оптимизация.`,
  },
  {
    id: 'greshki',
    title: 'Най-честите грешки при реклама в Търново',
    content: `**Грешка 1: Таргетиране на цяла България**
Ако имате физически магазин в Търново, рекламирайте само на хора в Търново и областта. Не харчете бюджет за хора от Варна или Пловдив.

**Грешка 2: Лошо качество на снимките**
Размазани снимки с телефон от 2015 г. не продават. Инвестирайте в качествени снимки или видео.

**Грешка 3: Без призив за действие**
"Елате при нас" не е достатъчно. "Резервирайте маса сега — само 3 свободни за уикенда" работи много по-добре.

**Грешка 4: Спиране на рекламата след 3 дни**
Алгоритмите се нуждаят от 7-14 дни, за да научат аудиторията. Не спирайте прибързано.

**Грешка 5: Без проследяване на резултатите**
Ако не знаете колко клиенти идват от рекламата, не можете да я оптимизирате.`,
  },
  {
    id: 'seo-vs-reklama',
    title: 'SEO или платена реклама — кое е по-добро за Търново?',
    content: `Честният отговор: и двете. Но по различен начин.

**Платената реклама** дава незабавни резултати. Пускате кампания днес — клиенти идват утре. Но когато спрете да плащате, спират и клиентите.

**SEO оптимизацията** е дългосрочна инвестиция. Отнема 2-3 месеца, но след това работи без допълнителни разходи. K-Food Велико Търново е #1 в Google без да плаща за реклами.

**Оптималната стратегия за бизнес в Търново:** Започнете с платена реклама за бързи резултати, паралелно инвестирайте в SEO за дългосрочен ефект. След 6 месеца SEO-то ще намали нуждата от платена реклама.`,
  },
  {
    id: 'konsultaciya',
    title: 'Как да започнете?',
    content: `Ако искате да рекламирате бизнеса си в Търново, но не знаете откъде да започнете — консултацията с ТАВОРА ЕООД е 50 €.

Тя включва:
- Анализ на вашия бизнес и конкурентите
- Препоръка за платформи и бюджет
- Конкретен план за действие

Тази сума се приспада от цената на услугата при сключване на договор. Всяка услуга идва с гаранция за връщане на парите.

Консултацията не е разговор — тя е реална работа с реален изход.`,
  },
];

export default function BlogReklamaVTPage() {
  useEffect(() => {
    const id = 'schema-blog-reklama';
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement('script');
      el.id = id;
      el.type = 'application/ld+json';
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(ARTICLE_SCHEMA);

    document.title = 'Как да рекламирам бизнеса си във Велико Търново — пълно ръководство 2026 | ТАВОРА ЕООД';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Практическо ръководство за реклама на бизнес в Търново — Meta, Google, TikTok, SEO и видео. Реални примери, цени и стратегии от ТАВОРА ЕООД.');
    }
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://imashnujnoto.com/blog-reklama-vt');

    return () => {
      const existing = document.getElementById(id);
      if (existing) existing.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <SharedNav />

      <div className="w-full h-[280px] md:h-[420px] overflow-hidden relative">
        <img
          src="https://readdy.ai/api/search-image?query=professional%20digital%20marketing%20agency%20office%20Veliko%20Tarnovo%20Bulgaria%20modern%20workspace%20with%20computers%20and%20screens%20showing%20analytics%20dashboards%20clean%20minimal%20aesthetic&width=1200&height=630&seq=blog-reklama-vt-hero&orientation=landscape"
          alt="Реклама за бизнеси в Търново — ТАВОРА ЕООД"
          title="Реклама Велико Търново"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
        <div className="absolute bottom-6 left-4 md:left-16">
          <span className="text-xs text-white/60 tracking-widest uppercase">Блог · ТАВОРА ЕООД</span>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 md:px-8 py-12 md:py-20">
        <nav aria-label="breadcrumb" className="flex items-center gap-2 mb-8 text-xs text-[#1C1C1E]/65">
          <Link to="/" className="hover:text-[#0A2540] transition-colors">Начало</Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-[#0A2540] transition-colors">Блог</Link>
          <span>/</span>
          <span className="text-[#1C1C1E]/65">Реклама Велико Търново</span>
        </nav>

        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-[1px] bg-[#0A2540]/30 shrink-0" />
            <span className="text-xs text-[#1C1C1E]/60">Реклама · Велико Търново</span>
          </div>
          <h1
            className="text-3xl md:text-5xl font-light text-[#1C1C1E] leading-tight mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Как да рекламирам бизнеса си
            <br />
            <span className="italic text-[#0A2540]">във Велико Търново?</span>
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#1C1C1E]/65">
            <span>Владимир Атанасов · ТАВОРА ЕООД</span>
            <span>·</span>
            <span>24 Април 2026</span>
            <span>·</span>
            <span>8 мин. четене</span>
            <span>·</span>
            <span className="px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 text-[10px] font-medium">Реклама</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-[#1C1C1E]/8 bg-[#F9F9F9] mb-10">
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
          Имате бизнес в Търново и искате повече клиенти? Това ръководство ще ви покаже точно как да рекламирате — кои платформи, какъв бюджет, какви грешки да избягвате. Без теория. Само практика.
        </p>

        <article className="space-y-12">
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

        <div className="mt-14 p-6 md:p-8 rounded-2xl bg-[#0F1F35]">
          <div className="text-xs text-white/75 tracking-widest uppercase mb-3">Следваща стъпка</div>
          <div className="text-xl md:text-2xl font-light text-white mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Готови ли сте да рекламирате в Търново?
          </div>
          <p className="text-sm text-white/75 mb-5 leading-relaxed">
            Консултацията е 50 € — анализ, стратегия и план. Сумата се приспада при договор. Гаранция за връщане на парите.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/kontakt" className="px-7 py-3.5 bg-white text-[#0F1F35] text-sm rounded-full hover:bg-white/90 transition-all cursor-pointer whitespace-nowrap text-center font-medium">
              Поискайте консултация →
            </Link>
            <Link to="/reklama-veliko-tarnovo" className="px-7 py-3.5 border border-white/20 text-white/70 text-sm rounded-full hover:border-white/40 hover:text-white transition-all cursor-pointer whitespace-nowrap text-center">
              Вижте услугите →
            </Link>
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
              <div className="text-sm font-medium text-[#1C1C1E] group-hover:text-[#0A2540] transition-colors mb-1">GEO оптимизация — как да сте #1 в ChatGPT</div>
              <div className="text-xs text-[#1C1C1E]/65">7 мин. четене</div>
            </Link>
            <Link to="/blog/google-business-vt" className="p-4 rounded-xl border border-[#1C1C1E]/8 bg-white hover:border-[#0A2540]/15 transition-all cursor-pointer group">
              <div className="text-sm font-medium text-[#1C1C1E] group-hover:text-[#0A2540] transition-colors mb-1">Google Business Profile за бизнеси в Търново</div>
              <div className="text-xs text-[#1C1C1E]/65">5 мин. четене</div>
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
