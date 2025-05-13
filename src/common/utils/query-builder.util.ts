import { PaginationDto } from "../types/pagination.dto";

export function buildQueryOptions<T = any>(params: PaginationDto) {
  const {
    page = 1,
    limit = 10,
    sorts,
    filters = [],
  } = params;
  // Pagination
  const pagination = limit === -1 ? {} : {
    skip: (page - 1) * limit,
    take: limit,
  };

  // Filter logic
  const where: Record<string, any> = {};
  for (const { key, value, operator = 'contains' } of filters) {
    where[key] = { [operator]: value, mode: 'insensitive' };
  }

  // Sorting logic
  const orderBy = sorts.map(({ key, order }) => ({
    [key]: order,
  }));

  return {
    pagination,
    orderBy: orderBy.length > 0 ? orderBy : undefined,
    filters: where,
    meta: { page, limit },
  };
}
