export type RecommendationMode = 'structured' | 'bubble';

interface ModeSwitchProps {
  mode: RecommendationMode;
  onChange: (mode: RecommendationMode) => void;
}

export function ModeSwitch({ mode, onChange }: ModeSwitchProps) {
  return (
    <div className="modeSwitch" role="tablist" aria-label="Recommendation input mode">
      <button
        className={['modeSwitchButton', mode === 'structured' ? 'modeSwitchButton-active' : '']
          .filter(Boolean)
          .join(' ')}
        onClick={() => onChange('structured')}
        role="tab"
        type="button"
      >
        Structured mode
      </button>
      <button
        className={['modeSwitchButton', mode === 'bubble' ? 'modeSwitchButton-active' : '']
          .filter(Boolean)
          .join(' ')}
        onClick={() => onChange('bubble')}
        role="tab"
        type="button"
      >
        Muse bubble mode
      </button>
    </div>
  );
}
