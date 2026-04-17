import type { Answers, GeneratedPrompt } from '../types';
import { asString, bullets, has, section } from '../utils';

/**
 * Long-form writing generator.
 * Keys: docType, topic, audience, tone, length, structure[], keyPoints[],
 *       avoid[], references
 */
export function generateWritingPrompt(answers: Answers): GeneratedPrompt {
  const docType = asString(answers.docType) || 'article';
  const topic = asString(answers.topic);
  const audience = asString(answers.audience);
  const tone = asString(answers.tone);
  const length = asString(answers.length);
  const references = asString(answers.references);
  const structure = Array.isArray(answers.structure) ? (answers.structure as string[]) : [];
  const keyPoints = Array.isArray(answers.keyPoints) ? (answers.keyPoints as string[]) : [];
  const avoid = Array.isArray(answers.avoid) ? (answers.avoid as string[]) : [];

  const used: string[] = [];
  const parts: string[] = [];

  parts.push(
    `You are a senior writer. Write a ${tone || 'clear'} ${docType}${
      topic ? ` about "${topic}"` : ''
    }.`,
  );
  if (docType) used.push('docType');
  if (topic) used.push('topic');
  if (tone) used.push('tone');

  const meta = [
    has(audience) ? `Audience: ${audience}.` : '',
    has(length) ? `Target length: ${length}.` : '',
  ]
    .filter(Boolean)
    .join(' ');
  if (meta) {
    used.push('meta');
    parts.push('\n' + meta);
  }

  if (structure.length) {
    used.push('structure');
    parts.push(section('Structure', bullets(structure)));
  }

  if (keyPoints.length) {
    used.push('keyPoints');
    parts.push(section('Must cover', bullets(keyPoints)));
  }

  if (avoid.length) {
    used.push('avoid');
    parts.push(section('Avoid', bullets(avoid)));
  }

  if (has(references)) {
    used.push('references');
    parts.push(section('References', references));
  }

  return { text: parts.join('\n').trim(), sectionsUsed: used };
}
