import type { PaginatedResponse, PaginationFilters } from '../types/pagination';

/**
 * Build URL search params for paginated requests
 */
export function buildPaginationParams(
  page: number,
  limit: number,
  filters?: PaginationFilters
): URLSearchParams {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        // Handle boolean values
        if (typeof value === 'boolean') {
          params.append(key, value.toString());
        }
        // Handle other values
        else {
          params.append(key, String(value));
        }
      }
    });
  }

  return params;
}

/**
 * Generic hook state for pagination
 */
export interface UsePaginationState {
  page: number;
  limit: number;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  resetPage: () => void;
}

/**
 * Calculate pagination metadata
 */
export function getPaginationMeta(data: PaginatedResponse<unknown> | undefined) {
  return {
    total: data?.total || 0,
    totalPages: data?.totalPages || 0,
    currentPage: data?.page || 1,
    itemsPerPage: data?.limit || 20,
    hasNextPage: data ? data.page < data.totalPages : false,
    hasPreviousPage: data ? data.page > 1 : false,
  };
}

