import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const CreateContactSchema = z.object({
  type: z.string().min(2).max(50),
  value: z.string().min(1),
  isPublic: z.boolean().default(true),
  profileId: z.string().uuid(),
  icon: z.string().default('ic:sharp-phone'),
});

export class CreateContactDto extends createZodDto(CreateContactSchema) {}

export const UpdateContactSchema = CreateContactSchema.partial();
export class UpdateContactDto extends createZodDto(UpdateContactSchema) {}

export const BulkDeleteSchema = z.object({
  ids: z.array(z.string().uuid()),
});

export class BulkDeleteDto extends createZodDto(BulkDeleteSchema) {} 