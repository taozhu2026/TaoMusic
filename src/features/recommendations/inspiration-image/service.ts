import { generateImageAsset } from '@/src/services/llm/image-client';
import { getRecommendationResult } from '@/src/features/recommendations/result-cache';
import { buildFallbackInspirationImage } from '@/src/features/recommendations/inspiration-image/fallback-library';
import { getInspirationImage, storeInspirationImage } from '@/src/features/recommendations/inspiration-image/cache';
import { buildInspirationImagePrompt } from '@/src/features/recommendations/inspiration-image/prompt';

import type { InspirationImagePayload } from '@/src/features/recommendations/inspiration-image/types';

export const resolveInspirationImage = async (
  resultId: string,
): Promise<InspirationImagePayload | null> => {
  const cached = getInspirationImage(resultId);

  if (cached) {
    return cached;
  }

  const record = getRecommendationResult(resultId);

  if (!record) {
    return null;
  }

  const prompt = buildInspirationImagePrompt(record);
  const generated = await generateImageAsset(prompt);

  if (generated) {
    return storeInspirationImage(resultId, {
      alt: `${record.result.serendipity.line} inspired visual`,
      imageUrl: generated.imageUrl,
      promptLabel: record.result.serendipity.line,
      source: 'generated',
    });
  }

  return storeInspirationImage(resultId, buildFallbackInspirationImage(record));
};
