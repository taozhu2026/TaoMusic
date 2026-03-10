'use client';

import { useDeferredValue, useState, useTransition } from 'react';

import { ContextForm } from '@/src/features/recommendations/components/context-form';
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

  const requestRecommendation = async (overrides?: Partial<RecommendationInput>) => {
    setIsLoading(true);
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
        setRecentIds((current) => [...new Set([...current, ...nextIds])].slice(-12));
      });
    } catch {
      setError('recommendation_failed');
    } finally {
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
        <div className="brandMark">
          <span className="brandDisc" />
          <div>
            <p className="brandName">TaoMusic</p>
            <p className="brandTag">A small AI music muse for atmosphere and drift.</p>
          </div>
        </div>
        <div className="topBannerMeta">
          <span className="metaChip">session-only</span>
          <span className="metaChip">under 5s target</span>
          <span className="metaChip">human context → music</span>
        </div>
      </header>

      <div className="experienceLayout">
      <ContextForm
        canReroll={Boolean(result?.recommendations.length)}
        isLoading={isLoading}
        onApplyPreset={applyPreset}
        onChange={handleChange}
        onGenerate={() => requestRecommendation()}
        onReroll={() => requestRecommendation({ excludeIds: recentIds })}
        onSurprise={() => requestRecommendation({ surprise: true, excludeIds: recentIds })}
        values={formValues}
      />
      <ResultsPanel error={error} isLoading={isLoading} result={deferredResult} />
      </div>
    </div>
  );
}
