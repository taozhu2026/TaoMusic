'use client';

import { Button } from '@/src/components/ui/button';
import { getUiCopy } from '@/src/i18n/copy';
import { PreferenceToggles } from '@/src/features/recommendations/components/preference-toggles';

import type { UiLanguage } from '@/src/i18n/types';
import type { RecommendationAction } from '@/src/features/recommendations/experience-types';

interface ResultControlClusterProps {
  activeAction: RecommendationAction | null;
  isLoading: boolean;
  language: UiLanguage;
  onBackHome: () => void;
  onReroll: () => void;
}

export function ResultControlCluster({
  activeAction,
  isLoading,
  language,
  onBackHome,
  onReroll,
}: ResultControlClusterProps) {
  const copy = getUiCopy(language);

  return (
    <div className="resultControlCluster">
      <Button disabled={isLoading} onClick={onReroll} type="button" variant="secondary">
        {activeAction === 'reroll' ? copy.common.rerolling : copy.common.reroll}
      </Button>
      <PreferenceToggles />
      <Button disabled={isLoading} onClick={onBackHome} type="button" variant="ghost">
        {copy.common.backHome}
      </Button>
    </div>
  );
}
