import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { academyPixel } from '@/lib/metaPixel';

const C = {
  bg: '#0a0a0a',
  accent: '#e53e3e',
  accentHover: '#ff5555',
  success: '#22c55e',
  text: '#ffffff',
  textMuted: '#a0a0a0',
};

export default function MobileBottomBar() {
  const { user, hasFullAccess, unlockedModules } = useAuth();

  const hasAccess = hasFullAccess || (unlockedModules && unlockedModules.length > 0);

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/kurs` },
    });
  };

  const scrollToPricing = () => {
    const el = document.getElementById('akademiya-enrollment');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div
        className="flex items-center gap-2 px-3 py-2.5"
        style={{
          background: 'rgba(10,10,10,0.95)',
          backdropFilter: 'blur(12px)',
          borderTop: '1px solid #1a1a1a',
        }}
      >
        {user ? (
          /* Logged in — show profile + dominant buy CTA */
          <>
            <Link
              to="/dashboard"
              className="flex items-center justify-center gap-1 px-3 py-2.5 text-xs font-medium rounded transition-all cursor-pointer shrink-0"
              style={{ background: 'transparent', border: '1px solid #333', color: C.textMuted }}
            >
              <i className="ri-user-line" />
              <span className="hidden sm:inline">Профил</span>
            </Link>
            <Link
              to="/kurs/checkout"
              onClick={() => academyPixel.initiateCheckout('Mobile Bar — Активирай достъп')}
              className="flex-1 py-2.5 text-xs font-bold text-center rounded transition-all cursor-pointer"
              style={{ background: C.accent, color: '#fff' }}
            >
              {hasAccess ? 'Продължи обучението' : 'Виж цените'}
            </Link>
          </>
        ) : (
          /* Not logged in — 2 buttons: login + view pricing */
          <>
            <button
              onClick={handleGoogleLogin}
              className="flex items-center justify-center gap-1 px-3 py-2.5 text-xs font-bold text-center rounded transition-all cursor-pointer shrink-0"
              style={{ background: '#fff', color: '#0a0a0a' }}
            >
              <i className="ri-google-fill" />
              <span className="hidden sm:inline">Google</span>
            </button>
            <Link
              to="/login"
              className="flex items-center justify-center gap-1 px-3 py-2.5 text-xs font-medium text-center rounded transition-all cursor-pointer shrink-0"
              style={{ background: 'transparent', border: '1px solid #333', color: C.textMuted }}
            >
              <i className="ri-login-box-line" />
              Влез
            </Link>
            <button
              onClick={scrollToPricing}
              className="flex-1 py-2.5 text-xs font-bold text-center rounded transition-all cursor-pointer"
              style={{ background: C.accent, color: '#fff' }}
            >
              Виж цените
            </button>
          </>
        )}
      </div>
      {/* Safe area padding for iOS */}
      <div className="h-[env(safe-area-inset-bottom)]" style={{ background: C.bg }} />
    </div>
  );
}