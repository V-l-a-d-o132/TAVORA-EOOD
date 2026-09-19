import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SharedNav from '@/components/feature/SharedNav';
import SharedFooter from '@/components/feature/SharedFooter';
import LazyVideo from '@/components/feature/LazyVideo';

const FAQ_ITEMS = [
  {
    q: 'Колко струва видео продукцията за бизнес във Велико Търново?',
    a: 'Рекламните видеа за бизнеси започват от 290 € на проект. Видеата за социални медии — от 290 € на месец. Консултацията е 50 € и включва обсъждане на концепция, бюджет и срокове. Тази сума се приспада при сключване на договор.',
  },
  {
    q: 'Колко бързо е доставката на монтажа?',
    a: 'Стандартната доставка е 5 работни дни след заснемането. При спешни проекти можем да ускорим срока — обсъждаме индивидуално.',
  },
  {
    q: 'Заснемате ли само в Търново или и в други градове?',
    a: 'Заснемаме в Търново и цяла България. Пътните разходи извън Търново се уточняват индивидуално.',
  },
  {
    q: 'Какво оборудване използвате?',
    a: 'Работим с професионални камери (4K), микрофони и осветление. Натан Петков участва пред камерата — знае какво работи от двете страни на обектива.',
  },
  {
    q: 'Има ли гаранция за качеството?',
    a: 'Всяка услуга (без консултацията от 50 €) идва с гаранция за връщане на парите. Ако не сте доволни от резултата, връщаме сумата без въпроси.',
  },
];

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://imashnujnoto.com/video-produkciya-veliko-tarnovo#webpage',
      url: 'https://imashnujnoto.com/video-produkciya-veliko-tarnovo',
      name: 'Видео продукция Велико Търново | Професионално заснемане на реклами — ТАВОРА ЕООД',
      description:
        'Професионално заснемане на реклами и видеа във Велико Търново и областта. Камери, микрофони, осветление. Видео за бизнеси, НПО и събития. ТАВОРА ЕООД.',
      inLanguage: 'bg',
      isPartOf: { '@id': 'https://imashnujnoto.com/#website' },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Начало', item: 'https://imashnujnoto.com/' },
          { '@type': 'ListItem', position: 2, name: 'Видео продукция Велико Търново', item: 'https://imashnujnoto.com/video-produkciya-veliko-tarnovo' },
        ],
      },
      dateModified: '2026-05-05',
    },
    {
      '@type': 'VideoObject',
      '@id': 'https://imashnujnoto.com/video-produkciya-veliko-tarnovo#video-akademika',
      name: 'Видео продукция за НПО — Академика 245 | ТАВОРА ЕООД Велико Търново',
      description: 'Видео продукция с Натан Петков по проект за домашното насилие — кампания с национален обхват. Милиони импресии в социалните медии.',
      uploadDate: '2024-09-01',
      thumbnailUrl: 'https://readdy.ai/api/search-image?query=professional%20video%20production%20filming%20camera%20crew%20NGO%20social%20campaign%20Bulgaria%20Veliko%20Tarnovo%20documentary&width=1280&height=720&seq=video-thumb-vt-1&orientation=landscape',
      embedUrl: 'https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Freel%2F4228757277440339&show_text=false&width=560',
      url: 'https://www.facebook.com/reel/4228757277440339',
      inLanguage: 'bg',
      publisher: {
        '@type': 'Organization',
        name: 'ТАВОРА ЕООД',
        legalName: 'ТАВОРА ЕООД',
        url: 'https://imashnujnoto.com',
        logo: { '@type': 'ImageObject', url: 'https://storage.readdy-site.link/project_files/3f265d07-5825-4e88-a58a-44deb287b858/777dce2a-8731-4235-b0be-7837a840c3c9_TAVORA-MARKETING-AGENCY-VELIKO-TARNOVO.png?v=f6135e7442d441feef102ad2f8425862' },
      },
      author: {
        '@type': 'Person',
        name: 'Владимир Веселинов Атанасов',
        url: 'https://imashnujnoto.com/ekip',
      },
    },
    {
      '@type': 'VideoObject',
      '@id': 'https://imashnujnoto.com/video-produkciya-veliko-tarnovo#video-interview',
      name: 'Интервю с Владимир Атанасов — медийна грамотност и дигитално образование',
      description: 'Интервю с Владимир Атанасов от ТАВОРА ЕООД за медийната грамотност и дигиталното образование в България.',
      uploadDate: '2024-06-01',
      thumbnailUrl: 'https://img.youtube.com/vi/WdUUckZ19jI/maxresdefault.jpg',
      embedUrl: 'https://www.youtube.com/embed/WdUUckZ19jI',
      contentUrl: 'https://www.youtube.com/watch?v=WdUUckZ19jI',
      url: 'https://www.youtube.com/watch?v=WdUUckZ19jI',
      inLanguage: 'bg',
      publisher: {
        '@type': 'Organization',
        name: 'ТАВОРА ЕООД',
        legalName: 'ТАВОРА ЕООД',
        url: 'https://imashnujnoto.com',
        logo: { '@type': 'ImageObject', url: 'https://storage.readdy-site.link/project_files/3f265d07-5825-4e88-a58a-44deb287b858/777dce2a-8731-4235-b0be-7837a840c3c9_TAVORA-MARKETING-AGENCY-VELIKO-TARNOVO.png?v=f6135e7442d441feef102ad2f8425862' },
      },
      author: {
        '@type': 'Person',
        name: 'Владимир Веселинов Атанасов',
        url: 'https://imashnujnoto.com/ekip',
      },
    },
    {
      '@type': 'LocalBusiness',
      '@id': 'https://imashnujnoto.com/#organization',
      name: 'ТАВОРА ЕООД',
      alternateName: ['Tavora', 'Имаш нужното', 'imashnujnoto'],
      legalName: 'ТАВОРА ЕООД',
      taxID: '208438650',
      telephone: '+359885189724',
      priceRange: '€€',
      description: 'Професионално заснемане на реклами и видеа във Велико Търново и цяла България.',
      url: 'https://imashnujnoto.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'ул. "Велчо Джамджията"',
        addressLocality: 'Велико Търново',
        postalCode: '5000',
        addressCountry: 'BG',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 43.0785,
        longitude: 25.6415,
      },
      openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '09:00', closes: '18:00' }],
      areaServed: [
        { '@type': 'City', name: 'Велико Търново' },
        { '@type': 'AdministrativeArea', name: 'Търновска област' },
        { '@type': 'Country', name: 'България' },
      ],
      founder: { '@type': 'Person', name: 'Владимир Веселинов Атанасов' },
      serviceType: ['Видео продукция', 'Рекламни видеа', 'Видеа за НПО', 'Видео заснемане', 'Видео монтаж'],
    },
  ],
};

const services = [
  {
    icon: 'ri-store-2-line',
    title: 'Рекламни видеа за бизнеси',
    desc: 'Професионално заснемане на реклами за ресторанти, хотели, магазини и услуги във Велико Търново. Камери, микрофони, осветление.',
    price: 'от 290 €',
  },
  {
    icon: 'ri-heart-3-line',
    title: 'Видеа за НПО организации',
    desc: 'Видео продукция за социални кампании и НПО проекти. Над 1 000 000 гледания с Академика 245 и Амалипе.',
    price: 'по запитване',
  },
  {
    icon: 'ri-calendar-event-line',
    title: 'Видео за събития',
    desc: 'Заснемане на корпоративни събития, конференции, откривания и специални поводи в Търново и областта.',
    price: 'от 390 € / събитие',
  },
  {
    icon: 'ri-smartphone-line',
    title: 'Видео за социални медии',
    desc: 'Кратки, ефективни видеа за TikTok, Instagram Reels, Facebook и YouTube Shorts. Оптимизирани за алгоритмите.',
    price: 'от 290 € / мес.',
  },
];

const equipment = [
  { icon: 'ri-camera-line', label: 'Професионални камери', desc: '4K качество, стабилизация, множество обективи' },
  { icon: 'ri-mic-line', label: 'Професионални микрофони', desc: 'Чист звук — без шум и ехо' },
  { icon: 'ri-sun-line', label: 'Осветление', desc: 'Студийно и локационно осветление за всяка ситуация' },
  { icon: 'ri-movie-line', label: 'Монтаж и цветокорекция', desc: 'Професионален монтаж — доставка в 5 работни дни' },
];

export default function VideoProdukciyaVelikoTarnovoPage() {
  useEffect(() => {
    const id = 'schema-video';
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement('script');
      el.id = id;
      el.type = 'application/ld+json';
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(SCHEMA);

    const faqId = 'schema-video-faq';
    let faqEl = document.getElementById(faqId) as HTMLScriptElement | null;
    if (!faqEl) {
      faqEl = document.createElement('script');
      faqEl.id = faqId;
      faqEl.type = 'application/ld+json';
      document.head.appendChild(faqEl);
    }
    faqEl.textContent = JSON.stringify(FAQ_SCHEMA);

    document.title = 'Видео продукция Велико Търново | Професионално заснемане на реклами — ТАВОРА ЕООД';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Професионално заснемане на реклами и видеа във Велико Търново и областта. Камери, микрофони, осветление. Видео за бизнеси, НПО и събития. ТАВОРА ЕООД.');
    }

    return () => {
      const existing = document.getElementById(id);
      if (existing) existing.remove();
      const existingFaq = document.getElementById(faqId);
      if (existingFaq) existingFaq.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <SharedNav />

      <main className="max-w-6xl mx-auto px-4 md:px-16">
        {/* Hero */}
        <div className="py-6 md:py-24">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <div className="w-8 h-[1px] bg-[#0A2540]/30 shrink-0" />
            <span className="text-xs text-[#1C1C1E]/60">Видео продукция · Велико Търново</span>
          </div>

          <h1
            className="text-3xl md:text-5xl lg:text-6xl font-light text-[#1C1C1E] leading-tight mb-6"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Професионално заснемане
            <br />
            <span className="italic text-[#0A2540]">на реклами във Велико Търново.</span>
          </h1>

          <p className="text-sm md:text-base text-[#1C1C1E]/65 max-w-2xl leading-relaxed mb-8">
            Камери, микрофони, осветление — професионална техника за професионални резултати.
            <strong className="text-[#0A2540]"> ТАВОРА ЕООД</strong> заснема реклами, видеа за НПО и събития
            във Велико Търново и цяла България. Натан Петков участва пред камерата — знае какво работи.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-6 md:mb-12">
            <Link
              to="/kontakt"
              className="px-7 py-3.5 bg-[#0A2540] text-white text-sm tracking-wide rounded-full hover:bg-[#0A2540]/90 transition-all duration-300 cursor-pointer whitespace-nowrap text-center"
            >
              Поискайте оферта →
            </Link>
            <Link
              to="/npo-video"
              className="px-7 py-3.5 border border-[#1C1C1E]/12 text-[#1C1C1E]/65 text-sm tracking-wide rounded-full hover:border-[#0A2540]/30 hover:text-[#0A2540] transition-all duration-300 cursor-pointer whitespace-nowrap text-center"
            >
              Видеа за НПО →
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 pt-8 border-t border-[#1C1C1E]/8">
            {[
              { value: '1M+', label: 'общо гледания' },
              { value: '4K', label: 'качество на заснемане' },
              { value: '5 дни', label: 'доставка на монтаж' },
              { value: 'Проф.', label: 'техника и екип' },
            ].map((s) => (
              <div key={s.value} className="text-center">
                <div className="text-lg md:text-xl font-light text-[#0A2540] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {s.value}
                </div>
                <div className="text-[10px] text-[#1C1C1E]/65 tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Services */}
        <div className="py-5 md:py-20 border-t border-[#1C1C1E]/6">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <div className="w-8 h-[1px] bg-[#0A2540]/30 shrink-0" />
            <span className="text-xs text-[#1C1C1E]/60">Услуги</span>
          </div>

          <h2
            className="text-2xl md:text-4xl font-light text-[#1C1C1E] leading-tight mb-6 md:mb-10"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Видеа за
            <br />
            <span className="italic text-[#0A2540]">бизнеси, НПО и събития.</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {services.map((s) => (
              <div
                key={s.title}
                className="p-4 md:p-6 rounded-2xl border border-[#1C1C1E]/8 bg-[#F9F9F9] hover:border-[#0A2540]/15 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#0A2540]/10 bg-[#0A2540]/4">
                    <i className={`${s.icon} text-[#0A2540]/60 text-base`} />
                  </div>
                  <span className="text-sm font-medium text-[#1C1C1E]">{s.title}</span>
                </div>
                <p className="text-xs text-[#1C1C1E]/65 leading-relaxed mb-3">{s.desc}</p>
                <span className="inline-block text-[11px] px-2.5 py-1 rounded-full border border-[#0A2540]/15 text-[#0A2540] font-medium">
                  {s.price}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Equipment */}
        <div className="py-5 md:py-20 border-t border-[#1C1C1E]/6">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <div className="w-8 h-[1px] bg-[#0A2540]/30 shrink-0" />
            <span className="text-xs text-[#1C1C1E]/60">Техника</span>
          </div>

          <h2
            className="text-2xl md:text-4xl font-light text-[#1C1C1E] leading-tight mb-6 md:mb-10"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Професионална техника
            <br />
            <span className="italic text-[#0A2540]">за професионални резултати.</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {equipment.map((e) => (
              <div
                key={e.label}
                className="p-4 md:p-5 rounded-2xl border border-[#1C1C1E]/8 bg-white text-center"
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-xl border border-[#0A2540]/10 bg-[#0A2540]/4 mx-auto mb-3">
                  <i className={`${e.icon} text-[#0A2540]/60 text-lg`} />
                </div>
                <div className="text-sm font-medium text-[#1C1C1E] mb-1">{e.label}</div>
                <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">{e.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* NPO showcase */}
        <div className="py-5 md:py-20 border-t border-[#1C1C1E]/6">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <div className="w-8 h-[1px] bg-[#0A2540]/30 shrink-0" />
            <span className="text-xs text-[#1C1C1E]/60">НПО проекти</span>
          </div>

          <h2
            className="text-2xl md:text-4xl font-light text-[#1C1C1E] leading-tight mb-6"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Видеа за НПО
            <br />
            <span className="italic text-[#0A2540]">с милиони импресии.</span>
          </h2>

          <p className="text-sm text-[#1C1C1E]/65 max-w-xl leading-relaxed mb-8">
            Работили сме с две от водещите НПО организации в България — Академика 245 и Амалипе.
            Видео продукция за социални кампании с национален обхват и милиони импресии в социалните медии.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-8">
            <div className="rounded-2xl border border-[#1C1C1E]/8 bg-[#F9F9F9] overflow-hidden">
              <div className="px-5 pt-5 pb-3">
                <div className="flex items-center gap-2 mb-1">
                  <i className="ri-facebook-circle-fill text-[#1877F2] text-base" />
                  <span className="text-xs font-medium text-[#1C1C1E]/60">Facebook Reel — Академика 245</span>
                </div>
                <p className="text-[10px] text-[#1C1C1E]/65">Видео продукция с Натан Петков по проект за домашното насилие.</p>
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

            <div className="rounded-2xl border border-[#1C1C1E]/8 bg-[#F9F9F9] overflow-hidden">
              <div className="px-5 pt-5 pb-3">
                <div className="flex items-center gap-2 mb-1">
                  <i className="ri-youtube-fill text-[#FF0000] text-base" />
                  <span className="text-xs font-medium text-[#1C1C1E]/60">YouTube — Интервю с Владимир Атанасов</span>
                </div>
                <p className="text-[10px] text-[#1C1C1E]/65">За медийната грамотност и дигиталното образование.</p>
              </div>
              <div className="px-5 pb-5">
                <LazyVideo
                  type="youtube"
                  src="WdUUckZ19jI"
                  thumbnailUrl="https://img.youtube.com/vi/WdUUckZ19jI/maxresdefault.jpg"
                  title="Интервю с Владимир Атанасов — медийна грамотност"
                  watchUrl="https://www.youtube.com/watch?v=WdUUckZ19jI"
                  watchLabel="Гледайте в YouTube →"
                />
              </div>
            </div>
          </div>

          <Link
            to="/npo-video"
            className="inline-flex items-center gap-1.5 text-sm text-[#0A2540] hover:underline decoration-dotted"
          >
            Вижте повече за видеа за НПО →
          </Link>
        </div>

        {/* FAQ */}
        <div className="py-5 md:py-20 border-t border-[#1C1C1E]/6">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <div className="w-8 h-[1px] bg-[#0A2540]/30 shrink-0" />
            <span className="text-xs text-[#1C1C1E]/60">Въпроси и отговори</span>
          </div>
          <h2
            className="text-2xl md:text-4xl font-light text-[#1C1C1E] leading-tight mb-6 md:mb-10"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Често задавани
            <br />
            <span className="italic text-[#0A2540]">въпроси за видео.</span>
          </h2>
          <div className="space-y-3 mb-10">
            {FAQ_ITEMS.map((item) => (
              <details key={item.q} className="group rounded-2xl border border-[#1C1C1E]/8 bg-[#F9F9F9] overflow-hidden">
                <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none">
                  <span className="text-sm font-medium text-[#1C1C1E]">{item.q}</span>
                  <i className="ri-add-line text-[#0A2540]/50 text-base shrink-0 group-open:hidden" />
                  <i className="ri-subtract-line text-[#0A2540]/50 text-base shrink-0 hidden group-open:block" />
                </summary>
                <div className="px-5 pb-4">
                  <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">{item.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="py-5 md:py-20 border-t border-[#1C1C1E]/6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 p-4 md:p-8 rounded-2xl border border-[#1C1C1E]/8 bg-[#F9F9F9]">
            <div>
              <div
                className="text-xl md:text-2xl font-light text-[#1C1C1E] mb-1"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Имате идея за видео?
              </div>
              <p className="text-sm text-[#1C1C1E]/65">
                Консултацията е 50 € — обсъждаме концепция, бюджет и срокове. Сумата се приспада при договор. Гаранция за връщане на парите.
              </p>
            </div>
            <Link
              to="/kontakt"
              className="px-7 py-3.5 bg-[#0A2540] text-white text-sm rounded-full hover:bg-[#0A2540]/90 transition-all cursor-pointer whitespace-nowrap text-center shrink-0"
            >
              Поискайте оферта →
            </Link>
          </div>
        </div>
      </main>

      <SharedFooter />
    </div>
  );
}