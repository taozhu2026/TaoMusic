import type { RecommendationMode } from '@/src/features/recommendations/experience-types';

interface ModeSwitchProps {
  disabled?: boolean;
  mode: RecommendationMode;
  onChange: (mode: RecommendationMode) => void;
}

export function ModeSwitch({ disabled = false, mode, onChange }: ModeSwitchProps) {
  return (
    <div className="modeSwitch" role="tablist" aria-label="Recommendation input mode">
      <button
        className={['modeSwitchButton', mode === 'structured' ? 'modeSwitchButton-active' : '']
          .filter(Boolean)
          .join(' ')}
        disabled={disabled}
        onClick={() => onChange('structured')}
        aria-selected={mode === 'structured'}
        role="tab"
        type="button"
      >
        Structured mode
      </button>
      <button
        className={['modeSwitchButton', mode === 'bubble' ? 'modeSwitchButton-active' : '']
          .filter(Boolean)
          .join(' ')}
        disabled={disabled}
        onClick={() => onChange('bubble')}
        aria-selected={mode === 'bubble'}
        role="tab"
        type="button"
      >
        Muse bubble mode
      </button>
    </div>
  );
}
