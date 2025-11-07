import { useQuery } from '@tanstack/react-query';
import { schedulesApi } from '../api';

export const useScheduleDetail = (venueId: string, scheduleId: string) => {
  return useQuery({
    queryKey: ['schedule', venueId, scheduleId],
    queryFn: () => schedulesApi.getScheduleById(venueId, scheduleId),
    enabled: !!venueId && !!scheduleId,
  });
};

