import type {
  RecommendationInput,
  RecommendationResponse,
} from '@/src/features/recommendations/types';

type SignalInputKey =
  | 'activity'
  | 'color'
  | 'country'
  | 'genre'
  | 'lyricalTheme'
  | 'mood';

const formatSignalValue = (value?: string): string | null => {
  if (!value) {
    return null;
  }

  return value.replace(/-/g, ' ');
};

const collectSignalValues = (
  values: RecommendationInput,
  keys: SignalInputKey[],
): string[] => {
  return keys
    .map((key) => formatSignalValue(values[key]))
    .filter((value): value is string => Boolean(value));
};

export const buildResultSummaryTitle = (result: RecommendationResponse): string => {
  const titleSignals = collectSignalValues(result.contextProfile.raw, [
    'activity',
    'mood',
    'color',
  ]);

  if (titleSignals.length > 0) {
    return titleSignals.join(' · ');
  }

  return formatSignalValue(result.contextProfile.tone) ?? 'current constellation';
};

export const buildResultSummaryText = (result: RecommendationResponse): string => {
  const tone = formatSignalValue(result.contextProfile.tone) ?? 'quiet';
  const count = result.recommendations.length;
  const secondarySignals = collectSignalValues(result.contextProfile.raw, [
    'country',
    'genre',
    'lyricalTheme',
  ]);
  const lead = `${count} pick${count === 1 ? '' : 's'} shaped around a ${tone} register`;

  if (secondarySignals.length === 0) {
    return `${lead}.`;
  }

  if (secondarySignals.length === 1) {
    return `${lead}, leaning toward ${secondarySignals[0]}.`;
  }

  return `${lead}, leaning toward ${secondarySignals.slice(0, 2).join(' and ')}.`;
};
