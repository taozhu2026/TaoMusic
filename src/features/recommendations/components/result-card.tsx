import type { RankedRecommendation } from '@/src/features/recommendations/types';

interface ResultCardProps {
  index: number;
  recommendation: RankedRecommendation;
}

export function ResultCard({ index, recommendation }: ResultCardProps) {
  const { candidate, matchReasons } = recommendation;
  const confidence = Math.round(recommendation.score * 100);

  return (
    <article
      className="resultCard"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="resultCardHeader">
        <div className="resultIndexBlock">
          <span className="resultIndex">0{index + 1}</span>
          <span className="resultConfidence">{confidence}% fit</span>
        </div>
        <div className="resultMeta">
          <p className="resultTitle">{candidate.title}</p>
          <p className="resultArtist">{candidate.artist}</p>
        </div>
      </div>

      <div className="badgeRow">
        {candidate.album ? <span className="badge">{candidate.album}</span> : null}
        {candidate.region ? <span className="badge">{candidate.region.replace(/-/g, ' ')}</span> : null}
        {candidate.genreTags.slice(0, 2).map((tag) => (
          <span className="badge" key={`${candidate.id}-${tag}`}>
            {tag}
          </span>
        ))}
      </div>

      <div className="reasonRow">
        {matchReasons.length > 0 ? (
          matchReasons.map((reason) => (
            <span className="reasonPill" key={`${candidate.id}-${reason}`}>
              {reason}
            </span>
          ))
        ) : (
          <span className="reasonPill">serendipitous match</span>
        )}
      </div>

      <div className="resultFooter">
        <span className="resultSource">{candidate.source}</span>
        <span className="resultNovelty">
          novelty {Math.round(recommendation.noveltyScore * 100)}
        </span>
      </div>
    </article>
  );
}
