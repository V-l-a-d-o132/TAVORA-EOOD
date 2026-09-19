import { Link, useLocation } from 'react-router-dom';
import InlineIcon from '@/components/base/InlineIcon';

const NAV_LINKS = [
  { label: 'Начало', to: '/' },
  { label: 'Услуги', to: '/uslugi' },
  { label: 'Блог', to: '/blog' },
  { label: 'Екипът', to: '/ekip' },
  { label: 'Контакт', to: '/kontakt' },
  { label: 'Академия TAVORA', to: '/kurs' },
];

const SERVICE_LINKS = [
  { label: 'Изработка на сайт', to: '/uslugi/izrabotka-na-sait' },
  { label: 'SEO & GEO', to: '/uslugi/seo-geo' },
  { label: 'Рекламни кампании', to: '/uslugi/reklamni-kampanii' },
  { label: 'Видео продукция', to: '/uslugi/video-produkciya' },
];

const LEGAL_LINKS = [
  { label: 'Поверителност', to: '/privacy' },
  { label: 'Общи условия', to: '/terms' },
  { label: 'Бисквитки', to: '/cookies' },
  { label: 'Право на отказ', to: '/withdrawal' },
];

const SOCIALS = [
  { icon: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61589264103453' },
  { icon: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/marketingattavora/' },
  { icon: 'tiktok', label: 'TikTok', href: 'https://www.tiktok.com/@tavoramarketingagency' },
  { icon: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/@TavoraMarketingAgency' },
  { icon: 'google', label: 'Google Business', href: 'https://share.google/sP3ydTe4iqEO44qua' },
];

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export default function SharedFooter() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <footer
      id="main-footer"
      className="bg-[#0F1F35] border-t border-white/[0.06]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-16 py-10 md:py-16">

        {/* Main row */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-10 md:gap-14">

          {/* Brand */}
          <div className="max-w-[260px] shrink-0">
            <Link
              to="/"
              className="inline-block bg-white rounded-lg px-3 py-2 focus-visible:ring-2 focus-visible:ring-white/40"
            >
              <img
                src="https://storage.readdy-site.link/project_files/3f265d07-5825-4e88-a58a-44deb287b858/e232f6df-04d9-4738-9beb-0ed8800a0ec8_TAVORA-MARKETING-AGENCY-VELIKO-TARNOVO.webp?v=501711babf873985bfce13811f385bfa"
                alt="ТАВОРА ЕООД"
                width="120"
                height="30"
                className="h-7 w-auto object-contain"
                loading="lazy"
                decoding="async"
              />
            </Link>

            <p className="mt-4 text-sm text-white/70 leading-relaxed">
              Дигитален маркетинг, реклами и видео продукция за бизнеси от Велико Търново и цяла България.
            </p>

            {/* Social icons — larger, higher contrast */}
            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 text-white/90 hover:bg-white/20 hover:text-white transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none"
                >
                  <InlineIcon name={s.icon} className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 md:gap-12">

            {/* Navigation */}
            <div>
              <h3 className="text-sm font-medium text-white/80 mb-4">
                Навигация
              </h3>
              <ul className="space-y-2.5">
                {NAV_LINKS.map((s) => (
                  <li key={s.to}>
                    <Link
                      to={s.to}
                      aria-current={isActive(s.to) ? 'page' : undefined}
                      className={`text-sm transition-colors duration-200 hover-underline ${
                        isActive(s.to)
                          ? 'text-white font-medium'
                          : 'text-white/70 hover:text-white/90'
                      }`}
                    >
                      {s.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-sm font-medium text-white/80 mb-4">
                Услуги
              </h3>
              <ul className="space-y-2.5">
                {SERVICE_LINKS.map((s) => (
                  <li key={s.to}>
                    <Link
                      to={s.to}
                      aria-current={isActive(s.to) ? 'page' : undefined}
                      className={`text-sm transition-colors duration-200 hover-underline ${
                        isActive(s.to)
                          ? 'text-white font-medium'
                          : 'text-white/70 hover:text-white/90'
                      }`}
                    >
                      {s.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    to="/uslugi"
                    className="text-xs text-white/70 hover:text-white/90 transition-colors duration-200 inline-flex items-center gap-1"
                  >
                    Виж всички
                    <InlineIcon name="arrow-right" className="w-3 h-3" />
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="col-span-2 sm:col-span-1">
              <h3 className="text-sm font-medium text-white/80 mb-4">
                Свържи се
              </h3>
              <div className="space-y-3">
                <a
                  href="tel:+359885189724"
                  className="text-sm text-white/70 hover:text-white/90 transition-colors duration-200 inline-flex items-center gap-2"
                >
                  <InlineIcon name="phone" className="w-4 h-4 text-white/80" />
                  0885 189 724
                </a>
                <a
                  href="mailto:hello@imashnujnoto.com"
                  className="block text-sm text-white/70 hover:text-white/90 transition-colors duration-200"
                >
                  hello@imashnujnoto.com
                </a>
                <div className="text-xs text-white/60">
                  Пон.–Пет. 09:00–18:00
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/[0.08] mt-10 mb-5" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs text-white/60">
            &copy; 2026 ТАВОРА ЕООД &middot; ЕИК 208438650 &middot; Велико Търново
          </p>

          <div className="flex items-center gap-4">
            {LEGAL_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                aria-current={isActive(l.to) ? 'page' : undefined}
                className={`text-xs transition-colors duration-200 whitespace-nowrap hover-underline ${
                  isActive(l.to)
                    ? 'text-white/70 font-medium'
                    : 'text-white/60 hover:text-white/80'
                }`}
              >
                {l.label}
              </Link>
            ))}

            <button
              type="button"
              onClick={scrollToTop}
              className="text-xs text-white/60 hover:text-white/80 transition-colors duration-200 inline-flex items-center gap-1 cursor-pointer focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none rounded-md"
              aria-label="Върни се в началото на страницата"
            >
              Нагоре
              <InlineIcon name="arrow-up" className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}