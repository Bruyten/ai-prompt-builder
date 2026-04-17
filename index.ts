import { PromptType } from '@prisma/client';
import type { GenerateInput, GeneratedPrompt, PromptGenerator } from './types';
import { generateGeneralPrompt } from './generators/general';
import { generateCodingPrompt } from './generators/coding';
import { generateWritingPrompt } from './generators/writing';
import { generateMarketingPrompt } from './generators/marketing';
import { generateImagePrompt } from './generators/image';
import { generateAnalysisPrompt } from './generators/analysis';

/**
 * Registry pattern: adding a new prompt type is a one-line addition here
 * plus a generator file. Controllers / services don't change.
 */
const registry: Record<PromptType, PromptGenerator> = {
  GENERAL: generateGeneralPrompt,
  CODING: generateCodingPrompt,
  WRITING: generateWritingPrompt,
  MARKETING: generateMarketingPrompt,
  IMAGE: generateImagePrompt,
  ANALYSIS: generateAnalysisPrompt,
};

export function generatePrompt(input: GenerateInput): GeneratedPrompt {
  const generator = registry[input.promptType];
  if (!generator) {
    // Should be unreachable thanks to the enum, but be defensive.
    return generateGeneralPrompt(input.answers);
  }
  return generator(input.answers);
}

export type { Answers, AnswerValue, GeneratedPrompt, GenerateInput, PromptGenerator };
