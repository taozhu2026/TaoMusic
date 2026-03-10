import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

import { createRecommendation } from '@/src/features/recommendations/orchestrator';
import { recommendationInputSchema } from '@/src/features/recommendations/schema';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const payload = recommendationInputSchema.parse(await request.json());
    const response = await createRecommendation(payload);

    return NextResponse.json(response);
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
