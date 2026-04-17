import type { MultiSelectField } from "../types";
import { Label, FieldError } from "../../../components/ui/Label";
import { cn } from "../../../utils/cn";
import { Check } from "lucide-react";

interface Props {
  field: MultiSelectField;
  value: string[];
  onChange: (v: string[]) => void;
  error?: string;
}

export function MultiSelectFieldUi({ field, value, onChange, error }: Props) {
  const list = Array.isArray(value) ? value : [];

  function toggle(v: string) {
    if (list.includes(v)) {
      onChange(list.filter((x) => x !== v));
    } else {
      if (field.max && list.length >= field.max) return;
      onChange([...list, v]);
    }
  }

  return (
    <div>
      <Label required={field.required} help={field.help}>
        {field.label}
      </Label>
      <div className="mt-2 flex flex-wrap gap-2">
        {field.options.map((opt) => {
          const selected = list.includes(opt.value);
          return (
            <button
              type="button"
              key={opt.value}
              onClick={() => toggle(opt.value)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                "border-slate-300 hover:border-brand-400 dark:border-slate-700 dark:hover:border-brand-500",
                selected &&
                  "border-brand-500 bg-brand-500 text-white hover:border-brand-500",
              )}
            >
              {selected && <Check className="size-3" />}
              {opt.label}
            </button>
          );
        })}
      </div>
      <FieldError message={error} />
    </div>
  );
}
