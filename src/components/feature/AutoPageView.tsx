import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { metaPixel, academyPixel } from '@/lib/metaPixel';

/**
 * AutoPageView — автоматично засича PageView при всяка промяна на route.
 * Поставя се веднъж в App.tsx и не се пипа повече.
 *
 * TAVORA pixel fires PageView on every route.
 * Academy pixel fires PageView ONLY on academy pages (kurs, checkout, login, module, register, dashboard).
 */
export default function AutoPageView() {
  const location = useLocation();

  useEffect(() => {
    // TAVORA — global PageView
    metaPixel.pageView();

    // Academy — PageView only on academy pages for proper ad attribution
    const isAcademyPage =
      location.pathname.startsWith('/kurs') ||
      location.pathname.startsWith('/checkout') ||
      location.pathname.startsWith('/login') ||
      location.pathname.startsWith('/register') ||
      location.pathname.startsWith('/module') ||
      location.pathname.startsWith('/dashboard') ||
      location.pathname.startsWith('/kurs-potvardjenie') ||
      location.pathname.startsWith('/forgot-password');
    if (isAcademyPage) {
      academyPixel.pageView();
    }
  }, [location.pathname]);

  // No UI — pure side-effect component
  return null;
}