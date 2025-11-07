/**
 * Common pagination response structure
 * Matches the backend PaginationResult interface
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Common filter interface for paginated requests
 */
export interface PaginationFilters {
  search?: string;
  [key: string]: any; // Allow additional filters
}

