import { mapContextToProfile } from '@/src/features/recommendations/context-mapper';
import { selectDiverseRecommendations } from '@/src/features/recommendations/diversity';
import { scoreCandidates } from '@/src/features/recommendations/scorer';
import { generateSerendipityLine } from '@/src/services/llm/serendipity';
import { getMusicProviders } from '@/src/services/music-provider';
import { SeedMusicProvider } from '@/src/services/music-provider/seed';

import type {
  MusicCandidate,
  ProviderDebugSummary,
  ProviderKind,
  ProviderStatus,
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

const buildProviderUsedLabel = (providers: ProviderDebugSummary[]): string => {
  const successful = providers.filter(
    (provider) => provider.status === 'success' && provider.candidateCount > 0,
  );

  if (successful.length === 0) {
    return 'seed-library fallback';
  }

  return successful.map((provider) => provider.name).join(' + ');
};

interface ProviderFetchResult {
  candidates: MusicCandidate[];
  kind: ProviderKind;
  message?: string;
  provider: string;
  status: ProviderStatus;
}

export const createRecommendation = async (
  input: RecommendationInput,
): Promise<RecommendationResponse> => {
  const startedAt = Date.now();
  const contextProfile = mapContextToProfile(input);
  const queryPlan = buildQueryPlan(contextProfile);
  const providers = getMusicProviders();

  const providerResults: ProviderFetchResult[] = await Promise.all(
    providers.map(async (provider) => {
      try {
        const candidates = await provider.fetchCandidates(queryPlan);

        return {
          candidates,
          kind: provider.kind,
          provider: provider.name,
          status: 'success' as const,
        };
      } catch (error) {
        return {
          candidates: [],
          kind: provider.kind,
          message: error instanceof Error ? error.message : 'Unknown provider error.',
          provider: provider.name,
          status: 'failed' as const,
        };
      }
    }),
  );

  let candidates = deduplicateCandidates(
    providerResults.flatMap((result) => result.candidates),
  );

  if (candidates.length === 0) {
    const fallbackProvider = new SeedMusicProvider();
    candidates = await fallbackProvider.fetchCandidates(queryPlan);
    providerResults.push({
      candidates,
      kind: fallbackProvider.kind,
      message: 'Fallback seed library applied after external retrieval returned nothing.',
      provider: `${fallbackProvider.name}-recovery`,
      status: 'success',
    });
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
      providerUsed: buildProviderUsedLabel(
        providerResults.map((result) => ({
          candidateCount: result.candidates.length,
          kind: result.kind,
          message: result.message,
          name: result.provider,
          status: result.status,
        })),
      ),
      providers: providerResults.map((result) => ({
        candidateCount: result.candidates.length,
        kind: result.kind,
        message: result.message,
        name: result.provider,
        status: result.status,
      })),
      latencyMs: Date.now() - startedAt,
      candidateCount: candidates.length,
    },
  };
};
