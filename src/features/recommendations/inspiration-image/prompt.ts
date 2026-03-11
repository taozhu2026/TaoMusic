import {
  buildResultSummaryText,
  buildResultSummaryTitle,
} from '@/src/features/recommendations/result-summary';

import type { StoredRecommendationRecord } from '@/src/features/recommendations/request-types';

const buildSharedVibe = (record: StoredRecommendationRecord): string[] => {
  const values = [
    record.result.contextProfile.raw.mood,
    record.result.contextProfile.raw.scene,
    record.result.contextProfile.raw.color,
    record.result.contextProfile.raw.country,
    record.result.contextProfile.raw.genre,
    ...record.result.recommendations.flatMap((item) => [
      item.candidate.region,
      item.candidate.artworkColorHint,
      ...(item.candidate.moodTags ?? []).slice(0, 1),
      ...(item.candidate.sceneTags ?? []).slice(0, 1),
      ...(item.candidate.descriptorTags ?? []).slice(0, 1),
    ]),
  ];

  return [...new Set(values.filter((value): value is string => Boolean(value)))].slice(0, 6);
};

export const buildInspirationImagePrompt = (
  record: StoredRecommendationRecord,
): string => {
  const title = buildResultSummaryTitle(record.result, 'en');
  const summary = buildResultSummaryText(record.result, 'en');
  const sharedVibe = buildSharedVibe(record);

  return [
    'Create an elegant atmospheric editorial photograph for a music recommendation interface.',
    `Core line: ${record.result.serendipity.line}.`,
    `Signal: ${title}.`,
    `Interpretation: ${summary}`,
    `Vibe terms: ${sharedVibe.join(', ')}.`,
    'Style: poetic, minimal, cinematic, emotionally coherent, soft light, textured depth.',
    'Avoid text, typography, album covers, app UI, logos, split panels, collage, and people staring into camera.',
  ].join(' ');
};
