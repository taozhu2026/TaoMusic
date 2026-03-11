import { env } from '@/src/lib/env';
import { uniqueStrings } from '@/src/lib/text';
import { MemoryCache } from '@/src/services/cache/memory-cache';

import type {
  MusicCandidate,
  QueryPlan,
} from '@/src/features/recommendations/types';
import type { MusicProvider } from '@/src/services/music-provider/types';

interface SpotifySearchResponse {
  tracks?: {
    items: SpotifyTrackItem[];
  };
}

interface SpotifyTrackItem {
  album: {
    images: Array<{ url: string }>;
    name: string;
  };
  artists: Array<{ id: string; name: string }>;
  id: string;
  name: string;
  popularity: number;
}

interface SpotifyArtistsResponse {
  artists: Array<{
    genres: string[];
    id: string;
  }>;
}

const queryCache = new MemoryCache<MusicCandidate[]>(1000 * 60 * 10);
const tokenCache = new MemoryCache<string>(1000 * 60 * 50);

const normalizeTag = (value: string): string => {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

const buildSearchQueries = (plan: QueryPlan): string[] => {
  const queryVariants = [
    [...plan.primaryTerms, ...plan.secondaryTerms.slice(0, 2)],
    [plan.genre, ...plan.secondaryTerms.slice(0, 3)],
    [plan.region, plan.genre, ...plan.secondaryTerms.slice(0, 1)],
  ];

  return uniqueStrings(
    queryVariants
      .map((variant) => variant.filter(Boolean).join(' ').trim())
      .filter(Boolean),
  );
};

export class SpotifyMusicProvider implements MusicProvider {
  kind: 'external' = 'external';
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

  private async searchTracks(
    query: string,
    plan: QueryPlan,
    token: string,
  ): Promise<SpotifyTrackItem[]> {
    const response = await fetch(
      `https://api.spotify.com/v1/search?type=track&limit=${Math.max(
        6,
        Math.ceil(plan.limit / 2),
      )}&q=${encodeURIComponent(query)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Spotify search failed for query: ${query}`);
    }

    const payload = (await response.json()) as SpotifySearchResponse;
    return payload.tracks?.items ?? [];
  }

  private async fetchArtistGenres(
    artistIds: string[],
    token: string,
  ): Promise<Map<string, string[]>> {
    if (artistIds.length === 0) {
      return new Map();
    }

    const response = await fetch(
      `https://api.spotify.com/v1/artists?ids=${encodeURIComponent(
        artistIds.slice(0, 50).join(','),
      )}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      return new Map();
    }

    const payload = (await response.json()) as SpotifyArtistsResponse;
    return new Map(
      payload.artists.map((artist) => [
        artist.id,
        artist.genres.map(normalizeTag).filter(Boolean),
      ]),
    );
  }

  async fetchCandidates(plan: QueryPlan): Promise<MusicCandidate[]> {
    const queries = buildSearchQueries(plan);

    if (queries.length === 0) {
      return [];
    }

    const cacheKey = queries.join('|');
    const cached = queryCache.get(cacheKey);

    if (cached) {
      return cached;
    }

    const token = await this.getAccessToken();
    const searchResults = await Promise.all(
      queries.map((query) => this.searchTracks(query, plan, token)),
    );
    const flattenedTracks = searchResults.flat();
    const trackItems = uniqueStrings(flattenedTracks.map((item) => item.id)).map(
      (id) => flattenedTracks.find((item) => item.id === id)!,
    );
    const artistIds = uniqueStrings(
      trackItems.flatMap((item) => item.artists.map((artist) => artist.id)),
    );
    const artistGenres = await this.fetchArtistGenres(artistIds, token);
    const candidates = trackItems.map((item) => {
      const externalGenres = uniqueStrings(
        item.artists.flatMap((artist) => artistGenres.get(artist.id) ?? []),
      );
      const genreTags = uniqueStrings([
        ...(plan.genre ? [plan.genre] : []),
        ...externalGenres,
      ]);

      return {
        id: `spotify-${item.id}`,
        title: item.name,
        artist: item.artists.map((artist) => artist.name).join(', '),
        album: item.album.name,
        genreTags,
        moodTags: uniqueStrings([
          ...plan.secondaryTerms.slice(0, 4),
          ...genreTags.slice(0, 2),
        ]),
        language: undefined,
        region: plan.region,
        instrumentationTags: [],
        lyricalThemeTags: [],
        sceneTags: plan.secondaryTerms.filter((term) =>
          ['study', 'driving', 'late-night', 'rainy-day', 'gym', 'sunset', 'heartbreak', 'healing'].includes(term),
        ),
        artworkColorHint: undefined,
        popularity: item.popularity,
        energyLevel: undefined,
        focusLevel: undefined,
        tempoTag: undefined,
        valenceTag: undefined,
        year: undefined,
        searchKeywords: [
          item.name,
          item.album.name,
          ...item.artists.map((artist) => artist.name),
          ...genreTags,
        ],
        artworkUrl: item.album.images[0]?.url,
        source: 'spotify',
      };
    });

    queryCache.set(cacheKey, candidates);
    return candidates;
  }
}
