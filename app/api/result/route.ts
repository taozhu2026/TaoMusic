import { NextResponse } from 'next/server';

import { getRecommendationResult } from '@/src/features/recommendations/result-cache';

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const resultId = searchParams.get('id');

  if (!resultId) {
    return NextResponse.json({ error: 'missing_result_id' }, { status: 400 });
  }

  const record = getRecommendationResult(resultId);

  if (!record) {
    return NextResponse.json({ error: 'result_not_found' }, { status: 404 });
  }

  return NextResponse.json({
    resultId,
    record,
  });
}
