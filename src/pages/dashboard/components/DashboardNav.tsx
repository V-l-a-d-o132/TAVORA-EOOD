import { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardNav() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Колега';
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  const isOnKurs = location.pathname === '/kurs';
  const isOnDashboard = location.pathname === '/dashboard';
  const isOnModule = location.pathname.startsWith('/module/');

  const navLinks = [
    { to: '/dashboard', label: 'Прогрес', icon: 'ri-dashboard-line', active: isOnDashboard },
    { to: '/kurs', label: 'Модули', icon: 'ri-stack-line', active: isOnKurs || isOnModule },
  ];

  const handleNavClick = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  return (
    <nav className="w-full sticky top-0 z-30" style={{ background: '#0a0a0a', borderBottom: '1px solid #1a1a1a' }}>
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-8 h-8 flex items-center justify-center" style={{ background: '#e53e3e' }}>
            <span className="text-white text-xs font-bold tracking-wider">AI</span>
          </div>
          <span className="text-sm font-bold tracking-wide hidden sm:block" style={{ color: '#fff' }}>
            Мастърклас
          </span>
        </Link>

        {/* Desktop Center Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={handleNavClick}
              className="px-4 py-2 text-sm font-medium transition-all whitespace-nowrap cursor-pointer"
              style={{
                color: link.active ? '#fff' : '#888',
                background: link.active ? '#1a1a1a' : 'transparent',
              }}
              onMouseEnter={(e) => {
                if (!link.active) {
                  e.currentTarget.style.background = '#111';
                  e.currentTarget.style.color = '#fff';
                }
              }}
              onMouseLeave={(e) => {
                if (!link.active) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#888';
                }
              }}
            >
              <i className={`${link.icon} mr-1.5`} />
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Right - User + Mobile Menu Toggle */}
        <div className="flex items-center gap-2">
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center transition-colors cursor-pointer"
            style={{ color: '#888' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#888'; }}
          >
            <i className={`${mobileMenuOpen ? 'ri-close-line' : 'ri-menu-line'} text-lg`} />
          </button>

          {/* User dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-2 py-1.5 transition-colors cursor-pointer"
              onMouseEnter={(e) => { e.currentTarget.style.background = '#111'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              <div className="w-9 h-9 flex items-center justify-center" style={{ background: '#1a1a1a' }}>
                <span className="text-white text-xs font-bold">{initials}</span>
              </div>
              <span className="text-sm hidden sm:block max-w-[120px] truncate" style={{ color: '#fff' }}>
                {displayName}
              </span>
              <i className="ri-arrow-down-s-line hidden sm:block" style={{ color: '#666' }} />
            </button>

            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                <div className="absolute right-0 top-full mt-1 w-56 z-20 overflow-hidden" style={{ background: '#111', border: '1px solid #1a1a1a' }}>
                  <div className="px-4 py-3" style={{ borderBottom: '1px solid #1a1a1a' }}>
                    <p className="text-sm font-medium truncate" style={{ color: '#fff' }}>{displayName}</p>
                    <p className="text-xs truncate mt-0.5" style={{ color: '#666' }}>{user?.email}</p>
                  </div>
                  <NavLink
                    to="/dashboard"
                    onClick={() => { setDropdownOpen(false); setMobileMenuOpen(false); handleNavClick(); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors md:hidden cursor-pointer"
                    style={{ color: '#888', background: 'none', border: 'none' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#1a1a1a'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#888'; }}
                  >
                    <i className="ri-dashboard-line text-base" />
                    Прогрес
                  </NavLink>
                  <NavLink
                    to="/kurs"
                    onClick={() => { setDropdownOpen(false); setMobileMenuOpen(false); handleNavClick(); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors md:hidden cursor-pointer"
                    style={{ color: '#888', background: 'none', border: 'none' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#1a1a1a'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#888'; }}
                  >
                    <i className="ri-stack-line text-base" />
                    Модули
                  </NavLink>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors cursor-pointer"
                    style={{ color: '#888', background: 'none', border: 'none' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#1a1a1a'; e.currentTarget.style.color = '#e53e3e'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#888'; }}
                  >
                    <i className="ri-logout-box-line text-base" />
                    Излез от акаунта
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 z-20" style={{ background: '#0a0a0a', borderBottom: '1px solid #1a1a1a' }}>
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => { setMobileMenuOpen(false); handleNavClick(); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors cursor-pointer"
                style={{ color: link.active ? '#fff' : '#888', background: link.active ? '#111' : 'transparent', border: 'none' }}
              >
                <i className={`${link.icon} text-base`} />
                {link.label}
              </NavLink>
            ))}
            <div className="my-2" style={{ borderTop: '1px solid #1a1a1a' }} />
            <button
              onClick={() => { setMobileMenuOpen(false); handleSignOut(); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors cursor-pointer"
              style={{ color: '#888', background: 'none', border: 'none' }}
            >
              <i className="ri-logout-box-line text-base" />
              Излез от акаунта
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
