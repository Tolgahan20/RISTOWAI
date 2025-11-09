import { useMutation, useQueryClient } from '@tanstack/react-query';
import { venuesApi } from '../api';
import { useRestaurantId } from '../../../auth/hooks';
import { useNotificationStore } from '../../common/stores/notification';
import { VENUE_MESSAGES } from '../../common/constants/messages';

export const useVenueDelete = () => {
  const restaurantId = useRestaurantId() || '';
  const queryClient = useQueryClient();
  const { showNotification } = useNotificationStore();

  const deleteMutation = useMutation({
    mutationFn: (venueId: string) => venuesApi.deleteVenue(restaurantId, venueId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['venues', restaurantId] });
      showNotification({ message: VENUE_MESSAGES.delete.success, type: 'success' });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      const message = err.response?.data?.message?.includes('active staff')
        ? VENUE_MESSAGES.delete.hasStaff
        : VENUE_MESSAGES.delete.error;
      showNotification({ message, type: 'error' });
    },
  });

  const handleDelete = (venueId: string) => {
    deleteMutation.mutate(venueId);
  };

  return {
    handleDelete,
    isDeleting: deleteMutation.isPending,
  };
};

