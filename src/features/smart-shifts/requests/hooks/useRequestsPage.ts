import { useState, useEffect } from 'react';
import { useVenues } from '@/features/smart-shifts/venues/hooks';
import { useStaff } from '@/features/smart-shifts/staff/hooks';
import { useVenueStore } from '@/stores/venueStore';
import type { Request } from '../types';
import type { Staff } from '@/features/smart-shifts/staff/types';

export const useRequestsPage = () => {
  const { data: venues = [], isLoading: venuesLoading } = useVenues();
  const { selectedVenueId, setSelectedVenueId } = useVenueStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<Request | undefined>();

  // Auto-select first venue if none selected
  useEffect(() => {
    if (venues.length > 0 && !selectedVenueId) {
      setSelectedVenueId(venues[0].id);
    }
  }, [venues, selectedVenueId, setSelectedVenueId]);

  // Fetch staff list for the selected venue
  const { data: staffResponse } = useStaff(selectedVenueId || '');

  // Modal handlers
  const handleOpenModal = (request?: Request) => {
    setEditingRequest(request);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingRequest(undefined);
    setIsModalOpen(false);
  };

  // Transform staff data for select options
  const staff = staffResponse?.data || [];
  const staffList = staff.map((s: Staff) => ({
    id: s.id,
    name: `${s.firstName} ${s.lastName}`,
  }));

  // Navigation helper
  const navigateToVenues = () => {
    window.location.href = '/dashboard/smart-shifts/venues';
  };

  // Get selected venue
  const selectedVenue = venues.find((v) => v.id === selectedVenueId);

  return {
    // Data
    venues,
    venuesLoading,
    selectedVenueId,
    setSelectedVenueId,
    selectedVenue,
    staffList,

    // Modal state
    isModalOpen,
    editingRequest,

    // Handlers
    handleOpenModal,
    handleCloseModal,
    navigateToVenues,
  };
};

