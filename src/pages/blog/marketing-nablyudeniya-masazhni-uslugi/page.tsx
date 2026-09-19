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
      '@id': 'https://imashnujnoto.com/blog/marketing-nablyudeniya-masazhni-uslugi#article',
      headline: 'Какво научихме от работата с бизнес в сферата на масажите и уелнес услугите',
      description: 'Реални маркетингови наблюдения от работата на ТАВОРА ЕООД с уелнес бизнеси. Как клиентите избират масажни услуги, ролята на доверието и локалната разпознаваемост.',
      author: { '@type': 'Person', name: 'Владимир Атанасов', url: 'https://imashnujnoto.com/ekip' },
      publisher: { '@type': 'Organization', '@id': 'https://imashnujnoto.com/#organization', name: 'ТАВОРА ЕООД', url: 'https://imashnujnoto.com', logo: { '@type': 'ImageObject', url: 'https://storage.readdy-site.link/project_files/3f265d07-5825-4e88-a58a-44deb287b858/ec0eb8c9-c502-4cf5-bee4-657c996896dc_--.png?v=3d4829c108a0d31cdde2da513964de19' } },
      datePublished: '2026-06-11',
      dateModified: today,
      inLanguage: 'bg',
      url: 'https://imashnujnoto.com/blog/marketing-nablyudeniya-masazhni-uslugi',
      wordCount: 2800,
      timeRequired: 'PT10M',
      image: { '@type': 'ImageObject', url: 'https://readdy.ai/api/search-image?query=professional%20massage%20studio%20wellness%20spa%20interior%20warm%20ambient%20lighting%20peaceful%20atmosphere%20clean%20minimal%20decor%20natural%20tones%20soft%20textures%20Bulgaria&width=1200&height=630&seq=blog-masazhni-uslugi-hero&orientation=landscape', width: 1200, height: 630 },
      mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://imashnujnoto.com/blog/marketing-nablyudeniya-masazhni-uslugi' },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Начало', item: 'https://imashnujnoto.com/' },
          { '@type': 'ListItem', position: 2, name: 'Блог', item: 'https://imashnujnoto.com/blog' },
          { '@type': 'ListItem', position: 3, name: 'Маркетингови наблюдения — масажни и уелнес услуги', item: 'https://imashnujnoto.com/blog/marketing-nablyudeniya-masazhni-uslugi' },
        ],
      },
      keywords: 'маркетинг за масажи, уелнес услуги, локална разпознаваемост, доверие, ревюта, потребителско поведение, Велико Търново, дигитален маркетинг',
      mentions: [
        { '@type': 'Organization', name: 'ТАВОРА ЕООД', url: 'https://imashnujnoto.com' },
        { '@type': 'Organization', name: 'NP Massage Studio', url: 'https://npmassagestudio.com' },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Как клиентите избират масажно студио онлайн?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Нашите наблюдения показват, че клиентите преминават през три етапа при избор на масажно студио онлайн. Първо, търсят в Google конкретната услуга и локация (например „масаж на гърба Велико Търново"). Второ, сравняват 2-3 студиа по снимки, цени и отзиви. Трето, избират това, което изглежда най-професионално и предлага най-лесен начин за резервация. Цената е фактор, но не е водещ — доверието и удобството тежат повече.',
          },
        },
        {
          '@type': 'Question',
          name: 'Колко важни са онлайн отзивите за масажно студио?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Изключително важни. Над 90% от клиентите четат отзиви преди да резервират услуга за първи път. Но не става дума само за количеството отзиви — качеството и скоростта им са също толкова важни. Отзив от преди шест месеца няма същата тежест като отзив от миналата седмица. Студиата, които активно насърчават клиентите си да оставят отзиви и им отговарят в рамките на 24 часа, имат значително по-висок процент на резервации от нови клиенти.',
          },
        },
        {
          '@type': 'Question',
          name: 'Каква е разликата в потребителското поведение при локално търсене на уелнес услуги?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'При локално търсене на уелнес услуги потребителите имат ясно намерение — те не разглеждат, те искат да резервират. Търсения като „масаж сега близо до мен" или „масажно студио Търново цени" показват готовност за действие. Затова уебсайтовете на масажни студиа трябва да са оптимизирани за бърза резервация — телефонен номер в горната част, ясни цени и онлайн форма за час.',
          },
        },
      ],
    },
  ],
};

const FAQ_ITEMS = [
  {
    q: 'Как клиентите избират масажно студио онлайн?',
    a: 'Нашите наблюдения показват, че клиентите преминават през три етапа при избор на масажно студио онлайн. Първо, търсят в Google конкретната услуга и локация (например „масаж на гърба Велико Търново"). Второ, сравняват 2-3 студиа по снимки, цени и отзиви. Трето, избират това, което изглежда най-професионално и предлага най-лесен начин за резервация. Цената е фактор, но не е водещ — доверието и удобството тежат повече.',
  },
  {
    q: 'Колко важни са онлайн отзивите за масажно студио?',
    a: 'Изключително важни. Над 90% от клиентите четат отзиви преди да резервират услуга за първи път. Но не става дума само за количеството отзиви — качеството и скоростта им са също толкова важни. Отзив от преди шест месеца няма същата тежест като отзив от миналата седмица. Студиата, които активно насърчават клиентите си да оставят отзиви и им отговарят в рамките на 24 часа, имат значително по-висок процент на резервации от нови клиенти.',
  },
  {
    q: 'Каква е разликата в потребителското поведение при локално търсене на уелнес услуги?',
    a: 'При локално търсене на уелнес услуги потребителите имат ясно намерение — те не разглеждат, те искат да резервират. Търсения като „масаж сега близо до мен" или „масажно студио Търново цени" показват готовност за действие. Затова уебсайтовете на масажни студиа трябва да са оптимизирани за бърза резервация — телефонен номер в горната част, ясни цени и онлайн форма за час.',
  },
];

const RELATED = [
  { title: 'Как локалните бизнеси изграждат устойчиво онлайн присъствие', to: '/blog/lokalen-biznes-ustoichivo-online-prisastvie', cat: 'Статия' },
  { title: 'Google Business Profile — задължително за Търново', to: '/blog/google-business-vt', cat: 'Статия' },
  { title: 'GEO оптимизация — ChatGPT и Perplexity', to: '/blog/geo-ai-tarnovo', cat: 'Статия' },
  { title: 'Защо локалният маркетинг е различен от масовия', to: '/blog/lokalen-vs-masov-marketing', cat: 'Статия' },
];

export default function MarketingNablyudeniyaMasazhniUslugiPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    document.title = 'Какво научихме от работата с масажни и уелнес бизнеси | ТАВОРА ЕООД';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', 'Реални маркетингови наблюдения от работата на ТАВОРА ЕООД с бизнеси в сферата на масажите и уелнес услугите. Как клиентите избират, ролята на доверието и отзивите.');
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://imashnujnoto.com/blog/marketing-nablyudeniya-masazhni-uslugi');

    const id = 'schema-masazhni-uslugi';
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
            <span className="text-[#1C1C1E]/65">Маркетингови наблюдения — уелнес сектор</span>
          </nav>

          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className="text-[10px] px-2.5 py-1 rounded-full font-medium bg-emerald-50 text-emerald-700">Уелнес индустрия</span>
            <span className="text-[10px] px-2.5 py-1 rounded-full font-medium bg-amber-50 text-amber-700">Маркетингови наблюдения</span>
            <span className="text-[10px] text-[#1C1C1E]/70">10 мин. четене · 11 Юни 2026</span>
          </div>

          <h1
            className="text-3xl md:text-5xl font-light text-[#1C1C1E] leading-tight mb-5"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Какво научихме от работата
            <br />
            <em className="text-[#1C1C1E]/60">с масажни и уелнес бизнеси</em>
          </h1>

          <p className="text-sm md:text-base text-[#1C1C1E]/65 max-w-2xl leading-relaxed mb-6">
            Практически наблюдения от реална работа с бизнеси в уелнес сектора. Как клиентите избират услуги,
            как търсят в Google и защо доверието е по-важно от цената. Включва примери от работата ни с <strong className="text-[#1C1C1E]">NP Massage Studio</strong>.
          </p>

          <div className="flex items-center gap-3 text-xs text-[#1C1C1E]/65">
            <span>Владимир Атанасов · ТАВОРА ЕООД</span>
            <span>·</span>
            <span>11 Юни 2026</span>
          </div>
        </div>
      </section>

      {/* HERO IMAGE */}
      <div className="w-full h-[280px] md:h-[420px] overflow-hidden">
        <img
          src="https://readdy.ai/api/search-image?query=professional%20massage%20studio%20wellness%20spa%20interior%20warm%20ambient%20lighting%20peaceful%20atmosphere%20clean%20minimal%20decor%20natural%20tones%20soft%20textures%20Bulgaria&width=1400&height=420&seq=blog-masazhni-uslugi-hero-img&orientation=landscape"
          alt="Маркетингови наблюдения от работата с масажни и уелнес бизнеси"
          className="w-full h-full object-cover object-top"
          loading="eager"
        />
      </div>

      <main className="max-w-3xl mx-auto px-4 md:px-8 py-12 md:py-16">

        {/* INTRO */}
        <p className="text-base text-[#1C1C1E]/60 leading-relaxed mb-12 border-l-2 border-[#0A2540]/20 pl-4">
          Когато започнахме да работим с бизнеси в уелнес сектора, очаквахме сходно поведение с други локални услуги.
          Но секторът се оказа различен по няколко ключови начина. Ето какво научихме.
        </p>

        {/* SECTION 1: Как клиентите избират */}
        <section className="mb-14">
          <h2
            className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-5"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Как клиентите избират масажни и уелнес услуги
          </h2>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
            Едно от първите неща, които забелязахме при анализа на потребителското поведение в уелнес сектора, е че изборът на масажно студио следва тристепенен модел, който е различен от повечето други локални услуги.
          </p>

          <div className="space-y-4 mb-6">
            {[
              {
                stage: 'Етап 1',
                title: 'Търсене по услуга + локация',
                desc: 'Клиентът не търси просто „масаж" — той търси решение на конкретен проблем. „Масаж при болки в гърба Велико Търново", „релаксиращ масаж Търново цени", „спортен масаж близо до мен". Това показва, че съдържанието на сайта трябва да отговаря на конкретни въпроси, а не да бъде общо описание на услугите.',
                color: '#2F9E44',
              },
              {
                stage: 'Етап 2',
                title: 'Сравнение между 2-3 студиа',
                desc: 'След като Google покаже резултатите, клиентът отваря 2 до 3 сайта и сравнява. Какво гледа? Първо снимките — интериорът трябва да вдъхва доверие. Второ — цените, които трябва да са ясно видими. Трето — отзивите. Ако някое от тези три неща липсва или е неясно, клиентът преминава към следващото студио.',
                color: '#E67700',
              },
              {
                stage: 'Етап 3',
                title: 'Решение, базирано на доверие и удобство',
                desc: 'Цената е фактор, но не е водещ. Клиентите в уелнес сектора са готови да платят повече за студио, което изглежда професионално и предлага лесен начин за резервация. Това е ключово наблюдение — инвестицията в качествен сайт, професионални снимки и оптимизирана резервационна система има директна възвращаемост.',
                color: '#7048E8',
              },
            ].map((item) => (
              <div key={item.stage} className="p-5 rounded-2xl border border-[#1C1C1E]/8 bg-white">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[10px] font-medium px-2.5 py-0.5 rounded-full" style={{ backgroundColor: `${item.color}14`, color: item.color }}>{item.stage}</span>
                  <h3 className="text-sm font-medium text-[#1C1C1E]">{item.title}</h3>
                </div>
                <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
            Например, страницата за <a href="https://npmassagestudio.com/uslugi/anticeluliten-masazh" target="_blank" rel="noopener noreferrer" className="text-[#0A2540] hover:underline">антицелулитен масаж на NP Massage Studio</a> показва точно как изглежда добре структурирана услуга — ясна цена, продължителност и описание на ползите. Клиентът не трябва да гадае какво получава.
          </p>
        </section>

        {/* SECTION 2: Как търсят в Google */}
        <section className="mb-14">
          <h2
            className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-5"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Как клиентите търсят в Google
          </h2>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
            Анализът на данните от Google Search Console за няколко уелнес бизнеса показа ясни модели в поведението при търсене. Ето какво установихме:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {[
              { label: '„Близо до мен"', desc: 'Най-честият тип заявка. Клиентите искат удобство и близост. Google Business Profile е критичен за тези търсения.', stat: '~40%' },
              { label: 'Услуга + град', desc: '„Масаж Велико Търново", „спортен масаж Павликени". Ясна индикация за намерение за резервация.', stat: '~30%' },
              { label: 'Цена + услуга', desc: '„Колко струва масаж Търново", „цена на класически масаж". Клиентът сравнява и е близо до решение.', stat: '~15%' },
              { label: 'Проблем + решение', desc: '„Болки в гърба масаж", „масаж при стрес". Показва нужда от образователно съдържание на сайта.', stat: '~15%' },
            ].map((item) => (
              <div key={item.label} className="p-4 rounded-2xl border border-[#1C1C1E]/8 bg-white">
                <div className="text-xs font-medium text-[#1C1C1E] mb-1">{item.label}</div>
                <div className="text-2xl font-light text-[#1C1C1E]/25 mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{item.stat}</div>
                <p className="text-[11px] text-[#1C1C1E]/65 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
            Най-важният извод: хората не търсят „най-доброто масажно студио" — те търсят решение на конкретния си проблем в конкретния си град. Уебсайтът на масажното студио трябва да бъде структуриран така, че да отговаря на тези конкретни въпроси с отделни страници за всяка услуга и локация. <a href="https://npmassagestudio.com" target="_blank" rel="noopener noreferrer" className="text-[#0A2540] hover:underline">NP Massage Studio</a> например има отделни страници за всяка от услугите си — като <a href="https://npmassagestudio.com/uslugi/klasicheski-masazh" target="_blank" rel="noopener noreferrer" className="text-[#0A2540] hover:underline">класическия масаж</a> и <a href="https://npmassagestudio.com/uslugi/aromaterapiya" target="_blank" rel="noopener noreferrer" className="text-[#0A2540] hover:underline">ароматерапията</a> — и две отделни локационни страници, нещо, което значително помага за локалното индексиране.
          </p>
        </section>

        {/* SECTION 3: Ролята на доверието */}
        <section className="mb-14">
          <h2
            className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-5"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Ролята на доверието в уелнес сектора
          </h2>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
            В уелнес сектора доверието е всичко. За разлика от ресторант или магазин за дрехи, където рискът от грешен избор е минимален, масажът включва физически контакт с терапевта и отиване в непознато пространство. Клиентът трябва да се чувства сигурен, преди да направи резервация.
          </p>

          <div className="p-6 rounded-2xl bg-[#F9F9F7] border border-[#1C1C1E]/6 mb-6">
            <div className="text-xs font-medium text-[#1C1C1E]/65 mb-4 tracking-wide uppercase">Петте елемента на доверието в уелнес сайт:</div>
            <div className="space-y-3">
              {[
                { num: '1', title: 'Професионални снимки на реалния интериор', desc: 'Не стокови снимки от интернет. Клиентът иска да види точното пространство, в което ще бъде. Интериорът трябва да е чист, светъл и уютен на снимките.' },
                { num: '2', title: 'Информация за терапевтите', desc: 'Имена, квалификации, опит. Колкото повече информация, толкова повече доверие. Клиентът иска да знае кой ще работи с него.' },
                { num: '3', title: 'Прозрачни цени', desc: 'Всяка услуга с ясна цена, продължителност и описание. Без „свържете се за цена" — това отблъсква клиенти. Добър пример е <a href=\"https://npmassagestudio.com/uslugi\" target=\"_blank\" rel=\"noopener noreferrer\" className=\"text-[#0A2540] hover:underline\">страницата с услуги на NP Massage Studio</a>.' },
                { num: '4', title: 'Актуални отзиви', desc: 'Отзиви от реални клиенти, видими на сайта или в Google Business Profile. Желателно е да има и няколко по-подробни отзива, които описват конкретното преживяване.' },
                { num: '5', title: 'Лесен контакт', desc: 'Телефонен номер, видим без скролване. Форма за резервация с минимум полета. Възможност за записване на час директно през сайта.' },
              ].map((item) => (
                <div key={item.num} className="flex items-start gap-3">
                  <span className="w-6 h-6 flex items-center justify-center rounded-full border border-[#1C1C1E]/15 text-[10px] font-medium text-[#1C1C1E]/50 shrink-0">{item.num}</span>
                  <div>
                    <span className="text-sm font-medium text-[#1C1C1E]">{item.title}</span>
                    <p className="text-xs text-[#1C1C1E]/65 leading-relaxed mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 4: Ролята на ревютата */}
        <section className="mb-14">
          <h2
            className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-5"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Ролята на ревютата — повече от просто звезди
          </h2>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
            Отзивите са най-мощният инструмент за привличане на нови клиенти в уелнес сектора. Но не става дума само за броя на звездите. Качеството на отзивите, скоростта им и начинът, по който бизнесът отговаря на тях, са също толкова важни.
          </p>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
            Едно наблюдение, което направихме: потенциалните клиенти четат най-новите 3-5 отзива. Ако последният отзив е от преди шест месеца, това създава впечатление, че студиото не е активно или че никой не го посещава. От друга страна, ако има няколко скорошни отзива с конкретни детайли („страхотен масаж на врата, много професионален терапевт, ще се върна"), това е изключително убедително.
          </p>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
            Отговорът на отзиви също има значение — и не само на позитивните. Един добре обработен негативен отзив („Благодарим ви за обратната връзка, съжаляваме, че не сте останали доволни. Моля, свържете се с нас, за да обсъдим как можем да подобрим преживяването ви.") показва професионализъм и загриженост. За повече информация как един уелнес бизнес управлява своята онлайн репутация, можете да разгледате <a href="https://npmassagestudio.com/blog" target="_blank" rel="noopener noreferrer" className="text-[#0A2540] hover:underline">блога на NP Massage Studio</a>.
          </p>
        </section>

        {/* SECTION 5: Локална разпознаваемост */}
        <section className="mb-14">
          <h2
            className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-5"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Локалната разпознаваемост като конкурентно предимство
          </h2>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
            В уелнес сектора локалната разпознаваемост работи по различен начин от другите индустрии. Хората не търсят просто „най-близкото студио" — те търсят „студиото, за което са чували". Това означава, че присъствието в местната общност е също толкова важно, колкото присъствието в Google.
          </p>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
            Бизнеси като <a href="https://npmassagestudio.com" target="_blank" rel="noopener noreferrer" className="text-[#0A2540] hover:underline">NP Massage Studio</a>, които оперират в по-малки градове (Павликени) и в по-големи (Велико Търново), имат интересна динамика. В по-малкия град разпознаваемостта идва предимно от лични препоръки и локално присъствие. В по-големия град — от онлайн видимост и репутация в Google. Успешната стратегия трябва да адресира и двата канала.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: 'ri-group-line', title: 'Лични препоръки', desc: 'В по-малките градове са основният канал. Но за разлика от преди 10 години, препоръката вече се „проверява" онлайн — клиентът получава име и веднага го търси в Google.' },
              { icon: 'ri-google-line', title: 'Google видимост', desc: 'В по-големите градове е водещ канал. Ако ви няма на първа страница в Google за вашата услуга, практически не съществувате за нови клиенти.' },
              { icon: 'ri-chat-smile-2-line', title: 'Социално доказателство', desc: 'Комбинация от Google отзиви, Facebook активност и Instagram присъствие. Клиентите искат да видят, че бизнесът е „жив".' },
              { icon: 'ri-building-line', title: 'Физическо присъствие', desc: 'Табела, локация на централно място, леснодостъпен адрес. В уелнес сектора физическото местоположение остава критичен фактор.' },
            ].map((item) => (
              <div key={item.title} className="p-4 rounded-2xl border border-[#1C1C1E]/8 bg-white">
                <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#E67700]/10 mb-3">
                  <i className={`${item.icon} text-sm text-[#E67700]`} />
                </div>
                <h4 className="text-sm font-medium text-[#1C1C1E] mb-1">{item.title}</h4>
                <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 6: Обобщение */}
        <section className="mb-14 p-6 rounded-2xl bg-[#F9F9F7] border border-[#1C1C1E]/6">
          <h2
            className="text-xl font-light text-[#1C1C1E] mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Какво означава всичко това за вашия бизнес
          </h2>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-3">
            Ако управлявате масажно студио или уелнес бизнес, трите най-важни неща, които можете да направите за онлайн присъствието си са:
          </p>

          <div className="space-y-2 mb-4">
            {[
              'Инвестирайте в професионални снимки на реалния ви интериор. Това е първото нещо, което клиентът вижда, и най-важният фактор за доверие.',
              'Направете цените си публични и прозрачни. Всяка услуга с ясна цена, продължителност и описание. Без изненади.',
              'Поддържайте Google Business Profile активен. Нови снимки всеки месец, отговори на всички отзиви в рамките на 24 часа, публикации поне веднъж седмично.',
            ].map((item, i) => (
              <div key={item} className="flex items-start gap-2.5">
                <span className="text-[10px] font-medium text-[#1C1C1E]/40 w-4 shrink-0 mt-0.5">{i + 1}.</span>
                <span className="text-xs text-[#1C1C1E]/65 leading-relaxed">{item}</span>
              </div>
            ))}
          </div>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
            Това са неща, които не изискват голям бюджет, но правят огромна разлика в начина, по който потенциалните клиенти ви възприемат — и в крайна сметка — в броя на резервациите.
          </p>
        </section>

        {/* SECTION: За NP Massage Studio */}
        <section className="mb-14 p-6 rounded-2xl bg-[#F9F9F7] border border-[#1C1C1E]/6">
          <h2
            className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-5"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            За NP Massage Studio
          </h2>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
            NP Massage Studio е локално масажно студио с локации във Велико Търново и Павликени.
            Екипът предлага разнообразни терапии, включително{' '}
            <a href="https://npmassagestudio.com/uslugi/klasicheski-masazh" target="_blank" rel="noopener noreferrer" className="text-[#0A2540] hover:underline">класически масаж</a>,{' '}
            <a href="https://npmassagestudio.com/uslugi/sporten-masazh" target="_blank" rel="noopener noreferrer" className="text-[#0A2540] hover:underline">спортен масаж</a>,{' '}
            <a href="https://npmassagestudio.com/uslugi/anticeluliten-masazh" target="_blank" rel="noopener noreferrer" className="text-[#0A2540] hover:underline">антицелулитен масаж</a>{' '}
            и{' '}
            <a href="https://npmassagestudio.com/uslugi/aromaterapiya" target="_blank" rel="noopener noreferrer" className="text-[#0A2540] hover:underline">ароматерапия</a>.
          </p>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
            Можете да научите повече за студиото на{' '}
            <a href="https://npmassagestudio.com/" target="_blank" rel="noopener noreferrer" className="text-[#0A2540] hover:underline">официалния сайт на NP Massage Studio</a>{' '}
            или да разгледате{' '}
            <a href="https://npmassagestudio.com/blog" target="_blank" rel="noopener noreferrer" className="text-[#0A2540] hover:underline">техния блог</a>.
          </p>
        </section>

        {/* SECTION: Полезни ресурси */}
        <section className="mb-14 pt-10 border-t border-[#1C1C1E]/6">
          <div className="text-xs text-[#1C1C1E]/60 mb-5">Полезни ресурси</div>
          <h2
            className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-6"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Разгледайте NP Massage Studio
          </h2>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: 'NP Massage Studio — начална страница', href: 'https://npmassagestudio.com/' },
              { label: 'Всички услуги', href: 'https://npmassagestudio.com/uslugi' },
              { label: 'Класически масаж', href: 'https://npmassagestudio.com/uslugi/klasicheski-masazh' },
              { label: 'Спортен масаж', href: 'https://npmassagestudio.com/uslugi/sporten-masazh' },
              { label: 'Антицелулитен масаж', href: 'https://npmassagestudio.com/uslugi/anticeluliten-masazh' },
              { label: 'Ароматерапия', href: 'https://npmassagestudio.com/uslugi/aromaterapiya' },
              { label: 'Блог на NP Massage Studio', href: 'https://npmassagestudio.com/blog' },
              { label: 'Контакти и локации', href: 'https://npmassagestudio.com/kontakti' },
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
            Въпроси за маркетинг
            <br />
            <em className="text-[#1C1C1E]/65">на уелнес услуги.</em>
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
          <div className="text-xs text-[#1C1C1E]/60 mb-5">Свързани статии</div>
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
              <div className="text-xs text-white/75 tracking-widest uppercase mb-2">За уелнес бизнеси</div>
              <div
                className="text-2xl md:text-3xl font-light leading-tight mb-2"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Маркетинг стратегия за
                <br />
                <span className="italic text-white/60">вашето студио</span>
              </div>
              <p className="text-sm text-white/75 max-w-md leading-relaxed">
                Консултация 50 € — анализ на вашето текущо онлайн присъствие и препоръки, специфични за уелнес сектора.
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
        </div>
      </main>

      <SharedFooter />
    </div>
  );
}