import type { PromptType } from '@prisma/client';

/** A single answer in a questionnaire response. */
export type AnswerValue = string | number | boolean | string[] | null | undefined | unknown;

/**
 * Bag of answers, keyed by question id. Comes straight from the wizard,
 * which means we accept arbitrary JSON values and let each generator
 * coerce/validate what it cares about.
 */
export type Answers = Record<string, unknown>;

/** Inputs the engine needs to render a prompt. */
export interface GenerateInput {
  promptType: PromptType;
  answers: Answers;
}

/** Output of a generator. The engine wraps this with metadata. */
export interface GeneratedPrompt {
  text: string;
  /** Sections we filled in — useful for the UI to highlight. */
  sectionsUsed: string[];
}

/** A prompt-type generator. Pure function — no DB, no I/O. */
export type PromptGenerator = (answers: Answers) => GeneratedPrompt;
