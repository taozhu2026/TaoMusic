import { NextResponse } from 'next/server';

import { hasLlmConfig, hasSpotifyConfig } from '@/src/lib/env';

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    ok: true,
    providers: {
      spotifyConfigured: hasSpotifyConfig(),
      llmConfigured: hasLlmConfig(),
    },
  });
}
