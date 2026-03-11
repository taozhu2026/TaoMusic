'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { TaoMusicLockup } from '@/src/brand/taomusic-logo';
import { createStableId } from '@/src/lib/id';
import { getUiCopy } from '@/src/i18n/copy';
import { usePreferences } from '@/src/providers/preferences-provider';
import {
  buildBubbleDeck,
  buildBubbleInput,
  buildBubbleSparkSelection,
  getSelectedBubbles,
} from '@/src/features/recommendations/bubbles/engine';
import { createBubbleDraft } from '@/src/features/recommendations/bubbles/drafts';
import {
  ContextForm,
  STRUCTURED_PRESETS,
} from '@/src/features/recommendations/components/context-form';
import { ModeSwitch } from '@/src/features/recommendations/components/mode-switch';
import { MuseBubblePanel } from '@/src/features/recommendations/components/muse-bubble-panel';
import { PreferenceToggles } from '@/src/features/recommendations/components/preference-toggles';
import { PresetStrip } from '@/src/features/recommendations/components/preset-strip';
import { HomeSignalPanel } from '@/src/features/recommendations/components/home-signal-panel';
import {
  loadHomeDrafts,
  saveHomeDrafts,
} from '@/src/features/recommendations/home-drafts';
import { hasUsableSignal } from '@/src/features/recommendations/spark';

import type {
  BubbleDraft,
  RecommendationAction,
  RecommendationMode,
} from '@/src/features/recommendations/experience-types';
import type { RecommendationPreset } from '@/src/features/recommendations/components/preset-strip';
import type { RecommendationPostResponse } from '@/src/features/recommendations/request-types';
import type { RecommendationInput } from '@/src/features/recommendations/types';

const EMPTY_FORM: RecommendationInput = {
  activity: '',
  color: '',
  country: '',
  genre: '',
  lyricalTheme: '',
  mood: '',
  scene: '',
};

export function HomeExperience() {
  const router = useRouter();
  const { language } = usePreferences();
  const copy = getUiCopy(language);

  const [structuredDraft, setStructuredDraft] = useState<RecommendationInput>(EMPTY_FORM);
  const [bubbleDraft, setBubbleDraft] = useState<BubbleDraft>(() => createBubbleDraft());
  const [mode, setMode] = useState<RecommendationMode>('structured');
  const [isLoading, setIsLoading] = useState(false);
  const [activeAction, setActiveAction] = useState<RecommendationAction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [draftsReady, setDraftsReady] = useState(false);

  useEffect(() => {
    const stored = loadHomeDrafts();

    if (!stored) {
      setDraftsReady(true);
      return;
    }

    setStructuredDraft(stored.structuredDraft);
    setBubbleDraft(stored.bubbleDraft);
    setMode(stored.mode);
    setDraftsReady(true);
  }, []);

  useEffect(() => {
    if (!draftsReady) {
      return;
    }

    saveHomeDrafts({
      bubbleDraft,
      mode,
      structuredDraft,
    });
  }, [bubbleDraft, draftsReady, mode, structuredDraft]);

  const selectedBubbles = useMemo(
    () => getSelectedBubbles(bubbleDraft.selectedIds),
    [bubbleDraft.selectedIds],
  );
  const bubbleInput = useMemo(
    () => buildBubbleInput(bubbleDraft.selectedIds),
    [bubbleDraft.selectedIds],
  );
  const bubbleDeck = useMemo(
    () =>
      buildBubbleDeck({
        dismissedIds: bubbleDraft.dismissedIds,
        focus: bubbleDraft.focus,
        seed: bubbleDraft.seed,
        selectedIds: bubbleDraft.selectedIds,
      }),
    [bubbleDraft.dismissedIds, bubbleDraft.focus, bubbleDraft.seed, bubbleDraft.selectedIds],
  );

  const canGenerateStructured = hasUsableSignal(structuredDraft);
  const canGenerateBubble = bubbleDraft.selectedIds.length > 0;

  const submitRecommendation = async ({
    action,
    surprise = false,
  }: {
    action: RecommendationAction;
    surprise?: boolean;
  }) => {
    const baseInput = mode === 'bubble' ? bubbleInput : structuredDraft;

    setActiveAction(action);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mode,
          input: {
            ...baseInput,
            rerollSeed: createStableId(),
            surprise,
            uiLanguage: language,
          },
          structuredDraft: {
            ...structuredDraft,
            uiLanguage: language,
          },
          bubbleDraft,
        }),
      });

      if (!response.ok) {
        throw new Error('recommendation_failed');
      }

      const payload = (await response.json()) as RecommendationPostResponse;
      router.push(`/result?id=${encodeURIComponent(payload.resultId)}`);
    } catch {
      setError(language === 'zh' ? '生成失败，请重试。' : 'Recommendation failed. Try again.');
    } finally {
      setActiveAction(null);
      setIsLoading(false);
    }
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
    setMode('structured');
    setError(null);
  };

  const handleBubbleSpark = () => {
    const seed = createStableId();
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
      selectedIds: current.selectedIds.includes(bubbleId)
        ? current.selectedIds.filter((id) => id !== bubbleId)
        : [...current.selectedIds, bubbleId].slice(-4),
    }));
  };

  const dismissBubble = (bubbleId: string) => {
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
      seed: createStableId(),
    }));
  };

  const supportStats = [
    language === 'zh' ? '400+ 本地曲目索引' : '400+ local catalog entries',
    language === 'zh' ? '中英双语界面' : 'English + Simplified Chinese UI',
    language === 'zh' ? 'light / dark / system' : 'light / dark / system themes',
  ];

  return (
    <div className="experienceScene homeScene">
      <header className="topBanner">
        <TaoMusicLockup subtitle={copy.brandSubtitle} />
        <div className="topBannerActions">
          <ModeSwitch disabled={isLoading} language={language} mode={mode} onChange={setMode} />
          <PreferenceToggles />
        </div>
      </header>

      <div className="homeLayout">
        <div className="inputColumn">
          {mode === 'structured' ? (
            <ContextForm
              activeAction={activeAction}
              canGenerate={canGenerateStructured}
              isLoading={isLoading}
              language={language}
              values={structuredDraft}
              onChange={handleStructuredChange}
              onGenerate={() => void submitRecommendation({ action: 'generate' })}
              onSurprise={() => void submitRecommendation({ action: 'surprise', surprise: true })}
            />
          ) : (
            <MuseBubblePanel
              activeAction={activeAction}
              canGenerate={canGenerateBubble}
              canReroll={false}
              deck={bubbleDeck}
              derivedInput={bubbleInput}
              focus={bubbleDraft.focus}
              isLoading={isLoading}
              language={language}
              onDismissBubble={dismissBubble}
              onGenerate={() => void submitRecommendation({ action: 'generate' })}
              onRefreshDeck={refreshBubbleDeck}
              onReroll={() => undefined}
              onSetFocus={(nextFocus) =>
                setBubbleDraft((current) => ({
                  ...current,
                  dismissedIds: [],
                  focus: nextFocus,
                  seed: createStableId(),
                }))
              }
              onSpark={handleBubbleSpark}
              onSurprise={() => void submitRecommendation({ action: 'surprise', surprise: true })}
              onToggleBubble={toggleBubble}
              selectedBubbles={selectedBubbles}
            />
          )}

          {error ? <p className="errorBanner">{error}</p> : null}
        </div>

        <aside className="homeSupportPanel">
          <div className="supportPanelCard">
            <p className="eyebrow">{language === 'zh' ? '本次版本' : 'This release'}</p>
            <h2 className="supportPanelTitle">v0.6</h2>
            <p className="supportPanelText">
              {language === 'zh'
                ? '首页只负责输入，结果单独进入 /result 路由。主题、语言和本地曲库都升成了全局能力。'
                : 'Home is now input-only, results live on /result, and theme, language, and the local catalog are all global capabilities.'}
            </p>
          </div>

          <div className="supportPanelCard supportPanelCard-muted">
            <p className="manifestoLabel">{language === 'zh' ? '基础能力' : 'Baseline capability'}</p>
            <div className="supportPanelList">
              {supportStats.map((item) => (
                <span className="supportStat" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </div>

          <PresetStrip
            language={language}
            onSelect={handlePreset}
            presets={STRUCTURED_PRESETS}
            text={copy.home.startingPointText}
            title={copy.home.startingPoints}
          />

          <HomeSignalPanel
            emptyText={copy.common.noSignal}
            language={language}
            title={mode === 'bubble' ? copy.home.translatedSignal : copy.home.pinnedSignal}
            values={mode === 'bubble' ? bubbleInput : structuredDraft}
          />
        </aside>
      </div>
    </div>
  );
}
