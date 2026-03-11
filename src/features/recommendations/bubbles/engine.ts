import { seededJitter } from '@/src/lib/random';
import { uniqueStrings } from '@/src/lib/text';

import { MUSE_BUBBLES } from '@/src/features/recommendations/bubbles/library';
import type {
  BubbleFocus,
  BubbleFamily,
  MuseBubble,
} from '@/src/features/recommendations/bubbles/types';
import type { RecommendationInput } from '@/src/features/recommendations/types';

const DECK_SIZE = 8;
const SPARK_SIZE = 3;

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

const scoreBubbleAgainstInput = (
  bubble: MuseBubble,
  input: RecommendationInput,
): number => {
  const entries = Object.entries(bubble.values) as Array<[keyof RecommendationInput, string]>;

  return entries.reduce((score, [key, value]) => {
    return input[key] === value ? score + 1 : score;
  }, 0);
};

export const hydrateBubbleSelection = (
  input: RecommendationInput,
  focus: BubbleFocus,
  seed: string,
): string[] => {
  const ranked = MUSE_BUBBLES
    .map((bubble) => ({
      bubble,
      rank: scoreBubbleAgainstInput(bubble, input) + focusScore(bubble, focus) + seededJitter(seed, bubble.id),
    }))
    .filter(({ rank }) => rank > 0.35)
    .sort((left, right) => right.rank - left.rank);
  const usedFamilies = new Set<BubbleFamily>();
  const selection: string[] = [];

  for (const { bubble } of ranked) {
    if (selection.length === SPARK_SIZE) {
      break;
    }

    if (usedFamilies.has(bubble.family) && selection.length < SPARK_SIZE - 1) {
      continue;
    }

    selection.push(bubble.id);
    usedFamilies.add(bubble.family);
  }

  return selection;
};

export const buildBubbleSparkSelection = ({
  currentIds,
  focus,
  seed,
}: {
  currentIds: string[];
  focus: BubbleFocus;
  seed: string;
}): string[] => {
  const baseDeck = buildBubbleDeck({
    dismissedIds: [],
    focus,
    seed,
    selectedIds: [],
  });
  const currentSet = new Set(currentIds);
  const preferred = baseDeck.sort((left, right) => {
    const leftBonus = currentSet.has(left.id) ? 0.25 : 0;
    const rightBonus = currentSet.has(right.id) ? 0.25 : 0;
    return rightBonus - leftBonus;
  });
  const families = new Set<BubbleFamily>();
  const selection: string[] = [];

  for (const bubble of preferred) {
    if (selection.length === SPARK_SIZE) {
      break;
    }

    if (families.has(bubble.family) && selection.length < SPARK_SIZE - 1) {
      continue;
    }

    selection.push(bubble.id);
    families.add(bubble.family);
  }

  return uniqueStrings(selection);
};
