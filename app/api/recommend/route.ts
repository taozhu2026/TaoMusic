import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

import { createRecommendation } from '@/src/features/recommendations/orchestrator';
import { storeRecommendationResult } from '@/src/features/recommendations/result-cache';
import { recommendationRequestSchema } from '@/src/features/recommendations/schema';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const payload = recommendationRequestSchema.parse(await request.json());
    const result = await createRecommendation(payload.input);
    const resultId = storeRecommendationResult({
      bubbleDraft:
        payload.bubbleDraft ?? {
          dismissedIds: [],
          focus: 'balanced',
          seed: payload.input.rerollSeed ?? 'taomusic-default-seed',
          selectedIds: [],
        },
      createdAt: Date.now(),
      mode: payload.mode,
      result,
      structuredDraft: payload.structuredDraft ?? payload.input,
    });

    return NextResponse.json({ resultId });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: 'invalid_request',
          details: error.flatten(),
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        error: 'recommendation_failed',
      },
      { status: 500 },
    );
  }
}
