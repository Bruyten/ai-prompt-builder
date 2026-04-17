import type { AnswerValue } from './types';

/** Coerce any answer value to a trimmed string, or '' if absent. */
export function asString(v: AnswerValue): string {
  if (v === null || v === undefined) return '';
  if (Array.isArray(v)) return v.filter(Boolean).join(', ');
  return String(v).trim();
}

/** True if the answer is meaningfully present. */
export function has(v: AnswerValue): boolean {
  if (v === null || v === undefined) return false;
  if (typeof v === 'string') return v.trim().length > 0;
  if (Array.isArray(v)) return v.length > 0;
  return true;
}

/** Render a bullet list, skipping blank items. */
export function bullets(items: Array<string | undefined | null>): string {
  return items
    .map((s) => (s ?? '').trim())
    .filter(Boolean)
    .map((s) => `- ${s}`)
    .join('\n');
}

/** Append a section to a builder if `body` is non-empty. */
export function section(title: string, body: string): string {
  const trimmed = body.trim();
  if (!trimmed) return '';
  return `## ${title}\n${trimmed}\n`;
}

/** Capitalize the first letter, leave the rest. */
export function cap(s: string): string {
  if (!s) return s;
  return s[0].toUpperCase() + s.slice(1);
}
