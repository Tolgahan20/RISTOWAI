import { useState, useEffect } from 'react';
import { useVenues } from '@/features/smart-shifts/venues/hooks';
import { useVenueStore } from '@/stores/venueStore';
import type { Staff } from '@/features/smart-shifts/staff/types';

type ViewMode = 'table' | 'stats';

export const useStaffManagement = () => {
  const { data: venues = [], isLoading: venuesLoading } = useVenues();
  const { selectedVenueId, setSelectedVenueId } = useVenueStore();
  const [selectedStaff, setSelectedStaff] = useState<Staff | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('table');

  // Auto-select first venue if none selected and venues are loaded
  useEffect(() => {
    if (!selectedVenueId && venues.length > 0) {
      setSelectedVenueId(venues[0].id);
    }
  }, [venues, selectedVenueId, setSelectedVenueId]);

  const handleAdd = () => {
    setSelectedStaff(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (staff: Staff) => {
    setSelectedStaff(staff);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStaff(undefined);
  };

  return {
    venues,
    venuesLoading,
    selectedVenueId,
    setSelectedVenueId,
    selectedStaff,
    isModalOpen,
    viewMode,
    setViewMode,
    handleAdd,
    handleEdit,
    handleCloseModal,
  };
};

