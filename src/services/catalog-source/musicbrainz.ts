import { fetchJson, parseYear } from './helpers';
import { isSnapshotCatalogSource } from './types';

import type { MusicBrainzTrackSnapshot } from '../../../data/catalog/source/types';
import type {
  CatalogTrackResolver,
  CatalogTrackSeed,
  MusicBrainzCatalogSourceOptions,
} from './types';

interface MusicBrainzRecordingResponse {
  recordings?: Array<{
    'artist-credit'?: Array<{
      artist?: {
        id?: string;
        name?: string;
      };
      name?: string;
    }>;
    id: string;
    releases?: Array<{
      date?: string;
      id?: string;
      title?: string;
    }>;
    title?: string;
  }>;
}

const DEFAULT_USER_AGENT =
  'TaoMusic/0.7.0 (catalog build; https://github.com/taozhu2026/TaoMusic)';

export class MusicBrainzCatalogSource
  implements CatalogTrackResolver<MusicBrainzTrackSnapshot>
{
  constructor(private readonly options: MusicBrainzCatalogSourceOptions) {}

  async resolveTrack(seed: CatalogTrackSeed): Promise<MusicBrainzTrackSnapshot | null> {
    if (isSnapshotCatalogSource(this.options)) {
      return this.options.snapshotIndex[seed.seedId] ?? null;
    }

    return this.resolveLiveTrack(seed);
  }

  private async resolveLiveTrack(
    seed: CatalogTrackSeed,
  ): Promise<MusicBrainzTrackSnapshot | null> {
    const userAgent =
      this.options.mode === 'live' ? this.options.userAgent : undefined;
    const timeoutMs =
      this.options.mode === 'live' ? this.options.timeoutMs : undefined;
    const query = `recording:"${seed.title}" AND artist:"${seed.artist}"`;
    const payload = await fetchJson<MusicBrainzRecordingResponse>(
      `https://musicbrainz.org/ws/2/recording?fmt=json&limit=1&query=${encodeURIComponent(
        query,
      )}`,
      {
        headers: {
          'User-Agent': userAgent ?? DEFAULT_USER_AGENT,
        },
      },
      timeoutMs,
    );

    const recording = payload.recordings?.[0];

    if (!recording?.id) {
      return null;
    }

    const release = recording.releases?.[0];
    const primaryArtist = recording['artist-credit']?.[0];

    return {
      album: release?.title,
      artist: primaryArtist?.name ?? primaryArtist?.artist?.name ?? seed.artist,
      artistId:
        primaryArtist?.artist?.id ?? `mb-artist-${seed.seedId}`,
      language: seed.language,
      recordingId: recording.id,
      region: seed.region,
      releaseId: release?.id,
      title: recording.title ?? seed.title,
      year: parseYear(release?.date),
    };
  }
}
