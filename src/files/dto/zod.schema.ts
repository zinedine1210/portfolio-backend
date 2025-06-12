import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const CreateFileSchema = z.object({
  filename: z.string(),
  originalName: z.string(),
  mimeType: z.string(),
  size: z.number(),
  path: z.string(),
  profileId: z.string().uuid(),
});

export class CreateFileDto extends createZodDto(CreateFileSchema) {}

export const UpdateFileSchema = CreateFileSchema.partial();
export class UpdateFileDto extends createZodDto(UpdateFileSchema) {}

export const BulkDeleteSchema = z.object({
  ids: z.array(z.string().uuid()),
});

export class BulkDeleteDto extends createZodDto(BulkDeleteSchema) {} 