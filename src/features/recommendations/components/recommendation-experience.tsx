'use client';

import { useDeferredValue, useState, useTransition } from 'react';

import { TaoMusicLockup } from '@/src/brand/taomusic-logo';
import {
  buildBubbleDeck,
  buildBubbleInput,
  getSelectedBubbles,
} from '@/src/features/recommendations/bubbles/engine';
import type { BubbleFocus } from '@/src/features/recommendations/bubbles/types';
import {
  ContextForm,
  type RecommendationAction,
} from '@/src/features/recommendations/components/context-form';
import {
  ModeSwitch,
  type RecommendationMode,
} from '@/src/features/recommendations/components/mode-switch';
import { MuseBubblePanel } from '@/src/features/recommendations/components/muse-bubble-panel';
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
  const [mode, setMode] = useState<RecommendationMode>('structured');
  const [result, setResult] = useState<RecommendationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeAction, setActiveAction] = useState<RecommendationAction | null>(null);
  const [lastCompletedAction, setLastCompletedAction] =
    useState<RecommendationAction | null>(null);
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [bubbleFocus, setBubbleFocus] = useState<BubbleFocus>('balanced');
  const [bubbleSeed, setBubbleSeed] = useState('opening');
  const [selectedBubbleIds, setSelectedBubbleIds] = useState<string[]>([]);
  const [dismissedBubbleIds, setDismissedBubbleIds] = useState<string[]>([]);
  const [, startTransition] = useTransition();
  const deferredResult = useDeferredValue(result);
  const selectedBubbles = getSelectedBubbles(selectedBubbleIds);
  const bubbleInput = buildBubbleInput(selectedBubbleIds);
  const bubbleDeck = buildBubbleDeck({
    dismissedIds: dismissedBubbleIds,
    focus: bubbleFocus,
    seed: bubbleSeed,
    selectedIds: selectedBubbleIds,
  });

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

  const toggleBubble = (bubbleId: string) => {
    setSelectedBubbleIds((current) =>
      current.includes(bubbleId)
        ? current.filter((id) => id !== bubbleId)
        : [...current, bubbleId],
    );
  };

  const dismissBubble = (bubbleId: string) => {
    setSelectedBubbleIds((current) => current.filter((id) => id !== bubbleId));
    setDismissedBubbleIds((current) => [...new Set([...current, bubbleId])]);
  };

  const refreshBubbleDeck = () => {
    setBubbleSeed(crypto.randomUUID());
    setDismissedBubbleIds([]);
  };

  const changeBubbleFocus = (focus: BubbleFocus) => {
    setBubbleFocus(focus);
    setBubbleSeed(crypto.randomUUID());
    setDismissedBubbleIds([]);
  };

  const activeColor =
    deferredResult?.contextProfile.raw.color ??
    (mode === 'bubble' ? bubbleInput.color : formValues.color) ??
    'gold';
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
          ...(mode === 'bubble' ? bubbleInput : formValues),
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
        <div className="inputColumn">
          <ModeSwitch mode={mode} onChange={setMode} />
          {mode === 'structured' ? (
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
          ) : (
            <MuseBubblePanel
              activeAction={activeAction}
              canGenerate={selectedBubbleIds.length > 0}
              canReroll={Boolean(result?.recommendations.length)}
              deck={bubbleDeck}
              derivedInput={bubbleInput}
              focus={bubbleFocus}
              isLoading={isLoading}
              onDismissBubble={dismissBubble}
              onGenerate={() => requestRecommendation('generate')}
              onRefreshDeck={refreshBubbleDeck}
              onReroll={() => requestRecommendation('reroll', { excludeIds: recentIds })}
              onSetFocus={changeBubbleFocus}
              onSurprise={() =>
                requestRecommendation('surprise', { surprise: true, excludeIds: recentIds })
              }
              onToggleBubble={toggleBubble}
              selectedBubbles={selectedBubbles}
            />
          )}
        </div>
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
