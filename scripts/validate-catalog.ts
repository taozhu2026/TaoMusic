import { LOCAL_CATALOG } from '../data/catalog';

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
    track.lyricalThemeTags,
    track.instrumentationTags,
  ];

  if (requiredArrays.some((value) => !Array.isArray(value) || value.length === 0)) {
    throw new Error(`Track ${track.id} is missing required structured tags.`);
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

console.log(
  JSON.stringify(
    {
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
