import { buildSerendipityPrompt } from '@/src/features/recommendations/prompts';
import { generateTextCompletion } from '@/src/services/llm/client';
import { cleanModelText, sentenceCase } from '@/src/lib/text';

import type {
  ContextProfile,
  RankedRecommendation,
  SerendipityOutput,
} from '@/src/features/recommendations/types';

const buildFallbackLine = (
  profile: ContextProfile,
  picks: RankedRecommendation[],
): string => {
  const leadPick = picks[0]?.candidate;
  const activity = profile.raw.activity?.replace(/-/g, ' ') ?? 'this moment';
  const color = profile.raw.color ?? leadPick?.artworkColorHint ?? 'soft';
  const tone = profile.tone;

  if (!leadPick) {
    return 'A small invitation toward a mood you had not named yet.';
  }

  const templates = {
    dreamy: `A ${color} drift for ${activity}, carried softly by ${leadPick.artist}.`,
    electric: `${sentenceCase(activity)} meets a brighter pulse in ${leadPick.title}.`,
    nocturnal: `A ${color} hush for ${activity}, with ${leadPick.title} holding the room open.`,
    precise: `${leadPick.title} keeps ${activity} clear, quiet, and just a little luminous.`,
    quiet: `A restrained glow for ${activity}, shaped around ${leadPick.title}.`,
    reflective: `${leadPick.title} lets ${activity} linger at the edge of memory.`,
    warm: `${leadPick.title} brings a warm corner of light to ${activity}.`,
    open: `${leadPick.title} opens ${activity} into something wider and lighter.`,
  } as const;

  return templates[tone as keyof typeof templates] ?? templates.quiet;
};

export const generateSerendipityLine = async (
  profile: ContextProfile,
  picks: RankedRecommendation[],
): Promise<SerendipityOutput> => {
  const prompt = buildSerendipityPrompt(profile, picks);
  const generated = await generateTextCompletion(prompt);

  if (generated) {
    return {
      line: cleanModelText(generated),
      tone: profile.tone,
      source: 'llm',
    };
  }

  return {
    line: buildFallbackLine(profile, picks),
    tone: profile.tone,
    source: 'template',
  };
};
