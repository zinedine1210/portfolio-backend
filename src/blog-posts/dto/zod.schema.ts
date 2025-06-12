import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const CreateBlogPostSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  content: z.string().optional(),
  excerpt: z.string().optional(),
  status: z.enum(['draft', 'published']).default('draft'),
  publishedAt: z.date().optional(),
  profileId: z.string().uuid(),
  tags: z.array(z.string().uuid()).optional(),
});

export class CreateBlogPostDto extends createZodDto(CreateBlogPostSchema) {}

export const UpdateBlogPostSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  content: z.string().optional(),
  excerpt: z.string().optional(),
  status: z.enum(['draft', 'published']).optional(),
  publishedAt: z.date().optional(),
});

export class UpdateBlogPostDto extends createZodDto(UpdateBlogPostSchema) {}

export const BulkDeleteBlogPostSchema = z.object({
  ids: z.array(z.string().uuid()),
});

export type BulkDeleteBlogPostDto = z.infer<typeof BulkDeleteBlogPostSchema>; 