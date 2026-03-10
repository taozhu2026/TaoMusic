export type EnergyLevel = 'low' | 'medium' | 'high';
export type FocusLevel = 'focus' | 'balanced' | 'expressive';

export interface RecommendationInput {
  activity?: string;
  color?: string;
  country?: string;
  genre?: string;
  lyricalTheme?: string;
  mood?: string;
  surprise?: boolean;
  rerollSeed?: string;
  excludeIds?: string[];
}

export interface ContextProfile {
  raw: RecommendationInput;
  activityTags: string[];
  moodTags: string[];
  colorTags: string[];
  genrePreference: string[];
  lyricalThemeTags: string[];
  derivedTags: string[];
  regionPreference?: string;
  energyLevel?: EnergyLevel;
  focusLevel?: FocusLevel;
  tone: string;
  surpriseLabel?: string;
}

export interface QueryPlan {
  primaryTerms: string[];
  secondaryTerms: string[];
  genre?: string;
  region?: string;
  limit: number;
}

export interface MusicCandidate {
  id: string;
  title: string;
  artist: string;
  album?: string;
  genreTags: string[];
  moodTags: string[];
  region?: string;
  instrumentationTags: string[];
  lyricalThemeTags: string[];
  artworkColorHint?: string;
  popularity?: number;
  energyLevel?: EnergyLevel;
  focusLevel?: FocusLevel;
  searchKeywords: string[];
  artworkUrl?: string;
  source: string;
}

export interface RankedRecommendation {
  candidate: MusicCandidate;
  score: number;
  noveltyScore: number;
  matchReasons: string[];
}

export type ProviderKind = 'external' | 'fallback';
export type ProviderStatus = 'success' | 'failed';

export interface ProviderDebugSummary {
  candidateCount: number;
  kind: ProviderKind;
  message?: string;
  name: string;
  status: ProviderStatus;
}

export interface SerendipityOutput {
  line: string;
  tone: string;
  source: 'llm' | 'template';
}

export interface RecommendationResponse {
  contextProfile: ContextProfile;
  recommendations: RankedRecommendation[];
  serendipity: SerendipityOutput;
  debug: {
    appliedSurprise?: string;
    providerUsed: string;
    providers: ProviderDebugSummary[];
    latencyMs: number;
    candidateCount: number;
  };
}
