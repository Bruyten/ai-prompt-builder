import type { Answers, GeneratedPrompt } from '../types';
import { asString, bullets, has, section } from '../utils';

/**
 * Coding-task generator.
 * Keys: language, framework, task, inputs, outputs, constraints[],
 *       performance, style, tests, context
 */
export function generateCodingPrompt(answers: Answers): GeneratedPrompt {
  const language = asString(answers.language);
  const framework = asString(answers.framework);
  const task = asString(answers.task);
  const inputs = asString(answers.inputs);
  const outputs = asString(answers.outputs);
  const performance = asString(answers.performance);
  const style = asString(answers.style);
  const tests = asString(answers.tests);
  const context = asString(answers.context);
  const constraints = Array.isArray(answers.constraints)
    ? (answers.constraints as string[])
    : [];

  const used: string[] = [];
  const parts: string[] = [];

  const stack = [language, framework].filter(Boolean).join(' / ');
  if (stack) {
    used.push('stack');
    parts.push(`You are an expert ${stack} engineer. Write production-quality code.`);
  } else {
    parts.push('You are an expert software engineer. Write production-quality code.');
  }

  if (has(task)) {
    used.push('task');
    parts.push(`\nTask: ${task}`);
  }

  if (has(context)) {
    used.push('context');
    parts.push(section('Context', context));
  }

  const io = [
    has(inputs) ? `**Inputs:** ${inputs}` : '',
    has(outputs) ? `**Outputs:** ${outputs}` : '',
  ]
    .filter(Boolean)
    .join('\n');
  if (io) {
    used.push('io');
    parts.push(section('Interface', io));
  }

  const reqs: string[] = [...constraints];
  if (has(performance)) reqs.push(`Performance: ${performance}`);
  if (has(style)) reqs.push(`Style: ${style}`);
  if (has(tests)) reqs.push(`Tests: ${tests}`);
  if (reqs.length) {
    used.push('requirements');
    parts.push(section('Requirements', bullets(reqs)));
  }

  parts.push(
    section(
      'Output',
      bullets([
        'Return only the requested code, in a single fenced block.',
        'Add brief inline comments where intent is non-obvious.',
        'No prose outside the code block unless explicitly asked.',
      ]),
    ),
  );
  used.push('output');

  return { text: parts.join('\n').trim(), sectionsUsed: used };
}
