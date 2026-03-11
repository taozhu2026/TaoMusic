import { uniqueStrings } from '../../../src/lib/text';
import { MusicBrainzCatalogSource } from '../../../src/services/catalog-source/musicbrainz';
import { LastFmCatalogSource } from '../../../src/services/catalog-source/lastfm';
import { SpotifyCatalogSource } from '../../../src/services/catalog-source/spotify';
import { CATALOG_SEED_TRACKS } from './seed-groups';
import { LASTFM_TRACK_INDEX, MUSICBRAINZ_TRACK_INDEX, SPOTIFY_TRACK_INDEX } from './snapshots';
import { mapRawTagsToTaxonomy } from './taxonomy';

import type { MusicCandidate } from '../../../src/features/recommendations/types';
import type { CatalogSourceMode } from '../../../src/services/catalog-source/types';
import type { CatalogBuildMetadata, CatalogSeedTrack, UnifiedCatalogTrack } from './types';
interface CatalogBuildOptions {
  sourceMode?: CatalogSourceMode;
}

interface CatalogSources {
  lastFmSource: LastFmCatalogSource;
  musicBrainzSource: MusicBrainzCatalogSource;
  spotifySource: SpotifyCatalogSource;
}

const resolveSafely = async <T>(resolver: Promise<T | null>): Promise<T | null> => {
  try {
    return await resolver;
  } catch {
    return null;
  }
};

const createSources = (sourceMode: CatalogSourceMode): CatalogSources => {
  if (sourceMode === 'live') {
    return {
      musicBrainzSource: new MusicBrainzCatalogSource({ mode: 'live' }),
      lastFmSource: new LastFmCatalogSource({ mode: 'live' }),
      spotifySource: new SpotifyCatalogSource({ mode: 'live' }),
    };
  }

  return {
    musicBrainzSource: new MusicBrainzCatalogSource({
      mode: 'snapshot',
      snapshotIndex: MUSICBRAINZ_TRACK_INDEX,
    }),
    lastFmSource: new LastFmCatalogSource({
      mode: 'snapshot',
      snapshotIndex: LASTFM_TRACK_INDEX,
    }),
    spotifySource: new SpotifyCatalogSource({
      mode: 'snapshot',
      snapshotIndex: SPOTIFY_TRACK_INDEX,
    }),
  };
};

const buildUnifiedTrack = async (
  seed: CatalogSeedTrack,
  sources: CatalogSources,
): Promise<UnifiedCatalogTrack | null> => {
  const [musicBrainz, lastFm, spotify] = await Promise.all([
    resolveSafely(sources.musicBrainzSource.resolveTrack(seed)),
    resolveSafely(sources.lastFmSource.resolveTrack(seed)),
    resolveSafely(sources.spotifySource.resolveTrack(seed)),
  ]);

  if (!musicBrainz) {
    return null;
  }

  const taxonomy = mapRawTagsToTaxonomy([...seed.rawTags, ...(lastFm?.tags ?? [])]);
  const sourceParts = uniqueStrings([
    'musicbrainz',
    lastFm ? 'lastfm' : 'seed-tags',
    spotify ? 'spotify' : '',
  ]);

  return {
    album: musicBrainz.album,
    artist: musicBrainz.artist,
    artworkColorHint: seed.artworkColorHint,
    descriptors: uniqueStrings([...seed.descriptorHints, ...taxonomy.descriptors]),
    energyLevel: spotify?.energyLevel ?? seed.audioProfile.energyLevel,
    focusLevel: seed.audioProfile.focusLevel,
    genres: uniqueStrings(taxonomy.genres.length > 0 ? taxonomy.genres : ['indie']),
    id: `tm-${seed.seedId}`,
    instrumentation: uniqueStrings(seed.instrumentationHints),
    language: musicBrainz.language,
    lyricalThemes: uniqueStrings([
      ...seed.lyricalThemeHints,
      ...taxonomy.lyricalThemes,
    ]),
    moods: uniqueStrings(taxonomy.moods.length > 0 ? taxonomy.moods : ['reflective']),
    region: musicBrainz.region,
    scenes: uniqueStrings(taxonomy.scenes.length > 0 ? taxonomy.scenes : ['late-night']),
    searchKeywords: uniqueStrings([
      seed.title,
      seed.artist,
      seed.album,
      seed.language,
      seed.region,
      ...seed.searchKeywords,
      ...seed.rawTags,
      ...seed.descriptorHints,
      ...seed.lyricalThemeHints,
      ...taxonomy.descriptors,
      ...taxonomy.genres,
      ...taxonomy.moods,
      ...taxonomy.scenes,
    ]).map((value) => value.toLowerCase()),
    source: sourceParts.join('+'),
    sourceRefs: {
      lastfm: lastFm?.trackKey,
      musicbrainz: musicBrainz.recordingId,
      spotify: spotify?.spotifyId,
    },
    tempoTag: spotify?.tempoTag ?? seed.audioProfile.tempoTag,
    title: musicBrainz.title,
    valenceTag: spotify?.valenceTag ?? seed.audioProfile.valenceTag,
    year: musicBrainz.year ?? seed.year,
  };
};

const mapUnifiedTrackToCandidate = (track: UnifiedCatalogTrack): MusicCandidate => {
  return {
    id: track.id,
    title: track.title,
    artist: track.artist,
    album: track.album,
    language: track.language,
    region: track.region,
    genreTags: track.genres,
    moodTags: track.moods,
    sceneTags: track.scenes,
    descriptorTags: track.descriptors,
    lyricalThemeTags: track.lyricalThemes,
    instrumentationTags: track.instrumentation,
    artworkColorHint: track.artworkColorHint,
    popularity: undefined,
    energyLevel: track.energyLevel,
    focusLevel: track.focusLevel,
    tempoTag: track.tempoTag,
    valenceTag: track.valenceTag,
    year: track.year,
    searchKeywords: track.searchKeywords,
    artworkUrl: undefined,
    source: track.source,
    sourceRefs: track.sourceRefs,
  };
};

export const mapUnifiedCatalogToRuntimeCatalog = (
  tracks: UnifiedCatalogTrack[],
): MusicCandidate[] => tracks.map(mapUnifiedTrackToCandidate);

const buildMetadata = (
  tracks: UnifiedCatalogTrack[],
  sourceMode: CatalogSourceMode,
): CatalogBuildMetadata => {
  const byLanguage: Record<string, number> = {};
  const byRegion: Record<string, number> = {};

  for (const track of tracks) {
    byLanguage[track.language] = (byLanguage[track.language] ?? 0) + 1;
    byRegion[track.region] = (byRegion[track.region] ?? 0) + 1;
  }

  return {
    byLanguage,
    byRegion,
    builtFromSeeds: CATALOG_SEED_TRACKS.length,
    mode: sourceMode,
    sources: {
      lastfm: tracks.filter((track) => Boolean(track.sourceRefs.lastfm)).length,
      musicbrainz: tracks.filter((track) => Boolean(track.sourceRefs.musicbrainz)).length,
      spotify: tracks.filter((track) => Boolean(track.sourceRefs.spotify)).length,
    },
    total: tracks.length,
  };
};

export const buildUnifiedCatalog = async (): Promise<{
  metadata: CatalogBuildMetadata;
  tracks: UnifiedCatalogTrack[];
}> => {
  return buildUnifiedCatalogWithOptions();
};

export const buildUnifiedCatalogWithOptions = async (
  options: CatalogBuildOptions = {},
): Promise<{
  metadata: CatalogBuildMetadata;
  tracks: UnifiedCatalogTrack[];
}> => {
  const sourceMode = options.sourceMode ?? 'snapshot';
  const sources = createSources(sourceMode);
  const tracks = (
    await Promise.all(CATALOG_SEED_TRACKS.map((seed) => buildUnifiedTrack(seed, sources)))
  ).filter((track): track is UnifiedCatalogTrack => Boolean(track));

  return {
    metadata: buildMetadata(tracks, sourceMode),
    tracks,
  };
};

export const buildRuntimeCatalog = async (
  options: CatalogBuildOptions = {},
): Promise<{
  metadata: CatalogBuildMetadata;
  tracks: MusicCandidate[];
}> => {
  const { metadata, tracks } = await buildUnifiedCatalogWithOptions(options);

  return {
    metadata,
    tracks: mapUnifiedCatalogToRuntimeCatalog(tracks),
  };
};
