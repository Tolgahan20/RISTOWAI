import { useQuery } from '@tanstack/react-query';
import { venuesApi } from '../api';

export const useVenueWithMembers = (restaurantId: string, venueId: string) => {
  return useQuery({
    queryKey: ['venue', restaurantId, venueId, 'with-members'],
    queryFn: () => venuesApi.getVenueWithMembers(restaurantId, venueId),
    enabled: !!restaurantId && !!venueId,
  });
};

