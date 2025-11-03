import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { venuesApi } from '../../venues';
import { useRestaurantId } from '../../auth/hooks';

export const useVenueSelection = () => {
  const [selectedVenueId, setSelectedVenueId] = useState<string>('');
  const restaurantId = useRestaurantId();

  const { data: venues, isLoading: isLoadingVenues, error } = useQuery({
    queryKey: ['venues', restaurantId],
    queryFn: () => venuesApi.getVenues(restaurantId!),
    enabled: !!restaurantId, // Only run query if we have a restaurantId
  });

  // Show loading if we don't have restaurantId yet OR if the query is loading
  const isLoading = !restaurantId || isLoadingVenues;

  return {
    venues: venues || [],
    selectedVenueId,
    setSelectedVenueId,
    isLoading,
    error,
    restaurantId,
  };
};

