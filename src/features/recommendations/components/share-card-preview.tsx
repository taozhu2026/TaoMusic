import { TaoMusicMark } from '@/src/brand/taomusic-logo';

import type { RecommendationResponse } from '@/src/features/recommendations/types';

interface ShareCardPreviewProps {
  result: RecommendationResponse;
}

const buildSignalTags = (result: RecommendationResponse): string[] => {
  const raw = result.contextProfile.raw;

  return [
    raw.activity,
    raw.mood,
    raw.color,
    raw.country,
    raw.genre,
    raw.lyricalTheme,
  ]
    .filter(Boolean)
    .map((value) => String(value).replace(/-/g, ' '));
};

export function ShareCardPreview({ result }: ShareCardPreviewProps) {
  const signalTags = buildSignalTags(result);

  return (
    <section className="shareCardSection">
      <div className="shareCardPreview" id="share-card">
        <div className="shareCardHeader">
          <div className="shareCardBrand">
            <span className="shareCardBrandMark" aria-hidden="true">
              <TaoMusicMark className="shareCardBrandSvg" />
            </span>
            <div>
              <p className="shareCardBrandName">TaoMusic</p>
              <p className="shareCardBrandTag">music muse card</p>
            </div>
          </div>
          <span className="shareCardTone">{result.contextProfile.tone}</span>
        </div>

        <p className="shareCardLine">{result.serendipity.line}</p>

        <div className="shareCardSignalRow">
          {signalTags.slice(0, 4).map((entry) => (
            <span className="shareCardSignal" key={entry}>
              {entry}
            </span>
          ))}
        </div>

        <div className="shareCardList">
          {result.recommendations.map((recommendation, index) => (
            <div className="shareCardItem" key={recommendation.candidate.id}>
              <span className="shareCardItemIndex">0{index + 1}</span>
              <div className="shareCardItemMeta">
                <p className="shareCardItemTitle">{recommendation.candidate.title}</p>
                <p className="shareCardItemArtist">{recommendation.candidate.artist}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
