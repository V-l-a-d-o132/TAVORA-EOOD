import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { metaPixel, academyPixel, generateEventId, getBrowserContext } from '@/lib/metaPixel';

function translateAuthError(message: string): string {
  const msg = message.toLowerCase();
  if (msg.includes('rate limit') || msg.includes('too many') || msg.includes('email rate limit exceeded')) {
    return 'Твърде много опити за регистрация. Моля, изчакайте 1 час и опитайте отново. Или влезте с Google — без лимит!';
  }
  if (msg.includes('already registered') || msg.includes('user already exists')) {
    return 'Вече съществува акаунт с този имейл. Влез в акаунта или използвай "Забравена парола".';
  }
  if (msg.includes('invalid email')) {
    return 'Невалиден имейл адрес. Проверете и опитайте отново.';
  }
  if (msg.includes('password') && msg.includes('short')) {
    return 'Паролата е твърде кратка. Минимум 6 символа.';
  }
  if (msg.includes('network') || msg.includes('fetch')) {
    return 'Проблем с връзката. Проверете интернета и опитайте отново.';
  }
  return message || 'Грешка при регистрация. Моля, опитайте отново.';
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (password !== confirmPassword) {
      setError('Паролите не съвпадат.');
      return;
    }

    if (password.length < 6) {
      setError('Паролата трябва да е поне 6 символа.');
      return;
    }

    setLoading(true);

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (authError) {
      setError(translateAuthError(authError.message));
      setLoading(false);
      return;
    }

    if (!data.user) {
      setError('Неуспешна регистрация. Моля, опитайте отново.');
      setLoading(false);
      return;
    }

    // Meta Pixel — CompleteRegistration (browser + CAPI server-side)
    const eventId = generateEventId();
    const browserCtx = getBrowserContext();
    const nameParts = fullName.trim().split(/\s+/);
    const fn = nameParts[0] || '';
    const ln = nameParts.slice(1).join(' ') || '';

    metaPixel.completeRegistration('registered', eventId);
    academyPixel.register();

    // CAPI server-side — deduplicated via shared event_id
    const capiUrl = `${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/meta-conversions-api`;
    try {
      fetch(capiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pixel_id: '1417762636838758',
          event_name: 'CompleteRegistration',
          event_id: eventId,
          action_source: 'website',
          event_source_url: window.location.href,
          user_data: {
            em: email,
            fn: fn || undefined,
            ln: ln || undefined,
            client_user_agent: browserCtx.userAgent,
            fbc: browserCtx.fbc || undefined,
            fbp: browserCtx.fbp || undefined,
          },
          custom_data: {
            content_category: 'Академия TAVORA',
            status: 'registered',
          },
        }),
      }).catch(() => {});
    } catch { /* CAPI is non-blocking */ }

    if (!data.session) {
      setSuccess(true);
      setLoading(false);
      return;
    }

    navigate('/kurs');
  };

  const handleGoogleLogin = async () => {
    setError('');
    setGoogleLoading(true);

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/kurs`,
      },
    });

    if (oauthError) {
      setError(translateAuthError(oauthError.message));
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex">
      {/* Left panel - decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://readdy.ai/api/search-image?query=abstract%20minimalist%20luxury%20background%20with%20soft%20warm%20beige%20and%20cream%20tones%2C%20elegant%20geometric%20shapes%2C%20subtle%20gold%20accents%2C%20high%20end%20editorial%20aesthetic%2C%20clean%20sophisticated%20composition%2C%20muted%20palette%2C%20artistic%20texture&width=800&height=1000&seq=register-bg-2&orientation=portrait"
          alt="Platform visual"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A]/60 via-[#1A1A1A]/30 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-12">
          <div className="mb-8">
            <p className="text-white/60 text-xs tracking-[0.3em] uppercase mb-3 font-light">Започни днес</p>
            <h2 className="text-white text-3xl font-light leading-tight mb-4">
              Твоят AI бизнес<br />започва тук
            </h2>
            <div className="space-y-3 mt-6">
              {[
                'Достъп до всички видео модули',
                'Проследяване на твоя прогрес',
                'Предаване на домашни задания',
                'Персонален dashboard',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-check-line text-white/80 text-sm" />
                  </div>
                  <p className="text-white/80 text-sm font-light">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link to="/" className="inline-flex items-center gap-2 mb-10 group cursor-pointer">
            <div className="w-8 h-8 bg-[#1A1A1A] rounded-sm flex items-center justify-center">
              <span className="text-white text-xs font-semibold tracking-wider">AI</span>
            </div>
            <span className="text-[#1A1A1A] text-sm font-medium tracking-wide">Мастърклас</span>
          </Link>

          <h1 className="text-2xl font-light text-[#1A1A1A] mb-2 tracking-tight">Създай акаунт</h1>
          <p className="text-sm text-[#6B6B6B] font-light mb-8">Регистрирай се и започни обучението си</p>

          {error && (
            <div className="mb-6 px-4 py-3 bg-red-50 border border-red-100 rounded-md">
              <p className="text-sm text-red-600 font-light">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 px-4 py-3 bg-[#F0F7F4] border border-[#C3E0D4] rounded-md">
              <p className="text-sm text-[#1B4332] font-light">
                Регистрацията е успешна! Проверете имейла си за потвърждение.
              </p>
              <Link to="/login" className="text-sm text-[#1B4332] font-medium hover:underline mt-2 inline-block cursor-pointer">
                Влез в акаунта →
              </Link>
            </div>
          )}

          {!success && (
            <>
              {/* Google OAuth */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={googleLoading || loading}
                className="w-full py-3 bg-white border border-[#E8E8E4] text-[#1A1A1A] text-sm font-medium rounded-md hover:bg-[#F5F5F3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer flex items-center justify-center gap-3 mb-5"
              >
                {googleLoading ? (
                  <span className="w-4 h-4 border-2 border-[#1A1A1A]/20 border-t-[#1A1A1A] rounded-full animate-spin" />
                ) : (
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                  </svg>
                )}
                Регистрирай се с Google
              </button>

              {/* Divider */}
              <div className="flex items-center gap-4 mb-5">
                <div className="flex-1 h-px bg-[#E8E8E4]" />
                <span className="text-xs text-[#BDBDB8] font-light">или с имейл</span>
                <div className="flex-1 h-px bg-[#E8E8E4]" />
              </div>

              <form onSubmit={handleRegister} className="space-y-5">
                <div>
                  <label className="block text-xs text-[#6B6B6B] tracking-wide uppercase mb-2 font-medium">
                    Пълно име
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="Иван Иванов"
                    className="w-full px-4 py-3 bg-white border border-[#E8E8E4] rounded-md text-sm text-[#1A1A1A] placeholder-[#BDBDB8] focus:outline-none focus:border-[#1A1A1A] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#6B6B6B] tracking-wide uppercase mb-2 font-medium">
                    Имейл адрес
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="tvoiat@email.com"
                    className="w-full px-4 py-3 bg-white border border-[#E8E8E4] rounded-md text-sm text-[#1A1A1A] placeholder-[#BDBDB8] focus:outline-none focus:border-[#1A1A1A] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#6B6B6B] tracking-wide uppercase mb-2 font-medium">
                    Парола
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Минимум 6 символа"
                      className="w-full px-4 py-3 bg-white border border-[#E8E8E4] rounded-md text-sm text-[#1A1A1A] placeholder-[#BDBDB8] focus:outline-none focus:border-[#1A1A1A] transition-colors pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-[#BDBDB8] hover:text-[#6B6B6B] cursor-pointer transition-colors"
                    >
                      <i className={showPassword ? 'ri-eye-off-line text-base' : 'ri-eye-line text-base'} />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-[#6B6B6B] tracking-wide uppercase mb-2 font-medium">
                    Потвърди паролата
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-white border border-[#E8E8E4] rounded-md text-sm text-[#1A1A1A] placeholder-[#BDBDB8] focus:outline-none focus:border-[#1A1A1A] transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || googleLoading}
                  className="w-full py-3 bg-[#1A1A1A] text-white text-sm font-medium rounded-md hover:bg-[#2A2A2A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Регистрация...
                    </span>
                  ) : 'Създай акаунт'}
                </button>
              </form>
            </>
          )}

          {!success && (
            <p className="mt-8 text-center text-sm text-[#6B6B6B] font-light">
              Вече имаш акаунт?{' '}
              <Link to="/login" className="text-[#1A1A1A] font-medium hover:underline cursor-pointer">
                Влез тук
              </Link>
            </p>
          )}

          <div className="mt-10 pt-6 border-t border-[#E8E8E4]">
            <Link to="/" className="flex items-center gap-2 text-xs text-[#BDBDB8] hover:text-[#6B6B6B] transition-colors cursor-pointer">
              <i className="ri-arrow-left-line" />
              Обратно към началната страница
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
