import type { TextField } from "../types";
import { Input } from "../../../components/ui/Input";
import { Label, FieldError } from "../../../components/ui/Label";

interface Props {
  field: TextField;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}

export function TextFieldUi({ field, value, onChange, error }: Props) {
  return (
    <div>
      <Label required={field.required} help={field.help} htmlFor={field.key}>
        {field.label}
      </Label>
      <Input
        id={field.key}
        value={value ?? ""}
        placeholder={field.placeholder}
        maxLength={field.maxLength}
        invalid={!!error}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5"
      />
      <FieldError message={error} />
    </div>
  );
}
