import { SEED_CANDIDATES } from '@/data/seed-candidates';

import type {
  MusicCandidate,
  QueryPlan,
} from '@/src/features/recommendations/types';
import type { MusicProvider } from '@/src/services/music-provider/types';

const buildCandidateKeywords = (candidate: MusicCandidate): string[] => {
  return [
    candidate.title,
    candidate.artist,
    candidate.album,
    candidate.region,
    ...candidate.genreTags,
    ...candidate.moodTags,
    ...candidate.instrumentationTags,
    ...candidate.lyricalThemeTags,
    ...candidate.searchKeywords,
  ]
    .filter(Boolean)
    .map((value) => value!.toLowerCase());
};

export class SeedMusicProvider implements MusicProvider {
  name = 'seed-library';

  async fetchCandidates(plan: QueryPlan): Promise<MusicCandidate[]> {
    const queryTerms = [...plan.primaryTerms, ...plan.secondaryTerms].map((term) =>
      term.toLowerCase(),
    );

    if (queryTerms.length === 0) {
      return SEED_CANDIDATES.slice(0, plan.limit);
    }

    return [...SEED_CANDIDATES]
      .map((candidate) => {
        const keywords = buildCandidateKeywords(candidate);
        const keywordSet = new Set(keywords);
        const matchCount = queryTerms.filter((term) => keywordSet.has(term)).length;

        return {
          candidate,
          matchCount,
        };
      })
      .sort((left, right) => right.matchCount - left.matchCount)
      .map((result) => result.candidate)
      .slice(0, plan.limit);
  }
}
