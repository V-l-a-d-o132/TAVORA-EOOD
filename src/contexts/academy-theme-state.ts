import { createContext, useContext } from 'react';
import type { AcademyTheme, ThemePreference } from '@/lib/academy-theme';

interface ThemeContextValue {
  preference: ThemePreference; theme: AcademyTheme;
  setPreference: (preference: ThemePreference) => void;
}
export const AcademyThemeContext = createContext<ThemeContextValue>({ preference: 'dark', theme: 'dark', setPreference: () => {} });
export function useAcademyTheme() { return useContext(AcademyThemeContext); }
