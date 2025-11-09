import { useQuery } from '@tanstack/react-query';
import { fairnessApi } from '../api/fairnessApi';
import type { GetFairnessStatsParams } from '../types';

export const useFairnessStats = (params: GetFairnessStatsParams) => {
  return useQuery({
    queryKey: ['fairness-stats', params.venueId, params.startDate, params.endDate],
    queryFn: () => fairnessApi.getFairnessStats(params),
    enabled: !!params.venueId && !!params.startDate && !!params.endDate,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

