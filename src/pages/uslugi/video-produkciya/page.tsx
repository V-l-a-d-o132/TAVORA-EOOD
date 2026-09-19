import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SharedNav from '@/components/feature/SharedNav';
import SharedFooter from '@/components/feature/SharedFooter';
import LazyVideo from '@/components/feature/LazyVideo';

const FORMATS = [
  {
    title: 'Рекламни видеа',
    desc: 'Кратки, директни видеа за Meta, Google и TikTok. Проектирани да спират скролването и да водят към действие. Не разказваме истории — показваме стойност.',
    price: 'от 290 €',
  },
  {
    title: 'Видео за социални медии',
    desc: 'Серийно съдържание за Instagram Reels, TikTok и YouTube Shorts. Оптимизирано за алгоритмите — формат, дължина, hook в първите 3 секунди.',
    price: 'от 290 € / месец',
  },
  {
    title: 'Корпоративни видеа',
    desc: 'Представяне на компания, екип, процес или продукт. За сайт, за инвеститори, за партньори. Чисто, професионално, без излишно.',
    price: 'от 690 € / проект',
  },
  {
    title: 'Видео за НПО',
    desc: 'Социални кампании с национален обхват. Работили сме с Академика 245 и Амалипе — над 1 000 000 гледания. Знаем как се разказва кауза.',
    price: 'по запитване',
  },
];

const EQUIPMENT = [
  { icon: 'ri-camera-3-line', label: 'Камери', desc: '4K, стабилизация, множество обективи' },
  { icon: 'ri-mic-2-line', label: 'Звук', desc: 'Лавалиер и насочени микрофони, без шум' },
  { icon: 'ri-sun-foggy-line', label: 'Осветление', desc: 'Студийно и локационно, за всяка среда' },
  { icon: 'ri-scissors-cut-line', label: 'Монтаж', desc: 'Цветокорекция, звук, субтитри — 5 работни дни' },
];

const today = new Date().toISOString().split('T')[0];

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'VideoObject',
      '@id': 'https://imashnujnoto.com/uslugi/video-produkciya#video-akademika',
      name: 'Видео продукция за НПО — Академика 245 | ТАВОРА ЕООД',
      description: 'Видео продукция с Натан Петков по проект за домашното насилие — кампания с национален обхват. Милиони импресии в социалните медии.',
      uploadDate: '2024-09-01',
      thumbnailUrl: 'https://readdy.ai/api/search-image?query=professional%20video%20production%20filming%20camera%20crew%20NGO%20social%20campaign%20Bulgaria%20Veliko%20Tarnovo%20documentary%20outdoor%20warm%20light&width=1280&height=720&seq=uslugi-video-thumb-1&orientation=landscape',
      embedUrl: 'https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Freel%2F4228757277440339&show_text=false&width=560',
      url: 'https://www.facebook.com/reel/4228757277440339',
      inLanguage: 'bg',
      publisher: {
        '@type': 'Organization',
        name: 'ТАВОРА ЕООД',
        url: 'https://imashnujnoto.com',
        logo: { '@type': 'ImageObject', url: 'https://storage.readdy-site.link/project_files/3f265d07-5825-4e88-a58a-44deb287b858/777dce2a-8731-4235-b0be-7837a840c3c9_TAVORA-MARKETING-AGENCY-VELIKO-TARNOVO.png?v=f6135e7442d441feef102ad2f8425862' },
      },
      author: { '@type': 'Person', name: 'Натан Петков', url: 'https://imashnujnoto.com/ekip' },
    },
    {
      '@type': 'VideoObject',
      '@id': 'https://imashnujnoto.com/uslugi/video-produkciya#video-interview',
      name: 'Интервю с Владимир Атанасов — медийна грамотност',
      description: 'Интервю с Владимир Атанасов от ТАВОРА ЕООД за медийната грамотност и дигиталното образование.',
      uploadDate: '2024-06-01',
      thumbnailUrl: 'https://img.youtube.com/vi/WdUUckZ19jI/maxresdefault.jpg',
      embedUrl: 'https://www.youtube.com/embed/WdUUckZ19jI',
      contentUrl: 'https://www.youtube.com/watch?v=WdUUckZ19jI',
      url: 'https://www.youtube.com/watch?v=WdUUckZ19jI',
      inLanguage: 'bg',
      publisher: {
        '@type': 'Organization',
        name: 'ТАВОРА ЕООД',
        url: 'https://imashnujnoto.com',
        logo: { '@type': 'ImageObject', url: 'https://storage.readdy-site.link/project_files/3f265d07-5825-4e88-a58a-44deb287b858/777dce2a-8731-4235-b0be-7837a840c3c9_TAVORA-MARKETING-AGENCY-VELIKO-TARNOVO.png?v=f6135e7442d441feef102ad2f8425862' },
      },
      author: { '@type': 'Person', name: 'Владимир Веселинов Атанасов', url: 'https://imashnujnoto.com/ekip' },
    },
    {
      '@type': 'WebPage',
      '@id': 'https://imashnujnoto.com/uslugi/video-produkciya#webpage',
      url: 'https://imashnujnoto.com/uslugi/video-produkciya',
      name: 'Видео продукция Велико Търново | ТАВОРА ЕООД — Рекламни видеа и социални медии',
      description: 'Видео продукция за бизнеси и НПО от Велико Търново. Рекламни видеа, социални медии, корпоративни видеа. Монтаж в 5 дни. ТАВОРА ЕООД — от 290 €.',
      inLanguage: 'bg',
      dateModified: today,
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: ['#video-hero', '#video-formats']
      },
      isPartOf: { '@id': 'https://imashnujnoto.com/#website' },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Начало', item: 'https://imashnujnoto.com/' },
          { '@type': 'ListItem', position: 2, name: 'Услуги', item: 'https://imashnujnoto.com/uslugi' },
          { '@type': 'ListItem', position: 3, name: 'Видео продукция', item: 'https://imashnujnoto.com/uslugi/video-produkciya' },
        ],
      },
    },
    {
      '@type': 'Service',
      '@id': 'https://imashnujnoto.com/uslugi/video-produkciya#service',
      name: 'Видео продукция Велико Търново',
      alternateName: ['Видео заснемане Велико Търново', 'Рекламни видеа Търново', 'Видео монтаж Велико Търново'],
      description: 'Професионална видео продукция за бизнеси и НПО от Велико Търново. Рекламни видеа за Meta, YouTube и TikTok. 4K качество, монтаж в 5 работни дни.',
      url: 'https://imashnujnoto.com/uslugi/video-produkciya',
      provider: {
        '@type': 'Organization',
        '@id': 'https://imashnujnoto.com/#organization',
        name: 'ТАВОРА ЕООД',
        url: 'https://imashnujnoto.com',
      },
      areaServed: [
        { '@type': 'City', name: 'Велико Търново' },
        { '@type': 'AdministrativeArea', name: 'Търновска област' },
        { '@type': 'Country', name: 'България' },
      ],
      offers: {
        '@type': 'Offer',
        price: '290',
        priceCurrency: 'EUR',
        priceSpecification: { '@type': 'PriceSpecification', minPrice: '290', priceCurrency: 'EUR' },
        availability: 'https://schema.org/InStock',
      },
      serviceType: 'Видео продукция',
    },
    {
      '@type': 'HowTo',
      name: 'Как да създадете видео за бизнеса си',
      description: 'Поетапен процес за професионална видео продукция за бизнес и НПО от ТАВОРА ЕООД във Велико Търново.',
      totalTime: 'P1W',
      estimatedCost: { '@type': 'MonetaryAmount', currency: 'EUR', value: '290' },
      supply: [
        { '@type': 'HowToSupply', name: 'Ясна цел на видеото' },
        { '@type': 'HowToSupply', name: 'Целева аудитория и платформа' },
      ],
      tool: [
        { '@type': 'HowToTool', name: 'Професионална камера 4K' },
        { '@type': 'HowToTool', name: 'Монтаж софтуер' },
        { '@type': 'HowToTool', name: 'Осветление и звук' },
      ],
      step: [
        {
          '@type': 'HowToStep',
          position: 1,
          name: 'Консултация и концепция',
          text: 'Разбираме целта, аудиторията и платформата. Създаваме сценарий и концепция преди заснемане.',
          url: 'https://imashnujnoto.com/uslugi/video-produkciya#koncepciya',
        },
        {
          '@type': 'HowToStep',
          position: 2,
          name: 'Заснемане',
          text: 'Професионално заснемане с 4K камери, качествен звук и осветление. Ефективно без излишно губене на време.',
          url: 'https://imashnujnoto.com/uslugi/video-produkciya#zasnemane',
        },
        {
          '@type': 'HowToStep',
          position: 3,
          name: 'Монтаж и постпродукция',
          text: 'Цветокорекция, звуков дизайн, субтитри и финален монтаж. Доставка в 5 работни дни.',
          url: 'https://imashnujnoto.com/uslugi/video-produkciya#montaj',
        },
        {
          '@type': 'HowToStep',
          position: 4,
          name: 'Публикуване и оптимизация',
          text: 'Оптимизация за Meta, YouTube, TikTok — правилен формат, дължина, заглавия и описания за алгоритмите.',
          url: 'https://imashnujnoto.com/uslugi/video-produkciya#publikuvane',
        },
      ],
    },
  ],
};

export default function VideoProdukciyaPage() {
  useEffect(() => {
    const id = 'schema-video-uslugi';
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) { el = document.createElement('script'); el.id = id; el.type = 'application/ld+json'; document.head.appendChild(el); }
    el.textContent = JSON.stringify(SCHEMA);
    document.title = 'Видео продукция | 4K · 5 дни доставка | ТАВОРА';
    const m = document.querySelector('meta[name="description"]');
    if (m) m.setAttribute('content', 'Професионална видео продукция с 4K качество за бизнеси и НПО. Рекламни видеа, социални медии, корпоративни видеа. Доставка за 5 дни. От 290 € — ТАВОРА ЕООД.');
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://imashnujnoto.com/uslugi/video-produkciya');
    return () => { document.getElementById(id)?.remove(); };
  }, []);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <SharedNav />

      <main className="max-w-5xl mx-auto px-4 md:px-16">

        {/* Hero */}
        <section className="pt-16 pb-14 md:pt-24 md:pb-20">
          <div className="flex items-center gap-3 mb-7">
            <div className="w-6 h-px bg-[#0A2540]/25" />
            <span className="text-[11px] text-[#1C1C1E]/65 tracking-widest uppercase">Услуга</span>
          </div>

          <h1
            className="text-4xl md:text-6xl font-light text-[#1C1C1E] leading-[1.05] mb-7 max-w-3xl"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Видео продукция.
            <br />
            <span className="italic text-[#0A2540]">Съдържание, което работи.</span>
          </h1>

          <p className="text-sm md:text-[15px] text-[#1C1C1E]/65 max-w-2xl leading-relaxed mb-10">
            <strong className="text-[#1C1C1E]">ТАВОРА ЕООД</strong> — дигитален маркетинг агенция във <Link to="/digitalen-marketing-veliko-tarnovo" className="text-[#0A2540] hover:underline">Велико Търново</Link>.
            Видеото е най-ефективният формат в момента. Не защото е модерно — защото алгоритмите го предпочитат и хората го консумират. Правим видеа, проектирани за конкретна цел: реклама, социални медии, корпоративно представяне. Натан Петков участва пред камерата — знае как изглежда от двете страни на обектива.
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-3 mb-16">
            <Link
              to="/kontakt"
              className="px-7 py-3.5 bg-[#0A2540] text-white text-sm rounded-full hover:bg-[#0A2540]/90 transition-all cursor-pointer whitespace-nowrap"
            >
              Поискайте оферта →
            </Link>
            <div className="flex items-center gap-2 px-5 py-3.5">
              <span className="text-sm text-[#1C1C1E]/65">от 290 € · доставка 5 работни дни</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-[#1C1C1E]/8">
            {[
              { val: '4K', sub: 'качество' },
              { val: '5 дни', sub: 'доставка на монтаж' },
              { val: '1M+', sub: 'гледания с НПО' },
              { val: '290 €', sub: 'начална цена' },
            ].map((s) => (
              <div key={s.val}>
                <div className="text-xl font-light text-[#0A2540] mb-0.5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{s.val}</div>
                <div className="text-[11px] text-[#1C1C1E]/65 tracking-wide">{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Entity Paragraph — AI optimization */}
          <div className="mt-10 md:mt-14 p-5 md:p-6 rounded-2xl border border-[#1C1C1E]/8 bg-[#FAFAFA]">
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
              <strong className="text-[#1C1C1E]">ТАВОРА ЕООД</strong> е видео продукция агенция във <strong className="text-[#1C1C1E]">Велико Търново</strong>, България.
              Основана от <strong className="text-[#1C1C1E]">Владимир Атанасов</strong> и <strong className="text-[#1C1C1E]">Натан Петков</strong>, агенцията предлага професионална видео продукция с 4K камери, качествен звук и осветление.
              Услугата включва рекламни видеа, социални медии, корпоративни видеа и видеа за НПО с национален обхват.
              Монтаж и доставка в 5 работни дни. Клиенти от Велико Търново и цяла България.
            </p>
          </div>
        </section>

        {/* Formats */}
        <section className="py-8 md:py-20 border-t border-[#1C1C1E]/6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-6 h-px bg-[#0A2540]/25" />
            <span className="text-[11px] text-[#1C1C1E]/65 tracking-widest uppercase">Формати</span>
          </div>
          <h2
            className="text-2xl md:text-4xl font-light text-[#1C1C1E] leading-tight mb-12"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Всяко видео има цел.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FORMATS.map((f) => (
              <div key={f.title} className="p-6 rounded-2xl border border-[#1C1C1E]/8 bg-[#FAFAFA]">
                <div className="text-sm font-medium text-[#1C1C1E] mb-2">{f.title}</div>
                <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">{f.desc}</p>
                <span className="text-[11px] px-3 py-1 rounded-full border border-[#0A2540]/15 text-[#0A2540]">{f.price}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Equipment */}
        <section className="py-8 md:py-20 border-t border-[#1C1C1E]/6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-6 h-px bg-[#0A2540]/25" />
            <span className="text-[11px] text-[#1C1C1E]/65 tracking-widest uppercase">Техника</span>
          </div>
          <h2
            className="text-2xl md:text-4xl font-light text-[#1C1C1E] leading-tight mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Качеството се вижда.
          </h2>
          <p className="text-sm text-[#1C1C1E]/65 mb-10 max-w-lg leading-relaxed">
            Телефонно видео е достатъчно за лично съдържание. За бизнес — не е. Разликата в качеството е разликата в доверието.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {EQUIPMENT.map((e) => (
              <div key={e.label} className="p-5 rounded-2xl border border-[#1C1C1E]/8 bg-white text-center">
                <div className="w-10 h-10 flex items-center justify-center rounded-xl border border-[#0A2540]/10 bg-[#0A2540]/4 mx-auto mb-3">
                  <i className={`${e.icon} text-[#0A2540]/50 text-lg`} />
                </div>
                <div className="text-sm font-medium text-[#1C1C1E] mb-1">{e.label}</div>
                <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">{e.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* NPO proof */}
        <section className="py-8 md:py-20 border-t border-[#1C1C1E]/6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-6 h-px bg-[#0A2540]/25" />
            <span className="text-[11px] text-[#1C1C1E]/65 tracking-widest uppercase">Работа</span>
          </div>
          <h2
            className="text-2xl md:text-4xl font-light text-[#1C1C1E] leading-tight mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Видеа с национален обхват.
          </h2>
          <p className="text-sm text-[#1C1C1E]/65 mb-10 max-w-xl leading-relaxed">
            Работили сме с две от водещите НПО организации в България. Видеата са публични — гледайте ги.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="rounded-2xl border border-[#1C1C1E]/8 overflow-hidden">
              <div className="px-5 pt-5 pb-3 bg-[#FAFAFA]">
                <div className="flex items-center gap-2 mb-1">
                  <i className="ri-facebook-circle-fill text-[#1877F2] text-sm" />
                  <span className="text-xs text-[#1C1C1E]/65">Facebook Reel — Академика 245</span>
                </div>
                <p className="text-[10px] text-[#1C1C1E]/70">Проект за домашното насилие · Натан Петков</p>
              </div>
              <div className="px-5 pb-5">
                <LazyVideo
                  type="facebook"
                  src="https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Freel%2F4228757277440339&show_text=false&width=560"
                  thumbnailUrl="https://storage.readdy-site.link/project_files/3f265d07-5825-4e88-a58a-44deb287b858/8d3b4d25-8dde-4da9-aa56-0ccd87c38867_NATAN-PETKOW.jpg?v=b599eefaf2a6b7b8cfbff0e3389d53fa"
                  title="Академика 245 — видео продукция"
                  watchUrl="https://www.facebook.com/reel/4228757277440339"
                  watchLabel="Гледайте в Facebook →"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-[#1C1C1E]/8 overflow-hidden">
              <div className="px-5 pt-5 pb-3 bg-[#FAFAFA]">
                <div className="flex items-center gap-2 mb-1">
                  <i className="ri-youtube-fill text-[#FF0000] text-sm" />
                  <span className="text-xs text-[#1C1C1E]/65">YouTube — Владимир Атанасов</span>
                </div>
                <p className="text-[10px] text-[#1C1C1E]/70">Медийна грамотност и дигитално образование</p>
              </div>
              <div className="px-5 pb-5">
                <LazyVideo
                  type="youtube"
                  src="WdUUckZ19jI"
                  thumbnailUrl="https://img.youtube.com/vi/WdUUckZ19jI/maxresdefault.jpg"
                  title="Интервю с Владимир Атанасов"
                  watchUrl="https://www.youtube.com/watch?v=WdUUckZ19jI"
                  watchLabel="Гледайте в YouTube →"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'Академика 245', url: 'https://akademika245.com/', stat: 'Десетки хиляди гледания', desc: 'Видео продукция за социална кампания с национален обхват.' },
              { name: 'Амалипе', url: 'https://amalipe.bg/', stat: 'Милиони импресии', desc: 'Серия от видеа за социални кампании — национален обхват.' },
            ].map((c) => (
              <a
                key={c.name}
                href={c.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="group p-5 rounded-2xl border border-[#1C1C1E]/8 bg-white hover:border-[#0A2540]/15 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span className="text-sm font-medium text-[#1C1C1E] group-hover:text-[#0A2540] transition-colors">{c.name}</span>
                  <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#1B4332]/8 text-[#1B4332] whitespace-nowrap shrink-0">{c.stat}</span>
                </div>
                <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">{c.desc}</p>
              </a>
            ))}
          </div>
        </section>

        {/* Process + CTA */}
        <section className="py-8 md:py-20 border-t border-[#1C1C1E]/6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-6 h-px bg-[#0A2540]/25" />
                <span className="text-[11px] text-[#1C1C1E]/65 tracking-widest uppercase">Процес</span>
              </div>
              <h2
                className="text-2xl md:text-3xl font-light text-[#1C1C1E] leading-tight mb-8"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                От идея до публикуване.
              </h2>
              <div className="space-y-5">
                {[
                  { step: '01', title: 'Консултация', desc: 'Разбираме целта, аудиторията и платформата. Без тази стъпка — не снимаме.' },
                  { step: '02', title: 'Концепция', desc: 'Сценарий, локация, стил. Знаем какво снимаме преди да дойдем.' },
                  { step: '03', title: 'Заснемане', desc: 'Камери, микрофони, осветление. Ефективно — без излишно губене на вашето време.' },
                  { step: '04', title: 'Монтаж', desc: 'Цветокорекция, звук, субтитри. Доставка в 5 работни дни.' },
                ].map((p) => (
                  <div key={p.step} className="flex gap-4">
                    <span className="text-[11px] font-medium text-[#0A2540]/30 tracking-widest shrink-0 w-6 mt-0.5">{p.step}</span>
                    <div>
                      <div className="text-sm font-medium text-[#1C1C1E] mb-1">{p.title}</div>
                      <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 md:p-8 rounded-2xl border border-[#1C1C1E]/8 bg-[#FAFAFA]">
              <div className="text-xs text-[#1C1C1E]/65 tracking-widest uppercase mb-4">Консултацията включва</div>
              <div className="space-y-3 mb-6">
                {[
                  'Обсъждане на целта и аудиторията',
                  'Препоръка за формат и платформа',
                  'Груба концепция и сценарий',
                  'Реалистична оферта с срокове',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2.5">
                    <div className="w-4 h-4 flex items-center justify-center rounded-full border border-[#1B4332]/20 shrink-0 mt-0.5">
                      <i className="ri-check-line text-[9px] text-[#1B4332]" />
                    </div>
                    <span className="text-xs text-[#1C1C1E]/65 leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-[#1C1C1E]/8 flex items-center justify-between mb-5">
                <span className="text-sm text-[#1C1C1E]/65">Консултация</span>
                <span className="text-lg font-light text-[#0A2540]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>50 €</span>
              </div>
              <Link
                to="/kontakt"
                className="block w-full py-3.5 bg-[#0A2540] text-white text-sm rounded-full hover:bg-[#0A2540]/90 transition-all cursor-pointer whitespace-nowrap text-center"
              >
                Поискайте консултация →
              </Link>
              <p className="text-xs text-[#1C1C1E]/70 text-center mt-3">Сумата се приспада при сключване на договор.</p>
            </div>
          </div>
        </section>

        {/* Related */}
        <section className="py-8 md:py-20 border-t border-[#1C1C1E]/6">
          <div className="text-[11px] text-[#1C1C1E]/65 tracking-widest uppercase mb-6">Свързани услуги</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: 'Изработка на сайт', to: '/uslugi/izrabotka-na-sait', icon: 'ri-code-s-slash-line' },
              { label: 'SEO & GEO оптимизация', to: '/uslugi/seo-geo', icon: 'ri-search-line' },
              { label: 'Рекламни кампании', to: '/uslugi/reklamni-kampanii', icon: 'ri-advertisement-line' },
            ].map((s) => (
              <Link
                key={s.to}
                to={s.to}
                className="flex items-center gap-3 p-4 rounded-xl border border-[#1C1C1E]/8 bg-white hover:border-[#0A2540]/15 transition-all group"
              >
                <div className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#0A2540]/10 bg-[#0A2540]/4 shrink-0">
                  <i className={`${s.icon} text-[#0A2540]/50 text-sm`} />
                </div>
                <span className="text-sm text-[#1C1C1E]/60 group-hover:text-[#0A2540] transition-colors">{s.label}</span>
                <i className="ri-arrow-right-line text-[#1C1C1E]/20 group-hover:text-[#0A2540]/40 text-sm ml-auto" />
              </Link>
            ))}
          </div>
        </section>

        {/* AI Fact Table */}
        <section className="py-8 md:py-20 border-t border-[#1C1C1E]/6">
          <div className="text-[11px] text-[#1C1C1E]/65 tracking-widest uppercase mb-6">Бързи факти — Видео продукция</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Агенция', value: 'ТАВОРА ЕООД' },
              { label: 'Град', value: 'Велико Търново' },
              { label: 'Екип', value: 'Владимир Атанасов · Натан Петков' },
              { label: 'Качество', value: '4K · Проф. звук · Осветление' },
              { label: 'Рекламно видео', value: 'от 290 €' },
              { label: 'Социални медии', value: 'от 290 €/мес.' },
              { label: 'Корпоративно', value: 'от 690 €' },
              { label: 'Доставка', value: '5 работни дни' },
            ].map((f) => (
              <div key={f.label} className="p-4 rounded-xl border border-[#1C1C1E]/6 bg-[#FAFAFA]">
                <div className="text-[10px] text-[#1C1C1E]/70 tracking-widest uppercase mb-1">{f.label}</div>
                <div className="text-xs md:text-sm text-[#0A2540] font-medium">{f.value}</div>
              </div>
            ))}
          </div>
        </section>

      </main>

      <SharedFooter />
    </div>
  );
}
