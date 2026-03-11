import { createStableId } from '@/src/lib/id';
import { MemoryCache } from '@/src/services/cache/memory-cache';

import type {
  StoredRecommendationRecord,
} from '@/src/features/recommendations/request-types';

const RESULT_CACHE_TTL_MS = 1000 * 60 * 20;

const resultCache = new MemoryCache<StoredRecommendationRecord>(RESULT_CACHE_TTL_MS);

export const storeRecommendationResult = (
  record: StoredRecommendationRecord,
): string => {
  const resultId = createStableId();
  resultCache.set(resultId, record);
  return resultId;
};

export const getRecommendationResult = (
  resultId: string,
): StoredRecommendationRecord | undefined => {
  return resultCache.get(resultId);
};
