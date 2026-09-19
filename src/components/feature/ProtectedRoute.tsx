import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#e53e3e] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[#666666] font-light tracking-wide">Зареждане...</p>
        </div>
      </div>
    );
  }

  // Module 1 (s01-m01) is public — free preview without login
  const isPublicModule = location.pathname === '/module/s01-m01';

  if (!user && !isPublicModule) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}