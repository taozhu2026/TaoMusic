'use client';

import { useState } from 'react';

import { Button } from '@/src/components/ui/button';

import type { RecommendationResponse } from '@/src/features/recommendations/types';

interface ShareActionsProps {
  result: RecommendationResponse;
}

const buildShareText = (result: RecommendationResponse): string => {
  const songs = result.recommendations
    .map(
      (recommendation) =>
        `${recommendation.candidate.title} — ${recommendation.candidate.artist}`,
    )
    .join('\n');

  return [`TaoMusic`, result.serendipity.line, songs].join('\n');
};

export function ShareActions({ result }: ShareActionsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildShareText(result));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="shareRow">
      <Button onClick={handleCopy} type="button" variant="secondary">
        {copied ? 'Copied' : 'Copy muse card'}
      </Button>
      <span className="shareHint">Clean text for notes, messages, or a social post.</span>
    </div>
  );
}
