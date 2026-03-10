'use client';

import { useDeferredValue, useState, useTransition } from 'react';

import { TaoMusicLockup } from '@/src/brand/taomusic-logo';
import {
  ContextForm,
  type RecommendationAction,
} from '@/src/features/recommendations/components/context-form';
import type { RecommendationPreset } from '@/src/features/recommendations/components/preset-strip';
import { ResultsPanel } from '@/src/features/recommendations/components/results-panel';

import type {
  RecommendationInput,
  RecommendationResponse,
} from '@/src/features/recommendations/types';

const EMPTY_FORM: RecommendationInput = {
  activity: '',
  color: '',
  country: '',
  genre: '',
  lyricalTheme: '',
  mood: '',
};

export function RecommendationExperience() {
  const [formValues, setFormValues] = useState<RecommendationInput>(EMPTY_FORM);
  const [result, setResult] = useState<RecommendationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeAction, setActiveAction] = useState<RecommendationAction | null>(null);
  const [lastCompletedAction, setLastCompletedAction] =
    useState<RecommendationAction | null>(null);
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [, startTransition] = useTransition();
  const deferredResult = useDeferredValue(result);

  const handleChange = (field: keyof RecommendationInput, value: string) => {
    setFormValues((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const applyPreset = (preset: RecommendationPreset) => {
    setFormValues({
      ...EMPTY_FORM,
      ...preset.values,
    });
    setError(null);
  };

  const activeColor =
    deferredResult?.contextProfile.raw.color ?? formValues.color ?? 'gold';
  const activeTone =
    deferredResult?.serendipity.tone ?? deferredResult?.contextProfile.tone ?? 'quiet';

  const requestRecommendation = async (
    action: RecommendationAction,
    overrides?: Partial<RecommendationInput>,
  ) => {
    setIsLoading(true);
    setActiveAction(action);
    setError(null);

    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formValues,
          excludeIds: overrides?.excludeIds ?? [],
          rerollSeed: crypto.randomUUID(),
          surprise: overrides?.surprise ?? false,
        }),
      });

      if (!response.ok) {
        throw new Error('recommendation_failed');
      }

      const payload = (await response.json()) as RecommendationResponse;
      const nextIds = payload.recommendations.map((item) => item.candidate.id);

      startTransition(() => {
        setResult(payload);
        setLastCompletedAction(action);
        setRecentIds((current) => [...new Set([...current, ...nextIds])].slice(-12));
      });
    } catch {
      setError('recommendation_failed');
    } finally {
      setActiveAction(null);
      setIsLoading(false);
    }
  };

  return (
    <div
      className="experienceScene"
      data-color={activeColor}
      data-tone={activeTone}
    >
      <header className="topBanner">
        <TaoMusicLockup />
        <div className="topBannerMeta">
          <span className="metaChip">session-only</span>
          <span className="metaChip">under 5s target</span>
          <span className="metaChip">human context → music</span>
        </div>
      </header>

      <div className="experienceLayout">
        <ContextForm
          activeAction={activeAction}
          canReroll={Boolean(result?.recommendations.length)}
          isLoading={isLoading}
          onApplyPreset={applyPreset}
          onChange={handleChange}
          onGenerate={() => requestRecommendation('generate')}
          onReroll={() => requestRecommendation('reroll', { excludeIds: recentIds })}
          onSurprise={() =>
            requestRecommendation('surprise', { surprise: true, excludeIds: recentIds })
          }
          values={formValues}
        />
        <ResultsPanel
          activeAction={activeAction}
          error={error}
          isLoading={isLoading}
          lastCompletedAction={lastCompletedAction}
          result={deferredResult}
        />
      </div>
    </div>
  );
}
