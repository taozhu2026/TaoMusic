import { z } from 'zod';

const optionalField = z
  .string()
  .trim()
  .max(40)
  .optional()
  .transform((value) => (value ? value : undefined));

export const recommendationDraftSchema = z.object({
  activity: optionalField,
  color: optionalField,
  country: optionalField,
  excludeIds: z.array(z.string().trim().max(120)).max(12).optional(),
  genre: optionalField,
  lyricalTheme: optionalField,
  mood: optionalField,
  rerollSeed: z.string().trim().max(120).optional(),
  scene: optionalField,
  surprise: z.boolean().optional().default(false),
  uiLanguage: z.enum(['en', 'zh']).optional(),
});

export const recommendationInputSchema = recommendationDraftSchema.refine(
  (value) =>
    Boolean(
      value.surprise ||
        value.activity ||
        value.color ||
        value.country ||
        value.genre ||
        value.lyricalTheme ||
        value.mood ||
        value.scene,
    ),
  {
    message: 'Provide at least one signal or use surprise mode.',
    path: ['activity'],
  },
);

export const bubbleDraftSchema = z.object({
  dismissedIds: z.array(z.string().trim().max(120)).max(48).default([]),
  focus: z.enum(['balanced', 'warmer', 'nocturnal', 'focused', 'surprising']),
  seed: z.string().trim().max(120),
  selectedIds: z.array(z.string().trim().max(120)).max(16),
});

export const recommendationRequestSchema = z.object({
  bubbleDraft: bubbleDraftSchema.optional(),
  input: recommendationInputSchema,
  mode: z.enum(['structured', 'bubble']).default('structured'),
  structuredDraft: recommendationDraftSchema.optional(),
});

export type RecommendationDraftPayload = z.infer<typeof recommendationDraftSchema>;
export type RecommendationInputPayload = z.infer<typeof recommendationInputSchema>;
export type BubbleDraftPayload = z.infer<typeof bubbleDraftSchema>;
export type RecommendationRequestSchemaPayload = z.infer<typeof recommendationRequestSchema>;
