import { NextResponse } from 'next/server';

import { hasLlmConfig, hasSpotifyConfig } from '@/src/lib/env';

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    ok: true,
    version: '0.2.0',
    providers: {
      seedLibraryAvailable: true,
      spotifyConfigured: hasSpotifyConfig(),
      llmConfigured: hasLlmConfig(),
    },
  });
}
