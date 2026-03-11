import { uniqueStrings } from '../../src/lib/text';

import type {
  EnergyLevel,
  FocusLevel,
  MusicCandidate,
  TempoTag,
  ValenceTag,
} from '../../src/features/recommendations/types';

export interface LocalCatalogRecord {
  album?: string;
  artist: string;
  artworkColorHint?: string;
  energyLevel?: EnergyLevel;
  focusLevel?: FocusLevel;
  genreTags: string[];
  id: string;
  instrumentationTags: string[];
  language: string;
  lyricalThemeTags: string[];
  moodTags: string[];
  region: string;
  sceneTags: string[];
  searchKeywords?: string[];
  source?: string;
  tempoTag?: TempoTag;
  title: string;
  valenceTag?: ValenceTag;
  year?: number;
}

export interface CatalogProfile {
  artworkColorHint?: string;
  energyLevel?: EnergyLevel;
  focusLevel?: FocusLevel;
  genreTags: string[];
  instrumentationTags: string[];
  lyricalThemeTags: string[];
  moodTags: string[];
  sceneTags: string[];
  searchKeywords?: string[];
  tempoTag?: TempoTag;
  valenceTag?: ValenceTag;
}

interface CatalogTemplate {
  albums: string[];
  artists: string[];
  language: string;
  prefix: string;
  profiles: CatalogProfile[];
  region: string;
  source?: string;
  titles: string[];
  yearStart: number;
}

export const combineTitles = (prefixes: string[], suffixes: string[]): string[] => {
  return prefixes.flatMap((prefix) => suffixes.map((suffix) => `${prefix}${suffix}`));
};

export const buildCatalogRecords = ({
  albums,
  artists,
  language,
  prefix,
  profiles,
  region,
  source = 'catalog',
  titles,
  yearStart,
}: CatalogTemplate): LocalCatalogRecord[] => {
  return titles.map((title, index) => {
    const profile = profiles[index % profiles.length];

    return {
      id: `${prefix}-${String(index + 1).padStart(3, '0')}`,
      title,
      artist: artists[index % artists.length],
      album: albums[index % albums.length],
      language,
      region,
      genreTags: profile.genreTags,
      moodTags: profile.moodTags,
      sceneTags: profile.sceneTags,
      lyricalThemeTags: profile.lyricalThemeTags,
      instrumentationTags: profile.instrumentationTags,
      artworkColorHint: profile.artworkColorHint,
      energyLevel: profile.energyLevel,
      focusLevel: profile.focusLevel,
      tempoTag: profile.tempoTag,
      valenceTag: profile.valenceTag,
      year: yearStart + (index % 8),
      searchKeywords: profile.searchKeywords,
      source,
    };
  });
};

export const normalizeCatalog = (
  records: LocalCatalogRecord[],
): MusicCandidate[] => {
  return records.map((record) => ({
    id: record.id,
    title: record.title,
    artist: record.artist,
    album: record.album,
    language: record.language,
    region: record.region,
    genreTags: uniqueStrings(record.genreTags),
    moodTags: uniqueStrings(record.moodTags),
    sceneTags: uniqueStrings(record.sceneTags),
    lyricalThemeTags: uniqueStrings(record.lyricalThemeTags),
    instrumentationTags: uniqueStrings(record.instrumentationTags),
    artworkColorHint: record.artworkColorHint,
    popularity: undefined,
    energyLevel: record.energyLevel,
    focusLevel: record.focusLevel,
    tempoTag: record.tempoTag,
    valenceTag: record.valenceTag,
    year: record.year,
    searchKeywords: uniqueStrings(
      [
        record.title,
        record.artist,
        record.album,
        record.language,
        record.region,
        ...record.genreTags,
        ...record.moodTags,
        ...record.sceneTags,
        ...record.lyricalThemeTags,
        ...record.instrumentationTags,
        ...(record.searchKeywords ?? []),
      ].filter((value): value is string => Boolean(value)),
    ).map((value) => value.toLowerCase()),
    artworkUrl: undefined,
    source: record.source ?? 'catalog',
  }));
};
