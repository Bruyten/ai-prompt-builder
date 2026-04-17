import type { SelectField } from "../types";
import { Select } from "../../../components/ui/Select";
import { Label, FieldError } from "../../../components/ui/Label";
import { cn } from "../../../utils/cn";

interface Props {
  field: SelectField;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}

export function SelectFieldUi({ field, value, onChange, error }: Props) {
  // Render radio for "radio", styled cards for clarity.
  if (field.type === "radio") {
    return (
      <div>
        <Label required={field.required} help={field.help}>
          {field.label}
        </Label>
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          {field.options.map((opt) => {
            const selected = value === opt.value;
            return (
              <button
                type="button"
                key={opt.value}
                onClick={() => onChange(opt.value)}
                className={cn(
                  "rounded-lg border px-3 py-2.5 text-left text-sm transition-colors",
                  "border-slate-300 hover:border-brand-400 dark:border-slate-700 dark:hover:border-brand-500",
                  selected &&
                    "border-brand-500 bg-brand-50 ring-2 ring-brand-500/20 dark:bg-brand-500/10",
                )}
              >
                <div className="font-medium">{opt.label}</div>
                {opt.description && (
                  <div className="mt-0.5 text-xs text-slate-500">{opt.description}</div>
                )}
              </button>
            );
          })}
        </div>
        <FieldError message={error} />
      </div>
    );
  }

  return (
    <div>
      <Label required={field.required} help={field.help} htmlFor={field.key}>
        {field.label}
      </Label>
      <Select
        id={field.key}
        value={value ?? ""}
        invalid={!!error}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5"
      >
        <option value="" disabled>
          Select an option…
        </option>
        {field.options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </Select>
      <FieldError message={error} />
    </div>
  );
}
