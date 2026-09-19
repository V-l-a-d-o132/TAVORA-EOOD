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
      '@id': 'https://imashnujnoto.com/blog/lokalen-biznes-ustoichivo-online-prisastvie#article',
      headline: 'Как локалните бизнеси могат да изградят устойчиво онлайн присъствие: пример от уелнес индустрията',
      description: 'Практическо ръководство за изграждане на устойчиво онлайн присъствие за локален бизнес. Реален пример от работата ни с NP Massage Studio в уелнес сектора.',
      author: { '@type': 'Person', name: 'Владимир Атанасов', url: 'https://imashnujnoto.com/ekip' },
      publisher: { '@type': 'Organization', '@id': 'https://imashnujnoto.com/#organization', name: 'ТАВОРА ЕООД', url: 'https://imashnujnoto.com', logo: { '@type': 'ImageObject', url: 'https://storage.readdy-site.link/project_files/3f265d07-5825-4e88-a58a-44deb287b858/ec0eb8c9-c502-4cf5-bee4-657c996896dc_--.png?v=3d4829c108a0d31cdde2da513964de19' } },
      datePublished: '2026-06-10',
      dateModified: today,
      inLanguage: 'bg',
      url: 'https://imashnujnoto.com/blog/lokalen-biznes-ustoichivo-online-prisastvie',
      wordCount: 2600,
      timeRequired: 'PT10M',
      image: { '@type': 'ImageObject', url: 'https://readdy.ai/api/search-image?query=small%20local%20business%20sustainable%20online%20presence%20digital%20strategy%20wellness%20industry%20massage%20studio%20warm%20natural%20light%20clean%20minimal%20white%20background%20professional%20photography%20Bulgaria&width=1200&height=630&seq=blog-lokalen-biznes-hero&orientation=landscape', width: 1200, height: 630 },
      mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://imashnujnoto.com/blog/lokalen-biznes-ustoichivo-online-prisastvie' },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Начало', item: 'https://imashnujnoto.com/' },
          { '@type': 'ListItem', position: 2, name: 'Блог', item: 'https://imashnujnoto.com/blog' },
          { '@type': 'ListItem', position: 3, name: 'Локален бизнес — устойчиво онлайн присъствие', item: 'https://imashnujnoto.com/blog/lokalen-biznes-ustoichivo-online-prisastvie' },
        ],
      },
      keywords: 'локален бизнес, онлайн присъствие, уелнес индустрия, Google Business Profile, локално SEO, устойчивост, малък бизнес, дигитален маркетинг',
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
          name: 'Защо локалният бизнес се нуждае от устойчиво онлайн присъствие?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Над 80% от потребителите търсят локални услуги онлайн преди да посетят физическия обект. Устойчивото онлайн присъствие не е просто сайт — то включва Google Business Profile, локално SEO, авторитетно съдържание и присъствие в платформи като Google Maps. За локален бизнес това означава да бъде откриваем, когато потенциален клиент търси точно неговата услуга в конкретния град.',
          },
        },
        {
          '@type': 'Question',
          name: 'Кои са основните предизвикателства пред малките бизнеси в дигитална среда?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Основните предизвикателства са три: ограничен бюджет за маркетинг, липса на технически познания и конкуренция от по-големи играчи. Малките бизнеси често разчитат единствено на лични препоръки, но в дигиталната ера това не е достатъчно. Решението е в комбинация от безплатни инструменти като Google Business Profile, качествен уебсайт с добра структура и последователно изграждане на локален авторитет.',
          },
        },
        {
          '@type': 'Question',
          name: 'Как Google Business Profile помага на локален бизнес?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Google Business Profile е безплатният инструмент, който поставя бизнеса ви на картата на Google. При локално търсене (например „масажи Велико Търново") Google показва първо бизнесите с оптимизиран профил — снимки, отзиви, работно време и точно местоположение. Добре поддържаният профил може да носи до 40% от локалния ви трафик без никакви разходи за реклама.',
          },
        },
        {
          '@type': 'Question',
          name: 'Колко време отнема изграждането на устойчиво онлайн присъствие?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Това е процес, не еднократно действие. Първоначалната настройка — сайт, Google Business Profile, базово SEO — може да отнеме 2 до 4 седмици. Но истинското изграждане на авторитет и видимост отнема месеци последователна работа: публикуване на съдържание, събиране на отзиви, актуализиране на профили. Резултатите започват да се виждат след 2-3 месеца, а устойчивите позиции идват след 6-12 месеца.',
          },
        },
      ],
    },
  ],
};

const FAQ_ITEMS = [
  {
    q: 'Защо локалният бизнес се нуждае от устойчиво онлайн присъствие?',
    a: 'Над 80% от потребителите търсят локални услуги онлайн преди да посетят физическия обект. Устойчивото онлайн присъствие не е просто сайт — то включва Google Business Profile, локално SEO, авторитетно съдържание и присъствие в платформи като Google Maps. За локален бизнес това означава да бъде откриваем, когато потенциален клиент търси точно неговата услуга в конкретния град.',
  },
  {
    q: 'Кои са основните предизвикателства пред малките бизнеси в дигитална среда?',
    a: 'Основните предизвикателства са три: ограничен бюджет за маркетинг, липса на технически познания и конкуренция от по-големи играчи. Малките бизнеси често разчитат единствено на лични препоръки, но в дигиталната ера това не е достатъчно. Решението е в комбинация от безплатни инструменти като Google Business Profile, качествен уебсайт с добра структура и последователно изграждане на локален авторитет.',
  },
  {
    q: 'Как Google Business Profile помага на локален бизнес?',
    a: 'Google Business Profile е безплатният инструмент, който поставя бизнеса ви на картата на Google. При локално търсене (например „масажи Велико Търново") Google показва първо бизнесите с оптимизиран профил — снимки, отзиви, работно време и точно местоположение. Добре поддържаният профил може да носи до 40% от локалния ви трафик без никакви разходи за реклама.',
  },
  {
    q: 'Колко време отнема изграждането на устойчиво онлайн присъствие?',
    a: 'Това е процес, не еднократно действие. Първоначалната настройка — сайт, Google Business Profile, базово SEO — може да отнеме 2 до 4 седмици. Но истинското изграждане на авторитет и видимост отнема месеци последователна работа: публикуване на съдържание, събиране на отзиви, актуализиране на профили. Резултатите започват да се виждат след 2-3 месеца, а устойчивите позиции идват след 6-12 месеца.',
  },
];

const RELATED = [
  { title: 'SEO оптимизация Велико Търново 2026', to: '/blog/seo-optimizaciya-tarnovo-2026', cat: 'Статия' },
  { title: 'Google Business Profile — задължително за Търново', to: '/blog/google-business-vt', cat: 'Статия' },
  { title: 'Как да изберете маркетинг агенция в Търново', to: '/blog/kak-da-izberete-agenciya-tarnovo', cat: 'Статия' },
  { title: 'Дигитален маркетинг Велико Търново', to: '/digitalen-marketing-veliko-tarnovo', cat: 'Ръководство' },
];

export default function LokalenBiznesUstoichivoOnlinePrisastviePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    document.title = 'Как локалните бизнеси изграждат устойчиво онлайн присъствие | ТАВОРА ЕООД';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', 'Практическо ръководство за изграждане на устойчиво онлайн присъствие за локален бизнес. Реален пример от работата ни с NP Massage Studio — уелнес сектор, Велико Търново.');
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://imashnujnoto.com/blog/lokalen-biznes-ustoichivo-online-prisastvie');

    const id = 'schema-lokalen-biznes';
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
            <span className="text-[#1C1C1E]/65">Локален бизнес — устойчиво онлайн присъствие</span>
          </nav>

          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className="text-[10px] px-2.5 py-1 rounded-full font-medium bg-amber-50 text-amber-700">Локален бизнес</span>
            <span className="text-[10px] px-2.5 py-1 rounded-full font-medium bg-emerald-50 text-emerald-700">Уелнес индустрия</span>
            <span className="text-[10px] text-[#1C1C1E]/70">10 мин. четене · 10 Юни 2026</span>
          </div>

          <h1
            className="text-3xl md:text-5xl font-light text-[#1C1C1E] leading-tight mb-5"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Как локалните бизнеси изграждат
            <br />
            <em className="text-[#1C1C1E]/60">устойчиво онлайн присъствие</em>
          </h1>

          <p className="text-sm md:text-base text-[#1C1C1E]/65 max-w-2xl leading-relaxed mb-6">
            Практическо ръководство, базирано на реален опит от работата с <strong className="text-[#1C1C1E]">NP Massage Studio</strong> —
            локален уелнес бизнес, който изгради стабилна дигитална основа. Без магически формули — само методология, която работи.
          </p>

          <div className="flex items-center gap-3 text-xs text-[#1C1C1E]/65">
            <span>Владимир Атанасов · ТАВОРА ЕООД</span>
            <span>·</span>
            <span>10 Юни 2026</span>
          </div>
        </div>
      </section>

      {/* HERO IMAGE */}
      <div className="w-full h-[280px] md:h-[420px] overflow-hidden">
        <img
          src="https://readdy.ai/api/search-image?query=small%20local%20business%20sustainable%20online%20presence%20digital%20strategy%20wellness%20industry%20massage%20studio%20warm%20natural%20light%20clean%20minimal%20white%20background%20professional%20photography%20Bulgaria&width=1400&height=420&seq=blog-lokalen-biznes-hero-img&orientation=landscape"
          alt="Локални бизнеси — устойчиво онлайн присъствие в уелнес индустрията"
          className="w-full h-full object-cover object-top"
          loading="eager"
        />
      </div>

      <main className="max-w-3xl mx-auto px-4 md:px-8 py-12 md:py-16">

        {/* INTRO */}
        <p className="text-base text-[#1C1C1E]/60 leading-relaxed mb-12 border-l-2 border-[#0A2540]/20 pl-4">
          Повечето малки бизнеси подхождат към онлайн присъствието си като към еднократен проект — направят сайт, регистрират се в Google Maps и забравят.
          Но устойчивото присъствие изисква система. В тази статия споделям какво научихме от работата си с локални бизнеси в уелнес сектора.
        </p>

        {/* SECTION 1: Предизвикателствата */}
        <section className="mb-14">
          <h2
            className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-5"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Предизвикателствата пред малките бизнеси
          </h2>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
            Когато започнахме работа с <a href="https://npmassagestudio.com/" target="_blank" rel="noopener noreferrer" className="text-[#0A2540] hover:underline">NP Massage Studio</a>, едно от водещите масажни студиа във Велико Търново, основната цел беше изграждането на стабилно локално онлайн присъствие. Те вече имаха изграден бизнес с две локации — във Велико Търново и Павликени — и клиентите им идваха предимно чрез лични препоръки. Но имаше ясен проблем: онлайн присъствието им не отразяваше качеството на услугите, които предлагаха.
          </p>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
            Това е типична ситуация за повечето локални бизнеси. Те инвестират време и усилия в качеството на услугата — обзавеждане, обучение на персонал, създаване на атмосфера. Но когато потенциален клиент ги потърси онлайн, вижда нещо, което не отговаря на реалността. Остарял сайт, празен Google Business профил, липса на отзиви.
          </p>

          <div className="p-5 rounded-2xl bg-[#F9F9F7] border border-[#1C1C1E]/6 mb-4">
            <div className="text-xs font-medium text-[#1C1C1E]/65 mb-3 tracking-wide uppercase">Трите основни предизвикателства, които наблюдаваме при локалните бизнеси:</div>
            <div className="space-y-3">
              {[
                { label: 'Ограничен бюджет', desc: 'Малките бизнеси не могат да си позволят големи рекламни бюджети. Всеки лев трябва да работи за тях.' },
                { label: 'Липса на технически познания', desc: 'Собствениците са експерти в своята област, не в SEO или уеб дизайн. Нуждаят се от разбираем подход.' },
                { label: 'Конкуренция от вериги', desc: 'Големите вериги имат ресурси, които малките бизнеси нямат. Но локалният бизнес има предимство, което веригите трудно копират — автентичност.' },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <div className="w-5 h-5 flex items-center justify-center rounded-full border border-[#1C1C1E]/20 shrink-0 mt-0.5">
                    <i className="ri-arrow-right-line text-[8px] text-[#1C1C1E]/50" />
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

        {/* SECTION 2: Значението на локалното SEO */}
        <section className="mb-14">
          <h2
            className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-5"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Значението на локалното SEO
          </h2>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
            Локалното SEO не е просто „искам да съм в Google". Това е систематичен подход да направите бизнеса си откриваем за хората, които търсят точно вашите услуги в точно вашия град. Когато някой напише „масаж Велико Търново" в Google, той не търси информация — той търси решение на конкретен проблем (болки в гърба, стрес, нужда от релаксация).
          </p>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
            Тук идва ключовата разлика между общото SEO и локалното SEO. При общото SEO се борите с целия интернет. При локалното — само с бизнесите в радиус от няколко километра. И тук правилната стратегия прави огромна разлика.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {[
              { icon: 'ri-map-pin-line', title: 'Географска релевантност', desc: 'Google дава приоритет на бизнеси, които са физически близо до търсещия. Това е предимство, което онлайн- only бизнесите нямат.', color: '#E67700' },
              { icon: 'ri-search-line', title: 'Намерение за покупка', desc: 'Локалните търсения имат много по-висок процент на конверсия. Който търси „масаж сега", най-вероятно ще резервира.', color: '#2F9E44' },
              { icon: 'ri-user-heart-line', title: 'Доверие чрез близост', desc: 'Хората се доверяват повече на бизнеси, които са в техния град. Локалното присъствие носи усещане за достъпност.', color: '#C2255C' },
              { icon: 'ri-bar-chart-line', title: 'По-ниска конкуренция', desc: 'За „масаж" се конкурирате с целия свят. За „масаж Велико Търново" — само с няколко бизнеса.', color: '#7048E8' },
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

        <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-14 px-0">
          Подобен подход приложихме и при страницата за{' '}
          <a href="https://npmassagestudio.com/uslugi/sporten-masazh" target="_blank" rel="noopener noreferrer" className="text-[#0A2540] hover:underline">спортен масаж</a>, където фокусът беше върху ясно представяне на ползите и лесна връзка с клиента.
        </p>

        {/* SECTION 3: Google Business Profile */}
        <section className="mb-14">
          <h2
            className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-5"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Google Business Profile — вашият дигитален витрин
          </h2>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
            Много собственици на бизнеси подценяват Google Business Profile (GBP). Те го регистрират, качват една снимка, пишат работното време и го забравят. Но GBP е може би най-мощният безплатен инструмент, с който разполага локалният бизнес.
          </p>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
            Ето какво работи на практика: когато някой потърси „масажно студио Търново", Google не показва първо най-добрия сайт — показва бизнесите с най-добре оптимизиран GBP профил. Това включва: актуални снимки (поне веднъж месечно), редовни публикации, отговори на всеки отзив (дори негативните), точна категоризация и описание, което съдържа ключовите думи, които клиентите използват.
          </p>

          <div className="p-6 rounded-2xl bg-[#F9F9F7] border border-[#1C1C1E]/6 mb-4">
            <div className="text-xs font-medium text-[#1C1C1E]/65 mb-4 tracking-wide uppercase">5 елемента на добре поддържан Google Business Profile:</div>
            <div className="space-y-3">
              {[
                { step: '01', label: 'Пълна информация', desc: 'Адрес, телефон, работно време, категория, услуги — всичко попълнено без пропуски. Google наказва непълните профили.' },
                { step: '02', label: 'Актуални снимки', desc: 'Поне 10-15 снимки на интериора, екипа и услугите. Обновявани редовно. Снимките са първото нещо, което клиентът вижда.' },
                { step: '03', label: 'Отзиви и отговори', desc: 'Всеки отзив получава отговор в рамките на 24 часа. Това показва, че бизнесът е активен и се интересува от клиентите си.' },
                { step: '04', label: 'Публикации', desc: 'Поне веднъж седмично — новина, оферта, събитие. Google дава приоритет на профили с активност.' },
                { step: '05', label: 'Въпроси и отговори', desc: 'Попълнете секцията с въпроси и отговори. Това е директна връзка с потенциалните клиенти и Google индексира тези отговори.' },
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

        {/* SECTION 4: Качествено съдържание */}
        <section className="mb-14">
          <h2
            className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-5"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Качественото съдържание като основа на доверието
          </h2>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
            Сайтът не е просто визитка — той е мястото, където клиентът решава дали да ви се довери. И тук съдържанието играе критична роля. Когато работихме с екипа на <a href="https://npmassagestudio.com" target="_blank" rel="noopener noreferrer" className="text-[#0A2540] hover:underline">NP Massage Studio</a>, един от първите въпроси беше: „Какво всъщност иска да знае клиентът, преди да резервира?"
          </p>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
            Отговорът се оказа прост: клиентът иска да знае какво точно ще получи, колко време ще продължи, каква е цената и как да стигне до студиото. Това звучи елементарно, но огромен брой бизнес сайтове не отговарят на тези въпроси ясно и директно. Вместо това, те пишат за „уникално преживяване" и „професионален екип" — думи, които всеки използва и които не казват нищо конкретно.
          </p>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
            За пример може да се разгледа страницата с{' '}
            <a href="https://npmassagestudio.com/uslugi" target="_blank" rel="noopener noreferrer" className="text-[#0A2540] hover:underline">масажните услуги на NP Massage Studio</a>, където всяка терапия има собствено подробно описание, прозрачна информация и ясна структура за потребителите.
          </p>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
            Доброто съдържание е конкретно. Вместо „ние предлагаме релаксиращи масажи", по-добре е „Класически масаж — 60 минути, 50 лв. Включва работа по гърба, раменете и врата. Подходящ за хора с напрежение от седяща работа." Това дава на клиента цялата необходима информация, за да вземе решение.
          </p>
        </section>

        {/* SECTION 5: Потребителско преживяване */}
        <section className="mb-14">
          <h2
            className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-5"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Потребителското преживяване — лесният път до резервация
          </h2>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
            Една от най-честите грешки, които виждаме при локалните бизнес сайтове, е сложният път до резервация. Клиентът влиза в сайта, харесва услуга, но трябва да мине през три страници, контактен формуляр с десет полета и чакане на обаждане, за да резервира час. Всяка допълнителна стъпка губи процент от потенциалните клиенти.
          </p>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
            Решението е просто: бутон за резервация, който се вижда веднага. Телефонен номер в горната част на сайта. Форма, която задава само три въпроса: име, телефон и предпочитан час. Всичко останало може да се уточни по телефона.
          </p>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
            Добър пример е страницата за{' '}
            <a href="https://npmassagestudio.com/uslugi/klasicheski-masazh" target="_blank" rel="noopener noreferrer" className="text-[#0A2540] hover:underline">класически масаж</a>, където потребителят може бързо да разбере какво включва услугата и дали е подходяща за неговите нужди.
          </p>

          <div className="p-5 rounded-2xl bg-[#F9F9F7] border border-[#1C1C1E]/6">
            <div className="text-xs font-medium text-[#1C1C1E]/65 mb-3 tracking-wide uppercase">3 принципа за добра резервационна система:</div>
            <div className="space-y-2">
              {[
                'Бутонът за резервация трябва да се вижда без скролване — на всеки екран, на всяка страница.',
                'Формулярът трябва да е минимален. Всеки допълнителен въпрос намалява шанса за попълване с около 10%.',
                'След резервация — автоматично потвърждение по имейл или SMS. Клиентът трябва да знае, че резервацията е приета.',
              ].map((item, i) => (
                <div key={item} className="flex items-start gap-2.5">
                  <span className="text-[10px] font-medium text-[#1C1C1E]/40 w-4 shrink-0">{i + 1}.</span>
                  <span className="text-xs text-[#1C1C1E]/65 leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 6: Устойчивостта идва от система */}
        <section className="mb-14">
          <h2
            className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-5"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Устойчивостта идва от система, не от късмет
          </h2>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
            Най-големият урок, който научихме от работата с локални бизнеси в уелнес сектора, е следният: устойчивото онлайн присъствие не идва от една голяма промяна, а от много малки, последователни действия. Всеки месец: нова снимка в Google Business Profile, отговор на новите отзиви, една публикация в блога, обновяване на цените, проверка на техническото състояние на сайта.
          </p>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
            Това е разликата между бизнес, който се появява и изчезва в Google, и бизнес, който остава там месец след месец. Google не обича статични сайтове. Google обича живи бизнеси, които постоянно обновяват информацията си.
          </p>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
            Ако сте собственик на локален бизнес и искате да разберете повече за нашата методология, можете да разгледате <a href="https://npmassagestudio.com" target="_blank" rel="noopener noreferrer" className="text-[#0A2540] hover:underline">сайта на NP Massage Studio</a> като пример за прилагане на тези принципи в уелнес сектор с две локации.
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
            Въпроси, които чуваме
            <br />
            <em className="text-[#1C1C1E]/65">от локални бизнеси.</em>
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
              <div className="text-xs text-white/75 tracking-widest uppercase mb-2">За локални бизнеси</div>
              <div
                className="text-2xl md:text-3xl font-light leading-tight mb-2"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Изградете устойчиво
                <br />
                <span className="italic text-white/60">онлайн присъствие</span>
              </div>
              <p className="text-sm text-white/75 max-w-md leading-relaxed">
                Консултация 50 € — анализ на текущото ви онлайн присъствие и конкретни стъпки за подобрение.
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
                SEO & GEO услуга
              </Link>
            </div>
          </div>
        </div>
      </main>

      <SharedFooter />
    </div>
  );
}