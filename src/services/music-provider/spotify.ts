import { env } from '@/src/lib/env';
import { MemoryCache } from '@/src/services/cache/memory-cache';

import type {
  MusicCandidate,
  QueryPlan,
} from '@/src/features/recommendations/types';
import type { MusicProvider } from '@/src/services/music-provider/types';

interface SpotifySearchResponse {
  tracks?: {
    items: Array<{
      album: {
        images: Array<{ url: string }>;
        name: string;
      };
      artists: Array<{ name: string }>;
      id: string;
      name: string;
      popularity: number;
    }>;
  };
}

const queryCache = new MemoryCache<MusicCandidate[]>(1000 * 60 * 10);
const tokenCache = new MemoryCache<string>(1000 * 60 * 50);

const buildSearchQuery = (plan: QueryPlan): string => {
  return [...plan.primaryTerms, ...plan.secondaryTerms.slice(0, 4)]
    .filter(Boolean)
    .join(' ');
};

export class SpotifyMusicProvider implements MusicProvider {
  name = 'spotify';

  private async getAccessToken(): Promise<string> {
    const cached = tokenCache.get('spotify-token');

    if (cached) {
      return cached;
    }

    const credentials = Buffer.from(
      `${env.spotifyClientId}:${env.spotifyClientSecret}`,
    ).toString('base64');

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      throw new Error('Spotify token request failed.');
    }

    const payload = (await response.json()) as { access_token: string };
    tokenCache.set('spotify-token', payload.access_token);
    return payload.access_token;
  }

  async fetchCandidates(plan: QueryPlan): Promise<MusicCandidate[]> {
    const query = buildSearchQuery(plan);

    if (!query) {
      return [];
    }

    const cached = queryCache.get(query);

    if (cached) {
      return cached;
    }

    const token = await this.getAccessToken();
    const response = await fetch(
      `https://api.spotify.com/v1/search?type=track&limit=${plan.limit}&q=${encodeURIComponent(
        query,
      )}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error('Spotify search request failed.');
    }

    const payload = (await response.json()) as SpotifySearchResponse;
    const candidates =
      payload.tracks?.items.map((item) => ({
        id: `spotify-${item.id}`,
        title: item.name,
        artist: item.artists.map((artist) => artist.name).join(', '),
        album: item.album.name,
        genreTags: plan.genre ? [plan.genre] : [],
        moodTags: plan.secondaryTerms.slice(0, 3),
        region: plan.region,
        instrumentationTags: [],
        lyricalThemeTags: [],
        artworkColorHint: undefined,
        popularity: item.popularity,
        energyLevel: undefined,
        focusLevel: undefined,
        searchKeywords: [item.name, item.album.name, ...item.artists.map((artist) => artist.name)],
        artworkUrl: item.album.images[0]?.url,
        source: 'spotify',
      })) ?? [];

    queryCache.set(query, candidates);
    return candidates;
  }
}
