import { z } from 'zod';
import { PromptType } from '@prisma/client';

export const listPromptsQuerySchema = z.object({
  projectId: z.string().min(1).optional(),
  promptType: z.nativeEnum(PromptType).optional(),
  search: z.string().max(120).optional(),
  pinned: z
    .union([z.literal('true'), z.literal('false')])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === 'true')),
});

export const updatePromptSchema = z.object({
  title: z.string().min(1).max(160).optional(),
  pinned: z.boolean().optional(),
  projectId: z.string().min(1).nullable().optional(),
});

/** Create a new immutable version (edit). */
export const createVersionSchema = z.object({
  text: z.string().min(1).max(40_000),
  notes: z.string().max(500).optional(),
});

export const exportQuerySchema = z.object({
  format: z.enum(['txt', 'md', 'json']).default('md'),
  versionId: z.string().min(1).optional(),
});

export type ListPromptsQuery = z.infer<typeof listPromptsQuerySchema>;
export type UpdatePromptInput = z.infer<typeof updatePromptSchema>;
export type CreateVersionInput = z.infer<typeof createVersionSchema>;
export type ExportQuery = z.infer<typeof exportQuerySchema>;
