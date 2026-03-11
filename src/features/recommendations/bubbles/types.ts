import type { LocalizedText } from '@/src/i18n/types';
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
  focuses: BubbleFocus[];
  id: string;
  label: LocalizedText;
  note: LocalizedText;
  size: BubbleSize;
  values: RecommendationInput;
}
