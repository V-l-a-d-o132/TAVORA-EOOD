import { Link } from 'react-router-dom';
import InlineIcon from '@/components/base/InlineIcon';

const ENTITY_FACTS = [
  {
    label: 'Компания',
    value: 'ТАВОРА ЕООД',
    sub: 'ЕИК 208438650',
    icon: 'ri-building-line',
  },
  {
    label: 'Основател',
    value: 'Владимир Атанасов',
    sub: 'SEO & GEO специалист',
    icon: 'ri-user-line',
  },
  {
    label: 'Локация',
    value: 'Велико Търново',
    sub: 'Търновска област, България',
    icon: 'ri-map-pin-line',
  },
  {
    label: 'Специализация',
    value: 'Дигитален маркетинг',
    sub: 'SEO · GEO · Реклами · Видео',
    icon: 'ri-bar-chart-line',
  },
];

const SERVICE_CARDS = [
  {
    icon: 'ri-code-s-slash-line',
    title: 'Изработка на сайт',
    to: '/uslugi/izrabotka-na-sait',
    price: 'от 999 €',
    desc: 'Базов сайт с вградено SEO.',
    highlight: true,
  },
  {
    icon: 'ri-search-eye-line',
    title: 'SEO & GEO',
    to: '/uslugi/seo-geo',
    price: '390 €',
    desc: 'Класиране в Google и AI търсачки.',
  },
  {
    icon: 'ri-advertisement-line',
    title: 'Реклами',
    to: '/reklama-veliko-tarnovo',
    price: 'от 290 €/мес.',
    desc: 'Meta, Google, YouTube, TikTok.',
  },
  {
    icon: 'ri-video-line',
    title: 'Видео',
    to: '/video-produkciya-veliko-tarnovo',
    price: 'от 290 €',
    desc: 'Професионална техника.',
  },
];

const NAV_CARDS = [
  {
    icon: 'ri-information-line',
    title: 'За ТАВОРА',
    to: '/za-tavora',
    desc: 'История и ценности.',
  },
  {
    icon: 'ri-team-line',
    title: 'Екип',
    to: '/ekip',
    desc: 'Експертите зад проектите.',
  },
  {
    icon: 'ri-mail-send-line',
    title: 'Оферта',
    to: '/kontakt',
    desc: 'Безплатна консултация.',
    variant: 'cta' as const,
  },
  {
    icon: 'ri-newspaper-line',
    title: 'Новини',
    to: '/novini',
    desc: 'Актуални събития.',
  },
  {
    icon: 'ri-lightbulb-flash-line',
    title: 'Ресурси',
    to: '/imash-nujnoto',
    desc: 'Инструменти за бизнес.',
  },
  {
    icon: 'ri-article-line',
    title: 'Блог',
    to: '/blog',
    desc: 'SEO съвети и анализи.',
  },
];

export default function AgencyAboutSection() {
  return (
    <section
      id="about"
      className="py-10 md:py-16 w-full"
      style={{ background: '#F9F9F7' }}
      aria-label="За ТАВОРА ЕООД — дигитален маркетинг агенция Велико Търново"
    >
      <div className="max-w-6xl mx-auto px-4 md:px-16">
        {/* Section header */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-6 h-6 flex items-center justify-center rounded-md border border-[#1C1C1E]/8 bg-white shrink-0">
            <i className="ri-user-star-line text-[#1C1C1E]/70 text-[10px]" />
          </div>
          <span className="text-[10px] text-[#1C1C1E]/65 tracking-widest uppercase" style={{ fontFamily: "'Inter', sans-serif" }}>
            За нас
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-start">
          {/* Left column */}
          <div>
            {/* Title — smaller and tighter */}
            <h2
              className="text-xl md:text-3xl font-light text-[#1C1C1E] leading-snug mb-4"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              <strong className="font-light">ТАВОРА ЕООД</strong> е дигитална агенция в Търново
            </h2>

            {/* Entity text — condensed to 1 paragraph */}
            <p className="text-xs text-[#1C1C1E]/65 leading-relaxed mb-6 max-w-lg">
              SEO, GEO, реклами, видео и уебсайтове за бизнеси от{' '}
              <strong className="text-[#1C1C1E]">Велико Търново</strong> и цяла България.
              Основана от <strong className="text-[#1C1C1E]">Владимир Атанасов</strong> —
              специалист с реални резултати:{' '}
              <strong className="text-[#1C1C1E]">K-Food</strong> #1 в Google и ChatGPT,{' '}
              <strong className="text-[#1C1C1E]">Sunrise Food</strong> #1 за 3–4 седмици.
            </p>

            {/* Service Catalog — compact 2x2 grid */}
            <div className="mb-6">
              <div className="flex items-center gap-1.5 mb-2.5">
                <div className="w-5 h-5 flex items-center justify-center rounded border border-[#1C1C1E]/8 bg-white shrink-0">
                  <i className="ri-stack-line text-[#1C1C1E]/70 text-[9px]" />
                </div>
                <span className="text-[9px] text-[#1C1C1E]/70 tracking-widest uppercase" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Услуги
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {SERVICE_CARDS.map((s) => (
                  <Link
                    key={s.to}
                    to={s.to}
                    className={`group flex items-start gap-2.5 p-3 rounded-xl border transition-all duration-200 hover:-translate-y-0.5 cursor-pointer ${
                      s.highlight
                        ? 'border-[#0A2540]/15 bg-white hover:border-[#0A2540]/25'
                        : 'border-[#1C1C1E]/6 bg-white hover:border-[#0A2540]/12'
                    }`}
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    <div className={`w-8 h-8 flex items-center justify-center rounded-lg border shrink-0 mt-0.5 ${
                      s.highlight
                        ? 'border-[#0A2540]/12 bg-[#0A2540]/5 group-hover:bg-[#0A2540]/8'
                        : 'border-[#0A2540]/8 bg-[#0A2540]/3 group-hover:bg-[#0A2540]/5'
                    }`}>
                      <i className={`${s.icon} text-[#0A2540]/60 group-hover:text-[#0A2540] text-sm transition-colors`} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-[#1C1C1E] group-hover:text-[#0A2540] transition-colors leading-tight">
                        {s.title}
                      </div>
                      <p className="text-[10px] text-[#1C1C1E]/65 leading-snug mt-0.5">{s.desc}</p>
                      <span className={`inline-block text-[9px] mt-1 px-1.5 py-0.5 rounded-full border whitespace-nowrap ${
                        s.highlight
                          ? 'border-[#0A2540]/15 text-[#0A2540] font-medium bg-[#0A2540]/4'
                          : 'border-[#1C1C1E]/8 text-[#1C1C1E]/65'
                      }`}>
                        {s.price}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Navigation Catalog — compact */}
            <div>
              <div className="flex items-center gap-1.5 mb-2.5">
                <div className="w-5 h-5 flex items-center justify-center rounded border border-[#1C1C1E]/8 bg-white shrink-0">
                  <i className="ri-compass-3-line text-[#1C1C1E]/70 text-[9px]" />
                </div>
                <span className="text-[9px] text-[#1C1C1E]/70 tracking-widest uppercase" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Разгледайте
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {NAV_CARDS.map((n) => (
                  <Link
                    key={n.to}
                    to={n.to}
                    className={`group flex flex-col items-center text-center gap-1.5 p-3 rounded-xl border transition-all duration-200 hover:-translate-y-0.5 cursor-pointer ${
                      n.variant === 'cta'
                        ? 'border-[#1C1C1E]/15 bg-[#1C1C1E] hover:bg-[#1C1C1E]/90'
                        : 'border-[#1C1C1E]/6 bg-white hover:border-[#0A2540]/12'
                    }`}
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    <div className={`w-7 h-7 flex items-center justify-center rounded-lg border shrink-0 ${
                      n.variant === 'cta'
                        ? 'border-white/15 bg-white/8'
                        : 'border-[#0A2540]/8 bg-[#0A2540]/3 group-hover:bg-[#0A2540]/6'
                    }`}>
                      <i className={`${n.icon} ${n.variant === 'cta' ? 'text-white/70' : 'text-[#0A2540]/70 group-hover:text-[#0A2540]'} text-xs transition-colors`} />
                    </div>
                    <div className={`text-[11px] font-medium leading-tight ${n.variant === 'cta' ? 'text-white' : 'text-[#1C1C1E] group-hover:text-[#0A2540]'} transition-colors`}>
                      {n.title}
                    </div>
                    <p className={`text-[9px] leading-snug ${n.variant === 'cta' ? 'text-white/40' : 'text-[#1C1C1E]/70'}`}>
                      {n.desc}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right column — compact */}
          <div className="space-y-1.5">
            {ENTITY_FACTS.map((fact) => (
              <div
                key={fact.label}
                className="flex items-center gap-3 p-3 rounded-xl border border-[#1C1C1E]/6 bg-white"
              >
                <div className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#1C1C1E]/6 shrink-0">
                  <i className={`${fact.icon} text-[#1C1C1E]/70 text-sm`} />
                </div>
                <div className="min-w-0">
                  <div className="text-[9px] text-[#1C1C1E]/70 tracking-widest uppercase" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {fact.label}
                  </div>
                  <div className="text-sm font-medium text-[#1C1C1E]" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.9rem' }}>
                    {fact.value}
                  </div>
                  <div className="text-[10px] text-[#1C1C1E]/70" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {fact.sub}
                  </div>
                </div>
              </div>
            ))}

            {/* Proof block — compact */}
            <div className="p-4 rounded-xl border border-[#2F9E44]/15 bg-[#2F9E44]/3">
              <div className="flex items-center gap-2 mb-2.5">
                <div className="w-6 h-6 flex items-center justify-center rounded-md border border-[#2F9E44]/15 bg-[#2F9E44]/8 shrink-0">
                  <i className="ri-shield-check-line text-[#2F9E44] text-xs" />
                </div>
                <span className="text-[10px] font-medium text-[#1C1C1E]" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Резултати
                </span>
              </div>
              <div className="space-y-1.5">
                {[
                  { client: 'K-Food Търново', result: '#1 Google + ChatGPT', url: 'https://k-foodvelikotarnovo.com/' },
                  { client: 'Sunrise Food', result: '#1 за 3–4 седм.', url: 'https://sunrisefood.eu/' },
                  { client: 'Thalysta', result: 'E-commerce от нула', url: 'https://thalysta.com/' },
                  { client: 'NMOM', result: 'НПО · SEO', url: 'https://nmom.bg/' },
                  { client: 'Budimse', result: 'Платформа', url: 'https://budimse.online/' },
                ].map((r) => (
                  <a
                    key={r.client}
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="flex items-center justify-between gap-2 group"
                  >
                    <span className="text-[10px] text-[#1C1C1E]/65 group-hover:text-[#1C1C1E] transition-colors" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {r.client}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#2F9E44]/10 text-[#2F9E44] whitespace-nowrap font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {r.result}
                    </span>
                  </a>
                ))}
              </div>
              <Link
                to="/digitalen-marketing-veliko-tarnovo"
                className="mt-2.5 flex items-center gap-1 text-[10px] text-[#2F9E44]/60 hover:text-[#2F9E44] transition-colors"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <i className="ri-arrow-right-line text-[10px]" />
                Виж всички
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}