import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import InlineIcon from '@/components/base/InlineIcon';

interface SharedNavProps {
  variant?: 'default' | 'transparent' | 'dark';
}

const NAV_LINKS = [
  { label: 'Блог', to: '/blog' },
  { label: 'Новини', to: '/novini' },
  { label: 'Екип', to: '/ekip' },
  { label: 'Владимир Атанасов', to: '/vladimir-atanasov' },
  { label: 'Контакт', to: '/kontakt' },
];

const SERVICES_LINKS = [
  { label: 'Изработка на сайт', to: '/uslugi/izrabotka-na-sait', icon: 'code', desc: 'от 999 €' },
  { label: 'SEO & GEO', to: '/uslugi/seo-geo', icon: 'search', desc: '390 € еднократно' },
  { label: 'Рекламни кампании', to: '/uslugi/reklamni-kampanii', icon: 'advertisement', desc: 'от 290 € / мес.' },
  { label: 'Видео продукция', to: '/uslugi/video-produkciya', icon: 'video', desc: 'от 290 €' },
];

const LOCAL_LINKS = [
  { to: '/reklama-veliko-tarnovo', icon: 'advertisement', label: 'Реклама Велико Търново' },
  { to: '/seo-veliko-tarnovo', icon: 'search', label: 'SEO Велико Търново' },
  { to: '/video-produkciya-veliko-tarnovo', icon: 'video', label: 'Видео продукция ВТ' },
  { to: '/npo-video', icon: 'heart', label: 'Видеа за НПО' },
  { to: '/digitalen-marketing-veliko-tarnovo', icon: 'rocket', label: 'Дигитален маркетинг ВТ' },
  { to: '/blog', icon: 'article', label: 'SEO Блог' },
];

export default function SharedNav({ variant = 'default' }: SharedNavProps) {
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const isDark = variant === 'dark';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const isActive = (to: string) => {
    if (to.startsWith('/#')) return false;
    return location.pathname === to;
  };

  const navBg = (() => {
    if (isDark) return 'bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-[#1a1a1a]';
    if (variant === 'transparent' && !scrolled) return 'bg-transparent';
    return 'bg-white/95 backdrop-blur-sm border-b border-[#1C1C1E]/8';
  })();

  // ── Dark theme style tokens ──
  const DT = {
    link: isDark ? 'text-[#a0a0a0] hover:text-white' : 'text-[#1C1C1E]/70 hover:text-[#0A2540]',
    linkActive: isDark ? 'text-white font-medium' : 'text-[#0A2540] font-medium',
    divider: isDark ? 'bg-[#2a2a2a]' : 'bg-[#1C1C1E]/12',
    dropdownBg: isDark ? 'bg-[#111] border-[#1a1a1a]' : 'bg-white border-[#1C1C1E]/8',
    dropdownItem: isDark ? 'text-[#a0a0a0] hover:bg-[#1a1a1a] hover:text-white' : 'text-[#1C1C1E]/70 hover:bg-[#F9F9F9] hover:text-[#0A2540]',
    dropdownActive: isDark ? 'bg-[#1a1a1a] text-white' : 'bg-[#0A2540]/6 text-[#0A2540]',
    dropdownIconBg: isDark ? 'border-[#2a2a2a] bg-[#1a1a1a]' : 'border-[#0A2540]/10 bg-[#0A2540]/4',
    dropdownIcon: isDark ? 'text-[#a0a0a0]' : 'text-[#0A2540]/70',
    dropdownDesc: isDark ? 'text-[#666]' : 'text-[#1C1C1E]/60',
    hamburger: isDark ? 'text-white' : 'text-[#1C1C1E]',
    hamburgerHover: isDark ? 'hover:bg-[#1a1a1a]' : 'hover:bg-[#1C1C1E]/5',
    academyBtn: isDark
      ? 'border-[#e53e3e]/60 text-[#e53e3e] hover:bg-[#e53e3e] hover:text-white'
      : 'border-[#0A2540]/30 text-[#0A2540] hover:bg-[#0A2540] hover:text-white',
    academyBtnActive: isDark
      ? 'bg-[#e53e3e] text-white border-[#e53e3e]'
      : 'bg-[#0A2540] text-white border-[#0A2540]',
    loginBtn: isDark ? 'text-[#a0a0a0] hover:text-white' : 'text-[#1C1C1E]/70 hover:text-[#0A2540]',
    registerBtn: isDark ? 'bg-[#e53e3e] text-white hover:bg-[#ff5555]' : 'bg-[#0A2540] text-white hover:bg-[#0A2540]/90',
    dropdownLabel: isDark ? 'text-[#666]' : 'text-[#1C1C1E]/50',
    mobileBg: isDark ? 'bg-[#0a0a0a] border-[#1a1a1a]' : 'bg-white border-[#1C1C1E]/8',
    mobileItem: isDark ? 'text-[#a0a0a0] hover:bg-[#1a1a1a] hover:text-white' : 'text-[#1C1C1E]/65 hover:bg-[#F9F9F9] hover:text-[#0A2540]',
    mobileItemActive: isDark ? 'bg-[#1a1a1a] text-white font-medium' : 'bg-[#0A2540]/6 text-[#0A2540] font-medium',
    mobileDivider: isDark ? 'bg-[#2a2a2a]' : 'bg-[#1C1C1E]/8',
    mobileAcademyBtn: isDark ? 'bg-[#e53e3e] text-white' : 'bg-[#0A2540] text-white',
    mobileLoginBtn: isDark ? 'text-[#a0a0a0] hover:text-white' : 'text-[#1C1C1E]/70 hover:text-[#0A2540]',
    mobileBackdrop: isDark ? 'bg-black/40' : 'bg-black/20',
    userAvatar: isDark ? 'bg-[#e53e3e]' : 'bg-[#0A2540]',
    dropdownUserItem: isDark ? 'text-[#a0a0a0] hover:bg-[#1a1a1a] hover:text-white' : 'text-[#1C1C1E]/70 hover:bg-[#F9F9F9] hover:text-[#0A2540]',
    dropdownUserIcon: isDark ? 'text-[#a0a0a0]' : 'text-[#0A2540]/65',
    dropdownLogout: isDark ? 'text-[#e53e3e] hover:bg-[#1a0505]' : 'text-red-600 hover:bg-red-50',
  };

  const isAcademyActive = location.pathname === '/kurs' || location.pathname.startsWith('/kurs/');

  return (
    <>
      <nav
        aria-label="Главна навигация"
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${navBg}`}
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        <div className="flex items-center justify-between px-4 md:px-10 lg:px-16 py-3 md:py-4 w-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img
              src="https://storage.readdy-site.link/project_files/3f265d07-5825-4e88-a58a-44deb287b858/e232f6df-04d9-4738-9beb-0ed8800a0ec8_TAVORA-MARKETING-AGENCY-VELIKO-TARNOVO.webp?v=501711babf873985bfce13811f385bfa"
              alt="ТАВОРА ЕООД"
              width="144"
              height="36"
              className="h-7 md:h-9 w-auto object-contain"
              loading="eager"
              decoding="async"
              fetchpriority="high"
            />
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-7">

            {/* Услуги dropdown — CSS group-hover */}
            <div className="relative group">
              <Link to="/uslugi" className={`text-sm transition-colors duration-200 flex items-center gap-1 cursor-pointer whitespace-nowrap min-h-[44px] ${
                location.pathname.startsWith('/uslugi') ? DT.linkActive : DT.link
              }`}>
                Услуги
                <InlineIcon name="arrow-down" className={`w-3 h-3 transition-colors ${isDark ? 'text-[#a0a0a0] group-hover:text-white' : 'text-[#1C1C1E]/70 group-hover:text-[#0A2540]'}`} />
              </Link>
              <div className={`absolute top-full left-0 mt-2 w-64 rounded-xl overflow-hidden shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border ${DT.dropdownBg}`}>
                {SERVICES_LINKS.map((s) => (
                  <Link
                    key={s.to}
                    to={s.to}
                    className={`flex items-center gap-3 px-4 py-3 transition-colors group/item ${location.pathname === s.to ? DT.dropdownActive : DT.dropdownItem}`}
                  >
                    <div className={`w-8 h-8 flex items-center justify-center rounded-lg border shrink-0 ${DT.dropdownIconBg}`}>
                      <InlineIcon name={s.icon} className={`w-4 h-4 ${DT.dropdownIcon}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm leading-tight">{s.label}</div>
                      <div className={`text-[10px] ${DT.dropdownDesc}`}>{s.desc}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm transition-colors duration-200 whitespace-nowrap min-h-[44px] flex items-center ${
                  isActive(link.to) ? DT.linkActive : DT.link
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Divider */}
            <div className={`w-px h-4 ${DT.divider}`} />

            {/* Локално SEO dropdown — CSS group-hover */}
            <div className="relative group">
              <button className={`text-sm transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap min-h-[44px] ${DT.link}`}>
                Локално SEO
                <InlineIcon name="arrow-down" className={`w-3 h-3 transition-colors ${isDark ? 'text-[#a0a0a0] group-hover:text-white' : 'text-[#1C1C1E]/70 group-hover:text-[#0A2540]'}`} />
              </button>
              <div className={`absolute top-full right-0 mt-2 w-56 rounded-xl overflow-hidden shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border ${DT.dropdownBg}`}>
                {LOCAL_LINKS.map((s) => (
                  <Link
                    key={s.to}
                    to={s.to}
                    className={`flex items-center gap-2.5 px-4 py-3 text-sm transition-colors min-h-[44px] ${DT.dropdownItem}`}
                  >
                    <InlineIcon name={s.icon} className={`w-4 h-4 ${DT.dropdownIcon}`} />
                    {s.label}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              to="/kurs"
              className={`text-sm px-5 py-2.5 border rounded-full transition-all duration-300 cursor-pointer whitespace-nowrap ${
                isAcademyActive ? DT.academyBtnActive : DT.academyBtn
              }`}
            >
              Академия TAVORA
            </Link>

            {user ? (
              <div className="relative group">
                <button className={`w-9 h-9 rounded-full text-white text-xs font-semibold flex items-center justify-center cursor-pointer ${DT.userAvatar}`}>
                  {(user.email?.charAt(0) || 'U').toUpperCase()}
                </button>
                <div className={`absolute top-full right-0 mt-2 w-48 rounded-xl overflow-hidden shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border ${DT.dropdownBg}`}>
                  <Link to="/dashboard" className={`flex items-center gap-2.5 px-4 py-3 text-sm transition-colors ${DT.dropdownUserItem}`}>
                    <InlineIcon name="user" className={`w-4 h-4 ${DT.dropdownUserIcon}`} />
                    Моят профил
                  </Link>
                  <Link to="/kurs" className={`flex items-center gap-2.5 px-4 py-3 text-sm transition-colors ${DT.dropdownUserItem}`}>
                    <InlineIcon name="book-open" className={`w-4 h-4 ${DT.dropdownUserIcon}`} />
                    Обучение
                  </Link>
                  <div className={`h-px mx-4 ${DT.divider}`} />
                  <button
                    onClick={() => { signOut(); }}
                    className={`w-full text-left flex items-center gap-2.5 px-4 py-3 text-sm transition-colors cursor-pointer ${DT.dropdownLogout}`}
                  >
                    <InlineIcon name="logout" className="w-4 h-4" />
                    Изход
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className={`text-sm px-4 py-2 transition-colors cursor-pointer whitespace-nowrap ${DT.loginBtn}`}
                >
                  Влез
                </Link>
                <Link
                  to="/register"
                  className={`text-sm px-4 py-2.5 rounded-full transition-all cursor-pointer whitespace-nowrap ${DT.registerBtn}`}
                >
                  Регистрация
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className={`lg:hidden w-10 h-10 flex items-center justify-center cursor-pointer rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-[#0A2540]/30 focus-visible:outline-none ${DT.hamburgerHover}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Затвори менюто' : 'Отвори менюто'}
          >
            <InlineIcon name={menuOpen ? 'close' : 'menu'} className={`w-5 h-5 ${DT.hamburger}`} />
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay — fixed, full screen, with backdrop */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-[60] flex flex-col">
          {/* Backdrop */}
          <div
            className={`absolute inset-0 backdrop-blur-sm ${DT.mobileBackdrop}`}
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
          {/* Menu panel */}
          <div
            id="mobile-menu"
            className={`relative w-full max-h-[85vh] overflow-y-auto border-b shadow-2xl animate-fade-in ${DT.mobileBg}`}
          >
            <div className="px-4 py-4 flex flex-col gap-0.5">
              <div className={`px-3 py-1 text-[10px] tracking-widest uppercase font-medium ${DT.dropdownLabel}`}>Услуги</div>
              {SERVICES_LINKS.map((s) => (
                <Link
                  key={s.to}
                  to={s.to}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors min-h-[44px] ${
                    location.pathname === s.to ? DT.mobileItemActive : DT.mobileItem
                  }`}
                >
                  <InlineIcon name={s.icon} className={`w-4 h-4 ${DT.dropdownIcon}`} />
                  {s.label}
                </Link>
              ))}

              <div className={`h-px my-2 ${DT.mobileDivider}`} />

              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-lg text-sm transition-colors min-h-[44px] flex items-center ${
                    isActive(link.to) ? DT.mobileItemActive : DT.mobileItem
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className={`h-px my-2 ${DT.mobileDivider}`} />
              <div className={`px-3 py-1 text-[10px] tracking-widest uppercase font-medium ${DT.dropdownLabel}`}>Локално SEO</div>
              {LOCAL_LINKS.map((s) => (
                <Link
                  key={s.to}
                  to={s.to}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors min-h-[44px] ${DT.mobileItem}`}
                >
                  <InlineIcon name={s.icon} className={`w-4 h-4 ${DT.dropdownIcon}`} />
                  {s.label}
                </Link>
              ))}

              <div className={`h-px my-2 ${DT.mobileDivider}`} />
              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setMenuOpen(false)} className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors min-h-[44px] ${DT.dropdownUserItem}`}>
                    <InlineIcon name="user" className={`w-4 h-4 ${DT.dropdownUserIcon}`} />
                    Моят профил
                  </Link>
                  <Link to="/kurs" onClick={() => setMenuOpen(false)} className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors min-h-[44px] ${DT.dropdownUserItem}`}>
                    <InlineIcon name="book-open" className={`w-4 h-4 ${DT.dropdownUserIcon}`} />
                    Обучение
                  </Link>
                  <button
                    onClick={() => { signOut(); setMenuOpen(false); }}
                    className={`w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors min-h-[44px] cursor-pointer ${DT.dropdownLogout}`}
                  >
                    <InlineIcon name="logout" className="w-4 h-4" />
                    Изход
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 px-3">
                  <Link to="/login" onClick={() => setMenuOpen(false)} className={`py-2.5 text-center text-sm transition-colors cursor-pointer ${DT.mobileLoginBtn}`}>
                    Влез в акаунта
                  </Link>
                  <Link to="/register" onClick={() => setMenuOpen(false)} className={`py-2.5 text-sm rounded-full text-center cursor-pointer ${DT.registerBtn}`}>
                    Регистрация
                  </Link>
                </div>
              )}
              <Link
                to="/kurs"
                onClick={() => setMenuOpen(false)}
                className={`mx-3 mt-1 py-2.5 text-sm rounded-full text-center cursor-pointer whitespace-nowrap ${DT.mobileAcademyBtn}`}
              >
                Академия TAVORA
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}