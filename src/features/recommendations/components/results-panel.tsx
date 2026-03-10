import { ShareActions } from '@/src/features/recommendations/components/share-actions';
import { ResultCard } from '@/src/features/recommendations/components/result-card';
import { SignalSummary } from '@/src/features/recommendations/components/signal-summary';

import type { RecommendationResponse } from '@/src/features/recommendations/types';

interface ResultsPanelProps {
  error: string | null;
  isLoading: boolean;
  result: RecommendationResponse | null;
}

function LoadingState() {
  return (
    <section className="resultsPanel loadingPanel">
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

export function ResultsPanel({ error, isLoading, result }: ResultsPanelProps) {
  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState />;
  }

  if (!result) {
    return <EmptyState />;
  }

  return (
    <section className="resultsPanel">
      <div className="resultsHeader">
        <div className="resultsIntro">
          <div>
            <p className="eyebrow">Generated constellation</p>
            <h2 className="resultsTitle">{result.serendipity.line}</h2>
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

        <div className="badgeRow">
          {result.debug.appliedSurprise ? (
            <span className="badge accentBadge">{result.debug.appliedSurprise}</span>
          ) : null}
          <span className="badge">{result.serendipity.source}</span>
          <span className="badge">{result.contextProfile.tone}</span>
        </div>
      </div>

      <SignalSummary title="Interpreted signal" values={result.contextProfile.raw} />

      <ShareActions result={result} />

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
