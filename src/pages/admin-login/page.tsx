import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkAdmin() {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        setChecking(false);
        return;
      }

      // Check if the logged-in user is admin
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .maybeSingle();

      const role = profile?.role || 'user';

      if (role === 'admin' || role === 'super_admin') {
        navigate('/admin/novini', { replace: true });
      } else {
        // Logged in but NOT admin - show login form with message
        setChecking(false);
      }
    }

    checkAdmin();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError || !data.user) {
      setError('Невалиден имейл или парола.');
      setLoading(false);
      return;
    }

    // Check role after login
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .maybeSingle();

    const role = profile?.role || 'user';

    if (role === 'admin' || role === 'super_admin') {
      navigate('/admin/novini', { replace: true });
    } else {
      setError('Този акаунт няма администраторски права.');
      setLoading(false);
      // Sign them out since they don't have access
      await supabase.auth.signOut();
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-50">
        <div className="w-6 h-6 border-2 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/">
            <img
              src="https://storage.readdy-site.link/project_files/3f265d07-5825-4e88-a58a-44deb287b858/777dce2a-8731-4235-b0be-7837a840c3c9_TAVORA-MARKETING-AGENCY-VELIKO-TARNOVO.png?v=f6135e7442d441feef102ad2f8425862"
              alt="ТАВОРА ЕООД"
              className="h-8 w-auto object-contain mx-auto mb-4"
            />
          </Link>
          <h1 className="text-xl text-foreground-950" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Админ панел
          </h1>
          <p className="text-xs text-foreground-600 mt-1">Влезте с администраторски акаунт</p>
        </div>

        <div className="bg-background-50 rounded-2xl border border-background-200 p-6 md:p-8">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-accent-100 border border-accent-200 text-xs text-accent-700">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs text-foreground-600 mb-1.5">
                Имейл адрес
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@tavora.bg"
                className="w-full px-4 py-3 text-sm bg-background-50 border border-background-200 rounded-lg focus:outline-none focus:border-primary-500/30 text-foreground-950 placeholder-foreground-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs text-foreground-600 mb-1.5">
                Парола
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-10 text-sm bg-background-50 border border-background-200 rounded-lg focus:outline-none focus:border-primary-500/30 text-foreground-950 placeholder-foreground-400 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-foreground-600 hover:text-foreground-800 cursor-pointer transition-colors"
                >
                  <i className={showPassword ? 'ri-eye-off-line text-sm' : 'ri-eye-line text-sm'} />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary-500 text-background-50 text-sm rounded-lg hover:bg-primary-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-background-50/30 border-t-background-50 rounded-full animate-spin" />
                  Проверка...
                </span>
              ) : 'Влез в панела'}
            </button>
          </form>
        </div>

        <div className="text-center mt-5">
          <Link to="/" className="text-xs text-foreground-600 hover:text-primary-500 transition-colors flex items-center justify-center gap-1.5">
            <i className="ri-arrow-left-line text-xs" />
            Обратно към сайта
          </Link>
        </div>
      </div>
    </div>
  );
}