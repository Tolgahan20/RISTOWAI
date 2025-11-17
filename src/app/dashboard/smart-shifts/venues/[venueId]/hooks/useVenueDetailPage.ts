import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useVenueDetail } from '@/features/smart-shifts/venues/hooks';
import { useRestaurantId } from '@/features/auth/hooks/useRestaurantId';

export const useVenueDetailPage = (venueId: string) => {
  const router = useRouter();
  const restaurantId = useRestaurantId() || '';
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: venue, isLoading, isError, refetch } = useVenueDetail(restaurantId, venueId);

  const handleOpenEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEdit = () => {
    setIsEditModalOpen(false);
    refetch(); // Refresh venue data after edit
  };

  const handleBack = () => {
    router.back();
  };

  const handleNavigateToStaff = () => {
    window.location.href = `/dashboard/smart-shifts/staff?venueId=${venueId}`;
  };

  return {
    venue,
    isLoading,
    isError,
    refetch,
    isEditModalOpen,
    handleOpenEdit,
    handleCloseEdit,
    handleBack,
    handleNavigateToStaff,
  };
};

