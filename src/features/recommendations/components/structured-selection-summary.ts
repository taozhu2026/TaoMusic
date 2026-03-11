import {
  FIELD_OPTION_MAP,
  getOptionLabel,
} from '@/src/config/mappings';

import type { UiLanguage } from '@/src/i18n/types';
import type { RecommendationInput } from '@/src/features/recommendations/types';

type StructuredSignalField =
  | 'activity'
  | 'mood'
  | 'color'
  | 'country'
  | 'genre'
  | 'scene'
  | 'lyricalTheme';

const SUMMARY_ORDER: StructuredSignalField[] = [
  'activity',
  'mood',
  'color',
  'country',
  'genre',
  'scene',
  'lyricalTheme',
];

export const collectStructuredSelectionLabels = (
  values: RecommendationInput,
  language: UiLanguage,
): string[] => {
  return SUMMARY_ORDER.map((field) => {
    const value = values[field];

    if (!value) {
      return null;
    }

    return getOptionLabel(FIELD_OPTION_MAP[field], value, language);
  }).filter((value): value is string => Boolean(value));
};
