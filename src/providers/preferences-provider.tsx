'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';

import type { UiLanguage } from '@/src/i18n/types';

export type ThemePreference = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'taomusic-theme-preference';
const LANGUAGE_STORAGE_KEY = 'taomusic-ui-language';

interface PreferencesContextValue {
  language: UiLanguage;
  resolvedTheme: ResolvedTheme;
  setLanguage: (language: UiLanguage) => void;
  setThemePreference: (themePreference: ThemePreference) => void;
  themePreference: ThemePreference;
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

const getSystemTheme = (): ResolvedTheme => {
  if (typeof window === 'undefined') {
    return 'light';
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const detectBrowserLanguage = (): UiLanguage => {
  if (typeof navigator === 'undefined') {
    return 'en';
  }

  return navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en';
};

const readThemePreference = (): ThemePreference => {
  if (typeof document === 'undefined') {
    return 'system';
  }

  const htmlPreference = document.documentElement.dataset.themePreference;

  if (
    htmlPreference === 'light' ||
    htmlPreference === 'dark' ||
    htmlPreference === 'system'
  ) {
    return htmlPreference;
  }

  return 'system';
};

const readResolvedTheme = (): ResolvedTheme => {
  if (typeof document === 'undefined') {
    return 'light';
  }

  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
};

const readUiLanguage = (): UiLanguage => {
  if (typeof document === 'undefined') {
    return 'en';
  }

  return document.documentElement.lang === 'zh' ? 'zh' : 'en';
};

const applyDocumentPreferences = (
  themePreference: ThemePreference,
  resolvedTheme: ResolvedTheme,
  language: UiLanguage,
): void => {
  if (typeof document === 'undefined') {
    return;
  }

  const root = document.documentElement;
  root.dataset.themePreference = themePreference;
  root.dataset.theme = resolvedTheme;
  root.lang = language;
  root.style.colorScheme = resolvedTheme;
};

interface PreferencesProviderProps {
  children: ReactNode;
}

export function PreferencesProvider({ children }: PreferencesProviderProps) {
  const [themePreference, setThemePreferenceState] =
    useState<ThemePreference>(readThemePreference);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(readResolvedTheme);
  const [language, setLanguageState] = useState<UiLanguage>(readUiLanguage);

  useEffect(() => {
    try {
      const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
      const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
      const nextThemePreference =
        storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system'
          ? storedTheme
          : readThemePreference();
      const nextLanguage =
        storedLanguage === 'zh' || storedLanguage === 'en'
          ? storedLanguage
          : detectBrowserLanguage();
      const nextResolvedTheme =
        nextThemePreference === 'system' ? getSystemTheme() : nextThemePreference;

      setThemePreferenceState(nextThemePreference);
      setResolvedTheme(nextResolvedTheme);
      setLanguageState(nextLanguage);
      applyDocumentPreferences(nextThemePreference, nextResolvedTheme, nextLanguage);
    } catch {
      const fallbackResolvedTheme = getSystemTheme();
      const fallbackLanguage = detectBrowserLanguage();

      setThemePreferenceState('system');
      setResolvedTheme(fallbackResolvedTheme);
      setLanguageState(fallbackLanguage);
      applyDocumentPreferences('system', fallbackResolvedTheme, fallbackLanguage);
    }
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const updateSystemTheme = (): void => {
      if (themePreference !== 'system') {
        return;
      }

      const nextResolvedTheme = getSystemTheme();
      setResolvedTheme(nextResolvedTheme);
      applyDocumentPreferences(themePreference, nextResolvedTheme, language);
    };

    updateSystemTheme();
    mediaQuery.addEventListener('change', updateSystemTheme);

    return () => {
      mediaQuery.removeEventListener('change', updateSystemTheme);
    };
  }, [language, themePreference]);

  useEffect(() => {
    const nextResolvedTheme =
      themePreference === 'system' ? getSystemTheme() : themePreference;

    setResolvedTheme(nextResolvedTheme);
    applyDocumentPreferences(themePreference, nextResolvedTheme, language);
    window.localStorage.setItem(THEME_STORAGE_KEY, themePreference);
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [language, themePreference]);

  const value = useMemo<PreferencesContextValue>(
    () => ({
      language,
      resolvedTheme,
      setLanguage: setLanguageState,
      setThemePreference: setThemePreferenceState,
      themePreference,
    }),
    [language, resolvedTheme, themePreference],
  );

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

export const usePreferences = (): PreferencesContextValue => {
  const value = useContext(PreferencesContext);

  if (!value) {
    throw new Error('usePreferences must be used inside PreferencesProvider.');
  }

  return value;
};
