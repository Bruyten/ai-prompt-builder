import type { Answers, GeneratedPrompt } from '../types';
import { asString, bullets, has, section } from '../utils';

/**
 * Marketing copy generator.
 * Keys: product, audience, painPoint, valueProp, channel, tone, cta,
 *       length, mustInclude[], avoid[]
 */
export function generateMarketingPrompt(answers: Answers): GeneratedPrompt {
  const product = asString(answers.product);
  const audience = asString(answers.audience);
  const painPoint = asString(answers.painPoint);
  const valueProp = asString(answers.valueProp);
  const channel = asString(answers.channel);
  const tone = asString(answers.tone);
  const cta = asString(answers.cta);
  const length = asString(answers.length);
  const mustInclude = Array.isArray(answers.mustInclude)
    ? (answers.mustInclude as string[])
    : [];
  const avoid = Array.isArray(answers.avoid) ? (answers.avoid as string[]) : [];

  const used: string[] = [];
  const parts: string[] = [];

  parts.push(
    `You are a senior marketing copywriter. Write ${
      channel ? `${channel} copy` : 'marketing copy'
    }${product ? ` for ${product}` : ''}.`,
  );
  if (channel) used.push('channel');
  if (product) used.push('product');

  const ctxBody = [
    has(audience) ? `**Audience:** ${audience}` : '',
    has(painPoint) ? `**Pain point:** ${painPoint}` : '',
    has(valueProp) ? `**Value prop:** ${valueProp}` : '',
  ]
    .filter(Boolean)
    .join('\n');
  if (ctxBody) {
    used.push('positioning');
    parts.push(section('Positioning', ctxBody));
  }

  const reqs: string[] = [];
  if (has(tone)) reqs.push(`Tone: ${tone}`);
  if (has(length)) reqs.push(`Length: ${length}`);
  if (has(cta)) reqs.push(`Call to action: ${cta}`);
  if (mustInclude.length) reqs.push(`Must include: ${mustInclude.join(', ')}`);
  if (avoid.length) reqs.push(`Avoid: ${avoid.join(', ')}`);
  if (reqs.length) {
    used.push('requirements');
    parts.push(section('Requirements', bullets(reqs)));
  }

  parts.push(
    section(
      'Output',
      bullets([
        'Lead with the strongest hook.',
        'Use plain language — no clichés or filler adjectives.',
        'Return the copy only, with no commentary.',
      ]),
    ),
  );
  used.push('output');

  return { text: parts.join('\n').trim(), sectionsUsed: used };
}
