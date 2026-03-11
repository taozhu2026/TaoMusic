import { SCORE_WEIGHTS } from '@/src/config/weights';
import { seededJitter } from '@/src/lib/random';
import { uniqueStrings } from '@/src/lib/text';

import type {
  ContextProfile,
  MusicCandidate,
  RankedRecommendation,
} from '@/src/features/recommendations/types';

const overlapScore = (needle: string[], haystack: string[]): number => {
  if (needle.length === 0 || haystack.length === 0) {
    return 0;
  }

  const haystackSet = new Set(haystack);
  const matches = needle.filter((value) => haystackSet.has(value)).length;
  return matches / needle.length;
};

const regionScore = (candidate: MusicCandidate, profile: ContextProfile): number => {
  if (!profile.regionPreference || !candidate.region) {
    return 0;
  }

  return candidate.region === profile.regionPreference ? 1 : 0;
};

const energyFocusScore = (
  candidate: MusicCandidate,
  profile: ContextProfile,
): number => {
  let score = 0;

  if (profile.energyLevel && candidate.energyLevel === profile.energyLevel) {
    score += 0.6;
  }

  if (profile.focusLevel && candidate.focusLevel === profile.focusLevel) {
    score += 0.4;
  }

  return score;
};

const popularityNoveltyScore = (candidate: MusicCandidate): number => {
  if (!candidate.popularity) {
    return 0.6;
  }

  return 1 - Math.min(candidate.popularity / 100, 1);
};

const buildMatchReasons = (
  candidate: MusicCandidate,
  profile: ContextProfile,
): string[] => {
  const reasons: string[] = [];

  if (overlapScore(profile.genrePreference, candidate.genreTags) > 0) {
    reasons.push('genre aligned');
  }

  if (regionScore(candidate, profile) === 1) {
    reasons.push('country matched');
  }

  if (
    overlapScore(
      uniqueStrings([...profile.activityTags, ...profile.moodTags, ...profile.sceneTags]),
      uniqueStrings([...candidate.moodTags, ...candidate.instrumentationTags]),
    ) > 0.15
  ) {
    reasons.push('mood matched');
  }

  if (overlapScore(profile.sceneTags, candidate.moodTags) > 0) {
    reasons.push('scene aligned');
  }

  if (overlapScore(profile.lyricalThemeTags, candidate.lyricalThemeTags) > 0) {
    reasons.push('theme echoed');
  }

  if (profile.raw.color && candidate.artworkColorHint === profile.raw.color) {
    reasons.push('color resonance');
  }

  return reasons.slice(0, 3);
};

export const scoreCandidates = (
  candidates: MusicCandidate[],
  profile: ContextProfile,
  excludeIds: string[] = [],
  rerollSeed = 'taomusic-default-seed',
): RankedRecommendation[] => {
  const excludedIds = new Set(excludeIds);

  return candidates
    .filter((candidate) => !excludedIds.has(candidate.id))
    .map((candidate) => {
      const genreMatch = overlapScore(profile.genrePreference, candidate.genreTags);
      const activityMoodMatch = overlapScore(
        uniqueStrings([...profile.activityTags, ...profile.moodTags, ...profile.sceneTags]),
        uniqueStrings([...candidate.moodTags, ...candidate.instrumentationTags]),
      );
      const lyricalThemeMatch = overlapScore(
        profile.lyricalThemeTags,
        candidate.lyricalThemeTags,
      );
      const colorVibeMatch =
        profile.raw.color && candidate.artworkColorHint === profile.raw.color
          ? 1
          : overlapScore(profile.colorTags, candidate.moodTags);
      const energyFocusMatch = energyFocusScore(candidate, profile);
      const noveltyScore = popularityNoveltyScore(candidate);
      const seedBonus = seededJitter(rerollSeed, candidate.id) * 0.02;

      const score =
        genreMatch * SCORE_WEIGHTS.genreMatch +
        regionScore(candidate, profile) * SCORE_WEIGHTS.regionMatch +
        activityMoodMatch * SCORE_WEIGHTS.activityMoodMatch +
        lyricalThemeMatch * SCORE_WEIGHTS.lyricalThemeMatch +
        colorVibeMatch * SCORE_WEIGHTS.colorVibeMatch +
        energyFocusMatch * SCORE_WEIGHTS.energyFocusMatch +
        noveltyScore * SCORE_WEIGHTS.novelty +
        seedBonus;

      return {
        candidate,
        score,
        noveltyScore,
        matchReasons: buildMatchReasons(candidate, profile),
      };
    })
    .sort((left, right) => right.score - left.score);
};
