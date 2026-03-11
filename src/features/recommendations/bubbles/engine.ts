import { seededJitter } from '@/src/lib/random';

import { MUSE_BUBBLES } from '@/src/features/recommendations/bubbles/library';
import type {
  BubbleFocus,
  MuseBubble,
} from '@/src/features/recommendations/bubbles/types';
import type { RecommendationInput } from '@/src/features/recommendations/types';

const DECK_SIZE = 8;

const focusScore = (bubble: MuseBubble, focus: BubbleFocus): number => {
  if (focus === 'balanced') {
    return 0.15;
  }

  return bubble.focuses.includes(focus) ? 0.4 : 0;
};

export const buildBubbleDeck = ({
  dismissedIds,
  focus,
  seed,
  selectedIds,
}: {
  dismissedIds: string[];
  focus: BubbleFocus;
  seed: string;
  selectedIds: string[];
}): MuseBubble[] => {
  const selectedSet = new Set(selectedIds);
  const dismissedSet = new Set(dismissedIds);
  const available = MUSE_BUBBLES.filter(
    (bubble) => !selectedSet.has(bubble.id) && !dismissedSet.has(bubble.id),
  );
  const fallbackAvailable = available.length >= DECK_SIZE
    ? available
    : MUSE_BUBBLES.filter((bubble) => !selectedSet.has(bubble.id));

  return fallbackAvailable
    .map((bubble) => ({
      bubble,
      rank: focusScore(bubble, focus) + seededJitter(seed, bubble.id),
    }))
    .sort((left, right) => right.rank - left.rank)
    .slice(0, DECK_SIZE)
    .map(({ bubble }) => bubble);
};

export const getSelectedBubbles = (selectedIds: string[]): MuseBubble[] => {
  const selectedSet = new Set(selectedIds);
  return MUSE_BUBBLES.filter((bubble) => selectedSet.has(bubble.id)).sort(
    (left, right) => selectedIds.indexOf(left.id) - selectedIds.indexOf(right.id),
  );
};

export const buildBubbleInput = (selectedIds: string[]): RecommendationInput => {
  return getSelectedBubbles(selectedIds).reduce<RecommendationInput>((input, bubble) => {
    return {
      ...input,
      ...bubble.values,
    };
  }, {});
};
