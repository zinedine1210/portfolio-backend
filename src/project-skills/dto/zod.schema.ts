import { z } from 'zod';

export const CreateProjectSkillSchema = z.object({
  skillId: z.string().uuid(),
});

export const BulkDeleteProjectSkillSchema = z.object({
  ids: z.array(z.string().uuid()),
});

export type CreateProjectSkillDto = z.infer<typeof CreateProjectSkillSchema>;
export type BulkDeleteProjectSkillDto = z.infer<typeof BulkDeleteProjectSkillSchema>; 