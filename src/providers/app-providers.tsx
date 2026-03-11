'use client';

import type { ReactNode } from 'react';

import { PreferencesProvider } from '@/src/providers/preferences-provider';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return <PreferencesProvider>{children}</PreferencesProvider>;
}
