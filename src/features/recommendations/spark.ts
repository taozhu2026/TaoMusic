import { seededJitter } from '@/src/lib/random';

import type { BubbleFocus } from '@/src/features/recommendations/bubbles/types';
import type { RecommendationInput } from '@/src/features/recommendations/types';
import type { TuneModifier } from '@/src/features/recommendations/experience-types';

const SPARK_COMBINATIONS: RecommendationInput[] = [
  {
    activity: 'coding',
    mood: 'focused',
    color: 'white',
    country: 'germany',
    genre: 'lo-fi',
    scene: 'study',
    lyricalTheme: 'healing',
  },
  {
    activity: 'walking',
    mood: 'dreamy',
    color: 'blue',
    country: 'japan',
    genre: 'city-pop',
    scene: 'late-night',
    lyricalTheme: 'memory',
  },
  {
    activity: 'commuting',
    mood: 'nocturnal',
    color: 'black',
    country: 'united-states',
    genre: 'synthwave',
    scene: 'driving',
    lyricalTheme: 'adventure',
  },
  {
    activity: 'writing',
    mood: 'reflective',
    color: 'gold',
    country: 'france',
    genre: 'folk',
    scene: 'sunset',
    lyricalTheme: 'longing',
  },
  {
    activity: 'thinking',
    mood: 'weightless',
    color: 'white',
    country: 'nordic',
    genre: 'ambient',
    scene: 'healing',
    lyricalTheme: 'escape',
  },
  {
    activity: 'cooking',
    mood: 'warm',
    color: 'gold',
    country: 'brazil',
    genre: 'funk',
    scene: 'sunset',
    lyricalTheme: 'love',
  },
  {
    activity: 'reading',
    mood: 'nostalgic',
    color: 'blue',
    country: 'russia',
    genre: 'orchestral',
    scene: 'rainy-day',
    lyricalTheme: 'memory',
  },
  {
    activity: 'walking',
    mood: 'cinematic',
    color: 'red',
    country: 'middle-east',
    genre: 'soul',
    scene: 'driving',
    lyricalTheme: 'adventure',
  },
  {
    activity: 'late-night-work',
    mood: 'restless',
    color: 'red',
    country: 'korea',
    genre: 'techno',
    scene: 'late-night',
    lyricalTheme: 'escape',
  },
  {
    activity: 'thinking',
    mood: 'bittersweet',
    color: 'blue',
    country: 'china',
    genre: 'shoegaze',
    scene: 'rainy-day',
    lyricalTheme: 'heartbreak',
  },
  {
    activity: 'commuting',
    mood: 'energetic',
    color: 'red',
    country: 'latin',
    genre: 'house',
    scene: 'gym',
    lyricalTheme: 'adventure',
  },
  {
    activity: 'writing',
    mood: 'intimate',
    color: 'gold',
    country: 'india',
    genre: 'r-and-b',
    scene: 'healing',
    lyricalTheme: 'love',
  },
];

const countMatches = (candidate: RecommendationInput, current: RecommendationInput): number => {
  return (Object.keys(candidate) as Array<keyof RecommendationInput>).reduce((score, key) => {
    if (!candidate[key] || !current[key]) {
      return score;
    }

    return candidate[key] === current[key] ? score + 1 : score;
  }, 0);
};

export const hasUsableSignal = (input: RecommendationInput): boolean => {
  return Boolean(
    input.activity ||
      input.color ||
      input.country ||
      input.genre ||
      input.lyricalTheme ||
      input.mood ||
      input.scene,
  );
};

export const buildStructuredSparkInput = (
  seed: string,
  current: RecommendationInput,
): RecommendationInput => {
  return [...SPARK_COMBINATIONS]
    .map((candidate, index) => ({
      candidate,
      rank: countMatches(candidate, current) + seededJitter(seed, `spark-${index}`),
    }))
    .sort((left, right) => right.rank - left.rank)[0].candidate;
};

export const applyTuneModifier = (
  input: RecommendationInput,
  modifier: TuneModifier,
): RecommendationInput => {
  if (modifier === 'warmer') {
    return { ...input, mood: 'warm', color: input.color ?? 'gold', scene: input.scene ?? 'sunset' };
  }

  if (modifier === 'nocturnal') {
    return {
      ...input,
      mood: 'nocturnal',
      color: input.color ?? 'black',
      scene: input.scene ?? 'late-night',
    };
  }

  if (modifier === 'focused') {
    return {
      ...input,
      mood: 'focused',
      scene: input.scene ?? 'study',
      genre: input.genre ?? 'lo-fi',
    };
  }

  return input;
};

export const modifierToBubbleFocus = (modifier: TuneModifier): BubbleFocus => {
  if (modifier === 'warmer') {
    return 'warmer';
  }

  if (modifier === 'nocturnal') {
    return 'nocturnal';
  }

  if (modifier === 'focused') {
    return 'focused';
  }

  return 'surprising';
};
