import { z } from 'zod';

export const CreateTagSchema = z.object({
  name: z.string().min(1),
});

export const UpdateTagSchema = z.object({
  name: z.string().min(1).optional(),
});

export const BulkDeleteTagSchema = z.object({
  ids: z.array(z.string().uuid()),
});

export type CreateTagDto = z.infer<typeof CreateTagSchema>;
export type UpdateTagDto = z.infer<typeof UpdateTagSchema>;
export type BulkDeleteTagDto = z.infer<typeof BulkDeleteTagSchema>; 