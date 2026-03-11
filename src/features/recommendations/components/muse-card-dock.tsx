import { AnimatePresence, motion } from 'framer-motion';

import { ShareActions } from '@/src/features/recommendations/components/share-actions';
import { ShareCardPreview } from '@/src/features/recommendations/components/share-card-preview';

import type { MuseCardState } from '@/src/features/recommendations/experience-types';
import type { RecommendationResponse } from '@/src/features/recommendations/types';

interface MuseCardDockProps {
  result: RecommendationResponse;
  state: MuseCardState;
  onExpand: () => void;
  onMinimize: () => void;
  onReveal: () => void;
}

export function MuseCardDock({
  result,
  state,
  onExpand,
  onMinimize,
  onReveal,
}: MuseCardDockProps) {
  const isExpanded = state === 'expanded';
  const isMinimized = state === 'minimized';

  return (
    <section className="museCardZone">
      {state === 'hidden' ? (
        <button className="museCardTrigger" onClick={onReveal} type="button">
          <span className="museCardTriggerLabel">Reveal Muse Card</span>
          <span className="museCardTriggerText">
            Distill this constellation into a compact card for sharing or saving.
          </span>
        </button>
      ) : null}

      {isMinimized ? (
        <button className="museCardDock" onClick={onExpand} type="button">
          Reopen Muse Card
        </button>
      ) : null}

      <AnimatePresence initial={false}>
        {isExpanded ? (
          <motion.div
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            className="museCardExpanded"
            exit={{ opacity: 0, height: 0, y: 16 }}
            initial={{ opacity: 0, height: 0, y: 16 }}
            layout
            transition={{ duration: 0.32, ease: 'easeOut' }}
          >
            <div className="museCardExpandedHeader">
              <div>
                <p className="manifestoLabel">Muse card</p>
                <p className="helperText">
                  Screen-ready summary with the poetic line and the current three picks.
                </p>
              </div>
              <button className="museCardMinimize" onClick={onMinimize} type="button">
                Minimize
              </button>
            </div>
            <ShareCardPreview result={result} />
            <ShareActions result={result} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
