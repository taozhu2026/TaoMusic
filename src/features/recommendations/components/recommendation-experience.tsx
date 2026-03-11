'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useDeferredValue, useState, useTransition } from 'react';

import { TaoMusicLockup } from '@/src/brand/taomusic-logo';
import {
  buildBubbleDeck,
  buildBubbleInput,
  buildBubbleSparkSelection,
  getSelectedBubbles,
  hydrateBubbleSelection,
} from '@/src/features/recommendations/bubbles/engine';
import type { BubbleFocus } from '@/src/features/recommendations/bubbles/types';
import { ContextForm } from '@/src/features/recommendations/components/context-form';
import { FloatingControlPanel } from '@/src/features/recommendations/components/floating-control-panel';
import { ModeSwitch } from '@/src/features/recommendations/components/mode-switch';
import { MuseBubblePanel } from '@/src/features/recommendations/components/muse-bubble-panel';
import type { RecommendationPreset } from '@/src/features/recommendations/components/preset-strip';
import { ResultsPanel } from '@/src/features/recommendations/components/results-panel';
import {
  applyTuneModifier,
  buildStructuredSparkInput,
  hasUsableSignal,
  modifierToBubbleFocus,
} from '@/src/features/recommendations/spark';

import type {
  BubbleDraft,
  RecommendationAction,
  RecommendationMode,
  TuneModifier,
} from '@/src/features/recommendations/experience-types';
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
  scene: '',
};

const createBubbleDraft = (
  focus: BubbleFocus = 'balanced',
  selectedIds: string[] = [],
): BubbleDraft => ({
  dismissedIds: [],
  focus,
  seed: crypto.randomUUID(),
  selectedIds,
});

const buildHydratedBubbleDraft = (
  input: RecommendationInput,
  focus: BubbleFocus,
  currentIds: string[],
): BubbleDraft => {
  const seed = crypto.randomUUID();
  const hydratedIds = hydrateBubbleSelection(input, focus, seed);
  const selectedIds =
    hydratedIds.length > 0
      ? hydratedIds
      : buildBubbleSparkSelection({ currentIds, focus, seed });

  return {
    dismissedIds: [],
    focus,
    seed,
    selectedIds,
  };
};

interface RequestOptions {
  action: RecommendationAction;
  bubbleIdsOverride?: string[];
  excludeIds?: string[];
  inputOverride?: RecommendationInput;
  surprise?: boolean;
  targetMode?: RecommendationMode;
}

export function RecommendationExperience() {
  const [structuredDraft, setStructuredDraft] = useState<RecommendationInput>(EMPTY_FORM);
  const [bubbleDraft, setBubbleDraft] = useState<BubbleDraft>(() => createBubbleDraft());
  const [mode, setMode] = useState<RecommendationMode>('structured');
  const [viewState, setViewState] = useState<'home_input' | 'generating' | 'result_view' | 'tuning'>(
    'home_input',
  );
  const [museCardState, setMuseCardState] = useState<'hidden' | 'expanded' | 'minimized'>(
    'hidden',
  );
  const [result, setResult] = useState<RecommendationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeAction, setActiveAction] = useState<RecommendationAction | null>(null);
  const [lastCompletedAction, setLastCompletedAction] =
    useState<RecommendationAction | null>(null);
  const [lastGeneratedMode, setLastGeneratedMode] =
    useState<RecommendationMode>('structured');
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [, startTransition] = useTransition();

  const deferredResult = useDeferredValue(result);
  const selectedBubbles = getSelectedBubbles(bubbleDraft.selectedIds);
  const bubbleInput = buildBubbleInput(bubbleDraft.selectedIds);
  const bubbleDeck = buildBubbleDeck({
    dismissedIds: bubbleDraft.dismissedIds,
    focus: bubbleDraft.focus,
    seed: bubbleDraft.seed,
    selectedIds: bubbleDraft.selectedIds,
  });
  const canGenerateStructured = hasUsableSignal(structuredDraft);
  const canGenerateBubble = bubbleDraft.selectedIds.length > 0;
  const activeDraft = mode === 'bubble' ? bubbleInput : structuredDraft;
  const activeColor = deferredResult?.contextProfile.raw.color || activeDraft.color || 'gold';
  const activeTone =
    deferredResult?.serendipity.tone || deferredResult?.contextProfile.tone || 'quiet';
  const isResultStage = viewState !== 'home_input';

  const syncBubbleDraftFromInput = (
    input: RecommendationInput,
    focus: BubbleFocus = bubbleDraft.focus,
  ): BubbleDraft => {
    const nextDraft = buildHydratedBubbleDraft(input, focus, bubbleDraft.selectedIds);
    setBubbleDraft(nextDraft);
    return nextDraft;
  };

  const resolveStructuredInput = (): RecommendationInput | null => {
    if (hasUsableSignal(structuredDraft)) {
      return structuredDraft;
    }

    if (hasUsableSignal(bubbleInput)) {
      return bubbleInput;
    }

    if (deferredResult && hasUsableSignal(deferredResult.contextProfile.raw)) {
      return deferredResult.contextProfile.raw;
    }

    return null;
  };

  const resolveBubbleDraft = (focus: BubbleFocus = bubbleDraft.focus): BubbleDraft | null => {
    if (bubbleDraft.selectedIds.length > 0 && focus === bubbleDraft.focus) {
      return bubbleDraft;
    }

    if (bubbleDraft.selectedIds.length > 0) {
      const nextDraft = {
        ...bubbleDraft,
        dismissedIds: [],
        focus,
        seed: crypto.randomUUID(),
      };
      setBubbleDraft(nextDraft);
      return nextDraft;
    }

    const sourceInput =
      resolveStructuredInput() ?? deferredResult?.contextProfile.raw ?? EMPTY_FORM;

    if (!hasUsableSignal(sourceInput)) {
      return null;
    }

    return syncBubbleDraftFromInput(sourceInput, focus);
  };

  const requestRecommendation = async ({
    action,
    bubbleIdsOverride,
    excludeIds = [],
    inputOverride,
    surprise = false,
    targetMode = mode,
  }: RequestOptions) => {
    const payloadInput =
      targetMode === 'bubble'
        ? buildBubbleInput(bubbleIdsOverride ?? bubbleDraft.selectedIds)
        : inputOverride ?? structuredDraft;

    setActiveAction(action);
    setError(null);
    setIsLoading(true);
    setViewState('generating');

    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...payloadInput,
          excludeIds,
          rerollSeed: crypto.randomUUID(),
          surprise,
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
        setLastGeneratedMode(targetMode);
        setMuseCardState('hidden');
        setRecentIds((current) => [...new Set([...current, ...nextIds])].slice(-12));
        setViewState('result_view');
      });
    } catch {
      startTransition(() => {
        setError('recommendation_failed');
        setViewState('result_view');
      });
    } finally {
      setActiveAction(null);
      setIsLoading(false);
    }
  };

  const handleModeChange = (nextMode: RecommendationMode) => {
    if (nextMode === mode || isLoading) {
      return;
    }

    setError(null);

    if (!isResultStage) {
      setMode(nextMode);
      return;
    }

    if (nextMode === 'structured') {
      const nextInput = resolveStructuredInput();

      if (!nextInput) {
        return;
      }

      setMode(nextMode);
      setStructuredDraft(nextInput);
      void requestRecommendation({
        action: 'reroll',
        excludeIds: recentIds,
        inputOverride: nextInput,
        targetMode: 'structured',
      });
      return;
    }

    const nextDraft = resolveBubbleDraft();

    if (!nextDraft || nextDraft.selectedIds.length === 0) {
      return;
    }

    setMode(nextMode);
    void requestRecommendation({
      action: 'reroll',
      bubbleIdsOverride: nextDraft.selectedIds,
      excludeIds: recentIds,
      targetMode: 'bubble',
    });
  };

  const handleStructuredChange = (field: keyof RecommendationInput, value: string) => {
    setStructuredDraft((current) => ({
      ...current,
      [field]: value,
    }));
    setError(null);
  };

  const handlePreset = (preset: RecommendationPreset) => {
    setStructuredDraft({
      ...EMPTY_FORM,
      ...preset.values,
    });
    setError(null);
  };

  const handleStructuredSpark = () => {
    setStructuredDraft(buildStructuredSparkInput(crypto.randomUUID(), structuredDraft));
    setError(null);
  };

  const handleBubbleSpark = () => {
    const seed = crypto.randomUUID();
    const selectedIds = buildBubbleSparkSelection({
      currentIds: bubbleDraft.selectedIds,
      focus: bubbleDraft.focus,
      seed,
    });

    setBubbleDraft({
      dismissedIds: [],
      focus: bubbleDraft.focus,
      seed,
      selectedIds,
    });
    setError(null);
  };

  const toggleBubble = (bubbleId: string) => {
    setError(null);
    setBubbleDraft((current) => ({
      ...current,
      dismissedIds: current.dismissedIds.filter((id) => id !== bubbleId),
      selectedIds: current.selectedIds.includes(bubbleId)
        ? current.selectedIds.filter((id) => id !== bubbleId)
        : [...current.selectedIds, bubbleId],
    }));
  };

  const dismissBubble = (bubbleId: string) => {
    setError(null);
    setBubbleDraft((current) => ({
      ...current,
      dismissedIds: [...new Set([...current.dismissedIds, bubbleId])],
      selectedIds: current.selectedIds.filter((id) => id !== bubbleId),
    }));
  };

  const refreshBubbleDeck = () => {
    setBubbleDraft((current) => ({
      ...current,
      dismissedIds: [],
      seed: crypto.randomUUID(),
    }));
  };

  const changeBubbleFocus = (focus: BubbleFocus) => {
    setBubbleDraft((current) => ({
      ...current,
      dismissedIds: [],
      focus,
      seed: crypto.randomUUID(),
    }));
  };

  const handleTuneModifier = (modifier: TuneModifier) => {
    if (mode === 'structured') {
      const baseInput = resolveStructuredInput();

      if (!baseInput) {
        return;
      }

      const nextInput =
        modifier === 'surprising' ? baseInput : applyTuneModifier(baseInput, modifier);

      setStructuredDraft(nextInput);
      void requestRecommendation({
        action: modifier === 'surprising' ? 'surprise' : 'reroll',
        excludeIds: recentIds,
        inputOverride: nextInput,
        surprise: modifier === 'surprising',
        targetMode: 'structured',
      });
      return;
    }

    const nextFocus = modifierToBubbleFocus(modifier);
    const nextDraft = resolveBubbleDraft(nextFocus);

    if (!nextDraft || nextDraft.selectedIds.length === 0) {
      return;
    }

    void requestRecommendation({
      action: modifier === 'surprising' ? 'surprise' : 'reroll',
      bubbleIdsOverride: nextDraft.selectedIds,
      excludeIds: recentIds,
      surprise: modifier === 'surprising',
      targetMode: 'bubble',
    });
  };

  const handleBackHome = () => {
    setError(null);
    setMuseCardState('hidden');
    setViewState('home_input');
  };

  return (
    <div
      className="experienceScene"
      data-color={activeColor}
      data-tone={activeTone}
      data-view={viewState}
    >
      <motion.header
        animate={{ opacity: 1, y: 0 }}
        className={['topBanner', isResultStage ? 'topBanner-compact' : ''].join(' ')}
        initial={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.36, ease: 'easeOut' }}
      >
        <TaoMusicLockup />
        <div className="topBannerControls">
          <ModeSwitch disabled={isLoading} mode={mode} onChange={handleModeChange} />
          <div
            className={[
              'topBannerMeta',
              isResultStage ? 'topBannerMeta-compact' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {isResultStage ? (
              <>
                <span className="metaChip">{lastGeneratedMode} result live</span>
                {deferredResult ? (
                  <span className="metaChip">{deferredResult.recommendations.length} picks</span>
                ) : null}
              </>
            ) : (
              <>
                <span className="metaChip">session-only</span>
                <span className="metaChip">under 5s target</span>
                <span className="metaChip">human context → music</span>
              </>
            )}
          </div>
        </div>
      </motion.header>

      <AnimatePresence initial={false} mode="wait">
        {viewState === 'home_input' ? (
          <motion.section
            animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
            className="homeStage"
            exit={{ filter: 'blur(10px)', opacity: 0, y: -26 }}
            initial={{ filter: 'blur(0px)', opacity: 0, y: 18 }}
            key="home_input"
            transition={{ duration: 0.34, ease: 'easeOut' }}
          >
            {mode === 'structured' ? (
              <ContextForm
                activeAction={activeAction}
                canGenerate={canGenerateStructured}
                canReroll={Boolean(result?.recommendations.length)}
                isLoading={isLoading}
                onApplyPreset={handlePreset}
                onChange={handleStructuredChange}
                onGenerate={() => requestRecommendation({ action: 'generate' })}
                onReroll={() =>
                  requestRecommendation({ action: 'reroll', excludeIds: recentIds })
                }
                onSpark={handleStructuredSpark}
                onSurprise={() =>
                  requestRecommendation({
                    action: 'surprise',
                    excludeIds: recentIds,
                    surprise: true,
                  })
                }
                values={structuredDraft}
              />
            ) : (
              <MuseBubblePanel
                activeAction={activeAction}
                canGenerate={canGenerateBubble}
                canReroll={Boolean(result?.recommendations.length)}
                deck={bubbleDeck}
                derivedInput={bubbleInput}
                focus={bubbleDraft.focus}
                isLoading={isLoading}
                onDismissBubble={dismissBubble}
                onGenerate={() => requestRecommendation({ action: 'generate' })}
                onRefreshDeck={refreshBubbleDeck}
                onReroll={() =>
                  requestRecommendation({ action: 'reroll', excludeIds: recentIds })
                }
                onSetFocus={changeBubbleFocus}
                onSpark={handleBubbleSpark}
                onSurprise={() =>
                  requestRecommendation({
                    action: 'surprise',
                    excludeIds: recentIds,
                    surprise: true,
                  })
                }
                onToggleBubble={toggleBubble}
                selectedBubbles={selectedBubbles}
              />
            )}
          </motion.section>
        ) : (
          <motion.section
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="resultStage"
            exit={{ opacity: 0, scale: 0.985, y: 18 }}
            initial={{ opacity: 0, scale: 0.98, y: 24 }}
            key="result_stage"
            transition={{ duration: 0.34, ease: 'easeOut' }}
          >
            <ResultsPanel
              activeAction={activeAction}
              error={error}
              isLoading={isLoading}
              lastCompletedAction={lastCompletedAction}
              museCardState={museCardState}
              onExpandMuseCard={() => setMuseCardState('expanded')}
              onMinimizeMuseCard={() => setMuseCardState('minimized')}
              onRevealMuseCard={() => setMuseCardState('expanded')}
              result={deferredResult}
            />
            <FloatingControlPanel
              activeAction={activeAction}
              canReroll={Boolean(result?.recommendations.length)}
              isLoading={isLoading}
              onBackHome={handleBackHome}
              onReroll={() =>
                requestRecommendation({ action: 'reroll', excludeIds: recentIds })
              }
              onToggleTune={() =>
                setViewState((current) =>
                  current === 'tuning' ? 'result_view' : 'tuning',
                )
              }
              onTuneModifier={handleTuneModifier}
              viewState={viewState}
            />
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
