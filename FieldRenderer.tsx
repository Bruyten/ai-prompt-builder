import type { Field } from "./types";
import { TextFieldUi } from "./fields/TextFieldUi";
import { TextareaFieldUi } from "./fields/TextareaFieldUi";
import { SelectFieldUi } from "./fields/SelectFieldUi";
import { MultiSelectFieldUi } from "./fields/MultiSelectFieldUi";
import { TagsFieldUi } from "./fields/TagsFieldUi";

interface Props {
  field: Field;
  value: unknown;
  onChange: (v: unknown) => void;
  error?: string;
}

/**
 * Dispatches a `Field` to the matching UI component.
 *
 * This is the only place the wizard couples field types to UI — adding a new
 * field type means adding one branch here plus a renderer component.
 */
export function FieldRenderer({ field, value, onChange, error }: Props) {
  switch (field.type) {
    case "text":
      return (
        <TextFieldUi
          field={field}
          value={(value as string) ?? ""}
          onChange={onChange}
          error={error}
        />
      );
    case "textarea":
      return (
        <TextareaFieldUi
          field={field}
          value={(value as string) ?? ""}
          onChange={onChange}
          error={error}
        />
      );
    case "select":
    case "radio":
      return (
        <SelectFieldUi
          field={field}
          value={(value as string) ?? ""}
          onChange={onChange}
          error={error}
        />
      );
    case "multiselect":
      return (
        <MultiSelectFieldUi
          field={field}
          value={(value as string[]) ?? []}
          onChange={onChange}
          error={error}
        />
      );
    case "tags":
      return (
        <TagsFieldUi
          field={field}
          value={(value as string[]) ?? []}
          onChange={onChange}
          error={error}
        />
      );
    default:
      return null;
  }
}
