import type { BubbleDraft, RecommendationMode } from '@/src/features/recommendations/experience-types';
import type { RecommendationInput, RecommendationResponse } from '@/src/features/recommendations/types';

export interface RecommendationRequestPayload {
  bubbleDraft?: BubbleDraft;
  input: RecommendationInput;
  mode: RecommendationMode;
  structuredDraft?: RecommendationInput;
}

export interface StoredRecommendationRecord {
  bubbleDraft: BubbleDraft;
  createdAt: number;
  mode: RecommendationMode;
  result: RecommendationResponse;
  structuredDraft: RecommendationInput;
}

export interface RecommendationPostResponse {
  resultId: string;
}

export interface ResultFetchResponse {
  record: StoredRecommendationRecord;
  resultId: string;
}
