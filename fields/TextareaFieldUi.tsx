import type { TextareaField } from "../types";
import { Textarea } from "../../../components/ui/Textarea";
import { Label, FieldError } from "../../../components/ui/Label";

interface Props {
  field: TextareaField;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}

export function TextareaFieldUi({ field, value, onChange, error }: Props) {
  const max = field.maxLength;
  const len = (value ?? "").length;
  return (
    <div>
      <Label required={field.required} help={field.help} htmlFor={field.key}>
        {field.label}
      </Label>
      <Textarea
        id={field.key}
        value={value ?? ""}
        rows={field.rows ?? 4}
        placeholder={field.placeholder}
        maxLength={max}
        invalid={!!error}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5"
      />
      <div className="mt-1 flex items-center justify-between">
        <FieldError message={error} />
        {max !== undefined && (
          <span className="ml-auto text-xs text-slate-400 tabular-nums">
            {len}/{max}
          </span>
        )}
      </div>
    </div>
  );
}
