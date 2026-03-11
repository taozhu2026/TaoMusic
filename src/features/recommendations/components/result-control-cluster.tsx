'use client';

import { AnimatePresence, motion } from 'framer-motion';

import { Button } from '@/src/components/ui/button';
import { getUiCopy } from '@/src/i18n/copy';
import { SettingsPanel } from '@/src/features/recommendations/components/settings-panel';

import type { UiLanguage } from '@/src/i18n/types';
import type { RecommendationAction, TuneModifier } from '@/src/features/recommendations/experience-types';

type ResultPanelState = 'closed' | 'settings' | 'tune';

interface ResultControlClusterProps {
  activeAction: RecommendationAction | null;
  isLoading: boolean;
  language: UiLanguage;
  onBackHome: () => void;
  onReroll: () => void;
  onTuneModifier: (modifier: TuneModifier) => void;
  onTogglePanel: (panel: ResultPanelState) => void;
  panelState: ResultPanelState;
}

const TUNE_OPTIONS: TuneModifier[] = ['warmer', 'nocturnal', 'focused', 'surprising'];

export function ResultControlCluster({
  activeAction,
  isLoading,
  language,
  onBackHome,
  onReroll,
  onTogglePanel,
  onTuneModifier,
  panelState,
}: ResultControlClusterProps) {
  const copy = getUiCopy(language);

  return (
    <aside className="resultControlCluster">
      <div className="resultControlButtons">
        <Button disabled={isLoading} onClick={onReroll} type="button" variant="secondary">
          {activeAction === 'reroll' ? copy.common.rerolling : copy.common.reroll}
        </Button>
        <Button
          disabled={isLoading}
          onClick={() => onTogglePanel(panelState === 'tune' ? 'closed' : 'tune')}
          type="button"
          variant="secondary"
        >
          {panelState === 'tune' ? copy.common.closeTune : copy.common.tune}
        </Button>
        <Button
          disabled={isLoading}
          onClick={() => onTogglePanel(panelState === 'settings' ? 'closed' : 'settings')}
          type="button"
          variant="secondary"
        >
          {panelState === 'settings' ? copy.common.closeSettings : copy.common.settings}
        </Button>
        <Button disabled={isLoading} onClick={onBackHome} type="button" variant="ghost">
          {copy.common.backHome}
        </Button>
      </div>

      <AnimatePresence initial={false}>
        {panelState === 'tune' ? (
          <motion.div
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            className="resultControlDrawer"
            exit={{ opacity: 0, height: 0, y: -10 }}
            initial={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
          >
            <p className="manifestoLabel">{copy.result.quickTune}</p>
            <div className="resultControlChipRow">
              {TUNE_OPTIONS.map((option) => (
                <button
                  className="floatingTuneChip"
                  disabled={isLoading}
                  key={option}
                  onClick={() => onTuneModifier(option)}
                  type="button"
                >
                  {copy.tune[option]}
                </button>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {panelState === 'settings' ? (
          <motion.div
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            className="resultControlDrawer"
            exit={{ opacity: 0, height: 0, y: -10 }}
            initial={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
          >
            <SettingsPanel />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </aside>
  );
}
