import { AnimatePresence, motion } from 'framer-motion';

import { Button } from '@/src/components/ui/button';

import type {
  ExperienceViewState,
  RecommendationAction,
  TuneModifier,
} from '@/src/features/recommendations/experience-types';

const TUNE_OPTIONS: Array<{ label: string; value: TuneModifier }> = [
  { label: 'Warmer', value: 'warmer' },
  { label: 'Nocturnal', value: 'nocturnal' },
  { label: 'More focused', value: 'focused' },
  { label: 'More surprising', value: 'surprising' },
];

interface FloatingControlPanelProps {
  activeAction: RecommendationAction | null;
  canReroll: boolean;
  isLoading: boolean;
  viewState: ExperienceViewState;
  onBackHome: () => void;
  onReroll: () => void;
  onToggleTune: () => void;
  onTuneModifier: (modifier: TuneModifier) => void;
}

export function FloatingControlPanel({
  activeAction,
  canReroll,
  isLoading,
  viewState,
  onBackHome,
  onReroll,
  onToggleTune,
  onTuneModifier,
}: FloatingControlPanelProps) {
  return (
    <motion.aside
      animate={{ opacity: 1, x: 0, y: 0 }}
      className="floatingControlPanel"
      initial={{ opacity: 0, x: 24, y: 24 }}
      transition={{ delay: 0.16, duration: 0.34, ease: 'easeOut' }}
    >
      <div className="floatingControlActions">
        <Button
          className="floatingControlButton"
          disabled={!canReroll || isLoading}
          onClick={onReroll}
          type="button"
          variant="secondary"
        >
          {activeAction === 'reroll' ? 'Rerolling...' : 'Reroll'}
        </Button>
        <Button
          className="floatingControlButton"
          disabled={isLoading}
          onClick={onToggleTune}
          type="button"
          variant="secondary"
        >
          {viewState === 'tuning' ? 'Close tune' : 'Tune'}
        </Button>
        <Button
          className="floatingControlButton"
          disabled={isLoading}
          onClick={onBackHome}
          type="button"
          variant="ghost"
        >
          Back to home
        </Button>
      </div>

      <AnimatePresence initial={false}>
        {viewState === 'tuning' ? (
          <motion.div
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            className="floatingTunePanel"
            exit={{ opacity: 0, height: 0, y: 8 }}
            initial={{ opacity: 0, height: 0, y: 8 }}
            transition={{ duration: 0.26, ease: 'easeOut' }}
          >
            <p className="floatingTuneLabel">Quick modifiers</p>
            <div className="floatingTuneRow">
              {TUNE_OPTIONS.map((option) => (
                <button
                  className="floatingTuneChip"
                  disabled={isLoading}
                  key={option.value}
                  onClick={() => onTuneModifier(option.value)}
                  type="button"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.aside>
  );
}
