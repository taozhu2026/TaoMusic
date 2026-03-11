import { motion } from 'framer-motion';

import { Button } from '@/src/components/ui/button';
import { SignalSummary } from '@/src/features/recommendations/components/signal-summary';
import type {
  BubbleFocus,
  MuseBubble,
} from '@/src/features/recommendations/bubbles/types';
import type {
  RecommendationAction,
} from '@/src/features/recommendations/experience-types';
import type { RecommendationInput } from '@/src/features/recommendations/types';

const FOCUS_OPTIONS: Array<{ label: string; value: BubbleFocus }> = [
  { label: 'Balanced', value: 'balanced' },
  { label: 'Warmer', value: 'warmer' },
  { label: 'Nocturnal', value: 'nocturnal' },
  { label: 'Focused', value: 'focused' },
  { label: 'Surprising', value: 'surprising' },
];

interface MuseBubblePanelProps {
  activeAction: RecommendationAction | null;
  canGenerate: boolean;
  canReroll: boolean;
  deck: MuseBubble[];
  derivedInput: RecommendationInput;
  focus: BubbleFocus;
  isLoading: boolean;
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

export function MuseBubblePanel({
  activeAction,
  canGenerate,
  canReroll,
  deck,
  derivedInput,
  focus,
  isLoading,
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

  return (
    <section className="heroPanel bubblePanel">
      <div className="heroCopy">
        <div className="heroLabelRow">
          <span className="heroLabelDot" aria-hidden="true" />
          <p className="heroLabel">Muse bubble mode</p>
        </div>
        <h1 className="heroTitle bubbleHeroTitle">Start with fragments, not fixed fields.</h1>
        <p className="heroText">
          Pick the atmosphere first. TaoMusic translates the bubbles into a clear
          signal before it builds the constellation.
        </p>
      </div>

      <div className="bubbleFocusStrip">
        {FOCUS_OPTIONS.map((option) => (
          <button
            className={[
              'bubbleFocusChip',
              focus === option.value ? 'bubbleFocusChip-active' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            key={option.value}
            onClick={() => onSetFocus(option.value)}
            type="button"
          >
            {option.label}
          </button>
        ))}
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
              <span className="bubbleCardLabel">{bubble.label}</span>
              <span className="bubbleCardNote">{bubble.note}</span>
            </button>
            <button
              aria-label={`Dismiss ${bubble.label}`}
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
          <p className="manifestoLabel">Selected bubbles</p>
          <span className="bubbleSelectionCount">{selectedBubbles.length} picked</span>
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
                {bubble.label}
              </button>
            ))
          ) : (
            <p className="helperText">Pick two or three bubbles to shape a clear direction.</p>
          )}
        </div>
        <SignalSummary title="Translated signal" values={derivedInput} />
      </div>

      <div className="actionsRow">
        <Button disabled={!canGenerate || isLoading} onClick={onGenerate} type="button">
          {activeAction === 'generate' ? 'Composing...' : 'Generate from bubbles'}
        </Button>
        <Button disabled={isLoading} onClick={onSpark} type="button" variant="secondary">
          Spark
        </Button>
        <Button disabled={isLoading} onClick={onRefreshDeck} type="button" variant="secondary">
          Refresh set
        </Button>
        <Button disabled={!canGenerate || isLoading} onClick={onSurprise} type="button" variant="ghost">
          {activeAction === 'surprise' ? 'Detouring...' : 'Add surprise'}
        </Button>
        <Button
          disabled={!canReroll || isLoading}
          onClick={onReroll}
          type="button"
          variant="ghost"
        >
          {activeAction === 'reroll' ? 'Rerolling...' : 'Reroll'}
        </Button>
      </div>
    </section>
  );
}
