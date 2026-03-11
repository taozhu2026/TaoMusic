import { SignalSummary } from '@/src/features/recommendations/components/signal-summary';

import type { UiLanguage } from '@/src/i18n/types';
import type { RecommendationInput } from '@/src/features/recommendations/types';

interface HomeSignalPanelProps {
  emptyText: string;
  language: UiLanguage;
  title: string;
  values: RecommendationInput;
}

export function HomeSignalPanel({
  emptyText,
  language,
  title,
  values,
}: HomeSignalPanelProps) {
  return (
    <SignalSummary
      emptyText={emptyText}
      language={language}
      title={title}
      values={values}
    />
  );
}
