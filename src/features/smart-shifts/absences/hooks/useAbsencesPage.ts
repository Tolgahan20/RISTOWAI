import { useEffect } from 'react';
import { useVenues } from '@/features/smart-shifts/venues/hooks';
import { useVenueStore } from '@/stores/venueStore';
import { useStaff } from '@/features/smart-shifts/staff/hooks';

export const useAbsencesPage = () => {
  const { data: venues, isLoading: venuesLoading } = useVenues();
  const { selectedVenueId, setSelectedVenueId } = useVenueStore();

  // Fetch staff for the selected venue
  const { data: staffData } = useStaff(selectedVenueId || '', 1, 1000); // Get all staff for selector

  // Auto-select first venue if none selected
  useEffect(() => {
    if (!selectedVenueId && venues && venues.length > 0) {
      setTimeout(() => {
        setSelectedVenueId(venues[0].id);
      }, 0);
    }
  }, [venues, selectedVenueId, setSelectedVenueId]);

  // Transform staff data for the list
  const staffList = staffData?.data.map((staff) => ({
    id: staff.id,
    name: `${staff.firstName} ${staff.lastName}`.trim() || 'Senza nome',
  })) || [];

  // Navigation helper
  const navigateToVenues = () => {
    window.location.href = '/dashboard/smart-shifts/venues';
  };

  return {
    venues,
    venuesLoading,
    selectedVenueId,
    setSelectedVenueId,
    staffList,
    navigateToVenues,
  };
};

