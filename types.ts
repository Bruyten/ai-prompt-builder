/**
 * Config-driven questionnaire system.
 *
 * Each prompt type has a `QuestionnaireConfig` describing an ordered list of steps.
 * Each step has one or more fields. Each field/step can be conditionally shown
 * based on previously-collected answers via a `when` predicate.
 *
 * Adding a new prompt type:
 *   1. Add an entry to `src/config/questionnaires/index.ts`
 *   2. Define a config (or reuse / compose existing ones)
 *   3. The wizard renderer + backend prompt-engine pick it up automatically.
 */

import type { PromptType } from "../../types/api";

export type Answers = Record<string, unknown>;

export type FieldType =
  | "text"
  | "textarea"
  | "select"
  | "radio"
  | "multiselect"
  | "tags";

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

export interface BaseField {
  /** key the answer is stored under in `Answers` */
  key: string;
  type: FieldType;
  label: string;
  /** Short helper shown beneath the label. */
  help?: string;
  /** Placeholder for inputs/textareas/tags. */
  placeholder?: string;
  /** Required at submit-time of the step. */
  required?: boolean;
  /** Conditional visibility based on already-collected answers. */
  when?: (answers: Answers) => boolean;
}

export interface TextField extends BaseField {
  type: "text";
  maxLength?: number;
}

export interface TextareaField extends BaseField {
  type: "textarea";
  rows?: number;
  maxLength?: number;
}

export interface SelectField extends BaseField {
  type: "select" | "radio";
  options: SelectOption[];
}

export interface MultiSelectField extends BaseField {
  type: "multiselect";
  options: SelectOption[];
  /** Maximum number of selectable values. */
  max?: number;
}

export interface TagsField extends BaseField {
  type: "tags";
  /** Suggested chips users can click to add. */
  suggestions?: string[];
  max?: number;
}

export type Field =
  | TextField
  | TextareaField
  | SelectField
  | MultiSelectField
  | TagsField;

export interface Step {
  id: string;
  title: string;
  description?: string;
  fields: Field[];
  /** Skip the entire step when predicate returns false. */
  when?: (answers: Answers) => boolean;
}

export interface QuestionnaireConfig {
  promptType: PromptType;
  /** Short human label, e.g. "General Purpose". */
  label: string;
  /** One-line summary used on the type-picker. */
  tagline: string;
  /** Emoji / glyph used on cards. */
  icon: string;
  steps: Step[];
}
