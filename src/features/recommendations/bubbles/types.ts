import type { RecommendationInput } from '@/src/features/recommendations/types';

export type BubbleFocus = 'balanced' | 'warmer' | 'nocturnal' | 'focused' | 'surprising';

export interface MuseBubble {
  id: string;
  label: string;
  note: string;
  values: RecommendationInput;
  focuses: BubbleFocus[];
}
