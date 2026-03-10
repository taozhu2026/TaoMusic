import type {
  MusicCandidate,
  ProviderKind,
  QueryPlan,
} from '@/src/features/recommendations/types';

export interface MusicProvider {
  kind: ProviderKind;
  name: string;
  fetchCandidates(plan: QueryPlan): Promise<MusicCandidate[]>;
}
