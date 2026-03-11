import { z } from 'zod';

const optionalField = z
  .string()
  .trim()
  .max(40)
  .optional()
  .transform((value) => (value ? value : undefined));

export const recommendationInputSchema = z
  .object({
    activity: optionalField,
    color: optionalField,
    country: optionalField,
    genre: optionalField,
    lyricalTheme: optionalField,
    mood: optionalField,
    scene: optionalField,
    surprise: z.boolean().optional().default(false),
    rerollSeed: z.string().trim().max(120).optional(),
    excludeIds: z.array(z.string().trim().max(120)).max(12).optional(),
  })
  .refine(
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

export type RecommendationInputPayload = z.infer<typeof recommendationInputSchema>;
