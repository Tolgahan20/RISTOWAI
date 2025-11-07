import { useQuery } from '@tanstack/react-query';
import { absencesApi } from '../api';
import type { AbsenceFilters } from '../types';

export const useAbsences = (venueId: string, filters?: AbsenceFilters) => {
  return useQuery({
    queryKey: ['absences', venueId, filters],
    queryFn: () => absencesApi.getAll(venueId, filters),
    enabled: !!venueId,
  });
};

export const useAbsencesPaginated = (
  venueId: string,
  page: number,
  limit: number,
  filters?: AbsenceFilters
) => {
  return useQuery({
    queryKey: ['absences', venueId, 'paginated', page, limit, filters],
    queryFn: () => absencesApi.getPaginated(venueId, page, limit, filters),
    enabled: !!venueId,
  });
};

export const useAbsenceStats = (venueId: string, filters?: { startDate?: string; endDate?: string }) => {
  return useQuery({
    queryKey: ['absences', venueId, 'stats', filters],
    queryFn: () => absencesApi.getStats(venueId, filters),
    enabled: !!venueId,
  });
};

