import { Button } from '@/src/components/ui/button';
import { localizeText } from '@/src/config/mappings';

import type { UiLanguage } from '@/src/i18n/types';
import type { LocalizedText } from '@/src/i18n/types';
import type { RecommendationInput } from '@/src/features/recommendations/types';

export interface RecommendationPreset {
  id: string;
  label: LocalizedText;
  note: LocalizedText;
  values: RecommendationInput;
}

interface PresetStripProps {
  language: UiLanguage;
  onSelect: (preset: RecommendationPreset) => void;
  presets: RecommendationPreset[];
  title: string;
  text: string;
  useFirstLabel: string;
}

export function PresetStrip({
  language,
  onSelect,
  presets,
  text,
  title,
  useFirstLabel,
}: PresetStripProps) {
  return (
    <div className="presetStrip">
      <div className="presetStripCopy">
        <p className="eyebrow">{title}</p>
        <p className="presetStripText">{text}</p>
      </div>

      <div className="presetRail">
        {presets.map((preset) => (
          <button
            className="presetCard"
            key={preset.id}
            onClick={() => onSelect(preset)}
            type="button"
          >
            <span className="presetLabel">{localizeText(preset.label, language)}</span>
            <span className="presetNote">{localizeText(preset.note, language)}</span>
          </button>
        ))}
      </div>

      <div className="presetActions">
        <Button onClick={() => onSelect(presets[0])} type="button" variant="ghost">
          {useFirstLabel}
        </Button>
      </div>
    </div>
  );
}
