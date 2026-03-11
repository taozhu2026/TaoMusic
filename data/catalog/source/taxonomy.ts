import { uniqueStrings } from '../../../src/lib/text';

interface TaxonomyMapping {
  descriptors: string[];
  genres: string[];
  lyricalThemes: string[];
  moods: string[];
  scenes: string[];
}

const createEmptyMapping = (): TaxonomyMapping => ({
  descriptors: [],
  genres: [],
  lyricalThemes: [],
  moods: [],
  scenes: [],
});

const RAW_TAG_RULES: Array<{
  contains: string[];
  mapTo: Partial<TaxonomyMapping>;
}> = [
  { contains: ['mandopop', 'c-pop', 'mandarin ballad'], mapTo: { genres: ['pop'] } },
  { contains: ['urban pop', 'soft rock', 'alt pop'], mapTo: { genres: ['pop', 'indie'] } },
  { contains: ['chinese indie', 'j-indie', 'k-indie', 'indie'], mapTo: { genres: ['indie'] } },
  { contains: ['dream pop', 'shoegaze', 'soft focus'], mapTo: { genres: ['shoegaze'], moods: ['dreamy'] } },
  { contains: ['post-rock', 'cinematic'], mapTo: { genres: ['post-rock', 'orchestral'], moods: ['cinematic'] } },
  { contains: ['ambient', 'downtempo'], mapTo: { genres: ['ambient', 'electronic'], moods: ['weightless'] } },
  { contains: ['electronic', 'synth pop'], mapTo: { genres: ['electronic', 'synthwave'] } },
  { contains: ['city pop', 'retro glow'], mapTo: { genres: ['city-pop'], descriptors: ['retro-glow'] } },
  { contains: ['k-rnb', 'urban soul'], mapTo: { genres: ['r-and-b', 'soul'] } },
  { contains: ['euphoric', 'danceable'], mapTo: { moods: ['euphoric', 'energetic'] } },
  { contains: ['nostalgic', 'memory-film'], mapTo: { moods: ['nostalgic'], lyricalThemes: ['memory'] } },
  { contains: ['rainy night', 'rainy city', 'rain'], mapTo: { scenes: ['rainy-day'], descriptors: ['rainlit'], moods: ['reflective'] } },
  { contains: ['healing', 'returning-light'], mapTo: { scenes: ['healing'], moods: ['hopeful', 'tender'], lyricalThemes: ['healing'] } },
  { contains: ['night drive', 'urban drive', 'road trip'], mapTo: { scenes: ['driving'], descriptors: ['night-drive'], lyricalThemes: ['adventure'] } },
  { contains: ['late night', 'seoul night', 'tokyo night', 'after-hours'], mapTo: { scenes: ['late-night'], moods: ['nocturnal'] } },
  { contains: ['study', 'focus', 'instrumental'], mapTo: { scenes: ['study'], moods: ['focused'] } },
  { contains: ['heartbreak', 'emotional'], mapTo: { scenes: ['heartbreak'], moods: ['bittersweet'], lyricalThemes: ['heartbreak'] } },
  { contains: ['love'], mapTo: { lyricalThemes: ['love'], moods: ['tender'] } },
  { contains: ['longing'], mapTo: { lyricalThemes: ['longing'], moods: ['melancholic'] } },
  { contains: ['escape'], mapTo: { lyricalThemes: ['escape'], moods: ['dreamy'] } },
  { contains: ['adventure'], mapTo: { lyricalThemes: ['adventure'], moods: ['hopeful'] } },
  { contains: ['warm', 'warmth'], mapTo: { moods: ['warm'], descriptors: ['warm-glow'] } },
  { contains: ['humid', 'wet-pavement', 'city-rain'], mapTo: { descriptors: ['humid-night'] } },
  { contains: ['mist', 'misty', 'haze'], mapTo: { descriptors: ['misty'] } },
  { contains: ['neon', 'urban-glow', 'neon-soft'], mapTo: { descriptors: ['neon'] } },
  { contains: ['oceanic', 'sea-air'], mapTo: { descriptors: ['oceanic'] } },
  { contains: ['wide-screen', 'road-dust', 'after-sun'], mapTo: { descriptors: ['wide-screen'] } },
];

export const mapRawTagsToTaxonomy = (rawTags: string[]): TaxonomyMapping => {
  const normalized = rawTags.map((tag) => tag.toLowerCase());
  const output = createEmptyMapping();

  for (const rule of RAW_TAG_RULES) {
    if (!normalized.some((tag) => rule.contains.some((needle) => tag.includes(needle)))) {
      continue;
    }

    output.genres.push(...(rule.mapTo.genres ?? []));
    output.moods.push(...(rule.mapTo.moods ?? []));
    output.scenes.push(...(rule.mapTo.scenes ?? []));
    output.descriptors.push(...(rule.mapTo.descriptors ?? []));
    output.lyricalThemes.push(...(rule.mapTo.lyricalThemes ?? []));
  }

  return {
    descriptors: uniqueStrings(output.descriptors),
    genres: uniqueStrings(output.genres),
    lyricalThemes: uniqueStrings(output.lyricalThemes),
    moods: uniqueStrings(output.moods),
    scenes: uniqueStrings(output.scenes),
  };
};
