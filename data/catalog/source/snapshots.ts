import { CATALOG_SEED_TRACKS } from './seed-groups';

import type {
  LastFmTrackSnapshot,
  MusicBrainzTrackSnapshot,
  SpotifyTrackSnapshot,
} from './types';

export const MUSICBRAINZ_TRACK_INDEX: Record<string, MusicBrainzTrackSnapshot> = Object.fromEntries(
  CATALOG_SEED_TRACKS.map((seed) => [
    seed.seedId,
    {
      album: seed.album,
      artist: seed.artist,
      artistId: `mb-artist-${seed.groupSlug}-${seed.artist}`,
      language: seed.language,
      recordingId: `mb-recording-${seed.seedId}`,
      region: seed.region,
      releaseId: `mb-release-${seed.groupSlug}-${seed.album}`,
      title: seed.title,
      year: seed.year,
    },
  ]),
);

export const LASTFM_TRACK_INDEX: Record<string, LastFmTrackSnapshot> = Object.fromEntries(
  CATALOG_SEED_TRACKS.map((seed, index) => [
    seed.seedId,
    {
      listeners: 5000 + index * 17,
      playcount: 20000 + index * 43,
      tags: [
        ...seed.rawTags,
        ...seed.descriptorHints,
        ...seed.lyricalThemeHints,
      ],
      trackKey: `lastfm-${seed.seedId}`,
    },
  ]),
);

export const SPOTIFY_TRACK_INDEX: Record<string, SpotifyTrackSnapshot> = Object.fromEntries(
  CATALOG_SEED_TRACKS.map((seed) => [
    seed.seedId,
    {
      energyLevel: seed.audioProfile.energyLevel,
      spotifyId: `spotify-${seed.seedId}`,
      tempoTag: seed.audioProfile.tempoTag,
      valenceTag: seed.audioProfile.valenceTag,
    },
  ]),
);
