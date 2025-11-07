import { useQuery } from '@tanstack/react-query';
import { aiSchedulerApi } from '../api';
import type { CheckAvailabilityRequest } from '../types/availability';

export const useStaffAvailability = (
  request: CheckAvailabilityRequest,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: ['staffAvailability', request.venueId, request.startDate, request.endDate],
    queryFn: () => aiSchedulerApi.checkAvailability(request),
    enabled: enabled && !!request.venueId && !!request.startDate && !!request.endDate,
  });
};

