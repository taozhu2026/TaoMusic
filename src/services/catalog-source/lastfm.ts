import { env, hasLastFmConfig } from '../../lib/env';
import { buildCatalogLookupKey, fetchJson } from './helpers';
import { isSnapshotCatalogSource } from './types';

import type { LastFmTrackSnapshot } from '../../../data/catalog/source/types';
import type {
  CatalogTrackResolver,
  CatalogTrackSeed,
  LastFmCatalogSourceOptions,
} from './types';

interface LastFmTrackInfoResponse {
  track?: {
    listeners?: string;
    playcount?: string;
    toptags?: {
      tag?: Array<{
        name?: string;
      }>;
    };
  };
}

export class LastFmCatalogSource implements CatalogTrackResolver<LastFmTrackSnapshot> {
  constructor(private readonly options: LastFmCatalogSourceOptions) {}

  async resolveTrack(seed: CatalogTrackSeed): Promise<LastFmTrackSnapshot | null> {
    if (isSnapshotCatalogSource(this.options)) {
      return this.options.snapshotIndex[seed.seedId] ?? null;
    }

    return this.resolveLiveTrack(seed);
  }

  private async resolveLiveTrack(
    seed: CatalogTrackSeed,
  ): Promise<LastFmTrackSnapshot | null> {
    const timeoutMs =
      this.options.mode === 'live' ? this.options.timeoutMs : undefined;

    if (!hasLastFmConfig() || !env.lastFmApiKey) {
      return null;
    }

    const url = new URL('https://ws.audioscrobbler.com/2.0/');
    url.searchParams.set('method', 'track.getInfo');
    url.searchParams.set('api_key', env.lastFmApiKey);
    url.searchParams.set('artist', seed.artist);
    url.searchParams.set('track', seed.title);
    url.searchParams.set('format', 'json');

    const payload = await fetchJson<LastFmTrackInfoResponse>(
      url.toString(),
      undefined,
      timeoutMs,
    );

    const tags = payload.track?.toptags?.tag
      ?.map((tag) => tag.name?.trim())
      .filter((value): value is string => Boolean(value))
      .map((value) => value.toLowerCase());

    return {
      listeners: payload.track?.listeners
        ? Number.parseInt(payload.track.listeners, 10)
        : undefined,
      playcount: payload.track?.playcount
        ? Number.parseInt(payload.track.playcount, 10)
        : undefined,
      tags: tags ?? [],
      trackKey: buildCatalogLookupKey(seed.artist, seed.title),
    };
  }
}
