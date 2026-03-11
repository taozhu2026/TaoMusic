import type { UiLanguage } from '@/src/i18n/types';

export type EnergyLevel = 'low' | 'medium' | 'high';
export type FocusLevel = 'focus' | 'balanced' | 'expressive';
export type TempoTag = 'slow' | 'steady' | 'midtempo' | 'driving' | 'fast';
export type ValenceTag = 'dim' | 'soft' | 'bright' | 'uplifting';

export interface RecommendationInput {
  activity?: string;
  color?: string;
  country?: string;
  excludeIds?: string[];
  genre?: string;
  lyricalTheme?: string;
  mood?: string;
  rerollSeed?: string;
  scene?: string;
  surprise?: boolean;
  uiLanguage?: UiLanguage;
}

export type RecommendationField = keyof RecommendationInput;

export interface ContextProfile {
  activityTags: string[];
  colorTags: string[];
  derivedTags: string[];
  energyLevel?: EnergyLevel;
  focusLevel?: FocusLevel;
  genrePreference: string[];
  lyricalThemeTags: string[];
  moodTags: string[];
  raw: RecommendationInput;
  regionPreference?: string;
  sceneTags: string[];
  surpriseLabel?: string;
  tone: string;
}

export interface QueryPlan {
  genre?: string;
  limit: number;
  primaryTerms: string[];
  region?: string;
  secondaryTerms: string[];
}

export interface MusicCandidate {
  album?: string;
  artist: string;
  artworkColorHint?: string;
  artworkUrl?: string;
  energyLevel?: EnergyLevel;
  focusLevel?: FocusLevel;
  genreTags: string[];
  id: string;
  instrumentationTags: string[];
  language?: string;
  lyricalThemeTags: string[];
  moodTags: string[];
  popularity?: number;
  region?: string;
  sceneTags?: string[];
  searchKeywords: string[];
  source: string;
  tempoTag?: TempoTag;
  title: string;
  valenceTag?: ValenceTag;
  year?: number;
}

export interface RankedRecommendation {
  candidate: MusicCandidate;
  matchReasons: string[];
  noveltyScore: number;
  score: number;
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
  source: 'llm' | 'template';
  tone: string;
}

export interface RecommendationResponse {
  contextProfile: ContextProfile;
  debug: {
    appliedSurprise?: string;
    candidateCount: number;
    latencyMs: number;
    providerUsed: string;
    providers: ProviderDebugSummary[];
  };
  recommendations: RankedRecommendation[];
  serendipity: SerendipityOutput;
}
