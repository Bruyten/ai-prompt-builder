import { z } from 'zod';
import { PromptType } from '@prisma/client';

export const updatePreferencesSchema = z.object({
  defaultPromptType: z.nativeEnum(PromptType).optional(),
  defaultTone: z.string().max(80).nullable().optional(),
  defaultAudience: z.string().max(160).nullable().optional(),
  preferLongPrompts: z.boolean().optional(),
  theme: z.enum(['light', 'dark', 'system']).optional(),
});

export type UpdatePreferencesInput = z.infer<typeof updatePreferencesSchema>;
