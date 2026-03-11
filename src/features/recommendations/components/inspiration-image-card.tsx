'use client';

import { useEffect, useState } from 'react';

import { getUiCopy } from '@/src/i18n/copy';

import type { UiLanguage } from '@/src/i18n/types';
import type { InspirationImagePayload } from '@/src/features/recommendations/inspiration-image';

interface InspirationImageCardProps {
  language: UiLanguage;
  resultId: string;
}

type InspirationImageState = 'loading' | 'ready' | 'error';

export function InspirationImageCard({
  language,
  resultId,
}: InspirationImageCardProps) {
  const copy = getUiCopy(language);
  const [state, setState] = useState<InspirationImageState>('loading');
  const [payload, setPayload] = useState<InspirationImagePayload | null>(null);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    let alive = true;

    const fetchImage = async () => {
      setState('loading');
      setPayload(null);
      setImageFailed(false);

      try {
        const response = await fetch(
          `/api/inspiration-image?resultId=${encodeURIComponent(resultId)}`,
          {
            cache: 'no-store',
          },
        );

        if (!response.ok) {
          throw new Error('image_failed');
        }

        const nextPayload = (await response.json()) as InspirationImagePayload;

        if (!alive) {
          return;
        }

        setPayload(nextPayload);
        setState('ready');
      } catch {
        if (!alive) {
          return;
        }

        setState('error');
      }
    };

    void fetchImage();

    return () => {
      alive = false;
    };
  }, [resultId]);

  const resolvedState =
    state === 'ready' && payload && !imageFailed ? payload.source : state;

  return (
    <section className="inspirationCard">
      <div className="inspirationCardHeader">
        <div>
          <p className="eyebrow">{copy.result.inspirationImageLabel}</p>
          <p className="inspirationCardStatus">
            {resolvedState === 'loading'
              ? copy.result.inspirationImageLoading
              : resolvedState === 'generated'
                ? copy.result.inspirationImageGenerated
                : resolvedState === 'fallback'
                  ? copy.result.inspirationImageFallback
                  : copy.result.inspirationImageError}
          </p>
        </div>
      </div>

      <div className="inspirationCardViewport">
        {payload && !imageFailed ? (
          <img
            alt={payload.alt}
            className="inspirationCardImage"
            onError={() => setImageFailed(true)}
            src={payload.imageUrl}
          />
        ) : null}
        <div className="inspirationCardOverlay" />
        <div className="inspirationCardCopy">
          <p className="inspirationCardCaption">
            {payload?.promptLabel ?? copy.result.inspirationImagePlaceholder}
          </p>
        </div>
      </div>
    </section>
  );
}
