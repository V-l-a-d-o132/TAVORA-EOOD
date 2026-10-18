import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { academyThemeStorageKey, readThemePreference, resolvedTheme, type ThemePreference } from '@/lib/academy-theme';
import { AcademyThemeContext, useAcademyTheme } from './academy-theme-state';

const QUERY = '(prefers-color-scheme: dark)';

export function AcademyThemeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const key = academyThemeStorageKey(user?.id);
  const [selection, setSelection] = useState(() => ({ key, preference: readThemePreference(key) }));
  const [systemDark, setSystemDark] = useState(() => typeof window.matchMedia === 'function' && window.matchMedia(QUERY).matches);
  // The new account's preference is read before rendering its learning screen.
  const preference = selection.key === key ? selection.preference : readThemePreference(key);

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const media = window.matchMedia(QUERY);
    const changed = () => setSystemDark(media.matches);
    changed(); media.addEventListener('change', changed);
    return () => media.removeEventListener('change', changed);
  }, []);

  useEffect(() => {
    const changed = (event: StorageEvent) => {
      if (event.key === key || event.key === null) setSelection({ key, preference: readThemePreference(key) });
    };
    window.addEventListener('storage', changed);
    return () => window.removeEventListener('storage', changed);
  }, [key]);

  const setPreference = useCallback((value: ThemePreference) => {
    try { localStorage.setItem(key, value); } catch { /* The choice still works when storage is unavailable. */ }
    setSelection({ key, preference: value });
  }, [key]);
  const value = useMemo(() => ({ preference, theme: resolvedTheme(preference, systemDark), setPreference }), [preference, systemDark, setPreference]);
  return <AcademyThemeContext.Provider value={value}>{children}</AcademyThemeContext.Provider>;
}

/** Scope colors to the learning routes; switching colors never remounts lessons. */
export function AcademyThemeScope({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const { theme } = useAcademyTheme();
  const active = pathname === '/dashboard' || pathname === '/kurs' || pathname.startsWith('/module/') || pathname.startsWith('/academy-labs/') || pathname.startsWith('/academy-tools/');
  return <div className={active ? 'academy-themed' : undefined} data-academy-theme={active ? theme : undefined}>{children}</div>;
}
