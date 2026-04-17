import { useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";
import type { TagsField } from "../types";
import { Input } from "../../../components/ui/Input";
import { Label, FieldError } from "../../../components/ui/Label";

interface Props {
  field: TagsField;
  value: string[];
  onChange: (v: string[]) => void;
  error?: string;
}

export function TagsFieldUi({ field, value, onChange, error }: Props) {
  const [draft, setDraft] = useState("");
  const tags = Array.isArray(value) ? value : [];

  function add(v: string) {
    const trimmed = v.trim();
    if (!trimmed) return;
    if (tags.includes(trimmed)) return;
    if (field.max && tags.length >= field.max) return;
    onChange([...tags, trimmed]);
    setDraft("");
  }

  function remove(v: string) {
    onChange(tags.filter((t) => t !== v));
  }

  function onKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add(draft);
    } else if (e.key === "Backspace" && draft === "" && tags.length > 0) {
      remove(tags[tags.length - 1]);
    }
  }

  return (
    <div>
      <Label required={field.required} help={field.help} htmlFor={field.key}>
        {field.label}
      </Label>
      <div className="mt-1.5 flex flex-wrap gap-1.5 rounded-lg border border-slate-300 bg-white p-2 dark:bg-slate-900 dark:border-slate-700">
        {tags.map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-1 rounded-md bg-brand-100 px-2 py-1 text-xs font-medium text-brand-700 dark:bg-brand-500/15 dark:text-brand-300"
          >
            {t}
            <button
              type="button"
              onClick={() => remove(t)}
              className="rounded hover:bg-brand-200/60 dark:hover:bg-brand-500/25"
              aria-label={`Remove ${t}`}
            >
              <X className="size-3" />
            </button>
          </span>
        ))}
        <Input
          id={field.key}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKey}
          onBlur={() => draft && add(draft)}
          placeholder={field.placeholder ?? "Type and press Enter…"}
          className="!w-auto !flex-1 min-w-[10rem] !border-0 !shadow-none !ring-0 focus:!ring-0"
        />
      </div>
      {field.suggestions && field.suggestions.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          <span className="text-xs text-slate-500">Suggestions:</span>
          {field.suggestions
            .filter((s) => !tags.includes(s))
            .map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => add(s)}
                className="rounded-md border border-dashed border-slate-300 px-2 py-0.5 text-xs text-slate-600 hover:border-brand-400 hover:text-brand-600 dark:border-slate-700 dark:text-slate-400"
              >
                + {s}
              </button>
            ))}
        </div>
      )}
      <FieldError message={error} />
    </div>
  );
}
