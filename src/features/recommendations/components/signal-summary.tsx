import {
  FIELD_OPTION_MAP,
  getOptionLabel,
} from '@/src/config/mappings';

import type { UiLanguage } from '@/src/i18n/types';
import type {
  RecommendationField,
  RecommendationInput,
} from '@/src/features/recommendations/types';

interface SignalSummaryProps {
  emptyText: string;
  language: UiLanguage;
  title: string;
  values: RecommendationInput;
}

const FIELD_LABELS: Array<{
  key: Extract<
    RecommendationField,
    'activity' | 'mood' | 'color' | 'country' | 'genre' | 'scene' | 'lyricalTheme'
  >;
  labels: { en: string; zh: string };
}> = [
  { key: 'activity', labels: { en: 'Activity', zh: '活动' } },
  { key: 'mood', labels: { en: 'Mood', zh: '情绪' } },
  { key: 'color', labels: { en: 'Color', zh: '颜色' } },
  { key: 'country', labels: { en: 'Region / culture', zh: '地区 / 文化' } },
  { key: 'genre', labels: { en: 'Genre', zh: '风格' } },
  { key: 'scene', labels: { en: 'Scene', zh: '场景' } },
  { key: 'lyricalTheme', labels: { en: 'Theme', zh: '主题' } },
];

export function SignalSummary({
  emptyText,
  language,
  title,
  values,
}: SignalSummaryProps) {
  const activeEntries = FIELD_LABELS.filter(({ key }) => {
    const value = values[key];
    return typeof value === 'string' && value.length > 0;
  });

  if (activeEntries.length === 0) {
    return (
      <div className="signalSummary">
        <p className="signalSummaryLabel">{title}</p>
        <p className="signalSummaryEmpty">{emptyText}</p>
      </div>
    );
  }

  return (
    <div className="signalSummary">
      <p className="signalSummaryLabel">{title}</p>
      <div className="signalSummaryGrid">
        {activeEntries.map(({ key, labels }) => (
          <div className="signalSummaryItem" key={key}>
            <span className="signalSummaryKey">{labels[language]}</span>
            <span className="signalSummaryValue">
              {getOptionLabel(FIELD_OPTION_MAP[key], String(values[key]), language)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
