import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const CreateProjectSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  content: z.string().optional(),
  imageUrl: z.string().url().optional(),
  githubUrl: z.string().url().optional(),
  liveUrl: z.string().url().optional(),
  isFeatured: z.boolean().optional(),
});

export class CreateProjectDto extends createZodDto(CreateProjectSchema) {}

export const UpdateProjectSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().optional(),
  content: z.string().optional(),
  imageUrl: z.string().url().optional(),
  githubUrl: z.string().url().optional(),
  liveUrl: z.string().url().optional(),
  isFeatured: z.boolean().optional(),
});

export class UpdateProjectDto extends createZodDto(UpdateProjectSchema) {}

export const BulkDeleteProjectSchema = z.object({
  ids: z.array(z.string().uuid()),
});

export type BulkDeleteProjectDto = z.infer<typeof BulkDeleteProjectSchema>;
