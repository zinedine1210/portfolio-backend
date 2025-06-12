import { z } from 'zod';

export const CreateProfileSchema = z.object({
  name: z.string().min(2).max(50),
  title: z.string().min(2).max(50),
  telephone: z.string().min(10).max(15).regex(/^(\+62|62|0)8[1-9][0-9]{6,9}$/, {
    message: "Nomor handphone tidak valid",
  }),// kamu bisa pakai regex juga untuk validasi nomor
  location: z.string().min(2).max(100),
  age: z.number().int().min(0).max(120),
  gender: z.enum(['MAN', 'WOMAN', 'OTHER']),
  about: z.string().min(5).max(1000).optional(),
  resumeUrl: z.string().url().optional(),
  websiteUrl: z.string().url().optional(),
  imageUrl: z.string().url().optional()
});


export const UpdateProfileSchema = CreateProfileSchema.partial();

export type CreateProfileDto = z.infer<typeof CreateProfileSchema>;
export type UpdateProfileDto = z.infer<typeof UpdateProfileSchema>; 

export const BulkDeleteProfileSchema = z.object({
  ids: z
    .array(z.string().uuid())
    .nonempty("IDs array cannot be empty"),
});

export type BulkDeleteProfileDto = z.infer<typeof BulkDeleteProfileSchema>;
