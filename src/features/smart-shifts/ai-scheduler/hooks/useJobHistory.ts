import { useQuery } from '@tanstack/react-query';
import { aiSchedulerApi } from '../api';

interface JobHistoryFilters {
  limit?: number;
  status?: string;
  venueId?: string;
  startDate?: string;
  endDate?: string;
}

export const useJobHistory = (filters?: JobHistoryFilters) => {
  return useQuery({
    queryKey: ['jobHistory', filters],
    queryFn: () => aiSchedulerApi.getMyJobs(filters),
    refetchInterval: 30000, // Refetch every 30 seconds to show latest status
  });
};

