import type {
  CatalogSourceRefs,
  EnergyLevel,
  FocusLevel,
  TempoTag,
  ValenceTag,
} from '../../../src/features/recommendations/types';

export interface SeedAudioProfile {
  energyLevel: EnergyLevel;
  focusLevel: FocusLevel;
  tempoTag: TempoTag;
  valenceTag: ValenceTag;
}

export interface CatalogSeedGroup {
  albums: string[];
  artists: string[];
  artworkColors: string[];
  audioProfile: SeedAudioProfile;
  descriptorHints: string[];
  instrumentationHints: string[];
  language: string;
  lyricalThemeHints: string[];
  rawTags: string[];
  region: string;
  searchKeywords: string[];
  slug: string;
  titles: string[];
  yearStart: number;
}

export interface CatalogSeedTrack {
  album: string;
  artist: string;
  artworkColorHint?: string;
  audioProfile: SeedAudioProfile;
  descriptorHints: string[];
  groupSlug: string;
  instrumentationHints: string[];
  language: string;
  lyricalThemeHints: string[];
  rawTags: string[];
  region: string;
  searchKeywords: string[];
  seedId: string;
  title: string;
  year: number;
}

export interface MusicBrainzTrackSnapshot {
  album?: string;
  artist: string;
  artistId: string;
  language: string;
  recordingId: string;
  region: string;
  releaseId?: string;
  title: string;
  year?: number;
}

export interface LastFmTrackSnapshot {
  listeners?: number;
  playcount?: number;
  tags: string[];
  trackKey: string;
}

export interface SpotifyTrackSnapshot {
  energyLevel?: EnergyLevel;
  spotifyId: string;
  tempoTag?: TempoTag;
  valenceTag?: ValenceTag;
}

export interface UnifiedCatalogTrack {
  album?: string;
  artist: string;
  artworkColorHint?: string;
  descriptors: string[];
  energyLevel?: EnergyLevel;
  focusLevel?: FocusLevel;
  genres: string[];
  id: string;
  instrumentation: string[];
  language: string;
  lyricalThemes: string[];
  moods: string[];
  region: string;
  scenes: string[];
  searchKeywords: string[];
  source: string;
  sourceRefs: CatalogSourceRefs;
  tempoTag?: TempoTag;
  title: string;
  valenceTag?: ValenceTag;
  year?: number;
}

export interface CatalogBuildMetadata {
  byLanguage: Record<string, number>;
  byRegion: Record<string, number>;
  builtFromSeeds: number;
  mode: 'snapshot' | 'live';
  sources: {
    lastfm: number;
    musicbrainz: number;
    spotify: number;
  };
  total: number;
}
