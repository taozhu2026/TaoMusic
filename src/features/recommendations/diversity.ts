import type { RankedRecommendation } from '@/src/features/recommendations/types';

const dominantGenre = (recommendation: RankedRecommendation): string | undefined => {
  return recommendation.candidate.genreTags[0];
};

export const selectDiverseRecommendations = (
  ranked: RankedRecommendation[],
  limit: number,
): RankedRecommendation[] => {
  const selected: RankedRecommendation[] = [];
  const seenArtists = new Set<string>();
  const seenGenres = new Map<string, number>();

  for (const recommendation of ranked) {
    if (selected.length === limit) {
      break;
    }

    const artistKey = recommendation.candidate.artist.toLowerCase();
    const genreKey = dominantGenre(recommendation) ?? 'unknown';
    const genreCount = seenGenres.get(genreKey) ?? 0;

    if (seenArtists.has(artistKey)) {
      continue;
    }

    if (genreCount >= 1 && selected.length < limit - 1) {
      continue;
    }

    selected.push(recommendation);
    seenArtists.add(artistKey);
    seenGenres.set(genreKey, genreCount + 1);
  }

  if (selected.length < limit) {
    for (const recommendation of ranked) {
      if (selected.length === limit) {
        break;
      }

      if (selected.some((item) => item.candidate.id === recommendation.candidate.id)) {
        continue;
      }

      selected.push(recommendation);
    }
  }

  return selected;
};
