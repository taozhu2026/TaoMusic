import {
  FIELD_OPTION_MAP,
  getOptionLabel,
} from '@/src/config/mappings';

import type { UiLanguage } from '@/src/i18n/types';
import type {
  RecommendationField,
  RecommendationInput,
  RecommendationResponse,
} from '@/src/features/recommendations/types';

type SignalInputKey = Extract<
  RecommendationField,
  'activity' | 'color' | 'country' | 'genre' | 'lyricalTheme' | 'mood' | 'scene'
>;

const formatSignalValue = (
  key: SignalInputKey,
  value: string | undefined,
  language: UiLanguage,
): string | null => {
  if (!value) {
    return null;
  }

  return getOptionLabel(FIELD_OPTION_MAP[key], value, language);
};

const collectSignalValues = (
  values: RecommendationInput,
  keys: SignalInputKey[],
  language: UiLanguage,
): string[] => {
  return keys
    .map((key) => formatSignalValue(key, values[key], language))
    .filter((value): value is string => Boolean(value));
};

export const buildResultSummaryTitle = (
  result: RecommendationResponse,
  language: UiLanguage,
): string => {
  const titleSignals = collectSignalValues(
    result.contextProfile.raw,
    ['activity', 'mood', 'color'],
    language,
  );

  if (titleSignals.length > 0) {
    return titleSignals.join(' · ');
  }

  return language === 'zh' ? '当前星图' : 'current constellation';
};

export const buildResultSummaryText = (
  result: RecommendationResponse,
  language: UiLanguage,
): string => {
  const count = result.recommendations.length;
  const secondarySignals = collectSignalValues(
    result.contextProfile.raw,
    ['country', 'genre', 'scene', 'lyricalTheme'],
    language,
  );

  if (language === 'zh') {
    const lead = `围绕当前信号整理出的 ${count} 首推荐`;

    if (secondarySignals.length === 0) {
      return `${lead}。`;
    }

    return `${lead}，偏向 ${secondarySignals.slice(0, 2).join('、')}。`;
  }

  const lead = `${count} picks shaped around the current signal`;

  if (secondarySignals.length === 0) {
    return `${lead}.`;
  }

  if (secondarySignals.length === 1) {
    return `${lead}, leaning toward ${secondarySignals[0]}.`;
  }

  return `${lead}, leaning toward ${secondarySignals.slice(0, 2).join(' and ')}.`;
};
