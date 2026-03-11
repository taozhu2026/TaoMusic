import type { BubbleDraft, RecommendationMode } from '@/src/features/recommendations/experience-types';
import type { RecommendationInput } from '@/src/features/recommendations/types';

const HOME_DRAFTS_STORAGE_KEY = 'taomusic-home-drafts-v06';

export interface StoredHomeDrafts {
  bubbleDraft: BubbleDraft;
  mode: RecommendationMode;
  structuredDraft: RecommendationInput;
}

export const loadHomeDrafts = (): StoredHomeDrafts | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const rawValue = window.localStorage.getItem(HOME_DRAFTS_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as StoredHomeDrafts;
  } catch {
    return null;
  }
};

export const saveHomeDrafts = (drafts: StoredHomeDrafts): void => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(HOME_DRAFTS_STORAGE_KEY, JSON.stringify(drafts));
};
