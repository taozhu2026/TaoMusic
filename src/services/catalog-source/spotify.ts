import { env, hasSpotifyConfig } from '../../lib/env';
import { fetchJson } from './helpers';
import { isSnapshotCatalogSource } from './types';

import type { SpotifyTrackSnapshot } from '../../../data/catalog/source/types';
import type {
  CatalogTrackResolver,
  CatalogTrackSeed,
  SpotifyCatalogSourceOptions,
} from './types';

interface SpotifySearchResponse {
  tracks?: {
    items?: Array<{
      id: string;
    }>;
  };
}

export class SpotifyCatalogSource implements CatalogTrackResolver<SpotifyTrackSnapshot> {
  private accessToken?: string;

  private accessTokenExpiresAt = 0;

  constructor(private readonly options: SpotifyCatalogSourceOptions) {}

  async resolveTrack(seed: CatalogTrackSeed): Promise<SpotifyTrackSnapshot | null> {
    if (isSnapshotCatalogSource(this.options)) {
      return this.options.snapshotIndex[seed.seedId] ?? null;
    }

    return this.resolveLiveTrack(seed);
  }

  private async getAccessToken(): Promise<string | null> {
    const timeoutMs =
      this.options.mode === 'live' ? this.options.timeoutMs : undefined;

    if (!hasSpotifyConfig() || !env.spotifyClientId || !env.spotifyClientSecret) {
      return null;
    }

    if (this.accessToken && Date.now() < this.accessTokenExpiresAt) {
      return this.accessToken;
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
      signal: AbortSignal.timeout(timeoutMs ?? 6000),
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as {
      access_token: string;
      expires_in: number;
    };

    this.accessToken = payload.access_token;
    this.accessTokenExpiresAt = Date.now() + (payload.expires_in - 60) * 1000;
    return this.accessToken;
  }

  private async resolveLiveTrack(
    seed: CatalogTrackSeed,
  ): Promise<SpotifyTrackSnapshot | null> {
    const timeoutMs =
      this.options.mode === 'live' ? this.options.timeoutMs : undefined;
    const accessToken = await this.getAccessToken();

    if (!accessToken) {
      return null;
    }

    const url = new URL('https://api.spotify.com/v1/search');
    url.searchParams.set('type', 'track');
    url.searchParams.set('limit', '1');
    url.searchParams.set('q', `track:"${seed.title}" artist:"${seed.artist}"`);

    const payload = await fetchJson<SpotifySearchResponse>(
      url.toString(),
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
      timeoutMs,
    );

    const track = payload.tracks?.items?.[0];

    if (!track?.id) {
      return null;
    }

    return {
      spotifyId: track.id,
    };
  }
}
