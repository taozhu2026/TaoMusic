import { MemoryCache } from '@/src/services/cache/memory-cache';

import type { InspirationImagePayload } from '@/src/features/recommendations/inspiration-image/types';

const INSPIRATION_IMAGE_TTL_MS = 1000 * 60 * 20;

const imageCache = new MemoryCache<InspirationImagePayload>(INSPIRATION_IMAGE_TTL_MS);

export const getInspirationImage = (
  resultId: string,
): InspirationImagePayload | undefined => {
  return imageCache.get(resultId);
};

export const storeInspirationImage = (
  resultId: string,
  payload: InspirationImagePayload,
): InspirationImagePayload => {
  imageCache.set(resultId, payload);
  return payload;
};
