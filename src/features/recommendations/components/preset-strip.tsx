import { Button } from '@/src/components/ui/button';

import type { RecommendationInput } from '@/src/features/recommendations/types';

export interface RecommendationPreset {
  id: string;
  label: string;
  note: string;
  values: RecommendationInput;
}

interface PresetStripProps {
  onSelect: (preset: RecommendationPreset) => void;
  presets: RecommendationPreset[];
}

export function PresetStrip({ onSelect, presets }: PresetStripProps) {
  return (
    <div className="presetStrip">
      <div className="presetStripCopy">
        <p className="eyebrow">Starting points</p>
        <p className="presetStripText">
          Borrow a mood and bend it toward your own moment.
        </p>
      </div>

      <div className="presetRail">
        {presets.map((preset) => (
          <button
            className="presetCard"
            key={preset.id}
            onClick={() => onSelect(preset)}
            type="button"
          >
            <span className="presetLabel">{preset.label}</span>
            <span className="presetNote">{preset.note}</span>
          </button>
        ))}
      </div>

      <div className="presetActions">
        <Button onClick={() => onSelect(presets[0])} type="button" variant="ghost">
          Use first preset
        </Button>
      </div>
    </div>
  );
}
