import { motion } from 'framer-motion';

import { Button } from '@/src/components/ui/button';
import { getUiCopy } from '@/src/i18n/copy';
import { localizeText } from '@/src/config/mappings';
import { SignalSummary } from '@/src/features/recommendations/components/signal-summary';

import type { UiLanguage } from '@/src/i18n/types';
import type {
  BubbleFocus,
  MuseBubble,
} from '@/src/features/recommendations/bubbles/types';
import type { RecommendationAction } from '@/src/features/recommendations/experience-types';
import type { RecommendationInput } from '@/src/features/recommendations/types';

interface MuseBubblePanelProps {
  activeAction: RecommendationAction | null;
  canGenerate: boolean;
  canReroll: boolean;
  deck: MuseBubble[];
  derivedInput: RecommendationInput;
  focus: BubbleFocus;
  isLoading: boolean;
  language: UiLanguage;
  onDismissBubble: (bubbleId: string) => void;
  onGenerate: () => void;
  onRefreshDeck: () => void;
  onReroll: () => void;
  onSetFocus: (focus: BubbleFocus) => void;
  onSpark: () => void;
  onSurprise: () => void;
  onToggleBubble: (bubbleId: string) => void;
  selectedBubbles: MuseBubble[];
}

const FOCUS_ORDER: BubbleFocus[] = [
  'balanced',
  'warmer',
  'nocturnal',
  'focused',
  'surprising',
];

export function MuseBubblePanel({
  activeAction,
  canGenerate,
  canReroll,
  deck,
  derivedInput,
  focus,
  isLoading,
  language,
  onDismissBubble,
  onGenerate,
  onRefreshDeck,
  onReroll,
  onSetFocus,
  onSpark,
  onSurprise,
  onToggleBubble,
  selectedBubbles,
}: MuseBubblePanelProps) {
  const selectedIds = new Set(selectedBubbles.map((bubble) => bubble.id));
  const copy = getUiCopy(language);

  return (
    <section className="heroPanel bubblePanel">
      <div className="heroCopy">
        <div className="heroLabelRow">
          <span className="heroLabelDot" aria-hidden="true" />
          <p className="heroLabel">{copy.home.bubbleLabel}</p>
        </div>
        <h1 className="heroTitle bubbleHeroTitle">{copy.home.bubbleTitle}</h1>
        <p className="heroText">{copy.home.bubbleDescription}</p>
      </div>

      <div className="bubbleFocusPanel">
        <p className="manifestoLabel">{copy.home.focusLabel}</p>
        <div className="bubbleFocusStrip">
          {FOCUS_ORDER.map((option) => (
            <button
              className={[
                'bubbleFocusChip',
                focus === option ? 'bubbleFocusChip-active' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              key={option}
              onClick={() => onSetFocus(option)}
              type="button"
            >
              {copy.bubbleFocus[option]}
            </button>
          ))}
        </div>
      </div>

      <div className="bubbleDeck">
        {deck.map((bubble, index) => {
          const isSelected = selectedIds.has(bubble.id);

          return (
            <motion.article
              animate={
                isLoading
                  ? isSelected
                    ? {
                        opacity: 1,
                        scale: 0.98,
                        x: (index - deck.length / 2) * -4,
                        y: -10,
                      }
                    : {
                        opacity: 0.34,
                        scale: 0.94,
                        y: 10,
                      }
                  : {
                      opacity: 1,
                      scale: isSelected ? 1.03 : 1,
                      y: [0, index % 2 === 0 ? -4 : 4, 0],
                    }
              }
              className={[
                'bubbleCard',
                `bubbleCard-${bubble.size}`,
                `bubbleCardFamily-${bubble.family}`,
                isSelected ? 'bubbleCard-selected' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              key={bubble.id}
              transition={
                isLoading
                  ? { duration: 0.24, ease: 'easeOut' }
                  : {
                      duration: 5.6 + index * 0.2,
                      ease: 'easeInOut',
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: 'mirror',
                    }
              }
              whileHover={
                isLoading
                  ? undefined
                  : {
                      scale: isSelected ? 1.05 : 1.04,
                      y: -8,
                    }
              }
            >
              <button
                className="bubbleCardMain"
                onClick={() => onToggleBubble(bubble.id)}
                type="button"
              >
                <span className="bubbleCardLabel">
                  {localizeText(bubble.label, language)}
                </span>
                <span className="bubbleCardNote">{localizeText(bubble.note, language)}</span>
              </button>
              <button
                aria-label={
                  language === 'zh'
                    ? `移除 ${localizeText(bubble.label, language)}`
                    : `Dismiss ${localizeText(bubble.label, language)}`
                }
                className="bubbleDismiss"
                onClick={() => onDismissBubble(bubble.id)}
                type="button"
              >
                ×
              </button>
            </motion.article>
          );
        })}
      </div>

      <div className="bubbleSelectionPanel">
        <div className="bubbleSelectionHeader">
          <p className="manifestoLabel">{copy.home.selectedBubbles}</p>
          <span className="bubbleSelectionCount">
            {selectedBubbles.length} {copy.home.pickedSuffix}
          </span>
        </div>
        <div className="bubbleSelectionRow">
          {selectedBubbles.length ? (
            selectedBubbles.map((bubble) => (
              <button
                className="selectedBubblePill"
                key={bubble.id}
                onClick={() => onToggleBubble(bubble.id)}
                type="button"
              >
                {localizeText(bubble.label, language)}
              </button>
            ))
          ) : (
            <p className="helperText">{copy.home.emptyBubbleSelection}</p>
          )}
        </div>
        <SignalSummary
          emptyText={copy.common.noSignal}
          language={language}
          title={copy.home.translatedSignal}
          values={derivedInput}
        />
      </div>

      <div className="actionsRow">
        <Button disabled={!canGenerate || isLoading} onClick={onGenerate} type="button">
          {activeAction === 'generate' ? copy.common.composing : copy.home.generateFromBubbles}
        </Button>
        <Button disabled={isLoading} onClick={onSpark} type="button" variant="secondary">
          {copy.common.spark}
        </Button>
        <Button disabled={isLoading} onClick={onRefreshDeck} type="button" variant="secondary">
          {copy.home.refreshSet}
        </Button>
        <Button
          disabled={!canGenerate || isLoading}
          onClick={onSurprise}
          type="button"
          variant="ghost"
        >
          {activeAction === 'surprise' ? copy.common.detouring : copy.common.addSurprise}
        </Button>
        <Button
          disabled={!canReroll || isLoading}
          onClick={onReroll}
          type="button"
          variant="ghost"
        >
          {activeAction === 'reroll' ? copy.common.rerolling : copy.common.reroll}
        </Button>
      </div>
    </section>
  );
}
