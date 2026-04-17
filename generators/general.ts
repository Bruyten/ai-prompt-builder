import type { Answers, GeneratedPrompt } from '../types';
import { asString, bullets, has, section } from '../utils';

/**
 * General-purpose prompt generator. Uses a Role / Task / Context /
 * Constraints / Format / Examples skeleton — the most broadly useful shape
 * across LLMs.
 *
 * Expected answer keys:
 *   role, task, context, audience, tone, constraints[], format, examples[]
 */
export function generateGeneralPrompt(answers: Answers): GeneratedPrompt {
  const role = asString(answers.role);
  const task = asString(answers.task);
  const context = asString(answers.context);
  const audience = asString(answers.audience);
  const tone = asString(answers.tone);
  const format = asString(answers.format);
  const constraints = Array.isArray(answers.constraints)
    ? (answers.constraints as string[])
    : [];
  const examples = Array.isArray(answers.examples) ? (answers.examples as string[]) : [];

  const used: string[] = [];
  const parts: string[] = [];

  if (has(role)) {
    used.push('role');
    parts.push(`You are ${role}.`);
  }

  if (has(task)) {
    used.push('task');
    parts.push(`\nYour task: ${task}`);
  }

  const ctxBody = [
    has(context) ? context : '',
    has(audience) ? `Target audience: ${audience}.` : '',
    has(tone) ? `Tone: ${tone}.` : '',
  ]
    .filter(Boolean)
    .join('\n');
  if (ctxBody) {
    used.push('context');
    parts.push('\n' + section('Context', ctxBody));
  }

  if (constraints.length) {
    used.push('constraints');
    parts.push(section('Constraints', bullets(constraints)));
  }

  if (has(format)) {
    used.push('format');
    parts.push(section('Output format', format));
  }

  if (examples.length) {
    used.push('examples');
    parts.push(section('Examples', bullets(examples)));
  }

  const text = parts.join('\n').trim() ||
    'Please provide more details about what you would like the AI to do.';

  return { text, sectionsUsed: used };
}
