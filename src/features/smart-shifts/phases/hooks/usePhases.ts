import { useQuery } from '@tanstack/react-query';
import { phasesApi } from '../api';
import type { PhaseFilters } from '../types';

export const usePhases = (venueId: string) => {
  return useQuery({
    queryKey: ['phases', venueId],
    queryFn: () => phasesApi.getAll(venueId),
    enabled: !!venueId,
  });
};

export const usePhasesPaginated = (
  venueId: string,
  page: number,
  limit: number,
  filters?: PhaseFilters
) => {
  return useQuery({
    queryKey: ['phases', venueId, 'paginated', page, limit, filters],
    queryFn: () => phasesApi.getPaginated(venueId, page, limit, filters),
    enabled: !!venueId,
  });
};

export const usePhaseById = (venueId: string, phaseId: string) => {
  return useQuery({
    queryKey: ['phases', venueId, phaseId],
    queryFn: () => phasesApi.getById(venueId, phaseId),
    enabled: !!venueId && !!phaseId,
  });
};

export const usePhaseStats = (venueId: string) => {
  return useQuery({
    queryKey: ['phases', venueId, 'stats'],
    queryFn: () => phasesApi.getStats(venueId),
    enabled: !!venueId,
  });
};

export const usePhaseOverlaps = (venueId: string) => {
  return useQuery({
    queryKey: ['phases', venueId, 'overlaps'],
    queryFn: () => phasesApi.getOverlaps(venueId),
    enabled: !!venueId,
  });
};

