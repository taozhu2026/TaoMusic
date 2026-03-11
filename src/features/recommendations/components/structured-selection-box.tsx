'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';

import { getUiCopy } from '@/src/i18n/copy';
import { collectStructuredSelectionLabels } from '@/src/features/recommendations/components/structured-selection-summary';

import type { ReactNode } from 'react';
import type { UiLanguage } from '@/src/i18n/types';
import type { RecommendationInput } from '@/src/features/recommendations/types';

interface StructuredSelectionBoxProps {
  children: ReactNode;
  language: UiLanguage;
  values: RecommendationInput;
}

export function StructuredSelectionBox({
  children,
  language,
  values,
}: StructuredSelectionBoxProps) {
  const copy = getUiCopy(language);
  const [expanded, setExpanded] = useState(false);
  const labels = useMemo(
    () => collectStructuredSelectionLabels(values, language),
    [language, values],
  );
  const summary =
    labels.length > 0
      ? labels.length > 4
        ? `${labels.slice(0, 4).join(' · ')} +${labels.length - 4}`
        : labels.join(' · ')
      : copy.home.selectionBoxEmpty;

  return (
    <div className={['selectionBox', expanded ? 'selectionBox-open' : ''].filter(Boolean).join(' ')}>
      <button
        aria-expanded={expanded}
        className="selectionBoxTrigger"
        onClick={() => setExpanded((current) => !current)}
        type="button"
      >
        <div className="selectionBoxCopy">
          <p className="manifestoLabel">{copy.home.selectionBoxLabel}</p>
          <p className="selectionBoxSummary">{summary}</p>
        </div>
        <div className="selectionBoxMeta">
          <span className="selectionBoxCount">
            {labels.length} {copy.home.selectionBoxCountSuffix}
          </span>
          <span className="selectionBoxToggleLabel">
            {expanded ? copy.home.selectionBoxClose : copy.home.selectionBoxOpen}
          </span>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {expanded ? (
          <motion.div
            animate={{ height: 'auto', opacity: 1 }}
            className="selectionBoxBody"
            exit={{ height: 0, opacity: 0 }}
            initial={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            {children}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
