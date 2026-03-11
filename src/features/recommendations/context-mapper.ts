import {
  ACTIVITY_MAPPINGS,
  COLOR_MAPPINGS,
  COLOR_OPTIONS,
  COUNTRY_OPTIONS,
  GENRE_ADJACENCY,
  GENRE_OPTIONS,
  MOOD_MAPPINGS,
  SCENE_MAPPINGS,
  THEME_MAPPINGS,
  getOptionLabel,
} from '@/src/config/mappings';
import { pickBySeed } from '@/src/lib/random';
import { uniqueStrings } from '@/src/lib/text';

import type {
  ContextProfile,
  RecommendationInput,
} from '@/src/features/recommendations/types';

const DEFAULT_TONE = 'quiet';

const deriveTone = (values: Array<string | undefined>): string => {
  return values.find(Boolean) ?? DEFAULT_TONE;
};

export const mapContextToProfile = (
  input: RecommendationInput,
): ContextProfile => {
  const normalizedInput = { ...input };
  const language = normalizedInput.uiLanguage ?? 'en';
  let surpriseLabel: string | undefined;
  const seed = normalizedInput.rerollSeed ?? 'taomusic-default-seed';

  if (normalizedInput.surprise) {
    if (!normalizedInput.country) {
      const surpriseCountry = pickBySeed(COUNTRY_OPTIONS, seed, 'country');
      normalizedInput.country = surpriseCountry.value;
      const label = getOptionLabel(COUNTRY_OPTIONS, surpriseCountry.value, language);
      surpriseLabel =
        language === 'zh'
          ? `偏向 ${label} 的一条侧线`
          : `A detour through ${label}`;
    } else if (!normalizedInput.genre) {
      const surpriseGenre = pickBySeed(GENRE_OPTIONS, seed, 'genre');
      normalizedInput.genre = surpriseGenre.value;
      const label = getOptionLabel(GENRE_OPTIONS, surpriseGenre.value, language);
      surpriseLabel =
        language === 'zh'
          ? `向 ${label} 侧移一步`
          : `A sideways step into ${label.toLowerCase()}`;
    } else if (!normalizedInput.color) {
      const surpriseColor = pickBySeed(COLOR_OPTIONS, seed, 'color');
      normalizedInput.color = surpriseColor.value;
      const label = getOptionLabel(COLOR_OPTIONS, surpriseColor.value, language);
      surpriseLabel =
        language === 'zh'
          ? `补上一抹 ${label}`
          : `A flash of ${label.toLowerCase()}`;
    }
  }

  const activityMapping = normalizedInput.activity
    ? ACTIVITY_MAPPINGS[normalizedInput.activity]
    : undefined;
  const moodMapping = normalizedInput.mood
    ? MOOD_MAPPINGS[normalizedInput.mood]
    : undefined;
  const colorMapping = normalizedInput.color
    ? COLOR_MAPPINGS[normalizedInput.color]
    : undefined;
  const themeMapping = normalizedInput.lyricalTheme
    ? THEME_MAPPINGS[normalizedInput.lyricalTheme]
    : undefined;
  const sceneMapping = normalizedInput.scene
    ? SCENE_MAPPINGS[normalizedInput.scene]
    : undefined;

  const explicitGenres = normalizedInput.genre ? [normalizedInput.genre] : [];
  const adjacentGenres = normalizedInput.genre
    ? GENRE_ADJACENCY[normalizedInput.genre] ?? []
    : [];
  const activityGenres = activityMapping?.genreHints ?? [];

  const genrePreference = uniqueStrings([
    ...explicitGenres,
    ...activityGenres,
    ...adjacentGenres,
  ]);

  const activityTags = activityMapping?.tags ?? [];
  const moodTags = moodMapping?.tags ?? [];
  const colorTags = colorMapping?.tags ?? [];
  const sceneTags = sceneMapping?.tags ?? [];
  const lyricalThemeTags = uniqueStrings([
    ...(themeMapping?.tags ?? []),
    ...(normalizedInput.lyricalTheme ? [normalizedInput.lyricalTheme] : []),
  ]);

  const derivedTags = uniqueStrings([
    ...activityTags,
    ...moodTags,
    ...colorTags,
    ...sceneTags,
    ...lyricalThemeTags,
    ...genrePreference,
    ...(normalizedInput.country ? [normalizedInput.country] : []),
    ...(normalizedInput.scene ? [normalizedInput.scene] : []),
  ]);

  return {
    raw: normalizedInput,
    activityTags,
    moodTags,
    colorTags,
    sceneTags,
    genrePreference,
    lyricalThemeTags,
    derivedTags,
    regionPreference: normalizedInput.country,
    energyLevel:
      moodMapping?.energyLevel ?? activityMapping?.energyLevel ?? 'medium',
    focusLevel:
      moodMapping?.focusLevel ?? activityMapping?.focusLevel ?? 'balanced',
    tone: deriveTone([
      moodMapping?.tone,
      colorMapping?.tone,
      sceneMapping?.tone,
      activityMapping?.tone,
      DEFAULT_TONE,
    ]),
    surpriseLabel,
  };
};
