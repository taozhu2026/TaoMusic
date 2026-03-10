import type {
  MusicCandidate,
  QueryPlan,
} from '@/src/features/recommendations/types';

export interface MusicProvider {
  name: string;
  fetchCandidates(plan: QueryPlan): Promise<MusicCandidate[]>;
}
