export type ThemePreference = 'dark' | 'light' | 'system';
export type AcademyTheme = 'dark' | 'light';

export const academyThemeStorageKey = (userId?: string) => `tavora:academy-theme:${userId || 'guest'}`;

export function validThemePreference(value: unknown): value is ThemePreference {
  return value === 'dark' || value === 'light' || value === 'system';
}

export function readThemePreference(key: string): ThemePreference {
  try {
    const value = localStorage.getItem(key);
    return validThemePreference(value) ? value : 'dark';
  } catch { return 'dark'; }
}

export function resolvedTheme(preference: ThemePreference, systemDark: boolean): AcademyTheme {
  return preference === 'system' ? (systemDark ? 'dark' : 'light') : preference;
}

/** Shared colors for the older components that use inline styles. */
export const ACADEMY_COLORS = {
  bg: 'var(--academy-bg)', surface: 'var(--academy-surface)',
  surfaceHover: 'var(--academy-hover)', surfaceElevated: 'var(--academy-raised)',
  border: 'var(--academy-border)', borderHover: 'var(--academy-border-strong)',
  accent: 'var(--academy-primary)', accentHover: 'var(--academy-primary-hover)',
  accentText: 'var(--academy-accent)', accentTextHover: 'var(--academy-accent-hover)',
  accentDim: 'var(--academy-accent-bg)', primary: 'var(--academy-primary)',
  primaryHover: 'var(--academy-primary-hover)', text: 'var(--academy-text)',
  textMuted: 'var(--academy-muted)', textDim: 'var(--academy-subtle)',
  success: 'var(--academy-success-fill)', successText: 'var(--academy-success)', successDim: 'var(--academy-success-bg)',
  successBorder: 'var(--academy-success-border)',
};
