export type InspirationImageSource = 'generated' | 'fallback';

export interface InspirationImagePayload {
  alt: string;
  imageUrl: string;
  promptLabel: string;
  source: InspirationImageSource;
}
