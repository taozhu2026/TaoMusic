import type { RecommendationAction } from '@/src/features/recommendations/components/context-form';
import {
  buildResultSummaryText,
  buildResultSummaryTitle,
} from '@/src/features/recommendations/result-summary';
import { ResultCard } from '@/src/features/recommendations/components/result-card';
import { ShareActions } from '@/src/features/recommendations/components/share-actions';
import { ShareCardPreview } from '@/src/features/recommendations/components/share-card-preview';
import { SignalSummary } from '@/src/features/recommendations/components/signal-summary';

import type { RecommendationResponse } from '@/src/features/recommendations/types';

interface ResultsPanelProps {
  activeAction: RecommendationAction | null;
  error: string | null;
  isLoading: boolean;
  lastCompletedAction: RecommendationAction | null;
  result: RecommendationResponse | null;
}

function LoadingState({ action }: { action: RecommendationAction | null }) {
  const loadingCopy =
    action === 'reroll'
      ? {
          label: 'Reroll in motion',
          title: 'Keeping the signal, moving the orbit.',
          text: 'TaoMusic is avoiding your recent picks and searching for a nearby drift.',
        }
      : action === 'surprise'
        ? {
            label: 'Detour in motion',
            title: 'Adding one unexpected angle.',
            text: 'The system is blending your core mood with a small scenic deviation.',
          }
        : {
            label: 'Listening',
            title: 'Shaping a first constellation.',
            text: 'TaoMusic is reading the moment, the color, and the atmosphere around it.',
          };

  return (
    <section className="resultsPanel loadingPanel">
      <p className="eyebrow">{loadingCopy.label}</p>
      <h2 className="resultsTitle">{loadingCopy.title}</h2>
      <p className="helperText">{loadingCopy.text}</p>
      <div className="skeletonHero" />
      <div className="cardsGrid">
        {[0, 1, 2].map((index) => (
          <div className="resultCard skeletonCard" key={index} />
        ))}
      </div>
    </section>
  );
}

function EmptyState() {
  return (
    <section className="resultsPanel emptyPanel">
      <p className="eyebrow">Example drift</p>
      <h2 className="resultsTitle">late-night work + blue + France</h2>
      <p className="serendipityLine resultsStatement">
        A quiet blue piano drifting through the margins of a long night.
      </p>
      <p className="helperText">
        Generate a first result, then use reroll to nudge the constellation without
        rewriting the whole mood.
      </p>
    </section>
  );
}

function ErrorState() {
  return (
    <section className="resultsPanel errorPanel">
      <p className="eyebrow">No clean signal</p>
      <h2 className="resultsTitle">TaoMusic could not shape a good result this time.</h2>
      <p className="helperText">
        Try widening the vibe, removing one constraint, or use surprise for a looser
        first pass.
      </p>
    </section>
  );
}

export function ResultsPanel({
  activeAction,
  error,
  isLoading,
  lastCompletedAction,
  result,
}: ResultsPanelProps) {
  if (isLoading) {
    return <LoadingState action={activeAction} />;
  }

  if (error) {
    return <ErrorState />;
  }

  if (!result) {
    return <EmptyState />;
  }

  const actionLabel =
    lastCompletedAction === 'reroll'
      ? 'rerolled around current signal'
      : lastCompletedAction === 'surprise'
        ? 'surprise detour applied'
        : undefined;
  const summaryTitle = buildResultSummaryTitle(result);
  const summaryText = buildResultSummaryText(result);

  return (
    <section className="resultsPanel">
      <div className="resultsHeader">
        <div className="resultsIntro">
          <div className="resultsSummaryBlock">
            <p className="eyebrow">Current constellation</p>
            <h2 className="resultsTitle resultsTitleCompact">{summaryTitle}</h2>
            <p className="resultsSummary">{summaryText}</p>
          </div>
          <div className="resultsLedger">
            <div className="ledgerItem">
              <span className="ledgerLabel">Source</span>
              <span className="ledgerValue">{result.debug.providerUsed}</span>
            </div>
            <div className="ledgerItem">
              <span className="ledgerLabel">Latency</span>
              <span className="ledgerValue">{result.debug.latencyMs} ms</span>
            </div>
            <div className="ledgerItem">
              <span className="ledgerLabel">Picks</span>
              <span className="ledgerValue">{result.recommendations.length}</span>
            </div>
          </div>
        </div>

        <div className="resultsMetaStack">
          <div className="badgeRow">
            {actionLabel ? <span className="badge accentBadge">{actionLabel}</span> : null}
            {result.debug.appliedSurprise ? (
              <span className="badge accentBadge">{result.debug.appliedSurprise}</span>
            ) : null}
            <span className="badge">{result.serendipity.source}</span>
            <span className="badge">{result.contextProfile.tone}</span>
          </div>

          <div className="providerBadgeRow">
            {result.debug.providers.map((provider) => (
              <span
                className={[
                  'providerBadge',
                  `providerBadge-${provider.kind}`,
                  `providerBadge-${provider.status}`,
                ].join(' ')}
                key={`${provider.name}-${provider.status}`}
              >
                {provider.name} · {provider.status}
              </span>
            ))}
          </div>
        </div>
      </div>

      <ShareCardPreview result={result} />
      <ShareActions result={result} />
      <SignalSummary title="Interpreted signal" values={result.contextProfile.raw} />

      <div className="cardsGrid">
        {result.recommendations.map((recommendation, index) => (
          <ResultCard
            index={index}
            key={recommendation.candidate.id}
            recommendation={recommendation}
          />
        ))}
      </div>
    </section>
  );
}
