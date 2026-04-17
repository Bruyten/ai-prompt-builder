/**
 * Pure helpers for navigating a `QuestionnaireConfig` given a set of answers.
 *
 * Keeping this UI-free means it can be unit-tested or reused by other surfaces
 * (e.g. a CLI, an embedded widget) without pulling in React.
 */
import type { Answers, Field, QuestionnaireConfig, Step } from "./types";

/** Returns only the steps whose `when` predicate currently passes. */
export function visibleSteps(config: QuestionnaireConfig, answers: Answers): Step[] {
  return config.steps.filter((s) => (s.when ? s.when(answers) : true));
}

/** Returns only the fields of a step whose `when` predicate currently passes. */
export function visibleFields(step: Step, answers: Answers): Field[] {
  return step.fields.filter((f) => (f.when ? f.when(answers) : true));
}

/** Are all required fields on this step filled? */
export function isStepValid(step: Step, answers: Answers): boolean {
  for (const field of visibleFields(step, answers)) {
    if (!field.required) continue;
    const v = answers[field.key];
    if (v === undefined || v === null) return false;
    if (typeof v === "string" && v.trim() === "") return false;
    if (Array.isArray(v) && v.length === 0) return false;
  }
  return true;
}

/** Returns a map of field-key -> error message for the given step. */
export function validateStep(step: Step, answers: Answers): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const field of visibleFields(step, answers)) {
    if (!field.required) continue;
    const v = answers[field.key];
    const empty =
      v === undefined ||
      v === null ||
      (typeof v === "string" && v.trim() === "") ||
      (Array.isArray(v) && v.length === 0);
    if (empty) errors[field.key] = "This field is required.";
  }
  return errors;
}

/** Total visible step count — useful for the progress bar. */
export function totalSteps(config: QuestionnaireConfig, answers: Answers): number {
  return visibleSteps(config, answers).length;
}

/** Clamp a step index to the visible range. */
export function clampStep(index: number, config: QuestionnaireConfig, answers: Answers): number {
  const total = totalSteps(config, answers);
  if (total === 0) return 0;
  return Math.max(0, Math.min(index, total - 1));
}
