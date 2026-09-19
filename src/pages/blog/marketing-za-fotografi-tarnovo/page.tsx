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
      '@id': 'https://imashnujnoto.com/blog/marketing-za-fotografi-tarnovo#article',
      headline: 'Маркетинг за фотографи: какво научихме от работата с Photo Tarnovo за привличане на туристи',
      description: 'Реални маркетингови уроци от работата с Photo Tarnovo — street portrait фотограф на Царевец. Как локация, моментална доставка и дигитална стратегия привличат туристи от цял свят без платена реклама.',
      author: { '@type': 'Person', name: 'Владимир Атанасов', url: 'https://imashnujnoto.com/ekip' },
      publisher: { '@type': 'Organization', '@id': 'https://imashnujnoto.com/#organization', name: 'ТАВОРА ЕООД', url: 'https://imashnujnoto.com', logo: { '@type': 'ImageObject', url: 'https://storage.readdy-site.link/project_files/3f265d07-5825-4e88-a58a-44deb287b858/ec0eb8c9-c502-4cf5-bee4-657c996896dc_--.png?v=3d4829c108a0d31cdde2da513964de19' } },
      datePublished: '2026-06-20',
      dateModified: today,
      inLanguage: 'bg',
      url: 'https://imashnujnoto.com/blog/marketing-za-fotografi-tarnovo',
      wordCount: 2300,
      timeRequired: 'PT8M',
      image: { '@type': 'ImageObject', url: 'https://readdy.ai/api/search-image?query=tourist%20getting%20street%20portrait%20taken%20at%20Tsarevets%20Fortress%20Veliko%20Tarnovo%20Bulgaria%20professional%20photographer%20golden%20hour%20light%20ancient%20stone%20walls%20authentic%20travel%20moment%20candid%20photography&width=1200&height=630&seq=blog-marketing-fotografi-hero&orientation=landscape', width: 1200, height: 630 },
      mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://imashnujnoto.com/blog/marketing-za-fotografi-tarnovo' },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Начало', item: 'https://imashnujnoto.com/' },
          { '@type': 'ListItem', position: 2, name: 'Блог', item: 'https://imashnujnoto.com/blog' },
          { '@type': 'ListItem', position: 3, name: 'Маркетинг за фотографи — Photo Tarnovo', item: 'https://imashnujnoto.com/blog/marketing-za-fotografi-tarnovo' },
        ],
      },
      keywords: 'маркетинг за фотографи, Photo Tarnovo, туристически бизнес, street portrait, Велико Търново, Царевец, локален маркетинг, привличане на клиенти',
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
          name: 'Какви маркетингови стратегии работят за туристически фотограф в Търново?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Най-ефективните стратегии за туристически фотограф са: 1) оптимизиран Google Business Profile с локация на самата туристическа атракция, 2) система за моментално получаване на снимки (QR код доставка), която генерира естествени ревюта, 3) двуезичен уебсайт със Schema.org маркиране, 4) блог съдържание, което отговаря на реални туристически въпроси и 5) присъствие в платформи като Tripadvisor и Google Maps с автентични ревюта.',
          },
        },
        {
          '@type': 'Question',
          name: 'Как Photo Tarnovo привлича клиенти без платена реклама?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Photo Tarnovo разчита на три безплатни канала: органичен Google трафик (чрез SEO и Google Maps), физическо присъствие на най-посещаваната локация в Търново (Царевец), и word-of-mouth от доволни туристи, които споделят опита си. Ключов елемент е моменталната доставка на снимки чрез QR код — туристите получават портретите си за минути и веднага ги споделят в социалните мрежи, създавайки безплатна реклама.',
          },
        },
        {
          '@type': 'Question',
          name: 'Защо локацията е най-важният маркетингов актив за локален бизнес?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Локацията е актив, който конкурентите не могат да копират. За Photo Tarnovo, да си на входа на Царевец означава достъп до хиляди потенциални клиенти всеки ден — без разход за реклама. Google също дава приоритет на бизнеси, които са физически близо до търсещия. Комбинацията от физическа локация + добре оптимизиран Google Business Profile създава непробиваемо конкурентно предимство.',
          },
        },
        {
          '@type': 'Question',
          name: 'Каква е ролята на ревютата в маркетинга на локален фотограф?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Ревютата са може би най-важният конверсионен фактор за туристически бизнес. Туристите в непознат град се доверяват на ревюта повече от всичко друго. Photo Tarnovo има 4.9 рейтинг с 37+ автентични ревюта от реални туристи — двойки от Милано, соло пътешественици от Лондон, backpackers от Берлин. Всеки нов клиент получава линк към Google ревю заедно със снимките си, което създава постоянен поток от新鮮и отзиви.',
          },
        },
      ],
    },
  ],
};

const FAQ_ITEMS = [
  {
    q: 'Какви маркетингови стратегии работят за туристически фотограф в Търново?',
    a: 'Най-ефективните стратегии за туристически фотограф са: 1) оптимизиран Google Business Profile с локация на самата туристическа атракция, 2) система за моментално получаване на снимки (QR код доставка), която генерира естествени ревюта, 3) двуезичен уебсайт със Schema.org маркиране, 4) блог съдържание, което отговаря на реални туристически въпроси и 5) присъствие в платформи като Tripadvisor и Google Maps с автентични ревюта.',
  },
  {
    q: 'Как Photo Tarnovo привлича клиенти без платена реклама?',
    a: 'Photo Tarnovo разчита на три безплатни канала: органичен Google трафик (чрез SEO и Google Maps), физическо присъствие на най-посещаваната локация в Търново (Царевец), и word-of-mouth от доволни туристи, които споделят опита си. Ключов елемент е моменталната доставка на снимки чрез QR код — туристите получават портретите си за минути и веднага ги споделят в социалните мрежи, създавайки безплатна реклама.',
  },
  {
    q: 'Защо локацията е най-важният маркетингов актив за локален бизнес?',
    a: 'Локацията е актив, който конкурентите не могат да копират. За Photo Tarnovo, да си на входа на Царевец означава достъп до хиляди потенциални клиенти всеки ден — без разход за реклама. Google също дава приоритет на бизнеси, които са физически близо до търсещия. Комбинацията от физическа локация + добре оптимизиран Google Business Profile създава непробиваемо конкурентно предимство.',
  },
  {
    q: 'Каква е ролята на ревютата в маркетинга на локален фотограф?',
    a: 'Ревютата са може би най-важният конверсионен фактор за туристически бизнес. Туристите в непознат град се доверяват на ревюта повече от всичко друго. Photo Tarnovo има 4.9 рейтинг с 37+ автентични ревюта от реални туристи — двойки от Милано, соло пътешественици от Лондон, backpackers от Берлин. Всеки нов клиент получава линк към Google ревю заедно със снимките си, което създава постоянен поток от свежи отзиви.',
  },
];

const RELATED = [
  { title: 'Как локалните бизнеси изграждат устойчиво онлайн присъствие', to: '/blog/lokalen-biznes-ustoichivo-online-prisastvie', cat: 'Статия' },
  { title: 'Защо локалният маркетинг е различен от масовия', to: '/blog/lokalen-vs-masov-marketing', cat: 'Статия' },
  { title: 'Какво научихме от работата с бизнес в уелнес сектора', to: '/blog/marketing-nablyudeniya-masazhni-uslugi', cat: 'Статия' },
  { title: 'Дигитален маркетинг Велико Търново — пълно ръководство 2026', to: '/digitalen-marketing-veliko-tarnovo', cat: 'Ръководство' },
];

export default function MarketingZaFotografiTarnovoPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    document.title = 'Маркетинг за фотографи — уроци от Photo Tarnovo | ТАВОРА ЕООД';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', 'Реални маркетингови уроци от Photo Tarnovo — street portrait фотограф на Царевец. Как локация, моментална доставка и дигитална стратегия привличат туристи от цял свят.');
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://imashnujnoto.com/blog/marketing-za-fotografi-tarnovo');

    const id = 'schema-marketing-fotografi';
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
            <span className="text-[#1C1C1E]/65">Маркетинг за фотографи</span>
          </nav>

          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className="text-[10px] px-2.5 py-1 rounded-full font-medium bg-rose-50 text-rose-700">Фотография</span>
            <span className="text-[10px] px-2.5 py-1 rounded-full font-medium bg-teal-50 text-teal-700">Туристически бизнес</span>
            <span className="text-[10px] text-[#1C1C1E]/70">8 мин. четене · 20 Юни 2026</span>
          </div>

          <h1
            className="text-3xl md:text-5xl font-light text-[#1C1C1E] leading-tight mb-5"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Маркетинг за фотографи:
            <br />
            <em className="text-[#1C1C1E]/60">уроци от Photo Tarnovo за привличане на туристи</em>
          </h1>

          <p className="text-sm md:text-base text-[#1C1C1E]/65 max-w-2xl leading-relaxed mb-6">
            Как{' '}
            <a href="https://phototarnovo.com/" target="_blank" rel="noopener noreferrer" className="text-[#0A2540] hover:underline"><strong>Photo Tarnovo</strong></a> превърна локацията на Царевец в маркетингов актив, който привлича туристи от цял свят — без нито един лев за реклама.
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
          src="https://readdy.ai/api/search-image?query=tourist%20couple%20getting%20portrait%20taken%20at%20Tsarevets%20Fortress%20Veliko%20Tarnovo%20Bulgaria%20golden%20hour%20professional%20street%20photographer%20candid%20moment%20authentic%20travel%20experience%20ancient%20stone%20walls%20warm%20Balkan%20sunlight&width=1400&height=420&seq=blog-marketing-fotografi-hero-img&orientation=landscape"
          alt="Photo Tarnovo — street portrait маркетинг за фотографи, привличане на туристи на Царевец"
          className="w-full h-full object-cover object-top"
          loading="eager"
        />
      </div>

      <main className="max-w-3xl mx-auto px-4 md:px-8 py-12 md:py-16">

        {/* INTRO */}
        <p className="text-base text-[#1C1C1E]/60 leading-relaxed mb-12 border-l-2 border-[#0A2540]/20 pl-4">
          Повечето фотографи мислят, че маркетингът е сложен — реклами в Google, Facebook кампании, SEO. Но най-мощният маркетингов инструмент за локален фотограф често е точно под носа му: локацията. Ето какво научихме от{' '}
          <a href="https://phototarnovo.com/" target="_blank" rel="noopener noreferrer" className="text-[#0A2540] hover:underline">Photo Tarnovo</a>.
        </p>

        {/* SECTION 1: Локацията като маркетингов актив */}
        <section className="mb-14">
          <h2
            className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-5"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Локацията е вашият най-голям маркетингов актив
          </h2>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
            Когато анализираме маркетинговите стратегии на успешни локални бизнеси, един принцип изпъква над всички останали: локацията е актив, който конкурентите не могат да копират. Photo Tarnovo работи на главния вход на крепостта Царевец — най-посещаваната туристическа атракция във Велико Търново. Хиляди туристи минават оттам всеки ден.
          </p>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
            Но локацията сама по себе си не е достатъчна. Трябва да я превърнете в маркетингов актив. За Photo Tarnovo това означава: физическо присъствие, което се вижда (setup, който не можеш да пропуснеш), Google Business Profile, който потвърждава локацията с геокоординати, и съдържание, което свързва бранда с мястото — „street portrait на Царевец", „photographer at Tsarevets Fortress".
          </p>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
            Разгледайте{' '}
            <a href="https://phototarnovo.com/#how-it-works" target="_blank" rel="noopener noreferrer" className="text-[#0A2540] hover:underline">How it Works</a> страницата — три стъпки, които започват с „Find me near the main entrance of Tsarevets Fortress". Това не е просто инструкция — това е маркетингово позициониране, което Google разпознава и свързва с локални търсения.
          </p>

          <div className="p-5 rounded-2xl bg-[#F9F9F7] border border-[#1C1C1E]/6 mb-4">
            <div className="text-xs font-medium text-[#1C1C1E]/65 mb-3 tracking-wide uppercase">Как да превърнете локацията в маркетингов актив:</div>
            <div className="space-y-2">
              {[
                'Регистрирайте точния адрес в Google Business Profile — с геокоординати, не само име на улица.',
                'Създайте съдържание, което свързва бранда с локацията: „фотограф на Царевец", „портрети пред крепостта".',
                'Използвайте Schema.org маркиране с geo координати — Google индексира това и показва бизнеса в Local Pack.',
                'Насърчавайте клиентите да споменават локацията в ревютата си — „намерих го на входа на Царевец".',
              ].map((item, i) => (
                <div key={item} className="flex items-start gap-2.5">
                  <span className="text-[10px] font-medium text-[#1C1C1E]/40 w-4 shrink-0">{i + 1}.</span>
                  <span className="text-xs text-[#1C1C1E]/65 leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 2: Моментална доставка */}
        <section className="mb-14">
          <h2
            className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-5"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Моменталната доставка като маркетингов инструмент
          </h2>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
            Един от най-гениалните маркетингови ходове на Photo Tarnovo е системата за моментална доставка на снимки. След 5-10 минутна сесия, туристът сканира QR код и получава своите портрети в дигитална галерия за под 5 минути. Без апликации, без регистрации, без чакане.
          </p>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
            Това не е просто удобство — това е маркетингова машина. Ето защо: когато туристът получи снимките си веднага, той ги споделя в Instagram, Facebook, WhatsApp — докато още е на крепостта. Геотагът „Царевец, Велико Търново" се появява в стотици публикации месечно. Всеки споделен портрет е безплатна реклама, която достига до приятелите и последователите на туриста.
          </p>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
            Освен това, моменталната доставка създава перфектния момент за искане на ревю. Заедно с линка към снимките, туристът получава и линк към{' '}
            <a href="https://phototarnovo.com/#reviews" target="_blank" rel="noopener noreferrer" className="text-[#0A2540] hover:underline">Google ревю</a>. Доволен от току-що получения портрет, туристът оставя автентичен 5-звезден отзив. Така Photo Tarnovo е натрупал 37+ ревюта с рейтинг 4.9.
          </p>

          <div className="p-6 rounded-2xl bg-[#F9F9F7] border border-[#1C1C1E]/6">
            <div className="text-xs font-medium text-[#1C1C1E]/65 mb-3 tracking-wide uppercase">Защо моменталната доставка работи като маркетинг:</div>
            <div className="space-y-3">
              {[
                { icon: 'ri-share-line', title: 'Вирусен ефект', desc: 'Туристите споделят снимките веднага — геотагнати на Царевец. Всеки пост е безплатна реклама.' },
                { icon: 'ri-feedback-line', title: 'Ревюта на момента', desc: 'Доволният клиент оставя ревю, докато емоцията е прясна. 37+ автентични отзива с рейтинг 4.9.' },
                { icon: 'ri-user-heart-line', title: 'Word-of-mouth на стероиди', desc: 'Туристът показва снимката на приятели — „виж какво ми направиха на Царевец". Препоръката е лична и неустоима.' },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-rose-50 shrink-0 mt-0.5">
                    <i className={`${item.icon} text-xs text-rose-500`} />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-[#1C1C1E]">{item.title}</span>
                    <p className="text-xs text-[#1C1C1E]/65 leading-relaxed mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 3: Ценообразуване */}
        <section className="mb-14">
          <h2
            className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-5"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Прозрачното ценообразуване печели доверие
          </h2>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
            Една от най-честите грешки в маркетинга на услуги е скриването на цените. „Свържете се с нас за оферта" — тази фраза убива конверсията. Туристите искат да знаят цената веднага. Те са на почивка, в непознат град, с ограничено време. Няма да пишат имейли и да чакат оферти.
          </p>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
            Photo Tarnovo показва{' '}
            <a href="https://phototarnovo.com/packages" target="_blank" rel="noopener noreferrer" className="text-[#0A2540] hover:underline">цените си открито</a>: плащане в брой или с карта на място, без скрити такси, без upsell. „Your Portraits, Your Price" — това е messaging, който премахва бариерата и кара туриста да спре. Той знае, че няма да бъде изненадан с допълнителни разходи.
          </p>

          <div className="p-5 rounded-2xl bg-[#F9F9F7] border border-[#1C1C1E]/6">
            <div className="text-xs font-medium text-[#1C1C1E]/65 mb-3 tracking-wide uppercase">Принципи на прозрачното ценообразуване:</div>
            <div className="space-y-2">
              {[
                'Покажете цената преди клиентът да е попитал — на сайта, на видно място.',
                'Без „от" цени — покажете точната сума, която клиентът ще плати.',
                'Без скрити такси — ако има допълнителни опции, те трябва да са ясно отделени и опционални.',
                'Предложете multiple payment methods — cash, card, online. Колкото повече опции, толкова по-висока конверсия.',
              ].map((item, i) => (
                <div key={item} className="flex items-start gap-2.5">
                  <span className="text-[10px] font-medium text-[#1C1C1E]/40 w-4 shrink-0">{i + 1}.</span>
                  <span className="text-xs text-[#1C1C1E]/65 leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 4: Двуезичен маркетинг */}
        <section className="mb-14">
          <h2
            className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-5"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Двуезичният маркетинг — говори на езика на клиента
          </h2>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
            Велико Търново привлича туристи от цял свят. Photo Tarnovo разбира това и комуникира на два езика — български и английски. Сайтът, Google Business профилът, блогът и дори WhatsApp съобщенията са достъпни и на двата езика.
          </p>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
            Това не е просто превод — това е стратегическо SEO решение. Когато турист от Лондон търси „street portrait Veliko Tarnovo" в Google, той намира{' '}
            <a href="https://phototarnovo.com/blog/best-portrait-locations-veliko-tarnovo" target="_blank" rel="noopener noreferrer" className="text-[#0A2540] hover:underline">Best Portrait Locations Veliko Tarnovo</a> — статия на английски, която Google индексира отделно от българското съдържание. Това удвоява потенциалния трафик.
          </p>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
            Ключовото прозрение тук: не превеждайте буквално. Създайте оригинално съдържание за всеки език, което отговаря на начина, по който носителите на този език търсят. Българинът търси „фотограф Велико Търново", англичанинът търси „photographer Veliko Tarnovo". Това са различни SEO стратегии с различни ключови думи.
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
            Photo Tarnovo е street portrait фотограф, базиран на крепостта Царевец във Велико Търново. Работи всеки ден от 10:00 до залез без предварително записване — туристите просто спират, позират за 5-10 минути и получават своите портрети чрез QR код за под 5 минути. С над 2000 направени портрета, рейтинг 4.9 от 37+ ревюта и #1 позиция в Google за „photo tarnovo", това е един от най-успешните примери за локален туристически маркетинг в България.
          </p>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
            Разгледайте{' '}
            <a href="https://phototarnovo.com/packages" target="_blank" rel="noopener noreferrer" className="text-[#0A2540] hover:underline">пакетите и цените</a>,{' '}
            <a href="https://phototarnovo.com/#gallery" target="_blank" rel="noopener noreferrer" className="text-[#0A2540] hover:underline">галерията с портрети</a> или{' '}
            <a href="https://phototarnovo.com/blog/best-portrait-locations-veliko-tarnovo" target="_blank" rel="noopener noreferrer" className="text-[#0A2540] hover:underline">блога с локации</a>{' '}
            — и вижте сами как изглежда маркетинг, който работи без рекламен бюджет.
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
              { label: 'How it Works — процесът стъпка по стъпка', href: 'https://phototarnovo.com/#how-it-works' },
              { label: 'Packages — цени без скрити такси', href: 'https://phototarnovo.com/packages' },
              { label: 'Gallery — реални портрети от Царевец', href: 'https://phototarnovo.com/#gallery' },
              { label: 'Reviews — 4.9 от 37+ туристи', href: 'https://phototarnovo.com/#reviews' },
              { label: 'FAQ — всичко, което туристите питат', href: 'https://phototarnovo.com/#faq' },
              { label: 'Best Portrait Locations Veliko Tarnovo', href: 'https://phototarnovo.com/blog/best-portrait-locations-veliko-tarnovo' },
              { label: 'Street vs Studio Portrait', href: 'https://phototarnovo.com/blog/street-vs-studio-portrait' },
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
            <em className="text-[#1C1C1E]/65">на фотографски бизнес.</em>
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
              <div className="text-xs text-white/75 tracking-widest uppercase mb-2">Искате маркетинг стратегия за вашия бизнес?</div>
              <div
                className="text-2xl md:text-3xl font-light leading-tight mb-2"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Консултация за локален маркетинг
                <br />
                <span className="italic text-white/60">Велико Търново — 50 €</span>
              </div>
              <p className="text-sm text-white/75 max-w-md leading-relaxed">
                Независимо дали сте фотограф, ресторантьор или туроператор — ще ви покажем как да превърнете локацията си в маркетингов актив.
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