import { hasSpotifyConfig } from '@/src/lib/env';
import { SeedMusicProvider } from '@/src/services/music-provider/seed';
import { SpotifyMusicProvider } from '@/src/services/music-provider/spotify';

import type { MusicProvider } from '@/src/services/music-provider/types';

let providers: MusicProvider[] | undefined;

export const getMusicProviders = (): MusicProvider[] => {
  if (!providers) {
    providers = [new SeedMusicProvider()];

    if (hasSpotifyConfig()) {
      providers.push(new SpotifyMusicProvider());
    }
  }

  return providers;
};
