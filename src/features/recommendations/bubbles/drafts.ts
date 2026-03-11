import { createStableId } from '@/src/lib/id';

import {
  buildBubbleSparkSelection,
  hydrateBubbleSelection,
} from '@/src/features/recommendations/bubbles/engine';

import type { BubbleFocus } from '@/src/features/recommendations/bubbles/types';
import type { BubbleDraft } from '@/src/features/recommendations/experience-types';
import type { RecommendationInput } from '@/src/features/recommendations/types';

export const createBubbleDraft = (
  focus: BubbleFocus = 'balanced',
  selectedIds: string[] = [],
): BubbleDraft => ({
  dismissedIds: [],
  focus,
  seed: createStableId(),
  selectedIds,
});

export const buildHydratedBubbleDraft = (
  input: RecommendationInput,
  focus: BubbleFocus,
  currentIds: string[],
): BubbleDraft => {
  const seed = createStableId();
  const hydratedIds = hydrateBubbleSelection(input, focus, seed);
  const selectedIds =
    hydratedIds.length > 0
      ? hydratedIds
      : buildBubbleSparkSelection({ currentIds, focus, seed });

  return {
    dismissedIds: [],
    focus,
    seed,
    selectedIds,
  };
};
