import { useQuery } from '@tanstack/react-query';
import { staffApi } from '../api';

export const useStaffStats = (venueId: string) => {
  return useQuery({
    queryKey: ['staffStats', venueId],
    queryFn: () => staffApi.getStaffStats(venueId),
    enabled: !!venueId,
  });
};

