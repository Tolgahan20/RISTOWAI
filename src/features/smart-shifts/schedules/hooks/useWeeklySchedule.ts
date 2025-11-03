import { useQuery } from '@tanstack/react-query';
import { schedulesApi } from '../api';

export const useWeeklySchedule = (venueId: string | null, startDate: string) => {
  return useQuery({
    queryKey: ['weeklySchedule', venueId, startDate],
    queryFn: () => schedulesApi.getWeeklySchedule(venueId!, startDate),
    enabled: !!venueId && !!startDate,
  });
};

