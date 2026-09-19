import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (resetError) {
      if (resetError.message.toLowerCase().includes('rate limit') || resetError.message.toLowerCase().includes('too many')) {
        setError('Изпратени са твърде много имейли. Моля, изчакайте 1 час и опитайте отново.');
      } else {
        setError('Грешка при изпращане. Моля, проверете имейла и опитайте отново.');
      }
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://readdy.ai/api/search-image?query=abstract%20minimalist%20luxury%20background%20with%20soft%20warm%20beige%20and%20cream%20tones%2C%20elegant%20geometric%20shapes%2C%20subtle%20gold%20accents%2C%20high%20end%20editorial%20aesthetic%2C%20clean%20sophisticated%20composition%2C%20muted%20palette%2C%20artistic%20texture&width=800&height=1000&seq=forgot-bg-1&orientation=portrait"
          alt="Platform visual"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A]/60 via-[#1A1A1A]/30 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-12">
          <div className="mb-8">
            <p className="text-white/60 text-xs tracking-[0.3em] uppercase mb-3 font-light">Академия TAVORA</p>
            <h2 className="text-white text-3xl font-light leading-tight mb-4">
              Нулиране на<br />паролата
            </h2>
            <p className="text-white/70 text-sm font-light leading-relaxed max-w-sm">
              Ще ти изпратим линк на имейла, с който да зададеш нова парола.
            </p>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link to="/" className="inline-flex items-center gap-2 mb-10 group cursor-pointer">
            <div className="w-8 h-8 bg-[#1A1A1A] rounded-sm flex items-center justify-center">
              <span className="text-white text-xs font-semibold tracking-wider">AI</span>
            </div>
            <span className="text-[#1A1A1A] text-sm font-medium tracking-wide">Мастърклас</span>
          </Link>

          <h1 className="text-2xl font-light text-[#1A1A1A] mb-2 tracking-tight">Забравена парола</h1>
          <p className="text-sm text-[#6B6B6B] font-light mb-8">
            Въведи имейла си и ще ти изпратим линк за нулиране на паролата.
          </p>

          {error && (
            <div className="mb-6 px-4 py-3 bg-red-50 border border-red-100 rounded-md">
              <p className="text-sm text-red-600 font-light">{error}</p>
            </div>
          )}

          {sent ? (
            <div className="space-y-6">
              <div className="px-5 py-5 bg-[#F0F7F4] border border-[#C3E0D4] rounded-md">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <i className="ri-mail-check-line text-[#1B4332] text-xl" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1B4332] mb-1">Имейлът е изпратен!</p>
                    <p className="text-sm text-[#2D6A4F] font-light leading-relaxed">
                      Провери входящата си поща на <strong>{email}</strong>. Линкът е валиден 1 час.
                    </p>
                    <p className="text-xs text-[#52796F] mt-2 font-light">
                      Не виждаш имейла? Провери папката "Спам" или "Промоции".
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => { setSent(false); setEmail(''); }}
                className="w-full py-3 bg-white border border-[#E8E8E4] text-[#1A1A1A] text-sm font-medium rounded-md hover:bg-[#F5F5F3] transition-colors whitespace-nowrap cursor-pointer"
              >
                Изпрати отново
              </button>

              <Link
                to="/login"
                className="flex items-center justify-center gap-2 text-sm text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors cursor-pointer"
              >
                <i className="ri-arrow-left-line text-xs" />
                Обратно към вход
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
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

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#1A1A1A] text-white text-sm font-medium rounded-md hover:bg-[#2A2A2A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Изпращане...
                  </span>
                ) : 'Изпрати линк за нулиране'}
              </button>

              <Link
                to="/login"
                className="flex items-center justify-center gap-2 text-sm text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors cursor-pointer"
              >
                <i className="ri-arrow-left-line text-xs" />
                Обратно към вход
              </Link>
            </form>
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
