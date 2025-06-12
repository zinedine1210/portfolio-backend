import { z } from 'zod';

export const CreateSkillSchema = z.object({
  name: z.string().min(1),
  category: z.string().optional(),
});

export const UpdateSkillSchema = z.object({
  name: z.string().min(1).optional(),
  category: z.string().optional(),
});

export const BulkDeleteSkillSchema = z.object({
  ids: z.array(z.string().uuid()),
});

export type CreateSkillDto = z.infer<typeof CreateSkillSchema>;
export type UpdateSkillDto = z.infer<typeof UpdateSkillSchema>;
export type BulkDeleteSkillDto = z.infer<typeof BulkDeleteSkillSchema>; 