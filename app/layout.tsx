import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { AppProviders } from '@/src/providers/app-providers';

import './globals.css';

export const metadata: Metadata = {
  title: 'TaoMusic',
  description: 'A bilingual AI music muse for contextual recommendations, result routing, and editorial atmospheres.',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
  },
};

const bootstrapScript = `
(() => {
  const themeKey = 'taomusic-theme-preference';
  const languageKey = 'taomusic-ui-language';
  const root = document.documentElement;
  const storedTheme = localStorage.getItem(themeKey);
  const storedLanguage = localStorage.getItem(languageKey);
  const themePreference =
    storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system'
      ? storedTheme
      : 'system';
  const resolvedTheme =
    themePreference === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : themePreference;
  const language =
    storedLanguage === 'zh' || storedLanguage === 'en'
      ? storedLanguage
      : (navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en');
  root.dataset.themePreference = themePreference;
  root.dataset.theme = resolvedTheme;
  root.lang = language;
  root.style.colorScheme = resolvedTheme;
})();
`;

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootstrapScript }} />
      </head>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
