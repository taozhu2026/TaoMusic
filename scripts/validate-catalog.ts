import { CATALOG_BUILD_METADATA, LOCAL_CATALOG, UNIFIED_CATALOG_TRACKS } from '../data/catalog';

const ids = new Set<string>();

for (const track of LOCAL_CATALOG) {
  if (ids.has(track.id)) {
    throw new Error(`Duplicate catalog id detected: ${track.id}`);
  }

  ids.add(track.id);

  const requiredArrays = [
    track.genreTags,
    track.moodTags,
    track.sceneTags,
    track.descriptorTags ?? [],
    track.lyricalThemeTags,
    track.instrumentationTags,
  ];

  if (requiredArrays.some((value) => !Array.isArray(value) || value.length === 0)) {
    throw new Error(`Track ${track.id} is missing required structured tags.`);
  }

  if (!track.sourceRefs?.musicbrainz || !track.sourceRefs?.lastfm) {
    throw new Error(`Track ${track.id} is missing required source references.`);
  }
}

const countByLanguage = LOCAL_CATALOG.reduce((acc, track) => {
  const key = track.language ?? 'unknown';
  acc.set(key, (acc.get(key) ?? 0) + 1);
  return acc;
}, new Map<string, number>());

const eastAsianCount = LOCAL_CATALOG.filter((track) =>
  ['china', 'japan', 'korea'].includes(track.region ?? ''),
).length;

if (LOCAL_CATALOG.length < 400) {
  throw new Error(`Catalog too small: ${LOCAL_CATALOG.length}`);
}

if ((countByLanguage.get('zh') ?? 0) < 180) {
  throw new Error(`Chinese-language coverage too small: ${countByLanguage.get('zh') ?? 0}`);
}

if ((countByLanguage.get('ja') ?? 0) < 70) {
  throw new Error(`Japanese-language coverage too small: ${countByLanguage.get('ja') ?? 0}`);
}

if ((countByLanguage.get('ko') ?? 0) < 60) {
  throw new Error(`Korean-language coverage too small: ${countByLanguage.get('ko') ?? 0}`);
}

if (eastAsianCount < 310) {
  throw new Error(`East Asian coverage too small: ${eastAsianCount}`);
}

if (UNIFIED_CATALOG_TRACKS.length !== LOCAL_CATALOG.length) {
  throw new Error(
    `Unified/runtime catalog length mismatch: ${UNIFIED_CATALOG_TRACKS.length} vs ${LOCAL_CATALOG.length}`,
  );
}

if (CATALOG_BUILD_METADATA.total !== LOCAL_CATALOG.length) {
  throw new Error(
    `Catalog metadata total mismatch: ${CATALOG_BUILD_METADATA.total} vs ${LOCAL_CATALOG.length}`,
  );
}

if (CATALOG_BUILD_METADATA.mode !== 'snapshot') {
  throw new Error(`Unexpected catalog source mode: ${CATALOG_BUILD_METADATA.mode}`);
}

console.log(
  JSON.stringify(
    {
      mode: CATALOG_BUILD_METADATA.mode,
      builtFromSeeds: CATALOG_BUILD_METADATA.builtFromSeeds,
      total: LOCAL_CATALOG.length,
      zh: countByLanguage.get('zh') ?? 0,
      ja: countByLanguage.get('ja') ?? 0,
      ko: countByLanguage.get('ko') ?? 0,
      eastAsian: eastAsianCount,
    },
    null,
    2,
  ),
);
