import { z } from 'zod';
import { PromptType, TemplateVisibility } from '@prisma/client';

const promptTypeEnum = z.nativeEnum(PromptType);
const visibilityEnum = z.nativeEnum(TemplateVisibility);

export const createTemplateSchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().min(1).max(1000),
  promptType: promptTypeEnum,
  answers: z.record(z.string(), z.unknown()).default({}),
  exampleText: z.string().max(20_000).optional(),
  tags: z.array(z.string().min(1).max(40)).max(20).default([]),
  visibility: visibilityEnum.default(TemplateVisibility.PRIVATE),
});

export const updateTemplateSchema = createTemplateSchema.partial();

export const listTemplatesQuerySchema = z.object({
  promptType: promptTypeEnum.optional(),
  scope: z.enum(['mine', 'public', 'all']).default('all'),
  search: z.string().max(120).optional(),
  tag: z.string().max(40).optional(),
});

export type CreateTemplateInput = z.infer<typeof createTemplateSchema>;
export type UpdateTemplateInput = z.infer<typeof updateTemplateSchema>;
export type ListTemplatesQuery = z.infer<typeof listTemplatesQuerySchema>;
