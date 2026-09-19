import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SharedNav from '@/components/feature/SharedNav';
import SharedFooter from '@/components/feature/SharedFooter';
import LazyVideo from '@/components/feature/LazyVideo';

const FAQ_ITEMS = [
  {
    q: 'Работите ли с малки НПО организации или само с големи?',
    a: 'Работим с НПО от всякакъв мащаб — от малки местни организации до национални. Академика 245 и Амалипе са примери за национален мащаб, но подходът е индивидуален за всяка организация.',
  },
  {
    q: 'Колко струва видео продукцията за НПО?',
    a: 'Цената зависи от обема на проекта. Консултацията е 50 € и включва обсъждане на каузата, целите и бюджета. Тази сума се приспада при сключване на договор. Всяка услуга идва с гаранция за връщане на парите.',
  },
  {
    q: 'Колко импресии са постигнали вашите НПО видеа?',
    a: 'Видеата за Академика 245 и Амалипе са постигнали милиони импресии в социалните медии. Важно е да се разграничи: импресии (колко пъти е показано видеото) и гледания (колко пъти е изгледано). Ние говорим за милиони импресии.',
  },
  {
    q: 'Можете ли да заснемете видео за социална кауза в Търново?',
    a: 'Да — специализираме се в Велико Търново и областта, но работим и в цяла България. Заснемаме социални кампании, образователни проекти и документални материали.',
  },
  {
    q: 'Колко бързо е доставката?',
    a: 'Стандартната доставка е 5 работни дни след заснемането. При спешни проекти можем да ускорим — обсъждаме индивидуално.',
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
      '@id': 'https://imashnujnoto.com/npo-video#webpage',
      url: 'https://imashnujnoto.com/npo-video',
      name: 'Видеа за НПО Велико Търново | Видео продукция за организации — ТАВОРА ЕООД',
      description:
        'Видео продукция за НПО организации във Велико Търново и цяла България. Професионално заснемане за социални кампании — Академика 245, Амалипе. Над 1 000 000 гледания.',
      inLanguage: 'bg',
      isPartOf: { '@id': 'https://imashnujnoto.com/#website' },
    },
    {
      '@type': 'VideoObject',
      '@id': 'https://imashnujnoto.com/npo-video#video-akademika',
      name: 'Видео продукция за НПО — Академика 245 | ТАВОРА ЕООД',
      description: 'Видео продукция с Натан Петков по проект за домашното насилие — кампания с национален обхват. Милиони импресии в социалните медии.',
      uploadDate: '2024-09-01',
      thumbnailUrl: 'https://readdy.ai/api/search-image?query=professional%20video%20production%20NGO%20social%20campaign%20Bulgaria%20documentary%20filming&width=1280&height=720&seq=npo-thumb-1&orientation=landscape',
      embedUrl: 'https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Freel%2F4228757277440339&show_text=false&width=560',
      url: 'https://www.facebook.com/reel/4228757277440339',
      inLanguage: 'bg',
      publisher: {
        '@type': 'Organization',
        name: 'ТАВОРА ЕООД',
        legalName: 'ТАВОРА ЕООД',
        url: 'https://imashnujnoto.com',
        logo: {
          '@type': 'ImageObject',
          url: 'https://storage.readdy-site.link/project_files/3f265d07-5825-4e88-a58a-44deb287b858/777dce2a-8731-4235-b0be-7837a840c3c9_TAVORA-MARKETING-AGENCY-VELIKO-TARNOVO.png?v=f6135e7442d441feef102ad2f8425862',
        },
      },
      author: {
        '@type': 'Person',
        name: 'Владимир Веселинов Атанасов',
        url: 'https://imashnujnoto.com/ekip',
      },
      about: {
        '@type': 'Organization',
        name: 'Академика 245',
        url: 'https://akademika245.com/',
      },
    },
    {
      '@type': 'VideoObject',
      '@id': 'https://imashnujnoto.com/npo-video#video-interview',
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
        logo: {
          '@type': 'ImageObject',
          url: 'https://storage.readdy-site.link/project_files/3f265d07-5825-4e88-a58a-44deb287b858/777dce2a-8731-4235-b0be-7837a840c3c9_TAVORA-MARKETING-AGENCY-VELIKO-TARNOVO.png?v=f6135e7442d441feef102ad2f8425862',
        },
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
      alternateName: 'Tavora',
      legalName: 'ТАВОРА ЕООД',
      taxID: '208438650',
      description: 'Видео продукция за НПО организации във Велико Търново и цяла България.',
      url: 'https://imashnujnoto.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'ул. "Велчо Джамджията"',
        addressLocality: 'Велико Търново',
        postalCode: '5000',
        addressCountry: 'BG',
      },
      areaServed: [
        { '@type': 'City', name: 'Велико Търново' },
        { '@type': 'Country', name: 'България' },
      ],
      founder: { '@type': 'Person', name: 'Владимир Веселинов Атанасов' },
      serviceType: ['Видео продукция за НПО', 'Социални кампании', 'Видео заснемане', 'Видео монтаж'],
    },
  ],
};

const npos = [
  {
    name: 'Академика 245',
    url: 'https://akademika245.com/',
    project: 'Проект за домашното насилие',
    desc: 'Видео продукция с Натан Петков по проект за домашното насилие — кампания с национален обхват. Милиони импресии в социалните медии.',
    stats: [
      { value: 'Десетки', label: 'хиляди гледания' },
      { value: 'Видео', label: 'продукция' },
      { value: 'Нац.', label: 'обхват' },
    ],
  },
  {
    name: 'Амалипе',
    url: 'https://amalipe.bg/',
    project: 'Социални кампании',
    desc: 'Видео продукция за мащабни социални кампании с национален обхват. Милиони импресии в социалните медии.',
    stats: [
      { value: 'Милиони', label: 'импресии' },
      { value: 'Видео', label: 'продукция' },
      { value: 'Нац.', label: 'обхват' },
    ],
  },
];

export default function NPOVideoPage() {
  useEffect(() => {
    const id = 'schema-npo';
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement('script');
      el.id = id;
      el.type = 'application/ld+json';
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(SCHEMA);

    const faqId = 'schema-npo-faq';
    let faqEl = document.getElementById(faqId) as HTMLScriptElement | null;
    if (!faqEl) {
      faqEl = document.createElement('script');
      faqEl.id = faqId;
      faqEl.type = 'application/ld+json';
      document.head.appendChild(faqEl);
    }
    faqEl.textContent = JSON.stringify(FAQ_SCHEMA);

    document.title = 'Видеа за НПО Велико Търново | Видео продукция за организации — ТАВОРА ЕООД';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Видео продукция за НПО организации във Велико Търново и цяла България. Професионално заснемане за социални кампании — Академика 245, Амалипе. Над 1 000 000 гледания.');
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
            <span className="text-xs text-[#1C1C1E]/60">НПО · Видео продукция</span>
          </div>

          <h1
            className="text-3xl md:text-5xl lg:text-6xl font-light text-[#1C1C1E] leading-tight mb-6"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Видеа за НПО
            <br />
            <span className="italic text-[#0A2540]">във Велико Търново и България.</span>
          </h1>

          <p className="text-sm md:text-base text-[#1C1C1E]/65 max-w-2xl leading-relaxed mb-8">
            <strong className="text-[#0A2540]">ТАВОРА ЕООД</strong> заснема видеа за НПО организации —
            социални кампании, образователни проекти, документални материали.
            Работили сме с Академика 245 и Амалипе — две от водещите НПО в България.
            Над 1 000 000 гледания общо.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-6 md:mb-12">
            <Link
              to="/kontakt"
              className="px-7 py-3.5 bg-[#0A2540] text-white text-sm tracking-wide rounded-full hover:bg-[#0A2540]/90 transition-all duration-300 cursor-pointer whitespace-nowrap text-center"
            >
              Поискайте оферта →
            </Link>
            <Link
              to="/video-produkciya-veliko-tarnovo"
              className="px-7 py-3.5 border border-[#1C1C1E]/12 text-[#1C1C1E]/65 text-sm tracking-wide rounded-full hover:border-[#0A2540]/30 hover:text-[#0A2540] transition-all duration-300 cursor-pointer whitespace-nowrap text-center"
            >
              Видео за бизнеси →
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 pt-8 border-t border-[#1C1C1E]/8">
            {[
              { value: 'Млн.', label: 'импресии' },
              { value: '2', label: 'НПО партньори' },
              { value: 'Проф.', label: 'техника' },
              { value: 'BG', label: 'национален обхват' },
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

        {/* NPO Partners */}
        <div className="py-5 md:py-20 border-t border-[#1C1C1E]/6">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <div className="w-8 h-[1px] bg-[#0A2540]/30 shrink-0" />
            <span className="text-xs text-[#1C1C1E]/60">Партньори</span>
          </div>

          <h2
            className="text-2xl md:text-4xl font-light text-[#1C1C1E] leading-tight mb-6 md:mb-10"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Реални НПО,
            <br />
            <span className="italic text-[#0A2540]">реални резултати.</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {npos.map((npo) => (
              <div
                key={npo.name}
                className="p-4 md:p-6 rounded-2xl border border-[#1C1C1E]/8 bg-[#F9F9F9]"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#0A2540]/10 bg-[#0A2540]/4">
                      <i className="ri-graduation-cap-line text-[#0A2540]/60 text-base" />
                    </div>
                    <span className="text-base font-medium text-[#1C1C1E]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      {npo.name}
                    </span>
                  </div>
                  <a
                    href={npo.url}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="text-[10px] text-[#0A2540]/50 hover:text-[#0A2540] transition-colors flex items-center gap-1 whitespace-nowrap cursor-pointer"
                  >
                    <i className="ri-external-link-line text-xs" />
                    <span>Сайт</span>
                  </a>
                </div>

                <div className="h-px bg-[#1C1C1E]/6 mb-4" />

                <div className="text-xs font-medium text-[#0A2540] mb-2">{npo.project}</div>
                <p className="text-xs text-[#1C1C1E]/65 leading-relaxed mb-4">{npo.desc}</p>

                <div className="flex gap-4">
                  {npo.stats.map((st) => (
                    <div key={st.label} className="flex flex-col gap-0.5">
                      <span className="text-sm font-light text-[#0A2540]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        {st.value}
                      </span>
                      <span className="text-[10px] text-[#1C1C1E]/65 leading-tight">{st.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Videos */}
        <div className="py-5 md:py-20 border-t border-[#1C1C1E]/6">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <div className="w-8 h-[1px] bg-[#0A2540]/30 shrink-0" />
            <span className="text-xs text-[#1C1C1E]/60">Видеа</span>
          </div>

          <h2
            className="text-2xl md:text-4xl font-light text-[#1C1C1E] leading-tight mb-8"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Вижте нашата
            <br />
            <span className="italic text-[#0A2540]">работа в действие.</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
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
                  title="Академика 245 — видео продукция с Натан Петков"
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
        </div>

        {/* Why NPO video */}
        <div className="py-5 md:py-20 border-t border-[#1C1C1E]/6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              <h2
                className="text-2xl md:text-4xl font-light text-[#1C1C1E] leading-tight mb-5"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Защо видеото
                <br />
                <span className="italic text-[#0A2540]">е важно за НПО?</span>
              </h2>
              <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-6">
                Видеото е най-ефективният начин НПО организациите да достигнат аудиторията си.
                Социалните кампании с видео съдържание генерират повече ангажираност,
                повече споделяния и повече дарения. Ние знаем как да разкажем историята ви.
              </p>
              <div className="space-y-3">
                {[
                  'Видеото генерира 1200% повече споделяния от текст и снимки взети заедно',
                  'Социалните кампании с видео имат 3x по-висока конверсия',
                  'Професионалното качество изгражда доверие и авторитет',
                  'Бърза доставка — монтаж в рамките на 5 работни дни',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2.5">
                    <div className="w-5 h-5 flex items-center justify-center rounded-full border border-[#1B4332]/20 shrink-0 mt-0.5">
                      <i className="ri-check-line text-[10px] text-[#1B4332]" />
                    </div>
                    <span className="text-xs text-[#1C1C1E]/65 leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 md:p-8 rounded-2xl border border-[#1C1C1E]/8 bg-[#F9F9F9]">
              <h3
                className="text-lg font-light text-[#1C1C1E] mb-4"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Как работим с НПО?
              </h3>
              <div className="space-y-3 md:space-y-4">
                {[
                  { step: '01', title: 'Консултация', desc: 'Разбираме каузата, целите и аудиторията на кампанията.' },
                  { step: '02', title: 'Концепция', desc: 'Разработваме сценарий и сториборд, съобразени с бюджета.' },
                  { step: '03', title: 'Заснемане', desc: 'Професионално заснемане с камери, микрофони и осветление.' },
                  { step: '04', title: 'Монтаж', desc: 'Професионален монтаж, цветокорекция и звук. Доставка в 5 дни.' },
                ].map((s) => (
                  <div key={s.step} className="flex items-start gap-3">
                    <span className="text-[10px] font-medium text-[#0A2540]/40 tracking-widest shrink-0 w-5">{s.step}</span>
                    <div>
                      <div className="text-sm font-medium text-[#1C1C1E] mb-0.5">{s.title}</div>
                      <div className="text-xs text-[#1C1C1E]/65 leading-relaxed">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
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
            <span className="italic text-[#0A2540]">въпроси за НПО видео.</span>
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
                НПО организация, която иска да достигне повече хора?
              </div>
              <p className="text-sm text-[#1C1C1E]/65">
                Консултацията е 50 € — обсъждаме каузата и как видеото може да я разкаже. Гаранция за връщане на парите.
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