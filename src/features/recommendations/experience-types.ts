import type { BubbleFocus } from '@/src/features/recommendations/bubbles/types';

export type RecommendationAction = 'generate' | 'reroll' | 'surprise';
export type RecommendationMode = 'structured' | 'bubble';
export type ExperienceViewState = 'home_input' | 'generating' | 'result_view' | 'tuning';
export type MuseCardState = 'hidden' | 'expanded' | 'minimized';
export type TuneModifier = 'warmer' | 'nocturnal' | 'focused' | 'surprising';

export interface BubbleDraft {
  dismissedIds: string[];
  focus: BubbleFocus;
  seed: string;
  selectedIds: string[];
}
