import { z } from 'zod';

export const CreateBlogPostTagSchema = z.object({
  tagId: z.string().uuid(),
});

export const BulkDeleteBlogPostTagSchema = z.object({
  ids: z.array(z.string().uuid()),
});

export type CreateBlogPostTagDto = z.infer<typeof CreateBlogPostTagSchema>;
export type BulkDeleteBlogPostTagDto = z.infer<typeof BulkDeleteBlogPostTagSchema>; 