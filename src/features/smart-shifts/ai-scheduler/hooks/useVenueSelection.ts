import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { venuesApi } from '../../venues';
import { useRestaurantId } from '../../../auth/hooks';
import { useVenueStore } from '@/stores/venueStore';

export const useVenueSelection = () => {
  const restaurantId = useRestaurantId();
  const { selectedVenueId, setSelectedVenueId } = useVenueStore();

  const { data: venues, isLoading: isLoadingVenues, error } = useQuery({
    queryKey: ['venues', restaurantId],
    queryFn: () => venuesApi.getVenues(restaurantId!),
    enabled: !!restaurantId, // Only run query if we have a restaurantId
  });

  // Auto-select first venue if none selected
  useEffect(() => {
    if (!selectedVenueId && venues && venues.length > 0) {
      setSelectedVenueId(venues[0].id);
    }
  }, [venues, selectedVenueId, setSelectedVenueId]);

  // Show loading if we don't have restaurantId yet OR if the query is loading
  const isLoading = !restaurantId || isLoadingVenues;

  return {
    venues: venues || [],
    selectedVenueId: selectedVenueId || '',
    setSelectedVenueId,
    isLoading,
    error,
    restaurantId,
  };
};

