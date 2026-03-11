import type { StoredRecommendationRecord } from '@/src/features/recommendations/request-types';
import type { InspirationImagePayload } from '@/src/features/recommendations/inspiration-image/types';

interface FallbackPhoto {
  alt: string;
  id: string;
  matchers: string[];
  url: string;
}

const FALLBACK_PHOTOS: FallbackPhoto[] = [
  {
    id: 'rainlit-city',
    matchers: ['rainy-day', 'late-night', 'blue', 'melancholic', 'nocturnal'],
    alt: 'Rain on a city window at night.',
    url: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1400&q=80',
  },
  {
    id: 'golden-kitchen',
    matchers: ['warm', 'gold', 'sunset', 'hopeful', 'healing'],
    alt: 'Golden light drifting across a quiet room.',
    url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80',
  },
  {
    id: 'night-drive',
    matchers: ['driving', 'red', 'city-pop', 'commuting', 'restless'],
    alt: 'Blurred city lights seen from a moving car.',
    url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1400&q=80',
  },
  {
    id: 'study-desk',
    matchers: ['study', 'coding', 'reading', 'focused', 'writing'],
    alt: 'A quiet desk lit by a single lamp.',
    url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=80',
  },
  {
    id: 'soft-water',
    matchers: ['dreamy', 'weightless', 'ambient', 'white', 'green'],
    alt: 'A soft horizon over still water.',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80',
  },
  {
    id: 'interior-heartbreak',
    matchers: ['heartbreak', 'bittersweet', 'solitude', 'black', 'intimate'],
    alt: 'A dim room with soft shadows and a quiet window.',
    url: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80',
  },
  {
    id: 'open-road-sunset',
    matchers: ['adventure', 'sunset', 'walking', 'open', 'driving'],
    alt: 'A road stretching into warm evening light.',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80',
  },
];

const collectFallbackSignals = (record: StoredRecommendationRecord): string[] => {
  return [
    record.result.contextProfile.raw.activity,
    record.result.contextProfile.raw.color,
    record.result.contextProfile.raw.country,
    record.result.contextProfile.raw.genre,
    record.result.contextProfile.raw.lyricalTheme,
    record.result.contextProfile.raw.mood,
    record.result.contextProfile.raw.scene,
    ...record.result.contextProfile.genrePreference,
    ...record.result.contextProfile.moodTags,
    ...record.result.contextProfile.sceneTags,
    ...record.result.recommendations.flatMap((item) => [
      ...(item.candidate.genreTags ?? []),
      ...(item.candidate.moodTags ?? []),
      ...(item.candidate.sceneTags ?? []),
      ...(item.candidate.descriptorTags ?? []),
    ]),
  ].filter((value): value is string => Boolean(value));
};

export const buildFallbackInspirationImage = (
  record: StoredRecommendationRecord,
): InspirationImagePayload => {
  const signals = collectFallbackSignals(record);
  const scored = FALLBACK_PHOTOS.map((photo) => ({
    photo,
    score: photo.matchers.filter((matcher) => signals.includes(matcher)).length,
  })).sort((left, right) => right.score - left.score);

  const chosen = scored[0]?.photo ?? FALLBACK_PHOTOS[0];

  return {
    alt: chosen.alt,
    imageUrl: chosen.url,
    promptLabel: record.result.serendipity.line,
    source: 'fallback',
  };
};
