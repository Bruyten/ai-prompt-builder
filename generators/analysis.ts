import type { Answers, GeneratedPrompt } from '../types';
import { asString, bullets, has, section } from '../utils';

/**
 * Data / document analysis generator.
 * Keys: dataDescription, goal, questions[], format, audience, constraints[]
 */
export function generateAnalysisPrompt(answers: Answers): GeneratedPrompt {
  const dataDescription = asString(answers.dataDescription);
  const goal = asString(answers.goal);
  const format = asString(answers.format);
  const audience = asString(answers.audience);
  const questions = Array.isArray(answers.questions) ? (answers.questions as string[]) : [];
  const constraints = Array.isArray(answers.constraints)
    ? (answers.constraints as string[])
    : [];

  const used: string[] = [];
  const parts: string[] = [
    'You are a senior analyst. Be rigorous, cite the data you used, and ' +
      'flag uncertainties explicitly.',
  ];

  if (has(dataDescription)) {
    used.push('data');
    parts.push(section('Data', dataDescription));
  }

  if (has(goal)) {
    used.push('goal');
    parts.push(section('Goal', goal));
  }

  if (questions.length) {
    used.push('questions');
    parts.push(section('Answer these questions', bullets(questions)));
  }

  const reqs: string[] = [...constraints];
  if (has(audience)) reqs.push(`Audience: ${audience}`);
  if (has(format)) reqs.push(`Output format: ${format}`);
  if (reqs.length) {
    used.push('requirements');
    parts.push(section('Requirements', bullets(reqs)));
  }

  parts.push(
    section(
      'Method',
      bullets([
        'State assumptions before conclusions.',
        'Show the chain of reasoning briefly.',
        'Distinguish observed facts from inferences.',
      ]),
    ),
  );
  used.push('method');

  return { text: parts.join('\n').trim(), sectionsUsed: used };
}
