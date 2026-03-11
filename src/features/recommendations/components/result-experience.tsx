'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { TaoMusicLockup } from '@/src/brand/taomusic-logo';
import { createStableId } from '@/src/lib/id';
import { getUiCopy } from '@/src/i18n/copy';
import { usePreferences } from '@/src/providers/preferences-provider';
import {
  buildBubbleInput,
} from '@/src/features/recommendations/bubbles/engine';
import {
  buildHydratedBubbleDraft,
} from '@/src/features/recommendations/bubbles/drafts';
import { ConstellationFlipPanel } from '@/src/features/recommendations/components/constellation-flip-panel';
import { ModeSwitch } from '@/src/features/recommendations/components/mode-switch';
import { ResultControlCluster } from '@/src/features/recommendations/components/result-control-cluster';
import { ResultCard } from '@/src/features/recommendations/components/result-card';
import {
  saveHomeDrafts,
} from '@/src/features/recommendations/home-drafts';
import {
  applyTuneModifier,
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
  RecommendationPostResponse,
  ResultFetchResponse,
} from '@/src/features/recommendations/request-types';
import type {
  RecommendationInput,
  RecommendationResponse,
} from '@/src/features/recommendations/types';

type ResultPanelState = 'closed' | 'settings' | 'tune';

interface ResultExperienceProps {
  initialResultId: string | null;
}

const EMPTY_FORM: RecommendationInput = {
  activity: '',
  color: '',
  country: '',
  genre: '',
  lyricalTheme: '',
  mood: '',
  scene: '',
};

export function ResultExperience({ initialResultId }: ResultExperienceProps) {
  const router = useRouter();
  const { language } = usePreferences();
  const copy = getUiCopy(language);

  const [resultId, setResultId] = useState(initialResultId);
  const [result, setResult] = useState<RecommendationResponse | null>(null);
  const [structuredDraft, setStructuredDraft] = useState<RecommendationInput>(EMPTY_FORM);
  const [bubbleDraft, setBubbleDraft] = useState<BubbleDraft | null>(null);
  const [mode, setMode] = useState<RecommendationMode>('structured');
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeAction, setActiveAction] = useState<RecommendationAction | null>(null);
  const [panelState, setPanelState] = useState<ResultPanelState>('closed');
  const [flipFace, setFlipFace] = useState<'constellation' | 'muse'>('constellation');
  const [expired, setExpired] = useState(false);

  const bubbleInput = useMemo(
    () => buildBubbleInput(bubbleDraft?.selectedIds ?? []),
    [bubbleDraft?.selectedIds],
  );

  useEffect(() => {
    const fetchResult = async () => {
      if (!resultId) {
        setExpired(true);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setExpired(false);

      try {
        const response = await fetch(`/api/result?id=${encodeURIComponent(resultId)}`, {
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error('result_expired');
        }

        const payload = (await response.json()) as ResultFetchResponse;
        const nextRecord = payload.record;
        const nextIds = nextRecord.result.recommendations.map((item) => item.candidate.id);

        setResult(nextRecord.result);
        setStructuredDraft(nextRecord.structuredDraft);
        setBubbleDraft(nextRecord.bubbleDraft);
        setMode(nextRecord.mode);
        setRecentIds((current) => [...new Set([...current, ...nextIds])].slice(-15));
        saveHomeDrafts({
          bubbleDraft: nextRecord.bubbleDraft,
          mode: nextRecord.mode,
          structuredDraft: nextRecord.structuredDraft,
        });
      } catch {
        setExpired(true);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchResult();
  }, [resultId]);

  const postRecommendation = async ({
    action,
    nextBubbleDraft,
    nextMode,
    nextStructuredDraft,
    surprise = false,
  }: {
    action: RecommendationAction;
    nextBubbleDraft: BubbleDraft;
    nextMode: RecommendationMode;
    nextStructuredDraft: RecommendationInput;
    surprise?: boolean;
  }) => {
    const input =
      nextMode === 'bubble'
        ? buildBubbleInput(nextBubbleDraft.selectedIds)
        : nextStructuredDraft;

    setIsLoading(true);
    setActiveAction(action);

    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mode: nextMode,
          input: {
            ...input,
            excludeIds: recentIds,
            rerollSeed: createStableId(),
            surprise,
            uiLanguage: language,
          },
          structuredDraft: {
            ...nextStructuredDraft,
            uiLanguage: language,
          },
          bubbleDraft: nextBubbleDraft,
        }),
      });

      if (!response.ok) {
        throw new Error('recommendation_failed');
      }

      const payload = (await response.json()) as RecommendationPostResponse;

      setStructuredDraft(nextStructuredDraft);
      setBubbleDraft(nextBubbleDraft);
      setMode(nextMode);
      setPanelState('closed');
      setFlipFace('constellation');
      setResultId(payload.resultId);
      router.replace(`/result?id=${encodeURIComponent(payload.resultId)}`);
    } catch {
      setIsLoading(false);
    } finally {
      setActiveAction(null);
    }
  };

  const handleModeChange = (nextMode: RecommendationMode) => {
    if (!result || !bubbleDraft || isLoading || nextMode === mode) {
      return;
    }

    if (nextMode === 'structured') {
      const nextStructuredDraft = hasUsableSignal(structuredDraft)
        ? structuredDraft
        : hasUsableSignal(bubbleInput)
          ? bubbleInput
          : result.contextProfile.raw;

      void postRecommendation({
        action: 'reroll',
        nextBubbleDraft: bubbleDraft,
        nextMode,
        nextStructuredDraft: {
          ...nextStructuredDraft,
          uiLanguage: language,
        },
      });
      return;
    }

    const nextBubbleDraft =
      bubbleDraft.selectedIds.length > 0
        ? {
            ...bubbleDraft,
            dismissedIds: [],
            seed: createStableId(),
          }
        : buildHydratedBubbleDraft(
            hasUsableSignal(structuredDraft) ? structuredDraft : result.contextProfile.raw,
            bubbleDraft.focus,
            bubbleDraft.selectedIds,
          );

    void postRecommendation({
      action: 'reroll',
      nextBubbleDraft,
      nextMode,
      nextStructuredDraft: structuredDraft,
    });
  };

  const handleReroll = () => {
    if (!bubbleDraft) {
      return;
    }

    void postRecommendation({
      action: 'reroll',
      nextBubbleDraft: {
        ...bubbleDraft,
        seed: createStableId(),
      },
      nextMode: mode,
      nextStructuredDraft: structuredDraft,
    });
  };

  const handleTuneModifier = (modifier: TuneModifier) => {
    if (!result || !bubbleDraft) {
      return;
    }

    if (mode === 'structured') {
      const nextStructuredDraft = applyTuneModifier(
        hasUsableSignal(structuredDraft) ? structuredDraft : result.contextProfile.raw,
        modifier,
      );

      void postRecommendation({
        action: modifier === 'surprising' ? 'surprise' : 'reroll',
        nextBubbleDraft: bubbleDraft,
        nextMode: 'structured',
        nextStructuredDraft,
        surprise: modifier === 'surprising',
      });
      return;
    }

    const nextFocus = modifierToBubbleFocus(modifier);
    const nextBubbleDraft =
      bubbleDraft.selectedIds.length > 0
        ? {
            ...bubbleDraft,
            dismissedIds: [],
            focus: nextFocus,
            seed: createStableId(),
          }
        : buildHydratedBubbleDraft(
            result.contextProfile.raw,
            nextFocus,
            bubbleDraft.selectedIds,
          );

    void postRecommendation({
      action: modifier === 'surprising' ? 'surprise' : 'reroll',
      nextBubbleDraft,
      nextMode: 'bubble',
      nextStructuredDraft: structuredDraft,
      surprise: modifier === 'surprising',
    });
  };

  const handleBackHome = () => {
    if (bubbleDraft) {
      saveHomeDrafts({
        bubbleDraft,
        mode,
        structuredDraft,
      });
    }

    router.push('/');
  };

  const headerMeta = result
    ? [
        `${copy.result.sourceLabel}: ${result.debug.providerUsed}`,
        `${copy.result.latencyLabel}: ${result.debug.latencyMs}ms`,
        `${copy.result.picksLabel}: ${result.recommendations.length}`,
      ]
    : [];

  return (
    <div className="experienceScene resultScene">
      <header className="resultPageHeader">
        <div className="resultPageHeaderMain">
          <TaoMusicLockup subtitle={copy.brandSubtitle} />
          <div className="resultHeaderMeta">
            <span className="metaChip">{copy.result.activityBadge}</span>
            <ModeSwitch
              disabled={isLoading}
              language={language}
              mode={mode}
              onChange={handleModeChange}
            />
          </div>
        </div>
        <ResultControlCluster
          activeAction={activeAction}
          isLoading={isLoading}
          language={language}
          onBackHome={handleBackHome}
          onReroll={handleReroll}
          onTogglePanel={setPanelState}
          onTuneModifier={handleTuneModifier}
          panelState={panelState}
        />
      </header>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.section
            animate={{ opacity: 1, y: 0 }}
            className="resultStatePanel"
            exit={{ opacity: 0, y: -12 }}
            initial={{ opacity: 0, y: 12 }}
            key="loading"
          >
            <p className="eyebrow">{copy.result.loadingLabel}</p>
            <h1 className="resultsTitle">{copy.result.loadingTitle}</h1>
            <p className="helperText">{copy.result.loadingText}</p>
          </motion.section>
        ) : expired || !result || !bubbleDraft ? (
          <motion.section
            animate={{ opacity: 1, y: 0 }}
            className="resultStatePanel"
            exit={{ opacity: 0, y: -12 }}
            initial={{ opacity: 0, y: 12 }}
            key="expired"
          >
            <p className="eyebrow">{copy.result.expiredLabel}</p>
            <h1 className="resultsTitle">{copy.result.expiredTitle}</h1>
            <p className="helperText">{copy.result.expiredText}</p>
            <div className="actionsRow">
              <button className="button button-primary" onClick={handleBackHome} type="button">
                {copy.common.backHome}
              </button>
            </div>
          </motion.section>
        ) : (
          <motion.section
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="resultRouteGrid"
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            initial={{ opacity: 0, scale: 0.98, y: 18 }}
            key="result"
            transition={{ duration: 0.28, ease: 'easeOut' }}
          >
            <div className="resultRouteLeft">
              <ConstellationFlipPanel
                face={flipFace}
                language={language}
                onChangeFace={setFlipFace}
                result={result}
              />
            </div>

            <div className="resultRouteRight">
              <div className="resultRailHeader">
                <div>
                  <p className="eyebrow">{copy.result.tracksLabel}</p>
                  <h2 className="resultsTitle resultsTitleCompact">
                    {headerMeta.length > 0 ? headerMeta[0] : copy.result.title}
                  </h2>
                </div>
                <div className="resultRailMeta">
                  {headerMeta.slice(1).map((item) => (
                    <span className="metaChip" key={item}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="resultRailCards">
                {result.recommendations.slice(0, 3).map((recommendation, index) => (
                  <ResultCard
                    index={index}
                    key={recommendation.candidate.id}
                    language={language}
                    recommendation={recommendation}
                  />
                ))}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
