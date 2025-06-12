import { z } from 'zod';

export const CreateProfileSkillSchema = z.object({
  skillId: z.string().uuid(),
  proficiencyLevel: z.number().min(1).max(5),
});

export const UpdateProfileSkillSchema = z.object({
  proficiencyLevel: z.number().min(1).max(5),
});

export const BulkDeleteProfileSkillSchema = z.object({
  ids: z.array(z.string().uuid()),
});

export type CreateProfileSkillDto = z.infer<typeof CreateProfileSkillSchema>;
export type UpdateProfileSkillDto = z.infer<typeof UpdateProfileSkillSchema>;
export type BulkDeleteProfileSkillDto = z.infer<typeof BulkDeleteProfileSkillSchema>; 