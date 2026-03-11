import { NextResponse } from 'next/server';

import { LOCAL_CATALOG } from '@/data/catalog';
import { hasLlmConfig, hasSpotifyConfig } from '@/src/lib/env';

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    ok: true,
    version: '0.6.0',
    providers: {
      localCatalogAvailable: true,
      localCatalogTracks: LOCAL_CATALOG.length,
      spotifyConfigured: hasSpotifyConfig(),
      llmConfigured: hasLlmConfig(),
    },
  });
}
