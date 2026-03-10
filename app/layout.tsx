import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import './globals.css';

export const metadata: Metadata = {
  title: 'TaoMusic',
  description: 'A lightweight AI music muse for contextual recommendations and serendipity.',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
