import { useQuery } from '@tanstack/react-query';
import { schedulesApi } from '../api';

export const useSchedules = (venueId: string) => {
  return useQuery({
    queryKey: ['schedules', venueId],
    queryFn: () => schedulesApi.getSchedules(venueId),
    enabled: !!venueId,
  });
};

