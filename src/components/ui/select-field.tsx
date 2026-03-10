import type { FormOption } from '@/src/config/mappings';

interface SelectFieldProps {
  hint?: string;
  index?: string;
  label: string;
  options: FormOption[];
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

export function SelectField({
  hint,
  index,
  label,
  options,
  placeholder,
  value,
  onChange,
}: SelectFieldProps) {
  return (
    <label className="field">
      <span className="fieldHeader">
        <span className="fieldLabelGroup">
          {index ? <span className="fieldIndex">{index}</span> : null}
          <span className="fieldLabel">{label}</span>
        </span>
        {hint ? <span className="fieldHint">{hint}</span> : null}
      </span>
      <select
        className="fieldInput"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
