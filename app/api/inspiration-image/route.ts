import { NextResponse } from 'next/server';

import { resolveInspirationImage } from '@/src/features/recommendations/inspiration-image';

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const resultId = searchParams.get('resultId')?.trim();

  if (!resultId) {
    return NextResponse.json(
      {
        error: 'missing_result_id',
      },
      { status: 400 },
    );
  }

  const payload = await resolveInspirationImage(resultId);

  if (!payload) {
    return NextResponse.json(
      {
        error: 'result_not_found',
      },
      { status: 404 },
    );
  }

  return NextResponse.json(payload);
}
