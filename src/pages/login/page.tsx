import { safeRedirect } from '@/lib/auth-redirect';
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { metaPixel, academyPixel } from '@/lib/metaPixel';

function translateAuthError(message: string): string {
  const msg = message.toLowerCase();
  if (msg.includes('rate limit') || msg.includes('too many')) {
    return 'Твърде много опити. Моля, изчакайте 1 час и опитайте отново.';
  }
  if (msg.includes('invalid login credentials') || msg.includes('invalid credentials')) {
    return 'Невалиден имейл или парола. Проверете данните и опитайте отново.';
  }
  if (msg.includes('email not confirmed')) {
    return 'Имейлът не е потвърден. Проверете пощата си за линк за потвърждение.';
  }
  if (msg.includes('user not found')) {
    return 'Не е намерен акаунт с този имейл.';
  }
  if (msg.includes('network') || msg.includes('fetch')) {
    return 'Проблем с връзката. Проверете интернета и опитайте отново.';
  }
  return message || 'Грешка при влизане. Моля, опитайте отново.';
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = safeRedirect(searchParams.get('redirect'));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(translateAuthError(authError.message));
      setLoading(false);
      return;
    }

    if (!data.session) {
      setError('Неуспешно влизане. Моля, проверете имейла си за потвърждение.');
      setLoading(false);
      return;
    }

    academyPixel.login();
    metaPixel.trackCustom('Login', { external_id: data.user.id });
    navigate(redirectTo);
  };

  const handleGoogleLogin = async () => {
    setError('');
    setGoogleLoading(true);

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}${redirectTo}`,
      },
    });

    if (oauthError) {
      setError(translateAuthError(oauthError.message));
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5F2] flex items-center justify-center px-4 py-12" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="w-full max-w-[420px]">

        {/* TAVORA Logo */}
        <div className="flex justify-center mb-10">
          <Link to="/" className="inline-block">
            <img
              src="https://storage.readdy-site.link/project_files/3f265d07-5825-4e88-a58a-44deb287b858/e232f6df-04d9-4738-9beb-0ed8800a0ec8_TAVORA-MARKETING-AGENCY-VELIKO-TARNOVO.webp?v=501711babf873985bfce13811f385bfa"
              alt="ТАВОРА ЕООД"
              width="160"
              height="40"
              className="h-9 w-auto object-contain"
              loading="eager"
              decoding="async"
            />
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-[#EAE8E4] p-6 md:p-8">
          <h1 className="text-xl font-medium text-[#1A1A1A] mb-1 tracking-tight text-center">
            Вход в акаунта
          </h1>
          <p className="text-sm text-[#8A8A85] font-light mb-8 text-center">
            Академия TAVORA — обучение и ресурси
          </p>

          {error && (
            <div className="mb-6 px-4 py-3 bg-red-50 border border-red-100 rounded-lg">
              <p className="text-sm text-red-600 font-light">{error}</p>
            </div>
          )}

          {/* Google OAuth */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading || loading}
            className="w-full py-3 bg-white border border-[#E0E0DA] text-[#1A1A1A] text-sm font-medium rounded-lg hover:bg-[#F5F5F1] transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer flex items-center justify-center gap-3 mb-5"
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
            Влез с Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-[#E8E8E4]" />
            <span className="text-xs text-[#BDBDB8] font-light">или с имейл</span>
            <div className="flex-1 h-px bg-[#E8E8E4]" />
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
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
                className="w-full px-4 py-3 bg-[#FAFAF8] border border-[#E0E0DA] rounded-lg text-sm text-[#1A1A1A] placeholder-[#BDBDB8] focus:outline-none focus:border-[#0A2540] focus:bg-white transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs text-[#6B6B6B] tracking-wide uppercase font-medium">
                  Парола
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-[#8A8A85] hover:text-[#1A1A1A] transition-colors cursor-pointer"
                >
                  Забравена парола?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-[#FAFAF8] border border-[#E0E0DA] rounded-lg text-sm text-[#1A1A1A] placeholder-[#BDBDB8] focus:outline-none focus:border-[#0A2540] focus:bg-white transition-colors pr-10"
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

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full py-3 bg-[#0A2540] text-white text-sm font-medium rounded-lg hover:bg-[#142d4d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Влизане...
                </span>
              ) : 'Влез в акаунта'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-[#8A8A85] font-light">
            Нямаш акаунт?{' '}
            <Link to={'/register?redirect=' + encodeURIComponent(redirectTo)} className="text-[#0A2540] font-medium hover:underline cursor-pointer">
              Регистрирай се
            </Link>
          </p>
        </div>

        {/* Back link */}
        <div className="mt-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-xs text-[#B0AEA8] hover:text-[#8A8A85] transition-colors cursor-pointer">
            <i className="ri-arrow-left-line" />
            Обратно към началната страница
          </Link>
        </div>
      </div>
    </div>
  );
}
