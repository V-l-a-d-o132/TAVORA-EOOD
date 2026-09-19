import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { academyPixel } from '@/lib/metaPixel';

const C = {
  bg: '#0a0a0a',
  surface: '#111111',
  border: '#1a1a1a',
  borderHover: '#2a2a2a',
  accent: '#e53e3e',
  accentHover: '#ff5555',
  text: '#ffffff',
  textMuted: '#a0a0a0',
  textDim: '#666666',
  success: '#22c55e',
};

export default function AcademyAccessSection() {
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleLogin = async () => {
    if (googleLoading) return;
    setGoogleLoading(true);
    academyPixel.login();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/kurs` },
    });
    if (error) setGoogleLoading(false);
  };

  return (
    <section id="academy-access" className="relative w-full py-16 md:py-24" style={{ background: C.bg }}>
      <div className="max-w-xl mx-auto px-4 md:px-8">
        {/* Badge */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5" style={{ border: `1px solid ${C.success}` }}>
            <div className="w-2 h-2" style={{ background: C.success }} />
            <span className="text-[10px] md:text-xs font-bold tracking-[0.15em] uppercase whitespace-nowrap" style={{ color: C.success }}>
              БЕЗПЛАТЕН МОДУЛ 1
            </span>
          </div>
        </div>

        {/* Headline */}
        <h2 className="text-xl md:text-3xl font-bold text-center mb-3 tracking-tight" style={{ color: C.text }}>
          Влез и започни веднага
        </h2>
        <p className="text-sm md:text-base text-center mb-8 max-w-md mx-auto leading-relaxed" style={{ color: C.textMuted }}>
          Модул 1 — AI Advantage е безплатен. Създай акаунт и започни.
          Без карта. Без задължения. Само стойност.
        </p>

        <div className="p-5 md:p-7" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          {/* Primary: create account */}
          <Link
            to="/register"
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold transition-all whitespace-nowrap cursor-pointer mb-3"
            style={{ background: C.accent, color: '#fff' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = C.accentHover; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = C.accent; }}
          >
            <i className="ri-user-add-line" />
            Създай безплатен акаунт
          </Link>

          {/* Google */}
          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold transition-all whitespace-nowrap cursor-pointer disabled:opacity-60 mb-3"
            style={{ background: '#fff', color: '#0a0a0a' }}
          >
            {googleLoading ? (
              <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <>
                <i className="ri-google-fill" style={{ fontSize: '18px' }} />
                Продължи с Google
              </>
            )}
          </button>

          {/* Existing account */}
          <Link
            to="/login"
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-medium transition-all whitespace-nowrap cursor-pointer"
            style={{ background: 'transparent', border: `1px solid ${C.borderHover}`, color: C.text }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.textMuted; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.borderHover; }}
          >
            <i className="ri-login-box-line" />
            Вече имаш акаунт? Влез
          </Link>

          {/* Trust line */}
          <div className="flex items-center justify-center gap-4 mt-5">
            <span className="text-[10px] flex items-center gap-1" style={{ color: C.textDim }}>
              <i className="ri-lock-line" />
              SSL криптирано
            </span>
            <span className="text-[10px] flex items-center gap-1" style={{ color: C.textDim }}>
              <i className="ri-vip-crown-line" />
              Без карта
            </span>
            <span className="text-[10px] flex items-center gap-1" style={{ color: C.textDim }}>
              <i className="ri-time-line" />
              30 секунди
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}