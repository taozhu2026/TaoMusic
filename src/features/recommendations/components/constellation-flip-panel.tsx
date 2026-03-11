'use client';

import { motion } from 'framer-motion';

import { getUiCopy } from '@/src/i18n/copy';
import {
  FIELD_OPTION_MAP,
  getOptionLabel,
} from '@/src/config/mappings';
import {
  buildResultSummaryText,
  buildResultSummaryTitle,
} from '@/src/features/recommendations/result-summary';
import { SignalSummary } from '@/src/features/recommendations/components/signal-summary';

import type { UiLanguage } from '@/src/i18n/types';
import type { RecommendationResponse } from '@/src/features/recommendations/types';

interface ConstellationFlipPanelProps {
  face: 'constellation' | 'muse';
  language: UiLanguage;
  onChangeFace: (face: 'constellation' | 'muse') => void;
  result: RecommendationResponse;
}

const buildMuseTags = (
  result: RecommendationResponse,
  language: UiLanguage,
): string[] => {
  const entries: Array<keyof typeof FIELD_OPTION_MAP> = [
    'mood',
    'genre',
    'scene',
    'country',
    'color',
  ];

  return entries
    .map((key) => {
      const value = result.contextProfile.raw[key];

      if (!value) {
        return null;
      }

      return getOptionLabel(FIELD_OPTION_MAP[key], value, language);
    })
    .filter((value): value is string => Boolean(value));
};

export function ConstellationFlipPanel({
  face,
  language,
  onChangeFace,
  result,
}: ConstellationFlipPanelProps) {
  const copy = getUiCopy(language);
  const summaryTitle = buildResultSummaryTitle(result, language);
  const summaryText = buildResultSummaryText(result, language);
  const museTags = buildMuseTags(result, language);

  return (
    <section className="flipPanel">
      <div className="flipPanelHeader">
        <div>
          <p className="eyebrow">{copy.result.currentConstellation}</p>
          <h2 className="resultsTitle">{summaryTitle}</h2>
        </div>
        <div className="flipPanelToggle">
          <button
            className={face === 'constellation' ? 'flipToggleActive' : ''}
            onClick={() => onChangeFace('constellation')}
            type="button"
          >
            {copy.result.turnConstellation}
          </button>
          <button
            className={face === 'muse' ? 'flipToggleActive' : ''}
            onClick={() => onChangeFace('muse')}
            type="button"
          >
            {copy.result.turnMuse}
          </button>
        </div>
      </div>

      <div className="flipPanelViewport">
        <motion.div
          animate={{ rotateY: face === 'muse' ? 180 : 0 }}
          className="flipPanelInner"
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flipFace flipFaceFront">
            <p className="resultsSummary">{summaryText}</p>
            <p className="resultsStatement">{result.serendipity.line}</p>
            <SignalSummary
              emptyText={copy.common.noSignal}
              language={language}
              title={copy.result.resultSummaryLabel}
              values={result.contextProfile.raw}
            />
          </div>

          <div className="flipFace flipFaceBack">
            <p className="manifestoLabel">{copy.result.museCardTitle}</p>
            <p className="resultsStatement">{result.serendipity.line}</p>
            <p className="helperText">{copy.result.museCardText}</p>
            <div className="museTagRow">
              {museTags.map((tag) => (
                <span className="reasonPill" key={tag}>
                  {tag.replace(/-/g, ' ')}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
