import type { Answers, GeneratedPrompt } from '../types';
import { asString, has } from '../utils';

/**
 * Image-prompt generator (for tools like Midjourney / SD / DALL·E).
 * Keys: subject, style, medium, mood, lighting, composition, palette,
 *       camera, aspectRatio, negative
 */
export function generateImagePrompt(answers: Answers): GeneratedPrompt {
  const subject = asString(answers.subject);
  const style = asString(answers.style);
  const medium = asString(answers.medium);
  const mood = asString(answers.mood);
  const lighting = asString(answers.lighting);
  const composition = asString(answers.composition);
  const palette = asString(answers.palette);
  const camera = asString(answers.camera);
  const aspectRatio = asString(answers.aspectRatio);
  const negative = asString(answers.negative);

  const used: string[] = [];
  const fragments: string[] = [];

  if (has(subject)) {
    used.push('subject');
    fragments.push(subject);
  }
  if (has(style)) { used.push('style'); fragments.push(`${style} style`); }
  if (has(medium)) { used.push('medium'); fragments.push(medium); }
  if (has(mood)) { used.push('mood'); fragments.push(`${mood} mood`); }
  if (has(lighting)) { used.push('lighting'); fragments.push(`${lighting} lighting`); }
  if (has(composition)) { used.push('composition'); fragments.push(composition); }
  if (has(palette)) { used.push('palette'); fragments.push(`${palette} color palette`); }
  if (has(camera)) { used.push('camera'); fragments.push(camera); }

  const main = fragments.filter(Boolean).join(', ');
  const trailers: string[] = [];
  if (has(aspectRatio)) { used.push('aspectRatio'); trailers.push(`--ar ${aspectRatio}`); }
  if (has(negative)) { used.push('negative'); trailers.push(`--no ${negative}`); }

  const text = [main, trailers.join(' ')].filter(Boolean).join(' ').trim();

  return {
    text: text || 'Describe what you want to see — subject, style, mood, lighting.',
    sectionsUsed: used,
  };
}
