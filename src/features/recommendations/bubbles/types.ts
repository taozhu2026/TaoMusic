import type { RecommendationInput } from '@/src/features/recommendations/types';

export type BubbleFocus = 'balanced' | 'warmer' | 'nocturnal' | 'focused' | 'surprising';
export type BubbleFamily =
  | 'emotion'
  | 'scene'
  | 'region'
  | 'genre'
  | 'texture'
  | 'color';
export type BubbleSize = 'sm' | 'md' | 'lg';

export interface MuseBubble {
  family: BubbleFamily;
  id: string;
  label: string;
  note: string;
  size: BubbleSize;
  values: RecommendationInput;
  focuses: BubbleFocus[];
}
