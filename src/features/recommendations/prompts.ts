import type {
  ContextProfile,
  RankedRecommendation,
} from '@/src/features/recommendations/types';

export const buildSerendipityPrompt = (
  profile: ContextProfile,
  picks: RankedRecommendation[],
): string => {
  const songs = picks
    .map(
      (recommendation) =>
        `- ${recommendation.candidate.title} — ${recommendation.candidate.artist}`,
    )
    .join('\n');

  return `
Write one short serendipity line for a music recommendation card.

User context:
- activity: ${profile.raw.activity ?? 'unspecified'}
- mood: ${profile.raw.mood ?? 'unspecified'}
- color: ${profile.raw.color ?? 'unspecified'}
- country: ${profile.raw.country ?? 'unspecified'}
- genre: ${profile.raw.genre ?? 'unspecified'}
- lyrical theme: ${profile.raw.lyricalTheme ?? 'unspecified'}

Selected songs:
${songs}

Requirements:
- one sentence only
- 8 to 20 words
- poetic but restrained
- emotionally coherent with the context
- do not use hashtags, emoji, or quotation marks
- avoid cheesy phrases and avoid explaining the recommendation logic
`.trim();
};
