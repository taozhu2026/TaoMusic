import type { FormOption } from '@/src/config/mappings';

interface OptionChipFieldProps {
  hint?: string;
  index?: string;
  label: string;
  options: FormOption[];
  value: string;
  onChange: (value: string) => void;
}

export function OptionChipField({
  hint,
  index,
  label,
  options,
  value,
  onChange,
}: OptionChipFieldProps) {
  return (
    <section className="field chipField">
      <div className="fieldHeader">
        <span className="fieldLabelGroup">
          {index ? <span className="fieldIndex">{index}</span> : null}
          <span className="fieldLabel">{label}</span>
        </span>
        {hint ? <span className="fieldHint">{hint}</span> : null}
      </div>
      <div className="chipFieldOptions">
        {options.map((option) => (
          <button
            aria-pressed={value === option.value}
            className={[
              'optionChip',
              value === option.value ? 'optionChip-active' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            key={option.value}
            onClick={() => onChange(value === option.value ? '' : option.value)}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>
    </section>
  );
}
