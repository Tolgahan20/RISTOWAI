import { useQuery } from '@tanstack/react-query';
import { venuesApi } from '../api';

export const useVenueDetail = (restaurantId: string, venueId: string) => {
  return useQuery({
    queryKey: ['venue', restaurantId, venueId, 'with-staff'],
    queryFn: () => venuesApi.getVenueWithStaff(restaurantId, venueId),
    enabled: !!restaurantId && !!venueId,
  });
};

