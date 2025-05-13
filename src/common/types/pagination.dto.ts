// src/projects/dto/project-query.dto.ts
import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';


const FilterSchema = z.object({
  key: z.string(),
  value: z.any(),
  operator: z.enum(['equals', 'contains', 'startsWith', 'endsWith']).default('contains'),
});

const SortSchema = z.object({
  key: z.string(),
  order: z.enum(['asc', 'desc']).default('asc'),
})

export const PaginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().min(-1).max(100).default(10),
  sorts: z.array(SortSchema).optional().default([]),
  filters: z.array(FilterSchema).optional().default([]),
});

export class PaginationDto extends createZodDto(PaginationSchema) {}
export type PaginationInput = z.infer<typeof PaginationSchema>;
