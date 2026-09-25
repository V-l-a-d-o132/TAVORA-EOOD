import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardNav() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const profileButton = useRef<HTMLButtonElement>(null);
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Колега';
  const initials = displayName.split(' ').map((name: string) => name[0]).join('').toUpperCase().slice(0, 2);

  useEffect(() => { setDropdownOpen(false); }, [location.pathname]);
  useEffect(() => {
    if (!dropdownOpen) return;
    const closeOutside = (event: PointerEvent) => {
      if (!profileRef.current?.contains(event.target as Node)) setDropdownOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDropdownOpen(false);
        profileButton.current?.focus();
      }
    };
    document.addEventListener('pointerdown', closeOutside);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOutside);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [dropdownOpen]);

  const leavePage = () => {
    setDropdownOpen(false);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };
  const navLinks = [
    { to: '/dashboard', label: 'Табло', icon: 'ri-dashboard-line', active: location.pathname === '/dashboard' },
    { to: '/kurs', label: 'Модули', icon: 'ri-stack-line', active: location.pathname === '/kurs' },
  ];

  return (
    <nav aria-label="Навигация на академията" className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0a0a0a]">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-2 px-4 md:px-8">
        <Link to="/" aria-label="Начална страница" onClick={leavePage} className="flex shrink-0 items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center bg-red-600 text-xs font-bold text-white">AI</span>
          <span className="hidden text-sm font-bold text-white sm:block">Мастърклас</span>
        </Link>
        <div className="flex items-center gap-1">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} onClick={leavePage}
              className={`flex min-h-11 items-center gap-1.5 rounded-lg px-2.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-400 sm:px-4 ${link.active ? 'bg-white/10 text-white' : 'text-zinc-300 hover:bg-white/5 hover:text-white'}`}>
              <i className={`${link.icon} hidden sm:inline`} aria-hidden />{link.label}
            </NavLink>
          ))}
        </div>
        {user ? <div ref={profileRef} className="relative shrink-0">
          <button ref={profileButton} type="button" aria-label="Меню на профила" aria-expanded={dropdownOpen} aria-controls="academy-profile-menu"
            onClick={() => setDropdownOpen((open) => !open)} className="flex min-h-11 items-center gap-2 rounded-lg p-1.5 text-white hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-400">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/10 text-xs font-bold">{initials}</span>
            <span className="hidden max-w-[120px] truncate text-sm md:block">{displayName}</span>
          </button>
          {dropdownOpen && <div id="academy-profile-menu" className="absolute right-0 top-full mt-2 w-60 rounded-xl border border-white/10 bg-[#111] p-2 shadow-2xl">
            <div className="border-b border-white/10 px-3 py-3">
              <p className="truncate text-sm font-medium text-white">{displayName}</p>
              <p className="mt-1 truncate text-xs text-zinc-400">{user.email}</p>
            </div>
            <button type="button" onClick={async () => { setDropdownOpen(false); await signOut(); navigate('/'); }} className="mt-1 flex min-h-11 w-full items-center gap-2 rounded-lg px-3 text-left text-sm text-zinc-300 hover:bg-white/5 hover:text-white">
              <i className="ri-logout-box-line" aria-hidden />Излез от акаунта
            </button>
          </div>}
        </div> : <Link to="/login" onClick={leavePage} className="grid min-h-11 place-items-center rounded-lg px-2 text-sm text-zinc-300 hover:text-white">Вход</Link>}
      </div>
    </nav>
  );
}
