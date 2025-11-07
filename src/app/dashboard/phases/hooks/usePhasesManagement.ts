import { useEffect } from 'react';
import { useVenues } from '@/features/smart-shifts/venues/hooks';
import { useVenueStore } from '@/stores/venueStore';

export const usePhasesManagement = () => {
  const { data: venues, isLoading: venuesLoading } = useVenues();
  const { selectedVenueId, setSelectedVenueId } = useVenueStore();

  // Auto-select first venue if none selected
  useEffect(() => {
    if (!selectedVenueId && venues && venues.length > 0) {
      setSelectedVenueId(venues[0].id);
    }
  }, [venues, selectedVenueId, setSelectedVenueId]);

  const navigateToVenues = () => {
    window.location.href = '/dashboard/venues';
  };

  return {
    venues,
    venuesLoading,
    selectedVenueId,
    setSelectedVenueId,
    navigateToVenues,
  };
};
