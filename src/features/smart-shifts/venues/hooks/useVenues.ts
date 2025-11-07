import { useQuery } from '@tanstack/react-query';
import { venuesApi } from '../api';
import { useRestaurantId } from '../../auth/hooks';

export const useVenues = () => {
  const restaurantId = useRestaurantId();

  return useQuery({
    queryKey: ['venues', restaurantId],
    queryFn: () => venuesApi.getVenues(restaurantId!),
    enabled: !!restaurantId,
  });
};

export const useVenue = (venueId: string) => {
  const restaurantId = useRestaurantId();

  return useQuery({
    queryKey: ['venue', restaurantId, venueId],
    queryFn: () => venuesApi.getVenueById(restaurantId!, venueId),
    enabled: !!restaurantId && !!venueId,
  });
};

export const useVenueWithStaff = (venueId: string) => {
  const restaurantId = useRestaurantId();

  return useQuery({
    queryKey: ['venue', restaurantId, venueId, 'staff'],
    queryFn: () => venuesApi.getVenueWithStaff(restaurantId!, venueId),
    enabled: !!restaurantId && !!venueId,
  });
};

