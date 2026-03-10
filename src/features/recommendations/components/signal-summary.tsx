import type { RecommendationInput } from '@/src/features/recommendations/types';

interface SignalSummaryProps {
  title?: string;
  values: RecommendationInput;
}

const FIELD_LABELS: Array<{ key: keyof RecommendationInput; label: string }> = [
  { key: 'activity', label: 'Activity' },
  { key: 'mood', label: 'Mood' },
  { key: 'color', label: 'Color' },
  { key: 'country', label: 'Country' },
  { key: 'genre', label: 'Genre' },
  { key: 'lyricalTheme', label: 'Theme' },
];

export function SignalSummary({ title = 'Current signal', values }: SignalSummaryProps) {
  const activeEntries = FIELD_LABELS.filter(({ key }) => {
    const value = values[key];
    return typeof value === 'string' && value.length > 0;
  });

  if (activeEntries.length === 0) {
    return (
      <div className="signalSummary">
        <p className="signalSummaryLabel">{title}</p>
        <p className="signalSummaryEmpty">No signal pinned yet. TaoMusic can still improvise.</p>
      </div>
    );
  }

  return (
    <div className="signalSummary">
      <p className="signalSummaryLabel">{title}</p>
      <div className="signalSummaryGrid">
        {activeEntries.map(({ key, label }) => (
          <div className="signalSummaryItem" key={key}>
            <span className="signalSummaryKey">{label}</span>
            <span className="signalSummaryValue">
              {String(values[key]).replace(/-/g, ' ')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
