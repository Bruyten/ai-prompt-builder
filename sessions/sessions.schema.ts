import { z } from 'zod';
import { PromptType, SessionStatus } from '@prisma/client';

const answersSchema = z.record(z.string(), z.unknown());

export const createSessionSchema = z.object({
  promptType: z.nativeEnum(PromptType),
  projectId: z.string().min(1).optional(),
  answers: answersSchema.optional(),
  templateId: z.string().min(1).optional(),
});

export const updateSessionSchema = z.object({
  answers: answersSchema.optional(),
  currentStep: z.number().int().min(0).max(50).optional(),
  status: z.nativeEnum(SessionStatus).optional(),
  projectId: z.string().min(1).nullable().optional(),
});

export const completeSessionSchema = z.object({
  title: z.string().min(1).max(160),
  projectId: z.string().min(1).nullable().optional(),
});

export const previewSchema = z.object({
  promptType: z.nativeEnum(PromptType),
  answers: answersSchema.default({}),
});

export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type UpdateSessionInput = z.infer<typeof updateSessionSchema>;
export type CompleteSessionInput = z.infer<typeof completeSessionSchema>;
export type PreviewInput = z.infer<typeof previewSchema>;
