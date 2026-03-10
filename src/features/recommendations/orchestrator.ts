import { mapContextToProfile } from '@/src/features/recommendations/context-mapper';
import { selectDiverseRecommendations } from '@/src/features/recommendations/diversity';
import { scoreCandidates } from '@/src/features/recommendations/scorer';
import { generateSerendipityLine } from '@/src/services/llm/serendipity';
import { getMusicProviders } from '@/src/services/music-provider';
import { SeedMusicProvider } from '@/src/services/music-provider/seed';

import type {
  MusicCandidate,
  QueryPlan,
  RecommendationInput,
  RecommendationResponse,
} from '@/src/features/recommendations/types';

const buildQueryPlan = (input: ReturnType<typeof mapContextToProfile>): QueryPlan => {
  const primaryTerms = [
    ...input.genrePreference.slice(0, 2),
    input.regionPreference,
  ].filter(Boolean) as string[];
  const secondaryTerms = [
    ...input.activityTags,
    ...input.moodTags,
    ...input.colorTags,
    ...input.lyricalThemeTags,
  ];

  return {
    primaryTerms,
    secondaryTerms,
    genre: input.raw.genre,
    region: input.regionPreference,
    limit: 18,
  };
};

const deduplicateCandidates = (candidates: MusicCandidate[]): MusicCandidate[] => {
  const seenKeys = new Set<string>();

  return candidates.filter((candidate) => {
    const key = `${candidate.title}:${candidate.artist}`.toLowerCase();

    if (seenKeys.has(key)) {
      return false;
    }

    seenKeys.add(key);
    return true;
  });
};

export const createRecommendation = async (
  input: RecommendationInput,
): Promise<RecommendationResponse> => {
  const startedAt = Date.now();
  const contextProfile = mapContextToProfile(input);
  const queryPlan = buildQueryPlan(contextProfile);
  const providers = getMusicProviders();

  const providerResults = await Promise.all(
    providers.map(async (provider) => ({
      provider: provider.name,
      candidates: await provider.fetchCandidates(queryPlan),
    })),
  );

  let candidates = deduplicateCandidates(
    providerResults.flatMap((result) => result.candidates),
  );

  if (candidates.length === 0) {
    const fallbackProvider = new SeedMusicProvider();
    candidates = await fallbackProvider.fetchCandidates(queryPlan);
  }

  const ranked = scoreCandidates(
    candidates,
    contextProfile,
    input.excludeIds,
    input.rerollSeed,
  );
  const recommendations = selectDiverseRecommendations(ranked, 3);
  const serendipity = await generateSerendipityLine(contextProfile, recommendations);

  return {
    contextProfile,
    recommendations,
    serendipity,
    debug: {
      appliedSurprise: contextProfile.surpriseLabel,
      providerUsed: providerResults.map((result) => result.provider).join(', '),
      latencyMs: Date.now() - startedAt,
      candidateCount: candidates.length,
    },
  };
};
