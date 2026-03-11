import type {
  LastFmTrackSnapshot,
  MusicBrainzTrackSnapshot,
  SpotifyTrackSnapshot,
} from '../../../data/catalog/source/types';

export type CatalogSourceMode = 'snapshot' | 'live';

export interface CatalogTrackSeed {
  artist: string;
  language: string;
  region: string;
  seedId: string;
  title: string;
}

export interface SnapshotCatalogSourceOptions<TSnapshot> {
  mode: 'snapshot';
  snapshotIndex: Record<string, TSnapshot>;
}

export interface LiveCatalogSourceOptions {
  mode: 'live';
  timeoutMs?: number;
  userAgent?: string;
}

export type CatalogSourceOptions<TSnapshot> =
  | SnapshotCatalogSourceOptions<TSnapshot>
  | LiveCatalogSourceOptions;

export interface CatalogTrackResolver<TSnapshot> {
  resolveTrack(seed: CatalogTrackSeed): Promise<TSnapshot | null>;
}

export type MusicBrainzCatalogSourceOptions =
  CatalogSourceOptions<MusicBrainzTrackSnapshot>;
export type LastFmCatalogSourceOptions = CatalogSourceOptions<LastFmTrackSnapshot>;
export type SpotifyCatalogSourceOptions = CatalogSourceOptions<SpotifyTrackSnapshot>;

export const isSnapshotCatalogSource = <TSnapshot>(
  options: CatalogSourceOptions<TSnapshot>,
): options is SnapshotCatalogSourceOptions<TSnapshot> => options.mode === 'snapshot';
