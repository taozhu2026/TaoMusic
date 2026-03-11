import { getUiCopy } from '@/src/i18n/copy';

import type { UiLanguage } from '@/src/i18n/types';
import type { RankedRecommendation } from '@/src/features/recommendations/types';

interface ResultCardProps {
  index: number;
  language: UiLanguage;
  recommendation: RankedRecommendation;
}

const formatTag = (value: string): string => {
  return value.replace(/-/g, ' ');
};

export function ResultCard({ index, language, recommendation }: ResultCardProps) {
  const { candidate, matchReasons } = recommendation;
  const confidence = Math.round(recommendation.score * 100);
  const copy = getUiCopy(language);

  return (
    <article className="resultCard" style={{ animationDelay: `${index * 80}ms` }}>
      <div className="resultCardHeader">
        <div className="resultIndexBlock">
          <span className="resultIndex">0{index + 1}</span>
          <span className="resultConfidence">{confidence}%</span>
        </div>
        <div className="resultMeta">
          <p className="resultTitle">{candidate.title}</p>
          <p className="resultArtist">{candidate.artist}</p>
          {candidate.album ? <p className="resultAlbum">{candidate.album}</p> : null}
        </div>
      </div>

      <div className="badgeRow">
        {candidate.region ? <span className="badge">{formatTag(candidate.region)}</span> : null}
        {candidate.language ? <span className="badge">{candidate.language}</span> : null}
        {candidate.genreTags.slice(0, 2).map((tag) => (
          <span className="badge" key={`${candidate.id}-${tag}`}>
            {formatTag(tag)}
          </span>
        ))}
      </div>

      <div className="resultNarrative">
        {matchReasons.length > 0 ? (
          matchReasons.map((reason) => (
            <span className="reasonPill" key={`${candidate.id}-${reason}`}>
              {reason}
            </span>
          ))
        ) : (
          <span className="reasonPill">{copy.result.matchFallback}</span>
        )}
      </div>

      <div className="resultFooter">
        <span className="resultSource">{candidate.source}</span>
        <span className="resultNovelty">
          {language === 'zh' ? '新鲜度' : 'novelty'} {Math.round(recommendation.noveltyScore * 100)}
        </span>
      </div>
    </article>
  );
}
