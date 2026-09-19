import { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

interface AdminRouteProps {
  children: React.ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const [status, setStatus] = useState<'loading' | 'auth' | 'unauth' | 'forbidden'>('loading');
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function checkAccess() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        if (!cancelled) setStatus('unauth');
        return;
      }

      // Fetch user's role from profiles
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .maybeSingle();

      if (!cancelled) {
        const role = profile?.role || 'user';
        setUserRole(role);
        if (role === 'admin' || role === 'super_admin') {
          setStatus('auth');
        } else {
          setStatus('forbidden');
        }
      }
    }

    checkAccess();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session?.user) {
        if (!cancelled) setStatus('unauth');
      } else {
        // Re-check role on auth change
        checkAccess();
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background-50 gap-4">
        <div className="w-8 h-8 border-2 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
        <p className="text-foreground-600 text-sm">Проверка на достъпа...</p>
      </div>
    );
  }

  if (status === 'unauth') {
    return <Navigate to="/admin/login" replace />;
  }

  if (status === 'forbidden') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background-50 gap-6 px-4">
        <div className="w-20 h-20 rounded-full bg-accent-100 flex items-center justify-center">
          <i className="ri-shield-keyhole-line text-3xl text-accent-600"></i>
        </div>
        <h2 className="text-2xl font-heading font-bold text-foreground-950 text-center">
          Нямаш достъп
        </h2>
        <p className="text-foreground-600 text-center max-w-md">
          Този панел е достъпен само за администратори. Ако смяташ, че това е грешка, свържи се със супер админа.
        </p>
        <Link
          to="/kurs"
          className="px-6 py-3 bg-primary-500 text-background-50 rounded-lg font-medium hover:bg-primary-600 transition-colors whitespace-nowrap"
        >
          Към платформата
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}