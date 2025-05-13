import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const CreateProjectSchema = z.object({
  title: z.string().min(5).max(50),
  description: z.string().max(300),
  link: z.string().url().optional(),
  imageUrl: z.string().optional(),
});

export class CreateProjectDto extends createZodDto(CreateProjectSchema) {}

export const UpdateProjectSchema = CreateProjectSchema.partial();
export class UpdateProjectDto extends createZodDto(UpdateProjectSchema) {}