import { useQuery } from '@tanstack/react-query';
import { requestsApi } from '../api';
import type { RequestFilters } from '../types';

export const useRequests = (venueId: string, filters?: RequestFilters) => {
  return useQuery({
    queryKey: ['requests', venueId, filters],
    queryFn: () => requestsApi.getAll(venueId, filters),
    enabled: !!venueId,
  });
};

export const useRequestsPaginated = (
  venueId: string,
  page: number,
  limit: number,
  filters?: RequestFilters
) => {
  return useQuery({
    queryKey: ['requests', venueId, 'paginated', page, limit, filters],
    queryFn: () => requestsApi.getPaginated(venueId, page, limit, filters),
    enabled: !!venueId,
  });
};

export const useRequestById = (venueId: string, id: string) => {
  return useQuery({
    queryKey: ['request', venueId, id],
    queryFn: () => requestsApi.getById(venueId, id),
    enabled: !!venueId && !!id,
  });
};

export const useRequestStats = (venueId: string) => {
  return useQuery({
    queryKey: ['requestStats', venueId],
    queryFn: () => requestsApi.getStats(venueId),
    enabled: !!venueId,
  });
};

